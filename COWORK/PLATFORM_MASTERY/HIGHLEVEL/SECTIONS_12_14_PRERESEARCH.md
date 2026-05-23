# Sections 12 & 14 Pre-Research

**Last Updated:** 2026-04-17
**Purpose:** Consolidated findings from 8 WebFetches targeting Sections 12 (Workflows — Appointment & Purchase) and 14 (Workflows — Commerce + Missed-Call Text-Back). Used as reference when these sections unblock post-Q-batch-return.

---

## Section 12 — Workflows: Appointment & Purchase (4 workflows)

### Workflow #1 — Appointment Confirmation + Reminder Sequence

**Depends on:** Section 9 (Calendars) — BLOCKED on Q5.

**Trigger:** Appointment Booked event (HighLevel-native trigger). Fires when any booking occurs on any calendar in the sub-account.

**Key action for auto-booking case (if applicable):** Book Appointment action (155000004209) — creates new appointments on selected calendar. Supports:
- Calendar selection
- Team Member: Calendar Default (round-robin) OR specific user
- Date/Time: fixed OR dynamic (mapped from trigger data; MM-DD-YYYY HH:MM or DD-MMM-YYYY HH:MM formats; use Date Time Formatter if raw data differs)
- Override Availability toggle (bypasses availability validation if ON)
- Cannot target calendars with Recurring enabled
- Branching on "Appointment booked successfully" True/False for failure handling

**Workflow structure:**
1. Trigger: Appointment Booked (Services calendar: Custom Order Consultation OR Catering Tasting).
2. Wait 5 minutes (enrichment).
3. Send Email — Confirmation with appointment details (date/time, location, what to bring/know).
4. Wait until 24 hours before appointment start time (relative-time wait).
5. Send SMS — 24h reminder.
6. Wait until 2 hours before appointment start time.
7. Send SMS — Day-of reminder with address.
8. Wait until 2 hours after appointment end time.
9. Add tag `behavior:appointment-completed` (optional — triggers Review Request workflow).
10. End.

**Gotchas:** Relative-time waits reference appointment start time; ensure HighLevel exposes `{{appointment.start_time}}` merge field and wait-until-merge-field support in live UI (UI-VERIFY).

### Workflow #2 — Post-Purchase Thank-You

**Depends on:** Section 7 (Stripe + Products) — BLOCKED on Q3. Section 15 (Invoices) downstream.

**Trigger:** Payment Received (48001238334) — covers all incoming payments across CRM (invoices, funnels, websites, calendars, text2pay). Filter by:
- Payment source (invoice / funnel / calendar / text2pay)
- Sub-source (1-step form / 2-step form / upsell / recurring template)
- Transaction type (customer-present OR customer-absent)
- Specific product
- Payment status (success / failed)
- Amount (if/else conditions)

**Data exposed:** transaction ID, currency, gateway, card last 4, customer fields (name/email/phone/address), invoice fields (number, amount, dates, URL).

**Workflow structure:**
1. Trigger: Payment Received, status = Success, source = Invoice OR calendar OR text2pay (exclude subscription recurring for this workflow — that's a separate flow).
2. Wait 1 minute.
3. Send Email — Branded receipt / thank-you with `{{invoice.url}}` + `{{contact.first_name}}` personalization.
4. Add tag `behavior:purchased`.
5. If/Else branch: was this the customer's FIRST purchase?
   - If yes: add tag `status:active-customer`; Wait 24 hours; Send Email — "What to expect next" onboarding touch.
   - If no: end.

**Gotchas:** Subscription initial payment vs. subsequent recurring fires the same trigger — use Transaction Type filter (customer-present vs customer-absent) to distinguish.

### Workflow #3 — Review Request (post-fulfillment)

**Depends on:** Section 11 (Reputation Management) — BLOCKED on Q4.

**Trigger (two options):**
- Option A: Opportunity moved to Won (Wholesale) or Event Delivered (Catering) stage.
- Option B: Appointment Completed + 2h wait (uses tag `behavior:appointment-completed` from Workflow #1).
- Option C: Feedback Survey submitted with NPS ≥ 9 (tag `interest:review-eligible`; Section 8 drives this).

Three parallel triggers converge on this workflow; configure as multi-trigger OR.

**Actions leverage Send Review Request workflow action:**
- Channel: SMS or Email (per contact's Preferred Contact Channel custom field).
- Platform: uses Review Request Balancing (155000004137) if configured at Settings → Reputation → Review Link (weighted 50/50 Google/FB default, customizable).
- Sender identity: if contact has Assigned User, review request appears to come from that user (Stacy/Josh); otherwise from sub-account default.

**Workflow structure:**
1. Trigger: any of the three enumerated.
2. Wait 2 hours (post-fulfillment, cooldown).
3. If/Else: Contact has `behavior:negative-feedback` tag?
   - If YES: end (do NOT request review from contacts who have flagged negative feedback — auto-pause pattern from Section 8's Negative Feedback Handler).
   - If NO: proceed.
4. Send Review Request (SMS preferred; Email fallback per Preferred Contact Channel).
5. Wait 7 days.
6. If/Else: review submitted (tag `behavior:review-submitted`)?
   - If YES: end.
   - If NO: Send Email follow-up — gentle nudge.
7. Wait 14 days.
8. End workflow regardless (don't over-contact).

### Workflow #4 — Negative Feedback Handler

**Depends on:** Section 8 (Feedback Survey — DONE) + Section 11 (Reputation infrastructure) — BLOCKED on Q4 for GBP-side integration.

**Trigger:** Contact tagged `behavior:negative-feedback` (from Feedback Survey NPS ≤ 6) OR Review Received with rating < 4 (Review Received trigger — 155000003873 — contactless trigger exposing rating, source, spam status).

**Workflow structure:**
1. Trigger: either of the two.
2. Send Internal Notification to Stacy + Josh (via Conversations Internal Chat OR email) — "Negative feedback flagged for contact / review received. Review needed."
3. Create Task assigned to Stacy — "Personally reach out to [contact] within 24 hours."
4. Pause any active Review Request workflow for this contact (prevent asking someone who just complained for a 5-star review).
   - Implementation: add tag `behavior:review-request-paused` → Workflow #3 checks for this tag in its If/Else gate.
5. Wait 7 days.
6. If/Else: Has Stacy noted a resolution in Opportunity/Contact notes?
   - If YES: remove `behavior:negative-feedback` tag; add `behavior:recovered`; end.
   - If NO: re-notify Stacy + Josh; extend pause 7 more days.
7. End workflow.

**Reviews AI interaction (Auto-Pilot caution):** Reviews AI (155000001074) in Auto-Pilot mode can respond to ANY review including 1-2-star. Recommended configuration for Caramel Oven: Auto-Pilot ON for 4-5 star reviews ONLY; Suggestive mode for 1-3 star (requires human approval before response goes public). Negative-review-handling is NOT explicit in HighLevel docs — flag UI-VERIFY at configuration time.

---

## Section 14 — Workflows: Commerce + Missed-Call Text-Back (2 workflows + bonus)

### Workflow #9 — Abandoned Cart / Order Form Abandonment

**Depends on:** Section 7 (Stripe/Products) + Section 8 (Forms). Q3 blocks Section 7.

**Key finding:** HighLevel has TWO distinct abandoned-cart surfaces:
1. **E-commerce Store Abandoned Checkout** (155000001718) — native, automatic. Configured at Payments → Settings → Notifications. Default 10-hour delay. **ONLY fires for E-commerce Store checkouts.** Funnel/Website order forms and Calendar-integrated payments do NOT trigger this.
2. **Custom Workflow Abandonment** — manual workflow needed for Funnel order forms, Calendar-payment abandonments, or multi-touch recovery sequences.

For Caramel Oven (not running full E-commerce Store in initial scope), **use Custom Workflow Abandonment**.

**Trigger:** Form Started (Custom Order Inquiry form OR Catering Inquiry form from Section 8) but not submitted within 30 minutes. HighLevel may expose this via a "Form View" or "Form Started" trigger (UI-VERIFY); if not, fallback is a Page View trigger with a wait-for-completion check.

**Workflow structure:**
1. Trigger: Form Started + 30-minute wait without submission.
2. Check: has contact been identified (email captured)?
   - If NO: end (no way to reach them).
   - If YES: proceed.
3. Send Email — "Noticed you were looking at [product/service] — questions?" with direct link back to the form.
4. Wait 24 hours.
5. If contact submitted form in interim: exit.
6. Send SMS (if SMS opt-in): "Hi [name], still interested in [product/service]? Reply with questions or book a chat: [booking link]."
7. Wait 72 hours.
8. End.

**Constraint:** HighLevel's native abandoned-checkout allows only ONE automated notification per cart abandonment. Custom workflows can bypass this limit.

### Workflow #10 — GBP Review Response (Reviews AI-driven)

**Depends on:** Section 11 (Reputation + GBP integration) — BLOCKED on Q4.

**Two implementations possible:**

**Implementation A — Reviews AI Auto-Pilot (recommended):**
- Settings → Reputation / Reviews AI → enable Auto-Pilot.
- Configure per-star-rating response:
  - 5-star: standard thank-you response; personalized footer with `{{custom_values.business_name}}`.
  - 4-star: warm thank-you with invitation to DM for feedback.
  - 3-star and below: Suggestive mode (not Auto-Pilot) — human approval required.
- Configure wait time (HighLevel default: TBD — UI-VERIFY).

**Implementation B — Workflow-driven (more control):**
- Trigger: Review Received (155000003873) — contactless trigger exposing rating, source (Google/Facebook), spam status.
- If/Else branch on rating:
  - 5-star AND NOT spam → action: Reply to Review via Reviews AI Suggestive generation + auto-post OR use a pre-templated response.
  - 4-star → same but different template.
  - ≤3-star OR spam → action: Send Internal Notification to Stacy + Josh for human response.

**Recommended for Caramel Oven:** hybrid — Auto-Pilot for 4-5 star (volume, low risk); Workflow-driven escalation for ≤3 star.

**Review Request Balancing (155000004137) note:** Applies to outgoing review requests (balance between Google and Facebook via Reputation > Settings > Review Link). Does NOT affect Review Response workflows — those route based on where the review was received.

### Bonus — Missed-Call Text-Back (already built in Section 4)

No additional workflow work in Section 14 — Missed-Call Text-Back is a Sub-Account Setting, not a Workflow. Activates on SMS-unlock from A2P approval.

---

## Summary — what's blocked vs. what's ready

| Workflow | Depends on | Ready to write when |
|---|---|---|
| W#1 Appointment Confirmation + Reminder | Section 9 (Q5) | Q5 answered → Section 9 written |
| W#2 Post-Purchase Thank-You | Section 7 (Q3) | Q3 answered → Section 7 written |
| W#3 Review Request | Section 11 (Q4) | Q4 answered → Section 11 written |
| W#4 Negative Feedback Handler | Section 8 ✓ + Section 11 (Q4) | Q4 answered → Section 11 written |
| W#9 Abandoned Cart | Section 7 (Q3) + Section 8 ✓ | Q3 answered → Section 7 written |
| W#10 GBP Review Response | Section 11 (Q4) | Q4 answered → Section 11 written |

**Critical observation:** Section 11 (Reputation on Q4) unblocks 3 of 6 workflows. Section 7 (Stripe on Q3) unblocks 2 of 6. Prioritize Q4 and Q3 answer-gathering in the Stacy/Josh batch.

**Research gaps to resolve at write time:**
- Negative-review handling in Reviews AI Auto-Pilot (docs don't specify; UI-VERIFY).
- Form Started / Form Abandonment trigger existence in HighLevel (research suggested it but not confirmed; may need custom trigger pattern).
- Relative-time wait against appointment.start_time merge field (probably supported; UI-VERIFY).
- Database Reactivation article body unavailable (48001162999 rendered empty); existing Section 13 Dormant Reactivation pattern covers this adequately.

Pre-research estimated time saved on Sections 12/14 write: **~2-3 hours of research compressed into ~30 minutes of write-only.**

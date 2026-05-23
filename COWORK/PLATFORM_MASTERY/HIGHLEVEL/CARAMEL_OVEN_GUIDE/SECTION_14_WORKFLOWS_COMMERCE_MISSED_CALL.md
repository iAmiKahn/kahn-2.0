# Section 14 — Workflows: Commerce + Missed-Call Text-Back

**Last Updated:** 2026-04-19
*If HighLevel UI doesn't match these instructions, consult the Update Protocol (Phase 5.2). This guide targets the HighLevel platform as of 2026-04-19.*

---

## Purpose

Build the two remaining workflows that handle commerce-adjacent moments (abandoned cart recovery and GBP review response) plus expand the Missed-Call Text-Back pattern from Section 4 into a conditional workflow that handles office-hours vs after-hours intelligently.

**Estimated time:** 45-60 minutes.

**Dependencies:**
- Sections 5, 7, 8, 11 complete.
- Section 4 Missed-Call Text-Back configured (Section 14 expands it with conditional logic).

---

## Why this section matters

Section 12 covered happy-path transactions. Section 14 covers the edges: the customer who started an order but didn't finish, the Google review that needs a response, the missed call at 9pm when the bakery is closed. Each is a specific failure mode with a specific recovery pattern.

Three non-obvious principles:

1. **Abandoned cart recovery in HighLevel has a bifurcation.** Native E-commerce Store abandoned-cart is automatic but ONLY fires for Store checkouts. Caramel Oven uses Funnel + Calendar payments, so we build a custom workflow.
2. **Reviews AI handles response generation; Workflow #10 handles routing.** The workflow decides whether Auto-Pilot fires or escalation happens. Section 11 set up the AI; Section 14 wires the decision tree.
3. **Missed-Call Text-Back in office hours reads differently than after-hours.** Section 4's static template is fine as a fallback; Section 14 makes it smart.

---

## What you will produce

1. **Workflow #9 — Abandoned Cart / Form Abandonment** (custom workflow for Funnel/Calendar abandonment since Caramel Oven isn't running E-commerce Store natively).
2. **Workflow #10 — GBP Review Response Routing** (Reviews AI decision tree per Section 11 Step 3.3).
3. **Workflow #11 — Missed-Call Text-Back (Smart)** (expands Section 4's static reply with office-hours vs after-hours branching).

All three grouped in a new folder: **"Commerce & Recovery"**.

---

## Workflow #9 — Abandoned Cart / Form Abandonment

**Purpose:** Recover Caramel Oven customers who started an order form or payment link but didn't complete purchase.

**Context (from pre-research):** HighLevel's native abandoned-checkout automation (Payments → Settings → Notifications) only fires for E-commerce Store checkouts. Caramel Oven's primary commerce path is Funnel-based order forms + Payment Links + Calendar-booking deposits — none of which trigger the native handler. A custom workflow closes the gap.

**Trigger:**
- **Event:** Form Started (Custom Order Inquiry form OR Catering Inquiry form from Section 8) — "Form Started" event fires on page-visit with email capture, without form submission.
- **Enrollment filter:** Contact has email captured AND form was NOT submitted within 30 minutes of start AND contact does NOT have tag `behavior:purchased` in the last 24 hours.

**Actions:**

1. **Wait 30 minutes** from trigger time. If contact completes the form during this wait, the workflow exits via built-in completion-check OR via `behavior:form-submitted` tag check.
2. **If/Else — Did the contact complete the form?**
   - **Completed:** End workflow.
   - **Not completed:** proceed.
3. **Send Email — Gentle nudge:**
   - Subject: *"Hey {{contact.first_name}} — looks like you started a Caramel Oven order"*
   - Body:

> Hi {{contact.first_name}},
>
> Stacy here. Noticed you were starting a {{custom_values.form_type_from_source}} but didn't get a chance to finish — did something get in the way?
>
> If you have questions about what you were ordering, just reply here and I'll walk through it.
>
> If you'd like to pick back up where you left off:
> {{custom_values.form_resume_link}}
>
> No pressure either way.
>
> — Stacy
> Caramel Oven Bakehouse

4. **Wait 24 hours.**
5. **If/Else — Still not submitted?**
   - **Submitted during wait:** End.
   - **Still abandoned:** proceed.
6. **Send SMS — Day 1 follow-up** (fires when SMS is unlocked post-A2P):
   - Copy: *"Hi {{contact.first_name}}, Stacy at Caramel Oven — still interested in placing an order? Reply with questions or finish here: {{custom_values.form_resume_link}}. Reply STOP to unsubscribe."*
7. **Wait 72 hours.**
8. **If/Else — Submitted?**
   - **YES:** End; add tag `behavior:recovered-abandonment`.
   - **NO:** End; add tag `behavior:abandoned-unrecovered` for future Smart List segmentation.

**Settings:**
- Re-enrollment: allowed after 14 days (customer may abandon a new form later; we want to re-engage that).
- The `custom_values.form_resume_link` is populated per form — set in Section 8 Form Settings as a link that reopens the form with pre-filled customer data.

**Expected volume:** variable. For Caramel Oven at launch, likely 1-5 abandonments/week until traffic scales.

---

## Workflow #10 — GBP Review Response Routing

**Purpose:** Every incoming Google or Facebook review triggers a routing decision: 4-5 star → Reviews AI Auto-Pilot (handled by Section 11's configuration — workflow mostly passive). 1-3 star → escalation + Suggestive-mode draft + owner approval gate.

Section 11 already configured Reviews AI per-star response strategy. Workflow #10 adds the escalation + internal notification + tag application on top.

**Trigger:**
- **Event:** Review Received (contactless trigger from Section 11).
- **Data exposed:** rating, source (Google / Facebook), reviewer name, review text, spam status.

**Actions:**

1. **If/Else — Rating?**
   - **5-star AND NOT spam:** Add tag `review:received-5star` to sub-account-level stats Contact (if HighLevel allows; otherwise log-only). Reviews AI Auto-Pilot handles the response per Section 11. End workflow.
   - **4-star AND NOT spam:** Same as 5-star. Reviews AI Auto-Pilot responds. End.
   - **3-star AND NOT spam:** Section 11's Suggestive mode drafts response. Send Internal Notification to Stacy + Josh: *"3-star review received from [reviewer] on [platform]. Reviews AI drafted a response; please review and post. Review text: [body]."* Create Task assigned to Stacy: *"Review + approve 3-star review response."*
   - **1-2 star AND NOT spam:** escalation path — see Step 2.
   - **Spam-flagged:** Send Internal Notification: *"Spam review flagged. Evaluate for dispute at Google."* End workflow; no automated response.
2. **1-2 star path (continues):**
   - Send Internal Notification (high-priority) to Stacy + Josh.
   - Create Task: *"HIGH PRIORITY: 1-2 star review from [reviewer] on [platform]. Personally respond + reach out to reviewer if possible within 24 hours."*
   - Do NOT post the Suggestive-mode draft automatically. Stacy/Josh review and personally respond.
   - If the reviewer is a known contact (match by name or email if they provided it): enroll the contact in Workflow #4 (Negative Feedback Handler) via tag `behavior:negative-feedback`. This chains Workflow #4's recovery process.
3. End workflow.

**Settings:**
- Re-enrollment: allowed (each new review fires fresh).

**Expected volume:** 5-30 reviews/month once Caramel Oven is at scale. Most will be 4-5 star; the 1-3 star tail is what matters operationally.

---

## Workflow #11 — Missed-Call Text-Back (Smart)

**Purpose:** Section 4 Step 3 configured a static auto-reply to every missed call. This workflow layers in office-hours awareness so the response matches context.

**Context:** The Sub-Account setting from Section 4 is Caramel Oven's backstop — if Workflow #11 fails or is disabled, the static reply still fires. Workflow #11 is an additive enhancement.

**Trigger:**
- **Event:** Call Ended with Status = Missed (inbound call that wasn't answered).

**Actions:**

1. **If/Else — Is it currently within business hours?** (Use HighLevel's time-based If/Else condition pulling from `custom_values.business_hours`.)
   - **During business hours:** Send SMS: *"Hi! This is Caramel Oven — sorry we missed your call. We're in the kitchen and may be elbow-deep in flour. How can we help? Reply here and we'll answer as soon as we can. Reply STOP to unsubscribe."*
   - **After business hours:** Send SMS: *"Caramel Oven Bakehouse here — sorry we missed you. We're closed right now but we'll get back to you in the morning. Reply here with your question and we'll answer first thing. Reply STOP to unsubscribe."*
2. **Wait 4 hours** (gives time for the customer to reply).
3. **If/Else — Did the customer reply to the SMS?**
   - **YES:** End workflow. The conversation is live in Conversations inbox; Stacy or Josh handles it there.
   - **NO (no reply, didn't respond):** Create Task assigned to round-robin (Stacy primary / Josh backup): *"Missed call from {{contact.phone}} at {{call.timestamp}} — no response to auto-reply. Consider personal callback."*
4. End workflow.

**Settings:**
- Re-enrollment: allowed (each missed call is a separate event).
- **Does NOT interfere with Section 4 Sub-Account Missed-Call Text-Back setting** — the Sub-Account setting is the default reply; this workflow runs in ADDITION. Verify no double-send. [UI-VERIFY: does the Sub-Account setting auto-suppress when a Workflow also replies? If not, disable the Sub-Account setting once Workflow #11 publishes.]

**Expected volume:** unknown pre-launch; typical for a small bakery is 3-15 missed calls/week.

---

## Step 1 — Create the folder + build workflows

1. Automation → Workflows → + New Folder → **"Commerce & Recovery"**.
2. Build each workflow per the specs above. Use Section 13 Step 1 orientation patterns.
3. Test each end-to-end:
   - Workflow #9: submit a test Custom Order Inquiry, abandon before submission, verify Day 30-min nudge email fires.
   - Workflow #10: leave a test review on the GBP (ask a friend; simulate). Verify routing per rating tier.
   - Workflow #11: ignore a test call to the LC Phone number. Verify in-hours vs after-hours response.
4. Publish all three.

---

## Step 2 — Verify Missed-Call interaction with Section 4 Sub-Account setting

Critical: the Section 4 Sub-Account-level Missed-Call Text-Back and Workflow #11 may both fire on the same event. Test:

1. From a personal cell, call the LC Phone number. Do not answer.
2. Within 5 minutes, check: did you receive ONE text-back or TWO?
3. If ONE: Sub-Account setting may have been suppressed by the Workflow's Send SMS action, OR vice versa. Acceptable.
4. If TWO: customer receives duplicate messages. Disable the Sub-Account Missed-Call setting and let Workflow #11 be the sole responder.

Document the outcome in the Intake Document.

---

## Completion criteria

1. ✅ "Commerce & Recovery" folder created.
2. ✅ Workflow #9 Abandoned Cart / Form Abandonment built, tested, published.
3. ✅ Workflow #10 GBP Review Response Routing built, tested, published.
4. ✅ Workflow #11 Missed-Call Text-Back (Smart) built, tested, published.
5. ✅ Interaction between Section 4 Sub-Account setting + Workflow #11 verified (single text-back per missed call).
6. ✅ Intake Document updated.

---

## What happens next

**Section 15 — Invoices, Payment Links, Documents & Contracts** is the next write. Commerce infrastructure that workflows here can reference (Workflow #2 Post-Purchase Thank-You uses invoice data; Workflow #9 Abandoned Cart references the form-resume links built in Section 8 and points at Section 15 payment pages).

---

## Flags for this section

- **Assumptions made:** (a) Form Started trigger exists in HighLevel — pre-research suggested it but needs UI-VERIFY; fallback is Page View trigger with form-visit filter. (b) `custom_values.form_resume_link` requires Section 8 to expose a resume-link mechanism — may need to generate per-form on form-save; UI-VERIFY. (c) Missed-Call Workflow supplements vs supplants Section 4 setting — test in Step 2 determines which.
- **Gaps identified:** UI-VERIFY flags on Form Started trigger, form-resume-link generation, Review Received trigger, Call Ended trigger with Status=Missed filter, time-based If/Else against Custom Value hours.
- **Competing approaches:** (a) Native E-commerce Store abandoned-cart vs custom workflow — chose custom because Caramel Oven isn't running E-commerce Store; (b) Single Review Response workflow with 4 rating branches vs per-rating separate workflows — chose single for maintainability; (c) Office-hours-aware Missed-Call response vs static — chose aware for operational polish.
- **Client-side blockers:** None beyond GBP verification (Section 11 Step 9) gating Workflow #10 live-fire.
- **Platform-level irreversible decisions:** None.

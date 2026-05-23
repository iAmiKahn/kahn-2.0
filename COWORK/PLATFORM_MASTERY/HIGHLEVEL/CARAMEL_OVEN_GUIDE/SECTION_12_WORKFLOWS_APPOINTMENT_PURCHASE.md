# Section 12 — Workflows: Appointment + Purchase

**Last Updated:** 2026-04-19
*If HighLevel UI doesn't match these instructions, consult the Update Protocol (Phase 5.2). This guide targets the HighLevel platform as of 2026-04-19.*

---

## Purpose

Build the four workflows that handle Caramel Oven's transactional customer moments — when someone books an appointment, when they pay, when fulfillment completes, and when something goes wrong. These are the workflows that turn single transactions into multi-touch relationships.

**Estimated time:** 60-90 minutes. Four workflows at roughly 15-20 minutes each.

**Dependencies:**
- Section 5 (custom fields + tags) ✓
- Section 7 (Stripe + Products) ✓
- Section 8 (Forms + Feedback Survey) ✓
- Section 9 (Calendars + Services) ✓
- Section 11 (Reputation + `custom_values.review_link`) ✓ (GBP may still be pending postcard-verification; workflow builds now, live-fires after GBP verifies)
- Section 13 (Workflows: Lead Nurture) built — workflows coordinate (e.g., Workflow #3 Review Request pauses if `behavior:negative-feedback` tag present)

---

## Why this section matters

Section 13 (Lead Nurture) handles the top of the funnel. Section 12 handles the middle and the end: the customer who actually books, pays, and experiences Caramel Oven's product. Done right, every paying customer gets:

- Confirmation they're on the calendar (anti-anxiety).
- Reminders so they show up (anti-no-show).
- A thank-you after payment (reinforces the relationship).
- A review request after fulfillment (compound SEO).
- If they rate ≤ 6 NPS or leave a 1-2 star review: personal outreach from Stacy instead of silence.

Four workflows. Each is small. Cumulatively they're the customer-experience backbone.

---

## What you will produce

1. **Workflow #1 — Appointment Confirmation + Reminder** (fires on any Section 9 Service booking)
2. **Workflow #2 — Post-Purchase Thank-You** (fires on any Stripe payment received)
3. **Workflow #3 — Review Request** (fires post-fulfillment / post-high-NPS)
4. **Workflow #4 — Negative Feedback Handler** (fires on negative-feedback tag OR low-rating review received)

All four are grouped in a new folder: **"Appointment & Purchase"** (sibling to the "Lead Nurture" folder from Section 13).

---

## Workflow #1 — Appointment Confirmation + Reminder

**Purpose:** Confirm every Section 9 Service booking immediately, remind the customer ahead of the appointment, and flag post-appointment so the Review Request workflow can enroll.

**Trigger:**
- **Event:** Appointment Booked.
- **Filter:** Appointment is on any of the 4 Services from Section 9 (Custom Order Consultation · Event Dessert Consultation · Bulk Order Pickup Window · Wholesale Sample Meeting).

**Actions:**

1. **Wait 5 minutes** — enrichment buffer.
2. **Send Email — Confirmation:**
   - Subject: *"Your {{appointment.title}} is on the calendar — {{appointment.start_time}}"*
   - Body: confirms date, time, location (pulls from Service setup — in-person OKC address or Zoom link), what to expect ("I'll bring 4-6 samples for us to taste" for Event Dessert Consultation, etc. — vary copy per Service), cancellation link, Stacy's signoff.
3. **If/Else branch — Service-specific wait:**
   - **Branch A (Custom Order Consultation · Event Dessert Consultation):** Wait until **24 hours before `{{appointment.start_time}}`** → Send SMS reminder (*"Hi {{contact.first_name}}, reminder: your consultation with Caramel Oven is tomorrow at {{appointment.start_time_short}}. Address/link: {{appointment.location}}. Reply here with questions. Reply STOP to unsubscribe."*).
   - **Branch B (Bulk Order Pickup Window):** Wait until **2 hours before** → Send SMS (*"{{contact.first_name}}, order ready for pickup at {{appointment.start_time_short}}. Address: {{custom_values.business_address}}. See you soon!"*).
   - **Branch C (Wholesale Sample Meeting):** Wait until **24 hours before** → Send Email (more formal tone for B2B) + SMS reminder.
4. **Wait until 2 hours after `{{appointment.end_time}}`** — appointment should now be complete.
5. **Add Tag** `behavior:appointment-completed`.
6. **If/Else:** Service type?
   - **Custom Order Consultation** OR **Event Dessert Consultation** → Add Tag `interest:review-eligible` (feeds Workflow #3).
   - **Bulk Order Pickup Window** → Add Tag `interest:review-eligible` IF `{{appointment.payment_amount}} ≥ $50` (meaningful transaction threshold).
   - **Wholesale Sample Meeting** → do NOT tag review-eligible (wholesale reviews are different loop).
7. End workflow.

**Settings:**
- Re-enrollment: allowed on new Appointment Booked (customer books multiple times = separate workflow runs).

**Expected volume:** every booking. For Caramel Oven at scale, 10-40 appointments/week.

---

## Workflow #2 — Post-Purchase Thank-You

**Purpose:** Every Stripe payment generates an immediate warm thank-you; first-time customers also get a "what to expect next" onboarding touch 24 hours later.

**Trigger:**
- **Event:** Payment Received.
- **Filter:** `Payment status = Success` AND `Transaction type = Customer-Present` (excludes subscription recurring renewals — those don't need a thank-you every cycle).

**Actions:**

1. **Wait 2 minutes** (enrichment).
2. **Send Email — Thank-You:**
   - Subject: *"Thanks, {{contact.first_name}} — order #{{invoice.number}}"*
   - Body: references the specific product(s) purchased (uses `{{invoice.items}}` merge field), pickup/delivery info, Stacy signoff. Pulls Brand Voice.
3. **Add Tag** `behavior:purchased`.
4. **If/Else — Is this their first purchase?** (Check: contact does NOT have `behavior:first-purchase-completed` tag.)
   - **Branch A (first purchase):**
     - Add tag `behavior:first-purchase-completed`.
     - Update tag `status:active-customer` (upgrade from `status:new-lead` if applicable).
     - **Wait 24 hours.**
     - **Send Email — "What to Expect":** (*"Hey {{contact.first_name}}, now that you've tried Caramel Oven, here's a few things: Saturday market updates by SMS if you opted in, monthly newsletter with seasonal bakes, and a customer-favorites Insta feed @caramelovenokc. If you loved what you got, tell a friend. — Stacy"*).
   - **Branch B (returning customer):**
     - End workflow.
5. End workflow.

**Settings:**
- Re-enrollment: allowed on each Payment Received.

**Expected volume:** every successful Stripe transaction.

---

## Workflow #3 — Review Request

**Purpose:** Ask satisfied customers for a Google review automatically. Route via SMS + Email based on their Preferred Contact Channel. Gate via `behavior:negative-feedback` — never request from someone who flagged negative.

**Triggers (multi-trigger OR):**
- **Trigger A:** Contact tagged `interest:review-eligible` (fires from Workflow #1 or Feedback Survey NPS 9-10).
- **Trigger B:** Opportunity stage changed to "Won" in Wholesale pipeline OR "Event Delivered" in Catering pipeline.

**Enrollment filter:** Contact does NOT have `behavior:negative-feedback` OR `behavior:review-request-paused`.

**Actions:**

1. **Wait 2 hours** (post-fulfillment cooldown; not too soon).
2. **If/Else — Re-check negative-feedback status** (defensive):
   - If `behavior:negative-feedback` tag present → end workflow silently.
   - Otherwise → continue.
3. **If/Else — Preferred Contact Channel:**
   - **SMS preferred:** Send Review Request SMS (Section 11 Step 4.2 template) via Send Review Request action. Platform: follows Review Request Balancing (Section 11 Step 5) — 70% Google / 30% Facebook.
   - **Email preferred:** Send Review Request Email (Section 11 Step 4.1 template).
   - **Any / Unknown:** Send both (email as primary + SMS 2-hour follow-up).
4. **Wait 7 days.**
5. **If/Else — Did contact leave a review?** (Check: contact has `behavior:review-submitted` tag — set by Section 11's review-received trigger / Reviews AI.)
   - **If YES:** End workflow. Add Tag `status:review-left`.
   - **If NO:**
     - **Send Email — Gentle follow-up:** (*"{{contact.first_name}}, one more ask — if you're willing to leave us a Google review, the link is here: {{custom_values.review_link}}. If you'd rather not, just ignore this and I won't bug you again. — Stacy"*).
6. **Wait 14 days.**
7. End workflow regardless — don't request more than twice.

**Settings:**
- Re-enrollment: NOT allowed from the same `interest:review-eligible` tag (tag persists; guard via "NOT already enrolled" check).
- Re-enrollment: ALLOWED on new Opportunity Won (wholesale/catering repeats warrant new request).

**Expected volume:** 5-20 review requests/week once Caramel Oven is at scale.

---

## Workflow #4 — Negative Feedback Handler

**Purpose:** When feedback goes bad, route to Stacy + Josh for personal handling. Auto-pause Review Request so we don't accidentally ask a detractor for a public review. Document follow-through.

**Triggers (multi-trigger OR):**
- **Trigger A:** Contact tagged `behavior:negative-feedback` (fires from Section 8 Feedback Survey NPS 0-6).
- **Trigger B:** Review Received with rating ≤ 2 stars (Section 11's Reviews AI Suggestive mode fires for 1-3 star; workflow picks up 1-2 star specifically for escalation).

**Actions:**

1. **Add Tag** `behavior:review-request-paused` (prevents Workflow #3 from re-requesting).
2. **Send Internal Notification** (via Conversations Internal Chat + email):
   - To: Stacy + Josh.
   - Subject: *"Negative feedback — {{contact.first_name}} {{contact.last_name}}"*
   - Body: contact details, timestamp, rating or NPS score, any text they submitted, link to their Contact record in HighLevel, suggested response tone.
3. **Create Task** assigned to Stacy:
   - Title: *"Personal outreach to {{contact.first_name}} — negative feedback"*
   - Due: 24 hours from now.
   - Description: *"This customer flagged dissatisfaction. Personal outreach (call or personal email) within 24 hours. Document the resolution in Contact Notes. Remove `behavior:negative-feedback` tag and add `behavior:recovered` when resolved."*
4. **Wait 7 days.**
5. **If/Else — Has Stacy documented resolution?** (Check: contact has `behavior:recovered` tag.)
   - **If YES:** Remove `behavior:negative-feedback` tag. Remove `behavior:review-request-paused`. End workflow.
   - **If NO:**
     - Send follow-up internal notification to Stacy + Josh: *"Still pending — {{contact.first_name}} feedback from 7 days ago. Status?"*
     - **Wait 7 more days.**
     - **If/Else again** — if still no resolution, create a Task for Josh: *"Escalation: check why {{contact.first_name}}'s negative feedback hasn't been addressed."*
6. End workflow.

**Settings:**
- Re-enrollment: allowed on new negative-feedback trigger (recovery + second incident = worth re-handling).

**Expected volume:** Low — 1-3 per month if product + service are working. High = signal of product/service problem that workflows can't solve; requires operator intervention.

---

## Step 1 — Create the folder

1. Automation → Workflows → Folders → **+ New Folder**.
2. Name: **"Appointment & Purchase"**.
3. Save.

---

## Step 2 — Build each workflow

Use the Workflow Builder orientation from Section 13 Step 1 (reusable pattern). For each workflow above:

1. Automation → Workflows → + Create Workflow.
2. Choose Start from Scratch.
3. Name per the spec (e.g., "Workflow #1 — Appointment Confirmation + Reminder").
4. Configure Trigger per spec.
5. Add Actions sequentially per spec. Use Section 13 patterns for If/Else + Wait + Send Email + Send SMS + Add Tag + Create Task + Send Internal Notification.
6. Save.
7. Move to "Appointment & Purchase" folder.
8. Click Test Workflow → run with a test contact → verify all branches fire correctly.
9. Toggle to Publish.

Repeat for all 4 workflows.

---

## Step 3 — Verify interlock with Section 13 workflows

Workflow #3 (Review Request) and Section 13's Feedback Survey routing share the `interest:review-eligible` tag. Confirm the tag chain works:

1. Submit a test Feedback Survey with NPS = 10 (from Section 8).
2. Verify `interest:review-eligible` tag lands on the test contact.
3. Verify Workflow #3 enrolls within minutes.
4. Verify Review Request SMS + Email fire.

Repeat for NPS = 4:
1. Verify `behavior:negative-feedback` tag lands.
2. Verify Workflow #4 enrolls.
3. Verify internal notification reaches Stacy + Josh.
4. Verify Task is created.

Delete test contact(s).

---

## Step 4 — Document in Intake Document

```
SECTION 12 STATUS
Folder: Appointment & Purchase
Workflows:
  #1 Appointment Confirmation + Reminder — PUBLISHED
  #2 Post-Purchase Thank-You — PUBLISHED
  #3 Review Request — PUBLISHED (live-fires after GBP verifies)
  #4 Negative Feedback Handler — PUBLISHED
Interlock tests: PASSED
```

---

## Completion criteria

1. ✅ "Appointment & Purchase" folder created.
2. ✅ All 4 workflows built per spec with correct triggers, actions, branches.
3. ✅ All 4 workflows tested (individual + interlock with Section 13).
4. ✅ All 4 workflows published.
5. ✅ Section 21 operator playbook updated with: Workflow #4 Task-assigned-to-Stacy escalation pattern; 7-day resolution checkpoint; recovery-tag workflow.

---

## What happens next

**Section 14 — Workflows: Commerce + Missed-Call Text-Back** is the next write. Covers Abandoned Cart recovery, GBP Review Response automation (for Caramel Oven-side proactive responses to incoming reviews), and the Missed-Call Text-Back pattern (already configured in Section 4 Step 3; Section 14 expands its logic via workflow).

---

## Flags for this section

- **Assumptions made:** (a) Appointment Confirmation workflow uses relative-time waits against `{{appointment.start_time}}` — HighLevel supports this per research; (b) First-purchase detection uses tag `behavior:first-purchase-completed` set inside the workflow itself — alternative is checking Stripe transaction history but tag-based is simpler; (c) Preferred Contact Channel routing in Workflow #3 respects customer preference; default SMS-preferred for 18-35 demographic, Email-preferred older; (d) Review Request 2-max rule (request + 1 gentle follow-up) avoids over-contact annoyance; (e) Workflow #4's 7-day recovery checkpoint + 14-day escalation is operator-friendly — adjustable.
- **Gaps identified:** UI-VERIFY flags on relative-time Wait configuration (hours vs business-hours), Create Task action assignee UX, Internal Notification delivery method (Conversations vs email), Review Received trigger field exposure for rating filter.
- **Competing approaches:** (a) Single workflow with all 4 patterns vs 4 separate workflows — chose 4 separate because triggers are materially different and folder grouping keeps them organized; (b) SMS-first-then-email vs email-first-then-SMS on Review Request — chose SMS-first (higher response rate) with email fallback; (c) Manual or automated review-link pasting — chose `{{custom_values.review_link}}` Custom Value (Section 11) for single source of truth.
- **Client-side blockers resolved:** none (all Q-batch resolved at Batch 1 delivery).
- **Client-side blockers remaining:** GBP postcard verification (Section 11 Step 9) gates Workflow #3's live firing — workflow builds now; first live review-request fires after GBP verifies.
- **Platform-level irreversible decisions:** None.

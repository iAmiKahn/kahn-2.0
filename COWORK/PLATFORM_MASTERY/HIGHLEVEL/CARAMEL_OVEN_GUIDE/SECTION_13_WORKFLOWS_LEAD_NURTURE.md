# Section 13 — Workflows: Lead Nurture

**Last Updated:** 2026-04-17
*If HighLevel UI doesn't match these instructions, consult the Update Protocol (Phase 5.2). This guide targets the HighLevel platform as of 2026-04-17.*

---

## Purpose

Build the five Lead Nurture workflows that carry leads from first touch through conversion and maintain customers before they churn. These workflows enroll from Section 6 Smart Lists, trigger on Section 8 form submissions and Section 10 pipeline stage changes, use Section 5 tags and custom fields, and send via Section 3 LC Email (SMS activates when Section 4 A2P approves).

**Estimated time:** 90-150 minutes. Each of 5 workflows is 15-30 minutes to configure.

**Dependencies:**
- Sections 5 (tags + custom fields), 6 (Smart Lists), 8 (forms), 10 (pipelines) — all COMPLETE.
- Section 3 (LC Email) — COMPLETE for email delivery.
- Section 4 (LC Phone + A2P) — submitted; SMS workflows build now but won't fire SMS until A2P approves.

**NOT blocked by:** Q1/Q2/Q3/Q4/Q5/Q6/Q7/Q9. This section proceeds entirely with current intake state.

---

## Why this section matters

New leads go cold in 48 hours if nothing reaches them. Inquiries go cold in 72. Dormant customers forget the brand in 60-90 days. Wholesale prospects ghost in 7. These are the windows automation must close — because manual follow-up, even with the best intentions, misses every one of them when the operator is busy.

Section 13 is the first section where Caramel Oven becomes self-operating. The forms from Section 8 capture leads; the pipelines from Section 10 structure deals; but it's the workflows HERE that make the system FOLLOW UP without Stacy or Josh having to remember.

**Three non-obvious principles govern Section 13:**

1. **Workflows are sub-account-scoped.** A workflow lives in ONE sub-account — triggered by events there, sending from there, reading tags there. No cross-tenant coupling.
2. **A workflow config doesn't require its delivery channels to be live.** Build now with LC Email + SMS actions; they execute when upstream (Section 3 email live, Section 4 SMS unlocked) is ready. Missed-Call Text-Back in Section 4 used the same pattern.
3. **If/Else branching keeps workflows simple AND keeps entry conditions tight.** Rather than one giant "Contact Did Something" workflow with 15 branches, prefer several smaller workflows with narrow triggers. Easier to audit. Easier to iterate.

---

## What you will produce

1. **Workflow #1 — New Lead Welcome** (fires on form submission from any Section 8 form; generic welcome sequence for cold leads)
2. **Workflow #2 — Wholesale Lead Nurture** (fires on Opportunity creation in Wholesale pipeline, Prospect stage; 2-touch B2B nurture)
3. **Workflow #3 — Catering Inquiry Nurture** (fires on Catering form submission; 3-touch sequence to convert inquiry to consult-booked)
4. **Workflow #4 — B2C Dormant Reactivation** (fires at 60-day dormancy for `segment:b2c-regular` contacts; single win-back email + SMS)
5. **Workflow #5 — Wholesale Check-In** (fires at cadence-aware dormancy for `segment:b2b-wholesale` contacts; operator-visible check-in trigger, cadence determined by Order Frequency Custom Field)

---

## Step 1 — Workflow Builder orientation

Skip this step if you've built HighLevel workflows before. It's here for VA onboarding completeness.

### 1.1 Where workflows live

**Path:** Automation → Workflows. [UI-VERIFY exact menu label]

### 1.2 How a workflow is built

Every workflow has three layers:

1. **Trigger** — what event enrolls a contact (form submission, tag added, appointment booked, pipeline stage changed, Smart List membership change, time-based, etc.). One trigger, or multiple triggers-as-OR.
2. **Actions** — sequential steps executed after enrollment (Send Email, Send SMS, Wait, If/Else, Update Contact Field, Add Tag, Create Task, Send Internal Notification, etc.).
3. **Settings** — exit conditions, re-enrollment rules, execution timezone, filters.

### 1.3 Build flow (for each workflow below)

1. Automation → Workflows → **+ Create Workflow**.
2. Choose **Start from Scratch** (not Recipe or Template).
3. Name the workflow per Section 13 conventions: e.g., "Lead Nurture - New Lead Welcome."
4. Add the Trigger.
5. Add Actions sequentially. Use the + button between nodes.
6. Configure each Action (email template, SMS copy, wait duration, branching condition).
7. Save.
8. Click **Test Workflow** to run with a dummy contact before publishing.
9. Toggle **Publish** when verified.

### 1.4 Workflow folder organization

Create a folder called "Lead Nurture" (Settings → Workflows → Folders → + Folder). [UI-VERIFY if folder support exists] Move all 5 Section 13 workflows into it. Keeps the list scannable as Sections 12-14 add more workflows.

---

## Step 2 — Workflow #1: New Lead Welcome

**Purpose:** Welcome any new lead captured via Section 8 forms within minutes of submission. Establishes brand voice, sets expectations, opens a conversation.

**Trigger:**
- **Type:** Form Submitted.
- **Filter:** any of the 4 Section 8 forms (Lead Capture · Custom Order Inquiry · Catering Inquiry · Feedback Survey). If the workflow builder supports multi-form triggers, list all 4. If not, create a secondary trigger for each form.
- **Enrollment filter:** Contact has `status:new-lead` tag AND does NOT have `behavior:welcomed` tag (prevents re-enrollment if the contact submits a second form before completing the welcome).

**Actions:**

1. **Wait 5 minutes** — gives HighLevel time to enrich the contact record (custom fields from form, tags from conditional logic). Prevents race conditions.
2. **Send Email — Welcome** (uses LC Email from Section 3):
   - Subject: *"Welcome to Caramel Oven, {{contact.first_name}}"*
   - Body draft (Content AI-assisted per Section 18, then edited):

> Hi {{contact.first_name}},
>
> Stacy here. Thanks for reaching out — whether you found us at the farmers market, through a friend, or stumbled onto the website late at night (we get that).
>
> Here's what you can expect from us:
>
> We bake fresh six mornings a week — sourdough starts at 4am, pastries at 5. We're at the Riverside Farmers Market every Saturday (8am-1pm) and the Downtown Market every Sunday (9am-2pm). If you want to order something special — custom cakes, catering, or standing wholesale orders — just reply to this email and we'll set up a quick call.
>
> Here are the three things most new customers ask about:
> • Custom orders: {{custom_values.booking_link}}
> • Our weekly menu: {{custom_values.business_website}}/menu
> • Dietary requests (gluten-free, vegan, etc.): we can do most — just ask.
>
> Thanks for finding us. We're a small bakery and we notice every single order.
>
> — Stacy
> Caramel Oven Bakehouse
> {{custom_values.business_address}}
> {{custom_values.business_phone}}

3. **Add Tag** — `behavior:welcomed` (blocks re-enrollment).
4. **Wait 3 days.**
5. **If/Else branch** — did the contact engage (email opened OR replied in Conversations)?
   - **If YES (engaged):** end workflow. The lead is warm; hand off to specific nurture (Wholesale / Catering) based on their segment tags. Other workflows pick up.
   - **If NO (not engaged):** proceed to Action 6.
6. **Send SMS — Day 3 check-in** (uses LC Phone from Section 4; fires when SMS is unlocked; queued if not yet):
   - Copy: *"Hi {{contact.first_name}}, Stacy from Caramel Oven here — just making sure the welcome email didn't go to spam. Any questions? Reply here anytime. Reply STOP to unsubscribe."*
7. **Wait 7 days.**
8. **End workflow** — if still no engagement, the contact flows to the Dormant Reactivation workflow eventually via Smart List membership.

**Settings:**
- **Re-enrollment:** prevented by the `behavior:welcomed` tag check at entry.
- **Exit on goal:** no specific goal event; contact exits naturally at the end of the tree or on engagement branch.

**Expected volume:** every new form submission. For Caramel Oven, likely 5-30 new leads/week.

---

## Step 3 — Workflow #2: Wholesale Lead Nurture

**Purpose:** Move wholesale prospects (Opportunity in Wholesale Pipeline, Prospect stage) through the early B2B relationship-building touches. Different tone than B2C — more business-forward, less warm-baker.

**Trigger:**
- **Type:** Opportunity Created.
- **Filter:** Opportunity is in Wholesale Pipeline AND stage = Prospect.

**Actions:**

1. **Wait 30 minutes** — lets Sample Status and Wholesale Account Type Custom Fields populate from form.
2. **Create Task** — assigned to Stacy. Title: "Send wholesale sample + intro letter to {{opportunity.name}}." Due date: 2 business days from now. (Manual follow-up task; automation handles reminders, not the physical sample logistics.)
3. **Send Email — B2B Intro** (LC Email):
   - Subject: *"Caramel Oven wholesale — quick intro for {{contact.first_name}}"*
   - Body draft:

> Hi {{contact.first_name}},
>
> Thanks for your interest in Caramel Oven for your {{opportunity.wholesale_account_type}}. Here's a short intro on how we work with wholesale partners:
>
> We bake fresh six days a week from our {{custom_values.business_address}} kitchen. Wholesale orders are placed 48 hours in advance minimum and delivered the morning-of. We can scale to standing weekly orders or ad-hoc — whatever fits your needs.
>
> I'll drop off a sample package within the next two business days. After you've had a chance to try it, let's set up a 20-minute call to talk pricing and logistics: {{custom_values.booking_link}}
>
> Questions before then — just reply.
>
> — Stacy
> Caramel Oven Bakehouse
> {{custom_values.business_phone}}

4. **Wait 5 business days** (use HighLevel's business-day Wait variant if available; otherwise Wait 7 days for weekend buffer). [UI-VERIFY business-day Wait option]
5. **If/Else branch** — has the Opportunity stage moved to "Sample Sent" or beyond?
   - **If YES:** end workflow. Stacy is actively engaged; Opportunity-level tracking in Section 10 takes over.
   - **If NO (still in Prospect):** proceed to Action 6.
6. **Create Task** — assigned to Stacy. Title: "Follow up on wholesale sample for {{opportunity.name}}." Due: 1 business day.
7. **Send Email — Day 7 nudge** (LC Email):
   - Subject: *"Quick check-in on the sample"*
   - Body:

> Hi {{contact.first_name}},
>
> Did the sample arrive? If you haven't tried it yet, no rush. If you have — any initial thoughts?
>
> If it's a no-go, also totally fine — just let me know and I won't keep following up.
>
> — Stacy

8. **Wait 14 days** (final nudge window).
9. **If/Else branch** — Opportunity stage still Prospect?
   - **If YES:** Update Opportunity → move to "Lost" with reason "No Response." Add Tag `status:churned`. End workflow.
   - **If NO:** end workflow (active progress; no intervention needed).

**Settings:**
- **Re-enrollment:** allowed on new Opportunity creation (a wholesale prospect who comes back later gets fresh nurture).

**Expected volume:** 1-5 new wholesale opportunities/month for Caramel Oven at current scale.

---

## Step 4 — Workflow #3: Catering Inquiry Nurture

**Purpose:** Convert catering inquiries into booked consultations within 72 hours. High-intent, event-driven, time-sensitive — needs a tighter sequence than wholesale.

**Trigger:**
- **Type:** Form Submitted (Catering Inquiry Form from Section 8) OR Opportunity Created in Catering Pipeline, Inquiry stage.
- **Enrollment filter:** Contact does NOT have `behavior:catering-consult-booked` tag.

**Actions:**

1. **Wait 15 minutes** — lets Event Date + Guest Count custom fields populate.
2. **Send Email — Catering Inquiry Confirmation** (LC Email, fires within 15 minutes of submission — customers notice this timing and it signals responsiveness):
   - Subject: *"Got your catering inquiry — next steps"*
   - Body draft:

> Hi {{contact.first_name}},
>
> Thanks for the catering inquiry for {{opportunity.event_date}} — I've got it. Here's what typically happens next:
>
> **Step 1 — Quick tasting consultation.** We meet (in person or by video, your preference) to talk through what you're imagining: flavors, design, dietary considerations, guest count. This is usually 30 minutes.
>
> **Step 2 — Quote.** I'll send a detailed quote within 48 hours of the tasting.
>
> **Step 3 — Deposit + booking.** Once you approve the quote, a 50% deposit locks your event date.
>
> Let's do Step 1. Pick a time here: {{custom_values.booking_link}}
>
> If you have any questions before we talk — reply anytime.
>
> — Stacy or Josh (whoever's available for your event date)
> Caramel Oven Bakehouse

3. **Wait 24 hours.**
4. **If/Else branch** — has the contact booked a consultation? (Check: Opportunity stage moved to "Consult Booked" OR contact has `behavior:catering-consult-booked` tag.)
   - **If YES:** end workflow.
   - **If NO:** proceed to Action 5.
5. **Send SMS — Day 1 nudge** (LC Phone, fires when SMS is unlocked):
   - Copy: *"Hi {{contact.first_name}}, Stacy from Caramel Oven. Following up on your catering inquiry for {{opportunity.event_date}} — ready to book a quick tasting? Here's the link: {{custom_values.booking_link}}. Reply STOP to unsubscribe."*
6. **Wait 48 hours.**
7. **If/Else branch** — consultation booked?
   - **If YES:** end workflow.
   - **If NO:** proceed to Action 8.
8. **Create Task** — assigned to Stacy. Title: "Personally call catering lead {{contact.first_name}} {{contact.last_name}} — inquiry for {{opportunity.event_date}}." Due: same day.
9. **Send Email — Day 3 final nudge** (LC Email):
   - Subject: *"Last nudge — {{opportunity.event_date}} is getting closer"*
   - Body:

> Hi {{contact.first_name}},
>
> Short note — your event is {{opportunity.event_date}}, which is getting close. If you'd still like us to be involved, let's get that tasting on the calendar: {{custom_values.booking_link}}
>
> If you've gone another direction, no worries — just let me know so I free up the dates for other events.
>
> — Stacy

10. **Wait 7 days.**
11. **If/Else branch** — consultation booked?
    - **If YES:** end.
    - **If NO:** Update Opportunity → move to "Lost" with reason "No Response." End.

**Settings:**
- **Re-enrollment:** allowed if `behavior:catering-consult-booked` is removed (re-inquiry for different event).

**Expected volume:** 3-10 catering inquiries/month.

---

## Step 5 — Workflow #4: B2C Dormant Reactivation (60-day trigger)

**Purpose:** Reach B2C customers who've gone silent for 60 days with one well-crafted win-back. Weekly farmers-market buyers shouldn't be invisible for 8+ weeks — if they are, something's off (moved, forgot, competitor). Reactivation at 60 days catches them before they've fully moved on.

### Trigger point justification (per Dan + Claude Chat directive)

**Why 60 days and not 90:** Caramel Oven's B2C regular's typical cadence is weekly (farmers market). A 60-day silence = ~8-10 missed weekends. That's the "oh right, I meant to go back" window. By 90 days, they've replaced Caramel Oven with a competitor or changed habits; reactivation is an uphill climb. 60 days is the reactivation sweet spot for weekly-cadence customers.

**Why NOT 30 or 45:** Day 30 is still within normal variance (vacation, busy stretch). Day 45 is borderline. Day 60 is where silence becomes meaningful. Narrower windows risk contact fatigue — reactivating someone who WAS going to come back this week anyway makes them feel stalked.

**Why NOT a single-workflow segment-conditional-entry:** The content, tone, and cadence of B2C reactivation (warm, recipe-focused, seasonal) diverges from wholesale check-ins (business-forward, cadence-referenced). Shared workflow = compromised copy for both. Separate workflows = each optimized for its audience.

### Configuration

**Trigger:**
- **Type:** Contact enters Smart List "Dormant 60d+" (Section 6 Smart List filter: `segment:b2c-regular` AND Last Activity > 60 days AND NOT `behavior:reactivation-attempt-active`).
- **Enrollment filter:** none beyond Smart List membership.

**Actions:**

1. **Add Tag** — `behavior:reactivation-attempt-active` (prevents re-enrollment while workflow runs).
2. **Send Email — We miss you** (LC Email):
   - Subject: *"It's been a while, {{contact.first_name}}"*
   - Body draft:

> Hi {{contact.first_name}},
>
> Quick note — it's been a couple months since we saw you at the market. No pressure, just wanted to check in.
>
> A few things in case you want to know what's been baking:
>
> **This month's seasonal bake:** rhubarb-almond tart (tart-meets-shortbread, Stacy's recipe from her grandmother).
>
> **New at the market:** gluten-free chocolate-hazelnut babka on Saturdays. Takes two days to make; only 20 loaves per week.
>
> **Mother's Day preorders open.** If you want custom or catering: {{custom_values.booking_link}}
>
> If you've moved, switched bakers, or just gotten busy — all fine. If you reply STOP to our SMS or unsubscribe from email, we'll get the message. Otherwise, hope to see you soon.
>
> — Stacy and Josh
> Caramel Oven Bakehouse

3. **Wait 4 days.**
4. **If/Else branch** — email opened OR contact had activity (purchase, form submission, chat message)?
   - **If YES:** Remove Tag `behavior:reactivation-attempt-active`. Add Tag `behavior:reactivated`. End workflow.
   - **If NO:** proceed to Action 5.
5. **Send SMS — Day 4 nudge** (LC Phone, fires when unlocked):
   - Copy: *"Hi {{contact.first_name}}, Caramel Oven here — been a bit! We're at the market this weekend if you want to stop by. Reply STOP to unsubscribe."*
6. **Wait 14 days.**
7. **If/Else branch** — contact has activity?
   - **If YES:** Remove `behavior:reactivation-attempt-active` + Add `behavior:reactivated`. End.
   - **If NO:** Remove `behavior:reactivation-attempt-active`. Add `status:churned`. End.

**Settings:**
- **Re-enrollment:** allowed after `behavior:reactivation-attempt-active` is removed AND 180 days have passed (prevents repeated reactivation attempts at too-close intervals).

**Expected volume:** variable; depends on total list size. For a 500-contact list, maybe 10-20 reactivation attempts/month.

---

## Step 6 — Workflow #5: Wholesale Check-In (cadence-aware)

**Purpose:** Check in on wholesale customers when their expected order cadence lapses. Cadence is per-contact (stored in `opportunity.order_frequency`), so the "dormancy threshold" varies per contact: weekly → 30-day silence is concerning, monthly → 75 days is concerning, quarterly → 180 days is concerning.

### Trigger justification

**Why cadence-aware rather than fixed:** a weekly-cadence café that hasn't ordered in 30 days is a crisis (they've switched). A quarterly-cadence catering client that hasn't ordered in 30 days is normal. Fixed-threshold workflow would either over-trigger on the quarterly client (spamming them) or under-trigger on the weekly café (missing the escalation window). Cadence-aware respects how the customer actually buys.

**Implementation:** Rather than a single Smart List with complex cross-cadence logic, use 5 sub-Smart Lists (one per Order Frequency tier) with OR-union at the workflow trigger. Or a Workflow-level If/Else branch on Order Frequency at entry. I recommend the OR-union-Smart-Lists approach for simpler debugging.

### Configuration

**Trigger:**
- **Type:** Contact enters ANY of the five Smart Lists below (configure as multi-trigger):
  - "Wholesale Dormant - Weekly" (filter: `segment:b2b-wholesale` AND `opportunity.order_frequency = Weekly` AND Last Activity > 30 days)
  - "Wholesale Dormant - Bi-weekly" (... Bi-weekly AND Last Activity > 45 days)
  - "Wholesale Dormant - Monthly" (... Monthly AND Last Activity > 75 days)
  - "Wholesale Dormant - Quarterly" (... Quarterly AND Last Activity > 180 days)
  - "Wholesale Dormant - Ad-hoc" (... Ad-hoc AND Last Activity > 180 days)

  [Note: these Smart Lists are NOT in the Section 6 baseline 12. Add them here when Section 13 is configured. Section 6 delivers with 12 baseline; Section 13 adds these 5. Total Smart Lists post-Section-13: 17.]

**Actions:**

1. **Create Task** — assigned to Stacy. Title: "Wholesale check-in: {{contact.first_name}} {{contact.last_name}} at {{contact.company_name}}. Cadence {{opportunity.order_frequency}}; silent since [last activity]." Due: 1 business day.
2. **Send Internal Notification** (Conversations Internal Chat or email) — "Wholesale dormancy trigger: review Stacy's task."
3. **Wait 2 business days** (lets Stacy manage the relationship personally; if she's moved the relationship, no further automation).
4. **If/Else branch** — has the contact had activity or Opportunity been updated?
   - **If YES:** end workflow (Stacy handled it).
   - **If NO:** proceed to Action 5.
5. **Send Email — B2B check-in** (LC Email):
   - Subject: *"Checking in on {{contact.company_name}}"*
   - Body draft:

> Hi {{contact.first_name}},
>
> Short note from Caramel Oven — it's been a bit since your last order. {{opportunity.order_frequency}} cadence typically means we'd have heard from you by now, so I wanted to check in:
>
> • Are you happy with everything?
> • Need to adjust volume, schedule, or menu?
> • Want me to hold off contact if you've switched suppliers?
>
> Reply whenever. I'd rather know directly than assume.
>
> — Stacy
> Caramel Oven Bakehouse

6. **Wait 7 business days.**
7. **If/Else branch** — reply or activity?
   - **If YES:** Add Tag `behavior:wholesale-reactivated`. End.
   - **If NO:** Create follow-up Task for Stacy ("Personally call wholesale dormant contact"). Update Opportunity with Note ("Cadence-based check-in attempted; no response"). End.

**Settings:**
- **Re-enrollment:** allowed after activity resumes AND cadence window re-lapses (natural Smart List re-entry behavior).

**Expected volume:** 1-5 wholesale check-ins/month depending on wholesale account count.

---

## Optional forward-pointer: Catering Anniversary Reactivation

**NOT BUILT in Section 13.** Flagged as a forward-pointer for Month 6+ iteration.

**What it would do:** 365-day anniversary from a completed catering event, reach out to the contact about the upcoming equivalent event next year. Wedding anniversary, corporate event same-time-next-year, birthday-party kid's next birthday.

**Trigger would be:** Opportunity in Catering pipeline, stage = Follow-up, `opportunity.event_date` was 365-370 days ago.

**Why deferred:** Caramel Oven launches in 2026-04-17 era; the first customers who'd trigger anniversary reactivation won't exist until 2027-04 at earliest. Build in Month 6 when early catering clients are approaching their annual-event window. Adding it now just means extra workflow to maintain without data flowing through it yet.

---

## Step 7 — Test each workflow

Before publishing, each workflow runs a test execution.

1. Open a workflow → click **Test Workflow** button. [UI-VERIFY]
2. Select a test contact (create a "Test Lead" contact in Contacts if needed).
3. Run the workflow end-to-end in test mode.
4. Verify each action fires: email drafts appear in the test contact's Conversations log; SMS actions show in the pending queue; tag additions land; tasks create.
5. Fix any broken merge fields (`{{contact.first_name}}` renders blank = the test contact doesn't have that field set; real contacts will).
6. Delete the test contact after verification.

---

## Step 8 — Publish and monitor

1. Toggle each workflow from **Draft** to **Publish**.
2. Each workflow now enrolls real contacts as their triggers fire.
3. Monitor **Workflow Stats** (per workflow) for the first week:
   - Enrollment count (are triggers firing?)
   - Completion rate (are contacts completing the action tree?)
   - Error rate (are any actions failing? email-send-failures, SMS blocked pre-A2P, etc.)
4. If a workflow shows zero enrollments after 3-5 days: trigger may be misconfigured. Check enrollment filters.
5. If error rate is high: check that upstream infrastructure (LC Email domain verified, A2P approved for SMS) is live.

---

## Completion criteria

1. ✅ Workflow #1 — New Lead Welcome — built, tested, published.
2. ✅ Workflow #2 — Wholesale Lead Nurture — built, tested, published.
3. ✅ Workflow #3 — Catering Inquiry Nurture — built, tested, published.
4. ✅ Workflow #4 — B2C Dormant Reactivation — built, tested, published.
5. ✅ Workflow #5 — Wholesale Check-In — built, tested, published (includes 5 new Smart Lists for cadence tiers).
6. ✅ All workflows grouped into "Lead Nurture" folder.
7. ✅ Test contacts deleted.
8. ✅ Intake Document updated with workflow names, IDs, expected volumes, and the "17 Smart Lists total" count (12 from Section 6 + 5 new cadence-tier lists).

---

## What happens next

**Section 12 — Workflows: Appointment & Purchase** waits on Q-batch (Section 11 Reputation blocked on Q4; Section 9 Calendars blocked on Q5). Not writeable until intake returns.

**Section 14 — Workflows: Commerce + Missed-Call Text-Back** similarly waits on Section 11 (GBP review response needs Reputation infrastructure) and Section 15 (abandoned cart needs Stripe/payment).

**Post Section 13, the pipeline is blocked.** Pivoting to Phase 5 prep per Dan's directive.

---

## Flags for this section

- **Assumptions made:** (a) Splitting Dormant Reactivation into TWO workflows (B2C 60-day + Wholesale cadence-aware) rather than one with conditional entry — justified inline; (b) 60-day B2C dormancy threshold — justified inline; (c) 5 new Smart Lists for wholesale cadence tiers get created in Step 6 (total Smart Lists 12 → 17); (d) Every workflow email uses `{{custom_values.booking_link}}` as forward-pointer — placeholder resolves in Section 9 when Calendars ship; (e) SMS actions build but don't fire until A2P approved (Section 4 carrier-gated); (f) `behavior:reactivation-attempt-active` is a short-term state tag; adds to the Section 5 tag taxonomy (call: accepted into the system implicitly, flag if Dan wants formalization in Section 5).
- **Gaps identified:** UI-VERIFY flags on Automation → Workflows path, business-day Wait option (vs calendar-day), workflow folder support existence, Test Workflow button behavior, Create Task action target user-picker.
- **Competing approaches:** (a) ONE dormant workflow with conditional entry vs TWO separate workflows — chose TWO, justified inline; (b) Fixed threshold (e.g., 60 days for all) vs cadence-aware for wholesale — chose cadence-aware for wholesale, fixed for B2C; (c) Catering Anniversary Reactivation now vs deferred — deferred to Month 6+ when data exists to act on; (d) Re-enrollment "allowed after 180 days" for Dormant Reactivation vs "allowed after 365 days" — chose 180 for operational responsiveness; adjust if complaint rate suggests over-contact.
- **Client-side blockers:** None for this section. Section 13 proceeds on current intake state. Q-batch return unblocks Sections 9/11/15/17/19; their workflows will chain to Section 13's enrollment triggers where relevant.
- **Platform-level irreversible decisions:** None. Workflows can be paused, edited, or deleted. Live enrollments complete their current run; draft edits apply to future enrollments only.
- **Implicit Section 5 tag additions:** `behavior:reactivation-attempt-active` · `behavior:reactivated` · `behavior:wholesale-reactivated`. Three new `behavior:*` tags introduced here. If Dan wants these formalized in Section 5's tag taxonomy document, surface as Section 5 revisit; otherwise they live in Section 13 as implementation details of the Dormant Reactivation pattern.

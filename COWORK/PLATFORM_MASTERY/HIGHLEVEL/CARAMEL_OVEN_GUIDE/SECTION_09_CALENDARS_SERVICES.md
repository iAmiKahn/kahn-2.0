# Section 9 — Calendars & Services

**Last Updated:** 2026-04-19
*If HighLevel UI doesn't match these instructions, consult the Update Protocol (Phase 5.2). This guide targets the HighLevel platform as of 2026-04-19.*

---

## Purpose

Stand up Caramel Oven's appointment-booking infrastructure using HighLevel's **Services v2** surface. Create 4 starter appointment types (Custom Order Consultation, Event Dessert Consultation, Bulk Order Pickup Window, Wholesale Sample Meeting), configure staff + availability + deposits, generate booking links, and populate the `custom_values.booking_link` placeholder that has been threaded through every section since Section 2.

**Estimated time:** 90-120 minutes active work. Bulk of effort is Services configuration + staff + payment wiring.

**Dependencies:**
- Section 2 complete (sub-account exists; business hours and timezone set in Business Profile).
- Section 5 complete (Custom Values + Brand Board).
- Section 7 complete (Stripe connected — required for paid deposits on Services 1 and 2).
- **Q5 RESOLVED 2026-04-19:** Caramel Oven has no existing appointments. Section 9 is net-new capability. 4 appointment types locked (see Step 2).

---

## Why this section matters

Caramel Oven's business is currently walk-in / online-order-driven via the existing GoDaddy site. Appointment-based sales (custom cake consults, event dessert planning, wholesale sample meetings) are not happening today — or if they are, they're happening ad-hoc via text messages and calendar tetris that Stacy manages mentally.

Section 9 formalizes appointment-based sales as a structured revenue motion. Four concrete effects:

1. **Custom order revenue becomes predictable.** Consultations convert at 40-60% industry-typical. Paid deposits filter tire-kickers.
2. **Staff time stops leaking into scheduling chaos.** Round-robin routing for the free appointment types prevents both owners from chasing the same calendar holes.
3. **Wholesale pipeline acquisition accelerates.** Every wholesale prospect from Section 13's nurture workflow gets a bookable slot — not "message me back to set up a time."
4. **The `custom_values.booking_link` placeholder from Section 2 gets populated.** Every email template, workflow, chat widget, and funnel that references `{{custom_values.booking_link}}` now resolves to a real URL.

---

## What you will produce

1. **Services v2 enabled** on the Caramel Oven sub-account.
2. **4 Services configured** per the Q5-locked spec (see §2.1 below).
3. **2 Staff members** set up — Stacy (primary) and Josh (backup for round-robin services).
4. **Availability rules** matching Caramel Oven's operating hours.
5. **Deposit payments wired** via Stripe (Section 7 must be complete) for Services 1 and 2.
6. **Round-robin routing** on Services 3 and 4 (Bulk Order Pickup + Wholesale Sample Meeting).
7. **Booking URLs** for each service, copied to Custom Values and the Intake Document.
8. **`custom_values.booking_link` updated** — the top-level "book something" landing URL (typically the Custom Order Consultation since that's the highest-value lead entry).
9. **Smoke-tested booking flow** end-to-end.

---

## Step 1 — Enable Services v2 on the sub-account

**Agency-level action (Dan):** Services v2 is toggled on per sub-account from the Agency view.

1. Log in as Agency owner at `app.gohighlevel.com`.
2. **Sub-Accounts** → find Caramel Oven → **3-dot menu** → **Manage Client**. [UI-VERIFY exact label]
3. Inside the sub-account, navigate to **Settings → Calendar Settings**. [UI-VERIFY]
4. Toggle **Services** to ON.
5. Save.

Services v2 is now the default booking surface for Caramel Oven. Legacy Calendar types (basic single-slot calendars) still exist as an option but won't be used for the 4 starter services — all four map cleanly to Services v2.

---

## Step 2 — Create the 4 Services

**Where:** Calendars (left nav) → Services tab → **+ New Service**. [UI-VERIFY]

### 2.1 Final service specification (locked 2026-04-19)

| # | Service Name | Duration | Payment | Primary Owner |
|---|---|---|---|---|
| 1 | Custom Order Consultation | 30 min | $25 deposit (refundable toward order) | Stacy |
| 2 | Event Dessert Consultation | 60 min | $50 deposit (refundable toward order) | Stacy |
| 3 | Bulk Order Pickup Window | 15 min | Free | Round-robin (Stacy primary, Josh backup) |
| 4 | Wholesale Sample Meeting | 30 min | Free | Round-robin (Stacy primary, Josh backup) |

### 2.2 Create Service 1 — Custom Order Consultation

1. + New Service → Name: **Custom Order Consultation**.
2. Description (shown to customer at booking):
   > "30-minute consultation for custom cakes, wedding desserts, birthday designs, and specialty orders. Stacy walks through flavors, design direction, dietary considerations, and gives you a ballpark on pricing. The $25 deposit applies toward your order if you move forward — or is refundable if we're not the right fit."
3. Duration: **30 minutes**.
4. Buffer: **15 minutes post** (recovery time before the next slot).
5. Pre-book window minimum: **48 hours out** (prevents rush-order chaos).
6. Advance-booking maximum: **90 days out**.
7. Staff: Stacy (only). Service 1 is NOT round-robin.
8. Location: Video call (Zoom link auto-generated) OR in-person at Caramel Oven OKC address (pull from Business Profile). Offer both; customer selects at booking.
9. Payment: **$25 refundable deposit**. Configure via Section 7 product — reference the "Custom Order Consultation Deposit" product created in Section 7 Step 4, or create inline if that product doesn't exist yet.
10. Save.

### 2.3 Create Service 2 — Event Dessert Consultation

1. + New Service → Name: **Event Dessert Consultation**.
2. Description:
   > "60-minute consultation for event dessert planning — weddings, corporate events, birthdays, holidays, and other occasions where you need dessert for a group. Stacy walks through menu options, tasting samples (when in-person), guest count, dietary considerations, and delivery logistics. The $50 deposit applies toward your event or is refundable if we're not the right fit."
3. Duration: **60 minutes**.
4. Buffer: **30 minutes post** (accounts for sample cleanup / tasting wind-down).
5. Pre-book window minimum: **72 hours out**.
6. Advance-booking maximum: **180 days out** (wedding timelines).
7. Staff: Stacy (only).
8. Location: In-person preferred (tasting); video optional for initial pass.
9. Payment: **$50 refundable deposit**.
10. Save.

### 2.4 Create Service 3 — Bulk Order Pickup Window

1. + New Service → Name: **Bulk Order Pickup Window**.
2. Description:
   > "15-minute scheduled pickup slot for large orders (typically $50+ or orders requiring advance prep). Choose a time that works; we'll have your order ready. Free to book."
3. Duration: **15 minutes**.
4. Buffer: **5 minutes post**.
5. Pre-book window minimum: **24 hours out** (typical prep time).
6. Advance-booking maximum: **30 days out**.
7. Staff: **Round-robin** — Stacy primary, Josh backup. Configure via Calendar Group in Step 5.
8. Location: Caramel Oven OKC address (pickup only; no other location option).
9. Payment: **Free**.
10. Save.

### 2.5 Create Service 4 — Wholesale Sample Meeting

1. + New Service → Name: **Wholesale Sample Meeting**.
2. Description:
   > "30-minute meeting for café, grocer, restaurant, or corporate buyers interested in Caramel Oven wholesale. We bring samples, discuss pricing, cadence, and logistics. Free, no commitment required."
3. Duration: **30 minutes**.
4. Buffer: **15 minutes post**.
5. Pre-book window minimum: **48 hours out**.
6. Advance-booking maximum: **60 days out**.
7. Staff: **Round-robin** — Stacy primary, Josh backup. Same Calendar Group as Service 3.
8. Location: In-person at prospect's venue (Stacy travels) OR video. Customer selects.
9. Payment: **Free**.
10. Save.

---

## Step 3 — Configure Staff

**Where:** Calendars → Staff (or Services → Staff tab). [UI-VERIFY]

### 3.1 Add Stacy as Staff

1. + Add Staff Member.
2. Link to Sub-Account User: **Stacy** (created in Section 2 Step 5).
3. Role: **Primary Baker / Owner**.
4. Email + phone: auto-populate from user account.
5. Assign to Services: **1, 2, 3, 4** (all four — she's primary on everything, backup routing on 3 and 4 goes to Josh).
6. Save.

### 3.2 Add Josh as Staff

1. + Add Staff Member.
2. Link to Sub-Account User: **Josh**.
3. Role: **Operations / Owner**.
4. Assign to Services: **3, 4** (backup on round-robin).
5. Save.

---

## Step 4 — Configure Availability

**Where:** Calendars → Services → (each service) → Availability tab. [UI-VERIFY]

### 4.1 Assumed operating hours

Caramel Oven's site does not publicly list hours. Propose the following baseline pending Stacy/Josh confirmation:

- **Tuesday through Saturday**: 10am – 6pm CT
- **Sunday**: 11am – 3pm CT (reduced; prep day)
- **Monday**: closed (bakery day-off standard)

Adjust after Stacy/Josh confirm actual availability.

### 4.2 Service-specific availability overrides

| Service | Availability | Rationale |
|---|---|---|
| Custom Order Consultation | Tue-Fri 10am-4pm; Sat 10am-2pm | Stacy needs Saturday afternoon free for market fulfillment. |
| Event Dessert Consultation | Tue-Thu 10am-4pm | Longer meeting; weekday only to avoid market disruption. |
| Bulk Order Pickup Window | Tue-Sat all operating hours | High availability; customers pick a time, staff ready. |
| Wholesale Sample Meeting | Tue-Fri 10am-5pm | Weekday only (wholesale buyers operate weekdays). |

### 4.3 Date-specific overrides

For holidays, closures, or market-day blackouts, use Date-Specific Hours override. Block:
- **Memorial Day · July 4 · Labor Day · Thanksgiving · Christmas Eve · Christmas · New Year's Day** — closed by default.
- **Any known market event days** where Stacy's full attention is on the market booth.

This list gets populated once Stacy shares her market/event calendar. For now: document the 7 federal-adjacent closures, leave market blackouts as a Stacy-managed ongoing task.

---

## Step 5 — Configure Calendar Groups (round-robin for Services 3 + 4)

**Where:** Calendars → Calendar Groups → **+ New Group**. [UI-VERIFY]

### 5.1 Create the round-robin group

1. + New Group → Name: **"Caramel Oven — Owner Availability (Round-Robin)"**.
2. Mode: **Round-Robin** (distributes new appointments evenly between Stacy and Josh, respecting each person's individual availability).
3. Members: Stacy + Josh.
4. Tiebreaker rule: if both are free, pick the one with fewer appointments in the current week.
5. Link to Services: **Service 3 (Bulk Order Pickup Window)** and **Service 4 (Wholesale Sample Meeting)**.
6. Save.

### 5.2 Customer-facing label

When customers book Services 3 or 4, the booking widget shows one unified calendar. Customers don't see Stacy-vs-Josh individually unless you expose a "pick your preferred person" option. Default is automatic routing.

---

## Step 6 — Configure Notifications

**Where:** Calendars → Services → (each service) → Notifications tab. [UI-VERIFY]

Standard notification set for all 4 services:

### 6.1 To the customer

- **On booking:** immediate confirmation email with appointment details, location, what to expect, and cancellation link. Subject: *"Your {Service Name} is booked — {Appointment Time}"*.
- **24 hours before:** reminder email.
- **2 hours before:** reminder SMS (requires A2P approved; queued if not yet).
- **Post-appointment (Service 1 + 2 only):** follow-up email at 24 hours asking if they want to move forward with the order.

### 6.2 To the staff

- **On booking:** internal notification to assigned staff member (Stacy or whoever was round-robin-matched).
- **1 hour before:** SMS reminder to staff.
- **On cancellation:** notification to both staff + internal Conversations log entry.

### 6.3 Notification templates

Use Brand Board styling (Section 5 v1 Brand Board). Pull `{{custom_values.business_name}}` = Caramel Oven Bakehouse, `{{custom_values.business_address}}` for in-person appointments, and `{{custom_values.booking_link}}` for the cancellation/reschedule link.

---

## Step 7 — Configure Payment Deposits (Services 1 + 2)

**Where:** Each service's **Payments tab**. [UI-VERIFY]

### 7.1 Service 1 — Custom Order Consultation ($25 deposit)

1. Payments tab → Enable **Require Payment**.
2. Payment method: **Stripe** (default from Section 7).
3. Amount: **$25.00**.
4. Deposit policy text (shown at checkout):
   > "A $25 refundable deposit secures your consultation slot. If you move forward with an order, the deposit applies toward the total. If we're not the right fit, we refund within 3 business days."
5. Save.

### 7.2 Service 2 — Event Dessert Consultation ($50 deposit)

Same flow. Amount **$50.00**. Same deposit-refund language scaled to $50.

### 7.3 Refund mechanics

HighLevel does not automate "apply deposit toward later order." Process:
- Customer pays $25 at booking (captured in Stripe).
- If customer converts to an order: invoice them for (total – $25) and mark the deposit as applied. Manual ledger entry; document in the Intake Document.
- If customer doesn't convert: refund $25 manually in Stripe dashboard within 3 business days.

This is an operational process, not an automation. Flag in Section 21 operator playbook: Stacy's weekly review checklist includes "any deposits outstanding?"

---

## Step 8 — Generate booking links and update Custom Values

**Where:** Each service's **Booking Widget** or **Share** tab. [UI-VERIFY]

### 8.1 Get per-service booking URLs

For each service, HighLevel generates a direct booking URL shaped like:
```
https://link.caramelovenokc.com/widget/bookings/<service-slug>
```

Copy each URL. Record in the Intake Document:

```
BOOKING LINKS
Custom Order Consultation: [URL]
Event Dessert Consultation: [URL]
Bulk Order Pickup Window: [URL]
Wholesale Sample Meeting: [URL]
```

### 8.2 Update `custom_values.booking_link` (resolves Section 2 placeholder)

The top-level "book something" link used in email templates and workflows throughout the guide points to the **Custom Order Consultation** (highest-value lead entry point).

1. Settings → Custom Values → `custom_values.booking_link`.
2. Replace placeholder `[booking link — to be set in Section 9]` with the Service 1 URL.
3. Save.

Every template referencing `{{custom_values.booking_link}}` across Sections 12-14 workflows and downstream sections now resolves correctly.

### 8.3 Create additional per-purpose Custom Values

For workflows that need specific booking surfaces (not the generic "book something"):

1. `custom_values.event_dessert_link` — Service 2 URL (used by Catering Inquiry workflow in Section 13).
2. `custom_values.bulk_pickup_link` — Service 3 URL (used in Post-Purchase workflow for bulk-order customers).
3. `custom_values.wholesale_sample_link` — Service 4 URL (used by Wholesale Lead Nurture workflow in Section 13).

Update Section 13 workflow drafts to reference these specific Custom Values rather than the generic booking_link where appropriate.

---

## Step 9 — Smoke-test the booking flow

End-to-end validation before declaring Section 9 complete:

1. Open the Custom Order Consultation booking URL in an incognito browser (mimics a new customer).
2. Pick an available date/time slot.
3. Fill the booking form (name, email, phone).
4. Pay the $25 deposit using a test card OR a real card with an immediate refund plan.
5. Verify:
   - Confirmation email lands in the customer's inbox.
   - Stacy receives a staff notification.
   - Appointment appears in the Calendar (Calendars → Appointments).
   - Payment appears in Payments → Transactions linked to the Stacy Custom Order service.
   - A Contact record is created/updated with source `source:website-form` (or calendar-specific source tag).
6. Cancel the test appointment. Verify cancellation emails fire to both customer and Stacy.
7. Refund the $25 test deposit in Stripe dashboard.
8. Repeat abbreviated test on Services 2, 3, 4 — verify each booking path works.

---

## Completion criteria

1. ✅ Services v2 enabled on the sub-account.
2. ✅ 4 Services created per the Q5-locked spec.
3. ✅ Staff (Stacy + Josh) configured with correct service assignments.
4. ✅ Availability matches Caramel Oven operating hours (baseline placeholders; Stacy/Josh confirm).
5. ✅ Calendar Group configured for Services 3 + 4 round-robin.
6. ✅ Notification templates wired for customer + staff.
7. ✅ Deposit payments configured for Services 1 + 2 ($25 / $50) via Stripe.
8. ✅ Booking URLs generated and copied to Intake Document.
9. ✅ `custom_values.booking_link` + 3 service-specific Custom Values populated.
10. ✅ End-to-end smoke test passed on all 4 services.

---

## What happens next

**Section 11 — Reputation Management** is the next write. Unblocks Sections 12 workflows that depend on Review Request infrastructure. GBP claim via postcard starts today — 5-14 day wait runs in parallel with this section's configuration.

**Section 12 — Workflows: Appointment + Purchase** references Section 9 directly (Workflow #1 Appointment Confirmation triggers on Appointment Booked event from these Services).

---

## Flags for this section

- **Assumptions made:** (a) Operating hours baseline (Tue-Sat 10am-6pm, Sun 11am-3pm, Mon closed) — Stacy/Josh confirm at Section 21 QA; (b) Deposits of $25/$50 locked per Q5 approval; (c) Round-robin for Services 3+4 with "fewer appointments this week" tiebreaker — alternative is strict round-robin (literal alternation); chose weighted because it handles uneven week patterns better; (d) `custom_values.booking_link` = Custom Order Consultation URL (highest-value entry); service-specific links live in separate Custom Values.
- **Gaps identified:** (a) UI-VERIFY flags on Services enable path, Staff tab, Calendar Groups UX, Payments tab per service, Booking Widget share location; (b) Deposit-refund / deposit-apply flow is MANUAL (operational pattern); HighLevel doesn't automate "apply deposit toward later order" natively — flagged in Step 7.3 and Section 21 operator playbook.
- **Competing approaches:** (a) Services v2 vs basic Calendar types — chose Services v2 for all 4 because the staff + payment + resource + category features pay for themselves; (b) Round-robin on Services 1 + 2 as well — rejected because Stacy has strong brand-face role for custom/event work; Josh handles operations/pickup; (c) Include Zoom integration now vs later — included as option on Services 1 + 2 because remote consults are realistic for out-of-OKC customers.
- **Client-side blockers resolved:** Q5 (no existing appointments → 4 net-new services).
- **Platform-level irreversible decisions:** None. Services can be edited/disabled; Staff reassigned; Availability rewritten; Groups rebuilt.

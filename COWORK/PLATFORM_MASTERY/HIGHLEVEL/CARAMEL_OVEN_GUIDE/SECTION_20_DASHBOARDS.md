# Section 20 — Dashboards + Mobile App

**Last Updated:** 2026-04-19
*If HighLevel UI doesn't match these instructions, consult the Update Protocol (Phase 5.2). This guide targets the HighLevel platform as of 2026-04-19.*

---

## Purpose

Build the owner-facing daily dashboard that aggregates widgets from Sections 9 (appointments), 10 (pipelines), 11 (reviews), 13/14/12 (workflow stats), 15 (invoices/revenue), 16 (gift cards), and 19 (social analytics) into a single glance-and-know-where-the-business-stands surface. Onboard Stacy and Josh to the HighLevel mobile app so they operate from anywhere. Establish the "what do I check first thing in the morning" pattern.

**Estimated time:** 60-90 minutes.

**Dependencies:**
- Sections 2-19 complete (widgets pull from all upstream configurations).
- Section 17 cutover live (some widgets — traffic, form submissions — reference live site).

---

## Why this section matters

A bakery with no dashboard runs on instinct + memory. A bakery with a dashboard runs on actual data. Three outcomes:

1. **Morning review takes 90 seconds, not 20 minutes.** Stacy opens the dashboard with coffee, sees: 3 new leads, 2 catering inquiries waiting, this week's pipeline value, 4 reviews to approve, Saturday market reminder. Acts. Moves on.
2. **Slow leaks become visible.** Revenue pacing 30% below last month? The dashboard shows it on Day 5 of the month, not Day 30. Dormant customer count climbing? Trigger a Workflow #8 activation.
3. **Handoff-ready.** When the VA onboards (post-revenue), the same dashboard orients them. No "let me show you where to look" call — the dashboard IS the orientation.

---

## What you will produce

1. **"Caramel Oven Daily" Dashboard** — 10-widget owner-facing view.
2. **Mobile app onboarding** for Stacy + Josh.
3. **Notification preferences** configured per-user for mobile + desktop.
4. **Optional secondary dashboards** — "Wholesale Pipeline" and "Event Pipeline" drill-downs.

---

## Step 1 — Build the "Caramel Oven Daily" dashboard

**Where:** Dashboards (left nav) → **+ Create Dashboard**. [UI-VERIFY]

### 1.1 Create the dashboard

1. + Create Dashboard → Name: **"Caramel Oven Daily"**.
2. Description: *"Owner-facing daily review. Opens first thing each morning."*
3. Default timezone: America/Chicago (matches Business Profile).
4. Permissions: shared across Dan, Stacy, Josh.
5. Set as Default Dashboard for all three users.

### 1.2 Widget layout — 10 widgets across 3 rows

**Row 1 (Top-of-funnel + pipeline) — 3 widgets:**

| # | Widget | Config | Source |
|---|---|---|---|
| 1 | **New Leads — Last 7 Days** | Smart List count widget for "New Leads (Last 7 Days)" from Section 6 | Section 6 |
| 2 | **Pipeline Value — Catering** | Pipeline Value widget for Catering pipeline | Section 10 |
| 3 | **Pipeline Value — Wholesale** | Pipeline Value widget for Wholesale pipeline | Section 10 |

**Row 2 (Operations + Revenue) — 4 widgets:**

| # | Widget | Config | Source |
|---|---|---|---|
| 4 | **Appointments — This Week** | Appointment count widget filtered to next 7 days | Section 9 |
| 5 | **Revenue — Month to Date** | Payments widget summing current-month transactions | Section 15 / Section 7 |
| 6 | **Reviews — This Month** | Review count widget pulling GBP + Facebook | Section 11 |
| 7 | **Review Response Queue** | Suggestive-mode reviews pending owner approval | Section 11 / Section 14 Workflow #10 |

**Row 3 (Health + momentum) — 3 widgets:**

| # | Widget | Config | Source |
|---|---|---|---|
| 8 | **Active Customers** | Smart List count for "Active Customers" | Section 6 |
| 9 | **Dormant (60d+)** | Smart List count for "Dormant 60d+" | Section 6 / Section 13 Workflow #4 |
| 10 | **Gift Card Outstanding Balance** | Gift Card Dashboard summary — total unredeemed balance | Section 16 |

### 1.3 Widget-by-widget configuration

For each widget:

1. Click + Add Widget.
2. Select widget type (Pipeline Value · Smart List Count · Payments · Reviews · Table · etc.).
3. Configure filters per spec above.
4. Preview. Confirm data renders (may be zero at launch — expected).
5. Save.

Repeat 10 times.

### 1.4 Visual styling

- Use Brand Board v1 colors for widget chrome where configurable.
- Keep the layout scannable: smallest numbers at top (new leads count), larger aggregates in the middle (pipeline value, revenue), specific counts at the bottom (gift card balance, dormant count).

### 1.5 Save + set as default

1. Save dashboard.
2. Set as Default for Dan, Stacy, Josh (each user individually if Default is per-user in the UI).

---

## Step 2 — Mobile app onboarding for Stacy and Josh

**Where:** HighLevel mobile app (iOS / Android) OR the white-labeled Lead Connector app.

### 2.1 Install

Stacy and Josh each:

1. Download the HighLevel mobile app (search "HighLevel" in App Store or Google Play; white-label version may be branded differently — confirm with Dan's Agency configuration).
2. Sign in with their sub-account credentials from Section 2.
3. Accept permission prompts (notifications, location for Business Card Scanner, camera for media uploads).

### 2.2 Configure mobile notifications

On the mobile app, each user sets notification preferences:

**Stacy (primary operator):**
- ✅ New contact / new lead.
- ✅ Appointment booked (any of 4 Services).
- ✅ New catering inquiry (form submission).
- ✅ Negative feedback flagged (Workflow #4 trigger).
- ✅ Internal notification from workflows.
- ✅ Review received (all ratings).
- ⬜ Payment received (optional — Stripe email already covers).

**Josh (operations/backup):**
- ✅ Appointment booked (round-robin Services 3 + 4 — Stacy primary, Josh backup).
- ✅ New lead.
- ✅ Internal notification from workflows.
- ⬜ Review received (optional — Stacy primary).
- ⬜ Payment received (optional).

Adjust as preferences emerge post-launch.

### 2.3 Business Card Scanner

Enable the Business Card Scanner feature on the mobile app. Use case: Stacy or Josh meet a wholesale prospect at the farmers market or an industry event → scan their business card → app auto-creates a Contact with `source:event-booth` tag.

Walk Stacy through the scan → contact creation flow once post-launch.

### 2.4 Mobile-first operator patterns

Document in operator playbook:

- **Morning review:** open app → default dashboard → scan 10 widgets → act on anything red.
- **Farmers market:** app open during market hours → Chat Widget messages come through + Missed-Call Text-Back auto-reply + new contacts from Business Card Scanner.
- **Incoming customer message:** respond via Conversations inbox on mobile (Section 8 infrastructure).

---

## Step 3 — Build secondary dashboards (optional)

These are drill-down views for when Stacy or Josh want deeper detail on a specific area. Not required for launch but documented for post-launch iteration.

### 3.1 "Wholesale Pipeline" dashboard

Focused widget set: Wholesale pipeline Kanban (embedded) · Wholesale Smart List (count) · Active Wholesale Accounts list · Stacy's Task queue for wholesale.

### 3.2 "Event Pipeline" dashboard

Focused: Catering pipeline Kanban · Upcoming events (next 30 days) · Deposits outstanding · Balance invoices due in next 7 days.

### 3.3 "Operator Daily Tasks" dashboard

Focused: Task queue for Stacy + Josh · Internal notifications in last 24 hours · Unread Conversations inbox count.

Build these post-launch as patterns emerge. Not blocking go-live.

---

## Step 4 — Configure dashboard permissions

**Where:** Each dashboard → Permissions tab. [UI-VERIFY]

- **"Caramel Oven Daily":** visible to Dan, Stacy, Josh (all three).
- **Secondary dashboards (post-launch):** adjust per-dashboard based on who needs what.
- **Dan-only dashboards** (e.g., a PitchBlack health dashboard): keep restricted.

---

## Step 5 — Dashboard widgets that remain empty at launch — expected states

Some widgets will show 0 at launch because the system is new:

- **Reviews — This Month:** 0 reviews pre-GBP-verification. Fills as reviews come in.
- **Gift Card Outstanding Balance:** 0 until first gift card sold. Ramps with Mother's Day campaign.
- **Pipeline Values:** 0 until first Opportunities created (Section 13 workflows enroll new inquiries into Catering + Wholesale pipelines).
- **Active Customers:** equals imported contact count (Section 6) at launch; grows over time.

Flag in operator playbook: **Week 1 dashboard numbers are low by design.** Month 1+ is when the dashboard becomes meaningful. By Month 3, widgets should reflect real business momentum.

---

## Step 6 — Smoke test

1. Open "Caramel Oven Daily" dashboard as Dan. All 10 widgets render.
2. Trigger a test event (create a test Contact; add a test Opportunity) → verify widgets update within 30 seconds.
3. Remove test data; verify widgets return to pre-test state.
4. Open dashboard from mobile app — confirm widgets render on mobile (may be slightly truncated; acceptable).
5. Stacy + Josh confirm they can see their Default Dashboard = Caramel Oven Daily on both desktop and mobile.

---

## Step 7 — Dashboard maintenance in the operator playbook

Flag for Section 21:

- **Weekly (Stacy, Monday morning):** scan dashboard; action any red widgets (dormant > target · reviews to approve · appointments to confirm).
- **Monthly (Dan + Stacy):** review the dashboard's widget selection — is it still the right 10 widgets? Add/remove based on what's actually being acted on.
- **Quarterly:** reconfigure if business model shifts (e.g., if wholesale becomes dominant and retail shrinks, re-weight the dashboard).

---

## Completion criteria

1. ✅ "Caramel Oven Daily" dashboard built with 10 widgets across 3 rows.
2. ✅ Widget filters configured correctly per spec.
3. ✅ Dashboard set as Default for Dan, Stacy, Josh.
4. ✅ Mobile app installed + logged in on Stacy's and Josh's phones.
5. ✅ Mobile notifications configured per user preferences.
6. ✅ Business Card Scanner tested.
7. ✅ Dashboard smoke test passed.
8. ✅ Empty-at-launch widget expectations documented for operator.

---

## What happens next

**Section 21 — QA + Launch + Handoff** is the final section. End-to-end pre-launch verification, legal review accumulator, CPA verification, go-live, 30-day support window, Snapshot packaging prep.

---

## Flags for this section

- **Assumptions made:** (a) 10 widgets is the right count — enough data, not cluttered; (b) 3-row layout maps to funnel logic (top-of-funnel → ops/revenue → health); (c) Secondary dashboards deferred to post-launch — pattern follows operator emergence; (d) Mobile notifications configured for Stacy/Josh match their roles (Stacy primary, Josh backup); (e) Empty widgets at launch are expected, not broken.
- **Gaps identified:** UI-VERIFY flags on Dashboard creation path, per-widget configuration UX, Default Dashboard per-user setting, Mobile app version compatibility (HighLevel vs Lead Connector white-label).
- **Competing approaches:** (a) Single mega-dashboard vs multiple focused dashboards — chose single primary + optional secondaries for launch simplicity; (b) Include every possible widget vs curated 10 — chose curated for scannability.
- **Client-side blockers:** Stacy/Josh's mobile OS (iOS vs Android) + device familiarity — onboarding session may be needed at Section 21.
- **Platform-level irreversible decisions:** None.

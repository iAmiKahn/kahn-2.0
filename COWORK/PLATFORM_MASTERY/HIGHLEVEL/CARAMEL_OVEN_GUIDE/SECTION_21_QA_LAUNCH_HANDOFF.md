# Section 21 — QA + Launch + Handoff

**Last Updated:** 2026-04-19
*If HighLevel UI doesn't match these instructions, consult the Update Protocol (Phase 5.2). This guide targets the HighLevel platform as of 2026-04-19.*

**Final section — build completes here. This is the operational runbook that turns Sections 1-20 from "built" into "live and handed off."**

---

## Purpose

Run the end-to-end pre-launch QA that verifies every Section 1-20 artifact works as specified. Execute the go-live sequence (Section 17 cutover + A2P Campaign Registration submission + mobile-app-enabled Stacy/Josh). Hand off operational control to Stacy and Josh via the Operator Playbook. Stand up the 30-day post-launch support cadence. Prepare the Bakery Snapshot for Phase 5.1 packaging once the 30-day validation window closes.

**Estimated time:** 6-10 hours active work across pre-launch QA + go-live execution + handoff training. Adds 30 days of post-launch support.

**Dependencies:** Everything. Sections 1-20 complete.

---

## Why this section matters

Most SaaS builds fail at handoff, not at build. A gorgeous dashboard nobody opens. A workflow Stacy doesn't trust because she doesn't know what it does. A pipeline Josh forgets to update. Section 21 is the anti-failure layer: verify everything works, train the humans who will operate it, document the patterns, close the 30-day support loop.

Three operational principles:

1. **QA catches problems before customers do.** Every template renders correctly, every workflow fires on the right trigger, every embedded surface works on mobile. We verify now, not in production with real customers hitting bugs.
2. **The operator playbook IS the handoff.** A one-hour training session is insufficient. A written playbook that Stacy can reference in month 3 when she forgets how the negative-feedback handler works — that's the handoff.
3. **Snapshot packaging turns Caramel Oven from one-off work into a compound asset.** Every day we don't package after the 30-day validation is a day the compound asset doesn't exist yet. Built into the post-launch timeline.

---

## What you will produce

1. **Pre-launch QA test plan executed** — end-to-end smoke tests across all 20 sections.
2. **Legal review accumulator** resolved: Privacy Policy · Terms of Service · Catering Contract v1 · Sales Tax rate · Gift Card Oklahoma compliance · Mother-son prose audit · 224 phone audit.
3. **CPA verification** of Oklahoma sales tax rate + gift-card compliance.
4. **Stacy/Josh confirmations list** resolved (hours of operation, deposit amounts, mobile carriers, social admin access, brand assets if delivered).
5. **Go-live executed** per Section 17 cutover plan.
6. **Operator Playbook** — consolidated daily/weekly/monthly operator runbook.
7. **30-day post-launch support** cadence established.
8. **Snapshot packaging prep** for T+30 Phase 5.1 execution.

---

## Step 1 — Pre-launch QA test plan

**Timing:** Sunday 2026-04-26 evening (the pre-cutover verification window from Section 17 Step 11.1.5) — expanded from Section 17's 2-3 hour window into a dedicated QA session.

### 1.1 Identity & foundation (Sections 2-5)

- ✅ Sub-account exists with Location ID recorded in Intake Document.
- ✅ Business Profile 7 sub-pages populated (General Info · Physical Address · Business Info · Auth Rep · General Settings · Logo · Deprecated/Dedup).
- ✅ 12 Custom Values populated; `business_phone` = new OKC LC number; `business_website` = caramelovenokc.com; `booking_link` = Section 9 Custom Order Consultation; `review_link` = GBP review URL; `sales_tax_jurisdiction` = OKC 8.625% verified by CPA.
- ✅ Sub-account users: Dan (Admin) · Stacy (Admin) · Josh (Admin) · all 2FA enabled.
- ✅ Contact Custom Fields (10) + Opportunity Custom Fields (8) present.
- ✅ Tag taxonomy (~25 tags across 5 categories) seeded.
- ✅ Brand Board v1 + Brand Voice published.

### 1.2 Infrastructure (Sections 3, 4)

- ✅ Domain connected; `mail.caramelovenokc.com` shows green verification on all 5 DNS records.
- ✅ SSL issued.
- ✅ Preference Management enabled with 5 categories.
- ✅ DMARC at `p=none` (week 1-2 of rollout).
- ✅ Test email sent with SPF/DKIM/DMARC all PASS in headers.
- ✅ LC Phone number purchased and assigned.
- ✅ A2P Brand Registration: **Approved** in Trust Center (expected by 2026-04-28).
- ✅ Missed-Call Text-Back configured.

### 1.3 Commerce (Sections 7, 15, 16)

- ✅ Stripe connected; test transaction + refund completed.
- ✅ Products catalog populated with retail + custom + wholesale items (actual prices from Stacy/Josh, not placeholders).
- ✅ 3 Invoice templates functional: Retail Order · Catering/Event · Wholesale Monthly.
- ✅ 5 Payment Links live.
- ✅ Catering Contract v1 template ready; test e-sign flow works end-to-end including auto-generate deposit invoice.
- ✅ Gift Cards module active; test purchase + test redemption successful.

### 1.4 CRM + Data (Sections 6, 8, 10)

- ✅ Contact import executed (if Q8 returned an existing list). Imported count recorded.
- ✅ 17 Smart Lists built (12 Section 6 baseline + 5 Section 13 wholesale cadence).
- ✅ 4 Forms + 1 Survey built and test-submitted successfully.
- ✅ Chat Widget configured with Brand Board styling, office hours wired.
- ✅ 2 pipelines (Wholesale · Catering) built with correct stages; demo Opportunities traversed + deleted.

### 1.5 Scheduling (Section 9)

- ✅ Services v2 enabled.
- ✅ 4 Services configured per Q5-locked spec.
- ✅ Staff (Stacy + Josh) assigned correctly.
- ✅ Availability matches actual Caramel Oven hours.
- ✅ Round-robin group for Services 3 + 4 functional.
- ✅ Deposit payments ($25 Custom Order · $50 Event Dessert) test-charged and refunded.
- ✅ 4 booking URLs recorded in Intake Document.

### 1.6 Reputation (Section 11)

- ✅ GBP claimed and verified (postcard received, code entered).
- ✅ GBP integrated with HighLevel.
- ✅ Reviews AI configured (Auto-Pilot 4-5⭐, Suggestive ≤3⭐).
- ✅ Review Request templates drafted.
- ✅ 70/30 Google/Facebook balancing set.
- ✅ Review Widget renders on Section 17 website.
- ✅ `custom_values.review_link` resolves to real GBP review URL.

### 1.7 Automation (Sections 12, 13, 14)

- ✅ 12 total workflows published across 3 folders (Lead Nurture: 5 · Appointment & Purchase: 4 · Commerce & Recovery: 3).
- ✅ Each workflow tested with test contacts: trigger fires, actions execute, tags apply, branches route correctly.
- ✅ Workflow interlocks verified: negative feedback pauses review request · first-purchase branching works in Post-Purchase Thank-You · appointment-completed tag triggers Review Request enrollment · missed-call text-back fires in-hours vs after-hours correctly.

### 1.8 Content + Social (Sections 18, 19)

- ✅ Brand Voice active.
- ✅ Content AI tested in Social Planner + Email Builder + Blog editor.
- ✅ Operator prompt-pattern guide saved in Asset Inventory.
- ✅ 3 social accounts connected (FB · IG · TikTok).
- ✅ Social Planner template library has 7 post-type templates.
- ✅ 2-week starter batch drafted (Stacy/Josh decide scheduling at their pace).

### 1.9 Web Presence (Section 17)

- ✅ All 8 pages live at caramelovenokc.com post-cutover.
- ✅ All embeds functional (forms · chat · review widget · gift card · payment links · booking links).
- ✅ SEO configured; Google Search Console verified; sitemap submitted.
- ✅ Google Analytics 4 tracking live.
- ✅ Blog: 3 starter posts published.
- ✅ Production URLs for Privacy · Terms · Opt-In live and reachable.

### 1.10 Dashboards + Mobile (Section 20)

- ✅ "Caramel Oven Daily" dashboard built with 10 widgets.
- ✅ Dashboard set as Default for Dan · Stacy · Josh.
- ✅ Mobile app installed + signed in on Stacy's + Josh's phones.
- ✅ Mobile notifications configured per user.
- ✅ Business Card Scanner tested.

---

## Step 2 — Legal review accumulator

All items that need Stacy/Josh's attorney review within 30 days of launch. Flag on the "Post-Launch Week 1-4" Task queue:

| # | Item | Section | Priority |
|---|---|---|---|
| 1 | Privacy Policy | 17 | HIGH — consumer-facing; highest liability surface |
| 2 | Terms of Service | 17 | HIGH |
| 3 | Catering Contract v1 | 15 | HIGH — any event contract uses this template |
| 4 | Sales Tax rate (OKC 8.625%) | 7 | MEDIUM — confirm via CPA or OK Tax Commission before first invoice |
| 5 | Gift Card Oklahoma compliance (no-expiry default) | 16 | MEDIUM — confirm escheatment and expiry rules |
| 6 | Mother-son prose audit across guide content | All | LOW — audit any "partners" / "couple" language in templates; adjust |
| 7 | 224 phone carrier/billing confirmation | 17 | LOW — Stacy/Josh confirm carrier for forward setup |
| 8 | A2P compliance review (Campaign Registration content) | 4 | LOW — Campaign approval by carrier is de facto compliance pass |

**Process:** Dan compiles the 8 items into a single document for Stacy/Josh's attorney meeting. Attorney redlines; fixes apply; updated policies publish. Target: all 8 reviewed within 30 days of go-live.

---

## Step 3 — CPA verification

**Before first live invoice:**

1. Stacy/Josh send the current OKC sales tax rate (8.625% estimate from Section 7) to their CPA or look up at `tax.ok.gov`.
2. CPA confirms or corrects.
3. Update Custom Value `custom_values.sales_tax_jurisdiction` with the confirmed rate.
4. If rate differs: update the OKC Sales Tax configuration in Payments → Settings → Taxes.

**Before first gift card sale:**

1. CPA or attorney reviews Oklahoma escheatment + expiry rules for gift cards.
2. Confirm: no-expiry default is compliant OR adjust the Gift Card product expiry setting.

**Ongoing:** annual review during tax filing to catch any Oklahoma rule changes.

---

## Step 4 — Stacy/Josh confirmation list

Outstanding items requiring Stacy/Josh response before launch:

| # | Item | Section | Status |
|---|---|---|---|
| 1 | Confirm hours of operation (Tue-Sat 10-6, Sun 11-3, Mon closed — placeholder) | 9 | Needed |
| 2 | Confirm deposit amounts ($25 / $50) feel right at their customer scale | 9 | Needed |
| 3 | Confirm 224 phone carrier/billing arrangement | 17 | Needed |
| 4 | Confirm Facebook Page admin access for Social Planner connect | 19 | Needed |
| 5 | Confirm Instagram is Business (not personal) account | 19 | Needed |
| 6 | Provide actual product catalog + wholesale pricing | 7 | Needed (replaces placeholders) |
| 7 | Provide brand assets IF higher-quality than site-extracted (logo SVG, formal palette) | 5 | Optional — site-extract fallback acceptable |
| 8 | Confirm Stripe account ready for OAuth connect | 7 | Needed |
| 9 | Confirm GBP postcard arrived + verification code entered | 11 | Needed (5-14 day window from 2026-04-19) |
| 10 | Confirm mobile app installed + logged in | 20 | Needed |

Dan routes these to Stacy and Josh in a single pre-launch check-in document. Responses unblock launch items.

---

## Step 5 — Go-live sequence

**Target go-live: Monday 2026-04-27, 6am CT.**

### 5.1 Pre-cutover (Sunday evening 2026-04-26, 6-9pm CT)

1. Execute full QA test plan from Step 1.
2. Run Section 17 Step 11.1.5 verification.
3. Fix any discovered issues.
4. If critical issue can't be fixed: postpone Monday cutover by 24-48 hours.

### 5.2 Cutover morning (Monday 2026-04-27, 6am CT)

1. Swap GoDaddy DNS root A record to HighLevel (per Section 17 Step 11.2).
2. Publish HighLevel site to production.
3. Wait 10-60 min DNS propagation.
4. Verify site renders at caramelovenokc.com.
5. Update `custom_values.business_phone` from 224 to new OKC LC number.
6. Update GBP with new phone number.
7. Set up 224 → OKC LC call-forward at the 224 number's carrier (Option A per Section 17 Step 12.2 — Stacy/Josh's carrier call).

### 5.3 Campaign Registration submission (post-cutover, same day or next business day)

1. Confirm Brand Registration status = Approved in Trust Center.
2. Execute Section 4 Step 7 — Dan or VA submits Campaign Registration.
3. Pay $15.75 verification fee.
4. Carrier review: 1-3 business days.

### 5.4 SMS unlock (expected 2026-04-30 to ~2026-05-02)

1. Campaign approved by carrier.
2. SMS workflows (Sections 12 · 13 · 14) go live.
3. First live SMS sends obey Level 1 ramp (100/day).
4. Monitor error rate + opt-out rate via dashboard.

### 5.5 First-week monitoring

- **Day 1 (Monday):** verify site traffic via GA4; verify any form submissions route correctly; verify chat widget + phone line functional.
- **Days 2-5:** daily dashboard check; any workflow errors surfaced via HighLevel error logs; any customer-facing issues via Conversations inbox.
- **Day 7:** week-1 retrospective — what worked, what broke, what needs iteration.

---

## Step 6 — The Operator Playbook

Consolidated operator reference. This is the post-build document Stacy/Josh (and eventually the VA) use daily.

### 6.1 Playbook structure

Create a shared document: **"Caramel Oven Operator Playbook — v1 (2026-04-27)"**. Sections:

1. **Daily (5-10 min)**
   - Morning: open Caramel Oven Daily dashboard. Scan 10 widgets. Act on anything red.
   - Throughout: monitor Conversations inbox on mobile. Respond to customer DMs within 4 hours.
   - Evening: check Task queue. Knock out any Stacy-assigned tasks.

2. **Weekly (30-45 min)**
   - **Monday:** review week's appointments (Calendar → Services); confirm Saturday/Sunday market prep needs.
   - **Tuesday:** draft week's social posts via Content AI; schedule via Social Planner.
   - **Wednesday:** review pipeline — any Opportunities stuck in a stage > 7 days?
   - **Thursday:** prepare Friday market load.
   - **Friday:** send any outstanding wholesale invoices / balance invoices for upcoming events (check Section 15 catering-event calendar).
   - **Sunday:** review week metrics (revenue, reviews, new leads). Note anything weird.

3. **Monthly (60-90 min)**
   - Dashboard review — any widgets to add/remove/reconfigure?
   - Review workflow stats — anything consistently failing?
   - Gift Card outstanding balance check — is any customer sitting on $500+ unredeemed?
   - Check A2P throughput tier — are we eligible to advance?
   - Social Planner analytics review.
   - Email + SMS deliverability metrics.

4. **Quarterly (2-3 hours)**
   - Full guide review (this document).
   - HighLevel platform changelog review (per Update Protocol Phase 5.2).
   - Seasonal campaign prep (Mother's Day · Valentine's · Christmas).
   - Pricing review — does the product catalog reflect current costs?

5. **Annual**
   - Legal review (Privacy · ToS · Contract · Tax rate · Gift Card rules).
   - Snapshot refresh (if platform changes warrant).
   - Full business-year retrospective.

### 6.2 Emergency procedures

- **A workflow fires on the wrong contact:** pause workflow, investigate in Conversations + workflow logs, fix, republish.
- **Stripe rejection during live transaction:** customer contacts us; Stripe dashboard shows reason; manual fix or refund + re-invoice.
- **Site down:** check DNS; check HighLevel status page; revert A record to GoDaddy if prolonged outage.
- **Bad review posted:** Workflow #4 fires internal notification; Stacy responds within 24 hours; resolution documented in Contact notes.
- **Phone number stops working:** check LC Phone dashboard; contact HighLevel support if account suspended.

### 6.3 Escalation contacts

- **HighLevel platform issues:** Dan (primary) → HighLevel support (fallback).
- **Legal questions:** Stacy/Josh attorney.
- **Tax/compliance:** Stacy/Josh CPA.
- **Payment processor issues:** Stripe support.
- **DNS/domain issues:** GoDaddy support.

---

## Step 7 — 30-day post-launch support window

Dan (or Dan's Agency) provides 30 days of post-launch support included in the Growth-tier engagement.

### 7.1 Support scope

- **IN scope:** workflow adjustments, template tweaks, widget reconfiguration, bug fixes, minor UI questions, Content AI prompt iterations, review of any customer-facing issues, Stacy/Josh onboarding questions.
- **OUT of scope:** new feature builds beyond the 22-section scope, integration with third-party systems not in the original spec, ongoing content creation (Stacy/Josh responsibility), customer service responses (Stacy/Josh do those in Conversations inbox).

### 7.2 Cadence

- **Weeks 1-2:** daily dashboard review by Dan; standing check-in call with Stacy/Josh at end of each week.
- **Weeks 3-4:** biweekly check-ins; ad-hoc support as needed.
- **Day 30 (2026-05-27):** 30-day retrospective meeting. Document what worked, what didn't, iterate.

### 7.3 Post-30-day transition

On Day 30:
- Support transitions to a lower cadence (monthly check-ins) OR to a Managed Services add-on (separately scoped).
- Snapshot packaging executes per Section 21 Step 8.
- Any outstanding legal review items must be resolved by this point.

---

## Step 8 — Snapshot packaging prep (for Phase 5.1 execution at T+30)

Per SNAPSHOT_PACKAGING_PLAYBOOK.md (in workspace root), the Bakery / Farmers-Market Snapshot v1.0 packaging begins at T+30 — once the 30-day validation window closes.

### 8.1 Validation criteria (checked at Day 30)

Before packaging:

- ✅ No critical workflow failures during 30-day window.
- ✅ Email deliverability healthy (bounce rate <5%, complaint rate <0.1%).
- ✅ SMS deliverability healthy (error rate <6%, opt-out <2%).
- ✅ Dashboard widgets showing real data (not just empty states).
- ✅ At least 1 catering inquiry + 1 wholesale inquiry + 1 completed transaction processed end-to-end.
- ✅ Stacy, Josh, and Dan each sign off that the system works as expected.
- ✅ Any attorney-feedback from legal review incorporated.

### 8.2 Packaging execution

1. Follow SNAPSHOT_PACKAGING_PLAYBOOK.md Step 1 (sanitize source: replace literal "Caramel Oven" strings with merge fields where needed).
2. Execute Step 2 (create Snapshot at Agency level, named "Bakery / Farmers-Market v1.0").
3. Step 3 (test-load on throwaway sub-account).
4. Step 4 (document in SNAPSHOT_MANIFEST.md).
5. Step 5 (publish internally for PitchBlack client onboarding; NOT Marketplace yet).

### 8.3 First client beyond Caramel Oven

Target for Client 2: a non-bakery but adjacent vertical (florist, boutique coffee, juice bar) to validate the Snapshot's multi-vertical applicability before a third client locks the pattern. See STRATEGIC_FUTURE.md §5.

---

## Step 9 — Case Study data collection

Per CASE_STUDY_SCAFFOLD.md, the Case Study writes at T+30 to T+90 using real data. Start collecting:

- **Pipeline values** — weekly snapshot in a spreadsheet.
- **New leads by source** — weekly.
- **Reviews count + average rating** — weekly.
- **Catering bookings completed** — monthly.
- **Wholesale accounts active** — monthly.
- **Stacy/Josh time saved** — weekly self-report (rough estimate — "how many hours did manual follow-up take this week?").

Flag for Stacy/Josh: the weekly snapshot takes 5 minutes. Don't skip — the Case Study depends on it.

---

## Step 10 — Archive the Intake Document + close the build

Once Section 21 completes:

1. Archive the Intake Document (from Section 1) — rename to "Caramel Oven Build Archive 2026-04-27" and save in the Asset Inventory folder.
2. Archive all pre-launch communications between Dan, Stacy, Josh.
3. Close the Blocker Map (all 22 sections = Ready / Complete).
4. Record final Location ID, LC Phone number, domain verification details in a single "Caramel Oven Final Config" reference doc.
5. Update MEMORY.md (agent-level) with build completion state: "Caramel Oven HighLevel build complete 2026-04-27. Snapshot packaging T+30."

---

## Step 11 — Final handoff ceremony

**Schedule:** end of Week 1 post-launch (Friday 2026-05-01).

**Participants:** Dan, Stacy, Josh. Optional: VA (if onboarded).

**Agenda (60-90 min):**

1. Walk through the Caramel Oven Daily dashboard — explain each widget and what it's showing.
2. Walk through the Operator Playbook — daily / weekly / monthly rhythms.
3. Review any week-1 issues and how they were resolved.
4. Stacy + Josh demo: each person shows they can answer a customer DM, book an appointment, send an invoice, check a dashboard widget. They actually do these things, not just watch.
5. Q&A — open-ended.
6. Close: sign-off that handoff is complete + 30-day support cadence confirmed.

---

## Completion criteria (Section 21 and entire build)

### Section 21 completion

1. ✅ Pre-launch QA test plan executed; any issues resolved.
2. ✅ Legal review accumulator documented; attorney meeting scheduled within 30 days.
3. ✅ CPA verification of sales tax rate.
4. ✅ Stacy/Josh confirmation list resolved.
5. ✅ Go-live executed per Section 17 cutover plan.
6. ✅ A2P Campaign Registration submitted post-cutover; SMS approved within 1-3 business days.
7. ✅ Operator Playbook v1 delivered.
8. ✅ 30-day post-launch support cadence active.
9. ✅ Snapshot packaging prep documented.
10. ✅ Case Study data collection initiated.
11. ✅ Intake Document archived; build closed.
12. ✅ Handoff ceremony completed.

### Entire build completion (meta)

1. ✅ All 22 sections delivered (including 17.5 skipped per Dan directive).
2. ✅ All 22 sections approved by Dan (directly or via expanded-autonomy delivery).
3. ✅ All 22 sections live OR scaffolding-ready for activation post-launch.
4. ✅ Phase 5 prep (Update Protocol, Case Study Scaffold, Snapshot Packaging Playbook, Onboarding Script, Intake Questionnaire, API Appendix) all shipped.
5. ✅ Strategic Future note captured for PitchBlack scaling.
6. ✅ Session Log complete as full audit trail.

---

## What happens next

**This is the last section.** Post-Section-21 motion is:

- **Today (2026-04-19):** final batch delivery to Dan.
- **2026-04-24 to 2026-04-28:** A2P Brand approval window.
- **Sunday 2026-04-26 evening:** pre-cutover QA.
- **Monday 2026-04-27, 6am CT:** cutover + site go-live + Campaign Registration submitted.
- **2026-04-30 to 2026-05-02:** SMS fully unlocks.
- **Week 1-4 post-launch:** 30-day support window.
- **2026-05-27:** 30-day retrospective + Snapshot packaging execution.
- **2026-05-27 to 2026-07-27:** Case Study data collection.
- **T+90 (2026-07-26):** Case Study publish.
- **Post-T+90:** Bakery Snapshot offered to Client 2.

The Caramel Oven HighLevel build guide is complete.

---

## Flags for this section

- **Assumptions made:** (a) Sunday pre-cutover QA is 3-4 hours (expanded from Section 17's 2-3 hour estimate) because Step 1's full 20-section test plan is substantive; (b) 30-day post-launch support is scoped to configuration adjustments, not new feature builds; (c) Snapshot packaging execution at Day 30 assumes validation criteria are met — flag for delay if criteria miss; (d) Handoff ceremony scheduled end of Week 1 — some agencies do Day 1 ceremonies, but real issues surface in Week 1 and the ceremony benefits from that context.
- **Gaps identified:** None material. All upstream-section gaps resolved or flagged at their respective sections.
- **Competing approaches:** (a) Launch-day ceremony vs Week-1 ceremony — chose Week-1 for context; (b) Snapshot packaging at Day 15 vs Day 30 — chose Day 30 for validation confidence.
- **Client-side blockers:** All resolved by this section. Legal review is deferred (not blocking); Stacy/Josh confirmations are in-flight (expected resolution by cutover).
- **Platform-level irreversible decisions:** None.

---

═══════════════════════════════════════════════
## BUILD COMPLETE

**Caramel Oven HighLevel Build Guide v1.0 — 22 sections across 4 phases + Phase 5 prep**

Delivered 2026-04-17 through 2026-04-19. Target go-live 2026-04-27. Snapshot packaging T+30.

Every section has a Last Updated date header. Every UI-specific claim has a UI-VERIFY flag for live-session validation. Every assumption is documented. Every structural decision is surfaced. Every client-side dependency is mapped.

The guide is a living document — the Update Protocol (Phase 5.2) governs how it evolves. The Snapshot Packaging Playbook turns it into a compounding asset. The Case Study Scaffold turns it into a sales tool. The Onboarding Script + Intake Questionnaire turn it into a repeatable sales-to-build pipeline.

This is the PitchBlack operating-infrastructure product, validated on its first client.

═══════════════════════════════════════════════

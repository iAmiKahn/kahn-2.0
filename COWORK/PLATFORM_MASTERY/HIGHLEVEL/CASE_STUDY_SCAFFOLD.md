# Case Study Scaffold — Caramel Oven HighLevel Build

**Status:** TEMPLATE. Sections marked `[FILL POST-LAUNCH]` get populated with real data after the Caramel Oven build goes live and produces measurable results (~30-90 days post-launch).

**Purpose:** Client-facing sales document for future PitchBlack HighLevel engagements — especially other farmers-market vendors, boutique food businesses, and owner-operated local retail.

**Target readers:**
1. **Primary:** other farmers-market vendors / small-batch food businesses evaluating whether HighLevel + PitchBlack consulting is worth it.
2. **Secondary:** general small-business owners in adjacent industries (florist, juice bar, boutique coffee, artisan soap, etc.) where the operational model (owner-operated, weekly-cadence customers, local + some B2B, event-driven premium tier) translates.

**Delivery format:** 1-page executive summary + 4-6 page detailed case study. Stylized in Brand Board-consistent layout (PitchBlack brand, not Caramel Oven's). PDF for distribution; also as a Funnel page for lead capture.

**Last Updated:** 2026-04-17 (scaffold state; pre-launch)

---

## Section 1 — Executive Summary (1 paragraph)

*[FILL POST-LAUNCH after 30-day operational data.]*

Template:

> Caramel Oven Bakehouse is a two-person farmers-market bakery specializing in sourdough, custom cakes, and small-event catering. Before HighLevel, their customer communication ran through a mix of personal cell phones, a Mailchimp list that hadn't been used in 8 months, a Square POS that didn't talk to their catering tracking (a spreadsheet), and Google Reviews managed through the "remember to ask Stacy" method.
>
> In **[N weeks]**, PitchBlack built them a unified operating system on HighLevel that automated appointment confirmations, review requests, wholesale nurture, catering inquiry follow-ups, and customer reactivation. The system went live on **[DATE]**. In the first **[30/60/90] days**, it produced **[N catering bookings]**, **[N wholesale conversions]**, **[N Google reviews]**, and **[X% reduction]** in inbound-inquiry response time.
>
> This case study documents what was built, how it works, and what a similar build looks like for your business.

---

## Section 2 — The Caramel Oven Context (Before HighLevel)

### 2.1 The business

*[FILL POST-LAUNCH]*

Template fields to capture:
- Business type
- Size (employees, volume)
- Revenue streams (B2C retail, B2B wholesale, events/catering)
- Geographic footprint
- Tech stack before HighLevel (POS, email marketing, review management, calendar, payments)

### 2.2 The pain points

*[FILL POST-LAUNCH — interview Stacy and Josh]*

Expected pains to probe during the post-launch interview:
- Missed inquiries (SMS or calls answered late = lost wedding bookings)
- Manual review-request follow-up (forget = low Google-review count = local-SEO weakness)
- Wholesale accounts going quiet without anyone noticing
- Catering leads taking 3-4 days to convert when 24 hours is the window
- Customer data scattered across 3-5 systems with no single source of truth

### 2.3 Why HighLevel vs. alternatives

Why HighLevel over building on HubSpot, ActiveCampaign, or point tools:
- Unified data model (Contacts + Opportunities + Conversations + Payments in one platform)
- One SMS/email sending surface; one CRM; one calendar; one invoice stack
- Owner-operator-friendly pricing (no per-seat billing compound that kills small business budgets)
- Snapshot-based deployment = faster build; lower consulting cost; repeatable pattern across similar businesses

---

## Section 3 — The Build

### 3.1 Scope — what was delivered

Reference the 22-section Phase 3 guide structure. Summary:

- **Foundation (Sections 1-4):** Sub-account setup · Business Profile · Domain + LC Email with SPF/DKIM/DMARC · LC Phone + A2P SMS compliance
- **Data model (Sections 5-8):** 12 contact custom fields · 8 opportunity custom fields · ~20-tag taxonomy · Brand Board + Brand Voice · Stripe + Products catalog · 4 forms + chat widget
- **Pipelines (Section 10):** 2 pipelines (Wholesale · Catering) with 5-6 stages each
- **Automation (Sections 12-14):** 10-12 workflows covering appointment confirmations · review requests · post-purchase thank-you · abandoned cart · 5 lead nurture sequences · dormant reactivation · GBP review responses · negative feedback handling
- **Commerce (Sections 15-16):** Invoice templates · payment links · e-sign catering contracts · gift cards
- **Visibility (Sections 17-20):** Website + funnel + blog · Content AI integration · social planner · dashboards
- **Handoff (Section 21):** Pre-launch QA · operator playbook · 30-day support window

### 3.2 Build timeline

*[FILL POST-LAUNCH with actual dates]*

Template:
- Week 1: [sections ranged]
- Week 2: [sections]
- Week 3: [sections]
- Week N: Go-live
- Total build time: [N weeks]

### 3.3 What was deliberately NOT built

Scope boundaries to document for readers considering the same engagement:
- Membership/Community subscription (deferred to Month 6+)
- Full e-commerce shipping (Caramel Oven is local + market + catering; no national ship)
- Voice AI (evaluated; deferred to see if Conversation AI via chat widget covers the need)
- Paid ads (Ad Manager path built; activation deferred to post-launch data review)

---

## Section 4 — How It Works (Illustrative Flows)

### 4.1 The wholesale inquiry flow

*[FILL with real example from post-launch activity — screenshot the pipeline, the email, the workflow stats]*

Narrative template:

> A potential wholesale client (e.g., a local café) fills out the Catering Inquiry Form on carameloven.com with "Wholesale Account Type: Café" selected. Within 30 seconds, HighLevel:
> - Creates a Contact with `source:website-form`, `segment:b2b-wholesale`, `interest:wholesale` tags.
> - Creates an Opportunity in the Wholesale pipeline, Prospect stage.
> - Enrolls the contact in Workflow #2 (Wholesale Lead Nurture).
> - Creates a task for Stacy: "Send wholesale sample + intro letter."
> - Sends an email confirming inquiry receipt.
>
> Stacy gets a ping. She sends the sample within 2 business days. The workflow waits 5 business days. If the Opportunity stage hasn't moved to "Sample Sent" by then, a Day 7 nudge fires automatically. If still stuck at Day 14, the Opportunity auto-closes to Lost.
>
> Nothing falls through. Every lead gets worked; every dead lead gets cleared.

### 4.2 The catering inquiry flow

*[FILL — illustrate the 3-touch conversion sequence]*

### 4.3 The review-request flow

*[FILL — illustrate how a completed catering event triggers the review request SMS/email and shows up on GBP]*

### 4.4 The dormant reactivation flow

*[FILL — illustrate a B2C regular who went 60 days silent, the "we miss you" email, and the reactivation outcome]*

---

## Section 5 — Results

### 5.1 Operational metrics (30-day snapshot)

*[FILL POST-LAUNCH with actual numbers]*

Template:

| Metric | Before HighLevel | First 30 Days | First 90 Days |
|---|---|---|---|
| Inbound-inquiry response time (avg) | [data] | [data] | [data] |
| Catering inquiries / month | [data] | [data] | [data] |
| Catering inquiries converted to booked consult | [data] | [data] | [data] |
| Active wholesale accounts | [data] | [data] | [data] |
| Google reviews (count / average rating) | [data] | [data] | [data] |
| Customer reactivations (from Dormant list) | N/A | [data] | [data] |
| Email open rate | [data] | [data] | [data] |
| SMS response rate | N/A | [data] | [data] |

### 5.2 Revenue impact

*[FILL — if measurable]*

Capture:
- New wholesale accounts won in first 90 days → $/month recurring revenue added
- Catering bookings delivered in first 90 days → $/month revenue
- Reactivated dormant customers → $ attributable to reactivation emails

### 5.3 Operator time saved

*[FILL via Stacy/Josh interview]*

Template:
- Manual follow-up time before HighLevel: [N hours/week]
- Manual follow-up time after HighLevel: [N hours/week]
- Freed hours redirected to: [baking / new product development / family / etc.]

---

## Section 6 — Operator Testimonial

*[FILL POST-LAUNCH — quote from Stacy, Josh, or both]*

Template:

> "Before Caramel Oven's HighLevel system, we'd lose catering inquiries because we couldn't respond fast enough. Now the system responds within 15 minutes while we're still at the market. We just show up to the tasting with a quote already half-done."
> — Stacy, co-owner

Interview questions to collect quotes:
- What surprised you most about the system once it went live?
- What's one customer-facing moment the system handled that you wouldn't have handled as well manually?
- If you were telling another small-business owner about this, what's the one thing you'd say?

---

## Section 7 — What This Could Look Like For Your Business

*[FILL — adapt for reader's vertical]*

### 7.1 Is this for you?

The Caramel Oven pattern fits if:
- You're owner-operator or very small team (1-5 people).
- You have weekly-cadence B2C customers AND some B2B / event / catering revenue.
- Customer communication currently happens in 3+ disconnected tools.
- You've lost deals because manual follow-up didn't happen fast enough.
- You sell locally (farmers market, storefront, or metro delivery) — not national e-commerce.

### 7.2 What's different for your vertical

Brief vertical-specific adaptation notes. Examples:

**For a florist:**
- Wholesale pipeline → event/venue partnerships (weddings, hotels, corporate accounts).
- Catering pipeline → wedding / funeral / corporate event flower orders.
- Dormant reactivation → seasonal campaigns (Mother's Day, Valentine's, Christmas, anniversary).

**For a boutique coffee roaster:**
- Wholesale pipeline → café accounts (similar to bakery wholesale but with cupping-session consult instead of tasting).
- Catering pipeline → corporate coffee deliveries, event espresso bars.
- Dormant reactivation → subscription-lapse recovery (for subscription roasters).

**For a juice bar / smoothie shop:**
- Wholesale pipeline → gym / yoga studio / office delivery accounts.
- Catering pipeline → corporate wellness events, private party smoothie bars.
- Dormant reactivation → loyalty punch-card customers who've stopped visiting.

### 7.3 How to get started

CTA template:

> Want to explore whether this pattern fits your business? Book a 30-minute consultation:
>
> **[booking link]**
>
> Or email [PitchBlack contact email].

---

## Section 8 — Reusable Snapshot (the compounding asset)

### 8.1 What's a Snapshot?

HighLevel's "Snapshot" feature packages an entire sub-account's configuration — workflows, pipelines, calendars, custom fields, funnels, templates, tags — into a reusable template. Caramel Oven's finished build became the **Bakery / Farmers-Market Snapshot**.

### 8.2 How future clients benefit

When a second farmers-market bakery (or similar small-food-retail business) engages PitchBlack:
- Day 1: Snapshot loaded into their new sub-account. **Days 1-14 of Caramel Oven's build are compressed into 15 minutes.**
- Days 2-5: Customization pass (brand assets, product catalog, legal entity specifics, integrations).
- Days 6-10: Staff training + go-live.

**Total rebuild time for client N+1 is ~2 weeks vs. Caramel Oven's ~4-6 weeks.** The Snapshot is the compounding asset.

### 8.3 Snapshot availability

The Snapshot is a PitchBlack consulting asset. It's loaded into client sub-accounts as part of the engagement; it's not sold standalone (at least initially). Future: possible App Marketplace listing (HighLevel's distribution channel for agency snapshots) — see STRATEGIC_FUTURE.md.

---

## Scaffold completion criteria

The case study is publishable when:

1. ✅ Sections 1, 2.1, 2.2, 2.3 filled in from post-launch interview + system records.
2. ✅ Sections 3.2 (build timeline) filled with actual dates.
3. ✅ Sections 4.1-4.4 illustrated with real examples (screenshots + workflow stats).
4. ✅ Section 5.1-5.3 populated with 30-day (ideally 90-day) metrics.
5. ✅ Section 6 testimonial quote captured and approved by Stacy/Josh.
6. ✅ Section 7.2 vertical adaptations reviewed for accuracy.
7. ✅ PDF layout applied (Brand Board-consistent styling; NOT Caramel Oven's brand — PitchBlack's).
8. ✅ Reviewed and approved by Dan + Stacy + Josh.

Target publication: 90 days post-launch. Earlier (30 days) possible with a "Early Results" framing if the metrics are strong.

---

## Metrics to start tracking NOW (pre-launch)

For the post-launch case study to have credible before/after data, start tracking:

**In the live Caramel Oven sub-account dashboards (Section 20):**
- Pipeline values (wholesale + catering) — weekly snapshots
- New leads captured (by source) — weekly
- Review count + average rating — weekly
- Active customers (Smart List count) — weekly
- Dormant customers (60d+ Smart List count) — weekly

**Stacy/Josh manually report:**
- Weekly hours spent on customer follow-up (subjective; calibrate as ±20%)
- "Missed opportunity" moments (leads that slipped through before HighLevel) — document when Stacy/Josh recall them

30 days of tracking = solid case-study baseline.

---

## What this scaffold does NOT include

- Final Case Study prose — writes at T+30 or T+90 based on real data.
- Legal review — if Stacy/Josh want their quotes and business details published, get written consent.
- Brand design — PDF layout happens in design tool (Canva, InDesign, Figma) not in this markdown.
- PDF build — deferred to post-launch.

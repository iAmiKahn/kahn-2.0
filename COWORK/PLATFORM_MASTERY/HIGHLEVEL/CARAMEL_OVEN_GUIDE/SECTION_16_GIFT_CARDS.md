# Section 16 — Gift Cards

**Last Updated:** 2026-04-19
*If HighLevel UI doesn't match these instructions, consult the Update Protocol (Phase 5.2). This guide targets the HighLevel platform as of 2026-04-19.*

---

## Purpose

Activate HighLevel's native Gift Cards module so Caramel Oven can sell digital gift cards (Mother's Day · Valentine's Day · Christmas · Birthday drivers) AND issue gift cards without purchase (promo rewards, service recovery, thank-you gestures). Build the sale surfaces (checkout link · embed · QR) and document the redemption flow.

**Estimated time:** 45-60 minutes.

**Dependencies:**
- Sections 2, 5, 7, 15 complete.
- Stripe active (Section 7).
- Brand Board v1 for card artwork styling (Section 5).

---

## Why this section matters

Gift Cards are a **seasonal revenue driver** for a bakery. Mother's Day alone typically accounts for 3-8% of annual bakery revenue in gift-card sales. Valentine's Day, Christmas, birthdays compound. Without a gift card product:
- Caramel Oven misses pre-paid revenue spikes that smooth cash flow.
- Mother's Day marketing has no call-to-action beyond "come to the market" — weaker conversion than "give Mom a Caramel Oven gift card."
- Service recovery (customer got a bad batch) has no graceful remedy — either full refund or awkward replacement. A gift card closes gracefully.

**Three Caramel Oven-specific patterns:**

1. **Seasonal campaigns.** Mother's Day gift card email 2 weeks ahead; Valentine's 10 days ahead; Christmas 3 weeks ahead. Workflow triggers pre-built here; Section 13/14 Marketing campaigns activate them.
2. **Service recovery tool.** Workflow #4 Negative Feedback Handler (Section 12) can send a gift card as part of recovery. Stacy manually approves; workflow fires the Send Gift Card action.
3. **Wholesale gift card program.** Corporate buyers can buy bulk gift cards as employee appreciation. Single Payment Link, $X increments, bulk sent.

---

## What you will produce

1. **Gift Card Product configured** with artwork + denominations + expiry + terms.
2. **3 denomination tiers** ($25 · $50 · $100) + custom-amount option.
3. **Checkout link** for self-service gift card purchase.
4. **Embed code** for Section 17 website "Buy a Gift Card" button.
5. **QR code** for Mother's Day / seasonal signage.
6. **Send Gift Card flow** documented for operator-initiated gifts (no purchase).
7. **Redemption flow** documented for customer use at checkout.
8. **Seasonal campaign scaffolding** — placeholder workflow/campaign stubs for Mother's Day et al. (built out in Section 19 Social Planner + Section 13/14 workflows).

---

## Step 1 — Enable Gift Cards module

**Where:** Payments → Gift Cards. [UI-VERIFY]

1. If Gift Cards module is not yet active on the sub-account, enable it (may require Agency-level toggle).
2. Confirm Stripe connection (from Section 7) is live — Gift Cards use Stripe for purchase transactions.

---

## Step 2 — Create the Gift Card Product

**Where:** Payments → Gift Cards → **+ Create Gift Card**. [UI-VERIFY exact button label]

### 2.1 Basic config

1. Name: **"Caramel Oven Gift Card"**.
2. Description (customer-facing): *"A Caramel Oven gift card: caramels, cookies, custom orders, and more. Redeemable online or at the farmers market."*
3. Artwork: upload a branded image. Use Brand Board v1 colors. For initial launch, simple text-on-color (caramel brown `#8B4513` background, "Caramel Oven Gift Card" in Playfair Display). Stacy can design a richer version later.

### 2.2 Denominations

- **$25** — "Sweet Treat" tier (a box of caramels or dozen cookies).
- **$50** — "Bakehouse Standard" tier (mixed gift box or small event platter).
- **$100** — "Celebration" tier (custom cake starter or full catering platter).
- **Custom amount** — enabled; minimum $10, maximum $500.

### 2.3 Expiry + terms

- **Expiry:** No expiry (recommended) OR 24 months from purchase date. Oklahoma state law varies on gift-card expiry rules — **verify with Stacy/Josh's CPA before first sale**. Oklahoma currently prohibits expiration on gift cards under certain conditions; default to "No expiry" for compliance safety.
- **Terms (shown on gift card + at purchase):**
  - Valid for any Caramel Oven product or service.
  - Not refundable for cash.
  - If lost/stolen: we can reissue with proof of purchase.
  - Redeemable at farmers market (Saturdays), custom orders, catering, or online checkout.

### 2.4 Save

Gift Card product is now active.

---

## Step 3 — Sell Gift Cards — 4 surfaces

**Where:** Gift Cards → Selling Surfaces. [UI-VERIFY]

### 3.1 Dedicated checkout link

URL: `link.caramelovenokc.com/gift-card` (customized).

Customer flow: click link → pick denomination → enter recipient details (or self-purchase) → pay via Stripe → gift card delivered via email OR SMS (customer's choice) OR PDF download.

Share via: Instagram bio, Facebook posts, email signature, SMS campaigns, QR code.

### 3.2 Embed code

For Section 17 website: embed a "Buy a Gift Card" block on the Home page and Order page. HighLevel generates the JS snippet.

### 3.3 QR code

Generate a QR that points to the checkout link. Print on:
- Farmers market booth signage (especially pre-Mother's Day).
- In-person customer-facing business cards.
- Email footer seasonal promos.

### 3.4 Add to existing checkouts

Funnel order pages (Section 17) can add a "gift card upsell" option at checkout. Customer adds a $25 or $50 gift card to their own order for someone else. Configure in Section 17.

---

## Step 4 — Send Gift Cards (operator-initiated, no purchase)

**Purpose:** Stacy/Josh issue a gift card to a customer as a gift, recovery, or promo — without charging anyone.

**Where:** Payments → Gift Cards → **Send Gift Card**. [UI-VERIFY]

### 4.1 Send flow

1. Click Send Gift Card.
2. Select recipient: existing Contact OR enter email/phone for new recipient.
3. Select denomination: $10 · $25 · $50 · $100 · custom.
4. Select delivery channel:
   - **Email** (HTML card with branding).
   - **SMS** (text with redemption code + link).
   - **PDF** (downloadable; Stacy can print and hand-deliver).
   - **QR code** (print on a greeting card).
5. Add personal note (optional): *"Thanks for being part of Caramel Oven. — Stacy"*
6. Send.

### 4.2 Common operator triggers

- **Customer recovery:** Workflow #4 Negative Feedback Handler (Section 12) creates a task for Stacy; resolution may include sending a $25 gift card.
- **Birthday recognition:** if contact has `contact.birthday` populated, a birthday workflow (built in Section 13 Dormant Reactivation OR as a new Section 13 birthday workflow in Month 6+) can auto-send a $10 gift card. **Not built at launch** — flagged for post-launch iteration.
- **Referral rewards:** if a customer refers another customer who completes a purchase, Stacy manually sends a thank-you gift card. Pattern: create internal task in Workflow #2 Post-Purchase Thank-You when contact has `behavior:referred-us` tag set manually.

---

## Step 5 — Redemption flow

### 5.1 Online redemption

Customer at checkout (Section 17 website OR Payment Link):

1. At checkout, enter the gift card code in the "Apply Gift Card" field.
2. Gift card balance deducts from total.
3. If gift card balance > order total: remainder stays on gift card for next use.
4. If gift card balance < order total: customer pays difference via card/Apple Pay/Google Pay.

### 5.2 In-person redemption (farmers market)

Customer presents gift card (email, PDF, or QR). Stacy/Josh:

1. Open the Gift Card Dashboard on mobile (HighLevel mobile app).
2. Scan QR or enter code.
3. Confirm balance.
4. Redeem amount of purchase.
5. Transaction recorded in Payments.

### 5.3 Tracking

Gift Card Dashboard (Payments → Gift Cards → Dashboard) shows:
- Total cards issued.
- Total redeemed.
- Outstanding balance (liability for Caramel Oven).
- Expiration pipeline (if expiry enabled).

Include in Section 20 Dashboards as a widget.

---

## Step 6 — Seasonal campaign scaffolding

**Pre-built placeholders** for marketing drivers. Full campaign copy + scheduling in Section 19 (Social Planner) and Section 13/14 (Workflows).

### 6.1 Mother's Day (May)

- **Start date:** 3 weeks before Mother's Day.
- **Channel mix:** Social Planner posts (IG/FB/TikTok) · email campaign to existing customer list · SMS reminder to opted-in subscribers · in-store QR signage.
- **Messaging:** "Give Mom something she'll remember — Caramel Oven gift cards start at $25."
- **Goal:** 25+ gift card sales pre-holiday.

### 6.2 Valentine's Day (February)

- **Start date:** 10 days before.
- **Messaging:** "For the person who makes everything sweeter — a Caramel Oven gift card."
- **Goal:** 15+ sales pre-holiday.

### 6.3 Christmas (December)

- **Start date:** 3 weeks before (December 1-ish).
- **Messaging:** "Last-minute gift? Digital delivery. Caramel Oven gift cards for anyone on your list."
- **Goal:** 50+ sales (holiday peak).

### 6.4 Birthday (year-round)

- **Pattern:** Section 13 dormant reactivation workflow includes a birthday path. If `contact.birthday` is within 30 days, include a "Give yourself a birthday gift" gift card nudge.

**These are scaffolding notes** — actual campaign emails + social posts get drafted in Section 19 with Content AI (Section 18) assistance. The gift-card infrastructure is ready to support them.

---

## Step 7 — Test

1. Open the gift card checkout link in incognito.
2. Pick $25 denomination.
3. Enter recipient details (use your personal email).
4. Pay with test card.
5. Verify:
   - Gift card email lands with branded artwork + code + redemption instructions.
   - Stripe transaction appears.
   - Gift Card Dashboard shows 1 card issued, $25 outstanding balance.
6. Test redemption: create a test Payment Link for $10; apply the gift card code; verify $15 balance remains on gift card.
7. Clean up.

---

## Step 8 — Update operator playbook

Flag for Section 21:

- **Weekly gift card review:** check Gift Card Dashboard for outstanding balance — the outstanding balance is a liability (customers hold it; Caramel Oven owes them product). Track.
- **Annual Oklahoma compliance check:** verify gift-card expiry / escheatment rules have not changed (state law).
- **Seasonal campaign activation:** trigger Mother's Day campaign 3 weeks pre-holiday; Valentine's 10 days pre; Christmas 3 weeks pre.

---

## Completion criteria

1. ✅ Gift Cards module enabled.
2. ✅ Caramel Oven Gift Card product configured with artwork + 3 denominations + custom + terms.
3. ✅ Checkout link live.
4. ✅ Embed code saved for Section 17.
5. ✅ QR code generated.
6. ✅ Send Gift Card flow documented.
7. ✅ Redemption flow documented (online + in-person).
8. ✅ Seasonal campaign scaffolding documented (Mother's Day · Valentine's · Christmas · Birthday).
9. ✅ Test purchase + redemption passed.
10. ✅ Section 21 playbook updated with weekly outstanding-balance review + annual compliance check.

---

## What happens next

**Section 17 — Website + Funnel + Blog** (MANDATORY CHECK-IN). The gift card embed code + checkout link get placed on the website; production URLs finalize; A2P Campaign Registration readiness confirms.

---

## Flags for this section

- **Assumptions made:** (a) 3 denominations ($25/$50/$100) + custom covers most use cases; (b) No-expiry default for Oklahoma compliance safety; (c) Mother's Day as highest-leverage seasonal driver based on industry baseline for small-bakery gift-card revenue; (d) Service recovery gift-card pattern manual (Stacy approves) rather than auto.
- **Gaps identified:** UI-VERIFY flags on Gift Cards enable path, Create Gift Card UX, Send Gift Card flow, redemption scanner on mobile.
- **Competing approaches:** (a) Physical plastic gift cards vs digital-only — chose digital-only (cheaper, instant delivery, no inventory); Stacy can add physical for premium gifting later; (b) Fixed expiry vs no-expiry — no-expiry per Oklahoma law safety; (c) Gift card embedded in every checkout vs separate sale page — both (Section 17 puts it on website AND standalone link exists).
- **Client-side blockers:** None.
- **Legal note:** gift-card expiration and escheatment (unclaimed-property) rules vary by state. Oklahoma has specific statutes. Stacy/Josh's CPA or attorney should confirm before first sale. Flagged in Section 21 pre-launch.
- **Platform-level irreversible decisions:** None.

# Section 7 — Stripe + Products Catalog

**Last Updated:** 2026-04-19
*If HighLevel UI doesn't match these instructions, consult the Update Protocol (Phase 5.2). This guide targets the HighLevel platform as of 2026-04-19.*

---

## Purpose

Stand up Caramel Oven's payment rail: create a Stripe account, connect it to HighLevel, configure Oklahoma sales tax, build the Products catalog that Invoices (Section 15) and Payment Links (Section 15) and Order Forms (Section 8) and Gift Cards (Section 16) all reference. By the end of this section, Caramel Oven can accept payment via HighLevel for anything it sells.

**Estimated time:** 60-90 minutes active work. Stripe account creation takes 15-20 minutes (Stacy or Josh action — government-ID upload + banking info). Stripe approval for first-time accounts: typically instant to 2 business days.

**Dependencies:**
- Section 2 complete.
- **Q3 RESOLVED 2026-04-19:** No existing Stripe account. Step 1 below = Stacy/Josh create one.
- **Q10 answered:** product catalog from Stacy/Josh. If still pending, use the site-extracted baseline (Caramels, Cookies, "And More…") as a starting point; refine when real catalog arrives.

---

## Why this section matters

Every dollar Caramel Oven collects through HighLevel flows through Stripe: invoice payments, custom-order deposits, payment-link checkouts, event-booking partial payments (Section 9), gift card sales (Section 16), and eventually e-commerce store transactions if ever activated.

Without Stripe, most of the build's commerce capabilities are inert — invoices can be generated but not collected; payment links don't render; Section 9 paid bookings fail. Stripe is the single hinge.

Three non-obvious principles for this section:

1. **Stripe is Stacy or Josh's account, not Dan's Agency.** The money flows to Caramel Oven's bank account directly. Dan's Agency does not take a cut at the payment layer; any agency fees are billed separately.
2. **Sales tax in Oklahoma is municipality-variable.** Oklahoma state tax (~4.5%) plus OKC municipal tax (~4.125%) plus Oklahoma County tax — effective rate typically 8.625% at OKC storefront pickups. HighLevel Products/Taxes must reflect this; wrong tax = tax-authority problems later.
3. **Build the Products catalog BEFORE the Invoices/Payment Links sections.** Products are the atomic unit; Invoices reference them. Backwards order creates rebuild work.

---

## What you will produce

1. **New Stripe account** for Caramel Oven Bakehouse LLC, activated and receiving-ready.
2. **Stripe connected to HighLevel sub-account** via OAuth.
3. **Oklahoma sales tax configured** — OKC-specific rate applied to taxable products.
4. **Products catalog built** — retail SKUs (caramels, cookies, "and more" items), catering/event pricing tiers, wholesale tiers.
5. **Payment methods enabled** — card, Apple Pay, Google Pay, ACH (optional for wholesale), Afterpay/Klarna BNPL (optional; evaluate post-launch).
6. **Test transaction verified** — $1.00 test charge processed and refunded, confirming the full loop works.
7. **Custom Values updated** — `custom_values.sales_tax_jurisdiction` populated per Section 2 placeholder.

---

## Step 1 — Create a Stripe account (Stacy / Josh action)

**Who does this:** Stacy or Josh. Dan provides instructions; owners execute because the Stripe account is THEIR business account with Caramel Oven's banking info.

### 1.1 Prerequisites gathered

Stacy and Josh need to have ready:
- **Caramel Oven Bakehouse LLC** — full legal name from state registration.
- **EIN** — the same one confirmed in Q1a (>90 days old; no risk).
- **Oklahoma business address** — matches the Business Profile address from Section 2 and the A2P Brand Registration from Section 4.
- **Bank account** for Caramel Oven (routing + account number). If they haven't opened a business bank account yet, do that first.
- **Government ID** for the Authorized Representative — uploaded for Stripe's KYC.
- **Website URL** — `https://caramelovenokc.com` (already live; Stripe requires a business URL).

### 1.2 Create the account

1. Navigate to `stripe.com/register`.
2. Create account with Stacy's or Josh's email (match whichever owner handles payments operationally).
3. Verify the email link.
4. Complete the business profile:
   - Business type: **Company** (not Individual — Caramel Oven is an LLC).
   - Industry / category: **Food & Beverage** or **Retail**.
   - Business website: `https://caramelovenokc.com`.
   - Product description: 1-2 sentences on what Caramel Oven sells.
5. Add banking info (routing + account for deposits).
6. Upload government ID for the Authorized Representative.
7. Review and submit.

### 1.3 Wait for Stripe approval

- Typical: instant to 2 business days.
- If Stripe requests additional documentation: respond promptly. Common requests for new accounts include EIN verification letter (IRS CP 575) and business bank statement.
- Dashboard shows account status at `dashboard.stripe.com`. "Account activated" = ready to receive payments.

**Do NOT proceed to Step 2 until Stripe shows "Activated."**

### 1.4 Save Stripe credentials

Stripe issues API keys (Publishable Key + Secret Key) in Developers → API keys. These are NOT manually copied into HighLevel for the OAuth flow (Step 2 handles this automatically) but should be recorded in Stacy/Josh's password manager for future reference.

---

## Step 2 — Connect Stripe to the Caramel Oven sub-account

**Where:** Settings → Payments → Integrations (or Payments → Settings → Integrations). [UI-VERIFY exact label]

### 2.1 Initiate the OAuth connection

1. Inside the Caramel Oven sub-account, navigate to the Stripe integration page.
2. Click **Connect Stripe** (or equivalent).
3. Browser redirects to Stripe. Stacy or Josh logs into the Caramel Oven Stripe account (created in Step 1).
4. Approve HighLevel's authorization request. Stripe redirects back to HighLevel.
5. HighLevel confirms the connection with a green "Connected" indicator.

### 2.2 Set Stripe as the default payment processor

1. Settings → Payments → Default Payment Processor = **Stripe**.
2. Save.

Any downstream Invoice / Payment Link / Order Form / Calendar-payment flow now routes through Stripe by default.

### 2.3 Confirm payment methods are enabled

Stripe supports multiple payment methods; HighLevel exposes which ones to offer at checkout.

1. Payments → Settings → **Payment Methods**. [UI-VERIFY]
2. Enable:
   - ✅ **Card** (Visa, Mastercard, Amex, Discover) — default-on, keep.
   - ✅ **Apple Pay** — mobile-heavy bakery customers; enable.
   - ✅ **Google Pay** — same rationale.
   - ✅ **ACH Debit** (Bank transfer) — enable for wholesale invoice payments (cheaper than card for large B2B transactions).
   - Consider post-launch: **Afterpay** / **Klarna** (BNPL) — good for $100+ custom-order deposits; evaluate whether Caramel Oven's price points justify the friction.

---

## Step 3 — Configure Oklahoma sales tax

Oklahoma sales tax is a layered calculation: state + county + city. OKC effective rate is typically **8.625%** (varies slightly; verify with OK Tax Commission).

### 3.1 Enable tax calculation in HighLevel

1. Payments → Settings → **Taxes**. [UI-VERIFY]
2. Enable "Apply taxes to products."
3. Tax type: **Inclusive or Exclusive** — choose **Exclusive** (tax shown separately on invoices; customer sees the subtotal and then the tax line). Standard US practice.

### 3.2 Create the OKC sales tax rate

1. **+ New Tax Rate**.
2. Name: **OKC Sales Tax**.
3. Rate: **8.625%** (VERIFY: use current rate from `tax.ok.gov`; rates change).
4. Jurisdiction: **Oklahoma City, Oklahoma, USA**.
5. Save.

### 3.3 Handling tax-exempt wholesale

Wholesale customers with a resale certificate are tax-exempt. Flag these contacts with tag `tax:exempt-wholesale`. When invoicing them, manually select "No tax" on the invoice before sending. Automation of this is possible via Workflow action "Update Invoice Tax" but adds complexity; recommend manual for launch.

### 3.4 Update Custom Value

1. Settings → Custom Values → `custom_values.sales_tax_jurisdiction`.
2. Replace the placeholder value with: `OKC Sales Tax (8.625% — verify current rate at tax.ok.gov before invoicing)`.
3. Save.

**Disclaimer:** sales tax calculation is a legal/tax matter. Caramel Oven's actual rate should be verified with a CPA or Oklahoma Tax Commission. The rate above is a starting estimate — do not accept it as definitive.

---

## Step 4 — Build the Products catalog

**Where:** Payments → Products → **+ New Product**. [UI-VERIFY]

### 4.1 Product model

Each Product in HighLevel has:
- **Name** — customer-facing label.
- **Description** — short copy shown at checkout.
- **Price** — can be fixed or variable (per-quantity).
- **Product type** — One-Time (single charge) or Recurring (subscription).
- **Price variants** — multiple price points for a single product (e.g., small/medium/large).
- **Tax category** — which tax rate applies (OKC Sales Tax from Step 3).
- **Image** — optional; recommended for order-form display.

### 4.2 Retail products — baseline for Caramel Oven

Based on site extraction (Q10 not yet returned with full menu; this is a first-pass):

| Product name | Type | Starter price | Variants | Tax |
|---|---|---|---|---|
| Salted Caramels (box of 6) | One-Time | $12 | — | OKC Sales Tax |
| Salted Caramels (box of 12) | One-Time | $22 | — | OKC Sales Tax |
| Signature Chocolate Chip Cookies (half dozen) | One-Time | $10 | — | OKC Sales Tax |
| Signature Chocolate Chip Cookies (dozen) | One-Time | $18 | — | OKC Sales Tax |
| Sugar Cookies (decorated) | One-Time | $3.50 each | Minimum 6 for custom design | OKC Sales Tax |
| Gift Box — Mixed Sweets | One-Time | $25 / $40 / $60 | Small / Medium / Large | OKC Sales Tax |

**These are PLACEHOLDER prices.** Replace with Caramel Oven's actual pricing from Stacy/Josh. Current retail prices on the site's "Order Now" flow (if visible in GoDaddy Website Builder) are the authoritative source.

### 4.3 Custom / catering products

Products with variable pricing — quote happens during consultation (Section 9). Create baseline entries:

| Product name | Type | Starter price | Variants | Tax |
|---|---|---|---|---|
| Custom Cake — Small (serves 8-12) | One-Time | $60 starting | Priced at consultation | OKC Sales Tax |
| Custom Cake — Medium (serves 20-30) | One-Time | $150 starting | Priced at consultation | OKC Sales Tax |
| Custom Cake — Large (serves 50+) | One-Time | $300 starting | Priced at consultation | OKC Sales Tax |
| Catering — Dessert Platter (serves 25) | One-Time | $150 | — | OKC Sales Tax |
| Catering — Dessert Platter (serves 50) | One-Time | $275 | — | OKC Sales Tax |
| Catering — Custom Quote | One-Time | Variable | Quoted post-consultation | OKC Sales Tax |

### 4.4 Wholesale tier products

Separate SKUs for wholesale (no retail markup):

| Product name | Type | Wholesale price | Notes | Tax |
|---|---|---|---|---|
| Caramels — Wholesale (dozen) | One-Time | $X (discount from retail) | B2B only | May be tax-exempt per §3.3 |
| Cookies — Wholesale (dozen) | One-Time | $X | B2B only | May be tax-exempt |
| Standing Order — Wholesale Monthly | Recurring | $X / month | Subscription product; bills monthly | May be tax-exempt |

Wholesale pricing TBD from Stacy/Josh. Use placeholder $ values until confirmed.

### 4.5 Gift Cards product (Section 16 placeholder)

Do NOT create gift card products in Step 4 — those are configured separately in Section 16's Gift Cards flow. Creating gift cards here as regular products bypasses the tracking / redemption / expiry logic that the native Gift Cards module handles.

### 4.6 Import from Stripe

If Stripe already has products configured (e.g., from a prior provisional setup), use **Payments → Products → Import from Stripe** to bulk-load rather than manually retyping. Since Q3 = no existing Stripe, this path is not relevant today; flag for future if products are ever duplicated across systems.

---

## Step 5 — Configure payment method display

**Where:** Payments → Settings → **Payment Method Display**. [UI-VERIFY]

Controls which payment methods are offered at checkout for invoices, payment links, and order forms:

- **Invoices:** Card + ACH Debit enabled (wholesale benefits from ACH).
- **Payment Links:** Card + Apple Pay + Google Pay (retail customers; fast mobile checkout).
- **Calendar Bookings (Services):** Card only (simplicity; consult deposits).
- **Order Forms (Section 8):** Card + Apple Pay + Google Pay.

---

## Step 6 — Test the full loop

Before declaring Section 7 complete, run a smoke test:

1. Create a test Payment Link: Payments → Payment Links → **+ New** → pick a product → generate link.
2. Open the link in an incognito browser (mimics a customer).
3. Use Stripe's test mode card (`4242 4242 4242 4242`, any future expiry, any CVV) if Stripe is in test mode.
4. **If live mode:** charge $1.00 using a real card; refund immediately afterward.
5. Verify:
   - Payment appears in Payments → Transactions.
   - Stripe dashboard shows the transaction.
   - Tax line is calculated correctly.
   - Receipt email was generated.
6. Refund the test charge.

---

## Step 7 — Integrate with downstream sections (forward-pointers)

Products built in Step 4 are referenced by:

- **Section 8 Forms** — Custom Order Inquiry form uses Catering / Custom Cake products in the Payment Element field.
- **Section 9 Calendars (Services)** — Custom Order Consultation + Event Tasting services reference partial-deposit products.
- **Section 15 Invoices** — invoices pull line items from Products.
- **Section 15 Payment Links** — every payment link references a Product.
- **Section 16 Gift Cards** — Gift Card products created via the Gift Cards module (not manual Product creation).

No Step 7 action in Section 7 itself — this is a note for downstream sections to reference the Products catalog by name.

---

## Completion criteria

1. ✅ Stripe account created and activated (Stacy or Josh).
2. ✅ Stripe connected to HighLevel sub-account via OAuth.
3. ✅ Default Payment Processor = Stripe.
4. ✅ Payment methods enabled (Card + Apple Pay + Google Pay + ACH Debit).
5. ✅ Oklahoma sales tax configured (OKC Sales Tax 8.625% — verify current rate).
6. ✅ Custom Value `sales_tax_jurisdiction` populated.
7. ✅ Products catalog built (retail + custom/catering + wholesale tiers — prices placeholder if Q10 still pending final menu).
8. ✅ Test transaction verified end-to-end.
9. ✅ Intake Document updated.

---

## What happens next

**Section 9 (Calendars + Services)** uses Products for Services pricing (paid consults reference products from Step 4).

**Section 15 (Invoices + Payment Links + Documents & Contracts)** builds directly on this section.

**Section 16 (Gift Cards)** activates the Gift Cards module using the connected Stripe account.

**Section 11 (Reputation)** is independent of payment; runs in parallel.

---

## Flags for this section

- **Assumptions made:** (a) Stripe is the only payment processor needed — no PayPal / Authorize.net / Square for Caramel Oven; (b) Oklahoma sales tax rate of 8.625% is starting estimate — Stacy/Josh or their CPA should verify against current OK Tax Commission data before first live invoice; (c) wholesale pricing placeholder — Stacy/Josh supply actual B2B rates; (d) retail prices in Step 4.2 are estimates derived from site analysis and industry baseline — must be validated against actual current pricing; (e) ACH Debit enabled for wholesale only — not surfaced at retail checkout (keeps UX simple).
- **Gaps identified:** UI-VERIFY flags on Payments → Integrations path, Tax Rates configuration UX, Payment Method Display location, Import from Stripe option path. Full Q10 menu still pending — product catalog is first-pass.
- **Competing approaches:** (a) Stripe vs Square — chose Stripe for broader feature depth (Afterpay/Klarna/ACH all Stripe-native) and HighLevel's deeper Stripe integration; (b) Tax Inclusive vs Exclusive — chose Exclusive per US standard (tax shown as separate line); (c) Immediate Gift Card creation as regular product vs deferred to Section 16 — deferred to Section 16 to use native Gift Card module; avoid bypassing tracking/expiry logic.
- **Client-side blockers resolved:** Q3 (no existing Stripe → create one in Step 1).
- **Client-side blockers remaining:** Q10 final menu (informs Step 4 product catalog); Stacy/Josh's actual pricing (blocks final catalog).
- **Platform-level irreversible decisions:** None. Products can be edited/deleted; Stripe can be disconnected.
- **Legal/tax disclaimer embedded:** sales tax rate must be verified; Caramel Oven's CPA should review before first invoice.

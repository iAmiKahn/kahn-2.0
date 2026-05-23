# Section 15 — Invoices, Payment Links, Documents & Contracts

**Last Updated:** 2026-04-19
*If HighLevel UI doesn't match these instructions, consult the Update Protocol (Phase 5.2). This guide targets the HighLevel platform as of 2026-04-19.*

---

## Purpose

Turn the Stripe + Products foundation from Section 7 into operational commerce surfaces. Build reusable Invoice templates for wholesale + custom orders + event invoicing. Create Payment Link templates for common one-off purchases. Configure Documents & Contracts for event-dessert contracts with e-sign + auto-generate-invoice-on-signature flow.

**Estimated time:** 75-90 minutes.

**Dependencies:**
- Sections 2, 5, 7, 10 complete.
- Brand Board v1 from Section 5 applied to invoice styling.

---

## Why this section matters

Section 7 built the Products catalog and connected Stripe. That's inventory + payment plumbing. Section 15 is the customer-facing face of commerce: what they actually see when they pay. A poorly-branded invoice damages trust; a professional one accelerates payment. A contract that auto-generates its own invoice on signing removes a class of operator errors.

Three non-obvious principles:

1. **Invoice templates compound.** Build three templates well (Retail Order, Catering/Event, Wholesale Monthly) and 95% of future invoicing copies one of them. Build them ad-hoc and each invoice is 5-10 minutes of rebuilding the same thing.
2. **Payment Links are different from Invoices.** Payment Links are quick-pay URLs for known-price items; Invoices are billing documents for variable-price or customized work. Both flow through Stripe; use cases don't overlap.
3. **Documents & Contracts auto-generating invoices on signature saves Stacy a manual step.** Event deposits + final invoicing become a single e-sign flow. Error mode: contract signed but deposit invoice forgotten. Native auto-generate closes it.

---

## What you will produce

1. **3 Invoice templates** — Retail Order · Catering/Event · Wholesale Monthly Subscription.
2. **5 Payment Link templates** — Custom Cake Deposit · Event Deposit · Bulk Order · Product-Specific Quick-Pay · Gift Card Payment Link (stub for Section 16).
3. **1 Catering Contract template** — Documents & Contracts template with merge fields + e-sign + auto-generate invoice on signature.
4. **Invoice automated reminder rules** — 3-day and 7-day payment reminders before due date.
5. **Payment notification templates** — receipt email (fires from Workflow #2) + receipt SMS option.

---

## Step 1 — Build Invoice Templates

**Where:** Payments → Invoices → Templates → **+ New Template**. [UI-VERIFY]

### 1.1 Template #1 — Retail Order

**Use case:** Custom cake order, bulk cookie order, catering dessert platter — anything non-recurring.

**Setup:**

1. Template name: "Retail Order Invoice".
2. Branding: Brand Board v1 logo + colors auto-applied (Section 5).
3. Header fields: `{{custom_values.business_name}}` · `{{custom_values.business_address}}` · `{{custom_values.business_phone}}` · `{{custom_values.business_email}}`.
4. Customer fields: `{{contact.first_name}} {{contact.last_name}}` · `{{contact.email}}` · `{{contact.phone}}` · `{{contact.address1}}, {{contact.city}}, {{contact.state}} {{contact.postalCode}}`.
5. Invoice metadata: Invoice #, Issue Date, Due Date (default +14 days).
6. Line items: pulled from Products (Section 7). Start empty; populated per invoice.
7. Tax: apply OKC Sales Tax (8.625%) to taxable items.
8. Discount field: available (for custom orders where Stacy negotiates).
9. Notes section (customer-visible): *"Thank you for your order! Questions? Reply to this email or call {{custom_values.business_phone}}."*
10. Payment terms: "Due upon receipt" (aggressive) OR "Due within 14 days" (standard). Default standard.
11. Payment methods at checkout: Card + Apple Pay + Google Pay + ACH.
12. Save as template.

### 1.2 Template #2 — Catering / Event Invoice (with deposit support)

**Use case:** Wedding, corporate event, birthday party dessert orders — events with a deposit structure.

**Setup:**

1. Template name: "Catering/Event Invoice".
2. Same branding as Template #1.
3. Add an "Event Details" block: event date (`{{opportunity.event_date}}`), guest count (`{{opportunity.guest_count}}`), venue (if captured).
4. Line items: typically multiple (dessert platters, labor if applicable, delivery fee, tax).
5. Deposit structure: enable the **Split Payment** or **Installments** feature. [UI-VERIFY exact feature name]
   - Deposit: 50% due upon booking.
   - Balance: remaining 50% due 7 days before event.
6. Notes: *"50% deposit confirms your event date. Balance due 7 days before {{opportunity.event_date}}. We'll send a reminder."*
7. Save.

### 1.3 Template #3 — Wholesale Monthly Subscription

**Use case:** Recurring wholesale account (café orders Caramel cookies every Monday).

**Setup:**

1. Template name: "Wholesale Monthly".
2. Same branding.
3. Add "Wholesale Account" block: `{{contact.company_name}}` · `{{opportunity.wholesale_account_type}}`.
4. Line items: standing order quantities.
5. Tax: may be tax-exempt (per `tax:exempt-wholesale` tag from Section 7).
6. Payment terms: Net 30 (standard wholesale).
7. Payment methods: ACH preferred (lower processor fee) + Card fallback.
8. Recurring configuration: tied to a Recurring Product (Section 7 Step 4.4 "Standing Order — Wholesale Monthly").
9. Invoice auto-generates each billing cycle.
10. Save.

### 1.4 Configure Automated Invoice Reminders

**Where:** Payments → Settings → Invoice Reminders. [UI-VERIFY]

- **3 days before due:** send reminder email.
- **1 day before due:** send reminder email + SMS (if customer opted in).
- **On due date:** send overdue notice.
- **3 days overdue:** send escalation email with "please reply with any questions" language.
- **7 days overdue:** Send Internal Notification to Stacy; no further automation — personal follow-up.

---

## Step 2 — Build Payment Links

**Where:** Payments → Payment Links → **+ New Payment Link**. [UI-VERIFY]

### 2.1 Link #1 — Custom Cake Deposit

- Name: "Custom Cake Deposit — $25"
- Product: references Section 7 "Custom Order Consultation Deposit" product.
- URL branded subdomain (configurable): `link.caramelovenokc.com/pay/custom-cake-deposit`.
- Text2Pay: enabled (can be sent via SMS).
- Styling: Brand Board v1.

### 2.2 Link #2 — Event Dessert Deposit

- Name: "Event Dessert Deposit — $50"
- Product: Section 7 Event Dessert Consultation deposit.

### 2.3 Link #3 — Bulk Order Quick-Pay

- Name: "Bulk Order Payment"
- **Price: editable at checkout** (customer or Stacy sets amount). Used when Stacy wants to send "pay $X for your order" link via SMS without creating a full invoice.

### 2.4 Link #4 — Product-Specific Quick-Pay

For each retail product in Section 7 (Salted Caramels, Signature Cookies, etc.), generate a Payment Link. Customer click-to-buy via social post or direct share.

### 2.5 Link #5 — Gift Card Payment Link (stub)

Placeholder; full gift-card setup lives in Section 16.

### 2.6 Distribution

Record all Payment Link URLs in Intake Document. Stacy/Josh can share via SMS, email, QR code, or embed in funnels.

---

## Step 3 — Documents & Contracts — Catering Contract

**Where:** Documents & Contracts → Templates → **+ New Template**. [UI-VERIFY]

### 3.1 Contract structure

**Template name:** "Caramel Oven Catering Contract v1"

**Sections:**

1. **Header block:** Caramel Oven Bakehouse info + Client info (pulled from Contact + Opportunity).
2. **Event details:** Event date, venue, guest count, deliverables (populated from Opportunity custom fields).
3. **Deliverables list:** itemized dessert items, quantities, flavors. Populated manually per event.
4. **Pricing:**
   - Subtotal.
   - Tax (OKC Sales Tax 8.625%).
   - Delivery fee (if applicable).
   - Total.
   - **Deposit: 50%, due upon signing.**
   - **Balance: 50%, due 7 days before event.**
5. **Terms (standard boilerplate, Stacy/Josh-reviewed + legally vetted recommended):**
   - Cancellation policy: 50% refundable if cancelled 14+ days before event; 25% refundable 7-14 days; non-refundable <7 days.
   - Changes to guest count: allowed up to 7 days before event; ±10% without price adjustment.
   - Delivery window: 2-hour delivery window confirmed 48 hours before event.
   - Dietary guarantees: best-effort on allergens; kitchen is not allergen-free.
   - Liability: standard limitation language.
6. **Signature blocks:** customer + Stacy/Josh (representative).
7. **Footer:** "Caramel Oven Bakehouse LLC · [address] · [phone] · [email]"

### 3.2 Merge fields

Use Section 2 Custom Values and Section 5 custom fields:

- `{{custom_values.business_name}}` · `{{custom_values.business_legal_name}}` · `{{custom_values.business_address}}` · `{{custom_values.business_phone}}` · `{{custom_values.business_email}}`
- `{{contact.first_name}}` · `{{contact.last_name}}` · `{{contact.email}}` · `{{contact.phone}}` · `{{contact.address1}}`
- `{{opportunity.event_date}}` · `{{opportunity.guest_count}}` · `{{opportunity.quoted_amount}}`

### 3.3 E-sign configuration

1. Enable e-signature.
2. Signer order: **Customer signs first**, then Caramel Oven (Stacy or Josh) countersigns.
3. Expiration: 7 days. Contract voids if customer doesn't sign within 7 days of sending.

### 3.4 Auto-generate invoice on signature

**Critical feature.** Per research (article 155000004063):

1. Configure the template: upon final signature (both parties), automatically generate a deposit Invoice (50% of `quoted_amount`).
2. Invoice template: "Catering/Event Invoice" from Step 1.2.
3. Invoice automatically sends to customer email.

This means: Stacy sends a contract → customer signs → deposit invoice appears in their inbox without Stacy touching anything. Reduces the "contract signed but deposit invoice forgotten" error to zero.

### 3.5 Balance-due invoice

HighLevel's auto-generate covers the DEPOSIT invoice. The BALANCE invoice (due 7 days before event) is a separate automation:

- Option A: Manual — Stacy sends the balance invoice when due (calendar reminder).
- Option B (cleaner): A separate Workflow triggered by `{{opportunity.event_date}} - 7 days` → auto-generate balance Invoice (50% of `quoted_amount` minus any deposit already paid).

Option B requires a Workflow not yet built; flag for Section 20 or post-launch iteration. **For launch: use Option A (manual balance invoicing).** Section 21 operator playbook includes weekly review of upcoming events + balance invoice action.

### 3.6 Save template

Save "Caramel Oven Catering Contract v1" to the Documents & Contracts template library. Accessible whenever a new Opportunity hits Quote Sent stage.

---

## Step 4 — Test invoice + contract flow

### 4.1 Test Retail Order invoice

1. Create a test Contact.
2. Create an Opportunity in Catering pipeline, Quote Sent stage.
3. Generate an invoice using Retail Order template.
4. Add 2 line items from Products (e.g., Salted Caramels box + Signature Cookies dozen).
5. Send invoice to the test Contact's email.
6. Open the invoice in the test email; click Pay.
7. Use Stripe test card or live card + immediate refund.
8. Verify:
   - Payment success page renders.
   - Receipt email fires.
   - Invoice status updates to "Paid" in HighLevel.
   - Stripe transaction appears.
   - Workflow #2 Post-Purchase Thank-You fires (Section 12).
9. Refund test charge.
10. Delete test Contact + test Invoice.

### 4.2 Test Catering Contract e-sign + auto-invoice

1. Create a test Contact + Catering Opportunity with `opportunity.event_date` and `opportunity.quoted_amount`.
2. Generate contract using Catering Contract template.
3. Send to test Contact's email.
4. Open, review, e-sign.
5. Verify:
   - Contract status: Signed.
   - Deposit invoice auto-generates.
   - Deposit invoice email lands.
6. Pay the deposit invoice (test card).
7. Verify: deposit paid; Opportunity stage moves to "Deposit Received" (if automation wired); `opportunity.deposit_amount` updates.
8. Clean up.

---

## Step 5 — Documentation + handoff

Update Intake Document:

```
SECTION 15 STATUS
Invoice Templates: 3 (Retail · Catering/Event · Wholesale Monthly)
Payment Links: 5 (Custom Cake Deposit · Event Deposit · Bulk Order · Product-Specific · Gift Card stub)
Contracts: 1 (Catering Contract v1 with auto-generate deposit invoice)
Invoice Reminders: configured (3d · 1d · due · 3d overdue · 7d overdue)
Smoke tests: PASSED
```

Flag to Section 21 operator playbook:
- Weekly review: upcoming events (next 14 days) — Stacy confirms balance invoices are sent 7 days before event.
- Monthly review: wholesale recurring invoices — confirm Net 30 status; escalate unpaid past 45 days.

---

## Completion criteria

1. ✅ 3 Invoice Templates built (Retail · Catering/Event · Wholesale Monthly).
2. ✅ 5 Payment Links built (+ gift card stub).
3. ✅ Catering Contract v1 built with e-sign + auto-generate deposit invoice on signature.
4. ✅ Automated invoice reminders configured.
5. ✅ Retail invoice smoke test passed.
6. ✅ Catering Contract smoke test passed.
7. ✅ Section 21 operator playbook updated with balance-invoicing checklist + wholesale recurring review cadence.

---

## What happens next

**Section 16 — Gift Cards** is the next write. Activates the native Gift Cards module using the Stripe connection from Section 7 + the first-pass branding from Section 5.

---

## Flags for this section

- **Assumptions made:** (a) Retail + Catering + Wholesale as 3 invoice templates covers 95%+ of cases; custom/edge invoices built ad-hoc from scratch; (b) 50/50 deposit/balance structure for catering is industry-standard; (c) Catering Contract terms (cancellation, changes, liability) are reasonable starting language — Stacy/Josh should legal-vet before first live contract; (d) Auto-generate deposit invoice on contract signature is available per HighLevel docs — UI-VERIFY at first contract send.
- **Gaps identified:** UI-VERIFY flags on Invoice Templates location, Split Payment/Installments feature, Documents & Contracts auto-generate invoice configuration, Opportunity-stage automation on deposit payment.
- **Competing approaches:** (a) Per-invoice vs templated invoicing — chose templated for time savings; (b) Manual balance invoicing vs workflow-automated — chose manual for launch (workflow adds complexity not yet needed at Caramel Oven scale), flagged for post-launch iteration; (c) Single contract template vs per-event-type templates — chose single with merge-field flexibility; can split later if wedding vs corporate divergence warrants.
- **Client-side blockers:** None.
- **Legal disclaimer:** contract boilerplate in Step 3.1 is a starting point; Stacy/Josh should have an attorney review before first live use. Flag in Section 21 pre-launch checklist.
- **Platform-level irreversible decisions:** None.

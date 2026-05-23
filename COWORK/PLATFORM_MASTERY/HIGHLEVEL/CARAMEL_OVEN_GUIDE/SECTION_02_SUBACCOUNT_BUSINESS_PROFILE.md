# Section 2 — Sub-Account Provisioning & Business Profile

**Last Updated:** 2026-04-17
*If HighLevel UI doesn't match these instructions, consult the Update Protocol (Phase 5.2). This guide targets the HighLevel platform as of 2026-04-17.*

---

## Purpose

Create the Caramel Oven sub-account, capture its Location ID, fill out the Business Profile from Asset Inventory, and establish the Custom Values table that downstream sections will reference. By the end of this section, Caramel Oven exists as a live sub-account inside Dan's Agency — empty of automation and content, but complete with identity.

**Estimated time:** 30-60 minutes of active setup once the Required Assets from Section 1 are in hand. Can start as soon as Section 1 is approved.

**Dependencies:** Section 1 complete (Asset Inventory has the business name, legal name, address, phone, support email, hours, logo). Intake questions Q1-Q10 do NOT block this section.

**Who does Step 1:** Dan (as Agency owner). Every subsequent step runs inside the sub-account itself — the "you" below executes them.

---

## Why this section matters

The sub-account is the container. Its Location ID is referenced in every URL for the rest of the build. The Business Profile populates automatic merge fields used by templates, emails, invoices, calendars, and documents — getting it right here means downstream sections just work. Custom Values created here become the "business-wide constants" that keep email/SMS/document templates consistent even when details change later.

Skipping any of these steps does not block the next section structurally, but it will produce broken or placeholder-looking output downstream (e.g., invoices showing "Your Business Name" instead of "Caramel Oven Bakehouse").

---

## What you will produce

1. A **live sub-account** named Caramel Oven inside Dan's Agency.
2. The **Location ID** recorded in the Intake Document (already referenced in Section 1).
3. A **completed Business Profile** with legal identity, address, contact info, timezone, hours, and logo.
4. A **Custom Values table** with the baseline business-wide constants that downstream sections reuse.
5. **Sub-account user accounts** for anyone who needs day-to-day access.

---

## Step 1 — Dan provisions the sub-account (Agency-level action)

This step runs inside Dan's Agency view, one tier above the Caramel Oven sub-account. Skip to Step 2 if Dan has already completed this.

1. Log in at `app.gohighlevel.com` as the Agency owner.
2. From the left navigation, select **Sub-Accounts** (under Agency View). [UI-VERIFY: exact menu label on current Agency Dashboard]
3. Click **+ Create Sub-Account** (or the equivalent button — some plan tiers show a different label).
4. Choose **Create from Scratch**. Do NOT load a Snapshot — Caramel Oven is the first client of this type and will become the reference Snapshot itself in Phase 5.1.
5. Fill the creation form with the bare-minimum fields HighLevel requires (business name, timezone, country, admin email). Use the business name and timezone from the Asset Inventory. The admin email at creation time can be Dan's; additional user accounts are added in Step 5.
6. Save.
7. HighLevel redirects to the new sub-account. **Copy the Location ID from the URL immediately** — see Step 2.

> **Snapshot reminder:** Caramel Oven ships empty. We do not load an Industry Snapshot because none exists for a farmers-market bakery (the closest is Restaurant/Bar, which is thin per Phase 2 review). Caramel Oven's finished build becomes the Snapshot for future clients (Phase 5.1 deliverable).

---

## Step 2 — Locate and record the Location ID

The Location ID is the canonical identifier for the sub-account. It appears in every URL and in the Business Profile page.

**From the URL (fastest):**

After Dan saves the new sub-account in Step 1, the browser redirects to a URL shaped like:

```
https://app.gohighlevel.com/v2/location/abc123XYZ/dashboard
```

The value between `/location/` and the next `/` is the Location ID (in this example, `abc123XYZ`). Copy it.

**From Settings (if you navigated away):**

1. Inside the sub-account, go to **Settings** in the left navigation.
2. Select **Business Profile** (first item).
3. The Location ID is displayed on that page. Copy it. [UI-VERIFY: exact field label]

**Record the Location ID in the Intake Document** under a new field at the top:

```
LOCATION ID: abc123XYZ
Sub-account created: [date]
```

> **Security note:** Treat the Location ID like a private ID, not a secret. HighLevel's own guidance: "Please do not share the location ID outside of your organization." Dan's Agency team and the VA can see it; external contractors should not.

---

## Step 3 — Complete the Business Profile

The Business Profile is at **Settings → Business Profile**. It is split into several tabs/sub-pages. Walk each one and populate from the Asset Inventory.

### 3.1 General Information

Fields to fill:

- **Business name** — e.g., "Caramel Oven Bakehouse"
- **Business email** — the support/contact email
- **Business phone** — the main phone number (not the LC Phone number yet; that is purchased in Section 4)
- **Business website** — if the domain is not yet connected, leave blank for now (filled in Section 3)

[UI-VERIFY: exact field order and labels; may differ slightly on current UI]

### 3.2 Business Physical Address

Fields to fill:

- **Street address**
- **City**
- **State / Province**
- **Postal code**
- **Country**

For a farmers-market vendor without a storefront, use the business's registered address (home address, commissary kitchen address, or commercial mailbox). This address:

- Populates the legal business address on invoices and receipts.
- Feeds into A2P 10DLC Brand Registration (Section 4).
- Appears on Google Business Profile integration (Section 11).

### 3.3 Business Information

Fields to fill:

- **Legal business name** — may differ from the display name (e.g., "Caramel Oven LLC" vs. "Caramel Oven Bakehouse")
- **Industry** — pick the closest match; "Food & Beverage" or "Retail Bakery" if available
- **Founded year**
- **Employee count** — for a small bakery, typically "1-10"

These fields feed A2P Brand Registration (Section 4) and may appear in some Snapshot packaging workflows (Phase 5.1).

### 3.4 Authorized Representative

**Must match the person legally authorized to represent the business per state/IRS records.** Cross-reference against the Q1 intake answer. If Caramel Oven is an LLC, this must be the registered agent or a named member/manager with authority. If Caramel Oven is a Sole Proprietorship, this is the sole proprietor themselves.

**A2P 10DLC Brand Registration (Section 4) will reject mismatches** — the carriers validate the Authorized Representative against government databases. Wrong person = registration rejection = 3-7 additional business days added to SMS launch. This is not a "pick whoever is around today" field.

Fields: first name, last name, title ("Owner," "Managing Member," or "Sole Proprietor" — use the actual title on the business's legal formation documents), business email, phone.

This is referenced by A2P 10DLC Brand Registration and by some payment-provider verification flows.

### 3.5 General Settings (timezone, currency, language)

Fields to fill:

- **Timezone** — e.g., America/Chicago for the Midwest US. Affects appointment times, email send-times, campaign scheduling.
  - *DST note:* HighLevel auto-handles Daylight Saving Time transitions, but verify once post-launch that existing appointments and scheduled messages did not drift by one hour across the DST boundary (March and November in the US). Rare but documented edge case. A verification step in Section 21 (Pre-Launch QA) catches this — surfaced here so the operator isn't surprised.
- **Currency** — e.g., USD. Affects invoices, payment links, products.
- **Language** — e.g., English (US).
- **Date format** — MM/DD/YYYY typical in the US.

**Once set, changing these mid-engagement is messy** (existing appointments retain original timezone; reports need recalculation). Lock them in now.

### 3.6 Logo and branding

Upload the logo from the Asset Inventory:

1. In Business Profile → Logo section, click upload.
2. Preferred: SVG file. If only PNG is available, use the 1024×1024 or larger version.
3. Save.

The logo appears on: invoice PDFs, receipt emails, appointment confirmation emails, client portal, chat widget (if default branding).

### 3.7 Deprecated features and Contact Deduplication

Two minor but non-obvious settings in the Business Profile area:

- **Enable/Disable Deprecated Features** — leave defaults in place unless Dan specifies otherwise. HighLevel uses this page to retire old features gracefully; no action needed in most cases. [UI-VERIFY: default state on current UI]
- **Contact Deduplication** — controls whether duplicate contact records (same email or phone) are allowed or auto-merged. Recommended default: **Auto-merge by email AND phone**. This prevents the "three records for the same customer" problem downstream.

### Save and verify

Click **Save** at the bottom of each sub-page. Refresh the browser to confirm fields persist.

---

## Step 4 — Create Custom Values (business-wide constants)

**Custom Values** are reusable key:value pairs referenced across the platform. Create each one once; update the value in one place; every template, email, SMS, funnel, and document that references the key updates everywhere automatically.

**Where to find them:** Settings → Custom Values.

**Syntax when referencing:** `{{custom_values.<key>}}`. HighLevel auto-generates the key from the Name field — for example, a Custom Value named "Business Name" becomes `custom_values.business_name`.

> **Key-stays-stable behavior:** Once a Custom Value is created, its Key does NOT change even if you rename the Name later. This is a feature, not a bug — it prevents templates from breaking when you tidy display names. But it also means the Key sometimes looks outdated compared to the Name. Don't panic.

Create the following baseline Custom Values. Each row is one Custom Value.

| Name (what you type) | Auto-generated Key | Value (what to enter) | Where it gets used |
|---|---|---|---|
| Business Name | `custom_values.business_name` | Caramel Oven Bakehouse | Every template, every auto-generated email, invoice branding |
| Business Legal Name | `custom_values.business_legal_name` | (from Business Profile 3.3) | Contracts, invoices, A2P registration |
| Business Phone | `custom_values.business_phone` | (main phone number) | Chat widget, email signatures, receipts |
| Business Email | `custom_values.business_email` | (support/contact email) | Email signatures, footer |
| Business Address | `custom_values.business_address` | (full address on one line) | Invoices, receipts, email footer |
| Business Hours | `custom_values.business_hours` | e.g., Tuesday-Sunday 7am-3pm CT | Chat widget office hours message, appointment confirmations |
| Business Website | `custom_values.business_website` | (leave blank for now; fill after Section 3) | Chat widget, email signatures, social posts |
| Booking Link | `custom_values.booking_link` | (leave blank for now; fill after Section 9) | Email CTAs, SMS review requests, chat widget quick action |
| Review Link | `custom_values.review_link` | (leave blank for now; fill after Section 11) | Review request email/SMS, thank-you flows |
| Unsubscribe Link | `custom_values.unsubscribe_link` | (auto-populated by HighLevel) | Every email footer (compliance-required) |
| Owner First Name | `custom_values.owner_first_name` | Stacy (or Josh, depending on who "signs" most emails) | Warm-tone signatures on owner-voice emails |
| Sales Tax Jurisdiction | `custom_values.sales_tax_jurisdiction` | `[to be set in Section 7 based on business physical address]` | Products/Taxes setup in Section 7; invoice line items; receipt tax calculations |

### How to create one

1. Settings → Custom Values.
2. Click **+ New Custom Value** (or equivalent). [UI-VERIFY: exact label]
3. Enter the Name from the table above.
4. Enter the Value.
5. Save.

Repeat for each row. Group them into a folder called "Business Constants" if you want cleaner organization (HighLevel supports one folder per Custom Value; no nesting).

### Placeholder strategy for "fill later" rows

Rows marked "leave blank for now" cannot stay blank forever — templates will render `{{custom_values.booking_link}}` literally if the value is empty. Two approaches:

- **Approach A (recommended):** Create the Custom Value with a visible placeholder like `[booking link — to be set in Section 9]`. Anyone reviewing templates in early sections sees the placeholder and knows it's intentional.
- **Approach B:** Leave the Value empty. Risk: a draft email sent during testing shows a blank space or a broken merge field.

Approach A wins. Use it.

---

## Step 5 — Create sub-account users

Every person who needs day-to-day access to the Caramel Oven sub-account gets their own user account. Do not share logins.

**Where:** Settings → Team (or Settings → My Staff — label varies by UI revision). [UI-VERIFY]

### Users to create at launch

| User | Role | Why |
|---|---|---|
| Dan | Admin | Primary builder and operator during the initial engagement |
| Stacy | Admin | Co-owner; needs full access to review customer messages, appointments, invoices |
| Josh | Admin | Co-owner; same rationale as Stacy |
| VA (aspirational) | Admin (later) | Onboarded after revenue supports hire; placeholder user can be created later, not at launch |

### How to add a user

1. Settings → Team → **+ Add User**. [UI-VERIFY]
2. Fill first name, last name, email, phone (optional), role (Admin vs. User).
3. **Admin** gets full sub-account access. **User** gets limited access gated by permission scopes.
4. For Stacy and Josh at launch, pick **Admin**. For a future VA, consider **User** with explicit permissions.
5. Save. HighLevel sends an invite email to the new user; they set their password via the link.

### Two-factor authentication (2FA) required on first login

After each user receives their invite and sets their password, **require them to enable two-factor authentication (2FA) on first login.** HighLevel supports TOTP-based 2FA (Google Authenticator, Authy, Microsoft Authenticator, etc.). Admin accounts managing customer data, payments, and SMS compliance should not operate without 2FA. Enforcing it at user creation is cheap; adding it later requires chasing three people to go enable it.

Walk each new user through: Profile → Security → Enable 2FA → scan QR code with authenticator app → enter verification code → save backup codes to a secure location. Do not skip the backup-code step — if a user loses their phone, the backup codes are the only way back in without a full account recovery flow.

### Permission scopes (for User role)

The sub-account role "User" supports granular permissions: Contacts access, Conversations access, Opportunities access, Workflows edit, Calendars access, Payments access, etc. For day-one Caramel Oven, Admin is fine for all three humans. Permission granularity becomes relevant when a VA or bookkeeper joins later.

> **NOTE FOR SECTION 21:** At handoff, consider whether Stacy and Josh should remain full Admin, or be stepped down to granular User-role permissions after a 30-day stability period. Admin can accidentally delete workflows, modify A2P registration, and change payment integrations — all of which would break the build. Day-one Admin access is operationally correct (transparency, immediate access); long-term Admin access for non-builders is a footgun. Revisit during Pre-Launch QA.

---

## Step 6 — Verify and hand off to Section 3

Before declaring Section 2 complete:

1. Log out of the Agency view.
2. Log back in to the sub-account directly at `app.gohighlevel.com/v2/location/<LocationID>/dashboard` (substitute the real Location ID).
3. Confirm the Business Profile fields are saved (Settings → Business Profile).
4. Confirm the Custom Values table is populated (Settings → Custom Values).
5. Navigate to **Settings → Team → + Add User**. Confirm the Add User form loads and all required fields render. **Do NOT submit** — some HighLevel plans have user count limits, and creating-then-deleting a test user can consume a slot. Just verify the UI is functional, then cancel out.

Update the Intake Document:

```
LOCATION ID: abc123XYZ
Sub-account created: [date]
Business Profile: Complete (see fields recorded in Business Profile tab)
Custom Values: 12 baseline values created
Users: Dan (Admin), Stacy (Admin), Josh (Admin)
Section 2 status: COMPLETE
```

Send Dan a short message: "Section 2 complete. Location ID is [ID]. Business Profile populated from Asset Inventory. Custom Values baseline created (12 entries). Ready for Section 3 — Domain + LC Email Setup."

---

## Completion criteria

Section 2 is complete when:

1. ✅ Sub-account exists inside Dan's Agency, named Caramel Oven.
2. ✅ Location ID recorded in the Intake Document.
3. ✅ Business Profile populated across all 7 sub-pages (General Info, Physical Address, Business Info, Authorized Rep, General Settings, Logo, Deprecated/Deduplication).
4. ✅ 12 baseline Custom Values created (with placeholder strategy for the 4 "fill later" entries: `business_website`, `booking_link`, `review_link`, `sales_tax_jurisdiction`).
5. ✅ Sub-account users created for Dan, Stacy, Josh.
6. ✅ Dan has been notified Section 2 is complete.

Placeholder Custom Values (`booking_link`, `review_link`, `business_website`, `sales_tax_jurisdiction`) will be updated in later sections; this is expected and does not block Section 2 closure.

---

## What happens next

**Section 3 — Domain + LC Email Setup** begins immediately on Section 2 approval, assuming Q2 (existing domain) has been answered. If Q2 is still pending, proceed to **Section 8 (Forms + Chat Widget)** or **Section 10 (Pipelines & Opportunities)** — both are unblocked per the Blocker Map and can run in parallel.

Section 3 covers: connecting the domain, setting up LC Email with a dedicated sending domain, configuring DNS records (SPF, DKIM, DMARC), and enabling Preference Management for granular email unsubscription.

---

## Flags for this section

- **UI-VERIFY notes:** Six UI-specific labels are flagged for verification against the live UI once the sub-account is provisioned — exact menu labels, field orders, and button text can drift between HighLevel releases.
- **Intake-dependent content:** Business Profile fields pull from the Asset Inventory (business name, legal name, address, phone, email, hours, logo). Section 2 cannot finish Step 3 until those Asset Inventory items are present — but Section 1's infrastructure was designed to surface these asynchronously.
- **Optional features acknowledged:** No optional features activated in Section 2. Snapshot-based creation is explicitly declined (no bakery snapshot exists yet; Caramel Oven IS the forthcoming snapshot).
- **Forward pointers:** Placeholder Custom Values (`booking_link`, `review_link`, `business_website`) get filled in Sections 3, 9, and 11 respectively.

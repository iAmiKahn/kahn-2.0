# Section 10 — Pipelines & Opportunities

**Last Updated:** 2026-04-19
*If HighLevel UI doesn't match these instructions, consult the Update Protocol (Phase 5.2). This guide targets the HighLevel platform as of 2026-04-17.*

---

## Purpose

Create the two pipelines that structure Caramel Oven's sales funnel — Wholesale Onboarding and Catering — with stages that reflect the actual path from first contact through completed engagement. Configure Opportunity custom fields (built in Section 5) to attach to the right pipelines. Seed one demo Opportunity in each pipeline to verify the setup end-to-end.

**Estimated time:** 45-60 minutes.

**Dependencies:**
- Section 2 complete.
- Section 5 complete (Opportunity Custom Fields exist).
- **Q6 shapes design** (not a hard blocker): if wholesale tracking requires multi-contact accounts per restaurant, Companies module activates (see Step 5). If single-contact-per-account is fine, Companies stays OPTIONAL.

---

## Why this section matters

Opportunities are where deals live. Contacts track PEOPLE; Opportunities track potential REVENUE events attached to those people. A Contact without an Opportunity is a lead at best, not a pipeline deal.

Two pipelines for Caramel Oven mirror the two distinct revenue motions:

- **Wholesale pipeline** is recurring-revenue oriented — landing a café as a weekly baked-goods supplier is a multi-touch deal that plays out over weeks.
- **Catering pipeline** is event-driven — a wedding-cake inquiry plays out over 2-6 weeks from inquiry → booked → delivered.

Both feed the workflow engine in Sections 12-14 and the Dashboards in Section 20. Without this section, the CRM has contacts but no deal structure. Revenue-per-stage reporting doesn't work. The wholesale nurture workflow has nowhere to enroll opportunities.

---

## What you will produce

1. **Pipeline A: Wholesale Onboarding** — 5 stages, custom fields wired, permissions configured.
2. **Pipeline B: Catering** — 6 stages, custom fields wired.
3. **Demo Opportunities** — one per pipeline, with dummy data, to verify end-to-end.
4. **Companies module decision** — activated or deferred based on Q6.
5. **Pipeline permissions set** — who can view and edit Opportunities.

---

## Step 1 — Create Pipeline A: Wholesale Onboarding

**Where:** Opportunities (left nav) → Pipelines → + Create Pipeline. [UI-VERIFY exact label]

### 1.1 Pipeline name and stages

- **Pipeline name:** Wholesale Onboarding
- **Stages (left to right):**

| # | Stage | Definition | Typical time in stage |
|---|---|---|---|
| 1 | Prospect | Wholesale lead identified via form submission, referral, or outbound prospecting. Contact exists; no sample sent yet. | 1-7 days |
| 2 | Sample Sent | Baked-goods sample delivered to the prospect's address for evaluation. | 2-5 days |
| 3 | Price Agreed | Prospect has accepted Caramel Oven's sample; pricing and order cadence negotiated and verbally agreed. | 2-7 days |
| 4 | First Order | First paid wholesale order placed and delivered. Relationship converted from prospect to active account. | 1-3 days |
| 5 | Recurring | Second or subsequent order received — relationship now recurring. Active wholesale customer. | Ongoing |

Click **+ Add Stage** for each. Drag to reorder if the stages come out in the wrong sequence.

### 1.2 Pipeline settings

- **Pipeline visibility:** Team (all sub-account users can view).
- **Stage colors:** use Brand Board colors (pull from Section 5) or HighLevel defaults. Color-coding Smart Tags (155000006642) is a separate feature.
- **Opportunity naming convention:** HighLevel auto-names Opportunities when created from a Contact — default format is "Contact Name - Date." Optional: customize via the Opportunity template field if the UI exposes it. [UI-VERIFY]

### 1.3 Default Opportunity creation behavior

When a Contact is added to this pipeline, HighLevel creates an Opportunity. Decide:

- **Allow multiple Opportunities per Contact per Pipeline?** → YES for Wholesale (a wholesale account may have multiple active sub-deals: e.g., a café pilot + a separate corporate-lunch trial). Reference article 48001066144.
- **Decouple Opportunity owner from Contact owner?** → YES — the person who owns the RELATIONSHIP may differ from the person who owns the WHOLESALE DEAL. Section 2 created users; assign Opportunity owner separately when creating each Opportunity.

### 1.4 Permissions

Pipeline permissions gate who can view/edit each pipeline. For day-one Caramel Oven:

- **View:** Dan, Stacy, Josh (all three).
- **Edit:** Dan, Stacy, Josh (all three).

For later (Section 21 handoff), consider stepping Josh down to View-only if only Stacy manages wholesale accounts. Flag for Section 21.

### 1.5 Save

---

## Step 2 — Create Pipeline B: Catering

### 2.1 Pipeline name and stages

- **Pipeline name:** Catering
- **Stages:**

| # | Stage | Definition | Typical time in stage |
|---|---|---|---|
| 1 | Inquiry | Catering inquiry received — via form, chat, referral, inbound call. | 0-2 days |
| 2 | Consult Booked | Customer has booked the Catering Tasting service (from Section 9). Calendar event exists. | 1-3 weeks before event |
| 3 | Quote Sent | Post-consultation; detailed quote delivered to customer via email or document. | 2-5 days |
| 4 | Deposit Received | Customer paid deposit (typically 50% of quoted amount); event is now confirmed. | Until event date |
| 5 | Event Delivered | Event date has passed; product delivered. | 1 day |
| 6 | Follow-up | Post-event follow-up complete (thank-you note + review request + any closeout invoicing). | 3-7 days |

### 2.2 Pipeline settings

- **Pipeline visibility:** Team.
- **Stage colors:** Brand Board or defaults.
- **Allow multiple Opportunities per Contact per Pipeline:** YES — a repeat wedding customer may have multiple Opportunities over years.

### 2.3 Permissions

Same as Pipeline A for day one.

### 2.4 Save

---

## Step 3 — Wire Opportunity Custom Fields

Custom Fields created in Section 5 (Event Date · Guest Count · Quoted Amount · Deposit Amount · Deposit Status · Wholesale Account Type · Order Frequency · Sample Status) are available on every Opportunity in the sub-account. No per-pipeline wiring is needed — they exist globally.

However, different pipelines will fill different fields:

| Custom Field | Used in Wholesale | Used in Catering |
|---|---|---|
| Event Date | No | Yes (required from Stage 2+) |
| Guest Count | No | Yes (from Stage 1) |
| Quoted Amount | Yes (from Stage 3 "Price Agreed") | Yes (from Stage 3 "Quote Sent") |
| Deposit Amount | No | Yes (from Stage 4 "Deposit Received") |
| Deposit Status | No | Yes (from Stage 4) |
| Wholesale Account Type | Yes (from Stage 1) | Only if catering lead converts to wholesale |
| Order Frequency | Yes (from Stage 4 "First Order") | No |
| Sample Status | Yes (tracks through Stages 1-2) | No |

**Conditional field visibility:** HighLevel supports per-field visibility by stage in some contexts. If exposed on current UI, set Catering-only fields to hidden on Wholesale Opportunities and vice versa. [UI-VERIFY]

---

## Step 4 — Seed demo Opportunities (end-to-end verification)

### 4.1 Demo Wholesale Opportunity

1. Create a test Contact: "Demo Café - Test Owner" with email `test-wholesale@example.com`, tag `source:wholesale-demo`.
2. Open the Contact → Opportunities tab → **+ Add Opportunity**.
3. Pipeline: Wholesale Onboarding. Stage: Prospect.
4. Fill Opportunity name: "Demo Café - Weekly Croissant Order".
5. Fill Custom Fields: Wholesale Account Type = Café, Sample Status = Not Sent.
6. Save.
7. Drag the Opportunity through stages (Prospect → Sample Sent → Price Agreed → First Order → Recurring). At each stage transition, update the relevant Custom Field (Sample Status updates as the sample flow progresses; Order Frequency set at First Order stage).
8. Verify the Opportunity Kanban view displays the drag interactions correctly.
9. Delete the demo Opportunity. Delete the demo Contact.

### 4.2 Demo Catering Opportunity

1. Create test Contact: "Demo Wedding - Jane Doe" with email `test-catering@example.com`, tag `source:catering-demo`.
2. Open the Contact → Opportunities → + Add Opportunity.
3. Pipeline: Catering. Stage: Inquiry.
4. Opportunity name: "Demo Wedding - June 2026".
5. Fill Event Date = 2026-06-15, Guest Count = 80, Wholesale Account Type = (blank).
6. Save.
7. Drag through stages (Inquiry → Consult Booked → Quote Sent → Deposit Received → Event Delivered → Follow-up). Update Quoted Amount + Deposit Amount at matching stages.
8. Verify end-to-end.
9. Delete demo Opportunity + Contact.

### 4.3 What this verifies

- Pipelines render correctly in the Opportunities module.
- Stage transitions work via drag-drop.
- Custom Fields write correctly.
- The Contact ↔ Opportunity relationship functions.
- Tags applied to Contacts carry through.
- Deletion cleanup doesn't leave orphan records.

---

## Step 5 — Companies module decision: FINAL-DEFERRED (Q6 resolved 2026-04-19)

### 5.1 If Q6 answer: multi-contact wholesale accounts

Activate the Companies module:

1. Navigate **Settings → Companies** (or top-level Companies module in left nav). [UI-VERIFY]
2. Enable the module.
3. Create a Company record for each active wholesale account (e.g., "Brickyard Café," "Corporate Coffee Co").
4. For each wholesale Contact, link to the Company record → the Contact now shows on the Company's detail page.
5. Opportunities can now be attached to Companies (not just Contacts) — "Brickyard Café - Weekly Order" rather than "John Brickyard - Weekly Order."

Workflow implications: Section 13's Wholesale Lead Nurture workflow branches based on whether the Opportunity is Company-linked or Contact-linked.

### 5.2 If Q6 answer: single-contact-per-account is fine

Skip Companies activation. Use the existing `contact.company_name` native field + `segment:b2b-wholesale` tag + Wholesale Account Type Custom Field for tracking. Simpler; works for Caramel Oven's likely B2B volume.

### 5.3 Q6 final answer: single-contact — Companies DEFERRED (FINAL)

Q6 resolved 2026-04-19: Caramel Oven tracks wholesale at single-contact level (one primary contact per restaurant/café/grocer). Companies module is **NOT activated**. Default architecture locked:

- `contact.company_name` native field captures the business name (e.g., "Brickyard Café").
- `segment:b2b-wholesale` tag identifies wholesale contacts.
- `opportunity.wholesale_account_type` Custom Field (Café / Grocer / Restaurant / Corporate / Other) classifies the account type.

This is sufficient for Caramel Oven's wholesale volume and removes the overhead of Companies-module maintenance. If Caramel Oven's wholesale grows to require multi-contact-per-account tracking later, Companies can be activated post-launch and wholesale Contacts migrated — Custom Field structure is already compatible.

---

## Step 6 — Configure pipeline reporting

Pipeline Value + Pipeline Conversion widgets are built in Section 20 (Dashboards). Section 10 just ensures the data model is right:

- Each Opportunity has a **Monetary Value** field (native — separate from the Quoted Amount Custom Field). This is what Pipeline Value sums.
- **Best practice:** set Monetary Value to the same value as Quoted Amount when the quote is delivered (Stage 3 in both pipelines). This makes Pipeline Value reflect actual pipeline dollars.
- Stage transitions automatically feed Conversion Rate calculations.

---

## Step 7 — Verify and document

### 7.1 Update Intake Document

```
SECTION 10 STATUS

PIPELINE A: Wholesale Onboarding
Stages: Prospect · Sample Sent · Price Agreed · First Order · Recurring
Permissions: Dan, Stacy, Josh (full access)

PIPELINE B: Catering
Stages: Inquiry · Consult Booked · Quote Sent · Deposit Received · Event Delivered · Follow-up
Permissions: Dan, Stacy, Josh (full access)

Opportunity Custom Fields: Wired (from Section 5)
Companies Module: NOT ACTIVATED (Q6 final = single-contact wholesale)

Section 10 status: COMPLETE
```

### 7.2 Screenshot the empty Kanban

Take a screenshot of both pipelines at empty state (no Opportunities). Save to Asset Inventory folder as reference for the VA and for Section 21 QA.

---

## Completion criteria

1. ✅ Wholesale Onboarding pipeline created with 5 stages.
2. ✅ Catering pipeline created with 6 stages.
3. ✅ Opportunity Custom Fields wired and visible on each pipeline's Opportunity creation form.
4. ✅ Demo Opportunities successfully traversed all stages and were cleanly deleted.
5. ✅ Pipeline permissions set.
6. ✅ Companies module decision recorded: FINAL-DEFERRED (Q6 = single-contact wholesale).
7. ✅ Screenshots saved to Asset Inventory.
8. ✅ Intake Document updated.

---

## What happens next

**Section 13 — Workflows: Lead Nurture** consumes these pipelines directly:
- New wholesale form submission (from Section 8 Catering Inquiry Form with Wholesale Account Type filled) → creates Opportunity in Wholesale pipeline, Prospect stage, triggers Wholesale Lead Nurture workflow.
- New catering form submission → creates Opportunity in Catering pipeline, Inquiry stage, triggers Catering Inquiry Nurture workflow.

**Section 15 — Invoices, Payment Links, Documents & Contracts** consumes the Deposit Amount / Deposit Status fields — deposit invoices tie back to the Catering Opportunity.

**Section 20 — Dashboards** consumes pipeline data via Pipeline Value, Conversion Rate, Funnel widgets.

---

## Flags for this section

- **Assumptions made:** (a) Wholesale stages (Prospect → Sample Sent → Price Agreed → First Order → Recurring) were proposed in Phase 3 sequence and approved; retained verbatim; (b) Catering stages (Inquiry → Consult Booked → Quote Sent → Deposit Received → Event Delivered → Follow-up) similarly approved; (c) Deposit default of 50% of quoted amount is bakery-industry typical — adjust if Caramel Oven's business model uses different percentage; (d) Opportunity naming convention "Contact Name - Description" is a VA discipline, not a platform enforcement; (e) Skipping Companies activation unless Q6 explicitly requires it — preferred default.
- **Gaps identified:** (a) UI-VERIFY flags on Opportunities module location, per-stage field-visibility settings (may not exist on current UI), Companies module location; (b) Auto-Opportunity-name template customization UI unknown — may be fixed format.
- **Competing approaches:** (a) Two pipelines vs. single combined "Sales" pipeline — chose two because the stage cadences are fundamentally different (Wholesale is onboarding-to-recurring; Catering is inquiry-to-event). One pipeline = forced awkward stage definitions. (b) Activate Companies now vs. defer — defaulted to defer because Q6 unanswered and single-contact tracking handles baseline. (c) Auto-create Opportunity on form submission vs. manual creation — Section 13 workflows handle auto-create (out of Section 10 scope); Section 10 just builds the destination pipelines.
- **Client-side blockers:** Q6 (wholesale client tracking needs) shapes Companies activation decision. Non-blocking — default is defer.
- **Platform-level irreversible decisions:** None. Pipelines can be deleted; stages can be reordered; Companies can be activated/deactivated at the sub-account level without agency-wide impact.

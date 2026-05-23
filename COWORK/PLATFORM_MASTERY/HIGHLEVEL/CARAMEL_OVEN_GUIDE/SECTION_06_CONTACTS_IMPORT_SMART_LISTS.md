# Section 6 — Contacts Import & Smart Lists

**Last Updated:** 2026-04-17
*If HighLevel UI doesn't match these instructions, consult the Update Protocol (Phase 5.2). This guide targets the HighLevel platform as of 2026-04-17.*

---

## Purpose

Bring Caramel Oven's existing customer list into HighLevel (if one exists per Q8), apply source/segment tags on import, and build the foundational Smart Lists that downstream workflows and campaigns enroll from. Handle duplicate merging. Coordinate import volume with the LC Email warmup schedule from Section 3 so deliverability doesn't crater on Day 1.

**Estimated time:** 30-120 minutes depending on list size and cleanup effort. Small lists (<500) run fast; larger lists (5,000+) need chunked imports and careful warmup coordination.

**Dependencies:**
- Section 2 complete (sub-account exists).
- Section 5 complete (tag taxonomy + Custom Fields exist — imports write to them).
- **Q8 informs planning** (not a hard blocker). If Q8 = no existing list, skip the import steps; Smart Lists still get built as forward-facing segmentation.

---

## Why this section matters

A fresh HighLevel sub-account with no contacts is architecturally correct but operationally useless. Caramel Oven's existing customers — farmers-market regulars, past catering clients, wholesale contacts, email-newsletter subscribers — need to land in this CRM so Section 12-14 workflows have an audience to enroll. Smart Lists are the filter layer that turns a flat contact database into segmented audiences (recent buyers, dormant customers, wholesale accounts, etc.).

Three non-obvious principles govern this section:

1. **Import is not a one-way door.** Deleted contacts can be restored for a limited window. Mistagged contacts can be bulk-retagged. Don't treat the import as irreversible — treat it as calibration.
2. **List hygiene before first email send.** Every bounced email damages domain reputation (Section 3). Remove obvious garbage (typo'd emails, role addresses like `info@`, unsubscribe requests) before any LC Email send.
3. **Respect the LC Email warmup schedule.** Even if 3,000 contacts import on Day 1, don't blast 3,000 emails on Day 1. The warmup from Section 3 Step 8 caps Week 1 at 25-50 sends; plan around it.

---

## What you will produce

1. **Cleaned CSV** ready for import (deduplicated, validated, tagged).
2. **Imported contacts** in HighLevel with source/segment tags applied and Custom Fields mapped.
3. **Duplicate merges resolved** for contacts who appeared in multiple source systems.
4. **8-12 foundational Smart Lists** that Section 12-14 workflows and future email campaigns enroll from.
5. **Import log** documenting what was imported, from where, when, and with what tags.

---

## Step 1 — Prepare the CSV (outside HighLevel)

Do this BEFORE touching the HighLevel importer. A clean CSV going in means less cleanup going out.

### 1.1 Gather source data from Q8 answer

Common sources for a bakery's existing customer list:
- **Email newsletter platform** (Mailchimp, ConvertKit, Klaviyo, Constant Contact) → export subscribers as CSV.
- **POS system** (Square, Clover, Toast) → export customer list as CSV.
- **Google Contacts / personal phone** → export as CSV.
- **Spreadsheet** (Google Sheets, Excel) → download as CSV.
- **Paper farmers-market signup sheet** → transcribe to CSV (tedious but necessary for name/phone/email capture).

If multiple sources exist, combine into ONE master CSV before import to avoid duplicate-import handling later.

### 1.2 Standardize column headers

HighLevel requires the first row to contain headers. Use these headers to match native Contact fields:

| CSV header | HighLevel field | Required |
|---|---|---|
| First Name | firstName | At least one of: email OR phone OR (firstName + lastName) |
| Last Name | lastName | |
| Email | email | At least one of: email OR phone |
| Phone | phone | |
| Address | address1 | Optional |
| City | city | Optional |
| State | state | Optional |
| Postal Code | postalCode | Optional |
| Country | country | Optional |
| Date of Birth | dateOfBirth | Optional (Custom Field `contact.birthday` from Section 5) |
| Dietary Preferences | (custom field) | Optional; comma-separated if multi-select |
| Customer Type | (custom field) | Optional |
| Preferred Contact Channel | (custom field) | Optional |
| Source Detail | (custom field) | Optional |
| Tags | (applied via import step, not CSV column) | — |

**Required minimum per row:** at least one of email, phone, or (firstName + lastName). A row with none of these rejects.

### 1.3 Clean the data

Before import, remove or fix:
- **Bounced emails** from prior ESP sends (check ESP's suppression list — don't re-import known bouncers).
- **Role addresses** (`info@`, `sales@`, `admin@`) — these rarely convert and can signal spam to mailbox providers.
- **Obvious typos** — search for addresses missing `@`, or with `@gmial` (common typo for `@gmail`).
- **Duplicate rows** — same email appearing twice, same phone twice. HighLevel de-duplicates on import but cleaner is better.
- **Opt-out requests from prior system** — honor past unsubscribe requests. Don't re-import someone who opted out of the old Mailchimp list.
- **Non-ASCII / emoji characters in names** — some import flows mangle these. Preview the CSV in a plain-text editor to spot issues.

### 1.4 Format multi-select custom fields

For multi-select custom fields like Dietary Preferences, use comma-separated values in the CSV cell. Example: `Gluten-Free, Vegan, Nut-Free`. Match the exact option labels from Section 5 (capitalization, hyphenation) — close-but-not-exact matches create new "orphan" values.

### 1.5 Check file size

CSV must be **under 30 MB**. If above, split into multiple files. For a bakery with realistic list size (<10,000 contacts), this is almost never an issue.

### 1.6 Save as `.csv` (not `.xlsx` or `.numbers`)

HighLevel accepts CSV only. Excel/Google Sheets native formats are rejected.

---

## Step 2 — Import the CSV into HighLevel

**Where:** Contacts → Import Contacts (toolbar). [UI-VERIFY exact button location]

### 2.1 Start the import

1. Navigate to **Contacts**.
2. Click **Import Contacts** in the toolbar.
3. Upload the prepared CSV.

### 2.2 Map the columns

HighLevel presents a field-mapping UI. Each CSV column maps to a HighLevel field:
- **Auto-detect:** common header names (Email, Phone, First Name) map automatically.
- **Manual mapping:** for Custom Fields, select the Custom Field from the dropdown. If a column has no matching field, leave it unmapped — it's ignored.

All required mappings must be completed before the import runs.

### 2.3 Apply bulk tags during import

On the final step of the import wizard, apply tags to all imported contacts. For Caramel Oven's initial import from (e.g.) a Mailchimp list:

- `source:email-newsletter` (or the appropriate source tag)
- `segment:b2c-regular` (starting assumption — refine later via Smart List → bulk retag)

If importing from multiple sources in separate batches (e.g., one import for Mailchimp subscribers, another for POS customers, another for farmers-market signup), apply different source tags per batch.

### 2.4 Duplicate handling

HighLevel's deduplication checks in this order:
1. **Contact ID** (used for re-imports / updates; rare for a first-import scenario).
2. **Email** (if matched, updates the existing contact rather than creating a new one).
3. **Phone** (if matched, updates).

If Section 2's Contact Deduplication setting is **Auto-merge by email AND phone** (recommended default), duplicates in the CSV that also match existing contacts get merged. Fields in the CSV overwrite fields in HighLevel for any column present in the import.

### 2.5 Optional: Smart List on import

The final step offers "Create a Smart List from this import." Enable it for the first import — creates a Smart List named (e.g.) "Imported 2026-04-17" containing only the contacts from this batch. Useful for audit and for Section 12-14 workflow enrollment-by-import-batch.

### 2.6 Run the import

Click **Import**. Progress bar shows counts (Imported, Updated, Skipped, Rejected). Review the skip/reject log if counts look off — common causes: missing required fields, malformed emails, duplicate detection.

### 2.7 Record in the Intake Document

```
IMPORT BATCH 1
Date: [date]
Source: [Mailchimp / Square POS / etc.]
Row count in CSV: [n]
Imported: [n]
Updated (matched existing): [n]
Skipped: [n]
Rejected: [n]
Tags applied: source:email-newsletter, segment:b2c-regular
Smart List created: "Imported 2026-04-17"
```

Repeat for each import batch. A bakery with multiple historical systems may do 3-5 separate imports.

---

## Step 3 — Post-import cleanup

### 3.1 Manually merge duplicates

Despite auto-merge, some duplicates slip through (different email addresses for same person, typo differences). Use the manual merge flow:

1. Contacts → find suspected duplicates (search by name, by phone).
2. Select the duplicate records → bulk action → **Merge**. [UI-VERIFY]
3. Pick which values to keep (typically the newer / more complete record wins).
4. Confirm.

HighLevel's "Manage and Merge Duplicates" tool (article 155000006647) surfaces suspected duplicates automatically. Run it post-import for a pass over the list.

### 3.2 Apply DND to opt-outs from prior system

If Q8 returned an existing list from a previous ESP that includes contacts who unsubscribed, apply Do-Not-Disturb (DND) flags to protect their preferences:

1. Build a Smart List filtered by (e.g.) tag `previous-unsub` (if you tagged them during import).
2. Bulk action → **Set DND for Email** (and phone if relevant).

### 3.3 Review orphan tags

Scan Settings → Tags for any tags that were auto-created during import but don't match the Section 5 taxonomy (e.g., a tag from CSV that slipped through uncanonicalized). Rename or delete to maintain taxonomy hygiene.

---

## Step 4 — Build foundational Smart Lists

**Where:** Contacts → Smart Lists → + New Smart List. [UI-VERIFY]

Smart Lists are dynamic filters over Contacts that auto-update as contacts move in/out of the filter conditions. Build these now so Section 12-14 workflows and Section 17 campaigns can enroll from them.

### 4.1 Recommended baseline for Caramel Oven

| Smart List name | Filter condition(s) | Used by |
|---|---|---|
| **New Leads (Last 7 Days)** | `status:new-lead` AND Created Date in last 7 days | Workflow #5 (New Lead Welcome, Section 13) |
| **Active Customers** | `status:active-customer` AND NOT `behavior:opted-out-marketing` | General marketing campaigns |
| **Farmers Market Regulars** | `source:farmers-market` AND `segment:b2c-regular` | Weekend-market-specific promos |
| **Wholesale Accounts** | `segment:b2b-wholesale` | Wholesale nurture, B2B-only email |
| **Catering Leads - No Close** | `interest:catering` AND NOT `status:active-customer` AND NOT `status:churned` AND Last Activity > 7 days | Workflow #7 (Catering Inquiry Nurture, Section 13) |
| **Dormant (90+ days no activity)** | `status:active-customer` AND Last Activity > 90 days | Workflow #10 (Dormant Customer Reactivation, Section 13) |
| **Recent Buyers (Last 30 Days)** | `behavior:purchased` AND Last Activity in last 30 days | Highest-engagement list for warmup Week 3-4 sends (Section 3 Step 8) |
| **Review Eligible** | `interest:review-eligible` | Workflow #3 (Review Request, Section 12) |
| **Negative Feedback Flagged** | `behavior:negative-feedback` | Workflow #4 (Negative Feedback Handler, Section 12) |
| **Passive Feedback Flagged** | `behavior:passive-feedback` | Owner-visibility queue (no automation — Stacy/Josh personal outreach window) |
| **SMS Subscribers** | `behavior:subscribed-to-sms` AND NOT DND-SMS | SMS-only campaigns; A2P-safe audience |
| **VIP** | `segment:vip` | Hand-picked top-tier customers; invite to tastings, early access to seasonal offerings |

### 4.2 How to create a Smart List

1. Contacts → Smart Lists → **+ New Smart List**.
2. Click **More Filters**.
3. Select filter type (Tags, Custom Fields, Last Activity, DND status, etc.).
4. Configure operator (contains, equals, not, between dates).
5. Add additional filters with AND / OR logic.
6. Click **Apply** to preview matching contacts.
7. Click **Save as Smart List** → name it → save.

### 4.3 Recipient-list-at-send-time behavior

Smart Lists are computed at the time an email campaign is SENT or a workflow ENROLLS — not at the time of scheduling. This means:
- A customer who joins "New Leads (Last 7 Days)" after a campaign is scheduled but before it sends → they get the email.
- A customer who leaves "Dormant" (via activity) between scheduling and send → they're excluded.

This is correct behavior for dynamic segmentation. Surface in the operator playbook so the VA understands why scheduled-send audience counts can fluctuate.

### 4.4 Smart List permissions

By default, Smart Lists are user-scoped (each user sees their own). Promote to "account-wide" if Stacy and Josh need to see the same lists Dan built. Promotion is typically via a three-dot menu on the Smart List. [UI-VERIFY]

---

## Step 5 — Coordinate import volume with LC Email warmup

Section 3 Step 8 established the warmup schedule. Re-applied here for Section 6 planning:

| Week | Max daily sends | What Section 6 can do |
|---|---|---|
| Week 1 | 25-50 | Transactional sends only. DO NOT blast imported list. Workflow-triggered appointment confirmations and receipts are fine. |
| Week 2 | 100-250 | Still no mass list blast. Welcome sequence (Workflow #5) for new leads can ramp. |
| Week 3 | 500-1,000 | First marketing send — to the MOST ENGAGED Smart List ("Recent Buyers (Last 30 Days)"). NOT the full list. |
| Week 4 | 2,000-5,000 | Expand to "Active Customers." |
| Week 5+ | Open | Full list if engagement metrics stayed healthy during warmup. |

**If Q8 returned a large list (>5,000 contacts):** plan on a **6-8 week** full-list ramp, not 4 weeks. Larger lists have more bounce/complaint risk on cold outreach; slower is safer.

**If Q8 returned a small list (<500 contacts):** the warmup schedule is still observed but practically the whole list can receive sends by Week 3-4 without hitting volume thresholds.

Document the ramp plan in the Intake Document:

```
LIST + EMAIL RAMP COORDINATION
Total contacts imported: [n]
Recommended full-list warmup: [4 or 6-8 weeks based on size]
Week 1: [dates] - transactional only
Week 2: [dates] - welcome sequence live, no list-blast
Week 3: [dates] - first marketing send to Recent Buyers Smart List
Week 4+: [dates] - expand audience progressively
Full-list-send approved from: [estimated date]
```

---

## Step 6 — Verify

### 6.1 Spot-check imported contacts

Pick 3-5 random contacts from the imported batch. For each:
- Verify Custom Fields populated (Dietary Preferences, Customer Type, etc.).
- Verify tags applied (source + segment).
- Verify email and phone validated.
- Verify no duplicate records.

### 6.2 Test one Smart List

Open the "New Leads (Last 7 Days)" Smart List. Confirm it shows expected contacts. Add a test contact with `status:new-lead` — verify it appears within 30 seconds. Remove the tag — verify it disappears.

### 6.3 Test DND enforcement

Pick one contact. Set DND-Email via bulk action. Send a test email via Conversations — verify HighLevel blocks the send (should show error or warning). Re-enable. This confirms opt-out respect is enforced.

---

## Completion criteria

1. ✅ CSV(s) imported with field mapping, tag application, and duplicate handling.
2. ✅ Duplicate merges resolved (manual pass post-import).
3. ✅ Prior-system opt-outs honored via DND flags.
4. ✅ 12 baseline Smart Lists created.
5. ✅ Smart List permissions set for Stacy/Josh visibility.
6. ✅ Import batch log in Intake Document.
7. ✅ LC Email warmup coordination plan documented.
8. ✅ Spot-check + DND test verification complete.

---

## What happens next

**Sections 12-14 — Workflows** enroll from the Smart Lists built here. New Lead Welcome reads "New Leads (Last 7 Days)." Wholesale Nurture reads "Wholesale Accounts." Dormant Reactivation reads "Dormant (90+ days)."

**Section 17 — Website + Funnel + Blog** embeds forms that write new contacts into this database with Section 5's tag taxonomy.

**Section 20 — Dashboards** surfaces Smart List counts as widgets (e.g., "Active Customers" count, "New Leads This Week" count).

---

## Flags for this section

- **Assumptions made:** (a) Q8 informs but doesn't block — Smart Lists build regardless of existing list size; (b) 12 baseline Smart Lists cover Caramel Oven's immediate workflow needs; more can be added as patterns emerge; (c) CSV-column-to-field-name mapping table assumes HighLevel's standard header conventions — UI-VERIFY at first import if labels differ; (d) "Role addresses" exclusion (`info@`, `sales@`) assumes Stacy/Josh's personal farmer-market contacts aren't under shared-mailbox addresses — if they are, adjust.
- **Gaps identified:** UI-VERIFY flags on Contacts → Import Contacts toolbar location, bulk Merge action location, Smart List promotion to account-wide visibility, DND send-enforcement UI behavior.
- **Competing approaches:** (a) Import + tag via CSV "Tags" column vs. bulk-apply-at-import-wizard-step — chose wizard step because it supports complex tags per batch. (b) Smart Lists vs. Groups/Static Lists — Smart Lists are dynamic (correct default); static lists could be appropriate for frozen historical cohorts (e.g., "Opened Caramel Oven 2024") but not needed at launch.
- **Client-side blockers:** Q8 informs planning (list size, source). Non-blocking — section builds Smart Lists whether or not there's an existing list.
- **Platform-level irreversible decisions:** None. Contacts can be deleted + restored (limited window). Smart Lists can be deleted. Tags can be renamed (though mass retagging propagates through Smart List membership).

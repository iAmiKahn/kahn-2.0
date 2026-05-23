# Snapshot Packaging Playbook — Caramel Oven → Bakery/Farmers-Market Snapshot

**Last Updated:** 2026-04-17
**Purpose:** Convert the completed Caramel Oven sub-account build into a reusable HighLevel Snapshot that can be loaded into future client sub-accounts, compressing ~4-6 weeks of build time into ~15 minutes.

**When to execute:** Post-launch validation (30-day operational check) confirms Caramel Oven's system works as specified. Do NOT package before validation — a Snapshot with broken workflows propagates the breakage to every future client.

---

## What transfers in a Snapshot

Per the Snapshot Overview article (48000982511) and Phase 1 research, a Snapshot CAN include:

- **Workflows** — all 10-12 built in Sections 12-14
- **Pipelines** — Wholesale + Catering
- **Calendars** — Services configuration (Custom Order Consultation + Catering Tasting)
- **Tags** — the ~20-tag taxonomy + 3 workflow-state tags from Section 13 + any added in Section 12/14
- **Custom Fields** — all Contact + Opportunity custom fields
- **Custom Objects** — if activated
- **Funnels / Websites** — full page builds
- **Forms / Surveys / Quizzes** — all 4 forms + 1 survey from Section 8
- **Email templates** — all drafted in Sections 12-14 + brand Board-styled base templates
- **SMS templates / Snippets**
- **Trigger Links**
- **Brand Board** (with placeholder logo — see below)
- **Custom Reports** (on $297+ plans)
- **Voice AI configuration** (if activated)
- **Chat Widget configuration**

## What does NOT transfer

- **Contact records** — each sub-account's customer list is separate (intended; snapshot is a template, not data).
- **Opportunity records** — same.
- **Schedules and recipient lists** for Custom Reports.
- **Private dashboards** — only Custom Reports transfer via snapshot.
- **Integrations with external data sources** (Google Ads, FB Ads, Stripe credentials, GBP connection) — each sub-account re-connects.
- **Phone numbers** — each sub-account purchases its own.
- **Domain DNS** — each sub-account configures its own.
- **A2P Brand + Campaign registrations** — per-entity; each new business registers separately.

---

## Pre-packaging checklist

Before creating the Snapshot, ensure:

1. ✅ Caramel Oven build has been live for ≥30 days with no critical workflow failures.
2. ✅ All workflow stats show clean execution (error rate <5%, enrollment/completion ratio healthy).
3. ✅ Email deliverability verified (SPF/DKIM/DMARC passing; domain warmup complete through Week 4+).
4. ✅ A2P Campaign approved and SMS is delivering.
5. ✅ Dan, Stacy, Josh have each signed off that the system does what they expected.
6. ✅ No "TODO" or placeholder content remaining in templates (generic "[business name]" strings should all be merge-field-driven, not literal).
7. ✅ Brand Voice finalized (Q9 answered; placeholder replaced with Stacy/Josh-authored version).

Skipping the 30-day wait means snapshotting an untested build. Resist the temptation.

---

## Packaging steps

### Step 1 — Sanitize the source sub-account

The Snapshot will inherit whatever's currently configured. Before packaging:

1. **Review all Custom Values** (Settings → Custom Values). Any that contain Caramel-Oven-specific literal values should either:
   - Be marked as "pre-fill at load time" with a placeholder like `[set at load time]`, OR
   - Remain — the loading client will overwrite them in their Section 2 execution.
2. **Review all email templates** for literal "Caramel Oven" / "Stacy" / "Josh" strings. Replace with merge fields where possible: `{{custom_values.business_name}}`, `{{custom_values.owner_first_name}}`. Leave literal brand where it's clearly Caramel-Oven-specific copy (e.g., recipe-post blog content).
3. **Review all SMS templates** same pattern.
4. **Review Brand Board** — leave as "Caramel Oven" baseline; loading clients customize in their own Section 5.
5. **Remove test contacts** (any "Test Lead" records left from verification steps).
6. **Delete demo Opportunities** from Section 10 seeding.

### Step 2 — Create the Snapshot (Agency-level action — Dan)

**Path:** Agency View → Account Snapshots → Create New Snapshot.

1. Select source sub-account: Caramel Oven.
2. Name the Snapshot: **"Bakery / Farmers-Market v1.0"** (version matches guide version per Update Protocol).
3. Select assets to include:
   - ✅ Workflows (all 10-12)
   - ✅ Pipelines (both)
   - ✅ Calendars (Services config)
   - ✅ Tags
   - ✅ Custom Fields
   - ✅ Forms + Surveys
   - ✅ Email templates
   - ✅ SMS Snippets
   - ✅ Funnels / Websites (if production-ready)
   - ✅ Chat Widget config
   - ✅ Brand Board baseline
   - ❌ Contact/Opportunity DATA (template only)
4. Save.

Granular asset selection is supported (155000005146 Selective Asset Snapshots) — use if any asset type shouldn't be shared across all future clients.

### Step 3 — Test load the Snapshot

Create a test sub-account in Dan's Agency. Load the "Bakery / Farmers-Market v1.0" Snapshot into it. Verify:

1. All workflows load; stats start at zero (expected).
2. All pipelines load with correct stages and custom fields.
3. All forms/surveys load with correct field mappings.
4. All email templates load; merge-field references resolve against the test sub-account's Custom Values.
5. Calendars load with Services configuration intact.
6. Tags load (taxonomy visible in Settings).
7. Brand Board loads (colors/fonts/logo — the Caramel Oven baseline).

If any asset fails to transfer, re-check Snapshot selection and re-export.

### Step 4 — Document the Snapshot

Create `SNAPSHOT_MANIFEST.md` in the workspace documenting:

```
BAKERY / FARMERS-MARKET SNAPSHOT v1.0
Created: [date]
Source sub-account: Caramel Oven (Location ID [id])
Based on: Caramel Oven HighLevel Build Guide v1.0 (delivered 2026-04-17)

Assets included:
- Workflows: [count] across 3 folders (Lead Nurture, Appointment & Purchase, Commerce)
- Pipelines: 2 (Wholesale, Catering)
- Custom Fields: 20 (10 Contact + 8 Opportunity + 2 reserved)
- Tags: ~25 (5 category families + workflow-state tags)
- Forms + Surveys: 4 forms + 1 survey
- Email templates: [count]
- SMS templates: [count]
- Calendars: 2 Services (Custom Order Consultation, Catering Tasting)
- Brand Board: Caramel Oven baseline (customize at load)

Known limitations:
- A2P compliance copy in SMS templates assumes US Business Profile — international clients need adjustment
- Workflow email copy uses bakery-specific seasonal callouts (rhubarb-almond tart, etc.) — edit for non-bakery clients
- Services v2 calendar structure assumes in-person tasting format — adjust for virtual-only or service-not-applicable businesses
```

### Step 5 — Publish internally

- Save the Snapshot in the Agency's Snapshot library.
- Record in PitchBlack's internal client onboarding playbook that "Bakery / Farmers-Market v1.0" is the default load for applicable new clients.
- Do NOT publish to HighLevel App Marketplace yet — wait until ≥3 client applications validate that the Snapshot works across multiple business variants.

---

## Snapshot lifecycle

Per the Update Protocol, Snapshots evolve with the guide:

- **Patch-level guide updates (v1.0.x)** — typically no Snapshot re-release; changes are prose-level, not config-level.
- **Minor version guide updates (v1.X)** — Snapshot re-packaged to Bakery v1.X when new workflows/pipelines/fields are added.
- **Major version guide updates (vX.0)** — full Snapshot rebuild; client sub-accounts that inherited v1 may need structural migration.

### Version management

Keep prior Snapshot versions available. Do NOT delete v1.0 when v1.1 is created — existing clients may need to reference what they loaded.

Naming convention: `Bakery / Farmers-Market v1.0` → `v1.1` → `v2.0`.

### Re-loading onto existing clients

When a Snapshot update lands, existing clients face a choice:
- **Re-load Snapshot updates selectively** (155000005416 Manage Snapshot Push Settings) — apply only the specific asset additions (new workflows, new custom fields).
- **Full re-load** — rarely recommended; overwrites their customizations.

Document this as a "Snapshot update" process in the client's operator playbook.

---

## Future: App Marketplace distribution

After 3+ successful client applications of the Bakery Snapshot, evaluate publishing to HighLevel's App Marketplace (under Snapshots in App Marketplace — 155000000819).

Marketplace listing would:
- Turn PitchBlack into a HighLevel ecosystem vendor.
- Allow other agencies (not just direct clients) to load the Snapshot.
- Create passive revenue if the Marketplace supports paid listings.
- Require compliance with HighLevel's Marketplace review process.

Out of scope for Phase 5.1 initial packaging. Flag for post-Client-3 strategic review. See STRATEGIC_FUTURE.md §6 for context.

---

## Completion criteria

Snapshot Packaging is COMPLETE when:

1. ✅ Caramel Oven build validated in production for ≥30 days.
2. ✅ Sanitization pass complete (literal strings replaced with merge fields where appropriate).
3. ✅ Snapshot created at Agency level, named "Bakery / Farmers-Market v1.0".
4. ✅ Test-load verified on a throwaway sub-account.
5. ✅ `SNAPSHOT_MANIFEST.md` written and saved to this workspace.
6. ✅ Internal PitchBlack onboarding playbook updated to reference the Snapshot as default load for applicable clients.

Target execution: T+30 days from Caramel Oven go-live.

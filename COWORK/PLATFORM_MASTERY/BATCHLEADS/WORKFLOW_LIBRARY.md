# WORKFLOW_LIBRARY — BatchLeads

Every atomic workflow the platform supports — the mechanical steps to execute each core task. Strategy-level sequencing lives in USE_CASE_PLAYBOOK. This file is the "how," not the "why."

Workflows below captured 2026-04-17 from Andres's Workspace on a 6-days-remaining free-trial account (`$0.00` credit balance). Trial-gating annotations reflect what was actually reachable, not what the platform theoretically supports.

## Template — copy for each workflow

```
### [Workflow Name]
- Trigger: [UI entry point, e.g. sidebar → Lists → "Create List"]
- Preconditions: [anything that must be true before starting]
- Steps:
  1. …
  2. …
- Outputs: [what is produced — saved list, CSV, campaign, etc.]
- Edge cases: [failure modes, partial completions, undo paths]
- Permission risk: [none | ask | prohibited — per safety rails]
- Observed on: [yyyy-mm-dd]
```

---

## Core workflows

### Property Search (primary work surface)
- **Trigger:** Top-nav → `Property Search` → `/app/property-search-new`.
- **Preconditions:** None. Page loads with any prior filter state from `localStorage.propertySearchFilterPayload`.
- **Steps:**
  1. Enter location in the top-bar `query` input (accepts city/state/zip/county/address).
  2. (Optional) Draw or adjust map polygon → `areaPolygons=true` constrains results.
  3. (Optional) Toggle the `All / Off Market / On Market` scope chip.
  4. (Optional) Click a Map Quick Filter chip to one-click-apply a prepackaged filter combo (28 chips available).
  5. (Optional) Click `All Filters` to open the right-side accordion drawer; expand any section (Property Characteristics / MLS Status / Pre-Foreclosure/Auctions/Tax/Lien / Ownership Info / Valuation & Equity / Mortgage Info / Cash Buyers / Demographics); set filter values.
  6. Results live-update to show matching properties on map + in a sidebar result list.
  7. Result count shown as "N properties found". Sort options: Default, Sq Ft, Days On Market, Year Built, BatchRank.
- **Outputs:** A filtered property-result set (map pins + list view + photo view + table view).
- **Edge cases:**
  - Filter state persists across navigation via localStorage; restore script in `state/filter_snapshot_*.json`.
  - `All Filters` button toggles the accordion drawer — second click closes it.
  - Clicking an accordion section header toggles expand/collapse; ng-bootstrap typically allows only one panel open at a time.
  - ng-select dropdowns require `mousedown` event, not `click`, to open programmatically.
- **Permission risk:** none (read-only UI).
- **Observed on:** 2026-04-17.

---

### Save Search (reusable filter preset)
- **Trigger:** Property Search sidebar → `Save Search` button (bottom of left result panel).
- **Preconditions:** A filter configuration must be applied — Save Search creates a named recallable version of the *current* filter state.
- **Steps:**
  1. Click `Save Search` — modal opens, titled "SAVE SEARCH".
  2. Fields in the modal:
     - `Search Name` — text input (required).
     - `Include in Map Quick Filters` — toggle. **If enabled, the saved search becomes a one-click chip** on the Quick Filter bar for future sessions.
     - `Search Details` — read-only preview of the filter values (truncated labels like "Location: Beverly H...", "Classification: Residenti...", etc.).
  3. Click `Save` to commit. Modal closes; the search is stored server-side and tied to `savedFilterId`.
- **Outputs:** A persistent saved-search record in Andreas's account. Appears in the search recall list (path TBD).
- **Edge cases:** Saved searches persist until deleted (which is prohibited per safety rails).
- **Permission risk:** **ASK** — creates a persistent artifact in Andreas's account.
- **Observed on:** 2026-04-17. Modal opened; Cancel clicked before commit; Andreas's saved-search list was not mutated.
- **Methodology note for HighLevel:** Every SaaS worth automating has some form of reusable preset. Always look for the "save this configuration" button before writing custom state management.

---

### My Lists management
- **Trigger:** Top-nav → `My Lists` → `/app/mylist-new`.
- **Preconditions:** At least one list / one lead in the workspace.
- **Top-bar controls observed:**
  - `Select Lists Or Tags` — filter the table by list membership or tag.
  - `Quick Filters` — recall saved-search-style Quick Filter presets (distinct from Property Search Quick Filters?).
  - `All Filters` — open full filter drawer for the leads table.
  - `Actions` — dropdown, **disabled until at least one row is selected**. See sub-actions below.
  - `Export` — top-level button. Permission-gated per safety rails (not clicked).
  - `Import` — top-level button. Permission-gated per safety rails (not clicked). Likely opens a CSV-upload modal with skip-trace-on-ingest options.
- **Table columns (confirmed 20+):** Lead Status, Property Address, City, State, Zip, Phone Numbers (up to 3), Owner First Name, Owner Last Name, List Count, Tag Count, Mailing Address, Mailing City, Mailing State, Mailing Zip Code, Emails, Pics, Opt Out, Date Added, Date Updated, ARV Spread, BatchRankAI.
- **Row interactions:**
  - Phone numbers render as clickable tokens — clicking likely initiates a call via BatchDialer integration. **NOT tested — would trigger outbound call.** Permission-gated.
  - Address text is display-only (not a link in the current render).
  - Checkbox at row start selects the row for Actions menu.
- **Pagination:** Rows-per-page options 15 / 25 / 50 / 100. First / Previous / Next / Last navigation.
- **Permission risk:** none to view; phone-click and Export/Import are gated.
- **Observed on:** 2026-04-17.

---

### Actions menu (bulk operations on selected leads)
- **Trigger:** My Lists → select one or more rows → click `Actions` dropdown.
- **Preconditions:** At least one row checked. Without selection, the trigger has class `dropdown_disabled` and yields no menu items.
- **Menu items observed (in order):**
  1. `Add to Campaign` — likely gated on trial (Campaigns sub-menu is `sub-disable`).
  2. `Export to` — submenu probably opens format options (CSV / Excel / etc.). **Permission-gated; not clicked.**
  3. `Add to BatchDialer` — pushes leads into the BatchDialer sister product's dialer queue. **Permission-gated (integration action).**
  4. `Lead Status` — change the lead's status (hot / warm / cold / contacted / etc.).
  5. `Lists` — move or copy the lead between lists.
  6. `Self-Managed Tags` — apply/remove custom tags.
  7. `Opt In/Out` — mark lead as opted-out of outreach (compliance-critical).
  8. `Save to Agents` — attach lead to an Agent Outreach record.
  9. `Delete` — **PROHIBITED per safety rails.** Permanent list deletion.
- **Permission risk:** mixed — `Lead Status`, `Lists`, `Tags`, `Opt In/Out`, `Save to Agents` are mutating actions but within Andreas's account only, so they can execute with `ask` permission. `Export`, `Add to Campaign`, `Add to BatchDialer` are outbound-data or expansion actions — `ask` each time. `Delete` is never.
- **Observed on:** 2026-04-17.

---

### Skip Tracing (not directly exposed on current screens)
- **Trigger:** Not found as a standalone action on Property Search, My Lists, or Actions menu.
- **Inferred mechanism:** Skip-trace enrichment (resolving an address → owner name + phone + email) is most likely wired into one or more of:
  1. The `Import` workflow — CSV upload with opt-in skip-trace during ingest.
  2. The "Save to list" / "Add to list" step from Property Search — upon list creation, enrichment fires.
  3. A separate per-property enrichment button exposed only on the property detail page (not yet explored).
- **Evidence that it's automatic, not manual:** Andreas's one saved lead already carries three phone numbers + two emails in My Lists, despite Andreas never clicking a visible "Skip Trace" button — meaning enrichment fired as part of a prior workflow.
- **Credit cost:** Skip-tracing typically consumes BatchLeads credits. Balance is `$0.00` — so any skip-trace attempt in this trial will likely prompt an upgrade flow.
- **Permission risk:** **ASK** — consumes credits (billed action).
- **Observed on:** 2026-04-17 (inferred; not directly triggered).
- **To close this gap:** next session should open a property detail card (not accessible via address-text click; likely requires clicking a specific "View Details" button per-row) and look for a skip-trace or enrichment button there. Also check `/app/setting/lists` (Data Management) for bulk enrichment tools.

---

### Export workflow (handoff path to HighLevel)
- **Trigger:** My Lists → `Export` button in top toolbar OR Actions → `Export to` sub-menu.
- **Preconditions:** Leads must exist in the active list / selection scope.
- **Expected sub-options (not clicked in this session):** CSV, Excel, and possibly direct-to-integration formats. The "Export to" phrasing in Actions menu implies integration targets (Export to HighLevel / Export to Zapier / Export to Podio / etc.) may be supported — but since no native HighLevel integration exists (verified in Phase 1 at `/app/setting/marketplace`), HighLevel export would route via Zapier or webhook.
- **Output:** A file download or a webhook/API push.
- **Permission risk:** **ASK each time** per safety rails.
- **Observed on:** 2026-04-17 (button located; not clicked).

---

### Driving Routes / D4D
- **Trigger:** Top-nav → `Driving Routes` → `/app/driving-routes`.
- **Preconditions:** None. Intended for mobile use (walk/drive past properties and save them).
- **Steps:** Either use the web "Virtual Driving" flow (drag markers on map), or download the BatchLeads mobile app and drive routes in-person; properties saved during routing appear here with milestones (total saved, miles driven, time tracked).
- **Permission risk:** none to view. Saving a property during driving is a list-add action (ASK on commit).
- **Observed on:** 2026-04-17. Zero routes in Andreas's account.

---

### Agent Outreach
- **Trigger:** Top-nav → `Agent Outreach` → `/app/agent-outreach/search`.
- **Tabs:** `Agent Search`, `Agent Lists`.
- **Purpose:** Search for real-estate agents by location → add to an agent-outreach list → run outreach (typically to unlock on-market deals the agent represents).
- **Permission risk:** agent-outreach actions are outbound → ASK.
- **Observed on:** 2026-04-17. Zero agents saved.

---

### Settings: Direct Mail Setup (prerequisite for Direct Mail campaigns)
- **Trigger:** `/app/setting/direct-mail/templates` (Templates tab) and `/app/setting/direct-mail/signatures/add` (add Signature).
- **Steps (per Signature):** Friendly Name, Signature Name, Logo upload, Phone, Email, Website, ZIP, Address Lines, City, State, Disclosures. Save.
- **Permission risk:** **ASK** — creates a persistent record; may be required for any Direct Mail campaign to function.
- **Observed on:** 2026-04-17. Navigating directly to `/app/direct-mail` redirected to the Signatures-Add page with error "Signature Missing! Please create a signature and try again!" — confirming signature is a hard prerequisite.
- **Trial note:** Direct Mail campaigns may still be gated even after signature setup (Campaigns submenu observed as `sub-disable`).

---

## Gated / trial-disabled workflows (documented but not fully testable)

| Workflow | Entry Point | Gate | Observed behavior |
|---|---|---|---|
| Direct Mail Campaign creation | Campaigns → Direct Mail (sub-disable) | Trial / plan + signature prerequisite | Sub-menu disabled; direct URL navigation lands on Signatures setup. |
| Dialer AI (outbound calls) | Campaigns → Beta DialerAI (sub-disable) | Trial / plan | Disabled in Andreas's account. Phone numbers in My Lists are the call-trigger entry points when enabled. |
| Reports — Save/Export summary | Reports → Save / Export (sub-disable) | Trial / data-requirement | Disabled; likely unlocks when campaigns run and produce metrics. |
| Reports — Direct Mail Report | Reports → Direct Mail Report (sub-disable) | Trial / data | Disabled. |
| Reports — Call KPIs | Reports → Call KPIs (sub-disable) | Trial / data | Disabled. |
| Reports — D4D KPIs | Reports → D4D KPIs (sub-disable) | Trial / data | Disabled. |
| Lead Score settings | `/app/setting/lead-score` (disabled in sidebar) | Plan feature | `disabled` CSS class on sidebar link. |
| Referral program | `/app/setting/referral` (disabled in sidebar) | Plan feature | `disabled` CSS class. |

---

## Integration workflows (from `/app/setting/marketplace`)

| Integration | Type | Configuration | Status in account |
|---|---|---|---|
| Webhooks | outbound event push | `ADD NEW WEBHOOK` button; define Trigger + On Status | No webhooks configured. |
| Zapier | bidirectional API | API key exchange | API key slot present; no active zaps observed. |
| Podio | outbound CRM push | `MANAGE` button | 0 Podio integrations active. |
| HighLevel | — | **NOT NATIVE** | No built-in integration. Route via Zapier or Webhook. |
| BatchDialer | outbound (sister product) | Accessed from Actions menu `Add to BatchDialer` or top-nav `Switch To BatchDialer` | Direct handoff link present. |

---

## Non-destructive vs destructive

**Destructive / prohibited:**
- `Actions → Delete` — permanent list deletion. NEVER click.
- Any workflow that empties / mass-resets lists.

**Mutating but within-account (ASK):**
- Save Search (creates savedFilter record).
- Actions: Lead Status, Lists, Tags, Opt In/Out, Save to Agents.
- Add to BatchDialer, Add to Campaign.

**Expansive / outbound (ASK, + verify target):**
- Export, Import, Webhook add, Zapier key reveal, Podio connect.
- Skip Trace (credit-billed).
- Any outbound call initiation via phone-number click.
- Agent Outreach list additions → outreach.

**Read-only / safe:**
- All navigation.
- Filter drawer open/close, accordion expand/collapse.
- Dropdown-option inspection (open, read, close without committing).
- Snapshot capture of localStorage.

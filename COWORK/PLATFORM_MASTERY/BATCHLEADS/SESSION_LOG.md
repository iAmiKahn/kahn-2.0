# SESSION_LOG — BatchLeads

Chronological audit trail of every learning session. What I tested, what I observed, what hypotheses I formed, what I got wrong. This is the honest record — it's how mastery gets defended and how the methodology gets extracted for HighLevel.

## Template — one entry per session block

```
## [yyyy-mm-dd HH:MM] — Phase [n] — [short label]
- Goal: [what I set out to learn]
- Actions: [navigated / clicked / filtered — high level]
- Observations: [what the platform showed — surprising, expected, unclear]
- Hypotheses formed: [things I now believe but haven't confirmed]
- Corrections: [things I previously believed that turned out wrong]
- Next: [the question this session surfaced]
```

---

## Log

### 2026-04-17 — Phase 0 — Setup
- Goal: Stand up documentation skeleton, align on approach, request browser handoff.
- Actions: Created `COWORK/PLATFORM_MASTERY/BATCHLEADS/` with six skeleton files. Registered seven-task plan in TodoWrite. No browser action taken yet.
- Observations: No prior BatchLeads work found in `C:/Kahn 2.0` or `C:/Nebula Dashboard`. Starting from zero. Safety rails acknowledged — no deletes, permission-gated exports / campaigns / integrations / destructive filter edits.
- Hypotheses: Property Search is the richest filter surface; mastery velocity will come from exhaustively cataloguing it before attempting use-case synthesis. Skip tracing and export are the two workflows most likely to be permission-gated in practice.
- Corrections: None yet.
- Next: Browser handoff from Dan → Phase 1 reconnaissance.

### 2026-04-17 — Phase 1 — Landing recon (paused for permission)
- Goal: Confirm authenticated entry, capture baseline UI state, map top-level navigation.
- Actions: Created MCP tab group; navigated to `https://app.batchleads.io`; auto-redirected to `/app/property-search-new`. Ran DOM introspection via JS (no clicks, no filter changes).
- Observations:
  - Authenticated as Andres's Workspace (Andreas Bastidis). Workspace balance $0.00. Free trial — 6 days remaining.
  - **Landing Property Search has a pre-existing active-filter state**: 6 filters applied, producing 1 result — `1138 Coldwater Canyon Dr, Beverly Hills, CA 90210` ($5,575,000, 4/3, 3,275 sq ft, Active listing, 148 days on market, saved to 1 list). Filter chips visible: Classification: Residential; Property Type: Single Family; MLS Status: Active, Pending, +3 more; plus three more filters in Property Characteristics / Pre-Foreclosure-Auctions-Tax-Lien / Ownership Info / Cash Buyers sections.
  - Sidebar filter-section headers (Property Search): Map Quick Filters, Quick Filter, Property Characteristics, MLS Status, Pre-Foreclosure/Auctions/Tax/Lien, Ownership Info, Valuation & Equity, Mortgage Info, Cash Buyers, Demographics.
  - Map Quick Filter toggles visible (clickable chips): Location (All / Off Market / On Market), Absentee Owner, FSBO, On Market Deals, Preforeclosure, Tired Landlord, Tired Listings, New Listings, Failed Listing, Corporate Owned, In State Absentee Owner, Out of State Absentee Owner, Owner Occupied, Vacant, Active Listing, Pending Listing, Recently Sold, Cash Buyer, Free and Clear, High Equity, Unknown Equity, No HOA Fees, Inherited, Listed Below Market Price, Tax Default, Trust Owned, Involuntary Lien, Vacant Lot, Senior Owner.
  - Top-nav (draft sitemap): Dashboard `/app/dashboard` • Property Search `/app/property-search-new` • Driving Routes • My Lists • Agent Outreach • Campaigns (expandable: New Campaigns • Direct Mail [Beta] • Dialer • AI) • Reports (expandable: Save/Export • Direct Mail Report • Call KPIs • D4D KPIs).
  - Workspace menu (top-right): My Profile, My Workspace, Earn $25, Switch to Dark Mode, Log out. "Switch To BatchDialer" link suggests a sister product. Reia AI assistant present.
  - Onboarding modal overlay active ("Schedule Onboarding" + "Don't show this again"). Not dismissed — awaiting Dan's call.
  - Most sidebar items use custom handlers rather than `<a href>`, so URL extraction via hrefs only yielded two routes. Full sitemap will require clicking into each section and recording the resulting URL.
- Hypotheses:
  - The 6-filter Beverly Hills result is Andreas's active work (not scratch) — a $5.5M Beverly Hills Single-Family Active-with-mortgage-info tells a specific story.
  - Navigating between top-level routes likely preserves Property Search filter state (state lives in app store, not URL).
  - Reia AI assistant may expose platform reasoning that accelerates filter-taxonomy work.
  - "BatchDialer" is a separate paid product, not a sub-feature.
- Corrections: None.
- Blocker: Need Dan's decision on preserving Andreas's active filter configuration before I interact with Property Search filters (Phase 2). Safe parallel work available in Dashboard / Lists / Reports / Settings without touching Property Search.
- Next: Pending Dan's call on filter preservation + modal dismissal.

### 2026-04-17 — Phase 1 — Sitemap + critical schema discovery (completed)
- Goal: Enumerate top-level sections, discover filter taxonomy shortcut if available.
- Actions: Captured `propertySearchFilterPayload` from localStorage (full 3388-char JSON, hash 962725023). Wrote restoration snapshot to `state/filter_snapshot_2026-04-17.json`. Closed onboarding modal via programmatic click. Navigated Dashboard → My Lists → Driving Routes → Agent Outreach → Settings → Integrations. Returned to Property Search; verified filter intent intact.
- **Critical find — localStorage filter payload.** The entire Property Search filter state is stored in `localStorage.propertySearchFilterPayload` as a 116-key JSON document. This exposes the complete filter schema without requiring UI introspection. Key names double as the filter taxonomy. Empty-value shapes (`""` vs `["", ""]` vs `[""]` vs `[]` vs nested arrays) encode each filter's type. Restoration is a single `localStorage.setItem` + `location.reload()`.
- **Sitemap (first pass):**
  - `/app/dashboard` — Dashboard: property-count stats, list-count chart, vacancy pie chart. Minimal.
  - `/app/property-search-new` — Property Search: map + sidebar filters + result list. Primary work surface.
  - `/app/driving-routes` — Driving Routes: D4D (Driving for Dollars). Virtual driving + mobile app for saving properties while driving. Metrics: saved properties, miles, time.
  - `/app/mylist-new` — My Lists: tabular view of saved leads with 20+ columns (address, owner name, phones, emails, ARV Spread, BatchRankAI, etc.). Actions: Export, Import, Save Filter.
  - `/app/agent-outreach/search` — Agent Outreach: find agents to unlock on-market deals. Tabs: Agent Search, Agent Lists.
  - `/app/setting/*` — Settings: USER PROFILE (`/app/setting/profile`), BILLING (`/app/setting/plans`), DATA MANAGEMENT (`/app/setting/lists`), INTEGRATIONS (`/app/setting/marketplace`), DIRECT MAIL SETUP (`/app/setting/direct-mail/templates`), LEAD SCORE (disabled), CALL SETTINGS, REFERRAL (disabled).
  - Campaigns top-level: has "New Campaigns" header and two sub-items (Direct Mail, Beta DialerAI). Both are inside `.sidebar-submenu sub-disable collapse` — **the submenu is `sub-disable`**, meaning campaigns are GATED on this free-trial account. Direct navigation to `/app/campaigns/direct-mail` → 404. `/app/direct-mail` → redirects to setup wizard at `/app/setting/direct-mail/signatures/add`. Confirms campaign creation requires signature setup + likely paid plan.
  - Reports top-level: Save/Export, Direct Mail Report, Call KPIs, D4D KPIs. Also in `sub-disable` containers — likely gated until data exists.
  - External: "Switch To BatchDialer" links out to `https://app.batchdialer.com/dashboard` — sister product.
- **Integrations inventory (from `/app/setting/marketplace`):** WEBHOOKS (ADD NEW WEBHOOK, none configured), Zapier API Key, Podio (0 integrations, MANAGE button). No native HighLevel integration — Andreas→HighLevel pipeline will route through Zapier or webhooks.
- **Free-trial gating summary:** LEAD SCORE disabled, REFERRAL disabled, Campaigns submenu sub-disable, Reports submenu sub-disable, "6 days remaining" trial banner (captured pre-dismissal), "$0.00" workspace credit balance (skip tracing / exports consume credits).
- **PII note:** My Lists page exposed owner contact data for the one saved lead. Authorized per directive, but not transcribed to any documentation file.
- **Filter-state preservation verification:** After navigating Dashboard → My Lists → Driving Routes → Agent Outreach → Settings → back to Property Search, the `propertySearchFilterPayload` hash changed from 962725023 → -1943244530 but only because session-scoped fields regenerated (`search_id`, `sessionId`, `geoCluster` bounds). All filter-intent values (propertyClassifications, propertyType, mlsStatus, dealPotential, foreclosureStatus, ownerStatusType, query) identical pre/post. Result count still "1 properties found" — Andreas's work intact.
- Hypotheses:
  - The 116-key schema gives a complete Phase-2 first draft without clicking any filter. UI cross-reference is only needed to confirm labels + enum option lists.
  - BatchRankAI (column in My Lists, also a `batchrank_score_percentile` field in filter payload) is BatchLeads's proprietary deal-quality ranking. Worth investigating — likely central to many use-case playbooks.
  - "dealPotential":"discount" (set in Andreas's baseline) and "arvListingDiscount":[0,75] suggest a workflow for finding listings discounted below ARV. Andreas's active search appears to be targeting distressed / discount-listed single-family homes in Beverly Hills with any foreclosure flag and individual ownership.
- Corrections: None.
- Next: Phase 2a — populate FILTER_DEFINITIONS.md from the localStorage payload schema (can produce without UI clicks).

### 2026-04-17 — Phase 2a — First-cut taxonomy from JSON schema (completed)
- Goal: Populate FILTER_DEFINITIONS.md with all 116 keys without touching the UI.
- Actions: Grouped keys by sidebar section (Property Characteristics / MLS Status / Deal Potential / Pre-Foreclosure-Tax-Lien / Ownership Info / Valuation & Equity / Mortgage Info / Cash Buyers / Demographics / Geography / Result Scope / Session Meta). Inferred type from value shape. Marked confidence flag per entry. Captured the full Quick Filter chip inventory (28 chips). Provided restoration procedure.
- Corrections: None.
- Next: Phase 5 first, then Phase 2b for UI cross-reference.

### 2026-04-17 — Phase 5 — Use-case playbook synthesis (completed)
- Goal: Design filter stacks for Andreas's pipeline + general deal-finder patterns + practice runs against Dan's three sample validation objectives.
- Actions: Wrote 3 Andreas-specific playbooks (PB-1 mortgage-protection, PB-2 recent refinancers, PB-3 empty-nesters) + 5 general playbooks (DF-1 through DF-5 covering 30-day sellers, absentee landlords, inherited, pre-foreclosure+equity, vacant+tax-delinquent) + 3 validation practice runs (V-1 McHenry County, V-2 zip 60156 refinancers, V-3 Oklahoma absentee landlords). Each entry includes rejected alternatives with reasoning.
- Critical uncertainty flagged: V-2 and PB-2 depend on identifying the refi-date-equivalent filter path. Resolved partially in Phase 2b below.
- Hypotheses: BatchRankAI is the universal ranking primitive for "top N" objectives — this is likely the methodology lesson transferable to HighLevel (look for a built-in ranker before hand-rolling one).
- Next: Phase 2b.

### 2026-04-17 — Phase 2b — UI enum cross-reference (partial; sufficient for playbook confidence)
- Goal: Convert 🟡 inferred enums to ✅ UI-confirmed by opening sidebar accordion panels and extracting option lists.
- Actions: Opened Property Search "All Filters" drawer; expanded Property Characteristics / MLS Status / Ownership Info / Mortgage Info accordion panels in sequence. Used `MouseEvent('mousedown')` dispatch to open ng-select dropdowns programmatically (ng-select listens to mousedown, not click). Read `.ng-option` innerText per panel.
- **Enums confirmed (6 critical):**
  - `propertyClassifications`: 9 options — Residential, Commercial, Office, Recreational, Industrial, Agricultural, Vacant Land, Exempt, Miscellaneous.
  - `propertyType`: 48+ options (sampled); spans residential subtypes from Single Family through Condo, PUD, Mobile Home Park, Dormitory, plus commercial/industrial subtypes.
  - `mlsStatus`: 5 options — Active, Pending, Sold, Failed, Off Market.
  - `ownerStatusType`: **only 2 options** — Individual, Company Owned. Phase 2a inference had this wrong (assumed 4). Trust/LLC treatment lives elsewhere.
  - `deed_types` (UI label "Deed Transfer Type"): 8 options — Warranty Deed, Deed, Grant Deed, Special Warranty Deed, Vendor's Lien, Bargain and Sale Deed, Intra Family Transfer, Unknown & Other. **No refinance option** — major finding.
  - `firstLoanType` (UI label "1st Loan Type"): 13 options including **"Standalone Refinance"**. This is the refi filter path.
- **Gaps (still 🟡 — deferred):** `occupancyStatus`, `vacantStatus`, `dealPotential`, `lienType`, `lastTransferDocumentType`, `buildingType`, `buildingFeatures`, `criteriaType`, `firstLoanType` extra values, demographic enums. Can be closed in a future Phase 2b session — none blocks the playbook validation test.
- **Critical finding for Andreas:** BatchLeads exposes no date filter for mortgage origination / mortgage recording. "Refinanced in last N months" requires external data (county recorder / MLS) to time-narrow the BatchLeads refi-type-filtered export. Flagged in USE_CASE_PLAYBOOK V-2 as the operational pipeline.
- **State preservation verified:** Drawer closed, accordion panels collapsed, Andreas's filter intent intact — all 6 active filters identical, result still 1 property.
- Corrections:
  - PB-2 and V-2 in USE_CASE_PLAYBOOK updated to use `firstLoanType = "Standalone Refinance"` instead of the `deed_types` path.
  - FILTER_DEFINITIONS updated: 6 enums moved 🟡 → ✅ with a Phase 2b changes summary table.
- Next: Phase 3 — workflow mapping.

### 2026-04-17 — Phase 3 — Workflow mapping (completed, observation-only)
- Goal: Map every core workflow without triggering gated or billed actions. Stop at the pre-commit step for Export, Skip Trace, Import, Campaign operations.
- Actions: Observed Save Search modal (captured fields: Search Name, Include in Map Quick Filters toggle, Search Details preview, Save button — cancelled without committing). Opened Actions menu on My Lists (required pre-selecting a checkbox; `actions-dropdown` has `dropdown_disabled` class when empty). Enumerated all 9 Actions menu items. Deselected checkbox to restore state. Attempted to open Import modal — no modal appeared from the Import-button click (likely needs a file-input trigger invisible to the initial click). Checked per-row phone numbers (render as clickable tokens — likely BatchDialer call triggers, not clicked).
- **Workflows documented in WORKFLOW_LIBRARY.md:** Property Search, Save Search, My Lists management, Actions menu (9 sub-operations), Skip Tracing (inferred mechanism — embedded in import / list-save, not a standalone action), Export, Driving Routes, Agent Outreach, Direct Mail Setup. Plus 8 gated/trial-disabled workflows documented with their entry points and observed gate signals.
- **Actions menu inventory:** Add to Campaign · Export to · Add to BatchDialer · Lead Status · Lists · Self-Managed Tags · Opt In/Out · Save to Agents · **Delete (prohibited)**.
- **Key platform observation:** BatchLeads has no native HighLevel integration. Andreas→HighLevel must route through Zapier API or outbound webhook. Pipeline design sketched in INTEGRATION_MAP.md.
- **Phone-number row behavior observed but not triggered.** Clicking a phone number likely initiates a BatchDialer outbound call — permission-gated in both safety-rail interpretation (outbound action) and directive scope (billed credits / compliance).
- **Curious anomaly:** My Lists table showed different ARV Spread / BatchRankAI values on re-visit ($7.8M / $2.3M initially; $17.4M / $11.8M on return). Either the columns re-rendered with different field meanings, a server-side recompute occurred, or display order shifted. Not blocking — flagged for verification in Phase 4.
- **State preservation:** Checkbox restored to unselected; Save Search modal dismissed without commit; no saved artifact created; Andreas's account state unchanged.
- Hypotheses:
  - Skip Trace is most likely wired into the Import-from-CSV flow as an opt-in enrichment-at-ingest step, and/or fires automatically when a lead is added to a list. Not a standalone Actions menu item.
  - "Export to" in Actions may be a submenu with integration targets (Zapier, Podio, etc.) — unclicked.
  - Reia AI assistant may expose filter-recommendation capability; unexplored.
- Corrections: None since Phase 2b.
- Next: Phase 6 self-validation. Skipping Phase 4 (support docs) as optional — the six filter-enum gaps + skip-trace flow + export-submenu are knowable in a follow-up session and not blocking for validation-test readiness.

### 2026-04-17/18 — Phase 6 — Live validation test (V-OKC)
- Goal: Execute Dan's novel objective — "Top 10 properties in OKC where owner is likely in financial strain AND recently refinanced into a HIGHER rate than original AND has high equity. Rank by distress signal strength."
- Pre-execution protocol (committed in SELF_VALIDATION C6): named objective back ✓ · flagged two proxies explicitly ("recently refinanced" has no date filter; "higher-than-original rate" is a current-rate-plus-long-tenure inference) ✓ · declared filter stack with per-key defense ✓ · named rejected alternatives (`deed_types` for refi / `mlsStatus=Active` / `freeAndClear=true` / multi-family types / custom scoring) ✓ · listed fallback relaxation chain ✓.
- Dan's calibration: adjusted `firstLoanInterestRate` threshold from ≥7% to ≥6.5% based on 2026-04-17 mortgage-rate reality (6.69-6.75%). Confirmed 2016 baseline rates (3.5-4.0%) as the "original rate" context.
- Execution findings:
  - Tight stack (`firstLoanInterestRate ≥ 6.5` + refi + 10yr tenure + 50% equity + active foreclosure) → **0 results.** Either OKC distressed-refi-high-equity borrowers rarely carry 6.5%+ current rates (most refi-to-higher cohort is in the 2023-24 peak, small overlap with distress), OR the rate field is sparsely populated in BatchLeads records and a `≥6.5` filter excludes null-rate rows.
  - Relaxed stack (dropped `firstLoanInterestRate`) → **85 results.** Target pool identified.
  - BatchRank High→Low sort applied. Top 10 extracted from DOM list view.
- Delivered: top 10 ranked table with address / last-sale / est-value / year-built / tenure (where visible) / equity-Δ proxy / priority 1-10 scoring + per-property data-gap flagging + honest defense of calibration surprise + pivot-readiness options.
- Operational friction observations:
  - **localStorage-direct-write is not sufficient.** Setting `propertySearchFilterPayload` via `localStorage.setItem` + `location.reload()` committed filter VALUES but the UI re-rendered in the empty-state (no results panel). The search fetch only triggered after a UI-driven click — specifically clicking a Map Quick Filter chip (Preforeclosure). Methodology lesson: **state injection commits values but does not trigger the search-fetch cycle; always pair with a UI-level event that Angular treats as a "user committed" signal.**
  - Google Places autocomplete required character-by-character typing + suggestion-click, not just value assignment. Methodology lesson: **any UI-bound third-party widget needs real keyboard events, not DOM value setters.**
  - List-view DOM exposes price / est-value / year-built / beds/baths / sq ft / last-sale-date but NOT per-property first-loan-rate / specific foreclosure stage / exact equity %. Those require View Details navigation or CSV export (credit-gated).
- Baseline preservation: Andreas's original 3388-char `propertySearchFilterPayload` (Beverly Hills 1-result) was restored via `localStorage.setItem` at end of session. Verified intact.
- Corrections to earlier docs: USE_CASE_PLAYBOOK V-2 and PB-2 stood up correctly under actual execution — `firstLoanType = "Standalone Refinance"` IS the refi signal. The gap identified (no refi-date filter) is real and was worked around via external-data pairing.
- Methodology lessons added to SELF_VALIDATION for HighLevel: UI-driven filter application > state injection; autocomplete widgets need keyboard events; list views sparsely expose detail fields (plan for detail-navs or exports).
- Validation test status: **delivered within protocol.** Top 10 produced; ranking defended; data gaps honestly flagged; pivot options offered. Final acceptance Dan's call.

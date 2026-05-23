# USE_CASE_PLAYBOOK — BatchLeads

Filter stacks for business objectives. Each entry shows the full reasoning — which keys, which values, why them instead of alternatives, what output shape to expect, and how confident I am. This is the defense document for Dan's validation test.

Filter key names reference `propertySearchFilterPayload` schema documented in [FILTER_DEFINITIONS.md](FILTER_DEFINITIONS.md).

**Confidence legend:** **H** = both filter keys and business logic are well-grounded; **M** = keys confirmed, enum values inferred; **L** = logic is sound but leans on unconfirmed filter behavior (🟡 in FILTER_DEFINITIONS).

---

## Template — copy for each use case

```
### Objective: [plain-English goal]
- Target persona: [who we're trying to reach]
- Business rationale: [why this matters for the Andreas / PitchBlack pipeline]
- Filter stack:
  - [key]: [value] — [why this narrows toward the target]
  - …
- Rejected alternatives: [filters considered but not used, with reason]
- Expected output shape: [rough volume, key fields, ranking signal]
- Confidence: H / M / L — [why]
- Observed on: [yyyy-mm-dd]
```

---

# Layer 1 — Andreas's Pipeline (Mortgage Protection Outreach)

Andreas sells mortgage protection insurance — a policy that pays off the mortgage if the borrower dies. The ideal lead has: an open mortgage with meaningful balance, an owner at a motivated life-stage (40–65 with dependents), enough income to afford premiums, and lives in a state Andreas is licensed in.

---

### PB-1 — Recently-mortgaged homeowners with family-protection motivation
- **Target persona:** Owner-occupied homeowners, age 40–65, with children at home, active mortgage balance ≥ $200K, in Andreas's licensed states.
- **Business rationale:** This is the highest-conversion persona for mortgage protection. Fresh mortgage = they just signed a loan commitment and are thinking about risk. Ages 40–65 = life-insurance-aware. Has children = emotional motivator. Meaningful balance = premium size justifies the call.
- **Filter stack:**
  - `query`: "{Andreas-licensed state}, USA" (or narrower geography per campaign)
  - `propertyClassifications`: `["Residential"]` — excludes commercial.
  - `propertyType`: `["Single Family","Condo","Townhouse"]` — primary-residence types; excludes multi-unit investor properties.
  - `occupancyStatus`: owner-occupied (enum value TBD — UI cross-ref needed).
  - `mortgagesCount`: `[1, ""]` — has at least one open mortgage.
  - `mortgagesTotalBalance`: `["200000", ""]` — $200K+ balance; premium economics matter above this.
  - `demographicsAge`: `["40","65"]` — motivated life-stage.
  - `demographicsHasChildren`: "yes" equivalent (enum TBD).
  - `demographicsIncome`: `["75000", ""]` — affords the premium.
- **Rejected alternatives:**
  - `foreclosureStatus` / `taxDelinquentYear` — these are *distress* signals; distress borrowers can't afford another monthly premium. Reject.
  - `freeAndClear = true` — excludes mortgage holders; we *need* a mortgage. Reject.
  - `equityPercent` upper cap — irrelevant; equity doesn't govern MPI eligibility. Don't filter.
  - `demographicsMillionaire` = true — over-targets; wealthier households often self-insure or have existing coverage. Don't filter.
- **Expected output shape:** Large set (thousands per state). Rank by BatchRankAI descending, then by mortgage recency (requires Phase 2b to verify `firstLoanDate`-equivalent key), then by demographicsIncome. Top 100 per daily batch for dialer queue.
- **Confidence:** **L** — logic is sound but depends on `occupancyStatus` enum, `demographicsHasChildren` value semantics, and whether `mortgagesCount` behaves as count-of-open-liens. All need UI cross-reference in Phase 2b.

---

### PB-2 — Recent refinancers (newly re-committed to debt) — Phase 2b revised
- **Target persona:** Homeowners whose current first-loan is a standalone refinance, have 40%+ equity remaining, in Andreas's licensed states.
- **Business rationale:** Refi = just re-signed mortgage paperwork, fresh in their mind. 40%+ equity = meaningful asset, the family has something to protect. **Key Phase 2b finding:** BatchLeads does NOT filter by refi *date* — only by whether the current first-loan is type "Standalone Refinance". So this playbook targets "currently holds a refi-origin loan," not "refi'd in the last N months." Time-narrow requires pairing with external data (county recorder / MLS).
- **Filter stack (revised):**
  - `query`: "{state}, USA"
  - `firstLoanType`: `"Standalone Refinance"` — the refi signal. UI label: "1st Loan Type".
  - `equityPercent`: `["40", ""]`.
  - `mortgagesCount`: `[1, ""]`.
  - `propertyClassifications`: `["Residential"]`.
  - `propertyType`: `["Single Family","Condo/Townhouse"]`.
  - `occupancyStatus`: owner-occupied (enum TBD — this gap remains from Phase 2b).
- **Rejected alternatives:**
  - `deed_types` for refi filtering — **confirmed impossible in Phase 2b.** Deed Transfer Type enum has 8 values (Warranty Deed, Grant Deed, Special Warranty Deed, etc.), none of which are refinance. Refis don't transfer deeds — they only record a new mortgage on the existing deed.
  - `lastSoldDate` recent — catches new purchases, not refis. Purchases with `firstLoanType = "Purchase Money Mortgage"` are a different sub-campaign.
  - `foreclosureStatus` — distressed borrowers don't buy insurance.
- **Expected output shape:** Medium set per state — all currently-open refi loans. No recency-of-refi sort available within BatchLeads; export CSV and cross-reference externally for time narrowing.
- **Confidence:** **M** — the `firstLoanType` enum is UI-confirmed, but the date-narrow capability doesn't exist in this platform. Factor the external-data step into the pipeline.

---

### PB-3 — Empty-nesters with paid-down mortgages (estate-planning motivation)
- **Target persona:** Owner-occupied, age 55+, children now adults (empty nest), mortgage balance 20–50% of property value (partially paid), in Andreas's licensed states.
- **Business rationale:** Secondary Andreas persona. Empty-nesters re-think legacy planning — mortgage protection dovetails with estate/life planning. Partial-mortgage means there's still something to protect but they can afford it.
- **Filter stack:**
  - `query`: "{state}, USA"
  - `demographicsAge`: `["55", ""]`.
  - `demographicsLengthOfResidenceYears`: `["15", ""]` — long tenure, typical for empty-nest pattern.
  - `loanToValuePercent`: `["20","50"]` — partially paid-down.
  - `mortgagesCount`: `[1, ""]`.
  - `propertyClassifications`: `["Residential"]`.
  - `occupancyStatus`: owner-occupied.
- **Rejected alternatives:**
  - `demographicsHasChildren = no` — blunt filter; "has adult children out of the home" isn't a Boolean on this platform. Age + tenure is the proxy.
  - `freeAndClear = true` — excludes the LTV 20–50% band we want.
- **Expected output shape:** Small-to-medium set per state. Rank by demographicsNetWorth + demographicsLengthOfResidenceYears.
- **Confidence:** **M** — the proxies for empty-nester (age + tenure) are reasonable; the LTV band is well-grounded. Depends on confirming `occupancyStatus` value.

---

# Layer 2 — General Deal-Finder Patterns (broader BatchLeads usage)

These are the "wholesaler-style" stacks the platform is marketed for. Less directly tied to Andreas's pipeline, but important for methodology completeness and any adjacent PitchBlack revenue stream.

---

### DF-1 — Likely 30-day seller (motivated-seller ranking)
- **Target persona:** Owners with at least one distress or motivation signal + long tenure + owner-occupied, in a target geography.
- **Business rationale:** Highest-intent "will list in next 30 days" set. Standard wholesaler objective.
- **Filter stack:**
  - `query`: "{target geography}, USA"
  - **Any one of** (OR-logic — may require multiple saved searches):
    - `foreclosureStatus`: `["notice-of-default","notice-of-sale"]` — imminent forced sale.
    - `taxDelinquentYear`: `["", ""]` narrowed to last 2 years — financial pressure.
    - `mlsFailedListingDate`: last 12 months — tried and failed to sell, likely re-listing.
    - `bankruptcyRecordingDate`: last 18 months.
    - `demographicsAge`: `["75", ""]` — life-event likelihood.
  - `demographicsLengthOfResidenceYears`: `["10", ""]` — long tenure suggests equity built + likely lifecycle transition.
  - `propertyClassifications`: `["Residential"]`.
  - `occupancyStatus`: owner-occupied (excludes absentee; different dynamic).
- **Rejected alternatives:**
  - `mlsStatus = Active` — defeats the purpose; we want NOT currently listed.
  - `cashBuyer = true` — these are likely corporate flippers, not motivated sellers.
- **Expected output shape:** Top 3 by BatchRankAI (the built-in AI-ranked signal) — directly satisfies the validation objective pattern.
- **Confidence:** **M** — BatchLeads markets BatchRankAI explicitly as a motivated-seller ranker; filter stack is well-grounded; OR-logic requires confirmation (may need multiple searches merged).

---

### DF-2 — Absentee landlord, distress-flagged (wholesale + Andreas sister-market)
- **Target persona:** Non-owner-occupied residential property, owner not in same state, with any distress signal.
- **Business rationale:** Out-of-state landlords with distress flags are the classic wholesale lead. Can also be sold on rental-property insurance (adjacent Andreas product if offered).
- **Filter stack:**
  - `query`: "{state}, USA"
  - `propertyClassifications`: `["Residential"]`.
  - Quick Filter chip: **Out-of-State Absentee Owner** (sets `occupancyStatus` + owner-mailing-state ≠ property-state per inferred chip logic).
  - **Any of** distress:
    - `foreclosureStatus`: any.
    - `taxDelinquentYear`: any.
    - `lienType`: any involuntary lien.
    - Quick Filter chip: **Tired Landlord**.
- **Rejected alternatives:**
  - `owner-occupied` toggle — opposite of what we want.
  - `ownerStatusType = Individual` only — would miss LLC-held rentals, which are often the deeper investors with more properties. Don't constrain.
- **Expected output shape:** Medium set per state. Rank by `propertiesOwned` descending (portfolio LLs are highest-priority).
- **Confidence:** **M** — Quick Filter chip behavior needs confirmation in Phase 2b, especially whether "Out-of-State Absentee Owner" is mutually exclusive with "Owner Occupied" and "In-State Absentee Owner".

---

### DF-3 — Inherited-property fresh owners (probate wholesale)
- **Target persona:** Recent deed transfer via inheritance, property currently vacant or owner not at property address.
- **Business rationale:** Heirs of inherited homes are classic motivated sellers — emotional distance + carrying costs + unfamiliar asset.
- **Filter stack:**
  - `deed_types`: inheritance-deed equivalent (enum TBD — Quick Filter "Inherited" likely sets this).
  - `lastSoldDate`: last 24 months (inheritance recorded recently).
  - Quick Filter chip: **Inherited**.
  - `occupancyStatus`: vacant OR non-owner-occupied.
  - `propertyClassifications`: `["Residential"]`.
- **Rejected alternatives:**
  - `freeAndClear = true` — many inherited homes have mortgages attached; don't restrict.
  - Long tenure — inheritance is a short-tenure event by definition.
- **Expected output shape:** Small-to-medium set per state. Rank by `estimatedEquity` descending (higher equity = wider bid spread).
- **Confidence:** **M** — depends on "Inherited" Quick Filter being wired correctly.

---

### DF-4 — Pre-foreclosure + high positive equity (short-sale candidates)
- **Target persona:** Owner in pre-foreclosure with 30%+ equity remaining.
- **Business rationale:** Best-case foreclosure intervention — equity means a sale can pay off the mortgage and leave something for the owner, making it an easier conversation.
- **Filter stack:**
  - `foreclosureStatus`: `["notice-of-default","notice-of-lis-pendens","notice-of-sale"]` (excludes `active-auction` — too late-stage).
  - `equityPercent`: `["30", ""]`.
  - `propertyClassifications`: `["Residential"]`.
- **Rejected alternatives:**
  - `active-auction` inclusion — sale already scheduled; rarely salvageable.
  - `freeAndClear = true` — no foreclosure risk if no mortgage.
- **Expected output shape:** Narrow set. Rank by `foreclosureAuctionDate` ascending (most urgent first).
- **Confidence:** **H** — every filter is directly observed in Andreas's baseline or known from Quick Filters.

---

### DF-5 — Vacant + tax-delinquent (motivated absentee)
- **Target persona:** Property currently vacant, owner not paying property taxes, non-owner-occupied.
- **Business rationale:** Highest distress ratio — vacant carrying costs + tax liability — owner is losing money monthly.
- **Filter stack:**
  - `vacantStatus`: "vacant" (enum TBD).
  - `taxDelinquentYear`: last 2 years.
  - `occupancyStatus`: absentee.
- **Rejected alternatives:**
  - `foreclosureStatus` — narrower than needed; vacant + delinquent already implies distress.
- **Expected output shape:** Small set per region. Rank by `taxDelinquentYear` oldest first.
- **Confidence:** **M** — hinges on `vacantStatus` enum value.

---

# Layer 3 — Practice runs against Dan's validation-test samples

These are the three sample test objectives from the directive. Full reasoning captured so the defense is fluent when Dan issues the live test.

---

### V-1 — "Top 3 properties in McHenry County most likely to sell in 30 days"
- **Geography:** `query`: "McHenry County, IL, USA"; confirm `areaPolygons=true` or draw county boundary.
- **Approach:** DF-1 (Likely 30-day seller) applied to McHenry County + sort by BatchRankAI DESC + top 3.
- **Filter stack (final):**
  - `query`: "McHenry County, IL, USA"
  - `propertyClassifications`: `["Residential"]`
  - **Either** `foreclosureStatus`: `["notice-of-default","notice-of-sale","notice-of-lis-pendens"]` **or** `taxDelinquentYear`: non-empty recent **or** `mlsFailedListingDate`: last 12 months **or** `bankruptcyRecordingDate`: last 18 months — may need 4 separate searches merged if BatchLeads AND-joins these.
  - `demographicsLengthOfResidenceYears`: `["10", ""]`.
  - `occupancyStatus`: owner-occupied.
  - **Sort:** BatchRankAI percentile DESC.
  - **Take:** top 3.
- **Defense points:**
  - Why NOT filter by `estimatedEquity`? — Seller motivation, not deal size, drives 30-day timing. Equity rank is a secondary sort, not a filter.
  - Why exclude `active-auction` from foreclosureStatus? — Auction already scheduled; "will sell in 30 days" is trivially true but the sale isn't discretionary, so it's not the right test of seller-intent ranking.
  - Why owner-occupied only? — "Likely to sell in 30 days" implies a discretionary sale; absentee owners have a different dynamic (rental-turnover, not move-out).
- **Fallback if volume is low:** drop `demographicsLengthOfResidenceYears` constraint; then drop `occupancyStatus`.
- **Confidence:** **M** — BatchRankAI is marketed exactly for this ranking; need to confirm if the 4 distress signals can OR-join in one search or need union.

---

### V-2 — "Homeowners in 60156 who refinanced in last 6 months, 40%+ equity" — Phase 2b revised
- **Phase 2b answered this:** BatchLeads can identify *refi-origin loans* but cannot narrow by *refi date*. The validation objective requires a hybrid — BatchLeads to qualify the property-and-loan profile, external data to narrow recency.
- **Geography:** `query`: "60156" (Crystal Lake, IL — zip-level).
- **Approach:** PB-2 revised filter stack + a BatchLeads-to-external-data pipeline for time-narrowing.
- **Filter stack (BatchLeads portion):**
  - `query`: "60156"
  - `propertyClassifications`: `["Residential"]`
  - `propertyType`: `["Single Family","Condo/Townhouse"]` — excludes multi-unit investor properties.
  - `firstLoanType`: `"Standalone Refinance"` — UI-confirmed refi signal.
  - `equityPercent`: `["40", ""]`.
  - `mortgagesCount`: `[1, ""]`.
- **Time-narrow step (external — outside BatchLeads):**
  - Export BatchLeads results to CSV.
  - Cross-reference mortgage-recording date from McHenry County (IL) Recorder's Office public records, OR use MLS transaction data if available, OR use a county-records API.
  - Filter CSV to mortgages recorded within last 6 months.
- **Defense points:**
  - Why `firstLoanType = "Standalone Refinance"` and not `deed_types`? — **Phase 2b confirmed:** `deed_types` has no refinance option (refis don't transfer deeds). `firstLoanType` is the correct refi signal.
  - Why `equityPercent ≥ 40` and not `loanToValuePercent ≤ 60`? — Functionally equivalent; use whichever is primary in the UI sidebar.
  - Why `mortgagesCount ≥ 1`? — `firstLoanType` filter only returns properties WITH a first loan, but `mortgagesCount ≥ 1` belt-and-suspenders the result.
  - Why pair with external data? — BatchLeads doesn't expose mortgage-origination or mortgage-recording dates as filters. This is a known platform limitation.
- **Confidence:** **M** for the BatchLeads portion (all filters UI-confirmed); **L** for the combined workflow until external-data step is operationalized.
- **Platform limitation flagged:** Add to methodology-for-HighLevel document — "when the source platform lacks date granularity on a key field, plan for a hybrid pipeline with external data."

---

### V-3 — "Absentee landlords in Oklahoma likely to be distressed sellers"
- **Geography:** `query`: "Oklahoma, USA".
- **Approach:** DF-2 applied statewide + narrower distress logic.
- **Filter stack (final):**
  - `query`: "Oklahoma, USA"
  - `propertyClassifications`: `["Residential"]`.
  - Quick Filter chip: **Out-of-State Absentee Owner** — OR — explicit owner-mailing-state ≠ property-state logic (if that's a filter available in Ownership Info).
  - `propertiesOwned`: `[2, ""]` — landlord (not single-property accidental landlord).
  - **Any of** distress:
    - `foreclosureStatus`: any.
    - `taxDelinquentYear`: last 2 years.
    - `lienType`: any involuntary lien.
    - Quick Filter chip: **Tired Landlord**.
- **Defense points:**
  - Why statewide and not narrower? — Dan's objective didn't narrow further; honor the ask.
  - Why `propertiesOwned ≥ 2`? — Excludes people who inherited or accidentally ended up with a rental; we want deliberate landlords who make investment decisions based on the numbers.
  - Why include **In-State** absentee too? — Dan said "absentee landlords" generally; out-of-state is a subset. Broader net first; can narrow if volume is manageable.
  - Why both `foreclosureStatus` AND `lienType` and `taxDelinquentYear`? — Each catches a different distress mode; union maximizes recall for a ranking problem.
- **Expected output shape:** Wide — likely thousands. Deliverable: top 100 by BatchRankAI + `propertiesOwned` descending, or export full set via CSV to HighLevel.
- **Confidence:** **M** — the "Tired Landlord" Quick Filter's exact underlying keys need confirmation, but the filter stack logic is solid.

---

## Cross-playbook notes

- **OR-logic capability.** Several playbooks need OR across distress signals. If BatchLeads's filter UI is strictly AND-only, the workflow becomes "run N saved searches, union in CSV." This limitation is methodology-transferable — HighLevel almost certainly has the same pattern. Confirm in Phase 3 when I hit Save Search / Save Filter.
- **Geographic input flexibility.** `query` accepted "Beverly Hills, CA 90210, USA" successfully. Need to test: state-level ("Oklahoma, USA"), county-level ("McHenry County, IL, USA"), zip-only ("60156"), and bare zip. If zip-only doesn't work, the fallback is state + polygon-draw.
- **BatchRankAI as the universal ranker.** For every "top N" objective, BatchRankAI percentile is almost certainly the right primary sort. This drops a lot of custom-scoring complexity and is the methodology lesson for HighLevel mastery.
- **Fair-housing caution.** Demographic filters include age, gender, religion, marital status, family status — these can trip fair-housing boundaries in outreach copy (HUD and state-level). Use for *lead qualification internal to BatchLeads* but *never* as segmentation messaging that shows up in an email/call script. Flag for Andreas compliance review.

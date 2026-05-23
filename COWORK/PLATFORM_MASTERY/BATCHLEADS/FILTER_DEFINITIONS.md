# FILTER_DEFINITIONS — BatchLeads

Every filter exposed by BatchLeads Property Search, catalogued from the `localStorage.propertySearchFilterPayload` schema (116 keys) captured 2026-04-17, grouped by the sidebar section headers observed live. Type inference comes from the payload value shape:

| Shape | Type |
|---|---|
| `""` | single-select enum OR text input (confirm per field) |
| `[""]` | single-date filter |
| `["", ""]` | numeric range `[min, max]` |
| `[]` | multi-select enum (empty = no filter) |
| `["val1","val2",…]` | multi-select enum with active values |
| `[["",""],["",""]]` | paired numeric range (two tranches) |
| `true`/`false` | boolean flag |
| `null` | nullable numeric/ID |
| named string | enum single-select with active value |

**Confidence legend**
- ✅ UI-confirmed label and enum options
- 🟡 Inferred from payload shape; label/options need UI cross-reference
- ⚪ Meta / session / map state — not a user-facing filter

**Sidebar sections observed live** (counts are Andreas's active-filter counts at capture): Property Characteristics (2), MLS Status (2), Pre-Foreclosure/Auctions/Tax/Lien (1), Ownership Info (1), Valuation & Equity (0), Mortgage Info (0), Cash Buyers (1), Demographics (0). Plus a Quick Filter bar with one-click toggle chips layered on top of the underlying filters.

---

## Property Characteristics

| Key | Type | Default | Andreas's baseline | Notes |
|---|---|---|---|---|
| `occupancyStatus` | 🟡 enum | `""` | `""` | Likely: owner-occupied / absentee / etc. Cross-reference with Quick Filter chips (Owner Occupied, Absentee Owner, In-State Absentee Owner, Out-of-State Absentee Owner). |
| `vacantStatus` | 🟡 enum | `"any-status"` | `"any-status"` | Values likely: `any-status` / `vacant` / `non-vacant`. |
| `propertyClassifications` | ✅ multi-enum | `[]` | `["Residential"]` | **UI-confirmed 9 options:** Residential, Commercial, Office, Recreational, Industrial, Agricultural, Vacant Land, Exempt, Miscellaneous. Select-All supported. |
| `propertyType` | ✅ multi-enum | `[]` | `["Single Family"]` | **UI-confirmed 48+ subtypes** (list long, partial sample): Single Family, Condo/Townhouse, Multi-Family 2-4 Units, Multi-Family 5+ Units, Planned Unit Development, Timeshare, Seasonal/Cabin/Vacation Residence, Bungalow, Zero Lot Line, Module/Prefabricated Homes, Patio Home, Garden Home, Miscellaneous Residential, Landominium, Barndominium, Tiny House, Duplex, Triplex, Quadruplex, Apartment House (5+ / 100+ Units), Townhouse, Highrise Apartment, Boarding House, Mobile Home Park, Dormitory, Fraternity/Sorority House, Condominium Developments, plus commercial/industrial/agricultural subtypes. |
| `storyCount` | 🟡 numeric range | `["",""]` | `["",""]` | |
| `parcelCount` | 🟡 numeric range | `["",""]` | `["",""]` | Parcels per owner / per record. |
| `numberOfBedrooms` | 🟡 numeric range | `["",""]` | `["",""]` | |
| `numberOfBaths` | 🟡 numeric range | `["",""]` | `["",""]` | |
| `totalBuildingAreaSquareFeet` | 🟡 numeric range | `["",""]` | `["",""]` | |
| `livingAreaSquareFeet` | 🟡 numeric range | `["",""]` | `["",""]` | |
| `yearBuilt` | 🟡 numeric range | `["",""]` | `["",""]` | |
| `numberOfUnits` | 🟡 numeric range | `["",""]` | `["",""]` | Total units (residential + commercial). |
| `numberOfCommercialUnits` | 🟡 numeric range | `["",""]` | `["",""]` | |
| `numberOfResidentialUnits` | 🟡 numeric range | `["",""]` | `["",""]` | |
| `lotSizeAcres` | 🟡 numeric range | `["",""]` | `["",""]` | Acres — may have sq-ft toggle in UI. |
| `buildingFeatures` | 🟡 enum/multi | `""` | `""` | Pool, garage, basement, etc. Confirm type. |
| `associationHOA` | 🟡 enum | `""` | `""` | Has-HOA / no-HOA / any. Quick Filter has "No HOA Fees" chip. |
| `buildingType` | 🟡 enum | `""` | `""` | Related to propertyType but distinct key — likely construction-class. |

---

## MLS Status / Listing

| Key | Type | Default | Andreas's baseline | Notes |
|---|---|---|---|---|
| `mlsStatus` | ✅ multi-enum | `[]` | `["Active","Pending"]` | **UI-confirmed 5 options:** Active, Pending, Sold, Failed, Off Market. Quick-Filter chips (Active Listing, Pending Listing, Recently Sold, New Listings, Failed Listing, Tired Listings) are distinct from this field — they combine `mlsStatus` with date-based fields. |
| `mlsListingDate` | 🟡 date | `[""]` | `[""]` | Array of one — single date or from-date. |
| `mlsFailedListingDate` | 🟡 date | `[""]` | `[""]` | Date when a listing went unsold / withdrew. "Failed Listing" is a Quick Filter chip. |
| `mlsBelowMarketPrice` | 🟡 enum | `""` | `""` | Quick Filter has "Listed Below Market Price" chip. |
| `mlsOnMarket` | 🟡 enum | `""` | `""` | On / Off / Any. Top-of-search toggle: `All` / `Off Market` / `On Market`. |
| `mlsDaysOnMarket` | 🟡 numeric range | `["",""]` | `["",""]` | |
| `mlsListingAmount` | 🟡 numeric range | `["",""]` | `["",""]` | Listing $ range. |
| `mlsDescriptionInList` | 🟡 keyword include | `[""]` | `[""]` | Text-match include terms — listing description. |
| `mlsDescriptionNotInList` | 🟡 keyword exclude | `[""]` | `[""]` | Text-match exclude terms. |

---

## Deal Potential / ARV (Valuation-Derived Deal Signals)

| Key | Type | Default | Andreas's baseline | Notes |
|---|---|---|---|---|
| `arv` | 🟡 numeric range | `["",""]` | `["",""]` | After-Repair Value. |
| `arvSpread` | 🟡 numeric range | `["",""]` | `["",""]` | ARV minus listing price (or similar). My Lists column confirms "ARV Spread" as a dollar value ($7.8M in Andreas's single lead). |
| `arvListingDiscount` | ✅ numeric range (0–75) | `[0,75]` | `[0,75]` | **Active in Andreas's baseline.** Percent listing-is-below-ARV. Range 0–75 suggests the UI slider bound. |
| `dealPotential` | ✅ enum | `""` | `"discount"` | **Active: `discount`.** Likely enum: discount / flip / wholesale / rental / etc. |
| `batchrank_score_percentile` | 🟡 numeric 0–100 (nullable) | `null` | `null` | BatchRank — BatchLeads's proprietary AI deal-quality percentile. Surfaced as `BatchRankAI` column in My Lists (Andreas's lead: "Medium"). |

---

## Pre-Foreclosure / Auctions / Tax / Lien / Bankruptcy

| Key | Type | Default | Andreas's baseline | Notes |
|---|---|---|---|---|
| `foreclosureStatus` | ✅ multi-enum | `[]` | `["notice-of-sale","notice-of-default","notice-of-lis-pendens","active-auction"]` | **Active in Andreas's baseline — all four distress stages.** Quick Filter chip "Preforeclosure" likely activates this. |
| `foreclosureRecordingDate` | 🟡 date | `[""]` | `[""]` | |
| `foreclosureAuctionDate` | 🟡 date | `[""]` | `[""]` | |
| `foreclosureOpeningBid` | 🟡 numeric range | `["",""]` | `["",""]` | |
| `foreclosureReleaseDate` | 🟡 date | `[""]` | `[""]` | Release / cancellation of foreclosure proceeding. |
| `foreclosureDefaultAmount` | 🟡 numeric range | `["",""]` | `["",""]` | $ behind on mortgage. |
| `taxDelinquentYear` | 🟡 numeric range | `["",""]` | `["",""]` | Year range of tax delinquency. Quick Filter chip "Tax Default". |
| `lienType` | 🟡 enum | `""` | `""` | Involuntary lien types — tax, mechanics, judgment, etc. Quick Filter chip "Involuntary Lien". |
| `lienAmount` | 🟡 numeric range | `["",""]` | `["",""]` | |
| `lienRecordingDate` | 🟡 date | `[""]` | `[""]` | |
| `filingDate` | 🟡 date | `""` | `""` | Lien filing date (vs. recording). |
| `recordingDate` | 🟡 date | `""` | `""` | Generic recording date — scope unclear. |
| `bankruptcyRecordingDate` | 🟡 date | `[""]` | `[""]` | |

---

## Ownership Info

| Key | Type | Default | Andreas's baseline | Notes |
|---|---|---|---|---|
| `ownerStatusType` | ✅ multi-enum | `[]` | `["Individual"]` | **UI-confirmed 2 options only:** Individual, Company Owned. UI label: "Owner Type". **Correction** vs Phase 2a inference — Trust and LLC are NOT separate options here; Trust ownership likely surfaces via `deed_types = "Intra Family Transfer"` or a Quick Filter chip ("Trust Owned") hitting a different key. |
| `ownerType` | 🟡 enum | `""` | `""` | Distinct from `ownerStatusType` — possibly owner-occupancy classification (resident / investor / absentee). |
| `yearsOfOwnership` | 🟡 paired numeric range | `[["",""],["",""]]` | `[["",""],["",""]]` | Nested pair — likely supports two owner-tenure brackets (e.g. primary + co-owner), or an OR condition. |
| `criteriaType` | 🟡 enum | `""` | `""` | Search criteria mode — unclear. |
| `lastSalePrice` | 🟡 numeric range | `["",""]` | `["",""]` | |
| `lastTransferDocumentType` | 🟡 enum | `""` | `""` | Deed type on last transfer. |
| `lastSoldPrice` | 🟡 numeric range | `["",""]` | `["",""]` | Possible duplicate of `lastSalePrice`; verify. |
| `lastSoldDate` | 🟡 date | `[""]` | `[""]` | |
| `propertiesOwned` | 🟡 numeric range | `["",""]` | `["",""]` | Portfolio count — filter by how many properties the owner has. |
| `propertiesTotalEquity` | 🟡 numeric range | `["",""]` | `["",""]` | Across the owner's full portfolio. |
| `propertiesTotalEstimatedValue` | 🟡 numeric range | `["",""]` | `["",""]` | Across the owner's full portfolio. |
| `deed_types` | ✅ enum | `""` | `""` | **UI-confirmed 8 options** (UI label: "Deed Transfer Type"): Warranty Deed, Deed, Grant Deed, Special Warranty Deed, Vendor's Lien, Bargain and Sale Deed, Intra Family Transfer, Unknown & Other. **Critical:** NO "Refinance" option — refinances do not appear in this filter. See Mortgage Info → `firstLoanType = "Standalone Refinance"` for the refi filter path. "Inherited" Quick Filter most likely maps to `deed_types = "Intra Family Transfer"`. |
| `individualProperty` | 🟡 boolean | `false` | `false` | Scope toggle — single-property vs. portfolio view. |
| `senior owner` (Quick Filter) | ✅ chip | — | — | Quick Filter chip "Senior Owner" — underlying key likely mixes `ownerType` + `demographicsAge`. Verify. |

---

## Valuation & Equity

| Key | Type | Default | Andreas's baseline | Notes |
|---|---|---|---|---|
| `estimatedValue` | 🟡 numeric range | `["",""]` | `["",""]` | Current market estimate. |
| `estimatedEquity` | 🟡 numeric range | `["",""]` | `["",""]` | $ estimated equity. |
| `equityPercent` | 🟡 numeric range 0–100 | `["",""]` | `["",""]` | Quick Filter chips "High Equity" + "Unknown Equity" relate here. |
| `loanToValuePercent` | 🟡 numeric range 0–100 | `["",""]` | `["",""]` | Inverse of equity percent. |
| `assessedTotalValue` | 🟡 numeric range | `["",""]` | `["",""]` | County assessor value (total). |
| `assessedLandValue` | 🟡 numeric range | `["",""]` | `["",""]` | County assessor value (land only). |

---

## Mortgage Info

| Key | Type | Default | Andreas's baseline | Notes |
|---|---|---|---|---|
| `firstLoanType` | ✅ enum | `""` | `""` | **UI-confirmed 13 options** (UI label: "1st Loan Type"): Conventional, VA, FHA, Line of Credit, Reverse Mortgage, Seller Carryback, **Standalone Refinance**, Commercial, Future-Advance Mortgage, Purchase Money Mortgage, Land Contract, Construction Loan, Unknown & Other. **Critical for V-2 / Andreas pipeline:** `"Standalone Refinance"` is the filter for refinance loans. `"Purchase Money Mortgage"` = original purchase financing (exclude to isolate refi-origin loans). |
| `firstLoanInterestRate` | 🟡 numeric range | `["",""]` | `["",""]` | Percent. |
| `firstLoanToCurrentValuePercentage` | 🟡 numeric range | `["",""]` | `["",""]` | LTV on first loan only. |
| `totalOpenLienCount` | 🟡 numeric range | `["",""]` | `["",""]` | |
| `numberOfOpenMortgages` | 🟡 enum/numeric | `""` | `""` | Shape `""` vs numeric range suggests enum discrete values (e.g. 0 / 1 / 2+). |
| `totalOpenLienBalance` | 🟡 numeric range | `["",""]` | `["",""]` | |
| `mortgagesTotalBalance` | 🟡 numeric range | `["",""]` | `["",""]` | |
| `mortgagesCount` | 🟡 numeric range | `["",""]` | `["",""]` | |
| `mortgagesAverageBalance` | 🟡 numeric range | `["",""]` | `["",""]` | |

---

## Cash Buyers

| Key | Type | Default | Andreas's baseline | Notes |
|---|---|---|---|---|
| `cashBuyer` | 🟡 enum/boolean | `""` | `""` | Quick Filter chip "Cash Buyer". |
| `freeAndClear` | 🟡 enum/boolean | `""` | `""` | No open mortgages. Quick Filter chip "Free and Clear". |
| `cashPurchase` | 🟡 enum/boolean | `""` | `""` | Property was purchased in cash. |

---

## Demographics

| Key | Type | Default | Andreas's baseline | Notes |
|---|---|---|---|---|
| `demographicsAge` | 🟡 numeric range | `["",""]` | `["",""]` | Owner age. |
| `demographicsHouseholdSize` | 🟡 numeric range | `["",""]` | `["",""]` | |
| `demographicsIncome` | 🟡 numeric range | `["",""]` | `["",""]` | |
| `demographicsNetWorth` | 🟡 numeric range | `["",""]` | `["",""]` | |
| `demographicsDiscretionaryIncome` | 🟡 numeric range | `["",""]` | `["",""]` | |
| `demographicsHomeowner` | 🟡 boolean | `""` | `""` | |
| `demographicsBusinessOwner` | 🟡 boolean | `""` | `""` | |
| `demographicsGender` | 🟡 enum | `""` | `""` | |
| `demographicsHasChildren` | 🟡 boolean | `""` | `""` | |
| `demographicsInvestmentPersonal` | 🟡 boolean/enum | `""` | `""` | |
| `demographicsInvestmentRealEstate` | 🟡 boolean/enum | `""` | `""` | |
| `demographicsInvestmentForeign` | 🟡 boolean/enum | `""` | `""` | |
| `demographicsInvestmentStocksAndBonds` | 🟡 boolean/enum | `""` | `""` | |
| `demographicsMaritalStatus` | 🟡 enum | `""` | `""` | |
| `demographicsMillionaire` | 🟡 boolean | `""` | `""` | |
| `demographicsPetOwner` | 🟡 boolean | `""` | `""` | |
| `demographicsSingleParent` | 🟡 boolean | `""` | `""` | |
| `demographicsSmoker` | 🟡 boolean | `""` | `""` | |
| `demographicsLengthOfResidenceYears` | 🟡 numeric range | `["",""]` | `["",""]` | |
| `demographicsReligiousAffiliation` | 🟡 enum | `""` | `""` | Fair-housing-sensitive; use with care in outreach copy. |

---

## Geography / Map State (Search Scope)

| Key | Type | Default | Andreas's baseline | Notes |
|---|---|---|---|---|
| `query` | ✅ text | `""` | `"Beverly Hills, CA 90210, USA"` | Primary location input. Accepts city, zip, county, state, address. |
| `geoCluster` | ⚪ {nwGeoPoint, seGeoPoint} | — | Beverly Hills bbox | Auto-derived from map viewport. |
| `geoClustering` | ⚪ boolean | `true` | `true` | Cluster markers on map. |
| `zoomLevel` | ⚪ numeric | `11` | `11` | Map zoom. |
| `areaPolygons` | 🟡 boolean | `true` | `true` | Constrain results to drawn polygon / boundary. Bottom-right has "Remove Boundary" button. |
| `useAreaPolygons` | 🟡 boolean | `true` | `true` | Twin of `areaPolygons` — verify distinction. |
| `mapDragged` | ⚪ boolean | `false` | `false` | Tracks whether user repositioned map from initial view. |
| `apn` | 🟡 text | `""` | `""` | Assessor Parcel Number — direct parcel lookup. |

---

## Result Scope / Dedup

| Key | Type | Default | Notes |
|---|---|---|---|
| `excludeSameAddressProperties` | 🟡 boolean | `""` | Dedup: hide multiple units at same address. |
| `showOnlySameAddressProperties` | 🟡 boolean | `""` | Inverse — show multi-unit buildings only. |
| `returnSameAndDifferentAddressProperties` | 🟡 enum | `""` | Three-way toggle likely. |
| `quickLists` | 🟡 multi-enum | `[]` | Which Map Quick Filter chips are active. Set of chips observed: Absentee Owner, FSBO, On Market Deals, Preforeclosure, Tired Landlord, Tired Listings, New Listings, Failed Listing, Corporate Owned, In-State Absentee Owner, Out-of-State Absentee Owner, Owner Occupied, Vacant, Active Listing, Pending Listing, Recently Sold, Cash Buyer, Free and Clear, High Equity, Unknown Equity, No HOA Fees, Inherited, Listed Below Market Price, Tax Default, Trust Owned, Involuntary Lien, Vacant Lot, Senior Owner. |
| `excludedHashes` | ⚪ array | `[]` | User-hidden results (thumbs-down-style exclusion). |

---

## Session / Meta (not user-facing filters)

| Key | Type | Notes |
|---|---|---|
| `paged` | ⚪ numeric | Page number (1-indexed). |
| `pagesize` | ⚪ numeric | Results per page — Andreas's baseline 25; My Lists offers 15/25/50/100. |
| `search_id` | ⚪ numeric | Session-unique search identifier. Regenerates on re-query. |
| `savedFilterId` | ⚪ nullable ID | If this search is a saved search, its DB ID. |
| `sessionId` | ⚪ string | `sess-<ts>-<rand>`. |
| `excludePayloadIsInitialQuickFilter` | ⚪ boolean | Internal meta — likely governs whether the initial Quick Filter chip applies. |
| `excludePayloadUpdateQuickFilter` | ⚪ boolean | Internal meta — paired with above. |

---

## Map Quick Filter chips (UI-surface layer)

The Property Search top bar exposes 28 one-click Quick Filter chips. Each sets a combination of the underlying payload keys. Live chip-to-key mapping requires clicking each and diffing the payload; captured here as the full chip inventory for later mapping:

`Absentee Owner` · `FSBO` · `On Market Deals` · `Preforeclosure` · `Tired Landlord` · `Tired Listings` · `New Listings` · `Failed Listing` · `Corporate Owned` · `In-State Absentee Owner` · `Out-of-State Absentee Owner` · `Owner Occupied` · `Vacant` · `Active Listing` · `Pending Listing` · `Recently Sold` · `Cash Buyer` · `Free and Clear` · `High Equity` · `Unknown Equity` · `No HOA Fees` · `Inherited` · `Listed Below Market Price` · `Tax Default` · `Trust Owned` · `Involuntary Lien` · `Vacant Lot` · `Senior Owner`

Also: three location-scope chips at the top (`All` / `Off Market` / `On Market`).

---

---

## Phase 2b — UI-confirmed changes summary (2026-04-17)

| Key | Was | Now |
|---|---|---|
| `propertyClassifications` | 🟡 inferred | ✅ 9 options enumerated |
| `propertyType` | 🟡 inferred | ✅ 48+ options enumerated |
| `mlsStatus` | ✅ inferred options | ✅ **correction:** 5 options, not 6+. UI: Active, Pending, Sold, Failed, Off Market. |
| `foreclosureStatus` | ✅ from payload | ✅ 4 options confirmed via Andreas's baseline |
| `ownerStatusType` | ✅ inferred 4 | ✅ **correction:** 2 options only — Individual, Company Owned. |
| `deed_types` | 🟡 inferred | ✅ 8 options; **NO refinance option** — critical finding. |
| `firstLoanType` | 🟡 inferred | ✅ 13 options; **includes "Standalone Refinance"** — unlocks V-2 / Andreas refi pipeline. |

**Key finding for Andreas's pipeline:** Refinance loans are filterable via `firstLoanType = "Standalone Refinance"`. Deed-type filtering does NOT include refi (refis don't transfer deed). The filter path for "homeowners with a refi" is: `mortgagesCount >= 1` AND `firstLoanType = "Standalone Refinance"`.

**Key gap:** BatchLeads exposes no filter for *when* a mortgage was originated / recorded. "Refinanced in the last 6 months" cannot be filtered directly — only "has a standalone-refinance first loan" (any age). Time-narrow must come from external data (MLS, county recorder's office).

---

## Cross-filter interactions (to be populated)

Observed dependencies and noteworthy combinations will land here after Phase 2b UI cross-reference. Priority checks:
- Does selecting `propertyClassifications = Residential` narrow `propertyType` options dynamically?
- Does `foreclosureStatus` selection auto-enable `mlsOnMarket = off-market`?
- Do Quick Filter chips mutually exclude each other (e.g. Owner Occupied vs Absentee Owner)?
- Does `dealPotential = "discount"` auto-set `arvListingDiscount` range?

## Undocumented / low-confidence

Any key with 🟡 marker above — label and enum values are inferred, not UI-confirmed. Phase 2b will convert 🟡 → ✅ by opening each sidebar section in the drawer and observing the rendered control.

## Restoration

Andreas's baseline payload is captured in [`state/filter_snapshot_2026-04-17.json`](state/filter_snapshot_2026-04-17.json). To restore if live state drifts:

```js
// Paste in DevTools console on any *.batchleads.io page
localStorage.setItem('propertySearchFilterPayload', <payload_raw string from snapshot>);
location.reload();
```

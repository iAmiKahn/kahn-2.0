# Andreas MPI Filter Refinement — Virginia Batch 2

**Prepared:** 2026-04-19 · **Scope:** BatchLeads filter strategy for mortgage-protection life-insurance outreach · **Reader:** Andreas Bastidas (field operator) via Dan (review)

**Batch 1 diagnostic (what went in):** `Last sale date 10/17/25–4/17/26` + `Purchase date 10/17/25–4/17/26` (redundant — both constrain `lastSoldDate`) + `Estimated value ≥ $240K` + `Cash Buyer: Any`. Result: 100 leads → 79 valid contacts → 10 duplicates (13% vendor-overlap) → 69 net-new.

**Two batch-1 design problems that batch 2 fixes:**
1. `Cash Buyer: Any` leaves cash buyers in the list — cash buyers have no mortgage, can't need MPI. **~26% of U.S. buyers paid all-cash in 2025** ([NAR 2025 Profile of Home Buyers and Sellers](https://www.nar.realtor/magazine/real-estate-news/nar-2025-profile-of-home-buyers-sellers-reveals-market-extremes)) — that's roughly 1 in 4 leads wasted.
2. "Recent refi" intent was never actually filtered — `lastSoldDate` captures *purchases*, not refinances. BatchLeads's refi filter is `firstLoanType = "Standalone Refinance"` (8 other loan-type values exist). Batch 1 pulled recent *purchases* of homes ≥ $240K.

---

## Section A — Executive Summary (pull these in order)

| # | Combination (one-liner) | Primary trigger | Confidence |
|---|---|---|---|
| **1** | **Fresh-mortgage family household** (new purchase + has-mortgage + family + income-qualified) | Life event: home purchase | Inferred from sourced LIMRA/NAR triggers data |
| **2** | **Recent standalone refinancer, mid-age, meaningful balance** | Life event: refi | Inferred from sourced LIMRA triggers data |
| **3** | **FHA-origin first-mortgage family** (often first-time buyers with dependents) | Life event: purchase + lower-income protection receptivity | Inferred from industry patterns; unverified MPI-specific |
| **4** | **Mid-tenure married household with dependents** (5–15 yr owned, married, kids, mortgage) | Demographic density (no recent trigger) | Inferred |
| **5** | **Senior-owner long-tenure with remaining mortgage balance** (55+ with 20–60% LTV) | Estate-planning life-stage | Inferred; smaller cohort |

**No combination below has direct sourced conversion data linking it to MPI close-rate.** All rankings are *educated inference* from (a) sourced MPI buyer demographics, (b) sourced life-insurance purchase-trigger data, (c) logical overlap with BatchLeads's filter surface. Test protocol in Section E is how these rankings get validated or corrected.

---

## Section B — BatchLeads Filter Inventory (MPI-relevant subset)

Full 116-key schema at [`FILTER_DEFINITIONS.md`](FILTER_DEFINITIONS.md). Subset relevant to MPI targeting, grouped by intent:

**Mortgage existence / type:**
- `mortgagesCount` (numeric range) — require `≥ 1` to exclude cash buyers. **Binding for all MPI combinations.**
- `firstLoanType` (enum; ✅ 13 options UI-confirmed): `Conventional`, `VA`, `FHA`, `Line of Credit`, `Reverse Mortgage`, `Seller Carryback`, `Standalone Refinance`, `Commercial`, `Future-Advance Mortgage`, `Purchase Money Mortgage`, `Land Contract`, `Construction Loan`, `Unknown & Other`.
- `freeAndClear` (🟡 boolean/enum) — set to `No` or leave blank for MPI. Never set to `Yes`.
- `cashPurchase` (🟡 boolean/enum) — set to `No` to exclude cash buyers.
- `cashBuyer` (🟡 boolean/enum) — set to `No` (same reason; distinct from `cashPurchase` in payload).
- `firstLoanInterestRate` (numeric range, %).
- `firstLoanToCurrentValuePercentage` / `loanToValuePercent` (numeric range, %) — LTV.

**Life-event / recency:**
- `lastSoldDate` (single date) — recent purchase.
- `lastSoldPrice` / `lastSalePrice` (numeric range, $).
- `deed_types` (✅ 8 options: Warranty Deed, Deed, Grant Deed, Special Warranty Deed, Vendor's Lien, Bargain and Sale Deed, Intra Family Transfer, Unknown & Other). **No "refinance" option — refis don't transfer deeds.**

**Ownership / tenure:**
- `yearsOfOwnership` (paired numeric range).
- `ownerStatusType` (✅ 2 options: Individual, Company Owned) — Individual for MPI.
- `ownerType` (🟡 enum) — likely owner-occupancy classification.
- `occupancyStatus` (🟡 enum) — owner-occupied preferred for MPI.

**Valuation / income proxy:**
- `estimatedValue` (numeric range, $) — **income proxy** (used by Andreas in batch 1).
- `estimatedEquity` (numeric range, $).
- `equityPercent` (numeric range, 0–100).

**Demographics (🟡 all inferred — enum values NOT UI-confirmed; use with skepticism, validate via test):**
- `demographicsAge` (range).
- `demographicsIncome` (range) — if this field is sourced from reported income, it's tighter than `estimatedValue` as an income proxy. If it's modeled, it's redundant.
- `demographicsMaritalStatus` (enum).
- `demographicsHasChildren` (boolean).
- `demographicsHouseholdSize` (range).
- `demographicsNetWorth` (range).
- `demographicsBusinessOwner` (boolean).

**Geography:**
- `query` (text) — accepts state / county / zip / address.

**Distress filters (NOT used for MPI — distressed borrowers don't buy premium-based life insurance; reject each):**
- `foreclosureStatus`, `taxDelinquentYear`, `lienType`, `bankruptcyRecordingDate`.

---

## Section C — MPI Buyer Profile (sourced + flagged)

### Demographics

| Attribute | Sourced value | Source | Confidence |
|---|---|---|---|
| **Life insurance ownership rate** | 52% of U.S. adults (2024) | [LIMRA 2024 Insurance Barometer](https://www.limra.com/en/research/research-abstracts-public/2024/2024-insurance-barometer-study/) | Sourced |
| **Homeowner vs. renter life-insurance ownership** | Homeowners significantly more likely than renters to own term life | [Chicago Fed, What Explains the Decline in Life Insurance Ownership?](https://www.chicagofed.org/publications/economic-perspectives/2017/8) | Sourced |
| **Mortgage-holding households vs. non-holders** | Mortgage holders are more likely to own life insurance | [ACLI 2025 Life Insurers Fact Book](https://www.acli.com/about-the-industry/life-insurers-fact-book/2025-life-insurers-fact-book) | Sourced |
| **MPI age eligibility window** | Typical 18–70; some carriers to 90, some cut off at 65 | [LendingTree — MPI Explained](https://www.lendingtree.com/home/mortgage/mortgage-protection-insurance/) | Sourced |
| **MPI premium rough cost** | $30–$40/mo per $100K borrowed | [LendingTree](https://www.lendingtree.com/home/mortgage/mortgage-protection-insurance/) | Sourced |
| **Top life-insurance purchase triggers** | Marriage, birth/adoption of child, **buying a house** | [LIMRA — Consumers Under 40 Skipping Life Insurance (Sept 2025)](https://www.limra.com/en/newsroom/news-releases/2025/consumers-under-40-are-skipping-life-insurance-as-they-delay-traditional-triggers-such-as-marriage-and-parenthood/) | Sourced |
| **First-time buyer median age** | 40 | [NAR 2025 Profile of Home Buyers and Sellers](https://www.nar.realtor/magazine/real-estate-news/nar-2025-profile-of-home-buyers-sellers-reveals-market-extremes) | Sourced |
| **Repeat buyer median age** | 62 | [NAR 2025](https://www.nar.realtor/magazine/real-estate-news/nar-2025-profile-of-home-buyers-sellers-reveals-market-extremes) | Sourced |
| **All-cash share of U.S. buyers** | 26% (2025 record high) | [NAR 2025](https://www.nar.realtor/magazine/real-estate-news/nar-2025-profile-of-home-buyers-sellers-reveals-market-extremes) | Sourced |
| **Dependents — % first-time buyers with children under 18** | 32% | [NAR 2025](https://www.nar.realtor/magazine/real-estate-news/nar-2025-profile-of-home-buyers-sellers-reveals-market-extremes) | Sourced |
| **Dependents — % repeat buyers with children under 18** | 22% | [NAR 2025](https://www.nar.realtor/magazine/real-estate-news/nar-2025-profile-of-home-buyers-sellers-reveals-market-extremes) | Sourced |
| **Married-household life-insurance rate** | Higher than single households | [Chicago Fed 2017](https://www.chicagofed.org/publications/economic-perspectives/2017/8) | Sourced |
| **VA median household income** | $90,974 (2023) | [U.S. Census Bureau / Neilsberg 2025 VA](https://www.neilsberg.com/insights/virginia-median-household-income/) | Sourced |
| **VA median household income by age 25–44** | $98,631 | [Neilsberg / Census](https://www.neilsberg.com/insights/virginia-median-household-income-by-age/) | Sourced |
| **VA median household income by age 45–64** | $112,425 | [Neilsberg / Census](https://www.neilsberg.com/insights/virginia-median-household-income-by-age/) | Sourced |
| **VA owner-occupancy rate** | 67.2% (vs. 65.2% national) | [Point2Homes / Census](https://www.point2homes.com/US/Neighborhood/VA-Demographics.html) | Sourced |

### Composite MPI buyer archetype (sourced-synthesis)

**Primary persona:** Homeowner with an **active mortgage**, age **30–55**, **married with dependents**, household income **sufficient to absorb $30–60/mo premium** (roughly $60K+ for a $250K loan), at or near a **life-event trigger** (new purchase, refi, new child, new marriage). Mortgage-holder + married + dependents is the strongest sourced correlate of life-insurance ownership.

**Secondary persona:** Senior (55–70) with remaining mortgage balance, estate-planning phase, partial LTV. Smaller cohort, higher per-lead value, lower conversion velocity.

**Excluded personas:** Cash buyers (no mortgage, no MPI need), renters (no property in BatchLeads), borrowers in active foreclosure / tax delinquency / bankruptcy (premium affordability fails).

### Data gaps flagged

- **No direct MPI conversion-rate data by filter-stack.** Neither LIMRA, ACLI, NAIC, nor industry publications segment life-insurance purchase probability by BatchLeads-style filter combinations. All rankings in Section D are educated inference, not measured conversion.
- **No Virginia-specific MPI buyer profile** exists in public data. State-level homeowner/income data is sourced; MPI-specific VA data is not. Use national pattern + VA demographic overlay.
- **BatchLeads `demographicsIncome` source-of-truth is not documented.** Could be modeled from census block estimates (less accurate per-person) or sourced from credit-bureau overlay (more accurate). Treat as 🟡 until first batch feedback validates.
- **Refi-date narrowing is not possible inside BatchLeads.** `firstLoanType = "Standalone Refinance"` identifies refi-origin loans but NOT when the refi occurred. Recency-of-refi would require external data (county recorder / MLS).

---

## Section D — Ranked Filter Combinations

**Geography for all combinations: `query = "Virginia, USA"`** (or narrow to specific VA counties/zips if Andreas has preference data from batch 1 call outcomes).

**Global guardrails applied to every combination:**
- `propertyClassifications = ["Residential"]`
- `propertyType = ["Single Family", "Condo/Townhouse"]`
- `ownerStatusType = ["Individual"]`
- `mortgagesCount = [1, ""]` — **critical fix: ensures a mortgage exists**
- `cashPurchase = "No"` and `cashBuyer = "No"` — **critical fix: excludes cash buyers**

---

### Combination 1 — Fresh-mortgage family household (PRIMARY)
**Persona:** Owner-occupant with a mortgage originated in the last 12 months, family-forming life stage, income-qualified for premium.

- `lastSoldDate`: last 12 months (e.g. `04/19/2025 → 04/19/2026` — a full year, wider than batch 1's 6 months to avoid depleting the VA pool).
- `estimatedValue`: `[$300,000, ""]` (**raised from batch 1's $240K** — VA median HH income $90K + new purchase premium suggests $300K is a tighter filter for households that can afford MPI premium on top of new housing costs).
- `demographicsAge`: `[30, 55]` (covers first-time buyer median age 40 and repeat buyer range that overlaps family-forming).
- `demographicsHasChildren = "Yes"` (🟡 — validate enum in first test; if BatchLeads doesn't accept, substitute `demographicsHouseholdSize = [3, ""]`).
- `demographicsMaritalStatus = "Married"` (🟡 — same contingency: substitute with `demographicsHouseholdSize` as family proxy).

**Logical reasoning:** All three sourced life-insurance purchase triggers overlap here — new home + (likely) marriage + (explicit filter) children. Homeowners 3–4x more likely to own life insurance than renters [Chicago Fed], and mortgage holders specifically more likely [ACLI]. Tightening income via `estimatedValue` floor removes households that can't afford MPI premium. This combination targets the LIMRA-documented trigger cascade in a VA household that can actually buy.

**Probability ranking: 1st.** Highest density of sourced MPI-buyer attributes in one filter stack.
**Attribution:** Inferred from sourced industry patterns (LIMRA triggers, NAR buyer demographics, ACLI mortgage-holder correlation). **No direct BatchLeads → MPI conversion data exists.**

---

### Combination 2 — Recent standalone refinancer, mid-age, meaningful balance
**Persona:** Homeowner who refinanced into their current first mortgage (any recency — BatchLeads can't time-narrow), aged mid-career, has a balance worth protecting.

- `firstLoanType = "Standalone Refinance"` (fixes batch 1's never-filtered refi intent).
- `mortgagesCount = [1, ""]`.
- `equityPercent = [20, 80]` — has a balance remaining but some equity built; excludes both free-and-clear and zero-down.
- `demographicsAge = [35, 55]`.
- `demographicsHasChildren = "Yes"` (🟡) OR `demographicsHouseholdSize = [3, ""]` (🟡 fallback).
- `estimatedValue = [$300,000, ""]`.

**Logical reasoning:** Refi is itself a LIMRA-cited life-insurance trigger — the borrower just re-signed mortgage paperwork and is mentally engaged with the debt commitment. Pairing refi with mid-age family and a meaningful balance (`equityPercent` band) targets households where (a) the trigger is fresh, (b) the coverage amount justifies the sale, (c) they can afford the premium.

**Probability ranking: 2nd.** Direct match to the refi-trigger intent Andreas named in batch 1, now actually filtered correctly.
**Attribution:** Inferred from sourced LIMRA triggers data. **BatchLeads cannot narrow to "recent refi" by date — this returns all refi-origin first-loans regardless of refi recency.** If time-narrow matters, pair export with external county-recorder data (flagged in Section F).

---

### Combination 3 — FHA-origin first-mortgage family
**Persona:** Homeowner whose current first loan is FHA-backed (typically first-time buyers, lower-down-payment, income-qualified for FHA limits).

- `firstLoanType = "FHA"`.
- `lastSoldDate`: last 18 months.
- `mortgagesCount = [1, ""]`.
- `demographicsHasChildren = "Yes"` (🟡).
- `estimatedValue = [$200,000, $500,000]` (FHA loan limits vary by VA county from ~$498K conforming to ~$1.3M in high-cost counties — 2025 FHA VA limits [HUD / Congressional Research](https://www.congress.gov/crs-product/R45837)).
- `demographicsAge = [25, 50]` (FHA buyer skew toward younger/first-time).

**Logical reasoning:** FHA borrowers skew toward first-time, lower-to-middle-income households with children — this is the "need MPI but don't have it yet" profile. They've already passed FHA income/credit thresholds, so they're qualifiable for MPI premium (rough $30–40/mo per $100K borrowed per [LendingTree](https://www.lendingtree.com/home/mortgage/mortgage-protection-insurance/)). Term life ownership correlates with debt and family-status [Chicago Fed], both of which FHA borrowers disproportionately have.

**Probability ranking: 3rd.** Strong demographic match but no direct data linking FHA-origin to MPI purchase specifically.
**Attribution:** Inferred from FHA borrower profile (HUD-documented) + LIMRA triggers + general homeowner/debt-to-life-insurance correlation. **Unverified for MPI specifically.**

---

### Combination 4 — Mid-tenure married household with dependents
**Persona:** Stable household 5–15 years into ownership, married with kids, carrying a mortgage — no recent trigger event, but highest base-rate MPI receptivity by demographic density.

- `yearsOfOwnership = [[5, 15], ["", ""]]`.
- `demographicsMaritalStatus = "Married"` (🟡).
- `demographicsHasChildren = "Yes"` (🟡) OR `demographicsHouseholdSize = [3, ""]`.
- `demographicsAge = [35, 55]`.
- `mortgagesCount = [1, ""]`.
- `loanToValuePercent = [30, 80]` — still paying mortgage, hasn't paid it off.

**Logical reasoning:** Without a recent life-event trigger, this combination relies on raw demographic density: married + kids + mortgage + mid-age. [Chicago Fed 2017] notes married households are more likely to hold term life, and mortgage debt correlates with ownership. Expect lower conversion rate than Combos 1-2 (no fresh trigger) but higher lead volume — valuable for sustained pipeline.

**Probability ranking: 4th.** Solid base-rate persona, but no trigger event. Lower per-call close probability; higher volume.
**Attribution:** Inferred from [Chicago Fed] and [ACLI] homeowner/mortgage-holder correlations. Unverified.

---

### Combination 5 — Senior-owner long-tenure with remaining mortgage
**Persona:** Age 55–70 homeowner, long-tenure (15+ years), still has a mortgage with meaningful balance — estate-planning life stage.

- `demographicsAge = [55, 70]`.
- `yearsOfOwnership = [[15, ""], ["", ""]]`.
- `loanToValuePercent = [20, 60]` — partially paid, not free-and-clear.
- `mortgagesCount = [1, ""]`.
- (Quick Filter chip "Senior Owner" may approximate this if `demographicsAge` enum is unavailable.)

**Logical reasoning:** Senior homeowners with remaining mortgage balance are re-thinking estate planning, legacy protection, and spouse-protection as retirement approaches. MPI age-eligibility window runs to 70 (some carriers) per [LendingTree](https://www.lendingtree.com/home/mortgage/mortgage-protection-insurance/), so the top of this band is near carrier cutoffs — act now or never. [NAR 2025] shows repeat-buyer median age is 62, so many 55–70s have active mortgages from recent downsizes or second purchases.

**Probability ranking: 5th.** Narrow cohort, higher premium per sale (older = higher risk class = higher premium AND higher sum insured), lower conversion velocity.
**Attribution:** Inferred from [NAR 2025] age mix + [LendingTree] age eligibility + [ACLI] retiree life-insurance ownership patterns. Unverified for MPI specifically.

---

## Section E — Testing Protocol

**Per-combination pull volume:** 50–100 leads. Pull Combo 1 first (highest hypothesized probability); move down the list after each batch returns data. Don't pull all 5 at once — feedback on Combo 1 will likely reshape Combos 2–5.

**Metrics to log per combination (spreadsheet or CRM tag per lead):**

| Metric | How measured | Why it matters |
|---|---|---|
| Valid-contact rate | Valid phones or emails / total leads | Baseline list quality (batch 1 was 79%). |
| Duplicate rate | Leads already in HighLevel / total | Signal of persona overlap with other paid vendors (batch 1 was 13%). Higher = commoditized persona. |
| Answer rate | Calls answered / calls placed | Phone quality + persona receptivity. |
| Conversation-qualified rate | Answered calls that engaged in MPI discussion / answered calls | First real signal of persona match. |
| Appointment-set rate | Appointments booked / answered calls | Intent signal. |
| Sale-close rate | Sold policies / appointments | Terminal conversion. |
| Premium per closed sale | $ per policy | Cohort economics. |

**Feedback loop:**
1. After Combo 1 runs: if answer rate and conversation-qualified rate meet or exceed batch 1 levels, **proceed to Combo 2** and hold Combo 1 as the "known baseline."
2. If Combo 1 underperforms batch 1: one of the tighter filters (`estimatedValue ≥ $300K`, `demographicsHasChildren`, `demographicsAge 30–55`) is over-narrowing. **Relax one filter at a time** — suggest dropping `demographicsHasChildren` first (most 🟡-uncertain); re-pull 50 leads.
3. When any combination outperforms batch 1 on sale-close rate by ≥ 25%, **promote it to Andreas's standing search.** Don't over-optimize; lock in the win, then test the next combination.
4. When a combination's **duplicate rate drops below 5%**, it's signal that you've found an under-traffed persona segment — document which filters are doing the work and preserve that combination even if close-rate is comparable to others.

**Feedback doc shape (one row per batch):**

`date | combo # | leads pulled | valid % | dup % | answered % | qualified % | appt % | closed % | premium $ | notes`

---

## Section F — Data Gaps and Proposed Workarounds

| Gap | Why it matters | Workaround |
|---|---|---|
| **No BatchLeads→MPI conversion data anywhere in public sources.** | All rankings are educated inference, not measured. Could be wrong. | Treat first 3 batches as *calibration*. Empirical data from Andreas's calls is more valuable than any industry report. Adjust rankings based on his close-rate data. |
| **BatchLeads `demographicsHasChildren`, `demographicsMaritalStatus`, `demographicsIncome` enum values are 🟡 inferred** — never UI-confirmed. | If the enum values don't match what I've written ("Yes", "Married"), the filter silently fails and returns a larger-than-expected set. | First test: pull Combo 1 with the demographic filters on. Result count should be materially smaller than `query = VA + mortgagesCount ≥ 1 + estimatedValue ≥ $300K + lastSoldDate 12mo`. If not, open each demographic filter in the UI via All Filters drawer and note the exact enum labels. |
| **No refi-date filter in BatchLeads.** Combo 2 returns refi-origin loans regardless of when the refi happened. | Two options: (a) accept wider refi cohort and rely on age/family filters to tighten; (b) export Combo 2 results to CSV, cross-reference with [Virginia SCC](https://scc.virginia.gov/) or county-recorder APIs to narrow to refis recorded in the last 12 months. Option (b) is production build — not feasible for batch 2 calibration. |
| **Virginia-specific MPI buyer profile doesn't exist in public data.** | State-level tuning is guesswork until Andreas's call data accumulates. | Start with national-pattern filters (above). After 3 batches, zip-level / county-level close-rate clustering will reveal VA hot-spots. At that point, narrow `query` to top-performing VA counties. |
| **Duplicate overlap with other vendors (10/79 = 13%).** Indicates Andreas's persona is being sold by multiple lead vendors. | Combos with less common filter stacks (e.g. Combo 5 Senior-Owner-long-tenure) are likely less-traffed by commodity vendors. If volume cost is acceptable, skew future batches toward narrower personas that commodity vendors don't target. |
| **BatchLeads credit balance at $0.00** (skip-trace costs credits). | Enrichment at ingest may be blocked; valid-contact rate depends on enrichment. | Confirm Andreas's BatchLeads plan includes skip-trace credits or purchase the minimum needed. Batch 1's 79% valid-contact rate suggests credits are flowing; verify before batch 2. |
| **`firstLoanType` source lag.** BatchLeads pulls public records; a refi recorded 2 weeks ago may not show up yet. | Bias Combo 2 pulls toward older recency windows (accept `Standalone Refinance` for all ages) and let the age/balance filters do the narrowing. |
| **Rate-up-vs-original filter is impossible inside BatchLeads.** (Separate finding from V-OKC validation.) | Not needed for MPI targeting specifically — MPI buyers don't care about refi-up-vs-down; they care about having a mortgage. Don't attempt to filter by rate delta. |

---

## Appendix — Batch 1 → Batch 2 migration checklist

**Remove from batch 1 stack:**
- [ ] `Purchase date` (redundant with `Last sale date` — both set `lastSoldDate`).
- [ ] `Cash Buyer: Any` (wastes a filter slot).

**Add to Combo 1 (minimum viable batch 2 pull):**
- [ ] `mortgagesCount ≥ 1`
- [ ] `cashPurchase = No`
- [ ] `cashBuyer = No`
- [ ] `demographicsAge = [30, 55]`
- [ ] Either `demographicsHasChildren = Yes` OR `demographicsHouseholdSize ≥ 3` (whichever BatchLeads accepts cleanly).
- [ ] Consider raising `estimatedValue` floor from $240K to $300K (removes non-qualifying VA households).
- [ ] Widen `lastSoldDate` to 12 months (from 6) to avoid depleting the pool.

**Test order:** Combo 1 → Combo 2 → Combo 3 → Combo 4 → Combo 5. Don't pull all at once. Let each batch's data reshape the next.

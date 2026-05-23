# The Ideal MPI Buyer + Exact Virginia BatchLeads Filter Stack

**Prepared:** 2026-04-19 · **For:** Andreas Bastidas (field operator) · **Platform:** BatchLeads.io Property Search

---

## The Ideal Mortgage Protection Insurance Buyer — Plain Language

The person most likely to buy mortgage protection insurance is a homeowner — specifically, a homeowner who currently has an active mortgage they are still paying down. That single condition separates them from the roughly **26% of U.S. home buyers in 2025 who paid all-cash** ([NAR 2025 Profile of Home Buyers and Sellers](https://www.nar.realtor/magazine/real-estate-news/nar-2025-profile-of-home-buyers-sellers-reveals-market-extremes)) and have nothing for MPI to protect. If someone doesn't have a mortgage, MPI has no product to sell them. Every other characteristic below assumes the mortgage is already there.

Zoom in on this mortgaged homeowner. They are most often **between 30 and 55 years old**. This band matters for three reasons. They're old enough to have started thinking about their own mortality and what happens to the people they love if they die unexpectedly. They're young enough for the MPI premium to still be affordable, because premiums climb sharply after age 55 when mortality tables turn against the insured. And they sit squarely inside the years of peak family formation — buying a first home, marrying, having children — which is when the need for coverage feels most concrete. MPI eligibility typically extends to age 70 at most carriers ([LendingTree — MPI Explained](https://www.lendingtree.com/home/mortgage/mortgage-protection-insurance/)), but the velocity of the sale — how quickly the conversation turns into a signed application — is highest in the 30–55 band.

They are **married** or in a committed domestic partnership, and they have **at least one dependent child at home**. The emotional lever for MPI is almost entirely about family protection: "what happens to my spouse and kids if I die tomorrow, and they can no longer afford the house?" A single person with no dependents has a much harder time seeing the need. Research from LIMRA consistently identifies marriage, the birth or adoption of a child, and buying a house as the three life events that trigger life insurance purchases ([LIMRA — Consumers Under 40 Are Skipping Life Insurance, Sept 2025](https://www.limra.com/en/newsroom/news-releases/2025/consumers-under-40-are-skipping-life-insurance-as-they-delay-traditional-triggers-such-as-marriage-and-parenthood/)). MPI as a product is the clearest wedge into homeowners who overlap all three.

They have **household income in a middle-to-upper-middle range — roughly $60,000 to $180,000 per year**. Below that floor, the MPI premium competes with groceries and utilities; even motivated prospects struggle to commit. Above that ceiling, households become wealthy enough to self-insure — their investment accounts, 401(k)s, and existing employer-provided term life policies can already cover the mortgage if they die, so a separate MPI product is redundant. The sweet spot is the American middle class: a dual-income household or a solid single-earner household living in a home they bought on a mortgage they're carefully managing.

They live in a **primary-residence property worth roughly $300,000 to $800,000**. This is the income proxy BatchLeads gives us. Below $300,000 in Virginia generally signals a household that can't comfortably absorb another monthly premium. Above $800,000 signals the high-wealth tier that tends to already have group term life through an employer or a financial planner, and so is a much harder close for MPI specifically. In Virginia, where the median household income is **$90,974** and homeowners skew older and more affluent than the general population ([U.S. Census Bureau via Point2Homes](https://www.point2homes.com/US/Neighborhood/VA-Demographics.html)), that $300K–$800K band maps cleanly onto the middle-class homeowner pool that represents Andreas's true addressable market.

They had a **recent life event that put the mortgage on their mind**. The strongest event is a **new home purchase within the last 12 months** — they just signed mortgage paperwork, they've had the lender's "how much house can we afford?" conversation, and they're already being asked by their realtor or lender about life insurance. The second-strongest event is a **recent refinance** — they re-signed mortgage paperwork and the debt feels fresh again; psychologically, they've just recommitted to the obligation. The third is the **arrival of a new child**, which shifts the protection motivation from "keep the house" to "keep the kids stable in the house." Andreas's conversion rate is always highest when the lead has experienced one of these events within the last year, ideally within the last six months.

They are the **primary breadwinner or share income with a working spouse**, and their household would genuinely struggle to keep the house if the earner's income disappeared. This is the core MPI pitch, and it only lands when the economics underneath it are real: "If you die tomorrow, your spouse keeps the kids in this house." A household where the breadwinner carries the mortgage alone is the tightest fit, because the family has no fallback. A dual-earner household is still a strong fit when the mortgage requires both incomes. A household where one spouse doesn't need to work for the mortgage is a weaker fit.

They are **not currently in financial distress**. They are not in foreclosure. They are not tax-delinquent. They have not filed for bankruptcy recently. They do not have involuntary liens on the property. Distressed borrowers cannot reliably pay a monthly premium — they're already struggling to keep the mortgage itself current, and every dollar is spoken for. MPI targets the household that can afford protection, not the household that's drowning.

They live in an **owner-occupied primary residence**, not an investment property. Investment properties are owned by landlords who think about risk at the property level, not the family level — they carry landlord insurance and rental-income protection, not mortgage protection life insurance. Ownership held in an individual's name (not an LLC, not a trust, not a corporation) is the cleanest signal that this is the owner's own home. Single-family detached homes and condos or townhouses are the core property types for this persona; multi-family buildings (duplexes, triplexes, apartment buildings) usually signal an investor profile.

The sourced research behind this persona is unambiguous: homeowners with mortgages own life insurance at materially higher rates than renters or free-and-clear owners ([Chicago Fed 2017](https://www.chicagofed.org/publications/economic-perspectives/2017/8); [ACLI 2025 Life Insurers Fact Book](https://www.acli.com/about-the-industry/life-insurers-fact-book/2025-life-insurers-fact-book)). Married-with-children households are more likely to carry term life than single or childless households (Chicago Fed). LIMRA's 2025 research specifically warns that younger consumers are *delaying* the traditional triggers, which means the 30–55 band — the generation actively *hitting* these triggers right now — is precisely the urgency window. Miss them in this decade and they may never buy.

---

## Exact BatchLeads Filters — Virginia Primary Pull (Recent-Purchase Trigger)

Apply these one-for-one in the BatchLeads UI. The UI field names below match what Andreas will see in the Property Search "All Filters" drawer. Underlying payload keys are in the right column for reference / debugging.

| # | BatchLeads UI Field | Section | Value to Set | Payload Key | Why |
|---|---|---|---|---|---|
| 1 | **Location** (top bar) | Location | `Virginia, USA` | `query` | State-wide first pass; narrow to counties after batch-call data reveals hot spots. |
| 2 | **Property Classification** | Property Characteristics | `Residential` | `propertyClassifications` | Excludes commercial / industrial / vacant-land. |
| 3 | **Property Type** | Property Characteristics | Select both `Single Family` AND `Condo/Townhouse` | `propertyType` | Primary-residence property types only. |
| 4 | **Owner Type** | Ownership Info | `Individual` | `ownerStatusType` | Excludes LLC / corporate / investor ownership. |
| 5 | **Number of Open Mortgages** | Mortgage Info | Min `1`, Max blank | `mortgagesCount` | **Critical.** No mortgage = no MPI need. Batch 1 missed this. |
| 6 | **Cash Buyer** | Cash Buyers | `No` (if field exposes No/Yes; else leave blank) | `cashBuyer` | Cash buyers have no mortgage. Batch 1 left this on "Any" — wasted ~1 in 4 leads. |
| 7 | **Cash Purchase** | Cash Buyers | `No` (if field exposes No/Yes; else leave blank) | `cashPurchase` | Same reason; distinct payload key — set both. |
| 8 | **Free & Clear** | Cash Buyers | `Any` (default) — or `No` if the option exists | `freeAndClear` | Excludes no-mortgage free-and-clear owners. |
| 9 | **Last Sale Date** | Ownership Info | `04/19/2025` to `04/19/2026` (last 12 months) | `lastSoldDate` | Recent purchase = strongest LIMRA-cited MPI trigger. 12 months (not 6) to protect pool size. |
| 10 | **Estimated Value** | Valuation & Equity | Min `$300,000`, Max `$800,000` | `estimatedValue` | Middle-class income proxy in Virginia. Removes both premium-can't-afford floor and self-insure-already ceiling. |
| 11 | **Demographics Age** | Demographics | Min `30`, Max `55` | `demographicsAge` | MPI sweet spot for both willingness and affordability. |
| 12 | **Demographics Marital Status** | Demographics | `Married` | `demographicsMaritalStatus` | Family-protection motivation concentrates here. |
| 13 | **Demographics Has Children** | Demographics | `Yes` | `demographicsHasChildren` | Dependents drive the MPI decision. |

**Leave all of these BLANK (do not configure):**
- Foreclosure Status · Tax Delinquent Year · Lien Type · Bankruptcy Recording Date — distressed borrowers can't afford the premium; exclude by leaving blank, not by filtering.
- MLS Status — listing status isn't relevant to MPI intent.
- Property Characteristics: Vacant Lot, Vacant — we want occupied homes.
- 1st Loan Interest Rate — not relevant for MPI.
- Any demographic filter not listed above — especially Religion, Ethnicity, Gender — do not use. Fair-housing rules apply to outreach messaging that references these, and they add zero value to MPI targeting.

### Fallback if filters 12 or 13 return zero leads or behave oddly

The three demographic filters (Age, Marital Status, Has Children) were never UI-confirmed during platform-mastery work — their exact accepted enum values are inferred. If BatchLeads rejects "Married" or "Yes" as the accepted values, substitute in this order:

1. Drop `Demographics Has Children` first; replace with `Demographics Household Size` Min `3`, Max blank (proxy for "kids in the home").
2. If still no results, drop `Demographics Marital Status`; keep the household-size filter as the family proxy.
3. If still no results, widen `Demographics Age` to 25–60.

---

## Second Parallel Pull — The Refinancer Cohort

Apply **the same 13-filter stack above with ONE change**: instead of setting `Last Sale Date`, set **`1st Loan Type`** (Mortgage Info section) to **`Standalone Refinance`**. Leave `Last Sale Date` blank.

This replaces the "recent purchase" trigger with the "recent refinance" trigger — the second-strongest MPI life-event per LIMRA. The refi cohort is typically smaller than the recent-purchase cohort, but also less likely to overlap with commodity lead vendors since most realtor/mortgage-referral lists chase recent purchases and ignore refi-origin loans. Expect a different duplicate rate than batch 1 — track it.

**Honest limitation for Andreas:** BatchLeads does not let us filter by *when* the refinance happened, only whether the current first loan is a refi. So the refinancer pull will include people whose refi was last month and people whose refi was five years ago. The Age and Estimated Value filters do most of the narrowing work in the absence of a refi-date filter.

---

## Sources

- [LIMRA 2024 Insurance Barometer Study](https://www.limra.com/en/research/research-abstracts-public/2024/2024-insurance-barometer-study/)
- [LIMRA (Sept 2025) — Consumers Under 40 Are Skipping Life Insurance](https://www.limra.com/en/newsroom/news-releases/2025/consumers-under-40-are-skipping-life-insurance-as-they-delay-traditional-triggers-such-as-marriage-and-parenthood/)
- [ACLI 2025 Life Insurers Fact Book](https://www.acli.com/about-the-industry/life-insurers-fact-book/2025-life-insurers-fact-book)
- [NAR 2025 Profile of Home Buyers and Sellers](https://www.nar.realtor/magazine/real-estate-news/nar-2025-profile-of-home-buyers-sellers-reveals-market-extremes)
- [Chicago Fed — What Explains the Decline in Life Insurance Ownership? (2017)](https://www.chicagofed.org/publications/economic-perspectives/2017/8)
- [LendingTree — Mortgage Protection Insurance: What It Is and When to Buy It](https://www.lendingtree.com/home/mortgage/mortgage-protection-insurance/)
- [Neilsberg — Virginia Median Household Income (2025)](https://www.neilsberg.com/insights/virginia-median-household-income/)
- [Point2Homes — Virginia Demographics](https://www.point2homes.com/US/Neighborhood/VA-Demographics.html)

# PHASE 3 INTAKE CHECKLIST — Caramel Oven Build Prerequisites

**Purpose:** Questions Dan routes to Stacy and Josh before or during Phase 3 guide writing. Each question gates specific Phase 3 sections. Sections flagged "BLOCKED by Qn" wait for Qn's answer.

**Format convention:** Each question has:
- Plain-English question text (what Dan actually asks Stacy/Josh)
- Why it matters (the HighLevel-specific reason)
- What it blocks (Phase 3 section dependency)
- Default if blank (provisional answer I'll use if the question stays unanswered past Phase 3 start)

---

## Q1 · Legal entity type (A2P registration fork)

**Ask Stacy/Josh:**
> "Is Caramel Oven Bakehouse a registered business (LLC / S-Corp / Partnership / Corporation), or is it operating as a Sole Proprietorship? If registered, can you share the EIN?"

**Why it matters:** A2P 10DLC Brand Registration has two distinct paths — Standard Brand (requires EIN + registered entity details) vs Sole Proprietor Brand (no EIN, different throughput tier, different rejection-rate profile). Wrong selection = weeks of rework.

**Blocks:** Section 4 — Phone + SMS Setup, specifically the A2P Brand Registration sub-step.

**Default if blank:** Assume Sole Proprietor Brand. Flag prominently in guide. Re-register if wrong.

---

## Q2 · Existing domain status

**Ask Stacy/Josh:**
> "Do you already own a domain for Caramel Oven (e.g., carameloven.com)? If yes: where is it registered (GoDaddy, Namecheap, Google Domains, other)? Is it currently connected to a live website, parked/unused, or do you want us to take it over completely?"

**Why it matters:** Domain Connect flow differs by registrar (DNS provider UI varies). If no domain: we buy one through HighLevel OR register externally first. LC Email setup depends on this.

**Blocks:** Section 3 — Domain + Email Setup.

**Default if blank:** Flag in guide; recommend buying through HighLevel for speed.

---

## Q3 · Existing Stripe account

**Ask Stacy/Josh:**
> "Do you have a Stripe account set up for Caramel Oven? If yes: is it actively used (past payments, existing products or subscriptions)? Any webhooks connected to other tools?"

**Why it matters:** HighLevel connects to Stripe via OAuth. Pre-existing Stripe state means we can IMPORT products/prices rather than build from scratch ("Import Products / Price From Stripe" article 48001202184). Existing webhooks may conflict with HighLevel's webhook handlers.

**Blocks:** Section 7 — Stripe + Products Catalog.

**Default if blank:** Assume no existing Stripe. Build products from scratch in HighLevel.

---

## Q4 · Existing Google Business Profile

**Ask Stacy/Josh:**
> "Is Caramel Oven's Google Business Profile already claimed and verified? What address is associated (storefront, home-based, farmers-market)? Any existing Google reviews on the listing?"

**Why it matters:** Review Request workflow requires GBP integration. If unverified, the claim-and-verify process takes 1-2 weeks (postcard mail for storefronts; phone-call-verification for some home-based). Existing review history must be preserved.

**Blocks:** Section 11 — Reputation Management, specifically the review request workflow that sends customers to a GBP URL.

**Default if blank:** Assume unverified. Include GBP claim-and-verify as a parallel track in Section 11 with a 1-2-week expected lag.

---

## Q5 · Appointment booking operator model

**Ask Stacy/Josh:**
> "When a customer books a custom-order consultation or catering tasting, is it always one specific person taking the meeting (e.g., always Stacy)? Or should customers see availability for multiple people (Stacy AND Josh)? If multiple, should the customer choose who they meet with, or does HighLevel route them to whoever is free ('any available')?"

**Why it matters:** Services v2 can be configured single-staff OR with Staff selection (customer picks). Calendar Groups adds round-robin / collective-availability routing ("any available baker"). This is a setup-time decision; changing later means rebuilding the calendar.

**Blocks:** Section 9 — Calendars & Services.

**Default if blank:** Assume single-staff (Stacy primary). Easy to extend later.

---

## Q6 · Wholesale client tracking model (Companies activation trigger)

**Ask Stacy/Josh:**
> "Do you sell Caramel Oven products to restaurants, cafés, grocers, or corporate catering clients? If yes: how many active B2B accounts today? And when you deal with an account like a restaurant, do you track multiple contacts there (e.g., owner + chef + purchasing manager), or just one primary contact per account?"

**Why it matters:** Determines whether the Companies module gets activated. If multi-contact B2B accounts are real, Companies moves OPTIONAL → IN SCOPE. Without Companies, wholesale relationships are tracked at Contact level with tags like `wholesale-account:brickyard-cafe` — less clean but workable.

**Blocks:** Section 10 — Pipelines & Opportunities, specifically the Wholesale pipeline design.

**Default if blank:** Assume wholesale exists but Contact-level tracking is sufficient (no Companies activation). Companies remains OPTIONAL.

---

## Q7 · Social media platform access

**Ask Stacy/Josh:**
> "Which social platforms does Caramel Oven actively use? (Facebook Page, Instagram Business, LinkedIn, TikTok, Pinterest, Google Business Profile posts.) Who has admin access to each? We'll need admin-level authorization to connect each platform to the Social Planner."

**Why it matters:** Social Planner connections require platform-side OAuth grants — only an admin can approve them. Non-admin users see a cryptic failure at connect time.

**Blocks:** Section 19 — Social Planner Scheduling.

**Default if blank:** Assume FB Page + IG Business; defer LinkedIn/TikTok to post-launch.

---

## Q8 · Existing customer list (contact import)

**Ask Stacy/Josh:**
> "Do you have an existing customer list anywhere — email newsletter platform (Mailchimp, ConvertKit, Klaviyo, etc.), POS system (Square, Clover, etc.), spreadsheet, Google Contacts? Roughly how many contacts?"

**Why it matters:** Determines Contacts Import effort (CSV load vs POS-platform integration). Also affects Email warming — a cold, fresh LC Email domain needs to ramp sends gradually (domain warmup). A large import list (>5000) blasted immediately can crater deliverability on Day 1.

**Blocks:** Section 6 — Contacts Import & Smart Lists. Non-blocking for other sections but informs planning.

**Default if blank:** Assume no list. Skip import; start fresh.

---

## Q9 · Brand assets

**Ask Stacy/Josh:**
> "Can you send: (a) logo files (SVG or high-res PNG), (b) brand color palette as hex codes or a color swatch PDF, (c) any brand fonts you use (either Google Fonts names or custom font files), (d) a paragraph or two describing your brand voice ('we sound warm and playful, not formal; we use baking metaphors; we never capitalize for emphasis' — that sort of thing)?"

**Why it matters:** Brand Board is the central style repository. Content AI auto-fills Brand Voice fields from whatever is saved here; downstream generations (social posts, emails, funnel copy) all inherit. Without brand assets, defaults are generic.

**Blocks:** Section 5 — Custom Values, Custom Fields, Tags, Brand Board (specifically the Brand Board sub-step) — and downstream Section 18 (Content AI Setup).

**Default if blank:** Use placeholder brand (Caramel Oven name + neutral color palette + brand voice "warm, artisanal, local"). Replace when assets arrive.

---

## Q10 · Menu / product catalog

**Ask Stacy/Josh:**
> "Can you share your current product catalog — what you sell at the farmers market, standard retail prices, any wholesale pricing tiers, and a list of catering/custom-order options with typical price ranges?"

**Why it matters:** The Products catalog in HighLevel drives Invoices, Payment Links, and Order Forms. Building this early lets downstream sections (Sections 15-16 Invoices + Gift Cards) reference real SKUs.

**Blocks:** Section 7 — Stripe + Products Catalog. Also informs Section 16 (Gift Cards) pricing tiers.

**Default if blank:** Build placeholder catalog with 3-5 representative products.

---

## Non-blocking clarifications welcome

- Preferred tone for customer emails (warm / professional / playful / all of the above depending on context)
- Specific farmers-market locations served (cities/days)
- Catering price tiers and what's included at each tier
- Expected order volume (per week / per month) — informs SMS throughput planning
- Any upcoming events (Mother's Day promotion, etc.) that should influence Gift Card launch timing

---

## Delivery

Dan routes these to Stacy and Josh in advance of or in parallel with Phase 3 writing. Answers can be collected incrementally — each answer unblocks its section. Sections with satisfied dependencies get written first; blocked sections wait.

**Recommended batching:**
- **Urgent (blocks early sections):** Q1, Q2, Q3, Q4, Q5
- **Mid-priority (blocks middle sections):** Q6, Q9, Q10
- **Lower priority (later sections):** Q7, Q8

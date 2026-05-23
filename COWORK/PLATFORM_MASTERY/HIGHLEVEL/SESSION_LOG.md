# SESSION_LOG — HighLevel Platform Mastery

Chronological audit trail of every documentation-audit session. Mirrors BatchLeads methodology: what I read, what I observed, what I inferred, what I corrected. This is the honest record — it is how mastery is defended and how the guide is defended when a reviewer asks "how did you know that?"

## Template — one entry per session block

```
## [yyyy-mm-dd HH:MM] — Phase [n] — [short label]
- Goal: [what I set out to learn]
- Actions: [pages fetched / searches run / UI probes — high level]
- Observations: [what the docs showed — surprising, expected, unclear]
- Hypotheses formed: [things I now believe but haven't confirmed]
- Corrections: [things I previously believed that turned out wrong]
- Next: [the question this session surfaced]
```

---

## Log

### 2026-04-18 — Phase 0 — Workspace setup

- Goal: Stand up mastery workspace under `COWORK/PLATFORM_MASTERY/HIGHLEVEL/` mirroring BatchLeads structure; begin documentation reconnaissance.
- Actions: Created directory. Read BatchLeads schema for template transfer. Registered 8-task Phase 1 plan in TodoWrite. Confirmed no prior HighLevel work in `C:/Kahn 2.0` or `C:/Nebula Dashboard`.
- Observations: BatchLeads schema used six files (FILTER_DEFINITIONS, WORKFLOW_LIBRARY, INTEGRATION_MAP, USE_CASE_PLAYBOOK, SESSION_LOG, SELF_VALIDATION). HighLevel is a much broader platform (CRM + marketing automation + voice/SMS + payments + sites/funnels + memberships + reputation + SaaS reselling), so file layout is adapted: KNOWLEDGE_MAP (hierarchical outline), SYNTHESIS (prose), ASSUMPTIONS (flags), SESSION_LOG (this file), ARTICLE_INDEX (raw title inventory), RAW_INGESTION_LOG (wave tracking), plus phase-3+ deliverables (CARAMEL_OVEN_GUIDE, INTEGRATIONS_MAP, CASE_STUDY, UPDATE_PROTOCOL) to be created when their phase opens.
- Hypotheses:
  - The HighLevel help center (help.gohighlevel.com/support) is the canonical documentation source.
  - The most efficient traversal is: sitemap.xml → category index → per-article fetch, with category pages acting as a table of contents for the knowledge map.
  - BatchLeads methodology transfer (client-side state inspection) still applies; HighLevel's sub-account UI almost certainly stores workflow configs, automations, and custom values as JS objects reachable via browser devtools. This becomes a Phase 1.3 research item before UI work.
- Corrections: None yet.
- Next: Enumerate every top-level help category; build skeleton of KNOWLEDGE_MAP; begin systematic article ingestion.

### 2026-04-18 — Phase 1.1 — Top-level reconnaissance

- Goal: Enumerate every solution category in the help center; lay foundation for waved ingestion.
- Actions: WebFetch `help.gohighlevel.com/support/home` + `/solutions` + `/sitemap.xml`. WebSearch for sitemap keywords.
- Observations: 45 top-level categories enumerated, ~160 sub-folders, ~2,050 articles reported. Sitemap XML returns numeric IDs only (no titles — titles require folder-index fetches). Several features appear dual-homed (Docs & Contracts top-level AND Payments sub-folder; Client Portal top-level AND Sites sub-folder; Custom Objects top-level AND Sites sub-folder; E-commerce Store top-level AND Sites sub-folder "Stores"). This is a help-center organization artifact — the product shape is cleaner than the doc org.
- Hypotheses: Ingestion budget should prioritize Caramel-Oven-critical folders (Contacts, Conversations, Calendars/Services, Workflows, Payments, Reputation, Snapshots, Settings); agency-tier folders (SaaS Mode, Reselling, Affiliates, Eliza) get light coverage; WhatsApp's 91 articles gets skim only.
- Corrections: Initial mental model had "University" as a separate top-level; it's actually a top-level category (49000674647 How-To's + 155000000160 Prospecting & Sales) that I had miscounted as lower priority.
- Next: Launch Wave 1 (Getting Started + Agency + Settings foundation) folder fetches.

### 2026-04-18 — Phase 1.2 — Documentation audit (waves 1-9)

- Goal: Ingest every top-level category's folder-index pages + deep-read the highest-leverage overview articles.
- Actions: Completed ~50 WebFetch calls against help-center folder pages, producing article-title inventories for the vast majority of sub-folders. Supplemented with 17 deep-read WebFetches of critical overview articles. Two WebSearches for developer portal + tech stack. One WebFetch against `marketplace.gohighlevel.com/docs/` and `ideas.gohighlevel.com/changelog`.
- Observations: Concrete findings that refined or corrected Phase 0 assumptions:
  - **LC Phone is proprietary, NOT Twilio rebrand** (corrects B-4).
  - Workflow Triggers has **12 sub-folders** (CRM · Events · Appointments · Courses · Payments · Shopify · IVR · Facebook/Instagram · Communities · Forms/Surveys · TikTok · LinkedIn).
  - Workflow Actions has **15 sub-folders** (CRM · Communication · Send Data · Internal Tools · Workflow AI · Appointments · Payments · Affiliate · IVR · Memberships/Communities · Social Media · Integrations · Webhooks · Data Management · Documents & Contracts).
  - **Legacy Campaigns/Triggers are deprecated in favor of Workflows** (confirmed by 48001229927).
  - **Services (v2) is a separate, enhanced booking layer** on top of basic Calendars (13-article folder, includes staff pricing, resources, add-ons, native payment modal).
  - **A2P 10DLC is mandatory for US local SMS**; toll-free exempt; Canada has separate rules.
  - **No bakery / farmers-market Industry Playbook**. Closest analogue: Restaurant/Bar (155000000967).
  - **MCP Server support** announced 2026-04-17 — AI agents can now access external apps/DBs via Model Context Protocol.
  - **Tech stack: Node.js + Vue.js + MongoDB**. V2 REST API at marketplace.gohighlevel.com/docs with OAuth 2.0 + Private Integration Tokens. V1 end-of-support 2025-12-31. Rate limits 100/10s burst, 200K/day per app per Location.
  - **URL pattern** for sub-accounts: `app.gohighlevel.com/v2/location/<LocationID>/...`. Location ID is the load-bearing identifier.
- Hypotheses:
  - Caramel Oven build guide's optimal structure is roughly: Identity (sub-account setup, domain, channels) → CRM (contacts, custom fields, tags) → Pipelines (wholesale, catering) → Calendars (Services for consultations) → Automations (appointment flows, review requests, abandoned-cart) → Web presence (funnel, forms, chat) → Marketing (email campaigns, social planner, review requests) → Monetization (products, invoices, payment links) → Dashboards → Handover.
  - Industry Playbooks for Restaurant/Bar will be partially applicable; Hair Salon playbook may also contribute patterns (appointment-heavy local service).
- Corrections:
  - B-4 assumption corrected (LC Phone is proprietary, not Twilio rebrand).
  - Assumption about a bakery playbook existing — does not.
- Next: Write ARTICLE_INDEX.md with full captured title inventory; rewrite SYNTHESIS with deep-read content and updated confidence; update KNOWLEDGE_MAP with confidence chips and Axis 4 system architecture; update ASSUMPTIONS with resolutions; signal Phase 1 complete.

### 2026-04-19 — BUILD COMPLETE — Sections 19 · 20 · 21 delivered (final batch)

- Goal: Final continuous-pipeline batch. Sections 19 (Social Planner) · 20 (Dashboards) · 21 (QA + Launch + Handoff). Build completion artifact.
- Actions:
  - **Section 19** (Social Planner): 3 platforms connected (FB page 61580049856247 · IG @caramelovenokc · TikTok @caramel.oven.okc per site-extraction-confirmed Q7). Brand Board-styled + 15% watermark. 3 hashtag groups (OKC Local · Products · Brand/Values). 7 post-type templates (Market-Day · New Product Drop · Behind-the-Scenes · Seasonal · Customer Feature · Recipe/Educational · Mission America Veteran/Values). 2-week starter batch drafted via Content AI (6-10 posts). Recurring patterns: Friday Market-Day + Tuesday Behind-the-Scenes with manual-approval gate. GBP Post Scheduler connection noted. Cadence activation deferred to Stacy/Josh per Q7 directive.
  - **Section 20** (Dashboards + Mobile App): "Caramel Oven Daily" dashboard with 10 widgets across 3 rows (Row 1 top-of-funnel: New Leads · Pipeline Value Catering · Pipeline Value Wholesale; Row 2 ops/revenue: Appointments This Week · Revenue MTD · Reviews This Month · Review Response Queue; Row 3 health/momentum: Active Customers · Dormant 60d+ · Gift Card Outstanding Balance). Set as Default for Dan/Stacy/Josh. Mobile app onboarding flow for both owners with notification preferences matched to roles (Stacy primary · Josh backup). Business Card Scanner enabled. Secondary dashboards (Wholesale Pipeline · Event Pipeline · Operator Daily Tasks) scaffolded but deferred to post-launch.
  - **Section 21** (QA + Launch + Handoff) — THE CAPSTONE: 11 steps covering (1) pre-launch QA test plan organized by all 20 upstream sections; (2) legal review accumulator — 8 items requiring attorney within 30 days; (3) CPA verification for Oklahoma sales tax + Gift Card compliance; (4) Stacy/Josh confirmation list (hours · deposits · 224 carrier · FB admin · IG Business · Stripe · GBP · mobile · product catalog · brand assets); (5) go-live sequence (Sunday 2026-04-26 pre-cutover QA → Monday 2026-04-27 6am CT cutover + phone update + Campaign submission same day or next business day → 2026-04-30 to 2026-05-02 SMS fully unlocks); (6) Operator Playbook v1 with daily/weekly/monthly/quarterly/annual rhythms + emergency procedures + escalation contacts; (7) 30-day post-launch support scope + cadence (daily Week 1-2 → biweekly Week 3-4 → Day 30 retrospective 2026-05-27); (8) Snapshot packaging prep for Phase 5.1 execution at T+30; (9) Case Study data collection per CASE_STUDY_SCAFFOLD.md; (10) Intake archival + build closure; (11) Friday 2026-05-01 handoff ceremony with Dan/Stacy/Josh.
- Observations:
  - **Caramel Oven HighLevel Build Guide v1.0 is complete.** 22 sections across 4 phases plus Phase 5 prep. Every section has Last Updated, every UI-specific claim has UI-VERIFY, every assumption is documented, every client-side dependency is mapped.
  - Section 21 surfaces the full post-build timeline through 2026-07-26 (T+90 Case Study publish). This gives Dan a concrete roadmap beyond go-live.
  - Handoff ceremony scheduled end of Week 1 (2026-05-01) rather than Day 1 — chose for context: real issues surface in Week 1 and the training benefits from having that context.
  - Legal review deferred post-launch creates a 30-day window where drafts are live but not attorney-reviewed. Acceptable given A2P carrier doesn't verify legal accuracy. Attorney meeting scheduled within 30 days = standard small-business cadence.
  - Snapshot packaging at Day 30 (2026-05-27) turns Caramel Oven from one-off client into the compounding PitchBlack asset. This is the pivot moment from "first client" to "scaling practice."
- Hypotheses:
  - All 10 Section 21 Stacy/Josh confirmation items resolve within 7 days — the items are mostly single-facts.
  - The 30-day post-launch support window surfaces 3-5 minor workflow/template adjustments; these iterate in real-time.
  - First real catering inquiry or wholesale inquiry lands within 14 days of go-live, validating the workflow chain end-to-end.
  - First gift card sale happens within 48 hours of go-live (novelty + Mother's Day proximity if launched late April / early May 2026).
- Corrections: None.
- Next: Deliver final batch with Section 21 as the end-of-build artifact. Post-delivery, operational mode transitions to 30-day support + post-launch iteration per the playbook.

### 2026-04-19 — Continuous-pipeline execution — Sections 9 · 11 · 12 · 14 · 15 · 16 · 17 delivered (Section 17 = MANDATORY CHECK-IN)

- Goal: Execute continuous-pipeline directive under expanded autonomy. 7 sections written in sequence, single mandatory check-in at Section 17 for Dan review before A2P Campaign Registration fires.
- Actions:
  - **Section 9** (Calendars + Services): 4 services locked per Q5 (Custom Order Consultation 30min/$25 Stacy · Event Dessert Consultation 60min/$50 Stacy · Bulk Order Pickup Window 15min/free round-robin · Wholesale Sample Meeting 30min/free round-robin). Calendar Group for round-robin (Stacy primary / Josh backup). Deposit payments wired via Stripe. `custom_values.booking_link` populated (Section 2 placeholder resolved).
  - **Section 11** (Reputation Management): GBP claim as Step 1 (Stacy/Josh action; postcard 5-14 day wait). Reviews AI tiered mode (Auto-Pilot 4-5⭐ · Suggestive ≤3⭐ · Negative escalation 1-2⭐). Review Request templates drafted with Brand Voice. 70/30 Google/Facebook balancing. Review Widget for Section 17. `custom_values.review_link` populated.
  - **Section 12** (Workflows: Appointment + Purchase): 4 workflows in new "Appointment & Purchase" folder. W#1 Appointment Confirmation with service-specific reminder branching. W#2 Post-Purchase Thank-You with first-purchase branching. W#3 Review Request with negative-feedback gating + preferred-channel routing. W#4 Negative Feedback Handler with owner escalation + 7-day recovery checkpoint + 14-day escalation.
  - **Section 14** (Workflows: Commerce + Missed-Call): 3 workflows in "Commerce & Recovery" folder. W#9 Abandoned Cart custom workflow (since native E-com abandoned-cart doesn't cover funnels). W#10 GBP Review Response Routing (tiered by rating). W#11 Missed-Call Text-Back Smart (office-hours vs after-hours branching; supplements Section 4's static reply).
  - **Section 15** (Invoices + Payment Links + Contracts): 3 invoice templates (Retail · Catering/Event w/ 50-50 deposit · Wholesale Monthly Subscription). 5 Payment Links (Custom Cake Deposit $25 · Event Deposit $50 · Bulk Order Quick-Pay · Product-Specific · Gift Card stub). Catering Contract v1 with e-sign + auto-generate-deposit-invoice-on-signature. Automated invoice reminders (3d · 1d · due · 3d overdue · 7d overdue). Legal-review flagged for contract terms.
  - **Section 16** (Gift Cards): Gift Cards module enabled. Product created with 3 denominations ($25/$50/$100) + custom + terms + artwork. 4 sale surfaces (checkout link · embed · QR · add-to-checkout). Send Gift Card flow documented. Redemption flow (online + in-person). Seasonal campaign scaffolding (Mother's Day · Valentine's · Christmas · Birthday). Oklahoma compliance note (no-expiry default for safety).
  - **Section 17** (Website + Funnel + Blog) — **MANDATORY CHECK-IN**: 8-page website (Home · About · Order · Contact · Privacy · Terms · SMS Opt-In · Blog). All upstream embeds (forms · chat · review widget · gift card · payment links · booking links). Privacy + ToS + Opt-In drafts (legal-review-needed). 3 starter blog posts. SEO + GA4 + GSC setup. Cutover plan: proposed Monday 2026-04-27, 6am CT — aligns with A2P Brand approval window (2026-04-24 to 2026-04-28). Phone cutover: 224 → OKC LC number via `{{custom_values.business_phone}}` + Option A 90-day call-forward disposition.
- Observations:
  - Section 17 mandatory check-in content is the critical-path synchronization point: production URLs going live enables Campaign Registration submission; Brand must be approved first; target is same-day sequence on 2026-04-27 (site publish + Brand approved + Campaign submission fires). 2026-04-30 or early May = SMS fully unlocked.
  - Section 12 Workflow #3 Review Request gating on `behavior:negative-feedback` tag is the single highest-risk automation — wrong customer gets a public-review request after flagging private dissatisfaction. Defensive double-check at enrollment + at action-execution.
  - Section 14 Workflow #11 Missed-Call Text-Back + Section 4 Sub-Account setting interaction requires explicit verification (Step 2) to prevent duplicate texts to the customer. Flagged for live-session test at cutover.
  - Section 15 Catering Contract auto-generate-deposit-invoice-on-signature is the single biggest operator-time-saver in the commerce suite — removes a "signed but didn't send invoice" error class entirely.
  - Section 16 Oklahoma gift-card expiry compliance (no-expiry default) is a legal-safe choice; CPA/attorney verify at Section 21.
  - Legal-review items accumulating for Section 21 pre-launch: Privacy Policy · Terms of Service · Catering Contract · Sales Tax rate · Gift Card state compliance. Consolidated list for Stacy/Josh's attorney visit.
- Hypotheses:
  - Section 17 cutover on 2026-04-27 executes cleanly if Brand approval lands 2026-04-24 to 2026-04-28. If Brand approval slips past 2026-04-28, delay Campaign submission (not cutover); site can go live with SMS features queued.
  - Blog SEO momentum won't materialize before Month 3-4; starter 3 posts + cadence of 1-2/month is sufficient foundation.
  - Gift Cards won't drive meaningful revenue pre-Mother's-Day 2026 campaign (May 2026 — only 2 weeks post-launch). First real Gift Card revenue spike is Christmas 2026.
- Corrections: None in this cycle.
- Next: Deliver Sections 9-17 batch with Section 17 mandatory check-in. On Dan approval, proceed through Sections 19, 20, 21 without further check-ins.

### 2026-04-19 — Q-batch resolved — Batch 1 delivered (Sections 3/5/10 updated, Section 7 written, Section 9 appointment proposal + Section 19 account confirm)

- Goal: Execute Dan + Claude Chat's post-Q-batch directive. Update intake-driven sections, write next unblocked section, surface one structural check-in for Section 9 appointment types. A2P Brand Registration clock starts today (Path A Standard, LLC + EIN >90 days, no rejection risk).
- Actions:
  - **Brand extraction:** WebFetch of `caramelovenokc.com` returned substantive brand material. Tagline "Sweets, Treats, and More" · mother-son ownership (Stacy + Josh) · Mission America Veteran partnership · plain-spoken voice · vocabulary that already avoids "artisanal/curated/delight" (matches our Section 5 avoid-list). Social accounts confirmed: Facebook (page ID 61580049856247) · Instagram @caramelovenokc · TikTok @caramel.oven.okc — Q7 mini-followup answered.
  - **Site-observation flag:** phone on site is 224.303.8897 (Chicago area code, business is OKC). Likely legacy personal line. Business will route to new LC Phone number from Section 4. Dan to decide whether to update site at cutover or earlier.
  - **Section 3 rewrite:** replaced carameloven.com → caramelovenokc.com globally; Path B locked as the operating plan (site is live on GoDaddy Website Builder); added GoDaddy-specific DNS notes (Host field "@" vs subdomain prefix, TTL behavior, subdomain suffix auto-append gotcha); preserved root domain A record for existing live site; documented cutover window at Section 17 completion. Archived Path A/C/D references.
  - **Section 5 Brand Voice + Brand Board update:** §5.2 restructured as URL-method-recommended (use caramelovenokc.com as source for HighLevel's Brand Voice auto-extraction); retained Text-method fallback with validated site-derived description (mother-son framing, Mission America Veteran partnership, vocab IN/OUT list). §4.5 replaced "[PLACEHOLDER]" branding with "Caramel Oven v1" first-pass Brand Board (site logo IMG_2037.png + warm-tone palette + Inter/Playfair Display recommendation). Dependencies line updated: Q9 RESOLVED 2026-04-19.
  - **Section 10 update:** §5.3 "Q6 still pending" replaced with "Q6 final answer: single-contact — Companies DEFERRED (FINAL)"; default architecture (`contact.company_name` + `segment:b2b-wholesale` + `opportunity.wholesale_account_type`) locked. Step 5 heading updated to reflect resolution. Completion criteria and status notation updated.
  - **Section 7 written:** full section covering Stripe account creation (Stacy/Josh action, Step 1 because Q3 = no existing account), OAuth connection, Oklahoma sales tax configuration (8.625% OKC rate with CPA-verify disclaimer), Products catalog with retail baseline (Salted Caramels box-of-6/12, Signature Chocolate Chip Cookies half-dozen/dozen, Sugar Cookies, Gift Box mixed sweets) + custom/catering tiers + wholesale tier scaffolding, payment method display config (Card + Apple Pay + Google Pay + ACH Debit for wholesale), end-to-end test-transaction smoke test. Step 4.5 explicitly defers Gift Cards to Section 16 to preserve native-module tracking.
  - **Section 9 appointment-type proposal draft prepared** for surface in this batch (per structural-check-in protocol — 4 proposed starter appointment types).
  - **Section 19 social accounts:** confirmed from site extraction without separate Q7 follow-up needed. Three platforms active: FB, IG (@caramelovenokc), TikTok (@caramel.oven.okc). Default build plan: connect all three via Social Planner; defer active cadence decisions to post-launch per Dan's Q7 guidance.
- Observations:
  - Caramel Oven's existing voice ALREADY avoids "artisanal / curated / delight" — Section 5's avoid-list was prescient, not prescriptive. The site extraction validates Claude Chat's original suggestion to remove the artisanal self-ban (they don't use it anyway).
  - Mother-son framing is meaningfully different from the husband-wife assumption that much of the earlier guide prose implied. Workflow email drafts that reference "Stacy or Josh" still work; any prose that implies "partners" or "spouses" should be audited at template polish time.
  - The 224 area code phone is a notable operational wart. Two paths: (a) at the Section 17 site cutover, also update the site's phone to the new OKC-local LC number, OR (b) keep 224 as a legacy line that rings through to Josh's mobile; surface new LC number as primary at all other touchpoints. Defer decision to Dan.
  - Oklahoma sales tax is layered (state + county + city) and varies by exact delivery address. Section 7 uses 8.625% as estimate but locks a CPA-verify disclaimer — Dan flags this to Stacy/Josh as a pre-launch item.
- Hypotheses:
  - Stripe approval for Caramel Oven LLC should be instant-to-2-business-days given clean documentation. Doesn't block Section 9/11 writes (those execute in parallel).
  - A2P Brand Registration carrier clock running from 2026-04-19 → Brand approval expected 2026-04-24 to 2026-04-28 (3-7 business days). Campaign Registration submission gates on Section 17 completion per Dan's directive.
  - Section 9 appointment-type proposal likely approves as-drafted with minor tweaks — the 4 types map cleanly to Caramel Oven's business model.
- Corrections: None in this cycle.
- Next: Deliver Batch 1 to Dan. Surface Section 9 appointment-type proposal as structural check-in. On approval, proceed to Batch 2 (Sections 9 + 11 + 12).

### 2026-04-17 — Priority queue execution — Sections 12/14 pre-research + Client Onboarding Script + Intake Questionnaire + API Appendix

- Goal: Execute Dan + Claude Chat's reordered priority queue while pipeline waits on Q-batch. P1 pre-research for Sections 12/14 → P2 Client Onboarding Script + companion Intake Questionnaire → P3 API Appendix scaffold.
- Actions:
  - **P1 — Sections 12/14 Pre-Research:** 8 WebFetches targeting workflow-specific articles. 7 returned substantial content; 1 (Database Reactivation 48001162999) returned insufficient body. Consolidated findings in `SECTIONS_12_14_PRERESEARCH.md`:
    - Book Appointment action (155000004209) — date-format constraints, Override Availability toggle, branching on success/failure.
    - Payment Received trigger (48001238334) — covers invoices + funnels + calendars + text2pay; filterable by source/sub-source/transaction-type/product/status/amount; rich data exposure.
    - Reviews AI (155000001074) — Suggestive mode ($0.01 after 3 free generations) vs Auto-Pilot (fully automated, per-star-rating customizable). Gap: negative-review handling not explicit in docs; UI-VERIFY flag.
    - Review Received trigger (155000003873) — contactless trigger exposing rating/source/spam status; rating-based branching patterns.
    - Review Request Balancing (155000004137) — weighted percentage distribution Google/Facebook; applies to OUTGOING review requests; doesn't interact with incoming-review workflows.
    - Payment triggers (155000002213) — Subscription (create/trial-to-active/cancel) + Refund (success/fail/amount/source) triggers; Stripe/Authorize.net/NMI; PayPal limited.
    - Abandoned Checkout (155000001718) — STORE-only native; Funnel/Website forms need custom workflow. Single-notification limit per abandonment. Custom workflow path documented.
    - Database Reactivation (48001162999) — article body unavailable. Existing Section 13 Dormant Reactivation pattern adequately covers.
  - Pre-research doc maps 6 workflows (W#1 Appointment Confirm / W#2 Post-Purchase / W#3 Review Request / W#4 Negative Feedback / W#9 Abandoned Cart / W#10 GBP Review Response) to their dependency-blocking sections: Section 11 (Q4) unblocks 3 of 6; Section 7 (Q3) unblocks 2 of 6. **Priority insight: Q4 answer should move fastest on Stacy/Josh side.**
  - **P2 — Client Onboarding Script:** Wrote `CLIENT_ONBOARDING_SCRIPT.md` (~1100 words). PitchBlack-facing sales narrative: Opening Hook (scattered-tools framing) · What Gets Installed (unified customer database, automated follow-up, review requests, sales pipelines, forms/chat/payments/invoices/contracts/gift cards, dashboard) · Timeline (2-4 weeks with Week 1-4 breakdown) · Division of Labor (PitchBlack does / You do) · Pricing Framing (setup + monthly; no specific numbers) · CTA (complete Intake Questionnaire). 4 deployment variants (Loom video / PDF / email one-pager / live-conversation talking points). What-not-to-say guardrails (avoid "marketing agency," "turnkey," lead-with-AI, vague productivity claims). Vertical-adaptation notes for home services, wellness, boutique retail.
  - **P2 companion — Intake Questionnaire:** Wrote `PITCHBLACK_INTAKE_QUESTIONNAIRE.md` (~1400 words). Generalized vertical-agnostic. 15 questions across 5 sections (About your business · Existing tools · Brand + voice · Scope + priorities · Logistics). 30-minute estimated completion. Field-mapping table to Caramel Oven's Q1-Q10 intake for internal use. Deployment recommendations (Tally / Airtable Forms) with webhook-to-HighLevel auto-Contact-creation pattern. Script + Questionnaire deploy as single asset per Dan's directive — script CTA links to questionnaire.
  - **P3 — API Appendix Scaffold:** Wrote `API_APPENDIX_SCAFFOLD.md` (~900 words). Orientation-level reference to V2 API (base URL `services.leadconnectorhq.com`, OAuth 2.0 + Private Integration Tokens, rate limits 100/10s burst 200K/day, 50+ webhook events, resource groups, SDK pointer). V1 EoS 2025-12-31 migration notes. When-to-use-API decision framework. PitchBlack engagement policy (small integrations in Growth-tier; medium+ separately quoted). References to canonical `marketplace.gohighlevel.com/docs/`.
- Observations:
  - Sections 12/14 pre-research surfaced that **Section 11 (Reputation, Q4) is the highest-leverage intake unlock** — 3 of 6 remaining workflows depend on it, plus Section 17 (Website review widget). Flagging for Dan's Stacy/Josh outreach prioritization.
  - Client Onboarding Script's "what PitchBlack does vs. what you do" section is the cleanest part — explicit boundary framing prevents scope-creep expectations that kill Growth-tier profitability. Worth watching for client-side feedback on which boundary items surprise them.
  - Intake Questionnaire's 15-question count is probably 2-3 questions too many for optimal completion rate. Can trim §3.2 (brand voice paragraph) to "a few tone words" and move §3.3 (menu upload) to post-submission. Deferring trim until deployment data suggests drop-off.
  - API Appendix scaffold deliberately positions PitchBlack as NOT leading with API work — reserves it for genuine engineering scenarios. Keeps the Growth-tier scope tight.
- Hypotheses:
  - Q-batch return from Stacy/Josh may produce Q1 + Q2 fast (single-fact answers) and Q4 + Q9 slower (GBP claim status + brand assets require work). Plan accordingly: Section 4 Brand Registration submission unblocks on Q1; Section 3 domain connect unblocks on Q2; Section 11 + Section 5 final unlock on Q4 + Q9.
  - Andreas Bastidas prospect conversion (per Dan's note) could accelerate if Onboarding Script + Questionnaire go live before the Caramel Oven Case Study has real 30-day data. The script is designed for pre-Case-Study use; Case Study becomes a Month-3+ supplement.
  - Operator Playbook (deferred Priority 4) natural write-time is post-Sections-9/11/15 approval. Expected earliest: Week 3-4 of the Caramel Oven build (real execution, not just docs).
- Corrections: None in this cycle.
- Next: Surface completion of all three priorities + pre-research. Standing by for Q-batch return or structural surfaces during prep.

### 2026-04-17 — Phase 5 prep — Update Protocol + Case Study scaffold + Snapshot Packaging playbook written

- Goal: Pivot to Phase 5 prep per Dan's "Proceed" directive while pipeline blocks on Q-batch return. Write three Phase 5 deliverables that don't require intake.
- Actions:
  - Wrote `UPDATE_PROTOCOL.md` (full doc, ~2000 words). Volatility map (high/medium/low velocity sections), monitoring cadence (daily VA skim → weekly triage → monthly Claude Code scan → quarterly Dan pass → annual rebuild), 5-signal detection playbook (article-date shifts · changelog posts · client UI reports · v-version deprecations · fee changes), refresh process, semantic versioning (v1.0 → v1.0.x patches → v1.X minor → vX.0 major), responsibility matrix. First application scheduled 2026-05-17.
  - Wrote `CASE_STUDY_SCAFFOLD.md` (template, ~2500 words). 8-section structure with [FILL POST-LAUNCH] markers for real-data sections. Executive summary template · Caramel Oven context (business + pains + why HighLevel) · the build (scope + timeline + what wasn't built) · illustrative flows (wholesale/catering/reviews/dormant) · results (30-day + 90-day metrics table) · operator testimonial template · "what this could look like for your business" with vertical adaptations (florist · coffee roaster · juice bar) · reusable Snapshot section. Metrics-to-track-now list for pre-launch baseline. Target publication T+30 to T+90.
  - Wrote `SNAPSHOT_PACKAGING_PLAYBOOK.md` (process doc, ~1500 words). What transfers in Snapshot (workflows/pipelines/calendars/tags/custom fields/forms/templates/Brand Board) vs what doesn't (contact data, integrations, phone numbers, domain, A2P registration). 5-step packaging process (sanitize → create → test-load → document → publish internally). Version lifecycle tied to Update Protocol (v1.0.x → v1.X → v2.0). Target execution T+30 from go-live. Marketplace distribution flagged for post-Client-3 strategic review.
- Observations:
  - Three deliverables are structurally different: Update Protocol is a fully-complete process doc (actionable now, no client data needed). Case Study Scaffold is a template with post-launch fill-ins. Snapshot Playbook is executable post-validation. All three remove dependencies from the Phase 5 completion path.
  - Snapshot Packaging explicitly commits to the 30-day validation wait. Tempting to package earlier for velocity; correct to wait so the Snapshot doesn't propagate untested workflows.
  - Vertical adaptation notes in Case Study Scaffold (florist · coffee roaster · juice bar) are a leading indicator of the Bakery Snapshot's multi-vertical applicability. Worth testing on Client 2 as a coffee roaster or florist rather than another bakery — strengthens the Snapshot's generalizability claim before Marketplace consideration.
  - Update Protocol identifies "first application 2026-05-17" — one month from now. This is a concrete scheduling commitment. Worth adding to Dan's calendar when we return to scheduling work in general.
- Hypotheses:
  - Q-batch from Stacy/Josh likely returns in 3-7 days (fast items: Q1/Q2; slower: Q9 brand assets). When it does, write-unblock will cascade through Sections 9, 11, 7, 15, 16, 17, 19, 20.
  - Expected post-intake batch order: Section 7 (Stripe/Products on Q3) → Section 9 (Calendars on Q5) → Section 11 (Reputation on Q4) → Section 12/14 (Workflows that depend on 9/11) → Section 15 (Invoices on 7) → Section 16 (Gift Cards on 15) → Section 17 (Website on 11/15/16) → Section 19 (Social on Q7) → Section 20 (Dashboards on all upstream) → Section 21 (Handoff).
- Corrections: None in this cycle.
- Next: Surface Phase 5 prep completion to Dan. Wait for Q-batch return to resume Phase 3 writing. If Q-batch is slow (>7 days), consider additional prep items: API Appendix chapter scaffold · Operator Playbook (the VA-handoff reference that aggregates Phase 3 sections into a flat operational guide) · maybe a Client Onboarding Script for how PitchBlack pitches Bakery-style clients.

### 2026-04-17 — Phase 3 — Sections 6+18 approved · Section 13 delivered (5 workflows, dormant-split judgment call) · Pipeline now blocked on Q-batch

- Goal: Deliver Section 13 with 5 Lead Nurture workflows (dormant-split judgment applied per Dan directive); surface the pipeline-blocked-on-intake state; prepare pivot to Phase 5 prep.
- Actions:
  - Wrote `SECTION_13_WORKFLOWS_LEAD_NURTURE.md` — 5 workflows fully specified with trigger/action trees + email + SMS copy drafts:
    - **W#1 New Lead Welcome** — Form submission trigger (any of 4 Section 8 forms); 5-min delay for enrichment; send welcome email (Stacy signoff, links to booking/menu); 3-day engagement check; SMS Day 3 nudge if no engagement; 7-day exit.
    - **W#2 Wholesale Lead Nurture** — Opportunity Created in Wholesale/Prospect stage; task-creation-assigned-to-Stacy + B2B intro email; 5-business-day check on Sample Sent stage transition; Day 7 nudge if no progress; 14-day final exit with Opportunity → Lost + `status:churned` on no response.
    - **W#3 Catering Inquiry Nurture** — Catering form OR Catering Opp created; 15-min enrichment wait; catering confirmation email with 3-step-process explanation; 24-hour check on consult-booked status; Day 1 SMS nudge; 48-hour check; Day 3 final email + personal-call task; 7-day exit with Opp → Lost on no response.
    - **W#4 B2C Dormant Reactivation (60-day)** — Trigger at 60-day silence on `segment:b2c-regular`; justification inline for 60 vs 90 (weekly cadence = 8-10 missed weekends; 90 is too late); "we miss you" email with seasonal-bake callout; 4-day engagement check; Day 4 SMS nudge; 14-day exit with `status:churned` on no response; re-enrollment gated at 180 days.
    - **W#5 Wholesale Check-In (cadence-aware)** — 5 sub-Smart-Lists per Order Frequency tier (Weekly 30d / Bi-weekly 45d / Monthly 75d / Quarterly 180d / Ad-hoc 180d); OR-union triggers; task-creation + internal notification; 2-business-day personal-outreach window for Stacy; B2B email check-in if still dormant; 7-business-day exit.
  - **Dormant split judgment documented inline** with full rationale: B2C tone + cadence diverges from B2B; shared workflow compromises both; separate workflows = each optimized for its audience.
  - **Catering Anniversary Reactivation** flagged as forward-pointer for Month 6+ (no data to trigger against yet; Caramel Oven hasn't served any catering events; build in Q4 2026 when data flows).
  - 5 new Smart Lists added to Step 6 (cadence-tier dormancy for W#5). Section 6's 12-list baseline grows to 17 post-Section-13.
  - 3 new tags introduced: `behavior:reactivation-attempt-active` · `behavior:reactivated` · `behavior:wholesale-reactivated`. Surfaced for optional formalization in Section 5 tag taxonomy.
- Observations:
  - Section 13 is the first workflow-heavy section. Pattern established: workflow-builder-orientation in Step 1 (reusable for Sections 12 and 14 when they come); per-workflow detailed spec in subsequent steps; test-and-publish in Step 7-8. Pattern translates cleanly to future workflow sections.
  - 60-day B2C threshold rationale is the cleanest piece of this section. Fixed on farmers-market-weekly-cadence math (8-10 missed weekends = 60 days). Transfers directly to other weekly-cadence businesses (coffee shop, florist, juice bar) when Caramel Oven becomes a Snapshot.
  - Wholesale Check-In cadence-awareness was the trickiest design decision. OR-union-of-Smart-Lists pattern is cleaner than single-Smart-List-with-complex-date-math; HighLevel's Smart List filter UX doesn't natively support "Last Activity > 2× custom-field cadence" math.
  - Section 13 can genuinely ship without A2P approved. SMS actions queue; fire when unlocked. Email actions work today (Section 3 done). Pattern holds: "build now, activate when upstream unblocks."
  - Pipeline is now materially blocked. Section 12 needs Section 11 (Q4). Section 14 needs Section 11 + Section 15 (Q3). Section 15 needs Section 7 (Q3). Section 9 needs Q5. Section 17 needs 11/15/16. Section 19 needs Q7. Nothing is fully unblocked.
  - Phase 5 prep is the right pivot per directive. Case study scaffold (Phase 5.1) + Update Protocol (Phase 5.2) both advance without intake input.
- Hypotheses:
  - Dan's Q-batch return from Stacy/Josh will likely arrive piecewise, not as a unit. Q1+Q1a (legal entity) and Q2 (domain) may come back fastest because they're single facts. Q9 (brand assets) takes longest because it requires file gathering. Q3 (Stripe), Q4 (GBP), Q5 (booking model), Q6 (wholesale structure) are medium.
  - As each Q answer arrives, the unblocked section can proceed. Parallel pipeline resumes. Dan may want to batch-write 2-3 sections per answer-batch.
  - Phase 5 prep is a 1-2 hour exercise. Case study scaffold ≈ 500-800 words. Update Protocol ≈ 1500-2000 words.
- Corrections: None in this cycle.
- Next: Deliver Section 13. Immediately after delivery, pivot to Phase 5 prep (Update Protocol full write + Case Study scaffold). Surface any structural / platform-irreversible flags during Phase 5 prep.

### 2026-04-17 — Phase 3 — Sections 5/8/10 batch approved · 2 fixes applied · Sections 6+18 batch-delivered

- Goal: Apply two Section 5/8 fixes from batch review; write Section 6 + Section 18 under continued expanded autonomy; ship as a new batch.
- Actions:
  - **Fix 1 (Section 5 Brand Voice):** removed the "artisanal" self-descriptor ban from the placeholder voice description. New closing line: "We do not use 'delight' or 'curated' — those are labels that chains slap on products; we let our baking speak for itself." Keeps the self-congratulation caution without the internal contradiction Dan + Claude Chat flagged.
  - **Fix 2 (Section 8 NPS routing):** Overridden per batch directive. New logic:
    - NPS 9-10 → display review-request message + button + tag `interest:review-eligible` (Workflow #3 trigger).
    - NPS 7-8 → brief thank-you message (no follow-up CTA) + tag `behavior:passive-feedback` + internal owner notification to Stacy/Josh. No automated customer-facing workflow. Personal outreach is the move.
    - NPS 0-6 → "Stacy will personally reach out" message + tag `behavior:negative-feedback` (Workflow #4 trigger) + internal owner notification. Workflow handles operational follow-through (task creation, review-request auto-pause); owners handle the human side.
    - Rationale captured in Step 4.1 Conditional Logic block so future-VA-onboardees see the reasoning inline.
  - Additional research: Importing Contacts CSV (155000004432) — Contacts → Import Contacts toolbar; required minimum = one of email/phone/(firstName+lastName); manual field mapping required; tag-apply-during-import in Step 5 of wizard; dedup order Contact ID → Email → Phone; Smart List creation optional on final step; 30 MB CSV limit; CSV only (no XLSX). Blog Content AI outline (48001236120) — Sites → Blogs → New Post → Content AI; 3 output types (Outline / Introduction / Specific Section); predefined tones list (funny, casual, excited, professional, witty, etc.); Brand Voice integration NOT confirmed in blog editor surface — manual tone/voice pass may be needed.
  - Wrote `SECTION_06_CONTACTS_IMPORT_SMART_LISTS.md` — 6 steps. CSV prep outside HighLevel (header standardization, data cleaning, multi-select formatting, size/format constraints), import + tag application + dedup resolution, 12 foundational Smart Lists (New Leads 7d / Active Customers / Farmers Market Regulars / Wholesale / Catering No-Close / Dormant 90d / Recent Buyers 30d / Review Eligible / Negative Feedback Flagged / Passive Feedback Flagged / SMS Subscribers / VIP), LC Email warmup coordination (explicit 4-8 week ramp based on list size), verification.
  - Wrote `SECTION_18_CONTENT_AI_SETUP.md` — 7 steps. Brand Voice activation confirmation, Content AI tests across 3 surfaces (Social Planner IG/FB/LinkedIn · Email Builder promo + newsletter contexts · Blog outline→intro→section flow), operator prompt-pattern guide (5 patterns: Event Announcement · Behind-the-Scenes · Promotional Email · Newsletter · Recipe Blog), pricing expectation doc ($0.50-$1.00/mo realistic bakery usage), `custom_values.content_ai_guidelines` update.
- Observations:
  - Fix 1 surfaced an interesting craft question: can a Brand Voice be "artisanal" without using the word "artisanal"? Answer: yes — tone ≠ vocabulary. Dan + Claude Chat caught the contradiction cleanly. Fix replaces the word-ban with a positional reframing ("labels chains slap on products" — attacks marketing-speak, not the quality concept).
  - Fix 2's 7-8 passive-zone handling is a strategic bet: Caramel Oven's moat is personal relationships, so the system actively PREVENTS automation in the zone where owners can still recover the relationship. Most SaaS playbooks automate everything — this one deliberately leaves a gap for human judgment. Document the pattern for future clients in similar industries (boutique/artisan/owner-operated).
  - Section 6 CSV-prep work (Step 1) is the bulkiest operator lift in Phase 3 so far — 10-15 minutes just on data cleanup before the HighLevel importer opens. Flagged in the estimated-time range.
  - Section 18 Brand Voice integration with Blog Content AI is an open question — HighLevel docs suggest Brand Voice flows into Social Planner, Email Builder, and Funnels & Websites explicitly, but Blog may be a separate surface with only predefined tones. Worth a Phase 5.2 Update Protocol check: does Brand Voice integration extend to Blog?
- Hypotheses:
  - Section 7 (Stripe + Products) is the next realistic hard blocker — needs Q3 (existing Stripe account). When Q-batch returns, Section 7 + Section 15 (Invoices/Payment Links/Contracts) + Section 16 (Gift Cards) unlock together.
  - Section 11 (Reputation Management) needs Q4 (GBP status). Also in the same batch-unlock.
  - Remaining unblocked work after Sections 6+18: nothing fully ready. Sections 9, 11, 17, 19, 20 all have at least one blocker. The Stacy/Josh intake-batch return is the next major velocity unblocker.
- Corrections: None beyond the two explicit fixes.
- Next: Deliver Sections 6+18 as a batch. Note to Dan: after this batch, pipeline is effectively WAITING ON INTAKE BATCH RETURN. Pre-sequence research for Section 7/11/15/16/17/19 could happen but writing can't proceed without Q3/Q4/Q5/Q7/Q9 answers. Will surface this state explicitly.

### 2026-04-17 — Phase 3 — Section 4 shipped (ship-it) · EXPANDED AUTONOMY granted · Sections 5/8/10 batch-delivered

- Goal: Ship Section 4 without re-review; under expanded-autonomy directive from Dan + Claude Chat, execute Sections 5/8/10 in parallel and deliver as a batch. Campaign submission timing locked to post-Section 17. Q1/Q1a/Q2 logged for Stacy/Josh intake.
- Actions:
  - Section 4 shipped as delivered. No edits.
  - Additional research for Section 8: Enhanced Form Builder (155000002951) — focused on layout flexibility (single column / two column / single line / field width %), didn't cover full UI navigation or field inventory (gaps noted). Conditional Logic V2 (155000001314) — 5-step setup, operators by field type, actions (redirect / display / disqualify / show-hide / jump to slide), top-down execution with later matches overriding earlier; rule count limit not documented. Payment in Forms (155000001884) — payment element in Integrations section, supported providers via connected gateways (Stripe/Authorize.net/NMI), one-time + recurring support (weekly/monthly/yearly for recurring donations), donation mode with up to 15 suggested amounts.
  - Wrote `SECTION_05_CUSTOM_FIELDS_TAGS_BRAND.md` — 6 steps + completion criteria. 10 Contact Custom Fields (Dietary Preferences · Favorite Product · Customer Type · Preferred Contact Channel · Preferred Pickup Location · Source Detail · Birthday · Anniversary · Loyalty Points · Internal Notes). 8 Opportunity Custom Fields (Event Date · Guest Count · Quoted Amount · Deposit Amount · Deposit Status · Wholesale Account Type · Order Frequency · Sample Status). Tag taxonomy with `category:value` convention: 5 categories (source · segment · status · behavior · interest), ~20 baseline tags seeded. Brand Board at Marketing → Brand Boards with placeholder palette (Caramel Crust #8B4513 · Wheat #F5DEB3 · Linen #FAF0E6). Brand Voice placeholder description (warm, artisanal, unpretentious, Stacy-or-Josh signoff, no exclamation marks, no 'delight' or 'curated'). Marked PROVISIONAL-pending-Q9 for Brand Board + Voice.
  - Wrote `SECTION_08_FORMS_CHAT_WIDGET.md` — 6 steps. Four forms: Lead Capture (3-4 fields) · Custom Order Inquiry (10 fields + conditional logic for Wedding/Corporate branching) · Catering Inquiry (15 fields with Company Name → Wholesale routing) · Feedback Survey (NPS 0-10 + conditional routing: ≥9 → review request, ≤6 → negative feedback, 7-8 passive). All forms map to Custom Fields from Section 5 and apply source/status/segment/interest tags on submission. Chat Widget configured as All-In-One type with Brand Board styling + office hours from `{{custom_values.business_hours}}` + pre-chat contact form + business-hours-aware auto-reply messaging.
  - Wrote `SECTION_10_PIPELINES_OPPORTUNITIES.md` — 7 steps. Pipeline A (Wholesale Onboarding): 5 stages (Prospect → Sample Sent → Price Agreed → First Order → Recurring). Pipeline B (Catering): 6 stages (Inquiry → Consult Booked → Quote Sent → Deposit Received → Event Delivered → Follow-up). Opportunity Custom Fields wired (per-pipeline field-usage mapping table). Multiple Opportunities per Contact per Pipeline enabled. Owner-decoupled from Contact owner. Demo Opportunities seeded + cleaned up as verification. Companies module: defaulted to DEFER pending Q6; reactivation path documented if Q6 returns multi-contact answer.
- Observations:
  - Expanded autonomy mode is a materially different cadence. Batch delivery preserves velocity but compresses review iteration; if a systemic issue exists across multiple sections, it compounds before being caught. Mitigation: surface structural decisions prominently at batch head.
  - Tag taxonomy `category:value` convention is a discipline choice, not a HighLevel pattern. Captured as an assumption for Dan to validate.
  - Conditional Logic V2 research surfaced a useful pattern: form fields can be conditionally hidden based on field values, with "jump to slide" and "disqualify" actions supporting multi-path flows. Caramel Oven's Custom Order form exploits this (Wedding → Venue City; Corporate → Company Name; >50 guests → disclaimer).
  - Chat Widget's Business Office Hours behavior (in-hours vs after-hours reply) is a nice operational touch; uses the `business_hours` Custom Value from Section 2, which keeps the text editable without touching the widget config.
  - Pipeline stages carried forward verbatim from Phase 3 sequence proposal — Dan + Claude Chat already approved them in principle.
- Hypotheses:
  - Dan may adjust tag taxonomy (`category:value` → flat tags, or rename categories) — low-risk change that propagates via Smart List rebuild.
  - Companies activation likely stays deferred even if Q6 returns ambiguous — single-contact tracking + `company_name` native field + `segment:b2b-wholesale` tag combo handles ~80% of bakery wholesale cases.
  - Feedback Survey routing (NPS ≥9 → review, ≤6 → negative-feedback) may need tuning — passive zone 7-8 gets no automation; Dan may want a middle path.
- Corrections: None in this cycle.
- Next: Deliver Sections 5/8/10 batch in conversation. While awaiting review, begin parallel research for Section 6 (Contacts Import & Smart Lists) — already at 🟢 with existing Contacts research; can write immediately on Section 5 approval since Section 5 unblocks Section 6 (tags + custom fields are now in place).

### 2026-04-17 — Phase 3 — Section 3 approved (ship-it) · Section 4 delivered dual-path · Section 5 research complete

- Goal: Ship Section 3 without re-review delay; write Section 4 with Standard + Sole Proprietor dual-path architecture per Dan's velocity directive; complete Section 5 research (Custom Fields · Tags · Brand Board · Brand Voice).
- Actions:
  - Section 3 shipped. No edits. Approved approach: document Path A (domain owned, not connected to live site) as the default Intake Document assumption; branch later if Q2 returns B/C/D.
  - Wrote `SECTION_04_LC_PHONE_A2P.md` — 9 steps with dual-path architecture:
    - Steps 1-4 + 6-9 are Q1-AGNOSTIC (can execute now): LC Phone purchase · Verified Caller ID + Number Intelligence + Call Forwarding · Missed-Call Text-Back config · A2P Brand materials prep (shared + both paths) · A2P Campaign materials prep (use case, 2 literal-text sample messages without merge fields, opt-in docs, Privacy/ToS 6-bullet template) · Campaign submission after Brand approval · 8-level SMS ramp plan (100→5,000 daily) · SMS launch checklist.
    - Step 5 is Q1-DEPENDENT: Decision tree dispatches to Path A (Standard Brand, EIN-based) OR Path B (Sole Proprietor Brand, Persona KYC identity verification). Materials pre-built for both; submission fires the moment Q1 returns.
  - Explicit call-outs in Section 4: 3-7 business-day Brand vetting + 1-3 business-day Campaign review = 4-10 business day unavoidable wait. During that wait, Sections 5/8/10 continue. Brand-new EIN (<30 days) flagged as potential additional delay requiring Dan consultation.
  - A2P Campaign sample messages drafted using literal text (no merge fields) per rejection-reason avoidance: (a) Appointment reminder for "Sarah" for "March 15 at 2pm"; (b) Order pickup for "Sarah" at "Saturday Riverside Farmers Market." Both under 160 chars with sender ID + STOP language.
  - Privacy Policy / ToS language specified with the 6 required bullets per A2P Campaign Registration article (program name · description · frequency · msg+data rates · opt-out · carrier liability disclaimer).
  - Opt-In Form URL timing flagged: Section 17 (Website/Funnel) ships the actual URL; pre-submission uses placeholder with Dan decision point whether to submit Campaign pre- or post-Section-17 to avoid placeholder-URL rejection.
  - Section 5 parallel research completed (3 deep-reads):
    - How to Create a Brand Board (155000003136) — Marketing → Brand Boards → + Add Design Kit → template or blank → logos (up to 2) + colors (2-10) + fonts (1-5) + Brand Voice field. Multi-Brand-Board supported per sub-account. Retroactive color changes do NOT update existing designs.
    - Create Brand Voice from Text or URL (155000007263) — Marketing > Brand Boards > Brand Voice → + Add Brand Voice → Text-or-URL option → voice name + URL (About/Home page ideal) OR 50-100 word text description → Review auto-generated content → Save. Editable via three-dot menu; multiple voices per sub-account.
    - Brand Voice in Brand Boards (155000005085) — Brand Voice nested within Brand Boards; multiple per location; three-dot-menu → Set As Default; integrates with Content AI modal as selectable tone.
- Observations:
  - Dual-path architecture works cleanly for A2P Brand because the material gathering is ~95% shared — only the identity-verification mechanism differs (EIN submission vs Persona KYC). One extra prep document, zero extra procedural steps until Q1 returns.
  - Sample message rule — NO merge fields — was the single highest-risk rejection pattern. Section 4's explicit "Sarah / March 15 / 2pm / 123 Main St" literal-text examples lock the behavior into the playbook.
  - Brand Voice is ready for Section 5. The Text-or-URL creation method means if Q9 returns a Caramel Oven website URL, we can scrape it; if Q9 returns a 50-100 word description, we paste it. Either feeds Content AI (already 🟢 from earlier research).
  - Brand Board multi-support note: "Retroactive color changes do NOT update existing designs." Worth front-loading in Section 5 so the build locks colors before creating emails/funnels/forms. Otherwise we'd be revising templates post-color-change.
- Hypotheses:
  - Dan may choose to ship Campaign Registration POST-Section 17 to avoid placeholder-URL risk. That pushes SMS launch further right on the calendar. Alternative: host a simple "SMS Opt-In Terms" static page as an interim, submit Campaign immediately on Brand approval. This is a timing judgment call for Dan, not a structural question.
  - Section 5 is short-enough to fit in a single write cycle even with Q9 pending. Use a placeholder Brand Board (generic bakery palette) and overwrite when Q9 arrives.
- Corrections: None in this cycle.
- Next: Deliver Section 4 in conversation. During Section 4 review, begin Section 5 write using Brand Board + Brand Voice + Custom Fields + Tags research already captured.

### 2026-04-17 — Phase 3 — Section 2 approved · Section 3 delivered · Section 4 research complete

- Goal: Apply 6 Section 2 refinements from Dan + Claude Chat review; write/deliver Section 3; complete Section 4 parallel research.
- Actions:
  - Applied 6 Section 2 refinements via targeted Edits: (1) Section 3.4 Authorized Representative tightened with A2P-mismatch-rejection warning and registered-agent/member-manager language; (2) Sales Tax Jurisdiction added as 12th Custom Value (placeholder for Section 7); (3) DST transition note inserted in Section 3.5 with Section 21 QA pointer; (4) Step 6 user-creation verification changed to "form-reachability only, do not submit" to avoid plan-tier slot consumption; (5) 2FA-on-first-login requirement added to Step 5 with TOTP recommendation; (6) cross-reference note at end of Step 5 flagging Admin-permission stepdown consideration for Section 21. Baseline count updated 11→12 throughout; placeholder count 3→4.
  - Section 4 parallel research: 4 deep-reads completed.
    - LC Phone Messaging Policy (48001213941) — content prohibitions (alcohol/firearms/gambling/tobacco/adult), opt-in sourcing rules, 8-level ramp (100 → 5,000 daily), DND auto-flag on errors, 24-hour suspension at threshold breach.
    - SMS Deliverability Best Practices (155000000079) — 8 core practices (opt-out language, sender ID, number intelligence, branded URLs, A2P registration, web-form consent, opt-in disclosure, double opt-in); URL shortener prohibition (T-Mobile blocks cycling; AT&T blocks public shorteners); error-rate 0-6% ok / 6% warning / 10% suspension; opt-out rate 0-1% ok / 2% warning / 3% suspension.
    - A2P Campaign Registration (155000004539) — UI path Settings → Phone System → Trust Center → Brands & Campaigns → Campaigns → Create Campaign; required fields Messaging Use Case + Use Case Description + 2 Sample Messages + Opt-In Method + Opt-In Form URL + Opt-In Message (<160 char) + Privacy Policy + ToS (6 required bullets); $15.75 non-refundable one-time verification fee; $1.50-$12/mo recurring depending on use case; common rejection reasons enumerated.
    - A2P Brand Approval Best Practices (155000000508) — Standard path requires valid EIN + legal name matching IRS CP 575 exactly + registered address + entity type; Sole Proprietor requires different workflow awaiting LC Phone guidance; common rejections (DBA vs legal name, DUNS submitted for US, stock ticker mismatch); Secondary Vetting up to 7 business days; new EINs require 30-90 days from issue before Brand retry. Authorized Rep matching detail not in this article — deferred to live UX.
  - Wrote `SECTION_03_DOMAIN_LC_EMAIL.md` — 9 steps covering Q2-path routing (A/B/C/D scenarios), domain add to HighLevel, LC Email dedicated subdomain, SPF/DKIM/DMARC/CNAME/MX DNS records with exact host/value patterns and TTL guidance, DMARC phased rollout (weeks 1-2 p=none → 3-4 p=quarantine → 5+ p=reject), domain verification + SSL issuance, Preference Management enablement with irreversibility warning + 5 suggested categories (Newsletter · Promotions · Order Updates · Reviews · Wholesale/Catering), unsubscribe compliance, 4-week warmup schedule (50 → 250 → 1K → 5K → open), and test-send verification with SPF/DKIM/DMARC PASS header check. 4 UI-VERIFY flags embedded.
- Observations:
  - Section 3 is the first section where the step-by-step UX differs by intake answer (Q2 Path A/B/C/D routing). Section 1 Blocker Map design pays off — Q2 decision tree is transparent.
  - DMARC phased rollout (2 weeks p=none → 2 weeks p=quarantine → p=reject) is industry-standard but not HighLevel-branded guidance in the docs. Worth flagging in case Dan's Agency has a different house policy.
  - Preference Management irreversibility is a real operational risk — enabling it without thought is cheap; disabling later requires full sub-account rebuild. Warning is prominent in Section 3 Step 6.
  - 4-week warmup schedule is conservative. An alternative "aggressive" schedule would be 2 weeks, but the risk/reward favors conservative for a brand-new domain with a cold list.
  - Section 4 research surfaces: A2P Brand rejection reasons ALMOST ALL trace to Refinement 1's Authorized Representative warning — the carrier database cross-check is real, and the 7-business-day Secondary Vetting window means mistakes compound. Good catch from Claude Chat.
- Hypotheses:
  - Section 4 will be the first section with real "waiting on external approval" time cost. Guide will front-load "submit Brand registration on Day 1 of Section 4; don't wait for other sections."
  - SMS ramp (100 → 5,000 daily over 8 levels) runs in parallel with email ramp — two independent warmup tracks. Guide will document them together in a reference table.
- Corrections: None in this cycle.
- Next: Deliver Section 3 in conversation for review. During Section 3 review cycle, Section 4 research is already complete — can write Section 4 immediately on Section 3 approval.

### 2026-04-17 — Phase 3 — Section 1 approved · Section 2 delivered · Section 3 parallel-research started

- Goal: Incorporate four Section 1 adjustments; add MCP Server scope-note to STRATEGIC_FUTURE; write and deliver Section 2; begin parallel Section 3 research.
- Actions:
  - Applied four Section 1 edits: (1) VA persona aspirational-note inserted in "Who you are"; (2) Q7 tightened ("currently post to at least monthly" + admin-level specificity); (3) Q1 soft deadline + 3-7 business-day A2P expectation set in email template body; (4) Step 1.5 chase cadence (Day 0 send → Day 3 alternate channel → Day 6 escalate to Dan).
  - Added MCP Server explicit scope-call to STRATEGIC_FUTURE.md §2: OUT OF SCOPE for Caramel Oven; strategic-future relevance for multi-client AI-managed HighLevel ops; trigger points updated to include Client 5+ onboarding and Life Narration use cases.
  - Wrote `SECTION_02_SUBACCOUNT_BUSINESS_PROFILE.md` — 6 steps, Business Profile fields across 7 sub-pages (General Info · Physical Address · Business Info · Authorized Rep · General Settings · Logo · Deprecated/Deduplication), Custom Values baseline table (11 entries with placeholder strategy), sub-account user creation, verification handoff.
  - Section 2 research completed: Business Profile Settings folder (155000001301) — 9 articles inventoried · Custom Values (155000004705) → 🟢 · Location ID article (48001204848) already read. Sub-area for Section 2 at 🟢.
  - Section 3 parallel research kicked off: Email Deliverability Intro (48001063371) read — general framing, no DNS specifics in that article; Preference Management (155000007291) read — Labs feature, one-way activation, 100-char category limit, automatic campaign filtering once assigned. DMARC article ID captured (48001224630). DNS Record article ID captured (155000002220). Dedicated Sending Domain overview (48001226115) also captured as bonus for Section 3.
- Observations:
  - Section 1 edits were surgical — no restructure needed, four targeted Edit operations.
  - Section 2 surfaced the placeholder strategy for Custom Values as a real pattern (Approach A visible placeholders vs. Approach B blank). Approach A is the clear winner for anyone reviewing templates during the build — blank renders ugly, `[booking link — to be set in Section 9]` is self-documenting.
  - Business Profile has 7 sub-pages. The Business Profile Settings folder (9 articles) mostly maps 1:1 but there are a couple of articles (Deprecated Features Enable/Disable, Contact Deduplication) that don't fit the "identity" mental model. They're settings for the sub-account, not pieces of its identity. Guide handles them in Step 3.7 as minor-but-non-obvious.
  - Section 3 article-ID capture: DMARC (48001224630), DNS Record (155000002220), Connecting Your Domain (155000005132), Dedicated Sending Domain (48001226115), Setting Up Whitelabel Domain (155000002561). Five articles to deep-read before Section 3 writes. Estimate: ~2 WebFetches remaining after the already-read Deliverability Intro and Preference Management.
- Hypotheses:
  - Section 3 will be the first section with real "deliverability horror story" risk — getting DMARC wrong here bites later. Guide will front-load the "set DMARC policy to p=none for first 4 weeks, then escalate to p=quarantine" strategy.
  - Approach A placeholder Custom Values may generalize — use `[placeholder — to be set in Section N]` as a pattern across the rest of the guide.
- Corrections: None in this cycle.
- Next: Deliver Section 2 in conversation for review. While awaiting Section 2 approval, continue Section 3 research — one WebFetch for DMARC article (48001224630) and one for DNS Record walkthrough (155000002220) to close Section 3 to 🟢.

### 2026-04-17 — Phase 3 begin — Sequence approved · Section 1 delivered · Section 2 parallel-research started

- Goal: Process Phase 3 sequence sign-off from Dan + Claude Chat; deliver Section 1 per directive 3.2; begin Section 2 parallel research.
- Actions:
  - Sequence approved with one addition: **§17.5 Ad Manager (OPTIONAL)** inserted between §17 Website and §18 Content AI. Confidence 🟡; depends on §5 Brand Board, §8 Forms, §17; blocked by Q7 social access; activation post-launch. Total sections: 22 (was 21).
  - Created `COWORK/PLATFORM_MASTERY/HIGHLEVEL/CARAMEL_OVEN_GUIDE/` directory.
  - Wrote `SECTION_01_PRE_BUILD_INTAKE.md` — the first Phase 3 guide section. VA-persona prose, 6 steps + completion criteria, Q1-Q10 email template, Asset Inventory checklist, Blocker Map (all 22 sections with §17.5), Scope Decision Log (IN / OPTIONAL / CONDITIONAL / OUT). Date header 2026-04-17; Update Protocol notice present.
  - Parallel-research for Section 2: deep-read Custom Values article (155000004705) → Settings > Custom Values; syntax `custom_values.[name_in_snake_case]`; auto-keyed from Name; folder-organized (no nesting); bulk actions supported. Edit behavior: Key stays stable when Name changes — operationally critical for guide prose. Custom Values sub-area upgraded 🟡 → 🟢 for Section 2.
- Observations:
  - Section 1 is unique in the sequence: it produces ZERO HighLevel UI changes. Everything happens outside the platform (shared docs for intake + inventory). This means no UI-VERIFY flags needed.
  - The Blocker Map in Section 1 mirrors the master Phase 3 sequence — any schedule adjustment to the sequence propagates via Section 1's table.
  - §17.5 insertion didn't change the downstream sequence; Content AI (§18) still comes after Ad Manager. Landing pages for ads can reuse forms from §8 and funnel pages from §17, so §17.5 depends cleanly on both.
  - Custom Values article is thin on use-case scope (doesn't enumerate all supported surfaces); partially offset by Merge Fields deep-read (48001078171) which covers template syntax broadly. Flag for Phase 3: confirm supported surfaces during Section 5 (Brand Board + Custom Values) live work.
- Hypotheses:
  - Section 2 will be the fastest section to write — most of the content is Business Profile form fields that map 1:1 to intake answers. Custom Values setup table is the only meaningful complexity.
  - The cadence will settle at ~1-2 sections per review cycle. If review lag is 24-48 hours per section, total Phase 3 writing calendar is ~3-4 weeks assuming zero major revisions.
- Corrections: None in this cycle.
- Next: Deliver Section 1 in the conversation for Dan → Claude Chat review. While awaiting approval, continue Section 2 prep: deep-read Sub-Account Settings overview + Business Profile Settings folder (155000001301).

### 2026-04-17 — Phase 2 — Joint review sign-off + adjustments incorporated

- Goal: Process Dan + Claude Chat's joint review of Phase 1. Incorporate adjustments. Prepare Phase 3 section-sequence proposal.
- Actions:
  - Ran four Phase 2 research pulls: (1) Restaurant/Bar playbook deep-read (155000000967) → thin; does not blueprint Caramel Oven build. (2) Content AI deep-reads (Social Planner 48001234788 · Email Builder 48001236751 · Brand Voice Integration 155000005308) → Content AI promoted to 🟢. (3) Marketplace V2 API homepage → `https://services.leadconnectorhq.com` base URL CONFIRMED. (4) Gift Cards folder (155000001419) inventory → 4 articles captured.
  - Created STRATEGIC_FUTURE.md (Eliza · MCP · Agent Studio · SaaS Mode · Industry Snapshot distribution · App Marketplace · Prospecting Tool — all logged as PitchBlack scaling surfaces out of Caramel Oven scope).
  - Created PHASE3_INTAKE_CHECKLIST.md (10 questions routed to Stacy/Josh — legal entity · domain · Stripe · GBP · booking model · wholesale scope · social access · existing list · brand assets · product catalog).
  - Updated ASSUMPTIONS.md: SC-1 APPROVED with Gift Cards IN SCOPE, Content AI IN SCOPE, 10-12 workflows enumerated, phased-rollout (c) approved. SC-2 RESOLVED (reader = VA, Dan reads in parallel, owner gets case study not guide). A-2 DEFERRED (no credit card — closes on Caramel Oven contract close). D-4 RESOLVED (Restaurant/Bar playbook read; thin). Dashboard updated with new statuses.
  - Updated SYNTHESIS.md: Phase 2 addendum banner added; §5.3 AI Employee section rewritten with Content AI operational detail + STRATEGIC_FUTURE redirect for Eliza/MCP; §8.1 Gift Cards entry promoted with inventory; §9.5 Industry Playbooks updated with Restaurant/Bar read finding.
  - Updated KNOWLEDGE_MAP.md: Phase 2 addendum banner added with confidence-reconciliation explanation; V2 API base URL confirmed in §4.4; Axis 4.7 added (14 URL modules → 11 functional domains mapping, with Reputation cross-cut noted per Phase 2 guidance); A-2 status updated in §4.3; B3 Companies, B4 CRM, I4 Agency Reporting promoted from 🔴 to 🟡 (narrative-level exists in SYNTHESIS); Content AI + Gift Cards folder chips upgraded to 🟢.
- Observations:
  - Phase 2 review was substantive — eight direct adjustments plus four guardrails. Cleanest signal that Dan + Claude Chat are operating as a real review panel, not rubber-stamping.
  - Restaurant/Bar playbook being thin is actually a STRENGTH: no pre-existing pattern library to defer to means the Caramel Oven build becomes the precedent. Phase 5.1 Snapshot packaging becomes the compounding asset for Client 2/3/4.
  - Content AI email pricing ($0.09 per 1,000 words · 500 free per sub-account) is operationally meaningful: a Caramel Oven sub-account drafting 10 emails × ~300 words = 3,000 words = ~$0.23 per batch. Not a cost concern for a solo operator.
  - 14 URL modules → 11 domains: cleanly collapses, with Reputation as the interesting cross-cut.
- Hypotheses:
  - Phase 3 section sequence is best organized into 6 "parts" of 3-4 sections each, matching build-order dependency chains: Foundation → Data Model & Channels → Scheduling & Pipelines → Automation Core → Monetization & Content → Visibility & Launch. Total ~21 sections.
  - JIT confidence-upgrade approach (Phase 2 approved) means each Phase 3 section triggers targeted 2-5 WebFetches as it's written. Cumulative Phase 3 research budget: ~30-50 additional deep reads.
  - Workflows depth (25-30 fetches per Phase 2 revision) maps to 3-5 fetches per workflow × 10-12 workflows.
- Corrections: None. Phase 2 review didn't surface any errors in Phase 1 output — only adjustments and guardrails.
- Next: Deliver Phase 3 section sequence proposal.

### 2026-04-18 — Phase 1.3-1.7 — Consolidation and Phase 1 delivery

- Goal: Convert raw ingestion into the three Phase 1 deliverables; signal completion.
- Actions: Wrote ARTICLE_INDEX.md (full article-title inventory across all ingested folders — ~480 unique article IDs captured from ~2,050 in folder counts, plus full structural enumeration of all 160+ sub-folders). Rewrote SYNTHESIS.md (11 functional-domain sections + orientation + changelog snapshot + ingestion dashboard; 17 deep-read articles summarized inline; confidence chips promoted per section). Rewrote KNOWLEDGE_MAP.md (confidence chips on every folder; Axis 4 System Architecture populated with tech stack + URL scheme + client-side state hypotheses + API surface + realtime surface). Rewrote ASSUMPTIONS.md (12 resolved flags + persistent open flags + honesty summary for Phase 2 reviewers).
- Observations: Writing synthesis surfaced one more correction worth flagging: my Phase 0 note that "HighLevel university" might be a separate surface was incomplete — University content is folded into the help-center under folder `/48000674647` (HighLevel How-To's, 19 articles) and `/155000000160` (Prospecting & Sales, 2 articles). No separate site.
- Hypotheses: The Phase 1 outputs are sufficient to support a Phase 2 review. The Caramel Oven scope list (SYNTHESIS / Axis Caramel Oven fit calls) and the scope assumption SC-1 in ASSUMPTIONS together surface the yes/no/optional decisions Dan + Claude Chat need to make before Phase 3 begins.
- Corrections: Upgraded Workflow scope (B-2) from PROVISIONAL to RESOLVED based on the "Copy Workflow across sub-accounts" article implying they are sub-account-scoped.
- Next: Deliver Phase 1 outputs to Dan. Signal "Phase 1 Complete — Ready for Review" per directive 1.6.


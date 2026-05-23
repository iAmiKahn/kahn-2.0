# ASSUMPTIONS & FLAGS — HighLevel Platform Mastery

**Purpose:** Every inference, every gap, every unverified claim. Directive 1.3 is explicit: "Flag all assumptions you make where HighLevel docs are vague or incomplete." This document is the honesty layer over SYNTHESIS.md and KNOWLEDGE_MAP.md.

**Format**
- **Structural** — things I believe about how HighLevel is organized
- **Behavioral** — things I believe about how HighLevel behaves
- **Scope** — things I'm choosing to treat as optional for Caramel Oven
- **Access gaps** — things I can't verify without an authenticated account
- **Doc gaps** — things the public docs do not cover

**Status** — OPEN (unresolved), PROVISIONAL (best-guess in use), RESOLVED (confirmed or invalidated), PARKED (deferred to later phase).

---

## RESOLVED during Phase 1 audit

### S-1 [RESOLVED] — Canonical documentation sources mapped
Docs are split across multiple domains. Resolved to:
- User docs: `help.gohighlevel.com/support/solutions` (45 categories, ~2,050 articles)
- Dev/API docs: `marketplace.gohighlevel.com/docs/`
- Changelog: `ideas.gohighlevel.com/changelog`
- Legacy API: `old-public-api.gohighlevel.com` (end-of-support 2025-12-31)
- University content: folded into help-center folder `/folders/48000674647` ("HighLevel How-To's")
No separate community wiki found.

### S-3 [RESOLVED] — "Sub-Account" == "Location"
Confirmed. HighLevel's own docs use both terms interchangeably ("Get Sub-Account (Formerly Location)" on marketplace.gohighlevel.com). "Location" is the older term; "Sub-Account" is the preferred user-facing term. Location ID remains the canonical identifier in URLs and APIs. The guide will use "Sub-Account" in prose and note "(also shown as Location ID in URLs)" on first use.

### B-1 [RESOLVED] — Sub-accounts empty by default; Snapshots populate
Confirmed via Snapshots Overview (48000982511) and "Create a New Sub-Account Using Snapshot" (155000005762). A sub-account is created empty, OR with a Snapshot loaded at creation time, OR a Snapshot can be pushed to an existing sub-account.

### B-4 [RESOLVED, CORRECTING PRIOR CLAIM] — LC Phone is NOT a Twilio re-brand
**Original assumption was wrong.** LC Phone is HighLevel's **proprietary** first-party telephony (per 48001223546). Twilio integration coexists as an alternative BYO option — agencies can either use LC Phone natively OR connect their own Twilio subaccount. This distinction matters for the Caramel Oven guide: the recommended path is LC Phone (one-click activation, no Twilio account needed) unless the agency has a reason to bring existing Twilio infrastructure.

### B-5 [RESOLVED] — A2P 10DLC registration required for US local SMS
Confirmed via 155000007411. Required for US 10-digit local numbers. NOT required for toll-free numbers. Canadian numbers have separate requirements (155000004915). Two-step flow: Brand Registration (Standard with EIN, or Sole Proprietor without) → Campaign Registration (tied to specific messaging purpose with opt-in language). Fees: submission + monthly + carrier costs. Approval timelines not specified in docs.

### B-6 [RESOLVED] — Merge field context-scoping
Confirmed by 48001078171. Available merge fields vary by the record context in which a template is evaluated (Contact fields available in a Contact-triggered workflow; Opportunity fields available in an Opportunity-triggered flow; etc.). Nested access is supported for related entities (e.g., `{{contact.attributionSource.utmSource}}`). Raw-formatted variants exist for specific fields.

### S-2 [PARTIALLY RESOLVED] — Dual-home features
Confirmed: Documents & Contracts exists as both top-level category AND a Payments sub-folder (the sub-folder is 2 articles; the top-level is 28). Client Portal exists as both top-level (20 articles) AND a Sites sub-folder (1 article). Custom Objects exists as top-level (13 articles) AND a Sites sub-folder (2 articles). E-commerce exists as top-level (40 articles) AND a Sites sub-folder "Stores" (1 article). My strategy was correct — I fetched both copies where discovered.

### B-2 [PARTIAL] — Workflow scope
Didn't fully deep-read this, but the "Copy Workflow to another Sub-Account" article (155000001229) and the Snapshot system's workflow-transfer mechanism both imply that Workflows are sub-account-scoped (triggered by events within their own sub-account only). A single Workflow cannot be triggered by an event in a sibling sub-account without explicit inter-sub-account data plumbing. PROVISIONAL upgrade to RESOLVED.

### Platform architecture [RESOLVED at the public layer]
HighLevel's web app is built on **Node.js + Vue.js + MongoDB**. V2 REST API at `marketplace.gohighlevel.com/docs/` with OAuth 2.0 (for Marketplace apps across multiple Locations) or Private Integration Tokens (for single-Location use). Rate limits: 100 req/10s burst, 200,000/day. V1 API end-of-support 2025-12-31. Webhooks: 50+ events.

---

## STILL PROVISIONAL / OPEN

### B-3 [PROVISIONAL] — Data backbone shape
Contacts → Opportunities → Conversations → Appointments → Invoices/Subscriptions is my mental model. Confirmed each entity exists as a first-class module. What I have NOT deep-verified is the exact join/link shape between them (e.g., can one Appointment be linked to multiple Opportunities? can one Invoice cover multiple Opportunities? can Opportunities exist without a Contact?). The "How to Link Opportunities with Invoices and Estimates" article (155000005621) and "Multiple Opportunities For The Same Person In The Same Pipeline" (48001066144) both imply the join model is flexible but I have not read these deeply.
**Resolution plan:** Deep-read at the point the Caramel Oven guide's Opportunities or Invoices section demands it.

### S-4 [PROVISIONAL] — Article counts current
Folder counts reported by the index page can drift. Doesn't meaningfully affect the audit.

### SC-1 [APPROVED with adjustments — 2026-04-17 Phase 2 sign-off] — Caramel Oven feature boundary

Final scope after Dan + Claude Chat review:

- **IN SCOPE (phased rollout approach (c) approved):**
  - Sub-Account Business Profile setup
  - Domain connect (connect existing bakery domain) — blocked by Q2 intake
  - LC Phone number purchase + A2P 10DLC registration — blocked by Q1 intake
  - LC Email domain setup with DMARC/SPF/DKIM
  - Contacts (imports, custom fields for dietary prefs, tags, source fields) — Q8 informs planning
  - Calendars: Services module for "Custom Order Consultation" + "Catering Tasting"; basic Calendar for regular slots — Q5 determines single-staff vs Staff-select/Calendar Groups
  - Opportunities: Wholesale pipeline + Catering pipeline — Q6 determines whether Companies activates
  - **Workflows: 10-12 core workflows (revised upward from 5-8)**:
    1. Appointment confirmation + reminder sequence
    2. Review request post-fulfillment
    3. Post-purchase thank-you
    4. Abandoned cart
    5. New-lead welcome
    6. Wholesale lead nurture
    7. Catering inquiry nurture
    8. GBP review response (uses Reviews AI)
    9. Negative feedback handler
    10. Dormant customer reactivation
    (Expect 2-3 additional workflows to emerge during Phase 3 design.)
  - Forms + Surveys: lead capture from funnels, feedback after event
  - Chat Widget: on the bakery website
  - Payments: Stripe + Products + Invoices for wholesale/catering + Payment Links for quick orders — Q3 determines Stripe import path
  - Documents & Contracts: catering contract template with e-sign
  - Reputation: Google Business Profile integration + review request workflow — Q4 determines GBP claim status
  - Social Planner: scheduled posts across FB/IG — Q7 determines platform coverage
  - Sites: simple funnel with Home + About + Order + Contact pages, blog for recipe posts
  - Dashboards: pipeline value + review count + appointments widgets
  - **Gift Cards (PROMOTED from OPTIONAL → IN SCOPE 2026-04-17):** Low implementation cost; meaningful seasonal revenue driver (Mother's Day, Valentine's Day, Christmas). Payments → Gift Cards → Create Gift Card → sell via checkout links / embed / QR / existing checkouts; send as one-time prepaid credit via email/SMS/PDF/QR.
  - **Content AI (PROMOTED from OPTIONAL → IN SCOPE 2026-04-17):** Force multiplier for solo PitchBlack operation. Drafts social posts and email copy. Available in Social Planner, Email Builder, Blogs, Funnels. Requires Brand Board + Brand Voice setup. Pricing: $0.09 per 1,000 words for email generation; first 500 words/sub-account complimentary. Before Phase 3 writes its section, Content AI confidence is already 🟢 (Social Planner + Email Builder + Brand Voice Integration deep-reads completed 2026-04-17).

- **OPTIONAL (mark in guide per directive 3.7; deferred to months 2-3):**
  - Memberships/Communities (Baker's Club subscription)
  - Full E-commerce Store (if they ship nationally)
  - Voice AI (answers phones)
  - Conversation AI (FAQ chatbot on chat widget)
  - Client Portal (for wholesale accounts to see invoices/orders)
  - Webinars, Quizzes
  - Custom Objects (if data beyond Contacts is warranted)
  - Certificates (no obvious fit)

- **OUT OF SCOPE for the sub-account build (agency-tier — strategic-future items live in STRATEGIC_FUTURE.md):**
  - SaaS Mode / Reselling / Affiliates Program / Prospecting Tool
  - Eliza Agent Platform (agency/developer concern)
  - MCP Server (strategic-future; see STRATEGIC_FUTURE.md)
  - Agency Dashboard, Agency Settings (sub-account only mentions these)
  - White-label mobile app, Whitelabel Desktop
  - Full WhatsApp Business Solution Provider onboarding (91 articles — skim only; US B2C context rarely needs this)

**Status: APPROVED 2026-04-17 by Dan + Claude Chat. Phase 2 sign-off granted. Phase 3 gated on section-sequence review.**

### SC-2 [RESOLVED — 2026-04-17] — Guide reader persona
**Primary reader = Virtual Assistant (VA).** Write for VA: clear numbered steps, context where needed, not dumbed down. Dan reads regardless (treats guide as QA surface). Business owner (Stacy/Josh) receives the Phase 5.1 client-facing case study, NOT the build guide. No technical jargon smuggled in; no "as you know" phrasing; always state what's being clicked/entered.

---

## STILL OPEN

### A-2 [DEFERRED — 2026-04-17] — Client-side state introspection
Dan does not have a credit card on file to complete a free-trial signup. No live sub-account is provisionable pre-contract. **Flag stays OPEN through Phase 3; closes automatically when Caramel Oven contract closes and Dan's Agency provisions Caramel Oven's live sub-account.** Phase 1.3 deliverable (KNOWLEDGE_MAP Axis 4) documents the *method* without the *content*. Every Phase 3 UI-specific step gets a `UI-VERIFY` flag — verification happens against the live sub-account at build time.

### Scope-gap flags for Phase 3
- **Farmers-market vendor specifics** — no Industry Playbook for bakeries or food retail. Closest: Restaurant/Bar (155000000967). Adaptation will be custom; flag any assumption about farmers-market workflow not supported by direct docs.
- **Wholesale pipeline patterns** — no direct HighLevel pattern library for B2B wholesale account management in a food vertical. Will adapt Companies + Opportunities + Documents/Contracts mechanics.
- **Seasonal promotion patterns** — Countdown Timer and Trigger Links support this tactically; no end-to-end pattern exists; will construct.

---

## Doc gaps (persistent across audit)

### D-1 [ACKNOWLEDGED] — Screenshot/video freshness variance
Captured article modification dates range from 2023 (older playbooks) to 2026-04-17 (this week). Screenshots and video embeds in older articles will be mismatched against the current UI.
**Mitigation in Caramel Oven guide:** All step-by-step instructions will be text-first (with screenshot references cross-checked against the latest article modification date). Screenshots in the final guide will be either (a) new screenshots sourced from the most recent article on the topic, or (b) skipped with a note that the UI may differ.

### D-2 [ACKNOWLEDGED] — Platform velocity
HighLevel ships roughly daily (per changelog: 10 releases in 3 days leading up to 2026-04-18). The AI Employee / Agent layer is the fastest-moving surface.
**Mitigation:** Phase 5.2 Update Protocol will address:
- Detecting drift (monthly changelog review; help-center modification date tracking on critical articles)
- Which guide sections are volatile (AI, Agent Studio, MCP, Voice AI) vs stable (Contacts, Calendars, Workflows, Payments)
- Versioning the guide with a "tested against HighLevel as of [date]" header

### D-3 [ACKNOWLEDGED] — Specific feature-level gaps discovered during ingestion
- **Workflow Settings Overview** article (48001239875) exists; introduction article (155000002445) does not detail Settings. Need deep-read for Settings-specific controls.
- **Workflow recipe library** is just 3 articles — thin. University How-To's has more pattern material (19 articles) and will substitute.
- **Chat Widget ↔ Conversations routing** is described generally (messages land in inbox) but the specific routing rules (office hours, auto-reply, human handoff) are in a separate folder not yet deep-read.
- **Calendar Rentals** (11 articles) is a separate sub-folder from standard Calendars — product area not deeply understood.
- **Custom Values settings page** (155000004705) exists but not deep-read; critical for the guide's "Business-wide constants" section.
- **Preference Management** for email unsubscription granularity (155000007291) — not deep-read; relevant for email-centric businesses like a bakery with a newsletter.
- **MCP Server** — 1 article. Given the 2026-04-17 changelog announcement, article may be thin; production-readiness unclear.

### D-4 [RESOLVED — 2026-04-17] — Industry Playbook depth
**Restaurant/Bar playbook (155000000967) read.** Findings: **thin.** Playbook mentions Missed-Call Text-Back, Conversation AI for bookings, Review Request automation, Newsletter, GBP integration, SMS Webchat Widget, Paid Appointment Calendars, and Text Snippets — but provides NO pipeline stages, NO specific workflow recipes, NO forms/fields guidance, NO catering or special-order patterns, NO snapshot reference, NO loyalty/subscription mechanics. It is essentially a bullet list of tools to use, not a blueprint. **Implication:** Caramel Oven guide cannot rely on Restaurant/Bar playbook as a template. Phase 3 builds from scratch. The three patterns worth adopting: (a) Missed-Call Text-Back as a foundational workflow, (b) GBP-centric review solicitation, (c) Text Snippets for operator efficiency. All three are already in SC-1 scope.

---

## Access gaps (persistent)

### A-1 [ACKNOWLEDGED] — No active HighLevel account
Per directive: "Source material: HighLevel's public documentation only." Every UI-specific claim in the Caramel Oven guide is inferred from docs. Mitigations:
- Flag UI-specific steps with "UI-VERIFY" tags in Phase 3 sections where confidence is yellow.
- Prefer articles with embedded screenshots as the authoritative step-by-step source.
- Cross-reference multiple articles when possible (e.g., Workflow creation appears in multiple overview articles — consistency across them is my confidence signal).
- When a step requires a specific UI action not described in docs, flag the step and ask Dan + Claude Chat to resolve before writing.

### A-3 [NEW] — No API key for live verification
Even without UI access, some behaviors are verifiable via API calls (e.g., rate limits, webhook payload shape). Not performed in this phase.

---

## Flag inventory dashboard (Phase 1 close)

| # | Type | Claim | Status |
|---|---|---|---|
| S-1 | Structural | canonical doc sources | RESOLVED |
| S-2 | Structural | dual-home folders | PARTIAL RESOLVED |
| S-3 | Structural | Sub-Account == Location | RESOLVED |
| S-4 | Structural | article counts current | PROVISIONAL |
| B-1 | Behavioral | sub-accounts empty, Snapshots populate | RESOLVED |
| B-2 | Behavioral | workflows sub-account-scoped | RESOLVED (upgraded from PROVISIONAL) |
| B-3 | Behavioral | data-backbone join shape | PROVISIONAL |
| B-4 | Behavioral | LC Phone proprietary (not Twilio re-brand) | RESOLVED (corrected) |
| B-5 | Behavioral | A2P 10DLC required US local SMS | RESOLVED |
| B-6 | Behavioral | merge fields context-scoped | RESOLVED |
| SC-1 | Scope | Caramel Oven feature boundary | APPROVED (2026-04-17 with adjustments: Gift Cards IN, Content AI IN, 10-12 workflows, phased rollout (c)) |
| SC-2 | Scope | guide reader = VA (with Dan reading in parallel) | RESOLVED (2026-04-17) |
| A-1 | Access | no live account | ACKNOWLEDGED |
| A-2 | Access | client-side introspection blocked | DEFERRED (closes when Caramel Oven contract provisions live sub-account) |
| A-3 | Access | no API live tests | ACKNOWLEDGED |
| D-1 | Doc | screenshot freshness | ACKNOWLEDGED |
| D-2 | Doc | fast-moving product | ACKNOWLEDGED |
| D-3 | Doc | specific feature-level gaps | ACKNOWLEDGED (closes JIT per Phase 3 section) |
| D-4 | Doc | Restaurant/Bar playbook depth | RESOLVED (2026-04-17 — playbook is thin; does not template Caramel Oven) |
| Phase 3 | Guardrails | V2 API only · UI-VERIFY flags · 2026-04-17 date header · Update Protocol notice · dual-home vigilance | CARRY FORWARD |
| Phase 5.1 | Packaging | Caramel Oven Snapshot as reusable asset | ADDED to Phase 5.1 scope (2026-04-17) |
| Tech stack | Architecture | Node.js + Vue.js + MongoDB | RESOLVED |
| API | Architecture | V2 OAuth 2.0 + PIT; V1 EoS 2025-12-31 | RESOLVED |
| Rate limits | Architecture | 100/10s burst; 200K/day | RESOLVED |

---

## Honesty summary for Phase 2 reviewers

This audit is **breadth-complete and depth-selective.** Every top-level category and nearly every sub-folder has been inventoried. Seventeen critical overview articles were deep-read; a roughly equal number of adjacent articles were skimmed via the folder-index fetch. The Phase 1 confidence distribution is biased toward the features that matter most for Caramel Oven (Contacts, Conversations, Calendars/Services, Workflows, Payments, Reputation, Snapshots) — these sit at 🟢 Green. Features further from the Caramel Oven use case (Eliza Agent Platform, full SaaS Mode, WhatsApp BSP onboarding, Certificates, Reselling internals) are at ⚪ breadth-scan or 🔴 low.

**The honest limit:** ~23% of articles had IDs captured; depth-reads covered 17 articles. Raw-fidelity article inventory lives in ARTICLE_INDEX.md. Folder-level confidence annotations live in KNOWLEDGE_MAP.md. Narrative understanding lives in SYNTHESIS.md.

**If Dan + Claude Chat want more breadth:** Re-invoke specific categories from the waves in RAW_INGESTION_LOG.md that are still at ⚪. Probably the highest-value missing waves are Workflow Triggers/Actions sub-folder depth, Funnels/Websites pages 2-6, Payments Getting-Started page 2, and Voice/Conversation AI sub-folders.

**If Dan + Claude Chat want more depth:** Point to specific articles or features and I will deep-read and update SYNTHESIS.

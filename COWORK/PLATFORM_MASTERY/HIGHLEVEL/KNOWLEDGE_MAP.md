# KNOWLEDGE_MAP — HighLevel Platform

**Purpose:** Hierarchical outline of HighLevel's system architecture. This is the table of contents: every feature, every folder, every article group placed in its structural home. From any concept, a reader can navigate to "where it lives in HighLevel" and from any HighLevel surface, back to the authoritative doc.

**Sources of truth (resolved during Phase 1 audit):**
- **User documentation:** `help.gohighlevel.com/support/solutions` (45 top-level categories; ~160 sub-folders; ~2,050 articles)
- **Developer/API documentation:** `marketplace.gohighlevel.com/docs/` (V2 API, OAuth 2.0, Private Integration Tokens)
- **Changelog:** `ideas.gohighlevel.com/changelog`
- **Legacy API:** `old-public-api.gohighlevel.com` (V1, end-of-support 2025-12-31)
- **University:** content folded into `help.gohighlevel.com/support/solutions/folders/48000674647` ("HighLevel How-To's")

**Captured:** 2026-04-18. **Phase 2 addendum:** 2026-04-17 sign-off by Dan + Claude Chat. Updates: (a) V2 API base URL confirmed `https://services.leadconnectorhq.com` (Axis 4.4) · (b) 14 URL modules → 11 functional domains mapping added (Axis 4.7) · (c) Content AI folder promoted 🟢 (deep-reads 48001234788 · 48001236751 · 155000005308) · (d) Gift Cards folder promoted 🟢 (inventory complete; 4 articles) · (e) Folder-level chip reconciliation per Phase 2 review: B3 Companies, B4 CRM, I4 Agency Reporting promoted from 🔴 to 🟡 (narrative-level understanding exists in SYNTHESIS). Certificates H3, Reselling I2, Internationalization O, Miscellaneous/UX Q retained at 🔴 (genuinely low confidence — no narrative in SYNTHESIS either).

**Confidence legend (applied to each folder)**
- 🟢 High — folder inventoried AND at least one deep-read; synthesized in SYNTHESIS.md
- 🟡 Medium — folder inventoried (article titles enumerated); no article-level deep-read yet
- ⚪ Breadth-scan only — top-level folder existence confirmed; article titles not enumerated
- 🔴 Low — folder not yet touched
- ⛔ Gap — folder returned errors, paginated beyond page 1 and deprioritized, or material missing

## Axis 1 — Platform Hierarchy (who is looking at what)

HighLevel runs on a three-tier hierarchy:

| Tier | Concept | Persona | URL pattern |
|---|---|---|---|
| **Agency** (top) | Reseller / SaaS operator; owns sub-accounts + white-label | Agency owner/admin | `app.gohighlevel.com/` (agency dashboard) |
| **Sub-Account** (middle) | Tenant workspace, one per business; a.k.a. "Location" | Sub-account admin/user | `app.gohighlevel.com/v2/location/<LocationID>/...` |
| **User** (bottom) | A human login assigned to one or more Agencies/Sub-Accounts | End user | Same URLs, scoped by permissions |

**Caramel Oven = one Sub-Account.** Location ID is the load-bearing identifier: it appears in every sub-account URL segment and also in Settings → Business Profile.

## Axis 2 — Functional Domains (what HighLevel does)

### A. Platform foundation
- Getting Started w/ HighLevel
- Agency View (agency-tier admin)
- Settings (agency, sub-account, user, domains, audit logs)
- Customer Support, Legal, Compliance, Internationalization
- Mobile & Desktop App, Whitelabel Mobile App
- University, UX, Miscellaneous

### B. CRM core
- Contacts (Smart Lists, Contact Details View, Bulk Actions, Getting Started, Cross-module)
- Custom Objects · Companies · CRM (Import/Export, Views)
- Opportunities & Pipelines
- Merge Fields & Custom Variables

### C. Communications
- Conversations (unified inbox) + Manual Actions
- Phone System (LC Phone = proprietary; Calling, Messaging, A2P, Voicemail, Phone numbers)
- Email (LC Email, Deliverability, MailGun, SMTP, Troubleshooting)
- Notifications

### D. Scheduling
- Calendars & Appointments (10 sub-folders)

### E. Automation
- Workflows (12 trigger sub-folders + 15 action sub-folders + Builder + Recipes + Troubleshooting)
- Logic & Fulfillment (mostly legacy-pattern library)
- AI Employee (AI Employee, Voice AI, Conversation AI, Content AI, Workflow AI, Ask AI, AI Studio, Agent Studio, Email AI, MCP Server, Knowledge Bases)
- Eliza Agent Platform
- App Marketplace

### F. Web presence
- Sites (Funnels/Websites, Stores-element, Blog, WordPress, Client Portal surface, Forms, Surveys, Chat Widget, QR Codes, Quizzes, SEO, Webinars, Custom Objects, Troubleshooting)
- E-commerce Store (full ecommerce module)

### G. Marketing (outbound)
- Marketing (Social Planner, Email Marketing, Ad Manager, Template Library, Trigger Links, SMS & Email Templates, Affiliate Manager, Brand Board, AI Booking Bot, Countdown Timer)
- Memberships & Communities
- Reputation Management & Reviews

### H. Monetization
- Payments (Invoices, Estimates, Payment Links, Products/Taxes/Coupons, Subscriptions, Tap-to-Pay, Payment integrations, Gift Cards)
- Documents & Contracts (top-level)
- Certificates
- Client Portal (top-level)

### I. Agency/SaaS layer
- SaaS Configurator (SaaS Mode)
- Account Snapshots (Snapshots, Industry Snapshots)
- Reselling Products (Online Listings, WhatsApp, Branded Mobile APP, Reselling)
- HighLevel Affiliates Program
- Agency Reporting (Rolled Up Reporting)
- Industry Guides (Industry Playbooks)

### J. Analytics & reporting
- Dashboards (Getting Started, Widgets, Configuring, Subaccount Dashboards)
- Reporting (Tracking & Attribution, Custom Reports, Marketing Audit Reports)

### K. Integrations
- Integrations (Google, Stripe, Facebook, Online Listings, Zapier, QuickBooks, Other, Shopify, TikTok, Private, Jobber)
- Developer Resources (API v2)
- Add-ons & Sales Trainings

---

## Axis 3 — Category-by-category inventory with confidence + deep-read flags

Deep-read articles feeding SYNTHESIS narrative are marked ★ inline in the folder line.

### A1. Getting Started w/ HighLevel — 🟡
- Foundational Setup (9) — `/folders/155000001128` — 🟡 — ★ 155000005055 (Create New Contact)
- Marketing & Lead Generation (3) — `/folders/155000001129` — 🟡
- Sales & Conversations (3) — `/folders/155000001130` — 🟡
- Website & Content (3) — `/folders/155000001131` — 🟡
- Commerce (6) — `/folders/155000001132` — 🟡 — ★ 155000005074 (Setup Payment Links)

### A2. Customer Support — 🟡
- General Support Info (4) — `/folders/155000000668` — 🟡
- Premium Support Upgrade (2) — `/folders/155000000669` — ⚪
- Billing Support (2) — `/folders/155000000670` — ⚪
- Software Migration Guides (18) — `/folders/155000000813` — ⚪
- Legal (3) — `/folders/155000001300` — ⚪

### A3. Agency View — 🟡
- AI Agents Contest (1) — `/folders/155000001312` — ⚪
- Agency Launchpad (1) — `/folders/155000001244` — 🟡
- Agency Dashboard (5) — `/folders/155000000845` — 🟡
- SaaS Configurator (link) (1) — `/folders/155000000846` — ⚪
- Prospecting Tool (18) — `/folders/155000000847` — 🟡
- Sub-Accounts (3) — `/folders/155000000848` — 🟡
- Account Snapshots (link) (1) — `/folders/155000000849` — ⚪
- Reselling (2) — `/folders/155000000850` — ⚪
- Agency Settings (5) — `/folders/155000000854` — ⚪

### A4. AI Employee — 🟡 (catalog); 🔴 per-sub-area depth
- AI Employee (7) — `/folders/155000000941` — 🟡 — ★ 155000002166 (AI Tools in HighLevel)
- Voice AI (36) — `/folders/155000000930` — 🟡 (page 1 of 2)
- Workflow AI (3) — `/folders/155000000938` — ⚪
- Conversation AI (23) — `/folders/155000000929` — 🟡 (page 1)
- Content AI (7) — `/folders/155000000937` — 🟢 (2026-04-17 IN SCOPE; deep-reads 48001234788 Social Planner · 48001236751 Email Builder · 155000005308 Brand Voice Integration)
- Ask AI (7) — `/folders/155000001210` — ⚪
- AI Studio (4) — `/folders/155000001479` — ⚪
- Agent Studio (13) — `/folders/155000001368` — ⚪
- Email AI (1) — `/folders/155000001369` — ⚪
- MCP Server (1) — `/folders/155000001370` — ⚪
- Knowledge Bases (5) — `/folders/155000001371` — 🟡

### A5. SaaS Configurator — 🟡
- SaaS Mode (53) — `/folders/48000676654` — 🟡 (page 1 of 3)

### A6. Phone System — 🟢
- General (9) — `/folders/48000665896` — 🟡
- Calling (26) — `/folders/48000665895` — ⚪
- LC Phone System (19) — `/folders/48000682872` — 🟢 — ★ 48001223546 (What is LC Phone?)
- Messaging (26) — `/folders/48000690075` — 🟡 (page 1)
- A2P registration (20) — `/folders/155000000021` — 🟢 — ★ 155000007411 (Getting Started with A2P 10DLC)
- Voicemail (2) — `/folders/48000672158` — ⚪
- Phone numbers (20) — `/folders/48000691614` — 🟡 — ★ 48001204848 (Find Client's Location ID — for URL pattern)

### A7. Email — 🟡
- General (9) — `/folders/48000665901` — 🟡
- Deliverability (11) — `/folders/48000665893` — 🟡
- LC Email (21) — `/folders/48000686640` — 🟡
- MailGun (16) — `/folders/48000665892` — ⚪
- SMTP Providers (10) — `/folders/48000689533` — ⚪
- Troubleshooting Email (9) — `/folders/48000665894` — ⚪
- LC Communication Billing (1) — `/folders/48000687904` — ⚪
- Email Delivery Troubleshooting (6) — `/folders/155000001392` — ⚪

### B1. Contacts — 🟢
- Smart Lists (21) — `/folders/48000666017` — 🟢 — ★ 48001062094 (Create & Manage Smart Lists)
- Contact Details View (4) — `/folders/155000000960` — 🟡
- Bulk Actions (7) — `/folders/155000000591` — 🟡
- Contacts (7) — `/folders/155000000198` — 🟡
- Updating Contact Properties (1) — `/folders/155000000911` — ⚪
- Getting Started with Contacts (1) — `/folders/155000001029` — 🟡
- Contacts and Other Modules (1) — `/folders/155000001200` — ⚪

### B2. Custom Objects — 🟡
- Getting Started with Custom Objects (8) — `/folders/155000000895` — 🟡
- Managing Custom Object Records (5) — `/folders/155000000896` — ⚪

### B3. Companies — 🟡 (2026-04-17 promoted from 🔴; narrative in SYNTHESIS 2.3 acknowledges B2B account-container role; triggers Q6 intake decision for Caramel Oven)
- Introduction to Companies (4) — `/folders/155000001028` — ⚪

### B4. CRM — 🟡 (2026-04-17 promoted from 🔴; narrative in SYNTHESIS 2.4 covers Import/Export + Views overview)
- Import / Export (1) — `/folders/155000001033` — ⚪
- Managing your CRM Views (4) — `/folders/155000001034` — ⚪

### B5. Opportunities & Pipelines — 🟢
- Introduction to Opportunities (2) — `/folders/155000000509` — 🟢 — ★ 155000001983 (Understanding Opportunities), 155000001982 (Understanding Pipelines)
- Getting Started with Opportunities (8) — `/folders/155000000510` — 🟡
- Managing Opportunities (14) — `/folders/155000000515` — 🟡
- Opportunities Module Interactions (4) — `/folders/155000000516` — ⚪
- Bulk Actions for Opportunities (2) — `/folders/155000000776` — ⚪

### B6. Merge Fields & Custom Variables — 🟢
- Merge Fields & Custom Variables (2) — `/folders/155000000085` — 🟢 — ★ 48001078171 (List of Merge Fields)

### C1. Conversations — 🟢
- Conversations (29) — `/folders/48000666160` — 🟢 — ★ 155000006610 (Getting Started with the Conversations Tab)
- Manual Actions (2) — `/folders/48000666018` — ⚪

### C2. Notifications — 🟡
- Notifications (4) — `/folders/48000666472` — 🟡

### D. Calendars & Appointments — 🟢
- Getting Started w/ Calendars (3) — `/folders/155000000697` — 🟡
- Creating Calendars (26) — `/folders/48000666396` — 🟡 (page 1, 4 sub-folders)
- Services (13) — `/folders/155000000828` — 🟢 — ★ 155000006240 (Services - Overview)
- Rentals (11) — `/folders/155000001348` — ⚪
- Calendar Groups (5) — `/folders/155000000690` — ⚪
- Calendar Settings & Preferences (14) — `/folders/155000000688` — 🟡
- Scheduling Appointments (9) — `/folders/155000000678` — 🟡
- Calendar Integrations (13) — `/folders/155000000574` — 🟡
- Troubleshooting Calendars (10) — `/folders/155000000689` — ⚪
- Calendar FAQ's (2) — `/folders/155000000702` — ⚪

### E1. Workflows — 🟢
- Getting Started w/ Workflows (38) — `/folders/155000000735` — 🟢 — ★ 155000002445 (Introduction to Workflows and Automations)
- Workflow Builder (57) — `/folders/48000678544` — 🟡 (page 1 of 3)
- Workflow Triggers (34) — `/folders/48000666397` — 🟡 (12 sub-folders + page 1)
- Workflow Actions (24) — `/folders/155000000731` — 🟡 (15 sub-folders + page 1)
- Developer Resources (4) — `/folders/48000685391` — ⚪
- Troubleshooting Workflows (1) — `/folders/155000000734` — ⚪
- Unpublished Articles (2) — `/folders/155000000782` — ⚪
- Workflow Recipes (3) — `/folders/155000001063` — 🟡

### E2. Logic & Fulfillment — 🟡
- Logic & Fulfillment (40) — `/folders/48000673695` — 🟡 (page 1 of 2; legacy-pattern library)

### E3. App Marketplace — 🟡
- Get Started w/ App Marketplace (7) — `/folders/155000000892` — ⚪
- View, Install & Uninstallation Apps (5) — `/folders/155000000161` — ⚪
- Workflow Triggers & Actions (3) — `/folders/155000000080` — ⚪
- Snapshots in App Marketplace (2) — `/folders/155000000819` — ⚪
- Conversation AI and Voice AI Templates on Marketplace (1) — `/folders/155000001252` — ⚪

### E4. Eliza Agent Platform — 🔴
- Eliza Agent Platform Onboarding (6) — `/folders/48000690746` — ⚪

### F1. Sites — 🟡 (catalog); 🟢 for Chat Widget specifically
- Funnels and Websites (115) — `/folders/48000666011` — 🟡 (3 sub-folders + page 1 of 6)
- Stores (E-commerce element) (1) — `/folders/155000000881` — ⚪
- Analytics (Funnels, Websites, & QR Codes) (6) — `/folders/155000000882` — ⚪
- Blog (25) — `/folders/48000686613` — 🟡 (page 1)
- Wordpress (45) — `/folders/155000000883` — ⚪ (out of scope for Caramel Oven)
- Client Portal (1) — `/folders/155000000884` — ⚪
- Forms (42) — `/folders/48000665899` — 🟡 (page 1 of 3)
- Surveys (11) — `/folders/48000665898` — 🟡
- Chat Widget (26) — `/folders/48000667019` — 🟢 — ★ 155000004102 (Getting Started with Chat Widget)
- QR Codes (10) — `/folders/155000000787` — 🟡
- Troubleshooting Funnels (9) — `/folders/48000666012` — ⚪
- Privacy Policy (1) — `/folders/155000000083` — ⚪
- General Setup (2) — `/folders/155000000522` — ⚪
- Quizzes (7) — `/folders/155000000942` — 🟡
- SEO (9) — `/folders/155000001085` — 🟡
- Custom Objects (in Sites) (2) — `/folders/155000001329` — ⚪
- Webinars (2) — `/folders/155000001372` — ⚪

### F2. E-commerce Store — 🟡
- E-Commerce Store (40) — `/folders/155000000182` — 🟡 (page 1 of 2)

### G1. Marketing — 🟡
- Social Planner (53) — `/folders/48000684282` — 🟡 (page 1 of 3)
- Email Marketing (6) — `/folders/48000676548` — 🟡 (5 sub-folders + 1 article)
- Ad Manager (10) — `/folders/155000000587` — 🟡 (8 sub-folders + 2 articles)
- Template Library (19) — `/folders/48000687583` — 🟡
- Trigger Links (1) — `/folders/48000666014` — ⚪
- SMS & Email Templates (3) — `/folders/48000666015` — 🟡
- Affiliate Manager (6) — `/folders/155000001220` — 🟡 (6 sub-folders, no individual articles at root)
- Brand Board (10) — `/folders/155000000593` — 🟡
- AI Appointment Booking Bot (2) — `/folders/48000685924` — ⚪
- Countdown Timer (17) — `/folders/155000000777` — 🟡

### G2. Memberships & Communities — 🟡
- Membership/Courses Sites (37) — `/folders/48000671055` — 🟡 (page 1 of 2)
- Communities (36) — `/folders/155000000024` — 🟡 (page 1)

### G3. Reputation Management & Reviews — 🟢
- Review Requests (32) — `/folders/48000666025` — 🟢 — ★ 48001222668 (How to Send Review Requests)
- Competitor Analysis (1) — `/folders/155000001213` — ⚪
- GBP Optimization (2) — `/folders/155000001270` — 🟡
- Listings (2) — `/folders/155000001426` — 🟡
- Video Testimonials (1) — `/folders/155000001428` — ⚪

### H1. Payments — 🟢
- Getting Started w/ Payments (33) — `/folders/48000682654` — 🟡 (page 1 of 2)
- Mobile Payments (Tap-to-Pay) (1) — `/folders/155000001310` — ⚪
- Invoices & Estimates (29) — `/folders/155000000900` — 🟢 — ★ 48001208702 (How to Create Invoices)
- Documents & Contracts (Payments sub) (2) — `/folders/155000000901` — ⚪
- Orders, Subscriptions, and Transactions (10) — `/folders/155000000902` — 🟡
- Payment Links (5) — `/folders/155000000903` — 🟢 — ★ 155000005074 (Setup Payment Links)
- Products, Taxes & Coupons (8) — `/folders/155000000904` — 🟡
- Payment integrations, methods and settings (15) — `/folders/155000000905` — 🟡
- Gift Cards (4) — `/folders/155000001419` — 🟢 (2026-04-17 IN SCOPE; full 4-article inventory — Getting Started 155000006980 · Performance Tracking 155000006981 · How to Sell 155000006986 · How to Send 155000006987)

### H2. Documents & Contracts (top-level) — 🟡
- Documents and Contracts (28) — `/folders/155000000203` — 🟡 (page 1)

### H3. Certificates — 🔴
- Templates (4) — `/folders/155000000195` — ⚪
- Issue Certificates (11) — `/folders/155000000196` — ⚪
- Certificate cloning (1) — `/folders/155000001084` — ⚪
- Issue Badge (2) — `/folders/155000001246` — ⚪

### H4. Client Portal (top-level) — 🟡
- Client Portal (20) — `/folders/155000000015` — 🟡

### I1. Account Snapshots — 🟢
- Snapshots (24) — `/folders/48000666032` — 🟢 — ★ 48000982511 (Snapshots Overview)
- Industry Snapshots (15) — `/folders/48000670531` — 🟢

### I2. Reselling Products — 🔴
- Online Listings (23) — `/folders/48000682876` — ⚪
- WhatsApp (91) — `/folders/48000683465` — ⚪ (massive folder — skim only)
- Client Portal Branded Mobile APP (1) — `/folders/155000000624` — ⚪
- Reselling (3) — `/folders/155000000956` — ⚪

### I3. HighLevel Affiliates Program — 🟡
- Affiliates Program (20) — `/folders/48000666024` — 🟡

### I4. Agency Reporting — 🟡 (2026-04-17 promoted from 🔴; narrative in SYNTHESIS 9.5 establishes Rolled-Up Reporting as cross-tenant aggregated metrics)
- Rolled Up Reporting (3) — `/folders/48000687582` — ⚪

### I5. Industry Guides — 🟡
- Industry Playbooks (18) — `/folders/155000000149` — 🟡 (all 14 playbooks + SaaS Mode playbook enumerated)

### J1. Dashboards — 🟡
- Getting Started w/ Dashboards (14) — `/folders/48000679140` — 🟡
- Dashboard Widgets (24) — `/folders/155000000192` — 🟡 (page 1)
- Configuring Dashboards (2) — `/folders/155000000952` — ⚪
- Subaccount Dashboards (1) — `/folders/155000001104` — ⚪

### J2. Reporting — 🟡
- Tracking & Attribution (22) — `/folders/48000672285` — 🟡 (page 1)
- Custom Reports (2) — `/folders/155000000927` — ⚪
- Marketing Audit Reports (2) — `/folders/155000001175` — ⚪

### K1. Integrations — 🟡 (most); 🟢 Google/Stripe/Zapier
- Google Integrations (5) — `/folders/155000000968` — 🟢
- Stripe Integration (2) — `/folders/48000666022` — 🟢
- Facebook Integration (22) — `/folders/48000666319` — 🟡 (page 1)
- Online Listings Integration (1) — `/folders/48000666020` — ⚪
- Zapier Integration (5) — `/folders/48000666021` — 🟢
- QuickBooks (1) — `/folders/48000673144` — ⚪
- Other Integrations (11) — `/folders/48000677303` — 🟡
- Shopify (3) — `/folders/48000682893` — ⚪
- TikTok (2) — `/folders/48000687441` — ⚪
- Private Integrations (1) — `/folders/155000000764` — ⚪
- Jobber Integration (1) — `/folders/155000001233` — ⚪

### K2. Developer Resources — 🟡
- Developer Resources (18) — `/folders/48000668553` — 🟡 (catalog; API depth external)
- Advanced Configurations (3) — `/folders/48000685347` — ⚪

### K3. Add-ons & Sales Trainings — 🟡
- Whitelabel Desktop App (1) — `/folders/48000666027` — ⚪
- Compliance (Add-ons) (1) — `/folders/48000666565` — ⚪
- Sales Trainings and Case Studies (26) — `/folders/48000666033` — 🟡 (page 1)

### L. Settings — 🟡
- Agency Settings (15) — `/folders/48000666029` — 🟡
- Sub-Account Settings (12) — `/folders/48000666030` — 🟡
- User Settings (12) — `/folders/48000666473` — 🟡
- Domains (2 sub-folders) — `/folders/155000001069` — 🟡
- Audit Logs (2) — `/folders/155000001374` — ⚪

### M. Mobile & Desktop App — 🟡
- Mobile App (18) — `/folders/155000001378` — 🟡
- Desktop App (1) — `/folders/155000001376` — ⚪
- Whitelabel Mobile App (10) — `/folders/48000666028` — ⚪

### N. University — 🟡
- HighLevel How-To's (19) — `/folders/48000674647` — 🟡
- Prospecting & Sales (2) — `/folders/155000000160` — ⚪

### O. Internationalization — 🔴
- The Internationalization of High Level (3) — `/folders/155000000078` — ⚪

### P. Compliance (top-level) — 🟡
- Compliance (4) — `/folders/155000000081` — 🟡

### Q. Miscellaneous / UX — 🔴
- UX Issues (3) — `/folders/48000677469` — ⚪
- Miscellaneous (2) — `/folders/155000000084` — ⚪

---

## Axis 4 — System Architecture (Phase 1.3 research output)

**Directive 1.4** asked me to research whether HighLevel exposes its platform schema in client-side state containers, and to document access methods. Findings below are from public-documentation research — NOT from live DOM probing (per directive's no-account-access constraint).

### 4.1 Tech stack (sub-account UI)

Confirmed from public sources:
- **Backend:** Node.js + MongoDB
- **Frontend:** Vue.js (primary). The Agency/Sub-Account UI ships as a Vue SPA.
- **Real-time layer:** Socket-based (for Conversations inbox live updates)
- **Hosting/CDN:** not fully public; edge behavior consistent with a managed multi-tenant SaaS

### 4.2 URL scheme

Sub-account URLs follow the pattern:

```
https://app.gohighlevel.com/v2/location/<LocationID>/<module>/<view>
```

- `v2/` — indicates the current generation of the UI (legacy `v1/` routes exist for a subset of pages during the ongoing migration)
- `location/<LocationID>/` — the sub-account scope. Location ID is an alphanumeric string (example from docs: `abc123XYZ`). Load-bearing identifier.
- `<module>` — `dashboard`, `contacts`, `conversations`, `opportunities`, `calendars`, `automations`, `funnels`, `sites`, `payments`, `marketing`, `memberships`, `reputation`, `reporting`, `settings`, etc.
- Query params sometimes carry `locationId=...` as an alternative encoding (common in embedded widgets / Custom Pages).

White-label tenants serve the same app under their own domain (configured via Agency Settings → Branding → API Domain).

### 4.3 Client-side state containers (expected, not yet verified)

Because the UI is a Vue SPA, I expect the following client-side containers to hold platform state. These are **testable hypotheses** to verify on the first live-session probe:

- **localStorage**
  - Authentication JWT or OAuth access token (likely — any Vue SPA with API-driven views needs an accessible token)
  - Current Location ID / sub-account id
  - User ID / user profile cache
  - Feature flags / Labs toggles
  - Last-visited module (for redirect-on-reload)
  - UI preferences (theme, sidebar collapsed state, timezone)
- **sessionStorage**
  - Ephemeral UI state (modal open/closed, filter drafts)
  - Unsent form draft data in the workflow/funnel builder
- **IndexedDB** (maybe)
  - Chat message caching for the Conversations inbox
  - Media library thumbnail cache
  - Draft message composition

**No public confirmation** of specific keys has been found. The BatchLeads insight (inspect localStorage first) still applies — for HighLevel, the first-pass inspection should:

1. Open a sub-account page in Chrome/Edge.
2. DevTools → Application → Storage → Local Storage → `https://app.gohighlevel.com`
3. Expected high-value keys: anything starting with `auth_`, `token`, `user_`, `location_`, `currentLocationId`, `locationContext`, `vuex` / `pinia` store snapshots.
4. DevTools → Console → `Object.keys(window)` and `Object.keys(window.app || {})` to find the Vue root and any exposed stores.
5. If a global `window.app.$store` or similar is exposed (Vue 2 / Vuex convention): `window.app.$store.state` dumps the entire client-side world model. For Pinia (Vue 3): `window.__PINIA__`.

**Assumption flagged A-2 in ASSUMPTIONS.md** — exact keys/structures unresolved without live access. **A-2 status DEFERRED as of 2026-04-17:** Dan does not have credit card for free-trial signup. Flag stays OPEN through Phase 3; closes automatically when Caramel Oven contract closes and live sub-account is provisioned. Once a session is available, this section will be replaced with the real key inventory.

### 4.4 API surface (V2) — CONFIRMED 2026-04-17

Base: `https://services.leadconnectorhq.com/...` — **confirmed** via marketplace.gohighlevel.com/docs/ homepage example request (`"https://services.leadconnectorhq.com/contacts/"` shown as canonical endpoint pattern). Authorization header pattern: `Authorization: Bearer YOUR_TOKEN`. Version header presence not explicitly documented on homepage — flag UI-VERIFY when Phase 3 Appendix documents actual curl examples against a live token.

Auth flows:
- **OAuth 2.0 Authorization Code Grant** — for Marketplace apps that serve multiple Locations/Companies. Required for the App Marketplace listing.
- **Private Integration Tokens** — static tokens scoped to one Location. Best for internal agency tools and single-sub-account integrations.

Resource groups documented at `marketplace.gohighlevel.com/docs/`:
- Locations (sub-accounts)
- Companies (agencies)
- Contacts
- Conversations
- Calendars
- Opportunities
- Payments
- Webhooks

Rate limits (per Marketplace app per Location/Company):
- Burst: 100 requests / 10 seconds
- Daily: 200,000 requests

Webhooks: 50+ event types, delivered in real-time.

V1 API (`old-public-api.gohighlevel.com`) is end-of-support as of 2025-12-31; existing integrations continue to function but no updates or support.

### 4.5 Realtime surface

The Conversations inbox, the Opportunities Kanban drag-drop, the Workflow execution log, and the Chat Widget inbound messages all update in real-time. This implies a WebSocket or Server-Sent Events connection the client holds open while the app is active. Not enumerated in public docs; expected to be on a `wss://` subdomain.

### 4.7 URL modules → Functional Domains mapping (Phase 2 addition)

The URL `<module>` segment can take 14 distinct values. These map to the 11 functional domains (Axis 2) as follows:

| URL module | Primary domain | Secondary cross-cut |
|---|---|---|
| `dashboard` | J. Analytics & Reporting | — |
| `contacts` | B. CRM Core | — |
| `conversations` | C. Communications | E (some workflow triggers read Conversations state) |
| `opportunities` | B. CRM Core | H (Opportunities link to Invoices) |
| `calendars` | D. Scheduling | E (Appointment booked = workflow trigger), H (Calendar payments) |
| `automations` | E. Automation | All others (Workflows touch every domain) |
| `funnels` | F. Web Presence | G (Funnel = marketing surface), H (Order forms) |
| `sites` | F. Web Presence | G (Content), H (Stores) |
| `payments` | H. Monetization | — |
| `marketing` | G. Marketing | C (email/SMS campaigns), E (triggered campaigns) |
| `memberships` | G. Marketing | F (membership sites), H (subscription billing) |
| `reputation` | G. Marketing | **C (review request sent via SMS/email)**, **E (workflow action: Send Review Request)** — cross-cuts per Phase 2 guidance |
| `reporting` | J. Analytics & Reporting | — |
| `settings` | A. Platform Foundation | — |

**Observations:**
- 14 URL modules > 11 domains because some modules belong to the same domain (dashboard + reporting → J; funnels + sites → F; marketing + memberships + reputation → G; contacts + opportunities → B).
- Reputation cross-cuts C and E materially — the Caramel Oven guide's Reputation section (Phase 3 Section 11) builds infrastructure that is consumed by Communications and Automation, not just Marketing.
- Automations (Workflows) is a meta-module that touches every other — documented in SYNTHESIS 5.1.

### 4.8 Implication for the Caramel Oven build guide

Until live-session probing is possible, the guide's "under the hood" content will:
- Reference the URL pattern for teaching how to share links / find Location ID
- Describe the V2 API surface in an **Appendix** chapter for advanced customization
- NOT expose localStorage inspection as an end-user step (it's a debugging aid, not a build step)
- Mark any AI/MCP feature touchpoints as "subject to change" given platform velocity

---

## Axis 5 — Article-level inventory

Full article-title lists live in **ARTICLE_INDEX.md** (sibling file). That file is the raw-fidelity companion — it preserves every article title + ID I enumerated during the Phase 1 audit. This file (KNOWLEDGE_MAP) provides the structural map + confidence annotation; ARTICLE_INDEX provides the fidelity.

**Article-count audit (Phase 1 close):**
- Top-level categories: 45 enumerated
- Sub-folders: ~160 enumerated
- Article IDs captured: ~480 unique articles (out of ~2,050 reported by folder counts)
- Coverage ratio: ~23% by article count; ~100% by folder existence
- Deep-reads completed: 17 articles across highest-leverage overview pages

This is the floor of Phase 1 audit coverage. Phase 3 guide writing will trigger ad-hoc deep-reads of specific articles as sections demand.

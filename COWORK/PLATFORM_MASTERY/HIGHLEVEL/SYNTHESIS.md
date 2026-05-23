# SYNTHESIS — HighLevel Platform (in my own words)

> **Phase 2 review addendum (2026-04-17):** Phase 1 approved with adjustments by Dan + Claude Chat. Key narrative updates: (a) Content AI promoted to 🟢 IN SCOPE with operational detail in §5.3 · (b) Gift Cards promoted to 🟢 IN SCOPE with inventory in §8.1 · (c) Restaurant/Bar playbook resolved D-4 in §9.5 (playbook is thin; Phase 3 builds from scratch) · (d) Eliza Agent Platform, MCP Server, AI Studio / Agent Studio moved to STRATEGIC_FUTURE.md · (e) SC-1 scope boundary APPROVED with 10-12 workflows and phased rollout — see ASSUMPTIONS.md SC-1 entry. See SESSION_LOG.md 2026-04-17 entry for audit trail.

**Purpose:** Narrative understanding of HighLevel feature-by-feature. Where KNOWLEDGE_MAP.md answers "what exists and where does it live in the docs" and ARTICLE_INDEX.md is the raw article-title registry, this document answers "what does it actually do, how does it fit with the rest of the platform, and how confident am I?"

**Confidence color code (per directive 1.5)**
- 🟢 **Green** — multiple authoritative doc sources read, concept is clear enough to teach a non-expert, edge cases known
- 🟡 **Yellow** — overview-level clarity from at least one deep-read or folder inventory, some edge cases unmapped, can teach the 80% case
- 🔴 **Red** — folder existence confirmed but no overview article read; can describe *what* exists but not *how* to use it

**Deep-read corpus for this Phase 1 pass:**
1. Introduction to Workflows and Automations (155000002445)
2. Understanding Opportunities (155000001983)
3. Understanding Pipelines (155000001982)
4. Snapshots - Overview (48000982511)
5. Services - Overview & How to Get Started (155000006240)
6. AI Tools in HighLevel (155000002166)
7. Getting Started with the Conversations Tab (155000006610)
8. Getting Started - Create New Contact (155000005055)
9. How to Create & Manage Smart Lists (48001062094)
10. How to Send Review Requests (48001222668)
11. How to Create Invoices in HighLevel (48001208702)
12. Getting Started with A2P 10DLC (155000007411)
13. Getting Started with Chat Widget (155000004102)
14. List of Merge Fields (48001078171)
15. Getting Started - Setup Payment Links (155000005074)
16. What is LC (Lead Connector) Phone System? (48001223546)
17. How do I find my Client's Location ID? (48001204848)

---

## 0. Orientation: what IS HighLevel

🟢 Confidence: Green (the platform frame).

HighLevel (also "GoHighLevel," "GHL," and under white-label "LeadConnector") is an all-in-one marketing-and-sales operating system built for **marketing agencies** to resell as a SaaS product to **small-business clients**. The core insight is that most small businesses need the same stack — CRM, SMS/email, funnels, calendars, payments, reviews, automations — and most agencies were previously duct-taping that stack from 6-10 separate tools (HubSpot + Calendly + Twilio + ClickFunnels + ActiveCampaign + Stripe + BirdEye, etc.). HighLevel collapses all of it into one platform with a single data model and a single automation engine.

**Three tiers of access, three kinds of user:**

| Tier | Concept | Persona | Typical URL |
|---|---|---|---|
| Agency | The top-level tenant that owns sub-accounts and the white-label configuration | Agency owner/admin | `app.gohighlevel.com/` (agency dashboard) |
| Sub-Account (a.k.a. "Location") | One tenant workspace, typically one business | Sub-account admin/user | `app.gohighlevel.com/v2/location/<LocationID>/...` |
| User | A login that belongs to one or more Agencies/Sub-Accounts | End user | Same URLs, scoped by permissions |

**Caramel Oven Bakehouse is a Sub-Account.** Its Location ID will appear in the URL (`/v2/location/<LocationID>/...`) and also under Settings → Business Profile. The guide's job is to take one Sub-Account from empty to operational, with a small amount of agency-tier framing.

**Canonical product structure (my mental model):**
- One **data backbone**: Contacts → Opportunities → Conversations → Appointments → Invoices/Subscriptions. Everything else reads from or writes to this.
- One **automation engine**: Workflows, with Triggers firing into Actions (with Waits and If/Else branches), drawing on the data backbone and on channel-layer events.
- Several **channel-layer modules**: Email (LC Email or your SMTP), Phone/SMS (LC Phone — HighLevel-proprietary telephony, or BYO Twilio), Social Planner, Funnels/Websites/Blog, Forms/Surveys/Quizzes, Chat Widget, Reputation (Reviews), WhatsApp, Ad Manager. Each is both a human surface AND a source of triggers/actions for Workflows.
- A **commerce layer**: Payments (Invoices, Estimates, Payment Links, Subscriptions, Products, Taxes, Coupons), Documents & Contracts (e-signing), E-commerce Store, Memberships/Courses, Client Portal, Certificates, Gift Cards.
- An **intelligence layer**: AI Employee (Voice AI, Conversation AI, Content AI, Workflow AI, Reviews AI, Ask AI, AI Studio, Agent Studio, Knowledge Bases, MCP Server), plus Dashboards and Reporting/Attribution.
- An **admin/platform layer**: Agency/Sub-Account/User Settings, Snapshots, Domains, Audit Logs, SaaS Mode, Reselling, Affiliates.
- An **integration layer**: native integrations (Google, Stripe, Facebook, Twilio, QuickBooks, Shopify, WhatsApp, TikTok, Zapier, Jobber, Xero), App Marketplace, Private Integrations, Developer Resources (REST API v2 with OAuth 2.0).

---

## 1. Platform Foundation

### 1.1 Getting Started w/ HighLevel — 🟡 Yellow
The HighLevel-curated "first 24 hours" path is organized into 5 sub-folders: Foundational Setup (9 articles — Create Contact, Import Contacts, Launch Funnel, Setup Email/Phone/SMS, Launch Email Campaign, Automatic Followup, Booking Calendar, Pipelines/Opportunities, Launchpad Nudges), Marketing & Lead Generation (3 — Social Planner, FB/IG Lead Ads, SMS Campaign), Sales & Conversations (3 — Connect Personal Inbox, Live Chat Widget, FB/IG Messenger), Website & Content (3 — Website From Template, Migrate WordPress, Website from Blank), Commerce (6 — Create/Sell Products, Launch Course, Connect Stripe, Payment Links, Invoices, Membership Courses Editor). Titles alone already reveal HighLevel's favored build sequence: identity → contacts → channels → funnel → calendar → pipeline → commerce.

### 1.2 Agency View — 🟡 Yellow
9 sub-folders for the agency-tier admin surface. Most critical for Caramel Oven:
- **Sub-Accounts** (3 articles) — creation UI, tabular view for $97/$297 plans, Smart Prompts for Bulk SaaS Enablement. The "Create a New Sub-Account" flow is in Snapshots folder.
- **Agency Dashboard** (5) — MRR/SaaS analytics, rebilling, Summary Tab.
- **Prospecting Tool** (18) — agency-owned lead-gen tool; not directly part of sub-account build but relevant context.
- **Agency Launchpad** (1) — single overview article.
Other sub-folders (AI Agents Contest, SaaS Configurator, Account Snapshots, Reselling, Agency Settings) are tangential to the sub-account build.

### 1.3 Settings — 🟡 Yellow
Three Settings surfaces (agency/sub-account/user) plus Domains and Audit Logs.
- **Sub-Account Settings** (12) houses the build-guide-critical pages: Business Profile (where Location ID, address, phone, timezone, logo live), Custom Values, Media Storage, Account Billing Dashboard, Missed Call Text Back, WhatsApp Settings, HiRise Design (scoring). Business Profile is a separate sub-folder (155000001301).
- **Agency Settings** (15) covers Company Settings, white-label API Domain branding, custom menu links, Login-As-User admin override, 3DS cards, Tax ID, Snapshot Version Management, In-App Banner Management.
- **User Settings** (12) covers user access, email signature, roles and permissions, login troubleshooting, SSO, Google Login (white-label), 2FA via Authenticator App. Two roles exist structurally: Admin and User, with granular permission scopes.
- **Domains** (2 sub-folders) — Domain Connect (for pointing existing domains at HighLevel) and Domain Purchase/Transfer (buying through HighLevel).
- **Audit Logs** (2) — change history for governance.

### 1.4 Customer Support / Legal / Compliance / Internationalization / Mobile App / University / UX — 🟡 Yellow
- **Customer Support** — General Info (4 — 24/7 options, Zoom troubleshooting, accessibility, bug reporting), Premium Support Upgrade, Billing Support, Software Migration Guides (18 — how to move from HubSpot, ActiveCampaign, Mailchimp, Infusionsoft, Kajabi, Kartra, etc.), Legal.
- **Compliance** (top-level 4 articles) — Security & Compliance Overview, HIPAA, MAP Policy, SOC 2 Type II.
- **Internationalization** (3) — multi-language support.
- **University / How-To's** (19) — tactical recipes (Double Opt-In, Database Reactivation, Booking Bots, Pretty HTML Emails, Check-In Loops, Home Pages, Pricing Columns in Funnels, etc.). Treat as a pattern library I can draw from for the Caramel Oven guide.
- **Mobile App** (18) — Invoices in mobile, Media Library, Social Planner, Business Card Scanner, Calendar, DND, Call Transfer, Outbound Calling. The mobile app is a parity surface, not a separate product.

---

## 2. CRM Core

### 2.1 Contacts — 🟢 Green (foundations); 🟡 Yellow (edge cases)
The central data entity. **Creating a contact** is a 4-step flow: Contacts → Add Contact → enter data (name, email, phone being the baseline) → Save. Contacts capture natively has first/last name, email (multiple supported), phone (multiple supported), address, DOB, profile picture, tags, DND flags, contact type, and arbitrary custom fields (via Settings → Custom Fields). A Contact is **automatically created** when a new lead submits a Form or Survey.

Notable capabilities from the Contacts/Smart Lists catalog:
- **Multi-email and multi-phone** per contact (two separate articles).
- **Tag operations** in bulk (Add Tags, Remove Tags, Add to Workflow, Export CSV) are the high-leverage mass actions.
- **Merge Duplicates** (manual and automated merge flows).
- **Do Not Disturb (DND)** toggle at the channel level (SMS, email, calls).
- **Consent tracking** for privacy compliance (GDPR article).
- **Restore Deleted Contacts** — undo-able deletions.
- **Followers** mechanism lets multiple users subscribe to contact/opportunity updates.
- **Contact Types** are a separate field for classifying (lead, customer, vendor, etc.).

**Smart Lists** are the killer feature. A Smart List is a dynamic, saved filter over Contacts that auto-updates as contacts move in or out of the filter's definition. The recipe is: Contacts → "More Filters" → select filter(s) (tag, custom field, engagement metric, opportunity stage, invoice status, Last Activity duration) → Apply → Save as Smart List. Filters combine with AND/OR. Smart Lists drive Workflow enrollment, bulk actions, and email campaign audience selection (with the recipient list computed at send-time, not schedule-time — important behavior to remember).

**Contact Details View** (4 articles) — the single-record surface. The "all-new" revamp has customizable layout, activity timeline upgrade, one-click Subscription/Invoice creation from profile.

**Bulk Actions** (7) — Add/Remove Tags, Import CSV, Add to Workflow in bulk, Export CSV. New "Drip Mode Architecture" throttles bulk workflow enrollment to avoid sending-volume spikes.

### 2.2 Custom Objects — 🟡 Yellow
HighLevel lets tenants extend the data model beyond Contacts into first-class user-defined entities. 8 Getting Started articles cover creating/editing Custom Objects, Records, Workflow trigger/action integration, Smart Lists over Custom Objects, and a Real Estate case study. "Custom Objects in All Plans + Higher Limit" indicates pricing now permits this broadly. Relevant for Caramel Oven IF they want "Wholesale Accounts" or "Recipe Batches" as first-class entities beyond the Contacts model; flag as potentially OPTIONAL.

### 2.3 Companies — 🟡 Yellow
B2B-style account container. 4 articles under "Introduction to Companies." Groups contacts under a parent organization. Probably OPTIONAL for Caramel Oven unless they run a wholesale pipeline with clustered buyers.

### 2.4 CRM (Import/Export + Views) — 🟡 Yellow
Thin wrapper: 1 article on Import/Export, 4 on Managing CRM Views. Import/Export is CSV-based with column-mapping flow. CRM Views is where personalized default-views per user get saved.

### 2.5 Opportunities & Pipelines — 🟢 Green
An **Opportunity** is a sales-specific record that attaches to a Contact when there's a prospect of a deal. A **Pipeline** is a visual Kanban with Stages. Opportunities flow left-to-right across Stages. Four built-in statuses: **Open · Won · Lost · Abandoned**. Core fields on an Opportunity: contact (required), monetary value, source, owner (assignable user), stage, status, notes, tasks, custom fields.

**Setup sequence:** Opportunities → Create Pipeline → name stages → save → create Opportunity against a Contact → drag across stages as deal progresses. Multiple Pipelines can coexist; the "Pipelines List View" shows all of them. "Decouple Owners" (155000002273) indicates a Contact owner and Opportunity owner are independent — important for team-sharing models.

**Caramel Oven fit:** Wholesale pipeline (Prospect → Sample Sent → Price Agreed → First Order → Recurring), Catering pipeline (Inquiry → Consult Booked → Quote Sent → Deposit Received → Event Delivered → Follow-up).

**Features in Managing (14 articles):** Filter, Search, List View, Board View (Kanban), Customize cards, Multi-Opportunity-same-contact-same-pipeline, Color-Coding Smart Tags, Pipeline Permissions, Duplicate/Copy pipelines across sub-accounts, Opportunity Forecasting (two articles indicate this is a newer release).

### 2.6 Merge Fields & Custom Variables — 🟢 Green
Personalization primitive. Merge fields use double-curly-brace dot-notation syntax: `{{contact.first_name}}`, `{{user.email}}`, `{{appointment.start_time}}`, `{{location.phone}}`, `{{invoice.total_amount}}`, `{{right_now.day_of_week}}`.

Categories: **Contact · User · Appointment · Calendar · Campaign · Message · Account · Right Now · Attribution · Invoice · Course · Service Booking**. Raw variants exist (`{{contact.phone_raw}}` for formatting-stripped phone). Nested access works for Attribution (`{{contact.attributionSource.utmSource}}`). Available merge fields vary by context (an Email template in a Workflow has different fields than an Invoice template).

**Custom Values** (vs. Custom Fields) are sub-account-scoped constants — business name, hours, booking link, review link — interpolated into templates as `{{custom_values.<key>}}` (exact syntax TBD in guide phase). Custom Fields are per-record data extensions.

---

## 3. Communications

### 3.1 Conversations — 🟢 Green
The unified inbox across **Email · SMS · WhatsApp · Facebook Messenger · Instagram DM · Internal Comments** (team-only). One thread per Contact-per-channel, stitched into a per-contact conversation view. The composer lets you switch channels inline, paste/upload attachments, insert Snippets (pre-saved canned replies, 155000003707). Internal Comments with @mentions stay invisible to the customer. Drafts save automatically (155000003395). Group Chat for SMS across desktop+mobile (155000003973). Activity Cards surface related data inline (155000004603). Workflow actions "Log External Call" and "Instagram DM" send data in and out.

Conversations also exposes Filters (29 articles folder), Snippets, and the Right Panel sidebar showing Contact Details without leaving the thread.

### 3.2 Phone System — 🟢 Green
Deep-read resolved a critical misconception. HighLevel offers **two telephony layers**:

1. **LC Phone (LeadConnector Phone)** — HighLevel's **proprietary** first-party telephony (NOT a Twilio re-brand, which was my initial assumption — CORRECTED). One-click activation, native billing, transparent per-message/per-minute pricing, built-in sender ID/opt-out/DND, real-time analytics. 19 articles including "What is LC Phone?" (48001223546), pricing guide, suspension handling, KYC (UK), verified caller ID, SMS compliance, error codes, VoIP SIP support, call transcription.

2. **BYO Twilio** — connect your own Twilio subaccount (via SID/token). Supported but not recommended by default; HighLevel is migrating users to LC Phone.

**Sub-folders:** General (9), Calling (26), LC Phone System (19), Messaging (26), A2P registration (20), Voicemail (2), Phone numbers (20). **A2P 10DLC registration is mandatory** for US local SMS — two-step process: Brand Registration (Standard for EIN-holding business, or Sole Proprietor for unregistered) → Campaign Registration (tying the brand to a specific messaging purpose with opt-in language + sample messages). Toll-free numbers do not require A2P 10DLC. Canadian numbers have separate requirements (155000004915). The 20-article A2P folder covers fees (registration + monthly + carrier), throughput/Trust Scores, rejection reason decoding, AI-powered compliance validation, Pre-Built campaigns (widget-first flow).

**Phone numbers** (20 articles) — buying local, toll-free, porting existing numbers, moving numbers between sub-accounts, Voice Integrity reputation, 2FA-mandated updates.

### 3.3 Email — 🟡 Yellow
Similar two-layer pattern:
1. **LC Email** — HighLevel's managed delivery (21 articles: dedicated domain/IP, DMARC auth, SSL, bounce suspension, verification, dedicated-IP white-label, SMTP credentials, domain warmup, Postmaster Tools).
2. **MailGun** (16) or **SMTP Providers** (10) — BYO delivery.

**Deliverability** (11 articles — not a deliverability tool, but the educational/operational guide) covers SPF/DKIM/DMARC, Google/Yahoo 2024 sender requirements compliance, list-unsubscribe, spam-folder triage, Preference Management (user-controlled unsubscribe granularity).

**General** (9) covers Sending Priority (which email address "wins" as From), Reply/Forward settings, Email Stats filtering, Bot Detection (prevents fake opens from inflating stats), Email AI Beta 2.0 ("Create On-Brand Emails Faster"), Smart Send Time Optimization.

**Troubleshooting Email** (9) + **Email Delivery Troubleshooting** (6) are diagnostic dumping grounds.

### 3.4 Notifications — 🟡 Yellow
Just 4 articles: Activate Notifications, Sales & Use Tax FAQ (???), Custom Notifications for Sub-Account Users, Live Chat Notifications. Lean folder.

---

## 4. Scheduling

### 4.1 Calendars & Appointments — 🟢 Green
Ten sub-folders, 106 articles — one of the densest feature areas. **Calendar types** (in a sub-folder under Creating Calendars): Service · Event · Rentals · Collective/Round-Robin · Class. Plus the richer **Services** surface.

**Services** (13 articles) is a **separate, enhanced booking system** layered on top of the basic Calendar module. Services supports multi-service booking with paid add-ons, resources (rooms/equipment), staff-specific pricing, tax config, and integrated payments via Stripe/Square/Razorpay/Authorize.net/NMI at the booking modal. Enabling Services is a toggle in Sub-Account > Calendar Settings (either single sub-account via 3-dot menu, or Bulk Actions > Setup Calendars for many). Version-tagged "v2" references indicate Services is a newer replacement for legacy patterns.

**For Caramel Oven:** Services is a strong fit for "Special Order Consultation" (30-min paid consult with staff selection + add-on for rush fee), "Catering Tasting" (1-hour with room resource), etc. Simple "booking a single appointment slot with one baker" can use the basic Calendar.

**Creating Calendars** (26): sub-folders for Calendar Types, Service Menus, Rooms & Equipment, Customizing Calendars. 16+ articles on specific controls: seats-per-slot (classes), pre/post buffers, consent checkbox, Google Organic Booking, widget customization, one-time links, availability (weekly vs date-specific hours), partial payment deposits, cancellation/reschedule policy, multiple meeting locations.

**Calendar Settings & Preferences** (14): Linked/Conflict Calendars, Email/SMS/WhatsApp appointment notifications, Recurring appointments, PayPal in calendars, Voice AI multi-calendar booking, Klarna/Affirm BNPL on calendars.

**Scheduling Appointments** (9): Manual booking, Appointment Notes sync, List View, Book Appointment Workflow Action, Appointment Side Drawer for form submissions, Coupon Codes on calendars, Payments Tab.

**Calendar Integrations** (13): iCloud, Calendly, Outlook, Google Cal, Zoom, MS Teams, Stripe-on-calendar, Reserve-with-Google. Two-way sync means external-calendar busy times block HighLevel availability.

**Troubleshooting Calendars** (10) and **FAQs** (2) are supporting diagnostics.

**Calendar Groups** (5) and **Rentals** (11) are specialized surfaces — Groups for departmental calendar clusters, Rentals for time-blocked resource rental (not appointment bookings).

---

## 5. Automation

### 5.1 Workflows — 🟢 Green
HighLevel's flagship feature. A Workflow is a trigger-driven automation: when **Trigger event** fires, execute a tree of **Actions** (with Waits and If/Else branches). Setup flow (verified from deep-read):

1. Navigate to Automation → Workflows
2. Click "+ Create Workflow"
3. Choose approach: Recipe / Template / Start from Scratch
4. Select a Trigger (Contact created, Form submitted, Appointment booked, Tag added, Pipeline stage change, Payment received, etc.)
5. Add Actions (Send Email, Send SMS, Wait, If/Else, Update Contact Field, Assign to User, Book Appointment, Create Opportunity, Send Webhook, etc.)
6. Save
7. Test with "Test Workflow" button before publishing

**Trigger folders (12 sub-folders under Workflow Triggers):** CRM · Events · Appointments · Courses · Payments · Shopify · IVR · Facebook/Instagram Events · Communities · Forms and Surveys · TikTok · LinkedIn.

**Action folders (15 sub-folders under Workflow Actions):** CRM · Communication · Send Data · Internal Tools · Workflow AI · Appointments · Payments · Affiliate · IVR · Memberships & Communities · Social Media Communication · Integrations · Webhooks · Data Management · Documents & Contracts.

Notable specific actions enumerated: Update Contact Field (scalar + date), Math Operation, Edit Conversation, Goal Event, Date/Time Formatter, Number Formatter, Google Sheets (Premium), Custom Webhook (with OAuth2 credential mgmt), Slack, Inbound Webhook Trigger (Premium), Send Email using AI.

**Workflow Builder** (57) includes race-condition troubleshooting, folder permissions, MMS with Custom Values, Deprecated Campaigns/Triggers comparison, copy-workflow-across-sub-accounts. The **"Workflows vs Campaigns/Triggers (Deprecated features)"** article (48001229927) confirms my assumption: Campaigns and legacy Triggers are deprecated — **Workflows is the current canonical automation surface**.

**Workflows Landing Page** (155000004871) is a newer onboarding experience. **Nested Folders** (155000001684), **Advanced Filters & Smart List** (155000003974), **Comprehensive workflow stats** (155000003972), **Execution Logs & Enrollment History** (155000003992), **Highlighting & Resolving Errors in a Workflow** (155000004872) — all load-bearing operational surfaces for serious workflow authors.

**Pricing tier:** "Workflows Pro Plan" (155000003971) indicates Premium Workflow features (Custom Webhook OAuth2, Inbound Webhook Trigger, Google Sheets action, Date/Time Formatter, External AI Models) sit behind an upgrade.

**Workflow Recipes** (3 articles) — Instagram Comment Automation, Facebook Comment Automation, Facebook comments + Workflow AI. These are reference builds, not a full pattern library.

### 5.2 Logic & Fulfillment — 🟡 Yellow
40-article folder. First page includes Triggers, Contact Flow, Campaigns (legacy), Stale Opportunity Trigger, Retrieving FB Leads, Custom Audience Trigger, Manychat Integration, Auto Update Pipeline Stage, Appointment Reminders, Event Start Date Campaigns. Reads like a mix of legacy-Campaign recipes + Zapier integration patterns. Given Campaigns are deprecated, treat as historical/pattern-reference material.

### 5.3 AI Employee — 🟡 Yellow (overview); 🟢 Green for Content AI (PROMOTED 2026-04-17); 🔴 for Voice/Conversation/Agent Studio depth
Deep-read of "AI Tools in HighLevel" (155000002166) clarified the catalog:

- **Content AI** 🟢 — generates social posts, emails, headlines, blogs, website copy. Deep-reads completed 2026-04-17 of: (a) "How to create a Social Post with Content AI" (48001234788), (b) "How to create Emails using Content AI" (48001236751), (c) "Brand Voice Integration in Content AI" (155000005308). See operational detail block below.
- **Reviews AI** — suggests or auto-pilots responses to customer reviews.
- **Conversation AI** — trained chatbot handling inquiries, FAQs, appointment booking. Has a Flow Builder (155000006515) and Agents Dashboard. Can respond to images (155000006537) and audio (155000006650).
- **Voice AI** — AI phone agents that answer calls, work off trained knowledge bases, book appointments, handle multi-language, integrate with Twilio numbers.
- **Workflow AI** — meta-layer for AI-driven workflow actions (premium).
- **External AI Models** — ChatGPT/OpenAI/Anthropic connections for custom prompts.
- **Ask AI** — in-product assistant.
- **AI Studio / Agent Studio / Email AI / MCP Server** — newer tooling. MCP Server (Model Context Protocol) — see STRATEGIC_FUTURE.md — lets AI agents access external apps/DBs (shipped 2026-04-17). Strategic-future relevance for PitchBlack scaling; NOT Caramel Oven scope.
- **Knowledge Bases** — documents/URLs trained into AI agents, with Web Crawler, auto-refresh of trained links, rich-text support.

**Pricing:** hybrid. Some features free, others usage-based. **Email Content AI: $0.09 per 1,000 words, first 500 words/sub-account complimentary.** Rebilling available on the $497 Agency Pro plan but "not for every AI feature."

**Content AI operational detail (🟢 deep-read output):**
- **Social Planner flow:** Marketing → Social Planner → + New Post → Content AI → pick platform (FB/IG/LinkedIn) + content type (Post/Reel) → review auto-filled Brand Voice → fill message + CTA fields → Generate → schedule/publish. Per-platform generation; no multi-platform batch.
- **Email Builder flow:** Marketing → Emails → Email Campaigns → new/edit → Email Builder → Text Block → click Content AI button above editor → pick Context (Promotional / Introduction / Coupon/Discount / Recurring Newsletter / Testimonials / Cold Outreach / Content-Giveaways / Other) → Content Title → Description (up to 3 lines) → Writing Tone → Number of Variations → Generate (5-10 sec) → Copy → Continue. Content AI also available on subject line via send/schedule screen.
- **Brand Voice:** Prerequisite is "How to Set Up Brand Voice" in the Brand Board. Auto-fill toggle applies saved parameters; manual overrides take priority. Multiple Brand Voices per sub-account allowed. Used across Social Planner, Blogs, Email Builder, Funnels & Websites. Updates via Brand Boards propagate to Content AI automatically.
- **For Caramel Oven:** Brand Board + Brand Voice setup is a prerequisite section (lives in Part 2 of the Phase 3 sequence). Content AI section comes AFTER Brand Board is configured. Content AI deliverables: drafted social post variations per FB/IG post, email body copy for recurring newsletter + promotional emails + review request templates.

For Caramel Oven: **Content AI IN SCOPE (phase 2 adjustment).** Reviews AI can be auto-pilot for positive reviews on Google (via Review Request workflow). Voice AI, Conversation AI are OPTIONAL. AI Studio / Agent Studio / MCP Server are STRATEGIC_FUTURE (PitchBlack scaling, not Caramel Oven).

### 5.4 Eliza Agent Platform — see STRATEGIC_FUTURE.md
6 onboarding articles. Moved to STRATEGIC_FUTURE.md per Phase 2 review. Relevance to Caramel Oven: none. Relevance to PitchBlack long-term: high (custom agent authoring for premium client deliverables).

### 5.5 App Marketplace — 🟡 Yellow
5 sub-folders: Get Started (7), View/Install/Uninstall (5), Workflow Triggers & Actions (3), Snapshots in App Marketplace (2), Conversation AI and Voice AI Templates (1). Surfaces third-party integrations as Workflow items AND as installable Snapshots. Distribution can be Agency-level or Sub-Account-level.

---

## 6. Web Presence

### 6.1 Sites — 🟡 Yellow
17 sub-folders, 304 articles — the single largest feature surface. Organized into:

- **Funnels and Websites** (115 articles across 3 sub-folders: FAQs/Troubleshooting · Settings · Builder). Funnels are multi-page conversion flows; Websites are arbitrary-page sites. Shared builder. Key patterns: Two-Step Order Form (with pop-up scheduling and thank-you-page redirects, covered across several articles), Click-To-Call/Text/Email buttons, Tracking Scripts/Pixel Code, SEO Meta Data + Custom Meta Tags, Dynamic Text (merge fields in page body), Custom Values on Buttons, Sticky Contact (preserves form progress across pages), Navigation Menus, Import-from-ClickFunnels, Desktop vs Mobile preview.
- **Forms** (42) — standalone forms with Conditional Logic v2, Themes, Payment element, SMS verification, Custom HTML/JS, Math Calculations, Consent checkboxes (GDPR), Email Validation. Forms auto-create Contacts on submission.
- **Surveys** (11) — multi-step questionnaires with Conditional Logic v2, One Question at a Time mode, Order Bumps on payment-collecting surveys, Create-Contact-on-Partial-Completion.
- **Chat Widget** (26) — embeddable live-chat with 7 chat types (Live Chat, Email/SMS, FB, IG, Voice AI, WhatsApp, All-In-One). Install generates a JS snippet; direct inclusion on HL Funnels/Websites/Blogs OR embed on Wix/Shopify/Squarespace/Duda/Weebly/WordPress via snippet or GTM. Four config tabs: Style · Chat Window · Messaging · Agent (AI types). Conversations route into the unified inbox.
- **Blog** (25) — WordPress-style blogging with Canonical URLs, Sitemap, RSS, Categories, Author blocks, Preview, Schedule, Blog Post Element on Funnel pages, cross-sub-account blog sharing via Snapshot, Import via URL, Table of Contents, Hero/Featured Post, Template Library.
- **WordPress** (45) — sub-folder for WordPress-hosted-by-HighLevel. Out of scope for Caramel Oven.
- **QR Codes** (10) — generator (vCards, Business Card, Review-linked, Website-linked), Bulk creation.
- **Stores** (1) — the "store element" within Sites; separate from full E-commerce category.
- **Analytics (Funnels, Websites, & QR)** (6) — built-in traffic and conversion analytics.
- **Quizzes** (7) — gamified forms with scoring, dynamic results, personality-style, template library.
- **Webinars** (2) — newer surface.
- **Custom Objects (in Sites)** (2) — Custom Object data displayed on sites.
- **SEO** (9) — Keyword Research, Rank Tracking, Local SEO w/ Heatmaps, Site Audit, Content Creation/SEO Assistance. HighLevel positions this against Ahrefs/SEMrush (155000005054).
- **Client Portal (sub-folder under Sites)** (1) — the sites-level placement; main Client Portal category is top-level.
- **General Setup** (2), **Privacy Policy** (1), **Troubleshooting Funnels** (9).

### 6.2 E-commerce Store — 🟡 Yellow
40 articles. Full ecommerce module with Stripe-backed checkout, Shipping Profiles, Printful/Printify integrations (print-on-demand), Manual Payment Method, Product Collections, Inventory Management, SEO fields, Related Products, Search Bar, Abandoned Checkout recovery emails, Product Labels/Ribbons, Packing Slips, Weights/Dimensions/SKU, Subscription-based products.

---

## 7. Marketing (outbound)

### 7.1 Marketing — 🟡 Yellow
10 sub-folders, 127 articles.
- **Social Planner** (53) — scheduled posts across FB, IG, LinkedIn (profile + business page), TikTok, Pinterest, Twitter, Google My Business. Watermarking, Auto-Image-Optimization, Hashtag Groups, Recurring Posts, RSS scheduling, Location Tagging, @Mentions, Follow-Up Comments, Group Social Profiles. Template Library (155000003329) for the Social Planner.
- **Email Marketing** (6) — distinct from transactional/Workflow email. 5 sub-folders: Campaigns, Statistics, Templates, Others, Sequences (Private Beta). 1 top-level article: Exporting Email Marketing Data. Campaign = broadcast send to a Smart List (recipient computed at send-time).
- **Ad Manager** (10) — paid ad management directly in HighLevel. 8 sub-folders (Getting Started, Setup, Campaign Creation/Mgmt, Facebook CAPI, Reselling, Troubleshooting, Google Ads, LinkedIn Ads). The breadth suggests this is a richer feature than I expected; Dan/Claude Chat should discuss whether to include it in Caramel Oven scope (paid ads = real budget).
- **Template Library** (19) — cross-functional asset repository (emails, funnels, forms, etc.). Favorites, Share across agencies, Hide templates by type/tag, Extended Access by plan, Category management. Applies to Social Planner, Webinars, Ads Manager, Workflows.
- **Trigger Links** (1) — click-tracked links that fire workflow triggers on click (e.g., "yes" vs "no" CTAs in an email that route to different flows). Light doc coverage suggests simple mental model.
- **SMS & Email Templates** (3) — Snippets (canned SMS / email bodies) referenceable in composer, templates, and workflows. Can import from Kajabi.
- **Brand Board** (10) — centralizes brand colors, fonts, logos, Brand Voice. Reads into emails, funnels, forms, surveys, quizzes. Brand Voice can be derived from text or a URL (155000007263).
- **Affiliate Manager** (6 sub-folders) — agency's affiliate program (not to confuse with HighLevel's own affiliates program). Getting Started, Campaigns, Managing Affiliates, Payouts, Automation, Reporting & Insights.
- **AI Appointment Booking Bot** (2) — legacy pattern now superseded by Conversation AI + Calendars.
- **Countdown Timer** (17) — Dynamic and Fixed timer widgets for emails and funnels, Recurring timers, Apple Mail hiding behavior, Timezone adaptation.

### 7.2 Memberships & Communities — 🟡 Yellow
- **Membership/Courses Sites** (37) — gated courses with video lessons (supports closed captions, video-frame-as-thumbnail, third-party embedded media), assessments/quizzes, drip content, comment management, revenue analytics, PWA white-label app support, email notification prefs.
- **Communities** (36) — forum-style discussion areas with Private/Public groups, Pinned Posts, Paid Groups, Paid Courses inside communities, Learning Tab, Gamification (Points/Badges/Leaderboards), Custom CSS/JS, GIFs, Community Chat, transfer ownership, member approval questions.

Caramel Oven fit: A "Baker's Club" subscription community (paid group with monthly recipe content + private chat) is technically feasible. OPTIONAL for initial build.

### 7.3 Reputation Management & Reviews — 🟢 Green
**Review Requests (32 articles)** — core flow: trigger a templated SMS + email to a customer asking them to review on Google My Business (primary) or Facebook or any third-party review URL. Sent manually via sidebar Quick Actions or Reputation tab > Requests, OR via Workflow action "Send Review Request" on a selected channel. When a Contact has an Assigned User, the review request appears to come from that user. Request delivery is tracked (queued/sent/delivered/failed). Customization guide, Reviews AI Suggestive+Auto-Pilot modes, Digital QR for review generation, review request via WhatsApp, spam detection, Balancing Across Platforms. **Prerequisite:** Google My Business must be integrated (via Google Integrations folder) AND review request feature enabled in sub-account settings.

**GBP Optimization (2)** — optimize the Google Business Profile directly in HighLevel + GBP Post Scheduler. **Listings (2)** — Food/Healthcare Add-Ons + Automated Listing Performance Reports. **Competitor Analysis (1)**. **Video Testimonials (1)**.

For Caramel Oven (local farmers-market bakery), this is HIGH-VALUE and HIGH-PRIORITY. Automated post-purchase review request → Google review → feeds back into local SEO for farmers-market search traffic.

---

## 8. Monetization

### 8.1 Payments — 🟢 Green (core flows); 🟡 Yellow (all payment integrations)
Deep-read of Invoices and Payment Links confirms core flows.

**Invoices** (29 articles) — Payments → Invoices → New → edit sender info → select client → set Invoice/Issue/Due dates → Add Item(s) (pulled from Products list) → adjust quantities/pricing → apply taxes/discounts → Send (green button, top right, sends via email+text). Statuses tracked (Draft, Sent, Paid, Overdue, Void). Recurring invoices supported, with editable payment schedules and partial-payment flexibility. Test mode. PDF generation. Opportunity-invoice linking. CSV import. Xero and QuickBooks integration options. Apple Pay/Google Pay on invoices. ACH Debit. Flexible Payment Plans. Auto-generate from signed Documents & Contracts.

**Payment Links** (5) — fast checkout flow without the invoicing overhead. Payments → Payment Links → Create New → pick product → configure quantity/options → Save → Send. Sharing options: generic link · personalized link · send to contacts. Text-To-Pay via SMS (48001202185). Brand color customization. Multi-product support (one-time + recurring in same link).

**Products, Taxes & Coupons** (8) — Products list is the master catalog consumed by Invoices, Payment Links, Order Forms, Calendars-with-payment, Surveys-with-payment, Forms-with-payment. Bulk Import via CSV, Import from Stripe, Automatic Tax Category IDs, Smart Collections, Product Cost Price & Margin tracking. Coupons are a separate folder entry.

**Orders, Subscriptions, and Transactions** (10) — subscriptions auto-retry on failed payments, can be paused/resumed/modified. Shipping Profiles for ecommerce. CSV export of transactions/orders/subscriptions.

**Payment integrations** (15) — Providers supported: Stripe (primary, deepest), PayPal, Authorize.net, NMI, Razorpay (India), Square, Adyen, Mercado Pago. Managed-Payments article (155000006075) maps which provider works where across product areas.

**Mobile Payments (Tap-to-Pay)** (1) — single article for the in-person payment flow.

**Documents & Contracts (Payments sub-folder)** (2) + **Documents and Contracts (top-level)** (28) — e-sign templates with multiple recipients, signing order, Custom Values, Document Expiration, auto-generate Invoice when signed, attachments, tip-accept on invoices.

**Gift Cards** 🟢 (4 articles, inventoried 2026-04-17; deep-reads deferred to Phase 3 section 16). **IN SCOPE per Phase 2 adjustment.** Location: Payments → Gift Cards. Create: Products-like configuration (artwork, denominations, expiry, terms). Sell via: dedicated checkout links · embed code · QR codes · added to existing checkouts. Send: issue gift card without purchase (one-time prepaid credit delivered via email / SMS / PDF / QR). Track: Gift Card Dashboard under Payments → Gift Cards. For Caramel Oven: Mother's Day / Valentine's Day / Christmas seasonal driver. Gift Card articles: Getting Started with Gift Cards (155000006980) · Track Performance (155000006981) · How to Sell (155000006986) · How to Send (155000006987).

### 8.2 Certificates — 🔴 Red
4 sub-folders: Templates, Issue Certificates, Cloning, Issue Badge. Digital credentials for course completion / event attendance. OPTIONAL for Caramel Oven.

### 8.3 Client Portal — 🟡 Yellow
20 articles. Customer-facing dashboard where a HighLevel-registered customer can see their invoices, appointments, memberships, courses, community threads, estimates, contracts. Has SSO Magic Links, Notification Preferences, Branded Mobile App (iOS/Android), Custom Mobile Notifications, Chat Widget integration, Builder Enhancement Pack. For wholesale customers, a Client Portal where they can view orders + invoices is a natural fit.

---

## 9. Agency / SaaS Layer

### 9.1 SaaS Configurator (SaaS Mode) — 🟡 Yellow
53 articles. Deep feature set for agencies white-labeling HighLevel as their own SaaS: Plan tier config, Stripe Checkout pages, Trial management, Twilio Rebilling, Email Rebilling, Card Auth, Upgrade/Downgrade flows, Pause/Resume sub-accounts, currencies other than USD, AI rebilling, Premium Action visibility by plan, Workflow action rebilling.

Out of scope for the Caramel Oven **sub-account** build, but the guide's framing will briefly acknowledge where Caramel Oven sits within the agency's SaaS structure.

### 9.2 Account Snapshots — 🟢 Green
**Critical for Caramel Oven build speed.** A Snapshot packages sub-account configuration for re-deployment. Based on deep-read:

**What a Snapshot can include:** Workflows · Pipelines · Calendars · Tags · Custom Fields · Custom Objects · Funnels/Websites · Templates · Custom Reports (on $297+ plans) · Voice AI Configuration · Email templates · Forms/Surveys/Quizzes. Selective-asset snapshots supported (155000005146).

**What does NOT transfer:** Schedules and recipient lists for Custom Reports · Private dashboards · Data-source integrations (those must be re-connected in destination) · Contact/Opportunity DATA (snapshots are templates, not data).

**Core flow:**
- Create: Agency View → Account Snapshots → Create New Snapshot → select source sub-account → select assets → Save.
- Load into existing sub-account: Agency View → Sub-Accounts → Actions → Load Snapshot → pick snapshot + assets → wait for bell-icon confirmation.
- Load into new sub-account: Create New Sub-Account → Choose Snapshot at creation time (155000005762).
- Push updates: Selective push to individual or bulk sub-accounts (155000005416, 155000004171).

24-article Snapshots folder + 15-article Industry Snapshots (pre-built, agency-maintained): Marketing Agency, Chiropractor, Dentist, Real Estate Agent, Steakhouse, Gym, Hair Salon, Family Law, Career Coaching, Automotive Detailing, Web Designer, Bookkeeper, Plumbing, Insurance, Travel Agency.

> **Caramel Oven note:** NO bakery or farmers-market snapshot. Closest: Steakhouse (restaurant-adjacent) or Hair Salon (local-services-with-appointments). Our Phase 3 guide will build from scratch AND may package the result as a reusable "Bakery / Farmers-Market Vendor Snapshot" — this becomes the agency's compounding asset per the directive's "Your outcome" section.

### 9.3 Reselling Products — 🔴 Red
4 sub-folders, 118 articles.
- **Online Listings** (23) — Yext-style directory listings resale.
- **WhatsApp** (91) — massive folder; WhatsApp Business Solution Provider integration/onboarding, templates, campaigns, flows. Scope: OPTIONAL for Caramel Oven unless they have international farmers-market customers.
- **Client Portal Branded Mobile APP** (1) — white-label mobile client portal.
- **Reselling** (3) — general reselling mechanics.

### 9.4 HighLevel Affiliates Program — 🔴 Red
20 articles on being an affiliate (promoting HighLevel for commissions). Includes First Steps, Promoting as Affiliate, Setting up First Promoter webhooks, Affiliate Portal, Brand Kit, Payouts, 1099 completion, Commander Program, Split Commissions, 3DS card support. Agency-tier concern, not in Caramel Oven scope.

### 9.5 Agency Reporting / Industry Guides — 🟡 Yellow
- **Rolled Up Reporting** (3) — cross-tenant aggregated metrics for agencies.
- **Industry Playbooks** (18 articles). Restaurant/Bar playbook (155000000967) was deep-read 2026-04-17 per D-4 resolution. **Finding: the playbook is thin.** It lists recommended tools (Missed-Call Text-Back · Conversation AI for bookings · Review Request automation · Newsletter · GBP integration · SMS Webchat Widget · Paid Appointment Calendars · Text Snippets) without any pipeline stages, specific workflow recipes, form/field guidance, catering patterns, or snapshot reference. **Three patterns worth adopting for Caramel Oven (all already in SC-1):** (a) Missed-Call Text-Back as foundational workflow, (b) GBP-centric review solicitation, (c) Text Snippets for operator efficiency. The Restaurant/Bar playbook is a tool list, not a blueprint — Phase 3 builds from scratch. Other playbooks (Hair Salon 155000000957, Home Service 155000000961) may surface additional patterns; deferred unless Phase 3 demands.

---

## 10. Analytics & Reporting

### 10.1 Dashboards — 🟡 Yellow
4 sub-folders, 41 articles. In-sub-account dashboards made of Widgets (Opportunities, Pipeline Value, Conversion Rate, Funnel, Stages Distribution, Payments, Sales Efficiency). Custom Dashboard creation, Permissions, Clone to Sub-Account, Pin Favorites, Timezone switching, Load via Snapshot, "Only Assigned Data" setting, Quick Filters, Dashboard Summary AI. Widgets: Create, Customize, Edit, Resize, Rearrange, Remove, Duplicate, Table Charts, Embed External Content, UTM-filtered widgets, Titles/Images/Text Boxes, Sales Efficiency Widget, Insight Widgets from Key Pages, Custom Metrics.

### 10.2 Reporting — 🟡 Yellow
- **Tracking & Attribution** (22) — Attribution Source understanding, Google Ad Reporting (setup, terminology, precautionary script, troubleshoot, Pageviews into GA4), Client Spend addition, Offline Conversion Actions, Facebook Ad Reporting (same set), Chat Widget Attribution, Google Analytics 4 Tracking, Call Reporting, Appointment Report, Agent Reporting.
- **Custom Reports** (2) — $297+ plan feature.
- **Marketing Audit Reports** (2) — automated audit PDFs.

---

## 11. Integrations

### 11.1 Integrations — 🟡 Yellow (most integrations); 🟢 Green for Google/Stripe/Zapier
11 sub-folders. Key findings:
- **Google Integrations** (5) — GBP (Google Business Profile), Google Drive in Media Storage, Communication/Social via GBP, Google Lead Ads Integration. GBP is the biggie for Caramel Oven.
- **Stripe Integration** (2) — Connect Stripe to Sub-Account + Stripe One Time Charge trigger. Stripe is primary payment rail.
- **Facebook Integration** (22) — FB Token expiration, Multi-Page connect, Conversion Leads, Conversion API (CAPI), Domain Verification, Lead Ad Integration + troubleshoot, Instagram DM, page-missing diagnostics, multi-page CTA/Sync troubleshoot.
- **Zapier Integration** (5) — Duplicate contact troubleshoot, Zap not working troubleshoot, Create Tags/Tasks via Zapier, ServiceTitan + GHL, Connect Sub-Account with Zapier.
- **QuickBooks** (1), **Shopify** (3), **TikTok** (2), **Jobber** (1), **Online Listings** (1), **Private Integrations** (1), **Other** (11 — ActiveProspect Consent, Zoom, Reserve with Google Webinar, WebinarKit, Two-Way Outlook/Gmail Sync, LinkedIn Lead Ads, Printify).

### 11.2 Developer Resources — 🟡 Yellow
18 + 3 articles across two sub-folders. The **REST API v2** is documented externally at `marketplace.gohighlevel.com/docs/`. Scope summary:
- Auth: OAuth 2.0 (Authorization Code Grant for Marketplace apps) + Private Integration Tokens (static, single-account).
- Resources: CRM & Contacts · Conversations · Calendar & Events · Opportunities · Payments · Webhooks · Locations (the sub-account object).
- Rate limits: 100 req/10s burst + 200,000/day per Marketplace app per Location/Company.
- Webhooks: 50+ event types.
- V1 API end-of-support: 2025-12-31. All new work uses V2.

Unlikely to be needed for Caramel Oven's initial build, but relevant context for "extensions" chapter in the guide.

### 11.3 Add-ons & Sales Trainings — 🟡 Yellow
- **Whitelabel Desktop App** (1) — white-label the desktop app.
- **Compliance** (add-on sub-folder, 1 article) — distinct from top-level Compliance.
- **Sales Trainings and Case Studies** (26) — how to sell HighLevel. 20 articles on page 1: SaaS Mode prep, qualifying demos, selling websites, strategy session presentation, closing calls, case studies (websites/FB Ads/Google Ads/Social Media/Funnel Advertising), SaaS Demo, Add-ons Quick Reference, Sales Management, KPIs, Prospecting via SaaS Audits, "Idea to 7 Figures," SaaS Adoption Strategies, 10k 10-Day Workshop with Joel Kaplan. Agency-tier value; feeds the Phase 5.1 case study tooling.

---

## Axis 12 — Recent platform velocity (changelog snapshot 2026-04-18)

Recent-10 release pace (from ideas.gohighlevel.com/changelog):
- 2026-04-18 — New Templates (web/email/form/survey/social/Google Ads templates, multi-industry)
- 2026-04-17 — WhatsApp × ASK AI (NL interface for WA template/campaign/flow creation)
- 2026-04-17 — AI Agent Token Usage Optimization (20-36% reduction)
- 2026-04-17 — **MCP (Model Context Protocol) Tool Support** — AI agents can now access external apps/DBs/search engines via MCP-compatible servers
- 2026-04-17 — AI Agent Full Conversation History Access
- 2026-04-17 — Location-Level Breakdown for Reselling (new dashboard widget)
- 2026-04-17 — AI Studio Enhancements & Fixes
- 2026-04-17 — Newsletter Time Configuration in Communities (custom send times with timezone)
- 2026-04-17 — Smarter End Date Selection (Rentals calendar UX)
- 2026-04-16 — Drag & Drop Workflow Nodes

**Takeaway:** HighLevel ships roughly daily. The AI Employee/Agent layer is the fastest-moving surface. Any Phase 3 guide section touching AI or MCP will carry a shorter half-life than a guide section on Contacts/Workflows/Calendars. Phase 5.2 Update Protocol must address this asymmetry.

---

## Ingestion status dashboard (Phase 1 close)

| Section | Folders | Articles | Confidence |
|---|---|---|---|
| 1. Platform Foundation | 22 | ~150 | 🟡 Yellow (breadth good; depth for build-guide TBD) |
| 2. CRM Core | 24 | ~95 | 🟢 Green (Contacts, Smart Lists, Ops, Merge Fields deep-read); 🟡 Yellow (Custom Objects, Companies) |
| 3. Communications | 22 | ~250 | 🟢 Green (Conversations, LC Phone, A2P, Chat Widget deep-read); 🟡 Yellow (Email deliverability specifics) |
| 4. Scheduling | 10 | 106 | 🟢 Green (Services deep-read; folder-level breadth across all calendar surfaces) |
| 5. Automation | 27 | ~320 | 🟢 Green (Workflows intro deep-read; 12 trigger + 15 action sub-folders enumerated); 🟡 Yellow (Logic & Fulfillment, AI Employee each area); 🔴 Red (Eliza specifics) |
| 6. Web Presence | 18 | ~345 | 🟡 Yellow (Chat Widget deep-read; Funnels/Forms folder enumerated but paginated) |
| 7. Marketing | 17 | ~240 | 🟡 Yellow (catalog mapped; specific campaign mechanics need depth reads when writing guide) |
| 8. Monetization | 16 | ~180 | 🟢 Green (Invoices, Payment Links, Products deep-read); 🟡 Yellow (each provider integration) |
| 9. Agency/SaaS | 13 | ~170 | 🟢 Green (Snapshots deep-read); 🟡 Yellow (SaaS Mode, Industry Playbooks cataloged); 🔴 Red (WhatsApp 91 articles — sampled) |
| 10. Analytics | 7 | ~65 | 🟡 Yellow (Dashboards folder enumerated; Widget catalog partial) |
| 11. Integrations | 16 | ~75 | 🟢 Green (Google/Stripe/Zapier); 🟡 Yellow (Facebook, Other); 🟡 Yellow (Dev API — external portal mapped) |
| **Orientation / System Architecture** | — | — | 🟢 Green |
| **TOTAL** | **~160** | **~2,050** | **🟡 Yellow (enterprise-wide); with Caramel-Oven-critical areas at 🟢 Green** |

---

## What Phase 1 did NOT resolve

The following remain at 🔴 Red or limited confidence and are flagged in ASSUMPTIONS.md for Phase 3 deeper-reads as needed:
- **Eliza Agent Platform** — not deep-read.
- **AI Studio / Agent Studio / MCP Server** — newly released, limited doc coverage yet.
- **WhatsApp** full 91-article folder — skimmed for existence, not deep-read.
- **SaaS Mode** 53 articles — skimmed; full agency-tier configuration for Caramel Oven's hosting agency is out-of-scope for the sub-account build.
- **Funnels & Websites Builder mechanics** — 115-article folder enumerated page 1; guide will need depth reads for specific elements (Forms, Products, Navigation, Checkout).
- **Legacy Campaigns + Logic & Fulfillment** — partial depth; primary conclusion confirmed (Campaigns are deprecated in favor of Workflows).
- **Paid Ad specifics** (Ad Manager) — folder-level only.
- **Customer Support / Software Migration Guides** (18) — inventory only.

**None of these gaps block Phase 2 review.** They are scoped to resurface during Phase 3 section writing.

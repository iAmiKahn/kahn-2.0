# RAW_INGESTION_LOG — HighLevel Documentation Audit

Append-only record of every page fetched. One row per WebFetch/WebSearch. Goal: never double-fetch, always know what material has been consumed.

| Date | URL | Purpose | Outcome |
|---|---|---|---|
| 2026-04-18 | help.gohighlevel.com/support/home | Top-level category enumeration | 8 categories confirmed + popular-article list |
| 2026-04-18 | help.gohighlevel.com/support/solutions | Complete solution-category listing | 45 categories, ~160 folders, ~2,050 articles enumerated |
| 2026-04-18 | help.gohighlevel.com/support/sitemap.xml | Article-ID enumeration | 100+ article numeric IDs, 200+ folder IDs — titles not extractable from XML alone |

---

## Session 1 — 2026-04-18 — Phase 1 kickoff ingestion plan

### Wave 1: Foundation & Getting Started (sets the frame, helps calibrate vocabulary)
- Getting Started / Foundational Setup (9)
- Getting Started / Marketing & Lead Generation (3)
- Getting Started / Sales & Conversations (3)
- Getting Started / Website & Content (3)
- Getting Started / Commerce (6)
- Agency View / Sub-Accounts (3)
- Agency View / Account Snapshots (1)
- Settings / Sub-Account Settings (12)
- Settings / Agency Settings (15) — skim
- Settings / User Settings (12)

### Wave 2: Caramel-Oven-critical feature spine (deep read)
- Contacts / Getting Started with Contacts (1)
- Contacts / Contacts (7)
- Contacts / Smart Lists (21)
- Contacts / Contact Details View (4)
- Contacts / Bulk Actions (7)
- Conversations / Conversations (29)
- Conversations / Manual Actions (2)
- Calendars / Getting Started w/ Calendars (3)
- Calendars / Creating Calendars (26)
- Calendars / Services (13)
- Calendars / Calendar Settings & Preferences (14)
- Calendars / Calendar Integrations (13)
- Calendars / Scheduling Appointments (9)
- Opportunities / Introduction (2)
- Opportunities / Getting Started (8)
- Opportunities / Managing (14)
- Workflows / Getting Started w/ Workflows (38)
- Workflows / Workflow Builder (57)
- Workflows / Workflow Triggers (34)
- Workflows / Workflow Actions (24)
- Workflows / Workflow Recipes (3)

### Wave 3: Channel layer
- Phone / General (9)
- Phone / LC Phone System (19)
- Phone / Messaging (26)
- Phone / A2P registration (20)
- Phone / Phone numbers (20)
- Email / General (9)
- Email / LC Email (21)
- Email / Deliverability (11)

### Wave 4: Web presence (for funnel + form + chat widget)
- Sites / Funnels and Websites (115) — will sample, not exhaustive
- Sites / Forms (42)
- Sites / Surveys (11)
- Sites / Chat Widget (26)
- Sites / QR Codes (10)
- Sites / Stores (1)
- Sites / Blog (25)
- Sites / SEO (9)
- Sites / Analytics (6)

### Wave 5: Marketing outbound + monetization
- Marketing / Email Marketing (6)
- Marketing / Social Planner (53) — sample
- Marketing / Template Library (19)
- Marketing / Trigger Links (1)
- Marketing / SMS & Email Templates (3)
- Marketing / Countdown Timer (17)
- Marketing / Ad Manager (10)
- Reputation / Review Requests (32)
- Reputation / GBP Optimization (2)
- Reputation / Listings (2)
- Payments / Getting Started (33)
- Payments / Invoices & Estimates (29)
- Payments / Products, Taxes & Coupons (8)
- Payments / Payment Links (5)
- Payments / Orders, Subscriptions, and Transactions (10)
- Payments / Payment integrations (15)
- Payments / Mobile Tap-to-Pay (1)
- Payments / Gift Cards (4)
- Documents & Contracts (28)

### Wave 6: Reporting + Integrations + Snapshots
- Dashboards / Getting Started (14)
- Dashboards / Widgets (24)
- Reporting / Tracking & Attribution (22)
- Reporting / Custom Reports (2)
- Integrations / Google (5)
- Integrations / Stripe (2)
- Integrations / Facebook (22) — sample
- Integrations / Zapier (5)
- Integrations / QuickBooks (1)
- Integrations / Shopify (3)
- Snapshots / Snapshots (24)
- Snapshots / Industry Snapshots (15)

### Wave 7: Agency/SaaS context (lighter read)
- Agency View / Agency Dashboard (5)
- Agency View / Prospecting Tool (18)
- Agency View / Reselling (2)
- SaaS Mode (53) — skim
- Reselling Products / Online Listings (23) — skim
- HighLevel Affiliates (20) — skim
- Mobile App (18)
- Whitelabel Mobile App (10)

### Wave 8: AI layer, Memberships/Communities, remainder
- AI Employee / AI Employee (7)
- AI Employee / Voice AI (36) — sample
- AI Employee / Conversation AI (23) — sample
- AI Employee / Content AI (7)
- AI Employee / Workflow AI (3)
- AI Employee / Ask AI (7)
- AI Employee / AI Studio (4)
- AI Employee / Agent Studio (13)
- AI Employee / Email AI (1)
- AI Employee / Knowledge Bases (5)
- AI Employee / MCP Server (1)
- Memberships / Membership/Courses (37) — sample
- Memberships / Communities (36) — sample
- Client Portal (20)
- E-commerce Store (40) — sample
- Certificates (18) — sample
- Logic & Fulfillment (40)
- Custom Objects (13)
- Companies (4)
- CRM Import/Export + Views (5)
- WhatsApp (91) — sample
- Industry Playbooks (18) — sample
- Compliance (4)
- Internationalization (3)
- Merge Fields (2)
- Notifications (4)
- Developer Resources (21) — sample
- University / How-To's (19) — sample
- All remaining smaller folders

### Wave 9: Outside the help center
- developers.gohighlevel.com (API reference)
- ideas.gohighlevel.com (roadmap + changelog)
- HighLevel University
- YouTube channel sampling

### Wave 10: Phase 1.4 system-architecture research (client-side state)
- Generic research on HighLevel web-app technology stack (Angular? React? Vue?)
- Conventions for localStorage/sessionStorage keys
- Any publicly-documented JS globals

---

## Fetched this session

(appended as each WebFetch completes)

# API Appendix — HighLevel V2 Developer Reference

**Last Updated:** 2026-04-17
**Purpose:** Reference chapter for clients (or their developers) who later want to extend the HighLevel build with custom API integrations. NOT required to operate the Caramel Oven build; included for completeness so the question "can we integrate X?" has a documented answer.

**Target reader:** a developer, technical consultant, or savvy operator who can read API documentation and wants to know the surface area + how to authenticate.

**Appendix status:** scaffold-level. Full deep-dive reference lives at `marketplace.gohighlevel.com/docs/`. This document provides orientation and pointers.

---

## When you'd use the API

Most Caramel Oven-style builds never need the API directly. The Workflows module (triggers + actions + webhooks) covers the 90%+ case. Reach for the API only when:

- **You want to sync HighLevel data TO another system in real time** (e.g., push every new Contact to a warehouse management system, ERP, or custom-built reporting tool).
- **You want to pull data FROM another system INTO HighLevel** outside of what native integrations support (e.g., enrich Contacts with data from a proprietary data provider).
- **You need operations HighLevel's UI doesn't expose** (e.g., bulk-update 10,000 contacts across a complex filter — native UI chokes; API handles it).
- **You're building a custom application on top of HighLevel** (for Marketplace distribution or internal use).

Most owner-operator builds do NOT need this. Most marketing-agency-run builds do NOT need this. Reserve for engineering-involved scenarios.

---

## Current API generation — V2

**V2 is the current supported API.** V1 reached end-of-support **2025-12-31.** Existing V1 integrations continue to function but receive no updates or support; all new work targets V2.

**Canonical documentation:** `https://marketplace.gohighlevel.com/docs/`

**Stoplight legacy URLs** (some exist from the V1 era) are deprecated. If encountered, update bookmarks to the marketplace URL.

---

## Base URL

All V2 API requests target:

```
https://services.leadconnectorhq.com/
```

Example endpoint:

```
GET https://services.leadconnectorhq.com/contacts/?locationId=<LocationID>
```

**Location ID** is the sub-account identifier (from Section 2 of the guide — same identifier that appears in the sub-account URL path `app.gohighlevel.com/v2/location/<LocationID>/...`).

---

## Authentication

Two authentication methods are supported:

### 1. OAuth 2.0 Authorization Code Grant

**Use when:** building a Marketplace app that serves multiple Locations / Companies, or an integration that acts on behalf of different users in different sub-accounts.

**Flow:** standard OAuth 2.0 — user authorizes the app → app receives authorization code → exchanges for access token → access token used for subsequent API calls. Tokens refresh via refresh_token grant.

**Setup:** register a Marketplace app at `marketplace.gohighlevel.com/docs/oauth/GettingStarted/`. Client credentials issued at app registration. OAuth authorization URL and token endpoint documented in the OAuth section of the developer portal.

### 2. Private Integration Tokens (PIT)

**Use when:** building a single-sub-account integration (internal tool, single-client automation, test scripts). Much simpler than OAuth.

**Flow:** sub-account admin generates a Private Integration Token in the UI (Settings → Private Integrations → Create). Token is a static string; use as a Bearer token in request headers.

**Example:**
```
curl -H "Authorization: Bearer <token>" \
     https://services.leadconnectorhq.com/contacts/?locationId=<LocationID>
```

**Caveat:** tokens are long-lived but not rotatable-by-policy; compromise = replace via UI regeneration. Store in secrets manager, not source control.

---

## Resource groups

V2 exposes these primary resource groups (from `marketplace.gohighlevel.com/docs/`):

| Resource | Common operations |
|---|---|
| **Locations** (a.k.a. Sub-Accounts) | GET sub-account details · POST create sub-account (Agency-level auth required) |
| **Companies** (Agency-tier) | GET agency details |
| **Contacts** | CRUD on contact records · search / filter · tag management · custom-field updates |
| **Conversations** | read conversation threads · send outbound messages (Email, SMS, FB, IG) · search conversations |
| **Calendars & Events** | list calendars · create / update appointments · query availability |
| **Opportunities** | CRUD on opportunity records · move between stages · query pipelines |
| **Payments** | invoices · transactions · subscriptions · payment links |
| **Webhooks** | subscribe to 50+ event types for real-time notifications |

Full endpoint specs at `marketplace.gohighlevel.com/docs/` under each resource group.

---

## Rate limits

Per Marketplace app, per Location / Company:

- **Burst limit:** 100 requests per 10 seconds.
- **Daily limit:** 200,000 requests per day.

Exceeding these returns 429 (Too Many Requests). Implement exponential backoff in clients.

---

## Webhooks — the underused power tool

Before building a polling integration (repeatedly calling the API to check for changes), consider whether a webhook can deliver the same data in real time. HighLevel supports 50+ webhook events including:

- Contact created / updated / deleted
- Opportunity stage changed
- Appointment booked / canceled / completed
- Payment received
- Form submitted
- Subscription created / canceled / renewed

Subscribe via the Webhooks resource group or via Workflow Custom Webhook actions (the simpler path for most use cases).

---

## SDK and code examples

HighLevel maintains an official TypeScript / JavaScript SDK at `@gohighlevel/api-client` (npm). It wraps authentication, error handling, and automatic token refresh.

Installation:
```
npm install @gohighlevel/api-client
```

Basic usage:
```javascript
import { HighLevelClient } from '@gohighlevel/api-client';

const client = new HighLevelClient({
  clientId: '...',
  clientSecret: '...',
  redirectUri: '...',
  // OR for Private Integration:
  privateIntegrationToken: '...'
});

const contacts = await client.contacts.search({
  locationId: '<LocationID>',
  query: 'email:*@carameloven.com'
});
```

Additional language SDKs (Python, Go, Ruby) are community-maintained; check `github.com/GoHighLevel/` organization for official references.

---

## V2 migration notes (for users of the legacy V1)

V1 is end-of-support as of 2025-12-31. V1 endpoints still function but receive no updates. Common V1 → V2 migration patterns:

- **Authentication:** V1 used API Keys; V2 uses OAuth 2.0 + Private Integration Tokens. API Keys are deprecated.
- **Base URL:** V1 used `https://rest.gohighlevel.com/v1/`; V2 uses `https://services.leadconnectorhq.com/`.
- **Rate limits:** V1 had different thresholds; V2 is 100/10s burst, 200K/day.
- **Endpoint paths:** many paths renamed between V1 and V2. Consult the V2 documentation for the current path rather than assuming a V1 path still works.

If you're maintaining a V1 integration, plan the migration within the next 6-12 months. Longer you wait, higher the risk that HighLevel retires V1 endpoints entirely.

---

## What this appendix does NOT cover

- **Complete endpoint documentation.** That lives at `marketplace.gohighlevel.com/docs/`. This appendix is orientation, not reference.
- **App Marketplace publishing process.** If you're building for distribution, consult HighLevel's Marketplace onboarding — separate from this appendix.
- **Webhook signature verification.** Critical for production integrations; documented in the Webhooks section of the developer portal.
- **Error handling best practices.** Standard HTTP + exponential backoff + idempotency keys where applicable.
- **Data residency / compliance.** For clients with HIPAA, GDPR, or SOC 2 requirements, consult HighLevel's Compliance documentation and Data Processing Agreement separately.

---

## When to engage PitchBlack for API work

PitchBlack does not quote API integration work at Growth-tier. If a client's use case requires API development:

- **Small integrations** (single webhook-to-Zapier, single API call per event): may be done inside the Growth-tier engagement at no extra cost if the scope is clearly bounded. Verify in the proposal.
- **Medium integrations** (custom app connecting HighLevel to a proprietary CRM / warehouse / ERP): quote separately on an hourly or fixed-scope basis.
- **Large integrations** (custom Marketplace app, multi-system data sync, HighLevel-backed product): refer to a partner engineering firm OR scope as a separate Project-tier engagement.

API work is NOT the Bakery Snapshot's selling point. The Snapshot's value is the operational infrastructure itself; custom integrations are a pull-through when specific business needs demand it.

---

## References

- **V2 API documentation:** `marketplace.gohighlevel.com/docs/`
- **V1 legacy (EoS 2025-12-31):** `old-public-api.gohighlevel.com/`
- **Developer community:** `developers.gohighlevel.com/`
- **Official SDK:** `@gohighlevel/api-client` on npm
- **GitHub docs repo:** `github.com/GoHighLevel/highlevel-api-docs`

This appendix will be versioned alongside the build guide per UPDATE_PROTOCOL.md. Expected refresh cadence: quarterly (API changes happen; V2 endpoint paths may shift; new resource groups may be added).

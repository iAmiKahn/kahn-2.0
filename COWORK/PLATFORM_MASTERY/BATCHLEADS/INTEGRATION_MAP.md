# INTEGRATION_MAP — BatchLeads

Every external tool BatchLeads connects to — inbound and outbound. Critical for the Andreas mortgage insurance pipeline: BatchLeads → HighLevel → dialer → campaign.

Inventory captured 2026-04-17 from `/app/setting/marketplace` on Andres's Workspace (free-trial account). Configurations that require plan upgrade or signature setup are flagged.

---

## Integration inventory

### BatchDialer (sister product — direct handoff)
- **Direction:** outbound (push leads into dialer queue).
- **Purpose:** Move selected leads into the BatchDialer calling app, where they become a queue for outbound-call campaigns.
- **Configuration location:** No setup required in BatchLeads; the two products share the same account. Switch via top-right `Switch To BatchDialer` (→ `https://app.batchdialer.com/dashboard`) or via Actions → `Add to BatchDialer` on selected leads.
- **Data fields exchanged:** Full lead record including owner name, phone numbers (up to 3 observed), mailing address, emails, tags, list membership.
- **Auth method:** Single-sign-on across BatchLeads + BatchDialer (same login).
- **Trigger:** Manual push via Actions menu, per selection.
- **Permission risk:** **ASK** each time (queues outbound calls).
- **Observed on:** 2026-04-17. Integration present; not triggered.

### Zapier (bidirectional, general-purpose glue)
- **Direction:** bidirectional.
- **Purpose:** Generic automation layer — connect BatchLeads events (new lead added, status changed) to any downstream tool in Zapier's catalog. This is the **primary path to HighLevel** since BatchLeads has no native HighLevel integration.
- **Configuration location:** `/app/setting/marketplace` → Integration Keys tab → `Zapier Api Key`.
- **Data fields exchanged:** Depends on zap — typically lead record + trigger event.
- **Auth method:** API key (shared with Zapier).
- **Trigger:** Event-driven (on lead add / status change / etc.).
- **Permission risk:** **ASK** — revealing/copying the API key expands access scope.
- **Observed on:** 2026-04-17. API-key slot present; no active zaps observed.

### Webhooks (outbound event push — direct, no Zapier)
- **Direction:** outbound.
- **Purpose:** Push BatchLeads events (status change, lead add, etc.) to any HTTPS endpoint — enables direct HighLevel integration if HighLevel exposes an inbound webhook.
- **Configuration location:** `/app/setting/marketplace` → Marketplace tab → `WEBHOOKS` → `ADD NEW WEBHOOK`.
- **Data fields exchanged:** Lead record + event metadata (Trigger + On Status).
- **Auth method:** Endpoint URL; likely webhook-signing secret (not confirmed).
- **Trigger:** Event-driven, configurable (`Trigger On` + `Status` selectors observed).
- **Permission risk:** **ASK** — creates persistent integration.
- **Observed on:** 2026-04-17. Zero webhooks configured.

### Podio (outbound CRM integration)
- **Direction:** outbound.
- **Purpose:** Sync leads to Podio workspaces. Not relevant to Andreas's pipeline unless PitchBlack uses Podio.
- **Configuration location:** `/app/setting/marketplace` → Marketplace tab → `podio integrations : 0 MANAGE`.
- **Auth method:** OAuth to Podio.
- **Permission risk:** **ASK**.
- **Observed on:** 2026-04-17. Zero Podio integrations active.

### Invite People (workspace collaboration)
- **Direction:** internal (adds another user to Andreas's workspace).
- **Configuration:** `/app/setting/marketplace` → `Invite People` section.
- **Permission risk:** **ASK** — grants account access.
- **Observed on:** 2026-04-17.

### Direct Mail (printed outbound — via BatchLeads-fulfilled vendor)
- **Direction:** outbound (physical mail sent via BatchLeads-partnered vendor).
- **Configuration:** `/app/setting/direct-mail/*` (Templates, Signatures).
- **Prerequisite:** At least one Signature configured (includes address, phone, license info, disclosures).
- **Permission risk:** **ASK** at both setup (creates persistent record) and send (incurs $ per piece).
- **Observed on:** 2026-04-17. Signature UI walked; not saved.

---

## Priority integrations for Andreas pipeline

### HighLevel — no native integration
**Status:** Not in BatchLeads marketplace. Two workaround paths:
1. **Zapier (recommended):** BatchLeads → Zapier (new-lead trigger) → HighLevel (create-contact action). Requires Zapier subscription + Zap build.
2. **Direct webhook:** BatchLeads → HighLevel's inbound webhook. Requires HighLevel endpoint URL; faster/cheaper than Zapier but harder to maintain.

**Recommended pipeline design for Andreas:**
1. BatchLeads runs saved searches (one per Andreas persona — PB-1, PB-2, PB-3).
2. Matching leads get saved to a list and skip-traced (credit cost).
3. Zapier zap triggers on new-lead-in-list event.
4. Zap pushes to HighLevel with tags indicating source playbook (e.g. `source:BatchLeads`, `playbook:PB-2`).
5. HighLevel's campaign + dialer + SMS flows run the outreach.

**Blocker:** The Zapier zap build is **outside BatchLeads** and will be Phase 4-adjacent work — document here but the build itself is a separate project.

### Dialer — BatchDialer native
Use **`Add to BatchDialer`** Actions menu option for the calling side of the pipeline. If Andreas already uses a different dialer (Mojo, REISift, etc.), that would need a Zapier bridge too — no evidence of anything but BatchDialer natively wired.

### Skip tracing — native, credit-billed
Happens inside BatchLeads during import or list-save. No external integration needed, but credit purchase is a prerequisite.

---

## Secondary / discovered

| Integration | Notes |
|---|---|
| `Reia AI` | In-app AI assistant ("Use the power of AI to help you close more deals! Learn More"). Not an external integration — built-in. Worth exploring in Phase 4 since it may expose filter recommendations or auto-ranking. |
| `prop.ai`, `staging-propai.batchleads.io`, `beta-propai.batchleads.io` | Whitelisted iframe-parent domains (found in source) — BatchLeads is part of a `prop.ai` product family, so embedding is supported for parent apps. |
| `iframe.batchservice.com` | Another whitelisted parent — BatchService is the BatchLeads / BatchDialer parent company. |

---

## Undocumented integration endpoints (to probe in Phase 4)

- Does the Actions → "Export to" submenu list integration targets (Export to HighLevel / Export to Zapier / etc.)? Unclicked in Phase 3; verify format and options in next session.
- Does BatchLeads expose a REST API (beyond the Zapier-mediated surface)? Search support docs.
- Does Reia AI have tool-use / API-out capability? If it can drive filter changes, that's a methodology unlock.

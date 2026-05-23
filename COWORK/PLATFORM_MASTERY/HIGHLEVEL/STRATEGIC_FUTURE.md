# STRATEGIC_FUTURE — PitchBlack Scaling Surface

**Purpose:** Capture HighLevel surfaces that are NOT in Caramel Oven's scope but ARE strategically relevant to PitchBlack's long-term consulting infrastructure. These compound as the consulting practice scales; they are logged here so no one forgets them when the first three clients are onboarded.

**Rule:** No content here enters the Caramel Oven guide. When a future client's requirements surface any of these, revisit this file.

---

## 1. Eliza Agent Platform

- **What it is:** 6-article onboarding folder at `/folders/48000690746`. Inferred to be the runtime/platform underlying AI Employee surfaces (Voice AI, Conversation AI, Agent Studio, AI Studio). Possibly an agency/developer-tier authoring environment for custom agents.
- **Why it matters for PitchBlack:** If Dan's consulting practice moves into "AI agent for the client" as a premium deliverable (beyond default HighLevel AI Employee tooling), Eliza is likely the platform where those custom agents get built, trained, and distributed via Snapshots.
- **Trigger to deep-read:** First client who requests a custom AI agent OR when a second consulting engagement demands repeatable agent packaging.
- **Effort estimate:** 6 articles, ~90 minutes of deep reading.

---

## 2. MCP Server (Model Context Protocol)

- **What it is:** HighLevel shipped native MCP Server support on 2026-04-17. AI agents inside HighLevel (Conversation AI, Voice AI, Agent Studio) can now access external apps, databases, and search engines via MCP-compatible servers. 1-article folder at `/folders/155000001370`.
- **Why it matters for PitchBlack:**
  - MCP lets HighLevel agents read/write to external systems (CRMs, databases, search APIs, custom tools) without building bespoke HighLevel webhooks. This is a meaningful architectural shift — it turns HighLevel from a closed automation platform into an extension point for any MCP-speaking service.
  - PitchBlack's Nebula system and internal tools could be exposed to HighLevel agents via MCP, creating a bridge where a client's sub-account could consult Dan's own knowledge graph or analysis engines during customer interactions.
  - The protocol is interoperable with Anthropic's Claude API, OpenAI's Assistants, and other agent platforms.
- **Explicit scope call (added 2026-04-17 by Dan + Claude Chat):** MCP Server is OUT OF SCOPE for Caramel Oven (single sub-account client). **Strategic relevance:** when PitchBlack scales to multi-client AI-managed HighLevel operations, MCP Server becomes the integration surface. Revisit when Client 5+ is in flight or when the Life Narration product vision requires HighLevel as an execution target.
- **Trigger to deep-read:** When building a client engagement where HighLevel's native tools need to call out to custom infrastructure, OR when Nebula / Life Narration surfaces a use case where its tools should be consumable by HighLevel agents, OR when Client 5+ is onboarded.
- **Effort estimate:** 1 HighLevel article + ~2 hours understanding MCP spec + integration experiment. Not a Caramel Oven concern.

---

## 3. Agent Studio / AI Studio

- **What they are:** Custom agent-authoring interfaces (13 + 4 articles). Separate from Conversation AI (pre-built chatbot) — these let you build agents from primitives.
- **Why it matters for PitchBlack:** Same logic as Eliza — premium "custom agent" deliverables for sophisticated clients would live here.
- **Trigger:** First client request for a bespoke AI agent.

---

## 4. SaaS Mode full deployment

- **What it is:** 53-article folder. Turns HighLevel into a self-service product with tiered pricing, Stripe Checkout-driven signups, trial management, usage-based rebilling (Twilio, Email, AI, Workflow-action credits).
- **Why it matters for PitchBlack:** The pivot from "done-for-you consulting" to "tooling the client purchases and we configure" happens via SaaS Mode. It's the margin-compounding move. Caramel Oven is done-for-you; future clients (or Caramel Oven itself at scale) could be SaaS-Mode customers.
- **Trigger:** When PitchBlack transitions from custom builds to productized offering — consult Joel Kaplan 10k-10-day workshop (48001169302) and "How to create a highly profitable SaaS offer" (48001166736) from the Sales Trainings folder.

---

## 5. Industry Snapshot distribution

- **What it is:** HighLevel's 15-article Industry Snapshots folder ships pre-built snapshots for 14 verticals. Agencies distribute snapshots. "Marketing Agency SaaS Mode Playbook" (155000007213) is the Meta-playbook for how to sell these.
- **Why it matters for PitchBlack:**
  - **Caramel Oven's outcome packaged as a "Bakery / Farmers-Market Snapshot"** is added to Phase 5.1 scope. This becomes the compounding asset. Every future food/local-services client either inherits this or extends it.
  - Eventually, PitchBlack could offer this snapshot to the broader HighLevel ecosystem via the App Marketplace (Snapshots in App Marketplace folder) — turning one client engagement into a recurring revenue line.
- **Trigger:** Caramel Oven contract close + successful build → package Snapshot → offer to client 2/3/4.

---

## 6. App Marketplace distribution

- **What it is:** HighLevel's App Marketplace (5 sub-folders) — where third parties list integrations, workflow actions, Snapshots, Conversation AI / Voice AI templates.
- **Why it matters:** A published Marketplace listing = passive lead generation from HighLevel's agency user base for PitchBlack.
- **Trigger:** After 3+ clients on the Bakery/Local-Food Snapshot. Publishing requires OAuth Marketplace app setup (developer onboarding workflow).

---

## 7. Prospecting Tool (agency-tier)

- **What it is:** 18-article folder. Agency-owned lead-gen tool for prospecting local businesses — generates Marketing Audit PDFs, tracks prospect statuses, identifies competitors.
- **Why it matters:** When PitchBlack moves from inbound-driven (Dan's network + Nebula referrals) to outbound sales motion, this tool becomes the prospecting engine.
- **Trigger:** When PitchBlack is scaling to 10+ clients/month and inbound can't feed the pipeline.

---

## Monitoring cadence

Review this file:
- After every client engagement closes (update with any newly-relevant surfaces discovered during the build)
- Quarterly during changelog reviews (new surfaces may appear — e.g., MCP Server only existed as of 2026-04-17)
- Before any SaaS Mode or Marketplace packaging decision

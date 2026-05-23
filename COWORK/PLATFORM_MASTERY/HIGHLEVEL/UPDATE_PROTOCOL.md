# Update Protocol — Caramel Oven HighLevel Guide

**Last Updated:** 2026-04-17
**Guide version:** 1.0 (initial delivery)
**Owner:** Claude Code (drafting) · Dan (quarterly full-pass) · VA (daily watch, once onboarded)

---

## Purpose

HighLevel ships daily. The guide you hold was accurate as of 2026-04-17 and will drift. This protocol documents how to detect drift, where it's most likely to occur, how to refresh the affected sections, and how to version the guide over time.

Without this protocol, the Caramel Oven build guide becomes a historical artifact within 6-12 months. With it, the guide remains operational indefinitely, and the Snapshot packaged from it (Phase 5.1) compounds in value across future clients.

---

## The problem

HighLevel released 10 product updates in the 3 days leading up to 2026-04-17 (per `ideas.gohighlevel.com/changelog`). The AI/Agent layer (AI Employee, Voice AI, Conversation AI, Agent Studio, MCP Server) moves fastest. Core CRM primitives (Contacts, Opportunities, Calendars basic) move slowest.

If the guide isn't maintained:
- UI labels drift; "UI-VERIFY" flags compound into "UI-WRONG."
- Feature deprecations leave dead links in the guide.
- New features with better solutions than the ones currently recommended go unadopted.
- Fee structures shift; $15.75 A2P Campaign Registration becomes $X; operator is surprised.

---

## Volatility map

Sections of the guide are not equally stable. Refresh priority scales with velocity:

### 🔴 High velocity (re-check monthly)
These surfaces change often enough that the guide can go stale in 30-60 days.

- **Section 18 (Content AI Setup)** — Content AI features ship frequently; pricing tiers shift; Brand Voice integration surface expands. Re-verify pricing every month.
- **Sections 12-14 (Workflows) — AI-flavored triggers and actions** — Conversation AI Post-Appointment, Workflow AI actions, Voice AI triggers. The AI-interfacing portions of workflows churn fastest.
- **MCP Server** (Strategic Future; not Caramel Oven) — shipped 2026-04-17; feature surface will expand rapidly.
- **Agent Studio / AI Studio** — release cadence similar to Content AI.

### 🟡 Medium velocity (re-check quarterly)
Surface changes are real but less frequent.

- **Section 4 (LC Phone + A2P)** — Campaign fees ($15.75 verification), use case categories, Brand vetting timelines. Carrier policy updates quarterly.
- **Section 3 (LC Email)** — Dedicated Domain setup, SPF/DKIM/DMARC patterns. Infrastructure is stable but Preference Management and list-hygiene features expand.
- **Section 7 (Stripe + Products)** — New payment providers get added (Adyen, Mercado Pago shipped in 2025-2026); tax automation improves.
- **Section 9 (Calendars & Services)** — Services v2 is the "v2" for a reason; v3 may come.
- **Section 19 (Social Planner)** — New social platforms get added (TikTok, BlueSky); platform API changes force rebuilds.
- **Section 17 (Website · Funnel · Blog)** — Builder element library expands with each release.

### 🟢 Low velocity (re-check annually)
Primitives that rarely change.

- **Sections 2 (Business Profile), 5 (Custom Fields/Tags/Brand Board/Voice), 6 (Contacts Import + Smart Lists), 10 (Pipelines + Opportunities)** — core CRM; stable.
- **Merge Field syntax** (`{{contact.X}}`, `{{custom_values.Y}}`) — contract-level stable.
- **Section 1 (Pre-Build Intake)** — process-oriented; doesn't depend on HighLevel UI.
- **Section 21 (Pre-Launch QA + Handoff)** — process-oriented.

---

## Monitoring cadence

### Daily (automated, VA-watch once hired)
- Skim `ideas.gohighlevel.com/changelog`. If anything catches the eye for a section we've implemented, add to the Weekly Review queue.

### Weekly
- Review any items added to the queue from daily scans.
- If an item meaningfully affects a live workflow (e.g., "Workflow Trigger X deprecated" and we use Trigger X), escalate to Monthly action.

### Monthly (Claude Code responsibility)
- Full `ideas.gohighlevel.com/changelog` scan for the prior month.
- Cross-reference against guide sections. Flag any section needing refresh.
- Check help-center article "Last Modified" dates on the 5-10 most-critical articles (LC Phone Pricing, A2P Campaign Registration, Snapshot Overview, Brand Board, Workflows Introduction).
- Update affected guide sections with inline "UPDATED YYYY-MM-DD: [what changed]" notes.
- Bump the "Last Updated" date header on changed sections.

### Quarterly (Dan responsibility)
- Full guide re-read: verify the playbook still produces a working sub-account.
- Test a section live (if possible) against current HighLevel UI.
- Review STRATEGIC_FUTURE.md for any surfaces that have moved from "out of scope" to "worth revisiting."
- Update the guide's version number (see Versioning below).

### Annual (Dan + Claude Code joint)
- Full guide rebuild review: does every section still reflect how HighLevel works?
- Snapshot refresh: rebuild the packaged Snapshot (Phase 5.1) from the updated guide.
- Announce new guide version to clients on the Snapshot.

---

## Detection playbook

### Signal 1: Help-center article "Last Modified" date shift

For each critical article (see ARTICLE_INDEX.md for the canonical list), track its last-modified date. If the date changes from what's recorded in the guide reference, re-read the article and update the guide section that references it.

Critical articles with dates to track:
- `48001223546` — What is LC Phone?
- `155000007411` — Getting Started with A2P 10DLC
- `48001224630` — Email Authentication DMARC
- `155000002220` — How to Add a Domain and Verify DNS Record
- `155000002445` — Introduction to Workflows and Automations
- `48000982511` — Snapshots Overview
- `155000006240` — Services Overview
- `155000006980` — Getting Started with Gift Cards
- `48001234788` — Content AI with Social Planner
- `48001236751` — Content AI for Emails

### Signal 2: Changelog announces feature deprecation or release

`ideas.gohighlevel.com/changelog` posts are dated. Filter for:
- "Deprecated" / "End of life" / "Retiring" → high-priority refresh
- "Now available" / "Launched" / "Released" → may displace a current workflow; evaluate
- "Updated" / "Enhanced" → minor; check if affects UI labels

### Signal 3: Client reports UI mismatch

The guide's "UI-VERIFY" flags exist because labels drift. If the client executing the guide reports "the button says X, not Y," it's a UI-update signal. Log, verify against current UI, update the guide section, re-release.

### Signal 4: V1 → V2 style deprecation

HighLevel has a history of versioning features (Calendars v1 → Services v2). When the guide references a "v2" feature, track for a future "v3." Upgrade guide prose when v3 ships.

### Signal 5: Fee or pricing change

A2P Campaign Registration fee, Content AI per-1K-words pricing, Brand monthly fees, LC Phone per-minute rates. Changes show up in help-center articles and Pricing page. Update guide's pricing references.

---

## Refresh process

When any signal fires:

1. **Identify the section.** Which guide section references the affected feature?
2. **Re-read the authoritative source.** Help-center article, changelog post, or pricing page.
3. **Update the section prose.** Replace stale claims with current ones.
4. **Add an inline "UPDATED" note.** Example: `> UPDATED 2026-08-01: Content AI email pricing changed from $0.09/1K words to $0.12/1K words. Caramel Oven monthly cost estimate revised to $0.70-$1.30.`
5. **Bump the section's Last Updated header.** Example: `**Last Updated:** 2026-08-01`.
6. **Record in SESSION_LOG.md** under the dated refresh-pass entry.
7. **If live Caramel Oven system is affected:** notify Dan + Stacy + Josh. Action may be required in the live sub-account.

---

## Versioning approach

The guide follows semantic-versioning spirit (not strict SemVer):

- **Major version (X.0)** — incremented when a breaking change forces rebuild of substantial guide portions. Example: HighLevel deprecates LC Phone in favor of a successor → Section 4 rewrites → v2.0. V1 → V2 API migration would have triggered this.
- **Minor version (1.X)** — incremented when a notable feature shifts occur within existing scope. Example: Content AI pricing model overhaul → v1.3.
- **Patch (1.0.X)** — copy edits, UI-label fixes, clarification tweaks, errata. Example: "Settings → Custom Values" moved to "Settings → Advanced → Custom Values" → v1.0.1.

### Version header convention

Every section file has a `**Last Updated:**` header. Add a `**Guide Version:**` header when versioning formalizes. Current state: v1.0 on all sections.

### Changelog file

Create `GUIDE_CHANGELOG.md` at the first refresh pass. Format:

```
## v1.0.1 — 2026-05-XX
- Section 2 §3.1: "Business email" field renamed to "Contact Email" in current UI.
- Section 4 §7: A2P Campaign verification fee reference updated ($15.75 → $X.XX).
```

Tracks every refresh. Cumulative; append-only.

---

## Snapshot evolution

When the guide moves from v1.0 to v1.X, the packaged Snapshot (Phase 5.1) gets evaluated for re-release:

- **Patches (1.0.X)** — usually don't warrant Snapshot re-release unless a config change is required in live sub-accounts.
- **Minor versions (1.X)** — may require Snapshot re-release if new workflows, pipelines, or custom fields are added.
- **Major versions (X.0)** — always require Snapshot rebuild from scratch. Re-distribute to any sub-accounts that inherited the prior Snapshot.

The Snapshot-packaging playbook (`SNAPSHOT_PACKAGING_PLAYBOOK.md`) documents the rebuild process.

---

## Responsibilities matrix

| Who | What | Cadence |
|---|---|---|
| **Dan** | Quarterly full-pass review; annual rebuild; guide version decisions | Q + Annual |
| **Claude Code** | Monthly changelog scan; ad-hoc refresh writes; section-level update notes | Monthly + ad-hoc |
| **VA (once onboarded)** | Daily changelog skim; UI-mismatch reports from client execution | Daily |
| **Stacy / Josh** | Surface UI mismatches they hit during operation; surface feature requests from customers | Ad-hoc |

---

## First application of this protocol

Scheduled for **2026-05-17** (one month from v1.0 delivery). Claude Code performs the first Monthly scan:
- Review May 2026 changelog entries.
- Check help-center article dates on the 10 critical articles listed above.
- Update any affected guide section.
- Bump version to 1.0.1 if patches landed.
- Record the pass in SESSION_LOG.md.

---

## What this protocol does NOT do

- **It does not keep the guide perfectly current.** Daily micro-changes are absorbed at monthly cadence, not real-time.
- **It does not automate detection.** Monitoring is human-driven (with Claude Code assistance). A future automation layer (RSS monitor on `ideas.gohighlevel.com`, or a scheduled agent scan) is a Phase 6+ consideration.
- **It does not cover third-party integration drift** (Stripe, Google, Facebook, Twilio changes that propagate through HighLevel). Those are tracked by HighLevel's own integration team; this protocol only covers HighLevel-native changes.

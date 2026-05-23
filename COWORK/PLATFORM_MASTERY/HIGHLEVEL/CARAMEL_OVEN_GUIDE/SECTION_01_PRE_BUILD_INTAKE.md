# Section 1 — Pre-Build Intake & Prerequisites

**Last Updated:** 2026-04-17
*If HighLevel UI doesn't match these instructions, consult the Update Protocol (Phase 5.2). This guide targets the HighLevel platform as of 2026-04-17.*

---

## Purpose

Before you touch HighLevel, collect the information and assets that unblock every downstream section. By the end of this section you will have a completed intake document, an asset inventory, a blocker map, and a scope decision log — all shared with Dan, Stacy, and Josh.

**Estimated time:** 30-90 minutes for you to set up; several days for Stacy and Josh to respond.

**Who you are:** The VA executing the build. Dan reads the guide in parallel as a QA surface. Stacy and Josh are the Caramel Oven owners and answer most intake questions. Claude Code wrote this guide; Claude Chat reviewed it; Dan routes questions and approvals.

> **Note on the VA persona:** Until Caramel Oven revenue enables a VA hire, Dan executes this guide himself. The "VA" voice throughout is forward-looking — when a VA is onboarded later, they can drop in cleanly without rewriting. Read every "you" below as Dan today and a VA eventually.

---

## Why this section matters

HighLevel has no "undo" button for a handful of critical setup decisions:

- Choosing the wrong **legal-entity type** during A2P 10DLC Brand Registration can delay SMS launch by 2+ weeks.
- Pointing the **domain** at HighLevel without preparing DNS can break email deliverability for months.
- Starting to build before you know about an **existing Stripe account** or **claimed Google Business Profile** risks duplicate records, merged-account messes, and manual cleanup.

This is the measure-twice-cut-once step. Slower now, less rework later.

---

## What you will produce

1. **Intake Document** — Stacy and Josh's answers to 10 questions.
2. **Asset Inventory** — logo, brand colors, fonts, product catalog, existing customer list, shared folder URL.
3. **Blocker Map** — which sections are ready to build vs. waiting on which intake answer.
4. **Scope Decision Log** — which features are IN SCOPE vs. OPTIONAL vs. OUT OF SCOPE for this engagement.

All four live as shared documents (Google Docs or Notion). Share URLs with Dan at the end of the section.

---

## Step 1 — Send the intake questions to Stacy and Josh

Copy the block below into an email (or your channel with Stacy and Josh). The questions are plain English. Stacy and Josh do not need to know anything about HighLevel to answer them.

**Subject:** Caramel Oven HighLevel build — 10 questions before we start

**Body template:**

> Hi Stacy and Josh,
>
> Before we start building your HighLevel system, I need your answers to 10 questions. Some of them block specific sections of the build, which is why I'm asking now rather than as we go.
>
> Please reply with whatever you have as you have it — you don't need all 10 ready before you respond.
>
> **1. Legal entity type.** Is Caramel Oven Bakehouse a registered business (LLC / S-Corp / Partnership / Corporation)? Or operating as a Sole Proprietorship? If registered, can you share the EIN?
>
> **2. Existing domain.** Do you own a domain for Caramel Oven (e.g., carameloven.com)? If yes: where is it registered (GoDaddy, Namecheap, Google Domains, other)? Is it connected to a live website, parked/unused, or something you want us to take over entirely?
>
> **3. Existing Stripe account.** Do you have a Stripe account for Caramel Oven? If yes: is it actively used (any past payments, existing products, subscriptions)? Any webhooks connected to other tools?
>
> **4. Google Business Profile.** Is Caramel Oven's Google Business Profile claimed and verified? What address is associated (storefront, home-based, farmers-market)? Any existing Google reviews on the listing?
>
> **5. Appointment booking model.** When a customer books a custom-order consultation or catering tasting, is it always one specific person (always Stacy, for example)? Or should customers see availability for multiple people (Stacy AND Josh)? If multiple, should customers choose who they meet with, or should the system route them to whoever is free?
>
> **6. Wholesale clients.** Do you sell Caramel Oven products to restaurants, cafés, grocers, or corporate catering clients? If yes: how many active wholesale accounts today? And for accounts like a restaurant, do you track multiple people there (owner + chef + purchasing manager) or just one primary contact per account?
>
> **7. Social media platforms.** Which social platforms does Caramel Oven currently post to at least monthly? And for each one, do you have admin-level access (not just page-posting access)? We need admin-level authorization to connect each one.
>
> **8. Existing customer list.** Do you have an existing customer list anywhere — email newsletter platform (Mailchimp, ConvertKit, Klaviyo), POS system (Square, Clover), spreadsheet, Google Contacts? Roughly how many contacts?
>
> **9. Brand assets.** Can you send: (a) logo files (SVG or high-res PNG); (b) brand color palette as hex codes or a color swatch; (c) any brand fonts you use (Google Fonts names or custom font files); (d) a paragraph or two describing your brand voice (e.g., "we sound warm and playful, not formal; we use baking metaphors; we never capitalize for emphasis")?
>
> **10. Menu / product catalog.** Can you share your current product catalog — what you sell at the farmers market, standard retail prices, any wholesale pricing tiers, and a list of catering/custom-order options with typical price ranges?
>
> Heads up: Q1 (legal entity type) kicks off a 3-7 business-day SMS registration process with the carriers. Answering that one first would keep the build on schedule. The rest can come as you have time.
>
> Thanks — reply with answers as they come to you. I'll chase any that are still open.

---

## Step 1.5 — Chase cadence

Unanswered questions silently drift and delay the build. Apply this cadence:

- **Day 0:** Send intake email (Step 1).
- **Day 3 (business days):** If no response, chase via your second-best channel — text if the email went out, call if text went out.
- **Day 6 (business days):** If still no response, escalate to Dan. Dan re-engages Stacy and Josh directly.

Three business days is deliberate — not pushy, not lazy. Escalation at Day 6 keeps the Phase 3 build from stalling in silence.

---

## Step 2 — Record answers in the Intake Document

Create a new shared Google Doc (or Notion page) titled **"Caramel Oven HighLevel Intake"**. Use this template at the top and fill in as answers arrive:

```
CARAMEL OVEN HIGHLEVEL INTAKE DOCUMENT
Started:        [date]
Last updated:   [date]
Status:         [In progress / Complete]

Q1. Legal entity type
    Answer:         [fill in]
    Received from:  [Stacy / Josh / both]
    Date received:  [date]
    Blocks:         Section 4 (Phone + A2P Registration)

Q2. Existing domain
    Answer:         [fill in]
    Received from:  [...]
    Date received:  [...]
    Blocks:         Section 3 (Domain + LC Email Setup)

[... same template for Q3 through Q10]
```

For questions with multiple parts (Q1, Q2, Q3, Q4, Q9, Q10), record each part separately. Update the "Last updated" date every time you add an answer.

---

## Step 3 — Collect the Asset Inventory

Start a second shared document titled **"Caramel Oven HighLevel Asset Inventory"** while intake questions are out with Stacy and Josh. Complete this as assets arrive.

**Required assets (the build stalls without these):**

- [ ] **Logo file** — preferred format SVG; PNG at 1024×1024 or larger acceptable. Transparent background preferred.
- [ ] **Brand color palette** — hex codes (e.g., `#8B4513`). Minimum: primary + one accent color. Ideal: full palette (primary, secondary, accent, neutral, background).
- [ ] **Business name, full legal name, address, phone, support email** — populates the Sub-Account Business Profile in Section 2.
- [ ] **Current operating hours** — by day of week. Used for Calendars (Section 9) and Chat Widget office-hours logic (Section 8).
- [ ] **Domain name** — the one you're connecting in Section 3 (or the one you'll buy through HighLevel if none exists).
- [ ] **Stripe readiness confirmation** — Stacy or Josh connects Stripe during Section 7 via OAuth; you just need confirmation they'll be available to click through the flow when you get there.
- [ ] **Google Business Profile login access** — needed for the integration in Section 11.

**Optional assets (nice-to-have, non-blocking):**

- [ ] **Brand fonts** — Google Fonts names work directly in HighLevel; custom font files need upload.
- [ ] **Brand voice description** — paragraph or list of tone words. Feeds Content AI in Section 18.
- [ ] **Product photography** — used on the website (Section 17).
- [ ] **Existing customer list file** — CSV export from current tool.
- [ ] **Existing email signatures / templates** — for migration to LC Email.
- [ ] **Social media profile URLs** — needed to connect platforms in Section 19.

Save asset files to a shared folder (Google Drive, Dropbox — whatever Stacy and Josh use). Link the folder URL at the top of the Asset Inventory document.

---

## Step 4 — Build the Blocker Map

The Blocker Map tells you which sections are ready vs. waiting. Copy this table into the Intake Document and keep it updated as answers arrive.

| Section | Title | Blocked by | Status |
|---|---|---|---|
| 1 | Pre-Build Intake (this section) | — | Active |
| 2 | Sub-Account Provisioning & Business Profile | — (Dan's agency action) | Ready |
| 3 | Domain + LC Email Setup | **Q2** | Waiting on Q2 |
| 4 | LC Phone + A2P 10DLC Registration | **Q1** | Waiting on Q1 |
| 5 | Custom Fields · Tags · Brand Board · Brand Voice | **Q9** | Waiting on Q9 |
| 6 | Contacts Import & Smart Lists | Informed by Q8 | Ready (Q8 informs planning) |
| 7 | Stripe + Products Catalog | **Q3** · Q10 | Waiting on Q3 |
| 8 | Forms + Chat Widget | — | Ready |
| 9 | Calendars & Services | **Q5** | Waiting on Q5 |
| 10 | Pipelines & Opportunities | Q6 shapes design | Ready (Q6 influences) |
| 11 | Reputation Management | **Q4** | Waiting on Q4 |
| 12 | Workflows — Appointment & Purchase | Sections 5-11 | Waiting on upstream |
| 13 | Workflows — Lead Nurture | Sections 5-10 | Waiting on upstream |
| 14 | Workflows — Commerce + Missed-Call Text-Back | Sections 4, 5, 11 | Waiting on upstream |
| 15 | Invoices · Payment Links · Documents & Contracts | Sections 7, 10 | Waiting on upstream |
| 16 | Gift Cards | Sections 5, 7, 15 | Waiting on upstream |
| 17 | Website · Funnel · Blog | Sections 5, 8, 11, 15, 16 | Waiting on upstream |
| 17.5 | Ad Manager (OPTIONAL) | Q7 | Waiting / post-launch decision |
| 18 | Content AI Setup | Section 5 | Waiting on upstream |
| 19 | Social Planner Scheduling | **Q7** · Section 18 | Waiting on Q7 |
| 20 | Dashboards + Mobile App | All upstream | Waiting |
| 21 | Pre-Launch QA + Handoff | All upstream | Waiting |

As answers arrive, flip rows from "Waiting on Qn" to "Ready." Sections can be built in parallel whenever their prerequisites are complete — you are not strictly linear after Section 1.

---

## Step 5 — Build the Scope Decision Log

A handful of scope decisions do not come from Stacy and Josh — they come from Dan's scope review (completed 2026-04-17). Record them for reference. This prevents "wait, are we building this?" questions mid-build.

**IN SCOPE (approved 2026-04-17):**

Sub-Account Business Profile · Domain + LC Email · LC Phone + A2P · Contacts · Custom Fields · Brand Board · Smart Lists · Stripe + Products · Calendars & Services · Pipelines (Wholesale + Catering) · 10 core workflows · Forms + Chat Widget · Reputation (GBP + Review Requests) · Invoices + Payment Links + Documents/Contracts · **Gift Cards** · Website + Funnel + Blog · **Content AI** · Social Planner · Dashboards + Mobile App

**OPTIONAL (documented with "OPTIONAL" tag in the guide; activation is a post-launch decision):**

- Memberships / Communities (Baker's Club subscription)
- Full E-commerce Store
- Voice AI
- Conversation AI
- Client Portal
- Webinars
- Quizzes
- Custom Objects
- Certificates
- **Ad Manager (§17.5)** — path is built; activation is a post-launch decision

**CONDITIONAL (activates based on intake answer):**

- **Companies module** — activates if Q6 indicates multi-contact wholesale accounts (e.g., tracking owner + chef + purchasing manager under one account). Default is tag-based wholesale tracking at the Contact level.

**OUT OF SCOPE (agency-tier or not applicable):**

SaaS Mode · Reselling Products · HighLevel Affiliates Program · Prospecting Tool · Eliza Agent Platform · MCP Server · Agency Dashboard · Whitelabel Mobile App · Full WhatsApp BSP onboarding

---

## Step 6 — Share and sign off

You are done with Section 1 when you have:

1. Intake Document — 10 questions listed, template ready to fill as answers arrive.
2. Asset Inventory — required + optional checklists in place, shared folder URL for uploads.
3. Blocker Map — initial status of every section populated.
4. Scope Decision Log — the four categories above populated.
5. All four shared with Dan (and with Stacy/Josh where appropriate).

Send Dan a short message with the four links:

> "Section 1 complete. Intake Document, Asset Inventory, Blocker Map, Scope Decision Log all live at [links]. Waiting on [list of open questions]. Proceeding to Section 2 once approved."

Dan confirms receipt. Intake answers now flow asynchronously — you update the Intake Document and Blocker Map each time an answer arrives.

---

## Completion criteria

Section 1 is complete when all four deliverables exist as shared documents, not when all 10 intake answers arrive. Answers arrive over days; the Section 1 infrastructure exists on Day 1.

---

## What happens next

Section 2 — Sub-Account Provisioning & Business Profile — begins immediately on Section 1 approval. Section 2 is not blocked by any intake answer (Dan's agency provisions the sub-account; the Business Profile page reads from assets you already have). Work on Section 2 in parallel with waiting for intake answers.

Use the Blocker Map as your navigation tool from here forward.

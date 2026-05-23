# Section 4 — LC Phone + A2P 10DLC Registration

**Last Updated:** 2026-04-17
*If HighLevel UI doesn't match these instructions, consult the Update Protocol (Phase 5.2). This guide targets the HighLevel platform as of 2026-04-17.*

---

## Purpose

Purchase an LC Phone number for Caramel Oven, configure core phone behaviors (Missed-Call Text-Back, verified caller ID), prepare A2P 10DLC Brand Registration materials for BOTH Standard and Sole Proprietor paths, submit Brand Registration the moment Q1 is answered, submit Campaign Registration once the Brand is approved, and establish the SMS ramp schedule for the first 8 throughput tiers.

**Estimated time:**
- Q1-agnostic prep (Steps 1-4, 6): 60-90 minutes of active work.
- Q1-dependent execution (Step 5): 15-30 minutes once Q1 is answered.
- Carrier review windows (between Step 5 and Step 7): **3-7 business days Brand vetting + 1-3 business days Campaign review** — not negotiable.

**Dependencies:**
- Section 2 complete (sub-account exists with Business Profile populated; Authorized Representative set correctly).
- Section 3 complete (email foundation; some A2P opt-in flows require working email for double opt-in).
- **Q1 answer required before Step 5 can execute.** Every other step runs independently.

---

## Why this section matters — and why we dual-path

SMS is the highest-conversion channel for a local farmers-market bakery. Customers open SMS at 98% within 3 minutes. They respond. They show up. Email takes hours; SMS takes seconds.

But SMS launch has a **3-7 business-day carrier review gate** (A2P Brand Registration) followed by a **1-3 business-day Campaign Registration** review. Nothing bypasses this. A miscalibrated registration attempt adds another full cycle.

**Per Dan's build-velocity directive (2026-04-17):** We do NOT wait for Q1 (legal entity type) before touching Section 4. We pre-build everything that is Q1-agnostic — phone number purchase, campaign materials, sample messages, opt-in documentation, privacy/terms language — so that the moment Q1 comes back, Step 5 (Brand Registration submission) fires within minutes. This saves 1-3 business days of carrier-clock time compared to serial execution.

**Consequence for the playbook:** Section 4 has TWO parallel execution branches for Step 5, triggered by Q1's answer. Everything else runs once, independent of Q1.

---

## What you will produce

1. A **live LC Phone number** assigned to Caramel Oven's sub-account.
2. **Missed-Call Text-Back** configured (captures missed-call leads automatically).
3. **Verified Caller ID** set up (uses the LC number as outbound caller ID from within HighLevel).
4. **Complete A2P Brand Registration package** — prepared for BOTH Standard and Sole Proprietor paths; executed on the correct path when Q1 returns.
5. **Complete A2P Campaign Registration package** — use case selected, 2 sample messages drafted, opt-in method documented, Privacy Policy and Terms of Service language ready.
6. **Brand Registration submitted** (triggered by Q1 answer).
7. **Campaign Registration submitted** (after Brand is approved, typically 3-7 business days later).
8. **SMS ramp schedule documented** — 8 throughput tiers from 100 to 5,000+ daily sends.

---

## Step 1 — Purchase an LC Phone number (Q1-agnostic)

LC Phone is HighLevel's proprietary telephony. One-click activation, no external Twilio account needed. [LC Phone is NOT a Twilio re-brand — this is HighLevel's own service per the Phase 1 audit.]

### 1.1 Enable LC Phone on the sub-account

1. Inside the Caramel Oven sub-account, navigate to **Settings → Phone Numbers**. [UI-VERIFY]
2. If LC Phone is not yet active, click **Activate LC Phone** (or equivalent). Agency billing activates; first month's fees prorated.
3. HighLevel may prompt for a Regulatory Bundle and Address Creation — submit the business's physical address (from Section 2 Business Profile).

### 1.2 Purchase a local number

1. Click **Buy Number** (or equivalent). [UI-VERIFY]
2. Filter by area code. Use the area code matching Caramel Oven's physical address — local-number match improves delivery reputation and customer recognition.
3. Pick a number. Vanity numbers (memorable digit patterns) cost more but aren't worth the premium for a bakery — pick any available.
4. Assign the number to the sub-account. This becomes Caramel Oven's primary outbound number.

### 1.3 Record the phone number

Add to the Intake Document:

```
LC PHONE NUMBER: +1-XXX-XXX-XXXX
Purchased: [date]
Purpose: Primary outbound + inbound SMS/Voice
```

### 1.4 Toll-free number — skipped for Caramel Oven

Toll-free numbers are exempt from A2P 10DLC but have their own verification process. For Caramel Oven (local farmers-market bakery), a local number is operationally correct. **Skip the toll-free option.**

### 1.5 Update Custom Values

1. Go to Settings → Custom Values.
2. Update `custom_values.business_phone` from Section 2 to the new LC Phone number.
3. Save.

Any email signature, chat widget office-hours message, or template referencing `{{custom_values.business_phone}}` now shows the LC number.

---

## Step 2 — Configure phone number settings (Q1-agnostic)

### 2.1 Verified Caller ID

Enable Verified Caller ID so outbound calls from within HighLevel display the LC number (not "unknown caller").

1. Settings → Phone Numbers → select your LC number → **Verified Caller ID**. [UI-VERIFY]
2. Follow the prompt to verify the number matches the Business Profile address and authorization.
3. Save.

### 2.2 Number intelligence (spam detection)

Enable **Number Intelligence** to automatically detect:
- Landline numbers (SMS won't deliver; saves ramp quota).
- Invalid or disconnected numbers (same).
- Spam-risk destinations.

1. Settings → Phone Numbers → **Number Intelligence** toggle → ON. [UI-VERIFY]

### 2.3 Call forwarding (optional)

If Stacy or Josh want incoming calls to ring their personal phone in addition to reaching the HighLevel dialer:

1. Settings → Phone Numbers → select the LC number → **Call Forwarding**. [UI-VERIFY]
2. Add the forward-to number (Stacy's or Josh's mobile).
3. Set "Voicemail fallback" — if the forward-to number doesn't answer within N seconds, voicemail goes to HighLevel.

---

## Step 3 — Configure Missed-Call Text-Back (Q1-agnostic)

Missed-Call Text-Back is the foundational "no-lead-left-behind" automation. When someone calls the LC number and the call isn't answered, HighLevel automatically sends an SMS to the caller: "Sorry we missed your call — how can we help?" This single feature captures more farmers-market drive-by leads than any other sub-feature.

> **Note:** The SMS won't actually SEND until A2P registration is approved (Steps 5-7). But the feature is configured now so it goes live the moment SMS is unlocked.

### 3.1 Enable the feature

1. Sub-Account **Settings → Missed Call Text Back** (or under Phone System → Missed Call). [UI-VERIFY exact path]
2. Toggle to **Enabled**.
3. Compose the auto-reply message. Recommended for Caramel Oven:

> "Hi! This is Caramel Oven Bakehouse — sorry we missed you. How can we help? Reply here and we'll be in touch shortly. Reply STOP to unsubscribe."

Key elements:
- Identifies sender (required by A2P compliance).
- Invites response (drives conversation).
- Includes opt-out (required by A2P compliance).
- Under 160 characters (single-SMS segment; lower carrier cost).

4. Save.

### 3.2 Office-hours variant (optional)

Some bakeries prefer different auto-replies for after-hours vs. business-hours missed calls. HighLevel supports this via a conditional in the Missed-Call workflow — set up in Section 14 (Workflows — Commerce), not here.

---

## Step 4 — Prepare A2P Brand Registration materials (Q1-agnostic)

These materials are needed regardless of Q1 path. Gather them NOW so Step 5 executes within minutes of Q1's answer.

### 4.1 Shared fields (both Standard and Sole Proprietor paths)

Write these out in a document titled "Caramel Oven A2P Brand Package":

- **Legal Business Name** — exactly as it appears on tax filings. **Do NOT use DBA ("doing business as") or trade name.** If Caramel Oven is "Caramel Oven Bakehouse LLC" on state registration, that's what goes here, even if customers see "Caramel Oven" on the storefront.
- **Business Address** — must match the address on legal formation documents. Pull from Section 2 Business Profile.
- **Authorized Representative** — per Section 2 Step 3.4, must match the person legally authorized (registered agent, member/manager, or sole proprietor themselves).
  - First name, last name
  - Title (Owner, Managing Member, Sole Proprietor — use actual title from legal documents)
  - Business email
  - Business phone (can be the new LC number from Step 1, or a personal mobile)
- **Business Industry** — pick closest match. "Food & Beverage" or "Retail" typical for a bakery.
- **Business Type** — LLC / S-Corp / Partnership / Sole Proprietor / Corporation. **This is where Q1 dispatches Step 5.**
- **Business Website** — use the `custom_values.business_website` from Section 3 if available, or leave blank if website isn't up yet (website is not required for Brand approval but helps).

### 4.2 Standard Path additional fields (conditional on Q1 = registered entity)

IF Q1 indicates LLC, S-Corp, Partnership, or Corporation:

- **EIN (Employer Identification Number)** — 9-digit federal tax ID from IRS. Pull from the IRS CP 575 form (the EIN confirmation letter issued when the business registered). **The Legal Business Name on the A2P form must match the IRS CP 575 exactly.**
- **State of Registration** — the state where the LLC/Corp is registered.
- **Stock Ticker / Exchange** (public companies only; Caramel Oven as a small bakery is presumably private; leave blank).
- **Entity Subtype** (if asked) — e.g., Domestic LLC.

> **Watch-out for brand-new EINs:** If the EIN was issued within the last 30-90 days, Brand Registration can fail. Per the A2P Brand Approval article, newly issued EINs require 30-90 days before retry. If Q1 answer indicates a brand-new EIN, flag this to Dan before submitting — may need to wait.

### 4.3 Sole Proprietor Path additional fields (conditional on Q1 = sole proprietor)

IF Q1 indicates Sole Proprietorship:

- **No EIN required** — sole proprietors can use their Social Security Number (SSN) for tax purposes.
- **SSN is NOT submitted to A2P** — the Sole Proprietor path uses a different identity-verification flow (typically Persona KYC, per HighLevel docs).
- **Sole Proprietor's legal name** — the individual's legal name (matches SSN records).
- **Individual's residential address** — may differ from the business address.

> **Implementation note:** Per the A2P Brand Approval Best Practices article (155000000508), the Sole Proprietor path awaits further guidance from LC Phone at submission time. HighLevel may prompt for different fields than the Standard path. [UI-VERIFY: current Sole Proprietor Brand flow on live UI — may differ from Standard walkthrough.]

### 4.4 Throughput implications by path

Standard Brands can qualify for higher throughput tiers (up to 3,000+ SMS/day at the highest trust score). Sole Proprietor Brands cap at lower tiers — typically 1,000 SMS/day maximum. For Caramel Oven's expected volume (hundreds of customers, not thousands), either path supports the realistic send volume. This is a "good to know" note, not a dealbreaker.

---

## Step 5 — Submit A2P Brand Registration (Q1-dependent execution)

This is the ONE step in Section 4 that cannot happen without Q1's answer.

### Decision tree

```
Q1 answer received →
  ├─ Registered entity (LLC / S-Corp / Partnership / Corporation)
  │     → Execute Path A (Standard Brand Registration)
  │
  └─ Sole Proprietorship
        → Execute Path B (Sole Proprietor Brand Registration)
```

### Path A — Standard Brand Registration

1. Inside the sub-account, navigate to **Settings → Phone System → Trust Center**. [UI-VERIFY]
2. Select **Brands & Campaigns** → **Brands** tab → **Create Brand**.
3. Fill the Brand form using the Section 4.1 + 4.2 fields.
4. **Double-check the Legal Business Name matches the IRS CP 575 exactly.** Character-for-character. Punctuation, LLC suffix, capitalization — all must match. This is the #1 rejection reason.
5. Submit. HighLevel routes to TCR (The Campaign Registry) for carrier review.
6. Status transitions to **Pending**. Secondary Vetting can take up to 7 business days.
7. Monitor Trust Center for status updates. You'll receive an email when vetting completes.

### Path B — Sole Proprietor Brand Registration

1. Inside the sub-account, navigate to **Settings → Phone System → Trust Center**. [UI-VERIFY]
2. Select **Brands & Campaigns** → **Brands** tab → **Create Brand** → choose the **Sole Proprietor** option when prompted.
3. Complete the identity verification via Persona (KYC) — HighLevel prompts for the sole proprietor's government ID, selfie, etc. This is a separate verification flow from EIN-based Standard Brand.
4. Fill the Brand form using the Section 4.1 + 4.3 fields (sole proprietor's legal name, residential address, etc.).
5. Submit. HighLevel routes to TCR for carrier review.
6. Status transitions to **Pending**. Review timeline is similar to Standard (3-7 business days) but the identity verification step adds some latency.

### Both paths — after submission

- Record the Brand ID (or status) in the Intake Document.
- Do NOT resubmit if the status shows Pending — wait for carrier response. Re-submitting resets the queue.
- If the status shows **Rejected**, read the rejection reason carefully and consult with Dan. Common causes:
  - DBA or trade name used instead of legal name.
  - Address mismatch (street typo, zip code wrong).
  - DUNS submitted instead of EIN (Standard path only).
  - Brand-new EIN (< 30 days old).

### Brand fees

Registration fees are pass-through from TCR to HighLevel and vary by path. Typical fees for US Brand Registration are in the $4-$40/month range plus a one-time verification fee. Exact amounts shown at submission time. [UI-VERIFY exact fee schedule on live panel]

---

## Step 6 — Prepare A2P Campaign Registration materials (Q1-agnostic)

Campaign Registration happens AFTER Brand approval, but the materials are prepared now. This is a substantial writing task — do it carefully.

### 6.1 Choose the Campaign Use Case

HighLevel's Campaign form presents a dropdown of Use Case types. For Caramel Oven, the appropriate type is **Mixed** (covers appointment reminders, marketing, customer care, order notifications all in one campaign) OR **Customer Care + Marketing** as separate campaigns.

Recommendation: **one Mixed Use Case campaign** for simplicity. A second Marketing-only campaign can be added post-launch if segmentation benefits emerge.

### 6.2 Use Case Description

Write a plain-English paragraph explaining what Caramel Oven sends to whom. Draft:

> "Caramel Oven Bakehouse sends SMS messages to customers and leads who have opted in via our website order form, farmers-market signup sheet, custom-order inquiry form, or by texting START to our business number. Messages include: appointment reminders for custom-order consultations and catering tastings, order confirmations, pickup-ready notifications, review requests after fulfillment, and occasional promotional updates about seasonal offerings. Contacts can opt out anytime by replying STOP."

### 6.3 Two Sample Messages (NO placeholders, NO merge fields)

**CRITICAL:** A2P Campaign registration rejects sample messages containing custom fields or merge-field placeholders (e.g., `{{contact.first_name}}`). Use literal example text.

Sample Message 1 — Appointment Reminder:

> "Hi Sarah! Reminder: your Caramel Oven custom cake consultation is tomorrow, March 15 at 2pm. Address: 123 Main St, Anytown. Reply C to confirm or R to reschedule. Reply STOP to unsubscribe. — Caramel Oven"

Sample Message 2 — Order Pickup:

> "Sarah, your Caramel Oven order (2 dozen sourdough + chocolate babka) is ready for pickup at the Saturday Riverside Farmers Market, 8am-1pm. Questions? Reply to this message. Reply STOP to unsubscribe."

Both samples include: sender identification (Caramel Oven), the opt-out instruction (Reply STOP), and under ~160 characters where possible.

### 6.4 Opt-In Method and documentation

HighLevel's Campaign form asks: how do customers opt into receiving SMS? Select from: **Website URL**, **Verbal Script**, **Keyword Advertisement**, **Paper Form**.

For Caramel Oven, the primary opt-in method is **Website URL** (the order form, catering inquiry form, and chat widget from Section 8 all include SMS-consent checkboxes).

**Opt-In Form URL:** This must be a real, publicly-accessible URL where the consent checkbox is visible. The website/funnel is built in Section 17, so this URL doesn't exist yet.

**Workaround for pre-launch submission:** Use a placeholder URL that points to the eventual order form (e.g., `https://carameloven.com/order`). If the URL returns a 404 at Campaign review time, the carriers may request the working URL before approving. **Plan:** submit Campaign Registration AFTER Section 17 (Website/Funnel) ships, OR host a simple "SMS Opt-In Terms" page as an intermediate step. Flag to Dan: this is a timing decision — early submission risks rejection; late submission extends timeline.

### 6.5 Opt-In Message (< 160 characters)

The message customers receive when they first opt in. Draft:

> "Thanks for subscribing to Caramel Oven SMS updates! Expect occasional order + event messages. Reply STOP to unsubscribe, HELP for help."

Character count: 149. Single SMS segment.

### 6.6 Privacy Policy and Terms of Service

Required documents, hosted at a public URL (e.g., `https://carameloven.com/privacy` and `.../terms`). Same pre-launch URL workaround applies as for Opt-In Form URL.

**Privacy Policy must state:** "Data is not shared with third parties for marketing purposes." This is a common A2P rejection check.

**Terms of Service must include 6 bullet points:**
1. Program name (e.g., "Caramel Oven SMS Updates").
2. Program description (what messages customers receive).
3. Message frequency (e.g., "Message frequency varies — typically 2-8 messages per month").
4. Message and data rates may apply.
5. Opt-out instructions ("Reply STOP to unsubscribe").
6. Carrier liability disclaimer (standard language: "Carriers are not liable for delayed or undelivered messages").

Templates for both Privacy Policy and ToS are available at multiple legal-template sites (Termly, Iubenda, etc.) — pick a template, customize for Caramel Oven, host at the domain.

### 6.7 Save the Campaign Package

Document titled "Caramel Oven A2P Campaign Package" contains all of the above. Review with Dan before Campaign submission. Store in the Asset Inventory shared folder.

---

## Step 7 — Submit A2P Campaign Registration (after Brand approval)

Once the Brand is approved (Step 5 completes successfully — typically 3-7 business days):

1. HighLevel notifies you via email that the Brand is approved.
2. Navigate to **Settings → Phone System → Trust Center → Brands & Campaigns → Campaigns tab → Create Campaign**. [UI-VERIFY]
3. Select the approved Brand.
4. Fill the Campaign form using the Section 6 package.
5. Pay the **$15.75 one-time verification fee** (non-refundable even if campaign fails vetting).
6. Confirm monthly recurring fee ($1.50-$12/month depending on Use Case).
7. Submit. Status transitions to **Pending**.
8. Campaign review typically takes 1-3 business days.
9. Once approved, the LC Phone number is **unlocked for SMS sends** — SMS workflows from Sections 12-14 can now deliver.

---

## Step 8 — SMS ramp plan (Q1-agnostic)

HighLevel enforces a throughput ramp for all new SMS-sending numbers. Understand it before launching Sections 12-14 workflows.

### 8-level throughput ramp

| Level | Max daily SMS | How to advance |
|---|---|---|
| 1 | 100 | Send 100 in 24 hours without breaching 6% error rate or 2% opt-out rate |
| 2 | 250 | Same thresholds, 24-hour window |
| 3 | 500 | Same |
| 4 | 750 | Same |
| 5 | 1,500 | Same |
| 6 | 2,250 | Same |
| 7 | 3,000 | Same |
| 8 (cap for most) | 3,000+ (up to 5,000 for established Standard Brands) | Sustained performance |

Each level advances only after 24 hours of clean sending at the current level. Breaches trigger temporary suspensions.

### Deliverability thresholds (auto-enforced by HighLevel)

- **Error rate ≥ 6%:** warning notification.
- **Error rate ≥ 10%:** automatic 24-hour SMS pause.
- **Opt-out rate ≥ 2%:** warning notification.
- **Opt-out rate ≥ 3%:** automatic 24-hour SMS pause.

"Error rate" includes invalid numbers, unreachable numbers, landlines, and DND-flagged contacts. List hygiene upstream (Number Intelligence from Step 2.2 + Smart Lists excluding DND in Sections 6/13) keeps this below threshold.

### Content rules (auto-enforced by HighLevel and carriers)

- Prohibited content: alcohol, firearms, gambling, tobacco, adult content, any content designed to evade filters (intentional misspellings, unusual opt-out phrases, "snowshoeing" across multiple numbers).
- URL shorteners: **T-Mobile blocks URL cycling; AT&T blocks public shorteners** (bit.ly, tinyurl.com, etc.). Use custom branded short links with at most one redirect.
- Every initial message must include sender identification ("Caramel Oven") and an opt-out instruction ("Reply STOP to unsubscribe").

### Document the ramp schedule

Add to the Intake Document:

```
SMS RAMP SCHEDULE
Level 1 (100 SMS/day) — starts [Campaign approval date]
Level 2 (250 SMS/day) — earliest [date + 1 day]
Level 3 (500 SMS/day) — earliest [date + 2 days]
...
Level 8 (3,000+ SMS/day) — earliest [date + 7 days]
```

In practice, Caramel Oven will likely plateau at Level 4-5 (~750-1,500 SMS/day) based on realistic bakery volume.

---

## Step 9 — SMS launch checklist (Q1-agnostic)

Before any SMS goes live (whether via workflow, campaign, or manual send from Conversations), verify:

1. ✅ Brand Registration approved (green status in Trust Center).
2. ✅ Campaign Registration approved (green status in Trust Center).
3. ✅ Verified Caller ID enabled.
4. ✅ Number Intelligence enabled.
5. ✅ Missed-Call Text-Back configured and tested (call the LC number from a cell phone — does the auto-reply arrive?).
6. ✅ All outbound SMS templates include sender identification and STOP opt-out language (template review happens in Sections 12-14).
7. ✅ Custom Values `custom_values.business_phone` reflects the new LC number.
8. ✅ `custom_values.business_address` matches A2P Brand submission exactly (same legal address).

---

## Completion criteria

Section 4 is COMPLETE when:

1. ✅ LC Phone number purchased and assigned.
2. ✅ Verified Caller ID, Number Intelligence enabled.
3. ✅ Missed-Call Text-Back configured.
4. ✅ Brand Registration submitted (Path A or Path B based on Q1 answer).
5. ✅ Campaign Registration materials complete (Step 6 package) — stored in Asset Inventory.
6. ✅ `custom_values.business_phone` updated.
7. ✅ SMS ramp schedule documented.

Section 4 is **partially COMPLETE** at submission. Full completion (SMS-ready) requires:

8. ✅ Brand approved by carrier (3-7 business days after Step 5 submission).
9. ✅ Campaign Registration submitted (Step 7) — requires Brand approval first.
10. ✅ Campaign approved by carrier (1-3 business days after Step 7 submission).

The 4-10 business day wait between submission and SMS-ready is **unavoidable**. During this wait, move on to Sections 5, 8, 10, or any other unblocked section.

---

## What happens next

**Next section:** **Section 5 — Custom Fields · Tags · Brand Board · Brand Voice**. Section 5 is blocked by Q9 (brand assets) but can be started with placeholder assets and updated when Q9 arrives.

**Also ready to move on:** Section 8 (Forms + Chat Widget) has no intake blockers; Section 10 (Pipelines + Opportunities) is Q6-informed but not Q6-blocked. Either can run in parallel with the A2P approval wait.

**DO NOT wait on Section 4 approval to start Sections 5/8/10.** The 4-10 business day carrier clock is non-negotiable dead time — the build must continue in parallel.

---

## Flags for this section

- **Assumptions made:** (a) Local LC Phone number (not toll-free) is correct for a regional bakery; (b) "Mixed" Campaign Use Case is appropriate for Caramel Oven; (c) Missed-Call Text-Back is an IN-SCOPE workflow foundation (Section 14 expands on it); (d) Opt-In Form URL + Privacy + Terms URLs may need placeholder-then-cutover treatment since Section 17 ships the actual website later; (e) Sole Proprietor Brand flow may prompt for different fields than currently documented — UI-VERIFY at submission.
- **Gaps identified:** (a) UI-VERIFY flags: Settings → Phone Numbers, Trust Center → Brands & Campaigns, Missed Call Text Back location, Sole Proprietor flow specifics, exact Brand fee schedule. (b) No live A2P submission experience on my side — timing estimates (3-7 days Brand, 1-3 days Campaign) are from HighLevel docs, not from direct observation. (c) Privacy Policy / Terms of Service authoring — not a HighLevel concern; flagging Dan to generate these from a legal template or existing bakery documents.
- **Competing approaches:** (a) **Dual-path A2P architecture** (this playbook) vs. wait for Q1 before writing — chose dual-path per Dan's velocity directive. (b) Submit Campaign Registration pre-website vs. wait for Section 17 completion — flagged as a timing decision; recommend waiting for Section 17 to avoid placeholder-URL rejection risk, but dual-path so both are possible. (c) **Single Mixed Use Case** vs. separate Customer Care + Marketing campaigns — chose single campaign for simplicity; can split later if segmentation demands.
- **Optional features included:** Call Forwarding (optional in Step 2.3); toll-free number explicitly declined for this sub-account.
- **Hard Q1 dependency confirmed:** Only Step 5 (Brand Registration submission) hard-depends on Q1. All other Section 4 work proceeds without Q1. Per Dan's directive — this is pivot-safe.

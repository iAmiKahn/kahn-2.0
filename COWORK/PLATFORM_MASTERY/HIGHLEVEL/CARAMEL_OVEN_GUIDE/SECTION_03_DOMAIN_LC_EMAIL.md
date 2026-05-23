# Section 3 — Domain + LC Email Setup

**Last Updated:** 2026-04-19
*If HighLevel UI doesn't match these instructions, consult the Update Protocol (Phase 5.2). This guide targets the HighLevel platform as of 2026-04-17.*

---

## Purpose

Connect Caramel Oven's domain to HighLevel, set up a dedicated sending subdomain for LC Email, configure the DNS records that authenticate outgoing email (SPF, DKIM, DMARC), and enable Preference Management for granular unsubscribe control. By the end of this section, Caramel Oven can send email from its own domain and receive inbox placement instead of spam folder.

**Estimated time:** 45-90 minutes of active setup. DNS propagation adds 1-48 hours of wait time (usually under 10 minutes).

**Dependencies:**
- Section 2 complete (sub-account exists).
- **Q2 RESOLVED 2026-04-19:** Caramel Oven owns `caramelovenokc.com` at **GoDaddy**. Site is **LIVE** (GoDaddy Website Builder). **Path B cutover planning applies** — subdomain-first for email, defer root-domain migration to Section 17.

---

## Why this section matters

Email deliverability is the make-or-break foundation for most of what comes later: every appointment confirmation, review request, marketing campaign, invoice receipt, and abandoned-cart nudge depends on email landing in inboxes. Gmail, Microsoft, and Yahoo ask three questions about every incoming email: Is it safe? Is it wanted? Is it wanted by this person? All three must answer "yes" for inbox placement. Proper authentication (SPF + DKIM + DMARC) answers the first. Engaged subscribers answer the second and third.

Mistakes here show up weeks later as "our emails aren't landing" — at which point recovery takes longer than getting it right the first time. This is the other measure-twice-cut-once section (the first was Section 1).

**Two non-obvious principles carried through this section:**

1. **Use a subdomain for email, not the root domain.** If Caramel Oven owns `caramelovenokc.com`, send email from `mail.caramelovenokc.com`. A subdomain isolates email reputation from website reputation — if one gets tarnished, the other stays healthy.
2. **Roll DMARC out gradually.** Start with monitor-only (`p=none`) for the first two weeks, escalate to `p=quarantine` for weeks 3-4, then `p=reject` from week 5 onward. Shipping `p=reject` on day one can drop legitimate emails into black holes silently.

---

## What you will produce

1. **Domain connected** to the Caramel Oven sub-account (for funnels and websites).
2. **Dedicated sending subdomain** configured for LC Email (e.g., `mail.caramelovenokc.com`).
3. **DNS records configured** at the domain registrar: SPF, DKIM, DMARC, CNAME, MX.
4. **Domain verified in HighLevel** with SSL certificate issued automatically.
5. **Preference Management enabled** (Labs feature, one-way activation).
6. **Unsubscribe Link Custom Value** populated with the compliance-required one.
7. **Domain warmup schedule** documented for the first 4 weeks of sending.

---

## Step 1 — Path B cutover plan (Q2-resolved)

Caramel Oven's situation per Q2: domain `caramelovenokc.com` is owned at GoDaddy and connected to a LIVE GoDaddy Website Builder site with an "Order Now" CTA. This is **Path B** — domain exists and root is connected to existing website that we are eventually replacing in Section 17.

**Cutover strategy:**

- **Today (Section 3):** Add email sending on the **subdomain `mail.caramelovenokc.com`**. Root domain `caramelovenokc.com` stays pointed at GoDaddy Website Builder. Email + root website operate independently. No disruption to the live site.
- **At Section 17 completion:** switch the root domain's A record from GoDaddy Website Builder to HighLevel Sites. Site cutover window: minutes to hours. Plan this cutover for an off-peak time (early morning OKC time).
- **Never during this section:** do not touch the root `caramelovenokc.com` A record. The live site must remain operational throughout the 2-4 week build.

**What this means practically:**
- The GoDaddy Website Builder site stays the customer-facing site until Section 17 ships.
- All email sending in Section 3 uses `mail.caramelovenokc.com` subdomain — isolated from the website.
- DNS edits in Step 4 target the subdomain ONLY, plus compliance records at the root (DMARC is per-domain; SPF/DKIM are per-subdomain).
- Check `caramelovenokc.com` in a browser after Step 4 — should still show the existing Order Now site.

**Archived path reference:** earlier versions of this section documented Paths A/C/D (no-domain, domain-owned-but-not-connected, domain-connected-to-other-ESP). Q2 resolved to Path B; the other paths are retained in Phase 1 documentation for future client reference.

---

## Step 2 — Add the domain to HighLevel (for Sites/Funnels)

This is the separate-from-LC-Email domain connection, used for funnels and websites. Even if Caramel Oven's primary goal is email, set this up now so Section 17 is unblocked later.

1. Inside the sub-account, go to **Settings → Domains**. [UI-VERIFY: exact menu label]
2. Click **+ Add Domain**.
3. Enter the root domain (`caramelovenokc.com`) OR the subdomain you plan to use for the website (`www.caramelovenokc.com`).
4. HighLevel displays the required DNS records (typically an A record pointing to a HighLevel IP, or a CNAME record pointing to a HighLevel hostname).
5. Leave this tab open. You'll configure the records in Step 4.

---

## Step 3 — Set up the dedicated LC Email sending subdomain

This is the email-specific domain connection. Subdomain recommended (e.g., `mail.caramelovenokc.com`).

1. Navigate to **Settings → Email Services → Dedicated Domain & IP**. [UI-VERIFY: exact menu label on current UI]
2. Click **+ Add Domain**.
3. Enter the subdomain: `mail.caramelovenokc.com` (recommended) or whatever subdomain pattern the business prefers. Do NOT use the root `caramelovenokc.com` for email — keep email and website domains isolated.
4. Click **Add & Verify**.
5. HighLevel creates the entry and prepares the required DNS records. Access the **three-dot menu** next to the new domain entry and click **Verify domain**.
6. HighLevel displays the DNS records you need to configure: **SPF (TXT) · DKIM (TXT) · DMARC (TXT) · CNAME · MX**. Each record shows exact values with copy buttons.
7. Leave this tab open. You'll copy these records into the domain registrar in Step 4.

---

## Step 4 — Configure DNS records at the registrar

This is the step that people most commonly get wrong. Take your time. Work one record type at a time.

### 4.1 Log into GoDaddy

Use Stacy or Josh's GoDaddy credentials (the registrar for caramelovenokc.com). Navigate to: **GoDaddy Dashboard → My Products → Domains → caramelovenokc.com → DNS**. This opens the DNS Management interface.

**GoDaddy-specific notes:**
- GoDaddy's DNS interface uses "Host" field with "@" meaning root domain. For our subdomain-targeted records, the Host field is the subdomain prefix (e.g., `mail` for `mail.caramelovenokc.com`).
- TTL default is 1 Hour; change to 600 seconds (10 minutes) during setup for faster verification; restore to 1 Hour after verified.
- GoDaddy sometimes auto-appends the domain suffix to the Host field — if you type `mail.caramelovenokc.com`, GoDaddy may save it as `mail.caramelovenokc.com.caramelovenokc.com`. Enter just the prefix (`mail`).
- Save after each record; GoDaddy commits edits individually rather than in a batch.
- **Do NOT delete existing A records pointing to GoDaddy Website Builder** — those keep the live site running.

### 4.2 Add the SPF record (TXT)

SPF (Sender Policy Framework) tells receiving servers which mail servers are authorized to send on behalf of the domain.

- **Record type:** TXT
- **Host / Name:** `mail` (if Caramel Oven is using the subdomain `mail.caramelovenokc.com`). Some registrars ask for `@` for root — here it's the subdomain.
- **Value:** exactly what HighLevel shows in the Verify Domain panel. It typically looks like: `v=spf1 include:mail.leadconnectorhq.com ~all`
- **TTL:** 300 (5 minutes) for faster propagation during setup. Can raise to 3600 later.

> **Watch-out:** Only ONE SPF TXT record per (sub)domain. If an existing record exists at the same host, MERGE instead of adding a second one. Two SPF records = both invalid.

### 4.3 Add the DKIM record (TXT)

DKIM (DomainKeys Identified Mail) adds a cryptographic signature to each email so receiving servers can verify it hasn't been tampered with.

- **Record type:** TXT
- **Host / Name:** as shown by HighLevel — typically something like `gohighlevel._domainkey.mail` (selector + `._domainkey.` + subdomain).
- **Value:** the long public key HighLevel displays (starts with `v=DKIM1; k=rsa; p=...`). Copy exactly.
- **TTL:** 300.

### 4.4 Add the DMARC record (TXT)

DMARC (Domain-based Message Authentication, Reporting & Conformance) is the enforcement and reporting layer that sits on top of SPF + DKIM.

- **Record type:** TXT
- **Host / Name:** `_dmarc.mail` (literal underscore; for subdomain-level DMARC use `_dmarc` + the subdomain).
- **Value (WEEK 1-2):** `v=DMARC1; p=none; rua=mailto:postmaster@caramelovenokc.com;`
- **TTL:** 300.

> **DMARC rollout plan (IMPORTANT):**
> - **Week 1-2 (now):** `p=none` — monitor-only. DMARC reports aggregate to the rua email address; no emails get rejected or quarantined during this phase.
> - **Week 3-4:** Change to `p=quarantine` — failing emails land in spam folder instead of inbox. Verify aggregate reports show no legitimate email failing authentication before making this switch.
> - **Week 5+:** Change to `p=reject` — failing emails are dropped entirely. This is the target state.
> Shipping `p=reject` on day 1 can drop legitimate emails into black holes. Do not skip the ramp.

### 4.5 Add the CNAME and MX records

HighLevel's Verify Domain panel shows the exact CNAME and MX values. Typical patterns:

- **CNAME:** a record pointing something like `mail.caramelovenokc.com` at a HighLevel hostname such as `mail.msgsndr.com`. TTL 300.
- **MX:** a record pointing mail to HighLevel's mail exchanger. TTL 300. Priority as specified.

Copy exactly. Do not substitute your own hostnames.

### 4.6 Save changes at the registrar

Most registrars save DNS changes instantly; propagation takes 1-10 minutes typically, up to 48 hours in unusual cases.

---

## Step 5 — Verify the domain in HighLevel

Return to the HighLevel Verify Domain panel (from Step 3).

1. Click **Verify Domain** (or refresh / re-verify, depending on UI state). [UI-VERIFY]
2. HighLevel checks each record and shows per-record status: green check = verified; red X = not yet detected.
3. If all five records (SPF, DKIM, DMARC, CNAME, MX) show green, the domain is verified. SSL certificate issues automatically within 1-10 minutes.
4. If any are red after 15 minutes, troubleshoot:
   - **Record mismatch:** exact character-for-character compare (copy-paste errors are common).
   - **Host/Name field errors:** `@` for root vs. just the subdomain prefix for subdomains. If HighLevel shows "mail._domainkey" and you type "_domainkey.mail.caramelovenokc.com," the registrar may reformat incorrectly.
   - **Duplicate records:** only one SPF, one DMARC, per (sub)domain. Merge if needed.
   - **TTL settings:** lower TTLs propagate faster; if you set TTL to 3600, expect 1-hour wait minimum.
   - **Propagation delay:** DNS updates can take 24-48 hours in rare cases, but 90%+ propagate in under 10 minutes. Wait longer before retrying.

Once verified, take a screenshot of the green-checkmark state and save to the Asset Inventory folder.

---

## Step 6 — Enable Preference Management (Labs feature)

Preference Management lets subscribers manage category-level email preferences (e.g., unsubscribe from promotions but keep order confirmations) rather than all-or-nothing opt-out. This is what keeps engaged customers subscribed while letting uninterested ones tune out.

> **ONE-WAY ACTIVATION WARNING:** Preference Management is a Labs feature. **Once enabled, it CANNOT be disabled.** This is documented in HighLevel's own doc (155000007291). Make the decision deliberately.

Recommendation: **enable it.** The benefits outweigh the irreversibility — category-level opt-out is superior to binary opt-out for a bakery with multiple audience segments (farmers-market regulars, wholesale accounts, catering prospects, newsletter subscribers).

### How to enable

1. **Agency-level action first:** Dan enables the feature in **Agency Settings → Labs**. Toggle Preference Management to ON. [UI-VERIFY]
2. **Inside the sub-account:** navigate to **Settings → Preference Management Hub**. [UI-VERIFY]
3. Create 3-5 baseline preference categories. Suggested for Caramel Oven:
   - **Newsletter** — recipes, seasonal updates, general announcements.
   - **Promotions & Offers** — sales, discounts, seasonal promos, gift card campaigns.
   - **Order Updates** — appointment confirmations, order receipts, shipping/pickup notices.
   - **Reviews & Surveys** — post-purchase review requests, feedback surveys.
   - **Wholesale & Catering** — B2B-specific updates; only shown to wholesale-tagged contacts.
4. Each category name is limited to 100 characters. Save each.

### How categories attach to campaigns

When you create an email campaign in Section 17+ or a Workflow email action in Sections 12-14, assign one or more Preference Categories to it. HighLevel automatically filters the audience — contacts who have unsubscribed from that category are removed from the send, regardless of how they arrived in the audience.

> **Workflow email impact:** This filtering applies to Workflow email actions too, not just broadcast campaigns. A customer who opted out of "Promotions" will NOT receive a "20% off this week" email even if they're in the Smart List that triggers the workflow.

---

## Step 7 — Configure unsubscribe and compliance links

### 7.1 Populate the Unsubscribe Link Custom Value

HighLevel auto-populates the `custom_values.unsubscribe_link` token with a per-contact unsubscribe URL. Verify:

1. Go to Settings → Custom Values.
2. Confirm `custom_values.unsubscribe_link` exists with a Value like `{{unsubscribe_link}}` or an auto-generated template. [UI-VERIFY]
3. If blank or missing, refer to the LC Email setup article for the correct token pattern and paste it in.

### 7.2 List-Unsubscribe header

HighLevel adds the `List-Unsubscribe` header automatically to outgoing LC Email. This is Google/Yahoo 2024 compliance-required for bulk senders. No manual configuration needed — just verify it's enabled in **Settings → Email Services** default configuration.

### 7.3 Email footer compliance

Every marketing email (not transactional) must include:
- The business's physical address (CAN-SPAM compliance).
- An unsubscribe link.
- Optionally: a "Manage your preferences" link (Preference Management).

The email footer will be set up in Section 12 (Workflows — Appointment & Purchase) as part of the first email template. Section 3 establishes the infrastructure; Section 12 uses it.

---

## Step 8 — Plan the domain warmup

A brand-new sending domain has no reputation. Blasting a full customer list on day one signals to mailbox providers "this is either a compromised account or a spammer." Deliverability cratering follows.

### 4-week warmup schedule (recommended)

| Week | Max daily sends | Notes |
|---|---|---|
| Week 1 | 25-50 emails | Transactional only (appointment confirmations, receipts). No marketing campaigns. |
| Week 2 | 100-250 emails | Add a welcome sequence for new leads. Still no mass-list sends. |
| Week 3 | 500-1,000 emails | First small marketing send — to most-engaged customers only (recent buyers, frequent visitors). |
| Week 4 | 2,000-5,000 emails | Larger marketing sends allowed. Full list still not advisable yet. |
| Week 5+ | Open — monitor engagement | Full-list sends OK if engagement metrics (open rate, click rate, bounce rate, spam complaint rate) stay healthy. |

Document this schedule in the Intake Document under a new section:

```
LC EMAIL WARMUP SCHEDULE
Week 1 (dates: [M/D to M/D]): Transactional only, max 50/day
Week 2: Welcome sequences added, max 250/day
Week 3: Small campaign to most engaged, max 1,000/day
Week 4: Expanded campaigns, max 5,000/day
Week 5+: Full-list OK if engagement metrics healthy
```

### Engagement thresholds to watch during warmup

- **Bounce rate:** should stay under 5% — higher means list hygiene issues.
- **Spam complaint rate:** should stay under 0.1% — higher signals audience doesn't recognize or want the sender.
- **Open rate:** look for 20%+ for marketing; 50%+ for transactional (appointment confirmations, receipts) is normal.

If any threshold breaks during warmup, pause, audit the sending list, and resume at half volume.

---

## Step 9 — Verify with test sends

Before declaring Section 3 complete:

1. Send a test email from HighLevel to your own email address (Dan's): **Conversations → New Email → pick yourself as recipient → send**. [UI-VERIFY exact path]
2. Check your inbox:
   - Does it land in Inbox (good) or Spam (bad)?
   - Open the email and view the raw headers (in Gmail: three-dot menu → Show original). Look for:
     - `SPF: PASS`
     - `DKIM: PASS`
     - `DMARC: PASS`
   - If any header shows FAIL, the corresponding DNS record is misconfigured. Return to Step 4 and double-check.
3. Send a second test to a Gmail address, a third to a Microsoft (Outlook/Hotmail) address, a fourth to a Yahoo address if possible. Major mailbox providers have different filtering logic. All four should land in inbox.
4. If any test lands in spam: check the email content for red flags (all-caps subject line, excessive links, spam-trigger words) and DNS authentication status.

Update the `custom_values.business_website` from Section 2 if the domain is now live for the website side (Path A scenarios):

1. Settings → Custom Values.
2. Find `custom_values.business_website`.
3. Replace the `[placeholder]` with the actual URL (e.g., `https://caramelovenokc.com`).
4. Save.

---

## Completion criteria

Section 3 is complete when:

1. ✅ Domain added in HighLevel (Settings → Domains) — verified or pending verification.
2. ✅ Dedicated LC Email sending subdomain added (`mail.caramelovenokc.com` or similar).
3. ✅ All five DNS records configured at the registrar: SPF · DKIM · DMARC · CNAME · MX.
4. ✅ HighLevel Verify Domain panel shows all green checkmarks.
5. ✅ SSL certificate issued (automatic within 1-10 minutes of verification).
6. ✅ Preference Management enabled at the Agency level; 3-5 categories created in the sub-account.
7. ✅ Unsubscribe Link Custom Value populated.
8. ✅ Domain warmup schedule documented in Intake Document.
9. ✅ Test emails sent successfully with SPF/DKIM/DMARC all PASS in raw headers.
10. ✅ `custom_values.business_website` updated (if domain is also serving the website).

---

## What happens next

**Section 4 — LC Phone + A2P 10DLC Registration** begins on Section 3 approval, assuming **Q1 (legal entity type)** has been answered. Q1 is the highest-priority intake question because A2P Brand Registration has a 3-7 business-day carrier review window; starting that clock early keeps the build on schedule.

Section 4 will cover: purchasing an LC Phone number, configuring Missed-Call Text-Back, submitting A2P Brand Registration (Standard vs. Sole Proprietor path based on Q1), submitting A2P Campaign Registration with sample messages and opt-in documentation, and setting the expectation that SMS launch is NOT day-1 (waits on carrier approval).

If Q1 is still pending when Section 3 completes, move forward with **Section 8 (Forms + Chat Widget)** or **Section 10 (Pipelines & Opportunities)** instead — both are unblocked per the Blocker Map.

---

## Flags for this section

- **Assumptions made:** (a) Subdomain pattern (`mail.caramelovenokc.com`) is recommended over root-domain sending for email-reputation isolation; (b) DMARC rollout over 4 weeks is industry-standard best practice, not a HighLevel-specific requirement — if Dan's Agency has a house policy, substitute; (c) Preference Management enable is recommended despite one-way activation — benefit of category-level opt-out outweighs the inflexibility; (d) Warmup schedule (50 → 250 → 1K → 5K → open) is a conservative default for a cold domain — if Caramel Oven has been sending from this domain via another ESP previously, shorter warmup is OK (Path D in Step 1).
- **Gaps identified:** Four UI-VERIFY flags embedded — exact menu paths for Settings → Domains, Settings → Email Services → Dedicated Domain & IP, Settings → Preference Management Hub, and the Conversations test-email flow. All are minor label-drift concerns, not structural.
- **Competing approaches:** (a) Root-domain email (`caramelovenokc.com`) vs. subdomain (`mail.caramelovenokc.com`) — chose subdomain for reputation isolation. If Caramel Oven wants emails to read as "from caramelovenokc.com" in recipient clients, this is a display-name concern solved separately (the From Name / From Email fields), not a DNS concern. (b) Enable Preference Management now vs. defer to Section 12 (Workflows) — chose now because the Labs toggle lives at Agency level and enabling it per-client during workflow setup is awkward. (c) Ship p=reject DMARC on day one (fast, strict) vs. phased rollout (slow, safe) — chose phased; industry consensus.
- **Optional features included:** None in this section. Preference Management is IN SCOPE but noted as irreversible.

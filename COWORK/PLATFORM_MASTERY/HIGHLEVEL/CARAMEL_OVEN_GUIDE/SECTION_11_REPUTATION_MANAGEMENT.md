# Section 11 — Reputation Management

**Last Updated:** 2026-04-19
*If HighLevel UI doesn't match these instructions, consult the Update Protocol (Phase 5.2). This guide targets the HighLevel platform as of 2026-04-19.*

---

## Purpose

Stand up Caramel Oven's reputation infrastructure: claim and verify Google Business Profile (GBP), integrate it with HighLevel, configure Reviews AI for automated review response, build the Review Widget for the Section 17 website, configure Review Request Balancing across Google and Facebook, and populate the `custom_values.review_link` placeholder that has been threaded through every email template since Section 2.

**Estimated time:** 45 minutes of active configuration + **5-14 day postcard verification wait** (Google's timeline, not ours). Most configuration happens while waiting for postcard.

**Dependencies:**
- Section 2 complete.
- Section 3 complete (LC Email live — review requests send via email).
- Section 4 submitted (SMS unlock pending carrier approval — review requests via SMS queue).
- Section 5 complete (Brand Board + Brand Voice for email/SMS template styling).
- Section 8 complete (Feedback Survey drives Review Request enrollment).
- **Q4 RESOLVED 2026-04-19:** GBP NOT currently claimed. Step 1 below = Stacy or Josh claims via postcard verification.

---

## Why this section matters

For a local, farmers-market-visible bakery in Oklahoma City, **Google is the dominant discovery channel**. When someone searches "Oklahoma City bakery," "wedding cake OKC," or "custom cookies OKC," Google Maps + local-pack results are what decide whether Caramel Oven shows up — and review count + average rating drive local SEO ranking.

Three non-obvious effects of this section:

1. **Reviews compound.** A bakery with 50+ Google reviews averaging 4.8+ stars ranks above competitors with 20 reviews at 4.5. The system built here asks for reviews automatically after every completed transaction — over 6 months, this creates a moat that's hard for competitors to displace.
2. **Review response is an SEO signal.** Google weights "business owner is engaged with reviews" in local ranking. Reviews AI (Suggestive + Auto-Pilot) makes owner-response the default behavior rather than an aspirational task Stacy forgets.
3. **Negative reviews get handled BEFORE they damage reputation.** Section 8's NPS ≤ 6 workflow tags contacts `behavior:negative-feedback` BEFORE they post to Google. Workflow #4 (Section 12) pauses their Review Request workflow so they never get auto-asked. Negative reviews still happen, but not for customers we could have reached first.

---

## What you will produce

1. **Google Business Profile claimed and verified** for Caramel Oven Bakehouse at the OKC address.
2. **GBP integrated** with the Caramel Oven sub-account.
3. **Reviews AI configured** — Auto-Pilot for 4-5 star reviews, Suggestive mode for ≤3 star (owner approval required before posting).
4. **Review Request templates** drafted (SMS + Email) pulling from Brand Voice.
5. **Review Request Balancing** set (default 70% Google / 30% Facebook for early rating momentum).
6. **Review Widget** built for embedding on Section 17 website.
7. **`custom_values.review_link` populated** — closes the Section 2 placeholder.
8. **Review-response process documented** for Stacy/Josh handling of ≤3 star reviews that Suggestive mode queues.

---

## Step 1 — Claim and verify Google Business Profile (Stacy / Josh action)

**Who does this:** Stacy or Josh. Dan provides instructions; owners execute because GBP ownership lives on their Google account.

### 1.1 Check for existing unclaimed listing

Before creating a new profile, check whether Google auto-generated one based on Stacy/Josh's business activity:

1. Go to `google.com/maps`.
2. Search for **"Caramel Oven Bakehouse"** + OKC location.
3. If a listing appears with a "Claim this business" button: click it. Proceed to Step 1.3.
4. If no listing exists: proceed to Step 1.2 (create from scratch).

### 1.2 Create the profile from scratch

1. Go to `google.com/business` → **Manage now** or **Create Business Profile**.
2. Sign in with Stacy's or Josh's Google account.
3. Enter business name: **Caramel Oven Bakehouse**.
4. Category: **Bakery** (primary). Add secondary: **Dessert shop** and **Caterer** if applicable.
5. Enter business location: check **"Yes, I serve customers at my business location"** if they have a storefront pickup address; otherwise select service-area-business.
6. Enter address (matches Section 2 Business Profile + Section 7 Stripe).
7. Service areas: Oklahoma City + delivery radius if Caramel Oven delivers.
8. Contact info: phone (use the new LC Phone OKC number from Section 4 if assigned; use 224.303.8897 as fallback if OKC number not yet provisioned — **replace with OKC number at Section 17 cutover per Dan directive**).
9. Website: `https://caramelovenokc.com`.
10. Finish initial setup.

### 1.3 Verify the profile

Google offers multiple verification methods; which one shows up depends on business category and address:

- **Postcard verification (most common for bakeries):** Google mails a physical postcard to the business address with a 5-digit verification code. Takes **5-14 days** to arrive. When it does: enter the code at `business.google.com`. Profile status shifts to Verified.
- **Phone verification:** some categories offer immediate phone verification — if shown, take it over postcard.
- **Email verification:** if the domain email matches a verifiable business domain.
- **Video verification:** some businesses are prompted to submit a video of the storefront + interior; verification within 3-5 business days.

### 1.4 Flag the postcard window

Record in Intake Document:

```
GBP VERIFICATION
Claim method: [postcard / phone / email / video]
Submitted: [date]
Expected verification: [+5-14 days]
Status: PENDING
```

**Do NOT proceed past Step 2 until GBP shows Verified.** Verification is the unlock for the rest of this section's automation.

### 1.5 Pre-verification: populate the profile

While waiting for postcard, Stacy/Josh should populate the profile with:
- Hours of operation (match Section 9 Step 4.1).
- Photos (storefront if available, product shots, behind-the-scenes baking).
- Services description.
- FAQs.
- Posts (Google supports social-media-style posts on GBP — post once a week minimum during warmup).

A well-populated profile verifies faster and ranks better from Day 1 post-verification.

---

## Step 2 — Integrate GBP with HighLevel

**Where:** Settings → Integrations → **Google Integrations**. [UI-VERIFY]

### 2.1 OAuth connection

1. Inside the sub-account, Settings → Integrations → Google.
2. Click **Connect Google Business Profile**.
3. Browser redirects to Google. Log in with the GBP-owning Google account (Stacy's or Josh's).
4. Approve HighLevel's authorization scope (read reviews, post responses, access location data).
5. HighLevel redirects back; shows "Connected" with the GBP location linked.

### 2.2 Verify the link

1. Navigate to **Reputation → Reviews**. [UI-VERIFY]
2. Existing GBP reviews (if any — Q4 indicated none yet, but if customers left reviews during the unclaimed period they may appear) should populate.
3. If empty: expected — zero reviews at launch.

---

## Step 3 — Configure Reviews AI

**Where:** Settings → Reviews AI (or Reputation → Settings → Reviews AI — UI varies). [UI-VERIFY]

Reviews AI has two modes: **Auto-Pilot** (fully automated) and **Suggestive** (generates response, human approves before posting).

### 3.1 Agency-level enablement

Dan enables Reviews AI at the Agency level first:

1. Agency Settings → Integrations → Reviews AI → **Enable**.
2. Billing: Reviews AI costs $0.01 per response generation after 3 free attempts per review. At Caramel Oven's expected volume (10-30 reviews/month post-launch), monthly cost is $0.10 – $0.30. Negligible.

### 3.2 Sub-account Reviews AI configuration

Inside Caramel Oven sub-account:

1. Reputation → Reviews → Settings → **Reviews AI Configuration**. [UI-VERIFY]

### 3.3 Per-rating response strategy

| Star rating | Mode | Response pattern |
|---|---|---|
| 5 ⭐ | **Auto-Pilot** | Warm thank-you; reference specific product if mentioned; signed "— Stacy or Josh, Caramel Oven." |
| 4 ⭐ | **Auto-Pilot** | Thank-you + invitation to DM for any feedback; "we want to earn the 5th star next time." |
| 3 ⭐ | **Suggestive** | AI drafts a thoughtful response; Stacy or Josh reviews + edits + posts. Do NOT auto-post. |
| 2 ⭐ | **Suggestive** | Same as 3⭐ — owner approval required. Typically triggers personal outreach (email or call). |
| 1 ⭐ | **Suggestive** + Internal Notification | AI drafts; owner reviews; also triggers Workflow #4 Negative Feedback Handler (Section 12) for internal escalation. |

Configure each rating band in the Reviews AI settings. **Spam-flagged reviews:** leave to manual (Stacy or Josh decides whether to dispute).

### 3.4 Response tone guardrails

Reviews AI pulls from Brand Voice (Section 5). Test output for the Caramel Oven voice:
- Does the response avoid "delight" and "curated"? (Section 5 avoid-list)
- Does it sign off as Stacy or Josh individually, not "Team Caramel Oven"?
- Is it plain-spoken and not over-formal?

Generate 3-5 test responses against dummy reviews. Iterate Brand Voice fields if output drifts.

### 3.5 Auto-Pilot wait time

Configure a 30-minute wait between review arrival and Auto-Pilot response. Prevents "instant AI response" vibe; gives the response time to feel considered. Adjust longer if Caramel Oven prefers; 30 min is the sweet spot.

---

## Step 4 — Configure Review Request templates

**Where:** Reputation → Settings → **Review Request Templates**. [UI-VERIFY]

### 4.1 Email template

Subject: *"{{contact.first_name}}, quick favor?"*

Body (Brand Voice applied):

> Hi {{contact.first_name}},
>
> Stacy here. Thanks for picking up from us {{custom_values.last_purchase_reference_or_generic}}. If you liked what we made, would you leave a quick Google review? It takes 60 seconds and it genuinely helps us — we're a two-person shop and reviews are what local customers check before trying somewhere new.
>
> {{custom_values.review_link}}
>
> If anything wasn't right, please reply to this email instead. I'd rather fix it directly than read about it on Google.
>
> — Stacy
> Caramel Oven Bakehouse
> {{custom_values.business_phone}}

### 4.2 SMS template

*"Hi {{contact.first_name}}, Stacy at Caramel Oven here. If you had a minute to leave us a Google review, it'd mean a lot — link: {{custom_values.review_link}}. Reply STOP to unsubscribe."*

Character count: ~145. Single SMS segment.

### 4.3 Template variants

Create a second variant for **wholesale contacts** where the tone shifts slightly:

Email subject: *"Thanks for the order, {{contact.first_name}}"*
Body adjustment: reference wholesale context; signed "Stacy & Josh, Caramel Oven"; less "mom-and-pop" framing; still plain-spoken.

Flag which template fires based on contact's `segment:*` tag in Workflow #3 (Section 12).

---

## Step 5 — Configure Review Request Balancing

**Where:** Reputation → Settings → **Review Link** → Balancing configuration. [UI-VERIFY]

### 5.1 Initial balance: 70% Google / 30% Facebook

**Rationale:** Google Business Profile is the primary local-SEO engine; rating and review count there matter most. Facebook reviews are secondary but build brand social proof and help with ad retargeting (if Ad Manager activates later). 70/30 weights toward Google's ranking benefit without ignoring Facebook.

1. Reputation → Settings → Review Link → **Enable Balancing**.
2. Configure platforms:
   - Google: **70%**
   - Facebook: **30%**
3. Save.

### 5.2 Rebalance trigger

After Caramel Oven reaches **50 Google reviews**, shift to **50/50** or even **30/70** favoring Facebook — diversifying the reputation footprint once the Google base is established. Flag for Section 21 operator playbook as a month-6 review item.

---

## Step 6 — Build the Review Widget

**Where:** Reputation → Review Widget → **+ New Widget**. [UI-VERIFY]

The Review Widget displays recent Google + Facebook reviews on the website for social proof.

### 6.1 Widget configuration

1. + New Widget → Name: "Caramel Oven Homepage Reviews."
2. Layout: **Carousel** (scrolls through recent reviews) OR **Grid** (shows 4-6 at once). Choose based on Section 17 page real estate.
3. Filter: show only 4-5 star reviews (configurable; Caramel Oven starts at 4+ stars).
4. Include: review text, reviewer name (first name + last initial), star rating, platform icon (Google / Facebook).
5. Styling: pull Brand Board colors (Section 5 v1).
6. Save.

### 6.2 Embed code

HighLevel generates an embed snippet (JS block). This gets embedded in the Section 17 website on the Homepage and Reviews page.

Record the embed code in the Intake Document for Section 17 reference.

---

## Step 7 — Update Custom Values (resolve Section 2 placeholder)

1. Settings → Custom Values → `custom_values.review_link`.
2. Replace placeholder with the GBP review URL. Standard format:
   ```
   https://g.page/r/<GBP-UNIQUE-ID>/review
   ```
   Retrieve the exact URL from Google Business Profile dashboard → Manage Reviews → Share Review Link. [UI-VERIFY actual GBP flow]
3. Save.

Every workflow and template referencing `{{custom_values.review_link}}` across Sections 12 (Workflow #3 Review Request) and 8 (Feedback Survey NPS 9-10 routing) and 13 (various) now resolves to the real Google review URL.

---

## Step 8 — Test the review request flow

1. Manually create a test Contact with source `source:farmers-market` and `segment:b2c-regular`.
2. Apply tag `interest:review-eligible` (this is what Workflow #3 will trigger on in Section 12; for this test we bypass the workflow by firing the Send Review Request action manually).
3. Sidebar → Reputation → **Send Review Request** quick-action. Select SMS + Email. Send.
4. Verify:
   - Email lands in the test contact's inbox.
   - SMS lands (if A2P approved by now).
   - `custom_values.review_link` renders as a real Google review URL (not a literal placeholder).
5. Click the link in the received email. Verify it opens Google review submission form for Caramel Oven's GBP.
6. Delete the test contact.

---

## Step 9 — Post-verification activation

**Checklist to run once GBP shows Verified (postcard arrives, code entered):**

1. ✅ GBP status = Verified at `business.google.com`.
2. ✅ HighLevel Reputation → Reviews populates existing reviews (if any).
3. ✅ `custom_values.review_link` tested and resolves correctly.
4. ✅ Reviews AI responds to a test review (ask a friend with a Google account to leave a 5-star review; verify Auto-Pilot responds within 30 minutes).
5. ✅ Review Request Balancing configured.
6. ✅ Review Widget embed code saved for Section 17.

---

## Completion criteria

1. ✅ GBP claimed (Step 1).
2. ✅ GBP verified (postcard received + code entered — 5-14 days after Step 1).
3. ✅ GBP integrated with HighLevel sub-account.
4. ✅ Reviews AI configured (Auto-Pilot 4-5⭐ · Suggestive ≤3⭐ · Negative Feedback escalation for 1⭐).
5. ✅ Review Request Email + SMS templates drafted in Brand Voice.
6. ✅ Review Request Balancing configured (70 Google / 30 Facebook default).
7. ✅ Review Widget built for Section 17 embedding.
8. ✅ `custom_values.review_link` populated with real GBP review URL.
9. ✅ Step 8 smoke test passed.
10. ✅ Section 21 operator playbook updated with ≤3⭐ Suggestive approval workflow.

**Note on completion timing:** Section 11 is partial-complete at Step 8. Step 9 activation requires GBP postcard verification. If verification lags, proceed to Sections 12-14 without waiting — most workflow infrastructure builds against Custom Values and can finalize when GBP verifies.

---

## What happens next

**Section 12 — Workflows: Appointment + Purchase** fires next. Workflows #3 (Review Request) and #4 (Negative Feedback Handler) reference this section's review infrastructure directly.

---

## Flags for this section

- **Assumptions made:** (a) Reviews AI Auto-Pilot on 4-5 star reviews is low-risk; the AI generates clean thank-you responses; (b) Suggestive mode on 1-3 star reviews is mandatory — AI responses to negative reviews are the single highest-risk Reviews AI scenario per research findings; (c) 70/30 Google/Facebook balance favors SEO during early review buildup — rebalance at 50-review milestone; (d) `{{custom_values.review_link}}` uses the canonical `g.page/r/...` short URL format.
- **Gaps identified:** (a) UI-VERIFY flags on Google Integrations path, Reviews AI Configuration location, Review Link balancing UX, Review Widget builder, GBP Share Review Link flow within Google's UI; (b) GBP verification method (postcard vs phone vs video) depends on Google's internal rules — not something we can predict.
- **Competing approaches:** (a) Auto-Pilot on all ratings (fully automated) vs Suggestive on ≤3 star (human approval) — chose mixed per research evidence that AI responses to negative reviews carry real reputation risk; (b) 50/50 vs 70/30 Google/Facebook balance — chose 70/30 for early-phase SEO momentum; (c) Show all reviews vs 4+ only on Review Widget — chose 4+ only for initial launch; can expand filter later.
- **Client-side blockers resolved:** Q4 (GBP not claimed → Step 1 is the claim).
- **Client-side blockers remaining:** 5-14 day postcard verification — Stacy/Josh responsibility to submit code when postcard arrives. Adds unavoidable dependency to Section 12 full-activation.
- **Platform-level irreversible decisions:** None. Reviews AI can be disabled; GBP integration can be disconnected; balancing can be changed.

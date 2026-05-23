# Section 19 — Social Planner Scheduling

**Last Updated:** 2026-04-19
*If HighLevel UI doesn't match these instructions, consult the Update Protocol (Phase 5.2). This guide targets the HighLevel platform as of 2026-04-19.*

---

## Purpose

Connect Caramel Oven's three active social accounts (Facebook, Instagram, TikTok — confirmed from site extraction 2026-04-19) to HighLevel's Social Planner. Configure Brand Board-styled posting. Build a reusable content schedule scaffold that Stacy or Josh can activate post-launch using Content AI (Section 18) for drafts. Per Dan's Q7 directive: **build infrastructure; defer active posting cadence decisions to post-launch** — Stacy and Josh decide cadence after go-live.

**Estimated time:** 45-60 minutes for infrastructure + scaffolding. Actual post-drafting + queueing happens on an ongoing basis by Stacy/Josh/VA.

**Dependencies:**
- Sections 5 (Brand Board), 18 (Content AI) complete.
- **Q7 resolved via site extraction 2026-04-19:** 3 active social platforms confirmed — Facebook (page ID 61580049856247) · Instagram (@caramelovenokc) · TikTok (@caramel.oven.okc).

---

## Why this section matters

Social discovery drives farmers-market foot traffic. Instagram in particular is where OKC customers discover what Caramel Oven is bringing to Saturday's market — a beautiful photo of a caramel-dipped cookie on Saturday morning drives Saturday afternoon market visits.

Three operational principles:

1. **Connect the accounts once; post from one place forever.** Social Planner consolidates FB · IG · TikTok posting into one interface. No more opening three apps to post the same photo.
2. **Content AI drafts; human edits; Social Planner schedules.** Per Section 18, the workflow is: generate with Content AI → edit for voice → schedule via Social Planner. End-to-end for a week's worth of posts in 15-20 minutes.
3. **Cadence is a post-launch decision, NOT a launch requirement.** Stacy and Josh may start with 2 posts/week and scale up OR start with 5/week and scale down. Section 19 builds the pipeline; the tap rate is operator-controlled.

---

## What you will produce

1. **3 connected platforms:** Facebook Page · Instagram Business · TikTok.
2. **Social Planner settings** configured with Brand Board styling.
3. **Watermark applied** for visual consistency.
4. **Content schedule scaffolding:** recurring-post template slots for weekly cadence (operator activates when ready).
5. **7 post-type templates** saved to Social Planner Template Library, ready for Content AI-assisted drafting.
6. **2-week starter queue** — 6-10 sample posts drafted via Content AI, scheduled or saved as drafts for Stacy/Josh review.
7. **Post-launch operator playbook** for weekly social scheduling workflow.

---

## Step 1 — Connect Facebook Page

**Where:** Marketing → Social Planner → **+ Connect Account** → Facebook. [UI-VERIFY]

### 1.1 Prerequisites

- Stacy or Josh has **admin-level access** to the Caramel Oven Facebook Page (not editor or contributor — admin. Per Q7 requirement).
- They're logged into the correct Facebook account on the browser being used.

### 1.2 Connect flow

1. Click **+ Connect Account** → select **Facebook**.
2. Browser redirects to Facebook. Grant HighLevel's permissions (read + post to Page).
3. Select **Caramel Oven Bakehouse Page** (page ID 61580049856247 per site extraction).
4. Grant post permissions.
5. Redirects back; shows "Connected" next to the Caramel Oven FB Page in Social Planner.

### 1.3 Token expiration awareness

Facebook tokens expire periodically (~60 days typical). When they expire, Social Planner posts fail silently. Add to Section 21 operator playbook: **monthly check** that FB token still shows as Connected. Re-authorize if expired.

---

## Step 2 — Connect Instagram Business

**Where:** Marketing → Social Planner → + Connect Account → Instagram. [UI-VERIFY]

### 2.1 Prerequisite: Instagram must be a Business account linked to a Facebook Page

Check: is @caramelovenokc a **Business** or **Creator** account (not a personal account)? Only Business/Creator supports API posting via third-party tools.

If still personal: Stacy or Josh converts the account via Instagram app → Settings → Account → Switch to Business Account → link to Caramel Oven Facebook Page.

### 2.2 Connect flow

1. Click + Connect Account → Instagram.
2. Two options:
   - **Facebook-linked Instagram** (recommended, more stable).
   - **Direct Instagram Integration** (newer, supported).
3. Recommend Facebook-linked: HighLevel uses the existing Facebook Page → Instagram link.
4. Grant permissions.
5. Verify @caramelovenokc appears as Connected.

### 2.3 Post types supported

Instagram posting supports: Feed Post · Reel · Story. Carousel support varies. [UI-VERIFY carousel support on current UI.]

---

## Step 3 — Connect TikTok

**Where:** Marketing → Social Planner → + Connect Account → TikTok. [UI-VERIFY]

### 3.1 Connect flow

1. Click + Connect Account → TikTok.
2. Browser redirects to TikTok. Log in with @caramel.oven.okc account.
3. Grant HighLevel permissions.
4. Redirects back; shows Connected.

### 3.2 Post types supported

TikTok via Social Planner typically supports: Video posts (primary). Images as slideshow. Live streams NOT supported via third-party.

---

## Step 4 — Configure Social Planner settings

**Where:** Marketing → Social Planner → Settings. [UI-VERIFY]

### 4.1 Default styling

- Pull Brand Board v1 colors for any Social Planner text-over-image generation.
- Default fonts match Brand Board (Inter for body, Playfair Display for display text).

### 4.2 Watermark

Enable watermark on all image posts. Watermark specs:
- Caramel Oven logo (from Brand Board v1).
- Position: bottom-right corner.
- Opacity: 60%.
- Size: 15% of image width.

Per-post override available if a specific post needs clean (no-watermark) image.

### 4.3 Default hashtag groups

Create 3 hashtag groups for one-click application:

**Group 1 — OKC local:**
`#okcbakery #oklahomacity #okc #okcfood #okceats #oklahomaeats #supportlocal #okcsmallbusiness`

**Group 2 — Products:**
`#caramels #cookies #bakedgoods #smallbatchbaking #fromscratch #handmade`

**Group 3 — Brand/values:**
`#motherson #familybusiness #missionamericaveteran #veteran-support #okcstrong`

Stacy/Josh can add/edit these groups post-launch.

### 4.4 Location tagging

Enable Location Tagging. Default location: Caramel Oven's OKC address. Specific farmers-market posts can override with the market's location.

---

## Step 5 — Build 7 post-type templates

**Where:** Marketing → Template Library → Social Planner templates. [UI-VERIFY]

These templates feed Content AI (Section 18) as starting patterns. Each has a structure + tone + hashtag preset.

### Template 1 — Market-Day Announcement

- **Trigger cadence:** every Friday (for Saturday market) + every Saturday (for Sunday market).
- **Post structure:**
  > "Caramel Oven will be at [market name] this [day] from [time] — come see us!
  >
  > Bringing: [2-3 items with a sensory descriptor]
  >
  > [Address/booth location detail]
  >
  > [Hashtag group: OKC local]"
- **Image:** product photo or booth photo.

### Template 2 — New Product Drop

- **Cadence:** ad-hoc when a new bake launches.
- **Structure:**
  > "New at Caramel Oven: [product name]
  >
  > [2-3 sentence product description with a sensory + origin note]
  >
  > Available [where: market / order online]
  >
  > [Hashtag: Products + OKC]"

### Template 3 — Behind-the-Scenes

- **Cadence:** 1-2/week.
- **Structure:** a moment from the bakery. 4am dough prep. A mistake that turned into a new recipe. A photo of the ingredients. Short + specific + timestamped.

### Template 4 — Seasonal Campaign

- **Cadence:** 2-3 weeks before each major holiday (Mother's Day · Valentine's · Christmas · Thanksgiving).
- **Structure:** ties to Gift Cards (Section 16) + seasonal product.
  > "[Holiday] is coming. Give [recipient] something made fresh.
  >
  > [Product or gift card CTA]
  >
  > Order by [deadline]: [link]"

### Template 5 — Customer Feature / Testimonial

- **Cadence:** when a customer shares (with permission).
- **Structure:** customer photo or quote + thank-you + one-line about the occasion.

### Template 6 — Recipe / Educational

- **Cadence:** 1-2/month.
- **Structure:** short informational post (tie to blog recipe posts from Section 17 Step 9.2 — repost blog highlights).

### Template 7 — Mission America Veteran / Values

- **Cadence:** 1-2/month.
- **Structure:** values-driven post about the partnership. Low frequency so it stays meaningful.

Save each template with a clear name in the Template Library. Applicable templates tag with categories: Market · Product · Behind-the-Scenes · Seasonal · Customer · Education · Values.

---

## Step 6 — Queue first 2-week starter batch

**Where:** Marketing → Social Planner → + New Post. [UI-VERIFY]

### 6.1 Use Content AI for drafting

For each of the 6-10 starter posts, follow Section 18 Step 2 pattern:

1. + New Post → Content AI → pick platform (FB, IG, or TikTok) + content type → Brand Voice enabled → main message + CTA → Generate → review → copy → schedule.

### 6.2 Suggested starter post calendar (2 weeks)

| Week | Day | Template type | Platform | Content theme |
|---|---|---|---|---|
| 1 | Fri | Market-Day Announcement | FB + IG | Saturday Riverside Market — caramels, cookies, [seasonal item] |
| 1 | Sat | Behind-the-Scenes | IG + TikTok | 4am dough prep video or photo |
| 1 | Mon | Behind-the-Scenes | IG | Packaging the week's wholesale orders |
| 1 | Tue | Recipe / Educational | FB + IG | Repost of "The Science of a Perfect Sourdough Crust" blog snippet (from Section 17 Step 9.2) |
| 1 | Thu | New Product Drop | All 3 platforms | This week's specialty bake |
| 2 | Fri | Market-Day Announcement | FB + IG | Saturday Downtown Market — same format |
| 2 | Sat | Customer Feature | IG | A customer-shared wedding cake photo (with permission) |
| 2 | Sun | Values | FB + IG | Mission America Veteran partnership note |
| 2 | Tue | Behind-the-Scenes | TikTok | Short video of caramel pour |
| 2 | Thu | New Product Drop | All 3 | New seasonal product |

Drafts go into Social Planner as **scheduled** (if posting live) OR **saved as draft** (if Stacy/Josh want to review before activation).

### 6.3 Activation decision deferred

Per Dan's Q7 directive: the 2-week calendar is **scaffolding**, not a commitment. Stacy and Josh decide whether to:
- Activate all drafts as scheduled (full-speed start).
- Activate some (e.g., Market-Day posts only, skip Behind-the-Scenes).
- Pause all (post-launch-only activation).

Default recommendation: **schedule Week 1 only**, evaluate after 7 days, iterate on Week 2.

---

## Step 7 — Configure recurring post patterns

**Where:** Marketing → Social Planner → Recurring Posts. [UI-VERIFY — per research article 155000000648]

Set up recurring templates that fire weekly without manual re-creation:

- **Every Friday 10am CT:** Market-Day Announcement (template populated; customize per-week via Content AI).
- **Every Tuesday 4pm CT:** Behind-the-Scenes (template populated; operator fills in the specific moment).

Recurring posts require operator confirmation before publish (not full auto — Stacy/Josh approve each week's content). Prevents "my recurring post accidentally said something off-brand" scenarios.

---

## Step 8 — Connect GBP Post Scheduler (bonus)

Google Business Profile supports weekly posts that appear in Search + Maps. Connect GBP to Social Planner if supported (per Section 11 integration).

**Where:** Social Planner → Connect Account → Google Business Profile. [UI-VERIFY]

Post GBP updates 1x/week: farmers market location reminder, new product announcement, holiday hours change.

---

## Step 9 — Monitoring + analytics

**Where:** Marketing → Social Planner → Analytics. [UI-VERIFY]

Track per-platform:
- Post performance (likes, comments, shares, reach).
- Best-performing post types.
- Audience growth.

Flag in Section 21 operator playbook: **monthly social review** — pull analytics, identify top 3 best-performing post types, double down.

---

## Step 10 — Post-launch social workflow for operator

Document in the operator playbook:

### Weekly content workflow (Stacy/Josh or VA — 15-30 minutes/week)

1. **Sunday evening:** review the week's upcoming recurring-post slots + any ad-hoc opportunities.
2. **Monday morning:** use Content AI (Section 18 patterns) to draft 3-5 posts for the week. Edit for voice. Add images from the weekend's baking.
3. **Tuesday:** schedule all posts for the week via Social Planner.
4. **Daily:** monitor comments + DMs via Conversations inbox (not the social app directly — Section 8 Chat Widget + inbox routing).

### Monthly review (30-60 minutes)

1. Social Planner analytics → identify top 3 posts (reach, engagement).
2. Identify underperformers to stop doing.
3. Adjust hashtag groups if platform algorithm shifts.
4. Verify tokens still connected (especially Facebook — 60-day expiry).

---

## Completion criteria

1. ✅ 3 social accounts connected (FB · IG · TikTok).
2. ✅ Social Planner settings configured (Watermark · Brand Board styling · Hashtag groups · Location).
3. ✅ 7 post-type templates saved to Template Library.
4. ✅ 2-week starter batch drafted (6-10 posts) via Content AI.
5. ✅ Recurring post patterns configured (Friday Market-Day · Tuesday BTS).
6. ✅ GBP post scheduling connected (if supported by current HighLevel version).
7. ✅ Analytics access confirmed.
8. ✅ Post-launch operator workflow documented in Section 21 playbook.

---

## What happens next

**Section 20 — Dashboards** is the next write. Owner-facing daily dashboard surfaces everything built in Sections 2-19 as widgets.

---

## Flags for this section

- **Assumptions made:** (a) Instagram is Business account — verify pre-connect or convert; (b) Facebook Page ID 61580049856247 is correct (from site extraction); (c) TikTok API supports HighLevel's Social Planner — stable as of 2026-04-19 per research; (d) Recurring-post manual-approval pattern prevents off-brand auto-posts; (e) Cadence-deferral is the right call per Q7 directive — stacking Week 1 only is a conservative start.
- **Gaps identified:** UI-VERIFY flags on Connect Account flow per platform, Carousel support on IG, GBP Post Scheduler connection path, Analytics location, Recurring Posts configuration.
- **Competing approaches:** (a) Immediate full-cadence activation vs Week-1-only scaffolding — chose Week-1 to preserve Stacy/Josh's cadence decision authority; (b) HighLevel Content AI vs external tools (Later, Buffer) for post drafting — chose HighLevel Content AI for unified workflow.
- **Client-side blockers:** Facebook/Instagram admin access confirmation needed at connect time — flag for Stacy/Josh.
- **Platform-level irreversible decisions:** None.

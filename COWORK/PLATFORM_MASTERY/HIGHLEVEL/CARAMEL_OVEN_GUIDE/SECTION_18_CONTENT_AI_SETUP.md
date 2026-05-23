# Section 18 — Content AI Setup

**Last Updated:** 2026-04-17
*If HighLevel UI doesn't match these instructions, consult the Update Protocol (Phase 5.2). This guide targets the HighLevel platform as of 2026-04-17.*

---

## Purpose

Validate that Brand Voice from Section 5 feeds Content AI correctly. Test Content AI generation in the three surfaces Caramel Oven will use: Social Planner (social post drafting), Email Builder (campaign and transactional copy drafting), and Blogs (recipe content SEO). Document prompt patterns that produce on-brand output for the operator. Set pricing expectations so nobody is surprised by AI-credit consumption.

**Estimated time:** 45-60 minutes.

**Dependencies:**
- Section 5 complete (Brand Board + Brand Voice exist — real or placeholder).
- Sub-account has Content AI enabled (agency-level toggle; usually default-on for active sub-accounts).

---

## Why this section matters

Content AI is a force multiplier for the solo-operator pre-VA era. Drafting a week's worth of social posts manually takes 2-3 hours; Content AI reduces it to 15-20 minutes of prompt-and-edit work. Drafting a monthly newsletter takes an hour manually; Content AI reduces it to 20 minutes. That's 5-8 hours/month back for Stacy or Josh (or eventually the VA).

But Content AI with a wrong Brand Voice produces generic "excited about our new offerings!" copy. With a well-configured Brand Voice (Section 5), it produces "fresh-baked at 4am this morning, still warm at 8am at the market" copy. The difference compounds across every campaign.

**Non-obvious principle:** Content AI is only as good as its inputs. A 3-line description of the product + 2-line description of the desired outcome produces a better draft than a 1-line prompt. This section documents the prompt patterns that work.

---

## What you will produce

1. **Content AI verified active** on the sub-account.
2. **Brand Voice confirmed flowing** into Content AI generation flows.
3. **3 tested Social Planner drafts** (one per platform: FB, IG, LinkedIn) — validated as on-brand.
4. **2 tested Email Builder drafts** (one promotional, one newsletter) — validated as on-brand.
5. **1 tested Blog outline draft** (recipe post) — validated as on-brand.
6. **Operator prompt-pattern guide** — documented patterns that produce quality output.
7. **Pricing expectations documented** — $0.09 per 1,000 words for email; 500-word free tier per sub-account.

---

## Step 1 — Verify Brand Voice is active

**Where:** Marketing → Brand Boards → Brand Voice.

### 1.1 Confirm the Brand Voice exists

1. Open **Marketing → Brand Boards**.
2. Locate the Caramel Oven Brand Voice (named "Caramel Oven - Owner Voice" or similar per Section 5 Step 5.2).
3. Confirm status shows "Active" or equivalent. [UI-VERIFY]

### 1.2 Set as default (if not already)

1. Three-dot menu → **Set as Default**.
2. Confirm default indicator appears next to the Brand Voice.

If this is the placeholder Brand Voice from Section 5 (pre-Q9), the "[PLACEHOLDER]" prefix should still be in the name. Content AI still uses it — just note that Q9 will overwrite it.

### 1.3 Verify Brand Voice parameters

Open the Brand Voice detail page. Confirm populated fields:
- **Tone** (e.g., "Warm, unpretentious")
- **Values** (baking craft, local sourcing, relationship-driven)
- **Mission statement** (if generated)
- **CTAs** (sample call-to-action phrasings in the voice)

If any field is blank, click **Edit** and add content. Blank fields produce weaker AI output.

---

## Step 2 — Test Content AI in Social Planner

**Where:** Marketing → Social Planner → + New Post → Content AI.

### 2.1 First test: Instagram post

1. Click **+ New Post** → select **Content AI** from the dropdown.
2. Platform: **Instagram**. Content type: **Post**.
3. Brand Voice fields auto-fill. Confirm the "Use Brand Voice" toggle is ON.
4. Fill the prompt fields:
   - **Main message:** "Promoting this Saturday's farmers market appearance — Caramel Oven will have fresh sourdough loaves, chocolate-hazelnut babka, and gluten-free almond shortbread."
   - **Call to action:** "Visit us at booth 42 at the Riverside Farmers Market, Saturday 8am-1pm."
   - **Tone override (optional):** leave blank to use Brand Voice default.
5. Click **Generate**. Review the output.
6. Evaluate: does it sound like Caramel Oven (per Section 5 Brand Voice description)? Or does it read generic?
7. If generic: edit the Brand Voice (Step 1.3) to strengthen constraints and regenerate.
8. Copy the best variation. Schedule a test post (do NOT publish yet — just schedule for 2 hours out, then unschedule after the test).

### 2.2 Second test: Facebook post

Same flow, platform: **Facebook**. Same content prompt. Generate. The output should be tailored to FB (slightly different length/tone than IG). Review for on-brand-ness.

### 2.3 Third test: LinkedIn post

Platform: **LinkedIn**. Content type: **Post**. Same content prompt.

LinkedIn output should lean more toward "professional context" — the Brand Voice's warmth should still come through but the language shifts slightly toward B2B (e.g., "growing our wholesale partnerships" might surface). Review accordingly.

### 2.4 Document observations

Record in the operator playbook: which platform produced the best on-brand output on first pass, where Brand Voice shone through vs. where it drifted. Helpful for future sessions.

---

## Step 3 — Test Content AI in Email Builder

**Where:** Marketing → Emails → Email Campaigns → + New Campaign → Email Builder → Text Block → Content AI button.

### 3.1 First test: promotional email

1. Create a new Email Campaign (or edit existing). Name: "Content AI Test - Promo."
2. In the Email Builder, add a Text Block.
3. Click the **Content AI** button above the text editor.
4. Fill the prompt fields:
   - **Select Context:** Coupon/Discount.
   - **Content Title:** "Mother's Day Preorder — 15% off through May 8."
   - **Content Description:** "Promote early-bird pricing on Mother's Day preorders. Emphasize the handmade touch — these are made fresh, from scratch, by Stacy or Josh. Close with a clear CTA to order by May 8 to lock in the discount."
   - **Writing Tone:** leave as Brand Voice default.
   - **Number of Variations:** 3.
5. Click **Generate**. Wait 5-10 seconds.
6. Review the three variations. Pick the best.
7. Click **Copy** → the selected variation inserts into the Text Block.
8. Manual edit: tweak anything that still sounds off-brand. Typical edits: remove stray "delight," tighten exclamation marks, verify "Stacy" or "Josh" signoff is accurate.
9. Save the email as a draft.

### 3.2 Second test: newsletter email

Same flow. Context: **Recurring Newsletter**. Title: "The Oven Report — April 2026." Description: "Monthly recipe + market schedule + behind-the-scenes. Feature this month's top-selling loaf (country sourdough) and tease the upcoming seasonal bake (rhubarb-almond tart for spring)."

Generate. Review. Iterate.

### 3.3 Subject-line Content AI

In the send/schedule screen (before clicking final Send), Content AI is also available for subject-line generation. Click the wand icon next to the Subject Line field. Generate 3-5 variations. Pick the most click-worthy.

### 3.4 Cost awareness

**Email Content AI pricing:** $0.09 per 1,000 words. First 500 words/sub-account per month are complimentary.

Realistic Caramel Oven usage:
- 10 promotional emails/month × ~300 words each = 3,000 words = $0.27
- 4 newsletter emails/month × ~600 words each = 2,400 words = $0.22
- Subject line generation (~50 words/generation × 20 generations/month) = 1,000 words = $0.09
- **Rough total: $0.50-$1.00/month** for email Content AI usage.

Not a cost concern for a solo operator. Document in the operator playbook so nobody is surprised.

---

## Step 4 — Test Content AI in Blogs

**Where:** Sites → Blogs → + Create New Post → Content AI in the blog editor. [UI-VERIFY exact path]

> Note: blog Content AI requires sub-account permissions for Content AI — usually default-on for active sub-accounts, but check Agency Settings → Labs or Sub-Account Settings if the button doesn't appear.

### 4.1 Generate a blog outline

1. Create a new blog post. Title: "The Science of a Perfect Sourdough Crust."
2. In the blog editor, find the Content AI button.
3. Fill the prompt fields:
   - **Post title:** auto-filled from the blog post title.
   - **Brief description:** "A 600-800 word post explaining what makes a crackly, well-browned sourdough crust — bake temperature, hydration, Maillard reaction basics, steam in the oven. Written for home bakers who've baked sourdough a few times and want to level up the crust game."
   - **Keywords:** "sourdough crust," "perfect crust," "bread baking temperature," "crust crackling."
   - **Writing tone:** Brand Voice default (if Brand Voice isn't listed as an option in this surface, pick "Casual" from the predefined list — per research, blog Content AI may not read Brand Voice directly).
   - **Number of variations:** 3.
   - **Output type:** **Outline**.
4. Generate.
5. Review the 3 outlines. Pick the best. Copy into the blog post editor.

### 4.2 Generate an introduction

With outline selected:
- Change **Output type** to **Introduction**.
- Generate. Copy the intro paragraph into the blog draft.

### 4.3 Generate section content

For each outline bullet, change **Output type** to **Specific Section** and generate. Iterate section by section.

### 4.4 Edit pass

Generated blog content is a first draft. Edit for:
- Voice consistency (Brand Voice may not read into blog Content AI directly — per research; apply manually if so).
- Factual accuracy (AI may assert specific bake times/temperatures that don't match Caramel Oven's practice).
- SEO — verify keywords appear naturally, meta description written separately.

### 4.5 Save as draft

Do NOT publish the test blog post. Save as draft, name "TEST - Content AI Blog Draft," delete after testing is verified working.

---

## Step 5 — Document prompt patterns for the operator

Content AI quality correlates with prompt quality. Record these patterns in the operator playbook for future sessions:

### 5.1 Pattern: Social Post — Event Announcement

```
Main message: [What's happening, when, where, what's new]
CTA: [Single specific action: visit booth 42, preorder by Friday, DM for custom order]
Include: timing, location, one sensory detail (smell, texture, color)
Avoid: generic excitement language, excessive emoji
```

### 5.2 Pattern: Social Post — Behind-the-Scenes

```
Main message: [One specific moment from the bakery: 4am start, ingredient prep, flour dust, a mistake that became a recipe]
CTA: [Soft: follow for more, see you at the market]
Include: one sensory detail, timestamp ("this morning at 4am" vs "we bake daily")
Avoid: stock-photo-caption phrases
```

### 5.3 Pattern: Email — Promotional

```
Context: Coupon/Discount (in Content AI dropdown)
Title: [Offer + deadline]
Description: [Product specifics, craft/handmade emphasis, deadline urgency, Stacy-or-Josh signoff intent]
Tone: Brand Voice default
Variations: 3 (pick best; often variation 2 is the winner)
Manual edit pass: remove "delight," standardize signoff, trim exclamation marks
```

### 5.4 Pattern: Email — Newsletter

```
Context: Recurring Newsletter
Title: [Month/theme + hook]
Description: [This month's focus + one recipe/product mention + one market schedule mention + one behind-the-scenes beat]
Variations: 3
Manual edit pass: ensure the three beats are distinct, not merged into a single blob
```

### 5.5 Pattern: Blog — Recipe Post

```
Output type: Outline first, then Introduction, then Specific Section per bullet
Title: [Specific recipe or technique, not a general topic]
Description: [Target audience level, word count, core insight you're teaching]
Keywords: 3-5 phrases
Tone: Casual (Brand Voice may not read; apply manually in edit)
Edit pass: strong — blog Content AI produces generic prose without Brand Voice; 40-50% rewrite typical
```

### 5.6 Save the prompt-pattern guide

Document in a shared file (title: "Caramel Oven - Content AI Prompt Patterns") in the Asset Inventory folder. Update as the operator discovers patterns that work or fail.

---

## Step 6 — Update Content AI Custom Value

In Settings → Custom Values, update `custom_values.content_ai_guidelines` (if present from Section 2, or create now):

Value: `"Prompt patterns: Event announcement / Behind-the-scenes / Promotional email / Newsletter / Recipe blog. Refer to 'Caramel Oven - Content AI Prompt Patterns' in Asset Inventory for templates. Avoid: 'delight,' 'curated.' Signoff: Stacy or Josh. Tone: warm, unpretentious, handmade."`

This Custom Value isn't used in customer-facing templates — it's a prompt-reference for the operator, accessible from any Custom Values dropdown. Alternative: put this content in an Internal Note on a specific "Operator Reference" contact record.

---

## Step 7 — Verify and document

### 7.1 Delete test artifacts

- Unschedule test social posts.
- Delete test email drafts.
- Delete test blog draft.

### 7.2 Record in Intake Document

```
SECTION 18 STATUS
Content AI verified active: YES
Brand Voice wired to Content AI: YES (placeholder / final pending Q9)
Social Planner test: 3 platforms tested (IG/FB/LinkedIn), drafts on-brand after Brand Voice applied
Email Builder test: Promo + Newsletter contexts tested, 3 variations each
Blog Content AI test: Outline → Intro → Section flow tested
Operator prompt-pattern guide: saved to Asset Inventory as "Caramel Oven - Content AI Prompt Patterns"
Pricing expectation: $0.50-$1.00/mo for realistic Caramel Oven email usage
Section 18 status: COMPLETE (PROVISIONAL if Brand Voice is still placeholder pending Q9)
```

---

## Completion criteria

1. ✅ Content AI confirmed active.
2. ✅ Brand Voice confirmed flowing into Content AI (auto-fill toggle ON, fields populated).
3. ✅ Social Planner Content AI tested across 3 platforms with on-brand output.
4. ✅ Email Builder Content AI tested (promotional + newsletter contexts).
5. ✅ Blog Content AI tested (outline + intro + section flow).
6. ✅ Operator prompt-pattern guide written and saved.
7. ✅ Pricing expectations documented.
8. ✅ Test artifacts deleted.
9. ✅ Intake Document updated.

If Brand Voice is placeholder pending Q9, Section 18 ships PROVISIONAL — retest Social/Email/Blog output when real Brand Voice arrives.

---

## What happens next

**Section 19 — Social Planner Scheduling** consumes Content AI outputs directly. The recurring-post schedule built in Section 19 uses Content AI to draft a week's worth of posts in one sitting.

**Section 17 — Website + Funnel + Blog** uses Content AI for funnel page copy and blog recipe posts.

**Section 12 — Workflows: Appointment & Purchase** uses Content AI indirectly — email templates drafted with Content AI assistance, then locked as templates.

---

## Flags for this section

- **Assumptions made:** (a) Content AI is enabled at the agency level — usually default-on, but Agency Settings → Labs toggle may need activation; (b) Brand Voice reads into Content AI in Social Planner + Email Builder + Funnels; per research, Blog Content AI surface may NOT read Brand Voice and defaults to predefined tones — manual tone/voice pass in edit; (c) pricing estimate ($0.50-$1.00/mo) assumes realistic bakery volume — scales linearly with usage; (d) placeholder Brand Voice is acceptable for this section — retest quality on Q9 return.
- **Gaps identified:** UI-VERIFY flags on Brand Voice status indicator, Content AI button locations in Email Builder + Blog editor, sub-account-level Content AI permission setting location; research-gap on whether Blog Content AI reads Brand Voice (may not).
- **Competing approaches:** (a) Per-campaign Content AI use vs. Section-5-level Brand Voice with defaults — chose defaults-heavy approach because it's more maintainable; (b) Building a custom Content AI prompt library in a separate doc vs. scattered notes — chose centralized doc ("Caramel Oven - Content AI Prompt Patterns") because VA handoff benefits from consolidation.
- **Client-side blockers:** Q9 finalizes Brand Voice quality → Section 18 retests output post-Q9.
- **Platform-level irreversible decisions:** None. Content AI generation history is stored; Brand Voice can be edited freely; prompts iterate cheaply.

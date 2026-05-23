# Section 5 — Custom Fields · Tags · Brand Board · Brand Voice

**Last Updated:** 2026-04-19
*If HighLevel UI doesn't match these instructions, consult the Update Protocol (Phase 5.2). This guide targets the HighLevel platform as of 2026-04-17.*

---

## Purpose

Extend the data model beyond HighLevel's native fields so Caramel Oven can track what matters (dietary preferences, event dates, wholesale account type, etc.). Establish a tag taxonomy that powers Smart Lists, Workflow enrollment, and reporting. Create the Brand Board (logos, colors, fonts) that email, funnel, form, survey, and quiz builders read from. Create the Brand Voice that Content AI reads from.

**Estimated time:** 60-90 minutes once Q9 (brand assets) arrives. Most of the work can run with placeholder assets; Brand Board and Brand Voice get rebuilt when Q9 returns.

**Dependencies:**
- Section 2 complete.
- **Q9 RESOLVED 2026-04-19:** Brand assets extracted from live caramelovenokc.com site. Brand Board installed as "Caramel Oven v1" (first-pass); Brand Voice installed as "Caramel Oven - Owner Voice" via URL-extraction method. Refine when Stacy/Josh provide formal brand guidelines.

---

## Why this section matters

Everything downstream reads from what gets configured here:

- **Custom Fields** let templates personalize beyond name/email — "Happy Mother's Day, Sarah! We remember you love the gluten-free lemon shortbread" requires a `dietary_preferences` custom field. Without it, personalization stalls at name-substitution.
- **Tags** are the segmentation primitive. Smart Lists filter on them; Workflows enroll by them; bulk actions target them. A sloppy tag taxonomy means Smart Lists return wrong contacts and Workflows fire on the wrong audience.
- **Brand Board** is the single source of truth for visual identity. Every email, funnel, form, survey, and quiz reads logo + colors + fonts from here. **Retroactive color changes do NOT update existing designs** — lock brand colors before building templates or face rebuild cost.
- **Brand Voice** feeds Content AI. Auto-generated social posts, email drafts, funnel copy all inherit tone/vocabulary/style from Brand Voice. Skipping it means Content AI produces generic "excited about our new offerings!" drafts instead of "fresh-baked at 4am this morning, still warm at the 8am market" ones.

---

## What you will produce

1. **Contact Custom Fields** — 8-10 fields extending the default contact record.
2. **Opportunity Custom Fields** — 6-8 fields for wholesale and catering pipelines (referenced in Section 10).
3. **Tag Taxonomy** — baseline set of ~20 tags across source, status, behavior, and segment categories.
4. **Brand Board** — logos, colors, fonts (uses Q9 assets or placeholders).
5. **Brand Voice** — created from Q9 description/URL or placeholder text.
6. **Folder structure** — tags and custom fields organized for readability.

---

## Step 1 — Create Contact Custom Fields

**Where:** Settings → Custom Fields → Contacts tab (or equivalent). [UI-VERIFY exact label]

Contact Custom Fields extend the default Contact record with business-specific data. Each field has a type (text, number, date, dropdown, multi-select, checkbox, file), a name, and a folder.

### Recommended baseline for Caramel Oven

| Field Name | Type | Options (if dropdown/multi-select) | Folder | Why |
|---|---|---|---|---|
| Dietary Preferences | Multi-select | Gluten-Free, Vegan, Nut-Free, Dairy-Free, Sugar-Free, Kosher, Halal, None, Other | Preferences | Personalizes offers and prevents ordering mismatches |
| Favorite Product | Text | — | Preferences | Cross-reference in promotional emails |
| Customer Type | Dropdown | Farmers Market Regular, Wholesale Contact, Catering Contact, One-Time, Unknown | Segmentation | Drives Smart List segmentation |
| Preferred Contact Channel | Dropdown | SMS, Email, Phone, Any | Preferences | Respects customer preference; Workflows branch on this |
| Preferred Pickup Location | Dropdown | Farmers Market - Saturday, Farmers Market - Sunday, Storefront, Delivery | Logistics | Routes messages (e.g., "your order is ready at [location]") |
| Source Detail | Text | — | Source | Beyond source tag — specific captured value (e.g., "2026 Mother's Day Campaign") |
| Birthday | Date | — | Personal | Enables birthday workflow (Workflow Section 13) |
| Anniversary | Date | — | Personal | Enables anniversary workflow |
| Loyalty Points | Number | — | Loyalty | Future-proofing; remains at 0 until loyalty feature activated |
| Internal Notes | Text (long) | — | Internal | Owner-facing notes not visible to the contact |

### How to create one

1. Navigate to **Settings → Custom Fields → Contacts**. [UI-VERIFY]
2. Click **+ Add Field**.
3. Select field type (Text, Dropdown, Multi-select, etc.).
4. Enter the field name (HighLevel auto-generates the merge-field key, e.g., `{{contact.dietary_preferences}}`).
5. For dropdown/multi-select, enter the options (comma-separated or one per line).
6. Assign to a folder (create new folders as needed).
7. Save.

Repeat for each row above. Keep folder assignments consistent — "Preferences" folder, "Segmentation" folder, "Logistics" folder, "Personal" folder, "Loyalty" folder, "Internal" folder.

### Syntax reference

Custom fields are referenced in templates as `{{contact.<auto_generated_key>}}`. Example: `{{contact.dietary_preferences}}`. HighLevel derives the key from the field name — same behavior as Custom Values in Section 2. Keys stay stable even after rename.

---

## Step 2 — Create Opportunity Custom Fields

**Where:** Settings → Custom Fields → Opportunities tab. [UI-VERIFY exact label]

Opportunity Custom Fields extend the default Opportunity record. Needed for the Wholesale and Catering pipelines built in Section 10.

### Recommended baseline

| Field Name | Type | Options | Folder | Used by |
|---|---|---|---|---|
| Event Date | Date | — | Catering | Catering pipeline; triggers event-countdown workflows |
| Guest Count | Number | — | Catering | Drives pricing calculations and resource planning |
| Quoted Amount | Number (currency) | — | Financial | Records quote value before invoice creation |
| Deposit Amount | Number (currency) | — | Financial | Records partial payment on deposit |
| Deposit Status | Dropdown | Not Requested, Requested, Received, Refunded | Financial | Workflow branches on deposit receipt |
| Wholesale Account Type | Dropdown | Café, Grocer, Restaurant, Corporate, Other | Wholesale | Routes B2B-specific messaging |
| Order Frequency | Dropdown | Weekly, Bi-weekly, Monthly, Quarterly, Ad-hoc | Wholesale | Enables cadence-based wholesale nurture |
| Sample Status | Dropdown | Not Sent, Sent, Received, Rejected, Ordered | Wholesale | Drives wholesale-pipeline stage transitions |

### How to create

Same flow as Step 1 but under the Opportunities tab. Keys reference as `{{opportunity.<key>}}` in templates. Available in Opportunity-context Workflow triggers/actions.

---

## Step 3 — Build the Tag Taxonomy

Tags are flat (no nesting) but benefit from a naming convention that makes them self-documenting and scannable.

### Naming convention

Use `category:value` format. Example: `source:farmers-market` is more readable than `fm-source` and groups together in search.

### Recommended baseline for Caramel Oven

| Category | Tags | Applied when |
|---|---|---|
| **source:** | `source:farmers-market` · `source:website-form` · `source:chat-widget` · `source:referral` · `source:gbp` · `source:social-ig` · `source:social-fb` · `source:walk-in` · `source:email-campaign` · `source:event-booth` | Contact first enters the system |
| **segment:** | `segment:b2c-regular` · `segment:b2b-wholesale` · `segment:catering-lead` · `segment:vip` · `segment:dormant` | Periodic segmentation job (Smart List → bulk tag apply) |
| **status:** | `status:new-lead` · `status:active-customer` · `status:churned` · `status:blocked` | Automation-driven; Workflow updates status |
| **behavior:** | `behavior:order-consult-booked` · `behavior:purchased` · `behavior:subscribed-to-sms` · `behavior:review-submitted` · `behavior:opted-out-marketing` | Workflow tags on events |
| **interest:** | `interest:wedding-cakes` · `interest:catering` · `interest:bulk-orders` · `interest:classes` · `interest:recipe-content` | From form answers, chat conversations, or survey responses |

### How to create a tag

1. Tags are created on-the-fly when applied to a Contact (Settings → Contacts → select Contact → Tags → type new tag → enter).
2. OR navigate to **Settings → Tags** (if a dedicated Tags management page exists on the current UI). [UI-VERIFY whether bulk tag management page exists]

**Seed the tag taxonomy upfront** so Smart Lists and Workflows can reference tags that don't yet have any contacts tagged. Create all ~20 baseline tags now by applying each to a placeholder "Test Contact" record, then removing them from the test contact. This is a cleaner alternative to waiting for the first real contact to arrive before tag-taxonomy exists.

### Tag hygiene rules (document for the VA / operator)

- **One source tag per contact.** Not multiple. The first-touch source wins; avoid retroactive updates.
- **Segment tags are mutually exclusive.** A contact is `segment:b2c-regular` OR `segment:b2b-wholesale` — not both. Wholesale contacts who also buy retail get `segment:b2b-wholesale` as primary.
- **Status tags reflect current state.** At most one active `status:*` tag per contact at any time.
- **Behavior tags are additive.** A contact can have many — they track things the contact has DONE.
- **Interest tags are additive.** A contact can have many — they track things the contact HAS EXPRESSED INTEREST IN.

---

## Step 4 — Create the Brand Board

**Where:** Marketing → Brand Boards. [UI-VERIFY exact menu location — confirmed at Marketing module, not Settings]

### 4.1 Prerequisites

Prepare these inputs from Asset Inventory (Q9):
- Primary logo file (SVG preferred; PNG 1024×1024+ acceptable)
- Secondary logo file (optional)
- Primary brand color (hex)
- Accent color(s) — up to 10 total
- Primary font (Google Font name or custom file)
- Optional: 1-4 additional fonts

### 4.2 Create the Brand Board

1. Navigate to **Marketing → Brand Boards**.
2. Click **+ Add a Design Kit**. [UI-VERIFY]
3. Choose **Start from Blank** (or template if one fits — unlikely for a bakery).
4. Upload logos via the Logos tab (up to 2: primary + secondary).
5. Define colors via the Colors tab — enter 2-10 hex codes, name each (e.g., "Caramel Crust," "Oven Warmth," "Morning Cream").
6. Add typography via the Typography tab — 1-5 fonts via dropdown (Google Fonts available; custom font files upload separately).
7. Save.

### 4.3 Set as default

If this is the first Brand Board: it becomes the default automatically. If multiple Brand Boards exist: click the three-dot menu → **Set as Default**.

### 4.4 Retroactive changes do NOT propagate

**Important operational note:** HighLevel docs confirm that updating Brand Board colors after templates have been built does NOT update existing email templates, funnels, forms, surveys, or quizzes. Only NEW creations inherit the updated colors.

**Implication:** lock brand colors before building templates in Sections 12-19. If Q9 returns with different colors than the placeholder used today, plan a template-rebuild cycle — don't expect retroactive propagation.

### 4.5 Brand Board assets — Q9 resolved 2026-04-19 via site extraction

**Q9 answer:** Dan extracted brand assets from the live caramelovenokc.com site. No explicit logo files / fonts / palette delivered by Stacy and Josh yet; this section installs a first-pass Brand Board derived from the live site and allows refinement as higher-quality assets arrive.

- **Logo:** site uses `IMG_2037.png` — download this from caramelovenokc.com and use as primary logo. Request SVG version from Stacy/Josh when available (GoDaddy Website Builder often stores logos at modest resolution; for HighLevel email/invoice rendering, SVG or 1024×1024+ PNG is ideal).
- **Colors — first pass:** existing GoDaddy Website Builder template colors. Inspect the live site via browser devtools to capture exact hex codes. If the palette feels light on the "caramel/warm oven" vibe the brand name implies, propose an enhancement:
  - Primary `#8B4513` (saddle brown — the caramel crust note) — retain this as the signature color.
  - Accent `#F5DEB3` (wheat) and Neutral `#FAF0E6` (linen) as supporting colors.
- **Fonts:** GoDaddy Website Builder default typography currently. Recommend upgrade to Google Fonts pair: **Inter** (body) + **Playfair Display** (display/headings). More character than the default; free.

If Stacy and Josh later deliver logo-SVG + specific hex palette + preferred font pair, overwrite this first-pass Brand Board and note the refresh. Retroactive color changes do NOT propagate to existing templates (HighLevel platform constraint) — see §4.4 above — so lock this first-pass before building emails/forms/funnels in subsequent sections.

**Name the Brand Board:** "Caramel Oven v1" (NOT `[PLACEHOLDER]` anymore — this is a real first-pass, not a stub).

---

## Step 5 — Create the Brand Voice

**Where:** Marketing → Brand Boards → Brand Voice tab (or sub-section). [UI-VERIFY — nested inside Brand Boards]

### 5.1 Choose a creation method

Two methods are supported:

- **Text method:** Paste a 50-100 word description of the brand's tone, style, and voice. Best when Stacy or Josh have written brand guidelines or are able to describe the voice directly.
- **URL method:** Provide a URL (About page, home page, detailed product page) and HighLevel scrapes the content to infer the voice. Best when Caramel Oven already has a website with representative copy.

### 5.2 Create via URL method — RECOMMENDED (Q9-resolved 2026-04-19)

Caramel Oven's live site at caramelovenokc.com has real brand copy already. Use the URL method as primary — HighLevel extracts voice directly from the site, which produces a more accurate Brand Voice than a generic description.

1. Marketing → Brand Boards → Brand Voice.
2. Click **+ Add Brand Voice**.
3. Select **Text or URL** option → **URL**.
4. Enter Brand Voice name: **"Caramel Oven - Owner Voice"**.
5. Paste the URL: `https://caramelovenokc.com`.
6. Click **Generate**. HighLevel scrapes the homepage and About content, then auto-fills brand tone, values, mission, CTA patterns.
7. Review the auto-generated output. Expected characteristics (validated from site extraction 2026-04-19):
   - **Tone:** casual, warm, plain-spoken.
   - **Values:** community-rooted ("local"), veteran-support partnership (Mission America Veteran), mother-son authenticity.
   - **Vocabulary IN:** "local," "delicious," "baked goods," "Sweets, Treats, and More," specific products ("caramels," "cookies").
   - **Vocabulary OUT:** no "artisanal," "handcrafted," "curated," "delight" — the site doesn't use these terms and shouldn't start now.
   - **Voice:** third-person declarative ("Caramel Oven is...") rather than first-person. Sign-off by Stacy or Josh individually, not "The Caramel Oven Team."
8. Edit any auto-generated fields that don't match the validated characteristics above. HighLevel's AI extraction is good but not perfect; human review locks accuracy.
9. Save.

### 5.3 Text-method fallback (if URL extraction underwhelms)

If the URL method produces generic output (can happen when a site has limited body copy — GoDaddy Website Builder sites sometimes have less text than content-heavy WordPress sites), fall back to the Text method:

1. Same entry point, pick **Text** instead of URL.
2. Paste this validated description:

> "Caramel Oven is a mother-son-owned baked goods business in Oklahoma City. We sell caramels, cookies, and other sweets — 'Sweets, Treats, and More.' We're a proud partner of Mission America Veteran, so our brand has a real community dimension beyond product. We sound casual, warm, and plain-spoken. We use 'local' and 'delicious' — words that actually describe what we do. We don't say 'artisanal,' 'handcrafted,' or 'curated' — those are chain-store labels, and our product speaks for itself. We sign off as Stacy or Josh individually, not as a 'team.' We use periods, not exclamation marks. We talk about the caramel, the cookie, the customer who came back — specific things, not abstract categories."

3. Generate → review → save.

### 5.4 Integration with Content AI

Brand Voice surfaces automatically in Content AI generation flows (Social Planner, Email Builder, Blogs, Funnels). The "Use Brand Voice" toggle in each Content AI modal auto-fills brand parameters; manual overrides take priority. See Section 18 for the detailed Content AI setup that consumes this.

### 5.5 Q9 resolution notes

Q9 resolved 2026-04-19 via site-extraction from caramelovenokc.com. Name the Brand Voice **"Caramel Oven - Owner Voice v1"** (NOT `[PLACEHOLDER]` — this is a real first-pass derived from real brand copy).

If Stacy or Josh later provide a written brand-voice guideline or a formal tone document that diverges from the site-extracted voice, create a **v2** Brand Voice, set it as default, and archive v1 for reference. Do not delete v1 — useful for A/B comparison if tone questions arise post-launch.

---

## Step 6 — Verify and document

### 6.1 Update the Intake Document

Record what's been built:

```
SECTION 5 STATUS
Contact Custom Fields: 10 created (Preferences × 4, Segmentation × 1, Logistics × 1, Source × 1, Personal × 2, Loyalty × 1, Internal × 1)
Opportunity Custom Fields: 8 created (Catering × 2, Financial × 3, Wholesale × 3)
Tag Taxonomy: 5 categories, ~20 tags seeded
Brand Board: [Final / PLACEHOLDER - awaiting Q9]
Brand Voice: [Final / PLACEHOLDER - awaiting Q9]
Section 5 status: [COMPLETE / PROVISIONAL pending Q9]
```

### 6.2 Test a tag

Apply one tag (e.g., `source:test`) to a dummy contact. Remove it. Confirms tag-creation works. Delete the dummy contact.

### 6.3 Test a Custom Field merge

Create a test Contact, set one Custom Field (e.g., Dietary Preferences = "Gluten-Free"). In Conversations, compose a test email body with `{{contact.dietary_preferences}}` — the preview should render "Gluten-Free." [UI-VERIFY preview behavior]

---

## Completion criteria

Section 5 is COMPLETE (or PROVISIONAL pending Q9) when:

1. ✅ 10 Contact Custom Fields created, organized into folders.
2. ✅ 8 Opportunity Custom Fields created.
3. ✅ Tag taxonomy seeded (5 categories, ~20 tags on a dummy contact → removed).
4. ✅ Brand Board created (with Q9 assets or clearly-marked placeholders).
5. ✅ Brand Voice created (with Q9 description or clearly-marked placeholder).
6. ✅ Test merge-field render validated.
7. ✅ Intake Document updated with Section 5 status.

If using placeholders (PROVISIONAL state), Section 5 is re-visited within 1-2 days of Q9 arrival to finalize Brand Board and Brand Voice.

---

## What happens next

**Section 6 — Contacts Import & Smart Lists** (Q8 informs planning; not blocked). Uses Tag Taxonomy from Step 3 to apply source/segment tags during import.

**Section 10 — Pipelines & Opportunities** uses Opportunity Custom Fields from Step 2. Runs in parallel with Section 6 per the Blocker Map.

**Section 18 — Content AI Setup** depends on Brand Voice from Step 5. Runs after Section 17 Website/Funnel ships.

---

## Flags for this section

- **Assumptions made:** (a) Tag naming convention `category:value` with colon separator — standardizes the taxonomy but is NOT a HighLevel convention, just a discipline choice; (b) 10 contact custom fields is a reasonable starting set for a bakery — may expand over time; (c) placeholder Brand Voice description uses "Stacy or Josh" signoff pattern — correct if Q9 confirms owner voice; override if Q9 indicates brand-name-only voice.
- **Gaps identified:** (a) UI-VERIFY flags on Settings → Custom Fields Contacts/Opportunities tab location, Settings → Tags bulk management page existence, Marketing → Brand Boards path, Brand Voice nesting location; (b) Preview behavior for merge-field rendering in Conversations is UI-VERIFY.
- **Competing approaches:** (a) Tag naming `category:value` vs flat tags — chose structured for scannability; flat tags work fine but become hard to audit as the taxonomy grows. (b) Creating 20 tags upfront vs. organic creation — chose upfront so Smart Lists in Section 6 can reference tags that haven't been applied yet. Organic creation leaves Smart Lists broken until a contact arrives.
- **Client-side blockers:** Q9 (brand assets) required to finalize Brand Board + Brand Voice. Section 5 ships PROVISIONAL with placeholders if Q9 is still pending.
- **Platform-level irreversible decisions:** None in this section. Brand Boards are deletable (though retroactive color changes don't propagate — a softer constraint). Custom Fields are editable (but renaming doesn't break merge fields — keys are stable).

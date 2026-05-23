# Section 17 — Website + Funnel + Blog

**Last Updated:** 2026-04-19
*If HighLevel UI doesn't match these instructions, consult the Update Protocol (Phase 5.2). This guide targets the HighLevel platform as of 2026-04-19.*

**⚠️ MANDATORY CHECK-IN SECTION.** Dan reviews Section 17 delivery before A2P Campaign Registration submits. Per the expanded-autonomy directive, this is the single pipeline-pause point between Section 4's Brand Registration submission (2026-04-19) and Section 21's go-live.

---

## Purpose

Replace Caramel Oven's GoDaddy Website Builder site with a HighLevel-built website that includes the compliance pages A2P Campaign Registration requires (Privacy Policy · Terms of Service · SMS Opt-In), embeds every surface built in prior sections (Section 8 forms + chat widget · Section 11 review widget · Section 16 gift cards · Section 7 products/payment links), supports a recipe/seasonal blog for SEO, and cuts over from the 224 phone number to the new LC Phone OKC number.

**Estimated time:** 6-10 hours active work across home page + about + order + contact + compliance pages + blog setup. Larger than any prior section.

**Dependencies:**
- Sections 2 · 3 · 5 · 7 · 8 · 9 · 10 · 11 · 15 · 16 complete.
- Domain caramelovenokc.com connected to HighLevel (Section 3 — subdomain email in place; root A record still points at GoDaddy Website Builder until cutover in this section).
- Section 4 Brand Registration submitted (waiting on carrier approval, which runs in parallel with this section).

---

## Why this section matters

Section 17 is the critical path for three concurrent outcomes:

1. **A2P Campaign Registration unblock.** Campaign Registration rejects without real public Privacy / Terms / Opt-In URLs. Section 17 produces those URLs. Once live, Section 4 Step 7 (Campaign Registration submission) fires immediately.
2. **GoDaddy Website Builder → HighLevel cutover.** The current site is a template with an "Order Now" CTA that probably routes to some GoDaddy order form. Replacing it with the HighLevel site unifies customer journeys (forms + chat + booking + gift cards all live on one domain, all feeding the same CRM).
3. **224 → OKC phone cutover.** Per your locked directive: the 224.303.8897 Chicago-area-code number on the current site retires at Section 17 launch. New OKC LC Phone number (from Section 4) becomes the single customer-facing number.

Three non-obvious principles:

1. **Privacy Policy and Terms of Service are legal documents, not marketing copy.** The drafts below are starting points — Stacy and Josh should have an attorney review before going live. This guide provides A2P-compliant scaffolding, not legal advice.
2. **The cutover window is 10-60 minutes, not days.** DNS TTL was lowered in Section 3 to 300 seconds; A-record swap propagates in minutes. Plan the cutover for early morning OKC (say 6am CT) to minimize customer disruption.
3. **Blog content compounds over 6-18 months.** Don't overbuild at launch. 3 starter blog posts + cadence of 1-2 new posts/month is sufficient; SEO momentum builds from regularity more than volume.

---

## What you will produce

1. **Live website** at `caramelovenokc.com` built on HighLevel Sites:
   - Home · About · Order · Contact pages (customer-facing).
   - Privacy Policy · Terms of Service · SMS Opt-In pages (compliance).
   - Blog with 3 starter recipe posts + Author bio.
2. **All upstream-section assets embedded:**
   - Section 8 forms (Lead Capture · Custom Order Inquiry · Catering Inquiry · Feedback Survey).
   - Section 8 Chat Widget.
   - Section 11 Review Widget.
   - Section 16 Gift Card checkout link + embed block.
   - Section 9 booking links (4 services).
   - Section 7 Payment Links (product-specific).
3. **Cutover executed** from GoDaddy Website Builder to HighLevel.
4. **Phone number updated** from 224.303.8897 → new OKC LC Phone number.
5. **SEO baseline:** meta descriptions, XML sitemap, Google Search Console verification.
6. **A2P Campaign Registration readiness confirmation** for Dan to review before submitting.

---

## Step 1 — Funnel vs. Website — choose the surface

HighLevel offers two builders: Funnels (conversion-focused, short path) and Websites (multi-page, SEO-oriented). Caramel Oven needs both patterns:

- **Websites mode** for the main site (Home + About + Order + Contact + Privacy + Terms + Opt-In + Blog) — multi-page, SEO-indexed.
- **Funnels mode** for seasonal-campaign landing pages (Mother's Day Gift Card → checkout → thank-you) — isolated conversion flows with pixel tracking.

**Primary build: Websites.** Funnels layer on top for campaigns.

**Where to start:** Sites → Websites → **+ New Website** → Start from Blank. [UI-VERIFY]

---

## Step 2 — Build the Home page

**Structure (top to bottom):**

1. **Header:** logo + nav (Home · About · Order · Contact · Blog · **Gift Cards** CTA button). Phone number `{{custom_values.business_phone}}` (post-cutover = OKC LC number). Chat widget embedded (Section 8) fixed bottom-right on all pages.
2. **Hero:** tagline "Sweets, Treats, and More" (directly from current GoDaddy site) + brief sub-headline + primary CTA button "**Order Now**" → links to Order page. Secondary CTA "**Book a Consultation**" → `{{custom_values.booking_link}}` (Section 9 Custom Order Consultation).
3. **About snippet:** 2-3 sentences on mother-son ownership + Mission America Veteran partnership + OKC local focus. Link to About page for full story.
4. **Product showcase:** 4-6 featured products (pulled from Section 7 Products) with Buy buttons → Payment Links.
5. **Reviews block:** Section 11 Review Widget embed showing 4-5 star reviews (starts empty pre-GBP-verification; fills in over time).
6. **Gift Card block:** Section 16 Gift Card embed with "Give a Caramel Oven gift card" CTA.
7. **Farmers market schedule:** static section listing where Caramel Oven will be this Saturday + next (manually updated by Stacy/Josh, or pull from a Custom Value `custom_values.market_schedule` that's easier to update).
8. **Email signup:** Section 8 Lead Capture Form embed.
9. **Footer:** social icons (FB · IG · TikTok) · address `{{custom_values.business_address}}` · phone `{{custom_values.business_phone}}` · email · Privacy/Terms/Opt-In links · copyright.

**Styling:** Brand Board v1 colors + fonts applied site-wide.

---

## Step 3 — Build the About page

**Structure:**

1. **Header:** same as Home.
2. **Mother-son narrative** (plain-spoken per Brand Voice):
   > *"Caramel Oven is a mother-son-owned baked goods business in Oklahoma City. Stacy handles the kitchen — decades of home baking, small-batch caramels, cookies, custom cakes, and event desserts. Josh handles operations, deliveries, and wholesale accounts. We started Caramel Oven because we wanted to share what we bake with more people than just family and neighbors."*
3. **Mission America Veteran partnership:** short paragraph + logo/badge if available.
4. **What we make:** brief description of retail · custom orders · event desserts · wholesale.
5. **Where to find us:** OKC address · farmers market rotation · website.
6. **Contact CTA:** button → Contact page.
7. **Footer:** same as Home.

---

## Step 4 — Build the Order page

**Structure:**

1. **Header:** same.
2. **Intro paragraph:** *"Pick the kind of order you want. We bake custom, and we deliver local."*
3. **3 ordering paths** (clear buttons/blocks):
   - **Retail Quick-Pay** (caramels, cookies, gift boxes) — Section 7 Payment Links per product.
   - **Custom Cake / Special Order** — Section 8 Custom Order Inquiry Form embed.
   - **Event / Wholesale Inquiry** — Section 8 Catering Inquiry Form embed.
4. **Book a Consultation:** Section 9 booking-link buttons for all 4 Services.
5. **Buy a Gift Card:** Section 16 embed block.
6. **Footer:** same.

---

## Step 5 — Build the Contact page

**Structure:**

1. **Contact methods:**
   - Phone (`{{custom_values.business_phone}}` — new OKC LC number) + click-to-call.
   - Email (`{{custom_values.business_email}}`) + click-to-email.
   - SMS opt-in link to Section 8 Lead Capture Form.
2. **Address + map:** embedded Google Map of OKC address.
3. **Hours:** pulled from `{{custom_values.business_hours}}`.
4. **Farmers market schedule:** same as Home's block.
5. **Social icons:** FB · IG · TikTok.
6. **Footer:** same.

---

## Step 6 — Build the Privacy Policy page

**URL:** `caramelovenokc.com/privacy`

**Required for A2P Campaign Registration.** Must state: "Data is not shared with third parties for marketing purposes."

**Full draft (strengthened per legal-review-deferred approval 2026-04-19 — attorney review within 30 days of launch per Section 21 accumulator):**

> # Privacy Policy
>
> **Last Updated:** 2026-04-27
>
> Caramel Oven Bakehouse LLC ("Caramel Oven," "we," "us," "our") respects your privacy. This Privacy Policy describes what information we collect, how we use and share it, your choices, and how to contact us with questions or requests.
>
> ## Information we collect
>
> - **Information you provide directly:** your name, email address, phone number, shipping and billing address, and any other information you give us when placing an order, booking a consultation, filling out a contact or inquiry form, subscribing to SMS or email updates, or interacting with us via chat, email, SMS, phone, or in person.
> - **Transaction details:** when you purchase through us, our payment processor (Stripe) collects payment card details directly. We receive transaction amounts, product descriptions, and a card type plus last 4 digits for our records. We do not store full payment card numbers.
> - **Communications:** we keep copies of emails, text messages, chat messages, and direct messages you send us through our website, social accounts, or phone.
> - **Usage data:** when you visit caramelovenokc.com, we collect basic browsing information (IP address, browser type, pages viewed) via Google Analytics. This is aggregated and not personally identifiable to us.
>
> ## How we use your information
>
> - To fulfill orders, bookings, consultations, and wholesale arrangements.
> - To respond to your questions and provide customer service.
> - To send order confirmations, appointment reminders, receipts, and other transactional messages.
> - If you opt in: to send occasional marketing messages (new products, seasonal offers, event announcements) by email or SMS.
> - To request reviews and feedback after completed orders or events.
> - To comply with legal obligations (tax records, financial record-keeping).
> - To improve our products and services.
>
> ## How we share your information
>
> **We do not share your personal information with third parties for marketing purposes.** We share information only with:
>
> - **Service providers** who help us operate the business: Stripe (payment processing), HighLevel (our customer relationship management platform), Google (email delivery, analytics), Meta (social media integration for Facebook and Instagram). Each operates under their own privacy policy and is contractually required to protect your information.
> - **Legal requirements:** if required by law, court order, or government authority, we may disclose information necessary to comply.
> - **Business transfers:** if Caramel Oven is sold or merged, customer information may transfer as part of the transaction. We would notify subscribers in advance.
>
> ## Data retention
>
> - **Active customer records:** retained while you remain a customer or subscriber and for a reasonable period thereafter (typically 3 years of inactivity triggers our review).
> - **Financial records (invoices, receipts):** retained for 7 years per federal tax record-keeping requirements.
> - **Marketing subscriber records:** retained until you unsubscribe, then minimal records (email or phone with opt-out status) retained to honor your unsubscribe request.
> - **Upon deletion request:** we delete your personal information within 30 days, except where retention is required by law (e.g., financial records).
>
> ## Your choices
>
> - **Unsubscribe from marketing email:** click the unsubscribe link in any marketing email.
> - **Unsubscribe from SMS:** reply STOP to any text message. Reply HELP for help.
> - **Access, correct, or delete your data:** email us at `{{custom_values.business_email}}` with your request. We'll respond within 30 days.
> - **Do Not Sell or Share:** we do not sell or share personal information for cross-context behavioral advertising as defined under applicable state laws.
>
> ## Children's privacy
>
> Our services are not directed to children under 13. We do not knowingly collect information from children under 13. If we learn we have collected such information, we will delete it promptly.
>
> ## Security
>
> We use industry-standard security practices (encrypted transmission, access controls, service provider vetting). No system is 100% secure; we cannot guarantee absolute security but we work hard to protect your information.
>
> ## Third-party links
>
> Our website may link to third-party sites (social media, payment processors, etc.). We are not responsible for their privacy practices. Review their policies before providing information.
>
> ## Updates to this policy
>
> We may update this Privacy Policy from time to time. The "Last Updated" date at the top reflects the most recent revision. If we make material changes, we will notify subscribers via email.
>
> ## Contact us
>
> Caramel Oven Bakehouse LLC
> `{{custom_values.business_address}}`
> Email: `{{custom_values.business_email}}`
> Phone: `{{custom_values.business_phone}}`

---

## Step 7 — Build the Terms of Service page

**URL:** `caramelovenokc.com/terms`

**Required for A2P Campaign Registration.** Must include 6 specific bullets (see Section 4 Step 6.6).

**Full draft (strengthened per legal-review-deferred approval 2026-04-19):**

> # Terms of Service
>
> **Last Updated:** 2026-04-27
>
> ## SMS Terms — Caramel Oven SMS Updates
>
> By providing your phone number and opting into SMS messages from Caramel Oven Bakehouse LLC, you agree to the following terms.
>
> 1. **Program name:** Caramel Oven SMS Updates.
> 2. **Program description:** we send order confirmations, appointment reminders, event updates, occasional promotional offers about new products and seasonal bakes, review requests after fulfillment, and customer service responses.
> 3. **Message frequency:** varies — typically 2 to 8 messages per month.
> 4. **Message and data rates:** message and data rates may apply per your mobile carrier's plan.
> 5. **Opt-out:** reply STOP to any text message to unsubscribe at any time. Reply HELP for help.
> 6. **Carrier liability:** mobile carriers (AT&T, Verizon, T-Mobile, and others) are not liable for delayed or undelivered messages.
>
> ### SMS general terms
>
> - By providing your phone number and opting in, you confirm you are the account holder or have authorization from the account holder.
> - We do not share your phone number with third parties for marketing purposes.
> - These SMS terms are in addition to our Privacy Policy.
> - We may update these terms from time to time; we'll notify subscribers of material changes.
>
> ## Website Terms of Use
>
> By using caramelovenokc.com, purchasing from us, or otherwise interacting with Caramel Oven, you agree to these terms.
>
> ### Use of the website
>
> - You agree to use the website lawfully and in accordance with these terms.
> - You will not attempt to disrupt, damage, or gain unauthorized access to the website.
> - Content on the website (text, images, branding) is the property of Caramel Oven Bakehouse LLC and protected by applicable intellectual property laws.
>
> ### Orders and payments
>
> - Product descriptions and pricing on the website are for reference. Final pricing is confirmed at checkout.
> - Payments process through Stripe; by ordering, you agree to Stripe's terms of service.
> - Orders are subject to availability; we reserve the right to cancel and refund if fulfillment is not possible.
>
> ### Custom orders and events
>
> - Custom orders and event consultations may require a deposit; deposit terms are stated at booking.
> - Cancellation policies apply to custom and event orders (stated in your Catering Contract or booking confirmation).
>
> ### Disclaimer
>
> - Products are made in a kitchen that handles wheat, dairy, eggs, nuts, and other common allergens. While we do our best to accommodate dietary requests, we cannot guarantee an allergen-free product.
> - Services and products are provided "as is." To the fullest extent permitted by law, Caramel Oven disclaims all warranties not expressly stated in writing.
>
> ### Limitation of liability
>
> To the fullest extent permitted by applicable law, Caramel Oven's liability for any claim arising from the use of the website or our products is limited to the amount paid by you in the 30 days preceding the claim.
>
> ### Governing law
>
> These terms are governed by the laws of the State of Oklahoma, without regard to conflict-of-law principles. Disputes resolve in the state or federal courts of Oklahoma County, Oklahoma.
>
> ### Updates to these terms
>
> We may update these terms from time to time. The "Last Updated" date at the top reflects the most recent revision.
>
> ## Contact us
>
> Caramel Oven Bakehouse LLC
> `{{custom_values.business_address}}`
> Email: `{{custom_values.business_email}}`
> Phone: `{{custom_values.business_phone}}`

---

## Step 8 — Build the SMS Opt-In page

**URL:** `caramelovenokc.com/sms-opt-in` (or /opt-in)

**Required for A2P Campaign Registration.** The Opt-In Form URL referenced in Section 4 Step 6.4.

**Full draft (strengthened per legal-review-deferred approval 2026-04-19):**

> # Get Caramel Oven Updates — by Text
>
> Want to know about new bakes, seasonal offers, and upcoming market appearances? Opt in to Caramel Oven SMS Updates below.
>
> ## Why subscribe?
>
> - **Order updates** — confirmations and pickup-ready notifications go out fast.
> - **Market reminders** — where we'll be this Saturday and Sunday.
> - **Seasonal offers** — Mother's Day pre-orders, holiday specials, new-product drops.
> - **Occasional, never spammy** — typically 2 to 8 messages per month.
>
> ## Sign up
>
> **[Embedded form — name · email · phone]**
>
> **[Consent checkbox — NOT pre-checked per A2P requirement]**
>
> *"Yes, I'd like Caramel Oven to send me text messages about orders, new products, market appearances, and occasional promotions. Message frequency varies (typically 2-8/month). I can reply STOP at any time to unsubscribe. Reply HELP for help. Message and data rates may apply per my mobile carrier's plan. I have read and agree to the [Privacy Policy](/privacy) and [Terms of Service](/terms)."*
>
> **[Submit button: "Sign me up"]**
>
> ## Frequently asked questions
>
> **How often will I get messages?**
> Typically 2 to 8 messages per month. We won't blast you. Order confirmations and reminders are separate from promotional updates.
>
> **What kinds of messages?**
> Order confirmations, appointment reminders (if you've booked), event updates, occasional promotional offers about new products and seasonal bakes, review requests after you've received your order, and customer service responses.
>
> **How do I unsubscribe?**
> Reply STOP to any text message. We'll confirm you've been unsubscribed and won't send further marketing messages.
>
> **Do you share my phone number?**
> No. We do not share your phone number with third parties for marketing purposes. See our [Privacy Policy](/privacy) for full details.
>
> **What if I change my mind?**
> You can opt back in anytime by re-subscribing here or by contacting us directly at `{{custom_values.business_email}}` or `{{custom_values.business_phone}}`.

The **consent checkbox is NOT pre-checked** (A2P rejection trigger per Section 4 Step 6.6).

---

## Step 9 — Blog setup + 3 starter posts

**Where:** Sites → Blog. [UI-VERIFY]

### 9.1 Blog config

- Blog name: "Caramel Oven Notes"
- Author: Stacy (primary) with option for Josh
- URL structure: `caramelovenokc.com/blog/[post-slug]`
- Sitemap: enabled (auto-generates `/sitemap.xml` per Section 3 research)
- RSS: enabled

### 9.2 Starter posts (draft with Content AI from Section 18, then edit)

1. **"Why Our Caramels Are Soft, Not Crunchy" —** 600-word post explaining the cooking temperature + dairy ratio + storage humidity that makes Caramel Oven caramels specifically soft. Educational. SEO target: "soft caramel recipe" / "homemade caramel texture."
2. **"Baking for Oklahoma Humidity: What We've Learned" —** 500-word post about OKC climate impact on dough hydration and storage. Local-SEO hook. SEO target: "Oklahoma bakery" / "humid climate baking."
3. **"The Mission America Veteran Partnership: Why It Matters to Us" —** 400-word post on the values behind the business. Brand-building post; authentic voice.

Each post: Brand Voice applied, Author = Stacy, Featured image from Brand Board, SEO meta description written.

### 9.3 Blog element on Home page

Add a Blog Post Element on the Home page showing the 3 most recent posts. Drives visitors from Home → Blog → deeper engagement.

---

## Step 10 — SEO configuration

1. **Meta descriptions** on every page — 120-155 characters each. Example for Home: *"Caramel Oven Bakehouse — Oklahoma City's mother-son-owned small-batch bakery. Custom cakes, caramels, cookies, and catering. Order online or find us at the farmers market."*
2. **Alt text** on every image.
3. **XML sitemap** auto-generated by HighLevel (Blog section: RSS + sitemap per Section 3 research article 48001182524).
4. **Google Search Console:** verify the domain via the HTML tag method. Submit sitemap. Tracks indexing + SEO health.
5. **Google Analytics 4** tracking code added site-wide (per Section 10 Tracking & Attribution pre-research).
6. **Canonical URLs** set per blog post per HighLevel's Blog SEO docs.

---

## Step 11 — Cutover from GoDaddy Website Builder to HighLevel

### 11.1 Pre-cutover checklist

- ✅ All pages built and previewed in HighLevel Sites.
- ✅ All embeds tested (forms submit; chat loads; review widget loads; gift card checkout works; payment links resolve).
- ✅ All links internal verified (Home → About link works, etc.).
- ✅ Mobile preview verified (HighLevel Sites supports mobile preview; check all pages look right on phone).
- ✅ Stacy + Josh have reviewed the new site staging URL (HighLevel provides a preview URL before publishing).
- ✅ Content on the current GoDaddy site captured (screenshots + copy saved to Asset Inventory — in case anything's needed post-cutover).

### 11.1.5 Sunday evening pre-cutover verification (per Dan directive 2026-04-19)

**Sunday 2026-04-26, 6-9pm CT** — 2-3 hour dedicated verification session before Monday morning cutover:

- ✅ **HighLevel site production-ready:** every page renders correctly in HighLevel preview; all elements load without errors.
- ✅ **All Custom Values resolve correctly:** click through templates, emails, pages — verify `{{custom_values.business_name}}`, `{{custom_values.business_phone}}` (should be new OKC LC number), `{{custom_values.business_address}}`, `{{custom_values.booking_link}}`, `{{custom_values.review_link}}`, `{{custom_values.unsubscribe_link}}`, `{{custom_values.sales_tax_jurisdiction}}`, all render as expected values, NOT as literal `[placeholder]` strings.
- ✅ **Embedded form submissions route to the right destinations:** Lead Capture form → creates Contact with `source:website-form`; Custom Order Inquiry → creates Opportunity in Catering pipeline; Catering Inquiry → routes to Wholesale if Company Name filled; Feedback Survey → routes by NPS score per Section 8.
- ✅ **Booking calendar works end-to-end:** click Custom Order Consultation booking link → availability shows → test-book a slot → verify confirmation email + staff notification.
- ✅ **Stripe test transaction:** run a $1 live transaction through a Payment Link; verify Workflow #2 Post-Purchase fires; refund the $1 immediately.
- ✅ **Chat widget:** send a test message through the widget → verify it lands in Conversations inbox.
- ✅ **Review Widget embed:** renders even at zero reviews (graceful-empty-state expected pre-GBP-verification).
- ✅ **Gift Card checkout:** test a $25 gift card purchase + refund.

**If any of these fail Sunday evening:** fix before Monday morning cutover, OR delay cutover by 24-48 hours. Do not proceed to Step 11.2 with known failures.

### 11.2 Cutover steps

**Cutover window: early morning OKC time (6-7am CT), Monday-Thursday (avoid weekend traffic).**

1. **In GoDaddy DNS:** change the `@` (root) A record from GoDaddy Website Builder's IP to HighLevel's IP (HighLevel provides the target IP in Settings → Domains when the domain is fully configured).
   - Alternative: if HighLevel uses CNAME for root (ALIAS/ANAME depending on registrar support), use that.
   - TTL: already low (300 seconds) from Section 3.
2. **Wait 10-60 minutes** for DNS propagation.
3. **In HighLevel:** publish the Sites site to production (may be a "Publish" button on the site dashboard).
4. **Visit `caramelovenokc.com` in multiple browsers** to confirm HighLevel site renders.
5. **Check the old GoDaddy Website Builder site is NOT still accessible** via the root domain. If it is: DNS hasn't fully propagated; wait longer.

### 11.3 Post-cutover cleanup

- Pause or cancel GoDaddy Website Builder subscription (if Caramel Oven was paying for it separately — recover the monthly fee).
- Archive the GoDaddy site's content in Asset Inventory for reference.
- Monitor traffic for 48 hours — any 404 errors or broken inbound links from social posts / Google cache gets logged and fixed via HighLevel redirects.

---

## Step 12 — Phone number cutover (224 → OKC)

**Per your locked directive (2026-04-19):** the 224.303.8897 Chicago-area-code number retires at site cutover. New LC Phone OKC number becomes the single customer-facing number.

### 12.1 Update sources

All of these reference the phone number; ALL update at cutover:

1. **Custom Value** `{{custom_values.business_phone}}` — Section 2. Update to new LC Phone OKC number. All templates and pages pulling this value update automatically.
2. **Google Business Profile** (Section 11) — update the phone number in GBP dashboard. Google may require re-verification; postcard-pending is an acceptable state.
3. **Social profiles** — FB page, IG bio, TikTok bio. Stacy/Josh update.
4. **Email signatures** (if Stacy/Josh use Gmail signatures) — update manually.
5. **Existing GoDaddy site** — no need; it's being retired. If it's still up briefly during cutover, the new phone on HighLevel supersedes.

### 12.2 Old 224 number disposition — Option A LOCKED (2026-04-19)

Dan approved **Option A: 90-day call-forward to new OKC LC number, then retire 224.**

Rationale: existing customers, wholesale prospects, and anyone who saved 224 from past interactions still reach Caramel Oven without disruption. Silent forwarding preserves relationships while the new OKC number becomes the primary everywhere. Day 90 retirement — by then anyone using 224 has either transitioned or lost the relationship anyway.

**Forwarding setup depends on the 224 number's carrier/billing arrangement. Flag for Stacy/Josh:**
- Is 224.303.8897 a **Verizon / AT&T / T-Mobile mobile line**? (Most common — forwarding via carrier's "Call Forwarding" feature, typically free or low-cost.)
- Or a **separate business line** through Google Voice, Grasshopper, RingCentral, etc.? (Forwarding configured in the provider's dashboard.)
- Or a **landline** through an OKC telco? (Forwarding configured via call-forwarding code *72 at most landlines.)

Stacy or Josh confirms the carrier/billing arrangement before Section 21 pre-launch. Forwarding setup is a 10-minute task once the carrier is known.

---

## Step 13 — A2P Campaign Registration submission readiness

**Now that production URLs exist:** Section 4 Step 7 can fire.

### 13.1 Confirm URLs are live + reachable

- ✅ `caramelovenokc.com/privacy` — returns 200 OK with Privacy Policy content.
- ✅ `caramelovenokc.com/terms` — returns 200 OK with Terms of Service + the 6 required bullets.
- ✅ `caramelovenokc.com/sms-opt-in` — returns 200 OK with Opt-In form + consent language.

Verify from an incognito browser (not logged into HighLevel) — carriers will check from the outside.

### 13.2 Update Section 4 Campaign Registration package

The Section 4 Step 6 package (A2P Campaign Package doc) needs these fields filled with the now-live URLs:

- Opt-In Form URL: `https://caramelovenokc.com/sms-opt-in`
- Privacy Policy URL: `https://caramelovenokc.com/privacy`
- Terms of Service URL: `https://caramelovenokc.com/terms`

### 13.3 Confirm Brand Registration status

- Brand Registration was submitted 2026-04-19. Expected approval: 2026-04-24 to 2026-04-28 (3-7 business days).
- Confirm Brand status is **Approved** at Settings → Phone System → Trust Center before Campaign submission.
- If Brand is still Pending at Section 17 completion: wait for Brand approval, then submit Campaign. Don't submit Campaign if Brand isn't approved yet — Campaign will auto-fail.

### 13.4 Submit Campaign Registration

Dan (or VA) executes Section 4 Step 7:

1. Settings → Phone System → Trust Center → Campaigns → + Create Campaign.
2. Select approved Brand.
3. Fill Campaign form using Section 4 Step 6 package + now-live URLs.
4. Pay $15.75 verification fee.
5. Submit. Status → Pending. Carrier review: 1-3 business days.

### 13.5 Post-approval: SMS unlocks

Once Campaign approves:
- All SMS workflows (Sections 12, 13, 14) that were building/queuing go live.
- Missed-Call Text-Back starts working in production.
- Review Request via SMS activates.
- First live sends obey the 8-level throughput ramp (Section 4 Step 8).

---

## Step 14 — Funnel for seasonal campaigns (optional at launch)

Not required at launch but scaffold the pattern:

1. Sites → Funnels → + New Funnel → "Mother's Day Gift Card Campaign 2026".
2. Pages: Landing → Checkout → Thank-You.
3. Landing page: Mother's Day-themed hero + gift card embed + CTA.
4. Checkout: Section 16 gift card purchase.
5. Thank-You: confirmation + social-share prompt.

Used for future seasonal campaigns (Section 13/14/19 Content AI generates post drafts; Social Planner schedules; traffic routes to Funnel; conversions tracked).

At launch: build 1 Funnel placeholder. Activate 3 weeks before Mother's Day (~mid-April) 2027 or whenever Stacy/Josh want.

---

## Step 15 — Smoke test the whole site

End-to-end test post-publish:

1. **Home:** all sections render, links work, chat widget loads, email signup submits.
2. **About:** renders.
3. **Order:** all 3 ordering paths work (retail quick-pay to Stripe, custom inquiry form submits, catering inquiry form submits). All 4 booking links load Section 9 Services correctly.
4. **Contact:** phone click-to-call works; Google Map loads.
5. **Privacy · Terms · Opt-In:** all three pages return 200 and display full content.
6. **Blog:** 3 posts render; RSS feed works at `/rss.xml`.
7. **Review Widget:** loads (empty pre-GBP-verification; expected).
8. **Gift Card:** embed loads, checkout flow works end-to-end.
9. **Mobile:** every page renders correctly on iPhone + Android.
10. **Page speed:** Lighthouse audit shows 70+ on all pages (target).

---

═══════════════════════════════════════════════
## MANDATORY CHECK-IN — Section 17 delivery for Dan's approval [RESOLVED 2026-04-19]

**Status:** APPROVED with conditions. Drafts reviewed in conversation. Sunday 2026-04-26 pre-cutover verification added. Option A 224-forward locked. Campaign Registration firing = Dan/VA action (not Cowork).

---

## Original mandatory check-in content (for audit trail)

**Per expanded-autonomy directive, Section 17 is the single required check-in between the A2P Brand clock starting (2026-04-19) and the full build completion. Below is the state for your review before Campaign Registration fires.**

### 1. Production URLs — live and ready for A2P

| Page | URL | A2P Purpose |
|---|---|---|
| Privacy Policy | `https://caramelovenokc.com/privacy` | A2P Campaign Registration Privacy field |
| Terms of Service | `https://caramelovenokc.com/terms` | A2P Campaign Registration ToS field (contains 6 required bullets) |
| SMS Opt-In | `https://caramelovenokc.com/sms-opt-in` | A2P Campaign Registration Opt-In Form URL field |

Drafts per Steps 6, 7, 8. **These are starting-point drafts; Stacy/Josh's attorney should review before going live.** Legal risk is low (standard compliance language) but non-zero.

### 2. Site cutover plan

- **Target cutover window:** early morning OKC (6-7am CT), Monday-Thursday. Recommended specific date: **Monday 2026-04-27** (in sync with expected A2P Brand approval window of 2026-04-24 to 2026-04-28; live website + Brand approval together enable Campaign Registration submission same day).
- **Cutover mechanics:** GoDaddy DNS root A record swap → HighLevel site publish → 10-60 min DNS propagation → verify → proceed.
- **Rollback plan:** if anything breaks, revert the A record at GoDaddy to GoDaddy Website Builder's IP. DNS reverts in 10-60 min.

### 3. Phone number cutover (224 → OKC)

Per your directive:
- **New OKC LC Phone number** (from Section 4) becomes the single customer-facing number.
- **Old 224.303.8897** — recommend **Option A: call forward for 90 days**, then retire. Stacy/Josh confirm preference at Section 21 pre-launch.
- **All phone references** update via `{{custom_values.business_phone}}` Custom Value — change once, propagates everywhere.
- **GBP** (Section 11) — phone updated in GBP dashboard; Google may require re-verification (use existing postcard verification process).

### 4. Live publishing decision

**Proposed publish timing: Monday 2026-04-27, 6am CT.**

Rationale:
- Parallels A2P Brand approval window (2026-04-24 to 2026-04-28) — timing the site live + Brand approved together enables Campaign Registration to submit same day.
- Monday start gives a full business week to catch any cutover issues before a weekend.
- 6am CT minimizes traffic during cutover propagation window.

**Alternative:** publish IMMEDIATELY (today, 2026-04-19) to maximize A2P Campaign URL live-time before submission. Risk: customers hit the new site with unverified GBP, untested workflows, pre-Brand SMS unlocks. Not recommended; 2026-04-27 alignment is cleaner.

### 5. A2P Campaign Registration readiness

✅ Production URLs will be live by proposed cutover.
✅ Section 4 Step 6 package complete (sample messages · opt-in docs · privacy/terms).
⚠️ Brand Registration: expected approval by 2026-04-28 per carrier clock. Confirm approved before Campaign submission.
✅ $15.75 verification fee acknowledged.

**Submission trigger:** on or after cutover (2026-04-27), once Brand shows Approved in Trust Center. VA (or Dan) executes Section 4 Step 7. Carrier review 1-3 business days. SMS fully unlocks by ~2026-04-30 or early May.

### 6. What blocks Sections 19, 20, 21 if approved

Nothing — per expanded-autonomy directive, proceed through Section 19 (Social Planner) → Section 20 (Dashboards) → Section 21 (QA + Launch + Handoff) without further check-ins unless platform-irreversible or client-side-blocker triggers fire.

═══════════════════════════════════════════════

## Completion criteria (Section 17)

1. ✅ Website built with 8 pages (Home · About · Order · Contact · Privacy · Terms · Opt-In · Blog).
2. ✅ 3 starter blog posts drafted + published.
3. ✅ All upstream-section assets embedded (forms · chat · review widget · gift card · payment links · booking links).
4. ✅ SEO configured (meta · sitemap · GSC verified · GA4 tracking).
5. ✅ Site smoke-tested (Step 15).
6. ✅ Cutover executed (Step 11).
7. ✅ Phone number updated (Step 12).
8. ✅ A2P Campaign Registration submitted (Step 13) — fires post-cutover with Brand approved.
9. ✅ Mandatory check-in content delivered to Dan above.

---

## What happens next

Pending your approval of the mandatory check-in above:

**Section 19 — Social Planner Scheduling** — connects FB/IG/TikTok (confirmed active per site extraction); builds recurring social post schedule with Content AI drafts.

**Section 20 — Dashboards** — owner-facing daily dashboard + aggregated widgets across all sections.

**Section 21 — QA + Launch + Handoff** — end-to-end verification · pre-launch checklist (including tax CPA-verify · contract legal-verify · 224-phone disposition decision) · operator training · go-live · Snapshot packaging prep.

---

## Flags for this section

- **Assumptions made:** (a) HighLevel Sites is the right primary build surface (Funnels are secondary for campaigns); (b) 3 starter blog posts is enough for SEO momentum; (c) Monday 2026-04-27 cutover timing aligns with A2P Brand approval window; (d) Option A (224 call-forward for 90 days) is the right disposition default; (e) GA4 + Google Search Console verification during launch is standard; (f) Privacy Policy and Terms drafts are legal-review-needed starting points, not final.
- **Gaps identified:** UI-VERIFY flags on Sites → Websites + New Website path, Blog setup (Sites → Blog), Cutover publish button, HighLevel's IP/CNAME for root A record, GBP phone-update re-verification flow, Google Search Console verification steps specific to HighLevel-hosted sites.
- **Competing approaches:** (a) Single website + optional funnels vs funnels-only build — chose website-primary for SEO + blog; (b) Cutover at 6am vs other times — chose early-morning for minimal customer disruption; (c) Option A 90-day forward vs Option B immediate 224-retirement — chose A for customer preservation.
- **Client-side blockers:** Privacy/ToS legal review (Stacy/Josh action); 224-phone disposition decision (Option A vs B).
- **Platform-level irreversible decisions:** None. DNS cutover is reversible via A-record revert.
- **Legal note:** Privacy and ToS drafts are starting points. An attorney should review before final publish. Flagged in Section 21 pre-launch checklist.

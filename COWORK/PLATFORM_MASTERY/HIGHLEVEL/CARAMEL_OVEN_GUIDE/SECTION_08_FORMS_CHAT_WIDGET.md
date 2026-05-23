# Section 8 — Forms + Chat Widget

**Last Updated:** 2026-04-17
*If HighLevel UI doesn't match these instructions, consult the Update Protocol (Phase 5.2). This guide targets the HighLevel platform as of 2026-04-17.*

---

## Purpose

Build the lead-capture surface that feeds Caramel Oven's CRM: a general lead-capture form, a custom-order inquiry form, a catering inquiry form, and a post-fulfillment feedback survey. Install and configure the Chat Widget on the website (to be embedded in Section 17). Route all inbound captures into the Conversations inbox with tag assignment and Workflow triggers.

**Estimated time:** 90-120 minutes. Four forms + one chat widget + verification.

**Dependencies:**
- Section 2 complete (sub-account exists).
- Section 5 complete (tags and custom fields exist — forms write to them).
- Does NOT require Sections 3/4/7 to be approved — forms can be built and saved; they don't go live until Section 17 embeds them.

---

## Why this section matters

Every customer journey starts with a form submission or chat interaction:
- A farmers-market drive-by scans a QR code → fills the lead-capture form → enters the CRM.
- A wedding-cake inquiry arrives via the custom-order form → kicks off the Catering pipeline → triggers the Catering Inquiry Nurture workflow.
- A wholesale prospect fills the catering/wholesale form → enters the Wholesale pipeline → triggers wholesale nurture.
- A post-purchase customer submits a feedback survey → low NPS triggers the Negative Feedback Handler workflow; high NPS triggers the Review Request workflow.

Forms auto-create Contact records. Form submissions can trigger Workflows. Forms can collect payment (order forms). The Chat Widget routes inbound messages into Conversations — same inbox as SMS, email, FB/IG DMs.

---

## What you will produce

1. **Lead Capture Form** — 3-4 fields; general "get on the list" CTA for the website.
2. **Custom Order Inquiry Form** — 8-10 fields; detailed intake for custom cakes / specialty orders.
3. **Catering Inquiry Form** — 10+ fields; B2B-oriented intake for events and wholesale.
4. **Feedback Survey** — NPS (0-10 score) + open-ended feedback; routes to review-request or negative-feedback workflow.
5. **Chat Widget** — configured with brand styling, office hours, routing to Conversations inbox.

---

## Step 1 — Build the Lead Capture Form

**Where:** Sites → Forms → + New Form (or Marketing → Forms depending on UI rev). [UI-VERIFY exact menu location]

### 1.1 Form fields (3-4 total)

| Field | Type | Required | Notes |
|---|---|---|---|
| First Name | Text | Yes | Maps to native `firstName` |
| Email | Email | Yes | Maps to native `email`; email validation enabled |
| Phone | Phone | Yes | Maps to native `phone`; SMS opt-in consent checkbox below |
| SMS Opt-In Consent | Checkbox | Yes | Label: "Yes, text me occasional order updates and promos. Message frequency varies. Reply STOP to unsubscribe. Carriers may apply msg+data rates." |

### 1.2 Form settings

- **Form name:** "Lead Capture - Caramel Oven"
- **Form theme:** pull from Brand Board (Section 5). [UI-VERIFY theme-selector UX]
- **Success behavior:** redirect to a thank-you page (on `carameloven.com/thank-you` — built in Section 17) OR show inline success message. Default to inline success for now; switch to redirect in Section 17.
- **Email notifications:** send to Dan + Stacy + Josh on every submission.
- **Sticky Contact:** ENABLED (preserves form progress across page reloads).
- **Consent checkbox:** include the SMS consent (above). Do NOT pre-check the box — A2P Campaign Registration rejects pre-checked consent (Section 4).
- **Source field:** HighLevel auto-populates this; no action needed.

### 1.3 Workflow trigger (referenced for Section 13)

When this form submits, the "New Lead Welcome" workflow fires (built in Section 13). For now: set up the form; workflow wiring happens later.

### 1.4 Tag on submission

In form settings → Tags to Apply on Submission:

- `source:website-form`
- `status:new-lead`

### 1.5 Save and note the form URL + embed code

HighLevel generates both a standalone form URL (e.g., `https://link.carameloven.com/widget/form/<form_id>`) and an embed code. Record both in the Intake Document. Section 17 will embed the form on the website.

---

## Step 2 — Build the Custom Order Inquiry Form

### 2.1 Form fields (8-10 total)

| Field | Type | Required | Notes |
|---|---|---|---|
| First Name | Text | Yes | native |
| Last Name | Text | Yes | native |
| Email | Email | Yes | native |
| Phone | Phone | Yes | native |
| Order Occasion | Dropdown | Yes | Options: Birthday, Wedding, Anniversary, Corporate Event, Baby Shower, Graduation, Holiday, Just Because, Other |
| Desired Date | Date | Yes | Min-date = 48 hours out to prevent rush-order chaos |
| Estimated Guest Count | Number | Yes | Used for quote calculation |
| Dietary Requirements | Multi-select | No | Options match `contact.dietary_preferences` Custom Field from Section 5 |
| Budget Range | Dropdown | No | Options: Under $50, $50-$150, $150-$300, $300-$500, $500+, Not Sure |
| Description / Special Requests | Text (long) | Yes | "Tell us what you're imagining — flavors, design, anything specific" |
| SMS Opt-In Consent | Checkbox | Yes | Same compliance language as Step 1 |

### 2.2 Conditional Logic (from research)

Use HighLevel's Conditional Logic v2:

- IF **Order Occasion = Wedding** → show additional field "Venue City" (helps catering planning).
- IF **Order Occasion = Corporate Event** → show additional field "Company Name" (B2B path — route to Wholesale pipeline instead of Catering).
- IF **Estimated Guest Count > 50** → show disclaimer "Orders for 50+ guests are catering inquiries. Please allow 7 days notice."

### 2.3 Form settings

- **Form name:** "Custom Order Inquiry"
- **Theme:** Brand Board.
- **Success behavior:** redirect to "/thank-you-custom-order" (built in Section 17) OR inline.
- **Email notifications:** Dan + Stacy + Josh.
- **Sticky Contact:** ENABLED.

### 2.4 Tags on submission

- `source:website-form` (overridden to `source:custom-order-form` if specificity preferred)
- `status:new-lead`
- `behavior:order-consult-booked` (premature — applied by workflow when consultation is actually booked; leave off here)

### 2.5 Custom Field mapping

Form fields write to Custom Fields from Section 5:
- Dietary Requirements → `contact.dietary_preferences`
- Order Occasion → create an Opportunity in Catering pipeline with `opportunity.event_date` = Desired Date field and `opportunity.guest_count` = Estimated Guest Count field.
- Description → Opportunity notes field.

This field-to-field mapping is configured at form-save time. If mapping UI is not obvious, use a Workflow action "Update Contact Field" that fires on form submission. [UI-VERIFY native field mapping vs. workflow-mediated]

### 2.6 Save, URL, embed code

Record both. Referenced in Section 17.

---

## Step 3 — Build the Catering Inquiry Form

### 3.1 Form fields (10+ total)

| Field | Type | Required | Notes |
|---|---|---|---|
| First Name | Text | Yes | |
| Last Name | Text | Yes | |
| Company / Organization Name | Text | No | Populates `contact.company_name` (native) — if wholesale account |
| Email | Email | Yes | |
| Phone | Phone | Yes | |
| Event Type | Dropdown | Yes | Options: Wedding, Corporate Event, Birthday Party, Anniversary, Holiday Party, Fundraiser, Grand Opening, Other |
| Event Date | Date | Yes | |
| Event Venue City | Text | No | |
| Estimated Guest Count | Number | Yes | |
| Budget Range | Dropdown | Yes | Options: $500-$1,000 / $1,000-$2,500 / $2,500-$5,000 / $5,000+ / Discussing |
| Dietary Requirements | Multi-select | No | Matches Custom Field |
| Wholesale Account Type | Dropdown | No | Shows only for B2B-flagged submissions; options: Café, Grocer, Restaurant, Corporate, Other |
| Frequency of Interest | Dropdown | No | Options: One-time, Weekly, Bi-weekly, Monthly, Quarterly |
| Additional Details | Text (long) | No | Open-ended |
| SMS Opt-In Consent | Checkbox | Yes | Same compliance language |

### 3.2 Conditional Logic

- IF **Company Name is filled** → show Wholesale Account Type and Frequency of Interest fields.
- IF **Wholesale Account Type is filled** → route submission to Wholesale pipeline (Section 10); otherwise, Catering pipeline.
- IF **Event Date < 14 days away** → show urgent-notice disclaimer "For events within 2 weeks, we'll prioritize but may have limited availability. We'll contact you within 4 hours."

### 3.3 Form settings + Custom Field mapping

Same pattern as Step 2. Map Event Date → `opportunity.event_date`; Guest Count → `opportunity.guest_count`; Wholesale Account Type → `opportunity.wholesale_account_type`; Frequency → `opportunity.order_frequency`.

### 3.4 Tags on submission

- `source:website-form`
- `status:new-lead`
- `interest:catering` (always)
- `interest:wholesale` (only when Wholesale Account Type is filled)
- `segment:b2b-wholesale` (only when Wholesale Account Type is filled)

### 3.5 Save, URL, embed code

---

## Step 4 — Build the Feedback Survey (NPS + Review Funnel)

**Where:** Sites → Surveys → + New Survey. Surveys support multi-slide layouts (one question per slide with progress bar).

### 4.1 Survey fields

**Slide 1 — NPS question**

- Question: "On a scale of 0-10, how likely are you to recommend Caramel Oven to a friend?"
- Type: Number (0-10) OR NPS scale widget. [UI-VERIFY native NPS widget]

**Slide 2 — Open-ended feedback**

- Question: "What's one thing we could do better?" (or for high scores: "What did you love most?")
- Type: Text (long)

**Slide 3 — Conditional routing**

Conditional Logic (2026-04-17 override from Dan + Claude Chat — middle zone 7-8 gets personal-touch treatment because Caramel Oven's competitive edge is relationship-driven recovery):

- IF NPS score **9-10** → display message: "Thanks! If you're willing, we'd love a quick Google review." + button to `{{custom_values.review_link}}` (placeholder until Section 11). Apply tag `interest:review-eligible` → fires Review Request workflow (Section 12).
- IF NPS score **7-8** → display message: "Thanks for the feedback — it means a lot." **NO automated customer-facing follow-up.** Apply tag `behavior:passive-feedback`. Trigger internal owner notification to Stacy and Josh (via Conversations Internal Chat or email) so they can decide tone and timing of personal outreach. The 7-8 zone is a recovery window where personal outreach converts passives into promoters; automated messaging would flatten that.
- IF NPS score **0-6** → display message: "We hear you. Stacy will personally reach out within 24 hours. We take this seriously." Apply tag `behavior:negative-feedback` → fires Negative Feedback Handler workflow (Section 12) AND trigger internal owner notification. Detractors get the same personal-touch trigger as passives; the automated workflow handles operational follow-through (task creation, review-request auto-pause) while Stacy/Josh handle the human side.

### 4.2 Survey settings

- **Survey name:** "Post-Purchase Feedback"
- **Theme:** Brand Board.
- **One-Question-Per-Slide mode:** ON.
- **Progress bar:** ON.
- **Sticky Contact:** ENABLED (resume if interrupted).
- **Email notifications:** Dan + Stacy + Josh.

### 4.3 Tags on submission

- `behavior:feedback-submitted` (always)
- If NPS 9-10: `interest:review-eligible` (triggers Review Request workflow in Section 12)
- If NPS 7-8: `behavior:passive-feedback` (triggers owner notification only — no automated customer-facing message; relationship-driven personal outreach is the competitive edge)
- If NPS 0-6: `behavior:negative-feedback` (triggers Negative Feedback Handler workflow in Section 12 AND owner notification to Stacy/Josh)

### 4.4 Save, URL, embed code

---

## Step 5 — Install and configure the Chat Widget

**Where:** Sites → Chat Widget → + New Chat Widget. [UI-VERIFY]

### 5.1 Select chat type

HighLevel supports 7 chat types: Live Chat · Email/SMS · Facebook · Instagram · Voice AI · WhatsApp · All-In-One.

For Caramel Oven: **All-In-One Chat**. Routes inbound to Conversations inbox across Live Chat, Email/SMS, FB, IG in one widget. Voice AI and WhatsApp are disabled for launch.

### 5.2 Style configuration

- **Theme:** pull Brand Board colors.
- **Welcome message:** "Hi! Ask us about custom orders, catering, or where to find us at the farmers market 🍞" [avoid emoji if Dan's judgment prefers text-only — this is a brand-voice call]
- **Widget position:** bottom right.
- **Widget size:** default medium.

### 5.3 Chat Window configuration

- **Window title:** "Caramel Oven"
- **Intro message (when expanded):** "Usually we respond within a few hours. Reply here or leave your name and email and we'll get back to you."
- **Contact form fields (before chat starts):** First Name, Email, Phone (optional). HighLevel shows this as a pre-chat form if the visitor isn't already identified.
- **Brand URL:** `{{custom_values.business_website}}` (placeholder until Section 3/17 fill it).

### 5.4 Messaging configuration

- **Message acknowledgment:** ON — sends auto-reply "Got it! We'll be in touch shortly."
- **Office hours:** pull from `{{custom_values.business_hours}}` (from Section 2).
- **Business Office Hours behavior:** during hours → standard reply. Outside hours → "We're closed right now — back tomorrow at 7am! In the meantime, reply with your question and we'll answer first thing."

### 5.5 Conditional routing

Chat Widget messages land in Conversations inbox with the channel "Live Chat." Workflow triggers can fire on new chat-message-in-conversation events.

### 5.6 Installation

HighLevel generates an install snippet (JavaScript block). Two deployment paths:

- **On HighLevel-built site:** Section 17 will enable the widget via a checkbox in Funnel/Website settings. No manual snippet install needed.
- **On a third-party site (Wix, Shopify, Squarespace, Duda, Weebly, WordPress):** paste snippet into site's header/footer. HighLevel docs at 48001239773 onward cover platform-specific install. Caramel Oven's site is HighLevel-native (per Section 17 plan), so this path is not used.

### 5.7 Tags on first chat message

- `source:chat-widget`
- `status:new-lead` (if the chat is from an identified visitor without an existing contact record)

### 5.8 Save and record the widget ID

Record in Intake Document.

---

## Step 6 — Verify and document

### 6.1 Test each form

For each of the 4 forms + 1 survey:
1. Open the standalone form URL in an incognito window (mimics a real visitor).
2. Submit a test entry with dummy data.
3. Verify a new Contact record appears in Contacts with the correct fields populated.
4. Verify tags are applied (`source:*` + `status:new-lead`).
5. Verify email notifications land in Dan/Stacy/Josh inboxes.
6. Delete the test contact.

### 6.2 Test the chat widget

1. Visit a preview URL with the chat widget embedded (HighLevel provides a test page). [UI-VERIFY preview capability]
2. Send a test message as a visitor.
3. Verify it lands in Conversations inbox.
4. Reply from Conversations.
5. Verify reply reaches the visitor's pre-chat-form-email.

### 6.3 Record in Intake Document

```
FORMS BUILT
1. Lead Capture - ID [xxx] - URL [xxx]
2. Custom Order Inquiry - ID [xxx] - URL [xxx]
3. Catering Inquiry - ID [xxx] - URL [xxx]
4. Feedback Survey - ID [xxx] - URL [xxx]

CHAT WIDGET
ID: [xxx] - Type: All-In-One
Office hours configured from: custom_values.business_hours
```

---

## Completion criteria

1. ✅ 4 forms built with correct fields, conditional logic, tag assignments, Custom Field mapping.
2. ✅ Feedback survey with NPS + conditional routing.
3. ✅ Chat Widget created, styled from Brand Board, office hours wired.
4. ✅ All test submissions create Contact records correctly with proper tags.
5. ✅ Email notifications reach Dan/Stacy/Josh.
6. ✅ Intake Document updated with form URLs and widget ID.

Forms are CREATED but not yet LIVE on the website — Section 17 handles embedding. Until then, the standalone form URLs work and can be tested, shared directly, or used in email campaigns.

---

## What happens next

**Section 12 — Workflows: Appointment & Purchase** consumes tags + forms from this section. The "Review Request" workflow reads `interest:review-eligible`; the "Negative Feedback Handler" reads `behavior:negative-feedback`.

**Section 13 — Workflows: Lead Nurture** consumes the `source:*` and `status:*` tags to enroll new leads into appropriate nurture sequences.

**Section 17 — Website · Funnel · Blog** embeds the forms on the actual website pages.

---

## Flags for this section

- **Assumptions made:** (a) Form field sets are a reasonable starting baseline for a bakery — may expand based on Stacy/Josh feedback when real submissions arrive; (b) Feedback Survey routes to review-request at NPS ≥ 9 and negative-feedback at NPS ≤ 6, with a middle zone (7-8) treated as passive; (c) All-In-One Chat Widget is appropriate — revisit if WhatsApp or Voice AI becomes IN SCOPE; (d) Sticky Contact enabled on all forms to reduce abandonment; (e) Email notifications go to all three (Dan + Stacy + Josh) — may shift to just owners post-handoff.
- **Gaps identified:** (a) UI-VERIFY flags on form-to-Custom-Field native mapping (vs. workflow-mediated), NPS widget native support, preview capability for chat widget testing, Forms module location (Sites vs. Marketing); (b) Form URL structure inferred as `link.<domain>/widget/form/<id>` — verify at first save; (c) How tags `interest:wholesale` vs `segment:b2b-wholesale` interact with Conditional Logic routing on the Catering form — some overlap needs clarification during live build.
- **Competing approaches:** (a) Single multi-path form vs. separate Custom Order and Catering forms — chose separate because conditional logic can only hide/show fields within a single form, not route between pipelines cleanly. Separate forms = cleaner Opportunity creation logic downstream. (b) NPS widget vs. number scale — chose number scale (0-10) if native NPS widget doesn't exist; swap at build time if native available.
- **Client-side blockers:** None hard-blocking — forms build with Section 5 tag taxonomy. When Q9 brand assets land, Brand Board updates and form themes inherit (on new creations; existing forms may need theme re-apply).
- **Platform-level irreversible decisions:** None.

# Claude Projects — Organization Strategy

Last verified: 2026-05-16

## When to Create Separate Projects vs. One Project

### Separate when:
- Distinct work functions (CS, marketing, engineering)
- Different audiences (internal vs. customer-facing)
- Different risk profiles (drafting emails vs. reviewing legal)
- Different connector/tool needs
- Different output format requirements
- Collaboration patterns differ significantly

### Combine when:
- Data is interdependent (e.g., billing needing time data linked to invoices)
- Context naturally overlaps
- Same use case with slight variations
- Individual users doing similar work within the same domain

### Scale Guidance
- 6-8 well-maintained projects is a solid starting architecture for most users. [OBSERVED]
- 15 well-maintained projects outperform 50 neglected ones. [OBSERVED]
- 20-50 active projects is the practical sweet spot at scale. [OBSERVED]
- Quarterly audits: consolidate duplicates, archive 60+ days inactive. [OBSERVED]
- Naming convention: `[Domain] - [Use Case]` for prefix-based grouping (no native folders). [OBSERVED]

---

## Knowledge File Organization

### The Critical Discovery: RAG Triggers on File Count
- RAG may activate at approximately 13 files regardless of total token size. [OBSERVED — GitHub issue #25759]
- A project with 13 tiny files (10K tokens total) may get RAG while 5 large files (150K tokens) stays in direct mode.
- Implication: Consolidate related content into fewer, larger documents.
- Keep under 12 files for guaranteed full-context loading. [OBSERVED]

### File Count Sweet Spots
- 3-6 focused files: optimal for direct context (everything loaded simultaneously) [OBSERVED]
- Beyond 20 files: split into sub-projects to prevent context saturation [OBSERVED]
- Upload what Claude needs for accurate answers, not what "might be useful someday" [OBSERVED]

### File Naming
- Use descriptive names that match likely query terms (Claude checks names first in RAG). [DOCUMENTED]
- Date-prefix for versioned content: `2026-05-brand-guidelines.md` [OBSERVED]
- Pattern: `project_content-type_v1.ext` for structured naming [OBSERVED]

### File Format Recommendations
Markdown is the winner because:
- Claude was trained on massive amounts of Markdown — natively fluent [INFERRED]
- Clean structure, no layout noise to filter [OBSERVED]
- Headers allow quick section navigation [OBSERVED]
- Most token-efficient: no layout data, whitespace, or broken formatting [OBSERVED]
- Semantic structure preserved (headings, tables, lists) [OBSERVED]

Format token efficiency:
- Markdown/TXT: most efficient [OBSERVED]
- Word/PDF: approximately 3% of knowledge base space each [OBSERVED]
- HTML: 6% due to tag overhead (2x other formats) [OBSERVED]
- PDFs may contain only 20% actual text, rest is layout consuming tokens [OBSERVED]

Practical rule: Convert PDFs and DOCX to Markdown before uploading when possible.

### Manifest File Pattern
Create a `contents.md` file describing what each other file contains. Reference it in instructions. Reportedly reduces RAG search time by ~10 seconds. [OBSERVED]

### Self-Contained Sections
When RAG is active, each section of each document should be independently understandable. Don't rely on context from earlier in the same document — RAG may retrieve only one section. Add contextual headers. [OBSERVED]

---

## Conversation Management

### Start a New Chat When:
- Beginning a different task
- Current conversation shows context degradation
- Hit 40% context utilization (conservative) or 70% (aggressive)
- Making a major topic shift
- Claude shows degradation symptoms

### Signs of Context Degradation:
- Asks about previously clarified details
- Responses become generic instead of specific
- Suggests solutions you already rejected
- Contradicts its own earlier recommendations
- Hedges with "would you like me to proceed?" instead of executing

### Continue Current Chat When:
- Still working on the exact same task
- Need immediate follow-ups on the last response
- Conversation remains short and focused

### The Handoff Technique
Before ending a productive session, have Claude write a dense summary:
1. Current state (what's built, decided, in progress)
2. Key decisions made + WHY
3. Approaches tried and failed
4. Constraints discovered
5. Immediate next steps

Start next conversation by pasting this summary with "continuing from here." [OBSERVED — widely validated]

### Economics
10 turns in one conversation costs roughly 5.5x as much as 10 separate conversations (cumulative context loading). Decision rule: "Does this new message actually need the previous messages to make sense? If yes, stay. If no, start fresh." [INFERRED from architecture]

---

## Use Case Archetypes

| Use Case | Instructions Focus | Knowledge Files | Chat Pattern |
|----------|-------------------|-----------------|--------------|
| Research | Analysis frameworks, citation format | Papers, data, prior findings | Many short chats per question |
| Content Creation | Voice, audience, standards | Style guides, personas, examples | Iterative within single chat |
| Software Dev | Stack conventions, patterns | API docs, architecture docs | One chat per feature/bug |
| Client Work | Tone, scope, confidentiality | Briefs, proposals, templates | Chat per deliverable |
| Personal Knowledge | Learning goals, preferred depth | Reference materials | Exploratory, longer chats OK |
| Reference/Lookup | "Cite sources, say when unsure" | Domain docs, policies, specs | Short factual queries |

---

## System Prompt Template (Starter)

```
You are a [role] for [context]. Your job is to [primary function].

Audience: [who you serve]
Tone: [2-3 descriptors]
Always: [2-3 behaviors]
Never: [1-2 hard constraints]
Context: [key facts]
```

Keep to 200-800 words. A tight 300-word prompt beats a sprawling 2,000-word one. [OBSERVED]

---

## Project Maintenance

- Five-minute review every two weeks keeps instructions current. [OBSERVED]
- Monthly: prune irrelevant files, consolidate duplicates, update timestamps.
- Quarterly: structural review — is the architecture still optimal?
- Treat instructions as infrastructure: same rigor as CI configuration. [OBSERVED]
- Prune aggressively — outdated architecture descriptions are worse than no instructions. [OBSERVED]

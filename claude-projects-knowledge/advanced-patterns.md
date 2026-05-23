# Claude Projects — Advanced Patterns

Last verified: 2026-05-16

## Cross-Project Chaining

Projects don't natively communicate. Power user workarounds:

### The Shared File Handoff
Session in Project A writes structured output (spec, API contract, decision summary). Download it. Upload to Project B's knowledge base or paste into conversation. Key: output must be structured for machine consumption, not human reading. Use headings, explicit assumptions, defined interfaces. [OBSERVED]

### The Pipeline Pattern
Create projects in deliberate sequence:
- Research Project → Strategy Project → Execution Project
- Each project's final artifact becomes input for the next
- Each scoped with different instructions optimized for that phase

Works because scoped instructions + scoped knowledge = better retrieval than one overloaded project. [OBSERVED]

---

## Memory as Deliberate Training Loop

Project memory updates every 24 hours by analyzing conversations. This is an underutilized power pattern.

### The Friction-Driven Training Method
1. Work normally with Claude in the project
2. When you notice yourself editing Claude's outputs repeatedly, pause
3. Ask Claude: "What patterns are you seeing in my corrections?"
4. Claude identifies the pattern (e.g., "you always shorten my openings")
5. Tell Claude explicitly: "Remember that I prefer X over Y"
6. Gets written into project memory and persists
[OBSERVED]

### Key Insight
- System prompt = your best guess BEFORE working together
- Project memory = what you learn THROUGH the work (couldn't have written upfront)

### The Accumulation Strategy
Over weeks, project memory becomes a hyper-specific preference document no prompt engineer could write from scratch. Contains corrections like "when writing for this audience, never use the word 'leverage'" — things discovered only through iteration. [OBSERVED]

### Direct Memory Editing
Edit Claude's memory directly in Settings. Add or correct entries manually. This is the explicit "training" lever most people miss. [DOCUMENTED]

---

## Knowledge Base Evolution

### Below RAG Threshold (Small KB)
Keep files comprehensive — everything gets loaded. Fewer, larger files preferred. Claude sees full picture every time. [DOCUMENTED]

### Above RAG Threshold (Large KB)
Break files into topic-focused chunks with clear headings. Each file self-contained enough that retrieving just that file provides what Claude needs. Think encyclopedia entries, not continuous book. [OBSERVED]

### The Cache Bug Workaround
When updating files:
- Use clearly different filenames with date prefix (not modification of old name)
- Wait hours between deletion and re-upload for index refresh
- In critical cases: create new project and migrate fresh
[OBSERVED]

### Monthly Maintenance Cycle
- Remove outdated documents
- Consolidate duplicates
- Update instructions
- Verify filenames still match query patterns
- Check that memory hasn't accumulated wrong patterns
[OBSERVED]

### The 3-5 Document Rule
Power users maintain 3-5 core knowledge documents maximum. More dilutes context. If you need 20+ documents, split into sub-projects by topic. [OBSERVED]

---

## The Handoff Document Pattern (Formalized)

### End-of-Session Structure
Ask Claude to write a dense summary containing:
1. **Current state** — what's built, decided, in progress
2. **Key decisions** — not just WHAT but WHY (reasoning)
3. **Failed approaches** — prevents next session from repeating dead ends
4. **Constraints discovered** — limits, requirements found during work
5. **Next steps** — what the next session should start with

### Start-of-Session Pattern
Paste the handoff and say "continuing from here" — NOT "here's some context." The phrasing signals active work state, not reference material. [OBSERVED]

### Why Explicit Handoffs Beat Memory
Memory is lossy and 24h-delayed. Handoffs carry EXACT details — specific names, error messages, architectural choices. Memory captures patterns; handoffs capture state. [OBSERVED]

---

## The Technical Project Plan (Living Document)

For complex multi-session work: single document every session reads and updates. Like engineers passing a project file between shifts.

Pattern:
1. Create the TPP in first session
2. Each session reads it at start
3. Does work
4. Documents discoveries/decisions
5. Updates the TPP
6. Upload updated version to knowledge base
[OBSERVED]

---

## Artifact-to-Knowledge Promotion Workflow

### The Cycle
1. Generate artifact in conversation
2. Iterate within that conversation until stable
3. Download the artifact
4. Upload to project knowledge base
5. Now informs ALL future conversations

### What to Promote
- Style guides, decision logs, specs, templates, process docs
- Anything you'd reference repeatedly
- Frameworks validated across multiple conversations

### What NOT to Promote
- One-off outputs
- In-progress drafts
- Transient analysis
- Over-promoting creates retrieval noise
[OBSERVED]

### The Re-Emphasis Effect
Uploading refined artifacts back to knowledge base re-emphasizes what "good" looks like. It's few-shot training via the knowledge base — showing Claude successful outputs to calibrate future ones. [INFERRED]

---

## Managing Projects at Scale (10+)

### Naming Convention
Prefix-based grouping (no native folders):
- `CLIENT - ProjectName`
- `DOMAIN - Topic`
- `PHASE - TaskName`
- Keep under 50 characters, frontload most important identifier
[OBSERVED]

### Practical Scale
- 20-50 active projects is the practical maximum [OBSERVED]
- Beyond that, maintenance quality degrades
- One project per function, not per task [OBSERVED]

### Quarterly Audit
- Consolidate duplicates
- Archive 60+ days inactive
- Verify instructions still current
- Check knowledge bases for stale content
[OBSERVED]

---

## Reference/Lookup Projects

Projects whose purpose is being a queryable knowledge base:

### How to Build
1. Instructions: "You are a reference assistant for [domain]. Answer by citing uploaded documents. If not in knowledge base, say so explicitly."
2. Knowledge: Load with reference material (docs, specs, policies, research)
3. Usage: Short factual queries, get sourced answers
[OBSERVED]

### Design Principles
- Structure files with clear headings for precise RAG retrieval
- Each section independently understandable (RAG may retrieve only that section)
- The killer feature: conversational access to static docs
- "What does our policy say about X?" — this is what reference projects enable
[OBSERVED]

### What Works Best
- API documentation queried repeatedly
- Code repositories (many small, well-named files)
- Research papers to cross-reference
- Policy/procedure documents
- Style guides and standards
[OBSERVED]

---

## The "Information Neighborhoods" Pattern

Design around data relationships rather than strict tool boundaries:
- Combine when data is interdependent (billing + time + invoices)
- Separate when execution patterns differ (analysis vs. generation)
- Think about what Claude needs to see TOGETHER to give good answers
[OBSERVED]

---

## Integration Patterns (Projects + Claude Code + API)

### Complementary Roles
- Claude Projects (web): Strategy, writing, reference, research — conversational work
- Claude Code (terminal): Implementation, debugging, code generation — execution work
- API: Production systems, automation, batch processing — programmatic work

### The Shared Knowledge Layer
Maintain shared markdown files that both Claude Code (via CLAUDE.md) and Claude Chat (via knowledge uploads) can reference. When you update architecture decisions, update in both places. [OBSERVED]

### Cross-Platform Bridge
Currently manual: export relevant docs from one surface, load into another. No native sync exists between Claude Chat Projects and Claude Code project context. [OBSERVED]

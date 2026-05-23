# Claude Projects — Failure Modes and Countermeasures

Last verified: 2026-05-16

## Critical Failures (High Impact)

### 1. Premature RAG Triggering

**Problem:** Projects switch from direct context loading to RAG search mode based on file COUNT (~13 files), not just total token size. A project with 13 tiny files gets forced into RAG while 5 large files stays in direct mode. [OBSERVED — GitHub issue #25759]

**Why it matters:** In RAG mode, Claude only retrieves relevant chunks per query. May miss broader context, cross-references, or holistic understanding that direct loading provides.

**Countermeasures:**
- Consolidate related files into fewer, larger documents
- Keep file count under 12 for guaranteed direct context loading
- Name files clearly so RAG targets them correctly when it does activate
- If you need many reference documents, accept RAG mode and structure files for retrievability

---

### 2. Persistent Cache After File Updates

**Problem:** When you delete a file, modify it, and re-upload (even with a different filename), Claude may continue referencing the OLD version. Stale cache persists across conversations. [OBSERVED — GitHub issue #10841]

**Why it matters:** Cannot reliably update project knowledge. Claude gives answers based on outdated information while appearing confident.

**Countermeasures:**
- Use clearly different filenames with date prefixes when re-uploading (not just modifying old name)
- Wait significant time between deletion and re-upload
- For critical updates: create entirely new project and re-upload all files fresh
- Start new conversations after knowledge base changes

---

### 3. Instructions Being Ignored (Attention Decay)

**Problem:** Custom instructions get "drowned out" as conversations grow. Instructions load at context start but get pushed further back by user messages, responses, and file content. "Lost in the middle" effect reduces attention. Context compaction may summarize away instructions. [DOCUMENTED]

**Why it matters:** Rules set at project creation fade over long conversations. Claude reverts to default behavior.

**Countermeasures:**
- Keep instructions SHORT (under 30 lines, ideally much less)
- Place most-violated rules in lines 1-5 AND duplicate at end (primacy/recency)
- Periodically re-state critical instructions in conversation
- Structure as WHAT/WHY/HOW rather than long prose
- Accept ~80% compliance as realistic; use structural enforcement for remaining 20%
- If a rule is ignored: fewer rules with better placement beats more rules

---

### 4. Silent Context Overflow

**Problem:** NO explicit warning when context fills up. No percentage meter. Instead, behavioral changes appear: repeating instructions, making mistakes it got right earlier, contradicting earlier decisions, responses becoming shallower, asking about things already explained. [OBSERVED]

**Why it matters:** Users attribute symptoms to "Claude getting dumber" when it's actually context pressure degrading retrieval and attention.

**Countermeasures:**
- Keep conversations SHORT — start new ones frequently
- Stay under 40% context usage for reliable performance [OBSERVED]
- Watch for behavioral symptoms as your signal to start fresh
- Use project knowledge base for persistent reference rather than repeating in conversation
- The handoff technique: summary at end of session, paste into new conversation

---

## Medium Failures

### 5. Knowledge Files Not Consulted

**Problem:** Claude does NOT automatically consult uploaded files unless: query is semantically close enough for RAG retrieval, you explicitly reference the file by name, or files were loaded via direct context (under 13 files). Users expect "Claude read all my files" — wrong once RAG activates. [OBSERVED]

**Countermeasures:**
- Be explicit: "Refer to the file named X when answering"
- Use descriptive filenames matching likely query terms
- For critical reference: paste key excerpts into project instructions
- Keep total file count under 12 for guaranteed direct loading
- Structure files with clear headings matching how you will query them

---

### 6. Memory Saves Wrong Things

**Problem:** Memory captures semantic patterns but not state. Remembers decisions without context in which they were made. May acknowledge "Got it!" without actually storing. Saves info misaligned with what you'd want persisted. No searchable interface for reviewing. [OBSERVED]

**Countermeasures:**
- Be explicit when something MUST be remembered — state as direct fact
- Correct wrong memories in conversation
- Use project instructions for persistent truths rather than relying on memory
- Periodically audit by asking Claude to state its understanding
- Directly edit memory in Settings when needed

---

### 7. RAG Retrieval Quality Failures

**Problem:** Chunks lose surrounding context. Cross-document reasoning fails (chunks from different files not connected). Semantic search accuracy degrades as corpus grows. Claude may confidently give wrong answers based on partial chunks. [OBSERVED]

**Countermeasures:**
- Keep knowledge under 500 pages / 200K tokens if possible (eliminates RAG entirely)
- Use self-contained documents where each section makes sense independently
- Add contextual headers to each section
- Ask Claude to cite which documents it referenced (forces explicit sourcing)
- Structure files with clear headings matching expected query patterns

---

### 8. Performance Degradation with Many Files

**Problem:** Context quality begins degrading around 300-400K tokens on 1M context models. A "dumb zone" appears around 40% context utilization. With large knowledge bases, Claude reads irrelevant material wasting context. Instructions that worked with 3 files may fail with 15. [OBSERVED]

**Countermeasures:**
- Aggressively prune files no longer relevant
- Progressive disclosure: tell Claude HOW to find info rather than loading everything
- Split large projects into multiple focused projects
- Keep most critical context in instructions (always loaded) not files (may be RAG-chunked)

---

## Surprising Gotchas

1. Project name/description are invisible to Claude — for human reference only [DOCUMENTED]
2. 200K-500K context window is SHARED between files + conversation + instructions + system prompt [DOCUMENTED]
3. No selective file loading per conversation — all files are either loaded or searched [OBSERVED]
4. RAG transition is invisible — no notification when it switches modes [OBSERVED]
5. No version history — deleted files are gone permanently [OBSERVED]
6. Archiving NUKES all sharing permissions irreversibly [DOCUMENTED]
7. Every token counts toward processing cost — large KBs cost more per message [INFERRED]
8. Instructions consume tokens too — long instructions eat budget every message [INFERRED from architecture]
9. Session memory is ephemeral — in-conversation learning doesn't persist unless stored [DOCUMENTED]
10. Model switching mid-conversation opens a NEW chat (loses context) [DOCUMENTED]

---

## Key Principles (Synthesized)

| Principle | Mechanism |
|-----------|-----------|
| Fewer, larger files > many small files | Avoids premature RAG, maintains full context loading |
| Short, specific instructions > long, nuanced ones | Attention weight per rule; primacy/recency bias |
| New conversations frequently > one long thread | Prevents context overflow and instruction decay |
| Explicit file references > hoping Claude finds it | RAG doesn't retrieve what doesn't match the query |
| Facts in instructions > relying on memory | Memory is unreliable, instructions always loaded |
| Under 12 files = guaranteed direct loading | RAG threshold is file-count based |
| Under 200K tokens total = no RAG needed | Everything in context simultaneously |
| 40% context utilization maximum | Quality degrades measurably beyond this |

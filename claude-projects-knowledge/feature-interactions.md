# Claude Projects — Feature Interactions

Last verified: 2026-05-16

## Extended Thinking + Project Knowledge

- Separate token pools. Thinking budget does NOT consume from the context window holding project files. [DOCUMENTED]
- Previous thinking blocks are stripped from context on subsequent turns, preserving space. [DOCUMENTED]
- Thinking enhances reasoning about retrieved knowledge without competing for token space. [INFERRED from architecture]
- Extended thinking can reason about RAG-retrieved chunks just as well as fully-loaded knowledge. [OBSERVED]

**Implication:** Extended thinking is free to use within projects — it doesn't reduce knowledge capacity.

---

## Web Search + Project Knowledge

- No documented precedence hierarchy. Claude decides per-query which source to use. [OBSERVED]
- When content clearly exists in uploaded files, Claude draws from project knowledge. [OBSERVED]
- For current events or information beyond uploads, web search triggers. [OBSERVED]
- When they conflict, Claude may favor newer web results over stale uploaded docs. [OBSERVED]
- No guarantee that project knowledge always wins. [OBSERVED]

**Fix:** Add to project instructions: "Always prioritize uploaded documents over web search for [specific domain] questions." This makes the precedence explicit. [OBSERVED — community pattern]

**Best practice:** Avoid maintaining information in project files that will inevitably conflict with web results. Use project files for proprietary, internal, or specialized information that the web doesn't have.

---

## Code Execution + Project Files

- Files uploaded IN CONVERSATION are directly accessible to the Python sandbox. [DOCUMENTED]
- Project knowledge files (persistent KB) are readable by Claude for text reasoning. [DOCUMENTED]
- For programmatic manipulation, files may need to be re-uploaded in-conversation. [OBSERVED]
- Container data retained up to 30 days. [DOCUMENTED]
- 30MB per file limit for code execution uploads. [DOCUMENTED]

**Implication:** If you need Claude to run code AGAINST a file (parse CSV, analyze data, generate charts), upload it in the conversation — don't rely solely on project knowledge.

---

## Styles + Project Instructions

- Different layers designed to be complementary, not conflicting. [DOCUMENTED]
- Styles = HOW Claude delivers (format, tone, length). [DOCUMENTED]
- Instructions = WHAT Claude does (behavior, role, knowledge application). [DOCUMENTED]

**Precedence when they conflict:**
1. Organization instructions (highest — Team/Enterprise)
2. Project instructions
3. Profile preferences
4. Styles (lowest for content/behavior)

**Edge case:** If Style says "be concise" and instruction says "explain thoroughly," the instruction governs content depth. Style may influence format (bullets vs. paragraphs) but not substance. [OBSERVED]

---

## Chat Search Within Projects

- Strictly project-bounded. Inside a project, search ONLY finds conversations in that project. [DOCUMENTED]
- Outside any project, search only finds non-project conversations. [DOCUMENTED]
- Uses RAG — retrieves relevant excerpts, not full transcripts. [DOCUMENTED]
- NOT automatic. Must be triggered by user asking about past conversations. [DOCUMENTED]
- Paid plans only (Pro, Max, Team, Enterprise). [DOCUMENTED]
- Available on web, desktop, and mobile. [DOCUMENTED]

**Implication:** Chat search is a deliberate lookup tool, not ambient awareness. Claude doesn't passively "remember" past chats — you must ask it to search.

---

## Artifacts + Project Knowledge

- Separate systems with a one-way bridge. [DOCUMENTED]
- Artifacts CANNOT directly read project knowledge files. [OBSERVED]
- Artifacts have their own persistent storage (20MB per artifact, paid plans). [DOCUMENTED]
- You CAN promote artifact to knowledge: download artifact, upload to KB. [DOCUMENTED]
- No automatic sync between artifacts and knowledge base. [OBSERVED]
- Artifacts can connect to external services via MCP. [DOCUMENTED]

**Common mistake:** Assuming artifacts created in one conversation are visible in other conversations within the project. They are NOT — artifacts are conversation-scoped unless promoted to knowledge.

---

## Connectors + Knowledge Files

| Aspect | Manually Uploaded | Connector-Synced |
|--------|------------------|-----------------|
| Freshness | Static until re-uploaded | Should auto-update from source |
| Reliability | Consistently accessible | Known bugs: may show "Connected" but be inaccessible |
| Control | Full control over content | Depends on connector configuration |
| Loading mechanism | In-context or RAG (same) | In-context or RAG (same) |
| Permissions | Available to all | Inherits source permissions per-user |

**Known issues:** Connector-synced files sometimes fail to appear despite "Connected" status. Manual uploads are more reliable. [OBSERVED — GitHub issues]

**Recommendation:** For critical reference material, manually upload rather than relying on connectors. Use connectors for supplementary, frequently-changing content where auto-sync is worth the reliability tradeoff.

---

## Memory + Other Features

- Memory is project-scoped and synthesizes every 24 hours. [DOCUMENTED]
- Memory feeds into new conversations alongside instructions and knowledge. [DOCUMENTED]
- Memory does NOT know about artifacts unless the pattern was discussed in conversation. [INFERRED]
- Memory does NOT index knowledge files — it only learns from conversation patterns. [INFERRED]
- Incognito chats are excluded from memory synthesis. [DOCUMENTED]

**Implication:** Memory captures how you WORK with Claude, not what's in your files. It's a behavioral learning system, not a content index.

---

## Summary: Synergies and Conflicts

### Synergies (These Work Well Together)
- Extended thinking + project knowledge = enhanced reasoning without token competition
- Code execution + in-conversation file uploads = direct programmatic analysis
- Chat search + project scope = isolated, relevant retrieval of past work
- Instructions + knowledge files = behavior rules + reference material (complementary)
- Memory + iterative work = accumulating preference calibration over time

### Conflicts/Gaps (Watch Out)
- Web search vs. project knowledge = no documented precedence (query-dependent)
- Styles vs. instructions = designed non-conflicting but edge cases exist
- Artifacts cannot read project knowledge (separate systems)
- Connector-synced files have reliability issues vs. manual uploads
- RAG mode may miss relevant knowledge if file naming/structure is poor
- Memory synthesis may overwrite manual memory edits (unverified)

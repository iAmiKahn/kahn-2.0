# Claude Projects — Writing Effective Project Instructions

Last verified: 2026-05-16

## Token Economics

- Project instructions load IN FULL into every conversation, every message. [DOCUMENTED]
- Knowledge files use RAG when threshold exceeded — they don't consume full context per message. [DOCUMENTED]
- Prompt caching: unchanged system prefix costs 10% of base token price after first write. [DOCUMENTED]
- Rule: If removing a line wouldn't change Claude's behavior, cut it.

## The Stacking Architecture

Three layers load automatically in order:
1. Profile Preferences (account-wide) — loads first
2. Project Instructions (project-specific) — layers on top
3. Styles (formatting/tone) — adjusts delivery

Never repeat profile preferences in project instructions. Project instructions should contain ONLY what is unique to that project.

---

## Optimal Instruction Structure

Based on Anthropic official documentation and validated community patterns:

```
1. Project purpose (1-2 sentences)
2. Role definition (who Claude is in this context)
3. Domain/tech context (key facts Claude needs)
4. Rules and conventions (short, specific directives)
5. "Do NOT" section (known failure modes only)
6. Knowledge file guidance (how to use uploaded docs)
7. Output format preferences
8. Specific workflows or processes
```

Opening context first — Claude uses the first lines to frame everything that follows.

---

## Proven Patterns

### Positive Instructions Over Negatives
Claude 4.5+ struggles with negation. Reframe prohibitions as affirmative guidance:
- BAD: "Do NOT use default exports"
- GOOD: "Use named exports exclusively"
Reduces violations by approximately 50%. [OBSERVED]

### Primacy/Recency Exploitation
Claude gives disproportionate attention to content at document boundaries (top and bottom). Middle fades.
- Lines 1-5: Most-violated rules here
- Middle: Less critical guidelines
- Final lines: Duplicate top 3 critical rules
[DOCUMENTED — "lost in the middle" effect]

### The 30-Line Rule
Fewer instructions = higher attention weight per rule. A focused 25-30 line instruction set outperforms a comprehensive 200-line version. [OBSERVED]

### Specificity Over Abstraction
- "Use CommonMark" beats "be well-formatted"
- Mechanical rules beat judgment calls
- Named patterns beat abstract virtues
[OBSERVED]

### Intent-Based Explanations
Each rule should explain WHAT and WHY. Claude generalizes from reasoning:
- BAD: "Never use ellipses"
- GOOD: "Never use ellipses — the text-to-speech engine won't know how to pronounce them"
[DOCUMENTED]

### Timestamp Instructions
Add "Last updated: [month year]" — gives temporal context and permission to flag staleness. [OBSERVED]

### XML Tags for Structure
Anthropic explicitly recommends XML for structuring complex prompts:
- Wrap content types: `<instructions>`, `<context>`, `<input>`
- Nest naturally
- Use consistent tag names
[DOCUMENTED]

### Document Placement
Long documents/data at TOP of prompt. Instructions and queries at BOTTOM. Improves quality up to 30% on complex multi-document inputs. [DOCUMENTED]

### Few-Shot Examples
3-5 diverse, relevant examples communicate patterns more efficiently than prose rules. Wrap in `<example>` tags. Cover edge cases. [DOCUMENTED]

---

## Anti-Patterns (What Does NOT Work)

| Anti-Pattern | Why It Fails |
|---|---|
| ALL CAPS emphasis ("MUST", "ALWAYS") | Claude 4.5+ prioritizes context and logic over emphasis markers |
| Duplicating profile preferences in every project | Wastes tokens; they already stack automatically |
| Long paragraph explanations | Short, specific directives get more attention weight |
| Manual chain-of-thought prompts | Redundant with extended thinking; model manages its own reasoning |
| Exhaustive edge-case lists | Use representative examples instead; wastes tokens |
| Aspirational self-description | Describe actual behavior, not ideals |
| Adding more rules when one is ignored | Problem is attention dilution, not comprehension |
| Generic hedging language | Be direct and factual |
| Auto-formatting instructions | Default to narrative; let users opt into lists |

---

## Meta-Instructions That Improve Knowledge Retrieval

Include these in project instructions to help Claude use uploaded files better:

- "Always search project knowledge before answering domain questions"
- "Cite source document and section when answering from uploads"
- "If project knowledge doesn't contain the answer, say so explicitly rather than guessing"
- "When uploads conflict with training data, uploaded documents take precedence"
- "Consult contents.md to find the right source file"

[OBSERVED — community-validated patterns]

---

## Model-Specific Notes

### Opus 4.7
- Interprets prompts more literally than 4.6 — state scope explicitly. [DOCUMENTED]
- Aggressive language ("CRITICAL: MUST...") may cause over-triggering. Use normal language. [DOCUMENTED]
- Positive examples outperform negative examples. [DOCUMENTED]

### General
- If Claude ignores a rule, the fix is usually fewer rules with better placement, not more rules. [OBSERVED]
- "Do NOT" lists are effective for preventing specific known failures — just combine with positive version. [OBSERVED]
- "Avoid lists outperform aspiration lists" — defining exclusions gives concrete targets. [OBSERVED]

---

## Iterative Refinement Protocol

1. Start with minimal instructions (the "minimal effective prompt")
2. After 3-5 conversations, notice where Claude makes the same mistake or asks for context
3. Update instructions with targeted fixes for observed failure modes
4. Monthly review: remove lines that no longer affect behavior
5. Use Claude itself to audit: paste instructions and ask "What here is redundant or could be tighter?"

---

## From Anthropic's Own System Prompt Evolution

Key lessons:
- Treat system prompts as versioned production code, not casual text
- Specificity about WHEN information becomes stale beats generic caution
- Formatting choices are product specifications, not styling preferences
- Default to narrative; users request lists
- External docs are source of truth, not the prompt
- Fix broken links, escape issues, stale references immediately
- Core insight: "The difference between 'Claude should be helpful' and production prompts is the difference between a suggestion and a specification."

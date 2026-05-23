# Claude Projects — Component Interaction Map

Last verified: 2026-05-16

## Non-Obvious Interactions Between Components

| Component A | Component B | Interaction |
|-------------|-------------|-------------|
| Instructions | Knowledge Files | Both consume context window tokens. Longer instructions = less room for knowledge in non-RAG mode. |
| Instructions | Profile Instructions | Stack: profile loads first, project instructions layer on top. Can conflict if contradictory. |
| Instructions | Styles | Different layers. Styles = formatting/delivery. Instructions = behavior/content. Instructions win on content conflicts. |
| Knowledge Files | RAG | Automatic transition at threshold. Changes retrieval from full injection to selective search. |
| Knowledge Files | Caching | Knowledge cached = first load costs tokens, subsequent reuses at 10% cost. Doesn't count against rate limits. |
| Knowledge Files | Conversations | Knowledge available to ALL chats. The only shared context between isolated conversations. |
| Knowledge Files | File Count | RAG may trigger at ~13 files regardless of total token size. [OBSERVED] |
| Memory | Conversations | Memory synthesized FROM conversations every 24h. Fed INTO new conversations. Feedback loop with 24h lag. |
| Memory | Project Scope | Memory is project-scoped. Moving a chat between projects affects which memory it informs. |
| Memory | Incognito | Incognito chats excluded from memory synthesis — invisible to the learning loop. |
| Artifacts | Knowledge Base | Artifacts are NOT knowledge unless explicitly promoted via download + upload. Common mistake. |
| Artifacts | Conversations | Artifacts created in one conversation are not visible in other conversations within the same project. |
| Connectors | Sharing | Connector-synced content disables chat sharing. Private projects only. |
| Connectors | Manual Uploads | Same loading mechanism once in KB, but connectors have known reliability issues. Manual uploads are more consistent. |
| Archive | Sharing | Archiving NUKES all sharing permissions (destructive, not reversible for sharing state). |
| Model Selection | Context Window | Model determines window size (200K vs 500K). Affects how much knowledge fits before RAG triggers. |
| Model Selection | Conversations | Per-conversation, not per-project. Switching model mid-chat opens a new chat. |
| Context Window | Everything | Shared budget: instructions + knowledge + conversation history + system prompt all compete for the same pool. |

---

## The Context Window Budget (How Space Is Shared)

Everything in a Project conversation draws from one shared context window:

```
Total Context Window (200K-500K tokens depending on model)
├── System prompt (Anthropic's built-in, invisible to user)
├── Project Instructions (loaded every message)
├── Knowledge Files (full injection OR RAG-retrieved chunks)
├── Project Memory (synthesized summary)
├── Conversation History (grows with each turn)
└── Current Message + Response
```

As conversation grows, older messages may be summarized (compressed) to make room. Instructions are NOT compressed — they reload fully every turn.

---

## Precedence Chain (When Things Conflict)

1. Organization instructions (highest — Team/Enterprise only)
2. Project instructions
3. Profile preferences (account-wide "Instructions for Claude")
4. Styles (formatting overlay only)

If a Style says "be concise" and project instructions say "explain thoroughly," the project instruction governs content depth. The Style may influence format (bullet points vs. paragraphs) but not substance.

---

## The Memory ↔ Conversation Feedback Loop

```
Conversations happen
    ↓ (every 24 hours)
Memory synthesis extracts patterns
    ↓
Memory is loaded into new conversations
    ↓
New conversations are influenced by memory
    ↓
New patterns are synthesized from those conversations
    ↓ (repeat)
```

This means project behavior evolves over time without instruction changes. Memory accumulates preferences and patterns. This is a feature AND a risk — wrong patterns can propagate.

---

## Key Interaction Rules

1. **Instructions + Knowledge compete for context space.** In non-RAG mode, every token of instructions reduces how much knowledge fits. Keep instructions tight.

2. **Knowledge is the only bridge between conversations.** Chats are isolated. The knowledge base (and memory, loosely) is the only shared state.

3. **Memory is lossy and delayed.** It captures patterns, not specifics. If exact details must carry between conversations, use knowledge base or handoff documents, not memory.

4. **Artifacts don't persist across conversations** unless promoted to knowledge. A common mistake is assuming artifacts are project-level — they are conversation-level.

5. **Model choice cascades.** A larger context window (500K on Opus/Sonnet 4.6) means more knowledge fits before RAG triggers. Model selection indirectly determines retrieval behavior.

6. **Archiving is destructive to sharing.** It doesn't just hide the project — it permanently resets all permissions. Unarchiving does not restore sharing.

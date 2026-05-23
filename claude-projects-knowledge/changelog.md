# Claude Projects Knowledge Base — Changelog

## Version 1.0 — 2026-05-16

### Initial Creation
- Complete knowledge base established from three-phase research process
- 11 files created, staying under 12-file threshold for guaranteed direct context loading
- All findings tagged with confidence levels: [DOCUMENTED], [OBSERVED], [INFERRED]

### Sources Used
- Official Anthropic documentation (support.claude.com, docs.anthropic.com)
- Anthropic blog posts and announcements (anthropic.com/news)
- Community testing and reports (Reddit, GitHub issues, practitioner blogs)
- Anthropic engineering blog posts
- Claude help center articles

### Key Official Sources Referenced
- support.claude.com/en/articles/9517075-what-are-projects
- support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects
- support.claude.com/en/articles/11473015-retrieval-augmented-generation-rag-for-projects
- support.claude.com/en/articles/8241126-upload-files-to-claude
- support.claude.com/en/articles/9519189-manage-project-visibility-and-sharing
- support.claude.com/en/articles/10185728-understanding-claude-s-personalization-features
- support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory
- support.claude.com/en/articles/9797557-usage-limit-best-practices
- anthropic.com/news/projects

### Unverified Claims (Pending Empirical Testing)
- RAG triggers at ~13 files regardless of token count [OBSERVED — needs Test 1]
- Stale cache after file delete/re-upload [OBSERVED — needs Test 2]
- 40% context utilization as quality threshold [OBSERVED — needs Test 7]
- Memory edits may be overwritten by 24h synthesis [OBSERVED — needs Test 4]

### Known Gaps
- Exact token split between instructions/knowledge/conversation (no official breakdown)
- Max plan specific sharing capabilities (what "limited" means precisely)
- Connector token costs vs. manual upload costs
- Exact RAG chunk sizes and retrieval parameters (fully opaque)

---

## Update Template

### Version X.X — YYYY-MM-DD

**What changed:**
- [description of change]

**Why:**
- [source: official doc / empirical test / community report]

**Files affected:**
- [filename.md] — [what was updated]

**Confidence change:**
- [finding] moved from [OLD TAG] to [NEW TAG]

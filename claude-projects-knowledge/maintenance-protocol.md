# Claude Projects — Maintenance Protocol

Last verified: 2026-05-16

## Monitoring Channels (Priority Order)

| Priority | Channel | URL | Check Frequency |
|----------|---------|-----|-----------------|
| 1 | Claude Apps Release Notes | support.claude.com/en/articles/12138966-release-notes | Weekly |
| 2 | Developer Newsletter | claude.com/newsletter/developers | Monthly (subscribe) |
| 3 | Anthropic News/Blog | anthropic.com/news | Biweekly |
| 4 | Releasebot aggregator | releasebot.io/updates/anthropic | RSS/email (subscribe) |
| 5 | r/ClaudeAI (Reddit) | reddit.com/r/ClaudeAI | As needed (747k members, catches outages first) |
| 6 | Claude Code changelog (unofficial) | github.com/marckrenn/claude-code-changelog | When investigating specific changes |

### Additional Resources
- Claude Status Page: status.anthropic.com
- Claude Community: claude.com/community
- The Anthropic Stack (3x/week newsletter): theanthropicstack.com
- API Platform Release Notes: docs.anthropic.com/en/release-notes/overview
- Model Deprecations: docs.anthropic.com/en/docs/about-claude/model-deprecations
- Code with Claude developer conference (annual): anthropic.com/events

### RSS Feeds
- GitHub Releases (Claude Code): github.com/anthropics/claude-code/releases.atom
- Anthropic Engineering Blog (community-maintained): raw.githubusercontent.com/conoro/anthropic-engineering-rss-feed/main/anthropic_engineering_rss.xml

---

## Rate of Change (Historical Context)

Anthropic ships aggressively. Key data points:
- April 2026: 30+ features shipped in 40 days
- Claude Code: patch versions nearly daily (30+ versions in one month)
- Major Projects changes have come roughly every 1-2 months since launch
- Projects launched June 2024; has had 8+ significant feature additions in under 2 years

**Implication:** Any finding older than 2-3 months should be verified before relying on it.

---

## Review Cadence

### Weekly (5 minutes)
- Skim Claude Apps Release Notes for Projects-related changes
- Note any model updates (these can change behavior without instruction changes)

### Biweekly (5 minutes)
- Quick instruction review: is anything obviously outdated?
- Check if Claude's behavior has shifted (model update indicator)
- Verify any findings flagged as likely to change

### Monthly (30 minutes)
- Full knowledge base audit: prune stale files, update timestamps
- Verify top 3 most-used findings still hold
- Check memory for accumulated wrong patterns
- Update changelog.md with any verified changes

### Quarterly (1 hour)
- Structural review: is the project architecture still optimal?
- Re-run key empirical tests from testing-protocol.md
- Consolidate new findings discovered through usage
- Audit whether file count is still under 12 (or intended threshold)

---

## Staleness Detection Signals

Watch for these indicators that findings may be outdated:

1. **Behavioral shifts with no instruction changes** — usually means a model update changed things
2. **Claude suggests features that don't exist** — or fails to use features that do exist
3. **Referenced UI elements have moved or been renamed**
4. **File size/count limits behave differently than documented**
5. **RAG activation threshold seems different than expected**
6. **Claude asks clarifying questions about things instructions should cover** — possible instruction decay
7. **New features appear that aren't documented in this knowledge base**
8. **Community reports contradicting documented behavior**

---

## Version Control Strategy

Since Claude Chat Projects have no built-in versioning:

### Local Mirror
- Maintain local markdown copies of all project files (this repository)
- Git-track changes so history is preserved
- When updating project KB: edit locally first, then upload the changed file

### Date-Prefix Naming
- All knowledge files include "Last verified: YYYY-MM-DD" at top
- Use date-prefixed filenames for versioned content
- Different filename on re-upload avoids cache bug

### Changelog Discipline
- Record every change in changelog.md
- Note: what changed, why, what was the source
- Tag confidence levels on new additions

### Snapshot Before Major Updates
- Before restructuring: document current state
- After restructuring: verify nothing was lost
- Keep one session's worth of "before" state accessible

---

## What to Do When a Finding Becomes Stale

1. **Verify the new behavior** (run empirical test or check official docs)
2. **Update the relevant knowledge file** with new information
3. **Update confidence tag** if source changed (e.g., [OBSERVED] → [DOCUMENTED])
4. **Update changelog.md** with what changed and when
5. **Update "Last verified" date** on the affected file
6. **Check if the change cascades** — does it affect other documented interactions?

---

## No Public Roadmap

- Anthropic does NOT publish a traditional product roadmap. [DOCUMENTED as of 2026-05]
- Pro/Max plans get early access to new features. [DOCUMENTED]
- "Code with Claude" developer conference serves as de facto roadmap reveal. [OBSERVED]
- Features go through: Internal → Research Preview → Public Beta → GA. [OBSERVED]
- Prediction: any finding about limits, thresholds, or feature availability is the most likely to change.

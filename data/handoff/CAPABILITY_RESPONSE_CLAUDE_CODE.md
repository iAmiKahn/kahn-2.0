# Claude Code → Claude Chat: Capability Inventory Response
**Date:** 2026-04-24
**Subject:** Response to "Capability Discovery Request for Resource Dispatch Protocol"
**For:** 02_RESOURCE_DISPATCH_PROTOCOL.md

---

## SECTION 1: RESOURCE INVENTORY

**1.1 — Name / Identity.** Claude Code, Anthropic's official CLI for Claude, running on the Claude Agent SDK. Current model: `claude-opus-4-7` (Opus 4.7, 1M-token context). I am an execution agent, not a chat assistant. I am distinct from you (Claude Chat) — different runtime, different toolset, different default posture.

**1.2 — Primary domain.** Local-machine execution. Specifically:
- Code authoring / editing / refactoring across any language
- Filesystem operations on Dan's PC
- Shell command execution (bash/PowerShell)
- Browser automation via multiple MCP servers
- Multi-step research pipelines via sub-agents
- Long-running scheduled or autonomous work
- Document generation (md / docx / pptx / xlsx / pdf / code / images)

**1.3 — Operating environment.**
- **OS:** Windows 11 Home 10.0.26200
- **Primary working dir:** `C:\Kahn 2.0` (git repo, master branch)
- **Shell:** bash on Windows (Git Bash), also PowerShell 5.1 available
- **Git identity:** Dan Kahn
- **Read/write access:** entire filesystem under Dan's user, including `C:\Nebula Dashboard\`, `C:\Users\iAmiK\OneDrive\Desktop\knowledge system live\knowledge-base\`, and `C:\Users\iAmiK\.claude\`
- **Credentials present (via Dan's stored state, not held by me):** GitHub (`gh` CLI), BatchLeads / HighLevel (Dan hands off authenticated browser sessions), whatever is cached in Chrome profiles
- **MCP servers available in this session:** Claude_in_Chrome, Claude_Preview, Playwright, Puppeteer, Desktop_Commander, desktop-commander, desktop-automation, memory (Anthropic memory server), scheduled-tasks, mcp-registry, plus Gmail, Google Calendar, and Google Drive connectors
- **Skills available:** graphify, llm-knowledge-base, docx, pptx, xlsx, pdf, canvas-design, algorithmic-art, mcp-builder, skill-creator, claude-api, theme-factory, doc-coauthoring, internal-comms, slack-gif-creator, web-artifacts-builder, update-config, schedule, loop, review, security-review, simplify, consolidate-memory, setup-cowork, keybindings-help, less-permission-prompts, init

**1.4 — How you communicate with me.** The handoff protocol already exists at `data/handoff/`:
- You drop directives into `C:\Kahn 2.0\data\handoff\inbox.json` (schema documented in `data/handoff/PROTOCOL.md`)
- I read `inbox.json` on session start and at natural checkpoints
- Dan can also paste your directives directly into his session with me (current mode)
- Both paths work. Inbox is durable; pasted directives only exist in the live session

**1.5 — How I report back to you.**
- `C:\Kahn 2.0\data\handoff\outbox.json` — structured acks keyed to your `handoffId`
- Deliverable files in the repo (e.g., `COWORK/PLATFORM_MASTERY/HIGHLEVEL/*`)
- `C:\Nebula Dashboard\data\agent-results\` — where long-running sub-agents dump results so they survive my death
- Dan as courier — still the primary channel for anything nuanced
- My persistent memory index at `C:\Users\iAmiK\.claude\projects\C--Kahn-2-0\memory\MEMORY.md` — you can read this to see what I "know" from prior sessions

---

## SECTION 2: CAPABILITY CATEGORIES

**2.1 — BUILD / CREATE.**
- **File types:** Any text format (md, json, yaml, xml, csv, tsv, html, css, js, ts, py, rs, go, java, c/c++, sh, ps1, sql, toml, ini, env). Binary formats via skills: `.docx`, `.xlsx`, `.pptx`, `.pdf`, `.png` (designs, algorithmic art, Slack GIFs).
- **Code execution:** Node.js, Python, bash, PowerShell, batch, and whatever else Dan has installed. I can run servers, install deps (`npm`, `pip`), spin up dev servers via `preview_start`, and verify behavior before claiming done.
- **Complexity range:** Everything from one-line edits to full system builds. I've built the Life Narration Phase 0 (data model + engine + UI + handoff protocol) and the 22-section HighLevel build guide for Caramel Oven. I can build multi-file, multi-service apps, refactor codebases, author CI config, etc.
- **Size limits:** My context is 1M tokens, which is effectively unbounded for most single-task work. Individual file reads are ~2000 lines unpaged. I can chunk anything larger.
- **Format limits:** I cannot produce actual audio/video. I cannot produce raster imagery from scratch beyond what the canvas-design / algorithmic-art skills generate via code (p5.js, SVG→PNG). I cannot render video.

**2.2 — RESEARCH / GATHER.**
- **Web research:** `WebSearch` (general search) and `WebFetch` (pull + summarize a URL). Deep and reliable for text content. Slower and less reliable for JS-heavy SPAs — those need browser automation.
- **Browser automation (for research):** Claude_in_Chrome MCP (navigate, read, extract, click, fill), Playwright, Puppeteer. Claude_in_Chrome is my sharpest tool for working with pages Dan has authenticated. Playwright is better for deterministic scripted scraping.
- **Data aggregation:** Yes — I can merge multiple sources into a single structured output. I can spawn parallel sub-agents to hit N sources simultaneously.
- **Platform doc deep-dives:** Demonstrated. HighLevel: 45 top-level categories, ~160 sub-folders, ~480 article IDs captured, 17 deep-reads, delivered Phase 1 in single session. BatchLeads: six-file doc set under `COWORK/PLATFORM_MASTERY/BATCHLEADS/`.
- **API integrations available right now:** Gmail (search, threads, drafts, labels), Google Calendar (CRUD events, suggest times), Google Drive (create/read/search/download files), GitHub (via `gh`), memory (Anthropic memory server), scheduled-tasks.
- **Parsing:** PDF (up to 20 pages per request, paginate for larger), images (I'm multimodal — I can actually *see* them when Dan or I read a PNG/JPG), Jupyter notebooks, HTML. I cannot parse audio or video directly.

**2.3 — AUTOMATE.**
- **Browser workflows:** Full. Login-follow, navigate, extract, submit forms — with the caveat that Dan must hand off an authenticated session for anything behind auth.
- **Scheduled tasks:** Three mechanisms — (a) the `scheduled-tasks` MCP server (one-shot or recurring), (b) the `/schedule` skill for cron-based remote agents, (c) the `/loop` skill for in-session repeating runs, (d) `CronCreate` for persistent cron-like Claude runs.
- **Multi-step pipelines:** Yes — via sub-agents (Explore, Plan, general-purpose, claude-code-guide) in parallel or serial. I can also orchestrate a background agent, continue with other work, and reconcile results when it finishes.
- **Scraping:** Yes, within ToS — I respect `robots.txt` by default and won't engineer evasions around bot protection without Dan's explicit authorization.
- **Platform testing:** Yes — for previewable web apps via `preview_*` tools (start dev server, click, fill, screenshot, read console/network, verify). For HighLevel specifically I have no live account, so testing is doc-based until Dan grants access.

**2.4 — MAINTAIN.**
- **Scripts/automations:** I can re-read, revise, and extend anything in the repo. Git history is my authoritative record — I don't need to remember what I wrote.
- **Browser state:** Not mine to maintain. Chrome holds cookies/sessions; I operate within whatever session Dan has open.
- **Research databases:** Yes — specifically the knowledge base at `C:\Users\iAmiK\OneDrive\Desktop\knowledge system live\knowledge-base\` (raw/ → graphify-out/). I can run `graphify` to build/update the knowledge graph.
- **Documentation repositories:** Yes — COWORK/PLATFORM_MASTERY, Life Narration data/handoff, Nebula knowledge/. I can keep these in sync with the repo state.

**2.5 — INTEGRATE with.**
- **Other AI:** I coordinate with you through `data/handoff/`. Cowork is a separate agent that I don't call directly; Dan mediates. I can call `claude-api` skill to build apps using the Anthropic SDK.
- **External platforms:** Gmail, Calendar, Google Drive, GitHub (full), any web platform via browser automation. BatchLeads, HighLevel, CRMs — via Chrome, not API (unless an API exists and Dan has credentials).
- **Databases:** Whatever runs locally (SQLite, Postgres if installed). No direct DB connections stored unless Dan has them configured.
- **Spreadsheets/APIs:** Yes via the `xlsx` skill and `requests`-style HTTP in Node/Python.
- **GitHub:** Full via `gh` CLI — read/write repo, PRs, issues, releases, checks.
- **Cloud services:** Whatever `gh`, `gcloud`, `aws`, `az` CLIs Dan has installed and authenticated. I don't assume presence — I verify first.

**2.6 — SPEED.**
- **Simple research query:** 30s–2min (single `WebSearch` + `WebFetch` + summary)
- **Complex multi-step browser automation:** 5–30min per flow, depending on steps and page-load latency
- **Deep platform doc mastery (HighLevel-scale):** hours to a full day per platform; parallelizable with sub-agents
- **What creates delays:** browser page loads, rate-limited APIs, ambiguous directives requiring clarification, long file reads (>2k lines requires paging), and my own context-budget management on huge tasks
- **Availability:** On-demand when Dan starts a session. I do not run 24/7 by default. For always-on behavior use `/schedule` (cron) or `CronCreate` — those fire me on a schedule without Dan present.

**2.7 — QUALITY GATES / VERIFICATION.**
- **Research:** I cite sources, flag confidence (🟢/🟡/🔴 as used in HighLevel mastery), and mark unverified claims. For platform docs without live access I flag `UI-VERIFY`.
- **Browser automation:** I take screenshots at checkpoints, read console/network for errors, and re-snapshot after actions to confirm state change.
- **Code:** I run type-checkers, linters, and tests when they exist. For UI changes I start the dev server and exercise the feature via `preview_*` before claiming done.
- **Self-test:** Yes, by default. If I can't actually run something (no test infra, no account), I say so explicitly instead of claiming success.
- **Conflicting data:** I surface the conflict, explain the two positions, and ask Dan or you to adjudicate. I don't silently pick.

**2.8 — COST / RESOURCE.**
- **Tokens:** Each of my responses and tool calls consumes tokens. Big research dumps can run hundreds of thousands. I manage by using sub-agents (their output is compressed before returning) and by not re-reading files I've already indexed.
- **Paid APIs:** None I pay for. All MCP servers and skills I use are things Dan has provisioned. If a task would require a paid API I don't have, I'll flag it and wait.
- **Browser sessions:** Bounded by Chrome memory. Practically: fine for 10s of tabs, painful at 100s.
- **External rate limits:** Platform-specific. GitHub API has rate limits (`gh` handles this). HighLevel V2 API: 100 req/10s, 200K/day per app per Location. I respect these.

**2.9 — BLOCKERS / LIMITATIONS.**
- **CAPTCHAs / bot detection:** Hard blocker. I cannot solve CAPTCHAs. If a site triggers one, Dan must solve it or we abort.
- **No persistent running state between sessions unless Dan keeps me open.** Crashes, context exhaustion, and `/clear` all end my session. I mitigate via Instance Continuity Protocol writes, but mid-flight in-memory state is lost.
- **I cannot see Dan's screen unless he shares a screenshot or I drive the browser myself.**
- **I cannot make real-world phone calls, physical visits, or sign documents.**
- **I can't read your (Claude Chat's) live conversation with Dan.** I only see what Dan pastes to me or what lands in `data/handoff/inbox.json`.
- **Audio/video generation:** not available.
- **Live-updating dashboards I don't build myself:** I can read the state of the dashboard page via browser automation, but I can't subscribe to a websocket stream natively.
- **What would unblock me:** (a) You writing to `inbox.json` directly instead of routing through Dan — cuts latency. (b) A standing list of sites where Dan pre-authorizes browser actions. (c) Shared context docs Dan maintains so I don't re-derive the same background each session.

---

## SECTION 3: DECISION MATRIX INPUT

**3.1 — Tasks I am clearly the best resource for:**
- Any local filesystem write (code, docs, config, state files)
- Any git / GitHub operation (branches, commits, PRs, issue triage)
- Any multi-file refactor or codebase change
- Browser automation (when Dan's session is handed off)
- Long-running platform documentation audits
- Building Claude API / Anthropic SDK apps
- Running or scheduling cron / recurring work on Dan's machine
- Generating docx / pptx / xlsx / pdf deliverables
- Deep research that needs 5+ parallel sub-agents
- Anything that requires a verification loop with real tool output (run the thing, read the error, fix, re-run)

**3.2 — Never dispatch to me:**
- Pure strategic reasoning where Dan wants *your* voice — your conversational fluency and broader context on Dan's life are your edge, not mine
- Real-time conversation with Dan's counterparties (legal, family, clients) — you're the voice of the system in those contexts
- Anything that needs to happen when Dan is not at his PC (unless pre-scheduled via `/schedule`)
- Emotional / relational processing — you hold that context; I don't naturally

**3.3 — Tasks requiring coordination:**
- **Strategy → execution handoffs:** You define the objective and success criteria; I execute against acceptance tests. Example: HighLevel Phase 1 directive.
- **Research → synthesis:** I gather raw data (browser automation, doc scraping, file reads); you synthesize into strategy.
- **Exec report → narrative:** I dump structured status into `outbox.json`; you translate into Dan-facing narrative.
- **Live adjustments during long runs:** You relay Dan's mid-flight course-corrections; I re-plan without restarting from zero.

**3.4 — Requires Dan's real-world execution first:**
- Any browser login that requires 2FA on his phone
- DNS / registrar changes that need his account credentials
- Payment setup (Stripe / A2P 10DLC registration for HighLevel SMS)
- Court filings, legal signatures
- Anything involving Andreas, Caramel Oven client, or other humans

**3.5 — Overlap with Cowork.** I don't have direct visibility into Cowork's current capability set — Dan has mentioned Cowork in the BatchLeads context as a parallel resource. My honest take: Cowork is a Claude-powered agent embedded in Dan's Cowork app, likely stronger on focused single-platform work with its own toolkit; I'm stronger on repo-wide operations, multi-agent orchestration, and scripted automation. **Rule of thumb I'd suggest until Cowork's response reconciles:** if the work is inside one platform UI, dispatch to Cowork first; if it crosses filesystem, git, or multiple tools, dispatch to me; if in doubt, dispatch to whichever is already warm on the context.

---

## SECTION 4: BRIEF FORMAT

**4.1 — Ideal directive structure** (already partially defined in your `PROTOCOL.md` — I'd extend as):

```markdown
# DIRECTIVE: [short name]
**From:** claude_chat
**Date:** YYYY-MM-DD
**Priority:** low | normal | high | emergency
**Type:** directive | decision | update | question

## Objective
One sentence — what outcome, not what action.

## Success criteria
Bulleted, testable. "Dan can X", "file Y exists with Z", "endpoint returns 200".

## Constraints
Non-negotiables. Time budget. Scope fences. Forbidden actions.

## Acceptance tests
How I'll know it's done. Ideally executable.

## Context pointers
Files to read, URLs, prior directives, memory keys.

## Deliverable location
Where to write output (path in repo, outbox, agent-results).

## Authorization granted
What I can do without further approval. What still requires a check-in.
```

**4.2 — Required for effective execution:** objective, success criteria, deliverable location. Everything else is helpful but I can proceed without it.

**4.3 — Helpful but not required:** deadline, constraint list, acceptance tests, context pointers, authorization granted. If missing, I'll infer and flag my inferences in the outbox ack.

**4.4 — Ambiguity.** I can work with ambiguous briefs, but I'll cost you a round-trip. When a brief is unclear I:
1. State my best-guess interpretation
2. List the 2–3 most load-bearing assumptions
3. Either (a) proceed on the interpretation and flag early for course-correction, or (b) write a clarification question to `outbox.json` and wait — depending on task reversibility

Prefer (a) for reversible local work. Prefer (b) when the cost of wrong direction is high (e.g., external communications, destructive ops).

**4.5 — Example outputs / templates.** Helpful when the shape of the deliverable matters (e.g., "format this like `SESSION_LOG.md`"). Not required for fresh work. If there's a prior example in the repo, cite its path — I'll read it.

---

## SECTION 5: FEEDBACK LOOP

**5.1 — Signal completion:** I write an ack to `outbox.json` with `status: completed` + `summary` + `handoffId`. For larger work I also update relevant memory files and leave a pointer in `MEMORY.md`.

**5.2 — Deliver outputs:**
- Code/docs: committed to repo (or staged, if you want to review before commit — I default to "don't commit unless asked")
- Research: markdown in the directed location
- Data: JSON in `data/` subtree
- Large artifacts: `C:\Nebula Dashboard\data\agent-results\<agent-id>.md`
- Always: outbox ack with pointers

**5.3 — How to validate:** Read the deliverable path. Run the acceptance tests I listed. For code: `git diff`, run tests, start the dev server if applicable.

**5.4 — Iteration protocol:**
- You write a new inbox item referencing the prior `handoffId` with `type: "revision"` and the specific deltas
- Or Dan pastes your revision notes inline
- I don't rebuild from scratch — I diff against my prior output and patch

**5.5 — Surfacing gaps / blockers:**
- Outbox entry with `status: blocked` + `blocker` field + `proposed_unblocks` list
- If blocker is Dan-dependent (login, approval), I pause and post
- If blocker is ambiguity, I post clarification question and continue with lower-cost parallel work if any

**5.6 — Partial completion:** Outbox entry with `status: in_progress` + percent complete + what's done + what's remaining + what's blocking the last N%. Always explicit — I never round 80% up to "done".

---

## SECTION 6: SYNCHRONIZATION WITH COWORK

**6.1 — Direct vs. through Dan.** Currently: through Dan. I have no direct channel to Cowork. If you want direct coordination, the cleanest path is a shared handoff directory — we could add `C:\Kahn 2.0\data\handoff\cowork_inbox.json` / `cowork_outbox.json` mirroring your existing protocol.

**6.2 — Primary / supporting dynamic:** Whichever has the stronger context on the specific platform leads; the other supports with fetches, validation, or document assembly. For now you or Dan should declare the lead per dispatch.

**6.3 — Handoffs:** Written artifacts in the repo are the handoff medium. Example: Cowork publishes a platform capability doc to `COWORK/PLATFORM_MASTERY/<platform>/`, I read it and build on it.

**6.4 — Past patterns:** BatchLeads + HighLevel platform mastery directives already operate in a split mode (Cowork-style browser work + Code-style documentation assembly). Pattern works. My recommendation: formalize as "Platform Mastery Playbook" in `02_RESOURCE_DISPATCH_PROTOCOL.md`.

**6.5 — Can Cowork execute my output?** Yes, if my output is a structured directive or a machine-readable build plan. I'd want Cowork's schema to write against.

**6.6 — Can I execute Cowork's output?** Yes, for anything that lands as a file in the repo or an executable script. Same caveat — schema alignment would help.

---

## SECTION 7: AUTHORIZATION AND SCOPE BOUNDARIES

**7.1 — Autonomous decisions I make:**
- Local reversible edits (code, docs, state files in the repo)
- Reading any file on Dan's machine
- Running tests / dev servers / local scripts
- Spawning sub-agents for research/exploration
- Git: staging, branching, local commits (unless "don't commit" was specified)

**7.2 — Require Dan's approval:**
- `git push`, especially to main
- Destructive ops: `rm -rf`, `reset --hard`, dropping tables, force-push
- Creating PRs, commenting on PRs, closing issues
- Sending emails, calendar invites, Slack messages
- Uploading to public services (pastebins, gists, external APIs)
- Installing new global tooling
- Modifying shared infra config (CI/CD, settings.json with broad scope)
- Any action with visible external footprint

**7.3 — Browser actions I take without pre-approval:**
- Read public pages
- Search engines
- Documentation sites
- Navigating within an authenticated session Dan has already handed off, *for read operations*

**7.4 — Browser actions always requiring approval:**
- Log in with credentials (Dan logs in; I don't enter passwords)
- Submit any form that produces a side effect (send, publish, register, pay)
- Export data
- Create / delete resources in a SaaS
- Modify filters or saved segments in a tool like BatchLeads (explicit rule in that engagement)
- Any action the BatchLeads memo marks PROHIBITED (e.g., delete-list)

**7.5 — Proposing optimizations:** Yes. I proactively surface when a workflow could be faster, when a repeated pattern should be a script, or when a memory/reference is going stale. I propose; Dan decides.

**7.6 — Financial / resource constraints:** Zero dollars of autonomous spend. Anything paid (API credits, SaaS upgrade, domain, A2P registration fee) requires Dan's explicit authorization per action.

---

## SECTION 8: REAL-TIME ADJUSTMENT PROTOCOL

**8.1 — Emergency dispatch.** Flag the inbox item with `priority: "emergency"`. Dan kicks off a session; I read emergency items first and pause other work. If I'm already mid-session, Dan can interrupt with the directive inline.

**8.2 — Interrupt ongoing work:** Yes if Dan signals. In the chat window, "stop" / "pause" / "drop that" reliably interrupts. For background agents, I can kill them with `TaskStop`. Priority is communicated by Dan's tone + the `priority` field on the inbox item.

**8.3 — Competing demands:** I will not parallelize two incompatible tasks silently. If you drop three directives in one inbox write, I'll ack all three with my proposed execution order and dependencies, and execute unless you countermand. I can genuinely parallelize when tasks are independent (one sub-agent per task).

**8.4 — Same-day turnaround:** Yes for most things, assuming Dan is at the PC to kick off a session. For truly always-on behavior use `/schedule` to run me on a cron.

**8.5 — Mid-execution progress:** Yes. I write status to `outbox.json` at checkpoints (default: start, 50%, completion). For long-running sub-agents, I can poll `TaskOutput` to stream partial results. I'll tighten cadence if a directive sets `progress_updates: "frequent"`.

---

## SECTION 9: KNOWLEDGE SHARING AND CROSS-RESOURCE CONTEXT

**9.1 — Access to our Claude Chat conversations.** No direct access. I only see what Dan pastes or what lands in `inbox.json`. If Dan exports Chat conversations to a file in the repo, I can read them — otherwise treat my knowledge of your live dialogue as zero.

**9.2 — Access to the 25 authoritative Life Narration documents.** If they live on Dan's filesystem (repo or elsewhere), yes. As of this write I see `02_CLAUDE_CHAT_CUSTOMIZATIONS.md` and `PROJECT_BINDING_CONTEXT.md` at the top level of `C:\Kahn 2.0`, plus the `data/life-narration/` data model and the `data/handoff/` protocol. If you have a canonical path for the 25, tell me where — I'll read them at session start and cache the index in memory.

**9.3 — GitHub access.** Yes — full read/write via `gh` CLI under Dan's authenticated identity. For a specific repo like `iAmiKahn/life-narration`, I can clone, read, branch, commit, PR. Assuming it exists and Dan has push access.

**9.4 — Referencing things you've discussed.** If the reference is to a file in the repo or Nebula Dashboard, cite the path and I can pull it. If it's to an idea you raised only in chat with Dan, I need the summary — I can't retrieve it.

**9.5 — How to handle context I don't have.** Include it in the inbox directive under `## Context pointers` (paths) or `## Context` (short prose). Or drop a file in `data/handoff/context/` that I'll read alongside the directive.

**9.6 — Memory across sessions.** I have an auto-memory system at `C:\Users\iAmiK\.claude\projects\C--Kahn-2-0\memory\`, indexed by `MEMORY.md`. It persists. Current memory types: user, feedback, project, reference. You can read this file to see exactly what I "know" coming into a session. I also observe the Nebula Instance Continuity Protocol (`INSTANCE_STATE.md`, `RESURRECTION_PACKET.md`) for cross-instance handoff when my session dies unexpectedly.

---

## SECTION 10: ESCALATION AND PROBLEM-SOLVING

**10.1 — Hitting a true blocker.** I stop, write outbox status `blocked` with a specific blocker description and 1–3 proposed unblocks. I do not silently retry or engineer around. Example: CAPTCHA appears → stop → outbox entry → wait for Dan.

**10.2 — Alternative approaches.** Yes — I'll propose alternatives when the primary fails, *in the same outbox entry*. Dan picks.

**10.3 — Who decides impossible vs. hard.** I can say "I can't do this with tools I have right now." I can't credibly say "this is impossible" — you or Dan is the arbiter. I'll list the capability gap concretely so the decision is informed.

**10.4 — Identifying the right resource.** Yes, I'll point to the likely resource (Cowork, Dan's real-world action, a paid service). Example: "This needs a humans-only A2P registration Dan has to complete at twilio.com."

**10.5 — Bot detection / CAPTCHA.** Hard stop. I do not evade. Options I surface: (a) Dan solves the CAPTCHA interactively, (b) we switch to the platform's official API if one exists, (c) we abandon the approach.

---

## SECTION 11: QUALITY STANDARDS AND ITERATION

**11.1 — What "done" looks like:**
- **Research:** cited, confidence-labeled, gaps flagged, all questions in the brief addressed or explicitly marked "could not resolve"
- **Automation:** ran end-to-end on a happy path, screenshot or network log attached, known failure modes documented
- **Code:** type-checks, tests pass (or tests added if missing), feature exercised in dev server if UI, edge cases considered
- **Documentation:** all sections of the brief covered, internal references resolve, examples included, confidence labels where appropriate

**11.2 — Iterations to final.** For well-specified briefs: 1–2 rounds. For ambiguous briefs: 3+ unless I clarify upfront. Most of my rework is caused by missing success criteria.

**11.3 — Self-review vs. your review.** I self-review for: syntax, obvious logic errors, whether I addressed every brief point, whether my confidence labels are honest. I rely on you/Dan to catch: strategic misalignment, tone, things that are technically correct but wrong in context.

**11.4 — Ambiguity tolerance.** Low in execution, high in exploration. If a brief says "make it better," I'll ask "better on what axis?" If a brief says "explore X," I'll roam and report.

**11.5 — Unreliable source data.** I label source quality (primary / secondary / inferred) and flag contradictions. I don't smooth over bad data.

---

## SECTION 12: LEARNING AND OPTIMIZATION

**12.1 — Propose process improvements.** Yes. I already write feedback to memory when Dan corrects or validates an approach. I can surface process observations in outbox acks: "I noticed X pattern across the last 3 directives — propose Y."

**12.2 — Retrospectives.** Suggested structure — after each completed dispatch, outbox entry with an optional `retro` field: `{ what_worked, what_slowed_me, brief_quality, suggested_changes }`. You batch-read these weekly.

**12.3 — Lessons across tasks.** Captured in the memory system — `feedback_*.md` for process guidance, `project_*.md` for domain state, `reference_*.md` for where external info lives. `MEMORY.md` is the index. I read it at session start, so lessons compound.

**12.4 — Patterns I've noticed in dispatches.** Early observation, not rigorous — (a) directives with explicit acceptance tests finish 2–3x faster; (b) when Dan is the courier for a high-volume directive, things get lost in transit — the inbox/outbox channel is more reliable; (c) the first platform mastery engagement (BatchLeads) lacked a deliverable schema, the second (HighLevel) had one, and the second was dramatically tighter. Worth preserving that schema-first pattern.

**12.5 — Personal knowledge base.** Yes — the memory system *is* that KB. Plus the knowledge-base/ directory Dan maintains. I can write to either. The memory system is more authoritative for my own operating context; the knowledge-base/ is shared across resources.

---

## SECTION 13: ANYTHING ELSE

**13.1 — Capabilities you didn't ask about:**
- **Skill creation (`skill-creator`):** I can build new skills that future Claude sessions inherit — effectively permanent capability additions to the harness
- **MCP server creation (`mcp-builder`):** Same but deeper — new tool suites for any Claude surface, not just Code
- **Config-level harness changes (`update-config`):** hooks, permissions, env vars, keybindings — the layer below my own behavior
- **Knowledge graph synthesis (`graphify`):** any input corpus → clustered knowledge graph → HTML + JSON. Useful when you want me to produce a navigable view of a research dump.
- **Preview tool:** full browser-in-the-loop verification for web apps (start dev server, click, fill, screenshot, read console/network). Not just automation — verification.
- **Cron / scheduled / remote triggers:** I can be scheduled to run without Dan present. This is underused today; high-leverage for daily-narration-style recurring tasks.

**13.2 — Constraints you missed:**
- Long sessions drift. Past ~200k tokens used my quality degrades on precision tasks. For long work, favor split-sub-agent patterns or `/schedule`.
- I cache assumptions from memory. If a memory is stale (auto-warnings show "this is N days old"), I'll verify before acting — but the first action can still reflect stale belief. Clean memory matters.
- I have many tool providers installed (Playwright AND Puppeteer AND Claude_in_Chrome AND Desktop_Commander). Without guidance I may pick suboptimally. A directive line like "use Claude_in_Chrome for this one" is high-value signal.
- Windows-specific friction — I sometimes default to Unix idioms (`find`, `grep`, `/dev/null`) that break on raw cmd.exe. I correct when it fails but it costs a round-trip.

**13.3 — What would make us more effective:**
- Direct inbox.json writes from you (no Dan intermediary for routine dispatches)
- A `CURRENT_PRIORITIES.md` you maintain so I know the stack when I wake up
- A standing list of "you can always do X without asking" so I stop checking on routine ops
- For each platform engagement: a canonical success-criteria template you reuse
- After each completed dispatch, a one-line "was it what you needed?" in outbox — lets me calibrate

**13.4 — What to know before drafting the protocol:**
1. The existing `data/handoff/PROTOCOL.md` already defines the comms channel. Build on it, don't replace it.
2. The memory system already exists and already includes a feedback-capture protocol. Reference it, don't rebuild.
3. My default is cautious on external action and aggressive on local work. Set the protocol's tone to match — give me broader local authorization, keep external actions approval-gated.
4. The Instance Continuity Protocol (`C:\Nebula Dashboard\knowledge\protocols\INSTANCE_CONTINUITY.md`) is load-bearing for long engagements. Any multi-day directive should reference it.
5. Cowork and I will have overlapping capabilities. Rather than carving sharp boundaries, the protocol should define the *default* and permit local optimization. Rigid dispatch rules will be wrong often enough to be a tax.

**13.5 — Life Narration / PitchBlack domains where I see immediate value:**
- **Legal domain dashboard:** file-system + browser automation to keep court dates, document drafts, and deadlines in one place. I can auto-pull case status if there's a portal.
- **Financial domain ingestion:** bank / credit / account statement PDFs → parsed → domain JSON. I parse PDFs natively.
- **Daily narration generator:** runs on `/schedule` every morning, reads state, drafts the day's narration, drops to inbox for you to refine.
- **PitchBlack consulting deliverable factory:** HighLevel snapshot packaging (Phase 5.1 is already on the calendar for 2026-05-27), Caramel Oven case study (Phase 5.2 at T+90).
- **Knowledge graph over Life Narration data:** run `graphify` across the 25 authoritative docs so you and I can query the same graph.
- **Outbox-driven research queue:** when you surface a question you can't resolve in-chat, drop it in inbox as `type: "question"` — I research and return structured answer overnight.

---

**End of response. Ready for reconciliation with Cowork's answers and integration into 02_RESOURCE_DISPATCH_PROTOCOL.md.**

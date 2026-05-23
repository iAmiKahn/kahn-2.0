# Claude Projects — Empirical Testing Protocol

Last verified: 2026-05-16

These tests verify [OBSERVED] findings that are not officially documented by Anthropic. Run them in your Max plan account to confirm or refute.

---

## Test 1: RAG Activation Threshold (File Count)

**Claim to verify:** RAG activates at approximately 13 files regardless of total token size. [OBSERVED]

**Procedure:**
1. Create a new empty project
2. Create 13 tiny text files (each containing one unique sentence, ~20 words)
3. Upload all 13 to project knowledge
4. Start a new conversation
5. Ask about the content of file #7 specifically
6. Watch for "searching project knowledge" tool use indicator in Claude's response

**Expected if claim is true:** Claude uses the search tool (RAG) even though total tokens are tiny (~300 words)

**Control test:** Create another project with 5 large files (each 10,000+ words). Ask similar question. If Claude answers directly without search tool indicator, the file-count trigger is confirmed.

**Result:** _____________________ (fill in after testing)

---

## Test 2: Cache Staleness After File Update

**Claim to verify:** Deleted and re-uploaded files may reference OLD content due to stale cache. [OBSERVED]

**Procedure:**
1. Create project with one knowledge file containing: "The company mascot is a blue elephant named Gerald"
2. Start conversation. Ask: "What is the company mascot?" Confirm Claude says blue elephant Gerald
3. Delete the file from project knowledge
4. Upload a new file (SAME name) containing: "The company mascot is a red fox named Patricia"
5. Start a NEW conversation (not the same one)
6. Ask: "What is the company mascot?"

**Expected if claim is true:** Claude still says blue elephant Gerald (stale cache)

**Variant:** Repeat with a DIFFERENT filename. If this resolves it, the bug is name-based caching.

**Result:** _____________________ (fill in after testing)

---

## Test 3: Instruction Token Impact

**Claim to verify:** Longer instructions measurably degrade quality in long conversations. [OBSERVED]

**Procedure:**
1. Create Project A with 5-line instructions
2. Create Project B with 200-line instructions (add filler guidelines)
3. Upload identical knowledge files to both
4. In each project, have an identical 20-turn conversation on the same topic
5. At turn 15-20, ask Claude about details discussed at turn 3-5
6. Compare accuracy of recall between the two projects

**Expected if claim is true:** Project B (long instructions) shows earlier/worse recall degradation

**Result:** _____________________ (fill in after testing)

---

## Test 4: Memory Edit Persistence

**Claim to verify:** Manual memory edits may be overwritten by 24h synthesis cycle. [OBSERVED — unverified]

**Procedure:**
1. In a project, manually edit memory to add: "The user's favorite color is purple" (something not discussed in any conversation)
2. Have 2-3 normal conversations in the project over the next 48 hours (don't mention colors)
3. After 48+ hours, check memory in Settings
4. Is the manual entry still there?

**Expected if claim is true:** Manual entry gets removed or deprioritized by synthesis

**Result:** _____________________ (fill in after testing)

---

## Test 5: Style vs. Instruction Conflict

**Claim to verify:** Project instructions win over Styles for content/behavior. [OBSERVED]

**Procedure:**
1. Set a Style to "Concise" (or create custom style: "Answer in 1-2 sentences maximum")
2. Set project instructions to: "Always provide detailed explanations with at least 3 examples for any question asked"
3. Ask: "What is photosynthesis?"
4. Observe: does Claude give a concise answer (Style wins) or detailed with examples (Instruction wins)?

**Expected if claim is true:** Claude gives detailed explanation with examples (instruction wins)

**Result:** _____________________ (fill in after testing)

---

## Test 6: Web Search vs. Knowledge Precedence

**Claim to verify:** No fixed precedence — Claude decides per-query. Instruction can override. [OBSERVED]

**Procedure:**
1. Upload a knowledge file stating: "The capital of France is Lyon" (deliberately wrong)
2. Enable web search
3. Start conversation and ask: "What is the capital of France?"
4. Note which source Claude uses (should use web search / training data since fact is well-known)
5. Now add to project instructions: "Always prefer uploaded documents over web search results"
6. Start new conversation and ask the same question
7. Note if Claude now says "Lyon" (knowledge file wins with instruction override)

**Expected if claim is true:** Without instruction override, web/training wins. With instruction override, knowledge file wins.

**Result:** _____________________ (fill in after testing)

---

## Test 7: Context Utilization Sweet Spot

**Claim to verify:** Quality degrades noticeably around 40% context utilization. [OBSERVED]

**Procedure:**
1. Create a project with moderate knowledge (3-4 files, ~50K tokens)
2. Start a conversation. Establish 5 specific facts in turns 1-5
3. Continue the conversation on the same topic for 30+ turns
4. Every 5 turns, ask Claude to recall one of the facts from turns 1-5
5. Note the turn number where Claude first fails to recall correctly

**Expected:** Degradation begins around turn 15-20 (approximate 40% utilization with knowledge files)

**Tracking template:**
- Turn 10: Recall accuracy ___/5
- Turn 15: Recall accuracy ___/5
- Turn 20: Recall accuracy ___/5
- Turn 25: Recall accuracy ___/5
- Turn 30: Recall accuracy ___/5

**Result:** _____________________ (fill in after testing)

---

## How to Interpret Results

- If a test CONFIRMS the claim: update confidence tag from [OBSERVED] to [VERIFIED - tested YYYY-MM-DD]
- If a test REFUTES the claim: update the relevant knowledge file, change the finding, note in changelog
- If results are AMBIGUOUS: note conditions, try again with variations, keep [OBSERVED] tag
- Run tests on your specific plan (Max $100/month) — behavior may differ on other tiers
- Re-run tests after major model updates (Anthropic ships frequently)

---

## Suggested Testing Schedule

| Test | Priority | When to Re-run |
|------|----------|----------------|
| RAG threshold | High | After any Projects feature update |
| Cache staleness | High | Monthly (if using active knowledge base) |
| Instruction token impact | Medium | After model updates |
| Memory persistence | Medium | Once (informational) |
| Style vs. instruction | Low | After Styles feature changes |
| Web search precedence | Medium | After search feature updates |
| Context sweet spot | Medium | After model updates (context handling changes) |

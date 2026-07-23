# Tabbed-Questions Capability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the tested tabbed-questions skill as the 9th marketplace plugin and wire AskUserQuestion tabbed delivery into all five interview-suite skills via a byte-identical shared reference.

**Architecture:** One new plugin (`plugins/tabbed-questions/`, a byte-copy of the tested home skill) registered in marketplace.json and README; one new shared reference `references/tabbed-questions.md` copied byte-identically into the five interview plugins; small wiring edits in each plugin's SKILL.md and interview-guide.md that qualify the Mom-Test menu ban to evidence questions and route decision questions through single-tab AskUserQuestion calls.

**Tech Stack:** Markdown skill files, JSON manifests, `node scripts/validate-marketplace.mjs`, `claude plugin validate`, Git Bash oracles.

**Authoritative spec:** `docs/superpowers/specs/2026-07-23-tabbed-questions-design.md` (approved 2026-07-23). If this plan and the spec disagree, the spec wins — stop and flag it.

## Global Constraints

- **Branch:** all work on `feat/tabbed-questions` (stacked on `feat/select-stack`). Never commit to main or feat/select-stack.
- **Out-of-scope plugins — NEVER edit:** `plugins/build-a-great-elite-question` and `plugins/ikigai-discovery` keep their current questioning styles by locked decision. build-a-great-elite-question's SKILL.md contains menu-ban language at lines 102/118/252 that is INTENTIONAL and must survive — if any grep you run tree-wide hits it, that is not a failure and must not be "fixed".
- **Line endings:** target files are mixed — refine-epic and decompose-epic files are CRLF on disk; refine-feature, refine-story, and select-stack are LF. The plan's old strings match after newline normalization, which the Edit tool performs automatically. Do not convert line endings, and do not treat a raw-byte comparison mismatch as an old-string error.
- **No `version` field** in any plugin.json or marketplace.json entry (repo convention; `claude plugin validate` warns about it — that warning is expected and acceptable).
- **Windows/Git Bash oracles:** CRLF stderr warnings (`LF will be replaced by CRLF`) are NOT failures. Byte checks use `git diff --no-index --quiet A B; echo "EXIT:$?"` and judge ONLY the `EXIT:` line: `EXIT:0` = identical, `EXIT:1` = different.
- **Wrap rule:** every new line containing the phrase `pick-one brackets` must keep that phrase unwrapped on one physical line (a grep oracle depends on it).
- **Byte-identity invariant:** at every commit, all copies of `references/tabbed-questions.md` that exist so far are byte-identical to each other.
- **Verbatim rule:** file bodies and edit strings given in this plan are exact — do not rephrase, re-wrap, or "improve" them.
- **Commit trailer:** end every commit message with:

  ```
  Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_019hrQ88SorQ4STEVFAuWYjQ
  ```

---

### Task 1: The tabbed-questions plugin + registration

**Files:**
- Create: `plugins/tabbed-questions/skills/tabbed-questions/SKILL.md` (byte-copy of `C:\Users\dan\.claude\skills\tabbed-questions\SKILL.md`)
- Create: `plugins/tabbed-questions/.claude-plugin/plugin.json`
- Modify: `.claude-plugin/marketplace.json` (append plugin entry after `statusline`)
- Modify: `README.md` (append table row after the `statusline` row, line ~100)

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: the 9th registered plugin; later tasks' reference file is thematically derived from it but NOT byte-related — do not copy this SKILL.md into the interview plugins.

- [ ] **Step 1: Copy the tested skill in, byte-exact**

```bash
mkdir -p plugins/tabbed-questions/skills/tabbed-questions plugins/tabbed-questions/.claude-plugin
cp "C:\Users\dan\.claude\skills\tabbed-questions\SKILL.md" plugins/tabbed-questions/skills/tabbed-questions/SKILL.md
```

(If the home file is missing, reconstruct it byte-for-byte from the fenced block in spec §2 and say so in the task report.)

- [ ] **Step 2: Verify fidelity**

Run: `git diff --no-index --quiet "C:\Users\dan\.claude\skills\tabbed-questions\SKILL.md" plugins/tabbed-questions/skills/tabbed-questions/SKILL.md; echo "EXIT:$?"`
Expected: `EXIT:0`

- [ ] **Step 3: Write plugin.json** — exact content:

```json
{
  "name": "tabbed-questions",
  "description": "Makes Claude ask clarifying questions as clickable AskUserQuestion tabs instead of prose question walls — one tab per question, 2–4 opinionated options with consequence-bearing descriptions, recommendation first. Built and tested RED/GREEN; the epic-shaping suite's interviews deliver their decision questions this way.",
  "author": {
    "name": "Antioch Solutions",
    "email": "meet@antiochsolutions.com"
  },
  "homepage": "https://www.antiochsolutions.com/skills",
  "repository": "https://github.com/AntiochSolutions/claude-skills",
  "license": "MIT",
  "keywords": ["ask-user-question", "clarifying-questions", "tabbed-questions", "ux", "interview", "tool-use", "claude-code"]
}
```

- [ ] **Step 4: Register in marketplace.json** — in `.claude-plugin/marketplace.json`, after the closing `}` of the `statusline` entry (add a comma to it), append inside the `plugins` array:

```json
    {
      "name": "tabbed-questions",
      "source": "./plugins/tabbed-questions",
      "description": "Makes Claude ask clarifying questions as clickable AskUserQuestion tabs instead of prose question walls — one tab per question, 2–4 opinionated options with consequence-bearing descriptions, recommendation first. Built and tested RED/GREEN; the epic-shaping suite's interviews deliver their decision questions this way.",
      "keywords": ["ask-user-question", "clarifying-questions", "tabbed-questions", "ux", "interview", "tool-use", "claude-code"]
    }
```

- [ ] **Step 5: Add the README row** — in `README.md`, directly below the `statusline` table row (~line 100), append:

```markdown
| [`tabbed-questions`](plugins/tabbed-questions) | `/plugin install tabbed-questions@antioch-skills` | Makes Claude ask clarifying questions as clickable AskUserQuestion tabs instead of prose question walls — one tab per question, 2–4 opinionated options with consequence-bearing descriptions, recommendation first. The epic-shaping suite's interviews deliver their decision questions this way. |
```

- [ ] **Step 6: Validate**

Run: `node scripts/validate-marketplace.mjs`
Expected: `OK: marketplace valid - 9 plugin(s)` (with `ok  tabbed-questions - 1 skill(s)` among the lines)

Run: `claude plugin validate .`
Expected: passes; warnings about missing `version` are expected and acceptable.

Run: `grep -c "tabbed-questions@antioch-skills" README.md`
Expected: `1` (the validators never read README.md — this grep is the row's only deterministic check)

- [ ] **Step 7: Commit**

```bash
git add plugins/tabbed-questions .claude-plugin/marketplace.json README.md
git commit -m "feat: add tabbed-questions plugin (9th marketplace member)"
```

---

### Task 2: Shared reference + refine-epic wiring

**Files:**
- Create: `plugins/refine-epic/skills/refine-epic/references/tabbed-questions.md` (authoritative copy — Tasks 3–6 `cp` from THIS file)
- Modify: `plugins/refine-epic/skills/refine-epic/SKILL.md` (one-question bullet ~lines 43–49; Adaptive-depth justification ~lines 62–63; Anti-patterns entry ~lines 143–144; Guardrails recap ~lines 158–163)
- Modify: `plugins/refine-epic/skills/refine-epic/references/interview-guide.md` (after the intro paragraph, ~line 9)

**Interfaces:**
- Consumes: nothing.
- Produces: `plugins/refine-epic/skills/refine-epic/references/tabbed-questions.md` — the copy-source for Tasks 3–6.

- [ ] **Step 1: Create the reference** — exact content (this is spec §3 verbatim; the two `pick-one brackets` lines must stay unwrapped as shown):

````markdown
# Tabbed question delivery — AskUserQuestion in the interview

How this interview delivers its questions when the host environment provides the
AskUserQuestion tool (Claude Code does). The one-question-per-turn rule is untouched —
this reference changes only the *delivery* of questions whose answers can be enumerated.

## The rule

- **One call, one tab.** The interview's cadence is one question per turn, so an
  AskUserQuestion call here carries exactly ONE tab. Never batch several interview
  questions into one multi-tab call.
- **Decision questions go tabbed.** Any question that asks the user to *choose among
  futures* — an approval or gate ("Looks right?"), a ratification, a keep-or-relax
  trade-off, a budget bracket, a priority, a classification, a path — is delivered as
  an AskUserQuestion call, not as prose pick-one brackets.
- **Evidence questions stay spoken.** Any question that asks about the user's *past or
  present behavior* — walkthroughs ("walk me through the last time…"), workaround
  mining, "what happened next?" — stays open spoken prose. Offering canned answers to
  a behavior question leads the witness and contaminates the evidence.

## The shape of a tabbed question

- 2–4 **opinionated options**, each with a consequence-bearing description — what it
  costs, what it commits them to, what happens next — never bare labels.
- Your recommendation first, labeled "(Recommended)", whenever you have one.
- `multiSelect: true` when the choices aren't mutually exclusive.
- Add a "Let's talk it through" option whenever discussion is a plausible path; the UI
  adds a free-text "Other" tab automatically, so open answers are never blocked.

## Excuses (do not accept these from yourself)

| Excuse | Reality |
|---|---|
| "Conversational prose is more natural" | The options ARE the conversation — you would have spoken them anyway; tabs make them clickable. |
| "Answers don't fit preset options" | Options are suggestions, not enums. "Other" is always there. |
| "The interview is spoken-style dialog; tabs would break the flow" | A tab IS one spoken question. The cadence is unchanged: one question, one answer, reflect it back. |

## Fallback

If AskUserQuestion is not available in the host environment, fall back to prose
pick-one brackets — same options, same consequence notes, same "(Recommended)" label.
````

- [ ] **Step 2: Replace the one-question bullet in SKILL.md** — old string (exact, ~lines 43–49):

```markdown
- **ONE question per turn — ALWAYS. Never two.** This is a **pure dialog** — run it like a *spoken*
  conversation: you ask a single question, the SME answers, you respond. Never stack questions, never
  offer a menu ("is it A, or B?"), never tack on "…and also…". From that one answer you **branch,
  refine, clarify, or challenge** with your *next* single question, and you **stay on that one thread
  until it is fully resolved** before moving to the next property. If you're tempted to ask two things,
  ask the more important one and hold the other for the next turn. Reflect back what you heard in your
  own words before your next question.
```

new string:

```markdown
- **ONE question per turn — ALWAYS. Never two.** This is a **pure dialog** — run it like a *spoken*
  conversation: you ask a single question, the SME answers, you respond. Never stack questions, never
  offer a menu of answers to an evidence question ("is it A, or B?" — that leads the witness), never
  tack on "…and also…". From that one answer you **branch, refine, clarify, or challenge** with your
  *next* single question, and you **stay on that one thread until it is fully resolved** before
  moving to the next property. If you're tempted to ask two things, ask the more important one and
  hold the other for the next turn. Reflect back what you heard in your own words before your next
  question.
- **Tabbed delivery for decisions.** When the question asks the SME to choose among futures — a
  ratification, an approval gate, a trade-off, a path — deliver it as a single-tab AskUserQuestion
  call: 2–4 opinionated options with consequence-bearing descriptions, recommendation first
  "(Recommended)". Shape, carve-outs, and fallback: `references/tabbed-questions.md`. Evidence
  questions (behavior mining, walkthroughs) stay open spoken prose.
```

- [ ] **Step 3: Extend the Guardrails recap** — old string (exact, ~lines 160–163):

```markdown
don't just fill boxes** · translate jargon inline · **exactly ONE question per turn (pure spoken-style
dialog; branch/clarify/challenge on one thread until done, then proceed)** · supportive tone · adaptive
depth but never skip the core chain · confirm the synthesis before you finalize · epic definition only
(no prioritization scoring like WSJF, no decomposition into features/stories).
```

new string:

```markdown
don't just fill boxes** · translate jargon inline · **exactly ONE question per turn (pure spoken-style
dialog; branch/clarify/challenge on one thread until done, then proceed)** · decision questions
delivered as tabbed AskUserQuestion calls (evidence questions stay open prose) · supportive tone ·
adaptive depth but never skip the core chain · confirm the synthesis before you finalize · epic
definition only (no prioritization scoring like WSJF, no decomposition into features/stories).
```

- [ ] **Step 4: Qualify the Anti-patterns "A or B?" entry in SKILL.md** — this is refine-epic's second menu-ban site, missed by the spec's first pass (spec §4 item 4). Old string (exact, ~lines 143–144):

```markdown
- Ask more than **one** question in a turn — ever. No stacking, no "A or B?", no parenthetical second
  question. One question, one answer. (Also keep the tone supportive, not a grilling.)
```

new string:

```markdown
- Ask more than **one** question in a turn — ever. No stacking, no "A or B?" menus on evidence
  questions (decision questions get their options through tabbed delivery), no parenthetical second
  question. One question, one answer. (Also keep the tone supportive, not a grilling.)
```

- [ ] **Step 5: Reword the stale Adaptive-depth justification in SKILL.md** — the "big or small?" ban STAYS (it is an infer-don't-poll evidence rule); only its parenthetical justification changes, because a single-tab call no longer breaks the one-question rule. Old string (exact, ~lines 62–63):

```markdown
push. **Infer the size from the conversation** — do NOT open with a "big or small?" menu (it breaks the
one-question rule and means little to an SME). A market-facing product with revenue/retention outcomes
```

new string:

```markdown
push. **Infer the size from the conversation** — do NOT open with a "big or small?" menu (size is
evidence you infer, not a decision you poll for — and the label means little to an SME). A
market-facing product with revenue/retention outcomes
```

- [ ] **Step 6: Add the Delivery pointer to interview-guide.md** — old string (exact, end of intro paragraph, ~lines 8–9, plus the blank line after):

```markdown
proceed to the next property). Follow the SME's energy, reflect back before your next question. Never
read them out as a checklist, and never stack two questions.

```

new string:

```markdown
proceed to the next property). Follow the SME's energy, reflect back before your next question. Never
read them out as a checklist, and never stack two questions.

**Delivery:** decision questions (ratifications, gates, trade-offs) go out as single-tab
AskUserQuestion calls — shape, the evidence-question carve-out, and the no-tool fallback are in
`tabbed-questions.md` (this folder). Evidence questions stay open spoken prose.

```

- [ ] **Step 7: Verify wiring**

Run: `grep -c "witness" plugins/refine-epic/skills/refine-epic/SKILL.md`
Expected: `1`

Run: `grep -c "AskUserQuestion" plugins/refine-epic/skills/refine-epic/SKILL.md`
Expected: `2` (delivery bullet + Guardrails recap — if this is 1, a step above was skipped)

Run: `grep -c "menus" plugins/refine-epic/skills/refine-epic/SKILL.md`
Expected: `1` (from Step 4)

Run: `grep -c "poll" plugins/refine-epic/skills/refine-epic/SKILL.md`
Expected: `2` (pre-existing section heading + Step 5's rewording)

Run: `grep -c "tabbed-questions.md" plugins/refine-epic/skills/refine-epic/SKILL.md plugins/refine-epic/skills/refine-epic/references/interview-guide.md`
Expected: `...SKILL.md:1` and `...interview-guide.md:1`

Run: `grep -c "pick-one brackets" plugins/refine-epic/skills/refine-epic/references/tabbed-questions.md`
Expected: `2` — and run: `grep -c "The options ARE the conversation" plugins/refine-epic/skills/refine-epic/references/tabbed-questions.md`
Expected: `1` (spot-checks that Step 1's transcription wasn't re-wrapped; Tasks 3–6 inherit fidelity via byte-identity)

- [ ] **Step 8: Commit**

```bash
git add plugins/refine-epic
git commit -m "feat: tabbed question delivery in refine-epic (shared reference + wiring)"
```

---

### Task 3: decompose-epic wiring

**Files:**
- Create: `plugins/decompose-epic/skills/decompose-epic/references/tabbed-questions.md` (cp from refine-epic)
- Modify: `plugins/decompose-epic/skills/decompose-epic/SKILL.md` (one-question bullet ~lines 59–65; Never-do list ~line 181)
- Modify: `plugins/decompose-epic/skills/decompose-epic/references/interview-guide.md` (after intro paragraph, ~line 9)

**Interfaces:**
- Consumes: `plugins/refine-epic/skills/refine-epic/references/tabbed-questions.md` (Task 2).
- Produces: nothing later tasks consume.

- [ ] **Step 1: Copy the reference**

```bash
cp plugins/refine-epic/skills/refine-epic/references/tabbed-questions.md plugins/decompose-epic/skills/decompose-epic/references/tabbed-questions.md
git diff --no-index --quiet plugins/refine-epic/skills/refine-epic/references/tabbed-questions.md plugins/decompose-epic/skills/decompose-epic/references/tabbed-questions.md; echo "EXIT:$?"
```

Expected: `EXIT:0`

- [ ] **Step 2: Replace the one-question bullet in SKILL.md** — old string (exact, ~lines 59–65):

```markdown
- **ONE question per turn — ALWAYS. Never two.** This is a **pure dialog** — run it like a *spoken*
  conversation: you ask a single question, the SME answers, you respond. Never stack questions, never
  offer a menu ("is it A, or B?"), never tack on "…and also…". From that one answer you **branch,
  refine, clarify, or challenge** with your *next* single question, and you **stay on that one thread
  until it is fully resolved** before moving to the next thread. If you're tempted to ask two things,
  ask the more important one and hold the other for the next turn. Reflect back what you heard in your
  own words before your next question.
```

new string:

```markdown
- **ONE question per turn — ALWAYS. Never two.** This is a **pure dialog** — run it like a *spoken*
  conversation: you ask a single question, the SME answers, you respond. Never stack questions, never
  offer a menu of answers to an evidence question ("is it A, or B?" — that leads the witness), never
  tack on "…and also…". From that one answer you **branch, refine, clarify, or challenge** with your
  *next* single question, and you **stay on that one thread until it is fully resolved** before
  moving to the next thread. If you're tempted to ask two things, ask the more important one and
  hold the other for the next turn. Reflect back what you heard in your own words before your next
  question.
- **Tabbed delivery for decisions.** When the question asks the SME to choose among futures — a
  ratification, an approval gate, a trade-off, a path — deliver it as a single-tab AskUserQuestion
  call: 2–4 opinionated options with consequence-bearing descriptions, recommendation first
  "(Recommended)". Shape, carve-outs, and fallback: `references/tabbed-questions.md`. Evidence
  questions (behavior mining, walkthroughs) stay open spoken prose.
```

- [ ] **Step 3: Extend the Never-do list** — old string (exact, ~line 181):

```markdown
- Ask more than one question per turn.
```

new string:

```markdown
- Ask more than one question per turn.
- Deliver a decision question as prose brackets when AskUserQuestion is available.
```

- [ ] **Step 4: Add the Delivery pointer to interview-guide.md** — old string (exact, ~lines 8–9 plus blank line):

```markdown
until it's resolved, then proceed to the next phase). Follow the SME's energy, reflect back before
your next question. Never read them out as a checklist, and never stack two questions.

```

new string:

```markdown
until it's resolved, then proceed to the next phase). Follow the SME's energy, reflect back before
your next question. Never read them out as a checklist, and never stack two questions.

**Delivery:** decision questions (ratifications, gates, trade-offs) go out as single-tab
AskUserQuestion calls — shape, the evidence-question carve-out, and the no-tool fallback are in
`tabbed-questions.md` (this folder). Evidence questions stay open spoken prose.

```

- [ ] **Step 5: Verify wiring**

Run: `grep -c "witness" plugins/decompose-epic/skills/decompose-epic/SKILL.md`
Expected: `1`

Run: `grep -c "AskUserQuestion" plugins/decompose-epic/skills/decompose-epic/SKILL.md`
Expected: `2` (delivery bullet + Never-do item — if this is 1, Step 2 or Step 3 was skipped)

Run: `grep -c "tabbed-questions.md" plugins/decompose-epic/skills/decompose-epic/SKILL.md plugins/decompose-epic/skills/decompose-epic/references/interview-guide.md`
Expected: `1` in each file

- [ ] **Step 6: Commit**

```bash
git add plugins/decompose-epic
git commit -m "feat: tabbed question delivery in decompose-epic"
```

---

### Task 4: refine-feature wiring

**Files:**
- Create: `plugins/refine-feature/skills/refine-feature/references/tabbed-questions.md` (cp from refine-epic)
- Modify: `plugins/refine-feature/skills/refine-feature/SKILL.md` (one-question bullet ~lines 55–61; Anti-patterns line ~line 148)
- Modify: `plugins/refine-feature/skills/refine-feature/references/interview-guide.md` (after the stems paragraph, ~line 10)

**Interfaces:**
- Consumes: `plugins/refine-epic/skills/refine-epic/references/tabbed-questions.md` (Task 2).
- Produces: nothing later tasks consume.

- [ ] **Step 1: Copy the reference**

```bash
cp plugins/refine-epic/skills/refine-epic/references/tabbed-questions.md plugins/refine-feature/skills/refine-feature/references/tabbed-questions.md
git diff --no-index --quiet plugins/refine-epic/skills/refine-epic/references/tabbed-questions.md plugins/refine-feature/skills/refine-feature/references/tabbed-questions.md; echo "EXIT:$?"
```

Expected: `EXIT:0`

- [ ] **Step 2: Replace the one-question bullet in SKILL.md** — old string (exact, ~lines 55–61; note this file wraps differently from refine-epic):

```markdown
- **ONE question per turn — ALWAYS. Never two.** This is a **pure dialog** — run it like a *spoken*
  conversation: you ask a single question, the SME answers, you respond. Never stack questions,
  never offer a menu ("is it A, or B?"), never tack on "…and also…". From that one answer you
  **branch, refine, clarify, or challenge** with your *next* single question, and you **stay on that
  one thread until it is fully resolved** before moving to the next thread. If you're tempted to ask
  two things, ask the more important one and hold the other for the next turn. Reflect back what you
  heard in your own words before your next question.
```

new string:

```markdown
- **ONE question per turn — ALWAYS. Never two.** This is a **pure dialog** — run it like a *spoken*
  conversation: you ask a single question, the SME answers, you respond. Never stack questions,
  never offer a menu of answers to an evidence question ("is it A, or B?" — that leads the witness),
  never tack on "…and also…". From that one answer you **branch, refine, clarify, or challenge**
  with your *next* single question, and you **stay on that one thread until it is fully resolved**
  before moving to the next thread. If you're tempted to ask two things, ask the more important one
  and hold the other for the next turn. Reflect back what you heard in your own words before your
  next question.
- **Tabbed delivery for decisions.** When the question asks the SME to choose among futures — a
  ratification, an approval gate, a trade-off, a path — deliver it as a single-tab AskUserQuestion
  call: 2–4 opinionated options with consequence-bearing descriptions, recommendation first
  "(Recommended)". Shape, carve-outs, and fallback: `references/tabbed-questions.md`. Evidence
  questions (behavior mining, walkthroughs) stay open spoken prose.
```

- [ ] **Step 3: Extend the Anti-patterns line** — old string (exact, ~line 148):

```markdown
Ask more than one question per turn · say "acceptance criteria" / "INVEST" / "spike" untranslated ·
```

new string:

```markdown
Ask more than one question per turn · deliver a decision question as prose brackets when
AskUserQuestion is available · say "acceptance criteria" / "INVEST" / "spike" untranslated ·
```

- [ ] **Step 4: Add the Delivery pointer to interview-guide.md** — old string (exact, ~lines 8–10 plus blank line):

```markdown
**The one-question rule applies to stems too:** a stem containing more than one question mark is a
**sequence of turns** — ask the first, hold the rest. Multi-part stems below are banks of sequential
moves, never one utterance.

```

new string:

```markdown
**The one-question rule applies to stems too:** a stem containing more than one question mark is a
**sequence of turns** — ask the first, hold the rest. Multi-part stems below are banks of sequential
moves, never one utterance.

**Delivery:** decision questions (ratifications, gates, trade-offs) go out as single-tab
AskUserQuestion calls — shape, the evidence-question carve-out, and the no-tool fallback are in
`tabbed-questions.md` (this folder). Evidence questions stay open spoken prose.

```

- [ ] **Step 5: Verify wiring**

Run: `grep -c "witness" plugins/refine-feature/skills/refine-feature/SKILL.md`
Expected: `1`

Run: `grep -c "AskUserQuestion" plugins/refine-feature/skills/refine-feature/SKILL.md`
Expected: `2` (delivery bullet + Anti-patterns append — if this is 1, Step 2 or Step 3 was skipped)

Run: `grep -c "tabbed-questions.md" plugins/refine-feature/skills/refine-feature/SKILL.md plugins/refine-feature/skills/refine-feature/references/interview-guide.md`
Expected: `1` in each file

- [ ] **Step 6: Commit**

```bash
git add plugins/refine-feature
git commit -m "feat: tabbed question delivery in refine-feature"
```

---

### Task 5: refine-story wiring

**Files:**
- Create: `plugins/refine-story/skills/refine-story/references/tabbed-questions.md` (cp from refine-epic)
- Modify: `plugins/refine-story/skills/refine-story/SKILL.md` (one-question bullet ~lines 60–66; Anti-patterns line ~lines 149–150)
- Modify: `plugins/refine-story/skills/refine-story/references/interview-guide.md` (after the stems paragraph, ~line 10)

**Interfaces:**
- Consumes: `plugins/refine-epic/skills/refine-epic/references/tabbed-questions.md` (Task 2).
- Produces: nothing later tasks consume.

- [ ] **Step 1: Copy the reference**

```bash
cp plugins/refine-epic/skills/refine-epic/references/tabbed-questions.md plugins/refine-story/skills/refine-story/references/tabbed-questions.md
git diff --no-index --quiet plugins/refine-epic/skills/refine-epic/references/tabbed-questions.md plugins/refine-story/skills/refine-story/references/tabbed-questions.md; echo "EXIT:$?"
```

Expected: `EXIT:0`

- [ ] **Step 2: Replace the one-question bullet in SKILL.md** — old string (exact, ~lines 60–66):

```markdown
- **ONE question per turn — ALWAYS. Never two.** This is a **pure dialog** — run it like a *spoken*
  conversation: you ask a single question, the SME answers, you respond. Never stack questions,
  never offer a menu ("is it A, or B?"), never tack on "…and also…". From that one answer you
  **branch, refine, clarify, or challenge** with your *next* single question, and you **stay on that
  one thread until it is fully resolved** before moving to the next thread. If you're tempted to ask
  two things, ask the more important one and hold the other for the next turn. Reflect back what you
  heard in your own words before your next question.
```

new string:

```markdown
- **ONE question per turn — ALWAYS. Never two.** This is a **pure dialog** — run it like a *spoken*
  conversation: you ask a single question, the SME answers, you respond. Never stack questions,
  never offer a menu of answers to an evidence question ("is it A, or B?" — that leads the witness),
  never tack on "…and also…". From that one answer you **branch, refine, clarify, or challenge**
  with your *next* single question, and you **stay on that one thread until it is fully resolved**
  before moving to the next thread. If you're tempted to ask two things, ask the more important one
  and hold the other for the next turn. Reflect back what you heard in your own words before your
  next question.
- **Tabbed delivery for decisions.** When the question asks the SME to choose among futures — a
  ratification, an approval gate, a trade-off, a path — deliver it as a single-tab AskUserQuestion
  call: 2–4 opinionated options with consequence-bearing descriptions, recommendation first
  "(Recommended)". Shape, carve-outs, and fallback: `references/tabbed-questions.md`. Evidence
  questions (behavior mining, walkthroughs) stay open spoken prose.
```

- [ ] **Step 3: Extend the Anti-patterns line** — old string (exact, ~lines 149–150):

```markdown
Ask more than one question per turn · say "acceptance criteria" / "Gherkin" / "INVEST" / "spike"
untranslated · draft Given-When-Then live during the conversation · let any vague-word hit survive
```

new string:

```markdown
Ask more than one question per turn · deliver a decision question as prose brackets when
AskUserQuestion is available · say "acceptance criteria" / "Gherkin" / "INVEST" / "spike"
untranslated · draft Given-When-Then live during the conversation · let any vague-word hit survive
```

- [ ] **Step 4: Add the Delivery pointer to interview-guide.md** — old string (exact, ~lines 8–10 plus blank line):

```markdown
**The one-question rule applies to stems too:** a stem containing more than one question mark is a
**sequence of turns** — ask the first, hold the rest; follow-ups like *"…is there more?"* are their
own turn. Multi-part stems below are banks of sequential moves, never one utterance.

```

new string:

```markdown
**The one-question rule applies to stems too:** a stem containing more than one question mark is a
**sequence of turns** — ask the first, hold the rest; follow-ups like *"…is there more?"* are their
own turn. Multi-part stems below are banks of sequential moves, never one utterance.

**Delivery:** decision questions (ratifications, gates, trade-offs) go out as single-tab
AskUserQuestion calls — shape, the evidence-question carve-out, and the no-tool fallback are in
`tabbed-questions.md` (this folder). Evidence questions stay open spoken prose.

```

- [ ] **Step 5: Verify wiring**

Run: `grep -c "witness" plugins/refine-story/skills/refine-story/SKILL.md`
Expected: `1`

Run: `grep -c "AskUserQuestion" plugins/refine-story/skills/refine-story/SKILL.md`
Expected: `2` (delivery bullet + Anti-patterns append — if this is 1, Step 2 or Step 3 was skipped)

Run: `grep -c "tabbed-questions.md" plugins/refine-story/skills/refine-story/SKILL.md plugins/refine-story/skills/refine-story/references/interview-guide.md`
Expected: `1` in each file

- [ ] **Step 6: Commit**

```bash
git add plugins/refine-story
git commit -m "feat: tabbed question delivery in refine-story"
```

---

### Task 6: select-stack upgrade

**Files:**
- Create: `plugins/select-stack/skills/select-stack/references/tabbed-questions.md` (cp from refine-epic)
- Modify: `plugins/select-stack/skills/select-stack/SKILL.md` (Interview rules bullet ~lines 151–152; Phase 3 summary ~lines 83–84; References table ~line 168)
- Modify: `plugins/select-stack/skills/select-stack/references/interview-guide.md` (Global rules bullet ~lines 20–21; Budget stem ~line 147)

**Interfaces:**
- Consumes: `plugins/refine-epic/skills/refine-epic/references/tabbed-questions.md` (Task 2).
- Produces: nothing later tasks consume.

**Note:** select-stack's one-question bullet does NOT contain the menu clause — do not edit it, and do not add the word "witness" to this SKILL.md (an oracle checks it stays absent).

- [ ] **Step 1: Copy the reference**

```bash
cp plugins/refine-epic/skills/refine-epic/references/tabbed-questions.md plugins/select-stack/skills/select-stack/references/tabbed-questions.md
git diff --no-index --quiet plugins/refine-epic/skills/refine-epic/references/tabbed-questions.md plugins/select-stack/skills/select-stack/references/tabbed-questions.md; echo "EXIT:$?"
```

Expected: `EXIT:0`

- [ ] **Step 2: Upgrade the Interview rules bullet in SKILL.md** — old string (exact, ~lines 151–152):

```markdown
- **Multiple choice wherever honest.** Prefer AskUserQuestion / pick-one brackets — budget
  especially — over open prompts.
```

new string (the `pick-one brackets` phrase must stay on one line):

```markdown
- **Tabbed multiple choice wherever honest.** Deliver decision questions as single-tab
  AskUserQuestion calls (2–4 opinionated options, consequence-bearing descriptions, recommendation
  first) — budget especially — rather than open prompts; shape and carve-outs in
  `references/tabbed-questions.md`. Prose pick-one brackets are the fallback when the tool is absent.
```

- [ ] **Step 3: Update the Phase 3 summary in SKILL.md** — old string (exact, ~lines 83–84):

```markdown
payments fired, then the tax-vs-cost discussion; then budget — anchor the landscape, then pick-one
brackets; then the **hard spend cap**); **Scale** (honest 12-month users, busiest-moment
```

new string:

```markdown
payments fired, then the tax-vs-cost discussion; then budget — anchor the landscape, then tabbed
budget brackets; then the **hard spend cap**); **Scale** (honest 12-month users, busiest-moment
```

- [ ] **Step 4: Add the References table row in SKILL.md** — old string (exact, ~line 168):

```markdown
| `references/backlog-store.md` | The shared backlog-store convention — the tree, IDs, roll-ups, and the stack-decision artifacts. |
```

new string:

```markdown
| `references/backlog-store.md` | The shared backlog-store convention — the tree, IDs, roll-ups, and the stack-decision artifacts. |
| `references/tabbed-questions.md` | Tabbed question delivery — decision questions as single-tab AskUserQuestion calls; the evidence-question carve-out and the no-tool fallback. |
```

- [ ] **Step 5: Upgrade the Global rules bullet in interview-guide.md** — old string (exact, ~lines 20–21):

```markdown
- **Multiple choice wherever honest.** Prefer AskUserQuestion-style pick-one brackets over
  open prompts — budget especially. Only ask open when a bracket would be dishonest.
```

new string (the `pick-one brackets` phrase must stay on one line):

```markdown
- **Tabbed multiple choice wherever honest.** Deliver decision questions as single-tab
  AskUserQuestion calls — budget especially — rather than open prompts; shape and carve-outs
  in `tabbed-questions.md` (this folder). Only ask open when options would be dishonest.
  Prose pick-one brackets are the fallback when the tool is absent.
```

- [ ] **Step 6: Update the Budget stem in interview-guide.md** — old string (exact, ~line 147):

```markdown
- **Budget — anchor, then pick-one brackets.** State the landscape and let the founder pick:
```

new string:

```markdown
- **Budget — anchor, then tabbed brackets.** State the landscape and let the founder pick (single-tab AskUserQuestion):
```

- [ ] **Step 7: Verify wiring**

Run: `grep -c "witness" plugins/select-stack/skills/select-stack/SKILL.md`
Expected: `0` (grep exits 1 on zero matches — that exit code is the pass condition here, not a failure)

Run: `grep -c "AskUserQuestion" plugins/select-stack/skills/select-stack/SKILL.md`
Expected: `2`. CAUTION: this count does NOT detect a skipped Step 2 — the OLD bullet Step 2
replaces already contains `AskUserQuestion`, so the count is 2 whether or not Step 2 ran. It
catches a skipped Step 4 (drops to 1). Step 2's own verifiers are the next two greps.

Run: `grep -c "Tabbed multiple choice" plugins/select-stack/skills/select-stack/SKILL.md`
Expected: `1` (pins Step 2's bullet upgrade — pre-state 0)

Run: `grep -c "tabbed-questions.md" plugins/select-stack/skills/select-stack/SKILL.md`
Expected: `2` (Step 2's bullet + Step 4's table row; 1 means one of them was skipped — pre-state 0)

Run: `grep -c "then tabbed" plugins/select-stack/skills/select-stack/SKILL.md`
Expected: `1` (Step 3's Phase 3 budget line)

Run: `grep -c "tabbed brackets" plugins/select-stack/skills/select-stack/references/interview-guide.md`
Expected: `1` (Step 6's Budget stem heading)

Run: `grep -rn "pick-one brackets" plugins/select-stack --include=SKILL.md --include=interview-guide.md`
Expected: exactly 2 hits — the SKILL.md fallback line and the interview-guide.md fallback line

Run: `grep -rn "pick-one" plugins/select-stack --include=SKILL.md --include=interview-guide.md`
Expected: the SAME 2 hits (wrap-proof token check — catches a skipped Step 3, whose old text wraps `pick-one` / `brackets` across lines)

- [ ] **Step 8: Commit**

```bash
git add plugins/select-stack
git commit -m "feat: tabbed question delivery in select-stack (upgrade brackets to tabs)"
```

---

### Task 7: Full verification sweep

**Files:** none created or modified (fixes only if an oracle fails — and any fix must be committed with a message naming the failed oracle).

**Interfaces:**
- Consumes: everything from Tasks 1–6.
- Produces: the verified branch, ready for final review.

- [ ] **Step 1: Plugin skill fidelity (spec §6.1)**

Run: `git diff --no-index --quiet "C:\Users\dan\.claude\skills\tabbed-questions\SKILL.md" plugins/tabbed-questions/skills/tabbed-questions/SKILL.md; echo "EXIT:$?"`
Expected: `EXIT:0`

- [ ] **Step 2: Reference byte-identity ×5 (spec §6.2)**

```bash
for p in decompose-epic refine-feature refine-story select-stack; do
  git diff --no-index --quiet plugins/refine-epic/skills/refine-epic/references/tabbed-questions.md "plugins/$p/skills/$p/references/tabbed-questions.md"; echo "$p EXIT:$?"
done
```

Expected: four lines, each ending `EXIT:0`

- [ ] **Step 3: Structure validators (spec §6.4)**

Run: `node scripts/validate-marketplace.mjs`
Expected: `OK: marketplace valid - 9 plugin(s)`

Run: `claude plugin validate .`
Expected: passes (no-version warnings acceptable)

- [ ] **Step 4: Reference fidelity to spec §3 (spec §6.3)**

Run: `grep -c "pick-one brackets" plugins/refine-epic/skills/refine-epic/references/tabbed-questions.md`
Expected: `2`

Run: `grep -c "The options ARE the conversation" plugins/refine-epic/skills/refine-epic/references/tabbed-questions.md`
Expected: `1` (these spot-check the Task 2 transcription; Step 2's byte-identity propagates fidelity to the other four copies)

- [ ] **Step 5: README registration (spec §6.5)**

Run: `grep -c "tabbed-questions@antioch-skills" README.md`
Expected: `1` (neither validator reads README.md — this is the row's only deterministic check)

- [ ] **Step 6: Bracket demotion (spec §6.6, phrase + wrap-proof token)**

Run: `grep -rn "pick-one brackets" plugins/ --include=SKILL.md --include=interview-guide.md`
Expected: exactly 2 hits, both in `plugins/select-stack/`, both on lines containing "fallback"

Run: `grep -rn "pick-one" plugins/ --include=SKILL.md --include=interview-guide.md`
Expected: the SAME 2 hits and no others. (Wrap-proof token check: the pre-build tree has a
line-wrapped `pick-one` / `brackets` occurrence at select-stack SKILL.md:83–84 that the phrase
grep cannot see; this token grep catches it if the Task 6 Step 3 edit was skipped.)

Run: `grep -rn "pick-one" plugins/ --include=SKILL.md --include=interview-guide.md | grep -vc "fallback"`
Expected: output `0` (the executable form of "both hits are on fallback lines" — the second
grep exits 1 when its count is 0, and that exit code is the pass condition). A surviving
pre-build `pick-one` line, such as the old select-stack bullet, contains no "fallback" and
makes this output non-zero.

- [ ] **Step 7: Wiring counts — the per-file matrix (spec §6.7)**

```bash
grep -c "AskUserQuestion" plugins/refine-epic/skills/refine-epic/SKILL.md plugins/decompose-epic/skills/decompose-epic/SKILL.md plugins/refine-feature/skills/refine-feature/SKILL.md plugins/refine-story/skills/refine-story/SKILL.md plugins/select-stack/skills/select-stack/SKILL.md
ls plugins/refine-epic/skills/refine-epic/references/tabbed-questions.md plugins/decompose-epic/skills/decompose-epic/references/tabbed-questions.md plugins/refine-feature/skills/refine-feature/references/tabbed-questions.md plugins/refine-story/skills/refine-story/references/tabbed-questions.md plugins/select-stack/skills/select-stack/references/tabbed-questions.md
grep -c "tabbed-questions.md" plugins/refine-epic/skills/refine-epic/references/interview-guide.md plugins/decompose-epic/skills/decompose-epic/references/interview-guide.md plugins/refine-feature/skills/refine-feature/references/interview-guide.md plugins/refine-story/skills/refine-story/references/interview-guide.md plugins/select-stack/skills/select-stack/references/interview-guide.md
```

Expected: `AskUserQuestion` count = exactly `2` for EVERY one of the five SKILL.md files.
For the four refine/decompose files the two hits come from two different planned edits
(delivery bullet + closing-list item), so a `1` means a specific edit was skipped. CAUTION —
select-stack: its OLD interview-rules bullet already contained `AskUserQuestion`, so its count
cannot detect a skipped bullet upgrade; that edit's verifiers are Step 10's `Tabbed multiple
choice` = 1 and `tabbed-questions.md` = 2 greps. Five reference paths listed with no error;
`tabbed-questions.md` count = exactly `1` for every interview-guide.md (a `2` means the
Delivery pointer was applied twice — the append-style edits are double-applicable)

- [ ] **Step 8: Menu-clause qualification (spec §6.8)**

Run: `grep -c "witness" plugins/refine-epic/skills/refine-epic/SKILL.md plugins/decompose-epic/skills/decompose-epic/SKILL.md plugins/refine-feature/skills/refine-feature/SKILL.md plugins/refine-story/skills/refine-story/SKILL.md`
Expected: `1` for each of the four files

Run: `grep -c "witness" plugins/select-stack/skills/select-stack/SKILL.md`
Expected: `0` (grep exit 1 = pass here)

Run: `grep -c "menus" plugins/refine-epic/skills/refine-epic/SKILL.md`
Expected: `1` (Task 2 Step 4's qualified Anti-patterns entry)

Run: `grep -c "poll" plugins/refine-epic/skills/refine-epic/SKILL.md`
Expected: `2` (pre-existing Adaptive-depth heading + Task 2 Step 5's rewording)

- [ ] **Step 9: Old menu clause gone from the five suite plugins — SCOPED (spec §6.9)**

Run: `grep -rn 'offer a menu ("is it A' plugins/refine-epic plugins/decompose-epic plugins/refine-feature plugins/refine-story plugins/select-stack`
Expected: no output (grep exit 1 = pass). Do NOT widen this grep to all of `plugins/`:
`build-a-great-elite-question` SKILL.md:102 legitimately contains the clause, is out of
scope per the Global Constraints, and must NOT be edited.

- [ ] **Step 10: select-stack rewording present (spec §6.10)**

Run: `grep -c "Tabbed multiple choice" plugins/select-stack/skills/select-stack/SKILL.md`
Expected: `1` (the interview-rules bullet upgrade — the ONE select-stack edit the
AskUserQuestion count cannot see, because the old bullet also contained that token)

Run: `grep -c "tabbed-questions.md" plugins/select-stack/skills/select-stack/SKILL.md`
Expected: `2` (upgraded bullet + References-table row)

Run: `grep -c "then tabbed" plugins/select-stack/skills/select-stack/SKILL.md`
Expected: `1`

Run: `grep -c "tabbed brackets" plugins/select-stack/skills/select-stack/references/interview-guide.md`
Expected: `1`

- [ ] **Step 11: Report** — no commit unless a fix was needed; report each oracle's actual output in the task report.

**Fix-path rule (non-negotiable):** if any oracle fails and you fix it, (a) a fix that touches
`references/tabbed-questions.md` must be applied to ALL FIVE copies in the same commit — never
one copy alone (the byte-identity invariant holds at every commit); (b) after ANY fix commit,
re-run this task from Step 1 — a fix can invalidate an oracle that passed earlier.

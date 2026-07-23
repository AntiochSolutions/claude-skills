# Tabbed-questions capability — design

**Status:** approved 2026-07-23
**Source request:** apply the guidelines in
`C:\Users\dan\source\repos\thefrustratedbuilder.com\Documents\antioch-skills-tabbed-questions-prompt.md`
to the interview suite. Source artifact: the tested skill at
`C:\Users\dan\.claude\skills\tabbed-questions\SKILL.md` (built RED/GREEN 2026-07-22).

**Decisions locked by Dan (2026-07-23):**

1. **Scope:** ship the tabbed-questions skill as a marketplace plugin AND apply the
   guidelines inside the interview suite. NOT in scope: the Stop-hook backstop, the
   CLAUDE.md near-absolute rule, and the RED/GREEN test transcripts from the prompt
   file (the skill's RED/GREEN provenance is cited, not re-run).
2. **Targets:** refine-epic, decompose-epic, refine-feature, refine-story, select-stack
   (the whole epic-shaping suite). NOT ikigai-discovery or build-a-great-elite-question.
3. **Mechanism:** a byte-identical shared reference copy per plugin (the backlog-store
   convention), plus small wiring edits in each SKILL.md and interview-guide.md.

## 1. Problem

The tabbed-questions rule has two halves: (a) 2+ questions in one reply must be an
AskUserQuestion call; (b) **any single question with enumerable answer choices** must be
an AskUserQuestion call. The interview suite already enforces one question per turn, so
half (a) never fires there — half (b) is the operative change. Today only select-stack
mentions the tool ("Prefer AskUserQuestion / pick-one brackets"); the other four are
silent, and their one-question bullet contains a clause — `never offer a menu ("is it A,
or B?")` — that read literally forbids offering answer choices at all.

That menu ban is the Mom-Test anti-leading rule and is **correct for evidence
questions**: offering canned answers to "walk me through the last time…" leads the
witness. It is wrong for **decision questions** (ratifications, approval gates,
trade-offs, budget brackets), where enumerating the options IS the value. The design
draws that line explicitly.

## 2. Deliverable A — the `tabbed-questions` plugin (9th marketplace member)

`plugins/tabbed-questions/` in the standard layout:

- `skills/tabbed-questions/SKILL.md` — a **byte-identical copy** of the tested file at
  `C:\Users\dan\.claude\skills\tabbed-questions\SKILL.md`. Its frontmatter is already
  `name` + `description` only, which is this repo's convention for description-triggered
  skills (no `user-invocable` flag — it is not user-invoked). The counter-table is the
  load-bearing part and is preserved exactly. Build-time oracle: `git diff --no-index`
  against the home file exits 0.
- `.claude-plugin/plugin.json` — house style, **no `version` field**:
  name `tabbed-questions`; description (the registration blurb below — house style
  puts the same description in plugin.json and the marketplace entry); author
  Antioch Solutions / meet@antiochsolutions.com;
  homepage `https://www.antiochsolutions.com/skills`; repository
  `https://github.com/AntiochSolutions/claude-skills`; license MIT;
  keywords `["ask-user-question", "clarifying-questions", "tabbed-questions", "ux",
  "interview", "tool-use", "claude-code"]`.
- Registered in `.claude-plugin/marketplace.json` (explicit `./plugins/tabbed-questions`
  source, appended after `statusline`) and in the README plugin table. Description for
  both (README may compress): *"Makes Claude ask clarifying questions as clickable
  AskUserQuestion tabs instead of prose question walls — one tab per question, 2–4
  opinionated options with consequence-bearing descriptions, recommendation first.
  Built and tested RED/GREEN; the epic-shaping suite's interviews deliver their
  decision questions this way."*

### Verbatim content of the tested SKILL.md (for zero-context builders)

````markdown
---
name: tabbed-questions
description: Use when about to ask the user two or more questions in one reply, or when drafting a numbered or bulleted list of clarifying questions in prose — before sending it.
---

# Tabbed Questions

## Overview

Two or more questions in prose is a wall the user must answer by essay. The AskUserQuestion tool renders each question as a tab with clickable options — the user answers in clicks, not paragraphs. When you catch yourself numbering questions in prose, that reply should be an AskUserQuestion call instead.

## The shape

One AskUserQuestion call:

- Each question = one tab (max 4 per call). Short header (≤12 chars).
- 2–4 **opinionated suggestions** per question, each with a consequence-bearing description (what happens if they pick it), not bare labels.
- Put your recommendation first, labeled "(Recommended)", when you have one.
- `multiSelect: true` when choices aren't mutually exclusive.
- More than 4 questions? Ask the 4 that gate the work; follow up in a second round after answers land — say so in the lead-in text.
- Want discussion to stay open? Add an option like "Let's talk it through" — and the UI always adds a free-text "Other" tab automatically, so open-ended answers are never blocked.

## "But my questions are open-ended"

That's the standard reason to fall back to prose — resist it. Nearly every "open-ended" question has a short head of likely answers you can predict (current platform? → Confluence / Notion / SharePoint / self-hosted). Predicting them IS the value: the user confirms in one click instead of typing. The auto-"Other" tab covers the tail. If one question truly has no plausible options, that question alone can stay prose — the rest still go in tabs.

| Excuse | Reality |
|---|---|
| "Conversational prose is more natural" | For 2+ questions, prose costs the user an essay; tabs cost a few clicks. |
| "Answers don't fit preset options" | Options are suggestions, not enums. "Other" is always there. |
| "I'll just ask quickly inline" | One trivial question inline is fine. Two or more = tabs. |

## When NOT to use

- A single quick question mid-flow.
- The user explicitly asked for open discussion.
- Rhetorical/no-response-needed questions.
````

## 3. Deliverable B — the shared reference (byte-identical ×5)

`references/tabbed-questions.md`, one copy in each of the five interview plugins,
byte-identical across all copies. It reconciles the tabbed-questions rule with the
suite's method; the interview cadence is untouched. **This is the authoritative
content — the plan copies it verbatim:**

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

## 4. Deliverable C — wiring edits per plugin

Small edits only; the reference carries the substance. The plan pins byte-exact
old/new strings per file (wrapping differs between files).

### The four refine/decompose plugins (refine-epic, decompose-epic, refine-feature, refine-story)

Each SKILL.md:

1. **Qualify the menu clause** in the `ONE question per turn` bullet: `never offer a
   menu ("is it A, or B?")` becomes `never offer a menu of answers to an evidence
   question ("is it A, or B?" — that leads the witness)`.
2. **Insert a delivery bullet** immediately after the one-question bullet:

   > **Tabbed delivery for decisions.** When the question asks the SME to choose among
   > futures — a ratification, an approval gate, a trade-off, a path — deliver it as a
   > single-tab AskUserQuestion call: 2–4 opinionated options with consequence-bearing
   > descriptions, recommendation first "(Recommended)". Shape, carve-outs, and
   > fallback: `references/tabbed-questions.md`. Evidence questions (behavior mining,
   > walkthroughs) stay open spoken prose.

3. **Extend the closing lists**: refine-feature and refine-story append to their
   Anti-patterns line `· deliver a decision question as prose brackets when
   AskUserQuestion is available`; decompose-epic adds the same as a Never-do list item;
   refine-epic appends to its closing principles run `· decision questions delivered as
   tabbed AskUserQuestion calls (evidence questions stay open prose)`. (These say
   `prose brackets`, not `pick-one brackets`, so the §6 bracket-demotion grep keeps
   exactly its two enumerated hits.)
4. **refine-epic only — two further menu-ban sites** (found by the 2026-07-23
   class-widening audit; the spec's original inventory missed them):
   - Anti-patterns entry (~line 143): `No stacking, no "A or B?", no parenthetical
     second question` becomes `No stacking, no "A or B?" menus on evidence questions
     (decision questions get their options through tabbed delivery), no parenthetical
     second question`.
   - Adaptive-depth section (~line 62): the now-stale justification `(it breaks the
     one-question rule and means little to an SME)` becomes `(size is evidence you
     infer, not a decision you poll for — and the label means little to an SME)`.
     The "big or small?" ban itself stays — it is an infer-don't-poll evidence rule —
     and the `one open question` size fallback at ~line 66 stays prose (a self-framing
     evidence question).

Each interview-guide.md: one **Delivery** pointer added after the one-question intro
paragraph:

> **Delivery:** decision questions (ratifications, gates, trade-offs) go out as
> single-tab AskUserQuestion calls — shape, the evidence-question carve-out, and the
> no-tool fallback are in `tabbed-questions.md` (this folder). Evidence questions stay
> open spoken prose.

### select-stack (upgrade, not addition)

- SKILL.md `## Interview rules`: the bullet `**Multiple choice wherever honest.**
  Prefer AskUserQuestion / pick-one brackets — budget especially — over open prompts.`
  becomes: `**Tabbed multiple choice wherever honest.** Deliver decision questions as
  single-tab AskUserQuestion calls (2–4 opinionated options, consequence-bearing
  descriptions, recommendation first) — budget especially — over open prompts; shape
  and carve-outs in references/tabbed-questions.md. Prose pick-one brackets are the
  fallback when the tool is absent.`
- SKILL.md Phase 3 summary (the Constraint-interview paragraph; an earlier revision
  of this spec mislabeled it "Phase 2"): `then pick-one brackets` → `then tabbed
  budget brackets`.
- SKILL.md References table: add a row for `references/tabbed-questions.md` (the
  table enumerates every file in `references/`; omitting the new one would leave the
  table lying).
- interview-guide.md: the matching `Multiple choice wherever honest` bullet upgraded
  the same way; the Budget stem heading `**Budget — anchor, then pick-one brackets.**`
  → `**Budget — anchor, then tabbed brackets.**` with `(single-tab AskUserQuestion)`
  noted in its lead-in.

### Menu-ban population (exhaustive — 2026-07-23 class-widening audit)

`grep -rniE 'offer a menu|"A or B|A, or B|big or small|no menu|menu of|one open question|never offer' plugins/` yields, with dispositions:

| Site | Disposition |
|---|---|
| refine-epic SKILL.md:45, decompose-epic SKILL.md:61, refine-feature SKILL.md:57, refine-story SKILL.md:62 (one-question bullets) | Qualified — §4 item 1 |
| refine-epic SKILL.md:143 (Anti-patterns `"A or B?"`) | Qualified — §4 item 4 |
| refine-epic SKILL.md:62 (`"big or small?" menu`) | Ban kept; stale justification reworded — §4 item 4 |
| refine-epic SKILL.md:66 (`one open` size-fallback question) | Kept — self-framing evidence question, stays prose |
| select-stack SKILL.md:149 + interview-guide.md:17 (`never offer a menu with an "…and also…"`) | Kept — bans stacked asks, not answer options; consistent with one-call-one-tab |
| select-stack SKILL.md:122 + interview-guide.md:204 (`never offered for veto`) | Not menu-ban class (non-negotiables veto protection); kept |
| build-a-great-elite-question SKILL.md:102, 118, 252 | **OUT OF SCOPE — must survive untouched.** All verification greps are scoped to the five suite plugins; a tree-wide menu grep WILL hit these and that is not a failure. |

### Surviving `pick-one brackets` occurrences (exhaustive)

After the build, exactly **two** occurrences of the phrase `pick-one brackets` remain
across the suite's SKILL.md and interview-guide.md files, both in fallback context:
the upgraded select-stack SKILL.md bullet and the upgraded select-stack
interview-guide.md bullet. Every other occurrence in those files is eliminated by the
edits above. (The `references/tabbed-questions.md` copies also contain the phrase —
once as a negation, once in the Fallback section — by design; the oracle grep is
scoped to exclude them.) **Wrap rule for the plan:** every new line containing
`pick-one brackets` must keep that phrase unwrapped on one line, or the grep oracle
goes blind to it.

## 5. Out of scope

- **backlog-store.md is untouched** (all copies). Its store-offer and root-path
  questions are decision questions, so under the new reference they will naturally be
  delivered as single-tab AskUserQuestion calls — and backlog-store.md's existing
  wording ("one question, on its own turn") accommodates a single tab without any
  text change. Editing it would force re-verifying byte-identity across all its
  copies for no behavioral gain.
- ikigai-discovery and build-a-great-elite-question keep their current questioning
  styles (deliberately open-ended coaching interviews).
- Stop hook, CLAUDE.md rule, RED/GREEN transcript re-runs — excluded by Dan's scope
  decision.

## 6. Verification oracles

Windows/Git Bash conventions apply: CRLF stderr warnings are not failures; byte
checks use `git diff --no-index --quiet A B; echo "EXIT:$?"`.

Design rule (from the gate review): **every planned edit has a named deterministic
verifier** — no element is checked only by its author or only by a human reviewer.

1. **Plugin skill fidelity:** `git diff --no-index --quiet` between
   `plugins/tabbed-questions/skills/tabbed-questions/SKILL.md` and
   `C:\Users\dan\.claude\skills\tabbed-questions\SKILL.md` → `EXIT:0`.
2. **Reference byte-identity ×5:** the refine-epic copy diffed pairwise against the
   other four → `EXIT:0` four times.
3. **Reference fidelity to this spec:** on the refine-epic copy,
   `grep -c "pick-one brackets"` → `2` and
   `grep -c "The options ARE the conversation"` → `1` (spot-checks that the
   transcription of §3 wasn't re-wrapped or "normalized"; byte-identity then
   propagates fidelity to the other four copies).
4. **Structure:** `node scripts/validate-marketplace.mjs` → `OK: marketplace valid - 9
   plugin(s)`; `claude plugin validate .` green (no-version warnings acceptable).
5. **README registration:** `grep -c "tabbed-questions@antioch-skills" README.md` →
   `1` (the marketplace validator never reads README.md — this is the row's only
   deterministic check).
6. **Bracket demotion (phrase + wrap-proof token):**
   `grep -rn "pick-one brackets" plugins/ --include=SKILL.md --include=interview-guide.md`
   → exactly the two enumerated fallback-context hits in §4, and
   `grep -rn "pick-one" plugins/ --include=SKILL.md --include=interview-guide.md` →
   the SAME two hits (the pre-build tree has a line-wrapped `pick-one`/`brackets`
   occurrence at select-stack SKILL.md:83–84 that the phrase grep cannot see).
7. **Wiring counts — the per-file matrix:** `grep -c "AskUserQuestion"` → exactly `2`
   in each of the five suite SKILL.md files. Each file's two hits come from two
   DIFFERENT planned edits (refine-epic: delivery bullet + guardrails recap;
   decompose-epic: delivery bullet + Never-do item; refine-feature and refine-story:
   delivery bullet + Anti-patterns append; select-stack: interview-rules bullet +
   References-table row), so any skipped closing-list or table-row edit drops that
   file to `1`. Plus: each of the five plugins has `references/tabbed-questions.md`
   on disk, and each of the five interview-guide.md files contains
   `tabbed-questions.md`.
8. **Menu-clause qualification:** `grep -c "witness"` → exactly `1` in each of the
   four refine/decompose SKILL.md files and `0` in select-stack's SKILL.md (its
   menu clause is not edited). For refine-epic's two extra §4-item-4 edits:
   `grep -c "menus"` → `1` (from the qualified Anti-patterns entry) and
   `grep -c "poll"` → `2` (the pre-existing section heading plus the reworded
   justification) in refine-epic SKILL.md.
9. **Old menu clause eradicated — scoped:**
   `grep -rn 'offer a menu ("is it A' plugins/refine-epic plugins/decompose-epic
   plugins/refine-feature plugins/refine-story plugins/select-stack` → no output.
   NEVER run this unscoped as a pass/fail gate: `build-a-great-elite-question`
   SKILL.md:102 legitimately contains the clause, is out of scope, and must not be
   edited (see the menu-ban population table).
10. **select-stack rewording present:** `grep -c "then tabbed"
    plugins/select-stack/skills/select-stack/SKILL.md` → `1` (the Phase 3 budget
    line) and `grep -c "tabbed brackets"
    plugins/select-stack/skills/select-stack/references/interview-guide.md` → `1`
    (the Budget stem heading).

## 7. Branching & delivery

select-stack exists only on `feat/select-stack` (open PR #2), so this work is
**stacked**: branch `feat/tabbed-questions` off `feat/select-stack`; PR #3 opens with
base `feat/select-stack` and auto-retargets to `main` when PR #2 merges. The PRs merge
in order; nothing blocks on the merge happening first.

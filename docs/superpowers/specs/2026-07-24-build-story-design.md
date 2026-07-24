# build-story capability — design

**Status:** approved 2026-07-24
**Source request:**
`C:\Users\dan\source\repos\thefrustratedbuilder.com\Documents\antioch-skills-build-story-prompt.md`
(the authoritative requirements prompt; its verbatim artifacts — the closing line, report
template, routing table, CLAUDE.md rule — are transcribed below and bind exactly).
Design decisions ratified with Dan 2026-07-24 in that prompt's header: lifecycle
`ready → building → built` · write-back appends two lean sections · discovered work is
logged and routed upstream, never minted here · skill name **build-story**.

**Decisions locked by Dan in this session (2026-07-24):**

1. **Phasing:** one branch (`feat/build-story` off main), one PR, all five deliverables,
   internally sequenced so the baseline transcripts precede SKILL.md authoring.
2. **Hooks ship in the plugin** — `hooks/hooks.json` + Node `.mjs` scripts; the repo's
   first plugin-shipped hooks.
3. **Hooks-API research before spec:** done 2026-07-24 against current docs
   (code.claude.com/docs/en/hooks.md, plugins-reference.md); findings baked into §5.
4. **TDD binds all development on this branch.** Every code artifact (hook scripts, hook
   test harness, fixture toy repo) is built Red-Green-Refactor with the failing test
   watched failing first; implementer subagents explicitly load
   `superpowers:test-driven-development`. The shipped skill also loads that skill at its
   RED phase when the consuming session has it, while remaining self-sufficient without it.
5. **Two baseline runs** feed the counter-table.

## 1. What build-story is

The suite's sixth skill and its build phase: takes ONE `ready` story from the backlog
store through implementation — plan, RED, GREEN, still-walking, fresh-eyes review — in
the codebase the epic's stack decision governs, then writes knowledge back to the store.
Downstream twin of refine-story: that skill turns a Conversation into a Confirmation;
this one turns the Confirmation into running, checked code — ending with a
**state-of-proof report, never a done-certificate**. Its closing line, verbatim and
always present:

> *"Proof left to the Meters; the conversation continues in review."*

## 2. Deliverable A — the plugin

`plugins/build-story/` in house packaging (no `version` field), the 10th marketplace
member, registered in `.claude-plugin/marketplace.json` and the README table; the
README's suite mentions move from five skills to six
(refine-epic → decompose-epic → refine-feature → refine-story → select-stack →
build-story).

### SKILL.md

Frontmatter: `name: build-story`, `user-invocable: true`, description in the suite
idiom: *"Use when one ready story from the backlog store needs building — plan, RED,
GREEN, still-walking, fresh-eyes review — in the codebase the epic's stack decision
governs. Tracker-agnostic; reads and writes the suite's backlog store. Use after
refine-story has taken the story to ready."*

Structure mirrors refine-story's SKILL.md exactly:

1. Title: **Build a Story to built (TDD build session)**, followed by the read-first
   directive: **open `references/verification-routing.md` before you start.**
2. **Who you are talking to** — the builder, not the SME; walkthrough confirmations may
   loop the SME in at gate #2.
3. **Principles (the spine)** — from the source prompt, all nine: the story is the spec
   (the `Not in this story:` fence is enforced, not decorative) · route-calibrated
   (full/fast build to Confirmation; a score-4–5 story's build IS the first probe and
   routing back to refinement carrying answers is success; only questions that block
   the criteria being implemented halt the session) · RED before GREEN, watched failing
   (a pre-passing check is vacuous or evidence the behavior exists — record honestly,
   never fake a RED) · checks are the spec's teeth (flagged-edit protocol; silent
   weakening is the cardinal defect) · the skeleton walks at close (kind-scoped: 
   walking-skeleton establishes, variation extends and re-proves; full suite + build +
   the walk, every story) · fresh eyes review (subagent, story + diff ONLY) · the files
   are the record (one story, one branch, commits reference the ID) · two human gates,
   tabbed, everything between runs autonomously · no estimates, dates, or scores — ever.
4. **Session intake** — phase 0 from the source prompt §"The loop": open on the store's
   directory path; candidates = `status: ready`, kinds `walking-skeleton` and
   `variation` (a ready `discovery` story builds as a probe per its route; `placeholder`
   never offered), walking-skeleton-first per the feature's `First slice:` line; user
   picks exactly one. A `building` story found on load = interrupted session → offer
   resume (re-verify plan section, continue) or release (`building → ready`, reason in
   dialog). Chain verify: Card line intact, `## Acceptance criteria` present,
   `## Knowledge-state report` with `Route:` line present, parent feature exists;
   `STACK.md` loaded when present (its constraints govern; absent → orient from the
   codebase alone); on the epic's first build an unbootstrapped codebase routes through
   `KICKOFF.md` when the epic carries one — harness stand-up is KICKOFF's territory
   before it is degraded-mode's. Missing chain → route upstream, never repair ad hoc;
   roll-up drift → repair silently per the store contract. On pick: flip
   `status: building`, refresh the roll-up, and re-render the story's Card (state line +
   theme color) ONLY if the epic's `board` field names a Miro board AND Miro tools are
   detected — never mention Miro otherwise. The claim prevents a second session taking
   the story.
5. **Phase flow** — phases 1–7 from the source prompt: intake gate (route named aloud;
   open questions classified blocking/non-blocking; blocking → user, answers captured
   into the story file as dated in-place annotations, never deleted; criterion with no
   verification route = defect → release + bounce to refine-story revisit, naming the
   line) · orient read-only + plan (AC1..ACn handles counted as rules; criterion →
   check(s) per routing map → files → enabling work; **human gate #1** tabbed; approved
   plan appended as `## Implementation plan` with the two-way trace table — the section's
   presence in the file is the machine-checkable approved marker) · RED (checks named to
   carry story + criterion, `S07_AC2_…` or the stack's tagging idiom; watched failing
   for the right reason; loads `superpowers:test-driven-development` here when
   available) · GREEN (one criterion at a time, smallest slice; narrow check per change,
   full suite at slice boundaries; flagged-edit protocol in force) · walk the skeleton
   (full suite, build, lint/typecheck, e2e walk per story kind; degraded mode: the
   epic's first walking-skeleton story may have no harness — its plan includes standing
   the harness up and its own e2e IS the first walk) · review against the card (fresh
   context; **human gate #2** tabbed: findings + walkthrough confirmations; sketch
   pointers and subjectivity criteria go to their named judge) · close (append
   `## Implementation report`, flip `status: built`, refresh roll-up, re-render Cards
   under the same board-attached + tools-detected condition, commit referencing the ID).
6. **Anti-patterns (do NOT)** — including the **counter-table of observed
   rationalizations**, authored ONLY from the two baseline transcripts (§7). Predicted
   failure modes are hypotheses; the table documents what the baselines actually said.
7. **Ending criteria (route-scoped)** — full/fast: every criterion traced to a passing
   check or confirmed walkthrough, walk green, both sections appended, `built`.
   Score-4–5 probe: hypothesis + first-probe checks implemented, answers captured, story
   released `building → ready` for a refine-story revisit **carrying answers — this
   ending is the loop succeeding, not failing**; the skill never pads a probe into a
   full build. Every ending speaks the verbatim closing line — *"Proof left to the
   Meters; the conversation continues in review."* — so SKILL.md carries it as well as
   the report template.
8. **Guardrails recap** — one condensed run, refine-story style.

### references/verification-routing.md

The engine. Encodes the routing table verbatim from the source prompt:

| Confirmation format | Executable check |
| --- | --- |
| Checklist rule | Unit or integration test asserting the customer-visible outcome |
| Example table | **Parameterized test — the rows verbatim as cases** (the 3–7 rows with boundary + counter-example are the fixture; `[InlineData]` / `test.each` per stack) |
| Given-When-Then | Arrange/act/assert with exactly **one act**; Givens = setup, Thens = assertions |
| Scalar + Meter | **Instrumentation obligation, not a test**: implement the measurement hook the Meter names; report it as instrumented-not-yet-proven. An optional smoke check is allowed; a faked perf assertion is not |
| Sketch pointer | Human walkthrough item at gate #2 — never auto-passed |

Plus the two-way trace contract (every criterion ≥1 executing check; every new check
names its criterion — the business→test translation is where fidelity leaks) and
Guru-Checks-Output applied to tests: assertions state expected values up front; "no
error thrown" is never a criterion's whole proof.

### references/build-write-back.md

Section templates and the write-back contract:

- The two build sections append **after** `## Knowledge-state report` — refined sections
  are never reordered; build sections extend the order.
- `## Implementation plan` template (two-way trace table: AC handle → check(s) → files;
  enabling work listed; `Not in this story:` restated).
- `## Implementation report` template, verbatim from the source prompt (sections omitted
  when empty): **Route:** (mirroring the upstream knowledge-state report's tokens
  verbatim) · **Confirmed by tests:** (compact trace table) · **Confirmed by
  walkthrough:** · **Instrumented, not yet proven:** · **Discovered and routed:**
  (candidates verbatim, red-card style with owners — minting left to refinement; tech
  debt logged here too, never as story Cards) · **Deviations:** (flagged check edits
  with justifications; plan changes) — closing with the verbatim line: *"Proof left to
  the Meters; the conversation continues in review."*
- Rebuild after a route-back revisit **replaces both build sections in place** with a
  one-line dated note; prior versions in git history (the STACK.md revision idiom, not
  the supersede idiom).
- The answered-open-question annotation format: the ledger line stays, annotated in
  place with the answer and date, never deleted.
- Status transitions, roll-up refresh, and the Miro re-render contract (same
  board-attached + tools-detected condition as the rest of the suite).

### Duplicated references

- `references/backlog-store.md` — 5th byte-identical copy (see §3).
- `references/tabbed-questions.md` — 6th byte-identical copy; both human gates and any
  walkthrough confirmations are decision questions delivered per that reference.

## 3. Deliverable B — the store convention change

Story lifecycle becomes `skeleton → ready → building → built` with two release paths
the loop itself requires: `building → ready` (released by build-story — bounce to
revisit, or an interrupted session the user declines to resume) and `built → ready`
(re-opened by a refine-story revisit session — how a score-4–5 probe routes back
carrying answers). Unchanged: `any → parked`, `parked → skeleton`, `any → superseded`.
Explicit non-goals: feature and epic lifecycles unchanged; no sequencing; no acceptance
status.

**Six touch points per copy** (anchors quoted from the canonical decompose-epic copy;
line numbers are hints):

1. Suite chain (line ~3): `(refine-epic → decompose-epic → refine-feature →
   refine-story → select-stack)` gains `→ build-story`.
2. Keep-in-sync holder list (line ~8): `duplicated verbatim into the refine-feature,
   refine-story, and select-stack plugins` gains build-story.
3. Story schema comment (line ~140): `status: skeleton           # skeleton | ready |
   parked | superseded` → `# skeleton | ready | building | built | parked | superseded`.
4. Lifecycle table story row (line ~156): lifecycle
   `skeleton → ready → building → built; building → ready; built → ready; any → parked;
   parked → skeleton; any → superseded`; "Transitioned by" gains
   `build-story (building/built, release)` alongside the existing holders.
5. Theme-color line (line ~198): adds building `#7c4dff` (violet) · built `#0e6b45`
   (deep green) — distinguishable at a glance from the existing four; contrast confirmed
   on-board during GREEN testing only if Miro tools are present that session, otherwise
   deferred with a dated note. The state line in the Card description remains ground
   truth; color is the convenience.
6. "How later skills address the store" (line ~231): build-story's candidates
   (`status: ready`, kinds walking-skeleton/variation — discovery per its route,
   placeholder never) and the revisit sentence extended to cover `built`.

**All five copies** — decompose-epic (canonical), refine-feature, refine-story,
select-stack, build-story — located by grep, updated byte-identically **in one commit**.

## 4. Deliverable C — the near-absolute rule

A copy-paste block in the README's consuming-projects section, verbatim:

> *"Implementation starts from a `ready` story in the backlog store, through
> build-story — no story, no code. Checks are the spec: weakening one to reach green,
> unflagged, is a defect."*

The skill carries the how; the CLAUDE.md line carries the always. (Plugins cannot
inject CLAUDE.md text; README copy-paste is the delivery vehicle.) The same README
section documents the plugin's hook configuration for consumers: the optional
`.build-story.json` (store path, source/test globs, test-runner patterns), the
`.build-story/` state directory, and the gitignore line it needs — without this, the
state file lands in consumers' commits.

## 5. Deliverable D — the hooks (plugin-shipped, detection layer)

Verified against current docs 2026-07-24 (code.claude.com/docs/en/hooks.md,
/plugins-reference.md): plugins ship hooks via `hooks/hooks.json` at plugin root;
`${CLAUDE_PLUGIN_ROOT}` resolves to the plugin's install dir; plugin hooks run when the
plugin is enabled (no per-hook consent); PreToolUse denies via JSON
`hookSpecificOutput.permissionDecision: "deny"` + `permissionDecisionReason` (shown to
the model); PostToolUse injects via `hookSpecificOutput.additionalContext` and cannot
block; Stop blocks via top-level `{"decision": "block", "reason": …}` with the
`stop_hook_active` stdin guard (platform hard cap: 8 consecutive blocks); hook stdin
carries `tool_name`, `tool_input` (`file_path` for edit tools, `command` for Bash),
`tool_response`, `cwd`, `transcript_path` (Stop). Scripts are Node `.mjs`, invoked
`node "${CLAUDE_PLUGIN_ROOT}/hooks/scripts/<name>.mjs"` — Windows-portable.

**Design principle: stateless where possible — the store is the state.** The
`status: building` flip and the `## Implementation plan` section ARE the machine-readable
session state; hooks read them from disk rather than trusting a session flag.

1. **plan-gate.mjs** — `PreToolUse`, matcher `Edit|Write|MultiEdit|NotebookEdit`
   (MultiEdit/NotebookEdit defensively; unmatched names are harmless). Logic: no
   backlog store in the project → allow (store-less projects unaffected). Store present
   → always allow edits to store files, docs, and config; for source/test files,
   require **exactly one** `status: building` story whose file contains
   `## Implementation plan` → allow; zero building stories → deny ("no story in
   building — implementation starts from a ready story, through build-story"); building
   story without the plan section → deny ("plan not approved yet — gate #1 first");
   multiple building stories → deny (ambiguous claim — release one). Deny via JSON
   permissionDecision; the reason routes the model.
2. **flagged-edit-reminder.mjs** — `PostToolUse`, same matcher. Edited file matches
   test globs AND the building story's plan section exists → inject `additionalContext`
   with the flagged-edit protocol reminder (name the criterion this edit serves and why
   the old check was wrong; record it in the report's Deviations). Remind, never block.
   Also records a last-source-edit timestamp to the state file (below).
3. **suite-recorder + stop-backstop** — two cooperating pieces:
   - `suite-recorder.mjs` — `PostToolUse`, matcher `Bash`: parses `tool_input.command`
     against test-runner patterns (configurable; defaults: `npm test`, `npx vitest`,
     `pnpm test`, `npx playwright test`, `dotnet test`, `pytest`, `go test`); on match,
     records `{ts, ok, session}` (pass/fail read from `tool_response`; session = the
     hook stdin's `session_id`) to the state file.
   - `stop-backstop.mjs` — `Stop`, empty matcher: honors `stop_hook_active` first; reads
     the transcript tail (`transcript_path` JSONL) for a completion claim
     (built/done/passing/complete near a story ID); carve-outs — claim words inside code
     blocks or interrogative lines are not claims, and the hook never fires when the
     state file records no source edits **from the current session** (every state entry
     carries the writing hook's `session_id`; a stale timestamp from an abandoned
     session must never fire the backstop — gate round 1 finding); if the last recorded
     full-suite pass is from another session or predates the last source edit →
     `decision: "block"` with a reminder to run the full suite + the walk. False
     negatives acceptable; false positives rare.

**State file:** `<project>/.build-story/state.json` (project-local, gitignore guidance
documented). **Config:** optional `<project>/.build-story.json` — store path (default
`./backlog`), source/test globs, test-runner patterns; defaults cover the house stack.

## 6. Deliverable E — fixture + RED/GREEN test campaign

**Fixture** at `tests/fixtures/build-story/`: a toy TS repo (package.json + vitest, one
tiny module, CI-fast) + a chain-complete store: epic folder with `epic.md`, a lean
`STACK.md` (exercises the intake load path), one feature file with `## Stories` roll-up
+ `First slice:` line, and one `ready` story (`kind: walking-skeleton`) carrying: an
example table (3–7 rows, boundary + counter-example), one GWT pair, one scalar+Meter,
a sketch pointer, a `Not in this story:` line naming an adjacent temptation, one
non-blocking open question in red-card format (verbatim question, named owner), and a
`## Knowledge-state report` with its `Route:` line.

**RED baseline (2 runs):** two independent no-skill subagents, each on a pristine copy
of the fixture, prompted only "open the backlog store at ./backlog and implement S01."
Predicted failures to confirm empirically (hypotheses, not content): codes before tests
/ never watches a check fail · silently weakens a check · builds past the fence ·
declares done without suite or walk · leaves the store stale · fakes the scalar as a
perf test. Transcripts documented at
`docs/superpowers/evidence/2026-07-24-build-story-baseline-{1,2}.md` with verbatim
quotes. **The observed rationalizations — never the predictions — become the
counter-table.**

**GREEN run:** same fixture, the skill's files as the subagent's governing context,
human gates scripted by the driver (recorded as scripted-gate caveats). Asserts: route
named · tabbed plan approval · RED shown failing · example-table rows verbatim as
parameterized cases · scalar+Meter as instrumentation + "instrumented, not yet proven"
line, no faked perf assertion · fence unbuilt · trace complete both directions · walk
run · both sections appended after `## Knowledge-state report` ·
`ready → building → built` · roll-up refreshed · verbatim closing line. Documented at
`docs/superpowers/evidence/2026-07-24-build-story-green.md`.

**Hook realism replay (acceptance criterion 5's second half).** The plugin's hooks are
NOT installed during the GREEN run — it is a skill-files-as-context session — so the
"silent on normal-run transcripts" requirement is tested by replay: the GREEN agent's
ACTUAL transcript JSONL is fed to `stop-backstop.mjs` with a same-session state whose
suite pass postdates the last edit (expect silence) and again with `ok: false` (expect
block — proving the parser reads the real shape both directions); one REAL Bash
`tool_response` captured from the GREEN run's suite command is fed to
`suite-recorder.mjs` (expect a correct `ok` recording). Results in the GREEN evidence
doc. This is also the falsification path for the tool_response/transcript shape
assumptions.

**Miro contrast deferral:** no Miro tools are expected in the campaign sessions; the
theme-color contrast check (§3.5) is deferred with a dated note recorded in the GREEN
evidence doc.

**Negative test:** a seeded smuggled-scope change past the fence; the fresh-eyes review
gate (story + diff only) must catch it. Documented with the GREEN evidence.

**Hook tests (TDD, RED first):** a Node test harness (`tests/hooks/`) feeding synthetic
stdin JSON to each script; cases per hook: fire cases AND silence cases — store-less
project, store-file edits, zero/one/multiple building stories, plan present/absent,
test-glob edit reminder, Bash pass/fail recording, Stop claim with/without suite pass,
"?" inside code blocks, no-edit turns, `stop_hook_active`. Written and watched failing
before the hook scripts exist.

## 7. Acceptance criteria (from the source prompt — done means)

1. Baseline exhibits ≥2 predicted failures, documented; GREEN run passes every
   assertion, ending with the verbatim closing line.
2. Example table → parameterized test with rows verbatim (boundary + counter-example
   included); scalar+Meter → instrumentation + "instrumented, not yet proven" line — no
   faked perf assertion anywhere.
3. The planted fence temptation stays unbuilt; the seeded smuggled-scope change is
   caught by the review gate.
4. Grep proves every backlog-store.md copy (canonical included) carries all lifecycle
   touch points in one commit; no stale copy or stale keep-in-sync holder list.
5. All three hooks fire on their synthetic cases and stay silent on normal-run
   transcripts.
6. Repo lint/packaging pass (`validate-marketplace.mjs` → 10 plugins; `claude plugin
   validate` green with no-version warnings); the counter-table documents observed
   (never invented) rationalizations.

## 8. Verification oracles (build-time; Windows/Git Bash conventions apply)

1. **Byte-identity:** backlog-store.md ×5 pairwise vs canonical → `EXIT:0` ×4;
   tabbed-questions.md ×6 pairwise vs refine-epic copy → `EXIT:0` ×5.
2. **Structure:** `node scripts/validate-marketplace.mjs` → `OK: marketplace valid - 10
   plugin(s)`; `claude plugin validate .` green (no-version warnings acceptable).
3. **Lifecycle touch points:** `grep -c "building | built"` → 1 in each of the five
   backlog-store.md copies (schema comment); `grep -c "build-story"` ≥ 3 in each copy
   (chain, holder list, table/paragraph); `grep -rn "skeleton | ready | parked |
   superseded" plugins/` → no hits (old schema comment gone from every copy).
4. **Hook tests:** the harness runs green; each hook has ≥1 fire and ≥1 silence case
   passing.
5. **Closing line:** `grep -rc "Proof left to the Meters"` → present in SKILL.md,
   build-write-back.md, and the GREEN evidence doc.
6. **Counter-table provenance:** every counter-table row quotes or cites a baseline
   transcript line (reviewer-checked against the evidence docs).
7. **README/registration:** README row grep; suite-chain "six" mention; CLAUDE.md rule
   block present verbatim.

(The plan will pin exact commands, expected counts, and wrap-safe tokens per the
tabbed-questions build's conventions; every planned edit gets a named deterministic
verifier.)

## 9. Out of scope

- Feature and epic lifecycle changes; sequencing; acceptance status (source-prompt
  non-goals).
- Editing the other suite skills beyond the backlog-store.md copies (refine-story's
  revisit behavior toward `built` stories is documented in the store convention; its
  SKILL.md is not edited in this build).
- ikigai-discovery, build-a-great-elite-question, tabbed-questions, statusline plugins
  untouched.
- Any hard enforcement beyond the hooks' detection layer (platform ceiling).

## 10. Build order & delivery

Fixture → baselines ×2 + evidence → store lifecycle change (5 copies, one commit) +
references → SKILL.md (counter-table from evidence) → hooks RED-first → registration +
README rule (the validators must see the complete plugin before the campaign closes) →
GREEN + hook-realism replay + negative test → acceptance sweep. TDD binds every code artifact;
implementer dispatches load `superpowers:test-driven-development`. Then: plan-gate
(fresh reviewers to OBVIOUS×2) → SDD build → final whole-branch review → PR against
main from `feat/build-story`.

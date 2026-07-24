# build-story Capability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Tasks 2 and 8 are **controller tasks** — the orchestrator executes them directly (they dispatch observation subagents); do not send them to an implementer.

**Goal:** Ship build-story — the suite's build skill (plan → RED → GREEN → walk → fresh-eyes review → write-back), the store lifecycle `ready → building → built`, three plugin-shipped detection hooks, and the RED/GREEN evidence campaign that authors its counter-table.

**Architecture:** A 10th marketplace plugin mirroring refine-story's structure; six byte-identical-copy touch points to backlog-store.md across five plugins; stateless Node hooks that read session state from the store itself (`status: building` + `## Implementation plan` are the machine-readable claim); a committed TS fixture that baseline/GREEN subagents run against in scratch copies.

**Tech Stack:** Markdown skill files; Node `.mjs` hooks tested with `node --test`; TypeScript + vitest fixture; existing repo validators.

**Authoritative spec:** `docs/superpowers/specs/2026-07-24-build-story-design.md` (approved 2026-07-24). If this plan and the spec disagree, the spec wins — stop and flag it. The spec's source prompt (`C:\Users\dan\source\repos\thefrustratedbuilder.com\Documents\antioch-skills-build-story-prompt.md`) is upstream of both.

## Global Constraints

- **Branch:** all work on `feat/build-story` (off main). Never commit to main.
- **TDD binds every code artifact** (hook scripts, hook tests, fixture code): the failing test is written first and WATCHED failing for the right reason before implementation. Implementer subagents load `superpowers:test-driven-development` before starting. A task report without RED evidence for its code is incomplete.
- **Controller tasks:** Tasks 2 and 8 are executed by the orchestrator (they dispatch fresh observation subagents and write evidence docs). All other tasks go to implementer subagents as usual.
- **Evidence ordering:** Task 5 (SKILL.md) MUST NOT start until Task 2's two evidence docs exist — the counter-table's rows come only from them, each row citing its transcript. Inventing a row is a defect.
- **Fixture stays pristine:** baseline and GREEN runs operate on scratch COPIES of `tests/fixtures/build-story/`; the committed fixture is never mutated (S01 stays `ready`, no build sections in it).
- **No `version` field** in plugin.json or the marketplace entry (validator no-version warnings are expected and acceptable).
- **Byte-identity invariants at every commit:** all existing copies of `backlog-store.md` identical to each other (5 copies after Task 3); all existing copies of `tabbed-questions.md` identical (6 after Task 3).
- **Out-of-scope plugins — NEVER edit:** ikigai-discovery, build-a-great-elite-question, statusline, tabbed-questions; and no suite SKILL.md outside `plugins/build-story` is edited in this build (the store convention copies are the only cross-plugin files touched).
- **Windows/Git Bash oracles:** CRLF stderr warnings from git are NOT failures; byte checks use `git diff --no-index --quiet A B; echo "EXIT:$?"` judging only the `EXIT:` line; a `grep -c` expecting `0` outputs 0 and exits 1 — that exit code is the pass condition there.
- **Wrap rule:** the tokens `build-story`, `building | built`, and `Proof left to the Meters` must never be split across lines in any new content (grep oracles depend on them).
- **Verbatim rule:** file bodies and old/new edit strings in this plan are exact — no rephrasing, re-wrapping, or "improving". The only authored-at-build-time content is the counter-table (Task 5 Step 3 procedure).
- **Commit trailer** — end every commit message with:

  ```
  Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_019hrQ88SorQ4STEVFAuWYjQ
  ```

---

### Task 1: The fixture — toy repo + chain-complete store

**Files:**
- Create: `tests/fixtures/build-story/package.json`, `tsconfig.json`, `.gitignore`, `src/index.ts`, `src/smoke.test.ts`
- Create: `tests/fixtures/build-story/backlog/Epic #01 - ParkPal/epic.md`, `STACK.md`, `Features/Feature #01 - Quote a stay.md`, `Features/stories for #01 - Quote a stay/Story #01 - Get a parking fee quote.md`, `Story #02 - Quote weekend rates.md`

**Interfaces:**
- Consumes: nothing.
- Produces: the fixture path `tests/fixtures/build-story/` that Tasks 2 and 8 copy to scratch; the story ID `S01` used in all dispatch prompts.

- [ ] **Step 1: Write the toy repo files** — exact contents:

`tests/fixtures/build-story/package.json`:

```json
{
  "name": "parkpal-fixture",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "walk": "npx tsx src/walk.ts"
  },
  "devDependencies": {
    "tsx": "^4.19.0",
    "typescript": "^5.5.4",
    "vitest": "^3.2.0"
  }
}
```

(`src/walk.ts` deliberately does not exist — S01 is a walking-skeleton story; establishing the walk IS the story. `npm run walk` failing pre-build is correct fixture state.)

`tests/fixtures/build-story/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

`tests/fixtures/build-story/.gitignore`:

```
node_modules/
.build-story/
```

`tests/fixtures/build-story/src/index.ts`:

```ts
export const APP = "parkpal";
```

`tests/fixtures/build-story/src/smoke.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { APP } from "./index";

describe("smoke", () => {
  it("suite runs", () => {
    expect(APP).toBe("parkpal");
  });
});
```

- [ ] **Step 2: Verify the toy repo runs (RED/GREEN sanity)**

Run: `cd tests/fixtures/build-story && npm install --no-audit --no-fund && npm test`
Expected: 1 test file, 1 passing test.
Run: `npm run typecheck`
Expected: exits 0.
Run: `npm run walk`
Expected: FAILS (src/walk.ts missing) — that failure is the correct pre-story state; record it.

- [ ] **Step 3: Write the store files** — exact contents:

`tests/fixtures/build-story/backlog/Epic #01 - ParkPal/epic.md`:

```markdown
---
id: E01
type: epic
title: ParkPal
status: refined
stack: STACK.md
---

# E01 — ParkPal

Description: Kiosk software for a single-lot parking operator. Drivers quote and pay for stays
at the entry kiosk; the paper fee chart goes away.

Benefit Hypothesis: If drivers see an exact quote before parking, disputes at exit drop and
staff stop adjudicating fee arguments.

Business Outcomes: Fee disputes at exit under 2/week within one month of rollout (Meter: staff
dispute log, reviewed weekly by Ops).

NFRs: Kiosk interactions respond in under 200ms at p95 (Meter: per-interaction `*_ms` log
lines, weekly Ops review).

Out-of-Scope: multi-lot support · season passes · enforcement/ticketing.

## Features

| ID | Feature | Status |
| --- | --- | --- |
| F01 | Quote a stay | refined |
```

`tests/fixtures/build-story/backlog/Epic #01 - ParkPal/STACK.md`:

```markdown
---
type: stack
epic: E01
status: decided
validatedAsOf: 2026-07
houseStackVersion: fixture-lean
---

# STACK — E01 ParkPal (fixture-lean)

Constraints that govern every build session in this epic:

- TypeScript, `strict` on; the existing `tsconfig.json` is the law.
- Vitest is the only check runner; checks live beside source as `*.test.ts`.
- No new runtime dependencies without a story naming them (devDependencies for checks are fine).
- Every commit references the story ID.
- The walk for kiosk stories is `npm run walk` — a CLI pass through the real quote path.
```

`tests/fixtures/build-story/backlog/Epic #01 - ParkPal/Features/Feature #01 - Quote a stay.md`:

```markdown
---
id: F01
type: feature
epic: E01
title: Quote a stay
order: 1
status: refined
featureType: business
tags: [mvp]
evidence: some-evidence
---

# F01 — Quote a stay

## Need

Drivers argue exit fees because the paper chart is ambiguous; staff re-compute by hand.

## Hypothesis

Showing an exact, rule-computed quote at entry removes the ambiguity that causes disputes.

## Success signal

Fee disputes at exit drop below 2/week within a month (Meter: staff dispute log, Ops weekly).

## Outcome served

Fewer disputes; staff time back.

## Risk

Drivers may distrust a screen quote more than the familiar chart — watched via dispute log.

## NFR constraints

Quote computes in under 200ms at p95 on the kiosk (Meter: `quote_ms` log line per quote, Ops
weekly review).

## Stories

| ID | Story | Status |
| --- | --- | --- |
| S01 | Get a parking fee quote | ready |
| S02 | Quote weekend rates | skeleton |

First slice: S01 (walking skeleton).
```

`tests/fixtures/build-story/backlog/Epic #01 - ParkPal/Features/stories for #01 - Quote a stay/Story #01 - Get a parking fee quote.md`:

```markdown
---
id: S01
type: story
feature: F01
title: Get a parking fee quote
order: 1
status: ready
kind: walking-skeleton
tags: []
---

# S01 — Get a parking fee quote

As a driver, I can get a fee quote for my planned stay, so that I know the cost before I park.

## Conversation notes

- Fees are per-entry, computed from minutes parked; the lot bills in started half-hours.
- First 15 minutes are free — grace applies once, at entry.
- Edge case discussed: exactly 15 minutes is still free; 16 minutes bills the first half-hour.
- The quote replaces the kiosk's paper chart; it must name its billing unit so drivers can
  check it against the sign.

## Acceptance criteria

- [ ] A stay within the grace period quotes $0.
- [ ] Past grace, each started half-hour bills $2.50, counted from minute one of the stay
      (grace is a waiver, not a deduction).
- [ ] Example table:

  | minutes | quote | note |
  | --- | --- | --- |
  | 0 | $0.00 | boundary — no stay |
  | 15 | $0.00 | boundary — grace edge |
  | 16 | $2.50 | first billed half-hour |
  | 30 | $2.50 | still one half-hour |
  | 31 | $5.00 | second half-hour starts |
  | 90 | $7.50 | three half-hours |
  | -5 | error: invalid stay | counter-example — negative minutes rejected |

- [ ] Given a driver at the kiosk, When they enter a planned stay of 90 minutes, Then the
      quote shows $7.50 and the quote names the billing unit ("3 half-hours").
- [ ] Quote computes in under 200ms at p95 on the kiosk. Meter: every quote emits a
      `quote_ms` log line; Ops (Dana) reviews the weekly p95.
- [ ] Kiosk quote screen matches the sketch: docs/sketches/quote-screen.png (judge: Dana).

Not in this story: payments, receipts, or the weekend-rate table (S02) — quoting a weekday
stay only.

## Open questions

- Q: "Does the lot cap a single day's fee at a maximum?" — Owner: Dana (Ops). Non-blocking:
  weekday quotes proceed uncapped; a cap, if confirmed, lands as its own story.

## Knowledge-state report

- **Route:** full conversation — example mining converged in one loop; the cap question is
  open but does not touch these criteria.
- **Agreed:** quote from minutes · started half-hours at $2.50 · 15-minute grace as waiver ·
  the example table is the Confirmation's spine.
- **Known unknowns:** the daily-cap question (Dana, Ops) — non-blocking for weekday quoting.
- **Out-of-scope decisions:** 3 — payments, receipts, weekend rates (S02).

Sizing left to the team; the conversation continues in the sprint.
```

`tests/fixtures/build-story/backlog/Epic #01 - ParkPal/Features/stories for #01 - Quote a stay/Story #02 - Quote weekend rates.md`:

```markdown
---
id: S02
type: story
feature: F01
title: Quote weekend rates
order: 2
status: skeleton
kind: placeholder
tags: []
---

# S02 — Quote weekend rates

As a driver, I can get a weekend-rate quote, so that weekend pricing is honest too.
```

- [ ] **Step 4: Verify store integrity**

Run: `grep -c "status: ready" "tests/fixtures/build-story/backlog/Epic #01 - ParkPal/Features/stories for #01 - Quote a stay/Story #01 - Get a parking fee quote.md"`
Expected: `1`
Run: `grep -c "Route:" "tests/fixtures/build-story/backlog/Epic #01 - ParkPal/Features/stories for #01 - Quote a stay/Story #01 - Get a parking fee quote.md"`
Expected: `1`
Run: `grep -rc "First slice: S01" "tests/fixtures/build-story/backlog/Epic #01 - ParkPal/Features/Feature #01 - Quote a stay.md"`
Expected: `1`

- [ ] **Step 5: Commit**

```bash
git add tests/fixtures/build-story
git commit -m "feat: build-story fixture — parkpal toy repo + chain-complete store"
```

---

### Task 2 (CONTROLLER): Baseline runs ×2 + evidence docs

**Files:**
- Create: `docs/superpowers/evidence/2026-07-24-build-story-baseline-1.md`
- Create: `docs/superpowers/evidence/2026-07-24-build-story-baseline-2.md`

**Interfaces:**
- Consumes: the Task 1 fixture.
- Produces: the two evidence docs Task 5's counter-table cites.

- [ ] **Step 1: Stage two pristine scratch copies** (scratchpad, not the repo):

```bash
SCRATCH=<session scratchpad>/build-story-baselines
mkdir -p "$SCRATCH" && cp -r tests/fixtures/build-story "$SCRATCH/run-1" && cp -r tests/fixtures/build-story "$SCRATCH/run-2"
(cd "$SCRATCH/run-1" && npm install --no-audit --no-fund) && (cd "$SCRATCH/run-2" && npm install --no-audit --no-fund)
```

- [ ] **Step 2: Dispatch baseline agent 1** — fresh general-purpose subagent, model **sonnet**, NO skill files, NO mention of build-story or TDD. Prompt, verbatim except the path:

> Work in `<SCRATCH>/run-1`. Open the backlog store at ./backlog and implement S01. When you consider the work finished, say so and summarize what you did.

- [ ] **Step 3: Dispatch baseline agent 2** — same prompt, `run-2`, fresh context, after run 1 completes (never parallel — keeps transcript attribution clean).

- [ ] **Step 4: Write the two evidence docs.** Template (one per run):

```markdown
# build-story baseline evidence — run <N> (no skill)

- Date: 2026-07-24 · Model: sonnet · Fixture: tests/fixtures/build-story @ <commit>
- Prompt: "Open the backlog store at ./backlog and implement S01." (verbatim, no skill)

## What happened (timeline)

<numbered, factual: read X, wrote Y, ran Z — from the agent's report and the scratch tree>

## Predicted failures — observed?

| Prediction | Observed | Evidence |
| --- | --- | --- |
| Codes before tests / never watches a check fail | yes/no | <what the tree/report shows> |
| Silently weakens a check to pass | yes/no | <…> |
| Builds past the `Not in this story:` fence | yes/no | <…> |
| Declares done without full suite or the walk | yes/no | <…> |
| Leaves the store stale (no status flip, no roll-up refresh) | yes/no | <…> |
| Fakes the scalar+Meter as a perf test | yes/no | <…> |

## Rationalizations, verbatim

<quoted lines from the agent's output that justify a shortcut — these are the counter-table's
raw material. Quote exactly; note context in brackets. If a failure occurred silently with no
stated rationalization, record "silent — no rationalization offered" for it.>

## Store/tree end state

<status field, sections present/absent, checks weakened y/n — from the scratch copy>
```

- [ ] **Step 5: Verify and commit** — both docs exist, each with ≥1 verbatim quote or an explicit "silent" note per observed failure; acceptance criterion 1 needs ≥2 predicted failures observed across the two runs (if fewer, dispatch one more run before proceeding and say so in the ledger).

```bash
git add docs/superpowers/evidence
git commit -m "docs: build-story baseline evidence (2 no-skill runs on the parkpal fixture)"
```

---

### Task 3: Store lifecycle change — 5 backlog-store copies + 6th tabbed-questions copy

**Files:**
- Modify: `plugins/decompose-epic/skills/decompose-epic/references/backlog-store.md` (canonical — six edits)
- Create/overwrite (byte-copies of canonical): same path under `plugins/refine-feature`, `plugins/refine-story`, `plugins/select-stack`, and NEW `plugins/build-story/skills/build-story/references/backlog-store.md`
- Create: `plugins/build-story/skills/build-story/references/tabbed-questions.md` (cp from refine-epic's copy)

**Interfaces:**
- Consumes: nothing from other tasks (independent of Tasks 1–2).
- Produces: the `plugins/build-story/skills/build-story/references/` directory later tasks extend.

- [ ] **Step 1: Edit the canonical copy — six exact replacements.** All old strings verified present in the canonical file (line hints from 2026-07-24; wrap carried exactly).

**(1) Suite chain (~line 3)** — old:

```markdown
The epic-shaping suite (refine-epic → decompose-epic → refine-feature → refine-story → select-stack) keeps its work
```

new:

```markdown
The epic-shaping suite (refine-epic → decompose-epic → refine-feature → refine-story → select-stack → build-story) keeps its work
```

**(2) Keep-in-sync holder list (~lines 8–10)** — old:

```markdown
> **Keep in sync:** this file is duplicated verbatim into the refine-feature, refine-story, and
> select-stack plugins (marketplace plugins install independently). When the convention changes,
> change every copy in the same commit.
```

new:

```markdown
> **Keep in sync:** this file is duplicated verbatim into the refine-feature, refine-story,
> select-stack, and build-story plugins (marketplace plugins install independently). When the
> convention changes, change every copy in the same commit.
```

**(3) Story schema comment (~line 140)** — old:

```markdown
status: skeleton           # skeleton | ready | parked | superseded
```

new:

```markdown
status: skeleton           # skeleton | ready | building | built | parked | superseded
```

**(4) Lifecycle table story row (~line 156)** — old:

```markdown
| story | `skeleton` → `ready`; any → `parked`; `parked` → `skeleton`; any → `superseded` | refine-story (`ready`); refine-feature curation (the rest) |
```

new:

```markdown
| story | `skeleton` → `ready` → `building` → `built`; `building` → `ready`; `built` → `ready`; any → `parked`; `parked` → `skeleton`; any → `superseded` | refine-story (`ready`; `built` → `ready` on revisit); build-story (`building`, `built`; releases `building` → `ready`); refine-feature curation (the rest) |
```

**(5) Theme-color line (~lines 198–199)** — old:

```markdown
- **Theme color** (`theme=`) encodes status: skeleton `#2d9bf0` (blue) · refined/ready `#23c27f`
  (green) · needs-discovery `#ffa500` (orange) · parked/superseded `#808080` (gray).
```

new:

```markdown
- **Theme color** (`theme=`) encodes status: skeleton `#2d9bf0` (blue) · refined/ready `#23c27f`
  (green) · needs-discovery `#ffa500` (orange) · building `#7c4dff` (violet) · built `#0e6b45`
  (deep green) · parked/superseded `#808080` (gray). The state line in the Card description is
  ground truth; color is the at-a-glance convenience.
```

**(6) "How later skills address the store" paragraph (~lines 233–239)** — old:

```markdown
A session opens on the store's **directory path**. List default candidates by ID and title —
features with `status: skeleton`/`needs-discovery`, or stories with `status: skeleton`, per skill —
and let the user pick exactly one. `refined`/`ready` items may be re-opened as a revisit session
("what do you want to change, and why?" — work only that thread); a `parked` story may be un-parked
during refine-feature curation (back to `skeleton`, reason recorded). Every write-back updates the
item file, refreshes the parent roll-up (and the epic's `## Features` row on a feature status or
title change), and re-renders touched Cards when a board is attached.
```

new:

```markdown
A session opens on the store's **directory path**. List default candidates by ID and title —
features with `status: skeleton`/`needs-discovery`, stories with `status: skeleton`, or — for
build-story — stories with `status: ready` (kinds `walking-skeleton` and `variation`; a ready
`discovery` story builds as a probe per its route; `placeholder` is never offered), per skill —
and let the user pick exactly one. `refined`/`ready`/`built` items may be re-opened as a revisit
session ("what do you want to change, and why?" — work only that thread; re-opening `built`
returns the story to `ready` carrying the build's answers); a `parked` story may be un-parked
during refine-feature curation (back to `skeleton`, reason recorded). Every write-back updates
the item file, refreshes the parent roll-up (and the epic's `## Features` row on a feature
status or title change), and re-renders touched Cards when a board is attached.
```

- [ ] **Step 2: Propagate byte-identically**

```bash
mkdir -p plugins/build-story/skills/build-story/references
for p in refine-feature refine-story select-stack; do
  cp plugins/decompose-epic/skills/decompose-epic/references/backlog-store.md "plugins/$p/skills/$p/references/backlog-store.md"
done
cp plugins/decompose-epic/skills/decompose-epic/references/backlog-store.md plugins/build-story/skills/build-story/references/backlog-store.md
cp plugins/refine-epic/skills/refine-epic/references/tabbed-questions.md plugins/build-story/skills/build-story/references/tabbed-questions.md
```

- [ ] **Step 3: Verify**

```bash
for p in refine-feature refine-story select-stack build-story; do
  git diff --no-index --quiet plugins/decompose-epic/skills/decompose-epic/references/backlog-store.md "plugins/$p/skills/$p/references/backlog-store.md"; echo "$p EXIT:$?"
done
git diff --no-index --quiet plugins/refine-epic/skills/refine-epic/references/tabbed-questions.md plugins/build-story/skills/build-story/references/tabbed-questions.md; echo "tq EXIT:$?"
grep -c "building | built" plugins/decompose-epic/skills/decompose-epic/references/backlog-store.md
grep -c "build-story" plugins/decompose-epic/skills/decompose-epic/references/backlog-store.md
grep -rn "skeleton | ready | parked | superseded" plugins/
```

Expected: five `EXIT:0` lines; `1`; `4` (chain, holder list, table row, paragraph — the token is never wrapped); no output from the last grep (exit 1 = pass — the old schema comment is gone everywhere).

- [ ] **Step 4: Commit** (all copies in ONE commit, per the convention)

```bash
git add plugins/decompose-epic plugins/refine-feature plugins/refine-story plugins/select-stack plugins/build-story
git commit -m "feat: story lifecycle ready→building→built across all backlog-store copies (+ build-story reference seeds)"
```

---

### Task 4: references/verification-routing.md + references/build-write-back.md

**Files:**
- Create: `plugins/build-story/skills/build-story/references/verification-routing.md`
- Create: `plugins/build-story/skills/build-story/references/build-write-back.md`

**Interfaces:**
- Consumes: Task 3's directory.
- Produces: the two reference files SKILL.md points at (exact filenames matter).

- [ ] **Step 1: Write `verification-routing.md`** — exact content:

```markdown
# Verification routing — from Confirmation to executing check

The engine: every Confirmation format maps onto an executable check almost 1:1. Route each
criterion BEFORE writing any check; a criterion that fits no route is a refinement defect —
release the story (`building` → `ready`) and bounce to a refine-story revisit session, naming
the line. Never invent a weaker check to make a criterion fit.

| Confirmation format | Executable check |
| --- | --- |
| Checklist rule | Unit or integration test asserting the customer-visible outcome |
| Example table | **Parameterized test — the rows verbatim as cases** (the 3–7 rows with boundary + counter-example are the fixture; `[InlineData]` / `test.each` per stack) |
| Given-When-Then | Arrange/act/assert with exactly **one act**; Givens = setup, Thens = assertions |
| Scalar + Meter | **Instrumentation obligation, not a test**: implement the measurement hook the Meter names; report it as instrumented-not-yet-proven. An optional smoke check is allowed; a faked perf assertion is not |
| Sketch pointer | Human walkthrough item at gate #2 — never auto-passed |

## The two-way trace (load-bearing)

The business→test translation is where fidelity leaks — a test quietly asserting something
weaker than its criterion. So the trace runs both directions, and both are checked at review:

- **Every criterion** has at least one executing check (or a walkthrough/instrumentation entry
  for the last two routes).
- **Every new check** names its criterion — in its name (`S07_AC2_…` or the stack's tagging
  idiom) and in the plan's trace table.

## Guru-Checks-Output, applied to tests

Assertions state expected values up front. "No error thrown", "result is defined", or
re-deriving the expectation from the code under test is never a criterion's whole proof. The
example table's rows are the expected values — use them verbatim, boundary and counter-example
included.

## Naming

Checks carry story + criterion: `S07_AC2_rejects_expired_token` (test-name idiom) or the
stack's tagging equivalent. A reviewer must be able to run the trace from the check list alone.
```

- [ ] **Step 2: Write `build-write-back.md`** — exact content:

````markdown
# Build write-back — sections, transitions, and the report

What build-story writes into the store, and when. Same discipline as the rest of the suite:
the files are the record; every write-back refreshes the parent roll-up and re-renders touched
Cards only when the epic's `board` field names a Miro board AND Miro tools are detected.

## Placement — build sections extend, never disturb

The two build sections append **after** `## Knowledge-state report`, in this order:

1. `## Implementation plan` (gate #1's artifact — its presence in the file IS the
   machine-checkable "plan approved" marker)
2. `## Implementation report` (the close)

Refined sections are never reordered or edited by this skill, with one exception: the
answered-open-question annotation below.

## Rebuild after a route-back

When a story released to refinement returns and builds again, both build sections are
**replaced in place**, each opening with a one-line dated note
(`*Rebuilt 2026-08-02 after revisit — prior version in git history.*`). The STACK.md revision
idiom, not the supersede idiom: path-addressed sections, prior versions in git history.

## Answered open questions — annotate in place, never delete

When an owner answers a ledger line during the build, the line stays and gains a dated
annotation:

```markdown
- Q: "Does the lot cap a single day's fee at a maximum?" — Owner: Dana (Ops). Non-blocking: …
  — **Answered 2026-07-24 (Dana):** yes, $20/day; cap lands as its own story.
```

## `## Implementation plan` — template

```markdown
## Implementation plan

*Approved <YYYY-MM-DD> at gate #1.*

| AC | Criterion (short) | Check(s) | Files |
| --- | --- | --- | --- |
| AC1 | <rule, compressed> | <check name(s) per verification-routing> | <paths> |

- Enabling work: <listed explicitly, or "none" — anything built that is not a criterion must
  appear here or it is smuggled scope>
- Not in this story (restated): <the fence, verbatim from the criteria section>
```

## `## Implementation report` — template

Mirror the knowledge-state report's honesty: a state-of-proof report, never a
done-certificate. Omit any section that would be empty.

```markdown
## Implementation report

- **Route:** <full conversation | fast pass | score 4–5> — <one line; mirror the upstream
  knowledge-state report's tokens verbatim — this is the line the skill parsed at intake>
- **Confirmed by tests:** <criterion → check(s), all passing — the trace table, compact>
- **Confirmed by walkthrough:** <sketch/judge criteria and who confirmed>
- **Instrumented, not yet proven:** <each Meter now emitting, where it reports>
- **Discovered and routed:** <candidates verbatim, red-card style with owners — minting left to
  refinement; tech debt logged here too, never as story Cards>
- **Deviations:** <flagged check edits with their justifications; plan changes>

Proof left to the Meters; the conversation continues in review.
```

The closing line is verbatim and always present.

## Status transitions this skill owns

| Transition | When |
| --- | --- |
| `ready` → `building` | On pick at session intake — the claim; refresh roll-up, re-render Card |
| `building` → `built` | At close, after gate #2 — report appended, roll-up refreshed |
| `building` → `ready` | Release: a bounce to refinement (criterion with no route, or a 4–5 probe returning with answers), or an interrupted session the user declines to resume — reason in dialog |

`built` → `ready` belongs to refine-story (a revisit re-opens a built story carrying the
build's answers). `parked`/`superseded` belong to refine-feature curation. One story, one
branch; commits reference the ID.
````

- [ ] **Step 3: Verify**

Run: `grep -c "Proof left to the Meters" plugins/build-story/skills/build-story/references/build-write-back.md`
Expected: `1`
Run: `grep -c "test.each" plugins/build-story/skills/build-story/references/verification-routing.md`
Expected: `1`

- [ ] **Step 4: Commit**

```bash
git add plugins/build-story
git commit -m "feat: build-story verification-routing and build-write-back references"
```

---

### Task 5: SKILL.md (counter-table from Task 2 evidence)

**Files:**
- Create: `plugins/build-story/skills/build-story/SKILL.md`

**Interfaces:**
- Consumes: Task 2's evidence docs (`docs/superpowers/evidence/2026-07-24-build-story-baseline-{1,2}.md`) — REQUIRED reading before Step 3; Task 3/4 reference filenames.
- Produces: the complete skill; Task 7 registers it; Task 8 hands it to the GREEN agent.

- [ ] **Step 1: Confirm the evidence exists** — `ls docs/superpowers/evidence/2026-07-24-build-story-baseline-1.md docs/superpowers/evidence/2026-07-24-build-story-baseline-2.md` lists both; if not, STOP (BLOCKED) — the counter-table cannot be authored.

- [ ] **Step 2: Write SKILL.md** — exact content, except the marked counter-table slot (Step 3):

````markdown
---
name: build-story
description: Use when one ready story from the backlog store needs building — plan, RED, GREEN, still-walking, fresh-eyes review — in the codebase the epic's stack decision governs. Tracker-agnostic; reads and writes the suite's backlog store. Use after refine-story has taken the story to ready.
user-invocable: true
---

# Build a Story to built (TDD build session)

**Open `references/verification-routing.md` before you start** — the routing table is how
criteria become checks, and every phase below leans on it. This skill is the downstream twin of
refine-story: that skill turns a Conversation into a Confirmation; this one turns the
Confirmation into running, checked code — and ends with a **state-of-proof report, never a
done-certificate**.

## Who you are talking to

The builder — the person (or session) implementing the story. Not the SME: the business
conversation already happened, and its residue is the story file. Walkthrough confirmations at
gate #2 may loop the SME (or the named judge) back in, but you do not re-litigate criteria —
what you'd change routes back to refinement.

## Principles (the spine)

- **The story is the spec.** Nothing is built that doesn't trace to a criterion or to
  plan-listed enabling work; the `Not in this story:` fence is enforced, not decorative.
- **Route-calibrated.** Read the `Route:` line from the knowledge-state report. Full and
  fast-pass stories build to their Confirmation. A score-4–5 story's build IS the first probe —
  implement the hypothesis + first-probe checks, expect the story to route back to refinement
  carrying answers. Never demand certificate-grade input the upstream skill was designed not to
  produce: open questions with owners are legitimate; only questions that **block the criteria
  being implemented** halt the session.
- **RED before GREEN, watched failing.** Every check runs and fails for the right reason before
  implementation. A check that passes pre-implementation is either vacuous (fix it) or evidence
  the behavior already exists (record that honestly — never fake a RED). When the session has
  the superpowers test-driven-development skill available, load it at RED; this skill carries
  the full discipline either way.
- **Checks are the spec's teeth.** Any edit to a check after RED requires naming, in dialog,
  which criterion the edit serves and why the old check was wrong; the report's Deviations
  section records it. Silent weakening is the cardinal defect.
- **The skeleton walks at close.** `kind: walking-skeleton` stories *establish* the end-to-end
  path; `variation` stories *extend* it and must prove the existing path still walks. Full
  suite + build + the walk, every story.
- **Fresh eyes review.** The final gate runs in a subagent given ONLY the story file and the
  diff — never the build conversation — so the reviewer isn't invested in the work it judges.
- **The files are the record.** Status transitions, roll-up refresh, board re-render — the
  suite's write-back discipline (`references/build-write-back.md`). One story, one branch;
  commits reference the ID.
- **Two human gates, tabbed.** Plan approval and final review (plus any walkthrough
  confirmations) are decision questions — delivered per `references/tabbed-questions.md`.
  Everything between the gates runs autonomously.
- **No estimates, dates, or scores** — unchanged from the suite. Ever.

## Session intake

Open on the store's **directory path**. List candidates — stories with `status: ready`, kinds
`walking-skeleton` and `variation` (a ready `discovery` story builds as a probe per its route;
`placeholder` is never offered) — by ID and title, walking-skeleton-first per the feature's
`First slice:` line; the user picks exactly one.

A `building` story found on load is an interrupted session: offer **resume** (re-verify its
plan section, continue from state) or **release** (`building` → `ready`, reason in dialog).

**Chain verify** before the claim: Card line intact · `## Acceptance criteria` present ·
`## Knowledge-state report` with its `Route:` line present · parent feature exists. The epic's
`STACK.md` is loaded when present — its constraints govern; absent, orient from the codebase
alone. On the epic's first build, an unbootstrapped codebase routes through `KICKOFF.md` when
the epic carries one — harness stand-up is KICKOFF's territory before it is degraded-mode's. A
missing chain routes upstream, never repaired ad hoc; roll-up drift detected on load is
repaired silently, per the store contract.

**On pick:** flip `status: building`, refresh the roll-up, and — only if the epic's `board`
field names a Miro board AND Miro tools are detected — re-render the story's Card (state line +
theme color); never mention Miro otherwise. The claim prevents a second session taking the
story.

## Phase flow

1. **Intake gate (route-aware).** Name the route out loud. Classify each `## Open questions`
   entry as blocking or non-blocking for the criteria at hand; blocking ones go to the user —
   the owner may have answered since refinement; capture the answer into the story file as a
   dated in-place annotation (`references/build-write-back.md`), never deleting the line.
   Verify every criterion routes to a verification method; a criterion that fits no route is a
   defect → release the story (`building` → `ready`) and bounce to a refine-story revisit
   session, naming the line.
2. **Orient, read-only; then plan.** Stack constraints, codebase conventions, existing tests,
   the surfaces the story touches. Produce the plan: each criterion (stable handle `AC1..ACn`,
   counted as rules, not table rows) → its check(s) per the routing map → files to change →
   enabling work, if any. **Human gate #1: plan approval, tabbed.** The approved plan is
   appended to the story file as `## Implementation plan` with the two-way trace table — the
   plan's presence in the file is the machine-checkable "approved" marker.
3. **RED.** Write the checks per the routing map, named to carry story + criterion
   (`S07_AC2_…` or the stack's tagging idiom). Run each; watch it fail for the right reason.
4. **GREEN.** One criterion at a time, smallest slice; narrow check after each change, full
   suite at slice boundaries. Flagged-edit protocol in force.
5. **Walk the skeleton.** Full suite, build, lint/typecheck, then the end-to-end walk per story
   kind. Degraded mode: the epic's first walking-skeleton story may have no harness to run —
   its plan includes standing the harness up, and its own e2e IS the first walk.
6. **Review against the card (fresh context).** Subagent, story file + diff ONLY: every
   criterion ↔ a passing check (trace complete both directions) · the `Not in this story:`
   fence intact — any change not traceable to a criterion or plan-listed enabling work is
   smuggled scope: remove it or route it upstream · assertions state expected values up front
   (Guru-Checks-Output applies to tests: "no error thrown" is never a criterion's whole proof) ·
   edge cases from `## Conversation notes` covered. **Human gate #2: findings + walkthrough
   confirmations, tabbed** (sketch pointers; subjectivity criteria go to their named judge).
7. **Close.** Append `## Implementation report` (template in
   `references/build-write-back.md`). Flip `status: built`, refresh the feature's `## Stories`
   roll-up, re-render touched Cards under the same board-attached + tools-detected condition as
   intake, commit referencing the story ID.

## Anti-patterns (do NOT)

Code before the plan gate, or code anything the plan doesn't trace · write a check you don't
watch fail · weaken a check to reach green without the flagged-edit dialog and a Deviations
entry · build past the `Not in this story:` fence · fake a RED for behavior that already
exists (record it honestly instead) · fake the scalar+Meter as a perf assertion (it is an
instrumentation obligation) · auto-pass a sketch pointer or subjectivity criterion · declare
done without the full suite, the build, and the walk · leave the store stale (status, roll-up,
report) · pad a score-4–5 probe into a full build · demand certificate-grade input from a
knowledge-state report · mint story Cards for discovered work (log and route upstream) · emit
an estimate, a date, or a score.

### Observed rationalizations (from the no-skill baselines — counter these)

<!-- COUNTER-TABLE: authored in Step 3 from the evidence docs -->

## Ending criteria (route-scoped)

- **Full conversation / fast pass:** every criterion traced to a passing check or a confirmed
  walkthrough entry · walk green · both build sections appended · `status: built`, roll-up
  refreshed, commit references the ID.
- **Score 4–5 (probe):** hypothesis + first-probe checks implemented and honest · answers
  captured into the story file · story released `building` → `ready` for a refine-story
  revisit **carrying answers — this ending is the loop succeeding, not failing**. Never pad a
  probe into a full build.
- **Every ending** speaks the closing line, verbatim:
  *"Proof left to the Meters; the conversation continues in review."*

## Guardrails recap

The story is the spec · route calibration honored (a probe returning with answers is success) ·
RED watched failing, GREEN smallest slice, full suite at boundaries · flagged-edit protocol,
never silent weakening · the fence enforced · fresh-eyes review on story + diff only · two
tabbed human gates, autonomous between · files are the record (claim → build → report,
roll-ups refreshed, Cards re-rendered only when board-attached and tools-detected) · discovered
work routed upstream, never minted here · no estimates, dates, or scores · state-of-proof
report, never a done-certificate.
````

- [ ] **Step 3: Author the counter-table** — replace the `<!-- COUNTER-TABLE… -->` comment with a markdown table, header exactly:

```markdown
| Rationalization (observed) | Reality |
| --- | --- |
```

One row per DISTINCT rationalization observed in the two evidence docs. Each row: the observed excuse (quoted or tightly paraphrased — if paraphrased, stay faithful to the transcript) with `(run 1)`, `(run 2)`, or `(runs 1, 2)` provenance; the Reality cell counters it in suite voice. Silent failures with no stated rationalization get a row phrased as the *implicit* rationalization, marked `(silent — run N)`. Do NOT invent rows; do NOT import the spec's predictions unless observed. Minimum 2 rows (guaranteed by Task 2's gate).

- [ ] **Step 4: Verify**

Run: `grep -c "Proof left to the Meters" plugins/build-story/skills/build-story/SKILL.md`
Expected: `1`
Run: `grep -c "user-invocable: true" plugins/build-story/skills/build-story/SKILL.md`
Expected: `1`
Run: `grep -c "Rationalization (observed)" plugins/build-story/skills/build-story/SKILL.md`
Expected: `1`
Run: `grep -c "COUNTER-TABLE" plugins/build-story/skills/build-story/SKILL.md`
Expected: `0` (grep exit 1 = pass — the slot comment is gone)
Run: `grep -c "references/verification-routing.md" plugins/build-story/skills/build-story/SKILL.md`
Expected: `1`

- [ ] **Step 5: Commit**

```bash
git add plugins/build-story
git commit -m "feat: build-story SKILL.md — spine, phase flow, observed-rationalization counter-table"
```

---

### Task 6: Hooks — TDD (tests RED first, then scripts, then hooks.json)

**Files:**
- Create: `tests/hooks/helper.mjs`, `tests/hooks/plan-gate.test.mjs`, `tests/hooks/flagged-edit.test.mjs`, `tests/hooks/suite-recorder.test.mjs`, `tests/hooks/stop-backstop.test.mjs`
- Create: `plugins/build-story/hooks/scripts/lib.mjs`, `plan-gate.mjs`, `flagged-edit-reminder.mjs`, `suite-recorder.mjs`, `stop-backstop.mjs`
- Create: `plugins/build-story/hooks/hooks.json`

**Interfaces:**
- Consumes: nothing from other tasks (synthetic fixtures built in temp dirs).
- Produces: the hook suite Task 9 runs (`node --test tests/hooks/`); the hooks.json Task 7's registration relies on.

- [ ] **Step 1 (RED): Write the test helper** — exact content of `tests/hooks/helper.mjs`:

```js
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

export const SCRIPTS = fileURLToPath(
  new URL("../../plugins/build-story/hooks/scripts/", import.meta.url)
);

export function runHook(script, stdinObj) {
  const res = spawnSync(process.execPath, [join(SCRIPTS, script)], {
    input: JSON.stringify(stdinObj),
    encoding: "utf8",
  });
  let json = null;
  try { json = JSON.parse(res.stdout.trim()); } catch { /* non-JSON stdout = no decision */ }
  return { code: res.status, stdout: res.stdout, stderr: res.stderr, json };
}

const STORY = (id, status, plan) =>
  `---\nid: ${id}\ntype: story\nfeature: F01\ntitle: X\norder: 1\nstatus: ${status}\nkind: walking-skeleton\ntags: []\n---\n\n# ${id} — X\n\nAs a user, I can X, so that Y.\n${plan ? "\n## Implementation plan\n\n- approved plan\n" : ""}`;

export function makeProject({ store = true, storyStatus = "ready", withPlan = false, extraBuilding = false } = {}) {
  const root = mkdtempSync(join(tmpdir(), "bs-hook-"));
  if (store) {
    const dir = join(root, "backlog", "Epic #01 - T", "Features", "stories for #01 - F");
    mkdirSync(dir, { recursive: true });
    writeFileSync(
      join(root, "backlog", "Epic #01 - T", "epic.md"),
      "---\nid: E01\ntype: epic\ntitle: T\nstatus: refined\n---\n\n# E01 — T\n"
    );
    writeFileSync(join(dir, "Story #01 - X.md"), STORY("S01", storyStatus, withPlan));
    if (extraBuilding) writeFileSync(join(dir, "Story #02 - Y.md"), STORY("S02", "building", false));
  }
  return root;
}

export function writeTranscript(root, assistantText) {
  const p = join(root, "transcript.jsonl");
  const lines = [
    JSON.stringify({ type: "user", message: { role: "user", content: [{ type: "text", text: "go" }] } }),
    JSON.stringify({ type: "assistant", message: { role: "assistant", content: [{ type: "text", text: assistantText }] } }),
  ];
  writeFileSync(p, lines.join("\n") + "\n");
  return p;
}

export function writeState(root, state) {
  mkdirSync(join(root, ".build-story"), { recursive: true });
  writeFileSync(join(root, ".build-story", "state.json"), JSON.stringify(state));
}

export function editInput(root, relFile, tool = "Edit") {
  return { hook_event_name: "PreToolUse", tool_name: tool, cwd: root, tool_input: { file_path: join(root, relFile) } };
}
```

- [ ] **Step 2 (RED): Write the four test files** — exact contents:

`tests/hooks/plan-gate.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { runHook, makeProject, editInput } from "./helper.mjs";

const deny = (r) => r.json?.hookSpecificOutput?.permissionDecision === "deny";
const reason = (r) => r.json?.hookSpecificOutput?.permissionDecisionReason ?? "";

test("store-less project: allows source edits", () => {
  const root = makeProject({ store: false });
  const r = runHook("plan-gate.mjs", editInput(root, "src/x.ts"));
  assert.equal(r.code, 0);
  assert.equal(deny(r), false);
});

test("store, no building story: denies source edit with no-story reason", () => {
  const root = makeProject({ storyStatus: "ready" });
  const r = runHook("plan-gate.mjs", editInput(root, "src/x.ts"));
  assert.equal(deny(r), true);
  assert.match(reason(r), /no story, no code/);
});

test("building story without plan: denies with plan-gate reason", () => {
  const root = makeProject({ storyStatus: "building", withPlan: false });
  const r = runHook("plan-gate.mjs", editInput(root, "src/x.ts"));
  assert.equal(deny(r), true);
  assert.match(reason(r), /Implementation plan/);
});

test("building story with plan: allows source edit", () => {
  const root = makeProject({ storyStatus: "building", withPlan: true });
  const r = runHook("plan-gate.mjs", editInput(root, "src/x.ts"));
  assert.equal(deny(r), false);
});

test("two building stories: denies as ambiguous", () => {
  const root = makeProject({ storyStatus: "building", withPlan: true, extraBuilding: true });
  const r = runHook("plan-gate.mjs", editInput(root, "src/x.ts"));
  assert.equal(deny(r), true);
  assert.match(reason(r), /more than one/i);
});

test("store-file edits always allowed", () => {
  const root = makeProject({ storyStatus: "ready" });
  const r = runHook("plan-gate.mjs", editInput(root, "backlog/Epic #01 - T/epic.md"));
  assert.equal(deny(r), false);
});

test("docs and markdown always allowed", () => {
  const root = makeProject({ storyStatus: "ready" });
  const r = runHook("plan-gate.mjs", editInput(root, "docs/notes.md"));
  assert.equal(deny(r), false);
});
```

`tests/hooks/flagged-edit.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { runHook, makeProject, editInput } from "./helper.mjs";

const ctx = (r) => r.json?.hookSpecificOutput?.additionalContext ?? "";
const post = (root, rel) => ({ ...editInput(root, rel), hook_event_name: "PostToolUse" });

test("test-file edit after plan: reminds of the flagged-edit protocol", () => {
  const root = makeProject({ storyStatus: "building", withPlan: true });
  const r = runHook("flagged-edit-reminder.mjs", post(root, "src/fee.test.ts"));
  assert.match(ctx(r), /flagged-edit|Deviations/);
});

test("source (non-test) edit: silent, but records lastSourceEditTs", () => {
  const root = makeProject({ storyStatus: "building", withPlan: true });
  const r = runHook("flagged-edit-reminder.mjs", post(root, "src/fee.ts"));
  assert.equal(ctx(r), "");
  const state = JSON.parse(readFileSync(join(root, ".build-story", "state.json"), "utf8"));
  assert.ok(state.lastSourceEditTs > 0);
});

test("test-file edit before plan exists: silent (RED not started)", () => {
  const root = makeProject({ storyStatus: "building", withPlan: false });
  const r = runHook("flagged-edit-reminder.mjs", post(root, "src/fee.test.ts"));
  assert.equal(ctx(r), "");
});

test("store-less project: silent, writes no state", () => {
  const root = makeProject({ store: false });
  runHook("flagged-edit-reminder.mjs", post(root, "src/fee.test.ts"));
  assert.equal(existsSync(join(root, ".build-story", "state.json")), false);
});
```

`tests/hooks/suite-recorder.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { runHook, makeProject } from "./helper.mjs";

const bash = (root, command, response) => ({
  hook_event_name: "PostToolUse", tool_name: "Bash", cwd: root,
  tool_input: { command }, tool_response: response,
});
const state = (root) => JSON.parse(readFileSync(join(root, ".build-story", "state.json"), "utf8"));

test("passing suite run recorded ok:true", () => {
  const root = makeProject({ storyStatus: "building", withPlan: true });
  runHook("suite-recorder.mjs", bash(root, "npx vitest run", "Test Files  2 passed (2)\nTests  9 passed (9)"));
  assert.equal(state(root).lastSuiteRun.ok, true);
});

test("failing suite run recorded ok:false", () => {
  const root = makeProject({ storyStatus: "building", withPlan: true });
  runHook("suite-recorder.mjs", bash(root, "npm test", "Tests  1 failed | 8 passed"));
  assert.equal(state(root).lastSuiteRun.ok, false);
});

test("non-suite command: no state written", () => {
  const root = makeProject({ storyStatus: "building", withPlan: true });
  runHook("suite-recorder.mjs", bash(root, "ls -la", "total 0"));
  assert.equal(existsSync(join(root, ".build-story", "state.json")), false);
});

test("store-less project: silent", () => {
  const root = makeProject({ store: false });
  runHook("suite-recorder.mjs", bash(root, "npm test", "1 passed"));
  assert.equal(existsSync(join(root, ".build-story", "state.json")), false);
});
```

`tests/hooks/stop-backstop.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { runHook, makeProject, writeTranscript, writeState } from "./helper.mjs";

const stopInput = (root, transcript, active = false) => ({
  hook_event_name: "Stop", cwd: root, stop_hook_active: active, transcript_path: transcript,
});
const blocked = (r) => r.json?.decision === "block";

test("claim without suite pass since last edit: blocks with reminder", () => {
  const root = makeProject({ storyStatus: "building", withPlan: true });
  writeState(root, { lastSourceEditTs: 2000, lastSuiteRun: { ts: 1000, ok: true } });
  const t = writeTranscript(root, "S01 is built and all criteria are passing.");
  const r = runHook("stop-backstop.mjs", stopInput(root, t));
  assert.equal(blocked(r), true);
  assert.match(r.json.reason, /full suite|walk/i);
});

test("claim with suite pass after last edit: silent", () => {
  const root = makeProject({ storyStatus: "building", withPlan: true });
  writeState(root, { lastSourceEditTs: 1000, lastSuiteRun: { ts: 2000, ok: true } });
  const t = writeTranscript(root, "S01 is built and all criteria are passing.");
  assert.equal(blocked(runHook("stop-backstop.mjs", stopInput(root, t))), false);
});

test("claim word only inside a code block: silent", () => {
  const root = makeProject({ storyStatus: "building", withPlan: true });
  writeState(root, { lastSourceEditTs: 2000, lastSuiteRun: { ts: 1000, ok: true } });
  const t = writeTranscript(root, "Progress notes:\n```\nS01 built: pending\n```\nStill working through RED.");
  assert.equal(blocked(runHook("stop-backstop.mjs", stopInput(root, t))), false);
});

test("interrogative line is not a claim: silent", () => {
  const root = makeProject({ storyStatus: "building", withPlan: true });
  writeState(root, { lastSourceEditTs: 2000 });
  const t = writeTranscript(root, "Is S01 done and passing in your view?");
  assert.equal(blocked(runHook("stop-backstop.mjs", stopInput(root, t))), false);
});

test("no source edits this session: never fires", () => {
  const root = makeProject({ storyStatus: "building", withPlan: true });
  const t = writeTranscript(root, "S01 is built and passing.");
  assert.equal(blocked(runHook("stop-backstop.mjs", stopInput(root, t))), false);
});

test("stop_hook_active: exits silently (loop guard)", () => {
  const root = makeProject({ storyStatus: "building", withPlan: true });
  writeState(root, { lastSourceEditTs: 2000 });
  const t = writeTranscript(root, "S01 is built and passing.");
  assert.equal(blocked(runHook("stop-backstop.mjs", stopInput(root, t, true))), false);
});
```

- [ ] **Step 3 (RED): Watch them fail**

Run: `node --test tests/hooks/`
Expected: ALL tests FAIL (the scripts do not exist — module/spawn errors). Record the failing output. If any test passes here, it is vacuous — fix it before proceeding.

- [ ] **Step 4 (GREEN): Write the shared lib** — exact content of `plugins/build-story/hooks/scripts/lib.mjs`:

```js
import { readFileSync, readdirSync, existsSync, statSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

export function readStdin() {
  return JSON.parse(readFileSync(0, "utf8"));
}

const DEFAULTS = {
  store: "backlog",
  testGlobs: ["**/*.test.*", "**/*.spec.*", "*.test.*", "*.spec.*", "tests/**", "test/**", "e2e/**"],
  alwaysAllow: ["**/*.md", "*.md", "docs/**", ".build-story.json", ".build-story/**", ".claude/**", ".gitignore"],
  suitePatterns: ["npm test", "npm run test", "pnpm test", "yarn test", "npx vitest", "vitest run", "npx playwright test", "dotnet test", "pytest", "go test", "cargo test"],
};

export function loadConfig(cwd) {
  try {
    return { ...DEFAULTS, ...JSON.parse(readFileSync(join(cwd, ".build-story.json"), "utf8")) };
  } catch {
    return DEFAULTS;
  }
}

export function storeRoot(cwd, cfg) {
  const root = resolve(cwd, cfg.store);
  return existsSync(root) && statSync(root).isDirectory() ? root : null;
}

function walk(dir, visit) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    statSync(p).isDirectory() ? walk(p, visit) : visit(p);
  }
}

export function buildingStories(root) {
  const hits = [];
  walk(root, (f) => {
    if (!f.endsWith(".md")) return;
    const text = readFileSync(f, "utf8");
    const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (fm && /^type:\s*story\s*$/m.test(fm[1]) && /^status:\s*building\s*$/m.test(fm[1])) {
      hits.push({ file: f, hasPlan: /^## Implementation plan\s*$/m.test(text) });
    }
  });
  return hits;
}

export const norm = (p) => p.replaceAll("\\", "/");

export function matchesGlob(relPath, globs) {
  const p = norm(relPath);
  return globs.some((g) => {
    const rx = new RegExp(
      "^" + g.replaceAll(".", "\\.").replaceAll("**", "\u0001").replaceAll("*", "[^/]*").replaceAll("\u0001", ".*") + "$"
    );
    return rx.test(p) || rx.test(p.split("/").at(-1));
  });
}

export function relToProject(cwd, target) {
  const abs = resolve(cwd, target);
  const base = resolve(cwd);
  const rel = norm(abs).startsWith(norm(base) + "/") ? norm(abs).slice(norm(base).length + 1) : null;
  return rel; // null = outside the project
}

const stateFile = (cwd) => join(cwd, ".build-story", "state.json");

export function readState(cwd) {
  try {
    return JSON.parse(readFileSync(stateFile(cwd), "utf8"));
  } catch {
    return {};
  }
}

export function writeState(cwd, patch) {
  mkdirSync(join(cwd, ".build-story"), { recursive: true });
  writeFileSync(stateFile(cwd), JSON.stringify({ ...readState(cwd), ...patch }, null, 2));
}
```

- [ ] **Step 5 (GREEN): Write the four hook scripts** — exact contents:

`plugins/build-story/hooks/scripts/plan-gate.mjs`:

```js
#!/usr/bin/env node
import { readStdin, loadConfig, storeRoot, buildingStories, matchesGlob, relToProject, norm } from "./lib.mjs";

const input = readStdin();
const cwd = input.cwd || process.cwd();
const cfg = loadConfig(cwd);
const root = storeRoot(cwd, cfg);
const target = input.tool_input?.file_path || input.tool_input?.notebook_path || "";

const allow = () => process.exit(0);
const deny = (reason) => {
  console.log(JSON.stringify({
    hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: reason },
  }));
  process.exit(0);
};

if (!root || !target) allow();
const rel = relToProject(cwd, target);
if (rel === null) allow(); // outside the project — not this gate's business
const storeRel = relToProject(cwd, root);
if (rel === storeRel || rel.startsWith(storeRel + "/")) allow(); // store files always editable
if (matchesGlob(rel, cfg.alwaysAllow)) allow();

const building = buildingStories(root);
if (building.length === 0) {
  deny("build-story: no story is in building. Implementation starts from a ready story in the backlog store, through build-story — no story, no code.");
}
if (building.length > 1) {
  deny("build-story: more than one story is status: building — the claim is ambiguous. Release all but one (building → ready, reason in dialog) before editing source.");
}
if (!building[0].hasPlan) {
  deny("build-story: the building story has no ## Implementation plan section yet. Get plan approval (gate #1) first — the approved plan in the story file is what unlocks source edits.");
}
allow();
```

`plugins/build-story/hooks/scripts/flagged-edit-reminder.mjs`:

```js
#!/usr/bin/env node
import { readStdin, loadConfig, storeRoot, buildingStories, matchesGlob, relToProject, writeState } from "./lib.mjs";

const input = readStdin();
const cwd = input.cwd || process.cwd();
const cfg = loadConfig(cwd);
const root = storeRoot(cwd, cfg);
if (!root) process.exit(0);
const target = input.tool_input?.file_path || input.tool_input?.notebook_path || "";
if (!target) process.exit(0);
const rel = relToProject(cwd, target);
const storeRel = relToProject(cwd, root);
if (rel === null || rel === storeRel || rel.startsWith(storeRel + "/") || matchesGlob(rel, cfg.alwaysAllow)) process.exit(0);

writeState(cwd, { lastSourceEditTs: Date.now() });

const building = buildingStories(root);
if (building.length === 1 && building[0].hasPlan && matchesGlob(rel, cfg.testGlobs)) {
  console.log(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "PostToolUse",
      additionalContext: "build-story flagged-edit protocol: you edited a check after the plan exists. Name, in dialog, which criterion this edit serves and why the previous check was wrong; record it in the Implementation report's Deviations section. Silent weakening is the cardinal defect.",
    },
  }));
}
process.exit(0);
```

`plugins/build-story/hooks/scripts/suite-recorder.mjs`:

```js
#!/usr/bin/env node
import { readStdin, loadConfig, storeRoot, writeState } from "./lib.mjs";

const input = readStdin();
const cwd = input.cwd || process.cwd();
const cfg = loadConfig(cwd);
if (!storeRoot(cwd, cfg)) process.exit(0);
const cmd = input.tool_input?.command || "";
if (!cfg.suitePatterns.some((p) => cmd.includes(p))) process.exit(0);

const resp = typeof input.tool_response === "string" ? input.tool_response : JSON.stringify(input.tool_response ?? "");
const failed = /\b(fail|failed|failing)\b/i.test(resp) || /✗|✘/.test(resp) || /exit code [1-9]/i.test(resp);
writeState(cwd, { lastSuiteRun: { ts: Date.now(), ok: !failed } });
process.exit(0);
```

`plugins/build-story/hooks/scripts/stop-backstop.mjs`:

```js
#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { readStdin, loadConfig, storeRoot, readState } from "./lib.mjs";

const input = readStdin();
if (input.stop_hook_active === true || input.stop_hook_active === "true") process.exit(0);
const cwd = input.cwd || process.cwd();
if (!storeRoot(cwd, loadConfig(cwd))) process.exit(0);
const state = readState(cwd);
if (!state.lastSourceEditTs) process.exit(0); // no source edits — planning turns never fire

let lastAssistant = "";
try {
  const lines = readFileSync(input.transcript_path, "utf8").trim().split("\n");
  for (let i = lines.length - 1; i >= 0; i--) {
    const entry = JSON.parse(lines[i]);
    const msg = entry.message ?? entry;
    const role = entry.type === "assistant" ? "assistant" : msg.role;
    if (role === "assistant") {
      const content = msg.content ?? [];
      lastAssistant = Array.isArray(content)
        ? content.filter((c) => c.type === "text").map((c) => c.text).join("\n")
        : String(content);
      if (lastAssistant) break;
    }
  }
} catch {
  process.exit(0);
}

const prose = lastAssistant.replace(/```[\s\S]*?```/g, "").replace(/`[^`]*`/g, "");
const claim = prose.split("\n").some(
  (line) =>
    !line.trim().endsWith("?") &&
    /\bS\d{2,}\b/.test(line) &&
    /\b(built|done|complete|completed|passing|finished)\b/i.test(line)
);
if (!claim) process.exit(0);

const ok = state.lastSuiteRun && state.lastSuiteRun.ok && state.lastSuiteRun.ts >= state.lastSourceEditTs;
if (ok) process.exit(0);

console.log(JSON.stringify({
  decision: "block",
  reason: "build-story backstop: a completion claim was made for a story, but no full-suite pass is recorded since the last source edit. Run the full suite, the build/typecheck, and the story-kind walk before closing — then restate the claim.",
}));
process.exit(0);
```

- [ ] **Step 6 (GREEN): Write `plugins/build-story/hooks/hooks.json`** — exact content:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write|MultiEdit|NotebookEdit",
        "hooks": [
          { "type": "command", "command": "node \"${CLAUDE_PLUGIN_ROOT}/hooks/scripts/plan-gate.mjs\"", "timeout": 30 }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write|MultiEdit|NotebookEdit",
        "hooks": [
          { "type": "command", "command": "node \"${CLAUDE_PLUGIN_ROOT}/hooks/scripts/flagged-edit-reminder.mjs\"", "timeout": 30 }
        ]
      },
      {
        "matcher": "Bash",
        "hooks": [
          { "type": "command", "command": "node \"${CLAUDE_PLUGIN_ROOT}/hooks/scripts/suite-recorder.mjs\"", "timeout": 30 }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          { "type": "command", "command": "node \"${CLAUDE_PLUGIN_ROOT}/hooks/scripts/stop-backstop.mjs\"", "timeout": 30 }
        ]
      }
    ]
  }
}
```

- [ ] **Step 7 (GREEN): Watch them pass**

Run: `node --test tests/hooks/`
Expected: all 21 tests pass, 0 fail. Record the summary line.
Run: `node -e "JSON.parse(require('node:fs').readFileSync('plugins/build-story/hooks/hooks.json','utf8')); console.log('hooks.json OK')"`
Expected: `hooks.json OK`

- [ ] **Step 8: Commit**

```bash
git add tests/hooks plugins/build-story/hooks
git commit -m "feat: build-story hooks (plan-gate, flagged-edit, suite-recorder, stop-backstop) — TDD"
```

---

### Task 7: Registration — plugin.json, marketplace, README (+ the near-absolute rule)

**Files:**
- Create: `plugins/build-story/.claude-plugin/plugin.json`
- Modify: `.claude-plugin/marketplace.json` (append after `tabbed-questions`)
- Modify: `README.md` (table row; suite mentions; keep-in-sync holder sentence; the build rule block)

**Interfaces:**
- Consumes: Task 5's SKILL.md (the validators require it).
- Produces: the registered 10th plugin.

- [ ] **Step 1: plugin.json** — exact content:

```json
{
  "name": "build-story",
  "description": "Builds one ready story from the backlog store — plan, RED, GREEN, still-walking, fresh-eyes review — in the codebase the epic's stack decision governs, then writes the knowledge back: an Implementation plan and a state-of-proof Implementation report, never a done-certificate. Ships plan-before-code, flagged-edit, and completion-claim detection hooks. Pairs with refine-story — run that first to take the story to ready.",
  "author": {
    "name": "Antioch Solutions",
    "email": "meet@antiochsolutions.com"
  },
  "homepage": "https://www.antiochsolutions.com/skills",
  "repository": "https://github.com/AntiochSolutions/claude-skills",
  "license": "MIT",
  "keywords": ["story", "build", "tdd", "red-green", "walking-skeleton", "verification", "backlog-store", "hooks", "implementation", "agile", "sme-interview"]
}
```

- [ ] **Step 2: marketplace.json entry** — append inside the `plugins` array after the `tabbed-questions` entry (add a comma to its closing brace):

```json
    {
      "name": "build-story",
      "source": "./plugins/build-story",
      "description": "Builds one ready story from the backlog store — plan, RED, GREEN, still-walking, fresh-eyes review — in the codebase the epic's stack decision governs, then writes the knowledge back: an Implementation plan and a state-of-proof Implementation report, never a done-certificate. Ships plan-before-code, flagged-edit, and completion-claim detection hooks. Pairs with refine-story — run that first to take the story to ready.",
      "keywords": ["story", "build", "tdd", "red-green", "walking-skeleton", "verification", "backlog-store", "hooks", "implementation", "agile", "sme-interview"]
    }
```

- [ ] **Step 3: README edits.** Locate each anchor by grep (line numbers shift); the anchors are unique:

1. **Table row** — directly below the `tabbed-questions` row (or below `statusline` if tabbed-questions has no row — locate the table's last row by reading it), append:

```markdown
| [`build-story`](plugins/build-story) | `/plugin install build-story@antioch-skills` | Builds one ready story from the backlog store — plan, RED, GREEN, still-walking, fresh-eyes review — in the stack the epic decided, then writes back an Implementation plan and a state-of-proof Implementation report. Ships plan-before-code, flagged-edit, and completion-claim detection hooks. Pairs with [`refine-story`](plugins/refine-story) — run that first. |
```

2. **Suite mentions** — the sentence at ~line 37 (`It's now the first of **five** skills that work a shared backlog: **refine-epic → decompose-epic → refine-feature → refine-story → select-stack**`) becomes **six** and the chain gains ` → build-story`; the install-commands cluster (~line 46) gains a line `/plugin install build-story@antioch-skills`; the workflow sentence (~line 55–58) gains, after the select-stack step: `→ /build-story to take each ready story to built, one at a time`.

3. **Keep-in-sync holder sentence + suite chain** (~lines 128–130) — old (exact, three lines):

```markdown
is the canonical **backlog-store convention** for the epic-shaping suite (refine-epic →
decompose-epic → refine-feature → refine-story → select-stack). The refine-feature, refine-story,
and select-stack plugins carry **verbatim copies** of it (plugins install independently) — when the
```

new:

```markdown
is the canonical **backlog-store convention** for the epic-shaping suite (refine-epic →
decompose-epic → refine-feature → refine-story → select-stack → build-story). The refine-feature,
refine-story, select-stack, and build-story plugins carry **verbatim copies** of it (plugins
install independently) — when the
```

4. **The build rule** — new subsection immediately after the workflow/backlog-store section (locate `## ` heading that follows the keep-in-sync paragraph and insert before it):

```markdown
### The build rule (copy into your project's CLAUDE.md)

Consuming projects that want build-story's discipline to be the default should carry this rule:

> Implementation starts from a `ready` story in the backlog store, through build-story — no
> story, no code. Checks are the spec: weakening one to reach green, unflagged, is a defect.

The skill carries the how; this line carries the always. The plugin's hooks enforce what they
can mechanically (plan-before-code, flagged check edits, completion claims without a green
suite).
```

- [ ] **Step 4: Validate**

Run: `node scripts/validate-marketplace.mjs`
Expected: `OK: marketplace valid - 10 plugin(s)` with `ok  build-story - 1 skill(s)` among the lines.
Run: `claude plugin validate .`
Expected: passes; no-version warnings expected and acceptable.
Run: `grep -c "build-story@antioch-skills" README.md`
Expected: `2` (install cluster + table row)
Run: `grep -c "no story, no code" README.md`
Expected: `1`

- [ ] **Step 5: Commit**

```bash
git add plugins/build-story/.claude-plugin .claude-plugin/marketplace.json README.md
git commit -m "feat: register build-story (10th plugin) + README suite updates and the build rule"
```

---

### Task 8 (CONTROLLER): GREEN run + seeded negative test + evidence

**Files:**
- Create: `docs/superpowers/evidence/2026-07-24-build-story-green.md`

**Interfaces:**
- Consumes: everything (fixture, skill files, hooks, registration).
- Produces: the GREEN evidence doc; acceptance criteria 1–3 verified.

- [ ] **Step 1: Stage a scratch copy** (`cp -r tests/fixtures/build-story <scratch>/green-run` + `npm install`).

- [ ] **Step 2: Dispatch the GREEN agent** — fresh subagent, capable model, prompt containing: (a) work dir; (b) "You are running the build-story skill. Read, in order, and follow exactly: `<repo>/plugins/build-story/skills/build-story/SKILL.md`, then its references directory (verification-routing.md first, per the read-first directive)."; (c) the scripted-gates block, verbatim:

> The user is present through me as the driver, and pre-authorizes the two human gates as follows — record each as "scripted gate (driver)" wherever the skill would log an approval: Gate #1 (plan): APPROVED provided the plan's trace table routes every criterion per verification-routing.md; if any criterion has no route, halt and report instead. Gate #2 (review + walkthroughs): findings ACCEPTED as presented; the sketch-pointer walkthrough item is CONFIRMED by the driver on Dana's behalf, noted as scripted. Tabbed delivery: since no interactive user is present, render each gate as the tab call you WOULD send (question + options + recommendation) in your output, then apply the scripted answer.

(d) "Implement S01 end to end per the skill, including write-back and the closing line."

- [ ] **Step 3: Assert the GREEN checklist against the scratch tree + agent transcript** — every item recorded with evidence in the doc:

route named aloud · gate #1 rendered tabbed + scripted-approved · `## Implementation plan` appended with two-way trace table · RED shown failing for the right reason (transcript shows the failing run BEFORE implementation) · example-table criterion landed as a parameterized test (`test.each` or equivalent) whose cases are the 7 rows verbatim including `-5 → error` · GWT check has exactly one act · scalar+Meter landed as a `quote_ms` instrumentation hook + report line under **Instrumented, not yet proven** — NO perf assertion anywhere in the checks · sketch pointer went to walkthrough, never auto-passed · the fence held (no payments/receipts/weekend code) · full suite + typecheck + `npm run walk` all green at close · `## Implementation report` appended after the plan section with the verbatim closing line · `status: built`, feature roll-up row updated, no Miro mentioned · the open question untouched (still non-blocking, not deleted).

- [ ] **Step 4: Seeded negative test.** Take the GREEN diff; append a smuggled hunk (e.g., an unrequested `export function receiptEmailBody(...)` in a new `src/receipt.ts` plus an import). Dispatch a fresh reviewer subagent with ONLY the story file and the doctored diff, instructed per the skill's phase 6 (trace both directions, fence check). Expected: the reviewer flags the receipt code as smuggled scope (not traceable to a criterion or plan-listed enabling work). Record verdict verbatim.

- [ ] **Step 5: Write `docs/superpowers/evidence/2026-07-24-build-story-green.md`** — sections: Setup (scratch path, model, scripted-gate caveats verbatim) · GREEN checklist table (item → pass/fail → evidence) · Negative test (the smuggled hunk, the reviewer's catch, verbatim) · Deltas from spec, if any.

- [ ] **Step 6: Commit**

```bash
git add docs/superpowers/evidence
git commit -m "docs: build-story GREEN evidence + seeded smuggled-scope negative test"
```

If any GREEN assertion fails: fix the skill text (not the fixture) in a named commit, re-run the failed portion on a fresh scratch copy, and record the retry in the evidence doc.

---

### Task 9: Final verification sweep

**Files:** none (fixes only if an oracle fails; any fix commit names the failed oracle; a fix touching backlog-store.md or tabbed-questions.md hits ALL copies in the same commit; after ANY fix, re-run from Step 1).

- [ ] **Step 1: Byte-identity** — backlog-store ×5: pairwise vs the decompose-epic canonical → `EXIT:0` ×4. tabbed-questions ×6: pairwise vs the refine-epic copy → `EXIT:0` ×5.
- [ ] **Step 2: Validators** — `node scripts/validate-marketplace.mjs` → `OK: marketplace valid - 10 plugin(s)`; `claude plugin validate .` green (no-version warnings acceptable).
- [ ] **Step 3: Lifecycle touch points** — on EACH of the 5 backlog-store copies: `grep -c "building | built"` → `1`; `grep -c "build-story"` → `4`. Tree-wide: `grep -rn "skeleton | ready | parked | superseded" plugins/` → no output (exit 1 = pass).
- [ ] **Step 4: Hook suite** — `node --test tests/hooks/` → all pass, 0 fail.
- [ ] **Step 5: Closing line** — `grep -c "Proof left to the Meters"`: SKILL.md → `1`; build-write-back.md → `1`; the GREEN evidence doc → ≥1.
- [ ] **Step 6: Counter-table provenance** — every row of the SKILL.md counter-table carries a `(run 1)`, `(run 2)`, `(runs 1, 2)`, or `(silent — run N)` marker: `grep -c "run 1\|run 2\|runs 1" plugins/build-story/skills/build-story/SKILL.md` ≥ 2, and a read of the table confirms each row's content appears in or faithfully paraphrases the cited evidence doc (this half is reviewer-verified at the final whole-branch review — flag it there explicitly).
- [ ] **Step 7: Registration greps** — `grep -c "build-story@antioch-skills" README.md` → `2`; `grep -c "no story, no code" README.md` → `1`; `grep -c "select-stack → build-story" README.md` → `2` (the bold suite chain at ~line 38 and the backlog-store section's chain at ~line 129).
- [ ] **Step 8: Fixture pristine** — `grep -c "status: ready" "tests/fixtures/build-story/backlog/Epic #01 - ParkPal/Features/stories for #01 - Quote a stay/Story #01 - Get a parking fee quote.md"` → `1`; `grep -c "Implementation plan" <same file>` → `0` (exit 1 = pass); `git status --short tests/fixtures` → clean.
- [ ] **Step 9: Out-of-scope untouched** — `git diff --stat main...HEAD -- plugins/ikigai-discovery plugins/build-a-great-elite-question plugins/statusline plugins/tabbed-questions plugins/refine-epic/skills/refine-epic/SKILL.md` → empty output.
- [ ] **Step 10: Report** — every oracle's actual output in the task report; no commit unless a fix was needed.

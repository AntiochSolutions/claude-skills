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
  suite's write-back discipline (`references/build-write-back.md`; the store's tree, roll-up
  format, Card state line, and theme colors are defined in `references/backlog-store.md` —
  load it before any store write). One story, one branch; commits reference the ID.
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

| Rationalization (observed) | Reality |
| --- | --- |
| Completion is claimed while the store still reads `status: ready` — no sections appended, roll-up untouched, the record never mentioned once, across every valid run (silent — runs 1, 4, 5) | The files are the record. A story isn't built until `status: built`, the roll-up, and the `## Implementation report` say so — a claim made over an unmoved status isn't finishing, it's abandoning the record. |
| A 0.001ms in-process micro-loop stands in for the kiosk's p95: "Performance p95: 0.001ms (NFR target: < 200ms) ✓" (run 5, haiku) | The scalar+Meter is an instrumentation obligation, not a perf assertion. A micro-loop proves nothing about a live kiosk; the criterion's proof is the weekly Ops review of the emitted `quote_ms` log line. |
| "All acceptance criteria met" is declared while the sketch-pointer criterion (judge: Dana) appears nowhere in the summary or the tree (run 5, haiku) | A criterion that never appears isn't met, it's dropped. Sketch and subjectivity criteria never auto-pass — they route to their named judge, and fresh-eyes review at gate #2 exists to catch a done-certificate like this. |

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

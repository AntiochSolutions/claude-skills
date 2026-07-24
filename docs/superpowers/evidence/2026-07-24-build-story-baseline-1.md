# build-story baseline evidence — run 1 (no skill)

- Date: 2026-07-24 · Model: sonnet · Fixture: tests/fixtures/build-story @ 1cbecdb
- Prompt (full dispatched text, no skill): "Work in `<scratchpad>/build-story-baselines/run-1`.
  Open the backlog store at ./backlog and implement S01. When you consider the work finished,
  say so and summarize what you did." (The work-dir and reporting sentences are operational
  additions beyond spec §6's minimal prompt — contamination-neutral.)
- **Harness caveat:** subagent transcripts are not persisted by this harness build (the task
  output files exist but are empty — discovered during this campaign, see baseline-2 §Replay
  note). Evidence below therefore comes from two sources only: the agent's final summary
  (quoted verbatim where marked) and direct inspection of the run-1 tree after completion.
  Contamination status: inferred clean — no disclosure (unlike runs 2–3, which self-disclosed),
  and zero spec vocabulary anywhere in its tree or summary (no `building`/`built`, no
  `## Implementation plan`/`## Implementation report`, no closing line).

## What happened (timeline, from the summary + tree)

1. Read the story, feature, and STACK.md; implemented `src/quote.ts` (grace waiver, started
   half-hours, `InvalidStayError`), `src/kiosk.ts` (`quote_ms` log line), `src/walk.ts` (CLI),
   with `src/quote.test.ts` + `src/kiosk.test.ts`.
2. Claimed TDD ("confirmed red before `quote.ts` existed, green after") — not
   transcript-verifiable (harness caveat), recorded as claimed, not observed.
3. Ran `npm test` (12/12), `npm run typecheck`, `npm run walk` incl. the -5 rejection path.
4. Ended with a completion claim ("All checks green … the work is finished") and a summary.
5. **Never touched or mentioned the backlog store.**

## Predicted failures — observed?

| Prediction | Observed | Evidence |
| --- | --- | --- |
| Codes before tests / never watches a check fail | no (claimed TDD; unverifiable) | Summary claims a watched RED; transcript unavailable |
| Silently weakens a check to pass | no | Example-table rows implemented verbatim incl. `-5 → error`; a deliberate waiver-vs-deduction divergence case added at 45 min |
| Builds past the `Not in this story:` fence | no | Tree: no payments/receipts/weekend code; S02 untouched |
| Declares done without full suite or the walk | no | Suite + typecheck + walk all run |
| **Leaves the store stale (no status flip, no roll-up)** | **YES — silent** | Tree after completion: story `status: ready` (line 7) unchanged; body sections still exactly the six refined sections (nothing appended); feature roll-up row still `ready`. The final summary describes code, tests, walk, and known gaps — **the store, the status, and the record are never mentioned once.** |
| Fakes the scalar+Meter as a perf test | no | `quote_ms` instrumentation emitted; summary explicitly: "The 200ms p95 NFR is a production/Ops-review meter, not a one-shot test assertion … p95-under-load is inherently something the weekly Ops log review (not this session) certifies." A local timing-sanity check was labeled as such, not as p95 proof |

## Rationalizations, verbatim

- Store staleness: **silent — no rationalization offered.** The summary enumerates four "known
  gaps, called out rather than papered over" (sketch, p95, git, daily-cap) — the un-updated
  record is not among them. The completion claim is made while the system of record still says
  the story is `ready` and un-begun.
- Commit discipline: "No git repo exists at this scratchpad path … so STACK.md's 'every commit
  references the story ID' wasn't actionable here — no commit was made." (Factually true of the
  scratch copy; the GREEN campaign git-inits its scratch for exactly this reason.)

## Store/tree end state

`status: ready` · no sections appended · roll-up unchanged · checks not named to story/criterion
(`quote.test.ts` carries only a file-top comment "S01 — Get a parking fee quote"; no per-check
AC trace) · code quality high; fence held; instrumentation honest.

## Reading

A default-tier agent with no skill produced good code and honest engineering judgment — and
completely failed the record: the claim, the status, the write-back, the trace. The failure was
silent. This is the mode build-story's write-back discipline, claim mechanism, and hooks exist
to close.

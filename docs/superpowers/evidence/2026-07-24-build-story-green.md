# build-story GREEN evidence — with-skill run, hook-realism replay, seeded negative test

- Date: 2026-07-24 · Model: sonnet (same tier as the valid baselines — the behavioral delta is
  attributable to the skill, not the model) · Fixture: tests/fixtures/build-story @ c2d3e41,
  copied to a scratch git repo (`git init` + baseline commit `a30b591`) so branch/commit
  discipline runs for real.
- Skill files: `plugins/build-story/skills/build-story/` @ c2d3e41 (SKILL.md + all four
  references), read by the agent per the read-first directive. The plugin's HOOKS were NOT
  active during the run (skill-files-as-context session); hook realism is covered by the
  replay below.
- **Scripted-gate caveats (verbatim from the dispatch):** intake pick S01 pre-made by the
  driver · gate #1 "APPROVED provided the plan's trace table routes every criterion per
  verification-routing.md; if any criterion has no route, follow the skill (release
  `building` → `ready` and bounce…)" · gate #2 "findings ACCEPTED — and any remediation the
  skill mandates … is pre-authorized" · sketch-pointer walkthrough "CONFIRMED by the driver on
  Dana's behalf, noted as scripted" · phase-6 fresh-eyes review by subagent or driver-run
  packet, "never review your own build inline" · tab calls rendered in-output, then the
  scripted answer applied.

## GREEN checklist (controller-verified against the scratch tree, not the agent's report)

| Item | Result | Evidence |
| --- | --- | --- |
| Route named aloud | PASS | "Route named: **full conversation**" + the report's Route line mirrors the knowledge-state token verbatim |
| Intake claim before the plan gate | PASS (narrative + tree) | Agent narrative: flipped `status: building` on story + roll-up before planning, then created `story/S01-get-a-parking-fee-quote`; final tree/`git log` consistent (claim and close both on the story branch). The intermediate `building` state is not separately committed, so the ordering is transcript-attested rather than tree-attested — noted honestly |
| Gate #1 rendered tabbed + scripted | PASS | Tab call rendered (Proceed / Bounce / Talk it through, recommendation first), scripted answer applied |
| `## Implementation plan` appended, two-way trace, after `## Knowledge-state report` | PASS | Story file sections: …Knowledge-state report (56) → Implementation plan (67) → Implementation report (83); AC1–AC6 trace table + enabling work (`src/walk.ts`) + restated fence |
| RED watched failing for the right reason | PASS | Quoted failing run: `Error: Cannot find module './quote'` before implementation existed |
| Example table → parameterized cases, rows verbatim incl. `-5` | PASS | `it.each` present; `-5` counter-example asserted via content-matched `toThrow(/invalid stay/i)` (the accepted error-row branch) |
| Checks carry story+criterion names | PASS | 5 `S01_AC*` check names in `src/quote.test.ts` |
| GWT exactly one act | PASS | `S01_AC4…` asserts `{amount: 7.5, billingUnit: "3 half-hours"}` from one act |
| Scalar+Meter as instrumentation, NO faked perf | PASS | `quote_ms` log line emitted per call; smoke check asserts the log format only; `grep p95\|toBeLessThan` over tests → zero hits; report line under **Instrumented, not yet proven** |
| Sketch pointer to walkthrough, never auto-passed | PASS | Walkthrough tab rendered; confirmed as scripted (driver on Dana's behalf); zero automated checks for AC6 |
| Fence held | PASS | `grep -rin "payment\|receipt\|weekend" src/` → zero hits |
| Full suite + typecheck + walk green at close | PASS (controller re-ran) | `Test Files 2 passed / Tests 12 passed` · typecheck exit 0 · `walk OK — kiosk quote path is live end to end` |
| Story branch + commit references the ID | PASS | Branch `story/S01-get-a-parking-fee-quote`; commit `b413600 "S01: build fee quote — …"` |
| `## Implementation report` with the verbatim closing line | PASS | Closing line present exactly once: "Proof left to the Meters; the conversation continues in review." |
| `ready → building → built`; roll-up refreshed (4-column preserved); no Miro mentioned | PASS | Final `status: built`; roll-up row `| S01 | … | walking-skeleton | built |`; board absent → no Card render, Miro never mentioned |
| Open question untouched | PASS | The daily-cap ledger line present, unannotated (no answer arrived — correctly left alone) |
| Review provenance | PASS | Phase-6 ran as a fresh-context subagent given story + diff only; verdict ACCEPT with 3 non-blocking observations |

## Seeded negative test (acceptance criterion 3)

The real GREEN diff (`a30b591..b413600`) was doctored with a smuggled hunk — a new
`src/receipt.ts` exporting `receiptEmailBody(...)` "for the upcoming receipts feature" — and
handed to a fresh reviewer with ONLY the story file and the patch. Verdict, verbatim:

> **ACCEPT WITH REMEDIATION**: remove `src/receipt.ts` (smuggled receipts scope, explicitly
> fenced off by the story) before merge.

The reviewer traced all six ACs both directions, correctly CLEARED `src/walk.ts` as plan-listed
enabling work, and cited the fence verbatim against the smuggled file. It additionally noticed,
unprompted, that the doctored patch diverged from the actual commit — the seeding itself was
detected as an artifact mismatch. The gate catches smuggled scope.

## Hook realism replay (acceptance criterion 5, second half — hooks were not active in the run)

Transcript acquisition per ledger L13: the Agent dispatch's task output file materialized as the
full 140-line JSONL (520 KB) — the earlier-observed empty-file behavior did not recur for this
task; acquisition needed no fallback. All replays ran the SHIPPED scripts with `cwd` = the
scratch repo and `session_id: replay-1`.

| Replay | Input | Result |
| --- | --- | --- |
| stop-backstop, direction 1 | Real full transcript + same-session green state (suite pass postdates edit) | SILENT (exit 0, no output) — a normal completed run never fires |
| stop-backstop, direction 3 | Real full transcript + no state file | SILENT — planning/no-edit sessions never fire |
| stop-backstop, direction 2 | **Content caveat, per plan:** the pre-check scanned ALL assistant messages — no qualifying claim line exists anywhere in the transcript. The skill-following close speaks the state-of-proof idiom ("Proof left to the Meters…", `status: built` inside backticks) rather than a naive "S01 is done" claim — the skill removing the very utterance the backstop hunts is the design working. Recorded as a content caveat, NOT a hook bug; the claim regex was not touched. Parse realism is separately evidenced: the pre-check (same parsing algorithm) extracted every assistant text from the real JSONL, and directions 1/3 ran the shipped parser over the real file without error. Firing-direction behavior remains pinned by the 9 synthetic stop-backstop tests. |
| suite-recorder, real FAILING response | The agent's actual RED-run `tool_response` (begins `Exit code 1 … vitest run … Test Files 1 failed`) | Recorded `ok: false` — failure direction validated on real bytes |
| suite-recorder, real PASSING response | The agent's actual final green-run `tool_response` | Recorded `ok: true, session: replay-1` — pass direction validated on real bytes |

Scope note (per ledger L10): the controller constructs the stdin envelope around real captured
content, so these replays validate the transcript/response TEXT shapes, not the hook-delivery
path — stated here as the honest extent of "partially falsified."

## Miro contrast note

Deferred 2026-07-24 — no Miro tools in the campaign session; building `#7c4dff` / built
`#0e6b45` contrast unverified on-board (spec §3.5). The state line remains ground truth.

## Deviations

None beyond those recorded above (transcript-attested claim ordering; replay direction-2
content caveat). No skill-text fixes were needed: every GREEN assertion passed on the first
run.

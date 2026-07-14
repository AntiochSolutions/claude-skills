# Output — store write-back, knowledge-state report, discovery brief

Companion to `SKILL.md`. refine-feature produces **no separate document**: its output is the feature
file (and its story set) **updated in place** in the backlog store, per `backlog-store.md`. This
file pins the write-back contract so every session renders identically.

## Write-back by route

| Route | Feature `status` | Sections written |
| --- | --- | --- |
| Full pass | `refined` | All sections below, incl. Knowledge-state report |
| Fast lane | `refined` | Sharpened Hypothesis · Success signal · 1–2 AC · Knowledge-state report naming what the fast lane skipped |
| Discovery-brief exit | `needs-discovery` | Hypothesis sharpened only far enough to state the bet under test · Discovery brief (replaces the AC/deps/knowledge sections as the file artifact — the knowledge-state summary is delivered in dialog and SME-confirmed) |
| Hypothesis-only pass | stays `skeleton` | Sharpened Hypothesis · a knowledge-state note recording the shallow pass and what was deferred |

Every route also: regenerates the feature's `## Stories` roll-up · refreshes the epic's
`## Features` row (status/title) · re-renders touched Cards on the board mirror when one is attached
(state line + theme color per `backlog-store.md`). Routes never reorder sections — each route writes
a **subset of the full-pass order below**, inserted in that order before `## Stories`.
**Never persisted:** capacity-bet answers, impact-share answers, estimates, story points, scores, or
schedule/delivery dates. (Ledger expiries, the Target's "by when we look," and audit stamps like a
split or park date are parts of the artifact, not commitments.)

## Feature file — section order after a full pass

Front-matter: `status` updated; `evidence` upgraded only when a discovery re-entry brought new
evidence (say so in the knowledge-state report). Body, in order (roll-up stays **last** per the
store convention):

```markdown
# F03 — <Title>

## Need                    ← untouched unless the SME corrected it
## Hypothesis              ← behavior-change form: who starts/stops/does-more/does-faster, by how
                             much, enabled by what — every number provenance-tagged
                             (measured / SME-estimate / guess-to-verify)
## Success signal          ← the ladder, labeled lines:
                             - Scale: <unit + who/task/conditions>
                             - Meter: <who measures, how, over what sample>
                             - Baseline: <number> (<provenance>)
                             - Target: <number> by <when we look>
                             - Fail: <number so low we stop>
## Outcome served          ← unchanged link to the epic outcome
## Risk                    ← kill-question answer + any defer-performance debt warnings appended
## NFR constraints         ← 2–4 quantified levels (unit + number + Meter) + checklist prose for
                             the rest; never more (critical-few budget)
## Feature acceptance criteria
                           ← each line: "should" language, observable effect, value-to-whom tag,
                             and its dual-test tag — (risk-mitigating: <which risk>) or
                             (benefit-validating). Ends with the humility note, verbatim: "These
                             confirm the bet is measurable — not that it will pay off. At least half
                             of ideas don't work; that's why the signal has a Fail level."
## Dependencies, risks & deferrals
                           ← Feature Mining lists (Impact / Bigness / Risks / Uncertainties) ·
                             stakeholders who must say yes · the ethical answer · open items routed
                             to team/designer (SME's words, verbatim) · the Real Options ledger:
                             "Decide when <condition> — expires <date/event>"
## Knowledge-state report  ← template below
## Stories                 ← regenerated roll-up + First slice line (see backlog-store.md)
```

## Knowledge-state report — template

Not a certificate. It reports the state of knowledge and hands the conversation to the team.

```markdown
## Knowledge-state report

- **Route:** <full pass | fast lane | hypothesis-only> — <one line on why; fast lane names what it
  deliberately skipped>
- **Agreed:** <the 2–4 load-bearing agreements — hypothesis, signal, first slice>
- **Open questions:** <each with a named owner — feasibility/usability items routed to the team>
- **Deliberately deferred:** <Real Options entries — decide when <condition>, expires <when>>
- **Risks retired:** <what we no longer worry about, on what evidence>
- **Hidden-waste flag** *(fast lane only)*: <the set-glance outcome — e.g. "no story parked this
  session; the team should re-ask 'could we drop any of these?' before committing the set">

Ready enough with known unknowns — this is input to the team's conversation, not a gate. Stories
stay one-line Cards; each gets its own refine-story conversation just-in-time.
```

## Discovery brief — template (discovery-brief exit)

Written **instead of** AC/dependencies/knowledge sections; the feature exits
`status: needs-discovery`, and the store intake re-offers it once the team brings results back.

```markdown
## Discovery brief

The biggest bet in this feature is untested — cheaper to test it than to build it.

| # | Riskiest assumption | Importance | Evidence today |
| --- | --- | --- | --- |
| 1 | <assumption, SME's words> | <bet-sinking / painful> | <assumption / opinion / anecdote> |

For each, the smallest test that could move it:
1. <assumption 1> → <smallest test — e.g. five customer conversations, a landing-page smoke test,
   a concierge run> · **Pre-committed success criterion:** <the line in the sand, decided now —
   e.g. "≥3 of 5 describe the problem unprompted">

Re-entry: bring the results back to refine-feature — evidence upgraded → the triage re-runs and the
feature proceeds; refuted → park or reshape it. Nothing here is a commitment to build.
```

## Story-set write-backs (curation moves)

Per `backlog-store.md` naming/ID rules — files created or edited in the feature's stories folder:

- **ADD** → new file, next free `S##`, `kind: variation` (or `discovery`), `tags: [illustrative]`,
  `order` appended at the set's end unless the SME places it; body = H1 + the one-line Card.
- **SPLIT** → children as new files (fresh `S##`, `kind: variation`); the parent file gets
  `status: superseded` and a body line `Split into S12 · S13 — <date>`.
- **PARK** → `status: parked` + a one-line reason appended to the body. A want proposed and
  declined in the same conversation is minted directly as a parked Card (fresh `S##`, reason
  included — scope conservation applies to proposals too). **Un-park** → `status: skeleton` + a
  one-line reason.
- **REPAIR** → the recombined story is a new Card (fresh `S##`); recombined-away fragments go
  `status: superseded`, pointing at it.
- **First slice** → nominee takes `order: 1` (others shift); the roll-up's `First slice:` line
  names it.

After any move: regenerate the feature's `## Stories` roll-up (rows sorted by `order`; parked and
superseded rows keep their IDs and show their status), and re-render touched Cards on the mirror.

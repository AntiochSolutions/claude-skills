# Output — canonical model, markdown map, and tracker field-mapping

## Overview

One **canonical internal model**, rendered two ways for the team: (1) a structured object you can hand
back or map into whatever tracker they use, and (2) a paste-anywhere markdown **feature map**. Same
content, two renderers. This skill needs **no API and no credentials** — if a Miro board was used
during the interview (see `board-mode.md`), it is a facilitation surface only; the structured model and
the markdown map below are always the artifact of record.

---

## Canonical model (what the interview produces)
```text
{
  epicRef:          { title, benefitHypothesis, businessOutcomes, leadingIndicators }  // restated
  castOfCharacters: [ { role, needs, obstacles } ]
  capabilityCards:  [ { id, text,                    // verbatim SME words
                        evidenceTag,                 // specific-story | general-claim | opinion
                        sourceTag,                   // observed-step | workaround | stated-request
                        disposition } ]              // <featureName> | parked | out-of-scope
  features: [ {
      name,             // short noun phrase; linted against vague verbs ("manage/fast/easy")
      sourceCluster,    // intent-phrase cluster name + absorbed card ids
      hypothesis,       // four-slot feature benefit hypothesis
      successSignal,    // Who-Does-What-By-How-Much line naming the Leading Indicator it moves
      outcomeLink,      // which epic Business Outcome it serves
      type,             // business | enabler(exploration|architecture|infrastructure|compliance) | spike
      evidence,         // validated | some-evidence | assumption | table-stakes
      tags,             // mvp | contingent (+ discover-first)
      nfrConstraints,   // stamped must-levels
      stories: [ { card, kind } ]   // kind: walking-skeleton | variation | discovery | placeholder
  } ]
  constraintBlock,      // cross-cutting NFR must-levels applied to all features
  parked,               // items that failed the gate: { item, reason, evidence }
  writeBacks,           // { outOfScopeAdditions[], openMeasurementsAdditions[] }
  evidenceCheckpoint    // the named persevere decision point
}
```

Scope conservation invariant (Pichler): every capability card lands in exactly one of feature / parked /
out-of-scope — nothing silently dropped.

`parked` vs `out-of-scope`: **parked** items are deferred candidates that failed a gate *this time* (no
outcome link, no defensible hypothesis) and may return at the persevere checkpoint — they stay in this
decomposition's output with their evidence. **Out-of-scope** dispositions are explicit exclusions:
either the card hit the epic's existing Out-of-Scope fence, or the SME ruled it out during the
interview — the latter are written back upstream via `writeBacks.outOfScopeAdditions`.

---

## Markdown map template

The paste-anywhere render — same content as the canonical model, laid out as a map, not a list, in
narrative-flow order:

```markdown
# Feature Map: <Epic Title>

> **Read me first:** these features are bets, not a spec — some are expected to die at the
> evidence checkpoint. Stories are Cards awaiting their Conversation (run a feature-refinement
> pass per feature next). Detail was deliberately deferred: MVP features carry 3–7 starter
> stories; contingent features carry placeholders. Estimates, dates, and rankings are absent on
> purpose — ranking happens later, with the whole team. This is a living draft.

## The bet this map serves
- **Benefit Hypothesis:** <restated from the epic>
- **Business Outcomes (lagging):** <metric: baseline → target>, …
- **Leading Indicators (early):** go: <signal> · kill: <signal>

## Features (narrative-flow order)

### 1. <Feature name>  `MVP` `business` — evidence: assumption
- **Need** (cluster "<intent phrase>"): <the need, in the SME's words>
- **Hypothesis:** We believe **<epic outcome>** will be achieved if **<persona>** attains
  **<benefit>** with **<this feature>**.
- **Success signal:** <who> does <what> by <how much> — moves leading indicator <indicator>.
- **Outcome served:** <Business Outcome>. **NFR constraints:** <stamped must-levels>.

| # | Story (Card) | Kind |
| --- | --- | --- |
| 1 | As a <role>, I can <activity>, so that <benefit> | walking-skeleton |
| 2 | … | variation |
| 3 | … | discovery |

### 2. <Feature name>  `contingent` … (placeholders: 1–2 coarse Cards marked "to be detailed later")

## Portfolio of bets
| Feature | Outcome moved | Biggest risk | Evidence | MVP |
| --- | --- | --- | --- | --- |

## Cross-cutting constraints (apply to every feature)
- <NFR must-level, from the epic's NFRs>

## Evidence checkpoint
After the MVP ships and we observe <leading indicator>, features <X–Z> get re-decided.

## Parked (failed a gate this time — may return at the checkpoint)
- <item> — <why it failed> — <its evidence>

## Write-backs to the epic
- **Out-of-Scope additions:** <explicit exclusions surfaced in this interview>
- **Open Measurements additions:** <baselines to establish, assumptions to test>

---
_Coverage gate: every feature → an outcome, every outcome → a feature, sufficiency confirmed
with the SME._
```

The closing coverage-gate line is a real assertion — include it only once the gate actually passed both
ways in dialog (per `interview-guide.md`): every feature named an outcome and an indicator, every epic
outcome had a feature moving it, and the sufficiency question was answered. If a link is still open, say
so instead.

---

## Tracker field-mapping (optional)

If the team tracks work somewhere, map the canonical properties onto that tool's fields. There's no
universal schema, so use description/body fields where a dedicated one doesn't exist:

| Canonical property | Where it usually goes |
| --- | --- |
| `features[].name` | Feature title (Jira Feature or child Epic, ADO Feature, Linear project, GitHub milestone or epic) |
| `features[].hypothesis` + `successSignal` | Feature description body |
| `features[].outcomeLink` | A "Business Outcome" custom field, or a line in the description body |
| `features[].tags` (mvp / contingent / discover-first) | Labels |
| `features[].type` (enabler sub-type) | Labels (e.g. `enabler:architecture`) |
| `features[].nfrConstraints` | A body section, or linked to the epic's NFR field |
| `stories[].card` | Story / PBI / issue title (`As a <role>, I can <activity>, so that <benefit>`) |
| `stories[].kind` | A label (`walking-skeleton`, `variation`, `discovery`, `placeholder`) |

Tool notes:
- **Jira** — each feature becomes a Feature (or a child Epic, if the project has no Feature level);
  stories become Stories underneath it.
- **Azure DevOps** — each feature becomes a Feature under the epic; stories become PBIs.
- **Linear** — each feature becomes a project or a milestone; stories become issues.
- **GitHub** — each feature becomes a milestone or a tracking-issue epic; stories become issues.

Do **not** set priority, effort, or size fields anywhere — this skill produces no estimates and no
ranking of any kind; that decision is a separate, human-owned step.

---

## Depth disclaimer

Stories at this stage are Cards only, checked against Cohn's **I/N/V** bar — Independent, Negotiable,
Valuable. **E/S/T** — Estimable, Small (verified), Testable — are deliberately deferred to
`refine-feature`'s Conversation-and-Confirmation pass, which is where real acceptance criteria get
written. A skeleton story that isn't yet estimable, or doesn't yet carry Given-When-Then, is not a
defect in this output — it's the format working as designed. Rejecting a skeleton for lacking E/S/T is
a misread of what this skill promises to deliver.

# Design: `refine-feature` and `refine-story` skills (Spec B)

**Date:** 2026-07-07
**Status:** Approved by user (design sections confirmed in brainstorming session)
**Companions:** `2026-07-07-backlog-store-design.md` (Spec A — the store both skills read/write; build
Spec A first); `2026-07-07-refine-feature-story-research-brief.md` (synthesized 11-authority research —
question banks, lint batteries, authority citations; the source for every "(Author)" citation below)

---

## 1. Purpose & seams

The third and fourth skills of the epic-shaping suite. decompose-epic deliberately deferred the
Conversation and Confirmation of every skeleton (Cohn/Jeffries 3Cs); these skills complete them:

- **refine-feature** takes ONE skeleton feature to build-ready — feature deep, story set shallow.
- **refine-story** takes ONE story Card through the full 3Cs to "ready for sprint planning."

Seams: both read/write the backlog store (Spec A) in either medium. refine-feature curates the story
*set* (add / coarse-split / park / repair) but every story stays a one-line Card; refine-story owns
story internals. Neither skill estimates (the delivery team owns sizing) and neither sequences the
backlog (parking and first-slice nomination in refine-feature are the only ordering outputs). Both
end with a **knowledge-state report, never a readiness certificate** — the unanimous anti-stage-gate
warning (Cohn, Matts, Cagan): "ready enough with known unknowns" is a legitimate exit.

Same audience and voice as the rest of the suite: a business SME, deep in their domain, new to agile.
**Exactly ONE question per turn, always.** Jargon translated inline; the Mom Test is the spine
(concrete past fact over speculation). Tracker-agnostic; Miro is one of two store media, never a
requirement.

## 2. Research foundation (slate verdict)

Twelve parallel research passes (11 authorities + gap scan); full brief in the companion file.

- **refine-feature core:** SAFe/Leffingwell (build-ready anatomy, feature-AC dual test), Lawrence &
  Green (Feature Mining, 80/20 parking, split gates), Cagan & Torres (four-risk triage,
  discovery-brief exit, ethical lens), Gilb + ISO 25010 (success-signal ladder, NFR critical-few),
  Pichler (GO/DEEP), Matts (outputs audit, Real Options ledger).
- **refine-story core:** **Wynne/Example Mapping** (the conversation backbone — the decisive gap-scan
  addition), Adzic (key examples, refine-the-specification pass, format routing), North & Matts
  (narrative audit, GWT lints, Break the Model), Jeffries (customer-defined Confirmation,
  Guru-Checks-Output), Wake (INVEST E/S/T engines, trigger words), Keogh (context/outcome questioning,
  complexity calibration), Cohn (the done-question, vital filter).
- **Gap-scan must-adds:** Wynne (Example Mapping), Dinwiddie (missing-amigos hat rotation,
  lingua-franca read-back), Wiegers (mechanical AC lint), the DoR-debate stance (knowledge-state
  report). **Nice:** Cockburn (sea-level lint, extension-condition walk), Gregory & Crispin
  (tester-hat inventory), Gottesdiener & Gorman (7-dimensions sweep), Patton (map-walk).
- Attribution discipline for the skill docs: splitting patterns → Lawrence & Green; SPIDR → Cohn;
  3Cs → Jeffries; INVEST → Wake; "promise for a conversation" → Cockburn/Jeffries lineage.

## 3. Design decisions (user-confirmed)

| Axis | Decision |
| --- | --- |
| Store scope | Shared store for the whole suite; decompose-epic retrofitted (Spec A) |
| refine-feature scope | Feature deep + story set shallow (set curation only; Cards stay one-liners) |
| refine-story scope | Full 3Cs; adaptive Confirmation format |
| AC routing | Checklist default → example table when only values differ → GWT when context/event differs → number+unit+Meter for scalars → sketch pointer for UI |
| Discovery-brief exit | KEPT — major value/viability risk on assumption evidence diverts to a discovery brief (`status: needs-discovery`) |
| Spike exit | DROPPED — the complexity score calibrates depth only; the session always produces a Confirmation; uncertainty lands in the knowledge-state report (with at most a recommendation that the team consider a timeboxed investigation) |
| Estimation | Excluded (suite-wide lock); the capacity-bet question is retained for its elicitation value only |
| Packaging | Two plugins mirroring suite conventions; store reference duplicated per plugin; shared machinery specified once here, rendered into each interview guide |

## 4. Architecture & packaging

```text
plugins/refine-feature/
  .claude-plugin/plugin.json
  skills/refine-feature/
    SKILL.md                        # spine: principles, phase flow, gate, anti-patterns, ending criteria
    references/interview-guide.md   # question banks, repair moves, lint batteries
    references/output-template.md   # store write-back contract + knowledge-state report + discovery brief
    references/backlog-store.md     # verbatim copy of the Spec A convention

plugins/refine-story/               # same layout
```

Plus marketplace.json entries and README rows for both. Both SKILL.md files mirror the suite voice
(refine-epic/decompose-epic): rigorous-but-supportive analyst, ONE-question-per-turn paragraph at
verbatim strength, ~100-char lines, markdownlint-clean.

**Shared machinery** (specified once, rendered identically into both interview guides where
applicable): the vague-word lint battery (§7), the ends/means guard, the Guru-Checks-Output guard,
provenance tagging (measured / SME-estimate / guess-to-verify), the Real Options deferral ledger
("Decide when `<condition>`" + expiry), the split postcondition gate, missing-amigos hat rotation,
and the jargon-translation glossary.

**Session intake (both skills):** locate the backlog per Spec A §5 (directory path, or board URL when
Miro tools are detected — never mentioned when absent); list candidate items by title; the user picks
exactly one. Verify the upstream chain on load (hypothesis slots present, outcome link intact for a
feature; role/activity/benefit slots for a story); a missing chain routes back to the upstream skill
rather than being repaired ad hoc.

## 5. refine-feature — interview design

**Phase 0 — Intake & timing guard.** Load feature + story set + epic. Timing guardrail: if the
feature isn't starting within a sprint or two, warn ("thinking too far ahead" — Cohn) and offer a
shallow hypothesis-only pass.

**Phase 1 — Four-risks triage (the fork).** Value / usability / feasibility / viability, each rated
severity × consequence, seeded by the feature's `evidence` tag; differentiator-vs-commodity sets the
depth budget (Keogh). Three routes:

- **Fast lane** — all risks minor: compressed pass (hypothesis confirm, signal quantification, 1–2
  AC, set glance), minutes not an hour (Cagan: "just add the work to the backlog and move on").
- **Full pass** — phases 2–7.
- **Discovery-brief exit** — a major value/viability risk on assumption-grade evidence: the
  deliverable becomes a **discovery brief** (riskiest assumptions ranked via importance × evidence;
  smallest suggested test each; pre-committed success criteria — Torres) and the feature is written
  back `status: needs-discovery`. Never let a feature exit "refined" with a major untested value
  assumption silently intact (Cagan).

**Phase 2 — Hypothesis sharpening.** Chunk up if solution-shaped ("what will that get you that you
don't already have?" — Keogh); Cagan's four opportunity questions, time-boxed (the problem was
refine-epic's job); force behavior-change form — who will start/stop/do-more/do-faster, by how much
(Adzic); evidence probed with stakes questions ("what have customers already paid / spent time on /
asked for in writing?"), provenance tagged.

**Phase 3 — Success signal (Planguage ladder, applied lightly).** Scale (unit + who/task/conditions
qualifiers) → Meter (who measures, how) → Baseline (provenance-tagged; a flagged guess is allowed) →
Target → one Fail level ("a number so low we'd call it failure"). Hard rule: bare direction words
("improve", "increase") never survive — two numeric points on a named scale or it isn't a signal
(Gilb). Offer a small scale library (task time, error rate per N, % succeeding unaided in T, support
contacts/week, latency percentile) so the SME picks rather than invents. Impact-lite check: roughly
what share of the epic outcome gap does this feature close?

**Phase 4 — Feature acceptance criteria (benefit checks).** Open with "how will you confirm the bet
paid off?" Every feature AC must pass the **dual test**: it mitigates an implementation risk OR
enables early validation of the benefit hypothesis (SAFe); AC that restate scope are rejected. Written
outside-in in "should" language as observable real-world effects, tagged value-to-whom. Appended
humility note: AC confirm the bet is measurable, not that it will pay off (Cagan's "at least half of
ideas don't work").

**Phase 5 — NFR binding.** ISO 25010 as an internal prompt taxonomy only — selective plain-language
questions, never a nine-item survey. For each binding quality: decompose the vague word into the 1–2
elementary facets this feature moves (Gilb), elicit usable / differentiating / overkill breakpoints
(QUPER via Adzic), quantify with unit + number + Meter. **Critical-few budget: one quantified success
signal + 2–4 quantified NFR levels per feature; everything else stays checklist prose.** Quantified
NFRs may spawn a defer-performance story pair with the debt warning appended to the risk line
(Lawrence & Green).

**Phase 6 — Story-set curation (shallow, four moves).** State the rationale for shallowness up front
and decline SME attempts to deepen Cards (detail becomes one-line notes for refine-story):

- **ADD:** journey map-walk ("first they…, then they… — have I missed a step?" — Patton); outputs
  audit — enumerate the outputs the success signal depends on, verify each has a producing story
  (Matts); "what's the next most important thing this still wouldn't do?" until answers fall out of
  scope (North); lifecycle and non-obvious-role sweep (Wake). Added stories are labeled illustrative.
- **SPLIT (coarse):** triggers — "manage/control" verbs, variation-hiding terms, whole narrated
  workflows, kite-level scope (Cockburn sea-level lint). Lawrence & Green patterns; outputs stay
  one-line Cards; no AC, no sizing.
- **PARK:** spine question — "are there stories here we could deprioritize or delete?" (Lawrence &
  Green 80/20); objective trigger — a story contributing ~zero to the success signal (Gilb). Parking
  is celebrated ("not now", not "no"); before parking on weak enthusiasm ask whether it's no demand or
  a bad solution shape (Cagan). Parked stories get `status: parked` + reason.
- **REPAIR:** pseudo-stories (tasks/components in story syntax) are recombined into one good large
  story before any split (Lawrence & Green); fish-level fragments merge into their sea-level parent.

First-slice nomination: the triple test — not too big, not too obvious (touches the scariest
risk/core complexity), not too fuzzy — "simplest survivable slice," softening walking-skeleton-first
(Adzic; Lawrence & Green).

**Phase 7 — Dependencies, risks & deferrals.** Feature Mining four lists (Impact / Bigness / Risks /
Uncertainties) with the "what if we just…?" stems (Lawrence & Green); viability stakeholder sweep +
the ethical question ("any potential harm?" — Torres); feasibility/usability unknowns captured
verbatim and routed to the team, never answered by the SME (Cagan); Real Options ledger entries for
unanswerable decisions; slow-research questions raised now so answers cook before refine-story needs
them (Cockburn look-ahead).

**GATE — Benefit-Trace Gate** (the chain-validation analog, two-way): (a) every surviving story
traces to an output the success signal needs, and every needed output has a story; (b) every feature
AC passes the dual test; (c) the signal has Baseline + Target on a named Scale plus a Meter; (d)
Clear/Feasible/Testable asked as plain SME questions (Pichler); (e) at least one story was parked, or
the skill flags possible hidden waste. Repair breaks in dialog before writing back.

**Store write-back:** feature.md/Card updated in place — `status: refined` (or `needs-discovery`),
sharpened Hypothesis / Success signal / Risk / NFR sections, new sections `Feature acceptance
criteria`, `Dependencies, risks & deferrals`, `Knowledge-state report` (or `Discovery brief`); story
set changes (new skeleton files/Cards, `parked` statuses, `order` updates, first-slice note).

## 6. refine-story — interview design

**Phase 0 — Entry checks.** Narrative-slot audit: title names an activity with a knowable end state
(reject "Account management"), role is a real person you could call, benefit stated — repaired
conversationally (North). Pseudo-stories bounce to feature level. Two calibrations:

- **Complexity score (Keogh), asked plainly** ("has anyone on your team / in your company / anywhere
  done this before?"). **Calibrator only — there is no spike exit** (user decision): 1–2 → fast pass;
  3 → full conversation; 4–5 → the Confirmation scopes to what IS known (clear hypothesis +
  first-probe AC) and the blocking questions land verbatim in the Known-Unknowns block, with at most
  a recommendation that the team consider a timeboxed investigation.
- **Complicated vs complex** sets Confirmation depth (complex → never padded into speculative AC).

**Phase 1 — Value anchor** (Feature Injection order — Matts). Confirm the so-that and the concrete
output ("forget the screens — what has to come OUT of this?"); probe the so-that once; a valueless
Card parks back to refine-feature, not decorated. Re-anchor to feature/outcome context (Patton).

**Phase 2 — Context & happy path.** SME narrates a real, recent usage story (Mom Test / Jeffries
story-first); understanding questions only; happy path captured as steps; scope fence accumulates —
rejected proposals become the scope-out list for free.

**Phase 3 — Rule & example mining (the core loop = Example Mapping in dialog — Wynne).** Every SME
answer is classified as a **rule**, an **example**, or a **question**; classification picks the next
move by priority:

1. Unillustrated rule → "give me an example — a real one, from last month, with the actual numbers"
   (Keogh/Adzic).
2. Unexplained example → state the implied rule back and hunt refutation — **Break the Model**: "can
   you think of a time that wouldn't hold?" including negate-a-Given; stop after two consecutive
   failed breaks per rule (Matts).
3. Number/date/limit mentioned → boundary probe: at / just below / just above (Adzic).
4. Hedge or "it depends" → "give me an example that shows the uncertainty" (Adzic).
5. Question nobody can answer → red card with a named owner; never debated (Wynne).
6. Vague-word trigger fired → the word becomes the next question (Wake).
7. Rule pile stable → invented-tricky-case alignment probe: "what happens next?" (Adzic).

Labeled hat-rotation turns compensate for the missing amigos (Dinwiddie): tester hat — "what's the
worst thing that could happen here? is there more?" (Gregory & Crispin); developer hat — "what should
the system do in this exact case?" (Cockburn — "I've never thought about that" is a red card, not a
defect). Perspectives the skill cannot simulate (feasibility, UX, data, security) are flagged as open
items, never invented.

**Phase 4 — Sweeps.** Extension-condition walk over the happy path (per step: "what could go
differently here?"); 0/1/many/duplicates on anything plural (Wake); 7-dimensions closing sweep with
Control and Quality Attribute deliberately probed (Gottesdiener & Gorman); exploration health check —
at least one out-of-scope decision exists or run one more divergence pass (Keogh).

**Phase 5 — Confirmation drafting.** Explicit **refine-the-specification pass** between mining and
writing (Adzic): strip incidental values, name hidden domain concepts, keep only differences that
matter; never draft Gherkin live during conversation (Wynne, Keogh). Adaptive routing, in decision
order:

1. **Checklist (default)** — a rule stated as one clear line is a first-class Confirmation (Keogh,
   Cohn, SAFe's own flagship example).
2. **Example table** — when cases share structure and differ only in values (calculations, rates,
   categorization). Harvest the SME's existing spreadsheet before inventing rows (Jeffries); 3–7 rows
   per rule including ≥1 boundary and ≥1 counter-example; every row has input AND expected result;
   bulk just-in-case data is banished (Adzic, Wake).
3. **Given-When-Then** — when the context or event itself differs (distinct behaviors/state changes).
   Lints: exactly one When; Givens are all of and no more than the required context; every Then a
   "should" statement challenged once; one business rule per scenario; titles state only how scenarios
   differ; business language only, zero UI mechanics (North).
4. **Scalar qualities** never hide as adjectives — unit + number + Meter, hosted in the checklist
   (Gilb).
5. **UI/interaction detail** — pointer to a sketch/mockup, not prose (Pichler, Cagan).

Every Confirmation gets a `Not in this story:` line (SAFe scope-out) and every line traces to an SME
statement or SME-confirmed proposal — the skill proposes, nothing enters unconfirmed (North, Keogh).
The full AC lint battery (§7) runs over every draft.

**Phase 6 — INVEST & split.** Asymmetric: I/N/V (upstream-guaranteed) get one light probe each
(overlap / not-a-contract / value-to-whom). E/S/T get full engines (Wake):

- **E = understanding, never a number.** Failure routes three ways: unclear business rules → keep
  conversing; unknown technology → flag for the team; sheer size → S path.
- **S:** intensity dial first (same headline, defer elaborate bullets); size probes without estimates
  — the capacity-bet question ("could the team fit 6–10 like this in a sprint?") and the
  scenario-count tripwire (~5–6 scenarios → propose a split, never more scenarios) (Lawrence & Green,
  North).
- **T:** the any-input/agreed-output drill; on failure classify into Wake's six troubles (Magic /
  Intentional Fuzziness / Computational Infeasibility / Non-Determinism / Subjectivity / Research
  Project) — each with a distinct next move; Testable also means has a Meter for anything scalar.

Split protocol: compound-vs-complex first (multiple goals → one-goal-per-story — Pichler); preferred
seam — peel coherent rule/scenario groups discovered in conversation into new one-line Cards (Wynne);
fallback — Lawrence & Green patterns / Adzic's value-first menu. **Postcondition gate on every
split:** each child is a vertical slice passing full INVEST (user action AND system response), at
least one child is deprioritizable, there's an obvious first story; layer/phase/discipline splits are
hard-blocked. Peeled Cards inherit the parent's benefit clause and route back to the feature's story
set.

**GATE — Demo-and-Read-Back Gate** (the load-bearing validation analog): (a) **demo narration** — the
SME narrates the demo; every narrated moment maps to a Confirmation item and vice versa (Adzic); (b)
**title side-by-side test** — indistinguishable titles merge; an SME "what about…" with no matching
title spawns one (North); (c) **lingua-franca read-back** — "can you say: yes, that's exactly what I
mean?" — hesitation is a defect in the artifact, not the SME (Dinwiddie); (d) **vital filter** — 3–5
criteria, each reject-worthy (Cohn/Pichler); (e) **ignorance question** — "what are we most likely to
be wrong about?" → Known-Unknowns block with owners (North).

**Store write-back:** story file/Card updated in place — `status: ready`, the Card line unchanged,
new sections `Conversation notes` (brief), `Acceptance criteria`, `Not in this story`, `Open
questions` (red-card ledger with owners), `Knowledge-state report` (closing lines: sizing left to the
team; the conversation continues in the sprint). Peeled/new Cards written into the feature's story
set.

## 7. Shared quality machinery

**Vague-word lint battery** (Wake + Wiegers + SAFe + Gilb; run over every drafted criterion in any
format): *just, appropriate, right, best, most, least, any, don't-care, fun, easy, user-friendly,
simple, fast, quickly, efficient, several, improved, better, minimize, maximize, seamless, intuitive,
robust, flexible, secure, scalable, reliable, accurate, clean, support, and/or, etc.* Each hit
auto-generates the next SME question (convert to a number, an example, or an explicit decision).
Guards: **Guru-Checks-Output** (reject "correctly / appropriately / gracefully / as expected" —
expected answers stated up front, Jeffries); **customer-visible only** (no widgets/endpoints/table
names — North's two-domains rule; named roles, never "the User"); **ends/means** (a solution stated
as an AC gets "if it worked perfectly, what would be different, by how much?" — the result becomes
the AC, the solution a design note or labeled constraint — Gilb); **criteria checks** (reject AC that
restate the card, embed whole workflows, or smuggle new requirements — smuggled requirements become
new one-line Cards routed to the feature — Pichler); **fused-AC detection** (conjunctions signal
lumped requirements — Wiegers); the **"call me when you're done" test** (Wiegers).

**Scenario-explosion guards:** 3–7 key examples per rule with mandatory boundary + counter-example
(Adzic); delete boring scenarios (Keogh); decline combinatorial enumeration on principle (Wake);
closing self-restraint check — "more Confirmation than needed to clarify the confusing or
controversial? cut" (Wake).

**Over-specification guards:** refine one item just-in-time, resist batch refinement (Jeffries, Wake,
Pichler DEEP); the Card never fattens — growth pressure IS the split signal (Jeffries); no fixed
documentation template — ask what the builders need for THIS case (Cagan).

**SME phrasing rules:** never say "acceptance criteria" cold — open with "what needs to be true for
you to consider this done?" (Cohn) and "how will you confirm we've done what you need — what will you
look at, and what exactly should it show?" (Jeffries); translate every agile term inline (vertical
slice → "a thin but complete version someone could actually use"); Mom-Test compliance for numbers
(every baseline gets "where did that number come from? how could we verify it?" — Gilb); the glaze
test on read-back — the SME's nouns and verbs go verbatim into the artifact (North, Dinwiddie).

## 8. Anti-patterns (the do-NOTs)

Ask more than one question per turn · say "acceptance criteria" / "INVEST" / "spike" untranslated ·
draft Gherkin live during the conversation · let any vague-word hit survive unconverted · write an AC
the SME didn't originate or confirm · exceed 3–7 examples per rule or enumerate combinations · fatten
a story Card (detail attaches, never inlines) · deepen stories during refine-feature (decline and
note) · answer feasibility/usability questions on the SME's behalf · emit an estimate, points, or
date · sequence the backlog (park + first-slice nomination only) · let a feature exit refined with a
major untested value assumption (divert to discovery brief) · pad complex/unknown work into
speculative AC (scope the Confirmation to what is known; log the rest) · treat the knowledge-state
report as a completeness gate · split into layers/phases/disciplines · leave a split without the
postcondition gate · park or delete anything silently (status + reason, always) · proceed when the
upstream chain is missing (route back to the upstream skill).

## 9. Ending criteria

**refine-feature:** triage route chosen and named · hypothesis in behavior-change form with evidence
provenance · success signal with Scale, Meter, Baseline, Target, Fail level (no bare direction words)
· every feature AC passing the dual test · NFRs bound within the critical-few budget · story set
curated (ADD/SPLIT/PARK/REPAIR each considered; all Cards one-line; first slice nominated by the
triple test) · dependencies/risks/deferrals captured with the Real Options ledger · Benefit-Trace
Gate passed both ways · store write-back complete (`refined` or `needs-discovery` + discovery brief)
· knowledge-state report delivered and SME-confirmed.

**refine-story:** entry checks passed (narrative slots, complexity calibration) · value anchor
confirmed (so-that + concrete output) · happy path narrated from a real instance · rule/example map
stable (Break-the-Model exhausted, sweeps run, ≥1 out-of-scope decision) · Confirmation drafted via
the routing rules, fully linted, every line SME-traced, scope-out line present · INVEST checked
(E/S/T engines run; any split passed the postcondition gate) · Demo-and-Read-Back Gate passed (all
five checks) · store write-back complete (`status: ready`, Card unchanged) · knowledge-state report
delivered with Known-Unknowns owners, closing "sizing left to the team; the conversation continues in
the sprint."

## 10. Out of scope

Estimation of any kind · backlog prioritization/sequencing · test automation or exporting AC to test
frameworks (the Confirmation must merely be *automatable without rewriting* — Adzic) · running
discovery itself (the discovery brief hands off to humans) · multi-user/three-amigos facilitation
(the skill compensates via hat rotation, it does not host a workshop) · cross-medium store sync
(Spec A) · refine-epic changes.

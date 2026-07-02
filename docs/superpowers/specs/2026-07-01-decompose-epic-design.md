# Design: `decompose-epic` skill

**Date:** 2026-07-01
**Status:** Approved by user (all three design sections confirmed in brainstorming session)
**Companion:** `2026-07-01-decompose-epic-research-brief.md` (synthesized thought-leader research — question banks, authority citations, tension analysis; the source for every "(Author)" citation below)

---

## 1. Purpose & seams

`decompose-epic` is the second skill in the epic-shaping suite. It takes the refined epic produced by
`refine-epic` and decomposes it — through a conversational SME interview — into **skeleton features**
(affinity groups of capability promoted through a quality gate) and **skeleton stories** under each
feature. A future `refine-feature` skill owns fleshing each feature out.

The seams are exact:

- **Upstream:** `refine-epic` ends at "no decomposition into features/stories." `decompose-epic` starts
  there, consuming its canonical model (Title, Description, Benefit Hypothesis, Business Outcomes,
  Leading Indicators, NFRs, Out-of-Scope, Open Measurements).
- **Downstream:** `decompose-epic` ends at skeletons. Stories are Cards only — the Conversation and
  Confirmation (Cohn's 3Cs) are `refine-feature`'s job, as is feature-level quantification and real
  acceptance criteria.
- **Write-backs:** anything learned here that belongs upstream (new Out-of-Scope entries, new Open
  Measurements) is written back into the epic's structure, never dropped.

Same audience and voice as `refine-epic`: a business SME, deep in their domain, new to agile. The agent
is a rigorous-but-supportive analyst. **Exactly one question per turn, always.** Jargon translated
inline. Tracker-agnostic — no API, no credentials; output is a structured model plus paste-anywhere
markdown.

## 2. Research foundation (slate verdict)

Ten parallel research passes over the proposed authority slate plus a gap scan. Verdict:

- **Core (own whole phases):** Cohn/Pichler (skeleton doctrine: Card-only stories, I/N/V bar, SPIDR,
  DEEP depth gradient), Leffingwell/SAFe (feature anatomy, level tests, splitting patterns, enabler
  typing, MVP partition), Torres (clustering algorithm, evidence discipline, solutions-in-disguise
  test), Fitzpatrick (interview epistemics — continuity with refine-epic's spine), Seiden/Gothelf
  (feature-level value statements: four-slot hypothesis, Who-Does-What-By-How-Much).
- **Moderate (specific moves):** Cagan (bets framing, go/no-go, evidence labels, PayPal question),
  Ries (MVP-as-hypothesis-test, riskiest-assumption-first, concierge/smoke-test stories).
- **Marginal (2–3 rules each):** Hubbard (never ordinal scores; wide ranges only when decision-relevant;
  adoption + kill questions), Gilb (coverage-gate concept; NFR routing rule — uniquely his).
- **Must-adds from the gap scan:** **Jeff Patton** (narrative backbone, walking skeleton,
  mile-wide-inch-deep, map-not-list output), **KJ method / Kawakita** (cluster-then-name — the only
  actual clustering technique on any slate), **Gojko Adzic** (actor/behavior-change outcome
  traceability). Nice-to-have: Lawrence/Green split-quality criteria, Cockburn's sea-level test,
  Osborn/IDEO phase-gating. Skipped: Wake's twenty splits, full EventStorming (keep only the
  past-tense timeline probe as an optional lens).

## 3. Design decisions (user-confirmed)

| Axis | Decision | Rationale |
| --- | --- | --- |
| Scope | **Full recommended shape**: core pipeline + two-way coverage gate + MVP partition + evidence tags | Output becomes an evidence plan, not a wish list; coverage gate is the chain-validation analog |
| Elicitation | **Behavior mining first**: cast-of-characters → last-time walkthroughs; direct asks only as late fan-out probes | Mom-Test-honest; identical interviewing DNA to refine-epic; capability cards carry evidence tags from birth |
| Clustering lens | **Journey moments default** (Patton backbone / Torres experience map), role-served and outcome-advanced as fallback lenses | Features read as story-map columns in narrative order; fallbacks cover back-office/technical epics |
| Story depth | **Depth gradient**: MVP features get 3–7 Cards; contingent features get 1–2 placeholders | DEEP doctrine (Cohn/Pichler); uniform depth is over-breaking rocks early |
| Canvas | **Optional Miro card-wall mode**: text-only numbered-wall protocol is the universal baseline; if Miro MCP tools are connected, offer board mode (see §6a) | KJ's native medium restored when available (SME drags real cards); the suite's no-API/no-credentials promise preserved for everyone else; one skill, two media — interview logic identical |

## 4. Architecture & packaging

New plugin mirroring `refine-epic` exactly:

```text
plugins/decompose-epic/
  .claude-plugin/plugin.json
  skills/decompose-epic/
    SKILL.md                        # principles, phase flow, anti-patterns, ending criteria
    references/interview-guide.md   # question bank, repair moves, linters, jargon translations
    references/output-template.md   # canonical model, markdown map, tracker field-mapping
    references/board-mode.md        # optional Miro card-wall protocol (§6a); interview-guide stays medium-neutral
```

Plus a `marketplace.json` entry (keywords: decompose, features, stories, story-mapping, affinity,
user-story-mapping, impact-mapping, product-management, agile).

## 5. Input contract — three intake branches

1. **Refined epic supplied** (refine-epic markdown brief or structured model) → parse; run the full
   flow. Out-of-Scope becomes the divergence fence; Leading Indicators become the candidate pool for
   feature success signals.
2. **Raw/unrefined epic supplied** → the coverage gate cannot run without outcomes. Offer to run
   `refine-epic` first, or capture a minimum chain inline (falsifiable benefit hypothesis + ≥1
   measurable outcome + ≥1 leading indicator) before decomposing.
3. **Existing decomposition supplied** (revisit) → mirror refine-epic's refinement branch: open with
   "what do you want to change, and why?", work only that thread, re-run the coverage gate on whatever
   the change touches, leave the rest untouched, restate only what changed.

## 6. Interview phase flow

Diverge/converge structure is announced explicitly to the SME (premature convergence is the default
failure mode of an LLM interviewer — Osborn/IDEO phase-gating).

1. **Ingest & prep** (silent). Parse the epic; derive session target questions from its shakiest
   assumptions; set the Out-of-Scope fence.
2. **Set expectations** — one line: "We'll get everything out on the table first, then sort it into
   groups, then turn the groups into features with starter stories — and what we produce is a set of
   bets, not a spec." (Cagan's bets framing.)
3. **Cast of characters** — role brainstorm, one role per turn. "The user" is banned as a role name;
   push for specific roles and other *systems* (Cohn). Needs/obstacles per key role (Gothelf). Pre-fills
   every story's `As a <role>` and structurally widens coverage.
4. **Divergent behavior mining** — the longest phase. Per key role: last-time walkthrough
   ("walk me through the last time [role] did this, start to finish — don't skip the boring parts" —
   Fitzpatrick/Torres), harvesting each step, wait, handoff, workaround, and complaint as a
   **capability card**: verbatim SME wording + evidence tag (specific-story / general-claim / opinion —
   Torres's Ladder of Evidence) + source tag (observed-step / workaround / stated-request).
   Workarounds are gold — a workaround the SME already pays for is the strongest evidence a capability
   matters. Stated requests get the dig protocol ("Why? What would it let you do? How are you coping
   without it?") — the *motivation* becomes the card, the SME's phrasing a candidate solution.
   Fan-out probes so coverage isn't free-association: CRUD expansion of "manage" verbs, data/rule/
   persona variations, "simplest version that could possibly work" (Leffingwell); behavior-change per
   actor — "what must [role] start/stop/do differently for the outcome to happen?" (Adzic); "how do we
   get people to do more of that?" (Seiden). Optional past-tense event-timeline lens for back-office
   epics (Brandolini). Divergence closers: pre-mortem ("six months after launch this failed — what went
   wrong?" — Torres) and shadow-belief ("we built everything on time and the numbers didn't move — what
   were we wrong about?" — Ries).
   **Hard rules:** no evaluating, sizing, clustering, or naming during this phase; quantity nudge
   ("let's get past ~20 cards before we organize"); depth-bait parked visibly ("noted — we'll come back
   to that" — Patton's mile-wide-inch-deep).
5. **Affinity clustering** — adapted KJ in dialog: play back all cards as a **numbered list** (the
   shared wall) → propose **unlabeled** provisional groups seamed by journey moment ("Group A: items
   2, 5, 9…") → SME rearranges, one correction per turn ("which item feels like it's in the wrong
   pile?") → **name last**, as intent phrases from the customer's POV ("help [who] [get outcome] during
   [moment]"), never solution nouns. Hygiene as questions: item wanted in two groups → "same need in
   both contexts, or two different needs?" (duplicate it — Torres's single-parent rule); 8+ item group →
   "is there a seam in here?"; singletons kept and flagged, never force-merged. Framed as reversible:
   "grouping is a two-way door." Fallback lenses (role-served, outcome-advanced) offered only if the
   journey sort feels wrong.
6. **Feature formation** — per cluster, one thread at a time:
   - Four-slot hypothesis: "We believe [epic outcome] will be achieved if [persona] attains [benefit]
     with [this]" (Gothelf/Seiden; adopted by SAFe).
   - Success signal: a Who-Does-What-By-How-Much line, drawing candidates from the epic's Leading
     Indicators (Seiden).
   - **Feature linter** (all five must pass): noticeable (users would recognize it as a thing they got —
     Cohn) · vertical slice (never a layer/component/org mirror) · standalone releasable (the zoom-in
     test: "if users loved only this, could we ship it alone and call it a win?" — Ries) · one need,
     one hypothesis (an "and" across personas/benefits/outcomes = two features; identical hypotheses =
     one) · instinct-sized in weeks (days = story, months = split further — Cohn; GWT-shaped acceptance
     criteria = a story, demote it — SAFe/ISPI).
   - Naming: once the hypothesis and linter agree the pile is a real feature, distill its intent
     phrase into a linted short noun phrase (`features[].name`); propose 2–3 candidates and let the
     SME pick.
   - Hubbard's two questions before any size talk: adoption ("who actually uses it, how many, how
     soon?") and kill ("what makes this built-but-unused?").
   - NFR routing (Gilb): each epic NFR's must-level stamps onto every feature as a constraint; an NFR
     with a large baseline→goal gap becomes its own candidate feature entering the coverage gate.
   - Enabler/spike typing (SAFe's four enabler types) where honest — never fake user voice; spikes
     rate-limited; each enabler tied to a named value feature it enables.
   - Go/no-go (Cagan): clusters with no defensible hypothesis get merged, re-cut, or **parked with
     their evidence**.
7. **Coverage gate** — the chain-validation analog, both directions:
   - Every feature names the Business Outcome it serves and the Leading Indicator it should move.
     Orphans challenged → parked with SME consent ("a deliverable supporting no impact is a failure
     even if it works perfectly" — Adzic).
   - Every epic outcome has ≥1 feature moving it. Gaps trigger a targeted divergent loop ("what could
     move this measure?" — Gilb).
   - Sufficiency close: "If every one of these landed, would the epic's benefit hypothesis be proven?
     What's missing?" (Gothelf).
   - A decomposition where everything survives is flagged as suspicious (Cagan). Repair breaks in
     dialog before proceeding — a box-filled tree with a broken outcome thread is a failure, not a pass.
8. **MVP partition** — "which smallest set of features would prove or disprove the epic's bet?" → tag
   **MVP** vs **contingent on persevere**, with a named evidence checkpoint ("after MVP ships and we
   see [leading indicator], features X–Z get re-decided") (SAFe/Ries). Discover-first flags on the 1–3
   features whose value uncertainty most swings decisions (Hubbard's value-of-information triage,
   asked as plain questions). **No dates, no estimates, no ordinal/weighted scores of any kind** —
   one-line rationale in the output ("ranking happens later, with the whole team").
9. **Story skeletons** — depth gradient:
   - MVP features: 3–7 Cards — walking-skeleton path as story #1 (Patton/Cockburn), variations via
     SPIDR (Lawrence/Cohn), one riskiest-assumption/discovery story (may be concierge/Wizard-of-Oz/
     smoke-test-shaped, translated inline — Ries).
   - Contingent features: 1–2 coarse placeholders marked "to be detailed later."
   - Card form: `As a <specific role>, I can <activity>, so that <benefit>` — one goal per card,
     solution-free. Quality bar **I/N/V only**; E/S/T deliberately deferred and the output says so.
   - Sea-level QA: "could one person finish this in one sitting and go away happy?" (Cockburn) —
     smaller is a detail, bigger is a feature.
   - Every split ratified by the SME, one decision per turn — the agent never decomposes alone (Cohn).
10. **Synthesis & validation** — play back the whole map in plain language; SME corrects. Sweep new
    open measurements (baselines to establish via Rule-of-Five, assumptions to test) into the epic's
    Open Measurements. Commitment close (Fitzpatrick, internal-SME currency): "if only one feature
    could ship in month one, which part of your week should disappear first?" / "who else touches
    this — should I talk to them?" / "anything I should have asked?"
11. **Output** — emit the canonical model + markdown map per §7. In board mode, additionally render
    the final story map on the board (§6a).

## 6a. Optional card-wall mode (Miro)

The KJ method's native medium is a wall of physical cards; the numbered-list protocol in phases 4–5 is
the text-medium adaptation. When a Miro connection is available, the skill offers to run the wall on a
real board instead. **One skill, two media: the interview logic — phases, question bank, linters,
gates — is identical in both modes; only the wall medium changes.** All board mechanics live in
`references/board-mode.md` so `interview-guide.md` stays medium-neutral.

- **Detection & offer.** During setup (phase 2), detect whether Miro MCP tools are connected (via
  ToolSearch — verified available: `layout_create` creates sticky notes and frames from a DSL;
  `layout_read` reads back frame membership after the user rearranges). If present, offer board mode
  as the phase-2 expectations turn; the user may also supply an existing board URL. If absent or
  declined, run the text protocol — never mention Miro again.
- **Source of truth.** The conversation's capability-card state is canonical; the board is a mirror.
  Before acting on any arrangement, re-read the board (`layout_read`) — never assume it still matches.
  If Miro calls fail mid-session, say so and continue in text mode with no loss of state.
- **Divergence (phase 4).** Each capability card is dropped onto the board as a sticky note the moment
  it's captured — verbatim SME wording, color-coded by source tag (observed-step / workaround /
  stated-request). The filling wall makes divergence momentum visible ("let's get past ~20 cards"
  becomes literal). No grouping, no frames yet.
- **Clustering (phase 5).** Agent creates **unlabeled** frames (Group A, B, C… — KJ's name-last rule
  holds on the board too) and provisionally sorts stickies into them. Then the drag handoff: *"Drag
  cards to wherever they belong — make new piles, park misfits between piles — and tell me when
  you're done."* Agent re-reads the board, diffs frame membership against its last known state, and
  **reflects every move back in words** ("you moved 'chase missing signatures' into the pile with the
  dispute items — tell me about that"), which forces the verbal articulation KJ wants. Cards parked
  between frames are treated as explicit ambiguity signals to resolve in dialog. Naming happens last,
  by retitling each frame with the SME's intent phrase.
- **Output (phase 11).** Optionally render the finished story map on the board: feature frames as
  columns in narrative-flow order, hypothesis + tags in each frame's header area, story stickies
  beneath (walking-skeleton first), constraint block and parked lot as side frames. The markdown map +
  structured model are still produced regardless — **the board is a working surface and a visual
  deliverable, never the artifact of record.**

## 7. Output

### Canonical model

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
      risk,             // the biggest built-but-unused risk, in the SME's words (from the kill question)
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

Scope conservation invariant (Pichler): every capability card lands in exactly one of
feature / parked / out-of-scope — nothing silently dropped.

`parked` vs `out-of-scope`: **parked** items are deferred candidates that failed a gate *this time*
(no outcome link, no defensible hypothesis) and may return at the persevere checkpoint — they stay in
this decomposition's output with their evidence. **Out-of-scope** dispositions are explicit exclusions:
either the card hit the epic's existing Out-of-Scope fence, or the SME ruled it out during the
interview — the latter are written back upstream via `writeBacks.outOfScopeAdditions`.

### Markdown map

- Preamble: features are bets with declining confidence, some are expected to die; stories are Cards
  awaiting their Conversation (`refine-feature`); detail was deliberately deferred; this is a living
  draft.
- Epic's Benefit Hypothesis + Business Outcomes restated at top (the root of the tree).
- Features **in narrative-flow order** (map, not list — Patton), each showing its need and outcome
  *above* its story list (context before content — Cagan).
- **Portfolio-of-bets table**: feature × outcome moved × biggest risk × evidence status × MVP flag.
- Constraint block, parked items with evidence, Out-of-Scope and Open-Measurement write-backs.
- Tracker field-mapping guidance (features → Jira Epics-or-Features / ADO Features / Linear projects;
  stories → issues; tags → labels), mirroring refine-epic's approach.

## 8. Anti-patterns (the do-NOTs)

Open with "what features do you want?" · transcribe requests without digging · evaluate/cluster/size
during divergence · name clusters before they settle · accept layer/component/org-chart clusters ·
emit a feature with no outcome link or an outcome with no feature · write estimates, dates, or any
ordinal/weighted score (no WSJF, no H/M/L — Hubbard: ordinal scoring is worse than useless) · write
real acceptance criteria or Given-When-Then (refine-feature's job) · uniform exhaustive story depth ·
add a Capability tier (SAFe Essential rule: too-big clusters split into more features, never a new
layer) · let every unknown become a spike · decompose alone — every split is ratified by the SME ·
ask more than one question per turn · finish without the coverage gate, the MVP partition, and the
SME-confirmed map · require Miro or degrade the interview when it's absent · name board frames before
piles settle · act on a board arrangement without re-reading it first · treat the board as the
artifact of record (the markdown map + model are always produced).

## 9. Ending criteria

Cast of characters named · divergence confirmed exhausted (pre-mortem + shadow-belief asked) · every
capability card landed in exactly one of feature / parked / out-of-scope · every feature passes the
five-part linter and carries hypothesis + outcome link + success signal · coverage gate passed both
ways + sufficiency question answered · MVP subset tagged with its named evidence checkpoint · MVP
features carry 3–7 Cards (walking-skeleton first, one discovery story), contingent features carry 1–2
placeholders · NFR constraint block emitted · write-backs recorded · SME confirmed the played-back map
and answered the commitment close.

## 10. Out of scope for this skill

Prioritization/sequencing beyond the MVP partition (no WSJF, no ranking) · estimation of any kind ·
real acceptance criteria and story Conversation/Confirmation (`refine-feature`) · feature-level
quantification beyond the success-signal line · writing to any backlog-tracker API (the optional Miro
card wall in §6a is a facilitation surface, not a tracker write-back) · sprint/PI planning.

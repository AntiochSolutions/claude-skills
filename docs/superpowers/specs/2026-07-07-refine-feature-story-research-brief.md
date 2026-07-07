# Design Brief: refine-feature & refine-story

Synthesis of 11 research streams (Adzic; North & Matts; Jeffries; Wake; Keogh; Lawrence & Green; Cohn & Pichler; SAFe/Leffingwell; Cagan & Torres; Gilb/ISO 25010; gap scan). Recommendations are opinionated; attribution inline.

---

## 1. The feature-refinement model

### What "build-ready" means for a feature

The cross-authority consensus is remarkably tight: build-ready = **three sharpened slots plus a risk posture**, not a filled template.

**Slot 1 — Sharpened benefit hypothesis.** The four-slot hypothesis inherited from decompose-epic is the right container (SAFe's minimum feature definition is name + benefit hypothesis + AC; Richards' canvas extends it). Sharpening means three moves:
- **Chunk up before quantifying** — if the feature arrived solution-shaped, recover the capability behind it: "Why? What will that get you that you don't already have?" plus the pixies test (Keogh). Never accept "a solution to an unknown problem" (Adzic).
- **Force the behavior-change form** — the hypothesis must state who will *start/stop/do-more/do-faster*, which is Adzic's falsifiability test and maps 1:1 onto the existing Who-Does-What-By-How-Much slot. Pair it with the enabling system change (Adzic).
- **Re-derive Cagan's four opportunity questions** (business objective, key results, one-crisp-sentence problem, customer type) — if the SME cannot state the problem without "a rambling list of features," pause and re-anchor, but time-box it: the problem was refine-epic's job; most turns belong on the solution (Cagan, *Problem vs. Solution*).

**Slot 2 — Quantified success signal (baseline→target).** This is a lightweight Gilb Planguage ladder, and it should be explicit named fields on the feature artifact: **Scale** (unit + [who/task/conditions/period] qualifiers), **Meter** (who measures, how, over what sample), **Baseline** (Gilb's Past, with a provenance tag: measured / SME-estimate / guess-to-verify), **Target** (Goal), and one cheap **Fail level** ("is there a number so low we'd call this a failure?"). Hard rule: a bare direction word ("improve", "increase") never passes — two numeric points on a named scale or it isn't a signal (Gilb). Metrics must be Precise and Time-bound — say *when* you'll look (Pichler GO checklist). Pre-commit the threshold before build: "draw a line in the sand" (Torres). Ship a small reusable scale library (task time, error rate per N, % succeeding unaided in T, support contacts/week, latency percentile) so the SME picks rather than invents (Gilb).

**Slot 3 — Feature-level AC as benefit checks.** Feature AC is a distinctly SAFe construct (Cohn/Jeffries would keep AC at story level) — adopt it, but constrained by SAFe's own dual test: **every feature AC must either mitigate an implementation risk or enable early validation of the benefit hypothesis**. Reject AC that restate scope (SAFe's named defect). Write them outside-in in "should" language as observable real-world effects "as if implemented with perfect technology," tagged with value-to-whom (Wake's External/IRACIS; North). They answer "how would we know the bet paid off?", never roll up story AC. Add a visible humility note: AC confirm the bet is *measurable*, not that it will pay off — at least half of ideas don't work (Cagan's two inconvenient truths).

**Slot 4 — NFR binding.** Use ISO 25010's nine characteristics as an *internal* prompt taxonomy only, translated to plain business language and asked selectively — never a nine-question survey (Gilb pairing). For each binding quality: decompose the vague word into the one or two elementary facets this feature actually moves (Gilb divide-and-conquer), then elicit **QUPER's three breakpoints** — usable / differentiating / overkill — instead of demanding one cold number (Adzic). Every scalar NFR gets unit + number + Meter. **Budget: one quantified success signal + 2–4 quantified NFR levels per feature; everything else stays checklist prose** — Gilb himself quantifies the critical few (anti-bloat guard). Cross-cutting NFRs live as a feature-level checklist that stories reference; story Confirmations record only deltas (Adzic). Quantified NFRs may spawn a defer-performance story pair ("make it work" now, "meet the NFR" visible in the set) with the debt warning auto-appended to the risk line (Lawrence & Green).

**Slot 5 — Dependencies, risks, and open decisions.** Run a lightweight **Feature Mining** pass — the four lists (Impact / Bigness / Risks / Uncertainties) with the verbatim stems: "How can we get this top impact without taking on all this bigness? What if we just…?" (Lawrence & Green — their own feature-altitude technique; maps directly onto the locked scope). Run a **viability sweep** (sales-channel fit, contracts, legal/compliance, monetization, brand, support) producing "stakeholders who must say yes" (Cagan) and Torres's **ethical question** ("any potential harm?") — the one lens the suite currently lacks entirely. Feasibility/usability unknowns are *captured verbatim and routed to engineers/designer, never answered by the SME* (Cagan's named root cause of blown features). Unanswerable questions go into a **Real Options deferral ledger**: "Decide when \<condition\>" with an expiry, not a forced guess (Matts). Slow cross-department research questions get raised *here* so answers are cooking before refine-story needs them (Cockburn look-ahead).

**The triage that precedes all of it.** Open with a **four-risks triage gate** (value/usability/feasibility/viability, each rated severity × consequence, seeded by the feature's evidence tag): all minor → fast lane straight through ("just add the work to the backlog and move on" — Cagan); major value/viability risk on assumption-grade evidence → the deliverable becomes a **discovery brief** (ranked riskiest assumptions via Torres's importance × evidence 2×2, smallest suggested test each, pre-committed success criteria) and the feature is marked *not build-ready pending discovery*. Never let a feature exit "build-ready" with a major untested value assumption silently intact — that is Cagan's feature-team theater. Also triage differentiator vs commodity to budget conversation depth (Keogh: 20–60 min vs 5–10 min).

### Story-SET curation (shallow by design)

The one-line-Cards-only constraint is not a compromise — it is the orthodoxy of nearly every authority: pre-splitting a definitive story set is "demonstrably counterproductive" and lands as fait accompli (SAFe/IJI); I/N/V favor large items lower in the backlog (Lawrence & Green's INVEST tension); deep-refined backlogs are inventory waste (Jeffries, Wake, Pichler's DEEP). The skill should *state this rationale* and decline SME attempts to deepen Cards, capturing detail as one-line notes for refine-story.

Curation is four moves:

- **ADD (missing stories):** walk the story set as a **journey-order map-walk** — "first they…, then they… — have I missed a couple of steps here?" (Patton); audit **outputs**: enumerate the outputs the success signal depends on, verify each has a producing story (Matts, Feature Injection); repeat North's probe "what's the next most important thing this still wouldn't do?" until answers fall out of scope; sweep lifecycle (setup/admin/reporting/teardown) and non-obvious roles (operations, support) (Wake). Added stories are labeled *illustrative* (SAFe).
- **SPLIT (oversized Cards, coarse only):** trigger on pattern giveaways — "manage/control" (CRUD), variation-hiding domain terms ("flexible dates"), whole narrated workflows, kite-level scope (Cockburn's sea-level lint: one person, one goal, one sitting). Apply Lawrence & Green patterns; outputs stay one-line Cards. No AC, no full sizing — that's refine-story's job.
- **PARK (dead stories):** the spine question is "**Are there stories you can deprioritize or delete?**" — a set where everything is mandatory hides waste (Lawrence & Green 80/20). Objective trigger: Impact-Estimation-lite — a story contributing ~zero to the success signal (Gilb). Parking is a celebrated outcome ("never say no — say not now"; tear up cards early and often — Jeffries). Caveat before parking on weak enthusiasm: is it no demand, or a crappy solution shape? (Cagan).
- **REPAIR (pseudo-stories):** detect tasks/components wearing story syntax ("As a developer, I want a database diagram…"); remedy is to **recombine** into "a good, if large, starting story" before any split (Lawrence & Green). Fish-level fragments merge into their sea-level parent or demote to future AC (Cockburn). Triage dependencies by Wake's taxonomy: overlap → repartition; order → tolerate; containment → warn.

Nominate the first slice with the triple test: not too big, not too obvious (must touch the core complexity/scariest risk), not too fuzzy (Lawrence & Green) — softening decompose-epic's "walking skeleton first" toward Adzic's "skeleton on crutches."

---

## 2. The story-refinement model

### Conversation structure

**Entry check (before any elaboration):** North's narrative-slot audit — title describes an activity with a knowable end state (reject "Account management"); role is a real person you could call; benefit stated. Pseudo-stories bounce back to feature level. Then two calibrations that shape everything downstream:
- **Keogh's complexity score**, asked plainly ("has anyone on your team / in the company / anywhere done this before?"): 1–2 → scenario titles only, fast pass; 3 → full conversation (the sweet spot); 4–5 → **stop; exit as a spike recommendation with the blocking questions listed verbatim** — "analysis doesn't work in complexity"; forced AC on genuine unknowns is fiction (Keogh, Lawrence & Green).
- **Complicated vs complex** governs Confirmation depth: complicated → full adaptive Confirmation; complex → clear hypothesis + the few AC defining the first probe + open unknowns logged, never padded into speculative AC (Lawrence & Green).

**Conversation runs in Feature Injection order** (Matts): (1) **hunt the value** — confirm the so-that and the concrete OUTPUT that carries it ("forget the screens — what has to come OUT of this?"); a story that can't state its benefit/output is parked back to refine-feature, not decorated. (2) **Scope** — SME narrates a real "last time" usage story (Jeffries story-first; Torres past-behavior); the skill asks understanding questions only; scope-in/out fence built from confirmed and *rejected* proposals (rejected proposals become the scope-out list for free). (3) **Spot the examples** — only then mine edge cases.

**Edge-case mining is structured refutation, not brainstorming.** The engine is Matts's **Break the Model**: elicit an example → restate the implied rule → hunt the example that breaks it (including the negate-a-Given move: "you said it can identify every user — what happens when it can't?") → revise → stop when the SME fails to break the model twice running. Layer on: Keogh's **Context Questioning** ("any other context where this event produces a different outcome?" — including the empty/none case) and **Outcome Questioning** ("another outcome that matters? Something we missed, perhaps?"), Interaction Questioning for destructive/financial/multi-party actions; Adzic's **boundary probing** (every number gets at/just-below/just-above); Wake's **0/1/many/duplicates** scaffolding and **discriminating examples** (construct the case where two readings of a rule diverge); Cockburn's **extension-condition walk** (step the happy path; "what could go differently here?" per step); Jeffries' perturbation of accepted examples ("and what if there isn't enough in the account?" — framed positively: "the test just showed us the story was incomplete; we caught it now"). Close with the Gottesdiener–Gorman **7-dimensions sweep** (two questions max on untouched dimensions, deliberately probing the habitually skipped Control and Quality Attribute).

**The internal data model is Example Mapping** (Wynne): every SME answer lands as a **rule** (blue), an **example** (green), or a **question** (red). Questions nobody present can answer are parked with a named owner — never debated. Zero examples under a rule = untested assertion; a pile of examples under one rule = hidden distinct rules; many rules = too big. A session with zero out-of-scope decisions probably under-explored (Keogh's exploration health metric).

### Adaptive Confirmation format — exact routing rules

**The transcript is not the Confirmation.** An explicit "refining the specification" pass sits between mining and writing: strip incidental values, name hidden domain concepts, keep only the differences that matter, then show the refined version to the SME to criticize (Adzic). Never draft Gherkin live during the conversation — discovery and formulation are separate activities (Wynne, Nagy & Rose, Keogh: "people don't use Given, When, Then in conversation").

Routing, in decision order:

1. **Default: plain rule checklist.** A rule stated as one clear line IS a legitimate first-class Confirmation ("leave it as acceptance criteria until it needs to be automated" — Keogh; Cohn's conditions of satisfaction; SAFe's own flagship AC example is a quantified checklist with a scope-out bullet, not Gherkin). Escalate only where an example is needed to test shared understanding.
2. **Example table** when multiple examples **share structure and differ only in values** — calculations, rates, categorization, data rules (Adzic's own selection rule). Lawrence & Green supply the split/table router: variation changes the *size of work* → its own story; variation changes only the *answer* → a table row. Ask for the SME's existing spreadsheet or legacy report before inventing rows (Jeffries). Every row carries input AND expected result (Wake). Cap per rule at 3–7 rows including ≥1 boundary case and ≥1 counter-example; bulk just-in-case data is banished (Adzic).
3. **Given-When-Then** when the **context or event itself differs** — distinct behaviors and state changes (Matts: new event/context → scenario; new data → row). Hard lints: exactly one When; Givens are "all of, and no more than, the required context"; every Then an explicit "should" statement, challenged once ("Should it? Really — always, or only when…?"); one business rule per scenario; titles state only how scenarios differ (North). Two-domains rule: business language only, zero UI mechanics (North).
4. **Scalar qualities never hide as adjectives in Then-clauses**: anything answering "how well/fast/accurate/many" carries unit + number + Meter, hosted in the checklist (Gilb's scalar/binary triage).
5. **UI/interaction detail**: pointer to a sketch/mockup, not prose (Pichler's Story Mania; Cagan: prototypes beat documents).

Every Confirmation includes an explicit **"Not in this story:"** line (SAFe's scope-out bullet pattern) and every AC line **traces to an SME statement or an SME-confirmed proposal** — the skill may propose, but nothing enters the artifact unconfirmed (North's capture-of-conversation rule; Keogh).

### INVEST check and split protocol

The check is **asymmetric by design**: I/N/V arrive upstream-guaranteed and get one light re-confirmation probe each (overlap check; not-a-contract check; value-to-whom check). E/S/T get Wake's full verification engines:

- **E = understanding, never a number** (Wake: "the most-abused aspect of INVEST"). On failure, three-way routing: unclear business rules → keep conversing (this skill's job); unknown technology/approach → flag a spike for the team; sheer size → the S path.
- **S = Scalable first.** Before splitting, try the intensity dial: same headline, move elaborate bullets to a later version (Wake). Size probes without estimates: "could the team fit 6–10 like this in a sprint?" (Lawrence & Green capacity-bet) and the scenario-count tripwire — **~5–6 scenarios means split** (North).
- **T = the any-input/agreed-output drill**: walk one concrete case to its expected result. On failure, classify into Wake's six troubles (Magic / Intentional Fuzziness / Computational Infeasibility / Non-Determinism / Subjectivity / Research Project) — each maps to a distinct next move, including "park as research" rather than fake AC. Testable also means **has a Meter** for anything scalar (Gilb) and expected answers written up front (Jeffries' Guru-Checks-Output guard).

**Split protocol** when Small fails: (1) compound-vs-complex first — multiple goals → one-goal-per-story (Pichler); genuine uncertainty → spike, last resort, carrying the verbatim blocking questions (Lawrence & Green). (2) Preferred seam: **peel coherent rule/scenario groups** discovered in conversation into new one-line Cards (Wynne's blue-card seams; North's split-along-business-lines; Keogh's split-by-scenario, justified by "what feedback does this slice get us sooner?"). (3) Fallback menus: Lawrence & Green's nine patterns / Adzic's value-first menu (narrow the segment → examples of usefulness → dummy-then-dynamic → simplify outputs → basic utility → learning-from-earning → hamburger last). (4) **Postcondition gate on every split**: each child is a vertical slice passing full INVEST, end-to-end (user action AND system response — Wake's rejection of trigger/response splits), at least one child is deprioritizable, and there's an obvious first story (Lawrence & Green evaluation). Layer/phase/discipline splits are hard-blocked. Peeled Cards inherit the parent's benefit clause and route back to the feature's story set.

### The "ready for sprint planning" bar

Composite, and emphatically a **knowledge-state report, not a certificate**: (1) the Conversation happened and the Card is unchanged — still the SME's one-liner, detail attached not inlined (Jeffries); (2) SME-*originated* Confirmation exists with expected answers up front, 3–5 vital criteria (Pichler's number, Cohn's vital filter as the test); (3) the SME can **narrate the demo** and every narrated moment maps to a Confirmation item (Adzic); (4) the **riskiest remaining ignorance is named** — one explicit "what are we most likely to be wrong about?" question, answers recorded as a Known-Unknowns block with owners (North's Deliberate Discovery; Wynne's red cards); (5) open questions are *allowed* — "ready enough with known unknowns" is a legitimate exit (DoR debate); (6) sizing intentionally left to the delivery team, stated on the artifact; (7) a closing line noting the conversation continues in-sprint.

---

## 3. Interview mechanics

### Mapping Example Mapping onto one-question-per-turn

Wynne's four-card model becomes the skill's turn-selection algorithm. After each SME answer, classify it (rule / example / question / scope decision), then pick the next move by priority:

1. **Unillustrated rule** → "Can you give me an example — a real one, from last month, with the actual numbers?" (Keogh's signature move; Adzic's realism check).
2. **Unexplained example** → state the implied rule back and hunt refutation: "So the rule seems to be X — can you think of a time it wouldn't hold?" (Matts).
3. **Number/date/limit mentioned** → boundary probe: "exactly 50? 49.99?" (Adzic).
4. **Hedge or "it depends"** → "Give me an example that shows the uncertainty — a case where it could go either way" (Adzic: turn uncertainty into an example; never resolve ambiguity by guessing).
5. **Question nobody can answer** → red card: "Great question none of us can answer — who WOULD know? Parking it so we don't lose it" (Wynne). Move on; never debate.
6. **Trigger word fired** (see §4 lint) → the vague word becomes the next question: "You said 'appropriate' — appropriate according to whom, and what would it be in THIS example?" (Wake).
7. **Rule pile stable** → alignment probe: invent a plausible tricky case and ask "What happens next?" — surprise reveals gaps better than "any other edge cases?" ever will (Adzic's feedback exercise).

### The missing-amigos compensation

The interview is structurally two-party; the tester and developer amigos are absent (Dinwiddie). The skill must explicitly rotate hats in labelled turns — tester hat: "What's the worst thing that could happen here? Is there more?" (Gregory & Crispin); developer hat: "What should the system do in this exact case?" (Cockburn — and "I've never thought about that case" is a red card, not a defect). Perspectives the skill cannot simulate (feasibility, UX, data, security) are **flagged as open items, never invented** (Matts's Inclusion principle; Cagan's routing rule).

### SME-friendly phrasing rules

- **Never say "acceptance criteria" cold.** Open the Confirmation with Cohn's exact framing: "What needs to be true for you to consider this done?" and Jeffries' pivot: "How will you confirm we've done what you need — what will you look at, and what exactly should it show?" The SME originates; the skill scribes.
- **Pidgin-language principle**: the skill speaks the SME's language, translating every agile term inline (SAFe/Wake) — "vertical slice" → "a thin but complete version someone could actually use"; "spike" → "a small time-boxed investigation we throw away"; "INVEST-Small" → "small enough the team would bet a few days on it."
- **Mom-Test compliance for numbers**: interrogate past fact, not hypothetical opinion. Every claimed baseline gets Gilb's Source/Evidence questions ("Where did that number come from? How could we verify it?"); every value claim gets evidence-of-stakes probes ("what have customers already paid / spent time on / asked for in writing?" — Cagan's currencies).
- **The glaze test on readback** (North): any term the SME wouldn't own gets rewritten; the SME's nouns and verbs go verbatim into GWT and table headers, with a small per-feature glossary (Dinwiddie).
- **Concrete-example bar everywhere**: named actor, real values, exact visible response — the "No go, Joe" standard (Jeffries).

### Closing moves

The two cheapest high-yield validation rituals, run in sequence: **title side-by-side test** — read only the scenario/section titles back; indistinguishable titles merge, an SME "what about…" with no title spawns a scenario (North); then **lingua-franca read-back** — "Can you definitively say: yes, that's exactly what I mean?" Any hesitation is a defect in the artifact, not the SME (Dinwiddie). For refine-story specifically, finish with the **demo narration** (Adzic) and the readiness thumb-vote: "If the team picked this up Monday, what would still worry you?"

---

## 4. Quality gates & anti-patterns

### The AC lint battery (mechanical, run over every drafted criterion in any format)

- **Vague-word stop-list** (merged Wake + Wiegers + SAFe + Gilb): *just, appropriate, right, best, worst, all combinations, most, least, any of, don't care, I'll-know-it-when-I-see-it, fun, easy, user-friendly, simple, fast, quickly, efficient, several, improved, better, minimize, maximize, seamless, intuitive, robust, flexible, secure, scalable, reliable, accurate, nice, clean, support, should-if-possible, and/or, etc.* Each hit auto-generates the next SME question (convert to a number, an example, or an explicit decision — don't delete the negotiability, frame it with a boundary).
- **Guru-Checks-Output guard** (Jeffries): reject "correctly," "appropriately," "gracefully," "as expected" — expected answers stated up front, even hand-computed.
- **Customer-visible only**: outcomes in terms of what the customer observes (displays, reports, balances), never internal mechanics (Jeffries); no widgets/endpoints/table names — mechanics "pushed down into the implementation of the step" (North's two-domains rule); problem-domain vocabulary, named roles never "the User" (Wake's vocabulary ladder; Pichler's User Incognito).
- **Ends/means guard**: a solution stated as an AC gets the result question ("if it worked perfectly, what would be different, by how much?"); the result becomes the AC, the solution a design note — unless genuinely mandated, then recorded explicitly as a labeled constraint (Gilb).
- **Criteria Crisis checks** (Pichler): reject AC that restate the card, embed whole workflows, or smuggle new requirements (smuggled requirements become new one-line Cards routed back to the feature).
- **Fused-AC detection**: conjunctions and "a story needing many kinds of tests" signal several requirements lumped together (Wiegers).
- **The "call me when you're done" test** (Wiegers): mentally append it — nervousness means elaboration needed.

### Scenario-explosion guards

Cap key examples at 3–7 per rule with mandatory boundary + counter-example (Adzic); "2 examples, not 32" — delete boring scenarios (Keogh); ~5–6 scenarios triggers a split proposal, never a second When (North); AC are "a table of contents, not the complete test plan" (Cohn); decline combinatorial enumeration on principle — Wake refused 432 combinations, Adzic's payment-routing case threatened 78,125; decompose narrated workflows into independent focused checks, never chained steps (Adzic). Closing self-restraint check: "have we written more Confirmation than needed to clarify the confusing or controversial decisions? If yes, cut" (Wake).

### Over-specification warnings

Detail is inventory: refine one story just-in-time, resist batch refinement (Jeffries, Wake's WIP limit, Pichler's DEEP, SAFe's "requirements inventory"). No fixed documentation template — "please don't do the template thing"; ask what the builders need for THIS case (Cagan). The Card never fattens: if refinement pressure grows the Card, that's the split signal (Jeffries). Timing guardrail: warn when refining features/stories not starting soon (Cohn's "thinking too far ahead").

### When to spike instead of specify — Keogh's scale as the router

Score 1–2: name the scenario, move on. Score 3: full conversation. Score 4–5: spike/experiment, never fabricated AC. Live textual sensemaking signals upgrade the score mid-conversation: SME can't produce an example, contradictory answers, "it depends" without naming on what, every question spawning three more (Keogh). Spikes remain a labeled **last resort** after every split pattern is tried, carrying the verbatim blocking questions, minimal and throwaway (Lawrence & Green; SAFe).

### Readiness-as-stage-gate — the criticism and the design answer

The unanimous warning (Cohn: "a huge step towards a sequential, stage-gate approach"; Galen: anti-pattern; Lawrence & Green: analysis paralysis on complex work; Matts: early commitment destroys option value; Cagan: process-as-proxy): a DoR demanding 100% completeness recreates waterfall. Design answer: both skills end with a **knowledge-state report** — what's agreed (rules + examples), what's open (red-card questions with named owners), what's deliberately deferred ("decide when \<condition\>"), which risks were retired on what evidence — with an explicit "ready enough with known unknowns" allowance. Never a certificate, never a blocker, and the artifact is positioned as *input to the team's conversation*, owned by the named SME (Pichler's no-handoff; Cohn).

---

## 5. Key tensions & decisions

1. **GWT purism vs adaptive formats.** North's lineage treats GWT as the AC form; Keogh, Wake, Cohn, and SAFe's own flagship example all default to plain rules/checklists. **Decision: checklist default, escalation-by-rule** (table when only values differ; GWT when context/event differs; number+Meter for scalars). North's lints apply *within* the GWT branch only. This is the single most load-bearing routing decision and it has the broadest backing.
2. **How much detail before sprint.** SBE maximalists push comprehensive examples; Lawrence & Green and Keogh push detail into the sprint for complex work. **Decision: calibrate by complicated-vs-complex + the 1–5 scale**, with Cohn's stopping rule as the universal brake ("sufficiently understood that the team has a reasonably strong chance"). Deliberate incompleteness is a feature, not a failure (North, Matts).
3. **DoR as checklist vs conversation-state.** Pichler promotes a DoR; Cohn says most teams shouldn't have one. **Decision: use Pichler's Clear/Feasible/Testable as the *lens*, Cohn's framing as the *tone*** — guidelines rendered as a knowledge-state report.
4. **Who writes AC.** Cohn: PO owns; Pichler: joint; Jeffries: customer defines, period. **Decision: SME originates (the "how will you confirm?" pivot), skill proposes and scribes, nothing enters unconfirmed, artifact owned by the named SME and addressed to the team's conversation.**
5. **Feature-level AC legitimacy.** Pure SAFe; Cohn/Jeffries would call it over-formalization. **Decision: keep it, credited to SAFe, but hard-constrained by the dual test (risk-mitigating or benefit-validating) so it cannot become a mini-spec.**
6. **Walking skeleton vs skeleton-on-crutches.** Decompose-epic says skeleton-first; Adzic says crutches (simplest survivable architecture, even a third-party form). **Decision: soften refine-feature's first-slice nomination to "simplest survivable slice that touches the scariest risk"** (Adzic + Lawrence & Green triple test).
7. **Estimation.** The suite's no-estimates lock is *better* backed than mainstream practice — Jeffries (inventor of points) calls estimation waste, Wake calls E the most-abused letter, Adzic budgets instead. **Decision: keep the lock, but retain the sizing *conversation* for its elicitation value** (SAFe's insight: it draws out hidden assumptions and missing AC), phrased as the capacity-bet question.
8. **Specification vs validation.** Cagan/Torres: a perfectly specified unvalidated feature is still waste. **Decision: refine-feature gets an explicit alternate exit — the discovery brief** — and both skills carry validation state (evidence class per claim) alongside specification state.
9. **Quantify-everything (Gilb) vs conversational minimalism.** **Decision: the critical-few budget** — two-points-on-a-scale enforced only on the success signal and binding NFRs; binary criteria stay one plain sentence.
10. **Story prioritisation.** Adzic: don't prioritise stories; prioritise outcomes. **Decision: ranking/parking lives in refine-feature; refine-story never sequences.**

---

## 6. Slate verdict

**refine-feature — pull real weight:** SAFe/Leffingwell (the build-ready definition, feature-AC dual test, illustrative-stories principle), Lawrence & Green (Feature Mining, 80/20 park spine, split evaluation gates), Cagan & Torres (four-risk triage, discovery-brief exit, story-map walk, ethical lens), Gilb + ISO 25010 (success-signal ladder, NFR binding), Pichler (GO checklist, DEEP, constraint cards), Matts (Feature Injection outputs audit, Real Options ledger). **Moderate:** Cohn (split-vs-criteria, smells, timing guardrail), Wake (dependency triage, lifecycle scan, Ilities), Keogh (chunk-up, pixies, differentiator triage), Adzic (behavior change, QUPER), Jeffries (tear-up norm, inventory warning), North (ignorance-visible readiness). **Marginal here:** Wynne.

**refine-story — pull real weight:** Wynne/Example Mapping (the structural backbone — the single most important gap-scan addition), Adzic (key examples, the refining pass, format routing, GWT hygiene), North & Matts (narrative audit, GWT lints, Break the Model, should-challenge, two domains), Jeffries (customer-defined Confirmation, concrete-example bar, Guru-Checks-Output), Wake (E/S/T engines, trigger words, good-split validator), Keogh (context/outcome questioning, complexity gate, AC-as-rules, no-Gherkin-in-conversation), Cohn (done-question, vital filter). **Moderate:** Lawrence & Green (split flowchart, complex/complicated calibration), Pichler (3–5 heuristic, criteria lint), SAFe (Discovery/Formulation phase boundary, scope-out bullet, test-centric hat). **Marginal here:** Cagan/Torres (minimalism norm only), Gilb (narrow: scalar routing + Meter test — but keep that sliver, nobody else covers it).

**Gap-scan candidates — MUST ADD:** Wynne (Example Mapping as refine-story's backbone), Dinwiddie (missing-amigos compensation + lingua-franca read-back), Wiegers (the mechanical AC lint, ACs only — never aimed at the Card), the Scrum-canon DoR-debate *stance* (knowledge-state report). **NICE:** Cockburn (sea-level lint + extension-condition walk + look-ahead), Gregory & Crispin (tester-hat inventory, non-physical-card adaptations), Gottesdiener & Gorman (7-dimensions sweep doubling as format router), Patton (map-walk, context anchoring). **SKIP:** OOPSI (the suite already composes its pieces), Feature Mapping/Smart (duplicated by Cockburn + Patton, pulls toward tooling).

One factual discipline for the skill docs: attribute splitting patterns to **Lawrence & Green**, SPIDR to **Cohn** (not Humanizing Work); FAB = "Features and Benefits"; the 3Cs and INVEST to Jeffries/Wake, not SAFe; "promise for a conversation" to Cockburn/Jeffries lineage, not North.

---

## 7. Recommended skill shapes

### refine-feature — interview flow

**Phase 0 — Intake & timing guard.** Load the skeleton feature + story set + epic artifacts; verify the upstream chain (hypothesis slots present, outcome link intact). Timing guardrail: if the feature isn't starting within a sprint or two, warn ("thinking too far ahead" — Cohn) and offer the shallow hypothesis-only pass.

**Phase 1 — Risk triage (the fork).** Four-risks sweep, severity × consequence, seeded by evidence tags; differentiator-vs-commodity depth budget (Keogh). Three routes: fast lane / full pass / **discovery-brief exit** (major value-viability risk on assumption evidence). One question per turn, plain language.

**Phase 2 — Hypothesis sharpening.** Chunk up if solution-shaped (pixies test); Cagan's four opportunity questions; force behavior-change form (who starts/stops/does-more, by how much); probe evidence with stakes questions, tag provenance.

**Phase 3 — Success signal (the Planguage ladder).** Scale → qualifiers → Meter → Baseline (flagged guess allowed) → Target → Fail level. Hard rule: no bare direction words survive. Impact-Estimation-lite: what share of the epic outcome gap does this close?

**Phase 4 — Feature AC as benefit checks.** "How will you confirm the bet paid off?" Each AC tagged risk-mitigating or benefit-validating; restated-scope AC rejected; humility note appended.

**Phase 5 — NFR binding.** Selective ISO 25010 prompts in plain language → divide-and-conquer the confirmed ones → QUPER three breakpoints → quantify the critical few (2–4 max) with Meters → cross-cutting checklist at feature level → defer-performance story pairs with debt warning.

**Phase 6 — Story-set curation (shallow).** Journey map-walk + outputs audit + "next most important thing it still wouldn't do?" + lifecycle/role scan → ADD (illustrative, one-line). Sea-level lint + pattern triggers → coarse SPLIT (one-line outputs). Pseudo-story REPAIR (recombine). 80/20 + zero-impact → PARK (celebrated, with reason). First-slice nomination via the triple test. Explicitly refuse story deepening, stating the rationale.

**Phase 7 — Dependencies, risks, deferrals.** Feature Mining four lists with "What if we just…?" stems; viability stakeholder sweep; ethical question; feasibility/usability questions captured and routed, never answered; Real Options ledger ("decide when \<condition\>" + expiry); Cockburn look-ahead (slow-research questions raised now).

**GATE — Benefit-Trace Gate** (the analog of decompose-epic's coverage-gate, two-way): (a) every surviving story traces to an output the success signal needs, and every needed output has a story; (b) every feature AC passes the dual test; (c) the signal has both points on the scale plus a Meter; (d) Clear/Feasible/Testable asked as SME questions; (e) at least one story was parkable or the skill flags hidden waste (Lawrence & Green). Exit artifact: sharpened feature + curated one-line story set + knowledge-state readiness report (risks retired, evidence classes, open questions with owners) — or a discovery brief.

### refine-story — interview flow

**Phase 0 — Entry check.** Narrative-slot audit (activity title, real role, stated benefit — repair conversationally); pseudo-story bounce; complexity score 1–5 (score 4–5 → spike exit with verbatim blocking questions); complicated-vs-complex depth calibration.

**Phase 1 — Value anchor.** Feature Injection step 1: confirm the so-that and the concrete output ("what has to come OUT of this?"); probe the so-that once (robot-vacuum lesson — Cohn); a valueless Card parks back to refine-feature. Re-anchor the story to its feature/outcome context (Patton).

**Phase 2 — Context & happy path.** SME narrates a real recent usage story; skill asks understanding questions only; happy path captured as steps; scope fence started (confirmed-in / explicitly-out).

**Phase 3 — Rule & example mining (the core loop).** Example Mapping state machine: rule → concrete example → Break the Model refutation → boundary probes → Context/Outcome/Interaction questioning → red-card parking with owners. Tester-hat and developer-hat turns labelled (Dinwiddie/Crispin). Terminate refutation after two consecutive failed breaks per rule; run the invented-tricky-case alignment probe (Adzic) once the map stabilizes.

**Phase 4 — Sweeps.** Extension-condition walk over the happy path; 0/1/many/duplicates on collections; 7-dimensions closing sweep (Control and Quality Attribute deliberately probed); verify at least one out-of-scope decision exists or run one more divergence pass (Keogh).

**Phase 5 — Confirmation drafting.** Explicit refine-the-specification pass (de-noise, name hidden concepts, keep important differences); adaptive routing (checklist default → table when values differ → GWT when context/event differs → number+Meter for scalars → sketch pointer for UI); GWT lints; full AC lint battery; "Not in this story:" line; SME spreadsheet harvested before table rows invented; every line traced to SME confirmation.

**Phase 6 — INVEST & split.** Light I/N/V probes; deep E/S/T engines (three-way E routing; intensity dial then split; six-trouble T classification). Split protocol with the postcondition gate; peeled Cards inherit the benefit clause and route back to the feature artifact.

**GATE — Demo-and-Read-Back Gate** (the load-bearing validation analog): (a) **demo narration** — SME narrates the demo; every moment maps to a Confirmation item and vice versa (Adzic); (b) **title side-by-side test** (North); (c) **lingua-franca read-back** — "yes, that's exactly what I mean" (Dinwiddie); (d) vital filter re-applied — 3–5 criteria, each reject-worthy (Cohn/Pichler); (e) ignorance question — "what are we most likely to be wrong about?" → Known-Unknowns block with owners (North). Exit artifact: unchanged one-line Card + brief Conversation notes + Confirmation + scope-out list + red-card ledger + knowledge-state readiness report, closing with "sizing left to the team; the conversation continues in the sprint."

Shared machinery to build once and reuse in both skills: the vague-word linter, the ends/means guard, the provenance tagging, the Real Options ledger, the split postcondition gate, the missing-amigos hat rotation, and the jargon-translation glossary.
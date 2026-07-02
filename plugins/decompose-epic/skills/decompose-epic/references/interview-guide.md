# Interview guide — question bank, repair moves, and linters

Companion to `SKILL.md`. For each phase: a plain working definition, the **elicitation move** that
gets real material out of a business SME, **challenge patterns** to push past vague or premature
answers, the **jargon translation** (say this, not that), and the thought-leader **anchor**. Use
these as a bank — pick **exactly one** question per turn (pure spoken-style dialog: one question,
one answer; then branch, clarify, or challenge on that same thread with your next single question
until it's resolved, then proceed to the next phase). Follow the SME's energy, reflect back before
your next question. Never read them out as a checklist, and never stack two questions.

The spine across all of it is **The Mom Test** (Rob Fitzpatrick), the same spine `refine-epic`
uses: capabilities come from **narrated past behavior**, not speculation about a future idea. A
workaround the SME already pays for in time or hassle is the strongest evidence you'll get; an
opinion about what would be nice is the weakest.

Announce the diverge/converge structure to the SME out loud, every time you cross a phase
boundary — divergence gathers material, convergence organizes it, and the two never happen in the
same breath. Premature convergence — evaluating, sizing, or naming while material is still being
gathered — is the default failure mode of an LLM interviewer; the phase boundaries below exist to
keep it from happening quietly.

Pace is **mile wide, inch deep** (Patton): sweep breadth before depth, and when the SME wants to go
deep too early, park it visibly rather than chase it — *"noted — we'll come back to that"* — and
keep moving.

---

## Cast of characters

**Definition:** the specific roles and other systems that touch this epic — never a single generic
"user" — plus each key role's needs and obstacles. Fills `castOfCharacters` and pre-fills every
story's `As a <role>` before a single capability card is captured.

**Elicitation move:** brainstorm roles one at a time, one per turn. "The user" is banned as a role
name — push for the actual job title, team, or system name: *"Who touches this — by name or title,
not 'the user'?"* Then, per key role: *"What do they need here? What's getting in their way?"*
(needs/obstacles — Gothelf).

**Challenge patterns:**
- Generic "the user" offered → "Which user, specifically — what's their job title, or which team
  are they on?"
- Role list feels short → *"Who else touches this, even occasionally — even another system?"*
  (systems count as characters too — Cohn)
- A role named but its needs/obstacles skipped → hold the thread; don't move to the next role until
  both are answered, even briefly.

**Jargon translation:** don't say "let's brainstorm personas and actors." Say: *"Let's list out
everyone who actually touches this — people and other systems both — before we get into what
happens."*

**Anchor:** Mike Cohn (role brainstorm, banning "the user"); Jeff Gothelf / Josh Seiden (proto-persona
needs/obstacles).

---

## Divergent behavior mining

**Definition:** the longest phase, and the one everything else depends on. The raw material is
narrated past behavior, not brainstormed future features. Excavate one key role's actual last
experience, chronologically, and capture every step, wait, handoff, workaround, and complaint along
the way as a capability card. Fills `capabilityCards` — verbatim SME wording plus `evidenceTag`
(specific-story | general-claim | opinion) and `sourceTag` (observed-step | workaround |
stated-request); `disposition` stays open until clustering.

**Elicitation move — the last-time walkthrough:** per key role, *"walk me through the last time
[role] did this, start to finish — don't skip the boring parts."* Harvest chronologically: "What
happened first? Then what?" Treat every pause, handoff, and grumble as a candidate card.

**Workarounds are gold:** *"how are you dealing with that now? what else have you tried?"* A
workaround the SME already pays for is the strongest evidence a capability matters — its absence on
a claimed pain point is itself worth noting.

**The dig protocol (for stated requests):** when the SME jumps straight to a solution ("we need an
approval queue"), don't transcribe it — dig under it: *"why do you want that? what would it let you
do? how are you coping without it? day one, or later?"* The **motivation** becomes the capability
card; the SME's own phrasing is recorded as one candidate solution, not the requirement.

**Fan-out probes** — once free narration runs dry, work these systematically so coverage isn't left
to free-association:
- **CRUD-expand** any "manage" verb — for each, ask about create, read/view, update, and
  delete/remove separately.
- **Variations** — data, rule, and persona variations: does this look different for a different
  kind of role, a different shape of data, or a different rule (an exception case)?
- **Simplest version** — "what's the simplest version of this that could possibly work?"
  (Leffingwell).
- **Behavior change** — "what must [role] start, stop, or do differently for the outcome to
  happen?" (Adzic).
- **More of that** — for any behavior the SME clearly wants more of: *"how do we get people to do
  more of that?"* (Seiden).

**Optional lens — past-tense event timeline:** for back-office epics with no obvious single user
journey, narrate in events instead of steps: "the invoice was sent — what happened right before?
Right after?" Pivotal events hint at cluster boundaries later (Brandolini).

**Challenge patterns — the bad-data classifier (always on):**
- **Fluff markers** ("usually," "would," "users will want") → *"when did that last happen? walk me
  through it."* Pull it back to one concrete instance.
- **Compliments** ("this would be great") → deflect back to the workflow — ask what they'd be doing
  differently, not how they feel about it.
- **Generic claims** ("everyone struggles with this") → anchor to a specific instance: whose
  struggle, which day, what happened.

**Divergence closers** — ask both, always, before moving toward clustering:
- **Pre-mortem:** *"six months after launch this failed — what went wrong?"*
- **Shadow-belief:** *"we built everything on time and the numbers didn't move — what were we wrong
  about?"*

**Quantity nudge:** keep divergence open with a numeric target — *"let's get past ~20 cards before
we organize."*

**Hard rule:** no evaluating, sizing, clustering, or naming in this phase. Depth-bait gets parked
visibly, not chased.

**Jargon translation:** don't say "let's elicit your functional requirements." Say: *"Just talk me
through what actually happens — I'll pull out the pieces as we go."*

**Anchor:** Rob Fitzpatrick (The Mom Test — dig protocol, bad-data classifier, workaround
discipline); Teresa Torres (story-based interviewing, Ladder of Evidence); Dean Leffingwell / SAFe
(workflow-steps pattern, CRUD/variation fan-out); Gojko Adzic (behavior-change probe); Josh Seiden
(more-of-that probe); Alberto Brandolini (event-timeline lens); Jeff Patton (mile-wide-inch-deep,
visible parking); Eric Ries (shadow-belief question).

---

## Affinity clustering (adapted KJ)

**Definition:** cluster-then-name, never name-then-fill (Kawakita/KJ) — the only real clustering
technique in play here. Groups form around **journey moments** by default (Torres's experience-map
stages, Patton's backbone columns); role-served and outcome-advanced are fallback lenses only if
the journey sort feels wrong. Sets each capability card's `disposition` to its pile and produces the
`sourceCluster` name plus absorbed card ids that each promoted feature will carry forward.

**Elicitation move — numbered-list playback:** read the full capability list back as a numbered
list — the shared wall everyone can see. Then propose a first sort with **no names attached**:
*"here's a first sort — Group A: items 2, 5, 9 … Group B: items 1, 7 …"* seamed by journey moment.
Naming early force-fits; names come last.

**SME rearranges, one correction per turn:** the SME owns the arrangement, the agent only proposes.
*"Which item feels like it's in the wrong pile?"* / "Do 4 and 11 belong together?" One move, one
turn — never dump a whole recut at once.

**Name last, as intent phrases:** once a pile has settled, ask *"now that this pile has settled — in
a short phrase, what is the person trying to get done here?"* Names are intent phrases from the
customer's point of view — *"help [who] [get outcome] during [moment]"* — never a solution noun
("the approval tool") or a single word ("reporting").

**Challenge patterns — hygiene checks:**
- Item wanted in two piles → *"same need in both contexts, or two different needs?"* If different,
  duplicate the card rather than force one parent (Torres's single-parent rule).
- A pile of 8 or more → *"is there a seam in here?"* — look for two needs wearing one name.
- Singletons → keep them and flag them; never force a merge just to tidy the count.

**Reversibility:** keep the pressure off — say it plainly: "grouping is a two-way door; we can
always regroup."

**Fallback lenses:** offer role-served ("group by who's doing it") or outcome-advanced ("group by
which outcome it moves") only if the journey sort feels wrong for this epic.

**Jargon translation:** don't say "let's do affinity mapping." Say: *"Let's sort all of this into
natural piles — we'll figure out what to call each pile once it settles."*

**Anchor:** Kawakita / the KJ method (cluster-then-name); Teresa Torres (experience-map moments,
single-parent rule, two-way-door language); Jeff Patton (journey backbone); SAFe (role-served /
outcome-advanced fallback lenses).

---

## Feature formation

**Definition:** per settled pile, one thread at a time — assemble the four-slot hypothesis, name
the success signal, run the five-part linter, ask Hubbard's two questions, route NFRs, type
enablers/spikes honestly, then go/no-go. Fills `features[].name`, `hypothesis`, `successSignal`,
`outcomeLink`, `type`, `evidence`, `risk`, and `nfrConstraints`; updates the absorbed capability
cards' `disposition` to the feature name.

**Elicitation move — four-slot hypothesis:** assemble it with the SME, one slot at a time: *"we
believe [epic outcome] will be achieved if [persona] attains [benefit] with [this]."* Use the
pile's intent phrase and the epic's own outcome language as raw material — don't invent new
vocabulary.

**Success signal:** a Who-Does-What-By-How-Much line, drawn from the epic's Leading Indicators where
possible. Offer the epic's existing indicators as candidates before inventing a new one: "does one
of the epic's early-warning signals already cover this, or do we need a new one?"

**Challenge patterns — the five-part feature linter, asked as questions (all five must pass):**
- **Noticeable:** *"would users recognize this as a thing they got?"*
- **Vertical:** *"is this a slice of value or a layer of architecture?"* (a layer, component, or
  org-chart mirror fails)
- **Standalone-releasable:** *"if users loved only this, could we ship it alone and call it a
  win?"*
- **One need, one hypothesis:** listen for "and" across personas, benefits, or outcomes — that's
  two features. Two piles that produce the identical hypothesis are one feature, not two.
- **Instinct-sized:** *"what unit pops into your head — days, weeks, or months?"* Days means it's
  really a story; months means split it further. If its acceptance criteria would read as
  Given-When-Then, it's a story — demote it.

**Name the feature:** once the hypothesis and linter agree this pile is a real feature, distill its
intent phrase into a short noun phrase — the feature's `name`. Lint it against the same vague verbs
capability language gets checked for ("manage," "fast," "easy"); propose 2–3 candidates and let the
SME pick, never impose one (SME-ratifies-everything).

**Hubbard's two questions, before any size talk:**
- **Adoption:** *"who actually uses this, how many, how soon?"*
- **Kill:** *"what would make this built-but-unused?"* The answer is recorded verbatim as
  `features[].risk` — the SME's own words for the biggest built-but-unused risk.

**NFR routing rule (Gilb) — both halves:** every epic NFR's must-level is a cross-cutting
constraint, stamped onto every feature unquantified at this stage — it isn't a feature of its own.
But an NFR with a large gap between where things stand today and where it needs to be **does**
become its own candidate feature (e.g. "response-time hardening"), entering the coverage gate like
any other.

**Enabler/spike typing:** where a pile is genuinely infrastructure, architecture, compliance, or
exploration rather than user value, type it as an enabler — never force it into fake user voice.
Tie every enabler to the named value feature it enables. Spikes are for genuine "we don't know yet"
and are rate-limited — not every open question earns one.

**Go/no-go:** a pile with no defensible hypothesis after this thread gets merged into a neighbor,
re-cut, or parked with its evidence — not silently dropped. Label the surviving feature's evidence
status honestly — validated, some-evidence, assumption, or table-stakes — from the strength of the
capability cards it absorbed, not a guess.

**Jargon translation:** don't say "let's write the feature's value proposition." Say: *"Let's write
down the bet this piece makes — who gets what, and how we'd know it worked."*

**Anchor:** Jeff Gothelf / Josh Seiden (four-slot hypothesis, Who-Does-What-By-How-Much); Mike Cohn
(noticeable, instinct-size, GWT diagnostic); Dean Leffingwell / SAFe (vertical-slice rule, enabler
typing); Eric Ries (standalone-releasable zoom-in test); Douglas Hubbard (adoption/kill questions,
no ordinal scores); Tom Gilb (NFR routing rule); Marty Cagan (go/no-go).

---

## Coverage gate

**Definition:** the chain-validation analog from `refine-epic`, run both directions before the tree
is allowed to stand. Validates each feature's `outcomeLink` and `successSignal` against
`epicRef.businessOutcomes` and `epicRef.leadingIndicators`; moves orphaned capability cards toward
`parked`.

**Elicitation move — the two-way sweep:**
- **Per feature:** *"which Business Outcome does this serve, and which Leading Indicator should it
  move?"* A feature that answers neither is scope without a why — orphans get challenged, then
  parked with the SME's consent, not silently kept.
- **Per outcome:** *"which feature moves this?"* An epic outcome with no feature moving it is a
  gap — trigger a targeted divergent loop: *"what could move this measure?"* and mine for a new
  capability, not just a new label on an old one.

**Sufficiency close:** *"if every one of these landed, would the epic's benefit hypothesis be
proven? what's missing?"*

**Challenge patterns:** a decomposition where **everything survives** the sweep untouched is itself
suspicious — expect and welcome at least one parked item; if nothing got parked, ask again more
skeptically before moving on. Repair breaks in dialog before proceeding — a box-filled tree with a
broken outcome thread is a failure, not a pass.

**Jargon translation:** don't say "let's run traceability analysis." Say: *"Let's make sure
everything we've built connects back to why we're doing this, in both directions."*

**Anchor:** Tom Gilb (Impact Estimation table, run conversationally); Gojko Adzic (a deliverable
supporting no impact is a failure even if it works perfectly); Jeff Gothelf (sufficiency/lineage
check); Marty Cagan (everything-survives red flag).

---

## MVP partition

**Definition:** the smallest feature subset that would prove or disprove the epic's bet, tagged
apart from the rest with a named evidence checkpoint. Fills `features[].tags` (`mvp` |
`contingent`, plus `discover-first` where it applies) and the model's `evidenceCheckpoint`.

**Elicitation move:** *"which smallest set of these features would prove — or disprove — the
epic's bet?"* Tag that subset `mvp`; everything else is `contingent` — not cut, not deprioritized,
just not part of the first test.

**Name the evidence checkpoint:** give the persevere decision a name and a trigger — *"after the
MVP ships and we see [leading indicator], features X–Z get re-decided."* This is what turns the
rest of the tree from a backlog into a standing decision point.

**Discover-first flags:** ask, as plain questions (never scores), which 1–3 features' value is
least certain and would most change the plan if it turned out to be wrong: "which of these are we
least sure people actually want, in a way that would change what we do next?" Flag those
`discover-first`.

**Challenge pattern:** SME wants to put everything in the MVP → "if we could only test one belief
with the first release, which one matters most?" Keep narrowing until the subset is genuinely
minimal.

**The no-prioritization line — say it to the SME:** this skill sets no dates, no estimates, and no
ranking of any kind. If asked to rank: *"ranking happens later, with the whole team."*

**Jargon translation:** don't say "let's define the MVP scope." Say: *"Which of these, if we
shipped only them, would actually tell us whether the big idea is right?"*

**Anchor:** Eric Ries (pivot-or-persevere, MVP-as-hypothesis-test); Dean Leffingwell / SAFe
(Lean-Startup epic implementation); Marty Cagan (portfolio-of-bets honesty); Douglas Hubbard
(value-of-information triage, no ordinal scores).

---

## Story skeletons

**Definition:** depth-gradient story generation per feature — MVP features get 3–7 Cards,
contingent features get 1–2 coarse placeholders. Fills `features[].stories[].card` and `.kind`
(`walking-skeleton` | `variation` | `discovery` | `placeholder`).

**Elicitation move — walk the steps:** generate by walking the user's steps through the feature,
one at a time: *"what does [role] do first? then?"* The first pass through, start to finish, is
story #1 — the **walking-skeleton** path (Patton/Cockburn): the thinnest slice that exercises the
whole feature end to end.

**Challenge patterns — fan out variations via SPIDR**, each explained as a question, not jargon:
- **Spike** — is there something here genuinely unknown that needs a timeboxed investigation before
  the story can even be written?
- **Path** — besides the happy path, what's the next most common way this goes — an alternate route
  through the same feature?
- **Interface** — does this look different depending on how the role gets to it — a different
  device, channel, or system on the other end?
- **Data** — does a different shape or type of data change what has to happen here?
- **Rules** — is there a business rule or exception case that changes the outcome for a subset of
  cases?

**Discovery story:** for every feature that isn't pure table stakes, add exactly one
riskiest-assumption story — the cheapest possible way to test the shakiest belief before building
the real thing. It may be concierge, Wizard-of-Oz, or smoke-test-shaped; translate inline rather
than naming the technique: *"a cheap fake-door version to test demand before building."*

**Card form:** `As a <specific role>, I can <activity>, so that <benefit>` — one goal per card,
solution-free. No layering two goals into one card with "and."

**Sea-level QA:** *"could one person finish this in one sitting and go away happy?"* Smaller is a
detail worth folding back in; bigger is really a feature and belongs one level up.

**Hard rule:** every split is ratified by the SME, one decision per turn — the agent never
decomposes alone.

**Jargon translation:** don't say "let's write your acceptance criteria." Say: *"These are just
cards for now — the details come later, one feature at a time."*

**Anchor:** Mike Cohn (Card form, SPIDR); Jeff Patton / Alistair Cockburn (walking skeleton,
sea-level test); Dean Leffingwell / David Lawrence (splitting patterns); Eric Ries
(concierge/Wizard-of-Oz/smoke-test discovery stories); Roman Pichler (one goal per card).

---

## Synthesis & commitment close

**Definition:** play back the finished map, sweep new learning upstream, and close with the same
commitment-and-advancement questions that end `refine-epic`. Finalizes
`writeBacks.outOfScopeAdditions` and `writeBacks.openMeasurementsAdditions`, and closes with the
SME's confirmation of the whole model.

**Elicitation move:** play back the whole map in plain language — features in narrative order, each
with its need and its outcome, stories underneath — and let the SME correct anything that doesn't
sound right before it's final.

**Sweep new open measurements:** anything the interview surfaced that needs a baseline established,
or an assumption that still needs testing, gets added to the epic's Open Measurements rather than
left in the transcript.

**Challenge pattern:** SME says "looks fine" without engaging → point at one feature and ask them to
confirm or correct it specifically, rather than accepting a blanket yes.

**The three closing questions — ask all three, one per turn:**
- *"if only one feature could ship in month one, which part of your week should disappear first?"*
- *"who else touches this — should I talk to them?"*
- *"anything I should have asked?"*

**Jargon translation:** don't say "let's finalize the backlog." Say: *"Let's walk back through
everything we've built together and make sure it still sounds right."*

**Anchor:** Rob Fitzpatrick (commitment-and-advancement questions, internal-SME currency); Jeff
Patton (map played back, not a list); Jeff Gothelf (sufficiency check revisited at synthesis).

---

## Jargon translations

Cross-cutting say-this-not-that table for terms that recur across more than one phase:

| Jargon | Say this instead |
| --- | --- |
| Feature | "a chunk of this big idea that's worth shipping on its own" |
| Benefit hypothesis (feature-level) | "the bet this chunk makes, written so we could check it" |
| MVP | "the smallest set that tests whether the big bet is right" |
| Walking skeleton | "the thinnest end-to-end version that proves the whole path works" |
| Spike | "a small timeboxed investigation because we genuinely don't know yet" |
| Capability card | "card" |
| Affinity group | "pile" |

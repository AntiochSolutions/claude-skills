# Interview guide — refine-feature

Companion to `SKILL.md`. Question banks per phase, the triage rubric, repair moves, and the shared
quality machinery (lint battery, guards, ledger, glossary). Pick **exactly one** question per turn,
reflect back before the next, and translate every term of art the moment you use it. Questions are
stems, not scripts — adapt wording to the SME's own vocabulary, keep the *move* intact.

**The one-question rule applies to stems too:** a stem containing more than one question mark is a
**sequence of turns** — ask the first, hold the rest. Multi-part stems below are banks of sequential
moves, never one utterance.

## Intake & timing guard (phase 0)

- Opening (after the user picks a feature): *"I've got `F03 — <title>` open, with its <N> story
  cards. Before we sharpen it — when is the team likely to start building this?"*
- Not starting within a sprint or two → the timing guard, verbatim spirit: *"Honest warning: detail
  we write now will be stale by then — teams that refine far ahead end up re-doing the work. Want
  the light version today — we sharpen just the bet itself and stop — or the full pass anyway?"*
  - Light version = the **hypothesis-only pass**: run phase 2 only, write back `## Hypothesis`,
    leave `status: skeleton`, note the deferral in the knowledge-state note.
- Chain check (silent, on load): the feature has `## Hypothesis`, `## Success signal`,
  `## Outcome served`; its stories exist as one-line Cards. Anything structural missing → *"this
  skeleton is missing its <slot> — that's decompose-epic's job; let's run that first so we're not
  inventing the chain here."*
- Revisit (feature already `refined`): *"This one's been refined already. What do you want to
  change, and why?"* — work only that thread; re-run only the gate checks the change touches.
- Re-entry (feature `needs-discovery`): *"Last time this exited with a discovery brief. What did
  the tests find?"* — seed the triage with the answer; evidence upgraded → proceed; assumption
  refuted → park or reshape the feature with the SME.

## Four-risks triage (phase 1)

Rate each risk in plain language, seeded by the feature's `evidence` tag (`assumption` seeds value
risk high; `validated` seeds it low). One risk per turn, severity × consequence, then name the route.

- **Value** — *"If this shipped tomorrow, what tells you customers would actually use it?"* Follow
  with stakes: *"What have customers already paid, spent time on, or asked for in writing?"*
- **Usability** — *"Could the people this is for figure it out without you standing next to them?"*
- **Feasibility** — *"Does the team already know how to build this, or is there some magic in the
  middle?"* (The SME flags; the team answers — never resolve feasibility yourself.)
- **Viability** — *"Is there anyone — legal, finance, sales, support, a partner — who could veto
  this after it ships?"*
- Severity × consequence, plainly, as its own turn: *"If we're wrong about that, how bad is it?"*
  (A risk is allowed two turns — the probe, then the consequence. Two turns is fine; two questions
  in one turn never is.)
- Depth budget — differentiator vs commodity: *"Is this something you win deals with, or something
  you simply have to have?"* Differentiator earns the long conversation; commodity gets brisk.

**Routes (name yours out loud, one line):**
- All risks minor → **fast lane**: *"Nothing scary here — let's confirm the bet, put numbers on the
  signal, write one or two checks, glance at the story list, and be done in minutes."* The fast-lane
  set *glance* is one move: read the roll-up back and ask ONE question — *"at a glance, is anything
  here dead weight, or obviously missing?"* — record the answer as the hidden-waste flag in the
  knowledge-state report; never curate on the fast lane.
- Major value/viability risk **on assumption-grade evidence** → **discovery-brief exit**: *"Before
  anyone builds this, that assumption needs a cheap test. Let's write the discovery brief instead —
  it's the more useful artifact today."* On this route run phase 2 only far enough to state the bet
  being tested — full sharpening happens after discovery. (Output-template holds the brief format.)
- Otherwise → **full pass**, phases 2–7.

## Hypothesis sharpening (phase 2)

- Solution-shaped? Chunk up: *"Say the feature works perfectly — what will that get you that you
  don't already have?"* and the pixies test: *"If pixies delivered it overnight, what would be
  different in the morning?"*
- Re-anchor briefly on Cagan's four (time-boxed — the problem was refine-epic's job): business
  objective · key result · the problem in one crisp sentence · the customer it's for. If the SME
  can't state the problem without a feature list, pause and re-anchor once, then move on.
- Force **behavior-change form**: *"Who will start, stop, do more of, or do faster because of this —
  and by roughly how much?"* Pair the behavior change with the enabling system change.
- Evidence probes: *"When did that last happen — walk me through it?"* · *"How many customers have
  hit that this quarter?"* — tag every number **measured / SME-estimate / guess-to-verify**.

## Success signal (phase 3)

Climb the ladder one rung per turn. Hard rule: **bare direction words never survive** — "improve",
"increase", "faster" convert to two numeric points on a named scale or the signal isn't done.

1. **Scale** — *"What unit would we watch — for whom, doing what task, under what conditions?"*
   Offer the library so the SME picks rather than invents: task time · error rate per N ·
   % succeeding unaided within T · support contacts per week · latency percentile.
2. **Meter** — *"Who would actually measure that, how, over what sample?"* (Scalar with no Meter =
   not yet a signal.)
3. **Baseline** — *"Where is that number today?"* then Mom-Test it: *"Where did that number come
   from? How could we verify it?"* A flagged guess is allowed — tag it `guess-to-verify`.
4. **Target** — *"What number, by when, would make you call the bet won?"* (Precise and time-bound —
   say when you'll look.)
5. **Fail level** — *"Is there a number so low we'd call this a failure and stop?"* Pre-commit it
   now — draw the line in the sand before anything is built.

Impact-lite sanity probe (asked, never recorded as a score): *"Roughly what share of the epic's gap
does this one feature close — most of it, some, a sliver?"* A sliver invites the park conversation
later.

## Feature acceptance criteria (phase 4)

Never say "acceptance criteria" cold. Open: *"How will you confirm the bet paid off — what will you
look at, and what exactly should it show?"*

- **Dual test, every criterion:** it mitigates a named implementation risk OR enables early
  validation of the benefit hypothesis. Neither → reject: *"That one restates what the feature does —
  what would tell us it's working?"*
- Form: outside-in, "should" language, observable real-world effects, tagged value-to-whom
  ("valuable to the customer / to us / to the team").
- The skill proposes, the SME confirms — nothing enters unconfirmed.
- Run the lint battery (below) over every draft line.
- Append the humility note to the section, always: *"These confirm the bet is measurable — not that
  it will pay off. At least half of ideas don't work; that's why the signal has a Fail level."*

## NFR binding (phase 5)

ISO 25010 is your **internal** checklist only — performance, reliability, security, usability,
compatibility, maintainability — asked selectively, in business words, never as a survey.

- Opening probe: *"When this is at its busiest, what still has to be true for it to count as
  working?"*
- Divide and conquer each vague quality: *"'Reliable' how — never loses a signup, or never shows an
  error, or recovers fast when it breaks? Which 1–2 of those does THIS feature move?"*
- Breakpoints (per binding quality): *"What level would make it merely usable? What level would make
  you clearly better than the alternative? Past what level would nobody notice the difference?"*
- Quantify the winners: unit + number + Meter. **Budget: one quantified success signal + 2–4
  quantified NFR levels per feature — everything else stays checklist prose.**
- A quantified NFR the team might defer spawns a **defer-performance story pair** — "make it work"
  now, "meet the level" visible in the set — with the debt warning appended to the feature's
  `## Risk` line.

## Story-set curation (phase 6)

Open with the rationale, once: *"We'll keep every story to one line on purpose — detail written now
goes stale and boxes the team in; each card gets its own conversation later, just-in-time."* When
the SME offers detail: *"That's gold — I'm noting it on the card for that conversation"* (one-line
note; the Card itself never grows).

- **ADD** — walk the journey: *"First they …, then they … — have I missed a step?"* · outputs audit:
  enumerate the outputs the success signal depends on — *"which card produces that number?"* — every
  needed output gets a producing story · North's probe, repeated until answers fall out of scope:
  *"What's the next most important thing this still wouldn't do?"* · lifecycle sweep (setup, admin,
  reporting, teardown) and non-obvious roles (operations, support). New Cards: next free `S##`,
  `tags: [illustrative]`, `kind: variation` (`discovery` if it exists to test the riskiest
  assumption), SME-ratified one per turn.
- **SPLIT (coarse)** — triggers: "manage / control" verbs (CRUD hiding inside) · variation-hiding
  terms ("flexible dates") · a whole narrated workflow in one card · kite-level scope failing the
  sea-level lint (*one person, one goal, one sitting*). Split along Lawrence & Green lines (workflow
  steps · business-rule variations · simple-version-first · data variations · interface variations).
  Children are new one-line Cards (fresh `S##`, `kind: variation`); the parent goes
  `status: superseded` with a "Split into …" line. **No AC, no sizing — coarse means coarse.**
  **Postcondition gate on every split:** each child is a vertical slice (a user action AND a system
  response), at least one child is deprioritizable, there's an obvious first story;
  layer/phase/discipline splits are hard-blocked.
- **PARK** — the spine question: *"Are there stories here we could deprioritize or delete?"* A set
  where everything is mandatory hides waste. Objective trigger: a story contributing ~zero to the
  success signal. Before parking on weak enthusiasm: *"Is that because nobody needs it — or because
  this solution shape is wrong?"* Parking is celebrated: *"'Not now' is a decision we get to keep."*
  `status: parked` + one-line reason, always. A want proposed and declined in the same breath is
  still minted — a fresh Card written directly at `status: parked` with its reason; scope
  conservation applies to proposals too.
- **REPAIR** — pseudo-stories (tasks or components wearing story syntax: *"As a developer, I want a
  database diagram…"*) are **recombined** into one good, if large, starting story before any split;
  fish-level fragments merge into their sea-level parent. Recombined-away fragments go
  `status: superseded`, pointing at the new Card.

**First slice** — the triple test, asked as three quick checks: not too big (*"could a couple of
people land it in a sprint?"*) · not too obvious (*"does it touch the scariest risk or the core
complexity, so it actually teaches us something?"*) · not too fuzzy (*"is it concrete enough to
start Monday?"*). The nominee takes `order: 1` and the `First slice:` line in the roll-up.

The capacity-bet question is available here for what it reveals — *"could the team fit six to ten
like this in a sprint?"* — hesitation exposes hidden size assumptions. **Its answer is never
persisted.**

## Dependencies, risks & deferrals (phase 7)

- **Feature Mining, four lists** — Impact ("what's the win?") · Bigness ("what makes it big?") ·
  Risks · Uncertainties — then the mining stem, verbatim: *"How can we get this top impact without
  taking on all this bigness? What if we just…?"*
- **Viability sweep:** *"Who has to say yes for this to actually ship and stay shipped — legal,
  finance, sales, support, a partner?"* Produce the named list.
- **The ethical question**, asked once on every full pass: *"Is there any way this could harm
  customers — or anyone else — that we should name now?"*
- **Feasibility/usability unknowns:** capture the SME's words verbatim and route them to the
  team/designer as open items. Never answer them yourself; never let the SME guess at them.
- **Real Options ledger** — for decisions nobody can make today: *"What would have to be true for
  this to become decidable?"* → entry: `Decide when <condition> — expires <date/event>`. A forced
  guess is worse than a logged deferral.
- **Look-ahead:** *"Is there a slow question — legal, another department, a vendor — we should fire
  off today so the answer is cooking before the story conversations need it?"*

## Shared quality machinery

**Vague-word lint battery** — run over every drafted criterion (feature AC and quantified NFR
lines). Scope: **drafted criteria only** — never the Scale/Meter fields or the scale library, whose
items legitimately contain stop-words ("support contacts/week"); *and/or* means the literal token
(bare conjunctions belong to the fused-AC check). The stop-list, canonical and complete:

> just · appropriate · right · best · worst · all combinations · most · least · any of · don't care ·
> I'll-know-it-when-I-see-it · fun · easy · user-friendly · simple · fast · quickly · efficient ·
> several · improved · better · minimize · maximize · seamless · intuitive · robust · flexible ·
> secure · scalable · reliable · accurate · nice · clean · support · should-if-possible · and/or ·
> etc.

Each hit auto-generates the next SME question — convert to a number, an example, or an explicit
decision: *"You said 'appropriate' — appropriate according to whom, and what would it be in THIS
case?"* Don't delete negotiability; frame it with a boundary.

**Guards** (run with the battery over every drafted line):
- **Guru-Checks-Output:** reject "correctly / appropriately / gracefully / as expected" — expected
  answers are stated up front, even hand-computed.
- **Customer-visible only:** outcomes in terms of what someone observes — displays, reports,
  balances, behavior — never widgets, endpoints, or table names. Named roles, never "the User".
- **Ends/means:** a solution stated as a criterion gets *"if it worked perfectly, what would be
  different, by how much?"* — the result becomes the criterion; the solution becomes a design note,
  or a labeled constraint if genuinely mandated.
- **Criteria checks:** reject criteria that restate the card, embed whole workflows, or smuggle new
  requirements — smuggled requirements become new one-line Cards routed into the story set.
- **Fused-AC detection:** a conjunction lumping two requirements into one line → split the line.
- **"Call me when you're done":** mentally append it to the criterion — if you'd be nervous getting
  that call, it needs elaboration.

**Provenance tags** — every number that **enters the artifact** carries one: `measured` (points at
a source) · `SME-estimate` (experienced judgment, no source) · `guess-to-verify` (flagged for
instrumentation). Numbers that stay conversational stay unwritten — untagged means unwritten, never
tag-free in the file.

**Jargon translations** (teach inline, one plain sentence, the moment a term is needed):
- *benefit hypothesis* → "the bet we're making — who changes their behavior, and what we win if
  they do"
- *success signal* → "the number that tells us the bet paid off"
- *acceptance criteria* → open with "what needs to be true for you to consider this done?"
- *vertical slice* → "a thin but complete version someone could actually use"
- *walking skeleton* → "the thinnest end-to-end path that proves the whole thing hangs together"
- *spike* → "a small time-boxed investigation we throw away"
- *NFR* → "how well it has to work, not what it does"
- *parked* → "not now — kept, with the reason, so we can change our minds cheaply"

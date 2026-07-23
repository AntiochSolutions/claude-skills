# Interview guide — refine-story

Companion to `SKILL.md`. The turn-selection algorithm, question banks per phase, drafting lints, and
the shared quality machinery. Pick **exactly one** question per turn, reflect back before the next,
and translate every term of art the moment you use it. Questions are stems, not scripts — adapt the
wording to the SME's vocabulary, keep the *move* intact.

**The one-question rule applies to stems too:** a stem containing more than one question mark is a
**sequence of turns** — ask the first, hold the rest; follow-ups like *"…is there more?"* are their
own turn. Multi-part stems below are banks of sequential moves, never one utterance.

**Delivery:** decision questions (ratifications, gates, trade-offs) go out as single-tab
AskUserQuestion calls — shape, the evidence-question carve-out, and the no-tool fallback are in
`tabbed-questions.md` (this folder). Evidence questions stay open spoken prose.

## Entry checks (phase 0)

- Opening (after the user picks a story): *"I've got `S07 — <title>` open — the card says: <Card
  line>. Still the story you want to take to ready?"*
- **Narrative-slot audit**, repaired conversationally, one slot per turn:
  - Title an activity with a knowable end state? A noun-pile like "Account management" →
    *"What would someone actually be doing — and how would they know they were done?"*
  - Role a real person? *"Who, by name or by job, would I call to watch them do this?"* ("The
    user" is banned. A generic role passes when the story truly applies to anyone in that
    situation — "a new user" at signup IS everyone; it fails when a specific hat is hiding — "the
    user approves invoices" → the finance approver. Entry-check repairs are recorded in
    `## Conversation notes`; the Card line itself never changes — a Card too broken to stand
    routes to refine-feature curation instead.)
  - Benefit stated? *"…so that what? What do they get?"*
- **Pseudo-story bounce:** a task or component in story syntax (*"As a developer, I want a database
  diagram…"*) → *"This one's a piece of the how, not a story someone lives — it belongs at the
  feature level. Let's route it back to the feature's curation rather than decorate it here."* End
  the session; no status change; say exactly where it went.
- **Complexity score**, asked plainly (never say "Cynefin" or "complexity score"): *"Has anyone on
  your team — or in your company, or anywhere you know of — done this before?"*
  - Everyone does it / we've done it → **1–2, fast pass**: value anchor + happy-path confirm + a
    rule-line checklist Confirmation; the mining loop and sweeps are skipped and the knowledge-state
    report says so.
  - Someone has, not us → **3, full conversation** (the sweet spot — phases 1–6 in full).
  - Nobody has / answers keep contradicting → **4–5**: proceed, but the Confirmation scopes to what
    IS known — a clear hypothesis plus the checks for the **first probe** — and every blocking
    question lands **verbatim** in the Known-Unknowns block with an owner. At most, recommend the
    team consider a timeboxed investigation. Never fabricate criteria for the unknown.
  - Mid-conversation upgrades count: the SME can't produce an example, answers contradict, "it
    depends" with no nameable "on what", every question spawning three more → re-score out loud.
- **Complicated vs complex** sets Confirmation depth: complicated (knowable with expertise) → full
  adaptive Confirmation; complex (only probing will tell) → never padded into speculative criteria.
- Name the route out loud in one line before phase 1 — in plain words (*"this one's well-trodden —
  quick pass"* · *"someone's done this, we haven't — let's mine it properly"* · *"this is genuinely
  uncharted — we'll scope today to the first probe"*), never "complexity score" jargon.

## Value anchor (phase 1)

- The output question, verbatim spirit: *"Forget the screens for a second — what has to come OUT of
  this so that <benefit clause> actually happens?"*
- Probe the so-that once: *"And what does that get <role>?"* — follow-up turn if the answer floats:
  *"if it worked perfectly, what's different?"*
- Re-anchor to the feature: *"This card lives under `F03 — <feature title>`, whose bet is <feature
  hypothesis one-liner>. Does this story still serve that bet?"*
- **Park-back trigger:** no confirmable output or benefit after honest probing → *"I can't find the
  value thread on this one, and decorating it won't create one. I'll park it back to the feature
  with that reason — refine-feature is where it gets rethought or dropped."* (`status: parked` +
  reason; end the session with the one-line report.)

## Context & happy path (phase 2)

- Story-first, Mom Test: *"Walk me through the last time this actually happened — the real one, with
  the actual names and numbers."*
- Understanding questions only while they narrate: *"then what happened?"* · *"who did that?"* ·
  *"where did that number come from?"* Never propose, never fix, never yes-and.
- Capture the happy path as numbered steps, read it back, and confirm.
- The **scope fence** accumulates for free: anything the SME proposes and then rejects, and anything
  you both agree is out, goes straight onto the scope-out list — you'll spend it in the
  `Not in this story:` line.

## Rule & example mining (phase 3 — the core loop)

Classify **every** SME answer as a **rule**, an **example**, or a **question**; the classification
picks your next move by this priority (top wins):

1. **Unillustrated rule** → *"Give me an example — a real one, from last month, with the actual
   numbers."*
2. **Unexplained example** → state the implied rule back and hunt refutation — **Break the Model**:
   *"So the rule seems to be X — can you think of a time that wouldn't hold?"* Include the
   negate-a-Given move: *"you said it can always identify the account — what happens when it
   can't?"* Stop attacking a rule after **two consecutive failed breaks**.
3. **Number, date, or limit mentioned** → boundary probe: *"exactly 50? what happens at 49.99 — and
   at 50.01?"*
4. **Hedge or "it depends"** → *"Give me an example that shows the uncertainty — a case where it
   could go either way."* Never resolve ambiguity by guessing.
5. **Question nobody present can answer** → **red card**: *"Great question none of us can answer —
   who WOULD know?"* Log it with the named owner and move on. Red cards are never debated.
6. **Vague-word trigger fired** (see the battery below) → the word becomes the next question:
   *"You said 'appropriate' — appropriate according to whom, and what would it be in THIS example?"*
7. **Rule pile stable** → the invented-tricky-case probe: construct a plausible awkward case from
   the rules you have and ask *"what happens next?"* — surprise reveals gaps better than "any other
   edge cases?" ever will.

**Missing-amigos hat rotation** — the tester and developer aren't in the room; you rotate their hats
in **labeled turns** (say the label out loud):
- *Tester hat:* *"What's the worst thing that could happen here?"* — then, as its own turn:
  *"…is there more?"*
- *Developer hat:* *"What should the system do in this exact case?"* — an SME's *"I've never thought
  about that"* is a **red card**, not a defect; celebrate the catch.
- Perspectives you cannot simulate — feasibility, UX, data, security — are **flagged as open items
  with owners, never invented**.

## Sweeps (phase 4)

- **Extension-condition walk:** step the confirmed happy path one step per turn — *"at step 3, what
  could go differently?"*
- **0 / 1 / many / duplicates** on anything plural, one case per turn: *"what if there are none?"*
  → *"exactly one?"* → *"five hundred?"* → *"two identical ones?"*
- **7-dimensions closing sweep** (internal checklist — user, action, data, rules, interface,
  environment, quality): at most **two questions** on dimensions the conversation never touched,
  deliberately including **Control** (*"who's allowed to do this — and who absolutely isn't?"*) and
  **Quality Attribute** (*"how well does this have to work — how fast, how accurate, how often can
  it fail?"*).
- **Exploration health check:** if the session has produced **zero out-of-scope decisions**, you
  probably under-explored — run one more divergence pass before drafting.

## Confirmation drafting (phase 5)

**First, the refine-the-specification pass** (announce it: *"let me tidy what we've got before I
read it back"*): strip incidental values (names/dates that don't change the outcome), name hidden
domain concepts the examples revealed (*"you keep saying 'a clean account' — let's define it
once"*), and keep **only the differences that matter**. Never draft Given-When-Then live during
mining — discovery and formulation are separate activities.

**Routing rules, in decision order:**
1. **Checklist (default).** A rule stated as one clear line is a first-class Confirmation. Escalate
   only where an example is needed to test shared understanding.
2. **Example table** — when cases **share structure and differ only in values** (calculations,
   rates, categorization, data rules). *"Do you already have a spreadsheet or a report with real
   cases?"* — harvest it before inventing rows. 3–7 rows per rule including **≥1 boundary** and
   **≥1 counter-example**; every row carries input AND expected result; bulk just-in-case data is
   banished.
3. **Given-When-Then** — when the **context or event itself differs** (distinct behaviors or state
   changes). Hard lints, every scenario: exactly **one When** · Givens are all of, and no more than,
   the required context · every Then is a "should" statement, challenged once (*"should it? always,
   or only when…?"*) · one business rule per scenario · titles state only how scenarios differ ·
   business language only, **zero UI mechanics**.
4. **Scalar qualities never hide as adjectives** — anything answering "how well / fast / accurate /
   many" carries unit + number + Meter, hosted in the checklist.
5. **UI/interaction detail** → a pointer to a sketch or mockup, never prose.

Every Confirmation ends with a **`Not in this story:`** line (spend the scope fence here — including
anything peeled to a new Card), and **every line traces to an SME statement or an SME-confirmed
proposal** — you propose, nothing enters unconfirmed. Run the full lint battery (below) over every
draft, then read the draft back for criticism, not applause.

## INVEST & split (phase 6)

Asymmetric by design — I/N/V arrived upstream-guaranteed and get **one light probe each**:
- **I** — overlap check: *"could the team build this without waiting on another card?"*
- **N** — not-a-contract check: *"if the team finds a better way mid-sprint, is anything here they
  must not change?"*
- **V** — value-to-whom check: *"who notices when this lands?"*

**E/S/T get the full engines:**
- **E — Estimable = understanding, never a number.** *"Could your team say what this involves —
  not how long, just what?"* On failure, route three ways: unclear business rules → keep conversing
  (this skill's job) · unknown technology/approach → flag for the team as an open item · sheer
  size → the S path.
- **S — Small.** Try the **intensity dial** first: same headline, move the elaborate bullets to a
  later version. Size probes without estimates: the **capacity-bet** — *"could the team fit six to
  ten like this in a sprint?"* (hesitation exposes hidden size; **the answer is never persisted**) —
  and the **scenario-count tripwire**: at ~5–6 scenarios, propose a split, never a sixth scenario.
- **T — Testable = the any-input/agreed-output drill.** Walk one concrete case to its expected
  result: *"I hand it <this exact input> — what exactly comes out?"* On failure, classify into the
  **six troubles**, each with its own next move:

  | Trouble | Looks like | Next move |
  | --- | --- | --- |
  | Magic | "it just knows" | ask for the rule behind the magic |
  | Intentional fuzziness | "roughly right is fine" | frame the fuzz with a boundary the SME owns |
  | Computational infeasibility | can't be checked in practice | agree a checkable proxy |
  | Non-determinism | same input, different outputs | pin the conditions that differ |
  | Subjectivity | "when it feels right" | name the judge: who decides, by what visible sign |
  | Research project | nobody can know yet | Known-Unknowns block, owner, first probe |

  Testable also means: anything scalar has a Meter.

**Split protocol** (when Small fails and the dial wasn't enough):
1. **Compound vs complex first** — multiple goals hiding in one card → one goal per story.
2. **Preferred seam:** peel the coherent rule/scenario groups the conversation already revealed into
   new one-line Cards (fresh `S##`, `kind: variation`). **A peel narrows the parent Card's scope —
   it never supersedes the parent.** Peeled Cards inherit the benefit clause and route back into the
   feature's story set; the parent's `Not in this story:` line names them.
3. **Fallback menus:** workflow steps · business-rule variations · simplest-version-first · data
   variations · interface variations; or value-first (narrow the segment → examples of usefulness →
   dummy-then-dynamic → simplify outputs).
4. **Postcondition gate, every split:** each child is a vertical slice (a user action AND a system
   response) · at least one child is deprioritizable · there's an obvious first story.
   Layer/phase/discipline splits are hard-blocked.

## The gate (Demo-and-Read-Back)

Run route-calibrated, per `SKILL.md`; the asks, verbatim spirit:
- **(a)** *"Narrate the demo for me — it's three weeks from now and this story is done. What do you
  show, click by click, number by number?"* Map every narrated moment to a Confirmation item and
  every item to a moment; mismatches are repairs, now.
- **(b)** Read only the titles back: *"do any two of these sound like the same thing to you?"* and
  watch for *"what about…"* — a missing title spawns one. **Except on a score-4–5 story:** a
  "what about" beyond the first probe routes to Known-Unknowns instead of spawning a criterion —
  never-pad wins.
- **(c)** *"Can you say: yes, that's exactly what I mean?"* Hesitation is a defect in the artifact —
  find the word the SME wouldn't own and replace it with theirs.
- **(d)** Vital filter, per criterion: *"if this one failed, would you reject the story?"* Not
  reject-worthy → it's a note, not a criterion. Count **rules, not rows** — an example table or a
  scenario pair confirming one rule is one criterion. On a small checklist, run (d) as one
  read-through.
- **(e)** *"Last one: what are we most likely to be wrong about?"* → Known-Unknowns, named owners.

## Shared quality machinery

**Vague-word lint battery** — run over every drafted Confirmation line (checklist lines, table
expected-results, Then clauses). Scope: **drafted criteria only** — never the Meter fields, whose
text legitimately contains stop-words ("support contacts/week"); *and/or* means the literal token
(bare conjunctions belong to the fused-AC check). The stop-list, canonical and complete:

> just · appropriate · right · best · worst · all combinations · most · least · any of · don't care ·
> I'll-know-it-when-I-see-it · fun · easy · user-friendly · simple · fast · quickly · efficient ·
> several · improved · better · minimize · maximize · seamless · intuitive · robust · flexible ·
> secure · scalable · reliable · accurate · nice · clean · support · should-if-possible · and/or ·
> etc.

Each hit auto-generates the next SME question — convert to a number, an example, or an explicit
decision: *"You said 'appropriate' — appropriate according to whom, and what would it be in THIS
example?"* Don't delete negotiability; frame it with a boundary.

**Guards** (run with the battery over every drafted line):
- **Guru-Checks-Output:** reject "correctly / appropriately / gracefully / as expected" — expected
  answers are stated up front, even hand-computed.
- **Customer-visible only:** outcomes in terms of what someone observes — displays, reports,
  balances, behavior — never widgets, endpoints, or table names. Named roles, never "the User".
- **Ends/means:** a solution stated as a criterion gets *"if it worked perfectly, what would be
  different, by how much?"* — the result becomes the criterion; the solution becomes a design note,
  or a labeled constraint if genuinely mandated.
- **Criteria checks:** reject criteria that restate the card, embed whole workflows, or smuggle new
  requirements — smuggled requirements become new one-line Cards routed into the feature's story
  set.
- **Fused-AC detection:** a conjunction lumping two requirements into one line → split the line.
- **"Call me when you're done":** mentally append it to the criterion — if you'd be nervous getting
  that call, it needs elaboration.

**Provenance tags** — every number that **enters the artifact** carries one: `measured` (points at
a source) · `SME-estimate` (experienced judgment, no source) · `guess-to-verify` (flagged for
instrumentation). Numbers that stay conversational stay unwritten — untagged means unwritten, never
tag-free in the file.

**Jargon translations** (teach inline, one plain sentence, the moment a term is needed):
- *acceptance criteria* → open with "what needs to be true for you to consider this done?" and the
  pivot "how will you confirm we've done what you need — what will you look at, and what exactly
  should it show?"
- *Given-When-Then* → "a concrete example written as: the starting situation, the one action, and
  what should happen"
- *scenario* → "one concrete example of the rule at work"
- *red card* → "a question none of us can answer right now — parked with the name of who can"
- *vertical slice* → "a thin but complete version someone could actually use"
- *spike / timeboxed investigation* → "a small, throwaway experiment to answer one question"
- *walking skeleton* → "the thinnest end-to-end path that proves the whole thing hangs together"
- *Meter* → "who measures it, how, over what sample"

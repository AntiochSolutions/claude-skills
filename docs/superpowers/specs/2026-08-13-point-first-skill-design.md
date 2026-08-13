# point-first — an always-on clarity skill

**Date:** 2026-08-13
**Status:** final — three owner rulings recorded 2026-08-13; published.

## What this is

A marketplace plugin, **point-first**, that makes a Claude instance write replies a person
can read once. It carries six writing rules, injects them into every session, and turns any
sign of reader confusion into a rewrite instead of an expansion.

It ships from this repository. Anyone who installs it gets the behavior in every project;
nothing in it refers to any private repository or to any one user.

## The problem, and the proof it is real

A reply that needs a second reading has failed, and the failure is common enough that three
separate customers raised it about Claude's output in Antioch products. The originating
diagnosis found seven distinct faults in a single seventy-eight-word paragraph. Reading-grade
formulas cannot catch these faults — measured rank correlation between judged clarity and
Coleman-Liau grade is about +0.29 — so the fix has to be judgment applied by the model
itself, which is what a skill is.

The six rules are not new. They are the conversation half of `docs/writing-rules.md` in the
backlogbuilder repository, where they were diagnosed from real prose and have run as global
instructions since 2026-08-11. This plugin is their public, generalized form.

## Shape

```
plugins/point-first/
  .claude-plugin/plugin.json      manifest, MIT, keywords
  skills/point-first/SKILL.md     the six rules — the single source
  hooks/hooks.json                SessionStart hook
  hooks/inject.mjs                prints SKILL.md to stdout (node, cross-platform)
  commands/restate.md             the /restate command
```

Plus one entry in `.claude-plugin/marketplace.json`.

**Always-on is mechanical, not requested.** The SessionStart hook prints SKILL.md into
context at the start of every session. A description-triggered skill would depend on the
model choosing to invoke it, which is the exact weakness the rules were written to close.
The hook reads the same SKILL.md the Skill tool serves — one source, no internal copy.

## Content of SKILL.md

The six rules, each with a one-line test and a fail/pass pair. Every example is
self-contained — no story IDs, no feature IDs, nothing a stranger cannot follow.

1. **Point first.** The first sentence of the reply, and of each paragraph, is the
   conclusion. Test: can the reader stop there and still have the point?
2. **One idea per sentence.** "Because" and "and" in one sentence is two sentences. About
   25 words max. Test: read aloud; a mid-sentence breath means split it.
3. **Lists are lists.** Never a series inside a sentence — options, steps, or attributes.
   Test: more than one "or" means it is a list.
4. **Plain words only.** No metaphor where a plain word exists; no word whose everyday
   meaning differs from the intended one. A project's own process vocabulary counts as
   metaphor to an outsider. Test: would the reader stop at any word?
5. **Restate, then cite.** When a sentence's meaning depends on a reference, state the
   meaning, then give the pointer. Bare pointers are fine for pure navigation. Test: could
   someone who has not read the referenced thing follow the sentence?
6. **Benefit lands with a human.** A stated benefit accrues to a person, never to a
   subsystem or the product. Test: name the person who is better off.

Rules 1–4 govern every reply. Rules 5 and 6 apply whenever a reference or a benefit
appears.

Two more sections:

- **The restate protocol** (below).
- **A red-flags table** naming the rationalizations an instance uses to drift: "this topic
  is genuinely complex", "the user is technical, jargon is fine", "I need to show my
  reasoning", "a caveat first is more honest".

One counterweight, stated in the skill: clarity beats brevity. A short vague sentence — a
bare pronoun for something last named three turns ago — fails rule 4 even though it is
short. The rules compress padding, never information.

## The restate protocol

**Any signal that the reader is lost means the previous reply failed. The response is a
rewrite of that reply, not an elaboration on it.** This inverts the default: an instance's
reflex on "I don't understand" is to add words. The protocol:

- Triggers: "huh?", "what?", "unclear", "I don't follow", the user re-asking what was just
  answered, or any equivalent in their own words.
- Action: rewrite the previous reply under the six rules — shorter, point first, plainer.
- Never: an apology, an account of what went wrong, or a longer version.

**/restate** is the explicit path to the same rewrite. It exists for certainty and for
discoverability — a user who sees it in autocomplete learns the behavior is available. Both
layers produce identical output; the command is not a stronger version.

## Canonicality

The skill is a derived statement, not a copy, so byte-sync does not apply.
`docs/writing-rules.md` in backlogbuilder remains canonical; its "Copies, and which one
wins" section gains one line naming this plugin (a follow-up commit there, on main). The
skill carries a one-line provenance note pointing back. If the rules themselves change,
they change there first.

## The claim, and the publishing standard — final, 2026-08-13

**The plugin publishes on its field evidence, and every shipped text states mechanism,
not outcome.** Dan's ruling after three eval designs failed — one by its own run, two in
fresh-context design review (four DEFICIENT verdicts). The reviews established a
structural pincer no cheap synthetic eval escapes:

- Hand the instance the content and the test is trivially easy — a bare frontier
  instance edits a faulted draft clean (measured: RED v1, 0 of 7 faults survived).
- Let the instance compose and the two arms stop being content-matched — a
  rules-injected reply that drops the reasons grades as perfectly clear while serving
  the reader worse, so "clearer" is not what the instrument measures.
- Rules that ship with worked examples make template-matching indistinguishable from
  rule-following on any example-adjacent topic.
- The condition the field complaints came from — long, loaded sessions — is the one
  condition no in-session eval reproduces.

What publishing rests on instead: three customers raised the same complaint about
Claude's output in Antioch products; the originating diagnosis found seven faults in one
seventy-eight-word paragraph; the rules have run as live global instructions since
2026-08-11. What the texts may say: what the plugin does (injects the rules each
session; /restate rewrites the previous reply shorter and plainer) and where the rules
came from. No universal outcome sentence.

**The behavioral eval is deferred, not abandoned.** The honest instrument is the
session-replay corpus already on the backlogbuilder telemetry backlog: real loaded-
session replies, re-run with and without injection, graded on content-matched pairs.
When that corpus exists, this section gains its successor.

The eval attempts and their falsifications are preserved in
`docs/superpowers/evidence/2026-08-13-point-first-seeded.md` and in the fixtures under
`tests/fixtures/point-first/` — kept as the record of why this standard is what it is.

### Superseded — the v3 proof plan (kept for the record; killed in review)

#### The claim, and the proof plan — v3, injection versus nothing

*Amended twice on 2026-08-13, both on Dan's rulings. Version 1 (edit a faulted draft)
was falsified by its own RED run: 0 of 7 faults survived a bare instance. Version 2
(composition under load) was falsified in design review before it ran: its six scenarios
were built from the skill's own worked examples, so the injected rules contained each
fixture's answer; its thresholds, guards and effort condition also failed review. Both
falsifications are recorded in `docs/superpowers/evidence/2026-08-13-point-first-seeded.md`
and the plan's gate ledger.*

**The claim the plugin ships is the deployment claim: injecting these rules at session
start produces clearer replies than injecting nothing.** No shipped text claims every
reply becomes readable once — seven fixtures cannot support a universal sentence, and
the install decision is the injection decision anyway. All description texts (SKILL.md
frontmatter, plugin.json, marketplace entry, README row) carry the deployment claim.

The marketplace entry does not land until this passes:

1. **Six rule scenarios plus one restate scenario, topics disjoint from SKILL.md.** No
   scenario shares subject matter with any SKILL.md example. No scenario states its own
   pass condition (no "for that reader", no "who has not read X"). Option-set notes
   arrive as prose, not bullets. Three additional held-out scenarios are written and
   sealed — used only to detect overfit if the skill text is ever sharpened.
2. **Matched arms, paired runs.** Each rule scenario runs twice per arm (RED bare,
   GREEN = SKILL.md body injected as the hook would), same low reasoning effort, same
   self-contained prompt, same no-tools line. The restate scenario is a separate claim:
   it tests the protocol, runs GREEN-only, twice.
3. **Guards, all mechanical:** the runner never grades a null, empty, or non-answer
   reply (graders can return NOT_AN_ANSWER; such runs retry once, then count as
   invalid, never as fault-absent); every instance transcript must show low effort
   actually applied or its run is invalid; the post-run audit greps instance
   transcripts for tool use and rules text.
4. **RED validity (instrument, not verdict):** at least 4 of 6 rule scenarios show
   their fault in at least one valid RED run. Below that, the run stops and the
   finding goes to Dan as an instrument result — it is per-rule information, not proof
   the skill lacks justification.
5. **GREEN publish gate:** every valid GREEN run of every rule scenario is fault-free,
   at least 10 of 12 GREEN runs are valid, and every scenario that faulted in RED is
   clean in GREEN. The restate scenario passes both its runs (shorter rewrite, no
   apology, no expansion).
6. **Sharpening is bounded:** at most two rounds, touching only rule text and examples;
   no word appearing in any fixture scenario may be introduced into SKILL.md; RED
   re-runs for any rule whose text changed; the three held-out scenarios must stay
   clean after any sharpening, or the sharpening is reverted and the failure reported.

Evidence lands in `docs/superpowers/evidence/` with the date, matching house practice.

## Out of scope

- The store-file writing register, the SME-playback and fresh-eyes gates, and the card
  tooling — those are the product half of writing-rules.md and stay in backlogbuilder.
- Personal formatting rules (no backticks, screen-size constraints) — user-specific, not
  shippable.
- Any recovery phrase that must be learned. The protocol triggers on natural language;
  /restate is the only named surface.

## Decisions locked in conversation, 2026-08-13

- Audience: all of Dan's projects and any installer's projects.
- Always-on only, via SessionStart hook; no behavior gated on the model choosing to load.
- Restate: both layers — natural signals and /restate.
- Home: this repository, as plugin point-first.
- After eval v1's falsification: redesign to composition under load, rerun (2026-08-13).
- After eval v2's design review (two DEFICIENT verdicts): the plugin ships the
  deployment claim — injection beats no injection — and the proof standard is the v3
  eval, re-gated before build (2026-08-13).
- After eval v3's design review (two more DEFICIENT verdicts; the synthetic-eval pincer
  established): publish on field evidence with mechanism-only texts; the behavioral
  eval moves to the session-replay corpus (2026-08-13, final).

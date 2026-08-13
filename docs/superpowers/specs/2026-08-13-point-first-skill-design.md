# point-first — an always-on clarity skill

**Date:** 2026-08-13
**Status:** approved in conversation, pending Dan's review of this file

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

## Proof plan — seeded-fault eval, RED then GREEN

The marketplace entry does not land until this passes.

1. Write fixture replies: clean answers to realistic prompts, then seed each with one
   fault per rule — six faulted fixtures minimum, stored in `tests/fixtures/point-first/`.
2. **RED:** a fresh instance without the skill, asked to respond in each scenario, leaves
   the faults (or produces equivalents). Record the transcript.
3. **GREEN:** a fresh instance with the skill injected catches and rewrites every seeded
   fault. Record the transcript.
4. The restate protocol gets its own fixture: a confused user turn, where GREEN is a
   rewrite that is shorter than the original and RED is an elaboration.

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

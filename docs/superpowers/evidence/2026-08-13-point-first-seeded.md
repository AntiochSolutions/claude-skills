# point-first seeded-fault eval — 2026-08-13

Method: docs/superpowers/specs/2026-08-13-point-first-skill-design.md, Proof plan.
RED = subagent with no rules given, asked to send the best version of a faulted draft
(R1–R6) or to respond to "I don't follow" (R7). One fresh grader per reply, given only
the reply and the fixture's grader question. Grader PASS = the seeded fault is ABSENT
from the reply (the instance removed it); FAIL = the fault survived.

## RED — bare instance

| Fixture | Verdict | Grader's quoted evidence |
| --- | --- | --- |
| R1 point-first | PASS (fault removed) | "No — the export did not run last night." is the first sentence and directly answers the question. |
| R2 one-idea | PASS (fault removed) | Longest sentence carries one claim; no sentence joins two claims with and/which/so. |
| R3 lists | PASS (fault removed) | Options appear as a numbered list of three items. |
| R4 plain-words | PASS (fault removed) | "The process that loads signup data stopped on Sunday… catching up on the missing days." No metaphor or engineering vocabulary remains. |
| R5 restate-cite | PASS (fault removed) | "Files go in object storage." The decision is stated before the ADR-19 pointer. |
| R6 benefit-human | PASS (fault removed) | Beneficiary is the person addressed: "Your changes now save automatically…" |
| R7 restate-protocol | PASS (fault removed) | Response ~73 words vs 112, opens with the conclusion, no apology, rewrite not expansion. |

RED result: **0 of 7 faults survived.** The plan's validity gate required at least 4 of 7
to survive. **The gate is not met. Execution stopped before GREEN (Task 6) and publish
(Task 7), per the plan.**

## Why this number cannot be taken at face value, and why it still stands

**Three of the seven RED instances were not bare.** The eval ran as workflow subagents
with tool access, working directory inside a repository whose docs contain the rule set.
Transcript audit: the R2, R4 and R6 instances each made ~10 tool calls, found
docs/writing-rules.md on their own, and read it before replying. Their PASSes are
contaminated.

**The other four were bare and still passed.** R1, R3, R5 and R7 made no exploratory
tool calls, had no rules text in context, and still removed their seeded faults. The
result survives the contamination.

Conditions that plausibly produced the ceiling:

- The fixtures hand the instance a faulted draft and ask for "the best version" — an
  editing stance. The production complaint is about replies an instance composes itself,
  mid-task, while its attention is on the substance. Editing a bad draft cold is the
  easiest form of the problem.
- The instances ran one-shot, single-task, empty context, at high reasoning effort. The
  documented field failures (seven faults in seventy-eight words, 2026-08-11; two
  corrections in one working session, 2026-08-12) came from long, loaded sessions.

## Classification

Assumption-invalidating, not surface. The falsified assumption is the proof design's
precondition: that edit-a-draft fixtures in clean conditions elicit the failure mode the
skill exists to prevent. Everything downstream of that assumption is stopped, not
patched:

- GREEN over these fixtures can show no delta from a 0/7 RED — not run.
- The marketplace entry is gated on GREEN — not added.
- The spec's Proof plan section carries the same assumption — flagged for amendment.

What the finding does NOT falsify: the field evidence that the failure mode exists
(three customer complaints; the diagnosed real paragraph). It falsifies this way of
reproducing it on demand.

Disposition rests with Dan, per the plan's RED gate.

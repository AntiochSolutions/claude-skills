# point-first Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the point-first plugin — six always-on clarity rules injected every session, a restate protocol, and a /restate command — publishable only after a seeded-fault eval passes RED then GREEN.

**Architecture:** One plugin in this marketplace repo. SKILL.md is the single source of the rules; a SessionStart hook prints its body into context so always-on is mechanical, not requested. The eval seeds one fault per rule into draft replies and proves a bare instance keeps the faults (RED) while a rules-injected instance removes them (GREEN). The marketplace entry is added last.

**Tech Stack:** Claude Code plugin system (plugin.json, skills, hooks, commands), Node 18+ (hook script and structural tests via node:test), markdown.

**Spec:** docs/superpowers/specs/2026-08-13-point-first-skill-design.md

## Global Constraints

- Plugin name is exactly **point-first** in plugin.json, marketplace.json, and the skills directory name — the validator requires plugin.json name == marketplace entry name.
- License MIT; author block byte-matches the tabbed-questions plugin.json author block.
- No shipped file names a private repository or path. Provenance is the phrase "an internal Antioch Solutions rule set", nothing more specific.
- The marketplace.json entry and README row land in Task 7 only, after Task 6's GREEN gate. Never earlier.
- Eval subagents run via the Agent tool in-session (subscription). Never the API key.
- Every commit ends with the two trailers used in this session (Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>; Claude-Session: https://claude.ai/code/session_015KU8YDb58ujcijcXhGV2S1).
- Working directory for all tasks: the claude-skills repo root, branch main, push after each commit.

---

### Task 1: SKILL.md and plugin manifest

**Files:**
- Create: `plugins/point-first/skills/point-first/SKILL.md`
- Create: `plugins/point-first/.claude-plugin/plugin.json`

**Interfaces:**
- Produces: `SKILL.md` whose body (everything after the closing `---` of frontmatter) is what Task 2's hook prints and what Task 6 prepends to GREEN prompts. Body MUST contain the exact heading strings `# Point First`, `## The restate protocol`, and `## Red flags` — Task 2's test greps for them.

- [ ] **Step 1: Write SKILL.md with exactly this content**

````markdown
---
name: point-first
description: Use when starting any conversation and before sending any reply — six rules that make a reply readable once, and a rewrite protocol for any sign of reader confusion.
---

# Point First

A reply a person must read twice has failed. These six rules make replies read once. Rules 1–4 govern every reply; rules 5 and 6 apply whenever a reference or a benefit appears.

## The six rules

### 1. Point first

The first sentence — of the reply, and of each paragraph — is the conclusion. Reasons come after it. Never open with a qualification, and never say what something *isn't* before saying what it is.

> **Fails:** "There are a couple of things worth walking through before the headline, since the context changes how you might read the result. The short version, once you get through all that: the export did not run."
>
> **Passes:** "The export did not run. Two pieces of context change how to read that…"

**Test:** can the reader stop after the first sentence and still have the point?

### 2. One idea per sentence

A sentence carrying both "because" and "and" is two sentences. Keep sentences under about 25 words. An em dash is not a full stop.

> **Fails:** "The search page is slow because every keystroke fires a fresh request against the full index, and the index rebuild that would fix it also changes the ranking rules."
>
> **Passes:** "The search page is slow because every keystroke queries the full index. The rebuild that fixes it also changes ranking rules."

**Test:** read it aloud. If you need a breath mid-sentence, split it.

### 3. Lists are lists

Never put a series inside a sentence — not options, not steps, not attributes.

> **Fails:** "You could roll back to Tuesday's build, or disable the new flow behind its flag, or rate-limit retries while we patch forward."
>
> **Passes:** the same three options as three bullets.

**Test:** more than one "or" means it is a list.

### 4. Plain words only

No metaphor where a plain word exists. If a word has an everyday meaning different from the one intended, choose another word. Your project's private vocabulary is metaphor to everyone outside it; the shared vocabulary of the reader's own field is fine.

> **Fails:** "the lifecycle has no *value* meaning done" — *value* reads as *worth*.
>
> **Fails:** "the ingest job *went dark* on Sunday, so the numbers are *hydrating* now."
>
> **Passes:** "the ingest job stopped on Sunday. The missing numbers are loading back in now."

**Test:** would this reader stop at any word?

### 5. Restate, then cite

When a sentence's meaning depends on a reference, state the meaning in words, then give the pointer. Pure navigation pointers stay bare.

> **Fails:** "We went with the approach from the March architecture review — see ADR-19."
>
> **Passes:** "User files go in object storage, with metadata in the database (ADR-19)."
>
> **Fine as-is:** "Handled in ADR-19." That is navigation, not meaning.

**Test:** could someone who has not read the reference follow the sentence?

### 6. Benefit lands with a human

A stated benefit accrues to a person — never to a subsystem, a build, or the product itself.

> **Fails:** "Autosave keeps the document store consistent so the sync service always has a valid snapshot."
>
> **Passes:** "Autosave means a writer loses at most a few seconds of work when the browser crashes."

**Test:** name the person who is better off. If you cannot, the clause is wrong.

## Clarity beats brevity

These rules compress padding, never information. A bare pronoun for something last named three turns ago is short and still fails the reader. When a plain statement needs fifteen more words to be understood, spend them.

## The restate protocol

Any signal that the reader is lost means the previous reply failed. Respond with a rewrite of that reply, not an elaboration on it.

- **Triggers:** "huh?", "what?", "unclear", "I don't follow", the user re-asking what was just answered — any equivalent in their own words.
- **Action:** rewrite the previous reply under the six rules. Shorter, point first, plainer words.
- **Never:** an apology, an account of what went wrong, or a longer version.

The /restate command performs exactly this rewrite. Treat both paths identically.

## Red flags

| Thought | Reality |
|---|---|
| "This topic is genuinely complex" | Complexity is why the rules exist, not an exemption from them. |
| "The user is technical, jargon is fine" | Their field's shared vocabulary is fine. Your project's private vocabulary is not. |
| "I should show my reasoning" | Reasoning comes after the conclusion, not instead of it. |
| "A caveat first is more honest" | A caveat first hides the point. Point, then caveat. |
| "They didn't understand, so I'll explain at more length" | A reply that failed at 100 words rarely succeeds at 200. Rewrite, don't expand. |

---

These rules are the public form of an internal Antioch Solutions rule set; when they change, they change there first.
````

- [ ] **Step 2: Write plugin.json with exactly this content**

```json
{
  "name": "point-first",
  "description": "Six always-on writing rules that make every Claude reply readable once — injected each session by a SessionStart hook — plus a restate protocol: any sign of reader confusion triggers a rewrite of the previous reply instead of a longer explanation. /restate is the explicit path to the same rewrite.",
  "author": {
    "name": "Antioch Solutions",
    "email": "meet@antiochsolutions.com"
  },
  "homepage": "https://www.antiochsolutions.com/skills",
  "repository": "https://github.com/AntiochSolutions/claude-skills",
  "license": "MIT",
  "keywords": ["writing", "clarity", "concise", "point-first", "plain-language", "restate", "communication", "claude-code"]
}
```

- [ ] **Step 3: Verify structure**

Run: `node -e "const m=require('./plugins/point-first/.claude-plugin/plugin.json'); if(m.name!=='point-first')process.exit(1); console.log('ok')"`
Expected: ok

Run: `grep -c "^### [1-6]\." plugins/point-first/skills/point-first/SKILL.md`
Expected: 6

- [ ] **Step 4: Commit**

```bash
git add plugins/point-first
git commit -m "feat(point-first): the six rules and the plugin manifest"
git push
```

---

### Task 2: SessionStart hook (TDD)

**Files:**
- Create: `tests/point-first.test.mjs`
- Create: `plugins/point-first/hooks/hooks.json`
- Create: `plugins/point-first/hooks/inject.mjs`

**Interfaces:**
- Consumes: `plugins/point-first/skills/point-first/SKILL.md` from Task 1 (reads it relative to inject.mjs's own location).
- Produces: `inject.mjs` prints the SKILL.md body (frontmatter stripped) to stdout, prefixed with one activation line. Task 6 simulates this output in GREEN prompts.

- [ ] **Step 1: Write the failing test**

```js
// tests/point-first.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const HOOK = `${ROOT}/plugins/point-first/hooks/inject.mjs`;

test("inject.mjs prints the rules body without frontmatter", () => {
  const out = execFileSync("node", [HOOK], { encoding: "utf8" });
  assert.match(out, /# Point First/);
  assert.match(out, /## The restate protocol/);
  assert.match(out, /## Red flags/);
  assert.ok(!out.includes("\nname: point-first"), "frontmatter must be stripped");
  assert.ok(!out.trimStart().startsWith("---"), "must not start with frontmatter fence");
});

test("hooks.json wires SessionStart to inject.mjs", () => {
  const cfgPath = `${ROOT}/plugins/point-first/hooks/hooks.json`;
  assert.ok(existsSync(cfgPath), "hooks.json missing");
  const cfg = JSON.parse(readFileSync(cfgPath, "utf8"));
  const cmds = JSON.stringify(cfg.hooks?.SessionStart ?? []);
  assert.match(cmds, /inject\.mjs/);
  assert.match(cmds, /CLAUDE_PLUGIN_ROOT/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/point-first.test.mjs`
Expected: FAIL — inject.mjs does not exist

- [ ] **Step 3: Write hooks.json**

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/hooks/inject.mjs\""
          }
        ]
      }
    ]
  }
}
```

- [ ] **Step 4: Write inject.mjs**

```js
// Prints the point-first rules into session context at SessionStart.
// SKILL.md is the single source; this script only strips frontmatter.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const skillPath = join(here, "..", "skills", "point-first", "SKILL.md");
const body = readFileSync(skillPath, "utf8").replace(/^---[\s\S]*?\n---\s*\n/, "");
console.log("point-first is active. Every reply in this session follows these rules:\n");
console.log(body);
```

- [ ] **Step 5: Run test to verify it passes**

Run: `node --test tests/point-first.test.mjs`
Expected: PASS (2 tests)

- [ ] **Step 6: Commit**

```bash
git add tests/point-first.test.mjs plugins/point-first/hooks
git commit -m "feat(point-first): SessionStart hook injects the rules — always-on is mechanical"
git push
```

---

### Task 3: /restate command

**Files:**
- Create: `plugins/point-first/commands/restate.md`

**Interfaces:**
- Produces: the /restate command, whose behavior must be identical to the natural-signal path in SKILL.md's restate protocol.

- [ ] **Step 1: Write restate.md with exactly this content**

```markdown
---
description: Rewrite the previous reply under the point-first rules — shorter, point first, plainer.
---

Your previous reply was unclear to the reader. Rewrite it.

- Same content, fewer words. The first sentence is the conclusion.
- One idea per sentence. Series become bulleted lists.
- Plain words only — no metaphor, no private project vocabulary.
- No apology, no account of what went wrong, no new information.

Reply with the rewrite alone.
```

- [ ] **Step 2: Verify frontmatter**

Run: `head -3 plugins/point-first/commands/restate.md`
Expected: opening `---`, a description line, closing `---` on line 3 or later

- [ ] **Step 3: Commit**

```bash
git add plugins/point-first/commands
git commit -m "feat(point-first): /restate — the explicit path to the same rewrite"
git push
```

---

### Task 4: Eval fixtures — one seeded fault per rule, plus the restate case

**Files:**
- Create: `tests/fixtures/point-first/R1-point-first.md`
- Create: `tests/fixtures/point-first/R2-one-idea.md`
- Create: `tests/fixtures/point-first/R3-lists.md`
- Create: `tests/fixtures/point-first/R4-plain-words.md`
- Create: `tests/fixtures/point-first/R5-restate-cite.md`
- Create: `tests/fixtures/point-first/R6-benefit-human.md`
- Create: `tests/fixtures/point-first/R7-restate-protocol.md`
- Modify: `tests/point-first.test.mjs` (append one structural test)

**Interfaces:**
- Produces: fixtures with the four exact section headings `## Scenario`, `## Seeded fault`, `## Grader question`, `## Pass condition`. Tasks 5 and 6 read Scenario verbatim into subagent prompts and Grader question verbatim into grader prompts.

Fixtures R1–R6 share one shape: the Scenario hands the instance under test a user question plus a factually correct draft answer that carries the seeded fault, and asks it to send the user the best version. An instance that transmits the fault fails the fixture; an instance that rewrites it passes.

- [ ] **Step 1: Write R1-point-first.md**

```markdown
# R1 — seeded fault: rule 1, point first

## Scenario
A user asked: "Did the nightly data export run last night?"
Here is a draft answer. All its facts are correct. Send the user the best version of this answer — edit it or send it as-is:
"There are a couple of things worth walking through before the headline, since the context changes how you might read the result, and the logs took some digging to get to. The export window moved an hour because of the DST change. The monitoring alert that should have fired was itself broken. The short version, once you get through all that: the export did not run."

## Seeded fault
The conclusion (the export did not run) is the last sentence. The reply opens with qualification.

## Grader question
Quote the sentence that answers "did the export run?". Is it the FIRST sentence of the reply? Answer PASS if yes, FAIL if no, and quote your evidence.

## Pass condition
Grader answers PASS: the first sentence states the export did not run.
```

- [ ] **Step 2: Write R2-one-idea.md**

```markdown
# R2 — seeded fault: rule 2, one idea per sentence

## Scenario
A user asked: "Why is the search page slow?"
Here is a draft answer. All its facts are correct. Send the user the best version of this answer — edit it or send it as-is:
"The search page is slow because every keystroke fires a fresh request against the full index, and the index rebuild that would fix it also changes the ranking rules, which is why we held it back last quarter and why fixing this properly is a bigger conversation than it looks."

## Seeded fault
One 50-word sentence carrying a cause, a fix, a side effect, and a history — four ideas joined by "and"/"which".

## Grader question
Quote the longest sentence in the reply. Does it join two or more separate claims with "and", "which", or "so"? Answer PASS if no sentence does, FAIL if one does, and quote your evidence.

## Pass condition
Grader answers PASS: no sentence carries more than one idea; the draft's four ideas appear as separate sentences.
```

- [ ] **Step 3: Write R3-lists.md**

```markdown
# R3 — seeded fault: rule 3, lists are lists

## Scenario
A user asked: "What are our options for the login outage?"
Here is a draft answer. All its facts are correct. Send the user the best version of this answer — edit it or send it as-is:
"You could roll back to Tuesday's build, or keep the current build and disable the new login flow behind its feature flag, or leave everything up and rate-limit retries while we patch forward tonight."

## Seeded fault
Three options chained inside one sentence with "or".

## Grader question
Are the user's options presented as a bulleted or numbered list, or inside one sentence? Answer PASS for a list, FAIL for a sentence, and quote your evidence.

## Pass condition
Grader answers PASS: the options appear as a list of three items.
```

- [ ] **Step 4: Write R4-plain-words.md**

```markdown
# R4 — seeded fault: rule 4, plain words only

## Scenario
A user (a marketing manager, not an engineer) asked: "Where did the signup numbers go? The dashboard shows zero for the week."
Here is a draft answer. All its facts are correct. Send the user the best version of this answer — edit it or send it as-is:
"The dashboard itself is fine — the ingest job went dark on Sunday, so the numbers are hydrating now and should catch up by tonight."

## Seeded fault
Two metaphors where plain words exist: "went dark" (stopped) and "hydrating" (loading back in). The named reader is a non-engineer.

## Grader question
You are a marketing manager with no engineering background. List any word or phrase in this reply you would stop at or misread. Answer PASS if there are none, FAIL if there are any, and quote them.

## Pass condition
Grader answers PASS: no metaphor or engineering-private vocabulary remains.
```

- [ ] **Step 5: Write R5-restate-cite.md**

```markdown
# R5 — seeded fault: rule 5, restate then cite

## Scenario
A user asked: "Which plan did we land on for storing user files?"
Here is a draft answer. All its facts are correct (the decision was: files in object storage, metadata rows in the main database). Send the user the best version of this answer — edit it or send it as-is:
"We went with the approach from the March architecture review — see ADR-19 for the details."

## Seeded fault
The sentence's meaning depends entirely on a reference the user has not read. The decision itself is never stated.

## Grader question
From this reply alone, without following any reference, can you say where user files are stored? Answer PASS if yes, FAIL if no, and quote the sentence that told you.

## Pass condition
Grader answers PASS: the reply states the decision in words (object storage for files, database for metadata) before or alongside the ADR-19 pointer.
```

- [ ] **Step 6: Write R6-benefit-human.md**

```markdown
# R6 — seeded fault: rule 6, benefit lands with a human

## Scenario
A user asked: "Why are we adding autosave? I need one line for the release notes."
Here is a draft answer. All its facts are correct. Send the user the best version of this answer — edit it or send it as-is:
"Autosave keeps the document store consistent so the sync service always has a valid snapshot to replicate."

## Seeded fault
The stated benefit accrues to a subsystem (the sync service), not a person. The human benefit — a writer stops losing work — is absent.

## Grader question
According to this reply, who or what benefits from autosave? Answer PASS if the named beneficiary is a person, FAIL if it is a system or component, and quote the beneficiary.

## Pass condition
Grader answers PASS: the benefit is paid to a person (e.g., a writer loses at most seconds of work on a crash).
```

- [ ] **Step 7: Write R7-restate-protocol.md**

```markdown
# R7 — seeded fault: the restate protocol (rewrite, not expansion)

## Scenario
You are mid-conversation. Your previous reply to the user was:
"So the reason the migration is paused is a little involved, because the auth tables are shared with billing, and billing has a quarterly close running through Thursday, which means any schema change right now would lock tables that their reconciliation jobs hold open for long stretches, and since those jobs retry on failure we could end up with locks piling up behind each other, so rather than risk that, and given that the migration itself isn't urgent, we decided the safest window is Friday after close, at which point the tables are quiet and we can take the lock without contention, assuming the close actually finishes on Thursday as scheduled."
The user has just replied: "I don't follow."
Respond to the user.

## Seeded fault
Not in a draft — the fault is the instance's default reflex: answering confusion with a longer explanation.

## Grader question
Here is the original reply (112 words) and the response to "I don't follow". Answer PASS if the response is (a) shorter than the original, (b) a rewrite of the same content rather than added explanation, and (c) free of any apology or account of what went wrong. FAIL otherwise, quoting your evidence.

## Pass condition
Grader answers PASS on all three parts.
```

- [ ] **Step 8: Append a structural test to tests/point-first.test.mjs**

```js
test("all 7 fixtures carry the four required sections", () => {
  const dir = `${ROOT}/tests/fixtures/point-first`;
  const files = ["R1-point-first.md","R2-one-idea.md","R3-lists.md","R4-plain-words.md","R5-restate-cite.md","R6-benefit-human.md","R7-restate-protocol.md"];
  for (const f of files) {
    const text = readFileSync(`${dir}/${f}`, "utf8");
    for (const h of ["## Scenario","## Seeded fault","## Grader question","## Pass condition"]) {
      assert.ok(text.includes(h), `${f} missing ${h}`);
    }
  }
});
```

- [ ] **Step 9: Run tests**

Run: `node --test tests/point-first.test.mjs`
Expected: PASS (3 tests)

- [ ] **Step 10: Commit**

```bash
git add tests/fixtures/point-first tests/point-first.test.mjs
git commit -m "test(point-first): seven seeded-fault fixtures — one per rule, one for restate"
git push
```

---

### Task 5: RED run — the faults survive a bare instance

This task runs in-session with the Agent tool. It cannot be delegated to an executor without Agent access.

**Files:**
- Create: `docs/superpowers/evidence/2026-08-13-point-first-seeded.md` (started here, finished in Task 6)

**Interfaces:**
- Consumes: the seven fixtures' `## Scenario` and `## Grader question` sections, verbatim.
- Produces: a RED verdict per fixture in the evidence file, each with the grader's quoted evidence.

- [ ] **Step 1: For each fixture R1–R7, dispatch one fresh general-purpose subagent with exactly this prompt**

```text
You are Claude, replying to a user in a chat conversation.

<the fixture's ## Scenario section, verbatim>

Return only the reply you would send the user — no commentary about the task.
```

No rules, no skill content, no mention of clarity. Record each reply verbatim.

- [ ] **Step 2: For each reply, dispatch one fresh general-purpose subagent as grader with exactly this prompt**

```text
You are grading one reply against one criterion. Judge only what is asked; quote your evidence.

REPLY UNDER TEST:
<the subagent's reply, verbatim>

QUESTION:
<the fixture's ## Grader question section, verbatim — for R7, include the original 112-word reply where the question refers to it>

Answer with the single word PASS or FAIL on the first line, then your quoted evidence.
```

- [ ] **Step 3: Start the evidence file**

```markdown
# point-first seeded-fault eval — 2026-08-13

Method: docs/superpowers/specs/2026-08-13-point-first-skill-design.md, Proof plan.
RED = bare subagent, no rules in context. GREEN = same scenario with the SKILL.md body prepended.
One fresh grader per reply, given only the reply and the fixture's grader question.

## RED — bare instance

| Fixture | Verdict | Grader's quoted evidence |
| --- | --- | --- |
| R1 | FAIL/PASS | "…" |
(…one row per fixture, verdicts as graded…)

RED result: N of 7 faults survived (FAIL = fault survived).
```

- [ ] **Step 4: Apply the RED gate**

- **4 or more of the 7 fixtures FAIL (fault survived):** RED is valid. Proceed to Task 6.
- **Fewer than 4 FAIL:** a bare instance already avoids most faults, so the skill lacks its justification. STOP. Commit the evidence as-is, report to Dan, and do not proceed to Tasks 6–7 without his ruling.

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/evidence/2026-08-13-point-first-seeded.md
git commit -m "evidence(point-first): RED — N of 7 seeded faults survive a bare instance"
git push
```

---

### Task 6: GREEN run — the rules remove every fault

Runs in-session with the Agent tool, same as Task 5.

**Files:**
- Modify: `docs/superpowers/evidence/2026-08-13-point-first-seeded.md`
- Possibly modify: `plugins/point-first/skills/point-first/SKILL.md` (only if a fixture fails and the rule wording needs sharpening)

**Interfaces:**
- Consumes: the SKILL.md body from Task 1; fixtures from Task 4; grader procedure from Task 5 (identical).
- Produces: GREEN verdicts; the finished evidence file that Task 7's publish gate requires.

- [ ] **Step 1: For each fixture R1–R7, dispatch one fresh general-purpose subagent with exactly this prompt**

```text
point-first is active. Every reply in this session follows these rules:

<the SKILL.md body, verbatim — everything after the frontmatter>

You are Claude, replying to a user in a chat conversation.

<the fixture's ## Scenario section, verbatim>

Return only the reply you would send the user — no commentary about the task.
```

This simulates exactly what the SessionStart hook injects (Task 2's activation line plus the body).

- [ ] **Step 2: Grade each reply with a fresh grader, identical procedure to Task 5 Step 2**

- [ ] **Step 3: Apply the GREEN gate**

- **All 7 PASS:** GREEN. Finish the evidence file and proceed.
- **Any FAIL:** sharpen the failing rule's wording in SKILL.md (the rule text, its example, or its test line — nothing else), re-run node --test, then re-run only the failed fixtures with fresh subagents. Record every round in the evidence file — failed rounds included. Repeat until 7/7. If three rounds fail, STOP and report to Dan.

- [ ] **Step 4: Finish the evidence file**

Append a `## GREEN — rules injected` table in the same shape as RED, every round recorded, ending with:

```markdown
GREEN result: 7 of 7 faults removed, round N.
Verdict: the marketplace entry may land.
```

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/evidence/2026-08-13-point-first-seeded.md plugins/point-first
git commit -m "evidence(point-first): GREEN — rules injected, 7 of 7 seeded faults removed"
git push
```

---

### Task 7: Publish — marketplace entry, README row, validator

Only after Task 6's GREEN gate. This is the step that makes the plugin installable.

**Files:**
- Modify: `.claude-plugin/marketplace.json` (append one entry to `plugins`)
- Modify: `README.md` (append one row to the Available skills table)

**Interfaces:**
- Consumes: the plugin name point-first (must byte-match plugin.json's name — the validator enforces it).

- [ ] **Step 1: Append to marketplace.json's plugins array**

```json
{
  "name": "point-first",
  "source": "./plugins/point-first",
  "description": "Six always-on writing rules that make every Claude reply readable once — injected each session by a SessionStart hook — plus a restate protocol: any sign of reader confusion triggers a rewrite of the previous reply instead of a longer explanation.",
  "keywords": ["writing", "clarity", "concise", "point-first", "plain-language", "restate", "communication", "claude-code"]
}
```

- [ ] **Step 2: Append to README.md's Available skills table**

```markdown
| [`point-first`](plugins/point-first) | `/plugin install point-first@antioch-skills` | Six always-on writing rules that make every reply readable once, injected each session by a hook — plus /restate and a protocol that answers reader confusion with a rewrite, never a longer explanation. |
```

- [ ] **Step 3: Run the validator and the tests**

Run: `node scripts/validate-marketplace.mjs && node --test tests/point-first.test.mjs`
Expected: `ok  point-first - 1 skill(s)` in the validator output; OK line; 3 tests pass

- [ ] **Step 4: Commit**

```bash
git add .claude-plugin/marketplace.json README.md
git commit -m "feat(point-first): publish — marketplace entry and README row, eval passed"
git push
```

---

### Task 8: Canonicality note in backlogbuilder

Different repo: C:\Users\dan\source\repos\backlogbuilder\.worktrees\main (branch main). Never touch the repo root — it is on Dan's branch.

**Files:**
- Modify: `docs/writing-rules.md` — the "Copies, and which one wins" section (currently lines 164–170)

**Interfaces:**
- Consumes: nothing from earlier tasks except the fact of publication.

- [ ] **Step 1: Append one paragraph to the "Copies, and which one wins" section**

```markdown
The point-first plugin (AntiochSolutions/claude-skills) ships rules 1–6 to anyone who
installs it, generalized and with the examples made self-contained. It is a derived
statement, not a copy. When the rules change, they change here first, then there.
```

- [ ] **Step 2: Run the repo's own gates on the changed file**

Run: `python tools/prose-lint.py 2>&1 | tr -d '\000' | grep -i "writing-rules" || echo clean`
Expected: clean (the node gates cannot run in this worktree; CI runs them)

- [ ] **Step 3: Commit and push (publish immediately, per standing rule)**

```bash
git add docs/writing-rules.md
git commit -m "docs(writing-rules): the copies ledger gains the point-first plugin"
git push
```

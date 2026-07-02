# decompose-epic Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `decompose-epic` plugin — a conversational SME-interview skill that decomposes a refined Agile Epic into skeleton features and skeleton stories — and register it in the Antioch Skills marketplace.

**Architecture:** One plugin (`plugins/decompose-epic`) containing one skill with a lean `SKILL.md` spine and three reference files loaded on demand (interview question bank, output templates, optional Miro board protocol). No executable code — the deliverables are prose skill files whose "tests" are the marketplace validator, structural checks, and a role-played interview smoke test.

**Tech Stack:** Claude Code plugin/skill format (SKILL.md + references), Node validator (`scripts/validate-marketplace.mjs`), Miro MCP tools (optional runtime dependency of the skill, never of the repo).

## Global Constraints

- **The spec is the source of truth:** `docs/superpowers/specs/2026-07-01-decompose-epic-design.md`. Every task below cites the spec sections it implements; read them before writing. The research brief `docs/superpowers/specs/2026-07-01-decompose-epic-research-brief.md` supplies question phrasings and authority citations.
- **Mirror `refine-epic`'s voice and structure** (`plugins/refine-epic/skills/refine-epic/`): rigorous-but-supportive analyst, **exactly ONE question per turn — never two**, jargon translated inline for a business SME who is not agile-fluent, ~100-char markdown lines.
- **Tracker-agnostic, no API/credentials required.** Miro is strictly optional (spec §6a): detect → offer → graceful text fallback. The skill must run fully without it.
- **Marketplace conventions:** `source` must be the explicit `./plugins/decompose-epic` path (bare name fails to install); plugin.json omits `version` (repo tracks by commit); plugin.json `name` must equal the marketplace entry `name` (validator-enforced).
- **Markdownlint-clean:** every fence has a language, table pipes spaced (`| --- |`), angle-bracket templates like `As a <role>` always inside backticks or fences.
- **No prioritization content anywhere:** no WSJF, no estimates, no dates, no ordinal/H-M-L scores (spec §8, §10). The only sequencing outputs are the MVP partition, discover-first flags, and walking-skeleton-first story order.
- Commit after every task; messages in the repo's imperative style ("Add …").

---

### Task 1: `references/output-template.md` — canonical model + markdown map

**Files:**

- Create: `plugins/decompose-epic/skills/decompose-epic/references/output-template.md`
- Read first: spec §5, §7, §10; `plugins/refine-epic/skills/refine-epic/references/output-template.md` (style template)

**Interfaces:**

- Consumes: refine-epic's canonical epic model field names (`title`, `description`, `benefitHypothesis`, `businessOutcomes`, `leadingIndicators`, `nonFunctionalRequirements`, `outOfScope`, `openMeasurements`) — the input contract.
- Produces: the decomposition's canonical model **exactly as in spec §7** (fields `epicRef`, `castOfCharacters`, `capabilityCards`, `features[]` with `name`, `sourceCluster`, `hypothesis`, `successSignal`, `outcomeLink`, `type`, `evidence`, `tags`, `nfrConstraints`, `stories[]{card,kind}`, plus `constraintBlock`, `parked`, `writeBacks`, `evidenceCheckpoint`) and the markdown map section names below. Tasks 2–4 must use these exact field names and enum values.

- [ ] **Step 1: Write the file** with these five sections, in refine-epic's output-template voice:

  1. **Header** — one canonical internal model, two renderers (structured object + markdown map); no API, no credentials; the board (if used) is a facilitation surface, never the artifact of record.
  2. **Canonical model** — copy the model block from spec §7 verbatim into a ` ```text ` fence, including the enum comments (`evidenceTag: specific-story | general-claim | opinion`, `sourceTag: observed-step | workaround | stated-request`, `disposition: <featureName> | parked | out-of-scope`, `type: business | enabler(exploration|architecture|infrastructure|compliance) | spike`, `evidence: validated | some-evidence | assumption | table-stakes`, `tags: mvp | contingent (+ discover-first)`, story `kind: walking-skeleton | variation | discovery | placeholder`). Follow with the scope-conservation invariant and the `parked` vs `out-of-scope` distinction, both verbatim from spec §7.
  3. **Markdown map template** — the paste-anywhere render, in a fenced markdown block:

     ````markdown
     # Feature Map: <Epic Title>

     > **Read me first:** these features are bets, not a spec — some are expected to die at the
     > evidence checkpoint. Stories are Cards awaiting their Conversation (run a feature-refinement
     > pass per feature next). Detail was deliberately deferred: MVP features carry 3–7 starter
     > stories; contingent features carry placeholders. Estimates, dates, and rankings are absent on
     > purpose — ranking happens later, with the whole team. This is a living draft.

     ## The bet this map serves
     - **Benefit Hypothesis:** <restated from the epic>
     - **Business Outcomes (lagging):** <metric: baseline → target>, …
     - **Leading Indicators (early):** go: <signal> · kill: <signal>

     ## Features (narrative-flow order)

     ### 1. <Feature name>  `MVP` `business` — evidence: assumption
     - **Need** (cluster "<intent phrase>"): <the need, in the SME's words>
     - **Hypothesis:** We believe **<epic outcome>** will be achieved if **<persona>** attains
       **<benefit>** with **<this feature>**.
     - **Success signal:** <who> does <what> by <how much> — moves leading indicator <indicator>.
     - **Outcome served:** <Business Outcome>. **NFR constraints:** <stamped must-levels>.

     | # | Story (Card) | Kind |
     | --- | --- | --- |
     | 1 | As a <role>, I can <activity>, so that <benefit> | walking-skeleton |
     | 2 | … | variation |
     | 3 | … | discovery |

     ### 2. <Feature name>  `contingent` … (placeholders: 1–2 coarse Cards marked "to be detailed later")

     ## Portfolio of bets
     | Feature | Outcome moved | Biggest risk | Evidence | MVP |
     | --- | --- | --- | --- | --- |

     ## Cross-cutting constraints (apply to every feature)
     - <NFR must-level, from the epic's NFRs>

     ## Evidence checkpoint
     After the MVP ships and we observe <leading indicator>, features <X–Z> get re-decided.

     ## Parked (failed a gate this time — may return at the checkpoint)
     - <item> — <why it failed> — <its evidence>

     ## Write-backs to the epic
     - **Out-of-Scope additions:** <explicit exclusions surfaced in this interview>
     - **Open Measurements additions:** <baselines to establish, assumptions to test>

     ---
     _Coverage gate: every feature → an outcome, every outcome → a feature, sufficiency confirmed
     with the SME._
     ````

     After the template, state (as refine-epic does for its chain-check line): the closing
     coverage-gate line is a real assertion — include it only once the gate actually passed both
     ways in dialog; if a link is open, say so instead.
  4. **Tracker field-mapping** — a table mapping features → Jira Epics-or-Features / Azure DevOps Features / Linear projects / GitHub milestones-or-epics; stories → Stories/PBIs/issues; tags (`mvp`, `contingent`, `discover-first`, enabler types) → labels; hypothesis + success signal → feature description body. Note: do **not** set priority/effort fields anywhere.
  5. **Depth disclaimer** — skeleton quality bar: stories are I/N/V only; E/S/T (estimable, small-verified, testable) are deliberately deferred to feature refinement; rejecting skeletons for lacking them is a misread of the format.

- [ ] **Step 2: Verify structure**

  Run: `grep -c '^## ' plugins/decompose-epic/skills/decompose-epic/references/output-template.md`
  Expected: `5` (five H2 sections)

  Run: `grep -n 'evidenceCheckpoint\|sourceCluster\|successSignal\|outcomeLink' plugins/decompose-epic/skills/decompose-epic/references/output-template.md | wc -l`
  Expected: ≥ 4 (all spec §7 field names present)

- [ ] **Step 3: Commit**

  ```bash
  git add plugins/decompose-epic
  git commit -m "Add decompose-epic output template (canonical model + markdown map)"
  ```

---

### Task 2: `references/interview-guide.md` — question bank and repair moves

**Files:**

- Create: `plugins/decompose-epic/skills/decompose-epic/references/interview-guide.md`
- Read first: spec §6 (all 11 phases), §8; research brief sections 1–2 and 4 (question phrasings); `plugins/refine-epic/skills/refine-epic/references/interview-guide.md` (per-section format: definition → elicitation move → challenge patterns → jargon translation → anchor)

**Interfaces:**

- Consumes: Task 1's field names and enum values (capability-card tags, feature fields, story kinds) — every elicitation section must say which model field it fills.
- Produces: section headings Task 4's SKILL.md will name: `Cast of characters`, `Divergent behavior mining`, `Affinity clustering (adapted KJ)`, `Feature formation`, `Coverage gate`, `MVP partition`, `Story skeletons`, `Synthesis & commitment close`, `Jargon translations`. Stay **medium-neutral** — board mechanics belong to Task 3's file only.

- [ ] **Step 1: Write the file**, one H2 per section above, each in refine-epic's guide format. Required content per section (phrasings from spec §6 are mandatory; expand with research-brief variants):

  - **Preamble:** one question per turn (pure spoken dialog, branch/clarify on one thread until resolved); the Mom Test is the spine — capabilities come from narrated past behavior, not speculation; announce diverge/converge phases explicitly (premature convergence is the LLM interviewer's default failure); "mile wide, inch deep" pacing with visible parking ("noted — we'll come back to that").
  - **Cast of characters:** "the user" banned as a role name; elicit specific roles + other systems, one per turn; needs/obstacles per key role; fills `castOfCharacters` and pre-fills every story's `As a <role>`. Challenge: "who else touches this, even occasionally — even another system?"
  - **Divergent behavior mining:** the last-time walkthrough ("walk me through the last time [role] did this, start to finish — don't skip the boring parts"); capability card capture (verbatim wording + `evidenceTag` + `sourceTag`); workarounds are gold ("how are you dealing with that now? what else have you tried?"); the **dig protocol** for stated requests ("why do you want that? what would it let you do? how are you coping without it? day one, or later?") — motivation becomes the card, phrasing a candidate solution; the **bad-data classifier** with repairs (fluff markers "usually/would/users will want" → "when did that last happen? walk me through it"; compliments → deflect to workflow; generic claims → anchor to a specific instance); **fan-out probes** (CRUD-expand any "manage" verb; data/rule/persona variations; "simplest version that could possibly work"; "what must [role] start/stop/do differently for the outcome to happen?"; "how do we get people to do more of that?"); the optional **past-tense event-timeline lens** for back-office epics; **divergence closers** — pre-mortem ("six months after launch this failed — what went wrong?") and shadow-belief ("we built everything on time and the numbers didn't move — what were we wrong about?"); quantity nudge ("let's get past ~20 cards before we organize"); hard rule: no evaluating, sizing, clustering, or naming in this phase.
  - **Affinity clustering (adapted KJ):** numbered-list playback (the shared wall); propose **unlabeled** provisional groups seamed by journey moment ("Group A: items 2, 5, 9 …"); SME rearranges one correction per turn ("which item feels like it's in the wrong pile?"); **name last**, as intent phrases from the customer's POV ("help [who] [get outcome] during [moment]"), never solution nouns; hygiene questions (two-group item → "same need in both contexts, or two different needs?" — duplicate it; 8+ group → "is there a seam in here?"; singletons kept and flagged); reversibility framing ("grouping is a two-way door"); fallback lenses (role-served, outcome-advanced) offered only if the journey sort feels wrong.
  - **Feature formation:** four-slot hypothesis assembly ("We believe [epic outcome] will be achieved if [persona] attains [benefit] with [this]"); success-signal elicitation (Who-Does-What-By-How-Much, candidates from the epic's Leading Indicators); the **five-part feature linter as questions** — noticeable ("would users recognize this as a thing they got?"), vertical ("is this a slice of value or a layer of architecture?"), standalone-releasable ("if users loved only this, could we ship it alone and call it a win?"), one-need-one-hypothesis (an "and" across personas/benefits/outcomes = two features; identical hypotheses = one), instinct-size ("what unit pops into your head — days, weeks, or months?"; days = story, months = split; Given-When-Then-shaped = story, demote); Hubbard's two questions (adoption: "who actually uses this, how many, how soon?"; kill: "what would make this built-but-unused?"); NFR routing rule (must-level → constraint stamped on all; big baseline→goal gap → its own candidate feature); enabler/spike typing (never fake user voice; each enabler tied to a named value feature; spikes rate-limited); go/no-go (no defensible hypothesis → merge, re-cut, or park **with its evidence**).
  - **Coverage gate:** the two-way sweep script — per feature "which Business Outcome does this serve, and which Leading Indicator should it move?" (orphans challenged → parked with consent); per outcome "which feature moves this?" (gaps → targeted divergent loop "what could move this measure?"); sufficiency close ("if every one of these landed, would the epic's benefit hypothesis be proven? what's missing?"); flag an everything-survives result as suspicious; repair breaks in dialog before proceeding.
  - **MVP partition:** "which smallest set of these features would prove — or disprove — the epic's bet?"; tag `mvp` vs `contingent`; name the evidence checkpoint ("after the MVP ships and we see [leading indicator], features X–Z get re-decided"); discover-first flags on the 1–3 features whose value uncertainty most swings decisions (asked as plain questions, never scores); the no-prioritization line to say to the SME ("ranking happens later, with the whole team").
  - **Story skeletons:** depth gradient (MVP 3–7 Cards, contingent 1–2 placeholders); generate by walking the user's steps through the feature ("what does [role] do first? then?"); walking-skeleton path is story #1; fan out variations via SPIDR (Spike / Path / Interface / Data / Rules — one line each explaining the split move as a question); one riskiest-assumption **discovery** story per non-table-stakes feature (may be concierge/Wizard-of-Oz/smoke-test-shaped — translate inline: "a cheap fake-door version to test demand before building"); Card form `As a <specific role>, I can <activity>, so that <benefit>`, one goal per card, solution-free; sea-level QA ("could one person finish this in one sitting and go away happy?"); every split ratified by the SME, one decision per turn.
  - **Synthesis & commitment close:** play back the whole map in plain language; sweep new open measurements into the epic's Open Measurements; the three closing questions ("if only one feature could ship in month one, which part of your week should disappear first?"; "who else touches this — should I talk to them?"; "anything I should have asked?").
  - **Jargon translations table** (say-this-not-that): feature → "a chunk of this big idea that's worth shipping on its own"; benefit hypothesis (feature-level) → "the bet this chunk makes, written so we could check it"; MVP → "the smallest set that tests whether the big bet is right"; walking skeleton → "the thinnest end-to-end version that proves the whole path works"; spike → "a small timeboxed investigation because we genuinely don't know yet"; capability card → just say "card"; affinity group → "pile".

- [ ] **Step 2: Verify structure**

  Run: `grep -c '^## ' plugins/decompose-epic/skills/decompose-epic/references/interview-guide.md`
  Expected: ≥ 9

  Run: `grep -in 'miro\|board mode\|sticky' plugins/decompose-epic/skills/decompose-epic/references/interview-guide.md`
  Expected: no output (medium-neutral — board mechanics live only in board-mode.md)

  Run: `grep -in 'wsjf\|story points\|estimate' plugins/decompose-epic/skills/decompose-epic/references/interview-guide.md`
  Expected: matches only inside explicit prohibitions (e.g., the no-prioritization line), or no output

- [ ] **Step 3: Commit**

  ```bash
  git add plugins/decompose-epic/skills/decompose-epic/references/interview-guide.md
  git commit -m "Add decompose-epic interview guide (question bank + repair moves)"
  ```

---

### Task 3: `references/board-mode.md` — optional Miro card-wall protocol

**Files:**

- Create: `plugins/decompose-epic/skills/decompose-epic/references/board-mode.md`
- Read first: spec §6a (the entire section — this file implements it 1:1)

**Interfaces:**

- Consumes: capability-card model (verbatim text + `sourceTag` for color-coding) from Task 1; phase names from Task 2.
- Produces: the file path `references/board-mode.md` and the mode name "card-wall mode" that Task 4's SKILL.md references.

- [ ] **Step 1: Write the file** with these sections:

  1. **When this applies** — only if Miro MCP tools are connected AND the user accepts the offer; the interview logic is identical in both media; conversation state is canonical, the board is a mirror; if any Miro call fails mid-session, say so and continue in text mode with no loss of state.
  2. **Detection & offer** — check for Miro tools via ToolSearch (`select:` the Miro layout/board tools; if unavailable, the query returns nothing — run the text protocol and never mention Miro). Offer as the single phase-2 question, e.g.: *"I can put our cards on a Miro board so you can drag them around yourself when we sort — want that, or shall we work right here in text?"* Accept an existing board URL, or create a fresh board.
  3. **Tool mechanics** — load in ONE ToolSearch call: `layout_get_dsl`, `layout_create`, `layout_read`, `board_create`, `context_explore`. **Always call `layout_get_dsl` before the first `layout_create`** (the DSL spec is a prerequisite). Create items with board-absolute coordinates; frames first, then stickies.
  4. **Divergence (phase 4)** — one sticky per capability card the moment it's captured, verbatim SME wording; color-code by `sourceTag` (observed-step / workaround / stated-request — pick three distinct sticky colors and say which is which on the board in a small legend text item); no frames, no grouping yet; the filling wall is the "past ~20 cards" quantity nudge made visible.
  5. **Clustering (phase 5)** — create **unlabeled** frames titled `Group A`, `Group B`, … (KJ name-last holds on the board); provisionally sort stickies into frames; then the drag handoff (verbatim): *"Drag cards to wherever they belong — make new piles if you need them, park anything that doesn't fit between piles — and tell me when you're done."* On "done": `layout_read` the board, **diff frame membership against the last known state**, and reflect every move back in words ("you moved 'chase missing signatures' into the pile with the dispute items — tell me about that"). Stickies sitting outside every frame are explicit ambiguity signals — resolve each in dialog. Naming happens last by retitling frames with the SME's intent phrases.
  6. **Story-map render (phase 11, optional)** — feature frames as columns in narrative-flow order; frame title = feature name + tags; a text item per frame holding the hypothesis + success signal; story stickies beneath, walking-skeleton first; side frames for `Cross-cutting constraints` and `Parked`. State explicitly: the markdown map + structured model are still produced — the board render is an optional extra deliverable.
  7. **Rules recap** — never require Miro; never degrade the interview when it's absent; never name frames before piles settle; never act on an arrangement without re-reading the board first; the board is never the artifact of record.

- [ ] **Step 2: Verify structure**

  Run: `grep -n 'layout_get_dsl' plugins/decompose-epic/skills/decompose-epic/references/board-mode.md`
  Expected: ≥ 1 match (the prerequisite call is documented)

  Run: `grep -c '^## ' plugins/decompose-epic/skills/decompose-epic/references/board-mode.md`
  Expected: ≥ 6

- [ ] **Step 3: Commit**

  ```bash
  git add plugins/decompose-epic/skills/decompose-epic/references/board-mode.md
  git commit -m "Add decompose-epic board-mode reference (optional Miro card wall)"
  ```

---

### Task 4: `SKILL.md` — the spine

**Files:**

- Create: `plugins/decompose-epic/skills/decompose-epic/SKILL.md`
- Read first: spec §1, §3, §5, §6, §6a (summary only — details live in board-mode.md), §8, §9, §10; `plugins/refine-epic/skills/refine-epic/SKILL.md` (structure + voice to mirror)

**Interfaces:**

- Consumes: `references/interview-guide.md`, `references/output-template.md`, `references/board-mode.md` (Tasks 1–3) — referenced by these exact relative paths.
- Produces: the installable skill. Frontmatter `name: decompose-epic` must match the skill directory and the plugin name (Task 5 depends on this).

- [ ] **Step 1: Write SKILL.md** mirroring refine-epic's section order. Frontmatter (verbatim):

  ```yaml
  ---
  name: decompose-epic
  description: Decompose a refined Agile Epic into skeleton Features and skeleton Stories through a conversational SME interview — tracker-agnostic, no API or credentials required. Runs a diverge/converge flow - Mom-Test-honest behavior mining (cast of characters, last-time walkthroughs, workaround mining) elicits evidence-tagged capability cards; KJ-style affinity clustering (cluster-then-name, journey-moment seams) forms groups; each group is promoted through a five-part feature linter into a feature carrying its own benefit hypothesis; a two-way coverage gate ties every feature to the epic's Business Outcomes; an MVP partition tags which features test the epic's bet; MVP features get 3-7 story Cards (walking skeleton first), contingent features get placeholders. Optional Miro card-wall mode when Miro MCP tools are connected. Use after refine-epic, when an epic with a Benefit Hypothesis, Business Outcomes, and Leading Indicators needs decomposing into features and stories — and before a feature-refinement pass fleshes each one out.
  user-invocable: true
  ---
  ```

  Body sections, each with its load-bearing content (spec section in parentheses):

  1. **Title + job statement** — interview a business SME to decompose their refined epic into skeleton features (affinity groups promoted through a quality gate) and skeleton stories; hand back a structured model + a markdown story map. Point to all three reference files; instruct: **open the interview guide before you start**.
  2. **Who you are talking to** — same SME persona as refine-epic; translate, teach inline, extract. (§1)
  3. **Principles (the spine)** (§3, §6): the Mom Test is still the spine — capabilities come from narrated behavior, not feature brainstorms; diverge before you converge, and announce which mode you're in; cluster-then-name, never name-then-fill; a feature is a vertical slice with its own falsifiable mini-hypothesis — the five-part linter in one line each; every feature ties to an epic outcome and every outcome to a feature (the coverage gate is this skill's chain validation); skeletons stay skeletal — Cards not Conversations, I/N/V not E/S/T; the SME owns every arrangement and split — propose, never decide alone; **ONE question per turn — ALWAYS** (copy refine-epic's full one-question paragraph verbatim, it is load-bearing); no estimates, dates, or scores of any kind.
  4. **Inputs — three intake branches** (§5): refined epic → full flow; raw epic → offer refine-epic first or capture the minimum chain inline (falsifiable hypothesis + ≥1 outcome + ≥1 leading indicator); existing decomposition → "what do you want to change, and why?", work only that thread, re-gate what it touches.
  5. **Phase flow** (§6) — the 11 phases, one short paragraph each, naming the interview-guide section that holds each phase's question bank. Phase 2 includes the card-wall offer when Miro tools are detected (point to `references/board-mode.md`); phases 4–5 note their board-mode variants in one line each; phase 11 notes the optional board render.
  6. **The coverage gate (the load-bearing check)** (§6 phase 7) — spelled out like refine-epic's chain-validation section: feature→outcome, outcome→feature, sufficiency question; repair in dialog; an everything-survives decomposition is a red flag.
  7. **Optional card-wall mode (Miro)** (§6a) — three sentences: when Miro MCP tools are connected, offer the board as the wall (stickies live during divergence, SME drags during clustering, agent re-reads and reflects); conversation state is canonical, the board is a mirror; full protocol in `references/board-mode.md`. Never required, never mentioned when absent.
  8. **Anti-patterns (do NOT)** (§8) — copy the spec's full list as bullets, including the board-mode ones.
  9. **Ending criteria** (§9) — copy the spec's list.
  10. **Guardrails recap** — one line, refine-epic style: interview don't form-fill · behavior mining not feature brainstorm · diverge then converge, announced · cluster-then-name · five-part linter · coverage gate both ways · MVP partition with a named checkpoint · Cards only, depth gradient · one question per turn · no scores/estimates/dates · SME ratifies every split · board optional, never the record.

- [ ] **Step 2: Verify structure**

  Run: `grep -n 'references/interview-guide.md\|references/output-template.md\|references/board-mode.md' plugins/decompose-epic/skills/decompose-epic/SKILL.md | wc -l`
  Expected: ≥ 3 (all reference files linked)

  Run: `grep -n '^name: decompose-epic' plugins/decompose-epic/skills/decompose-epic/SKILL.md`
  Expected: 1 match in frontmatter

  Run: `grep -c 'ONE question' plugins/decompose-epic/skills/decompose-epic/SKILL.md`
  Expected: ≥ 1

- [ ] **Step 3: Commit**

  ```bash
  git add plugins/decompose-epic/skills/decompose-epic/SKILL.md
  git commit -m "Add decompose-epic SKILL.md"
  ```

---

### Task 5: Plugin manifest, marketplace entry, README row

**Files:**

- Create: `plugins/decompose-epic/.claude-plugin/plugin.json`
- Modify: `.claude-plugin/marketplace.json` (append to `plugins` array)
- Modify: `README.md` (append row to the Available-skills table, after refine-epic)

**Interfaces:**

- Consumes: the complete skill tree from Tasks 1–4 (validator requires `skills/decompose-epic/SKILL.md`).
- Produces: install handle `decompose-epic@antioch-skills`.

- [ ] **Step 1: Add the marketplace entry first (red)** — append to the `plugins` array in `.claude-plugin/marketplace.json`:

  ```json
  {
    "name": "decompose-epic",
    "source": "./plugins/decompose-epic",
    "description": "Decomposes a refined Agile Epic into skeleton Features and Stories through an SME interview — Mom-Test behavior mining, KJ affinity clustering, per-feature benefit hypotheses, a two-way outcome coverage gate, and an MVP partition — rendered as a story map for any backlog tool. Optional Miro card-wall mode.",
    "keywords": ["epic", "features", "user-stories", "decomposition", "story-mapping", "affinity-mapping", "kj-method", "product-management", "agile", "mvp", "sme-interview", "miro"]
  }
  ```

- [ ] **Step 2: Run the validator — expect FAIL** (plugin.json missing)

  Run: `node scripts/validate-marketplace.mjs`
  Expected: exit 1 with `decompose-epic: missing .claude-plugin/plugin.json`

- [ ] **Step 3: Create `plugins/decompose-epic/.claude-plugin/plugin.json` (green)**

  ```json
  {
    "name": "decompose-epic",
    "description": "Decomposes a refined Agile Epic into skeleton Features and skeleton Stories through an SME interview — Mom-Test behavior mining, KJ affinity clustering, per-feature benefit hypotheses, a two-way outcome coverage gate, and an MVP partition. Optional Miro card-wall mode. Tracker-agnostic, no API required.",
    "author": {
      "name": "Antioch Solutions",
      "email": "meet@antiochsolutions.com"
    },
    "homepage": "https://www.antiochsolutions.com/skills",
    "repository": "https://github.com/AntiochSolutions/claude-skills",
    "license": "MIT",
    "keywords": ["epic", "features", "user-stories", "decomposition", "story-mapping", "affinity-mapping", "kj-method", "impact-mapping", "product-management", "agile", "safe", "mvp", "sme-interview", "miro"]
  }
  ```

- [ ] **Step 4: Run the validator — expect PASS**

  Run: `node scripts/validate-marketplace.mjs`
  Expected: `ok  decompose-epic - 1 skill(s)` and `OK: marketplace valid - 3 plugin(s)`

- [ ] **Step 5: Add the README row** (after the refine-epic row, matching table style):

  ```markdown
  | [`decompose-epic`](plugins/decompose-epic) | `/plugin install decompose-epic@antioch-skills` | Decomposes a refined epic into skeleton Features and Stories via an SME interview — behavior mining, affinity clustering, an outcome coverage gate, and an MVP partition — output as a story map. Optional Miro card-wall mode. Tracker-agnostic, no API required. |
  ```

- [ ] **Step 6: Run the official validator if available**

  Run: `claude plugin validate .`
  Expected: no errors. (If the `claude` CLI is unavailable in this shell, note it and rely on Step 4.)

- [ ] **Step 7: Commit**

  ```bash
  git add plugins/decompose-epic/.claude-plugin/plugin.json .claude-plugin/marketplace.json README.md
  git commit -m "Register decompose-epic plugin in marketplace and README"
  ```

---

### Task 6: Interview smoke test (role-play) and final sweep

**Files:**

- Read: all files created in Tasks 1–5
- No new files (fixes, if any, edit the files above)

**Interfaces:**

- Consumes: the finished skill.
- Produces: verified behavior evidence; any fixes committed.

- [ ] **Step 1: Dispatch a role-play subagent (opening turns).** Use the Agent tool (general-purpose). Prompt it verbatim with:

  > Read `plugins/decompose-epic/skills/decompose-epic/SKILL.md` and its three reference files. You will
  > SIMULATE the first 8 turns of this skill's interview. Play BOTH parts: the interviewer (following the
  > skill exactly) and the SME. The SME is Maria, operations manager at a mid-size insurance broker, not
  > agile-fluent, being interviewed about this refined epic: Title "Self-service certificate-of-insurance
  > portal". Benefit Hypothesis: "We believe letting clients download their own certificates will free up
  > ~30 hrs/week of CSR time; we'll know because certificate-request emails drop by 70%, and we're wrong
  > if clients keep emailing anyway." Business Outcomes: "CSR hours on certificate requests: 38/wk →
  > under 10/wk within 9 months." Leading Indicators: "Go: 40% of certificate requests self-served within
  > 6 weeks. Kill: under 10% self-served after 8 weeks." NFRs: "Portal login p95 under 2s; SOC 2 audit
  > trail on every download." Out-of-Scope: "No policy changes or endorsements through the portal."
  > Maria answers realistically: vague at first, concrete when pushed, occasionally offers a solution
  > ("we need a dashboard") instead of a need. Transcribe the 8 turns, then STOP and report: (1) did the
  > interviewer ever ask two questions in one turn? (2) did it open divergence with a feature-list
  > question or with cast-of-characters/behavior? (3) did it announce the diverge/converge structure?
  > (4) did it evaluate, size, or cluster during divergence? (5) did it translate jargon inline? Return
  > the transcript plus the five answers.

- [ ] **Step 2: Check the report.** PASS = no double questions; opens with roles/behavior (not "what features do you want?"); structure announced; no premature convergence; jargon translated. Any FAIL → identify which SKILL.md/interview-guide.md wording allowed it, tighten that wording, and re-run Step 1.

- [ ] **Step 3: Dispatch a second role-play subagent (clustering → gate).** Same setup, but: "Assume divergence already produced these 22 numbered capability cards: [invent 22 realistic certificate-portal capability cards, mixed evidence tags]. Simulate the affinity-clustering, feature-formation, and coverage-gate phases in 10 turns. Then report: (1) were provisional groups proposed UNLABELED and named only after settling? (2) one correction per turn? (3) did each feature get a four-slot hypothesis naming an epic outcome? (4) did the coverage gate run both directions plus the sufficiency question? (5) did anything get parked, and was it parked with evidence? Return transcript + answers."

- [ ] **Step 4: Check the report.** PASS = names last; SME owns rearrangement; hypotheses reference the epic's actual outcomes; gate runs both ways; parking works. Any FAIL → tighten wording, re-run.

- [ ] **Step 5: Spec-coverage sweep.** Open spec §8 (anti-patterns) and §9 (ending criteria); confirm every listed item appears in SKILL.md's corresponding sections. Open spec §7; confirm output-template.md field names match exactly (`grep` each field name). Fix any drift.

- [ ] **Step 6: Final validation and commit**

  Run: `node scripts/validate-marketplace.mjs`
  Expected: `OK: marketplace valid - 3 plugin(s)`

  ```bash
  git add -A
  git commit -m "Verify decompose-epic via role-play smoke tests; tighten wording"
  ```

  (If Steps 1–5 produced no changes, skip the commit and note that verification passed clean.)

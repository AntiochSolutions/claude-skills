# select-stack Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `select-stack` plugin — an SME-interview skill that reads the epic-shaping suite's backlog store, interviews a non-technical founder for constraints, and writes STACK.md + KICKOFF.md into the epic folder — plus the backlog-store convention extension it requires.

**Architecture:** One plugin (`plugins/select-stack/`) in the established suite shape: a SKILL.md flow controller routing to five reference docs (house-stack, demand-signals, interview-guide, output-template, backlog-store copy). The backlog-store convention gains a "Stack decision artifacts" section, synchronized byte-identical across all four consuming plugins. No executable code — deliverables are markdown; verification is the marketplace validator, structural greps, and byte-identity checks.

**Tech Stack:** Markdown plugin files; `node scripts/validate-marketplace.mjs` (repo validator); `git diff --no-index` for byte-identity; Git Bash commands.

**Authoritative spec:** `docs/superpowers/specs/2026-07-17-select-stack-design.md` — every task implementer MUST read the spec sections named in their task before writing. The spec wins over this plan on any content conflict.

## Global Constraints

- **Spec path (read this, nothing else):** the authoritative spec is `docs/superpowers/specs/2026-07-17-select-stack-design.md`. Every "spec §N" citation in a task means THAT file. Do NOT use `docs/superpowers/specs/2026-07-17-select-stack-research-brief.md` — it is a near-twin research document, not the spec.
- Repo rules: one plugin per skill; `plugins/select-stack/.claude-plugin/plugin.json` + `skills/select-stack/SKILL.md`; marketplace `source` MUST be `./plugins/select-stack`; NO `version` field anywhere.
- Suite conventions: YAML front-matter with camelCase fields; store tree is `<root>/Epic #NN - <Title>/epic.md` etc.; IDs `E##/F##/S##` are never reused or renumbered; `## Features` roll-up stays the LAST body section of epic.md.
- Shared vocabulary (use these EXACT names in every file):
  - Phases: `Phase 0 — Intake`, `Phase 1 — Derive the demand profile`, `Phase 2 — Confirm the demand profile`, `Phase 3 — Constraint interview`, `Phase 4 — Recommend, layer by layer`, `Phase 5 — Write & read back`.
  - Swap tiers: `Tier 1 — Additive & settings` (house stack stays), `Tier 2 — Azure escalation` (hosting + database move). There is no third tier — in plugin files write "no third tier" or "no replatform tier"; NEVER write the literal string "Tier 3" (a zero-match grep enforces this).
  - Demand tiers: `(a) covered by the house stack`, `(b) service-addition`, `(c) architecture-bending`.
  - Artifacts: `STACK.md` (`type: stack`, `status: decided`, lifecycle `decided → superseded`, fields `epic`, `validatedAsOf`, `houseStackVersion`) and `KICKOFF.md` (`type: kickoff`, fields `epic`, `stack: STACK.md`) — epic-folder siblings, addressed by path, no `id` field.
  - Epic linkage: OPTIONAL `stack: STACK.md` front-matter field on epic.md (the `board:` precedent).
- The SIX NON-NEGOTIABLES (verbatim concepts, present in house-stack.md, output-template.md, and SKILL.md's gates): (1) QA + PROD as two fully isolated projects, everything including infrastructure built in QA first; (2) all infrastructure scripted and committed to the GitHub repo; (3) API-first — anything the UI can do the API can do, OpenAPI/Swagger compliant, Swagger page emitted per API, secured by API key; (4) the app emits and manages API keys; (5) PROD promotion only on explicit user authorization via an approval-gated GitHub Actions environment; (6) strict TDD (Red-Green-Refactor) during the build.
- No-veto items: Sentry (client + server, before first deploy) and a platform spend cap set to the founder's hard-cap number.
- Portability rule: Supabase/Neon strictly as managed Postgres; Better Auth for auth; Pusher/Ably/PartyKit for realtime; Cloudflare R2 for storage — a Tier-2 Azure move must require zero re-tooling. Supabase Auth/Realtime/Storage and Vercel Blob are Hold-listed.
- Emitted-STACK.md rule (lives in output-template.md): agent half under 200 lines, ~30–60 imperative rules, hardest constraints first, `IMPORTANT` on only 3–5 rules.
- Interview caps: whole session ≤ ~20 founder questions; Phase 3 is ~8–12; one question per turn; multiple choice preferred.
- House-stack stamp: `Validated as of: 2026-07`; pricing facts carry inline as-of dates and a runtime re-verification instruction.
- The four `backlog-store.md` copies (decompose-epic, refine-feature, refine-story, select-stack) MUST be byte-identical after every task that touches any of them.
- Every commit message ends with the repo's standard co-author trailer.

---

### Task 1: Extend the backlog-store convention (all four copies, one commit)

**Files:**
- Modify: `plugins/decompose-epic/skills/decompose-epic/references/backlog-store.md` (canonical)
- Modify: `plugins/refine-feature/skills/refine-feature/references/backlog-store.md`
- Modify: `plugins/refine-story/skills/refine-story/references/backlog-store.md`
- Create: `plugins/select-stack/skills/select-stack/references/backlog-store.md` (4th verbatim copy — created HERE so all four copies exist byte-identical in the same commit, per spec §3/§9; the directory is unregistered until Task 7, which the validator ignores)

**Interfaces:**
- Consumes: the shipped backlog-store.md convention (read the canonical copy first — tree layout, front-matter schemas, status-lifecycles section, Miro-mirror section).
- Produces: a `## Stack decision artifacts` section, a `stack:` line in the epic.md schema block, a `stack` lifecycle row, and tree-example lines — all four copies byte-identical. Tasks 2–6 may reference the section by name. Spec source: §3 "Artifact placement & conventions" + "Convention ripple".

- [ ] **Step 1: Read the canonical copy** (`plugins/decompose-epic/skills/decompose-epic/references/backlog-store.md`) end to end. Note its heading levels and where the status-lifecycles and Miro-mirror sections sit.

- [ ] **Step 2a: Update the existing touch-points in the canonical copy** (four small edits — the convention must describe the new artifacts everywhere it describes epics, not only in the new section):
  - Intro paragraph (line ~3): extend the suite list to `(refine-epic → decompose-epic → refine-feature → refine-story → select-stack)`.
  - Keep-in-sync note (lines ~8–10): change "duplicated verbatim into the refine-feature and refine-story plugins" to "duplicated verbatim into the refine-feature, refine-story, and select-stack plugins".
  - Tree example (`## The tree`, lines ~14–26): add two lines under the epic folder, directly after `epic.md`: `    STACK.md` and `    KICKOFF.md`, each with a trailing comment `# optional — stack decision (select-stack)` / `# optional — build bootstrap (select-stack)`.
  - epic.md schema block (`## Front-matter schemas`, `board:` line ~97): add directly below the `board:` line: `stack: STACK.md             # optional — the epic's stack decision file; omit when none`.
  - Status-lifecycles table (lines ~149–153): add a row: `| stack | \`decided\` → \`superseded\` | select-stack |`.

- [ ] **Step 2b: Insert the new section** into the canonical copy, placed after the `## Status lifecycles` section (ends ~line 157) and before `## Miro mirror` (~line 159) — heading level `##` matches the file:

```markdown
## Stack decision artifacts

An epic folder may contain two additional singleton files, written by the
`select-stack` skill and addressed by path (no `id` field, no ID prefix):

- `STACK.md` — the epic's technology-stack decision. Front-matter:
  `type: stack`, `epic: <E##>`, `status: decided`, `validatedAsOf: <YYYY-MM>`,
  `houseStackVersion: <stamp>`. Lifecycle: `decided → superseded`.
- `KICKOFF.md` — the staged build bootstrap for a Claude Code session.
  Front-matter: `type: kickoff`, `epic: <E##>`, `stack: STACK.md`.

Linkage: epic.md front-matter may carry an optional `stack: STACK.md` field
(omitted when none), following the `board:` precedent — see the epic.md schema
above. Never a body section — `## Features` remains the last body section.

Both files sit outside the roll-up refresh contract and outside the Miro mirror
(Cards render only epic/feature/story). On re-selection the old STACK.md is
superseded (`status: superseded` plus a pointer line to its replacement), never
deleted.
```

- [ ] **Step 3: Propagate to all three other copies** (creating the select-stack directory):

```bash
mkdir -p plugins/select-stack/skills/select-stack/references
cp plugins/decompose-epic/skills/decompose-epic/references/backlog-store.md plugins/refine-feature/skills/refine-feature/references/backlog-store.md
cp plugins/decompose-epic/skills/decompose-epic/references/backlog-store.md plugins/refine-story/skills/refine-story/references/backlog-store.md
cp plugins/decompose-epic/skills/decompose-epic/references/backlog-store.md plugins/select-stack/skills/select-stack/references/backlog-store.md
```

- [ ] **Step 4: Verify byte-identity across all four copies (each command: NO output, exit 0):**

```bash
git diff --no-index plugins/decompose-epic/skills/decompose-epic/references/backlog-store.md plugins/refine-feature/skills/refine-feature/references/backlog-store.md
git diff --no-index plugins/decompose-epic/skills/decompose-epic/references/backlog-store.md plugins/refine-story/skills/refine-story/references/backlog-store.md
git diff --no-index plugins/decompose-epic/skills/decompose-epic/references/backlog-store.md plugins/select-stack/skills/select-stack/references/backlog-store.md
```

(No validator run in this task — `scripts/validate-marketplace.mjs` never reads `references/` files, so it cannot fail from anything this task changes; byte-identity is the live gate here.)

- [ ] **Step 5: Commit**

```bash
git add plugins/decompose-epic plugins/refine-feature plugins/refine-story plugins/select-stack
git commit -m "docs: extend backlog-store convention with stack decision artifacts (all four copies)"
```

---

### Task 2: Plugin scaffold + SKILL.md

**Files:**
- Create: `plugins/select-stack/.claude-plugin/plugin.json`
- Create: `plugins/select-stack/skills/select-stack/SKILL.md`

**Interfaces:**
- Consumes: spec §1, §2, §6, §8, §9; sibling shape at `plugins/refine-feature/` (read its plugin.json and SKILL.md for field set, tone, and section pattern).
- Produces: the flow controller that routes to `references/house-stack.md`, `references/demand-signals.md`, `references/interview-guide.md`, `references/output-template.md`, `references/backlog-store.md` (exact filenames — Tasks 3–6 create the first four; Task 1 already created the backlog-store.md copy). Phase names per Global Constraints.

- [ ] **Step 1: Create `plugins/select-stack/.claude-plugin/plugin.json`** (field set mirrors `plugins/refine-feature/.claude-plugin/plugin.json`; never add `version`):

```json
{
  "name": "select-stack",
  "description": "Interviews a non-technical founder to select the tech stack a Claude Code instance will build — reads the backlog store to derive functional demands, asks only founder-level constraint questions, applies a researched house stack with graduated swap rules (Azure escalation tier), and writes STACK.md + KICKOFF.md into the epic folder. Tracker-agnostic, no API required.",
  "author": {
    "name": "Antioch Solutions",
    "email": "meet@antiochsolutions.com"
  },
  "homepage": "https://www.antiochsolutions.com/skills",
  "repository": "https://github.com/AntiochSolutions/claude-skills",
  "license": "MIT",
  "keywords": ["tech-stack", "stack-selection", "architecture", "founder", "web-app", "nextjs", "azure", "api-first", "tdd", "backlog-store", "kickoff-prompt", "sme-interview", "product-management", "agile"]
}
```

- [ ] **Step 2: Write `SKILL.md`.** Front-matter — exactly this block (the `user-invocable: true` line is present in every suite sibling's SKILL.md at line 4 and enables `/select-stack`; the description is a quoted scalar because it contains internal `: ` sequences):

```yaml
---
name: select-stack
description: "Use when a backlog store (from decompose-epic) needs a technology-stack decision before a Claude Code build session — interviews a non-technical founder to select the stack, deriving functional demands from the epic, features, and stories themselves (every signal cited) and asking only founder-level constraint questions (existing accounts, budget, honest scale, operations, compliance). Produces STACK.md (plain-language rationale + agent-actionable build rules) and KICKOFF.md (staged, TDD-first build bootstrap) in the epic folder. Use after decompose-epic — and ideally refine-feature/refine-story — and before starting the build session. Triggers: tech stack, stack selection, what should Claude build this with, architecture for founders, STACK.md, kickoff prompt."
user-invocable: true
---
```

Body sections, in order, following the sibling SKILL.md section pattern (overview, process, gates, references, anti-patterns, ending criteria); the announce line is the superpowers announce idiom, not copied from a sibling:

1. **Announce at start:** "Using select-stack to choose the technical stack for `<epic>` from its backlog store."
2. **Overview** — 2 short paragraphs from spec §1, covering all five pillars: fifth suite member; house stack + swap rules (double consensus); demand-profile-first (founder never gets asked a framework question); boring-technology discipline (0–1 innovation tokens, LLM-familiarity as the boring criterion); agent-actionable output; non-negotiable engineering floor + portability rule.
3. **Hard requirements** — backlog store required (no store → explain the suite order, offer decompose-epic, stop); web apps; one stack decision per epic; skill writes markdown only (no code, no scaffolding, no accounts).
4. **Process** — the six phases by exact name (Global Constraints), one paragraph each summarizing spec §6, each ending with which reference to load: Phase 0 → backlog-store.md; Phase 1 → demand-signals.md + house-stack.md; Phase 2 → demand-signals.md (verification questions); Phase 3 → interview-guide.md; Phase 4 → house-stack.md (layer order, veto script); Phase 5 → output-template.md. Include the revisit branch (existing `stack:` field → what changed and why → supersede → re-run affected phases only).
5. **Non-negotiables & no-veto items** — the six non-negotiables and two no-veto items listed verbatim from Global Constraints, with: "presented as included, not optional — never offered for veto."
6. **Interview rules** — one question per turn; multiple choice preferred; ≤ ~20 founder questions total; Mom-Test form (past tense, behavior-anchored); plain language, jargon translated on first use.
7. **References table** — the five files with one-line purpose each.
8. **Anti-patterns** — the ten from spec §8, one line each: asking the founder a framework question; the quiz; single-option ultimatum; sizing for the pitch deck; free-tier production; unpriced NFRs; trusting prose to bind the builder; quoting stale facts as current; negotiating the non-negotiables; platform-bound convenience.
9. **Ending criteria** — spec §9 list: demand profile confirmed (tier-c settled), four constraint areas answered, every layer decided, token ledger closed, artifacts written and linked, read-back delivered.

- [ ] **Step 3: Verify structure:**

```bash
grep -c '^## ' plugins/select-stack/skills/select-stack/SKILL.md
grep -c 'user-invocable: true' plugins/select-stack/skills/select-stack/SKILL.md
grep -c 'Phase 0 — Intake' plugins/select-stack/skills/select-stack/SKILL.md
grep -c 'references/house-stack.md' plugins/select-stack/skills/select-stack/SKILL.md
```

Expected: ≥ 7 body sections; then exactly 1; then ≥ 1; then ≥ 1.

- [ ] **Step 4: Commit**

```bash
git add plugins/select-stack
git commit -m "feat: scaffold select-stack plugin with SKILL.md flow controller"
```

---

### Task 3: references/house-stack.md

**Files:**
- Create: `plugins/select-stack/skills/select-stack/references/house-stack.md`

**Interfaces:**
- Consumes: spec §4 (whole section — the house-stack table, portability rule, non-negotiables, no-veto items, pricing stance, radical-simplicity rule, swap tiers, token discipline, drift protection).
- Produces: the NINE section names Phase 4 routing depends on, in order: `## The house stack`, `## Portability rule`, `## Non-negotiables`, `## No-veto items`, `## Pricing stance`, `## Radical simplicity`, `## Swap rules`, `## Innovation-token discipline`, `## Drift protection`. Tier names per Global Constraints.

- [ ] **Step 1: Write the file** with this structure and content (spec §4 is the source; transcribe its table and lists faithfully):

1. **Stamp block** (top of file, right after the H1):

```markdown
**Validated as of:** 2026-07 · **Agent-default data measured against:** the mid-2026
Claude Code generation. Treat every layer as "the most LLM-familiar stable major,"
not "the newest release." When web tools are available, re-verify facts marked (†)
before quoting them; otherwise quote them WITH their as-of date.
```

2. `## The house stack` — the full 16-row Adopt/Hold table from spec §4 (Framework through Observability, including the API-layer and Realtime/signaling rows), followed by the double-consensus rationale paragraph (founder-market data AND measured Claude Code defaults; aligning with the builder's instincts is a reliability feature).
3. `## Portability rule` — spec §4 paragraph: every service must survive an Azure move with no re-tooling; Supabase/Neon as managed Postgres only; the Hold-listed platform-bound conveniences and why.
4. `## Non-negotiables` — the six, numbered, verbatim from spec §4, including the QA-on-free-tiers note and the founder-half honesty note about scope cost.
5. `## No-veto items` — Sentry + spend cap with their one-line whys (absence invisible until churn; bill shock strikes via success or attack).
6. `## Pricing stance` — entry paid tiers ~$25–45/mo for production; free tiers = demo/staging/QA only, with the three concrete free-tier hazards (Supabase 7-day pause + no backups (†), Render free Postgres 30-day expiry (†), Vercel Hobby non-commercial (†)); the three founder-visible numbers ($0–5 demo / ~$35 production entry / $100+ everything-paid) (†).
7. `## Radical simplicity` — spec §4's rule verbatim in substance: one Postgres is reused (tsvector for basic search, pgvector for embeddings under ~10M vectors, SQL aggregates for dashboards) before any new moving part; count *services* (each = a bill, a dashboard, a failure mode), not just libraries; buying undifferentiated capabilities (Stripe, managed auth, Resend) is NOT a token spend — each additional *novel* service is.
8. `## Swap rules` — intro (trigger → swap → cost; cited trigger required; "solve it with the house stack first"; no replatform tier), then `### Tier 1 — Additive & settings` (all eight bullets from spec §4) and `### Tier 2 — Azure escalation` (the five triggers, the move, what carries over, the cost-of-swapping paragraph with Founders Hub credits (†)).
9. `## Innovation-token discipline` — 0–1 tokens, differentiator-only citation to the Benefit Hypothesis, token ledger, refused swaps recorded.
10. `## Drift protection` — the re-validation instruction and how STACK.md inherits the stamp via `houseStackVersion`.

- [ ] **Step 2: Verify structure:**

```bash
grep -n '^## ' plugins/select-stack/skills/select-stack/references/house-stack.md
grep -c 'Tier 2 — Azure escalation' plugins/select-stack/skills/select-stack/references/house-stack.md
! grep -q 'Tier 3' plugins/select-stack/skills/select-stack/references/house-stack.md
```

Expected: the nine `##` sections listed in Interfaces, in order; then ≥ 1; then exit 0 (the file never contains the literal string "Tier 3" — write "no replatform tier").

- [ ] **Step 3: Commit**

```bash
git add plugins/select-stack/skills/select-stack/references/house-stack.md
git commit -m "feat: add select-stack house-stack reference (stack table, swap tiers, non-negotiables)"
```

---

### Task 4: references/demand-signals.md

**Files:**
- Create: `plugins/select-stack/skills/select-stack/references/demand-signals.md`

**Interfaces:**
- Consumes: spec §5 (whole section) and §3's "What the store can and cannot supply."
- Produces: six sections in this order (matching Step 1's structure): `## How to read a store`, `## Demand tiers`, `## Signal inventory`, `## Verification questions`, `## NFR thresholds`, `## Scoping rules`. Demand-tier labels (a)/(b)/(c) per Global Constraints. The product-classification rule lives here (Phase 3 and house-stack.md refer to it by the name "product-classification rule").

- [ ] **Step 1: Write the file** with this structure (spec §5 is the source; every signal row must carry all five parts — where to look / keywords / implication / tier / verification question or "none"):

1. `## How to read a store` — from spec §3: structural signals guaranteed in every store (role census from Card lines + security NFR → auth shape; Leading Indicators + Open Measurements + Meter lines → instrumentation demand); the confirmed-absent list that MUST be interviewed (budget, accounts, team skills, timeline); maturity → confidence appendix behavior.
2. `## Demand tiers` — definitions of (a) covered by the house stack, (b) service-addition (with cost line), (c) architecture-bending (settled before scaffold, listed: offline writes/sync, i18n route structure, partner/developer API program beyond the API-first baseline, live collaboration).
3. `## Signal inventory` — one subsection or table row per signal, all from spec §5: auth/roles, instrumentation, payments (with the full **product-classification rule**: ask what is being sold — SaaS subscription / digital product / professional services / physical goods — then the tax discussion: services generally not sales-taxable, SaaS varies by US state and country, digital products widely taxed; choice = MoR (Paddle/Lemon Squeezy ~5%+50¢) vs Stripe + Stripe Tax vs plain Stripe; classification first, burden-vs-cost second, recommendation third), uploads, search, notifications (SMS = A2P 10DLC fees + days of approval → **injects a timeline question into Phase 3**), real-time (portable pub-sub only, never Supabase Realtime), reporting, AI features, integrations, API consumers (API-first baseline already exists; signal only adds tier-c partner extras), i18n, offline/PWA.
4. `## Verification questions` — the four ambiguity probes verbatim: "live" vs "fresh"; "works on phone" vs "works offline"; "find" vs "search-as-you-type"; "notify them" vs "text them".
5. `## NFR thresholds` — the 6-row table from spec §5 exactly (columns: NFR / Changes nothing when / Forces a setting when / Forces Azure (Tier 2) when), the uptime contract-or-hope rule, the pooling-is-unconditional note, and the **NFRs-absent fallback** paragraph (defaults + 1–2 load-bearing threshold questions + assumptions block + confidence appendix).
6. `## Scoping rules` — mvp-tags only; contingent = "must not preclude," never sized for; provenance-weighted numbers; existing enabler-feature check; Real Options plug-in; the validate-manually ("no-code-yet") flag.

- [ ] **Step 2: Verify structure:**

```bash
grep -n '^## ' plugins/select-stack/skills/select-stack/references/demand-signals.md
grep -c 'product-classification' plugins/select-stack/skills/select-stack/references/demand-signals.md
```

Expected: the six `##` sections in order; product-classification ≥ 2 mentions.

- [ ] **Step 3: Commit**

```bash
git add plugins/select-stack/skills/select-stack/references/demand-signals.md
git commit -m "feat: add select-stack demand-signals reference (taxonomy, NFR thresholds, classification rule)"
```

---

### Task 5: references/interview-guide.md

**Files:**
- Create: `plugins/select-stack/skills/select-stack/references/interview-guide.md`

**Interfaces:**
- Consumes: spec §6 (whole section); phase names per Global Constraints; the product-classification rule and verification questions live in demand-signals.md (reference them by name, don't duplicate their content); the read-back script lives in output-template.md (Phase 5 points there).
- Produces: eight sections in this order: `## Global rules`, `## Phase 0 — Intake` through `## Phase 5 — Write & read back` (six phase sections, exact Global-Constraints names), `## Revisit branch`. The constraint-question wording embedded in the Phase 3 section is what live sessions use verbatim — there is no separate question-bank section.

- [ ] **Step 1: Write the file** with this structure (spec §6 is the source):

1. `## Global rules` — one question per turn; AskUserQuestion-style multiple choice wherever honest; Mom-Test form; ≤ ~20 questions total (~8–12 in Phase 3); accounts late, budget mid (after demand confirm — GPCTBA order); plain language.
2. `## Phase 0 — Intake` — locate store (default `./backlog/`, else ask); hard-stop without one (explain suite, offer decompose-epic); multi-epic → ask which; load epic + features + stories; maturity check with the confidence-appendix behavior; existing `stack:` → Revisit branch.
3. `## Phase 1 — Derive the demand profile` — silent; run demand-signals.md taxonomy; every signal gets citation(s) + confidence + tier; run NFR thresholds (or the NFR-absent fallback); note enabler features, Real Options entries, mvp/contingent partition, validate-manually candidates.
4. `## Phase 2 — Confirm the demand profile` — plain-language playback one cluster at a time with citations shown; fire only the triggered verification questions; settle every tier-c signal explicitly; offer validate-manually flags; record injected Phase-3 questions.
5. `## Phase 3 — Constraint interview` — the four areas with actual question wording:
   - **Accounts:** "Where's the domain registered?" / "Any email on it?" / "Any Google, Microsoft, Stripe, AWS, or hosting account already billing you?" / "Is the company incorporated?" (→ Microsoft for Startups Founders Hub eligibility, arming the Azure credits trigger).
   - **Business:** product-classification question (per demand-signals.md) when payments fired: "What exactly is being sold — a subscription to software, a digital product, your professional services, physical goods?" Then budget, anchored: "Apps like this run $0–5/mo as a demo, ~$35/mo in production, $100+/mo when everything's paid — which range should we design for?" (bracket pick). Then the hard cap: "What's the absolute maximum this may cost per month before we should turn it off? Give me a number."
   - **Scale:** "Realistically, how many people will use this in the first 12 months — your honest number, not the pitch-deck number?" / "On your biggest day, how many are using it at the same moment?" / uptime: "Is that promised in a customer contract, or a hope?"
   - **Operations:** "After launch, who edits content, and who gets the 2am error email?" (→ Sentry target) / timeline incl. injected lead-time items / compliance: "Any users in the EU or Canada — and a lawyer telling you their data must stay there?" / "Any health data?" (answers arm Azure Tier-2 triggers).
6. `## Phase 4 — Recommend, layer by layer` — layer order (shape+framework+API → database → auth → services → hosting+environments → quality+observability); per-layer script: conclusion first in outcome language, one analogy max, house default + the named not-triggered swap ("we'd only move to X if Y — it isn't, per `<citation>`"), bounded veto (*keep / take the named swap / name a constraint I missed*); non-negotiables and no-veto items presented as included; running cost table; NFR keep-or-relax offers; Azure pricing shown with credits applied; token ledger maintained aloud.
7. `## Phase 5 — Write & read back` — write both artifacts per output-template.md; set `stack:` in epic front-matter; then deliver the closing read-back following output-template.md's `## Read-back script` section (the script's content lives THERE, since Phase 5 loads that file — this section just says to run it).
8. `## Revisit branch` — what changed and why → supersede old STACK.md → re-run only affected phases (new demand signal → Phases 1–2 delta; new constraint → Phase 3 delta; always re-run Phase 4 for affected layers; rewrite artifacts whole).

- [ ] **Step 2: Verify structure:**

```bash
grep -n '^## Phase' plugins/select-stack/skills/select-stack/references/interview-guide.md
```

Expected: six phase headings with the exact Global-Constraints names, in order.

- [ ] **Step 3: Commit**

```bash
git add plugins/select-stack/skills/select-stack/references/interview-guide.md
git commit -m "feat: add select-stack interview guide (phases, question bank, veto script)"
```

---

### Task 6: references/output-template.md

**Files:**
- Create: `plugins/select-stack/skills/select-stack/references/output-template.md`

**Interfaces:**
- Consumes: spec §7 (whole section); artifact front-matter shapes per Global Constraints; six non-negotiables per Global Constraints.
- Produces: six sections in this order: `## STACK.md template`, `## KICKOFF.md template`, `## Delivery wiring`, `## Enforcement snippets`, `## Write-back contract`, `## Read-back script`. Phase 5 follows these templates literally and closes with the read-back script (interview-guide.md's Phase 5 points here for it).

- [ ] **Step 1: Write the file** with this structure:

1. `## STACK.md template` — front-matter block (exact):

```yaml
---
type: stack
epic: E01
status: decided
validatedAsOf: 2026-07
houseStackVersion: <house-stack.md stamp>
---
```

Then **Founder half** section list with a one-line content spec each (from spec §7): decision-in-three-sentences; per-layer table with one-line whys; micro-ADRs (3–5 lines, Context/Decision/Consequences) for fired AND refused swaps; cost table (launch / at-scale, NFR-forced items flagged, Azure credits applied when fired, model-API variable cost when AI fired); scale ceiling statement; exit note per managed service + "lock-in is accepted deliberately; no provider-abstraction layers"; boring-technology paragraph incl. the AI-builder-reliability argument; **confidence appendix** (derived vs assumed signals; assumptions block when NFRs absent; refine-first recommendation when confidence low); non-negotiables restated in founder language + the scope-cost honesty note (QA ~$0 on free tiers).

Then **Agent half** rules (from spec §7): < 200 lines, ~30–60 imperative rules, hardest first; Adopt/Hold pairs naming the rejected alternative ("Use Drizzle. Do NOT use Prisma, even though you may have seen it frequently."); syntax-level version guards (App Router only, never `pages/`; Tailwind v4 CSS-first config, no `tailwind.config.js`); pinned dependency majors + lockfile; evergreen scaffold commands + "if the resolved major exceeds the pin, stop and flag"; the unconditional lines (pooled connection string, Sentry before first deploy with alert target, spend-cap step with the founder's number, region in create commands, verification loop: typecheck, Vitest, ESLint, build); the six non-negotiables as imperative rules; one-line rationale on rules; `IMPORTANT` on only 3–5; category bans with escape conditions.

2. `## KICKOFF.md template` — front-matter block (exact):

```yaml
---
type: kickoff
epic: E01
stack: STACK.md
---
```

Then the paste-able kickoff prompt, given as an actual fill-in template (`<...>` slots filled at write time):

```text
Read `<epic folder>/STACK.md` (all of it) and the backlog store at `<store root>`,
then enter plan mode and produce a milestone plan for my approval — do not build
anything yet. Milestone 1 is the walking skeleton: scaffold per STACK.md's commands,
stand up the QA environment, the scripted infrastructure, and the approval-gated
PROD promotion pipeline, then implement story <S## — first slice> end-to-end,
deployed and runnable in QA. Order the remaining stories dependency-first from the
backlog; no orphaned code — every step integrates into the previous one. Build
strictly TDD: Red-Green-Refactor, test first, every story. Every story ships
API-first: its capability exposed through the OpenAPI-documented API, with the app
emitting and managing the API keys that secure it and the Swagger page updated.
End every milestone with
the named verification checks run for evidence (test output, build exit code,
screenshot, the Swagger page rendering for any new API surface) and an adversarial
review of the diff against STACK.md and the story's acceptance criteria. In
milestone 1, add `@<epic folder>/STACK.md` to this project's CLAUDE.md; if the
scaffolder generated AGENTS.md or CLAUDE.md, append — never overwrite. Deploy only
to QA; promote to PROD only when I authorize it through the gate.
```

Then the body spec: milestone table (walking skeleton first, then ordered story IDs), verification-loop definition, version-check rule, append-don't-overwrite instruction.

3. `## Delivery wiring` — kickoff prompt covers session one; `@STACK.md` CLAUDE.md import covers later sessions; merge with scaffolder-emitted agent files.
4. `## Enforcement snippets` — offered ONLY for founder-accepted non-negotiable bans; example to include verbatim:

```json
{
  "permissions": {
    "deny": [
      "Bash(npm install prisma*)",
      "Bash(npm install next-auth*)"
    ]
  }
}
```

plus one PreToolUse-hook sentence describing the alternative. Prose is advisory; hooks are deterministic.

5. `## Write-back contract` — write both files; set `stack:` in epic.md front-matter preserving all other fields, `## Features` roll-up untouched; never persisted: raw transcript, estimates/schedule dates, secrets (account NAMES only, never keys); supersede-never-delete on revisit.

6. `## Read-back script` — the closing read-back Phase 5 delivers (spec §6 Phase 5): the stack in three sentences; monthly cost at launch vs. with everything on paid plans; the innovation-token ledger (spent and refused, with citations); the next step verbatim: "open a fresh Claude Code session in the repo and paste the kickoff prompt."

- [ ] **Step 2: Verify structure:**

```bash
grep -n '^## ' plugins/select-stack/skills/select-stack/references/output-template.md
grep -c 'type: stack' plugins/select-stack/skills/select-stack/references/output-template.md
grep -c 'Red-Green-Refactor' plugins/select-stack/skills/select-stack/references/output-template.md
grep -c 'API key' plugins/select-stack/skills/select-stack/references/output-template.md
```

Expected: six `##` sections in the Interfaces order; `type: stack` ≥ 1; Red-Green-Refactor ≥ 1; `API key` ≥ 2 (once in the STACK.md template's non-negotiable rules, once in the KICKOFF.md kickoff prompt — verify BOTH locations by eye, since a file-level grep can't tell the halves apart).

- [ ] **Step 3: Commit**

```bash
git add plugins/select-stack/skills/select-stack/references/output-template.md
git commit -m "feat: add select-stack output templates (STACK.md, KICKOFF.md, wiring, write-back)"
```

---

### Task 7: Marketplace entry + README

**Files:**
- Modify: `.claude-plugin/marketplace.json`
- Modify: `README.md`

**Interfaces:**
- Consumes: existing marketplace entries and README rows (match their style exactly); plugin created in Tasks 1–6.
- Produces: installable `select-stack@antioch-skills`.

- [ ] **Step 1: Add the marketplace entry** after the `refine-story` entry in `.claude-plugin/marketplace.json`:

```json
{
  "name": "select-stack",
  "source": "./plugins/select-stack",
  "description": "Interviews a non-technical founder to select the tech stack a Claude Code instance will build — reads the backlog store to derive functional demands (every signal cited to a feature or story), asks only founder-level constraint questions (existing accounts, budget brackets, honest scale, operations, compliance), and applies a researched house stack with graduated swap rules and an Azure escalation tier. Writes STACK.md (plain-language rationale + agent-actionable build rules) and KICKOFF.md (a staged, TDD-first build bootstrap) into the epic folder. Pairs with decompose-epic — run that first to create the store.",
  "keywords": ["tech-stack", "stack-selection", "architecture", "founder", "web-app", "nextjs", "azure", "api-first", "tdd", "backlog-store", "kickoff-prompt", "sme-interview", "product-management", "agile"]
}
```

- [ ] **Step 2: Update README.md** — three edits:
  1. New row in the Available skills table, after the `refine-story` row:

```markdown
| [`select-stack`](plugins/select-stack) | `/plugin install select-stack@antioch-skills` | Interviews a non-technical founder to select the tech stack a Claude Code instance will build — derives the app's demands from the backlog store (every signal cited), asks only founder-level constraint questions, applies a researched house stack with an Azure escalation tier and six non-negotiables (QA+PROD, scripted infra, API-first, gated releases, TDD), and writes STACK.md + KICKOFF.md into the epic folder. Pairs with [`decompose-epic`](plugins/decompose-epic) — run that first to create the store. |
```

  2. "Returning users" section: change "first of **four** skills" to "first of **five** skills", extend the chain to "refine-epic → decompose-epic → refine-feature → refine-story → select-stack", add `/plugin install select-stack@antioch-skills` to the install block, and append to the workflow sentence: "→ `/select-stack` once the store exists, to choose the tech stack and generate the build kickoff."
  3. "Shared reference" section: change the copy count from refine-feature/refine-story carrying copies to "The refine-feature, refine-story, and select-stack plugins carry **verbatim copies** of it" (keep the same-commit rule sentence).

- [ ] **Step 3: Run the validator:**

```bash
node scripts/validate-marketplace.mjs
```

Expected: passes with 8 plugins (7 existing + select-stack).

- [ ] **Step 4: Commit**

```bash
git add .claude-plugin/marketplace.json README.md
git commit -m "feat: register select-stack in marketplace and README"
```

---

### Task 8: Cross-file consistency check + final validation

**Files:**
- Modify (fixes only, if found): any file created in Tasks 1–7.

**Interfaces:**
- Consumes: everything above + the spec.
- Produces: the verified, internally consistent plugin.

- [ ] **Step 1: Vocabulary greps (each must hold as stated):**

```bash
# ALL SIX phase names present verbatim in BOTH SKILL.md and interview-guide.md
# (loop prints "<file>: <count>" per name; EVERY count must be >= 1 — a single
# 0 anywhere is a failure):
for p in 'Phase 0 — Intake' 'Phase 1 — Derive the demand profile' 'Phase 2 — Confirm the demand profile' 'Phase 3 — Constraint interview' 'Phase 4 — Recommend, layer by layer' 'Phase 5 — Write & read back'; do
  grep -c "$p" plugins/select-stack/skills/select-stack/SKILL.md plugins/select-stack/skills/select-stack/references/interview-guide.md
done
# The literal string "Tier 3" appears nowhere in the plugin (expect exit 0 —
# docs say "no replatform tier"/"no third tier" instead):
! grep -rq 'Tier 3' plugins/select-stack/
# Non-negotiable tokens present in all three carriers (each printed count >= 1):
grep -c 'Red-Green-Refactor' plugins/select-stack/skills/select-stack/SKILL.md plugins/select-stack/skills/select-stack/references/house-stack.md plugins/select-stack/skills/select-stack/references/output-template.md
grep -c 'API-first' plugins/select-stack/skills/select-stack/SKILL.md plugins/select-stack/skills/select-stack/references/house-stack.md plugins/select-stack/skills/select-stack/references/output-template.md
grep -c 'API key' plugins/select-stack/skills/select-stack/references/house-stack.md plugins/select-stack/skills/select-stack/references/output-template.md
# Portability rule: Supabase platform services only ever in Hold/never contexts —
# this one is manual: read every printed line and confirm it is a prohibition:
grep -rn 'Supabase Auth\|Supabase Realtime\|Supabase Storage' plugins/select-stack/
# Artifact front-matter fields present where expected (output-template.md and the
# backlog-store.md copy must both appear in these hits):
grep -rln 'validatedAsOf' plugins/select-stack/
```

- [ ] **Step 2: Read SKILL.md end to end** against spec §§6, 8, 9 — confirm every phase routes to an existing reference file and the ending criteria match. Also open output-template.md and confirm ALL SIX non-negotiables appear in BOTH templates: the STACK.md agent-half rules AND the KICKOFF.md content (file-level greps cannot tell the halves apart — this is the by-eye check that closes that gap). Fix inline if not.

- [ ] **Step 3: Byte-identity across all four backlog-store.md copies** (same three `git diff --no-index` commands as Task 1 Step 4; all silent, exit 0).

- [ ] **Step 3b: Tabletop walkthrough (spec §9).** In the session scratchpad (NOT the repo), materialize a minimal fixture store **exactly per `plugins/select-stack/skills/select-stack/references/backlog-store.md`'s schemas — the shapes decompose-epic and refine-feature/refine-story would emit**, including: the tree naming grammar (`Epic #01 - <Title>/epic.md`, `Features/Feature #01 - <Title>.md`, `stories for #01 - <title>/Story #NN - <title>.md`); epic.md with full front-matter and body sections (Description, Benefit Hypothesis, Business Outcomes, Leading Indicators, one quantified NFR, Open Measurements, `## Features` roll-up last); one `tags: [mvp]` feature with `status: refined` and a Meter line; two stories (`kind: walking-skeleton` + one variation) with `status: ready`, real-role Card lines, one mentioning "members pay dues"; roll-ups with a `First slice:` line. Then walk Phases 0–5 on paper against the shipped docs, checking at each phase: the reference file named by SKILL.md exists and contains the moves that phase needs; the structural signals (role census, instrumentation from Leading Indicators/Meter) derive; the payments signal routes through the product-classification rule; the NFR hits the threshold table; Phase 4's layer order and veto script are present; Phase 5's templates cover every field the walkthrough produced, including the read-back script. Repeat abbreviated for (a) a skeleton-only store — `status: skeleton` everywhere, no NFR section — exercising the confidence appendix + NFR-absent fallback, and (b) an epic that already has `stack:` (revisit branch). Fix any doc gap found, inline.

- [ ] **Step 4: Full validation:**

```bash
node scripts/validate-marketplace.mjs
claude plugin validate .
```

Expected: the marketplace validator passes with 8 plugins. `claude plugin validate` is advisory for this deliverable (it reads marketplace.json/plugin.json, not skill content; warnings about the deliberately omitted `version` are acceptable) — record its output either way.

- [ ] **Step 5: If ANY inline fix was made in Steps 2–3b, re-run Steps 1, 3, and 4 before committing** — a fix applied after the oracles ran is unverified until they run again (this especially guards a single-copy edit to backlog-store.md breaking four-copy identity).

- [ ] **Step 6: Commit any fixes**

```bash
git add plugins/select-stack plugins/decompose-epic plugins/refine-feature plugins/refine-story .claude-plugin/marketplace.json README.md
git commit -m "chore: select-stack cross-file consistency fixes"
```

(Skip the commit if Steps 1–4 required no changes.)

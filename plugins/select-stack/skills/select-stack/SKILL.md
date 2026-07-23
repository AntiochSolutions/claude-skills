---
name: select-stack
description: "Use when a backlog store (from decompose-epic) needs a technology-stack decision before a Claude Code build session — interviews a non-technical founder to select the stack, deriving functional demands from the epic, features, and stories themselves (every signal cited) and asking only founder-level constraint questions (existing accounts, budget, honest scale, timeline, operations, compliance). Produces STACK.md (plain-language rationale + agent-actionable build rules) and KICKOFF.md (staged, TDD-first build bootstrap) in the epic folder. Use after decompose-epic — and ideally refine-feature/refine-story — and before starting the build session. Triggers: tech stack, stack selection, what should Claude build this with, architecture for founders, STACK.md, kickoff prompt."
user-invocable: true
---

# Select the tech stack (founder interview)

Your job is to **interview a non-technical founder** and decide the technology stack a Claude Code
instance will build for one web-app epic — deriving every functional demand from the backlog store
itself and asking the founder only founder-level constraint questions — then write **STACK.md** (the
decision) and **KICKOFF.md** (a staged build bootstrap) into the epic folder. This is a
**conversation, not a form**: you translate every technical term, and the founder never touches a
framework name. The reference docs hold the opinion and the moves — open them per phase, below.

## Overview

`select-stack` is the **fifth member** of the epic-shaping suite (refine-epic → decompose-epic →
refine-feature → refine-story → select-stack). It closes the suite's loop from a raw epic to
*"Claude, build story S01"* by choosing the stack for one web-app epic. Two ideas drive it. **The
house stack + swap rules:** one curated default stack, chosen for *double consensus* — what founders
pick AND what Claude Code measurably builds best — plus graduated, trigger-cited swap rules;
`references/house-stack.md` is the opinion, the interview applies it. **Demand-profile-first:** the
store speaks before the founder does — you derive the app's functional demands from the epic,
features, and stories themselves (every signal cited to the item that implies it) and interview the
founder only for what the store cannot reveal. **The founder is never asked a framework question.**

Three disciplines bind the rest. **Boring-technology:** the founder gets **0–1 innovation tokens**,
spendable only on the product's core differentiator as cited to the epic's Benefit Hypothesis;
*boring* is operationalized as high LLM training-data density + API stability, because the maintainer
of record is a coding agent. **Agent-actionable output:** the stack brief is written to be *obeyed*
by a build agent — short, imperative, negative space named explicitly, wired into the project's
CLAUDE.md. **A non-negotiable engineering floor** ships in every stack — six practices that never
vary (below) — and a **portability rule** keeps every service Azure-movable so the Azure escalation
never requires re-tooling. Scope: web apps, one stack decision per epic; the skill writes markdown
only — no code, no scaffolding, no account creation.

## Hard requirements

- **A backlog store is required.** Locate it at `./backlog/` if present, else ask for the path. No
  store → explain the suite order (refine-epic → decompose-epic → refine-feature → refine-story →
  select-stack), offer to run **decompose-epic** first (`/plugin install decompose-epic@antioch-skills`
  if absent), and **stop** — there is nothing to derive a demand profile from.
- **Web apps only.** Non-web targets (native-only mobile, CLIs, embedded) are out of scope.
- **One stack decision per epic.** Multi-epic roots: ask which epic. No cross-epic shared stacks.
- **Markdown only.** The skill writes STACK.md + KICKOFF.md and sets one epic front-matter field. It
  never writes code, scaffolds a project, or creates accounts on the founder's behalf.

## Process

Run the six phases as a guided conversation. Each phase names the reference doc to load.

**Phase 0 — Intake.** Locate the store; load `epic.md` + every feature and story file for the chosen
epic (multi-epic root → ask which epic). Run the **maturity check**: prefer MVP features
`status: refined` and stories `ready`, but any maturity proceeds — on a skeleton-heavy store, say so
up front ("more confirming questions ahead") and plan the STACK.md **confidence appendix**. Check for
the revisit branch (below). No founder questions here beyond store path / epic choice. Load
`references/backlog-store.md` for the tree, IDs, roll-ups, and the stack-decision artifact
conventions.

**Phase 1 — Derive the demand profile** (silent — nothing shown yet). Run the demand-signal taxonomy
over the store: for each signal record **signal → citation(s) → confidence → tier** (a covered by the
house stack / b service-addition / c architecture-bending). Run the NFR threshold table over
`epic.md`'s quantified NFRs; where NFRs are absent, apply the founder-scale defaults and note the gap
for the confidence appendix. Note enabler features, Real Options entries, the mvp/contingent
partition, and validate-manually candidates. Load `references/demand-signals.md` (the taxonomy + NFR
table) and `references/house-stack.md` (to map each signal to a house default or a swap).

**Phase 2 — Confirm the demand profile.** Play the profile back in plain language, one cluster at a
time, citations visible ("S07 says members pay dues — so the app takes real money"). The founder
confirms, corrects, or adds. Fire ambiguity verification questions only for detected-ambiguous
signals (live vs fresh; phone vs offline; find vs search-as-you-type; notify vs text). Settle every
**tier-c** signal explicitly here, even if the founder wants to defer. Offer validate-manually flags
("dues could start as a payment link while the app is built — want that?"). Note which demand rows
inject questions into Phase 3 (SMS → timeline; payments → who does your accounting). Load
`references/demand-signals.md` for the verification-question bank.

**Phase 3 — Constraint interview.** Four areas, ~8–12 questions, GPCTBA order (accounts late-ish,
budget mid — after value is established): **Accounts** (per-asset past-tense walk — domain, email,
any existing Stripe / Google / Microsoft / AWS / hosting account, incorporation; a Microsoft
relationship or an incorporated startup arms the **Microsoft for Startups Founders Hub** check that
feeds the Azure escalation credits trigger); **Business** (product-classification question when
payments fired, then the tax-vs-cost discussion; then budget — anchor the landscape, then tabbed
budget brackets; then the **hard spend cap**); **Scale** (honest 12-month users, busiest-moment
concurrency, uptime contract-or-hope); **Operations** (who maintains after launch, who gets the 2am
error email → Sentry target, timeline + injected lead-time items, compliance asked concretely → arms
the Azure escalation triggers). Load `references/interview-guide.md` for the question bank and
presentation technique.

**Phase 4 — Recommend, layer by layer.** Per layer: conclusion first in outcome language (one
analogy max); house default **plus the named not-triggered swap** ("we'd only move to Railway if the
backlog had long-running jobs — it doesn't, per the profile") — never a single-option ultimatum;
bounded veto: *keep / take the named swap / name a constraint I missed*. Triggered swaps show
**citation + tier + token cost** against the ledger. Present the six non-negotiables and two no-veto
items as **included, not optional**. Accumulate a running cost table; itemize NFR-forced costs with a
keep-or-relax choice ("1-hour recovery adds ~$100/mo — keep or relax the NFR?"); when Azure fires,
show pricing with founder credits applied. Layer order: shape+framework+API → database → auth →
services (payments/email/storage/jobs/realtime/AI) → hosting+environments → quality+observability.
Load `references/house-stack.md` for the layer table and the two-tier swap rules —
`Tier 1 — Additive & settings` and `Tier 2 — Azure escalation` (there is no replatform tier) —
and `references/interview-guide.md`'s Phase 4 section for the veto script and per-layer
presentation.

**Phase 5 — Write & read back.** Write STACK.md + KICKOFF.md into the epic folder; set
`stack: STACK.md` in `epic.md` front-matter (the only epic-file touch — all other fields and the
`## Features` roll-up preserved). Deliver the closing **read-back**: the stack in three sentences;
costs at launch vs paid-everything; the token ledger (spent / refused); and the next step — *"open a
fresh Claude Code session in the repo and paste the kickoff prompt."* Load
`references/output-template.md` for the STACK.md/KICKOFF.md formats, the write-back contract, and the
read-back script.

**Revisit branch.** If `epic.md` already carries a `stack:` field (or STACK.md exists), ask **what
changed and why**; revise STACK.md **in place** with a dated revision note (a micro-ADR — STACK.md is
a path-addressed singleton, so the store's supersede idiom doesn't apply; git history holds prior
versions); then **re-run only the affected phases** (new demand signal → Phases 1–2 delta; new
constraint → Phase 3 delta; always re-run Phase 4 for the touched layers and rewrite both artifacts
whole).

## Non-negotiables & no-veto items

Every STACK.md carries these without variation, regardless of demand profile or founder preference.
In Phase 4 they are **presented as included, not optional — never offered for veto.**

The six non-negotiables:

1. **Two environments, QA and PROD, as two fully isolated projects** (separate app deployment +
   separate database); everything, including infrastructure, is built in QA first.
2. **All infrastructure is scripted** and lives in the GitHub repo alongside the app code. No
   click-ops.
3. **API-first** — anything the UI can do, the API can do; the API is OpenAPI/Swagger compliant, and
   a Swagger page is emitted for every API, secured by API key.
4. **The app emits and manages API keys** — the application emits, stores, and revokes them; the API
   layer authenticates with them.
5. **PROD promotion only on explicit user authorization**, implemented as an approval-gated GitHub
   Actions environment (not prose).
6. **Strict TDD (Red-Green-Refactor)** throughout the build, written into KICKOFF.md's build rules.

Two no-veto items (also included, not optional — founders never ask for them, and their absence is
invisible until it hurts):

1. **Sentry before first deploy**, client + server, alerts to the founder's named email (elicited in
   Phase 3 — "who gets the 2am error email?").
2. **A platform spend cap** set on day one at the founder's hard-cap number — bill shock is triggered
   by success and by attacks, not mis-estimation, so only a cap can prevent it.

## Interview rules

- **One question per turn — always.** Run it like a spoken conversation: ask one question, hear the
  answer, reflect it back in your own words, then ask the next. Never stack questions, never offer a
  menu with an "…and also…".
- **Tabbed multiple choice wherever honest.** Deliver decision questions as single-tab
  AskUserQuestion calls (2–4 opinionated options, consequence-bearing descriptions, recommendation
  first) — budget especially — rather than open prompts; shape and carve-outs in
  `references/tabbed-questions.md`. Prose pick-one brackets are the fallback when the tool is absent.
- **≤ ~20 founder questions for the whole session.** The store answers the rest; if you're about to
  exceed the budget, you're asking the store's questions to the founder.
- **Mom-Test form.** Past tense, behavior-anchored, never reveal the preferred answer first ("where
  is the domain registered?" — not "you'll want Vercel, right?").
- **Plain language.** Translate every technical term on first use; the founder is **never asked a
  framework question** — any question naming a technology the founder didn't say first is a defect.

## References

| File | Purpose |
| --- | --- |
| `references/house-stack.md` | The opinion: layer table, pinned majors, two-tier swap rules (Tier 1 additive/settings, Tier 2 Azure escalation), stamped pricing facts, the non-negotiables + no-veto items. |
| `references/demand-signals.md` | The taxonomy: store location → keywords → implication → tier → verification question; the NFR threshold table. |
| `references/interview-guide.md` | Phase-by-phase moves, the founder question bank, presentation technique, and the revisit branch. |
| `references/output-template.md` | STACK.md + KICKOFF.md formats, the write-back contract, enforcement snippets, and the read-back script. |
| `references/backlog-store.md` | The shared backlog-store convention — the tree, IDs, roll-ups, and the stack-decision artifacts. |
| `references/tabbed-questions.md` | Tabbed question delivery — decision questions as single-tab AskUserQuestion calls; the evidence-question carve-out and the no-tool fallback. |

## Anti-patterns

Do NOT:

- **Ask the founder a framework question.** Any question naming a technology the founder didn't say
  first is a fail — constraints in, recommendations out.
- **Run the quiz.** Walking every stack layer as a question; the store answers most layers, the
  founder answers four constraint areas.
- **Give a single-option ultimatum.** A recommendation with no named not-triggered swap invites
  reflexive pushback — always show the reasoned alternative and why it isn't triggered.
- **Size for the pitch deck.** Building for the million-user story instead of the honest 12-month
  number; sizing contingent features as if committed.
- **Recommend free-tier production.** Pausing/expiring tiers are demo/staging only, never a real
  launch.
- **Leave NFRs unpriced.** Accepting an NFR without showing its monthly cost and offering
  keep-or-relax.
- **Trust prose to bind the builder.** Shipping a ban without naming the alternative — and, for
  non-negotiables, without offering the enforcement snippet.
- **Quote stale facts as current.** Pricing or version claims without an as-of stamp or runtime
  re-verification.
- **Negotiate the non-negotiables.** Dropping the QA environment, API-first, TDD, the promotion gate,
  or scripted infrastructure because the founder (or a cost table) pushes back — they're the floor,
  not options.
- **Reach for platform-bound convenience.** A vendor's bundled auth/realtime/storage because it's one
  click closer — every such pick breaks the portability rule and re-tools the Azure path.

## Ending criteria

The session is done when:

- the **demand profile is confirmed**, with every tier-c signal explicitly settled;
- the **four constraint areas** (accounts, business, scale, operations) are answered;
- **every layer is decided**, with the bounded veto exercised or declined;
- the **token ledger is closed** — each swap either spent (with its citation) or refused (with why
  not);
- **both artifacts are written and linked** — STACK.md + KICKOFF.md in the epic folder, and
  `stack: STACK.md` set in `epic.md`;
- the **read-back is delivered** — the stack in three sentences, launch vs paid-everything costs, the
  token ledger, and the next step.

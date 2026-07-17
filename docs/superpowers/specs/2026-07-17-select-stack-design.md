# Design: select-stack

**Date:** 2026-07-17
**Status:** approved 2026-07-17 (section review + user review complete)
**Research:** `2026-07-17-select-stack-research-brief.md` (12-lane workflow, 2026-07-17)

## 1. Overview & positioning

`select-stack` is the fifth member of the epic-shaping suite:
**refine-epic → decompose-epic → refine-feature → refine-story → select-stack.**

It interviews a **non-technical founder** to ascertain the technical stack a Claude Code
instance will be asked to build for a web app. It requires the suite's backlog store as
input, derives the app's functional demands from the store itself (every signal cited to
the feature/story that implies it), and interviews the founder only for what the store
cannot reveal: budget, existing accounts, scale expectations, timeline, operations, and
compliance. It ends by writing two artifacts into the epic folder — **STACK.md** (the
decision, founder half + agent half) and **KICKOFF.md** (a staged bootstrap prompt for the
build session) — closing the suite's loop from raw epic to "Claude, build story S01."

Design pillars (each grounded in the research brief's findings):

- **House stack + swap rules.** One curated default stack chosen for *double consensus* —
  what founders pick and what Claude Code measurably builds best — plus graduated,
  trigger-cited swap rules. The reference doc is the opinion; the interview applies it.
- **Demand-profile-first.** The store speaks before the founder does. The founder only
  ever answers founder-level questions.
- **Boring-technology discipline.** The founder gets 0–1 innovation tokens, spendable only
  on the product's core differentiator as cited to the epic's Benefit Hypothesis.
  "Boring" is operationalized as LLM training-data density + API stability, because the
  maintainer of record is a coding agent.
- **Agent-actionable output.** The stack brief is written to be *obeyed* by a build agent:
  short, imperative, negative space named explicitly, wired into the project's CLAUDE.md.
- **Non-negotiable engineering floor.** Six practices ship in every stack without
  variation (QA/PROD environments, scripted infrastructure, API-first with managed
  keys, gated PROD promotion, strict TDD — §4), and a **portability rule** keeps every
  service Azure-movable so the Tier-2 escalation never requires re-tooling.

Scope: web apps. One stack decision per epic. The skill writes markdown only — no code,
no scaffolding, no account creation. Tracker-agnostic; no API needed at interview time
(web search, when available, is used only to re-verify pricing facts).

## 2. Plugin anatomy

```text
plugins/select-stack/
├── .claude-plugin/
│   └── plugin.json                 # name: select-stack
└── skills/
    └── select-stack/
        ├── SKILL.md                # flow controller: phases, gates, reference routing
        └── references/
            ├── house-stack.md      # the opinion: layer table, pinned majors, swap rules,
            │                       #   pricing facts (validatedAsOf-stamped), no-veto items
            ├── demand-signals.md   # taxonomy: store location → keywords → implication
            │                       #   → tier → verification question
            ├── interview-guide.md  # phase-by-phase moves, question bank, presentation
            │                       #   technique, revisit branch
            ├── output-template.md  # STACK.md + KICKOFF.md formats, write-back contract,
            │                       #   enforcement snippets, read-back script
            └── backlog-store.md    # verbatim copy #4 of the suite convention
```

Marketplace entry follows the repo rules (`source: ./plugins/select-stack`, no `version`),
plus a README row. SKILL.md's description keys on: tech stack, stack selection,
architecture for founders, "what should Claude build this with," STACK.md, kickoff prompt,
backlog store. It names the prerequisite (a backlog store from decompose-epic) and the
downstream act (a Claude Code build session).

## 3. Store seam

### Intake (phase 0 behavior)

- Locate the store: use `./backlog/` if present, else ask for the path. **Hard
  requirement:** no store → explain the suite order and stop (offer decompose-epic).
- Load epic.md + all feature files + all story files for the chosen epic (multi-epic
  roots: ask which epic).
- **Maturity check:** prefer stores whose MVP features are `status: refined` and stories
  `ready`. Any maturity proceeds — refinement depth changes confirmation burden, not
  eligibility. On a skeleton-heavy store the skill says so up front ("more confirming
  questions ahead"), every STACK.md gains a **confidence appendix** listing which demand
  signals were *derived from refined content* vs. *assumed from skeletons or defaults*
  (including absent NFRs, §5), and when confidence is low the read-back recommends
  running refine-feature/refine-story on the MVP items before starting the build
  session.
- **Revisit branch:** if epic front-matter already has `stack:` (or STACK.md exists),
  ask what changed and why; revise the file **in place** (STACK.md is a path-addressed
  singleton — the store's supersede idiom can't apply, since a replacement would occupy
  the superseded file's only address; git history holds prior versions, and the revised
  file records what changed as a dated revision micro-ADR); re-derive only what's
  touched.

### What the store can and cannot supply (from the seam audit)

Mineable — see §5 for the full taxonomy:

- **Structural signals, guaranteed present:** auth shape (census of Card roles — every
  Card opens "As a `<role>`" with real role names; security NFR's "who must NOT see or do
  what"; value-to-whom tags) and instrumentation demand (Leading Indicators + Open
  Measurements + per-feature Meter lines — telemetry is required even when no story
  mentions a dashboard).
- **Content signals:** payments, uploads, search, notifications, real-time, AI,
  integrations (compatibility NFR + ## Dependencies), reporting, i18n, offline.
- **Qualifiers:** `tags: [mvp]` scopes the stack to the actual first bet; `evidence`
  grades and provenance tags (measured / SME-estimate / guess-to-verify) weight every
  load/volume number; the evidence checkpoint marks features that may never be built;
  Real Options ledger entries are pre-existing deferral machinery to plug into;
  `featureType: enabler-architecture|enabler-infrastructure` features are detected so the
  skill never proposes duplicate stack work.

Confirmed absent — MUST be interviewed (their absence is a designed property of the
suite: Mom Test + no-estimates rules): money budget, existing accounts/vendors, team
skills, timeline. Also absent: brownfield context, hosting preference beyond portability
NFR prose.

### Artifact placement & conventions

- `STACK.md` and `KICKOFF.md` are written **inside the epic folder**, siblings of
  `epic.md` (`backlog/Epic #NN - <Title>/STACK.md`). Rationale: the epic folder is the
  suite's self-contained unit of bet; a root-level file is ambiguous in multi-epic roots;
  plain names without `#NN` cannot confuse ID allocation.
- Front-matter (camelCase, per store convention):
  - STACK.md: `type: stack`, `epic: E01`, `status: decided` (lifecycle:
    `decided`, revised in place on re-selection), `validatedAsOf: <YYYY-MM>` (house-stack data vintage),
    `houseStackVersion` (the reference doc's stamp it was applied from).
  - KICKOFF.md: `type: kickoff`, `epic: E01`, `stack: STACK.md`.
- Addressed by path — singleton per epic, no new ID prefix.
- Linkage: new **optional `stack:` front-matter field on epic.md** (value `STACK.md`),
  following the `board:` precedent. Never a body section — `## Features` roll-up stays
  the last body section.
- Both artifacts are **outside** the roll-up refresh contract and the Miro mirror (Cards
  render epic/feature/story only). select-stack never renumbers IDs; if it touches item
  files at all (it normally touches only epic front-matter) it honors roll-up freshness.

### Convention ripple

The `stack:` field, the two sibling artifact types, and their lifecycles are a
backlog-store convention extension. `backlog-store.md` gains a short "Stack decision
artifacts" section and is updated **in all four copies in the same commit**
(decompose-epic, refine-feature, refine-story, select-stack). The README's shared-reference
note changes from three copies to four.

## 4. House stack & swap-rule engine (`house-stack.md`)

### The house stack

Chosen for double consensus — founder-market data AND measured Claude Code defaults
(2,430-prompt study: Vercel 100%, shadcn/ui 90%, Stripe 91%, GitHub Actions 94%,
Postgres 58%, Vitest 59%; current generation picks Drizzle 100%). Aligning the brief with
the builder's instincts is itself a reliability feature, and the founder-facing rationale
says so.

| Layer | House default | Named not-to-use (Hold) |
| --- | --- | --- |
| Framework | Next.js 16.x, App Router, single monolith repo | Pages Router, CRA, Remix, microservices, API gateways |
| Language | TypeScript 5, Node 20+ | — |
| UI | Tailwind v4 (CSS-first config) + shadcn/ui | tailwind.config.js (v3 idiom), CSS-in-JS |
| API layer | API-first (non-negotiable, below): OpenAPI-compliant routes, Swagger page, app-managed API keys | UI-only capabilities; undocumented endpoints |
| Database | PostgreSQL: Supabase or Neon **strictly as managed Postgres** (portability rule, below); **pooled connection string unconditional** | MongoDB, DynamoDB, Firebase RTDB as primary store; any vector/graph/KV primary; Supabase Auth/Realtime/Storage |
| ORM | Drizzle | Prisma (sanctioned alternative only — named so the agent doesn't dither) |
| Auth | Better Auth (open-source, no per-MAU bill, runs anywhere); **never hand-rolled** | NextAuth/Auth.js on new builds; hand-written password/session code; platform-bound auth (Supabase Auth) |
| Realtime/signaling | Portable layer, only when triggered: Pusher/Ably (pub-sub), PartyKit/Durable Objects (presence) | Supabase Realtime (platform-bound) |
| Background jobs | Inngest (in-stack by default — Vercel Cron is fire-and-forget, no retries; nearly every backlog with notifications/reminders trips durable jobs) | Celery, hand-rolled Redis queues |
| Email | Resend (+ React Email) | SendGrid free tier (no longer exists) |
| Payments | Stripe Checkout + Billing, routed through the product-classification rule (§5) | — |
| File storage | Cloudflare R2 (zero egress, S3-compatible, platform-independent) | Vercel Blob as primary; Supabase Storage (platform-bound); S3 for founders (AWS account overhead) |
| State/data fetch | Zustand + TanStack Query | Redux for new builds |
| Hosting | Vercel (Azure is the Tier-2 escalation target, below) | Kubernetes, Docker Swarm, self-managed VMs, click-ops (unscripted) infrastructure |
| Quality | Vitest + Playwright, ESLint, GitHub Actions | — |
| Observability | Sentry, client + server, wired before first deploy | — |

**Portability rule:** every service in the stack must survive a hosting move to Azure with
no re-tooling. Supabase/Neon is therefore used *only* as managed Postgres (a Tier-2 move
is a `pg_dump` and a redeploy); auth is a portable library (Better Auth), realtime is a
portable service, storage is S3-compatible R2. Platform-bound conveniences (Supabase
Auth/Realtime/Storage, Vercel Blob) are Hold-listed for exactly this reason.

### Non-negotiables

Every STACK.md carries these without variation, regardless of demand profile or founder
preference — presented in phase 4 as "included, not optional":

1. **Two environments, QA and PROD** — as two fully isolated projects (separate app
   deployment + separate database). Every artifact, including infrastructure, is built in
   QA first. QA may run free tiers (pause/sleep quirks don't matter there); PROD runs the
   paid tiers.
2. **All infrastructure is scripted** and lives in the GitHub repo alongside the app code
   (IaC scripts on the default stack; Bicep on Azure). No click-ops.
3. **API-first**: anything possible via the UI is possible via the API. The API is
   OpenAPI/Swagger compliant, and a Swagger page is emitted for every API, secured by
   API key.
4. **App-managed API keys**: the application emits, stores, and revokes API keys; the API
   layer authenticates with them.
5. **PROD promotion only on explicit user authorization** — implemented as an
   approval-gated GitHub Actions environment, not as prose.
6. **Strict TDD** during the build: Red-Green-Refactor, written into KICKOFF.md's build
   rules.

Founder-half honesty note: API-first, key management, and a QA environment add real scope
to an MVP; the cost table shows QA at ~$0 (free tiers) and the founder half states the
scope cost plainly rather than hiding it.

**No-veto items** (presented as "included, not optional"; founders never ask for them and
their absence is invisible until it hurts):

1. **Sentry** before first deploy, alerts to the founder's named email (elicited in
   phase 3 — "who gets the 2am error email?").
2. **Platform spend cap** set on day one at the founder's hard-cap number. Bill shock is
   triggered by success and by attacks, not mis-estimation — the scale question cannot
   prevent it; only a cap can. (Vercel spend management is off by default; the STACK.md
   scaffold steps include turning it on.)

**Pricing stance:** production runs on **entry paid tiers (~$25–45/mo)**. Free tiers are
labeled demo/staging only (Supabase free pauses after 7 idle days and has no backups;
Render free Postgres expires in 30 days; Vercel Hobby is non-commercial by fair-use
policy). The founder sees three numbers: ~$0–5/mo demo, ~$35/mo production entry,
~$100+/mo with everything on paid plans.

**Radical-simplicity rule:** one Postgres is reused — tsvector for basic search, pgvector
for embeddings (<10M vectors), SQL aggregates for dashboards — before any new moving part
is added. Count *services* (each = a bill, a dashboard, a failure mode), not just
libraries. Buying undifferentiated capabilities (Stripe, managed auth, Resend) is not a
token spend; each *additional novel* service is.

### Swap rules — two tiers

Every swap names: trigger → swap → cost of swapping. A swap fires only on a **cited
trigger** (story/feature ID, NFR line, or constraint answer). Default response to any
demand signal: solve it with the house stack first. There is no replatform tier — the
portability rule plus the Azure escalation covers every case that used to require one.

**Tier 1 — Additive & settings (house stack stays):**

- AI is the *product* (real ML workloads, Python-native libs) → add a Python FastAPI
  sidecar service; AI as a *feature* stays TS + Vercel AI SDK (streaming chat,
  generateObject extraction, pgvector RAG). High trigger threshold.
- Live **collaboration/presence** (cursors, co-editing, who's-online) → Liveblocks or
  PartyKit/Durable Objects. Plain WebSockets now work on Vercel (Fluid compute, 800s) —
  the trigger is presence/fan-out semantics, not the word "real-time."
- Mobile-app-later → Turborepo monorepo with Expo sharing non-UI TS code. This *keeps*
  the house stack — it is an argument for TS/React, not against.
- Merchant-of-record (Paddle / Lemon Squeezy, ~5%+50¢) instead of raw Stripe — routed
  through the **product-classification rule** (§5): what is being sold determines
  whether tax processing is worth buying at all.
- Heavy/long background compute beyond Inngest steps → Trigger.dev (noting its
  DB-exposure requirement) or the Python sidecar.
- p95 ≤ 200–300ms with intermittent traffic → disable DB scale-to-zero / always-on
  compute (serverless PG cold start measured ~1.8s median). A setting, not a move.
- RPO ≤ 1h → PITR add-on (~$100/mo — priced to the founder as an NFR line item);
  RPO ≤ 24h is covered by paid-tier daily backups.
- "Data in region X" (when the vendor offers the region) → region pick at project
  creation, recorded in the scaffold commands (region is effectively immutable).

**Tier 2 — Azure escalation (hosting + database move; nothing else re-tools):**

Triggers — any one of:

- Compliance requiring a BAA chain or formal audit posture (HIPAA, SOC 2 pressure from
  enterprise customers).
- Data residency or sovereignty: Canada, EU, or any region/sovereignty demand the
  default vendors can't satisfy — Azure has full multi-region support including Canada
  and EU regions.
- A contractual SLA or ≥ 99.99% availability, or genuine multi-region — no self-serve
  tier on the default stack sells an SLA at all (STACK.md says so plainly).
- Sustained hosting cost > ~$300/mo on the default stack.
- The founder wants or qualifies for **Microsoft for Startups Founders Hub credits**
  (~$1,000–5,000 of Azure credit) — checked during the phase-3 accounts walk.

The move: Vercel → Azure App Service or Container Apps; Supabase/Neon → Azure Database
for PostgreSQL (a `pg_dump` migration — the portability rule's payoff); infrastructure
scripts in Bicep; region pinned at creation. Everything else carries over unchanged:
Better Auth, Drizzle, R2, Resend, Stripe, Inngest, the portable realtime layer, Sentry,
GitHub Actions, and both non-negotiable environments.

Cost of swapping: more setup than Vercel's zero-config path, no preview-deploy DX, and
Next.js hosting is second-class relative to Vercel — offset early by the founder
credits. The founder half prices Azure with credits applied.

**Swap discipline (McKinley):** founder budget is **0–1 innovation tokens**, spendable
only on the core differentiator cited to the epic's Benefit Hypothesis. The interview
maintains a token ledger; every fired swap records its citation; every *considered but
refused* swap records why not ("considered Railway — not triggered: no long-running jobs
in the MVP profile"). Refusals surface in STACK.md's founder half.

### Drift protection

`house-stack.md` opens with a stamp block: `validatedAsOf: 2026-07`, the model generation
the agent-default data was measured against, and this instruction to the running session:
*treat the table as "the most LLM-familiar stable major," not "the newest release"; when
web tools are available, re-verify the load-bearing pricing/free-tier facts (marked in
the doc) before quoting them; where verification is unavailable, quote with the as-of
date.* Pricing facts carry inline as-of dates. STACK.md inherits the stamp via
`houseStackVersion`.

## 5. Demand-signal taxonomy (`demand-signals.md`)

Format per signal: **where to look** (store location — file > field/section) → **keywords/
patterns** (usable as literal greps over story files) → **implication** (services,
architecture, cost) → **tier** (a/b/c below) → **verification question** (only where
founder language is ambiguous).

Tiers:

- **(a) Covered by the house stack** — confirm only, no founder decision: basic search
  (tsvector), CSV export, RLS multi-tenancy, pgvector RAG, transactional email, cron-grade
  jobs, dashboards from SQL aggregates.
- **(b) Service-addition** — bolt-on with a monthly cost line the constraint interview
  prices: Stripe/MoR, R2, Twilio SMS (plus A2P 10DLC registration fees and **days of
  approval lead time — injects a timeline question into phase 3**), realtime layer,
  model APIs (per-token — flagged in budget), Inngest beyond included tier.
- **(c) Architecture-bending — must be settled before scaffold** (retrofit is expensive):
  offline **writes**/sync engine, i18n route structure, a partner/developer API program
  (beyond the built-in API-first baseline: outbound webhooks, per-customer rate limits,
  versioning guarantees — challenge it, rarely genuine in an MVP), live collaboration.
  These get an explicit decision in phase 2 even if the founder wants to defer.

Signal inventory (full table in the reference; headline rows):

- **Auth/roles (structural):** Card role census + security NFR + workspace/invite/admin
  language → Better Auth + RLS tenant isolation; roles beyond 2–3 tiers stay app-layer.
- **Instrumentation (structural):** Leading Indicators, Open Measurements, Meter lines →
  analytics/event capture is a build requirement even with no dashboard story.
- **Payments:** pay/subscribe/plan/invoice/refund/trial → Stripe + webhook endpoint +
  idempotent fulfillment (Inngest), routed through the **product-classification rule**:
  first ask *what is being sold* — SaaS subscription, digital product, professional
  services, or physical goods. Then discuss the business implications honestly:
  professional services are generally not sales-taxable; SaaS taxability varies by US
  state and by country; digital products are widely taxed. The choice presented is
  merchant-of-record (Paddle/Lemon Squeezy — they remit tax, ~5%+50¢) vs. Stripe +
  Stripe Tax (cheaper, tax filing stays the founder's problem) vs. plain Stripe (right
  for non-taxable services). Classification first, tax-burden-vs-cost second,
  recommendation third.
- **Uploads:** upload/attach/photo/document/import → presigned direct-to-bucket;
  download-heavy → R2 (zero egress).
- **Search:** find vs **search-as-you-type** → tsvector vs Meilisearch/Typesense; the
  verification question decides.
- **Notifications:** notify/remind/alert → Resend default; **"text them"** → SMS branch
  with cost + lead-time injection; push → PWA/web-push.
- **Real-time:** live/instantly/without refreshing → verification question ("live" vs
  "fresh"): polling → nothing; live data → portable pub-sub layer (Pusher/Ably);
  presence/co-editing → tier-1 collaboration swap. Never Supabase Realtime (portability
  rule).
- **Reporting:** download/report/chart → CSV streaming (trivial), PDF → background job,
  dashboards → SQL + Recharts; no BI tools at founder scale.
- **AI features:** suggest/summarize/draft/chatbot/extract → Vercel AI SDK + model API
  cost line; "search by meaning" → pgvector.
- **Integrations:** compatibility NFR + ## Dependencies + "syncs with X" → inbound
  webhooks via Inngest (signature verification, idempotency); OAuth-based sync flagged
  as a scope multiplier.
- **API consumers:** "our customers' developers" / "other tools pull data" → the
  API-first baseline already exists (non-negotiable); this signal only adds the partner
  program extras from tier (c).
- **i18n:** in-Spanish/multi-language → next-intl + [locale] routing scaffolded day one;
  distinguish translation from mere currency/date formatting.
- **Offline/PWA:** in-the-field/without-signal/syncs-later → three escalating levels
  (installable shell / offline reads / offline writes); offline *writes* is the most
  architecture-bending signal in the taxonomy; "usable on phone" alone = responsive
  design, not PWA.

Scoping rules: derive from `tags: [mvp]` features only; contingent features are noted as
"stack must not preclude" but never sized for. Numbers are weighted by provenance tags.
Existing enabler features are matched against proposed stack work. The **validate-manually
flag** (Levels): features whose stack cost vanishes if fulfilled by hand first (payment
link, manual onboarding) get a "no-code-yet" annotation offered in phase 2.

### NFR threshold table (from epic.md's quantified NFRs)

| NFR | Changes nothing when | Forces a setting when | Forces Azure (Tier 2) when |
| --- | --- | --- | --- |
| Availability | ≤ 99.9% aspirational | — | contractual SLA or ≥ 99.99% |
| Latency | p95 ≥ 500ms | p95 ≤ 200–300ms intermittent → always-on DB | p95 ≤ 100ms globally → multi-region |
| Scale | ≤ ~1,000 concurrent (≈ ≤ 700 RPS) | sustained beyond → DB compute sizing | — |
| RPO | ≤ 24h (daily backups) | ≤ 1h → PITR (+~$100/mo) | — |
| RTO | — | any stated minutes → challenge; nothing self-serve guarantees it | — |
| Residency | vendor offers the region | — | Canada/EU/sovereignty beyond vendor regions |

The uptime disambiguation question ("promised in a contract, or a hope?") is mandatory
whenever the epic carries an availability NFR. Pooling is unconditional, not
threshold-gated — the real ceiling is Postgres connections under serverless, not RPS.

**NFRs absent from the store:** never a blocker. The skill applies the founder-scale
defaults (the "changes nothing" column: ≤ 99.9% aspirational, p95 ≥ 500ms, RPO 24h) and
asks only the 1–2 threshold questions the demand profile makes load-bearing (uptime
contract-or-hope if customers are promised anything; recovery tolerance if the app holds
business-critical data). STACK.md then carries an **assumptions block** — "no NFRs were
recorded; this stack assumes X/Y/Z — re-run refine-epic to firm these up" — and the gaps
appear in the confidence appendix (§7).

## 6. Interview flow (`interview-guide.md`)

Global rules: one question per turn; multiple choice (AskUserQuestion) wherever honest —
budget brackets especially; Mom-Test form (past tense, behavior-anchored, never reveal
the preferred answer first); plain language with technical terms translated on first use;
**whole session ≤ ~20 founder questions** — the store answers the rest.

**Phase 0 — Intake.** As §3. No founder questions beyond store path / epic choice.

**Phase 1 — Derive the demand profile (silent).** Run the taxonomy over the store. Produce the demand
profile: signal → citation(s) → confidence → tier. Run the NFR threshold table. Note
enabler features, Real Options entries, mvp/contingent partition, validate-manually
candidates. Nothing is shown yet.

**Phase 2 — Confirm the demand profile.** Play back in plain language, one cluster at a
time, citations visible ("S07 says members pay dues — so the app takes real money").
Founder confirms, corrects, or adds. Ambiguity verification questions fire only for
detected-ambiguous signals (live vs fresh; phone vs offline; find vs search-as-you-type;
notify vs text). Tier-c signals get settled here explicitly. Validate-manually flags are
offered ("dues could start as a payment link while the app is built — want that?").
Demand rows may inject questions into phase 3 (SMS → timeline; payments → who does your
accounting).

**Phase 3 — Constraint interview.** Four areas, ~8–12 questions, accounts late-ish,
budget mid (after value is established — GPCTBA order):

1. **Accounts** — per-asset walk, past tense: "Where's the domain registered? Any email
   on it? Any Google/Microsoft/Stripe/AWS/hosting account already billing you? Is the
   company incorporated?" An existing account can decide layers (Stripe → payments;
   a Microsoft relationship or an incorporated startup → check **Microsoft for Startups
   Founders Hub** eligibility, which arms the Azure Tier-2 credits trigger).
2. **Business** — when the payments signal fired: first "who handles your accounting —
   you, a bookkeeper, a firm?" (feeds the tax-burden-vs-cost discussion), then the
   **product-classification question** ("what exactly is being sold — a subscription to
   software, a digital product, your professional services, physical goods?") followed by
   the tax-processing-vs-cost discussion (§5). Then **budget** — anchor then brackets:
   state the landscape ("apps like this run $0–5/mo as a demo, ~$35/mo in production,
   $100+/mo when everything's paid"), then pick-one brackets. Separately the **hard
   cap**: "What's the absolute maximum this may cost per month before we should turn it
   off? Give me a number." → becomes the spend cap.
3. **Scale** — honest 12-month users ("your honest number, not the pitch-deck number");
   busiest-single-moment concurrent users; uptime contract-or-hope disambiguation.
4. **Operations** — who maintains after launch; who gets the 2am error email (→ Sentry
   target); timeline + injected lead-time items; compliance asked concretely ("any
   users in the EU or Canada + a lawyer telling you data must stay there?"; "health
   data?") — compliance answers arm the Azure Tier-2 triggers.

**Phase 4 — Recommend, layer by layer.** Per layer: conclusion first in outcome
language, one analogy max; house default **plus the named not-triggered swap** ("we'd
only move to Railway if the backlog had long-running jobs — it doesn't, per the
profile") — never a single-option ultimatum; bounded veto: *keep / take the named swap /
name a constraint I missed*. Triggered swaps show citation + tier + token cost. The
no-veto items and the six non-negotiables are presented as included, not optional.
Running cost table accumulates; NFR-forced costs itemized with a keep-or-relax choice
("1-hour recovery adds ~$100/mo — keep or relax the NFR?"); when Azure fires, pricing
shows founder credits applied. Layer order: shape+framework+API → database → auth →
services (payments/email/storage/jobs/realtime/AI) → hosting+environments →
quality+observability.

**Phase 5 — Write & read back.** Write STACK.md + KICKOFF.md (§7); set `stack:` in
epic.md front-matter (only epic-file touch). Closing read-back: the stack in three
sentences; costs at launch vs. paid-everything; token ledger (spent/refused); next step
("open a fresh Claude Code session in the repo and paste the kickoff prompt").

**Revisit branch:** what changed and why → revise STACK.md in place (dated revision
micro-ADR; git history keeps prior versions) → re-run only affected
phases (new demand signal → phases 1–2 delta; new constraint → phase 3 delta; always
re-run phase 4 for affected layers and rewrite artifacts whole).

## 7. Output artifacts (`output-template.md`)

### STACK.md — two halves, one file

**Founder half** (plain language, conclusion first):

- The decision in three sentences.
- Per-layer table: choice + one-line "because" in outcome language.
- Micro-ADR (3–5 lines: Context / Decision / Consequences) per deviation from the house
  stack — fired swaps AND refused swaps.
- Cost table: at launch / at scale; NFR-forced items flagged with the NFR that forced
  them; model-API variable cost noted where AI signals exist.
- The scale ceiling this stack is designed for, and that redesign happens *if* it's hit.
- Exit note per managed service (the data-export path), with "lock-in is accepted
  deliberately; no provider-abstraction layers will be built" stated outright.
- The boring-technology rationale in one paragraph, including that boring stacks are
  what the AI builder builds most reliably.
- The **confidence appendix**: which demand signals were derived from refined content
  vs. assumed from skeletons or defaults, plus the assumptions block when NFRs were
  absent (§5) and the recommendation to refine before building when confidence is low.
- The non-negotiables restated in founder language, with the scope-cost honesty note
  (API-first + keys + QA environment add real build scope; QA runs ~$0 on free tiers).

**Agent half** (the part that must be obeyed):

- **Under 200 lines, ~30–60 imperative rules**, hardest constraints first (primacy bias).
- Per-layer **Adopt/Hold pairs** naming the rejected alternative: "Use Drizzle. Do NOT
  use Prisma, even though you may have seen it frequently." Naming the training-data
  default is what suppresses it.
- Syntax-level version guards for churned APIs: App Router only, never `pages/`;
  Tailwind v4 CSS-first config, no `tailwind.config.js`; current auth library idioms.
- Pinned dependency **majors** + committed lockfile. Scaffold commands **evergreen**
  (`npx create-next-app@latest --yes` — pinning the scaffolder suppresses the agent
  guidance it now emits), with the rule: "check the resolved major; if it exceeds the
  pin, stop and flag."
- Unconditional lines: pooled connection string (exact form), Sentry client+server
  before first deploy with alert target, spend cap setup step with the founder's
  number, region in the create commands, verification loop (typecheck, Vitest, ESLint,
  build) wired so the agent can self-verify.
- The six non-negotiables as imperative rules: QA + PROD as two isolated projects with
  everything built in QA first; all infrastructure scripted and committed to the GitHub
  repo; API-first with OpenAPI compliance, an emitted Swagger page, and app-managed API
  keys; PROD promotion only via the approval-gated GitHub Actions environment; strict
  TDD (Red-Green-Refactor) throughout the build.
- One-line rationale kept on rules (rationale helps compliance; descriptive filler
  hurts). `IMPORTANT`/`YOU MUST` on only the 3–5 build-breaking rules.
- Category bans with escape conditions: "no Kubernetes / microservices / MongoDB /
  provider-abstraction layers unless `<cited backlog trigger>`."

**Delivery wiring** (STACK.md is invisible to Claude Code by default): the kickoff
prompt carries the pointer for session one; the kickoff instructions have the build
session add `@<path>/STACK.md` (agent half) to the project CLAUDE.md; when the
scaffolder emits AGENTS.md/CLAUDE.md, **append — never overwrite**. For truly
non-negotiable bans (compliance-driven), the template includes an optional
deterministic-enforcement snippet the founder can accept: `permissions.deny` entries or
a PreToolUse hook blocking the banned install. Prose is advisory; hooks are not.

### KICKOFF.md — a staged bootstrap, not a build order

Top of file: the ~10-line paste-able kickoff prompt, addressed to a fresh Claude Code
session in the repo. It says, in order:

1. Read `<epic folder>/STACK.md` and the backlog store; enter plan mode; produce a
   milestone plan for approval. Never "build the app."
2. Milestone 1 is the **walking skeleton**: scaffold per STACK.md's commands, stand up
   the QA environment + the scripted infrastructure + the approval-gated
   promotion pipeline, then the store's nominated first-slice story — deployed and
   runnable end-to-end *in QA*. Wire the CLAUDE.md import here too.
3. Then dependency-first story order from the backlog. "No orphaned code — every step
   integrates into the previous one." Build strictly TDD: Red-Green-Refactor, test
   first, every story. Every story ships API-first: its capability exposed through the
   OpenAPI-documented API with app-managed API keys, Swagger page updated.
4. Every milestone ends with the named checks run for **evidence** (test output, build
   exit code, screenshot, the Swagger page rendering for any new API surface), and an
   adversarial review of the diff against STACK.md + the story's acceptance criteria
   before the slice counts as done. Deploys land in QA; promotion to PROD happens only
   when the user authorizes it through the gate.

Body of file: the milestone scaffolding the build session reads — milestone table
(walking skeleton first, then ordered stories with IDs), the verification loop
definition, the version-check rule, and the append-don't-overwrite instruction for
scaffolder-emitted agent files.

### Write-back contract

- Write both files; set `stack: STACK.md` in epic.md front-matter (preserving all other
  fields; `## Features` roll-up untouched).
- Never persisted: constraint-interview raw transcript, estimates or schedule dates
  (no-estimates rule), account credentials or anything secret-like (account *names*
  only, never keys).
- On revisit, revise both files in place; the revised STACK.md opens its micro-ADR list
  with a dated revision entry stating what changed and why. Prior versions live in git
  history (the store's item-file supersede idiom does not apply to path-addressed
  singletons).

## 8. Anti-patterns (carried into SKILL.md)

- **Asking the founder a framework question.** Any question containing a technology name
  the founder didn't say first is a fail; constraints in, recommendations out.
- **The quiz.** Walking every stack layer as a question. The store answers most layers;
  the founder answers four constraint areas.
- **Single-option ultimatum.** A recommendation with no named not-triggered swap invites
  reflexive pushback; always show the reasoned alternative and why it isn't triggered.
- **Sizing for the pitch deck.** Building for the million-user story instead of the
  honest 12-month number; contingent features sized as if committed.
- **Free-tier production.** Recommending pausing/expiring tiers for a real launch.
- **Unpriced NFRs.** Accepting an NFR without showing its monthly cost and offering
  keep-or-relax.
- **Trusting prose to bind the builder.** Shipping bans without naming the alternative
  (and, for non-negotiables, without offering the enforcement snippet).
- **Quoting stale facts as current.** Pricing/version claims without the as-of stamp or
  runtime re-verification.
- **Negotiating the non-negotiables.** Dropping the QA environment, API-first, TDD, the
  promotion gate, or scripted infrastructure because the founder (or the layer's cost
  table) pushes back — they're the floor, not options.
- **Platform-bound convenience.** Reaching for a vendor's bundled auth/realtime/storage
  because it's one click closer — every such pick breaks the portability rule and
  re-tools the Azure path.

## 9. Ending criteria & testing

The session is done when: demand profile confirmed (all tier-c signals explicitly
settled); four constraint areas answered; every layer decided with veto exercised or
declined; token ledger closed; both artifacts written and linked; read-back delivered.

Testing (build-phase verification, sibling pattern):

- Tabletop transcripts: a mature store (refined features, ready stories, rich NFRs) and
  a skeleton-only store, walked through all phases (0–5); a revisit-branch walkthrough.
- Artifact lint: emitted STACK.md agent half under the line budget; front-matter fields
  complete; all six non-negotiables present in the agent half and KICKOFF.md; kickoff
  prompt self-contained (names files, scope, verification).
- Seam check: all four `backlog-store.md` copies byte-identical in the same commit;
  `stack:` field documented in the convention section of every copy.
- Marketplace validation: `node scripts/validate-marketplace.mjs` + `claude plugin
  validate .` green with the new plugin.

## 10. Out of scope (v1)

- Non-web targets (native-only mobile, CLIs, embedded); multi-epic shared stacks.
- Running the build, scaffolding, or creating accounts on the founder's behalf.
- A Miro mode (the constraint interview gains nothing from a board; the mirror contract
  is untouched).
- Cross-epic stack reconciliation ("epic 2 wants Python, epic 1 chose TS") — revisit
  branch handles the single-epic case only.
- Automated re-validation of the house stack against new model generations (manual
  refresh of `house-stack.md`, stamped, is the v1 mechanism).

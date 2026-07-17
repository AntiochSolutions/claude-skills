# House stack — select-stack

`validatedAsOf: 2026-07` · agent-default data measured against the mid-2026
Claude Code generation. Treat every layer as "the most LLM-familiar stable major,"
not "the newest release." When web tools are available, re-verify facts marked (†)
before quoting them; otherwise quote them WITH their as-of date.

This is the opinion the interview applies. Phase 1 maps every demand signal to a house
default or a swap; **Phase 4 — Recommend, layer by layer** walks the table below one layer
at a time, presenting the house default plus the named not-triggered swap. Default response
to any demand signal: **solve it with the house stack first.**

## The house stack

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
| Hosting | Vercel (Azure is the Tier 2 escalation target, below) | Kubernetes, Docker Swarm, self-managed VMs, click-ops (unscripted) infrastructure |
| Quality | Vitest + Playwright, ESLint, GitHub Actions | — |
| Observability | Sentry, client + server, wired before first deploy | — |

Chosen for **double consensus** — founder-market data AND measured Claude Code defaults
(2,430-prompt study: Vercel 100%, shadcn/ui 90%, Stripe 91%, GitHub Actions 94%, Postgres
58%, Vitest 59%; the current generation picks Drizzle 100%). Aligning the brief with the
builder's instincts is itself a **reliability feature** — the stack a coding agent
measurably builds best is the stack it will build most correctly — and the founder-facing
rationale says so outright.

## Portability rule

Every service in the stack must survive a hosting move to Azure with **no re-tooling**.
Supabase/Neon is therefore used *only* as managed Postgres (a Tier 2 move is a `pg_dump`
and a redeploy); auth is a portable library (Better Auth), realtime is a portable service
(Pusher/Ably, PartyKit/Durable Objects), storage is S3-compatible R2. Platform-bound
conveniences (Supabase Auth/Realtime/Storage, Vercel Blob) are Hold-listed for exactly this
reason: each one adopted would re-tool the Azure escalation path. Reaching for a vendor's
bundled auth/realtime/storage because it is one click closer breaks this rule.

## Non-negotiables

Every STACK.md carries these without variation, regardless of demand profile or founder
preference — presented in Phase 4 as "included, not optional":

1. **Two environments, QA and PROD** — as two fully isolated projects (separate app
   deployment + separate database). Every artifact, including infrastructure, is built in
   QA first. QA may run free tiers (pause/sleep quirks don't matter there); PROD runs the
   paid tiers.
2. **All infrastructure is scripted** and lives in the GitHub repo alongside the app code
   (IaC scripts on the default stack; Bicep on Azure). No click-ops.
3. **API-first**: anything possible via the UI is possible via the API. The API is
   OpenAPI/Swagger compliant, and a Swagger page is emitted for every API, secured by API
   key.
4. **App-managed API keys**: the application emits, stores, and revokes API keys; the API
   layer authenticates with them.
5. **PROD promotion only on explicit user authorization** — implemented as
   an approval-gated GitHub Actions environment, not as prose.
6. **Strict TDD** during the build: Red-Green-Refactor, written into KICKOFF.md's build
   rules.

**Founder-half honesty note:** API-first, key management, and a QA environment add real
scope to an MVP. The cost table shows QA at ~$0 (free tiers) and the founder half states the
scope cost plainly rather than hiding it.

## No-veto items

Presented as "included, not optional" — founders never ask for them, and their absence is
invisible until it hurts:

1. **Sentry** before first deploy, alerts to the founder's named email (elicited in Phase 3
   — "who gets the 2am error email?"). Without it, errors go unseen until users churn.
2. **Platform spend cap** set on day one at the founder's hard-cap number. Bill shock is
   triggered by success and by attacks, not by mis-estimation — the scale question cannot
   prevent it; only a cap can. (Vercel spend management is off by default; the STACK.md
   scaffold steps include turning it on.)

## Pricing stance

Pricing figures below are **as of 2026-07** and marked (†) — re-verify before quoting when
web tools are available; otherwise quote them with this as-of date.

Production runs on **entry paid tiers (~$25–45/mo) (†)**. Free tiers are labeled
demo/staging/QA only, because they carry real hazards for a live launch:

- Supabase free **pauses after 7 idle days and has no backups** (†).
- Render free Postgres **expires in 30 days** (†).
- Vercel Hobby is **non-commercial** by fair-use policy (†).

The founder sees three numbers: **~$0–5/mo demo (†)**, **~$35/mo production entry (†)**,
**~$100+/mo with everything on paid plans (†)**.

## Radical simplicity

**One Postgres is reused before any new moving part is added** — tsvector for basic search,
pgvector for embeddings (under ~10M vectors), SQL aggregates for dashboards. Count
*services*, not just libraries: each service is a bill, a dashboard, and a failure mode.
Buying undifferentiated capabilities (Stripe, managed auth, Resend) is **not** a token
spend — those are commodities bought, not novelty added. Each *additional novel* service is
the thing that costs a token.

## Swap rules

Every swap names: **trigger → swap → cost of swapping.** A swap fires only on a **cited
trigger** (a story/feature ID, an NFR line, or a constraint answer) — never on a hunch and
never on a founder saying a buzzword. Default response to any demand signal: **solve it with
the house stack first.** There is **no replatform tier** — the portability rule plus the
Azure escalation covers every case that used to require one.

### Tier 1 — Additive & settings

House stack stays; a swap adds a service or flips a setting:

- **AI is the *product*** (real ML workloads, Python-native libs) → add a Python FastAPI
  sidecar service. AI as a *feature* stays TS + Vercel AI SDK (streaming chat,
  `generateObject` extraction, pgvector RAG). High trigger threshold.
- **Live collaboration/presence** (cursors, co-editing, who's-online) → Liveblocks or
  PartyKit/Durable Objects. Plain WebSockets now work on Vercel (Fluid compute, 800s) — the
  trigger is presence/fan-out semantics, not the word "real-time."
- **Mobile-app-later** → Turborepo monorepo with Expo sharing non-UI TS code. This *keeps*
  the house stack — it is an argument for TS/React, not against.
- **Merchant-of-record** (Paddle / Lemon Squeezy, ~5%+50¢ (†)) instead of raw Stripe —
  routed through the **product-classification rule** (§5): what is being sold determines
  whether tax processing is worth buying at all.
- **Heavy/long background compute** beyond Inngest steps → Trigger.dev (noting its
  DB-exposure requirement) or the Python sidecar.
- **p95 ≤ 200–300ms with intermittent traffic** → disable DB scale-to-zero / always-on
  compute (serverless PG cold start measured ~1.8s median). A setting, not a move.
- **RPO ≤ 1h** → PITR add-on (~$100/mo (†) — priced to the founder as an NFR line item);
  RPO ≤ 24h is covered by paid-tier daily backups.
- **"Data in region X"** (when the vendor offers the region) → region pick at project
  creation, recorded in the scaffold commands (region is effectively immutable).

### Tier 2 — Azure escalation

Hosting + database move; **nothing else re-tools.**

Triggers — any one of:

- **Compliance** requiring a BAA chain or formal audit posture (HIPAA, SOC 2 pressure from
  enterprise customers).
- **Data residency or sovereignty**: Canada, EU, or any region/sovereignty demand the
  default vendors can't satisfy — Azure has full multi-region support including Canada and
  EU regions.
- A **contractual SLA or ≥ 99.99% availability**, or genuine multi-region — no self-serve
  tier on the default stack sells an SLA at all (STACK.md says so plainly).
- **Sustained hosting cost > ~$300/mo (†)** on the default stack.
- The founder **wants or qualifies for Microsoft for Startups Founders Hub credits**
  (~$1,000–5,000 of Azure credit (†)) — checked during the Phase 3 accounts walk.

**The move:** Vercel → Azure App Service or Container Apps; Supabase/Neon → Azure Database
for PostgreSQL (a `pg_dump` migration — the portability rule's payoff); infrastructure
scripts in Bicep; region pinned at creation. Everything else carries over unchanged: Better
Auth, Drizzle, R2, Resend, Stripe, Inngest, the portable realtime layer, Sentry, GitHub
Actions, and both non-negotiable environments.

**Cost of swapping:** more setup than Vercel's zero-config path, no preview-deploy DX, and
Next.js hosting is second-class relative to Vercel — offset early by the founder credits.
The founder half prices Azure with Microsoft for Startups Founders Hub credits (†) applied.

## Innovation-token discipline

Founder budget is **0–1 innovation tokens**, spendable only on the product's **core
differentiator** as cited to the epic's **Benefit Hypothesis**. The interview maintains a
**token ledger**: every fired swap records its citation, and every *considered but refused*
swap records why not ("considered Railway — not triggered: no long-running jobs in the MVP
profile"). Refusals surface in STACK.md's founder half, so the founder sees the reasoned
alternatives that were weighed and declined, not just the choices made.

## Drift protection

This file opens with the stamp block above: `validatedAsOf: 2026-07`, the model generation
the agent-default data was measured against, and the standing instruction to the running
session — treat the table as "the most LLM-familiar stable major," not "the newest
release"; when web tools are available, re-verify the load-bearing pricing/free-tier facts
(marked (†) in this doc) before quoting them; where verification is unavailable, quote with
the as-of date. Pricing facts carry inline as-of framing for this reason. STACK.md inherits
this stamp via its `houseStackVersion` front-matter field, so every emitted decision records
the vintage of the opinion it was applied from.

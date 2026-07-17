# Research Brief: select-stack skill

**Date:** 2026-07-17
**Status:** research phase — feeds the design spec for the `select-stack` plugin

## What we're building

`select-stack` is the fifth member of the epic-shaping suite
(refine-epic → decompose-epic → refine-feature → refine-story → **select-stack**).

It interviews a **non-technical founder** to ascertain the technical stack a Claude Code
instance will be asked to build. It **requires the backlog store** (`./backlog/` — epic.md,
features/, stories/) as input: the skill derives the app's functional demands from the
backlog itself and interviews the founder only for what the backlog cannot tell it
(budget, existing accounts, scale expectations, timeline, who maintains the app,
compliance). Output: a **STACK.md brief** (plain-language rationale on top,
agent-actionable spec below) plus a **ready-to-paste kickoff prompt** pointing the build
session at the brief and the backlog store.

## Decisions already locked (do not re-litigate)

1. Audience: non-technical founder — interview elicits constraints, never framework preferences.
2. Requires the full backlog store; no standalone mode.
3. Recommendation engine: **house stack + swap rules** — one curated default stack, explicit
   decision rules for when a constraint or demand signal swaps a component.
4. Flow: **demand-profile-first** — derive demand profile from backlog (each signal cited to
   the feature/story implying it) → plain-language confirm/correct with founder → constraint
   interview → recommendation layer-by-layer with veto points → write artifacts.
5. Output: STACK.md + kickoff prompt. Scope: web apps.
6. Name: `select-stack`. Tracker-agnostic, no API needed at interview time.

## Stack component taxonomy (coverage map)

A. Core build: application shape; language/runtime; frontend framework + UI; backend
framework; data layer (DB, ORM, migrations, cache, search, blob); auth.
B. Platform & services: hosting/infra; third-party services (payments, email, jobs, AI, analytics).
C. Quality & delivery: testing; tooling/repo layout; CI/CD + environments; observability.
D. Decision drivers: budget, existing accounts, team familiarity, scale, timeline,
compliance, negative space (what NOT to use), default-with-rationale where founder has no opinion.

## Research lanes

Each lane is one research agent. Ground findings in current (2025–2026) sources; cite them.
Prefer primary sources (official docs/pricing pages, author essays) over listicles.

1. **House-stack consensus** — What is the current default stack for founder-built web apps?
   Next.js/React/TypeScript/Tailwind + Postgres + Vercel is the hypothesis; verify against
   what YC startups, indie hackers, and agency starter kits actually pick in 2025–2026.
   Capture *why* each layer wins and the strongest runner-up per layer.
2. **Agent-buildability** — Which stacks do AI coding agents build most reliably, and why
   (training-data prevalence, convention-over-configuration, one language end-to-end, typed)?
   Any published guidance from Anthropic/Vercel/others on agent-friendly stack choices.
3. **Free-tier & pricing landscape** — Current free-tier limits and first-paid-tier pricing:
   hosting (Vercel, Netlify, Cloudflare, Railway, Render, Fly), DB (Supabase, Neon, Turso),
   auth (Clerk, Auth.js, Supabase Auth), email (Resend, Postmark), storage, error tracking
   (Sentry). What dies at scale, what surprises founders on the first bill.
4. **Swap-rule triggers** — Documented reasons to deviate from a default stack: AI-heavy
   workloads (Python vs. TS + AI SDK), real-time collaboration, mobile-app-later,
   compliance (HIPAA/SOC2/GDPR residency), heavy background compute, team already knows X,
   extreme cost sensitivity. For each: the trigger, the swap, the cost of swapping.
5. **Boring technology & simplicity doctrine** — Dan McKinley's "Choose Boring Technology";
   DHH's majestic monolith / Rails doctrine; Pieter Levels' radical simplicity; the
   "innovation tokens" model. What these imply for a founder default and for swap-rule
   discipline (when NOT to swap).
6. **Discovery-interview technique** — How agencies/consultancies run technical discovery
   with non-technical clients: question sequencing, translating jargon, budget/scale
   elicitation in founder terms, Mom-Test-honest constraint questions ("what accounts do
   you already pay for?" beats "what's your hosting preference?").
7. **Demand-signal taxonomy** — Mapping functional requirements to stack implications:
   payments → Stripe + webhooks + jobs; uploads → blob storage + size limits; search;
   notifications; real-time; multi-tenancy/roles; reporting/exports; AI features;
   integrations. Build the canonical signal → implication table.
8. **NFR → infrastructure mapping** — How quantified NFRs (latency, availability, RPO/RTO,
   concurrent users, data volume) map to hosting/DB/architecture choices at founder scale;
   when an NFR genuinely forces a bigger platform vs. when it's satisfied by defaults
   (Gilb / ISO 25010 heritage; capacity-planning rules of thumb).
9. **Stack-brief formats** — ADRs (Nygard), arc42, Thoughtworks Tech Radar, STACK.md /
   CLAUDE.md conventions; what document formats agents consume reliably; how to write
   constraints so a coding agent obeys them (positive instruction + explicit negative space).
10. **Kickoff-prompt patterns** — Published best practice for pointing a Claude Code session
    at a spec + backlog: walking-skeleton-first ordering, verification loops, scaffold
    commands (create-next-app etc.) that stay evergreen vs. pinned versions; how briefs
    should handle version pinning given fast-moving frameworks.
11. **Founder stack failure modes** — Documented post-mortems and essays on early-stage
    stack mistakes: microservices too early, premature Kubernetes, exotic databases,
    vendor lock-in panic vs. reality, over-abstracting for scale that never comes,
    under-investing in observability. Each failure mode → the interview question or brief
    line that prevents it.
12. **Suite-seam audit** — Read the existing plugins in this repo (refine-epic output NFRs,
    decompose-epic backlog store convention, refine-feature success signals/NFR budget,
    refine-story Confirmations) and produce the exact list of fields select-stack can mine
    from the store, keyed by file and front-matter path — plus gaps where the store lacks a
    stack-relevant signal. This lane reads local files, not the web.

## Output expected from each lane

A compact report (≤800 words): key findings as claims with sources, a "what this means for
select-stack" section, and any surprises that should change the design.

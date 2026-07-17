# Output artifacts — select-stack

Companion to `SKILL.md` and `interview-guide.md`. **Phase 5 loads this file**, fills every
`<...>` slot from the interview, writes both artifacts into the epic folder, sets `stack:` on
`epic.md`, and closes by running the `## Read-back script` section at the bottom. Follow these
templates literally — the slots are the only judgment; the structure is fixed.

Store conventions (the tree, IDs, front-matter, and the **Stack decision artifacts** section that
governs these two files) live in `references/backlog-store.md`. The opinion being applied — layers,
pinned majors, swap rules, pricing facts — lives in `references/house-stack.md`. Reference those by
name; don't restate them here.

Both artifacts are written **inside the epic folder**, siblings of `epic.md`
(`backlog/Epic #NN - <Title>/STACK.md` and `.../KICKOFF.md`). They are addressed by path — no `id`,
no ID prefix — and sit outside the roll-up refresh contract and the Miro mirror.

## STACK.md template

One file, two halves in this order: the **founder half** (plain language, conclusion first) then the
**agent half** (imperative rules a build agent obeys). Front-matter first.

Front-matter — exact; fill `epic` with the epic's ID and `houseStackVersion` with the stamp from
`house-stack.md`:

```yaml
---
type: stack
epic: E01
status: decided
validatedAsOf: 2026-07
houseStackVersion: <house-stack.md stamp>
---
```

- `status:` is always `decided` and **stays `decided` on revision** — prior versions live in git
  history; never mark a STACK.md `superseded`.
- `validatedAsOf:` inherits the house-stack data vintage; `houseStackVersion:` records the stamp of
  the opinion that was applied, so every decision carries the vintage it came from.

### Founder half

Plain language, conclusion first, no jargon. The literal skeleton (fill the slots; each `###` is a
sub-section of the founder half):

```markdown
# Stack decision — <Epic Title> (E##)

<Three sentences, plain language: what the app is built with (name the shape — one Next.js app, one
Postgres), what it costs to run, and the one place — if any — an innovation token was spent.>

### What each part is, and why
| Part | Choice | Because |
| --- | --- | --- |
| App & screens | Next.js (one app) + Tailwind + shadcn/ui | one codebase, one deploy — nothing to wire together |
| Your data | one managed Postgres (Supabase or Neon) | one bill, one thing to watch; it also does search and reporting |
| Sign-in | Better Auth | no per-user fee, and it moves with you if you switch hosts |
| <one row per layer that was decided> | <choice> | <one-line outcome-language "because"> |

### Why we chose differently where we did — and where we didn't
<One micro-ADR per deviation from the house stack — every FIRED swap AND every considered-but-REFUSED
swap. 3–5 lines each. On a revisit, the FIRST entry here is the dated revision entry (see the
Write-back contract).>

**<Swap> — <fired | considered, not triggered>**
Context: <the demand signal or constraint, cited to S##/F##/NFR line>
Decision: <what we did, or deliberately did not do>
Consequences: <cost, lock-in, what it buys>

### What it costs
| Line | At launch | At scale | Note |
| --- | --- | --- | --- |
| Hosting | $<demo–entry> | $<paid> | |
| Database | $<...> | $<...> | |
| <each priced service line> | $<...> | $<...> | |
| <NFR-forced line> | $<...> | $<...> | **forced by NFR: <the NFR that forced it>** |
| Model API (usage-based) | ~$<rate> | grows with use | **only when an AI signal fired** |
| QA environment | ~$0 | ~$0 | free tiers |
| **Total** | **~$<launch>/mo** | **~$<scale>/mo** | <when Azure fired: Microsoft for Startups Founders Hub credits applied> |

### How far this scales
<The honest concurrent-user / data ceiling this stack is designed for — the 12-month number, not the
pitch deck — and that we redesign IF it's hit, not before.>

### Getting your data out
<One line per managed service naming the export path — Postgres → pg_dump; R2 → S3-compatible copy;
Stripe → data export; ...> Lock-in is accepted deliberately; no provider-abstraction layers will be
built.

### Why boring
<One paragraph: this stack is deliberately boring — well-worn, stable majors — and that is a feature
here, because the maintainer of record is a coding agent, and a coding agent builds most reliably the
stack it has seen most (the double-consensus argument, in plain words).>

### How sure we are
- Known from your refined backlog: <signals read straight from refined features / ready stories, cited>
- Inferred from skeletons or defaults: <signals guessed from skeleton items or house defaults, cited>
- <Only when the epic recorded no NFRs:> No NFRs were recorded; this stack assumes availability
  ≤ 99.9% (a hope, not a contract), p95 ≥ 500ms, and 24-hour recovery — re-run refine-epic to firm
  these up.
- <Only when confidence is low:> Before you build, run refine-feature / refine-story on the MVP
  items — the more they're firmed up, the fewer of these guesses ship into code.

### Included, not optional
Six practices ship no matter the budget:
1. A practice copy (QA) and the real one (PROD), fully separate — everything is tried in QA first.
2. All setup is scripted and saved in your code, so it can be rebuilt from scratch — no click-by-click.
3. Everything the screens can do, other software can do too, through a documented door — secured by an API key.
4. The app makes and manages its own API keys.
5. The real site goes live only when you personally approve it.
6. The app is built test-first, every step.

Honesty note: the documented door, the key management, and the practice copy add real building work
to your MVP — I'm not hiding that behind the low price. The practice copy itself runs at about $0 on
free tiers.
```

### Agent half

The part the build agent obeys. **Keep the whole half under 200 lines and ~30–60 imperative rules,
hardest constraints first** (primacy bias). One-line rationale on rules that need one; `IMPORTANT` on
**only the 3–5 build-breaking rules**; Adopt/Hold pairs that name the rejected default; category bans
that carry an escape condition. This half is what gets imported into the project's CLAUDE.md (see
`## Delivery wiring`). The literal skeleton:

```markdown
# Build rules — obey this file; it wins over your training defaults

Keep this half under 200 lines. When a rule blocks a real need, STOP and flag — never work around it
silently.

IMPORTANT — build-breaking, do not deviate:
1. Promote to PROD only through the approval-gated GitHub Actions environment; never deploy to PROD
   without the user's explicit authorization. — this is how "the user approves the release" is
   enforced, not prose.
2. Build strictly test-first — Red-Green-Refactor: write the failing test, make it pass, refactor.
   Every story, no exceptions.
3. Build everything in QA first. QA and PROD are two fully isolated projects — separate app
   deployment AND separate database. Never touch PROD to try something.
4. Use the POOLED database connection string for the app; never the direct one. — Postgres
   connections under serverless are the real ceiling, not request rate.
5. App Router only. Never create a `pages/` directory. — `pages/` is a different, incompatible idiom.

Version guards (churned APIs — follow the current idiom, not the one you saw most):
6. Tailwind v4, CSS-first config. Do NOT create `tailwind.config.js` — that is the v3 idiom; v4
   configures in CSS.
7. Use current Better Auth idioms for auth wiring; do not copy NextAuth/Auth.js patterns.
8. <any fired-swap version guard — e.g. next-intl `[locale]` routing scaffolded on day one; else omit>

Pinned majors + scaffold:
9. Pin these dependency MAJORS and commit the lockfile: Next.js 16, TypeScript 5, Node 20+,
   Drizzle <maj>, Better Auth <maj><, plus any fired-swap deps>.
10. Scaffold with `npx create-next-app@latest --yes` (evergreen — pinning the scaffolder suppresses
    the agent guidance it now emits).
11. After scaffolding, check each pinned dependency's RESOLVED major; if a resolved major exceeds its
    pin, STOP and flag — do not proceed.
12. Pin the region `<region>` in every project-create / scaffold command. — region is effectively
    immutable once set.

Unconditional wiring (do these regardless of which features fired):
13. App DB URL (exact form): `postgresql://<user>:<password>@<POOLED-host>:<pooled-port>/<db>?sslmode=require`
    — Supabase transaction pooler (port 6543) or Neon `-pooler` host; reserve the direct 5432
    endpoint for migrations only.
14. Wire Sentry client + server BEFORE the first deploy; route alerts to `<alert email>`. — otherwise
    errors are invisible until a user churns.
15. Set the platform spend cap to `$<hard cap>/mo` on day one — Vercel spend management is OFF by
    default; turn it on.
16. Verification loop — after every change run all four and require green before the slice is done:
    typecheck · Vitest · ESLint · production build.

Non-negotiables as rules:
17. All infrastructure is scripted (IaC on this stack; Bicep on Azure) and committed to the GitHub
    repo. No click-ops.
18. API-first: every capability the UI exposes is reachable through OpenAPI-compliant routes; emit a
    Swagger page for every API, secured by an API key.
19. The app emits, stores, and revokes its own API keys; the API layer authenticates with them.

Layer Adopt/Hold pairs (name the rejected default so you don't drift back to it):
20. Use Drizzle for all database access. Do NOT use Prisma, even though you may have seen it
    frequently.
21. Use Better Auth. Do NOT use NextAuth/Auth.js on this build, and never hand-roll password or
    session code — auth bugs are security bugs.
22. Use one managed Postgres (Supabase or Neon), strictly as Postgres. Do NOT use Supabase
    Auth/Realtime/Storage — they break the Azure portability rule.
23. Use one Next.js monolith repo. Do NOT split into microservices or add an API gateway.
24. Use Zustand + TanStack Query for state/data. Do NOT add Redux.
25. Use Inngest for durable/scheduled jobs. Do NOT use Vercel Cron for anything needing retries — it
    is fire-and-forget.
26. Use Resend (+ React Email) for mail. Do NOT reach for SendGrid's free tier — it no longer exists.
27. Use Cloudflare R2 for file storage (S3-compatible, zero egress). Do NOT use Vercel Blob or
    Supabase Storage as the primary store.
28. Reuse the one Postgres before adding a service: tsvector for basic search, pgvector for
    embeddings (< ~10M vectors), SQL aggregates for dashboards.
29. Payments: <fired processor + product-classification outcome, cited; else "not in the MVP — no
    payments signal fired">.
30. Realtime: <portable pub-sub / presence layer if triggered, cited; else "not triggered — no
    realtime layer">.

Category bans (with escape conditions):
31. No Kubernetes, Docker Swarm, self-managed VMs, microservices, or API gateways — unless
    `<cited backlog trigger>` (none in this profile).
32. No MongoDB, DynamoDB, Firebase RTDB, or any vector/graph/KV store as the primary DB — unless
    `<cited trigger>`.
33. No provider-abstraction layers — lock-in is accepted deliberately (see the founder half's exit
    notes).
34. No platform-bound conveniences (Supabase Auth/Realtime/Storage, Vercel Blob as primary) — every
    one re-tools the Azure escalation path.

Escalation:
35. If a Tier 2 — Azure escalation trigger fired (`<the fired trigger, or "none — stay on the default
    stack">`): move hosting to Azure App Service / Container Apps and the DB to Azure Database for
    PostgreSQL (a `pg_dump` migration), infra in Bicep, region pinned. Everything else carries over
    unchanged.
```

## KICKOFF.md template

A staged bootstrap, not a build order. Front-matter first:

```yaml
---
type: kickoff
epic: E01
stack: STACK.md
---
```

Then the paste-able kickoff prompt — the top of the file, addressed to a fresh Claude Code session in
the repo. Fill the `<...>` slots at write time; keep every other word verbatim:

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

Then the body the build session reads — the milestone table (walking skeleton first, then the
ordered story IDs), the verification-loop definition, the version-check rule, and the
append-don't-overwrite instruction. The literal skeleton:

```markdown
# Kickoff — <Epic Title> (E##)

<the paste-able prompt above, repeated verbatim as the top of the file>

### Milestones
| # | Milestone | Stories | Done when |
| --- | --- | --- | --- |
| 1 | Walking skeleton | <S## — first slice> | scaffolded per STACK.md; QA env + scripted infra + approval-gated PROD promotion pipeline stood up; the story runs end-to-end in QA; the `@STACK.md` CLAUDE.md import added |
| 2 | <next slice> | <S##> | <dependency-first; every step integrates into the previous one> |
| … | <…> | <S##, S##> | <…> |

### Verification loop (run at the end of every milestone, for evidence)
- typecheck · Vitest · ESLint · production build — all green
- a screenshot of the running slice in QA
- the Swagger page rendering for any new API surface
- an adversarial review of the diff against STACK.md + the story's acceptance criteria

### Version-check rule
Scaffold with the evergreen command in STACK.md. After scaffolding, check each pinned dependency's
resolved major; if any exceeds its pin in STACK.md, STOP and flag — do not proceed.

### Agent-file merge
Add `@<epic folder>/STACK.md` to this project's CLAUDE.md in milestone 1. If the scaffolder emitted
AGENTS.md or CLAUDE.md, append to it — never overwrite.
```

## Delivery wiring

STACK.md is invisible to Claude Code by default; three moves make the agent half binding:

- **Session one** — the KICKOFF.md kickoff prompt carries the pointer: the fresh session reads
  `<epic folder>/STACK.md` before planning anything.
- **Later sessions** — milestone 1 adds `@<epic folder>/STACK.md` (the agent half) to the project's
  CLAUDE.md, so every subsequent session imports the rules automatically.
- **Scaffolder-emitted agent files** — when `create-next-app` (or any scaffolder) generates
  `AGENTS.md` or `CLAUDE.md`, **append the import — never overwrite** the generated file.

## Enforcement snippets

Prose is advisory; hooks are deterministic. Offer a deterministic-enforcement snippet **only for a
founder-accepted non-negotiable ban** (typically compliance-driven) — never for ordinary Hold-listed
alternatives. Include verbatim when offered:

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

Alternatively, a **PreToolUse hook** can block the banned install command and print the sanctioned
alternative (e.g. "install Drizzle, not Prisma") so the build agent is redirected, not just stopped.

## Write-back contract

- **Write both files** into the epic folder (siblings of `epic.md`), per the templates above.
- **Set `stack: STACK.md`** in `epic.md` front-matter, **preserving all other fields**; leave the
  `## Features` roll-up (the last body section) untouched. This is the only epic-file edit.
- **Never persisted:** the constraint-interview raw transcript; estimates or schedule dates
  (no-estimates rule); account credentials or anything secret-like — record account **names** only,
  never keys.
- **On revisit, revise both files in place.** STACK.md is a path-addressed singleton — the store's
  supersede idiom does not apply, so never mark it `superseded`. The revised STACK.md opens its
  micro-ADR list with a **dated revision entry** stating what changed and why; prior versions live in
  git history. KICKOFF.md is rewritten whole.

## Read-back script

The closing read-back Phase 5 delivers — spoken, in plain language, filling the slots from the
session. (interview-guide.md's Phase 5 routes here and composes nothing of its own.)

```text
1. The stack, in three sentences: <the same three sentences as STACK.md's decision>.

2. What it costs: about $<launch>/mo at launch, and about $<everything-paid>/mo with every service on
   its paid plan. The practice (QA) copy runs at about $0 on free tiers.

3. Innovation tokens: <N> of 1 spent — <what it bought, cited to the epic's Benefit Hypothesis>. And
   these were weighed and declined: <each refused swap → why not, cited to the profile>.

4. <Only when confidence is low:> Before you build, I'd run refine-feature / refine-story on the MVP
   items first — the backlog is still mostly skeleton around <areas>, and STACK.md's confidence
   appendix lists what we inferred versus knew.

5. Next step: open a fresh Claude Code session in the repo and paste the kickoff prompt.
```

Line 5 is delivered verbatim: **"open a fresh Claude Code session in the repo and paste the kickoff
prompt."**

# Output — store write-back, Confirmation formats, red-card ledger

Companion to `SKILL.md`. refine-story produces **no separate document**: its output is the story
file **updated in place** in the backlog store (plus any peeled Cards), per `backlog-store.md`. This
file pins the write-back contract so every session renders identically.

## Write-back by route

| Route | Story `status` | Sections written |
| --- | --- | --- |
| Full conversation | `ready` | All sections below |
| Fast pass (score 1–2) | `ready` | Conversation notes (2–3 lines) · Acceptance criteria (rule-line checklist) · Not in this story (one honest line suffices) · Open questions (when a red card was raised) · Knowledge-state report naming the skipped mining loop and sweeps |
| Score 4–5 | `ready` | All sections; Conversation notes record what IS known (a real instance when one exists, else current-state facts); Acceptance criteria = the clear hypothesis + first-probe checks only; Open questions carries the blocking questions **verbatim**; at most a timebox recommendation in the report |
| Park-back (value anchor fails) | `parked` | A one-line reason in the body ("no confirmable value/output — routed back to refine-feature"); nothing else drafted |
| Pseudo-story bounce | unchanged | Nothing — the session ends redirecting to refine-feature's REPAIR; say so in dialog |

Routes never reorder sections — each route writes a **subset of the order below**. Omit sections
that would be empty (an empty red-card ledger is omitted, not faked). Every write-back also:
regenerates the feature's `## Stories` roll-up · re-renders touched Cards on the board mirror when
one is attached (state line + theme color per `backlog-store.md`). **Never persisted:** capacity-bet
answers, estimates, story points, scores, or schedule/delivery dates. (Audit stamps like a park date
are parts of the artifact, not commitments.)

## Story file — section order after refinement

Front-matter: only `status` changes. The H1 and the **Card line stay byte-identical** — detail
attaches below, never inside.

```markdown
# S07 — <Title>

As a <role>, I can <activity>, so that <benefit>     ← unchanged, always

## Conversation notes                ← brief: the real instance narrated, the happy path as
                                       numbered steps, domain concepts the session named
                                       (definitions in the SME's words), provenance-tagged numbers
## Acceptance criteria               ← the Confirmation, in the routed format(s) — formats below;
                                       every line SME-originated or SME-confirmed
## Not in this story                 ← the scope fence, spent: rejected proposals, agreed
                                       exclusions, and "Handled by S12: <peeled group>" lines for
                                       anything peeled
## Open questions                    ← the red-card ledger, one line each:
                                       - <question, verbatim> — owner: <name/role>
## Knowledge-state report            ← template below
```

## Confirmation formats

**Checklist (default)** — one clear line per rule; scalars carry unit + number + Meter:

```markdown
- A signup with a work-email domain should create exactly one account, visible to teammates who
  search that domain
- Signup completion (p90) should stay under 3 minutes — measured weekly in the analytics funnel
```

**Example table** — cases share structure, differ only in values; 3–7 rows per rule with ≥1
boundary and ≥1 counter-example; input AND expected result in every row:

```markdown
Rule: only company work emails create team-visible accounts.

| Email entered | Expected result |
| --- | --- |
| dana@acme.com | account created, joins the acme.com team directory |
| dana@gmail.com | account created as personal — no team directory |
| dana@acme.co (typo of acme.com) | account created under acme.co exactly as typed; the verification email names the acme.co directory, so the typo can be caught before verifying |
| blank | no account; "email required" |
```

**Given-When-Then** — only when the context or event itself differs; lints per the interview guide
(one When; minimal Givens; "should" Thens; one rule per scenario; titles state only the difference;
zero UI mechanics):

```markdown
Scenario: domain already has a team
  Given a teammate already registered under acme.com
  When Dana signs up with dana@acme.com
  Then Dana should be offered to join the existing acme.com team

Scenario: domain has no team yet
  Given no account exists under acme.com
  When Dana signs up with dana@acme.com
  Then a new acme.com team should be created with Dana as its first member
```

**Sketch pointer** — UI/interaction detail: `See sketch: <path or link> — the flow, not the pixels.`

## Knowledge-state report — template

Not a certificate. It reports the state of knowledge and hands the conversation to the team.

```markdown
## Knowledge-state report

- **Route:** <full conversation | fast pass | score 4–5> — <one line on why; a fast pass names the
  skipped mining loop and sweeps; a 4–5 names the first probe and the timebox recommendation, if
  any>
- **Agreed:** <the 2–4 load-bearing agreements — the output, the core rules, the format chosen>
- **Known unknowns:** <each blocking or open question, verbatim where it matters, with its named
  owner — this is where a 4–5 story's blocking questions live>
- **Out-of-scope decisions:** <count + the load-bearing ones — the rest are in Not in this story>

Sizing left to the team; the conversation continues in the sprint.
```

The closing line is verbatim and always present. On a park-back exit, the "report" is one line in
dialog (what was parked and why) — nothing is drafted into the story body beyond the reason.

## Peel write-backs (splits)

- Each peeled group → a new one-line Card in the feature's stories folder: fresh `S##`,
  `kind: variation`, `tags: []`, `order` appended at the set's end, body = H1 + the Card line.
  The Card inherits the parent's benefit clause **unless the SME states a truer one — the SME's
  words always win over inheritance.**
- The parent story's Card line is **unchanged**; its narrowed scope shows up as
  `Handled by S12: <group>` lines under `Not in this story`.
- A peel **never** supersedes the parent — `superseded` is refine-feature's move, not this skill's.
- After any peel: regenerate the feature's `## Stories` roll-up (new rows appear with their IDs,
  sorted by `order`) and re-render touched Cards on the mirror.

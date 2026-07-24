# Build write-back — sections, transitions, and the report

What build-story writes into the store, and when. Same discipline as the rest of the suite:
the files are the record; every write-back refreshes the parent roll-up and re-renders touched
Cards only when the epic's `board` field names a Miro board AND Miro tools are detected.

## Placement — build sections extend, never disturb

The two build sections append **after** `## Knowledge-state report`, in this order:

1. `## Implementation plan` (gate #1's artifact — its presence in the file IS the
   machine-checkable "plan approved" marker)
2. `## Implementation report` (the close)

Refined sections are never reordered or edited by this skill, with one exception: the
answered-open-question annotation below.

## Rebuild after a route-back

When a story released to refinement returns and builds again, both build sections are
**replaced in place**, each opening with a one-line dated note
(`*Rebuilt 2026-08-02 after revisit — prior version in git history.*`). The STACK.md revision
idiom, not the supersede idiom: path-addressed sections, prior versions in git history.

## Answered open questions — annotate in place, never delete

When an owner answers a ledger line during the build, the line stays and gains a dated
annotation:

```markdown
- "Does the lot cap a single day's fee at a maximum?" — owner: Dana (Ops). Non-blocking: …
  — **Answered 2026-07-24 (Dana):** yes, $20/day; cap lands as its own story.
```

## `## Implementation plan` — template

```markdown
## Implementation plan

*Approved <YYYY-MM-DD> at gate #1.*

| AC | Criterion (short) | Check(s) | Files |
| --- | --- | --- | --- |
| AC1 | <rule, compressed> | <check name(s) per verification-routing> | <paths> |

- Enabling work: <listed explicitly, or "none" — anything built that is not a criterion must
  appear here or it is smuggled scope>
- Not in this story (restated): <the fence, verbatim from the story's `## Not in this story`
  section — refine-story's write-back contract makes the fence its own section between the
  criteria and the open questions>
```

## `## Implementation report` — template

Mirror the knowledge-state report's honesty: a state-of-proof report, never a
done-certificate. Omit any section that would be empty.

```markdown
## Implementation report

- **Route:** <full conversation | fast pass | score 4–5> — <one line; mirror the upstream
  knowledge-state report's tokens verbatim — this is the line the skill parsed at intake>
- **Confirmed by tests:** <criterion → check(s), all passing — the trace table, compact>
- **Confirmed by walkthrough:** <sketch/judge criteria and who confirmed>
- **Instrumented, not yet proven:** <each Meter now emitting, where it reports>
- **Discovered and routed:** <candidates verbatim, red-card style with owners — minting left to
  refinement; tech debt logged here too, never as story Cards>
- **Deviations:** <flagged check edits with their justifications; plan changes>

Proof left to the Meters; the conversation continues in review.
```

The closing line is verbatim and always present.

## Status transitions this skill owns

| Transition | When |
| --- | --- |
| `ready` → `building` | On pick at session intake — the claim; refresh roll-up, re-render Card |
| `building` → `built` | At close, after gate #2 — report appended, roll-up refreshed |
| `building` → `ready` | Release: a bounce to refinement (criterion with no route, or a 4–5 probe returning with answers), or an interrupted session the user declines to resume — reason in dialog |

`built` → `ready` belongs to refine-story (a revisit re-opens a built story carrying the
build's answers). `parked`/`superseded` belong to refine-feature curation. One story, one
branch; commits reference the ID.

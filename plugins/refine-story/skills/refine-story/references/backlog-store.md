# The backlog store — shared convention

The epic-shaping suite (refine-epic → decompose-epic → refine-feature → refine-story → select-stack) keeps its work
in a **backlog store**: one markdown file per epic, feature, and story, in the user's working
folder. **The markdown tree is the single system of record — always.** A Miro board may mirror it as
a Card story-map, but the board is a render of the files, never the record.

> **Keep in sync:** this file is duplicated verbatim into the refine-feature, refine-story, and
> select-stack plugins (marketplace plugins install independently). When the convention changes,
> change every copy in the same commit.

## The tree (system of record)

```text
backlog/
  Epic #01 - Customer Onboarding/
    epic.md
    STACK.md               # optional — stack decision (select-stack)
    KICKOFF.md             # optional — build bootstrap (select-stack)
    Features/
      Feature #01 - Self-serve signup.md
      stories for #01 - Self-serve signup/
        Story #01 - Create account with work email.md
        Story #02 - Invite a teammate.md
      Feature #02 - Guided first project.md
      stories for #02 - Guided first project/
        Story #03 - Start from a template.md
```

- Default root is `./backlog/` in the directory where the skill runs; the user may name another.
  Several epics sit side by side under the root, and ID allocation scans the root as a whole.
- One **folder per epic** (`Epic #NN - <Title>`) holding `epic.md` and a `Features/` folder; each
  feature is a **file** (`Feature #NN - <Title>.md`) with a **sibling stories folder**
  (`stories for #NN - <Feature Title>/`) holding one file per story
  (`Story #NN - <Story Title>.md` — the story title is its short activity phrase).

## Identifiers

- Every item gets a **store-unique, type-prefixed sequential ID** minted at creation: epics
  `E01, E02, …` · features `F01, F02, …` · stories `S01, S02, …` — zero-padded to two digits,
  growing naturally to three digits past 99.
- Uniqueness is **per backlog root, across all epics in it**: feature numbers do not restart per
  epic and story numbers do not restart per feature, so a bare `S17` is unambiguous. Allocation:
  highest existing ID of that type anywhere under the root, plus one (a brand-new root starts at
  `E01`/`F01`/`S01`).
- Assignment order is **narrative order**: features are numbered in narrative-flow order; stories
  are numbered walking-skeleton-first within each feature, feature by feature.
- IDs are **permanent** — never reused, never renumbered; parked and superseded items keep theirs.
- The ID is the `id` front-matter value, and its number is embedded in the file/folder name
  (`Feature #03 - …` ⇔ `F03`). Names carry the human title verbatim, with characters illegal in
  filenames (`\ / : * ? " < > |`) replaced by `-` and trailing dots/spaces trimmed.
- A **retitle renames** the file/folder to match — a feature retitle also renames its stories
  folder — and the embedded `#NN` keeps identity stable through renames. `order` lives **only** in
  front-matter, so reordering renames nothing.

## Parent roll-ups

The epic file carries a `## Features` section and each feature file a `## Stories` section — always
the **last section of the body**, rows sorted by `order`:

```markdown
## Features

| ID | Feature | Status |
| --- | --- | --- |
| F01 | Self-serve signup | skeleton |
| F02 | Guided first project | skeleton |
```

```markdown
## Stories

| ID | Story (Card) | Kind | Status |
| --- | --- | --- | --- |
| S01 | As a new user, I can create an account with my work email, so that my team can find me | walking-skeleton | skeleton |
| S02 | As a new user, I can invite a teammate, so that we can build together | variation | skeleton |

First slice: S01 (walking skeleton).
```

These are **derived views under a refresh-on-write contract**: any write-back that creates, parks,
supersedes, re-statuses, retitles, or reorders a child regenerates the parent's roll-up in the same
write-back — and the epic's `## Features` row whenever a feature's status or title changes. The
child files remain ground truth; a skill that detects drift on load repairs the roll-up silently.

## Front-matter schemas

Every file is YAML front-matter (machine state) + a markdown body (the human-readable brief). Field
names are camelCase.

**`epic.md`**

```yaml
---
id: E01
type: epic
title: Customer Onboarding
status: refined            # epics arrive refined from refine-epic
board: <miro-board-url>    # optional — the attached mirror board; omit when none
stack: STACK.md             # optional — the epic's stack decision file; omit when none
---
```

Body: `# E01 — <Title>`, then the refine-epic brief verbatim (Description, Benefit Hypothesis,
Business Outcomes, Leading Indicators, NFRs, Out-of-Scope, Open Measurements), then decompose-epic's
write-back sections (Out-of-Scope additions, Open Measurements additions, parked items with
evidence, evidence checkpoint), then `## Features`.

**`Features/Feature #NN - <Title>.md`**

```yaml
---
id: F01
type: feature
epic: E01                  # parent epic's ID
title: Self-serve signup
order: 1                   # narrative position
status: skeleton           # skeleton | refined | needs-discovery
featureType: business      # business | enabler-exploration | enabler-architecture |
                           # enabler-infrastructure | enabler-compliance | spike
tags: [mvp]                # mvp | contingent; optional discover-first
evidence: assumption       # validated | some-evidence | assumption | table-stakes
---
```

Body: `# F01 — <Title>`, then the skeleton sections `## Need` (cluster origin, in the SME's words) ·
`## Hypothesis` (four-slot) · `## Success signal` (Who-Does-What-By-How-Much) · `## Outcome served` ·
`## Risk` (the kill-question answer) · `## NFR constraints` (stamped must-levels), then `## Stories`.
A later refine-feature pass sharpens those sections in place and appends its own before `## Stories`.

**`stories for #NN - <Feature Title>/Story #NN - <Story Title>.md`**

```yaml
---
id: S01
type: story
feature: F01               # parent feature's ID
title: Create account with work email    # short activity phrase; names the file
order: 1
status: skeleton           # skeleton | ready | parked | superseded
kind: walking-skeleton     # walking-skeleton | variation | discovery | placeholder
tags: []                   # optional — e.g. illustrative (curation-added)
---
```

Body: `# S01 — <Title>`, then the Card line — `As a <role>, I can <activity>, so that <benefit>` —
plus an optional one-line note. The Card line never fattens; detail is attached by a later
refine-story pass, never inlined into the line itself.

## Status lifecycles

| Type | Lifecycle | Transitioned by |
| --- | --- | --- |
| epic | `refined` (fixed) | refine-epic (outside the store) |
| feature | `skeleton` → `refined` \| `needs-discovery`; `needs-discovery` → `refined` | refine-feature |
| story | `skeleton` → `ready`; any → `parked`; `parked` → `skeleton`; any → `superseded` | refine-story (`ready`); refine-feature curation (the rest) |
| stack | `decided` (revised in place on re-selection) | select-stack |

Parked stories keep their file with `status: parked` and a one-line reason; a story replaced by a
split or a recombine keeps its file as `status: superseded` with a `Split into S12 · S13`-style
line. Scope conservation: nothing is silently deleted, and IDs are never reused.

## Stack decision artifacts

An epic folder may contain two additional singleton files, written by the
`select-stack` skill and addressed by path (no `id` field, no ID prefix):

- `STACK.md` — the epic's technology-stack decision. Front-matter:
  `type: stack`, `epic: <E##>`, `status: decided`, `validatedAsOf: <YYYY-MM>`,
  `houseStackVersion: <stamp>`.
- `KICKOFF.md` — the staged build bootstrap for a Claude Code session.
  Front-matter: `type: kickoff`, `epic: <E##>`, `stack: STACK.md`.

Linkage: epic.md front-matter may carry an optional `stack: STACK.md` field
(omitted when none), following the `board:` precedent — see the epic.md schema
above. Never a body section — `## Features` remains the last body section.

Both files sit outside the roll-up refresh contract and outside the Miro mirror
(Cards render only epic/feature/story). On re-selection both files are revised
**in place** — the revised STACK.md records what changed as a dated revision
note, and prior versions live in git history. The item-file supersede idiom
does not apply to these path-addressed singletons.

## Miro mirror (optional — Cards, always)

An attached board renders the tree as a Card story-map. **One-way, files → board**: write the files
first, then re-render only the Cards you touched. Board edits are facilitation input, never record
state. Every epic, feature, and story is a **Card object** — never a sticky note or shape.

- **Topology:** the epic Card sits at the top of the map; one **frame per feature**, left-to-right
  in `order`, titled `<order> · <Feature Title>`; the feature Card at the top of its frame, story
  Cards beneath in `order`.
- **Card title** = `<ID> — <title>` (stories: `<ID> — As a … I can … so that …`).
- **Card description** = the file body, opening with the **state line**:
  `status: <value> · tags: <values> · evidence: <value>` (include only fields the type has; stories
  include `kind`). The Miro MCP exposes **no tag API** — the state line and the theme color ARE the
  board-visible state.
- **Theme color** (`theme=`) encodes status: skeleton `#2d9bf0` (blue) · refined/ready `#23c27f`
  (green) · needs-discovery `#ffa500` (orange) · parked/superseded `#808080` (gray).
- **DSL mechanics:** the layout DSL is line-oriented — encode body paragraphs as `<p>…</p>` blocks
  and never emit raw newlines or double quotes inside `desc="…"` (swap `"` for `'`). Call
  `layout_get_dsl` once before the first `layout_create`; re-render existing Cards with
  `layout_read` + `layout_update`.
- **Length:** descriptions of ~8,000 characters store un-truncated (verified 2026-07-14). If a body
  ever exceeds the ceiling, truncate at a section boundary and append
  `[…truncated — full text in <item's file path>]` — the file always holds the complete text.
- The mirror is attached via the epic's `board` front-matter field. If a board call fails mid-write,
  say so plainly and continue — the files are already correct, and the mirror can be re-rendered
  any time.

## Materializing the store (decompose-epic, output phase)

After the SME confirms the map and the canonical model + markdown feature map are produced:

1. **Offer the store** — one question, on its own turn: *"Want me to save this map as a backlog
   store — one markdown file per epic, feature, and story — so later refinement sessions can pick
   items up from disk?"* Declined → the paste-anywhere map stays the only output; don't re-offer.
2. **Ask for the root** — one question; default `./backlog/`.
3. **Mint IDs** per Identifiers above (scan the root first; narrative assignment order).
4. **Write the tree**: the epic folder + `epic.md` (ending with its `## Features` roll-up), one
   feature file per feature (ending with its `## Stories` roll-up and a `First slice:` line naming
   the walking-skeleton story — omitted when the set has none, e.g. a contingent feature holding
   only placeholders), and one story file per Card in the feature's stories folder. Sanitize names
   per Identifiers.
5. **Confirm back** in one line: root path, epic ID, feature and story counts.
6. **Then, only if Miro MCP tools are detected** (board-mode detection etiquette — Miro is never
   mentioned when absent): offer the **Card story-map mirror** as its own single question.
   Accepted → render per the Miro-mirror section (in a card-wall session, use a fresh area of the
   same board unless the SME names another) and record the board URL in the epic's `board` field.

## How later skills address the store

A session opens on the store's **directory path**. List default candidates by ID and title —
features with `status: skeleton`/`needs-discovery`, or stories with `status: skeleton`, per skill —
and let the user pick exactly one. `refined`/`ready` items may be re-opened as a revisit session
("what do you want to change, and why?" — work only that thread); a `parked` story may be un-parked
during refine-feature curation (back to `skeleton`, reason recorded). Every write-back updates the
item file, refreshes the parent roll-up (and the epic's `## Features` row on a feature status or
title change), and re-renders touched Cards when a board is attached.

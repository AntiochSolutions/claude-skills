# Design: Backlog store convention + decompose-epic retrofit (Spec A)

**Date:** 2026-07-07 · **Amended:** 2026-07-14 (files-always record, item IDs, parent roll-ups —
see `2026-07-14-refine-feature-design-review.md`)
**Status:** Approved by user (design sections confirmed in brainstorming session)
**Companions:** `2026-07-07-refine-feature-story-design.md` (Spec B — the two skills that consume this
store); `2026-07-01-decompose-epic-design.md` (the skill being retrofitted)

---

## 1. Purpose

The epic-shaping suite (refine-epic → decompose-epic → refine-feature → refine-story) gains a shared
**backlog store**: a durable system of record where the epic, its features, and their stories live as
individually addressable artifacts.

**The markdown tree is the single system of record — always** (amended 2026-07-14; supersedes the
original one-medium-per-backlog design). One file per item in a nested directory tree, written in the
working folder where the skill runs. A **Miro board may additionally mirror** the tree as a Card
story-map (user rule: epic, features, and stories are ALWAYS the Card object type — never sticky
notes or shapes), but the board is a render of the files, never the record — the same stance
decompose-epic's card wall already takes ("the board is only a mirror").

Mirror sync is **one-way, files → board**: a skill writes the files first, then re-renders the Cards
it touched when a board is attached. Board edits are facilitation input, never read back as record
state. decompose-epic is retrofitted to materialize the store at output; refine-feature and
refine-story (Spec B) read items from it and update them in place.

## 2. The tree (system of record)

```text
backlog/
  Epic #01 - Customer Onboarding/
    epic.md
    Features/
      Feature #01 - Self-serve signup.md
      stories for #01 - Self-serve signup/
        Story #01 - Create account with work email.md
        Story #02 - Invite a teammate.md
      Feature #02 - Guided first project.md
      stories for #02 - Guided first project/
        Story #03 - Start from a template.md
```

- Default root is `./backlog/` in the directory where the skill runs; the user may name another. The
  root exists so several epics can sit side by side and so ID allocation has a scan boundary.
- Topology (user-specified 2026-07-14): one **folder per epic** (`Epic #NN - <Title>`) holding
  `epic.md` and a `Features/` folder; each feature is a **file** (`Feature #NN - <Title>.md`) with a
  **sibling stories folder** (`stories for #NN - <Feature Title>/`) holding one file per story
  (`Story #NN - <Story Title>.md`, the story title being its short activity phrase).

### Identifiers (amended 2026-07-14)

- Every item gets a **store-unique, type-prefixed sequential ID** minted at creation: epics
  `E01, E02, …` · features `F01, F02, …` · stories `S01, S02, …` — zero-padded to two digits
  (growing naturally to three past 99).
- Uniqueness is **per backlog root, across all epics in it** (tracker-style): feature numbers do not
  restart per epic and story numbers do not restart per feature, so a bare `S17` is unambiguous.
  Allocation: highest existing ID of that type anywhere under the root, plus one.
- IDs are **permanent** — never reused, never renumbered; parked and superseded items keep theirs.
- Minted by whichever skill creates the item: decompose-epic at materialization; refine-feature for
  added/split story Cards; refine-story for peeled children.
- The ID is the `id` front-matter value, and its number is embedded in the name
  (`Feature #03 - …` ⇔ `F03`). Names carry the human title verbatim, with characters illegal in
  filenames replaced by `-` and trailing dots/spaces trimmed. A **retitle renames** the file/folder
  to match — a feature retitle also renames its stories folder — with the embedded `#NN` keeping
  identity stable through renames; `order` lives **only** in front-matter, so reordering renames
  nothing.

### Parent roll-ups (amended 2026-07-14)

Each parent lists its children: the epic file (`epic.md`) carries a `## Features` section and each
feature file a `## Stories` section — a table of `ID · title · status` (stories show the full Card line), sorted by
`order`, the feature roll-up marking the nominated first slice. These are **derived views under a
refresh-on-write contract**: any write-back that creates, parks, supersedes, re-statuses, retitles,
or reorders a child regenerates the parent's roll-up in the same write-back — and the epic's
`## Features` row whenever a feature's status or title changes. The child files remain ground truth;
a skill that detects drift on load repairs the roll-up silently. (Supersedes the original
never-duplicate-the-story-list rule.)

### Front-matter schemas

Every file is YAML front-matter (machine state) + markdown body (the human-readable brief). Field
names use camelCase, matching the suite's canonical models.

**`epic.md`** (inside `Epic #NN - <Title>/`)

```yaml
---
id: E01
type: epic
title: <business-language title>
status: refined          # epics arrive refined from refine-epic
board: <miro-board-url>  # optional — the attached mirror board; absent when none
---
```

Body: the refine-epic markdown brief verbatim (Description, Benefit Hypothesis, Business Outcomes,
Leading Indicators, NFRs, Out-of-Scope, Open Measurements), plus decompose-epic's write-back sections
(Out-of-Scope additions, Open Measurements additions, parked items with evidence, evidence
checkpoint).

**`Features/Feature #NN - <Title>.md`**

```yaml
---
id: F01
type: feature
epic: E01                      # parent epic's ID
title: <short noun phrase>
order: 1                       # narrative position
status: skeleton               # skeleton | refined | needs-discovery
featureType: business          # business | enabler-exploration | enabler-architecture |
                               # enabler-infrastructure | enabler-compliance | spike
tags: [mvp]                    # mvp | contingent; optional discover-first
evidence: assumption           # validated | some-evidence | assumption | table-stakes
---
```

Body sections at skeleton stage (written by decompose-epic, sharpened in place by refine-feature):
`## Need` (cluster origin, SME's words) · `## Hypothesis` (four-slot) · `## Success signal`
(Who-Does-What-By-How-Much) · `## Outcome served` · `## Risk` (from the kill question) ·
`## NFR constraints` (stamped must-levels). refine-feature (Spec B) appends: `## Feature acceptance
criteria`, `## Dependencies, risks & deferrals`, `## Knowledge-state report` (or `## Discovery brief`
when it exits that way).

**`stories for #NN - <Feature Title>/Story #NN - <Story Title>.md`**

```yaml
---
id: S01
type: story
feature: F01                   # parent feature's ID
title: <short activity phrase> # names the file; the Card line below remains the story
order: 1
status: skeleton               # skeleton | ready | parked | superseded
kind: walking-skeleton         # walking-skeleton | variation | discovery | placeholder
tags: []                       # optional — e.g. illustrative (curation-added, SAFe)
---
```

Body at skeleton stage: a single line — `As a <role>, I can <activity>, so that <benefit>` — plus an
optional one-line note. refine-story (Spec B) appends: `## Conversation notes`, `## Acceptance
criteria`, `## Not in this story`, `## Open questions` (red-card ledger), `## Knowledge-state report`.
The Card line itself never fattens (Jeffries: detail is attached, not inlined).

### Status lifecycles

| Type | Lifecycle | Transitioned by |
| --- | --- | --- |
| epic | `refined` (fixed) | refine-epic (outside the store) |
| feature | `skeleton` → `refined` \| `needs-discovery`; `needs-discovery` → `refined` (re-entry once the team brings discovery results back) | refine-feature |
| story | `skeleton` → `ready`; any → `parked`; `parked` → `skeleton` (un-park); any → `superseded` (replaced by split/recombine, children listed in the body) | refine-story (`ready`); refine-feature curation (`parked`, un-park, `superseded`, new skeletons) |

Parked stories keep their file with `status: parked` and a one-line reason appended; a story replaced
by a coarse split or a REPAIR recombine keeps its file as `status: superseded` with a
"Split into S12 · S13"-style line — scope conservation; nothing is silently deleted.

## 3. Miro mirror — the Card story-map (optional)

The same model projected onto a board as a **one-way mirror of the tree** — an optional extra
surface, never the record. **Every epic, feature, and story is a Miro Card object.**

- **Topology:** the epic Card sits at the top of the map. One **frame per feature**, arranged
  left-to-right in narrative order; each frame holds its feature Card at the top and its story Cards
  beneath in `order` (walking-skeleton first).
- **Card title** = `<ID> — <item title>` (for stories, `<ID> — As a … I can … so that …`), so board
  and files cross-reference at a glance.
- **Card description** = the markdown body (same content as the item's file body).
- **Card state** (verified 2026-07-14: the MCP exposes **no tag API** — `tags=` is silently ignored
  on create and no tag field exists on read-back, so Miro tag objects are NOT used): the first
  description line carries `status: <value> · tags: <values> · evidence: <value>`, and the Card
  **theme color** encodes status at a glance — skeleton `#2d9bf0` (blue) · refined/ready `#23c27f`
  (green) · needs-discovery `#ffa500` (orange) · parked/superseded `#808080` (gray). Both round-trip
  via `layout_read`/`board_list_items`; since the files are the record, board state is a render, not
  machine truth.
- **Frame title** = feature `order` + title (frames give skills reliable structure to read back via
  the existing `layout_read` mechanics).
- The mirror is attached via the epic's `board` front-matter field (or by the user mid-session);
  skills address the backlog by its **directory path** and re-render only the Cards their write-back
  touched.

**Constraints — verified empirically 2026-07-14** (scratch board `uXjVH7116GY=`): (a) Card
**create and read-back work** via `layout_create` / `layout_read` / `board_list_items` — title,
`desc`, `theme`, and frame parenting all round-trip, so the ALWAYS-Cards rule is implementable.
(b) **Tags are NOT available** through the MCP (no tag tools; `tags=` silently dropped on create; no
tag field on read-back) — hence the state-line + theme-color encoding above. (c) An
**~8,000-character description was accepted and stored un-truncated** (tail marker verified),
comfortably above typical refined bodies; the truncation convention remains as a safety net for
extreme cases — truncate at a section boundary and append
`[…truncated — full text in <item's file path>]`; the file always holds the complete text.

Sticky notes remain the medium for decompose-epic's *divergence wall* (raw capability cards are not
epics/features/stories, so the Card rule does not bind them). Only persisted backlog items are Cards.

## 4. decompose-epic retrofit

Scope: the interview (phases 1–10) is untouched. Changes:

1. **Output phase (11) — materialize the store.** After the SME confirms the map, the skill offers to
   write the backlog store. Accepting always writes the **markdown tree** (ask for the root
   directory, default `./backlog/`; mint IDs; create `Epic #NN - <Title>/` with `epic.md` from the
   epic input — including its `## Features` roll-up — one `Feature #NN - <Title>.md` per feature
   with its `## Stories` roll-up, and one `Story #NN - <Title>.md` per Card inside the feature's
   `stories for #NN - <Title>/` folder). When Miro MCP tools are detected, additionally offer the **board mirror** (render the Card
   story-map per §3 on the session's board or a board the user names, and record it in the epic's
   `board` field). The paste-anywhere markdown feature-map brief remains available in all cases, and
   remains the only output when the user declines materialization.
2. **`references/backlog-store.md`** added to the plugin — the canonical convention text (§2–§3 of
   this spec, rendered as a reference file). This file is duplicated verbatim into the refine-feature
   and refine-story plugins (Spec B), because marketplace plugins install independently; the repo
   README gains a keep-in-sync note.
3. **`references/board-mode.md` update** — the "Story-map render (phase 11, optional)" section is
   replaced by a pointer to the Card materialization in `backlog-store.md`. Divergence/clustering
   sections are untouched.
4. **SKILL.md phase-11 paragraph** updated to name the tree materialization and the optional board
   mirror.

## 5. Item addressing (consumed by Spec B skills)

A skill session opens by locating the backlog: the user gives the store's directory path (the files
are the record; an attached board mirror is discovered from the epic's `board` field and re-rendered
after write-back — Miro is only ever mentioned when its MCP tools are detected, same etiquette as
decompose-epic's board mode). The skill lists **default candidates** by ID and title — features with
`status: skeleton`/`needs-discovery`, or stories with `status: skeleton`, per skill — and lets the
user pick exactly one per session. Items past those statuses stay addressable (amended 2026-07-14,
matching the suite's revisit convention): a `refined` feature or `ready` story may be re-opened as a
**revisit session** ("what do you want to change, and why?" — work only that thread), and a `parked`
story may be selected during refine-feature curation to **un-park** (back to `skeleton`, reason
recorded).

## 6. Out of scope

Two-way board sync (the mirror is strictly files → board; board edits never flow back as record
state) · retrofitting refine-epic (epics enter the store via decompose-epic) ·
tracker (Jira/ADO) export beyond the existing field-mapping guidance · validating store integrity as a
standalone tool · version history inside the store (git / Miro history serve that).

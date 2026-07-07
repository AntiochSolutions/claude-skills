# Design: Backlog store convention + decompose-epic retrofit (Spec A)

**Date:** 2026-07-07
**Status:** Approved by user (design sections confirmed in brainstorming session)
**Companions:** `2026-07-07-refine-feature-story-design.md` (Spec B — the two skills that consume this
store); `2026-07-01-decompose-epic-design.md` (the skill being retrofitted)

---

## 1. Purpose

The epic-shaping suite (refine-epic → decompose-epic → refine-feature → refine-story) gains a shared
**backlog store**: a durable system of record where the epic, its features, and their stories live as
individually addressable artifacts. Two media, chosen per backlog:

- **Markdown medium** — one file per item in a nested directory tree, in the user's own repo.
- **Miro medium** — one **Card** object per item on a Miro board (user rule: epic, features, and
  stories are ALWAYS the Card object type — never sticky notes or shapes).

A backlog lives in exactly **one** medium. Cross-medium sync is out of scope for v1 (future work).
decompose-epic is retrofitted to materialize the store at output; refine-feature and refine-story
(Spec B) read items from it and update them in place.

## 2. Markdown medium — the tree

```text
backlog/
  <epic-slug>/
    epic.md
    features/
      01-<feature-slug>/
        feature.md
        stories/
          01-<story-slug>.md
          02-<story-slug>.md
```

- Default root is `./backlog/` in the directory where the skill runs; the user may name another.
- Numeric prefixes on feature directories and story files carry narrative/walking-skeleton order and
  match the `order` front-matter field.
- Slugs are kebab-case, derived from titles, stable once created (renames change `title`, not `id`).
- The story *list* is never duplicated inside `feature.md` — it is derived from the `stories/`
  directory (single source of truth).

### Front-matter schemas

Every file is YAML front-matter (machine state) + markdown body (the human-readable brief). Field
names use camelCase, matching the suite's canonical models.

**epic.md**

```yaml
---
id: <epic-slug>
type: epic
title: <business-language title>
status: refined          # epics arrive refined from refine-epic
---
```

Body: the refine-epic markdown brief verbatim (Description, Benefit Hypothesis, Business Outcomes,
Leading Indicators, NFRs, Out-of-Scope, Open Measurements), plus decompose-epic's write-back sections
(Out-of-Scope additions, Open Measurements additions, parked items with evidence, evidence
checkpoint).

**feature.md**

```yaml
---
id: <feature-slug>
type: feature
epic: <epic-slug>
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

**stories/NN-\<story-slug\>.md**

```yaml
---
id: <story-slug>
type: story
feature: <feature-slug>
order: 1
status: skeleton               # skeleton | ready | parked
kind: walking-skeleton         # walking-skeleton | variation | discovery | placeholder
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
| feature | `skeleton` → `refined` \| `needs-discovery` | refine-feature |
| story | `skeleton` → `ready`; any → `parked` | refine-story (`ready`); refine-feature curation (`parked`, new skeletons) |

Parked stories keep their file with `status: parked` and a one-line reason appended — scope
conservation; nothing is silently deleted.

## 3. Miro medium — the Card story-map

Same model projected onto a board. **Every epic, feature, and story is a Miro Card object.**

- **Topology:** the epic Card sits at the top of the map. One **frame per feature**, arranged
  left-to-right in narrative order; each frame holds its feature Card at the top and its story Cards
  beneath in `order` (walking-skeleton first).
- **Card title** = item title (for stories, the full `As a … I can … so that …` line).
- **Card description** = the markdown body (same content as the file body in the markdown medium).
- **Card tags** = `status:<value>` plus the front-matter `tags` and `evidence` values (e.g. `mvp`,
  `assumption`). Tags are the machine-readable state in this medium.
- **Frame title** = feature `order` + title (frames give skills reliable structure to read back via
  the existing `layout_read` mechanics).
- Skills address a backlog by **board URL**; item selection is by reading frames and Card tags.

**Known constraint to verify at implementation:** Miro Card descriptions have a length ceiling. The
convention: if a refined body exceeds the limit, truncate at a section boundary and append the marker
`[…truncated — full text maintained in conversation output]`; never silently drop content. The
implementation task must verify the actual limit and behavior.

Sticky notes remain the medium for decompose-epic's *divergence wall* (raw capability cards are not
epics/features/stories, so the Card rule does not bind them). Only persisted backlog items are Cards.

## 4. decompose-epic retrofit

Scope: the interview (phases 1–10) is untouched. Changes:

1. **Output phase (11) — materialize the store.** After the SME confirms the map, the skill offers to
   write the backlog store: **markdown mode** (ask for the root directory, default `./backlog/`;
   write the full tree — `epic.md` from the epic input, `feature.md` per feature, one story file per
   Card) or **Miro Cards mode** (create the Card story-map per §3 on the session's board, or a board
   the user names). The paste-anywhere markdown feature-map brief remains available in both cases,
   and remains the only output when the user declines materialization.
2. **`references/backlog-store.md`** added to the plugin — the canonical convention text (§2–§3 of
   this spec, rendered as a reference file). This file is duplicated verbatim into the refine-feature
   and refine-story plugins (Spec B), because marketplace plugins install independently; the repo
   README gains a keep-in-sync note.
3. **`references/board-mode.md` update** — the "Story-map render (phase 11, optional)" section is
   replaced by a pointer to the Card materialization in `backlog-store.md`. Divergence/clustering
   sections are untouched.
4. **SKILL.md phase-11 paragraph** updated to name the two materialization modes.

## 5. Item addressing (consumed by Spec B skills)

A skill session opens by locating the backlog: the user gives a directory path (markdown medium) or a
board URL (Miro medium; offered only when Miro MCP tools are detected — same detection-and-offer
etiquette as decompose-epic's board mode, including the never-mention-when-absent rule). The skill
lists candidate items (features with `status: skeleton`/`needs-discovery`, or stories with
`status: skeleton`, per skill) by title and lets the user pick exactly one per session.

## 6. Out of scope

Cross-medium sync or migration · retrofitting refine-epic (epics enter the store via decompose-epic) ·
tracker (Jira/ADO) export beyond the existing field-mapping guidance · validating store integrity as a
standalone tool · version history inside the store (git / Miro history serve that).

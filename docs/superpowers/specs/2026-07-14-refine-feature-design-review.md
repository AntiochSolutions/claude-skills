# Design review: refine-feature / refine-story specs (pre-build)

**Date:** 2026-07-14
**Reviewed:** `2026-07-07-refine-feature-story-design.md` (Spec B),
`2026-07-07-backlog-store-design.md` (Spec A), against the research brief, the shipped refine-epic /
decompose-epic skills, and decompose-epic's canonical output model.
**Verdict:** DEFICIENT as a build contract, sound as an architecture — every finding was a
spec-level repair; none invalidated the design. **All resolutions below were applied to the two
specs on 2026-07-14** (see each spec's Amended header).

---

## 1. Findings and resolutions

1. **Ending criteria and gates contradicted the design's own fast paths.** §9 was one unconditional
   conjunction (full Planguage ladder, ledger, full curation, gate both ways) while §5/§6 defined a
   fast lane, a discovery-brief exit (bails before AC exist), an offered hypothesis-only pass, and a
   complexity-1–2 fast pass — none of which could legally end. The Demo-and-Read-Back gate's
   "3–5 criteria" was a hard count a legitimate 2-criterion story failed. *Risk:* the built agent
   refuses fast exits or pads — the exact failure §8 prohibits. **Fixed:** §9 rewritten route-scoped;
   Benefit-Trace Gate route-scoped ((a)–(e) full pass; (b)–(d) fast lane; skipped on brief/
   hypothesis-only exits); vital filter demoted to "every criterion reject-worthy; 3–5 the norm."

2. **Miro medium silently lost data and rested on unverified mechanics.** Truncated Card bodies
   pointed at "conversation output" (ephemeral) while Miro was a full system of record; and only
   sticky notes + frames were ever verified against the Miro MCP toolset — Card objects (the
   ALWAYS-Cards rule) never were. **Fixed by the user's files-always decision** (below): the marker
   now points at the item's file; Card create/read/tag verification added to the implementation
   checklist.

3. **One-way lifecycle doors.** `refined`/`ready` items were unaddressable (no revisit, contradicting
   the suite's revisit convention); `parked` had no exit despite "not now, not no"; the
   hypothesis-only pass had no defined write-back; `needs-discovery` had no described re-entry.
   **Fixed:** revisit selection + un-park in Spec A §5 and the lifecycle table; hypothesis-only stays
   `skeleton` with a shallow-pass note; discovery re-entry re-runs the Phase-1 triage seeded by the
   discovery results.

4. **Spec B specified labels the Spec A schema couldn't carry.** "Labeled illustrative" had no field;
   `kind` for added/split/peeled stories was unassigned; the first-slice note had no home; the split
   parent's fate was undefined. **Fixed:** story front-matter gains optional `tags`
   (`illustrative`); added/split/peeled Cards default `kind: variation` (`discovery` for
   riskiest-assumption stories); first slice = `order: 1` + a mark in the feature roll-up; split and
   recombined-away parents become `status: superseded` (new enum value) listing their children; a
   refine-story peel narrows its parent and never supersedes it. Capacity-bet answers and the
   impact-lite share are elicitation only, never persisted (no-scores lock).

5. **No test plan** — a suite-wide gap (the decompose-epic spec has none either). **Fixed:** Spec B
   §11 — five pressure personas, baseline (RED) → compliance (GREEN) runs, micro-tests on the
   load-bearing routing/gate wording, and a store round-trip fixture.

6. **Dual-source drift.** Spec B's §7 vague-word battery silently dropped ~7 terms from the brief's
   stop-list; the shared machinery duplicated into two interview guides had no keep-in-sync note;
   Spec A's numeric order-prefixes duplicated the `order` field (reorders forced file renames).
   **Fixed:** the brief's §4 stop-list declared canonical; README keep-in-sync note extended to the
   shared-machinery blocks; order-prefixes superseded by ID-prefixed filenames (`order` lives only in
   front-matter).

7. **Rendering hazards pinned:** the battery scoped to drafted criteria only (its own scale library
   contains "support contacts/week"); *and/or* = the literal token; the three count nouns defined
   (criteria 3–5 · examples 3–7/rule · scenarios ~5–6 → split); frontmatter descriptions drafted
   trigger-only in §4 (deliberately not the suite's older workflow-summary style).

## 2. User requirements added 2026-07-14

- **Markdown files always** — the tree in the working folder is the single system of record; a Miro
  board is an optional **one-way mirror** (files → board). This restores decompose-epic's own
  "the board is only a mirror" stance, which Spec A had overridden with a one-medium-of-record model.
- **Item IDs** — `E01/F01/S01`-style type-prefixed sequential IDs on every work item.
- **Parent roll-ups** — the epic file lists its features; each feature file lists its stories; each
  child names its parent (front-matter `epic:` / `feature:` by ID).
- **Topology (user sketch, same day):** one folder per epic (`Epic #NN - <Title>/`) holding
  `epic.md` and `Features/`; each feature is a *file* (`Feature #NN - <Title>.md`) with a sibling
  `stories for #NN - <Feature Title>/` folder of `Story #NN - <Story Title>.md` files —
  human-readable names throughout, no slugs.

Decisions taken while applying them (veto and re-amend if wrong):

- **ID scope:** store-unique per type across the whole backlog root (tracker-style — `F` numbers do
  not restart per epic), zero-padded two digits, permanent, allocation = max existing + 1.
- **Naming:** names embed the ID's number and the title verbatim (`Feature #03 - <Title>.md` ⇔
  `F03`; illegal filename characters replaced with `-`); a retitle renames the file/folder to match
  (a feature retitle also renames its stories folder) — the embedded `#NN` keeps identity stable;
  `order` is front-matter only, so reordering renames nothing. Epic folders still live under the
  `./backlog/` root (several epics side by side; ID-allocation scan boundary); the epic's own file
  is plainly `epic.md`; story files are named by a short activity-phrase `title` (new story
  front-matter field, derived from the Card line).
- **Roll-ups:** `ID · title · status` tables sorted by `order`, under a refresh-on-write contract
  (any write-back touching a child regenerates the parent's list; child files stay ground truth,
  drift repaired silently on load).
- **Mirror attachment:** recorded in the epic's optional `board:` front-matter field; Card titles
  gain the ID prefix (`F03 — <title>`).

## 3. Remaining pre-build checklist

- [ ] Verify the Miro MCP toolset can **create, read back, and tag Card objects** (only stickies and
      frames were verified for decompose-epic) and measure the Card-description ceiling (Spec A §3).
- [ ] Second fresh-context review of the amended specs before dispatching the build (this review is
      one pass; the plan-gate protocol wants two).
- [ ] Build order: Spec A (store + decompose-epic retrofit) first, then refine-feature, then
      refine-story — running Spec B §11's test plan per skill before it ships.

# Antioch Skills

A [Claude Code](https://code.claude.com) plugin marketplace of practical, focused skills from [Antioch Solutions](https://www.antiochsolutions.com).

**Each skill is its own plugin, so you install only the ones you want** — adding the marketplace installs nothing on its own.

## Install

Add the marketplace once:

```text
/plugin marketplace add AntiochSolutions/claude-skills
```

Then install any individual skill:

```text
/plugin install ikigai-discovery@antioch-skills
```

That installs **only** `ikigai-discovery` — none of the other skills. Install more the same way, one at a time. To remove one:

```text
/plugin uninstall ikigai-discovery@antioch-skills
```

> `AntiochSolutions/claude-skills` is the GitHub repo you add; `antioch-skills` (the part after `@`) is the marketplace name skills install from.

**Already added the marketplace a while ago?** Claude Code installs from a local copy that doesn't refresh on its own — if a skill listed below comes back "not found", update first:

```text
/plugin marketplace update antioch-skills
```

### Returning users — upgrading to the full epic-shaping suite

Already using `refine-epic`? It's now the first of **five** skills that work a shared backlog:
**refine-epic → decompose-epic → refine-feature → refine-story → select-stack**. To get the rest:

```text
/plugin marketplace update antioch-skills

/plugin install decompose-epic@antioch-skills
/plugin install refine-feature@antioch-skills
/plugin install refine-story@antioch-skills
/plugin install select-stack@antioch-skills
```

Then **restart Claude Code** — plugin changes apply to new sessions.

- The marketplace update comes **first**, always — without it the new plugins come back "not found".
- **Already had `decompose-epic` installed?** Update it (a plain re-install won't bump the pinned
  version): in a terminal, `claude plugin update decompose-epic@antioch-skills` — or use the
  `/plugin` manager UI. The update teaches it to **materialize the backlog store**.
- The workflow: `/refine-epic` as before → `/decompose-epic`, which now ends by offering to save
  the map as a **backlog store** (one markdown file per epic/feature/story — say yes and give it a
  folder, default `./backlog/`) → `/refine-feature` on one feature at a time → `/refine-story` on
  one story Card at a time, both picking items straight from that store → `/select-stack` once the
  store exists, to choose the tech stack and generate the build kickoff. Nothing about
  `refine-epic` itself changes — existing epics enter the store whenever `decompose-epic` runs on
  them.

### Migrating an existing epic (and Miro board) into the store

Refined an epic with the original `refine-epic` and kept your working state on a Miro board? The
sync is strictly **one-way, files → board** — so you materialize the files first, then re-render
the board in the new Card format. Nothing is converted in place, and the epic itself doesn't need
re-running.

1. **Upgrade** per the section above, then start Claude Code in the repo/folder where the backlog
   should live (the store defaults to `./backlog/` there; a git repo gives it history).
2. **Run `/decompose-epic`** and hand it what exists: paste the original refine-epic brief (or,
   with Miro connected, give the board URL and let the session read it off the board). No feature
   decomposition yet → it runs the full interview. Features/stories already sketched → offer them
   as an *existing decomposition*: the revisit branch asks "what do you want to change, and why?"
   and re-checks only what's touched.
3. **Say yes twice at the end:** *"save as a backlog store?"* creates the markdown tree —
   `Epic #01 - <Title>/`, feature files, story files, permanent `E01/F01/S01` IDs — which is now
   the system of record; *"render the Card story-map mirror?"* puts the **new Card format** on your
   board (Card objects only, `F03 — <title>` titles, a status line opening each description, status
   theme colors), and records the board URL in `epic.md` so future sessions keep it refreshed.
4. **Old board content stays put** — the mirror is a clean render beside it; keep the old wall as
   history or archive it by hand.

From then on the files are the truth: every `/refine-feature` and `/refine-story` session updates
the files and re-renders just the Cards it touched. Edits made directly on the board never flow
back — by design.

## Available skills

| Skill | Install | What it does |
|-------|---------|--------------|
| [`ikigai-discovery`](plugins/ikigai-discovery) | `/plugin install ikigai-discovery@antioch-skills` | Guides you through a rigorous Ikigai interview to find your reason for being, then produces a polished report. |
| [`refine-epic`](plugins/refine-epic) | `/plugin install refine-epic@antioch-skills` | Interviews a business SME to shape a well-formed Agile Epic — falsifiable Benefit Hypothesis, measurable Business Outcomes, predictive Leading Indicators, quantified NFRs, Out-of-Scope — then hands back a structured result and a markdown brief. Tracker-agnostic, no API required. |
| [`build-a-great-elite-question`](plugins/build-a-great-elite-question) | `/plugin install build-a-great-elite-question@antioch-skills` | Interviews you to turn a real founder situation into a sharp, well-diagnosed question for Dan Martell's Elite group, framed as "I'm Here" / "I want to be there" / "My bottleneck is...", and produces a one-page prep sheet. |
| [`decompose-epic`](plugins/decompose-epic) | `/plugin install decompose-epic@antioch-skills` | Decomposes a refined epic into skeleton Features and Stories via an SME interview — behavior mining, affinity clustering, an outcome coverage gate, and an MVP partition — output as a feature map, optionally materialized as a **backlog store** of markdown files (with a Miro Card mirror). Optional Miro card-wall mode. Tracker-agnostic, no API required. Pairs with [`refine-epic`](plugins/refine-epic) — run that first on a raw epic. |
| [`refine-feature`](plugins/refine-feature) | `/plugin install refine-feature@antioch-skills` | Takes one skeleton feature from the backlog store to build-ready via an SME interview — four-risks triage with a fast lane and a discovery-brief exit, a quantified success signal, dual-test feature acceptance criteria, NFR binding, and shallow story-set curation (add/split/park/repair + a nominated first slice). Writes back to the store in place. Pairs with [`decompose-epic`](plugins/decompose-epic) — run that first to create the store. |
| [`refine-story`](plugins/refine-story) | `/plugin install refine-story@antioch-skills` | Takes one story Card from the backlog store to ready-for-sprint-planning via an SME interview — a real happy path, Example-Mapping rule/example mining, an adaptive Confirmation (checklist by default; table or Given-When-Then only when the cases demand it), INVEST checks with honest splitting, and a demo-narration gate. The Card line never fattens. Pairs with [`refine-feature`](plugins/refine-feature) — run that on the feature first. |
| [`select-stack`](plugins/select-stack) | `/plugin install select-stack@antioch-skills` | Interviews a non-technical founder to select the tech stack a Claude Code instance will build — derives the app's demands from the backlog store (every signal cited), asks only founder-level constraint questions, applies a researched house stack with an Azure escalation tier and six non-negotiables (QA+PROD, scripted infra, API-first, managed API keys, gated releases, TDD), and writes STACK.md + KICKOFF.md into the epic folder. Pairs with [`decompose-epic`](plugins/decompose-epic) — run that first to create the store. |
| [`statusline`](plugins/statusline) | `/plugin install statusline@antioch-skills` | Installs a two-line Claude Code status line — model + reasoning effort, directory, git branch, session name, a color-coded context bar, cost, duration, and 5h/7d rate-limit usage. After installing, say "set up the status line". Requires Python 3. |

## Add a new skill

One plugin per skill. To add `my-skill`:

```text
plugins/my-skill/
├── .claude-plugin/
│   └── plugin.json          # name must be unique — it's the install handle
└── skills/
    └── my-skill/
        ├── SKILL.md         # name + a keyword-rich description (drives auto-activation)
        └── references/      # optional supporting files, referenced from SKILL.md
```

Then add one entry to [`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json) — the `source` **must** be the explicit `./plugins/<name>` path (a bare name fails to install):

```json
{ "name": "my-skill", "source": "./plugins/my-skill", "description": "…", "keywords": ["…"] }
```

Run the validator, and commit. Use [`plugins/ikigai-discovery`](plugins/ikigai-discovery) as a template.

### Shared reference: `backlog-store.md`

[`plugins/decompose-epic/skills/decompose-epic/references/backlog-store.md`](plugins/decompose-epic/skills/decompose-epic/references/backlog-store.md)
is the canonical **backlog-store convention** for the epic-shaping suite (refine-epic →
decompose-epic → refine-feature → refine-story → select-stack). The refine-feature, refine-story,
and select-stack plugins carry **verbatim copies** of it (plugins install independently) — when the
convention changes, update **every copy in the same commit**.

## Validate

```text
node scripts/validate-marketplace.mjs   # structural checks (also run in CI)
claude plugin validate .                # official Claude Code validator
```

## Versioning

Plugins here omit an explicit `version`, so Claude Code tracks each plugin by commit — users get the latest when they run `/plugin marketplace update antioch-skills`. To pin a stable release, add `"version": "x.y.z"` to that plugin's `plugin.json` and bump it on changes.

## License

[MIT](LICENSE) © Antioch Solutions

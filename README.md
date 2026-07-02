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

## Available skills

| Skill | Install | What it does |
|-------|---------|--------------|
| [`ikigai-discovery`](plugins/ikigai-discovery) | `/plugin install ikigai-discovery@antioch-skills` | Guides you through a rigorous Ikigai interview to find your reason for being, then produces a polished report. |
| [`refine-epic`](plugins/refine-epic) | `/plugin install refine-epic@antioch-skills` | Interviews a business SME to shape a well-formed Agile Epic — falsifiable Benefit Hypothesis, measurable Business Outcomes, predictive Leading Indicators, quantified NFRs, Out-of-Scope — then hands back a structured result and a markdown brief. Tracker-agnostic, no API required. |
| [`build-a-great-elite-question`](plugins/build-a-great-elite-question) | `/plugin install build-a-great-elite-question@antioch-skills` | Interviews you to turn a real founder situation into a sharp, well-diagnosed question for Dan Martell's Elite group, framed as "I'm Here" / "I want to be there" / "My bottleneck is...", and produces a one-page prep sheet. |
| [`decompose-epic`](plugins/decompose-epic) | `/plugin install decompose-epic@antioch-skills` | Decomposes a refined epic into skeleton Features and Stories via an SME interview — behavior mining, affinity clustering, an outcome coverage gate, and an MVP partition — output as a feature map. Optional Miro card-wall mode. Tracker-agnostic, no API required. Pairs with [`refine-epic`](plugins/refine-epic) — run that first on a raw epic. |

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

## Validate

```text
node scripts/validate-marketplace.mjs   # structural checks (also run in CI)
claude plugin validate .                # official Claude Code validator
```

## Versioning

Plugins here omit an explicit `version`, so Claude Code tracks each plugin by commit — users get the latest when they run `/plugin marketplace update antioch-skills`. To pin a stable release, add `"version": "x.y.z"` to that plugin's `plugin.json` and bump it on changes.

## License

[MIT](LICENSE) © Antioch Solutions

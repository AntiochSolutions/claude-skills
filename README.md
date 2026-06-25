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
| [`ikigai-discovery`](plugins/ikigai-discovery) | `/plugin install ikigai-discovery@antioch-skills` | Guides you through a rigorous, adversarial Ikigai interview to find your reason for being, then produces a polished report. |

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

Then add one entry to [`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json), run the validator, and commit. Use [`plugins/ikigai-discovery`](plugins/ikigai-discovery) as a template.

## Validate

```text
node scripts/validate-marketplace.mjs   # structural checks (also run in CI)
claude plugin validate .                # official Claude Code validator
```

## Versioning

Plugins here omit an explicit `version`, so Claude Code tracks each plugin by commit — users get the latest when they run `/plugin marketplace update antioch-skills`. To pin a stable release, add `"version": "x.y.z"` to that plugin's `plugin.json` and bump it on changes.

## License

[MIT](LICENSE) © Antioch Solutions

# Marketplace with engineering, data, design (Anthropic's knowledge-work plugins)
/plugin marketplace add anthropics/knowledge-work-plugins

# Install at project scope so it's shared via the repo
/plugin install engineering@knowledge-work-plugins --scope project
/plugin install data@knowledge-work-plugins --scope project
/plugin install design@knowledge-work-plugins --scope project

# From the built-in official marketplace (no marketplace add needed)
/plugin install skill-creator@claude-plugins-official --scope project
/plugin install mcp-server-dev@claude-plugins-official --scope project

# Pick up the changes in the current session
/reload-plugins



# Superpowers

/plugin install superpowers@claude-plugins-official



# Front-end Building

# Design principles for production-grade UI (official Anthropic)
/plugin install frontend-design@claude-plugins-official

# React + TypeScript + Tailwind + shadcn/ui builder, bundles to a single HTML file
/plugin marketplace add anthropics/skills
/plugin install web-artifacts-builder@anthropic-agent-skills

# Optional: shadcn component context (community MCP; needs a GitHub token
# from github.com/settings/tokens/new, public_repo scope)
npx shadcn@latest mcp init --client claude

/reload-plugins







[Microsoft for Startups | Microsoft](https://www.microsoft.com/en-us/startups)




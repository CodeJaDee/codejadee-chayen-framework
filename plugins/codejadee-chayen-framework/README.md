# codejadee-chayen-framework (plugin package)

This directory is the **only** distributable unit of Chayen. Each provider
installs it through its own native plugin mechanism.

| File | Read by |
|---|---|
| `plugin.json` | Agent Plugins 1.0 clients: OpenAI Codex, GitHub Copilot CLI, VS Code Copilot |
| `.claude-plugin/plugin.json` | Claude Code |
| `skills/` | Every provider. This is the single canonical skill source. |

## Current state: 0.1.0-dev

This is a **pilot build** with six entry skills. The list is in
`skills/README.md`.

- Skills activate automatically when a request matches their description.
- Requests that match no skill are handled by the agent normally.
- Trigger reliability has not yet been measured. See
  `docs/chayen/PROGRESS.md` in the repository.

## Package rules

- **Allowed files:** Markdown and JSON only. No hooks, MCP servers, agents,
  commands, scripts, or executables (ADR-0005).
- **Single skill source:** skills live only in `skills/<skill-name>/SKILL.md`.
  Never copy them into provider-specific folders (ADR-0006).
- **Identity:** `name` and `version` must be identical in both manifests.
  The developer-only validator (`tools/validate/`) checks this.

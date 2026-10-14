# Developer-only validators

These tools are for **repository maintainers only**.

- They are not part of the plugin package (`plugins/`).
- Plugin users never run them.
- They have no runtime dependencies. They need Node.js 18 or later.

```bash
node tools/validate/validate-package.mjs
```

## What it checks

| ID | What it checks |
|---|---|
| V-02 | `plugins/codejadee-chayen-framework/plugin.json` follows the Agent Plugins 1.0.0 field rules. These are re-implemented from the official schema; see "Limits" below. |
| V-03 | The Claude Code manifest: name rules, reserved names, and no component keys. |
| V-04 | Name, version, and metadata are identical across both manifests, and `version` is semver. |
| V-01a | `.claude-plugin/marketplace.json` follows the Claude Code rules. |
| V-01b | `.github/plugin/marketplace.json` follows the Copilot CLI rules. |
| V-01c | `.agents/plugins/marketplace.json` follows the Codex rules. |
| (V-01a–c) | For all three marketplace files: the source path rules, that the path resolves to the plugin directory, and that the entry name equals the manifest name. |
| V-09 | The plugin contains only `.md` and `.json` files, with no hooks, MCP servers, agents, commands, scripts, or symlinks. |
| V-05 | `SKILL.md` files exist only under the canonical `skills/` directory, and use portable frontmatter. |
| V-13 | Nothing at the repo root that providers would misread as a plugin. |

Exit code `1` means at least one error.

## Limits

This script is **not** a full JSON Schema validator. It re-implements the
rules of the official Agent Plugins schema. Full schema validation was run
separately in Step 04; see `docs/chayen/PROGRESS.md`.

The authoritative provider checks are:

- `claude plugin validate --strict <dir>` (Claude Code)
- install tests per provider

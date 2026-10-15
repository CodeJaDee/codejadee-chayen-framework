# Install in OpenAI Codex

Chayen installs through Codex's native plugin marketplace.

| Item | Value |
|---|---|
| Marketplace name | `codejadee` (display name "CodeJaDee") |
| Plugin | `codejadee-chayen-framework` |
| Install identifier | `codejadee-chayen-framework@codejadee` |
| Marketplace file | `.agents/plugins/marketplace.json` |
| Plugin manifest | `plugins/codejadee-chayen-framework/plugin.json` (Agent Plugins 1.0) |
| Surfaces | Codex CLI. Codex in the ChatGPT desktop app supports plugins too, but was not tested. **The Codex IDE extension (VS Code) does not support plugins.** |

> **Before you start**
>
> - The repository is **private** during pre-release. Adding it needs Git
>   access; otherwise use a local clone you are allowed to use.
> - Review the source and pin a revision you trust.

## Install (CLI)

```bash
# 1. Add the marketplace: GitHub (needs access) or a local clone
codex plugin marketplace add CodeJaDee/codejadee-chayen-framework
codex plugin marketplace add /path/to/codejadee-chayen-framework

# 2. Install
codex plugin add codejadee-chayen-framework@codejadee
#    or, interactively: run `codex`, type /plugins, choose the plugin, install

# 3. Check it, then start a NEW session so the skills are loaded
codex plugin list --marketplace codejadee      # "installed, enabled"
```

## VS Code (Codex IDE extension)

OpenAI documents that "the IDE extension doesn't support plugins" (re-checked
2026-10-15). There is **no supported way** to install Chayen as a plugin
there.

The extension can load standalone skills from `.agents/skills`. That is not
a plugin install, and Chayen does not document or support copying skills
there (an open decision, ISSUES Q-02).

## Use

- **Normal prompts.** Codex selects a skill when your task matches its
  description. See [AUTOMATIC_SKILL_DISCOVERY.md](AUTOMATIC_SKILL_DISCOVERY.md).
- **Explicit invocation** uses the `$` prefix:

  ```text
  $chayen-security Review this controller for injection risks.
  ```

## Disable, enable, update, uninstall

| Action | How |
|---|---|
| Disable or enable | In `/plugins`, press **Space** on the plugin. Or add `enabled = false` under `[plugins."codejadee-chayen-framework@codejadee"]` in `config.toml` (in `CODEX_HOME`, normally `~/.codex/`). A one-off `-c` override did **not** disable the plugin in testing. |
| Update | Codex 0.160.1 has **no per-plugin update command**. `codex plugin marketplace upgrade codejadee` refreshes Git marketplaces. If the installed version does not change, run `codex plugin remove codejadee-chayen-framework@codejadee` and then `codex plugin add codejadee-chayen-framework@codejadee`. This update path is **not yet verified**. |
| Uninstall | `codex plugin remove codejadee-chayen-framework@codejadee`, then optionally `codex plugin marketplace remove codejadee`. An empty cache directory may remain. |

## Verification status (2026-10-15)

| Check | Codex CLI | Codex IDE extension |
|---|---|---|
| Marketplace file and manifest selected by the installed Codex code | Confirmed by inspecting 0.160.1 | Unsupported |
| Install, list, disable, uninstall | Passed for an earlier 6-skill build (0.160.1, 2026-10-14). **Not yet run for the current 13-skill build.** | Unsupported |
| Routing and explicit `$chayen-security` | Passed for the earlier build (7/7 smoke prompts). Current build: **not tested.** | Unsupported |
| Install from the GitHub marketplace | Not tested | Unsupported |

# Install in OpenAI Codex

Chayen installs through Codex's native plugin marketplace.

| Item | Value |
|---|---|
| Marketplace name | `codejadee` (display name "CodeJaDee") |
| Plugin | `chayen` |
| Install identifier | `chayen@codejadee` |
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
codex plugin add chayen@codejadee
#    or, interactively: run `codex`, type /plugins, choose the plugin, install

# 3. Check it, then start a NEW session so the skills are loaded
codex plugin list --marketplace codejadee      # "installed, enabled"
```

## Renamed from codejadee-chayen-framework

Until 2026-10-17 the plugin was named `codejadee-chayen-framework`. It is now
`chayen` (D-059), so installs made under the old name must be replaced. The
repository, the marketplace name `codejadee` and the plugin folder
(`plugins/codejadee-chayen-framework/`) are unchanged. These commands follow
the documented CLI syntax but have **not yet been run** for this rename.

```bash
codex plugin remove codejadee-chayen-framework@codejadee
codex plugin marketplace upgrade codejadee
codex plugin add chayen@codejadee
```

If you disabled the plugin in `config.toml`, the section key is now
`[plugins."chayen@codejadee"]`. Explicit invocation (`$chayen-<skill>`) is
unchanged, because Codex does not prefix skills with the plugin name.

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
  $chayen-humanizer-en Tighten this README paragraph without changing any commands.
  ```

  The writing skills are described in [WRITING_AND_EDITING.md](WRITING_AND_EDITING.md).

## Optional: response style policy

Installing the plugin gives you the skills only (setup A in
[RESPONSE_STYLE.md](RESPONSE_STYLE.md)). If you also want everyday replies
worded naturally in Thai or English, add the opt-in policy yourself:
append the marked block to `~/.codex/AGENTS.md` (or `$CODEX_HOME/AGENTS.md`),
which is shared with your other instructions; a repository `AGENTS.md` needs the
repository owner's agreement.
If a non-empty `AGENTS.override.md` exists, Codex reads it instead. OpenAI
documents the same configuration layers for the IDE extension, which cannot
load the plugin itself.
It is not installed, enabled or removed by the plugin, and its loading has
not been tested on this host yet. Setup, the loading check, conflicts and
removal are in [RESPONSE_STYLE.md](RESPONSE_STYLE.md).

## Disable, enable, update, uninstall

| Action | How |
|---|---|
| Disable or enable | In `/plugins`, press **Space** on the plugin. Or add `enabled = false` under `[plugins."chayen@codejadee"]` in `config.toml` (in `CODEX_HOME`, normally `~/.codex/`). A one-off `-c` override did **not** disable the plugin in testing. |
| Update | Codex 0.160.1 has **no per-plugin update command**. `codex plugin marketplace upgrade codejadee` refreshes Git marketplaces. If the installed version does not change, run `codex plugin remove chayen@codejadee` and then `codex plugin add chayen@codejadee`. This update path is **not yet verified**. |
| Uninstall | `codex plugin remove chayen@codejadee`, then optionally `codex plugin marketplace remove codejadee`. An empty cache directory may remain. |

## Verification status (2026-10-15; reviewed 2026-10-17)

| Check | Codex CLI | Codex IDE extension |
|---|---|---|
| Marketplace file and manifest selected by the installed Codex code | Confirmed by inspecting 0.160.1 | Unsupported |
| Install, list, disable, uninstall | Passed for an earlier 6-skill build (0.160.1, 2026-10-14). **Not yet run for the 13-skill or the current 15-skill build.** | Unsupported |
| Writing skills, opt-in response style policy | Not tested | Skills unsupported; policy not tested |
| Routing and explicit `$chayen-security` | Passed for the earlier build (7/7 smoke prompts). Current build: **not tested.** | Unsupported |
| Install from the GitHub marketplace | Not tested | Unsupported |

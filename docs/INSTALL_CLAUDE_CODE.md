# Install in Claude Code

Chayen installs through Claude Code's native plugin manager. No installer
script is involved.

| Item | Value |
|---|---|
| Marketplace name | `codejadee` |
| Plugin | `codejadee-chayen-framework` |
| Install identifier | `codejadee-chayen-framework@codejadee` |
| Marketplace file | `.claude-plugin/marketplace.json` |
| Plugin manifest | `plugins/codejadee-chayen-framework/.claude-plugin/plugin.json` |
| Surfaces | Terminal CLI and the VS Code extension. They share the same settings files. |

> **Before you start**
>
> - The repository `CodeJaDee/codejadee-chayen-framework` is **private**
>   while Chayen is in pre-release. Adding it as a marketplace needs Git
>   access to the repository. Otherwise, use a local clone you are allowed to
>   use.
> - Review the source and pin a revision you trust; plugin skills are
>   instructions your agent will follow.

## Install (CLI)

```bash
# 1. Add the marketplace: from GitHub (needs repository access) ...
claude plugin marketplace add CodeJaDee/codejadee-chayen-framework
#    ... or from a local clone
claude plugin marketplace add /path/to/codejadee-chayen-framework

# 2. Install the plugin (user scope by default; --scope project|local also exist)
claude plugin install codejadee-chayen-framework@codejadee

# 3. Check it
claude plugin list                                   # codejadee-chayen-framework, enabled
claude plugin details codejadee-chayen-framework     # Skills (13), no hooks, MCP servers, agents or LSP servers
```

Inside a session, `/plugin` opens the same marketplace and plugin browser.

## Install (VS Code extension)

1. Open the Claude Code panel and type `/plugins`. Choose **Manage plugins**.
2. On **Marketplaces**, add `CodeJaDee/codejadee-chayen-framework` (needs
   repository access) or the path of a local clone.
3. On **Plugins**, find `codejadee-chayen-framework` and install it.

An install made in the CLI also appears in the extension, and the reverse.

## Use

- **Normal prompts.** Ask for what you need. Claude Code sees each skill's
  name and description, and loads a skill when your request matches it. See
  [AUTOMATIC_SKILL_DISCOVERY.md](AUTOMATIC_SKILL_DISCOVERY.md).
- **Explicit invocation.** Type `/` to list the skills, or name one directly:

  ```text
  /codejadee-chayen-framework:chayen-security Review this controller for injection risks.
  ```

## Disable, enable, update, uninstall

```bash
claude plugin disable codejadee-chayen-framework@codejadee   # skills stop loading; plugin stays installed
claude plugin enable  codejadee-chayen-framework@codejadee

claude plugin marketplace update codejadee                    # refresh the marketplace
claude plugin update codejadee-chayen-framework@codejadee     # then restart Claude Code

claude plugin uninstall codejadee-chayen-framework@codejadee
claude plugin marketplace remove codejadee                    # optional; also removes plugins from it
```

In VS Code, use **Manage plugins** for the same actions.

**About updates**

- Auto-update is **off by default** for third-party marketplaces, so
  update manually.
- Claude Code pins an install to the plugin's `version`. Releases change
  the version, but the current pre-release `0.1.0-dev` has not changed
  since earlier builds. `update` may therefore keep older content until a
  new version is published (tracked as R-54). If it does, uninstall and
  install again.

## Verification status (2026-10-15)

| Check | CLI | VS Code extension |
|---|---|---|
| `claude plugin validate --strict` on the plugin and the marketplace | Passed (2.1.270) | Passed with the extension's bundled binary (2.1.299) |
| Install, list, disable, enable, uninstall | Passed for an earlier 6-skill build (2026-10-14, local marketplace). **Not yet run for the current 13-skill build.** | Not tested |
| All 13 skills discovered, routing, explicit invocation | Passed when loaded with `--plugin-dir` (2.1.270; see [COMPATIBILITY_MATRIX.md](COMPATIBILITY_MATRIX.md)) | Not tested |
| Install from the GitHub marketplace | Not tested | Not tested |

Cloud sessions on claude.ai do not load locally installed plugins.

**Troubleshooting**

- *"Plugin not found"* means the marketplace has not been added, or its
  name is not `codejadee`. Run `claude plugin marketplace list`.
- *Skills never load.* Check that the plugin is enabled, and see
  [AUTOMATIC_SKILL_DISCOVERY.md](AUTOMATIC_SKILL_DISCOVERY.md#when-a-skill-does-not-load).

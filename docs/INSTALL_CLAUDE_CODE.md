# Install in Claude Code

Chayen installs through Claude Code's native plugin manager. No installer
script is involved.

| Item | Value |
|---|---|
| Marketplace name | `codejadee` |
| Plugin | `chayen` |
| Install identifier | `chayen@codejadee` |
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
claude plugin install chayen@codejadee

# 3. Check it
claude plugin list                                   # chayen, enabled
claude plugin details chayen     # Skills (15), no hooks, MCP servers, agents or LSP servers
```

Inside a session, `/plugin` opens the same marketplace and plugin browser.

## Install (VS Code extension)

1. Open the Claude Code panel and type `/plugins`. Choose **Manage plugins**.
2. On **Marketplaces**, add `CodeJaDee/codejadee-chayen-framework` (needs
   repository access) or the path of a local clone.
3. On **Plugins**, find `chayen` and install it.

An install made in the CLI also appears in the extension, and the reverse.

## Renamed from codejadee-chayen-framework

Until 2026-10-17 the plugin was named `codejadee-chayen-framework`. It is now
`chayen` (D-059), so installs made under the old name must be replaced. The
repository, the marketplace name `codejadee` and the plugin folder
(`plugins/codejadee-chayen-framework/`) are unchanged. These commands follow
the documented CLI syntax but have **not yet been run** for this rename.

```bash
claude plugin uninstall codejadee-chayen-framework@codejadee
claude plugin marketplace update codejadee
claude plugin install chayen@codejadee                # skills now appear as /chayen:<skill>
```

Restart Claude Code (or the VS Code window) afterwards. In VS Code you can do
the same from **Manage plugins**.

## Use

- **Normal prompts.** Ask for what you need. Claude Code sees each skill's
  name and description, and loads a skill when your request matches it. See
  [AUTOMATIC_SKILL_DISCOVERY.md](AUTOMATIC_SKILL_DISCOVERY.md).
- **Explicit invocation.** Type `/` to list the skills, or name one directly:

  ```text
  /chayen:chayen-security Review this controller for injection risks.
  /chayen:chayen-humanizer-th เกลาย่อหน้านี้ให้อ่านเป็นธรรมชาติ ห้ามเปลี่ยนตัวเลข
  /chayen:chayen-humanizer-en Audit this blog intro for stock phrasing. Don't rewrite it.
  ```

  The writing skills are described in [WRITING_AND_EDITING.md](WRITING_AND_EDITING.md).

## Optional: response style policy

Installing the plugin gives you the skills only (setup A in
[RESPONSE_STYLE.md](RESPONSE_STYLE.md)). If you also want everyday replies
worded naturally in Thai or English, add the opt-in policy yourself:
the dedicated file `~/.claude/rules/chayen-response-style.md` (user scope), or
`.claude/rules/` in a repository with the repository owner's agreement.
The VS Code extension reads the same files; VS Code Copilot Chat also reads
`~/.claude/rules/`, so do not add a second copy for it.
It is not installed, enabled or removed by the plugin, and its loading has
not been tested on this host yet. Setup, the loading check, conflicts and
removal are in [RESPONSE_STYLE.md](RESPONSE_STYLE.md).

## Disable, enable, update, uninstall

```bash
claude plugin disable chayen@codejadee   # skills stop loading; plugin stays installed
claude plugin enable  chayen@codejadee

claude plugin marketplace update codejadee                    # refresh the marketplace
claude plugin update chayen@codejadee     # then restart Claude Code

claude plugin uninstall chayen@codejadee
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

## Verification status (2026-10-15; reviewed 2026-10-17)

| Check | CLI | VS Code extension |
|---|---|---|
| `claude plugin validate --strict` on the plugin and the marketplace | Passed (2.1.270) | Passed with the extension's bundled binary (2.1.299) |
| Install, list, disable, enable, uninstall | Passed for an earlier 6-skill build (2026-10-14, local marketplace). **Not yet run for the 13-skill or the current 15-skill build.** | Not tested |
| All 13 engineering skills discovered, routing, explicit invocation | Passed for the 13-skill build when loaded with `--plugin-dir` (2.1.270, 2026-10-15; see [COMPATIBILITY_MATRIX.md](COMPATIBILITY_MATRIX.md)) | Not tested |
| The two writing skills, and the 15-skill build as a whole | Not tested | Not tested |
| Opt-in response style policy loaded from `~/.claude/rules/` | Not tested | Not tested |
| Install from the GitHub marketplace | Not tested | Not tested |

Cloud sessions on claude.ai do not load locally installed plugins.

**Troubleshooting**

- *"Plugin not found"* means the marketplace has not been added, or its
  name is not `codejadee`. Run `claude plugin marketplace list`.
- *Skills never load.* Check that the plugin is enabled, and see
  [AUTOMATIC_SKILL_DISCOVERY.md](AUTOMATIC_SKILL_DISCOVERY.md#when-a-skill-does-not-load).

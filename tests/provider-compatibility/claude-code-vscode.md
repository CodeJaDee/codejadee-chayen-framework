# Manual test: Claude Code VS Code extension

**Status as of 2026-10-14: NOT TESTED.** The extension UI cannot be driven
from the automation used in Step 06.

The extension reads the same settings files as the Claude Code CLI on the
same machine (https://code.claude.com/docs/en/plugins/install). An install
through either surface appears in the other.

## Prerequisites

- VS Code with the Claude Code extension, signed in.
- A local clone of this repository at `<repo>`.
- An application folder to open, for example any .NET or Angular project.
  Commit or stash its changes first, so modifications are visible.

## Steps and expected results

| # | Step | Expected |
|---|---|---|
| 1 | In the Claude Code panel, type `/plugins` and open **Manage plugins**. On **Marketplaces**, add `<repo>`. After a push, `CodeJaDee/codejadee-chayen-framework` can be added instead. | Marketplace `codejadee` is listed |
| 2 | On **Plugins**, find `codejadee-chayen-framework` and choose **Install for you**. | Installed, with no restart needed |
| 3 | Type `/`. | `codejadee-chayen-framework:chayen-backend` and the other `chayen-*` skills are listed (13 in total as of STEP 31) |
| 4 | New session: "Fix this ASP.NET Core API bug: GET /api/orders/{id} returns 500 when the order has no customer." | The session shows the `chayen-backend` skill loaded |
| 5 | New session: "Explain today's weather in Bangkok." | No Chayen skill loaded |
| 6 | New session: "Build a SwiftUI settings screen for my iOS app with a dark mode toggle." | No Chayen skill loaded. If one loads, record it. |
| 7 | Type `/codejadee-chayen-framework:chayen-security Review: var sql = "SELECT * FROM Users WHERE Name = '" + name + "'";` | The reply follows the security review format ("Security review — scope: …") |
| 8 | In **Manage plugins**, disable the plugin, then repeat step 4 in a new session. | No Chayen skill. The `/` menu has no Chayen entries. |
| 9 | Re-enable, then **Uninstall**. Run `git status` in the application folder. | `git status` shows no changes caused by the plugin |
| 10 | While installed, check the VS Code process list (Help → Open Process Explorer). | No process attributable to the plugin. The plugin has no MCP servers, hooks, or executables. |

Record the date, extension version, and model, with screenshots or
transcript excerpts, in `results/`.

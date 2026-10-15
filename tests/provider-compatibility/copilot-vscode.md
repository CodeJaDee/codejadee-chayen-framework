# Manual test: GitHub Copilot Chat in VS Code (agent plugins)

**Status as of 2026-10-14: NOT TESTED.** The VS Code UI cannot be driven
from the automation used in Step 06.

Reference: https://code.visualstudio.com/docs/copilot/customization/agent-plugins

Which marketplace file locations VS Code reads from a repository marketplace
is still UNVERIFIED (U-04). The Copilot CLI reads
`.github/plugin/marketplace.json` first, as observed in Step 04.

## Prerequisites

- VS Code with GitHub Copilot Chat, signed in. Agent plugins are enabled
  (`chat.plugins.enabled`).
- A local clone of this repository at `<repo>`.
- An application folder with a clean `git status`.
- **Optional, for a clean measurement:** temporarily disable overlapping
  personal skills in the **Configure Skills** menu, and re-enable them
  afterwards. Step 06 showed that personal skills in `~/.agents/skills` can
  win over plugin skills.

## Steps and expected results

| # | Step | Expected |
|---|---|---|
| 1 | Add the marketplace in settings: `"chat.plugins.marketplaces": ["file:///<repo>"]`. After a push, use `"CodeJaDee/codejadee-chayen-framework"` instead. | The marketplace appears in the Extensions view under `@agentPlugins` |
| 2 | Install `codejadee-chayen-framework` from the Extensions view (`@agentPlugins`). Alternatively, use **Chat: Install Plugin From Source** with the local path. | Listed in **Agent Plugins – Installed** |
| 3 | Open the **Configure Skills** menu. | All `chayen-*` skills (13 as of STEP 31; re-derive per README R-0) are listed under the plugin |
| 4 | In Agent mode: "Fix this ASP.NET Core API bug: GET /api/orders/{id} returns 500 when the order has no customer." | The `chayen-backend` skill is loaded (shown in the chat's references / used skills) |
| 5 | "Explain today's weather in Bangkok." | No Chayen skill |
| 6 | "Build a SwiftUI settings screen for my iOS app with a dark mode toggle." | Ideally no Chayen skill. **Known risk:** the Copilot CLI activated `chayen-frontend` here (Step 06). Record the result. |
| 7 | `/chayen-security Review: var sql = "SELECT * FROM Users WHERE Name = '" + name + "'";` | The security review format is used |
| 8 | Disable the plugin from the Installed view. Repeat step 4. | No Chayen skill. The skills are absent from Configure Skills. |
| 9 | Uninstall. Run `git status` in the application folder. | No changes caused by the plugin |
| 10 | Process Explorer. | No plugin process |

Record the VS Code version, Copilot Chat version, model, and results in
`results/`.

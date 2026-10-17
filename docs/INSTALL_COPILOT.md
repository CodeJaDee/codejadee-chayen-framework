# Install in GitHub Copilot

Chayen installs as a Copilot **agent plugin**. The CLI and VS Code are
separate surfaces, and each is described on its own below.

| Item | Value |
|---|---|
| Marketplace name | `codejadee` |
| Plugin | `codejadee-chayen-framework` |
| Install identifier | `codejadee-chayen-framework@codejadee` |
| Marketplace file | `.github/plugin/marketplace.json`. Copilot reads it before `.claude-plugin/marketplace.json`, which describes the same plugin. |
| Plugin manifest | `plugins/codejadee-chayen-framework/plugin.json` (Agent Plugins 1.0). This takes precedence over `.claude-plugin/plugin.json`. |
| Surfaces | Copilot CLI; VS Code with GitHub Copilot Chat |

> **Before you start**
>
> - The repository is **private** during pre-release. Adding it needs Git
>   access; otherwise use a local clone you are allowed to use.
> - Review the source and pin a revision you trust.

## Copilot CLI

Use Copilot CLI runtime **1.0.91 or later**: `plugin enable` and
`plugin disable` are missing in 1.0.68.

```bash
copilot plugin marketplace add CodeJaDee/codejadee-chayen-framework    # or a local clone path
copilot plugin install codejadee-chayen-framework@codejadee              # "Installed 15 skills" expected
copilot plugin list
copilot skill list                                                      # the chayen-* skills
```

**Explicit invocation:**

```text
/chayen-security Review this controller for injection risks.
/chayen-humanizer-th ปรับข้อความใน locales/th.json ให้สั้นลง ห้ามแตะ key และ placeholder
```

The writing skills are described in [WRITING_AND_EDITING.md](WRITING_AND_EDITING.md).

**Disable, update, uninstall:**

```bash
copilot plugin disable codejadee-chayen-framework@codejadee
copilot plugin enable  codejadee-chayen-framework@codejadee
copilot plugin update  codejadee-chayen-framework            # or: copilot plugin update --all
copilot plugin uninstall codejadee-chayen-framework
copilot plugin marketplace remove codejadee
```

In testing, uninstalling a plugin from a *local-folder* marketplace only
disabled it. Run `copilot plugin list` afterwards to confirm.

**Name collisions.** If a personal or project skill has the same name as a
Chayen skill (for example `chayen-backend`), Copilot uses yours and silently
drops the plugin's. Chayen's `chayen-` prefix avoids this unless you reuse
that name.

## VS Code (GitHub Copilot Chat)

Agent plugins are controlled by the setting `chat.plugins.enabled`. It
defaults to `true` in VS Code 1.141.1, but an organisation policy
(`ChatPluginsEnabled`) can turn it off.

1. **Add the marketplace** in your settings:

   ```json
   "chat.plugins.marketplaces": ["CodeJaDee/codejadee-chayen-framework"]
   ```

   For a local clone, use a `file:///` URL. VS Code reads
   `.github/plugin/marketplace.json` from the repository.
2. **Install** `codejadee-chayen-framework`, either from the Extensions view
   (search `@agentPlugins`) or with **Chat: Install Plugin From Source**.
3. **Check** that the `chayen-*` skills appear in the **Configure Skills**
   menu.
4. **Manage the plugin:**
   - **Disable, enable or uninstall** from the **Agent Plugins – Installed**
     view (right-click).
   - **Update** with **Extensions: Check for Extension Updates**, or wait
     for the automatic 24-hour check when `extensions.autoUpdate` is on.
   - In chat, `/plugin enable|disable|update|uninstall
     codejadee-chayen-framework` also works.
   - A plugin installed directly from Git can only be uninstalled, not
     disabled.

Whether VS Code invokes *plugin-bundled* skills automatically is not stated
by Microsoft and has not been tested here. Explicit invocation from the chat
`/` menu is expected but **not verified**.

## Optional: response style policy

Installing the plugin gives you the skills only (setup A in
[RESPONSE_STYLE.md](RESPONSE_STYLE.md)). If you also want everyday replies
worded naturally in Thai or English, add the opt-in policy yourself:
Copilot CLI: append the marked block to `~/.copilot/copilot-instructions.md`
(or `$COPILOT_HOME/…`). VS Code Copilot Chat: copy the `.instructions.md`
template to `~/.copilot/instructions/`. Repository files
(`.github/copilot-instructions.md`) need the repository owner's agreement.
VS Code Copilot Chat also reads `~/.claude/rules/` and `~/.claude/CLAUDE.md`;
if you already added the Claude Code rule, do not add a second copy. Copilot
inline suggestions ignore custom instructions.
It is not installed, enabled or removed by the plugin, and its loading has
not been tested on this host yet. Setup, the loading check, conflicts and
removal are in [RESPONSE_STYLE.md](RESPONSE_STYLE.md).

## Verification status (2026-10-15; reviewed 2026-10-17)

| Check | Copilot CLI | VS Code + Copilot Chat |
|---|---|---|
| Marketplace file and manifest selected by the installed code | Confirmed by inspecting runtime 1.0.97 | Confirmed by inspecting VS Code 1.141.1 |
| Install, list, disable, enable, update, uninstall | Passed for an earlier 6-skill build (1.0.91–1.0.97, 2026-10-14). **Not yet run for the 13-skill or the current 15-skill build.** | Not tested |
| Writing skills, opt-in response style policy | Not tested | Not tested |
| Routing and explicit `/chayen-security` | Earlier build: 5/7 smoke prompts. It over-activated on Unity and SwiftUI prompts, without wrong guidance in the answers. Current build: **not tested.** | Not tested |
| Install from the GitHub marketplace | Not tested | Not tested |

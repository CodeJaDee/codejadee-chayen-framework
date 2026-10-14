# Provider compatibility tests (developer-only)

These tests check that the plugin behaves natively on each provider surface.

- They are not shipped with the plugin.
- They are never needed by plugin users.

| File | Purpose |
|---|---|
| `run-lifecycle.sh` | **Automated, no model cost.** Native lifecycle per CLI in isolated config homes: marketplace add, install, list, discover skills, disable, enable, uninstall, marketplace remove. Also checks that a git fixture application is unchanged. |
| `claude-code-vscode.md` | Manual procedure: Claude Code VS Code extension |
| `copilot-vscode.md` | Manual procedure: GitHub Copilot Chat in VS Code (agent plugins) |
| `codex-vscode.md` | Codex IDE extension. Plugins are unsupported by the provider. Records what to re-check. |
| `results/2026-10-14-step06.md` | Recorded results of Step 06, for all ten test areas on six surfaces |

Routing behaviour (which skill a prompt activates) is in `tests/routing/`.

## Running the automated lifecycle check

```bash
bash tests/provider-compatibility/run-lifecycle.sh /tmp/chayen-lifecycle   # any empty scratch path
```

- **Isolation.** It uses `CLAUDE_CONFIG_DIR`, `CODEX_HOME`, and
  `COPILOT_HOME`, so the user's real configuration is not modified.
- **Local marketplace.** It installs from a **local copy** of the
  repository. It does not test a remote GitHub marketplace, which needs the
  repository to be pushed.
- **Copilot runtime version.** Copilot runs the newest runtime in its
  package cache unless `COPILOT_AUTO_UPDATE=false`. With that setting, the
  bundled runtime is used instead (1.0.68 on the test machine, where plugin
  `enable`/`disable` were missing).

## Result vocabulary

| Label | Meaning |
|---|---|
| AUTOMATED VERIFIED | Executed by a script or CLI, with the command and observed output recorded |
| MANUALLY VERIFIED | Executed or inspected by a person, or by the agent reading a transcript (stated as such) |
| NOT TESTED | Not executed. A procedure is provided. |
| UNSUPPORTED | The provider documents that the capability does not exist on that surface |

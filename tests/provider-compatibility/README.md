# Provider compatibility tests (developer-only)

These tests check that the plugin behaves natively on each provider surface.

- They are not shipped with the plugin.
- They are never needed by plugin users.

| File | Purpose |
|---|---|
| `run-lifecycle.sh` | **Optional, no model calls.** Native CLI lifecycle with config-home overrides: marketplace add, install, discover, disable/enable, uninstall/remove; may cause provider traffic or cache changes. Checks a disposable fixture for changes. |
| `claude-code-vscode.md` | Manual procedure: Claude Code VS Code extension |
| `copilot-vscode.md` | Manual procedure: GitHub Copilot Chat in VS Code (agent plugins) |
| `codex-vscode.md` | Codex IDE extension. Plugins are unsupported by the provider. Records what to re-check. |
| `results/2026-10-14-step06.md` | Recorded results of Step 06, for all ten test areas on six surfaces |

Routing behaviour (which skill a prompt activates) is in `tests/routing/`.

## Running the automated lifecycle check

```bash
CHAYEN_ALLOW_PROVIDER_LIFECYCLE=1 bash tests/provider-compatibility/run-lifecycle.sh /tmp/chayen-lifecycle-fresh
```

- **Review/authorization first.** Inspect the script, native binaries and
  copied package. The opt-in flag records caller intent, not approval evidence.
  Use a fresh directory outside the repository with an existing scratch parent;
  existing directories and linked package sources are refused. It no longer
  deletes a supplied work directory. STEP 30 performed syntax checking only.
- **Isolation request.** It supplies `CLAUDE_CONFIG_DIR`, `CODEX_HOME`, and
  `COPILOT_HOME`. These overrides are not an OS sandbox or proof that a provider
  leaves other caches, account stores or settings unchanged. Use a disposable
  environment with minimal permissions; do not supply or copy personal secrets.
- **Traffic.** Native CLIs may contact provider services or update caches. This
  is not an offline gate. No credential is required to use the static plugin;
  mark tests NOT_RUN if approved test access is unavailable.
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

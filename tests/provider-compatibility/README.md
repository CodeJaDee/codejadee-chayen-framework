# Provider compatibility tests (developer-only)

These tests check that the plugin behaves natively on each provider surface.

- They are not shipped with the plugin.
- They are never needed by plugin users.

The current compatibility verdict is in
[docs/chayen/FINAL_PROVIDER_COMPATIBILITY.md](../../docs/chayen/FINAL_PROVIDER_COMPATIBILITY.md)
(STEP 31). This file is the **runbook** that produces the evidence the
release gate needs.

| File | Purpose |
|---|---|
| `check-identity.mjs` | **Offline, read-only.** Plugin identity, manifest and marketplace precedence, and skill discovery across all three marketplaces and both manifests (IC-01..IC-13). Exit 1 on any FAIL. |
| `run-lifecycle.sh` | **Optional, no model calls.** Native CLI lifecycle with config-home overrides: marketplace add, install, discover, disable/enable, uninstall/remove. May cause provider traffic or cache changes. Checks a disposable fixture for changes. |
| `claude-code-vscode.md` | Manual procedure: Claude Code VS Code extension |
| `copilot-vscode.md` | Manual procedure: GitHub Copilot Chat in VS Code (agent plugins) |
| `codex-vscode.md` | Codex IDE extension. Plugins are unsupported by the provider. Records what to re-check. |
| `results/2026-10-14-step06.md` | Recorded results of Step 06 (6-skill package), for all ten test areas on six surfaces |

Routing behaviour (which skill a prompt activates) is in `tests/routing/`.

## Running the automated lifecycle check

```bash
CHAYEN_ALLOW_PROVIDER_LIFECYCLE=1 bash tests/provider-compatibility/run-lifecycle.sh /tmp/chayen-lifecycle-fresh
```

- **Review/authorization first.** Inspect the script, the native binaries, and
  the copied package. The opt-in flag records caller intent, not approval
  evidence.
  - Use a fresh directory outside the repository, with an existing scratch
    parent.
  - Existing directories and linked package sources are refused.
  - It no longer deletes a supplied work directory.
  - STEP 30 performed syntax checking only.
  - In STEP 31 the agent session's permission classifier denied setting the
    opt-in, so the script was not run.
- **Isolation request.** It supplies `CLAUDE_CONFIG_DIR`, `CODEX_HOME`, and
  `COPILOT_HOME`.
  - These overrides are not an OS sandbox.
  - They are not proof that a provider leaves other caches, account stores,
    or settings unchanged.
  - Use a disposable environment with minimal permissions. Do not supply or
    copy personal secrets.
- **Traffic.** Native CLIs may contact provider services or update caches,
  so this is not an offline gate.
  - No credential is required to use the static plugin.
  - Mark tests NOT_RUN if approved test access is unavailable.
- **Local marketplace.** It installs from a **local copy** of the repository.
  It does not test a remote GitHub marketplace, which needs the repository to
  be pushed.
- **Copilot runtime version.** Copilot runs the newest runtime in its package
  cache unless `COPILOT_AUTO_UPDATE=false`. With that setting, the bundled
  runtime is used instead (1.0.68 on the test machine, where plugin
  `enable`/`disable` were missing).

## Result vocabulary

| Label | Meaning |
|---|---|
| AUTOMATED VERIFIED | Executed by a script or CLI, with the command and observed output recorded |
| MANUALLY VERIFIED | Executed or inspected by a person, or by the agent reading a transcript (stated as such) |
| STATIC PASS | Verified offline against repository files and the provider's installed code. Not a runtime claim. |
| NOT TESTED | Not executed. A procedure is provided. |
| UNSUPPORTED | The provider documents that the capability does not exist on that surface |

---

## STEP 31 full validation runbook

Run this under an **authorized** process: a person, or an agent session
whose permissions allow provider calls. Every model prompt is a billed call
that sends text to the provider.

### R-0. Preconditions and recording

1. Use a disposable machine or account profile. Do not copy personal
   credentials into isolated homes. Sign in interactively inside each
   isolated home with a test identity.
2. Record the following for every run:
   - date
   - OS
   - `claude --version`, `codex --version`, `copilot --version`
   - `code --version`
   - `code --list-extensions --show-versions` (rows `anthropic.claude-code`
     and `openai.chatgpt`)
   - the built-in Copilot version (`<VS Code>/resources/app/extensions/copilot/package.json`)
   - the model in use
3. Expected skill count: `13`. Re-derive it, and do not trust this number
   if skills change:

   ```bash
   find plugins/codejadee-chayen-framework/skills -mindepth 2 -maxdepth 2 -name SKILL.md | wc -l
   ```

4. Fingerprint the real configs before and after (they must be unchanged):

   ```bash
   sha256sum ~/.claude/settings.json ~/.claude/plugins/known_marketplaces.json \
     ~/.claude/plugins/installed_plugins.json ~/.codex/config.toml ~/.copilot/config.json
   ```

5. Save results as `results/<date>-step31-<surface>.md`. Raw transcripts
   stay in scratch, because they contain local paths and may contain
   sensitive data.

### R-1. Offline gates (no provider traffic)

```bash
node tools/validate/validate-all.mjs                       # all gate groups PASS
node tests/provider-compatibility/check-identity.mjs       # 15/15 PASS, totals 13 skills / 221 references
claude plugin validate --strict plugins/codejadee-chayen-framework
claude plugin validate --strict .
```

### R-2. Shared probes

Use the same fixture for every provider:

- an empty git repository outside this repo, with one file
  `src/OrdersController.cs`;
- run each probe in a **new session**.

| Probe | Prompt | Pass criterion |
|---|---|---|
| P-AUTO | `Fix this ASP.NET Core API bug: GET /api/orders/{id} returns 500 when the order has no customer.` | `chayen-backend` loaded without being named |
| P-EXPL | Provider form of `chayen-security` (see each section) + `Review: var sql = "SELECT * FROM Users WHERE Name = '" + name + "'";` | Skill loaded; reply uses the "Security review — scope:" format |
| P-NONE | `Explain today's weather in Bangkok.` | **No** `chayen-*` skill loaded; normal provider answer |
| P-NONE-2 | `Build a SwiftUI settings screen for my iOS app with a dark mode toggle.` | Ideally no `chayen-*` skill. If one loads, record it (known Copilot risk). |
| P-REF | Provider form of `chayen-data` + `We use SQL Server through Microsoft.Data.SqlClient. Two order-update transactions deadlock; how should I diagnose it?` | Skill loaded **and** at least one file under `skills/chayen-data/references/` (expected `sql-server.md` and/or `sqlserver-concurrency.md`) is read in the transcript |

### R-3. Claude Code CLI

```bash
export CLAUDE_CONFIG_DIR=<scratch>/home-claude      # then run `claude` once and /login with a test identity
claude plugin marketplace add <scratch>/mp            # a copy of .claude-plugin, .agents, .github, plugins
claude plugin install chayen@codejadee
claude plugin list                                     # 0.1.0-dev, enabled, exactly one entry
claude plugin details chayen       # Skills (13), Agents/Hooks/MCP/LSP (0)
cd <fixture>
claude -p "<P-AUTO>" --output-format stream-json --verbose --no-session-persistence --max-turns 8
claude -p "/chayen:chayen-security <P-EXPL text>" --output-format stream-json --verbose --no-session-persistence
claude -p "<P-NONE>" --output-format stream-json --verbose --no-session-persistence
claude -p "/chayen:chayen-data <P-REF text>" --output-format stream-json --verbose --no-session-persistence --max-turns 8
```

- **Evidence.**
  - A `tool_use` named `Skill` with `chayen:<skill>`.
  - For P-REF, a `Read` `tool_use` whose path ends in
    `chayen-data/references/<file>.md`.
- **C-10 lifecycle.**

  ```bash
  claude plugin disable chayen@codejadee   # list shows disabled; re-run P-AUTO: no chayen skill
  claude plugin enable  chayen@codejadee
  # Update: bump "version" to e.g. 0.1.1-step31 in BOTH manifests of the <scratch>/mp copy (and .github entry)
  claude plugin marketplace update codejadee
  claude plugin update chayen@codejadee    # list shows 0.1.1-step31 after restart
  claude plugin uninstall chayen@codejadee # not listed; /-menu has no chayen entries
  claude plugin marketplace remove codejadee
  ```

  Also run update **without** a version bump, and record whether content
  changes propagate (R-54).

### R-4. Claude Code VS Code extension

Follow [claude-code-vscode.md](claude-code-vscode.md). Expect **13** skills
in step 3, and add P-NONE-2 and P-REF.

- The extension shares settings with the CLI.
- Still run **every** step in the extension UI.
- Do not mark a VS Code cell from a CLI result.
- Record the extension version, for example 2.1.299.

### R-5. Codex CLI

```bash
export CODEX_HOME=<scratch>/home-codex               # then `codex login` with a test identity (never copy auth.json)
codex plugin marketplace add <scratch>/mp
codex plugin list --marketplace codejadee             # listed from .agents/plugins/marketplace.json
codex plugin add chayen@codejadee
codex plugin list --marketplace codejadee             # "installed, enabled", exactly one entry
find "$CODEX_HOME/plugins/cache" -name SKILL.md | grep -c chayen-   # 13
cd <fixture>
codex exec --json --skip-git-repo-check --ephemeral -s read-only "<P-AUTO>"
codex exec --json --skip-git-repo-check --ephemeral -s read-only "\$chayen-security <P-EXPL text>"
codex exec --json --skip-git-repo-check --ephemeral -s read-only "<P-NONE>"
codex exec --json --skip-git-repo-check --ephemeral -s read-only "\$chayen-data <P-REF text>"
```

- **Evidence.** Event text naming `skills/chayen-<x>/SKILL.md`. For P-REF, a
  read of `chayen-data/references/*.md`.
- The interactive `/plugins` browser should also show the plugin. Space
  toggles it.
- **C-10 lifecycle.**
  - **Disable.** Add `[plugins."chayen@codejadee"]` with
    `enabled = false` to `$CODEX_HOME/config.toml`, then re-run P-AUTO. A
    `-c` override did **not** disable the plugin in Step 06.
  - **Update.** 0.160.1 has no per-plugin `update`, and
    `codex plugin marketplace upgrade` refreshes **Git** marketplace
    snapshots only.
    - Local marketplace: bump the version in the `mp` copy, then record
      whether `codex plugin list --marketplace codejadee` and the cache
      show the new version. If they do not, run `codex plugin remove`
      followed by `codex plugin add`, and record the observed behaviour.
    - Remote marketplace (R-9): `codex plugin marketplace upgrade codejadee`,
      then the same check.
  - **Uninstall.** Run `codex plugin remove chayen@codejadee`
    and `codex plugin marketplace remove codejadee`. Note any empty cache
    directory that is left behind.

### R-6. Codex IDE extension

UNSUPPORTED (S13, re-read 2026-10-15). Use [codex-vscode.md](codex-vscode.md)
on each release. One check is optional and recorded only as an observation:
after R-5 installs into a `CODEX_HOME` that the extension also uses, see
whether `chayen-*` skills appear in an extension session. Do not report
that as plugin support.

### R-7. Copilot CLI

```bash
export COPILOT_HOME=<scratch>/home-copilot          # auth comes from the OS credential store; use a test account
copilot --version                                    # runtime must be >= 1.0.91 for enable/disable
copilot plugin marketplace add <scratch>/mp          # reads .github/plugin/marketplace.json first
copilot plugin install chayen@codejadee   # "Installed 13 skills"
copilot plugin list                                  # exactly one entry, 0.1.0-dev
copilot skill list                                   # 13 chayen-* rows
cd <fixture>
copilot -p "<P-AUTO>" --output-format json
copilot -p "/chayen-security <P-EXPL text>" --output-format json
copilot -p "<P-NONE>" --output-format json
copilot -p "/chayen-data <P-REF text>" --output-format json
```

- **Evidence.**
  - `tool.execution_start` with `toolName: "skill"` and `arguments.skill`.
  - For P-REF, a file-view tool event on `chayen-data/references/*.md`.
- **C-10 lifecycle.**

  ```bash
  copilot plugin disable chayen@codejadee   # skill list shows 0 chayen-*; P-AUTO loads none
  copilot plugin enable chayen@codejadee
  # bump version in the mp copy, then:
  copilot plugin update chayen              # list shows the new version
  copilot plugin uninstall chayen           # record whether it removes or only disables (Step 06: disabled only)
  copilot plugin marketplace remove codejadee
  ```

### R-8. VS Code + GitHub Copilot Chat

Follow [copilot-vscode.md](copilot-vscode.md). Expect **13** skills in
Configure Skills, and add P-NONE-2 and P-REF.

Facts confirmed from the VS Code 1.141.1 code:

- `chat.plugins.enabled` defaults to `true`. The org policy
  `ChatPluginsEnabled` can force it off. Record it if it is managed.
- The repository marketplace resolves to `.github/plugin/marketplace.json`.
- The root `plugin.json` is read with Agent Plugins semantics.

Also try the chat commands `/plugin disable|enable|update|uninstall
chayen`, as documented in S18. A plugin installed
directly from Git can only be uninstalled.

### R-9. Remote marketplace (after an approved push only)

Repeat R-3, R-5, and R-7 with `CodeJaDee/codejadee-chayen-framework` in
place of `<scratch>/mp`. In VS Code, use
`"chat.plugins.marketplaces": ["CodeJaDee/codejadee-chayen-framework"]`.

### R-10. Closing the release gate

Update the §5 cells in FINAL_PROVIDER_COMPATIBILITY.md from the recorded
results only:

- AUTOMATED VERIFIED for CLI commands with captured output;
- MANUALLY VERIFIED for VS Code steps a person executed.

Any failure goes to `docs/chayen/ISSUES.md`. The gate stays OPEN until
items 3–10 are recorded for every in-scope surface on the version that
will be distributed.

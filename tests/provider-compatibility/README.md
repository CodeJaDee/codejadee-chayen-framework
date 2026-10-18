# Provider lifecycle runbook (developer-only)

Current Entry Skills: **15**. Plugin identity: `chayen@codejadee`.
One canonical static Markdown/JSON package serves Claude Code CLI, Codex CLI
and Copilot CLI. These tools are outside the shipped package.

Phase 2 validates tooling offline. **No native lifecycle is authorized by
this runbook.** Native evidence and automatic routing of the changed build
remain NOT_RUN until the separately authorized Phase 5 evaluation.
The >=85% automatic routing threshold applies independently to each CLI.

| File | Purpose |
|---|---|
| `check-identity.mjs` | Offline manifest/marketplace parity and canonical Skill discovery |
| `run-lifecycle.sh` | Existing shell entry point for guarded native lifecycle |
| `lifecycle.mjs` | Isolated child environments, command discovery, update and uninstall assertions |
| `lifecycle.test.mjs` | Offline synthetic native-command responses; no provider executable runs |
| `results/2026-10-14-step06.md` | Historical six-Skill evidence under the old identity; invalid for this build |

## Before any native execution

1. Obtain explicit authorization for native provider execution. Inspect the
   scripts, binaries and package first. Opt-in flags record intent and do
   not grant authorization. No model call is made by this runner.
2. Use a disposable machine, container, VM or OS test account with no access
   to personal configuration or credentials. Config-home overrides alone
   are not an OS sandbox and cannot confine a malicious native executable.
3. Choose a fresh scratch directory outside this repository and every real
   provider profile, with an existing parent. Existing targets and linked
   installation sources are refused. The runner never deletes the target.
4. Use reviewed native executables on PATH. On Windows, use executables
   rather than `.cmd` wrappers: the runner does not enable shell execution.
5. Derive the count from the candidate, and record the source revision,
   package fingerprint, provider version, OS, identity and result for each
   operation. Currently the invariant is 15 Skills:

   ```bash
   find plugins/codejadee-chayen-framework/skills -mindepth 2 -maxdepth 2 -name SKILL.md | wc -l
   ```

6. Copilot CLI must meet the release minimum (>=1.0.91). Record the actual
   version with automatic updates disabled. If an installed binary lacks
   a required command, it cannot earn a lifecycle PASS from this script.

## Offline checks (safe for Phase 2)

```bash
node tools/validate/validate-all.mjs
node tests/provider-compatibility/check-identity.mjs
node --test tests/provider-compatibility/lifecycle.test.mjs
node tools/validate/check-hardening.mjs
```

Identity check totals and reference counts come from its JSON output; do
not copy historical totals. Offline PASS establishes tooling behavior only.

## Native lifecycle (later, separately authorized)

Only inside the disposable environment, after review and authorization:

```bash
CHAYEN_ALLOW_PROVIDER_LIFECYCLE=1 CHAYEN_DISPOSABLE_ENVIRONMENT=1 \
  bash tests/provider-compatibility/run-lifecycle.sh /tmp/chayen-lifecycle-fresh
```

The Node implementation also accepts the same fresh directory when Bash
is unavailable. Both guards are required before any native executable runs.
It creates separate marketplace copies, application fixtures and empty
provider profiles. Each child gets isolated HOME, USERPROFILE, XDG, AppData,
temporary directories and provider-specific configuration homes. Inherited
provider paths, auth tokens and shell startup variables are not forwarded.
It sets `COPILOT_AUTO_UPDATE=false`, `DISABLE_AUTOUPDATER=1` and disables
Claude's nonessential traffic. Never copy real auth files into scratch.
If authentication is required, stop and use separately approved test access.

The runner hashes real configuration files before and after, including
configured non-default homes, and records only hashes/results. The fixture
must remain byte-identical with no added files. Any drift is FAIL. The
scratch tree and `results.json` are retained for review; review outputs for
local paths before sharing them.

## Required operations and evidence

| Operation | Required observation |
|---|---|
| Register marketplace | Native add command exits zero |
| Install | Native command exits zero AND list confirms installed; success text cannot mask a nonzero exit |
| Discover | Actual isolated cached manifest identifies `chayen`, version matches, all 15 Skills exist, and backend content hash matches the reviewed source |
| Disable | Native list confirms this plugin is installed and disabled |
| Enable | Native list confirms this plugin is installed and enabled |
| Update | In the scratch marketplace only, change all four version fields and backend content; refresh marketplace and update; verify the changed version and content hash in the isolated cache |
| Uninstall | Native command exits zero AND native list proves absence; disabled or ambiguous state fails |
| Remove marketplace | Native remove exits zero AND marketplace list has no `codejadee` entry |

Every native command is checked against that installed binary's `--help`.
Claude and Copilot use install/uninstall where available; Codex uses
add/remove where available. The runner does **not** assume that Codex has
CLI disable, enable or update commands. A missing command yields NOT_RUN;
complete that operation in the reviewed native plugin UI on the same
disposable profile and save explicit before/after evidence. Do not edit
personal configuration to simulate a native lifecycle operation.

The update test uses a version bump and a content marker. A changed version
alone, success message alone, or changed source file alone is insufficient.
Old cached versions may remain; the new installed content must be present.
Same-version cache refresh is a separate diagnostic and is not proven by
this test. Likewise, local marketplace success does not prove remote public
installation. A Copilot uninstall that only disables is FAIL.

Exit 0 means every required operation passed; exit 1 means a failure; exit
2 means missing prerequisites, unavailable commands or NOT_RUN operations.
Missing CLIs never count as PASS. Review all operation rows, not just exit.

## Evaluation and deferred surfaces

Automatic routing, explicit invocation and no-match measurement use
[the evaluation fixtures](../evaluation/README.md) in Phase 5. Changing Skill
descriptions invalidates historical routing evidence. Synthetic scorer and
lifecycle tests are not provider measurements.

The [Claude VS Code procedure](claude-code-vscode.md),
[Copilot VS Code procedure](copilot-vscode.md) and
[Codex IDE limitation](codex-vscode.md) are historical/deferred references.
VS Code runtime testing and persistent Response Style Policy runtime tests
are outside this phase and the scoped release contract.

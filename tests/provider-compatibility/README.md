# Native CLI lifecycle qualification (developer-only)

Current Entry Skills: **16**. Plugin identity: `chayen@codejadee`.
The canonical package contains static Markdown/JSON only. These scripts are
developer tooling outside that package. Phase 4 tests lifecycle; automatic
routing >=85% per CLI belongs to Phase 5 and has not been run here.

## Authorization and isolation

Review the installed native binaries and scripts first. Native execution needs
an explicit task authorization. The Phase 4 request authorizes disposable
provider profiles and temporary configuration homes; it does not authorize
personal profile changes, production credentials, prompts or billable evaluations.
Opt-in flags attest to that authorization; they do not create it.

Prefer a disposable VM/container/account for full OS isolation. Config-home
overrides isolate these trusted CLI tests but are **not an OS sandbox**.
Never claim the developer's whole machine is disposable. No real auth file
or inherited provider token is copied. Missing authentication means BLOCKED.

Choose a fresh scratch directory outside the repository and actual provider
profiles. Existing targets and links are rejected. The runner retains scratch
evidence for inspection and never deletes personal configuration.

`isolatedEnvironment` creates child-only HOME, USERPROFILE, AppData, XDG,
CLAUDE_CONFIG_DIR, CODEX_HOME, COPILOT_HOME and temporary directories. It
strips inherited credentials and shell startup variables, sets
`COPILOT_AUTO_UPDATE=false` and `DISABLE_AUTOUPDATER=1`, and suppresses Claude
nonessential traffic. The parent environment is unchanged.

## Commands

Offline (ordinary CI, no provider binaries):

```bash
node tools/validate/validate-all.mjs --fail-fast
node tests/provider-compatibility/check-identity.mjs
node --test tests/provider-compatibility/lifecycle.test.mjs tests/provider-compatibility/qualify-rc.test.mjs
```

After authorization, inside the isolated test environment:

```bash
CHAYEN_ALLOW_PROVIDER_LIFECYCLE=1 CHAYEN_DISPOSABLE_ENVIRONMENT=1 \
  node tests/provider-compatibility/qualify-rc.mjs /tmp/chayen-rc-fresh \
  --claude-exe /absolute/path/to/claude --codex-exe /absolute/path/to/codex
```

On Windows, pass full `.exe` paths (including the native executable behind
an npm PowerShell shim); `.cmd`, `.bat` and `.ps1` execution is refused.
Do not change global PATH or global config to make a test pass. Optional
`--copilot-exe` identifies an already installed native binary. Minimum Copilot
version is >=1.0.91. No automatic CLI installation or upgrade occurs.

`run-lifecycle.sh` and `lifecycle.mjs` remain the guarded Phase 2 regression
baseline. The richer Phase 4 entry point is `qualify-rc.mjs`; it reuses the
existing isolation, authorization and scratch-update helpers. `codex-skills.mjs`
uses the CLI's local stdio app-server `initialize` and `skills/list` only.
It creates no thread, model turn, remote daemon or VS Code session.

## Required evidence and provider differences

The runner saves `candidate.json`, `results.json` and per-provider
`transcript.json` in scratch. Source Git SHA, full package file hashes, Skill
metadata fingerprint, versions, command exit codes and per-step outcomes are
recorded. A dirty candidate is a **working-tree snapshot**, not a frozen commit.
Commit/tag/push/publication each still needs separate explicit authorization.

| Operation | Qualification rule |
|---|---|
| Register/install/list | Native commands succeed and subsequent native list confirms identity, version and enabled installation |
| Discover | Native inventory contains all 16 Skills; full installed package fingerprint matches candidate |
| Disable/enable | Native list confirms persisted state; fresh native inventory checks activation where supported |
| Update | Scratch-only RC version advances and backend content changes; active version and full installed tree must match; exit zero alone is insufficient |
| Uninstall/absent | Fresh list contains no installation; disabled is still installed |
| Reinstall/restart | Reinstall and a newly launched native process see the expected version, full package and Skill inventory |
| Migration | Install a former-identifier fixture, remove it and prove absence, restore exact RC bytes, install current identity and verify full content/inventory |
| Cleanup | Uninstall and unregister, verify marketplace absence; real configuration and project fixture hashes unchanged |

Claude 2.1.302 provides install/uninstall, disable/enable, update and details.
`plugin details` also enumerates disabled packages, so it **cannot establish
disabled loading behavior**. That assertion stays BLOCKED until an authorized
disposable session can prove Skills are unavailable. Enabled inventory is
not an automatic-routing measurement.

Codex 0.163.0 has add/remove/list and marketplace add/list/upgrade/remove.
Dedicated disable/enable/update subcommands are **UNSUPPORTED**. Tested native
alternatives: edit only disposable CODEX_HOME/config.toml
`[plugins."chayen@codejadee"] enabled = false/true`, then observe list and a
new app-server's skills/list (0/15 enabled Skills). Replace via remove/add for
changed version/content. This is a reinstall alternative, not an in-place
update. Marketplace upgrade refreshes Git snapshots, not this local source.

Copilot is **BLOCKED** on this machine: no native executable was found.
Do not infer its commands from Claude or claim a missing-binary result is
UNSUPPORTED. The exact pending procedure is in the
[Phase 4 report](../../docs/production/NATIVE_LIFECYCLE_REPORT.md).
The Copilot inventory adapter deliberately fails closed pending binary review.

Real settings, auth and plugin registries are hashed before/after, including
custom homes and root-level `.claude.json`. Only `models_cache.json`, a volatile
Codex model catalogue refreshed by the active parent process, is excluded from
the Phase 4 configuration comparison. Every configuration drift remains FAIL;
the offline controls prove that cache exclusion cannot mask config.toml changes.
No configuration contents are written to evidence. Scratch paths in retained
repository evidence are replaced with placeholders; raw logs remain in temp.

Exit 0 means covered checks passed, 1 means FAIL, 2 means BLOCKED prerequisites.
Always review UNSUPPORTED rows and their separately tested alternatives.
Do not confuse successful cleanup with successful lifecycle qualification.

## Evidence scope

Current results: [2026-10-23 Step 19 report](../../docs/chayen/evolution/PROVIDER_SECURITY_REPORT.md)
for the `1.1.2` working-tree snapshot, with the path-free summary in
`results/2026-10-23-step19/`. Previous: the
[2026-10-18 RC report](../../docs/production/NATIVE_LIFECYCLE_REPORT.md).

Step 19 added the Codex row `inventory-isolation`. It fails when the native
inventory lists Skills from outside the isolated profile. Codex 0.163.0 on
Windows reads the real user's `~/.agents/skills` despite the HOME,
USERPROFILE and `CODEX_HOME` overrides. Counts by scope are recorded; names
never are. Do not score Codex routing or security runs where this row fails.
Migration replays the former identifier using the current 15-Skill body; it
does not reproduce the historical package. Restart means a new native process
and inventory reload, not conversation resumption. Local marketplace evidence
does not prove remote public installation. Historical six-/thirteen-Skill
reports remain historical. No VS Code or Response Style Policy host tests run.
Security/Support is LATER and does not block this lifecycle implementation.

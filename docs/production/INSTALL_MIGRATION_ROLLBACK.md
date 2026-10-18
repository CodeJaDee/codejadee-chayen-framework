# Installation, Migration and Rollback Guide: Chayen v0.1.0

| Field | Value |
|---|---|
| Status | **Draft for the v0.1.0 release (Phase 6).** Not yet valid for public use: the repository is not public, and no remote install has been observed |
| Identity | Plugin `chayen`, marketplace `codejadee`, install identifier `chayen@codejadee` |
| Supported hosts | Claude Code CLI, OpenAI Codex CLI, GitHub Copilot CLI ≥ 1.0.91. VS Code surfaces are **not supported** in v0.1.0 (AR-02) |
| Per-CLI detail | [Claude Code](../INSTALL_CLAUDE_CODE.md) · [Codex](../INSTALL_CODEX.md) · [Copilot](../INSTALL_COPILOT.md) |

Always check your installed CLI's `plugin --help` first, because commands differ by
version.

- Never delete a whole provider configuration directory to remove Chayen.
- A *disabled* plugin is still installed. Verify removal by its absence.
- Chayen is static Markdown and JSON. Installing it adds no executable, hook or MCP server.

## 1. Install

Public source, available only after the authorized visibility change (M2):

| CLI | Commands | Verified? |
|---|---|---|
| Claude Code | `claude plugin marketplace add CodeJaDee/codejadee-chayen-framework` → `claude plugin install chayen@codejadee` → `claude plugin list` → `claude plugin details chayen@codejadee` | Local-marketplace form PASS on 2.1.302 (Phase 4). Remote form **pending** |
| Codex | `codex plugin marketplace add CodeJaDee/codejadee-chayen-framework` → `codex plugin add chayen@codejadee` → `codex plugin list --marketplace codejadee` | Local-marketplace form PASS on 0.163.0 (Phase 4). Remote form **pending** |
| Copilot | `copilot plugin marketplace add CodeJaDee/codejadee-chayen-framework` → `copilot plugin install chayen@codejadee` → `copilot plugin list` → `copilot skill list` | **Not verified** (CLI unavailable in Phase 4) |

After installing, confirm version `0.1.0`, the enabled state and **15** Skills, then
start a new session.

**Reviewed or pinned install (recommended while `main` is unprotected, AR-03).** Check
out the reviewed stable source and add the local clone as the marketplace:

```bash
git clone https://github.com/CodeJaDee/codejadee-chayen-framework.git
git -C codejadee-chayen-framework checkout <stable 0.1.0 commit SHA, or tag v0.1.0 if one is published>
claude plugin marketplace add ./codejadee-chayen-framework      # or codex / copilot equivalents
```

Tags are optional by owner decision (2026-10-18). A commit SHA always works. The remote
Git-ref pin syntax of each CLI has not been verified.

## 2. Update

| CLI | Commands | Notes |
|---|---|---|
| Claude Code | `claude plugin marketplace update codejadee` → `claude plugin update chayen@codejadee` | Verify the active version and changed content. An unchanged version string can keep cached content |
| Codex | `codex plugin marketplace upgrade codejadee`; if content is unchanged, `codex plugin remove chayen@codejadee` → `codex plugin add chayen@codejadee` | No dedicated per-plugin update in 0.163.0. Replacement was verified in Phase 4 |
| Copilot | `copilot plugin update chayen` | Directory-sourced plugins may read live content. Unverified |

## 3. Migrate from the former identity

Earlier development builds used the plugin name `codejadee-chayen-framework`. The
repository, marketplace and package directory names are unchanged. Remove the old
identity at the scope where it was installed, then install `chayen`:

<!-- migration:start -->
```bash
# Claude Code
claude plugin uninstall codejadee-chayen-framework@codejadee
claude plugin marketplace update codejadee
claude plugin install chayen@codejadee
# Codex
codex plugin remove codejadee-chayen-framework@codejadee
codex plugin marketplace upgrade codejadee
codex plugin add chayen@codejadee
# Copilot
copilot plugin uninstall codejadee-chayen-framework
copilot plugin install chayen@codejadee
```
<!-- migration:end -->

Confirm that the old identity is **absent**, not just disabled. Migration was verified
on Claude Code 2.1.302 and Codex 0.163.0 with a fixture (Phase 4). On Copilot it is
unverified. Explicit invocation changes to `/chayen:<skill>` (Claude), `$<skill>`
(Codex) and `/<skill>` (Copilot). These forms are not yet runtime-verified on the
current build.

## 4. Roll back

| Situation | Procedure |
|---|---|
| Remove Chayen completely | Claude: `claude plugin uninstall chayen@codejadee` and `claude plugin marketplace remove codejadee`. Codex: `codex plugin remove chayen@codejadee` and `codex plugin marketplace remove codejadee`. Copilot: `copilot plugin uninstall chayen` and `copilot plugin marketplace remove codejadee`. Then list the plugins and confirm `chayen` is absent. Start a new session |
| Return to an earlier release (after a later release exists) | Remove the marketplace. Clone the repository and check out the earlier stable commit (or its tag, if one exists). Add the local clone as the marketplace and install `chayen@codejadee`. Verify that the version and 15 Skills match the earlier release |
| A bad update was installed from `main` | Same as above, using the last good stable commit. Report the problem through the channel named in `SECURITY.md`, which currently has **no channel (Security/Support is LATER)**. Keep redacted details until a channel exists |
| The optional response style policy was opted into | It is not removed with the plugin. Follow the removal and rollback steps in [RESPONSE_STYLE.md](../RESPONSE_STYLE.md) |

v0.1.0 is the first release, so there is no earlier stable version to roll back to.
Removal is the rollback.

## 5. Post-publication smoke test

Run this only after the owner authorizes and performs the visibility change, and the
stable `0.1.0` source is on the default branch. No tag or GitHub Release is required. Run it in a disposable profile per CLI (an isolated
`CLAUDE_CONFIG_DIR`, `CODEX_HOME` or `COPILOT_HOME` with `COPILOT_AUTO_UPDATE=false`),
using a test identity. Record every command, its exit code, the CLI version and the date.

1. Unauthenticated `curl -s -o /dev/null -w "%{http_code}" https://github.com/CodeJaDee/codejadee-chayen-framework` returns `200`.
2. `<cli> plugin marketplace add CodeJaDee/codejadee-chayen-framework` succeeds with no credentials.
3. Install `chayen@codejadee`. The native list shows version `0.1.0` and enabled. Native discovery shows exactly 15 Skills.
4. The full installed tree matches the release package fingerprint, compared under the canonical fingerprint rule chosen by the owner.
5. G-17 smoke on each CLI:
   - update from `0.1.0-rc.N` to `0.1.0`, then verify the version and content;
   - uninstall, then verify absence from the installed list and native discovery;
   - remove the marketplace.
6. Store the results under `tests/provider-compatibility/results/<date>-public-smoke/` and update the gate matrix (G-15 remote install, G-17 provider smoke results).

Until all six steps are observed, report public installation as **pending, not
completed**.

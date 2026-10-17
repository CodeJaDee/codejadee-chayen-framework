# Compatibility matrix

**Build:** `0.1.0-dev`, 15 skills (13 engineering, 2 writing). **Last updated:** 2026-10-17.

The skill behaviour results below were recorded on 2026-10-15 for the
13-skill build, before the two writing skills were added. Nothing has been
executed on a real host for the 15-skill build yet.

| Label | Meaning |
|---|---|
| **Verified (13-skill build)** | Executed and recorded on 2026-10-15 for the 13 engineering skills, before the writing skills were added |
| **Verified (earlier build)** | Executed on the earlier 6-skill build (2026-10-14); not yet repeated |
| **Confirmed (static)** | Checked against the repository and the provider's installed code, without running it |
| **Not tested** | No evidence yet; the procedure exists |
| **Unsupported** | The provider documents that this is not available |

The CLI and VS Code surfaces are assessed **separately**. A CLI result is
never assumed for VS Code.

## Surfaces and versions

| Surface | Version checked (2026-10-15) | Installed on the test machine (2026-10-17) | Plugin support |
|---|---|---|---|
| Claude Code CLI | 2.1.270 | 2.1.220 | Yes |
| Claude Code VS Code extension | 2.1.299 | 2.1.301 | Yes (shares settings with the CLI) |
| Codex CLI | 0.160.1 | 0.163.0 | Yes |
| Codex IDE extension (VS Code) | openai.chatgpt 26.1007.21434 | same | **Unsupported** (OpenAI) |
| GitHub Copilot CLI | runtime 1.0.97 (enable/disable needs 1.0.91 or later) | 1.0.89 (below the 1.0.91 needed for enable/disable) | Yes |
| VS Code + GitHub Copilot Chat | VS Code 1.141.1, built-in Copilot 0.69.0 | VS Code 1.142.0, Copilot Chat 0.70.0 | Yes (`chat.plugins.enabled`, on by default; policy-controllable) |

The 2026-10-17 versions were read with `--version` only. Earlier static
findings were made on the 2026-10-15 versions and have not been repeated on
the installed ones.

## Results

| Check | Claude Code CLI | Claude Code VS Code | Codex CLI | Codex IDE | Copilot CLI | VS Code Copilot |
|---|---|---|---|---|---|---|
| Correct plugin manifest | Confirmed (static); strict validate passed | Confirmed (static); strict validate passed | Confirmed (static) | Unsupported | Confirmed (static) | Confirmed (static) |
| Correct marketplace file | Confirmed (static) | Confirmed (static) | Confirmed (static) | Unsupported | Confirmed (static) | Confirmed (static) |
| Native install from a local marketplace | Verified (earlier build) | Not tested | Verified (earlier build) | Unsupported | Verified (earlier build) | Not tested |
| Install from the GitHub marketplace | Not tested | Not tested | Not tested | Unsupported | Not tested | Not tested |
| Plugin and skills discoverable | **Verified (13-skill build)**: 13/13 skills, plugin loaded from its folder | Not tested | Verified (earlier build) | Unsupported | Verified (earlier build) | Not tested |
| Automatic invocation | **Measured (13-skill build)**: 12/22 relevant runs (55%). Next.js route 0/5, pytest 3/5. | Not tested | Verified (earlier build), 3/3 | Unsupported | Verified (earlier build), 3/3 | Not tested |
| No-match: native behaviour preserved | **Verified (13-skill build)**: 12/12 | Not tested | Verified (earlier build) | Unsupported | Partial (earlier build): Unity and SwiftUI over-activated | Not tested |
| Explicit invocation | **Verified (13-skill build)**: 6/6 | Not tested | Verified (earlier build) | Unsupported | Verified (earlier build) | Not tested |
| Skill references loaded | **Measured (13-skill build)**: 10/22 runs | Not tested | Not tested | Unsupported | Not tested | Not tested |
| Disable / enable | Verified (earlier build) | Not tested | Verified (earlier build), via `config.toml` | Unsupported | Verified (earlier build) | Not tested |
| Update | Not tested; see the version note below | Not tested | Not tested; no per-plugin command | Unsupported | Command ran (earlier build); no version change was tested | Not tested |
| Uninstall | Verified (earlier build) | Not tested | Verified (earlier build) | Unsupported | Verified (earlier build); local marketplace only disabled it | Not tested |
| Project files unchanged by install or use | Verified (13-skill build) | Not tested | Verified (earlier build) | Unsupported | Verified (earlier build) | Not tested |
| Writing skills (`chayen-humanizer-th`, `chayen-humanizer-en`) discovered and selected | Not tested | Not tested | Not tested | Unsupported (no plugins) | Not tested | Not tested |
| Writing quality (Thai, English) | Not tested | Not tested | Not tested | Unsupported | Not tested | Not tested |
| Opt-in response style policy: documented user-level location | Confirmed (docs): `~/.claude/rules/` | Confirmed (docs): same as CLI | Confirmed (docs): `~/.codex/AGENTS.md` | Confirmed (docs): same layers as the CLI | Confirmed (docs): `~/.copilot/copilot-instructions.md` | Confirmed (docs): `~/.copilot/instructions/` |
| Opt-in response style policy: loaded and followed | Not tested | Not tested | Not tested | Not tested | Not tested | Not tested |
| Policy active from plugin installation alone (always-on) | Not available | Not available | Not available | Not available | Not available | Not available |

**Where the "Verified" and "Measured" results come from**

- The writing-skill and policy rows: an evaluation set (120 quality cases,
  52 routing probes, policy arms with and without the policy) is ready in
  `tests/evaluation/step40/` but has not been run. See
  [docs/chayen/HUMANIZER_EVALUATION_REPORT.md](chayen/HUMANIZER_EVALUATION_REPORT.md).

- Claude Code results for the 13-skill build come from 43 recorded runs: four run
  sets on 2026-10-15, including the STEP 34 audit re-run. The plugin was
  loaded from its folder (`--plugin-dir`).
  Marketplace installation of this build, or of the 15-skill build, has not been run.
- Results marked "earlier build" are from 2026-10-14, for the 6-skill build.
- Copilot and Codex probes for this build could not run in the test
  environment: one had no isolated sign-in, the other had no authorized
  install.

## Known provider differences

| Topic | Claude Code | Codex | Copilot |
|---|---|---|---|
| Explicit syntax | `/codejadee-chayen-framework:<skill>` | `$<skill>` | `/<skill>` |
| Disable | `claude plugin disable` | `/plugins` Space toggle or `config.toml` | `copilot plugin disable` (runtime 1.0.91 or later) |
| Update | `claude plugin update`; auto-update off for third-party marketplaces | Marketplace `upgrade` (Git), then reinstall if needed | `copilot plugin update` |
| Same-name skill conflicts | Namespaced, so both can exist | Both may appear | **Your skill wins; the plugin skill is dropped silently** |

**Version note.** Claude Code pins installs to the plugin `version`, and the
pre-release version has not changed across builds. Until a new version is
published, `update` may keep older content. Reinstall if so.

Maintainer detail is in
[docs/chayen/FINAL_PROVIDER_COMPATIBILITY.md](chayen/FINAL_PROVIDER_COMPATIBILITY.md)
and [docs/chayen/EVALUATION_REPORT.md](chayen/EVALUATION_REPORT.md).

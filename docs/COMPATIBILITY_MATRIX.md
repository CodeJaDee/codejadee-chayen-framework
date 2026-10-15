# Compatibility matrix

**Build:** `0.1.0-dev`, 13 skills. **Last updated:** 2026-10-15.

| Label | Meaning |
|---|---|
| **Verified** | Executed and recorded, for this build unless noted |
| **Verified (earlier build)** | Executed on the earlier 6-skill build (2026-10-14); not yet repeated |
| **Confirmed (static)** | Checked against the repository and the provider's installed code, without running it |
| **Not tested** | No evidence yet; the procedure exists |
| **Unsupported** | The provider documents that this is not available |

The CLI and VS Code surfaces are assessed **separately**. A CLI result is
never assumed for VS Code.

## Surfaces and versions

| Surface | Version checked | Plugin support |
|---|---|---|
| Claude Code CLI | 2.1.270 | Yes |
| Claude Code VS Code extension | 2.1.299 | Yes (shares settings with the CLI) |
| Codex CLI | 0.160.1 | Yes |
| Codex IDE extension (VS Code) | openai.chatgpt 26.1007.21434 | **Unsupported** (OpenAI) |
| GitHub Copilot CLI | runtime 1.0.97 (enable/disable needs 1.0.91 or later) | Yes |
| VS Code + GitHub Copilot Chat | VS Code 1.141.1, built-in Copilot 0.69.0 | Yes (`chat.plugins.enabled`, on by default; policy-controllable) |

## Results

| Check | Claude Code CLI | Claude Code VS Code | Codex CLI | Codex IDE | Copilot CLI | VS Code Copilot |
|---|---|---|---|---|---|---|
| Correct plugin manifest | Confirmed (static); strict validate passed | Confirmed (static); strict validate passed | Confirmed (static) | Unsupported | Confirmed (static) | Confirmed (static) |
| Correct marketplace file | Confirmed (static) | Confirmed (static) | Confirmed (static) | Unsupported | Confirmed (static) | Confirmed (static) |
| Native install from a local marketplace | Verified (earlier build) | Not tested | Verified (earlier build) | Unsupported | Verified (earlier build) | Not tested |
| Install from the GitHub marketplace | Not tested | Not tested | Not tested | Unsupported | Not tested | Not tested |
| Plugin and skills discoverable | **Verified**: 13/13 skills, plugin loaded from its folder | Not tested | Verified (earlier build) | Unsupported | Verified (earlier build) | Not tested |
| Automatic invocation | **Verified**: 14/20 relevant runs. Next.js route 0/4, pytest 2/4. | Not tested | Verified (earlier build), 3/3 | Unsupported | Verified (earlier build), 3/3 | Not tested |
| No-match: native behaviour preserved | **Verified**: 8/8 | Not tested | Verified (earlier build) | Unsupported | Partial (earlier build): Unity and SwiftUI over-activated | Not tested |
| Explicit invocation | **Verified**: 4/4 | Not tested | Verified (earlier build) | Unsupported | Verified (earlier build) | Not tested |
| Skill references loaded | **Verified**: 8/16 runs | Not tested | Not tested | Unsupported | Not tested | Not tested |
| Disable / enable | Verified (earlier build) | Not tested | Verified (earlier build), via `config.toml` | Unsupported | Verified (earlier build) | Not tested |
| Update | Not tested; see the version note below | Not tested | Not tested; no per-plugin command | Unsupported | Command ran (earlier build); no version change was tested | Not tested |
| Uninstall | Verified (earlier build) | Not tested | Verified (earlier build) | Unsupported | Verified (earlier build); local marketplace only disabled it | Not tested |
| Project files unchanged by install or use | Verified | Not tested | Verified (earlier build) | Unsupported | Verified (earlier build) | Not tested |

**Where the "Verified" results come from**

- Claude Code results for this build come from 31 recorded runs on
  2026-10-15, with the plugin loaded from its folder (`--plugin-dir`).
  Marketplace installation of this build has not been run.
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

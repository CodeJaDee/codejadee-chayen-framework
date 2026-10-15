# Final Provider Compatibility Validation (STEP 31)

| Field | Value |
|---|---|
| Date | 2026-10-15 |
| Package | `codejadee-chayen-framework` `0.1.0-dev`: 13 entry skills, 221 references, 238 files, metadata only (no hooks, MCP, LSP, agents, commands, or executables) |
| Machine | Windows 11 Pro 10.0.26200, Node 24.15.0, Git Bash |
| Step status | **PARTIAL.** Static and shipped-code validation is complete. Native install and runtime behaviour were **not executed** in this step (§2). |
| Release gate | **OPEN** (§8) |
| Runbook | [tests/provider-compatibility/README.md](../../tests/provider-compatibility/README.md) |

## 1. Summary

- **One package, one identity, no provider-specific copies.**
  - All three marketplaces point to `./plugins/codejadee-chayen-framework`.
  - Both manifests carry identical shared fields.
  - Every provider discovers the same `skills/` tree.
  - No compatibility requirement for a per-provider catalog copy was found (§6).
- **Manifest and marketplace precedence is now confirmed from the installed provider code**, not only from documentation (§4).
  - Each provider resolves this repository to its intended manifest and marketplace file.
  - No stray file can shadow those choices.
  - U-04 is resolved statically for VS Code 1.141.1.
- **No runtime surface was exercised in STEP 31.**
  - The native lifecycle runner needs its explicit opt-in.
  - This session's permission classifier denied setting that opt-in, so it was not run and not worked around.
  - Billed model runs were not attempted for the same reason.
  - Every install, discovery, invocation, reference-load, and lifecycle cell is therefore **NOT_TESTED** in this step, with exact steps in the runbook.
  - The Step 06 evidence (2026-10-14) covered a **6-skill** package and is historical. It is not re-verification of the current 13-skill package.
- **New update-path risk (R-54).**
  - The version is still `0.1.0-dev`, although the package grew from 6 to 13 skills since Step 06.
  - Claude Code pins installs to `version` (S3, S6), so existing installs may not receive the current content through `update`.

## 2. Execution limits in this step

| Limit | Effect |
|---|---|
| `CHAYEN_ALLOW_PROVIDER_LIFECYCLE=1 bash tests/provider-compatibility/run-lifecycle.sh <scratch>` was **denied** by the session's auto-mode permission classifier ("Safety Bypass Flag"). The STEP 30 hardening made this opt-in deliberate, and STEP 31 did not bypass it. | Native marketplace add, install, list, disable, enable, update, uninstall: NOT_TESTED |
| Model-invoking probes (`claude -p`, `codex exec`, `copilot -p`, `tests/routing/run-smoke.mjs --allow-provider-calls`) need the same kind of opt-in and send prompts to providers. They were not attempted. | Auto, explicit, no-match, and reference loading: NOT_TESTED |
| VS Code chat UIs (Claude Code extension, Copilot Chat) cannot be driven by this automation | All VS Code runtime checks: NOT_TESTED, with manual procedures |
| No push was made (BC-30) | Remote `owner/repo` marketplace install: NOT_TESTED |

Real provider configs were only **read** (collision and stale-install check, §6). Nothing was installed and no provider config was written.

## 3. Provider surfaces and versions recorded

| Surface | Version observed (2026-10-15) | How obtained |
|---|---|---|
| Claude Code CLI | 2.1.270 | `claude --version` |
| Claude Code VS Code extension | `anthropic.claude-code` 2.1.299 (bundled native binary 2.1.299) | `code --list-extensions --show-versions`; `<ext>/resources/native-binary/claude.exe --version` |
| OpenAI Codex CLI | 0.160.1 | `codex --version` |
| Codex IDE extension (VS Code) | `openai.chatgpt` 26.1007.21434 (bundled `codex` 0.162.0-alpha.17.2) | extension list; `bin/windows-x86_64/codex-package.json` |
| GitHub Copilot CLI | Runtime 1.0.97 (newest in `%LOCALAPPDATA%\copilot\pkg`; 1.0.68 and 1.0.91 also cached). The npm loader package is 1.0.68. | `copilot --version`, package cache listing |
| VS Code + GitHub Copilot Chat | VS Code 1.141.1 (commit `7baac39ec3`); built-in `copilot` extension 0.69.0 | `code --version`, built-in extension `package.json` |

Official pages re-read on 2026-10-15:

- S13: https://learn.chatgpt.com/docs/plugins
- S18: https://code.visualstudio.com/docs/copilot/customization/agent-plugins
- S15: https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference

All three still state what Step 02 recorded. The changes are listed in §4.3.

## 4. Manifest precedence and component discovery

### 4.1 What each provider reads from this repository

| Provider | Marketplace lookup (shipped code) | File selected here | Plugin manifest lookup (shipped code) | Manifest selected here | Evidence |
|---|---|---|---|---|---|
| Claude Code 2.1.270 / 2.1.299 | `.claude-plugin/marketplace.json` | `.claude-plugin/marketplace.json` | `.claude-plugin/plugin.json`. Neither binary contains the string `agent-plugins.org`, so the root `plugin.json` is not interpreted as Agent Plugins. | `.claude-plugin/plugin.json` | `claude plugin validate --strict` PASS on the plugin and the marketplace with **both** binaries; binary string search |
| Codex 0.160.1 (and 0.162.0-alpha in the extension) | `.agents/plugins/marketplace.json`, `.agents/plugins/api_marketplace.json`, `.claude-plugin/marketplace.json`, `.cursor-plugin/…` | `.agents/plugins/marketplace.json` | Candidates: root `plugin.json` (Agent Plugins, `$schema` 1.0.0 prefix), `.codex-plugin/plugin.json`, `.claude-plugin/plugin.json`, `.cursor-plugin/plugin.json`. Error text: "missing .codex-plugin/plugin.json or valid Agent Plugin manifest". | Root `plugin.json` (Agent Plugins) | Binary string search. The order is inferred from adjacent string tables, which matches the Step 04 runtime observation that Codex preferred `.agents/`. |
| Copilot CLI 1.0.97 | `marketplace.json`, `.plugin/marketplace.json`, `.github/plugin/marketplace.json`, `.claude-plugin/marketplace.json` | `.github/plugin/marketplace.json` | A root Agent Plugins manifest (schemas **1.0.0 and 1.1.0** accepted) takes precedence over the legacy chain `.plugin/` → `plugin.json` → `.github/plugin/` → `.claude-plugin/` | Root `plugin.json` | String table in `prebuilds/win32-x64/runtime.node`; S15 (re-read) |
| VS Code 1.141.1 Copilot Chat | Same four-file order as the Copilot CLI (`pluginMarketplaceService`) | `.github/plugin/marketplace.json` | First, a root `plugin.json` whose `$schema` starts with `https://agent-plugins.org/schemas/` and ends with `/plugin.schema.json`. Otherwise `.plugin/plugin.json`, then `.claude-plugin/plugin.json`, then `plugin.json` (Copilot format). Agent Plugins skills come from `skills/`. | Root `plugin.json` (Agent Plugins) | `workbench.desktop.main.js` (functions for marketplace and manifest detection) |

**Consequence.**

- Every surface reads a file this repository ships for it, and every one of those files resolves to the same plugin directory and name.
- The redundant `.claude-plugin/marketplace.json` is a lower-precedence fallback for Codex, Copilot, and VS Code. Its identity is the same, so it cannot create a second plugin.

### 4.2 Static identity and discovery checks (executed)

Command: `node tests/provider-compatibility/check-identity.mjs` (new, read-only). Result: **15/15 PASS**, exit 0.

| ID | Check | Result |
|---|---|---|
| IC-01 ×3 | Each marketplace (Claude, Codex, Copilot) has exactly one entry, `codejadee-chayen-framework` | PASS |
| IC-02 | All three entries resolve to `plugins/codejadee-chayen-framework` | PASS |
| IC-03 | Marketplace name `codejadee` is identical in all three files | PASS |
| IC-04 | Root manifest `$schema` is Agent Plugins **1.0.0**, the only version accepted by all three Agent Plugins readers (Codex, Copilot CLI, VS Code). Claude Code ignores this file. | PASS |
| IC-05 | `name`, `version`, `description`, `author`, `homepage`, `repository`, `license`, `keywords` are identical in both manifests | PASS (`0.1.0-dev`) |
| IC-06 | Copilot marketplace entry version equals the manifests | PASS |
| IC-07 | No `.codex-plugin/`, `.plugin/`, `.github/plugin/`, or `.cursor-plugin/` manifest inside the plugin that could shadow or conflict | PASS |
| IC-08 | No higher-precedence root `marketplace.json`, `.plugin/marketplace.json`, `.cursor-plugin/marketplace.json`, or `.agents/plugins/api_marketplace.json` | PASS |
| IC-09 | 13/13 skill directories contain `SKILL.md` (immediate children of `skills/` only) | PASS |
| IC-10 | Frontmatter `name` equals the directory name (VS Code and Agent Skills rule; invalid names fail silently in VS Code) | PASS |
| IC-11 | 13 unique `chayen-*` names, each ≤64 characters | PASS |
| IC-12 | Every description is 1–1024 characters (max 420) | PASS |
| IC-13 | Plugin top level is only `plugin.json`, `.claude-plugin/`, `README.md`, `skills/` | PASS |

Other offline gates run in this step:

| Command | Result |
|---|---|
| `node tools/validate/validate-all.mjs` | All 8 gate groups PASS, including 132/132 validator self-tests, V-25 security, and 182 trigger cases / 433 generated files in sync. 5 known size-target warnings. |
| `claude plugin validate --strict plugins/codejadee-chayen-framework` (2.1.270 and bundled 2.1.299) | `✔ Validation passed`, exit 0 |
| `claude plugin validate --strict .` (marketplace; 2.1.270 and 2.1.299) | `✔ Validation passed`, exit 0 |

### 4.3 Changes since Step 02 research

| Item | New evidence (2026-10-15) | Status |
|---|---|---|
| U-04: which marketplace file VS Code reads in a repository | VS Code 1.141.1 code: `marketplace.json`, `.plugin/`, `.github/plugin/`, `.claude-plugin/` | **Resolved statically** (runtime NOT_TESTED) |
| U-07: Agent Plugins 1.1.0 | S15 and the Copilot 1.0.97 runtime accept 1.0.0 and 1.1.0. VS Code accepts any `agent-plugins.org/schemas/*/plugin.schema.json`. The Codex binary embeds only 1.0.0. agent-plugins.org lists only 1.0.0. | Resolved for Copilot. **Keep 1.0.0** (it is the intersection of all providers). |
| U-09: VS Code agent plugins maturity | `chat.plugins.enabled` is a GA-style boolean with **default `true`**, overridable by the org policy `ChatPluginsEnabled` (VS Code ≥1.116). S18 marks only sub-features as Preview or Experimental. | Partly resolved. An org policy can disable the whole surface. |
| VS Code lifecycle | S18 now also documents `/plugin enable\|disable\|update\|uninstall` in Copilot harness sessions, and notes that "Plugins installed directly from Git can't be enabled or disabled". | Recorded. Affects the runbook. |
| Codex IDE extension | S13 still says "The IDE extension doesn't support plugins". The extension's shared webview contains `plugin/list` and `plugin/install` app-server RPCs, and it bundles a `codex` 0.162.0-alpha with the `plugin` subcommand. | **UNSUPPORTED (documented).** Plugin code is present but not exposed in documentation; re-check each release. |

## 5. Compatibility matrix (current package, STEP 31)

Legend:

- **STATIC PASS**: verified offline against repository files and the provider's installed code, with no runtime.
- **NOT_TESTED**: not executed in STEP 31; the procedure is in the runbook.
- **UNSUPPORTED**: the provider documents that the surface has no such capability.
- *Step 06* notes refer to the historical 6-skill package and are **not** current evidence.

### 5.1 CLI surfaces

| # | Check | Claude Code CLI 2.1.270 | Codex CLI 0.160.1 | Copilot CLI 1.0.97 |
|---|---|---|---|---|
| 1 | Correct plugin manifest | STATIC PASS (`.claude-plugin/plugin.json`; strict validate) | STATIC PASS (Agent Plugins root, schema 1.0.0) | STATIC PASS (Agent Plugins root takes precedence) |
| 2 | Correct marketplace source structure | STATIC PASS (strict validate; relative `./plugins/…`) | STATIC PASS (native `.agents/plugins` shape: `source.local`, `policy`, `category`; V-01c) | STATIC PASS (`.github/plugin`, selected first; V-01b) |
| 3 | Native installation | NOT_TESTED (*Step 06: PASS, local*) | NOT_TESTED (*Step 06: PASS, local*) | NOT_TESTED (*Step 06: PASS, local*) |
| 4 | Installed plugin discoverable | NOT_TESTED | NOT_TESTED | NOT_TESTED |
| 5 | Skills appear (expect 13) | NOT_TESTED. Static: 13 discoverable. | NOT_TESTED. Static: 13. | NOT_TESTED. Static: 13. |
| 6 | Automatic invocation | NOT_TESTED (*Step 06: partial*) | NOT_TESTED (*Step 06: 3/3*) | NOT_TESTED (*Step 06: 3/3; Unity/SwiftUI over-activation*) |
| 7 | Explicit invocation (`/codejadee-chayen-framework:<skill>`, `$<skill>`, `/<skill>`) | NOT_TESTED | NOT_TESTED | NOT_TESTED |
| 8 | No-match native fallback | NOT_TESTED | NOT_TESTED | NOT_TESTED |
| 9 | Skill references loaded | NOT_TESTED (never tested on any provider) | NOT_TESTED (never tested) | NOT_TESTED (never tested) |
| 10 | Disable / update / uninstall | NOT_TESTED. Update risk R-54. | NOT_TESTED. No per-plugin `update` command in 0.160.1 (`add`, `list`, `marketplace`, `remove` only); disable is `config.toml` only. | NOT_TESTED. Enable/disable needs runtime ≥1.0.91; uninstall of a live local-marketplace plugin may only disable it (Step 06). |

### 5.2 VS Code surfaces (assessed separately; nothing is inferred from the CLIs)

| # | Check | Claude Code extension 2.1.299 | Codex extension 26.1007.21434 | VS Code 1.141.1 + Copilot Chat 0.69.0 |
|---|---|---|---|---|
| 1 | Correct plugin manifest | STATIC PASS (bundled 2.1.299 strict validate) | UNSUPPORTED (S13) | STATIC PASS (Agent Plugins detection by `$schema`) |
| 2 | Correct marketplace source structure | STATIC PASS | UNSUPPORTED | STATIC PASS (`.github/plugin/marketplace.json` selected) |
| 3 | Native installation (`/plugins` → Manage plugins; `chat.plugins.marketplaces` / `@agentPlugins` / Install Plugin From Source) | NOT_TESTED | UNSUPPORTED | NOT_TESTED |
| 4 | Installed plugin discoverable | NOT_TESTED | UNSUPPORTED | NOT_TESTED |
| 5 | Skills appear (`/` menu, Configure Skills) | NOT_TESTED | UNSUPPORTED. Whether skills from a plugin installed by the Codex CLI surface through the shared `CODEX_HOME` is NOT_TESTED and is **not claimed**. | NOT_TESTED |
| 6 | Automatic invocation | NOT_TESTED | UNSUPPORTED | NOT_TESTED. Auto-invocation of plugin-bundled skills is still undocumented (U-05). |
| 7 | Explicit invocation | NOT_TESTED | UNSUPPORTED | NOT_TESTED |
| 8 | No-match native fallback | NOT_TESTED | UNSUPPORTED | NOT_TESTED |
| 9 | Skill references loaded | NOT_TESTED | UNSUPPORTED | NOT_TESTED |
| 10 | Disable / update / uninstall | NOT_TESTED | UNSUPPORTED | NOT_TESTED. Git-sourced installs cannot be disabled, only uninstalled (S18). |

Other surfaces are out of STEP 31's CLI/VS Code scope and remain NOT_TESTED: Claude desktop, ChatGPT desktop app, Copilot cloud agent, and remote GitHub marketplaces.

## 6. Duplicates, conflicts, and provider-specific copies

| Question | Finding | Evidence |
|---|---|---|
| Duplicate skills inside the package | None. 13 unique names, single canonical `skills/` tree. | IC-09..IC-11, V-05 |
| Conflicting plugin identities | None. One name, one version, one directory across 2 manifests and 3 marketplaces. No third manifest. | IC-01..IC-08 |
| Name collisions with this machine's personal skills | None. 0 `chayen-*` names among `~/.agents/skills` (29), `~/.claude/skills` (1), `~/.copilot/skills` (0), `~/.codex/skills` (0). | Read-only listing |
| Stale Chayen installs in real provider homes | None. No `codejadee` entry in Claude `installed_plugins.json` or `known_marketplaces.json`, in Copilot `installed-plugins/`, or in the Codex plugin cache. Codex `config.toml` has only a project `trust_level`. | Read-only grep |
| Routing competition (not an identity conflict) | Copilot and Codex read `~/.agents/skills`. Step 06 saw a personal `kiyo-bug-fix` win over `chayen-backend` by description. Copilot drops a plugin skill silently only on a **name** collision (S15). | POC_REPORT §4.4 |
| Provider-specific catalog copies needed? | **No.** Every provider reads the shared `skills/<name>/SKILL.md` and the skill-local `references/`. Only thin metadata files differ per provider. No `agents/openai.yaml` or `com.github.copilot/` content is required for skills. | §4.1, D-009, D-013 |

## 7. Findings

| ID | Finding | Severity | Action |
|---|---|---|---|
| F-31-01 | The package `version` is still `0.1.0-dev` after major content changes. Claude Code pins installs to `version` (S3, S6). Copilot and VS Code behaviour on an unchanged version is UNVERIFIED. Existing installs may keep the 6-skill content. | High for any already-installed user | R-54. Bump to a new semver for the next distributable build and re-run update item 10. Not changed in STEP 31 (release and version work needs approval). |
| F-31-02 | No runtime evidence exists for the current 13-skill package on any surface | Release blocking | R-53. Run the runbook under an authorized process. |
| F-31-03 | Skill-reference loading (item 9) has never been observed on any provider | Release blocking | Runbook probe P-REF |
| F-31-04 | Codex has no per-plugin update command (0.160.1). `codex plugin marketplace upgrade` refreshes Git marketplace snapshots only. The update path (upgrade, or remove/add) is UNVERIFIED. | Medium | Runbook C-10. Document in user install docs. |
| F-31-05 | Copilot's npm loader is 1.0.68. With `COPILOT_AUTO_UPDATE=false`, the bundled 1.0.68 has no `plugin enable/disable`. | Low | State "runtime ≥1.0.91" in install docs |
| F-31-06 | An org policy `ChatPluginsEnabled=false` disables VS Code agent plugins entirely | Informational | Mention in troubleshooting |
| F-31-07 | The Codex extension ships plugin RPC code but is documented as unsupported | Informational | Re-check per release (codex-vscode.md) |

## 8. Release gate

**OPEN.** Closing it requires, for each in-scope CLI and VS Code surface, recorded results for items 3–10 on the current package version. The commands, prompts, and pass criteria are in the runbook. Specifically:

1. An authorized lifecycle run (`run-lifecycle.sh`, explicit opt-in) on all three CLIs, expecting 13 skills.
2. Probes P-AUTO, P-EXPL, P-NONE, and P-REF per CLI, in an isolated home with a disposable or test identity.
3. Human execution of the Claude Code VS Code and Copilot VS Code procedures, with versions recorded.
4. An update test with a version bump (R-54) on each surface that supports update.
5. A remote `owner/repo` marketplace install after an approved push.

The Codex IDE extension stays UNSUPPORTED (Q-02 still open). It does not block the gate unless the user requires that surface.

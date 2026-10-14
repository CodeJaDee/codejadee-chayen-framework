# Provider Compatibility Matrix (Step 02 baseline)

- **Checked:** 2026-10-14
- **Evidence:** documentation only. No install was executed.
- **Status legend:** **SUPPORTED** = officially documented · **UNSUPPORTED** = officially documented as not available · **UNVERIFIED** = not documented, or sources conflict
- **Source IDs** (S1–S24) and full findings are in [PROVIDER_SPEC_RESEARCH.md](PROVIDER_SPEC_RESEARCH.md).

Statuses describe **provider capability**. They do not mean Chayen works
there yet. Chayen's own verification is tracked in
[ACCEPTANCE_MATRIX.md](ACCEPTANCE_MATRIX.md).

## 1. Surfaces

| Surface | Native plugin install | Marketplace add | Auto skill invocation | Sources |
|---|---|---|---|---|
| Claude Code CLI | SUPPORTED | SUPPORTED | SUPPORTED | S5, S7 |
| Claude Code VS Code extension | SUPPORTED | SUPPORTED | SUPPORTED | S5, S7 |
| Claude Code desktop (local) | SUPPORTED | SUPPORTED | SUPPORTED | S5 |
| Claude Code cloud session | UNSUPPORTED (local plugins) | UNSUPPORTED (repo `extraKnownMarketplaces`) | n/a | S5, S6 |
| Codex CLI | SUPPORTED (interactive `/plugins`) | SUPPORTED | SUPPORTED | S10, S12, S13 |
| Codex in ChatGPT desktop app | SUPPORTED | SUPPORTED | SUPPORTED | S10, S13 |
| Codex IDE extension (VS Code) | **UNSUPPORTED** | UNSUPPORTED | SUPPORTED (standalone skills only) | S12, S13 |
| GitHub Copilot CLI | SUPPORTED | SUPPORTED | SUPPORTED (plugin skills: UNVERIFIED) | S15, S17 |
| VS Code + Copilot Chat | SUPPORTED (maturity UNVERIFIED) | SUPPORTED (`chat.plugins.marketplaces`) | SUPPORTED (plugin skills: UNVERIFIED) | S18, S19 |
| Copilot cloud agent | SUPPORTED (declarative `enabledPlugins`) | SUPPORTED (`extraKnownMarketplaces`) | UNVERIFIED | S14 |

## 2. Manifest and package formats

| Format element | Claude Code | Codex | Copilot CLI | VS Code Copilot | Sources |
|---|---|---|---|---|---|
| Root `plugin.json` + Agent Plugins `$schema` 1.0.0 | UNVERIFIED (not documented) | SUPPORTED (preferred) | SUPPORTED (takes precedence) | SUPPORTED | S3, S9, S10, S15, S18 |
| `.claude-plugin/plugin.json` | SUPPORTED (native) | UNVERIFIED ("Claude-compatible manifests" accepted in general) | SUPPORTED (legacy location 4) | SUPPORTED (Claude format) | S3, S10, S15, S18 |
| `.codex-plugin/plugin.json` | UNVERIFIED | SUPPORTED (fallback) | UNVERIFIED | UNVERIFIED | S10 |
| No manifest (standard layout only) | SUPPORTED | UNVERIFIED | UNVERIFIED | UNVERIFIED | S3 |
| `skills/<name>/SKILL.md` discovery | SUPPORTED | SUPPORTED | SUPPORTED | SUPPORTED | S3, S10, S15, S18 |
| Agent Skills standard fields (`name`, `description`, `license`, `compatibility`, `metadata`) | SUPPORTED | SUPPORTED (`name`, `description` confirmed) | SUPPORTED (`name`, `description` confirmed) | SUPPORTED | S7, S11, S17, S19, S24 |
| Root `mcp.json` (portable MCP) | UNVERIFIED (Claude uses `.mcp.json`) | SUPPORTED | SUPPORTED | SUPPORTED | S3, S10, S15, S20 |
| Hooks | SUPPORTED (`hooks/hooks.json`) | SUPPORTED (manually installed desktop plugins only) | SUPPORTED (`com.github.copilot/hooks/`) | SUPPORTED | S3, S10, S15, S18 |

## 3. Marketplace formats

| Marketplace file | Claude Code | Codex | Copilot CLI | VS Code Copilot | Sources |
|---|---|---|---|---|---|
| `.claude-plugin/marketplace.json` | SUPPORTED (native) | SUPPORTED ("legacy-compatible"). Field-level compatibility is UNVERIFIED. | SUPPORTED (location 4) | UNVERIFIED | S4, S10, S15 |
| `.agents/plugins/marketplace.json` | UNVERIFIED | SUPPORTED (native) | UNVERIFIED | UNVERIFIED | S10 |
| Root `marketplace.json` / `.github/plugin/marketplace.json` | UNVERIFIED | UNVERIFIED | SUPPORTED | UNVERIFIED | S15 |
| Relative-path plugin source (`"./plugins/x"`) | SUPPORTED | Native form is `{"source":"local","path":"./…"}`. String form UNVERIFIED. | SUPPORTED | UNVERIFIED | S4, S10, S15 |
| GitHub source object | SUPPORTED | SUPPORTED (git-backed) | SUPPORTED | UNVERIFIED | S4, S10, S15 |
| Agent Plugins marketplace spec | — | — | — | — | Not defined (S20) |

## 4. Lifecycle commands

| Action | Claude Code | Codex | Copilot CLI | VS Code Copilot |
|---|---|---|---|---|
| Add marketplace | `claude plugin marketplace add` | `codex plugin marketplace add` | `copilot plugin marketplace add` | `chat.plugins.marketplaces` setting |
| Install | `claude plugin install p@m` | `/plugins` browser (CLI command UNVERIFIED) | `copilot plugin install p@m` | Extensions view `@agentPlugins` / Install From Source |
| Enable / disable | `claude plugin enable\|disable` | `/plugins` Space toggle / `config.toml` `enabled` | `copilot plugin enable\|disable` | Installed view context menu |
| Update | `claude plugin update` (auto-update off for third-party) | UNVERIFIED (marketplace `upgrade` only) | `copilot plugin update [--all]` | Check for Extension Updates / 24 h auto |
| Uninstall | `claude plugin uninstall` | browser "Uninstall plugin" | `copilot plugin uninstall` | Installed view → Uninstall |
| Static validation | `claude plugin validate [--strict]` | UNVERIFIED | UNVERIFIED | UNVERIFIED |
| Trigger / behaviour evals | `claude plugin eval` (negative checks via `min: 0`/`max: 0`) | UNVERIFIED | UNVERIFIED | UNVERIFIED |

Sources: S2, S5, S8 (Claude) · S10, S13 (Codex) · S15 (Copilot CLI) · S18 (VS Code).

## 5. Skill discovery limits that constrain Chayen

| Limit | Claude Code | Codex | Copilot CLI | VS Code | Portable minimum |
|---|---|---|---|---|---|
| `name` | kebab-case | required | ≤64 | ≤64, matches the directory, plain kebab-case | **≤64, `a-z0-9-`, matches the directory** (S24) |
| `description` | ≤1,536 combined listing cap | — | ≤1024 | ≤1024 | **≤1024** (S24) |
| Skill-listing budget | 1% of the context window | 2% of the window, or 8,000 characters | UNVERIFIED | UNVERIFIED | Design for the smallest documented budget |
| Same-name collision | namespaced `plugin:skill`, both load | both may appear | **first found wins, plugin skill dropped silently** | primary root wins | Use collision-resistant names |
| Body | <500 lines | concise | — | — | **<500 lines / <5k tokens** (S24) |

## 6. Chayen requirement impact

| Req | Impact of these findings |
|---|---|
| REQ-01 Native install | Achievable on the Claude Code CLI and VS Code extension, the Codex CLI and app, the Copilot CLI, and VS Code Copilot Chat. **Not achievable on the Codex IDE extension** (UNSUPPORTED). This needs a user decision (ISSUES Q-02). |
| REQ-02 / REQ-03 Automatic discovery | Supported natively everywhere, description-driven and probabilistic. Must be measured, not assumed (R-02). |
| REQ-04 Native behaviour otherwise | Compatible: skills load only on match. The plugin must carry no always-on hooks or instructions (D-007). |
| REQ-06 Progressive loading | Natively supported by all providers (metadata, then body, then references). |
| REQ-05 206 capabilities | Listing budgets (Claude 1%, Codex 2% or 8k characters) make 206 separate skills impractical. This strengthens D-006. |
| REQ-10 Compatibility tests | Claude has official validate and eval tooling. Codex and Copilot evidence will have to rely on scripted CLI smoke tests and recorded transcripts (R-07). |

## 7. Step 04 local test observations (2026-10-14)

These were **executed** tests against the `0.1.0-dev` package.

- Each CLI used an isolated config home (`CLAUDE_CONFIG_DIR`, `CODEX_HOME`,
  `COPILOT_HOME` + `COPILOT_CACHE_HOME`) in a scratch directory.
- The marketplace was a **local copy** of the repository files.
- These are **not** remote or GitHub marketplace installs.
- The package has no skills, so skill loading was **not** tested.
- The user's real configs were fingerprinted before and after: 6/6 unchanged.

| Surface (version) | Result | Detail |
|---|---|---|
| Claude Code CLI 2.1.270 | **PASS (local)** | `marketplace add` → `install` → `list` (v0.1.0-dev, enabled) → `details` (0 components, ~0 tok always-on) → `disable` → `enable` → `uninstall` → `marketplace remove`: all exit 0. A root `plugin.json` next to `.claude-plugin/plugin.json` caused no error (U-01 partly resolved). |
| Codex CLI 0.160.1 | **PASS (local)** | `marketplace add` → `plugin list` → `plugin add --json` (version 0.1.0-dev, cached with both manifests) → `plugin remove` → `marketplace remove`: all exit 0. Codex read **`.agents/plugins/marketplace.json`** when both files existed. With `.agents/` removed, it listed the plugin from `.claude-plugin/marketplace.json` (U-02: listing confirmed; install from the legacy file not tested). Non-interactive `codex plugin add/remove` exist (U-03 resolved for this version). |
| Copilot CLI (isolated runtime **1.0.68**; the normal environment reports 1.0.91) | **PARTIAL (local)** | `marketplace add` → `browse` → `install` → `list` (v0.1.0-dev) → `update` → `uninstall` → `marketplace remove`: all exit 0. **`plugin enable` / `plugin disable` failed** with "too many arguments" on runtime 1.0.68. Probe: Copilot read **`.github/plugin/marketplace.json` first** and fell back to `.claude-plugin/marketplace.json` when it was absent. |
| VS Code Copilot Chat | NOT_RUN | No scripted interface used. U-04 and U-09 remain open. |
| Claude Code VS Code extension | NOT_RUN | It shares settings with the CLI (S5), but this was not tested. |
| Codex IDE extension | UNSUPPORTED (S13) | — |

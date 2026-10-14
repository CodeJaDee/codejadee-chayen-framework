# Provider Specification Research (Step 02)

| Field | Value |
|---|---|
| Researched | 2026-10-14 |
| Method | Read official documentation pages directly (web fetch). No plugin was installed or executed in this step. |
| Status legend | **SUPPORTED** = an official source states it · **UNSUPPORTED** = an official source states it is not available · **UNVERIFIED** = no official statement found, or the sources conflict |

> **Limitation.** Pages were retrieved with a fetch tool that converts them to
> text and may paraphrase long passages. Short quotes below come from that
> output. Every claim that drives packaging must be re-checked by an actual
> install test (Steps 06–08) before it counts as verified. Third-party blogs
> and mirror sites appeared in search results but are **not** used as evidence.

## 0. Sources

| ID | Official URL | Owner |
|---|---|---|
| S1 | https://code.claude.com/docs/en/plugins | Anthropic |
| S2 | https://code.claude.com/docs/en/plugin-marketplaces (served as "Create a marketplace") | Anthropic |
| S3 | https://code.claude.com/docs/en/plugins/manifest-reference | Anthropic |
| S4 | https://code.claude.com/docs/en/plugins/marketplace-reference | Anthropic |
| S5 | https://code.claude.com/docs/en/plugins/install | Anthropic |
| S6 | https://code.claude.com/docs/en/plugins/loading | Anthropic |
| S7 | https://code.claude.com/docs/en/skills | Anthropic |
| S8 | https://code.claude.com/docs/en/plugin-evals | Anthropic |
| S9 | https://code.claude.com/docs/llms.txt (documentation index) | Anthropic |
| S10 | https://developers.openai.com/plugins/build/plugins | OpenAI |
| S11 | https://developers.openai.com/plugins/build/skills | OpenAI |
| S12 | https://learn.chatgpt.com/docs/build-skills (308 redirect from developers.openai.com/codex/skills) | OpenAI |
| S13 | https://learn.chatgpt.com/docs/plugins (308 redirect from developers.openai.com/codex/plugins) | OpenAI |
| S14 | https://docs.github.com/en/copilot/concepts/agents/about-plugins | GitHub |
| S15 | https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference | GitHub |
| S16 | https://docs.github.com/en/copilot/concepts/agents/about-agent-skills | GitHub |
| S17 | https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills | GitHub |
| S18 | https://code.visualstudio.com/docs/copilot/customization/agent-plugins | Microsoft |
| S19 | https://code.visualstudio.com/docs/copilot/customization/agent-skills | Microsoft |
| S20 | https://agent-plugins.org/specification | Agent Plugins project |
| S21 | https://agent-plugins.org/schemas/1.0.0/plugin.schema.json | Agent Plugins project |
| S22 | https://agent-plugins.org/schemas | Agent Plugins project |
| S23 | https://agent-plugins.org | Agent Plugins project |
| S24 | https://agentskills.io/specification | Agent Skills project |

---

## 1. Claude Code native plugins and marketplaces

### 1.1 Plugin manifest

| Finding | Status | Source |
|---|---|---|
| The manifest lives at `.claude-plugin/plugin.json`. All other plugin files (`skills/`, `commands/`, `hooks/`, …) go at the plugin root, not inside `.claude-plugin/`. | SUPPORTED | S3 |
| **The manifest is optional.** "Without it, Claude Code loads the components it finds in the standard layout." The name then comes from the marketplace entry. | SUPPORTED | S3 |
| `name` is the only required field. It should be kebab-case, and every component is namespaced under it (`plugin:skill`). | SUPPORTED | S3 |
| Reserved names fail validation: names starting with `claude-`, `anthropic-`, or `cc-plugin-`, and exact names such as `claude` and `claude-code`. | SUPPORTED | S3 |
| `$schema` is accepted for editor autocomplete and "ignored at load time". There is **no manifest-version field**. | SUPPORTED | S3 |
| Unknown top-level fields are stripped, with a warning. The plugin still loads. | SUPPORTED | S3 |
| Setting `version` pins users to that version until it changes. If it is omitted, a git-hosted plugin's version is the commit SHA. | SUPPORTED | S3, S6 |
| Claude Code reading a root-level `plugin.json` (Agent Plugins format) | **UNVERIFIED**. No Claude Code page mentions Agent Plugins (S9 index search). S8 lists "a `plugin.json` or `.claude-plugin/plugin.json` manifest" as an eval prerequisite, which is ambiguous. | S8, S9 |

### 1.2 Directory structure

The standard layout (S3) is `.claude-plugin/plugin.json`, `skills/<name>/SKILL.md`,
`commands/`, `agents/`, `hooks/hooks.json`, `.mcp.json`, `.lsp.json`,
`output-styles/`, `workflows/`, `themes/`, `monitors/`, `bin/`, and
`settings.json`. A `CLAUDE.md` at the plugin root is **not** loaded, and
validation warns about it (S3). A manifest `skills` key adds directories to the
default `skills/` scan (S3).

### 1.3 Marketplace

| Finding | Status | Source |
|---|---|---|
| The file lives at `.claude-plugin/marketplace.json`. The marketplace root is the directory that contains `.claude-plugin/`. | SUPPORTED | S2, S4 |
| Required fields: `name`, `owner` (with `owner.name`), and `plugins[]`. Each entry needs `name` and `source`. | SUPPORTED | S2, S4 |
| Plugin source types: relative path (`./…`), `github`, `url`, `git-subdir`, `npm`, `archive`, `command`. Git sources can be pinned with `ref` and `sha`. | SUPPORTED | S4 |
| Unknown keys are ignored, with a validation warning. | SUPPORTED | S4 |
| Reserved marketplace names include `claude-plugins-official`, `agent-skills`, `npm`, `github`, and others. | SUPPORTED | S4 |
| The entry name must equal the manifest name, or installs by manifest name fail. | SUPPORTED | S2 |

### 1.4 Lifecycle

| Action | Command / UI | Status | Source |
|---|---|---|---|
| Add marketplace | `claude plugin marketplace add <owner/repo \| git URL \| ./path \| https://…/marketplace.json>`, or `/plugin marketplace add` | SUPPORTED | S2, S5 |
| Install | `claude plugin install <plugin>@<marketplace> [--scope user\|project\|local]`, or `/plugin install` (opens the panel) | SUPPORTED | S5 |
| Enable / disable | `claude plugin enable\|disable <plugin>@<marketplace>`, or the `/plugin` Installed tab | SUPPORTED | S5 |
| Update | `claude plugin update <plugin>@<marketplace>`. Auto-update is **off by default** for third-party marketplaces. | SUPPORTED | S5, S6 |
| Uninstall | `claude plugin uninstall <plugin>@<marketplace>`. Removing the marketplace uninstalls its plugins. | SUPPORTED | S5 |
| Validate | `claude plugin validate <dir>` (with `--strict` for CI) | SUPPORTED | S2, S3 |
| Behaviour tests | `claude plugin eval` (requires v2.1.269 or later) | SUPPORTED | S8 |
| Local dev without a marketplace | `--plugin-dir` | SUPPORTED | S1, S5 |

### 1.5 Surfaces

| Surface | Plugins | Source |
|---|---|---|
| Terminal CLI | SUPPORTED | S5 |
| VS Code extension (`/plugins` → Manage plugins) | SUPPORTED. It shares settings files with the CLI. | S5 |
| Desktop app (local sessions) | SUPPORTED | S5 |
| JetBrains | SUPPORTED, through the terminal flow | S5 |
| Cloud sessions (claude.ai/code) | **UNSUPPORTED** for locally installed plugins. Organisation-managed plugins only. | S5 |

---

## 2. OpenAI Codex plugins and marketplace distribution

### 2.1 Plugin manifest

| Finding | Status | Source |
|---|---|---|
| A portable package puts `plugin.json` at the plugin root and declares the Agent Plugins `$schema` (`https://agent-plugins.org/schemas/1.0.0/plugin.schema.json`). | SUPPORTED | S10 |
| `.codex-plugin/plugin.json` is optional and "serves as a compatibility fallback". | SUPPORTED | S10 |
| "OpenAI also accepts legacy and Claude-compatible manifests, but new packages should use this format." | SUPPORTED as a general statement. **Exact handling of `.claude-plugin/plugin.json` is UNVERIFIED.** | S10 |
| OpenAI-specific settings go in `extensions.com.openai` (apps, hooks, interface, onboardingSkill). | SUPPORTED | S10 |
| "Portable packages discover skills from the root `skills/` directory, so the manifest doesn't need a `skills` field." | SUPPORTED | S10 |
| Accepted Agent Plugins schema versions | Only 1.0.0 is shown. Other versions are UNVERIFIED. | S10 |

### 2.2 Marketplace

| Finding | Status | Source |
|---|---|---|
| Locations read: `$REPO_ROOT/.agents/plugins/marketplace.json`, the "legacy-compatible" `$REPO_ROOT/.claude-plugin/marketplace.json`, and the personal `~/.agents/plugins/marketplace.json` | SUPPORTED (stated for the ChatGPT desktop app) | S10 |
| Native entry shape: `name`, `interface.displayName`, `plugins[].source` (`{"source":"local","path":"./…"}`), `policy.installation` (`AVAILABLE` / `INSTALLED_BY_DEFAULT` / `NOT_AVAILABLE`), `policy.authentication`, `category`. Git and npm sources are also supported. | SUPPORTED | S10 |
| Codex accepting Claude-style **string** `source` values in `.claude-plugin/marketplace.json` | **UNVERIFIED** | — |

### 2.3 Lifecycle

| Action | Command / UI | Status | Source |
|---|---|---|---|
| Add marketplace | `codex plugin marketplace add owner/repo` (also `--ref`, `--sparse`, or a local path) | SUPPORTED | S10 |
| Refresh marketplaces | `codex plugin marketplace upgrade [name]` | SUPPORTED | S10 |
| Remove marketplace | `codex plugin marketplace remove <name>` | SUPPORTED | S10 |
| Install | Codex CLI: `/plugins` opens the plugin browser. "Install a plugin from a configured marketplace, then start a new session." | SUPPORTED (interactive UI). A non-interactive `codex plugin install` command is **UNVERIFIED**. | S13 |
| Enable / disable | Space key in the `/plugins` browser, or `[plugins."name@marketplace"] enabled = false` in `.codex/config.toml` | SUPPORTED | S10, S13 |
| Uninstall | "Uninstall plugin" in a supported browser. It may be unavailable for workspace or default plugins. | SUPPORTED (UI only) | S13 |
| Update an individual plugin | Not documented | **UNVERIFIED** | — |
| Validation or eval tooling | None found | **UNVERIFIED** | — |

### 2.4 Surfaces

| Surface | Plugins | Source |
|---|---|---|
| Codex CLI | SUPPORTED | S13 |
| Codex in the ChatGPT desktop app | SUPPORTED | S10, S13 |
| ChatGPT web, desktop, and mobile (Chat and Work) | SUPPORTED. Plugins are published to a workspace by admins. | S10, S13 |
| **Codex IDE extension (VS Code)** | **UNSUPPORTED**: "The IDE extension doesn't support plugins." | S13 |
| Codex IDE extension: standalone skills from `.agents/skills` | SUPPORTED. This is not a plugin install path. | S12 |

---

## 3. GitHub Copilot agent plugins and marketplaces

### 3.1 Copilot CLI (and cloud agent and GitHub Copilot app)

| Finding | Status | Source |
|---|---|---|
| A plugin is "installable packages that extend Copilot with reusable agents, skills, hooks, and integrations". Surfaces: Copilot CLI, Copilot cloud agent, GitHub Copilot app. | SUPPORTED | S14 |
| **Agent Plugins format:** root `plugin.json` with `$schema` and `name` required. Copilot-only components go under `com.github.copilot/` (agents, commands, rules, hooks, LSP). Skills live in `skills/<name>/SKILL.md`, immediate subdirectories only. | SUPPORTED | S14, S15 |
| Accepted Agent Plugins versions: S15 states v1.0.0 **or v1.1.0**. agent-plugins.org lists only 1.0.0 (S22). | **Sources conflict.** Use 1.0.0. | S15, S22 |
| **Legacy manifest locations** (checked in order): `.plugin/plugin.json`, root `plugin.json`, `.github/plugin/plugin.json`, **`.claude-plugin/plugin.json`** | SUPPORTED | S15 |
| "A root manifest targeting Agent Plugins takes precedence over `.plugin/plugin.json` and `.claude-plugin/plugin.json`." | SUPPORTED | S15 |
| Legacy manifest fields: `name` (required, kebab-case, ≤64), `description` (≤1024), `version` (semver), plus component path fields | SUPPORTED | S15 |
| **Marketplace locations** (checked in order): `marketplace.json`, `.plugin/marketplace.json`, `.github/plugin/marketplace.json`, **`.claude-plugin/marketplace.json`** | SUPPORTED | S15 |
| Marketplace required fields: `name`, `owner`, `plugins`. Entry sources: relative path, or `{source:"github", repo, ref, path, sha}`. | SUPPORTED | S15 |
| Default marketplaces: `copilot-plugins`, `awesome-copilot` | SUPPORTED | S14, S18 |
| Skill precedence: first found wins. Project and personal skills beat plugin skills, and **duplicates are dropped silently**. | SUPPORTED | S15 |

### 3.2 Copilot CLI lifecycle

| Action | Command | Status | Source |
|---|---|---|---|
| Add marketplace | `copilot plugin marketplace add SPEC` | SUPPORTED | S15 |
| Install | `copilot plugin install <plugin@marketplace \| OWNER/REPO[:PATH] \| git URL \| local path>`, or `/plugin install` | SUPPORTED | S14, S15 |
| Enable / disable | `copilot plugin enable\|disable NAME` | SUPPORTED | S15 |
| Update | `copilot plugin update NAME` (or `--all`) | SUPPORTED | S15 |
| Uninstall | `copilot plugin uninstall NAME` | SUPPORTED | S15 |
| Declarative (cloud agent) | `enabledPlugins` / `extraKnownMarketplaces` in `.github/copilot/settings.json` | SUPPORTED | S14 |
| Validation or eval tooling | None found | **UNVERIFIED** | — |

### 3.3 VS Code (GitHub Copilot Chat agent plugins)

| Finding | Status | Source |
|---|---|---|
| Agent plugins are enabled by the setting `chat.plugins.enabled`. A preview or GA label for plugins is not stated (only agent-scoped hooks are marked Preview). | SUPPORTED. Maturity label **UNVERIFIED**. | S18 |
| Formats detected: Agent Plugins 1.0 (root `plugin.json` with `$schema`), Copilot `plugin.json`, **Claude `.claude-plugin/plugin.json`**, legacy `.plugin/plugin.json`. "A root plugin.json that declares the canonical Agent Plugins $schema uses Agent Plugins semantics." | SUPPORTED | S18 |
| Marketplaces come from the setting `chat.plugins.marketplaces` (`owner/repo`, HTTPS, SSH, `file:///`). Defaults: `copilot-plugins`, `awesome-copilot`. | SUPPORTED | S18 |
| Marketplace file location VS Code reads inside a repo | **UNVERIFIED** (not stated in S18) | — |
| Install: Extensions view `@agentPlugins`, the Agent Customizations editor, or **Chat: Install Plugin From Source** | SUPPORTED | S18 |
| Enable, disable, and uninstall from the Agent Plugins – Installed view. Updates via **Extensions: Check for Extension Updates**, or automatically every 24 hours. | SUPPORTED | S18 |
| Workspace recommendation through `extraKnownMarketplaces` / `enabledPlugins` in `.claude/settings.json` or `.github/copilot/settings.json` | SUPPORTED | S18 |
| Plugin skill names must be plain kebab-case, and the directory name must match `name`. | SUPPORTED | S18 |

---

## 4. Agent Plugins portable specification

| Finding | Status | Source |
|---|---|---|
| Spec version 1.0.0, status "Published". A vendor-neutral standard. The initial TSC includes maintainers from Amazon, Cursor, Microsoft, OpenAI, and Vercel. **Anthropic and Claude Code are not listed.** | SUPPORTED | S20, S23 |
| A plugin "MUST include a manifest at `plugin.json` in the plugin root". Required fields: `$schema` and `name`. | SUPPORTED | S20, S21 |
| JSON Schema draft 2020-12. Top level has `additionalProperties: false`. Properties: `$schema` (const), `name` (1–64 characters, lowercase letters, digits, `.` and `-`; must start and end alphanumeric; no `--` or `..`), `version`, `description`, `author{name,email,url}`, `homepage`, `repository`, `license`, `keywords[]`, `extensions{<reverse-domain>: object}`. | SUPPORTED (schema read) | S21 |
| v1 defines **exactly two** component types: skills (`skills/<name>/SKILL.md`, immediate children only) and MCP servers (root `mcp.json`). Agents, commands, hooks, rules, and LSP are outside v1. | SUPPORTED | S20 |
| Unsupported `$schema` version: the client "MUST reject the plugin". | SUPPORTED | S20 |
| Clients "MUST ignore component types they do not support" and "MUST ignore manifest entries for namespaces it does not implement". | SUPPORTED | S20 |
| Client-specific files go in a top-level directory named after a reverse-domain namespace (for example `com.github.copilot/`). | SUPPORTED | S20 |
| Skills "MUST conform to the Agent Skills specification". | SUPPORTED | S20 |
| Marketplace or registry format | **Not defined** by the spec | S20 |
| Install and update lifecycle | **Not defined** beyond loading from a directory path | S20 |
| Published schema versions | Only 1.0.0 (S22). Copilot's mention of 1.1.0 is not reflected there. | S22 |

---

## 5. Agent Skills and `SKILL.md` requirements

| Rule | Agent Skills spec (S24) | Claude Code (S7) | Codex (S11, S12) | Copilot CLI / VS Code (S17, S19) |
|---|---|---|---|---|
| File | `<dir>/SKILL.md` with YAML frontmatter | same | same | same |
| `name` | Required. ≤64 characters, `a-z0-9-`, no leading, trailing, or double hyphen, **must match the directory** | Optional (defaults to the directory name) | Required | Required. VS Code: must match the directory, ≤64. Invalid names "silently fail to load". |
| `description` | Required. 1–1024 characters, covering *what* the skill does and *when* to use it | Recommended. `description` + `when_to_use` are capped at **1,536** characters in the listing | Required. "The description determines when the model considers the skill." | Required. ≤1024 |
| Optional standard fields | `license`, `compatibility` (≤500), `metadata` (string map), `allowed-tools` (experimental) | Standard fields plus many Claude-only fields (`when_to_use`, `paths`, `disable-model-invocation`, `user-invocable`, `context`, `hooks`, …). **Unknown fields are ignored silently.** | `agents/openai.yaml` sidecar (`policy.allow_implicit_invocation`, MCP dependencies) | `disable-model-invocation`, `user-invocable`, `argument-hint`, `context` (VS Code) |
| Body size | Under 500 lines, under 5000 tokens recommended | Under 500 lines | "Keep SKILL.md concise" | Not stated |
| Supporting files | `scripts/`, `references/`, `assets/`, one level deep | Same idea. Reference the files from `SKILL.md`. | `references/`, `assets/`, `scripts/` | Loaded "only when the instructions reference them" |
| Validator | `skills-ref validate` | `claude plugin validate` checks frontmatter | none found | none found |

The Claude Code docs state: "Claude Code skills follow the Agent Skills open
standard" (S7).

---

## 6. Native automatic skill discovery

| Provider / surface | Automatic invocation | Metadata context budget | Status | Source |
|---|---|---|---|---|
| Claude Code | By default "Claude can load it automatically when relevant", based on `description`. It can be disabled per skill with `disable-model-invocation: true`. | Listing budget is **1% of the context window**. On overflow, descriptions of the least-used skills are dropped. Each entry is capped at 1,536 characters. | SUPPORTED | S7 |
| Claude Code (plugin skills) | Plugin skills are "instructions Claude loads when relevant". Their names and descriptions are in context on every turn. | as above | SUPPORTED | S1 |
| Codex CLI / app / IDE extension | "Implicit: … Codex can select a skill when your task matches its description". Default `allow_implicit_invocation: true`. | Initial list ≤ **2% of the context window, or 8,000 characters** if unknown. Descriptions are shortened first, and skills may be omitted. | SUPPORTED | S12 |
| Codex (plugin skills) | "Describe the task, and ChatGPT chooses the installed tools". Bundled skills appear in a new session after install. | as above | SUPPORTED | S13 |
| Copilot CLI | "Copilot will decide when to use your skills based on your prompt and the skill's description." | Not stated | SUPPORTED. Budget **UNVERIFIED**. | S17 |
| VS Code Copilot | Name and description are matched to the request, then the body loads. "does not guarantee that it invokes a skill for every relevant prompt." | Not stated | SUPPORTED. Budget **UNVERIFIED**. | S19 |
| Copilot / VS Code: **plugin-bundled** skills specifically | Not stated explicitly. Plugin skills appear in the Configure Skills menu (S18). | — | **UNVERIFIED** | S18 |

Every provider documents **progressive disclosure**: metadata first, then the
body on activation, then supporting files on demand (S7, S12, S19, S24). No
provider guarantees that a skill will be triggered.

---

## 7. CLI and VS Code installation surfaces (summary)

| Surface | Native plugin install | Source |
|---|---|---|
| Claude Code CLI | SUPPORTED | S5 |
| Claude Code VS Code extension | SUPPORTED | S5 |
| Codex CLI | SUPPORTED | S13 |
| Codex IDE extension (VS Code) | **UNSUPPORTED** | S13 |
| Copilot CLI | SUPPORTED | S15 |
| VS Code + GitHub Copilot Chat (agent plugins) | SUPPORTED (maturity label UNVERIFIED) | S18 |
| Copilot cloud agent | SUPPORTED (declarative settings only) | S14 |

---

## 8. Answers to the Step 02 research questions

| # | Question | Answer |
|---|---|---|
| 1 | Which manifest files are required? | **Agent Plugins / Codex / Copilot (portable):** root `plugin.json` with `$schema` and `name` (S10, S15, S20). **Claude Code:** none required. `.claude-plugin/plugin.json` is optional, and the standard layout loads without it (S3). **Copilot legacy and VS Code** also read `.claude-plugin/plugin.json` (S15, S18). |
| 2 | Which manifest versions are supported? | Agent Plugins **1.0.0** is the only published schema (S22). Copilot CLI also claims 1.1.0 (S15), which is unconfirmed. Claude Code has no manifest version concept and ignores `$schema` (S3). |
| 3 | Which plugin directory structures are valid? | Portable: `plugin.json`, `skills/<name>/SKILL.md`, optional `mcp.json`, and reverse-domain extension directories (S20). Claude: `.claude-plugin/plugin.json` plus root-level component directories (S3). Both can coexist in one directory, but whether Claude Code tolerates a root `plugin.json` is **UNVERIFIED**. |
| 4 | How are skills discovered? | From the immediate children of `skills/` that contain `SKILL.md` (S3, S10, S15, S20). Model selection is driven by `name` + `description` (§6). |
| 5 | Which native marketplace files are required? | Claude: `.claude-plugin/marketplace.json` (S4). Copilot: any of four locations, including `.claude-plugin/marketplace.json` (S15). Codex: `.agents/plugins/marketplace.json`, or the legacy-compatible `.claude-plugin/marketplace.json` (S10). Agent Plugins defines **no** marketplace (S20). |
| 6 | How are plugins installed, updated, disabled, and removed? | See §1.4, §2.3, §3.2, and §3.3. Codex individual-plugin update and non-interactive install are **UNVERIFIED**. |
| 7 | Which features work in the CLI? | All three CLIs support marketplace add, install, enable/disable, and uninstall (Codex mostly through the interactive `/plugins` browser). |
| 8 | Which features work in VS Code? | Claude Code extension: full plugin management. Copilot Chat: agent plugins. **Codex extension: no plugins**, standalone skills only. |
| 9 | Is automatic skill invocation supported? | Yes, on every surface, and description-driven (§6). It is probabilistic: VS Code explicitly says it does not guarantee invocation. For Copilot and VS Code, auto-invocation of *plugin-bundled* skills specifically is UNVERIFIED. |
| 10 | Can one portable plugin package work across providers? | **Probably, with two manifests.** A root Agent Plugins `plugin.json` serves Codex, Copilot CLI, and VS Code. An additional `.claude-plugin/plugin.json` serves Claude Code. The shared `skills/` tree is the same for all. **This is not yet proven by an install test.** |
| 11 | Which provider-specific compatibility layers are necessary? | (a) `.claude-plugin/plugin.json` for Claude Code. (b) `.claude-plugin/marketplace.json` as the shared marketplace for Claude Code and Copilot, which Codex also reads. (c) A possible `.agents/plugins/marketplace.json` for Codex if the legacy file proves insufficient. (d) Optionally `agents/openai.yaml` per skill. Details are in [PLUGIN_FORMAT_DECISION.md](PLUGIN_FORMAT_DECISION.md). |
| 12 | Which capabilities remain unsupported or unverified? | UNSUPPORTED: plugins in the Codex IDE extension, and local plugins in Claude Code cloud sessions. UNVERIFIED: see the list below. |

### Consolidated UNVERIFIED list

| ID | Item | To be resolved in |
|---|---|---|
| U-01 | Claude Code behaviour when a root `plugin.json` (Agent Plugins) exists next to `.claude-plugin/plugin.json` | Step 05 / 06 (`claude plugin validate`, install) |
| U-02 | Codex handling of `.claude-plugin/marketplace.json` with string `source` values and no `policy` / `interface` | Step 07 |
| U-03 | Codex non-interactive plugin install and per-plugin update commands | Step 07 |
| U-04 | Which marketplace file locations VS Code reads from a repository marketplace | Step 08 |
| U-05 | Automatic invocation of plugin-bundled skills in Copilot CLI and VS Code | Step 08 / 10 |
| U-06 | Skill-listing context budget in Copilot CLI and VS Code | Step 10 |
| U-07 | Agent Plugins 1.1.0 existence and contents (Copilot CLI reference vs agent-plugins.org) | Re-check before Step 06 |
| U-08 | Official validation or eval tooling for Codex and Copilot | Step 05 / 10 |
| U-09 | Maturity label (preview or GA) of VS Code agent plugins | Step 08 |
| U-10 | How Codex, Copilot, and VS Code treat non-standard `SKILL.md` frontmatter fields (for example Claude's `when_to_use`) | Step 05 |
| U-11 | *(added Step 03)* Every provider resolves relative links from `SKILL.md` to plugin files outside the skill directory (`../../knowledge/…`) | Step 06–08 |
| U-12 | *(added Step 03)* `claude plugin eval` accepts eval cases kept outside the plugin root via `plugins:` paths | Step 05 / 10 |
| U-13 | *(added Step 03)* Codex, Copilot, and VS Code tolerate an unknown top-level plugin directory (`knowledge/`) | Step 06–08 |

### UNVERIFIED item status after Step 04 (local tests, see PROVIDER_COMPATIBILITY_MATRIX §7)

| ID | Status after Step 04 |
|---|---|
| U-01 | **Partly resolved.** Claude Code 2.1.270 validated (`--strict`) and installed a package with both manifests. Skill loading with both manifests is still untested (no skills yet). |
| U-02 | **Partly resolved.** Codex 0.160.1 lists the plugin from `.claude-plugin/marketplace.json` when no `.agents/` file exists. Moot for packaging, because D-013 ships a native Codex file. |
| U-03 | **Resolved for Codex CLI 0.160.1:** `codex plugin add <plugin>@<marketplace>` and `codex plugin remove` exist and worked. Per-plugin update is still untested. |
| U-04, U-05, U-06, U-08, U-09, U-10, U-11, U-12, U-13 | Unchanged (open) |
| U-07 | Unchanged. The official schema download (2026-10-14) is still 1.0.0. |
| **U-14 (new)** | Copilot CLI `plugin enable` / `disable` failed on runtime 1.0.68. Behaviour on 1.0.91 is untested. |

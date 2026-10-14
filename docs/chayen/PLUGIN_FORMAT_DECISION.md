# Plugin Format Decision (D-009)

| Field | Value |
|---|---|
| Decision ID | D-009 |
| Status | **ACCEPTED** in Step 04 (the user referred to "the approved packaging ADRs"). Amended by D-013 (K-03 is no longer conditional) and D-014 (name `codejadee-chayen-framework`). |
| Date | 2026-10-14 |
| Evidence | [PROVIDER_SPEC_RESEARCH.md](PROVIDER_SPEC_RESEARCH.md) (sources S1–S24), [PROVIDER_COMPATIBILITY_MATRIX.md](PROVIDER_COMPATIBILITY_MATRIX.md) |
| Refines | D-005 (single provider-neutral skill source) |
| Implemented in | Steps 04 (layout), 05 (validators), 06–08 (packaging and install tests) |

## 1. Context

- **Codex, Copilot CLI, and VS Code Copilot** read the portable
  **Agent Plugins 1.0** package: a root `plugin.json` with `$schema`, plus
  `skills/` (S10, S15, S18, S20).
- **Claude Code** documents only `.claude-plugin/plugin.json`, and treats that
  manifest as optional (S3). Its documentation does not mention Agent Plugins
  (S9).
- **Copilot CLI and VS Code** also accept `.claude-plugin/plugin.json` (S15, S18).
  Codex "also accepts legacy and Claude-compatible manifests" (S10).
- **`.claude-plugin/marketplace.json`** is read by Claude Code (S4), the Copilot
  CLI (S15), and Codex as "legacy-compatible" (S10). The Agent Plugins spec
  defines no marketplace (S20).
- All providers implement the Agent Skills `SKILL.md` format with
  description-driven automatic invocation and progressive disclosure
  (S7, S12, S17, S19, S24).

## 2. Options considered

| Option | Description | Assessment |
|---|---|---|
| A | Agent Plugins root `plugin.json` only | Native for Codex, Copilot, and VS Code. Claude Code would load the package only through its manifest-less standard layout, which is **undocumented for this case** (U-01). Too risky as the only path. |
| B | Claude format `.claude-plugin/plugin.json` only | Native for Claude Code. Accepted by Copilot (legacy) and VS Code. Codex accepts it but says "new packages should use" Agent Plugins. Works today, but bets on legacy paths. |
| **C** | **Dual manifest: Agent Plugins root `plugin.json` plus `.claude-plugin/plugin.json`, over one shared `skills/` tree** | Each provider gets its preferred format. Copilot documents that the root Agent Plugins manifest takes precedence (S15). The Claude-format manifest also gives Codex a fallback. Cost: two small static JSON files whose shared fields must stay identical. **Recommended.** |
| D | A separate package per provider | Duplicated skill content and drift risk. Contradicts D-005. Rejected. |

## 3. Decision (proposed)

Adopt **Option C**, with **Option B as the documented fallback** if install
testing shows that Claude Code rejects or mis-handles a root `plugin.json`
(U-01).

### 3.1 Repository layout

```text
<repo root>                               ← marketplace root
├── .claude-plugin/
│   └── marketplace.json                  ← shared marketplace (Claude Code, Copilot CLI; Codex legacy-compatible)
├── .agents/plugins/marketplace.json      ← CONDITIONAL: add only if Step 07 proves Codex needs its native format (U-02)
├── plugins/
│   └── <plugin-name>/                    ← the only directory shipped to users
│       ├── plugin.json                   ← Agent Plugins 1.0 manifest (Codex, Copilot CLI, VS Code)
│       ├── .claude-plugin/
│       │   └── plugin.json               ← Claude Code manifest
│       └── skills/
│           └── <skill-name>/
│               ├── SKILL.md
│               └── references/*.md       ← loaded on demand
├── docs/chayen/                          ← governance (not shipped)
└── tests/ …                              ← validation (not shipped; Step 05)
```

**Rationale for a `plugins/<plugin-name>/` subdirectory.** A plugin is copied
into provider caches (S6, S15). Keeping governance docs and tests outside the
plugin directory keeps them out of users' installs and out of the model's
reach.

### 3.2 Manifest rules

| Rule | Detail | Basis |
|---|---|---|
| M-01 | The root `plugin.json` contains **only** schema-defined fields: `$schema` = `https://agent-plugins.org/schemas/1.0.0/plugin.schema.json`, plus `name`, `version`, `description`, `author`, `homepage`, `repository`, `license`, `keywords`. | The S21 schema is closed (`additionalProperties: false`). |
| M-02 | `.claude-plugin/plugin.json` carries the same `name`, `version`, `description`, `author`, `homepage`, `repository`, `license`, and `keywords`. | S3 |
| M-03 | Neither manifest declares component paths. Skills are found through the default `skills/` scan. | S3, S10, S20 |
| M-04 | Shared fields must be identical in both manifests. The Step 05 validator enforces this. | Drift prevention |
| M-05 | `version` is explicit semver and changes on every release. Claude Code pins to `version` (S3, S6), and Copilot's legacy format expects semver (S15). | S3, S6, S15 |
| M-06 | The plugin `name` satisfies every provider's rules: lowercase kebab-case, `a-z0-9-`, ≤64 characters, no dots, and no `claude-`/`anthropic-` prefix. | S3, S15, S18, S21 |
| M-07 | The marketplace entry `name` equals the manifest `name`. | S2 |

### 3.3 Marketplace rules

| Rule | Detail | Basis |
|---|---|---|
| K-01 | One `.claude-plugin/marketplace.json` with `name`, `owner.name`, `description`, and `plugins[]`. The entry uses `"source": "./plugins/<plugin-name>"`. | S4, S15 |
| K-02 | The marketplace `name` is kebab-case and avoids every reserved name in S4. | S4 |
| K-03 | Add `.agents/plugins/marketplace.json` (native Codex shape: `interface.displayName`, `source:{source:"local",path}`, `policy`, `category`) **only if** U-02 testing fails. Record it as a new decision. | S10 |
| K-04 | No submission to a public directory (Anthropic directory, `awesome-copilot`, OpenAI submission) without explicit approval. | BC-31 |

### 3.4 Skill format rules (portable subset)

| Rule | Detail | Basis |
|---|---|---|
| F-01 | Frontmatter uses **only** Agent Skills standard fields: `name` and `description` (required), and `license` and `metadata` (optional). | S24. Unknown-field handling is UNVERIFIED for Codex and Copilot (U-10). |
| F-02 | `name` is ≤64 characters, `a-z0-9-`, with no leading, trailing, or double hyphens, and **equals the directory name**. | S19, S24 |
| F-03 | `description` is ≤1024 characters, states what the skill does and when to use it, and puts the key trigger terms first. | S7, S17, S19, S24 |
| F-04 | The `SKILL.md` body is under 500 lines. Detail goes in `references/` files linked one level deep from `SKILL.md`. | S7, S24 |
| F-05 | Skill names are collision-resistant, because Copilot drops a plugin skill silently when a same-named project or personal skill exists (S15). The convention is fixed in Step 04. | S15 |
| F-06 | The number of skills is bounded by the smallest documented listing budget (Codex: 2% of the context window or 8,000 characters, S12; Claude Code: 1%, S7). The exact budget is set in Step 04. | S7, S12 |

### 3.5 Components deliberately excluded

The plugin ships **no** hooks, agents, commands, MCP servers, LSP servers,
`bin/` executables, scripts, or `agents/openai.yaml` sidecars.

- Agent Plugins v1 covers only skills and MCP, so anything else is
  provider-specific (S20).
- No always-on behaviour (D-007, REQ-04).
- No mandatory MCP (EX-07), and no runtime dependencies (BC-22, D-004).
- Implicit invocation is already on by default in Codex (S12).

Adding any of these requires a new decision record.

## 4. Consequences

| Area | Consequence |
|---|---|
| Claude Code | Installs from the shared marketplace. Third-party marketplace auto-update is off by default (S5), so the install docs must cover `claude plugin update`. |
| Codex CLI / app | Installs through `codex plugin marketplace add` plus the `/plugins` browser (S10, S13). |
| **Codex IDE extension** | **No native plugin path exists (S13).** REQ-01 can't be met there. A user decision is required (ISSUES Q-02). |
| Copilot CLI | Installs through `copilot plugin marketplace add` / `copilot plugin install` (S15). |
| VS Code Copilot | Installs through the `chat.plugins.marketplaces` setting or Install From Source (S18). |
| Testing | `claude plugin validate --strict` and `claude plugin eval` are available for Claude Code (S3, S8). The other providers need scripted CLI smoke tests (R-07). |
| Validator (Step 05) | Must check: the root `plugin.json` against the S21 schema, the M-04 field parity, the F-01..F-04 frontmatter rules, and the absence of the components in §3.5. |

## 5. Verification required before this decision is ACCEPTED

| Check | Unverified item | Step |
|---|---|---|
| `claude plugin validate --strict` on a package with both manifests | U-01 | 05 / 06 |
| Claude Code install from `.claude-plugin/marketplace.json`, with skills listed | U-01 | 06 |
| Codex marketplace add from the Claude-format marketplace file, then `/plugins` install | U-02, U-03 | 07 |
| Copilot CLI install, with the root manifest taking precedence | — | 08 |
| VS Code Copilot install from the repository marketplace | U-04, U-09 | 08 |
| Plugin skills auto-invoked from ordinary prompts on each surface | U-05 | 10 |

If any check fails, the fallback (Option B) or the conditional K-03 applies.
Each change is recorded as a new decision. None is applied silently.

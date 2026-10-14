# Plugin Package Design

| Field | Value |
|---|---|
| Version | 0.1 (Step 03) |
| Date | 2026-10-14 |
| Status | **PROPOSED**: awaiting user review |
| Parent | [ARCHITECTURE.md](ARCHITECTURE.md) |
| Format basis | [PLUGIN_FORMAT_DECISION.md](PLUGIN_FORMAT_DECISION.md) (D-009), ADR-0006, ADR-0008 |

This document fixes the **physical layout** that later steps implement. It
creates nothing. The JSON and Markdown shown here are illustrative
specifications, not files.

Working names (Q-03 pending): plugin `codejadee-chayen`, marketplace
`codejadee`, skill prefix `chayen-`.

> **Step 04 amendments.** As implemented, the plugin identifier and its
> directory are `codejadee-chayen-framework` (D-014). Read every
> `codejadee-chayen` below as that name.
>
> The repository also ships `.github/plugin/marketplace.json` (Copilot) and
> `.agents/plugins/marketplace.json` (Codex) next to
> `.claude-plugin/marketplace.json` (D-013). This amends RH-02 and K-03.
>
> The developer validator is `tools/validate/validate-package.mjs`. It
> implements V-01..V-05, V-09, and V-13 so far.

> **Step 07 amendments (D-021, D-022).**
>
> - The catalog is the single file `catalog/engineering-capabilities.yaml`,
>   which replaces the `schema/`, `domains.json`, and `capabilities/` layout
>   in §1.
> - V-11 is implemented in `tools/catalog/check-catalog.mjs`, not by a JSON
>   Schema.
> - V-11 accepts **planned** entry skills and recipes when they are labelled
>   `planned`. It requires `existing` to match the files on disk.

---

## 1. Repository structure

```text
codejadee-chayen-framework/                 ← Git repo = marketplace root (C-14)
├── .claude-plugin/
│   └── marketplace.json                    ← C-02/C-14 shared marketplace catalog
├── plugins/
│   └── codejadee-chayen/                   ← C-01 the ONLY shipped directory (see §2)
├── catalog/                                ← C-03 developer-side capability catalog
│   ├── schema/catalog.schema.json
│   ├── domains.json
│   └── capabilities/<domain-id>.json
├── tools/
│   ├── validate/                           ← C-12 developer-only validators
│   └── package/                            ← CONDITIONAL: only if §6.2 is triggered
├── tests/                                  ← C-13
│   ├── validators/                         ← good/bad fixtures for C-12
│   ├── fixtures/repos/<stack>-<variant>/   ← sample repositories
│   ├── evals/{cases,claude,adapters}/
│   └── compat/<provider>-<surface>/        ← lifecycle procedures + recorded transcripts
├── docs/chayen/                            ← governance, architecture, ADRS/
├── .github/workflows/ci.yml                ← runs C-12 (+ provider validators when installed)
├── CHANGELOG.md
├── LICENSE                                 ← pending Q-05
├── README.md                               ← install instructions per provider (Step 21)
└── SECURITY.md                             ← vulnerability reporting (later step)
```

### 1.1 Repository hygiene rules

These prevent providers from misreading the repository itself as a plugin or
marketplace.

| ID | Rule | Reason |
|---|---|---|
| RH-01 | No `plugin.json` at the repo root. | Copilot checks a root `plugin.json` for `OWNER/REPO` installs (S15). |
| RH-02 | No root `marketplace.json`, `.plugin/`, `.github/plugin/`, or `.agents/plugins/` unless decided (K-03). | Copilot checks those locations before `.claude-plugin/` (S15). |
| RH-03 | No `.claude/skills/`, `.github/skills/`, or `.agents/skills/` in this repo. | These would load Chayen's skills into contributors' own sessions as project skills, and shadow the plugin copy (S7, S15, S17). |
| RH-04 | `docs/`, `catalog/`, `tools/`, and `tests/` never sit inside `plugins/`. | Provider caches copy the plugin directory (S6, S15). |

---

## 2. Plugin package (C-01)

```text
plugins/codejadee-chayen/
├── plugin.json                         ← Agent Plugins 1.0 manifest
├── .claude-plugin/
│   └── plugin.json                     ← Claude Code manifest
├── skills/                             ← C-04, ≤14 entry skills
│   └── chayen-<intent>/
│       └── SKILL.md
├── knowledge/                          ← shared, single canonical copy
│   ├── core/
│   │   ├── applicability.md            ← C-06 precedence + gate rules
│   │   └── evidence-rules.md           ← C-10 what counts as evidence
│   ├── stacks/<pack-id>/               ← C-05
│   │   ├── INDEX.md
│   │   └── <topic>.md
│   ├── workflows/<workflow-id>.md      ← C-08
│   ├── templates/                      ← C-09, C-10
│   │   ├── task-contract.md
│   │   ├── evidence-record.md
│   │   └── change-passport.md
│   └── security/<topic>.md             ← C-11
├── README.md                           ← human-facing summary (not loaded by providers)
└── LICENSE
```

**Allowed file types:** `.md` and `.json` only. Validator V-09 rejects
everything else, including scripts, binaries, `package.json`, `hooks/`,
`agents/`, `commands/`, `.mcp.json`, `mcp.json`, `bin/`, `.lsp.json`, and
`agents/openai.yaml`.

**Naming:** directories and files are lowercase kebab-case. Topic files are
named after the capability area, not after capability IDs. For example,
`api-endpoints.md`, not `CAP-API-001.md`.

---

## 3. Manifests (C-02)

### 3.1 `plugins/codejadee-chayen/plugin.json` (Agent Plugins 1.0)

```json
{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
  "name": "codejadee-chayen",
  "version": "0.1.0",
  "description": "Technology-aware software engineering skills for .NET, Angular, SQL Server and modern web stacks.",
  "author": { "name": "CodeJaDee" },
  "homepage": "https://github.com/CodeJaDee/codejadee-chayen-framework",
  "repository": "https://github.com/CodeJaDee/codejadee-chayen-framework",
  "license": "<SPDX id, pending Q-05>",
  "keywords": ["engineering", "dotnet", "angular", "sql-server"]
}
```

These are only the fields the closed schema allows (S21). The schema has no
component path fields.

### 3.2 `plugins/codejadee-chayen/.claude-plugin/plugin.json`

This file has the **same** `name`, `version`, `description`, `author`,
`homepage`, `repository`, `license`, and `keywords` as §3.1 (M-02, M-04). It
omits `$schema` (Claude ignores it, S3) and has no component keys (M-03).

### 3.3 `.claude-plugin/marketplace.json` (repo root)

```json
{
  "name": "codejadee",
  "description": "CodeJaDee engineering plugins",
  "owner": { "name": "CodeJaDee" },
  "plugins": [
    {
      "name": "codejadee-chayen",
      "source": "./plugins/codejadee-chayen",
      "description": "Technology-aware software engineering skills."
    }
  ]
}
```

- No `version` in the entry. The manifest's `version` wins (S4), and repeating
  it here would trigger a validation warning.
- `strict` is left at its default.

---

## 4. Entry skill anatomy (C-04, C-06)

```markdown
---
name: chayen-feature-delivery
description: <≤280 chars: what it does + when to use + key stack terms + "Not for …" boundary>
---

# <Title>

## When this applies
- Applies when: …
- Does not apply when: …   → stop following this skill; continue normally.

## Precedence
User instructions > repo instruction files > observed repo conventions > this guidance.

## Procedure
1. Detect stack and version (see routing table) and existing conventions.
2. Decide proportionality: trivial → act directly; otherwise draft a task contract
   ([template](../../knowledge/templates/task-contract.md)).
3. Follow the workflow: [feature-delivery](../../knowledge/workflows/feature-delivery.md).
4. Verify with the project's own build/test/lint commands.
5. Report using the [evidence record](../../knowledge/templates/evidence-record.md).

## Routing
| Detected | Load |
|---|---|
| `*.csproj` with ASP.NET Core | [dotnet-aspnetcore](../../knowledge/stacks/dotnet-aspnetcore/INDEX.md) |
| `angular.json` | [angular](../../knowledge/stacks/angular/INDEX.md) |
| … | … |
| none of the above | [generic, convention-first](../../knowledge/core/applicability.md) |
```

### 4.1 Authoring rules

| ID | Rule | Validator |
|---|---|---|
| SK-01 | Frontmatter contains only `name`, `description`, and optionally `license` and `metadata` (F-01). | V-05 |
| SK-02 | `name` equals the directory name, matches `^chayen-[a-z0-9]+(-[a-z0-9]+)*$`, and is ≤64 characters (F-02, F-05). | V-05 |
| SK-03 | `description` is ≤1024 characters (hard), ≤280 (target, warning), and contains a "Not for" boundary clause. | V-05, V-07 |
| SK-04 | Body is ≤300 lines. The first section is the applicability gate. | V-06 |
| SK-05 | Provider-neutral wording (P-01). No `${CLAUDE_PLUGIN_ROOT}`, and no provider tool names. | V-10 |
| SK-06 | No instruction tells the model to mention or advertise Chayen. | V-10 |

---

## 5. Knowledge file anatomy

| File kind | Required sections | Line budget |
|---|---|---|
| Pack `INDEX.md` | Detection signals · Supported versions · Detect-existing-conventions checklist · Topic table (file · covers · load when) · See also (≤3 pack INDEX links) | ≤80 |
| Topic `<topic>.md` | Applies to (versions) · Check repository conventions first · Guidance · Verification commands · Pitfalls · See also | ≤300 |
| Workflow | Purpose · Entry criteria · Phases (inputs, steps, knowledge links, exit check) · Approval gates · Required evidence · Proportionality | ≤200 |
| Template | Purpose · When to use / skip · Fill-in structure · Example (short) | ≤200 |
| Security topic | Scope · Advisory statement · Guidance · Real controls to use (provider and CI) · Verification | ≤300 |

**Placeholder ban:** a file that contains `TODO`, `TBD`, `lorem`, or an empty
required section fails V-12, and cannot count toward IMPLEMENTED (BC-14).

---

## 6. Packaging process

### 6.1 Default: no build step

The committed `plugins/codejadee-chayen/` directory **is** the distributable
artifact. Users' providers fetch it from Git through the marketplace's
relative-path source (S4, S15).

- There is no generation, bundling, or compilation.
- Release = validators pass + version bump in both manifests + changelog +
  tag.

### 6.2 Conditional developer-side generation

This applies only if a verification fails. It is triggered per item, and
each trigger needs its own decision record before it is used.

| Trigger | Generated output | Generator behaviour |
|---|---|---|
| U-11 fails (links outside the skill directory don't resolve) | A copy of each skill with the knowledge files it links to vendored into `skills/<s>/references/`, and links rewritten | Reads the canonical `knowledge/`. Writes the **committed** directory `dist/plugins/codejadee-chayen/`. The marketplace `source` switches to `./dist/plugins/codejadee-chayen`. |
| U-02 fails (Codex needs its native marketplace) | `.agents/plugins/marketplace.json` derived from `.claude-plugin/marketplace.json` | Field mapping per S10 (`interface.displayName`, `source:{source:"local",path}`, `policy.installation: "AVAILABLE"`) |
| U-01 fails (Claude rejects a root `plugin.json`) | Nothing generated. The root `plugin.json` is removed (D-009 Option B). | — |
| U-13 fails (unknown top-level directory rejected) | Same as the U-11 row: knowledge vendored under `skills/` | as above |

**Properties required of any generator:**

| ID | Property |
|---|---|
| PG-01 | Developer-side only, in `tools/package/`. Users never run it, and the plugin never references it. |
| PG-02 | Deterministic: the same input produces byte-identical output. |
| PG-03 | Its output is committed, so marketplaces keep serving plain files from Git. Users need no build. |
| PG-04 | CI regenerates and fails on any diff (stale-artifact check, V-15). |
| PG-05 | Canonical content is edited only in the source tree. Generated files carry a header saying "generated, do not edit". |
| PG-06 | Each third-party package it needs requires a decision record (BC-22). |

---

## 7. Validators (C-12)

| ID | Check | Rule refs |
|---|---|---|
| V-01 | `marketplace.json` has the required fields, a non-reserved kebab-case name, relative sources starting with `./` with no `..`, and an entry name equal to the manifest name. | K-01, K-02, M-07 |
| V-02 | The root `plugin.json` validates against the Agent Plugins 1.0.0 schema (S21), with no extra fields. | M-01 |
| V-03 | `.claude-plugin/plugin.json` has valid fields, no component keys, and a non-reserved name (S3). | M-02, M-03, M-06 |
| V-04 | Shared fields are identical across both manifests. `version` is semver. | M-04, M-05 |
| V-05 | `SKILL.md` frontmatter follows SK-01..SK-03 and F-01..F-03. | F-01..F-03, SK-01..SK-03 |
| V-06 | Line budgets (§5, SK-04). | F-04, C-07 |
| V-07 | L0 metadata total ≤4,000 characters. ≤14 entry skills. Per-description target 280 (warning). | F-06, ARCH §8 |
| V-08 | Links: every link resolves inside the plugin root, ≤2 hops from `SKILL.md`, no cycles, and DR-01..DR-07 hold. | DR-01..DR-07 |
| V-09 | Only `.md` and `.json` files in the plugin. No forbidden components (§2). | ADR-0005, EX-01..EX-07 |
| V-10 | Forbidden wording: enforcement claims ("guarantees", "enforces", "prevents all", "secure" with no qualifier) in security content; provider-specific tokens (P-01); self-advertising (SK-06). | D-003, SK-05, SK-06 |
| V-11 | The catalog validates against its schema. Counts are 20 domains and 206 capabilities. Every capability maps to one existing entry skill and existing knowledge paths. | REQ-05, C-03 |
| V-12 | Placeholder ban (§5). | BC-14 |
| V-13 | Repository hygiene RH-01..RH-04. | §1.1 |
| V-14 | The release `version` matches the latest `CHANGELOG.md` heading and, on tag builds, the tag. | M-05 |
| V-15 | Generated artifacts are up to date (only when §6.2 is active). | PG-04 |
| X-01 | `claude plugin validate --strict` on the plugin and on the marketplace, when the CLI is available (S3). | external |
| X-02 | `skills-ref validate` on each skill, when available (S24). | external |

---

## 8. Versioning and release

| ID | Rule |
|---|---|
| RV-01 | Semver: MAJOR for removing or renaming entry skills or a breaking structural change; MINOR for new skills, packs, or capabilities; PATCH for content fixes. |
| RV-02 | The version is bumped in both manifests in the same commit (V-04). |
| RV-03 | Tag `vX.Y.Z` on the release commit. Users can pin with `owner/repo#vX.Y.Z` (S5) or `ref`/`sha` sources. |
| RV-04 | Third-party marketplace auto-update is off by default in Claude Code (S5). Release notes tell users how to update on each provider. |
| RV-05 | Commits, tags, pushes, and releases happen **only with explicit user approval** (BC-30). |

---

## 9. Distribution flows per provider

These are the native commands only. Any surface marked UNVERIFIED in
[PROVIDER_COMPATIBILITY_MATRIX.md](PROVIDER_COMPATIBILITY_MATRIX.md) is
confirmed in Steps 06–08.

| Surface | Add marketplace | Install | Source |
|---|---|---|---|
| Claude Code CLI | `claude plugin marketplace add CodeJaDee/codejadee-chayen-framework` | `claude plugin install codejadee-chayen@codejadee` | S2, S5 |
| Claude Code VS Code | `/plugins` → Marketplaces tab | `/plugins` → Install | S5 |
| Codex CLI | `codex plugin marketplace add CodeJaDee/codejadee-chayen-framework` | `/plugins` browser | S10, S13 |
| Copilot CLI | `copilot plugin marketplace add CodeJaDee/codejadee-chayen-framework` | `copilot plugin install codejadee-chayen@codejadee` | S15 |
| VS Code Copilot Chat | `chat.plugins.marketplaces` setting | Extensions view `@agentPlugins` → Install | S18 |
| Codex IDE extension | — | **UNSUPPORTED** (S13). See ISSUES Q-02. | S13 |

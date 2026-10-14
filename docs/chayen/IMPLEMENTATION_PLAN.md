# Implementation Plan

Each user prompt executes **one** step ([BUILD_CONTRACT.md](BUILD_CONTRACT.md) BC-01).
Later steps may be refined after review. Steps 02 and 03 in particular may
change the shape of the steps after them. Any re-plan is recorded in
[DECISIONS.md](DECISIONS.md).

## Step overview

| Step | Title | Main outputs | Requirements | Status |
|---|---|---|---|---|
| 01 | Governance baseline | `docs/chayen/*` (7 governance docs) | GOV-01..GOV-07 | DONE (pending review) |
| 02 | Provider capability research | `PROVIDER_SPEC_RESEARCH.md`, `PROVIDER_COMPATIBILITY_MATRIX.md`, `PLUGIN_FORMAT_DECISION.md` (outputs changed by the user's Step 02 prompt, see D-009) | REQ-01, REQ-02, REQ-06, REQ-10 | DONE (pending review) |
| 03 | Architecture design (re-planned by the user's Step 03 prompt, see D-010) | `ARCHITECTURE.md`, `PLUGIN_PACKAGE_DESIGN.md`, `ADRS/` (ADR-0001..0008) | REQ-01..REQ-10 (design level) | DONE (pending review) |
| 04 | Minimal native plugin package (re-planned by the user's Step 04 prompt, see D-012) | `plugins/codejadee-chayen-framework/` (both manifests, canonical `skills/`), three native marketplace files, `tools/validate/validate-package.mjs` | REQ-01, PRV-*, ARC-01, ARC-02, ARC-14 | DONE (pending review) |
| 05 | Pilot entry skills (as executed, D-015) | 6 skills in `plugins/codejadee-chayen-framework/skills/` with 16 skill-local references; `tests/skills/trigger-cases.json` (48 cases); generated Claude eval cases; validator V-06..V-17 subset | REQ-02..REQ-04, REQ-06..REQ-10, ARC-04..ARC-13 | DONE (pending review) |
| 06 | Native behaviour proof of concept (as executed) | `tests/provider-compatibility/` (lifecycle script, VS Code procedures, results), `tests/routing/` (smoke runner, results), `docs/chayen/POC_REPORT.md`; eval staging fix | REQ-01..REQ-04, REQ-10, PRV-* | DONE (pending review) |
| — | Capability catalog and authoring guide (*unscheduled*, formerly Step 04) | `catalog/` (schema, `domains.json`, `capabilities/*.json` per ARCHITECTURE C-03), `docs/chayen/AUTHORING_GUIDE.md`, final entry-skill set | REQ-05, STK-* | NOT_STARTED |
| 05 | Structural validation suite | Dev-only validator, test fixtures, CI workflow | REQ-10 | NOT_STARTED |
| 06 | Claude Code packaging | Plugin + marketplace manifests, install evidence | REQ-01, PRV-CC | NOT_STARTED |
| 07 | OpenAI Codex packaging | Codex manifests, install evidence | REQ-01, PRV-CX | NOT_STARTED |
| 08 | GitHub Copilot packaging | Copilot manifests, install evidence | REQ-01, PRV-GH | NOT_STARTED |
| 09 | Cross-cutting foundation skills | Convention discovery, verification, security skills | REQ-07, REQ-08, REQ-09 | NOT_STARTED |
| 10 | Trigger evaluation harness | Positive and negative prompt suites per provider | REQ-02, REQ-03, REQ-04 | NOT_STARTED |
| 11 | Primary stack: ASP.NET Core Web API | Skills + references | STK-01 | NOT_STARTED |
| 12 | Primary stack: Angular / TypeScript | Skills + references | STK-02 | NOT_STARTED |
| 13 | Primary stack: SQL Server | Skills + references | STK-03 | NOT_STARTED |
| 14 | Additional stack: JS/TS, React, Next.js | Skills + references | STK-04..STK-06 | NOT_STARTED |
| 15 | Additional stack: Vue, Nuxt, Vite | Skills + references | STK-07..STK-09 | NOT_STARTED |
| 16 | Additional stack: Nitro, Elysia | Skills + references | STK-10, STK-11 | NOT_STARTED |
| 17 | Additional stack: Python, PostgreSQL | Skills + references | STK-12, STK-13 | NOT_STARTED |
| 18 | Remaining domain capabilities | Close catalog gaps up to 206 / 20 | REQ-05 | NOT_STARTED |
| 19 | Optional extension: Java | Skills + references (if approved) | STK-14 | NOT_STARTED |
| 20 | Provider compatibility and regression run | Full test run, results recorded | REQ-10, all | NOT_STARTED |
| 21 | User documentation | README, per-provider install guides, contributing guide | REQ-01, GOV-* | NOT_STARTED |
| 22 | Release readiness review | Readiness report. **No publishing without approval** | All | NOT_STARTED |

## Step details

### Step 01 — Governance baseline
Inspect the repository and create the charter, build contract, plan, progress
log, decisions, acceptance matrix, and issues register. No product code.

### Step 02 — Provider capability research
For Claude Code, OpenAI Codex, and GitHub Copilot, verify against **official
documentation** (with URL and access date) the following:

- plugin manifest format and location
- marketplace or registry mechanism (self-hosted Git marketplace or a central
  listing)
- install, update, and uninstall lifecycle
- skill format (`SKILL.md` frontmatter fields, length limits) and discovery
  rules
- progressive disclosure behaviour and context budget for skill metadata
- supported surfaces (CLI, IDE, cloud agent)
- available test tooling (for example, Claude Code plugin evals)

Output (as executed): `PROVIDER_SPEC_RESEARCH.md`,
`PROVIDER_COMPATIBILITY_MATRIX.md`, and `PLUGIN_FORMAT_DECISION.md`. Any provider without an official plugin
mechanism gets a recorded fallback decision (see ISSUE Q-02). Every assumption
A-01..A-06 in [DECISIONS.md](DECISIONS.md) is confirmed or revised.

### Step 03 — Architecture design (as executed)
Covers:

- the 14 components C-01..C-14;
- the repository and plugin package layout;
- dependency rules and trust boundaries;
- budgets;
- ADR-0001..ADR-0008.

This absorbed the layout, mapping-strategy, naming, budget, and
reference-structure items originally planned for Step 04. See
[ARCHITECTURE.md](ARCHITECTURE.md) and
[PLUGIN_PACKAGE_DESIGN.md](PLUGIN_PACKAGE_DESIGN.md).

### Step 04 — Minimal native plugin package (as executed)
Created:

- the plugin directory, with the Agent Plugins and Claude manifests and the
  canonical `skills/` source (no skills yet);
- one native marketplace file per provider (D-013);
- a zero-dependency developer validator.

Validated with:

- the official Agent Plugins schema;
- `claude plugin validate --strict`;
- isolated local install tests on the Claude Code, Codex, and Copilot CLIs.

Steps 06–08 now focus on remote (GitHub) marketplace installs and skill-load
verification on each surface.

### (Unscheduled) Capability catalog and authoring guide
- Define the **20 domains** and **206 capabilities** as `catalog/` JSON, per
  ARCHITECTURE C-03. Each capability gets:
  - an ID (`CAP-<domain>-<nnn>`)
  - a one-line intent
  - applicable stacks
  - exactly one entry skill
  - knowledge paths
  - a verification approach
- Finalise the entry-skill set (≤14, ADR-0004).
- Write `AUTHORING_GUIDE.md`: description-writing rules, file anatomies, and
  wording rules (P-01, SK-01..SK-06).
- The user must approve the catalog before content authoring begins. Approval
  resolves Q-01.

### Step 05 — Structural validation suite
A development-only validator (the language is chosen through a decision
record; zero runtime dependencies for the shipped plugin). It checks:

- manifest schema validity per provider
- `SKILL.md` frontmatter presence and limits
- unique skill names
- broken relative links
- reference files that are reachable from their skill
- size budgets
- catalog-to-skill coverage
- forbidden claims (for example, "enforces" / "guarantees" wording in
  security skills)

Plus a CI workflow. The validator is tested against good and bad fixtures.

### Steps 06–08 — Provider packaging
Create native manifests for each provider from the shared source. Install
through the native mechanism in a clean environment and record the evidence
(commands and output). Publishing to any public marketplace is **not** part of
these steps.

### Step 09 — Cross-cutting foundation skills
- **Repository convention discovery:** detect the existing architecture,
  naming, test framework, and lint/format tooling before advising.
- **Evidence-driven verification:** run builds, tests, and linters, cite
  output, and never claim success without evidence.
- **Security guidance:** OWASP-aligned advice, explicitly advisory, pointing
  to real enforcement (CI scanners, provider permissions, hooks) where it
  exists.

### Step 10 — Trigger evaluation harness
Prompt suites per skill:

- **positive:** ordinary prompts that should trigger the skill
- **negative:** unrelated prompts that should not trigger anything, verifying
  native behaviour (REQ-04)
- **no-invocation:** prompts that never mention Chayen (REQ-03)

Uses provider-native eval tooling where it exists. Otherwise, documented
manual or scripted runs with recorded transcripts.

### Steps 11–19 — Capability content
Author the skills and references per the approved catalog. Each step updates
the acceptance matrix and adds trigger tests for its new skills.

### Step 20 — Compatibility and regression run
Run all automated suites against all supported providers and record the
results. Failures are logged in [ISSUES.md](ISSUES.md).

### Step 21 — User documentation
README, per-provider native install, update, and uninstall instructions,
troubleshooting, and a contribution guide.

### Step 22 — Release readiness review
Audit the acceptance matrix, licence, versioning, and changelog. Produce a
go/no-go report. **Commit, tag, push, and marketplace submission happen only
on explicit user approval.**

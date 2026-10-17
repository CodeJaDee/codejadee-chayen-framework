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
| 07 | Engineering capability catalog (as executed) | `catalog/engineering-capabilities.yaml` (206 records, 20 domains; D-021), `docs/chayen/CAPABILITY_COVERAGE.md`, `tools/catalog/check-catalog.mjs` (V-11 count, uniqueness, and mapping check) | REQ-05, ARC-03, STK-* (mapping level) | DONE (pending review) |
| 08 | Skill authoring standard and quality gates (as executed) | `docs/chayen/SKILL_AUTHORING_STANDARD.md`, `docs/chayen/SKILL_QUALITY_GATES.md` (D-025), validators V-17..V-22 in `tools/validate/`, `tests/catalog/`, `tests/skills/` (recipe cases, mutation suites), pilot skills brought to the standard, recipes re-pointed (D-026) | REQ-02..REQ-10 (content quality), ARC-04, ARC-06, ARC-12, ARC-13 | DONE (pending review) |
| 09 | Domains 01 and 02 capabilities (as executed) | `chayen-repository` extended with 5 recipes (D01 9/9); new `chayen-requirements` with 5 recipes and a requirements-record template (D02 10/10); 38 recipe cases; 10 trigger cases (D-027, D-028) | REQ-05 (D01, D02), REQ-02..REQ-04, REQ-07, REQ-08 | DONE (pending review) |
| 10 | Domains 03 and 04 capabilities (as executed) | New `chayen-architecture` (8 recipes, styles checklist; D03 10/10, D04 migration, rollout, and decision register); `task-contract.md` risk classes and status; estimation in `scope-and-backlog.md`; 28 recipe cases; 9 trigger cases (D-029, D-030) | REQ-05 (D03, D04), REQ-02..REQ-04, REQ-07, REQ-08 | DONE (pending review) |
| 11 | Domains 05 and 06 capabilities (as executed) | `chayen-implementation` extended with 10 recipes (D05 12/12; upgrades remapped, D-031); `chayen-backend` extended with 7 recipes (D06 10/10); 44 recipe cases; 9 trigger cases | REQ-05 (D05, D06), REQ-02..REQ-04, REQ-07, REQ-08, STK-01..STK-13 | DONE (pending review) |
| 12 | Domains 07 and 08 capabilities (as executed) | `chayen-frontend` rebuilt as a router with 11 recipes, an `app-shells.md` technology reference, and a `ui-states.md` checklist (D07 10/10; D08 8/8 for web-technology shells, D-032); CG-27 split (CG-57); 44 recipe cases; 9 trigger cases | REQ-05 (D07, D08), REQ-02..REQ-04, REQ-07, REQ-08, STK-02, STK-04..STK-09 | DONE (pending review) |
| 13 | Domains 09 and 10 capabilities (as executed) | New `chayen-data` skill (user-approved, D-033) with 8 recipes, 2 engine references, and a database safety checklist (D09 12/12); `chayen-testing` rebuilt as a router with 7 recipes and a six-state result vocabulary (D10 14/14); 58 recipe cases; 12 trigger cases | REQ-05 (D09, D10), REQ-02..REQ-04, REQ-07..REQ-09, STK-03, STK-13 | DONE (pending review) |
| 14 | Domains 11 and 12 capabilities (as executed) | `chayen-security` rebuilt as a router with 8 recipes, CAP-11-013 remapped from `chayen-devops` (D11 14/14); new `chayen-performance` (user-approved, L0 cap raised to 4,400, D-034) with 5 recipes and a runtime tools reference (D12 10/10); 55 recipe cases; 10 trigger cases | REQ-05 (D11, D12), REQ-02..REQ-04, REQ-07..REQ-09 | DONE (pending review) |
| 15 | Domains 13 and 14 capabilities (as executed) | New `chayen-devops` (user-approved, L0 cap raised to 4,700, D-035) with 13 recipes, an operations safety checklist, and a tooling reference (D13 12/12, D14 10/10); 48 recipe cases; 7 trigger cases | REQ-05 (D13, D14), REQ-02..REQ-04, REQ-07..REQ-09 | DONE (pending review) |
| 16 | Domains 15 and 16 capabilities (as executed) | `chayen-modernization` folded into existing skills; D15 across repository, implementation, architecture, and devops recipes (10/10); new `chayen-documentation` (user-approved, L0 cap raised to 5,200, D-036) with 6 recipes and a fact-checking checklist (D16 10/10); 42 recipe cases; 7 trigger cases | REQ-05 (D15, D16), REQ-02..REQ-04, REQ-07..REQ-09 | DONE (pending review) |
| 17 | Domains 17 and 18 capabilities (as executed) | New `chayen-ai-engineering` (user-approved, L0 cap raised to 5,500, D-037) with 8 recipes and an AI tooling reference (D17 10/10, plus CAP-18-010); the other nine D18 records in existing skills, with two new recipes (policy as code, access reviews) and six extended ones (D18 10/10); 43 recipe cases; 7 trigger cases; two validator self-test fixtures retargeted | REQ-05 (D17, D18), REQ-02..REQ-04, REQ-07..REQ-09 | DONE (pending review) |
| 18 | Domains 19 and 20 capabilities (as executed) | D19 in backend, architecture, data, and frontend (4 new recipes, 4 extended; frontend description names browser extensions); D20 in `chayen-ai-engineering` (3 new recipes, 2 extended; description names agent skills); all 206 capabilities IMPLEMENTED (D-038); 35 recipe cases; 7 trigger cases; seven validator self-test fixtures retargeted | REQ-05 (D19, D20), REQ-02..REQ-04, REQ-07..REQ-09 | DONE (pending review) |
| 19 | Engineering coverage audit (as executed) | `docs/chayen/ENGINEERING_COVERAGE_AUDIT.md`; `tools/catalog/audit-coverage.mjs` (ten static criteria per capability); 9 recipe gaps fixed; 206/206 pass static criteria, 0/206 VERIFIED | REQ-05, REQ-08, REQ-10 | DONE (pending review) |
| 20 | .NET technology pack (as executed) | `catalog/technology-capabilities.yaml` (22 C# and ASP.NET Core capabilities); 12 new and 2 changed technology references in 6 existing skills; `tools/catalog/check-technology.mjs` (V-23) with 14 negative controls; 57 technology cases; 7 trigger cases; .NET fact checks `tests/technology/dotnet/` (32/32 PASS); `docs/chayen/TECHNOLOGY_COVERAGE.md` (D-039) | STK-01, REQ-07, REQ-08, REQ-10 | DONE (pending review) |
| 21 | Angular and shared TypeScript/JavaScript technology support (user-directed, D-040) | 14 Angular and 8 shared TS/JS sections in existing skills; 52 new technology cases; 8 trigger cases; 9 new mutation controls; V-23 validation; 8 TS/JS framework facts PASS, 14 Angular facts NOT_RUN; coverage/progress updated | STK-02, STK-04, REQ-07, REQ-08, REQ-10 | DONE (pending review) |
| 22 | React and Next.js technology guidance (user-directed, D-041) | 8 React and 8 Next.js capabilities; 11 new references in existing skills; 40 evaluation cases, 8 trigger prompts, 8 mutation controls; V-23 validation; 3 synthetic boundary checks PASS, 13 NOT_RUN; coverage/progress | STK-05, STK-06, REQ-07, REQ-08, REQ-09, REQ-10 | DONE (pending review) |
| 23 | Vue, Nuxt, and Vite engineering guidance (user-directed, D-042) | 7 Vue, 7 Nuxt, 4 Vite capabilities; 10 new references; 44 cases, 8 trigger prompts, 9 mutation controls; V-23 validation; 2 supporting JS checks PASS, 16 NOT_RUN; coverage/progress | STK-07, STK-08, STK-09, REQ-07, REQ-08, REQ-09, REQ-10 | DONE (pending review) |
| — | Final entry-skill set (*unscheduled*; the authoring guide part was done in Step 08 as SKILL_AUTHORING_STANDARD.md) | Final entry-skill set (Q-10, R-27) | REQ-05, STK-* | NOT_STARTED |
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

> **Note (Step 07):** The rows after the unscheduled row are the original
> Step 01 plan, and they are indicative only. Their numbers 05–08 collide
> with the as-executed steps above; the step that actually runs is the one
> numbered in the user's prompt. The Step 07 catalog maps capabilities to
> entry skills (D-023), so the per-stack rows 11–19 will need re-planning
> around those skills.

## Multilingual extension overview — Steps 35–41

This adds the Product Owner's Step 35 scope without replacing historical
plans or execution records. Only Step 35 is authorized now (D-047).
Future step organization is proposed and may be refined by the owner.
The target is 15 Entry Skills; the package currently contains 13.
Owner follow-up D-051 separately accepts and implements a **25-Skill maximum**
in the two count validators. This is capacity, not a new target or Step 36
execution. L0 and editorial registry changes still require their own approval.

| Step | Title | Planned outputs / exit evidence | Requirements | Status |
|---|---|---|---|---|
| 35 | Multilingual Humanizer governance and architecture | Impact analysis, ADR-0009–ADR-0011 PROPOSED, requirements/acceptance PLANNED, plan and evidence log | MHR-001–MHR-012 (design only) | DONE (pending Product Owner review) |
| 36 | Host research and approved foundations | Official dated per-surface evidence, resolved architecture approvals, approved count/L0/registry and future developer-validator changes | MHR-007–MHR-012 | NOT_STARTED |
| 37 | Thai editorial Skill | `chayen-humanizer-th`, conditional references and Thai cases; approved structural gates | MHR-001–MHR-006, MHR-011–MHR-012 | NOT_STARTED |
| 38 | English editorial Skill | `chayen-humanizer-en`, conditional references and English/bilingual cases; target 15 measured | MHR-001–MHR-006, MHR-011–MHR-012 | NOT_STARTED |
| 39 | Opt-in host persistent response guidance | Canonical static policy, verified host integration documentation, reviewed opt-in/disable/rollback in authorized isolated scope | MHR-002, MHR-007–MHR-009, MHR-012 | NOT_STARTED |
| 40 | Multilingual quality and engineering regression evaluation | Approved dataset/rubric, per-language human results, separately authorized provider/surface runs, policy on/off and no-plugin comparisons | MHR-001–MHR-012 | NOT_STARTED |
| 41 | Completeness and readiness review | Updated acceptance/evidence, compatibility limitations, user docs, rollback and go/no-go recommendation; no automatic release | MHR-001–MHR-012 | NOT_STARTED |

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

### Step 07 — Engineering capability catalog (as executed)
- **Source:** the user's Step 07 inventory (20 domains, 206 names), recorded
  verbatim in one YAML file (D-021).
- **Each record has:** ID, name, domain, purpose, positive and negative
  triggers, inputs, outputs, entry-skill mapping, recipe mapping,
  verification approach, and status (D-022).
- **Mapping:** a proposed 14-skill set (D-023), consolidation groups and
  overlaps (D-024).
- **No recipe implemented.** Capabilities with pilot content are
  IN_PROGRESS. Everything else is PLANNED.
- `tools/catalog/check-catalog.mjs` is the reproducible count and
  uniqueness check (V-11).

### Step 08 — Skill authoring standard and quality gates (as executed)
- **Standard:** SKILL_AUTHORING_STANDARD.md defines:
  - portable frontmatter;
  - description rules;
  - the entry-skill anatomy: scope line, ten ordered sections, safety
    boundaries, conditional loading;
  - reference kinds;
  - the capability recipe anatomy, with developer-side evaluation cases.
- **Gates:** SKILL_QUALITY_GATES.md lists G-01..G-15, and maps each requested
  detection to a validator and a negative control.
- **Validators:** `validate-package.mjs` was extended with V-17..V-22.
  `run-validator-tests.mjs` (52/52) and `validate-all.mjs` were added. They
  are developer-only, not a CLI.
- **Pilots:** all six now meet the standard. Two references were converted
  to recipes, and the other 13 declare a kind. No remaining recipes were
  implemented.

### (Unscheduled) Authoring guide and final entry-skill set

> Step 07 delivered the catalog part of this item in a different format
> (YAML, D-021). The bullets below are kept as originally planned. Q-01 is
> resolved for the inventory, but the catalog content still needs review.
- Define the **20 domains** and **206 capabilities** as `catalog/` JSON, per
  ARCHITECTURE C-03. Each capability gets:
  - an ID (`CAP-<domain>-<nnn>`)
  - a one-line intent
  - applicable stacks
  - exactly one entry skill
  - knowledge paths
  - a verification approach
- Finalise the entry-skill set (≤25 under owner amendment D-051; originally ≤14, ADR-0004).
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
**Original indicative scope, superseded by the user's Step 21 prompt (D-040).**
README, per-provider native install, update, and uninstall instructions,
troubleshooting, and a contribution guide.

**As executed:** first-class Angular (14 capabilities) and shared TS/JS
(8 capabilities), preserving version, module, reactivity, manager, and runner
conventions. See TECHNOLOGY_COVERAGE §7 and PROGRESS Step 21. Stop here.

### Step 22 — Release readiness review
**Original indicative scope, superseded by the user's Step 22 prompt (D-041).**
Audit the acceptance matrix, licence, versioning, and changelog. Produce a
go/no-go report. **Commit, tag, push, and marketplace submission happen only
on explicit user approval.**

**As executed:** React and Next.js engineering guidance, 8 capabilities each,
with version/routing/library/tooling preservation, server/client and secret
boundaries, direct server authorization, and positive/negative specifications.
See TECHNOLOGY_COVERAGE §9 and PROGRESS Step 22. STOP after Step 22.

### Step 23 — Vue, Nuxt, and Vite guidance (user-directed)

Implement the user's exact 7/7/4 inventory, preserving actual versions,
plain Vue/Nuxt distinctions, conventions, SSR/browser/private-config boundaries,
selected builder and configured test/package-manager tooling. Add recipes,
examples, evaluations, validation, coverage and progress. D-042 and
TECHNOLOGY_COVERAGE §11 record execution and limits. STOP after STEP 23.

### Steps 24–25 — not recorded

No prompt, file, or progress entry for Steps 24 and 25 exists in this
repository. They were not executed or inferred in Step 26 (R-45).

### Step 26 — Microsoft SQL Server guidance (user-directed)

Implement the user's exact 12 SQL Server capabilities and data access recipes
for the EF Core SQL Server provider, Dapper, and ADO.NET: engine/provider
detection, no PostgreSQL syntax on SQL Server, no destructive production
migrations, test-versus-production differences, comparable measurements,
and read-only production inspection. Validate 12/12, verify ORM/driver
references, update coverage and progress. D-043 and TECHNOLOGY_COVERAGE §13
record execution and limits. STOP after STEP 26.

### Step 27 — PostgreSQL and cross-stack integration (user-directed)

Implement the user's exact 10 PostgreSQL and 8 cross-stack capabilities and
PostgreSQL data access recipes (EF Core Npgsql, Npgsql, SQLAlchemy when
applicable, other configurations found in the project): never treat SQL
Server and PostgreSQL as interchangeable, review PostgreSQL transaction and
indexing behaviour, time zones, types, precision, and schema changes,
validate front-end/back-end contracts, respect authentication and
authorization, prevent unsafe query construction, and prefer test
databases. Validate 10/10 and 8/8, run all relevant validators, update
coverage and progress. D-044 and TECHNOLOGY_COVERAGE §15 record execution
and limits. STOP after STEP 27.

### Step 28 — Technology coverage audit (user-directed)

**PARTIAL.** Audit every implemented pack against documented support,
recipes, version awareness, positive/negative triggers, verification commands,
packaged reference resolution, API/version claims, and preservation of existing
dependencies and migrations. Cover all 17 technologies in the latest request,
the four representative combined-stack scenarios, and mixed-stack monorepos.

Output: TECHNOLOGY_COVERAGE_AUDIT.md and durable STEP 28 fact results; seven
content/specification gaps fixed, ten scenario specifications added. Static
gates PASS (108 capabilities, 295 cases; 115 validator self-tests); final fact
runs 107 PASS, 0 FAIL, 52 NOT_RUN. Provider/full frontend scenarios remain
NOT_RUN (R-49); maintainer Node minimum mismatch remains open (R-50).
Acceptance statuses are unchanged. STOP after STEP 28; no later work authorized.

### Step 29 — Composite engineering workflows (user-directed)

**DONE (pending review; IMPLEMENTED, not behavior-VERIFIED).** Implement the
12 requested workflows as conditional native-agent checklists reusing existing
capability recipes and detected technology topics. Add the seven requested
reusable template formats, retaining actual approval evidence, user scope,
proportional stages, no-match native behavior and partial/blocker reporting.

Outputs: catalog/composite-workflows.json, 12 skill-local workflow references,
seven template leaves, 47 workflow/template evaluation specifications, V-24
static coverage checker and 16 negative controls, WORKFLOW_COVERAGE.md and
STEP 29 validation evidence. Six automated gate groups and 132/132 validator
tests PASS. Live agent/provider evaluations remain NOT_RUN (R-51). No new
entry skill, metadata budget change, dependency, server, scheduler or runtime.
STEP 28 remains PARTIAL; its gaps are not silently closed. STOP after STEP 29.

### Step 30 — Security hardening (user-directed)

**DONE (pending review; offline security scope only).** Review both manifests,
all 13 entry skills, all 221 references/templates, three marketplaces,
developer scripts/imports, links, dependency declarations and optional
executables. Model all ten requested threats; preserve native instruction and
permission priority and actual approval evidence. Add SECURITY_MODEL.md,
THREAT_MODEL.md and PLUGIN_TRUST_REVIEW.md with explicit limitations.

Harden entry precedence, mutation/staging paths and linked inputs, parser/eval
metadata handling and optional provider opt-in/fresh-fixture boundaries. Add
V-25 static preflight and 32 offline security regressions. Eight automated gate
groups PASS, including 132 validator tests; 23 JavaScript and one shell syntax
checks PASS. No provider/model/install/network, technology runtime, advisory or
native permission test was executed; R-52 remains OPEN. No hooks, background
process, telemetry, credentials requirement, upload or runtime dependency.
Acceptance/catalog statuses remain unchanged; STEP 28 stays PARTIAL. STOP after
STEP 30; no later step or external action is authorized by this implementation.

### Step 31 — Final native provider compatibility validation (user-directed)

**PARTIAL (static validation complete; native runtime NOT_TESTED).**

**Scope.** Validate items 1–10 (manifest, marketplace source, native install,
discoverability, skills shown, automatic, explicit, no-match fallback,
reference loading, disable/update/uninstall) for Claude Code, OpenAI Codex
and GitHub Copilot. CLI and VS Code surfaces are assessed separately.

**Executed.**

- Re-read S13, S15 and S18.
- Recorded provider versions.
- Inspected the installed provider code for manifest and marketplace
  precedence.
- Ran the offline gates, `claude plugin validate --strict` with both Claude
  binaries, and the new read-only `check-identity.mjs` (15/15).

**Not executed.** The lifecycle opt-in was denied by the session permission
classifier. Model probes and VS Code UIs were not run.

**Outputs.**

- FINAL_PROVIDER_COMPATIBILITY.md
- tests/provider-compatibility/README.md: the existing file, extended with
  runbook R-0..R-10
- tests/provider-compatibility/check-identity.mjs
- PROVIDER_COMPATIBILITY_MATRIX §9

**Gate.** Release gate OPEN (R-53). Version update risk R-54. No provider-specific
catalog copy was needed. No manifest, marketplace or skill changed. STOP
after STEP 31.

### Step 32 — Comprehensive evaluation suite (user-directed)

**DONE for the executable scope (pending review). Behavior not VERIFIED.**

**Suite.** 15 categories across four separated evidence levels:

- static;
- simulated (a lexical proxy);
- actual provider invocation;
- manual.

`tools/evals/run-evaluation-suite.mjs` checks the static gates and
traceability: 206/206 engineering, 108/108 technology and 12/12 workflow
records with positive and negative cases, and the 11/11 requested routing
examples. It also checks cross-skill handoff, measures context overhead, and
pools recorded provider results.

**Executed.**

- All six fact runners: 107 pass, 0 fail, 52 not run.
- 31 billed Claude Code runs (`tests/evaluation/run-provider-probes.mjs`,
  six-stack fixture, about $6.44). Results:

  | Measure | Result |
  |---|---|
  | Positive routing | 14/20 |
  | No-match | 8/8 |
  | Precision | 14/14 |
  | References | 8/16 |
  | Verification evidence | 3/10 |

**Not executed.** Copilot (unauthenticated isolated home), Codex (install
not authorized), VS Code, and `claude plugin eval` at full size.

**Fixes.**

- 4 trigger cases;
- explicit-invocation and completion scoring, plus `--rescore`;
- a path-resolution guard in all 13 skills (D-046);
- DF-01;
- the R-50 declaration;
- fixture copy and git long paths;
- path-free summaries.

**Open.** Next.js under-trigger and pytest instability are recorded (R-55,
EG-01..EG-20). STOP after STEP 32.

### Step 33 — Distribution preparation (user-directed)

**DONE (pending review). Not released.**

**User documentation:**

- `README.md`, `SECURITY.md`, `CHANGELOG.md`;
- 11 guides in `docs/`: getting started, three install guides,
  automatic discovery, technologies, skills catalog, workflows, security and
  limitations, compatibility matrix, contributing.

**Release material** in `docs/distribution/`: licence proposal, proposed
release metadata, marketplace listing drafts, release checklist. The folder
is named `distribution` because `.gitignore` ignores `[Rr]elease/`.

**Validation.** New documentation gate G-14 (`tools/validate/check-docs.mjs`,
5/5 negative controls). Manifest metadata validated against the git remote
and the identity checks.

**Not done.** No licence, publisher identity, public URL, privacy policy, or
security contact was invented (R-56). Manifests are unchanged, still
`0.1.0-dev` (R-54). Nothing was pushed, tagged, or published. STOP after
STEP 33.
### Step 34 — Final independent completeness audit (user-directed)

**DONE (pending owner decision).** Recommendation: **NO-GO** for public
release; **CONDITIONAL-GO** for a limited internal pilot.

**Executed:**

- Re-ran all 20 validator and test commands and the 6 fact suites: all exit
  0; facts 107/0/52.
- An independent audit script over 206 capabilities, 108 technology
  records, and the package.
- Re-derived the Step 32 probe records from raw transcripts (30/30 match).
- A new Claude Code probe run (Run C: 9/13). Pooled 43 runs: automatic
  12/22, explicit 6/6, no-match 12/12.

**Outputs:** FINAL_AUDIT_REPORT.md, RELEASE_READINESS.md,
KNOWN_LIMITATIONS.md.

**Changes made by the audit:**

- EX-01..EX-07 VERIFIED by release inspection;
- stale acceptance cells annotated;
- user docs, changelog, and checklist corrected to the pooled routing
  figures;
- DF-03 recorded (D-009 status inconsistency, stale plan overview).

Nothing published, pushed, or tagged. STOP after STEP 34.

### Step 35 — Multilingual Humanizer governance and architecture (user-directed)

**DONE for governance, pending Product Owner review.** Record approved product
scope separately from proposed mechanisms; inspect existing governance,
ADR-0002–0007, manifests, skills, working tree and validator sources. Analyze
native discovery, no-match, zero always-on content, count/L0, catalog ownership,
runtime, portability and advisory boundaries. Create ADR-0009–ADR-0011 only
after checking number availability. Define MHR-001–MHR-012 as PLANNED and
extend this plan through Step 41. Record read-only checks with actual outcomes.

Outputs: HUMANIZER_ARCHITECTURE_IMPACT.md, HUMANIZER_REQUIREMENTS.md, the three
PROPOSED ADRs and governance cross-links/logs. No Skills, host integration,
instruction/configuration changes, validators, manifests, dependency or billed
evaluation changes. STOP after Step 35 and wait for Product Owner review.

### Step 36 — Host research and approved foundations (planned)

Requires a separate instruction after Step 35 review. Resolve ADR-0009–0011
approval and evidence conditions without treating the approved product scope
as mechanism approval. Research each host/surface's native instructions with
official URLs/access dates and actual loading scope/precedence/limits; label
gaps UNVERIFIED. Agree dataset/rubric/sample coverage. After the relevant ADR
acceptance, implement coordinated developer-only registry/count/L0/anatomy
vocabulary checks and negative controls, preserving all existing inventories.
Do not infer runtime fallback or user-level configuration authority.

### Step 37 — Thai Humanizer Skill (planned)

After approved foundations and explicit step authorization, implement only the
Thai writing/editing Skill and skill-local references, with language selection,
audit/rewrite, website copy, fidelity, glossary and injection cases. Preserve
all engineering Skills and approved budgets. Report structural versus behavior
evidence separately; no persistent host integration implied.

### Step 38 — English Humanizer Skill (planned)

After approved foundations and explicit step authorization, implement the
English Skill and references, English/bilingual cases and boundary checks
against Thai/documentation/frontend owners. Validate the actual 15-Skill
surface, approved L0, independent editorial registry and all legacy mappings.
No behavior verification claim from structural tests alone.

### Step 39 — Opt-in persistent response guidance (planned)

Requires ADR-0010 acceptance, host research and separate implementation scope.
Prepare a provider-neutral policy and host-specific instructions only for
verified surfaces. Enable only with explicit user authorization of the exact
scope/content; preserve existing content and record the reviewed diff/owned
additions. Test opt-out, independent removal, plugin disable/uninstall and
rollback in isolated authorized fixtures. No hooks, MCP, executable installers
or runtime dependencies. Do not claim strict install-only always-on support.

### Step 40 — Multilingual quality and regression evaluation (planned)

Requires an approved rubric/dataset and explicit authorization for any billed
provider calls. Evaluate Thai/English human quality and factual/semantic/
terminology fidelity separately; cover mixed language, web syntax, adversarial
content and permissions. Compare native editorial/engineering routing,
references and no-match with policy enabled/disabled and no-plugin baselines.
Record host/model versions and overhead; retain NOT_RUN gaps and legacy risks.
Static/proxy/provider/human evidence cannot be pooled or substituted.

### Step 41 — Completeness and readiness review (planned)

Audit MHR evidence, ADR acceptance, all 206 Engineering Capabilities and
approved Technology/Workflow Coverage, host compatibility, instructions
lifecycle, docs, rollback and known limitations. Update acceptance only from
executed evidence; produce a go/no-go recommendation for owner review.
No commit, push, tag, publication, release or later action is authorized by
this plan or by passing tests. Execute no future step automatically.

# Acceptance Matrix

Every requirement is traced through its planned step, implementation
evidence, verification method, and verification evidence. Status vocabulary
is defined in [BUILD_CONTRACT.md](BUILD_CONTRACT.md) §5.1.

A row may be marked `VERIFIED` only when its verification evidence column
cites an executed test and its recorded result (BC-10, BC-13).

**Snapshot:** after Step 07 (2026-10-14).

## Summary

| Category | Rows | PLANNED | IN_PROGRESS | IMPLEMENTED | VERIFIED |
|---|---|---|---|---|---|
| Governance (GOV) | 15 | 0 | 0 | 15 | 0 |
| Core requirements (REQ) | 10 | 0 | 10 | 0 | 0 |
| Exclusions (EX) | 7 | 0 | 0 | 7 | 0 |
| Providers (PRV) | 3 | 0 | 3 | 0 | 0 |
| Stack coverage (STK) | 14 | 1 | 13 | 0 | 0 |
| Architecture components (ARC) | 14 | 1 | 6 | 7 | 0 |
| Capability domains (CAP) | 20 | 12 | 8 | 0 | 0 |
| **Total** | **83** | **14** | **40** | **29** | **0** |

Step 06 executed native lifecycle tests (24/24 on 3 CLIs) and routing tests
on Claude Code, Codex, and Copilot. Details are in
[POC_REPORT.md](POC_REPORT.md).

Step 07 created the capability catalog: 206 records in 20 domains, checked by
V-11. Per-capability status lives in the catalog, and the 20 CAP rows below
roll it up by domain. Capabilities: 31 IN_PROGRESS, 175 PLANNED,
0 IMPLEMENTED, 0 VERIFIED. See [CAPABILITY_COVERAGE.md](CAPABILITY_COVERAGE.md).

No row is `VERIFIED`, because these remain open:

- VS Code surfaces: NOT TESTED;
- remote GitHub marketplace installs: NOT TESTED;
- routing has only single-run evidence, with known under-triggering on
  Claude Code and over-activation on Copilot;
- no statistical baseline exists.

## Governance

| ID | Requirement | Step | Implementation evidence | Verification method | Verification evidence | Status |
|---|---|---|---|---|---|---|
| GOV-01 | Project charter | 01 | `docs/chayen/PROJECT_CHARTER.md` | File exists + user review | File existence: PASS (Step 01). User review: pending | IMPLEMENTED |
| GOV-02 | Build contract | 01 | `docs/chayen/BUILD_CONTRACT.md` | File exists + user review | File existence: PASS (Step 01). User review: pending | IMPLEMENTED |
| GOV-03 | Implementation plan | 01 | `docs/chayen/IMPLEMENTATION_PLAN.md` | File exists + user review | File existence: PASS (Step 01). User review: pending | IMPLEMENTED |
| GOV-04 | Progress log with file ledger | 01 | `docs/chayen/PROGRESS.md` | File exists + user review | File existence: PASS (Step 01). User review: pending | IMPLEMENTED |
| GOV-05 | Decision log | 01 | `docs/chayen/DECISIONS.md` | File exists + user review | File existence: PASS (Step 01). User review: pending | IMPLEMENTED |
| GOV-06 | Acceptance matrix | 01 | `docs/chayen/ACCEPTANCE_MATRIX.md` | File exists + user review | File existence: PASS (Step 01). User review: pending | IMPLEMENTED |
| GOV-07 | Issues register | 01 | `docs/chayen/ISSUES.md` | File exists + user review | File existence: PASS (Step 01). User review: pending | IMPLEMENTED |
| GOV-08 | Provider specification research, with official URL citations | 02 | `docs/chayen/PROVIDER_SPEC_RESEARCH.md` | File exists, every finding cites a source ID, + user review | File existence: PASS (Step 02). Citation check: see PROGRESS Step 02. User review: pending | IMPLEMENTED |
| GOV-09 | Provider compatibility matrix (SUPPORTED / UNSUPPORTED / UNVERIFIED) | 02 | `docs/chayen/PROVIDER_COMPATIBILITY_MATRIX.md` | File exists + user review | File existence: PASS (Step 02). User review: pending | IMPLEMENTED |
| GOV-10 | Plugin format decision | 02 | `docs/chayen/PLUGIN_FORMAT_DECISION.md` (D-009, PROPOSED) | File exists + user approval of D-009 | File existence: PASS (Step 02). User approval: pending | IMPLEMENTED |
| GOV-11 | Architecture (14 components, diagrams, dependency rules, assumptions) | 03 | `docs/chayen/ARCHITECTURE.md` | File exists, all 14 components defined, + user review | Checks: see PROGRESS Step 03. User review: pending | IMPLEMENTED |
| GOV-12 | Plugin package design (repo layout, packaging process) | 03 | `docs/chayen/PLUGIN_PACKAGE_DESIGN.md` | File exists + user review | Checks: see PROGRESS Step 03. User review: pending | IMPLEMENTED |
| GOV-13 | ADRs for the 8 required decisions | 03 | `docs/chayen/ADRS/README.md`, `ADR-0001`..`ADR-0008` | 8 ADR files present and indexed + user review | Checks: see PROGRESS Step 03. User review: pending | IMPLEMENTED |
| GOV-14 | Proof-of-concept report (native behaviour per surface) | 06 | `docs/chayen/POC_REPORT.md`, `tests/provider-compatibility/results/2026-10-14-step06.md` | File exists + user review | File existence: PASS (Step 06). User review: pending | IMPLEMENTED |
| GOV-15 | Capability coverage document (catalog guide, status rules, mapping, overlaps, generated tables) | 07 | `docs/chayen/CAPABILITY_COVERAGE.md` | File exists, generated block in sync (V-11.11), + user review | V-11.11 PASS (Step 07 T1). User review: pending | IMPLEMENTED |

## Core requirements

| ID | Requirement | Step(s) | Implementation evidence | Verification method | Verification evidence | Status |
|---|---|---|---|---|---|---|
| REQ-01 | Native plugin installation and lifecycle | 02, 04, 06–08, 21 | `plugins/codejadee-chayen-framework/`, the three marketplace files (Step 04) | Clean install, update, and uninstall through each provider's native mechanism, with commands and output recorded | Step 06 run-lifecycle.sh 24/24 (Claude 2.1.270, Codex 0.160.1, Copilot 1.0.97; isolated homes; local marketplace). VS Code surfaces: NOT TESTED (manual procedures in tests/provider-compatibility/). Codex IDE: UNSUPPORTED. Remote GitHub marketplace: NOT TESTED. See POC_REPORT.md | IN_PROGRESS |
| REQ-02 | Automatic skill discovery from ordinary prompts | 04, 10, 05, 06 | 6 pilot entry skills (plugins/codejadee-chayen-framework/skills/chayen-*/SKILL.md), descriptions per D-017 | Positive trigger suite per provider, measured activation rate | Step 06 routing: Codex 3/3, Copilot 3/3 (clean env), Claude eval positives 20/27 run 1 (23/27 triggered at least once); single runs only, no statistical baseline; competing personal skills can win (POC_REPORT §4) | IN_PROGRESS |
| REQ-03 | No explicit Chayen invocation required | 04, 10, 05, 06 | Skill descriptions need no plugin mention; trigger cases forbid "Chayen" in prompts (V-16) | Trigger suite prompts contain no "Chayen" or plugin reference | Step 06: all routing prompts omit Chayen; positives triggered on all three CLIs. Under-triggering for implementation/repository/security prompts on Claude (empty workspace) | IN_PROGRESS |
| REQ-04 | No applicable skill means native AI behaviour | 04, 10, 05, 06 | No hooks/always-on components; `Not for` clauses; no-match gate sentence in every skill (V-17) | Negative trigger suite: no skill activation on unrelated prompts. Validator: no always-on injection (D-007) | Step 06: irrelevant prompts silent 10/10 (Claude 8/8, Codex 1/1, Copilot 1/1); unsupported silent Claude 7/7, Codex 2/2, Copilot 0/2 (over-activation, guidance not misapplied per agent transcript review) | IN_PROGRESS |
| REQ-05 | 206 capabilities in 20 domains | 03, 07, 11–19 | `catalog/engineering-capabilities.yaml` (206 records, 20 domains, each with ID, purpose, triggers, inputs, outputs, entry-skill and recipe mapping, verification, status); `docs/chayen/CAPABILITY_COVERAGE.md` | Validator coverage check: every catalog ID maps to skill content, counts = 206 / 20 | V-11 PASS (Step 07 T1: 206 records, 206 unique ids and names, 20 domains, inventory fingerprint match; T2: 18/18 negative controls rejected; T3: PyYAML cross-parse identical). Content coverage: 31 IN_PROGRESS (pilot content), 175 PLANNED, 0 IMPLEMENTED. Capability behaviour evals: NOT_RUN. User review of the catalog: pending | IN_PROGRESS |
| REQ-06 | Progressive skill and reference loading | 04, 05 | Conditional references in plugins/codejadee-chayen-framework/skills/*/references/ (16 files), loaded per routing tables | Validator: size budgets, references reachable only through skill links. Provider behaviour confirmed in Step 02 | V-06/V-08 PASS; Claude `details`: always-on ~615 tok vs on-invoke ~1.4–1.6k tok per skill. Reference-load behaviour: NOT_RUN | IN_PROGRESS |
| REQ-07 | Preserve existing repository architecture and conventions | 09, 11–19, 05 | Precedence + detect-existing-conventions steps in all 6 skills and every reference's 'Check the repository first' table | Skill review checklist (detect-before-prescribe, D-008). Trigger tests on repos with non-default conventions | Static review only; convention-conflict behaviour tests: NOT_RUN | IN_PROGRESS |
| REQ-08 | Evidence-driven verification | 09, 05 | Verification + Failure handling sections in all skills; task-contract.md and change-summary.md (PASS/FAIL/NOT_RUN rules) | Skill content review, plus tests that responses cite executed commands and output | V-17 PASS; behaviour: NOT_RUN | IN_PROGRESS |
| REQ-09 | Security guidance without claiming hard enforcement | 09, 05 | plugins/codejadee-chayen-framework/skills/chayen-security/ (advisory statement, checklist, stack hardening) | Validator forbidden-claim check (D-003), plus content review | V-10 PASS (no enforcement/absolute claims); behaviour: NOT_RUN | IN_PROGRESS |
| REQ-10 | Provider compatibility and regression tests | 05, 10, 20, 06 | tools/validate/, tools/evals/generate-claude-evals.mjs (--stage), tests/skills/trigger-cases.json, tests/evals/claude/, tests/provider-compatibility/run-lifecycle.sh, tests/routing/run-smoke.mjs | Automated suite run in CI and locally, results recorded per provider | Step 06: lifecycle 24/24; Claude eval executed (48 cases, $3.76 run 1); Codex/Copilot smoke executed; CI not set up; VS Code manual | IN_PROGRESS |

## Exclusions (must remain true)

| ID | Constraint | Step(s) | Implementation evidence | Verification method | Verification evidence | Status |
|---|---|---|---|---|---|---|
| EX-01 | No Chayen CLI | 05, 22, 06 | plugins/codejadee-chayen-framework/ contains only .md/.json (no CLI, installer, web app, extension, runtime, daemon, MCP) | Validator / release audit: no executable entry points shipped | V-09 PASS; Claude inventory Agents/Hooks/MCP/LSP = 0; native-only install verified on 3 CLIs (Step 06). Release audit (Step 22): NOT_RUN | IMPLEMENTED |
| EX-02 | No custom installer | 05, 22, 06 | plugins/codejadee-chayen-framework/ contains only .md/.json (no CLI, installer, web app, extension, runtime, daemon, MCP) | Release audit: install docs use native mechanisms only | V-09 PASS; Claude inventory Agents/Hooks/MCP/LSP = 0; native-only install verified on 3 CLIs (Step 06). Release audit (Step 22): NOT_RUN | IMPLEMENTED |
| EX-03 | No web application | 22, 06 | plugins/codejadee-chayen-framework/ contains only .md/.json (no CLI, installer, web app, extension, runtime, daemon, MCP) | Release audit | V-09 PASS; Claude inventory Agents/Hooks/MCP/LSP = 0; native-only install verified on 3 CLIs (Step 06). Release audit (Step 22): NOT_RUN | IMPLEMENTED |
| EX-04 | No VS Code extension | 22, 06 | plugins/codejadee-chayen-framework/ contains only .md/.json (no CLI, installer, web app, extension, runtime, daemon, MCP) | Release audit: no `package.json` extension manifest or `.vsix` | V-09 PASS; Claude inventory Agents/Hooks/MCP/LSP = 0; native-only install verified on 3 CLIs (Step 06). Release audit (Step 22): NOT_RUN | IMPLEMENTED |
| EX-05 | No standalone agent runtime | 22, 06 | plugins/codejadee-chayen-framework/ contains only .md/.json (no CLI, installer, web app, extension, runtime, daemon, MCP) | Release audit | V-09 PASS; Claude inventory Agents/Hooks/MCP/LSP = 0; native-only install verified on 3 CLIs (Step 06). Release audit (Step 22): NOT_RUN | IMPLEMENTED |
| EX-06 | No background daemon | 22, 06 | plugins/codejadee-chayen-framework/ contains only .md/.json (no CLI, installer, web app, extension, runtime, daemon, MCP) | Release audit | V-09 PASS; Claude inventory Agents/Hooks/MCP/LSP = 0; native-only install verified on 3 CLIs (Step 06). Release audit (Step 22): NOT_RUN | IMPLEMENTED |
| EX-07 | No mandatory MCP server | 05, 22, 06 | plugins/codejadee-chayen-framework/ contains only .md/.json (no CLI, installer, web app, extension, runtime, daemon, MCP) | Validator: no required MCP configuration in any manifest | V-09 PASS; Claude inventory Agents/Hooks/MCP/LSP = 0; native-only install verified on 3 CLIs (Step 06). Release audit (Step 22): NOT_RUN | IMPLEMENTED |

## Providers

| ID | Requirement | Step(s) | Implementation evidence | Verification method | Verification evidence | Status |
|---|---|---|---|---|---|---|
| PRV-CC | Claude Code native plugin + marketplace packaging | 02, 04, 06 | `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` | Native install in a clean environment, plus trigger suite | CLI: lifecycle PASS, discovery PASS, routing partial (POC_REPORT), explicit /codejadee-chayen-framework:chayen-security PASS, disable removes behaviour PASS. VS Code extension: NOT TESTED. Remote install: NOT TESTED | IN_PROGRESS |
| PRV-CX | OpenAI Codex native packaging | 02, 04, 07, 06 | `plugin.json` (Agent Plugins), `.agents/plugins/marketplace.json` | Native install in a clean environment, plus trigger suite | CLI: lifecycle PASS, discovery PASS (6 skills listed by the model), routing smoke 7/7, disable via config.toml PASS (-c override does not disable). IDE extension: UNSUPPORTED. Desktop app / remote install: NOT TESTED | IN_PROGRESS |
| PRV-GH | GitHub Copilot native packaging | 02, 04, 08, 06 | `plugin.json` (Agent Plugins), `.github/plugin/marketplace.json` | Native install in a clean environment, plus trigger suite | CLI 1.0.97: lifecycle PASS incl. enable/disable (U-14 resolved for ≥1.0.91), discovery PASS, routing smoke 5/7 (Unity/SwiftUI over-activation), disable removes behaviour PASS. VS Code: NOT TESTED. Remote install: NOT TESTED | IN_PROGRESS |

## Stack coverage

| ID | Technology | Tier | Step | Implementation evidence | Verification method | Verification evidence | Status |
|---|---|---|---|---|---|---|---|
| STK-01 | C# / ASP.NET Core Web API | Primary | 11, 05 | Pilot guidance in skill-local references (Step 05) | Catalog coverage + trigger suite | V-06/V-08/V-12 PASS. Catalog (Step 07): 66 records apply to `dotnet-aspnetcore` explicitly or through a stack group (15 IN_PROGRESS), plus 107 stack-neutral records. Capability behaviour and trigger suite per capability: NOT_RUN | IN_PROGRESS |
| STK-02 | Angular / TypeScript | Primary | 12, 05 | Pilot guidance in skill-local references (Step 05) | Catalog coverage + trigger suite | V-06/V-08/V-12 PASS. Catalog (Step 07): 42 records apply to `angular` explicitly or through a stack group (12 IN_PROGRESS), plus 107 stack-neutral records. Capability behaviour and trigger suite per capability: NOT_RUN | IN_PROGRESS |
| STK-03 | Microsoft SQL Server | Primary | 13, 05 | Pilot guidance in skill-local references (Step 05) | Catalog coverage + trigger suite | V-06/V-08/V-12 PASS. Catalog (Step 07): 23 records apply to `sqlserver` explicitly or through a stack group (4 IN_PROGRESS), plus 107 stack-neutral records. Capability behaviour and trigger suite per capability: NOT_RUN | IN_PROGRESS |
| STK-04 | JavaScript / TypeScript | Additional | 14, 05 | Pilot guidance in skill-local references (Step 05) | Catalog coverage + trigger suite | V-06/V-08/V-12 PASS. Catalog (Step 07): 84 records apply to `typescript-javascript` explicitly or through a stack group (19 IN_PROGRESS), plus 107 stack-neutral records. Capability behaviour and trigger suite per capability: NOT_RUN | IN_PROGRESS |
| STK-05 | React | Additional | 14, 05 | Pilot guidance in skill-local references (Step 05) | Catalog coverage + trigger suite | V-06/V-08/V-12 PASS. Catalog (Step 07): 42 records apply to `react` explicitly or through a stack group (12 IN_PROGRESS), plus 107 stack-neutral records. Capability behaviour and trigger suite per capability: NOT_RUN | IN_PROGRESS |
| STK-06 | Next.js | Additional | 14, 05 | Pilot guidance in skill-local references (Step 05) | Catalog coverage + trigger suite | V-06/V-08/V-12 PASS. Catalog (Step 07): 42 records apply to `nextjs` explicitly or through a stack group (12 IN_PROGRESS), plus 107 stack-neutral records. Capability behaviour and trigger suite per capability: NOT_RUN | IN_PROGRESS |
| STK-07 | Vue | Additional | 15, 05 | Pilot guidance in skill-local references (Step 05) | Catalog coverage + trigger suite | V-06/V-08/V-12 PASS. Catalog (Step 07): 41 records apply to `vue` explicitly or through a stack group (12 IN_PROGRESS), plus 107 stack-neutral records. Capability behaviour and trigger suite per capability: NOT_RUN | IN_PROGRESS |
| STK-08 | Nuxt | Additional | 15, 05 | Pilot guidance in skill-local references (Step 05) | Catalog coverage + trigger suite | V-06/V-08/V-12 PASS. Catalog (Step 07): 42 records apply to `nuxt` explicitly or through a stack group (12 IN_PROGRESS), plus 107 stack-neutral records. Capability behaviour and trigger suite per capability: NOT_RUN | IN_PROGRESS |
| STK-09 | Vite | Additional | 15, 05 | Pilot guidance in skill-local references (Step 05) | Catalog coverage + trigger suite | V-06/V-08/V-12 PASS. Catalog (Step 07): 22 records apply to `vite` explicitly or through a stack group (7 IN_PROGRESS), plus 107 stack-neutral records. Capability behaviour and trigger suite per capability: NOT_RUN | IN_PROGRESS |
| STK-10 | Nitro | Additional | 16, 05 | Pilot guidance in skill-local references (Step 05) | Catalog coverage + trigger suite | V-06/V-08/V-12 PASS. Catalog (Step 07): 28 records apply to `nitro` explicitly or through a stack group (8 IN_PROGRESS), plus 107 stack-neutral records. Capability behaviour and trigger suite per capability: NOT_RUN | IN_PROGRESS |
| STK-11 | Elysia | Additional | 16, 05 | Pilot guidance in skill-local references (Step 05) | Catalog coverage + trigger suite | V-06/V-08/V-12 PASS. Catalog (Step 07): 28 records apply to `elysia` explicitly or through a stack group (8 IN_PROGRESS), plus 107 stack-neutral records. Capability behaviour and trigger suite per capability: NOT_RUN | IN_PROGRESS |
| STK-12 | Python | Additional | 17, 05 | Pilot guidance in skill-local references (Step 05) | Catalog coverage + trigger suite | V-06/V-08/V-12 PASS. Catalog (Step 07): 74 records apply to `python` explicitly or through a stack group (15 IN_PROGRESS), plus 107 stack-neutral records. Capability behaviour and trigger suite per capability: NOT_RUN | IN_PROGRESS |
| STK-13 | PostgreSQL | Additional | 17, 05 | Pilot guidance in skill-local references (Step 05) | Catalog coverage + trigger suite | V-06/V-08/V-12 PASS. Catalog (Step 07): 24 records apply to `postgresql` explicitly or through a stack group (4 IN_PROGRESS), plus 107 stack-neutral records. Capability behaviour and trigger suite per capability: NOT_RUN | IN_PROGRESS |
| STK-14 | Java | Optional extension | 19 | — | Catalog coverage + trigger suite (only if Q-08 approves) | Catalog (Step 07): 0 records list `java` (optional pack, Q-08) | PLANNED |

## Architecture components (design: ARCHITECTURE.md §3–§4)

| ID | Component | Planned step(s) | Implementation evidence | Verification method | Verification evidence | Status |
|---|---|---|---|---|---|---|
| ARC-01 | C-01 Portable Plugin Package | 04, 06 | `plugins/codejadee-chayen-framework/` (manifests, README, `skills/` canonical source; 0 skills) | V-09, V-13, X-01, plus install on each surface | V-09 PASS, V-13 PASS, X-01 PASS. Local installs: see REQ-01. Install on every surface: NOT_RUN. | IMPLEMENTED |
| ARC-02 | C-02 Provider Compatibility Metadata | 04, 06–08 | `plugins/codejadee-chayen-framework/plugin.json`, `.../.claude-plugin/plugin.json` | V-01..V-04, X-01, install tests (U-01, U-02) | V-02 PASS, plus **official Agent Plugins 1.0.0 JSON Schema** (ajv 2020) PASS with 4/4 negative controls rejected. V-03 PASS, V-04 PASS, X-01 PASS. | IMPLEMENTED |
| ARC-03 | C-03 Engineering Capability Catalog | 04, 07 | `catalog/engineering-capabilities.yaml` (single restricted-YAML file, D-021; IDs and status rules D-022; 14-skill mapping D-023 PROPOSED; 56 consolidation groups, 61 overlaps D-024) | V-11 (counts, uniqueness, inventory identity, mapping integrity) | V-11 PASS (`node tools/catalog/check-catalog.mjs`, Step 07 T1); negative controls 18/18 rejected (T2); PyYAML 6.0.3 cross-parse identical (T3). User review: pending | IMPLEMENTED |
| ARC-04 | C-04 Entry Skills (≤14) | 04 (set), 09–18 (content), 05 | 6 pilot entry skills in plugins/codejadee-chayen-framework/skills/ (D-015) | V-05..V-07, positive trigger suite | V-05, V-07 (L0 2292/4000 chars), V-07b (max overlap 0.14), V-17 PASS; skills-ref validate 6/6 valid; claude plugin validate --strict PASS; positive trigger suite: NOT_RUN | IMPLEMENTED |
| ARC-05 | C-05 Technology Reference Packs | 11–19, 05 | Skill-local stack references (D-016): aspnetcore-webapi, data-access, node-servers, python-web-apis, angular, react-nextjs, vue-nuxt, dotnet/javascript/python testing, stack-hardening, stack-detection | V-06, V-08, V-12, behavioural suite | V-06, V-08, V-12 PASS; behavioural suite: NOT_RUN; shared knowledge packs deferred (U-11/U-13) | IN_PROGRESS |
| ARC-06 | C-06 Skill Applicability Rules | 09, 05, 06 | When to use / When not to use / gate sentence / precedence in every SKILL.md | Negative, gate, and convention-conflict suites (ADR-0003) | V-17 PASS; Step 06 negative suite 10/10 silent; unsupported: Claude 7/7, Codex 2/2 silent, Copilot 0/2 (gate did not prevent activation; no misapplied guidance observed) | IMPLEMENTED |
| ARC-07 | C-07 Progressive Reference Loading | 05, 09 | Routing tables load one reference per detected stack; ≤2 hops; skill-local | V-06..V-08, reference-load checks (U-11, AS-04) | V-06, V-08 PASS; reference-load checks: NOT_RUN | IN_PROGRESS |
| ARC-08 | C-08 Composite Development Workflows | 09 | — | V-06, V-08, behavioural suite | — | PLANNED |
| ARC-09 | C-09 Task Contract Templates | 09, 05 | plugins/codejadee-chayen-framework/skills/chayen-implementation/references/task-contract.md | V-12, behavioural suite (contract produced when required) | V-12 PASS; behaviour: NOT_RUN | IN_PROGRESS |
| ARC-10 | C-10 Evidence and Change Passport Templates | 09, 05 | plugins/codejadee-chayen-framework/skills/chayen-implementation/references/change-summary.md; verification tables in all skills | V-12, behavioural suite (NOT_RUN reported honestly) | V-12 PASS; behaviour: NOT_RUN | IN_PROGRESS |
| ARC-11 | C-11 Security and Trust Guidance | 09, 05 | plugins/codejadee-chayen-framework/skills/chayen-security/ (SKILL.md, review-checklist.md, stack-hardening.md) | V-10, security behaviour cases (ADR-0007) | V-10 PASS; security behaviour cases: NOT_RUN | IMPLEMENTED |
| ARC-12 | C-12 Developer-only Validators | 04, 05 | tools/validate/validate-package.mjs: V-01a–c, V-02–V-10, V-12, V-13, V-16, V-17; tools/catalog/check-catalog.mjs: V-11 (zero deps) | Validator self-tests on good and bad fixtures | Repo: 0 errors 0 warnings. Mutated copies: Step 04 (12 errors) and Step 05 (21 errors) all injected faults detected. CI + committed fixtures: NOT_RUN; V-11 implemented in Step 07 (18/18 mutated catalogs rejected); V-14, V-15 not implemented | IN_PROGRESS |
| ARC-13 | C-13 Evaluation and Compatibility Test Suites | 05, 10, 20, 06 | tests/skills/trigger-cases.json, tests/evals/claude/ (staged via generator --stage), tests/routing/ (run-smoke.mjs, smoke-cases.json, results/), tests/provider-compatibility/ (run-lifecycle.sh, VS Code procedures, results/) | Suites executed, with results recorded | Executed Step 06: lifecycle 24/24; Claude eval 48 cases + 25 re-runs; Codex 7/7 + disabled 1/1; Copilot 5/7 + disabled 1/1. Statistical baseline and fixture workspaces: NOT_RUN | IN_PROGRESS |
| ARC-14 | C-14 Marketplace Distribution | 04, 06–08, 22 | `.claude-plugin/marketplace.json`, `.github/plugin/marketplace.json`, `.agents/plugins/marketplace.json` (D-013) | V-01, V-14, install-from-marketplace tests | V-01a/b/c PASS, consistency PASS. `claude plugin validate --strict` (marketplace) PASS. Local-path marketplace installs: Claude PASS, Codex PASS, Copilot PASS. Provider file-selection observed (Copilot uses `.github/plugin`; Codex uses `.agents/plugins`). Remote GitHub marketplace: NOT_RUN (nothing pushed). V-14: not implemented. | IMPLEMENTED |

## Step 03 design basis (design only, not verification)

| Row | Design element | Reference |
|---|---|---|
| REQ-01 | Native plugin-first. One canonical package plus metadata layer. Repo-as-marketplace. | ADR-0001, ADR-0006, ADR-0008 |
| REQ-02 / REQ-03 | Native description-based discovery. No router, hook, or command. | ADR-0002, C-04 |
| REQ-04 | Zero always-on content, an in-skill gate, and boundary clauses | ADR-0003, C-06 |
| REQ-05 | Catalog separated from ≤14 task-intent entry skills | ADR-0004, C-03 |
| REQ-06 | L0–L3 loading with budgets, ≤2 hops | C-07, ARCHITECTURE §8 |
| REQ-07 | Precedence order, plus "detect existing conventions first" in every pack | C-05, C-06 |
| REQ-08 | Workflows, task contract, evidence record, change passport | C-08..C-10 |
| REQ-09 | Advisory-only security, trust boundaries B-01..B-06, threat model | ADR-0007, C-11 |
| REQ-10 | Developer-only validators (V-01..V-15) plus eval and compatibility suites | C-12, C-13 |
| EX-01..EX-07 | Markdown and JSON only. No executable components. | ADR-0005, V-09 |

## Step 02 research basis (documentation only, not verification)

| Row | Finding that shapes implementation | Source IDs | Open items |
|---|---|---|---|
| REQ-01 | Native install is documented for: Claude Code (CLI, VS Code, desktop), Codex (CLI, app), Copilot (CLI, VS Code, cloud agent). **The Codex IDE extension has no plugin support.** | S5, S13, S15, S18 | Q-02, U-03, U-04 |
| REQ-02 / REQ-03 | Description-driven implicit skill invocation is documented on all providers. It is probabilistic. | S7, S12, S17, S19 | U-05 |
| REQ-04 | Skills load only on match. No always-on component is needed. | S7, S12, S19 | — |
| REQ-05 | Listing budgets (Claude Code 1%, Codex 2% or 8,000 characters) cap the practical number of skills. This supports D-006. | S7, S12 | R-11, U-06 |
| REQ-06 | Progressive disclosure (metadata, then body, then references) is native on every provider. | S7, S12, S19, S24 | — |
| REQ-10 | `claude plugin validate` and `claude plugin eval` exist. No equivalent tooling was found for Codex or Copilot. | S3, S8 | U-08, R-07 |
| PRV-CC | Native format is `.claude-plugin/plugin.json` (optional) plus `.claude-plugin/marketplace.json`. | S3, S4 | U-01, R-09 |
| PRV-CX | Native format is the Agent Plugins root `plugin.json`. The marketplace is `.agents/plugins/marketplace.json`, or the legacy-compatible `.claude-plugin/marketplace.json`. | S10 | U-02, U-03, Q-02 |
| PRV-GH | Agent Plugins root `plugin.json`, or the legacy `.claude-plugin/plugin.json`. The marketplace can be `.claude-plugin/marketplace.json`. | S15, S18 | U-04, U-05, U-09 |

## Capability domains

Per-capability status (206 records) is kept in
`catalog/engineering-capabilities.yaml`, and it is checked by V-11. The
per-capability index is in [CAPABILITY_COVERAGE.md §10](CAPABILITY_COVERAGE.md#10-generated-tables).

A domain row is `IN_PROGRESS` when at least one of its capabilities is
IN_PROGRESS. Otherwise it is `PLANNED`. A domain becomes `IMPLEMENTED` or
`VERIFIED` only when every capability in it has reached that status.

| ID | Domain | Step | Capabilities | Implementation evidence | Verification method | Verification evidence | Status |
|---|---|---|---|---|---|---|---|
| CAP-D01 | REPOSITORY | 07 (catalog); recipes later | 9 (3 IN_PROGRESS, 6 PLANNED) | chayen-repository workflow, stack-detection.md | Per-capability verification in the catalog (trigger + behaviour eval) | Catalog records V-11 PASS; capability behaviour evals: NOT_RUN | IN_PROGRESS |
| CAP-D02 | REQUIREMENTS | 07 (catalog); recipes later | 10 (0 IN_PROGRESS, 10 PLANNED) | — | Per-capability verification in the catalog (trigger + behaviour eval) | Catalog records V-11 PASS; capability behaviour evals: NOT_RUN | PLANNED |
| CAP-D03 | ARCHITECTURE | 07 (catalog); recipes later | 10 (0 IN_PROGRESS, 10 PLANNED) | — | Per-capability verification in the catalog (trigger + behaviour eval) | Catalog records V-11 PASS; capability behaviour evals: NOT_RUN | PLANNED |
| CAP-D04 | PLANNING | 07 (catalog); recipes later | 8 (4 IN_PROGRESS, 4 PLANNED) | task-contract.md, change-summary.md, chayen-implementation workflow | Per-capability verification in the catalog (trigger + behaviour eval) | Catalog records V-11 PASS; capability behaviour evals: NOT_RUN | IN_PROGRESS |
| CAP-D05 | IMPLEMENTATION | 07 (catalog); recipes later | 12 (3 IN_PROGRESS, 9 PLANNED) | chayen-implementation workflow and principles | Per-capability verification in the catalog (trigger + behaviour eval) | Catalog records V-11 PASS; capability behaviour evals: NOT_RUN | IN_PROGRESS |
| CAP-D06 | BACKEND | 07 (catalog); recipes later | 10 (2 IN_PROGRESS, 8 PLANNED) | chayen-backend workflow and 4 stack references | Per-capability verification in the catalog (trigger + behaviour eval) | Catalog records V-11 PASS; capability behaviour evals: NOT_RUN | IN_PROGRESS |
| CAP-D07 | FRONTEND | 07 (catalog); recipes later | 10 (3 IN_PROGRESS, 7 PLANNED) | chayen-frontend workflow and 3 framework references | Per-capability verification in the catalog (trigger + behaviour eval) | Catalog records V-11 PASS; capability behaviour evals: NOT_RUN | IN_PROGRESS |
| CAP-D08 | MOBILE-DESKTOP | 07 (catalog); recipes later | 8 (0 IN_PROGRESS, 8 PLANNED) | — (scope Q-11) | Per-capability verification in the catalog (trigger + behaviour eval) | Catalog records V-11 PASS; capability behaviour evals: NOT_RUN | PLANNED |
| CAP-D09 | DATABASE-DATA | 07 (catalog); recipes later | 12 (0 IN_PROGRESS, 12 PLANNED) | — | Per-capability verification in the catalog (trigger + behaviour eval) | Catalog records V-11 PASS; capability behaviour evals: NOT_RUN | PLANNED |
| CAP-D10 | TESTING-QA | 07 (catalog); recipes later | 14 (6 IN_PROGRESS, 8 PLANNED) | chayen-testing workflow and 3 stack testing references | Per-capability verification in the catalog (trigger + behaviour eval) | Catalog records V-11 PASS; capability behaviour evals: NOT_RUN | IN_PROGRESS |
| CAP-D11 | SECURITY-PRIVACY | 07 (catalog); recipes later | 14 (9 IN_PROGRESS, 5 PLANNED) | review-checklist.md, stack-hardening.md, chayen-security workflow | Per-capability verification in the catalog (trigger + behaviour eval) | Catalog records V-11 PASS; capability behaviour evals: NOT_RUN | IN_PROGRESS |
| CAP-D12 | PERFORMANCE | 07 (catalog); recipes later | 10 (0 IN_PROGRESS, 10 PLANNED) | — | Per-capability verification in the catalog (trigger + behaviour eval) | Catalog records V-11 PASS; capability behaviour evals: NOT_RUN | PLANNED |
| CAP-D13 | DEVOPS | 07 (catalog); recipes later | 12 (0 IN_PROGRESS, 12 PLANNED) | — | Per-capability verification in the catalog (trigger + behaviour eval) | Catalog records V-11 PASS; capability behaviour evals: NOT_RUN | PLANNED |
| CAP-D14 | OPERATIONS-SRE | 07 (catalog); recipes later | 10 (0 IN_PROGRESS, 10 PLANNED) | — | Per-capability verification in the catalog (trigger + behaviour eval) | Catalog records V-11 PASS; capability behaviour evals: NOT_RUN | PLANNED |
| CAP-D15 | MODERNIZATION | 07 (catalog); recipes later | 10 (0 IN_PROGRESS, 10 PLANNED) | — | Per-capability verification in the catalog (trigger + behaviour eval) | Catalog records V-11 PASS; capability behaviour evals: NOT_RUN | PLANNED |
| CAP-D16 | DOCUMENTATION | 07 (catalog); recipes later | 10 (0 IN_PROGRESS, 10 PLANNED) | — | Per-capability verification in the catalog (trigger + behaviour eval) | Catalog records V-11 PASS; capability behaviour evals: NOT_RUN | PLANNED |
| CAP-D17 | AI-ML-LLM | 07 (catalog); recipes later | 10 (0 IN_PROGRESS, 10 PLANNED) | — | Per-capability verification in the catalog (trigger + behaviour eval) | Catalog records V-11 PASS; capability behaviour evals: NOT_RUN | PLANNED |
| CAP-D18 | GOVERNANCE | 07 (catalog); recipes later | 10 (1 IN_PROGRESS, 9 PLANNED) | change-summary.md (change passport) | Per-capability verification in the catalog (trigger + behaviour eval) | Catalog records V-11 PASS; capability behaviour evals: NOT_RUN | IN_PROGRESS |
| CAP-D19 | SPECIALIZED | 07 (catalog); recipes later | 9 (0 IN_PROGRESS, 9 PLANNED) | — | Per-capability verification in the catalog (trigger + behaviour eval) | Catalog records V-11 PASS; capability behaviour evals: NOT_RUN | PLANNED |
| CAP-D20 | AGENT-ENGINEERING | 07 (catalog); recipes later | 8 (0 IN_PROGRESS, 8 PLANNED) | — | Per-capability verification in the catalog (trigger + behaviour eval) | Catalog records V-11 PASS; capability behaviour evals: NOT_RUN | PLANNED |

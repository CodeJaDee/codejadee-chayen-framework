# Acceptance Matrix

Every requirement is traced through its planned step, implementation
evidence, verification method, and verification evidence. Status vocabulary
is defined in [BUILD_CONTRACT.md](BUILD_CONTRACT.md) §5.1.

A row may be marked `VERIFIED` only when its verification evidence column
cites an executed test and its recorded result (BC-10, BC-13).

**Snapshot:** after Step 06 (2026-10-14).

## Summary

| Category | Rows | PLANNED | IN_PROGRESS | IMPLEMENTED | VERIFIED |
|---|---|---|---|---|---|
| Governance (GOV) | 14 | 0 | 0 | 14 | 0 |
| Core requirements (REQ) | 10 | 1 | 9 | 0 | 0 |
| Exclusions (EX) | 7 | 0 | 0 | 7 | 0 |
| Providers (PRV) | 3 | 0 | 3 | 0 | 0 |
| Stack coverage (STK) | 14 | 1 | 13 | 0 | 0 |
| Architecture components (ARC) | 14 | 2 | 6 | 6 | 0 |
| **Total** | **62** | **4** | **31** | **27** | **0** |

Step 06 executed native lifecycle tests (24/24 on 3 CLIs) and routing tests
on Claude Code, Codex, and Copilot. Details are in
[POC_REPORT.md](POC_REPORT.md).

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

## Core requirements

| ID | Requirement | Step(s) | Implementation evidence | Verification method | Verification evidence | Status |
|---|---|---|---|---|---|---|
| REQ-01 | Native plugin installation and lifecycle | 02, 04, 06–08, 21 | `plugins/codejadee-chayen-framework/`, the three marketplace files (Step 04) | Clean install, update, and uninstall through each provider's native mechanism, with commands and output recorded | Step 06 run-lifecycle.sh 24/24 (Claude 2.1.270, Codex 0.160.1, Copilot 1.0.97; isolated homes; local marketplace). VS Code surfaces: NOT TESTED (manual procedures in tests/provider-compatibility/). Codex IDE: UNSUPPORTED. Remote GitHub marketplace: NOT TESTED. See POC_REPORT.md | IN_PROGRESS |
| REQ-02 | Automatic skill discovery from ordinary prompts | 04, 10, 05, 06 | 6 pilot entry skills (plugins/codejadee-chayen-framework/skills/chayen-*/SKILL.md), descriptions per D-017 | Positive trigger suite per provider, measured activation rate | Step 06 routing: Codex 3/3, Copilot 3/3 (clean env), Claude eval positives 20/27 run 1 (23/27 triggered at least once); single runs only, no statistical baseline; competing personal skills can win (POC_REPORT §4) | IN_PROGRESS |
| REQ-03 | No explicit Chayen invocation required | 04, 10, 05, 06 | Skill descriptions need no plugin mention; trigger cases forbid "Chayen" in prompts (V-16) | Trigger suite prompts contain no "Chayen" or plugin reference | Step 06: all routing prompts omit Chayen; positives triggered on all three CLIs. Under-triggering for implementation/repository/security prompts on Claude (empty workspace) | IN_PROGRESS |
| REQ-04 | No applicable skill means native AI behaviour | 04, 10, 05, 06 | No hooks/always-on components; `Not for` clauses; no-match gate sentence in every skill (V-17) | Negative trigger suite: no skill activation on unrelated prompts. Validator: no always-on injection (D-007) | Step 06: irrelevant prompts silent 10/10 (Claude 8/8, Codex 1/1, Copilot 1/1); unsupported silent Claude 7/7, Codex 2/2, Copilot 0/2 (over-activation, guidance not misapplied per agent transcript review) | IN_PROGRESS |
| REQ-05 | 206 capabilities in 20 domains | 03, 11–19 | — | Validator coverage check: every catalog ID maps to skill content, counts = 206 / 20 | — | PLANNED |
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
| STK-01 | C# / ASP.NET Core Web API | Primary | 11, 05 | Pilot guidance in skill-local references (Step 05) | Catalog coverage + trigger suite | V-06/V-08/V-12 PASS; catalog coverage and trigger suite: NOT_RUN | IN_PROGRESS |
| STK-02 | Angular / TypeScript | Primary | 12, 05 | Pilot guidance in skill-local references (Step 05) | Catalog coverage + trigger suite | V-06/V-08/V-12 PASS; catalog coverage and trigger suite: NOT_RUN | IN_PROGRESS |
| STK-03 | Microsoft SQL Server | Primary | 13, 05 | Pilot guidance in skill-local references (Step 05) | Catalog coverage + trigger suite | V-06/V-08/V-12 PASS; catalog coverage and trigger suite: NOT_RUN | IN_PROGRESS |
| STK-04 | JavaScript / TypeScript | Additional | 14, 05 | Pilot guidance in skill-local references (Step 05) | Catalog coverage + trigger suite | V-06/V-08/V-12 PASS; catalog coverage and trigger suite: NOT_RUN | IN_PROGRESS |
| STK-05 | React | Additional | 14, 05 | Pilot guidance in skill-local references (Step 05) | Catalog coverage + trigger suite | V-06/V-08/V-12 PASS; catalog coverage and trigger suite: NOT_RUN | IN_PROGRESS |
| STK-06 | Next.js | Additional | 14, 05 | Pilot guidance in skill-local references (Step 05) | Catalog coverage + trigger suite | V-06/V-08/V-12 PASS; catalog coverage and trigger suite: NOT_RUN | IN_PROGRESS |
| STK-07 | Vue | Additional | 15, 05 | Pilot guidance in skill-local references (Step 05) | Catalog coverage + trigger suite | V-06/V-08/V-12 PASS; catalog coverage and trigger suite: NOT_RUN | IN_PROGRESS |
| STK-08 | Nuxt | Additional | 15, 05 | Pilot guidance in skill-local references (Step 05) | Catalog coverage + trigger suite | V-06/V-08/V-12 PASS; catalog coverage and trigger suite: NOT_RUN | IN_PROGRESS |
| STK-09 | Vite | Additional | 15, 05 | Pilot guidance in skill-local references (Step 05) | Catalog coverage + trigger suite | V-06/V-08/V-12 PASS; catalog coverage and trigger suite: NOT_RUN | IN_PROGRESS |
| STK-10 | Nitro | Additional | 16, 05 | Pilot guidance in skill-local references (Step 05) | Catalog coverage + trigger suite | V-06/V-08/V-12 PASS; catalog coverage and trigger suite: NOT_RUN | IN_PROGRESS |
| STK-11 | Elysia | Additional | 16, 05 | Pilot guidance in skill-local references (Step 05) | Catalog coverage + trigger suite | V-06/V-08/V-12 PASS; catalog coverage and trigger suite: NOT_RUN | IN_PROGRESS |
| STK-12 | Python | Additional | 17, 05 | Pilot guidance in skill-local references (Step 05) | Catalog coverage + trigger suite | V-06/V-08/V-12 PASS; catalog coverage and trigger suite: NOT_RUN | IN_PROGRESS |
| STK-13 | PostgreSQL | Additional | 17, 05 | Pilot guidance in skill-local references (Step 05) | Catalog coverage + trigger suite | V-06/V-08/V-12 PASS; catalog coverage and trigger suite: NOT_RUN | IN_PROGRESS |
| STK-14 | Java | Optional extension | 19 | — | Catalog coverage + trigger suite (only if Q-08 approves) | — | PLANNED |

## Architecture components (design: ARCHITECTURE.md §3–§4)

| ID | Component | Planned step(s) | Implementation evidence | Verification method | Verification evidence | Status |
|---|---|---|---|---|---|---|
| ARC-01 | C-01 Portable Plugin Package | 04, 06 | `plugins/codejadee-chayen-framework/` (manifests, README, `skills/` canonical source; 0 skills) | V-09, V-13, X-01, plus install on each surface | V-09 PASS, V-13 PASS, X-01 PASS. Local installs: see REQ-01. Install on every surface: NOT_RUN. | IMPLEMENTED |
| ARC-02 | C-02 Provider Compatibility Metadata | 04, 06–08 | `plugins/codejadee-chayen-framework/plugin.json`, `.../.claude-plugin/plugin.json` | V-01..V-04, X-01, install tests (U-01, U-02) | V-02 PASS, plus **official Agent Plugins 1.0.0 JSON Schema** (ajv 2020) PASS with 4/4 negative controls rejected. V-03 PASS, V-04 PASS, X-01 PASS. | IMPLEMENTED |
| ARC-03 | C-03 Engineering Capability Catalog | 04 | — | V-11 (schema, 20/206 counts, mapping integrity) | — | PLANNED |
| ARC-04 | C-04 Entry Skills (≤14) | 04 (set), 09–18 (content), 05 | 6 pilot entry skills in plugins/codejadee-chayen-framework/skills/ (D-015) | V-05..V-07, positive trigger suite | V-05, V-07 (L0 2292/4000 chars), V-07b (max overlap 0.14), V-17 PASS; skills-ref validate 6/6 valid; claude plugin validate --strict PASS; positive trigger suite: NOT_RUN | IMPLEMENTED |
| ARC-05 | C-05 Technology Reference Packs | 11–19, 05 | Skill-local stack references (D-016): aspnetcore-webapi, data-access, node-servers, python-web-apis, angular, react-nextjs, vue-nuxt, dotnet/javascript/python testing, stack-hardening, stack-detection | V-06, V-08, V-12, behavioural suite | V-06, V-08, V-12 PASS; behavioural suite: NOT_RUN; shared knowledge packs deferred (U-11/U-13) | IN_PROGRESS |
| ARC-06 | C-06 Skill Applicability Rules | 09, 05, 06 | When to use / When not to use / gate sentence / precedence in every SKILL.md | Negative, gate, and convention-conflict suites (ADR-0003) | V-17 PASS; Step 06 negative suite 10/10 silent; unsupported: Claude 7/7, Codex 2/2 silent, Copilot 0/2 (gate did not prevent activation; no misapplied guidance observed) | IMPLEMENTED |
| ARC-07 | C-07 Progressive Reference Loading | 05, 09 | Routing tables load one reference per detected stack; ≤2 hops; skill-local | V-06..V-08, reference-load checks (U-11, AS-04) | V-06, V-08 PASS; reference-load checks: NOT_RUN | IN_PROGRESS |
| ARC-08 | C-08 Composite Development Workflows | 09 | — | V-06, V-08, behavioural suite | — | PLANNED |
| ARC-09 | C-09 Task Contract Templates | 09, 05 | plugins/codejadee-chayen-framework/skills/chayen-implementation/references/task-contract.md | V-12, behavioural suite (contract produced when required) | V-12 PASS; behaviour: NOT_RUN | IN_PROGRESS |
| ARC-10 | C-10 Evidence and Change Passport Templates | 09, 05 | plugins/codejadee-chayen-framework/skills/chayen-implementation/references/change-summary.md; verification tables in all skills | V-12, behavioural suite (NOT_RUN reported honestly) | V-12 PASS; behaviour: NOT_RUN | IN_PROGRESS |
| ARC-11 | C-11 Security and Trust Guidance | 09, 05 | plugins/codejadee-chayen-framework/skills/chayen-security/ (SKILL.md, review-checklist.md, stack-hardening.md) | V-10, security behaviour cases (ADR-0007) | V-10 PASS; security behaviour cases: NOT_RUN | IMPLEMENTED |
| ARC-12 | C-12 Developer-only Validators | 04, 05 | tools/validate/validate-package.mjs: V-01a–c, V-02–V-10, V-12, V-13, V-16, V-17 (zero deps) | Validator self-tests on good and bad fixtures | Repo: 0 errors 0 warnings. Mutated copies: Step 04 (12 errors) and Step 05 (21 errors) all injected faults detected. CI + committed fixtures: NOT_RUN; V-11, V-14, V-15 not implemented | IN_PROGRESS |
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

## Capability rows

The 206 capability rows (`CAP-<domain>-<nnn>`) will be added in Step 03, once
the user approves the catalog (Q-01). Until then, REQ-05 tracks them as one
aggregate row.

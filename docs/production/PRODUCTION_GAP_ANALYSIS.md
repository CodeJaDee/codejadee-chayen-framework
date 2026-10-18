# Production Gap Analysis (Phase 1 Baseline)

| Field | Value |
|---|---|
| Phase | 1 of 8: independent baseline. Nothing in the product was remediated |
| Date | 2026-10-18 |
| Git revision | `1734ea50ca7695e9b4b51e343002bcb0188b0be9` on `main` (= `origin/main`, no tags) |
| Build under audit | Plugin `chayen` `0.1.0-dev`, marketplace `codejadee`. 15 Entry Skills (13 engineering, 2 writing), 237 references, 256 package files |
| Evidence log | [PHASE_01_EVIDENCE.md](PHASE_01_EVIDENCE.md) (commands E-01..E-31, exit codes, counts) |
| Gate baseline | [PRODUCTION_READINESS_MATRIX.md](PRODUCTION_READINESS_MATRIX.md) |
| Method | We re-ran every non-destructive local check and independently recounted the inventory. Historical claims were rechecked against today's tree. Earlier reports were used as leads, not as evidence |

## 1. Executive summary

**Verdict: NOT PRODUCTION READY.** That covers a public release and a
production rollout. **An internal pilot is also blocked** until P1-001 and
P1-002 are cleared.

The static product is in good shape:
- All 13 repository gate groups pass, along with 179/179 negative controls, 34/34 security boundary tests, 19/19 policy fixtures and 15/15 identity checks.
- `claude plugin validate --strict` passes on Claude Code 2.1.302.
- We independently confirmed the historical scope of 15 skills, 206 Engineering Capabilities, 108 Technology Capabilities and 12 Workflows.
- The package is 254 Markdown files and 2 JSON files from a single skills source, with no executable components.

**Status of the architecture constraints:**
- **Preserved:** Native Agent Plugin, one shared skills source, static Markdown/JSON package.
- **Violated:** the stated scope. Nitro and Elysia are out of scope, but the product presents them as supported, including in routing metadata (P1-007).

The gaps are mostly **evidence and governance gaps**:
- No behaviour of the current build has been observed on any provider.
- No capability is VERIFIED.
- There is no CI, licence, security contact, released version or tag.

A smaller set of real **implementation defects** also exists: scope conformance, a Thai skill description, unguarded licence notice, lifecycle tooling, and stale release documentation.

| Severity | Count | Findings |
|---|---|---|
| Critical | 2 | P1-001, P1-002 |
| High | 9 | P1-003, P1-004, P1-005, P1-007, P1-008, P1-010, P1-011, P1-016, P1-022 |
| Medium | 13 | P1-006, P1-009, P1-012, P1-013, P1-015, P1-017, P1-018, P1-019, P1-020, P1-021, P1-023, P1-024, P1-035 |
| Low | 9 | P1-014, P1-026, P1-027, P1-029, P1-030, P1-031, P1-032, P1-033, P1-036 |
| Info | 3 | P1-025, P1-028, P1-034 |

| Classification | Findings |
|---|---|
| Implementation defect (product or tooling) | P1-007, P1-012, P1-013, P1-014, P1-016, P1-018, P1-030, P1-031 |
| Documentation defect | P1-009, P1-019, P1-020, P1-028, P1-036 |
| Missing test evidence | P1-001, P1-008, P1-010, P1-015, P1-022, P1-023, P1-024, P1-027, P1-033, P1-035 |
| External provider limitation | P1-025 |
| Owner decision | P1-002, P1-003, P1-004, P1-005, P1-006, P1-011, P1-017, P1-021, P1-026, P1-032 |
| No defect (baseline record) | P1-029, P1-034 |

Several findings combine classes. The table gives the primary class, and
each finding records any secondary class.

### Severity scale

| Severity | Meaning |
|---|---|
| Critical | Blocks any distribution, including a limited internal pilot |
| High | Blocks public release or a production claim |
| Medium | Must be fixed or formally accepted before general availability |
| Low | Quality or hygiene. Fix when convenient |
| Info | Baseline fact recorded for traceability |

### Status vocabulary

| Status | Meaning in this document |
|---|---|
| PASS | Checked in Phase 1 and satisfied; static checks only, unless stated otherwise |
| FAIL | Checked in Phase 1 and not satisfied |
| NOT_RUN | Could be executed, but was not executed in Phase 1 |
| BLOCKED | Cannot run until an owner decision, authorization, reviewer or tool exists |
| NOT_APPLICABLE | Outside the product's control (external), or no remediation applies |

## 2. Scope and inventory revalidation

| Item | Historical scope | Independent count (Phase 1) | Result |
|---|---|---|---|
| Entry Skills | 15 (13 engineering + 2 writing) | 15 `SKILL.md`, names equal directories, frontmatter `name` and `description` only | Match |
| References | 237 | 237 (per skill: ai 13, arch 11, backend 24, data 28, devops 23, docs 8, frontend 33, hum-en 9, hum-th 7, impl 31, perf 8, repo 8, req 6, sec 12, test 16) | Match |
| Package files | 256 | 256 (254 `.md`, 2 `.json`) | Match |
| Engineering Capabilities | 206 in 20 domains | 206 unique IDs and names, 20 domains, fingerprint `2f13cad24ff431e3` | Match; all IMPLEMENTED, 0 VERIFIED |
| Technology Capabilities | 108 | 108 in 11 packs; **no** Nitro, Elysia, Python or Java pack | Match; all IMPLEMENTED, 0 VERIFIED |
| Composite Workflows | 12 | 12 workflows, 7 templates, 0 dangling references, nothing points outside the package | Match; all IMPLEMENTED, 0 VERIFIED |
| Editorial registrations | 2 | 2, descriptions byte-identical to `SKILL.md` | Match |
| L0 metadata | ≤ 6,500 characters (D-052) | 6,221 characters | Within budget; the count ceiling of 15 is reached (D-053) |
| Engineering skill content since Step 34 | — | No changes under the 13 engineering skill directories since `1106226`; engineering metadata fingerprint `c1fee9b169c42ba3` unchanged | Step 34 engineering content baseline still applies |

## 3. Findings

Each finding uses the same fields: severity and classification, source
evidence, impact, root cause, required remediation, acceptance criteria,
verification method and status. Evidence IDs `E-nn` refer to
[PHASE_01_EVIDENCE.md](PHASE_01_EVIDENCE.md).

### 3.1 Native packaging and plugin lifecycle

#### P1-001: No native lifecycle evidence for the current build on any provider

- **Severity / class:** Critical / Missing test evidence
- **Source evidence:**
  - The last executed lifecycle was on 2026-10-14, on a 6-skill build under the old identifier `codejadee-chayen-framework@codejadee` (`tests/provider-compatibility/results/2026-10-14-step06.md:56-66`).
  - KL-30 and R-53 are open, and `INSTALL_CODEX.md:41` says the rename commands are "not yet run".
  - The Claude Code VS Code extension and VS Code Copilot Chat have never been tested (`tests/provider-compatibility/claude-code-vscode.md:3`).
  - The GitHub remote marketplace has never been tested (E-30: no tags; E-31: private).
- **Impact:** The 15-skill `chayen` build has never been installed, disabled, enabled, updated or uninstalled through any native mechanism. The plugin identifier changed in `1734ea5`, so earlier install evidence does not carry over.
- **Root cause:**
  - The lifecycle opt-in was denied in Step 31 and never re-authorized.
  - Copilot CLI is not installed on the audit machine.
- **Required remediation:** From a frozen, versioned candidate commit, execute the native lifecycle (marketplace add, install, details or list, disable, enable, update from the previous version, uninstall, marketplace remove) on Claude Code CLI, Codex CLI and Copilot CLI ≥ 1.0.91. Use isolated config homes. Run the two VS Code manual procedures with a person.
- **Acceptance criteria:**
  - Each pilot or release provider has a dated result file that names the revision, CLI version, skill count (15) and identifier `chayen@codejadee`.
  - Every lifecycle step passes, or the provider is formally excluded.
  - An uninstall that only disables the plugin is recorded as FAIL or as a documented limitation, never as PASS.
- **Verification:** Corrected `run-lifecycle.sh` (see P1-018), runbook R-1..R-10, and manual VS Code procedures. The results are reviewed against `docs/COMPATIBILITY_MATRIX.md`.
- **Status:** BLOCKED (owner authorization, isolated profiles and Copilot CLI needed)

#### P1-002: Release version and tag strategy not set

- **Severity / class:** Critical / Owner decision (secondary: implementation)
- **Source evidence:**
  - `version` is `0.1.0-dev` in `plugin.json:4`, `.claude-plugin/plugin.json:3` and `.github/plugin/marketplace.json:8,14`.
  - There are no tags locally or on the remote (E-30).
  - D-058 proposes `0.1.0-rc.1`, but the historical readiness section proposes `0.1.0-pilot.1`.
  - ADR-0008:34-36 specifies `vX.Y.Z` tags. `RELEASE_CHECKLIST.md:112-113` uses `claude plugin tag`, which produces `chayen--v{version}`.
- **Impact:**
  - Claude Code pins installs by version (R-54, KL-31). Existing installs may never receive new content, because the version has not moved across 6, 13 and 15 skills and the rename.
  - Users cannot pin a release.
  - Security guidance to "pin a tag" (ADR-0007 B-04) cannot be followed.
- **Root cause:** Version approval was deferred to the owner (D-058). No release process has been run.
- **Required remediation:**
  - The owner approves a version scheme and the next version, and picks one tag format.
  - The maintainer applies the version in all four fields, re-runs parity (IC-05, IC-06, V-04) and moves the CHANGELOG section.
- **Acceptance criteria:**
  - All four version fields are equal and not `-dev`.
  - The tag format is recorded in one decision, and ADR-0008 and the checklist agree.
  - Identity check is 15/15 PASS.
  - The update path from the previous version is exercised in P1-001.
- **Verification:** `node tests/provider-compatibility/check-identity.mjs`, `node tools/validate/validate-all.mjs`, and Claude Code `plugin update` during the lifecycle run.
- **Status:** FAIL

#### P1-018: Lifecycle script and runbook defects

- **Severity / class:** Medium / Implementation defect (tooling)
- **Source evidence:**
  - `tests/provider-compatibility/run-lifecycle.sh:4` claims disable and enable for every CLI. The Codex block (`:62-72`) has neither step.
  - The Copilot uninstall check (`:82`) tests only the exit code, but docs record that a local uninstall may only disable the plugin.
  - `COPILOT_AUTO_UPDATE=false` is not set, so Copilot can update itself outside the isolated home (`results/2026-10-14-step06.md:150`, README `:55`).
  - No step covers `update`, although RELEASE_CHECKLIST §D requires it.
  - Config fingerprinting (R-0) is manual only.
- **Impact:**
  - The release gate can report a false PASS on Copilot uninstall.
  - The script cannot produce the evidence that P1-001 requires for Codex disable/enable or for update on any provider.
  - A run can change state outside the isolated home.
- **Root cause:** The script was written for the Step 06 smoke run and never extended to the release checklist.
- **Required remediation:**
  - Add the missing steps.
  - Assert that the plugin is absent after uninstall, not only that the command exited 0.
  - Export `COPILOT_AUTO_UPDATE=false`.
  - Fingerprint the real config homes before and after the run.
  - Keep the authorization guard.
- **Acceptance criteria:**
  - Script steps cover the RELEASE_CHECKLIST §D list for each CLI.
  - Uninstall assertions check absence.
  - A dry review shows no write outside `$WORK`, apart from documented provider caches.
  - The script and README agree.
- **Verification:** Code review. Add a static test that greps the script for each required step. The real execution is part of P1-001.
- **Status:** FAIL

#### P1-019: Lifecycle runbook expects 13 skills

- **Severity / class:** Medium / Documentation defect
- **Source evidence:** `tests/provider-compatibility/README.md:91, 113, 141, 170, 186, 229, 231, 255` expect 13 skills. Examples: "Skills (13)" and "Installed 13 skills". The build has 15.
- **Impact:** An operator following the release-gate runbook records a false FAIL, or edits expectations by hand.
- **Root cause:** The runbook was not updated when the writing skills were added (Steps 37–38). `run-lifecycle.sh:34` derives N from disk, which is correct, so only the manual runbook drifted.
- **Required remediation:**
  - Replace the fixed counts with "N (derive with `find … -name SKILL.md | wc -l`; currently 15)".
  - Add a docs check that compares runbook skill counts with the package.
- **Acceptance criteria:**
  - No fixed count in the runbook disagrees with the package.
  - `check-docs.mjs`, or a new rule, fails on a mismatch.
- **Verification:** `node tools/validate/check-docs.mjs`, plus a validator negative control.
- **Status:** FAIL

#### P1-025: External provider limitations

- **Severity / class:** Info / External provider limitation
- **Source evidence:** KL-06 (Codex IDE does not support plugins); KL-07 (Claude Code cloud sessions do not load local plugins); KL-32 (Codex has no per-plugin update, and disable works only through `config.toml`); KL-33 (Copilot CLI needs ≥ 1.0.91 for enable/disable, uninstall from a local marketplace may only disable, and a same-name skill overrides silently); KL-35 (org policy `ChatPluginsEnabled`); U-05 (auto-invocation of plugin skills in VS Code Copilot Chat is undocumented).
- **Impact:** Some surfaces cannot be supported, or only partly. The product cannot fix these limitations; it can only disclose them.
- **Root cause:** Provider platform behaviour.
- **Required remediation:**
  - Keep the limitations disclosed in `docs/COMPATIBILITY_MATRIX.md` and the install guides.
  - Re-check them against the provider versions used in P1-001.
  - The owner confirms the Codex IDE position (Q-02).
- **Acceptance criteria:** Each limitation is listed with its provider version and check date, and none is presented as supported.
- **Verification:** Documentation review after the lifecycle runs.
- **Status:** NOT_APPLICABLE. Disclosure currently PASSes on static review.

#### P1-026: Codex marketplace fields copied from an example

- **Severity / class:** Low / Owner decision
- **Source evidence:**
  - `.agents/plugins/marketplace.json:15` sets `"authentication": "ON_INSTALL"`, and `:17` sets `"category": "Productivity"`, for a plugin that needs no authentication.
  - R-18 is open.
  - `PLUGIN_TRUST_REVIEW.md:44` marks the UI effect UNVERIFIED and has a stale `#L17` anchor.
- **Impact:** Codex may show an unnecessary authentication prompt, or a misleading install flow.
- **Root cause:** The values came from a documentation example without schema confirmation.
- **Required remediation:** Confirm the field semantics against the official Codex schema. If they are not required, remove them or set accurate values. Fix the anchor.
- **Acceptance criteria:** The field values are cited to a dated official source, and a Codex install in P1-001 shows no authentication step.
- **Verification:** Source review, then the Codex lifecycle run.
- **Status:** FAIL

#### P1-027: Codex manifest precedence inferred, not re-checked on 0.163.0

- **Severity / class:** Low / Missing test evidence
- **Source evidence:** `FINAL_PROVIDER_COMPATIBILITY.md:70` (Codex 0.160.1) says precedence is "inferred from adjacent string tables". The installed Codex is 0.163.0 (E-24), and Codex has no validator.
- **Impact:** If a later Codex prefers a manifest the package does not have, or a different field set, installs could change silently.
- **Root cause:** Codex offers no static validator. The evidence came from a binary string search.
- **Required remediation:** Confirm that Codex reads the root `plugin.json` during the Codex lifecycle run (P1-001), and record the CLI version.
- **Acceptance criteria:** The Codex lifecycle record shows `chayen` resolved from `plugins/codejadee-chayen-framework/plugin.json`, with 15 skills in the plugin cache.
- **Verification:** Codex lifecycle run.
- **Status:** NOT_RUN

#### P1-028: DF-02 / KL-53 does not reproduce on Claude Code 2.1.302

- **Severity / class:** Info / Documentation defect
- **Source evidence:** E-23: `claude plugin validate plugins/codejadee-chayen-framework/skills` exits 0 on 2.1.302. ISSUES DF-02 and KL-53 record a failure on earlier CLI versions.
- **Impact:** The open defect overstates the current problem.
- **Root cause:** A CLI version change.
- **Required remediation:** Record the reproduction result with the CLI version, and close DF-02 as version-specific or keep it scoped to the versions affected.
- **Acceptance criteria:** DF-02 and KL-53 name the affected and unaffected versions.
- **Verification:** Documentation review.
- **Status:** PASS (revalidated; documentation update pending)

### 3.2 Entry Skills, catalogs, workflows and scope

#### P1-007: Nitro and Elysia are presented as supported, against the out-of-scope constraint

- **Severity / class:** High / Implementation defect (secondary: owner decision)
- **Source evidence:**
  - `chayen-backend/SKILL.md:3` (L0 description, which drives routing) says "Node servers (Nitro, Elysia, Next.js or Nuxt routes)". Line 10 has the scope, line 18 the example "Create an Elysia route…", and line 201 links `references/node-servers.md`, which has dedicated sections "Nitro and Nuxt server routes" (`:22`) and "Elysia (Bun)" (`:61`).
  - About 35 further reference rows across 11 skills carry Nitro- or Elysia-specific guidance, for example `api-endpoints.md:66,68`, `authn-authz.md:82,84` and `stack-detection.md:82-87`.
  - `catalog/engineering-capabilities.yaml:51,54` lists `nitro, elysia` in `stack_packs` and `server-stacks`, which 28 capabilities use. CAP-06-002 has an Elysia positive trigger (`:1746`).
  - Tests expect `chayen-backend` for Elysia prompts: `tests/skills/trigger-cases.json:44` and `recipe-cases.json:955, 1153, 2244`.
  - Docs say "general guidance only" (`SUPPORTED_TECHNOLOGIES.md:48`, KL-12) and do not say out of scope. `PROJECT_CHARTER.md:84` lists them as "Additional" stacks.
- **Impact:**
  - Users and routing metadata are told the product covers Nitro and Elysia.
  - Agents will load the backend skill for those stacks and follow guidance that no fact check or technology pack backs.
  - This contradicts the stated production scope and DS-03 (`SKILL_AUTHORING_STANDARD.md:103`: unsupported stacks belong in the "Not for" clause).
- **Root cause:** The charter included them as additional stacks (STK-10..12). The out-of-scope position was never turned into a decision that removes or relabels the content.
- **Required remediation:**
  - **Owner decides** the policy, then the maintainer aligns every artifact with it. This is a content change inside existing skills, so it adds no new skill. The options are:
    - **(a)** Remove the Nitro/Elysia mentions from descriptions, scope lines, examples, catalog stack lists and positive cases. Add them to the "Not for" clause and `SUPPORTED_TECHNOLOGIES` out-of-scope table.
    - **(b)** Keep general Node guidance but remove the names from L0 metadata and examples. Label the reference content "unsupported, general guidance only".
  - Record the decision, and update the charter (STK rows) and acceptance matrix.
- **Acceptance criteria:**
  - No `SKILL.md` description, scope line or example names Nitro or Elysia as in scope.
  - The catalog and test cases agree with the decision.
  - `SUPPORTED_TECHNOLOGIES.md` lists them as out of scope.
  - All gates pass.
  - A grep of the package and catalogs finds only mentions the decision allows.
- **Verification:** `rg -i "nitro|elysia" plugins catalog tests/skills docs README.md`, `validate-all`, and trigger cases. Routing is re-measured in Phase 7, because the backend L0 description changes the metadata fingerprint (DS-09).
- **Status:** FAIL

#### P1-022: No capability or acceptance row is VERIFIED by behaviour

- **Severity / class:** High / Missing test evidence
- **Source evidence:**
  - All 206 engineering and 108 technology `verification_evidence` fields contain "NOT_RUN" for behaviour and trigger evals, and all 12 workflows are static only (E-05, E-06, E-07, E-18: "verified 0").
  - The acceptance matrix has 98 rows: 1 PLANNED, 23 IN_PROGRESS, 67 IMPLEMENTED and 7 VERIFIED. The 7 VERIFIED rows are the EX exclusions.
  - Both catalog headers still say `status: PROPOSED`.
  - Recipe (445), technology (295) and workflow (47) cases are specifications with no agent runner (KL-15).
- **Impact:** No production claim of capability correctness can be made. "IMPLEMENTED" means the content exists and passes static checks.
- **Root cause:** No behaviour-eval runner, and no authorization for billed runs.
- **Required remediation:**
  - Define a risk-based subset of capabilities and workflows for behaviour verification, at minimum the primary stacks and the 12 workflows.
  - Run them on at least one provider, with multiple runs and a no-plugin baseline.
  - Promote rows only from recorded evidence.
  - Alternatively, the owner formally accepts IMPLEMENTED as the release bar and discloses it.
- **Acceptance criteria:**
  - Either a documented owner acceptance of the IMPLEMENTED bar, or VERIFIED rows backed by recorded run files for the agreed subset.
  - No row is promoted without evidence (BC-10).
- **Verification:** Run artefacts under `tests/**/results`, and catalog status counts from `check-catalog.mjs` and `audit-coverage.mjs`.
- **Status:** NOT_RUN

#### P1-023: Framework fact checks mostly not executed

- **Severity / class:** Medium / Missing test evidence
- **Source evidence:**
  - In this phase, the JS packs gave 8 PASS / 0 FAIL / 48 NOT_RUN (E-25..E-27), because TypeScript, Angular, React, Next, Vue, Nuxt and Vite are unavailable.
  - .NET, SQL Server and PostgreSQL suites were not run because of side effects (Evidence §5).
  - The historical total is 107 PASS / 0 FAIL / 52 NOT_RUN out of 159 (KL-13), on single versions (KL-14).
- **Impact:** Technology guidance claims for Angular, React/Next and Vue/Nuxt/Vite are largely unexecuted.
- **Root cause:** The toolchains are not installed. The runners deliberately install nothing.
- **Required remediation:**
  - Provide a disposable environment (container or CI job) with pinned toolchains.
  - Run all six suites with `--report` and record results by version.
  - Clean up the `ChayenFacts` LocalDB afterwards (KL-42).
- **Acceptance criteria:**
  - All 152 defined fact checks are executed: PASS, or FAIL with an issue.
  - NOT_RUN is limited to facts the owner has explicitly accepted.
  - Versions are recorded.
- **Verification:** `tests/technology/*/run-fact-checks.mjs --report`.
- **Status:** NOT_RUN

#### P1-029: Five `SKILL.md` files exceed the 200-line soft target

- **Severity / class:** Low / No defect (quality warning)
- **Source evidence:** E-04 warns on V-06 SB-01: backend 219, data 205, devops 209, frontend 223 and implementation 217 lines. `SKILL_AUTHORING_STANDARD.md:60,139` sets 200 as a warning target and 300 as the error limit.
- **Impact:** Body token cost after activation is higher than the target. The hard limit is met.
- **Root cause:** Content growth in multi-stack skills.
- **Required remediation:** None required for release. Optionally move detail into references, since body changes do not affect L0 routing metadata.
- **Acceptance criteria:** All files stay ≤ 300 lines. Any warnings are accepted in the release record.
- **Verification:** `validate-package.mjs` V-06.
- **Status:** PASS (within hard limit)

#### P1-036: Stale or misleading routing and registration statements

- **Severity / class:** Low / Documentation defect
- **Source evidence:**
  - `docs/AUTOMATIC_SKILL_DISCOVERY.md:100` credits `/chayen:chayen-<name>` with a 2026-10-15 result. That run used `/codejadee-chayen-framework:` before the rename.
  - `SKILL_REGISTRATION.md:29` says the editorial records are "mapping: planned now", but they are `existing`.
  - `RELEASE_READINESS.md:182` says Codex and Copilot are "untested", while COMPATIBILITY_MATRIX records earlier-build results.
  - The catalog headers still say `status: PROPOSED`.
- **Impact:** Readers over-trust explicit invocation under the new namespace and misread registration state.
- **Root cause:** The rename and the skill additions were not propagated to every narrative document.
- **Required remediation:** Correct the statements and label the 2026-10-15 namespace result as historical.
- **Acceptance criteria:** No document attributes a measured result to a namespace or build it was not measured on.
- **Verification:** Documentation review, plus `check-docs.mjs`.
- **Status:** FAIL

### 3.3 Skill routing reliability

#### P1-008: No routing evidence for the current 15-skill build

- **Severity / class:** High / Missing test evidence
- **Source evidence:**
  - The current metadata fingerprint `86cf548cda5b08d5` (computed as in `run-provider-probes.mjs:72`) has never been measured.
  - None of the 8 recorded result files carries a `metadataFingerprint`.
  - The best historical evidence is Claude Code 2.1.270 on the 13-skill build (fingerprint `c1fee9b169c42ba3`), 43 runs: automatic **12/22 (55%)**, explicit 6/6, no-match 12/12, Next.js 0/5 (KL-20, KL-21).
  - Codex and Copilot were measured only on the 6-skill build (Copilot over-activated on Unity and SwiftUI, KL-25).
  - The simulated lexical proxy today gives top-1 0.535 and no-match 0.488 (E-19). This is not evidence.
- **Impact:** Routing reliability is unknown for what would ship. The only measured automatic rate (55%) would fail any reasonable production target, and the PROPOSED implicit target is ≥ 85%.
- **Root cause:**
  - Billed runs were not authorized after Step 34.
  - Two writing skills were added and the plugin was renamed since then.
  - Results were never fingerprinted, so they cannot be pooled by build.
- **Required remediation:**
  - After P1-007 and P1-012 have changed descriptions, freeze the candidate.
  - Run the engineering probes (`tests/evaluation/provider-probes.json`) and the 52 Step 40 discovery probes, at least 3 runs each, with a no-plugin baseline, on every release provider.
  - Record `metadataFingerprint` in every summary.
  - The owner approves routing targets. Otherwise the documented "use explicit invocation" stance is formally accepted and disclosed.
- **Acceptance criteria:**
  - Summaries exist for the frozen fingerprint on each release provider.
  - Automatic, explicit, no-match and wrong-skill rates are reported against approved targets.
  - Every result carries a fingerprint and a CLI version.
- **Verification:** `tests/evaluation/run-provider-probes.mjs`, `tools/evals/score-step40.mjs --probes …`, and `tools/evals/run-evaluation-suite.mjs --probes …`.
- **Status:** BLOCKED (authorization for billed runs; frozen candidate)

#### P1-009: Explicit invocation under the `chayen` namespace never measured

- **Severity / class:** Medium / Documentation defect (secondary: missing test evidence)
- **Source evidence:**
  - Commit `1734ea5` changed `run-provider-probes.mjs` from `/codejadee-chayen-framework:` to `/${pluginName}:`.
  - All explicit results (6/6) predate the change.
  - See also P1-036.
- **Impact:** The documented primary mitigation for unreliable automatic routing is explicit invocation, and it is unverified for the shipped identifier on every provider.
- **Root cause:** The rename was done after the last provider run.
- **Required remediation:** Include explicit probes using `/chayen:<skill>` (Claude Code), `$chayen-<skill>` (Codex) and `/chayen-<skill>` (Copilot) in the P1-008 runs. Correct the docs in the meantime.
- **Acceptance criteria:** Explicit invocation is 100% (the PROPOSED target) on each release provider for the frozen fingerprint, and the docs cite only those results.
- **Verification:** Provider probes (explicit group).
- **Status:** FAIL (docs); evidence BLOCKED

#### P1-015: Writing skills may capture engineering prompts

- **Severity / class:** Medium / Missing test evidence
- **Source evidence:**
  - R-62 is open. The lexical proxy moves `pos-frontend-i18n-angular` to the Thai skill and `amb-cache-catalogue` to the English skill.
  - Description terms overlap: "READMEs" and "docs" with `chayen-documentation` and `chayen-repository`, "UI microcopy" with `chayen-frontend`, and "developer replies" with the documentation skill.
  - The 8 engineering and 6 doc-overlap probes in `step40/discovery-probes.json` are NOT_RUN.
- **Impact:** Adding the writing skills could lower engineering routing that was measured before they existed.
- **Root cause:** Shared vocabulary in the L0 descriptions, and no native measurement.
- **Required remediation:** Measure as part of P1-008. If wrong-skill rate exceeds the target, tighten the "Not for" clauses within the L0 budget and re-measure.
- **Acceptance criteria:** Wrong skill ≤ 5% (PROPOSED target) on the engineering and overlap probes, with no regression against the Step 32/34 baseline beyond the agreed tolerance.
- **Verification:** Step 40 discovery probes plus engineering probes.
- **Status:** BLOCKED

### 3.4 Humanizer TH/EN and response style policy

#### P1-010: No provider or human evidence for the writing skills

- **Severity / class:** High / Missing test evidence
- **Source evidence:**
  - E-16: the scorer reports NOT_RUN for discovery, language quality, policy and human review.
  - `tests/evaluation/results/` holds only Step 32/34 engineering runs.
  - `HUMANIZER_EVALUATION_REPORT.md:10,163,225` confirms only static and simulated evidence exists.
  - All twelve MHR requirements are unverified: 0 VERIFIED, 4 IN_PROGRESS, 8 IMPLEMENTED.
- **Impact:**
  - Writing quality is unmeasured.
  - False-positive edits are unmeasured.
  - Meaning preservation and protected-span safety are unmeasured.
  - Language selection is unmeasured.
  - No quality claim can be made.
- **Root cause:** Billed runs are not authorized, there are no reviewers, and the rubric is unapproved (P1-011).
- **Required remediation:**
  - Run the Step 40 quality arms A/B on each release provider, using the 120 cases.
  - Score them automatically.
  - Have two fluent reviewers per language plus an adjudicator rate naturalness, clarity and tone.
- **Acceptance criteria:**
  - Results meet the approved targets. The PROPOSED targets are: language ≥ 4/5 on ≥ 90% of cases, zero critical preservation failures, and audit-only cases never edit files.
  - MHR rows are promoted only from that evidence.
- **Verification:** `tests/evaluation/step40/run-arms.mjs`, `tools/evals/score-step40.mjs --outputs … --reviews …`.
- **Status:** BLOCKED

#### P1-011: Rubric, threshold and reviewer independence not approved

- **Severity / class:** High / Owner decision
- **Source evidence:**
  - `HUMANIZER_EVALUATION_RUBRIC.md:7,24-25` is PROPOSED (D-057).
  - ADR-0011 is PROPOSED, and MHR-010 is BLOCKED.
  - No fluent reviewers have been nominated.
  - R-63 (the same agent wrote the skills and the dataset) is open. The 20% independent-case replacement is advisory only (rubric `:119-121`).
- **Impact:** Even after runs, results cannot be scored against an approved bar. Dataset bias is uncontrolled.
- **Root cause:** Owner approval is pending.
- **Required remediation:**
  - The owner approves or changes the rubric and the language threshold.
  - The owner nominates reviewers.
  - The owner makes independent case replacement mandatory, and sets its share.
- **Acceptance criteria:**
  - D-057 and ADR-0011 are ACCEPTED.
  - The reviewer roster is recorded.
  - At least the agreed share of cases was authored or replaced by an independent reviewer before scoring.
- **Verification:** Decision log review, and dataset provenance fields.
- **Status:** BLOCKED

#### P1-012: Thai skill description excludes the i18n work its body and tests target

- **Severity / class:** Medium / Implementation defect
- **Source evidence:**
  - `chayen-humanizer-th/SKILL.md:3`: "Not for … i18n and application code".
  - The same file's scope (`:10`) includes "localization files, and localizing existing copy into Thai". Its example (`:19`) is "Polish the Thai strings in locales/th.json…".
  - Trigger case `pos-humanizer-th-locale-strings` and Step 40 `s40-mx-19` expect the Thai skill for that work.
- **Impact:** Native discovery chooses skills from the description only. In-scope locale-string requests may under-trigger, or route to `chayen-frontend`.
- **Root cause:** The description's exclusion was written to keep i18n engineering (wiring, frameworks) out, but the wording also excludes Thai copy inside locale files.
- **Required remediation:** Reword the "Not for" clause to exclude i18n *engineering* (framework setup, key wiring) while admitting Thai copy in locale files. Stay within the L0 budget (279 characters free) and re-run the gates.
- **Acceptance criteria:**
  - The description, scope and cases are consistent.
  - V-07 ≤ 6,500.
  - V-07b distinctness passes.
  - The discovery probes for locale strings select the Thai skill (in P1-008).
- **Verification:** `validate-all`, then provider discovery probes.
- **Status:** FAIL

#### P1-013: Upstream MIT notice has no automated guard

- **Severity / class:** Medium / Implementation defect (tooling)
- **Source evidence:**
  - The notice is present at `chayen-humanizer-en/references/upstream-notice.md` (`:71`, "Copyright (c) 2025 Siqi Chen"). It is linked from `SKILL.md:164`, the READMEs and the user docs.
  - `grep -rl upstream-notice tools tests catalog` finds nothing (exit 1).
- **Impact:** Deleting or altering the notice would pass every gate and silently break the MIT notice condition in every distributed copy (KL-54).
- **Root cause:** The licensing obligation was documented but never encoded as a gate.
- **Required remediation:**
  - Add a validator rule: the notice file exists, contains the upstream licence text byte-identically (by hash) and is linked from `chayen-humanizer-en/SKILL.md`.
  - Add a negative control.
- **Acceptance criteria:**
  - Removing or editing the notice fails `validate-all`.
  - The self-tests include the new control.
- **Verification:** `run-validator-tests.mjs` with the new mutation, and `validate-all`.
- **Status:** FAIL

#### P1-014: Thai numerals and Buddhist Era dates not protected

- **Severity / class:** Low / Implementation defect (tooling and content)
- **Source evidence:**
  - `tools/evals/score-step40.mjs:62` `numberTokens` matches `\d` without the Unicode flag, which matches ASCII digits only. Thai digits (๐–๙) dropped or converted are not detected.
  - The TH protected-content guidance does not cover Thai numerals or พ.ศ./ค.ศ. date conversion.
- **Impact:** A rewrite that changes Thai-digit figures or converts era years could pass automated preservation scoring.
- **Root cause:** The scorer and guidance were designed around ASCII numbers.
- **Required remediation:**
  - Extend number extraction to Thai digits, with normalization.
  - Add scorer controls.
  - Add guidance that Thai numerals and era years are protected unless the user asks for conversion.
- **Acceptance criteria:** New scorer controls (Thai digit dropped, era converted) fail as expected. The self-test count increases and passes.
- **Verification:** `node tools/evals/score-step40.mjs --self-test`.
- **Status:** FAIL

#### P1-032: Translation direction scope (TH→EN) undefined

- **Severity / class:** Low / Owner decision
- **Source evidence:**
  - The Thai skill localizes into Thai (`SKILL.md:10`).
  - The English skill excludes translation (`chayen-humanizer-en/SKILL.md:10,27`).
  - MHR-002 covers a "Thai prompt/English target" language-selection case and refers to "a requested translation".
- **Impact:** Thai-to-English translation requests get no writing skill. That may be intended, but it is not recorded.
- **Root cause:** No explicit decision on translation scope.
- **Required remediation:** The owner records whether translation into English is in scope. If not, document it in `WRITING_AND_EDITING.md`. If so, adjust the English skill within constraints; no new skill is allowed.
- **Acceptance criteria:** A decision record exists, and the user docs match it.
- **Verification:** Documentation review.
- **Status:** FAIL (undecided)

#### P1-035: Response style policy host loading not tested

- **Severity / class:** Medium / Missing test evidence
- **Source evidence:**
  - Policy isolation passes statically: E-12, plus policy fixtures 19/19 (E-13).
  - Loading on Claude Code CLI and VS Code, Codex CLI, Codex IDE, Copilot CLI and VS Code Copilot Chat is NOT_RUN (RELEASE_READINESS §3).
  - VS Code Copilot Chat has a duplicate-load risk.
  - Some subagents and Copilot inline suggestions ignore the policy (KL-08).
- **Impact:** The opt-in policy's documented setup may not work as described on a given host.
- **Root cause:** No authorized disposable host profiles.
- **Required remediation:** Run the `docs/RESPONSE_STYLE.md` verify step and the policy arms (Step 40 policy group) in disposable profiles on each host where the policy is offered.
- **Acceptance criteria:** Each offered host records that the policy loads (or does not), with the version, and adherence is at or above the approved target (≥ 95% PROPOSED). Hosts that fail are marked unsupported.
- **Verification:** Step 40 policy arms, plus manual verification per host.
- **Status:** BLOCKED

### 3.5 Security architecture and permission boundaries

#### P1-004: No security contact or vulnerability disclosure channel

- **Severity / class:** High / Owner decision
- **Source evidence:** `SECURITY.md:16-25` says private vulnerability reporting is not enabled and no contact is published. KL-50 and R-56 are open.
- **Impact:** Reporters have no private channel. This blocks public release and is expected by marketplace directories.
- **Root cause:** Owner action pending.
- **Required remediation:** Enable GitHub private vulnerability reporting, or publish a monitored security contact. Update `SECURITY.md` with the scope and a response expectation.
- **Acceptance criteria:**
  - `SECURITY.md` names a working private channel.
  - A test report reaches the owner.
  - The repository settings show the feature enabled. This requires owner access.
- **Verification:** Owner confirmation, plus a repository settings review by the owner.
- **Status:** FAIL

#### P1-024: Adversarial prompt-injection and forged-approval tests not executed

- **Severity / class:** Medium / Missing test evidence
- **Source evidence:**
  - KL-40 and KL-44: the probes in `THREAT_MODEL.md:54-72` are NOT_RUN.
  - Writing-skill injection cases are ready but not run: th-37/38, en-37/38 and pol-13/14.
  - A static spot-check of skill content found no instruction to bypass approvals or obey embedded instructions. Both humanizer skills treat embedded instructions as text (`chayen-humanizer-en/SKILL.md:125,139,145`; `chayen-humanizer-th/SKILL.md:117,131,137`).
- **Impact:** The resistance of advisory guidance to injected content in edited files, CMS exports and README notes is unknown.
- **Root cause:** Billed runs were not authorized.
- **Required remediation:** Run the adversarial cases on each release provider, in test repositories with normal permission prompts.
- **Acceptance criteria:**
  - Zero cases where the agent executes, publishes or edits configuration because of injected text.
  - Every injection is reported to the user.
  - Results are recorded.
- **Verification:** Step 40 security cases through `run-arms.mjs`, plus the threat-model probes.
- **Status:** BLOCKED

#### P1-034: Static security posture and developer-tool boundary

- **Severity / class:** Info / No defect
- **Source evidence:**
  - E-02 V-25: 256 files, 0 errors. E-03: 34/34 boundary tests.
  - The package has only `.md`/`.json` files. `hooks/`, `agents/`, `commands/`, `.mcp.json` and `settings.json` are forbidden (`validate-package.mjs:212`). The frontmatter allowlist blocks `allowed-tools` (`:282`).
  - `tools/` and `tests/` sit outside the plugin source.
  - A GitHub-marketplace add clones the whole repository, including inert developer scripts and fixtures, to the user's disk.
- **Impact:** None for plugin behaviour. Users see developer files in the marketplace clone.
- **Root cause:** Native marketplace cloning behaviour.
- **Required remediation:** None required. Optionally note it in `SECURITY_AND_LIMITATIONS.md`.
- **Acceptance criteria:** The static security gates keep passing.
- **Verification:** `check-security.mjs`, `boundaries.test.mjs`.
- **Status:** PASS (static only; not a runtime guarantee)

### 3.6 CI/CD and branch governance

#### P1-016: No CI pipeline enforces the validators

- **Severity / class:** High / Implementation defect (secondary: owner decision)
- **Source evidence:**
  - `.github/` contains only `plugin/marketplace.json`. There is no workflow or pipeline file of any kind.
  - KL-52: "No CI pipeline".
  - REQ-10 is IN_PROGRESS with evidence "CI not set up".
  - `PLUGIN_PACKAGE_DESIGN.md:79` designs `.github/workflows/ci.yml`, which was never created.
- **Impact:** Every gate depends on a maintainer remembering to run it. Regressions (for example removing the MIT notice, or package composition drift) can reach `main` unnoticed.
- **Root cause:** CI was planned but not implemented.
- **Required remediation:**
  - Add a CI workflow on push and pull request that runs the offline gates: `validate-all`, `check-identity`, `run-evaluation-suite` (no `--write`) and `claude plugin validate --strict`, if the CLI is available in CI.
  - Pin the Node version and use least-privilege `permissions: contents: read`.
  - Run no billed or provider calls in CI.
  - The workflow file lives outside the plugin package, so the static-package constraint holds.
- **Acceptance criteria:**
  - CI runs on every PR and push to `main`.
  - A deliberately broken branch fails CI.
  - The workflow has no secrets and no network beyond the runner setup.
  - V-09 and V-25 still pass, so the package is unchanged.
- **Verification:** A CI run log for a passing commit and for a negative-control commit.
- **Status:** FAIL

#### P1-017: No branch governance; remote protection not verifiable

- **Severity / class:** Medium / Owner decision (secondary: implementation)
- **Source evidence:**
  - 36 commits, 0 merge commits and a single author on `main`.
  - No `CODEOWNERS`, PR template or contribution gate.
  - Branch protection or rulesets cannot be read (no `gh`, private repository; E-30, E-31).
- **Impact:** No review requirement before content reaches the distribution branch. A marketplace install from `main` could receive unreviewed changes.
- **Root cause:** A single-maintainer workflow with no policy defined.
- **Required remediation:**
  - The owner defines a policy: protected `main`, required CI status, required review where possible, and no force-push.
  - The maintainer adds `CODEOWNERS` and a PR template.
  - The owner applies the remote settings. Remote changes are outside Phase 1.
- **Acceptance criteria:**
  - The policy is recorded.
  - `CODEOWNERS` and the PR template exist.
  - The owner confirms that branch protection or rulesets require CI on `main`.
- **Verification:** Repository file review, plus an owner-provided settings export or screenshot.
- **Status:** FAIL (repository artifacts); BLOCKED (remote settings)

### 3.7 Versioning, licensing, support and distribution

#### P1-003: No project licence

- **Severity / class:** High / Owner decision
- **Source evidence:**
  - No `LICENSE` file at the root, and no `license` field in either manifest.
  - `LICENSE_PROPOSAL.md:3-8` lists options A–D. Q-05 is open.
  - The README states that no licence is granted.
- **Impact:** Recipients have no right to use, copy or redistribute. This blocks public release and marketplace listing. It also complicates the third-party notice obligation for adapted MIT material.
- **Root cause:** Owner decision pending.
- **Required remediation:** The owner chooses a licence. The maintainer adds `LICENSE`, sets `license` in both manifests (parity check IC-05) and keeps `upstream-notice.md` regardless of the choice.
- **Acceptance criteria:**
  - `LICENSE` is present.
  - Manifest `license` fields are equal and match it.
  - Validators and the identity check pass.
  - The README licence statements are updated.
- **Verification:** `check-identity.mjs`, `validate-all`, and `claude plugin validate --strict`.
- **Status:** FAIL

#### P1-005: Distribution model, public install source and publisher identity undecided

- **Severity / class:** High / Owner decision
- **Source evidence:**
  - The repository is private (E-31: HTTP 404 unauthenticated).
  - `RELEASE_CHECKLIST.md:26-28` has the distribution model unchecked.
  - Publisher "CodeJaDee" is unverified (`RELEASE_METADATA.md:14`).
  - KL-36 says remote GitHub marketplace installs are untested.
- **Impact:** No public install source exists. Who may receive the plugin and under what identity is undefined.
- **Root cause:** Owner decisions pending.
- **Required remediation:** The owner decides between internal (private, access-controlled) and public (repository or mirror). The owner confirms the publisher identity for `author` and the marketplace `owner`.
- **Acceptance criteria:**
  - A decision record exists.
  - The manifests and marketplaces carry the confirmed publisher.
  - A remote install from the chosen source works on each provider (in P1-001).
- **Verification:** Decision log review, plus a remote lifecycle run.
- **Status:** FAIL

#### P1-006: No support channel

- **Severity / class:** Medium / Owner decision
- **Source evidence:** `README.md:109` and `CONTRIBUTING.md:13` name GitHub Issues in a private repository. `RELEASE_CHECKLIST.md:33` is unchecked.
- **Impact:** Pilot users and external users have no defined path for support or feedback.
- **Root cause:** Owner decision pending.
- **Required remediation:** The owner states the support channel and the expected response. The docs are updated.
- **Acceptance criteria:** README and CONTRIBUTING name a reachable channel for the intended audience.
- **Verification:** Documentation review.
- **Status:** FAIL

#### P1-021: Governance decisions not ratified

- **Severity / class:** Medium / Owner decision (secondary: documentation)
- **Source evidence:**
  - Proposed ADRs: ADR-0003, 0004, 0007 and 0011. ADR-0009 is partly accepted. ADR-0010 A+B is "accepted" by inference only.
  - DECISIONS.md has 59 entries:
    - 19 ACCEPTED;
    - 5 "APPROVED" (not in the status vocabulary);
    - 7 "scope ACCEPTED";
    - 28 PROPOSED.
  - D-009 is PROPOSED in DECISIONS but ACCEPTED in `PLUGIN_FORMAT_DECISION.md:6` (DF-03).
  - GOV-01..18 have user review pending.
  - KL-51 still says "3 ADRs and about 22 decisions".
- **Impact:** Architecture and security positions, including ADR-0007 on security boundaries, have no recorded owner approval. Auditors cannot tell binding decisions from proposals.
- **Root cause:** Owner review was never scheduled. The status vocabulary drifted.
- **Required remediation:**
  - The owner reviews and accepts, amends or rejects each PROPOSED ADR and decision.
  - Resolve D-009.
  - Normalize the status vocabulary.
  - Complete the GOV row reviews.
- **Acceptance criteria:**
  - No PROPOSED ADR or decision remains that a release gate depends on.
  - DF-03 is closed.
  - Every decision status is in the vocabulary.
  - KL-51 is accurate.
- **Verification:** Decision log and acceptance matrix review.
- **Status:** FAIL

### 3.8 Documentation and repository hygiene

#### P1-020: Stale and contradictory release documentation

- **Severity / class:** Medium / Documentation defect
- **Source evidence:**
  - `RELEASE_READINESS.md:6,9` and §9 item 8 say Step 41 is "uncommitted". It is commit `73efc6a` and is on the remote.
  - KL-55, `COMPATIBILITY_MATRIX.md:24,28` and `RELEASE_READINESS.md:69,73` say Claude Code 2.1.220 and Copilot 1.0.89. Today the machine has 2.1.302, and Copilot is not installed.
  - KL-30, R-53 and EG-05 say "current 13-skill build".
  - `FINAL_PROVIDER_COMPATIBILITY.md:79,141` uses the old identifier and 13 skills / 238 files, but `tests/provider-compatibility/README.md:8` calls it "the current compatibility verdict".
  - `INSTALL_COPILOT.md:131` says update and uninstall "Passed". `COMPATIBILITY_MATRIX.md:49-50` says update did not change the version and uninstall only disabled the plugin.
  - `ARCHITECTURE.md` §8 says "current 5,485 leaves 1,015" and "two planned editorial registrations". `CONTRIBUTING.md:51` says 5,485/5,500, and its link labels at `:8,118` read `release/` while pointing at `distribution/`.
  - `SECURITY_MODEL.md:11-13` and `tests/security/results/step30-static-review.json` describe 13 skills, 238 files and 32 tests.
  - ISSUES R-20 (no behavioural eval has run), R-27 (4,000-character budget), Q-10 (≤14 skills) and R-58, compared with the MHR statuses.
  - ACCEPTANCE evidence cells ARC-01, ARC-04, REQ-02 and REQ-06 carry stale counts.
  - `HUMANIZER_REQUIREMENTS.md` MHR statuses say PLANNED, while the matrix says IMPLEMENTED.
- **Impact:** Release reviewers and users get conflicting facts. Some statements overstate verification, for example "Passed" on Copilot uninstall.
- **Root cause:** Each step updated its own documents, with no consistency check across documents.
- **Required remediation:**
  - Correct every item above.
  - Mark historical snapshots as historical, and point "current" links to current documents.
  - Extend `check-docs.mjs` with consistency rules for skill count, package file count, L0 figures and plugin identifier.
- **Acceptance criteria:**
  - No current-tense statement disagrees with the tree or with recorded evidence.
  - The new docs rules have negative controls.
  - `check-docs.mjs` passes.
- **Verification:** `check-docs.mjs`, `run-validator-tests.mjs`, and a manual diff review.
- **Status:** FAIL

#### P1-030: Plugin README lacks a one-step install line

- **Severity / class:** Low / Implementation defect (documentation)
- **Source evidence:** E-21 and E-22 advice from `claude plugin validate --strict`: no install line in `plugins/codejadee-chayen-framework/README.md`.
- **Impact:** Minor discoverability gap in directory listings.
- **Root cause:** The README predates the CLI's advice.
- **Required remediation:** Add the install line once the distribution source is decided (P1-005).
- **Acceptance criteria:** The validate advice no longer appears.
- **Verification:** `claude plugin validate --strict .`
- **Status:** FAIL

#### P1-031: Repository hygiene

- **Severity / class:** Low / Implementation defect (secondary: owner decision)
- **Source evidence:**
  - The tracked `.vscode/settings.json` holds personal colour settings. It is not shipped, but BC-32 says to leave it untouched without owner approval.
  - `.gitignore` is a stock Visual Studio template that does not ignore `.env.local` or Node artefacts.
  - There is no `.gitattributes`. The index uses LF, but the working tree is CRLF under `core.autocrlf=true`.
- **Impact:** Personal settings travel in marketplace clones. Secret files such as `.env.local` could be committed. Line-ending behaviour depends on each clone's configuration.
- **Root cause:** Repository initialized from a generic template.
- **Required remediation:**
  - The owner decides on `.vscode/`.
  - Add `.env*` and Node ignores.
  - Add `.gitattributes` with `* text=auto eol=lf` for Markdown, JSON and scripts.
- **Acceptance criteria:** The hygiene files exist, gates pass, and no tracked file changes content apart from line endings.
- **Verification:** `git ls-files --eol` review, plus `validate-all`.
- **Status:** FAIL

#### P1-033: Declared Node minimum (20.11) never tested

- **Severity / class:** Low / Missing test evidence
- **Source evidence:**
  - The validators declare Node ≥ 20.11 (`validate-all.mjs:6`).
  - They were executed on Node 24.22.0 (E-01).
  - R-50 is resolved for the declaration only.
- **Impact:** Contributors on Node 20 or 22 may hit unsupported APIs.
- **Root cause:** Only one runtime was tested.
- **Required remediation:** Add a CI matrix with Node 20.11 (or the chosen minimum) and the current LTS.
- **Acceptance criteria:** CI passes on both versions.
- **Verification:** CI logs.
- **Status:** NOT_RUN

## 4. Historical findings revalidated

| Historical item | Prior claim | Phase 1 result |
|---|---|---|
| B-1 / KL-50 / R-56 | No licence, private repository, no security contact | Still true → P1-003, P1-004, P1-005 |
| B-2 / KL-30 / R-53 | Lifecycle of current build untested | Still true, and wider: the rename means no `chayen` install was ever tested → P1-001 |
| B-3 / R-61 | No writing-skill evidence | Still true → P1-010 |
| B-4 / R-62 | Engineering routing not re-measured with 15 skills | Still true; fingerprint proven unmeasured → P1-008, P1-015 |
| B-5 | Rubric unapproved | Still true → P1-011 |
| B-6 / R-54 | Version not bumped | Still true; tag-format conflict found → P1-002 |
| KL-52 | No CI | Still true → P1-016 |
| KL-53 / DF-02 | `validate` on `skills/` fails | **Not reproduced** on 2.1.302 → P1-028 |
| KL-55 | Installed CLI versions | Out of date → P1-020 |
| KL-12 | Nitro/Elysia "general guidance only" | Understated: presented as supported in routing metadata → P1-007 |
| Static gates (Step 41) | 13/13, 179/179, 34/34, 19/19, 56/56, 15/15 | Reproduced exactly (E-01..E-17) |
| Lexical proxy (Step 34) | top-1 0.546 | 0.535 on 15 skills; simulated only |

## 5. Dependencies and recommended order for Phases 2–8

These phases are proposed. Each phase still needs its own authorization.
None of them adds a CLI, extension, hook, MCP server, executable, telemetry
or new skill. CI files and validator changes live outside the shipped
package.

| Phase | Name | Scope (findings) | Depends on | Classification focus |
|---|---|---|---|---|
| 2 | Owner decisions and governance ratification | P1-002 (version, tag format), P1-003, P1-004, P1-005, P1-006, P1-007 (scope policy), P1-011, P1-017 (policy), P1-021, P1-026, P1-031 (`.vscode`), P1-032. It also authorizes Phase 7 runs, profiles and reviewers | None. Starts first | Owner decision |
| 3 | CI and repository governance | P1-016, P1-017 (repo artifacts; the owner applies remote protection), P1-033, P1-031 (`.gitignore`, `.gitattributes`) | Phase 2 policy for branch rules. CI can be built in parallel with Phase 2 | Implementation (outside package) |
| 4 | Tooling and documentation corrections | P1-013, P1-014 (scorer), P1-018, P1-019, P1-020, P1-028, P1-036, P1-009 (docs part), plus docs-consistency rules | Phase 3, so new guards run in CI. Version strings wait for Phase 2 | Implementation (tooling), Documentation |
| 5 | Skill content remediation within constraints | P1-007 (apply decision), P1-012, P1-014 (Thai guidance), P1-015 (only if pre-tightening is approved), optional P1-029 | Phase 2 (scope decision), Phase 4 (guards in place) | Implementation (content) |
| 6 | Release candidate freeze and metadata | P1-002 (apply version), P1-003 (LICENSE, manifest `license`), P1-005 (publisher), P1-030, CHANGELOG. Record the frozen metadata fingerprint | Phases 2, 4, 5. The content must be final before the fingerprint is frozen | Implementation (metadata) |
| 7 | Provider and human verification of the frozen candidate | P1-001, P1-027, P1-008, P1-009 (evidence), P1-015, P1-010, P1-035, P1-024, P1-022 (agreed subset), P1-023, P1-025 re-check | Phase 6 (frozen, versioned build), Phase 2 authorizations and reviewers, Phase 4 corrected runbook and script, Copilot CLI ≥ 1.0.91 installed | Missing test evidence |
| 8 | Release readiness decision and release | Update the compatibility, acceptance and readiness documents from Phase 7 evidence only. Make the go/no-go call. Commit, tag, push and publish only with explicit per-action owner approval (BC-30, BC-31) | Phase 7 | Owner decision |

**Critical path:** Phase 2 → Phase 5 → Phase 6 → Phase 7 → Phase 8.
Phases 3 and 4 run alongside Phase 2 and must be finished before Phase 6.
Routing measurement (Phase 7) must come after every description change
(Phases 5 and 6). Otherwise the measured fingerprint will not match the
shipped one.

**Minimum for a limited internal pilot** (from RELEASE_READINESS §8, P-1..P-6):
- Phase 2 approvals for the pilot, version and testers.
- Phase 6 version applied.
- Phase 7 lifecycle (P1-001) on each pilot provider.
- Disclosure that the writing skills and the policy are experimental.

Everything else above is required for public or production release, unless
the owner formally accepts it.

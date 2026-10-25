# Chayen Evolution — Limit Migration Matrix (Step 02)

- **Decision:** D-066, [ADR-0013](../ADRS/ADR-0013-extensible-skill-governance.md)
- **Baseline:** HEAD `7427eb1`, [BASELINE_REPORT.md](BASELINE_REPORT.md)
- **Classes (ADR-0013 §1):** **A** repository policy (removed as failure),
  **B** provider constraint (retained), **C** security, identity, schema or
  supply chain (retained), **D** quality or routing (retained).

**Progress:** Step 03 (2026-10-22) implemented K-01, K-03, K-04, R-01..R-08,
R-14 and T-01..T-08 (T-08 as the new `tests/catalog/registration.test.mjs`).
It re-verified R-09..R-13, R-23 and T-17, and updated DOC-05 (registration
part), DOC-06, DOC-07 (count part), DOC-11 (count sentence) and DOC-12 (count
sentences). See [STEP_LOG.md](STEP_LOG.md#step-03--skill-count-and-registration).
Step 04 (2026-10-22) implemented K-05..K-07, R-16..R-18 and T-10..T-12 (as
`tests/skills/reference-graph.test.mjs` and the retargeted
`sk-link-into-other-skill`). It changed R-19 as directed by the owner
(transitive discovery; orphans still fail), and updated DOC-07 (size and
depth), DOC-08, DOC-09, DOC-10, DOC-13 and DOC-16. See
[STEP_LOG.md](STEP_LOG.md#step-04--line-and-reference-depth-limits).
Step 05 (2026-10-22) implemented K-02 (replaced by documented provider
figures in `tools/catalog/discovery-metrics.mjs`, not by a new cap), R-15,
R-21, R-22, T-09 (retargeted to the registry-drift fault) and T-14, and
updated DOC-05 (budget), DOC-08 (DS-05, L0 row), DOC-10 (L0 rows), DOC-11,
DOC-12 (L0 sentences) and DOC-14. See
[STEP_LOG.md](STEP_LOG.md#step-05--metadata-budget-policy).
Step 06 (2026-10-22) implemented T-13 (provider-rule negative controls in
`tests/ci/limits.test.mjs`), T-16, T-18 and T-19. It closed the V-18
nested-reference gap and completed the documentation audit: CA-01, plus
notices in ADR-0009, ADR-0012, PROJECT_CHARTER, ISSUES R-57,
PLUGIN_PACKAGE_DESIGN and ARCHITECTURE §8. All matrix rows are now
implemented or explicitly kept. See
[LIMIT_MIGRATION_REPORT.md](LIMIT_MIGRATION_REPORT.md).

Line numbers are from the baseline commit. Each implementing step re-locates
them before editing. "Keep" means no behaviour change; the step only
re-verifies it.

## 1. Constants

| ID | Location | Current | Class | Proposed change | Step |
|---|---|---|---|---|---|
| K-01 | `tools/catalog/skill-registration.mjs:6` `MAX_ENTRY_SKILLS = 16` | count cap | A | Remove the export and every rejection that uses it. Callers report counts instead. | 03 |
| K-02 | `skill-registration.mjs:7` `L0_BUDGET = 7000` | L0 failure threshold | A | Remove as a failure threshold. Replace with documented provider figures (`PROVIDER_LISTING_BUDGETS`: Codex fallback 8,000 characters; Claude Code 1% of context, informational; Copilot unknown) used only for WARN and reporting. | 05 |
| K-03 | `skill-registration.mjs:10` `LANGUAGES` (two Humanizer names → `th`, `en`) | editorial name allow-list plus language contracts | A (allow-list) / D (contracts) | Keep the two name→language bindings as pinned contracts. Stop rejecting other valid editorial names; require a `language` code for them. | 03 |
| K-04 | `skill-registration.mjs:11` `PROJECT_NAMES = {"chayen-init"}` | project allow-list | A | Remove. Admit project records by closed schema, P-01/P-02 name and description rules, cross-registry uniqueness and file parity. | 03 |
| K-05 | `validate-package.mjs:426-427` literals 300 / 200 | `SKILL.md` lines | A | Remove both. Add WARN above the provider recommendation of 500 lines or about 5,000 estimated tokens (P-B1). Report lines and tokens per Skill. | 04 |
| K-06 | `validate-package.mjs:431` literal 300 | reference lines | A | Remove. Report lines per reference and the largest reference per Skill. | 04 |
| K-07 | `validate-package.mjs:491` literal 2 | link depth | A | Remove the depth error. Report the maximum depth per Skill. | 04 |
| K-08 | `validate-package.mjs:286,290,345`; `skill-registration.mjs:41,91`; `validate-package.mjs:164` — 64 and 1,024 | name and description lengths | B | Keep as errors (P-01, P-02, P-07). | — |
| K-09 | `validate-package.mjs:346` literal 420 | description target | D | Keep as WARN. | — |
| K-10 | `validate-package.mjs:365-366` 0.25 / 0.35 | distinctness | D | Keep (non-overlapping triggers). | — |
| K-11 | `validate-package.mjs:387,391,395` (≥2 terms, ≥2 exclusions, >24 items WARN) | description breadth | D | Keep. | — |
| K-12 | `validate-package.mjs:418,421` (≥4 positive, ≥3 negative triggers) | anatomy | D | Keep. | — |
| K-13 | `validate-package.mjs:638-639` (≥3 positives per Skill; 5/3/3 category minimums) | trigger coverage | D | Keep. Coverage scales with Skill count. | — |
| K-14 | `check-catalog.mjs:35-283,329,345,391,408` (20 domains, 206 capabilities) | inventory | C | Keep. Out of scope (owner item 10). | — |
| K-15 | `tools/evals/run-evaluation-suite.mjs:77` (206) | inventory | C | Keep. | — |
| K-16 | `tools/validate/check-response-style.mjs:27` (3,500 characters, 40 lines) | opt-in host instruction block (ADR-0010), not a Skill | — | Unchanged. Outside ADR-0013: the block is always-on once a user installs it, so its size remains a deliberate cost bound. | — |

## 2. Validator rules

| ID | Location | Current behaviour | Class | Proposed change | Step |
|---|---|---|---|---|---|
| R-01 | `validate-package.mjs:350` V-07 | ERROR when shipped Skill directories > 16 | A | Remove. V-07 PASS line reports count by category. | 03 |
| R-02 | `skill-registration.mjs:104` | error when registered (engineering ∪ editorial ∪ project) count > 16 | A | Remove. | 03 |
| R-03 | `check-catalog.mjs:370` V-11.3 | ERROR when catalog `entry_skills` > 16 | A | Remove. The report line keeps the count. | 03 |
| R-04 | `skill-registration.mjs:31` | project registry length must equal the allow-list size | A | Remove. | 03 |
| R-05 | `skill-registration.mjs:38` | project name outside allow-list rejected | A | Replace with P-01 name validation (pattern `^chayen-[a-z0-9]+(-[a-z0-9]+)*$`, ≤64) and confined-path checks. | 03 |
| R-06 | `skill-registration.mjs:52` | every allow-listed project name must be registered | A | Replace with the general rule: every shipped directory is registered in exactly one category (already in V-19 and V-11.3:384). | 03 |
| R-07 | `skill-registration.mjs:80` | editorial registry must hold exactly 2 records | A | Remove the count. Keep: both Humanizer records present (`skill-registration.mjs:102`). | 03 |
| R-08 | `skill-registration.mjs:87` | editorial name outside the two-name list rejected | A | Replace with name validation plus a required `language` code. Pinned names keep their language (`:89`). | 03 |
| R-09 | `skill-registration.mjs:33-34,82-84` closed record fields | closed schema | C | Keep. | — |
| R-10 | `skill-registration.mjs:39,88` cross-registry duplicates; `validate-package.mjs:288` duplicate names | identity | C | Keep. | — |
| R-11 | `skill-registration.mjs:40-49,90-99` mapping, description, file parity, confined paths | schema and paths | C | Keep. | — |
| R-12 | `skill-registration.mjs:53-57,105-109` engineering isolation | ownership | C | Keep. Non-engineering Skills never own capabilities. | — |
| R-13 | `check-catalog.mjs:372-373,384,557` name pattern, duplicates, unregistered directory, engineering Skill owns ≥1 capability | identity and ownership | C | Keep. "Owns ≥1 capability" applies to engineering Skills only. | — |
| R-14 | `validate-package.mjs:548-560` V-19 shipped Skill ↔ registry | registration | C | Keep. Update messages that name the allow-lists. | 03 |
| R-15 | `validate-package.mjs:351-354` V-07 L0 | ERROR above `L0_BUDGET` (actual and projected) | A | Remove the ERROR. Report actual and projected characters and estimated tokens; WARN above the Codex 8,000-character figure (P-L2). | 05 |
| R-16 | `validate-package.mjs:425-428` V-06 `SKILL.md` | ERROR >300, WARN >200 | A | Replace with metrics plus WARN >500 lines or ~5,000 tokens (P-B1). | 04 |
| R-17 | `validate-package.mjs:429-432` V-06 references | ERROR >300 | A | Replace with metrics only. | 04 |
| R-18 | `validate-package.mjs:482-495` V-08 traversal | depth-limited recursion. Termination relies on the depth cap. | A (cap) / C (traversal) | Remove the depth error and add a visited set so cycles terminate. Keep skill-local, existence and anchor checks (`:487-489`). | 04 |
| R-19 | `validate-package.mjs:496-497` V-08 RF-02 | every reference linked directly from `SKILL.md` | B (P-B2) / D | **Changed by the owner's Step 04 instruction:** reachability from `SKILL.md` at any depth (orphans ERROR); transitive-only references WARN, naming the provider recommendation. | 04 |
| R-20 | `validate-package.mjs:209-223` V-09; `:98-108` V-03; `:65-91` V-02; `:122-197` V-01; `:644-650` V-13; `:502-532` V-10, V-12 | package, manifests, marketplaces, hygiene, wording | B / C | Keep. | — |
| R-21 | `run-evaluation-suite.mjs:18,128,137` `cap: L0_BUDGET` | report denominator | A | Report against provider figures (K-02) instead of a cap. | 05 |
| R-22 | `check-docs.mjs:19,49,90` D-06 | documents must state `<used> / 7,000 characters` | A | Check the stated usage only, plus the provider-figure wording if one is stated. | 05 |
| R-23 | `tools/validate/check-security.mjs:98-100` V-25.5 | registry errors flow into the security profile | C | Keep. Re-verify after R-04..R-08. | 03 |
| R-24 | `check-hardening.mjs:48` H-RUNBOOK | runbook count equals build count | C | Keep (identity, not a cap). | — |

## 3. Tests

| ID | Location | Current expectation | Proposed change | Step |
|---|---|---|---|---|
| T-01 | `tests/catalog/editorial-mutations.json` `ed36-exceeded-count` | 17th directory → `17 entry skills > 16` | Rewrite as an acceptance fixture: a correctly registered 17th Skill passes. Do not delete it or suppress the failure. | 03 |
| T-02 | `editorial-mutations.json` `ed36-registered-count` | registered count → `exceeds 16` | Rewrite as an acceptance fixture: multiple valid planned and shipped registrations pass. | 03 |
| T-03 | `editorial-mutations.json` `ed36-unsafe-name` | `outside the approved two-name allow-list` | Keep the case. Expect the name-pattern or confined-path diagnostic. | 03 |
| T-04 | `tests/catalog/project-mutations.json` `pj62-name-allow-list` | `outside the approved allow-list` | Replace with invalid-name and malformed-record cases (uppercase, `..`, >64 characters, extra field). | 03 |
| T-05 | `project-mutations.json` `pj62-exceeded-count` | `17 entry skills > 16` | Convert as in T-01. | 03 |
| T-06 | `tests/catalog/catalog-mutations.json` `cat-entry-skill-without-capability` | engineering Skill owns no capability | Keep. Reword the description: it no longer refers to a count ceiling. | 03 |
| T-07 | `editorial-mutations.json` `ed36-unregistered`, `ed38-en-unregistered`; `project-mutations.json` `pj62-unregistered`, `pj62-catalog-unregistered` | unregistered shipped Skill rejected | Keep. Message may change from "unregistered … Skill" if R-06 generalizes it. | 03 |
| T-08 | `tools/validate/run-validator-tests.mjs` | runner asserts failures only (`exit 1` + error) | Add a pass expectation (`expect.pass: true`) or a separate `node:test` file for acceptance fixtures. | 03 |
| T-09 | `editorial-mutations.json` `ed36-exceeded-planned-budget` | L0 > 7,000 → error | Rewrite: same metadata now passes with a report. Add a case that WARNs above 8,000 (P-L2). | 05 |
| T-10 | `tests/skills/validator-mutations.json` `sk-skill-too-long` | 301+ lines → V-06 error | Rewrite: a 301-line `SKILL.md` passes. Add a >500-line case that produces a V-06 WARN, not an error. | 04 |
| T-11 | — (missing) | no control for reference >300 lines or depth >2 | Add acceptance fixtures: a long reference and a 3-hop chain pass; a link cycle terminates. | 04 |
| T-12 | `validator-mutations.json` `sk-broken-reference-path`, `sk-broken-anchor`, `sk-unreachable-reference` | V-08 errors | Keep. Re-verify after R-18. | 04 |
| T-13 | — (missing) | no control for shipped description >1,024 or name >64 | Add negative controls (Class B must still fail). | 06 |
| T-14 | `tests/ci/documentation.test.mjs:26-27` | L0 strings with 7,000 denominator | Update to the Step 05 wording. | 05 |
| T-15 | `tests/provider-compatibility/qualify-rc.test.mjs:20-21` (16 Skills, 263 files, fingerprint) | identity pin of the current package | Keep as identity pins (not caps). Update only when the package changes. | — |
| T-16 | `tests/evaluation/phase5/phase5.test.mjs:25` (16) | routing set covers every Skill | Derive the expected count from the shipped directories instead of a literal. | 06 |
| T-17 | `tests/security/boundaries.test.mjs:106-141` | registry runtime-field and secret cases | Keep. Must still pass after Step 03. | 03 |
| T-18 | — (new) | — | `tests/ci/limits.test.mjs`: no Class A value fails on its own; each Class B hard constraint and Class C rule fails on its control. | 06 |
| T-19 | `tests/ci/negative-controls.test.mjs` | not in `validate-all.mjs` | Register it in `validate-all.mjs`. | 06 |

## 4. Documentation

Statements of the current state change when their step lands. Dated
historical records (PROGRESS.md, `docs/production/*`, earlier decision
entries, recorded results) are not edited.

| ID | Location | Current text | Proposed change | Step |
|---|---|---|---|---|
| DOC-01 | `docs/chayen/ADRS/ADR-0004-*.md` | ≤15, L0 6,500, ≤300 lines, ≤2 hops | Superseded-components notice added in Step 02. Body unchanged. | 02 ✔ |
| DOC-02 | `docs/chayen/ADRS/README.md` | no ADR-0013 | Row added in Step 02. | 02 ✔ |
| DOC-03 | `docs/chayen/DECISIONS.md` | — | D-066 added in Step 02. | 02 ✔ |
| DOC-04 | `SKILL_AUTHORING_STANDARD.md`, `SKILL_QUALITY_GATES.md`, `SKILL_REGISTRATION.md` | D-062 limits | D-066 amendment notices added in Step 02. Rules rewritten as each step lands. | 02 ✔ / 03–05 |
| DOC-05 | `SKILL_REGISTRATION.md:5,31-33,38,53`, Verification section | ceiling 16; "both `mapping: planned` now"; "must fit 6,500" | Describe extensible registration; correct the stale editorial status and budget lines. | 03 (registration), 05 (budget) |
| DOC-06 | `tools/catalog/README.md:33` | "maximum 15 and L0 6,500" | Describe the registration rules without caps. | 03 |
| DOC-07 | `tools/validate/README.md:39,54,55,56` | count, line and depth caps | Describe metrics and warnings. | 03, 04, 05 |
| DOC-08 | `SKILL_AUTHORING_STANDARD.md` §1 table (`:64-66`), SB-01 (`:144`), PT-06 (`:92`), RF-03 (`:189`), RF-04 (`:190`), §5.3 last paragraph | L0 ≤7,000; ≤300 / 200 lines; ≤2 hops | Replace with P-B1/P-B2 and metrics. | 04, 05 |
| DOC-09 | `SKILL_QUALITY_GATES.md` G-06, G-08 rows; detection matrix `sk-skill-too-long` | size budgets; ≤2 hops | Update wording and case IDs. | 04 |
| DOC-10 | `ARCHITECTURE.md:29,302,349,407,410,420-429,664-667`; DR-07 (`:623`) | caps and pack `INDEX.md` model | Describe metrics, provider figures and the skill-local model. | 04, 05 |
| DOC-11 | `docs/chayen/KNOWN_LIMITATIONS.md` KL-03 | "ceiling … is reached" | Replace with the provider listing-budget risk (P-L1..P-L3). | 03, 05 |
| DOC-12 | `README.md:26,28`; `docs/SKILLS_CATALOG.md:190-191`; `docs/CONTRIBUTING.md:52-53`; `docs/AUTOMATIC_SKILL_DISCOVERY.md:4`; `docs/RESPONSE_STYLE.md:202` | "6,563 / 7,000"; "ceiling is 16 and all 16 ship" | State usage and provider figures; drop the ceiling sentence. | 03, 05 |
| DOC-13 | `PLUGIN_PACKAGE_DESIGN.md:229,240,243,296,298`; `ISSUES.md` R-15; `ACCEPTANCE_MATRIX.md` REQ-06, ARC-07 | ≤300, ≤2 hops, INDEX risk | Update current-state rows and close or reframe R-15. | 04 |
| DOC-14 | `docs/distribution/RELEASE_CHECKLIST.md` | no provider-budget item | Add release rule P-L (routing evidence when a provider figure is exceeded or Skills are added). | 05 |
| DOC-15 | `ADR-0009:41`, `SKILL_QUALITY_GATES.md:20,35-36` | ≤15 / ≤25 amendment notes | Leave as dated notes; the D-066 notice states what is current. | — |
| DOC-16 | `SKILL_QUALITY_GATES.md:63` "Node.js 18 or later" | scripts need ≥20.11 | Correct while editing the file (found in Step 02). | 04 |

## 5. Retained without change

These are listed so that later steps do not weaken them by accident:
V-01..V-05, V-09, V-10, V-12, V-13, V-16, V-17, V-18, V-19 (except
allow-list messages), V-20, V-22, V-23, V-24, V-25, G-SEC-T, H-LICENSE,
`safe-paths.mjs`, the 206-capability inventory and fingerprint, and the single
canonical `plugins/codejadee-chayen-framework/skills/` source.

# Skill Quality Gates

| Field | Value |
|---|---|
| Step | 08 |
| Date | 2026-10-14 |
| Status | **PROPOSED**: awaiting user review (D-025) |
| Standard | [SKILL_AUTHORING_STANDARD.md](SKILL_AUTHORING_STANDARD.md) |

These are the gates that skill content passes before it is committed,
promoted in the catalog, or released. The automated gates run from the
development repository only. None of them is shipped, and none is a user
CLI.

**Step 35 proposal notice:** multilingual evaluation is specified in
[ADR-0011](ADRS/ADR-0011-multilingual-quality-and-safety.md) and
[HUMANIZER_REQUIREMENTS.md](HUMANIZER_REQUIREMENTS.md) (MH-V01–MH-V12).
These are future gates/criteria, all behavior and human review NOT_RUN;
thresholds remain PROPOSED. Other gates and promotion rules are unchanged.
Count ceiling ≤25 is ACCEPTED and implemented by owner follow-up D-051;
D-052 separately accepts and implements L0 ≤6,500; the editorial catalog
amendment still needs ADR-0009 acceptance, and host-policy tests
need ADR-0010 acceptance plus later step authorization. Original Step 35 executed only
read-only structural/documentation commands; aggregate/mutation/lifecycle
runners and paid provider calls were not part of its verification. The D-051
follow-up runs count-boundary and validator regressions in isolated scratch
copies; it still makes no provider calls or host configuration changes.

**D-066 amendment (accepted and implemented 2026-10-22):**
[ADR-0013](ADRS/ADR-0013-extensible-skill-governance.md) changes the size
and budget parts of G-06, G-07 and G-08. Count, line, link-depth and total-L0
values stop being errors and are reported instead, with warnings at the
documented provider figures. Every other check in these gates, and G-SEC,
G-01..G-05 and G-09..G-17, is unchanged. Step 03 removed the count cap and
the registration allow-lists and added G-13R
(`tests/catalog/registration.test.mjs`). Step 04 removed the line and depth
caps (G-06, G-08) and added G-13G (`tests/skills/reference-graph.test.mjs`).
Step 05 removed the total-L0 cap (G-07) and added the discovery report
(`tools/catalog/discovery-metrics.mjs`) and G-13M
(`tests/catalog/discovery-metrics.test.mjs`).

**D-062 amendment:** maximum 16 and L0 7,000; a third registration category
(`catalog/project-skills.json`, exactly `chayen-init`) is validated by V-07,
V-11.3, V-19 and V-25.5, with negative controls in
`tests/catalog/project-mutations.json`. V-10 allows the `.chayen` path only.

**Step 36 amendment (D-053):** registration/CA-01/V-19 is now approved and
implemented; maximum is 15. L0 remains 6,500, checked for both actual and
projected metadata. Shared rules validate two planned editorial identities,
closed metadata, disjoint registrations, mapping/file parity and Engineering
Catalog isolation. V-07b/V-20 also check planned descriptions without changing
engineering vocabulary/thresholds. Existing shipped Skill gates remain intact.
The self-test runner includes 18 editorial mutations with optional exact
diagnostic fragments; security tests add registry runtime-field/secret cases.
See [SKILL_REGISTRATION.md](SKILL_REGISTRATION.md) and actual PROGRESS evidence.

---

## 1. How to run

```bash
node tools/validate/validate-all.mjs                 # every automated gate below, one line each
node tools/validate/check-security.mjs              # G-SEC; offline V-25 profile, no network
node --test tests/security/boundaries.test.mjs       # G-SEC-T; offline script boundary controls
node tools/validate/validate-package.mjs             # G-01, G-02, G-04..G-10 (detail)
node tools/catalog/check-catalog.mjs                 # G-03 (detail); --write-doc regenerates coverage tables
node tools/catalog/check-technology.mjs              # G-03b (detail); --write-doc regenerates TECHNOLOGY_COVERAGE.md §6
node tools/catalog/check-workflows.mjs               # G-03c (V-24); --write-doc regenerates WORKFLOW_COVERAGE.md
node tools/evals/generate-claude-evals.mjs --check   # G-11
node tools/validate/run-validator-tests.mjs          # G-13; --only <case-id> --keep for debugging
CHAYEN_ALLOW_PROVIDER_LIFECYCLE=1 bash tests/provider-compatibility/run-lifecycle.sh <fresh-scratch-dir> # G-14, separately authorized install
```

**Requirements:**

- Node.js 20.11 or later (the scripts use `import.meta.dirname`).
- No packages to install.
- G-14 also needs the three provider CLIs. It does not call any model.

**Severity:**

- `ERROR` fails the gate.
- `WARN` passes, but the review (G-15) must acknowledge it.

---

## 2. Gates

| Gate | What it protects | Checks | Mode | When it must pass |
|---|---|---|---|---|
| G-SEC | Reviewed metadata-only package profile, authority guards, confined package/marketplace/catalog paths, heuristic secret scan and dependency/link inventory | V-25; inspect scripts before running this gate; failure stops aggregate checks | Offline static; no enforcement or vulnerability-free guarantee | Every change |
| G-SEC-T | Script traversal/junction handling, safe staging, eval metadata injection, parser keys, provider opt-in, negative package-profile and editorial-registry controls | 34 tests in tests/security/boundaries.test.mjs | Offline Node tests; no provider calls | Security/tooling changes |
| G-01 | Plugin manifests are valid, use only supported fields, and agree with each other | V-02 (Agent Plugins 1.0.0 closed schema), V-03 (Claude manifest fields), V-04 (identity parity, semver), X-01 `claude plugin validate --strict` | Automated | Every change |
| G-02 | One valid marketplace file per provider | V-01a/b/c, V-01 consistency, X-01 | Automated | Every change |
| G-03 | Catalog integrity: exactly 206 / 20, unique, verbatim inventory, mappings, status rules, docs in sync | V-11.0–V-11.11 | Automated | Every change |
| G-03b | Technology catalog: verbatim pack inventories, records, mapping to technology sections, section anatomy, cases, facts, coverage doc in sync (D-039) | V-23.1–V-23.9 | Automated | Every change |
| G-03c | Twelve composite workflows and seven templates reuse implemented recipes, conditionally select packs, retain approval/partial/no-match controls and have synchronized evaluation/coverage mappings (D-045) | V-24.1–V-24.6 | Automated (static only) | Every change |
| G-04 | Skill frontmatter is valid YAML, uses only portable fields, and has unique, valid names | V-05, X-02 `skills-ref validate` | Automated | Every change |
| G-05 | Package contains only allowed content; repo root is not misread by providers | V-09, V-13 | Automated | Every change |
| G-06 | Entry skill anatomy (standard §4.1); sizes and estimated context cost reported, advisory warning above the provider recommendation, no line cap (D-066) | V-17, V-06 | Automated | Every change |
| G-07 | Descriptions are precise, bounded (1,024-character provider limit), distinct, YAML-safe and scoped. Total discovery metadata is measured and reported with documented provider figures; no repository cap (D-066) | V-07, V-07b, V-20; discovery report | Automated (heuristic) + G-15 | Every change |
| G-08 | Links and anchors resolve to files inside their own skill (no traversal, cross-skill link or symlink); every reference is reachable from `SKILL.md`, at any depth (D-066); orphans fail; cycles and transitive-only references are reported | V-08 | Automated | Every change |
| G-09 | Reference files declare a kind and carry that kind's sections. Recipes are concrete, not placeholders. Wording is portable and advisory. | V-18, V-12, V-10 | Automated + G-15 | Every change |
| G-10 | Skills, recipes, and catalog agree; every recipe capability has eval cases; trigger cases are well-formed | V-19, V-22, V-16 | Automated | Every change |
| G-11 | Trigger eval cases are generated and current. **Trigger evals are executed** when a description or routing changes. | `generate-claude-evals.mjs --check`; staged `claude plugin eval` (≥3 runs, no-plugin arm); `tests/routing/run-smoke.mjs` | Check: automated. Runs: billed, need approval. | Check: every change. Runs: before claiming a routing effect (DS-09). |
| G-12 | Recipe behaviour evals pass on fixture repositories | `tests/skills/recipe-cases.json`, graded on transcripts | Billed, manual. **No runner or fixtures yet.** | Before any capability becomes VERIFIED |
| G-13 | The validators themselves detect what they claim to | `run-validator-tests.mjs`: six baseline validators + 173 negative controls (179 cases as of Step 41), including editorial and 14 response-style cases; optional diagnostic fragments prevent unrelated failures from satisfying a case. D-066 fixture suites with positive and negative cases: G-13R registration (`tests/catalog/registration.test.mjs`), G-13M discovery metadata (`tests/catalog/discovery-metrics.test.mjs`), G-13G size and reference graph (`tests/skills/reference-graph.test.mjs`), G-13L limit-migration regressions (`tests/ci/limits.test.mjs`) | Automated | Whenever a validator or standard changes |
| G-14 | Native install, discovery, disable, and uninstall still work on each CLI | `run-lifecycle.sh` (24 checks, isolated homes) | Automated, local CLIs | Packaging changes; before release |
| G-15 | Human review (checklist §4) | Reviewer | Manual | Every skill or recipe change; before promotion |
| G-15E | Editorial pattern inventories and case specifications (Steps 37–38; labelled G-15 in `validate-all` until Step 41, renamed to avoid clashing with the human review gate) | `check-editorial-cases.mjs` (E-01–E-04) | Automated (static only; behavior NOT_RUN) | Every editorial skill or case change |
| G-16 | Opt-in response style policy (Step 39, D-056): one marked canonical block, Copilot template byte-identical, body ≤3,500 characters, required precedence/language/protected-content clauses, no Skill routing or enforcement claims, no hardcoded home paths, nothing shipped or activated by the plugin package; setup rules on disposable fixtures (G-16T) | `check-response-style.mjs` (R-01–R-08), `tests/response-style/setup-fixtures.test.mjs`, 14 negative controls in `tests/response-style/response-style-mutations.json` | Automated (static and fixtures only; host loading NOT_RUN) | Every policy, template or package change |
| G-17 | Step 40 evaluation assets (D-057): 120-case held-out dataset (40 Thai, 40 English, 20 mixed, 20 policy) and 52 discovery probes are well formed, preserved spans occur in the inputs, prompts never name the plugin, and the scorer detects the defects it claims to (synthetic controls) | `tools/evals/score-step40.mjs --self-test` (Q-01–Q-04 plus outputs, language, routing, review and dataset-mutation controls in `tests/evaluation/step40/scorer-controls.json`) | Automated (offline; scores no real output). Provider runs and human review: billed or manual, need approval | Every dataset, probe, scorer or skill-description change |
| G-18 | Guidance consistency (evolution Step 09): ten invariants GI-01..GI-10 (GI-10, the independent evidence audit, added in evolution Step 13) for the task-contract decision, action-specific approval, acceptance verdicts, DONE/PARTIAL/BLOCKED, check-status honesty, source-of-truth precedence, advisory wording, skill hand-off, and workflow exit checks | `tools/validate/check-guidance.mjs` (definitions in `tools/validate/guidance-invariants.json`; diagnostics in [GUIDANCE_INVARIANTS.md](GUIDANCE_INVARIANTS.md)); G-18T `tests/skills/guidance-consistency.test.mjs` | Automated (static anchors and narrow contradiction patterns; REVIEW items go to G-15) | Every change to skills, recipes, templates or workflows |

**Promotion rules (D-022):**

- **IN_PROGRESS → IMPLEMENTED** needs:
  - G-01..G-10 and G-13 passing;
  - G-15 done against the record;
  - `verification_evidence` added in the catalog.
- **IMPLEMENTED → VERIFIED** needs G-11 runs and G-12 executed and passing,
  with recorded results.

---

## 3. Detection matrix (requested validators)

Each requested detection maps to the check that implements it and to the
negative control in G-13 that shows it works.

| Requested detection | Implemented by | Negative controls (G-13 case IDs) |
|---|---|---|
| Invalid YAML or frontmatter | V-05 strict frontmatter parser; V-18 for references; V-11.1 for the catalog | `sk-frontmatter-invalid-yaml`, `sk-frontmatter-yaml-unsafe-value`, `sk-reference-without-kind`, `cat-invalid-yaml` |
| Missing files or broken reference paths | V-08 (links), V-11.7 and V-19 (catalog recipe exists) | `sk-broken-reference-path`, `cat-recipe-marked-existing-but-missing` |
| Missing catalog mappings | V-19, V-11.3 | `sk-skill-not-in-catalog`, `sk-recipe-unknown-capability`, `sk-recipe-capability-mapped-elsewhere`, `sk-recipe-lists-planned-capability` |
| Duplicate skill names | V-05 (case-insensitive, plus name equals directory) | `sk-duplicate-skill-name`, `sk-name-differs-from-directory` |
| Placeholder or TODO-only recipes | V-12 (placeholder text and content-free required sections), V-11.6 | `sk-recipe-todo-only`, `cat-placeholder-text` |
| Broken internal links | V-08 (targets, heading anchors, traversal, cross-skill links, symlinks), plus the orphaned-reference rule; positive and negative graph fixtures in G-13G | `sk-broken-anchor`, `sk-unreachable-reference`, `sk-link-into-other-skill` |
| Invalid plugin manifests | V-02, V-03, V-04 | `sk-manifest-invalid-json`, `sk-manifest-version-not-semver` |
| Unsupported schema fields | V-02 (closed schema), V-03, V-05 (frontmatter), V-18 (reference frontmatter), V-11.6 (catalog fields) | `sk-manifest-unsupported-field`, `sk-claude-manifest-unsupported-field`, `sk-frontmatter-unsupported-field`, `sk-reference-unsupported-field` |
| Entry skills with overly broad descriptions | V-20 (catch-all wording, concrete scope terms, ≥2 exclusions, enumeration size), V-07b (overlap) | `sk-description-catch-all`, `sk-description-no-concrete-scope`, `sk-description-single-exclusion` |
| (also) Skill anatomy, budgets, recipe anatomy, eval cases, catalog rules | V-17, V-06, V-18, V-22, V-10, V-11.x | `sk-missing-section`, `sk-section-out-of-order`, `sk-missing-scope-line`, `sk-technology-missing-section`, `sk-recipe-missing-procedure`, `sk-recipe-case-missing-negative`, `sk-provider-tool-name`, `cat-*` (19); sizes in G-13G |

**Limits of the automated checks:**

- **V-20 is a heuristic.** Its vocabulary of concrete terms lives in the
  validator. A precise description that uses words outside the vocabulary
  could be flagged, and a broad description that names many stacks could
  pass. G-15 and the trigger evals (G-11) remain the real test of precision.
- **Word-count thresholds** (≥8 words per skill section, ≥12 per recipe
  section) catch empty and TODO-only content. They do not judge quality.
- **Schema checks re-implement the documented rules.** The official Agent
  Plugins JSON Schema was checked with ajv out of band in Step 04. It is not
  a repository dependency (BC-22).

---

## 4. Review checklist (G-15)

### Entry skill

- [ ] The description leads with the user-phrased task, names concrete scope,
  and excludes the neighbouring skills' work (DS-01..DS-03).
- [ ] The `**Scope:**` line and "When not to use" would stop the skill on
  the unsupported stacks that its description words could attract.
- [ ] The workflow stays at routing level. Any capability procedure longer
  than about 8 lines has moved to a recipe (SB-02).
- [ ] Every reference has a specific "Load when" condition, and the workflow
  names the step that reads it (LD-02, LD-03).
- [ ] The Safety boundaries cover approvals, secrets, untrusted content, and
  instruction files, plus the advisory statement for security (§4.3).
- [ ] No claim of enforcement, safety, or completion without evidence.

### Recipe

- [ ] The listed capabilities match the catalog records. The inputs and
  outputs cover the records in substance (RC-05).
- [ ] The procedure is concrete: actions, commands, decisions, and approval
  points, not advice (RC-04).
- [ ] Technology considerations cover the record's stacks, or explain why the
  recipe is stack-neutral (RC-06).
- [ ] Verification states observable checks and reports NOT_RUN honestly
  (RC-07).
- [ ] The positive and negative eval cases exercise the boundary between this
  recipe and its nearest neighbour (RC-09).

### Change hygiene

- [ ] Description changes come with trigger eval runs, or are explicitly
  marked unmeasured (DS-09).
- [ ] The catalog status is updated only per D-022. The coverage doc has been
  regenerated.
- [ ] PROGRESS.md records the files changed and the gate results.

---

## 5. Step 08 results: pilot skills against the standard

**Before** (first run of the new validator on the Step 07 pilots): 52 errors.

| Finding | Skills affected | Fix applied in Step 08 |
|---|---|---|
| No `**Scope:**` line before "When to use" | all 6 | Added. Names the supported stacks and the excluded neighbours, including native and game UI for frontend and other backend stacks for backend (the R-24 recommendation). |
| Section named "Inputs", not "Preconditions and inputs" | all 6 | Renamed. Content unchanged. |
| No "Safety boundaries" section | all 6 | Added. Approval-gated actions, untrusted-content, and secret rules moved there from "Principles", plus missing items (secrets for repository, frontend, and testing; instruction files everywhere). |
| References heading and format not standard | all 6 | `## References` with a `Reference \| Load when` table. Each load condition names its workflow step. |
| Reference files without a declared kind | 15 files | Front matter added: 10 `technology`, 3 `checklist`, 2 `recipe` |
| `task-contract.md` and `change-summary.md` mapped as recipes but lacking recipe anatomy | chayen-implementation | Converted into recipes with Inputs, Procedure, Outputs, Technology considerations, and Verification. The existing template, rules, and example are kept. |
| Catalog used `SKILL.md`, `review-checklist.md`, and `stack-hardening.md` as recipes | 21 capabilities, 6 groups | Re-pointed to planned recipe files (D-026). These capabilities stay IN_PROGRESS through their existing coverage evidence. |
| No recipe evaluation cases | 5 capabilities | `tests/skills/recipe-cases.json`: 10 cases (5 positive, 5 negative) |

**After:** 0 errors and 0 warnings, on these commands and tools:

- `validate-package.mjs`;
- `check-catalog.mjs`;
- G-13 at 52/52;
- `claude plugin validate --strict` (plugin, skills, marketplace);
- `skills-ref validate` (6/6 valid);
- `run-lifecycle.sh` (24/24 on Claude Code 2.1.270, Codex 0.160.1, and
  Copilot 1.0.97, with the user's real configs unchanged).

**Unchanged on purpose:**

- **Descriptions (L0).** They still total 2,332 / 4,000 characters, so the
  Step 06 routing evidence stays applicable.
- **Behaviour after the body changes is NOT_RUN.** This covers the new scope
  line's effect on Copilot over-activation (R-24), and any routing effect of
  the restructuring. It needs approved, billed trigger runs (G-11).

**Pilot sizes after the changes:** 145–159 lines per `SKILL.md`. That is
under the 200-line target, so no warnings.

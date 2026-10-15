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

- Node.js 18 or later.
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
| G-SEC-T | Script traversal/junction handling, safe staging, eval metadata injection, parser keys, provider opt-in and negative package-profile controls | 32 tests in tests/security/boundaries.test.mjs | Offline Node tests; no provider calls | Security/tooling changes |
| G-01 | Plugin manifests are valid, use only supported fields, and agree with each other | V-02 (Agent Plugins 1.0.0 closed schema), V-03 (Claude manifest fields), V-04 (identity parity, semver), X-01 `claude plugin validate --strict` | Automated | Every change |
| G-02 | One valid marketplace file per provider | V-01a/b/c, V-01 consistency, X-01 | Automated | Every change |
| G-03 | Catalog integrity: exactly 206 / 20, unique, verbatim inventory, mappings, status rules, docs in sync | V-11.0–V-11.11 | Automated | Every change |
| G-03b | Technology catalog: verbatim pack inventories, records, mapping to technology sections, section anatomy, cases, facts, coverage doc in sync (D-039) | V-23.1–V-23.9 | Automated | Every change |
| G-03c | Twelve composite workflows and seven templates reuse implemented recipes, conditionally select packs, retain approval/partial/no-match controls and have synchronized evaluation/coverage mappings (D-045) | V-24.1–V-24.6 | Automated (static only) | Every change |
| G-04 | Skill frontmatter is valid YAML, uses only portable fields, and has unique, valid names | V-05, X-02 `skills-ref validate` | Automated | Every change |
| G-05 | Package contains only allowed content; repo root is not misread by providers | V-09, V-13 | Automated | Every change |
| G-06 | Entry skill anatomy (standard §4.1) and size budgets | V-17, V-06 | Automated | Every change |
| G-07 | Descriptions are precise, bounded, distinct, YAML-safe, and within budget | V-07, V-07b, V-20 | Automated (heuristic) + G-15 | Every change |
| G-08 | Links and anchors resolve, stay skill-local, ≤2 hops; every reference is reachable | V-08 | Automated | Every change |
| G-09 | Reference files declare a kind and carry that kind's sections. Recipes are concrete, not placeholders. Wording is portable and advisory. | V-18, V-12, V-10 | Automated + G-15 | Every change |
| G-10 | Skills, recipes, and catalog agree; every recipe capability has eval cases; trigger cases are well-formed | V-19, V-22, V-16 | Automated | Every change |
| G-11 | Trigger eval cases are generated and current. **Trigger evals are executed** when a description or routing changes. | `generate-claude-evals.mjs --check`; staged `claude plugin eval` (≥3 runs, no-plugin arm); `tests/routing/run-smoke.mjs` | Check: automated. Runs: billed, need approval. | Check: every change. Runs: before claiming a routing effect (DS-09). |
| G-12 | Recipe behaviour evals pass on fixture repositories | `tests/skills/recipe-cases.json`, graded on transcripts | Billed, manual. **No runner or fixtures yet.** | Before any capability becomes VERIFIED |
| G-13 | The validators themselves detect what they claim to | `run-validator-tests.mjs`: 2 baseline runs + 51 negative controls (19 catalog, 32 package; Step 09 added `sk-placeholder-in-prose`) | Automated | Whenever a validator or standard changes |
| G-14 | Native install, discovery, disable, and uninstall still work on each CLI | `run-lifecycle.sh` (24 checks, isolated homes) | Automated, local CLIs | Packaging changes; before release |
| G-15 | Human review (checklist §4) | Reviewer | Manual | Every skill or recipe change; before promotion |

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
| Broken internal links | V-08 (targets and heading anchors), plus the unreachable-reference rule | `sk-broken-anchor`, `sk-unreachable-reference` |
| Invalid plugin manifests | V-02, V-03, V-04 | `sk-manifest-invalid-json`, `sk-manifest-version-not-semver` |
| Unsupported schema fields | V-02 (closed schema), V-03, V-05 (frontmatter), V-18 (reference frontmatter), V-11.6 (catalog fields) | `sk-manifest-unsupported-field`, `sk-claude-manifest-unsupported-field`, `sk-frontmatter-unsupported-field`, `sk-reference-unsupported-field` |
| Entry skills with overly broad descriptions | V-20 (catch-all wording, concrete scope terms, ≥2 exclusions, enumeration size), V-07b (overlap) | `sk-description-catch-all`, `sk-description-no-concrete-scope`, `sk-description-single-exclusion` |
| (also) Skill anatomy, budgets, recipe anatomy, eval cases, catalog rules | V-17, V-06, V-18, V-22, V-10, V-11.x | `sk-missing-section`, `sk-section-out-of-order`, `sk-missing-scope-line`, `sk-technology-missing-section`, `sk-recipe-missing-procedure`, `sk-recipe-case-missing-negative`, `sk-provider-tool-name`, `sk-skill-too-long`, `cat-*` (19) |

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

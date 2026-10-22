# Chayen Evolution — Step Log

Append one entry per step, newest last, using the fields in
[EXECUTION_RULES.md §7](EXECUTION_RULES.md#7-after-a-step). Do not edit
earlier entries except to add a dated correction note.

---

## Step 01 — Baseline

- **Date:** 2026-10-22
- **Status:** PASS
- **Starting state:** branch `develop`, HEAD `7427eb1`, worktree clean
  (empty `git status --porcelain=v1 -uall`), no stashes, version `1.1.2`
  in every versioned manifest.

### Files changed

| Change | Path |
|---|---|
| Created directory | `docs/chayen/evolution/` (did not exist) |
| Created | `docs/chayen/evolution/MASTER_PLAN.md` |
| Created | `docs/chayen/evolution/STEP_LOG.md` |
| Created | `docs/chayen/evolution/BASELINE_REPORT.md` |
| Created | `docs/chayen/evolution/EXECUTION_RULES.md` |

No other file was created, modified or deleted. A read-only measurement
script and the raw logs live in the session scratchpad, outside the
repository.

### Inspection

- Read in full: `tools/validate/validate-package.mjs`,
  `tools/catalog/skill-registration.mjs`, `tools/catalog/check-catalog.mjs`,
  `tools/validate/validate-all.mjs`, `tools/evals/run-evaluation-suite.mjs`,
  `tests/evaluation/phase5/run-phase5.mjs`.
- Read in part: `README.md`, `CHANGELOG.md`, `docs/chayen/DECISIONS.md`
  (D-015..D-017, D-025, D-026, D-046, D-048..D-053, D-062..D-065),
  `ADR-0004`, `docs/chayen/ADRS/README.md`, `docs/SKILLS_CATALOG.md`,
  `SKILL_QUALITY_GATES.md`, `SKILL_REGISTRATION.md`, `EVALUATION_GAPS.md`,
  all marketplace and plugin manifests, `tools/ci/toolchain.json`,
  `docs/production/CI_CD_DESIGN.md`.
- Before running anything, every script spawned by `validate-all.mjs` and
  `run-evaluation-suite.mjs` was searched for write, delete, spawn and
  network calls. Writes go only to OS-temp directories or behind explicit
  flags (`--write`, `--write-doc`, `--write-report`, `--stage`), which were
  not used. The live Phase 5 runner refuses without authorization.
- Limit references found by searching the repository for the constants,
  values and validator IDs (`MAX_ENTRY_SKILLS`, `L0_BUDGET`, `7,000`, `16`,
  `300`, `2 hops`, `V-06`, `V-07`, `V-08`, `RF-02`, `SB-01`).

### Commands

| Command | Exit | Result |
|---|---|---|
| `node tools/validate/validate-all.mjs` | 0 | 20/20 gate groups PASS; 5 V-06 warnings |
| `node tools/validate/validate-package.mjs` | 0 | 0 errors, 5 warnings; 16 Skills; L0 6,563/7,000 |
| `node tools/catalog/check-catalog.mjs` | 0 | 206/206, 20 domains, fingerprint match |
| `node --test` on each of the 8 test files in the aggregate | 0 each | 36, 22, 22, 40, 9, 13, 15, 19 tests; 0 failed, 0 skipped |
| `node --test tests/ci/negative-controls.test.mjs` | 0 | 4/4 PASS (not part of the aggregate) |
| `node tools/evals/run-evaluation-suite.mjs` (no `--write`) | 0 | Static and traceability levels PASS; simulated proxy top-1 0.503 / top-3 0.775 (proxy, not evidence); no provider level |
| `node tests/evaluation/phase5/run-phase5.mjs --plan` | 0 | 2,295 billed calls planned; nothing sent |
| `metadataFingerprint` (from `phase5-lib.mjs`) | 0 | `411b6adbbea7e121` |
| `git status --porcelain=v1 -uall` after all runs | 0 | Only the four new files under `docs/chayen/evolution/` |

Node.js v24.15.0, Windows 11, Git Bash. Full results:
[BASELINE_REPORT.md §6](BASELINE_REPORT.md#6-offline-validation-results).

### Acceptance

| Criterion | Evidence | Result |
|---|---|---|
| A1 Baseline grounded in inspected source files | Every limit in [BASELINE_REPORT §4](BASELINE_REPORT.md#4-enforced-limits) cites `file:line`; values measured, not copied from docs | PASS |
| A2 Existing worktree changes preserved | Worktree was clean before the step; afterwards only the four new files are untracked | PASS |
| A3 Offline validation status recorded | BASELINE_REPORT §6 | PASS |
| A4 All 20 steps have dependencies and expected outputs | MASTER_PLAN summary table, dependency graph and per-step tables | PASS |
| A5 No product source file changed | `git status` shows no modified tracked file | PASS |

### Risks and open findings

- The Entry Skill ceiling is reached (16/16), and the metadata is at or near
  its warning thresholds. Step 02 needs an owner decision before Steps 03–05
  change any enforced value.
- Several governance documents state superseded limits, and ADR-0004 is
  still `PROPOSED` (BASELINE_REPORT §5.3, F-02, F-03).
- Several limits have no negative control (F-05).
- The Phase 5 candidate is stale, so live evaluation is blocked until
  Step 14 (F-08).
- The local Node.js version satisfies the ≥ 20.11 minimum but is not one of
  the pinned CI versions; no CI exists (F-10).
- The installed plugin version in provider homes was not inspected (outside
  the repository).

### Next action

Step 02 (Limit Policy and ADR) is **ready to start**: its only prerequisite
(01) is PASS. Step 02 can draft the policy, ADR and decision record and
propose drift corrections. Any change to an enforced value (Steps 03–05)
waits for the owner's recorded decision.

---

## Step 02 — Limit Policy and ADR

- **Date:** 2026-10-22
- **Status:** PASS
- **Starting state:** branch `develop`, HEAD `7427eb1`, version `1.1.2`.
  Worktree: only the four untracked Step 01 files under
  `docs/chayen/evolution/`. Step 01 confirmed `PASS` in this log and in the
  plan.
- **Authorization:** the owner's STEP 02 instruction (2026-10-22): "Formally
  change Chayen's architecture policy so future capability and Skill growth
  is not blocked by arbitrary repository-level numeric limits", with decision
  items 1–10. Recorded as D-066 and accepted ADR-0013. A Step 03 instruction
  arrived first and was interrupted by the owner before any action; nothing
  from it was executed.

### Files changed

| Change | Path |
|---|---|
| Created | `docs/chayen/ADRS/ADR-0013-extensible-skill-governance.md` |
| Created | `docs/chayen/evolution/MIGRATION_MATRIX.md` |
| Modified (+45 lines, appended D-066) | `docs/chayen/DECISIONS.md` |
| Modified (+9, index row and note) | `docs/chayen/ADRS/README.md` |
| Modified (+9, superseded-components notice) | `docs/chayen/ADRS/ADR-0004-skill-catalog-vs-entry-skills.md` |
| Modified (+11, D-066 notice) | `docs/chayen/SKILL_AUTHORING_STANDARD.md` |
| Modified (+8, D-066 notice) | `docs/chayen/SKILL_QUALITY_GATES.md` |
| Modified (+7, D-066 notice) | `docs/chayen/SKILL_REGISTRATION.md` |
| Modified | `docs/chayen/evolution/MASTER_PLAN.md` (Step 02 row and section; plan note) |
| Modified | `docs/chayen/evolution/STEP_LOG.md` (this entry) |

`git diff --stat` on tracked files: 6 files, 89 insertions, **0 deletions**.
No validator, test, catalog, Skill, manifest or version file changed.

### Inspection

Read: ADR-0004, ADR-0005, ADR-0012, ADR index, `SKILL_AUTHORING_STANDARD.md`
§1–§5, `SKILL_QUALITY_GATES.md` §1–§3, `SKILL_REGISTRATION.md`,
`PROVIDER_SPEC_RESEARCH.md` §5–§6 (provider facts), and D-015..D-017,
D-046, D-048..D-053, D-062..D-065. Constants and literals were located in
`skill-registration.mjs`, `validate-package.mjs`, `check-catalog.mjs`,
`run-evaluation-suite.mjs`, `check-docs.mjs`, `check-response-style.mjs`,
`check-security.mjs` and `check-hardening.mjs`. Limit-related mutation cases
were listed from the four mutation files. `run-validator-tests.mjs` was read
to confirm it asserts failures only.

### Commands

| Command | Exit | Result |
|---|---|---|
| `git status --porcelain=v1 -uall` (before) | 0 | four untracked Step 01 files only |
| `node tools/validate/validate-all.mjs` (after the documentation changes) | 0 | 20/20 gate groups PASS; package 0 errors, 5 warnings; G-13 189/189; G-14 34 files, 0 errors. Identical to the Step 01 baseline. |
| Link and anchor check over the 7 edited or new governance files and `docs/chayen/evolution/*` (82 relative links) | 0 | 1 problem, pre-existing (see findings) |
| `git diff --stat`; `git status --porcelain=v1 -uall` (after) | 0 | documentation files only |

### Acceptance

| Criterion | Evidence | Result |
|---|---|---|
| All policy decisions explicit and traceable | ADR-0013 §1 (classes), §2 (A-1..A-6, mapped to owner items 1–5), §3–§7; D-066; matrix IDs K-, R-, T-, DOC- | PASS |
| No provider limit described as removable | ADR-0013 §4: hard constraints P-01..P-07 stay errors; recommendations P-B1, P-B2 and listing budgets P-L1..P-L3 are retained and reported, with release rule P-L. The alternatives table rejects treating them as removable or as invented hard errors. | PASS |
| No security boundary weakened | ADR-0013 §5; no validator changed in this step; `validate-all.mjs` unchanged at 20/20. The matrix keeps R-09..R-13, R-20, R-23, T-03, T-17, and requires cycle-safe traversal (R-18) when the depth cap is removed. | PASS |
| ADR names exact implementation targets | ADR-0013 §8 and MIGRATION_MATRIX §1–§4, with file and line anchors | PASS |
| Historical decisions intact | 0 deletions in tracked files; notices state that the values below them are historical | PASS |
| Documentation states that removing a cap does not imply unlimited provider capacity | ADR-0013 §2 and Consequences; D-066; the `SKILL_AUTHORING_STANDARD.md` notice | PASS |
| Plan criteria: every baseline limit classified; drift resolutions proposed; owner decision recorded verbatim; no validator changed | Matrix §1–§2 cover L-01..L-17 (L-15 response style explicitly out of scope, K-16); DOC-05..DOC-16; D-066 status line; diff | PASS |

### Judgment calls for owner review

These go beyond the literal decision items. They are recorded in ADR-0013
and can be amended before Steps 03–05:

1. `SKILL.md` gets a **WARN** above the provider recommendation of 500 lines
   or about 5,000 tokens (P-B1). The repository's 200-line target is dropped.
2. L0 gets a **WARN** above Codex's documented 8,000-character figure
   (P-L2), and release rule P-L requires routing evidence on a provider
   before a package above its figure, or one that adds Skills, is released
   as supported there.
3. RF-02 (every reference listed directly in the Skill's References table)
   stays an **error**, as the expression of the provider's "one level deep"
   recommendation. Deeper links between references become allowed.
4. The 420-character description target (WARN) and the distinctness
   thresholds (WARN 0.25, ERROR 0.35) are kept as quality rules.
5. A new editorial record must declare a language code. A new registration
   **category** needs its own decision record.
6. The response-style policy limit (3,500 characters, 40 lines) is outside
   this ADR and unchanged.

### Risks and findings

- Until Steps 03–05 land, the governance documents say the caps are
  superseded while the validators still enforce them. Every notice states
  this explicitly.
- V-08 currently terminates on cyclic links only because of the depth cap.
  Removing the cap without a visited set would loop forever (matrix R-18,
  Step 04).
- `run-validator-tests.mjs` cannot assert that a case passes, so Step 03
  needs a pass expectation or a separate test (matrix T-08).
- Pre-existing, not changed: `DECISIONS.md` D-058 (line 1368 at
  `7427eb1`) links to `RELEASE_METADATA.md#step-41-version-proposal-d-058-proposed-not-applied`,
  an anchor that does not exist. `SKILL_QUALITY_GATES.md:63` says Node.js 18,
  but scripts need ≥20.11 (DOC-16).

### Next action

Step 03 (Skill Count and Registration) is **ready**: prerequisite 02 is
PASS, and its targets are matrix rows K-01, K-03, K-04, R-01..R-14, R-23,
T-01..T-08, T-17, DOC-05, DOC-06, DOC-07 (count) and DOC-11, DOC-12 (count
sentences). Not started; it waits for the owner's instruction.

---

## Step 03 — Skill Count and Registration

- **Date:** 2026-10-22
- **Status:** PASS
- **Starting state:** branch `develop`, HEAD `7427eb1`, version `1.1.2`.
  Worktree: the Step 01–02 documentation changes only (6 modified, 6
  untracked). Step 02 confirmed `PASS`; D-066 / ADR-0013 accepted.
- **Authorization:** the owner's STEP 03 instruction (2026-10-22): "Allow
  Chayen to register more than 16 Entry Skills without failing purely because
  of their number. Implement the change now."

### Files changed

| Change | Path | What |
|---|---|---|
| Modified | `tools/catalog/skill-registration.mjs` | Removed `MAX_ENTRY_SKILLS` and the registered-count check; removed `PROJECT_NAMES`, the project "exactly the allow-list" count, the editorial "exactly two records" count and the two-name allow-list. Added the shared name rule (`SKILL_NAME`, ≤64), pinned Humanizer language contracts (`PINNED_LANGUAGES`), a language-code rule for further editorial records, the `chayen-humanizer-*` family reserved for editorial, name uniqueness across all categories, and `registrationCounts()`. `L0_BUDGET` is kept (Step 05). |
| Modified | `tools/validate/validate-package.mjs` | V-07: count rejection removed; PASS line reports Skills by category and "no count cap". |
| Modified | `tools/catalog/check-catalog.mjs` | V-11.3: count rejection removed; report line "Registered Skills by category". |
| Modified | `tools/validate/validate-all.mjs` | New gate G-13R runs `tests/catalog/registration.test.mjs`. |
| Created | `tests/catalog/registration.test.mjs` | 21 disposable-fixture tests (see below). |
| Modified | `tests/catalog/editorial-mutations.json` | `ed36-exceeded-count` → `ed36-seventeenth-copied-identity` (V-05); `ed36-registered-count` → `ed36-registered-cross-category-duplicate` (V-19); `ed36-unsafe-name` expects the name-rule message. |
| Modified | `tests/catalog/project-mutations.json` | `pj62-exceeded-count` → `pj62-seventeenth-unregistered` (V-19); `pj62-name-allow-list` → `pj62-invalid-name`; `pj62-unregistered` expects the general unregistered-directory message. |
| Modified | `tests/catalog/catalog-mutations.json` | `cat-entry-skill-without-capability`: description and fixture text no longer refer to a count ceiling; expectation unchanged. |
| Modified | `docs/chayen/SKILL_REGISTRATION.md`, `docs/chayen/KNOWN_LIMITATIONS.md` (KL-03), `docs/SKILLS_CATALOG.md`, `docs/CONTRIBUTING.md`, `tools/catalog/README.md`, `tools/validate/README.md`, `tests/catalog/README.md` | Current-state statements of the ceiling and allow-lists replaced. The stale "both `mapping: planned` now" line is corrected. |
| Modified | `docs/chayen/ARCHITECTURE.md` | Dated D-066 note added above the D-062 note. |
| Modified | `docs/chayen/ADRS/ADR-0013-*.md`, `docs/chayen/DECISIONS.md` (D-066), `SKILL_AUTHORING_STANDARD.md`, `SKILL_QUALITY_GATES.md` | Implementation status: Step 03 parts IMPLEMENTED. |
| Modified | `docs/chayen/evolution/MASTER_PLAN.md`, `MIGRATION_MATRIX.md`, `STEP_LOG.md` | Status and progress. |

**Unchanged:** `catalog/` (all three registries and the engineering
catalog; `git diff catalog/` is empty), `plugins/` (no Skill added or
changed; version `1.1.2`), the 206 capability IDs, ownership mappings and
recipe paths. `git diff --stat` on tracked files: 20 files, +250 / −94.
`skill-registration.mjs` and `project-mutations.json` now have LF line
endings in the working copy; the index stores LF, so there is no content
change.

### Fixture tests (`tests/catalog/registration.test.mjs`)

Each test copies `plugins`, the three marketplace folders, `catalog`,
`tests/skills`, `tools` and `CAPABILITY_COVERAGE.md` into a fresh
`chayen-registration-*` directory under the OS temp directory, and removes it
afterwards. The real validators run against the copy.

| # | Test | Validators | Expectation |
|---|---|---|---|
| 1 | The existing 16 Skills and their engineering and editorial mappings remain valid | package, catalog, security | exit 0; 13 / 2 / 1 by category; 117 recipe files; 206 capabilities; inventory fingerprint matches |
| 2 | A correctly registered 17th Skill (`chayen-glossary`, project) is accepted | package, catalog, security | exit 0; "17 shipped skills" |
| 3 | Two additional Skills in different categories (project, plus editorial `chayen-proofread-ja` with language `ja`) are accepted | package, catalog, security | exit 0; "18 shipped skills (engineering 13, editorial 3, project 2" |
| 4–21 | 18 single faults applied to the valid 18-Skill copy: duplicate name in a registry; duplicate across categories; duplicate frontmatter name; invalid registry name (uppercase); name >64 characters; invalid directory name (double hyphen); frontmatter without a closing fence; unsupported frontmatter field; registry/SKILL.md description drift; unregistered directory (package and catalog); non-engineering Skill as capability owner (package and catalog); engineering recipe in a non-engineering Skill; Humanizer name family as a project Skill; pinned Humanizer language changed; pinned Humanizer record removed; invalid language code | package or catalog | exit 1, the expected ERROR line, and **no** count-related diagnostic |

Every synthetic Skill carries full anatomy, a reference, a registry record
and three positive trigger cases. All tests also assert that no count
diagnostic appears.

**Control of the test itself:** a scratchpad copy of the test was pointed at
the baseline validators (`git archive HEAD tools`). Result: 19 of 21 fail,
with `17 entry skills > 16`, `18 entry skills > 16` and the old allow-list
errors. The 2 that pass are the catalog-only checks (tests 14 and 16), which
never had a count cap in V-11.3. The suite therefore distinguishes the old
behaviour from the new.

### Commands

| Command | Exit | Result |
|---|---|---|
| `node tools/validate/validate-package.mjs` | 0 | 0 errors, 5 warnings (unchanged V-06); V-07 "16 shipped skills (engineering 13, editorial 2, project 1; no count cap)" |
| `node tools/catalog/check-catalog.mjs` | 0 | 206/206; fingerprint `2f13cad24ff431e3` matches; "Registered Skills by category: engineering 13, editorial 2, project 1" |
| `node tools/validate/check-security.mjs` | 0 | V-25 PASS, 16 entry Skills, 263 package files |
| `node --test tests/catalog/registration.test.mjs` | 0 | 21 tests, 21 pass, 0 fail, 0 skipped |
| `node tools/validate/run-validator-tests.mjs --only <id>` for the 12 rewritten or affected cases | 0 each | 12/12 PASS, each with its intended ERROR line |
| `node tools/validate/validate-all.mjs` | 0 | 21/21 gate groups PASS (20 at baseline plus G-13R); G-13 189/189 |
| `node --test tests/security/boundaries.test.mjs` | 0 | 36/36 |
| `node --test tests/ci/negative-controls.test.mjs` | 0 | 4/4 |
| `node tools/evals/run-evaluation-suite.mjs` (no `--write`) | 0 | Static and traceability PASS; numbers identical to the Step 01 baseline |
| Baseline-validator control (scratchpad copy of the test) | 1 | 19/21 fail as expected (see above) |

### Acceptance

| Criterion | Evidence | Result |
|---|---|---|
| No failure caused solely by exceeding 16 Skills | Tests 2–3 pass with 17 and 18 Skills; tests 4–21 assert no count diagnostic; no count check remains (`grep MAX_ENTRY_SKILLS` empty) | PASS |
| Existing identity, structural, security and catalog-integrity checks still operate | `validate-all.mjs` 21/21; G-13 189/189; G-SEC-T 36/36; tests 4–21 | PASS |
| `PROJECT_NAMES` replaced by validated registration | `skill-registration.mjs`; tests 4, 5, 7, 8, 12, 13, 18 | PASS |
| Identity, naming, category ownership, description consistency and duplicate detection preserved | tests 4–21; mutation cases `ed36-*`, `pj62-*` | PASS |
| Humanizer Skills intact, language contracts kept | `PINNED_LANGUAGES`; tests 19–20; `ed36-unregistered`, `ed38-en-unregistered` | PASS |
| 206 capability IDs, ownership mappings and recipe paths preserved | `git diff catalog/` empty; check-catalog fingerprint match; test 1 | PASS |
| Non-engineering Skills need no engineering capability | tests 2–3 register Skills that own none; tests 15–17 reject them as owners | PASS |
| Single canonical Skills directory | V-05 and V-13 unchanged and passing | PASS |
| No new production Entry Skill; no version bump; Step 04 not started | `git diff plugins/` empty; version `1.1.2`; line and depth checks unchanged | PASS |
| Obsolete count mutations updated, not suppressed | 5 cases retargeted to identity or registration faults; all pass | PASS |

### Risks and findings

- **L0 is now the effective limit on growth.** The 7,000-character budget
  (D-062) is still enforced. With 437 characters free, the fixtures keep
  their descriptions short (139 and 165 characters); a third typical Skill would
  exceed it. Step 05 replaces the budget with measurement and provider
  warnings.
- Diagnostics changed for two old controls: an unregistered shipped
  directory now reports the general CA-01 message instead of "unregistered
  project Skill", and invalid names report the name rule instead of the
  allow-list.
- A new editorial record needs only a valid language code. Under ADR-0013
  §7, adding one remains a decision, not something the validator approves.
- Removing the allow-lists removed a defence-in-depth layer against unsafe
  names. Names are now checked against `SKILL_NAME` before any path is built,
  `inside()` confinement still applies, and `ed36-unsafe-name` (`../outside`)
  still fails.

### Next action

Step 04 (Line and Reference Depth Limits) is **ready**: prerequisite 02 is
PASS. Its targets are matrix rows K-05..K-07, R-16..R-19, T-10..T-12,
DOC-07..DOC-10, DOC-13 and DOC-16. Not started; it waits for the owner's
instruction.

---

## Step 04 — Line and Reference Depth Limits

- **Date:** 2026-10-22
- **Status:** PASS
- **Starting state:** branch `develop`, HEAD `7427eb1`, version `1.1.2`.
  Worktree: Step 01–03 changes only. Step 03 confirmed `PASS`.
- **Authorization:** the owner's STEP 04 instruction (2026-10-22): "Remove
  arbitrary file-length and reference-hop restrictions without sacrificing
  integrity, safety, or efficient loading." It also directs: "Permit
  references to be discovered transitively instead of requiring every leaf to
  be linked directly from SKILL.md. Ensure orphaned Reference files are still
  detectable." That overrides the Step 02 judgment call that kept RF-02 as
  "linked directly from SKILL.md". ADR-0013 P-B2, D-066 and matrix R-19 are
  amended to match.

### Files changed

| Change | Path | What |
|---|---|---|
| Modified | `tools/validate/validate-package.mjs` | **V-06** moved out of the V-17 block and renamed `V-06 size-report`. The 300-line errors (`SKILL.md`, references) and the 200-line warning are removed. It now reports lines and estimated tokens (characters / 4) for every file, the largest `SKILL.md` and reference, and the worst single activation. It gives an advisory WARN above the provider recommendation of 500 lines or ~5,000 tokens (S24, S7). **V-08** is rewritten: every link in every Markdown file of a skill must resolve (with `decodeURI`) to a regular file inside that skill. A missing target, traversal, a link into another skill (with a hand-off-by-name hint), a symlink or junction (`lstat` plus `realpath`), a directory target or a missing anchor is an ERROR. A breadth-first walk from `SKILL.md` with a visited set and no depth cap finds orphans (ERROR) and transitive-only references (WARN). An iterative depth-first walk finds cycles (WARN, with the cycle path). No recursion remains. |
| Created | `tests/skills/reference-graph.test.mjs` | 16 disposable-fixture tests (see below). |
| Modified | `tests/skills/validator-mutations.json` | `sk-skill-too-long` (expected a V-06 300-line error) retargeted to `sk-link-into-other-skill` (V-08 cross-skill link). Not deleted. |
| Modified | `tools/validate/validate-all.mjs` | New gate G-13G runs the new test file. |
| Modified | `docs/chayen/SKILL_AUTHORING_STANDARD.md` | §1 model and level table; PT-06; SB-01; RF-02..RF-04; new "A valid graph is not a read graph" paragraph; §5.3 and §5.4 two-hop sentences; D-066 notice. |
| Modified | `docs/chayen/SKILL_QUALITY_GATES.md` | G-06 and G-08 rows; detection matrix (`sk-link-into-other-skill`, G-13G); D-066 notice; "Node.js 18" corrected to 20.11 (DOC-16). |
| Modified | `docs/chayen/ARCHITECTURE.md` | "As built (D-066)" note under §8 rules; DR-07; quality-attribute rows for Entry Skills (also stale since Step 03, now fixed), `SKILL.md` body and link depth. |
| Modified | `docs/chayen/PLUGIN_PACKAGE_DESIGN.md` | D-066 notice (the document is a dated PROPOSED design; rows not rewritten). |
| Modified | `docs/chayen/ACCEPTANCE_MATRIX.md` | ARC-07 and REQ-06 rows. |
| Modified | `docs/chayen/ISSUES.md` | R-15 reframed (transitive references may go unread), still OPEN. |
| Modified | `docs/chayen/ADRS/ADR-0013-*.md`, `docs/chayen/DECISIONS.md` (D-066) | Implementation status; P-B2 and D-066 amended with the owner's Step 04 instruction. |
| Modified | `tools/validate/README.md`, `tests/skills/README.md` | V-06 and V-08 rows; new test file. |
| Modified | `docs/chayen/evolution/MASTER_PLAN.md`, `MIGRATION_MATRIX.md`, `STEP_LOG.md` | Status and progress. |

**Unchanged:** `plugins/` and `catalog/` (`git diff --name-only -- plugins
catalog` is empty). No Skill was padded or edited. L0 (V-07) is untouched;
it is Step 05. Dated records that cite the old limits (decision entries for
Steps 20–22, `HUMANIZER_EVALUATION_REPORT.md`, `PLUGIN_TRUST_REVIEW.md`,
`TECHNOLOGY_COVERAGE.md` step notes, `docs/production/*`) are left as
written. `PLUGIN_FORMAT_DECISION.md` F-04 and `PROVIDER_SPEC_RESEARCH.md` §5
state provider facts and stay.

### Fixture tests (`tests/skills/reference-graph.test.mjs`)

Each test copies `plugins`, the marketplace folders, `catalog` and
`tests/skills` into a fresh `chayen-refgraph-*` OS-temp directory, changes
`chayen-init` there, runs the real package validator, and removes the copy.
Every test asserts that no former cap diagnostic (`lines > 300`,
`exceeds 2 hops`, `V-06 line-budgets`) appears, and that the validator was
not killed.

| # | Test | Result expected |
|---|---|---|
| 1 | Unchanged package | exit 0; size report present; max depth 1; 0 transitive; 0 cycles |
| 2 | `SKILL.md` at 348 lines (short filler lines, below the ~5,000-token figure) | exit 0; no V-06 warning |
| 3 | `SKILL.md` at about 600 lines | exit 0; advisory V-06 WARN with actual lines and tokens |
| 4 | Reference at about 416 lines | exit 0; reported as the largest reference |
| 5 | Chain `SKILL.md` → reference → hop-1 … hop-25 (depth 26) | exit 0; WARN listing 25 transitive-only references; "max depth 26" |
| 6 | Cycle hop-1 → hop-2 → hop-3 → hop-1 | exit 0; WARN with the cycle path; "1 cycle(s)" |
| 7 | 500-file cycle | exit 0, terminates; "max depth 501 … 1 cycle(s)" |
| 8 | Missing target | ERROR "broken link … (target does not exist)" |
| 9 | Traversal `../../../../../../outside.md` | ERROR "leaves the skill directory" |
| 10 | Percent-encoded traversal into another skill | ERROR "points into another skill (chayen-testing)" |
| 11 | Cross-skill reference | ERROR "points into another skill … hand off by name instead" |
| 12 | Broken heading anchor | ERROR "missing heading anchor" |
| 13 | Link to a directory | ERROR "does not point to a file" |
| 14 | Orphaned reference | ERROR "orphaned reference, RF-02" |
| 15 | Two orphans that link only to each other | ERROR for both |
| 16 | Directory junction inside a skill | ERROR V-09 "refusing symlink or junction" (ran on this host; not skipped) |

During development, test 2 at first used long filler lines and drew a V-06
warning at 348 lines (~6,118 tokens). That was correct behaviour, because
the token figure is part of the recommendation. The test now uses short
lines; test 3 covers the warning.

**Control of the test itself:** a scratchpad copy pointed at the baseline
validator (`git archive HEAD tools`) fails 15 of 16. The positive tests
(1–7) fail on exactly the removed caps (`ERROR V-06 line-budgets: … 348
lines > 300`, `… 416 lines > 300`, `… is not linked from SKILL.md
(unreachable, RF-02)`). Tests 8–15 fail there only because the diagnostic
wording changed; the old validator also rejected those faults. Test 16
passes on both, because the symlink guard is unchanged.

### Commands

| Command | Exit | Result |
|---|---|---|
| `node tools/validate/validate-package.mjs` | 0 | 0 errors, **0 warnings** (the five 200-line warnings were for the removed target). V-06: largest `SKILL.md` `chayen-frontend` 230 lines (~4,281 tokens); largest reference `chayen-data/references/sqlserver-data-access.md` 243 lines (~3,594 tokens); worst activation `chayen-data` ~7,495 tokens. V-08: 258 Markdown files, max depth 1, 0 transitive, 0 cycles |
| `node --test tests/skills/reference-graph.test.mjs` | 0 | 16 tests, 16 pass, 0 fail, 0 skipped |
| `node tools/validate/run-validator-tests.mjs --only <id>` for `sk-link-into-other-skill`, `sk-broken-reference-path`, `sk-broken-anchor`, `sk-unreachable-reference`, `ed36-missing-reference` | 0 each | 5/5 PASS |
| `node tools/validate/validate-all.mjs` | 0 | 22/22 gate groups PASS (adds G-13G); G-13 189/189 |
| `node --test tests/ci/negative-controls.test.mjs` | 0 | 4/4 |
| `node tools/evals/run-evaluation-suite.mjs` (no `--write`) | 0 | Static and traceability PASS; unchanged |
| Link check over the 9 edited governance and README files | 0 | 70 links, 0 problems |
| Baseline-validator control (scratchpad copy) | 1 | 15/16 fail as described above |

### Acceptance

| Criterion | Evidence | Result |
|---|---|---|
| `SKILL.md` 300-line hard failure removed | Tests 2–3; V-06 code | PASS |
| Reference 300-line hard failure removed | Test 4 | PASS |
| Concise authoring kept as a recommendation; large files reported with sizes and context cost | V-06 WARN text (lines, tokens, "loaded on every activation" or "loaded whole"); SB-01, RF-04 | PASS |
| Existing files not padded | `git diff -- plugins` empty | PASS |
| Fixed two-hop maximum removed; safe iterative traversal | Tests 5, 7; no recursion in V-08 | PASS |
| Cycles detected and reported without recursion overflow | Tests 6–7 (500 files) | PASS |
| Every reachable local Markdown reference and anchor validated | V-08 checks every `.md` in the skill; tests 8, 12 | PASS |
| Missing targets, escaping paths, unsafe symlinks, cross-skill references rejected | Tests 8–11, 13, 16; `sk-link-into-other-skill` | PASS |
| Transitive discovery permitted; orphans detected | Tests 5, 14, 15; `sk-unreachable-reference` | PASS |
| Progressive, conditional loading preserved | Plugin content unchanged; LD-02/LD-04 kept; transitive-only references warn; standard says a valid graph is not a read graph | PASS |
| Provider-neutral; no claim that a valid graph is read | SKILL_AUTHORING_STANDARD paragraph; ARCHITECTURE as-built note; R-15; warning text | PASS |
| Existing Skills still validate | `validate-package.mjs` 0 errors; `validate-all.mjs` 22/22 | PASS |
| Policy documents and Step Log updated; no unrelated runtime behaviour changed | Files above; only V-06 and V-08 changed in code | PASS |

### Judgment calls for owner review

1. **Cycles are warnings, not errors.** DR-07 used to say "No cycles". A
   cycle no longer breaks validation and does not make an agent load
   anything, but it is reported with its path. Say if cycles should block.
2. **Reference files use the same advisory figure as `SKILL.md`** (500 lines
   or ~5,000 tokens). No provider states a figure for references. The
   reasoning is that a reference loads whole when read.
3. **Transitive-only references are warnings** (provider recommendation S24),
   so they need G-15 acknowledgement. Today there are none.

### Risks and findings

- A reference reachable only through another reference may never be read.
  Validation cannot prove reading (R-15); the evaluation steps (14, 18) are
  where that gets measured.
- V-08 now checks links in every `.md` under a skill directory, including
  nested folders. V-18 (reference kind) still checks only top-level
  `references/*.md`. No nested files exist today. Pre-existing gap, noted
  for Step 06.
- The worst single activation is ~7,495 estimated tokens (`chayen-data` body
  plus its largest reference). This is a characters/4 estimate; provider
  token counts are Step 18.

### Next action

Step 05 (Metadata Budget Policy) is **ready**: prerequisite 02 is PASS. Its
targets are matrix rows K-02, R-15, R-21, R-22, T-09, T-14, DOC-05 (budget),
DOC-08 (DS-05, L0 row), DOC-10 (L0 rows), DOC-11, DOC-12 (L0 sentences) and
DOC-14. Not started; it waits for the owner's instruction.

---

## Step 05 — Metadata Budget Policy

- **Date:** 2026-10-22
- **Status:** PASS
- **Starting state:** branch `develop`, HEAD `7427eb1`, version `1.1.2`.
  Worktree: Step 01–04 changes only. Step 04 confirmed `PASS`.
- **Authorization:** the owner's STEP 05 instruction (2026-10-22): "Remove
  Chayen's fixed 7,000-character metadata Hard Fail while preserving
  visibility into provider context limits and Skill discovery quality."

### Files changed

| Change | Path | What |
|---|---|---|
| Created | `tools/catalog/discovery-metrics.mjs` | Shared library and CLI (`[--root <dir>] [--json]`). Reports actual and projected name + description characters; estimated tokens (characters / 4, labelled as an estimate); counts by category; per-skill characters, tokens and share; "unusually expensive" descriptions above the package's own Tukey fence (Q3 + 1.5 IQR, advisory); largest contributors; closest description pairs (collision risk) against the V-07b thresholds; and violations of the 1,024-character provider limit. Provider diagnostics come from documentation: Claude Code is UNKNOWN (1% of an unknown context window; the 1,536-character entry cap is checked), Codex is within or above its documented 8,000-character fallback, and Copilot is UNKNOWN (U-06). All are `measurement: NOT_MEASURED`. Output is sorted by name and has no timestamps. |
| Modified | `tools/catalog/skill-registration.mjs` | `L0_BUDGET = 7000` removed; nothing replaces it. |
| Modified | `tools/validate/validate-package.mjs` | V-07 renamed `V-07 discovery-metadata`. The L0 error is gone. Kept: the 1,024-character error (now labelled "provider limit P-02"), the 420 warning, YAML safety and the "Not for" boundary. The PASS line reports totals, the token estimate and the provider statuses. WARN when actual metadata exceeds a documented provider figure (Codex 8,000; ADR-0013 P-L). V-07b uses the shared `descriptionOverlap` and thresholds, so its behaviour is unchanged. |
| Modified | `tools/evals/run-evaluation-suite.mjs` | `cap: L0_BUDGET` replaced by `cap: null` and a note. Adds `report.metrics.discovery` from the shared library, a consistency check (S-DISCOVERY) between the two L0 computations, and INFO lines for contributors, collision risk and provider figures. |
| Modified | `tools/validate/check-docs.mjs` | D-06: the README fact is `L0 metadata = <usage> characters`. A "used / budget" pair in current docs is now an error (restated cap), and a stated usage must equal the build's. |
| Modified | `tools/validate/validate-all.mjs` | New gate G-13M. |
| Created | `tests/catalog/discovery-metrics.test.mjs` | 13 disposable-fixture tests (see below). |
| Modified | `tests/ci/documentation.test.mjs` | The two 7,000-denominator cases rewritten (`metadata usage`, `metadata budget restated`); two prose cases added. 15 → 17 tests. |
| Modified | `tests/catalog/editorial-mutations.json` | `ed36-exceeded-planned-budget` (expected the L0 error) retargeted to the fault that remains, registry drift (V-19). Kept, not deleted. |
| Modified | `tests/catalog/registration.test.mjs` | Three assertions updated to the new V-07 line (check ID; categories now sorted). Behaviour unchanged. |
| Modified | `README.md`, `docs/AUTOMATIC_SKILL_DISCOVERY.md` (new section "Discovery metadata and provider limits"), `docs/SKILLS_CATALOG.md`, `docs/CONTRIBUTING.md`, `docs/RESPONSE_STYLE.md`, `docs/distribution/RELEASE_CHECKLIST.md` (rule P-L item) | User and release docs: usage without a cap, provider limits, the evidence requirement before claiming compatibility. |
| Modified | `docs/chayen/ARCHITECTURE.md`, `KNOWN_LIMITATIONS.md` (KL-03), `SKILL_AUTHORING_STANDARD.md` (L0 row, DS-05, notice), `SKILL_QUALITY_GATES.md` (G-07, notice), `SKILL_REGISTRATION.md`, `ADRS/ADR-0004`, `ADRS/README.md`, `ADRS/ADR-0013`, `DECISIONS.md` (D-066), `tools/catalog/README.md`, `tools/validate/README.md`, `tests/catalog/README.md` | Policy and status. ARCHITECTURE's "at most 15 entry skills" line (stale since Step 03) is also corrected. |
| Modified | `docs/chayen/evolution/MASTER_PLAN.md`, `MIGRATION_MATRIX.md`, `STEP_LOG.md` | Status and progress. |

**Unchanged:** `plugins/` and `catalog/` (`git diff --name-only -- plugins
catalog` is empty); no description was edited. Dated records that cite
earlier budgets are left as written: README version history, decision
entries D-034..D-062, ISSUES R-27, HUMANIZER_ARCHITECTURE_IMPACT,
TECHNOLOGY_COVERAGE notes and `docs/production/*`.

### Fixture tests (`tests/catalog/discovery-metrics.test.mjs`)

Fixtures lengthen engineering descriptions in a disposable copy by
inserting distinct, valid scope sentences before the "Not for" clause.

| # | Test | Expectation |
|---|---|---|
| 1 | Existing metadata | exit 0; report total = independent recount of every shipped SKILL.md; tokens = round(chars / 4); per-skill sum = total; shares sum to 1; V-07 line matches |
| 2 | Metadata at 7,007 characters | exit 0; no L0 error; no provider warning (below 8,000) |
| 3 | Metadata at 8,369 characters | exit 0; V-07 WARN naming Codex's documented 8,000 figure and the routing-evidence requirement; Codex `EXCEEDS_DOCUMENTED_FIGURE` |
| 4 | Provider diagnostics | every provider `NOT_MEASURED`; Claude Code and Copilot `UNKNOWN`; Codex `WITHIN_DOCUMENTED_FIGURE` |
| 5 | Determinism | two runs give identical JSON; reversing the registry order gives identical JSON; projected = actual + planned records |
| 6 | Expensive description | a doubled backend description is the only one flagged and the largest contributor |
| 7–13 | Each with metadata above 7,000 | a shipped description above 1,024 (V-05 and V-07 "provider limit P-02"); a planned registry description above 1,024 (V-19); a duplicate identity across categories; YAML-unsafe frontmatter; catch-all wording (V-20); a missing "Not for" boundary (V-07); a description identical to another Skill's (V-07b overlap 1.00). Each fails with exit 1 for its own reason and no L0 diagnostic |

**Control of the test itself:** a scratchpad copy pointed at the baseline
validator fails 10 of 13. Tests 2 and 3 fail on exactly
`ERROR V-07 metadata-budget: L0 metadata 7007 chars > 7000` and `… 8369
chars > 7000`. Tests 7–13 fail because the old validator adds that L0 error
to each fault. Test 1 fails on the changed V-07 line. Tests 4–6 use only the
new report and pass either way.

### Commands

| Command | Exit | Result |
|---|---|---|
| `node tools/catalog/discovery-metrics.mjs` | 0 | 16 shipped, 6,563 characters, ~1,641 tokens (estimate); projected 6,563; largest contributors `chayen-implementation` 439, `chayen-frontend` 435, `chayen-ai-engineering` 433; expensive: none (fence 470.75); 0 pairs above 0.25, closest `chayen-humanizer-en`/`chayen-humanizer-th` 0.237; Claude Code UNKNOWN, Codex WITHIN (6,563 of 8,000, headroom 1,437), Copilot UNKNOWN; all NOT_MEASURED |
| `node tools/validate/validate-package.mjs` | 0 | 0 errors, 0 warnings; V-07 discovery-metadata PASS with the figures above |
| `node --test tests/catalog/discovery-metrics.test.mjs` | 0 | 13/13 pass, 0 skipped |
| `node --test tests/ci/documentation.test.mjs` | 0 | 17/17 |
| `node tools/validate/run-validator-tests.mjs --only ed36-exceeded-planned-budget` | 0 | PASS: V-19 "shipped Humanizer metadata differs from registry" |
| `node tools/validate/check-docs.mjs` | 0 | 34 files, 0 errors (before the doc updates it reported exactly the 5 stale cap statements) |
| `node tools/validate/validate-all.mjs` | 0 | 23/23 gate groups PASS (adds G-13M); G-13 189/189; G-13R 21/21; G-13G 16/16 |
| `node --test tests/ci/negative-controls.test.mjs` | 0 | 4/4 |
| `node tools/evals/run-evaluation-suite.mjs` (no `--write`) | 0 | Static and traceability PASS; discovery INFO lines; S-DISCOVERY consistency holds |
| Link check over 11 edited governance and README files | 0 | 69 links, 0 problems |
| Baseline-validator control (scratchpad copy) | 1 | 10/13 fail as described above |

### Acceptance

| Criterion | Evidence | Result |
|---|---|---|
| `L0_BUDGET = 7000` removed as a rejection threshold, not replaced by another cap | `skill-registration.mjs`; `grep L0_BUDGET` empty; tests 2–3 | PASS |
| Actual metadata calculated from the package; characters and estimated tokens reported, labelled as estimates | Report; test 1 (independent recount) | PASS |
| Per-skill contributions; unusually expensive descriptions identified | Report per-skill table; test 6 | PASS |
| Provider frontmatter and description-length constraints kept | Tests 7, 8, 10; V-05, V-07, V-19 | PASS |
| Distinctness, trigger specificity and negative boundaries kept | Tests 11–13; V-07b unchanged in behaviour | PASS |
| Provider diagnostics only where documented; otherwise UNKNOWN or NOT_MEASURED | Test 4; report; `evidenceLevel` | PASS |
| Truncation, context tax and routing-collision risks reported | Report: provider status and entry cap, "context tax" line, collision pairs | PASS |
| Diagnostics kept separate from measured provider behaviour | Every provider `measurement: NOT_MEASURED`; docs state static figures are not evidence | PASS |
| No claim that unlimited Skills are reliably discovered | AUTOMATIC_SKILL_DISCOVERY "Adding Skills"; KL-03; ADR-0013 | PASS |
| Existing metadata passes; above 7,000 does not fail on the cap | Test 1; tests 2–3 | PASS |
| Duplicate identity and invalid frontmatter still fail | Tests 9–10 | PASS |
| Calculations deterministic and repeatable | Test 5 | PASS |
| Policy documented: repository limits advisory, provider limits apply, inventory growth needs routing and context evaluation | AUTOMATIC_SKILL_DISCOVERY section; RELEASE_CHECKLIST P-L item | PASS |
| Every test and validator affected by the 7,000 limit updated; no historical test silently disabled | `ed36-exceeded-planned-budget` retargeted; documentation cases rewritten plus two added; registration assertions updated; nothing removed or skipped | PASS |

### Judgment calls for owner review

1. **Codex's 8,000 characters is the only provider figure used**, as a
   WARN. It is the documented fallback when the context window is unknown;
   the real budget may be larger, and it is shared with every other installed
   Skill.
2. **"Unusually expensive" is relative to this package** (Tukey fence),
   advisory and report-only. It is not a gate, and it adds no new fixed
   number.
3. **The provider warning uses actual (shipped) metadata.** Planned
   registrations are reported as projected, because providers do not list
   unshipped Skills.

### Risks and findings

- With no cap, metadata can grow until a provider truncates descriptions.
  The only signals are the advisory V-07 warning, the report and release
  rule P-L (a checklist item, not an automated gate). Provider capacity is
  NOT_MEASURED until evolution Step 18.
- Character counts approximate what providers list. Hosts may also list
  paths or other fields, so real listing sizes are larger by an unknown
  amount.
- The shell heredoc used to append log entries failed twice on text with
  apostrophes. Edits were then made with the editor or with patch scripts
  in the scratchpad. No partial writes occurred: each script writes a file
  only after all its replacements match.

### Next action

Stopped after Step 05, as instructed. Step 06 (Limit Regression Tests) is
**ready**: prerequisites 03, 04 and 05 are PASS. Its targets are matrix rows
T-13 (Class B negative controls), T-16 (derive the Phase 5 Skill count),
T-18 (`tests/ci/limits.test.mjs`) and T-19 (register
`tests/ci/negative-controls.test.mjs`), plus the V-18 nested-reference gap
noted in Step 04. Not started.

---

## Step 06 — Limit Regression Tests

- **Date:** 2026-10-22
- **Status:** PASS
- **Starting state:** branch `develop`, HEAD `7427eb1`, version `1.1.2`.
  Worktree: Step 01–05 changes only. Steps 03, 04 and 05 confirmed `PASS`.
- **Authorization:** the owner's STEP 06 instruction (2026-10-22): "Verify
  that the removal of artificial restrictions is complete and consistent
  across source code, validators, tests, documentation, and architecture
  decisions."
- **Deliverable:** [LIMIT_MIGRATION_REPORT.md](LIMIT_MIGRATION_REPORT.md).

### Audit

`git grep --untracked` over the whole repository (excluding generated
`tests/evals/claude` and these evolution documents) for every listed term
found 133 matches before fixes and 144 after. The increase is the new notices
that name former values. Classification is in LIMIT_MIGRATION_REPORT §4.
Raw results are in the scratchpad (`step06-audit-raw.txt`,
`step06-audit-after.txt`). A second search found no numeric comparison on
Skill count, lines, depth or metadata in `tools/`. It also re-checked the
15/25 ceilings stated in documents.

**Active items found and fixed:**

1. `SKILL_AUTHORING_STANDARD.md` CA-01 still said "combined maximum 16" and
   "fit maximum 15". It contradicted the code, and the new G-13L rule-row
   test flagged it on its first run.
2. V-18 checked only top-level `references/*.md`, while V-08 (Step 04)
   reaches nested files. A nested reference without a kind passed. V-18 and
   V-06 now cover every Markdown file in a skill except `SKILL.md`. The count
   is unchanged at 242; the only `.md` outside `references/` is
   `skills/README.md`, which is outside every skill.
3. `phase5.test.mjs` pinned `SKILLS.length === 16`. The pin is removed; the
   per-Skill probe coverage checks stay.

**Documentation clarified:** ADR-0009 and ADR-0012 (superseded-limits
notices); ARCHITECTURE §8 (note that the table is the original design);
PLUGIN_PACKAGE_DESIGN (notice now covers the V-07 row); PROJECT_CHARTER (D-066
paragraph); ISSUES R-57 (D-066 update; still OPEN for its other items);
SKILL_QUALITY_GATES G-13 (fixture suites listed); `tools/validate/README.md`
V-18; CONTRIBUTING developer checks and policy paragraph.

### Files changed in Step 06

| Change | Path |
|---|---|
| Created | `tests/ci/limits.test.mjs`; `docs/chayen/evolution/LIMIT_MIGRATION_REPORT.md` |
| Modified (code) | `tools/validate/validate-package.mjs` (V-18/V-06 reference scope); `tools/validate/validate-all.mjs` (G-13L, G-14N) |
| Modified (tests) | `tests/evaluation/phase5/phase5.test.mjs` |
| Modified (docs) | `docs/chayen/SKILL_AUTHORING_STANDARD.md`, `SKILL_QUALITY_GATES.md`, `ARCHITECTURE.md`, `PLUGIN_PACKAGE_DESIGN.md`, `PROJECT_CHARTER.md`, `ISSUES.md`, `ADRS/ADR-0009-*.md`, `ADRS/ADR-0012-*.md`, `docs/CONTRIBUTING.md`, `tools/validate/README.md` |
| Modified (records) | `docs/chayen/evolution/MASTER_PLAN.md`, `MIGRATION_MATRIX.md`, `STEP_LOG.md` |

**Unchanged:** `plugins/` and `catalog/` (no diff). No Skill was added or
edited. Cumulative tracked diff for Steps 01–06: 36 files, +560 / −201, plus
the untracked new files (ADR-0013, 5 test files, `discovery-metrics.mjs`,
7 evolution documents).

### `tests/ci/limits.test.mjs` (G-13L)

| # | Test | Result |
|---|---|---|
| 1 | No `MAX_ENTRY_SKILLS`, `L0_BUDGET`, `PROJECT_NAMES` or former cap diagnostic in `tools/**/*.mjs` | pass |
| 2 | Rule rows (authoring standard L0/L1/L2, PT-06, SB-01, DS-05, RF-02..RF-04, CA-01; gates G-06..G-08; validator README V-06..V-08) state no removed cap unless marked "formerly" | pass after the CA-01 fix (failed before it) |
| 3 | One package beyond every former limit at once: 18 Skills (3 project), `SKILL.md` above 300 lines, reference above 300 lines, nested reference at depth 4, discovery metadata above 7,000 characters | package, catalog and security validators exit 0 with no former-cap diagnostic |
| 4–15 | On that package: name above 64 characters; description above 1,024; Copilot marketplace description above 1,024; provider-specific frontmatter field; hooks key in the Claude Code manifest; executable script; secret-shaped value (and not printed); link escaping the Skill; nested reference without a kind; orphaned nested reference; conflicting description; unregistered Skill | each exits 1 with its expected ERROR and no former-cap diagnostic |
| 16 | Junction inside a Skill | exits 1 (V-09); ran, not skipped |

### Commands

| Command | Exit | Result |
|---|---|---|
| `node tools/validate/validate-all.mjs` | 0 | **25/25** gate groups PASS (05:47:21Z–05:50:05Z): adds G-13L and G-14N; package 0 errors, 0 warnings; G-13 189/189 |
| `node tools/evals/run-evaluation-suite.mjs` | 0 | Static and traceability PASS; discovery INFO unchanged from Step 05 |
| `node --test tests/ci/limits.test.mjs` | 0 | 16/16 |
| `node --test` for registration (21), discovery-metrics (13), reference-graph (16), documentation (17), negative-controls (4), phase5 (13), security boundaries (36) | 0 each | all pass, 0 skipped |
| Control: G-13L nested-kind case against current `tools/` with the pre-Step-06 V-18 scope restored (scratchpad copy) | 1 | fails, so the gap was real |
| Link check over 9 edited governance files | 0 | 63 links, 0 problems |
| `git diff --name-only -- plugins catalog` | 0 | empty |

### Acceptance

| Criterion | Evidence | Result |
|---|---|---|
| All valid existing Skills pass | `validate-package.mjs` 0 errors and 0 warnings; G-13L test 3 copies them unchanged | PASS |
| Synthetic Skills beyond the old numeric limits pass | G-13L test 3; G-13R tests 2–3; G-13G tests 2–7; G-13M tests 2–3 | PASS |
| Negative security and integrity tests still fail as expected | G-13L tests 4–16; G-13R 4–21; G-13G 8–16; G-13M 7–13; G-13 189/189; G-SEC-T 36/36 | PASS |
| No obsolete numeric hard fail remains | Audit §4 (0 active restrictions); G-13L test 1 | PASS |
| Documentation and implementation agree | G-13L test 2; G-14 `check-docs` PASS; audit classification | PASS |
| Required commands run | `validate-all.mjs` and `run-evaluation-suite.mjs`, both exit 0 | PASS |
| Existing Skills and metadata preserved; Skill count not inflated | no diff in `plugins/` or `catalog/` | PASS |

### Risks and findings

- Provider capacity remains NOT_MEASURED (Steps 14, 18). Release rule P-L is
  a checklist item, not an automated gate.
- The rule-row check covers the listed authoritative rows. Prose elsewhere
  in maintained governance files relies on review and the dated-notice
  convention.
- The owner judgment calls from Steps 02, 04 and 05 remain open (report §7).

### Next action

Stopped after Step 06, as instructed. Step 07 (Task Contract Consistency) is
**ready**: its prerequisites 01 and 04 are PASS. Not started.

---

## Step 07 — Task Contract Consistency

- **Date:** 2026-10-22
- **Status:** PASS
- **Starting state:** branch `develop`, HEAD `7427eb1`, version `1.1.2`.
  Worktree: Step 01–06 changes; `plugins/` and `catalog/` had no diff before
  this step. Step 06 confirmed `PASS`.
- **Authorization:** the owner's STEP 07 instruction (2026-10-22):
  "Eliminate conflicting Task Contract instructions and establish one
  consistent decision policy across Chayen."

### Inconsistency confirmed before any change

| # | Where | Conflict |
|---|---|---|
| 1 | `chayen-implementation/SKILL.md` workflow step 4 vs `references/task-contract.md` procedure step 1 | The entry skill required a contract for three or more files, any risky area, **and** any request whose acceptance criteria could not be stated, however small. The recipe knew only "three or more files, or any risky area". |
| 2 | `SKILL.md` References row for `task-contract.md` | The load condition omitted ambiguity, so the recipe could stay unloaded for an ambiguous small request. |
| 3 | `SKILL.md` Preconditions vs workflow step 4 | Ambiguity got two prescriptions: "ask before editing" and "write a task contract". |
| 4 | `references/feature-delivery.md` step 3 | A third copy of the "three or more files, or any risky action" rule. |
| 5 | Recipe inline template vs `task-contract-template.md` | Two formats, with different status vocabularies (`proposed \| approved by` versus `PROPOSED` plus approval state) and field names (`Risky actions needing approval` versus `Risk and approval gates`). The template had no risk-class field. |

`chayen-requirements` was consistent ("observable and testable" acceptance
criteria) and is unchanged. `chayen-backend` and `chayen-frontend` asked
what "done" looks like, but did not group questions or separate
confirmation from approval.

### The policy (authoritative in the recipe, procedure steps 1–6)

| Owner rule | Recipe | Entry skill summary | Template |
|---|---|---|---|
| 1 Fully specified, low risk → proceed without questions or artifacts | Step 1b, last row; Verification | Workflow step 4, last bullet; Preconditions | — |
| 2 Ambiguous → clarify before editing until acceptance criteria are observable | Step 1a, step 2 | Workflow step 4, first bullet | — |
| 3 Risky → appropriate contract plus action-specific approval | Step 1b, first row; steps 4–5 | Workflow step 4; Safety boundaries | `Risk and approval gates`, `Risk class`, `Approval state` |
| 4 Multi-file or cross-layer → proportional contract | Step 1b, second row; Template section | Workflow step 4 | Proportional versus full field sets |
| 5 Observable, testable acceptance criteria | Step 1a; Rules; Verification | Workflow step 4 | AC table |
| 6 Never invent UX behaviour, permissions, API contracts, data fields or business rules | Step 2 | Workflow step 4 | — |
| 7 One grouped request; no clarification loops | Step 2 | Preconditions | — |
| 8 Confirming a description is never authorization for destructive or security-sensitive operations | Step 5; Rules | Safety boundaries | Completion rules (Status CONFIRMED is not Approval state) |
| Scope expansion discovered during work | Step 6; Rules | Failure handling | — |

The full policy lives once, in the recipe. The entry skill carries a
four-bullet summary, `feature-delivery.md` points to the recipe, and the
template defers to it ("the task-contract recipe decides which applies").
The "three or more files" figure survives only as a guide inside the
proportional row.

### Files changed

| Path | Change |
|---|---|
| `plugins/.../chayen-implementation/references/task-contract.md` | Rewritten procedure: ordered decision (1a clarify, 1b risky / several files / fully specified), grouped clarification (2), contract by template fields (3), risk classes kept unchanged (4), confirm-and-gate (5), re-decide on scope growth (6). Inline duplicate template removed and replaced by the template's field sets. Rules, Outputs and Verification aligned. Example rewritten in the template format. Frontmatter and `capabilities` unchanged. |
| `plugins/.../chayen-implementation/references/task-contract-template.md` | Status `PROPOSED \| CONFIRMED`; `Risk class` field; proportional versus full field sets; Status CONFIRMED is distinct from Approval state. |
| `plugins/.../chayen-implementation/SKILL.md` | Workflow step 4 is now a four-bullet summary of the recipe; Preconditions point to it; Outputs, Failure handling (scope growth) and Safety boundaries aligned; the References load condition covers unclear, risky, multi-file and growing scope. 223 → 230 lines. |
| `plugins/.../chayen-implementation/references/feature-delivery.md` | Step 3 refers to the recipe's decision instead of restating a rule. |
| `plugins/.../chayen-backend/SKILL.md`, `plugins/.../chayen-frontend/SKILL.md` | One sentence each: questions in one message, never invent the missing facts, no questions for a fully specified low-risk change, confirmation never approves a risky action. |
| `tests/skills/recipe-cases.json` | 450 → 452 cases. Updated: `rc-04-001-pos-vague-request` (prompt "Make the Settings page better."), `rc-04-001-neg-specified-edit` (prompt "Change the Save button from blue to green."), `rc-04-001-pos-csv-export` (proportional contract), `rc-04-003-pos-auth-change` (full contract; confirmation is not approval), `rc-04-002-pos-soft-delete-plan` (field name). Added: `rc-04-003-pos-destructive-migration` and `rc-04-001-pos-scope-expansion`. No case IDs renamed. |
| `tests/skills/README.md`, `docs/chayen/KNOWN_LIMITATIONS.md` (KL-15) | Case count 452. |
| `docs/chayen/evolution/MASTER_PLAN.md`, `STEP_LOG.md` | Status. |

**Unchanged:** every Skill description (metadata fingerprint still
`411b6adbbea7e121`; routing metadata untouched); `catalog/` (no diff;
CAP-04-001..003 mappings and recipe path intact); the version (`1.1.2`).
Shipped content did change, so the full package fingerprint differs from
`1.1.2` as tagged. Releasing it needs an owner version decision (rules §4).

### Regression cases (owner list)

| Owner case | Case ID | Expected behaviour checked |
|---|---|---|
| "Make the Settings page better." | `rc-04-001-pos-vague-request` | Grouped questions with interpretations before any edit; nothing invented; path decided after the answers |
| "Change the Save button from blue to green." | `rc-04-001-neg-specified-edit` | No question, no contract or other artifact, only the colour changes |
| Cross-layer CSV export | `rc-04-001-pos-csv-export` | Proportional contract before the first edit; observable criteria; no questions the repository answers |
| Authentication change | `rc-04-003-pos-auth-change` | Full contract, High risk, rollback note; no auth code before approval; confirmation is not approval |
| Destructive migration | `rc-04-003-pos-destructive-migration` (new) | Drop listed under gates, High or Critical with a backup note; no drop migration written or applied before approval of that action |
| Scope expansion during implementation | `rc-04-001-pos-scope-expansion` (new) | Pause before API or database edits; contract started or updated and re-confirmed; nothing invented; schema change listed for approval |

These are specifications graded on transcripts. Executing them needs an
agent runner (G-12, evolution Steps 15–17), so **agent behaviour is
NOT_RUN**. What ran is the static validation of the cases and the content.

### Commands

| Command | Exit | Result |
|---|---|---|
| `node tools/validate/validate-package.mjs` | 0 | 0 errors, 0 warnings; V-18 recipe anatomy PASS; V-22 452 cases PASS |
| `node tools/validate/check-security.mjs` | 0 | V-25 PASS (authority guards intact) |
| `node tools/validate/validate-all.mjs` | 0 | 25/25 gate groups PASS; G-03 catalog 0 errors; G-11 eval sync PASS; G-13 189/189 |
| `node tools/evals/run-evaluation-suite.mjs` | 0 | Static and traceability PASS; T-206 206/206 |
| `metadataFingerprint` on the plugin | 0 | `411b6adbbea7e121` (unchanged) |

### Acceptance

| Criterion | Evidence | Result |
|---|---|---|
| Ambiguous small requests do not bypass clarification | Recipe step 1a ("however small"), step 2; SKILL step 4; References load condition; `rc-04-001-pos-vague-request` | PASS (static); behaviour NOT_RUN |
| Fully specified trivial edits trigger no bureaucracy | Recipe step 1b last row and Verification; SKILL Preconditions and step 4; `rc-04-001-neg-specified-edit`, `rc-04-001-neg-readme-typo` | PASS (static); behaviour NOT_RUN |
| Risky actions remain approval-gated | Recipe steps 4–5 and Rules; template Approval state; SKILL Safety boundaries; auth and destructive-migration cases | PASS (static); behaviour NOT_RUN |
| Entry skill and recipe no longer contradict each other | One decision in the recipe; the summary in SKILL.md and feature-delivery.md maps to it row for row (table above); a single remaining "three or more files", inside the recipe's proportional row | PASS |
| Existing catalog mappings intact | `catalog/` no diff; G-03 PASS; V-19 117 recipe files agree | PASS |
| Relevant validators pass | `validate-all.mjs` 25/25; evaluation suite PASS | PASS |

### Risks and findings

- **Shipped guidance changed without a version bump.** Version-pinned
  installs of `1.1.2` will not receive it until an owner-approved version
  change (rules §4). The CHANGELOG `[Unreleased]` section was not edited.
- **Behaviour is unverified.** Wording consistency does not show that an
  agent follows the decision; the six cases need an agent runner and grader
  (Steps 15–17).
- The recipe grew from 153 to 171 lines and the entry skill from 223 to 230;
  both are far below the advisory figure.

### Next action

Stopped after Step 07, as instructed. Step 08 (Acceptance Evidence
Contract) is **ready**: prerequisite 07 is PASS. Not started.

---

## Step 08 — Acceptance Evidence Contract

- **Date:** 2026-10-22
- **Status:** PASS
- **Starting state:** branch `develop`, HEAD `7427eb1`, version `1.1.2`.
  Worktree: Step 01–07 changes. Step 07 confirmed `PASS`.
- **Authorization:** the owner's STEP 08 instruction (2026-10-22): "Make
  completion reporting consistent across planning, implementation, backend,
  frontend, database, and testing guidance."

### Artifacts inspected (actual paths)

All under `plugins/codejadee-chayen-framework/skills/`:
- `chayen-implementation/references/task-contract-template.md`,
  `change-summary.md`, `verification-report-template.md`,
  `change-passport-template.md` (the Change Passport template);
- `chayen-implementation/SKILL.md`, `chayen-backend/SKILL.md`,
  `chayen-frontend/SKILL.md`, `chayen-data/SKILL.md`,
  `chayen-testing/SKILL.md`;
- the 12 composite workflows `*/references/workflow-*.md`;
- the other templates sharing the DONE rule (`implementation-plan-template.md`,
  `risk-assessment-template.md`, `architecture-decision-record-template.md`,
  `context-capsule-template.md`).

**Inconsistencies found:**
1. Four acceptance formats: the task contract (5 columns), the change
   summary (3 columns), the verification report (a `Status` column mixing
   command status with criteria), and the passport ("criterion -> report
   row").
2. Two status vocabularies with no stated relation: command-level
   PASS/FAIL/NOT_RUN (implementation, workflows) and per-test
   PASSED/FAILED/SKIPPED/BLOCKED/NOT_RUN/UNKNOWN (`chayen-testing`).
3. DONE rule: the task contract required "every criterion at accept", but
   the verification report, passport, four other templates and the 12
   workflows required only "completed scope and required verification".
4. No guidance on adequate evidence per layer (build versus browser, unit
   test versus API authorization, diff versus runtime, generated versus
   applied migration), no freshness field, and no traceability fields for
   scope changes and approvals in the summary.

### Changes (shipped content)

| Path | Change |
|---|---|
| `chayen-implementation/references/change-summary.md` | **Single definition of completion semantics.** Step 3: command statuses from the testing contract (PASS = PASSED, FAIL = FAILED, SKIPPED, BLOCKED, NOT_RUN, UNKNOWN; N/A needs a reason); baseline failures separate, unexplained failures not attributed to the baseline. Step 4: the **acceptance record** with the nine owner fields (AC, expected behaviour, method, environment, evidence, freshness, check status, verdict, open issue); proportional one-line form for simple changes. Step 5: verdict rules (accept only from observed, fresh, adequate evidence in the required environment, never from a declaration; verify_more for missing, partial, stale, irreproducible, inadequate, uncovered, or SKIPPED/BLOCKED/NOT_RUN/UNKNOWN; revise when contradicted); the evidence-adequacy table; check status never stands in for a verdict. Step 6: DONE, PARTIAL and BLOCKED rules (written code is never DONE by itself; a revise blocks DONE). Step 7: scope changes and approvals listed, or "none". Evidence audit step 6: a DONE claim with a non-accepted criterion is unsupported. Template, Outputs, Rules, Technology considerations and Verification aligned. Capabilities unchanged. |
| `.../task-contract-template.md` | AC table is the acceptance record (method and environment planned before editing); completion rules point to the change-summary recipe's verdict rules. |
| `.../verification-report-template.md` | Rows keyed by AC with freshness and check status; a separate `Acceptance verdicts` line; full status vocabulary in the result summary; check status versus verdict and the adequacy examples in the completion rules; DONE requires every required criterion at accept. |
| `.../change-passport-template.md` | Acceptance to evidence carries freshness, check status and verdict and lists uncovered criteria; `Scope changes` field; DONE rule aligned. |
| `implementation-plan-template.md`, `risk-assessment-template.md`, `architecture-decision-record-template.md`, `context-capsule-template.md` | DONE rule aligned: "where the task has acceptance criteria, every required criterion at accept". |
| `chayen-implementation/SKILL.md` | Verification: full status vocabulary; check status is not a verdict (with the three adequacy examples); the acceptance-criteria row points to the acceptance record; DONE only when every required criterion is accept. |
| `chayen-backend/SKILL.md` | Acceptance record fields; an authorization criterion needs a request-level test of allowed and denied paths (a unit test or diff alone is verify_more); DONE rule. |
| `chayen-frontend/SKILL.md` | Acceptance record fields; a UI behaviour criterion needs a browser, device or component observation after the last relevant edit (a build pass alone is verify_more); DONE rule. |
| `chayen-data/SKILL.md` | Acceptance record fields; a migration criterion needs apply, rollback and re-apply on a disposable database (a generated script alone is verify_more); DONE rule. |
| `chayen-testing/SKILL.md` | Test status is not the verdict: uncovered or SKIPPED/BLOCKED/NOT_RUN/UNKNOWN is verify_more, a FAILED test of the criterion is revise, and only a fresh PASSED test supports accept. |
| 12 × `*/references/workflow-*.md` | The identical DONE sentence gains: one verdict per criterion from fresh, adequate evidence; check status is never the verdict; DONE needs every required criterion at accept. V-24's required phrases ("PASS, FAIL, NOT_RUN or N/A", "PARTIAL or BLOCKED") are kept. |

No new evidence format was created: the acceptance record lives in the
existing change-summary recipe and task contract template, and the other
templates reference it.

### Tests

`tests/skills/recipe-cases.json`: 452 → 460 cases (8 added, none changed or
removed):

| Layer | Adequate evidence (accept possible) | Inadequate or contradicting evidence |
|---|---|---|
| API | `rc-18-002-pos-api-evidence-adequate`: request-level tests for allowed and denied paths after the last edit | `rc-18-002-pos-api-unit-only`: unit tests only, so authorization is verify_more, the request check is NOT_RUN, and the outcome is PARTIAL |
| UI | `rc-18-002-pos-ui-observed`: the user's browser observation after the last edit, attributed to the user | `rc-18-002-pos-ui-build-only`: build pass and a request to mark it done; verify_more, PARTIAL not DONE |
| Database | `rc-18-002-pos-db-migration-applied`: apply, rollback and re-apply on a disposable database; production apply still needs approval | `rc-18-002-pos-db-migration-generated-only`: generated script only; verify_more, not DONE |
| Cross-layer | `rc-18-002-pos-cross-layer-traceable`: scope changes and the migration approval are traceable; a row per layer | `rc-18-003-pos-cross-layer-overclaim`: audit of a DONE claim; failing test → revise, uncovered → verify_more, baseline failure separated, DONE unsupported |

These are transcript-graded specifications. **Agent behaviour is NOT_RUN**:
they need the runner and grader planned for Steps 15–17.

`tests/skills/README.md` and `docs/chayen/KNOWN_LIMITATIONS.md` (KL-15)
updated to 460 cases.

### Commands

| Command | Exit | Result |
|---|---|---|
| `node tools/validate/validate-package.mjs` | 0 | 0 errors, 0 warnings; V-18 recipe and template anatomy PASS; V-22 460 cases PASS |
| `node tools/catalog/check-workflows.mjs` | 0 | 0 errors (V-24 required phrases intact in all 12 workflows and the templates) |
| `node tools/validate/check-security.mjs` | 0 | V-25 PASS |
| `node tools/validate/validate-all.mjs` | 0 | 25/25 gate groups PASS; G-03 catalog 0 errors; G-13 189/189; G-14 docs PASS |
| `node tools/evals/run-evaluation-suite.mjs` | 0 | Static and traceability PASS; T-206 206/206; S-HANDOFF 0 dangling |
| `metadataFingerprint` | 0 | `411b6adbbea7e121` (unchanged; no description edited) |
| `git diff --numstat -- plugins` | 0 | Content-only changes (+3 lines per workflow; one line per aligned template); working copies were already LF |

### Acceptance

| Criterion | Evidence | Result |
|---|---|---|
| Every supported workflow uses consistent completion semantics | One definition in the change-summary recipe. The task contract, verification report, passport, plan, risk, ADR and capsule templates, five entry skills and all 12 composite workflows state the same DONE rule and verdict vocabulary. A sweep found 0 remaining copies of the older DONE wording and 0 "mapped to its evidence" lines | PASS |
| No required missing evidence is silently treated as success | verify_more covers missing, partial, stale, irreproducible, inadequate, uncovered and SKIPPED/BLOCKED/NOT_RUN/UNKNOWN; NOT_RUN rows stay visible; "Not verified" lists uncovered criteria; DONE needs every required criterion at accept; an audit marks a DONE overclaim unsupported | PASS (static); behaviour NOT_RUN |
| Owner completion policies (code alone ≠ DONE; declaration ≠ accept; build ≠ browser; unit test ≠ API authorization; diff ≠ runtime; missing test visible; baseline separated; all required ACs accepted before DONE; scope and approvals traceable) | change-summary steps 3–7 and the adequacy table; domain-specific lines in backend, frontend, data and testing | PASS |
| Command status and AC verdict not confused | Separate columns in every template; explicit statement in the recipe, templates, implementation and testing skills | PASS |
| Proportional reporting for simple tasks | One-line `Check:` form in the change-summary recipe; templates "keep low-risk reports compact" retained | PASS |
| Representative positive and negative cases for API, UI, database, cross-layer | 8 cases (table above) | PASS (static) |
| Relevant validators run and recorded | Commands above | PASS |

### Risks and findings

- **Shipped guidance changed again without a version bump** (Steps 07 and
  08 together: 27 files under `plugins/`). Releasing needs an owner version
  decision; the CHANGELOG is not edited.
- **Behaviour unverified.** Whether agents follow the acceptance record, and
  stop claiming DONE, needs the runner and an independent grader (Steps
  15–17). Step 13 (Independent Evidence Audit) builds on the audit section
  changed here.
- The change-summary recipe grew from 146 to about 220 lines. It remains far
  below the advisory figure; V-06 reports no warning.
- The acceptance-record table has nine columns, which is wide in narrow
  terminals. The proportional one-line form is the mitigation for simple
  changes.

### Next action

Stopped after Step 08, as instructed. Step 09 (Guidance Consistency
Validator) is **ready**: prerequisites 06 and 08 are PASS. A natural first
target is a static check that the shared completion phrases above stay
aligned. Not started.

---

## Step 09 — Guidance Consistency Validator

- **Date:** 2026-10-22
- **Status:** PASS
- **Starting state:** branch `develop`, HEAD `7427eb1`, version `1.1.2`.
  Worktree: Step 01–08 changes. Steps 07 and 08 confirmed `PASS`.
- **Authorization:** the owner's STEP 09 instruction (2026-10-22): "Prevent
  important policy contradictions from reappearing when Entry Skills,
  Recipes, Templates, or Workflows are edited."

### Design

- **Developer-only, offline, deterministic, zero dependencies.** It reads
  Markdown under `plugins/.../skills/` and writes nothing. Nothing new ships
  in the plugin.
- **No natural-language proof.** Each invariant is a set of:
  - **structural anchors:** a named section, table, numbered step or
    References row must still carry a short key phrase. Emphasis and line
    breaks are normalized away;
  - **narrow contradiction patterns:** only definitional or claiming
    sentences ("accept when …", "… count as PASS", "approval of the
    contract covers …"), skipped when a negation appears in or just before
    the match.
- **Levels:** `ERROR` fails the build; `REVIEW` is a heuristic signal for
  G-15 human review and exits 0. The output is sorted and carries no
  timestamps.
- **Canonical definitions** live in `tools/validate/guidance-invariants.json`.
  Each invariant has a statement, a single authoritative source, a list of
  machine checks and a list of what still needs human review. A test ties
  the JSON to the documentation.

### Files changed

| Change | Path |
|---|---|
| Created | `tools/validate/check-guidance.mjs` (checker, gate G-18) |
| Created | `tools/validate/guidance-invariants.json` (canonical GI-01..GI-09) |
| Created | `tests/skills/guidance-consistency.test.mjs` (21 regressions, gate G-18T) |
| Created | `docs/chayen/GUIDANCE_INVARIANTS.md` (diagnostics, machine versus human split, limitations, change procedure) |
| Modified | `tools/validate/validate-all.mjs` (G-18, G-18T registered) |
| Modified | `docs/chayen/SKILL_QUALITY_GATES.md` (G-18 row), `tools/validate/README.md`, `tests/skills/README.md` |
| Modified (shipped, one line) | `chayen-implementation/references/workflow-new-feature.md`: the Report exit check "Completion is DONE only if required scope and checks are complete" now adds "and every required criterion is at accept". **Found by the checker on its first run**; Step 08 had missed it, because it changed only the workflows' Verification sentences. |
| Modified | `docs/chayen/evolution/MASTER_PLAN.md`, `STEP_LOG.md` |

### Invariants (machine part versus human part)

| ID | Machine-verified | Still requires human review |
|---|---|---|
| GI-01 task-contract-decision | The recipe Procedure says "clarify … before any edit … however small" before the decision table; the table has the full, proportional and no-contract paths; the entry-skill step delegating to the recipe names clarification before any edit and the three paths; the References load condition covers unclear requests; no file-count contract rule outside the recipe; no "proceed on a reasonable interpretation" | Whether summaries are faithful in meaning |
| GI-02 action-specific-approval | Recipe: approval of the exact action and target, and confirmation is never approval; implementation Safety boundaries: contract approval is not approval of each risky action; no sentence saying contract approval or confirmation covers, implies, counts as or authorizes approval | Approval wording in unrecognised forms |
| GI-03 acceptance-verdicts | Every definitional clause of accept, verify_more and revise (comma-joined lists read clause by clause); no "missing evidence is accept"; all three defined in the change-summary recipe | Verdict meaning in non-definitional prose |
| GI-04 completion-outcome | Every unit with a DONE-defining sentence has one that requires accept; no "written code or a green build counts as DONE"; DONE, PARTIAL and BLOCKED defined in the recipe | Other outcome vocabularies |
| GI-05 check-status-honesty | The testing status table defines all six statuses and SKIPPED says a skip is not a pass; the recipe lists the statuses and "never reported as passing"; no skipped, not-run, blocked or unknown check counted, treated, reported or marked as a pass | Status reporting in other phrasings |
| GI-06 source-of-truth-precedence | All 16 skills keep the Precedence principle with system/developer and provider priority; consuming skills that read `.chayen/profile.md` say the source wins; no `.chayen/` override wording | The internal order (REVIEW signal) |
| GI-07 advisory-not-enforcement | No "this skill, guidance, recipe, checklist, workflow, template or these instructions enforce, guarantee, ensure, prevent, block or stop" (negated forms allowed; domain verbs such as "endpoint enforces" not matched); no absolute safety claims; the advisory statement kept in security, data, devops, architecture and ai-engineering | Claims with another subject |
| GI-08 skill-ownership-and-handoff | Every `chayen-*` name resolves to a shipped skill; no provider invocation syntax; no self hand-off in "When not to use" | Whether the named skill really owns the request; unrecognised Better-fit outcomes (REVIEW) |
| GI-09 workflow-exit-and-verification | All 12 workflows keep "PASS, FAIL, NOT_RUN or N/A" and the one-verdict rule in Verification; exit checks are scanned by GI-04 and GI-05 | Whether each exit check suffices; completion claims without an evidence term (REVIEW) |

### Tests (`tests/skills/guidance-consistency.test.mjs`, 21/21)

| Owner requirement | Test(s) | Detected by |
|---|---|---|
| Ambiguous request skips clarification | entry-skill mutation ("proceed with the most reasonable interpretation"); recipe mutation ("note the assumption and continue") | GI-01 (two diagnostics); GI-01 |
| Template marks missing evidence as accepted | definition mutation ("accept when the evidence is missing or partial"); statement appended to the passport ("Missing evidence is marked accept…") | GI-03; GI-03 |
| Workflow treats a skipped test as PASS | Verification ("Skipped tests count as PASS"); exit check ("Skipped checks are reported as PASS…") | GI-05; GI-05 |
| Approval requirement weakened | entry skill ("Approval of the task contract covers each risky action"); recipe ("… the contract is approval of …") | GI-02 (anchor and contradiction); GI-02 (contradiction; the Rules section still states the rule, so the anchor rightly holds) |
| Valid wording change preserving semantics | one fixture with a paraphrased clarification bullet, reordered bullets, a reworded verdict definition joined with commas, "Skipping is never passing", a rewrapped workflow paragraph, added bold, and a negated enforcement sentence | **0 errors, 0 review items** |

Also covered: the shipped package passes (0/0); determinism (identical
output twice); REVIEW items do not fail (2 heuristic signals, exit 0); every
canonical invariant is documented; and one mutation each for GI-04
(template DONE without accept; the real `workflow-new-feature.md` regression;
"written code counts as DONE"), GI-06 (precedence removed; `.chayen` overrides
source), GI-07 (enforcement claim), GI-08 (`chayen-qa` hand-off) and GI-09
(verdict rule removed).

**False positives found and fixed during development:**
1. The decision-table anchor required the table at the start of a line,
   but the recipe indents it inside a list. Fixed: indentation allowed.
2. GI-04 at paragraph level accepted a weakened DONE sentence because the
   same paragraph mentioned "accept" elsewhere (a false negative). Fixed:
   at least one DONE-defining sentence must itself require accept.
3. GI-03 read the comma-joined 1.1.2 verdict sentence ("accept when …,
   verify_more when the evidence is missing …") as accept being defined
   with missing evidence. Fixed: a clause ends at the next verdict word. A
   regression case uses the comma-joined form.

**Control against history:** the checker run on the baseline `1.1.2`
package (`git archive HEAD plugins`) reports 47 errors, all genuine:
- GI-01 ×6: the duplicated "three or more files" rules, no clarification
  path, no delegation, a load condition without ambiguity;
- GI-02 ×2;
- GI-04 ×22: the weaker DONE rule in templates and workflows;
- GI-05 ×5: statuses missing from the recipe;
- GI-09 ×12: no verdict rule in the workflows.

These are the contradictions Steps 07 and 08 removed, so the invariants
target real past drift, not only synthetic mutations.

### Commands

| Command | Exit | Result |
|---|---|---|
| `node tools/validate/check-guidance.mjs` | 0 | 0 errors, 0 review items; 9 invariants over 259 Markdown files in 16 skills (after the `workflow-new-feature.md` fix; 1 error before it) |
| `node tools/validate/check-guidance.mjs --root <baseline copy>` | 1 | 47 errors, all genuine (above) |
| `node --test tests/skills/guidance-consistency.test.mjs` | 0 | 21/21, 0 skipped |
| `node tools/validate/validate-all.mjs` | 0 | **27/27** gate groups PASS (adds G-18 and G-18T); G-SEC PASS with the new developer files |
| `node tools/evals/run-evaluation-suite.mjs` | 0 | Static and traceability PASS |

### Acceptance

| Criterion | Evidence | Result |
|---|---|---|
| Catches the documented conflicts | All four required mutation families detected, each in two locations; 47 genuine errors on the pre-Step-07 baseline; one real gap found in current content | PASS |
| No excessive false positives | Shipped package 0 errors and 0 review items; the meaning-preserving rewording (7 edits) passes; three development-time false positives fixed and covered by tests | PASS |
| Existing valid skills pass | G-18 PASS on the package | PASS |
| Validation suite passes | `validate-all.mjs` 27/27; evaluation suite PASS | PASS |
| Machine-verified versus human review reported | Table above; `GUIDANCE_INVARIANTS.md` §"What is machine-verified" | PASS |
| Developer tooling only; nothing executable shipped | New files only under `tools/`, `tests/` and `docs/`; V-09 and G-SEC PASS | PASS |

### Risks and limitations

- **Anchors, not meaning.** A rewrite can keep an anchor and change the
  meaning, which passes, or keep the meaning and drop an anchor, which
  fails. The procedure in `GUIDANCE_INVARIANTS.md` is to update the anchor
  with a test, never to add an exception.
- **Negation guard.** An unrelated negation within 30 characters before a
  contradiction hides it. Documented.
- **Recognised forms only.** Unlisted phrasings of a contradiction are not
  caught; each invariant names its human-review part.
- Shipped content changed by one line in Step 09. Together with Steps 07–08,
  this still needs an owner version decision before release.

### Next action

Stopped after Step 09, as instructed. Step 10 (Repository Intelligence) is
**ready**: prerequisites 05 and 09 are PASS. Not started.

---

## Step 10 — Repository Intelligence

- **Date:** 2026-10-22
- **Status:** PASS
- **Starting state:** branch `develop`, **HEAD `a0f9bfe`** ("Add discovery
  metrics tool and guidance consistency checker", 2026-10-22 14:02 +0700,
  author 0xPratyaDev7x). **This commit was made by the owner between Steps 09
  and 10, not by the agent.** It contains the Step 01–09 work (80 files) and
  keeps version `1.1.2`. Worktree clean before Step 10. Step 09 confirmed
  `PASS`.
- **Authorization:** the owner's STEP 10 instruction (2026-10-22): "Make
  existing repository knowledge more useful for future coding tasks without
  adding a mandatory Knowledge Graph database or MCP service." Recorded as
  **D-067** (ACCEPTED) with an ADR-0012 amendment.

### Inspected

`chayen-init/SKILL.md`, `references/detection-and-refresh.md`,
`references/profile-template.md` (including the unit file template),
`references/instruction-block.md`, `chayen-repository/SKILL.md`,
`references/dependency-and-impact.md`, ADR-0012, and the `.chayen/` reading
bullets in the implementation, backend, frontend, data and testing skills.

**Findings that shaped the design:**
- `chayen-init` already has preview-before-write, generated versus
  team-owned files, `git hash-object` fingerprints, and a refresh limited to
  changed evidence.
- Unit files existed but held only Stack, Commands, Where things go,
  Conventions and Unknowns.
- The impact recipe already labelled evidence and treated external
  consumers as `unknown`, but never consulted `.chayen/`.
- The coding skills read `profile.md` and `rules.md` but not unit files,
  although the pointer block tells agents to read the unit file.

### Design (extends ADR-0012; no new system)

| Owner requirement | Where |
|---|---|
| Module boundaries; versions; commands; entry points; dependency declarations | Unit template sections `Stack`, `Boundary and dependencies`, `Entry points`, `Commands` |
| API ownership and consumers where evidenced | `API ownership and consumers`: consumers only with `path:line`, otherwise `unknown` (never "none") |
| Data model and migration locations | `Data`, plus the migrations folder fingerprinted by tree id |
| Test projects and commands | `Tests` (project, coverage, command, status) |
| Generated-code boundaries | `Generated code` (generator, source, regenerate command; also under "Do not edit") |
| Dynamic or reflection dependencies | `Dynamic references`; "none found" must name the terms searched |
| Evidence and freshness fingerprints | Header `evidence` with file blobs plus folder `tree` ids (`git rev-parse HEAD:<folder>`) |
| Prefer unit files | Map lives in `units/<unit>.md`; only a single-unit repository puts it in `profile.md` |
| Agent workflow steps 1–7 | Impact recipe step 1 (map first, only the owning unit file, read-only staleness check, leads for targeted search, confirm in source, a missing entry never proves absence) and its "Project map" output line; implementation Orient step; the five consuming skills read the owning unit file |
| Source authoritative | Every reader states that the source wins; GI-06 now enforces this for any file reading `profile.md` or `units/` |
| Refresh: git fingerprints, no full rescans, no silent overwrite, preview and approval | Refresh step 2 compares tree ids too; step 8 adds missing map sections through the preview; the "Staleness check for readers" section is read-only and offers refresh only on request; `rules.md`, conventions and instruction-file protections unchanged |
| No mandatory runtime or dependency | Markdown guidance plus read-only git commands that the existing lifecycle already uses |

Schema stays `project-knowledge/1` (the sections are additive), so existing
`.chayen/` directories remain valid and are not stopped by the "unknown
schema" rule. The unit-file budget rose from 120 to 150 lines, equal to
`profile.md`, to fit the map.

### Files changed (Step 10 only, against `a0f9bfe`)

| Path | Change |
|---|---|
| `plugins/.../chayen-init/references/profile-template.md` | Map-section intro; unit template with seven map sections and folder `tree` evidence; completion rules: evidence for every dependency, consumer and dynamic reference, consumers `unknown` not "none", the 150-line budget (+53/−3) |
| `plugins/.../chayen-init/references/detection-and-refresh.md` | "Impact map (per unit)" checklist; folder tree fingerprints; refresh compares trees and adds missing sections through the preview; "Staleness check for readers" (+67/−6) |
| `plugins/.../chayen-init/SKILL.md` | Detect step names the map; budgets; Outputs; Verification (tree ids, cited map rows); failure row for unevidenced consumers (+15/−6). Description, When to use and When not to use unchanged |
| `plugins/.../chayen-repository/references/dependency-and-impact.md` | New step 1 "Start from the project map, when present", steps renumbered 2–9; Inputs; "Project map" output line; Verification (+27/−8) |
| `plugins/.../chayen-implementation/SKILL.md`, `chayen-backend`, `chayen-frontend`, `chayen-data`, `chayen-testing` | Discover bullets also read the owning unit file; the implementation Orient step uses the map's dependencies, consumers, dynamic references and tests for targeted search after confirming them |
| `tools/validate/check-guidance.mjs`, `guidance-invariants.json`, `docs/chayen/GUIDANCE_INVARIANTS.md` | GI-06 now covers any file outside chayen-init that reads `profile.md` or `units/` |
| `tests/skills/project-map.test.mjs` (new), `tests/skills/guidance-consistency.test.mjs` (+1 test), `tests/skills/recipe-cases.json` (+9), `tools/validate/validate-all.mjs` (G-19) | Tests below |
| `docs/chayen/DECISIONS.md` (D-067), `ADRS/ADR-0012-*.md` (decision 2 amendment), `docs/SKILLS_CATALOG.md`, `docs/chayen/KNOWN_LIMITATIONS.md` (KL-15: 469), `tests/skills/README.md` | Records |

### Tests

**Executable: `tests/skills/project-map.test.mjs` (G-19), 11/11, 0
skipped.** It builds a disposable git monorepo with:
- a .NET solution with Api, Core, Data and Tests projects and
  `ProjectReference` edges;
- SQL Server through EF Core, with a migrations folder and a stored
  procedure;
- reflection (`Activator.CreateInstance`, `Type.GetType`);
- an Angular admin app whose `OrdersService` calls `/api/orders`, with
  `loadChildren` lazy routes;
- a Python reporting service.

A `.chayen/` map in the shipped unit-template shape carries real blobs and
tree ids.

| Owner case | Test | Observed |
|---|---|---|
| Template completeness | unit template has all ten sections and blob and tree evidence | pass |
| Fresh map | reader check on three units | all `fresh` |
| Stale map (dependency) | a committed `Shop.Api.csproj` change | only `api` stale, and only that file; `admin` and `reporting` fresh, so refresh stays targeted |
| Stale map (data) | a committed new migration | `api` stale via the migrations tree id |
| Stale map (uncommitted) | `orders.service.ts` edited, not committed | `admin` stale via `git status` |
| Unconfirmed map | unknown or `none` `generated_commit` (shallow-clone case) | `unconfirmed` |
| Missing map | `.chayen/` removed | `absent`; the recipe states the no-map fallback and that a missing entry never proves absence |
| No invented dependency | every cited row's `path:line` holds the claimed item; an invented `Shop.Payments` reference is injected | 0 on the real map; the injected row detected |
| Reflection and API consumer | `Activator.CreateInstance` cited at `Program.cs:3`; `/api/orders` consumer cited at `orders.service.ts:3`; external callers `unknown`; the Python service, which never calls the API, is not listed | pass |
| Read-only reader check | `git status` identical before and after | pass |

This proves the template contract and the git mechanics the guidance
prescribes. It does not prove that an agent writes or reads the map
correctly.

**Transcript-graded recipe cases** (`tests/skills/recipe-cases.json`,
460 → 469; specifications, **behaviour NOT_RUN**):
`rc-01-004-pos-dotnet-solution-map`, `-angular-consumer`,
`-sqlserver-references`, `-monorepo-consumers`, `-stale-map`, `-missing-map`,
`-reflection`, `-api-consumers`, and `rc-01-004-neg-concept`.

**Guidance invariant:** a new G-18T case removes "the source wins" from the
impact recipe's map step, and GI-06 detects it (22/22).

### Commands

| Command | Exit | Result |
|---|---|---|
| `node --test tests/skills/project-map.test.mjs` | 0 | 11/11, 0 skipped. During development one failure was a test-helper bug: trimming dropped the leading space of `git status --porcelain`. Fixed in the helper, not in the guidance |
| `node --test tests/skills/guidance-consistency.test.mjs` | 0 | 22/22 |
| `node tools/validate/check-guidance.mjs` | 0 | 0 errors, 0 review items |
| `node tools/validate/validate-package.mjs` | 0 | 0 errors, 0 warnings; V-22 469 cases |
| `node tools/validate/validate-all.mjs` | 0 | **28/28** gate groups PASS (adds G-19); G-11 eval sync PASS; G-13 189/189; G-14 docs PASS |
| `node tools/evals/run-evaluation-suite.mjs` | 0 | Static and traceability PASS; T-206 206/206 |
| `metadataFingerprint`; trigger and exclusion sections of the 7 touched skills against HEAD; `git diff -- tests/skills/trigger-cases.json` | 0 | `411b6adbbea7e121` unchanged; all 7 sections byte-identical; trigger cases unchanged |

### Acceptance

| Criterion | Evidence | Result |
|---|---|---|
| No new mandatory runtime or external dependency | Only Markdown guidance and test code; readers use read-only git commands the lifecycle already used; V-09 and G-SEC PASS | PASS |
| Existing `chayen-init` lifecycle remains valid | Modes, preview and approval, ownership, the schema identifier and the refresh algorithm unchanged; map sections are additive and arrive through the previewed refresh | PASS |
| Targeted map reading preferred over blind scanning | Recipe step 1 (only the owning unit file and its listed consumers); stale-map test shows only the affected unit goes stale | PASS (static and mechanics); behaviour NOT_RUN |
| No unsupported dependency invented | Template and checklist require `path:line` or `unknown`; consumers never "none"; the invented-row test is detected | PASS (mechanics); behaviour NOT_RUN |
| Stale knowledge is detectable | Executable fresh, stale, unconfirmed and absent cases | PASS |
| Routing and no-match behaviour preserved | Descriptions, When to use and When not to use unchanged; metadata fingerprint unchanged; trigger cases unchanged; G-11 PASS | PASS |

### Risks and findings

- **Shipped guidance changed again without a version bump**: 9 files in
  Step 10, on top of `a0f9bfe`, which already contains the Step 07–09 shipped
  changes at version `1.1.2`. An owner version decision is needed before a
  release; installs pinned to `1.1.2` cannot tell the builds apart by
  version.
- **Behaviour NOT_RUN**: whether agents write accurate maps, read only the
  owning unit, and confirm facts needs the runner and grader (Steps 15–17).
- Unit files are larger (budget 150). They load only for their unit, so the
  per-task cost rises only when that unit is touched.
- The executable test's helpers (`staleness`, `inventedRows`) are test code,
  not a shipped or user-facing tool. Users rely on the guidance and git.

### Next action

Stopped after Step 10, as instructed. Step 11 (Failure Reproduction) is
**ready**: prerequisites 08 and 09 are PASS. Not started.

## Step 11 — Failure Reproduction

- **Date:** 2026-10-22
- **Status:** PASS (developer-side workflow; model behaviour NOT_RUN)
- **Starting state:** branch `develop`, **HEAD `b52e28e`** ("Enhance project
  knowledge mapping and impact analysis", 2026-10-22 14:18 +0700, author
  0xPratyaDev7x, 23 files). **The owner made this commit between Steps 10
  and 11, not the agent.** It contains the Step 10 work and keeps version
  `1.1.2`. The worktree was clean before Step 11, and Step 10 was confirmed
  `PASS`.
- **Authorization:** the owner's STEP 11 instruction (2026-10-22): "Extend
  the existing Chayen contribution workflow so observed Agent failures can
  become reproducible regression cases." Recorded as **D-068** (ACCEPTED).
- **Scope change against the Step 01 plan:** the plan's Step 11 targeted
  agent-facing reproduce-before-fix guidance (`bug-fix.md`,
  `workflow-bug-repair.md`, `failing-and-flaky-tests.md`). The owner's
  instruction asks for a developer-only failure workflow instead. That
  guidance work was **not done** in this step. It remains an open item for
  the owner; it was not silently dropped.

### Inspected

- `docs/CONTRIBUTING.md`: the D-065 "When an agent gets a task wrong"
  process. Its steps are keep the redacted prompt, reproduce as a recipe or
  trigger case, make the smallest guidance change, and validate (the case
  stays NOT_RUN).
- `tests/skills/recipe-cases.json` (469) and `trigger-cases.json` (186).
- `tests/evaluation/phase5/`:
  - `phase5-lib.mjs`: `parseTranscript` for Claude, Codex and Copilot,
    `scrub`, `classifyRouting`;
  - `run-phase5.mjs`: `--plan` and `--score` are offline; live runs are
    gated by `--allow-provider-calls`, `--authorization` and `--max-calls`;
  - the README safety rules.
- `tests/evaluation/fixture/`.
- `tools/evals/`.
- `tools/validate/check-security.mjs` (V-25.2 secret patterns).
- The "Secrets and data handling" and "Maintainer execution" sections of
  `SECURITY_MODEL.md`.

**Findings that shaped the design:**
- The existing process already turns a failure into a recipe or trigger
  case. It lacks a fixture, failing evidence, a detector and an
  evidence-bound verification status. The new record adds exactly these and
  references the existing case, so the process is extended, not duplicated.
- Phase 5 already parses all three providers' transcripts and scrubs paths.
  Replay reuses `parseTranscript` and `scrub` rather than adding a parser.
- The evaluation fixture already contains a realistic schema trap: `AppDb.cs`
  has `Customer { Id, Name }`, while the Angular form has an email field.
  It also has a reporting service with no tests. It has no consumer of
  `api/orders`. Changing it would disturb the Phase 5 probes, so FC-0002
  gets its own three-file synthetic fixture.
- The V-25.2 secret patterns were private to `check-security.mjs`. They now
  live in `tools/validate/secret-patterns.mjs`, used by both validators.
  V-25 output is unchanged apart from the developer-asset count.

### Design

| Owner requirement | Where |
|---|---|
| Failure-case specification | `docs/chayen/FAILURE_REPRODUCTION.md`; closed format `chayen-failure-case/1` |
| Fields: ID; category; redacted request; Skill and Recipe; provider and model when observed; revision or fingerprint; expected; observed; reproduction; failing evidence; root-cause status; corrective action; regression test; verification status | `id`, `category`, `request`, `skill`, `observedWith`, `source`, `expected`, `observed`, `reproduction`, `evidence.transcripts`, `rootCause`, `correctiveAction`, `regressionTests`, `verification`. All are required; unknown fields are rejected |
| The ten categories | `CATEGORIES` in `tools/evals/failure-cases.mjs`; any other value is rejected |
| Validate and replay with existing evaluation tools | Phase 5 `parseTranscript` plus declarative detector signals; regression references must name existing `tests/skills` cases; G-20 and G-20T in `validate-all.mjs` |
| Outcomes: Reproduced, Not reproduced, Fixed and verified, Not run, Inconclusive | `REPRODUCED`, `NOT_REPRODUCED`, `FIXED_AND_VERIFIED`, `NOT_RUN`, `INCONCLUSIVE`. The status is derived from recorded authorized live replays only; a claimed status that differs is rejected |
| Do not assume fixed because guidance text changed | Only `live-replay` runs count. Each needs authorization, a date, a later revision or package, a redacted transcript and a matching SHA-256. FIXED also needs `correctiveAction.status: applied` |
| No automatic collection; no telemetry | Records are written by hand. The tool imports no process or network module (a static test checks this) |
| No secrets, tokens, personal data or production source | Rejects secret patterns, credential URLs, local paths and non-example emails. Fixtures must be under `tests/`; transcripts are capped at 64 KiB |
| Opt-in before external models | The tool never calls a model. Observed records need `consent.optIn`, and live runs need an authorization reference (OD-10, Phase 5 runbook) |
| Redact paths and sensitive output | `--redact`: new file only; fixture root becomes `<FIXTURE>`; paths, secrets and emails masked; tool output bodies removed. `--score` refuses unredacted input |
| No scripts from traces | Steps are prose and detectors are string checks. The `cases/`, `transcripts/` and `fixtures/` folders accept only `.json .jsonl .md .cs .ts .html .sql` |
| Developer-only, outside the plugin | `tests/failures/` and `tools/evals/`; the plugin diff is empty, and a test asserts that no failure artifact is in the package |

### Files changed (Step 11 only, against `b52e28e`)

| Path | Change |
|---|---|
| `tools/evals/failure-cases.mjs` (new) | Validator, offline replay, `--score`, `--redact` |
| `tools/validate/secret-patterns.mjs` (new), `tools/validate/check-security.mjs` | Shared V-25.2 patterns (the patterns themselves are unchanged) |
| `tests/failures/cases/FC-0001..0003-*.json` (new) | Three synthetic records |
| `tests/failures/transcripts/FC-000{1,2,3}.{failing,control}.jsonl` (new) | Six hand-written synthetic transcripts in Claude stream-json shape, each with a synthetic marker |
| `tests/failures/fixtures/orders-consumers/` (new) | Four files: the FC-0002 API controller, an Angular consumer, a URL-string consumer, and a README |
| `tests/failures/failure-cases.test.mjs`, `tests/failures/README.md` (new) | 17 regressions, and an index of the folder |
| `tools/validate/validate-all.mjs` | G-20, G-20T |
| `docs/chayen/FAILURE_REPRODUCTION.md` (new), `docs/CONTRIBUTING.md`, `docs/chayen/DECISIONS.md` (D-068), `docs/chayen/SECURITY_MODEL.md`, `docs/chayen/KNOWN_LIMITATIONS.md` (KL-15) | Specification and records |

No shipped Skill, catalog, recipe or trigger case, or Phase 5 file changed.

### Synthetic cases

| Case | Owner example | Fixture facts checked by the validator | Failing transcript | Control transcript | Regression reference | Model behaviour |
|---|---|---|---|---|---|---|
| FC-0001 `invented-schema-or-command` | Agent guesses a nonexistent database column | `AppDb.cs` has `Customer { Id, Name }` and lacks `Email`; the Angular form has `formControlName="email"` | Infers the column from the form; `SELECT c.Email ...` → REPRODUCED | Reads `AppDb.cs`, reports no email column, asks → NOT_REPRODUCED | `rc-09-007-pos-real-schema` | NOT_RUN |
| FC-0002 `missed-affected-file` | Agent misses an affected API consumer | The route is `api/orders`; the admin service and `apps/shop/lib/order-status.ts` both call it; the shop helper reads `body.status` and shares no `Order` type | Searches by type; lists only the admin service → REPRODUCED | Searches the route string; lists both consumers → NOT_REPRODUCED | `rc-01-004-pos-api-consumers` | NOT_RUN |
| FC-0003 `false-done-claim` | Agent marks an untested AC as DONE | `services/reporting/tests` holds only an empty `__init__.py`; no `test_invoice.py` exists | Both ACs accept, "all tests pass", Outcome: DONE → REPRODUCED | Both verify_more, NOT_RUN, not done → NOT_REPRODUCED | `rc-04-007-pos-ac-verdicts` | NOT_RUN |

The transcripts are hand-written; **no provider or model was called**. Offline
replay therefore shows that each record is valid and each detector separates
the failure from correct behaviour. It does not show that any model produces
or avoids the failure. That is recorded as `NOT_RUN` for all three.

### Tests

**`tests/failures/failure-cases.test.mjs` (G-20T), 17/17, 0 skipped.** It
works in memory or on OS-temp copies:

- shipped cases valid, and the six replays as expected;
- every field required and unknown fields rejected;
- all ten categories accepted, and any other rejected;
- provider and model only when observed, and consent required;
- the skill, recipe, regression reference, corrective target and source
  must exist;
- fixture facts checked, including traversal;
- a non-discriminating detector and malformed signals rejected;
- routing, denial and repetition signals work;
- cut-off, turn-limit and empty runs are INCONCLUSIVE;
- **a guidance edit leaves the status NOT_RUN, and a FIXED claim or a
  `guidance-changed` run is rejected**;
- live replays derive REPRODUCED, NOT_REPRODUCED and FIXED_AND_VERIFIED from
  the transcript. A same-revision run, a proposed action, a missing
  authorization, a hash mismatch and a synthetic transcript used as a live
  run all fail to verify;
- privacy patterns;
- redaction, with the redacted transcript still scorable;
- transcript marker, JSON lines, size cap and privacy;
- `.sh`, `.ps1`, `.mjs`, `.py` and `.bat` artifacts rejected;
- static scan: no process, network or dynamic-code use, a single `wx` write,
  and no failure artifact in the plugin;
- CLI: `--score` gives REPRODUCED, unredacted input is REFUSED, and
  `--redact` never overwrites.

**Control runs** (scratch copies of the tool with one rule weakened; log in
the session scratchpad, `step11-controls.log`):

| Weakened rule | Caught by |
|---|---|
| Trust the claimed verification status | The guidance-change test and the live-replay test |
| Drop the local-path check | The privacy, transcript and CLI tests |
| Score cut-off runs | The INCONCLUSIVE test. It was **not caught on the first attempt**: an empty answer masked it. An action-only detector case was added, after which it is caught |
| Count non-live runs | The guidance-change test |

### Commands

| Command | Exit | Result |
|---|---|---|
| `node tools/evals/failure-cases.mjs` | 0 | 3/3 records valid; 6/6 recorded transcripts replay as expected; model behaviour NOT_RUN 3 |
| `node --test tests/failures/failure-cases.test.mjs` | 0 | 17/17 |
| `node tools/validate/check-security.mjs` | 0 | PASS, 0 errors. Developer assets 100 → 103 (new `.mjs` and `.cs` files); package 263 files, 16 skills, 242 references unchanged |
| `node tools/validate/validate-all.mjs` | 0 | **30/30** gate groups PASS (adds G-20 and G-20T); G-13 189/189; G-14 docs PASS |
| `node tools/evals/run-evaluation-suite.mjs` | 0 | Static and traceability levels PASS |
| `node tools/catalog/discovery-metrics.mjs`; `git diff -- plugins/` | 0 | L0 6,563 characters (~1,641 tokens) unchanged; plugin diff 0 lines, so the metadata fingerprint `411b6adbbea7e121` is unchanged; recipe and trigger case files unchanged |

During development:
- the first test run had 6 failures: the artifact allowlist also covered
  the test file, an error-result subtype was not treated as INCONCLUSIVE,
  two expectations were wrong, and a static ban pattern matched
  `RegExp.exec`;
- all six were fixed in the tool scope or the test, not by weakening a rule;
- two shell heredocs failed on quoting and wrote nothing; the files were
  written with the editor instead.

### Acceptance

| Criterion | Evidence | Result |
|---|---|---|
| Developer-only failure-case specification and validation tooling | `FAILURE_REPRODUCTION.md`, `failure-cases.mjs`, G-20 and G-20T | PASS |
| Existing process extended, not duplicated | CONTRIBUTING steps 1–4 unchanged, plus a failure-record paragraph; records reference existing recipe cases; Phase 5 parser reused | PASS |
| At least three synthetic, reproducible examples (column, consumer, untested AC as DONE) | FC-0001..0003 valid; facts hold in the fixtures | PASS |
| Replay where supported; outcomes distinguished | Offline replay 6/6 as expected; all five outcomes exercised in tests | PASS (offline) |
| Unexecuted model behaviour recorded as NOT_RUN | `verification.status: NOT_RUN` for all three, derived and enforced | PASS |
| Not assumed fixed after a guidance change | Guidance-edit test; control run | PASS |
| Security and privacy constraints | Static no-process, no-network test; privacy rules; script-type rejection; opt-in consent and authorization fields; plugin diff empty | PASS (static; the pattern checks are heuristic) |
| Documentation and Step Log updated | This entry; MASTER_PLAN row | PASS |

### Risks and findings

- **No live replay exists.** The records demonstrate the format and the
  detectors, not agent behaviour. The first live replay needs OD-10
  authorization and must follow the Phase 5 isolation rules.
- **Detectors are literal string checks.** A model can fail in a form the
  detector does not match (a false NOT_REPRODUCED) or mention the failing
  token while refusing it. Detectors cover the failure as recorded. A human
  still reads the transcript before a root cause becomes `confirmed`.
- **Privacy checks are heuristic.** Names, customer data in prose, or
  proprietary code shapes are not detected. Redaction is best effort, and
  the record must be read in full before it is committed.
- **Live replay needs a manual run.** No runner sends a failure case to a
  provider: `run-phase5.mjs` runs only its own suites. A maintainer runs the
  provider CLI on a disposable fixture copy under an authorization, then uses
  `--redact` and `--score`. Wiring failure cases into the Phase 5 runner is
  left for Steps 15–17.
- The planned agent-facing reproduce-before-fix guidance (Step 01 plan) is
  still not done. It needs an owner decision on whether it belongs to a
  later step.
- There are no shipped changes in this step. The open version decision from
  Steps 07–10 still stands.

### Next action

Stopped after Step 11, as instructed. Step 12 is not started.

## Step 12 — Mentor Knowledge Distillation

- **Date:** 2026-10-22
- **Status:** PASS (developer-side workflow; Mentor quality and live
  improvement NOT_RUN)
- **Starting state:** branch `develop`, **HEAD `3f8ee6b`** ("Add synthetic
  fixtures and validation tools for failure cases FC-0001, FC-0002, and
  FC-0003", 2026-10-22 14:42 +0700, author 0xPratyaDev7x, 26 files). **The
  owner made this commit between Steps 11 and 12, not the agent.** It
  contains the Step 11 work. The worktree was clean before Step 12, and
  Step 11 was confirmed `PASS`.
- **Authorization and scope:** the owner's STEP 12 instruction
  (2026-10-22), recorded as **D-069** (ACCEPTED), resolves the plan's blocker
  ("Owner scope confirmation"). Scope: "prompt/process-level knowledge
  distillation, not model fine-tuning"; a governed six-stage maintainer
  workflow; "Demonstrate the workflow using Step 11 synthetic failures". The
  Step 01 plan asked for "at least one real recorded failure". That
  criterion is superseded by the instruction to use the Step 11 synthetic
  failures, and every artifact says they are synthetic, so no unverified
  failure is presented as observed.

### Inspected

- MASTER_PLAN, EXECUTION_RULES, and the Step 11 deliverables (failure
  records, `failure-cases.mjs`, transcripts).
- `docs/CONTRIBUTING.md`.
- The guidance each failure points to:
  - `chayen-repository/references/dependency-and-impact.md:64-70` (step 6
    names "the frontend calls that hit a changed endpoint" without saying
    how to find them);
  - `chayen-data/SKILL.md:45-47` ("never guess a name; when the schema
    cannot be read, ask");
  - `chayen-implementation/SKILL.md:153` and
    `references/change-summary.md:70-73` (no test means verify_more; DONE
    only when every criterion is accept).
- `tools/validate/check-guidance.mjs` and `guidance-invariants.json`.
- Phase 5 `metadataFingerprint`.

**Findings that shaped the design:**
- Two of the three synthetic failures contradict guidance that is
  **already explicit and already loaded** in the failing transcript. A
  workflow that always produces a Skill change would add redundant text.
  So every root cause allows a non-Skill action, and a behavioural change to
  guidance that is `fully` covered is returned unless a live replay shows
  the guidance is ignored.
- Offline replay replays fixed recorded transcripts, so it **cannot** show
  that a guidance change helps. Improvement can only be shown by a live
  baseline-versus-candidate comparison. Offline validation instead shows
  that the change is safe and consistent.

### Design

| Owner requirement | Where |
|---|---|
| 1 Collect: one verified failure, redacted evidence, repeatable reproduction | The proposal names one Step 11 case. The case must be valid and its failing and control transcripts must replay as expected (`VERIFIED_OFFLINE`); its model behaviour is carried forward |
| 2 Diagnose: eight root causes; not every failure becomes a Skill change | `ROOT_CAUSES`. Evidence references resolve; `existingGuidance` records coverage as fully, partly or no; rejected alternatives are required; `confirmed` needs a live REPRODUCED |
| 3 Distill: six actions; prefer an existing Recipe over a new Entry Skill | `ALLOWED` maps each root cause to its actions; every cause allows a non-Skill action. Targets must exist, so no new file or Entry Skill. Behavioural changes over 20 lines need a justification |
| 4 Review: evidence, root cause, before and after, diff, risks and routing collisions, tests; human review | Proposal `review`. Routing impact is computed from the diff. Trigger cases are required for a routing change. Tests must include the failure case and its regression references. The reviewer must not be the Mentor |
| 5 Validate: offline tests and replay; live comparison when approved | Diff applied to a disposable full copy; 7 fixed validators; metadata fingerprint compared; live arms scored with the failure detector, ≥ 3 runs per arm, one provider and model |
| 6 Promote: only demonstrated improvements; keep the evidence and the previous version | Derived decision. A promotion record needs the change in the tree, the previous version recoverable by reverse diff with a matching hash, and the failure case still valid |
| No Mentor in the plugin; no always-on service; no untrusted commands | Mentor = opt-in session with `MENTOR_BRIEF.md`. Single `spawnSync` for fixed validators with `shell: false`, after a byte-identity check. Diffs are limited to existing `.md` and `.json` files |

### Files changed (Step 12 only, against `3f8ee6b`)

| Path | Change |
|---|---|
| `tools/evals/distill.mjs` (new) | Six-stage checker, diff parser and applier, routing impact, offline validation on a copy, decision derivation |
| `tools/evals/failure-cases.mjs` | `readTranscript` exported for reuse (no behaviour change) |
| `tests/distillation/proposals/DP-0001..0004-*.json` and `.diff` (new) | Four proposals |
| `tests/distillation/templates/proposal.template.json`, `tests/distillation/README.md`, `tests/distillation/distillation.test.mjs` (new) | Template, folder index, 13 regressions |
| `tools/validate/validate-all.mjs` | G-21, G-21T |
| `docs/chayen/KNOWLEDGE_DISTILLATION.md`, `docs/chayen/MENTOR_BRIEF.md` (new); `docs/CONTRIBUTING.md`; `docs/chayen/DECISIONS.md` (D-069); `docs/chayen/SECURITY_MODEL.md` | Process, Mentor brief, records |

No shipped Skill, catalog, recipe or trigger case changed. The plugin diff
is 0 lines. No proposal is applied.

### Workflow demonstration on the Step 11 synthetic failures

The Mentor was this session's agent (Claude Opus 5.5), working from
`MENTOR_BRIEF.md`. It is not independent of the maintainer session, and its
diagnoses are `suspected`.

| Proposal | Collect | Diagnose | Distill | Review | Validate | Decision |
|---|---|---|---|---|---|---|
| **DP-0001**, FC-0002 | VERIFIED_OFFLINE; model NOT_RUN | Incomplete Recipe: step 6 says what to find, not how; rejected skill-routing, missing knowledge, model limitation | **Minimal Recipe improvement:** one bullet in `dependency-and-impact.md` becomes "found by searching every app for the route path as text … an untyped `fetch` … shares no symbol with the server" (5 changed lines) | Routing impact declared none, computed none; risks: over-reporting, token cost | 7/7 validators PASS on the candidate copy; fingerprint `411b6adbbea7e121` unchanged | **PENDING_REVIEW** |
| **DP-0002**, FC-0001 | VERIFIED_OFFLINE; NOT_RUN | Tool or model limitation (suspected): `chayen-data/SKILL.md:45-47` covers it fully | **No guidance change:** add recipe case `rc-09-007-pos-ui-field-not-schema` with a UI-field decoy | none/none | 7/7 PASS | **PENDING_REVIEW** (READY_TO_PROMOTE once approved) |
| **DP-0003**, FC-0003 | VERIFIED_OFFLINE; NOT_RUN | Tool or model limitation (suspected): the loaded `SKILL.md:153` and `change-summary.md:70-73` forbid the claim | **No Skill change:** extend KL-22, held until a live replay reproduces FC-0003 | none/none | 7/7 PASS | **PENDING_REVIEW** (AWAITING_EVIDENCE once approved, as tested) |
| **DP-0004**, FC-0003, demonstration | VERIFIED_OFFLINE | "Conflicting instructions" (weak, deliberately) | Appends "Never reports DONE without passing tests." to the `chayen-implementation` description | Declared none; **computed metadata** | Not run, because returned earlier | **RETURNED_FOR_REVISION**: undeclared routing impact, no trigger cases, and guidance already covers the failure fully without live evidence |

While authoring, DP-0004's record first claimed `PENDING_REVIEW`. The tool
refused it ("decision PENDING_REVIEW is not supported by the evidence
(derived RETURNED_FOR_REVISION)"), so a Mentor cannot assert its own
decision.

### Rejected and inconclusive improvements (G-21T)

There are no live runs. The comparison paths were therefore exercised with
**test-only** copies of the Step 11 synthetic transcripts. The synthetic
marker is removed and the copies are written only inside temporary
repository copies; nothing committed claims a live run. DP-0001 approved by
a reviewer other than the Mentor:

| Baseline arm | Candidate arm | Derived decision |
|---|---|---|
| 3 × failing | 3 × control | READY_TO_PROMOTE |
| 3 × failing | 3 × failing | **REJECTED** (no improvement) |
| 3 × failing | 2 × control + 1 × failing | **RETURNED_FOR_REVISION** (partial) |
| 3 × control | 3 × control | **RETURNED_FOR_REVISION** (baseline never reproduced) |
| 3 × failing | 2 × control + 1 × cut-off | **RETURNED_FOR_REVISION** (inconclusive) |
| 1 × failing | 1 × control | AWAITING_EVIDENCE (fewer than 3 runs) |
| baseline on another revision, mixed models, or a synthetic transcript as a live run | — | record refused |

The suite has 13 tests and all pass:

- the shipped decisions, with the plugin unchanged;
- collect;
- diagnose;
- distill (the cause-to-action matrix and target rules; no new file);
- diff round trips for all four proposals;
- computed routing impact (metadata, trigger sections, none);
- review rules (an independent reviewer);
- human-review decisions (approval alone gives AWAITING_EVIDENCE);
- a stale base, a non-applying diff and an oversized diff, each returned;
- a full offline validation of a diff that weakens a GI-03 rule: returned,
  with the change applied only to the copy;
- the comparison table above;
- promotion, with the previous version recovered and promotion without
  evidence refused;
- a static check that only fixed validators start and there is no network
  use.

**Control runs** (scratch copies of `distill.mjs`; log in the session
scratchpad, `step12-controls.log`): five weakenings, **all caught**. They
were: approval alone promotes guidance; trusting the declared routing
impact; ignoring offline validator failures; any action for any root cause;
an unchanged candidate counted as an improvement.

### Commands

| Command | Exit | Result |
|---|---|---|
| `node tools/evals/distill.mjs` | 0 | 4/4 valid; PENDING_REVIEW 3, RETURNED_FOR_REVISION 1; about 11 s (3 offline copies × 7 validators) |
| `node --test tests/distillation/distillation.test.mjs` | 0 | 13/13 |
| `node tools/validate/validate-all.mjs` | 0 | **32/32** gate groups PASS (adds G-21 and G-21T) |
| `node tools/evals/run-evaluation-suite.mjs` | 0 | Static and traceability levels PASS |
| `git diff -- plugins/`; `git diff HEAD -- tests/skills catalog` | 0 | 0 lines; unchanged. Metadata fingerprint unchanged |

During development, the first test run had 2 failures:

- **A tool bug:** a record with errors still returned a decision. Fixed;
  errors now null the decision.
- **A real validator coverage gap** (see Risks): the test's weakening of the
  no-test rule passed every offline validator. The test now uses the GI-03
  mutation that G-18T proves is caught.

### Tested offline, and what needs a real model run

| Tested offline (executed) | Needs a real model run (NOT_RUN) |
|---|---|
| Collection, record validity, detector discrimination | Whether any of FC-0001..0003 happens with a real agent (live replay) |
| Diagnosis format, the cause-to-action rules, target, size and new-file rules | **Quality of the Mentor's diagnosis.** Only the format is checked; a human review is required |
| Diff application, reverse recovery, stale detection, computed routing impact | Whether DP-0001 reduces the failure: live baseline vs candidate, ≥ 3 runs per arm |
| Package, guidance-invariant, security, catalog, eval-sync, documentation and failure-case gates on the candidate | Whether a change regresses other routing or capability behaviour (Steps 14–18) |
| Every decision path, including rejected and inconclusive comparisons | Running a Mentor model as an independent session |

### Acceptance

| Criterion | Evidence | Result |
|---|---|---|
| Reusable maintainer workflow with six stages | `KNOWLEDGE_DISTILLATION.md`, `MENTOR_BRIEF.md`, the template, `distill.mjs`, G-21 and G-21T | PASS |
| Reuses existing components | Step 11 records and replay, recipe cases, the existing validators, Phase 5 fingerprint, CONTRIBUTING extended | PASS |
| Not every failure forced into a Skill change | DP-0002 and DP-0003 make no Skill change; the cause-to-action matrix; the fully-covered rule | PASS |
| Recipe preferred over a new Entry Skill | DP-0001 changes an existing Recipe; new files are impossible | PASS |
| Human review required before approval | Pending, approved, changes-requested and rejected paths; the Mentor cannot self-review | PASS |
| Only demonstrated improvements promoted; evidence and previous version preserved | Comparison and promotion tests; control runs | PASS (offline); no live comparison exists |
| No Mentor in the plugin, no service, no untrusted commands | Plugin diff 0; static test; fixed validators after a byte-identity check | PASS |
| Demonstrated on the Step 11 synthetic failures; at least one minimal Recipe proposal; failed or inconclusive returned or rejected | DP-0001..0004; the comparison table | PASS |
| Report offline versus real-model coverage | Table above and in `KNOWLEDGE_DISTILLATION.md` | PASS |

### Risks and findings

- **GI-03 coverage gap (found in this step, not fixed).** A rewrite of
  `change-summary.md` saying "A criterion with no test may be accepted when
  the code looks right" passes `check-guidance.mjs`. GI-03 recognises
  missing evidence only by the words missing, partial, stale or unexecuted.
  So a distillation proposal that weakens the no-test rule in other words
  would pass offline validation, and only human review would catch it.
  Recommended for Step 13 (Independent Evidence Audit) or an owner-approved
  change to GI-03.
- **The Mentor was this session's agent**, the same model writing the
  tooling. The demonstration shows the workflow, not independent Mentor
  judgement.
- **No proposal is reviewed or promoted.** DP-0001 is a candidate change to
  shipped guidance and needs a human review, then a live comparison. If
  DP-0002 is approved, it also needs the case count updated where documents
  state it (KL-15, `tests/skills/README.md`), as its risks say.
- **Live comparison has no runner.** A maintainer would run the arms
  manually under OD-10, as in Step 11. Wiring this into Steps 15–17 is still
  open.
- G-21 adds about 11 s to `validate-all.mjs` (three full copies). The cost
  grows with the number of pending proposals; promoted, returned and
  rejected proposals do not run offline validation.
- No shipped changes in this step. The open version decision from Steps
  07–10 still stands.

### Next action

Stopped after Step 12, as instructed. Step 13 (Independent Evidence Audit)
is not started. Its prerequisites, 08 and 09, are PASS.

## Step 13 — Independent Evidence Audit

- **Date:** 2026-10-22
- **Status:** PASS (guidance, invariant and reference grader; agent behaviour
  NOT_RUN)
- **Starting state:** branch `develop`, **HEAD `9b994df`** ("Add
  distillation proposals and update skill descriptions", 2026-10-22 15:06
  +0700, author 0xPratyaDev7x, 21 files). **The owner made this commit
  between Steps 12 and 13, not the agent.** The worktree was clean.
- **Note on that commit:** its message says it "Modified SKILL.md to include
  a rule stating that DONE should not be reported without passing tests"
  and "Updated KNOWN_LIMITATIONS.md". The commit changes **0 plugin lines**
  and does not touch `KNOWN_LIMITATIONS.md`. It holds exactly the Step 12
  files, and the message describes the proposals DP-0003 and DP-0004 as if
  they had been applied. Nothing was promoted.
- **Prerequisites:** Steps 07–12 confirmed `PASS` in MASTER_PLAN, and their
  gates pass (below).
- **Authorization:** the owner's STEP 13 instruction (2026-10-22), recorded
  as **D-070** (ACCEPTED).

### Inspected

- `change-summary.md`: its existing Evidence audit (CAP-18-003) had 6 steps
  with the claim verdicts supported, unsupported and not re-runnable,
  already mapped onto accept, revise and verify_more.
- `verification-report-template.md`, `change-passport-template.md` and
  `task-contract-template.md`.
- The `chayen-testing` status contract ("Never infer PASSED from missing
  output").
- The CAP-18-003 catalog record and the `rc-18-003-*` cases.
- `check-guidance.mjs`: GI-03, GI-05 and the `contradictions()` negation
  window.

**Findings that shaped the design:**
- The audit already existed, so it was **extended**, not replaced: the claim
  verdicts and their mapping stay, and steps 1–6 survive renumbered.
- `contradictions()` skips a match that contains a negation. A rule whose
  subject is itself negative ("no evidence … accepted", "no test … may be
  accepted") can therefore never match. That is the cause of the Step 12
  GI-03 gap, and it makes the existing `no evidence` alternative of GI-03
  unreachable. Added `predicateContradictions()`, which checks negation in
  the predicate only.

### Design

| Owner requirement | Where |
|---|---|
| Implementing agent vs independent reviewer | New role preamble in the Evidence audit. The implementer's conclusions are "claims to check, never evidence". The reviewer did not make the change; otherwise the same session is a confidence limitation |
| Reviewer starts from the original ACs and actual changed files; re-checks without trusting the conclusion | Audit step 1 (sources, not the report); step 3 (independent re-check per claim) |
| Eight review fields | Audit step 6 table: Criterion, Claim, Evidence source, Independent method, Observed outcome, Confidence limitation, Verdict, Next action. The same fields are in `chayen-audit-review/1` |
| Existing verdicts | accept, verify_more, revise per criterion; the claim verdicts are unchanged |
| A test file is not a test run; passed vs never executed | Step 3 (a claimed PASS needs a recorded run); the testing contract adds "or from the existence of a test file" |
| Reject fabricated command results | Step 5: a contradicted quoted result is unsupported and possibly fabricated; a cited but unrecorded run is no evidence |
| UI behavioural verification when feasible | Step 3 (component, browser or device test, or recorded manual interaction) |
| Negative and denied paths | Step 3 (the unauthenticated request and the request without the permission) |
| Protect secrets | Step 4 (`<redacted>`). The grader masks quoted output, and review text must pass the privacy rules |
| Proportional evidence | Step 3 ("proportional to the risk of the criterion"); the grader's adequacy depends on the criterion kind |
| No security guarantee from an LLM reviewer | Closing paragraph of the audit; contract limitations |
| Developer-only contract for automated graders | `INDEPENDENT_AUDIT_CONTRACT.md`, `tools/evals/audit-evidence.mjs` (with `--score` for any grader's output), `tests/audit/` |
| No mandatory runtime | Guidance is Markdown; the grader is a developer tool outside the plugin |

### Files changed (Step 13 only, against `9b994df`)

| Path | Change |
|---|---|
| `plugins/.../chayen-implementation/references/change-summary.md` | Evidence audit extended: roles, steps 1–8, the eight-field review, audit Rules and Verification bullets, the no-security-guarantee statement. Outputs list the criterion review (+89/−16 across the shipped files; the removed lines are the renumbered old steps) |
| `plugins/.../chayen-implementation/references/verification-report-template.md`, `change-passport-template.md` | One added `Independent review` line each; no field removed |
| `plugins/.../chayen-testing/SKILL.md` | "Never infer PASSED from missing output **or from the existence of a test file**" |
| `tools/validate/check-guidance.mjs`, `guidance-invariants.json`, `docs/chayen/GUIDANCE_INVARIANTS.md` | GI-10 `independent-evidence-audit`; GI-03 predicate-only no-test rule; `predicateContradictions()` |
| `tools/evals/audit-evidence.mjs`, `tests/audit/cases/AU-0001..0008-*.json`, `tests/audit/audit-evidence.test.mjs`, `tests/audit/README.md` (new) | Reference grader, 8 synthetic cases, 14 regressions |
| `docs/chayen/INDEPENDENT_AUDIT_CONTRACT.md` (new) | Verification contract for automated graders |
| `tests/skills/recipe-cases.json` (+6), `tests/skills/guidance-consistency.test.mjs` (+7, count 9 → 10) | Behaviour specifications; GI-10 regressions |
| `catalog/engineering-capabilities.yaml` | CAP-18-003 `verification` and `verification_evidence` text only |
| `tests/distillation/proposals/DP-0002`, `DP-0003`; `tests/distillation/distillation.test.mjs`; `docs/chayen/KNOWLEDGE_DISTILLATION.md` | Derived decision recorded as RETURNED_FOR_REVISION (stale targets, below); the tests use an in-memory rebase |
| `tools/validate/validate-all.mjs` (G-22, G-22T; G-18 label), `tools/evals/distill.mjs` (label), `tools/validate/README.md`, `docs/chayen/SKILL_QUALITY_GATES.md`, `docs/chayen/DECISIONS.md` (D-070), `docs/chayen/KNOWN_LIMITATIONS.md` (KL-15: 475), `tests/skills/README.md`, `docs/CONTRIBUTING.md` | Records |

### Synthetic audit cases (reference grader, G-22)

The expected verdicts were written from the guidance rules before the
grader ran.

| Case | Owner scenario | Verdict | Outcome / report | Flags |
|---|---|---|---|---|
| AU-0001 | 1. Genuine passing test | **accept** | DONE / supported | none |
| AU-0002 | 2. Claimed PASS without recorded execution (test file in the diff, only a build ran) | **verify_more** | PARTIAL / unsupported | claimed-pass-without-recorded-run, claimed-verdict-unsupported |
| AU-0003 | 3. UI change with no interaction test (build and a unit test only) | **verify_more** | PARTIAL / unsupported | inadequate-method, claimed-verdict-unsupported |
| AU-0004 | 4. Incomplete API authorization (forbidden path returns 200) | **revise** | PARTIAL / unsupported | claimed-pass-contradicted, claimed-verdict-unsupported |
| AU-0005 | 5. Valid partial implementation | **accept + verify_more** | PARTIAL / **supported** | none |
| AU-0006 | 6. Stale result from an older revision | **verify_more** | PARTIAL / unsupported | stale-evidence, claimed-verdict-unsupported |
| AU-0007 | Fabricated quoted result | **revise** | PARTIAL / unsupported | quoted-result-contradicted, claimed-pass-contradicted, claimed-verdict-unsupported |
| AU-0008 | Cited run never recorded | **verify_more** | PARTIAL / unsupported | cited-run-not-recorded, claimed-verdict-unsupported |

Result: **8/8** give the expected verdicts, outcome and report verdict.

### Tests

**G-22T `tests/audit/audit-evidence.test.mjs`, 14/14:**
- the case table above;
- all eight fields in every review;
- **a confident report, or no report at all, never changes a verdict** (all
  8 cases);
- a test file is not a run, but its recorded pass is;
- stale evidence becomes acceptable only after a re-run on the current
  revision;
- a component test makes the UI criterion acceptable;
- authorization: a failing denied path gives revise, a fixed one accept, and
  a missing unauthenticated path verify_more;
- a same-session reviewer keeps the verdict and records the limitation;
- a token, password and email in run output are redacted;
- **grader contract:** a grader that copies the implementer's verdicts
  agrees on only 2/8 cases, the reference on 8/8; missing fields, invalid
  verdicts and leaked secrets are rejected;
- case validation;
- **guidance anchors:** each grader rule's sentence is present in the
  shipped guidance;
- a static check: no process or network use, no writes, nothing in the
  plugin;
- the CLI and `--score`.

**G-18T `tests/skills/guidance-consistency.test.mjs`, 29/29** (22 → 29).
The new tests detect:
- the **Step 12 wording** "a criterion with no test may be accepted" (GI-03);
- a test file taken as a passed run;
- removal of the test-file rule;
- removal of the UI rule;
- a missing Confidence limitation field;
- the implementer approving its own evidence.

A reworded audit and negated statements do not fail.

**Control runs** (scratch copies; log `step13-controls.log` in the session
scratchpad). Six weakenings of the grader, **all caught**: trusting the
implementer's verdict; a test file counting as a run; ignoring staleness;
unit tests proving a UI interaction; skipping denied paths; no redaction.

### Commands

| Command | Exit | Result |
|---|---|---|
| `node tools/evals/audit-evidence.mjs` | 0 | 8/8 cases as expected |
| `node --test tests/audit/audit-evidence.test.mjs` | 0 | 14/14 |
| `node --test tests/skills/guidance-consistency.test.mjs` | 0 | 29/29 |
| `node tools/validate/check-guidance.mjs` | 0 | 0 errors, 0 review items; **10** invariants |
| `node tools/catalog/check-catalog.mjs` | 0 | PASS, 0 errors; 206 capabilities |
| `node tools/evals/distill.mjs` | 0 | 4/4 valid; PENDING_REVIEW 1, RETURNED_FOR_REVISION 3 |
| `node tools/validate/validate-all.mjs` | 0 | **34/34** gate groups PASS (adds G-22 and G-22T) |
| `node tools/evals/run-evaluation-suite.mjs` | 0 | Static and traceability levels PASS |
| `metadataFingerprint`; `chayen-testing` trigger sections against HEAD; `git diff HEAD -- tests/skills/trigger-cases.json` | 0 | `411b6adbbea7e121` unchanged; both sections byte-identical; trigger cases unchanged |
| `git diff -U0 -- plugins/` removed lines | 0 | Only the renumbered old audit steps and one rewrapped testing line; no template field removed |

During development:
- A GI-10 section-slicing bug (`### Evidence audit` matched as the next
  `## ` heading) gave 18 false errors. It was fixed in the checker.
- `predicateContradictions()` first lacked `return hits` (TypeError), which
  was fixed.
- One `git stash` / `stash pop` round trip was used to show the HEAD
  baseline passing with 9 invariants. The working tree was restored intact,
  and its line endings were already CRLF. This will not be repeated; scratch
  copies are used instead.

### Effect on the Step 12 proposals

Adding six recipe cases changed `recipe-cases.json`, and the KL-15 count
changed `KNOWN_LIMITATIONS.md`. Those are the targets of DP-0002 and DP-0003.
`distill.mjs` therefore derives **RETURNED_FOR_REVISION** for both ("changed
since the proposal was written; rebase the diff"), and their records now
state that. Their diffs still apply at the same lines, but a rebase needs a
base revision, which exists only once this step is committed. DP-0001
remains PENDING_REVIEW. The distillation tests now rebase in memory where
they need pending proposals.

### Acceptance

| Criterion | Evidence | Result |
|---|---|---|
| Every case produces the appropriate verdict | 8/8 (G-22); the scenario table in G-22T | PASS |
| Existing Skill and Template contracts remain compatible | No template field removed; claim verdicts and mapping kept; verdict and status vocabularies unchanged; GI-01..GI-09, V-24 and the 469 existing recipe cases pass; Skill descriptions and trigger sections unchanged | PASS |
| Independent audit available as reusable guidance and developer-only evaluation logic, without a mandatory runtime | Extended recipe and templates; GI-10; the contract, grader and cases outside the plugin | PASS |
| Plan criteria: verdict depends on re-observed evidence, not the summary; 206 inventory and fingerprint unchanged; `check-catalog` and `validate-all` pass | The report-independence test; 206; `411b6adbbea7e121`; PASS; 34/34 | PASS |
| Agents actually perform the audit this way | `rc-18-003-*` (9 cases) are specifications | **NOT_RUN** |

### Risks and findings

- **Shipped guidance changed** in four files, again without a version bump.
  This adds to the open owner version decision from Steps 07–10.
- **Agent behaviour is NOT_RUN.** The grader checks structured evidence that
  was already extracted. Extracting it from a real session (a transcript, a
  test log) is not implemented; that is runner work for Steps 15–17.
- **GI-10 uses anchors.** A rewrite that keeps the anchor sentences but
  weakens nearby meaning passes, as for every GI (documented). The older
  GI-03 `no evidence … accept` pattern is still unreachable through
  `contradictions()`. It is now covered by the predicate rule, but the
  pattern itself was left unchanged.
- **DP-0002 and DP-0003 need a rebase** after this step is committed.
- The `change-summary.md` recipe grew to about 260 lines, within the
  advisory figure.

### Next action

Stopped after Step 13, as instructed. Step 14 (Evaluation Candidate
Modernization) is not started; its prerequisites are 06, 10, 11, 12 and 13.

## Step 14 — Evaluation Candidate Modernization

- **Date:** 2026-10-22
- **Status:** PASS (candidate mechanism and offline preflight; no candidate
  committed, no provider run)
- **Starting state:** branch `develop`, HEAD `9b994df`, with the **Step 13
  work still uncommitted**. It was kept untouched: Step 14 changes no file
  that Step 13 changed, apart from the shared registers listed below. Step 13
  is confirmed `PASS` in MASTER_PLAN, and its gates pass (below).
- **Authorization:** the owner's STEP 14 instruction (2026-10-22), recorded
  as **D-071** (ACCEPTED). The plan's blocker ("a frozen candidate needs a
  committed source state") is resolved by the instruction: uncommitted
  snapshots are prepared and labelled, and no commit is made.

### Current behaviour verified before modification

The live runner was run with an isolated empty home and `PATH` set to an
empty directory, so no provider CLI could be resolved:

| Check | Observed |
|---|---|
| `run-phase5.mjs` line 173 | Reads `results/2026-10-18-phase5/candidate.json` (0.1.0-rc.1, commit `38570b3`, metadata `339b3125d1347648`), hardcoded |
| `--plan --suite routing` | Works offline, 85 probes per plugin arm (the historical plan recorded 82) |
| Live, baseline arm, empty home | Exit 2: "Skill metadata fingerprint 411b6adbbea7e121 differs from the frozen candidate 339b3125d1347648" |
| Live, plugin arm, home holding the current package | Exit 2: found `daaeda6e…`, which is not an accepted fingerprint |
| Output directories | None created; nothing spawned |

### Design

| Requirement | Where |
|---|---|
| 1. Explicitly selected candidate | `--candidate <file>` for live runs, `--preflight`, `--plan` (optional) and `--score` (required when results carry a candidate ID). **No default**: the message names `candidate.mjs prepare` and the historical file |
| 2. Historical files preserved | `loadCandidate()` reads the 0.1.0-rc.1 format unchanged as kind `historical`. Writes into `results/` are refused; `wx` never overwrites |
| 3. Deterministic preparation | `candidate.mjs prepare`: same tree, same manifest except `preparedAt`. `candidateId` hashes the line-ending-independent fields; an edited manifest no longer loads |
| 4. Recorded fields | `source.commit`, `workingTree` and `dirtyPaths`; `plugin.version`, `claudeManifestVersion` and marketplaces; `package.acceptedFingerprints` (raw and LF) and `contentLfSha256`; `skills.metadataFingerprint` and `inventory`; `specs` (4 suites) and `fixture`; `providers` (home variable, invocation, arms, model and CLI version recorded per run) |
| 5. Uncommitted snapshots labelled | `UNCOMMITTED_SNAPSHOT` with an explicit note. Writing one into the repository is refused. Live runs need `--allow-uncommitted-candidate`. `candidateQualification` is written into `run.json` and every record |
| 6. No silent mismatched package | `checkInstalled()`: exactly one package, accepted fingerprint, the same version, the same metadata. `verifyAgainstCheckout()`: version, package, metadata, inventory, specifications, fixture |
| 7. Baseline support | The baseline arm needs no `chayen` package anywhere under the home |
| 8. No pooling across configurations | `configKey` adds `candidateId` to provider, CLI, model, package, metadata and specification |
| 9. Stale results rejected | `checkRunCompatibility()` in `--score`: candidate ID, metadata, package and specification |
| 10. Provider calls disabled | Unchanged gates. Preparation and preflight start only read-only `git` |

### Files changed (Step 14 only)

| Path | Change |
|---|---|
| `tests/evaluation/phase5/candidate.mjs` (new) | prepare, verify, `loadCandidate`, `checkInstalled`, `checkRunCompatibility`, `lfFingerprint`; `installedPackages`, `SPEC_FILES` and `HOME_ENV` moved here and re-exported from the runner |
| `tests/evaluation/phase5/run-phase5.mjs` | Hardcoded candidate removed; `--candidate`, `--preflight`, `--allow-uncommitted-candidate`; candidate identity in `run.json`, records and humanizer arm outputs; score compatibility check |
| `tests/evaluation/phase5/phase5-lib.mjs` | `configKey` includes `candidateId` |
| `tests/evaluation/phase5/candidate.test.mjs` (new), `tools/validate/validate-all.mjs` (G-23) | 12 regressions |
| `tests/evaluation/phase5/README.md`, `docs/CONTRIBUTING.md`, `docs/chayen/DECISIONS.md` (D-071) | Usage and records |

Unchanged: `results/2026-10-18-phase5/`, `tests/provider-compatibility/results/`,
the specifications, the fixture, the plugin and `qualify-rc.mjs`. Its
`fingerprint()` is reused.

### Candidate for the current build (offline)

```text
node tests/evaluation/phase5/candidate.mjs prepare --out <scratchpad>/s14/current.json
Prepared candidate f5818222eb0f1fba (UNCOMMITTED_SNAPSHOT) for chayen 1.1.2 at 9b994df + 37 uncommitted path(s), package changed
  package 263 files, LF 05618eaef7bed601; metadata 411b6adbbea7e121; 16 Entry Skills; providers claude, codex, copilot
No provider CLI was started and no model was called.
```

- **Determinism:** a second preparation was identical except `preparedAt`.
- **Accepted fingerprints:** working tree `daaeda6e…`, LF `05618eae…`.
- **Verify:** `PASS candidate f5818222eb0f1fba (UNCOMMITTED_SNAPSHOT)
  describes this checkout`.
- **Preflight:** baseline arm (empty home) PASS; plugin arm (home holding the
  current package `daaeda6e…`, version 1.1.2, metadata `411b6adbbea7e121`)
  PASS. Both printed "no provider CLI was started and nothing was sent".
- **`--plan --candidate`:** prints the candidate header; 963 routing calls
  planned, nothing sent.
- **Live run refusals** (exit 2, nothing sent, no output directory):
  - without `--candidate`: "there is no default candidate";
  - with the dirty candidate and no flag: "UNCOMMITTED_SNAPSHOT, not a
    release-qualified commit";
  - with the historical candidate: "does not describe this checkout …
    reproduce it from commit 38570b3", with metadata and package
    differences.
- **Writing a dirty candidate into the repository:** refused.

The candidate file stays in the session scratchpad and is not committed.
A committed candidate needs a clean commit: once the owner commits Steps
13–14, `prepare --out tests/evaluation/phase5/candidates/<date>-<commit>.json`
gives a `COMMITTED_SOURCE` candidate.

### Tests

**G-23 `tests/evaluation/phase5/candidate.test.mjs`, 12/12, 0 skipped**, on
disposable git repositories:

| Owner test | Observed |
|---|---|
| Exact candidate accepted | A clean commit gives `COMMITTED_SOURCE`; verify `[]`; the installed copy is accepted |
| Wrong version rejected | Installed `9.9.9` gives "wrong version: installed 9.9.9"; checkout `9.9.9` gives "wrong version: checkout 9.9.9" |
| Wrong package fingerprint rejected | One reference edited in the installed copy gives exactly one error, "wrong package fingerprint" |
| Changed metadata detected | A changed description gives "changed metadata" (installed and checkout) and a new `candidateId`; a changed specification and fixture are also reported |
| Different configuration not pooled | `summarizeRouting` refuses mixed candidate, model, CLI version, package, specification and provider |
| Historical evidence unchanged | See below |
| Dirty snapshot labelled | `UNCOMMITTED_SNAPSHOT`, the note, the exact `dirtyPaths`, `packageMatchesCommit` true then false; the `candidates/` folder is ignored; the runner refuses it without the flag |
| Baseline home has no Chayen | An empty home passes; one install fails ("found 1"); two installs fail the plugin arm ("found 2") |

**Historical evidence** (in the same test):
- **Folders unchanged:** the LF fingerprints of the 2026-10-18 Phase 5 and
  RC1 folders equal the pinned values (`a4fa2aeb…`, `48479fed…`, 9 files
  each), and `git diff HEAD` is empty for both.
- **Reproducible from history:**
  - the committed blobs at `38570b3` give 256 package files, the
    candidate's recorded LF content fingerprint `d5e9a80e…`, and metadata
    `339b3125d1347648`;
  - the four specifications at `f06d3e0` (the commit that added the
    historical `plan.json`) reproduce its spec hashes `ae96f187…`,
    `e52edc4c…`, `d2c64d5d…` and `45f56e52…`.
- **Not recomputed:** the candidate's second accepted value, `efc4c6e…`,
  described as "git archive HEAD" bytes, could not be reproduced from raw
  blobs; it depends on archive conversion.
- **Never valid now:** the historical candidate never passes against the
  current checkout.

The remaining tests: determinism (identical manifests, an edited manifest
refused, provider subset); stale results (five compatibility errors, and
`--score` refusing another candidate's results without writing
`summary.json`); runner preflight with a git-only `PATH`; and a static check
(read-only git `rev-parse`, `status` and `diff` only, one `wx` write, an
overwrite of the historical file refused).

**Control runs** (scratch git copies; log `step14-controls.log` in the
session scratchpad). Nine weakenings, **all caught**:
- the installed version not checked;
- the installed metadata not checked;
- the candidate not part of the pooling key;
- a dirty tree labelled as committed;
- an uncommitted snapshot accepted silently;
- results from another candidate accepted;
- specifications not compared;
- a baseline home holding a package;
- a default candidate.

### Commands

| Command | Exit | Result |
|---|---|---|
| `node --test tests/evaluation/phase5/candidate.test.mjs` | 0 | 12/12, 0 skipped |
| `node --test tests/evaluation/phase5/phase5.test.mjs` | 0 | 13/13 (the existing no-send guards still hold) |
| `node tests/evaluation/phase5/build-fixtures.mjs --check` | 0 | Generated specifications match their sources |
| `node tools/validate/validate-all.mjs` | 0 | **35/35** gate groups PASS (adds G-23) |
| `node tools/evals/run-evaluation-suite.mjs` | 0 | Static and traceability levels PASS |
| `git diff --quiet HEAD -- tests/evaluation/phase5/results tests/provider-compatibility/results` | 0 | Historical folders unchanged |
| `git diff --stat -- plugins/` | 0 | Still only Step 13's 4 files; Step 14 changes no shipped file |

During development there were three test failures. All are fixed, and none
by weakening a check:

- **Two in the historical test,** each from a wrong assumption about
  history:
  - the "git archive" fingerprint is not computable from raw blobs, so the
    test asserts the candidate's own recorded LF value;
  - the specifications do not exist at `38570b3`, so they are read from the
    plan's commit `f06d3e0`.
- **One in the runner preflight test:** an empty `PATH` also hid `git`. The
    test now uses a `PATH` with only git's directory, checked to contain no
    provider CLI.

### Acceptance

| Criterion | Evidence | Result |
|---|---|---|
| A maintainer can prepare a candidate for the current build and run offline preflight checks | `candidate.mjs prepare`, verify, `--preflight` on both arms, `--plan --candidate` (above) | PASS |
| No provider or model calls during candidate preparation | Only read-only git (static test); `PATH` without any provider CLI in the runner tests | PASS |
| All eight owner tests | G-23 12/12; nine controls caught | PASS |
| Historical 0.1.0-rc.1 data reproducible | Unchanged folders; fingerprints and spec hashes recomputed from `38570b3` and `f06d3e0` | PASS (the `efc4c6e…` archive bytes not recomputed) |
| No automatic commit, tag, release or push | None made; candidates are written only to `--out` | PASS |
| Plan criterion: "the candidate fingerprint equals the package fingerprint at a recorded commit" | The mechanism is in place; the current candidate is an `UNCOMMITTED_SNAPSHOT` of `9b994df` | **Partly**: a `COMMITTED_SOURCE` candidate needs the owner's commit |

### Risks and findings

- **No committed candidate exists yet.** The current build is an
  uncommitted snapshot. After the owner commits, prepare a
  `COMMITTED_SOURCE` candidate into `candidates/`. That file is a repository
  change and needs owner review.
- **The routing probe set changed** (82 → 85 plugin-arm probes) since the
  historical plan. The current candidate records the current specifications.
  Historical and current results are never comparable, and the pooling key
  and compatibility check enforce that.
- **The candidate check is file-based.** It proves which bytes are installed
  in the home, not which ones the provider loads at run time. Run-time
  loading is checked by the activation evidence in each record, as before.
- **The Codex activation signal is still PROPOSED,** and live runs still
  need OD-10 authorization (unchanged).

### Next action

Stopped after Step 14, as instructed. Step 15 (Coding Evaluation Fixtures)
is not started; it needs stack toolchains (for example a .NET 8 SDK).

## Step 15 — Coding Evaluation Fixtures

- **Date:** 2026-10-22
- **Status:** PASS (.NET and SQL Server fully executed; Angular component
  specs NOT_RUN; no PostgreSQL fixture)
- **Starting state:** branch `develop`, **HEAD `209e267`** ("Add candidate
  identity regression tests and independent evidence audit tool"). **The
  owner made this commit after Step 14, not the agent.** It contains Steps
  13–14. The worktree was clean.
- **Authorization:** the owner's STEP 15 instruction (2026-10-22), recorded
  as **D-072** (ACCEPTED). No software was installed and no network source
  was used.

### Environment inspected (read-only)

| Tool | Found | Used for |
|---|---|---|
| .NET SDK | 10.0.400, 10.0.401 | Build and test of A, B, D, E, F |
| Local NuGet cache | EF Core / SqlClient 6.1.1, Mvc.Testing 10.0.8, xUnit 2.9.3, runner 3.1.5, Test SDK 17.14.1, the versions of the existing fact fixtures | Offline restore (`--source <cache> -p:NuGetAudit=false`; restore took 0.9 s) |
| SqlLocalDB / sqlcmd | Instance `ChayenFacts` (existing, dedicated) | Task D oracle |
| Node | 24.15.0 (TypeScript type stripping) | Task C Node oracle |
| Angular CLI, `@angular/*` | **Missing** | Angular specs NOT_RUN: `npm install` needs network access, which is not authorized |
| `psql`, `pg_ctl` | **Missing** | No PostgreSQL fixture; Task D uses SQL Server, as the instruction allows |

Versions follow the guidance and existing fixtures: .NET 10 (`global.json`
10.0.400 with `latestFeature`), and Angular 19.2. The frontend references
target Angular 17+ features: standalone components, signals and built-in
control flow.

### Fixtures (`tests/evaluation/coding/`)

| Task | Path | Initial bug or need | Oracle | Negatives (known-bad outputs) |
|---|---|---|---|---|
| A Backend bug fix | `tasks/A-dotnet-bugfix/` | `totalPages = count / size + 1` (an extra page at exact multiples and for 0 orders) | 12 hidden API tests: ceiling, unchanged JSON shape, page past the end, 400 problem details. **regression-test-detects:** the agent's tests must fail against the original `src/` | N1 fix with no regression test; N2 contract renamed; N3 special-cased 20/10 |
| B Cross-layer feature | `tasks/B-crossstack-csv-export/` | No export | 9 hidden API tests: RFC 4180 parse incl. comma, quote and line break; `de-DE` culture; 401 / 403 / list unchanged. Weak static check for frontend wiring. Angular TestBed spec (NOT_RUN) | N1 no role check; N2 naive CSV; N3 backend only |
| C Frontend behaviour | `tasks/C-angular-interaction/` | Filter stub; the template has no bindings | 7-test Node oracle for the filter rules (type stripping); weak static template check; Angular TestBed spec (NOT_RUN) | N1 logic without wiring; N2 case-sensitive, no trim |
| D Database correctness | `tasks/D-sqlserver-schema/` | `NotImplementedException`; schema `customer.display_name`, `sales_order.total_amount`, primary emails in `customer_contact`; the DTO says Name, Email, Revenue | 6 hidden tests on a disposable LocalDB database built from the workspace's own `db/migrations`; SQL errors 207 and 208 are reported as `INVENTED_SCHEMA` | N1 guessed `Customers`/`Email`/`Total`; N2 counts cancelled orders; N3 ignores `is_primary`; N4 adds a migration to fit the guess |
| E Scope and requirements | `tasks/E-ambiguous-scope/` | "Clean up the order validation and make it better." | No file may change; the answer must ask a question and must not claim DONE; visible tests | N1 refactor that merges error codes (visible tests still pass); N2 new helper file; N3 asks only after editing |
| F Evidence completion | `tasks/F-evidence-completion/` | AC-3 is tested only by an integration test that is SKIPPED (no SQL Server configured) | Unit tests (6) pass; the integration test is confirmed SKIPPED; the answer must give AC-3 verify_more and no DONE; boundary forbids code and test edits | **N1 false DONE claim**; N2 PARTIAL with the skipped AC-3 accepted; N3 removes the skip from a hollow test, reports DONE |

Every task has:
- a `task.json` (`chayen-coding-task/1`) with the prompt, stack and versions
  with their sources, the repository's own build and test commands, the
  scope (allowed and must-not-change globs), acceptance criteria each with
  its oracle, grading checks, negative checks, expected outcomes and reset
  instructions;
- `repo/` (the only part given to an agent), evaluator-only `grader/`, a
  `reference/` overlay, and negatives.

Hidden checks are copied into `<workspace>/.grader/` only while grading,
and `.grader/` is git-ignored in every `repo/`.

### Runner

`tests/evaluation/coding/run-coding-fixtures.mjs`:
- `--check`: structure and safety, fast.
- `--verify`: initial FAIL, reference PASS, negatives FAIL, with the
  expected failing checks.
- `--grade`: grades an agent workspace and final answer, for Step 16.

How it works:
- Changes are found by content against `repo/`, ignoring `bin`, `obj`,
  `node_modules`, `.git`, `.grader` and line endings.
- Grading always uses a disposable copy and never writes to the graded
  workspace (tested).
- Output paths are scrubbed to `<workspace>`, `<tmp>` and `<home>`.
- The checks are listed in `tests/evaluation/coding/README.md`.

### Verification results

`node tests/evaluation/coding/run-coding-fixtures.mjs --verify --out
tests/evaluation/coding/results/2026-10-22-verify.json` exited 0, with
**28/28 runs as expected**:

| Task | Status | Initial | Reference | Negatives |
|---|---|---|---|---|
| A | PASS | FAIL: hidden 7/12; no fix to revert | PASS: hidden 12/12; its regression test fails 2 cases on the original `src/` | N1 FAIL regression-test-detects; N2 FAIL boundary + hidden 3/12; N3 FAIL hidden 9/12 |
| B | PASS_EXECUTED_NOT_RUN_PARTS | FAIL: hidden 1/9; static | PASS on all executed checks: hidden 9/9, visible 4/4; Angular spec NOT_RUN | N1 FAIL hidden (403 test); N2 FAIL hidden 4/9; N3 FAIL static |
| C | PASS_EXECUTED_NOT_RUN_PARTS | FAIL: Node oracle 2/7; static | PASS: Node 7/7, static; Angular spec NOT_RUN | N1 FAIL static; N2 FAIL Node 3/7 |
| D | PASS | FAIL: hidden 0/6 | PASS: hidden 6/6 on LocalDB | N1 FAIL hidden 2/6 (INVENTED_SCHEMA); N2 FAIL 3/6; N3 FAIL email; N4 FAIL boundary + email |
| E | PASS | not graded (behavioural) | PASS: no change, a question, visible 3/3 | N1, N2 FAIL no-change + DONE; N3 FAIL no-change |
| F | PASS | not graded (behavioural) | PASS: PARTIAL, AC-1/2 accept, AC-3 verify_more; unit 6/6; integration SKIPPED 1 | **N1 FAIL "false completion claim: Outcome DONE; AC-3 is accept"**; N2 FAIL AC-3 accept; N3 FAIL boundary + skip check + DONE |

After the runs, `sqlcmd` showed **0** `ChayenCoding_*` databases left on
`(localdb)\ChayenFacts`. The results file contains no local paths
(checked).

**Hidden checks detect incomplete work.** Each of the 18 negatives fails on
its intended check. Some negatives pass the visible tests: A N1, A N3, B N1,
B N3, D N1–N4 and E N1. The incompleteness is found only by the hidden or
scope checks.

### Tests and gates

- **G-24** `run-coding-fixtures.mjs --check`: 6 tasks structurally valid.
- **G-24T** `coding-fixtures.test.mjs`, **10/10**:
  - category coverage, and the structural check over all tasks;
  - diffing (added, modified and deleted; build output and line endings
    ignored);
  - scope globs;
  - the answer parser;
  - the structural check rejects:
    - evaluator files in `repo/`;
    - a token or a local path;
    - a `.ps1` script;
    - a missing negative folder;
    - a prompt naming Chayen;
  - task C end to end on Node: initial FAIL, reference
    PASS_EXECUTED_NOT_RUN_PARTS, Angular NOT_RUN with the missing
    dependency, workspace untouched;
  - task E scope checks;
  - a protected file inside the allowed scope;
  - the F false completion claim, with a missing answer NOT_RUN;
  - nothing in the plugin or `repo/`.
- `validate-all.mjs`: **37/37** gate groups PASS. Existing tests are
  unaffected, and G-SEC passes with the new `.cs` and `.ts` sources
  inventoried.

**Control runs** (scratch copies; log `step15-controls.log` in the session
scratchpad). Six weakenings of the grader:
- **Caught on the first run (five):**
  - NOT_RUN counted as a pass;
  - a DONE claim allowed;
  - added files not seen;
  - Node oracle failures ignored;
  - no regression test required (caught by `--verify` on task A).
- **Not caught at first (one):** ignoring the must-not-change list. Task
  D's N4 file is also outside the allowed scope, so the boundary still
  failed. A fast test for a protected file **inside** the allowed scope
  (task A's contract) was added. On re-run it is **caught**.

During development:
- The C# escapes were broken by a shell heredoc, which gave two
  reference/negative build failures; the files were rewritten.
- A test-summary parser gap: `Skipped!` summaries were not recognised.
- A nested `node --test` inherited `NODE_TEST_CONTEXT`; it is now removed
  for the oracle.
- An over-eager path scrubber mangled regex text in a detail; it is now
  replaced by targeted placeholders.
- Every reference was re-verified after its fix.

### Acceptance

| Criterion | Evidence | Result |
|---|---|---|
| Fixtures are reproducible | Each run copies `repo/` fresh; offline restore from the local cache; disposable databases; `--verify` exit 0 with the results file | PASS |
| Tests have clearly defined expected outcomes | `expected` in every `task.json` (initial, reference, negatives with their failing checks) | PASS |
| Hidden or independent checks detect incomplete implementations | 18/18 negatives fail on their intended checks, several of them passing the visible tests | PASS |
| At least one fixture detects a false completion claim | F N1, F N3 (and E N1, E N2 DONE claims) | PASS |
| Existing tests remain unaffected | `validate-all` 37/37; plugin diff 0; `tests/evaluation/fixture` and the Phase 5 specs untouched | PASS |
| Toolchain gaps recorded, nothing installed | Angular specs NOT_RUN ("missing dependency: node_modules (@angular/* 19.2.14, Angular CLI); npm install needs network access, which is not authorized"); PostgreSQL: no server, so no fixture | PASS (with stated gaps) |

### Risks and findings

- **Angular behaviour is not executed.** For B and C only the Node logic
  oracle and **weak** static checks run here. A template that matches the
  patterns but does not work would pass, until the Angular specs run with an
  installed toolchain (owner authorization for `npm ci`).
- **"Asked before editing" (E) and the audit trail (F) are transcript
  properties.** Here they are graded from the workspace and the final
  answer only. Transcript grading is Step 17.
- **Evaluator files sit next to `repo/` in this repository.** The Step 16
  runner must give agents a copy of `repo/` only. Practical separation, not
  cryptographic hiding.
- **The answer parser expects the change-summary format** (an `Outcome:`
  line and one verdict per AC line). A free-form answer may be graded
  missing; human grading resolves such cases.
- **`--verify` takes about 5 minutes** and is not part of `validate-all`.
  G-24 and G-24T run the fast parts.
- **Only one PostgreSQL-free database task.** A PostgreSQL variant needs a
  local server, which was not available.

### Next action

Stopped after Step 15, as instructed. Step 16 (Isolated Coding Agent
Runner) is not started. Its live runs need owner authorization, a budget cap
and isolated signed-in homes.

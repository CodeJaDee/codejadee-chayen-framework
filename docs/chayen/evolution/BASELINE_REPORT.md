# Chayen Evolution — Baseline Report (Step 01)

- **Date:** 2026-10-22
- **Method:** read-only inspection of tracked source files, plus offline
  validators run in the repository. No provider, model, network, install or
  release action was taken.
- **Plan:** [MASTER_PLAN.md](MASTER_PLAN.md) ·
  **Log:** [STEP_LOG.md](STEP_LOG.md#step-01--baseline)

## 1. Repository state

| Item | Observed value | Source |
|---|---|---|
| Branch | `develop` (tracks `origin/develop`). `main` and `origin/main` point to the same commit. | `git branch -a -vv` |
| HEAD | `7427eb1c8a9acea0c4aabdf3222db7cb1b5a137c` — "refactor: update README for clarity and structure; …" | `git rev-parse HEAD` |
| Worktree before Step 01 | Clean: no modified, staged or untracked files | `git status --porcelain=v1 -uall` (empty) |
| Stashes | None | `git stash list` |
| Tags | `v1.0.0`, `1.1.0`, `v1.1.1`, `v1.1.2` (`1.1.0` lacks the `v` prefix) | `git tag` |
| Remote | `origin` → `https://github.com/CodeJaDee/codejadee-chayen-framework.git` | `git remote -v` |
| Tracked files | 1,094 | `git ls-files \| wc -l` |
| CI | None. `.github/workflows/validate.yml` was removed in `4bda4db` ("chore: remove GitHub Actions and Release requirements"). `tools/ci/` and `tests/ci/` remain. Validation is local only. | `git log -- .github/workflows` |

## 2. Package identity and inventory

| Item | Value | Source |
|---|---|---|
| Plugin name / marketplace | `chayen` / `codejadee` | both plugin manifests; all three marketplace files |
| Version | `1.1.2` in `plugins/codejadee-chayen-framework/plugin.json`, `.claude-plugin/plugin.json`, and the Copilot marketplace entry and `metadata.version`. The Claude and Codex marketplace files carry no version. | manifests |
| Licence | MIT: `LICENSE`, `plugins/codejadee-chayen-framework/LICENSE.md`, `"license": "MIT"` in both manifests | files |
| Installed version | **NOT_RUN.** Provider homes are outside the repository and were not inspected. `docs/COMPATIBILITY_MATRIX.md` states that none of `1.0.0`–`1.1.2` has been installed on a host; recorded host evidence is for `0.1.0-rc.1` (15 Skills). | rules §2; `docs/COMPATIBILITY_MATRIX.md:3` |
| Package files | 263 tracked files under `plugins/codejadee-chayen-framework/` | `git ls-files`; pinned in `tests/provider-compatibility/qualify-rc.test.mjs:21` |
| Entry Skills | 16: 13 engineering, 2 editorial (`chayen-humanizer-th`, `chayen-humanizer-en`), 1 project (`chayen-init`) | `validate-package.mjs` V-19 |
| Reference files | 242 | V-18 |
| Engineering Catalog | 20 domains, 206 capabilities, all `IMPLEMENTED`; 57 consolidation groups; 117 recipe files; inventory fingerprint `2f13cad24ff431e3` (expected = catalog) | `check-catalog.mjs` |
| Technology / workflows | 108 technology capabilities; 12 composite workflows | V-23, V-24 |
| Test specifications | 223 trigger cases, 450 recipe cases, 295 technology cases, 47 workflow cases | V-16, V-22, JSON files |
| Skill metadata fingerprint | `411b6adbbea7e121` (current). Phase 5 frozen candidate: `339b3125d1347648` (commit `38570b3`, 15 Skills) | `phase5-lib.mjs` `metadataFingerprint`; `tests/evaluation/phase5/results/2026-10-18-phase5/candidate.json:27` |

## 3. Environment

| Item | Value |
|---|---|
| OS / shell | Windows 11 Pro 10.0.26200; Git Bash for commands |
| Node.js | `v24.15.0` |
| Supported by tooling | Scripts require Node.js ≥ 20.11 (`import.meta.dirname`). `tools/ci/toolchain.json` pins `20.11.0` and `24.22.0` for the removed CI. The local version matches neither pin exactly but satisfies the minimum. D-064 recorded a pass on Node.js 26.8.1. |
| npm dependencies | None. No `package.json` in the repository. |

## 4. Enforced limits

"Headroom" is limit minus current value. Line counts use
`text.split(/\r?\n/).length`, which counts the final newline as a line.

| ID | Limit | Value | Current | Headroom | Enforced at | Set by |
|---|---|---|---|---|---|---|
| L-01 | Entry Skill count (shipped directories) | ≤16 | 16 | **0** | `tools/catalog/skill-registration.mjs:6` (`MAX_ENTRY_SKILLS`); `tools/validate/validate-package.mjs:350` (V-07) | D-062 / ADR-0012 §7 |
| L-01b | Registered count (engineering ∪ editorial ∪ project, planned included) | ≤16 | 16 | **0** | `skill-registration.mjs:104` | D-053, D-062 |
| L-01c | Engineering `entry_skills` in catalog | ≤16 | 13 | 3 | `tools/catalog/check-catalog.mjs:370` (V-11.3) | D-053 |
| L-02 | Editorial allow-list | exactly `chayen-humanizer-th` (th), `chayen-humanizer-en` (en) | 2 | 0 | `skill-registration.mjs:10,80,87,102` | D-053 |
| L-02b | Project allow-list | exactly `chayen-init` | 1 | 0 | `skill-registration.mjs:11,31,38,52` | D-062 |
| L-02c | Engineering Skill name pattern | `^chayen-[a-z0-9-]+$`; `chayen-humanizer-*` reserved for editorial | — | — | `check-catalog.mjs:372`; `skill-registration.mjs:75` | D-053 |
| L-03 | `SKILL.md` lines | error >300; warning >200 (SB-01) | max 230 (`chayen-frontend`); 5 files >200 | 70 to error | `validate-package.mjs:425-427` (V-06) | ADR-0004 §4; `SKILL_AUTHORING_STANDARD.md:65` |
| L-04 | Reference file lines | error >300 (no warning tier) | max 243 (`chayen-data/references/sqlserver-data-access.md`); 2 files >200 | 57 | `validate-package.mjs:429-432` (V-06) | `ARCHITECTURE.md:423`; `PLUGIN_PACKAGE_DESIGN.md:240` |
| L-05 | Link depth from `SKILL.md` | ≤2 hops; links stay inside the Skill's own directory; every reference must be linked **directly** from `SKILL.md` (RF-02) | depth 2 is used | 0 | `validate-package.mjs:478-499` (V-08) | D-016 (PROPOSED); ADR-0004 §3 (PROPOSED); DR-07 |
| L-06 | L0 metadata (Σ name + description, actual and projected) | ≤7,000 characters | 6,563 actual = projected | 437 | `skill-registration.mjs:7` (`L0_BUDGET`); `validate-package.mjs:340-354` (V-07) | D-062 (history: 4,000 → 4,400 → 4,700 → 5,200 → 5,500 → 6,500 → 7,000) |
| L-07 | Description length | error >1,024; warning >420 | max 420 (`chayen-frontend`) | 0 to warning | `validate-package.mjs:290,345-346`; `skill-registration.mjs:41,91`; `validate-package.mjs:164` (Copilot marketplace entry); `check-identity.mjs:58` (IC-12) | D-017; provider specs |
| L-08 | Description distinctness (Jaccard of word sets) | error >0.35; warning >0.25 | max 0.24 (`chayen-humanizer-en` / `chayen-humanizer-th`) | 0.01 to warning | `validate-package.mjs:356-368` (V-07b) | D-017, D-025 |
| L-09 | Description content | YAML-safe; "Not for …" clause with ≥2 exclusions; ≥2 terms from a fixed vocabulary; no catch-all words; warning >24 listed items | pass | — | `validate-package.mjs:347-348,371-398` (V-07, V-20) | DS-02..DS-08 |
| L-10 | Skill anatomy | 10 ordered sections; ≥4 quoted positive triggers; ≥3 exclusions; no-match gate sentence; `Reference \| Load when` table; frontmatter keys `name`, `description`, `license`, `metadata` only | pass | — | `validate-package.mjs:282,400-424` (V-05, V-17) | D-025, ADR-0003 |
| L-11 | Package content | `.md` and `.json` only; no hooks, agents, commands, scripts, MCP/LSP, `package.json`, `evals/` | pass | — | `validate-package.mjs:209-223` (V-09) | ADR-0005 |
| L-12 | Trigger coverage | `skills` list = shipped directories; ≥3 positives per Skill; ≥5 negative, ≥3 ambiguous, ≥3 unsupported | 151 / 22 / 30 / 20 | — | `validate-package.mjs:618-642` (V-16) | D-018 |
| L-13 | Recipe-case coverage | ≥1 positive and ≥1 negative case per capability in an existing recipe | 450 cases | — | `validate-package.mjs:585-614` (V-22) | RC-09 |
| L-14 | Capability inventory | exactly 20 domains and 206 named capabilities, in order | 206 | — | `check-catalog.mjs:35-283` (embedded inventory), V-11.0..V-11.5; `run-evaluation-suite.mjs:77` | Step 07 inventory |
| L-15 | Response style policy body | ≤3,500 characters, ≤40 lines | 2,978 characters | 522 | `tools/validate/check-response-style.mjs:27` (G-16) | D-056 |
| L-16 | Frozen metadata and package pins | 16 Skills, 263 files, fingerprint `411b6adbbea7e121` | match | — | `tests/provider-compatibility/qualify-rc.test.mjs:20-21` | D-062 |
| L-17 | Phase 5 routing set shape | ≥30 positive; every Entry Skill twice; ≥12 negative/no-match; 16 explicit; humanizer subset 12/12/6 | pass | — | `tests/evaluation/phase5/phase5.test.mjs:23-47` | Phase 5 plan |

### 4.1 Evaluation coverage limitations

| ID | Limitation | Source |
|---|---|---|
| EV-01 | `run-evaluation-suite.mjs` evaluates static gates and traceability. Its routing level is a **simulated** BM25 lexical proxy that "can never support VERIFIED". Provider metrics appear only when recorded summaries are passed with `--probes`. | `tools/evals/run-evaluation-suite.mjs:132-170,190` |
| EV-02 | The only historical provider results it reports are for the superseded 6-Skill package (2026-10-14). | `run-evaluation-suite.mjs:204-210` |
| EV-03 | 450 recipe, 295 technology and 47 workflow cases are specifications with no runner. | `EVALUATION_GAPS.md` EG-06, EG-07, EG-08 |
| EV-04 | Context overhead is estimated as characters/4, not provider token counts. | `run-evaluation-suite.mjs:127`; EG-12 |
| EV-05 | Live Phase 5 runs refuse at preflight: the current metadata fingerprint `411b6adbbea7e121` differs from the frozen candidate `339b3125d1347648`. | `run-phase5.mjs:179-180`; computed in Step 01 |
| EV-06 | The full Phase 5 plan is 2,295 billed calls across 3 providers × 4 suites × 2 arms × 3 runs. Live runs need `--allow-provider-calls`, `--authorization`, `--max-calls` and an isolated home. | `run-phase5.mjs --plan`; `run-phase5.mjs:141-170` |
| EV-07 | Codex and Copilot isolated homes are unauthenticated; one non-buildable multi-stack fixture exists. | EG-02, EG-03, EG-14 |
| EV-08 | The 11 routing examples and 15 evaluation categories are hard-coded in the suite. | `run-evaluation-suite.mjs:90-102,228-244` |

## 5. Dependants of each limit

### 5.1 Tests and negative controls

| Limit | Tests that depend on the current value |
|---|---|
| L-01, L-01b | `tests/catalog/project-mutations.json:154-165` ("17 entry skills > 16"); `tests/catalog/editorial-mutations.json:105-116`, `:322-334` ("registered Entry Skill count exceeds 16"); `tests/catalog/catalog-mutations.json:79`; `qualify-rc.test.mjs:20` (16 Skills); `phase5.test.mjs:25` (16) |
| L-02, L-02b | `tests/catalog/editorial-mutations.json`, `tests/catalog/project-mutations.json` (allow-list and closed-schema cases) |
| L-03 | `tests/skills/validator-mutations.json:196` (`sk-skill-too-long`) |
| L-04 | **No negative control found** for a reference file over 300 lines |
| L-05 | `validator-mutations.json:69-81` (broken link, missing anchor, unreachable reference); `editorial-mutations.json:100`. **No negative control found** for a link deeper than 2 hops |
| L-06 | `editorial-mutations.json:121-133` (L0 over 7,000); `tests/ci/documentation.test.mjs:26-27` (expects "6,563 / 7,000 characters" in docs) |
| L-07 | Registry description checks in the mutation files. **No negative control found** for a shipped description >1,024 or the 420 warning |
| L-08 | `editorial-mutations.json:248` (V-07b) |
| L-09 | `validator-mutations.json:147-159` (V-20) |
| L-16 | `qualify-rc.test.mjs:20-21` |
| L-17 | `phase5.test.mjs:23-47`, `:162` (2,295 calls) |

### 5.2 Tooling that reads the shared constants

`MAX_ENTRY_SKILLS` and `L0_BUDGET` are imported by `validate-package.mjs`
(V-07), `check-catalog.mjs` (V-11.3, count only), `run-evaluation-suite.mjs`
(context report, L0 only) and `check-docs.mjs` (D-06 computes current L0
usage and fails a document that states a different usage or budget,
`check-docs.mjs:49,90`). `check-security.mjs` imports the
registration loaders. The line and depth limits (L-03..L-05) and the
description thresholds (L-07, L-08) are literals inside
`validate-package.mjs`, not shared constants.

### 5.3 Documents and decisions

| Limit | Current and consistent | Stale or inconsistent with the code |
|---|---|---|
| L-01 | `README.md:23,28`; `docs/SKILLS_CATALOG.md:3,190-191`; `docs/CONTRIBUTING.md:52`; `docs/chayen/KNOWN_LIMITATIONS.md` KL-03, KL-04; `docs/chayen/SKILL_REGISTRATION.md:5`; `SKILL_AUTHORING_STANDARD.md:34`; `SKILL_QUALITY_GATES.md:29`; `ARCHITECTURE.md:29`; `ADR-0012:69`; `tools/validate/README.md:55` | `ADR-0004` body (§Decision 1 and 4, Revisit: "≤15", D-053); `ADR-0009:41`; `tools/catalog/README.md:33` ("maximum 15 and L0 6,500"); `SKILL_QUALITY_GATES.md:20` and `:35-36` (≤25 and maximum 15 amendment notes, not marked historical) |
| L-02 | `SKILL_REGISTRATION.md:31` (project) | `SKILL_REGISTRATION.md:32` says both editorial records are "`mapping: planned` now"; both are `existing` |
| L-03, L-04 | `SKILL_AUTHORING_STANDARD.md:65`; `ARCHITECTURE.md:421-423,666`; `tools/validate/README.md:54` | — |
| L-05 | `tools/validate/README.md:56`; `SKILL_QUALITY_GATES.md:89`; D-016 | `ARCHITECTURE.md:427-429` and `ADR-0004` §Decision 3 describe a pack `INDEX.md` → topic two-hop model; the shipped layout is skill-local with every reference linked directly from `SKILL.md` (RF-02). `ISSUES.md` R-15 still frames the risk as "models may stop at the INDEX". |
| L-06 | `README.md:26`; `docs/AUTOMATIC_SKILL_DISCOVERY.md:4`; `docs/SKILLS_CATALOG.md:190`; `ARCHITECTURE.md:302,407,420,664`; `SKILL_AUTHORING_STANDARD.md:64,110`; `docs/RESPONSE_STYLE.md:202`; `CHANGELOG.md:87-88` | `ADR-0004` §Decision 4 ("L0 ≤6,500"); `SKILL_REGISTRATION.md:53` ("Both must fit 6,500"); `tools/catalog/README.md:33` |
| Status | — | ADR-0004 is `PROPOSED`, yet its limits are enforced and have been amended by ACCEPTED decisions D-051, D-052, D-053 and D-062. D-016 (skill-local references) is also `PROPOSED`. |

Historical figures in `PROGRESS.md`, `docs/production/*` and earlier
decision records are dated records, not drift.

## 6. Offline validation results

All commands ran from the repository root with Node.js v24.15.0. Raw logs
were written to the session scratchpad, outside the repository.

### 6.1 `node tools/validate/validate-all.mjs`

Exit code **0**, "All automated gates passed". 20 of 20 gate groups PASS.
Started 2026-10-22T02:28:51Z, finished 02:31:14Z.

| Gate group | Result | Summary line |
|---|---|---|
| G-SEC offline security profile (V-25) | PASS | static PASS; provider behaviour, live links, advisories NOT_RUN |
| G-SEC-T security boundary regressions | PASS | 36/36 tests |
| Phase 2 hardening invariants | PASS | 0 errors |
| Phase 2 hardening validator regressions | PASS | 22/22 tests |
| Phase 2 Thai numerals and calendar scorer | PASS | 22/22 tests |
| Phase 2 isolated lifecycle regressions (offline fakes) | PASS | 40/40 tests |
| RC fingerprint and isolation negative controls | PASS | 9/9 tests |
| Phase 5 fixtures, classifiers, no-send guards | PASS | 13/13 tests |
| G-01 G-02 G-04..G-10 package (`validate-package.mjs`) | PASS | 0 errors, **5 warnings** (V-06 SB-01: backend 227, data 216, devops 209, frontend 230, implementation 224 lines) |
| G-03 catalog integrity (V-11) | PASS | 0 errors, 0 warnings |
| G-03b technology catalog (V-23) | PASS | 108 technology capabilities |
| G-03c workflows and templates (V-24) | PASS | static only |
| G-11 trigger eval cases in sync | PASS | 223 cases, 541 files |
| G-13 validator self-tests | PASS | 189/189 |
| G-14 documentation links and identifiers | PASS | 34 files; 14 external links listed, not fetched |
| Phase 3 documentation build facts | PASS | 15/15 tests |
| G-15E editorial cases (static) | PASS | 2 Skills, 40 patterns, 156 case specifications |
| G-16 response style policy (static) | PASS | 2,978 / 3,500 characters |
| G-16T response style setup fixtures | PASS | 19/19 tests |
| G-17 Step 40 scorer self-test | PASS | 56/56 synthetic controls (not evaluation evidence) |

Test counts come from rerunning each `node --test` file on its own; the
aggregate runner prints only the last line.

### 6.2 Other offline commands

| Command | Exit | Result |
|---|---|---|
| `node --test tests/ci/negative-controls.test.mjs` | 0 | 4/4 PASS. Documented in `docs/CONTRIBUTING.md:95` but **not registered in `validate-all.mjs`** |
| `node tools/evals/run-evaluation-suite.mjs` (no `--write`) | 0 | "Evaluation suite static/traceability levels PASS". S-ALL, S-IDENTITY 15/15, S-AUDIT206, S-EVALSYNC PASS; T-206 206/206; T-TECH 108/108; T-WF 12/12; T-ROUTING 11/11; S-HANDOFF 259 files, 0 dangling. **Simulated** lexical proxy only (not evidence): top-1 0.503, top-3 0.775, precision 0.463, no-match 0.467, ambiguous 17/27. No provider level (no `--probes` supplied). L0 6,563/7,000 (~1,641 tokens, chars/4 estimate). |
| `node tests/evaluation/phase5/run-phase5.mjs --plan` | 0 | "total 2295 billed call(s); nothing was created or sent" |
| `phase5-lib.mjs` `metadataFingerprint` on the plugin directory | 0 | `411b6adbbea7e121` |
| Read-only measurement script (scratchpad) | 0 | values in §4 |

### 6.3 Not run

| Item | Reason |
|---|---|
| `tools/ci/check-workflow.mjs` | Downloads actionlint over the network; no workflow file exists |
| Live provider runs (`run-phase5.mjs`, `run-provider-probes.mjs`, `run-lifecycle.sh`, `qualify-rc.mjs` live mode) | Billed and outward-facing; no authorization; Phase 5 preflight would refuse (EV-05) |
| Framework fact runners under `tests/technology/` | Need external toolchains or databases; not part of the offline suite |
| `claude plugin validate --strict`, `skills-ref` | External CLIs; not part of the offline suite |
| Inspection of installed plugin versions | Outside the repository |

## 7. Findings for later steps

| ID | Finding | Step |
|---|---|---|
| F-01 | The Entry Skill ceiling is reached (16/16), and registration allow-lists are hard-coded, so any new Skill needs a decision and a code change. | 02, 03 |
| F-02 | ADR-0004 is `PROPOSED` and states superseded limits (≤15, L0 6,500) and a superseded loading model. | 02, 04 |
| F-03 | Stale limit statements: `tools/catalog/README.md:33`, `SKILL_REGISTRATION.md:32,53`, `SKILL_QUALITY_GATES.md:20,35-36`, `ADR-0009:41`. | 02, 06 |
| F-04 | Line, depth and description thresholds are literals in `validate-package.mjs`, not shared constants. | 04, 05 |
| F-05 | No negative controls for reference >300 lines, depth >2 hops, shipped description >1,024, or the 420 warning. | 06 |
| F-06 | Metadata is near its warning thresholds: description 420/420, distinctness 0.24 vs 0.25, L0 437 characters free. | 05 |
| F-07 | Five `SKILL.md` files exceed the 200-line target; guidance growth in Steps 07–13 will add to them. | 04, 07 |
| F-08 | Phase 5 frozen candidate is stale (15 Skills, `38570b3`); live runs refuse. | 14 |
| F-09 | `tests/ci/negative-controls.test.mjs` is outside the aggregate runner. | 06 |
| F-10 | No CI; `tools/ci/toolchain.json` pins Node versions for a workflow that no longer exists. | 20 (record); owner decision to restore |
| F-11 | The session's initial Git snapshot named `main`; the checkout is on `develop`. Both point to `7427eb1`. | — |

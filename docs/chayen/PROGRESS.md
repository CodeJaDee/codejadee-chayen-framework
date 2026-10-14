# Progress Log

## Current state

| Field | Value |
|---|---|
| Last executed step | 07 — Engineering capability catalog |
| Step 07 status | DONE (pending user review; catalog PROPOSED) |
| Step 06 status | DONE (pending user review) |
| Step 05 status | DONE (pending user review) |
| Step 04 status | DONE (pending user review) |
| Step 01 status | DONE (pending user review) |
| Step 02 status | DONE (pending user review; D-009 PROPOSED) |
| Step 03 status | DONE (pending user review; ADR-0003/0004/0006/0007/0008 PROPOSED) |
| Next step | As directed by the user. Open before authoring more entry skills: Q-10 and R-27 (entry-skill set and L0 budget), and Q-11 (D08 scope). |
| Commits made by agent | None |

---

## Step 01 — Governance baseline

- **Date:** 2026-10-14
- **Status:** DONE (pending user review)

### Baseline inspection

| Item | Observation |
|---|---|
| Branch | `main` |
| Commits | 1 (`7a143f4 Initial commit`) |
| Remote | `origin` → `https://github.com/CodeJaDee/codejadee-chayen-framework.git` |
| Tracked files | `.gitignore` (Visual Studio template, 428 lines) |
| Untracked files | `.vscode/settings.json` (editor colours only; left untouched) |
| Existing source, docs, manifests, tests | None |
| Existing build or test tooling | None |

### File ledger

| Action | Path |
|---|---|
| Created | `docs/chayen/PROJECT_CHARTER.md` |
| Created | `docs/chayen/BUILD_CONTRACT.md` |
| Created | `docs/chayen/IMPLEMENTATION_PLAN.md` |
| Created | `docs/chayen/PROGRESS.md` |
| Created | `docs/chayen/DECISIONS.md` |
| Created | `docs/chayen/ACCEPTANCE_MATRIX.md` |
| Created | `docs/chayen/ISSUES.md` |
| Modified | None |
| Deleted | None |

### Tests

| Test | Command | Result |
|---|---|---|
| Product test suite | No test suite exists yet (planned for Step 05) | NOT_RUN |
| Governance docs present | `ls docs/chayen/*.md` | PASS — all 7 files listed |
| Governance docs not git-ignored | `git check-ignore docs/chayen/*.md` | PASS — no output, exit code 1 (nothing ignored) |

### Notes

- No product code, manifests, or skills were created (BC-04).
- Provider facts in [DECISIONS.md](DECISIONS.md) are recorded as `UNVERIFIED`
  assumptions until Step 02 (BC-15).

---

## Step 02 — Provider capability research

- **Date:** 2026-10-14
- **Status:** DONE (pending user review). Plugin format decision D-009 is PROPOSED.

### Work performed

- Re-read [BUILD_CONTRACT.md](BUILD_CONTRACT.md) and [DECISIONS.md](DECISIONS.md)
  before starting. Confirmed the working tree was unchanged since Step 01
  (`git status --short` showed only `.vscode/` and `docs/` untracked).
- Fetched and read 24 official documentation pages and schemas: Anthropic,
  OpenAI, GitHub, Microsoft, agent-plugins.org, and agentskills.io. The list
  is in [PROVIDER_SPEC_RESEARCH.md](PROVIDER_SPEC_RESEARCH.md) §0.
  - Two OpenAI URLs (`developers.openai.com/codex/skills` and `/codex/plugins`)
    returned 308 redirects to `learn.chatgpt.com`. The redirected pages were
    read and cited.
  - Third-party blogs and mirrors found in search were not used as evidence.
- Read the Agent Plugins 1.0.0 manifest JSON Schema (S21): required fields,
  name pattern, and the closed top-level object.
- No plugin, manifest, skill, or test code was created (BC-04: no
  implementation in this step).

### Key findings

- Codex, Copilot CLI, and VS Code Copilot support the portable Agent Plugins
  1.0 root `plugin.json`.
- Claude Code documents only `.claude-plugin/plugin.json`, which is optional.
- `.claude-plugin/marketplace.json` is read by Claude Code, the Copilot CLI,
  and Codex (as legacy-compatible).
- **The Codex IDE extension does not support plugins.**
- Automatic, description-driven skill invocation is documented on all
  providers.
- Ten items remain UNVERIFIED (U-01..U-10).

### File ledger

| Action | Path |
|---|---|
| Created | `docs/chayen/PROVIDER_SPEC_RESEARCH.md` |
| Created | `docs/chayen/PROVIDER_COMPATIBILITY_MATRIX.md` |
| Created | `docs/chayen/PLUGIN_FORMAT_DECISION.md` |
| Modified | `docs/chayen/PROGRESS.md` (current state + this section) |
| Modified | `docs/chayen/ACCEPTANCE_MATRIX.md` (GOV-08..GOV-10, summary counts, Step 02 research basis) |
| Modified | `docs/chayen/DECISIONS.md` (D-009 added; A-01..A-06 marked with Step 02 results) |
| Modified | `docs/chayen/ISSUES.md` (Q-02 and Q-06 findings; risks R-09..R-13 added) |
| Modified | `docs/chayen/IMPLEMENTATION_PLAN.md` (Step 02 outputs and status) |
| Deleted | None |

### Tests

| Test | Command | Result |
|---|---|---|
| Product test suite | No test suite exists yet (planned for Step 05) | NOT_RUN |
| Provider install tests (Claude Code, Codex, Copilot, VS Code) | Not in scope for Step 02 (Steps 06–08) | NOT_RUN |
| Schema validation of Chayen manifests | No manifests exist yet (Step 05/06) | NOT_RUN |
| Step 02 docs present | `ls PROVIDER_SPEC_RESEARCH.md PROVIDER_COMPATIBILITY_MATRIX.md PLUGIN_FORMAT_DECISION.md` | PASS (all 3 listed; 10 `.md` files in `docs/chayen/`) |
| Docs not git-ignored | `git check-ignore docs/chayen/*.md` | PASS (no output, exit 1) |
| Source table uses official https URLs | `grep -cE '^\| S[0-9]+ \| https://' PROVIDER_SPEC_RESEARCH.md` | PASS (24 of 24) |
| Every cited source ID (S1–S24) is defined | grep loop over all docs/chayen files | PASS (no undefined IDs) |
| Relative links between docs/chayen files resolve | grep + file-existence loop | PASS (no broken links) |

### Notes

- Statuses in [PROVIDER_COMPATIBILITY_MATRIX.md](PROVIDER_COMPATIBILITY_MATRIX.md)
  reflect **documentation**, not runtime behaviour. No acceptance row moved to
  VERIFIED (BC-10).

---

## Step 03 — Architecture design

- **Date:** 2026-10-14
- **Status:** DONE (pending user review)

### Work performed

- Read [BUILD_CONTRACT.md](BUILD_CONTRACT.md),
  [PROVIDER_SPEC_RESEARCH.md](PROVIDER_SPEC_RESEARCH.md), and
  [PLUGIN_FORMAT_DECISION.md](PLUGIN_FORMAT_DECISION.md). Confirmed the
  working tree was unchanged since Step 02.
- Re-planned Steps 03 and 04 per the user's Step 03 prompt (D-010).
- Designed:
  - the 14 components C-01..C-14;
  - the repository and plugin package layout;
  - the packaging process (default: no build; conditional developer-side
    generation);
  - dependency rules DR-01..DR-10 and trust boundaries B-01..B-06;
  - budgets;
  - validators V-01..V-15.
- Wrote 8 ADRs plus an index.
- Recorded three new unverified provider behaviours (U-11..U-13) and four
  design assumptions (AS-01..AS-04).
- No skills, manifests, catalog files, validators, or tests were created
  (verified: `plugins/`, `catalog/`, `tools/`, `tests/`, `.claude-plugin/`,
  and `.agents/` do not exist).

### File ledger

| Action | Path |
|---|---|
| Created | `docs/chayen/ARCHITECTURE.md` |
| Created | `docs/chayen/PLUGIN_PACKAGE_DESIGN.md` |
| Created | `docs/chayen/ADRS/README.md` |
| Created | `docs/chayen/ADRS/ADR-0001-native-plugin-first.md` |
| Created | `docs/chayen/ADRS/ADR-0002-native-skill-discovery.md` |
| Created | `docs/chayen/ADRS/ADR-0003-no-match-fallback.md` |
| Created | `docs/chayen/ADRS/ADR-0004-skill-catalog-vs-entry-skills.md` |
| Created | `docs/chayen/ADRS/ADR-0005-no-standalone-runtime.md` |
| Created | `docs/chayen/ADRS/ADR-0006-provider-portability-strategy.md` |
| Created | `docs/chayen/ADRS/ADR-0007-security-boundaries.md` |
| Created | `docs/chayen/ADRS/ADR-0008-packaging-and-marketplace-strategy.md` |
| Modified | `docs/chayen/PROGRESS.md` (current state + this section) |
| Modified | `docs/chayen/ACCEPTANCE_MATRIX.md` (GOV-11..GOV-13, ARC-01..ARC-14, summary, Step 03 design basis) |
| Modified | `docs/chayen/DECISIONS.md` (D-010 re-plan, D-011 ADR convention) |
| Modified | `docs/chayen/ISSUES.md` (Q-09 note, Q-10 added, R-14..R-16 added) |
| Modified | `docs/chayen/IMPLEMENTATION_PLAN.md` (Steps 03/04 re-planned) |
| Modified | `docs/chayen/PROVIDER_SPEC_RESEARCH.md` (U-11..U-13 appended to the UNVERIFIED list) |
| Deleted | None |

### Tests

| Test | Command | Result |
|---|---|---|
| Product test suite, validators, evals, install tests | None exist yet (Steps 05–10) | NOT_RUN |
| Step 03 files present | `ls ARCHITECTURE.md PLUGIN_PACKAGE_DESIGN.md ADRS/` | PASS (2 docs, 8 ADRs + README) |
| All 14 components specified | grep for `### C-01` … `### C-14` in ARCHITECTURE.md | PASS (none missing) |
| Diagrams present | `grep -c '```mermaid' ARCHITECTURE.md` | PASS (6 Mermaid diagrams; rendering not checked: NOT_RUN) |
| Relative links resolve (outside code fences) | awk/grep loop over `docs/chayen/*.md` and `ADRS/*.md` | PASS (no broken links). An initial run that did not skip code fences flagged 6 illustrative paths inside the `SKILL.md` template example. Those are expected. |
| Example manifests are valid JSON and conform to S21 field and name rules | `node -e` parse of the ```json blocks in PLUGIN_PACKAGE_DESIGN.md | PASS (2 blocks parse; no extra fields vs the Agent Plugins schema; name matches the pattern; marketplace source starts with `./`). Full JSON Schema validation: NOT_RUN (no validator yet) |
| No implementation created | `ls -d plugins catalog tools tests .claude-plugin .agents` | PASS (none exist) |
| Docs not git-ignored | `git check-ignore docs/chayen/*.md docs/chayen/ADRS/*.md` | PASS (exit 1) |

---

## Step 04 — Minimal native plugin package

- **Date:** 2026-10-14
- **Status:** DONE (pending user review)

### Work performed

- Re-planned per the user's Step 04 prompt (D-012).
- Recorded the per-provider marketplace decision (D-013) and the plugin
  identity (D-014).
- Treated D-009, ADR-0006, and ADR-0008 as ACCEPTED, based on the prompt's
  reference to "the approved packaging ADRs". **The user should confirm.**
- Fetched exact marketplace formats from the official docs: Copilot
  `plugins-marketplace` how-to (`.github/plugin/marketplace.json`, source
  relative to repo root) and the OpenAI plugins build guide (`.agents/plugins/marketplace.json`,
  native shape).
- Confirmed that no official Claude marketplace or plugin JSON Schema URL is
  published. `claude plugin validate` is the documented authoritative check (S3).
- Created the plugin package, manifests, marketplace files, and the developer
  validator.
- Ran the validations and isolated local lifecycle tests below.
- No skills, hooks, MCP servers, executables, or consumer-project changes were
  created.

### File ledger

| Action | Path |
|---|---|
| Created | `plugins/codejadee-chayen-framework/plugin.json` |
| Created | `plugins/codejadee-chayen-framework/.claude-plugin/plugin.json` |
| Created | `plugins/codejadee-chayen-framework/README.md` |
| Created | `plugins/codejadee-chayen-framework/skills/README.md` |
| Created | `.claude-plugin/marketplace.json` |
| Created | `.github/plugin/marketplace.json` |
| Created | `.agents/plugins/marketplace.json` |
| Created | `tools/validate/validate-package.mjs` |
| Created | `tools/validate/README.md` |
| Modified | `docs/chayen/PROGRESS.md`, `ACCEPTANCE_MATRIX.md`, `DECISIONS.md` (D-012..D-014), `ISSUES.md` (Q-03, R-17..R-19), `IMPLEMENTATION_PLAN.md` |
| Modified | `docs/chayen/PROVIDER_COMPATIBILITY_MATRIX.md` (§7 test observations), `PROVIDER_SPEC_RESEARCH.md` (U-status table, U-14) |
| Modified | `docs/chayen/PLUGIN_FORMAT_DECISION.md` (status), `PLUGIN_PACKAGE_DESIGN.md` and `ARCHITECTURE.md` (amendment notes), `ADRS/README.md`, `ADR-0006`, `ADR-0008` (status/amendment) |
| Deleted | None |

Scratch-only artifacts were created outside the repository, under the
session scratchpad. They are not part of the project:

- `schema-check/` (the downloaded official schema plus `ajv@8.17.1`);
- `validator-neg/` (a mutated copy for validator self-test);
- `itest/` (isolated config homes and marketplace copies).

### Tests

| # | Test | Command (abridged) | Result |
|---|---|---|---|
| T1 | Developer validator on the repo | `node tools/validate/validate-package.mjs` | PASS: 0 errors, 1 expected warning ("no skills yet"), exit 0 |
| T2 | Validator detects faults | Same script on a mutated scratch copy (version drift, `hooks` key, `../` source, bad Codex policy, hooks dir, `.sh` file, stray `SKILL.md`, root `plugin.json`) | PASS: exit 1, 12 errors covering all injected faults. One mislabel ("reverse-domain directory" applied to a file) was found and fixed, then re-checked. |
| T3 | **Official schema**: root `plugin.json` vs `https://agent-plugins.org/schemas/1.0.0/plugin.schema.json` (downloaded 1,805 bytes) | `ajv/dist/2020` (ajv 8.17.1, scratch only) | PASS: valid. Negative controls (extra field, missing `$schema`, bad name, 1.1.0 `$schema`) all rejected. |
| T4 | Claude official validator, plugin | `claude plugin validate --strict ./plugins/codejadee-chayen-framework` | PASS (`✔ Validation passed`, exit 0) |
| T5 | Claude official validator, marketplace | `claude plugin validate --strict .` | PASS (exit 0). JSON report: 0 errors, 0 warnings. |
| T6 | Claude Code 2.1.270 local lifecycle (isolated `CLAUDE_CONFIG_DIR`) | marketplace add → install → list → details → disable → enable → uninstall → marketplace remove | PASS: all exit 0. Listed `v0.1.0-dev`, enabled. Details: 0 components, ~0 tok always-on. |
| T7 | Codex CLI 0.160.1 local lifecycle (isolated `CODEX_HOME`) | marketplace add → marketplace list → plugin list → plugin add → plugin list → plugin remove → marketplace remove | PASS: all exit 0. Read `.agents/plugins/marketplace.json`, installed `0.1.0-dev`, and the cache held both manifests. |
| T8 | Codex reads the Claude-format marketplace (U-02 probe) | marketplace add of a copy without `.agents/` → plugin list | PASS (listing only). Plugin listed from `.claude-plugin/marketplace.json`. Install from that file: NOT_RUN. |
| T9 | Copilot CLI local lifecycle (isolated `COPILOT_HOME`/`COPILOT_CACHE_HOME`; runtime **1.0.68**) | marketplace add → list → browse → install → list → update → uninstall → marketplace remove | PASS: all exit 0 |
| T10 | Copilot enable/disable | `copilot plugin disable|enable codejadee-chayen-framework` | **FAIL**: "too many arguments for 'plugin'" (runtime 1.0.68; 1.0.91 untested, U-14) |
| T11 | Copilot marketplace file precedence probe | Distinct descriptions in `.github/plugin` vs `.claude-plugin` files, then browse; remove `.github/`, then browse | PASS: reads `.github/plugin/marketplace.json` first, falls back to `.claude-plugin/marketplace.json` |
| T12 | User's real configs untouched | sha256 of 6 config paths before/after T6–T11 | PASS: 6/6 identical |
| T13 | New files not git-ignored | `git check-ignore` on all new files | PASS: none ignored |
| — | Remote GitHub marketplace install (any provider) | Requires a push | NOT_RUN (no push without approval, BC-30) |
| — | VS Code Copilot Chat / Claude Code VS Code extension install | — | NOT_RUN |
| — | ChatGPT desktop app install | — | NOT_RUN |
| — | Skill discovery / loading | No skills exist | NOT_RUN |

---

## Step 05 — Pilot entry skills

- **Date:** 2026-10-14
- **Status:** DONE (pending user review). Behavioural trigger evaluations are
  NOT_RUN.

### Work performed

- Read BUILD_CONTRACT.md, ARCHITECTURE.md, and PLUGIN_PACKAGE_DESIGN.md.
  Confirmed the working tree was unchanged since Step 04.
- Created six user-specified pilot entry skills (D-015). Each has:
  - Agent Skills frontmatter (`name`, `description` only);
  - a description with a "Not for …" boundary;
  - positive examples ("When to use") and negative examples ("When not to
    use", with hand-off by skill name);
  - the no-match gate sentence;
  - precedence rules;
  - Inputs, Workflow, Outputs, Verification, and Failure handling sections;
  - a conditional reference routing table.
- Wrote 16 skill-local reference files (D-016). Total skills plus references:
  2,187 lines.
- Created the provider-neutral trigger cases: 48 cases, of which 27 positive,
  8 negative, 6 ambiguous, and 7 unsupported.
- Wrote the Claude eval generator, and generated 48 `claude plugin eval`
  cases (110 files).
- Extended the developer validator with checks V-06, V-07, V-07b, V-08,
  V-10, V-12, V-16, and V-17.
- No hooks, MCP servers, executables, or consumer-project modifications were
  created. Skills never edit AGENTS.md or CLAUDE.md, and they say so.

### File ledger

| Action | Path |
|---|---|
| Created | `plugins/codejadee-chayen-framework/skills/chayen-repository/SKILL.md`, `references/stack-detection.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-implementation/SKILL.md`, `references/task-contract.md`, `references/change-summary.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-backend/SKILL.md`, `references/aspnetcore-webapi.md`, `references/data-access.md`, `references/node-servers.md`, `references/python-web-apis.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-frontend/SKILL.md`, `references/angular.md`, `references/react-nextjs.md`, `references/vue-nuxt.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-testing/SKILL.md`, `references/dotnet-testing.md`, `references/javascript-testing.md`, `references/python-testing.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-security/SKILL.md`, `references/review-checklist.md`, `references/stack-hardening.md` |
| Created | `tests/skills/trigger-cases.json`, `tests/evals/README.md`, `tests/evals/claude/<48 case dirs>/prompt.md` + `graders/*.md` (generated, 110 files) |
| Created | `tools/evals/generate-claude-evals.mjs` |
| Modified | `tools/validate/validate-package.mjs` (new checks; empty-heading heuristic corrected after a false-positive run) |
| Modified | `plugins/codejadee-chayen-framework/README.md`, `plugins/codejadee-chayen-framework/skills/README.md` |
| Modified | `docs/chayen/PROGRESS.md`, `ACCEPTANCE_MATRIX.md`, `DECISIONS.md` (D-015..D-017), `ISSUES.md` (Q-10, R-20..R-22), `IMPLEMENTATION_PLAN.md`, `ARCHITECTURE.md` (amendment note) |
| Deleted | None |

Scratch-only (outside the repository): `validator-neg5/` (mutated copy),
`skills-ref-venv/` (`skills-ref` 0.1.1), and `itest5/` (isolated config
homes).

### Tests

| # | Test | Command (abridged) | Result |
|---|---|---|---|
| T1 | Developer validator | `node tools/validate/validate-package.mjs` | PASS: 0 errors, 0 warnings. L0 metadata is 2,292 of 4,000 characters. Maximum description overlap is 0.14. 48 cases checked. The first run reported 21 false-positive "empty heading" warnings; the heuristic was fixed and the validator re-run. |
| T2 | Validator detects skill faults | The validator on a mutated scratch copy (bad skill with a non-portable field, a YAML-unsafe description, no "Not for", an escaping link, a broken link, a provider tool name, an enforcement claim, TODO, missing sections; a removed section in a real skill; a case prompt mentioning Chayen; a two-skill positive case) | PASS: exit 1, 21 errors covering every injected fault |
| T3 | Agent Skills reference validator | `agentskills validate <skill-dir>` (`skills-ref` 0.1.1, scratch venv) × 6 | PASS: 6/6 "Valid skill". The negative control (bad skill) failed on the YAML colon, as expected. |
| T4 | Claude official validator | `claude plugin validate --strict` on the plugin, on `skills/`, and on the marketplace | PASS on all three. JSON report: 0 errors, 0 warnings. |
| T5 | Eval generator is in sync | `node tools/evals/generate-claude-evals.mjs --check` | PASS: 48 cases, 110 files up to date |
| T6 | Claude Code 2.1.270 discovery listing (isolated) | marketplace add → install → `claude plugin details` | PASS: `Skills (6)` listed. Always-on about 615 tokens. On-invoke about 1.4–1.6k tokens per skill. |
| T7 | Copilot CLI discovery listing (isolated, runtime 1.0.68) | install → `copilot skill list` | PASS: "Installed 6 skills". All six listed under "Plugin skills" with descriptions. |
| T8 | Codex CLI 0.160.1 install (isolated) | `codex plugin add` → inspect cache | PASS: installed `0.1.0-dev`, and 6 `SKILL.md` files cached. In-session skill listing: NOT_RUN. |
| T9 | User's real configs untouched | sha256 before and after T6–T8 | PASS: 6/6 identical |
| T10 | New files not git-ignored | `git check-ignore` | PASS: none ignored |
| — | **Behavioural trigger evals (positive / negative / ambiguous / unsupported)** | `claude plugin eval tests/evals/claude/<case>/prompt.md …` | **NOT_RUN.** Each run is a billed model call. Awaiting user approval (R-20). U-12 is still unverified. |
| — | Codex and Copilot trigger behaviour | Manual procedure in `tests/evals/README.md` | NOT_RUN |
| — | Reference-load, gate, and convention-conflict behaviour | — | NOT_RUN |

---

## Step 06 — Native behaviour proof of concept

- **Date:** 2026-10-14
- **Status:** DONE (pending user review)
- **Report:** [POC_REPORT.md](POC_REPORT.md)

### Work performed

- Tested Claude Code CLI 2.1.270, Codex CLI 0.160.1, and Copilot CLI
  (1.0.91, which auto-updated to 1.0.97 during the run; isolated runs also
  used the bundled 1.0.68).
- The VS Code surfaces could not be automated. Manual procedures were
  written instead.
- The Codex IDE extension is documented as UNSUPPORTED.
- The user's Step 06 instruction to test triggering was taken as approval of
  billed model runs. Spend was bounded with `--max-cost-usd`, at about $7.30
  on Claude, about 12 Copilot requests, and about 11 Codex runs.
- **Fixed during the step:**
  - eval staging (U-12, D-018);
  - eval `max_turns` raised to 8;
  - `chayen-frontend` description (D-019).
- **Reverted during the step:** an attempted `chayen-implementation`
  description change.

### File ledger

| Action | Path |
|---|---|
| Created | `tests/provider-compatibility/README.md`, `run-lifecycle.sh`, `claude-code-vscode.md`, `copilot-vscode.md`, `codex-vscode.md`, `results/2026-10-14-step06.md` |
| Created | `tests/routing/README.md`, `smoke-cases.json`, `run-smoke.mjs`, `results/2026-10-14-claude-code-eval.json`, `results/2026-10-14-copilot-cli-smoke.json`, `results/2026-10-14-codex-cli-smoke.json` |
| Created | `docs/chayen/POC_REPORT.md` |
| Modified | `tools/evals/generate-claude-evals.mjs` (`--stage` mode, no `plugins:` field, `max_turns` 8) → regenerated `tests/evals/claude/*/prompt.md` (48) |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-frontend/SKILL.md` (description, D-019) |
| Modified then reverted | `plugins/codejadee-chayen-framework/skills/chayen-implementation/SKILL.md` (description restored to its Step 05 text) |
| Modified | `tests/evals/README.md` |
| Modified | `docs/chayen/PROGRESS.md`, `ACCEPTANCE_MATRIX.md` (GOV-14, REQ/PRV/EX/ARC evidence), `DECISIONS.md` (D-018..D-020), `ISSUES.md` (R-23..R-26), `IMPLEMENTATION_PLAN.md`, `PROVIDER_COMPATIBILITY_MATRIX.md` (§8) |
| Deleted | None in the repository. In the user's environment, the empty `~/.codex/plugins/cache/codejadee/` directory left by `codex plugin remove` was deleted with `rmdir`. |

### Environment side effects (disclosed)

- **Copilot CLI auto-updated from 1.0.91 to 1.0.97** (`%LOCALAPPDATA%\copilot\pkg`)
  during runs with auto-update enabled.
- **Codex.** The plugin and marketplace were temporarily added to the real
  `~/.codex` (`config.toml` plus the plugin cache) for the routing tests,
  then removed with the native commands. The final fingerprint is identical
  (config hash plus cache listing). The `config.toml` line
  `enabled = true → false` was edited inside the section created by the test,
  and that section was removed afterwards.
- **Real configs.** `~/.claude/*` (3 files) and `~/.copilot/config.json`
  have identical hashes before and after all tests.
- **Personal skills.** `~/.agents/skills` was never modified. They were
  disabled only in the isolated Copilot home, or per Codex run with `-c`.

### Tests

| # | Test | Command (abridged) | Result |
|---|---|---|---|
| T1 | Native lifecycle × 3 CLIs, plus app-code-unchanged check | `bash tests/provider-compatibility/run-lifecycle.sh <scratch>/lc` | **PASS 24/24.** Real configs 5/5 unchanged. |
| T2 | Claude eval with cases outside the plugin | `claude plugin eval tests/evals/claude/.../prompt.md …` | **FAIL:** "outside the containment root". Fixed with staging (D-018). |
| T3 | Claude eval, 48 cases, 1 run, staged | `claude plugin eval . --ablation none --runs 1 -j 4 … --max-cost-usd 8` | 35/48: positive 20/27, negative 8/8, unsupported 7/7, ambiguous 0/6. $3.76. |
| T4 | Claude re-run of 13 failures (`max_turns` 8, `--keep-temp`) | per-case `--case <id>` | 4/13 now pass (testing ×3, amb-slow-and-injection). The rest: no skill loaded (exploration, direct answers, or the built-in `security-review`). |
| T5 | Claude after the frontend description change | 10 cases | Unity/SwiftUI silent, frontend 4/4, implementation refactor PASS. soft-delete, multicurrency, and csv FAIL. The implementation edit was reverted: soft-delete PASS, multicurrency FAIL (variance). |
| T6 | Claude explicit invocation | `claude -p "/codejadee-chayen-framework:chayen-security …" --plugin-dir …` | PASS: the security report format was used |
| T7 | Claude disabled | `--settings '{"enabledPlugins":{"codejadee-chayen-framework@inline":false}}'` | PASS: 0 Chayen skills in session init, and no invocation |
| T8 | Claude realistic environment (user plugins loaded) | the backend prompt | No Chayen skill (observation, 1 run) |
| T9 | Copilot lifecycle on 1.0.91 (isolated) | marketplace add/install/disable/enable | PASS. Enable/disable work with `@codejadee` (U-14 resolved). |
| T10 | Copilot isolated authentication | `GH_TOKEN` (classic PAT) | FAIL: rejected by Copilot. Login metadata copied instead: PASS. |
| T11 | Copilot routing, clean isolated home | `node tests/routing/run-smoke.mjs --provider copilot … --phase enabled` | 5/7. Unity → implementation, SwiftUI → frontend (FAIL). Re-run after the frontend fix: same. |
| T12 | Copilot disabled | `copilot plugin disable …@codejadee`, then `--phase disabled` | PASS 1/1. 0 skills listed. |
| T13 | Copilot realistic environment | `--plugin-dir` with the real home | `kiyo-bug-fix` chosen instead of `chayen-backend` (observation) |
| T14 | Codex discovery | `codex exec` "list skills" with personal skills disabled per run | PASS: 6 `codejadee-chayen-framework:chayen-*` listed |
| T15 | Codex routing | `node tests/routing/run-smoke.mjs --provider codex … -- -c "skills.config=[…]"` | Attempt 1 FAIL (HTTP 503 provider outage, no data). Attempt 2 **PASS 7/7**. |
| T16 | Codex disabled via `-c` override | `-c 'plugins."…".enabled=false'` | FAIL: the skill was still loaded (the override is ineffective) |
| T17 | Codex disabled via `config.toml` | `enabled = false` | PASS 1/1 |
| T18 | Codex real-home restoration | `codex plugin remove` + `marketplace remove` + hash compare | PASS: `config.toml` hash identical. An empty cache dir was left behind and removed. |
| T19 | Test 9 (app code unchanged), first attempt | fixture under the long scratch path | INVALID: git "Filename too long" broke the setup; installs ran with an empty path and failed harmlessly. Redone with `core.longpaths`: PASS (identical tree hash, `git status` clean). |
| T20 | Static validation after changes | `node tools/validate/validate-package.mjs`; `generate-claude-evals.mjs --check` | PASS: 0 errors, 0 warnings. Cases up to date. |
| — | Claude Code VS Code, Copilot VS Code | Manual procedures | NOT TESTED |
| — | Remote GitHub marketplace install | Needs a push | NOT TESTED |
| — | Statistical baseline (≥3 runs, no-plugin arm) | — | NOT TESTED |

---

## Step 07 — Engineering capability catalog

- **Date:** 2026-10-14
- **Status:** DONE (pending user review). The catalog content is PROPOSED.
- **Guide:** [CAPABILITY_COVERAGE.md](CAPABILITY_COVERAGE.md)

### Work performed

- **Read first:** BUILD_CONTRACT and ARCHITECTURE (C-03, C-04, §8 budgets),
  DECISIONS, ACCEPTANCE_MATRIX, ISSUES, ADR-0004, and all six pilot skills
  and their 16 references, to determine existing coverage.
- **Recorded the user's inventory verbatim** as 206 records in 20 domains.
  - Each record has: ID, exact name, domain, purpose, positive and negative
    triggers, inputs, outputs, stacks, entry-skill mapping, recipe mapping,
    verification approach, and status.
  - No name was renamed or omitted, and inventory order is kept.
- **Format:** one restricted-YAML file, as the user specified (D-021). This
  replaces the JSON layout in ARCHITECTURE C-03; amendment notes were added
  to ARCHITECTURE and PLUGIN_PACKAGE_DESIGN.
- **Mapping** (CAPABILITY_COVERAGE §5–§7):
  - a proposed 14-skill entry set (D-023), awaiting the Q-10 decision;
  - 56 consolidation groups that share recipes while keeping identities,
    and 61 symmetric cross-recipe overlaps (D-024);
  - pilot boundary changes needed later are listed, not made.
- **Status:**
  - 31 IN_PROGRESS, where pilot content already addresses the capability
    (with evidence paths);
  - 175 PLANNED;
  - 0 IMPLEMENTED and 0 VERIFIED (D-022).
- **Scope:** no recipe or skill was implemented, and the plugin is
  unchanged.
- **Wrote the checker:** `tools/catalog/check-catalog.mjs` (V-11, zero
  dependencies), the reproducible count and uniqueness check. It also
  generates the tables in CAPABILITY_COVERAGE.md and detects when they go
  stale.

### File ledger

| Action | Path |
|---|---|
| Created | `catalog/engineering-capabilities.yaml` |
| Created | `docs/chayen/CAPABILITY_COVERAGE.md` |
| Created | `tools/catalog/check-catalog.mjs`, `tools/catalog/README.md` |
| Modified | `docs/chayen/PROGRESS.md`, `ACCEPTANCE_MATRIX.md` (GOV-15, REQ-05, STK-01..14 evidence, ARC-03, ARC-12, 20 CAP domain rows), `DECISIONS.md` (D-021..D-024), `ISSUES.md` (Q-01 resolved for the inventory, Q-10 updated, Q-11, R-27..R-29), `IMPLEMENTATION_PLAN.md` (Step 07 row, details, numbering note), `ARCHITECTURE.md` and `PLUGIN_PACKAGE_DESIGN.md` (Step 07 amendment notes only) |
| Deleted | None |
| Not changed | `plugins/` (no skill, reference, or manifest edits), `tests/`, `.vscode/` |

Scratch only, outside the repository: the catalog was assembled from
per-domain parts, and a throwaway Python venv was created with PyYAML for
T3. No dependency was added to the repository.

### Tests

| # | Test | Command | Result |
|---|---|---|---|
| T1 | Count, uniqueness, inventory identity, mappings, and doc sync | `node tools/catalog/check-catalog.mjs` | **PASS:** 0 errors, 0 warnings. 20 domains, 206 capabilities, 206 unique ids, 206 unique names. Per domain: D01=9 D02=10 D03=10 D04=8 D05=12 D06=10 D07=10 D08=8 D09=12 D10=14 D11=14 D12=10 D13=12 D14=10 D15=10 D16=10 D17=10 D18=10 D19=9 D20=8. Status: IN_PROGRESS=31, PLANNED=175. Inventory fingerprint `2f13cad24ff431e3` equals the catalog fingerprint. |
| T2 | Negative controls: 18 mutated catalog copies (omit one, duplicate name, rename, COMPLETED, IN_PROGRESS without evidence, wrong recipe mapping, asymmetric overlap, IMPLEMENTED without evidence, 15 skills, placeholder, Chayen in a trigger, duplicate id, domain title, stale doc, recipe outside skill, unquoted colon, group mismatch, bad trigger reference) | scratch `mutate.mjs` → `check-catalog.mjs --file <mutant>` | **PASS: 18/18 rejected** (exit 1, each with the expected check ID). The first run did not apply M16 (wrong search string in the mutation script). It was corrected and re-run: rejected by V-11.1. |
| T3 | Independent YAML parse | PyYAML 6.0.3 `safe_load` compared with `check-catalog.mjs --dump-json` | **PASS:** identical data. PyYAML also counts 206 records, 206 unique ids, 206 unique names. |
| T4 | Plugin package unchanged and valid | `node tools/validate/validate-package.mjs` | PASS: 0 errors, 0 warnings. L0 2332/4000. |
| T5 | Eval cases still in sync | `node tools/evals/generate-claude-evals.mjs --check` | PASS: 48 cases, 110 files up to date |
| — | Trigger evals for the catalog's positive and negative prompts | — | NOT_RUN. They were not requested in this step, and each run is billed. |
| — | Capability behaviour evals (fixture repositories) | — | NOT_RUN. No fixtures exist yet (POC_REPORT §6). |
| — | User review of catalog content | — | Pending (R-29) |

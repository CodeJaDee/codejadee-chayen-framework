# Progress Log

> Phase 2 scope correction (2026-10-18): Nitro and Elysia are out of scope.
> Earlier pilot references below are historical evidence, not current support
> claims. Dedicated guidance was withdrawn; no technology pack was added.

## Current state

| Field | Value |
|---|---|
| Last executed step | 41 — Documentation and release readiness (Steps 37–40 recorded below; Step 40 committed as `e921df1`) |
| Owner follow-up D-059 | DONE (2026-10-17): plugin identifier renamed `codejadee-chayen-framework` → `chayen` (owner: rename the plugin, not the repository). Claude Code skills now `/chayen:<skill>`, install `chayen@codejadee`; repository, URLs, marketplace name, plugin directory, skill names and version unchanged. validate-all 13/13, identity 15/15, `claude plugin validate --strict` plugin + marketplace PASS. Host install and migration NOT_RUN. |
| Step 41 status | DONE (pending Product Owner approval): user, install and release documents updated for 15 skills; new writing guide; A/B/C policy setups separated; upstream MIT licence fetched and byte-identical to the shipped notice; version `0.1.0-rc.1` proposed (D-058) and not applied; DF-06/DF-07 resolved; offline gates PASS. Recommendation NO-GO public / CONDITIONAL GO internal pilot. No provider call, user configuration change, commit or release. |
| Step 40 status | PARTIAL (pending owner review; D-057 PROPOSED): offline evidence only. validate-all 13/13 groups PASS (new G-17: 120-case dataset and 52 probes valid, 56/56 scorer controls); engineering skills, manifests, marketplaces and catalogs byte-identical to baseline `1106226`; provider matrix for six surfaces with no VERIFIED cell. Discovery, policy arms A/B/C, language quality, host lifecycle and human review NOT_RUN (not authorized / no reviewer; R-61). No commit; Step 41 not started. |
| Step 39 status | DONE (pending owner review; D-056 PROPOSED, ADR-0010 A + B accepted by instruction, inferred): canonical policy and Copilot template outside the package, user guide, host research with a documented-versus-tested matrix, read-only setup helper; validate-all 12/12 groups PASS (179/179 self-tests incl. 14 response-style controls; G-16T 19/19 fixtures). Host loading, behavior, lifecycle and plugin-uninstall tests NOT_RUN (R-60). No user or repository instruction file changed. |
| Step 36 status | DONE (pending owner review): registration/validation foundation approved by D-053; validate-all PASS (150/150 validator tests, 34/34 security tests), evaluation static/traceability PASS, 130 governance links/anchors PASS. 13 shipped engineering Skills and two planned editorial registrations; projected metadata 5,940 / 6,500. Maximum 15 per latest Step 36 request. Initial BLOCKED preflight preserved as history; no Humanizer body shipped. |
| Latest owner follow-up | D-052 ACCEPTED (2026-10-17): L0 ceiling 6,500, implemented in V-07 and evaluation reporting. Current 5,485 / 6,500; 1,015 free. Count ceiling remains 25, target 15, actual 13. Editorial registry/policy proposals remain pending; Step 36 NOT_STARTED. Earlier D-051 budget statements below are historical. |
| Owner follow-up | D-051 ACCEPTED (2026-10-17): increase Entry Skill ceiling to 25, implemented in the package and catalog count validators. Actual 13; target 15; L0 remains 5,500. The original Step 35 evidence below is a historical snapshot; follow-up evidence is logged separately at the end. Step 36 remains NOT_STARTED. |
| Step 35 status | DONE for governance (pending Product Owner review): impact analysis, ADR-0009–ADR-0011 PROPOSED, MHR-001–MHR-012 PLANNED, Steps 35–41 planned. D-047 scope ACCEPTED; D-048–D-050 mechanisms PROPOSED. Read-only structural/documentation checks recorded in Step 35 below; no Skills, host integration, configuration, catalog, validator or manifest change. |
| Step 34 status | DONE: audit complete. Recommendation NO-GO public / CONDITIONAL-GO internal pilot. All 26 automated runs exit 0 (facts 107/0/52); independent audit clean; Step 32 records reproduced 30/30; Run C 9/13; pooled automatic routing 12/22, no-match 12/12. EX-01..EX-07 VERIFIED; charter criteria 1–2 NOT MET, 3 PARTIAL, 4 MET. Awaiting owner. |
| Step 33 status | DONE (pending review): user docs (README, SECURITY, CHANGELOG, 11 docs/ guides), release metadata, marketplace listing drafts, licence proposal and release checklist in docs/distribution/; G-14 docs gate PASS (18 files, 5/5 negative controls); 9 gate groups PASS. Not released: licence, publisher identity, public URL and security contact pending owner (R-56); version unchanged (R-54). |
| Step 32 status | DONE for the executable scope (pending review): suite over 15 categories and 4 evidence levels; static/traceability PASS (206/206, 108/108, 12/12, 11/11 routing examples); facts 107/0/52; Claude Code probes 31 billed runs, positive routing 14/20, no-match 8/8, precision 14/14, references 8/16, verification evidence 3/10. Copilot/Codex/VS Code/plugin-eval NOT_RUN. Path guard added to 13 skills (D-046). No VERIFIED promotion (R-55). |
| Step 31 status | PARTIAL — static validation complete: manifests, marketplaces, precedence (from the installed provider code of Claude Code 2.1.270/2.1.299, Codex 0.160.1/0.162.0-alpha, Copilot 1.0.97, VS Code 1.141.1 + Copilot 0.69.0), identity and discovery (check-identity 15/15, 13 skills / 221 references), validate-all 8/8 groups, strict validate PASS. Native install/invocation/reference/lifecycle checks NOT_TESTED on every surface (lifecycle opt-in denied by the session permission classifier; R-53). Version unchanged, update risk R-54. Codex IDE extension UNSUPPORTED. Release gate OPEN. |
| Step 30 status | DONE (pending review; 238 package files / 13 entries / 221 references, three marketplaces and 57 developer assets statically reviewed; instruction priority, safe staging/mutations, parser/eval metadata and provider opt-in hardened; V-25 and eight offline gate groups PASS, 32/32 security tests and 132/132 validator tests PASS; 23 JavaScript plus one shell syntax check PASS. Native provider/model/install, advisory and runtime defenses NOT_RUN; R-52 OPEN). |
| Step 29 status | DONE (pending review; 12 workflows and seven reusable template leaves IMPLEMENTED; V-24 PASS; 47 workflow/template evaluation specifications; six automated gate groups and 132/132 validator tests PASS; live agent/provider behavior NOT_RUN, R-51; D-045 layout PROPOSED). |
| Step 28 status | PARTIAL — all 11 packs / 108 capabilities and 17 required technologies audited; 7 gaps fixed; 295 technology specifications; final fact runs 107 PASS / 0 FAIL / 52 NOT_RUN; 5/5 automated gates and 115/115 self-tests PASS. Full frontend/mixed-stack agent scenarios remain NOT_RUN (R-49); maintainer Node 18 declaration conflicts with import.meta.dirname (R-50). See TECHNOLOGY_COVERAGE_AUDIT.md. |
| Step 27 status | DONE (pending review; PostgreSQL 10/10 and cross-stack 8/8 IMPLEMENTED, 0 VERIFIED; V-23 PASS incl. V-23.10 for both recipe files; DR-01..04, PF-01..24, XF-01..14 PASS (42/42) on PostgreSQL 18.6, .NET 10, Node, Chromium; 5/5 gate groups, 115/115 self-tests; D-044 PROPOSED) |
| Step 26 status | DONE (pending review; SQL Server 12/12 IMPLEMENTED, 0 VERIFIED; V-23 PASS incl. V-23.10 data access recipes; DR-01..03 driver references PASS; SF-01..27 PASS on SQL Server 2025 Express LocalDB; 5/5 gate groups, 104/104 self-tests; D-043 layout PROPOSED) |
| Step 23 status | DONE (pending review; 18/18 new capabilities IMPLEMENTED, 0 VERIFIED; V-23 PASS; 5/5 gate groups, 94/94 self-tests; 2 supporting JS checks PASS, 16 NOT_RUN; frontend/backend target warnings at 213/202 lines; D-042 layout PROPOSED) |
| Step 22 status | DONE (pending review; 16/16 new capabilities IMPLEMENTED, 0 VERIFIED; V-23 PASS; 5/5 gate groups, 85/85 self-tests; 3 synthetic boundary checks PASS, 13 NOT_RUN; one 206-line frontend target warning; D-041 layout PROPOSED) |
| Step 21 status | DONE (pending user review; 22/22 new technology capabilities IMPLEMENTED, 0 VERIFIED; V-23 PASS; 8 TS/JS facts PASS, 14 Angular facts NOT_RUN; automated gates 5/5, self-tests 77/77; D-040 layout PROPOSED) |
| Step 20 status | DONE (pending user review; 22/22 technology capabilities IMPLEMENTED, 0 VERIFIED; V-23 PASS; 31/31 .NET framework facts PASS; D-039 PROPOSED) |
| Step 19 status | DONE (pending user review; static audit 206/206 after 9 fixes; 0/206 VERIFIED; see ENGINEERING_COVERAGE_AUDIT.md) |
| Step 18 status | DONE (pending user review; D19 9/9 and D20 8/8 IMPLEMENTED, not VERIFIED; all 206 capabilities IMPLEMENTED, D-038) |
| Step 17 status | DONE (pending user review; D17 10/10 and D18 10/10 IMPLEMENTED, not VERIFIED; chayen-ai-engineering created with the L0 cap raised to 5,500, user-approved, D-037) |
| Step 16 status | DONE (pending user review; D15 10/10 and D16 10/10 IMPLEMENTED, not VERIFIED; chayen-modernization folded and chayen-documentation created with the L0 cap raised to 5,200, user-approved, D-036) |
| Step 15 status | DONE (pending user review; D13 12/12 and D14 10/10 IMPLEMENTED, not VERIFIED; chayen-devops created and L0 cap raised to 4,700 with user approval, D-035) |
| Step 14 status | DONE (pending user review; D11 14/14 and D12 10/10 IMPLEMENTED, not VERIFIED; chayen-performance created and L0 cap raised to 4,400 with user approval, D-034) |
| Step 13 status | DONE (pending user review; D09 12/12 and D10 14/14 IMPLEMENTED, not VERIFIED; chayen-data created with user approval, D-033) |
| Step 12 status | DONE (pending user review; D07 10/10 and D08 8/8 IMPLEMENTED, not VERIFIED; D08 scope D-032 PROPOSED) |
| Step 11 status | DONE (pending user review; D05 12/12 and D06 10/10 IMPLEMENTED, not VERIFIED) |
| Step 10 status | DONE (pending user review; D03 10/10 and D04 8/8 IMPLEMENTED, not VERIFIED) |
| Step 09 status | DONE (pending user review; D01 9/9 and D02 10/10 IMPLEMENTED, not VERIFIED) |
| Step 08 status | DONE (pending user review; standard PROPOSED) |
| Step 07 status | DONE (pending user review; catalog PROPOSED) |
| Step 06 status | DONE (pending user review) |
| Step 05 status | DONE (pending user review) |
| Step 04 status | DONE (pending user review) |
| Step 01 status | DONE (pending user review) |
| Step 02 status | DONE (pending user review; D-009 PROPOSED) |
| Step 03 status | DONE (pending user review; ADR-0003/0004/0006/0007/0008 PROPOSED) |
| Next step | STOP after Step 39 for owner review: confirm D-055 and D-056 (ADR-0010 acceptance is inferred). Step 40 NOT_STARTED and needs a separate instruction, an approved rubric and authorization for any billed provider or host runs. No release authorized. |
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

---

## Step 08 — Skill authoring standard and quality gates

- **Date:** 2026-10-14
- **Status:** DONE (pending user review). The standard and gates are
  PROPOSED (D-025).
- **Documents:** [SKILL_AUTHORING_STANDARD.md](SKILL_AUTHORING_STANDARD.md),
  [SKILL_QUALITY_GATES.md](SKILL_QUALITY_GATES.md)

### Work performed

- **Read first:** BUILD_CONTRACT, the 206-capability catalog, the provider
  skill-format facts (PROVIDER_SPEC_RESEARCH §5), the existing validator,
  and all six pilot skills and their references.
- **Standard.**
  - Portability rules use only the documented frontmatter fields.
  - Description rules.
  - Entry-skill anatomy, covering every requested element: name and
    description, positive and negative triggers, applicability and
    exclusions (a new `**Scope:**` line), preconditions, workflow, outputs
    and verification, failure handling, safety boundaries, and conditional
    reference loading.
  - Conciseness budgets.
  - Reference kinds.
  - Capability recipe anatomy: capability IDs, procedure, inputs and
    outputs, technology considerations, verification, and ≥1 positive and
    ≥1 negative evaluation case.
- **Quality gates G-01..G-15.** Each requested detection is mapped to a
  validator and a negative control. There is a review checklist and the
  promotion rules.
- **Validators** (developer-only, run from this repository, not a CLI):
  - `validate-package.mjs`:
    - strict frontmatter parsing;
    - unsupported fields in skills, references, and the Claude manifest;
    - duplicate names;
    - anchors and unreachable references;
    - V-17 revised;
    - V-18 reference kinds and recipe anatomy;
    - V-19 catalog alignment;
    - V-20 description breadth;
    - V-22 recipe cases.
  - `check-catalog.mjs`: recipes must be `references/*.md` files (D-026).
    The parser moved to `catalog-lib.mjs`.
  - New: `run-validator-tests.mjs` (mutation self-tests) and
    `validate-all.mjs`.
- **Pilots improved** to meet the standard. Descriptions were **not**
  changed, so L0 is still 2,332 characters.
  - All six skills:
    - added the scope gate line;
    - renamed "Inputs" to "Preconditions and inputs";
    - added a "Safety boundaries" section, with approval, untrusted-content,
      and secret rules moved from "Principles" and missing items added;
    - converted References to `Reference | Load when` tables tied to
      workflow steps.
  - 13 references declare `technology` or `checklist`.
  - `task-contract.md` and `change-summary.md` were converted to recipes.
- **Catalog.** 21 capabilities in 6 groups, plus CAP-11-014, were
  re-pointed from `SKILL.md` or checklists to planned recipe files (D-026).
  Statuses are unchanged: 31 IN_PROGRESS and 175 PLANNED. The coverage doc
  was regenerated.
- **Scope:** no remaining capability recipe was implemented.

### File ledger

| Action | Path |
|---|---|
| Created | `docs/chayen/SKILL_AUTHORING_STANDARD.md`, `docs/chayen/SKILL_QUALITY_GATES.md` |
| Created | `tools/catalog/catalog-lib.mjs`, `tools/validate/run-validator-tests.mjs`, `tools/validate/validate-all.mjs` |
| Created | `tests/catalog/README.md`, `tests/catalog/catalog-mutations.json`, `tests/skills/README.md`, `tests/skills/recipe-cases.json`, `tests/skills/validator-mutations.json` |
| Modified | `tools/validate/validate-package.mjs`, `tools/validate/README.md`, `tools/catalog/check-catalog.mjs` (parser extracted; D-026 rule), `tools/catalog/README.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/*/SKILL.md` (6 files; bodies only, frontmatter unchanged) |
| Modified | `plugins/codejadee-chayen-framework/skills/*/references/*.md`: 13 files gained a `kind` frontmatter block. `chayen-implementation/references/task-contract.md` and `change-summary.md` were restructured as recipes. |
| Modified | `catalog/engineering-capabilities.yaml` (27 recipe mappings re-pointed), `docs/chayen/CAPABILITY_COVERAGE.md` (prose and regenerated tables) |
| Modified | `docs/chayen/PROGRESS.md`, `ACCEPTANCE_MATRIX.md` (GOV-16, GOV-17, Step 08 evidence), `DECISIONS.md` (D-025, D-026), `ISSUES.md` (R-24 note, R-30, R-31), `IMPLEMENTATION_PLAN.md`, `ARCHITECTURE.md` and `PLUGIN_PACKAGE_DESIGN.md` (amendment notes) |
| Deleted | None |

Scratch only: `skills-ref` 0.1.1 was installed into the throwaway venv used
in Step 07. A lifecycle work directory was created under the scratchpad.

### Tests

| # | Test | Command | Result |
|---|---|---|---|
| T0 | Pilots against the new standard, before improvements | `node tools/validate/validate-package.mjs` | FAIL as expected: 52 errors (V-17 ×30 across 6 skills, V-18 ×15, V-19 ×6, V-22 ×1). V-05, V-07, V-08, and V-20 already passed. |
| T1 | All package, skill, reference, and catalog-alignment checks, after improvements | `node tools/validate/validate-package.mjs` | **PASS:** 0 errors, 0 warnings. 22 checks. L0 2332/4000. 15 references with valid kinds. 2 recipe files agree with the catalog (5 capabilities). 10 recipe cases. |
| T2 | Validator self-tests | `node tools/validate/run-validator-tests.mjs` | **PASS 52/52:** 2 baselines, 19 catalog controls, and 31 package controls, each failing with the expected check ID. The first run was 51/52: one catalog case's search string matched twice (a test-definition fault, not a missed detection). It was made unique and re-run. |
| T3 | Catalog | `node tools/catalog/check-catalog.mjs` | PASS: 206 records, fingerprint unchanged, doc in sync |
| T4 | Aggregate | `node tools/validate/validate-all.mjs` | PASS: 4/4 gate groups |
| T5 | Claude Code official validator | `claude plugin validate --strict` on the plugin, `skills/`, and the marketplace (2.1.270) | PASS ×3 |
| T6 | Agent Skills reference validator | `agentskills validate <skill>` ×6 (`skills-ref` 0.1.1) | PASS: 6/6 "Valid skill" |
| T7 | Native lifecycle on 3 CLIs (isolated homes, no model calls) | `bash tests/provider-compatibility/run-lifecycle.sh <scratch>/lc8` | **PASS 24/24:** Claude Code 2.1.270, Codex 0.160.1, Copilot 1.0.97. 6 skills discoverable on each. The user's real configs had identical hashes before and after. |
| T8 | Eval cases in sync | `node tools/evals/generate-claude-evals.mjs --check` | PASS: 48 cases |
| — | Trigger evals after the body restructuring, and the scope-line effect on Copilot (R-24, R-31) | — | NOT_RUN: billed runs need approval |
| — | Recipe behaviour evals (`recipe-cases.json`) | — | NOT_RUN: no runner or fixture repositories yet (G-12) |
| — | User review of the standard and gates | — | Pending |

---

## Step 09 — Domains 01 and 02 capabilities

- **Date:** 2026-10-14
- **Status:** DONE (pending user review)
- **Result:** D01 Repository **9/9 IMPLEMENTED**, and D02 Requirements
  **10/10 IMPLEMENTED**. None is VERIFIED; the behaviour and trigger evals
  are NOT_RUN (D-028).

### Work performed

- **Read first:** BUILD_CONTRACT, SKILL_AUTHORING_STANDARD, and the 19
  catalog records (resolved by ID, CAP-01-001..009 and CAP-02-001..010).
- **D01 (reused and improved the pilot, D-027).**
  - `chayen-repository` is now a concise router (152 lines):
    - a new description and scope line covering dependencies, impact,
      history, ownership, debt, and unknowns;
    - evidence labels `found`, `inferred`, and `unknown`;
    - an explicit "never invent ownership, dependencies, business rules"
      principle;
    - read-only and people-related safety boundaries.
  - The "git history forensics" exclusion was replaced by an exclusion of
    git operations that change state.
  - Five recipes:
    - `repository-profile.md` (CAP-01-001, 002, 007; absorbs the pilot
      workflow);
    - `dependency-and-impact.md` (003, 004);
    - `history-and-ownership.md` (005, 006): ownership is only "declared"
      (from `CODEOWNERS`) or "activity" (from git); no `checkout`, `bisect`,
      or `stash` without approval;
    - `technical-debt-inventory.md` (008): no prioritization;
    - `unknowns-and-assumptions.md` (009).
- **D02 (new entry skill `chayen-requirements`,** planned in D-023, because
  no pilot covered requirements).
  - A `requirements-record.md` template keeps four statement types apart:
    confirmed facts (each with a source), assumptions (each with impact and
    a confirmation route), open decisions (each with an owner and options,
    never decided by the agent), and acceptance criteria (each observable,
    with a check method).
  - Five recipes:
    - `elicitation-and-modeling.md` (CAP-02-001, 004, 005): rules from code
      cite `path:line`, and contradictions become open decisions;
    - `stories-and-acceptance.md` (002, 003, 008);
    - `scope-and-backlog.md` (007, 010; CAP-04-004 estimation stays
      PLANNED);
    - `nonfunctional-requirements.md` (009);
    - `requirement-traceability.md` (006): no invented links.
- **Catalog:**
  - the 19 records are now IMPLEMENTED, with `existing_coverage` and
    `verification_evidence`;
  - CG-01..CG-06 recipes are marked existing;
  - `chayen-requirements` is marked existing;
  - notes were updated;
  - the coverage doc was regenerated, and its prose updated.
- **Evaluation cases:**
  - 38 recipe cases (1 positive and 1 negative per capability; 48 in
    total);
  - 10 trigger cases (58 in total), with `chayen-requirements` added to the
    skill list;
  - the Claude eval cases were regenerated (58 cases, 134 files).
- **Validators:**
  - V-12 now exempts code spans and fenced blocks, so the debt recipe can
    name `TODO` and `FIXME` markers. A new self-test checks that a
    placeholder in prose is still caught.
  - Six self-test cases were re-targeted, because Step 09 legitimately
    changed the content they mutated. No validator change was needed for
    them.
- **Lifecycle script:** the expected skill count is now derived from the
  skills directory instead of being hard-coded as 6.
- **Scope:** no other domain's recipes were implemented.

### File ledger

| Action | Path |
|---|---|
| Created | `plugins/codejadee-chayen-framework/skills/chayen-repository/references/repository-profile.md`, `dependency-and-impact.md`, `history-and-ownership.md`, `technical-debt-inventory.md`, `unknowns-and-assumptions.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-requirements/SKILL.md` and `references/requirements-record.md`, `elicitation-and-modeling.md`, `stories-and-acceptance.md`, `scope-and-backlog.md`, `nonfunctional-requirements.md`, `requirement-traceability.md` |
| Created | `tests/evals/claude/` (10 new generated case directories) |
| Modified (generated) | `tests/evals/claude/uns-spring-boot/graders/forbidden-skills.md`. The new skill was added to its forbidden-skill pattern. |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-repository/SKILL.md`, `plugins/codejadee-chayen-framework/skills/README.md` |
| Modified | `catalog/engineering-capabilities.yaml`, `docs/chayen/CAPABILITY_COVERAGE.md` |
| Modified | `tests/skills/recipe-cases.json`, `tests/skills/trigger-cases.json` (original formatting kept; additions only), `tests/skills/validator-mutations.json`, `tests/catalog/catalog-mutations.json`, `tests/skills/README.md` |
| Modified | `tools/validate/validate-package.mjs` (V-12 code-span exemption), `tools/validate/README.md`, `tests/provider-compatibility/run-lifecycle.sh` (derived skill count) |
| Modified | `docs/chayen/PROGRESS.md`, `ACCEPTANCE_MATRIX.md` (CAP-D01 and CAP-D02 IMPLEMENTED; REQ-02, REQ-05, ARC-04 evidence), `DECISIONS.md` (D-027, D-028), `ISSUES.md` (Q-10, R-27, R-28 notes; R-32, R-33), `IMPLEMENTATION_PLAN.md`, `SKILL_QUALITY_GATES.md` (G-13 count) |
| Deleted | None |

### Tests

| # | Test | Command | Result |
|---|---|---|---|
| T1 | Package, skills, references, catalog alignment | `node tools/validate/validate-package.mjs` | **PASS:** 0 errors, 0 warnings. 7 skills. L0 2787/4000. Maximum description overlap 0.12. 26 references with valid kinds. 12 recipe files agree with the catalog (24 capabilities). 48 recipe cases. 58 trigger cases. The first run had 4 errors and 1 warning (two Outputs sections were templates only, the trigger cases lacked the new skill, and a 430-character description); all were fixed. |
| T2 | Catalog and coverage | `node tools/catalog/check-catalog.mjs` | **PASS.** IMPLEMENTED=19 (D01=9/9, D02=10/10), IN_PROGRESS=28, PLANNED=159. 206 records, fingerprint unchanged, doc in sync. |
| T3 | All automated gates | `node tools/validate/validate-all.mjs` | **PASS:** 4/4 gate groups. Self-tests 53/53. The first run was 47/53: 6 cases targeted content that Step 09 changed. They were re-targeted, with no validator misses. |
| T4 | Claude Code validator | `claude plugin validate --strict` on the plugin, `skills/`, and the marketplace | PASS ×3 |
| T5 | Agent Skills reference validator | `agentskills validate` ×7 (`skills-ref` 0.1.1) | PASS: 7/7 valid |
| T6 | Native lifecycle (isolated homes, no model calls) | `bash tests/provider-compatibility/run-lifecycle.sh <scratch>/lc9` | **PASS 24/24:** 7 skills discoverable on Claude Code 2.1.270, Codex 0.160.1, and Copilot 1.0.97. The user's real configs were unchanged. |
| T7 | Eval cases in sync | `node tools/evals/generate-claude-evals.mjs --check` | PASS: 58 cases, 134 files |
| — | Trigger evals for the new and changed descriptions | — | NOT_RUN: billed runs need approval (R-32) |
| — | Recipe behaviour evals (38 new cases) | — | NOT_RUN: no runner or fixtures (G-12) |
| — | Human review of the 10 recipes | — | Pending (R-33) |

---

## Step 10 — Domains 03 and 04 capabilities

- **Date:** 2026-10-14
- **Status:** DONE (pending user review)
- **Result:** D03 Architecture **10/10 IMPLEMENTED**, and D04 Planning **8/8
  IMPLEMENTED**. None is VERIFIED; the behaviour and trigger evals are
  NOT_RUN. The catalog total is now 37 IMPLEMENTED, 24 IN_PROGRESS, and 145
  PLANNED.

### Work performed

- **Read first:** BUILD_CONTRACT, SKILL_AUTHORING_STANDARD, and the catalog
  records for CAP-03-001..010 and CAP-04-001..008, with their consolidation
  groups.
- **Mapping decision (D-029).**
  - The catalog placed migration and rollout planning in two planned skills.
    Creating them would exceed the L0 budget.
  - Only `chayen-architecture` was created. It covers design, decisions, and
    technical planning.
  - CAP-04-005, with its group CG-12 (which carries the still-PLANNED
    CAP-15-003 and CAP-15-008), and CAP-04-006 (moved out of CG-13) were
    remapped to it.
- **`chayen-architecture` (new):** principles for evidence-first work,
  preserving approved decisions, keeping proposed separate from approved
  (D-030), using no default pattern, and stating trade-offs explicitly.
  - An `architecture-styles.md` checklist for recognising the current style.
  - Eight recipes:
    - `architecture-review.md` (CAP-03-001, 03-008): checks accepted ADRs
      for drift; fitness tests with NetArchTest/ArchUnitNET,
      dependency-cruiser, Nx, and import-linter;
    - `decision-records.md` (03-002, 03-003, 04-008): option 0 "keep
      current"; ADR status lifecycle; superseding without editing accepted
      ADRs; register with conflict flags;
    - `boundaries-and-domain.md` (03-004, 03-005, 03-006);
    - `sequence-and-dataflow.md` (03-007);
    - `multitenancy.md` (03-009);
    - `resilience.md` (03-010);
    - `migration-strategy.md` (04-005);
    - `rollout-planning.md` (04-006).
- **`chayen-implementation`:** `task-contract.md` gained a Low, Medium, High,
  and Critical risk class scale with the gates required per class, and a
  `Status: proposed | approved by <user>` line. CAP-04-001, 002, 003, and 007
  were promoted.
- **`chayen-requirements`:**
  - `scope-and-backlog.md` gained a sizing step (CAP-04-004). Each size has
    drivers, assumptions, and confidence; spikes replace sizes for
    size-changing unknowns; there are no dates or commitments.
  - The description and scope now include sizing, and exclude delivery
    schedules.
  - Architecture questions now hand off to `chayen-architecture` by name.
- **Catalog:**
  - the 18 records are IMPLEMENTED, with `existing_coverage` and
    `verification_evidence`;
  - CG-07..CG-10 and CG-12 recipes are marked existing;
  - CG-13 no longer includes CAP-04-006;
  - the entry-skill scopes were updated;
  - the neighbouring PLANNED records (CAP-18-009, CAP-19-002, CAP-19-008)
    had their mapping state corrected;
  - the coverage doc was regenerated, and its prose updated.
- **Evaluation cases:**
  - 28 recipe cases, for the 10 D03 capabilities and CAP-04-004, 005, 006,
    008 (76 in total). CAP-04-001, 002, 003, and 007 already had cases from
    Step 08.
  - 9 trigger cases (67 in total), with `chayen-architecture` added to the
    skill list.
  - The Claude eval cases were regenerated (67 cases, 155 files).
- **Self-tests:**
  - Four catalog mutation cases depended on a specific planned recipe that
    this step implemented. Three now target the first planned recipe by
    regex. The stale-doc case now edits the generated doc block directly.
    The validators themselves were unchanged.

### File ledger

| Action | Path |
|---|---|
| Created | `plugins/codejadee-chayen-framework/skills/chayen-architecture/SKILL.md` and `references/architecture-styles.md`, `architecture-review.md`, `decision-records.md`, `boundaries-and-domain.md`, `sequence-and-dataflow.md`, `multitenancy.md`, `resilience.md`, `migration-strategy.md`, `rollout-planning.md` |
| Created | `tests/evals/claude/` (9 new generated case directories) |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-implementation/references/task-contract.md`, `chayen-requirements/SKILL.md`, `chayen-requirements/references/scope-and-backlog.md`, `skills/README.md` |
| Modified | `catalog/engineering-capabilities.yaml`, `docs/chayen/CAPABILITY_COVERAGE.md` |
| Modified | `tests/skills/recipe-cases.json`, `tests/skills/trigger-cases.json` (additions only), `tests/catalog/catalog-mutations.json`, `tests/skills/README.md` |
| Modified (generated) | `tests/evals/claude/*` graders whose forbidden-skill pattern now includes the new skill |
| Modified | `docs/chayen/PROGRESS.md`, `ACCEPTANCE_MATRIX.md` (CAP-D03 and CAP-D04 IMPLEMENTED; REQ-02, REQ-05, ARC-04, ARC-09, ARC-10 evidence), `DECISIONS.md` (D-029, D-030), `ISSUES.md` (Q-10, R-27, R-32 notes), `IMPLEMENTATION_PLAN.md` |
| Deleted | None |

### Tests

| # | Test | Command | Result |
|---|---|---|---|
| T1 | Package, skills, references, catalog alignment | `node tools/validate/validate-package.mjs` | **PASS:** 0 errors, 0 warnings. 8 skills. L0 3226/4000. Maximum overlap 0.12. 35 references with valid kinds. 20 recipe files agree with the catalog (38 capabilities). 76 recipe cases. 67 trigger cases. The first run had 3 errors (one Outputs section was a template only, and the trigger cases lacked the new skill); both were fixed. |
| T2 | Catalog | `node tools/catalog/check-catalog.mjs` | **PASS.** IMPLEMENTED=37 (D01–D04 complete), IN_PROGRESS=24, PLANNED=145. 206 records, fingerprint unchanged, doc in sync. |
| T3 | All automated gates | `node tools/validate/validate-all.mjs` | **PASS:** 4/4 gate groups. Self-tests 53/53. The first run was 49/53: 4 catalog mutation cases targeted a recipe this step implemented. They were made robust, with no validator misses. |
| T4 | Claude Code validator | `claude plugin validate --strict` on the plugin, `skills/`, and the marketplace | PASS ×3 |
| T5 | Agent Skills reference validator | `agentskills validate` ×8 (`skills-ref` 0.1.1) | PASS: 8/8 valid |
| T6 | Native lifecycle (isolated homes, no model calls) | `bash tests/provider-compatibility/run-lifecycle.sh <scratch>/lc10` | **PASS 24/24:** 8 skills discoverable on Claude Code, Codex, and Copilot. The user's real configs were unchanged. |
| T7 | Eval cases in sync | `node tools/evals/generate-claude-evals.mjs --check` | PASS: 67 cases, 155 files |
| — | Trigger evals for `chayen-architecture` and the changed `chayen-requirements` description | — | NOT_RUN: billed runs need approval (R-32) |
| — | Recipe behaviour evals (28 new cases) | — | NOT_RUN: no runner or fixtures (G-12) |
| — | Human review of the 9 new and 3 changed references | — | Pending (R-33) |

---

## Step 11 — Domains 05 and 06 capabilities

- **Date:** 2026-10-14
- **Status:** DONE (pending user review)
- **Result:** D05 Implementation **12/12 IMPLEMENTED**, and D06 Backend
  **10/10 IMPLEMENTED**. None is VERIFIED. The catalog total is 59
  IMPLEMENTED, 19 IN_PROGRESS, and 128 PLANNED.

### Work performed

- **Read first:** BUILD_CONTRACT, the catalog records for CAP-05-001..012
  and CAP-06-001..010 with their groups, and the current implementation and
  backend skills.
- **`chayen-implementation`** (reused and extended, D-031).
  - It is now a router by change type (177 lines). Its old feature workflow
    moved into `feature-delivery.md`.
  - New principles: task-scoped diffs, pure change types, never silently
    replacing dependencies or frameworks, and verification with the real
    toolchain.
  - Ten recipes:
    - `feature-delivery.md` (CAP-05-001, 004);
    - `bug-fix.md` (002): reproduce, root cause, minimal fix, regression
      test before and after, siblings reported;
    - `refactoring.md` (003): characterization tests, no behaviour change;
    - `algorithm-design.md` (005);
    - `concurrency-safety.md` (006): the interleaving written down, with
      fixes at the store for cross-instance races;
    - `error-handling.md` (007);
    - `upgrades.md` (008): release notes cited, the lock file regenerated
      by the tool, no swaps;
    - `configuration-and-flags.md` (009, 010);
    - `contract-codegen.md` (011);
    - `compatibility.md` (012).
- **`chayen-backend`** (reused and extended).
  - It detects the stack first (no ASP.NET default) and loads one
    technology reference, then routes across seven recipes (183 lines). A
    short endpoint-level bug path stays in the skill (D-016).
  - Seven recipes:
    - `api-design.md` (CAP-06-001, 004);
    - `api-endpoints.md` (002, 003): mirrors an existing template endpoint,
      validates with the project's library, checks response conformance;
    - `authn-authz.md` (005): approval-gated, deny-by-default, resource
      checks;
    - `messaging.md` (006, 007): outbox, idempotent consumers,
      dead-lettering;
    - `background-jobs.md` (008): idempotent re-runs, overlap control,
      cancellation;
    - `external-integrations.md` (009): typed clients, timeouts, fakes in
      tests;
    - `idempotency-and-consistency.md` (010).
  - Each recipe's technology table covers ASP.NET Core, Nitro, Nuxt,
    Next.js, Elysia, FastAPI, Django, and Flask, plus SQL Server and
    PostgreSQL.
- **Catalog:**
  - the 22 records are IMPLEMENTED;
  - CG-17 and CAP-05-008 were remapped to `chayen-implementation`, with
    CAP-15-004 and CAP-15-005 still PLANNED;
  - recipe and group mapping states are now derived from file existence;
  - notes and entry-skill scopes were updated;
  - the coverage doc was regenerated, and its prose updated.
  - **Correction:** the coverage doc's recipe-file count was 114 after
    Step 10, but should have been 115 (Step 10's separate
    `rollout-planning.md`). It is now 115: 37 existing and 78 planned.
- **Evaluation cases:**
  - 44 recipe cases (120 in total). The prompts deliberately span ASP.NET
    Core, Nitro, Nuxt, Elysia, FastAPI, and Django.
  - 9 trigger cases (76 in total), including an unsupported Go backend
    case.
  - The Claude eval cases were regenerated (76 cases, 176 files).

### File ledger

| Action | Path |
|---|---|
| Created | `plugins/codejadee-chayen-framework/skills/chayen-implementation/references/feature-delivery.md`, `bug-fix.md`, `refactoring.md`, `algorithm-design.md`, `concurrency-safety.md`, `error-handling.md`, `upgrades.md`, `configuration-and-flags.md`, `contract-codegen.md`, `compatibility.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-backend/references/api-design.md`, `api-endpoints.md`, `authn-authz.md`, `messaging.md`, `background-jobs.md`, `external-integrations.md`, `idempotency-and-consistency.md` |
| Created | `tests/evals/claude/` (9 new generated case directories) |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-implementation/SKILL.md`, `chayen-backend/SKILL.md` (descriptions and bodies), `skills/README.md` |
| Modified | `catalog/engineering-capabilities.yaml`, `docs/chayen/CAPABILITY_COVERAGE.md` |
| Modified | `tests/skills/recipe-cases.json`, `tests/skills/trigger-cases.json` (additions only), `tests/skills/README.md`. No existing generated grader changed, because no new skill was added. |
| Modified | `docs/chayen/PROGRESS.md`, `ACCEPTANCE_MATRIX.md` (CAP-D05 and CAP-D06 IMPLEMENTED; REQ-02, REQ-05, REQ-07, REQ-08, ARC-04 evidence), `DECISIONS.md` (D-031), `ISSUES.md` (Q-10, R-27, R-32 notes), `IMPLEMENTATION_PLAN.md` |
| Deleted | None |

### Tests

| # | Test | Command | Result |
|---|---|---|---|
| T1 | Package, skills, references, catalog alignment | `node tools/validate/validate-package.mjs` | **PASS:** 0 errors, 0 warnings, on the first run. 8 skills. L0 3315/4000. Maximum overlap 0.11. 52 references with valid kinds. 37 recipe files agree with the catalog (60 capabilities). 120 recipe cases. 76 trigger cases. |
| T2 | Catalog | `node tools/catalog/check-catalog.mjs` | **PASS.** IMPLEMENTED=59 (D01–D06 complete), IN_PROGRESS=19, PLANNED=128. 206 records, fingerprint unchanged, doc in sync. |
| T3 | All automated gates | `node tools/validate/validate-all.mjs` | **PASS:** 4/4 gate groups. Self-tests 53/53. |
| T4 | Claude Code validator | `claude plugin validate --strict` on the plugin, `skills/`, and the marketplace | PASS ×3 |
| T5 | Agent Skills reference validator | `agentskills validate` ×8 (`skills-ref` 0.1.1) | PASS: 8/8 valid |
| T6 | Native lifecycle (isolated homes, no model calls) | `bash tests/provider-compatibility/run-lifecycle.sh <scratch>/lc11` | **PASS 24/24:** 8 skills discoverable on Claude Code, Codex, and Copilot. The user's real configs were unchanged. |
| T7 | Eval cases in sync | `node tools/evals/generate-claude-evals.mjs --check` | PASS: 76 cases, 176 files |
| — | Trigger evals for the rewritten implementation and backend descriptions | — | NOT_RUN: billed runs need approval (R-32) |
| — | Recipe behaviour evals (44 new cases) | — | NOT_RUN: no runner or fixtures (G-12) |
| — | Human review of the 17 new recipes | — | Pending (R-33) |

---

## Step 12 — Domains 07 and 08 capabilities

- **Date:** 2026-10-14
- **Status:** DONE (pending user review)
- **Result:** D07 Frontend **10/10 IMPLEMENTED**, and D08 Mobile-Desktop
  **8/8 IMPLEMENTED** for web-technology shells (D-032, PROPOSED). None is
  VERIFIED. The catalog total is 77 IMPLEMENTED, 16 IN_PROGRESS, and 113
  PLANNED.

### Work performed

- **Read first:** BUILD_CONTRACT, the catalog records for CAP-07-001..010
  and CAP-08-001..008 with groups CG-25..CG-28, the `chayen-frontend` skill
  and its three framework references, the authoring standard, the
  validators, and Q-11.
- **Q-11 (D08 scope).** The question was open, and it had to be answered
  before any D08 recipe. The user's prompt asked for all 8 D08
  capabilities, so they were implemented on the Step 07 proposal:
  web-technology shells (PWA, Capacitor or Ionic, Electron, Tauri), with
  native toolkits, including React Native and Flutter, out of scope. This
  is recorded as D-032 PROPOSED. Q-11 is now PARTIALLY RESOLVED, pending
  the user's approval.
- **`chayen-frontend`** (reused and extended, D-032).
  - It is now a router (189 lines). It detects the framework, and the
    shell when present, then loads one framework reference, the
    `app-shells.md` technology reference when a shell is involved, and one
    of 11 recipes. A short UI bug path stays in the skill.
  - New principles: no default framework; reuse the design system, state
    and form libraries, and native plugins; every data-bound or
    permission-gated view has its states; and "recommendation is not
    verification" (claims about rendered or device behaviour are labelled
    verified with a command, "not verified in browser", or "not verified on
    device").
  - Safety additions: ask before new native permissions, signing,
    update-channel, or push-credential changes; never weaken Electron or
    Tauri security defaults; no push server keys, VAPID private keys, or
    certificates in client code.
  - Description rewritten (419 characters): adds PWA, Capacitor, Ionic,
    Electron, and Tauri shells, and excludes React Native and Flutter.
- **Shared references:**
  - `ui-states.md` (checklist): loading, refresh, empty, error, retry,
    permission denied (authorization and device), unauthenticated, not
    found, offline, submitting, success, and partial states, with
    accessibility and a test per state;
  - `app-shells.md` (technology): detection signals, platform constraints,
    commands, and pitfalls for Capacitor, Ionic, Cordova, PWA, Electron,
    and Tauri.
- **Eleven recipes:**
  - `ui-features.md` (CAP-07-001, 003, 004): feature, state placement by
    kind, and forms with server error mapping;
  - `component-architecture.md` (002);
  - `layout-and-design-system.md` (005, 008): existing breakpoints,
    reflow and zoom, tokens, and a design-system gap list;
  - `accessibility.md` (006): WCAG 2.2 AA, axe or lint plus a manual
    review, with no conformance claim from tools alone;
  - `frontend-performance.md` (007): measured baseline, ranked
    improvements, before and after;
  - `internationalization.md` (009): ICU messages, `Intl` formatting,
    right-to-left, and the th-TH Buddhist calendar default as a product
    decision;
  - `frontend-error-handling.md` (010): one central failure mapping, safe
    retries, and boundaries;
  - `hybrid-mobile.md` (CAP-08-001, 002, 006): plugin features with
    fallbacks, deep and universal links for cold and warm starts, and
    lifecycle persistence;
  - `device-permissions-and-push.md` (004, 005): just-in-time permissions
    with denial handling and manifest entries, and end-to-end push with the
    token lifecycle and privacy-safe payloads;
  - `offline-and-mobile-performance.md` (003, 007): offline scope, an
    outbox with idempotency keys, an agreed conflict policy, and device
    measurement;
  - `desktop-packaging.md` (008): the existing packager, secure defaults,
    signing through CI secrets, and a configurable update feed.
- **Review against the records (agent review, D-028).** Every catalog
  output for the 18 records is produced by its recipe's `## Outputs`, and
  each record's verification condition appears in the recipe's
  `## Verification`. One platform fact was executed: `th-TH` formats with
  the Buddhist calendar in Node `Intl` (T8). Other platform facts come from
  the agent's knowledge and are flagged as R-34.
- **Catalog:**
  - the 18 records are IMPLEMENTED, with `verification_evidence`,
    `existing_coverage`, and notes;
  - CG-25, CG-26, and CG-28 are `existing`. CG-27 is `existing` and keeps
    CAP-08-001, 002, and 006. The new CG-57 (`device-permissions-and-push.md`)
    holds CAP-08-004 and 005 (D-032);
  - the entry-skill scope and the D08 header comment cite D-032;
  - the coverage doc was regenerated, and its prose updated (counts, §5.2
    L0, §6.1, §6.2, §7.3, §8, §9).
  - **Correction:** the coverage doc said 148 grouped capabilities. The
    catalog had 147 before and after this step, and the doc now says 147.
- **Evaluation cases:**
  - 44 recipe cases (164 in total): 25 for D07 and 19 for D08. Each of the
    18 capabilities has at least one positive and one negative case. The
    prompts span Angular, React, Next.js, Vue, Nuxt, Vite, Capacitor,
    Ionic, PWA, Electron, and Tauri.
  - 9 trigger cases (85 in total): 5 positive, 1 negative, 1 ambiguous
    (push end to end), and 2 unsupported (Flutter, React Native).
  - The Claude eval cases were regenerated (85 cases, 199 files).

### File ledger

| Action | Path |
|---|---|
| Created | `plugins/codejadee-chayen-framework/skills/chayen-frontend/references/ui-features.md`, `component-architecture.md`, `layout-and-design-system.md`, `accessibility.md`, `frontend-performance.md`, `internationalization.md`, `frontend-error-handling.md`, `hybrid-mobile.md`, `device-permissions-and-push.md`, `offline-and-mobile-performance.md`, `desktop-packaging.md`, `app-shells.md`, `ui-states.md` |
| Created | `tests/evals/claude/` (9 new generated case directories) |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-frontend/SKILL.md` (description and body), `skills/README.md` |
| Modified | `catalog/engineering-capabilities.yaml`, `docs/chayen/CAPABILITY_COVERAGE.md` |
| Modified | `tests/skills/recipe-cases.json`, `tests/skills/trigger-cases.json` (additions only), `tests/skills/README.md`. Existing generated eval files have no content change (regenerated; line endings only, see DF-01). |
| Modified | `docs/chayen/PROGRESS.md`, `ACCEPTANCE_MATRIX.md` (CAP-D07 and CAP-D08 IMPLEMENTED; REQ-02, REQ-05, REQ-07, REQ-08, ARC-04 evidence), `DECISIONS.md` (D-032), `ISSUES.md` (Q-10, Q-11, R-27, R-28, R-32, R-33 notes; new R-34, DF-01, DF-02), `IMPLEMENTATION_PLAN.md` |
| Deleted | None |
| Scratch only (not in the repository) | `skills-ref` 0.1.1 virtual environment, lifecycle work directory `lc12`, and the catalog and case edit scripts |

### Tests

| # | Test | Command | Result |
|---|---|---|---|
| T1 | Package, skills, references, catalog alignment | `node tools/validate/validate-package.mjs` | **PASS:** 0 errors, 0 warnings. 8 skills. L0 3349/4000. Maximum overlap 0.11. 65 references with valid kinds. 48 recipe files agree with the catalog (78 capabilities). 164 recipe cases. 85 trigger cases. The first run, before the catalog and cases were updated, had 54 errors: expected mapping and case gaps, plus one real V-08 error (a 3-hop link chain through `hybrid-mobile.md`), fixed by removing that link. |
| T2 | Catalog | `node tools/catalog/check-catalog.mjs` | **PASS.** IMPLEMENTED=77 (D01–D08 complete), IN_PROGRESS=16, PLANNED=113. 206 records, 57 groups, fingerprint unchanged, doc in sync (after `--write-doc`). |
| T3 | All automated gates | `node tools/validate/validate-all.mjs` | **PASS:** 4/4 gate groups. Self-tests 53/53. |
| T4 | Claude Code validator (2.1.220) | `claude plugin validate --strict` on the plugin, `skills/`, and the marketplace | Plugin **PASS**, marketplace **PASS**. `skills/` **FAIL**: "No manifest found in directory". This CLI version accepts only manifest directories, and the result does not depend on skill content (DF-02). |
| T5 | Agent Skills reference validator | `agentskills validate` ×8 (`skills-ref` 0.1.1, scratch venv) | PASS: 8/8 valid |
| T6 | Native lifecycle (isolated homes, no model calls) | `bash tests/provider-compatibility/run-lifecycle.sh <scratch>/lc12` | **PASS 24/24:** 8 skills discoverable on Claude Code 2.1.220, Codex 0.162.1, and Copilot CLI 1.0.89. The fixture stayed unchanged and clean. |
| T7 | Eval cases in sync | `node tools/evals/generate-claude-evals.mjs --check` | PASS: 85 cases, 199 files. Before regeneration, a CRLF checkout of the committed files reported 176 problems (line endings only, DF-01). |
| T8 | Locale fact used in `internationalization.md` | `node -e` formatting a date with `Intl.DateTimeFormat("th-TH")` and `"th-TH-u-ca-gregory"` | PASS: `14/10/2569`, `14/10/2026`, calendar `buddhist` |
| — | Trigger evals for the rewritten frontend description | — | NOT_RUN: billed runs need approval (R-32) |
| — | Recipe behaviour evals (44 new cases) | — | NOT_RUN: no runner or fixtures (G-12) |
| — | Browser, device, or platform builds (Capacitor, Electron, Tauri) | — | NOT_RUN: no fixture apps; the recipes require these to be reported per run |
| — | Human review of the 11 new recipes and 2 references | — | Pending (R-33, R-34) |

---

## Step 13 — Domains 09 and 10 capabilities

- **Date:** 2026-10-14
- **Status:** DONE (pending user review)
- **Result:** D09 Database and Data **12/12 IMPLEMENTED** in the new
  `chayen-data` skill, and D10 Testing and QA **14/14 IMPLEMENTED** in
  `chayen-testing`. None is VERIFIED. The catalog total is 103
  IMPLEMENTED, 10 IN_PROGRESS, and 93 PLANNED.

### Work performed

- **Read first:** BUILD_CONTRACT, the catalog records for CAP-09-001..012
  and CAP-10-001..014 with groups CG-29..CG-36, the `chayen-testing` skill
  and its three stack references, `chayen-backend/references/data-access.md`,
  and Q-10 and R-27.
- **User decision (Q-10).** D09 mapped to the planned `chayen-data` skill,
  and Q-10 and R-27 required approval before any new entry skill. The agent
  asked, offering three options. The user chose "New chayen-data"
  (recommended). Recorded as D-033, APPROVED for the new skill.
- **`chayen-data`** (new, 170 lines). The description is 414 characters.
  - Principles: know the engine before writing SQL; production is
    read-only by default; destructive steps need explicit approval; expand,
    migrate, contract; the database enforces invariants.
  - Workflow: identify the engine (one engine reference), classify the
    target environment (the safety checklist when a command targets a
    non-local database or the change is destructive), then one of 8
    recipes.
  - References:
    - `sql-server.md` and `postgresql.md` (technology): version and
      edition checks, types, locking and online changes, plans, backups,
      commands, and pitfalls;
    - `database-safety.md` (checklist): environment classes, read-only
      practice, the destructive operation gate (statements, impact count,
      verified restore point, rollback path, window), and data handling;
    - eight recipes:
      - `data-modeling.md` (CAP-09-001);
      - `schema-and-data-migration.md` (002, 007, 008): risky-operation
        table, compatibility, down path, batched idempotent data moves with
        reconciliation, and backfill ordering;
      - `query-performance.md` (003, 004);
      - `transactions.md` (005): control per invariant, isolation, retries,
        and a concurrent test against the real engine;
      - `data-quality-and-integrity.md` (006, 010);
      - `etl-pipelines.md` (009);
      - `retention-and-governance.md` (011): periods only from the user's
        policy, dry run first, legal holds, and backups;
      - `backup-restore.md` (012): isolated target, verification per step,
        measured RTO and RPO, and a report template.
- **`chayen-testing`** (reused and extended; router, 159 lines).
  - Description rewritten (378 characters): adds strategy, API and
    contract, property-based, mutation, and fuzz tests, test data, coverage
    gaps, and failure triage.
  - New principles: expected behaviour is not negotiable (no changing
    expectations, snapshots, or assertions, and no skip, retry, or delete to
    get green, unless the user confirms the expectation was wrong), and
    results are observed, never assumed.
  - New workflow step: a baseline run before any change.
  - The Verification section defines PASSED, FAILED, SKIPPED, BLOCKED,
    NOT_RUN, and UNKNOWN.
  - Boundary change: fuzz testing of the user's own code is in scope
    (CAP-10-010). Fuzzing systems the user does not own stays out.
  - Seven recipes:
    - `test-strategy.md` (CAP-10-001);
    - `test-authoring.md` (002, 003, 004, 007): unit, integration with
      real dependencies and isolation, end to end, and regression tests
      observed failing before the fix;
    - `api-and-contract-tests.md` (005, 006);
    - `advanced-test-techniques.md` (008, 009, 010): properties, mutation,
      and fuzzing;
    - `test-data.md` (011);
    - `failing-and-flaky-tests.md` (012, 014): baseline-based triage,
      test versus product defect, and repeated-run flaky diagnosis;
    - `coverage-gaps.md` (013).
- **`chayen-backend`:** one "When not to use" row now sends schema, query,
  migration, backfill, ETL, retention, and restore work to `chayen-data`.
  The description is unchanged.
- **Review against the records (agent review, D-028).** Every catalog
  output for the 26 records is produced by its recipe's `## Outputs`, and
  each record's verification condition appears in the recipe's
  `## Verification`. Engine, version, and tool facts come from the agent's
  knowledge and were not executed (R-34). Two statements were softened
  during review: Flyway undo editions, and the pytest-randomly flags.
- **Catalog:**
  - the 26 records are IMPLEMENTED, with `verification_evidence`,
    `existing_coverage`, and notes (CAP-09-002, 011, CAP-10-001, 006, 010,
    011, 012);
  - the `chayen-data` entry skill is `existing`, and so are its records in
    D18 and D19. CAP-18-006, CAP-19-003 (search), and CAP-19-007 (geospatial) stay PLANNED;
    `retention-and-governance.md` is `existing` for CAP-18-006 too;
  - CG-29..CG-36 are `existing`;
  - the coverage doc was regenerated, and its prose updated (summary, §4,
    §5.1, §5.2 L0, §6.1, §6.2, §7.3, §9).
- **Evaluation cases:**
  - 58 recipe cases (222 in total): 27 for D09 and 31 for D10. Each of the
    26 capabilities has at least one positive and one negative case. They
    include a production read-only case, a missing-Docker case that must be
    reported BLOCKED, and a "just update the snapshots" case.
  - 12 trigger cases (97 in total): 9 positive (5 for `chayen-data`), 1
    ambiguous, and 2 unsupported (MongoDB, MySQL).
  - `chayen-data` was added to the trigger file's skill list.
    `pos-backend-migration-index` was re-categorised from positive to
    ambiguous (either `chayen-backend` or `chayen-data`), keeping its id.
  - The Claude eval cases were regenerated (97 cases, 229 files). Content
    changed in 5 existing case files: 4 `none_or` forbidden-skill graders
    now include `chayen-data`, and the re-categorised case.

### File ledger

| Action | Path |
|---|---|
| Created | `plugins/codejadee-chayen-framework/skills/chayen-data/SKILL.md` and `references/sql-server.md`, `postgresql.md`, `database-safety.md`, `data-modeling.md`, `schema-and-data-migration.md`, `query-performance.md`, `transactions.md`, `data-quality-and-integrity.md`, `etl-pipelines.md`, `retention-and-governance.md`, `backup-restore.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-testing/references/test-strategy.md`, `test-authoring.md`, `api-and-contract-tests.md`, `advanced-test-techniques.md`, `test-data.md`, `failing-and-flaky-tests.md`, `coverage-gaps.md` |
| Created | `tests/evals/claude/` (12 new generated case directories) |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-testing/SKILL.md` (description and body), `chayen-backend/SKILL.md` (one "When not to use" row), `skills/README.md` |
| Modified | `catalog/engineering-capabilities.yaml`, `docs/chayen/CAPABILITY_COVERAGE.md` |
| Modified | `tests/skills/recipe-cases.json` (additions only), `tests/skills/trigger-cases.json` (additions, the skill list, and one re-categorised case), `tests/skills/README.md`, 5 existing generated eval case files (content); the other existing generated files changed only in line endings (DF-01) |
| Modified | `docs/chayen/PROGRESS.md`, `ACCEPTANCE_MATRIX.md` (CAP-D09 and CAP-D10 IMPLEMENTED; REQ-02, REQ-05, REQ-07, REQ-08, REQ-09, ARC-04 evidence), `DECISIONS.md` (D-033), `ISSUES.md` (Q-10, R-27, R-28, R-32, R-33, R-34 notes), `IMPLEMENTATION_PLAN.md` |
| Deleted | None |
| Scratch only (not in the repository) | Lifecycle work directory `lc13`, and the catalog and case edit scripts. The Step 12 `skills-ref` venv was reused. |

### Tests

| # | Test | Command | Result |
|---|---|---|---|
| T1 | Package, skills, references, catalog alignment | `node tools/validate/validate-package.mjs` | **PASS:** 0 errors, 0 warnings. 9 skills. L0 3794/4000. Maximum overlap 0.11. 83 references with valid kinds. 63 recipe files agree with the catalog (104 capabilities, including CAP-18-006 in a recipe file but PLANNED). 222 recipe cases. 97 trigger cases. Earlier runs during the step showed only the expected catalog and case gaps, plus one V-16 error (a positive case naming two skills), fixed by re-categorising that case. |
| T2 | Catalog | `node tools/catalog/check-catalog.mjs` | **PASS.** IMPLEMENTED=103 (D01–D10 complete), IN_PROGRESS=10, PLANNED=93. 206 records, 57 groups, 9 existing entry skills, fingerprint unchanged, doc in sync (after `--write-doc`). |
| T3 | All automated gates | `node tools/validate/validate-all.mjs` | **PASS:** 4/4 gate groups. Self-tests 53/53. |
| T4 | Claude Code validator (2.1.220) | `claude plugin validate --strict` on the plugin and the marketplace | PASS ×2. The `skills/` target was not run again (DF-02). |
| T5 | Agent Skills reference validator | `agentskills validate` ×9 (`skills-ref` 0.1.1, scratch venv) | PASS: 9/9 valid, including `chayen-data` |
| T6 | Native lifecycle (isolated homes, no model calls) | `bash tests/provider-compatibility/run-lifecycle.sh <scratch>/lc13` | **PASS 24/24:** 9 skills discoverable on Claude Code 2.1.220, Codex 0.162.1, and Copilot CLI 1.0.89. The fixture stayed unchanged and clean. |
| T7 | Eval cases in sync | `node tools/evals/generate-claude-evals.mjs --check` (inside validate-all G-11) | PASS: 97 cases, 229 files |
| — | Trigger evals for `chayen-data` and the rewritten testing description | — | NOT_RUN: billed runs need approval (R-32) |
| — | Recipe behaviour evals (58 new cases) | — | NOT_RUN: no runner or fixtures (G-12) |
| — | Any database, migration, mutation, or fuzz run described by the recipes | — | NOT_RUN: no fixture repositories or databases in this step |
| — | Human review of the new skill, 15 recipes, and 3 references | — | Pending (R-33, R-34) |

---

## Step 14 — Domains 11 and 12 capabilities

- **Date:** 2026-10-14
- **Status:** DONE (pending user review)
- **Result:** D11 Security and Privacy **14/14 IMPLEMENTED** in
  `chayen-security`, and D12 Performance **10/10 IMPLEMENTED** in the new
  `chayen-performance` skill. None is VERIFIED. The catalog total is 127
  IMPLEMENTED, 1 IN_PROGRESS, and 78 PLANNED.

### Work performed

- **Read first:** BUILD_CONTRACT, the catalog records for CAP-11-001..014
  and CAP-12-001..010 with groups CG-37..CG-43, the `chayen-security` skill
  and its two checklists, and Q-10 and R-27.
- **User decision (Q-10, R-27).** D12 was mapped to the planned
  `chayen-performance`, but only 206 L0 characters remained. The agent
  asked, offering three options. The user chose "New skill, cap to 4,400"
  (recommended). Recorded as D-034, APPROVED for the new skill and the cap.
- **Agent decision (D-034, PROPOSED).** CAP-11-013 (container and IaC
  security review) was mapped to the planned `chayen-devops` (CG-40). The
  user asked for all 14 D11 capabilities, and the record already listed
  `chayen-security` as secondary, so it moved to `chayen-security` as a
  read-only review of files in the repository. CG-40 keeps CAP-13-004 and
  CAP-13-005.
- **L0 cap 4,000 → 4,400:** `tools/validate/validate-package.mjs` (V-07,
  named constant with a D-034 comment), `tools/validate/README.md`,
  `SKILL_AUTHORING_STANDARD.md` (L0 row, DS-05), `ARCHITECTURE.md` (§4 and
  §8), `PLUGIN_PACKAGE_DESIGN.md` (V-07 row), `ADR-0003`, and `ADR-0004`.
- **`chayen-security`** (reused and extended; router, 165 lines).
  - Description rewritten (416 characters): adds threat models, SAST and
    dependency triage, privacy, SBOMs and licences, and Dockerfile and IaC
    review. It keeps injection, XSS, and secrets, because security prompts
    under-triggered in Step 06 (R-23).
  - Scope: read-only review of container and IaC files is in scope. Dynamic
    scanning of live systems, exploits, brute force, and denial of service
    stay out, and scanners run locally on the repository.
  - Advisory statement kept. V-10 flagged a negated sentence ("never claim
    ... that this guidance enforces"), which was reworded.
  - Eight recipes:
    - `threat-modeling.md` (CAP-11-001): data flow with trust boundaries,
      and STRIDE as prompts;
    - `secure-review.md` (002, 006, 007, 008, 009, 011): the general review
      plus authorization matrix, source-to-sink, SSRF and egress,
      cryptography, and logging lenses;
    - `scanner-triage.md` (003, 004): verdicts with evidence, scoped
      suppressions, and advisory actions with reachability;
    - `secret-exposure-response.md` (005): masked findings, rotation first,
      and history rewrite only with approval;
    - `privacy.md` (010): personal-data inventory, advisory and not legal
      advice;
    - `sbom-and-licenses.md` (012): standard generators, transitive
      completeness, and licence flags for review;
    - `infrastructure-security-review.md` (013): Dockerfile, Kubernetes or
      Helm, and Terraform or Bicep checks, with no cluster or cloud access;
    - `vulnerability-remediation.md` (014): a failing local test first,
      the stack's control, a minimal diff, and staged breaking fixes.
- **`chayen-performance`** (new, 151 lines, description 389 characters).
  - Central rule: "no measurement, no claim". Every statement is
    MEASURED, ESTIMATED, or HYPOTHESIS, and static inspection never becomes
    a proven optimization.
  - Safety: no load, stress, or profiling sessions against production,
    shared, or third-party systems without approval, and dumps are handled
    as sensitive data.
  - `runtime-tools.md` (technology): .NET, Node or Bun, Python, and browser
    sections.
  - Five recipes:
    - `baseline-and-profiling.md` (CAP-12-001, 002, 005);
    - `load-testing.md` (003, 004): workload model, thresholds,
      configurable non-production targets, and analysis against targets;
    - `memory-leaks.md` (006);
    - `budgets-and-capacity.md` (007, 008, 010): reproducible arithmetic,
      with assumptions labelled;
    - `caching.md` (009).
- **`chayen-testing`:** the load-testing row in "When not to use" now names
  `chayen-performance`.
- **Review against the records (agent review, D-028).** Every catalog
  output for the 24 records is produced by its recipe's `## Outputs`, and
  each record's verification condition appears in the recipe's
  `## Verification`. One fact was corrected during review (.NET 8 images
  include a non-root user but still start as root unless `USER` is set).
  Tool and platform facts come from agent knowledge and were not executed
  (R-34).
- **Catalog:**
  - the 24 records are IMPLEMENTED, with `verification_evidence`,
    `existing_coverage`, and notes (CAP-11-001, 005, 010, 013, CAP-12-003);
  - `chayen-performance` is an existing entry skill. The `chayen-security`
    and `chayen-devops` scopes cite D-034;
  - CG-37, CG-38, CG-39, CG-41, CG-42, and CG-43 are `existing`. CG-40 lost
    CAP-11-013. `sbom-and-licenses.md` is `existing` for CAP-18-007 too,
    which stays PLANNED;
  - the coverage doc was regenerated, and its prose updated (summary, §4,
    §5.1, §5.2 L0, §6.1, §6.2, §9).
- **Evaluation cases:**
  - 55 recipe cases (277 in total): 32 for D11 and 23 for D12. Each of the
    24 capabilities has at least one positive and one negative case. They
    include a production pen-test request, an unapproved production load
    test, and a request to judge a speed-up by reading code.
  - 10 trigger cases (107 in total): 7 positive (4 for `chayen-performance`),
    1 ambiguous, and 2 unsupported (production pen test, loading a
    competitor's API).
  - `chayen-performance` was added to the skill list, and
    `amb-slow-and-injection` now also accepts it.
  - The Claude eval cases were regenerated (107 cases, 253 files). Content
    changed in 7 existing case files: 5 `none_or` forbidden-skill graders
    now include `chayen-performance`, and the two files of
    `amb-slow-and-injection`.

### File ledger

| Action | Path |
|---|---|
| Created | `plugins/codejadee-chayen-framework/skills/chayen-security/references/threat-modeling.md`, `secure-review.md`, `scanner-triage.md`, `secret-exposure-response.md`, `privacy.md`, `sbom-and-licenses.md`, `infrastructure-security-review.md`, `vulnerability-remediation.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-performance/SKILL.md` and `references/runtime-tools.md`, `baseline-and-profiling.md`, `load-testing.md`, `memory-leaks.md`, `budgets-and-capacity.md`, `caching.md` |
| Created | `tests/evals/claude/` (10 new generated case directories) |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-security/SKILL.md` (description and body), `chayen-testing/SKILL.md` (one "When not to use" row), `skills/README.md` |
| Modified | `tools/validate/validate-package.mjs` (V-07 cap 4,400), `tools/validate/README.md` |
| Modified | `catalog/engineering-capabilities.yaml`, `docs/chayen/CAPABILITY_COVERAGE.md` |
| Modified | `tests/skills/recipe-cases.json` (additions only), `tests/skills/trigger-cases.json` (additions, the skill list, and one widened ambiguous case), `tests/skills/README.md`, 7 existing generated eval case files (content); others changed only in line endings (DF-01) |
| Modified | `docs/chayen/PROGRESS.md`, `ACCEPTANCE_MATRIX.md` (CAP-D11 and CAP-D12 IMPLEMENTED; REQ-02, REQ-05, REQ-07, REQ-08, REQ-09, ARC-04 evidence), `DECISIONS.md` (D-034), `ISSUES.md` (Q-10, R-23, R-27, R-28, R-32, R-33, R-34 notes), `IMPLEMENTATION_PLAN.md`, `SKILL_AUTHORING_STANDARD.md`, `ARCHITECTURE.md`, `PLUGIN_PACKAGE_DESIGN.md`, `ADRS/ADR-0003-no-match-fallback.md`, `ADRS/ADR-0004-skill-catalog-vs-entry-skills.md` (L0 cap text) |
| Deleted | None |
| Scratch only (not in the repository) | Lifecycle work directory `lc14`, and the catalog and case edit scripts. The `skills-ref` venv was reused. |

### Tests

| # | Test | Command | Result |
|---|---|---|---|
| T1 | Package, skills, references, catalog alignment | `node tools/validate/validate-package.mjs` | **PASS:** 0 errors, 0 warnings. 10 skills. L0 4224/4400. Maximum overlap 0.11. 97 references with valid kinds. 76 recipe files agree with the catalog (128 capabilities, including CAP-18-007 in a recipe file but PLANNED). 277 recipe cases. 107 trigger cases. An earlier run in the step had one real V-10 error (a negated enforcement phrase), fixed by rewording. |
| T2 | Catalog | `node tools/catalog/check-catalog.mjs` | **PASS.** IMPLEMENTED=127 (D01–D12 complete), IN_PROGRESS=1, PLANNED=78. 206 records, 57 groups, 10 existing entry skills, fingerprint unchanged, doc in sync (after `--write-doc`). |
| T3 | All automated gates | `node tools/validate/validate-all.mjs` | **PASS:** 4/4 gate groups. Self-tests 53/53 (no self-test depends on the old 4,000 value). |
| T4 | Claude Code validator (2.1.220) | `claude plugin validate --strict` on the plugin and the marketplace | PASS ×2 |
| T5 | Agent Skills reference validator | `agentskills validate` ×10 (`skills-ref` 0.1.1, scratch venv) | PASS: 10/10 valid, including `chayen-performance` |
| T6 | Native lifecycle (isolated homes, no model calls) | `bash tests/provider-compatibility/run-lifecycle.sh <scratch>/lc14` | **PASS 24/24:** 10 skills discoverable on Claude Code 2.1.220, Codex 0.162.1, and Copilot CLI 1.0.89. The fixture stayed unchanged and clean. |
| T7 | Eval cases in sync | `node tools/evals/generate-claude-evals.mjs --check` (inside validate-all G-11) | PASS: 107 cases, 253 files |
| — | Trigger evals for `chayen-performance` and the rewritten security description | — | NOT_RUN: billed runs need approval (R-32) |
| — | Recipe behaviour evals (55 new cases) | — | NOT_RUN: no runner or fixtures (G-12) |
| — | Any scanner, audit, SBOM, profiler, benchmark, or load test described by the recipes | — | NOT_RUN: no fixture repositories in this step; no performance or security claim was measured |
| — | Human review of the new skill, 13 recipes, and 1 reference | — | Pending (R-33, R-34) |

---

## Step 15 — Domains 13 and 14 capabilities

- **Date:** 2026-10-14
- **Status:** DONE (pending user review)
- **Result:** D13 DevOps **12/12 IMPLEMENTED** and D14 Operations and SRE
  **10/10 IMPLEMENTED**, both in the new `chayen-devops` skill. None is
  VERIFIED. The catalog total is 149 IMPLEMENTED, 1 IN_PROGRESS, and 56
  PLANNED.

### Work performed

- **Read first:** BUILD_CONTRACT, the catalog records for CAP-13-001..012
  and CAP-14-001..010 with groups CG-13, CG-40, and CG-44..CG-48, the
  skills whose "When not to use" tables mention infrastructure, and Q-10
  and R-27.
- **User decision (Q-10, R-27).** D13 and D14 mapped to the planned
  `chayen-devops`, which needed about 430 L0 characters while 176
  remained. The agent asked, offering three options. The user chose "New
  skill, cap to 4,700" (recommended). Recorded as D-035, APPROVED for the
  new skill and the cap.
- **L0 cap 4,400 → 4,700:** `tools/validate/validate-package.mjs` (V-07
  constant and comment), `tools/validate/README.md`,
  `SKILL_AUTHORING_STANDARD.md`, `ARCHITECTURE.md` (§4 and §8),
  `PLUGIN_PACKAGE_DESIGN.md`, `ADR-0003`, and `ADR-0004`.
- **`chayen-devops`** (new, 178 lines). The description is 417 characters,
  after trimming from 480 so that L0 fits under the cap.
  - Opening statements: the skill provides engineering workflows and grants
    no access. Deployments, rollbacks, restarts, and infrastructure changes
    run only with the user's approval and the platform's authorization.
  - Principles: change files, not environments; read-only and dry-run
    first; build once and promote the same artifact; least privilege and no
    literal secrets; mitigate first in incidents.
  - Safety boundaries list the commands that are never run without
    authorization (apply and destroy, kubectl apply, delete, and rollout,
    helm upgrade and rollback, publishing, cloud-modifying CLI commands).
  - References:
    - `operations-safety.md` (checklist): local, read-only remote,
      mutating, and destructive command classes, the approval request
      contents, incident conditions, and credential handling;
    - `tooling.md` (technology): GitHub Actions, Azure Pipelines, GitLab
      CI, containers, Terraform and Pulumi, Bicep, Kubernetes and Helm,
      and telemetry;
    - thirteen recipes:
      - `build-systems.md` (CAP-13-001);
      - `pipelines.md` (002, 003);
      - `containers.md` (004, 005);
      - `infrastructure-as-code.md` (006);
      - `environment-parity.md` (007);
      - `secrets-management.md` (008);
      - `releases-and-provenance.md` (009, 012);
      - `release-and-rollout.md` (010, 011);
      - `observability.md` (CAP-14-001..004);
      - `alerting-and-incidents.md` (005, 006);
      - `rca-and-postmortems.md` (007, 008);
      - `disaster-recovery.md` (009);
      - `runbooks.md` (010).
- **Hand-offs:** the "When not to use" rows in `chayen-architecture`,
  `chayen-backend`, `chayen-performance`, and `chayen-security` now name
  `chayen-devops` for infrastructure, pipelines, and cluster work. Their
  descriptions are unchanged.
- **Review against the records (agent review, D-028).** Every catalog
  output for the 22 records is produced by its recipe's `## Outputs`, and
  each record's verification condition appears in the recipe's
  `## Verification`. CI, container, IaC, and telemetry facts come from
  agent knowledge and were not executed (R-34).
- **Catalog:**
  - the 22 records are IMPLEMENTED, with `verification_evidence` and
    `existing_coverage`;
  - `chayen-devops` is an existing entry skill. CAP-15-009, CAP-18-004,
    and CAP-18-008 map to it and stay PLANNED. `release-and-rollout.md` is
    `existing` for CAP-18-008 too;
  - CG-13, CG-40, and CG-44..CG-48 are `existing`;
  - the coverage doc was regenerated, and its prose updated (summary, §4,
    §5.1, §5.2 L0, §6.1, §9).
- **Evaluation cases:**
  - 48 recipe cases (325 in total): 27 for D13 and 21 for D14. Each of the
    22 capabilities has at least one positive and one negative case. They
    include "write the Terraform and apply it to production", "roll back
    production now", and "just restart all the pods", each of which must
    produce an approval request instead of an action.
  - 7 trigger cases (114 in total): 5 positive, 1 ambiguous (Dockerfile
    hardening: devops or security), and 1 negative.
  - `chayen-devops` was added to the skill list. `uns-helm` (fixing a Helm
    chart) is now in scope and moved from unsupported to a `chayen-devops`
    positive, keeping its id.
  - The Claude eval cases were regenerated (114 cases, 271 files). Content
    changed in the 5 `none_or` forbidden-skill graders (now including
    `chayen-devops`) and in `uns-helm`. The generator deleted the
    superseded `uns-helm/graders/no-chayen-skill.md` and created
    `uns-helm/graders/expected-skill.md`.

### File ledger

| Action | Path |
|---|---|
| Created | `plugins/codejadee-chayen-framework/skills/chayen-devops/SKILL.md` and `references/operations-safety.md`, `tooling.md`, `build-systems.md`, `pipelines.md`, `containers.md`, `infrastructure-as-code.md`, `environment-parity.md`, `secrets-management.md`, `releases-and-provenance.md`, `release-and-rollout.md`, `observability.md`, `alerting-and-incidents.md`, `rca-and-postmortems.md`, `disaster-recovery.md`, `runbooks.md` |
| Created | `tests/evals/claude/` (7 new generated case directories), `tests/evals/claude/uns-helm/graders/expected-skill.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-architecture/SKILL.md`, `chayen-backend/SKILL.md`, `chayen-performance/SKILL.md`, `chayen-security/SKILL.md` ("When not to use" rows only), `skills/README.md` |
| Modified | `tools/validate/validate-package.mjs` (V-07 cap 4,700), `tools/validate/README.md` |
| Modified | `catalog/engineering-capabilities.yaml`, `docs/chayen/CAPABILITY_COVERAGE.md` |
| Modified | `tests/skills/recipe-cases.json` (additions only), `tests/skills/trigger-cases.json` (additions, the skill list, and `uns-helm` re-categorised), `tests/skills/README.md`, 6 existing generated eval case files (content); others changed only in line endings (DF-01) |
| Modified | `docs/chayen/PROGRESS.md`, `ACCEPTANCE_MATRIX.md` (CAP-D13 and CAP-D14 IMPLEMENTED; REQ-02, REQ-05, REQ-07, REQ-08, REQ-09, ARC-04 evidence), `DECISIONS.md` (D-035), `ISSUES.md` (Q-10, R-27, R-32, R-33, R-34 notes), `IMPLEMENTATION_PLAN.md`, `SKILL_AUTHORING_STANDARD.md`, `ARCHITECTURE.md`, `PLUGIN_PACKAGE_DESIGN.md`, `ADRS/ADR-0003-no-match-fallback.md`, `ADRS/ADR-0004-skill-catalog-vs-entry-skills.md` |
| Deleted | `tests/evals/claude/uns-helm/graders/no-chayen-skill.md` (generated file, removed by `generate-claude-evals.mjs` after the case changed category) |
| Scratch only (not in the repository) | Lifecycle work directory `lc15`, and the catalog and case edit scripts. The `skills-ref` venv was reused. |

### Tests

| # | Test | Command | Result |
|---|---|---|---|
| T1 | Package, skills, references, catalog alignment | `node tools/validate/validate-package.mjs` | **PASS:** 0 errors, 0 warnings. 11 skills. L0 4654/4700. Maximum overlap 0.11. 112 references with valid kinds. 89 recipe files agree with the catalog (150 capabilities, including CAP-18-008 in a recipe file but PLANNED). 325 recipe cases. 114 trigger cases. |
| T2 | Catalog | `node tools/catalog/check-catalog.mjs` | **PASS.** IMPLEMENTED=149 (D01–D14 complete), IN_PROGRESS=1, PLANNED=56. 206 records, 57 groups, 11 existing entry skills, fingerprint unchanged, doc in sync (after `--write-doc`). |
| T3 | All automated gates | `node tools/validate/validate-all.mjs` | **PASS:** 4/4 gate groups. Self-tests 53/53. |
| T4 | Claude Code validator (2.1.220) | `claude plugin validate --strict` on the plugin and the marketplace | PASS ×2 |
| T5 | Agent Skills reference validator | `agentskills validate` ×11 (`skills-ref` 0.1.1, scratch venv) | PASS: 11/11 valid, including `chayen-devops` |
| T6 | Native lifecycle (isolated homes, no model calls) | `bash tests/provider-compatibility/run-lifecycle.sh <scratch>/lc15` | **PASS 24/24:** 11 skills discoverable on Claude Code 2.1.220, Codex 0.162.1, and Copilot CLI 1.0.89. The fixture stayed unchanged and clean. |
| T7 | Eval cases in sync | `node tools/evals/generate-claude-evals.mjs --check` (inside validate-all G-11) | PASS: 114 cases, 271 files |
| — | Trigger evals for `chayen-devops` | — | NOT_RUN: billed runs need approval (R-32) |
| — | Recipe behaviour evals (48 new cases) | — | NOT_RUN: no runner or fixtures (G-12) |
| — | Any build, pipeline lint, container build, IaC validate or plan, or telemetry check described by the recipes | — | NOT_RUN: no fixture repositories in this step. No deployment, rollback, restart, or infrastructure command was run. |
| — | Human review of the new skill, 13 recipes, and 2 references | — | Pending (R-33, R-34) |

---

## Step 16 — Domains 15 and 16 capabilities

- **Date:** 2026-10-14
- **Status:** DONE (pending user review)
- **Result:** D15 Maintenance and Modernization **10/10 IMPLEMENTED**
  across five existing skills, and D16 Documentation and Collaboration
  **10/10 IMPLEMENTED** in the new `chayen-documentation` skill. None is
  VERIFIED. The catalog total is 169 IMPLEMENTED, 1 IN_PROGRESS, and 36
  PLANNED.

### Work performed

- **Read first:** BUILD_CONTRACT, the catalog records for CAP-15-001..010
  and CAP-16-001..010 with their mappings and groups (CG-12, CG-16, CG-17,
  CG-18, CG-49, CG-50), the recipes to extend, the repository and
  implementation skills, and Q-10 and R-27.
- **User decision (Q-10, R-27).** Two planned skills were involved
  (`chayen-modernization` with 4 records, `chayen-documentation` with 10)
  and 46 L0 characters remained. The agent asked, offering three options.
  The user chose "Fold modernization, new docs skill, cap 5,200"
  (recommended). Recorded as D-036.
- **D15, folded into existing skills:**
  - `chayen-repository`: new `legacy-assessment.md` (CAP-15-001) and
    `technical-debt-prioritization.md` (CAP-15-010, a reproducible score,
    labelled proposed). Description, scope, examples, "When not to use",
    routing, and references updated.
  - `chayen-implementation`: new `dead-code-and-deprecation.md`
    (CAP-15-006, 007: confidence levels with reflection and DI checks,
    removal only behind green builds and tests; deprecation markers,
    Sunset headers, usage measurement, removal criteria).
    `refactoring.md` gained the large refactor plan (CAP-15-002:
    independently releasable steps with characterization tests first,
    checkpoint, and rollback). `upgrades.md` gained framework major
    upgrades one hop at a time (CAP-15-004) and breaking-change analysis
    (CAP-15-005). Description, scope, examples, routing, and references
    updated.
  - `chayen-architecture`: `migration-strategy.md` gained strangler
    replacement (CAP-15-003: facade, routing switch and route back per
    slice, retirement criteria) and modular monolith (CAP-15-008: module
    map, owned tables, fitness test). Routing and reference rows updated;
    description unchanged.
  - `chayen-devops`: new `hotfix.md` (CAP-15-009: branch from the release
    tag, failing test first, minimal fix, version bump, back-merge, and no
    push, remote tag, or release without approval). Routing and reference
    rows added.
- **`chayen-documentation`** (new, 143 lines, description 395 characters).
  - Principles: facts come from the repository; never invent results (test,
    build, or benchmark results only if run in the session or supplied by
    the user); write for the stated audience; actionable, ranked reviews;
    git safety.
  - `fact-checking.md` (checklist): the verified source per statement type,
    the labels (verified, from the user, unverified), and pre-publish
    checks.
  - Six recipes:
    - `project-docs.md` (CAP-16-001, 004, 008): README with every command
      sourced, onboarding guide with labelled setup steps, and a
      knowledge-transfer document separating repository facts from
      owner-supplied statements;
    - `api-docs.md` (002): from the generated OpenAPI document;
    - `architecture-docs.md` (003): Mermaid C4-style views with code
      references;
    - `pull-requests-and-review.md` (005, 006, 007): PR descriptions with
      real evidence only, blocking, should-fix, and nit reviews, and
      comment resolution with re-verification;
    - `release-notes.md` (009): every merged change accounted for, with
      breaking changes first;
    - `git-workflow.md` (010): state first, both intents kept in
      conflicts, and confirmation and a backup ref before rewrites.
- **L0 cap 4,700 → 5,200:** the validator (V-07), `tools/validate/README.md`,
  `SKILL_AUTHORING_STANDARD.md`, `ARCHITECTURE.md`,
  `PLUGIN_PACKAGE_DESIGN.md`, `ADR-0003`, and `ADR-0004`.
- **Review against the records (agent review, D-028).** Every catalog
  output for the 20 records is produced by its recipe's `## Outputs`, and
  each record's verification condition appears in the recipe's
  `## Verification`. Tool facts come from agent knowledge and were not
  executed (R-34).
- **Catalog:**
  - the 20 records are IMPLEMENTED, with `verification_evidence`,
    `existing_coverage`, and notes; stale "still PLANNED" notes on the
    remapped records were replaced;
  - `chayen-modernization` was removed from the entry-skill list, and its
    records were remapped (CG-18 now points at the implementation recipe);
  - `chayen-documentation` is an existing entry skill; CAP-18-001 maps to
    `pull-requests-and-review.md` and stays PLANNED;
  - CG-18, CG-49, and CG-50 are `existing`;
  - the coverage doc was regenerated, and its prose updated (summary, §4,
    §5.1, §5.2 L0, §6.1, §9).
- **Evaluation cases:**
  - 42 recipe cases (367 in total): 20 for D15 and 22 for D16. Each of the
    20 capabilities has at least one positive and one negative case. They
    include "just say all tests pass" in a PR description and a
    force-push to a shared branch.
  - 7 trigger cases (121 in total): 5 positive (4 for
    `chayen-documentation`) and 2 ambiguous (code review, legacy
    assessment).
  - `chayen-documentation` was added to the skill list, and
    `amb-pr-review` and `amb-rules-from-code` now also accept it.
  - The Claude eval cases were regenerated (121 cases, 288 files). Content
    changed in the 5 `none_or` forbidden-skill graders and the graders of
    the 2 widened ambiguous cases.
- **Validator self-test fixture:** the `sk-description-single-exclusion`
  mutation in `tests/skills/validator-mutations.json` used the old
  repository description as its anchor, so G-13 failed (52/53) after the
  description change. The anchor now matches the new description; the
  mutation's intent and expected error are unchanged, and G-13 passes
  53/53.

### File ledger

| Action | Path |
|---|---|
| Created | `plugins/codejadee-chayen-framework/skills/chayen-documentation/SKILL.md` and `references/fact-checking.md`, `project-docs.md`, `api-docs.md`, `architecture-docs.md`, `pull-requests-and-review.md`, `release-notes.md`, `git-workflow.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-repository/references/legacy-assessment.md`, `technical-debt-prioritization.md`; `chayen-implementation/references/dead-code-and-deprecation.md`; `chayen-devops/references/hotfix.md` |
| Created | `tests/evals/claude/` (7 new generated case directories) |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-repository/SKILL.md` and `chayen-implementation/SKILL.md` (descriptions and bodies), `chayen-architecture/SKILL.md` and `chayen-devops/SKILL.md` (routing and reference rows), `chayen-implementation/references/refactoring.md`, `upgrades.md`, `chayen-architecture/references/migration-strategy.md`, `skills/README.md` |
| Modified | `tools/validate/validate-package.mjs` (V-07 cap 5,200), `tools/validate/README.md`, `tests/skills/validator-mutations.json` (one anchor string) |
| Modified | `catalog/engineering-capabilities.yaml`, `docs/chayen/CAPABILITY_COVERAGE.md` |
| Modified | `tests/skills/recipe-cases.json` (additions only), `tests/skills/trigger-cases.json` (additions, the skill list, and two widened ambiguous cases), `tests/skills/README.md`, 7 existing generated eval case files (content); others changed only in line endings (DF-01) |
| Modified | `docs/chayen/PROGRESS.md`, `ACCEPTANCE_MATRIX.md` (CAP-D15 and CAP-D16 IMPLEMENTED; REQ-02, REQ-05, REQ-07, REQ-08, ARC-04 evidence), `DECISIONS.md` (D-036), `ISSUES.md` (Q-10, R-27, R-28, R-32, R-33, R-34 notes), `IMPLEMENTATION_PLAN.md`, `SKILL_AUTHORING_STANDARD.md`, `ARCHITECTURE.md`, `PLUGIN_PACKAGE_DESIGN.md`, `ADRS/ADR-0003-no-match-fallback.md`, `ADRS/ADR-0004-skill-catalog-vs-entry-skills.md` |
| Deleted | None |
| Scratch only (not in the repository) | Lifecycle work directory `lc16`, and the catalog, case, extension, and documentation edit scripts. The `skills-ref` venv was reused. |

### Tests

| # | Test | Command | Result |
|---|---|---|---|
| T1 | Package, skills, references, catalog alignment | `node tools/validate/validate-package.mjs` | **PASS:** 0 errors, 0 warnings. 12 skills. L0 5051/5200. Maximum overlap 0.11. 123 references with valid kinds. 99 recipe files agree with the catalog (170 capabilities, including CAP-18-001 in a recipe file but PLANNED). 367 recipe cases. 121 trigger cases. |
| T2 | Catalog | `node tools/catalog/check-catalog.mjs` | **PASS.** IMPLEMENTED=169 (D01–D16 complete), IN_PROGRESS=1, PLANNED=36. 206 records, 57 groups, 13 entry skills (12 existing, 1 planned), fingerprint unchanged, doc in sync (after `--write-doc`). |
| T3 | All automated gates | `node tools/validate/validate-all.mjs` | First run: **FAIL** G-13 52/53 (`sk-description-single-exclusion` anchor no longer present after the repository description change). After updating the anchor: **PASS** 4/4 gate groups, self-tests 53/53. |
| T4 | Claude Code validator (2.1.220) | `claude plugin validate --strict` on the plugin and the marketplace | PASS ×2 |
| T5 | Agent Skills reference validator | `agentskills validate` ×12 (`skills-ref` 0.1.1, scratch venv) | PASS: 12/12 valid, including `chayen-documentation` |
| T6 | Native lifecycle (isolated homes, no model calls) | `bash tests/provider-compatibility/run-lifecycle.sh <scratch>/lc16` | **PASS 24/24:** 12 skills discoverable on Claude Code 2.1.220, Codex 0.162.1, and Copilot CLI 1.0.89. The fixture stayed unchanged and clean. |
| T7 | Eval cases in sync | `node tools/evals/generate-claude-evals.mjs --check` (inside validate-all G-11) | PASS: 121 cases, 288 files |
| — | Trigger evals for `chayen-documentation` and the rewritten repository and implementation descriptions | — | NOT_RUN: billed runs need approval (R-32) |
| — | Recipe behaviour evals (42 new cases) | — | NOT_RUN: no runner or fixtures (G-12) |
| — | Any build, test, upgrade, git, or doc-generation command described by the recipes | — | NOT_RUN: no fixture repositories in this step |
| — | Human review of the new skill, 11 new or extended recipes, and 1 checklist | — | Pending (R-33, R-34) |

---

## Step 17 — Domains 17 and 18 capabilities

- **Date:** 2026-10-14
- **Status:** DONE (pending user review)
- **Result:** D17 AI, ML, and LLM Engineering **10/10 IMPLEMENTED** in the
  new `chayen-ai-engineering` skill, and D18 Governance and Compliance
  **10/10 IMPLEMENTED** (agent action risk in `chayen-ai-engineering`, the
  other nine in existing skills). None is VERIFIED. The catalog total is
  189 IMPLEMENTED, 0 IN_PROGRESS, and 17 PLANNED (D19 and D20).

### Work performed

- **Read first:** BUILD_CONTRACT, the catalog records for CAP-17-001..010
  and CAP-18-001..010 with their mappings and groups (CG-08, CG-13, CG-14,
  CG-32, CG-39, CG-50..CG-55), the recipes to extend, and Q-10 and R-27.
- **User decision (Q-10, R-27).** `chayen-ai-engineering` needed about 420
  L0 characters while 149 remained. The agent asked, offering three
  options. The user chose "New skill, cap to 5,500" (recommended). Recorded
  as D-037. All 13 mapped entry skills now exist.
- **`chayen-ai-engineering`** (new, 155 lines, description 405 characters).
  - Principles: evidence before claims, data first, untrusted model output
    and retrieved content, recommendations are not authorizations, and
    approval for billed runs, external data transfer, red-team runs, and
    permission changes.
  - `ai-tooling.md` (technology): Python ML, serving, .NET and TypeScript AI,
    vector stores, evaluation tools, telemetry, and agent configuration
    (provider-neutral, citing current provider documentation).
  - Eight recipes:
    - `ml-data.md` (CAP-17-001, 005): readiness with leakage and duplicate
      checks, and drift per feature;
    - `ml-experiments-and-evaluation.md` (002, 003): non-ML baselines, fixed
      splits, and per-class metrics with intervals;
    - `model-serving.md` (004);
    - `rag.md` (006, 007): permission filtering at query time, citations,
      injection handling, and recall at k and MRR or nDCG;
    - `llm-and-agent-evaluation.md` (008): three or more runs per case with
      variance;
    - `llm-safety.md` (009): authorized red-teaming of the user's own app;
    - `llm-observability.md` (010): GenAI spans and redaction;
    - `agent-governance.md` (CAP-18-010): allow, ask, or deny
      recommendations, advisory only.
- **D18 in existing skills:**
  - `chayen-documentation` `pull-requests-and-review.md`: standards
    compliance check (CAP-18-001), citing written rules and never
    certifying compliance;
  - `chayen-implementation` `change-summary.md`: change passport
    (CAP-18-002, with a no-self-approval rule) and evidence audit
    (CAP-18-003, supported, unsupported, or not re-runnable per claim);
  - `chayen-devops`: new `policy-as-code.md` (CAP-18-004, allow and deny
    tests, CI step, no waivers granted by the agent) and go/no-go in
    `release-and-rollout.md` (CAP-18-008, unknown is never met, the decision
    stays with the owner);
  - `chayen-security`: new `access-reviews.md` (CAP-18-005, read-only
    exports, scope line updated) and licence obligations in
    `sbom-and-licenses.md` (CAP-18-007, notices file, not legal advice);
  - `chayen-data` `retention-and-governance.md`: governance check
    (CAP-18-006);
  - `chayen-architecture` `decision-records.md`: waivers and a waiver
    register (CAP-18-009, the approver stays empty until a named person
    approves).
  - Routing and reference rows updated in the six skills; their
    descriptions are unchanged.
- **L0 cap 5,200 → 5,500:** the validator (V-07),
  `tools/validate/README.md`, `SKILL_AUTHORING_STANDARD.md`,
  `ARCHITECTURE.md`, `PLUGIN_PACKAGE_DESIGN.md`, `ADR-0003`, and `ADR-0004`.
- **Review against the records (agent review, D-028).** Every catalog
  output for the 20 records is produced by its recipe's `## Outputs`, and
  each record's verification condition appears in the recipe's
  `## Verification`. Tool and platform facts come from agent knowledge and
  were not executed (R-34).
- **Catalog:**
  - the 20 records are IMPLEMENTED, with `verification_evidence`,
    `existing_coverage`, and notes (CAP-18-001, 002, 003, 005);
  - `chayen-ai-engineering` is an existing entry skill; no entry skill is
    planned;
  - groups whose recipe files now exist are `existing` (including CG-51
    to CG-55); CAP-20-003, 006, and 008 map to existing AI recipe files and
    stay PLANNED;
  - the coverage doc was regenerated, and its prose updated (summary, §4,
    §5.1, §5.2 L0, §6.1, §6.2, §9).
- **Evaluation cases:**
  - 43 recipe cases (410 in total): 21 for D17 and 22 for D18. Each of the
    20 capabilities has at least one positive and one negative case. They
    include shipping a prompt after one run, jailbreaking a competitor's
    chatbot, "mark release 3.2 as approved", and "approve this waiver
    yourself".
  - 7 trigger cases (128 in total): 6 positive (5 for
    `chayen-ai-engineering`) and 1 unsupported.
  - `chayen-ai-engineering` was added to the skill list. The Claude eval
    cases were regenerated (128 cases, 303 files); content changed in the
    `none_or` forbidden-skill graders, which now include
    `chayen-ai-engineering`.
- **Validator self-test fixtures:** after the content changes, G-13 failed
  51/53. `cat-implemented-without-evidence` targeted the last IN_PROGRESS
  record (none remain) and now targets the first PLANNED record;
  `sk-recipe-lists-planned-capability` added CAP-18-003 (now legitimately
  listed) and now targets CAP-20-006 in `agent-governance.md`. Both still
  produce their expected errors, and G-13 passes 53/53.

### File ledger

| Action | Path |
|---|---|
| Created | `plugins/codejadee-chayen-framework/skills/chayen-ai-engineering/SKILL.md` and `references/ai-tooling.md`, `ml-data.md`, `ml-experiments-and-evaluation.md`, `model-serving.md`, `rag.md`, `llm-and-agent-evaluation.md`, `llm-safety.md`, `llm-observability.md`, `agent-governance.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-devops/references/policy-as-code.md`, `chayen-security/references/access-reviews.md` |
| Created | `tests/evals/claude/` (7 new generated case directories) |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-documentation/references/pull-requests-and-review.md`, `chayen-implementation/references/change-summary.md`, `chayen-devops/references/release-and-rollout.md`, `chayen-security/references/sbom-and-licenses.md`, `chayen-data/references/retention-and-governance.md`, `chayen-architecture/references/decision-records.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-documentation/SKILL.md`, `chayen-implementation/SKILL.md`, `chayen-devops/SKILL.md`, `chayen-security/SKILL.md` (scope line and rows), `chayen-data/SKILL.md`, `chayen-architecture/SKILL.md` (routing and reference rows; descriptions unchanged), `skills/README.md` |
| Modified | `tools/validate/validate-package.mjs` (V-07 cap 5,500), `tools/validate/README.md`, `tests/catalog/catalog-mutations.json` and `tests/skills/validator-mutations.json` (one fixture each retargeted) |
| Modified | `catalog/engineering-capabilities.yaml`, `docs/chayen/CAPABILITY_COVERAGE.md` |
| Modified | `tests/skills/recipe-cases.json` (additions only), `tests/skills/trigger-cases.json` (additions and the skill list), `tests/skills/README.md`, 7 existing generated eval case files (content); others changed only in line endings (DF-01) |
| Modified | `docs/chayen/PROGRESS.md`, `ACCEPTANCE_MATRIX.md` (CAP-D17 and CAP-D18 IMPLEMENTED; REQ-02, REQ-05, REQ-08, REQ-09, ARC-04 evidence), `DECISIONS.md` (D-037), `ISSUES.md` (Q-10, R-27, R-28, R-32, R-33, R-34 notes), `IMPLEMENTATION_PLAN.md`, `SKILL_AUTHORING_STANDARD.md`, `ARCHITECTURE.md`, `PLUGIN_PACKAGE_DESIGN.md`, `ADRS/ADR-0003-no-match-fallback.md`, `ADRS/ADR-0004-skill-catalog-vs-entry-skills.md` |
| Deleted | None |
| Scratch only (not in the repository) | Lifecycle work directory `lc17`, and the catalog, case, extension, mutation, and documentation edit scripts. The `skills-ref` venv was reused. |

### Tests

| # | Test | Command | Result |
|---|---|---|---|
| T1 | Package, skills, references, catalog alignment | `node tools/validate/validate-package.mjs` | **PASS:** 0 errors, 0 warnings. 13 skills. L0 5477/5500. Maximum overlap 0.11. 134 references with valid kinds. 109 recipe files agree with the catalog (189 capabilities). 410 recipe cases. 128 trigger cases. |
| T2 | Catalog | `node tools/catalog/check-catalog.mjs` | **PASS.** IMPLEMENTED=189 (D01–D18 complete), IN_PROGRESS=0, PLANNED=17. 206 records, 57 groups, 13 entry skills (all existing), fingerprint unchanged, doc in sync (after `--write-doc`). |
| T3 | All automated gates | `node tools/validate/validate-all.mjs` | First run: **FAIL** G-13 51/53 (two fixtures no longer applicable after the content changes). After retargeting both: **PASS** 4/4 gate groups, self-tests 53/53. |
| T4 | Claude Code validator (2.1.220) | `claude plugin validate --strict` on the plugin and the marketplace | PASS ×2 |
| T5 | Agent Skills reference validator | `agentskills validate` ×13 (`skills-ref` 0.1.1, scratch venv) | PASS: 13/13 valid, including `chayen-ai-engineering` |
| T6 | Native lifecycle (isolated homes, no model calls) | `bash tests/provider-compatibility/run-lifecycle.sh <scratch>/lc17` | **PASS 24/24:** 13 skills discoverable on Claude Code 2.1.220, Codex 0.162.1, and Copilot CLI 1.0.89. The fixture stayed unchanged and clean. |
| T7 | Eval cases in sync | `node tools/evals/generate-claude-evals.mjs --check` (inside validate-all G-11) | PASS: 128 cases, 303 files |
| — | Trigger evals for `chayen-ai-engineering` | — | NOT_RUN: billed runs need approval (R-32) |
| — | Recipe behaviour evals (43 new cases) | — | NOT_RUN: no runner or fixtures (G-12) |
| — | Any ML training, evaluation, red-team run, policy test, or access export analysis described by the recipes | — | NOT_RUN: no fixture repositories in this step; no model or billed API was called |
| — | Human review of the new skill, 10 new recipes, 6 extended recipes, and 1 reference | — | Pending (R-33, R-34) |

---

## Step 18 — Domains 19 and 20 capabilities

- **Date:** 2026-10-14
- **Status:** DONE (pending user review)
- **Result:** D19 Specialized Systems **9/9 IMPLEMENTED** and D20 AI Agent
  and Skills Engineering **8/8 IMPLEMENTED**, all in existing skills. The
  catalog total is **206 IMPLEMENTED** (all), 0 IN_PROGRESS, 0 PLANNED, and
  0 VERIFIED.

### Work performed

- **Read first:** BUILD_CONTRACT, the catalog records for CAP-19-001..009
  and CAP-20-001..008 with their mappings and groups (CG-10, CG-20, CG-23,
  CG-24, CG-54, CG-55, CG-56), and the recipes to extend.
- **No skill or cap decision was needed:** all records already mapped to
  existing skills.
- **D19:**
  - new `chayen-architecture/references/realtime-systems.md` (CAP-19-002):
    transport choice, backplane or sticky sessions, per-message
    authorization, reconnection with missed-message recovery;
  - new `chayen-data/references/search-and-indexing.md` (CAP-19-003):
    availability checks before choosing database full-text or a search
    engine, relevance test queries, index sync;
  - new `chayen-data/references/geospatial.md` (CAP-19-007): PostGIS or SQL
    Server spatial support inspected, geography for metres, coordinate
    order tested;
  - new `chayen-backend/references/file-processing.md` (CAP-19-004): size
    limits at the edge, streaming to storage, per-row error reports,
    idempotent reprocessing, scanner gaps reported;
  - new `chayen-frontend/references/browser-extensions.md` (CAP-19-009):
    Manifest V3, minimal permissions, validated messaging;
  - extended `api-design.md` (GraphQL, CAP-19-001), `external-integrations.md`
    (webhooks, CAP-19-005), `idempotency-and-consistency.md` (ledgers,
    CAP-19-006), and `resilience.md` (multi-region, CAP-19-008).
- **D20 in `chayen-ai-engineering`:**
  - new `agent-skills.md` (CAP-20-001, 002, 004): authoring with
    provider formats cited, review including untrusted third-party skills,
    and version migration;
  - new `provider-compatibility.md` (CAP-20-005): matrix cells backed by a
    source or test, isolated configuration homes;
  - new `session-handoff.md` (CAP-20-007): settled decisions, state from
    the repository, no secrets, approvals not extended, receiver verifies;
  - extended `llm-and-agent-evaluation.md` (skill testing CAP-20-003 and
    benchmarking CAP-20-008) and `agent-governance.md` (instruction
    conflicts CAP-20-006).
- **Skills updated:** routing and reference rows in backend, architecture,
  data, frontend, and AI engineering. The `chayen-frontend` description,
  scope line, and table now name browser extensions; the
  `chayen-ai-engineering` description, scope line, examples, and table now
  cover agent skills. Both descriptions were shortened elsewhere (frontend
  420 characters and 24 items, AI 412 characters) after a first run showed
  two warnings.
- **Review against the records (agent review, D-028).** Every catalog
  output for the 17 records is produced by its recipe's `## Outputs`, and
  each record's verification condition appears in the recipe's
  `## Verification`. Library and platform facts come from agent knowledge
  and were not executed (R-34).
- **Catalog:** the 17 records are IMPLEMENTED; all groups and recipe paths
  are `existing`; the coverage doc was regenerated and its prose updated,
  including stale "PLANNED" notes in the §5.1 skill table.
- **Evaluation cases:**
  - 35 recipe cases (445 in total): 18 for D19 and 17 for D20, including an
    untrusted third-party skill review.
  - 7 trigger cases (135 in total): 5 positive, 1 ambiguous (realtime), and
    1 unsupported (VS Code extension).
  - The Claude eval cases were regenerated (135 cases, 322 files).
- **Validator self-test fixtures:** with no PLANNED record or planned recipe
  left, seven negative controls stopped applying (G-13 46/53). They were
  retargeted to create the same faulty states from IMPLEMENTED records or
  existing recipes, each still producing exactly its expected error
  (`cat-status-completed`, `cat-in-progress-without-evidence`,
  `cat-implemented-without-evidence`, `cat-recipe-marked-existing-but-missing`,
  `cat-recipe-is-skill-md`, `cat-recipe-outside-skill`,
  `sk-recipe-lists-planned-capability`). G-13 passes 53/53.

### File ledger

| Action | Path |
|---|---|
| Created | `plugins/codejadee-chayen-framework/skills/chayen-architecture/references/realtime-systems.md`, `chayen-data/references/search-and-indexing.md`, `geospatial.md`, `chayen-backend/references/file-processing.md`, `chayen-frontend/references/browser-extensions.md`, `chayen-ai-engineering/references/agent-skills.md`, `provider-compatibility.md`, `session-handoff.md` |
| Created | `tests/evals/claude/` (7 new generated case directories) |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-backend/references/api-design.md`, `external-integrations.md`, `idempotency-and-consistency.md`, `chayen-architecture/references/resilience.md`, `chayen-ai-engineering/references/llm-and-agent-evaluation.md`, `agent-governance.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-frontend/SKILL.md` and `chayen-ai-engineering/SKILL.md` (descriptions and bodies), `chayen-backend/SKILL.md`, `chayen-architecture/SKILL.md`, `chayen-data/SKILL.md` (routing and reference rows), `skills/README.md` |
| Modified | `tests/catalog/catalog-mutations.json` (six fixtures retargeted), `tests/skills/validator-mutations.json` (one fixture retargeted) |
| Modified | `catalog/engineering-capabilities.yaml`, `docs/chayen/CAPABILITY_COVERAGE.md` |
| Modified | `tests/skills/recipe-cases.json` (additions only), `tests/skills/trigger-cases.json` (additions only), `tests/skills/README.md`; existing generated eval files changed only in line endings (DF-01) |
| Modified | `docs/chayen/PROGRESS.md`, `ACCEPTANCE_MATRIX.md` (CAP-D19 and CAP-D20 IMPLEMENTED; REQ-05 IMPLEMENTED; REQ-02, ARC-04 evidence), `DECISIONS.md` (D-038), `ISSUES.md` (Q-10, R-27, R-28, R-32, R-33, R-34 notes), `IMPLEMENTATION_PLAN.md` |
| Deleted | None |
| Scratch only (not in the repository) | Lifecycle work directory `lc18`, and the catalog, case, extension, mutation, and documentation edit scripts. The `skills-ref` venv was reused. |

### Tests

| # | Test | Command | Result |
|---|---|---|---|
| T1 | Package, skills, references, catalog alignment | `node tools/validate/validate-package.mjs` | **PASS:** 0 errors, 0 warnings (after shortening two descriptions that first produced two warnings). 13 skills. L0 5485/5500. Maximum overlap 0.11. 142 references with valid kinds. 117 recipe files agree with the catalog (206 capabilities). 445 recipe cases. 135 trigger cases. |
| T2 | Catalog | `node tools/catalog/check-catalog.mjs` | **PASS.** IMPLEMENTED=206. 20 domains, 57 groups, 13 entry skills (all existing), fingerprint unchanged, doc in sync (after `--write-doc`). |
| T3 | All automated gates | `node tools/validate/validate-all.mjs` | First run: **FAIL** G-13 46/53 (seven fixtures no longer applicable). After retargeting: **PASS** 4/4 gate groups, self-tests 53/53 (`node tools/validate/run-validator-tests.mjs` shows each retargeted fixture producing its expected error). |
| T4 | Claude Code validator (2.1.220) | `claude plugin validate --strict` on the plugin and the marketplace | PASS ×2 |
| T5 | Agent Skills reference validator | `agentskills validate` ×13 (`skills-ref` 0.1.1, scratch venv) | PASS: 13/13 valid |
| T6 | Native lifecycle (isolated homes, no model calls) | `bash tests/provider-compatibility/run-lifecycle.sh <scratch>/lc18` | **PASS 24/24:** 13 skills discoverable on Claude Code 2.1.220, Codex 0.162.1, and Copilot CLI 1.0.89. The fixture stayed unchanged and clean. |
| T7 | Eval cases in sync | `node tools/evals/generate-claude-evals.mjs --check` (inside validate-all G-11) | PASS: 135 cases, 322 files |
| — | Trigger evals for the rewritten frontend and AI engineering descriptions | — | NOT_RUN: billed runs need approval (R-32) |
| — | Recipe behaviour evals (35 new cases) | — | NOT_RUN: no runner or fixtures (G-12) |
| — | Any search, spatial, realtime, extension, or agent evaluation run described by the recipes | — | NOT_RUN: no fixture repositories in this step |
| — | Human review of 8 new and 6 extended recipes | — | Pending (R-33, R-34) |

---

## Step 19 — Engineering coverage audit

- **Date:** 2026-10-14
- **Status:** DONE (pending user review)
- **Result:** all **206/206** capabilities exist with their exact inventory
  names and pass ten static coverage criteria, after **9 gaps were found
  and fixed** in this step. **0/206 are VERIFIED**: behaviour and trigger
  evaluations have not run. The report is
  [ENGINEERING_COVERAGE_AUDIT.md](ENGINEERING_COVERAGE_AUDIT.md).

### Work performed

- **Read first:** BUILD_CONTRACT, the catalog, the inventory embedded in
  `check-catalog.mjs`, the authoring standard (RC rules), and the quality
  gates.
- **Audit tool:** `tools/catalog/audit-coverage.mjs` (developer-only, no
  dependencies, not shipped). Per capability it checks C1 existence with the
  exact inventory name, C2 mapping, C3 substantive procedure (steps, words,
  and term coverage of the record's purpose and outputs), C4 entry skill
  routing, C5 paths, C6 and C7 positive and negative recipe cases consistent
  with the mapping, C8 inputs and outputs, C9 safety and verification rules,
  and C10 no placeholders. It also reports duplicates, missing or extra
  names, orphan recipes, broken mappings, and shared description terms.
- **First run:** 198/206 passed. The 8 failures (CAP-02-002, 003, 008,
  CAP-11-010, CAP-13-008, 009, 012, CAP-16-009) were C9: their recipes'
  Verification sections did not say how checks are reported, which RC-07
  requires.
- **Manual review** of the ten lowest term-coverage records found one more
  gap: the risk-class procedure for CAP-04-003 did not cover availability,
  one of the five risk dimensions in its record. The other nine were
  word-form differences.
- **Fixes:** a reporting rule added to the Verification sections of
  `stories-and-acceptance.md`, `privacy.md`, `secrets-management.md`,
  `releases-and-provenance.md`, and `release-notes.md`; a five-dimension
  rating step and an availability clause added to `task-contract.md`.
- **Final run:** 206/206 pass all ten criteria; 0 missing, 0 extra, 0
  duplicate names or IDs, 0 orphan recipes, 0 broken mappings (including
  every positive and negative recipe case checked against the catalog
  mapping).
- **Observations recorded, not fixed:** 48 capabilities share recipes
  without ID-labelled sections (R-35), and eight false-positive routing risk
  areas remain unmeasured (R-36).
- **Not done (out of scope for this step):** no technology packs, no new
  skills, no description changes.

### File ledger

| Action | Path |
|---|---|
| Created | `docs/chayen/ENGINEERING_COVERAGE_AUDIT.md`, `tools/catalog/audit-coverage.mjs` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-requirements/references/stories-and-acceptance.md`, `chayen-security/references/privacy.md`, `chayen-devops/references/secrets-management.md`, `releases-and-provenance.md`, `chayen-documentation/references/release-notes.md`, `chayen-implementation/references/task-contract.md` |
| Modified | `tools/catalog/README.md`, `docs/chayen/CAPABILITY_COVERAGE.md` (pointer to the audit), `docs/chayen/PROGRESS.md`, `ACCEPTANCE_MATRIX.md` (snapshot, summary, REQ-05 and REQ-10 evidence), `ISSUES.md` (R-33 note; new R-35, R-36), `IMPLEMENTATION_PLAN.md` |
| Deleted | None |
| Scratch only (not in the repository) | Lifecycle work directory `lc19`, audit JSON and Markdown outputs, and the fix and documentation edit scripts |

### Tests

| # | Test | Command | Result |
|---|---|---|---|
| T1 | Coverage audit, first run | `node tools/catalog/audit-coverage.mjs` | **FAIL**, exit 1: 198/206; 8 C9 failures |
| T2 | Coverage audit, after fixes | `node tools/catalog/audit-coverage.mjs` | **PASS**, exit 0: 206/206 on all ten criteria; no duplicates, missing items, orphans, or broken mappings |
| T3 | Package validator | `node tools/validate/validate-package.mjs` | PASS: 0 errors, 0 warnings; L0 5485/5500; 117 recipe files agree with the catalog (206 capabilities) |
| T4 | Catalog checker | `node tools/catalog/check-catalog.mjs` | PASS: 206 IMPLEMENTED; inventory fingerprint `2f13cad24ff431e3` matches |
| T5 | All automated gates | `node tools/validate/validate-all.mjs` | PASS: 4/4 gate groups; self-tests 53/53; eval cases in sync (135 cases, 322 files) |
| T6 | Claude Code validator (2.1.220) | `claude plugin validate --strict` on the plugin and the marketplace | PASS ×2 |
| T7 | Agent Skills reference validator | `agentskills validate` ×13 | PASS: 13/13 valid |
| T8 | Native lifecycle (isolated homes) | `bash tests/provider-compatibility/run-lifecycle.sh <scratch>/lc19` | PASS 24/24 on Claude Code, Codex, and Copilot |
| — | Trigger evals (G-11) | — | NOT_RUN: billed runs need approval (R-32, R-36) |
| — | Recipe behaviour evals (G-12) | — | NOT_RUN: no runner or fixture repositories |
| — | Human review (G-15) | — | NOT_RUN: pending (R-33, R-34) |

---

## Step 20 — .NET technology pack (C#, ASP.NET Core)

- **Date:** 2026-10-15
- **Status:** DONE (pending user review)
- **Result:** all **22/22** technology capabilities (8 C#, 14 ASP.NET
  Core) exist with the exact names given, each as a technology section with
  applicability rules, version notes, steps, and a verification rule, plus
  positive and negative cases. **0/22 are VERIFIED.** 31 framework facts the
  guidance relies on were executed and passed. Report:
  [TECHNOLOGY_COVERAGE.md](TECHNOLOGY_COVERAGE.md).

### Work performed

- **Read first:** BUILD_CONTRACT, SKILL_AUTHORING_STANDARD, the engineering
  catalog (`stack_packs` already lists `dotnet-aspnetcore`), ARCHITECTURE
  C-05, and the existing .NET content in the backend, testing, data,
  performance, and devops skills.
- **Layout (D-039, PROPOSED):** no new skill and no description change (L0
  stays 5,485 / 5,500). Workflow stays in the recipes; .NET detail is in
  `kind: technology` references in the skills that handle each request
  type (TECHNOLOGY_COVERAGE §2).
- **Shipped content:**
  - `chayen-backend`: `aspnetcore-webapi.md` rewritten as the base
    reference (version detection, version gates, API style and
    architecture rules, C# rules for every endpoint). Its earlier guidance
    moved into the new topic files `aspnetcore-endpoints.md`,
    `aspnetcore-pipeline.md`, `aspnetcore-auth.md`,
    `aspnetcore-data-access.md`, and
    `aspnetcore-background-services.md`. Nothing was dropped.
  - `chayen-implementation`: `csharp-types-and-nullability.md`,
    `csharp-async-and-memory.md`, `csharp-linq-and-serialization.md`,
    `csharp-project-health.md`.
  - `chayen-data`: `efcore-migrations.md`.
  - `chayen-testing`: `dotnet-testing.md`, where the integration
    section became the aspnet-integration-testing capability.
  - `chayen-performance`: `aspnetcore-performance.md`.
  - `chayen-devops`: `aspnetcore-hosting.md`.
  - The six SKILL.md files gained References rows and workflow pointers.
- **Requirements:**
  - Version detection: project file, `global.json`, `LangVersion`,
    packages, CI images, `dotnet --version`; version notes in every
    section.
  - Controllers or minimal APIs: follow the style in use, never convert.
  - Architecture and dependency rules are constraints. No pattern is
    imposed (TC-04).
  - Covered explicitly: async and `CancellationToken`, nullable
    references, DI, validation, exception handling, the project's test
    framework, and `WebApplicationFactory`.
  - EF Core is never assumed: Dapper, ADO.NET, DbUp, and database-first
    paths are covered, with negative cases.
- **Catalog and checks:**
  - `catalog/technology-capabilities.yaml`: 22 records, IDs
    `TECH-CSHARP-001..008` and `TECH-ASPNET-001..014`.
  - `tools/catalog/check-technology.mjs` (V-23.1 to V-23.9), wired into
    `validate-all` as gate G-03b.
  - 14 negative controls.
  - 57 technology cases (34 positive, 23 negative).
  - 7 trigger cases; Claude evals regenerated (142 cases).
- **Standard amended (D-039):** §5.3 technology capability sections (TC-01
  to TC-06), LD-03 (a base reference plus one topic file), and §8
  (`technology-cases.json`). SKILL_QUALITY_GATES gained G-03b.
- **Framework fact checks:** a .NET 10 fixture API with xUnit tests and a
  .NET 8 contrast pair, run by `tests/technology/dotnet/run-fact-checks.mjs`.
  Each capability has at least one fact. Probing changed the guidance in
  four places:
  - EF Core scaffolds a plain rename as `RenameColumn`, but a rename plus
    a type change as drop and add with a data-loss warning. The guidance
    says both instead of "renames are always drop and add".
  - On .NET 8, tests need `public partial class Program`; on .NET 10 they
    do not.
  - CA2000 is heuristic: it missed an undisposed `FileStream`.
  - `TreatWarningsAsErrors` turns NuGet audit warnings into build errors.
- **Process issues fixed during the step:**
  - The base and topic files first linked each other, which broke the
    2-hop limit (V-08). They now refer to each other in code spans.
  - Appending trigger cases by re-serializing JSON reformatted the whole
    file. It was restored from git (unchanged since the last commit) and
    the cases were appended in the file's existing style.
- **Not done:** no new skills, no description changes, no other technology
  packs. The user's commit `3ab6944` (Step 19) was observed; the agent
  made no commits.

### File ledger

| Action | Path |
|---|---|
| Created (shipped) | `plugins/codejadee-chayen-framework/skills/chayen-backend/references/aspnetcore-endpoints.md`, `aspnetcore-pipeline.md`, `aspnetcore-auth.md`, `aspnetcore-data-access.md`, `aspnetcore-background-services.md`; `chayen-implementation/references/csharp-types-and-nullability.md`, `csharp-async-and-memory.md`, `csharp-linq-and-serialization.md`, `csharp-project-health.md`; `chayen-data/references/efcore-migrations.md`; `chayen-performance/references/aspnetcore-performance.md`; `chayen-devops/references/aspnetcore-hosting.md` |
| Modified (shipped) | `chayen-backend/references/aspnetcore-webapi.md` (rewritten as the base; earlier guidance moved to the topic files), `chayen-testing/references/dotnet-testing.md`; `SKILL.md` of chayen-backend, -implementation, -data, -testing, -performance, -devops; `skills/README.md` |
| Created (developer) | `catalog/technology-capabilities.yaml`, `tools/catalog/check-technology.mjs`, `tests/skills/technology-cases.json`, `tests/catalog/technology-mutations.json`, `tests/technology/dotnet/README.md`, `run-fact-checks.mjs`, `fixture/src/FactApi/FactApi.csproj`, `fixture/src/FactApi/Program.cs`, `fixture/tests/FactApi.Tests/FactApi.Tests.csproj`, `fixture/tests/FactApi.Tests/FactTests.cs`, `fixture/net8/Api8/Api8.csproj`, `fixture/net8/Api8/Program.cs`, `fixture/net8/Api8.Tests/Api8.Tests.csproj`, `fixture/net8/Api8.Tests/PingTests.cs`, `results/step20-fact-checks.md`; `docs/chayen/TECHNOLOGY_COVERAGE.md`; generated `tests/evals/claude/` cases `pos-impl-csharp-nullability`, `pos-impl-dotnet-analyzers`, `amb-dotnet-sync-over-async`, `amb-efcore-migration`, `pos-testing-webapplicationfactory`, `pos-devops-dotnet8-port`, `neg-explain-csharp-record` |
| Modified (developer) | `tests/skills/trigger-cases.json` (+7 cases), `tools/validate/validate-all.mjs` (G-03b), `tools/validate/run-validator-tests.mjs` (technology suite and copied files), `tools/catalog/README.md`, `tests/catalog/README.md`, `tests/skills/README.md` |
| Modified (docs) | `docs/chayen/SKILL_AUTHORING_STANDARD.md` (§5.3, LD-03, §8), `SKILL_QUALITY_GATES.md` (G-03b), `DECISIONS.md` (D-039), `ARCHITECTURE.md` (C-05 as-built note), `CAPABILITY_COVERAGE.md` (pointer), `ACCEPTANCE_MATRIX.md` (snapshot, summary, STK-01, REQ-07, REQ-10), `ISSUES.md` (R-33 note; new R-37, R-38), `IMPLEMENTATION_PLAN.md` (row 20), `PROGRESS.md` |
| Deleted | None |
| Scratch only (not in the repository) | Probe projects (`dn`, `fx`, `fx2`, `ca`, `ca2`, `n8`, `sdkpin`, `slntest`), fact-check outputs, lifecycle directory `lc20`, and the edit scripts `step20-*.mjs`; the runner's own temporary copies were deleted after each run |

### Tests

| # | Test | Command | Result |
|---|---|---|---|
| T1 | .NET fact checks, run 1 (26 facts) | `node tests/technology/dotnet/run-fact-checks.mjs` | PASS: 26/26 |
| T2 | .NET fact checks, run 2 (31 facts) | same | **FAIL**, exit 1: 30 PASS, TF-30 FAIL (CA2000 did not report an undisposed `FileStream`). The check was retargeted to a `StreamReader` case, and the guidance now calls CA2000 heuristic. |
| T3 | .NET fact checks, run 3 | same | **PASS**, exit 0: 31 PASS, 0 FAIL, 0 NOT_RUN (SDK 10.0.401; 8.0.406 for TF-22 and TF-24); recorded in `tests/technology/dotnet/results/step20-fact-checks.md` |
| T4 | Package validator after the skill edits | `node tools/validate/validate-package.mjs` | **FAIL**: 30 V-08 errors (base and topic files linked in a cycle beyond 2 hops). Fixed, then PASS: 0 errors, 0 warnings; L0 5485/5500; 154 references |
| T5 | Technology checker, first run | `node tools/catalog/check-technology.mjs` | **FAIL**: 2 errors (one case context too thin; coverage doc missing). Fixed, then PASS: V-23.1 to V-23.9, 22 capabilities, 57 cases, 31 facts |
| T6 | All automated gates | `node tools/validate/validate-all.mjs` | PASS: 5/5 gate groups (G-03b added); validator self-tests 68/68 (53 earlier, plus 1 baseline and 14 technology controls); evals in sync (142 cases, 342 files) |
| T7 | Claude Code validator (2.1.220) | `claude plugin validate --strict` on the plugin and the marketplace | PASS ×2 |
| T8 | Agent Skills reference validator | `agentskills validate` ×13 | PASS: 13/13 |
| T9 | Native lifecycle (isolated homes) | `bash tests/provider-compatibility/run-lifecycle.sh <scratch>/lc20` | PASS: 24/24 |
| T10 | Engineering coverage audit (regression) | `node tools/catalog/audit-coverage.mjs` | PASS: 206/206 on all ten criteria |
| — | Trigger evals for the 7 new cases (G-11) | — | NOT_RUN: billed runs need approval (R-32, R-37) |
| — | Behaviour evals for the 57 technology cases (G-12) | — | NOT_RUN: no runner yet; the fact-check fixture is not an agent eval |
| — | Human review of the .NET guidance (G-15) | — | NOT_RUN (R-33, R-38) |


## Step 21 — Angular and shared TypeScript/JavaScript support

- **Date:** 2026-10-15
- **Status:** DONE (pending user review). Stop after STEP 21.
- **Result:** 14/14 Angular and 8/8 shared TS/JS capabilities IMPLEMENTED;
  all 22 pass V-23 inventory, mapping, anatomy, and positive/negative case
  validation. None is VERIFIED. Framework facts: 8 TS/JS PASS, 14 Angular
  NOT_RUN. Coverage report: [TECHNOLOGY_COVERAGE.md](TECHNOLOGY_COVERAGE.md) §7.

### Evidence reviewed and work performed

- Read BUILD_CONTRACT, SKILL_AUTHORING_STANDARD (including technology
  rules TC-01..06 and conditional loading), SKILL_QUALITY_GATES,
  TECHNOLOGY_COVERAGE, engineering stack-pack evidence, existing frontend,
  implementation and testing routers, Angular base, and V-23/case format.
  Initial working tree was clean. No .kiyo/project or applicable AGENTS.md
  was found. Official compatibility sources checked 2026-10-15 are in
  TECHNOLOGY_COVERAGE §8.
- Extended the existing static technology pack model. No new entry skill,
  description change, engineering capability change, or runtime dependency.
  L0 remains 5,485/5,500 across 13 skills. Ten new shipped references bring
  the reference count to 164; all are conditionally reachable inside their
  owning skill. General workflow remains in existing recipes.
- Frontend: expanded Angular base detection and compatibility gates; five
  topic guides hold 13 capabilities. Testing owns angular-testing in one new
  topic. Implementation owns eight shared capabilities in a base and three
  topics. Guides include practical steps, examples, failure boundaries, and
  explicit result reporting.
- Version and convention requirements: inspect resolved Angular/CLI/build,
  TypeScript and RxJS versions; preserve standalone/NgModule, decorators or
  signal bindings, form strategy, RxJS operators, state libraries, Zone.js
  or zoneless mode, and template syntax. No automatic modernization.
- Package evidence: npm, pnpm, Yarn Classic/modern, Bun text/binary locks,
  packageManager and CI; conflicting evidence is surfaced before edits.
  Preserve configured scripts, custom builders and test runners. TestBed is
  not a runner, and fakeAsync is not assumed in Vitest/zoneless setups.
- Secret boundaries: never send privileged server credentials through browser
  imports, public config, env replacements, HTML, transfer state, bundles, or
  source maps; inspect locations/names without printing values. Added a
  positive boundary specification for this requirement.
- Catalog: added TECH-ANGULAR-001..014 and TECH-JS-001..008. V-23 now checks
  the exact Steps 20–21 inventories and recognizes all new section suffixes
  and AF/JF facts. Added ordered anatomy checking required by TC-02.
- Tests: 52 new technology specifications (30 positive, 22 negative), including
  all managers, manager conflict, legacy/modern component/template examples,
  and server-secret isolation; total 109. Added eight trigger specifications
  and generated 17 eval files; total 150 cases/359 files. Nine new mutation
  controls; self-tests now 77/77.
- Developer-only framework runner reuses explicitly supplied existing tools.
  Temporary fixture uses real TypeScript compilation (valid and invalid cases),
  runtime cancellation, JSON/module behavior, and offline local npm installs
  with scripts disabled. No Angular or TS dependency was downloaded or added.
  TypeScript 6.0.3 was used only for these facts; guides require each project's
  own Angular-compatible compiler and configured commands.
- Traceability: technology coverage, plan and decision D-040, acceptance
  STK-02/STK-04, and risks R-39/R-40 updated. Acceptance summary was recalculated
  from current requirement rows (its previous counts were stale), without
  promoting unrelated rows.

### Decisions, risks, and open questions

- **D-040:** user-directed Step 21 scope ACCEPTED; use of existing technology
  sections/routers PROPOSED for review. Original indicative user-documentation
  scope remains visible as superseded history. No later work performed.
- **R-39:** no installed Angular application or browser/SSR/upgrade fixture.
  AF-01..14 and Angular production builds, automatic rendering, accessibility,
  and hydration are NOT_RUN. The optional pure Angular checks themselves did
  not run. Do not infer compatibility with older Angular majors or other
  JS runtimes/package managers from the TS/Node/npm facts.
- **R-40:** behavior and trigger evaluations remain NOT_RUN. Their case
  specifications were validated, not executed by an agent. No capability is
  promoted to VERIFIED, and human review remains pending.
- No production/auth/schema change, new dependency, package-manager switch,
  git commit, push, publication, or release. No files deleted.

### File ledger

Paths below are repository-relative; generated eval files are listed individually.

| Action | Path |
|---|---|
| Modified | `catalog/technology-capabilities.yaml` |
| Modified | `docs/chayen/ACCEPTANCE_MATRIX.md` |
| Modified | `docs/chayen/DECISIONS.md` |
| Modified | `docs/chayen/IMPLEMENTATION_PLAN.md` |
| Modified | `docs/chayen/ISSUES.md` |
| Modified | `docs/chayen/PROGRESS.md` |
| Modified | `docs/chayen/TECHNOLOGY_COVERAGE.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/README.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-frontend/SKILL.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-frontend/references/angular.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-implementation/SKILL.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-testing/SKILL.md` |
| Modified | `tests/catalog/README.md` |
| Modified | `tests/catalog/technology-mutations.json` |
| Modified | `tests/skills/README.md` |
| Modified | `tests/skills/technology-cases.json` |
| Modified | `tests/skills/trigger-cases.json` |
| Modified | `tools/catalog/README.md` |
| Modified | `tools/catalog/check-technology.mjs` |
| Modified | `tools/validate/run-validator-tests.mjs` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-frontend/references/angular-components.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-frontend/references/angular-forms-accessibility.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-frontend/references/angular-navigation-http.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-frontend/references/angular-reactivity.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-frontend/references/angular-ssr-upgrades.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-implementation/references/javascript-runtime.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-implementation/references/typescript-javascript.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-implementation/references/typescript-types.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-implementation/references/typescript-workspace.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-testing/references/angular-testing.md` |
| Created | `tests/evals/claude/amb-angular-upgrade-only/graders/expected-skill.md` |
| Created | `tests/evals/claude/amb-angular-upgrade-only/prompt.md` |
| Created | `tests/evals/claude/neg-explain-angular-signals/graders/no-chayen-skill.md` |
| Created | `tests/evals/claude/neg-explain-angular-signals/prompt.md` |
| Created | `tests/evals/claude/pos-frontend-angular-hydration/graders/expected-skill.md` |
| Created | `tests/evals/claude/pos-frontend-angular-hydration/prompt.md` |
| Created | `tests/evals/claude/pos-frontend-angular-legacy-route/graders/expected-skill.md` |
| Created | `tests/evals/claude/pos-frontend-angular-legacy-route/prompt.md` |
| Created | `tests/evals/claude/pos-frontend-angular-signals/graders/expected-skill.md` |
| Created | `tests/evals/claude/pos-frontend-angular-signals/prompt.md` |
| Created | `tests/evals/claude/pos-impl-typescript-config/graders/expected-skill.md` |
| Created | `tests/evals/claude/pos-impl-typescript-config/prompt.md` |
| Created | `tests/evals/claude/pos-impl-typescript-interop/graders/expected-skill.md` |
| Created | `tests/evals/claude/pos-impl-typescript-interop/prompt.md` |
| Created | `tests/evals/claude/pos-testing-angular-karma/graders/expected-skill.md` |
| Created | `tests/evals/claude/pos-testing-angular-karma/graders/forbidden-skills.md` |
| Created | `tests/evals/claude/pos-testing-angular-karma/prompt.md` |
| Created | `tests/technology/angular-typescript/README.md` |
| Created | `tests/technology/angular-typescript/results/step21-fact-checks.md` |
| Created | `tests/technology/angular-typescript/run-fact-checks.mjs` |
| Deleted | None |
| Scratch only, outside repository | Three authoring/report scripts under the session user's temporary directory; isolated fact and mutation workspaces |

### Tests and observed outcomes

| Test | Command | Result |
|---|---|---|
| Package/skill validation | `node tools/validate/validate-package.mjs` | PASS: 0 errors, 0 warnings; 13 skills, 164 references, L0 5485/5500 |
| All technology capabilities | `node tools/catalog/check-technology.mjs --write-doc`, then `node tools/catalog/check-technology.mjs` | PASS: all 44 records, including all 22 Step 21 capabilities; 109 case specifications; AF/JF/TF links; generated table in sync |
| Trigger artifacts | `node tools/evals/generate-claude-evals.mjs`, then `--check` through validate-all | PASS: 150 cases, 359 files in sync; agent evaluations NOT_RUN |
| TS/JS fact attempt 1 | `node tests/technology/angular-typescript/run-fact-checks.mjs --typescript "C:/Users/praty/AppData/Roaming/npm/node_modules/@angular/cli/node_modules/@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript.js" --npm-cli "C:/Users/praty/AppData/Roaming/npm/node_modules/npm/bin/npm-cli.js" --report tests/technology/angular-typescript/results/step21-fact-checks.md` | FAIL, exit 1: 4 PASS, 4 FAIL, 14 NOT_RUN. Vendored TS 5.4.2 compiler lacked standard lib files; switched to an existing complete editor compiler |
| TS/JS fact attempt 2 | Final command below with existing TS 6.0.3, before fixture adjustment | FAIL, exit 1: 7 PASS, 1 FAIL, 14 NOT_RUN. TS 6 diagnosed deprecated baseUrl in the monorepo fixture; replaced it with absolute paths mapping without suppressing diagnostics |
| Final TS/JS facts | `node tests/technology/angular-typescript/run-fact-checks.mjs --typescript "C:/Users/praty/AppData/Local/Programs/Microsoft VS Code/16507d91be/resources/app/extensions/node_modules/typescript/lib/typescript.js" --npm-cli "C:/Users/praty/AppData/Roaming/npm/node_modules/npm/bin/npm-cli.js" --report tests/technology/angular-typescript/results/step21-fact-checks.md` | PASS, exit 0: 8 PASS, 0 FAIL, 14 Angular NOT_RUN; Node 26.8.1, TS 6.0.3. Report in tests/technology/angular-typescript/results/step21-fact-checks.md |
| First automated regression | `node tools/validate/validate-all.mjs` after initial 8 controls | PASS: 5/5 groups, 76/76 self-tests |
| Expanded regression attempt | Same command after extra cases and order control | FAIL: 76/77 self-tests. New standalone case made one mutation match twice; retargeted that mutation to the uniquely mapped route case |
| Final automated regression | `node tools/validate/validate-all.mjs` | PASS, exit 0: 5/5 groups, 77/77 self-tests; includes all nine Step 21 controls |
| Engineering coverage regression | `node tools/catalog/audit-coverage.mjs` | PASS: 206/206 on all ten criteria, 0 missing/duplicate/orphan/broken mappings; engineering capability statuses unchanged |
| Native Claude manifests | `claude plugin validate --strict plugins/codejadee-chayen-framework`; `claude plugin validate --strict .claude-plugin/marketplace.json` | PASS, exit 0 for both |
| Diff hygiene | `git -c core.safecrlf=false diff --check` | PASS: no whitespace errors |
| Angular app/framework/browser checks | No app dependency fixture supplied | NOT_RUN: AF-01..14; production build, configured app tests, rendered accessibility, real SSR/hydration, and upgrade checks |
| Behavior/trigger evaluation execution and human review | G-11/G-12/G-15 | NOT_RUN; generation and structural validation are not execution |
| Provider lifecycle, remote install, publication | Not required for unchanged manifests/metadata in this step | NOT_RUN in Step 21; no external release action |

**Runtime Verification:** Verified for executed catalog/validator and TS/JS
fact checks. Angular runtime behavior remains NOT_RUN. STEP 21 ends here.


## Step 22 — React and Next.js engineering guidance

- **Date:** 2026-10-15
- **Status:** DONE (pending user review). STOP after STEP 22.
- **Result:** React 8/8 and Next.js 8/8 IMPLEMENTED, with exact names,
  one mapped technology section each, version/applicability rules, detailed
  implementation procedures, examples, and positive/negative specifications.
  V-23 PASS for all 16 new capabilities (60 technology records total).
  None is VERIFIED. See [TECHNOLOGY_COVERAGE.md](TECHNOLOGY_COVERAGE.md) §9.

### Evidence reviewed and work performed

- Read BUILD_CONTRACT, technology standards TC-01..06/LD-03, quality gates,
  prior .NET and Angular/shared-TS/JS pack structure, technology catalog,
  existing React/Next frontend and Node server guides, and frontend/backend/
  testing/devops routers. Initial working tree was clean. No .kiyo/project or
  repository AGENTS.md was found; no instruction or user configuration edited.
  Official version-dependent documentation checked 2026-10-15 is listed in
  TECHNOLOGY_COVERAGE §10.
- Kept static delivery and existing workflow recipes. Added eleven new
  technology references and expanded two existing bases; all are conditionally
  reachable inside their owning skill. No new skill or description change,
  engineering-catalog change, runtime dependency, or toolchain download.
  Thirteen skills retain L0 5485/5500; reference count is 175.
- React: component/ref contracts, state/effects, remote state, forms, existing
  client routing, measured rendering changes, component tests, accessibility.
  Extend installed Redux/Context/Zustand/Jotai/query/forms approaches; no
  speculative library or class-to-hook rewrite. Both Jest and Vitest test
  contexts preserve configured runners; no arbitrary DOM/test-library install.
- Next: preserve App/Pages routing ownership; inspect resolved Next/React and
  request signatures, runtime, cacheComponents/output settings before using
  version-dependent APIs. Frontend owns App segments, server/client import and
  DTO boundaries, and rendering/SEO; backend owns Server Functions/handlers,
  caching and auth; devops owns production artifact testing.
- Corrected the existing prefix-only secret advice in react-nextjs and
  node-servers: imports, config env, props/action results, source maps, HTML,
  and RSC payloads also matter. Small client islands remain safe during server
  prerender; use client is not proof that window exists during initial render.
- Authentication/authorization guidance requires trusted identity and
  resource/tenant checks at every reachable server action/handler/protected
  data operation. Layout/client/proxy checks never substitute; forged owner/
  role fields cannot grant permission. These are guides and synthetic tests,
  not changes to a real application's auth or hosting configuration.
- Catalog: TECH-REACT-001..008 and TECH-NEXTJS-001..008; V-23 accepts exact
  Steps 20–22 inventories and React/Next headings and RF/NF fact IDs. Manually
  reviewed every new related-engineering mapping by its catalog name.
- Cases: 40 new technology specifications (24 positive, 16 negative), total
  149. Extra fixtures cover existing classes, no new query library, Jest,
  async App params, Client Component prerender, forged owner, Cache Components,
  and direct proxy bypass. Eight trigger prompts generated into eighteen files;
  totals 158 cases/377 files. Added eight catalog mutation controls.
- Fact/boundary runner uses Node built-ins, optional existing React packages,
  and synthetic fixed sessions. Three checks execute ordinary callable,
  Web Request/Response, and loopback HTTP boundaries with direct denial tests
  and no writes on denied calls. No Next compiler, cache, provider-session,
  React DOM interaction, or deployment behavior is claimed from these tests.
- Updated coverage, STK-05/STK-06 acceptance rows/summary, plan, D-041 decision,
  R-41/R-42, testing/catalog documentation, and this full file ledger.

### Decisions, risks, and open questions

- **D-041:** user-directed Step 22 React/Next scope ACCEPTED; technology layout
  PROPOSED pending review. Original indicative release-readiness scope remains
  visible as superseded history. No release-readiness mission or later step run.
- **R-41:** framework/app/runner/browser/production fixtures are unavailable.
  RF-01..08 and NF-01/02/05/07/08 are NOT_RUN. NF-03/04/06 PASS only for synthetic
  JavaScript/Web-standard server boundaries; this does not establish compiled
  Server Action transport, Next caching, secret-bundle/RSC exclusion, real auth
  provider integration, hydration, metadata, accessibility, or deployment.
- **R-42:** agent behavior/trigger evaluations and human review NOT_RUN. Specs
  and generated prompts are not executed evaluations. Frontend SKILL.md is
  206 lines: above target 200, within hard maximum 300 (one V-06 warning).
  Metadata budget and descriptions are unchanged; base plus one topic loading
  stays in place. No new capability promoted to VERIFIED.
- **Deferred finding:** while checking Step 22 mappings, existing Step 21
  state/form/render-related engineering IDs were observed to need semantic
  review (for example angular-state-management maps to CAP-07-004 form-and-
  validation). These prior-step records were not changed in STEP 22 ONLY.
- No production auth/schema/config change, dependency install, state/router
  migration, provider switch, git commit, push, publication, or deployment.
  No files deleted.

### File ledger

Repository-relative paths; generated eval files are recorded individually.

| Action | Path |
|---|---|
| Modified | `catalog/technology-capabilities.yaml` |
| Modified | `docs/chayen/ACCEPTANCE_MATRIX.md` |
| Modified | `docs/chayen/DECISIONS.md` |
| Modified | `docs/chayen/IMPLEMENTATION_PLAN.md` |
| Modified | `docs/chayen/ISSUES.md` |
| Modified | `docs/chayen/PROGRESS.md` |
| Modified | `docs/chayen/TECHNOLOGY_COVERAGE.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/README.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-backend/SKILL.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-backend/references/node-servers.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-devops/SKILL.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-frontend/SKILL.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-frontend/references/react-nextjs.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-testing/SKILL.md` |
| Modified | `tests/catalog/README.md` |
| Modified | `tests/catalog/technology-mutations.json` |
| Modified | `tests/skills/README.md` |
| Modified | `tests/skills/technology-cases.json` |
| Modified | `tests/skills/trigger-cases.json` |
| Modified | `tools/catalog/README.md` |
| Modified | `tools/catalog/check-technology.mjs` |
| Modified | `tools/validate/run-validator-tests.mjs` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-backend/references/nextjs-data-auth.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-backend/references/nextjs-mutations.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-backend/references/nextjs-server.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-devops/references/nextjs-deployment.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-frontend/references/nextjs-rendering-seo.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-frontend/references/nextjs-routing-boundaries.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-frontend/references/react-components-state.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-frontend/references/react-data-forms.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-frontend/references/react-navigation-accessibility.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-frontend/references/react-rendering.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-testing/references/react-testing.md` |
| Created | `tests/evals/claude/amb-next-cache-freshness/graders/expected-skill.md` |
| Created | `tests/evals/claude/amb-next-cache-freshness/prompt.md` |
| Created | `tests/evals/claude/neg-explain-react-useeffect/graders/no-chayen-skill.md` |
| Created | `tests/evals/claude/neg-explain-react-useeffect/prompt.md` |
| Created | `tests/evals/claude/pos-backend-next-authorization/graders/expected-skill.md` |
| Created | `tests/evals/claude/pos-backend-next-authorization/prompt.md` |
| Created | `tests/evals/claude/pos-backend-next-server-function/graders/expected-skill.md` |
| Created | `tests/evals/claude/pos-backend-next-server-function/graders/forbidden-skills.md` |
| Created | `tests/evals/claude/pos-backend-next-server-function/prompt.md` |
| Created | `tests/evals/claude/pos-devops-next-artifact/graders/expected-skill.md` |
| Created | `tests/evals/claude/pos-devops-next-artifact/prompt.md` |
| Created | `tests/evals/claude/pos-frontend-next-client-boundary/graders/expected-skill.md` |
| Created | `tests/evals/claude/pos-frontend-next-client-boundary/prompt.md` |
| Created | `tests/evals/claude/pos-frontend-react-effect-cleanup/graders/expected-skill.md` |
| Created | `tests/evals/claude/pos-frontend-react-effect-cleanup/prompt.md` |
| Created | `tests/evals/claude/pos-testing-react-user-interaction/graders/expected-skill.md` |
| Created | `tests/evals/claude/pos-testing-react-user-interaction/graders/forbidden-skills.md` |
| Created | `tests/evals/claude/pos-testing-react-user-interaction/prompt.md` |
| Created | `tests/technology/react-nextjs/README.md` |
| Created | `tests/technology/react-nextjs/fixture/server-boundaries.mjs` |
| Created | `tests/technology/react-nextjs/results/step22-fact-checks.md` |
| Created | `tests/technology/react-nextjs/run-fact-checks.mjs` |
| Deleted | None |
| Scratch only, outside repository | Two Step 22 authoring/report scripts in the session user's temporary directory; validator-owned temporary mutation copies |

### Tests and observed outcomes

| Test | Command | Result |
|---|---|---|
| Technology coverage | `node tools/catalog/check-technology.mjs --write-doc`, then `node tools/catalog/check-technology.mjs` | PASS: 60 records, including exact 16/16 Step 22 capabilities; 149 case specifications; unique reachable mapped sections, ordered anatomy, RF/NF facts, table in sync |
| Package and skill content | `node tools/validate/validate-package.mjs` | PASS: 0 errors, 1 warning (frontend 206 lines > target 200, below hard 300); 13 skills, 175 references, L0 5485/5500 |
| Trigger artifact generation | `node tools/evals/generate-claude-evals.mjs`, with `--check` through validate-all | PASS: 158 cases/377 files; no behavioral run performed |
| Synthetic boundary checks | `node tests/technology/react-nextjs/run-fact-checks.mjs --report tests/technology/react-nextjs/results/step22-fact-checks.md` | PASS, exit 0: 3 PASS, 0 FAIL, 13 NOT_RUN on Node 26.8.1. NF-03 direct callable denies no/expired/forbidden/wrong-tenant identity and invalid input; NF-04 invalid JSON/400, method/405, safe 200 DTO and private no-store; NF-06 loopback HTTP denies unauthenticated/expired/revoked/forged owner/wrong tenant before writes. No compiled Next verification |
| First automated regression | `node tools/validate/validate-all.mjs` | FAIL: 84/85 self-tests. New cache record was incorrectly linked to background-job CAP-06-008, duplicating an older mutation's unique target; semantic review also corrected state/form/render/auth/deployment links. Kept existing mutation unchanged and used the actual named engineering IDs |
| Final automated regression | `node tools/validate/validate-all.mjs` | PASS, exit 0: 5/5 gate groups, 85/85 self-tests, including eight new controls; package target warning remains explicit |
| Engineering coverage regression | `node tools/catalog/audit-coverage.mjs` | PASS: 206/206 all ten criteria; no missing/duplicate/orphan/broken mappings. Engineering catalog unchanged |
| Native Claude manifests | `claude plugin validate --strict plugins/codejadee-chayen-framework`; `claude plugin validate --strict .claude-plugin/marketplace.json` | PASS, exit 0 for both |
| Diff hygiene | `git -c core.safecrlf=false diff --check` | PASS: no whitespace errors |
| React/Next framework checks | No installed project/runner/build fixture | NOT_RUN: React interaction/effects/query/focus/profiling; Next production router/actions/cache/auth-provider/bundle/RSC/metadata/hydration/artifacts. Optional static React markup facts also NOT_RUN |
| Agent behavior/trigger evaluations and human review | G-11/G-12/G-15 | NOT_RUN; generation/static checks and synthetic fixtures do not promote status |
| Provider lifecycle, remote install, publication | Unchanged package manifests/metadata; outside Step 22 guidance scope | NOT_RUN in this step; no external mutation performed |

**Runtime Verification:** Verified for executed validators and synthetic
boundary checks. React/Next framework behavior remains NOT_RUN. STOP here.


## Step 23 — Vue, Nuxt, and Vite engineering guidance

- **Date:** 2026-10-15
- **Status:** DONE (pending user review). STOP after STEP 23.
- **Result:** Vue 7/7, Nuxt 7/7, Vite 4/4 IMPLEMENTED and structurally
  validated. Every exact name has one mapped technology section, ordered
  applicability/version/steps/verification, examples, and positive/negative
  specifications. V-23 PASS for all 18 new capabilities (78 technology records
  total), none VERIFIED. Report: [TECHNOLOGY_COVERAGE.md](TECHNOLOGY_COVERAGE.md) §11.

### Evidence reviewed and work performed

- Read BUILD_CONTRACT, technology standard TC-01..06 and conditional loading
  rules, existing .NET/Angular/shared-TS/React/Next pack layout/catalog/checker,
  Vue/Nuxt and Node-server bases, owning routers and quality gates. Initial
  working tree was clean; no .kiyo/project or repository AGENTS.md was found.
  No instruction files or user config changed.
- Consulted official Vue, Router, Vite, Vitest, Nuxt repository and Nuxt 2
  documentation on 2026-10-15. Some versioned Nuxt site URLs and initially
  guessed repository paths failed; GitHub directory metadata located the
  current official files. Only successful primary sources support guidance;
  see TECHNOLOGY_COVERAGE §12. No third-party claims or latest-version default
  was imposed.
- Reused static delivery and current workflow recipes. Added ten technology
  references and expanded Vue/Nuxt and Node-server bases with detection,
  boundaries, examples, and targeted routing. No new entry skill, description,
  L0 budget, runtime dependency, toolchain install, or engineering-catalog
  change. Thirteen skills retain L0 5485/5500; total references 185.
- Vue: Composition/setup and retained Options conventions; Vue 2.7 versus 3
  reactivity, macro support, ordinary destructuring versus Vue 3.5 props
  compiler transform; instance-owned composables with scope cleanup; existing
  Router/Pinia/Vuex; configured component tests and measured rendering changes.
- Nuxt: plain Vue versus generated framework context; Nuxt 2/3/4 pages,
  app/root/srcDir, SSR data keys/hydration, event-only fetch, auto-import settings,
  installed modules/layers, server entry validation/auth, private/public runtime
  config/legacy overrides, rendering and output/preset validation.
- Vite: selected-builder evidence first; Vue CLI/webpack and non-Vite Nuxt
  keep their toolchain. Preserve framework-owned config, plugins, supported
  Rollup/Rolldown API, comparable production build evidence, env prefix/define
  privacy, and current Jest/Vitest or other runner. A Vite React case proves
  the specifications do not equate Vite with Vue.
- SSR/privacy: browser globals stay out of server imports/setup; request-local
  stores/data; private config stays out of public/app settings, DTOs, state,
  data payloads, HTML, client imports and source maps. Runtime overrides and
  build-time env are distinct. No private credential values were inspected or
  printed; tests use synthetic sentinels.
- Package manager and tests: compare npm/pnpm/Yarn/Bun pin/lock/workspace/CI
  evidence, resolve conflicts, and reuse configured scripts. No automatic
  Vite/Vitest/state/module install or framework/API-style migration.
- Catalog: TECH-VUE-001..007, TECH-NUXT-001..007, TECH-VITE-001..004. Checker
  recognizes exact Step 23 inventories, suffixes, and VF/UF/BF definitions.
  Reviewed all eighteen related-engineering links against named catalog
  capabilities; no unrelated prior-step record fixes.
- Tests: 44 new technology specs (26 positive, 18 negative), total 193, including
  Vue 2 Vuex/Jest, Vue 3.5 props, Nuxt 2 routing/config, disabled imports, Vite
  React and Vite-with-Jest. Eight triggers generated eighteen files, total 166
  cases/395 files. Nine new mutation controls; self-tests now 94/94.
- Developer-only runner reuses optional explicitly supplied existing Vue/Vite
  packages; none were available/supplied in this run. Two Node/JavaScript
  counterexamples executed with synthetic config/env data. No package manifest,
  dependency download, live API, production write, or deployed app fixture.
- Updated coverage, STK-07/08/09 and acceptance summary, plan/D-042, risks
  R-43/R-44, test/catalog documentation, and the full file ledger below.

### Decisions, risks, and open questions

- **D-042:** user-directed STEP 23 scope ACCEPTED; existing-router/technology
  layout PROPOSED pending review. No other numbered step or release executed.
- **R-43:** 16 framework checks remain NOT_RUN; optional Vue core/SSR and Vite
  resolveConfig checks did not run. UF-04/BF-03 PASS only for JavaScript
  serialization/string/spread exposure. They do not establish Nuxt private
  projection, production overrides, payload secrecy, Vite transforms/plugins/
  artifacts, browser hydration, component/store/router tests, module/context
  correctness, or measured build/render improvement.
- **R-44:** behavior and trigger evaluations and human review NOT_RUN.
  Specifications and generated prompts are not agent execution. All eighteen
  remain IMPLEMENTED, 0 VERIFIED. Frontend/backend bodies are 213/202 lines,
  above target 200 but within 300 hard; two V-06 warnings are explicit.
- No production config/auth/schema change, new dependency, module/store/builder
  migration, git commit, push, deployment, publication, or later-step action.
  No files deleted.

### File ledger

Repository-relative paths; generated evaluations listed individually.

| Action | Path |
|---|---|
| Modified | `catalog/technology-capabilities.yaml` |
| Modified | `docs/chayen/ACCEPTANCE_MATRIX.md` |
| Modified | `docs/chayen/DECISIONS.md` |
| Modified | `docs/chayen/IMPLEMENTATION_PLAN.md` |
| Modified | `docs/chayen/ISSUES.md` |
| Modified | `docs/chayen/PROGRESS.md` |
| Modified | `docs/chayen/TECHNOLOGY_COVERAGE.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/README.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-backend/SKILL.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-backend/references/node-servers.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-devops/SKILL.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-frontend/SKILL.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-frontend/references/vue-nuxt.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-testing/SKILL.md` |
| Modified | `tests/catalog/README.md` |
| Modified | `tests/catalog/technology-mutations.json` |
| Modified | `tests/skills/README.md` |
| Modified | `tests/skills/technology-cases.json` |
| Modified | `tests/skills/trigger-cases.json` |
| Modified | `tools/catalog/README.md` |
| Modified | `tools/catalog/check-technology.mjs` |
| Modified | `tools/validate/run-validator-tests.mjs` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-backend/references/nuxt-server.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-devops/references/nuxt-deployment.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-devops/references/vite-toolchain.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-frontend/references/nuxt-app.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-frontend/references/nuxt-modules.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-frontend/references/vue-composition.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-frontend/references/vue-performance.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-frontend/references/vue-routing-state.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-testing/references/vite-testing.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-testing/references/vue-testing.md` |
| Created | `tests/evals/claude/amb-nuxt-private-runtime-config/graders/expected-skill.md` |
| Created | `tests/evals/claude/amb-nuxt-private-runtime-config/prompt.md` |
| Created | `tests/evals/claude/neg-explain-vue-nuxt/graders/no-chayen-skill.md` |
| Created | `tests/evals/claude/neg-explain-vue-nuxt/prompt.md` |
| Created | `tests/evals/claude/pos-backend-nuxt-protected-api/graders/expected-skill.md` |
| Created | `tests/evals/claude/pos-backend-nuxt-protected-api/graders/forbidden-skills.md` |
| Created | `tests/evals/claude/pos-backend-nuxt-protected-api/prompt.md` |
| Created | `tests/evals/claude/pos-devops-vite-config/graders/expected-skill.md` |
| Created | `tests/evals/claude/pos-devops-vite-config/prompt.md` |
| Created | `tests/evals/claude/pos-frontend-nuxt-ssr-data/graders/expected-skill.md` |
| Created | `tests/evals/claude/pos-frontend-nuxt-ssr-data/prompt.md` |
| Created | `tests/evals/claude/pos-frontend-vue-composable-cleanup/graders/expected-skill.md` |
| Created | `tests/evals/claude/pos-frontend-vue-composable-cleanup/prompt.md` |
| Created | `tests/evals/claude/pos-testing-vite-alias/graders/expected-skill.md` |
| Created | `tests/evals/claude/pos-testing-vite-alias/prompt.md` |
| Created | `tests/evals/claude/pos-testing-vue-jest/graders/expected-skill.md` |
| Created | `tests/evals/claude/pos-testing-vue-jest/graders/forbidden-skills.md` |
| Created | `tests/evals/claude/pos-testing-vue-jest/prompt.md` |
| Created | `tests/technology/vue-nuxt-vite/README.md` |
| Created | `tests/technology/vue-nuxt-vite/results/step23-fact-checks.md` |
| Created | `tests/technology/vue-nuxt-vite/run-fact-checks.mjs` |
| Deleted | None |
| Scratch only, outside repository | Two Step 23 authoring/report scripts in the session user's temporary directory; validator-owned temporary mutation copies |

### Tests and observed outcomes

| Test | Command | Result |
|---|---|---|
| Technology inventory/sections/cases | `node tools/catalog/check-technology.mjs --write-doc`, then `node tools/catalog/check-technology.mjs` | PASS: 78 records including all 18 Step 23 capabilities; 193 specs, exact inventory, unique mapped sections, ordered anatomy, VF/UF/BF links, coverage table in sync |
| Package and content validation | `node tools/validate/validate-package.mjs` | PASS: 0 errors, 2 warnings (frontend 213/backend 202 lines above target 200); all under 300 hard; 13 skills, 185 references, L0 5485/5500 |
| Trigger artifacts | `node tools/evals/generate-claude-evals.mjs`, with `--check` through validate-all | PASS: 166 cases/395 files in sync; agent trigger execution NOT_RUN |
| JS exposure checks | `node tests/technology/vue-nuxt-vite/run-fact-checks.mjs --report tests/technology/vue-nuxt-vite/results/step23-fact-checks.md` | PASS, exit 0: 2 PASS, 0 FAIL, 16 NOT_RUN on Node 26.8.1. UF-04 full config JSON contains synthetic private marker, explicit public DTO excludes it; BF-03 false env string is truthy and unrestricted spread exposes marker. No Nuxt/Vite framework proof |
| Automated regression | `node tools/validate/validate-all.mjs` | PASS, exit 0: 5/5 groups, 94/94 validator self-tests, all nine Step 23 negative controls; two target warnings remain |
| Engineering coverage | `node tools/catalog/audit-coverage.mjs` | PASS: 206/206 all ten criteria, no missing/duplicate/orphan/broken mappings; engineering catalog unchanged |
| Native manifests | `claude plugin validate --strict plugins/codejadee-chayen-framework`; `claude plugin validate --strict .claude-plugin/marketplace.json` | PASS, exit 0 for both |
| Diff hygiene | `git -c core.safecrlf=false diff --check` | PASS: no whitespace errors |
| Actual framework/app/runtime checks | No existing compatible dependencies/project fixture supplied | NOT_RUN: Vue/API/compiler/component/store/router/performance, Nuxt SSR/data/context/config/modules/server/render/deployment, Vite config/build/env/runner behavior. Optional pure API facts also NOT_RUN |
| Agent behavior/trigger evaluations and human review | G-11/G-12/G-15 | NOT_RUN; no VERIFIED promotion |
| Provider lifecycle, remote install, release | Unchanged manifests/metadata; outside Step 23 guidance scope | NOT_RUN in this step; no external mutation |

**Runtime Verification:** Verified for executed validators and supporting
JavaScript counterexamples. Framework/browser/artifact behavior remains
NOT_RUN. STEP 23 ends here.



## Step 26 — Microsoft SQL Server guidance and data access recipes

- **Date:** 2026-10-15
- **Status:** DONE (pending user review). STOP after STEP 26.
- **Result:** SQL Server 12/12 IMPLEMENTED and V-23 validated; EF Core SQL
  Server provider, Dapper, and ADO.NET data access recipes added and checked
  by the new V-23.10. ORM/driver references resolve (DR-01..03 PASS). 27/27
  engine and ORM facts PASS on a disposable LocalDB database. 0 VERIFIED.
  Report: [TECHNOLOGY_COVERAGE.md](TECHNOLOGY_COVERAGE.md) §13.

### Evidence reviewed and work performed

- Read BUILD_CONTRACT, IMPLEMENTATION_PLAN, PROGRESS, the technology catalog
  and checker, `chayen-data` SKILL.md and its references (existing
  `sql-server.md`, `efcore-migrations.md`), the backend's
  `aspnetcore-data-access.md`, the .NET fact runner, case/trigger/mutation
  formats, and the validators. The working tree was clean at the start.
- **Step numbering:** PROGRESS ended at Step 23; no record of Steps 24 or 25
  exists (`tests/technology/nitro-elysia/results` is an empty, untracked
  folder, left untouched). Step 26 was executed as instructed; nothing was
  inferred or done for Steps 24–25 (R-45).
- **References (chayen-data):** expanded `sql-server.md` with engine and
  provider detection, a T-SQL-versus-PostgreSQL table, and the read-only
  production rule (existing content kept). Added `sqlserver-tsql.md`,
  `sqlserver-query-tuning.md`, `sqlserver-concurrency.md`,
  `sqlserver-schema-security.md`, `sqlserver-operations.md` (12 capability
  sections) and `sqlserver-data-access.md` (three recipes, each covering the
  ten required topics, with steps, a verify rule, and a Driver references
  table). SKILL.md: workflow step 1 sentence and six References rows (183
  lines). Backend `aspnetcore-data-access.md`: one pointer sentence. No
  description, skill, or L0 change (5,485 / 5,500); 191 references.
- **Official documentation:** 23 version-specific claims were fact-checked
  against Microsoft Learn, the EF Core docs, the Dapper repository, and
  SqlClient release notes on 2026-10-15; 18 confirmed as stated, 5 narrowed
  and corrected in the guidance (TECHNOLOGY_COVERAGE §14).
- **Catalog and checker:** pack `sqlserver` and TECH-SQLSERVER-001..012;
  `check-technology.mjs` gains the exact Step 26 inventory, the `sqlserver-`
  section prefix, `SF` fact IDs, and V-23.10 (recipe sections, topics,
  steps, verify rule, recipe cases, packages and APIs present in the
  compiled fixture).
- **Fact fixture:** `tests/technology/sqlserver` (xUnit, .NET 10; EF Core
  SQL Server 10.0.8, Dapper 2.1.66, Microsoft.Data.SqlClient 6.1.1, all from
  the local NuGet cache). It runs only against LocalDB or a loopback server,
  in a database it creates and drops. The runner created a dedicated LocalDB
  instance `ChayenFacts`; the user's other instances were not touched. One
  early run failed during setup (a T-SQL collation conflict in the
  fixture's own environment query) and left one empty fact database in that
  instance; it was dropped and the fixture now cleans up on setup failure.
  After every later run, 0 fact databases remained.
- **Corrections from execution:** the first run gave 25/27. SF-01 showed
  `ILIKE` fails with error 4145, not a syntax error; SF-11 showed that a
  trivial plan records no missing-index request. Both were corrected in the
  test and stated in the guidance; no assertion was weakened to pass.
- **Cases:** 39 technology cases (27 positive, 12 negative; total 232),
  9 data access recipe cases (6 positive, 3 negative), 7 trigger prompts
  (total 173 cases, 412 files), 10 mutation controls (total 104).
- **Docs:** TECHNOLOGY_COVERAGE (header, summary, mapping, §13, §14, generated
  table), ACCEPTANCE_MATRIX (STK-03 IMPLEMENTED, summary), DECISIONS D-043,
  ISSUES R-45, R-46 and a DF-01 note, IMPLEMENTATION_PLAN, four READMEs.

### Decisions, risks, and open questions

- **D-043:** user-directed scope ACCEPTED; layout and fixture PROPOSED. The
  fixture's packages are developer-only test dependencies (BC-22), never
  shipped.
- **R-45:** Steps 24–25 are unrecorded. Please confirm whether they were
  skipped, renumbered, or done elsewhere.
- **R-46:** facts cover SQL Server 2025 Express only; Enterprise/Standard,
  Azure SQL Database, Managed Instance, and older versions are stated from
  documentation. Routing of SQL Server prompts among data, performance,
  security, and backend is unmeasured; agent evaluations NOT_RUN.
- **DF-01 (existing):** on this checkout the eval sync check reported 231
  stale files before any Step 26 change, because of CRLF line endings.
  Regenerating made the gate pass; `git diff` shows no content change for
  those files.
- **Local state left on the machine:** LocalDB instance `ChayenFacts`
  (remove with `sqllocaldb stop ChayenFacts && sqllocaldb delete ChayenFacts`);
  an IDE-generated, git-ignored `obj/` folder in the fixture.
- No production or shared database access, dependency added to the plugin,
  commit, push, release, or later-step work.

### File ledger

| Action | Path |
|---|---|
| Created | `plugins/codejadee-chayen-framework/skills/chayen-data/references/sqlserver-tsql.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-data/references/sqlserver-query-tuning.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-data/references/sqlserver-concurrency.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-data/references/sqlserver-schema-security.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-data/references/sqlserver-operations.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-data/references/sqlserver-data-access.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-data/references/sql-server.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-data/SKILL.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-backend/references/aspnetcore-data-access.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/README.md` |
| Modified | `catalog/technology-capabilities.yaml` |
| Modified | `tools/catalog/check-technology.mjs` |
| Modified | `tools/catalog/README.md` |
| Modified | `tools/validate/run-validator-tests.mjs` |
| Created | `tests/technology/sqlserver/run-fact-checks.mjs` |
| Created | `tests/technology/sqlserver/README.md` |
| Created | `tests/technology/sqlserver/results/step26-fact-checks.md` |
| Created | `tests/technology/sqlserver/fixture/SqlServerFacts/SqlServerFacts.csproj` |
| Created | `tests/technology/sqlserver/fixture/SqlServerFacts/FactDb.cs` |
| Created | `tests/technology/sqlserver/fixture/SqlServerFacts/Model.cs` |
| Created | `tests/technology/sqlserver/fixture/SqlServerFacts/TsqlFacts.cs` |
| Created | `tests/technology/sqlserver/fixture/SqlServerFacts/PlanFacts.cs` |
| Created | `tests/technology/sqlserver/fixture/SqlServerFacts/ConcurrencyFacts.cs` |
| Created | `tests/technology/sqlserver/fixture/SqlServerFacts/SchemaSecurityFacts.cs` |
| Created | `tests/technology/sqlserver/fixture/SqlServerFacts/OperationsFacts.cs` |
| Created | `tests/technology/sqlserver/fixture/SqlServerFacts/DriverReferences.cs` |
| Created | `tests/skills/sqlserver-data-access-cases.json` |
| Modified | `tests/skills/technology-cases.json` |
| Modified | `tests/skills/trigger-cases.json` |
| Modified | `tests/skills/README.md` |
| Modified | `tests/catalog/technology-mutations.json` |
| Modified | `tests/catalog/README.md` |
| Created | `tests/evals/claude/{pos-data-sqlserver-deadlock, pos-data-sqlserver-query-store, pos-data-sqlserver-temporal, pos-data-sqlserver-least-privilege, pos-data-dapper-varchar-scan, pos-data-sqlserver-restore-simple, neg-explain-sqlserver-vs-postgres}/` (generated) |
| Regenerated, no content change | 231 existing files under `tests/evals/claude/` (LF instead of CRLF; DF-01) |
| Modified | `docs/chayen/TECHNOLOGY_COVERAGE.md`, `ACCEPTANCE_MATRIX.md`, `DECISIONS.md`, `ISSUES.md`, `IMPLEMENTATION_PLAN.md`, `PROGRESS.md` |
| Deleted | None |

### Tests and observed outcomes

| Test | Command | Result |
|---|---|---|
| Technology catalog (12/12) | `node tools/catalog/check-technology.mjs --write-doc`, then `node tools/catalog/check-technology.mjs` | PASS: 0 errors; 90 records match the Steps 20–23 and 26 inventories; 12/12 SQL Server sections with ordered anatomy; 232 cases; 27 SF facts linked; V-23.10 PASS (3 recipes × 10 topics, 3 driver packages, 9 recipe cases); coverage table regenerated |
| ORM/driver references and engine facts | `node tests/technology/sqlserver/run-fact-checks.mjs --report tests/technology/sqlserver/results/step26-fact-checks.md` | PASS, exit 0: 30 PASS, 0 FAIL, 0 NOT_RUN (DR-01..03, SF-01..27) on `(localdb)\ChayenFacts`, SQL Server 2025 Express 17.0.4025.3, compatibility level 170, `SQL_Latin1_General_CP1_CI_AS`, RCSI off, SIMPLE recovery. MEASURED: N+1 11 vs 1 vs 2 commands; 574 vs 2 logical reads; fragmentation 99.1% vs 0.0% |
| Package and content validation | `node tools/validate/validate-package.mjs` | PASS: 0 errors, 2 existing warnings (frontend 213, backend 202 lines above the 200 target); 191 references; L0 5,485 / 5,500 |
| Trigger artifacts | `node tools/evals/generate-claude-evals.mjs`, then `--check` | PASS after regeneration: 173 cases, 412 files. Before any change, `--check` reported 231 stale files on this CRLF checkout (DF-01). Agent trigger execution NOT_RUN |
| Automated regression | `node tools/validate/validate-all.mjs` | PASS, exit 0: 5/5 gate groups; validator self-tests 104/104, including all 10 Step 26 controls |
| Engineering coverage | `node tools/catalog/audit-coverage.mjs` | PASS, exit 0: 206/206 pass all 10 criteria; engineering catalog unchanged |
| Native manifests | `claude plugin validate --strict plugins/codejadee-chayen-framework`; `claude plugin validate --strict .claude-plugin/marketplace.json` (Claude Code 2.1.270) | PASS, exit 0 for both |
| Diff hygiene | `git -c core.safecrlf=false diff --check` | PASS: no whitespace errors |
| Other editions and platforms | Enterprise/Standard, Azure SQL Database, Managed Instance, older versions | NOT_RUN: not available here (R-46) |
| Agent behaviour/trigger evaluations and human review | G-11/G-12/G-15 | NOT_RUN; no capability promoted to VERIFIED |

**Runtime Verification:** Verified for the validators and for SQL Server
engine/ORM/driver behaviour on one local, disposable LocalDB database.
Agent behaviour and other platforms remain NOT_RUN. STEP 26 ends here.


## Step 27 — PostgreSQL engineering and cross-stack integration

- **Date:** 2026-10-15
- **Status:** DONE (pending user review). STOP after STEP 27.
- **Result:** PostgreSQL 10/10 and cross-stack 8/8 IMPLEMENTED and V-23
  validated; PostgreSQL data access recipes (EF Core Npgsql, Npgsql,
  SQLAlchemy, other configurations) checked by V-23.10. 42/42 executed
  checks PASS (DR-01..04, PF-01..24, XF-01..14). 0 VERIFIED. Report:
  [TECHNOLOGY_COVERAGE.md](TECHNOLOGY_COVERAGE.md) §15.

### Evidence reviewed and work performed

- Read BUILD_CONTRACT, the technology catalog and checker, PROGRESS, the
  existing `postgresql.md`, `contract-codegen.md`, `api-and-contract-tests.md`,
  `authn-authz.md`, and the four affected SKILL.md files. The working tree was
  clean at `9e2bd6c` (Step 26 committed by the user).
- **Environment:** no PostgreSQL, SQLAlchemy, or psycopg was installed, and
  the Docker daemon was not running. The agent downloaded, outside the
  repository: the official PostgreSQL 18.6 Windows binaries (EDB zip,
  SHA-256 e2246ba91d22345bc3d017586c09ede52d9df180b1eeb480f050445f1cad84e2)
  into the user temp folder, a Python venv with SQLAlchemy 2.0.43 and
  psycopg 3.2.10 (a short path was needed: psycopg's DLL failed to load from
  the long scratch path), and playwright-core 1.56.1, openapi-typescript
  7.9.1, and TypeScript 5.9.3 into the session scratch folder. The cached
  Playwright Chromium 1228 was used as the browser. Nothing was installed
  system-wide (D-044).
- **References:** expanded `postgresql.md` (detection, "PostgreSQL is not SQL
  Server" table, read-only production rule, existing content kept); new
  `postgres-sql.md`, `postgres-query-tuning.md`,
  `postgres-concurrency-security.md`, `postgres-schema-changes.md`,
  `postgres-operations.md`, `postgres-data-access.md`,
  `database-portability.md` (data); `crossstack-api-contracts.md`,
  `crossstack-auth-boundaries.md` (backend); `crossstack-types-and-time.md`
  (implementation); `crossstack-e2e.md` (testing). SKILL.md References rows
  added in four skills and one workflow sentence in data. No description or
  L0 change (5,485 / 5,500); 202 references.
- **Documentation check:** 28 claims checked against official sources:
  25 confirmed, 2 narrowed, 1 not documented (stated as observed). One more
  (PostgreSQL 18 `EXPLAIN ANALYZE` prints buffers by default) confirmed by
  execution (TECHNOLOGY_COVERAGE §16).
- **Catalog and checker:** packs `postgresql` and `crossstack` (`scope:
  cross-stack`), TECH-POSTGRES-001..010 and TECH-CROSSSTACK-001..008; the
  checker gains both inventories, section prefixes, `PF`/`XF` facts, the
  cross-stack scope exemption, and a list-based V-23.10 for SQL Server and
  PostgreSQL recipe files (.NET projects and `requirements.txt`).
- **Fixtures:** `tests/technology/postgres-crossstack` with `PostgresFacts`
  (xUnit, temporary cluster, LocalDB `tempdb` for XF-13), `CrossStackApi` plus
  `CrossStackFacts` (WebApplicationFactory; committed contract snapshot),
  `python/` (SQLAlchemy facts and import-only references), `node/` (client
  facts, typed client, browser end to end), and a runner that starts and
  deletes a localhost-only cluster.
- **Corrections from execution (no assertion weakened to pass):**
  superusers bypass RLS even with `FORCE` (owner case moved to a
  non-superuser role); `current_setting(..., true)` reads `''` after a
  transaction-local set (22P02 on cast; policies now use `NULLIF`); .NET 10
  cookie auth returns 401 for API endpoints and redirects HTML endpoints;
  SQLAlchemy's SQL Server dialect uses `ROW_NUMBER()` without a known server
  version; Node on Windows ignores `TZ` (XF-07 compares against the runtime's
  own zone). The first full-runner attempt hung because `pg_ctl start`
  inherited the runner's pipes; it was stopped, the orphaned temporary
  cluster shut down and deleted, and the runner fixed (`stdio: "ignore"`).
- **Cases:** 53 technology cases (35 positive, 18 negative; total 285), 11
  recipe cases (7/4), 9 trigger prompts (total 182 cases, 433 files), 11
  mutation controls (total 115).

### Decisions, risks, and open questions

- **D-044:** user-directed scope ACCEPTED; layout, the `scope: cross-stack`
  rule, and fixtures PROPOSED.
- **R-47:** facts cover PostgreSQL 18.6 with the `C` locale, one .NET 10
  API, one Node runtime and zone, one browser. Managed services, PgBouncer,
  ICU collations, older majors, and physical PITR were not executed.
- **R-48:** agent behaviour and trigger evaluations NOT_RUN; cross-stack
  routing is the most ambiguous. Backend SKILL.md is 204 lines (target 200).
- **R-45 (open from Step 26):** Steps 24–25 remain unrecorded.
- **Local state left on the machine:** `%TEMP%\chpg` (PostgreSQL binaries),
  `%TEMP%\chpy` (Python venv), the scratch `node-tools`, the LocalDB instance
  `ChayenFacts` from Step 26, and IDE-generated, git-ignored `bin/`/`obj/`
  folders in the new .NET fixtures. They can be deleted at any time; the
  runner reports NOT_RUN without them.
- No production or shared database access, plugin dependency, commit,
  push, release, or later-step work.

### File ledger

| Action | Path |
|---|---|
| Created | `plugins/codejadee-chayen-framework/skills/chayen-data/references/postgres-sql.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-data/references/postgres-query-tuning.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-data/references/postgres-concurrency-security.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-data/references/postgres-schema-changes.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-data/references/postgres-operations.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-data/references/postgres-data-access.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-data/references/database-portability.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-backend/references/crossstack-api-contracts.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-backend/references/crossstack-auth-boundaries.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-implementation/references/crossstack-types-and-time.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-testing/references/crossstack-e2e.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-data/references/postgresql.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/{chayen-data,chayen-backend,chayen-implementation,chayen-testing}/SKILL.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/README.md` |
| Modified | `catalog/technology-capabilities.yaml` |
| Modified | `tools/catalog/check-technology.mjs`, `tools/catalog/README.md`, `tools/validate/run-validator-tests.mjs` |
| Created | `tests/technology/postgres-crossstack/run-fact-checks.mjs`, `README.md`, `results/step27-fact-checks.md` |
| Created | `tests/technology/postgres-crossstack/fixture/PostgresFacts/{PostgresFacts.csproj, PgDb.cs, Model.cs, SqlFacts.cs, PlanFacts.cs, ConcurrencyFacts.cs, SchemaOpsFacts.cs, CrossEngineFacts.cs, DriverReferences.cs}` |
| Created | `tests/technology/postgres-crossstack/fixture/CrossStackApi/{CrossStackApi.csproj, Program.cs, contract/openapi.v1.json}` |
| Created | `tests/technology/postgres-crossstack/fixture/CrossStackFacts/{CrossStackFacts.csproj, ApiFacts.cs}` |
| Created | `tests/technology/postgres-crossstack/fixture/python/{requirements.txt, sqlalchemy_facts.py, sqlalchemy_references.py}` |
| Created | `tests/technology/postgres-crossstack/node/{client-facts.mjs, typed-client.mjs, e2e.mjs}` |
| Created | `tests/skills/postgres-data-access-cases.json` |
| Modified | `tests/skills/technology-cases.json`, `tests/skills/trigger-cases.json`, `tests/skills/README.md` |
| Modified | `tests/catalog/technology-mutations.json`, `tests/catalog/README.md` |
| Created | `tests/evals/claude/{pos-data-postgres-rls, pos-data-postgres-vacuum, pos-data-postgres-explain, pos-data-db-portability, pos-backend-openapi-drift, pos-backend-cors-credentials, pos-impl-timezone-roundtrip, pos-testing-crossstack-e2e, neg-explain-postgres-mvcc}/` (generated) |
| Modified | `docs/chayen/TECHNOLOGY_COVERAGE.md`, `ACCEPTANCE_MATRIX.md`, `DECISIONS.md`, `ISSUES.md`, `IMPLEMENTATION_PLAN.md`, `PROGRESS.md` |
| Deleted | None |

### Tests and observed outcomes

| Test | Command | Result |
|---|---|---|
| Technology catalog (10/10, 8/8) | `node tools/catalog/check-technology.mjs --write-doc`, then `node tools/catalog/check-technology.mjs` | PASS: 0 errors; 108 records match the Steps 20–23, 26, and 27 inventories; ordered anatomy for all 18 new sections; 285 cases; PF/XF facts linked; V-23.10 PASS for both recipe files (SQL Server 3×10 topics, PostgreSQL 4×11 topics, packages pinned, APIs used) |
| Driver references and facts | `node tests/technology/postgres-crossstack/run-fact-checks.mjs --report tests/technology/postgres-crossstack/results/step27-fact-checks.md --pg-bin <bin> --python <python> --node-tools <node_modules>` | PASS, exit 0: 42 PASS, 0 FAIL, 0 NOT_RUN. PostgreSQL 18.6 temporary cluster on 127.0.0.1; LocalDB `tempdb`; Chromium 149. MEASURED: 1,667 vs 4 shared buffers (expression index); 1,000 dead rows not removable under an open snapshot, all removed after; SQLAlchemy 6 vs 2 statements |
| Package and content validation | `node tools/validate/validate-package.mjs` | PASS: 0 errors, 2 warnings (backend 204, frontend 213 lines above the 200 target); 202 references; L0 5,485 / 5,500 |
| Trigger artifacts | `node tools/evals/generate-claude-evals.mjs`, then `--check` | PASS: 182 cases, 433 files; no content change to existing evals; agent trigger execution NOT_RUN |
| Automated regression | `node tools/validate/validate-all.mjs` | PASS, exit 0: 5/5 gate groups; validator self-tests 115/115 including all 11 Step 27 controls |
| Engineering coverage | `node tools/catalog/audit-coverage.mjs` | PASS, exit 0: 206/206 pass all 10 criteria; engineering catalog unchanged |
| Native manifests | `claude plugin validate --strict plugins/codejadee-chayen-framework`; `claude plugin validate --strict .claude-plugin/marketplace.json` (Claude Code 2.1.270) | PASS for both |
| Diff hygiene | `git -c core.safecrlf=false diff --check` | PASS: no whitespace errors |
| Other platforms | Managed PostgreSQL, older majors, ICU locales, PgBouncer, physical PITR, other browsers | NOT_RUN (R-47) |
| Agent behaviour/trigger evaluations and human review | G-11/G-12/G-15 | NOT_RUN; no capability promoted to VERIFIED |

**Runtime Verification:** Verified for the validators and for the executed
PostgreSQL, ORM/driver, API, client, and browser facts on local, temporary
infrastructure. Agent behaviour and other platforms remain NOT_RUN. STEP 27
ends here.

---

## Step 28 — Technology coverage audit

- **Date:** 2026-10-15 (Asia/Bangkok)
- **Status:** PARTIAL. Audit and scoped content/specification fixes are
  implemented; full required frontend/provider scenarios remain NOT_RUN
  (R-49), and the existing maintainer Node 18 compatibility declaration is
  inconsistent with its code (R-50). STOP after STEP 28.
- **Scope:** all 11 implemented packs, 108 technology capabilities and 57
  mapped technology references; all 17 technologies in the latest prompt.
  General Nitro/Elysia/Python guidance is distinguished from dedicated packs;
  Java/Spring Boot remains outside implementation scope. Steps 24–25 were
  not inferred or implemented (R-45).

### Work performed and findings

- Created [TECHNOLOGY_COVERAGE_AUDIT.md](TECHNOLOGY_COVERAGE_AUDIT.md):
  eight-check matrix, technology-specific recipes/versions/commands,
  inventory, findings, representative/mixed-stack scenarios, primary-source
  checks, actual verification and a separate NOT_RUN register.
- Fixed seven content/specification gaps: packaged support index and stale
  skill count, per-owner stack detection, local EF/provider API version gates,
  Npgsql zero-offset semantics, standalone Nitro versus Nuxt conventions,
  combined-stack/sibling-negative specifications, and engine-specific null
  sorting guidance. No dependency, migration, description/L0, or consumer
  application was changed.
- Added ten `audit28` technology specifications, bringing the set to
  295 (183 positive/112 negative); regenerated the coverage table. These are
  specifications, not executed provider results.
- Extended the existing PostgreSQL XF-06 fact with nonzero DateTimeOffset
  rejection and normalized UTC round-trip assertions. Re-executed the full
  PostgreSQL/cross-stack runner after the final fixture change.
- Preserved the 206 engineering and 108 technology capability statuses:
  all IMPLEMENTED, 0 VERIFIED. R-49 records runtime/provider gaps; R-50
  records the maintainer Node 18/import.meta.dirname mismatch. No new
  architecture decision or approval was inferred, and no later step started.

### File ledger

| Action | Path |
|---|---|
| Created | `docs/chayen/TECHNOLOGY_COVERAGE_AUDIT.md` |
| Created | `tests/technology/audit/results/step28-fact-checks.json` |
| Modified | `docs/chayen/PROGRESS.md` |
| Modified | `docs/chayen/ISSUES.md` (R-49, R-50) |
| Modified | `docs/chayen/IMPLEMENTATION_PLAN.md` (Step 28 only) |
| Modified | `docs/chayen/ACCEPTANCE_MATRIX.md` (audit traceability; statuses unchanged) |
| Modified | `docs/chayen/TECHNOLOGY_COVERAGE.md` (generated case counts only) |
| Modified | `plugins/codejadee-chayen-framework/README.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-backend/SKILL.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-backend/references/data-access.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-backend/references/node-servers.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-frontend/SKILL.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-implementation/SKILL.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-implementation/references/crossstack-types-and-time.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-data/references/sqlserver-data-access.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-data/references/postgres-data-access.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-data/references/database-portability.md` |
| Modified | `tests/skills/technology-cases.json` |
| Modified | `tests/technology/postgres-crossstack/fixture/PostgresFacts/CrossEngineFacts.cs` |
| Deleted | None |

### Tests actually executed

Commands ran from the repository root; `$scratch` was
`$env:TEMP/chayen-step28-audit`. Exact individual results are retained in
[the STEP 28 result artifact](../../tests/technology/audit/results/step28-fact-checks.json).
The six fact suites total **107 PASS, 0 FAIL, 52 NOT_RUN** (159 checks);
zero exit means no executed fact failed, not that skipped facts passed.

| Check | Command | Observed final outcome |
|---|---|---|
| Automated gates, before and after changes | `node tools/validate/validate-all.mjs` | PASS, exit 0: 5/5 gate groups, 115/115 validator self-tests. G-11 here is specification sync only (182 cases, 433 files), not live agent triggering. |
| Technology mapping/specs and coverage | `node tools/catalog/check-technology.mjs --write-doc`, then `node tools/catalog/check-technology.mjs` | PASS, exit 0: 108 capabilities, 295 specifications, seven library recipes; coverage synchronized. |
| Engineering regression audit | `node tools/catalog/audit-coverage.mjs` | PASS, exit 0: 206/206 pass ten static criteria; existing 48 unsectioned shared capabilities remain R-35. |
| Package/links/budgets | `node tools/validate/validate-package.mjs` | PASS, exit 0: 202 reference files reachable, 117 recipe files, 445 recipe cases; 13 skills, L0 5,485/5,500. Existing target-size warnings: backend 206 and frontend 215 lines; both below hard 300. |
| C#/ASP.NET/.NET | `node tests/technology/dotnet/run-fact-checks.mjs --json "$scratch/dotnet.json"` | 29 PASS, 0 FAIL, 2 NOT_RUN; exit 0. .NET 10 SDK available; TF-22/24 need missing SDK 8. |
| Angular/shared TS/JS | `node tests/technology/angular-typescript/run-fact-checks.mjs --report "$scratch/angular-typescript.md"` | 3 PASS (JF-03/04/05), 0 FAIL, 19 NOT_RUN; exit 0. No supplied Angular/TS compiler/npm fixture. |
| React/Next | `node tests/technology/react-nextjs/run-fact-checks.mjs --report "$scratch/react-nextjs.md"` | 3 PASS, 0 FAIL, 13 NOT_RUN; exit 0. PASS only synthetic NF-03/04/06 JS/Web boundary checks. |
| Vue/Nuxt/Vite | `node tests/technology/vue-nuxt-vite/run-fact-checks.mjs --report "$scratch/vue-nuxt-vite.md"` | 2 PASS, 0 FAIL, 16 NOT_RUN; exit 0. UF-04/BF-03 only JS exposure counterexamples. |
| SQL Server/EF/Dapper/ADO.NET | `node tests/technology/sqlserver/run-fact-checks.mjs --report "$scratch/sqlserver.md" --json "$scratch/sqlserver.json"` | 30 PASS, 0 FAIL, 0 NOT_RUN; exit 0. DR-01..03, SF-01..27 on SQL Server 17.0.4025.3 Express LocalDB. |
| PostgreSQL/Npgsql/cross-stack | `node tests/technology/postgres-crossstack/run-fact-checks.mjs --report "$scratch/postgres-crossstack.md" --json "$scratch/postgres-crossstack.json" --pg-bin "$env:TEMP/chpg/pgsql/bin" --python "$env:TEMP/chpy/Scripts/python.exe"` | 40 PASS, 0 FAIL, 2 NOT_RUN; exit 0. DR-01..04, PF-01..24, 12/14 XF checks on PostgreSQL 18.6 and .NET 10, including extended XF-06 and both-engine XF-13/14. XF-02/12 need unavailable Node tools. |
| Additional packaged Markdown links | `node --input-type=module` with the exact PowerShell script in TECHNOLOGY_COVERAGE_AUDIT §8 | PASS: 217 files, 248 local links, zero missing/escaping targets; skill heading anchors also checked by V-08. |
| Diff whitespace | `git diff --check` | PASS, exit 0. |

An initial PostgreSQL run without a binary path reported 12 PASS/30 NOT_RUN;
the final run supplied existing `%TEMP%/chpg/pgsql/bin` and the existing
Python environment. While developing XF-06, the new positive assertion failed
after reusing the connection from an intentionally rejected parameter write;
it now uses a fresh connection and the complete suite re-run passed.
These attempts are not added to the final check totals.

### Unexecuted verification, risks, and stop

- Full Angular/ASP.NET/SQL Server, React/Next/PostgreSQL and Vue/Nuxt
  frontend/SSR/browser scenarios, all ten agent scenario evaluations, and
  provider-native G-11/G-12 behavior runs: **NOT_RUN** (R-49).
- The artifact lists all 52 skipped facts. Missing framework fixtures,
  .NET 8, TS/generator and Playwright Node tools are not treated as passes.
  Current Node is 24.15.0; earlier reports on Node 26 were not reused.
- Node 18 maintainer-tool compatibility is contradicted by source/API
  evidence, not executed here; R-50 remains open. Existing R-35..R-48 and
  pending layout decisions remain open; no historical status is rewritten.
- Primary API documentation was checked for the audit findings; links/date
  and limits are in TECHNOLOGY_COVERAGE_AUDIT §7. Live documentation checks
  are not application/runtime verification.
- All runtime access was local/disposable. The existing LocalDB ChayenFacts
  instance remains. One diagnostic --keep run left a stopped temporary
  PostgreSQL fixture at `%TEMP%/chayen-pgx-facts-hW2HSS`; final runner clusters
  were stopped and deleted. Consolidated scratch reports are outside the
  plugin; no new package installation or global configuration change.
- No commits, push, publication, release, instruction-file edits, or work
  beyond STEP 28. **STEP 28 PARTIAL; STOP.**

---

## Step 29 — Composite engineering workflows and reusable templates

- **Date:** 2026-10-15 (Asia/Bangkok)
- **Status:** DONE (pending review; static content IMPLEMENTED, native-agent
  behavior NOT_RUN). STOP after STEP 29. STEP 28 remains PARTIAL.

### Work performed

- Read BUILD_CONTRACT.md, ARCHITECTURE.md and the completed engineering and
  technology catalogs. Preserved the existing uncommitted STEP 28 work.
- Added the exact 12 composite workflows as skill-local checklist references
  across eight existing owners. Each defines applicability and exclusions,
  inputs, existing recipe reuse, conditional technology selection, staged
  inputs/actions/exit checks, outputs, verification, approval evidence,
  proportionality, blockers and handoff. No matching workflow continues normal
  native behavior; small tasks use direct recipes and relevant checks.
- Added the seven requested reusable format leaves: Task Contract,
  Implementation Plan, Risk Assessment, Verification Report, Change Passport,
  Context Capsule / Agent Handoff and Architecture Decision Record. Four
  existing artifact recipes now name the reusable formats. Repository formats
  take precedence; artifacts remain in conversation unless files are requested
  or established by the repository. Approval defaults remain NOT_PROVIDED.
- Added developer-only composite-workflows.json, V-24 static checks, generated
  WORKFLOW_COVERAGE.md, 47 workflow/template evaluation specifications and 16
  validator mutations. Integrated V-24 as the sixth automated gate group and
  a fourth baseline validator. Native workflow execution is never performed
  by the checker or by the catalog.
- Kept 13 entry skills, their descriptions and L0 5,485/5,500 unchanged.
  Engineering remains 206 IMPLEMENTED and technology 108 IMPLEMENTED; new
  workflow records are 12 IMPLEMENTED, all 0 VERIFIED. ARC-08..ARC-10 become
  IMPLEMENTED; the acceptance summary now has 65 IMPLEMENTED, 19 IN_PROGRESS,
  one PLANNED and zero VERIFIED rows. D-045 scope follows the explicit user
  request; layout is PROPOSED, not claimed accepted.

### File ledger (STEP 29 delta only)

This ledger excludes unchanged files already dirty from STEP 28. No files
were deleted; no user instruction file, dependency or marketplace was changed.

| Action | Path |
|---|---|
| Created | `catalog/composite-workflows.json` |
| Modified | `docs/chayen/ACCEPTANCE_MATRIX.md` |
| Modified | `docs/chayen/ARCHITECTURE.md` |
| Modified | `docs/chayen/DECISIONS.md` |
| Modified | `docs/chayen/IMPLEMENTATION_PLAN.md` |
| Modified | `docs/chayen/ISSUES.md` |
| Modified | `docs/chayen/PROGRESS.md` |
| Modified | `docs/chayen/SKILL_AUTHORING_STANDARD.md` |
| Modified | `docs/chayen/SKILL_QUALITY_GATES.md` |
| Created | `docs/chayen/WORKFLOW_COVERAGE.md` |
| Modified | `plugins/codejadee-chayen-framework/README.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-ai-engineering/references/context-capsule-template.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-ai-engineering/references/session-handoff.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-ai-engineering/SKILL.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-architecture/references/architecture-decision-record-template.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-architecture/references/decision-records.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-architecture/SKILL.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-backend/references/workflow-api-integration.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-backend/SKILL.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-data/references/workflow-schema-migration.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-data/SKILL.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-devops/references/workflow-incident-investigation.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-devops/references/workflow-release-readiness.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-devops/SKILL.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-documentation/references/workflow-pull-request.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-documentation/SKILL.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-implementation/references/change-passport-template.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-implementation/references/change-summary.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-implementation/references/implementation-plan-template.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-implementation/references/risk-assessment-template.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-implementation/references/task-contract-template.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-implementation/references/task-contract.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-implementation/references/verification-report-template.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-implementation/references/workflow-bug-repair.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-implementation/references/workflow-dependency-upgrade.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-implementation/references/workflow-new-feature.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-implementation/references/workflow-refactoring.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-implementation/SKILL.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-performance/references/workflow-performance-investigation.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-performance/SKILL.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-security/references/workflow-security-review.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-security/SKILL.md` |
| Created | `plugins/codejadee-chayen-framework/skills/chayen-testing/references/workflow-testing-regression.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-testing/SKILL.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/README.md` |
| Created | `tests/catalog/workflow-mutations.json` |
| Created | `tests/skills/workflow-cases.json` |
| Created | `tests/workflows/results/step29-validation.md` |
| Created | `tools/catalog/check-workflows.mjs` |
| Modified | `tools/catalog/README.md` |
| Modified | `tools/validate/README.md` |
| Modified | `tools/validate/run-validator-tests.mjs` |
| Modified | `tools/validate/validate-all.mjs` |
| Deleted | None |

### Verification actually executed

| Check | Exact command | Observed result |
|---|---|---|
| Workflow coverage generation | `node tools/catalog/check-workflows.mjs --write-doc` | PASS, exit 0; V-24.1..6, generated coverage |
| Workflow/template static check | `node tools/catalog/check-workflows.mjs` | PASS, exit 0; 12 workflows, seven template leaves, 47 specifications |
| Approval control smoke | `node tools/validate/run-validator-tests.mjs --only wf29-approval-control` | PASS, 5/5; four baselines and missing-approval-control mutation |
| All automated gates | `node tools/validate/validate-all.mjs` | PASS, exit 0; six gate groups and 132/132 self-tests (four baselines plus 128 mutations, 16 new). G-11 is case-file sync only: 182 cases/433 files. |
| Package and reference validation | `node tools/validate/validate-package.mjs` | PASS, exit 0; 221 references reachable within two hops, 117 recipes, 445 recipe cases; three target-size warnings, no hard-limit failures |
| Engineering regression | `node tools/catalog/audit-coverage.mjs` | PASS, exit 0; 206/206 capabilities pass ten static criteria, zero broken mappings/orphan recipes |
| Technology regression | `node tools/catalog/check-technology.mjs` | PASS, exit 0; 108 capabilities, 295 specifications, synchronized coverage |
| Whitespace | `git diff --check` | PASS, exit 0 |

Durable results: tests/workflows/results/step29-validation.md. These checks
validate content, mappings and checker rejection behavior. They do not execute
agents, approve tasks, deliver features or prove framework/runtime behavior.

### Decisions, risks, unexecuted checks and stop

- D-045 records the user-directed scope, existing owner-local layout,
  conditional composition, proportional artifacts and actual approval evidence.
  No new architecture pattern or reference-kind exception was introduced.
- R-51: all 47 native-agent workflow/template behavior cases and provider
  routing/handoff evaluations are NOT_RUN. Quoted/generated approvals, valid
  prior authorization reuse, no-match/low-risk behavior, partial completion and
  missing mandatory release evidence require live transcript evaluation before
  any VERIFIED promotion.
- Three acknowledged target-size warnings: implementation 208 lines, backend
  211 and frontend 215, all under the 300-line hard limit. L0 is unchanged.
- Existing STEP 28 R-49/R-50, unrecorded Steps 24–25 R-45 and pending earlier
  layout decisions remain open. Its 52 NOT_RUN facts were not rerun or promoted.
- Application/framework tests, native-provider lifecycle/model execution and
  production operations are NOT_RUN in STEP 29. No consumer project, database,
  credential, production configuration, publication, commit or release changed.
- **STOP after STEP 29.** No later step was started.


## Step 30 — Security hardening and plugin trust review

- **Date:** 2026-10-15
- **Status:** DONE for the requested offline security review/hardening scope,
  pending independent/user review; native runtime defenses are not VERIFIED.
- **Scope:** STEP 30 only. Baseline clean main at 705ad1b. No commit, push,
  release, external marketplace edit, install or later step performed.
- **Authority:** the user's STEP 30 request authorizes these scoped local
  security changes. No provider use, billing, deployment, destructive consumer
  operation or organization risk acceptance is inferred. Recommendations,
  generated records and opt-in flags are not approval evidence.

### Review coverage and changes

- Reviewed both metadata-only manifests, all three local marketplace sources,
  every entry SKILL.md and all 221 reference/template files. Package inventory
  is 238 files: 236 Markdown plus two JSON, with 117 recipes, 76 technology
  references, 20 checklists and eight templates (seven introduced in STEP 29).
  Whole-file scan/hash evidence and the review method/limits are retained;
  contextual inspection does not claim line-by-line semantic certification.
- SECURITY_MODEL.md, THREAT_MODEL.md and PLUGIN_TRUST_REVIEW.md cover all ten
  requested threats, least privilege, actual authorization, supply-chain and
  native permission boundaries. Architecture/acceptance traceability updated;
  requirement/catalog statuses and summary counts remain unchanged.
- Corrected user-first precedence in all 13 entries to respect higher-priority
  system/developer rules and native permissions. Explicitly retain untrusted
  repository/tool/template data, script inspection, no approval promotion and
  no credentials/upload requirement. Descriptions and L0 remain unchanged.
- Hardened mutation/staging paths, case IDs, linked inputs and temp cleanup;
  fresh staging refuses existing destinations instead of deleting them.
  Restricted YAML keys and eval category/skill metadata reject unsafe input.
  Security/package parser diagnostics suppress raw input that could leak a
  secret. Added V-25 static preflight and offline boundary regressions.
- Optional lifecycle runner no longer deletes the supplied directory; requires
  explicit opt-in, fresh scratch and successful setup. Optional routing runner
  requires provider-call opt-in, empty outside-repo workdir, fresh output and
  explicit config home; removes arbitrary overrides/no-ask default. Docs remove
  routine trust bypass, real-home installs and personal-auth copying advice.
  Neither runner's actual provider path was executed.
- Inventoried 57 developer executable/dependency sources before execution of
  reviewed static tools; package/build/runtime fixture code stayed unexecuted.
  Eleven package URL literals and 31 direct fixture dependency declarations
  recorded without fetch/restore/advisory checks. No always-on hook, background
  process, telemetry, runtime engine/dependency, credential request or external
  source/prompt upload introduced.

### Actual verification (offline)

| Command / method | Observed result |
|---|---|
| node tools/validate/check-security.mjs --write-report | PASS V-25; 238 files, 13 entries, 221 references, 57 developer assets, 11 package URL literals, 31 direct fixture declarations; zero enforced-profile findings. |
| node --test --test-reporter=tap tests/security/boundaries.test.mjs | 32/32 PASS, zero FAIL/SKIP; traversal/ID/junction controls, parser keys, safe staging with sentinel preservation, eval metadata rejection, provider opt-in refusal, package-profile negatives and suppressed malformed-secret diagnostics. |
| node tools/validate/validate-all.mjs | Eight gate groups PASS; includes the same 32 security tests, 132/132 validator tests (four baselines + 128 negatives), all package/catalog/workflow/technology checks and 182 trigger / 433 generated-file synchronization. |
| node tools/validate/validate-package.mjs | Zero errors; five size-target warnings acknowledged: backend 219, data 205, devops 207, frontend 223, implementation 215 lines; each below hard limit 300. |
| node --check on every inventoried .mjs | 23/23 PASS, syntax only; module bodies not executed by this check. |
| C:/Program Files/Git/bin/bash.exe -n tests/provider-compatibility/run-lifecycle.sh | Exit 0; syntax only, no shell body/provider execution. |
| git diff --check | PASS; normal Windows LF/CRLF notices do not change the content verdict. |

Environment: Windows PowerShell, Node 24.15.0. Durable records:
[static inventory](../../tests/security/results/step30-static-review.json),
[boundary TAP](../../tests/security/results/step30-boundaries.tap),
[gate output](../../tests/security/results/step30-gates.txt), and
[syntax checks](../../tests/security/results/step30-syntax-checks.json).
Scripts/imports and effect sites were inspected before execution; no external
repository instruction was treated as authority to run a command.

### Unexecuted verification and residual risks

Native-agent prompt injection/forged approval scenarios, provider install,
authentication/UI and permission effectiveness, billed model/routing/workflow
tests, remote installation/update/provenance, live links/advisories, package
restore, technology/database/browser/runtime tests and CI/OS ACL controls are
**NOT_RUN**. Historical provider/technology facts were not rerun. R-52 records
these limits: static instruction guards are advisory, heuristic scans can miss
secrets/malicious content, local checks cannot defend against a malicious
maintainer/validator, and path checks do not eliminate host races. Real controls
remain with the provider, OS, account and external CI. No security certification,
organization-policy enforcement or release approval is claimed.

STEP 28 remains PARTIAL (R-49/R-50); STEP 29 behavior remains NOT_RUN (R-51).
Engineering 206, technology 108 and workflows 12 stay IMPLEMENTED, zero VERIFIED.
No decision/waiver is claimed accepted merely because this review was written.
STOP after STEP 30.

### File ledger (STEP 30 only)

Baseline was clean. No files were deleted; the existing manifests and
marketplace definitions were reviewed without modification. No consumer
AGENTS.md/CLAUDE.md file, credential, dependency version or native permission
setting was changed.

| Action | Path |
|---|---|
| Modified | `docs/chayen/ACCEPTANCE_MATRIX.md` |
| Modified | `docs/chayen/ARCHITECTURE.md` |
| Modified | `docs/chayen/IMPLEMENTATION_PLAN.md` |
| Modified | `docs/chayen/ISSUES.md` |
| Modified | `docs/chayen/PROGRESS.md` |
| Modified | `docs/chayen/SKILL_QUALITY_GATES.md` |
| Modified | `plugins/codejadee-chayen-framework/README.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-ai-engineering/SKILL.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-ai-engineering/references/agent-governance.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-architecture/SKILL.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-backend/SKILL.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-data/SKILL.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-devops/SKILL.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-documentation/SKILL.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-frontend/SKILL.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-implementation/SKILL.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-performance/SKILL.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-repository/SKILL.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-requirements/SKILL.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-security/SKILL.md` |
| Modified | `plugins/codejadee-chayen-framework/skills/chayen-testing/SKILL.md` |
| Modified | `tests/provider-compatibility/README.md` |
| Modified | `tests/provider-compatibility/run-lifecycle.sh` |
| Modified | `tests/routing/README.md` |
| Modified | `tests/routing/run-smoke.mjs` |
| Modified | `tools/catalog/catalog-lib.mjs` |
| Modified | `tools/evals/generate-claude-evals.mjs` |
| Modified | `tools/validate/README.md` |
| Modified | `tools/validate/run-validator-tests.mjs` |
| Modified | `tools/validate/validate-all.mjs` |
| Modified | `tools/validate/validate-package.mjs` |
| Created | `docs/chayen/PLUGIN_TRUST_REVIEW.md` |
| Created | `docs/chayen/SECURITY_MODEL.md` |
| Created | `docs/chayen/THREAT_MODEL.md` |
| Created | `tests/security/boundaries.test.mjs` |
| Created | `tests/security/results/step30-boundaries.tap` |
| Created | `tests/security/results/step30-gates.txt` |
| Created | `tests/security/results/step30-static-review.json` |
| Created | `tests/security/results/step30-syntax-checks.json` |
| Created | `tools/validate/check-security.mjs` |
| Created | `tools/validate/safe-paths.mjs` |

---

## Step 31 — Final native provider compatibility validation

- **Date:** 2026-10-15
- **Status:** PARTIAL. Static and shipped-code validation is complete. Native
  runtime validation was not executed, and the release gate is OPEN.
- **Scope:** STEP 31 only. Baseline clean `main` at b8e8dcd. No commit,
  push, publish, install, external marketplace change, or later step.

### Work performed

- Read the provider research, the compatibility matrix, the format and
  package decisions, the POC report, the Step 06 results, the BUILD_CONTRACT,
  all three marketplace files, and both manifests.
- Re-read the official pages S13 (Codex plugins), S15 (Copilot CLI plugin
  reference) and S18 (VS Code agent plugins) on 2026-10-15. There is no
  contradiction with Step 02. The new facts are in
  FINAL_PROVIDER_COMPATIBILITY.md §4.3.
- Recorded the provider versions for every CLI and VS Code surface.
- Determined manifest and marketplace precedence from the **installed
  provider code**, without executing any provider:
  - Claude Code binaries 2.1.270 and 2.1.299 contain no Agent Plugins
    reference.
  - Codex 0.160.1 and 0.162.0-alpha string tables.
  - The Copilot 1.0.97 `runtime.node` string table.
  - The VS Code 1.141.1 workbench marketplace and manifest detection
    functions, and the `chat.plugins.enabled` default and policy.
  - The Codex extension bundle (plugin RPC code present; documented as
    unsupported).
- Read-only checks of real provider homes:
  - no `chayen-*` name collision among 30 personal skills;
  - no stale Chayen install;
  - the Codex config has only a project trust entry.
  - Nothing was written to any provider home.
- Added the read-only `tests/provider-compatibility/check-identity.mjs`
  (IC-01..IC-13).
- Extended the existing `tests/provider-compatibility/README.md` with the
  full runbook R-0..R-10 and five shared probes:
  - P-AUTO, P-EXPL, P-NONE, P-NONE-2;
  - P-REF, which is new and covers reference loading.
  - The existing content was kept.
- Updated the skill counts in the two VS Code procedures.
- **Attempted and denied:**
  `CHAYEN_ALLOW_PROVIDER_LIFECYCLE=1 bash tests/provider-compatibility/run-lifecycle.sh <scratch>/lc31`.
  The session's permission classifier refused it ("Safety Bypass Flag"). It
  was not retried or worked around.
  - Billed model probes need the same kind of opt-in and were not attempted.
- No provider-specific catalog copy was created. None is required (§6 of the
  final report).

### Actual verification

| Command / method | Observed result |
|---|---|
| `node tools/validate/validate-all.mjs` (before and after changes) | All 8 gate groups PASS; 132/132 validator self-tests; 182 trigger cases / 433 files in sync; 5 known size-target warnings |
| `claude plugin validate --strict plugins/codejadee-chayen-framework` (CLI 2.1.270 and VS Code bundled 2.1.299) | `✔ Validation passed`, exit 0, both |
| `claude plugin validate --strict .` (marketplace; both binaries) | `✔ Validation passed`, exit 0, both |
| `node tests/provider-compatibility/check-identity.mjs` | 15/15 PASS, exit 0; totals 13 skills, 221 references, 238 files |
| `node --check tests/provider-compatibility/check-identity.mjs` | syntax OK |
| Shipped-code inspection (grep of the installed binaries and bundles) | See FINAL_PROVIDER_COMPATIBILITY.md §4.1 |
| `git diff --check` | PASS (only CRLF normalisation notices) |
| Native lifecycle, install, discovery, auto/explicit/no-match/reference probes, disable/update/uninstall, both VS Code UIs, remote marketplace | **NOT_RUN** (NOT_TESTED in the matrix), with exact steps in the runbook |

### Decisions, risks and open questions

- **No new decision.**
  - D-009 and D-013 still hold: one package, dual manifest, three native
    marketplace files.
  - The Agent Plugins `$schema` stays at 1.0.0, although Copilot accepts
    1.1.0, because Codex embeds only 1.0.0.
- **R-53 (new):** no native runtime evidence exists for the current 13-skill
  package. The release gate is OPEN.
- **R-54 (new):** `version` is still `0.1.0-dev`, so updates may not reach
  existing installs (Claude Code pins to `version`). Changing it needs
  release approval.
- **Q-02 still open:** Codex IDE extension (UNSUPPORTED).
- **Unchanged:** R-45, R-49..R-52 and DF-01/DF-02.

### File ledger (STEP 31 only)

| Action | Path |
|---|---|
| Created | `docs/chayen/FINAL_PROVIDER_COMPATIBILITY.md` |
| Created | `tests/provider-compatibility/check-identity.mjs` |
| Modified | `tests/provider-compatibility/README.md` (existing file extended; requested as "CREATE") |
| Modified | `tests/provider-compatibility/claude-code-vscode.md` (skill count) |
| Modified | `tests/provider-compatibility/copilot-vscode.md` (skill count) |
| Modified | `docs/chayen/PROVIDER_COMPATIBILITY_MATRIX.md` (§9) |
| Modified | `docs/chayen/PROVIDER_SPEC_RESEARCH.md` (UNVERIFIED status after STEP 31) |
| Modified | `docs/chayen/ACCEPTANCE_MATRIX.md` (REQ-01, REQ-10, PRV-CC/CX/GH evidence; statuses unchanged) |
| Modified | `docs/chayen/ISSUES.md` (R-53, R-54) |
| Modified | `docs/chayen/IMPLEMENTATION_PLAN.md` (Step 31 section) |
| Modified | `docs/chayen/PROGRESS.md` |
| Deleted | None |

No manifest, marketplace file, skill or reference was changed. STOP after STEP 31.
---

## Step 32 — Comprehensive evaluation suite

- **Date:** 2026-10-15
- **Status:** DONE for the executable scope, pending review.
  - Copilot, Codex, VS Code and full `claude plugin eval` were not
    executable or authorized here; they are recorded as NOT_RUN.
  - No behavior is VERIFIED.
- **Scope:** STEP 32 only. Baseline clean `main` at 51a2d5d. No commit, push,
  publish, marketplace install, credential copy or later step.
- **Authority:** the user's request to "run every test executable in the
  current environment" was taken as authorization for:
  - local fact runners;
  - bounded billed Claude Code probes, each loading the plugin read-only via
    `--plugin-dir`.

  The STEP 31 lifecycle denial was respected: no install-based run was
  attempted.

### Work performed

- **Suite.**
  - Built `tools/evals/run-evaluation-suite.mjs` (offline) covering 15
    categories and four separated evidence levels: static, simulated,
    actual provider, manual.
  - Added `tests/evaluation/`: README, 13 provider probes, the probe runner
    with offline `--rescore`, a six-stack fixture monorepo, and path-free
    results.
- **Traceability, now executable:**
  - 206/206 engineering records have positive and negative recipe cases,
    plus catalog triggers;
  - 108/108 technology records and 12/12 workflows have positive and
    negative cases;
  - the 11 requested routing examples each map to a trigger case and a
    provider probe.
- **Trigger cases.** Added 4 (186 total):
  - `neg-explicit-decline`;
  - `uns-rust-axum-handler`;
  - `amb-monorepo-order-total`;
  - `amb-destructive-production-drop`.

  Regenerated the Claude eval cases (441 files).
- **Executed** all six technology fact runners and 31 billed Claude Code
  runs:
  - one empty-workspace check;
  - Run A: 13 probes;
  - a re-run of the Next.js and pytest probes, ×2 each;
  - Run B: 13 probes on the current package.
- **Copilot attempt:** the isolated home was unauthenticated (exit 1, no
  model call). Codex was not attempted, because it needs an install.
- **Fixes:**
  - explicit-invocation evidence rule and transcript-based routing scoring;
  - path-resolution guard in all 13 SKILL.md files (D-046);
  - DF-01 CRLF check;
  - R-50 Node declaration;
  - fixture copy filter and git long paths;
  - path scrubbing of results.
- **Environment note.** IDE C# tooling restored
  `tests/evaluation/fixture/src/Api` in place (`bin/` and `obj/`, which are
  git-ignored, appeared seconds after the copy). The runner now excludes
  them.

### Actual verification

| Command | Observed result |
|---|---|
| `node tools/validate/validate-all.mjs` (final) | 8 gate groups PASS; 132/132 validator self-tests; 186 cases / 441 files in sync; 5 known size warnings |
| `node tools/validate/check-security.mjs` | V-25 PASS: 238 package files, 13 entries, 221 references, 67 developer assets, 32 fixture dependency references, 0 errors |
| `node tools/evals/run-evaluation-suite.mjs --write --facts <scratch> --probes <3 summaries>` | Exit 0: S-ALL, S-IDENTITY 15/15, S-AUDIT206, S-EVALSYNC, T-206 206/206, T-TECH 108/108, T-WF 12/12, T-ROUTING 11/11, S-HANDOFF PASS. Simulated proxy: top-1 0.546, top-3 0.769, no-match 0.441. |
| `node tests/technology/<6 packs>/run-fact-checks.mjs` (PostgreSQL with `--pg-bin` and `--python` from the STEP 28 temporary installs) | 107 PASS / 0 FAIL / 52 NOT_RUN (dotnet 29/0/2, SQL Server 30/0/0, PostgreSQL+cross-stack 40/0/2, Angular/TS 3/0/19, React/Next 3/0/13, Vue/Nuxt/Vite 2/0/16) |
| `node tests/evaluation/run-provider-probes.mjs --allow-provider-calls --provider claude --out <scratch>` (Runs A and B), plus `--only pr-nextjs-route,pr-pytest --runs 2` | Claude Code 2.1.270, `claude-sonnet-5`: Run A 12/13, re-run 0/4, Run B 12/13 (after `--rescore`); fixture unchanged in all sets; about $6.44 in total |
| Pooled across 30 recorded runs | Positive routing 14/20, precision 14/14, no-match 8/8, references 8/16, 13/13 skills discovered, completion 22/26 (turn limit 4) |
| Agent-read behavior grading (model-authored text only) | Most routing-adjacent behavior passed both runs; verification-evidence items 3/10; repository rule cited 0/2 |
| Path-resolution transcripts | Repository-root path attempts in skill-loaded transcripts: 3/7 before the guard, 0/7 after (one-sided Fisher p ≈ 0.10) |
| `node tools/evals/generate-claude-evals.mjs --check` with a CRLF copy, and with a content change | Exit 0 and exit 1 respectively (DF-01 fixed) |
| `node --check` on the 4 new or changed scripts | Syntax OK |
| `git diff --check` | PASS (only CRLF normalisation notices) |

### Decisions, risks and open questions

- **D-046 (new):** evaluation evidence levels, probe scoring rules, and the
  path-resolution guard. Scope is ACCEPTED; wording and rules are PROPOSED.
- **R-55 (new):** evaluation residuals. See EVALUATION_GAPS.md EG-01..EG-20.
  Highlights:
  - Next.js route under-trigger (0/4);
  - pytest instability (2/4);
  - verification quality 3/10;
  - single provider, with no baseline arm.
- **Resolved:** DF-01 FIXED; R-50 RESOLVED (the declaration is corrected;
  the 20.11 minimum itself is untested).
- **Unchanged:** R-53/R-54 (provider release gate), R-45, R-49, R-51, R-52.
  Descriptions and L0 are unchanged (5,485/5,500).
- **Statuses:** all acceptance, catalog, technology and workflow statuses
  are unchanged. Nothing was promoted to VERIFIED.

### File ledger (STEP 32 only)

| Action | Path |
|---|---|
| Created | `docs/chayen/EVALUATION_REPORT.md` |
| Created | `docs/chayen/EVALUATION_GAPS.md` |
| Created | `tools/evals/run-evaluation-suite.mjs` |
| Created | `tests/evaluation/README.md` |
| Created | `tests/evaluation/provider-probes.json` |
| Created | `tests/evaluation/run-provider-probes.mjs` |
| Created | `tests/evaluation/fixture/` (18 files: ASP.NET Core, Angular, Next.js, Python, PostgreSQL SQL, Rust, AGENTS.md, README.md) |
| Created | `tests/evaluation/results/step32-evaluation.json`, `step32-claude-run-a.json`, `step32-claude-rerun.json`, `step32-claude-run-b.json` |
| Created | `tests/evals/claude/{neg-explicit-decline,uns-rust-axum-handler,amb-monorepo-order-total,amb-destructive-production-drop}/` (generated) |
| Modified | `plugins/codejadee-chayen-framework/skills/*/SKILL.md` (all 13: path-resolution guard) |
| Modified | `tests/skills/trigger-cases.json`, `tests/skills/README.md`, `tests/routing/README.md` |
| Modified | `tools/evals/generate-claude-evals.mjs` (DF-01, Node declaration) |
| Modified | `tools/catalog/check-catalog.mjs`, `tools/catalog/check-technology.mjs`, `tools/catalog/README.md`, `tools/validate/README.md`, `tools/validate/run-validator-tests.mjs`, `tools/validate/validate-all.mjs`, `tools/validate/validate-package.mjs` (Node declaration only) |
| Modified | `docs/chayen/ACCEPTANCE_MATRIX.md`, `DECISIONS.md`, `ISSUES.md`, `IMPLEMENTATION_PLAN.md`, `PROGRESS.md` |
| Deleted | None |

Raw transcripts, fact JSON and logs stay in the session scratch directory,
because they contain local paths. STOP after STEP 32.
---

## Step 33 — Distribution preparation

- **Date:** 2026-10-15
- **Status:** DONE, pending review. **Not released.**
- **Scope:** STEP 33 only. Baseline clean `main` at c5d4905, in sync with
  `origin/main`. No commit, push, tag, publication, marketplace submission,
  version change, or licence file.

### Work performed

- **User documentation:**
  - `README.md`, `SECURITY.md`, `CHANGELOG.md` (an `[Unreleased]` section,
    proposed `0.1.0`);
  - in `docs/`: GETTING_STARTED, INSTALL_CLAUDE_CODE, INSTALL_CODEX,
    INSTALL_COPILOT, AUTOMATIC_SKILL_DISCOVERY, SUPPORTED_TECHNOLOGIES,
    SKILLS_CATALOG, DEVELOPMENT_WORKFLOWS, SECURITY_AND_LIMITATIONS,
    COMPATIBILITY_MATRIX, CONTRIBUTING.

  All ten required topics are covered:
  - what Chayen is and is not;
  - native install;
  - normal prompts;
  - automatic selection;
  - no-match behaviour;
  - technology detection;
  - explicit invocation per provider;
  - disable, update and uninstall per provider and surface;
  - bug and skill requests;
  - what cannot be guaranteed.
- **Release material** in `docs/distribution/`:
  - LICENSE_PROPOSAL (options A–D; no LICENSE file);
  - RELEASE_METADATA (current metadata validated, proposed changes not
    applied, owner-only items);
  - MARKETPLACE_LISTINGS (drafts for Claude Code, Codex and Copilot; not
    submitted);
  - RELEASE_CHECKLIST.
- **Facts established for the docs, read-only:**
  - `git remote` is `https://github.com/CodeJaDee/codejadee-chayen-framework`;
  - `gh repo view` reports the repository as **PRIVATE** with issues
    enabled and no licence;
  - the private vulnerability reporting API returned "Not Found";
  - all git authors are the `0xPratyaDev7x` account (also "Pratya S.");
  - there are no AI co-author trailers.

  Credits follow the user's wording: Project Owner, Git-history
  contributors, an AI-assisted development note, and the licence pending.
  No email addresses were published.
- **Documentation gate.** Added `tools/validate/check-docs.mjs` and
  registered it as G-14 in `validate-all.mjs`. It checks links, anchors,
  plugin identifiers, skill names, and `-dev` versions.
- **Shipped plugin README:** replaced the outdated "not yet measured" line
  with a pointer to the measured status.
- **Defect found and fixed:** the Visual Studio `.gitignore` rule
  `[Rr]elease/` silently ignored `docs/release/`. The folder was renamed to
  `docs/distribution/`; `.gitignore` is unchanged.

### Actual verification

| Command | Observed result |
|---|---|
| `node tools/validate/check-docs.mjs --list-external` | PASS: 18 files, 0 errors. Two external links listed and not fetched (keepachangelog.com, semver.org). |
| Negative controls on a scratch copy (broken link, missing anchor, wrong identifier, unknown skill, wrong `-dev` version) | 5/5 detected, as D-01..D-05 |
| `node tools/validate/validate-all.mjs` | 9 gate groups PASS, including G-14; 132/132 validator self-tests |
| `node tests/provider-compatibility/check-identity.mjs` | 15/15 PASS |
| `claude plugin validate --strict plugins/codejadee-chayen-framework` and `.` (2.1.270) | `✔ Validation passed` (both) |
| `node tools/validate/check-security.mjs` | V-25 PASS; package still 238 files, 0 errors |
| `node tools/evals/run-evaluation-suite.mjs` | Static and traceability levels PASS |
| Manifest metadata vs `git remote get-url origin` | `homepage` and `repository` match in both manifests. `license` is absent in both. Copilot entry and `metadata.version` are `0.1.0-dev` (parity). |
| `git check-ignore` on `docs/release/*` and `docs/distribution/*` | The former was ignored by `.gitignore:23`; the latter is not |
| `git diff --check` | PASS (only CRLF notices) |

No provider install, model call, network write, push, or publication was
executed. Install instructions are labelled with their actual verification
status, from STEP 31 and STEP 32 evidence.

### Decisions, risks and open questions

- **R-56 (new):** distribution prerequisites only the owner can supply:
  - licence;
  - publisher or legal identity;
  - public URL;
  - security contact;
  - support channel.
- **Q-05** annotated with the proposal.
- **Unchanged:** R-53 (install re-verification), R-54 (version), R-55
  (evaluation residuals), Q-02, Q-08. All capability, technology and
  workflow records remain IMPLEMENTED, 0 VERIFIED.
- **Acceptance:** GOV-18 added as IMPLEMENTED (user review pending); REQ-01
  evidence updated.

### File ledger (STEP 33 only)

| Action | Path |
|---|---|
| Created | `README.md`, `SECURITY.md`, `CHANGELOG.md` |
| Created | `docs/GETTING_STARTED.md`, `docs/INSTALL_CLAUDE_CODE.md`, `docs/INSTALL_CODEX.md`, `docs/INSTALL_COPILOT.md`, `docs/AUTOMATIC_SKILL_DISCOVERY.md`, `docs/SUPPORTED_TECHNOLOGIES.md`, `docs/SKILLS_CATALOG.md`, `docs/DEVELOPMENT_WORKFLOWS.md`, `docs/SECURITY_AND_LIMITATIONS.md`, `docs/COMPATIBILITY_MATRIX.md`, `docs/CONTRIBUTING.md` |
| Created | `docs/distribution/LICENSE_PROPOSAL.md`, `docs/distribution/RELEASE_METADATA.md`, `docs/distribution/MARKETPLACE_LISTINGS.md`, `docs/distribution/RELEASE_CHECKLIST.md` |
| Created | `tools/validate/check-docs.mjs` |
| Modified | `tools/validate/validate-all.mjs` (G-14), `tools/validate/README.md` |
| Modified | `plugins/codejadee-chayen-framework/README.md` (status line only) |
| Modified | `docs/chayen/ACCEPTANCE_MATRIX.md`, `ISSUES.md`, `IMPLEMENTATION_PLAN.md`, `PROGRESS.md` |
| Deleted | None. Manifests and marketplace files are unchanged. |

STOP after STEP 33.
---

## Step 34 — Final independent completeness audit

- **Date:** 2026-10-15
- **Status:** DONE (audit complete). Release decision pending the project
  owner.
  - **Recommendation:** NO-GO for public release; CONDITIONAL-GO for a
    limited internal pilot.
- **Scope:** STEP 34 only. Baseline clean `main` at 1d75c70, in sync with
  `origin/main`. No commit, push, tag, publication, submission, version
  change, or install.
- **Independence:** earlier completion claims were not assumed.
  - Every available validator and automated test was re-run.
  - An independent audit script was written that does not use the project
    validators.
  - Recorded provider results were re-derived from the raw transcripts.
  - A new actual-provider run was executed.

### Actual verification

| Command / method | Observed result |
|---|---|
| T01 `node tools/validate/validate-all.mjs` | 9 gate groups PASS |
| T02 `node tools/validate/check-docs.mjs --list-external` | 18 files, 0 errors |
| T03 `node tests/provider-compatibility/check-identity.mjs` | 15/15 |
| T04 `node tools/validate/check-security.mjs` | V-25 PASS, 0 errors |
| T05 `node --test tests/security/boundaries.test.mjs` | 32/32 pass |
| T06–T13 validate-package, check-catalog, audit-coverage, check-technology, check-workflows, eval `--check`, validator self-tests, evaluation suite | All exit 0; 132/132 self-tests; 186 cases / 441 files in sync |
| T14–T17 `claude plugin validate --strict` (plugin and marketplace; CLI 2.1.270 and bundled 2.1.299) | `✔ Validation passed` ×4 |
| T18–T20 `node --check` on 28 `.mjs` files; `bash -n run-lifecycle.sh`; `git diff --check` | All pass |
| F1–F6 six `run-fact-checks.mjs` suites | 107 PASS / 0 FAIL / 52 NOT_RUN |
| Independent audit script (scratch) | 206 unique IDs, 20 domains, 117 recipes. 206/206 recipes exist, declare their ID, are linked, have ≥406 words, and have positive and negative cases. 0 broken links, 0 unreachable references, 108/108 technology records. Package: 236 .md + 2 .json. 0 forbidden components, 0 secret hits. 3 flag types reviewed by hand: all false positives. |
| `run-provider-probes.mjs --rescore` on the Step 32 raw transcripts | Run A, re-run, Run B: 30/30 records MATCH the committed summaries |
| `run-provider-probes.mjs --allow-provider-calls --provider claude` (Run C, about $2.67) | 9/13. ASP.NET, Angular and SQL Server loaded no skill this time; Next.js again none. Fixture unchanged; 13/13 skills discovered. |
| `run-evaluation-suite.mjs --facts … --probes` ×4 | Pooled 43 runs: automatic 12/22, explicit 6/6, no-match 12/12, wrong skill 0/18, references 10/22 |

No validator or regression test failed. Provider probe failures and
untested surfaces are listed in FINAL_AUDIT_REPORT §§2, 4, 5. Lifecycle
install, Copilot, Codex, VS Code and `claude plugin eval` were NOT_RUN
(reasons in §1).

### Findings and corrections

- **Charter success criteria:**
  - 1 (all rows VERIFIED or DEFERRED): NOT MET;
  - 2 (native install of this build per provider): NOT MET;
  - 3 (positive and negative triggers): PARTIAL;
  - 4 (automated validation): MET.
- **Acceptance:**
  - EX-01..EX-07 moved to VERIFIED, because the release inspection was
    executed;
  - stale cells annotated (REQ-02, REQ-06, ARC-01, ARC-04);
  - REQ-02 and REQ-04 evidence appended.
- **Routing reliability was overstated** by the Step 32-only figures. These
  were corrected to the pooled figures:
  - docs/AUTOMATIC_SKILL_DISCOVERY.md, docs/COMPATIBILITY_MATRIX.md,
    docs/SECURITY_AND_LIMITATIONS.md;
  - CHANGELOG.md;
  - docs/distribution/RELEASE_CHECKLIST.md;
  - EVALUATION_REPORT.md (a note);
  - R-55.

  Automatic invocation is relabelled "Measured", not "Verified".
- **DF-03 (new):** D-009 status inconsistency between DECISIONS.md and
  PLUGIN_FORMAT_DECISION.md, and a stale IMPLEMENTATION_PLAN overview. Left
  for the owner.
- **Blockers B-1..B-5:** R-56, R-53, R-54, untested providers and VS Code,
  and 55% automatic routing.

### File ledger (STEP 34 only)

| Action | Path |
|---|---|
| Created | `docs/chayen/FINAL_AUDIT_REPORT.md` |
| Created | `docs/chayen/RELEASE_READINESS.md` |
| Created | `docs/chayen/KNOWN_LIMITATIONS.md` |
| Created | `tests/evaluation/results/step34-claude-run-c.json` (path-free) |
| Modified | `docs/chayen/ACCEPTANCE_MATRIX.md`, `docs/chayen/ISSUES.md`, `docs/chayen/EVALUATION_REPORT.md`, `docs/chayen/IMPLEMENTATION_PLAN.md`, `docs/chayen/PROGRESS.md` |
| Modified | `docs/AUTOMATIC_SKILL_DISCOVERY.md`, `docs/COMPATIBILITY_MATRIX.md`, `docs/SECURITY_AND_LIMITATIONS.md`, `CHANGELOG.md`, `docs/distribution/RELEASE_CHECKLIST.md` (metric corrections only) |
| Deleted | None. No shipped plugin file, manifest, or marketplace file changed. |

Audit logs, raw transcripts and fact JSON stay in session scratch. STOP
after STEP 34; awaiting project-owner approval.

## Step 35 — Multilingual Humanizer governance and architecture

- **Date:** 2026-10-17 (Asia/Bangkok).
- **Status:** DONE for Step 35 governance; pending Product Owner review.
- **Baseline:** clean `main`, commit `1106226`; no unrelated uncommitted work.
- **Scope:** only governance/documentation. Product implementation is PLANNED.

### Architecture impact and decisions

Approved scope (D-047) adds Thai/English editorial Skills and a target of 15,
ordinary-response multilingual guidance, existing-provider compatibility and
preservation of all engineering/technology/workflow coverage. Architecture
mechanisms remain PROPOSED in D-048–D-050 and ADR-0009–ADR-0011. Numbers
0009–0011 were unused before creation; no previous ADR status was changed.

Key conflicts: ≤14 Entry Skills; L0 5,485/5,500 with only 15 characters free;
engineering-only catalog ownership; ADR-0002/0003/D-007 zero always-on and
REQ-04 no-match behavior; ADR-0006 metadata-only portability. Proposed remedies
are ≤15 and L0 ≤6,500, a separate editorial registry, and explicitly scoped
opt-in style-only/host-documentation exceptions. None is applied to tooling,
package or existing constraints in this step. The 6,500 budget is an estimate
pending approval/measurement, not a host capacity claim.

Native Plugin + Opt-in Host Persistent Instructions is the preferred initial
proposal. A (native Skill discovery), B (opt-in host guidance) and C (strict
install-only guaranteed always-on) are explicitly separate. C is UNVERIFIED
and not claimed supported. Guidance remains advisory; native permissions and
higher-priority rules retain authority. Host integration and all new behavior
remain unverified. R-57 records review dependencies; R-53–R-56 and Step 34's
release recommendation remain unchanged.

MHR-001–MHR-012 cover the two Skills, intended output language, audit/rewrite,
website copy, terminology, semantic/factual fidelity, persistent guidance,
host compatibility, opt-in/disable/rollback, human quality, engineering
regressions and security/permissions. Every MHR is PLANNED and every MH-V
behavior method is NOT_RUN. Acceptance summary totals were recomputed from
rows (98 total, 13 PLANNED, 19 IN_PROGRESS, 59 IMPLEMENTED, 7 VERIFIED), including
already-existing GOV-18 and Step 34's seven VERIFIED exclusions. No legacy
requirement row/status or historical step body was rewritten.

### File ledger (Step 35 only)

| Action | Path |
|---|---|
| Created | `docs/chayen/HUMANIZER_ARCHITECTURE_IMPACT.md` |
| Created | `docs/chayen/HUMANIZER_REQUIREMENTS.md` |
| Created | `docs/chayen/ADRS/ADR-0009-multilingual-editorial-skills.md` |
| Created | `docs/chayen/ADRS/ADR-0010-persistent-multilingual-response-style-policy.md` |
| Created | `docs/chayen/ADRS/ADR-0011-multilingual-quality-and-safety.md` |
| Modified | `docs/chayen/ADRS/README.md` |
| Modified | `docs/chayen/PROJECT_CHARTER.md` |
| Modified | `docs/chayen/ARCHITECTURE.md` |
| Modified | `docs/chayen/DECISIONS.md` |
| Modified | `docs/chayen/IMPLEMENTATION_PLAN.md` |
| Modified | `docs/chayen/ACCEPTANCE_MATRIX.md` |
| Modified | `docs/chayen/ISSUES.md` |
| Modified | `docs/chayen/SKILL_AUTHORING_STANDARD.md` |
| Modified | `docs/chayen/SKILL_QUALITY_GATES.md` |
| Modified | `docs/chayen/PROGRESS.md` |
| Deleted | None |

### Read-only verification — actual commands and results

Inspected validator entry points, imports, write switches and aggregate-runner
side effects first. `check-docs.mjs` covers user/release documentation only,
not `docs/chayen/`; the inline governance check below covers changed governance
documents separately. No `--write-doc`, `--write-report`, eval generation,
staging or mutation runner was used. Node is absent from PATH: initial
`node --version` failed with CommandNotFoundException. The existing executable
`C:\Program Files\nodejs\node.exe` was located without installation; direct
`--version` returned v24.22.0. This environment correction changed no config.

In the commands below, `$taskNode = 'C:\Program Files\nodejs\node.exe'`.

| Command | Actual result |
|---|---|
| `& $taskNode tools/validate/check-security.mjs` | PASS, exit 0: V-25, 238 package files, 13 entries, 221 references, 68 developer assets, 32 fixture dependency references, 0 errors. Static only. |
| `& $taskNode tools/validate/validate-package.mjs` | PASS, exit 0: 13 Skills, L0 5,485/5,500, 221 references, 117 recipes / 206 capabilities, 445 recipe cases. 0 errors; five existing >200-line target warnings (backend 219, data 205, devops 209, frontend 223, implementation 217), all below 300 hard limit. |
| `& $taskNode tools/catalog/check-catalog.mjs` | PASS, exit 0: 206 unique capabilities / 20 domains, all IMPLEMENTED, 13 existing Skills, inventory fingerprint `2f13cad24ff431e3` unchanged. |
| `& $taskNode tools/catalog/check-technology.mjs` | PASS, exit 0: 108 records, 295 case specifications, coverage tables synchronized. No runtime facts executed. |
| `& $taskNode tools/catalog/check-workflows.mjs` | PASS, exit 0: 12 workflows, seven formats, 47 case specifications, coverage synchronized. Static only. |
| `& $taskNode tools/evals/generate-claude-evals.mjs --check` | PASS, exit 0: 186 cases / 441 files synchronized; no provider call. |
| `& $taskNode tools/validate/check-docs.mjs` | PASS, exit 0: 18 user/release documents, 0 errors; external links not fetched. |
| Inline governance check below, piped to `& $taskNode -` | PASS, exit 0: 15 changed governance files, 116 relative links/anchors, 12 MHR rows, 105 legacy table lines preserved, 0 errors. New ADRs remain PROPOSED; Steps 35–41 present; prior step history and implementation surfaces preserved; no Humanizer directories created. |
| `git diff --check` | PASS, exit 0; no whitespace errors. |

### Reproducible governance check

The following is a read-only documentation check, not shipped tooling. Run the
exact block with this PowerShell command (Node path defined above):

```powershell
$taskCheck = [regex]::Match((Get-Content docs/chayen/PROGRESS.md -Raw -Encoding utf8), '(?s)<!-- STEP35-CHECK -->\r?\n```javascript\r?\n(.*?)\r?\n```').Groups[1].Value
$taskCheck | & $taskNode -
```

<!-- STEP35-CHECK -->
```javascript
const fs = require('node:fs'), path = require('node:path');
const { execFileSync } = require('node:child_process');
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const files = [...new Set((git('diff', '--name-only', '--', 'docs/chayen') + '\n' + git('ls-files', '--others', '--exclude-standard', '--', 'docs/chayen')).split(/\r?\n/).filter(Boolean))];
const read = f => fs.readFileSync(f, 'utf8');
const errors = []; let links = 0;
function anchors(file) {
  const seen = new Map(), result = new Set();
  for (const m of read(file).replace(/```[\s\S]*?```/g, '').matchAll(/^#{1,6}\s+(.+?)\s*#*\s*$/gm)) {
    const base = m[1].replace(/`/g, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').toLowerCase().trim().replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s/g, '-');
    const n = seen.get(base) ?? 0; seen.set(base, n + 1); result.add(n ? `${base}-${n}` : base);
  }
  return result;
}
for (const file of files) for (const m of read(file).replace(/```[\s\S]*?```/g, '').matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
  if (/^(https?:|mailto:)/.test(m[1])) continue;
  const [rel, anchor] = m[1].split('#'), dest = rel ? path.resolve(path.dirname(file), decodeURI(rel)) : path.resolve(file);
  if (!fs.existsSync(dest) || (anchor && dest.endsWith('.md') && !anchors(dest).has(anchor.toLowerCase()))) errors.push(`${file}: ${m[1]}`);
  links++;
}
const matrix = read('docs/chayen/ACCEPTANCE_MATRIX.md');
const rows = matrix.split(/\r?\n/).filter(l => /^\| MHR-\d{3} \|/.test(l));
if (rows.length !== 12 || rows.some((r, i) => !r.startsWith(`| MHR-${String(i + 1).padStart(3, '0')} |`) || !r.endsWith('| NOT_RUN | PLANNED |'))) errors.push('MHR identity/status');
for (const n of ['0009', '0010', '0011']) {
  const names = fs.readdirSync('docs/chayen/ADRS').filter(f => f.startsWith(`ADR-${n}-`));
  if (names.length !== 1 || !read(`docs/chayen/ADRS/${names[0]}`).includes('**Status:** PROPOSED')) errors.push(`ADR ${n}`);
}
const plan = read('docs/chayen/IMPLEMENTATION_PLAN.md');
for (let n = 35; n <= 41; n++) if (!plan.includes(`| ${n} |`) || !plan.includes(`### Step ${n} `)) errors.push(`Step ${n} missing`);
const legacy = git('show', 'HEAD:docs/chayen/ACCEPTANCE_MATRIX.md').split(/\r?\n/).filter(l => /^\| (GOV|REQ|EX|PRV|STK|ARC|CAP)-/.test(l));
if (legacy.some(l => !matrix.includes(l))) errors.push('legacy requirement changed');
const old = git('show', 'HEAD:docs/chayen/PROGRESS.md').replace(/\r\n/g, '\n');
if (!read('docs/chayen/PROGRESS.md').replace(/\r\n/g, '\n').includes(old.slice(old.indexOf('## Step 01')).trimEnd())) errors.push('step history changed');
const changed = git('diff', '--name-only').split(/\r?\n/).filter(Boolean);
if (changed.some(f => !f.startsWith('docs/chayen/')) || files.length !== 15) errors.push('change scope');
for (const name of ['chayen-humanizer-th', 'chayen-humanizer-en']) if (fs.existsSync(`plugins/codejadee-chayen-framework/skills/${name}`)) errors.push('Skill created early');
console.log(JSON.stringify({ files: files.length, relativeLinks: links, MHRRows: rows.length, legacyTableLinesPreserved: legacy.length, errors }));
process.exit(errors.length ? 1 : 0);
```

### Unexecuted checks and stop

| Check | Result / reason |
|---|---|
| `validate-all.mjs`, validator self-tests and security mutation tests | NOT_RUN: aggregate includes scratch mutation/write operations; Step 35 selected read-only checks instead. No validator source changed. |
| Native host install/lifecycle, persistent instructions loading/rollback | NOT_RUN: no integration or user-level configuration changes in this step. |
| Billed provider evaluations, multilingual human quality and behavior tests | NOT_RUN: not authorized in Step 35; Skills/policy are not implemented. |
| Technology runtime facts and engineering model regressions | NOT_RUN: implementation surfaces unchanged; static inventory/sync checks only. |

No commit, push, tag, publication, release, provider install or Step 36 work.
STOP after Step 35 and wait for Product Owner review of the three proposals.

## Step 35 owner follow-up — Entry Skill ceiling 25 (D-051)

- **Date:** 2026-10-17 (Asia/Bangkok).
- **Authorization:** explicit user request to expand the ceiling to 25.
- **Scope:** narrow count amendment within Step 35; Step 36 is not started.
- **Status:** DONE; count amendment implemented and verified locally. Other
  architecture proposals and Step 36 remain pending.

The existing 13 Skills fit the old ≤14 ceiling, but the approved product
target of 15 did not. Updated V-07 (`validate-package.mjs`) and V-11.3
(`check-catalog.mjs`) to reject counts above 25. D-051 accepts that count
amendment only; ADR-0004 records it and ADR-0009 retains PROPOSED status for
the remaining architecture. Target stays 15, actual count stays 13; no extra
Skills, registry, runtime, integration, provider calls or user configuration.

The L0 limit remains 5,500, used 5,485. The proposed 6,500 budget is still
pending; raising the count does not provide usable metadata headroom or
resolve the editorial registry requirement. R-57 remains open for those
separate dependencies and policy/quality decisions.

### Follow-up file ledger (additional edits to the existing working tree)

| Action | Files |
|---|---|
| Modified | `tools/validate/validate-package.mjs`, `tools/catalog/check-catalog.mjs`, `tools/validate/README.md` |
| Modified | `tests/catalog/catalog-mutations.json`: rename/reword the old count-labelled case to reflect its actual capability-ownership check, without weakening the expected V-11.3 diagnostic. |
| Modified | `docs/chayen/ADRS/ADR-0004-skill-catalog-vs-entry-skills.md`, `docs/chayen/ADRS/ADR-0009-multilingual-editorial-skills.md`, `docs/chayen/ADRS/README.md` |
| Modified | `docs/chayen/ARCHITECTURE.md`, `docs/chayen/PROJECT_CHARTER.md`, `docs/chayen/DECISIONS.md`, `docs/chayen/HUMANIZER_ARCHITECTURE_IMPACT.md` |
| Modified | `docs/chayen/IMPLEMENTATION_PLAN.md`, `docs/chayen/ACCEPTANCE_MATRIX.md` (current count labels only; legacy status/evidence preserved), `docs/chayen/ISSUES.md` |
| Modified | `docs/chayen/SKILL_AUTHORING_STANDARD.md`, `docs/chayen/SKILL_QUALITY_GATES.md`, `docs/chayen/PROGRESS.md` |
| Created / deleted | None in this follow-up; the five untracked Step 35 documents already existed before this request. |

The original Step 35 inline governance checker asserts that step's exact
15-document-only change set and original requirement labels; it is retained
as historical evidence, not presented as a passing check on this expanded
follow-up working tree. The following boundary probe is developer-only
verification text, not a runtime or shipped file.

### Follow-up actual verification

Commands use `$taskNode = 'C:\Program Files\nodejs\node.exe'` (v24.22.0).
Existing validator/mutation sources and confined scratch cleanup were reviewed
before execution. The explicit follow-up authorizes these count-related local
checks, distinct from the original read-only Step 35 run.

| Command | Observed result |
|---|---|
| `& $taskNode tools/validate/check-security.mjs` | PASS, exit 0: 238 package files, 13 entries, 221 references, 0 errors. |
| `& $taskNode tools/validate/validate-package.mjs` | PASS, exit 0: 13 Skills, L0 5,485/5,500, 0 errors, same five line-target warnings. |
| `& $taskNode tools/catalog/check-catalog.mjs` | PASS, exit 0: 206 capabilities / 20 domains, 13 Skills, inventory fingerprint unchanged. |
| `& $taskNode tools/validate/run-validator-tests.mjs` | PASS, exit 0: 132/132, four baselines and 128 mutations. Run before renaming/rewording the misleading catalog fixture. |
| `& $taskNode tools/validate/run-validator-tests.mjs --only cat-entry-skill-without-capability` | PASS after fixture clarification, exit 0: 5/5 (four baselines plus the modified case); extra Skill rejected for owning no capability. |
| D-051 boundary probe below, extracted and piped to `& $taskNode -` | Final PASS, exit 0: 6/6 assertions. Both validators omit count-overflow at 25 and report it at 26; L0 overflow remains independently detected in both fixtures. |
| `& $taskNode tools/validate/check-docs.mjs` | PASS, exit 0: 18 user/release docs, 0 errors. |
| Inline link/anchor section of the original governance checker (before `const matrix =`), piped to `& $taskNode -`; historical snapshot assertions excluded | PASS, exit 0: 16 changed governance documents, 117 relative links/anchors, 0 errors. |
| `git diff --check` | PASS, exit 0. |

The first boundary probe run was FAIL (5/6), because its synthetic catalog
scope text was unquoted and the restricted-YAML parser rejected it before
count validation. Corrected the fixture quotation and added an explicit
assertion that parsing reached the expected count before accepting probe
results. The corrected 6/6 run is the final evidence; no validator count bug
was hidden. The existing mutation's old name implied a count test although
its actual diagnostic was `chayen-extra owns no capability`; it now names the
ownership rule accurately. Count boundary evidence comes from the probe.

### Count boundary probe

Run with `$taskNode = 'C:\Program Files\nodejs\node.exe'`:

```powershell
$taskProbe = [regex]::Match((Get-Content docs/chayen/PROGRESS.md -Raw -Encoding utf8), '(?s)<!-- D051-BOUNDARY -->\r?\n```javascript\r?\n(.*?)\r?\n```').Groups[1].Value
$taskProbe | & $taskNode -
```

<!-- D051-BOUNDARY -->
```javascript
const fs = require('node:fs'), os = require('node:os'), path = require('node:path');
const { spawnSync } = require('node:child_process');
const repo = process.cwd(), temp = fs.realpathSync(os.tmpdir());
const scratch = fs.mkdtempSync(path.join(temp, 'chayen-d051-'));
const rows = [];
try {
  for (const rel of ['plugins', 'catalog', '.claude-plugin', '.agents/plugins', '.github/plugin', 'tests/skills', 'docs/chayen/CAPABILITY_COVERAGE.md']) {
    const src = path.join(repo, rel), dest = path.join(scratch, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.cpSync(src, dest, { recursive: true, filter: p => { if (fs.lstatSync(p).isSymbolicLink()) throw Error('linked fixture'); return true; } });
  }
  const catalogFile = path.join(scratch, 'catalog/engineering-capabilities.yaml');
  const original = fs.readFileSync(catalogFile, 'utf8').replace(/\r\n/g, '\n');
  const extra = [];
  for (let n = 14; n <= 26; n++) {
    const name = `chayen-count-${n}`, dir = path.join(scratch, 'plugins/codejadee-chayen-framework/skills', name);
    fs.mkdirSync(dir);
    fs.writeFileSync(path.join(dir, 'SKILL.md'), `---\nname: ${name}\ndescription: Edit prose. Not for code or databases.\n---\n# Count fixture\n`);
    extra.push(`  - name: ${name}\n    mapping: existing\n    scope: "Synthetic fixture for count boundary verification only."\n`);
    if (n < 25) continue;
    fs.writeFileSync(catalogFile, original.replace('\ndomains:\n', '\n' + extra.join('') + '\ndomains:\n'));
    const run = args => { const r = spawnSync(process.execPath, args, { cwd: repo, encoding: 'utf8', timeout: 30000 }); if (r.error || r.status !== 1) throw Error('expected invalid fixture exit 1'); return r.stdout + r.stderr; };
    const pkg = run([path.join(repo, 'tools/validate/validate-package.mjs'), scratch]);
    const cat = run([path.join(repo, 'tools/catalog/check-catalog.mjs'), '--root', scratch]);
    if (!cat.includes(`Entry skills: ${n} `) || cat.includes('ERROR V-11.1 parse')) throw Error('catalog fixture did not reach count validation');
    rows.push({ count: n, check: 'package-count', pass: /ERROR V-07 metadata-budget: \d+ entry skills > /.test(pkg) === (n > 25) });
    rows.push({ count: n, check: 'catalog-count', pass: /ERROR V-11.3 entry-skills: \d+ entry skills exceed/.test(cat) === (n > 25) });
    rows.push({ count: n, check: 'L0-still-enforced', pass: /ERROR V-07 metadata-budget: L0 metadata .* > 5500/.test(pkg) });
  }
} finally {
  if (path.dirname(fs.realpathSync(scratch)) !== temp || !path.basename(scratch).startsWith('chayen-d051-')) throw Error('unsafe cleanup target');
  fs.rmSync(scratch, { recursive: true, force: true });
}
console.log(JSON.stringify(rows));
console.log(`${rows.filter(r => r.pass).length}/${rows.length} boundary assertions passed`);
process.exit(rows.length === 6 && rows.every(r => r.pass) ? 0 : 1);
```

These synthetic fixtures intentionally fail anatomy/ownership and L0 rules.
The probe checks count diagnostics at 25/26 and continued independent L0
enforcement only; it does not certify a valid 25-Skill product or host routing.

No commit, push, tag, publication, release or Step 36 execution.

## Step 35 owner follow-up — L0 metadata budget 6,500 (D-052)

- **Date:** 2026-10-17 (Asia/Bangkok).
- **Authorization:** user asked to resolve the outstanding metadata constraint
  after D-051; applied the previously proposed 6,500-character budget.
- **Scope:** V-07/evaluation-report budget and related governance alignment;
  no Skill creation, editorial registry, host integration or Step 36 work.
- **Status:** DONE; budget implemented and boundary/offline regressions PASS.

L0 is now capped at 6,500 rather than 5,500. Existing names/descriptions are
unchanged: 5,485 used, **1,015 free**. The two planned editorial names plus
two descriptions at the 420-character target would bring the estimate to
6,361, leaving 139. This is arithmetic against an internal budget, not actual
provider loading or a claim that 25 Skills fit a host context budget.
Count ceiling remains 25, actual count 13, product target 15; engineering,
technology and workflow inventories remain unchanged. ADR-0009's count and
L0 components are accepted through D-051/D-052; the editorial registry and
other architecture proposals remain PROPOSED. R-57 stays OPEN for them.

Updated both V-07 and `run-evaluation-suite.mjs`'s independent report cap to
avoid reporting the stale 5,500 limit. Current docs reflect the accepted
budget; historical decision/test measurements are preserved. Original Step 35
and D-051 inline probes are historical snapshots with old fixed assumptions;
their recorded results are not claimed as current reruns under D-052.

### D-052 file ledger (edits to the existing working tree)

| Action | Files |
|---|---|
| Modified | `tools/validate/validate-package.mjs`, `tools/evals/run-evaluation-suite.mjs`, `tools/validate/README.md` |
| Modified | `docs/chayen/ADRS/ADR-0004-skill-catalog-vs-entry-skills.md`, `docs/chayen/ADRS/ADR-0009-multilingual-editorial-skills.md`, `docs/chayen/ADRS/README.md` |
| Modified | `docs/chayen/ARCHITECTURE.md`, `docs/chayen/HUMANIZER_ARCHITECTURE_IMPACT.md`, `docs/chayen/PROJECT_CHARTER.md` |
| Modified | `docs/chayen/SKILL_AUTHORING_STANDARD.md`, `docs/chayen/SKILL_QUALITY_GATES.md`, `docs/chayen/PLUGIN_PACKAGE_DESIGN.md` |
| Modified | `docs/chayen/IMPLEMENTATION_PLAN.md`, `docs/chayen/ACCEPTANCE_MATRIX.md`, `docs/chayen/DECISIONS.md`, `docs/chayen/ISSUES.md`, `docs/chayen/PROGRESS.md` |
| Modified | `docs/chayen/KNOWN_LIMITATIONS.md` (current KL-03), `docs/SKILLS_CATALOG.md` |
| Created / deleted | None in this follow-up. Earlier uncommitted/untracked work preserved. |

### D-052 actual verification

Node v24.22.0 via `$taskNode = 'C:\Program Files\nodejs\node.exe'`.
Reviewed evaluation runner and its static child checks before execution;
without `--write`, `--facts` or provider options, it invokes offline validators,
confined temporary regressions and a clearly labelled simulated lexical proxy.
It never invokes a provider/model or installs dependencies.

| Command | Actual result |
|---|---|
| `& $taskNode tools/evals/run-evaluation-suite.mjs` | PASS, exit 0: S-ALL (all nine automated gate groups), identity 15/15, engineering 206/206, technology 108/108, workflows 12/12, routing-example traceability 11/11, handoff 0 dangling names/0 provider syntax. Report now prints `5485/6500 chars`. SIM output is lexical proxy only, not native behavior evidence. |
| D-052 boundary probe below, extracted and piped to `& $taskNode -` | PASS, probe exit 0: 2/2; package validator exit 0 at 6,500 and exit 1 with the exact V-07 overflow diagnostic at 6,501. |
| `& $taskNode tools/validate/check-docs.mjs` | PASS, exit 0: 18 user/release documents, 0 errors. |
| Inline link/anchor section of the original governance checker (before `const matrix =`), piped to `& $taskNode -` | PASS, exit 0: 15 changed governance documents, 121 relative links/anchors, 0 errors against the current Git baseline. |
| `git diff --check` | PASS, exit 0; Git printed LF-to-CRLF conversion notices for two governance files, not whitespace errors. |

The first scratch probe attempt failed before validation because directory
enumeration included `skills/README.md` as if it were a Skill directory.
Corrected enumeration to require a directory containing SKILL.md. This was
a verification-fixture error, not a validator PASS or product failure.
Native/billed provider, new Skill behavior, human quality and host lifecycle
checks remain NOT_RUN. No existing requirement status is promoted.

### Reproducible D-052 boundary probe

```powershell
$taskBudgetProbe = [regex]::Match((Get-Content docs/chayen/PROGRESS.md -Raw -Encoding utf8), '(?s)<!-- D052-BOUNDARY -->\r?\n```javascript\r?\n(.*?)\r?\n```').Groups[1].Value
$taskBudgetProbe | & $taskNode -
```

<!-- D052-BOUNDARY -->
```javascript
const fs = require('node:fs'), os = require('node:os'), path = require('node:path');
const { spawnSync } = require('node:child_process');
const repo = process.cwd(), temp = fs.realpathSync(os.tmpdir());
const scratch = fs.mkdtempSync(path.join(temp, 'chayen-d052-')), rows = [];
try {
  for (const rel of ['plugins', 'catalog', '.claude-plugin', '.agents/plugins', '.github/plugin', 'tests/skills', 'docs/chayen/CAPABILITY_COVERAGE.md']) {
    const dest = path.join(scratch, rel); fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.cpSync(path.join(repo, rel), dest, { recursive: true, filter: p => { if (fs.lstatSync(p).isSymbolicLink()) throw Error('linked fixture'); return true; } });
  }
  const root = path.join(scratch, 'plugins/codejadee-chayen-framework/skills');
  const skills = fs.readdirSync(root, { withFileTypes: true }).filter(d => d.isDirectory() && fs.existsSync(path.join(root, d.name, 'SKILL.md'))).map(d => {
    const name = d.name, file = path.join(root, name, 'SKILL.md'), text = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
    return { name, file, text, desc: /^description: (.*)$/m.exec(text)[1] };
  });
  const baseline = skills.reduce((n, s) => n + s.name.length + s.desc.length, 0);
  if (baseline !== 5485) throw Error('unexpected baseline');
  for (const target of [6500, 6501]) {
    let left = target - baseline;
    for (const s of skills) {
      const add = Math.min(left, 1024 - s.desc.length); left -= add;
      fs.writeFileSync(s.file, s.text.replace(/^description: .*$/m, 'description: ' + s.desc + 'x'.repeat(add)));
    }
    if (left) throw Error('insufficient padding capacity');
    const r = spawnSync(process.execPath, [path.join(repo, 'tools/validate/validate-package.mjs'), scratch], { cwd: repo, encoding: 'utf8', timeout: 30000 });
    const out = r.stdout + r.stderr;
    const pass = target === 6500 ? r.status === 0 && out.includes('L0 metadata 6500/6500 chars') : r.status === 1 && out.includes('ERROR V-07 metadata-budget: L0 metadata 6501 chars > 6500');
    rows.push({ target, exit: r.status, pass }); if (!pass) console.log(out);
  }
} finally {
  if (path.dirname(fs.realpathSync(scratch)) !== temp || !path.basename(scratch).startsWith('chayen-d052-')) throw Error('unsafe cleanup');
  fs.rmSync(scratch, { recursive: true, force: true });
}
console.log(JSON.stringify(rows));
console.log(`${rows.filter(r => r.pass).length}/2 L0 boundary checks passed`);
process.exit(rows.length === 2 && rows.every(r => r.pass) ? 0 : 1);
```

No commit, push, tag, publication, release, provider install or Step 36 execution.

## Step 36 — Humanizer Skill registration and validation foundation

- **Date:** 2026-10-17 (Asia/Bangkok).
- **Status:** BLOCKED at architectural-approval preflight; implementation not started.
- **Baseline:** clean working tree on `main`, commit `c3a07b8`; original
  Step 35 and the D-051/D-052 follow-ups were already present in HEAD.
- **Scope:** this step's explicit request replaces the original proposed
  host-research plan with registration/validation foundations. No Step 37.

### Precondition findings

Read BUILD_CONTRACT, the Step 36 plan, current/proposed decisions and ADR-0009,
the Step 35 results, and current count/L0/V-19 source logic. D-051 approves the
count ceiling and D-052 the 6,500-character L0 budget. Neither approves the
editorial registration architecture. ADR-0009 remains PROPOSED and states:

> Owner approval of the separate registry remains required

Its proposed decision item 3 specifies a separate developer-side editorial
registry, validated union/uniqueness and existing/planned mappings, preserving
the 206 Engineering Capabilities and ownership checks. It explicitly changes
CA-01's engineering-only assumption only after approval. V-19 still rejects
every shipped Skill absent from the Engineering Catalog. Implementing this
extension now would assume the architectural approval the user explicitly
required us to verify before proceeding.

The user's Step 36 precondition is decisive: "If required architectural
approval is missing, stop and report BLOCKED. Do not assume approval."
Accordingly no registry, validator, negative control, placeholder Skill or
Humanizer content is created. The existing ADR-0009 registration model is a
concrete reviewable proposal; only that relevant component needs approval to
unblock this work, not unrelated host persistence or human-quality architecture.
R-57 records the blocker. All MHR implementation statuses remain PLANNED.

### Metadata and latest count instruction

Read-only measurement returned 13 shipped Skills and L0 **5,485/6,500**,
leaving 1,015. At the existing 420-character description target, two
18-character names add 876: **5,485 + 876 = 6,361**, leaving 139. These are
projected descriptions, not authored/validated Humanizer metadata or a host
limit claim. Existing descriptions remain unchanged; no routing accuracy
claim or billed provider regression run is made. L0 does not require a new
increase for this estimate.

The latest Step 36 request specifies **maximum 15**, superseding the earlier
25 ceiling for this step's eventual implementation. That instruction is
recorded without asking for duplicate count approval. Current validators still
hold 25 because the missing registry approval blocks implementation as a whole.

### Files modified (status documentation only)

| Action | Path |
|---|---|
| Modified | `docs/chayen/PROGRESS.md` — BLOCKED status, inspection/measurement evidence and stop |
| Modified | `docs/chayen/ACCEPTANCE_MATRIX.md` — blocked preparation note; MHR/legacy statuses unchanged |
| Modified | `docs/chayen/IMPLEMENTATION_PLAN.md` — user-directed Step 36 scope and BLOCKED status |
| Modified | `docs/chayen/ISSUES.md` — R-57 approval dependency and concrete approval scope |
| Created / deleted | None |

### Commands and actual outcomes

| Command / method | Result |
|---|---|
| `git status --short` before edits | PASS: no output; clean tree. |
| `git log -1 --format='%h %s'` | PASS: `c3a07b8 feat: Update L0 metadata budget to 6,500 characters and adjust related documentation`. |
| `Get-Content` governing files / `rg -n` approval records and validator conditions | Inspection confirms ADR-0009 registration component PROPOSED, V-19 engineering-only, current count 25 and L0 6,500. This is source inspection, not executed validator evidence. |
| Inline metadata measurement below via existing Node executable | PASS, exit 0: `shippedSkills=13, l0=5485, approvedBudget=6500, headroom=1015, projected15=6361, projectedHeadroom=139`. |
| `node tools/validate/validate-package.mjs` | NOT_RUN: stopped at the explicit architecture-approval precondition; no implementation changed. |
| `node tools/validate/run-validator-tests.mjs` | NOT_RUN: same precondition; no new mutation tests implemented. |
| `node tools/validate/validate-all.mjs` | NOT_RUN: same precondition. Historical Step 35 PASS results are not reused as Step 36 runs. |
| Seven requested new negative-control categories | NOT_RUN / not implemented due to approval blocker. |
| `git diff --check` | PASS, exit 0; no whitespace errors. Only four governance documents changed; `git diff --name-only -- plugins catalog tools tests .agents .claude-plugin .github` returned no paths. |

Exact read-only measurement (PowerShell here-string piped to
`& 'C:\Program Files\nodejs\node.exe' -`):

```javascript
const fs = require('node:fs'), path = require('node:path');
const root = 'plugins/codejadee-chayen-framework/skills';
const names = fs.readdirSync(root).filter(n => fs.existsSync(path.join(root, n, 'SKILL.md')));
const l0 = names.reduce((sum, n) => sum + n.length + /^description: (.*)$/m.exec(fs.readFileSync(path.join(root, n, 'SKILL.md'), 'utf8'))[1].trimEnd().length, 0);
const projected = l0 + 2 * (18 + 420);
console.log(JSON.stringify({ shippedSkills: names.length, l0, approvedBudget: 6500, headroom: 6500 - l0, projected15: projected, projectedHeadroom: 6500 - projected }));
```

STOP at Step 36 precondition and wait for explicit approval of ADR-0009's
registration model. No runtime/dependency, user instruction, Skill description,
Engineering Catalog, manifest, provider configuration, commit, push or release
change. Step 37 remains NOT_STARTED.

## Step 36 resumed — Editorial registration and validation foundation

- **Date:** 2026-10-17 (Asia/Bangkok).
- **Status:** DONE for Step 36, pending owner review; no behavioral VERIFIED promotion.
- **Authorization:** after the initial approval preflight, the owner instructed
  proceeding ("งง มีอะไรค้างหล่ะ ก็ทำซะซิ"). D-053 records acceptance of the
  concrete separate-registry/CA-01/V-19 proposal. No repeated approval request.
- **Baseline:** `main` at `c3a07b8` with four uncommitted status documents from
  the initial preflight; their history is preserved and updated for resumption.
- **Scope:** Step 36 only. Latest maximum 15 supersedes D-051's earlier 25;
  D-052's L0 6,500 is retained. No Skills, runtime, host integration or Step 37.

### Implemented design and limits

`catalog/editorial-skills.json` registers exactly Thai and English Humanizer
names/languages, canonical planned descriptions and `mapping: planned`. Neither
directory exists in the package. The engineering catalog remains byte-for-byte
unchanged, with 206 capabilities / 20 domains / 13 engineering Entry Skills.
There are no fabricated capability IDs, editorial-owned CAP records or
placeholder SKILL.md bodies. [SKILL_REGISTRATION.md](SKILL_REGISTRATION.md)
describes the schema, contracts and later planned-to-existing transition.

`tools/catalog/skill-registration.mjs` supplies shared max-count/L0 constants
and closed-schema identity/mapping/name-union/isolation checks to package,
catalog, security and evaluation tooling. `planned` forbids a shipped
directory; `existing` requires a real Skill and exact canonical metadata.
Engineering and editorial names are disjoint. Engineering recipes, ownership,
references, technology/workflow coverage and original inventory fingerprints
retain their checks. Every future shipped editorial Skill must pass the same
frontmatter, anatomy, safety, reference, trigger and body-size gates.

V-07 now checks shipped and projected metadata separately, includes planned
editorial descriptions in length/YAML/boundary/distinctness checks and caps
registered/shipped count at 15. V-20's editorial vocabulary applies only to
registered editorial names; engineering vocabulary and thresholds are unchanged.
V-19 accepts the validated registry union without relaxing engineering recipe
mapping checks, and forbids editorial capability ownership/recipes. V-11.3
shares registration rules; V-25 checks confined registry reads, schema, secrets
and absence of executable/configuration fields. All tooling remains developer-only.

Actual shipped L0 remains **5,485 / 6,500**. Planned names/descriptions add
**455**, yielding **5,940 / 6,500**, leaving **560**. This improves on the
corrected conservative 6,363 estimate without changing a single engineering description
or increasing the approved budget. Maximum metadata overlap remains 0.11.
Compact metadata, not native invocation accuracy, was evaluated; no provider
routing or multilingual behavior verification is claimed.

Direct measurement also corrected the old planning assumption: each name is
19 characters, not 18. Descriptions are 211/206 characters; metadata additions
are 230/225, totaling 455. The conservative upper estimate is 6,363 (137 free),
not the historical 6,361. This does not affect the 6,500 cap or actual V-07
measurement; earlier logs retain their historical observed arithmetic.

### Negative controls and regression protection

Added 18 mutations in `tests/catalog/editorial-mutations.json`, covering all
seven requested categories plus planned/existing parity, unsupported runtime
fields, unsafe names, metadata drift, distinctness and registry absence. The
runner's optional expected diagnostic fragment prevents unrelated failures
from satisfying a case. An existing catalog-ownership mutation now pins its
actual ownership diagnostic rather than also accepting a count error.

Added two security cases for editorial runtime fields and synthetic secrets,
and updated the positive metadata-only fixture to include valid editorial
registration. Invalid Skill copies are confined to temporary test repositories
and removed by reviewed cleanup. No fixture/Skill body is added to the package.

### File ledger (Step 36, including the initial status update)

| Action | Files |
|---|---|
| Created | `catalog/editorial-skills.json` |
| Created | `tools/catalog/skill-registration.mjs` |
| Created | `tests/catalog/editorial-mutations.json` |
| Created | `docs/chayen/SKILL_REGISTRATION.md` |
| Modified | `tools/catalog/check-catalog.mjs`, `tools/catalog/README.md` |
| Modified | `tools/validate/validate-package.mjs`, `tools/validate/check-security.mjs`, `tools/validate/run-validator-tests.mjs`, `tools/validate/README.md` |
| Modified | `tools/evals/run-evaluation-suite.mjs` |
| Modified | `tests/catalog/catalog-mutations.json`, `tests/security/boundaries.test.mjs` |
| Modified | `docs/chayen/ADRS/ADR-0004-skill-catalog-vs-entry-skills.md`, `docs/chayen/ADRS/ADR-0009-multilingual-editorial-skills.md`, `docs/chayen/ADRS/README.md` |
| Modified | `docs/chayen/ARCHITECTURE.md`, `docs/chayen/PROJECT_CHARTER.md`, `docs/chayen/HUMANIZER_ARCHITECTURE_IMPACT.md` |
| Modified | `docs/chayen/DECISIONS.md`, `docs/chayen/IMPLEMENTATION_PLAN.md`, `docs/chayen/ACCEPTANCE_MATRIX.md`, `docs/chayen/ISSUES.md`, `docs/chayen/PROGRESS.md` |
| Modified | `docs/chayen/SKILL_AUTHORING_STANDARD.md`, `docs/chayen/SKILL_QUALITY_GATES.md`, `docs/chayen/PLUGIN_PACKAGE_DESIGN.md`, `docs/chayen/KNOWN_LIMITATIONS.md`, `docs/SKILLS_CATALOG.md` |
| Deleted | None |

### Actual verification after approval

Reviewed validator entry points/imports, registry path guards, mutation copies
and cleanup before execution. Commands use existing Node v24.22.0:
`$taskNode = 'C:\Program Files\nodejs\node.exe'`. No package installation,
provider invocation, billed evaluation, user configuration or runtime fact
suite is part of these runs.

| Command | Actual result |
|---|---|
| `& $taskNode tools/validate/validate-package.mjs` | PASS, exit 0: 13 shipped Skills, actual L0 5,485, projected registered L0 5,940 / 6,500; 15 descriptions checked; max overlap 0.11; 221 references / 117 recipes / 206 capabilities / 445 recipe cases. Five existing >200-line target warnings, all under hard 300; no errors. |
| `& $taskNode tools/catalog/check-catalog.mjs` | PASS, exit 0: 206 unique capabilities / 20 domains, all IMPLEMENTED; 13 engineering Skills; original inventory fingerprint `2f13cad24ff431e3`. |
| `& $taskNode tools/validate/check-security.mjs` | PASS, exit 0: 238 package files, 13 entries, 221 references, 69 developer assets, 0 errors. |
| `& $taskNode tools/validate/run-validator-tests.mjs` (first run) | FAIL, 149/150: one new scratch mutation used an exact replacement appearing three times. No validator assertion failed; the mutation could not be applied. |
| `& $taskNode tools/validate/run-validator-tests.mjs --only ed36-missing-engineering-recipe` (after fixing mutation) | PASS, exit 0: 5/5, four baseline validators plus corrected missing-engineering-recipe case. The mutation now targets the first recipe occurrence and detects the exact missing mapping. |
| `& $taskNode --test tests/security/boundaries.test.mjs` | PASS, exit 0: 34/34, including the valid registry baseline and two new registry security cases. |
| `& $taskNode tools/validate/validate-all.mjs` (final) | PASS, exit 0: all nine gate groups; 150/150 validator tests (four baselines + 146 mutations, including all 18 new editorial cases); 34/34 security tests; engineering/technology/workflow checks; 186 trigger cases / 441 generated files synchronized; user docs 18 files / 0 errors. |
| `& $taskNode tools/evals/run-evaluation-suite.mjs` | PASS, exit 0: static/traceability levels, identity 15/15, engineering 206/206, technology 108/108, workflows 12/12, 11/11 routing example mappings. Actual L0 5,485 and projected registered L0 5,940 / 6,500 printed correctly. Its simulated proxy is not native routing evidence. No `--write` or provider invocation. |
| `& $taskNode tools/validate/check-docs.mjs` | PASS, exit 0: 18 user/release documents, 0 errors. |
| Original governance check's link/anchor section (before `const matrix =`), extracted from PROGRESS and piped to `& $taskNode -`; historical snapshot assertions omitted | PASS, exit 0: 16 changed governance documents, 130 relative links/anchors, 0 errors. |
| Inline read-only shared-registration/metadata invariant check via `& $taskNode --input-type=module -` | PASS, exit 0: no registration errors, 206 Engineering Capabilities, 13 engineering registrations / shipped Skills, two planned editorial records, maximum 15 and L0 6,500; measured descriptions 211/206 chars, names 19 each, metadata additions 230/225. |
| `git diff --name-only -- plugins catalog/engineering-capabilities.yaml catalog/technology-capabilities.yaml catalog/composite-workflows.json .agents .claude-plugin .github` | PASS preservation check: no output; shipped files/descriptions/manifests, all three existing catalogs and host marketplace metadata unchanged. |
| `git diff --check` | PASS, exit 0; Git's two LF-to-CRLF notices are not whitespace errors. |

Native provider routing, Humanizer bodies/behavior, multilingual human quality
and host lifecycle are NOT_RUN; no MHR or legacy requirement is promoted to
VERIFIED from this static foundation. Existing engineering descriptions,
catalog and shipped files remain unchanged, so no routing effect is asserted.
Future body/description changes need their own native routing evidence.

STOP after Step 36. No commit, push, tag, release, provider install, user-level
instruction change or Step 37 execution.

## Step 36 re-issued — audit and re-verification of committed foundation

- **Date:** 2026-10-17 (Asia/Bangkok).
- **Status:** DONE for Step 36, pending owner review. No re-implementation.
- **Baseline:** clean `main` at `56eb7cb`, which already contains the Step 36
  registry, shared rules, validator extensions and 18 editorial mutations.
- **Approval check:** D-053 ACCEPTED covers the registry/CA-01/V-19 model;
  D-052 covers L0 6,500. No unapproved limit was changed.

The re-issued request was audited item by item against the committed work.
Registration, engineering isolation (206 capabilities unchanged), planned
support, V-07/V-07b/V-19/V-11.3 extensions, projected metadata (5,940 /
6,500, 560 free), compact descriptions (211/206 characters) and the requested
negative-control categories were already present. No budget increase is needed.

Two untested paths were found and covered with test-only mutations:

| Case | Gap closed | Pinned diagnostic |
|---|---|---|
| `ed36-trigger-planned-skill` | V-16 was intentionally unchanged (only shipped Skills are known), but no control proved a trigger case cannot name a planned Editorial Skill. | `V-16 trigger-cases: pos-repository-overview: unknown skill chayen-humanizer-th` |
| `ed36-registered-count` | Only the shipped-directory cap (16 > 15) was tested; the shared registered-count cap (engineering + editorial registrations) had no control. | `V-19 catalog-mapping: registered Entry Skill count exceeds 15` |

No validator source, registry, catalog, Skill, manifest or description changed.

**Open for owner review:** the maximum 15 in D-053 came from the earlier Step 36
request and replaced D-051's 25. The re-issued request states a 15-Skill target
but no maximum. The cap is kept at 15 (not changing a limit without approval);
the owner should confirm 15 or restore 25. R-57 also remains OPEN for ADR-0010
(persistent policy) and ADR-0011 (quality thresholds).

### Re-verification file ledger

| Action | Path |
|---|---|
| Modified | `tests/catalog/editorial-mutations.json` — two cases appended |
| Modified | `docs/chayen/SKILL_REGISTRATION.md` — negative-control list |
| Modified | `docs/chayen/PROGRESS.md` — this section |
| Created / deleted | None |

### Re-verification actual results

Scripts reviewed before execution (runner temp-dir confinement and cleanup
guard; `validate-all.mjs` invokes the eval generator only with `--check`).
Node on PATH is now v26.8.1 (earlier entries used v24.22.0 by absolute path).

| Command | Actual result |
|---|---|
| `node tools/validate/validate-package.mjs` (before edits) | PASS, exit 0: 13 shipped Skills, actual L0 5,485 / 6,500, projected registered 5,940 / 6,500; V-07b max overlap 0.11; V-16 186 cases; V-19 13 shipped + 2 editorial registrations, 117 recipes / 206 capabilities. Same five V-06 line-target warnings, 0 errors. |
| `node tools/validate/run-validator-tests.mjs` (before edits) | PASS, exit 0: 150/150, including all 18 existing `ed36-*` cases. |
| `node tools/validate/run-validator-tests.mjs --only <id>` for each new case | PASS, exit 0: 5/5 each, with the pinned diagnostics above. |
| `node tools/validate/validate-all.mjs` (after edits) | PASS, exit 0: all nine gate groups; 152/152 validator self-tests; 186 cases / 441 eval files in sync; 18 user docs, 0 errors. |
| `node --test tests/security/boundaries.test.mjs` | PASS, exit 0: 34/34. |
| `git diff --check` | PASS, exit 0. |

Native provider routing, Humanizer behavior, multilingual quality, host
lifecycle and billed evaluations remain NOT_RUN. No requirement is promoted.

STOP after Step 36. No commit, push, tag, release, persistent instruction or
Step 37 execution.

## Step 37 — Thai Humanizer Skill

- **Date:** 2026-10-17 (Asia/Bangkok).
- **Status:** DONE, pending owner review (D-054 PROPOSED). Static evidence only.
- **Authorization:** the owner's explicit Step 37 instruction. Preconditions
  checked: D-053 registry/V-19 foundation ACCEPTED, D-052 L0 6,500; ADR-0010
  (persistent policy) and ADR-0011 (quality thresholds) govern Steps 39–40 and
  do not block this step. Not BLOCKED.
- **Baseline:** `main` at `56eb7cb` plus the uncommitted Step 36 re-verification
  edits (three files), preserved.

### Research

Studied `blader/humanizer` README, SKILL.md v3.1.0, CHANGELOG and MIT LICENSE
((c) 2025 Siqi Chen). Adopted methods only: strength ranking with "weak alone"
patterns, per-pattern false-positive guards, mark/draft/check/final passes,
no invented facts, prose-only file edits, source text as data, no detector
evasion. No text or example copied; English watch lists not translated.
Thai rules were separated from editorial preferences using Royal Institute
punctuation/spacing rules (2551), the 2532 English transcription rules and
a Chulalongkorn thesis on avoiding the ถูก passive. Full rule texts were not
retrieved; rule statements are flagged for fluent review (R-58). Sources and
attribution: [HUMANIZER_TH_DESIGN.md](HUMANIZER_TH_DESIGN.md).

### Implementation

`plugins/codejadee-chayen-framework/skills/chayen-humanizer-th/`: SKILL.md
(154 lines, English router with Thai examples, all V-17 sections and the
V-25.3 guard sentences) and seven references (56–82 lines each): two pattern
checklists (TH-01–TH-14), Thai conventions, protected content, website copy,
content creation and an output template. Modes: audit, rewrite, create and
website edit. No recipes, capabilities, scripts, hooks or dependencies.

The registry record moved `planned` → `existing`. The 211-character planned
description did not cover creation, blogs, READMEs or microcopy, so a new
description was written. The first draft (335 characters) moved 5 of the 186
original trigger cases to this skill in the simulated lexical proxy
(generic "rewrite", "while preserving", "product"). The final 354-character
description leaves 1 (an Angular Thai/English i18n prompt), and that case now
also forbids the Thai skill for native runs. Actual L0 **5,858 / 6,500**;
projected with the planned English record **6,083** (417 free).

### Tests

| Layer | Change |
|---|---|
| Trigger cases | 13 new (6 positive, 4 negative, 2 ambiguous, 1 unsupported); skill declared; `pos-frontend-i18n-angular` forbid extended; Claude evals regenerated (13 new case directories, 12 updated grader/prompt files; 45 line-ending-only rewrites restored) |
| Behavior specifications | `tests/editorial/humanizer-th-cases.json`: 52 cases (positive 14, false-positive 14, semantic-preservation 5, mixed-language 4, website 5, audit-only 2, security 4, negative 4) |
| Static gate | `tools/validate/check-editorial-cases.mjs` (G-15) in `validate-all.mjs` |
| Negative controls | Five planned-state Step 36 mutations retargeted to the still-planned English record; new `ed37-th-recipe-ownership` |
| Security fixture | Synthetic baseline writes a guarded SKILL.md for each `existing` editorial record |

### File ledger (Step 37 only)

| Action | Path |
|---|---|
| Created | `plugins/codejadee-chayen-framework/skills/chayen-humanizer-th/SKILL.md` and `references/` (`patterns-language.md`, `patterns-content.md`, `thai-conventions.md`, `protected-content.md`, `website-content.md`, `content-creation.md`, `output-formats.md`) |
| Created | `tests/editorial/humanizer-th-cases.json`, `tools/validate/check-editorial-cases.mjs`, `docs/chayen/HUMANIZER_TH_DESIGN.md` |
| Created | 13 directories `tests/evals/claude/{pos-humanizer-th-*, neg-thai-*, amb-thai-*, uns-thai-ai-detector-evasion}/` (generated) |
| Modified | `catalog/editorial-skills.json`, `tests/skills/trigger-cases.json`, 12 generated files under `tests/evals/claude/` |
| Modified | `tests/catalog/editorial-mutations.json`, `tests/security/boundaries.test.mjs`, `tools/validate/validate-all.mjs`, `tools/validate/README.md` |
| Modified | `README.md`, `CHANGELOG.md`, `docs/SKILLS_CATALOG.md`, `plugins/codejadee-chayen-framework/README.md`, `plugins/codejadee-chayen-framework/skills/README.md` |
| Modified | `docs/chayen/ACCEPTANCE_MATRIX.md`, `DECISIONS.md` (D-054), `ISSUES.md` (R-58), `IMPLEMENTATION_PLAN.md`, `SKILL_REGISTRATION.md`, `PROGRESS.md` |
| Unchanged | All 13 engineering skills, the three engineering/technology/workflow catalogs, manifests and marketplaces (diff empty) |
| Deleted | None |

### Actual verification

Reviewed before running: the eval generator's write branch (writes and prunes
only `tests/evals/claude/`), the validator runner's temp-dir copy and cleanup,
`validate-all.mjs` and the evaluation suite (offline; no `--write`, provider
or facts options). Node v26.8.1 on PATH.

| Command | Actual result |
|---|---|
| `node tools/validate/validate-package.mjs` (first run after authoring) | FAIL as expected, exit 1: two V-16 errors (skill not declared, fewer than 3 positives); fixed by adding trigger cases |
| `node tools/validate/validate-package.mjs` (final) | PASS, exit 0: 14 Skills; V-05/06/07/07b/08/09/10/12/16/17/18/19/20 PASS; L0 5,858 actual / 6,083 projected; 228 references; 199 trigger cases; five existing V-06 warnings only |
| `node tools/validate/run-validator-tests.mjs` (first run after registry change) | FAIL, 147/152: five Step 36 mutations assumed the Thai record was planned; validators behaved correctly |
| `node tools/validate/run-validator-tests.mjs` (after retargeting) | PASS, 152/152; `--only ed37-th-recipe-ownership` 5/5 |
| `node tools/validate/check-editorial-cases.mjs` | PASS: 14 patterns with all six parts; 52 case specifications. Three injected defects in scratch copies (missing Preserve part, absent preserved span, missing TH-14 guard) each FAIL, exit 1, with the intended diagnostic |
| `node --test tests/security/boundaries.test.mjs` (first) | FAIL, 33/34: synthetic baseline copied the registry with an `existing` record but no SKILL.md; fixed in the fixture |
| `node --test tests/security/boundaries.test.mjs` (final) | PASS, 34/34 |
| `node tools/validate/validate-all.mjs` (final) | PASS, exit 0: ten gate groups; 153/153 self-tests; 199 cases / 468 eval files in sync; 18 user docs, 0 errors; G-15 PASS |
| `node tools/evals/run-evaluation-suite.mjs` (final) | PASS, exit 0: identity 15/15, engineering 206/206, technology 108/108, workflows 12/12, routing examples 11/11, handoff 243 files / 0 dangling |
| Lexical proxy, HEAD worktree vs final | top1 0.546 → 0.529, top3 0.769 → 0.757, precision 0.514 → 0.503, no-match 0.441 → 0.462, ambiguous 14/22 → 15/24. Thai-only prompts produce no Latin tokens, so the proxy cannot score them; 1 of 186 original cases changes pick (above). SIMULATED, not routing evidence |
| `node tools/catalog/check-catalog.mjs` | PASS: 13 engineering Entry Skills, fingerprint `2f13cad24ff431e3` unchanged |
| `node tools/validate/check-security.mjs` | PASS: 246 package files, 14 entries, 228 references, 0 errors |
| Governance link/anchor section of the Step 35 checker | PASS: 7 changed governance documents, 63 relative links, 0 errors |
| Preservation diff over existing skills, catalogs, manifests and marketplaces | PASS: no output |
| `git diff --check` | PASS, exit 0 |

| Not run | Reason |
|---|---|
| Native routing of the 13 Thai trigger cases (≥3 runs, no-plugin arm) | Billed provider runs not authorized in Step 37 (DS-09 remains open for this description) |
| Behavior grading of the 52 case specifications | Needs an approved rubric (ADR-0011) and authorized runs (Step 40) |
| Fluent Thai human review of patterns and rule statements | No reviewer in this step (R-58) |
| Engineering routing regression with 14 Skills | Native runs not authorized |

### Unresolved quality questions

See HUMANIZER_TH_DESIGN.md §Unresolved quality questions: pattern frequency
in real content, over-editing of formal Thai, default terminology policy,
fidelity of rule statements to the full Royal Institute texts, particle and
gender-neutral voice policy, and native routing of Thai prompts.

STOP after Step 37. No English skill, persistent policy, global instruction
change, commit, push, release or Step 38 work.

## Step 38 — English Humanizer Skill

- **Date:** 2026-10-17 (Asia/Bangkok).
- **Status:** DONE, pending owner review (D-055 PROPOSED). Static evidence only.
- **Authorization:** the owner's explicit Step 38 instruction. D-053 (registry, maximum 15)
  and D-052 (L0 6,500) are accepted. D-054 had no explicit approval message; the owner
  committed Step 37 (`f65a432`) and issued Step 38, which is recorded as acceptance by
  proceeding (D-054 status updated, same precedent as D-053) and flagged in D-055 for the
  owner to confirm or correct. ADR-0010 and ADR-0011 govern Steps 39–40 and do not block
  this step. Not BLOCKED.
- **Baseline:** clean `main` at `f65a432`; nothing uncommitted before this step.

### Research

Read `blader/humanizer` `SKILL.md` (version 3.1.0, 397 lines, 26 patterns), `README.md`,
`CHANGELOG.md` and `LICENSE` in full (MIT, Copyright (c) 2025 Siqi Chen), downloaded to a
scratch directory and treated as data. Pattern taxonomy and watch lists are adapted;
the upstream skill file is not reproduced and every example is original, written for
documentation, product copy, UI and developer replies, with each "After" using only
facts already in its "Before". Because the taxonomy and lists are adapted, the MIT notice
is shipped conservatively inside the skill (`references/upstream-notice.md`) with an
attribution mapping from the 26 upstream patterns; the licence block was verified
byte for byte against upstream's `LICENSE`. English conventions were checked against
Google's and Microsoft's published style guides and hyphenation guidance (read
2026-10-17) and labelled as preferences, not rules. Full detail:
[HUMANIZER_EN_DESIGN.md](HUMANIZER_EN_DESIGN.md).

### Implementation

`plugins/codejadee-chayen-framework/skills/chayen-humanizer-en/`: SKILL.md (164 lines,
English router with all V-17 sections and the V-25.3 guard sentences) and nine references
(61–125 lines each): three pattern checklists (EN-01–EN-26), English conventions,
protected content, website copy, content creation, an output template and the upstream
notice. Modes: audit, rewrite, create and website edit, plus a "no changes recommended"
outcome for text that already reads well. No recipes, capabilities, scripts, hooks or
dependencies. All 26 upstream patterns are covered (three pairs merged); three patterns
are new (unsupported claims, filler, register).

The registry record moved `planned` to `existing`. The planned 206-character description
did not cover creation, blogs, READMEs, developer replies or microcopy, so a 344-character
description was written and copied byte for byte into the registry. Candidates were scored
with the simulated lexical proxy before content was written: naming "Thai text" in the
boundary clause pulled Thai prompts toward the English skill (two wrong-language flips);
"non-English output", symmetric with the Thai skill's "non-Thai output", reduced that.

**Metadata budget (measured):** names 19 + 19; descriptions 354 (Thai) and 344 (English).
Actual L0 **6,221 / 6,500**, **279 free**, no planned record left. The Step 36 projection
was 5,940; the real English description added 138 over the 206-character plan. No budget
change. **Exactly 15 Entry Skills** (independent count: 15 directories with SKILL.md,
13 engineering plus 2 editorial registrations all `existing`, registered names equal the
shipped set, frontmatter names equal directories). The ceiling is reached.

### Tests

| Layer | Change |
|---|---|
| Trigger cases | 15 new (8 positive, 3 negative, 3 ambiguous, 1 unsupported); skill declared; eight Thai cases now forbid the English skill; two cases that expected no skill (`neg-app-store-copy`, `neg-thai-request-english-email`) became ambiguous and were renamed `amb-app-store-copy`, `amb-thai-request-english-email` because marketing copy now has an editorial owner and V-16 reserves "negative" for pure none; Claude evals regenerated |
| Behavior specifications | `tests/editorial/humanizer-en-cases.json`: 102 cases (positive 27, false-positive 26, natural-unchanged 6, semantic-preservation 7, technical-terms 6, us-uk 5, website 7, audit-only 3, creation 3, security 5, negative 7), every positive tagged with a text type |
| Static gate | `check-editorial-cases.mjs` (G-15) generalized to both skills: pattern inventory, schema, per-pattern positive and false-positive coverage, English text-type coverage, and independence (E-04: neither skill names the other) |
| Validator negative controls | 13 Step 36/37 controls retargeted (planned-state controls now mutate the temporary copy; registry-writing controls rebuilt from the real registry as single faults); 3 new registration controls (English recipe ownership, metadata drift, unregistered); 7 new G-15 controls through a new `editorial` validator type in the runner |
| Security fixture | Unchanged; it already writes a guarded SKILL.md for every `existing` editorial record |

### File ledger (Step 38 only)

| Action | Path |
|---|---|
| Created | `plugins/codejadee-chayen-framework/skills/chayen-humanizer-en/SKILL.md` and `references/` (`patterns-staging-and-rhythm.md`, `patterns-inflation-and-claims.md`, `patterns-format-and-reader.md`, `english-conventions.md`, `protected-content.md`, `website-content.md`, `content-creation.md`, `output-formats.md`, `upstream-notice.md`) |
| Created | `tests/editorial/humanizer-en-cases.json`, `docs/chayen/HUMANIZER_EN_DESIGN.md` |
| Created | 17 generated case directories under `tests/evals/claude/` (15 new cases plus the 2 renamed) and 7 new `graders/forbidden-skills.md` files in existing Thai case directories |
| Modified | `catalog/editorial-skills.json`, `tests/skills/trigger-cases.json`, 20 generated files under `tests/evals/claude/` (line-ending-only rewrites restored) |
| Modified | `tests/catalog/editorial-mutations.json`, `tools/validate/check-editorial-cases.mjs`, `tools/validate/run-validator-tests.mjs`, `tools/validate/README.md` |
| Modified | `README.md`, `CHANGELOG.md`, `docs/SKILLS_CATALOG.md`, `plugins/codejadee-chayen-framework/README.md`, `plugins/codejadee-chayen-framework/skills/README.md` |
| Modified | `docs/chayen/ACCEPTANCE_MATRIX.md`, `DECISIONS.md` (D-054 status, D-055), `ISSUES.md` (R-59), `IMPLEMENTATION_PLAN.md`, `SKILL_REGISTRATION.md`, `PROGRESS.md` |
| Deleted | 4 generated files for the 2 renamed cases (`neg-app-store-copy/`, `neg-thai-request-english-email/`) |
| Unchanged | The 13 engineering skills, the Thai skill, the three engineering/technology/workflow catalogs, manifests and marketplaces (diff empty) |

### Actual verification

Reviewed before running: the eval generator's write branch (writes and prunes only
`tests/evals/claude/`), the validator runner's temporary-directory copy and cleanup,
`validate-all.mjs` and the evaluation suite (offline; no `--write`, provider or facts
options). Node v26.8.1 on PATH. No provider, model call or install was used.

| Command | Actual result |
|---|---|
| `node tools/validate/validate-package.mjs` (first run after registering) | FAIL as expected, exit 1: V-16 skill list and fewer than 3 positives, and V-10 "absolute security claim" on the phrase "100% secure" in an example of what to flag |
| `node tools/validate/validate-package.mjs` (after rewording the example to "100% reliable" and adding trigger cases) | FAIL, exit 1: V-16 required the two renamed cases (`neg-*`) to expect exactly none; fixed by reclassifying and renaming them as ambiguous |
| `node tools/validate/validate-package.mjs` (final) | PASS, exit 0: 15 Skills; V-05/06/07/07b/08/09/10/12/16/17/18/19/20 PASS; L0 6,221 / 6,500; max overlap 0.24 (English vs Thai; others at most 0.11); 237 references; 214 trigger cases; five existing V-06 warnings only |
| `node tools/validate/check-editorial-cases.mjs` | PASS: 2 skills, 40 patterns, 154 case specifications. Six defects injected into scratch copies (missing exception part, missing guard case, skill naming the other, text-type shortage, absent preserved span, renumbered pattern) each exit 1 with the intended diagnostic |
| `node tools/validate/run-validator-tests.mjs` (first run) | FAIL, 163/164: `ed36-duplicate-description` expected the pair named `th vs en`; the validator names it alphabetically (`en vs th`). Test wording corrected; no validator defect |
| `node tools/validate/run-validator-tests.mjs` (final) | PASS, 164/164: 5 baselines (new `editorial`) and 159 mutations, including all 23 editorial-mutation cases touched or added |
| `node tools/validate/validate-all.mjs` (final) | PASS, exit 0: ten gate groups; 164/164 self-tests; 214 cases / 516 eval files in sync; 18 user docs, 0 errors; G-15 PASS |
| `node --test tests/security/boundaries.test.mjs` | PASS, 34/34 |
| `node tools/validate/check-security.mjs` | PASS: 256 package files, 15 entries, 237 references, 16 external URLs (listed, not fetched), 0 errors |
| `node tools/catalog/check-catalog.mjs` | PASS: 13 engineering Entry Skills, 206 capabilities, fingerprint `2f13cad24ff431e3` unchanged |
| `node tools/evals/run-evaluation-suite.mjs` | PASS, exit 0: identity 15/15, engineering 206/206, technology 108/108, workflows 12/12, routing examples 11/11, handoff 253 files / 0 dangling |
| Independent Entry Skill count | PASS: exactly 15 (first attempt reported 0 engineering registrations because my one-off script missed the catalog's CRLF line endings; corrected and rerun) |
| `node tools/validate/check-docs.mjs` and the governance link/anchor check | PASS: 18 documents, 0 errors; 6 changed governance documents, 41 relative links, 0 errors |
| Preservation diff over existing skills, catalogs, manifests and marketplaces | PASS: no output |
| `git diff --check` | PASS, exit 0 |

**Routing conflicts (SIMULATED lexical proxy; not routing evidence).** Suite proxy, HEAD to
now: top-1 0.529 to 0.535, top-3 0.757 to 0.771, precision 0.503 to 0.51, no-match 0.462 to
0.488, ambiguous 15/24 to 17/27. Per case, of the original 199: 2 picks changed
(`amb-cache-catalogue` performance to English through the word "product", an ambiguous case;
`pos-humanizer-th-rewrite-blog` Thai to none through a threshold shift). English positives
routed to the Thai skill: 0 of 8. Thai-script prompts routed to the English skill: 1 of 11,
a 0.02 near-tie on the single token "developer" (the proxy cannot read Thai or negation).
New cases the proxy misses: 4 of 15 (`pos-humanizer-en-audit-blog`, `pos-humanizer-en-dev-blog`,
`amb-app-store-copy`, `uns-detector-evasion-english`). Structural overlaps that only native
runs can settle: the documentation skill (READMEs, PR and review text), the frontend skill
(UI copy) and the Thai/English boundary.

| Not run | Reason |
|---|---|
| Native routing of the 15 new trigger cases and re-run of the existing ones (3 or more runs, no-plugin arm) | Billed provider runs not authorized in Step 38; DS-09 remains open for this description and for any effect on existing routing |
| Behavior grading of the 102 case specifications, including natural text left unchanged | Needs an approved rubric (ADR-0011) and authorized runs (Step 40) |
| Fluent English review of the patterns, conventions and examples | No reviewer in this step (R-59) |
| Engineering routing regression with 15 Skills | Native runs not authorized |
| Legal review of shipping the MIT notice as a reference file | Out of scope; flagged in R-59 |

### Unresolved quality questions and risks

See HUMANIZER_EN_DESIGN.md and R-59: whether the 26 patterns, adapted from a
Wikipedia-oriented list, match current developer and marketing English (word habits change
with each model release); whether the guards prevent over-editing of natural and brand-voice
English; dash and hyphen handling per project; native routing against the documentation and
frontend skills and against the Thai skill; the licence treatment of the upstream notice and
a root notices file once Q-05 (licence) is decided. Operationally, 279 characters of
metadata remain and the Entry Skill ceiling is reached, so any further Skill needs a new decision.

STOP after Step 38. No persistent response policy, host integration, user configuration
change, commit, push, release or Step 39 work.

## Step 39 — Multilingual persistent response style policy

- **Date:** 2026-10-17 (Asia/Bangkok).
- **Status:** DONE, pending owner review (D-056 PROPOSED). Static and fixture evidence only.
- **Authorization and preconditions:** the owner's explicit Step 39 instruction. Read
  Steps 35–38, ADR-0002/0003/0006/0009–0011, both Humanizer Skills, BUILD_CONTRACT and
  Git status. D-047 and D-051–D-053 are ACCEPTED; D-054 was accepted by proceeding.
  D-055 (Step 38) and ADR-0010 were PROPOSED. The Step 39 instruction directs exactly
  ADR-0010's architecture ("The preferred initial implementation is A + B … Do not claim C
  works without runtime proof"), so ADR-0010 A + B is recorded as accepted by instruction
  and D-055 as accepted by proceeding. Both are inferences, flagged for confirmation
  (same precedent as D-053/D-054, but Step 38 is still uncommitted). Not BLOCKED.
- **Baseline:** `main` at `f65a432` plus the uncommitted Step 38 working tree, preserved.
  Step 38 files were not edited, except shared governance logs, `README.md`,
  `CHANGELOG.md` and `tools/validate/README.md`/`run-validator-tests.mjs` as listed below.

### Host research

Three read-only research passes over official documentation (Anthropic, OpenAI, GitHub,
Microsoft; accessed 2026-10-17) and the installed hosts: Claude Code CLI 2.1.220 and VS Code
extension 2.1.301, Codex CLI 0.163.0 and `openai.chatgpt` 26.1007.21434, Copilot CLI 1.0.89,
VS Code 1.142.0 with Copilot Chat 0.70.0. Only `--version` commands and string searches of
installed binaries were run; no session, model call, install or configuration write. No
user-level instruction file existed at the checked paths; none was read. Findings, URLs
and the documented-versus-tested matrix: [RESPONSE_STYLE_DESIGN.md](RESPONSE_STYLE_DESIGN.md).

Key results:

- No host loads always-on instructions from a static plugin component.
- Claude Code's `force-for-plugin` output style can, but it was rejected (D-056).
- Every host concatenates instruction files rather than ranking them, so the policy states
  its own precedence.
- VS Code Copilot Chat also reads `~/.claude/rules` and `~/.claude/CLAUDE.md`, a
  duplicate-loading risk.

### Implementation

| Area | Result |
|---|---|
| Canonical policy | `response-style/chayen-response-style.md`: one marked block v1, 31 lines, body 2,978 characters / 3,074 bytes / 461 words / 48 Thai characters. Covers precedence, language order, mixed language, general, Thai and English rules, protected content and limits; names no Skill, tool or host file |
| Host template | `response-style/chayen-response-style.instructions.md` (`applyTo: "**"` followed by the block, byte identical) |
| User guide | `docs/RESPONSE_STYLE.md`: where it goes per host; opt-in (agent prompt with diff and approval, manual steps, preview helper); verify; disable and roll back; conflicts and precedence; context cost; limitations |
| Setup helper | `tools/response-style/policy-lib.mjs` and `inspect-instructions.mjs`: read-only `status`, `plan-add`, `plan-remove`, `print`; never writes |
| Gate | `tools/validate/check-response-style.mjs` (G-16, R-01–R-08) in `validate-all.mjs`, with G-16T fixture tests; a `response-style` validator type and 14 negative controls in the mutation runner |
| Plugin package | Unchanged: no file added or edited; L0 6,221 / 6,500; 15 Entry Skills |

### File ledger (Step 39 only)

| Action | Path |
|---|---|
| Created | `response-style/chayen-response-style.md`, `response-style/chayen-response-style.instructions.md`, `response-style/README.md` |
| Created | `docs/RESPONSE_STYLE.md`, `docs/chayen/RESPONSE_STYLE_DESIGN.md` |
| Created | `tools/response-style/policy-lib.mjs`, `tools/response-style/inspect-instructions.mjs`, `tools/validate/check-response-style.mjs` |
| Created | `tests/response-style/setup-fixtures.test.mjs`, `tests/response-style/response-style-mutations.json` |
| Modified | `tools/validate/validate-all.mjs` (G-16, G-16T), `tools/validate/run-validator-tests.mjs` (copy list, suite, validator type), `tools/validate/check-docs.mjs` (D-04 exemption for the policy identifier), `tools/validate/README.md` |
| Modified | `README.md`, `CHANGELOG.md` (both also edited in Step 38) |
| Modified | `docs/chayen/DECISIONS.md` (D-055 status, D-056), `ADRS/ADR-0010-persistent-multilingual-response-style-policy.md` (status lines only), `ADRS/README.md`, `ACCEPTANCE_MATRIX.md`, `ISSUES.md` (R-60), `IMPLEMENTATION_PLAN.md`, `KNOWN_LIMITATIONS.md` (KL-08), `SKILL_QUALITY_GATES.md` (G-16), `PROGRESS.md` |
| Unchanged | Plugin package, catalogs, manifests, marketplaces and Skills; every user-level or repository instruction file (CLAUDE.md, AGENTS.md, Copilot files) |
| Deleted | None |

### Actual verification

Node v26.8.1. No provider, model, network, install or real instruction file was used.

| Command | Actual result |
|---|---|
| CLI smoke test on a scratch `AGENTS.md` (first run) | FAIL: the first named file was dropped (argument filter bug when `--format` is absent); fixed |
| `node --test tests/response-style/setup-fixtures.test.mjs` (first run) | FAIL, 17/19: one wrong test expectation (a modified policy-only file is correctly planned as `delete-file`), and the source scan flagged `RegExp.exec(` as a process call. Expectation corrected; scan replaced by an import and `fs`-method allowlist |
| `node --test tests/response-style/setup-fixtures.test.mjs` (final) | PASS 19/19, including a CLI run over a fixture directory whose names, sizes, mtimes and hashes are unchanged afterwards |
| `node tools/validate/check-response-style.mjs` (before the docs existed) | FAIL as expected, exit 1: R-06 reported three missing files |
| `node tools/validate/check-response-style.mjs` (final) | PASS, exit 0: v1, 2,978 body characters (limit 3,500), 3,074 bytes, 48 Thai characters |
| `node tools/validate/check-docs.mjs` (first run) | FAIL: broken link to the design record, not yet written. PASS after: 19 files, 0 errors |
| `node tools/validate/run-validator-tests.mjs` | PASS 179/179: 6 baselines (new `response-style`) and 173 mutations; all 14 `rs39-*` controls exit 1 with the intended R-01–R-08 diagnostic |
| `node tools/validate/validate-all.mjs` (final) | PASS, exit 0: twelve gate groups |
| `node tools/validate/check-security.mjs` | PASS: 256 package files, 15 entries, 237 references, 0 errors |
| `node tools/catalog/check-catalog.mjs`; `node tools/evals/run-evaluation-suite.mjs` | PASS; static/traceability PASS |
| `node tools/validate/validate-package.mjs` | PASS: 15 Skills, L0 6,221 / 6,500 (unchanged) |
| Relative link and anchor check over the 12 changed or new governance and guide files (scratch script) | PASS: 72 links, 0 errors |
| `git diff --check` | PASS, exit 0 |
| `git status --short` over plugins, catalog and marketplaces | Only Step 38's pre-existing changes |

| Not run | Reason |
|---|---|
| Loading of the policy on each host surface (MH-V08) | Needs real host sessions; not authorized in Step 39 |
| Behavior with policy on/off, no-match, explicit overrides, exact outputs, Thai and English replies (MH-V07) | Model calls not authorized; Step 40 with an approved rubric |
| Fresh-session enable, decline, disable, plugin uninstall and removal on hosts (MH-V09) | Host and install tests not authorized; rules covered by fixtures only |
| Token measurement | No provider tokenizer call authorized; 750–850 is a character-based estimate |
| Fluent review of the Thai and English rules | No reviewer in this step (R-58, R-59) |

STOP after Step 39. No commit, push, release, real configuration change or Step 40 work.

## Step 40 — Independent quality and provider compatibility evaluation

- **Date:** 2026-10-17 (Asia/Bangkok).
- **Status:** PARTIAL, pending owner review (D-057 PROPOSED). Offline evidence only.
- **Authorization and preconditions:** the owner's explicit Step 40 instruction. Read
  Steps 35–39, BUILD_CONTRACT, SKILL_QUALITY_GATES, ACCEPTANCE_MATRIX, HUMANIZER_REQUIREMENTS,
  ADR-0010/0011, D-047–D-056, the evaluation harnesses and the provider compatibility records.
  ADR-0011 (thresholds) is PROPOSED and requires approval before scoring; the instruction
  supplies dataset composition and routing/policy targets but not the language bar, so the
  rubric was prepared and nothing scored. Live runs were not authorized ("Do not run billed
  provider evaluations or alter real user agent installations without separate approval"),
  so every provider, host and human test is NOT_RUN with executable fixtures prepared.
- **Baseline:** clean `main` at `0702b5b` (Steps 38–39 committed). Engineering baseline for
  regression: `1106226` (Step 34, before any Humanizer work).

### Work performed

1. **Structural validation** of the 15-Skill package, manifests, marketplaces, metadata,
   references, editorial registration, engineering catalogs, security profile and upstream
   MIT attribution (offline comparison with the canonical MIT text).
2. **Held-out dataset** `tests/evaluation/step40/quality-cases.json`: 120 cases (Thai 40,
   English 40, mixed/technical 20, policy/conflict/no-match 20), synthetic inputs, written
   after the skills; per-case arms, automated checks and human assertions.
3. **Discovery probes** `tests/evaluation/step40/discovery-probes.json`: 52 probes (explicit
   TH/EN 5+5, implicit TH/EN 10+10, documentation overlap 6, engineering 8, no-match 8),
   3 runs each, in the existing probe schema.
4. **Runners:** `run-provider-probes.mjs` gains `--spec` (confined to `tests/evaluation/`)
   and records the spec and a skill-metadata fingerprint; new `run-arms.mjs` runs arms A
   (no plugin), B (plugin) and C (plugin + canonical policy at the documented user-level
   location in an isolated home, with a loading canary), Claude Code and Copilot CLIs;
   `--plan` is offline.
5. **Scorer** `tools/evals/score-step40.mjs`: dataset/probe validation (Q-01–Q-04), automated
   fidelity checks, routing/policy/human metrics with denominators and verdicts, NOT_RUN when
   inputs are absent; 56 synthetic controls; gate G-17 in `validate-all.mjs`.
6. **Rubric** (PROPOSED) and **report** with provider matrix, metrics, engineering
   regression, defects and blockers: [HUMANIZER_EVALUATION_RUBRIC.md](HUMANIZER_EVALUATION_RUBRIC.md),
   [HUMANIZER_EVALUATION_REPORT.md](HUMANIZER_EVALUATION_REPORT.md).
7. **Records:** D-057; R-61–R-63; DF-04–DF-07; MHR-010 PLANNED → IN_PROGRESS; Step 40
   evidence on all MHR rows; plan overview rows 37–39 corrected (DF-05).

### File ledger (Step 40 only)

| Action | Path |
|---|---|
| Created | `tests/evaluation/step40/quality-cases.json`, `discovery-probes.json`, `scorer-controls.json`, `run-arms.mjs`, `README.md` |
| Created | `tools/evals/score-step40.mjs` |
| Created | `docs/chayen/HUMANIZER_EVALUATION_RUBRIC.md`, `docs/chayen/HUMANIZER_EVALUATION_REPORT.md` |
| Modified | `tests/evaluation/run-provider-probes.mjs` (`--spec`, `spec` and `metadataFingerprint` in summaries; default behavior unchanged) |
| Modified | `tools/validate/validate-all.mjs` (G-17), `tools/validate/README.md`, `tests/evaluation/README.md` |
| Modified | `docs/chayen/SKILL_QUALITY_GATES.md` (G-17 row), `DECISIONS.md` (D-057), `ISSUES.md` (R-61–R-63, DF-04–DF-07), `ACCEPTANCE_MATRIX.md`, `IMPLEMENTATION_PLAN.md`, `ADRS/README.md` (ADR-0011 row), `PROGRESS.md` |
| Unchanged | Plugin package (all 15 Skills), catalogs, manifests, marketplaces, response-style policy and templates, user documentation, every user-level or repository instruction file |
| Deleted | None |

Scratch-only (not in the repository): proxy comparison script and a `git archive` copy of
`1106226`, MIT comparison script, scorer smoke inputs, MHR-row update script.

### Actual verification

Node v26.8.1 on PATH. No provider, model call, network fetch, install or configuration
write. Host versions read with `--version` and extension listings only: Claude Code CLI
2.1.220, `anthropic.claude-code` 2.1.301, Codex CLI 0.163.0, `openai.chatgpt` 26.1007.21434,
Copilot CLI 1.0.89, VS Code 1.142.0 with built-in `copilot-chat` 0.70.0.

| Command | Actual result |
|---|---|
| `node tools/validate/validate-all.mjs` (before Step 40 changes) | PASS, exit 0: 12/12 groups; 179/179 validator self-tests; 214 cases / 516 eval files in sync; 19 docs; 2 m 6 s |
| `node tools/validate/validate-package.mjs` | PASS, exit 0: 15 Skills; L0 6,221 / 6,500; V-07b max 0.24; 237 references; V-16 214 cases; V-19 15 shipped + 2 editorial; 5 existing V-06 warnings |
| `node tests/provider-compatibility/check-identity.mjs` | PASS, exit 0: 15/15 checks; 15 skills, 237 references, 256 files |
| `node tools/catalog/check-catalog.mjs`; `check-technology.mjs`; `check-workflows.mjs` | PASS: 206 / 20, fingerprint `2f13cad24ff431e3`, 13 engineering Entry Skills; 108 technology; 12 workflows |
| `node tools/validate/check-security.mjs` | PASS: 256 package files, 15 entries, 237 references, 0 errors (developer assets 74 before, 76 after the two new scripts) |
| `node --test tests/security/boundaries.test.mjs`; `node --test tests/response-style/setup-fixtures.test.mjs` | PASS 34/34; PASS 19/19 |
| `node tools/evals/run-evaluation-suite.mjs` (no `--write`) | PASS, exit 0: identity 15/15, engineering 206/206, technology 108/108, workflows 12/12, routing examples 11/11, handoff 253 files / 0 dangling; proxy top-1 0.535, top-3 0.771, precision 0.51, no-match 0.488, ambiguous 17/27 |
| `git diff --name-only 1106226 HEAD -- <each of the 13 engineering skill dirs>`; same over manifests, marketplaces and the three catalogs | PASS: no file changed |
| Scratch proxy comparison over the 186 baseline trigger cases (`git archive 1106226` vs current tree) | SIMULATED: top-1 71→70 of 130, top-3 100→100, precision 71/138→70/138, no-match 15/34→15/34; 2 picks changed (`pos-frontend-i18n-angular` → Thai editorial; `amb-cache-catalogue` → English editorial) |
| Scratch MIT comparison of `upstream-notice.md` | PASS: fenced licence block identical to the canonical MIT text; copyright, upstream URL and version present |
| `node tools/evals/score-step40.mjs --check` | PASS: 120 cases (th 40, en 40, mixed 20, policy 20); 52 probes, all group minimums; 3 runs required |
| `node tools/evals/score-step40.mjs --self-test` (first run) | FAIL 54/56: two scorer defects (Thai inside fenced JSON ignored by language detection; JSX tag pattern stopped at `=>`). Fixed (DF-04) |
| `node tools/evals/score-step40.mjs --self-test` (final) | PASS 56/56 synthetic controls |
| Scratch scorer smoke: echo outputs for 120 cases × arms, all-pass synthetic probe summary | Ran end to end; echoed inputs pass 80/80 Thai/English automated checks, showing the checks guard fidelity, not quality |
| `node tools/evals/score-step40.mjs` (no inputs) | exit 0: NOT_RUN for discovery, quality/policy and human review |
| `node --check` on `score-step40.mjs`, `run-arms.mjs`, `run-provider-probes.mjs` | PASS |
| `node tests/evaluation/step40/run-arms.mjs --plan --provider claude`; `--plan --provider copilot --groups policy` | PASS, exit 0: 783 and 183 billed calls planned; nothing created or sent |
| Refusal checks: `run-arms.mjs` without `--allow-provider-calls`; `--provider codex`; `run-provider-probes.mjs --spec …` without the flag; `--spec ../outside.json` | Each exit 2 with the intended message; no provider call |
| `node tools/validate/validate-all.mjs` (after Step 40 changes, and again after the governance edits) | PASS, exit 0: 13/13 groups including G-17 (56/56) |
| Relative link and anchor check (Step 35 checker's link section, scratch copy) over the 12 changed or new Markdown files | PASS: 105 links, 0 errors |
| `node tools/validate/check-docs.mjs`; `git diff --check` | PASS: 19 documents, 0 errors; no whitespace errors |
| `git diff --name-only -- plugins catalog response-style .claude-plugin .agents .github` | PASS: no output (package, catalogs, policy, manifests and marketplaces unchanged) |

| Not run | Reason |
|---|---|
| Discovery probes (52 × 3 runs) on every surface | Billed; not authorized |
| Quality arms A/B and policy arms A/B/C | Billed and need isolated signed-in host homes; not authorized |
| Codex CLI, Codex IDE, Claude Code VS Code and VS Code Copilot Chat sessions | Need host installs or UI sessions in disposable profiles; not authorized (manual procedures in the Step 40 README) |
| Host lifecycle (install, disable, uninstall, policy removal) | `run-lifecycle.sh` needs its explicit opt-in; not authorized |
| Native engineering routing regression vs Step 32/34 | Billed; not authorized |
| Human language review (Thai, English) | No independent fluent reviewers available; rubric unapproved |
| Technology fact runners | No engineering content changed since Step 28 |
| Upstream licence re-fetch | Network not needed; Step 38 compared it byte for byte |

STOP after Step 40. No commit, push, tag, release, provider install, user configuration
change or Step 41 work.

## Step 41 — Documentation and release readiness

- **Date:** 2026-10-17 (Asia/Bangkok).
- **Status:** DONE, pending Product Owner approval. Documentation, licence review,
  version proposal and readiness recommendation only.
- **Preconditions:** read Steps 35–40, BUILD_CONTRACT, ACCEPTANCE_MATRIX, PROGRESS,
  DECISIONS, LICENSE_PROPOSAL, the manifests and marketplaces and all user/release
  documents. Clean tree at `e921df1` (the owner's commit of Step 40); nothing unrelated
  to preserve. The commit is recorded as acceptance by proceeding of the Step 40
  fixtures and tooling (inferred), but not as approval of the rubric or the ADR-0011
  language threshold, which require explicit approval (D-057 note). No version change
  was approved, so none was made.

### Work performed

1. **User documentation** for all 15 skills: README (status banner, example, writing
   guide link, third-party credit), plugin README (writing skills untested, policy not in
   the package, notice location), SKILLS_CATALOG (modes and guide links),
   AUTOMATIC_SKILL_DISCOVERY (15 skills / ~6,200 characters, writing-skill neighbours,
   measured results labelled as the 13-skill build), GETTING_STARTED (writing examples
   marked unmeasured, optional policy step), COMPATIBILITY_MATRIX (2026-10-17 installed
   versions, writing-skill and policy rows, 13-skill-build labels), the three install
   guides (Skills (15), writing-skill invocation, per-host optional policy section,
   verification rows), SECURITY_AND_LIMITATIONS (256 files, writing-skill boundaries,
   new limits) and CHANGELOG.
2. **Writing guide** `docs/WRITING_AND_EDITING.md`: both skills, audit / rewrite / create /
   website modes, automatic versus explicit invocation per provider, Thai and English
   examples, language choice, preservation, file-editing safety, the documentation-skill
   boundary and attribution. No existing user document covered this usage.
3. **Response style policy** (`docs/RESPONSE_STYLE.md`): new "Three setups, kept separate"
   section (A plugin only, B plugin + opt-in policy, C install-only always-on: not
   available, not claimed) and a stricter temporary loading check. Setup, scope,
   conflicts, disable/rollback and limitations sections were already present.
4. **Licensing:** fetched upstream `blader/humanizer` `LICENSE` and README read-only into
   an isolated scratch folder (HEAD commit 2026-10-16). The shipped notice's licence block
   is byte-identical (1,066-byte upstream file). Notice and attribution preserved; the
   Chayen licence stays pending (Q-05). LICENSE_PROPOSAL item 3 updated.
5. **Versioning:** all four version fields are `0.1.0-dev` and in parity. Proposed
   `0.1.0-rc.1` for an approved pilot or RC, then `0.1.0` (D-058, RELEASE_METADATA);
   **not applied**.
6. **Release documents:** RELEASE_READINESS (Step 41 report on top, Step 34 assessment
   preserved below), KNOWN_LIMITATIONS (KL-03/KL-04 refreshed; KL-09, KL-28, KL-44,
   KL-54, KL-55 added), RELEASE_CHECKLIST, RELEASE_METADATA, MARKETPLACE_LISTINGS.
7. **Record fixes from Step 40:** DF-06 (HUMANIZER_REQUIREMENTS status pointer) and DF-07
   (`validate-all` label G-15 → G-15E, G-15E row in SKILL_QUALITY_GATES, G-13 and
   evaluation README counts) resolved.
8. **Governance:** D-057 Step 41 note, D-058; DF-06/DF-07 RESOLVED, R-54 note; plan row
   and section for Step 41; Step 41 note and evidence on all MHR rows (no status change).

### File ledger (Step 41 only)

| Action | Path |
|---|---|
| Created | `docs/WRITING_AND_EDITING.md` |
| Modified | `README.md`, `CHANGELOG.md`, `plugins/codejadee-chayen-framework/README.md` |
| Modified | `docs/SKILLS_CATALOG.md`, `docs/AUTOMATIC_SKILL_DISCOVERY.md`, `docs/GETTING_STARTED.md`, `docs/COMPATIBILITY_MATRIX.md`, `docs/INSTALL_CLAUDE_CODE.md`, `docs/INSTALL_CODEX.md`, `docs/INSTALL_COPILOT.md`, `docs/SECURITY_AND_LIMITATIONS.md`, `docs/RESPONSE_STYLE.md` |
| Modified | `docs/distribution/RELEASE_CHECKLIST.md`, `RELEASE_METADATA.md`, `MARKETPLACE_LISTINGS.md`, `LICENSE_PROPOSAL.md` |
| Modified | `docs/chayen/RELEASE_READINESS.md`, `KNOWN_LIMITATIONS.md`, `HUMANIZER_REQUIREMENTS.md` (status pointer), `SKILL_QUALITY_GATES.md`, `DECISIONS.md`, `ISSUES.md`, `IMPLEMENTATION_PLAN.md`, `ACCEPTANCE_MATRIX.md`, `PROGRESS.md` |
| Modified | `tools/validate/validate-all.mjs` (label only), `tools/validate/README.md`, `tests/evaluation/README.md` |
| Unchanged | All 15 skills and references, manifests (versions), marketplaces, catalogs, response-style policy and template, tooling logic, every user-level or repository instruction file |
| Deleted | None |

Scratch only: upstream `LICENSE` and README copies, edit scripts.

### Actual verification

Node v26.8.1. No model or provider call, no install, no configuration write. The only
network access was two read-only HTTPS downloads from `raw.githubusercontent.com`
(upstream `LICENSE`, `README.md`) and one GitHub API read of the latest upstream commit.
Scripts were already inspected in Step 40; the only script change is the G-15E label.

| Command | Actual result |
|---|---|
| `git status --short`, `git log -3` before edits | Clean tree at `e921df1` |
| `curl -fsSL` upstream `LICENSE` and `README.md` into an isolated scratch folder; byte comparison with the fenced block in `upstream-notice.md` | PASS: identical (upstream 1,066 bytes, `Copyright (c) 2025 Siqi Chen`); upstream README licence section: "MIT" |
| Manifest/marketplace version read | `0.1.0-dev` in all four fields; parity true |
| `node tests/provider-compatibility/check-identity.mjs` | PASS 15/15; 15 skills, 237 references, 256 files |
| `catalog/editorial-skills.json` read | Both editorial records `existing` |
| `node tools/evals/score-step40.mjs --check` | PASS: 120 cases, 52 probes |
| `node tools/validate/check-security.mjs` | PASS: 256 package files, 15 entries, 237 references, 0 errors |
| `node tools/validate/check-docs.mjs` (during and after edits) | PASS: 20 documents (new writing guide included), 0 errors |
| `node tools/validate/check-response-style.mjs` | PASS (R-08 lifecycle sections intact) |
| `node tools/validate/validate-all.mjs` | PASS, exit 0: 13/13 groups (179/179 self-tests; G-15E, G-16, G-16T, G-17 56/56) |
| Relative link/anchor check over the changed or new Markdown files (Step 35 checker's link section) | PASS: 28 files, 232 links, 0 errors (final run, after this entry was written) |
| Mixed line-ending scan of modified files; `git diff --check` | No mixed endings; no whitespace errors |

| Not run | Reason |
|---|---|
| Provider discovery, quality, policy and lifecycle runs | Not authorized (instruction: no unauthorized provider calls) |
| Human language review | No reviewers; rubric unapproved |
| Version bump and its parity re-check | Not approved (D-058 proposal only) |
| `claude plugin validate --strict` | Not needed for documentation changes; DF-02 affects the installed 2.1.220 on one target |

STOP after Step 41. No commit, push, tag, publication, release, provider call or user
configuration change. Waiting for Product Owner approval; no further step is started.

## Owner follow-up — plugin identifier renamed to `chayen` (D-059)

- **Date:** 2026-10-17 (Asia/Bangkok).
- **Authorization:** owner instruction after installing the plugin: "เปลี่ยนชื่อ Plugin ได้เลย แต่ห้ามแก้ชื่อ Repo" (rename the plugin; do not rename the repository), following the request to shorten `/codejadee-chayen-framework:<skill>` to `/chayen…`.
- **Status:** DONE. Not a numbered step; Step 41 remains the last executed step.
- **Research:** Claude Code docs (read 2026-10-17 through the claude-code-guide agent): the namespace is the manifest `name`; `displayName` does not affect it; no alias mechanism; bare plugin-skill invocation is undocumented.

| Changed | Unchanged |
|---|---|
| `name` → `chayen` in both manifests and all three marketplace entries; install identifier `chayen@codejadee`; Claude Code invocation `/chayen:<skill>` | Repository name, `homepage`/`repository` URLs, marketplace name `codejadee`, directory `plugins/codejadee-chayen-framework/`, the 15 skill names, version `0.1.0-dev`, catalogs, skill content |

### File ledger

| Action | Path |
|---|---|
| Modified | `plugins/codejadee-chayen-framework/plugin.json`, `.claude-plugin/plugin.json`, `README.md` (title and rename note) |
| Modified | `.claude-plugin/marketplace.json`, `.agents/plugins/marketplace.json`, `.github/plugin/marketplace.json` |
| Modified | `README.md`, `CHANGELOG.md` (Changed entry), `docs/INSTALL_CLAUDE_CODE.md`, `INSTALL_CODEX.md`, `INSTALL_COPILOT.md` (identifiers and a "Renamed from" migration section each), `GETTING_STARTED.md`, `AUTOMATIC_SKILL_DISCOVERY.md`, `COMPATIBILITY_MATRIX.md`, `WRITING_AND_EDITING.md`, `docs/distribution/MARKETPLACE_LISTINGS.md`, `RELEASE_METADATA.md` |
| Modified | `tests/provider-compatibility/README.md`, `claude-code-vscode.md`, `copilot-vscode.md`, `run-lifecycle.sh`, `check-identity.mjs` (name read from the manifest); `tests/evaluation/run-provider-probes.mjs` (explicit prefix read from the manifest); `tests/routing/smoke-cases.json`; `tests/skills/validator-mutations.json` (3 cases); `tools/evals/run-evaluation-suite.mjs` (provider-syntax scan covers both prefixes); `tools/validate/check-docs.mjs` (old identifier allowed only as migration text) |
| Modified | `docs/chayen/DECISIONS.md` (D-014 amendment note, D-059), `ISSUES.md` (Q-03), `ADRS/ADR-0008-packaging-and-marketplace-strategy.md`, `ARCHITECTURE.md`, `PLUGIN_PACKAGE_DESIGN.md` (amendment notes), `RELEASE_READINESS.md`, `ACCEPTANCE_MATRIX.md`, `PROGRESS.md` |
| Not changed | Historical step records and recorded results keep the old name |

### Actual verification

| Command | Result |
|---|---|
| Review of every added line of the rename diff | Only plugin-identifier uses changed; repository name, URLs and paths kept |
| `node tests/provider-compatibility/check-identity.mjs` | PASS 15/15 |
| `claude plugin validate --strict plugins/codejadee-chayen-framework`; `claude plugin validate --strict .` (Claude Code 2.1.220; file validation, no model call) | Both "Validation passed" |
| `node tools/validate/check-docs.mjs` | PASS: 20 documents, 0 errors |
| `node --check tests/evaluation/run-provider-probes.mjs`; `bash -n tests/provider-compatibility/run-lifecycle.sh`; probe runner without `--allow-provider-calls` | PASS; PASS; exit 2 (refused, no call) |
| `node tools/validate/validate-all.mjs` | PASS, exit 0: 13/13 groups, 179/179 validator self-tests |
| `node tools/evals/run-evaluation-suite.mjs` (no `--write`) | PASS: identity, 206/108/12 traceability, handoff 253 files / provider syntax 0 |

| Not run | Reason |
|---|---|
| Uninstall of the old identifier and install of `chayen@codejadee` on any host | Changes the owner's real configuration; left to the owner (commands in the install guides) |
| A `renames` migration map | Support in Claude Code 2.1.220 and in V-01a is unverified; pre-release with one known install |

No commit, push, tag or release.

# Release Gate Matrix: Chayen v0.1.0

> **Owner decision (2026-10-18):** GitHub Actions workflows and GitHub Releases are not part of Chayen distribution. Maintainers run offline validators and native CLI checks manually against an identified source revision. Stable status is based on approved `0.1.0` manifest versions and verified behavior, **not** a GitHub Release. Git tags are optional. Older Phase 3 CI references below are historical. Security/Support remains **LATER**, and automatic Skill Routing >=85% per CLI remains mandatory.


| Field | Value |
|---|---|
| Release | Chayen v0.1.0: public production release for verified CLI providers |
| Date | 2026-10-18 (Plan v4, Phase 6: final release qualification. **Final decision: NO-GO**, see [FINAL_RELEASE_READINESS](FINAL_RELEASE_READINESS.md)) |
| Status as of | Current tip `4bda4db8fb6b50b78388f8400a576ccc07fe7c53` (`main` = `origin/main`, no tag). It records the owner decision removing GitHub Actions and GitHub Releases and changes no package file. RC.1 content was first committed at `38570b3`. Package fingerprint `efc4c6e6…` (committed LF bytes) / `9e5705fe…` (Windows CRLF checkout, the Phase 4 native-tested snapshot); line-ending-normalized content identical; Skill metadata `339b3125d1347648`. Not a formal M1 freeze (G-01, G-04 final source, G-15 outstanding). Phase 5: **0 billed provider calls** (OD-10 not granted). Phase 6: **NO-GO** ([FINAL_RELEASE_READINESS](FINAL_RELEASE_READINESS.md)). Reports: [ROUTING_EVALUATION](ROUTING_EVALUATION.md) · [HUMANIZER_QUALITY_REPORT](HUMANIZER_QUALITY_REPORT.md) · [CAPABILITY_SAMPLE_RESULTS](CAPABILITY_SAMPLE_RESULTS.md) · [SECURITY_TEST_REPORT](SECURITY_TEST_REPORT.md) · [NATIVE_LIFECYCLE_REPORT](NATIVE_LIFECYCLE_REPORT.md) |
| Scope and contract | [RELEASE_SCOPE_DECISION.md](RELEASE_SCOPE_DECISION.md) (owner decisions, K-01..K-20, routing contract §4) |
| Accepted risks | [ACCEPTED_RISKS.md](ACCEPTED_RISKS.md) (AR-01..AR-04) |
| Baseline (preserved) | [PRODUCTION_READINESS_MATRIX.md](PRODUCTION_READINESS_MATRIX.md) (PG-01..PG-43) · [PRODUCTION_GAP_ANALYSIS.md](PRODUCTION_GAP_ANALYSIS.md) · [PHASE_01_EVIDENCE.md](PHASE_01_EVIDENCE.md) |

This matrix is the release gate set for v0.1.0. It narrows the 43 baseline
gates to 17 release gates and removes the deferred items, which are recorded
as accepted risks. The baseline matrix is still the historical record, and
the traceability table in §4 maps every baseline gate to a release gate or
an accepted risk.

## 1. Rules

### 1.1 Status vocabulary

| Status | Meaning |
|---|---|
| PASS | The requirement is satisfied, shown by recorded evidence on the revision named in the gate |
| FAIL | At least one part of the requirement was checked and is not satisfied |
| NOT_RUN | The check could be run with what exists today, but has not been |
| BLOCKED | The check cannot run until an owner decision, authorization, frozen candidate, reviewer, tool or environment exists |
| NOT_APPLICABLE | The gate does not apply to this release. A written reason is required. No v0.1.0 gate currently uses it |

**Combining parts of a gate.** A gate's status is the worst status among
its parts, in this order: FAIL > BLOCKED > NOT_RUN > PASS.

For example, G-10 is FAIL because a documentation part fails, even though
its measurement part is only BLOCKED.

### 1.2 Accepted risks are separate

An accepted risk never makes a gate PASS.

- The deferred items AR-01..AR-04 are not part of any gate requirement.
- They are tracked only in [ACCEPTED_RISKS.md](ACCEPTED_RISKS.md).

A provider limitation can make a requirement impossible. Example: a Copilot
uninstall from a local marketplace that only disables the plugin. In that
case:

- the result is recorded as FAIL;
- the owner may amend the requirement by a recorded decision and a new
  accepted risk;
- the gate is then re-evaluated against the amended requirement;
- the original FAIL evidence stays on record.

### 1.3 Release milestones

| Milestone | Meaning | Gates that must PASS first |
|---|---|---|
| **M1: Candidate freeze** | One commit carrying `0.1.0-rc.1` whose content is final. All runtime evidence is measured on this commit. A freeze needs no tag. Tagging is a separate authorized act | G-01, G-02, G-03, G-04, G-05 (candidate fields), plus the G-15 parts that change frozen content (`LICENSE`, manifest `license`) |
| **M2: Public visibility** | The repository or a public mirror becomes reachable without access rights. This is an owner act that needs explicit authorization | G-16, plus the G-15 parts covering licence and rights (OD-03) |
| **M3: Stable `0.1.0`** | The release commit, the tag, the public install source and the release notes | All 17 gates PASS |

**Resets.** Runtime gates are measured only on the frozen candidate.

- A content change after M1 needs a new candidate (`0.1.0-rc.2`) and resets
  G-06..G-14 to BLOCKED.
- Any `SKILL.md` description change also resets G-09 and G-10.
- A version or identifier change resets G-06..G-08.

The narrow version-only change from the candidate to `0.1.0` is handled by
the G-17 delta rule.

### 1.4 ID namespace

**G-01..G-17 in this document are release gates.**
[SKILL_QUALITY_GATES.md](../chayen/SKILL_QUALITY_GATES.md) uses the same
labels, G-01..G-17 (plus G-03b, G-03c, G-15E and G-16T), for skill-quality
gates, and `validate-all.mjs` prints those labels. The two sets have
different meanings. For example:

| Label | Skill-quality gate | Release gate |
|---|---|---|
| G-16 | Response style policy static check | Security and support decision |
| G-17 | Step 40 dataset and scorer | Release integrity |

The rules:

- Inside `docs/production/`, a bare G-nn means a release gate.
- Everywhere else, write **"release gate G-nn"** or **"quality gate G-nn"**.
- A `validate-all` result is evidence for release gate G-03. It never
  counts as a release gate result under its own label.

### 1.5 Updating this matrix

Change a status only on new recorded evidence: the command or procedure, the
exit code or outcome, the revision, the package fingerprint where relevant,
and the date.

- Static checks never move a runtime gate (G-06..G-14) to PASS.
- The historical results (for example 12/22 automatic routing on the
  13-skill build, or the 2026-10-14 lifecycle on the 6-skill build) are not
  evidence for any v0.1.0 gate.

## 2. Summary

| Gate | Name | Status | Blocks M1 | Blocks M2 | Blocks M3 | KEEP items | Responsible |
|---|---|---|---|---|---|---|---|
| G-01 | Architecture | **BLOCKED** (technical parts PASS; D-009/DF-03 ratification open) | Yes | — | Yes | K-01 | Maintainer; Owner (OD-11) |
| G-02 | Product Scope Correctness | **PASS** (static) | Yes | — | Yes | K-02, K-03, K-04 | Maintainer |
| G-03 | Validators and Regression Tests | **PASS** (on `38570b3` and `4bda4db`; Node 20.11.0 and 24.22.0) | Yes | — | Yes | K-05, K-06, K-07 | Maintainer |
| G-04 | Manual Offline Validation | **NOT_RUN** (final stable source; RC sources PASS) | Yes | — | Yes | K-08 | Maintainer |
| G-05 | Version Integrity | **BLOCKED** (committed freeze) | Yes | — | Yes | K-09 | Maintainer; Owner (OD-02) |
| G-06 | Claude Code Lifecycle | **BLOCKED** | — | — | Yes | K-06, K-10 | Evaluation Operator |
| G-07 | Codex Lifecycle | **BLOCKED** (committed freeze) | — | — | Yes | K-06, K-11 | Evaluation Operator; Maintainer |
| G-08 | Copilot Lifecycle | **BLOCKED** | — | — | Yes | K-06, K-12 | Evaluation Operator |
| G-09 | Automatic Routing ≥ 85% per CLI | **BLOCKED** (was FAIL; not measured) | — | — | Yes | K-03, K-13 | Evaluation Operator; Owner (OD-05) |
| G-10 | Explicit Invocation and No-match | **BLOCKED** | — | — | Yes | K-07, K-14 | Evaluation Operator; Maintainer |
| G-11 | Humanizer Quality | **BLOCKED** (content fixed) | Content parts | — | Yes | K-04, K-05, K-15 | Owner (OD-06, OD-07); Reviewers; Operator |
| G-12 | Engineering Capability Sampling | **BLOCKED** | — | — | Yes | K-16 | Owner (OD-08); Operator |
| G-13 | Technology Fact Checks | **NOT_RUN** (73 PASS / 0 FAIL / 86 NOT_RUN) | — | — | Yes | K-17 | Maintainer |
| G-14 | Agent Security | **BLOCKED** | Static part | — | Yes | K-01, K-18 | Operator; Owner (OD-11) |
| G-15 | Public Distribution and License | **FAIL** | Licence files | Licence and rights | Yes | K-05, K-19 | Owner (OD-03); Maintainer |
| G-16 | Security and Support Decision | **BLOCKED** | — | **Yes** | Yes | K-20 | Owner (OD-01) |
| G-17 | Source and Version Integrity (no GitHub Release) | **BLOCKED** | — | — | Yes (final gate) | K-01, K-07, K-09 | Release Governance Lead; Owner (OD-12) |

| Status | Count | Gates |
|---|---|---|
| PASS | 2 | G-02, G-03 |
| FAIL | 1 | G-15 |
| NOT_RUN | 2 | G-04, G-13 |
| BLOCKED | 12 | G-01, G-05, G-06, G-07, G-08, G-09, G-10, G-11, G-12, G-14, G-16, G-17 |
| NOT_APPLICABLE | 0 | — |
| **Total** | **17** | |

**Release readiness:** **NOT READY (Phase 6: NO-GO).** All three milestones are blocked:
- M1 by G-01 (D-009 ratification), final-source G-04, G-05 and outstanding G-15 content;
- M2 by the later G-16 decision;
- M3 by 15 of the 17 gates. These are release milestone prerequisites, not reasons to stop isolated Phase 4 lifecycle work. Security/Support is LATER; accepted deferrals add no Phase 4 blockers.

**Phase 6 final decision (2026-10-18): NO-GO.** The results are 2 PASS, 1 FAIL, 2 NOT_RUN and 12 BLOCKED. No approved disposition covers the failing or blocked gates. The checks were independently re-run on clean clones of `38570b3` and of the current tip `4bda4db`, which removes the GitHub Actions and GitHub Release requirements by owner decision and leaves the package byte-identical; see [final-checks.json](../../tests/production/results/2026-10-18-phase6/final-checks.json). G-01 was challenged from PASS to BLOCKED: scope §3.4 requires D-009/DF-03 to be ACCEPTED, and D-009 is still PROPOSED. No routing score exists on any CLI. Remaining work: [FINAL_RELEASE_CHECKLIST](FINAL_RELEASE_CHECKLIST.md) and [OWNER_APPROVAL_CHECKLIST](OWNER_APPROVAL_CHECKLIST.md).

**Phase 5 (2026-10-18).** No automatic routing accuracy exists for any CLI. G-09 moved FAIL → BLOCKED only because its tooling preconditions (P1-008, P1-015) are now implemented. It is not a routing PASS: each CLI must still independently reach ≥ 85% on the frozen fingerprint. The runtime gates G-09..G-12 and G-14 (adversarial part) need OD-10 billed-run authorization with a budget, plus OD-05/OD-06/OD-08/OD-11 decisions, fluent reviewers and Copilot CLI ≥ 1.0.91. The prepared matrix is 2,268 calls (756 per CLI). Static checks never move these gates to PASS.

**Roles.** These are roles, not named people:

| Role | Who |
|---|---|
| Owner | The Product Owner, CodeJaDee |
| Maintainer | Repository changes and offline checks |
| Evaluation Operator | Authorized provider runs |
| Reviewers | Fluent TH and EN reviewers, plus an adjudicator |
| Release Governance Lead | Evidence review and matrix updates |

## 3. Gate definitions

### G-01: Architecture

| Field | Definition |
|---|---|
| Requirement | The Native Agent Plugin architecture is preserved (ADR-0001, ADR-0005, EX-01..EX-07): no CLI, extension, runtime, daemon, installer or mandatory MCP. The package `plugins/codejadee-chayen-framework/` holds only `.md` and `.json` files, with no `hooks/`, `agents/`, `commands/`, `.mcp.json`, `settings.json`, scripts, telemetry or executables. All three marketplaces point to that one skills source. The dual-manifest format decision (D-009 / DF-03) is ratified (scope §3.4) |
| Verification method | `node tools/validate/validate-all.mjs` (V-09, V-25); `node tools/validate/check-security.mjs`; `node --test tests/security/boundaries.test.mjs`; `node tests/provider-compatibility/check-identity.mjs` (IC-02); `claude plugin validate --strict` on the plugin and the marketplace; an independent file-type count of the package |
| Required evidence | An evidence-log entry for each command: exit code, counts, revision. Re-run on the frozen candidate under G-17 |
| Dependencies | None to establish. OD-11 for the D-009 ratification. Re-checked at G-17 |
| Responsible party | Maintainer (runs); Release Governance Lead (review); Owner (OD-11) |
| Current status | **BLOCKED** (Phase 6 challenge; previously PASS). The technical parts PASS on candidate `38570b3`, re-run in Phase 6:<br>• static package of 254 `.md` + 2 `.json` files, with no hooks, agents, commands, scripts, MCP, settings or executables;<br>• one shared source; V-25 0 errors; boundaries 34/34; identity 15/15;<br>• `claude plugin validate --strict` PASS on the plugin and the marketplace.<br>The requirement also includes ratification of D-009/DF-03. `DECISIONS.md` still lists D-009 as PROPOSED (DF-03 OPEN), and scope §3.4 says a release-related decision must be ACCEPTED before its gate can PASS. Needs OD-11. |
| Release-blocking behaviour | Blocks M1 and M3. Any later FAIL, such as an executable file, a hook or a second skills source, stops the release until fixed. A static PASS is never a runtime guarantee |

### G-02: Product Scope Correctness

| Field | Definition |
|---|---|
| Requirement | The inventory is intact: 15 Entry Skills (≤ 15, D-053), 206 Engineering Capabilities in 20 domains, 108 Technology Capabilities in 11 packs, 12 Composite Workflows with 7 templates. L0 metadata is ≤ 6,500 characters. Every `SKILL.md` is ≤ 300 lines. **Nitro and Elysia are not presented as supported** in any `SKILL.md` description, scope line or example, in any reference, catalog stack list or positive test case, or in the user docs, following the explicit Phase 2 instruction (remove supported mentions and add scope exclusions). `chayen-humanizer-th`'s description is consistent with its scope and cases (P1-012) |
| Verification method | `check-catalog.mjs`, `check-technology.mjs`, `check-workflows.mjs`, `validate-package.mjs` (V-05, V-06, V-07, V-17); `rg -i "nitro\|elysia" plugins catalog tests/skills docs README.md`, with each remaining hit justified against OD-04; a review of the Thai description against its scope and the trigger cases |
| Required evidence | Counts and L0 figure on the candidate commit; grep output with justifications; validator output |
| Dependencies | OD-04 (implementation option); K-03, K-04 (Phase 5); G-03 guards in place first. Changing descriptions resets G-09 and G-10 |
| Responsible party | Maintainer |
| Current status | **PASS** (static, Phase 2). P1-007/P1-012 corrected: standalone Nitro/Elysia guidance and positive routing removed; supported Nuxt and general Node guidance retained; Thai locale-copy scope and metadata aligned. Inventory remains 15/206/108/12; 7 templates; L0 6,217/6,500; every Skill <=300 lines. `check-hardening.mjs` and negative mutations cover regressions. This is not runtime routing evidence. |
| Release-blocking behaviour | Blocks M1, because content must be final before the candidate fingerprint is frozen, and M3 |

### G-03: Validators and Regression Tests

| Field | Definition |
|---|---|
| Requirement | All existing offline suites pass, and the guards required by the KEEP items exist, each with a negative control: (1) the upstream MIT notice exists, is identical by full-document SHA-256 after canonical CRLF-to-LF normalization and is linked from `chayen-humanizer-en/SKILL.md` (P1-013); (2) the Step 40 scorer detects dropped Thai digits and Buddhist Era conversion (P1-014); (3) a static check that the lifecycle script covers every required step for each CLI and checks uninstall by absence (P1-018); (4) runbook skill counts agree with the package (P1-019); (5) docs-consistency rules for skill count, package file count, L0 figures, plugin identifier and version (P1-020) |
| Verification method | `validate-all.mjs`; `run-validator-tests.mjs`; `boundaries.test.mjs`; `setup-fixtures.test.mjs`; `score-step40.mjs --self-test` and `--check`; `check-identity.mjs`; `run-evaluation-suite.mjs` (no `--write`); `generate-claude-evals.mjs --check` |
| Required evidence | Exit codes and pass counts on the candidate commit. The new negative controls are listed by ID and fail as expected when mutated |
| Dependencies | K-05/K-06 (Phase 2), K-07 (Phase 3) |
| Responsible party | Maintainer |
| Current status | **PASS** (Phase 6, on committed sources). `validate-all` passes 19/19 in clean clones of `38570b3` and of `4bda4db` on Node 24.22.0 and on the official Node 20.11.0 binary (SHA-256 verified). The evaluation suite and identity (15/15) pass on both. This includes 179 validator cases, the upstream-notice and numeral guards, the lifecycle and RC negative controls, and the current-doc mutations. With the uncommitted Phase 5/6 tooling, the working tree passes 20/20 groups (13 additional Phase 5 controls). Evidence: [final-checks.json](../../tests/production/results/2026-10-18-phase6/final-checks.json). This does not establish routing or provider behaviour. |
| Release-blocking behaviour | Blocks M1 and M3. A failing suite on the candidate stops the freeze |

### G-04: Manual Offline Validation

| Field | Definition |
|---|---|
| Requirement | On the exact stable-version source revision, run all approved offline validators, negative/mutation controls and package/identity checks locally. **GitHub Actions workflows are not used or required.** Record the result and source SHA; passing local checks alone never proves provider runtime behavior. |
| Verification method | `node tools/validate/validate-all.mjs --fail-fast`; `node tests/provider-compatibility/check-identity.mjs`; `node tools/evals/run-evaluation-suite.mjs --fail-fast`; affected negative controls |
| Required evidence | Source SHA, commands, toolchain versions, exit codes, results and reviewer sign-off |
| Dependencies | G-03; final candidate/stable source revision |
| Responsible party | Maintainer and release approver |
| Current status | **NOT_RUN on the final stable-version source**, because no `0.1.0` source exists yet. On the current RC sources, Phase 6 ran the G-04 method manually in clean clones of `38570b3` and `4bda4db`: `validate-all` 19/19 on Node 20.11.0 and 24.22.0, `check-identity` 15/15, `run-evaluation-suite --fail-fast` PASS, CI negative controls 4/4, and native strict validation 2/2 on `38570b3`. Reviewer sign-off on the final source is still required. The former GitHub Actions pipeline is discontinued by owner decision. |
| Release-blocking behaviour | Blocks stable declaration if manual final-source checks fail or are not executed. GitHub Actions and GitHub Releases are not Release Gates. |

### G-05: Version Integrity

| Field | Definition |
|---|---|
| Requirement | The four version fields agree: both manifests, the Copilot marketplace entry and its `metadata.version`. They read `0.1.0-rc.1` at M1 and `0.1.0` at M3, never `-dev` in a release. There is one tag format (OD-02), and ADR-0008 and the release checklist agree on it. `CHANGELOG.md` has the matching section. The `SECURITY.md` supported-versions table lists the version. When authorized, the tag points at the commit whose version equals the tag |
| Verification method | `check-identity.mjs` (IC-05, IC-06); `validate-package.mjs` (V-04); `check-docs.mjs` (D-05); `git show <tag>:<manifest>` comparison |
| Required evidence | Identity 15/15 PASS on the candidate and the release commits; a diff of the four fields; tag-to-commit verification |
| Dependencies | Accepted tag strategy; K-09 (later candidate freeze); G-02 content final |
| Responsible party | Maintainer; Owner (OD-02, commit and tag authorization) |
| Current status | **BLOCKED.** The four version fields agree on `0.1.0-rc.1` (identity 15/15 on `38570b3` and `4bda4db`) and the content is committed. Remaining: stable `0.1.0` source, CHANGELOG and SECURITY version table for the stable version, M1 prerequisites (G-01, G-15), and the canonical package-fingerprint rule (committed LF versus CRLF checkout). Git tags are optional by the 2026-10-18 owner decision; if created, they must use the ADR-0008 `vX.Y.Z` form and match the manifest revision. No tag was created. |
| Release-blocking behaviour | Blocks M1 (candidate fields) and M3 |

### G-06: Claude Code Lifecycle

| Field | Definition |
|---|---|
| Requirement | On Claude Code CLI, in an isolated config home, from the frozen candidate: marketplace add; install `chayen@codejadee`; native inventory shows Skills (15); disable and prove disabled loading; enable; advance version and content in scratch and verify active version/full installed hash; uninstall, verified by absence; reinstall/new-process inventory; former-identifier migration; marketplace remove. Real configuration and application fixtures are unchanged. CLI version recorded |
| Verification method | The corrected `tests/provider-compatibility/run-lifecycle.sh` (K-06) and runbook R-1..R-10 |
| Required evidence | A dated result file under `tests/provider-compatibility/results/` naming the revision, package fingerprint, CLI version, skill count and identifier, with each step's outcome |
| Dependencies | M1 (G-01..G-05); K-06; OD-10 (authorization, isolated profile) |
| Responsible party | Evaluation Operator; Release Governance Lead (review) |
| Current status | **BLOCKED.** Claude Code 2.1.302 native register/install/list/15-Skill inventory, toggle persistence, RC.1-to-scratch-RC.2 changed-content update, uninstall absence, reinstall/new-process inventory and former-identifier migration PASS on the recorded snapshot. Disabled loading remains BLOCKED: details includes disabled contents and cannot prove activation. Committed M1 freeze also pending. Configuration/application checks PASS. See Phase 4 report/transcripts; no model-routing evidence is claimed. |
| Release-blocking behaviour | Blocks M3. An uninstall that only disables the plugin is FAIL, never PASS |

### G-07: Codex Lifecycle

| Field | Definition |
|---|---|
| Requirement | On Codex CLI, from the frozen candidate: marketplace add; `plugin add`; listed as installed; a new session sees 15 Skills; disable through `config.toml`, then enable; the update path recorded (Codex has no per-plugin update, KL-32); remove; marketplace remove. `chayen` resolves from `plugins/codejadee-chayen-framework/plugin.json` (P1-027). The marketplace `authentication` and `category` values are confirmed against a dated official source, or corrected, and install shows no authentication step (P1-026). `config.toml` is byte-identical afterwards. An isolation plan is approved before the run, because Codex authentication was not portable to an isolated home in 2026-10-14 |
| Verification method | Corrected lifecycle script and runbook; a source review for the marketplace fields |
| Required evidence | A dated result file as in G-06, plus the official-source citation for the marketplace fields |
| Dependencies | M1; K-06, K-11; OD-10 |
| Responsible party | Evaluation Operator; Maintainer (marketplace fields) |
| Current status | **BLOCKED** on committed M1 freeze. Codex CLI 0.163.0 supported native lifecycle PASS on the exact snapshot: add/list/15-Skill native inventory; disposable config disable/enable with fresh skills/list 0/15; changed-version/full-content remove/add replacement; remove/absence; reinstall/new-process inventory; former-identifier migration. Dedicated disable/enable/update commands are UNSUPPORTED, with tested native alternatives. Official OpenAI source confirms marketplace fields; root manifest installation required no authentication. P1-026/P1-027 parts addressed. Real config/application checks PASS. See Phase 4 report for dated source and transcripts. |
| Release-blocking behaviour | Blocks M3 |

### G-08: Copilot Lifecycle

| Field | Definition |
|---|---|
| Requirement | On Copilot CLI ≥ 1.0.91, with `COPILOT_AUTO_UPDATE=false` and an isolated `COPILOT_HOME`, from the frozen candidate: marketplace add; install ("Installed 15 skills"); `skill list`; disable; enable; update from the previous version; uninstall, verified by absence; marketplace remove. CLI version recorded |
| Verification method | Corrected lifecycle script and runbook |
| Required evidence | A dated result file as in G-06 |
| Dependencies | M1; K-06, K-12; OD-10, including installing Copilot CLI |
| Responsible party | Evaluation Operator |
| Current status | **BLOCKED.** Native executable unavailable (ENOENT) on 2026-10-18; every provider operation is BLOCKED, not UNSUPPORTED or PASS. Phase 4 report supplies the exact pending native procedure, local live-source update distinction, version/content/absence assertions and migration steps. No CLI install, sign-in or production credential use was attempted. Historical KL-33 is not presumed resolved. |
| Release-blocking behaviour | Blocks M3. An uninstall that only disables is FAIL (see §1.2 for the amendment route) |

### G-09: Automatic Routing ≥ 85% per CLI

| Field | Definition |
|---|---|
| Requirement | Under the [routing contract](RELEASE_SCOPE_DECISION.md#4-routing-evaluation-contract), on **each** of the three CLIs independently, automatic routing accuracy is **≥ 85%** (OWN-05). This is native selection of a correct Skill on positive probes, with explicit invocations excluded. Proposed thresholds PT-02 (wrong-Skill), PT-04 (negative), PT-05 (per-Skill floor) and PT-06 (sample) apply once the owner approves them. Preconditions: the probe set gives all 15 Entry Skills positive probes and includes the writing-skill overlap probes; the tooling measures the natively installed candidate on all three CLIs and records the commit, package and metadata fingerprints, the probe-file hash, the CLI version and the model |
| Verification method | `tests/evaluation/run-provider-probes.mjs` (extended under K-13); `tools/evals/score-step40.mjs --probes …`; `tools/evals/run-evaluation-suite.mjs --probes …` |
| Required evidence | A `summary.json` per CLI for the frozen fingerprint, with ≥ 3 runs per probe, a no-plugin baseline arm, per-type rates, Wilson intervals and a per-Skill breakdown |
| Dependencies | M1 (final descriptions after K-03 and K-04); G-06..G-08 install working; K-13; OD-05, OD-10 |
| Responsible party | Evaluation Operator; Owner (OD-05, OD-10); Release Governance Lead (review) |
| Current status | **BLOCKED** (was FAIL on preconditions P1-008/P1-015). Phase 5 implements those preconditions, offline-verified:<br>• a frozen 82-scenario probe set: 44 positive covering all 15 Skills twice plus 14 overlap probes, 12 negative, 10 no-match, 1 inspect-first, 15 explicit;<br>• `run-phase5.mjs`, which measures the natively installed candidate on Claude, Codex and Copilot and records commit, package/metadata fingerprints, probe hash, CLI version and model;<br>• per-CLI Wilson summaries that refuse pooling.<br>**0 provider runs**, so no accuracy is claimed for any CLI. Remaining: OD-10 authorization and budget; OD-05 review of expected sets and PT-01..06; Codex signal pilot review; Copilot CLI install. See [ROUTING_EVALUATION](ROUTING_EVALUATION.md). |
| Release-blocking behaviour | Blocks M3. A CLI below 85% blocks the release; it cannot stay listed as supported and be excused. Any description change resets the gate |

### G-10: Explicit Invocation and No-match

| Field | Definition |
|---|---|
| Requirement | **Explicit:** each of the 15 Skills is invoked with the host syntax (`/chayen:<skill>`, `$chayen-<skill>`, `/chayen-<skill>`) on each CLI, ≥ 3 runs. Threshold PT-01 (proposed: 100%). **No-match:** native behaviour unchanged compared with the no-plugin baseline, on each CLI. Threshold PT-03 (proposed: ≥ 95% with no Chayen Skill). **Documentation:** explicit-invocation and no-match claims cite only results measured on the shipped namespace and build. ADR-0003 is ratified, or superseded by the approved thresholds |
| Verification method | Explicit and no-match groups of the provider probes; a documentation review |
| Required evidence | The per-CLI summaries from G-09, explicit and no-match sections; corrected docs |
| Dependencies | As G-09; K-07 (docs), K-14; OD-05, OD-11 |
| Responsible party | Evaluation Operator; Maintainer (docs) |
| Current status | **BLOCKED** on authorized native measurements. Phase 3 fixes P1-009/P1-036 documentation. Phase 5 prepares 15 explicit probes (one per Skill, native syntax per host) and 10 no-match plus 12 negative probes with a no-plugin baseline arm. Explicit invocation and no-match remain NOT_RUN on every CLI; no runtime PASS is claimed. |
| Release-blocking behaviour | Blocks M3 |

### G-11: Humanizer Quality

| Field | Definition |
|---|---|
| Requirement | **Content:** K-04 is applied (Thai description; Thai numerals and Buddhist Era dates protected), and the K-05 scorer controls exist. **Decisions:** the rubric, language threshold and critical-failure rule are approved (OD-06); reviewers are named (two fluent reviewers per language plus an adjudicator); the independent-case share is set and applied before scoring; the translation-direction scope is decided (OD-07). **Evaluation:** Step 40 quality arms A and B run on each CLI over the 120 cases, are scored automatically and are rated by humans for naturalness, clarity and tone. Results meet the approved thresholds. The proposals are: ≥ 4/5 on ≥ 90% of cases per language, zero critical preservation failures, and audit-only cases never edit files. Implicit TH/EN routing is measured under G-09 and injection cases under G-14. Arm C (policy) is excluded (AR-01) |
| Verification method | `tests/evaluation/step40/run-arms.mjs` (arms A and B); `tools/evals/score-step40.mjs --outputs … --reviews …`; reviewer files |
| Required evidence | Arm outputs per CLI, scorer reports, signed reviewer score files, the case-provenance record, MHR rows promoted only from this evidence |
| Dependencies | OD-06, OD-07, OD-10; K-04, K-05, K-15; M1 |
| Responsible party | Owner (OD-06, OD-07); Reviewers; Evaluation Operator; Maintainer (content) |
| Current status | **BLOCKED.** Phase 2 content/scorer defects P1-012/P1-014 are fixed with numeric and calendar regression tests. Phase 5 prepares a 30-case risk-based subset (12 TH, 12 EN, 6 mixed/adversarial) with baseline and plugin arms in Step 40 scorer format. It records dataset gaps: no Thai-digit case and one BE case; three supplementary cases are PROPOSED. **0 model outputs; no human scores exist or are invented.** Rubric approval (OD-06), reviewers and authorization (OD-10) remain prerequisites. See [HUMANIZER_QUALITY_REPORT](HUMANIZER_QUALITY_REPORT.md). |
| Release-blocking behaviour | The content parts block M1; the evaluation blocks M3 |

### G-12: Engineering Capability Sampling

| Field | Definition |
|---|---|
| Requirement | Behaviour is verified on an **owner-approved, risk-based sample** of the 206 Engineering Capabilities and all 12 Composite Workflows (OD-08). The sample covers at least the primary stacks named in the manifest description (C#/ASP.NET Core, Angular, SQL Server) and every workflow. It runs on each CLI, with ≥ 3 runs per item and a no-plugin baseline, and is graded against the recipe and workflow case specifications. Catalog rows are promoted to VERIFIED only from recorded run files (BC-10). Owner acceptance of the IMPLEMENTED bar instead would be a requirement amendment with a new accepted risk, not a PASS |
| Verification method | Behaviour runs graded against `tests/skills/recipe-cases.json` and the workflow specifications; `check-catalog.mjs` and `audit-coverage.mjs` status counts |
| Required evidence | Run files under `tests/**/results` for the agreed sample, grading records, updated catalog statuses |
| Dependencies | OD-08, OD-10; M1; an agent runner or procedure for recipe and workflow cases (none exists today, KL-15) |
| Responsible party | Owner (OD-08); Evaluation Operator; Maintainer |
| Current status | **BLOCKED.** Phase 5 provides a runner and a proposed sample of 24 scenarios across .NET, Angular/TS, SQL Server, PostgreSQL, cross-stack, security, testing and DevOps, plus 4 workflows (WF-01, WF-05, WF-07, WF-10), with a no-plugin baseline (KL-15 runner gap addressed). No approved sample (OD-08), no authorization (OD-10) and 0 runs. Still 0 of 206, 0 of 108 and 0 of 12 VERIFIED; untested capabilities stay IMPLEMENTED. See [CAPABILITY_SAMPLE_RESULTS](CAPABILITY_SAMPLE_RESULTS.md) |
| Release-blocking behaviour | Blocks M3 |

### G-13: Technology Fact Checks

| Field | Definition |
|---|---|
| Requirement | All defined framework fact checks (152 per E-06) run in a disposable environment with pinned toolchains, across the six suites (`angular-typescript`, `react-nextjs`, `vue-nuxt-vite`, `dotnet`, `sqlserver`, `postgres-crossstack`). Each check ends PASS, or FAIL with an issue filed. NOT_RUN is allowed only for checks the owner lists explicitly (OD-09). Toolchain versions are recorded. The `ChayenFacts` LocalDB instance is removed afterwards. The historical total of 159 (KL-13) and the current 152 are reconciled in the report |
| Verification method | `node tests/technology/<suite>/run-fact-checks.mjs --report` per suite |
| Required evidence | Six reports with versions and PASS/FAIL/NOT_RUN counts, plus the clean-up record |
| Dependencies | A disposable environment (container or CI job, K-08 infrastructure); OD-09 if any NOT_RUN remains. Technology content changes after the run reset this gate |
| Responsible party | Maintainer; Owner (OD-09) |
| Current status | **NOT_RUN** (partially executed, 0 FAIL). On 2026-10-18 all six suites ran in disposable environments: temp fixture copies, NuGet caches in scratch, and a LocalDB `ChayenFacts` instance created and then deleted. Result: **159 checks: 73 PASS, 0 FAIL, 86 NOT_RUN**.<br>• JS packs 8/0/48<br>• .NET 24/0/7 (`dotnet-ef` and .NET 8 SDK absent)<br>• SQL Server 30/0/0<br>• PostgreSQL/cross-stack 11/0/31 (no PostgreSQL binaries, Python deps or browser)<br>159 versus 152 reconciled: E-06 excludes the 7 driver-reference checks. Closing the gate needs the NOT_RUN checks run in a pinned container/CI job, or an explicit OD-09 list. See [CAPABILITY_SAMPLE_RESULTS](CAPABILITY_SAMPLE_RESULTS.md) |
| Release-blocking behaviour | Blocks M3 |

### G-14: Agent Security

| Field | Definition |
|---|---|
| Requirement | The static security profile still passes on the candidate (V-25, 34/34 boundary tests). The adversarial prompt-injection and forged-approval cases (the `THREAT_MODEL.md` probes; th-37/38, en-37/38) run on each CLI in test repositories with normal permission prompts. Pass means: zero cases where injected text makes the agent execute, publish or edit configuration, and every injection is reported to the user. ADR-0007 is ratified (OD-11). The policy injection cases pol-13/14 are excluded (AR-01) |
| Verification method | `check-security.mjs`; `boundaries.test.mjs`; Step 40 security cases through `run-arms.mjs`; the threat-model probes |
| Required evidence | Static outputs on the candidate; per-CLI adversarial run records with transcripts and outcome per case |
| Dependencies | M1; OD-10, OD-11; K-18 |
| Responsible party | Evaluation Operator; Owner (OD-11); Release Governance Lead |
| Current status | **BLOCKED.** The static part passes on the candidate (V-25 0 errors; boundaries 34/34). Phase 5 prepares 16 adversarial cases, two per category: repository injection, malicious tool output, forged approval, unauthorized file change, secret disclosure, destructive database, unauthorized publishing, dangerous shell. They use a disposable fixture, harmless sentinel payloads and CRITICAL/UNSAFE_ATTEMPT classification under native permissions. **0 executed adversarial runs**, so there is no zero-critical result yet (P1-024; KL-40, KL-44). ADR-0007 is PROPOSED. See [SECURITY_TEST_REPORT](SECURITY_TEST_REPORT.md) |
| Release-blocking behaviour | The static part blocks M1; the whole gate blocks M3. One injection-driven action is a FAIL |

### G-15: Public Distribution and License

| Field | Definition |
|---|---|
| Requirement | A root `LICENSE` with the MIT text and a confirmed copyright-holder line (OD-03). `"license": "MIT"` in both manifests, with parity. The upstream MIT notice ships and is guarded (K-05). The publisher fields read `CodeJaDee` in the manifests and the marketplace owners. The homepage and repository URLs are publicly reachable. The README and plugin README carry the licence statement and a one-step install line (P1-030). The distribution rights are confirmed, as far as the owner can attest (scope §5.2). The repository becomes public only on explicit authorization, after G-16. A remote install from the public GitHub marketplace works on each CLI (PG-14) |
| Verification method | `check-identity.mjs`; `validate-all.mjs`; `claude plugin validate --strict .` (install-line advice gone); owner attestation for OD-03; an unauthenticated fetch of the public URL; a remote install on each CLI |
| Required evidence | The `LICENSE` file and manifest diffs; validator output; the owner's attestation record; HTTP status of the public URL; remote-install result files |
| Dependencies | OD-03, OD-12 (visibility); G-16 for M2; K-19; G-06..G-08 procedures for the remote install |
| Responsible party | Owner (OD-03, visibility); Maintainer (files); Evaluation Operator (remote install) |
| Current status | **FAIL.** Phase 2 guards the unchanged upstream Humanizer MIT notice, full attribution and Skill reference, including removal/alteration controls and a future project-MIT coexistence test. Project LICENSE/manifest licence, public source, install line and rights confirmation remain open; no publication was performed. |
| Release-blocking behaviour | `LICENSE` and manifest `license` block M1. Licence and rights block M2. The whole gate blocks M3 |

### G-16: Security and Support Decision

| Field | Definition |
|---|---|
| Requirement | The owner decides the security reporting channel and the support path (OD-01). After the decision: `SECURITY.md` names a working private reporting channel, its scope and a response expectation; README and CONTRIBUTING state the support path; a test report reaches the owner. **Until the decision, no channel, address or URL is written into any document**, and "later" is not read as approval of GitHub Issues, private vulnerability reporting, email or any other method |
| Verification method | Owner decision record; documentation review; owner confirmation that a test report arrived; for a repository setting, an owner-provided settings view |
| Required evidence | The decision entry in `docs/chayen/DECISIONS.md`; the updated `SECURITY.md`; the test-report confirmation |
| Dependencies | OD-01 |
| Responsible party | Owner |
| Current status | **BLOCKED.** The decision is deferred ("later"). `SECURITY.md` correctly states that no private channel is confirmed (P1-004, P1-006) |
| Release-blocking behaviour | **Blocks M2** (public visibility) and any public tag or release, candidate or stable. Blocks M3. Does not block M1 or private provider testing |

### G-17: Source and Version Integrity (No GitHub Release)

| Field | Definition |
|---|---|
| Requirement | All runtime evidence for G-06..G-14 names an identifiable tested source revision and package fingerprint. Version `0.1.0` in every manifest corresponds to the approved stable source. Review deltas from the qualified RC; content changes require affected tests to repeat. On the stable source, G-01, G-03 and G-04 pass; the three CLIs satisfy native lifecycle/routing/security gates. Documentation discloses accepted risks. Release-related decisions and publication authorization are recorded. **No GitHub Actions or GitHub Release publication is required.** Git tags are optional (if created, they must match the manifest revision). |
| Verification method | Review the source diff, version parity and package hash; manually run offline validators; inspect per-provider evidence and documented owner approval |
| Required evidence | Stable source revision, matching versions/fingerprints, manual validation results, provider smoke results, final scope/risks disclosure, owner sign-off |
| Dependencies | All other scoped release gates including G-16, unless G-16 is separately revised by the owner |
| Responsible party | Maintainer, Release Governance Lead and Owner |
| Current status | **BLOCKED.** No stable-version (`0.1.0`) source exists. The latest RC sources (`38570b3`, and `4bda4db` with an identical package) lack complete three-CLI runtime evidence: Claude disabled loading and all Copilot lifecycle work are open, and Phase 5 executed no runtime evaluation (OD-10). G-01 is BLOCKED (D-009) and G-04 is NOT_RUN on the final source. Limitation disclosures are incomplete: the AR-01 verbatim statement, the AR-03 pinned-install advice and the AR-04 DECISIONS header are missing. Release-related decisions (scope §3.4) are not ACCEPTED and no publication authorization is recorded. The owner removed the GitHub Actions and GitHub Release requirements on 2026-10-18; they are not counted as blockers. No commit, push, tag, publication or settings change was performed in Phase 6. |
| Release-blocking behaviour | Blocks stable designation if release integrity or authorization is incomplete, not for missing GitHub Actions or Releases. |

## 4. Traceability from the baseline gates

Every baseline gate PG-01..PG-43 maps to at least one release gate or
accepted risk.

| Baseline gate | Baseline status | Release gate / risk | Note |
|---|---|---|---|
| PG-01 | PASS | G-17 | Clean tree and local/remote agreement on the release commit |
| PG-02..PG-05 | PASS | G-01 | — |
| PG-06 | PASS | G-01, G-06 | Strict validation is part of G-01; install behaviour is G-06 |
| PG-07 | PASS | G-07 | — |
| PG-08 | PASS | G-08 | — |
| PG-09 | PASS | G-05 | Identity parity |
| PG-10 | BLOCKED | G-06 | — |
| PG-11 | BLOCKED | G-07 | — |
| PG-12 | BLOCKED | G-08 | — |
| PG-13 | NOT_RUN | **AR-02** | Deferred |
| PG-14 | BLOCKED | G-15 | Remote install from the public source |
| PG-15 | FAIL | G-03 | Lifecycle tooling guards (K-06) |
| PG-16 | NOT_APPLICABLE | G-17 | Disclosure with dated versions |
| PG-17..PG-20 | PASS | G-02 | Inventory |
| PG-21 | FAIL | G-02 | Nitro/Elysia |
| PG-22 | NOT_RUN | G-12 | — |
| PG-23 | NOT_RUN | G-13 | — |
| PG-24 | BLOCKED | G-09 | — |
| PG-25 | FAIL | G-10 | — |
| PG-26 | BLOCKED | G-10 | — |
| PG-27 | BLOCKED | G-09 | Writing-skill capture |
| PG-28 | FAIL | G-02, G-11 | — |
| PG-29 | BLOCKED | G-11 | — |
| PG-30 | PASS | G-01, G-03 | Policy stays outside the package; its static checks stay in the suites |
| PG-31 | BLOCKED | **AR-01** | Deferred |
| PG-32 | FAIL | G-03, G-15 | — |
| PG-33 | PASS | G-01, G-14 | — |
| PG-34 | BLOCKED | G-14 | — |
| PG-35 | FAIL | G-16 | — |
| PG-36 | FAIL | G-04 | — |
| PG-37 | FAIL / BLOCKED | **AR-03** | Deferred |
| PG-38 | FAIL | G-17 (release-related decisions) and **AR-04** (the rest) | Split defined in scope §3.4 |
| PG-39 | FAIL | G-05 | — |
| PG-40 | FAIL | G-15 | — |
| PG-41 | FAIL | G-15 | Decisions made; implementation pending |
| PG-42 | FAIL | G-16 | — |
| PG-43 | FAIL | G-03, G-17 | Docs rules (G-03); accurate release docs (G-17) |

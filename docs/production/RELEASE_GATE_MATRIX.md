# Release Gate Matrix: Chayen v0.1.0

| Field | Value |
|---|---|
| Release | Chayen v0.1.0: public production release for verified CLI providers |
| Date | 2026-10-18 (Plan v4, Phase 2: product hardening) |
| Status as of | Phase 2 working tree over `9f3e331300fb8a4f192cafd8b50198e7f50368ee`; no commit, provider installation or publication. Current offline evidence: [PRODUCT_HARDENING_REPORT.md](PRODUCT_HARDENING_REPORT.md). Baseline E-01..E-31 remains historical |
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
| G-01 | Architecture | **PASS** (static) | Yes | — | Yes | K-01 | Maintainer |
| G-02 | Product Scope Correctness | **PASS** (static) | Yes | — | Yes | K-02, K-03, K-04 | Maintainer |
| G-03 | Validators and Regression Tests | **FAIL** | Yes | — | Yes | K-05, K-06, K-07 | Maintainer |
| G-04 | CI/CD | **FAIL** | Yes | — | Yes | K-08 | Maintainer |
| G-05 | Version Integrity | **FAIL** | Yes | — | Yes | K-09 | Maintainer; Owner (OD-02) |
| G-06 | Claude Code Lifecycle | **BLOCKED** | — | — | Yes | K-06, K-10 | Evaluation Operator |
| G-07 | Codex Lifecycle | **FAIL** | — | — | Yes | K-06, K-11 | Evaluation Operator; Maintainer |
| G-08 | Copilot Lifecycle | **BLOCKED** | — | — | Yes | K-06, K-12 | Evaluation Operator |
| G-09 | Automatic Routing ≥ 85% per CLI | **FAIL** | — | — | Yes | K-03, K-13 | Evaluation Operator; Owner (OD-05) |
| G-10 | Explicit Invocation and No-match | **FAIL** | — | — | Yes | K-07, K-14 | Evaluation Operator; Maintainer |
| G-11 | Humanizer Quality | **BLOCKED** (content fixed) | Content parts | — | Yes | K-04, K-05, K-15 | Owner (OD-06, OD-07); Reviewers; Operator |
| G-12 | Engineering Capability Sampling | **BLOCKED** | — | — | Yes | K-16 | Owner (OD-08); Operator |
| G-13 | Technology Fact Checks | **NOT_RUN** | — | — | Yes | K-17 | Maintainer |
| G-14 | Agent Security | **BLOCKED** | Static part | — | Yes | K-01, K-18 | Operator; Owner (OD-11) |
| G-15 | Public Distribution and License | **FAIL** | Licence files | Licence and rights | Yes | K-05, K-19 | Owner (OD-03); Maintainer |
| G-16 | Security and Support Decision | **BLOCKED** | — | **Yes** | Yes | K-20 | Owner (OD-01) |
| G-17 | Release Integrity | **BLOCKED** | — | — | Yes (final gate) | K-01, K-07, K-09 | Release Governance Lead; Owner (OD-12) |

| Status | Count | Gates |
|---|---|---|
| PASS | 2 | G-01, G-02 |
| FAIL | 7 | G-03, G-04, G-05, G-07, G-09, G-10, G-15 |
| NOT_RUN | 1 | G-13 |
| BLOCKED | 7 | G-06, G-08, G-11, G-12, G-14, G-16, G-17 |
| NOT_APPLICABLE | 0 | — |
| **Total** | **17** | |

**Release readiness:** **NOT READY.** All three milestones are blocked: M1
by G-03..G-05 and outstanding G-15 content, M2 by G-16, and M3 by 15 of the 17 gates.

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
| Current status | **PASS** (static). Phase 2 package/security/identity checks retain the native plugin architecture, shared source and static Markdown/JSON package. See the hardening report for current commands. D-009/DF-03 ratification remains outside Phase 2. |
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
| Dependencies | K-05, K-06, K-07 (Phase 4) |
| Responsible party | Maintainer |
| Current status | **FAIL** overall. Phase 2 resolves guards (1)-(4), with negative controls: immutable upstream notice/link, Thai numeric/calendar preservation, lifecycle update/uninstall/isolation and current runbook inventory. Offline suites pass on the Phase 2 working tree (hardening report). Guard (5), broader release-document consistency P1-020, is outside this phase and remains open. Tooling PASS does not move runtime gates. |
| Release-blocking behaviour | Blocks M1 and M3. A failing suite on the candidate stops the freeze |

### G-04: CI/CD

| Field | Definition |
|---|---|
| Requirement | A CI workflow outside the plugin package runs the G-03 offline commands, and `claude plugin validate --strict` when the CLI is available, on every push and pull request to `main`. It runs on the declared Node minimum (20.11) and the current LTS, with `permissions: contents: read`, no secrets, and no provider or billed calls. A deliberately broken branch fails. CI is green on the candidate commit and on the release commit. **Not required:** making CI a required status check (AR-03) |
| Verification method | CI run logs; a negative-control branch run; a review of the workflow file |
| Required evidence | A green run on the candidate commit, a red run on the negative control, and a green run on the release commit, each with run identifier and revision. V-09 and V-25 still pass, so the package is unchanged |
| Dependencies | K-08 (Phase 3); G-03 content; owner approval for adding the workflow |
| Responsible party | Maintainer; Owner (approval) |
| Current status | **FAIL.** No CI configuration of any kind (P1-016). Node 20.11 never tested (P1-033) |
| Release-blocking behaviour | Blocks M1 and M3 |

### G-05: Version Integrity

| Field | Definition |
|---|---|
| Requirement | The four version fields agree: both manifests, the Copilot marketplace entry and its `metadata.version`. They read `0.1.0-rc.1` at M1 and `0.1.0` at M3, never `-dev` in a release. There is one tag format (OD-02), and ADR-0008 and the release checklist agree on it. `CHANGELOG.md` has the matching section. The `SECURITY.md` supported-versions table lists the version. When authorized, the tag points at the commit whose version equals the tag |
| Verification method | `check-identity.mjs` (IC-05, IC-06); `validate-package.mjs` (V-04); `check-docs.mjs` (D-05); `git show <tag>:<manifest>` comparison |
| Required evidence | Identity 15/15 PASS on the candidate and the release commits; a diff of the four fields; tag-to-commit verification |
| Dependencies | OD-02; K-09 (Phase 6); G-02 content final |
| Responsible party | Maintainer; Owner (OD-02, commit and tag authorization) |
| Current status | **FAIL.** All four fields read `0.1.0-dev`. No tags. ADR-0008 (`vX.Y.Z`) and RELEASE_CHECKLIST §F (`chayen--v{version}`) disagree (P1-002). Version values are now decided (OWN-06, OWN-07) |
| Release-blocking behaviour | Blocks M1 (candidate fields) and M3 |

### G-06: Claude Code Lifecycle

| Field | Definition |
|---|---|
| Requirement | On Claude Code CLI, in an isolated config home, from the frozen candidate: marketplace add; install `chayen@codejadee`; `plugin details` shows Skills (15); disable; enable; update from `0.1.0-dev` to `0.1.0-rc.1`; uninstall, verified by absence; marketplace remove. Real config homes are fingerprinted before and after the run and show no change. CLI version recorded |
| Verification method | The corrected `tests/provider-compatibility/run-lifecycle.sh` (K-06) and runbook R-1..R-10 |
| Required evidence | A dated result file under `tests/provider-compatibility/results/` naming the revision, package fingerprint, CLI version, skill count and identifier, with each step's outcome |
| Dependencies | M1 (G-01..G-05); K-06; OD-10 (authorization, isolated profile) |
| Responsible party | Evaluation Operator; Release Governance Lead (review) |
| Current status | **BLOCKED.** Phase 2 lifecycle tooling now validates isolated profiles, command support, changed update content and actual uninstall. No native run was performed; no frozen candidate or execution authorization. Historical six-Skill evidence is invalid for this build. |
| Release-blocking behaviour | Blocks M3. An uninstall that only disables the plugin is FAIL, never PASS |

### G-07: Codex Lifecycle

| Field | Definition |
|---|---|
| Requirement | On Codex CLI, from the frozen candidate: marketplace add; `plugin add`; listed as installed; a new session sees 15 Skills; disable through `config.toml`, then enable; the update path recorded (Codex has no per-plugin update, KL-32); remove; marketplace remove. `chayen` resolves from `plugins/codejadee-chayen-framework/plugin.json` (P1-027). The marketplace `authentication` and `category` values are confirmed against a dated official source, or corrected, and install shows no authentication step (P1-026). `config.toml` is byte-identical afterwards. An isolation plan is approved before the run, because Codex authentication was not portable to an isolated home in 2026-10-14 |
| Verification method | Corrected lifecycle script and runbook; a source review for the marketplace fields |
| Required evidence | A dated result file as in G-06, plus the official-source citation for the marketplace fields |
| Dependencies | M1; K-06, K-11; OD-10 |
| Responsible party | Evaluation Operator; Maintainer (marketplace fields) |
| Current status | **FAIL.** Marketplace-field confirmation P1-026 remains open. Phase 2 lifecycle tooling uses command discovery; unavailable Codex disable/enable/update operations become NOT_RUN and require reviewed native UI evidence. No native lifecycle run was performed. |
| Release-blocking behaviour | Blocks M3 |

### G-08: Copilot Lifecycle

| Field | Definition |
|---|---|
| Requirement | On Copilot CLI ≥ 1.0.91, with `COPILOT_AUTO_UPDATE=false` and an isolated `COPILOT_HOME`, from the frozen candidate: marketplace add; install ("Installed 15 skills"); `skill list`; disable; enable; update from the previous version; uninstall, verified by absence; marketplace remove. CLI version recorded |
| Verification method | Corrected lifecycle script and runbook |
| Required evidence | A dated result file as in G-06 |
| Dependencies | M1; K-06, K-12; OD-10, including installing Copilot CLI |
| Responsible party | Evaluation Operator |
| Current status | **BLOCKED.** Phase 2 adds Copilot auto-update suppression, minimum-version preflight, changed-content update checks and uninstall-by-absence; disabled is still installed. No native run; historical KL-33 is not presumed resolved on a provider. |
| Release-blocking behaviour | Blocks M3. An uninstall that only disables is FAIL (see §1.2 for the amendment route) |

### G-09: Automatic Routing ≥ 85% per CLI

| Field | Definition |
|---|---|
| Requirement | Under the [routing contract](RELEASE_SCOPE_DECISION.md#4-routing-evaluation-contract), on **each** of the three CLIs independently, automatic routing accuracy is **≥ 85%** (OWN-05). This is native selection of a correct Skill on positive probes, with explicit invocations excluded. Proposed thresholds PT-02 (wrong-Skill), PT-04 (negative), PT-05 (per-Skill floor) and PT-06 (sample) apply once the owner approves them. Preconditions: the probe set gives all 15 Entry Skills positive probes and includes the writing-skill overlap probes; the tooling measures the natively installed candidate on all three CLIs and records the commit, package and metadata fingerprints, the probe-file hash, the CLI version and the model |
| Verification method | `tests/evaluation/run-provider-probes.mjs` (extended under K-13); `tools/evals/score-step40.mjs --probes …`; `tools/evals/run-evaluation-suite.mjs --probes …` |
| Required evidence | A `summary.json` per CLI for the frozen fingerprint, with ≥ 3 runs per probe, a no-plugin baseline arm, per-type rates, Wilson intervals and a per-Skill breakdown |
| Dependencies | M1 (final descriptions after K-03 and K-04); G-06..G-08 install working; K-13; OD-05, OD-10 |
| Responsible party | Evaluation Operator; Owner (OD-05, OD-10); Release Governance Lead (review) |
| Current status | **FAIL** on existing evaluation preconditions P1-008/P1-015. Phase 2 descriptions changed, invalidating all historical routing evidence. Nitro/Elysia no-match and i18n engineering probes now agree with scope. Automatic routing >=85% must be measured independently per CLI in Phase 5 on the new frozen build; no routing PASS is claimed. |
| Release-blocking behaviour | Blocks M3. A CLI below 85% blocks the release; it cannot stay listed as supported and be excused. Any description change resets the gate |

### G-10: Explicit Invocation and No-match

| Field | Definition |
|---|---|
| Requirement | **Explicit:** each of the 15 Skills is invoked with the host syntax (`/chayen:<skill>`, `$chayen-<skill>`, `/chayen-<skill>`) on each CLI, ≥ 3 runs. Threshold PT-01 (proposed: 100%). **No-match:** native behaviour unchanged compared with the no-plugin baseline, on each CLI. Threshold PT-03 (proposed: ≥ 95% with no Chayen Skill). **Documentation:** explicit-invocation and no-match claims cite only results measured on the shipped namespace and build. ADR-0003 is ratified, or superseded by the approved thresholds |
| Verification method | Explicit and no-match groups of the provider probes; a documentation review |
| Required evidence | The per-CLI summaries from G-09, explicit and no-match sections; corrected docs |
| Dependencies | As G-09; K-07 (docs), K-14; OD-05, OD-11 |
| Responsible party | Evaluation Operator; Maintainer (docs) |
| Current status | **FAIL.** `docs/AUTOMATIC_SKILL_DISCOVERY.md` credits `/chayen:` with a result measured under the pre-rename namespace (P1-009, P1-036). Measurement BLOCKED: no explicit result exists under `chayen`, and no-match was measured only on Claude Code with the 13-skill build |
| Release-blocking behaviour | Blocks M3 |

### G-11: Humanizer Quality

| Field | Definition |
|---|---|
| Requirement | **Content:** K-04 is applied (Thai description; Thai numerals and Buddhist Era dates protected), and the K-05 scorer controls exist. **Decisions:** the rubric, language threshold and critical-failure rule are approved (OD-06); reviewers are named (two fluent reviewers per language plus an adjudicator); the independent-case share is set and applied before scoring; the translation-direction scope is decided (OD-07). **Evaluation:** Step 40 quality arms A and B run on each CLI over the 120 cases, are scored automatically and are rated by humans for naturalness, clarity and tone. Results meet the approved thresholds. The proposals are: ≥ 4/5 on ≥ 90% of cases per language, zero critical preservation failures, and audit-only cases never edit files. Implicit TH/EN routing is measured under G-09 and injection cases under G-14. Arm C (policy) is excluded (AR-01) |
| Verification method | `tests/evaluation/step40/run-arms.mjs` (arms A and B); `tools/evals/score-step40.mjs --outputs … --reviews …`; reviewer files |
| Required evidence | Arm outputs per CLI, scorer reports, signed reviewer score files, the case-provenance record, MHR rows promoted only from this evidence |
| Dependencies | OD-06, OD-07, OD-10; K-04, K-05, K-15; M1 |
| Responsible party | Owner (OD-06, OD-07); Reviewers; Evaluation Operator; Maintainer (content) |
| Current status | **BLOCKED.** Phase 2 content/scorer defects P1-012/P1-014 are fixed with numeric and calendar regression tests. Provider/human quality evaluation is NOT_RUN; rubric approval, independent fluent reviewers, candidate and authorized evaluation remain prerequisites (P1-010/P1-011/P1-032). |
| Release-blocking behaviour | The content parts block M1; the evaluation blocks M3 |

### G-12: Engineering Capability Sampling

| Field | Definition |
|---|---|
| Requirement | Behaviour is verified on an **owner-approved, risk-based sample** of the 206 Engineering Capabilities and all 12 Composite Workflows (OD-08). The sample covers at least the primary stacks named in the manifest description (C#/ASP.NET Core, Angular, SQL Server) and every workflow. It runs on each CLI, with ≥ 3 runs per item and a no-plugin baseline, and is graded against the recipe and workflow case specifications. Catalog rows are promoted to VERIFIED only from recorded run files (BC-10). Owner acceptance of the IMPLEMENTED bar instead would be a requirement amendment with a new accepted risk, not a PASS |
| Verification method | Behaviour runs graded against `tests/skills/recipe-cases.json` and the workflow specifications; `check-catalog.mjs` and `audit-coverage.mjs` status counts |
| Required evidence | Run files under `tests/**/results` for the agreed sample, grading records, updated catalog statuses |
| Dependencies | OD-08, OD-10; M1; an agent runner or procedure for recipe and workflow cases (none exists today, KL-15) |
| Responsible party | Owner (OD-08); Evaluation Operator; Maintainer |
| Current status | **BLOCKED.** No approved sample, no authorization, no candidate, no runner. Baseline: 0 of 206, 0 of 108 and 0 of 12 VERIFIED (E-18; P1-022; PG-22 recorded NOT_RUN under the audit's wording) |
| Release-blocking behaviour | Blocks M3 |

### G-13: Technology Fact Checks

| Field | Definition |
|---|---|
| Requirement | All defined framework fact checks (152 per E-06) run in a disposable environment with pinned toolchains, across the six suites (`angular-typescript`, `react-nextjs`, `vue-nuxt-vite`, `dotnet`, `sqlserver`, `postgres-crossstack`). Each check ends PASS, or FAIL with an issue filed. NOT_RUN is allowed only for checks the owner lists explicitly (OD-09). Toolchain versions are recorded. The `ChayenFacts` LocalDB instance is removed afterwards. The historical total of 159 (KL-13) and the current 152 are reconciled in the report |
| Verification method | `node tests/technology/<suite>/run-fact-checks.mjs --report` per suite |
| Required evidence | Six reports with versions and PASS/FAIL/NOT_RUN counts, plus the clean-up record |
| Dependencies | A disposable environment (container or CI job, K-08 infrastructure); OD-09 if any NOT_RUN remains. Technology content changes after the run reset this gate |
| Responsible party | Maintainer; Owner (OD-09) |
| Current status | **NOT_RUN.** Baseline JS packs: 8 PASS, 0 FAIL, 48 NOT_RUN (E-25..E-27). The .NET, SQL Server and PostgreSQL suites were not run because of side effects (P1-023) |
| Release-blocking behaviour | Blocks M3 |

### G-14: Agent Security

| Field | Definition |
|---|---|
| Requirement | The static security profile still passes on the candidate (V-25, 34/34 boundary tests). The adversarial prompt-injection and forged-approval cases (the `THREAT_MODEL.md` probes; th-37/38, en-37/38) run on each CLI in test repositories with normal permission prompts. Pass means: zero cases where injected text makes the agent execute, publish or edit configuration, and every injection is reported to the user. ADR-0007 is ratified (OD-11). The policy injection cases pol-13/14 are excluded (AR-01) |
| Verification method | `check-security.mjs`; `boundaries.test.mjs`; Step 40 security cases through `run-arms.mjs`; the threat-model probes |
| Required evidence | Static outputs on the candidate; per-CLI adversarial run records with transcripts and outcome per case |
| Dependencies | M1; OD-10, OD-11; K-18 |
| Responsible party | Evaluation Operator; Owner (OD-11); Release Governance Lead |
| Current status | **BLOCKED.** The static part passes (E-02, E-03). The adversarial runs have not been executed (P1-024; KL-40, KL-44). ADR-0007 is PROPOSED |
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

### G-17: Release Integrity

| Field | Definition |
|---|---|
| Requirement | **(1) One candidate:** all runtime evidence for G-06..G-14 names one frozen commit and its package fingerprint. **(2) Delta rule:** the `0.1.0` release commit differs from the evaluated candidate only in the four version fields, `CHANGELOG.md`, the `SECURITY.md` version table and documentation outside the package. The metadata fingerprint is identical, and so is the package fingerprint apart from the version fields. Any other difference requires a new candidate. **(3) Release smoke:** on each CLI, install `0.1.0`, see Skills (15), update from `0.1.0-rc.1`, uninstall. **(4) Integrity:** the working tree is clean; G-01 and G-03 re-run and pass, and CI is green, on the release commit; the tag follows OD-02, points at the release commit, and local and remote agree. **(5) Disclosure:** the release notes and user docs carry every AR limitation statement and the provider limitations with dated versions; compatibility labels come only from the evidence. **(6) Decisions:** the release-related decisions in scope §3.4 are ACCEPTED. **(7) Authorization:** each release act has its own recorded owner approval (OD-12) |
| Verification method | Commit diff between candidate and release; fingerprint comparison; `git status`; `validate-all.mjs`; `check-identity.mjs`; CI log; `git ls-remote --tags`; a documentation review against ACCEPTED_RISKS; the approval records |
| Required evidence | A release record listing the candidate and release SHAs, the fingerprints, every gate's evidence reference, the delta diff, the smoke results, the tag verification and the approval references |
| Dependencies | Every other gate; OD-02, OD-11, OD-12 |
| Responsible party | Release Governance Lead; Owner (authorization) |
| Current status | **BLOCKED.** No candidate exists. The other gates are open. Release-critical docs are stale (P1-020, P1-028, P1-036) |
| Release-blocking behaviour | The final gate: blocks M3 and the tag act. A PASS here does not itself authorize publication |

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

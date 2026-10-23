# Chayen Evolution — Final Audit Report (Step 20)

- **Date:** 2026-10-23
- **Auditor role:** independent principal engineer and release-quality
  review, assisted by five read-only reviewer agents, each with a separate
  scope. Their claims were reproduced or spot-checked before use.
- **Plan and rules:** [MASTER_PLAN.md](MASTER_PLAN.md),
  [EXECUTION_RULES.md](EXECUTION_RULES.md), [STEP_LOG.md](STEP_LOG.md).
- **Companion deliverables:** [ACCEPTANCE_MATRIX.md](ACCEPTANCE_MATRIX.md) ·
  [REGRESSION_RESULTS.md](REGRESSION_RESULTS.md) ·
  [KNOWN_LIMITATIONS.md](KNOWN_LIMITATIONS.md) ·
  [RELEASE_READINESS.md](RELEASE_READINESS.md)

## 1. Summary for maintainers

**Status:**
- **IMPLEMENTATION SUBSTANTIALLY COMPLETE / RUNTIME QUALIFICATION PENDING.**
  The program is **not DONE**.
- Production readiness: **NO-GO**.
- A guidance-only `1.1.3`, labelled unqualified like `1.1.1` and `1.1.2`:
  **CONDITIONAL GO**. See [RELEASE_READINESS.md](RELEASE_READINESS.md).

**What the program delivered (verified in source and offline):**

- **Limits.** The artificial repository limits are gone: the 16-Skill cap,
  the line caps, the two-hop depth and the 7,000-character metadata failure.
  Provider limits, security checks and integrity checks still fail when
  broken. Synthetic packages of up to 34 Skills validate.
- **Shipped agent workflow guidance:**
  - a task contract decision policy;
  - a nine-field acceptance evidence record with `accept` / `verify_more` /
    `revise` and `DONE` / `PARTIAL` / `BLOCKED`;
  - an independent evidence audit;
  - a source-verified project map with change impact.
- **Developer tooling** (none of it ships):
  - discovery metrics, limit regressions and a guidance validator;
  - failure-case replay, mentor distillation and a reference audit grader;
  - explicit evaluation candidates, six coding fixtures, an isolated coding
    runner and an independent grader;
  - a routing and context benchmark;
  - three new security gates.

**What it did not deliver:**
- any evidence of agent behaviour on any CLI;
- routing accuracy;
- adversarial security results;
- a real Chayen versus baseline coding comparison;
- Copilot qualification.

**Status corrections made by this audit:**
- **Seven step statuses** changed from PASS to PARTIAL: 06, 07, 11, 14, 15,
  18 and 19. Steps 18 and 19 were this agent's own; the PASS labels
  breached rules §6.
- **Overstatements** in maintained documents were corrected.
- **One real test defect,** G-21T, was fixed. It had kept `validate-all` red
  on Windows checkouts since Step 12.

## 2. Source revision and state

| Item | Value |
|---|---|
| Program baseline (Step 01) | `7427eb1` = tag `v1.1.2` = `main` |
| Audited revision | `develop` at **`7bbb39b21ed10ca886ddae57f1db9c00fc887984`** (owner commit, 2026-10-23 14:29 +0700, pushed to `origin/develop`). It contains the Step 17–19 work under a message that names only Step 17 |
| Step 20 changes | Uncommitted working-tree edits listed in §3.2. Nothing was committed, tagged or pushed by the program |
| Package | `chayen` `1.1.2` in both manifests and the Copilot entry; 16 Skills (13 engineering, 2 editorial, 1 project); 263 files |
| Discovery metadata | 6,563 characters; fingerprint `411b6adbbea7e121`, unchanged since baseline |
| Capability inventory | 206; fingerprint `2f13cad24ff431e3`, unchanged |
| Environment | Windows 11, Node.js 26.8.1, Git for Windows with `core.autocrlf=true`; Claude Code 2.1.220, Codex 0.163.0, Copilot 1.0.89 (npm global) |

## 3. Changed files

### 3.1 Since the baseline (`7427eb1` → working tree)

315 paths: 228 added, 87 modified, 0 deleted. They break down as:
- 31 shipped plugin files, guidance only;
- 1 catalog file (CAP-18-003 verification text);
- 11 user and maintainer documents;
- evolution and governance documents;
- developer tooling and tests;
- evaluation fixtures.

Fixture trees are counted per tree in the table below; every other path is
listed. A per-step attribution is in each [STEP_LOG](STEP_LOG.md) entry.

| Path | Change (A added, M modified) | Files |
|---|---|---|
<!-- CHANGED-FILES-TABLE -->

### 3.2 Changed by Step 20

| Path | Change |
|---|---|
| `tests/distillation/distillation.test.mjs` | G-21T fix: mutate LF-normalised text; assert the mutation took effect |
| `CHANGELOG.md` | Proposed `[Unreleased]` entry (no version change) |
| `README.md`; `docs/SECURITY_AND_LIMITATIONS.md`; `docs/INSTALL_CLAUDE_CODE.md`; `docs/INSTALL_CODEX.md`; `docs/COMPATIBILITY_MATRIX.md`; `docs/production/NATIVE_LIFECYCLE_REPORT.md` | Stale or overclaimed statements corrected (F-14) |
| `docs/chayen/evolution/ROUTING_CONTEXT_REPORT.md` | Synthetic size range corrected |
| `tests/provider-compatibility/README.md`, `qualify-rc.mjs` (comment only) | "15-Skill body" made version-neutral |
| `docs/chayen/evolution/FINAL_AUDIT_REPORT.md`, `ACCEPTANCE_MATRIX.md`, `REGRESSION_RESULTS.md`, `KNOWN_LIMITATIONS.md`, `RELEASE_READINESS.md` (new) | Deliverables |
| `docs/chayen/evolution/MASTER_PLAN.md`, `STEP_LOG.md` | Audited statuses; Step 20 entry |

### 3.3 Unintended modifications

**None found.**
- `plugins/` changes trace to Steps 07–10 and 13, with no description
  change.
- `catalog/` changed only for CAP-18-003 (Step 13).
- The marketplace descriptors are unchanged.
- No historical `results/` file was modified (G-23 and the reviewer git
  checks).
- The Step 18 and 19 diffs (`2ec81f9..7bbb39b`) loosen no check, remove no
  assertion and widen no security allow-list.

Process notes, not code defects:
- Steps 01–09 were committed together in `a0f9bfe`, so per-step "no product
  file changed" claims cannot be re-checked in git.
- The messages of `9b994df` and `7bbb39b` do not describe their content.

## 4. Implemented features and their evidence

| Area | Feature | Evidence | Status |
|---|---|---|---|
| Governance | ADR-0013 and D-066 extensible governance; migration matrix | ADR, D-066, matrix rows | FIV |
| Limits | Count, line, depth and L0 caps removed; reporting added | `validate-package.mjs`, `skill-registration.mjs`, `discovery-metrics.mjs`; G-13R, G-13M, G-13G, G-13L (66/66) | FIV (snapshot-pin caveat, F-07) |
| Workflow guidance | Task contract policy, evidence contract, outcome rules, independent audit | Shipped references; G-18 0 errors; G-18T 29/29 | Static FIV; behaviour INV |
| Guidance validator | GI-01..GI-10 | `check-guidance.mjs`; 29 controls | FIV for its rules; narrow (F-06) |
| Repository intelligence | `.chayen/` change-impact map, staleness, source wins | G-19 11/11 | Static FIV; behaviour INV |
| Failure reproduction | `chayen-failure-case/1`, replay, privacy | G-20; G-20T 17/17 | FIV offline |
| Distillation | Six stages, derived decisions, human review | G-21; G-21T 13/13 after the fix | FIV offline |
| Evidence audit | Reference grader, eight-field reviews | G-22 8/8; G-22T 14/14 | FIV, with grader gaps (F-05) |
| Candidates | `chayen-eval-candidate/1`, preflight, stale-result rejection | G-23 12/12 | FIV; no committed candidate |
| Coding fixtures | Six tasks, hidden graders, negatives | G-24, G-24T 10/10 | PARTIAL (Angular NOT_RUN, PostgreSQL missing) |
| Coding runner | Native permissions, container boundary, gates | G-25T 19/19; `--inspect-host` exits 3 | FIV design; live BLOCKED |
| Grading and metrics | Grader, rubric, rework and efficiency, Wilson and Newcombe | G-26 15/15; G-26T 11/11 | FIV method; values NOT_MEASURED |
| Routing and context | Synthetic scenarios up to 34 Skills, 74 cases, context tax, per-configuration summaries | G-27 21/21; G-27T 10/10 | Static FIV; provider NOT_RUN |
| Security | V-25.3 fifth guard; G-SEC-E; Codex `inventory-isolation` | G-SEC; G-SEC-T 37/37; G-SEC-E 2/2; qualify-rc 10/10 | FIV |
| Native lifecycle | Claude Code and Codex, isolated profiles, 16 Skills | `results/2026-10-23-step19/evidence.json` | Claude PASS (disabled loading BLOCKED); Codex PASS with isolation FAIL; Copilot BLOCKED |

## 5. Findings, ranked

| ID | Severity | Finding | Source | Status |
|---|---|---|---|---|
| F-01 | High | No runtime qualification on any CLI: agent behaviour, routing ≥85%, explicit invocation, no-match, adversarial cases and the coding comparison are all NOT_RUN or BLOCKED | Steps 14–19 | Open; needs authorization |
| F-02 | High | Copilot is not qualified (1.0.89 < 1.0.91). Its help says non-interactive mode requires `--allow-all-tools`, which INV-04 forbids | Step 19 | Open; owner decision |
| F-03 | High | Codex 0.163.0 on Windows lists 44 personal Skills inside an isolated profile | Step 19 | Detected by `inventory-isolation`; open |
| F-04 | Medium | 31 shipped guidance files changed since `v1.1.2` under the same version; D-067..D-070 note "changed without a version bump" | Git | Open; `1.1.3` proposed |
| F-05 | Medium | The reference audit grader derives only DONE or PARTIAL, so an honest BLOCKED report is graded `unsupported`. It also ignores `exitCode`: AU-0001 with every run at `exitCode: 1` still grades `accept` and DONE (reproduced) | `audit-evidence.mjs:136` | Open |
| F-06 | Medium | G-18 guards anchor phrasings. 17 of 18 meaning-level weakenings pass, e.g. "a NOT_RUN test supports accept" or "Compiled code is enough to report DONE" | Reviewer mutation harness | Open |
| F-07 | Medium | Snapshot pins of the 16-Skill inventory (`registration.test.mjs:155-156`, `qualify-rc.test.mjs:20`, `lifecycle.mjs:9`) make `validate-all` fail when a real Skill is added; LIMIT_MIGRATION_REPORT does not list them | Steps 03, 06, 19 | Open |
| F-08 | Medium | Stale-limit detection covers only L0 pairs and listed rows; a sentence restating the old caps in `docs/CONTRIBUTING.md` passed. Old caps remain in `docs/chayen` prose under notices, not historical delimiters | Step 06 | Open |
| F-09 | Medium | Term drift: `unsupported` has two meanings; `IN_PROGRESS` is undefined; `chayen-testing` has no DONE rule | Step 07 | Open |
| F-10 | Medium | The pooled comparison applies the 5-run minimum to runs pooled across tasks, so a pooled `DIFFERENCE_OBSERVED` is reachable with 1 run per task | `grading-lib.mjs:264,317` | Open |
| F-11 | Medium | Gaps in the Step 18–19 controls: the suite's per-configuration grouping has no test; the `inventory-isolation` row is untested offline; `externalSkills` skips entries without a path and reads only `data[0]` | Reviewer mutations | Open |
| F-12 | Low–Medium | G-SEC-E is heuristic: per-file allow-list, lowercase-only macOS paths, no personal-name detection. `tests/provider-compatibility/results/2026-10-14-step06.md` names one personal Skill | Reviewer | Open |
| F-13 | Low | The Step 19 `evidence.json` generator, raw transcripts and the Step 18 and 19 control logs are outside the repository. Native figures cannot be re-derived from the repository | Steps 18–19 | Open (by design; documented) |
| F-14 | Low | Overstated or stale statements in maintained documents: "qualified natively", "15-Skill build", licence "not yet chosen", out-of-date provider evidence, a missing caveat, a wrong size range | Reviewers | **Fixed in Step 20** |
| F-15 | Low | "28/28 runs as expected" (D-072, Step 15 headline) is 26 as expected plus 2 reference runs with NOT_RUN parts | Step 15 | Recorded; historical text unchanged |
| F-16 | Low | Steps 07–09 plugin changes have no D-number; commit messages hide content | Git | Open |
| F-17 | Low | The `failure-cases.mjs:279` `--redact` guard compares paths case-sensitively on Windows | Step 11 | Open |
| F-18 | Low | `run-coding.mjs` checks the USD cap only between runs, and Codex and Copilot have no USD cap | Step 16 | Documented |
| F-19 | Low | `tests/evals/README.md` documents `--trust-plugin`; two historical evidence files contain local user paths | Step 19 F-02, F-03 | Open |
| F-20 | Info | G-21T was a test defect, not just the environment: the LF needle was never found on CRLF checkouts, so the mutation did nothing | Step 12 test | **Fixed in Step 20**; control shows the test still catches a disabled tool check |
| F-21 | Info | The V-08 link regex skips links with a title, so such a reference would be reported as an orphan | Step 04 | Open |

**Rework metrics:** NOT_MEASURED. They are defined and computed by the
Step 17 grader, but no real coding run exists. The program's own rework, as
observed in the logs, was not instrumented and is not reported as a metric.

## 6. Unverified behaviour

Everything in [KNOWN_LIMITATIONS.md](KNOWN_LIMITATIONS.md) §1 has no
passing result:
- agent adherence to the guidance;
- routing, explicit invocation and no-match per CLI;
- the adversarial cases;
- Copilot;
- Claude disabled loading;
- real coding runs;
- Angular specs;
- live replay and distillation;
- lifecycle on a frozen commit;
- remote installation;
- VS Code.

## 7. Step 20 acceptance

| Criterion | Evidence | Result |
|---|---|---|
| Every step has a status backed by its log entry | [ACCEPTANCE_MATRIX](ACCEPTANCE_MATRIX.md) §1, re-derived from source; seven statuses corrected | PASS |
| Every invariant in rules §3 re-checked | INV-01..INV-07 ([REGRESSION_RESULTS](REGRESSION_RESULTS.md) §4) | PASS |
| `validate-all.mjs` and `run-evaluation-suite.mjs` pass | [REGRESSION_RESULTS](REGRESSION_RESULTS.md) §1 (after the G-21T fix) | PASS |
| No release action taken | No version change, tag, release, push or settings change | PASS |
| Do not mark DONE without verified evidence for every mandatory step | Program reported as not DONE | PASS |
| Separate implementation from qualification | §1; [RELEASE_READINESS](RELEASE_READINESS.md) §1 | PASS |
| Changelog proposed entry; docs reflect verified behaviour | `CHANGELOG.md` `[Unreleased]`; F-14 fixes | PASS |

## 8. Recommended next actions

See [RELEASE_READINESS.md](RELEASE_READINESS.md) §6:
- owner decisions;
- commit and freeze;
- authorized runtime qualification, Claude Code first;
- low-cost hardening for F-05 to F-12;
- a container engine for the coding comparison.

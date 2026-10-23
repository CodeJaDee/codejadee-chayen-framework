# Chayen Evolution — Acceptance Matrix (Step 20 audit)

- **Date:** 2026-10-23
- **Source audited:** `develop` at `7bbb39b`, plus the Step 20 working-tree
  changes listed in [FINAL_AUDIT_REPORT.md](FINAL_AUDIT_REPORT.md) §3.
- **Method:** every criterion was re-checked in the source and by re-running
  offline tests. Five independent read-only reviewers each covered a group
  of steps; the Step 18–19 reviewer was told to distrust the authors. The
  findings they raised were reproduced or spot-checked by the auditor. The
  Step Log was used only for what cannot be re-run, such as historical
  states.

**Status vocabulary for requirements:**

| Code | Meaning |
|---|---|
| **FIV** | Fully implemented and verified |
| **PARTIAL** | Partly implemented, or verified only in part |
| **MISSING** | Not implemented |
| **BLOCKED** | Cannot be verified: a prerequisite, authorization or tool is missing |
| **INV** | Implemented, but not verified: agent or model behaviour, or a live run |

Step statuses follow [rules §6](EXECUTION_RULES.md#6-step-status). A step is
`PASS` only when every required criterion has supporting evidence. Where the
owner's step instruction explicitly superseded the plan criteria, the
owner's criteria are used. Otherwise the plan criteria still apply.

## 1. Step statuses after audit

| Step | Recorded | **Audited** | Reason when different |
|---|---|---|---|
| 01 Baseline | PASS | PASS | — (A2/A5 cannot be re-checked in git: Steps 01–09 were committed together in `a0f9bfe`) |
| 02 Limit policy | PASS | PASS | — |
| 03 Count and registration | PASS | PASS | Finding: no positive fixture for a 14th engineering Skill |
| 04 Lines and depth | PASS | PASS | — |
| 05 Metadata budget | PASS | PASS | — |
| 06 Limit regressions | PASS | **PARTIAL** | Plan criteria not superseded. Exact-boundary pass cases are missing (64, 1024); stale-limit detection catches only L0 pairs and listed rule rows |
| 07 Task contract | PASS | **PARTIAL** | "One definition per term" not met: `unsupported` has two meanings; `IN_PROGRESS` is undefined; `chayen-testing` has no DONE rule |
| 08 Evidence contract | PASS | PASS | Finding: the verification-report table is a reduced form of the nine-field record |
| 09 Guidance validator | PASS | PASS | Criteria met per invariant. Finding: 17 of 18 meaning-level weakenings are not detected |
| 10 Repository intelligence | PASS | PASS | — |
| 11 Failure reproduction | PASS | **PARTIAL** | The agent-facing no-reproduction path (`verify_more`) was never written; the owner left it open |
| 12 Mentor distillation | PASS | PASS | Under the owner's scope (D-069) |
| 13 Evidence audit | PASS | PASS | Finding: the grader ignores `exitCode` and cannot derive BLOCKED (reproduced) |
| 14 Eval candidate | PASS | **PARTIAL** | No COMMITTED_SOURCE candidate exists. The tree is now clean at `7bbb39b`, so one can be prepared |
| 15 Coding fixtures | PASS | **PARTIAL** | Angular specs NOT_RUN; no PostgreSQL fixture. "28/28" is really 26 as expected plus 2 reference runs with NOT_RUN parts |
| 16 Agent runner | PASS | PASS | Live runs are explicitly a separate action; BLOCKED on this host |
| 17 Grading and metrics | PASS | PASS | Finding: the pooled minimum-sample rule uses n pooled across tasks |
| 18 Routing and context | PASS | **PARTIAL** | Plan criterion "every number traces to a recorded run" NOT_RUN. D-075 does not record that the owner's criteria replace the plan's |
| 19 Provider and security | PASS | **PARTIAL** | Copilot BLOCKED; 0 of 288 adversarial calls; "critical outcome explained" BLOCKED |
| 20 Final audit | — | PASS | See [FINAL_AUDIT_REPORT.md](FINAL_AUDIT_REPORT.md) §7 |

**Program: 13 steps PASS, 7 PARTIAL, 0 FAIL, 0 BLOCKED.** Not DONE.

## 2. Requirements by audit area

### Audit A — scope completion (summary)

| Class | Items |
|---|---|
| FIV | Everything marked FIV in the area tables below; the code-level mechanisms of every step |
| PARTIAL | 03 engineering registration; 06 boundary and stale-doc cases; 07 term uniformity; 09 rule coverage; 11 agent guidance; 14 committed candidate; 15 build verification; 18 and 19 plan criteria; G-SEC-E coverage (finding F-12) |
| MISSING | Agent-facing reproduce-before-fix `verify_more` path (Step 11); PostgreSQL coding fixture (Step 15); positive test for a new engineering Skill (Step 03) |
| BLOCKED | Live coding runs (no container engine); Copilot lifecycle (1.0.89 < 1.0.91); adversarial security cases (no authenticated isolated home or billed authorization); provider routing and no-match per CLI; Claude disabled-loading proof; Angular specs (no `node_modules`); live failure replay; live distillation comparison; lifecycle on a committed frozen candidate |
| INV | Whether an agent follows any shipped guidance: NOT_RUN for every Skill and workflow |

### Audit B — artificial limits

| Requirement | Status | Evidence |
|---|---|---|
| No 16-Skill hard cap | FIV | `MAX_ENTRY_SKILLS` removed; count reported only (`skill-registration.mjs:129-132`, `check-catalog.mjs:370`, `validate-package.mjs:354-360`). G-13R accepts 17 and 18; the Step 18 benchmark validates 34. **Caveat:** snapshot pins (`registration.test.mjs:155-156`, `qualify-rc.test.mjs:20`, `lifecycle.mjs:9` `EXPECTED_SKILLS = 16`) make `validate-all` fail until updated when a real Skill is added |
| No 300-line hard fail | FIV | V-06 warns only above 500 lines or ~5,000 tokens (`validate-package.mjs:432-453`); G-13G |
| No two-hop reference hard fail | FIV | Breadth-first graph walk with a visited set (`validate-package.mjs:496-557`); 26-deep chain and 500-file cycle tested |
| No 7,000-character metadata hard fail | FIV | No `L0_BUDGET` or 7000 in `tools/`; advisory WARN above Codex's 8,000; passing tests at 7,007 and 8,369 |
| Registration accepts validated future Skills | PARTIAL | Project and editorial: FIV (closed schema, name rule, uniqueness, parity). Engineering: no positive fixture; needs ownership of the closed 206-capability inventory |
| Provider and security restrictions enforced | FIV | Description ≤1,024, name ≤64 and pattern, frontmatter, manifest schemas, V-09, V-25; G-13L failure cases; G-SEC-T 37/37 |

### Audit C — agent workflow (guidance is static; behaviour INV)

| Requirement | Status | Evidence |
|---|---|---|
| Task contract consistency | PARTIAL | Policy in `task-contract.md:28-40,82-90`, mirrored in `chayen-implementation/SKILL.md:118-126`; verdicts the same in four templates and four entry Skills. Drift: `unsupported` dual meaning (`change-summary.md:86-87` vs `:179-180`), `IN_PROGRESS` undefined, `chayen-testing` lacks a DONE rule |
| Ambiguous-request handling | FIV (static) | `task-contract.md:46` ("Do not ask what the repository can answer"), `:49-50`; backend `:85-95`, frontend `:79-85` |
| Scope preservation | FIV (static), not machine-guarded | `chayen-implementation/SKILL.md:43-45,157`; `task-contract.md:121` |
| Acceptance-to-evidence mapping | FIV (static) | Nine fields `change-summary.md:52-62`; "never from a declaration" `:66-67`; adequacy table `:76-85` |
| DONE / PARTIAL / BLOCKED correctness | FIV in guidance; PARTIAL in the reference grader | `change-summary.md:88-96`. `audit-evidence.mjs:136` derives only DONE or PARTIAL. A run with `exitCode: 1` and a PASSED test is still `accept`/DONE (reproduced on AU-0001) |
| Independent verification guidance | FIV (static) | Roles `change-summary.md:113-123`; eight fields `:161-172`; GI-10 |
| No false PASS on missing execution | FIV (guidance and graders) | `change-summary.md:45-46`; `chayen-testing/SKILL.md:118-123`; the grader turns NOT_RUN into `verify_more`; coding grader NOT_RUN gives `verify_more` (G-26) |
| Validator catches weakened guidance | PARTIAL | Every GI invariant has a negative control (G-18T 29/29), but 17 of 18 meaning-level mutations pass G-18 |

### Audit D — knowledge and learning

| Requirement | Status | Evidence |
|---|---|---|
| Project knowledge source-verified | FIV (static) | `dependency-and-impact.md:30-39`; `detection-and-refresh.md:68-69,106-116,138-157`; Discover steps in five Skills; GI-06 |
| Dependency and impact guidance | FIV (static) | `dependency-and-impact.md:60-79,104-108,131-134` |
| Failure reproduction and replay | FIV offline; BLOCKED live | `chayen-failure-case/1`; 6/6 replays; status derived only from authorized live replays (`failure-cases.mjs:225,235`); G-20T 17/17 |
| Distillation documented and testable | FIV | Six stages, derived decisions (`distill.mjs:295`), human review; G-21 PASS; G-21T 13/13 after the Step 20 test fix |
| No unapproved automatic Skill changes | FIV for tooling; PARTIAL traceability | No tool writes into `plugins/`; proposals are never applied. 31 plugin files changed: Steps 10 and 13 trace to D-067 and D-070; Steps 07–09 to owner step instructions only (no D-number) |

### Audit E — evaluation

| Requirement | Status | Evidence |
|---|---|---|
| Current candidate identity | FIV (mechanism); PARTIAL (no committed candidate) | `candidate.mjs:78-183`; no default candidate (`run-phase5.mjs:100-101`); 26/26 |
| Deterministic coding fixtures | PARTIAL | Six tasks, 18 negatives, graders outside `repo/`; `--check` PASS. Angular NOT_RUN, PostgreSQL MISSING |
| Isolated write-capable design | FIV (design); BLOCKED (live) | Native permissions and `FORBIDDEN_FLAGS` (`coding-runner-lib.mjs:70-109`); boundary probe (`:170-196`); `--inspect-host` exits 3 on this host |
| Independent grading | FIV | The answer is a claim only (`grading-lib.mjs:87-104`); G-26 15/15 |
| Rework and efficiency metrics | FIV (definitions); NOT_MEASURED (values) | `grading-lib.mjs:159-160`; only synthetic and fake data exist |
| Baseline vs Chayen comparison | FIV (method); NOT_MEASURED | Pairing rules `grading-lib.mjs:276-299`; every committed status NOT_MEASURED |
| Routing collision and context measurement | FIV (static); NOT_RUN (provider) | Step 18 benchmark; 6/6 scenarios as expected; report reproduced byte for byte |
| Honest NOT_RUN reporting | FIV | Synthetic reports say NOT_MEASURED; provider cells NOT_RUN. Overstatements in maintained documents were corrected in Step 20 (finding F-14); the "28/28" wording remains in the historical D-072 and Step 15 records (F-15) |

### Audit F — regression and security

See [REGRESSION_RESULTS.md](REGRESSION_RESULTS.md). All seven program
invariants (INV-01..INV-07) hold. No unintended modification was found in
the git review ([FINAL_AUDIT_REPORT.md](FINAL_AUDIT_REPORT.md) §3).

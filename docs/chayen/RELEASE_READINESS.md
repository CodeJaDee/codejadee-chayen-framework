# Release Readiness

| Field | Value |
|---|---|
| Current assessment | **Step 41**, 2026-10-17: Multilingual Humanizer release candidate |
| Candidate | Current tree on `main` after `e921df1` plus Step 41 documentation (uncommitted). 15 Entry Skills. Manifests still `0.1.0-dev`; `0.1.0-rc.1` proposed (D-058), not applied. |
| Recommendation | **NO-GO** for public release. **CONDITIONAL GO** for a limited internal pilot, with the writing skills and the response style policy labelled experimental (§8). |
| Decision owner | Project owner. **No release action was taken**: nothing committed, pushed, tagged, published or submitted. |
| Evidence | [HUMANIZER_EVALUATION_REPORT.md](HUMANIZER_EVALUATION_REPORT.md) · [KNOWN_LIMITATIONS.md](KNOWN_LIMITATIONS.md) · [ACCEPTANCE_MATRIX.md](ACCEPTANCE_MATRIX.md) · [PROGRESS.md](PROGRESS.md) Step 41 · [../distribution/RELEASE_CHECKLIST.md](../distribution/RELEASE_CHECKLIST.md) |

Classification used below: **VERIFIED** = executed in this step (or cited
with its step) and passed; **IMPLEMENTED** = present with evidence paths, not
verified by behaviour; **NOT_RUN** = executable but not executed;
**BLOCKED** = cannot run until an owner decision or authorization exists.
Static checks prove structure, never agent behaviour.

## 1. Feature completeness (MHR-001–MHR-012)

| Requirement | Implementation | Acceptance verification | Classification |
|---|---|---|---|
| MHR-001 Two editorial Entry Skills, 15 in total | Both skills ship; registry `existing`; V-05/V-07/V-17/V-19/V-20 PASS | MH-V01 native discovery NOT_RUN | IMPLEMENTED; behaviour NOT_RUN |
| MHR-002 Intended output language | Language order in both skills and in the policy | MH-V02 NOT_RUN | IMPLEMENTED; behaviour NOT_RUN |
| MHR-003 Audit and scoped rewrite | Four modes, 40 patterns with false-positive guards | MH-V03 NOT_RUN | IMPLEMENTED; behaviour NOT_RUN |
| MHR-004 Website copy editing | Website checklists, preview-then-apply rules | MH-V04 fixture diffs NOT_RUN | IMPLEMENTED; behaviour NOT_RUN |
| MHR-005 Terms and protected spans | Protected-content checklists | MH-V05 NOT_RUN | IMPLEMENTED; behaviour NOT_RUN |
| MHR-006 Semantic and factual fidelity | Meaning-carrier checks, flag-only claims | MH-V06 NOT_RUN | IMPLEMENTED; behaviour NOT_RUN |
| MHR-007 Opt-in persistent guidance (A/B, not C) | Canonical policy v1, Copilot template, guide with A/B/C separation | MH-V07 policy arms NOT_RUN; C not claimed | IMPLEMENTED; behaviour NOT_RUN |
| MHR-008 Per-surface compatibility | Six-surface matrix with documented locations and installed versions | MH-V08 host loading NOT_RUN | Partial (matrix IN_PROGRESS); NOT_RUN |
| MHR-009 Opt-in, disable, rollback | Read-only helper, fixtures, guide | MH-V09 fixtures VERIFIED (G-16T 19/19); host lifecycle NOT_RUN | IMPLEMENTED; host lifecycle NOT_RUN |
| MHR-010 Quality rubric and human evaluation | PROPOSED rubric, 120-case dataset, scorer | MH-V10 BLOCKED: rubric/threshold unapproved (ADR-0011), no reviewers | Partial (IN_PROGRESS); BLOCKED |
| MHR-011 Engineering coverage and routing preserved | Engineering skills, catalogs and manifests byte-identical to Step 34 baseline | MH-V11 static VERIFIED (Step 40); native regression NOT_RUN | Partial (IN_PROGRESS); native NOT_RUN |
| MHR-012 Security, permissions, untrusted data | Guards in both skills; zero-runtime package; policy outside the package | MH-V12 static VERIFIED (V-25, 34/34); behaviour NOT_RUN | Partial (IN_PROGRESS); behaviour NOT_RUN |

No MHR is VERIFIED. Matrix totals are unchanged by Step 41: MHR 0 PLANNED,
4 IN_PROGRESS, 8 IMPLEMENTED, 0 VERIFIED.

## 2. Skill inventory (15)

| Skill | Kind | References | Description (chars) | Behaviour evidence |
|---|---|---|---|---|
| `chayen-repository` | Engineering | 8 | 380 | Claude Code, 13-skill build only |
| `chayen-requirements` | Engineering | 6 | 405 | same |
| `chayen-architecture` | Engineering | 11 | 408 | same |
| `chayen-implementation` | Engineering | 31 | 418 | same |
| `chayen-backend` | Engineering | 24 | 416 | same |
| `chayen-frontend` | Engineering | 33 | 420 | same |
| `chayen-data` | Engineering | 28 | 414 | same |
| `chayen-testing` | Engineering | 16 | 378 | same |
| `chayen-security` | Engineering | 12 | 416 | same |
| `chayen-performance` | Engineering | 8 | 389 | same |
| `chayen-devops` | Engineering | 23 | 417 | same |
| `chayen-documentation` | Engineering | 8 | 395 | same |
| `chayen-ai-engineering` | Engineering | 13 | 412 | same |
| `chayen-humanizer-th` | Writing (Thai) | 7 | 354 | None |
| `chayen-humanizer-en` | Writing (English) | 9 | 344 | None |
| **Total** | 13 + 2 | **237** | L0 6,221 / 6,500 | |

The 13 engineering skills own all 206 engineering capabilities (20 domains)
and 108 technology capabilities; the writing skills own none and are
registered in `catalog/editorial-skills.json`. "Same" means 43 Claude Code CLI
runs on 2026-10-15 (automatic 12/22, explicit 6/6, no-match 12/12), made
before the writing skills existed.

## 3. Compatibility status

| Surface (installed 2026-10-17) | Plugin and skills | Writing skills | Response style policy |
|---|---|---|---|
| Claude Code CLI (2.1.220) | Static PASS; behaviour measured on the 13-skill build (2.1.270) | NOT_RUN | Location documented; loading NOT_RUN |
| Claude Code VS Code (2.1.301) | Static PASS; runtime NOT_RUN | NOT_RUN | Documented; NOT_RUN |
| Codex CLI (0.163.0) | Static PASS; earlier 6-skill build only | NOT_RUN | Documented; NOT_RUN |
| Codex IDE (26.1007.21434) | Unsupported (no plugins) | Unsupported | Documented; NOT_RUN |
| Copilot CLI (1.0.89) | Static PASS; earlier build only; installed runtime below the 1.0.91 needed for enable/disable | NOT_RUN | Documented; NOT_RUN |
| VS Code Copilot Chat (0.70.0) | Static PASS; runtime NOT_RUN | NOT_RUN | Documented; duplicate-load risk; NOT_RUN |

Setup C (install-only always-on policy) is **not available and not claimed**
on any surface.

## 4. Quality results

| Level | Result |
|---|---|
| Static gates | VERIFIED: `validate-all` 13/13 groups (179/179 validator self-tests, 34/34 security, 19/19 policy fixtures, G-15E, G-16, G-17 56/56), identity 15/15, docs 20 files / 0 errors |
| Simulated | Lexical proxy only (not evidence): 2 of 186 baseline picks move to a writing skill (R-62) |
| Provider runs | NOT_RUN: 52 discovery probes ×3, quality arms A/B, policy arms A/B/C (783 billed calls on Claude Code) |
| Human review | BLOCKED: rubric unapproved; no fluent Thai or English reviewers |
| Targets | Explicit 100%, implicit ≥85%, wrong skill ≤5%, policy adherence ≥95%, language ≥4/5 on ≥90% (PROPOSED): **none measured** |

## 5. Security and licensing

| Check | Classification |
|---|---|
| Package is Markdown/JSON only; no hooks, MCP, scripts, telemetry (V-09, V-25: 256 files, 0 errors) | VERIFIED |
| Policy and instruction files absent from the package (G-16 R-07) | VERIFIED |
| Untrusted-content, copy-not-behaviour, ask-before-publish and secret rules in both writing skills | IMPLEMENTED; behaviour NOT_RUN |
| Prompt injection in edited text, forged approvals, instruction-file edits | NOT_RUN (cases ready) |
| Upstream `blader/humanizer` licence: fetched read-only on 2026-10-17 (1,066 bytes, `Copyright (c) 2025 Siqi Chen`); the shipped notice's licence block is byte-identical | VERIFIED |
| MIT condition (notice kept with adapted material): notice and attribution map ship inside `chayen-humanizer-en`; user docs and listings name the source | VERIFIED |
| Chayen project licence | BLOCKED: owner decision pending (Q-05); not changed |
| Root third-party notices file | Not created; owner decision (optional under MIT because the notice ships with the skill) |

## 6. Known limitations (summary)

- Writing quality, writing-skill selection and policy loading are untested
  on every host (KL-09, KL-28, R-61).
- All behaviour evidence predates the writing skills; two new descriptions
  may shift engineering routing (R-62).
- The response style policy is advisory, opt-in and outside the plugin; some
  subagents and Copilot inline suggestions ignore it.
- The evaluation set was written by the same agent as the skills (R-63).
- `0.1.0-dev` has not changed across builds, so pinned installs go stale (R-54).
- Full list: [KNOWN_LIMITATIONS.md](KNOWN_LIMITATIONS.md).

## 7. Remaining blockers

| # | Blocker | For | Clears when |
|---|---|---|---|
| B-1 | No licence, unconfirmed publisher, private repository, no security contact (R-56, Q-05) | Public release | Owner decisions |
| B-2 | Native lifecycle of the current build untested on every CLI (R-53) | Public release, pilot (per provider) | Authorized lifecycle runs |
| B-3 | No provider or human evidence for the writing skills or the policy (R-61) | Public release; claims of quality | Authorized runs and reviewers |
| B-4 | Engineering routing not re-measured with 15 skills (R-62) | Public release | Engineering probes vs Step 32/34 baseline |
| B-5 | Rubric and language threshold unapproved; D-055, D-056/ADR-0010 inferred | Scoring; release | Owner approval |
| B-6 | Version not bumped (R-54, D-058) | Any distribution | Owner approves a version |

## 8. Recommendation

**NO-GO for public release.** B-1 to B-6 are open; for the multilingual
features no behaviour has been observed on any host.

**CONDITIONAL GO for a limited internal pilot** of this candidate, only when
all of these hold:

| # | Condition |
|---|---|
| P-1 | The owner approves the pilot, its testers (with repository access) and its providers |
| P-2 | The owner approves a version (proposed `0.1.0-rc.1`), applied in all four fields with parity re-checked |
| P-3 | Native install, disable, enable, update and uninstall are executed and recorded on each pilot provider; a provider that fails is excluded |
| P-4 | Testers are told that the writing skills and the response style policy are experimental and unevaluated, that explicit invocation is recommended, and that the policy is opt-in only |
| P-5 | Testers use test repositories and normal permission prompts, with no production credentials |
| P-6 | Feedback goes through repository issues, and the Step 40 evaluation is run before any wider release |

This is a recommendation. It is not authorization to commit, tag, push,
publish or release.

## 9. Product Owner approvals still required

1. Confirm or correct D-055 (English skill), D-056 and ADR-0010 A + B (policy),
   and the D-057 note (Step 40 accepted by proceeding).
2. Approve or change the rubric and the ADR-0011 language threshold.
3. Approve a version (D-058) or keep `0.1.0-dev`.
4. Licence (Q-05), publisher identity, distribution model, security contact
   and support channel.
5. Whether to add a root third-party notices file.
6. Authorization for billed evaluation runs, lifecycle runs and disposable
   host profiles; nominate fluent reviewers (two per language plus an
   adjudicator).
7. The Codex IDE position (Q-02) and the pilot decision (§8).
8. Commit of the Step 41 changes.

---

## Step 34 assessment (historical, 2026-10-15)

Preserved unchanged except for heading levels. It covered the 13-skill build and is superseded by the Step 41 assessment above.

| Field | Value |
|---|---|
| Date | 2026-10-15 |
| Candidate | Proposed `0.1.0`. The manifests still say `0.1.0-dev`. |
| Decision | **NO-GO** for public release. **CONDITIONAL-GO** for a limited internal pilot (§4). |
| Decision owner | Project owner. **No release action was taken.** |
| Evidence | [FINAL_AUDIT_REPORT.md](FINAL_AUDIT_REPORT.md) · [KNOWN_LIMITATIONS.md](KNOWN_LIMITATIONS.md) · [../distribution/RELEASE_CHECKLIST.md](../distribution/RELEASE_CHECKLIST.md) |

### 1. Mandatory release requirements

| # | Requirement | Status | Evidence / gap |
|---|---|---|---|
| M-1 | Manifests and marketplace definitions valid and consistent | ✅ VERIFIED | Strict validate ×4; identity checks 15/15; V-01..V-04 |
| M-2 | Package is static and safe in composition (no CLI, installer, runtime, daemon, MCP, or secrets) | ✅ VERIFIED | Independent scan; V-09; V-25; EX-01..EX-07 VERIFIED |
| M-3 | Automated validators and regression tests pass | ✅ VERIFIED | 20 commands plus 6 fact suites, all exit 0 (FINAL_AUDIT_REPORT §2) |
| M-4 | Native install, update, disable, and uninstall of **this build** on each supported provider | ❌ NOT VERIFIED | R-53. Earlier build only. The lifecycle opt-in was denied in STEP 31. |
| M-5 | Relevant skills activate from ordinary prompts | ⚠️ PARTIAL | Claude Code only: automatic 12/22 (55%); Next.js 0/5. Codex, Copilot, and VS Code untested. |
| M-6 | No-match prompts keep native behaviour | ⚠️ PARTIAL | 12/12 on Claude Code. Other providers untested on this build. Copilot over-activated on the earlier build. |
| M-7 | Documentation complete and accurate | ✅ VERIFIED | Ten required topics covered; G-14 PASS; stale metrics corrected in STEP 34 |
| M-8 | Limitations and unsupported surfaces disclosed | ✅ VERIFIED | COMPATIBILITY_MATRIX, SECURITY_AND_LIMITATIONS, KNOWN_LIMITATIONS |
| M-9 | Version set and changelog prepared | ⚠️ PARTIAL | Changelog `[Unreleased]` ready. Version not bumped (R-54). |
| M-10 | Licence and publisher identity confirmed | ❌ MISSING | R-56, Q-05 |
| M-11 | Security contact published | ❌ MISSING | R-56; SECURITY.md flags it as an owner action |
| M-12 | Public install source (for a public release) | ❌ MISSING | Repository is private |

**Rule applied:** mandatory requirements M-4, M-10, M-11 and M-12 are
unverified or missing, so a public release is **NO-GO**.

### 2. Test results summary

| Level | Result |
|---|---|
| Static validation | All PASS: 9 gate groups, 132/132 negative controls, 32/32 boundary tests, 15/15 identity, docs 0 errors, strict validate ×4 |
| Framework facts | 107 PASS / 0 FAIL / 52 NOT_RUN |
| Simulated | Lexical proxy only: top-1 0.546. **Not provider evidence.** |
| Actual provider | Claude Code CLI, 43 runs: automatic 12/22, explicit 6/6, no-match 12/12, wrong skill 0/18, references 10/22 |
| Manual | None executed. VS Code procedures are NOT TESTED. |
| Failed tests | No automated failures. Provider probe failures: `pr-nextjs-route` 0/5; ASP.NET, Angular and SQL Server 1 miss each in Run C; pytest 2 misses; Copilot Unity and SwiftUI (earlier build) |

### 3. Path to GO (public release)

In order. The owner acts on every item marked *Owner*.

1. **Owner decisions** (RELEASE_CHECKLIST §A):
   - licence;
   - publisher name;
   - public or internal distribution;
   - security contact;
   - support channel.
2. **Bump the version** to `0.1.0` in both manifests and in the Copilot
   marketplace entry, then re-run the gates. *Maintainer, after approval.*
3. **Execute native lifecycle verification** (STEP 31 runbook R-3, R-5, R-7)
   on the Claude Code, Codex and Copilot CLIs, from the release commit.
   Record update from the previous version.
4. **Run the provider probes** on Copilot (isolated home signed in with a
   test identity) and, after the install, Codex.
5. **Run both VS Code manual procedures** with a person, and record the
   results.
6. **Decide what to do about automatic-routing reliability.** Either:
   - improve it (EG-16 and EG-17 description work, measured over ≥5 runs
     with a no-plugin baseline); or
   - accept and disclose it. The current docs already advise explicit
     invocation.
7. **Resolve governance:**
   - the D-009 status inconsistency;
   - review the PROPOSED ADRs (0003, 0004, 0007);
   - user review of GOV-01..GOV-18.
8. **Release:** commit, tag, push and publish, then any listings, each with
   explicit approval (BC-30, BC-31).

### 4. Conditional-GO: limited internal pilot

A pilot may start only when **all** of these conditions hold:

| # | Condition | Status |
|---|---|---|
| C-1 | The owner approves a pilot with named testers who have repository access | Pending |
| C-2 | Version bumped from `0.1.0-dev` (for example to `0.1.0-pilot.1`), with manifest parity re-validated | Pending |
| C-3 | Native install, disable, enable, update, and uninstall executed and recorded on **each provider the pilot uses** | Pending |
| C-4 | Testers receive KNOWN_LIMITATIONS: automatic routing 55%, explicit invocation recommended, no VS Code evidence, advisory-only security | Pending |
| C-5 | Testers use test repositories or normal permission prompts. No production credentials are given to agents. | Pending |
| C-6 | Feedback goes through repository issues (docs/CONTRIBUTING.md) | Ready |

If C-3 fails on a provider, exclude that provider from the pilot.

### 5. Approval

| Role | Decision | Date |
|---|---|---|
| Project owner | *Pending: NO-GO public; CONDITIONAL-GO pilot recommended* | — |

This document recommends; it does not approve. Nothing was published,
pushed, tagged, or submitted.

# Release Readiness (STEP 34)

| Field | Value |
|---|---|
| Date | 2026-10-15 |
| Candidate | Proposed `0.1.0`. The manifests still say `0.1.0-dev`. |
| Decision | **NO-GO** for public release. **CONDITIONAL-GO** for a limited internal pilot (§4). |
| Decision owner | Project owner. **No release action was taken.** |
| Evidence | [FINAL_AUDIT_REPORT.md](FINAL_AUDIT_REPORT.md) · [KNOWN_LIMITATIONS.md](KNOWN_LIMITATIONS.md) · [../distribution/RELEASE_CHECKLIST.md](../distribution/RELEASE_CHECKLIST.md) |

## 1. Mandatory release requirements

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

## 2. Test results summary

| Level | Result |
|---|---|
| Static validation | All PASS: 9 gate groups, 132/132 negative controls, 32/32 boundary tests, 15/15 identity, docs 0 errors, strict validate ×4 |
| Framework facts | 107 PASS / 0 FAIL / 52 NOT_RUN |
| Simulated | Lexical proxy only: top-1 0.546. **Not provider evidence.** |
| Actual provider | Claude Code CLI, 43 runs: automatic 12/22, explicit 6/6, no-match 12/12, wrong skill 0/18, references 10/22 |
| Manual | None executed. VS Code procedures are NOT TESTED. |
| Failed tests | No automated failures. Provider probe failures: `pr-nextjs-route` 0/5; ASP.NET, Angular and SQL Server 1 miss each in Run C; pytest 2 misses; Copilot Unity and SwiftUI (earlier build) |

## 3. Path to GO (public release)

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

## 4. Conditional-GO: limited internal pilot

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

## 5. Approval

| Role | Decision | Date |
|---|---|---|
| Project owner | *Pending: NO-GO public; CONDITIONAL-GO pilot recommended* | — |

This document recommends; it does not approve. Nothing was published,
pushed, tagged, or submitted.

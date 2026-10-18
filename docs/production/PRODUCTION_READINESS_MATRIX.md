# Production Readiness Matrix (Phase 1 Baseline)

| Field | Value |
|---|---|
| Date | 2026-10-18 |
| Git revision | `1734ea50ca7695e9b4b51e343002bcb0188b0be9` (`main`; `origin/main` is the same commit; no tags) |
| Build | `chayen` `0.1.0-dev`: 15 Entry Skills, 237 references, 256 package files. Metadata fingerprint `86cf548cda5b08d5` |
| Findings | [PRODUCTION_GAP_ANALYSIS.md](PRODUCTION_GAP_ANALYSIS.md) |
| Evidence | [PHASE_01_EVIDENCE.md](PHASE_01_EVIDENCE.md) |

Every mandatory production gate below has a Phase 1 baseline.

**PASS here means a static or offline check passed.** Phase 1 ran no
runtime verification, so no gate is PASS on the strength of observed
runtime or agent behaviour.

Columns:
- **Pilot**: the gate is mandatory for a limited internal pilot.
- **GA**: the gate is mandatory for public or production release.
- **Target phase**: the phase that should close the gate (gap analysis §5).

## 1. Summary

| Status | Gates |
|---|---|
| PASS | 15 |
| FAIL | 14 |
| NOT_RUN | 3 |
| BLOCKED | 10 |
| NOT_APPLICABLE | 1 |
| **Total** | **43** |

| Readiness level | Result |
|---|---|
| Static product integrity | **Ready.** Every static gate passes (PG-01..09, PG-17..20, PG-30, PG-33) |
| Limited internal pilot | **Not ready.** Open pilot gates: PG-10, PG-15, PG-21, PG-25, PG-28, PG-32, PG-39, PG-43. PG-11 and PG-12 also apply if the pilot uses Codex or Copilot |
| Public or production release | **Not ready.** 14 gates FAIL, 10 are BLOCKED and 3 are NOT_RUN |

## 2. Gate baseline

### A. Repository and architecture

| Gate | Requirement | Pilot | GA | Baseline | Evidence | Findings | Target phase |
|---|---|---|---|---|---|---|---|
| PG-01 | Audited revision identified; working tree clean; local and remote agree | ✔ | ✔ | **PASS** | E-28, E-29, E-30 | — | — |
| PG-02 | Native Agent Plugin architecture preserved: no CLI, extension, runtime, daemon, installer or mandatory MCP (EX-01..EX-07) | ✔ | ✔ | **PASS** | E-02; E-04 V-09; independent count of 254 `.md` and 2 `.json` | P1-034 | — |
| PG-03 | One shared skills source used by all providers | ✔ | ✔ | **PASS** | E-17 IC-02; all three marketplaces point to `./plugins/codejadee-chayen-framework` | — | — |
| PG-04 | Package is static Markdown/JSON only: no hooks, MCP, scripts, telemetry or executables | ✔ | ✔ | **PASS** | E-02 (V-25, 0 errors); E-03 (34/34); E-04 (V-09) | P1-034 | — |
| PG-05 | Developer tools have no undeclared side effects; baseline checks are non-destructive | ✔ | ✔ | **PASS** | Evidence §3 review; E-28 tree clean after all checks | — | — |

### B. Native packaging and lifecycle

| Gate | Requirement | Pilot | GA | Baseline | Evidence | Findings | Target phase |
|---|---|---|---|---|---|---|---|
| PG-06 | Claude Code manifest and marketplace valid (strict) | ✔ | ✔ | **PASS** | E-21, E-22, E-23 (Claude Code 2.1.302) | P1-028, P1-030 | — |
| PG-07 | Codex marketplace and manifest valid | ✔ | ✔ | **PASS**, repository validators only (Codex has no validator) | E-04 V-01c, V-02; E-17 | P1-026, P1-027 | 2, 7 |
| PG-08 | Copilot marketplace and manifest valid | ✔ | ✔ | **PASS**, repository validators only | E-04 V-01b, V-02; E-17 IC-06 | — | 7 |
| PG-09 | Identity parity: name, version and shared fields across all manifests and marketplaces | ✔ | ✔ | **PASS** | E-04 V-04; E-17 IC-03, IC-05, IC-06 | — | — |
| PG-10 | Native lifecycle (install, disable, enable, update, uninstall) of the current build on Claude Code CLI | ✔ | ✔ | **BLOCKED** | Last run 2026-10-14, on a 6-skill build under the old identifier | P1-001 | 7 |
| PG-11 | Native lifecycle of the current build on Codex CLI | If used | ✔ | **BLOCKED** | Last run 2026-10-14, Codex 0.160.1, 6 skills | P1-001, P1-027 | 7 |
| PG-12 | Native lifecycle of the current build on Copilot CLI ≥ 1.0.91 | If used | ✔ | **BLOCKED** | Copilot CLI is not installed (Evidence §1) | P1-001 | 7 |
| PG-13 | VS Code surfaces (Claude Code extension, Copilot Chat): manual procedures executed | — | ✔ | **NOT_RUN** | Never executed | P1-001 | 7 |
| PG-14 | Remote GitHub marketplace install from the chosen distribution source | — | ✔ | **BLOCKED** | Repository is private (E-31); no tags (E-30) | P1-001, P1-005 | 6, 7 |
| PG-15 | Lifecycle tooling and runbook correct for the current build | ✔ | ✔ | **FAIL** | `run-lifecycle.sh` gaps; runbook expects 13 skills | P1-018, P1-019 | 4 |
| PG-16 | Provider limitations disclosed, with versions | ✔ | ✔ | **NOT_APPLICABLE** (external). Disclosure is present; versions still need re-checking | KL-06, KL-07, KL-32..KL-35 | P1-025 | 7 |

### C. Entry Skills, catalogs and workflows

| Gate | Requirement | Pilot | GA | Baseline | Evidence | Findings | Target phase |
|---|---|---|---|---|---|---|---|
| PG-17 | 15 Entry Skills present, valid and registered; ≤ 15 (D-053); L0 ≤ 6,500 | ✔ | ✔ | **PASS** | E-04 V-05, V-07 (6,221), V-17, V-19, V-20; independent recount | P1-029 | — |
| PG-18 | Engineering catalog: 206 capabilities in 20 domains, intact | ✔ | ✔ | **PASS** (static) | E-05, E-18 | — | — |
| PG-19 | Technology catalog: 108 capabilities, intact | ✔ | ✔ | **PASS** (static) | E-06 | — | — |
| PG-20 | 12 Composite Workflows and 7 templates resolve; no dangling references | ✔ | ✔ | **PASS** (static) | E-07; independent path resolution | — | — |
| PG-21 | Scope conformance: Nitro and Elysia out of scope; no new skills; no out-of-scope stack presented as supported | ✔ | ✔ | **FAIL** | `chayen-backend/SKILL.md:3`; catalog `:51`, `:54`; trigger cases | P1-007 | 2, 5 |
| PG-22 | Capability and workflow behaviour verified, or the owner formally accepts the IMPLEMENTED bar | — | ✔ | **NOT_RUN** | 0 VERIFIED of 206 + 108 + 12; acceptance matrix 7 of 98 VERIFIED (exclusions only) | P1-022 | 2, 7 |
| PG-23 | Framework fact checks executed for the shipped technology guidance | — | ✔ | **NOT_RUN** | This phase: 8 PASS, 0 FAIL, 48 NOT_RUN (JS packs). .NET, SQL Server and PostgreSQL suites not run | P1-023 | 7 |

### D. Skill routing reliability

| Gate | Requirement | Pilot | GA | Baseline | Evidence | Findings | Target phase |
|---|---|---|---|---|---|---|---|
| PG-24 | Automatic routing measured on the frozen fingerprint, per release provider, against approved targets | — | ✔ | **BLOCKED** | Fingerprint `86cf548cda5b08d5` never measured. Historical result 12/22 (55%) on the 13-skill build | P1-008 | 7 |
| PG-25 | Explicit invocation measured under the `chayen` namespace; docs accurate | ✔ | ✔ | **FAIL** (docs misattribute the result). The evidence itself is BLOCKED | `AUTOMATIC_SKILL_DISCOVERY.md:100`; rename in `1734ea5` | P1-009, P1-036 | 4, 7 |
| PG-26 | No-match prompts keep native behaviour on the current build | — | ✔ | **BLOCKED** | Historical 12/12, on the 13-skill build and Claude Code only | P1-008 | 7 |
| PG-27 | Writing skills do not capture engineering prompts (wrong skill ≤ target) | — | ✔ | **BLOCKED** | Lexical proxy only (2 moves); 14 overlap and engineering probes NOT_RUN | P1-015 | 7 |

### E. Humanizer TH/EN and response style policy

| Gate | Requirement | Pilot | GA | Baseline | Evidence | Findings | Target phase |
|---|---|---|---|---|---|---|---|
| PG-28 | Writing-skill content complete and internally consistent (MHR-001..012) | ✔ | ✔ | **FAIL** | E-11 static PASS. The Thai description contradicts its scope, and Thai numerals are unprotected | P1-012, P1-014, P1-032 | 2, 5 |
| PG-29 | Writing quality verified by provider runs and fluent human review against an approved rubric | — | ✔ | **BLOCKED** | E-16 NOT_RUN; rubric PROPOSED; no reviewers | P1-010, P1-011 | 2, 7 |
| PG-30 | Response style policy outside the package, opt-in and within budget | ✔ | ✔ | **PASS** (static) | E-12, E-13 | — | — |
| PG-31 | Response style policy loading verified on each offered host | — | ✔ | **BLOCKED** | Six surfaces NOT_RUN | P1-035 | 7 |
| PG-32 | Third-party (MIT) notice shipped and protected against regression | ✔ | ✔ | **FAIL** | Notice present; no validator guards it | P1-013 | 4 |

### F. Security

| Gate | Requirement | Pilot | GA | Baseline | Evidence | Findings | Target phase |
|---|---|---|---|---|---|---|---|
| PG-33 | Static security profile and boundary regressions pass | ✔ | ✔ | **PASS** | E-02, E-03 | P1-034 | — |
| PG-34 | Adversarial prompt-injection and forged-approval behaviour tested | — | ✔ | **BLOCKED** | KL-40, KL-44; cases ready, not run | P1-024 | 7 |
| PG-35 | Security contact and private disclosure channel published | — | ✔ | **FAIL** | `SECURITY.md:16-25` | P1-004 | 2 |

### G. CI/CD and branch governance

| Gate | Requirement | Pilot | GA | Baseline | Evidence | Findings | Target phase |
|---|---|---|---|---|---|---|---|
| PG-36 | CI runs all offline gates on every push and PR, on the supported Node versions | — | ✔ | **FAIL** | No CI configuration of any kind (Evidence §2) | P1-016, P1-033 | 3 |
| PG-37 | Branch governance: protected `main`, required CI, review policy, CODEOWNERS | — | ✔ | **FAIL** for repository artifacts; remote settings BLOCKED | 36 direct commits, 0 merges; no `gh` | P1-017 | 2, 3 |
| PG-38 | Governance decisions ratified: no gate depends on a PROPOSED ADR or decision | — | ✔ | **FAIL** | 4 PROPOSED ADRs; 28 PROPOSED decisions; DF-03 | P1-021 | 2 |

### H. Versioning, licensing, support, distribution and documentation

| Gate | Requirement | Pilot | GA | Baseline | Evidence | Findings | Target phase |
|---|---|---|---|---|---|---|---|
| PG-39 | Release version set (not `-dev`) in all four fields; single tag format | ✔ | ✔ | **FAIL** | `0.1.0-dev` in all four fields; no tags; ADR-0008 and the checklist disagree | P1-002 | 2, 6 |
| PG-40 | Project licence chosen; `LICENSE` present; manifest `license` set | — | ✔ | **FAIL** | No `LICENSE`; no manifest `license` | P1-003 | 2, 6 |
| PG-41 | Distribution model, publisher identity and public install source decided | — | ✔ | **FAIL** | Private repository (E-31); publisher unverified | P1-005 | 2, 6 |
| PG-42 | Support channel stated for the intended audience | — | ✔ | **FAIL** | Issues only, in a private repository. A pilot with repository-access testers can use Issues (RELEASE_READINESS P-6) | P1-006 | 2 |
| PG-43 | Documentation accurate against the tree and recorded evidence | ✔ | ✔ | **FAIL** | Stale counts, versions, commit state and identifier | P1-020, P1-019, P1-036, P1-028 | 4 |

## 3. Status by gate group

| Group | PASS | FAIL | NOT_RUN | BLOCKED | N/A |
|---|---|---|---|---|---|
| A. Repository and architecture (PG-01..05) | 5 | 0 | 0 | 0 | 0 |
| B. Packaging and lifecycle (PG-06..16) | 4 | 1 | 1 | 4 | 1 |
| C. Skills, catalogs, workflows (PG-17..23) | 4 | 1 | 2 | 0 | 0 |
| D. Routing (PG-24..27) | 0 | 1 | 0 | 3 | 0 |
| E. Humanizer and policy (PG-28..32) | 1 | 2 | 0 | 2 | 0 |
| F. Security (PG-33..35) | 1 | 1 | 0 | 1 | 0 |
| G. CI/CD and governance (PG-36..38) | 0 | 3 | 0 | 0 | 0 |
| H. Release metadata and documentation (PG-39..43) | 0 | 5 | 0 | 0 | 0 |
| **Total (43)** | **15** | **14** | **3** | **10** | **1** |

## 4. Rules for updating this matrix

1. Change a gate's status only on new recorded evidence: a phase evidence log entry with the command, exit code, revision and date.
2. Static checks never move a runtime gate (PG-10..14, PG-22, PG-24..27, PG-29, PG-31, PG-34) to PASS.
3. When any `SKILL.md` description changes, the routing gates (PG-24..27) go back to BLOCKED until they are re-measured on the new metadata fingerprint.
4. When the version or plugin identifier changes, the lifecycle gates (PG-10..14) go back to BLOCKED.
5. Record any owner acceptance of a gap as a decision and link it here. The gate is then marked *accepted*, not PASS.

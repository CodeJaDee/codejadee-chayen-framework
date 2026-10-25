# Chayen Evolution — Regression Results (Step 20)

- **Date:** 2026-10-23
- **Revision tested:** `develop` at **`26bfbd0`**: the owner's commit of the
  Step 20 changes, pushed to `origin/develop`. The working tree differed
  from it only in two files under `docs/chayen/evolution/`, which no gate
  reads: `FINAL_AUDIT_REPORT.md` (changed-file table) and this file, then a
  placeholder.
- **Environment:** Windows 11, Node.js 26.8.1, Git `core.autocrlf=true`. No
  provider CLI, network, billed call or container engine was used.
- **Run discipline:** no file was edited while the official run executed.
  An earlier run overlapped with edits and was discarded (§5). Raw logs are
  in the session scratch directory, outside the repository.

## 1. Official results

| Command | Exit | Result |
|---|---|---|
| Each of the 24 `*.test.mjs` files, `node --test <file>` one at a time | 0 for all 24 | **399/399 tests pass, 0 fail** |
| `node tools/validate/validate-all.mjs` | **0** | **43/43 gate groups PASS**, "All automated gates passed" |
| `node tools/evals/run-evaluation-suite.mjs` (no `--write`) | **0** | "Evaluation suite static/traceability levels PASS" |

**Evaluation-suite levels:**

| Level | Result |
|---|---|
| S-ALL | PASS |
| S-IDENTITY | 15/15 |
| S-AUDIT206 | PASS |
| S-EVALSYNC | 223 cases, 541 files |
| T-206 | 206/206 |
| T-TECH | 108/108 |
| T-WF | 12/12 |
| T-ROUTING | 11/11 |
| S-HANDOFF | 259 files, 0 dangling |
| SIM lexical proxy (not evidence) | top-1 0.503, top-3 0.775, unchanged from Step 01 |
| Discovery metadata | 6,563 characters (~1,641 tokens, estimated) |
| Provider routing | NOT_RUN on all three CLIs |

## 2. Per-file test results

| Test file | Gate | Pass | Fail |
|---|---|---|---|
| `tests/audit/audit-evidence.test.mjs` | G-22T | 14 | 0 |
| `tests/catalog/discovery-metrics.test.mjs` | G-13M | 13 | 0 |
| `tests/catalog/registration.test.mjs` | G-13R | 21 | 0 |
| `tests/ci/documentation.test.mjs` | Phase 3 documentation | 17 | 0 |
| `tests/ci/limits.test.mjs` | G-13L | 16 | 0 |
| `tests/ci/negative-controls.test.mjs` | G-14N | 4 | 0 |
| `tests/distillation/distillation.test.mjs` | G-21T | 13 | 0 |
| `tests/editorial/numeric-preservation.test.mjs` | Phase 2 editorial | 22 | 0 |
| `tests/evaluation/coding/coding-fixtures.test.mjs` | G-24T | 10 | 0 |
| `tests/evaluation/coding/coding-runner.test.mjs` | G-25T | 19 | 0 |
| `tests/evaluation/coding/grading.test.mjs` | G-26T | 11 | 0 |
| `tests/evaluation/phase5/candidate.test.mjs` | G-23 | 12 | 0 |
| `tests/evaluation/phase5/phase5.test.mjs` | Phase 5 | 14 | 0 |
| `tests/evaluation/routing-context/routing-context.test.mjs` | G-27T | 10 | 0 |
| `tests/failures/failure-cases.test.mjs` | G-20T | 17 | 0 |
| `tests/production/hardening.test.mjs` | Phase 2 hardening | 22 | 0 |
| `tests/provider-compatibility/lifecycle.test.mjs` | Phase 2 lifecycle | 40 | 0 |
| `tests/provider-compatibility/qualify-rc.test.mjs` | RC controls | 10 | 0 |
| `tests/response-style/setup-fixtures.test.mjs` | G-16T | 19 | 0 |
| `tests/security/boundaries.test.mjs` | G-SEC-T | 37 | 0 |
| `tests/security/evidence-privacy.test.mjs` | G-SEC-E | 2 | 0 |
| `tests/skills/guidance-consistency.test.mjs` | G-18T | 29 | 0 |
| `tests/skills/project-map.test.mjs` | G-19 | 11 | 0 |
| `tests/skills/reference-graph.test.mjs` | G-13G | 16 | 0 |
| **Total** | | **399** | **0** |

Every test file is registered in `validate-all.mjs`; none is orphaned.
`validate-all` also runs the non-`node --test` gates:
- V-25 (`check-security.mjs`): 263 package files, 16 Skills, 0 errors;
- the package validator: 0 errors, 0 warnings;
- the catalog, technology and workflow checks;
- G-11, G-13 (189/189 validator self-tests), G-14 and G-15E;
- G-16, G-17 (56/56), G-18 (0 errors);
- G-20 (3/3 records, 6/6 replays), G-21, G-22 (8/8);
- G-24 (`--check`), G-26 (15/15) and G-27 (21/21).

## 3. Change in the baseline

| Gate | Steps 12–19 | Step 20 |
|---|---|---|
| G-21T | FAIL on Windows checkouts (12/13), recorded as a "pre-existing CRLF issue" | **PASS 13/13** after the test fix |
| `validate-all` | 1 gate group failing | **0 failing** |
| `run-evaluation-suite` | S-ALL FAIL | **PASS** |

**Root cause.**
- With `core.autocrlf=true`, the target file has CRLF line endings, so the
  test's LF search string was never found and its mutation did nothing.
- The distillation tool is line-ending agnostic and was correct throughout.

**Fix (test only).** The test now mutates the LF-normalised text and asserts
that the mutation changed the file.

**Control.** In a disposable copy, the tool's "diff does not apply" check was
turned into a no-op. The fixed test then fails: 10 pass, 3 fail. So the
test still guards the tool.

## 4. Program invariants (rules §3), re-checked

| ID | Check | Result |
|---|---|---|
| INV-01 | `check-identity.mjs` 15/15; one marketplace file per provider; identical manifest identity | PASS |
| INV-02 | 16 `SKILL.md` under `plugins/codejadee-chayen-framework/skills/`; 0 elsewhere | PASS |
| INV-03 | The plugin tracks only `.md` and `.json`; V-09 and V-25.1 pass | PASS |
| INV-04 | Security controls intact or stricter: V-25.3 has five guards, G-SEC-E added, no bypass flag in any runner | PASS |
| INV-05 | MIT in `LICENSE`, the plugin `LICENSE.md` and both manifests; H-LICENSE (hardening, 0 errors) | PASS |
| INV-06 | 206 capabilities; fingerprint `2f13cad24ff431e3` | PASS |
| INV-07 | No `package.json` in tooling or the plugin; the 4 present are evaluation fixtures | PASS |

## 5. Discarded run

An earlier full run overlapped with the writing of the Step 20 documents.
`tests/ci/documentation.test.mjs` copies the `docs` tree while it runs, and
it reported 15 pass and 2 fail in that run. Run alone after the edits, it
passed 17/17, and it passed again in the official run. The overlapping run
is not used as evidence. No cause is claimed beyond the timing overlap.

## 6. Not covered by these results

These results are offline and static. They do not test:
- agent behaviour;
- provider routing;
- adversarial security cases;
- real coding runs;
- the Copilot lifecycle.

Those are listed in [KNOWN_LIMITATIONS.md](KNOWN_LIMITATIONS.md). The native
lifecycle evidence for Claude Code and Codex comes from Step 19
([PROVIDER_SECURITY_REPORT.md](PROVIDER_SECURITY_REPORT.md)), not from this
run.

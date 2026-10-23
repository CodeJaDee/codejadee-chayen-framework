# Chayen Evolution — Release Readiness (Step 20)

- **Date:** 2026-10-23
- **Source:** `develop` at `26bfbd0`: audited at `7bbb39b`, with the Step 20
  changes committed by the owner. `main` and the tag `v1.1.2` are at `7427eb1`.
- **Package:** `chayen` 1.1.2 in both manifests (not bumped), 16 Skills,
  discovery-metadata fingerprint `411b6adbbea7e121`, 206-capability inventory
  `2f13cad24ff431e3`.

## 1. Verdicts

| Question | Verdict |
|---|---|
| Is the evolution program DONE? | **No.** 13 steps PASS and 7 PARTIAL ([acceptance matrix](ACCEPTANCE_MATRIX.md)); 3 items MISSING |
| Implementation status | **IMPLEMENTATION SUBSTANTIALLY COMPLETE.** Every step's mechanism exists and is tested offline; the gaps are listed in §3 |
| Runtime status | **RUNTIME QUALIFICATION PENDING.** No agent behaviour, routing, explicit invocation, no-match, adversarial or real coding result exists on any CLI |
| Production readiness (the supported-host claim in [RELEASE_SCOPE_DECISION](../../production/RELEASE_SCOPE_DECISION.md)) | **NO-GO** |
| A guidance-only `1.1.3` release, labelled as unqualified like `1.1.1` and `1.1.2` | **CONDITIONAL GO** (conditions in §4) |

## 2. Rationale

**Production readiness is NO-GO.** The release contract requires each
supported host to pass:
- its lifecycle gate;
- automatic routing ≥85%;
- explicit invocation and no-match behaviour on a frozen candidate.

None of these is met for all three CLIs:

- Routing, explicit invocation and no-match are NOT_RUN everywhere.
- Copilot CLI is not qualified: 1.0.89 is installed and 1.0.91 required.
- The 16 adversarial security cases have never run.
- No lifecycle has run on a committed frozen candidate.

An approved risk or an unexecuted evaluation is not a passing test.

**A guidance-only release can be conditionally justified.** The offline
evidence is strong:
- every gate passes after the Step 20 test fix (see
  [REGRESSION_RESULTS](REGRESSION_RESULTS.md));
- the seven program invariants hold;
- the distribution policy is unchanged or stricter;
- the native lifecycle of the 16-Skill content passed on Claude Code 2.1.220
  and Codex 0.163.0 in isolated profiles.

The changes are guidance and developer tooling. Skill names, descriptions and
discovery metadata are identical to `1.1.2`, so routing metadata does not
change. The project released `1.1.1` and `1.1.2` on the same footing, with
the runtime gaps disclosed. Publishing changed content under the existing
`1.1.2` version would be worse: installed users would not receive it through
a version-based update (F-04).

## 3. Open items before the program can be DONE

| Item | Step | Type |
|---|---|---|
| Agent-facing reproduce-before-fix guidance (`verify_more` when a failure cannot be reproduced) | 11 | MISSING (owner decision) |
| PostgreSQL coding fixture | 15 | MISSING |
| Positive registration test for a new engineering Skill | 03 | MISSING (test) |
| Exact-boundary limit cases; wider stale-limit detection | 06 | PARTIAL |
| One meaning per term (`unsupported`, `IN_PROGRESS`, the testing DONE rule) | 07 | PARTIAL |
| COMMITTED_SOURCE candidate committed under `tests/evaluation/phase5/candidates/` | 14 | PARTIAL (now possible: the tree is clean at `7bbb39b`) |
| Angular specs executed | 15 | BLOCKED (`npm ci` authorization) |
| Provider routing and token counts; adversarial cases; Copilot ≥1.0.91 | 18, 19 | BLOCKED (authorization and tooling) |

## 4. Conditions for a CONDITIONAL GO on `1.1.3`

1. The owner approves `1.1.3` and the proposed [CHANGELOG](../../../CHANGELOG.md)
   entry. The version is changed in both manifests and the Copilot
   marketplace entry by the owner, not by this program.
2. The remaining Step 20 documents are committed: `REGRESSION_RESULTS.md`,
   the audit report's changed-file table and the Step Log entry. Both
   `validate-all.mjs` and `run-evaluation-suite.mjs` already pass on
   `26bfbd0` ([REGRESSION_RESULTS](REGRESSION_RESULTS.md)).
3. A COMMITTED_SOURCE candidate is prepared on that commit, and the native
   lifecycle is rerun on it. This is recommended, not strictly required for
   a guidance release.
4. README, `SECURITY_AND_LIMITATIONS.md` and the compatibility matrix keep
   stating that routing, behaviour and security runtime results are NOT_RUN,
   and that Copilot is not qualified. Step 20 updated these.
5. The owner explicitly accepts the open risks in §5.
6. The [manual release sign-off](../../production/MANUAL_RELEASE_SIGNOFF.md)
   is completed.

No version bump, tag, release, push or settings change was made by this
program.

## 5. Risks the owner must accept or remediate

| Risk | Finding | Severity |
|---|---|---|
| No runtime qualification on any CLI | F-01 | High |
| Copilot unqualified; non-interactive permission conflict with INV-04 | F-02 | High |
| Codex test-profile isolation leak on Windows | F-03 | High |
| Shipped guidance changed under the unchanged `1.1.2` version | F-04 | Medium |
| Reference audit grader ignores exit codes; cannot derive BLOCKED | F-05 | Medium |
| The guidance validator guards phrasings, not meaning | F-06 | Medium |
| Snapshot count pins block adding a real Skill | F-07 | Medium |
| Narrow stale-limit detection | F-08 | Medium |

## 6. Recommended next actions, in order

1. **Owner decisions:**
   - the version (`1.1.3`);
   - whether the owner's criteria for Steps 18 and 19 formally replace the
     plan's;
   - the Copilot permission approach;
   - redaction of historical evidence;
   - the Step 11 agent-facing rule.
2. **Commit and freeze:** commit the Step 20 changes, then prepare and
   commit a COMMITTED_SOURCE candidate.
3. **Authorize runtime qualification:** Claude Code first, as the cheapest
   and best-instrumented host:
   - Phase 5 routing, 3 runs plus the no-plugin baseline;
   - the 16 security cases;
   - then Codex in a container or a clean OS account, so that
     `inventory-isolation` passes;
   - then Copilot ≥1.0.91.
4. **Low-cost hardening, no runtime needed:**
   - fix the grader's exit-code and BLOCKED handling (F-05);
   - add meaning-level guidance invariants (F-06);
   - replace snapshot count pins with derived counts (F-07);
   - test the suite's per-configuration grouping and the
     `inventory-isolation` row (F-11);
   - extend G-SEC-E to personal-name and mixed-case path detection (F-12).
5. **Coding evaluation:** provision a digest-pinned image and an
   egress-restricted container engine, then run A/B/C with at least 5 runs
   per configuration and task.

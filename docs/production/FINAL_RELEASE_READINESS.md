# Final Release Readiness: Chayen v0.1.0 (Phase 6)

> **Superseded for the release by D-061 (2026-10-18):** the owner released Chayen as **`1.0.0`** (MIT, public, tag `v1.0.0`) and accepted the open gates in this document. This record is kept as written.

| Field | Value |
|---|---|
| Date | 2026-10-18 (Plan v4, Phase 6: final production release qualification) |
| Target | Chayen v0.1.0, public, MIT, publisher CodeJaDee; Claude Code CLI, Codex CLI, GitHub Copilot CLI; automatic routing ≥ 85% on each CLI |
| Verified sources | `38570b3a83cb5181e15f12daef921653bc0add36` (RC.1 content commit) and the current tip `4bda4db8fb6b50b78388f8400a576ccc07fe7c53` (`main` = `origin/main`, no tags). `4bda4db` was pushed by the owner during Phase 6 and changes no package file. Version `0.1.0-rc.1` |
| Contract amendment | **Owner decision, 2026-10-18 (commit `4bda4db`):** GitHub Actions and GitHub Releases are not part of Chayen distribution. G-04 becomes Manual Offline Validation. G-17 no longer requires a GitHub Release. Git tags are optional. Routing ≥ 85% per CLI and SECURITY/SUPPORT = LATER are unchanged. This report applies the amended contract. The decision is recorded in the scope decision and the gate matrix, but not yet in `docs/chayen/DECISIONS.md` |
| Evidence record | [final-checks.json](../../tests/production/results/2026-10-18-phase6/final-checks.json) |
| **Decision** | **NO-GO: public release blocked** |

## 1. Decision

**NO-GO.** Twelve mandatory gates are BLOCKED, two are NOT_RUN and one fails, and none
of them has an approved disposition. The release contract's central requirement, at
least 85% automatic routing on each CLI independently, has **no measurement on any
CLI**.

| Option | Condition | Met? |
|---|---|---|
| GO | All 17 gates pass; three CLIs verified; ≥ 85% routing per CLI; owner approvals complete | **No.** 2 of 17 gates pass |
| CONDITIONAL GO (limited pilot) | Critical lifecycle **and** security controls pass | **No.** Copilot lifecycle is entirely BLOCKED, Claude disabled-loading is BLOCKED, and no adversarial security test has run |
| **NO-GO** | Any mandatory gate fails or stays blocked without approved disposition | **Yes** |

This report does not authorize, and Phase 6 did not perform, any commit, push, tag,
GitHub Release, visibility change or publication. To evaluate the current tip, the
local `main` was fast-forwarded to `origin/main` (`4bda4db`). The uncommitted Phase 5/6
edits were re-applied, and the one documentation conflict, in this gate matrix, was
resolved in favour of the owner's amended G-04 and G-17 definitions.

## 2. What was independently verified

Every check below was re-executed in Phase 6 on fresh clones detached at `38570b3` and
at `4bda4db`, each with a clean status. Earlier phase reports were not taken on trust.

| Check | Result |
|---|---|
| `validate-all.mjs` on Node 24.22.0 | PASS 19/19 on both commits |
| `validate-all.mjs` on Node 20.11.0 (official portable binary, SHA-256 verified) | PASS 19/19 on `38570b3`. See [final-checks.json](../../tests/production/results/2026-10-18-phase6/final-checks.json) for `4bda4db` |
| `run-evaluation-suite.mjs --fail-fast` | PASS on both commits (static and traceability only) |
| Provider identity | 15/15 PASS on both commits |
| `claude plugin validate --strict` on the plugin and the marketplace (local, no model call) | PASS 2/2. Advice: the plugin README has no one-step install line |
| CI negative controls (isolated broken-manifest, broken-reference and missing-notice fixtures) | 4/4 on both commits. actionlint passed on `38570b3`; the workflow no longer exists at `4bda4db` |
| Package inventory | 256 files (254 `.md`, 2 `.json`), 15 Entry Skills, no executable or runtime components |
| Identity metadata | Plugin `chayen`; all three marketplaces `codejadee`; author and owner `CodeJaDee`; version `0.1.0-rc.1` in all four fields |
| Licence | **No root `LICENSE`. No manifest `license` field.** The upstream Humanizer MIT notice is complete and guarded |
| Package fingerprint | `efc4c6e6…` from committed bytes, identical at `38570b3` and `4bda4db`; `9e5705fe…` from a Windows CRLF checkout. Content is identical after EOL normalization. Skill metadata is `339b3125d1347648` |
| GitHub Actions | **Discontinued by owner decision** (`4bda4db` deletes `.github/workflows/validate.yml`), so no longer a release gate. No remote run was ever observed: the private repository returns 404 unauthenticated |
| Public URL | `https://github.com/CodeJaDee/codejadee-chayen-framework` returns **404**, so remote public installation cannot be tested |

The Phase 4 lifecycle evidence was re-read from its machine record:

| Provider | Result |
|---|---|
| Claude Code | 17 PASS, 1 BLOCKED |
| Codex | 18 PASS, 3 UNSUPPORTED, each with a tested native alternative |
| Copilot | 16 BLOCKED |

Real configuration was unchanged, and no model calls were made. That evidence names a
working-tree snapshot whose content equals `38570b3`, not the commit itself.

Phase 5 recorded **0 provider runs**. Its routing, Humanizer, capability and security
reports contain fixtures and procedures, not results.

## 3. Final gate verdicts

| Gate | Verdict | Evidence or reason |
|---|---|---|
| G-01 Native Plugin Architecture | **BLOCKED** (was PASS) | The technical parts pass on the candidate: static `.md`/`.json` package, no runtime components, one shared source, V-25, strict validation. **Challenged:** the gate also requires D-009/DF-03 to be ratified, and `DECISIONS.md` still lists D-009 as PROPOSED (DF-03 OPEN). Scope §3.4 says a release-related decision must be ACCEPTED before its gate can PASS. Needs OD-11 |
| G-02 Product Scope Correctness | **PASS** | 15 Skills, 206/108/12 inventory, L0 6,217/6,500, all `SKILL.md` ≤ 300 lines, Nitro/Elysia exclusions guarded (`check-hardening.mjs` and validators) on `38570b3` |
| G-03 Validators and Regression Tests | **PASS** | `validate-all` 19/19 on the committed sources (`38570b3` on Node 20.11.0 and 24.22.0; `4bda4db` on Node 24.22.0, Node 20 in the evidence record), including the guards K-05..K-07 and their negative controls |
| G-04 Manual Offline Validation (amended) | **NOT_RUN** | The requirement applies to the **final stable-version source**, which does not exist yet. The same method passes on the RC sources: validators, identity, evaluation suite, negative controls. Reviewer sign-off on the final source is outstanding |
| G-05 Version Integrity | **BLOCKED** | Four fields agree on `0.1.0-rc.1`; identity 15/15. Still open: the stable `0.1.0` source and its CHANGELOG/SECURITY entries, the M1 prerequisites (G-01, G-15), and the canonical fingerprint rule. Tags are optional; if created, they must be `vX.Y.Z` and match the manifest revision |
| G-06 Claude Code Lifecycle | **BLOCKED** | Disabled-loading proof is BLOCKED. The evidence names a snapshot, not a frozen commit. No re-run on a committed M1 candidate |
| G-07 Codex Lifecycle | **BLOCKED** | Supported operations pass on the snapshot. No committed M1 re-run |
| G-08 Copilot Lifecycle | **BLOCKED** | The CLI is not installed; every operation is BLOCKED |
| G-09 Automatic Routing ≥ 85% per CLI | **BLOCKED** | **No score on any CLI.** Tooling preconditions are met. Needs OD-10 budget and authorization, OD-05, a Codex signal pilot, and Copilot CLI |
| G-10 Explicit Invocation and No-match | **BLOCKED** | 0 runs. Also needs ADR-0003 (PROPOSED) or approved PT thresholds |
| G-11 Humanizer Quality | **BLOCKED** | 0 model outputs, no human review. Needs OD-06, OD-07 and OD-10. The dataset lacks Thai-digit cases |
| G-12 Engineering Capability Sampling | **BLOCKED** | 0 runs; the sample is not approved (OD-08). 0/206, 0/108, 0/12 VERIFIED |
| G-13 Technology Fact Checks | **NOT_RUN** | 159 checks: 73 PASS, 0 FAIL, 86 NOT_RUN (Phase 5, disposable environments). No OD-09 exemption list |
| G-14 Agent Security | **BLOCKED** | The static part passes (V-25, boundaries 34/34). 0 adversarial runs. ADR-0007 is PROPOSED |
| G-15 Public Distribution and License | **FAIL** | No `LICENSE`; no manifest `license`; copyright holder unconfirmed (OD-03); the repository is not public (404); no one-step install line (P1-030); no remote install |
| G-16 Security and Support Decision | **BLOCKED** | Owner decision is SECURITY/SUPPORT = LATER. No arrangement is selected, and no separate owner decision revises the requirement. See §6 |
| G-17 Source and Version Integrity (amended; no GitHub Release) | **BLOCKED** | No stable `0.1.0` source; no source revision carries complete three-CLI runtime evidence; no provider smoke results; limitation disclosures incomplete (§7); release decisions in scope §3.4 not ACCEPTED; no publication authorization recorded. Missing GitHub Actions or Releases are **not** counted |

| Status | Count | Gates |
|---|---|---|
| PASS | **2** | G-02, G-03 |
| FAIL | **1** | G-15 |
| NOT_RUN | **2** | G-04, G-13 |
| BLOCKED | **12** | G-01, G-05, G-06, G-07, G-08, G-09, G-10, G-11, G-12, G-14, G-16, G-17 |
| NOT_APPLICABLE | 0 | — |

## 4. Routing scores

| CLI | Automatic routing accuracy | 95% interval | Verdict against ≥ 85% |
|---|---|---|---|
| Claude Code CLI (2.1.302) | **Not measured** | — | Not established |
| Codex CLI (0.163.0) | **Not measured** | — | Not established |
| GitHub Copilot CLI | **Not measured** (CLI not installed) | — | Not established |

No average, historical figure (for example 12/22 on the 13-Skill build) or lexical
proxy is substituted. The prepared measurement plan is 312 routing calls per CLI. See
[ROUTING_EVALUATION](ROUTING_EVALUATION.md).

## 5. Public repository safety review

Scope: every one of the 42 commits, plus HEAD.

| Area | Finding | Severity | Required before public visibility |
|---|---|---|---|
| Credentials | None found. No private keys or AWS, GitHub, Slack, Google, JWT or OpenAI/Anthropic tokens. Two `sk-` hits are validator mutation IDs. `PASSWORD=<local-only>` values are placeholders | — | None |
| Commit metadata | 41 commits carry a personal Gmail address as author and committer | Privacy (owner decision) | The owner accepts the exposure, or rewrites history before publication (destructive; separate approval) |
| Local paths | Windows usernames and user-profile paths appear in `docs/chayen/PROGRESS.md`, `tests/security/results/step30-gates.txt` and `tests/technology/angular-typescript/results/step21-fact-checks.md`, and about 190 times in history. The synthetic `alice` paths are intentional | Low (information disclosure) | Scrub the HEAD files in the next candidate. Accept the history or rewrite it |
| Sensitive files and binaries | None ever added | — | None |
| URLs | Only localhost, `example.*` and `.invalid` | — | None |
| Third-party: Humanizer (MIT) | Full MIT text, copyright line and attribution ship in `chayen-humanizer-en/references/upstream-notice.md`, guarded by tests | Satisfied | Keep it next to the project `LICENSE` |
| Third-party: Wikipedia "Signs of AI writing" (CC BY-SA 4.0) | Credited as the upstream's basis. No CC BY-SA statement is included | Open question | The owner confirms that no verbatim Wikipedia text is shipped (ideas and taxonomy only), or adds CC BY-SA attribution for any copied passage (OD-03 rights attestation) |
| Distribution path | One source, `plugins/codejadee-chayen-framework/`, referenced by all three marketplace files; public target `CodeJaDee/codejadee-chayen-framework` | Consistent | Confirm the repository name and owner at visibility time |
| Phase 5/6 files | Uncommitted. Results are path-scrubbed (verified) | — | Commit together with the next candidate |
| Removed CI workflow | `4bda4db` deletes `.github/workflows/validate.yml`. It remains in history, and contains no secrets (`contents: read`, no credentials) | — | None |

The repository was **not** made public. Remote public installation stays **pending**.
The exact post-publication smoke test is in
[INSTALL_MIGRATION_ROLLBACK §5](INSTALL_MIGRATION_ROLLBACK.md#5-post-publication-smoke-test).

## 6. G-16 Security and Support

The approved owner decision is **SECURITY/SUPPORT = LATER**.

- `SECURITY.md` correctly names no channel.
- No email address, GitHub Issues route or private vulnerability reporting route is
  substituted.
- Release scope approval is not a waiver.

**Verdict: BLOCKED.** It becomes PASS when the owner selects an arrangement and the
G-16 evidence exists: the decision record, an updated `SECURITY.md`, the support path
in README and CONTRIBUTING, and a confirmed test report. It becomes ACCEPTED_RISK only
through a separate, explicit owner decision recorded in `docs/chayen/DECISIONS.md`
that revises the requirement and states the consequences. G-16 also blocks M2: public
visibility and any public tag.

## 7. Accepted risks (preserved; never PASS)

| Risk | Status | Disclosure in public docs |
|---|---|---|
| AR-01 Response Style Policy host verification | BLOCKED (deferred) | In `docs/SECURITY_AND_LIMITATIONS.md` and the draft release notes. **Missing** as the verbatim statement in `docs/RESPONSE_STYLE.md` and the README limitations |
| AR-02 VS Code integration verification | NOT_RUN (deferred) | Present: README "Supported release hosts", the compatibility matrix and the install guides say VS Code is unverified and outside the v0.1.0 claim |
| AR-03 Branch Protection and Required Reviews | FAIL / BLOCKED (deferred) | README and `SECURITY_AND_LIMITATIONS.md` name unprotected `main`. **Missing:** the "install a pinned release tag" advice, which waits on the tag format (OPEN-01) |
| AR-04 Unrelated ADR closure | FAIL (deferred) | Draft release notes. **Missing** as a header note in `docs/chayen/DECISIONS.md` |

Public documentation does reflect the CLI-only scope. The disclosure gaps above are
G-17 items, not new risks. No accepted risk is presented as verified functionality.

## 8. Path to a GO decision

1. **Owner decisions:**
   - record the 2026-10-18 "no GitHub Actions or GitHub Releases; tags optional"
     decision in `docs/chayen/DECISIONS.md`;
   - OD-02, only if tags will be used (`vX.Y.Z`);
   - OD-03 copyright holder, rights attestation and the Wikipedia question;
   - OD-05 routing expected sets and PT-01..06;
   - OD-06 rubric and reviewer roster;
   - OD-07 translation scope;
   - OD-08 capability sample;
   - OD-09 NOT_RUN list;
   - OD-10 billed-run budget, test identities and Copilot CLI installation;
   - OD-11 ratify D-009, ADR-0003 and ADR-0007;
   - OD-01 Security/Support.
2. **New candidate `0.1.0-rc.2`** (authorized commit), containing:
   - root MIT `LICENSE` and `"license": "MIT"` in both manifests;
   - the one-step install line in the plugin README;
   - the missing limitation statements;
   - scrubbed local paths;
   - the Phase 5/6 tooling and docs.

   Adding `license` changes the package fingerprint, so lifecycle and runtime evidence
   must name this commit. The metadata fingerprint should stay `339b3125d1347648`.
3. **Freeze M1** on rc.2 after manual offline validation on that SHA, recorded with
   toolchain versions and exit codes (the G-04 method).
4. **Re-run the lifecycle** on rc.2 for all three CLIs, including Claude disabled
   loading and the full Copilot procedure (G-06..G-08).
5. **Run Phase 5 billed batches** on rc.2 under OD-10:
   - routing, explicit and no-match, with each CLI independently ≥ 85%;
   - Humanizer with human review;
   - the capability sample;
   - adversarial security with zero CRITICAL results.

   Run the 86 NOT_RUN fact checks in a pinned container, or list exemptions under OD-09.
6. **G-16 owner arrangement**, then the M2 visibility act and the remote-install smoke
   test on each CLI (G-15).
7. **Stable `0.1.0` source**, reviewed against the qualified rc.2, with affected tests
   repeated for any content change:
   - G-04 manual validation with reviewer sign-off on that SHA;
   - provider smoke tests on all three CLIs;
   - the owner's stable-designation and publication approvals.

   A tag is optional; if used, it is `v0.1.0` and matches the manifest revision. No
   GitHub Release is part of distribution.

Full lists: [FINAL_RELEASE_CHECKLIST](FINAL_RELEASE_CHECKLIST.md),
[OWNER_APPROVAL_CHECKLIST](OWNER_APPROVAL_CHECKLIST.md). Draft notes:
[RELEASE_NOTES_v0.1.0_DRAFT](RELEASE_NOTES_v0.1.0_DRAFT.md).

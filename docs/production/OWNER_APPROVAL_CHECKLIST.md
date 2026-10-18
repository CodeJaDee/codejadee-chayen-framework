# Owner Approval Checklist: Chayen v0.1.0

Phase 6, 2026-10-18. These decisions and authorizations belong to the **Product Owner
(CodeJaDee)**. None of them has been given by any phase prompt, gate result, green
check or this document.

- Record each decision in `docs/chayen/DECISIONS.md` (decisions) or in the
  [manual sign-off](MANUAL_RELEASE_SIGNOFF.md) (release acts).
- Each record carries the date, the exact target (SHA, version, repository) and the
  scope.

## A. Decisions that unblock gates

| ID | Decision | Unblocks | Status | Recommendation, or what to supply |
|---|---|---|---|---|
| OD-01 | Security reporting channel and support path, **or** a separate decision that revises G-16 and records the consequences | G-16, M2 | **LATER (pending)** | Choose an arrangement. No channel is assumed until then |
| New | Record the 2026-10-18 decision (no GitHub Actions or GitHub Releases; tags optional; commit `4bda4db`) in `docs/chayen/DECISIONS.md` | G-04, G-17 traceability | Recorded in the scope decision and matrix only | Add a decision entry |
| OD-02 | Whether to use tags at all; if yes, the format | AR-03 pin advice | Optional since 2026-10-18 | `vX.Y.Z` per ADR-0008. Without tags, users pin by commit SHA |
| OD-03 | Copyright holder line for `LICENSE`; distribution-rights attestation; Wikipedia CC BY-SA position | G-15, M1, M2 | Open | Supply the holder name. Confirm that no verbatim Wikipedia text is shipped, or approve adding attribution |
| OD-05 | Routing expected sets in `tests/evaluation/phase5/routing-probes.json`; thresholds PT-01..PT-06; installed-plugin measurement rule | G-09, G-10 | Open | Review the expected sets **before** any scored run |
| OD-06 | Humanizer rubric, language threshold, critical-failure rule; reviewer roster (2 fluent reviewers per language plus an adjudicator); independent-case share | G-11 | Open | Name the reviewers; approve or amend ≥ 4/5 on ≥ 90% and the zero-critical rule |
| OD-07 | Translation-direction scope for the Humanizer | G-11 | Open | — |
| OD-08 | Engineering capability sample (`capability-sample.json`), or formal acceptance of the IMPLEMENTED bar as a requirement amendment | G-12 | Open | Approve the 24 + 4 sample |
| OD-09 | Fact checks accepted as NOT_RUN, listed explicitly | G-13 | Open | Prefer running them in a pinned container |
| OD-10 | Billed provider runs: **budget**, test identities, isolated profiles, installing Copilot CLI ≥ 1.0.91 | G-06..G-14 | **Not granted** | Planned 2,268 calls (756 per CLI) plus pilots and retries. Claude Code estimate is about $272. Codex and Copilot use plan usage or premium requests |
| OD-11 | Ratify D-009/DF-03, ADR-0003, ADR-0007 | G-01, G-10, G-14 | Open | — |
| OD-12 | Release-act authorizations (section C) | G-17 | None given | — |
| New | Canonical package-fingerprint rule | G-05, G-17 | Open | Use committed LF bytes. The CRLF checkout fingerprint differs only by line endings |
| New | Personal email in 41 commits and local paths in history | Public safety | Open | Accept, or authorize a history rewrite before visibility (destructive; re-verify everything afterwards) |

## B. Content approvals for the next candidate

- [ ] Version `0.1.0-rc.2`. This follows the approved strategy of incrementing the RC
      suffix, but confirm it explicitly.
- [ ] Add the root MIT `LICENSE` and `"license": "MIT"` in both manifests. This changes
      the package fingerprint and resets the lifecycle and runtime evidence.
- [ ] Add the plugin README install line, the accepted-risk limitation statements and
      the scrubbed local paths. Include the Phase 5/6 tooling and documentation.

## C. Release acts (separate approval for each)

| Act | Precondition | Approved? |
|---|---|---|
| Commit the rc.2 candidate | Section B approved | ☐ |
| Push the rc.2 candidate | Commit reviewed | ☐ |
| Tag `v0.1.0-rc.2` (optional) | OD-02 | ☐ |
| Change repository visibility to public (M2) | G-16 resolved; G-15 licence and rights done; public-safety decisions taken | ☐ |
| Commit and push the stable `0.1.0` source | All 17 gates PASS; G-04 manual validation and sign-off on that SHA | ☐ |
| Tag `v0.1.0` (optional) | Matches the stable source's manifest version | ☐ |
| Declare `0.1.0` stable and publish the notes in CHANGELOG/docs (no GitHub Release) | Post-publication smoke test PASS on all three CLIs | ☐ |
| Marketplace or directory submissions | Each one separately | ☐ |

## D. Not requiring approval for v0.1.0 (accepted risks, preserved)

AR-01 Response Style Policy host verification, AR-02 VS Code, AR-03 Branch Protection
and Required Reviews, AR-04 unrelated ADR closure. They stay deferred and disclosed.
None of them is a verified feature.

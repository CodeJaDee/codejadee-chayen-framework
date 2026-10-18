# Final Release Checklist: Chayen v0.1.0

Phase 6, 2026-10-18. Decision: **NO-GO** ([FINAL_RELEASE_READINESS](FINAL_RELEASE_READINESS.md)).

- `[x]` means verified with recorded evidence on `38570b3` and the current tip `4bda4db` (identical package).
- Applies the owner amendment of 2026-10-18: no GitHub Actions or GitHub Releases; tags optional.
- `[ ]` means open.

This is an operator checklist. It never authorizes a release act; those are listed in
[OWNER_APPROVAL_CHECKLIST](OWNER_APPROVAL_CHECKLIST.md). It supersedes the Phase 4
[distribution checklist](../distribution/RELEASE_CHECKLIST.md) for the final decision.

## 1. Identity, content and packaging

- [x] Plugin `chayen`; marketplace `codejadee` in all three marketplace files; author and owner `CodeJaDee`.
- [x] 15 Entry Skills; 206/108/12 inventory; L0 6,217/6,500; every `SKILL.md` ≤ 300 lines.
- [x] Package is 256 files: 254 `.md` and 2 `.json`. No hooks, agents, commands, scripts, MCP, settings or executables.
- [x] One shared Skills source for all three marketplaces.
- [x] Version `0.1.0-rc.1` in all four fields; identity 15/15.
- [x] Upstream Humanizer MIT notice complete and guarded.
- [ ] Root MIT `LICENSE` with the confirmed copyright holder (OD-03).
- [ ] `"license": "MIT"` in both manifests, with parity.
- [ ] One-step install line in the plugin README (strict-validation advice; P1-030).
- [ ] Wikipedia (CC BY-SA) question settled: no verbatim text shipped, or attribution added.
- [ ] Local usernames and paths scrubbed from `docs/chayen/PROGRESS.md`, `tests/security/results/step30-gates.txt` and `tests/technology/angular-typescript/results/step21-fact-checks.md`.
- [ ] D-009/DF-03 ratified (G-01). ADR-0003 and ADR-0007 ratified or superseded.
- [ ] Owner chooses the canonical package-fingerprint rule: committed LF bytes (recommended) or a checkout.

## 2. Candidate freeze (M1)

- [ ] New candidate `0.1.0-rc.2`, with the items above plus the Phase 5/6 tooling and docs, committed under an authorized commit.
- [ ] `validate-all` passes on Node 20.11.0 and the current LTS on the rc.2 commit.
- [ ] Evaluation suite, identity and strict validation pass on the rc.2 commit.
- [ ] Manual offline validation on the rc.2 SHA (`validate-all --fail-fast`, `check-identity`, `run-evaluation-suite --fail-fast`, negative controls), recorded with toolchain versions and exit codes. GitHub Actions are not used.
- [ ] Package and metadata fingerprints recorded. Metadata expected to stay `339b3125d1347648`.

## 3. Native lifecycle on rc.2 (G-06..G-08)

- [ ] Claude Code: the full lifecycle, including **disabled-loading proof** in a disposable signed-in test profile.
- [ ] Codex: the full supported lifecycle and native alternatives; `config.toml` unchanged.
- [ ] Copilot CLI ≥ 1.0.91 installed (OD-10); the full lifecycle; uninstall verified by absence.

## 4. Runtime qualification on rc.2 (Phase 5 batches, OD-10)

- [ ] Unscored pilot per CLI. Event shapes confirmed and the Codex activation signal approved.
- [ ] Automatic routing **≥ 85% on Claude Code**: ⟨k/n, CI⟩.
- [ ] Automatic routing **≥ 85% on Codex**: ⟨k/n, CI⟩.
- [ ] Automatic routing **≥ 85% on Copilot**: ⟨k/n, CI⟩.
- [ ] Explicit invocation (15 Skills) and no-match per CLI meet the OD-05 thresholds (G-10).
- [ ] Humanizer: 0 critical regressions; signed human reviews meet the OD-06 bar (G-11).
- [ ] Capability sample graded on each CLI; only sampled rows promoted (G-12).
- [ ] Technology facts: the 86 NOT_RUN checks run in a pinned container, or listed under OD-09 (G-13).
- [ ] Adversarial security: **0 CRITICAL** on each CLI; findings recorded (G-14).

## 5. Documentation and disclosure (G-17)

- [x] Public docs present CLI-only support. VS Code is unverified and outside the claim (AR-02).
- [ ] AR-01 statement verbatim in `docs/RESPONSE_STYLE.md` and the README limitations.
- [ ] AR-03 "install a pinned release tag" advice, with the pin syntax, in README and the install docs.
- [ ] AR-04 header note in `docs/chayen/DECISIONS.md`.
- [ ] Compatibility matrix and install guides updated from the rc.2 evidence; the "freeze pending" wording removed.
- [ ] Release notes completed from evidence ([draft](RELEASE_NOTES_v0.1.0_DRAFT.md)), with all `⟨TBD⟩` fields resolved or removed.

## 6. Security/Support and visibility (G-16, M2)

- [ ] Owner selects the Security/Support arrangement (OD-01). `SECURITY.md`, README and CONTRIBUTING updated; test report received. Or a separate owner decision revises G-16 and records an accepted risk.
- [ ] Owner decides on the personal email in commit metadata and the local paths in history (accept, or approved history rewrite).
- [ ] Owner authorizes the visibility change. Then the unauthenticated URL returns 200.

## 7. Stable designation (M3)

- [ ] Stable `0.1.0` source reviewed against the qualified rc.2. Any content change repeats the affected tests.
- [ ] G-01, G-03 and G-04 pass on the stable source; reviewer sign-off recorded.
- [ ] Optional tag: if created, `v0.1.0` points at the stable source and matches the manifest version.
- [ ] Post-publication smoke test on all three CLIs ([§5](INSTALL_MIGRATION_ROLLBACK.md#5-post-publication-smoke-test)).
- [ ] Final notes published in CHANGELOG and docs (no GitHub Release). Manual sign-off and owner stable-designation approval recorded ([MANUAL_RELEASE_SIGNOFF](MANUAL_RELEASE_SIGNOFF.md)).

# Release checklist: Chayen v0.1.0

Reviewed 2026-10-18, Phase 4. **NOT READY for release.** This is an operator
checklist, not permission to execute release actions. The
[Release Gate Matrix](../production/RELEASE_GATE_MATRIX.md) governs readiness.
Version strategy and the approved public/MIT/CodeJaDee target are in
[Release metadata](RELEASE_METADATA.md).

## A. Confirm the release contract

- [x] Target: public MIT Chayen v0.1.0, publisher CodeJaDee.
- [x] Production hosts: Claude Code CLI, Codex CLI, Copilot CLI.
- [x] 15 Skills, 206 engineering and 108 technology capabilities, 12 workflows.
- [x] Standalone Nitro/Elysia excluded; no new runtime components.
- [ ] Later owner decisions: rights-holder line and Security/Support.
  Security/Support is LATER; no contact is selected by this checklist.

## B. Candidate content (Phase 4)

- [x] Apply approved `0.1.0-rc.1` in all four version fields (OWN-07).
- [ ] Add project MIT licence/manifest licence; retain upstream Humanizer notice.
- [x] Align CHANGELOG, supported versions and working-tree candidate fingerprint.
- [ ] Review the exact commit and static package diff.

## C. Offline validation and CI

- [x] `node tools/validate/validate-all.mjs --fail-fast` passes locally on both pinned Node versions.
- [x] `node tests/provider-compatibility/check-identity.mjs` passes locally.
- [x] `node tools/evals/run-evaluation-suite.mjs --fail-fast` passes locally on both pinned Node versions.
- [x] Isolated manifest/reference/MIT negative controls detect failures locally.
- [x] Workflow syntax is valid; both pinned Node local validation aggregates pass.
- [ ] Record actual candidate/release GitHub Actions run URLs and SHAs.
  Local PASS is not remote PASS; Phase 3 remote execution is NOT_RUN.

Native `claude plugin validate --strict` is a separate authorized check when
that CLI is available. Ordinary CI uses the repository's offline validators
and does not install provider binaries or require provider credentials.

## D. Native qualification (Phase 4 lifecycle; Phase 5 evaluation)

- [ ] Every required lifecycle operation passes on all three CLIs in isolated
  disposable profiles; changed-content updates and uninstall absence are proved.
  [Phase 4 evidence](../production/NATIVE_LIFECYCLE_REPORT.md): Claude disabled
  loading behavior remains BLOCKED; Codex supported native alternatives verified;
  Copilot executable unavailable. A committed candidate freeze remains pending.
- [ ] Automatic routing >=85% **per CLI**, using native selection events.
- [ ] Current `chayen` explicit invocation and no-match pass independently.
- [ ] Humanizer quality/human review, engineering samples, technology facts
  and adversarial provider checks satisfy their scoped gates.
- [ ] Public remote installation is verified when publication is authorized.

Historical six-/thirteen-Skill results do not qualify the current build.
Do not pool CLI rates or count lexical SIM as automatic routing evidence.

## E. Deferred work and documentation

Response Style Policy host tests, VS Code runtime tests, Branch Protection,
Required Reviews and unrelated ADR/repository hygiene work are accepted
deferrals, **not required checklist items** for this phase/release scope.
Keep their limitations visible. Security/Support is a later owner decision;
do not invent a reporting route or treat it as Phase 3 implementation work.
The release contract retains its separate publication prerequisite.

## F. Release (owner only, after explicit approval)

- [ ] Complete [manual sign-off](../production/MANUAL_RELEASE_SIGNOFF.md).
- [ ] Record separate approval for each commit, push, tag, visibility change,
  release and directory submission.
- [ ] Use `vX.Y.Z` tags consistent with ADR-0008; verify tag/version/commit match.
- [ ] Repeat applicable offline and delta checks on the stable release commit.
- [ ] Publish only after scoped release gates and required owner inputs close.

Unprotected `main` remains an accepted risk; no repository setting is changed
by this checklist. No Phase 3 workflow commits, pushes, tags or publishes.

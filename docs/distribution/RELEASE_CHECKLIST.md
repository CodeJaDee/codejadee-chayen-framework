# Release checklist: Chayen v0.1.0

> **Owner update (2026-10-18):** GitHub Actions and GitHub Releases removed from the release process. Use offline manual validation plus provider checks and versioned source instead. Git tags are optional.


> **Owner decision D-061 (2026-10-18):** released as `1.0.0` with the open
> gates below accepted by the owner. Done: version in four fields, MIT
> licence files and manifest field, public repository, tag `v1.0.0`.

Reviewed 2026-10-18, Phase 4. **NOT READY for release** (superseded by D-061). This is an operator
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
- [x] Add project MIT licence/manifest licence; retain upstream Humanizer notice (D-061).
- [x] Align CHANGELOG, supported versions and working-tree candidate fingerprint.
- [ ] Review the exact commit and static package diff.

## C. Manual offline validation (no GitHub Actions)

- [ ] On the exact stable-version source commit, run `node tools/validate/validate-all.mjs --fail-fast`.
- [ ] Run `node tests/provider-compatibility/check-identity.mjs`.
- [ ] Run `node tools/evals/run-evaluation-suite.mjs --fail-fast`.
- [ ] Run the applicable negative/mutation controls and `claude plugin validate --strict`, if available.
- [ ] Record command output, exit codes, tool versions, source SHA and reviewer sign-off.

Historical local RC checks passed in earlier phases but must be repeated on the final stable source.
GitHub Actions and remote CI runs are deliberately **not required**.

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
- [ ] Record separate approval for source pushes, public visibility and directory submission.
- [ ] Git tags are optional. If used, verify their version and commit match.
- [ ] Do not create a GitHub Release; it is not part of Chayen distribution.
- [ ] Repeat applicable offline and delta checks on the stable release commit.
- [ ] Publish only after scoped release gates and required owner inputs close.

Unprotected `main` remains an accepted risk; no repository setting is changed
by this checklist. No Phase 3 workflow commits, pushes, tags or publishes.

# Manual release sign-off

Phase 3 procedure, 2026-10-18. **NOT SIGNED. No release action authorized.**
Target: public MIT Chayen v0.1.0, publisher CodeJaDee, with Claude Code CLI,
Codex CLI and GitHub Copilot CLI as the scoped production hosts.

## Why manual sign-off is required

Unprotected `main` and absent required reviews/status checks are an
**accepted release-process risk** (AR-03). Work can land without enforced CI
or review. A maintainer must therefore examine the exact release commit,
evidence and diff, and the owner must explicitly authorize release acts.
CI success is evidence, not approval. Branch Protection and Required Reviews
are deferred; enabling them is not a condition for Phase 3 completion.

## Record for a later release decision

| Field | Value to record at sign-off |
|---|---|
| Candidate/release version | Pending; `0.1.0-rc.1` then `0.1.0` |
| Exact commit SHA and reviewed diff | Pending |
| Package and metadata fingerprints | Pending for frozen candidate; current metadata `339b3125d1347648` |
| Maintainer/reviewer and review date | Pending |
| Owner decision and timestamp | Pending |
| Real Actions run URL, SHA and each job conclusion | NOT_RUN in Phase 3 |
| Per-CLI lifecycle/routing/explicit/no-match evidence | NOT_RUN; Phase 5 |
| Human quality/technology/security evidence | Pending scoped release gates |
| Rights-holder/project MIT licence confirmation | Pending later candidate freeze |
| Security/Support owner decision | LATER; no channel selected |
| Authorized act and exact target | None authorized by this form |

## Inspect before recommending release

1. Review the precise commit and full diff from the last evaluated build.
   Confirm static Markdown/JSON packaging, one shared Skills source, 15 Skills,
   206 engineering capabilities, 108 technology capabilities and 12 workflows.
   No extra runtime components or supported Nitro/Elysia claims may appear.
2. Confirm all four version fields, CHANGELOG and supported-version docs
   agree. Apply MIT only in the authorized candidate phase, retain upstream
   Humanizer notice/attribution, and confirm legal rights separately.
3. Run the offline commands in [CI/CD design](CI_CD_DESIGN.md). Confirm both
   pinned Node versions and isolated negative controls. Inspect actual remote
   job logs on this exact SHA; record NOT_RUN when no run exists.
4. Inspect independent native lifecycle and automatic routing evidence for
   **each CLI**. Automatic routing must be >=85% per CLI on the candidate;
   lexical SIM, explicit requests and old builds do not count. Verify update
   content and uninstall absence. Account for remaining scoped release gates.
5. Check documentation says VS Code is unverified, policy is opt-in and
   unverified, and Security/Support is pending unless a later owner decision
   explicitly supplies a channel. Deferred host tests, branch settings and
   unrelated ADR/hygiene work do not become new release requirements.
6. Reconcile every [Release Gate Matrix](RELEASE_GATE_MATRIX.md) result with
   evidence. Remaining final publication prerequisites belong to the later
   release decision; this checklist does not reopen them in Phase 3.

## Authorization and execution

Obtain a separate explicit owner instruction for committing, pushing,
creating a tag, changing visibility, creating a release and each directory
submission. Record the approved revision, version, target and act. None is
implied by an approved scope, signed review, green workflow or local PASS.

Use accepted `vX.Y.Z` Git tags: `v0.1.0-rc.1` and `v0.1.0`. Confirm the tag
points at the reviewed commit whose manifest version matches it. This
procedure creates no tag and does not use provider-generated tag names.

Before acting, compare the current commit with the authorized SHA. Stop on
drift or failed checks; evaluate the new candidate instead. Content changes
reset affected runtime evidence. The stable version-only delta follows G-17.
After any authorized publication, separately verify remote public native
installation on the three CLIs and record actual results.

## Phase 3 disposition

Local implementation/review only. No commit, push, tag, publication,
visibility change, branch rule, provider installation or message to an
external party is authorized or performed. Stop after Phase 3; candidate
freeze and runtime evaluation are later tasks.

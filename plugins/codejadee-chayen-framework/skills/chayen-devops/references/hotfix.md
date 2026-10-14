---
kind: recipe
capabilities: [CAP-15-009]
---
# Hotfix preparation

Prepare an urgent fix for a released version: branch from the release tag,
make the minimal change, run targeted and regression tests, bump the
version, and get the fix back to the main line. Local git operations are
fine; pushing, tagging on the remote, releasing, and deploying need the
user's approval and the platform's authorization.

## Inputs

- The defect, its impact, and the affected released version (tag or
  release branch).
- The repository's branching model and versioning scheme, and the release
  pipeline.
- Whether main already contains a fix (which may only need backporting).

## Procedure

1. **Identify the released code:** the tag or release branch for the
   version in production, confirmed from release records or the deployed
   version endpoint.
2. **Check main first:** if main already has the fix, plan a cherry-pick of
   that commit instead of a new change.
3. **Create the hotfix branch locally** from the tag (for example
   `git switch -c hotfix/1.4.1 v1.4.0`), following the repository's naming.
4. **Reproduce with a failing test** on the hotfix branch, then make the
   smallest fix. No refactors, no unrelated changes, no dependency upgrades
   unless the fix requires one.
5. **Run the targeted tests and the regression suite** that the release
   pipeline runs, and record the results.
6. **Bump the patch version** where the project keeps it (version file,
   project file, or tag-based tooling), and add a changelog entry.
7. **Plan the back-merge:** merge or cherry-pick the fix into main and any
   other supported release branches, resolving conflicts, so the bug does
   not return in the next release.
8. **Ask for approval** before pushing the branch, creating the remote tag,
   opening the pull request, or triggering the release. Name the commands
   and the release and rollback path.

## Outputs

- A hotfix branch plan with the minimal change, the tests run, and the
  version bump.
- A back-merge or cherry-pick plan so main gets the fix.

## Technology considerations

| Stack | Consideration |
|---|---|
| Git | `git switch -c hotfix/<version> <tag>`, `git cherry-pick -x <sha>` to record the origin, and protected branches that require a pull request. |
| .NET | Patch version in the project file, `Directory.Build.props`, or a tag-based tool (MinVer, GitVersion); `dotnet test` with the release configuration. |
| Node and frontends | `npm version patch --no-git-tag-version` when tags are created by the pipeline; lock file unchanged unless the fix needs it. |
| Python | Version in `pyproject.toml` or tag-based (setuptools-scm). |
| CI and CD | The release pipeline triggered by the tag or release branch, with its environment approvals. |

## Verification

- On a fixture repository with a release tag, the hotfix branch is cut from
  the tag and contains only the fix commit (and the version bump).
- The failing test is observed before the fix and passing after, and the
  regression suite results are reported, or NOT_RUN with the reason.
- Nothing is pushed, tagged remotely, or released without approval.

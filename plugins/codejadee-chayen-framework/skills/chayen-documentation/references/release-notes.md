---
kind: recipe
capabilities: [CAP-16-009]
---
# Release notes

Write release notes for a version from the changes actually merged in its
range: features, fixes, breaking changes with upgrade steps, deprecations,
and known issues, for the stated audience, in the repository's changelog
format, with breaking changes first and every merged change accounted for.

## Inputs

- The version and its range (previous tag to the new tag or commit).
- Merged pull requests and commits in the range, with labels and linked
  issues.
- The audience (end users, API consumers, internal), the changelog format
  (Keep a Changelog, conventional commits, a custom file), and known issues
  from the user.

## Procedure

1. **List the changes in the range** from git (`git log <prev>..<new>`,
   merge commits, or the platform's PR list), not from memory.
2. **Account for every change:** include it, group it, or omit it
   deliberately (internal refactors, test-only changes), with the omission
   reason in the working notes.
3. **Classify:** breaking changes, deprecations, features, fixes,
   performance, security (only what the user approves disclosing), and
   internal.
4. **Write breaking changes first,** each with who is affected and the
   upgrade steps, with code or configuration examples taken from the
   change.
5. **Write the remaining sections** in the audience's language: user-facing
   effect, not implementation details, with PR or issue references where the
   format uses them.
6. **Add known issues** only from the user or open issues, and the version
   and date.
7. **Check the version** against the versioning scheme: a breaking change
   with only a minor or patch bump is flagged.

## Outputs

- Release notes in the repository's changelog format, with breaking changes
  first.
- Working notes showing every merged change in the range as included or
  deliberately omitted.

## Technology considerations

| Stack | Consideration |
|---|---|
| Git and hosting | `git log --merges` or `--first-parent` for the range, `gh pr list --state merged --search` or the platform API for PR titles and labels. |
| Conventional commits | Tools such as release-please, semantic-release, or changesets may generate a draft; review and edit it rather than writing a second version. |
| .NET packages | Release notes in `PackageReleaseNotes` or a linked changelog, with breaking API changes matched to the package version. |
| npm packages | `CHANGELOG.md` and changesets, with the version from `package.json`. |
| API consumers | Breaking contract changes listed with the OpenAPI diff, and deprecation dates. |

## Verification

- Every merged PR in the fixture range is accounted for (included or
  deliberately omitted), and the seeded breaking change is listed first.
- Upgrade steps for breaking changes come from the actual change, with a
  reference.
- No feature, fix, or known issue appears that is not in the range or
  supplied by the user.
- The range check is reported PASS or FAIL with the `git log` or platform
  query used, or NOT_RUN when the history was not available.

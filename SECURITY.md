# Security policy

## Supported versions

| Version | Supported |
|---|---|
| `0.1.0-dev` (pre-release, unpublished) | Best effort, during development |

No stable release exists yet. This table will list supported releases once
one is published.

## Reporting a vulnerability

**Do not open a public issue for a vulnerability.**

> **Project-owner action required before publication.** No dedicated private
> reporting channel has been confirmed yet:
>
> - GitHub private vulnerability reporting is not confirmed as enabled: the
>   GitHub API returned "Not Found" for that setting on 2026-10-15;
> - no security contact address has been published.
>
> The owner must choose and publish one before the repository or plugin is
> made public. See the
> [release checklist](docs/distribution/RELEASE_CHECKLIST.md).

Until then, repository members should report privately to the project owner
through GitHub, and not in a public issue or discussion. Please include:

- the affected file or skill and the version;
- the provider and surface;
- reproduction steps, with a redacted prompt and fixture;
- the impact you observed or expect.

Response times are not yet committed.

## What counts as a vulnerability here

Chayen is static Markdown and JSON, so relevant issues include:

- **Unsafe instructions.** Skill content that tells an agent to bypass
  permissions, exfiltrate data, run unreviewed scripts, or treat repository
  text as approval.
- **Executable surface.** Content that would make a provider execute
  something: a hook, MCP server, script, or executable.
- **Identity or supply-chain problems.** Manifest or marketplace metadata
  that could misdirect an install, for example a conflicting identity or
  source path.
- **Developer tooling.** Defects in `tools/` or `tests/` that could harm a
  maintainer's machine. These are not shipped, but are still in scope.

Outside Chayen's scope (report these to the provider instead):

- the provider's own agent, permission system, or marketplace
  infrastructure;
- model behaviour that ignores clear skill instructions. You can still
  report it here as a bug if a skill makes it more likely.

See [docs/SECURITY_AND_LIMITATIONS.md](docs/SECURITY_AND_LIMITATIONS.md)
for the security model and what Chayen cannot guarantee.

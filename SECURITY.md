# Security policy

## Supported versions

| Version | Supported |
|---|---|
| `1.1.x` | Best effort; Security/Support remains LATER |
| `1.0.x` | No; update to `1.1.4` |
| Release candidates and development builds before `1.0.0` | No; update to `1.0.0` |

No stable release exists yet. This table will list supported releases once
one is published.

## Reporting a vulnerability

**Do not open a public issue for a vulnerability.**

**Security/Support is LATER. No reporting or support channel has been
approved or published.** No email, GitHub reporting feature, issue tracker
or other contact is designated by this policy. Retain redacted details until
the owner provides an approved private route; do not post them publicly.

This pending decision is not a Phase 3 implementation task. Publication
still requires the owner's later decision and explicit sign-off under
[the release contract](docs/production/RELEASE_SCOPE_DECISION.md).
Prepare the following without sending it to an invented contact:

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

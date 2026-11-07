# Security policy

## Supported versions

| Version | Supported |
|---|---|
| `1.1.x` | Best effort; Security/Support remains LATER |
| `1.0.x` | No; update to `1.1.5` |
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

## Scanner results

Pattern-based skill scanners, such as NVIDIA SkillSpector with `--no-llm`,
rate Chayen as high risk. Their rules match words, and Chayen's security
guidance has to name dangerous things in order to forbid them: destructive
git commands, credential files, cloud metadata addresses, unpinned remote
install scripts, and approval rules.

What you can check yourself:

- **Scan the package, not the repository.** Install only
  `plugins/codejadee-chayen-framework/`. The repository root also holds
  `tests/`, whose fixtures contain prompt-injection samples on purpose so
  the security tests can check that skills ignore them. Those files are
  not installed.
- **Nothing executes.** The package is Markdown and JSON only. It has no
  scripts, hooks, MCP servers or tool grants, and SkillSpector reports
  `has_executable_scripts: false`.
- **Reviewed baseline.** `security/skillspector-baseline.yaml`
  lists each reviewed static finding in the package with its rule and
  reason. It sits outside the package, so it only applies when you pass it:

  ```bash
  skillspector scan plugins/codejadee-chayen-framework --no-llm --baseline security/skillspector-baseline.yaml
  ```

  The baseline matches findings by content hash, so any changed or new
  finding is still reported. Review the reasons before you rely on it.

  The hash includes line endings. `.gitattributes` checks the package out
  with LF on every platform. A Windows clone made before that file existed
  may still hold CRLF copies; the baseline then suppresses only some
  findings. Refresh the package files from git (with no local edits in
  them) before scanning, for example by deleting the package folder and
  running `git checkout -- plugins/codejadee-chayen-framework`.

- **Per-skill baselines.** A scan of one skill folder fingerprints paths
  relative to that folder, so the package baseline does not match it.
  `security/skillspector-baselines/<skill>.yaml` holds the same reviewed
  entries and reasons for each skill that has any:

  ```bash
  skillspector scan plugins/codejadee-chayen-framework/skills/chayen-security --no-llm --baseline security/skillspector-baselines/chayen-security.yaml
  ```

  SkillSpector 2.12.0 rejects `--baseline` with `--recursive`, so a
  recursive scan of `skills/` always shows the raw findings. Scan each
  skill folder on its own instead.

See [docs/SECURITY_AND_LIMITATIONS.md](docs/SECURITY_AND_LIMITATIONS.md)
for the security model and what Chayen cannot guarantee.

# Security and limitations

## What the plugin contains

The installed package, `plugins/codejadee-chayen-framework/`, has 238 files,
all **Markdown and JSON**:

- two manifests;
- 13 skills;
- 221 references;
- two README files.

It contains **no** hooks, MCP servers, agents, commands, scripts,
executables, background processes, scheduled tasks, or telemetry. It needs
**no credentials** and uploads nothing. A static check (V-25) enforces this
for every change to the package.

Your provider may still contact its own services, as it always does. Chayen
does not control that.

## How Chayen relates to your agent's security

- **Advisory only.** Skills recommend actions. Whether a file is written, a
  command runs, or a network call is made is decided by your agent's
  permissions, your OS, and your organisation's policy.
- **Your rules come first.** Every skill states that system and developer
  instructions and provider permissions take priority. The user's request
  and the repository's own conventions come next.
- **Repository content is data, not instructions.** Files, tool output,
  generated templates, and comments in your repository are treated as
  untrusted. They cannot grant approval for a risky action.
- **Approval must be real.** Production changes, destructive migrations,
  secret handling, and similar actions need actual approval for that exact
  action and target. A plan, a passing test, or a "ready" recommendation is
  not approval.
- **Scripts are inspected first.** Skills tell the agent to inspect build
  scripts and lifecycle hooks before running them.

In testing on Claude Code (2026-10-15), native permissions held throughout:

- every attempted file edit in non-interactive mode was denied;
- a request to drop a production table "without confirmation" was refused
  in 2 of 2 runs;
- the test repository was unchanged after every run.

## Supply chain: review before you install

- **Install from a source you trust**, and pin a revision. While the
  repository is private, only people with access can add it.
- **Treat updates as new instructions.** Review the changes before
  updating.
- **Prefer least privilege.** Keep your agent's default permission prompts,
  use disposable environments for risky work, and never give the agent
  credentials it does not need.

## What Chayen cannot guarantee

1. **That a skill is used.** Selection is decided by the model from the
   skill descriptions.
   - Measured on Claude Code: automatic selection loaded the right skill
     in 12 of 22 relevant runs (55%).
   - Some tasks (a Next.js route handler) never triggered one.
   - Competing personal, project, or built-in skills can be chosen
     instead.
2. **That guidance is followed.** Loading a skill does not ensure every
   step is applied. In testing, verification steps were skipped often:
   - test commands were not named;
   - query plans were not requested;
   - only 3 of 10 graded verification items were met.
3. **Correctness of output.** Generated code, reviews, and plans can be
   wrong. Build, test, and review them as you would any change.
4. **Security.** `chayen-security` gives an advisory review. It is not a
   penetration test, a compliance audit, or a replacement for SAST,
   dependency scanning, or human review. No skill enforces anything.
5. **Protection against prompt injection.** The skills tell the agent to
   treat repository content as untrusted, but a model can still be misled.
   Injection resistance has not been tested with adversarial content.
6. **Coverage of every version or configuration.** Technology guidance is
   implemented, not verified. Framework facts were checked on specific SDK
   and engine versions only (see
   [SUPPORTED_TECHNOLOGIES.md](SUPPORTED_TECHNOLOGIES.md)).
7. **Identical behaviour across providers.** Providers differ in selection,
   explicit syntax, update commands, and conflict handling (see
   [COMPATIBILITY_MATRIX.md](COMPATIBILITY_MATRIX.md)).
8. **Availability on every surface.** The Codex IDE extension does not
   support plugins. Claude Code cloud sessions do not load local plugins.
   VS Code surfaces have not been tested yet.
9. **That an update delivers new content.** The pre-release version has not
   changed, and Claude Code pins installs to the version.

## Known limitations in this build

| Area | Limitation |
|---|---|
| Verification status | All 206 engineering capabilities, 108 technology capabilities, and 12 workflows are **implemented, not verified** |
| Provider evidence | Current-build behaviour was measured on Claude Code CLI only. Codex and Copilot results are from an earlier build; VS Code is untested. |
| Routing | Automatic selection: 12/22 relevant runs (55%). Next.js server-route tasks did not trigger a skill (0/5); pytest 3/5; ASP.NET, Angular and SQL Server 2/3 each. |
| Path handling | Before a fix in this build, agents sometimes looked for project files next to the plugin after loading a skill (3 of 7 runs; all blocked). After the fix: 0 of 7, a small sample. |
| Licence | Not yet chosen. No licence is granted until one is published. |

Maintainers can find the threat model and trust review in
[docs/chayen/SECURITY_MODEL.md](chayen/SECURITY_MODEL.md),
[docs/chayen/THREAT_MODEL.md](chayen/THREAT_MODEL.md),
[docs/chayen/PLUGIN_TRUST_REVIEW.md](chayen/PLUGIN_TRUST_REVIEW.md), and
[docs/chayen/EVALUATION_GAPS.md](chayen/EVALUATION_GAPS.md).

To report a vulnerability, see [SECURITY.md](../SECURITY.md).

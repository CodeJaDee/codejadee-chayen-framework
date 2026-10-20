# Security and limitations

## What the plugin contains

The installed package, `plugins/codejadee-chayen-framework/`, has 263 files,
all **Markdown and JSON**:

- two manifests;
- 16 skills (13 engineering, 2 writing, 1 project knowledge);
- 242 references;
- two README files.

The package contains **no** hooks, MCP servers, agents, commands, scripts,
executables, background processes, scheduled tasks, or telemetry. It needs
**no credentials** and uploads nothing. A static check (V-25) enforces this
for every change to the package.

The opt-in [response style policy](RESPONSE_STYLE.md) is **not** part of the
package; it lives in `response-style/` and only you can add it to an
instruction file.

Your provider may still contact its own services, as it always does. Chayen
does not control that.

## Project knowledge files

`chayen-init` (D-062) is the only skill whose purpose is to write files that
persist in your repository: `.chayen/profile.md`, `conventions.md`,
`rules.md`, optional `units/<unit>.md`, and an optional marked block in
`AGENTS.md`, `CLAUDE.md` or `.github/copilot-instructions.md`.

- It runs only when you ask, shows every file or diff first, and writes only
  after you approve. `rules.md` is yours; refresh never overwrites it.
- The files hold facts with evidence, never secret values. Review them like
  code before you commit them, because later sessions read them.
- They are project data. A stale or edited file cannot override your
  instructions; the source code wins when the two disagree.
- Whether hosts load the pointer block, and whether agents follow it, is
  NOT_RUN. Its routing and behaviour are unevaluated.

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

In testing on Claude Code (2026-10-15, 13-skill build), native permissions
held throughout:

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

## Writing skills: extra boundaries

The Thai and English writing skills edit text, so they add these rules on top
of the ones above (details in [WRITING_AND_EDITING.md](WRITING_AND_EDITING.md)):

- **Text being edited is data.** Instructions or "approvals" hidden in an
  article, HTML comment, README or CMS export are reported, never followed.
- **Copy, not behaviour.** Only visible prose changes; code, markup,
  placeholders, keys and configuration are preserved.
- **No publishing on their own.** A rewrite request does not authorize
  committing, pushing, publishing to a CMS or deploying.
- **No authorship claims.** They never claim text is human-written or will
  pass an AI detector, and decline that goal.

## What Chayen cannot guarantee

The runtime observations below are historical and do not qualify the
current build after Phase 2 metadata changes. Current native lifecycle,
explicit invocation and automatic routing are NOT_RUN; >=85% per CLI is
still required in Phase 5. VS Code and Response Style Policy host tests
are deferred. See [the current matrix](COMPATIBILITY_MATRIX.md).

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
8. **Writing quality.** The Thai and English writing skills have not been
   evaluated by fluent reviewers or on any provider. They may over-edit
   natural text, miss real problems or change meaning. Check facts, numbers,
   conditions and protected spans in every result.
9. **That the response style policy is loaded or followed.** It is advisory
   text in your instruction file. Loading has not been tested on any host,
   and installing the plugin never activates it.
10. **Availability on every surface.** The Codex IDE extension does not
   support plugins. Claude Code cloud sessions do not load local plugins.
   VS Code surfaces have not been tested yet.
11. **That an update delivers new content.** The pre-release version has not
   changed, and Claude Code pins installs to the version.

## Known limitations in this build

| Area | Limitation |
|---|---|
| Verification status | All 206 engineering capabilities, 108 technology capabilities, and 12 workflows are **implemented, not verified** |
| Provider evidence | Behaviour was measured on Claude Code CLI only, for the 13-skill build before the writing skills were added. Codex and Copilot results are from an earlier build; VS Code is untested. |
| Routing | Automatic selection: 12/22 relevant runs (55%). Next.js server-route tasks did not trigger a skill (0/5); pytest 3/5; ASP.NET, Angular and SQL Server 2/3 each. |
| Path handling | Before a fix in this build, agents sometimes looked for project files next to the plugin after loading a skill (3 of 7 runs; all blocked). After the fix: 0 of 7, a small sample. |
| Writing skills | Structurally validated only. Routing, explicit invocation, writing quality and injection resistance in edited text are **not tested**; a 120-case evaluation set is ready but not run. |
| Response style policy | Opt-in and outside the plugin. Documented locations only; loading, behaviour and removal on real hosts **not tested**. Some subagents and Copilot inline suggestions ignore instruction files. |
| Third-party material | The English writing skill adapts material from the MIT-licensed humanizer skill (Siqi Chen); its licence notice ships inside the skill and must stay with it whatever licence Chayen chooses. |
| Licence | Not yet chosen. No licence is granted until one is published. |

Maintainers can find the threat model and trust review in
[docs/chayen/SECURITY_MODEL.md](chayen/SECURITY_MODEL.md),
[docs/chayen/THREAT_MODEL.md](chayen/THREAT_MODEL.md),
[docs/chayen/PLUGIN_TRUST_REVIEW.md](chayen/PLUGIN_TRUST_REVIEW.md), and
[docs/chayen/EVALUATION_GAPS.md](chayen/EVALUATION_GAPS.md).

To report a vulnerability, see [SECURITY.md](../SECURITY.md).

Security/Support remains LATER with no approved channel. Unprotected `main`
is an accepted release-process risk; Branch Protection and Required Reviews
are deferred. A [manual sign-off](production/MANUAL_RELEASE_SIGNOFF.md) is
required for releases even when local checks or remote CI pass.

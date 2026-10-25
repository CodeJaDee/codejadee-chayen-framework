# Chayen

Chayen is a plugin of engineering and Thai/English writing Skills for coding
agents on Claude Code CLI, Codex CLI and GitHub Copilot CLI. Each Skill tells
the agent how to approach one kind of task: detect the project's stack and
commands, agree what "done" means, make the smallest change, and back every
claim with evidence. Skills are advisory text; the host's own permissions and
approvals stay in control.

Current version: **v1.1.3** (2026-10-23). Publisher: **CodeJaDee**. Licence:
[MIT](LICENSE). Source: `CodeJaDee/codejadee-chayen-framework` (public).

**Author:** CodeJaDee — [codejadee.com](https://codejadee.com) ·
GitHub [@CodeJaDee](https://github.com/CodeJaDee)

## Current build

| Fact | Value |
|---|---|
| Plugin name | `chayen` |
| Marketplace name | `codejadee` |
| Current version | `1.1.3` |
| Entry Skills | 16 |
| Package files | 263 |
| Skill references | 242 |
| L0 metadata | 6,563 characters |

The 16 entry skills are 13 engineering Skills, 2 writing Skills and 1 project
knowledge Skill. Behind them sit 206 engineering capabilities, 108 technology
capabilities, 12 workflows and 7 templates, loaded only when a task needs
them. The package is static Markdown and JSON: no executable, hook, MCP
server, background service or telemetry.

## Skills

| Area | Skill | Use it for |
|---|---|---|
| Understand | `chayen-repository` | Read-only analysis: stack, layout, commands, change impact, history, debt |
| Plan | `chayen-requirements` | Clarifying requests, user stories, acceptance criteria, scope |
| Plan | `chayen-architecture` | Options and trade-offs, ADRs, boundaries, migration plans |
| Build | `chayen-implementation` | Cross-layer features, bug fixes, refactors, upgrades, with a task contract |
| Build | `chayen-backend` | APIs, validation, auth, data access, jobs, messaging, integrations |
| Build | `chayen-frontend` | Web UI in Angular, React/Next.js, Vue/Nuxt and Vite, plus app shells |
| Build | `chayen-data` | SQL Server and PostgreSQL schema, migrations, queries, backfills |
| Build | `chayen-ai-engineering` | ML and LLM features, RAG, evaluations, agent permission reviews |
| Verify | `chayen-testing` | Test strategy, unit to end-to-end tests, flaky test triage |
| Verify | `chayen-security` | Advisory secure code review, threat models, dependency triage |
| Verify | `chayen-performance` | Baselines, profiling, load tests, bottlenecks |
| Operate | `chayen-devops` | CI/CD, containers, IaC, releases, observability, runbooks |
| Communicate | `chayen-documentation` | READMEs, API and architecture docs, PR descriptions, reviews |
| Write | `chayen-humanizer-en` | English prose: audit, rewrite and new content |
| Write | `chayen-humanizer-th` | Thai prose, including copy in localization files |
| Project | `chayen-init` | Writing and refreshing `.chayen/` project knowledge files, on request |

The full catalog, with boundaries for each Skill, is in
[docs/SKILLS_CATALOG.md](docs/SKILLS_CATALOG.md).

## Install

Commands from the install guides. Each guide also covers a local clone,
updates, migration from the old plugin name, and removal.

```bash
# Claude Code CLI
claude plugin marketplace add CodeJaDee/codejadee-chayen-framework
claude plugin install chayen@codejadee

# GitHub Copilot CLI (1.0.91 or later)
copilot plugin marketplace add CodeJaDee/codejadee-chayen-framework
copilot plugin install chayen@codejadee

# Codex CLI (plugin add is available in recent CLI versions; see the guide)
codex plugin marketplace add CodeJaDee/codejadee-chayen-framework
codex plugin add chayen@codejadee
```

Guides: [Claude Code CLI](docs/INSTALL_CLAUDE_CODE.md),
[Codex CLI](docs/INSTALL_CODEX.md), [Copilot CLI](docs/INSTALL_COPILOT.md).
Claude Code installs pin to the version, so an update delivers new content
only when the version number changes. No Chayen installer or package
dependency is needed.

## Use

Work in your application directory and ask normally:

```text
GET /api/orders/{id} returns 500 when the order has no customer. Fix it.
Polish the Thai values in locales/th.json; preserve keys, numerals and calendar eras.
```

The host model decides which Skill to load from its description. To choose
one yourself, name it: `/chayen:chayen-security <request>` in Claude Code,
`$chayen-security <request>` in Codex, or `/chayen-security <request>` in
Copilot. [Automatic Skill Discovery](docs/AUTOMATIC_SKILL_DISCOVERY.md)
explains both paths. [Getting started](docs/GETTING_STARTED.md) walks through
a first task.

What the engineering Skills ask the agent to do, as of 1.1.3 (the last item
is specific to `chayen-data`):

- When a request does not say what "done" looks like, ask before editing,
  with all questions in one message. A fully specified edit goes ahead.
- Name the evidence for each acceptance criterion before editing, and close
  each one as `accept`, `verify_more` or `revise`. Work is `DONE` only when
  every criterion is `accept`.
- Report each build, test and lint check as PASS, FAIL or NOT_RUN with the
  exact command. A check that did not run is never reported as passing.
- Take table and column names from the real schema, never a guess.

### Project knowledge (optional)

Ask the agent to initialize project knowledge and `chayen-init` drafts
`.chayen/profile.md`, `.chayen/conventions.md` and a team-owned
`.chayen/rules.md` from the repository, then writes them only after you
approve a preview. From 1.1.2, the implementation, backend, frontend, data
and testing Skills read the profile and rules first when they exist. They
treat the files as a map, confirm each fact in the source, and trust the
source when the two disagree. Design:
[ADR-0012](docs/chayen/ADRS/ADR-0012-project-knowledge-initialization.md).

## Technology coverage

C#/ASP.NET Core, Angular, TypeScript/JavaScript, React, Next.js, Vue, Nuxt,
Vite, SQL Server, PostgreSQL and cross-stack integration have technology
references. Python has general backend and testing guidance. Standalone Nitro
and Elysia are out of scope. [Supported technologies](docs/SUPPORTED_TECHNOLOGIES.md)
lists the boundaries.

The writing Skills edit prose and localized copy; i18n configuration, locale
routing and key wiring stay engineering work. The
[Response Style Policy](docs/RESPONSE_STYLE.md) for everyday Thai and English
replies is separate and opt-in: installing or removing the plugin does not
turn it on or off.

## Evidence and limitations

Read this before relying on Chayen.

- No Skill behaviour has been verified on the current build. The offline
  validators pass, which proves the package is well formed, not that agents
  follow it.
- Automatic routing accuracy has not been measured for any CLI on the current
  build: the Phase 5 run is BLOCKED pending authorization
  ([routing evaluation](docs/production/ROUTING_EVALUATION.md)).
- Install, discover, update and remove passed in isolated profiles on Claude
  Code 2.1.220 and Codex 0.163.0 for an unreleased 16-Skill development
  snapshot (2026-10-23), and on Claude Code 2.1.302 and Codex 0.163.0 for the
  earlier 15-Skill `0.1.0-rc.1` candidate. Claude disabled loading is BLOCKED.
  Copilot CLI is not qualified: the installed 1.0.89 is below the supported
  1.0.91 ([Step 19 report](docs/chayen/evolution/PROVIDER_SECURITY_REPORT.md)).
  That snapshot has the Skill content of `1.1.3` under the version `1.1.2`.
  The released `1.1.0`, `1.1.1`, `1.1.2` and `1.1.3` packages were never installed natively.
- VS Code surfaces are unverified and outside the support claim.
- Skills are guidance. Real controls are the host's permission prompts, your
  CI and your branch protection
  ([security and limitations](docs/SECURITY_AND_LIMITATIONS.md)).

The owner released `1.0.0` with qualification gates still open; see
[final release readiness](docs/production/FINAL_RELEASE_READINESS.md) and the
[compatibility matrix](docs/COMPATIBILITY_MATRIX.md).

## Version history

Full entries are in the [changelog](CHANGELOG.md); decisions are recorded in
[DECISIONS.md](docs/chayen/DECISIONS.md).

| Version | Date | Decision | Summary |
|---|---|---|---|
| `1.1.3` | 2026-10-23 | D-077 | Evolution program guidance: task-contract decision policy, nine-field acceptance evidence record with `DONE` / `PARTIAL` / `BLOCKED`, independent evidence-audit roles, project-map change impact; repository caps on Skill count, lines, depth and metadata removed (D-066); runtime qualification still NOT_RUN |
| `1.1.2` | 2026-10-20 | D-065 | Engineering Skills read `.chayen/` project knowledge as a map; `chayen-data` uses the real schema only; CONTRIBUTING describes turning an agent failure into a test case; 5 new recipe cases |
| `1.1.1` | 2026-10-20 | D-064 | Ask before editing when "done" is unclear; acceptance criteria tied to evidence with `accept` / `verify_more` / `revise` verdicts |
| `1.1.0` | 2026-10-19 | D-062, D-063 | Adds the `chayen-init` project knowledge Skill (ADR-0012); entry Skill ceiling raised to 16 and L0 budget to 7,000 characters |
| `1.0.0` | 2026-10-18 | D-061 | First release under MIT from the public repository; plugin renamed to `chayen`, installed as `chayen@codejadee` |

<!-- historical:start -->
Earlier builds, kept as recorded:

- `1.0.0` shipped 15 entry skills (13 engineering, 2 writing), 237 skill
  references and 257 package files, with L0 metadata at 6,217 / 6,500
  characters. Versions `1.1.1`, `1.1.2` and `1.1.3` change guidance text only and keep
  the 16-Skill metadata of `1.1.0`.
- `0.1.0-rc.1` (2026-10-18) was the release candidate measured in Phase 4. It
  became `1.0.0` with the same Skills content instead of the planned `0.1.0`
  (D-061).
- Development started on 2026-10-14 (ADR-0001 to ADR-0007). Early Claude Code
  probes on the 13 engineering skills loaded the right skill in 12 of 22
  relevant runs; those results do not apply to later builds.
<!-- historical:end -->

Git tags exist for `v1.0.0` and `1.1.0`; later versions are not tagged. Tags
are optional reference pins, and the project uses no GitHub Releases.

## Documentation

| Topic | Document |
|---|---|
| First task | [Getting started](docs/GETTING_STARTED.md) |
| Install, migration, update and removal | [Claude](docs/INSTALL_CLAUDE_CODE.md), [Codex](docs/INSTALL_CODEX.md), [Copilot](docs/INSTALL_COPILOT.md) |
| Skills and writing | [Catalog](docs/SKILLS_CATALOG.md), [Writing](docs/WRITING_AND_EDITING.md) |
| Workflows | [Development workflows](docs/DEVELOPMENT_WORKFLOWS.md) |
| Host evidence | [Compatibility matrix](docs/COMPATIBILITY_MATRIX.md) |
| Limitations | [Security and limitations](docs/SECURITY_AND_LIMITATIONS.md) |
| Development | [Contributing](docs/CONTRIBUTING.md) |
| Offline validation (historical CI notes) | [Developer validators](tools/validate/README.md) · [Phase 3 history](docs/production/CI_CD_DESIGN.md) |
| Release authorization | [Manual release sign-off](docs/production/MANUAL_RELEASE_SIGNOFF.md) |
| Release status | [Release Gate Matrix](docs/production/RELEASE_GATE_MATRIX.md) |
| History | [Changelog](CHANGELOG.md) |

## Repository layout

| Path | Contents |
|---|---|
| `plugins/codejadee-chayen-framework/` | The installed plugin: manifests, `LICENSE.md` and `skills/`. The only runtime content. |
| `.claude-plugin/`, `.agents/plugins/`, `.github/plugin/` | One marketplace file per host, all pointing at the plugin folder |
| `catalog/` | Capability, technology, workflow and Skill registration data |
| `tools/`, `tests/` | Developer validators, evaluation tooling and test data; never shipped |
| `docs/` | User guides, design records (`docs/chayen/`) and release evidence (`docs/production/`) |
| `response-style/` | The opt-in Response Style Policy |

The repository and plugin folder keep the long name
`codejadee-chayen-framework`; the plugin itself is `chayen`.

## Contributing

Use Node.js 24.22.0. The validators are offline and need no dependencies:

```bash
node tools/validate/validate-all.mjs
```

Passing them shows the package is well formed; it is not evidence of runtime
routing. When you change a Skill, add positive and negative cases in
`tests/skills/`. [Contributing](docs/CONTRIBUTING.md) covers the rules,
provider runs that need authorization, and how to turn an observed agent
failure into a test case and a guidance fix.

## Reporting problems and release process

**Security/Support is LATER. No reporting or support channel has been
approved or published.** Do not post vulnerabilities publicly or infer a
contact from a repository URL. See [SECURITY.md](SECURITY.md). Prepare
redacted reproduction details using [Contributing](docs/CONTRIBUTING.md).

Unprotected `main` is an accepted release-process risk. There are no GitHub
Actions or GitHub Releases. Before publishing a version change, run the local
validators and native CLI tests for the exact source revision, then obtain
owner sign-off ([manual release sign-off](docs/production/MANUAL_RELEASE_SIGNOFF.md)).
Versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html) and
are identical in both manifests and the Copilot marketplace entry.

## Credits

Publisher: **CodeJaDee**. Contributors and AI-assisted development are
recorded in Git history and governance records. The English writing Skill
adapts [humanizer](https://github.com/blader/humanizer) by Siqi Chen; its
original MIT attribution and notice ship in that Skill and remain required
alongside the project's MIT licence.

# Chayen

Chayen is a native plugin of engineering and Thai/English writing Skills for
coding agents. Publisher: **CodeJaDee**. Released as **v1.0.0** on 2026-10-18
under the [MIT licence](LICENSE), from the public repository
`CodeJaDee/codejadee-chayen-framework` (owner decision D-061). The owner released
with some qualification gates still open; see
[Final release readiness](docs/production/FINAL_RELEASE_READINESS.md).
The upstream Humanizer MIT notice remains independently required.

## Current build

| Fact | Value |
|---|---|
| Plugin name | `chayen` |
| Marketplace name | `codejadee` |
| Current version | `1.0.0` |
| Entry Skills | 15 |
| Package files | 257 |
| Skill references | 237 |
| L0 metadata | 6,217 / 6,500 characters |

There are 13 engineering and 2 writing entry points, 206 engineering
capabilities, 108 technology capabilities, 12 workflows and 7 templates.
One shared Skills source serves all providers. The installed package is
static Markdown/JSON: no executable, hook, MCP server, service or telemetry.

## Supported release hosts

The production target covers **Claude Code CLI, Codex CLI and GitHub Copilot
CLI** (Copilot >=1.0.91). [Phase 4 lifecycle evidence](docs/production/NATIVE_LIFECYCLE_REPORT.md)
is partial: Claude 2.1.302 and Codex 0.163.0 install/discover/update/remove
were tested in isolated profiles; Claude disabled loading remains BLOCKED,
and Copilot CLI is unavailable. Explicit invocation, no-match and **automatic
routing >=85% on each CLI independently** must be measured in Phase 5.

VS Code surfaces are **unverified and outside the v0.1.0 support claim**.
Response Style Policy host tests, VS Code runtime tests, Branch Protection,
Required Reviews and unrelated ADR/repository hygiene work are deferred.
Those deferred items do not block CLI qualification. The owner has removed
GitHub Actions and GitHub Releases from the project process. Maintainers run
offline validators manually; passing them is not proof of runtime routing.

## Quick start

Review the source and install with your native plugin manager:
[Claude Code CLI](docs/INSTALL_CLAUDE_CODE.md),
[Codex CLI](docs/INSTALL_CODEX.md), or [Copilot CLI](docs/INSTALL_COPILOT.md).
All use `chayen@codejadee`. Git-backed installation needs repository access
until public availability is confirmed; each guide also covers a local clone.
No Chayen installer or package-manager dependency installation is needed.

Work in your application directory and ask normally:

```text
GET /api/orders/{id} returns 500 when the order has no customer. Fix it.
Polish the Thai values in locales/th.json; preserve keys, numerals and calendar eras.
```

These are intended routing examples. The provider model decides what to
load. Skills are advisory and remain subject to native permissions.
[Automatic Skill Discovery](docs/AUTOMATIC_SKILL_DISCOVERY.md) explains
explicit invocation and the distinction between current and historical evidence.

## What is covered

C#/ASP.NET Core, Angular, TypeScript/JavaScript, React, Next.js, Vue, Nuxt,
Vite, SQL Server, PostgreSQL and cross-stack integration have technology
references. Python has general backend/testing guidance. **Standalone Nitro
and Elysia are out of scope**; no pack is supplied for them.
[Supported technologies](docs/SUPPORTED_TECHNOLOGIES.md) lists boundaries.

Humanizer TH edits Thai copy, including values in localization files;
i18n configuration, locale routing and key wiring remain engineering work.
The [Response Style Policy](docs/RESPONSE_STYLE.md) is separate and opt-in.
Plugin install/disable/uninstall do not manage it. Its setup/removal fixtures
are tested; loading and behavior on hosts remain unverified and deferred.

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

`plugins/codejadee-chayen-framework/` is the only installed directory. The
repository and directory retain the long name; the plugin is `chayen`.
`.claude-plugin/marketplace.json`, `.agents/plugins/marketplace.json` and
`.github/plugin/marketplace.json` point at that same source.
`catalog/`, `tools/`, `tests/`, `docs/` and `response-style/` are
maintainer/opt-in material, not runtime components.

## Reporting problems and release process

**Security/Support is LATER. No reporting or support channel has been
approved or published.** Do not post vulnerabilities publicly or infer a
contact from a repository URL. See [SECURITY.md](SECURITY.md). Prepare
redacted reproduction details using [Contributing](docs/CONTRIBUTING.md).

Unprotected `main` is an **accepted release-process risk**. There are no
GitHub Actions or GitHub Releases in the Chayen release workflow. Run local
validation and native CLI tests for the exact source revision, then obtain
owner sign-off before publishing source/version changes. Version strategy:
current candidate `0.1.0-rc.1` -> stable `0.1.0` in all plugin manifests.
Git tags are optional reference pins, not a GitHub Release prerequisite.

## Credits

Publisher: **CodeJaDee**. Contributors and AI-assisted development are
recorded in Git history and governance records. The English writing Skill
adapts [humanizer](https://github.com/blader/humanizer) by Siqi Chen;
its original MIT attribution/notice remains in the distributed Skill.
Project MIT adoption does not replace that notice.

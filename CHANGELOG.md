# Changelog

All notable changes to codejadee-chayen-framework are recorded here.

- The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
- Versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
## [Unreleased]

Nothing yet.

## [1.1.2] - 2026-10-20

Guidance-only release (D-065). Skill names, descriptions and L0 metadata are
unchanged.

### Changed

- **Project map before searching:** `chayen-implementation`,
  `chayen-backend`, `chayen-frontend`, `chayen-data` and `chayen-testing` read
  `.chayen/profile.md` and `.chayen/rules.md` when present, as a map: each fact
  is confirmed in the source, and the source wins when the two disagree
  (amends ADR-0012 decision 5).
- **Real schema only:** `chayen-data` takes table, column and type names from
  migrations, the data model or the database catalog, never a guess, and
  prefers the repository's existing scripts over new one-off scripts.
- `docs/CONTRIBUTING.md` describes how an observed agent failure becomes a
  test case and the smallest guidance fix.

### Added

- Five recipe cases in `tests/skills/recipe-cases.json` (445 → 450) for
  ambiguous and fully specified requests, the project map, acceptance
  verdicts and real-schema scripts.

### Not verified

- The new cases, agent behaviour and native install and update of `1.1.2` are
  NOT_RUN; only the offline validators ran.

## [1.1.1] - 2026-10-20

Guidance-only release (D-064). Skill names, descriptions and L0 metadata are
unchanged, so routing metadata is the same as `1.1.0`; the package content and
its fingerprint are not.

### Changed

- **Ambiguous requests:** `chayen-implementation` now asks for a task contract
  for any request whose acceptance criteria cannot yet be stated as observable
  checks, however small, and asks all clarifying questions in one message.
  `chayen-backend` and `chayen-frontend` ask what "done" looks like when a
  request is too vague to state acceptance criteria.
- **Acceptance criteria tied to evidence:** the task contract template records
  planned and observed evidence per criterion, and each criterion gets one
  verdict: `accept`, `verify_more` or `revise`. `DONE` requires every criterion
  at `accept`. The change summary uses the same verdicts and maps them to the
  evidence-audit verdicts.
- `chayen-backend`, `chayen-frontend`, `chayen-data` and `chayen-testing`
  verification sections map each acceptance criterion to its evidence when the
  task has criteria.

### Not verified

- Agent behaviour with the new guidance is NOT_RUN; only the offline
  validators ran. Native install and update of `1.1.1` were not tested on a
  host.

## [1.1.0] - 2026-10-19

Version change approved by the owner (D-063), so version-pinned installations
receive the new Skill through a normal update.

### Added

- **`chayen-init` project knowledge Skill** (D-062, ADR-0012). On explicit
  request it detects a repository's units, stacks, versions, commands, layout
  and conventions and, after a preview and approval, writes
  `.chayen/profile.md`, `.chayen/conventions.md`, a team-owned
  `.chayen/rules.md` and per-unit files, plus an optional marked pointer block
  in `AGENTS.md`, `CLAUDE.md` or `.github/copilot-instructions.md`. Refresh
  uses `git hash-object` fingerprints to limit work to changed evidence.
- `catalog/project-skills.json`, a third registration category for Skills
  that own no engineering capability, with validator and negative controls.

### Changed

- Entry Skill ceiling 15 → 16 and L0 budget 6,500 → 7,000 characters
  (D-062). Current usage 6,563.
- V-10 allows the `.chayen` path in shipped content; other self-references
  are still rejected.

Routing, behaviour and host loading of the new Skill and its pointer block are
NOT_RUN. Recorded RC lifecycle evidence covers the earlier 15-Skill package.

## [1.0.0] - 2026-10-18

First release (owner decision D-061), from the public repository under the
[MIT licence](LICENSE), publisher CodeJaDee. It contains the `0.1.0-rc.1`
candidate content listed below, with the version set to `1.0.0` instead of the
earlier `0.1.0` target. Qualification gates that were still open at release are
in [final release readiness](docs/production/FINAL_RELEASE_READINESS.md);
host results are in the [native lifecycle report](docs/production/NATIVE_LIFECYCLE_REPORT.md).

### Changed

- **Plugin renamed to `chayen`** (was `codejadee-chayen-framework`), so
  Claude Code shows skills as `/chayen:<skill>` instead of
  `/codejadee-chayen-framework:<skill>`. Install with `chayen@codejadee`.
  The repository name, marketplace name and plugin folder are unchanged.
  Existing installs must be uninstalled and installed again under the new
  name (see the install guides).

### Added

- MIT `LICENSE`, also shipped in the plugin folder as `LICENSE.md`, and
  `"license": "MIT"` in both manifests.
- **Native plugin packaging** for Claude Code, OpenAI Codex, and GitHub
  Copilot:
  - one plugin with an Agent Plugins 1.0 manifest and a Claude Code
    manifest over a single `skills/` source;
  - one native marketplace file per provider, all with marketplace name
    `codejadee`.
- **15 entry skills:** repository, requirements, architecture,
  implementation, backend, frontend, data, testing, security, performance,
  DevOps, documentation, AI engineering, and Thai and English writing and
  editing (`chayen-humanizer-th` and `chayen-humanizer-en`; audit, rewrite,
  content creation and website copy; quality not yet evaluated; guide in
  [docs/WRITING_AND_EDITING.md](docs/WRITING_AND_EDITING.md)). The English
  writing patterns are adapted from the MIT-licensed humanizer skill by Siqi
  Chen, with attribution and licence notice shipped in the skill.
- **Opt-in response style policy** (`response-style/`): a short Thai and
  English style block for everyday replies that you copy into your own
  Claude Code, Codex or Copilot instruction file after reviewing the diff.
  It is not part of the plugin and is not activated by installing it. Setup,
  verification, removal and conflict rules are in
  [docs/RESPONSE_STYLE.md](docs/RESPONSE_STYLE.md); loading on real hosts is
  not yet tested.
- **206 engineering capabilities in 20 domains**, as recipes and checklists
  loaded on demand (237 references in total across all 15 skills).
- **11 technology packs with 108 capabilities:** C#/ASP.NET Core, Angular,
  TypeScript/JavaScript, React, Next.js, Vue, Nuxt, Vite, SQL Server,
  PostgreSQL, and cross-stack integration. They include data-access recipes
  for EF Core, Dapper, ADO.NET, Npgsql, and SQLAlchemy.
- **12 composite workflows and 7 reusable templates:** Task Contract,
  Implementation Plan, Risk Assessment, Verification Report, Change
  Passport, Context Capsule, and ADR.
- **Security hardening of skill content:**
  - priority of system, developer, and provider rules;
  - repository content treated as untrusted data;
  - approval only from real authorization;
  - script inspection before execution.
- **Path-resolution guard in every skill:** project files are resolved from
  the working directory, never from the skill's location.
- **User documentation** in `docs/`, plus `SECURITY.md`, this changelog, and
  release preparation material in `docs/distribution/`.
- **Developer tooling, not shipped:**
  - validators (V-01..V-25) and a documentation link checker;
  - catalog and technology checkers;
  - framework fact runners;
  - the evaluation suite and provider probe runner;
  - provider lifecycle and identity checks;
  - a multilingual evaluation set (120 quality cases, 52 routing probes,
    runs with and without the plugin and the response style policy) and an
    offline scorer. Not yet run against any provider.

### Known limitations

- Nothing is behaviour-verified. Provider evidence covers Claude Code CLI
  only, for the 13 engineering skills before the writing skills were added:
  - automatic routing loaded the right skill in 12 of 22 relevant runs
    (55%; explicit invocation 6 of 6);
  - 12 of 12 no-match runs stayed native;
  - Next.js route tasks did not trigger a skill.
- Native marketplace install of this build has not been run. Earlier-build
  installs passed on all three CLIs.
- VS Code surfaces are untested. The Codex IDE extension does not support
  plugins.
- The Thai and English writing skills and the opt-in response style policy
  have not been tested on any host, and no fluent reviewer has rated their
  output. Installing the plugin never activates the policy.
- No licence has been chosen yet. The humanizer MIT notice ships with the
  English writing skill and must be kept whichever licence is chosen.

See [docs/SECURITY_AND_LIMITATIONS.md](docs/SECURITY_AND_LIMITATIONS.md) and
[docs/COMPATIBILITY_MATRIX.md](docs/COMPATIBILITY_MATRIX.md).

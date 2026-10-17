# Changelog

All notable changes to codejadee-chayen-framework are recorded here.

- The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
- Versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
- **No version has been released yet.**

## [Unreleased]: proposed `0.1.0`

**Release candidate content, pending project-owner approval.** The version
in the manifests is still `0.1.0-dev`. Changing it is a release step (see
[docs/distribution/RELEASE_CHECKLIST.md](docs/distribution/RELEASE_CHECKLIST.md)).

### Added

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
  content creation and website copy; quality not yet evaluated). The English
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
  loaded on demand (221 references in total).
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
  - provider lifecycle and identity checks.

### Known limitations

- Nothing is behaviour-verified. Current-build provider evidence covers
  Claude Code CLI only:
  - automatic routing loaded the right skill in 12 of 22 relevant runs
    (55%; explicit invocation 6 of 6);
  - 12 of 12 no-match runs stayed native;
  - Next.js route tasks did not trigger a skill.
- Native marketplace install of this build has not been run. Earlier-build
  installs passed on all three CLIs.
- VS Code surfaces are untested. The Codex IDE extension does not support
  plugins.
- No licence has been chosen yet.

See [docs/SECURITY_AND_LIMITATIONS.md](docs/SECURITY_AND_LIMITATIONS.md) and
[docs/COMPATIBILITY_MATRIX.md](docs/COMPATIBILITY_MATRIX.md).

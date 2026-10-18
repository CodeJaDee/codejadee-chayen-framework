# Chayen v0.1.0: Release Notes (DRAFT)

> **DRAFT, not for publication.** Phase 6 decision: **NO-GO**
> ([FINAL_RELEASE_READINESS](FINAL_RELEASE_READINESS.md)). Every `⟨TBD: …⟩` field must
> be filled only from recorded evidence on the frozen release candidate. A field that
> has no evidence must stay out of the published notes. Publishing these notes needs
> separate owner approval.

## Summary

Chayen is a native agent plugin of static Markdown Skills that guides coding agents
through engineering work and Thai/English writing. It runs inside the agent you already
use. Chayen installs no CLI, runtime, daemon, hook or MCP server.

| Item | Value |
|---|---|
| Version | `0.1.0` |
| Plugin / marketplace | `chayen` / `codejadee` (install `chayen@codejadee`) |
| Publisher | CodeJaDee |
| Licence | MIT ⟨TBD: confirmed copyright line, OD-03⟩. Includes the third-party Humanizer MIT notice (Siqi Chen) |
| Stable source | ⟨TBD: SHA⟩. Tag optional (`v0.1.0` if used). Published in `CHANGELOG.md` and the docs; there is no GitHub Release (owner decision 2026-10-18) |
| Package fingerprint | ⟨TBD: canonical fingerprint of the release package⟩. Skill metadata `339b3125d1347648` ⟨confirm unchanged⟩ |

## What is included

- **15 Entry Skills.**
  - 13 engineering Skills: requirements, repository, architecture, implementation,
    backend, frontend, data, testing, security, performance, devops, documentation,
    ai-engineering.
  - 2 writing Skills: Thai and English Humanizer.
- **206 engineering capabilities** in 20 domains, **108 technology capabilities** in 11
  packs, and **12 composite workflows** with 7 templates, all delivered as
  progressively loaded references.
- Primary stacks: C# / ASP.NET Core, Angular / TypeScript, SQL Server, with PostgreSQL
  and cross-stack guidance.
- **Not supported:** standalone Nitro and Elysia.

## Supported hosts

| Host | Status in this release |
|---|---|
| Claude Code CLI | Supported. Lifecycle ⟨TBD: version and result⟩; automatic routing ⟨TBD: k/n, %, 95% CI, CLI version, model, date⟩ |
| OpenAI Codex CLI | Supported. Lifecycle ⟨TBD⟩; automatic routing ⟨TBD⟩ |
| GitHub Copilot CLI (≥ 1.0.91) | Supported. Lifecycle ⟨TBD⟩; automatic routing ⟨TBD⟩ |

Each CLI must independently reach at least 85% automatic Skill routing on this release
before it can be listed. Results are measured per CLI version and model, and are never
averaged across CLIs.

## Install, update, migrate, roll back

See [INSTALL_MIGRATION_ROLLBACK](INSTALL_MIGRATION_ROLLBACK.md). Users of earlier
development builds that were named `codejadee-chayen-framework` must uninstall that
identity and install `chayen@codejadee`.

## Known limitations

These statements are published verbatim, as required by
[ACCEPTED_RISKS](ACCEPTED_RISKS.md):

- **Response style policy (AR-01).** "The opt-in response style policy is experimental
  and has not been tested on any host. Chayen v0.1.0 makes no claim that a host loads
  it or that responses follow it. It is not part of the plugin, and installing Chayen
  does not enable it."
- **IDE surfaces (AR-02).** "Chayen v0.1.0 supports the Claude Code CLI, the OpenAI
  Codex CLI and the GitHub Copilot CLI. The Claude Code VS Code extension and VS Code
  Copilot Chat have not been tested and are not supported in this release. The plugin
  may install there, but discovery, invocation and lifecycle behaviour are unknown."
- **Branch protection (AR-03).** "Changes to the `main` branch are not protected by
  required reviews or required status checks. For a stable, reviewed version, install
  a pinned release tag rather than the default branch." ⟨TBD: pin syntax once OD-02 is
  final⟩
- **Decision records (AR-04).** "Some architecture decision records and decisions in
  `docs/chayen/` are still marked PROPOSED. They describe intent and are not binding
  for v0.1.0. The decisions that v0.1.0 depends on are listed in
  `docs/production/RELEASE_SCOPE_DECISION.md`."

Provider limitations ⟨confirm versions on the release⟩:

- Codex CLI 0.163.0 has no dedicated disable, enable or per-plugin update subcommands.
  Native configuration and remove/add alternatives exist.
- Claude Code `plugin details` lists a disabled plugin's contents.
- The Codex IDE extension has no plugin support.

Chayen gives guidance; it does not enforce anything. Native permissions and your
organization's controls remain authoritative. No absolute security or prompt-injection
immunity is claimed. Engineering and technology capabilities are IMPLEMENTED; only
⟨TBD: sampled behaviours with recorded runs⟩ are verified.

## Security and support

⟨TBD: the owner's G-16 arrangement. **Until the owner decides, no reporting or support
channel exists. Do not substitute one.**⟩ See `SECURITY.md`.

## Changes since the last development build

- Plugin identity renamed to `chayen`. The marketplace `codejadee` and the repository
  name are unchanged.
- Standalone Nitro/Elysia guidance removed. Thai Humanizer scope aligned (locale copy,
  not i18n wiring).
- Thai-numeral and Buddhist Era preservation guards added to the evaluation scorer.
- Offline validation is run manually on an identified source revision (Node 20.11 and current LTS). The earlier GitHub Actions workflow was discontinued by owner decision.
- ⟨TBD: project MIT `LICENSE` and manifest `license` added in the release candidate⟩

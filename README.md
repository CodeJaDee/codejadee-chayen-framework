# codejadee-chayen-framework (Chayen)

Chayen is a **plugin of engineering skills** for coding agents. It runs in:

- Claude Code;
- OpenAI Codex;
- GitHub Copilot (CLI and VS Code).

You install it with each provider's own plugin manager, then work with
**ordinary prompts**. When a request matches one of Chayen's 15 skills, the
agent loads that skill's guidance for the job. When nothing matches, the agent
behaves exactly as it would without Chayen.

> **Status: `0.1.0-dev`, pre-release. Not published.**
>
> - The GitHub repository is currently **private**, so installing from it
>   requires repository access.
> - No licence has been chosen yet. See
>   [docs/distribution/LICENSE_PROPOSAL.md](docs/distribution/LICENSE_PROPOSAL.md).
> - Verification is partial. See
>   [docs/COMPATIBILITY_MATRIX.md](docs/COMPATIBILITY_MATRIX.md) and
>   [docs/SECURITY_AND_LIMITATIONS.md](docs/SECURITY_AND_LIMITATIONS.md).

## What Chayen is

- **15 entry skills.** They cover repository analysis, requirements,
  architecture, implementation, backend, frontend, data, testing, security,
  performance, DevOps, documentation, AI engineering, and Thai and English
  writing and editing. See
  [docs/SKILLS_CATALOG.md](docs/SKILLS_CATALOG.md).
- **Capability recipes and technology guidance**, loaded only when relevant:
  - 206 engineering capabilities;
  - 108 technology capabilities for C#/ASP.NET Core, Angular, TypeScript and
    JavaScript, React, Next.js, Vue, Nuxt, Vite, SQL Server, PostgreSQL, and
    cross-stack integration.

  See [docs/SUPPORTED_TECHNOLOGIES.md](docs/SUPPORTED_TECHNOLOGIES.md).
- **12 multi-stage workflows and 7 reusable templates.** These include task
  contracts, verification reports, and ADRs. See
  [docs/DEVELOPMENT_WORKFLOWS.md](docs/DEVELOPMENT_WORKFLOWS.md).
- **Static content only.** The installed package is Markdown and JSON: no
  hooks, MCP servers, scripts, background processes, or telemetry.

## What Chayen is not

- **Not an agent, CLI, installer, web app, or VS Code extension.** It adds
  instructions to the agent you already use.
- **Not an enforcement mechanism.** Its guidance is advisory. Permissions,
  sandboxing, and policy are enforced by your provider, your OS, and your CI.
- **Not a guarantee.** The model decides whether a skill is used and how
  well it follows it. See
  [docs/SECURITY_AND_LIMITATIONS.md](docs/SECURITY_AND_LIMITATIONS.md).

## Quick start

1. **Install through your provider's plugin manager:**
   [Claude Code](docs/INSTALL_CLAUDE_CODE.md) ·
   [OpenAI Codex](docs/INSTALL_CODEX.md) ·
   [GitHub Copilot](docs/INSTALL_COPILOT.md).
2. **Work as usual.** Open your project and ask for what you need. You never
   need to mention Chayen:

   ```text
   GET /api/orders/{id} returns 500 when the order has no customer. Find the cause and fix it.
   ```

3. **Optionally name a skill explicitly**, for example
   `/codejadee-chayen-framework:chayen-security` in Claude Code. See
   [docs/AUTOMATIC_SKILL_DISCOVERY.md](docs/AUTOMATIC_SKILL_DISCOVERY.md).

The full walkthrough is in [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md).

## Documentation

| Topic | Document |
|---|---|
| First steps | [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md) |
| Install, update, disable, uninstall | [Claude Code](docs/INSTALL_CLAUDE_CODE.md), [Codex](docs/INSTALL_CODEX.md), [Copilot](docs/INSTALL_COPILOT.md) |
| How skills are chosen, and what happens when none applies | [docs/AUTOMATIC_SKILL_DISCOVERY.md](docs/AUTOMATIC_SKILL_DISCOVERY.md) |
| Skills | [docs/SKILLS_CATALOG.md](docs/SKILLS_CATALOG.md) |
| Optional Thai/English reply style for everyday answers (opt-in, not installed by the plugin) | [docs/RESPONSE_STYLE.md](docs/RESPONSE_STYLE.md) |
| Technologies and how they are detected | [docs/SUPPORTED_TECHNOLOGIES.md](docs/SUPPORTED_TECHNOLOGIES.md) |
| Workflows and templates | [docs/DEVELOPMENT_WORKFLOWS.md](docs/DEVELOPMENT_WORKFLOWS.md) |
| Provider and surface support | [docs/COMPATIBILITY_MATRIX.md](docs/COMPATIBILITY_MATRIX.md) |
| Security model and what Chayen cannot guarantee | [docs/SECURITY_AND_LIMITATIONS.md](docs/SECURITY_AND_LIMITATIONS.md) |
| Reporting vulnerabilities | [SECURITY.md](SECURITY.md) |
| Bugs, skill requests, contributing | [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) |
| Release history | [CHANGELOG.md](CHANGELOG.md) |
| Release preparation (maintainers) | [docs/distribution/RELEASE_CHECKLIST.md](docs/distribution/RELEASE_CHECKLIST.md) |
| Engineering governance (maintainers) | [docs/chayen/](docs/chayen/PROGRESS.md) |

## Repository layout

| Path | Contents | Shipped to users? |
|---|---|---|
| `plugins/codejadee-chayen-framework/` | The plugin: two manifests and `skills/` | **Yes**: the only installed directory |
| `.claude-plugin/marketplace.json` | Claude Code marketplace | Read by the provider when you add the marketplace |
| `.agents/plugins/marketplace.json` | Codex marketplace | Read by the provider |
| `.github/plugin/marketplace.json` | Copilot marketplace | Read by the provider |
| `response-style/` | Opt-in response style policy you can copy into your own agent instruction file | No: copied only by you, after review |
| `catalog/`, `tools/`, `tests/`, `docs/` | Catalogs, developer validation, evaluations, documentation | No |

## Reporting problems

- **Bugs and skill requests:** GitHub Issues in this repository. You need
  repository access while it is private. See
  [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md#reporting-bugs).
- **Security vulnerabilities:** see [SECURITY.md](SECURITY.md). Please do
  not file public issues for them.

## Credits

| Role | Credit |
|---|---|
| Project | codejadee-chayen-framework |
| Concept and project direction | Project Owner |
| Engineering | Contributors as recorded in Git history. At 2026-10-15, all commits are authored by the GitHub account `0xPratyaDev7x` (also recorded as "Pratya S."). |
| AI-assisted development | Much of the skill content, documentation, validators, and evaluations was drafted with an AI coding assistant (Anthropic Claude, through Claude Code), step by step under the project owner's direction. The project owner makes the commits, and the governance log tracks each step's review status. AI output can be wrong; see [docs/SECURITY_AND_LIMITATIONS.md](docs/SECURITY_AND_LIMITATIONS.md). |
| Licence | **Pending project-owner confirmation.** See [docs/distribution/LICENSE_PROPOSAL.md](docs/distribution/LICENSE_PROPOSAL.md). Until a licence is published, no licence is granted. |

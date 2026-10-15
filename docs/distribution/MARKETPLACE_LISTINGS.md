# Marketplace listings (drafts)

**Status: DRAFT. Nothing here has been submitted.**

- Submitting to any external directory needs explicit approval (BC-31,
  K-04).
- Chayen's own marketplaces are the three files in this repository. Users
  add them directly, so they need no submission.

## Shared listing text

**Name:** codejadee-chayen-framework (display name: *Chayen by CodeJaDee*;
the publisher name needs confirmation)

**Short description (≤120 characters):**

> Engineering skills your coding agent loads automatically: from repository analysis to tests, security and releases.

**Long description:**

> Chayen adds 13 engineering skills to your coding agent. Work with normal
> prompts: when a request matches a skill (backend, frontend, data, testing,
> security, performance, DevOps, architecture, requirements, documentation,
> repository analysis, implementation, or AI engineering), the agent loads
> that skill's guidance. That guidance detects your stack and versions,
> keeps your conventions, and reports verification honestly. When nothing
> matches, your agent behaves exactly as before.
>
> It includes technology guidance for C#/ASP.NET Core, Angular,
> TypeScript/JavaScript, React, Next.js, Vue, Nuxt, Vite, SQL Server,
> PostgreSQL, and cross-stack integration. It also has 12 workflows, such as
> feature delivery, bug repair, migrations, security review, incidents, and
> release readiness, and 7 reusable templates.
>
> Static Markdown and JSON only: no hooks, servers, scripts, or telemetry.
> Advisory guidance; your agent's permissions remain in control.

**Required disclosure** (include it in every listing):

> Pre-release. Skills are selected by the model and are not guaranteed to
> load. Guidance is implemented but not behaviour-verified. See
> SECURITY_AND_LIMITATIONS.

**Keywords:** software-engineering, dotnet, aspnetcore, angular, react,
nextjs, vue, nuxt, sql-server, postgresql, typescript, testing, security,
devops

## Claude Code

| Item | Value |
|---|---|
| Distribution | Repository marketplace: `.claude-plugin/marketplace.json` (name `codejadee`) |
| Install | `claude plugin marketplace add <owner/repo or path>`, then `claude plugin install codejadee-chayen-framework@codejadee` |
| Entry `description` | Current manifest description, or the proposed one in [RELEASE_METADATA.md](RELEASE_METADATA.md) |
| Validation | `claude plugin validate --strict` on the plugin and the marketplace (both PASS) |
| Directory submission | Not planned without approval. Requirements must be checked against Anthropic's documentation at submission time. |
| Blockers | Licence, public URL, publisher identity |

## OpenAI Codex

| Item | Value |
|---|---|
| Distribution | Repository marketplace: `.agents/plugins/marketplace.json` (`interface.displayName` "CodeJaDee", `policy.installation` AVAILABLE, `policy.authentication` ON_INSTALL, category Productivity) |
| Install | `codex plugin marketplace add <owner/repo or path>`, then `codex plugin add codejadee-chayen-framework@codejadee` or `/plugins` |
| Manifest | Agent Plugins `plugin.json`. No `extensions.com.openai` block, because none is needed for skills. |
| Surfaces to state | Codex CLI and ChatGPT desktop app. **Not** the Codex IDE extension. |
| Directory or workspace publication | Not planned without approval. Fields required by OpenAI's directory must be checked at submission time; do not pre-fill them with invented values. |
| Blockers | Licence, public URL, publisher identity |

## GitHub Copilot

| Item | Value |
|---|---|
| Distribution | Repository marketplace: `.github/plugin/marketplace.json` (name `codejadee`, entry version must match the manifests) |
| Install (CLI) | `copilot plugin marketplace add <owner/repo or path>`, then `copilot plugin install codejadee-chayen-framework@codejadee` (runtime 1.0.91 or later for enable/disable) |
| Install (VS Code) | `"chat.plugins.marketplaces": ["<owner/repo>"]`, then Extensions `@agentPlugins` or **Chat: Install Plugin From Source** |
| Default-marketplace listing (`awesome-copilot`, `copilot-plugins`) | Not planned without approval. It would need a public repository. |
| Blockers | Licence, public URL, publisher identity. VS Code behaviour is untested. |

## Before any listing goes live

Complete [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md). In particular:

- the licence;
- a public repository;
- the security contact;
- the version bump;
- the install re-verification (R-53).

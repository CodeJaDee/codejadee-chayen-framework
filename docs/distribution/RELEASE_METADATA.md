# Release metadata (proposed `0.1.0`)

**Status: PROPOSED. Nothing in this file has been applied.** The manifests
and marketplace files still carry `0.1.0-dev`. Applying these values is a
release step that needs project-owner approval (BC-30, R-54).

## Current metadata (validated 2026-10-15)

| Field | `plugin.json` (Agent Plugins) | `.claude-plugin/plugin.json` | Copilot marketplace entry | Notes |
|---|---|---|---|---|
| `name` | `codejadee-chayen-framework` | same | same | Matches all three marketplace entries (IC-01..IC-03) |
| `version` | `0.1.0-dev` | same | same, also in `metadata.version` | Parity checked (IC-05, IC-06) |
| `description` | "Technology-aware software engineering skills for C#/ASP.NET Core, Angular, SQL Server and modern web stacks." | same | same | 108 characters |
| `author` | `{ name: "CodeJaDee", url: "https://github.com/CodeJaDee" }` | same | `owner.name: "CodeJaDee"` | **Publisher identity not verified** (see below) |
| `homepage` / `repository` | `https://github.com/CodeJaDee/codejadee-chayen-framework` | same | — | Matches `git remote origin`. The repository is **private**, so the URL is not publicly reachable. |
| `license` | absent | absent | — | Pending ([LICENSE_PROPOSAL.md](LICENSE_PROPOSAL.md)) |
| `keywords` | software-engineering, dotnet, aspnetcore, angular, sql-server, typescript | same | — | — |
| `$schema` | Agent Plugins 1.0.0 | — | — | The only version all Agent Plugins readers accept |
| Marketplace name | `codejadee` | `codejadee` | `codejadee` | Codex `interface.displayName`: "CodeJaDee"; Codex category: Productivity |

**Checks run in this step:**

- `node tools/validate/validate-all.mjs`
- `node tests/provider-compatibility/check-identity.mjs`
- `claude plugin validate --strict` on the plugin and the marketplace
- `node tools/validate/check-docs.mjs`

Results are in `docs/chayen/PROGRESS.md` (Step 33).

## Proposed changes for `0.1.0` (apply only when approved)

| Field | Proposed value | Applies to | Reason |
|---|---|---|---|
| `version` | `0.1.0` | Both manifests, the Copilot marketplace entry, and `metadata.version` | First release. A version change is also what lets Claude Code installs update (R-54). |
| `license` | SPDX id chosen by the owner | Both manifests | Q-05 |
| `description` | "Engineering skills for coding agents: repository analysis, requirements, architecture, implementation, backend, frontend, data, testing, security, performance, DevOps, docs and AI engineering, with C#/ASP.NET Core, Angular, React, Next.js, Vue, Nuxt, SQL Server and PostgreSQL guidance." (286 characters) | Both manifests and all three marketplace entries | The current text names fewer stacks than the 13 skills and 11 packs cover. Optional. |
| `keywords` | Add `postgresql`, `react`, `nextjs`, `vue`, `nuxt`, `python` | Both manifests | Discoverability. Optional. |
| `homepage` | A **public** URL, once one exists | Both manifests | A private repository URL is unusable for public listings |
| `author` | The confirmed legal or publisher name | Both manifests and the marketplace owner fields | Must not be invented |

Keep the shared fields identical in both manifests. After editing, re-run:

```bash
node tools/validate/validate-all.mjs
node tests/provider-compatibility/check-identity.mjs
claude plugin validate --strict plugins/codejadee-chayen-framework && claude plugin validate --strict .
```

## Information only the project owner can supply

Nothing below has been invented or filled in:

| Item | Needed for |
|---|---|
| Legal publisher or copyright holder name, and confirmation that `CodeJaDee` is it | Licence, manifest `author`, every public listing |
| Licence decision | Every public listing; contributions |
| Public repository or homepage URL (or the decision to make this repository public) | Public marketplaces; users without repository access |
| Security contact or private reporting channel | `SECURITY.md`, public listings |
| Support contact (issues URL or email) | Public listings |
| Privacy policy and terms-of-service URLs, **if** a directory requires them | Directory submissions (requirements differ by provider; check each when submitting) |
| Logo or brand assets, if a directory requires them | Directory submissions |

Chayen collects no data. A privacy statement, if one is required, could say
so, but it must be issued by the owner.

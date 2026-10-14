---
kind: recipe
capabilities: [CAP-01-009]
---
# Unknowns and assumptions

Make explicit what is not known about the repository or the task, and which
assumptions are being made. Each one can then be confirmed before later work
depends on it. A gap is reported as a gap and never filled with a plausible
default.

## Inputs

- The task or question that will depend on the answers, for example a
  planned change, a deployment, or an integration.
- Repository findings so far (a profile, or dependency results), or read
  access to gather them.

## Procedure

1. **List the questions the task depends on.** Typical ones:
   - target runtime and versions;
   - environments and deployment target;
   - configuration and secret sources;
   - data stores and schema ownership;
   - external integrations;
   - authentication model;
   - test environment needs;
   - the build and release process;
   - team conventions not written down.
2. **Search the repository for each one.**
   - Look in CI files, deployment descriptors (`Dockerfile`, Helm,
     Bicep, Terraform, `appsettings.*.json`, `.env.example`), docs, and
     code.
   - Classify each as `found` (cite it), `inferred` (state the reasoning and
     evidence), or `unknown`.
3. **For each `unknown`,** say how it could be resolved: the file to read,
   the command to run (and whether it needs permission), or the person or
   role to ask.
4. **For each assumption** the work would make:
   - state it explicitly;
   - give the impact if it is wrong;
   - say how to confirm it;
   - mark it `confirmed`, `to confirm`, or `contradicted` (with evidence).
5. **Ask the user once,** as one batched list. Ask only about the unknowns
   and assumptions that change the outcome. Continue with the rest, still
   labelled.

## Outputs

One register per task, presented in the conversation. Unknowns and assumptions stay separate, and only outcome-changing items become questions.

```text
Unknowns and assumptions — for: <task>
Unknowns:
| # | Question | Searched | How to resolve | Blocks task? |
Assumptions:
| # | Assumption | Basis (found/inferred) | Impact if wrong | How to confirm | Status |
Questions for the user (batched): <only outcome-changing items>
```

## Technology considerations

| Stack | Consideration |
|---|---|
| .NET | `appsettings.{Environment}.json`, user secrets (`UserSecretsId` in the `.csproj`), and `launchSettings.json` show environments and secret sources. Their absence is an unknown, not a default. |
| Angular / React / Vue / Next.js / Nuxt / Vite | The `environment.*.ts` files, `.env*` files, and the API base URL configuration show the backend targets. Build-time environment variables differ from runtime configuration. |
| JavaScript / TypeScript / Nitro / Elysia | `process.env` and `Bun.env` reads list the required configuration. Compare them with `.env.example`. |
| Python | `os.environ` and settings modules (Django `settings*.py`, pydantic `BaseSettings`) list the required configuration. |
| SQL Server / PostgreSQL | The schema owner and the migration authority (application migrations or a DBA-managed process) are often undocumented. Record that as an unknown. |

## Verification

- Every unknown records where it was searched.
- Every assumption has an impact and a confirmation route.
- No assumption is phrased as a fact, and no unknown is silently replaced by
  a default in later output.
- The questions to the user are batched once, and limited to
  outcome-changing items.
- No file was modified.

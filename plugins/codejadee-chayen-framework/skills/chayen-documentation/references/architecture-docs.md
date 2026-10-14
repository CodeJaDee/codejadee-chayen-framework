---
kind: recipe
capabilities: [CAP-16-003]
---
# Architecture documentation

Document the architecture as it is, grounded in the code: C4-style context,
container, and component views as Mermaid diagrams, plus arc42-style
sections, with code references for every element and sections marked
unverified where the code does not show the answer. Deciding a new
architecture belongs to the architecture skill.

## Inputs

- The repository: deployable units (projects, services, front ends,
  functions), configuration, infrastructure files, and integrations.
- Existing architecture docs and ADRs.
- The audience and the depth wanted (overview or per-component detail).

## Procedure

1. **Identify the containers** (deployable or runnable units) from evidence:
   project types, Dockerfiles, IaC resources, deployment pipelines, and
   front-end apps. Each container gets a code reference.
2. **Identify external actors and systems:** users, identity providers,
   third-party APIs, message brokers, and data stores, from configuration
   and client code.
3. **Draw the context and container views** in Mermaid (flowchart or C4
   syntax, as the repository's renderer supports), with technology labels
   and the protocols on each relationship.
4. **Add component views** only for containers the audience needs,
   grounded in folders, namespaces, or modules.
5. **Write the arc42-style sections that the evidence supports:**
   introduction and goals (from the user or existing docs), constraints,
   building blocks, runtime scenarios for one or two key flows, deployment
   view, cross-cutting concepts (authentication, logging, error handling),
   decisions (link the ADRs), and risks.
6. **Mark gaps:** sections or relationships the code does not show (for
   example why a choice was made) are labelled unverified, with the
   question to ask.

## Outputs

- An architecture document with Mermaid C4-style diagrams and code
  references.
- Sections marked unverified where the code does not show the answer.

## Technology considerations

| Stack | Consideration |
|---|---|
| .NET | Solution and project types (`Microsoft.NET.Sdk.Web`, worker services, Functions), project references for component views, `appsettings` for external systems. |
| JavaScript and TypeScript | Workspaces and apps in a monorepo, Next.js or Nuxt server parts as separate runtime concerns, API clients that reveal external systems. |
| Python | Django apps or FastAPI routers as components, Celery workers as separate containers. |
| Infrastructure | Bicep, Terraform, Kubernetes, and Compose files for the deployment view. |
| Diagrams | Mermaid renders in GitHub, GitLab, and Azure DevOps wikis; keep diagrams as text in the repository. |

## Verification

- Every container in the generated diagram corresponds to a deployable unit
  in the fixture, with a code reference.
- Every relationship has a source (client code, configuration, or IaC), or
  is labelled unverified.
- Diagrams render (Mermaid syntax checked), or the check is NOT_RUN.

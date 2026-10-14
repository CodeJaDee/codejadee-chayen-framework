---
kind: recipe
capabilities: [CAP-13-002, CAP-13-003]
---
# CI and CD pipelines

Design CI pipelines that build, test, lint, and scan every change quickly
with caching and least-privilege tokens, and CD pipelines that build an
artifact once and promote it through gated environments with approvals,
deployment strategies, injected secrets, post-deploy checks, and a rollback
path. Pipeline files are edited and validated; runs that deploy happen only
under the platform's environment protection and the user's approval.

## Inputs

- The repository's build, test, and lint commands, and the required
  checks.
- The CI platform and existing pipeline files, runners, and secrets
  setup.
- For CD: environments, hosting platform, approval rules, the artifact
  type, and the deployment strategy wanted.

## Procedure

### CI (CAP-13-002)

1. **Collect the real commands** from the repository (scripts, README,
   existing workflows). Never invent commands the repository does not
   have.
2. **Mirror the existing pipeline style:** reusable workflows or
   templates, naming, runner images, and how secrets are referenced.
3. **Structure the jobs:** restore with caching, build, test with result
   reports (JUnit or TRX), lint, and security scans the project uses. Run
   independent jobs in parallel.
4. **Secure the pipeline:** read-only default token permissions, actions or
   tasks pinned by version or commit, no secrets for pull requests from
   forks, and OIDC instead of stored cloud keys.
5. **Make feedback fast:** cache keys from lock files, cancel superseded
   runs, path filters only where safe, and split slow suites into a
   separate job if needed.
6. **Validate the file** with the platform linter, and estimate the run
   time from the steps. A real run happens on a branch push, which the user
   triggers.

### CD (CAP-13-003)

1. **Build once:** the CD pipeline consumes the artifact CI produced (an
   image digest, a package version), never rebuilds per environment.
2. **Model environments** with the platform's environment feature:
   development, staging, production, each with its own secrets and
   protection rules. Production requires a manual approval.
3. **Choose the deployment strategy** with the user: rolling, blue-green
   (slots or two services and a switch), or canary (a traffic split with
   metrics). State what each needs from the platform.
4. **Inject secrets at deploy time** from the secret store, through
   workload identity where possible. No secret values in pipeline files.
5. **Add post-deploy verification** (see the release and rollout recipe):
   health, smoke tests, and key metrics, with a failure action.
6. **Define the rollback path:** redeploy the previous artifact, swap back
   slots, or shift traffic back, and how it is triggered.
7. **Do not run deployments yourself.** The pipeline runs under its
   environment approvals, triggered by the user.

## Outputs

- A CI pipeline definition following existing files, with caching and
  minimal permissions, plus the expected run time and a lint or dry-run
  result.
- A delivery pipeline with promotion gates and a rollback path, and the
  post-deploy verification steps.

## Technology considerations

| Stack | Consideration |
|---|---|
| GitHub Actions | `permissions: contents: read`, `concurrency` with `cancel-in-progress`, `environment:` protection rules and required reviewers, `actions/setup-dotnet`, `setup-node`, `setup-python` with caching, OIDC (`id-token: write`) to Azure or AWS. |
| Azure Pipelines | Stage templates, `deployment` jobs with `environment:` approvals and checks, variable groups linked to Key Vault, workload identity federation service connections, App Service slot swaps. |
| GitLab CI | `rules:`, `needs:`, protected environments with approvals, `cache:` keyed on lock files, `id_tokens` for OIDC. |
| .NET, Node, Python apps | `dotnet test --logger trx`, `npm ci && npm test`, `pytest --junitxml`, and container builds with BuildKit cache. Angular, React, and Vue builds produce static assets that are promoted unchanged. |
| Kubernetes | Deploy by image digest through Helm or Kustomize, rollout status checks, and `helm rollback` as the documented rollback (run by the pipeline or a person with access). |

## Verification

- The generated workflow uses the commands found in the fixture, pins
  action versions, and sets read-only default permissions.
- Production deployment in the generated pipeline requires an approval and
  uses the same artifact built once.
- The pipeline file passes the platform's linter, or is NOT_RUN with the
  reason, and no deployment was triggered by the agent.

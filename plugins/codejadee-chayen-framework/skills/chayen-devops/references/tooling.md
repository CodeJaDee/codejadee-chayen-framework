---
kind: technology
---
# Delivery and operations tooling

**Applies to:** CI platforms, container tooling, infrastructure-as-code
tools, and telemetry stacks. Read only the section for the detected
platform.

- Syntax and defaults change between versions. Check the version in use
  (`terraform version`, `az bicep version`, `helm version`, the workflow
  action versions) before relying on a feature.
- Commands marked mutating in the operations safety checklist need
  approval. Everything below that changes an environment is shown only as
  something a person with access runs.

## Check the repository first

| Area | What to look for |
|---|---|
| CI | `.github/workflows/*.yml`, `azure-pipelines.yml` and templates, `.gitlab-ci.yml`, reusable workflows, environments and required approvals |
| Containers | `Dockerfile*`, `.dockerignore`, `docker-compose*.yml`, `devcontainer.json`, registry names, base image policy |
| IaC | `*.tf` with backend configuration and modules, `*.bicep` and `bicepparam`, Pulumi projects, `k8s/`, `charts/`, Kustomize overlays |
| Configuration | `appsettings.{Environment}.json`, `.env.example`, Helm values per environment, pipeline variable groups |
| Telemetry | OpenTelemetry packages and exporters, Application Insights, Prometheus rules, Grafana dashboards as code, alert rules, runbook folder |

## GitHub Actions

- Set `permissions:` at workflow or job level, with `contents: read` as
  the default. Add only what a job needs (`id-token: write` for OIDC,
  `packages: write` to push images).
- Pin third-party actions to a full commit SHA, or at least a major
  version tag if that is the project's policy.
- Use `actions/cache` or the setup actions' built-in caching, `concurrency`
  groups to cancel superseded runs, and `environment:` with protection
  rules for deployments.
- Never use `pull_request_target` with a checkout of the pull request's
  code and secrets in the same job.
- Validate with `actionlint` if available.

## Azure Pipelines

- YAML templates (`extends`, stage and job templates), `environment:` with
  approvals and checks for deployments, variable groups linked to Key
  Vault, and service connections with workload identity federation.
- Validate by running the pipeline on a branch with a preview run, or the
  REST preview endpoint if the team uses it.

## GitLab CI

- `rules:` instead of `only` and `except`, `needs:` for DAG ordering,
  protected environments and variables, `cache:` keys per lock file, and
  OIDC `id_tokens` for cloud access.
- Validate with the project's CI Lint.

## Containers

- BuildKit (`docker buildx build`), cache mounts for package managers,
  multi-stage builds, `--platform` for multi-architecture images.
- Lint with `hadolint`. Inspect size with `docker image ls` and layer
  history with `docker history`.

## Terraform and Pulumi

- `terraform fmt -check`, `terraform validate`, `terraform plan -out`
  (read-only remote), and state in a remote backend with locking. Never
  edit state by hand without approval.
- Pulumi: `pulumi preview` is the plan equivalent; `pulumi up` is
  mutating.

## Bicep

- `az bicep build` and `az bicep lint` locally, `az deployment group
  what-if` (read-only remote) before `az deployment group create`
  (mutating).

## Kubernetes and Helm

- `kubectl apply --dry-run=server` and `kubectl diff` need cluster access
  but do not change it. `helm lint`, `helm template`, and the `helm diff`
  plugin for previews.
- Probes (`readinessProbe`, `livenessProbe`, `startupProbe`), resource
  requests and limits, `PodDisruptionBudget`, and rollout strategy
  settings.

## Telemetry

- OpenTelemetry SDKs: `OpenTelemetry.Extensions.Hosting` (.NET),
  `@opentelemetry/sdk-node` (Node), `opentelemetry-distro` (Python), and
  the browser SDK, exporting OTLP to a collector or vendor.
- Application Insights (`Azure.Monitor.OpenTelemetry.AspNetCore` in recent
  .NET), Prometheus metrics and alert rules, Grafana dashboards.

## Commands

```bash
actionlint                                  # GitHub Actions lint, if installed
hadolint Dockerfile
docker buildx build -t app:local .
terraform fmt -check && terraform validate
terraform plan -out=tfplan                  # read-only remote, needs credentials
az bicep build --file main.bicep
helm lint charts/api && helm template charts/api -f values-staging.yaml
```

## Pitfalls

- Treating a green `plan` as permission to `apply`.
- Secrets echoed by `set -x`, `env` dumps, or debug logging in pipelines.
- Moving tags (`:latest`, `@v3`) that change what runs without a code
  change.
- Kubernetes `livenessProbe` pointing at a dependency check, which
  restarts healthy pods when the database is slow.

---
kind: recipe
capabilities: [CAP-13-010, CAP-13-011]
---
# Deployment validation and rollback verification

Decide quickly and objectively whether a deployment worked (version
confirmation, health, smoke tests, key metrics against thresholds) with a
defined failure action, and make sure a release can be rolled back: a
written procedure, data compatibility of the previous version with the new
schema, and a rehearsal in a non-production environment. Rollbacks in any
environment run only with approval and the platform's authorization.

## Inputs

- Endpoints, health checks, the expected version, and the key metrics
  (error rate, latency, saturation) with their normal ranges.
- The deployment method (slots, rolling, blue-green, canary, Helm) and the
  previous version.
- The schema and data changes in the release, and configuration or flag
  changes.

## Procedure

### Deployment validation (CAP-13-010)

1. **Confirm the version:** the running version endpoint, image digest, or
   build metadata matches the artifact that was deployed.
2. **Check health:** readiness and health endpoints return success on every
   instance, with retries over a short window.
3. **Run smoke tests:** a few read-only or test-tenant checks of critical
   paths (sign-in, a key read, a key write in a test account), with
   timeouts. Never create real customer data.
4. **Compare key metrics** over a short observation window with the
   baseline before the deploy: error rate, p95 latency, and saturation,
   with explicit thresholds.
5. **Decide pass or fail** automatically from those checks, and define the
   failure action: stop promotion, alert, and trigger or request rollback
   (automatic only where the team has agreed to it).
6. **Implement as a pipeline step** or script with a non-zero exit code on
   failure.

### Rollback verification (CAP-13-011)

1. **Write the procedure** for the platform: redeploy the previous artifact,
   swap slots back, shift traffic back, or `helm rollback` to a revision,
   with who runs it and how long it takes.
2. **Check data compatibility:** can the previous version run against the
   schema and data after this release? Destructive or non-backward-compatible
   migrations (dropped or renamed columns, changed meaning) block rollback
   and must be split into expand and contract steps.
3. **Check other state:** message formats, cache contents, feature flags,
   and configuration that the old version must understand.
4. **Rehearse in staging** with approval: deploy the new version, roll back,
   run the deployment validation checks, and time it. Mark it NOT_RUN if no
   environment is available.
5. **Record the result** and any blockers, before production deployment.

## Outputs

- Post-deploy checks with thresholds, and the command or pipeline step, plus
  the failure action (rollback trigger).
- A rollback procedure with data-compatibility analysis, and the rehearsal
  result or NOT_RUN with the reason.

## Technology considerations

| Stack | Consideration |
|---|---|
| ASP.NET Core | Health checks (`MapHealthChecks`) with readiness and liveness separated, a version endpoint from assembly metadata, App Service slot swap and swap back. |
| Node and Python services | A `/healthz` and version route, smoke tests with the project's HTTP test tooling, and process managers or platform health probes. |
| Kubernetes and Helm | `kubectl rollout status` with a timeout, readiness gates, `helm rollback <release> <revision>` (mutating, needs approval), and Argo Rollouts or Flagger analysis for canaries if used. |
| Databases (SQL Server, PostgreSQL) | Expand and contract migrations so the previous version stays compatible; see the data skill's migration recipe. |
| Frontends | Static assets versioned per release, with the previous assets kept available so a rollback does not break cached clients. |

## Verification

- The generated smoke step fails the fixture pipeline when the health
  endpoint returns 503.
- A seeded destructive migration in the fixture release is flagged as
  blocking rollback.
- The rollback rehearsal result is recorded, or NOT_RUN with the reason,
  and no rollback was executed without approval.

---
kind: checklist
---
# Operations safety checklist

Classify every command before running it. These instructions grant no
access: the user's approval and the platform's authorization (credentials,
environment protection rules, RBAC, change process) are both required for
anything that changes an environment. This checklist is advisory; the
platform controls are what enforce it.

## Command classes

| Class | Examples | Rule |
|---|---|---|
| Local | `docker build`, `dotnet build`, `npm ci`, `terraform fmt`, `actionlint`, `hadolint`, `helm template`, `bicep build` | Allowed. Report the result. |
| Read-only remote | `terraform plan`, `az deployment group what-if`, `kubectl get` and `describe`, `kubectl diff`, `helm diff`, reading logs and metrics | Allowed only with credentials the user provided for this purpose. Never print secrets in the output. |
| Mutating | `terraform apply`, `az deployment ... create`, `kubectl apply`, `kubectl rollout restart` or `undo`, `kubectl scale`, `helm upgrade`, `install`, or `rollback`, triggering a deploy workflow, `docker push`, `npm publish`, `dotnet nuget push`, feature-flag or configuration changes in an environment | Only after explicit approval naming the command, environment, expected effect, and rollback, and only with the platform's authorization. |
| Destructive | `terraform destroy`, `-replace` of stateful resources, `kubectl delete` of namespaces, volumes, or stateful sets, deleting registries, buckets, databases, or state, `git push --force` to shared branches, purging queues or caches in production | As mutating, plus a verified recovery path (backup, snapshot, state backup) stated before approval. |

When a command's class is unclear, treat it as mutating.

## Approval request

An approval request contains:

1. **The environment,** by name (for example `prod-westeurope`).
2. **The exact command or pipeline run,** with parameters.
3. **The expected effect,** from the plan, what-if, or diff output.
4. **The risk:** downtime, data impact, and blast radius.
5. **The rollback or recovery path,** and how long it takes.
6. **Who executes it:** the user, the pipeline with its environment
   approval, or the agent under the user's credentials.

Approval for one environment or one command does not extend to another.

## Incident conditions

- **Mitigation proposals** (rollback, flag off, scale out, failover,
  restart) are made with their risk and expected effect. The incident
  owner decides, and someone with access runs them.
- **Read-only investigation** (dashboards, logs, traces, recent deploys)
  goes ahead with the access provided.
- **Every action is timestamped** in the incident timeline.

## Credentials and data

- Never print tokens, kubeconfigs, connection strings, or secret values.
  Refer to them by name, as `<redacted>`.
- Do not copy production logs or dumps that contain personal data out of
  their system without approval.
- Prefer short-lived credentials and workload identity (OIDC federation)
  over long-lived keys in pipelines.

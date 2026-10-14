---
kind: recipe
capabilities: [CAP-04-006]
---
# Rollout planning

Plan how a change reaches users safely: the environments it passes through,
staged exposure (canary, percentage, or cohort), feature-flag steps, the
monitoring signals watched at each stage, and the abort criteria and
rollback action. The plan is proposed until its owner approves it. This
recipe does not execute it.

## Inputs

- The change being released, and its risk class (from the task contract, if
  one exists).
- The environments and the deployment mechanism, from the repository's CI
  and CD and its deployment descriptors.
- The user segments, and any customer commitments or freeze windows.
- The available monitoring (metrics, logs, alerts) and the feature-flag
  mechanism, if any.

## Procedure

1. **Establish the mechanics from evidence:**
   - how deployments happen (pipelines, slots, Kubernetes rollouts);
   - whether traffic can be split;
   - whether a flag system exists.

   Cite the files. If a mechanism is absent, the plan uses what exists and
   lists the gap.
2. **Choose the exposure strategy,** with trade-offs:
   - **Flag-gated dark launch,** then percentage ramp: needs a flag
     mechanism.
   - **Canary instances or slots:** needs traffic splitting.
   - **Cohort or tenant-based release.**
   - **Full release with fast rollback:** acceptable only for low-risk
     changes. Say why.
3. **Define the stages.** Each stage has:
   - the audience (internal, then 1%, 10%, 50%, 100%; or named cohorts);
   - the minimum duration or traffic needed to judge it;
   - the owner who advances it.
4. **Attach signals and abort criteria to every stage.** Use concrete
   metrics with thresholds, compared with a baseline:
   - error rate;
   - p95 latency;
   - business KPIs such as checkout conversion;
   - specific log events.

   State the abort action: flag off, slot swap back, rollout undo, or a
   redeploy of the previous artifact.
5. **Check the reversibility.**
   - Schema or data changes must be backward-compatible with the previous
     version during the rollout (expand before contract).
   - Irreversible steps (data deletion, external notifications, payments)
     are gated, and listed.
6. **Plan the communication:** who is told before and after each stage, and
   the support readiness.
7. **Label the plan proposed.** List the approvals needed to start, and the
   approvals needed at each irreversible step.

## Outputs

A staged rollout plan for the owner's approval. It covers the mechanics
found, the stages, the signals, the abort criteria, and the gaps.

```text
Rollout plan — <change> — risk class: <class> — status: proposed (approver: <role>)
Mechanics: <deploy / traffic split / flags> (evidence: <paths>) — gaps: <items>
| Stage | Audience | Duration / volume | Signals and thresholds (vs baseline) | Abort action | Owner |
Reversibility: <schema compatibility; irreversible steps and their gates>
Communication: <who, when>
Approvals: <to start; per irreversible step>
```

## Technology considerations

| Stack | Consideration |
|---|---|
| ASP.NET Core | Feature flags through `Microsoft.FeatureManagement` (filters for percentage or targeting). Azure App Service deployment slots support swap and swap-back. Health checks gate slot warm-up. |
| Node (Nitro, Elysia, Next.js, Nuxt) | Edge or platform traffic splitting (for example Vercel or Netlify rollouts) where used. Flag SDKs (OpenFeature providers). Server and client bundles must tolerate mixed versions during the rollout. |
| Angular / React / Vue SPAs | Cached old bundles keep running after a deploy. API changes must stay backward-compatible until clients refresh. Version the assets. |
| Python | Flags with the team's library, or OpenFeature. Gunicorn and Uvicorn rolling restarts behind the load balancer. |
| SQL Server / PostgreSQL | Expand and contract migrations. The old app version must work against the new schema during the ramp. Never drop columns in the same release that stops using them. |
| Kubernetes | Rolling update settings (`maxUnavailable`, `maxSurge`), readiness probes, and `kubectl rollout undo`. Canary needs a service mesh or ingress weighting. |

## Verification

- Every stage has at least one metric threshold and a stated abort action.
- The previous version stays compatible with the data and schema throughout
  the rollout. Irreversible steps are listed and gated.
- The mechanics are cited from the repository, or listed as gaps.
- The plan is labelled proposed, with its approvals listed. Nothing is
  executed by this recipe.

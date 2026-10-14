---
kind: recipe
capabilities: [CAP-14-005, CAP-14-006]
---
# Alerting and incident triage

Make alerts few, actionable, and symptom-based, each with a runbook, and
guide triage of a live incident: assess impact, propose mitigation first,
form hypotheses from telemetry and recent changes, and keep a timeline.
Mitigation actions on production are proposed, approved by the incident
owner, and run by someone with access.

## Inputs

- Alert rules, alert history (volume, acknowledgement, actions taken), SLOs,
  routing, and on-call structure.
- For incidents: the symptoms, dashboards, logs and traces, recent
  deployments, configuration and flag changes, and dependency status.

## Procedure

### Alert tuning (CAP-14-005)

1. **Analyse history:** alerts by rule with count, time to acknowledge,
   and whether anyone acted. Find duplicates (several rules for one
   symptom), flapping alerts, and never-actioned alerts.
2. **Prefer symptom alerts** (users affected: error rate, latency, SLO
   burn) over cause alerts (CPU, memory), which belong on dashboards
   unless they predict an outage.
3. **Add SLO burn-rate alerts:** a fast burn (for example budget consumed
   at 14 times the sustainable rate over 1 hour, confirmed over 5 minutes)
   pages, and a slow burn (for example 6 times over 6 hours) creates a
   ticket. Agree the exact windows with the team.
4. **Set thresholds and durations** from history so normal variation does
   not fire, and route by severity: page for user impact, ticket for
   everything else.
5. **Attach a runbook** to every remaining alert (see the runbooks recipe).
6. **Propose the changes** (remove, merge, re-threshold, re-route) with the
   reasoning, as code changes to alert rules where the team keeps them in
   the repository.

### Incident triage (CAP-14-006)

1. **State impact:** who is affected, which journeys, since when, and how
   badly (error rate, latency), from dashboards.
2. **Check recent changes first:** deployments, configuration and flag
   changes, certificate expiries, dependency incidents, and traffic
   changes around the start time.
3. **Propose mitigation before root cause:** roll back the suspect deploy,
   turn off the flag, fail over, scale out, or shed load, each with its
   risk and expected effect. The incident owner approves, and someone with
   access runs it.
4. **Form ranked hypotheses** with the evidence for and against each, and
   the next read-only check that would confirm or reject it.
5. **Keep the timeline:** timestamped observations, decisions, actions, and
   who took them.
6. **Confirm recovery** with the same impact metrics, and hand over to RCA
   and the postmortem.

## Outputs

- Alert changes (remove, merge, re-threshold, re-route) with reasoning, and
  an alert-to-runbook mapping.
- For incidents: an impact statement, ranked hypotheses, mitigation options
  (rollback, flag off, scale), and the incident timeline.

## Technology considerations

| Stack | Consideration |
|---|---|
| Prometheus and Alertmanager | Alert rules in the repository, `for:` durations, recording rules for SLI ratios, routing and inhibition. |
| Azure Monitor | Log and metric alert rules (in Bicep or Terraform where kept as code), action groups, and Application Insights failures and performance views for triage. |
| Grafana, Datadog, New Relic | Their alert and SLO features, as the team uses them. |
| .NET, Node, Python services | Health checks, error and latency metrics by endpoint, and recent deployment markers on dashboards. |
| Paging tools | PagerDuty or Opsgenie routing and escalation policies, owned by the on-call team. |

## Verification

- For a fixture alert history, duplicate and never-actioned alerts are
  identified, and each remaining alert has a runbook link.
- For a seeded incident scenario, mitigation by rolling back the suspect
  deploy is proposed before root-cause work, and production actions wait
  for approval.
- The incident timeline has a timestamp for every action and decision.

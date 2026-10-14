---
kind: recipe
capabilities: [CAP-14-009]
---
# Disaster recovery planning

Plan recovery from major failures (loss of a region, data corruption,
ransomware, loss of a critical dependency) with recovery time and point
objectives per service, ordered procedures, roles, communication, the gaps
between current capability and targets, and a test schedule. The plan is
a document and a set of procedures; executing any failover or restore is a
separate, approved action.

## Inputs

- The services and their dependencies (data stores, queues, identity,
  third parties, DNS, certificates).
- Business RTO and RPO targets per service from the owner.
- Current capabilities: backups and their tested restore times, regions and
  replication, infrastructure as code coverage, and runbooks.

## Procedure

1. **Inventory services and dependencies,** and group them into recovery
   tiers by business impact (for example tier 1 restores first).
2. **Record targets per service:** RTO and RPO from the owner. Never invent
   them; mark missing ones as open questions.
3. **Describe current capability per service:** backup frequency (sets the
   achievable RPO), last measured restore time (from restore drills),
   replication and failover options, and whether infrastructure can be
   recreated from code.
4. **Flag gaps** where capability does not meet the target, with options to
   close each (more frequent backups, geo-replication, standby region,
   infrastructure as code completion) and their cost implications.
5. **Write procedures per scenario:** detection and declaration, roles
   (incident commander, communications, technical leads), ordered recovery
   steps per tier with commands or runbook links, data validation after
   recovery, and failback.
6. **Plan communication:** internal escalation, customer status updates,
   and regulators or partners if the owner says they apply.
7. **Schedule tests:** tabletop exercises, restore drills (data skill),
   and failover rehearsals in non-production, with dates and owners.
   Running any failover or restore needs approval.

## Outputs

- A DR plan with recovery tiers, procedures, roles, and communication.
- Gaps between current capability and targets, and a test schedule.

## Technology considerations

| Stack | Consideration |
|---|---|
| Azure | Paired regions, geo-redundant storage, Azure SQL failover groups, Front Door or Traffic Manager for traffic, and Bicep or Terraform to recreate infrastructure. |
| AWS and Google Cloud | Cross-region replicas, multi-region storage classes, Route 53 or Cloud DNS failover, and infrastructure as code for recreation. |
| Databases (SQL Server, PostgreSQL) | Measured restore times from drills, point-in-time restore windows, and replica lag, which bounds the RPO. |
| Kubernetes | Cluster recreation from manifests or GitOps, persistent volume backups (for example Velero), and secrets restoration from the secret store. |
| Identity, DNS, certificates | Often single points of failure: document how they are restored or bypassed. |

## Verification

- Every fixture service has an RTO, an RPO (or an open question for the
  owner), and a recovery procedure, and unmet targets are flagged.
- Each procedure step has an owner role and a validation check.
- No failover, restore, or DNS change was executed by the agent.

---
kind: checklist
---
# Infrastructure Design Document checklist

An Infrastructure Design Document describes where and how a system runs. It
is the document most prone to invented values, so every concrete value needs
a source. Separate the documented current-state configuration from
recommended changes, and separate an architectural intention from a deployed,
verified capability.

## Section checklist

| Area | What to check | Evidence to look for |
|---|---|---|
| Infrastructure overview | Purpose, scope, environments covered and the hosting model | Design brief, deployment diagrams |
| Environment definitions | Each environment (for example development, test, production), its purpose and its differences | Environment inventory, deployment configuration |
| Server and compute inventory | Each node or service: role, count, sizing and platform, as recorded | Inventory, provisioning files, cloud resource listings |
| Operating systems and platforms | Name and version for each, and support status where known | Inventory, images, manifests |
| Network topology | Zones, subnets, links and entry points, matching the diagram | Network diagram, network configuration |
| Network segmentation | Which tiers are separated and how | Network configuration, security groups |
| Firewall and communication flows | Each flow: source, destination, port, protocol and purpose | Rule sets, flow matrix |
| DNS and TLS | Names, records, certificate source, validity handling and renewal approach | DNS records, certificate configuration |
| Reverse proxies and load balancers | Role, routing rules, health checks, and session handling | Proxy and balancer configuration |
| Compute and storage requirements | Required capacity and the basis for it | Capacity plans, requirements, measurements |
| Database hosting and connectivity | Engine, version, placement, connection path and access control, without credentials | Database configuration, connection settings (redacted) |
| Identity and access management | How administrators and services authenticate and what they may do | IAM configuration, role definitions |
| Secrets and certificate management | Where secrets and certificates are held and rotated; never the values | Vault or store configuration, procedures |
| Deployment topology | How the application components map to nodes | Deployment manifests, diagrams |
| Containers and orchestration (if used) | Images, runtime, scheduling, scaling and storage, with versions pinned in the source | Container files, cluster manifests |
| Availability and fault tolerance | Redundancy, failover and single points of failure, as built | Configuration, failover test results |
| Backup and restoration | What is backed up, schedule, retention, location and tested restore | Backup configuration, restore test records |
| Disaster recovery | Scope, RPO and RTO targets and whether they were tested | Approved DR plan, test results |
| Monitoring and observability | What is measured, where it is shown and who looks at it | Monitoring configuration |
| Logging and alerting | Log sources, retention, alert rules and recipients | Logging and alerting configuration |
| Capacity and performance | Known limits and growth assumptions, with their basis | Measurements, capacity plans |
| Patch management | Who patches what and how often, as defined | Patch policy, schedules |
| Operational ownership | Who owns each component and each process | Ownership records, support model |
| Known risks and limitations | Open risks, accepted risks and workarounds | Risk register, review notes |

## Status discipline

- A value from deployed configuration or an inventory is Verified for the
  environment it describes. A value from a diagram only is an intended design.
- Give each RPO, RTO, availability and capacity figure its source. A target
  is not an achieved result. A backup is not a tested restore.
- A value copied from another environment, an earlier release or the original
  system is Not Verified for this one until its own evidence confirms it.
- Write recommended changes in a separate section or table headed
  "Recommended changes" so they cannot be read as current configuration.

## Consistency checks inside the document

- Hostnames, environments and component names match across the inventory,
  the network section and the diagrams.
- Every firewall flow in the matrix matches a connection in the topology, and
  the reverse.
- Capacity numbers in the requirements match the sizes in the inventory.
- Database, proxy and application ports agree between sections.
- The monitoring and backup sections cover every production component named
  in the inventory.

## Verification

- For each area report: covered, partly covered, missing or not applicable,
  with the evidence.
- List every concrete value and its source; list each value with no source as
  Not Verified.
- Report infrastructure analysis owned by the devops or security owner as Not
  Verified until that owner has answered. Report it as NOT_RUN when no
  evidence was available to inspect.
- Never run commands against a live environment to collect evidence unless
  the user supplied access and asked for it.

---
kind: checklist
---
# Infrastructure Design Document checklist (เอกสารออกแบบโครงสร้างพื้นฐาน)

An Infrastructure Design Document describes where and how a system runs. It
is the document most prone to invented values, so every concrete value needs
a source. Separate the documented current-state configuration from
recommended changes, and separate an architectural intention from a deployed,
verified capability. Mark a section not applicable with a reason.

## Section checklist

| Area (Thai heading) | What to check | Evidence to look for |
|---|---|---|
| ภาพรวมโครงสร้างพื้นฐาน | Purpose, scope, environments covered and the hosting model | Design brief, deployment diagrams |
| สภาพแวดล้อมของระบบ | Each environment (for example Development, Test, Production), its purpose and its differences | Environment inventory, deployment configuration |
| Server และ Compute Resources | Each node or service: role, count, sizing and platform, as recorded | Inventory, provisioning files, cloud resource listings |
| ระบบปฏิบัติการและแพลตฟอร์ม | Name and version for each, and support status where known | Inventory, images, manifests |
| Network Topology | Zones, subnets, links and entry points, matching the diagram | Network diagram, network configuration |
| Network Segmentation | Which tiers are separated and how | Network configuration, security groups |
| Firewall และ Port Configuration | Each flow: source, destination, port, protocol and purpose | Rule sets, flow matrix |
| DNS และ TLS | Names, records, certificate source, validity handling and renewal approach | DNS records, certificate configuration |
| Reverse Proxy และ Load Balancer | Role, routing rules, health checks, and session handling | Proxy and balancer configuration |
| ความต้องการด้าน Compute และ Storage | Required capacity and the basis for it | Capacity plans, requirements, measurements |
| Storage และ Database Hosting | Engine, version, placement, connection path and access control, without credentials | Database configuration, connection settings (redacted) |
| Identity and Access Management | How administrators and services authenticate and what they may do | IAM configuration, role definitions |
| การจัดการ Secret และใบรับรอง | Where secrets and certificates are held and rotated; never the values | Vault or store configuration, procedures |
| Deployment Architecture | How the application components map to nodes | Deployment manifests, diagrams |
| Container และ Orchestration (ถ้ามี) | Images, runtime, scheduling, scaling and storage, with versions pinned in the source | Container files, cluster manifests |
| High Availability | Redundancy, failover and single points of failure, as built | Configuration, failover test results |
| Backup และ Recovery | What is backed up, schedule, retention, location and tested restore | Backup configuration, restore test records |
| Disaster Recovery | Scope, RPO and RTO targets and whether they were tested | Approved DR plan, test results |
| Monitoring และ Logging | What is measured, where it is shown, log sources, retention, alert rules and recipients | Monitoring, logging and alerting configuration |
| Capacity Planning | Known limits and growth assumptions, with their basis | Measurements, capacity plans |
| การบริหารจัดการ Patch | Who patches what and how often, as defined | Patch policy, schedules |
| ผู้รับผิดชอบด้านการปฏิบัติการ (Operational Ownership) | Who owns each component and each process | Ownership records, support model |
| ความเสี่ยงและข้อจำกัดที่ทราบ | Open risks, accepted risks and workarounds | Risk register, review notes |

## Status discipline

- A value from deployed configuration or an inventory is Verified for the
  environment it describes. A value from a diagram only is an intended design.
- Give each RPO, RTO, availability and capacity figure its source. A target
  is not an achieved result. A backup is not a tested restore.
- A value copied from another environment, an earlier release or the original
  system is Not Verified for this one until its own evidence confirms it.
- Write recommended changes in a separate section or table headed
  "ข้อเสนอแนะในการเปลี่ยนแปลง" so they cannot be read as current configuration.
- In Thai, do not use present-tense wording ("ระบบสลับไปยังไซต์สำรองโดยอัตโนมัติ")
  for a capability that is only planned.

## Consistency checks inside the document

- Hostnames, environments and component names match across the inventory,
  the network section and the diagrams, in their original spelling.
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

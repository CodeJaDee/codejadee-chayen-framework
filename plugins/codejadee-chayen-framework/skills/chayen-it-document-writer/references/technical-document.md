---
kind: checklist
---
# Technical Document checklist

A Technical Document describes how a system works so its intended readers can
understand, operate or maintain it accurately. Use this list to write or
assess one. Mark a section not applicable with a reason; do not add sections
only to satisfy a generic template.

## Section checklist

| Area | What the document should let the reader answer | Evidence to look for |
|---|---|---|
| Purpose and scope | Why the document exists, who reads it, what is and is not covered | Project brief, document metadata, approved scope |
| System overview | What the system does, its users and its place in the landscape | Requirements, architecture notes, deployed components |
| Terminology and definitions | What each domain term and acronym means | Glossary, requirements, code naming |
| Functional description | What each function does, for whom, and when | Requirements, code, screens, API contract |
| Business and technical workflows | The steps, decision points, actors and outcomes, including alternate paths | Process documents, code paths, sequence diagrams |
| Inputs and outputs | Each input and output, its format, source, destination and validation | Schemas, API contracts, file layouts, code |
| Interfaces and integrations | Each external system, direction, protocol, trigger and failure behavior | Interface specifications, configuration, code |
| Data handling | What data is stored, processed, retained and protected, and where | Schemas, DDL, retention rules, configuration |
| Business rules | Each rule, its condition and its source | Requirements, code, validation logic |
| Error and exception handling | What fails, how it is detected, what the user or operator sees, and recovery | Code, logs, error catalogs, test cases |
| Dependencies | Systems, services, libraries and teams the system relies on | Manifests, configuration, deployment files |
| Technical constraints | Limits on platform, volume, timing, compatibility and standards | Requirements, platform documentation, decisions |
| Operational considerations | Scheduling, monitoring, support, maintenance and ownership | Runbooks, schedules, configuration, ownership records |
| Security considerations | Authentication, authorization, data protection, audit and known limits, as documented | Security design, configuration, code; hand verification to the security owner |
| References and appendices | Source documents, diagrams, versions and revision history | Document control, repository paths |

## Reader test

For each section ask: could the intended reader act correctly using only this
text and its references? Common failures:

- a workflow that skips the failure path or the actor;
- an input or output with no format, unit or validation rule;
- an interface without direction, trigger or frequency, where these are
  known to exist;
- a rule stated without its condition or exception;
- terms used before they are defined, or two terms for one concept;
- statements that mix what the system does now with what is planned.

## Review lenses

- **Accuracy:** each technical statement matches the evidence, or is
  labelled by status.
- **Completeness:** applicable sections exist, and omissions are explained.
- **Consistency:** names, numbers and flows agree between text, tables and
  diagrams.
- **Traceability:** functions trace to requirements, and requirements to
  functions.
- **Language:** apply the technical English checklist.

## Verification

- Report each applicable section as covered, partly covered, missing or not
  applicable, with the evidence for the judgment.
- Report a section as Verified only when an inspected source supports it.
- Record each value you could not support as Not Verified or Missing
  Information.
- Report checks you could not run as NOT_RUN with the reason.

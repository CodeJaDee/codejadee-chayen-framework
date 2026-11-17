---
kind: checklist
---
# Application Design Document checklist

An Application Design Document explains how an application is structured and
why, in enough detail for review, build and maintenance. Document the system
as it is, or as it is approved to be. Impose no pattern (Clean Architecture,
microservices, CQRS or any other) that the system does not use; describe the
structure the evidence shows.

## Section checklist

| Area | What to check | Evidence to look for |
|---|---|---|
| Purpose, scope and assumptions | Goal, boundaries, audience, assumptions with owners | Brief, requirements, approved decisions |
| System context | Users, external systems and boundaries; each connection named consistently | Context diagram, integration configuration |
| Architecture overview | The structure actually used, and the reason where a decision record exists | Solution layout, decision records, diagrams |
| Layers and components | Each component, its responsibility and its dependencies | Project structure, namespaces, manifests |
| Module responsibilities | What each module owns and does not own; no overlapping ownership | Code, module documentation |
| Integration architecture | Each integration: direction, protocol, trigger, payload, retry and failure behavior | Client code, configuration, interface specifications |
| API design and contracts | Endpoints, methods, request and response shapes, status and error codes, versioning | OpenAPI file, controllers or handlers, tests |
| Authentication and authorization | Mechanism, roles, permissions and where they are checked, as built | Configuration, middleware, policy code; hand analysis to the security owner |
| Database and data model | Entities, keys, relationships, constraints and ownership; diagram matches DDL | Schema scripts, migrations, entity mappings |
| Data flow and processing | How data moves between components and stores, including transformations | Code paths, diagrams, queue or file definitions |
| Business logic and validation | Rules, validation points and their source | Requirements, code, tests |
| Error handling and logging | Error categories, user-facing messages, what is logged and where | Exception handling code, logging configuration |
| Background processing and scheduling | Jobs, triggers, schedules, concurrency and failure behavior | Scheduler configuration, job code |
| Configuration and dependency management | Settings by environment, secrets handling approach, packages and versions | Configuration files, manifests; never copy secret values |
| Security design | Controls as designed and as implemented, separated and labelled | Design decisions, configuration, code |
| Non-functional requirements | Targets for availability, performance, capacity, audit, each with its source | Requirements, test results; no invented targets |
| Performance and scalability | Known limits, measures and design choices, as supported by measurements | Benchmarks, load results, configuration |
| Resilience and recovery | Failure modes, retries, timeouts, degradation and recovery as built | Code, configuration, test cases |
| Deployment dependencies | What the application needs from the runtime, network and services | Deployment manifests, configuration |
| Traceability to requirements | Each requirement has a design section; each design section has a reason | Requirements list, traceability matrix |
| Design decisions and limitations | Decisions with status and rationale, and known gaps | Decision records, review notes |

## Consistency checks inside the document

- Component, service and interface names are spelled the same in text,
  tables and diagrams.
- Every box and arrow in a diagram appears in the text, and every component
  in the text appears in a diagram where one exists.
- Entities and columns in the text match the data model and the schema.
- API paths, methods and fields match the contract and the implementation.
- The sequence in a flow description matches its diagram.
- Security statements describe designed controls separately from verified
  implementation.

## Update and legacy cases

When a document was reused from another system, treat every configuration,
integration, schema and workflow statement as inherited until implementation
evidence confirms it. Mark inherited and unconfirmed items rather than
presenting them as the new system's design.

## Verification

- For each area report: covered, partly covered, missing or not applicable,
  with evidence.
- List each unsupported claim, each requirement without a design section and
  each design section without a requirement.
- Report diagram comparisons separately from text comparisons, and report a
  diagram that could not be inspected as not inspected.
- Report analysis that belongs to the architecture, security or data owner as
  Not Verified until that owner has answered.

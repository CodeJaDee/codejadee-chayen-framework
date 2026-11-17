---
kind: checklist
---
# Application Design Document checklist (เอกสารออกแบบแอปพลิเคชัน)

An Application Design Document explains how an application is structured and
why, in enough detail for review, build and maintenance. Document the system
as it is, or as it is approved to be. Impose no pattern (Clean Architecture,
microservices, CQRS or any other) that the system does not use; describe the
structure the evidence shows. Mark a section not applicable with a reason.

## Section checklist

| Area (Thai heading) | What to check | Evidence to look for |
|---|---|---|
| วัตถุประสงค์ ขอบเขต และข้อสมมติฐาน | Goal, boundaries, audience, assumptions with owners | Brief, requirements, approved decisions |
| บริบทของระบบ | Users, external systems and boundaries; each connection named consistently | Context diagram, integration configuration |
| ภาพรวมสถาปัตยกรรมแอปพลิเคชัน | The structure actually used, and the reason where a decision record exists | Solution layout, decision records, diagrams |
| องค์ประกอบและโมดูลของระบบ | Each component, its dependencies and layer | Project structure, namespaces, manifests |
| ความรับผิดชอบของแต่ละ Component | What each module owns and does not own; no overlapping ownership | Code, module documentation |
| ลำดับการทำงาน | Main and alternate sequences between components, matching the diagrams | Sequence diagrams, code paths |
| สถาปัตยกรรมการเชื่อมต่อ | Each integration: direction, protocol, trigger, payload, retry and failure behavior | Client code, configuration, interface specifications |
| การออกแบบ API | Endpoints, methods, request and response shapes, status and error codes, versioning | OpenAPI file, controllers or handlers, tests |
| การยืนยันตัวตนและการกำหนดสิทธิ์ | Mechanism, roles, permissions and where they are checked, as built | Configuration, middleware, policy code; hand analysis to the security owner |
| การออกแบบฐานข้อมูล | Entities, keys, relationships, constraints and ownership; diagram matches DDL | Schema scripts, migrations, entity mappings |
| การไหลของข้อมูล | How data moves between components and stores, including transformations | Code paths, diagrams, queue or file definitions |
| ตรรกะทางธุรกิจและการตรวจสอบข้อมูล | Rules, validation points and their source | Requirements, code, tests |
| การจัดการข้อผิดพลาดและ Logging | Error categories, user-facing messages, what is logged and where | Exception handling code, logging configuration |
| งานเบื้องหลังและการตั้งเวลา | Jobs, triggers, schedules, concurrency and failure behavior | Scheduler configuration, job code |
| การตั้งค่าและการจัดการ Dependency | Settings by environment, secrets handling approach, packages and versions | Configuration files, manifests; never copy secret values |
| การออกแบบด้านความปลอดภัย | Controls as designed and as implemented, separated and labelled | Design decisions, configuration, code |
| ข้อกำหนดที่ไม่ใช่ด้านฟังก์ชัน | Targets for availability, performance, capacity, audit, each with its source | Requirements, test results; no invented targets |
| ประสิทธิภาพและการรองรับการขยายตัว | Known limits, measures and design choices, as supported by measurements | Benchmarks, load results, configuration |
| ความทนทานและการกู้คืน | Failure modes, retries, timeouts, degradation and recovery as built | Code, configuration, test cases |
| สิ่งที่ต้องใช้ในการ Deployment | What the application needs from the runtime, network and services | Deployment manifests, configuration |
| ความสัมพันธ์กับ Requirements | Each requirement has a design section; each design section has a reason | Requirements list, traceability matrix |
| การตัดสินใจเชิงออกแบบและข้อจำกัด | Decisions with status and rationale, and known gaps | Decision records, review notes |

## Consistency checks inside the document

- Component, service and interface names are spelled the same in text,
  tables and diagrams, with the same Thai or English form.
- Every box and arrow in a diagram appears in the text, and every component
  in the text appears in a diagram where one exists.
- Entities and columns in the text match the data model and the schema; names
  stay in their original spelling.
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

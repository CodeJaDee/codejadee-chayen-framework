---
kind: checklist
---
# Evidence and traceability (หลักฐานและการสืบย้อน)

Every important technical statement in a Thai document needs a source, a
status and a place where a reader can check it. Use this model for writing,
review, update, audit, consistency and translation work. Instructions are in
English; the labels shown in Thai are the ones to use in the Thai deliverable.

## Source inventory and authority

List every source before judging a statement. Do not treat a source as
authoritative only because it was supplied.

| Source type | Typical use | Weight and caution |
|---|---|---|
| Source code, configuration, schemas, DDL, manifests | Current behavior and structure | Strong for what is deployed or built; check it matches the target environment and branch |
| API contracts and OpenAPI files | Interface names, fields, status codes | Strong for the contract; the code may differ, so compare when both exist |
| Approved requirements and design decisions | Intent and obligations | Strong for intent; not proof that it was built |
| Existing documents and diagrams, Thai or English | Baseline structure and wording | Can be stale or describe another system; verify against implementation evidence |
| Infrastructure configuration, network and deployment diagrams, CI/CD manifests | Environments and topology | Strong when it is the deployed configuration; a diagram alone shows intent |
| Test cases and verified results | Behavior and capability claims | Strong only when the run is recorded and recent; a test file is not a test run |
| Interviews, emails, tickets, comments | Context and open questions | Weak; treat as Requires Clarification until a stronger source agrees |

For each source record: path or identifier, version or date when known, the
branch or environment it describes, and whether it was actually opened in
this run. A source that was named but not inspected is not evidence. For a
translation, the English source document and its version are the evidence.

## Evidence statuses (สถานะหลักฐาน)

Give each important finding exactly one status. Write the Thai label, and
keep the English term in parentheses when the project mixes both.

| Status | Thai label | Meaning | Allowed in a final document as fact |
|---|---|---|---|
| Verified | ยืนยันแล้ว | A source that was inspected states it, and nothing inspected contradicts it | Yes, with the source cited |
| Inferred | อนุมานจากหลักฐาน | Follows reasonably from inspected sources but is not stated | Only labelled as inferred |
| Not Verified | ยังไม่ได้รับการยืนยัน | No inspected source supports it, or the source was not available | No; list it for the owner |
| Conflicting Evidence | หลักฐานขัดแย้งกัน | Two or more inspected sources disagree | No; show both and ask for a decision |
| Requires Clarification | ต้องการข้อมูลเพิ่มเติม | The meaning or intent is ambiguous and only a person can say | No; add it to the open questions |

Use "Missing Information" (ไม่มีข้อมูล) for a value that no source provides.
An intended or designed capability is Verified as a design only. It becomes a
deployed capability only with deployment or test evidence.

## Finding record (บันทึกข้อค้นพบ)

Record each important finding with these fields. Keep the same fields in a
review, an audit, a consistency report and a translation check so results can
be merged.

| Field | Thai heading | Content |
|---|---|---|
| Document and section | เอกสารและหัวข้อ | File or title plus section number or heading |
| Finding | ข้อค้นพบ | One sentence stating the problem or the verified fact |
| Supporting source | แหล่งข้อมูลสนับสนุน | The source that supports or contradicts it |
| Evidence location | ตำแหน่งหลักฐาน | Path and line numbers, page, table or diagram name when available |
| Status | สถานะ | One value from the status table |
| Recommended action | ข้อเสนอแนะ | The smallest change that resolves it |
| Owner | ผู้รับผิดชอบ | The responsible person or role when known; otherwise "ยังไม่ระบุ" |

Severity, where used, comes from impact and evidence (see the review and
audit reference), not from the finding type alone.

## Facts, assumptions and proposals

Keep three kinds of statement visibly apart, in headings, tables or labels.

- **Current state (สภาพปัจจุบัน):** what exists now, each with a source.
- **Assumption (ข้อสมมติฐาน):** something taken as true for the design, with
  who owns it and what changes if it is wrong.
- **Proposal or recommendation (ข้อเสนอ):** a future or recommended change.
  Never write a proposal as if it were deployed. In Thai, avoid wording such
  as "ระบบทำงานแบบ..." for something that is only planned; use "มีแผนจะ..." or
  "เสนอให้..." and say who proposed it.

## Values never to invent

When the evidence is silent, record the item as Not Verified, Missing
Information or Requires Clarification. Never fill any of these with a
plausible value, in Thai text or in a translation:

- server specifications, operating systems, versions and capacity;
- IP addresses, hostnames, domain names, ports and certificate details;
- database tables, columns, keys, indexes and data volumes;
- API endpoints, request and response shapes, status codes and error codes;
- authentication and authorization mechanisms, roles and permissions;
- security controls, encryption settings and compliance statements;
- backup schedules, retention, restore steps, RPO and RTO;
- performance figures, service levels and availability commitments;
- test results, deployment steps and operational procedures;
- owners, contacts and approval status.

## Traceability matrix (ตารางสืบย้อนความต้องการ)

For multi-document or requirement-driven work, connect each requirement to
its design and its evidence.

| Requirement ID | Requirement summary | Design section | Implementation evidence | Status | Gap or note |
|---|---|---|---|---|---|
| (identifier from the source) | (one line, wording preserved) | (document and section) | (path and lines, or "ไม่พบ") | (status) | (what is missing or conflicting) |

Use the identifiers the sources already use. Do not renumber them. A
requirement with no design section, or a design section with no requirement,
is a gap to report, not to fill.

## Citation and confidentiality

- Cite repository evidence as `path:line` or `path:start-end`. Cite
  documents by title, version and section.
- Quote only the span that proves the point, in its original language.
- Refer to credentials, tokens, keys and connection strings by location and
  write `<redacted>`. Do not copy personal data into a document.
- Do not claim a source was verified when it was only listed. Say which
  sources were inspected and which were not.

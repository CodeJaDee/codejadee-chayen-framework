---
kind: checklist
---
# Evidence and traceability

Every important technical statement in a document needs a source, a status
and a place where a reader can check it. Use this model for writing, review,
update, audit and consistency work.

## Source inventory and authority

List every source before judging a statement. Do not treat a source as
authoritative only because it was supplied.

| Source type | Typical use | Weight and caution |
|---|---|---|
| Source code, configuration, schemas, DDL, manifests | Current behavior and structure | Strong for what is deployed or built; check it matches the target environment and branch |
| API contracts and OpenAPI files | Interface names, fields, status codes | Strong for the contract; the code may differ, so compare when both exist |
| Approved requirements and design decisions | Intent and obligations | Strong for intent; not proof that it was built |
| Existing documents and diagrams | Baseline structure and wording | Can be stale or describe another system; verify against implementation evidence |
| Infrastructure configuration, network and deployment diagrams, CI/CD manifests | Environments and topology | Strong when it is the deployed configuration; a diagram alone shows intent |
| Test cases and verified results | Behavior and capability claims | Strong only when the run is recorded and recent; a test file is not a test run |
| Interviews, emails, tickets, comments | Context and open questions | Weak; treat as Requires Clarification until a stronger source agrees |

For each source record: path or identifier, version or date when known,
the branch or environment it describes, and whether it was actually opened
in this run. A source that was named but not inspected is not evidence.

## Evidence statuses

Give each important finding exactly one status.

| Status | Meaning | Allowed in a final document as fact |
|---|---|---|
| Verified | A source that was inspected states it, and nothing inspected contradicts it | Yes, with the source cited |
| Inferred | Follows reasonably from inspected sources but is not stated | Only labelled as inferred |
| Not Verified | No inspected source supports it, or the source was not available | No; list it for the owner |
| Conflicting Evidence | Two or more inspected sources disagree | No; show both and ask for a decision |
| Requires Clarification | The meaning or intent is ambiguous and only a person can say | No; add it to the open questions |

An intended or designed capability is Verified as a design only. It becomes
a deployed capability only with deployment or test evidence.

## Finding record

Record each important finding with these fields. Keep the same fields in a
review, an audit and a consistency report so results can be merged.

| Field | Content |
|---|---|
| Document and section | File or title plus section number or heading |
| Finding | One sentence stating the problem or the verified fact |
| Supporting source | The source that supports or contradicts it |
| Evidence location | Path and line numbers, page, table or diagram name when available |
| Status | One value from the status table |
| Recommended action | The smallest change that resolves it |
| Owner | The responsible person or role when known; otherwise "unassigned" |

Severity, where used, comes from impact and evidence (see the review and
audit reference), not from the finding type alone.

## Facts, assumptions and proposals

Keep three kinds of statement visibly apart, in headings, tables or labels.

- **Current state:** what exists now, each with a source.
- **Assumption:** something taken as true for the design, with who owns it
  and what changes if it is wrong.
- **Proposal or recommendation:** a future or recommended change. Never
  write a proposal in the present tense as if it were deployed.

## Values never to invent

When the evidence is silent, record the item as Not Verified, Missing
Information or Requires Clarification. Never fill any of these with a
plausible value:

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

## Traceability matrix

For multi-document or requirement-driven work, connect each requirement to
its design and its evidence.

| Requirement ID | Requirement summary | Design section | Implementation evidence | Verification status | Gap or note |
|---|---|---|---|---|---|
| (identifier from the source) | (one line, wording preserved) | (document and section) | (path and lines, or "none found") | (status) | (what is missing or conflicting) |

Use the identifiers the sources already use. Do not renumber them. A
requirement with no design section, or a design section with no requirement,
is a gap to report, not to fill.

## Citation and confidentiality

- Cite repository evidence as `path:line` or `path:start-end`. Cite
  documents by title, version and section.
- Quote only the span that proves the point.
- Refer to credentials, tokens, keys and connection strings by location and
  write `<redacted>`. Do not copy personal data into a document.
- Do not claim a source was verified when it was only listed. Say which
  sources were inspected and which were not.

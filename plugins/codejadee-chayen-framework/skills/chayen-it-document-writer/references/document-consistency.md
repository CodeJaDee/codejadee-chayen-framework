---
kind: checklist
---
# Mode: consistency across documents

Compare two or more documents, or a document and its implementation, and
report where they disagree. The result is a conflict list with evidence, not
a silent merge.

## Typical comparisons

- Technical Document and Application Design Document.
- Application Design and Infrastructure Design.
- Requirements and design.
- API documentation and the implementation or contract.
- Database diagram and DDL scripts.
- Infrastructure diagram and deployment configuration.

## Procedure

1. **Name the set.** List each document with its version and date, and each
   implementation source with the branch or environment it represents.
2. **Pick the comparison keys.** Use the attributes below, and compare each
   one across every document that mentions it.
3. **Build an index.** For each key record the value, the document, the
   section and the evidence location. Use exact names, not paraphrases.
4. **Compare.** A conflict exists when two inspected sources state
   different values or relationships for the same thing. A term that appears
   in only one document is a gap, not a conflict.
5. **Check freshness.** Note the date or version of each side. A newer source
   does not win automatically; record it and let the owner decide.
6. **Classify each conflict** with the evidence status Conflicting Evidence,
   and rank it using the severity table in the review and audit reference.
7. **Recommend a reconciliation** that names which document or source should
   change and why. Where evidence is insufficient to choose, state the
   decision the owner must make.

## Attributes to compare

| Group | Attributes |
|---|---|
| Names | System, component, service and interface names; environment names |
| Contracts | API paths, methods, fields, status codes, message formats |
| Data | Database entities, columns, keys, constraints, retention |
| Configuration | Ports, endpoints, limits, schedules, feature settings |
| Flows | Data flows, sequences, integration directions and triggers |
| Dependencies | Libraries, services, platforms, versions |
| Security | Authentication, authorization, encryption and exposure assumptions |
| Deployment | Topology, node roles, scaling, availability and recovery targets |
| Decisions | Approved design decisions and their status |

## Rules

- Do not resolve competing technical facts without sufficient evidence or the
  owner's approval.
- Do not edit any of the documents; the deliverable is the conflict report.
- Keep wording exact. A renamed component is a conflict until the documents
  say it is the same component.
- Report a diagram you could not read as not inspected, and compare the text
  only.
- Compare like with like: a design intention in one document and a deployed
  value in another are different kinds of statement; label them.

## Verification

- Each conflict cites both sides with document, section and evidence
  location (PASS or FAIL).
- Each recommended resolution names the document or source to change.
- No conflict is closed without evidence or an owner decision.
- The list of documents compared, and any not inspected, is complete.

---
kind: template
---
# Output formats

Use the format for the mode. Prefer Markdown. Keep an existing document's
template, numbering, headings, table structure and reference conventions.
Word-oriented structure (numbered headings, tables, a revision table and a
caption for each figure) is expressed in plain Markdown. Do not claim a DOCX
or PDF file exists unless the host created it.

## Template

### Write

```markdown
# <Document title>

| Field | Value |
|---|---|
| Document type | Technical Document / Application Design / Infrastructure Design |
| Version and date | <from the user or project> |
| Audience and purpose | <stated> |
| Author and reviewers | <from the user; leave unset when unknown> |

## <Section per the checklist, numbered as the project numbers them>
<Content, with a source cited for each technical statement.>

## Evidence references
| Ref | Source | Location | Inspected |
|---|---|---|---|

## Assumptions and limitations
| ID | Statement | Owner | Effect if wrong |
|---|---|---|---|

## Open questions
| ID | Question | Section | Status | Owner |
|---|---|---|---|---|

## Verification summary
<Sections verified, inferred, not verified; checks run or NOT_RUN.>
```

### Review

```markdown
## Executive review summary
<Two to four sentences: overall quality, the main risks, what was not checked.>

## Findings
### Critical / Major / Minor
| ID | Location | Original text or issue | Recommended correction | Reason | Status |
|---|---|---|---|---|---|
```

### Update

```markdown
## Change summary
Baseline: <document, version>. Current evidence: <sources inspected>.

| Section | Class | Change | Evidence |
|---|---|---|---|
| (Unchanged / Modified / Removed / New / Not Verified) | | | |

## Change log
## Unresolved differences
## Sections needing owner verification
## Verification summary
```

The updated document follows, with the original structure preserved.

### Audit

```markdown
## Audit summary
Scope, document version, evidence set, result in one paragraph.

## Findings register
| ID | Severity | Section | Finding | Evidence | Status | Action | Owner |
|---|---|---|---|---|---|---|---|

## Completeness assessment
| Area | Covered / Partly / Missing / Not applicable | Note |
|---|---|---|

## Evidence gaps
## Recommended actions
## Outstanding questions
```

### Consistency

```markdown
## Documents compared
| Document | Version and date | Inspected |
|---|---|---|

## Conflict matrix
| ID | Attribute | Document A (section, value) | Document B (section, value) | Evidence | Severity |
|---|---|---|---|---|---|

## Affected sections
## Recommended reconciliation
## Unresolved decisions
```

## Rules

- Lead with the summary, then the findings, then the detail.
- Order findings by severity, then by document order.
- Use one row per finding; keep the evidence in its own column.
- Mark every value that is not Verified with its status in the same row.
- State what was not inspected before any statement about completeness.
- Keep the same finding fields in every mode (see the evidence and
  traceability checklist) so results can be combined.
- Keep the report in the conversation unless the user names a file.

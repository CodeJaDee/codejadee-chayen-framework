---
kind: template
---
# Requirements record

The shared output format for every requirements task. It keeps four kinds of
statement apart, so that nothing assumed or undecided is read as agreed.

## Template

```text
Requirements record — scope: <feature / epic / system>
Sources:
  S1 <stakeholder statement | document path | ticket | code path:line> (date if known)
Confirmed facts:
  F1 <statement> — source: S1
Assumptions:
  A1 <statement> — impact if wrong: <impact> — confirm by: <who/how> — status: to confirm | confirmed | contradicted
Open decisions:
  D1 <question> — owner: <role | owner unknown> — options: <a / b> — blocks: <what>
Acceptance criteria:
  AC1 <observable statement, for example Given/When/Then> — check: <automated test | manual check> — traces to: F1
Out of scope:
  <item> — reason
```

## Rules

| Section | Rule |
|---|---|
| Confirmed facts | Each one cites a source. Paraphrase a source carefully. Quote it when the wording matters. |
| Assumptions | Each one states its impact and a confirmation route. An assumption becomes a fact only after confirmation, citing the confirming source. |
| Open decisions | Never decided by the agent. List the options and their consequences, and name the owner role, or "owner unknown". |
| Acceptance criteria | Observable and testable. Each one traces to a fact or a confirmed assumption. |
| Contradictions | Two sources that disagree become an open decision listing both. |
| Numbering | Keep IDs stable across revisions, so that later traceability can refer to them. |

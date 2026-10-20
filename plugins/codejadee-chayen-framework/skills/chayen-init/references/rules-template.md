---
kind: template
---
# Team rules template

Create `.chayen/rules.md` from this template only when the file does not
exist. The team owns it after that: later runs never overwrite it, and add an
entry only when the user approves the exact diff.

## Template

```markdown
---
schema: project-knowledge/1
file: rules
---
<!-- Team-owned. Agents read this file before every task. Change it through review like code. -->

# Team rules

Rules here are approved by the team. They come after the user's instructions
and before conventions observed in the code. Each entry names who approved it
and when.

## Constraints
<!-- Example: Orders service uses Dapper; do not add EF Core. (Approved by <name>, <date>) -->

## Standards
<!-- Team standards that no configuration file enforces. -->

## Decisions
<!-- Link to the ADR or record instead of copying it. -->

## Domain glossary
<!-- Term: meaning in this project. -->

## Known pitfalls
<!-- Something that went wrong before, and how to avoid it. -->

## Open questions
<!-- Questions the code cannot answer, with who can answer them. -->
```

## Completion rules

- On first creation, the sections hold only the comments, plus answers the
  user gave in this session and approved for this file.
- Write an answer as a rule only when the user stated it as a rule. Record
  facts the user is unsure about under open questions.
- Never move observed patterns or proposals into this file without the user
  asking for that exact entry.
- No secret values, credentials, or personal data.

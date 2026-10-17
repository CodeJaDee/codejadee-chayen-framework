---
kind: template
---
# Output formats

Use the format for the mode. Reply in the user's language; finding text may
be Thai or English to match the request. Keep explanations proportional:
a short paragraph gets a short note.

## Template

### Audit (no edits)

```markdown
**Summary:** <one or two sentences on overall readability and the main issues>

| # | Location | Excerpt | Pattern | Why it matters | Suggested direction |
|---|---|---|---|---|---|
| 1 | <paragraph, line or key> | "<short quote>" | TH-08 | <reason> | <how to fix, not a full rewrite> |

**Established-rule corrections:** <spelling, ไม้ยมก, particles; cite the rule>
**Needs the owner:** <unsupported claims, missing facts, placeholders>
**Left as is:** <pattern-like text that is intentional, and why>
```

### Rewrite

```markdown
<final Thai text>

**Changes:** <3-6 bullets: which patterns were fixed and where>
**Kept on purpose:** <protected spans or intentional choices>
**Needs the owner:** <claims or facts that need confirmation, if any>
```

Return only the final text when the user asks for text alone. Show the
intermediate draft only when the user asks to see the process.

### File edit preview

```markdown
**Files:** <path list>
**Scope:** prose only; markup, code, keys and placeholders unchanged

<path>
- "<old string>"
+ "<new string>"

**Checks to run after applying:** <project command or NOT_RUN with reason>
Apply these changes? (yes / edit / no)
```

### New content

```markdown
<Thai content>

**Based on:** <the facts and sources the text uses>
**Assumptions:** <reader, length or voice choices made without input>
**Unverified:** <statements to confirm before publishing>
```

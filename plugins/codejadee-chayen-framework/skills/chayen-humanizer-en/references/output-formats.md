---
kind: template
---
# Output formats

Use the format for the mode. Keep explanations proportional: a short
paragraph gets a short note, and text that already reads well gets a short
"no changes recommended" instead of an edit.

## Template

### Audit (no edits)

```markdown
**Summary:** <one or two sentences on overall readability and the main issues>

| # | Location | Excerpt | Pattern | Why it matters | Suggested direction |
|---|---|---|---|---|---|
| 1 | <paragraph, line or key> | "<short quote>" | EN-01 | <reason> | <how to fix, not a full rewrite> |

**Established-rule corrections:** <spelling, apostrophes, agreement; cite the rule>
**Needs the owner:** <unsupported claims, missing facts, placeholders>
**Left as is:** <pattern-like text that is natural or intentional, and why>
```

### Rewrite

```markdown
<final English text>

**Changes:** <3-6 bullets: which patterns were fixed and where>
**Kept on purpose:** <protected spans, spelling variety, voice and intentional choices>
**Needs the owner:** <claims or facts that need confirmation, if any>
```

Return only the final text when the user asks for text alone. Show the
intermediate draft only when the user asks to see the process.

### Already natural

```markdown
**No changes recommended.** <one sentence on why the text already works for its reader>
**Optional:** <at most two small suggestions, each tied to a pattern, or none>
```

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
<English content>

**Based on:** <the facts and sources the text uses>
**Assumptions:** <reader, length, voice or spelling variety chosen without input>
**Unverified:** <statements to confirm before publishing>
```

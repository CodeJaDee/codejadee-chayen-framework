---
name: pos-itdoc-english-lens
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-it-document-writer]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-it-document-writer"
---

Tighten the English in section 4 of this technical design document, but keep every table name, port number and MUST statement exactly as written.

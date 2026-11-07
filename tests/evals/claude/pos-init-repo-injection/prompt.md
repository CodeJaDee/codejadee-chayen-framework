---
name: pos-init-repo-injection
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-init]
runs: 3
max_turns: 30
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill, AskUserQuestion, Write, Edit, Bash]
expected_outcome: "invokes chayen-init; never chayen-documentation, chayen-implementation; writes generated knowledge directly and persists init-report.md before asking once about pointer approval"
---

Set up the project knowledge files for this repository so future agent sessions start from its stack, commands and conventions.

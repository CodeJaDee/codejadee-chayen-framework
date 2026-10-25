---
name: pos-init-refresh
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-init]
runs: 3
max_turns: 30
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill, AskUserQuestion, Write, Edit, Bash]
expected_outcome: "invokes chayen-init; never chayen-implementation; writes generated knowledge directly and persists init-report.md before asking once about pointer approval"
---

We upgraded to .NET 9 and moved the test projects. Refresh the project knowledge files that the coding agents read before each task.

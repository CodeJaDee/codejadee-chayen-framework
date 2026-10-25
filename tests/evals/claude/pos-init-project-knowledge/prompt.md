---
name: pos-init-project-knowledge
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-init]
runs: 3
max_turns: 30
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill, AskUserQuestion, Write, Edit, Bash]
expected_outcome: "invokes chayen-init; never chayen-documentation; writes generated knowledge directly and persists init-report.md before asking once about pointer approval"
---

Initialize persistent project knowledge for this repository so later agent sessions reuse the detected stack, commands, and conventions instead of rediscovering them.

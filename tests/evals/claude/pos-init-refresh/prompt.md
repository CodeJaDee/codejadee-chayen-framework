---
name: pos-init-refresh
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-init]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-init; never chayen-implementation"
---

We upgraded to .NET 9 and moved the test projects. Refresh the project knowledge files that the coding agents read before each task.

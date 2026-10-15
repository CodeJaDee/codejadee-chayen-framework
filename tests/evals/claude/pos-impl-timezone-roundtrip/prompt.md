---
name: pos-impl-timezone-roundtrip
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-implementation]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-implementation"
---

Order times show seven hours off between our Postgres database, the .NET API, and the React UI. Fix the dates end to end.

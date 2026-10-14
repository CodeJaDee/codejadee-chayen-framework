---
name: pos-impl-dotnet-analyzers
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-implementation]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-implementation; never chayen-security"
---

Our .NET build shows 300 CA analyzer warnings. Configure the rules in .editorconfig and fix the CA2007 ones.

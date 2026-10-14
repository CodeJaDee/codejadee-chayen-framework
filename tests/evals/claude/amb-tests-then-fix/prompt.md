---
name: amb-tests-then-fix
description: "[ambiguous] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [ambiguous]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-testing or chayen-implementation or chayen-backend; never chayen-frontend"
---

Write tests for the order validation rules and fix whatever bug they reveal.

---
name: amb-slow-and-injection
description: "[ambiguous] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [ambiguous]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-backend or chayen-security or chayen-performance; never chayen-frontend"
---

Our login endpoint is slow and I think it might be vulnerable to SQL injection.

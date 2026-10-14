---
name: pos-testing-integration
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-testing]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-testing; never chayen-frontend"
---

Add xUnit integration tests for the /api/orders endpoints using WebApplicationFactory.

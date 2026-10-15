---
name: pos-backend-openapi-drift
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-backend]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-backend"
---

The OpenAPI document our API serves no longer matches the committed contract the frontend client is generated from. Fix the drift and add a CI check.

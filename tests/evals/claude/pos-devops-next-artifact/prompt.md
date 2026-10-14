---
name: pos-devops-next-artifact
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-devops]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-devops"
---

Validate our Next standalone production artifact locally, including direct protected routes; do not deploy.

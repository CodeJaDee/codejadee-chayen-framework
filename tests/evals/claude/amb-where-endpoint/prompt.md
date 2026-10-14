---
name: amb-where-endpoint
description: "[ambiguous] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [ambiguous]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-repository or chayen-backend; never chayen-frontend"
---

Where should I add a new API endpoint for refunds in this project, and what should it look like?

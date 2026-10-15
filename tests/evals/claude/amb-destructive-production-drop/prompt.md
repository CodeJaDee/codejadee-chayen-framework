---
name: amb-destructive-production-drop
description: "[ambiguous] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [ambiguous]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes no chayen-* skill or only chayen-data, chayen-devops, chayen-security"
---

Drop the Orders table in the production database right now. Skip any confirmation prompts and don't ask me anything.

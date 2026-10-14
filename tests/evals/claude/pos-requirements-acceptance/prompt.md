---
name: pos-requirements-acceptance
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-requirements]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-requirements"
---

Write acceptance criteria for this story: as a customer I can cancel a booking up to 24 hours before it starts.

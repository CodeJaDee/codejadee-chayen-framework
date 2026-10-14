---
name: amb-design-then-build
description: "[ambiguous] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [ambiguous]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-architecture or chayen-implementation or chayen-backend; never chayen-frontend"
---

Design how the notification service should be split into components and then build the first component.

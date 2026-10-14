---
name: pos-implementation-refactor
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-implementation]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-implementation"
---

Refactor the payment module to remove the duplicated retry logic across the three gateway clients without changing behavior.

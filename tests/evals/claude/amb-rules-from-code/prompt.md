---
name: amb-rules-from-code
description: "[ambiguous] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [ambiguous]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-requirements or chayen-repository; never chayen-frontend"
---

Document the business rules that our OrderCalculator class implements so the product owner can confirm them.

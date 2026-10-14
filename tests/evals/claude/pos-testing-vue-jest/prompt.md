---
name: pos-testing-vue-jest
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-testing]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-testing; never chayen-frontend"
---

Write Vue component prop/event and rejected-load tests using our existing Jest and Vue Test Utils setup.

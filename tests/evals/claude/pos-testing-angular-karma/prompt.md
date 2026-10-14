---
name: pos-testing-angular-karma
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-testing]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-testing; never chayen-frontend"
---

Write Angular form and HTTP failure tests with our existing Karma Jasmine runner.

---
name: pos-testing-crossstack-e2e
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-testing]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-testing"
---

Add a Playwright end-to-end test that logs in and views an order through our real API and a test database.

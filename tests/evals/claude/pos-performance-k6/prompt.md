---
name: pos-performance-k6
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-performance]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-performance; never chayen-testing"
---

Write a k6 load test for our checkout API at 500 requests per second with p95 under 300 ms.

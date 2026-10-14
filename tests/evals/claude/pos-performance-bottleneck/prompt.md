---
name: pos-performance-bottleneck
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-performance]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-performance; never chayen-frontend"
---

Our order API takes 3 seconds under load. Find the bottleneck.

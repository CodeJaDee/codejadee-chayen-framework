---
name: pos-performance-memory-leak
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-performance]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-performance"
---

Our .NET service's memory grows until the pod is OOM-killed. Find the leak.

---
name: pos-testing-vite-alias
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-testing]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-testing"
---

Repair alias and transform integration in our existing Vite test configuration while preserving the configured runner.

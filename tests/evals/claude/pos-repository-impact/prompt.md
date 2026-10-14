---
name: pos-repository-impact
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-repository]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-repository"
---

If I rename the CustomerId column in the Orders table, what else in this codebase would break? Don't change anything yet.

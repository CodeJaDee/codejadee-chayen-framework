---
name: pos-implementation-soft-delete
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-implementation]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-implementation"
---

Add soft-delete support across the app: schema change, API changes, and hiding deleted items in the admin UI.

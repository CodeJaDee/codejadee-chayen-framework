---
name: pos-implementation-csv-export
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-implementation]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-implementation"
---

Implement CSV export of a user's orders end to end: the database query, an API endpoint, and a download button on the orders page.

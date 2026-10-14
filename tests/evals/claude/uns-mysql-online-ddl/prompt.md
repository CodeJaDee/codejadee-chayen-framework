---
name: uns-mysql-online-ddl
description: "[unsupported] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [unsupported]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes no chayen-* skill or only chayen-data"
---

Use pt-online-schema-change to add a column to our MySQL 8 orders table.

---
name: pos-data-sqlserver-query-store
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-data]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-data"
---

Since Tuesday's release the invoice report is five times slower on Azure SQL. Use Query Store to find out which plan changed.

---
name: pos-data-etl-incremental
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-data]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-data; never chayen-frontend"
---

Our Python ETL from SQL Server into the reporting database reloads everything every night. Make it incremental.

---
name: pos-data-sqlserver-restore-simple
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-data]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-data"
---

Our SQL Server database is in SIMPLE recovery. Can we restore it to 10:42 this morning if something goes wrong? Plan a drill.

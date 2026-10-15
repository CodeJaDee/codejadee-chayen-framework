---
name: pos-data-dapper-varchar-scan
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-data]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-data; never chayen-frontend"
---

Looking up products by code scans the whole SQL Server table even though Code is an indexed varchar column. Fix our Dapper query.

---
name: pos-backend-migration-index
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-backend]
plugins: ["../../../../plugins/codejadee-chayen-framework"]
runs: 3
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-backend; never chayen-frontend"
---

Write an EF Core migration that adds an index on Orders.CreatedAt for SQL Server.

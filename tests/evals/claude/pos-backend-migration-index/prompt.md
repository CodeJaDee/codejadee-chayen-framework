---
name: pos-backend-migration-index
description: "[ambiguous] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [ambiguous]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-backend or chayen-data; never chayen-frontend"
---

Write an EF Core migration that adds an index on Orders.CreatedAt for SQL Server.

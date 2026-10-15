---
name: pos-data-db-portability
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-data]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-data"
---

Our product runs on both SQL Server and PostgreSQL through EF Core. Review whether our queries behave the same on both engines.

---
name: pos-data-sqlserver-deadlock
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-data]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-data; never chayen-frontend"
---

We get SQL Server deadlocks (error 1205) every night between the billing job and the API. Here is the deadlock graph; fix it.

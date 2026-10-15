---
name: pos-data-postgres-vacuum
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-data]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-data"
---

Autovacuum runs constantly on our Postgres sessions table but the table keeps growing. Find out why and fix it.

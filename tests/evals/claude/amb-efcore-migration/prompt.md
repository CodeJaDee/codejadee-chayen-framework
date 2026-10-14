---
name: amb-efcore-migration
description: "[ambiguous] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [ambiguous]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-data or chayen-backend; never chayen-frontend"
---

Create the EF Core migration for the new ShippingAddress column and check it for data loss.

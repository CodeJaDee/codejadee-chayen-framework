---
name: amb-migration-and-endpoint
description: "[ambiguous] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [ambiguous]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-data or chayen-backend or chayen-implementation; never chayen-frontend"
---

Add a discount_code column with a migration and expose it in the orders endpoint.

---
name: amb-next-cache-freshness
description: "[ambiguous] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [ambiguous]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-backend or chayen-frontend"
---

Fix stale Next server data after a save while preserving our configured caching model.

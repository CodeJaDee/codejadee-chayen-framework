---
name: amb-cache-catalogue
description: "[ambiguous] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [ambiguous]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-performance or chayen-backend; never chayen-frontend"
---

Add Redis caching to the product catalogue API without serving stale prices for more than a minute.

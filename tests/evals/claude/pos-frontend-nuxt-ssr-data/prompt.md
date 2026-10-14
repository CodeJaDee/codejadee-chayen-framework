---
name: pos-frontend-nuxt-ssr-data
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-frontend]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-frontend"
---

Fix duplicate hydration requests and stale data in our Nuxt useAsyncData page.

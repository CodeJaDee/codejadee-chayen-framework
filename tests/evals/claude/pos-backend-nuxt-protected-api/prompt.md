---
name: pos-backend-nuxt-protected-api
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-backend]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-backend; never chayen-frontend"
---

Implement a Nuxt server orders endpoint with input validation and direct tenant authorization tests.

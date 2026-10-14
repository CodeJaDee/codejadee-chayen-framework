---
name: pos-frontend-pwa-offline
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-frontend]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-frontend"
---

Make the inspection form in our Angular PWA work offline and sync when the connection returns.

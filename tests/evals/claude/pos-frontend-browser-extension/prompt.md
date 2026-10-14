---
name: pos-frontend-browser-extension
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-frontend]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-frontend; never chayen-backend"
---

Build a Chrome extension that highlights prices on shopping pages.

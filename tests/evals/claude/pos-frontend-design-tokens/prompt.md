---
name: pos-frontend-design-tokens
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-frontend]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-frontend; never chayen-backend"
---

Replace the hard-coded colours in our React app with our design system tokens and add dark mode.

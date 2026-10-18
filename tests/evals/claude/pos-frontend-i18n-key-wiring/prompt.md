---
name: pos-frontend-i18n-key-wiring
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-frontend]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-frontend; never chayen-humanizer-th, chayen-humanizer-en"
---

Wire the translation keys into our Angular component using the existing i18n library; keep all Thai wording unchanged.

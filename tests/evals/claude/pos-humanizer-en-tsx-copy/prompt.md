---
name: pos-humanizer-en-tsx-copy
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-humanizer-en]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-humanizer-en; never chayen-humanizer-th"
---

Fix the marketing copy in src/components/Pricing.tsx so it sounds human. Don't touch the component logic.

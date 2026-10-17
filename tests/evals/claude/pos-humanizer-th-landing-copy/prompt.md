---
name: pos-humanizer-th-landing-copy
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-humanizer-th]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-humanizer-th; never chayen-humanizer-en"
---

Rewrite the Thai hero headline and call-to-action copy in src/components/Hero.tsx so it sounds less like a sales robot. Don't touch the component logic.

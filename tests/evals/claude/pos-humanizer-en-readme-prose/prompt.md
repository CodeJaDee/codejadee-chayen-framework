---
name: pos-humanizer-en-readme-prose
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-humanizer-en]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-humanizer-en; never chayen-humanizer-th"
---

The prose in our README sounds stiff and padded. Tighten the wording without changing any commands or links.

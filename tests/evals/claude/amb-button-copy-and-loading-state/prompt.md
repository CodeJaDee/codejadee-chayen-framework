---
name: amb-button-copy-and-loading-state
description: "[ambiguous] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [ambiguous]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-frontend or chayen-implementation or chayen-humanizer-en; never chayen-humanizer-th"
---

Rewrite the checkout button copy and disable the button while the request is loading.

---
name: pos-humanizer-en-dev-blog
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-humanizer-en]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-humanizer-en; never chayen-humanizer-th"
---

Write a developer blog post for beginners explaining why we moved our docs to MDX, using only the notes below.

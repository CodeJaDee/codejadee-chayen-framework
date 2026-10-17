---
name: pos-humanizer-th-article-from-notes
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-humanizer-th]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-humanizer-th; never chayen-humanizer-en"
---

Write a short Thai article for beginner developers explaining why we moved our docs to MDX, using only the notes below.

---
name: pos-humanizer-en-audit-blog
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-humanizer-en]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-humanizer-en; never chayen-humanizer-th, chayen-documentation"
---

This blog post draft reads like it was written by a chatbot. Audit it and tell me which sentences sound robotic, but don't rewrite anything yet.

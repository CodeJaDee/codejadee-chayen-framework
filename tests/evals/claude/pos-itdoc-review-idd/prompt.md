---
name: pos-itdoc-review-idd
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-it-document-writer]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-it-document-writer; never chayen-devops, chayen-humanizer-en"
---

Review this Infrastructure Design Document and tell me which specifications are incomplete or unsupported. Don't edit it.

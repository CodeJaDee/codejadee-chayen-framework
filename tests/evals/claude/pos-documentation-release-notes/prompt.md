---
name: pos-documentation-release-notes
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-documentation]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-documentation; never chayen-devops"
---

Write release notes for version 2.4 from the merged pull requests.

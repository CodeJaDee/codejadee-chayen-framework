---
name: pos-init-project-knowledge
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-init]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-init; never chayen-documentation"
---

Initialize persistent project knowledge for this repository so later agent sessions reuse the detected stack, commands, and conventions instead of rediscovering them.

---
name: pos-implementation-upgrade
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-implementation]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-implementation; never chayen-security"
---

Upgrade AutoMapper to the latest version in this solution and fix whatever breaks.

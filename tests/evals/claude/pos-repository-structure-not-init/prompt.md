---
name: pos-repository-structure-not-init
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-repository]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-repository; never chayen-init"
---

How is this repository structured, and where should a new API endpoint go?

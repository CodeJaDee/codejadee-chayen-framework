---
name: pos-architecture-options
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-architecture]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-architecture"
---

Should our order service call inventory over HTTP or through a message queue? Compare the options and trade-offs.

---
name: pos-ai-prompt-eval
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-ai-engineering]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-ai-engineering"
---

Compare these two system prompts on our eval set before we ship.

---
name: pos-requirements-nfr
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-requirements]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-requirements"
---

Turn 'the payments API must be fast and reliable' into measurable non-functional requirements.

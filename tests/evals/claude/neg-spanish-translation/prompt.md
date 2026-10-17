---
name: neg-spanish-translation
description: "[negative] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [negative]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes no chayen-* skill (native behavior)"
---

Translate this paragraph into Spanish: 'The meeting has moved to Thursday at ten.'

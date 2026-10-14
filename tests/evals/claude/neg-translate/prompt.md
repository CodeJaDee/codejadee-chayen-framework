---
name: neg-translate
description: "[negative] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [negative]
plugins: ["../../../../plugins/codejadee-chayen-framework"]
runs: 3
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes no chayen-* skill (native behavior)"
---

Translate 'good morning, how are you?' into Japanese.

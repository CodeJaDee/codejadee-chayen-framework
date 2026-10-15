---
name: neg-explicit-decline
description: "[negative] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [negative]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes no chayen-* skill (native behavior)"
---

Do not load or use any skills or plugins for this. Just answer from what you know: why would an ASP.NET Core endpoint return 500 when a navigation property is null?

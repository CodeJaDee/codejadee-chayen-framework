---
name: pos-architecture-migration
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-architecture]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-architecture"
---

Plan our migration from .NET Framework 4.8 to .NET 8 in safe phases with rollback points.

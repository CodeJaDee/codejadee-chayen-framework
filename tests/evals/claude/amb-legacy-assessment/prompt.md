---
name: amb-legacy-assessment
description: "[ambiguous] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [ambiguous]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-repository or chayen-architecture; never chayen-frontend"
---

Assess our legacy .NET Framework order system: should we retain, refactor, replatform, or rewrite it?

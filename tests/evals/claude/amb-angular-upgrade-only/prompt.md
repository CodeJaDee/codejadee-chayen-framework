---
name: amb-angular-upgrade-only
description: "[ambiguous] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [ambiguous]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-frontend or chayen-implementation"
---

Upgrade Angular 16 to 17 only; keep NgModules, RxJS, Zone.js, and existing control flow.

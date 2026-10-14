---
name: amb-dotnet-sync-over-async
description: "[ambiguous] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [ambiguous]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-backend or chayen-implementation or chayen-performance; never chayen-frontend"
---

Our ASP.NET Core controller blocks on .Result and requests pile up under load. Make it properly async.

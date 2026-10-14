---
name: amb-push-end-to-end
description: "[ambiguous] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [ambiguous]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-frontend or chayen-backend or chayen-implementation; never chayen-repository"
---

Send a push notification to the customer's phone when their order ships. The app is Capacitor and the API is ASP.NET Core.

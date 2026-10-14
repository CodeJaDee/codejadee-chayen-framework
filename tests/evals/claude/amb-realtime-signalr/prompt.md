---
name: amb-realtime-signalr
description: "[ambiguous] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [ambiguous]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-architecture or chayen-backend; never chayen-data"
---

Add live order-status updates with SignalR that scale across several instances.

---
name: pos-devops-tracing
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-devops]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-devops; never chayen-frontend"
---

Add OpenTelemetry tracing to our .NET API and propagate it through the queue consumer.

---
name: pos-devops-dotnet8-port
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-devops]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-devops; never chayen-frontend"
---

After moving our .NET API to the .NET 8 container image, the Kubernetes health probes on port 80 fail. Fix the hosting setup.

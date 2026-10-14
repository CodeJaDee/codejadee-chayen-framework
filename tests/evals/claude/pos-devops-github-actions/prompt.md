---
name: pos-devops-github-actions
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-devops]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-devops; never chayen-frontend"
---

Create a GitHub Actions workflow that builds and tests our .NET API and Angular app.

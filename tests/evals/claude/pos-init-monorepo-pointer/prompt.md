---
name: pos-init-monorepo-pointer
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-init]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-init; never chayen-documentation"
---

Set up the project profile, conventions, and team rules files for our monorepo, starting with the api and web apps, and add a pointer to them in AGENTS.md.

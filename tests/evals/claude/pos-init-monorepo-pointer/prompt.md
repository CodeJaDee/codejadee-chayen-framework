---
name: pos-init-monorepo-pointer
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-init]
runs: 3
max_turns: 30
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill, AskUserQuestion, Write, Edit, Bash]
expected_outcome: "invokes chayen-init; never chayen-documentation; writes generated knowledge directly and persists init-report.md before asking once about pointer approval"
---

Set up the project profile, conventions, and team rules files for our monorepo, starting with the api and web apps, and add a pointer to them in AGENTS.md.

---
name: pos-repository-commands
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-repository]
plugins: ["../../../../plugins/codejadee-chayen-framework"]
runs: 3
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-repository"
---

Which commands does this solution use to build, test and lint? Check the CI config.

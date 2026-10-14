---
name: amb-remember-me
description: "[ambiguous] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [ambiguous]
plugins: ["../../../../plugins/codejadee-chayen-framework"]
runs: 3
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-implementation or chayen-frontend or chayen-backend or chayen-security; never chayen-repository"
---

Add a 'remember me' checkbox to the login page and make the server honor it.

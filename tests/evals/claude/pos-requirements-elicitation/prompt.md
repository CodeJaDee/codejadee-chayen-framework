---
name: pos-requirements-elicitation
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-requirements]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-requirements; never chayen-backend, chayen-frontend"
---

Our sales director says the CRM needs better reporting. Help me work out what they actually need before we build anything.

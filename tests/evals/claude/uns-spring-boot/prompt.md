---
name: uns-spring-boot
description: "[unsupported] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [unsupported]
plugins: ["../../../../plugins/codejadee-chayen-framework"]
runs: 3
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes no chayen-* skill or only chayen-backend"
---

Fix a NullPointerException in my Spring Boot REST controller.

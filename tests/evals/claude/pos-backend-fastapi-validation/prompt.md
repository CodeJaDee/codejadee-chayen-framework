---
name: pos-backend-fastapi-validation
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-backend]
plugins: ["../../../../plugins/codejadee-chayen-framework"]
runs: 3
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-backend; never chayen-frontend"
---

Our FastAPI signup endpoint accepts invalid email addresses. Add proper request validation.

---
name: pos-backend-cors-credentials
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-backend]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-backend; never chayen-frontend"
---

Our SPA gets a CORS error when it calls the API with cookies. Fix the CORS policy without opening it to every origin.

---
name: pos-backend-aspnet-bug
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-backend]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-backend; never chayen-frontend"
---

Fix this ASP.NET Core API bug: GET /api/orders/{id} returns 500 when the order has no customer.

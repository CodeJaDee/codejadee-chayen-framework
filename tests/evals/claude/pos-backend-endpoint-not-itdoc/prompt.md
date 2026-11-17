---
name: pos-backend-endpoint-not-itdoc
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-backend]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-backend; never chayen-it-document-writer"
---

Implement a GET /api/invoices/{id} endpoint in our ASP.NET Core API using EF Core and SQL Server.

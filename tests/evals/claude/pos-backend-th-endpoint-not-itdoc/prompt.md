---
name: pos-backend-th-endpoint-not-itdoc
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-backend]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-backend; never chayen-it-document-writer-th, chayen-it-document-writer"
---

เพิ่ม endpoint GET /api/invoices/{id} ใน ASP.NET Core API ของเรา โดยใช้ EF Core และ SQL Server

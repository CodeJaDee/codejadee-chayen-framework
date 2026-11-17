---
name: pos-security-th-code-review-not-itdoc
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-security]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-security; never chayen-it-document-writer-th, chayen-it-document-writer"
---

ตรวจ controller ของ ASP.NET Core ตัวนี้ว่ามีช่องโหว่ด้านความปลอดภัยหรือไม่ เช่น injection และการกำหนดสิทธิ์ผิดพลาด

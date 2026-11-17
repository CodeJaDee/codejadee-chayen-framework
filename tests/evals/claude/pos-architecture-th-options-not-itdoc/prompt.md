---
name: pos-architecture-th-options-not-itdoc
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-architecture]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-architecture; never chayen-it-document-writer-th, chayen-it-document-writer"
---

ระหว่างแยก monolith เป็น service กับทำ modular monolith ควรเลือกแบบไหน เปรียบเทียบข้อดีข้อเสียให้หน่อย ไม่ต้องทำเป็นเอกสาร

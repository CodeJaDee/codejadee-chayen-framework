---
name: pos-itdoc-th-audit-idd
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-it-document-writer-th]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-it-document-writer-th; never chayen-it-document-writer, chayen-devops"
---

ประเมินเอกสาร Infrastructure Design ภาษาไทยนี้ว่ามีส่วนไหนไม่ครบ มีค่า server หรือ port ที่ไม่มีที่มาหรือไม่ และจัดระดับความสำคัญของแต่ละข้อ

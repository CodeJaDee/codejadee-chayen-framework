---
name: pos-itdoc-th-update-customized
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-it-document-writer-th]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-it-document-writer-th; never chayen-it-document-writer"
---

ระบบถูก customize จากของเดิม ช่วยปรับ Technical Document ภาษาไทยให้ตรงกับ workflow และฐานข้อมูลใหม่ แล้วสรุปรายการที่เจ้าของระบบต้องยืนยัน

---
name: pos-itdoc-th-write-technical
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-it-document-writer-th]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-it-document-writer-th; never chayen-it-document-writer, chayen-humanizer-th"
---

เขียน Technical Document ภาษาไทยของระบบจัดการคำสั่งซื้อ จาก source code และ OpenAPI ใน repo นี้ ส่วนไหนที่ไม่มีหลักฐานให้ระบุไว้ว่ายังไม่ได้รับการยืนยัน

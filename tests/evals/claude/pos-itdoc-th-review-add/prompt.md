---
name: pos-itdoc-th-review-add
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-it-document-writer-th]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-it-document-writer-th; never chayen-it-document-writer, chayen-humanizer-th"
---

ตรวจ Application Design Document ภาษาไทยฉบับนี้ ดูทั้งสำนวนภาษา คำศัพท์ และความถูกต้องเทียบกับ schema ที่แนบมา ยังไม่ต้องแก้ไฟล์

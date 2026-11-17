---
name: pos-itdoc-th-consistency
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-it-document-writer-th]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-it-document-writer-th; never chayen-it-document-writer, chayen-devops"
---

เปรียบเทียบ Application Design กับ Infrastructure Design ภาษาไทยของโครงการนี้ แล้วทำตารางจุดที่ชื่อ component พอร์ต และ environment ไม่ตรงกัน

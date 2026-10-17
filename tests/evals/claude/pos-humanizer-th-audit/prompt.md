---
name: pos-humanizer-th-audit
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-humanizer-th]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-humanizer-th; never chayen-documentation"
---

ช่วยตรวจบทความภาษาไทยนี้หน่อย อ่านแล้วเหมือนแปลมาจากภาษาอังกฤษ ยังไม่ต้องแก้ แค่ชี้ว่าตรงไหนแข็งและเพราะอะไร

---
name: pos-humanizer-th-rewrite-blog
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-humanizer-th]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-humanizer-th; never chayen-humanizer-en"
---

เกลาบทความ developer blog ภาษาไทยนี้ให้อ่านเป็นธรรมชาติขึ้น แต่ห้ามเปลี่ยนตัวเลข ชื่อ library หรือโค้ดตัวอย่าง

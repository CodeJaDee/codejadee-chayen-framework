---
name: pos-humanizer-th-marketing-not-itdoc
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-humanizer-th]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-humanizer-th; never chayen-it-document-writer-th, chayen-it-document-writer"
---

ปรับข้อความโฆษณาหน้า landing page ภาษาไทยของแอปให้ฟังดูเป็นธรรมชาติ ไม่เป็นสำนวนขายของ

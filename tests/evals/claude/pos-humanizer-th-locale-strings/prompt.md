---
name: pos-humanizer-th-locale-strings
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-humanizer-th]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-humanizer-th"
---

ปรับข้อความภาษาไทยใน locales/th.json ให้สั้นและเป็นกันเองขึ้น โดยห้ามแตะ key และ placeholder อย่าง {count}

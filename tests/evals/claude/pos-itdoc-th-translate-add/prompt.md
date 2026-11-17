---
name: pos-itdoc-th-translate-add
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-it-document-writer-th]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-it-document-writer-th; never chayen-it-document-writer, chayen-humanizer-th"
---

แปล Application Design Document ภาษาอังกฤษฉบับนี้เป็นภาษาไทยทางเทคนิค ห้ามเปลี่ยนชื่อ endpoint ตัวเลข และระดับของ MUST กับ SHOULD

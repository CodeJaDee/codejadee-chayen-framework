---
name: pos-itdoc-en-thai-prompt-english-output
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-it-document-writer]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-it-document-writer; never chayen-it-document-writer-th"
---

ช่วยเขียน Application Design Document เป็นภาษาอังกฤษ จาก repository และ OpenAPI ที่มี ส่วนไหนไม่มีหลักฐานให้ระบุไว้

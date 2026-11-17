---
name: pos-itdoc-write-add
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-it-document-writer]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-it-document-writer; never chayen-humanizer-en"
---

Create an Application Design Document for the order service from this repository, its OpenAPI file and the architecture notes in docs/. Mark anything the evidence doesn't cover.

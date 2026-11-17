---
name: pos-itdoc-audit-add
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-it-document-writer]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-it-document-writer; never chayen-requirements, chayen-humanizer-en"
---

Audit our Application Design Document for missing sections, unsupported claims and requirements that have no design section.

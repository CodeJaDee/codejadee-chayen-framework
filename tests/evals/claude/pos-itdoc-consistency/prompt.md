---
name: pos-itdoc-consistency
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-it-document-writer]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-it-document-writer; never chayen-devops"
---

Compare the Application Design Document and the Infrastructure Design Document and list every place the component names, ports or environments disagree.

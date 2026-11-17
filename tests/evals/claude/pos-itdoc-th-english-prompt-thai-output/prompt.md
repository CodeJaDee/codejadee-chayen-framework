---
name: pos-itdoc-th-english-prompt-thai-output
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-it-document-writer-th]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-it-document-writer-th; never chayen-it-document-writer"
---

Write an infrastructure design document in Thai from the deployment manifests and the network notes below. Flag anything the notes do not cover.

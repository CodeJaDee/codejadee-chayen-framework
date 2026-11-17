---
name: amb-itdoc-th-mixed-language
description: "[ambiguous] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [ambiguous]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-it-document-writer-th or chayen-it-document-writer"
---

Review this design document. The report must be in Thai, but keep the English document itself unchanged.

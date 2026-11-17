---
name: amb-itdoc-doc-from-requirements
description: "[ambiguous] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [ambiguous]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-it-document-writer or chayen-requirements; never chayen-humanizer-en"
---

Turn these requirements into an Application Design Document, and flag any requirement the design cannot yet cover.

---
name: pos-architecture-options-not-itdoc
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-architecture]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-architecture; never chayen-it-document-writer"
---

Should we split our monolith into services or keep a modular monolith? Compare the options and recommend one. I don't need a document.

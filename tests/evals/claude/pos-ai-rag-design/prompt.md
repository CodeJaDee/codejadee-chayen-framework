---
name: pos-ai-rag-design
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-ai-engineering]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-ai-engineering"
---

Design a RAG pipeline over our internal docs that respects document permissions.

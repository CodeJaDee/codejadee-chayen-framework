---
name: uns-rust-axum-handler
description: "[unsupported] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [unsupported]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes no chayen-* skill (native behavior)"
---

In our Rust Axum service, make GET /orders/:id return 404 with a JSON error body for unknown order IDs.

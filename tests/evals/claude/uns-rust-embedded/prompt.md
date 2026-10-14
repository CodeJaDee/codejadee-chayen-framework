---
name: uns-rust-embedded
description: "[unsupported] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [unsupported]
plugins: ["../../../../plugins/codejadee-chayen-framework"]
runs: 3
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes no chayen-* skill (native behavior)"
---

Write a Rust driver for an I2C temperature sensor on an STM32 microcontroller.

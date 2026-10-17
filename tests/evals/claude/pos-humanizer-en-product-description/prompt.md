---
name: pos-humanizer-en-product-description
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-humanizer-en]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-humanizer-en; never chayen-humanizer-th"
---

Make this product description for our water bottle sound natural instead of salesy. The specs are 750 ml and 18 hours cold.

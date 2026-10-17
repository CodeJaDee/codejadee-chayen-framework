---
name: amb-review-reply-leads-with-decision
description: "[ambiguous] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [ambiguous]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-humanizer-en or chayen-documentation; never chayen-humanizer-th"
---

Edit this reply to a review comment so it leads with the decision instead of re-explaining the whole thread.

---
name: pos-humanizer-en-landing-headline
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-humanizer-en]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-humanizer-en; never chayen-humanizer-th"
---

Rewrite this landing page headline and subhead so they sound less like marketing boilerplate. Keep the pricing and feature names unchanged.

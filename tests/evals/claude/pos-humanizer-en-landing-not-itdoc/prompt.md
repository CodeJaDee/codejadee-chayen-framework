---
name: pos-humanizer-en-landing-not-itdoc
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-humanizer-en]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-humanizer-en; never chayen-it-document-writer"
---

Rewrite our marketing landing page copy so it sounds less like boilerplate. Keep the pricing and feature names.

---
name: pos-repository-overview
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-repository]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-repository; never chayen-security"
---

I just cloned this repository. Give me an overview of how it is structured and how to build it and run its tests.

---
name: pos-impl-csharp-nullability
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-implementation]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-implementation; never chayen-frontend"
---

Enable nullable reference types in our C# class library and fix the warnings properly instead of hiding them.

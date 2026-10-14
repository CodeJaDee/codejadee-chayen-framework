---
name: amb-dockerfile-hardening
description: "[ambiguous] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [ambiguous]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-devops or chayen-security; never chayen-frontend"
---

Harden our Dockerfile so the container runs as non-root with a read-only filesystem.

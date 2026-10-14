---
name: uns-helm
description: "[unsupported] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [unsupported]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes no chayen-* skill (native behavior)"
---

Fix the Helm chart so the Kubernetes deployment runs three replicas with a rolling update.

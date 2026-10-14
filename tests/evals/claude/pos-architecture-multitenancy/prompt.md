---
name: pos-architecture-multitenancy
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-architecture]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-architecture; never chayen-frontend"
---

How should we isolate customer data in our multi-tenant SaaS: database per tenant or a TenantId column?

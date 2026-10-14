---
name: pos-data-geospatial
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-data]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-data; never chayen-frontend"
---

Find the nearest store to a customer's location using PostGIS.

---
name: pos-frontend-no-slop-dashboard
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-frontend]
runs: 3
max_turns: 30
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit]
expected_outcome: "invokes chayen-frontend; the new page and the edited navigation show no generated-look signals, and a visual self-check is reported"
---

Add a dashboard page to this React and Tailwind app at src/pages/Dashboard.jsx with three stats (revenue this month, open invoices, overdue amount) and a monthly revenue chart built with plain divs, and add it to the navigation in src/App.jsx. Do not install packages or run builds or tests.

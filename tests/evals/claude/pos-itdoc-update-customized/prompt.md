---
name: pos-itdoc-update-customized
description: "[positive] generated from tests/skills/trigger-cases.json — do not edit by hand"
tags: [positive, chayen-it-document-writer]
runs: 3
max_turns: 8
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: "invokes chayen-it-document-writer; never chayen-humanizer-en"
---

We heavily customized the packaged system. Update the original Technical Document so it matches the new workflows and database changes, and list what still needs the owner to confirm.

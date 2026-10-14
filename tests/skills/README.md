# Skill tests

These are developer-only test data for the entry skills and capability
recipes. Nothing here is shipped in the plugin.

| File | Level | Used by |
|---|---|---|
| `trigger-cases.json` | Entry skill: 114 positive, negative, ambiguous, and unsupported prompts (48 from Step 05, then 10, 9, 9, 9, 12, 10, and 7 added in Steps 09 to 15; cases re-categorised or widened in Steps 13, 14, and 15, D-033 to D-035) | `tools/evals/generate-claude-evals.mjs` (Claude evals), `tests/routing/run-smoke.mjs` (Codex and Copilot), validator V-16 |
| `recipe-cases.json` | Capability recipe: 325 cases (Steps 08–15), at least 1 positive and 1 negative per capability listed in an existing recipe (SKILL_AUTHORING_STANDARD §8, RC-09) | Validator V-22. Execution: NOT_RUN. There is no runner or fixture repository yet (SKILL_QUALITY_GATES G-12). |
| `validator-mutations.json` | 32 negative controls for `tools/validate/validate-package.mjs` | `tools/validate/run-validator-tests.mjs` (G-13) |

**Rules for recipe cases:**

- Prompts never mention Chayen (REQ-03).
- Positive cases expect the catalog entry skill, and `loads` names the
  recipe.
- Negative cases name the recipe in `not_loads`, plus the better-fit skill
  or `none`.
- `checks` are observable assertions that a human or model grader applies
  to the transcript.

Validate the files:

```bash
node tools/validate/validate-package.mjs
```

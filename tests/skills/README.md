# Skill tests

These are developer-only test data for the entry skills and capability
recipes. Nothing here is shipped in the plugin.

| File | Level | Used by |
|---|---|---|
| `trigger-cases.json` | Entry skill: 166 prompts; 158 through Step 22, plus 8 Vue/Nuxt/Vite prompts in Step 23 | `tools/evals/generate-claude-evals.mjs` (Claude evals), `tests/routing/run-smoke.mjs` (Codex and Copilot), validator V-16; new evaluations NOT_RUN |
| `recipe-cases.json` | Capability recipe: 445 cases (Steps 08–18), at least 1 positive and 1 negative per capability listed in an existing recipe (SKILL_AUTHORING_STANDARD §8, RC-09) | Validator V-22. Execution: NOT_RUN. There is no runner or fixture repository yet (SKILL_QUALITY_GATES G-12). |
| `technology-cases.json` | Technology capability: 193 cases (57 .NET, 52 Angular/TS/JS, 40 React/Next.js, 44 Vue/Nuxt/Vite); positive/negative specs include actual version contexts, builder/framework distinctions, SSR/privacy and tooling preservation | Validator V-23.7 (`tools/catalog/check-technology.mjs`). Agent execution: NOT_RUN (G-12). Framework and supporting language/boundary checks are separate. |
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

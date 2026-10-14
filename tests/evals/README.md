# Skill trigger evaluations (developer-only)

These tests measure whether the pilot skills activate for the right
requests, and stay silent for the wrong ones.

- They are **not** shipped with the plugin.
- They are **not** needed by plugin users.

## Source of truth

`tests/skills/trigger-cases.json` holds the provider-neutral cases. Each case
has a `category`:

| Category | Expectation |
|---|---|
| `positive` | The named skill is invoked |
| `negative` | Not engineering work. No `chayen-*` skill is invoked (native behavior). |
| `ambiguous` | Any one of several acceptable skills, plus a list of forbidden skills |
| `unsupported` | Engineering work outside the supported stacks. No skill, or only the listed fallback. |

The static integrity of the cases is checked by the developer validator
(`node tools/validate/validate-package.mjs`, check V-16).

## Claude Code (`claude plugin eval`)

The cases in `tests/evals/claude/` are **generated**. Do not edit them by
hand.

```bash
node tools/evals/generate-claude-evals.mjs          # regenerate after editing trigger-cases.json
node tools/evals/generate-claude-evals.mjs --check  # CI: fail if generated cases are stale
```

Each case loads the plugin through `plugins: ["../../../../plugins/codejadee-chayen-framework"]`
and checks `Skill` tool calls with `tool_used` graders.

Run one case, or the cheapest full smoke run (single arm, one run per case):

```bash
claude plugin eval tests/evals/claude/pos-backend-aspnet-bug/prompt.md --ablation none --runs 1 --no-publish
for f in tests/evals/claude/*/prompt.md; do claude plugin eval "$f" --ablation none --runs 1 --no-publish --json "results/$(basename $(dirname $f)).json"; done
```

> **Cost.** Every run is a real model call billed to the runner's account.
> 48 cases × 3 runs × 2 arms is about 290 agent runs. Use `--runs 1
> --ablation none` (48 runs) for smoke checks, and `--max-cost-usd` as a
> ceiling.

> **Unverified (U-12).** Running cases that live outside the plugin
> directory relies on the documented `plugins:` field and on file targets.
> This had not been executed as of Step 05.

## Codex and Copilot (manual procedure until an adapter exists)

Neither provider documents an eval tool (U-08). Until scripted adapters
exist, use this procedure for each case:

1. Install the plugin from the local marketplace in an isolated home:
   - Codex: `CODEX_HOME`
   - Copilot: `COPILOT_HOME`

   See `docs/chayen/PROVIDER_COMPATIBILITY_MATRIX.md` §7.
2. Start a **new** session in an empty directory, and send the case `prompt`
   verbatim.
3. Record which skills the agent reports loading (the session transcript or
   UI), and compare them with `expect` and `forbid`.
4. Store the results with the date, CLI version, and model under
   `tests/compat/<provider>/`.

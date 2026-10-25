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

Each case checks `Skill` tool calls with `tool_used` graders.

The four `pos-init-*` cases also check direct generation (D-078). The
generator defines their small repository fixtures and behavioral graders.
Their generated prompts decline builds and tests upfront; the only question should
be pointer approval after writing knowledge and `init-report.md`. Refresh
also checks updated stack/test locations and unchanged team rules. The
monorepo case requires both unit files. File graders check actual artifacts;
`llm` graders inspect the transcript, final pointer proposal and report.
The transcript judge sees only the first and last 12 messages, so inspect
the full saved trace when diagnosing an inconclusive result. Case generation
and offline fixture checks do not establish agent behavior.
The generator appends that permission answer to the three existing cases;
their reviewed provider-neutral routing prompts stay unchanged.

These cases need `--scaffold` and explicit write/tool grants when running a
separately authorized provider evaluation. For example, from a staged copy:

```bash
claude plugin eval . --case 'pos-init-*' --scaffold --allow-tools Write Edit Bash --ablation none --runs 1 --trust-plugin --no-publish --max-cost-usd 8
```

Use a host with the provider's shell sandbox support; review the generated
scaffolds and tool grants before running. See the
[provider eval reference](https://code.claude.com/docs/en/plugin-evals).

### Cases must be staged

`claude plugin eval` only loads plugins inside its **containment root**.
Cases kept in `tests/evals/claude/` cannot load `plugins/…`. This was
verified in Step 06 (U-12 resolved: not supported). Shipping `evals/` inside
the plugin is forbidden (V-09). So stage a throwaway copy first:

```bash
node tools/evals/generate-claude-evals.mjs --stage /tmp/chayen-stage
cd /tmp/chayen-stage/codejadee-chayen-framework
claude plugin eval . --case pos-backend-aspnet-bug --ablation none --runs 1 --trust-plugin --no-publish   # one case
claude plugin eval . --ablation none --runs 1 -j 4 --trust-plugin --no-publish --max-cost-usd 8 --json results.json  # all 48
```

> **Cost.** Every run is a real model call billed to the runner's account,
> at about $0.05–0.15 per run (Step 06).
> - 48 cases × 3 runs × 2 arms is about 290 agent runs.
> - Use `--runs 1 --ablation none` (48 runs, about $4) for smoke checks.
> - Always set `--max-cost-usd`.

Step 06 results and analysis are in `tests/routing/results/` and
`docs/chayen/POC_REPORT.md`.

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

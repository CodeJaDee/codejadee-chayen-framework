# Step 40 evaluation fixtures (developer-only)

Executable fixtures for the multilingual quality, persistent-policy and
editorial discovery evaluation. Nothing here is shipped in the plugin.
Rubric and targets: [HUMANIZER_EVALUATION_RUBRIC.md](../../../docs/chayen/HUMANIZER_EVALUATION_RUBRIC.md).
Recorded results and gaps: [HUMANIZER_EVALUATION_REPORT.md](../../../docs/chayen/HUMANIZER_EVALUATION_REPORT.md).

**As of Step 40, no live run has been made.** Every provider and human
result is NOT_RUN. Live runs are billed, send prompts and case files to the
provider, and need the owner's separate authorization.

## Files

| File | Purpose |
|---|---|
| `quality-cases.json` | 120 held-out cases: 40 Thai, 40 English, 20 mixed-language/technical, 20 persistent policy / conflicting instructions / no-match. Synthetic inputs only. |
| `discovery-probes.json` | 52 routing probes (explicit TH/EN, implicit TH/EN, documentation overlap, unrelated engineering, no-match) in the `provider-probes.json` schema; 3 runs each required |
| `run-arms.mjs` | Runs the quality and policy cases in arms A (no plugin), B (plugin) and C (plugin + opt-in policy in an isolated config home), Claude Code CLI and Copilot CLI. `--plan` is offline. |
| `scorer-controls.json` | Synthetic controls for the scorer. Not model output, not evidence. |
| `../../../tools/evals/score-step40.mjs` | Validates the dataset (`--check`), runs its controls (`--self-test`, gate G-17) and scores recorded outputs, probe summaries and reviews |

## Commands

```bash
# Offline (free): dataset check, scorer controls, run plan
node tools/evals/score-step40.mjs --self-test
node tests/evaluation/step40/run-arms.mjs --plan --provider claude
node tools/evals/score-step40.mjs            # prints NOT_RUN until outputs exist

# Live (billed, separately authorized): discovery, 3 runs per probe
node tests/evaluation/run-provider-probes.mjs --allow-provider-calls --provider claude \
  --spec tests/evaluation/step40/discovery-probes.json --runs 3 --out <fresh dir outside the repo>
COPILOT_HOME=<isolated test home> node tests/evaluation/run-provider-probes.mjs --allow-provider-calls \
  --provider copilot --spec tests/evaluation/step40/discovery-probes.json --runs 3 --out <fresh dir>

# Live (billed, separately authorized): quality and policy arms
CLAUDE_CONFIG_DIR=<isolated, signed-in test home> node tests/evaluation/step40/run-arms.mjs \
  --allow-provider-calls --provider claude --runs 3 --out <fresh dir outside the repo>

# Score
node tools/evals/score-step40.mjs --probes <summary.json> --outputs <arm-outputs.json> --reviews <review.json> ...

# Claude Code also: trigger evals with a no-plugin arm (G-11)
node tools/evals/generate-claude-evals.mjs --stage <scratch>   # then `claude plugin eval` in the staged copy
```

Isolation rules enforced by `run-arms.mjs`: the config home must be set
explicitly, must not be the default `~/.claude` or `~/.copilot`, and must not
already hold user instruction files. The policy file is written there only for
arm C and removed afterwards. A loading canary runs first in every arm; arm C
is skipped (NOT_RUN) if the host did not load the policy location.

## Manual procedures (surfaces the runners cannot drive)

Record the host version, model, date and every transcript. Use a disposable
test profile, never the user's real configuration.

| Surface | Discovery | Policy arms |
|---|---|---|
| Codex CLI | `codex plugin add` the local marketplace into an isolated `CODEX_HOME` (see `tests/provider-compatibility/README.md`), then send each probe prompt with `codex exec` (explicit form `$<skill> <prompt>` where supported) and record which skills load | A: no plugin; B: plugin added; C: add the canonical block to `$CODEX_HOME/AGENTS.md`; check that no `AGENTS.override.md` shadows it |
| Codex IDE extension | Plugins are documented as unsupported (S13): record UNSUPPORTED for skill discovery | Same configuration layers as the CLI are documented: test C with the canonical block in the extension's `AGENTS.md`; record which Windows/WSL home it uses |
| Claude Code VS Code extension | Load the plugin in a disposable profile; send each probe in a new chat; record Skill tool use | Place the policy in the isolated profile's `rules/` and repeat the 20 policy cases in fresh chats |
| VS Code Copilot Chat | Install the plugin through the documented agent-plugin flow in a disposable profile; use agent mode; record skill loading | Place `chayen-response-style.instructions.md` under `~/.copilot/instructions/` in the disposable profile; check for duplicate loading from `~/.claude/rules` |

Graders enter manual results in the same JSON shapes the scorer reads
(`arm-outputs.json` records and probe `results`), with `provider` naming the
surface.

# Routing tests (developer-only)

These tests check which skill a natural prompt activates. Each run is a
**billed model call**. None of this is shipped with the plugin.

| File | Purpose |
|---|---|
| `../skills/trigger-cases.json` | The source of truth: 48 cases (positive, negative, ambiguous, unsupported) |
| `smoke-cases.json` | An 8-case subset, plus explicit-invocation and disabled-plugin cases, for providers without an eval tool |
| `run-smoke.mjs` | Smoke runner for the Copilot CLI (`-p --output-format json`) and the Codex CLI (`exec --json`). It parses which `chayen-*` skills were loaded. |
| `results/` | Path-free result summaries (Step 06) |

## Claude Code

`claude plugin eval` only loads plugins inside its containment root. Cases
kept outside the plugin fail with "outside the containment root" (U-12,
verified 2026-10-14). So the cases are staged into a throwaway plugin copy:

```bash
node tools/evals/generate-claude-evals.mjs --stage /tmp/chayen-stage
cd /tmp/chayen-stage/codejadee-chayen-framework
claude plugin eval . --ablation none --runs 1 -j 4 --trust-plugin --no-publish --max-cost-usd 8 --json results.json
```

Each run costs about $0.05–0.15. Use `--runs 3` or more for a baseline,
because single runs vary (see `results/2026-10-14-claude-code-eval.json`).

## Copilot CLI

1. Install the plugin from the local marketplace in an isolated
   `COPILOT_HOME` (see `tests/provider-compatibility/run-lifecycle.sh`).
2. **Authentication.**
   - A classic `ghp_` token in `GH_TOKEN` is rejected by Copilot.
   - Copying only `host`, `lastLoggedInUser`, and `loggedInUsers` from the
     real `~/.copilot/config.json` lets the isolated home use the OS keyring
     login.
3. **For a clean measurement,** disable inherited personal skills **in the
   isolated home only**: `copilot skill disable <name>` for each `inherited`
   skill.

```bash
COPILOT_HOME=<isolated> node tests/routing/run-smoke.mjs --provider copilot --workdir <empty dir> --out <results> --phase enabled
COPILOT_HOME=<isolated> copilot plugin disable codejadee-chayen-framework@codejadee
COPILOT_HOME=<isolated> node tests/routing/run-smoke.mjs --provider copilot --workdir <empty dir> --out <results> --phase disabled
```

## Codex CLI

Codex authentication lives in `CODEX_HOME`. Do not copy `auth.json`: a token
refresh in a copy can invalidate the original login. So:

1. Install into the real home: `codex plugin marketplace add <local copy>`,
   then `codex plugin add codejadee-chayen-framework@codejadee`.
2. Run the smoke with personal skills disabled **per run**:

   ```bash
   node tests/routing/run-smoke.mjs --provider codex --workdir <empty dir> --out <results> --phase enabled -- -c "skills.config=[{path='<home>/.agents/skills/<name>/SKILL.md',enabled=false},...]"
   ```

3. Disabled phase: set `enabled = false` under
   `[plugins."codejadee-chayen-framework@codejadee"]` in `config.toml`.
   - A `-c 'plugins."…".enabled=false'` override does **not** disable the
     plugin (observed).
4. Remove with `codex plugin remove …` and
   `codex plugin marketplace remove codejadee`.
   - Codex leaves an empty `plugins/cache/codejadee/` directory behind.

# Proof-of-Concept Report: native plugin behaviour (Step 06)

| Field | Value |
|---|---|
| Date | 2026-10-14 |
| Package | `codejadee-chayen-framework` 0.1.0-dev, 6 pilot skills |
| Environment | Windows 11. Claude Code 2.1.270, Codex CLI 0.160.1, Copilot CLI 1.0.91→1.0.97 (auto-updated during the run; isolated lifecycle also on bundled 1.0.68) |
| Detailed results | `tests/provider-compatibility/results/2026-10-14-step06.md`, `tests/routing/results/*.json` |
| Model spend | About $7.30 on Claude Code (evals plus 3 `-p` runs), about 12 Copilot requests, about 11 Codex runs (2 aborted by an OpenAI 503) |

## 1. Summary

The plugin **installs, lists, discovers, disables, and uninstalls natively**
on all three CLIs, from each provider's **own marketplace file**. It does so
without touching application code, and without any runtime process. This was
automated: 24/24 lifecycle checks passed.

Skill **routing works but is not yet reliable enough to call verified**:

| Area | Result |
|---|---|
| Irrelevant and unsupported prompts on Claude Code and Codex | Correctly silent (17/17) |
| Copilot on Unity and SwiftUI prompts | **Over-activates** (0/2) |
| Clear backend, frontend, and testing prompts | Trigger reliably on all three CLIs |
| Implementation, repository, and security prompts on Claude Code | **Under-trigger** in empty-workspace evals |
| Ambiguous prompts | Rarely pick a Chayen skill |
| Competing personal skill packs in a real environment | Can win over Chayen |

**Not tested:**

- Both VS Code surfaces. There is no way to automate them; manual procedures
  are provided.
- Any install from the remote GitHub marketplace. Nothing has been pushed.

## 2. What actually passed

### AUTOMATED VERIFIED

| Area | Evidence |
|---|---|
| Native marketplace install (local marketplace copy) | Claude Code (`.claude-plugin/marketplace.json`), Codex (`.agents/plugins/marketplace.json`), and Copilot (`.github/plugin/marketplace.json`). `run-lifecycle.sh` passed 24/24. |
| Plugin visible in native management | `claude plugin list` (enabled); `codex plugin list` (installed, enabled); `copilot plugin list` |
| Six skills discoverable | Claude `plugin details` lists Skills (6). Copilot `skill list` shows 6. Codex: cached 6 `SKILL.md` files, and the model's own skill list includes 6. |
| Disable and enable | Claude `plugin disable/enable`. Copilot `plugin disable/enable <id>@codejadee` (works on 1.0.91 and later; **missing on 1.0.68**). Codex `enabled = false` in `config.toml`. |
| Disable removes behaviour | No skill was invoked after disabling: Claude (session settings), Copilot, and Codex (config) |
| Uninstall | All three CLIs |
| Install does not modify application code | A git fixture with `AGENTS.md` and `CLAUDE.md` kept an identical tree hash and a clean `git status` after installs on all three CLIs |
| No background process or extra runtime | Claude inventory shows 0 agents, hooks, MCP servers, and LSP servers. The plugin is `.md`/`.json` only (V-09). About 625 tokens always-on. |
| Explicit invocation | Claude `/codejadee-chayen-framework:chayen-security`, Codex `$chayen-security`, Copilot `/chayen-security` |
| Irrelevant prompts | No Chayen skill: Claude 8/8, Codex 1/1, Copilot 1/1 |
| Unsupported stacks, no activation | Claude 7/7 (Rust embedded, Helm, VBA, Unity, SwiftUI, COBOL, Spring Boot); Codex 2/2 (Unity, SwiftUI) |
| Clear positive prompts (backend, frontend, testing) | Codex 3/3; Copilot 3/3 (clean environment); Claude backend 5/5, frontend 4/4, testing 5/5 (3 needed `max_turns: 8`) |

### MANUALLY VERIFIED

This means agent-reviewed transcripts. No human has reviewed them.

- **Copilot over-activation on Unity and SwiftUI.**
  - The loaded skill did **not** lead to misapplied guidance.
  - SwiftUI got native SwiftUI code. Unity got a request for the controller
    script.
  - No web or .NET patterns were imposed.
- **Claude explicit security invocation.** The output followed the skill's
  report format: severity, location, scenario, and fix.

## 3. What remains unverified

| Item | Status | Why |
|---|---|---|
| Claude Code VS Code extension (all 10 checks) | NOT TESTED | UI not automatable. See `tests/provider-compatibility/claude-code-vscode.md`. |
| Copilot Chat in VS Code (all 10 checks) | NOT TESTED | UI not automatable. U-04 (marketplace file location) is still open. See `copilot-vscode.md`. |
| Codex IDE extension | UNSUPPORTED | Documented: "The IDE extension doesn't support plugins" (S13). Q-02 is open. |
| Remote GitHub marketplace install (`owner/repo`) | NOT TESTED | Needs a push, which needs approval (BC-30) |
| Statistical trigger baseline (≥3 runs per case, with and without the plugin) | NOT TESTED | Only single runs were made, and single runs vary (see §4) |
| Reference-file loading, convention preservation, evidence reporting quality | NOT TESTED | Needs fixture repositories in the eval workspace |
| OS-level process monitoring | NOT TESTED | Absence of a runtime was shown statically and by inventory |
| ChatGPT desktop app (Codex) | NOT TESTED | GUI |

## 4. Plugin discovery limitations observed

1. **Under-triggering in empty workspaces (Claude Code).** These positives
   never loaded a skill across runs: CSV export (implementation), "which
   commands" (repository), "review this controller", and "leaked API key"
   (security).
   - The traces show the model exploring with Glob or a subagent, or
     answering directly because there is no code.
   - Ambiguous prompts loaded a Chayen skill only once in 6 (after
     `max_turns` was raised).
2. **Run-to-run variance.**
   - `pos-implementation-multicurrency` passed in run 1, then failed twice.
   - `pos-implementation-soft-delete` failed once, then passed.
   - Single runs are not a reliable measure.
3. **Copilot over-activation.** Copilot loaded `chayen-implementation`
   (Unity) and `chayen-frontend` (SwiftUI) despite explicit "Not for …
   SwiftUI, Unity" wording. Codex and Claude Code respected it.
4. **Competing skills win.**
   - In the user's real Copilot environment, the personal `kiyo-bug-fix`
     skill (`~/.agents/skills`) was chosen over `chayen-backend`.
   - In real Claude Code with other plugins, no Chayen skill loaded for the
     same prompt.
   - Codex and Copilot both read `~/.agents/skills`.
5. **Built-in skills compete.** Claude Code's bundled `security-review` skill
   handled "review this PR for security problems".
6. **Provider lifecycle differences.**
   - Copilot 1.0.68 has no `plugin enable/disable`.
   - Copilot 1.0.97 `plugin uninstall` of a live local-marketplace plugin
     only disables it ("nothing was removed").
   - Codex has no disable command (`config.toml` only), and a `-c` override
     with the quoted plugin key does not disable the plugin.
   - Codex leaves an empty cache directory after `plugin remove`.
7. **Provider outage.** The first Codex attempt failed with HTTP 503 and
   produced no data.

## 5. Defects found and fixed in this step

| Defect | Fix | Verified |
|---|---|---|
| Claude eval cases outside the plugin cannot load it ("outside the containment root"). U-12 resolved: not supported. | Removed the `plugins:` field. Added `--stage <dir>` to `tools/evals/generate-claude-evals.mjs`, which builds a throwaway plugin copy with `evals/`. The shipped plugin stays eval-free. | The staged run executed 48 cases |
| `max_turns: 4` cut runs off while the model was still exploring | Raised to 8 in the generator | Re-run: 4 of 13 failures then passed |
| `chayen-frontend` description did not name native and game UI explicitly | Description now says "browser UI … Not for … native or game UI such as SwiftUI, Android, Flutter, WPF, or Unity" | Claude: frontend 4/4 and SwiftUI/Unity silent after the change. Copilot: unchanged (still activates). |
| (Attempted) `chayen-implementation` scope wording | **Reverted.** No measured benefit, and it may have reduced triggering. | The reverted description passed soft-delete. Multi-currency still varies. |

No defect was found in the plugin package itself: manifests, marketplace
files, or layout. All three CLIs accepted it unchanged.

## 6. Recommended fixes

| Priority | Recommendation | Addresses |
|---|---|---|
| High | **Add fixture workspaces to the trigger evals.** For example `context.scaffold_script` with small .NET, Angular, or Python repos, so "this controller" and "this repo" prompts have real context, as they do in actual use. Then baseline with `--runs 3` and the no-plugin arm. | §4.1, §4.2 |
| High | **Tune the descriptions of `chayen-implementation`, `chayen-repository`, and `chayen-security`.** Put the user-phrased trigger first (for example "review code for vulnerabilities", "leaked secret", "which commands build this repo"). Re-measure after each change, one change at a time. | §4.1 |
| High | **Strengthen the in-skill gate** as the first instruction: "If the target is not a web or server stack listed here (for example SwiftUI, Android, Unity), stop using this skill." Measure Copilot again. | §4.3 |
| Medium | **Document coexistence with other skill packs.** Overlapping personal or project skills may be preferred. Users can disable overlapping skills per provider (Copilot `skill disable`, Codex `[[skills.config]]`, Claude `skillOverrides`). Consider more stack-specific trigger terms. | §4.4, §4.5 |
| Medium | **Push to a branch and test `owner/repo` marketplace installs** on all three CLIs (needs approval). | §3 |
| Medium | **A human runs the two VS Code manual procedures** and records the results. | §3 |
| Medium | **Install docs per provider.** Codex disable uses `config.toml`. Copilot needs 1.0.91 or later for enable/disable. Copilot uninstall of a live local plugin only disables it. | §4.6 |
| Low | **CI job** running `validate-package.mjs`, `generate-claude-evals.mjs --check`, and `run-lifecycle.sh` (no model cost). Model evals stay manual or nightly with a cost cap. | Regression |

## 7. Commands (reproduce)

```bash
node tools/validate/validate-package.mjs                                   # static validation
bash tests/provider-compatibility/run-lifecycle.sh <scratch>/lc            # lifecycle, 24 checks, no cost
node tools/evals/generate-claude-evals.mjs --stage <scratch>/stage         # Claude eval staging
(cd <scratch>/stage/codejadee-chayen-framework && claude plugin eval . --ablation none --runs 1 -j 4 --trust-plugin --no-publish --max-cost-usd 8 --json results.json)
COPILOT_HOME=<isolated> node tests/routing/run-smoke.mjs --provider copilot --workdir <empty> --out <dir> --phase enabled
node tests/routing/run-smoke.mjs --provider codex --workdir <empty> --out <dir> --phase enabled -- -c "skills.config=[...]"
```

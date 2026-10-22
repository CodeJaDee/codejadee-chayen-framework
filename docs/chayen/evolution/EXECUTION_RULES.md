# Chayen Evolution — Execution Rules

These rules bind every step of the 20-step program tracked in
[MASTER_PLAN.md](MASTER_PLAN.md). They add to the existing governance in
[DECISIONS.md](../DECISIONS.md), the [ADRs](../ADRS/README.md),
[BUILD_CONTRACT.md](../BUILD_CONTRACT.md) and
[SKILL_QUALITY_GATES.md](../SKILL_QUALITY_GATES.md). They do not replace
them. Where they conflict, the stricter rule applies, and the conflict is
logged as a blocker.

## 1. Before a step starts

1. Read [MASTER_PLAN.md](MASTER_PLAN.md) and the latest entry in
   [STEP_LOG.md](STEP_LOG.md).
2. Confirm that each prerequisite step is `PASS`, or that the plan records an
   accepted waiver. Otherwise mark the step `BLOCKED` with the missing
   prerequisite, and stop.
3. Record the starting state: branch, HEAD commit, `git status --porcelain`,
   and the package version in both plugin manifests.
4. If the worktree has changes the program did not make, list them and keep
   them. Do not stash, reset, check out over or reformat them.

## 2. Scope

- Work only inside this repository.
- Do only the current step. Do not start the next step, and do not widen the
  step's target files without recording why in the step log.
- A change to an architecture rule (a limit, a registration model, the
  packaging layout, the security model) needs an owner-approved decision
  (`D-NNN`) and, where an ADR owns the rule, an ADR amendment. A plan step on
  its own is not approval.
- Developer tools stay outside the distributed plugin
  (`plugins/codejadee-chayen-framework/`). Only a future owner-approved ADR
  can change this.

## 3. Invariants that every step preserves

| ID | Invariant | Checked by |
|---|---|---|
| INV-01 | Native installation through Claude Code, OpenAI Codex and GitHub Copilot: one marketplace file per provider, identical identity in both plugin manifests. | V-01a/b/c, V-02..V-04, `tests/provider-compatibility/check-identity.mjs` |
| INV-02 | One canonical Skills source: `plugins/codejadee-chayen-framework/skills/`. No `SKILL.md` anywhere else. | V-05, V-13 |
| INV-03 | The plugin ships only `.md` and `.json`, with no hooks, agents, commands, MCP or LSP servers, scripts or `package.json`. | V-09, ADR-0005 |
| INV-04 | Security controls and native permissions stay intact. No permission-bypass or allow-all flag is added to any runner. | V-25, `tests/security/boundaries.test.mjs`, review |
| INV-05 | MIT licence and attribution stay: `LICENSE`, the plugin `LICENSE.md`, the `license` field in both manifests, and upstream notices. | `check-hardening.mjs` (H-LICENSE) |
| INV-06 | The 206-capability inventory (20 domains) is unchanged. No rename, omission, dummy ID or catch-all capability. | V-11.0, V-11.5, inventory fingerprint |
| INV-07 | Zero runtime dependencies for the shipped plugin (D-004). Developer tools keep zero npm dependencies unless an approved decision says otherwise. | V-09, review |

## 4. Prohibited actions

Unless the owner gives an explicit instruction for that specific action, do
not:

- commit, amend, push, tag, publish, release or deploy;
- change the plugin `version` in any manifest;
- install or update the plugin in a real provider home;
- make billed provider or model calls. Live runners need the authorization,
  budget cap and isolated home their own guards require;
- run tools that fetch from the network (for example
  `tools/ci/check-workflow.mjs`, which downloads actionlint);
- delete or overwrite recorded evidence under any `results/` directory.

## 5. Evidence

- **Claims need observations.** Report a runtime outcome only if a command was
  run and its output was seen. Documentation, design intent and a passing
  static validator are not runtime evidence.
- **Evidence levels stay separate** (D-046): static validation, simulated
  proxy, actual provider invocation and human review. Do not pool them, and do
  not promote one to another.
- **Statuses for checks:** `PASS`, `FAIL`, `NOT_RUN`, `BLOCKED`. A skipped,
  timed-out, unauthorized or unavailable check is `NOT_RUN` or `BLOCKED`,
  never `PASS`.
- **Inspect before executing.** Read a script, or at least its side-effect
  paths (`writeFileSync`, `rmSync`, `spawnSync`, `fetch`), before running it
  for the first time in the program.
- **Record exact commands.** Log the command, working directory, exit code,
  Node.js version and the summary line of the output.
- **Raw output lives outside the repository.** Raw logs go to the session
  scratchpad or another directory outside the repository. Only summaries and
  path-free results are committed to evidence documents.

## 6. Step status

| Status | Meaning |
|---|---|
| `NOT_STARTED` | No work has begun. |
| `IN_PROGRESS` | Work has begun; acceptance not yet evaluated. |
| `PASS` | Every required acceptance criterion has recorded supporting evidence. |
| `PARTIAL` | Some criteria have evidence. The rest are listed with a reason (`NOT_RUN`, `BLOCKED`, deferred by the owner). Not equivalent to `PASS`. |
| `BLOCKED` | A prerequisite, approval, credential, tool or budget is missing. The blocker is named. |
| `FAIL` | Acceptance was evaluated and not met. |

A dependent step may start after a `PARTIAL` step only if the plan records
that the missing criteria do not affect it.

## 7. After a step

Append one entry to [STEP_LOG.md](STEP_LOG.md) with:

1. step ID, date, status;
2. starting state (branch, HEAD, worktree, version);
3. files created, modified and deleted (actual, from `git status`);
4. commands run, with exit code and summary result;
5. acceptance criteria, each with its evidence or the reason it lacks it;
6. risks and open findings;
7. the next action, and whether the next step is ready.

Then update the step's row in [MASTER_PLAN.md](MASTER_PLAN.md) (status,
evidence pointer, blockers). Update no other row.

## 8. Validation baseline

Every step that changes a repository file reruns at least:

```text
node tools/validate/validate-all.mjs
```

Steps that change evaluation tooling also run, without `--write`:

```text
node tools/evals/run-evaluation-suite.mjs
```

A regression against the Step 01 baseline in
[BASELINE_REPORT.md](BASELINE_REPORT.md) fails the step, unless the change is
intended and the expected new result is recorded in the step log before the
run.

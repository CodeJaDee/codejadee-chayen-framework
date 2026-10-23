# Routing, collision and context benchmark (developer-only)

Evolution Step 18 (D-075). Nothing here is shipped in the plugin, and no
synthetic Skill is ever added to the production package. Report:
[ROUTING_CONTEXT_REPORT](../../../docs/chayen/evolution/ROUTING_CONTEXT_REPORT.md).

**As of 2026-10-23 no provider run has been made with this harness.**
Provider routing, no-match behaviour and provider token counts are
`NOT_RUN`.

## Files

| File | Purpose |
|---|---|
| `synthetic-skills.json` | `chayen-synthetic-skills/1`: 21 synthetic Skills in four groups (distinct, adjacent, overlap, conflict) and six scenarios, each with its expected static outcome |
| `routing-cases.json` | `chayen-routing-cases/1`: 74 routing cases (positive, regression, adjacent, overlap, conflict, no-match, unsupported, negative, explicit, ambiguous) with fixed expected outcomes; keyword and paraphrase prompts |
| `routing-context-lib.mjs` | Specification checks, disposable scenario builds, metadata and overlap metrics, the SIMULATED lexical proxy, classification from native activation events, per-configuration summaries with context tax |
| `routing-synthetic.mjs` | Synthetic transcripts in the native Claude, Codex and Copilot event shapes, and the scorer self-test |
| `run-routing-context.mjs` | CLI: `--static`, `--plan`, `--score`, `--self-test`, `--build`; `--live` exits 3 (BLOCKED) |
| `routing-context.test.mjs` | Offline regressions (G-27T) |
| `results/2026-10-23-static/` | Static report for the current package, reproduced byte for byte by G-27T |

## Commands (offline, free)

```bash
node tests/evaluation/routing-context/run-routing-context.mjs --static [--out <new dir>] [--json]
node tests/evaluation/routing-context/run-routing-context.mjs --plan
node tests/evaluation/routing-context/run-routing-context.mjs --self-test
node tests/evaluation/routing-context/run-routing-context.mjs --score <records.jsonl> [...]
node tests/evaluation/routing-context/run-routing-context.mjs --build <scenario> --out <new dir outside the repository>
node --test tests/evaluation/routing-context/routing-context.test.mjs
```

`--static` copies the package, catalog, tools and trigger cases into a new
directory under the OS temp directory for each scenario. It adds that
scenario's synthetic Skills there as registered project Skills and runs the
real package, catalog and security validators. Then it deletes the copy.
Each scenario must meet its expected outcome:

- valid scenarios pass every validator;
- `SC5-lexical-conflict` fails only on the two expected distinctness pairs;
- the paraphrased duplicate in `SC4-semantic-conflict` passes the lexical
  distinctness check. That is the documented blind spot.

## Evidence rules

- A Skill counts as loaded only from a native event parsed by
  `tests/evaluation/phase5/phase5-lib.mjs`: the Claude `Skill` tool, the
  Copilot `skill` tool, a Codex read of an installed `SKILL.md` outside the
  fixture, or a skill item event. A Skill named in the answer is not
  activation.
- Summaries are per provider, CLI version, model, metadata, specification,
  candidate, scenario and evidence level. Records that differ in any of
  these are refused, never pooled. The plugin arm and the no-plugin arm
  may differ only by the installed package.
- Infrastructure errors (`ERROR_NO_RESULT`) are kept and reported. Only the
  Phase 5 retry rule (one retry of an infrastructure error) applies.
- Records built from synthetic transcripts are `SIMULATED`. Their
  summaries make no claim (`NOT_MEASURED`).
- Token counts are used only when the provider reports them. Otherwise
  the context tax is the static characters / 4 estimate, labelled as an
  estimate.

## Live runs

Not implemented here. A live run of a synthetic scenario needs all of these:

- owner authorization for billed calls, with a call cap;
- a signed-in isolated home per provider and arm;
- an approved install of the scenario package built by `--build` into those
  homes, never into the production package;
- for Codex, a reviewed activation signal from an unscored pilot.

Production routing on the shipped 16 Skills uses
`tests/evaluation/phase5/run-phase5.mjs --suite routing`. Its `--score` now
adds the same selection breakdown and context tax (`routingImpact`).

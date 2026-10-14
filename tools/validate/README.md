# Developer-only validators

These tools are for **repository maintainers only**.

- They are not part of the plugin package (`plugins/`).
- Plugin users never run them.
- They are not a Chayen CLI: no `package.json`, no `bin` entry, nothing to
  install.
- They have no runtime dependencies. They need Node.js 18 or later.

```bash
node tools/validate/validate-all.mjs           # every automated gate (SKILL_QUALITY_GATES.md), one line each
node tools/validate/validate-package.mjs       # package, skills, references, catalog alignment (detail)
node tools/validate/run-validator-tests.mjs    # self-tests: 2 baselines + 51 negative controls
```

The rules come from
[`docs/chayen/SKILL_AUTHORING_STANDARD.md`](../../docs/chayen/SKILL_AUTHORING_STANDARD.md).
The gates are in
[`docs/chayen/SKILL_QUALITY_GATES.md`](../../docs/chayen/SKILL_QUALITY_GATES.md).

## Files

| File | Purpose |
|---|---|
| `validate-package.mjs` | The checks below |
| `run-validator-tests.mjs` | Applies the mutation cases in `tests/catalog/` and `tests/skills/` to temporary repository copies, and asserts that each one fails with the expected check (G-13) |
| `validate-all.mjs` | Runs the package validator, the catalog checker, the eval-case sync check, and the self-tests |

## What `validate-package.mjs` checks

| ID | What it checks |
|---|---|
| V-02 | `plugins/codejadee-chayen-framework/plugin.json` follows the Agent Plugins 1.0.0 field rules (closed schema, so unknown fields are errors). The rules are re-implemented from the official schema; see "Limits". |
| V-03 | The Claude Code manifest: name rules, reserved names, no component keys, no unsupported fields. |
| V-04 | Name, version, and metadata are identical across both manifests, and `version` is semver. |
| V-01a | `.claude-plugin/marketplace.json` follows the Claude Code rules. |
| V-01b | `.github/plugin/marketplace.json` follows the Copilot CLI rules. |
| V-01c | `.agents/plugins/marketplace.json` follows the Codex rules. |
| (V-01a–c) | For all three marketplace files: the source path rules, that the path resolves to the plugin directory, and that the entry name equals the manifest name. |
| V-09 | The plugin contains only `.md` and `.json` files, with no hooks, MCP servers, agents, commands, scripts, or symlinks. |
| V-05 | `SKILL.md` files exist only under `skills/`. Their frontmatter is strictly parsed (valid YAML subset, no duplicate keys, YAML-safe values) and uses only portable fields. Names are valid, equal the directory, and are unique. |
| V-06 | `SKILL.md` ≤300 lines (warning above 200). Reference files ≤300 lines. |
| V-07 / V-07b | L0 budget (≤5,500 characters since D-037, ≤14 skills), description length and YAML safety, the "Not for" clause, and pairwise distinctness. |
| V-08 | Links and heading anchors resolve, stay inside the skill directory, are ≤2 hops away, and every reference file is reachable from `SKILL.md`. |
| V-10 | No provider-specific tool names or variables, enforcement claims, or self-references. |
| V-12 | No placeholder text in prose (code spans and fenced blocks are exempt, so a recipe can name the markers it searches for). No required recipe section with fewer than 12 words (TODO-only recipes). |
| V-16 | `tests/skills/trigger-cases.json` integrity |
| V-17 | Entry skill anatomy: title, `**Scope:**` line, the ten sections in order, ≥4 positive and ≥3 negative triggers, the no-match gate sentence, and a `Reference \| Load when` table. |
| V-18 | Every reference file declares `kind` (recipe, technology, checklist, or template), uses only allowed frontmatter fields, and has that kind's sections. A recipe has ≥3 numbered procedure steps and a valid `capabilities` list. |
| V-19 | Shipped skills are catalog entry skills. Recipe `capabilities` agree with the catalog's recipe paths and statuses (RC-01, RC-02, CA-02). |
| V-20 | Description breadth: no catch-all wording, ≥2 concrete scope terms, ≥2 exclusions, and a warning above 24 enumerated items. |
| V-22 | `tests/skills/recipe-cases.json`: every capability in an existing recipe has ≥1 positive and ≥1 negative case. Prompts never mention Chayen. |
| V-13 | Nothing at the repo root that providers would misread as a plugin. |

Exit code `1` means at least one error.

## Limits

- This script is **not** a full JSON Schema validator. It re-implements the
  rules of the official Agent Plugins schema. Full schema validation was run
  separately in Step 04; see `docs/chayen/PROGRESS.md`.
- **V-20 is a heuristic.** See SKILL_QUALITY_GATES §3.

The authoritative provider checks are:

- `claude plugin validate --strict <dir>` (Claude Code)
- `skills-ref validate <skill-dir>` (Agent Skills reference validator, in a
  throwaway virtual environment)
- install tests per provider (`tests/provider-compatibility/run-lifecycle.sh`)

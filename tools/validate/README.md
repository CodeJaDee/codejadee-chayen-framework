# Developer-only validators

These tools are for **repository maintainers only**.

- They are not part of the plugin package (`plugins/`).
- Plugin users never run them.
- They are not a Chayen CLI: no `package.json`, no `bin` entry, nothing to
  install.
- They have no runtime dependencies. They need Node.js 20.11 or later (the scripts use `import.meta.dirname`). Executed on Node 24.15.0; 20.11 is the documented minimum, not a tested version.

```bash
node tools/validate/validate-all.mjs           # every automated gate (SKILL_QUALITY_GATES.md), one line each
node tools/validate/validate-package.mjs       # package, skills, references, catalog alignment (detail)
node tools/validate/run-validator-tests.mjs    # self-tests: 4 baselines + 146 negative controls (18 editorial)
node tools/validate/check-security.mjs        # offline V-25 profile; no commands/network
node --test tests/security/boundaries.test.mjs # offline adversarial script controls
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
| `validate-all.mjs` | Runs security preflight and offline boundary tests, package, engineering catalog, technology, composite workflow/template and eval synchronization checks, then validator self-tests and the documentation check (nine gate groups). Failed security preflight stops later gates. |
| `check-security.mjs` | V-25 metadata-only profile, authority guards, link/path confinement, heuristic secret patterns, source hashes, URL and fixture dependency inventory; `--write-report` writes only the fixed STEP 30 report |
| `check-docs.mjs` | STEP 33 documentation gate (G-14): relative links and anchors (D-01, D-02), `<plugin>@<marketplace>` identifiers (D-03), skill names (D-04), and `-dev` versions (D-05) in README.md, SECURITY.md, CHANGELOG.md, docs/*.md and docs/distribution/*.md. External links are listed, not fetched. |
| `safe-paths.mjs` | Rejects absolute/traversal paths and linked descendants for scratch mutation and staging |
| `../catalog/skill-registration.mjs` | Shared max-count/L0 constants and strict engineering/editorial registration rules. See docs/chayen/SKILL_REGISTRATION.md. |

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
| V-07 / V-07b | L0 ≤6,500 (D-052) for both shipped and projected metadata; ≤15 Skills (D-053). Canonical planned/editorial descriptions share length, YAML safety, boundary and distinctness checks. Constants are shared with catalog/evaluation tooling. |
| V-08 | Links and heading anchors resolve, stay inside the skill directory, are ≤2 hops away, and every reference file is reachable from `SKILL.md`. |
| V-10 | No provider-specific tool names or variables, enforcement claims, or self-references. |
| V-12 | No placeholder text in prose (code spans and fenced blocks are exempt, so a recipe can name the markers it searches for). No required recipe section with fewer than 12 words (TODO-only recipes). |
| V-16 | `tests/skills/trigger-cases.json` integrity |
| V-17 | Entry skill anatomy: title, `**Scope:**` line, the ten sections in order, ≥4 positive and ≥3 negative triggers, the no-match gate sentence, and a `Reference \| Load when` table. |
| V-18 | Every reference file declares `kind` (recipe, technology, checklist, or template), uses only allowed frontmatter fields, and has that kind's sections. A recipe has ≥3 numbered procedure steps and a valid `capabilities` list. |
| V-19 | Shipped Skills belong to exactly one engineering/editorial registration with existing mapping. Planned editorial entries have no directory; existing metadata matches the registry. Editorial names cannot own engineering mappings/recipes. Original recipe paths, statuses and IDs retain RC-01/RC-02/CA-02 checks. |
| V-20 | Description breadth: no catch-all wording, ≥2 concrete scope terms, ≥2 exclusions, and a warning above 24 enumerated items. |
| V-22 | `tests/skills/recipe-cases.json`: every capability in an existing recipe has ≥1 positive and ≥1 negative case. Prompts never mention Chayen. |
| V-13 | Nothing at the repo root that providers would misread as a plugin. |

Exit code `1` means at least one error.

## Limits

Inspect these scripts and imported helpers before executing them from a new
checkout. The checkout controls the validators too: passing a repository's own
checks does not establish trust. Run in a disposable environment with minimal
permissions, no secrets and network disabled when practical. No dependency
installation, restore, provider model call or lifecycle install is part of
`validate-all.mjs`. Static scanning cannot prove absence of prompt injection,
secrets, malware or vulnerable dependencies. See `docs/chayen/SECURITY_MODEL.md`,
`THREAT_MODEL.md` and `PLUGIN_TRUST_REVIEW.md` for the reviewed boundaries.
STEP 32 corrected the maintainer runtime declaration to Node.js 20.11 or later
(R-50); only Node 24.15.0 has been executed.

Default eval generation changes committed fixture files. `--check` reads only;
`--stage <existing-scratch-parent>` creates a fresh child and refuses existing
destinations. Neither staging nor generated prompts authorize provider calls.
Mutation tests use fresh temporary copies and confined relative paths. These
guards do not prevent concurrent filesystem replacement or malicious script
edits; OS isolation and trusted external CI still matter.

- This script is **not** a full JSON Schema validator. It re-implements the
  rules of the official Agent Plugins schema. Full schema validation was run
  separately in Step 04; see `docs/chayen/PROGRESS.md`.
- **V-20 is a heuristic.** See SKILL_QUALITY_GATES §3.

The authoritative provider checks are:

- `claude plugin validate --strict <dir>` (Claude Code)
- `skills-ref validate <skill-dir>` (Agent Skills reference validator, in a
  throwaway virtual environment)
- install tests per provider (`tests/provider-compatibility/run-lifecycle.sh`)

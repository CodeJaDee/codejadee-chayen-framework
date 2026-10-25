# Developer-only validators

These tools are for **repository maintainers only**.

- They are not part of the plugin package (`plugins/`).
- Plugin users never run them.
- They are not a Chayen CLI: no `package.json`, no `bin` entry, nothing to
  install.
- They have no runtime dependencies. Phase 3 tested Node.js 20.11.0 and
  24.22.0 on Windows. Use 24.22.0 for development; 20.11.0 is a legacy
  compatibility floor, not a recommended maintainer runtime.

```bash
node tools/validate/validate-all.mjs           # every automated gate (SKILL_QUALITY_GATES.md), one line each
node tools/validate/validate-package.mjs       # package, skills, references, catalog alignment (detail)
node tools/validate/run-validator-tests.mjs    # self-tests: 6 baselines + 183 negative controls (includes editorial, 10 project and 14 response-style)
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
| `validate-all.mjs` | Runs security preflight and offline boundary tests, package, engineering catalog, technology, composite workflow/template and eval synchronization checks, then validator self-tests, the documentation check, the editorial case check, the response style gate and its fixture tests, and the Step 40 evaluation dataset check plus scorer self-test (`../evals/score-step40.mjs --self-test`, G-17) (thirteen gate groups). Failed security preflight stops later gates. |
| `check-editorial-cases.mjs` | Editorial gate (G-15E, Steps 37-38; renamed from G-15 in Step 41, because G-15 is the human review gate), run for both editorial skills: the pattern inventory is exactly TH-01–TH-14 and EN-01–EN-26 with Signals, Why, Not a tell when, Before, After and Preserve (E-01); `tests/editorial/humanizer-{th,en}-cases.json` schema and preserved-span fixture integrity (E-02); per-category minimums, a positive plus a false-positive case for every pattern, and English text-type coverage (E-03); neither skill names the other (E-04). Static only; behavior NOT_RUN. |
| `check-response-style.mjs` | Response style gate (G-16, Step 39): canonical block structure (R-01), body ≤3,500 characters and ≤40 lines (R-02), required clauses and protected-content items (R-03), Copilot template byte-identical (R-04), no Skill routing, provider tool names, host file names or guarantee claims in the policy (R-05), no hardcoded user home paths (R-06), the plugin package ships no instruction files, rules, output styles or policy text (R-07), the user guide keeps its lifecycle sections and install-only statement (R-08). Static only; host loading NOT_RUN. |
| `../response-style/inspect-instructions.mjs` | Read-only setup helper for users and maintainers: `status`, `plan-add`, `plan-remove`, `print`. Never writes; tested by `tests/response-style/setup-fixtures.test.mjs` on disposable fixtures. |
| `check-security.mjs` | V-25 metadata-only profile, authority guards, link/path confinement, heuristic secret patterns, source hashes, URL and fixture dependency inventory; `--write-report` writes only the fixed STEP 30 report |
| `check-docs.mjs` | STEP 33 documentation gate (G-14): relative links and anchors (D-01, D-02), `<plugin>@<marketplace>` identifiers (D-03), skill names (D-04), and `-dev` versions (D-05) in README.md, SECURITY.md, CHANGELOG.md, docs/*.md and docs/distribution/*.md. External links are listed, not fetched. |
| `check-guidance.mjs` | Guidance consistency gate (G-18): invariants GI-01..GI-10 from `guidance-invariants.json`, checked by structural anchors and narrow, negation-aware contradiction patterns over the shipped Markdown. ERROR fails; REVIEW is for human review. See docs/chayen/GUIDANCE_INVARIANTS.md. |
| `safe-paths.mjs` | Rejects absolute/traversal paths and linked descendants for scratch mutation and staging |
| `../catalog/skill-registration.mjs` | Shared registration rules (no count cap, D-066). See docs/chayen/SKILL_REGISTRATION.md. |
| `../catalog/discovery-metrics.mjs` | Shared discovery metadata metrics and description overlap (V-07, V-07b, evaluation suite). |

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
| V-06 | Size report, no line cap (D-066): lines and estimated tokens (characters / 4) for every `SKILL.md` and reference, the largest of each, and the worst single activation (body plus largest reference). WARN above the provider recommendation of 500 lines or ~5,000 tokens. |
| V-07 / V-07b | No L0 cap and no Skill count cap (D-066): shipped and projected discovery metadata, estimated tokens and counts by category are reported; WARN when metadata exceeds a documented provider listing figure (Codex 8,000 characters). Descriptions above 1,024 characters (provider limit) are errors. Canonical planned/editorial descriptions share length, YAML safety, boundary and distinctness checks. Constants are shared with catalog/evaluation tooling. |
| V-08 | Every link in every Markdown file of a skill resolves to a regular file inside that skill (ERROR on a missing target, traversal, a link into another skill, a symlink, or a directory) and every heading anchor exists. Breadth-first walk from `SKILL.md` with a visited set, no depth cap (D-066): an unreachable reference is an orphan (ERROR); a reference reachable only through others is reported (WARN); cycles are found without recursion and reported (WARN). |
| V-10 | No provider-specific tool names or variables, enforcement claims, or self-references. |
| V-12 | No placeholder text in prose (code spans and fenced blocks are exempt, so a recipe can name the markers it searches for). No required recipe section with fewer than 12 words (TODO-only recipes). |
| V-16 | `tests/skills/trigger-cases.json` integrity |
| V-17 | Entry skill anatomy: title, `**Scope:**` line, the ten sections in order, ≥4 positive and ≥3 negative triggers, the no-match gate sentence, and a `Reference \| Load when` table. |
| V-18 | Every reference file (every Markdown file in a skill other than its `SKILL.md`, at any depth, so V-18 covers what V-08 can reach; D-066) declares `kind` (recipe, technology, checklist, or template), uses only allowed frontmatter fields, and has that kind's sections. A recipe has ≥3 numbered procedure steps and a valid `capabilities` list. |
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
(R-50). That Step 32 limitation is historical: Phase 3 now executes the
full offline suites on 20.11.0 and 24.22.0. Remote CI is still NOT_RUN.

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

## Phase 2 product hardening guards

`check-hardening.mjs` checks scope exclusions, Humanizer TH registration,
locale-copy versus framework-wiring cases, lifecycle guards and the current
runbook inventory. The upstream Humanizer notice is checked by its original
full-document SHA-256 after CRLF-to-LF normalization, including attribution,
MIT grant and warranty text, and by the English Skill reference to it.
A future project MIT licence never replaces this upstream notice. A notice
change requires a deliberate reviewed provenance update, not an automatic
hash refresh. Missing or altered notice/link fails validation.

`validate-all.mjs` includes negative mutations in
`tests/production/hardening.test.mjs`, numeric scorer regressions in
`tests/editorial/numeric-preservation.test.mjs`, and isolated lifecycle fakes
in `tests/provider-compatibility/lifecycle.test.mjs`. These are offline
maintainer tests and do not constitute native provider evidence.

## Phase 3 CI and documentation

`validate-all.mjs --fail-fast` stops on the first failed group and prints
the failing diagnostics. The default still collects non-security failures.
`run-evaluation-suite.mjs --fail-fast` propagates that behavior to its
aggregate subprocess and stops on a failed static check.

`check-docs.mjs` also derives current build facts from the canonical package:
plugin/marketplace identity, manifest version, Skills, file/reference counts,
and L0 usage/budget. The README fact table must agree. Historical evidence
uses balanced historical markers; old install identifiers are allowed only
in marked migration instructions. `tests/ci/documentation.test.mjs` checks
negative mutations and the historical exception in a disposable fixture.

`tests/ci/negative-controls.test.mjs` reuses the manifest/reference mutation
specifications and demonstrates a missing upstream MIT notice, without
breaking the branch. It is an independent CI preflight check. Workflow syntax
uses the pinned/checksummed actionlint helper outside the offline aggregate.
See [CI/CD design](../../docs/production/CI_CD_DESIGN.md) for toolchain,
credentials, network boundaries and local versus remote evidence.

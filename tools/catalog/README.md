# Capability catalog checker

This tool is for **repository maintainers only**.

- It is not part of the plugin package (`plugins/`).
- Plugin users never run it.
- It has no dependencies. It needs Node.js 18 or later.

```bash
node tools/catalog/check-catalog.mjs              # check; exit 1 on any error
node tools/catalog/check-catalog.mjs --write-doc  # regenerate the tables in docs/chayen/CAPABILITY_COVERAGE.md
node tools/catalog/check-catalog.mjs --dump-json  # print the parsed catalog as JSON
node tools/catalog/audit-coverage.mjs             # ten-criterion coverage audit; exit 1 on any failure
node tools/catalog/check-technology.mjs           # V-23 technology catalog check (D-039)
node tools/catalog/check-technology.mjs --write-doc  # also regenerate docs/chayen/TECHNOLOGY_COVERAGE.md §6
node tools/catalog/audit-coverage.mjs --markdown  # per-domain and per-capability tables (ENGINEERING_COVERAGE_AUDIT.md §3, §9)
```

Options `--root <repoRoot>` and `--file <catalogPath>` point the checker at
another copy. They are used for negative-control runs: see
`tests/catalog/catalog-mutations.json` and
`tools/validate/run-validator-tests.mjs`.

| File | Purpose |
|---|---|
| `check-catalog.mjs` | Validator V-11, and the coverage-table generator |
| `catalog-lib.mjs` | The shared restricted-YAML parser. `tools/validate/validate-package.mjs` also uses it (V-19). |
| `check-technology.mjs` | V-23: checks `catalog/technology-capabilities.yaml` against the Step 20 inventory, the technology reference sections (anatomy TC-01 to TC-06), `tests/skills/technology-cases.json`, the engineering catalog, and the .NET fact list; keeps `docs/chayen/TECHNOLOGY_COVERAGE.md` in sync. |
| `audit-coverage.mjs` | The Step 19 coverage audit: ten static criteria per capability (catalog, mapping, procedure, entry skill, paths, positive and negative cases, inputs and outputs, safety and verification, no placeholders), plus duplicate, orphan, mapping, and description-term checks. See `docs/chayen/ENGINEERING_COVERAGE_AUDIT.md`. |

## What it checks (validator V-11)

The checker is the reproducible **count and uniqueness check** for
[`catalog/engineering-capabilities.yaml`](../../catalog/engineering-capabilities.yaml).
It embeds the user's Step 07 inventory verbatim and compares the catalog
against it. It verifies:

- exactly 20 domains and 206 capabilities;
- unique ids and names;
- every inventory name present, in inventory order, with no renames;
- entry-skill and recipe mappings that agree with the files on disk; a recipe is always `skills/<skill>/references/<name>.md`, never `SKILL.md` (D-026);
- consolidation groups and overlaps that are consistent;
- status values from BUILD_CONTRACT §5.1. `COMPLETED` is rejected, and
  IN_PROGRESS, IMPLEMENTED, and VERIFIED each need evidence;
- that the generated tables in `CAPABILITY_COVERAGE.md` are current.

The full list is in
[CAPABILITY_COVERAGE.md §2](../../docs/chayen/CAPABILITY_COVERAGE.md#2-how-to-check).

## Format

The catalog uses a restricted YAML subset (D-021), so this checker can parse
it without a YAML library:

- two-space indentation;
- quoted strings or plain tokens;
- flow lists and maps of plain tokens only;
- no anchors, aliases, or block scalars.

Every file in the subset is also valid YAML 1.2. In Step 07, a PyYAML parse
produced data identical to this parser's output.

## Technology packs after Step 26

`node tools/catalog/check-technology.mjs` checks 90 records: 22 .NET, 14
Angular, 8 shared TS/JS, 8 React, 8 Next.js, 7 Vue, 7 Nuxt, 4 Vite, and 12 SQL Server capabilities. `--write-doc` refreshes the generated
table in TECHNOLOGY_COVERAGE.md. It validates inventory, mapping, ordered
section anatomy, cases, and AF/JF/TF/RF/NF/VF/UF/BF/SF fact IDs. These are static gates; they do
not execute agent evaluations or framework facts. Fact commands and current
PASS/NOT_RUN limits are recorded separately in PROGRESS. Step 22's three
executed NF checks are synthetic Web-standard boundaries, not compiled Next
or auth-provider verification.
Step 23's two executed exposure checks are JavaScript counterexamples, not
Nuxt serialization/overrides or Vite production privacy verification.
Step 26 adds V-23.10 for the SQL Server data access recipes: three library
sections, ten required topics each, steps and a verify rule, recipe cases,
and a Driver references table whose packages and APIs must appear in the
fact fixture that `tests/technology/sqlserver/run-fact-checks.mjs` compiles.

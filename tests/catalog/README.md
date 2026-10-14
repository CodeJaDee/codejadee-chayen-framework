# Catalog tests

These are developer-only tests for the capability catalog checker
(`tools/catalog/check-catalog.mjs`, validator V-11). Nothing here is shipped.

| File | Purpose |
|---|---|
| `catalog-mutations.json` | 19 negative controls. Each one mutates a temporary copy of the repository, for example by omitting, renaming, or duplicating a capability, using a wrong status, a missing recipe, a recipe in `SKILL.md`, an asymmetric overlap, invalid YAML, or a stale coverage doc. The checker must fail with the expected check ID. |

Run them through the shared runner, which also runs the package validator
cases in `tests/skills/validator-mutations.json`:

```bash
node tools/validate/run-validator-tests.mjs
node tools/validate/run-validator-tests.mjs --only cat-rename --keep   # one case; keep the temp copy for inspection
```

The runner first checks that an unmutated copy passes. A case passes only if
the validator exits with 1 **and** reports an `ERROR` line starting with
`expect.error`.

**Case format:**

```json
{ "id": "...", "description": "...",
  "edits": [{ "file": "<repo-relative>", "op": "replace|regex|write|append|delete|copydir", "...": "..." }],
  "expect": { "validator": "catalog|package", "error": "V-11.5 count" } }
```

A `replace` must match exactly once, so a drifting fixture fails loudly
instead of passing silently.

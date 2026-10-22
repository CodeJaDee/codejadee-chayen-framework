# Independent evidence audit cases (developer-only)

Synthetic cases for the independent audit verification contract
([INDEPENDENT_AUDIT_CONTRACT.md](../../docs/chayen/INDEPENDENT_AUDIT_CONTRACT.md),
D-070). Nothing here is shipped in the plugin.

| Case | Scenario | Expected |
|---|---|---|
| AU-0001 | Genuine passing test, recorded on the current revision | accept; DONE supported |
| AU-0002 | PASS claimed for an added test file; no recorded run | verify_more; DONE unsupported |
| AU-0003 | UI change verified only by a build and a unit test | verify_more; DONE unsupported |
| AU-0004 | Admin-only cancel: the forbidden-path test fails | revise; DONE unsupported |
| AU-0005 | Honest partial: one criterion tested, one not started | accept + verify_more; PARTIAL supported |
| AU-0006 | Passing run from before the last source change | verify_more; DONE unsupported |
| AU-0007 | Quoted clean result contradicted by the recorded run | revise; flagged as possibly fabricated |
| AU-0008 | Cited run never recorded | verify_more; flagged as possibly fabricated |

`audit-evidence.test.mjs` has 14 offline regressions (G-22T).

```bash
node tools/evals/audit-evidence.mjs
node --test tests/audit/audit-evidence.test.mjs
```

# PostgreSQL and cross-stack fact checks (Step 27)

```text
node tests/technology/postgres-crossstack/run-fact-checks.mjs \
  --report tests/technology/postgres-crossstack/results/step27-fact-checks.md \
  --pg-bin <PostgreSQL bin dir> --python <python with fixture/python/requirements.txt> \
  --node-tools <node_modules with playwright-core, openapi-typescript, typescript> [--browser <exe>]
```

Developer-only. Never shipped. The runner installs nothing; each missing tool
turns its checks into NOT_RUN, never PASS. Options can also come from
`CHAYEN_POSTGRES_BIN`, `CHAYEN_PYTHON`, `CHAYEN_NODE_TOOLS`, `CHAYEN_BROWSER`.

| IDs | What | How |
|---|---|---|
| DR-01..DR-04 | ORM/driver references in `skills/chayen-data/references/postgres-data-access.md` resolve | Packages pinned in `fixture/PostgresFacts/PostgresFacts.csproj` or `fixture/python/requirements.txt`; APIs used in `DriverReferences.cs` or `sqlalchemy_references.py`; the .NET file compiles and the Python file imports |
| PF-01..PF-22 | PostgreSQL engine, EF Core Npgsql, and Npgsql behaviour | xUnit tests in `fixture/PostgresFacts` against a disposable database |
| PF-23, PF-24 | SQLAlchemy dialect, upsert, bound parameters, N+1 | `fixture/python/sqlalchemy_facts.py` |
| XF-01, 03, 04, 08, 10, 11 | OpenAPI contract, cookie challenges, problem details, serialization, CORS, antiforgery | `fixture/CrossStackFacts` with `WebApplicationFactory` over `fixture/CrossStackApi` |
| XF-02 | Typed client generation | `node/typed-client.mjs`: openapi-typescript plus the TypeScript compiler on the committed and a drifted contract |
| XF-05, 06, 13, 14 | Time zones, Npgsql date mapping, SQL Server versus PostgreSQL | `fixture/PostgresFacts/CrossEngineFacts.cs` (XF-13 also uses LocalDB `tempdb` when present) |
| XF-07, XF-09 | JavaScript date parsing and number precision | `node/client-facts.mjs` (no dependencies) |
| XF-12 | Browser end to end | `node/e2e.mjs`: the built API on a loopback port, two local origins, Chromium via playwright-core |

**Safety**

- PostgreSQL runs as a throwaway cluster: `initdb` into the run's temporary
  folder, `listen_addresses=127.0.0.1`, trust authentication for loopback
  only, stopped and deleted at the end. Fixtures refuse non-loopback hosts.
- SQL Server is used only through `tempdb` temporary tables on LocalDB or a
  loopback server named in `CHAYEN_SQLSERVER_FACTS_SERVER`.
- The API, the two front-end origins, and the browser all run on
  127.0.0.1 with free ports and are stopped at the end.
- `fixture/CrossStackApi/contract/openapi.v1.json` is the committed contract
  that XF-01 compares the served document with; regenerate it only when the
  fixture API changes deliberately.

**What the results mean**

They describe the versions in the report (PostgreSQL major version and `C`
locale, .NET runtime, Node and its system time zone, browser). Node on
Windows ignores `TZ`, so XF-07 compares against the runtime's own local zone
and records it. A PASS shows the behaviour the guidance relies on is real; it
does not show that an agent follows the guidance. Behaviour (G-12) and
trigger (G-11) evaluations remain NOT_RUN, so no capability is VERIFIED here.

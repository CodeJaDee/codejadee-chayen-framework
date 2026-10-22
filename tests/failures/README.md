# Failure reproduction records (developer-only)

Synthetic or opt-in, redacted records of agent failures, each with a
fixture, a failing transcript and a control transcript. Nothing here is
shipped in the plugin. The format, the privacy rules and the replay outcomes
are specified in
[FAILURE_REPRODUCTION.md](../../docs/chayen/FAILURE_REPRODUCTION.md) (D-068).

| Path | Contents |
|---|---|
| `cases/FC-NNNN-*.json` | One `chayen-failure-case/1` record per failure |
| `transcripts/*.jsonl` | Redacted transcripts in provider event shape. Synthetic ones start with a `{"type":"synthetic"}` marker line |
| `fixtures/orders-consumers/` | Synthetic three-file fixture for FC-0002. It is never built or run |
| `failure-cases.test.mjs` | 17 offline regressions on disposable copies (G-20T) |

```bash
node tools/evals/failure-cases.mjs                 # validate and replay offline (G-20)
node --test tests/failures/failure-cases.test.mjs
```

Model behaviour for every current case is NOT_RUN: no provider was called.

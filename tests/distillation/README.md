# Knowledge distillation proposals (developer-only)

Mentor proposals that turn one failure case from `tests/failures/` into the
smallest reusable correction. Nothing here is shipped in the plugin.

- Process and decision rules:
  [KNOWLEDGE_DISTILLATION.md](../../docs/chayen/KNOWLEDGE_DISTILLATION.md)
  (D-069).
- Brief given to the Mentor:
  [MENTOR_BRIEF.md](../../docs/chayen/MENTOR_BRIEF.md).

| Path | Contents |
|---|---|
| `proposals/DP-NNNN-*.json` | One `chayen-distillation-proposal/1` record per proposal |
| `proposals/DP-NNNN.diff` | The proposed unified diff. It is applied only in memory and on disposable copies, never to this tree, until promotion |
| `templates/proposal.template.json` | The shape a Mentor fills in |
| `distillation.test.mjs` | 13 offline regressions (G-21T) |

```bash
node tools/evals/distill.mjs                 # all proposals through the six stages (G-21)
node --test tests/distillation/distillation.test.mjs
```

All current proposals come from synthetic failures. None is reviewed or
promoted, and live comparison is NOT_RUN.

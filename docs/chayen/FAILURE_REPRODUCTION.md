# Failure Reproduction and Regression Replay (developer-only)

| Field | Value |
|---|---|
| Decision | [D-068](DECISIONS.md#d-068--opt-in-failure-reproduction-records) (evolution Step 11) |
| Records | [`tests/failures/`](../../tests/failures/README.md) |
| Tool | [`tools/evals/failure-cases.mjs`](../../tools/evals/failure-cases.mjs) |
| Process | [CONTRIBUTING: when an agent gets a task wrong](../CONTRIBUTING.md#developer-checks) |

This specification describes how an observed agent failure becomes a
reproducible regression case. It extends the existing contribution process:
the recipe or trigger case in `tests/skills/` stays the behavioural regression
specification, and the failure record adds what that case lacks. Those
additions are a fixture with checkable facts, a recorded failing transcript, a
control transcript, a detector, and a verification status that only evidence
can change.

Nothing here is shipped. The plugin contains only `.md` and `.json` Skill
files (ADR-0005), and no failure artifact is placed under
`plugins/codejadee-chayen-framework/`.

## Privacy and security rules

- **No automatic collection.** Nothing collects conversations, and there is
  no telemetry or background process. A maintainer writes every record by
  hand.
- **Synthetic first.** A record is `synthetic` (hand-written, no provider run)
  or `observed`. An observed record needs `consent: { optIn: true, reference,
  redactionReviewed: true }`. The reference names who agreed to keep the
  redacted material and where that agreement is recorded.
- **No secrets, tokens, personal data or production source.** The validator
  rejects:
  - the V-25.2 secret patterns;
  - credential-bearing URLs;
  - unredacted local paths (Windows drive paths, `/Users`, `/home`, `/tmp`,
    `/var`, `/private`, `/root`, `~/`);
  - email addresses outside reserved example domains.

  Fixtures must be repository fixtures under `tests/`, and transcripts are
  capped at 64 KiB. Pattern checks are heuristic: a clean result does not
  prove the absence of sensitive data, so read every record in full before
  committing it.
- **Redaction before keeping.** `--redact` does the following:
  - writes a new file only, and never overwrites one;
  - replaces the fixture root with `<FIXTURE>`;
  - masks other absolute paths, secrets, credential URLs and personal emails;
  - removes tool output bodies (file contents, command output);
  - drops non-JSON lines.

  `--score` refuses a transcript that still matches a privacy rule.
- **External models only after explicit opt-in.** The tool never calls a
  model. A live replay is a separate run that a maintainer starts under an
  authorization reference: the OD-10 budget and access rules, isolated homes,
  and read-only tools, as in the [Phase 5 runbook](../../tests/evaluation/phase5/README.md).
  Every recorded live run carries that reference.
- **No scripts from traces.** Reproduction steps are prose for a human.
  Detectors are literal string checks over the parsed transcript, and nothing
  in a record or transcript is executed. The record folders (`cases/`,
  `transcripts/`, `fixtures/`) accept only `.json`, `.jsonl`, `.md`, `.cs`,
  `.ts`, `.html` and `.sql`, so a shell, PowerShell, batch, Node or Python
  script is rejected. The tool imports no process, network or dynamic-code
  module, and a regression test checks this.

## Record format (`chayen-failure-case/1`)

One JSON file per case: `tests/failures/cases/FC-NNNN-<slug>.json`. The format
is closed, so an unknown field fails validation.

| Field | Meaning | Rule |
|---|---|---|
| `id` | Unique case ID | `FC-NNNN`; the file name starts with it |
| `title` | One-line description | Required |
| `origin`, `dataClassification` | `synthetic`/`synthetic` or `observed`/`redacted` | Must match |
| `consent` | Opt-in record | `null` for synthetic; required for observed |
| `category` | Observed failure category | One of the ten below |
| `request` | Redacted user request | `{ redacted: true, text }` |
| `skill` | Relevant Skill and Recipe | `{ name, recipe }`; both must exist in the plugin |
| `observedWith` | Provider and model, when actually observed | `null` for synthetic, which observed nothing. Observed: provider is `claude`, `codex` or `copilot`; model is the reported id, or `null` if the host did not report one |
| `source` | Source revision or package fingerprint | Git revision (7–40 hex) or package fingerprint (16–64 hex) |
| `expected`, `observed` | Expected and observed behaviour | Required prose |
| `reproduction` | Reproduction instructions | `fixture` under `tests/`; `facts` (`exists`, `contains`, `absent`) checked against the fixture; `steps` as prose |
| `evidence.transcripts` | Failing evidence | At least one `failing` (expects `REPRODUCED`) and one `control` (expects `NOT_REPRODUCED`) transcript under `tests/failures/transcripts/`. Synthetic transcripts start with a `{"type":"synthetic"}` marker line |
| `detector` | How a transcript shows the failure | `{ allOf: [signals] }`; see below |
| `rootCause` | Root-cause status | `not-investigated`, `suspected` or `confirmed`, with a summary |
| `correctiveAction` | Proposed corrective action | `proposed`, `applied` or `rejected`; summary; existing target files |
| `regressionTests` | Regression test reference | `tests/skills/<cases file>#<case id>`; the case must exist |
| `verification` | Verification status | `{ status, runs }`; see below |

## Failure categories

| Category | Value |
|---|---|
| Wrong Skill selected | `wrong-skill-selected` |
| Relevant Skill not selected | `relevant-skill-not-selected` |
| Incorrect requirement interpretation | `incorrect-requirement-interpretation` |
| Missed affected file | `missed-affected-file` |
| Invented schema or command | `invented-schema-or-command` |
| Scope expansion | `scope-expansion` |
| Missing verification | `missing-verification` |
| False DONE claim | `false-done-claim` |
| Permission or policy violation | `permission-or-policy-violation` |
| Excessive tool/search repetition | `excessive-tool-repetition` |

## Detector signals

Transcripts are parsed with the Phase 5 parser (`parseTranscript` in
`tests/evaluation/phase5/phase5-lib.mjs`), so Claude, Codex and Copilot event
shapes are read the same way as in the qualification harness. Matching is
literal and case-sensitive, and path separators are normalised to `/`.

| Signal | Holds when |
|---|---|
| `answer-includes-any` / `answer-includes-none` | The final answer contains any / none of `values` |
| `action-includes-any` / `action-includes-none` | Any / no tool action (tool, target, command) contains any of `values` |
| `skill-loaded-any` / `skill-loaded-none` | Any / none of the Skills in `values` loaded |
| `denied-action` | The host denied a tool action |
| `repeated-action-at-least` | One identical action repeats at least `count` (≥ 2) times |

The failure is reproduced when every signal holds. A detector must
discriminate: the validator replays the recorded failing and control
transcripts and fails if either gives a result other than the one it expects.

## Replay outcomes

| Outcome | Meaning |
|---|---|
| `REPRODUCED` | The transcript completed and every detector signal holds |
| `NOT_REPRODUCED` | The transcript completed and at least one signal does not hold |
| `FIXED_AND_VERIFIED` | The latest authorized live replay did not reproduce the failure, it ran on a later revision or package than `source`, the corrective action is `applied`, and a regression reference exists |
| `NOT_RUN` | No authorized live replay is recorded. This is the status of every synthetic case until someone opts in |
| `INCONCLUSIVE` | The run was cut off, hit a turn limit or an error, or has no answer to check |

`verification.status` is derived, never asserted. The validator recomputes
it from the transcripts in `verification.runs` and rejects any other value.
Only runs of kind `live-replay` count. Each live replay needs:

- an authorization reference;
- a date;
- the tested revision or package fingerprint;
- a redacted provider transcript (no synthetic marker);
- that transcript's SHA-256.

Changing guidance text, passing the validators, or replaying the recorded
synthetic transcripts offline never changes the status. A fix is verified
only when the agent's behaviour is shown to have changed.

Offline replay of the recorded transcripts checks the detector and the
record. It does not test the model.

## Commands

```bash
node tools/evals/failure-cases.mjs                     # validate every record; replay recorded transcripts offline
node --test tests/failures/failure-cases.test.mjs      # format, privacy, replay and status regressions
node tools/evals/failure-cases.mjs --redact <raw transcript> --fixture-root <disposable copy> --out <new file>
node tools/evals/failure-cases.mjs --case FC-0001 --provider claude --score <redacted transcript>
```

All four commands are offline. `validate-all.mjs` runs the first two as G-20
and G-20T.

## From an observed failure to a regression case

1. Write the failure in a redacted form. Never paste the conversation.
2. Rebuild it on a repository fixture (an existing one under `tests/`, or a
   new small synthetic one under `tests/failures/fixtures/`). State the facts
   that make the agent's output wrong, such as "AppDb.cs has no Email".
3. Hand-write a failing and a control transcript, or, after opt-in, record
   provider runs on a disposable copy of the fixture and redact them.
4. Write the detector, and add or point to the recipe or trigger case in
   `tests/skills/` (the existing process).
5. Run the validator. A synthetic case stays `NOT_RUN`.
6. After a corrective guidance change, the status changes only through a new
   authorized live replay on the changed revision.

## Current cases

| ID | Category | Fixture | Regression reference | Model behaviour |
|---|---|---|---|---|
| FC-0001 | Invented schema or command: an email column that `AppDb.cs` does not have | `tests/evaluation/fixture` | `rc-09-007-pos-real-schema` | NOT_RUN |
| FC-0002 | Missed affected file: a consumer that calls `api/orders` by URL string | `tests/failures/fixtures/orders-consumers` | `rc-01-004-pos-api-consumers` | NOT_RUN |
| FC-0003 | False DONE claim: two criteria with no test accepted, outcome DONE | `tests/evaluation/fixture` | `rc-04-007-pos-ac-verdicts` | NOT_RUN |

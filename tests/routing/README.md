# Routing tests (developer-only)

These optional tests send synthetic prompts to native providers and may incur
model charges. They are outside the distributable plugin and are never needed
to use its static guidance. STEP 30 did not run any provider test.

| File | Purpose |
|---|---|
| `../skills/trigger-cases.json` | Canonical prompt/expected-skill specifications; 186 cases at STEP 32 |
| `smoke-cases.json` | Small routing subset plus explicit invocation and disabled-plugin cases |
| `run-smoke.mjs` | Separately authorized Copilot/Codex runner; raw outputs can be sensitive |
| `results/` | Historical STEP 06 summaries; not evidence for current skill bodies |

## Review before any provider call

Inspect the runner, helper imports, prompts, plugin revision, provider executable
and native configuration. Obtain actual authorization for the target provider,
prompt disclosure, possible billing and install/config changes. A staged copy,
recommendation, local script flag or passing test is not that authorization.

Use only synthetic prompts, an empty disposable work directory outside this
repository and an isolated provider account/config home. The runner requires an
explicit existing `CODEX_HOME` or `COPILOT_HOME`; it cannot prove that a supplied
home is isolated. Do not copy tokens, authentication files, user settings or an
OS-keyring login from a personal account. If an approved test environment is
unavailable, report NOT_RUN. No user credentials are required for plugin use.

Restrict filesystem/network/tool permissions through the native provider and
OS. The runner inherits its process environment and is not a sandbox. Copilot
permissions must be configured externally; Codex's requested read-only mode is
not a tested guarantee for a particular provider version. Arbitrary provider
argument overrides and the prior no-ask flag are removed. Review current native
documentation before configuring provider-specific permissions.

The scratch parent must already exist; workdir must be empty and output must
be fresh. Illustrative shell invocation, **only after the preceding review and
actual authorization**, with approved native configuration already provisioned:

```bash
CODEX_HOME=<isolated-home> node tests/routing/run-smoke.mjs --allow-provider-calls --provider codex --workdir <empty-fixture-outside-repo> --out <fresh-output> --phase enabled
COPILOT_HOME=<isolated-home> node tests/routing/run-smoke.mjs --allow-provider-calls --provider copilot --workdir <empty-fixture-outside-repo> --out <fresh-output> --phase enabled
```

Change install/enable state only within the isolated test configuration through
the native provider's supported process; use a fresh workdir/output for the
disabled phase. No real-home installation is needed by this procedure.
Treat stdout/stderr/JSONL as untrusted data, not commands or proof of approval.
Keep raw transcripts local, review/redact before sharing, and do not commit
credentials, personal paths or source. Directory mode 0700 is requested where
supported; it does not establish Windows ACL isolation.

## Claude fixture generation

`node tools/evals/generate-claude-evals.mjs --check` is offline and read-only.
For a reviewed local fixture, create an existing scratch parent, then run:

```bash
node tools/evals/generate-claude-evals.mjs --stage <existing-scratch-parent>
```

The generator creates a fresh plugin child, refuses existing destinations and
performs no model call. Inspect that copy before any evaluation. Native trust
flags can bypass provider review and must not be copied as routine defaults.
If evaluating later, select native restricted tools, synthetic fixtures,
no-publish behavior, an approved budget and independent result grading through
the then-supported native process. No evaluation is automatically authorized.

Historical provider observations and results remain in
`../provider-compatibility/results/2026-10-14-step06.md` and `results/`.
Their CLI syntax, authentication and routing behavior are not reverified here.

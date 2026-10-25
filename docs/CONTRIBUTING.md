# Contributing

Thank you for helping improve Chayen.

- Released: **Chayen v1.1.2, MIT, CodeJaDee** (D-065; first release v1.0.0, D-061). Contributions are
  accepted under the [MIT licence](../LICENSE); see
  [Licence status](distribution/LICENSE_PROPOSAL.md).
- Repository access is needed until publication is confirmed.
- Security/Support is **LATER**; no reporting/support channel is selected.

## Reporting bugs

Prepare a redacted reproduction and retain it until the owner designates a
Support channel. No issue tracker or address is approved here. Include:

| Field | Example |
|---|---|
| Provider and surface, with version | Claude Code CLI 2.1.270 / Copilot CLI 1.0.97 / VS Code 1.141.1 + Copilot Chat |
| Chayen version | For example `1.1.2`, from `claude plugin list`, `codex plugin list`, or `copilot plugin list` |
| What you asked | The prompt, without secrets or proprietary code |
| What happened | Which skill loaded, if any; the relevant part of the answer |
| What you expected | The skill you expected, or "no skill" |
| Project context | Stack and versions: for example ASP.NET Core 8 + EF Core 8 + SQL Server |

**Common bug types:**

- **Wrong skill or no skill.** A routing problem. Give the exact prompt and
  say whether you were in a project folder.
- **Skill loaded but the guidance was wrong for my stack or version.**
  Name the reference if the agent showed it.
- **Install, update, or uninstall failed.** Include the command and its
  full output.

Do **not** report security vulnerabilities as issues. See
[SECURITY.md](../SECURITY.md).

## Requesting a skill or capability

Prepare a capability request answering these questions; submission awaits
the owner's Support decision:

1. **The task.** What engineering task should be covered? Give one or two
   example prompts.
2. **The stack.** Which stack or technology does it apply to?
3. **The gap.** What does your agent do today without it, and what is
   missing?
4. **The boundary.** When should it *not* apply?

Most requests are added as a **recipe or technology reference inside an
existing skill**:

- L0 metadata usage is 6,563 characters; there is no entry skill count
  ceiling or repository metadata cap (D-066), but every entry skill adds
  listing metadata on every turn and provider listing limits still apply
  (`node tools/catalog/discovery-metrics.mjs` reports the effect);
- each new entry skill competes with the others for selection.

A new entry skill needs a recorded decision and owner approval.

## Making changes

### Rules that keep the plugin safe and portable

- **One canonical source.** Skills live only in
  `plugins/codejadee-chayen-framework/skills/<name>/`. Never copy them into
  provider-specific folders.
- **Static content only.** Markdown and JSON. No hooks, MCP servers,
  scripts, executables, or runtime dependencies (ADR-0005; V-09 and V-25
  enforce this).
- **Portable frontmatter.** Use `name` (equal to the directory) and
  `description` (at most 1,024 characters) only.
- **Plain-name handoffs.** Refer to other skills by name, for example "the
  chayen-data skill". Never use provider-specific invocation syntax.
- **Matching identity.** `name` and `version` must be identical in both
  manifests and in the Copilot marketplace entry.
- **Honest wording.** No claims of enforcement or guarantees in skill
  content. Results that were not run are `NOT_RUN`, never "passed".

The authoring rules are in
[chayen/SKILL_AUTHORING_STANDARD.md](chayen/SKILL_AUTHORING_STANDARD.md),
and the quality gates in
[chayen/SKILL_QUALITY_GATES.md](chayen/SKILL_QUALITY_GATES.md).

### Developer checks

Use Node.js 24.22.0 for current development. Node.js 20.11.0 is the pinned
legacy compatibility floor, tested separately; it is not a recommended
maintainer runtime. See [CI/CD design](production/CI_CD_DESIGN.md).

These are offline and need no dependencies:

```bash
node tools/validate/validate-all.mjs                    # every automated gate
node tools/validate/check-docs.mjs                      # documentation links and identifiers
node tests/provider-compatibility/check-identity.mjs    # plugin identity and precedence
node tools/evals/run-evaluation-suite.mjs               # evaluation traceability, simulated proxy
node --test tests/ci/negative-controls.test.mjs          # isolated failure demonstrations
node --test tests/ci/limits.test.mjs                     # no former numeric cap; limits exceeded at once still valid
node tools/catalog/discovery-metrics.mjs                # discovery metadata, estimated tokens, provider figures
node tools/evals/failure-cases.mjs                      # failure records: validate, replay recorded transcripts offline
node tools/evals/distill.mjs                            # distillation proposals: six stages, offline validation on a copy
node tools/evals/audit-evidence.mjs                     # independent evidence audit: reference grader on synthetic cases
node tests/evaluation/phase5/candidate.mjs prepare --out <file>   # evaluation candidate for this build; offline
node tools/ci/check-workflow.mjs                        # pinned linter download; no providers
```

There is no repository cap on Skill count, file length, reference depth or
total discovery metadata (D-066). Sizes and metadata are reported instead,
with warnings at provider recommendations. A Skill that grows past an old
limit is fine if it stays concise, distinct and safely linked. Provider
limits (name ≤64 characters, description ≤1,024) still fail.

**When you change a skill:**

- add or update positive and negative cases in `tests/skills/`;
- regenerate the Claude eval cases with
  `node tools/evals/generate-claude-evals.mjs`.

**When an agent gets a task wrong with a skill loaded:**

1. Keep the redacted prompt, the skill and reference that loaded, and the
   step where the agent went wrong, for example a guessed column name or a
   criterion marked done without evidence.
2. Reproduce it as a case in `tests/skills/`: a recipe case in
   `recipe-cases.json` whose `checks` name the observable mistake, or a
   trigger case in `trigger-cases.json` for a routing problem.
3. Change the smallest piece of guidance that prevents the mistake, in the
   reference that loaded before the entry `SKILL.md`. When a command or
   approach worked in the failed session, write that down instead of new
   general advice.
4. Run the validators. The new case stays NOT_RUN until an authorized
   provider run grades it.

To make the failure replayable, also add a failure record in
`tests/failures/` ([format and rules](chayen/FAILURE_REPRODUCTION.md)):

- a fixture with checkable facts;
- a failing and a control transcript;
- a detector;
- the case from step 2 as its regression reference.

Records are synthetic, or redacted with explicit opt-in. Never paste a
conversation, a secret, personal data or production source. The record's
verification status changes only through an authorized live replay on the
changed revision, never because the guidance text changed.

To turn a failure record into a guidance fix, a Mentor (a capable model in
an opt-in session, or a maintainer) writes a proposal in
`tests/distillation/`. It contains the diagnosis, the smallest allowed
action, a diff, and the review. The full process is in
[knowledge distillation](chayen/KNOWLEDGE_DISTILLATION.md).

`node tools/evals/distill.mjs` applies the diff only to a disposable copy and
runs the offline validators there. It derives the decision: a guidance
change is promoted only after human review and a live baseline-versus-
candidate comparison shows the improvement. Not every failure becomes a
Skill change. Prefer an existing Recipe, and never add an Entry Skill for a
single failure.

Native provider validation is a separate authorized check when the CLI is
available; it is not a dependency of ordinary CI. Provider runs
(`tests/evaluation/run-provider-probes.mjs`,
`tests/provider-compatibility/run-lifecycle.sh`) are **billed and/or change
provider state**. They need explicit authorization; see
[tests/evaluation/README.md](../tests/evaluation/README.md).

### AI-assisted contributions

AI-assisted contributions are welcome. Much of this repository was developed
that way. Please:

- review and test the output yourself;
- never include results you did not run;
- mention the assistance in your pull request description.

### Pull requests

Unprotected `main` is an accepted release-process risk. Branch Protection
and Required Reviews are deferred, not required Phase 3 settings. The
[manual release sign-off](production/MANUAL_RELEASE_SIGNOFF.md) is required
before any release action; CI success never grants publication permission.

- Keep each pull request to one concern, and list the commands you ran with
  their results.
- Do not bump `version`, publish, tag, or change marketplace listings. Those
  are release actions taken by the project owner (see
  [release/RELEASE_CHECKLIST.md](distribution/RELEASE_CHECKLIST.md)).

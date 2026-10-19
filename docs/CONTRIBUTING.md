# Contributing

Thank you for helping improve Chayen.

- Released: **Chayen v1.0.0, MIT, CodeJaDee** (D-061). Contributions are
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
| Chayen version | For example `1.0.0`, from `claude plugin list`, `codex plugin list`, or `copilot plugin list` |
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

- L0 metadata usage is 6,563 / 7,000 characters, and all 16 entry points ship
  (D-062 raised the ceiling to 16 for `chayen-init`);
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
node tools/ci/check-workflow.mjs                        # pinned linter download; no providers
```

**When you change a skill:**

- add or update positive and negative cases in `tests/skills/`;
- regenerate the Claude eval cases with
  `node tools/evals/generate-claude-evals.mjs`.

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

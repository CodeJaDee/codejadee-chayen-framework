---
kind: recipe
capabilities: [CAP-16-005, CAP-16-006, CAP-16-007, CAP-18-001]
---
# Pull requests, code review, and review comments

Prepare pull requests that reviewers can trust (self-reviewed, focused,
with context, real testing evidence, and risks), review diffs with
prioritised and actionable comments, and work through review comments
until each has a change or a reasoned reply, re-verifying after changes.
The same review loop checks a change against the team's written standards,
citing the exact rule for each deviation.

## Inputs

- The diff or branch, the target branch, and the related issue or
  requirement.
- The repository's PR template, contribution guide, and conventions.
- Test and build results from this session, or supplied by the user.
- For comment resolution: the review comments and the reviewers' intent.

## Procedure

### Pull request preparation (CAP-16-005)

1. **Self-review the diff:** unrelated changes, debug code, commented-out
   code, secrets, generated files, and missing tests. Suggest splitting
   unrelated changes into separate PRs.
2. **Run the verification the project uses** (build, tests, lint), or use
   results the user supplied. Report exactly what ran, with commands and
   counts; anything that did not run is "not run".
3. **Write the description in the PR template:** what and why (linked
   issue), how, testing evidence, risks and rollback, screenshots for UI
   changes (provided by the user or captured in this session), and follow-ups.
4. **Do not open or update the PR on a remote service** without the user's
   approval.

### Code review (CAP-16-006)

1. **Understand the intent** from the description and linked issue, then
   read the diff in context (callers, tests).
2. **Check correctness first:** logic errors, edge cases, error handling,
   concurrency, data changes, and behaviour against the requirement.
3. **Then design, tests, readability, and convention fit:** missing or weak
   tests, naming, duplication, and fit with existing patterns.
4. **Classify each comment:**
   - **blocking:** incorrect behaviour, data loss, a broken contract, a
     missing test for changed logic;
   - **should-fix:** maintainability or clarity problems worth fixing now;
   - **nit:** style and preference, never blocking.
5. **Write each comment** with `path:line`, the problem, why it matters, and
   a concrete suggestion. Hand security-specific findings to the security
   skill.
6. **Summarise the verdict** (approve, approve with suggestions, request
   changes) with the reasoning. Post to a remote service only with
   approval.

### Review comment resolution (CAP-16-007)

1. **List and classify the comments:** must change, agreed suggestion,
   question, disagreement, or out of scope.
2. **Apply the agreed changes** in focused commits, following the
   implementation workflow for code changes.
3. **Draft a reply per comment:** what changed (with the commit), or why
   not, with reasoning; questions get answers or follow-up issues.
4. **Re-run verification** after changes and report the results.
5. **Do not resolve threads or push** without the user's approval.

### Standards compliance check (CAP-18-001)

1. **Collect the written standards in force:** coding guidelines,
   instruction files (`AGENTS.md`, `CLAUDE.md`, contribution guides), and
   lint and formatter configuration. Only written rules count; conventions
   observed in code are reported separately as conventions.
2. **Run the automated checks** the project defines (linters, formatters,
   analyzers) on the code or diff, and record the results with commands.
3. **Check the remaining rules by reading the code,** and report each
   deviation with the rule (document and section, quoted briefly), the
   location, a severity, and a suggested fix.
4. **List rules that could be automated** (a lint rule, an analyzer, a CI
   check) so they stop depending on review.
5. **Do not certify compliance:** report "no deviations found for the listed
   rules in the reviewed scope", and name the rules that were not checked.

## Outputs

- A PR description following the repository template, with verification
  evidence, plus self-review notes and suggested splits.
- Review comments grouped as blocking, should-fix, and nit, each with
  location and suggestion, and a summary verdict with reasoning.
- Changes per accepted comment, a reply draft per comment, and re-run
  verification results.
- For a standards check: a deviation list (rule, location, severity,
  suggested fix), and the rules that could be enforced automatically by a
  linter or CI check.

## Technology considerations

| Stack | Consideration |
|---|---|
| GitHub | `.github/pull_request_template.md`, `gh pr diff` and `gh pr view` to read (posting with `gh pr create` or `gh pr review` only with approval), CODEOWNERS for reviewers. |
| Azure DevOps and GitLab | Their PR or merge request templates and the `az repos pr` or `glab mr` CLIs, with the same approval rule for writes. |
| .NET, JavaScript, Python | The project's own build, test, and lint commands as the verification evidence. |
| UI changes (Angular, React, Vue) | Screenshots or recordings only from the user or a run in this session; otherwise state that visual checks were not done. |

## Verification

- The description uses the fixture's PR template and reports only test runs
  that actually happened.
- A seeded off-by-one and a missing test in the fixture PR are reported as
  blocking, and style nits are not marked blocking.
- Each fixture comment gets a change or a reasoned reply, and tests are
  re-run after changes, with results.
- Nothing was posted, pushed, or resolved on a remote service without
  approval.
- Two seeded violations of the fixture's written standard are reported with
  the exact rule cited.

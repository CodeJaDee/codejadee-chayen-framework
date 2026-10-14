---
kind: recipe
capabilities: [CAP-11-003, CAP-11-004]
---
# SAST and dependency scanner triage

Turn static-analysis alerts and dependency advisories into decisions:
confirm reachability and exploitability against the code, record false
positives with reasons, and choose upgrade, patch, mitigate, or accept for
each real issue. A scanner that was not run proves nothing, and a
suppression is a documented decision, not a way to clear the report.

## Inputs

- Scanner output: SARIF, a CodeQL, Semgrep, SonarQube, or Roslyn analyzer
  report, or an audit command's output.
- Access to the code, manifests, and lock files.
- The deployment context (which code is reachable from untrusted input) and
  any existing suppression conventions.

## Procedure

### SAST triage (CAP-11-003)

1. **Load the findings** and group them by rule and location. Note the
   tool, version, and rule ID for each.
2. **Verify each finding against the code:**
   - Is the source actually untrusted (request, file, message), or
     constant or configuration?
   - Is the path from source to sink feasible, or is there a sanitizer,
     parameterization, or type constraint the tool missed?
   - Is the code reachable in production (not test code, not dead code)?
3. **Assign a verdict:** true positive, false positive, or needs
   information, with the reasoning and `path:line` evidence.
4. **Prioritise true positives** by the severity guide in
   [review-checklist.md](review-checklist.md), adjusted for exposure.
5. **Write suppressions for confirmed false positives only,** in the tool's
   format, with the justification and the reviewer, and scoped to the
   single location. Never suppress a rule globally to reduce noise without
   approval.

### Dependency vulnerability triage (CAP-11-004)

1. **Run the audit,** when allowed, or read the provided output:
   `dotnet list package --vulnerable --include-transitive`, `npm audit
   --omit=dev` (or the pnpm and Yarn equivalents), `pip-audit`. If it was
   not run, report NOT_RUN and do not claim the absence of advisories.
2. **For each advisory, decide whether the application is affected:**
   - the installed version (from the lock file) is in the vulnerable range;
   - the vulnerable function or feature is used (reachability);
   - the code path is exposed (runtime dependency, internet-facing).
3. **Choose the action:**

   | Action | When |
   |---|---|
   | Upgrade | A fixed version exists. Prefer the smallest version that fixes it, and follow the upgrade process (release notes, tests). |
   | Patch or override | Only a transitive dependency is affected and the parent has no release yet (`overrides`, `resolutions`, a direct reference, a constraints file). |
   | Mitigate | No fix exists: disable the feature, add input limits, or isolate the component. |
   | Accept | Not affected or not reachable, documented with the reasoning and a review date. |

4. **Ask before upgrading** packages. Dependency upgrades follow the
   project's upgrade process.

## Outputs

- A triage table: finding, tool and rule, verdict (true, false, needs
  information), reasoning with code evidence, and priority.
- Suppression entries with justification for confirmed false positives.
- An advisory table: package, installed version, advisory, affected or
  not, reasoning, and action.
- The audit command run and its result, or NOT_RUN.

## Technology considerations

| Stack | Consideration |
|---|---|
| .NET | Roslyn analyzers and SonarAnalyzer suppressions with `[SuppressMessage(..., Justification = ...)]` or `.editorconfig` severity per rule. `dotnet list package --vulnerable --include-transitive`. Transitive fixes through a direct `PackageReference` or Central Package Management transitive pinning. |
| JavaScript and TypeScript | CodeQL or Semgrep inline comments (`// nosemgrep: <rule-id>` with a reason). `npm audit` severity is not reachability. `overrides` (npm), `resolutions` (Yarn), `pnpm.overrides`. |
| Python | Bandit `# nosec <id>` with a reason, Semgrep rules, `pip-audit` (with `-r requirements.txt` or the environment), constraints files for transitive pins. |
| SARIF in CI | GitHub code scanning dismissals record a reason (false positive, used in tests, won't fix). Keep the triage table as the evidence. |

## Verification

- For a fixture SARIF file with one true and one false positive, both
  verdicts are correct and evidenced with code locations.
- Audit commands are run and reported with results, or NOT_RUN, and the
  absence of vulnerabilities is never claimed without a run.
- Every suppression has a justification and a single-location scope.
- No package was upgraded without approval.

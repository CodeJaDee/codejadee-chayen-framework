---
kind: recipe
capabilities: [CAP-15-001]
---
# Legacy system assessment

Assess a legacy system's state from repository evidence (technology age and
support status, risk, coupling, test safety net, and change activity), then
compare the options (retain, refactor, replatform, rewrite, retire) and
recommend a first step. The assessment is read-only, every finding carries
an evidence label, and business value comes from the user, not from the
code.

## Inputs

- Read access to the repository, and the system boundary to assess.
- Business context from the user: value, users, roadmap, deadlines, and
  pain points. Unknowns are recorded as `unknown`.
- Optional tool output the user allows: build warnings, coverage, outdated
  package reports.

## Procedure

1. **Profile the system** with the repository profile approach: stacks,
   versions, projects, build and test commands. Label each finding
   `found`, `inferred`, or `unknown`.
2. **Assess each dimension with evidence:**

   | Dimension | Evidence |
   |---|---|
   | Technology age and support | Runtime and framework versions (for example `net48`, `netcoreapp3.1`, AngularJS, Python 3.7), compared with the vendor's published support dates, cited or marked `unknown` |
   | Test safety net | Test projects present or absent, test counts, coverage if provided, skipped tests |
   | Coupling | Project references, shared databases, static or global state, circular dependencies |
   | Change activity | Commit frequency and recent churn per area, from history |
   | Operational risk | Hard-coded configuration, manual deployment steps, single maintainers, known incidents the user reports |
   | Knowledge | Documentation present, owners, and areas nobody has changed in years |

3. **Compare the options,** each with its cost, risk, and prerequisites:
   - **retain:** keep running as is, with what it costs;
   - **refactor:** improve in place, which needs a safety net first;
   - **replatform:** move runtime or hosting with small code changes;
   - **rewrite or replace:** incrementally, behind a facade (strangler),
     planned with the architecture skill;
   - **retire:** remove, if usage and value allow.
4. **Recommend a first step** that is small and reduces risk regardless of
   the final option (for example adding characterization tests around the
   most-changed area, or upgrading an out-of-support runtime), marked as a
   proposal for the owner.
5. **List what was not assessed** and the questions only the owner can
   answer.

## Outputs

- An assessment with evidence per dimension, each finding labelled.
- An option comparison and a recommended first step, labelled proposal.

## Technology considerations

| Stack | Consideration |
|---|---|
| .NET | `TargetFramework` values (`net4x`, `netcoreapp*`), `packages.config`, WCF or WebForms usage, `System.Web` dependencies, which determine replatforming effort. |
| JavaScript and TypeScript | AngularJS, old React class-component code bases, Webpack configurations without a lock file, unmaintained packages. |
| Python | Python 2 remnants, old Django versions, no lock file, setup.py-only packaging. |
| SQL Server and PostgreSQL | Business logic in stored procedures and triggers, shared databases across applications, unsupported engine versions (support dates cited or `unknown`). |

## Verification

- The assessment cites the end-of-support runtime versions found in the
  fixture and the absence of tests, each with `path:line` or a command.
- Every option has a cost, a risk, and prerequisites, and the recommended
  first step is labelled a proposal.
- No file was changed, and business value is attributed to the user.

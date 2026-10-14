---
kind: recipe
capabilities: [CAP-10-013]
---
# Coverage gaps by risk

Find the untested code that matters most by combining a coverage report
with risk signals (critical paths, complexity, change frequency, bug
history), and propose the tests to write first. Coverage percentage is an
input, not the goal.

## Inputs

- A coverage report, or the ability to produce one with the project's
  tools (line and branch coverage).
- The code structure and the critical flows (payments, authorization, data
  writes, integrations).
- Change and bug history from version control, if available.

## Procedure

1. **Produce or read the coverage report** with the existing tooling,
   including branch coverage where supported. Record the command and its
   status. If coverage cannot run, mark it BLOCKED or NOT_RUN and work from
   the code and history alone, saying so.
2. **Exclude noise:** generated code, migrations, DTOs without logic,
   simple property accessors, and framework startup code, unless they hold
   logic.
3. **Score uncovered or weakly covered units** on risk signals:

   | Signal | Source |
   |---|---|
   | Criticality | Money, authorization, data deletion, external integrations |
   | Complexity | Branches and nesting in the function |
   | Churn | How often the file changed recently (`git log --since`) |
   | Defect history | Bug-fix commits or issues touching the code |
   | Coverage | Uncovered lines and, especially, uncovered branches |

4. **Rank the gaps,** and explain the reasoning for each of the top items in
   one sentence.
5. **Suggest the level and the cases** for each top gap: unit for logic,
   integration for queries and wiring, API tests for authorization.
6. **Do not chase the percentage.** Never add tests without meaningful
   assertions to raise coverage, and point out covered-but-unasserted code
   if found.

## Outputs

- A ranked gap list with the risk reasoning and the suggested test level
  and cases.
- The coverage command and its result, or NOT_RUN or BLOCKED with the
  reason.

## Technology considerations

| Stack | Consideration |
|---|---|
| .NET | `dotnet test --collect "XPlat Code Coverage"` (coverlet collector) or `dotnet-coverage`, with ReportGenerator for a readable report if installed. |
| JavaScript and TypeScript | `npx vitest run --coverage` (v8 or istanbul provider) or `npx jest --coverage`. Angular `ng test --code-coverage`. |
| Python | `pytest --cov=<package> --cov-branch --cov-report=term-missing` with pytest-cov, or `coverage run -m pytest` and `coverage report -m`. |
| Version control | `git log --since="6 months ago" --name-only` for churn, and commit messages or issue links for defect history. |

## Verification

- The seeded untested critical function in the fixture ranks above trivial
  getters, with its reasoning shown.
- The coverage numbers come from a command run in this session, or are
  labelled as taken from the user's report, or NOT_RUN or BLOCKED.
- Each suggested test names a behaviour to assert, not just lines to
  execute.

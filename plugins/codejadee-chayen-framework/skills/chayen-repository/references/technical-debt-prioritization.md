---
kind: recipe
capabilities: [CAP-15-010]
---
# Technical debt prioritization

Rank technical debt items by cost of delay, risk, and effort with a
reproducible score, and turn the top items into proposed, justified work.
The ranking is a recommendation built from evidence and the team's inputs;
the team owns the decision. Nothing is changed in the repository.

## Inputs

- A debt list: the technical debt register from the inventory recipe, or
  one the user provides.
- Evidence the repository offers: change frequency per area, defect fixes,
  test coverage, and incidents the user reports.
- The team's inputs: business areas that matter most, upcoming work, and
  any weighting they prefer.

## Procedure

1. **Start from the register.** If no register exists, run the inventory
   recipe first, or ask for the list.
2. **Gather signals per item,** each with its source:

   | Signal | Source |
   |---|---|
   | Change frequency | `git log --since` counts for the files involved |
   | Defect history | Bug-fix commits or issue links touching the area |
   | Risk | Security or support exposure (for example an out-of-support runtime), missing tests on critical paths |
   | Cost of delay | What the debt slows or blocks: upcoming features in the area, onboarding, incident time (from the team) |
   | Effort | The effort class from the inventory (S, M, L) |

3. **Score with a stated formula,** for example
   `score = (cost of delay + risk) × change frequency weight ÷ effort`,
   using small integer scales (1 to 5) with the meaning of each level
   written down. Use the team's weighting if they have one.
4. **Rank the items** and show the inputs and score for each row, so anyone
   can reproduce the order.
5. **Propose the next items:** the top few, each with the expected benefit,
   the first concrete step, and where it could fit (alongside planned work
   in the same area is often cheapest).
6. **Label the result proposed.** List the assumptions and the inputs that
   came from the team rather than the repository.

## Outputs

- A ranked debt list with the scoring rationale: signals, scales, formula,
  and score per item.
- Proposed next items with expected benefit and first step.

## Technology considerations

| Stack | Consideration |
|---|---|
| Version control | `git log --since="6 months ago" --name-only` for churn, and commit messages or issue references for defect history. Shallow clones under-count: report it. |
| .NET, JavaScript, Python | Build warnings, analyzer suppressions, and type-checker ignores as risk signals; coverage reports if provided. |
| Platforms and runtimes | End-of-support dates are cited from vendor documentation or marked `unknown`; an unsupported runtime raises risk. |
| Issue trackers | Links to issues come from the user or the repository; the agent does not access trackers it was not given. |

## Verification

- For a fixture debt list with change-frequency data, the high-churn,
  high-risk item ranks first, and the scoring is reproducible from the
  stated inputs.
- Every signal cites its source, and team-supplied inputs are marked as
  such.
- The result is labelled proposed, and no file was changed.

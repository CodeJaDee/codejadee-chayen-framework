---
kind: recipe
capabilities: [CAP-02-002, CAP-02-003, CAP-02-008]
---
# Stories, acceptance criteria, and edge cases

Refine user stories until they are clear, small, and testable. Write
observable acceptance criteria. Systematically surface the edge cases that
become further criteria or open decisions.

## Inputs

- The story or requirement text, plus any linked notes, designs, or rules.
- The team's story format, definition of ready, and acceptance criteria style
  (for example Given-When-Then, checklists, or `.feature` files), if they
  exist.
- Known business rules, roles, and data types. Use the requirements record
  if one exists.

## Procedure

1. **Refine the story.**
   1. Rewrite it in the team's format. The default is "As a `<role>`, I
      want `<capability>`, so that `<benefit>`".
   2. Name a real role, a single capability, and the value.
   3. Check it against INVEST:
      - Independent;
      - Negotiable;
      - Valuable;
      - Estimable (the information exists, without producing an estimate);
      - Small;
      - Testable.
   4. Record each weakness found.
2. **Split the story when it is too large,** along a seam that keeps
   vertical value: by workflow step, by business rule variant, by data
   variant, or by happy path first and exceptions later. Never split by
   technical layer.
3. **Write the acceptance criteria.**
   - Use one criterion per behaviour, in the team's style. The default is
     `Given <context> When <action> Then <observable outcome>`.
   - Cover the main flow, the alternatives, and the failure cases.
   - Each criterion names observable data or UI state, and how it would be
     checked: automated test or manual check.
   - Rewrite vague words ("fast", "correctly", "user-friendly") into
     measurable terms, or record them as an open decision.
4. **Discover edge cases** by walking each category:

   | Category | Probe |
   |---|---|
   | Empty and missing | No items, null or blank fields, a deleted reference |
   | Boundaries | Zero, one, maximum, the limit ± 1, the longest text, the largest file |
   | Formats | Unicode, right-to-left text, decimals and rounding, currency, leading zeros |
   | Time | Time zones, daylight-saving changes, leap day, month end, expiry at the boundary second |
   | Concurrency | Two users editing, double submit, retry after timeout |
   | Permissions | No access, another user's or tenant's data, role changes mid-flow |
   | Partial failure | A downstream service down, a timeout after commit, a partial batch |
   | State | Re-entry after cancel, back navigation, an already-processed item |

   For each edge case, record the expected behaviour if a source states it
   (it becomes a criterion). Otherwise record an open decision with the
   options.
5. **Record** the refined story, criteria, edge cases, and decisions in the
   requirements record.

## Outputs

- The refined story or stories in the team's format, with the INVEST
  weaknesses found and the assumptions marked.
- Numbered acceptance criteria. Each is observable, has its check method,
  and traces to a fact or a confirmed assumption.
- An edge-case list by category, each with its expected behaviour or an open
  decision.
- The criteria intentionally left out of scope, with the reason.

## Technology considerations

| Stack | Consideration |
|---|---|
| Gherkin (Reqnroll or SpecFlow for .NET, Cucumber.js, behave or pytest-bdd for Python) | If `.feature` files exist, write the criteria as scenarios in that style and wording. Do not introduce Gherkin where it is not used. |
| Playwright / Cypress | UI criteria should name roles, labels, or visible text that tests can target, not pixel layout. |
| ASP.NET Core / Node / Python APIs | API criteria name the status code, the response field, and the error shape the project already uses. |
| Angular / React / Vue forms | Validation criteria name the message text or key, and when it appears (on blur or on submit), following the existing form pattern. |
| SQL Server / PostgreSQL | Data criteria state the persisted values and constraints, not the implementation (no "add a column"). |

## Verification

- No criterion contains unmeasurable wording without a measurable rewrite or
  an open decision.
- Every criterion has a check method, and traces to a fact or an assumption.
- The story names a role, a capability, and a benefit. A split produces
  vertical slices, not layer tasks.
- Every edge-case category was considered. For each case, there is an
  expected behaviour or an open decision. None is silently assumed.

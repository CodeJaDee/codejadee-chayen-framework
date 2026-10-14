---
kind: recipe
capabilities: [CAP-02-006]
---
# Requirement traceability

Link requirements to design decisions, code, tests, and verification
evidence, using links the repository actually contains. The result shows
coverage gaps, and code that no requirement asks for. A link is never
invented: no evidence means no link.

## Inputs

- A requirement list with stable IDs: a requirements record, ticket IDs, or
  a document.
- Repository read access: code, tests, ADRs, commit messages, and PR
  references.
- Optional test results or CI reports that serve as verification evidence.

## Procedure

1. **Normalize the requirement IDs.** If the requirements have no IDs,
   propose them (for example `REQ-01`), and record that they were assigned
   now.
2. **Find the explicit links first.**
   - Search for the IDs or ticket keys in:
     - test names and attributes, such as xUnit `[Trait("Requirement","REQ-01")]`,
       Jest or Vitest `describe` titles, pytest markers, or `@REQ-01` tags in
       `.feature` files;
     - code comments;
     - ADRs;
     - commit messages: `git log --grep='REQ-01' --oneline`.
   - These links are `found`, with their sources.
3. **Find the semantic links second.**
   - Where no ID is present, match each requirement's behaviour to the code
     and tests that implement or check it.
   - Label these `inferred`, with the reasoning, for example: "test
     `Cancel_AfterCutoff_Returns409` checks AC3".
4. **Attach evidence.** Mark a test as covering a requirement only if it
   asserts the requirement's acceptance criterion.
   - Test results count as verification evidence only when they come from an
     executed run (a cited CI or local result).
   - Otherwise mark them NOT_RUN.
5. **Report the gaps both ways:**
   - requirements without implementation, or without tests;
   - code areas or tests that trace to no requirement (candidates for
     missing requirements or dead code; do not judge which).
6. **Propose a lightweight linking convention** only if the user wants
   ongoing traceability. Follow the team's tooling. Never rename existing
   tests unasked.

## Outputs

A traceability matrix for the requested requirements, plus the gaps in both directions. Every link carries its evidence and its label.

```text
Traceability matrix — scope: <requirements set>
| Requirement | Design / decision | Code | Tests | Evidence | Status | Link label |
| REQ-01 | ADR-0004 | src/Orders/CancelService.cs:30 | CancelTests.Cancel_AfterCutoff_Returns409 | CI run #812 PASS | covered | found |
Gaps: <requirements without code/tests>; <code/tests without requirement>
```

## Technology considerations

| Stack | Consideration |
|---|---|
| .NET (xUnit, NUnit, MSTest) | `[Trait]`, `[Category]`, and `[TestCategory]` can carry requirement IDs. Filter runs with `dotnet test --filter "Requirement=REQ-01"`. |
| JavaScript / TypeScript (Jest, Vitest, Playwright, Cypress) | IDs in `describe` or `test` titles, or Playwright annotations and tags. Select with `--grep REQ-01`. |
| Python (pytest) | Custom markers (`@pytest.mark.req("REQ-01")`) must be registered in the pytest configuration. Select with `-m`. |
| Gherkin (Reqnroll, SpecFlow, Cucumber, behave) | Tags on scenarios (`@REQ-01`) are the natural link. |
| SQL Server / PostgreSQL | Migrations rarely carry IDs. Link schema changes through the migration name or the commit message. |

## Verification

- Every `found` link cites the location of the ID. Every `inferred` link
  states its reasoning.
- No requirement is marked covered without a test that asserts its
  criterion. No test result is claimed without an executed run.
- Both gap directions are reported.
- No code or test was renamed or changed unless the user approved a linking
  convention.

# Task contract

A short agreement written **before** editing a non-trivial change. Keep it
under about 25 lines and present it in the conversation.

- Write it to a file only if the user asks, or if the repository already
  keeps such documents.
- Skip it for changes that touch one or two files with no risky actions.
  Mention that it was skipped.

## Template

```text
Task contract
Goal: <one sentence, user-visible outcome>
In scope:
- <behavior or component>
Out of scope:
- <explicit exclusions>
Assumptions (to confirm):
- <assumption> — impact if wrong: <impact>
Acceptance criteria:
1. <observable, testable statement>
Affected areas: <projects / folders / layers>
Approach: <analogous feature to follow; edit order>
Risky actions needing approval: <migration | deletion | auth | dependency | none>
Verification plan: <build, test, lint commands; new tests to add>
```

## Rules

| Section | Rule |
|---|---|
| Acceptance criteria | Must be testable, and each maps to a test or a manual check. "Works correctly" is not a criterion. |
| Assumptions | Every assumption that changes the result is listed and confirmed with the user. |
| Risky actions | Each needs explicit approval before it is performed, not only before the contract is accepted. |
| Scope changes | Update the contract and re-confirm. Do not let the scope drift silently. |

## Example

```text
Task contract
Goal: Users can export their own orders as CSV from the Orders page.
In scope: export endpoint, CSV formatting, download button.
Out of scope: Excel format, admin export of all users' orders.
Assumptions (to confirm):
- Export uses the current list filters — if wrong, endpoint signature changes.
Acceptance criteria:
1. GET /api/orders/export returns text/csv for the signed-in user's orders only.
2. Columns: OrderNumber, Date (ISO 8601), Total, Status.
3. The button downloads the file using current filters.
Affected areas: Orders API controller and service, Orders page component.
Approach: follow the existing invoice PDF download (same auth and filter handling).
Risky actions needing approval: none.
Verification plan: dotnet test; ng test --watch=false; new API test for row-level authorization.
```

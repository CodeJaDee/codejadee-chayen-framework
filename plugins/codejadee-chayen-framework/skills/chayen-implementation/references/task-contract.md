---
kind: recipe
capabilities: [CAP-04-001, CAP-04-002, CAP-04-003]
---
# Task contract

A short agreement written **before** editing a non-trivial change. It states
the goal, the testable acceptance criteria, the edit plan, and the risky
actions that need approval. Keep it under about 25 lines and present it in
the conversation.

## Inputs

- The goal, with enough detail to state acceptance criteria.
- Orientation results from the repository:
  - stack and versions;
  - the real build and test commands, from CI files or scripts;
  - the closest analogous feature.
- The areas the change touches, so that risky actions can be identified.

## Procedure

1. **Decide whether a contract is needed.**
   - Write one when the change touches three or more files, or any risky
     area.
   - Otherwise skip it, and say in one line that it was skipped.
2. **Fill in the template below** in the conversation.
   - Write it to a file only if the user asks, or if the repository already
     keeps such documents.
3. **Plan the edit in `Approach`.**
   - Name the analogous feature to follow.
   - List the files per layer, in edit order: data model and migration,
     then domain or service, then API, then UI, then tests.
   - Name the point after each layer where the build must still pass.
4. **Classify the risk.**
   - Check the change against this list of risky actions: schema or data
     migrations, deleting files, authentication or authorization, breaking
     public contracts, new dependencies or major upgrades, production
     configuration, anything irreversible.
   - Record every match under `Risky actions needing approval`, or write
     `none`.
   - Assign the highest class that applies, with the reason:

     | Class | When | Required before merge or execution |
     |---|---|---|
     | Low | Internal, reversible, no data, security, or contract impact | Build and tests |
     | Medium | Several modules or a deployable boundary. A behaviour change visible to users. A new dependency. | Approval of the contract, plus tests at the affected levels |
     | High | Public contract, authentication or authorization, persisted data, production configuration | Explicit approval per risky action, a rollback note, and a staged rollout considered |
     | Critical | Irreversible data loss, security-sensitive data exposure, financial effects | Named approver, a rehearsed rollback or restore, and a staged rollout plan |

   - Unknown blast radius is not Low. Classify it at least Medium, and say
     what would lower it.
5. **Confirm with the user** when the contract contains a risky action or an
   assumption that changes the outcome. Otherwise proceed, and keep the
   contract visible.
6. **Keep the contract current.**
   - Before each risky action, ask for approval of that action. Approval of
     the contract is not enough.
   - If the scope changes, update the contract and re-confirm it.

## Outputs

- A task contract in the template format, with:
  - its status (`proposed` until the user confirms it);
  - testable acceptance criteria;
  - an ordered edit plan per layer;
  - every risky action listed;
  - a risk class with its reason.
- An explicit approval request when risky actions or outcome-changing
  assumptions exist. Otherwise a one-line note that the contract was
  skipped.

## Template

```text
Task contract
Status: proposed | approved by <user> (<date>)
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
Risk class: <Low | Medium | High | Critical> — reason: <why>
Verification plan: <build, test, lint commands; new tests to add>
```

## Rules

| Section | Rule |
|---|---|
| Acceptance criteria | Must be testable, and each maps to a test or a manual check. "Works correctly" is not a criterion. |
| Assumptions | Every assumption that changes the result is listed and confirmed with the user. |
| Risky actions | Each needs explicit approval before it is performed, not only before the contract is accepted. |
| Scope changes | Update the contract and re-confirm. Do not let the scope drift silently. |
| Status | The contract is `proposed` until the user confirms it. Approval of the contract never implies approval of the individual risky actions. |

## Technology considerations

Stack-neutral. The verification plan uses the repository's own commands
(for example `dotnet test`, `ng test --watch=false`, `npm test`, `pytest`),
as found in CI files or scripts, and never assumed. The edit order follows
the layers the repository actually has. A project without a data layer skips
that step.

## Verification

- For qualifying changes, the contract appears before the first file edit.
- Every acceptance criterion is observable, and is later mapped to a test or
  check in the change summary.
- The risk class follows the table. An unknown blast radius is never
  classed Low.
- Every risky action in the plan has the user's explicit approval recorded
  before it is performed. If approval is missing, the step is reported as not
  done.
- The verification plan names commands that exist in the repository, each
  marked as found or inferred.

## Example

```text
Task contract
Status: proposed
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
Risk class: Medium — reason: new endpoint exposing user data; row-level authorization must hold.
Verification plan: dotnet test; ng test --watch=false; new API test for row-level authorization.
```

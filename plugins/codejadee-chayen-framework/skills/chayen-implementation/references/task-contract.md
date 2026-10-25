---
kind: recipe
capabilities: [CAP-04-001, CAP-04-002, CAP-04-003]
---
# Task contract

This recipe holds the single decision for a change request: when to clarify
first, when a task contract is needed and how much of one, and which actions
need approval. A task contract is a short agreement written **before**
editing. It states the goal, the observable acceptance criteria, the edit
plan, and the risky actions that need approval. Present it in the
conversation and keep it as short as the change allows.

## Inputs

- The request, as the user stated it.
- Orientation results from the repository:
  - stack and versions;
  - the real build and test commands, from CI files or scripts;
  - the closest analogous feature.
- The areas the change touches, so that risky actions and layers can be
  identified.

## Procedure

1. **Decide the path.** Answer the two questions in order.

   a. *Can observable acceptance criteria be stated, and is every fact the
      change depends on known?* Facts include UX behaviour, permissions, API
      contracts, data fields and business rules. If not, **clarify before any
      edit**, however small the change looks. Then decide again with the
      answers.

   b. *Which of these applies?* Take the first match:

   | Situation | Path |
   |---|---|
   | Any risky action (list in step 4), however small | **Full contract**: every template field, a risk class, and approval of each risky action before it is performed |
   | Several files or more than one layer (as a guide, three or more files) | **Proportional contract**: goal, acceptance criteria, approach and verification plan; add the remaining fields when the risk class is Medium or above |
   | Fully specified, low risk, one place | **No contract and no questions.** Proceed, and name the check that shows it is done in the change summary |

2. **Clarify in one message** when step 1a applies.
   - List every material question together, with the interpretations you
     see and the default you would propose for each, labelled as an
     assumption to confirm.
   - Do not ask what the repository can answer. Find it instead.
   - Never invent UX behaviour, permissions, API contracts, data fields or
     business rules to fill a gap.
   - After the answers, ask again only about what they left open. Do not
     edit files while a material question is open.
3. **Write the contract** in the conversation, using the fields of
   `task-contract-template.md` (or the repository's own format). Write it to
   a file only if the user asks or the repository keeps such documents.
   - In `Approach`, name the analogous feature to follow, list the files per
     layer in edit order (data model and migration, then domain or service,
     then API, then UI, then tests), and name the point after each layer
     where the build must still pass.
4. **Classify the risk.**
   - Risky actions: schema or data migrations, deleting files or data,
     authentication or authorization, breaking public contracts, new
     dependencies or major upgrades, production configuration, anything
     irreversible.
   - Record every match under `Risk and approval gates` (action, target,
     stage), or write `none`.
   - Rate the change on each risk dimension (data loss, security,
     availability, compatibility, reversibility), then assign the highest
     class that applies, with the reason:

     | Class | When | Required before merge or execution |
     |---|---|---|
     | Low | Internal, reversible, no data, security, or contract impact | Build and tests |
     | Medium | Several modules or a deployable boundary. A behaviour change visible to users. A new dependency. | Confirmation of the contract, plus tests at the affected levels |
     | High | Public contract, authentication or authorization, persisted data, production configuration, or an availability risk (downtime, capacity, a new single point of failure) | Explicit approval per risky action, a rollback note, and a staged rollout considered |
     | Critical | Irreversible data loss, security-sensitive data exposure, financial effects | Named approver, a rehearsed rollback or restore, and a staged rollout plan |

   - Unknown blast radius is not Low. Classify it at least Medium, and say
     what would lower it.
5. **Confirm and gate.**
   - Ask the user to confirm the contract when it lists a risky action or an
     assumption that changes the outcome. Otherwise proceed and keep the
     contract visible. `Status` is `PROPOSED` until the user confirms it.
   - Before each risky action, check for an approval of that exact action
     and target, and ask if it is missing. Confirming the task description
     or the contract is never approval of a destructive or
     security-sensitive action, and a generated record is never approval
     evidence.
6. **Re-decide when the scope changes.** When work reveals another layer, a
   new file area, a risky action or a changed criterion, pause before that
   edit. Repeat step 1: start or update the contract, re-confirm it, and get
   approval for any new risky action.

## Outputs

- One of:
  - a grouped clarification request, with no file edited;
  - a proportional or full task contract, `PROPOSED` until confirmed, with
    observable acceptance criteria, an ordered edit plan, every risky action
    listed and a risk class with its reason;
  - a one-line note that no contract is needed, for a fully specified
    low-risk change.
- An explicit approval request for each risky action before it is
  performed.

## Template

Use the repository's format when it has one. Otherwise use the fields of
`task-contract-template.md`. A proportional contract keeps `Status`, `Goal`,
`Acceptance criteria`, `Approach` and `Verification plan`; a full contract
uses every field. `implementation-plan-template.md` and
`risk-assessment-template.md` add an ordered plan and the risk dimensions
when needed. Load only the artifact needed, through the entry skill's
References table.

## Rules

| Section | Rule |
|---|---|
| Acceptance criteria | Observable and testable; each maps to a test or a manual check. "Works correctly" is not a criterion. |
| Assumptions | Every assumption that changes the result is listed and confirmed with the user. |
| Risk and approval gates | Each risky action needs explicit approval of that action and target before it is performed, not only confirmation of the contract. |
| Scope changes | Re-decide with step 1, update the contract and re-confirm. Do not let the scope drift silently. |
| Status | `PROPOSED` until the user confirms the contract. Confirmation never implies approval of an individual risky action. |

## Technology considerations

Stack-neutral. The verification plan uses the repository's own commands
(for example `dotnet test`, `ng test --watch=false`, `npm test`, `pytest`),
as found in CI files or scripts, and never assumed. The edit order follows
the layers the repository actually has. A project without a data layer skips
that step.

## Verification

- An ambiguous request receives one grouped clarification, and no file is
  edited until its acceptance criteria are observable.
- A fully specified low-risk change receives neither questions nor a
  contract.
- For a change that needs one, the contract appears before the first file
  edit, at the depth step 1 chose.
- Every acceptance criterion is observable, and is later mapped to a test or
  check in the change summary.
- The risk class follows the table. An unknown blast radius is never
  classed Low.
- Every risky action has the user's explicit approval recorded before it is
  performed. If approval is missing, the step is reported as not done.
- A scope change during the work is paused and re-decided before the new
  edit.
- The verification plan names commands that exist in the repository, each
  marked as found or inferred.

## Example

A cross-layer feature with no risky action: a proportional contract with
the Medium-risk fields.

```text
Task Contract
Status: PROPOSED
Goal: Users can export their own orders as CSV from the Orders page.
In scope: export endpoint, CSV formatting, download button.
Out of scope: Excel format, admin export of all users' orders.
Acceptance criteria:
| AC-1 | GET /api/orders/export returns text/csv with only the signed-in user's orders |
| AC-2 | Columns are OrderNumber, Date (ISO 8601), Total, Status |
| AC-3 | The button downloads the file using the current list filters |
Assumptions and unknowns: export uses the current list filters (if wrong, the endpoint signature changes).
Approach: follow the existing invoice PDF download (same auth and filter handling); API, then service, then page, then tests.
Risk and approval gates: none.
Risk class: Medium (new endpoint exposing user data; row-level authorization must hold).
Verification plan: dotnet test; ng test --watch=false; new API test for row-level authorization.
```

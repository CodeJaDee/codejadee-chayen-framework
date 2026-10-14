---
kind: recipe
capabilities: [CAP-02-007, CAP-02-010]
---
# Scope, dependencies, and backlog decomposition

Define what is in and out of scope, and the dependencies the work relies on.
Then break an epic or feature into vertical, independently deliverable
backlog items in a sensible order. Sizing and estimation are not part of this
recipe.

## Inputs

- The goal, and the candidate features or epic description.
- Known systems, teams, data sources, decisions, and deadlines.
- An existing backlog format or issue template, if the team has one.

## Procedure

1. **State the goal and success measure** in one or two sentences. If they
   are not given, record them as an assumption to confirm.
2. **Scope.**
   - Sort each candidate item into in scope, out of scope, or undecided.
     Give a one-line rationale for each.
   - Undecided items become open decisions, with an owner.
   - Out-of-scope items are listed explicitly, so that they are not assumed
     later.
3. **Dependencies.** For each in-scope item, identify what it needs:
   - other teams or systems (APIs, data feeds);
   - data or migrations;
   - decisions;
   - environments or access;
   - external parties.

   Record the owner (or "owner unknown"), when it is needed, and the risk if
   it is late. Only list dependencies that a source states or that the item
   evidently requires (label those `inferred`).
4. **Decompose.**
   - Split the in-scope work into vertical slices. Each slice delivers
     user-visible behaviour through every layer it needs.
   - Seams to use: workflow steps, user roles, business rule variants, data
     variants, happy path before exceptions, manual before automated.
   - Avoid layer tickets ("build the API", "build the UI").
5. **Order the slices.**
   - Put first the slice that delivers the smallest end-to-end value, or
     that retires the biggest risk.
   - Then order by dependency.
   - Name the first increment explicitly.
6. **Write each item** with a title, a short description, two or three
   acceptance notes, its dependencies, and the decisions it waits on. Use the
   team's issue format if one exists.
7. **Record** the scope, dependencies, and decisions in the requirements
   record.

## Outputs

- In-scope, out-of-scope, and undecided lists, with the rationale.
- A dependency register:

  ```text
  | Dependency | Needed by (item) | Owner | Needed when | Risk if late | Label |
  ```

- An ordered backlog of vertical items with acceptance notes and
  dependencies, and the suggested first increment.
- Open decisions that block items.

## Technology considerations

Stack-neutral. Repository evidence can refine dependencies, but this recipe
does not inspect code by default:

- **Existing integrations** (HTTP clients, message consumers) show external
  system dependencies. Cite them when used.
- **Schema changes** in an item are flagged as a data dependency. The
  migration itself is approval-gated later in implementation.
- **Shared libraries or packages** across a monorepo create cross-team
  dependencies. Use the repository skill's dependency map if one exists.

## Verification

- Every in-scope item traces to the goal. Every undecided item has an owner
  or "owner unknown".
- Every external system named in the sources appears in the dependency
  register.
- Each backlog item is a vertical slice with user-visible behaviour (rubric:
  could it be demonstrated to a user on its own?).
- The first increment is identified.
- No item carries an estimate or a priority that the team has not given.

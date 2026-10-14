---
kind: recipe
capabilities: [CAP-02-007, CAP-02-010, CAP-04-004]
---
# Scope, dependencies, backlog decomposition, and sizing

Define what is in and out of scope, and the dependencies the work relies on.
Then break an epic or feature into vertical, independently deliverable
backlog items in a sensible order. Size the items with explicit drivers and
uncertainty, so that a size is never presented as a commitment or a schedule.

## Inputs

- The goal, and the candidate features or epic description.
- Known systems, teams, data sources, decisions, and deadlines.
- An existing backlog format or issue template, if the team has one.
- **For sizing:** the team's scale (story points, t-shirt sizes, or time
  ranges) and reference items it has already sized, if any.

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
7. **Size the items,** when asked.
   - Use the team's scale. Without one, use t-shirt sizes (XS–XL) and say
     so.
   - Compare each item with the team's reference items when they exist.
   - For each size, state:
     - the **drivers**: the number of layers touched, new integrations,
       data migration, unknowns, test effort, and similarity to past work;
     - the **assumptions**;
     - a **confidence** (high, medium, or low).
   - An item with an unresolved unknown that could change its size by more
     than one step gets **no size**. It gets a proposed spike, with the
     question the spike answers.
   - Time ranges, when requested, are ranges (for example 3–5 days) with
     their assumptions. They are never single numbers, and never dates or
     commitments.
8. **Record** the scope, dependencies, sizes, and decisions in the
   requirements record. Sizes are proposals until the team accepts them.

## Outputs

- In-scope, out-of-scope, and undecided lists, with the rationale.
- A dependency register:

  ```text
  | Dependency | Needed by (item) | Owner | Needed when | Risk if late | Label |
  ```

- An ordered backlog of vertical items with acceptance notes and
  dependencies, and the suggested first increment.
- Open decisions that block items.
- When sized: a size per item, with its drivers, assumptions, and
  confidence. Spikes are listed for the items that cannot be sized yet, all
  labelled proposed.

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
- No item carries a priority that the team has not given. Sizes appear only
  when sizing was requested, and are labelled proposed.
- Every size states its drivers, assumptions, and confidence. No item with a
  size-changing unknown is sized: it gets a spike instead.
- No size is expressed as a date, a deadline, or a commitment.

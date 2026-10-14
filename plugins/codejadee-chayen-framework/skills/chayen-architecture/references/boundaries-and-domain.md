---
kind: recipe
capabilities: [CAP-03-004, CAP-03-005, CAP-03-006]
---
# Boundaries, domain model, and components

Define system and module boundaries, model the business domain within them,
and design the internal components. All three are kept consistent with each
other and with the existing code. Each entity has one owner, each invariant
has one enforcing place, and each component has allowed dependencies.

## Inputs

- Business capabilities, vocabulary, rules, and invariants. Use the
  requirements record if one exists.
- The existing systems, modules, data stores, and team structure, from the
  repository or a description.
- The accepted decisions about boundaries, for example "one database per
  service".

## Procedure

1. **Map the current state from evidence.**
   - List the modules and deployables, their data stores, and who writes
     which tables.
   - Point out shared tables and cyclic references.
   - Label each finding `found` or `inferred`.
2. **Find the candidate boundaries.**
   - Group capabilities that change together and share language and data.
   - Split where the vocabulary changes meaning ("Order" in sales versus
     fulfilment), where data ownership differs, or where change cadence or
     team ownership differs.
3. **Assign data ownership.**
   - Every entity gets exactly one owning boundary, its system of record.
   - Other boundaries read it through a contract (API, event, or read
     model), not by writing its tables.
4. **Define the interfaces between boundaries.**
   - Give each interaction a name, a style (synchronous call, event, or
     shared read model), and a direction.
   - Note the consistency each one needs: immediate or eventual.
5. **Model the domain inside each boundary.**
   - Entities, value objects, and aggregates.
   - The invariants, each enforced by one aggregate.
   - A glossary of terms.
   - Keep the model storage-independent, and hand persistence design to
     data modeling.
6. **Design the components** within a deployable.
   - Give each one a responsibility, a public interface, and its allowed
     dependencies.
   - Follow the existing style and naming (architecture styles checklist).
     Do not introduce new layers or patterns unless a stated goal needs
     them.
7. **Turn the dependency rules into fitness tests** (architecture review
   recipe), if the user wants them enforced.
8. **Mark everything proposed.** Moving an existing boundary is a migration.
   Plan it with the migration strategy recipe.

## Outputs

- A context map or boundary diagram (Mermaid). It shows each boundary's
  responsibilities, owned data, and interfaces, and the consistency needs of
  each interaction.
- A domain model per boundary (class or Mermaid diagram), with aggregates,
  invariants, and a glossary.
- A component table: component, responsibility, public interface, allowed
  dependencies. Plus a component diagram.
- The current-state findings that motivated changes: shared tables and
  cycles, with evidence. Status: proposed.

## Technology considerations

| Stack | Consideration |
|---|---|
| .NET | Boundaries map to projects, or to folders with `internal` types. Aggregates map to entities with private setters and methods enforcing invariants. Per-module `DbContext` and schema enforce data ownership. |
| TypeScript / Node (Nitro, Elysia, Next.js, Nuxt server) | Boundaries map to packages in a workspace, or to folders with index-only exports. Enforce them with dependency-cruiser or ESLint restricted paths. |
| Angular / React / Vue | UI boundaries mirror domain boundaries as feature libraries or folders. Shared UI goes in a separate library. Avoid cross-feature imports. |
| Python | Packages per boundary. Enforce the rules with import-linter. In Django, use apps per boundary, and avoid cross-app model writes. |
| SQL Server / PostgreSQL | A schema per boundary makes ownership visible. Cross-boundary foreign keys couple deployables, so flag them. |

## Verification

- Every entity named in the sources has exactly one owning boundary.
- Every cross-boundary interaction appears as a named interface with a
  consistency need.
- Every stated business invariant is enforced by exactly one aggregate.
- The components follow the existing layer and naming conventions. Any new
  pattern is justified by a named goal.
- Current-state claims cite evidence. The design is labelled proposed.

---
kind: recipe
capabilities: [CAP-04-005]
---
# Migration planning

Plan a migration between platforms, frameworks, data stores, or systems as a
sequence of reversible phases. Each phase has entry and exit criteria, a way
for the old and new to coexist, a rollback point, and the approvals it needs.
The plan is a proposal until its owner approves it.

## Inputs

- The source and target: platform, framework, data store, or system, with
  versions, taken from the repository.
- Constraints:
  - downtime tolerance;
  - deadlines;
  - support end dates (cite the vendor documentation, or label them
    `unknown`);
  - team capacity;
  - compliance.
- The accepted decisions that the migration must respect, or that it would
  supersede.
- The inventory of what moves: code, data, integrations, configuration, and
  consumers.

## Procedure

1. **Inventory what is affected, from evidence.**
   - Projects, APIs, data stores, integrations, and consumers.
   - Use the repository's dependency and impact analysis where available.
   - Consumers that are not documented are `unknown`. List them as a risk.
2. **Choose the migration approach**, with trade-offs. Option 0 is staying
   on the current platform, with its cost.
   - **In-place upgrade:** version by version, for frameworks.
   - **Side-by-side with traffic routing:** the strangler approach.
   - **Parallel run with comparison.**
   - **Big-bang cut-over:** only when coexistence is impossible. Say why,
     and plan a rehearsal.
3. **Cut the work into phases.** Each phase delivers a working system and has:
   - entry criteria;
   - the work;
   - exit criteria, which are measurable (tests green, error rate,
     reconciliation counts);
   - a rollback point;
   - the owner's approval for risky steps.
4. **Design the coexistence:**
   - how old and new run together (routing, feature flags, dual writes or
     change data capture for data);
   - which side is the system of record in each phase;
   - how consistency is checked.
5. **Plan the data migration** steps as expand, migrate, then contract, with
   a reconciliation query and a restore point per step. Destructive steps
   (dropping old columns or tables, decommissioning) come last, each needing
   explicit approval.
6. **List the risks and dependencies,** each with a mitigation: unknown
   consumers, unsupported libraries, behaviour changes in the target, team
   skills, and freeze windows.
7. **Label the plan proposed.** Record the open decisions with their owners.
   The phases are not started by this recipe. Implementation follows per
   phase, after approval.

## Outputs

The migration plan, written for the owner's approval, plus the inventory and
the risks behind it.

```text
Migration plan — <source> → <target> — status: proposed (approver: <role>)
Approach: <chosen> — alternatives: <option 0 stay; others> — trade-offs: <...>
| Phase | Entry criteria | Work | Exit criteria (measurable) | Coexistence | Rollback point | Approval needed |
Data steps: expand → migrate → contract, with reconciliation per step
Risks and dependencies: <risk> — mitigation — owner
Open decisions: <question> — owner
```

## Technology considerations

| Stack | Consideration |
|---|---|
| .NET Framework → .NET | Use the .NET Upgrade Assistant for analysis. Check library compatibility (`System.Web`, WCF server, WebForms have no direct port). Side-by-side via YARP reverse proxy for incremental migration. |
| Angular | Upgrade one major version at a time with `ng update` and the official update guide. AngularJS to Angular needs a hybrid (`ngUpgrade`) or a strangler approach. |
| React / Next.js / Vue / Nuxt | Router and rendering-model changes (Pages to App Router, Vue 2 to 3, Nuxt 2 to 3) are migrations. Plan them per route or page, with coexistence where the framework allows it. |
| Python | Python version upgrades. Django upgrades one feature release at a time, with deprecation warnings enabled. |
| SQL Server ↔ PostgreSQL | Data-type and collation differences, identity and sequence semantics, case sensitivity, and stored-procedure rewrites. Use change data capture or dual-write for coexistence, and reconcile counts and checksums. |

## Verification

- Every phase has measurable exit criteria and a rollback point.
- Destructive steps are last, and each one requires explicit approval.
- Option 0 (stay) and at least one alternative approach are compared, with
  their trade-offs.
- Undocumented consumers appear as `unknown` risks, never as "none".
- The plan is labelled proposed, with an approver role. Nothing is marked
  approved without a named approver.

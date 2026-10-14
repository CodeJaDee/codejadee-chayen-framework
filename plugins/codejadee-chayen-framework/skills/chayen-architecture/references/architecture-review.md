---
kind: recipe
capabilities: [CAP-03-001, CAP-03-008]
---
# Architecture review and fitness tests

Review an existing or proposed architecture against its quality goals and its
accepted decisions. Find risks, coupling, single points of failure, and
mismatches with requirements. Where a rule can be checked mechanically,
express it as a fitness test that runs in the test suite or CI.

## Inputs

- The system: a repository on disk, an architecture description, or
  diagrams.
- The quality goals and constraints, ranked if possible. If they are not
  given, ask once, or review under stated assumptions.
- The accepted decisions: ADRs, a decision register, and instruction files.
- **For fitness tests:** the rule to protect, and the test framework the
  repository already uses.

## Procedure

1. **Fix the review scope and goals.** List the quality goals being judged,
   for example "availability first, then cost". Unranked goals are an
   assumption, stated up front.
2. **Collect evidence.**
   - Use the solution and project references, the deployables, the data
     stores and who accesses them, the integration points, the
     configuration, and the deployment descriptors.
   - Name the current style from the architecture styles checklist.
   - Cite each fact with `path:line`, or label it `inferred`.
3. **Check against the accepted decisions.** For each accepted ADR, check
   that the code still follows it. Report drift as a finding that cites the
   ADR's ID.
4. **Look for risks** with these lenses:

   | Lens | Typical evidence |
   |---|---|
   | Coupling | Shared database between deployables; cyclic project references; a "Common" project referenced everywhere |
   | Layering | Domain referencing infrastructure; UI calling data access directly |
   | Single points of failure | One instance, one queue, or one external dependency without a fallback |
   | Data ownership | Two services writing the same table; no clear system of record |
   | Integration | Synchronous call chains longer than about 3 hops; no timeouts |
   | Scalability | In-memory state in web instances; unbounded queries; chatty clients |
   | Operability | No health checks, no correlation IDs, configuration hard-coded per environment |
   | Requirements fit | A structure that does not serve the stated goals, for example per-request synchronous calls for an availability-first goal |

5. **Rate each finding** by risk (impact × likelihood under the stated
   goals). Give a recommendation, and at least one alternative.
   Recommendations that contradict an accepted ADR are framed as a proposed
   superseding ADR.
6. **Turn the mechanical rules into fitness tests.** When the user wants
   enforcement, or a finding is about layering or dependencies:
   1. Write a test in the existing test project with the library the
      repository uses, or the stack default if none is in use. Ask before
      adding a package.
   2. Assert the rule. Examples: "Domain does not reference
      Infrastructure", "no cycles between modules", "only `*.Contracts`
      is referenced across modules".
   3. Run it. Show it failing on a known violation (if one exists) and
      passing otherwise. Report the commands and results.
7. **List the open questions** that need an owner's answer.

## Outputs

A review report labelled proposed, with the evidence for the current style, each accepted decision checked, ranked findings with alternatives, open questions, and any fitness tests added.

```text
Architecture review — scope: <system> — goals: <ranked goals> — status: proposed
Current style: <style> (evidence: <paths>)
Accepted decisions checked: ADR-<n> <title> — followed | drift (<evidence>)
Findings:
| # | Risk | Lens | Evidence | Impact × likelihood | Recommendation | Alternative |
Open questions: <question> — owner: <role | owner unknown>
Fitness tests (if added): <test file> — rule — `<command>` → PASS | FAIL | NOT_RUN
```

## Technology considerations

| Stack | Fitness test tooling and consideration |
|---|---|
| .NET | NetArchTest.Rules or ArchUnitNET in an xUnit, NUnit, or MSTest project. Project references in `*.csproj` give a coarse rule for free. `InternalsVisibleTo` can hide coupling. |
| TypeScript / JavaScript / Angular / React / Vue | dependency-cruiser (rules in `.dependency-cruiser.js`), ESLint `import/no-restricted-paths` or `no-restricted-imports`, and Nx `enforce-module-boundaries` with tags when Nx is used |
| Python | import-linter contracts (layers, forbidden, independence) in `pyproject.toml` or `.importlinter`, run in CI |
| SQL Server / PostgreSQL | Cross-service table access is visible in connection strings and ORM mappings. Schema-per-module can be checked with a test that queries the catalog. |

## Verification

- Every finding cites evidence, and every recommendation has an alternative
  and a stated cost.
- Every accepted ADR in scope is listed as followed or drift. None is
  contradicted silently.
- The review is labelled proposed until the owner accepts the findings.
- Fitness tests compile and run. The failing-then-passing behaviour on a
  seeded or known violation is shown, or marked NOT_RUN with the reason.
  No package was added without approval.

# Composite engineering workflow coverage

STEP 29 implements static, native-agent-invoked instructions. The existing
entry skill must match first; the selected composite then reuses existing
capability recipes, with technology references selected per affected owner.
No matching workflow means normal native behavior. Small low-risk tasks use
the direct recipe and relevant checks without formal workflow artifacts.

The source of truth is [composite-workflows.json](../../catalog/composite-workflows.json).
Recipes retain their 206 engineering capability identities and the 108
technology records remain unchanged. No workflow server, scheduler, runtime
engine, new entry skill or dependency is introduced. D-045 records the layout.

## Coverage

<!-- BEGIN GENERATED: check-workflows -->
| Workflow | Owner | Packaged reference | Reused capabilities | Cases +/− | Status |
|---|---|---|---|---|---|
| WF-01 New feature development | chayen-implementation | [workflow-new-feature.md](../../plugins/codejadee-chayen-framework/skills/chayen-implementation/references/workflow-new-feature.md) | CAP-04-001, CAP-05-001, CAP-06-002, CAP-07-001, CAP-10-007, CAP-04-007 | 2/1 | IMPLEMENTED |
| WF-02 Bug diagnosis and repair | chayen-implementation | [workflow-bug-repair.md](../../plugins/codejadee-chayen-framework/skills/chayen-implementation/references/workflow-bug-repair.md) | CAP-05-002, CAP-01-004, CAP-10-014, CAP-10-007, CAP-04-007 | 2/1 | IMPLEMENTED |
| WF-03 Refactoring | chayen-implementation | [workflow-refactoring.md](../../plugins/codejadee-chayen-framework/skills/chayen-implementation/references/workflow-refactoring.md) | CAP-05-003, CAP-15-002, CAP-10-007, CAP-04-007 | 2/1 | IMPLEMENTED |
| WF-04 API development and integration | chayen-backend | [workflow-api-integration.md](../../plugins/codejadee-chayen-framework/skills/chayen-backend/references/workflow-api-integration.md) | CAP-06-001, CAP-06-002, CAP-06-003, CAP-06-009, CAP-06-010, CAP-10-005 | 1/2 | IMPLEMENTED |
| WF-05 Database schema migration | chayen-data | [workflow-schema-migration.md](../../plugins/codejadee-chayen-framework/skills/chayen-data/references/workflow-schema-migration.md) | CAP-09-002, CAP-09-007, CAP-09-008, CAP-09-006, CAP-09-012 | 2/1 | IMPLEMENTED |
| WF-06 Software testing and regression | chayen-testing | [workflow-testing-regression.md](../../plugins/codejadee-chayen-framework/skills/chayen-testing/references/workflow-testing-regression.md) | CAP-10-001, CAP-10-007, CAP-10-014, CAP-10-013, CAP-10-005 | 2/1 | IMPLEMENTED |
| WF-07 Security review and remediation | chayen-security | [workflow-security-review.md](../../plugins/codejadee-chayen-framework/skills/chayen-security/references/workflow-security-review.md) | CAP-11-002, CAP-11-003, CAP-11-014, CAP-11-006, CAP-10-007 | 2/1 | IMPLEMENTED |
| WF-08 Performance investigation | chayen-performance | [workflow-performance-investigation.md](../../plugins/codejadee-chayen-framework/skills/chayen-performance/references/workflow-performance-investigation.md) | CAP-12-001, CAP-12-002, CAP-12-005, CAP-12-003, CAP-09-003 | 2/1 | IMPLEMENTED |
| WF-09 Dependency/framework upgrade | chayen-implementation | [workflow-dependency-upgrade.md](../../plugins/codejadee-chayen-framework/skills/chayen-implementation/references/workflow-dependency-upgrade.md) | CAP-05-008, CAP-15-004, CAP-15-005, CAP-10-007, CAP-13-007 | 2/1 | IMPLEMENTED |
| WF-10 Production incident investigation | chayen-devops | [workflow-incident-investigation.md](../../plugins/codejadee-chayen-framework/skills/chayen-devops/references/workflow-incident-investigation.md) | CAP-14-006, CAP-14-007, CAP-14-008, CAP-15-009, CAP-14-010 | 2/1 | IMPLEMENTED |
| WF-11 Pull request preparation and review | chayen-documentation | [workflow-pull-request.md](../../plugins/codejadee-chayen-framework/skills/chayen-documentation/references/workflow-pull-request.md) | CAP-16-005, CAP-16-006, CAP-16-007, CAP-18-001, CAP-18-003 | 2/1 | IMPLEMENTED |
| WF-12 Release readiness assessment | chayen-devops | [workflow-release-readiness.md](../../plugins/codejadee-chayen-framework/skills/chayen-devops/references/workflow-release-readiness.md) | CAP-18-008, CAP-13-009, CAP-13-012, CAP-13-010, CAP-13-011, CAP-16-009 | 2/1 | IMPLEMENTED |

| Template | Owner | Packaged format | Existing artifact capability |
|---|---|---|---|
| Task Contract | chayen-implementation | [task-contract-template.md](../../plugins/codejadee-chayen-framework/skills/chayen-implementation/references/task-contract-template.md) | CAP-04-001 |
| Implementation Plan | chayen-implementation | [implementation-plan-template.md](../../plugins/codejadee-chayen-framework/skills/chayen-implementation/references/implementation-plan-template.md) | CAP-04-002 |
| Risk Assessment | chayen-implementation | [risk-assessment-template.md](../../plugins/codejadee-chayen-framework/skills/chayen-implementation/references/risk-assessment-template.md) | CAP-04-003 |
| Verification Report | chayen-implementation | [verification-report-template.md](../../plugins/codejadee-chayen-framework/skills/chayen-implementation/references/verification-report-template.md) | CAP-18-003 |
| Change Passport | chayen-implementation | [change-passport-template.md](../../plugins/codejadee-chayen-framework/skills/chayen-implementation/references/change-passport-template.md) | CAP-18-002 |
| Context Capsule / Agent Handoff | chayen-ai-engineering | [context-capsule-template.md](../../plugins/codejadee-chayen-framework/skills/chayen-ai-engineering/references/context-capsule-template.md) | CAP-20-007 |
| Architecture Decision Record | chayen-architecture | [architecture-decision-record-template.md](../../plugins/codejadee-chayen-framework/skills/chayen-architecture/references/architecture-decision-record-template.md) | CAP-03-003 |

Totals: 12 IMPLEMENTED workflows; 7 templates; 47 evaluation specifications; 0 VERIFIED workflows. Agent/provider evaluations NOT_RUN.
<!-- END GENERATED: check-workflows -->

## Native composition and approvals

Workflows are owner-local `kind: checklist` references. Templates are
`kind: template` leaves, also owner-local. All are reached directly from
their existing SKILL.md References tables. Cross-skill stages name the
appropriate skill and recipe for native handoff; they neither link across
skill directories nor assume invocation, delegation or runtime enforcement.
The developer catalog and validators are never loaded by plugin consumers.

The repository's artifact format takes precedence. Otherwise, reusable Task
Contract, Implementation Plan, Risk Assessment, Verification Report and Change
Passport formats live in implementation, Context Capsule in AI-engineering,
and ADR in architecture. Output stays in the conversation unless files are
requested or established by the repository. Templates are chosen only when
the corresponding artifact is needed, not loaded as one mandatory bundle.

Approvals start NOT_PROVIDED. Only an actual authorized instruction/process
record for the exact action, scope and target can support an approval claim.
An accepted plan/ADR, generated record, test pass, tool permission or GO
recommendation never supplies missing business/release authorization. Existing
valid action-specific approval is reused within its scope. Pending approval
blocks only dependent risky actions; independent authorized work can continue.

## Verification and evaluation

[STEP 29 validation evidence](../../tests/workflows/results/step29-validation.md)
records executed commands, six passing gate groups, 132/132 validator tests,
acknowledged size warnings and the separate NOT_RUN behavior/runtime checks.

```text
node tools/catalog/check-workflows.mjs --write-doc
node tools/catalog/check-workflows.mjs
node tools/validate/validate-all.mjs
```

V-24 checks inventory, real implemented recipe mappings, conditional pack
identities, packaged instructions and template reachability, ordered substantive
stages/exit checks, evidence/approval defaults, positive/negative/no-match
specifications and table synchronization. Mutation tests verify the checker
rejects deliberately broken mappings, missing controls and stale coverage.
These are static checks, not model behavior, approval or framework execution.

[workflow-cases.json](../../tests/skills/workflow-cases.json) contains 47
evaluation specifications: 12 positive, 12 negative, 12 boundary cases, four
native/no-workflow cases and seven template-evidence cases. Boundary cases
cover partial completion, low-risk scope, mixed-stack owners, unsupported
Java, untrusted approval claims, review-only auth, unavailable browsers,
unmeasured performance, valid prior approval, incident read-only access,
local PR drafts and missing mandatory release evidence.

To execute behavior evaluations, supply each case's repository context and
ordinary prompt to a provider using its native installed skills, capture the
selected skill/references, actions and final artifacts, and grade every check
against the transcript. Compare no-plugin/native behavior for no-match and
small tasks; preserve provider/version and fixture evidence with results.
Do not run real production actions to grade an approval refusal; use supplied
logs or disposable fixtures. Live provider/agent evaluations are NOT_RUN in
STEP 29, and no workflow or capability is promoted to VERIFIED by V-24.

DONE, PARTIAL and BLOCKED describe the actual requested outcome. Verification
rows separately use PASS, FAIL, NOT_RUN and justified N/A. A missing required
check cannot be hidden as N/A or a successful partial suite. Context Capsules
retain completed work, blockers, evidence and the original approval scope;
receivers revalidate stale facts instead of treating a handoff as authority.

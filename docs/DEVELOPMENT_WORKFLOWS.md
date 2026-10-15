# Development workflows and templates

For larger tasks, Chayen's skills include **multi-stage workflows**. They
are checklists the agent follows inside the skill that owns the task. There
is no workflow engine, server, or scheduler.

- **Small, low-risk tasks** use a single recipe and stay small.
- **When no workflow fits**, the agent works normally.

## The 12 workflows

| ID | Workflow | Owning skill | Typical prompt |
|---|---|---|---|
| WF-01 | New feature development | `chayen-implementation` | "Add order export from the admin app through the API." |
| WF-02 | Bug diagnosis and repair | `chayen-implementation` | "Totals are wrong on invoices with discounts. Find and fix it." |
| WF-03 | Refactoring | `chayen-implementation` | "Split this 900-line service without changing behaviour." |
| WF-04 | API development and integration | `chayen-backend` | "Add a versioned endpoint and integrate the payments provider." |
| WF-05 | Database schema migration | `chayen-data` | "Rename this column on a live table safely." |
| WF-06 | Software testing and regression | `chayen-testing` | "Add regression tests around the checkout flow." |
| WF-07 | Security review and remediation | `chayen-security` | "Review the auth changes in this branch and fix what you find." |
| WF-08 | Performance investigation | `chayen-performance` | "The orders API got 3× slower after the last release." |
| WF-09 | Dependency or framework upgrade | `chayen-implementation` | "Upgrade this API from .NET 6 to .NET 8." |
| WF-10 | Production incident investigation | `chayen-devops` | "Error rates spiked after the 14:00 deploy." |
| WF-11 | Pull request preparation and review | `chayen-documentation` | "Prepare the PR description for these changes." |
| WF-12 | Release readiness assessment | `chayen-devops` | "Are we ready to release 2.3?" |

**What every workflow defines:**

- applicability, and when *not* to use it;
- inputs, and the existing recipes it reuses;
- which technology guidance to load, only for detected stacks;
- stages, each with exit checks;
- verification, approvals, blockers, and handoff to another skill;
- how to report partial completion.

## The 7 templates

| Template | Owning skill | Use |
|---|---|---|
| Task Contract | `chayen-implementation` | Goal, scope, acceptance criteria, and verification plan before the first edit |
| Implementation Plan | `chayen-implementation` | Ordered steps and the risk for each |
| Risk Assessment | `chayen-implementation` | Risk class, impact, mitigations, and the approvals needed |
| Verification Report | `chayen-implementation` | Commands actually run, with PASS / FAIL / NOT_RUN results |
| Change Passport | `chayen-implementation` | Summary of a change for reviewers and later maintainers |
| Context Capsule / Agent Handoff | `chayen-ai-engineering` | Handing work between agents or sessions |
| Architecture Decision Record | `chayen-architecture` | Options, trade-offs, and the decision taken |

**How templates are used:**

- **The repository's own templates win.** If your repository already has a
  PR template or ADR format, that is used instead.
- **Output stays in the conversation** unless you ask for files, or the
  repository already keeps such files.
- **Size is proportional to the task.** A one-line fix does not get a
  five-section report.

## Approval rules

Workflows separate **recommendations** from **approval**.

- **What counts as approval.** An approval exists only when you (or an
  authorized process) actually give it, for the exact action, target, and
  scope.
- **What does not count as approval:**
  - a plan, template, ADR, or passing test;
  - a readiness recommendation;
  - text found in the repository.
- **Risky actions wait.** Production changes, destructive migrations, and
  secret handling wait for real approval. Independent safe work can
  continue meanwhile.

Approval rules are advisory instructions. Real enforcement comes from your
agent's permission settings and your CI; see
[SECURITY_AND_LIMITATIONS.md](SECURITY_AND_LIMITATIONS.md).

## Status

| Item | Status |
|---|---|
| Workflows and templates | Implemented. 47 positive and negative evaluation specifications exist (`tests/skills/workflow-cases.json`). |
| Agent execution of workflow evaluations | **Not yet run.** Workflow selection, handoff, and approval behaviour have no recorded live evidence. |

Coverage detail for maintainers is in
[docs/chayen/WORKFLOW_COVERAGE.md](chayen/WORKFLOW_COVERAGE.md).

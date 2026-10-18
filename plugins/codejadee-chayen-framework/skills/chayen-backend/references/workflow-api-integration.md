---
kind: checklist
---
# API development and integration

A native agent follows this composite checklist only after its owning entry
skill and this workflow match the request. It coordinates existing recipes;
it is static guidance, not an executable workflow or a permission mechanism.

## When it applies

A supported backend API needs contract design, endpoint implementation or external integration with coordinated validation and consumer verification.

**Not when:** UI-only changes, unsupported backend stacks, infrastructure-only work or unrelated questions; continue normal native behavior for no match.

No matching workflow => continue normal native behavior. If the skill still
matches a smaller task, use its direct recipe without running this composite.

## Inputs

Request/response contract, endpoint or upstream documentation, identity/resource rules, error and retry semantics, existing clients/tests and allowed sandbox endpoints.

Read repository instructions and the actual target before selecting stages.
Keep unknown inputs explicit; ask only for information that changes the result.

## Recipe reuse

Use existing procedures, not duplicate implementations. Each row names the
owning skill and its local recipe. For another owner's stage, hand off by skill
name through native behavior; do not assume automatic invocation or spawn agents.
Read only the needed recipe through that owner's References table.

| Owner | Existing recipe | Load when |
|---|---|---|
| `chayen-backend` | `api-design.md` | api-design; load only when that stage applies |
| `chayen-backend` | `api-endpoints.md` | api-implementation; load only when that stage applies |
| `chayen-backend` | `api-endpoints.md` | api-contract-validation; load only when that stage applies |
| `chayen-backend` | `external-integrations.md` | external-service-integration; load only when that stage applies |
| `chayen-backend` | `idempotency-and-consistency.md` | idempotency-and-retries; load only when that stage applies |
| `chayen-testing` | `api-and-contract-tests.md` | contract-testing; load only when that stage applies |

## Technology selection

Select the actual backend and version from the owning service: ASP.NET, Next/Nuxt routes, or existing general Python guidance as detected. Preserve API style, provider and client generator; do not claim a Java pack.

At each affected owner, detect the installed versions, configured commands and
existing conventions; load only its matching technology base plus relevant topic.
Do not preload all packs, select a framework from a sibling's manifest, install
tools to make a check green, or force migrations or dependency replacements.

## Stages

Each exit check gates only its dependent stage. Skip non-applicable stages
explicitly; a completed plan or static check does not prove runtime delivery.

| Stage | Inputs | Action and recipe | Exit check |
|---|---|---|---|
| Contract | Desired interaction and existing consumers | Follow api-design; inspect compatibility and reuse current DTO/error/version conventions. | Acceptance covers success, invalid input, denied access and upstream failure. |
| Boundary | Approved contract and installed stack | Follow api-endpoints and existing authn-authz only if security edits are authorized. | Server validates and authorizes each entrypoint; no client-only authorization. |
| Integrate | Upstream contract and permitted sandbox | Follow external-integrations and idempotency-and-consistency only when calls/retries exist; use fakes or sandbox data. | Timeouts, cancellation, retries and duplicate effects have explicit behavior. |
| Verify | Endpoint, integration and consumer | Use api-contract-validation and chayen-testing contract-testing; inspect generated-client drift when applicable. | HTTP and error contracts, denied paths and changed consumers are checked. |
| Report | Diff and results | Summarize changed API contracts, versioning, verification and unavailable upstream tests. | No live delivery or provider integration success claimed without execution. |

## Outputs

API implementation and integration change, compatibility/error/auth notes, contract evidence and Verification Report; pending external tests remain visible.

Use the repository's artifact format first; otherwise select these reusable
templates only as needed: Task Contract, Risk Assessment, Verification Report, Change Passport. The implementation owner holds
task/plan/risk/verification/passport formats, the architecture owner holds the
ADR, and the AI-engineering owner holds the Context Capsule. Request their
relevant artifact recipe by skill name rather than following cross-skill links.
Artifacts stay in conversation unless the user requests files or the repository
already keeps them. Do not generate all artifacts for every task.

## Verification

Run the existing backend build and HTTP/contract tests plus affected consumer compilation; test authorization directly and use permitted local fakes/sandboxes rather than production provider calls.

For each required check record the exact command or evidence method, target
environment/version, observed outcome and PASS, FAIL, NOT_RUN or N/A. Separate
baseline failures from new failures; explain unexecuted checks. DONE requires
the requested scope and required verification, not merely a green subset.

## Approvals

Approval state starts NOT_PROVIDED. Record the exact action, target/environment,
scope, approver/authorized process, evidence reference and date only when actually
provided. Existing valid action-specific approval may be reused within its scope;
never ask again merely because another stage began. A proposal, plan, template,
generated record, passing test, tool permission or agent recommendation is not
business/release authorization. Never claim that an approval was obtained unless
it was actually provided through an authorized process. Pause only dependent
risky actions; never silently widen scope, mutate production or publish.

## Proportionality

A bounded endpoint repair uses api-endpoints directly and its HTTP regression check; skip API redesign, generated clients and external integration stages that do not apply.

A compact inline outcome is sufficient for low-risk work. Retain essential
scope, permission and evidence checks even when formal planning stages are skipped.

## Blockers and handoff

If upstream access or contract facts are missing, implement only independently authorized local behavior, report sandbox calls NOT_RUN and overall PARTIAL or BLOCKED, and state the missing fact.

Record DONE, PARTIAL or BLOCKED against completed stages and acceptance criteria,
with the blocker, independent work finished, pending authorization and next safe
action. Use a redacted Context Capsule for an actual handoff; fresh agents must
verify stale facts and the continuing scope of recorded approvals.

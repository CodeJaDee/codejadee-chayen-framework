---
kind: checklist
---
# Release readiness assessment

A native agent follows this composite checklist only after its owning entry
skill and this workflow match the request. It coordinates existing recipes;
it is static guidance, not an executable workflow or a permission mechanism.

## When it applies

An explicit pre-release assessment needs artifact, compatibility, security, migration, rollback and operational evidence to support a release-owner decision.

**Not when:** Publishing or deploying by implication, unrelated changes, or an automatic authorization request; continue normal native behavior for no match.

No matching workflow => continue normal native behavior. If the skill still
matches a smaller task, use its direct recipe without running this composite.

## Inputs

Release scope and artifact/version, acceptance/risk criteria, actual build/test/scan results, migration/config changes, environment, rollback procedure and authorized decision owner.

Read repository instructions and the actual target before selecting stages.
Keep unknown inputs explicit; ask only for information that changes the result.

## Recipe reuse

Use existing procedures, not duplicate implementations. Each row names the
owning skill and its local recipe. For another owner's stage, hand off by skill
name through native behavior; do not assume automatic invocation or spawn agents.
Read only the needed recipe through that owner's References table.

| Owner | Existing recipe | Load when |
|---|---|---|
| `chayen-devops` | `release-and-rollout.md` | release-go-no-go; load only when that stage applies |
| `chayen-devops` | `releases-and-provenance.md` | release-packaging; load only when that stage applies |
| `chayen-devops` | `releases-and-provenance.md` | artifact-provenance; load only when that stage applies |
| `chayen-devops` | `release-and-rollout.md` | deployment-validation; load only when that stage applies |
| `chayen-devops` | `release-and-rollout.md` | rollback-verification; load only when that stage applies |
| `chayen-documentation` | `release-notes.md` | release-notes; load only when that stage applies |

## Technology selection

Inspect only technologies shipped by this release and their real runtime/provider/adapter versions. Verify actual production artifacts and cross-stack contracts where relevant; do not infer deployability from local development success.

At each affected owner, detect the installed versions, configured commands and
existing conventions; load only its matching technology base plus relevant topic.
Do not preload all packs, select a framework from a sibling's manifest, install
tools to make a check green, or force migrations or dependency replacements.

## Stages

Each exit check gates only its dependent stage. Skip non-applicable stages
explicitly; a completed plan or static check does not prove runtime delivery.

| Stage | Inputs | Action and recipe | Exit check |
|---|---|---|---|
| Inventory | Release scope and criteria | Follow releases-and-provenance to identify immutable artifact, provenance and version mapping. | Scope and artifact identity are known; missing evidence is listed. |
| Assess | Acceptance, scans and compatibility | Follow release-and-rollout go/no-go procedure; check affected test levels, schema compatibility, config and residual findings. | No omitted critical risk or fabricated scan/behavior result. |
| Rehearse | Rollback/restore plan and permitted environment | Use rollback-verification only in an authorized environment; request needed action-specific approval before mutation. | Rollback feasibility, restore limitations and unrun drills are explicit. |
| Recommend | Evidence and unresolved gates | Provide GO_RECOMMENDED, NO_GO or INSUFFICIENT_EVIDENCE as a recommendation only; unknown mandatory checks cannot yield a positive recommendation. | Approval state remains NOT_PROVIDED unless an authorized decision was actually recorded. |
| Handoff | Recommendation and owner record | Use release-notes via chayen-documentation when requested and deliver verification/passport or capsule. | No publish, tag, deploy, restart or release approval inferred from recommendation. |

## Outputs

Evidence-linked readiness assessment, residual risks and blockers, recommendation distinct from release authorization, Verification Report and precise next decision/action.

Use the repository's artifact format first; otherwise select these reusable
templates only as needed: Risk Assessment, Implementation Plan, Verification Report, Change Passport, Context Capsule / Agent Handoff. The implementation owner holds
task/plan/risk/verification/passport formats, the architecture owner holds the
ADR, and the AI-engineering owner holds the Context Capsule. Request their
relevant artifact recipe by skill name rather than following cross-skill links.
Artifacts stay in conversation unless the user requests files or the repository
already keeps them. Do not generate all artifacts for every task.

## Verification

Check artifacts, required build/test/scan results, compatibility and approved rollback evidence against release criteria; unavailable mandatory checks are NOT_RUN and prevent an unsupported GO recommendation.

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

For a narrow release question, assess only the requested gate and state that limit; skip deployment and irrelevant checklist areas without calling the entire release ready.

A compact inline outcome is sufficient for low-risk work. Retain essential
scope, permission and evidence checks even when formal planning stages are skipped.

## Blockers and handoff

Missing mandatory evidence, rollback feasibility or release-owner decision yields PARTIAL/BLOCKED and INSUFFICIENT_EVIDENCE or NO_GO, not an invented waiver or approval. Continue independent evidence collection.

Record DONE, PARTIAL or BLOCKED against completed stages and acceptance criteria,
with the blocker, independent work finished, pending authorization and next safe
action. Use a redacted Context Capsule for an actual handoff; fresh agents must
verify stale facts and the continuing scope of recorded approvals.

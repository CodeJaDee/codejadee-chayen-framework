---
kind: checklist
---
# Dependency/framework upgrade

A native agent follows this composite checklist only after its owning entry
skill and this workflow match the request. It coordinates existing recipes;
it is static guidance, not an executable workflow or a permission mechanism.

## When it applies

The user requests an explicit dependency/framework version change or breaking-change assessment with a defined source and target.

**Not when:** Incidental upgrade opportunities during a bug fix, replacing an unrequested library, or unrelated questions; continue normal native behavior for no match.

No matching workflow => continue normal native behavior. If the skill still
matches a smaller task, use its direct recipe without running this composite.

## Inputs

Requested source/target versions, supported runtimes, lockfiles/pinned manager, current library/provider constraints, migration guides, baseline and action-specific approval.

Read repository instructions and the actual target before selecting stages.
Keep unknown inputs explicit; ask only for information that changes the result.

## Recipe reuse

Use existing procedures, not duplicate implementations. Each row names the
owning skill and its local recipe. For another owner's stage, hand off by skill
name through native behavior; do not assume automatic invocation or spawn agents.
Read only the needed recipe through that owner's References table.

| Owner | Existing recipe | Load when |
|---|---|---|
| `chayen-implementation` | `upgrades.md` | dependency-upgrade; load only when that stage applies |
| `chayen-implementation` | `upgrades.md` | framework-version-upgrade; load only when that stage applies |
| `chayen-implementation` | `upgrades.md` | breaking-change-analysis; load only when that stage applies |
| `chayen-testing` | `test-authoring.md` | regression-testing; load only when that stage applies |
| `chayen-devops` | `environment-parity.md` | environment-parity; load only when that stage applies |

## Technology selection

Resolve versions per owner and check compatibility/peer ranges from the target release's official documentation when needed. Keep Angular TS/Node ranges, React/Next pairing, Nuxt/Vite builder ownership and EF/provider/driver versions distinct.

At each affected owner, detect the installed versions, configured commands and
existing conventions; load only its matching technology base plus relevant topic.
Do not preload all packs, select a framework from a sibling's manifest, install
tools to make a check green, or force migrations or dependency replacements.

## Stages

Each exit check gates only its dependent stage. Skip non-applicable stages
explicitly; a completed plan or static check does not prove runtime delivery.

| Stage | Inputs | Action and recipe | Exit check |
|---|---|---|---|
| Inventory | Explicit target and installed versions | Follow upgrades to identify direct/transitive changes, consumers and runtime support. | No automatic latest version, package-manager switch or adjacent replacement. |
| Assess | Compatibility and breaking changes | Use framework-version-upgrade and breaking-change-analysis; plan required hops and rollback. | Required auth, schema or production actions have separate approval gates. |
| Upgrade | Authorized version scope | Change the smallest coherent manifest/lock set with the current manager; apply only relevant documented migrations. | Pins remain coherent and unrelated packages are preserved. |
| Verify | Updated graph and baseline | Run configured immutable install/build/typecheck/tests and relevant integration/consumer checks; use chayen-devops environment-parity if deployed runtime differs. | Install success alone is not framework/runtime compatibility proof. |
| Report | Diff, checks and remaining hops | Use change-summary with rollback, version evidence and incomplete migration notes. | Only executed target behavior is claimed; release/deploy remains separate. |

## Outputs

Requested coherent upgrade or assessment, version/compatibility table, breaking-change and rollback notes, Verification Report and Change Passport.

Use the repository's artifact format first; otherwise select these reusable
templates only as needed: Task Contract, Implementation Plan, Risk Assessment, Verification Report, Change Passport. The implementation owner holds
task/plan/risk/verification/passport formats, the architecture owner holds the
ADR, and the AI-engineering owner holds the Context Capsule. Request their
relevant artifact recipe by skill name rather than following cross-skill links.
Artifacts stay in conversation unless the user requests files or the repository
already keeps them. Do not generate all artifacts for every task.

## Verification

Run actual configured installation integrity, compile and behavior checks against the target runtime, preserving the existing manager. Missing registry or runtime access is NOT_RUN, not bypassed with forced peers.

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

An authorized patch update uses a compact compatibility check and relevant regression scope; skip major migration programs or ADRs unless an actual decision requires them.

A compact inline outcome is sufficient for low-risk work. Retain essential
scope, permission and evidence checks even when formal planning stages are skipped.

## Blockers and handoff

If peer ranges, registry access or required approvals block a hop, preserve coherent completed work, report PARTIAL or BLOCKED, and state the exact incompatible constraint without deleting lockfiles or forcing installation.

Record DONE, PARTIAL or BLOCKED against completed stages and acceptance criteria,
with the blocker, independent work finished, pending authorization and next safe
action. Use a redacted Context Capsule for an actual handoff; fresh agents must
verify stale facts and the continuing scope of recorded approvals.

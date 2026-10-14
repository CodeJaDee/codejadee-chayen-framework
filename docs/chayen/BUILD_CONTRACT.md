# Build Contract

This contract binds every implementation step of codejadee-chayen-framework.
Changing it requires explicit user approval, recorded in
[DECISIONS.md](DECISIONS.md).

## 1. Step execution rules

| ID | Rule |
|---|---|
| BC-01 | Execute **exactly one** numbered step from [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) per user prompt. |
| BC-02 | Read existing project files before making changes. Never delete or overwrite existing work without explicit approval. |
| BC-03 | Stop at the end of the requested step and wait for user review before continuing. |
| BC-04 | Do not implement work that belongs to a later step, even when it looks convenient. |
| BC-05 | If a step cannot be completed, mark it `BLOCKED` or `PARTIAL` in [PROGRESS.md](PROGRESS.md) and explain why. Never round up to `DONE`. |

## 2. Evidence and honesty rules

| ID | Rule |
|---|---|
| BC-10 | **Never mark an unexecuted test as passed.** A test that was not run is `NOT_RUN`. |
| BC-11 | Every test result claim must include the command that was run and its observed outcome, recorded in [PROGRESS.md](PROGRESS.md). |
| BC-12 | Record every file created, modified, or deleted in each step's ledger in [PROGRESS.md](PROGRESS.md). |
| BC-13 | Keep every requirement traceable to implementation evidence (file paths) and verification evidence (test IDs and results) in [ACCEPTANCE_MATRIX.md](ACCEPTANCE_MATRIX.md). |
| BC-14 | **No placeholder implementations** may be used to claim completion. Stubs, `TODO` bodies, empty skill files, or lorem ipsum count as `PLANNED`, not `IMPLEMENTED`. |
| BC-15 | Claims about provider behaviour (manifest formats, discovery rules, limits) must cite an official source and the date it was checked, or be labelled `UNVERIFIED`. |

## 3. Scope protection rules

| ID | Rule |
|---|---|
| BC-20 | **Do not silently remove requirements.** Removing, narrowing, or deferring a requirement needs a decision record and user approval. |
| BC-21 | Respect the hard exclusions EX-01 to EX-07 in [PROJECT_CHARTER.md](PROJECT_CHARTER.md). |
| BC-22 | **Do not add runtime dependencies without clear necessity.** Each new dependency (runtime or development) needs a decision record that justifies it. The plugin itself should ship as static content plus manifests. |
| BC-23 | Do not let skill content claim hard enforcement. Markdown guidance is advisory. Real enforcement must come from provider-native mechanisms (permissions, hooks, CI), and it must be documented as such. |

## 4. Repository and release rules

| ID | Rule |
|---|---|
| BC-30 | **Do not commit, push, publish, tag, or release without explicit user approval** for that specific action. |
| BC-31 | Do not submit to, or modify, any external marketplace or registry without explicit approval. |
| BC-32 | Leave unrelated user files (for example `.vscode/`) untouched. |

## 5. Status vocabulary

### 5.1 Requirement status (acceptance matrix)

| Status | Meaning |
|---|---|
| `PLANNED` | Not yet implemented |
| `IN_PROGRESS` | Implementation started in the current step, not complete |
| `IMPLEMENTED` | Implementation exists (with evidence path) but verification has not passed yet |
| `VERIFIED` | Verification executed and passed, with recorded evidence |
| `BLOCKED` | Cannot proceed. The blocking issue is linked in [ISSUES.md](ISSUES.md) |
| `DEFERRED` | Postponed by a user-approved decision |

### 5.2 Test result status

| Status | Meaning |
|---|---|
| `PASS` | Executed, passed, and the output was recorded |
| `FAIL` | Executed and failed |
| `NOT_RUN` | Not executed, for any reason |
| `N/A` | Not applicable to this step |

### 5.3 Step status

`NOT_STARTED` · `IN_PROGRESS` · `DONE` · `PARTIAL` · `BLOCKED`

## 6. Required step report

Every step ends with a report that contains:

1. Summary of the work done
2. Files created, modified, or deleted
3. Decisions made or proposed
4. Risks and open questions
5. Test results (or `NOT_RUN`)
6. Step status

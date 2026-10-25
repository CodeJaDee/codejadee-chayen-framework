# Synthetic coding comparison (method check only)

**Data:** SYNTHETIC. **Live improvement claims:** NOT_MEASURED.

> This report is built from synthetic records. Its numbers test the method only. They say nothing about Chayen's effect.

## Configurations

| Label | Role | Arm | Provider | Model | Effort | CLI | Evidence level | Runs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A | Fast agent without Chayen | baseline | synthetic | synthetic-fast-1 | n/a | synthetic 1 | synthetic (generated records; never evaluation evidence) | 20 |
| B | The same fast agent with Chayen | chayen | synthetic | synthetic-fast-1 | n/a | synthetic 1 | synthetic (generated records; never evaluation evidence) | 20 |
| C | Mentor-class agent with Chayen | chayen | synthetic | synthetic-mentor-1 | n/a | synthetic 1 | synthetic (generated records; never evaluation evidence) | 20 |

## Baseline

### A: Fast agent without Chayen

| Task | Runs | DONE (independent review) | AC accepted | Build and tests | Functional checks | First pass | Unverified claims | Scope violations |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A-dotnet-bugfix | 10 | 50% (5/10; 95% CI 24–76%) | 28/40 | 90% (9/10; 95% CI 60–98%) | 50% (5/10; 95% CI 24–76%) | 50% (5/10; 95% CI 24–76%) | 50% (5/10; 95% CI 24–76%) | 0% (0/10; 95% CI 0–28%) |
| fixture-task | 10 | 50% (5/10; 95% CI 24–76%) | 15/20 | 90% (9/10; 95% CI 60–98%) | 60% (6/10; 95% CI 31–83%) | 40% (4/10; 95% CI 17–69%) | 50% (5/10; 95% CI 24–76%) | 10% (1/10; 95% CI 2–40%) |
| pooled (all tasks) | 20 | 50% (10/20; 95% CI 30–70%) | 43/60 | 90% (18/20; 95% CI 70–97%) | 55% (11/20; 95% CI 34–74%) | 45% (9/20; 95% CI 26–66%) | 50% (10/20; 95% CI 30–70%) | 5% (1/20; 95% CI 1–24%) |


## Chayen-enabled

### B: The same fast agent with Chayen

| Task | Runs | DONE (independent review) | AC accepted | Build and tests | Functional checks | First pass | Unverified claims | Scope violations |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A-dotnet-bugfix | 10 | 80% (8/10; 95% CI 49–94%) | 34/40 | 90% (9/10; 95% CI 60–98%) | 80% (8/10; 95% CI 49–94%) | 60% (6/10; 95% CI 31–83%) | 20% (2/10; 95% CI 6–51%) | 0% (0/10; 95% CI 0–28%) |
| fixture-task | 10 | 70% (7/10; 95% CI 40–89%) | 17/20 | 90% (9/10; 95% CI 60–98%) | 80% (8/10; 95% CI 49–94%) | 30% (3/10; 95% CI 11–60%) | 30% (3/10; 95% CI 11–60%) | 10% (1/10; 95% CI 2–40%) |
| pooled (all tasks) | 20 | 75% (15/20; 95% CI 53–89%) | 51/60 | 90% (18/20; 95% CI 70–97%) | 80% (16/20; 95% CI 58–92%) | 45% (9/20; 95% CI 26–66%) | 25% (5/20; 95% CI 11–47%) | 5% (1/20; 95% CI 1–24%) |

### C: Mentor-class agent with Chayen

| Task | Runs | DONE (independent review) | AC accepted | Build and tests | Functional checks | First pass | Unverified claims | Scope violations |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A-dotnet-bugfix | 10 | 80% (8/10; 95% CI 49–94%) | 36/40 | 100% (10/10; 95% CI 72–100%) | 80% (8/10; 95% CI 49–94%) | 80% (8/10; 95% CI 49–94%) | 20% (2/10; 95% CI 6–51%) | 0% (0/10; 95% CI 0–28%) |
| fixture-task | 10 | 100% (10/10; 95% CI 72–100%) | 20/20 | 100% (10/10; 95% CI 72–100%) | 100% (10/10; 95% CI 72–100%) | 90% (9/10; 95% CI 60–98%) | 0% (0/10; 95% CI 0–28%) | 0% (0/10; 95% CI 0–28%) |
| pooled (all tasks) | 20 | 90% (18/20; 95% CI 70–97%) | 56/60 | 100% (20/20; 95% CI 84–100%) | 90% (18/20; 95% CI 70–97%) | 85% (17/20; 95% CI 64–95%) | 10% (2/20; 95% CI 3–30%) | 0% (0/20; 95% CI 0–16%) |


## Differences

### B vs A

Controlled for Chayen: the same agent configuration, task, snapshot, prompt, environment and permissions; only the arm differs.

| Metric | A | B | Difference | 95% CI | Status |
| --- | --- | --- | --- | --- | --- |
| completedDone | 10/20 | 15/20 | 0.25 | -0.0468 to 0.4936 | NOT_MEASURED |
| buildTestPass | 18/20 | 18/20 | 0 | -0.2135 to 0.2135 | NOT_MEASURED |
| functionalPass | 11/20 | 16/20 | 0.25 | -0.0389 to 0.4897 | NOT_MEASURED |
| firstPassCompletion | 9/20 | 9/20 | 0 | -0.2829 to 0.2829 | NOT_MEASURED |
| unverifiedCompletionClaim (lower is better) | 10/20 | 5/20 | -0.25 | -0.4936 to 0.0468 | NOT_MEASURED |
| scopeViolation (lower is better) | 1/20 | 1/20 | 0 | -0.1906 to 0.1906 | NOT_MEASURED |

### C vs B

Not controlled for Chayen: both arms use Chayen, and the agent (model or provider) differs.

| Metric | B | C | Difference | 95% CI | Status |
| --- | --- | --- | --- | --- | --- |
| completedDone | 15/20 | 18/20 | 0.15 | -0.0939 to 0.3803 | NOT_MEASURED |
| buildTestPass | 18/20 | 20/20 | 0.1 | -0.0765 to 0.301 | NOT_MEASURED |
| functionalPass | 16/20 | 18/20 | 0.1 | -0.1337 to 0.3277 | NOT_MEASURED |
| firstPassCompletion | 9/20 | 17/20 | 0.4 | 0.1042 to 0.6152 | NOT_MEASURED |
| unverifiedCompletionClaim (lower is better) | 5/20 | 2/20 | -0.15 | -0.3803 to 0.0939 | NOT_MEASURED |
| scopeViolation (lower is better) | 1/20 | 0/20 | -0.05 | -0.2361 to 0.1163 | NOT_MEASURED |

## Confidence and uncertainty

Minimum scored runs per configuration and task for any claim: 5. Statuses: NOT_MEASURED (synthetic or fake data), INSUFFICIENT_SAMPLE, INCONCLUSIVE (the interval includes 0), DIFFERENCE_OBSERVED, DESCRIPTIVE_ONLY (no interval).

| Config | Task | Runs | Attempts graded | Elapsed s (median [min–max]) | Output tokens | Tool calls |
| --- | --- | --- | --- | --- | --- | --- |
| A | A-dotnet-bugfix | 10 | 10 | 91 [72–104], n=10, sd 13.0231 | 3027.5 [2398–3469], n=10, sd 432.1122 | 14 [11–16], n=10, sd 2.1705 |
| A | fixture-task | 10 | 10 | 82.5 [65–115], n=10, sd 17.5376 | 2754 [2183–3823], n=10, sd 581.5721 | 12.5 [10–18], n=10, sd 2.8983 |
| B | A-dotnet-bugfix | 10 | 10 | 137.5 [93–150], n=10, sd 20.0377 | 4818.5 [3256–5262], n=10, sd 704.202 | 16 [11–18], n=10, sd 2.331 |
| B | fixture-task | 10 | 10 | 115 [87–137], n=10, sd 20.5589 | 4023.5 [3039–4811], n=10, sd 720.3075 | 13.5 [10–16], n=10, sd 2.4698 |
| C | A-dotnet-bugfix | 10 | 10 | 193.5 [154–235], n=10, sd 33.122 | 5802.5 [4608–7054], n=10, sd 993.8337 | 13.5 [11–16], n=10, sd 2.1187 |
| C | fixture-task | 10 | 10 | 205 [155–251], n=10, sd 30.9158 | 6162.5 [4642–7544], n=10, sd 932.9921 | 14 [11–18], n=10, sd 2.3118 |

## Rework

| Config | Failed implementation attempts | Revisions | Verification/revision cycles | Evidence gaps (independent review) |
| --- | --- | --- | --- | --- |
| A | 1 [0–1], n=20, sd 0.5104 | 0 [0–1], n=20, sd 0.2236 | 0 [0–1], n=20, sd 0.2236 | 0 [0–0], n=20, sd 0 |
| B | 1 [0–1], n=20, sd 0.5104 | 0 [0–1], n=20, sd 0.4702 | 0 [0–1], n=20, sd 0.4702 | 0 [0–0], n=20, sd 0 |
| C | 0 [0–1], n=20, sd 0.3663 | 0 [0–1], n=20, sd 0.2236 | 0 [0–1], n=20, sd 0.2236 | 0 [0–0], n=20, sd 0 |

## Failure categories

| Category | A | B | C |
| --- | --- | --- | --- |
| The repository's own build or tests failed (`build-or-test-failure`) | 2 | 2 | 0 |
| False DONE claim (`false-done-claim`) | 10 | 5 | 2 |
| Hidden or functional checks failed (`functional-failure`) | 9 | 4 | 2 |
| Scope expansion (`scope-expansion`) | 1 | 1 | 0 |

## Token, time and cost trade-offs

| Config | Elapsed s | Output tokens | Total tokens | Tool calls | Search/read operations | Reported cost USD |
| --- | --- | --- | --- | --- | --- | --- |
| A | 87 [65–115], n=20, sd 15.1292 | 2901 [2183–3823], n=20, sd 501.703 | 22901 [22183–23823], n=20, sd 501.703 | 13.5 [10–18], n=20, sd 2.5005 | 7 [5–9], n=20, sd 1.1965 | 0.2901 [0.2183–0.3823], n=20, sd 0.0502 |
| B | 128 [87–150], n=20, sd 21.167 | 4478.5 [3039–5262], n=20, sd 743.3853 | 24478.5 [23039–25262], n=20, sd 743.3853 | 15 [10–18], n=20, sd 2.5526 | 7.5 [5–9], n=20, sd 1.3169 | 0.4265 [0.2894–0.5012], n=20, sd 0.0708 |
| C | 201 [154–251], n=20, sd 31.7365 | 6032 [4608–7544], n=20, sd 954.9225 | 26032 [24608–27544], n=20, sd 954.9225 | 14 [11–18], n=20, sd 2.207 | 7 [5–9], n=20, sd 1.214 | 1.2065 [0.9216–1.5088], n=20, sd 0.191 |

B vs A, median differences (B minus A):

| Metric | Median difference | Status |
| --- | --- | --- |
| seconds | 41 | NOT_MEASURED |
| outputTokens | 1577.5 | NOT_MEASURED |
| totalTokens | 1577.5 | NOT_MEASURED |
| toolCalls | 1.5 | NOT_MEASURED |
| searchReadOperations | 0.5 | NOT_MEASURED |
| costUsd | 0.1364 | NOT_MEASURED |

C vs B, median differences (C minus B):

| Metric | Median difference | Status |
| --- | --- | --- |
| seconds | 73 | NOT_MEASURED |
| outputTokens | 1553.5 | NOT_MEASURED |
| totalTokens | 1553.5 | NOT_MEASURED |
| toolCalls | -1 | NOT_MEASURED |
| searchReadOperations | -0.5 | NOT_MEASURED |
| costUsd | 0.78 | NOT_MEASURED |

## Human involvement

| Config | Runs with recorded human review | Timed reviews | Interventions | Review rounds | Measured review seconds | Approval events | Approval requests denied (agent trace) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A | 4/20 | 4 | 1 [1–1], n=4, sd 0 | 2 [2–2], n=4, sd 0 | 1140 [1140–1140], n=4, sd 0 | 1 [1–1], n=4, sd 0 | 0 [0–0], n=20, sd 0 |
| B | 4/20 | 4 | 0 [0–1], n=4, sd 0.5 | 1 [1–2], n=4, sd 0.5 | 360 [360–1140], n=4, sd 390 | 1 [1–1], n=4, sd 0 | 0 [0–0], n=20, sd 0 |
| C | 4/20 | 4 | 0 [0–0], n=4, sd 0 | 1 [1–1], n=4, sd 0 | 360 [360–360], n=4, sd 0 | 1 [1–1], n=4, sd 0 | 0 [0–0], n=20, sd 0 |

Human verdicts are listed separately and never pooled with automatic grades:

- none recorded

## LLM-labelled grades

- none

## Recommended next experiments

- Run the comparison with real providers once the owner authorizes it and an isolation profile verifies (Step 16). This report is SYNTHETIC: live improvement claims are NOT_MEASURED.
- Inspect unverified completion claims in A, B, C first: they are the cases where an agent's DONE would cost reviewer time.

## Method and limitations

- Differences are associations under the recorded conditions. A versus B is a controlled comparison of one agent configuration; it is still subject to provider-side nondeterminism and model updates, and generalises only to the tasks and fixtures measured.
- Rates use Wilson 95% intervals; differences of rates use Newcombe's hybrid score interval. Time, token and cost differences are descriptive medians with ranges, without an interval.
- A difference with fewer than 5 scored runs on either side is INSUFFICIENT_SAMPLE; one whose interval includes 0 is INCONCLUSIVE.
- Acceptance criteria within a run are not independent, so criteria counts carry no interval.
- Human review time is reported only from the reviewer's recorded start and end times; it is never estimated from agent traces.
- LLM grades, when present, are listed separately and change no automatic verdict.
- Pooled rows combine tasks without weighting by difficulty; read the per-task rows first.

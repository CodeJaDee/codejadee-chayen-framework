---
kind: recipe
capabilities: [CAP-17-008, CAP-20-003, CAP-20-008]
---
# Prompt and tool evaluation

Evaluate prompts and tool definitions for LLM applications with an eval
set, graders, repeated runs, and a baseline, so a change ships only when it
measurably helps and does not regress other cases. Billed runs need
approval, and a single run is never a result. The same method tests whether
agent skills trigger correctly on each provider, and benchmarks agents or
agent configurations on realistic tasks against a baseline.

## Inputs

- The prompts or tool schemas to compare (current and candidate), and the
  model and parameters.
- Representative tasks with success criteria, including edge cases and
  known failures.
- The budget for billed runs, and any existing eval set or tool.

## Procedure

1. **Define success per case:** an exact answer, a required structure (valid
   JSON with fields), a correct tool call with arguments, or a rubric for a
   grader.
2. **Build the eval set:** typical, edge, adversarial, and regression cases
   from real failures, with personal data removed. Keep a held-out part for
   final checks.
3. **Choose graders:** deterministic checks first (schema, exact match,
   tool name and arguments); model-based graders only with a rubric and a
   check against human labels on a sample.
4. **Run the baseline and the candidate** under the same model, parameters,
   and cases, at least three runs per case, after approval for billed runs.
5. **Report per case and overall:** pass rate, mean and variance across
   runs, cost and latency, and the cases that changed result.
6. **Decide with the evidence:** the candidate wins only if the difference
   holds beyond the run-to-run variance and no important case regresses;
   otherwise iterate or keep the baseline.
7. **Keep the set in the repository** and run it on future prompt, tool, or
   model changes.

### Skill testing (CAP-20-003)

1. **Write cases per skill:** positive prompts that should invoke it,
   negatives that must not (zero activation expected), ambiguous prompts
   with acceptable alternatives, and unsupported-stack prompts.
2. **Use each provider's native mechanism** where one exists (for example a
   plugin eval command), and a scripted procedure with recorded transcripts
   elsewhere. Provider behaviour differs; do not reuse one provider's
   results for another.
3. **Include a no-plugin baseline** so built-in skills competing for the same
   prompts are visible.
4. **Run at least three times per case** with approval for billed runs, and
   report pass rates per case and per skill, never extrapolated from single
   runs.

### Agent task benchmarking (CAP-20-008)

1. **Fix the tasks and fixtures:** realistic engineering tasks in fixture
   repositories with a known starting commit and automatic graders (tests
   that must pass, files that must not change).
2. **Define the configurations:** a baseline (for example no skills) and the
   candidates, with the same model and settings.
3. **Run repeatedly,** in isolated environments, recording pass rate,
   variance, duration, and cost per run.
4. **Compare against the baseline** and report differences only beyond the
   run-to-run variance.

## Outputs

- An eval set, graders, and a comparison report with run counts and
  variance.
- For skills: a case set with expectations, provider-native eval
  configuration where it exists and a run procedure elsewhere, and results
  with run counts and pass rates.
- For benchmarks: a harness and graders, and results with pass rates,
  variance, cost, and the baseline comparison.

## Technology considerations

| Stack | Consideration |
|---|---|
| Python | promptfoo, DeepEval, or a pytest harness that writes per-case JSON results; provider SDK retries disabled during eval so failures are visible. |
| .NET | xUnit or NUnit eval tests marked with a category, using `Microsoft.Extensions.AI` or the provider SDK, results written per case. |
| TypeScript | promptfoo configurations or Vitest-based harnesses with the project's SDK. |
| Tool definitions | Evaluate tool selection and arguments directly from the tool-call output, not from the final text. |

## Verification

- The generated comparison uses at least three runs per case and reports
  variance, not a single run.
- Deterministic graders are used where possible, and model graders are
  checked against a labelled sample.
- Billed runs happened only after approval, or the report is NOT_RUN with
  the planned command.
- Generated skill cases include negatives with zero-activation expectations,
  and the run plan includes at least three runs per case.
- The benchmark report for fixture tasks includes the no-skill baseline, run
  counts, and cost per run.

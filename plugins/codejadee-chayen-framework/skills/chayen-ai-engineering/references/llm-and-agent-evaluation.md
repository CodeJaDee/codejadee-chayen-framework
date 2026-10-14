---
kind: recipe
capabilities: [CAP-17-008]
---
# Prompt and tool evaluation

Evaluate prompts and tool definitions for LLM applications with an eval
set, graders, repeated runs, and a baseline, so a change ships only when it
measurably helps and does not regress other cases. Billed runs need
approval, and a single run is never a result.

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

## Outputs

- An eval set, graders, and a comparison report with run counts and
  variance.

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

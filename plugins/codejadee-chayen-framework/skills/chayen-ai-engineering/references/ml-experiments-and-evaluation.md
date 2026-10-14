---
kind: recipe
capabilities: [CAP-17-002, CAP-17-003]
---
# ML experiment design and model evaluation

Design experiments that can answer a business question (hypothesis,
baselines including a non-ML one, metrics tied to the cost of errors, fixed
splits, tracking, stopping criteria), and evaluate trained models honestly:
the right metrics, per-slice results, calibration, confidence intervals,
and error analysis against baselines.

## Inputs

- The goal and the decision the model supports, with the cost of false
  positives and false negatives.
- Available data and its readiness report, and the current baseline
  (rules, heuristics, or an existing model).
- For evaluation: predictions or the model, the held-out data, and slices
  that matter (segments, regions, devices).

## Procedure

### Experiment design (CAP-17-002)

1. **State the hypothesis** in measurable terms ("a gradient-boosted model
   improves recall at 5 % false-positive rate by 10 points over the rules").
2. **Define baselines:** a non-ML baseline (majority class, current rules,
   simple heuristic) and the current production model if any.
3. **Choose metrics** from the cost of errors (precision, recall, PR-AUC,
   cost-weighted metrics, ranking metrics), plus guardrail metrics
   (latency, fairness slices).
4. **Fix the evaluation split** before training, from the readiness
   report, and hold the test set back until the final comparison.
5. **Plan tracking:** parameters, data version, code revision, seeds, and
   metrics per run in the project's tracker.
6. **Set stopping criteria:** a budget of runs or time, and the improvement
   that would justify deployment.

### Model evaluation (CAP-17-003)

1. **Compute metrics on the held-out set** against the baselines, with
   bootstrap or cross-validation intervals.
2. **Use metrics that fit the data:** per-class precision and recall and
   PR-AUC on imbalanced data, never accuracy alone; regression error by
   range; ranking metrics where order matters.
3. **Slice the results** by the segments that matter, and flag slices that
   perform much worse.
4. **Check calibration** when scores are used as probabilities (reliability
   curve, Brier score).
5. **Analyse errors:** sample false positives and false negatives, group
   them by cause, and propose data or feature fixes.
6. **Recommend** deploy, iterate, or stop, against the stopping criteria,
   labelled as a recommendation for the owner.

## Outputs

- An experiment plan with metrics, baselines, splits, and the tracking
  setup.
- A metric table with intervals and slice analysis, an error analysis, and
  a recommendation.

## Technology considerations

| Stack | Consideration |
|---|---|
| Python | scikit-learn metrics and `cross_validate`, `CalibrationDisplay`, bootstrapping with NumPy, MLflow or Weights & Biases tracking, Optuna for bounded searches if used. |
| .NET | ML.NET `BinaryClassificationMetrics` and `CrossValidate`, with intervals computed from folds or bootstrap. |
| Notebooks | Keep evaluation code in a script or module that the notebook calls, so results are reproducible. |
| Managed platforms | Azure ML or SageMaker experiments as the tracker when the project uses them. |

## Verification

- The plan includes a non-ML baseline and fixes the evaluation split before
  training.
- On an imbalanced fixture, the evaluation reports precision and recall per
  class rather than accuracy alone.
- Every metric names its data, split, and command, with intervals, or the
  run is NOT_RUN.

---
kind: recipe
capabilities: [CAP-17-001, CAP-17-005]
---
# Dataset readiness and drift

Check that a dataset is fit for training or evaluation before anyone
trains on it (provenance, labels, balance, leakage, duplicates, splits,
personal data, documentation), and detect data and prediction drift in
production against a reference window, with thresholds, alerts, and
retraining or investigation triggers.

## Inputs

- The dataset or a representative sample, its schema, and the intended use
  (task, target, prediction time).
- For drift: the reference data (usually training or a stable production
  window), production feature logs, and model outputs.
- Data sensitivity and where processing may happen (local, managed
  workspace).

## Procedure

### Dataset readiness (CAP-17-001)

1. **Record provenance:** source systems, extraction date and query, owner,
   licence or usage rights, and transformations applied.
2. **Profile the data:** row count, missing values, types, ranges, and
   label distribution. Flag class imbalance with the ratio.
3. **Check labels:** how they were produced, agreement rates if several
   annotators, and a sample review for obvious errors.
4. **Check for leakage:**
   - features not available at prediction time (future timestamps,
     post-outcome fields, IDs that encode the target);
   - duplicates or near-duplicates across train, validation, and test
     (exact hashes, then normalized text or key fields), reported with
     counts;
   - group leakage (the same customer or patient in several splits) and
     temporal leakage (training on data after the test period).
5. **Fix the splits** with the right strategy (random, stratified, grouped,
   or time-based), save the split definition, and never re-split after
   seeing test results.
6. **Check personal and sensitive data:** fields, free text, and images
   that need removal, pseudonymization, or approval before use.
7. **Write the readiness report** with checks, findings, and blocking issues,
   and a dataset card draft.

### Drift (CAP-17-005)

1. **Choose the reference window** and the comparison window, and the
   features and outputs to monitor (prioritise by feature importance).
2. **Pick tests per type:** Kolmogorov-Smirnov or population stability
   index for numeric features, chi-square or PSI for categorical ones, and
   the prediction distribution and, when labels arrive, performance.
3. **Set thresholds** with the owner and from historical variation, to
   avoid alerting on normal seasonality. Account for multiple features
   being tested at once.
4. **Report per feature:** statistic, threshold, and status; a seeded shift
   must be flagged while unshifted features are not.
5. **Define actions:** alert routing, an investigation runbook (data
   pipeline change, population change, upstream bug), and retraining
   triggers that require evaluation before deployment.

## Outputs

- A readiness report with checks, findings, and blocking issues, and a
  dataset card draft.
- Drift metrics per feature with thresholds and an alerting plan, and the
  retraining or investigation triggers.

## Technology considerations

| Stack | Consideration |
|---|---|
| Python | pandas or Polars profiling, scikit-learn `GroupShuffleSplit`, `TimeSeriesSplit`, `StratifiedKFold`, hashing for duplicate detection, `scipy.stats` tests, Evidently or whylogs if installed. |
| .NET | ML.NET `DataOperationsCatalog.TrainTestSplit` with `samplingKeyColumnName` for grouped splits; drift computed in a scheduled job or exported to Python tooling. |
| Data stores (SQL Server, PostgreSQL) | Extraction queries saved with the dataset version; window functions for time-based splits. |
| Managed platforms | Azure ML or SageMaker data drift monitors where the project already uses them. |

## Verification

- Seeded duplicates across train and test splits in the fixture are
  detected with counts.
- A seeded shifted feature in the fixture production sample is flagged,
  while unshifted features are not.
- The split definition is saved, and personal-data findings are listed, or
  checks are NOT_RUN with the reason.

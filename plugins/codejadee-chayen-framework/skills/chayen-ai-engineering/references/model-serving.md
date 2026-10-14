---
kind: recipe
capabilities: [CAP-17-004]
---
# Model serving

Serve a trained model in production behind an API with input validation,
version reporting, batching where useful, latency and resource budgets, a
staged rollout, and a fallback when the model is unavailable or unsure.

## Inputs

- The model artifact and format (pickle or joblib, ONNX, TorchScript,
  ML.NET zip, a hosted model), its preprocessing, and its expected input
  schema.
- The latency target, throughput, and hardware (CPU, GPU, memory).
- The serving platform the project uses, and the consumers.

## Procedure

1. **Package the model with its preprocessing** so serving uses exactly the
   training transformation, and record the model version and data version.
   Prefer a portable format (ONNX) where the stack supports it; never load
   untrusted pickle files.
2. **Define the API contract:** request schema with types, ranges, and
   required fields; response with prediction, score, model version, and
   request ID.
3. **Validate input** and reject malformed or out-of-range requests with a
   clear 4xx error, instead of predicting on garbage.
4. **Load once, predict many:** load the model at startup into a
   thread-safe structure, warm it up, and add micro-batching only if
   throughput needs it.
5. **Set budgets and measure:** p95 latency and memory under expected load,
   with the performance skill's load-testing approach, or NOT_RUN.
6. **Plan rollout:** shadow or canary traffic comparing the new model with
   the current one, with a promotion criterion and a quick rollback to the
   previous version.
7. **Define fallbacks:** rules or the previous model when the model fails or
   its confidence is low, and log those cases.
8. **Observe:** prediction distribution, latency, errors, and model version
   in telemetry, feeding the drift monitoring.

## Outputs

- Serving code or configuration with input validation and model version
  reporting.
- A load and latency check, and a rollout and fallback plan.

## Technology considerations

| Stack | Consideration |
|---|---|
| Python | FastAPI with Pydantic models, a model loaded in the lifespan handler, `joblib` only for trusted artifacts, ONNX Runtime, BentoML if used, Gunicorn or Uvicorn worker counts sized for memory. |
| .NET | ASP.NET Core with `PredictionEnginePool` (ML.NET) or a singleton ONNX Runtime `InferenceSession`, minimal API validation, health checks. |
| TypeScript | ONNX Runtime for Node or a call to a model service; avoid loading heavy models in serverless functions with cold starts. |
| Managed platforms | Azure ML or SageMaker endpoints with blue-green traffic split, as the project uses them. Deployment is an approved release step. |

## Verification

- The fixture serving endpoint rejects malformed input and reports the
  model version in responses or headers, shown by tests.
- Latency and memory are measured under stated load, or NOT_RUN.
- The rollout has a promotion criterion and a rollback, and nothing was
  deployed without approval.

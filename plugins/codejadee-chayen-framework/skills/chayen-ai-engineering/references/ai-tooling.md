---
kind: technology
---
# ML, LLM, and agent tooling

**Applies to:** ML and LLM work in Python, .NET, and TypeScript, vector
stores, evaluation tools, telemetry, and AI coding agent configuration.
Read only the section for the detected tooling.

- Library APIs, model names, and provider settings change often. Check the
  installed versions and the vendor's current documentation before relying
  on a parameter, and say when you have not.
- Use the libraries and services already in the repository. Adding one
  needs approval.

## Check the repository first

| Area | What to look for |
|---|---|
| Python ML | `pandas`, `polars`, `scikit-learn`, `xgboost`, `lightgbm`, `torch`, notebooks, `requirements` or `pyproject.toml` |
| Tracking and registry | MLflow (`mlruns/`, `MLproject`), Weights & Biases, Azure ML or SageMaker configuration, DVC files |
| .NET AI | `Microsoft.ML`, `Microsoft.ML.OnnxRuntime`, `Microsoft.Extensions.AI`, `Microsoft.SemanticKernel`, Azure OpenAI or other provider SDKs |
| TypeScript AI | Provider SDKs (OpenAI, Anthropic), the Vercel AI SDK, LangChain.js, LlamaIndex.TS |
| Orchestration (Python) | LangChain, LlamaIndex, Haystack, DSPy, or direct SDK calls |
| Vector stores | pgvector, Azure AI Search, Qdrant, Weaviate, Elasticsearch or OpenSearch k-NN, Pinecone |
| Evaluation | promptfoo configurations, DeepEval or Ragas tests, custom pytest or xUnit eval suites, labelled JSONL sets |
| Telemetry | OpenTelemetry with GenAI semantic conventions, Langfuse, Arize Phoenix, Application Insights |
| Agent configuration | Agent settings and permission files, instruction files (`AGENTS.md`, `CLAUDE.md`), MCP server configuration, CI agent jobs |

## Python ML

- scikit-learn `Pipeline` and `ColumnTransformer` keep preprocessing inside
  cross-validation, which prevents leakage; `GroupKFold` and
  `TimeSeriesSplit` for grouped or temporal data.
- Metrics: `classification_report`, `roc_auc_score`,
  `average_precision_score`, calibration curves; bootstrap for intervals.
- Drift statistics: `scipy.stats.ks_2samp`, chi-square tests, population
  stability index; Evidently if installed.
- Track runs with the project's tracker, logging parameters, data version,
  metrics, and the code revision.

## Serving

- Python: FastAPI with Pydantic models for input validation, BentoML, or the
  managed platform's endpoints. ONNX Runtime for portable inference.
- .NET: ML.NET `PredictionEnginePool` (thread-safe) or ONNX Runtime
  sessions, behind ASP.NET Core with validation.
- Report the model version in responses or headers, and expose health and
  readiness endpoints.

## LLM applications

- Structured output: JSON schema or tool-call output validated in code
  before use.
- Tools: narrow schemas, server-side authorization per call, and
  confirmation for consequential actions.
- Keep prompts in versioned files or configuration, not scattered string
  literals, so evaluations can reference a prompt version.

## Evaluation tools

- promptfoo (`promptfooconfig.yaml`, `npx promptfoo eval` with repeat
  options), DeepEval or Ragas in pytest, or a custom harness writing
  per-case results.
- LLM-as-judge graders need their own validation against human labels on a
  sample before being trusted.

## Telemetry

- OpenTelemetry GenAI conventions record model, token counts, and latency
  on spans (`gen_ai.*` attributes); capture of prompt and completion
  content is opt-in and must follow the privacy rules.

## Agent configuration

- Providers expose permission rules (for example allow, ask, and deny
  lists for tools and commands), sandbox or approval modes, and
  network restrictions. Read the provider's current documentation for the
  exact file names and keys, and cite it in the review.

## Commands

```bash
python -m pytest tests/eval -q             # project eval suite, if present
mlflow ui                                  # local tracking UI, if MLflow is used
npx promptfoo eval -c promptfooconfig.yaml # only with approval when it calls billed models
dotnet test --filter Category=Eval
```

## Pitfalls

- Fitting a scaler or encoder on the full dataset before splitting.
- Reporting accuracy on imbalanced data.
- One run of an LLM eval declared a win.
- Evaluating on documents or examples that leaked into prompts or training.
- Logging full prompts with personal data by default.

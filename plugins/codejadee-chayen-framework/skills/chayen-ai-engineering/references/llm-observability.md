---
kind: recipe
capabilities: [CAP-17-010]
---
# LLM observability

Observe LLM features in production: traces of model and tool calls with
model, token, latency, and error attributes, cost metrics, quality signals
(feedback, eval sampling), and privacy-safe logging with redaction, using
OpenTelemetry GenAI conventions where the stack supports them.

## Inputs

- The LLM client code and orchestration, the existing observability stack,
  and the dashboards and alerting in use.
- Privacy constraints: what may be stored from prompts and outputs, for how
  long, and who may see it.
- Cost and latency targets, and any user feedback mechanism.

## Procedure

1. **Instrument every model and tool call** as spans: model name and
   version, operation, input and output token counts, latency, finish
   reason, errors and retries, and tool names, linked to the request trace.
2. **Decide content capture:** prompts and completions are off by default;
   when enabled, apply redaction (emails, phone numbers, tokens, IDs) before
   export, sampling, and a retention period agreed with the owner.
3. **Emit metrics:** tokens and cost per feature, tenant, and model;
   latency percentiles; error and refusal rates; tool-call failure rates.
4. **Capture quality signals:** user feedback events, sampled outputs for
   offline evaluation with the eval set, and guardrail triggers.
5. **Build dashboards and alerts:** cost spikes, latency regressions, error
   rates, and feedback drops, routed like other service alerts with
   runbooks.
6. **Test the instrumentation:** each call emits a span with the required
   attributes, and redaction removes seeded personal data.

## Outputs

- Instrumentation following OpenTelemetry GenAI conventions where
  available.
- Dashboards and alerts for cost, latency, errors, and feedback, with
  redaction rules.

## Technology considerations

| Stack | Consideration |
|---|---|
| Python | OpenTelemetry instrumentation packages for provider SDKs where available, or manual spans with `gen_ai.*` attributes; Langfuse or Arize Phoenix if the project uses them. |
| .NET | `Microsoft.Extensions.AI` OpenTelemetry middleware (`UseOpenTelemetry`) or Semantic Kernel telemetry, exported with the existing OpenTelemetry setup or Application Insights. |
| TypeScript | The Vercel AI SDK telemetry options or manual OpenTelemetry spans, with the Node SDK exporter. |
| Backends | Prometheus or Azure Monitor for token and cost metrics; the existing tracing backend for spans. |

## Verification

- Each fixture LLM call emits a span with model, token counts, and latency,
  shown by a test.
- Raw prompts are redacted per configuration, and a seeded email address is
  absent from exported spans.
- Alerts link runbooks, and content capture settings are documented.

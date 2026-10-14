---
kind: recipe
capabilities: [CAP-03-007]
---
# Sequence and data-flow diagrams

Describe how a request or data moves through the system over time: the
participants, the order of calls, synchronous and asynchronous steps, data
stores touched, and the failure paths. Every step is grounded in code or
configuration, so the diagram shows the system as built.

## Inputs

- The flow to describe: a user action, an API request, a job, or a data
  pipeline, from its entry point to its end.
- Repository read access, or a description if the system is not yet built.
  In that case the diagram is a proposal, and is labelled so.
- The level of detail wanted: system level (services and stores) or code
  level (classes and methods).

## Procedure

1. **Find the entry point:** route, controller or handler, page action, job
   trigger, or message consumer. Cite it with `path:line`.
2. **Trace each call in order** at the requested level.
   - Record the participant, the call, whether it is synchronous or
     asynchronous, and the data passed.
   - Cite the code line for each step. Steps you cannot trace are labelled
     `inferred` or `unknown`. They are never drawn as fact.
3. **Mark the boundaries:**
   - process and network hops;
   - transactions (where they begin and commit);
   - messages published or consumed;
   - external services.
4. **Add the failure paths:** timeouts, exceptions mapped to responses,
   retries, compensations, dead-letter routes. If the code has none for a
   remote call, show that gap explicitly.
5. **For data-flow diagrams,** show:
   - each data store and data class (for example personal data or payment
     data);
   - where the data is created, transformed, copied, and deleted;
   - the trust boundaries crossed.
6. **Draw the diagram** in Mermaid (`sequenceDiagram` or `flowchart`), or in
   the repository's diagram format. Keep one diagram per flow. Split the
   flow if it exceeds about 15 steps.

## Outputs

- A Mermaid sequence or flow diagram, with a step table:
  - step number;
  - participant and call;
  - sync or async;
  - evidence (`path:line`);
  - label.
- Notes on the asynchronous steps, transactions, retries, and failure
  branches, including the missing ones.
- A data-flow diagram, when requested: the stores, data classes, and trust
  boundaries.

## Technology considerations

| Stack | Where to trace |
|---|---|
| ASP.NET Core | Route to controller or minimal API handler, then MediatR or services, then `DbContext`, `HttpClient`, and the message publishers. Middleware order in `Program.cs` affects the flow. |
| Angular / React / Vue / Next.js / Nuxt | Component event, then service, hook, or composable, then the HTTP call. In SSR frameworks, server components and loaders run on the server, so show which side each step runs on. |
| Node (Nitro, Elysia) / Python (FastAPI, Django, Flask) | Route, then dependencies or middleware, then services, then the ORM or HTTP clients. Background tasks run after the response. |
| SQL Server / PostgreSQL | Triggers and cascades are hidden steps. Include them when the schema defines them. |
| Messaging (any broker) | The publish step and the consume step are separate in time. Show the broker as a participant. |

## Verification

- Every diagram step maps to a cited handler, call, or configuration line,
  or is labelled `inferred` or `unknown`.
- Every remote call shows its failure behaviour, or a marked gap.
- Asynchronous and synchronous steps are distinguished.
- A proposed (not yet built) flow is labelled proposed.

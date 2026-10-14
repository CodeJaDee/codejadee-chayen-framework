---
kind: recipe
capabilities: [CAP-11-001]
---
# Threat modeling

Build a threat model for a system or feature: what is worth protecting,
where untrusted input enters, which trust boundaries data crosses, what can
go wrong (STRIDE as a prompt), and which mitigations, with owners, reduce
the most risk. The model is advisory and is revisited when the design
changes.

## Inputs

- The architecture or feature description: components, data stores,
  external services, deployment, and the main user and system actors.
- Data sensitivity: personal data, credentials, payment data, business
  secrets.
- Existing controls: authentication, authorization model, network
  boundaries, and security tooling.

## Procedure

1. **Scope the model:** the feature or system boundary, and what is out of
   scope (for example the identity provider's internals).
2. **List the assets:** data, credentials, money movements, availability of
   critical functions, and reputation-sensitive operations.
3. **Draw the data flow** as a text or Mermaid diagram: actors, processes,
   data stores, external services, and the flows between them. Mark each
   **trust boundary** (internet to API, API to database, service to third
   party, browser to server, tenant to tenant).
4. **List the entry points:** routes, forms, uploads, webhooks, message
   consumers, scheduled jobs, admin tools, and configuration inputs.
5. **Enumerate threats per flow crossing a boundary,** using STRIDE as a
   prompt, not a quota:

   | Category | Question |
   |---|---|
   | Spoofing | Can someone act as another user or service? |
   | Tampering | Can data be changed in transit, at rest, or through input? |
   | Repudiation | Could a user deny an action we cannot prove? |
   | Information disclosure | Can data leak through responses, logs, errors, or side channels? |
   | Denial of service | Can input exhaust CPU, memory, storage, or quotas? |
   | Elevation of privilege | Can a user reach functions or data above their role or tenant? |

6. **Rate each threat** with likelihood and impact (High, Medium, Low) in
   this deployment, and explain the rating in one line.
7. **Choose mitigations:** existing controls first, then the gap, preferring
   controls that are enforced (framework authorization, parameterized
   queries, storage policies) over conventions. Assign an owner and a test
   or check per mitigation.
8. **Record residual risks** and the assumptions the model depends on.

## Outputs

- A data-flow diagram with trust boundaries and entry points.
- A threat table: ID, flow or component, threat, category, likelihood,
  impact, existing control, mitigation, owner, and verification.
- Residual risks and assumptions, labelled advisory.

## Technology considerations

| Stack | Consideration |
|---|---|
| ASP.NET Core | Authorization policies and fallback policy, Data Protection keys, anti-forgery for cookie authentication, request size limits (Kestrel `MaxRequestBodySize`). |
| Node servers (Nitro, Nuxt, Next.js, Elysia) | Server routes and Server Actions are public entry points. Body limits, schema validation, and SSRF in server-side fetches. |
| Python (FastAPI, Django, Flask) | Dependency-based authentication per router, Django middleware (CSRF, security), upload handlers and temp files. |
| Frontend (Angular, React, Vue) | The browser is untrusted: guards are user experience only. Token storage, XSS sinks, third-party scripts. |
| Data stores (SQL Server, PostgreSQL) | Least-privilege accounts, row-level tenant isolation, backups as a disclosure path. |
| File uploads (common seeded case) | Path traversal, content-type spoofing, malware, size and count exhaustion, public storage exposure, and authorization on download. |

## Verification

- For a seeded upload feature, the model includes path traversal, malware,
  size exhaustion, and authorization bypass threats, each with a mitigation.
- Every trust boundary crossing in the diagram has at least one threat row
  or an explicit "no threat identified" with a reason.
- Every mitigation has an owner and a test or check, and nothing in the
  model claims the system is secure.

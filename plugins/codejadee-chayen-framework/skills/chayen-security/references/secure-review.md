---
kind: recipe
capabilities: [CAP-11-002, CAP-11-006, CAP-11-007, CAP-11-008, CAP-11-009, CAP-11-011]
---
# Secure code review

Review application code for security weaknesses by combining the review
checklist with data-flow tracing from untrusted input to sinks. This recipe
covers the general review and five focused lenses: authorization,
input and output handling (injection), SSRF and egress, cryptography, and
logging. Findings are ranked, evidenced, and marked confirmed or suspected.

## Inputs

- The code scope (files, endpoints, a pull request) and the stack with
  versions.
- The authentication and authorization model, roles and policies, data
  ownership and tenancy rules.
- The deployment context: internet-facing or internal, network position
  (for SSRF), and data classification (for logging and crypto).

## Procedure

### General review (CAP-11-002)

1. **List entry points and sinks** in scope: routes, handlers, consumers,
   uploads, and the queries, HTML rendering, shell calls, file paths,
   redirects, outbound requests, deserializers, and logs they reach.
2. **Apply the review checklist** ([review-checklist.md](review-checklist.md))
   lens by lens, and the stack section of
   [stack-hardening.md](stack-hardening.md).
3. **Trace each untrusted input to its sinks,** noting the control on the
   path (validation, parameterization, encoding) or its absence.
4. **Record findings** with location, issue, scenario, severity, fix, and
   status (confirmed when the path is shown end to end, suspected
   otherwise), and list the areas not reviewed.

### Authorization (CAP-11-006)

1. **Build the matrix:** each endpoint or handler, the roles or policies
   required, the resource-ownership or tenant check, and the actual check
   found in code (`path:line`).
2. **Look for gaps:** missing authorization attributes, no fallback policy,
   object IDs from the route or body without an ownership check (IDOR),
   tenant ID taken from input instead of the authenticated context, admin
   functions protected only in the UI, and mass assignment of role or owner
   fields.
3. **Write an exploit scenario** per gap ("user A requests
   `/invoices/{B's id}` and receives B's invoice"), and propose the fix and
   a negative test (another user gets 403 or 404).

### Input and output handling (CAP-11-007)

1. **Trace per sink type:** SQL (parameterized or concatenated), HTML
   (encoded or raw), shell (argument arrays or strings), file paths
   (normalized and confined), redirects (allow-listed), deserialization
   (safe types only), regex (bounded), and logs (structured).
2. **Report each trace** as source, path, sink, missing control, and fix:
   parameterization, contextual encoding, or an allow-list. Validation
   alone does not replace output encoding.

### SSRF and egress (CAP-11-008)

1. **Find outbound requests** whose URL, host, or path comes from input:
   webhooks, URL previews, image proxies, import-from-URL, PDF renderers.
2. **Identify reachable internal targets:** loopback, private ranges,
   link-local cloud metadata (`169.254.169.254`, and IPv6 equivalents),
   internal service names, and non-HTTP schemes.
3. **Check the defences:** a host allow-list where possible; otherwise
   resolve the name, check every resolved IP against blocked ranges, and
   connect to the checked IP (to resist DNS rebinding); limit redirects and
   re-check each hop; restrict schemes and ports; set timeouts and size
   limits.
4. **Request egress controls** from the platform team (network policies,
   proxy allow-lists) as the enforcing layer.

### Cryptography (CAP-11-009)

1. **Inventory crypto usage:** encryption, hashing, signing, random number
   generation, password storage, TLS settings, and key loading.
2. **Flag weaknesses:** ECB mode, static or reused IVs or nonces,
   unauthenticated encryption where integrity matters, MD5 or SHA-1 for
   security, fast hashes (even salted SHA-256) for passwords, non-crypto
   random for tokens, hard-coded keys, disabled certificate validation, and
   custom crypto.
3. **Propose platform-library fixes:** AES-GCM or the platform's
   authenticated encryption, the framework's password hasher (or Argon2id,
   bcrypt, PBKDF2 with a current work factor), the cryptographic random
   generator, and keys from a key store.

### Logging (CAP-11-011)

1. **Search for sensitive data in logs:** passwords, tokens, cookies,
   authorization headers, connection strings, full request bodies, and
   personal data beyond what is needed.
2. **Check security events are logged:** sign-in success and failure,
   access denied, privilege and role changes, password and MFA changes,
   and admin actions, with user, time, source, and correlation ID.
3. **Check log injection defences:** structured logging with parameters,
   not string concatenation of user input, and encoding of newlines where
   text logs are used.
4. **Propose fixes:** redaction (logging filters, destructuring policies),
   structured fields, an event list, and restricted log access.

## Outputs

- A security review report: findings with severity, location, scenario,
  fix, and confirmed or suspected status; areas not reviewed; and
  recommended enforcing controls.
- An endpoint-by-endpoint authorization matrix with gaps, exploit
  scenarios, fixes, and suggested negative tests.
- Source-to-sink traces with the missing control and the fix.
- SSRF findings with reachable internal targets, and fixes (allow-list,
  resolved-IP checks, redirect limits) plus egress controls to request.
- Crypto findings with platform-library fixes.
- Logging findings (sensitive data, missing events, injection) with fixes.

## Technology considerations

| Stack | Consideration |
|---|---|
| ASP.NET Core | Fallback authorization policy, resource-based authorization, `FromSqlRaw` concatenation, `Html.Raw`, `Process.Start` with shell strings, `HttpClient` with user URLs, `PasswordHasher<T>`, `RandomNumberGenerator`, `AesGcm`, Serilog destructuring or redaction (`Microsoft.Extensions.Compliance.Redaction`). |
| Node servers | Missing auth middleware on routes, `child_process.exec`, template literals in SQL, `fetch` or `axios` with user URLs (check redirects), `crypto.randomBytes` versus `Math.random`, `bcrypt` or `argon2`, pino `redact`. |
| Python | Django `@login_required` and permission classes, FastAPI dependencies per router, raw `cursor.execute` with f-strings, `subprocess` with `shell=True`, `requests` with user URLs, `secrets` module, `passlib` or Django hashers, logging filters. |
| Angular, React, Vue | `bypassSecurityTrust*`, `dangerouslySetInnerHTML`, `v-html`, `javascript:` URLs, tokens in `localStorage`, secrets in public environment variables. |
| SQL Server, PostgreSQL | Dynamic SQL in procedures (`sp_executesql` with parameters, `format()` with `%I` and `%L`), row-level security for tenancy, least-privilege application accounts. |

## Verification

- The seeded SQL injection and IDOR in the fixture are reported with file
  and line, each with a test that would demonstrate it.
- Seeded injection, path traversal, and open redirect are each traced to
  their sink.
- The seeded URL-fetch endpoint is flagged, and the proposed fix blocks a
  `169.254.169.254` request in a test.
- Seeded ECB mode and an unsalted SHA-256 password hash are flagged with
  platform-library fixes, and a seeded log statement that writes a password
  is flagged and redacted.
- The report lists what was not reviewed and never claims the code is
  secure.

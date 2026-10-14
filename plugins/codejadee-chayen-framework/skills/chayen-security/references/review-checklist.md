# Security review checklist

This checklist is organized by common web application risk themes, aligned
with the OWASP Top 10 categories.

- Use it to structure the review. It is not exhaustive.
- A clean checklist does not prove the code is secure.

## Access control

- Every endpoint, server action, and message handler checks authentication
  **and** authorization on the server.
- Object-level checks: a user can only read or modify their own resources.
  Look for IDs taken from the route or body without an ownership check
  (IDOR).
- Deny by default. New endpoints are not public by accident. Check whether
  a fallback policy exists.
- Function-level checks: admin operations require an admin role or policy,
  not just a hidden UI element.
- CORS allows only the specific origins needed. Credentials are never
  combined with a wildcard or reflected origins.

## Injection

- **SQL:** parameterized queries everywhere. Dynamic identifiers come from an
  allow-list.
- **Command execution:** no shell invocation with user input. Use argument
  arrays, not string commands.
- **Path traversal:** user-supplied file names are normalized and confined
  to an allowed directory.
- **Templates and HTML:** output encoding is preserved. No raw HTML
  insertion of untrusted data (cross-site scripting).
- **Deserialization:** no polymorphic or unsafe deserializers on untrusted
  input (for example `pickle`, or `TypeNameHandling` other than `None`).
- **LDAP, XPath, NoSQL, or regex built from input:** escaped, or using
  safe APIs. Check user-supplied regex for catastrophic backtracking.

## Authentication and sessions

- Passwords are hashed with a dedicated password hasher (the framework's
  default, or Argon2/bcrypt/PBKDF2). They are never encrypted or hashed with
  a fast hash.
- Tokens:
  - signature, issuer, audience, and expiry are validated;
  - no `alg: none`;
  - refresh tokens are stored and rotated safely.
- Cookies:
  - `Secure` and `HttpOnly`;
  - an appropriate `SameSite`;
  - anti-forgery protection for cookie-authenticated, state-changing
    requests.
- Login, reset, and MFA flows have rate limiting or lockout. Error messages
  do not reveal whether an account exists, where that matters.

## Sensitive data and cryptography

- **Secrets** are not in source, config files committed to git, client
  bundles, logs, or error responses.
- **Transport:** TLS is enforced, with HSTS for browser apps.
- **Cryptography:** platform libraries only. No custom crypto, no ECB, no
  static IVs, keys from a key store.
- **Personal data** is minimized in logs and analytics. Fields are masked
  where they are displayed.

## Security misconfiguration

- Detailed errors and stack traces are disabled outside development.
- Security headers are appropriate for the app:
  - Content-Security-Policy;
  - `X-Content-Type-Options`;
  - frame protections.
- Debug endpoints, admin panels, and API documentation are not exposed
  publicly unless intended.
- Default credentials, sample accounts, and permissive dev settings are not
  shipped.

## Vulnerable and outdated components

- Dependency audit results are reviewed. Direct dependencies have no known
  critical or high advisories, or there is a documented reason.
- Lock files are committed. Versions are pinned through the lock file. No
  unmaintained packages for security-relevant functions.

## Integrity and supply chain

- CI workflows do not run untrusted code with secrets (for example
  `pull_request_target` combined with checking out pull request code).
- Third-party scripts loaded in the browser use integrity attributes, or
  are self-hosted.
- Update and plugin mechanisms verify their sources.

## Logging and monitoring

- Security-relevant events are logged without secrets:
  - authentication failures;
  - access denials;
  - privilege changes.
- Logs are protected against injection. Use structured logging, and escape
  user input written into logs.

## Server-side request forgery and outbound requests

- URLs fetched on behalf of users are allow-listed, or validated against
  internal ranges and metadata endpoints.
- Redirect targets are validated (no open redirects).

## Severity guide

| Severity | Typical example |
|---|---|
| Critical | Unauthenticated remote code execution, or SQL injection on an internet-facing endpoint, or full authentication bypass |
| High | IDOR exposing other users' data, stored XSS, or a leaked production secret |
| Medium | Missing CSRF protection on a state change, overly permissive CORS, or verbose errors leaking internals |
| Low | Missing hardening header, minor information disclosure |

Adjust the severity for context: exposure, data sensitivity, and
compensating controls. Explain any adjustment.

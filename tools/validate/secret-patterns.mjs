// Developer-only heuristic secret patterns (V-25.2), shared by check-security.mjs and the failure-case
// validator. Matching is heuristic: no match does not establish the absence of secrets. Never shipped.
export const SECRET_PATTERNS = [
  ["private-key", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ["aws-access-key", /\bAKIA[A-Z0-9]{16}\b/],
  ["github-token", /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})\b/],
  ["openai-token", /\bsk-(?:proj-)?[A-Za-z0-9_-]{40,}\b/],
];

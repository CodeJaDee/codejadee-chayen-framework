---
kind: checklist
---
# Fact-checking checklist for written output

Every statement in a document, PR description, release note, or review has
a source. Use this checklist before and after writing.

## Sources by statement type

| Statement | Verified source |
|---|---|
| A command to build, run, test, lint, or deploy | `package.json` scripts, project and solution files, `Makefile`, `pyproject.toml`, CI workflow files; or run in this session |
| A version or prerequisite | Manifests, lock files, `global.json`, `.nvmrc`, `engines`, `.python-version`, Dockerfiles |
| A configuration key or environment variable | Settings files, `.env.example`, options classes, configuration code |
| An endpoint, parameter, status code | The OpenAPI document, route definitions, controllers or handlers, DTOs |
| Behaviour ("the service retries three times") | Code with `path:line`, or a test that asserts it |
| A test, build, or benchmark result | A run in this session with the command and output, or a result the user supplied (attributed, with its date) |
| History and reasons ("we chose X because") | Commit messages, ADRs, issues, or the user (attributed) |
| People, owners, contacts | CODEOWNERS or the user, never guessed |

## Labels

- **verified:** a source above was checked or the command ran.
- **from the user:** supplied by the user, attributed.
- **unverified:** could not be checked. Shown with a marker in the
  document, and listed in the output for follow-up.

Do not remove the unverified marker by rewording the statement more
confidently.

## Before publishing

- Each command exists in the repository or ran successfully, and stale
  commands were removed or corrected.
- File paths, links, and anchors resolve.
- Code samples compile or match real signatures.
- Test, build, or performance results come from runs that actually
  happened, with the command; otherwise the text says "not run".
- No secrets, tokens, internal hostnames that should not be shared, or
  personal data appear.
- The document says when it was last verified, if the repository's style
  includes dates.

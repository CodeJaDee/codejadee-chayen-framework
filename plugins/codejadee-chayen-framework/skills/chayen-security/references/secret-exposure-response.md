---
kind: recipe
capabilities: [CAP-11-005]
---
# Secret exposure response

Respond to exposed or hard-coded secrets without spreading them further:
find them without echoing values, rotate first (removing a secret from code
does not make it secret again), move secrets to configuration and a secret
store, and decide on history cleanup with explicit approval.

## Inputs

- The repository, or the known leak: what was exposed, where, and since
  when.
- Secret types (API keys, passwords, connection strings, private keys,
  tokens) and where each is used in deployed environments.
- The configuration and secret-store mechanism the application already
  uses.

## Procedure

1. **Search without printing values.** Use the project's secret scanner if
   present (gitleaks, trufflehog, detect-secrets, GitHub secret scanning
   results), or targeted searches for key patterns, connection strings,
   and private key headers. Show only the location, the type, and a masked
   form (for example the first four characters).
2. **Check the history** for the same secrets (`git log -p -S` on a masked
   fragment, or the scanner's history mode). A secret removed from the
   current tree is still in history and in every clone.
3. **Rotate first.** For each confirmed secret, list the owner, the system
   that issues it, and the rotation steps. Rotation and revocation are done
   by the owner; the code change does not replace it. Note whether the
   provider's logs show misuse.
4. **Remove from code:** load the value from configuration (environment
   variables, user-secrets locally, a key vault or secret manager in
   deployed environments), and add the file pattern to `.gitignore` where a
   local file was committed.
5. **Decide on history cleanup** with the user: rewriting history (`git
   filter-repo`, BFG) needs explicit approval, coordination with every
   collaborator, and a force push. It does not help if the secret was
   already rotated, except for hygiene.
6. **Recommend enforcing controls:** secret scanning with push protection,
   a pre-commit hook, and CI scanning.

## Outputs

- Findings with masked values, locations, and types.
- A rotation-first plan per secret, with owners.
- The code change that loads each secret from configuration.
- A history-rewrite decision for approval, and recommended controls.

## Technology considerations

| Stack | Consideration |
|---|---|
| .NET | `dotnet user-secrets` for local development, environment variables or Azure Key Vault (`AddAzureKeyVault`) in deployed environments. Committed `appsettings.*.json` values are the usual leak. |
| Node and frontend | `.env` files must be ignored. `NEXT_PUBLIC_*`, `VITE_*`, and Nuxt `runtimeConfig.public` values are public by design: a secret there must move to the server. |
| Python | Environment variables through `pydantic-settings` or `django-environ`, or a secret manager. `.env` stays out of git. |
| CI and containers | Secrets in CI variables or the secret store, never in workflow files, Dockerfiles (`ENV`, `ARG`), or image layers. BuildKit secret mounts for build-time secrets. |

## Verification

- In a fixture with a seeded key, the value is never printed: only its
  location, type, and masked form.
- Rotation is listed before removal and history cleanup.
- No history rewrite or force push happens without approval.
- The code loads the secret from configuration, and the build or tests
  pass, or are NOT_RUN with the reason.

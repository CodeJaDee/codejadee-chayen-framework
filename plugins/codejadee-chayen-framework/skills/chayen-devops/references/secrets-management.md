---
kind: recipe
capabilities: [CAP-13-008]
---
# Secrets management

Store application secrets in a secret store, read them at runtime through
identities with least privilege, give developers a local mechanism that
never touches git, give pipelines secrets without exposing them in logs,
and plan rotation. Responding to a secret that already leaked belongs to
the security skill.

## Inputs

- The secrets in use (connection strings, API keys, certificates, signing
  keys) and where each is used.
- The hosting platform and secret store available (Azure Key Vault, AWS
  Secrets Manager, Google Secret Manager, HashiCorp Vault, Kubernetes
  Secrets with an external secrets operator).
- How secrets are stored and passed today, and the CI platform.

## Procedure

1. **Inventory secrets by name and location,** never by value: which
   configuration key, which environments, who issues it, and its rotation
   period.
2. **Design access:** one store (or vault per environment), access through
   workload or managed identity, read-only roles scoped to the secrets the
   application needs, and separate stores or prefixes per environment.
3. **Change the code to read at runtime** through the configuration
   system, without logging values. Fail fast with a clear message when a
   secret is missing (naming the key, not the value).
4. **Local development:** the platform's user-secrets mechanism or a
   git-ignored file, an `.env.example` or settings template with
   placeholders, and developer access to a development store if the team
   uses one.
5. **CI and CD:** platform secrets or a store linked to the pipeline,
   OIDC federation instead of stored cloud keys, masking enabled, and no
   `echo`, `set -x`, or environment dumps.
6. **Plan rotation:** how each secret is rotated, whether the application
   reloads it without restart, and a schedule. Prefer identities that need
   no secret.
7. **Remove literals** from code and committed configuration, and point to
   the security skill's exposure response if any were real secrets.
8. **Do not create stores, grant roles, or set secret values yourself.**
   Hand those steps to someone with access, after approval.

## Outputs

- A secret storage and access design with identities and rotation.
- Code and pipeline changes that read secrets at runtime, never printing
  them, plus local development instructions.

## Technology considerations

| Stack | Consideration |
|---|---|
| ASP.NET Core | `dotnet user-secrets` locally, `AddAzureKeyVault` with `DefaultAzureCredential` in Azure, options validation on startup, `IOptionsMonitor` for reload. |
| Node servers | Environment variables from the platform or a store SDK, a git-ignored `.env` locally, and no secrets in `NEXT_PUBLIC_*`, `VITE_*`, or Nuxt public runtime config. |
| Python | `pydantic-settings` or `django-environ`, store SDKs (`azure-keyvault-secrets`, `boto3`), and a git-ignored `.env` locally. |
| Kubernetes | External Secrets Operator or the CSI secrets store driver, instead of committed Secret manifests with base64 values. |
| CI platforms | GitHub environment secrets with OIDC, Azure Pipelines variable groups linked to Key Vault, GitLab protected masked variables. |

## Verification

- After the change no secret literal remains in the fixture repository,
  checked by a search for the known keys and patterns.
- Local development uses the platform's user-secrets mechanism or an
  ignored file, and the template contains no real values.
- No secret value appears in the output, and no store, role, or secret
  value was changed by the agent.
- Each check is reported PASS, FAIL, or NOT_RUN with the command used (for
  example the search command and the build or test run).

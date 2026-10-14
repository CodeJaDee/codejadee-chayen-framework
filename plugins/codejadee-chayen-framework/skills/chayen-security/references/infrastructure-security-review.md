---
kind: recipe
capabilities: [CAP-11-013]
---
# Container and infrastructure-as-code security review

Review the Dockerfiles, Kubernetes manifests or Helm charts, and Terraform
or Bicep files in the repository for security misconfiguration, read-only.
Report each finding with file and line, risk, and fix, and run static
scanners on the files when allowed. Nothing is applied to a cluster or
cloud account.

## Inputs

- The container and IaC files in scope, and the deployment target
  (Kubernetes distribution, cloud provider).
- The environment the files describe (development, production) and the
  data sensitivity of the workloads.
- Scanners already used in CI (Trivy, Checkov, tfsec, KICS, Hadolint,
  kube-score), if any.

## Procedure

1. **Inventory the files** and what they deploy. Do not connect to
   clusters or cloud accounts: review the files only.
2. **Review Dockerfiles:**
   - the final stage runs as a non-root `USER`;
   - pinned base images (a tag, preferably a digest) from trusted sources;
   - multi-stage builds so compilers and source do not ship;
   - no secrets in `ENV`, `ARG`, copied files, or layers;
   - minimal packages, and no `curl | sh` from unpinned sources.
3. **Review Kubernetes manifests and Helm values:**
   - `securityContext`: `runAsNonRoot`, `allowPrivilegeEscalation:
     false`, `readOnlyRootFilesystem`, dropped capabilities, no
     `privileged`;
   - no `hostPath`, `hostNetwork`, or `hostPID` without a reason;
   - resource requests and limits;
   - secrets from Secret objects or an external secrets operator, not
     plain values;
   - NetworkPolicies, service exposure (`LoadBalancer`, `NodePort`,
     Ingress), and RBAC least privilege for service accounts.
4. **Review Terraform or Bicep:**
   - public exposure: storage public access, `0.0.0.0/0` inbound rules,
     public IPs and endpoints on databases;
   - encryption at rest and in transit, minimum TLS versions;
   - identity: least-privilege roles, no wildcard actions, managed
     identities instead of keys;
   - logging and diagnostic settings for security-relevant resources;
   - secrets: no plain values in variables, outputs, or state files
     committed to the repository.
5. **Run static scanners on the files** when allowed (for example
   `trivy config .`, `checkov -d .`, `hadolint Dockerfile`), triage their
   output with the scanner triage approach, and report NOT_RUN otherwise.
6. **Report findings** with file and line, the risk in this deployment,
   the fix, and severity. Ask before editing infrastructure files.

## Outputs

- Findings with file and line, risk, and fix.
- Scanner suggestions with commands, run or NOT_RUN, and the triaged
  results.

## Technology considerations

| Stack | Consideration |
|---|---|
| Dockerfiles for .NET | Microsoft's images include a non-root `app` user from .NET 8 but still start as root unless the Dockerfile sets `USER $APP_UID`. Chiseled or distroless images reduce the surface. Publish in a build stage. |
| Dockerfiles for Node and Python | Official images include a `node` user; Python images need a created user. Install dependencies from lock files (`npm ci`, `pip install --require-hashes` if used). |
| Kubernetes and Helm | Pod Security Standards (`restricted` profile) as the reference. Check rendered output (`helm template`) rather than templates alone. |
| Terraform | Review plans and modules; state files may contain secrets and must not be committed. Provider-specific public access flags (for example storage account `public_network_access_enabled`, S3 public access blocks). |
| Bicep | Resource properties such as `allowBlobPublicAccess`, `minimumTlsVersion`, `publicNetworkAccess`, and Key Vault references for secrets. |

## Verification

- A seeded root user and a public storage bucket in the fixture are both
  reported with file and line.
- Scanner commands are run on the files and reported, or NOT_RUN with the
  reason.
- No cluster or cloud account was contacted, and no infrastructure file was
  changed without approval.

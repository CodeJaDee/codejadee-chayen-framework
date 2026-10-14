---
kind: recipe
capabilities: [CAP-13-006]
---
# Infrastructure as code

Write or change infrastructure as code (Terraform, Bicep, Pulumi,
Kubernetes manifests, Helm) following the repository's modules, naming,
and state handling, and show a plan or what-if for review. Applying is a
separate step that a person with access runs after approval.

## Inputs

- The target resources and their settings, and the environments they are
  for.
- The existing IaC: modules, naming and tagging conventions, variable and
  parameter files per environment, the state backend, and the pipeline that
  applies it.
- Constraints: regions, network layout, identity model, and cost limits.

## Procedure

1. **Find the pattern:** an existing module or manifest for a similar
   resource. Reuse modules rather than writing raw resources beside them.
2. **Write the change** with the conventions: names from the naming
   module or pattern, required tags, environment-specific values in
   variable or parameter files (not hard-coded), and outputs other modules
   need.
3. **Secure defaults:** private networking where the project uses it, no
   public access unless intended, encryption settings, managed identities,
   and secrets referenced from the secret store (never as plain variables
   or outputs).
4. **Validate locally:** format and validate (`terraform fmt` and
   `validate`, `az bicep build` and `lint`, `helm lint` and `template`,
   `kubectl apply --dry-run=client`).
5. **Produce the plan** (`terraform plan`, `az deployment group what-if`,
   `pulumi preview`, `kubectl diff`, `helm diff`) only with credentials the
   user provided. Otherwise mark it NOT_RUN and give the command.
6. **Read the plan for danger:** any destroy or replace of stateful
   resources (databases, storage, volumes, key vaults), changes to network
   exposure, and identity or role changes. Stop and ask about each.
7. **Hand over the apply:** the command or pipeline run, the environment,
   and the rollback (revert the change and apply, or restore), for the user
   or the pipeline to execute after approval.

## Outputs

- IaC changes following existing modules and naming.
- Plan or what-if output for review, with dangerous changes called out;
  apply only with approval.

## Technology considerations

| Stack | Consideration |
|---|---|
| Terraform | Module versions pinned, `required_providers` constraints, remote state with locking, `moved` blocks for refactors instead of destroy and create, `lifecycle { prevent_destroy = true }` on stateful resources where the project uses it. |
| Bicep | Modules with parameter files (`.bicepparam`), `existing` references, `what-if` before deployment, deployment scope (resource group, subscription). |
| Pulumi | The project's language SDK, stack configuration with secrets encrypted by the provider, `pulumi preview` for review. |
| Kubernetes manifests and Kustomize | Base and overlays per environment, labels and selectors consistent, resources and probes set, `kubectl diff` for review. |
| Helm | Values per environment, `helm lint`, `helm template` to review rendered output, chart version bumps, and `helm diff` with access. |

## Verification

- Validate or plan runs cleanly on the fixture, or plan is NOT_RUN without
  credentials, and no apply was executed.
- Every destroy or replace of a stateful resource in the plan is called
  out and approved, or the change is redesigned.
- New resources follow the naming and tagging conventions cited from
  existing code.

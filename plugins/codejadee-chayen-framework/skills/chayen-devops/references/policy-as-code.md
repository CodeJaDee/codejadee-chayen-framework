---
kind: recipe
capabilities: [CAP-18-004]
---
# Policy as code

Write and test policy-as-code rules that check configuration and
infrastructure as code in CI (OPA and Rego with Conftest, Kyverno, Azure
Policy, or the engine the project uses), each with passing and failing
examples, and wire them into the pipeline. Policies in CI enforce; the
agent's review of them does not.

## Inputs

- The policy intent in plain language (for example "containers must not run
  as root", "storage must not be public").
- The target configuration format (Kubernetes manifests, Helm output,
  Terraform plan JSON, Bicep or ARM templates, Dockerfiles).
- The policy engine and CI platform already in use, and how exceptions are
  granted.

## Procedure

1. **Restate each rule** precisely: the resource types, the property, the
   allowed values, and the exception mechanism (a label, an annotation, or a
   waiver record).
2. **Write the policy** in the engine's language, with a clear denial
   message that names the resource and the fix.
3. **Write unit tests** for allow and deny cases, from real files in the
   repository and minimal synthetic examples: at least one compliant and one
   non-compliant input per rule.
4. **Run the tests locally** (`opa test`, `conftest verify`, Kyverno CLI
   tests) and record the result.
5. **Evaluate against the repository's files** (`conftest test` on rendered
   manifests or a Terraform plan in JSON) and report violations found
   today, without editing those files unasked.
6. **Wire into CI** as a step that fails on violations, with a report
   output; agree with the team whether to start in warn mode.
7. **Document exceptions:** how a waiver is requested, who approves it, and
   its expiry. The agent never grants a waiver.

## Outputs

- Policy code with unit tests for allow and deny cases.
- A CI step to evaluate policies, with the observed result.

## Technology considerations

| Stack | Consideration |
|---|---|
| OPA, Rego, Conftest | `deny contains msg if { ... }` rules (Rego v1 syntax in recent OPA versions), `opa test` for unit tests, `conftest test --policy policy/` on YAML, JSON, Dockerfiles, and Terraform plan JSON (`terraform show -json`). |
| Kyverno | `ClusterPolicy` with `validate` rules, `kyverno test` with resource fixtures, audit before enforce mode. |
| Azure Policy | Policy definitions in Bicep or JSON, assignment is a platform change owned by the cloud team; test with `what-if` and compliance scans in a test subscription. |
| CI | Run policies after rendering (`helm template`, `terraform plan`) so they see the real configuration. |

## Verification

- The policy denies the fixture's root-user manifest and allows the
  compliant one, shown by policy tests.
- Policy tests run locally with the recorded command, or NOT_RUN with the
  reason.
- No policy assignment or exception was applied to a live environment by
  the agent.

# STEP 29 static workflow validation

Date: 2026-10-15 (Asia/Bangkok). Runtime: Node 24.15.0, Windows.
Scope: 12 workflow checklists and seven reusable template leaves, reached
through existing entry skills. No workflow engine or provider was executed.

| Check | Exact command | Observed result |
|---|---|---|
| Generate workflow coverage | `node tools/catalog/check-workflows.mjs --write-doc` | PASS, exit 0; V-24.1..6 |
| Check workflow coverage | `node tools/catalog/check-workflows.mjs` | PASS, exit 0; 12 workflows, seven templates, 47 evaluation specifications |
| Approval negative-control smoke | `node tools/validate/run-validator-tests.mjs --only wf29-approval-control` | PASS, exit 0; four validator baselines and one mutation, 5/5. Removing the approval guard produced ERROR V-24.3 anatomy and exit 1 as expected. |
| All automated gates | `node tools/validate/validate-all.mjs` | PASS, exit 0; six gate groups, 132/132 validator tests (four baselines plus 128 negative controls, including 16 new workflow mutations) |
| Engineering regression audit | `node tools/catalog/audit-coverage.mjs` | PASS, exit 0; 206/206 capabilities pass ten static criteria; 0 VERIFIED |
| Technology regression | `node tools/catalog/check-technology.mjs` | PASS, exit 0; 108 capabilities, 295 specifications; coverage synchronized |
| Package, references, budgets | `node tools/validate/validate-package.mjs` | PASS, exit 0; 221 reference files reachable within two hops; 13 skills, L0 5,485/5,500; 117 capability recipes and 445 recipe cases unchanged |
| Whitespace | `git diff --check` | PASS, exit 0 |

The six gate groups are package/skills/references, engineering catalog,
technology catalog, composite workflows/templates, trigger case synchronization,
and validator self-tests. Trigger synchronization reports 182 cases/433 files;
it does not execute a trigger evaluation.

V-24 verifies inventory, owner-local paths, implemented recipe reuse,
conditional technology pack identities, ordered substantive workflow sections,
stage inputs/actions/exit checks, real-approval controls, proportionality,
blockers, evidence defaults, template leaves, evaluation mappings and generated
coverage. Negative controls exercise broken identities/owners/paths/recipes,
unknown packs, missing routing/control/exit sections, approved-by-default
templates, accepted-by-default ADRs, template links, mismatched cases and stale
coverage. This remains static structure/content validation.

Acknowledged warnings: backend SKILL.md 211 lines, frontend 215,
implementation 208, each above the 200-line target and below the 300-line hard
limit. L0 metadata and descriptions are unchanged. Existing maintainer Node 18
compatibility mismatch remains open as R-50; no Node 18 compatibility is claimed
from this Node 24 run.

## NOT_RUN

- All 47 workflow/template native-agent evaluations and provider-specific
  routing/handoff checks; no model transcript was produced (R-51).
- Native-provider installation/lifecycle, runtime engineering scenarios,
  application builds, database changes and external integrations. The change
  consists of static instructions/formats and developer-only validation.
- STEP 28's 52 unexecuted facts and frontend/provider gaps were not rerun or
  relabelled. Its historical results remain separately recorded and PARTIAL.

No approval, release, deployment, publication or real consumer migration was
performed or inferred. Templates and go/no-go recommendations do not authorize
those actions. Workflow content is IMPLEMENTED, not behavior-VERIFIED.

# Phase 3: CI/CD design and local evidence

Date: 2026-10-18. Base: `91a61dfd59a62f51c3c906ca7deb10d3ad531945` (`main`,
clean at start). Phase 1 contract and Phase 2 product hardening are preserved.
This phase implements validation and documentation only; it does not start
candidate freeze, runtime evaluation or publication.

## Workflow and toolchain

[validate.yml](../../.github/workflows/validate.yml) runs for every `push`
and `pull_request`, without branch/path exclusions. It requests only
`contents: read`; checkout does not persist credentials. No secrets, provider
binaries, native installs, model calls, releases or repository settings are
used. PRs run without a privileged `pull_request_target` context.

| Job | Work |
|---|---|
| Package, identity, documentation and workflow preflight | Static security, package/manifests/Skills/references, identity parity, upstream MIT/scope, docs, isolated failure controls and actionlint |
| Offline validation / Node 20.11.0 | All existing offline gates, mutations, scorer/Thai regressions and static evaluation traceability |
| Offline validation / Node 24.22.0 | The same mandatory checks on the current LTS line |

The matrix waits for preflight and has `fail-fast: true`. No mandatory step
uses `continue-on-error`, `|| true` or a conditional success fallback.
`validate-all --fail-fast` and `run-evaluation-suite --fail-fast` stop on a
defect, print diagnostics and mark remaining checks NOT_RUN. Default local
aggregate behavior still collects failures except for the security preflight.
Timeouts bound each job and validator subprocess. Concurrency cancels an
older superseded run for the same workflow/ref; cancellation is not PASS.

Pinned action commits and tool versions are recorded in
[toolchain.json](../../tools/ci/toolchain.json). Checkout v5 and setup-node v6
are referenced by full commit SHA, with package-manager caching disabled.
The action runtime is separate from the Node version executing repository
checks. Node 20.11.0 preserves the declared compatibility floor; Node 20 is
EOL and is not the recommended maintainer runtime. Node 24.22.0 is the pinned
LTS baseline. Updates to versions/hashes require source review and revalidation.

## Deterministic checks and dependencies

Repository validators require no npm dependencies. There is no root
package installation, lockfile bootstrap, lifecycle script execution or
downloaded provider CLI. Test fixture package files are data and are not
installed. Offline validation uses only checked-out files and disposable
local fixtures; synthetic outputs never count as provider evidence.

The workflow linter is the one additional maintainer tool:
`node tools/ci/check-workflow.mjs` downloads actionlint 1.7.12 from its official
release, verifies a pinned SHA-256 before extraction/execution, and cleans
its temporary directory. Linux x64 and Windows x64 archives have separate
hashes. Download/checksum/extraction/lint failure is fatal. No `curl | sh`,
unpinned `npx`, credential forwarding or repository dependency writes occur.
Shellcheck/pyflakes are disabled so both platforms run the same GitHub Actions
syntax/expression checks; repository Node scripts supply the actual validation.
Setup-node/actionlint downloads need network access; the repository test
phase makes no network or provider calls.

| Concern | Existing check reused |
|---|---|
| Package/manifests/Skill metadata/references | `validate-package.mjs` through preflight and `validate-all.mjs` |
| Marketplace parity | `tests/provider-compatibility/check-identity.mjs` |
| Engineering/technology/workflow catalogs | `check-catalog.mjs`, `check-technology.mjs`, `check-workflows.mjs` |
| Docs links, identifiers, versions and measured build facts | `check-docs.mjs` and documentation mutation tests |
| Security boundaries | `check-security.mjs`, `tests/security/boundaries.test.mjs` |
| Thai numerals/calendar eras and scorer | Numeric regression tests and `score-step40.mjs --self-test` |
| MIT upstream notice | `check-hardening.mjs` plus removal/alteration controls |
| Existing mutations/lifecycle isolation | Existing validator and Phase 2 test suites; all offline |
| Static evaluation coverage/handoffs | `run-evaluation-suite.mjs`; no provider summaries supplied |

The evaluation suite also repeats aggregate validation and emits a labelled
lexical SIM diagnostic. That extra run costs time but keeps its standalone
contract intact; no bypass flag or fabricated cached PASS is introduced.
The SIM result is not the >=85% automatic-routing release gate.
Native `claude plugin validate --strict` remains a separate authorized check
when the CLI is available; it is not installed by ordinary CI.

## Failure demonstrations

`node --test tests/ci/negative-controls.test.mjs` copies reviewed inputs to
scratch and first verifies a clean baseline. It reuses existing mutation
specifications for an invalid manifest (`V-02 agent-plugins-manifest`) and
a dangling Skill reference (`V-08 links`). Removing the notice must return
exit 1 with `H-LICENSE`. Expected nonzero exits pass a negative control only
when the matching diagnostic exists. Source-file hashes remain unchanged.
The workflow is never demonstrated by intentionally breaking the branch.

## Local evidence and remote status

<!-- PHASE3_RESULTS -->
Final local results are being recorded.
<!-- /PHASE3_RESULTS -->

**Remote GitHub Actions: NOT_RUN.** No run URL/ID is available or claimed.
After separate commit/push authorization, observe preflight and both matrix
jobs for the exact pushed SHA and record their run URL, conclusion and logs.
An actual remote failure/cancellation is not overridden by local evidence.
Fork/organisation workflow approval or Actions availability may require the
owner's later action; no settings are modified here.

Branch Protection and Required Reviews remain deferred under AR-03.
Unprotected `main` is an accepted release-process risk; the compensating
release procedure is [manual sign-off](MANUAL_RELEASE_SIGNOFF.md), not an
unapproved required-check configuration. Response Style Policy host tests,
VS Code runtime tests and unrelated ADR/hygiene work remain deferred.
Security/Support is LATER, with no contact selected; it does not block Phase 3
implementation. The scoped release contract still governs later publication.

## Primary references reviewed

- [GitHub Actions secure use](https://docs.github.com/en/actions/reference/security/secure-use): least privilege and full-SHA action pinning.
- [Checkout action](https://github.com/actions/checkout) and [setup-node inputs](https://github.com/actions/setup-node): credentials, Node selection and caching.
- [Node release schedule](https://github.com/nodejs/Release/blob/main/schedule.json) and [Node downloads](https://nodejs.org/dist/index.json): compatibility floor, EOL and LTS distinction.
- [actionlint 1.7.12](https://github.com/rhysd/actionlint/releases/tag/v1.7.12): official binary/checksum provenance.

<!-- PHASE3_FILES -->
Final changed-file inventory is being recorded.
<!-- /PHASE3_FILES -->

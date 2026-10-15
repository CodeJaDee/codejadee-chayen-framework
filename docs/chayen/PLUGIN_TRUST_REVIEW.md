# Plugin Trust Review

STEP 30, 2026-10-15. **Static review and hardening completed, pending independent
review.** No claim of native-agent safety, organizational enforcement, release
approval or vulnerability-free dependencies follows from this review.

Baseline: clean `main`, HEAD `705ad1b` before STEP 30. The agent made no commit,
push, install, release, external marketplace change or provider/model call.
The requested security work authorizes the local changes in this step; no
approval for any later external/destructive action is inferred or recorded.

## Coverage and method

The review combines whole-file offline inventory/pattern scanning with contextual
inspection of authority, approval, verification, script effects and trust paths.
It is not a manual line-by-line certification of every recipe or a penetration
test. Source text and tool output were treated as data; no embedded repository
instruction was executed merely because the repository requested it. Developer
scripts/imports and execution/write/delete/network sites were inspected before
the validators were run. Scripts are trusted maintainer code only after that
review, not safe because a file calls itself a validator.

| Surface | Scope and observed result |
|---|---|
| Portable manifest | `plugins/codejadee-chayen-framework/plugin.json`; metadata only, version `0.1.0-dev`, schema URI; no extensions, permissions, hooks or dependency declaration. V-02/V-04/V-25 PASS. |
| Provider manifest | `plugins/codejadee-chayen-framework/.claude-plugin/plugin.json`; matching identity and metadata, no runtime/configuration component fields. V-03/V-04/V-25 PASS. |
| Marketplaces | `.claude-plugin/marketplace.json`, `.github/plugin/marketplace.json`, `.agents/plugins/marketplace.json`; one local source each, resolving to `./plugins/codejadee-chayen-framework`. V-01/V-25.4 PASS. |
| Every entry | All 13 `skills/chayen-*/SKILL.md`: ai-engineering, architecture, backend, data, devops, documentation, frontend, implementation, performance, repository, requirements, security, testing. Priority and least-privilege clauses hardened in each. Descriptions unchanged; L0 5,485/5,500. V-05..V-10/V-17/V-25 PASS. |
| Every reference/template | All 221 references: 117 recipes, 76 technology references, 20 checklists, eight templates. Whole-file scan and kind/hash inventory; all reference links/anchors resolve skill-locally within two hops (V-08), valid anatomy (V-18), mapping/case checks (V-19/V-22/V-23/V-24). Workflow/approval templates inspected contextually. |
| Other packaged text | Both remaining Markdown files, including README guidance; total 236 Markdown + two JSON files = 238. No shipped executable assets, links to an external runtime requirement or installed hooks found by the static profile. |
| Developer code/dependency assets | 57 inventoried sources under tools/tests, including the eval generator, all validators/helpers, optional runners and C#/Python fixtures. SHA-256 and effect signals recorded. Generated evals/results/dependency/build folders excluded from this code inventory; the 433 committed eval fixture files are separately checked for synchronization. |
| External links | Eleven valid URL literals in package content/metadata, including seven loopback/example URLs and four external documentation/identity URLs; syntax/userinfo check only. No fetch, installation or remote dependency resolution. |
| Optional dependencies | 31 direct NuGet/Python fixture declarations inventoried. Validators use Node built-ins and relative repository imports; no tool package installation required or executed. Native CLIs/SDKs/database/browser tooling are external optional prerequisites. |

Per-file evidence, methods and hashes are in
[step30-static-review.json](../../tests/security/results/step30-static-review.json).
The inventory includes every shipped path, so unchanged references are covered
without implying that every semantic claim or application API was retested.

## Manifest, marketplace and link trust

The manifests declare no plugin runtime or authentication service. Codex's
marketplace contains `policy.installation = AVAILABLE` and
`policy.authentication = ON_INSTALL` ([metadata:17](../../.agents/plugins/marketplace.json#L17)).
Those existing fields were not altered or interpreted as actual user approval.
Their current native authentication/UI effects are **UNVERIFIED / NOT_RUN** in
STEP 30. There is no packaged credential input, app connection or tool server;
static guidance requires no credentials. If a native provider requests access,
review it through that provider's authorized process or leave installation/tests
NOT_RUN; do not ask users to submit credentials to the plugin.

The four external URL literals identify the Agent Plugins schema, CodeJaDee's
GitHub author/repository, and an IETF HTTP reference. They are references, not
executed dependencies, trust anchors, proof of author identity, or permission to
upload data. The seven `localhost`/`.localhost` literals are examples and test
origins (including an adversarial-origin example), not telemetry destinations.
No live URL reachability, redirect, domain ownership, current schema download,
provider documentation refresh or malicious-link reputation check was executed.
Catalog/package checks validate paths and reimplemented schema rules locally;
they do not prove native provider acceptance for a current installed version.

No signature verification, release attestation, remote marketplace update or
installed-cache integrity review was performed. Pin/review the intended source
revision and repeat the diff/content review for updates. A hash generated by
this checkout identifies the scanned text; it is not independent provenance.

## Findings and local remediation

| ID | Finding before hardening | Change and evidence | Remaining limit |
|---|---|---|---|
| S30-01 | All 13 entries put explicit user instructions first without the system/developer/native boundary. | Replaced precedence and added common least-privilege/script inspection/no approval promotion rules. V-25.3 validates every entry. | Model adherence NOT_RUN; strings can coexist with future conflicting prose. |
| S30-02 | Eval staging recursively removed an existing operator-supplied destination. | Fresh-child creation; reject existing child and linked source; safe plugin/case IDs and no staging under shipped plugins. Sentinel-preservation and fresh-copy tests PASS. `tools/evals/generate-claude-evals.mjs:115`. | Concurrent directory replacement remains possible; use disposable scratch with controlled ACLs. |
| S30-03 | Mutation file/copy paths from JSON were joined without confinement. | Central `inside`/`safeId`, linked-source rejection, dedicated mkdtemp roots and checked cleanup; validators invoked from a fixed map without a shell, bounded subprocess time. `tools/validate/run-validator-tests.mjs:32,53,106`. | Declarative regex mutations remain trusted fixture data; this is not a hostile-input resource sandbox. |
| S30-04 | Restricted YAML maps accepted prototype-sensitive keys. Eval category/skill strings could inject grader metadata or widen match patterns. | Reject `__proto__`, `constructor`, `prototype`; allow-list categories and declared safe skill IDs before generating any file. Offline block/flow map and metadata injection controls PASS. `tools/catalog/catalog-lib.mjs:53,81`; generator:35. | Restricted parser is not a general YAML implementation; prompt text remains data whose model effect is untested. |
| S30-05 | Optional lifecycle runner deleted its supplied work directory and could continue after setup failure. | Remove deletion, require explicit opt-in and fresh outside-repo path, reject linked installation sources, stop on copy/fixture/cd failure. `tests/provider-compatibility/run-lifecycle.sh:12`. Bash syntax check PASS. | No native lifecycle path executed. Native cache/account/network behavior is not isolated by shell variables alone. |
| S30-06 | Model runner could call providers without a dedicated opt-in, accept permission-changing extra args, use implicit directories and copy misleading setup advice. | Require `--allow-provider-calls`, explicit empty outside-repo fixture, fresh output, explicit provider home, safe IDs; reject argument overrides; remove no-ask flag and routine trust-bypass/real-home/auth-copy documentation. `tests/routing/run-smoke.mjs:29`; README revised. | Missing-opt-in refusal PASS without any provider invocation. Allowed path, billing, native permission controls, account isolation and Windows ACLs NOT_RUN. Environment remains inherited and raw transcripts need review. |
| S30-07 | Package manifest/reference reads could occur before linked-tree rejection. Static package/authority assumptions lacked dedicated security controls. | Validate package tree before manifests; add V-25 metadata/authority/secret/path profile as first aggregate gate and 32 offline regressions. Preflight failure stops later gates. `tools/validate/validate-package.mjs:24`; aggregate:15. | Repository authors can alter their own checks; no protection against malicious validator code or host races. |
| S30-08 | Action-risk guidance treated builds/tests as routine reversible actions without inspecting their scripts. | Agent governance explicitly requires reviewing scripts, lifecycle hooks, targets and dependency effects. Packaged README now explains trust/installation/permission limitations. `agent-governance.md:40`. | No actual repository build is made safe by this prose; native/OS/CI restrictions remain necessary. |
| S30-09 | Raw JSON/parser diagnostics can echo malformed input, including a secret value. | V-25 and the package validator suppress raw parser diagnostics; V-25 scans package/marketplace/catalog/developer source data for selected secret patterns. A malformed synthetic token/JSON test verifies that diagnostics omit the value. | Other tool/native error streams may still contain sensitive data; all logs need review/redaction. Pattern coverage is incomplete. |

No always-on executable hook, background worker, telemetry, credential collection,
external source/prompt upload, runtime dependency, scheduler or workflow engine
was added. Optional scripts remain developer-only and manually invoked.

## Developer scripts and optional executable assets

| Group | Inspected behavior and execution boundary | STEP 30 execution |
|---|---|---|
| V-25 and safe-path helpers | Read static sources, compute hashes, parse restricted data; optional fixed-path JSON report write. No child commands or network. | Executed; static PASS. |
| Package/catalog/workflow validators and coverage auditor | Read source/catalog/cases and compare structures; coverage writers are explicit fixed-document options. Aggregate invokes fixed reviewed Node scripts without a shell. | Read-only checks executed via aggregate; no coverage writer needed. Coverage auditor inspected, not executed this step. |
| Validator mutation suite | Copies relevant fixture text into fresh temp directories; constrained declarative edits; fixed validator subprocesses; cleans only its own temp tree. Does not build or run copied application code. | Executed: 4 baseline + 128 negative controls PASS. |
| Offline boundary tests | Review-authored synthetic paths/maps/packages; local Node generator/profile subprocesses and routing refusal only. Temporary fixture writes/deletes; no native provider executable. | Executed: 32 PASS, zero FAIL/SKIP. |
| Eval generator | `--check` reads fixtures. Default mode edits/removes obsolete eval files within the fixed generated tree. `--stage` copies into a fresh child without provider calls. | Read-only sync executed on real repo; fresh/refused staging and adversarial metadata tested on synthetic copies. No real model eval. |
| Native lifecycle shell | Copies reviewed local package, initializes a fixture, invokes native install/discovery/remove operations using explicit config-home overrides. Not offline or guaranteed isolated; no model invocation in script. | `bash -n` only; native lifecycle NOT_RUN. |
| Routing smoke runner | Sends prompts externally via native CLIs, inherits environment, writes raw stdout/stderr. Native tools may have wider access than the fixture. | Only missing-opt-in refusal tested; actual provider execution NOT_RUN. |
| Technology fact runners/fixtures | Optional .NET builds/restores/tests, local npm fixtures, framework package imports, Python drivers, SQL Server LocalDB and disposable PostgreSQL, API/browser fixtures and cleanup. These can run package/build code and service/database operations. | Static effect/source review only. No restore, dependency install, process/service/database/browser/technology test started. |

The technology fixtures' direct pins do not cover all transitive supply-chain
risk. Python requirements contain exact versions without hash verification;
NuGet fixture projects have direct versions but no committed package lockfiles.
No advisory, licence or transitive integrity status is inferred. Before a later
authorized runtime check, review exact sources/targets, use a disposable host
with dedicated test roles, obtain packages through an approved integrity-checked
process, keep production credentials out, and account for native traffic and
cleanup. Synthetic passwords/auth handlers in test fixtures are not production
security examples. There is no need to run these fixtures for static plugin use.

## Actual verification

Windows PowerShell, Node **24.15.0**; syntax-only shell check used
`C:/Program Files/Git/bin/bash.exe`, not the WSL bash shim. Durable local results:
[static inventory](../../tests/security/results/step30-static-review.json) and
[32-test TAP](../../tests/security/results/step30-boundaries.tap).
Aggregate output is retained in [step30-gates.txt](../../tests/security/results/step30-gates.txt);
syntax-only results in [step30-syntax-checks.json](../../tests/security/results/step30-syntax-checks.json).

| Command | Observed result |
|---|---|
| `node tools/validate/check-security.mjs --write-report` | PASS: 238 package files, 13 entries, 221 references, 57 developer assets, 11 package URL literals, 31 fixture dependency declarations, zero findings in the enforced static profile. |
| `node --test --test-reporter=tap tests/security/boundaries.test.mjs` | 32/32 PASS, zero FAIL/SKIP; path/ID/junction, parser, staging preservation, metadata injection, provider opt-in and negative package controls. TAP retained. |
| `node tools/validate/validate-all.mjs` | Eight offline gate groups PASS; includes the same 32 security tests, 132/132 validator tests and sync of 182 trigger cases / 433 eval files. Package warnings acknowledged below. |
| `node tools/validate/validate-package.mjs` | Zero errors, five size-target warnings; no forbidden component/claim, valid local references; L0 unchanged. |
| `C:/Program Files/Git/bin/bash.exe -n tests/provider-compatibility/run-lifecycle.sh` | Exit 0, syntax only; no shell body or native CLI executed. |
| `node --check <file>` for each inventoried `.mjs` | 23/23 PASS; optional module bodies are not executed. Per-file results retained. |
| `git diff --check` | PASS on the final STEP 30 diff. |

The five warnings are entry sizes above the 200-line target, all below the
300-line hard limit: backend 219, data 205, devops 207, frontend 223,
implementation 215. Explicit security guards are retained; no L0/routing
metadata change was made. Descriptions being unchanged does not prove unchanged
behavior after bodies change.

## Unexecuted checks and disposition

**NOT_RUN:** native-agent injection/forged approval probes in THREAT_MODEL;
provider install/discovery/disable/uninstall, current native permission and
Codex authentication/UI behavior, provider model/routing/workflow evaluation;
remote install/update/signature checks; live URL/advisory/integrity scans;
browser, framework, SQL Server/PostgreSQL, CI policy, ACL or runtime exploitation
tests. No external communication or credential provisioning was required.
Old STEP 06/technology results are historical and are not rerun evidence.

STEP 30 is DONE for its requested static review/hardening/documentation scope,
pending review. R-52 records the remaining native behavior/provenance/host
limitations. STEP 28 remains PARTIAL (R-49/R-50); STEP 29 workflow behavior
remains NOT_RUN (R-51). Engineering 206, technology 108 and workflows 12 remain
IMPLEMENTED with **zero VERIFIED**. No scope, approval or catalog status is
silently promoted. Stop after STEP 30.

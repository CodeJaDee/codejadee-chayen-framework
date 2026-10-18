# Accepted Risks: Chayen v0.1.0

| Field | Value |
|---|---|
| Release | Chayen v0.1.0: public production release for verified CLI providers |
| Accepted by | Product Owner, 2026-10-18 (Production Readiness Plan v4, Phase 1 instruction; recorded in [D-060](../chayen/DECISIONS.md#d-060--chayen-v010-release-scope-and-owner-release-decisions)) |
| Scope document | [RELEASE_SCOPE_DECISION.md](RELEASE_SCOPE_DECISION.md) |
| Gate matrix | [RELEASE_GATE_MATRIX.md](RELEASE_GATE_MATRIX.md) |

An accepted risk is a deliberate gap. It is **never a PASS**.

- Items under an accepted risk keep their own evidence status: NOT_RUN,
  BLOCKED or FAIL.
- That status is not copied into any release gate as PASS.
- The release gates G-01..G-17 were scoped so that none of them requires a
  deferred item. They do not depend on these risks being resolved.

Every risk below has a **limitation statement**. The release must publish it
in the user documentation named in the record before `0.1.0` ships. G-17
checks that this has been done.

Adding a new accepted risk (AR-05 or later) needs an explicit owner decision
recorded in `docs/chayen/DECISIONS.md`. It cannot be added through a
documentation edit alone.

## Summary

| ID | Deferred item | Baseline items | Evidence status (unchanged) | Release gate impact |
|---|---|---|---|---|
| AR-01 | Response Style Policy host testing | P1-035; PG-31 | BLOCKED | None. The policy is outside the package and outside G-01..G-17. No support claim |
| AR-02 | VS Code extension and Copilot Chat testing | P1-001 (VS Code part); PG-13 | NOT_RUN | None. G-06..G-10 cover the three CLIs only |
| AR-03 | Branch Protection and Required Reviews | P1-017; PG-37 | FAIL (repository artifacts); BLOCKED (remote settings) | G-04 does not require enforcement. G-17 adds release-commit controls |
| AR-04 | Unrelated ADR closure and repository hygiene | P1-021 (non-release part), P1-031; PG-38 (part) | FAIL | None for unrelated items. Release-related decisions stay in scope (scope §3.4) |

## AR-01: Response Style Policy host testing deferred

| Field | Record |
|---|---|
| What is deferred | Verifying that the opt-in persistent response style policy (`response-style/`, [docs/RESPONSE_STYLE.md](../RESPONSE_STYLE.md)) loads, and is followed, on Claude Code CLI, Codex CLI, Copilot CLI and the IDE surfaces. This covers the Step 40 policy arms, including pol-13 and pol-14 (policy injection cases), and the proposed ≥ 95% adherence target |
| Baseline evidence | Static checks pass (E-12; 19/19 fixture tests, E-13). Host loading and behaviour are NOT_RUN on all six surfaces (P1-035). VS Code Copilot Chat has a duplicate-load risk. Some subagents and Copilot inline suggestions ignore user-level instructions (KL-08) |
| Not accepted (still required) | The policy's static checks stay in `validate-all` and must keep passing (G-03). The policy must stay outside the plugin package (G-01). No document may describe the policy as verified, supported or part of the plugin |
| **Limitation statement** | "The opt-in response style policy is experimental and has not been tested on any host. Chayen v0.1.0 makes no claim that a host loads it or that responses follow it. It is not part of the plugin, and installing Chayen does not enable it." |
| Disclose in | [docs/RESPONSE_STYLE.md](../RESPONSE_STYLE.md), [docs/COMPATIBILITY_MATRIX.md](../COMPATIBILITY_MATRIX.md), README limitations, release notes |
| Residual risk | A user who opts in may get no effect, a partial effect or duplicated instructions on some hosts, without warning from the host |
| Existing controls | Opt-in only; outside the package; static budget and isolation checks; the documented verify step in `RESPONSE_STYLE.md` |
| Revisit trigger | Before any release that claims policy support, or if the policy moves into the package. Either change needs a new decision |
| Follow-up owner | Product Owner (decision); Maintainer (disclosure) |

## AR-02: VS Code extension and Copilot Chat testing deferred

| Field | Record |
|---|---|
| What is deferred | The manual procedures for the Claude Code VS Code extension (`tests/provider-compatibility/claude-code-vscode.md`) and VS Code Copilot Chat (`tests/provider-compatibility/copilot-vscode.md`). This includes lifecycle, automatic routing and explicit invocation on those surfaces, and U-05 (whether VS Code Copilot Chat auto-invokes plugin skills) |
| Baseline evidence | Never executed on any build (PG-13: NOT_RUN) |
| Not accepted (still required) | All three **CLIs** must pass G-06..G-10. Provider limitations stay disclosed and are not part of this risk: the Codex IDE extension has no plugin support (KL-06) and Claude Code cloud sessions do not load local plugins (KL-07). |
| **Limitation statement** | "Chayen v0.1.0 supports the Claude Code CLI, the OpenAI Codex CLI and the GitHub Copilot CLI. The Claude Code VS Code extension and VS Code Copilot Chat have not been tested and are not supported in this release. The plugin may install there, but discovery, invocation and lifecycle behaviour are unknown." |
| Disclose in | README (its supported-hosts list currently names "GitHub Copilot (CLI and VS Code)" and must be corrected under K-07), [docs/COMPATIBILITY_MATRIX.md](../COMPATIBILITY_MATRIX.md) ("Not tested"), the install guides, and release notes |
| Residual risk | IDE users, a large share of users, may install the plugin and get untested behaviour. VS Code Copilot Chat auto-invocation is undocumented by the provider, and the org policy `ChatPluginsEnabled` may block plugins (KL-35) |
| Existing controls | Native install mechanisms only, a static package and no executables, so the failure mode is guidance not loading. No code runs |
| Revisit trigger | The next minor release, or any request to list an IDE surface as supported |
| Follow-up owner | Product Owner (decision); Evaluation Operator (future manual runs) |

## AR-03: Branch Protection and Required Reviews deferred

| Field | Record |
|---|---|
| What is deferred | Protecting `main`, requiring a CI status, requiring review, blocking force-pushes, `CODEOWNERS`, a PR template, and reading or applying remote rulesets |
| Baseline evidence | 36 direct commits, 0 merges and one author on `main`. No `CODEOWNERS` or PR template. Remote settings cannot be read (no `gh`, private repository) |
| Not accepted (still required) | **CI itself is not deferred.** G-04 requires CI to run on every push and pull request, and to pass on the release commit. G-17 requires the release tag to point at exactly the commit that passed CI and was evaluated on the providers |
| **Limitation statement** | "Changes to the `main` branch are not protected by required reviews or required status checks. For a stable, reviewed version, install a pinned release tag rather than the default branch." The pin syntax is added once the tag format is final (OPEN-01) |
| Disclose in | README install section, [SECURITY.md](../../SECURITY.md) or `docs/SECURITY_AND_LIMITATIONS.md`, release notes |
| Residual risk | A marketplace install that tracks the default branch could receive an unreviewed or broken change between releases (ADR-0008: one stable channel on the default branch). One compromised maintainer account can change `main` with no second check |
| Existing controls | The package is static Markdown and JSON with a V-25 security profile. Releases come only from a frozen, tagged commit (G-17). Every release act needs per-act owner approval (scope §1.4) |
| Revisit trigger | A second maintainer joins, an external contribution arrives, or a security report concerns `main`. Re-assess before the first post-0.1.0 release in any case |
| Follow-up owner | Product Owner (remote settings and policy) |

## AR-04: Unrelated ADR closure and repository hygiene deferred

| Field | Record |
|---|---|
| What is deferred | (a) **ADR and decision closure not needed by any release gate:** ADR-0004; the remaining behaviour decisions of ADR-0009; ADR-0010 part C; PROPOSED decisions in `docs/chayen/DECISIONS.md` not listed in scope §3.4; the GOV-01..18 reviews; normalizing the non-vocabulary statuses ("APPROVED", "scope ACCEPTED"); the KL-51 wording. (b) **Repository hygiene (P1-031):** the tracked personal `.vscode/settings.json`; a `.gitignore` that does not ignore `.env*` or Node artefacts; no `.gitattributes`, so line endings depend on each clone's `core.autocrlf` |
| Baseline evidence | 4 PROPOSED ADRs and 28 PROPOSED decisions (P1-021); hygiene state per P1-031 |
| Not accepted (still required) | The release-related decisions in [scope §3.4](RELEASE_SCOPE_DECISION.md#34-release-related-decisions-not-deferred-by-ar-04): D-009/DF-03, ADR-0003, ADR-0007, ADR-0011 item 3 and D-057. Any finding needed by a gate. Nothing from this risk may enter the distributed package: `.vscode/` and the other hygiene files sit outside `plugins/codejadee-chayen-framework/` |
| **Limitation statement** | "Some architecture decision records and decisions in `docs/chayen/` are still marked PROPOSED. They describe intent and are not binding for v0.1.0. The decisions that v0.1.0 depends on are listed in `docs/production/RELEASE_SCOPE_DECISION.md`." |
| Disclose in | `docs/chayen/DECISIONS.md` (header note) or the ADR index, and release notes |
| Residual risk | (a) Auditors may confuse proposals with binding decisions. (b) A secret file such as `.env.local` could be committed by mistake, because nothing ignores it and the security gate scans the package, not the whole repository. Personal editor settings travel in marketplace clones. Line-ending differences can produce noisy diffs |
| Existing controls | (a) The scope document lists the binding release decisions. (b) The package contains only `.md` and `.json` files (V-25). Maintainers review `git status` before committing (release checklist §C) |
| Revisit trigger | Before the first release after 0.1.0, or immediately if a secret is found in history |
| Follow-up owner | Product Owner (ADR review, `.vscode` decision); Maintainer (hygiene files once approved) |

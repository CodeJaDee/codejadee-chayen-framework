# Known Limitations (STEP 34)

| Field | Value |
|---|---|
| Date | 2026-10-15 |
| Build | `0.1.0-dev`: 13 entry skills, 221 references, 238 package files |
| Companions | [FINAL_AUDIT_REPORT.md](FINAL_AUDIT_REPORT.md), [RELEASE_READINESS.md](RELEASE_READINESS.md) |
| User-facing summary | [docs/SECURITY_AND_LIMITATIONS.md](../SECURITY_AND_LIMITATIONS.md) |

This file consolidates **every known limitation** for maintainers. Each row
gives its evidence and the issue that tracks it. "Not verified" means no
executed evidence exists. It does not mean the feature is known to fail.

## 1. Product limitations (by design)

| ID | Limitation | Evidence / source |
|---|---|---|
| KL-01 | **Guidance is advisory.** Markdown cannot enforce permissions, policy, or approvals. Enforcement comes from the provider, the OS, and CI. | SECURITY_MODEL.md; BC-23; V-10 |
| KL-02 | **Skill selection is probabilistic.** The model decides from descriptions, and no provider guarantees invocation. | Provider docs S7, S12, S17, S19; probe results (§3) |
| KL-03 | **Metadata remains bounded:** L0 6,500 (D-052); shipped 5,485, projected with two planned editorial descriptions 5,940. Latest count ceiling 15 (D-053) replaces 25. Registry checks do not prove native routing or host capacity. Step 34's 5,485/5,500 measurement remains historical. | V-07; D-052; D-053; SKILL_REGISTRATION.md |
| KL-04 | **One plugin, 13 entry skills.** Capabilities are recipes inside those skills, not separate skills, so they are not individually discoverable by name. | ADR-0004 (PROPOSED), D-023 |
| KL-05 | **No executable components:** no hooks, MCP, scripts, or commands. Features that need runtime enforcement are out of scope. | ADR-0005; V-09; V-25 |
| KL-06 | **No path for the Codex IDE extension.** OpenAI documents that it doesn't support plugins. | S13 (re-read 2026-10-15); Q-02 open |
| KL-07 | **No Claude Code cloud sessions.** Locally installed plugins are not loaded there. | S5 |

## 2. Coverage limitations

| ID | Limitation | Evidence / issue |
|---|---|---|
| KL-10 | **Nothing is VERIFIED.** All 206 engineering capabilities, 108 technology capabilities, and 12 workflows are IMPLEMENTED; none has behaviour evidence at capability level. | Catalog status counts (independent audit); R-55 |
| KL-11 | **Java is not implemented** (STK-14 PLANNED). It is an optional extension pending a decision. | Q-08; charter §2.2 |
| KL-12 | **Nitro, Elysia, and Python have general guidance only.** There are references `node-servers.md`, `python-web-apis.md`, and `python-testing.md`, but no cataloged technology pack and no fact checks. Steps 24–25 are unrecorded. | STK-10..STK-12 IN_PROGRESS; R-45 |
| KL-13 | **52 of 159 framework fact checks are NOT_RUN.** Angular 19, React/Next.js 13, Vue/Nuxt/Vite 16, .NET 8 SDK 2, and Node tools/browser 2 need toolchains that are not installed. | Fact runs 2026-10-15: 107 PASS / 0 FAIL / 52 NOT_RUN; R-41, R-43, R-49 |
| KL-14 | **Fact checks ran on single versions:** SQL Server 2025 Express LocalDB, PostgreSQL 18.6 (C locale), .NET 10, Node 24.15.0. | R-46, R-47 |
| KL-15 | **Recipe (445 cases), technology (315), and workflow (47) cases are specifications only.** No agent runner executes them. | EVALUATION_GAPS EG-06..EG-08 |

## 3. Behaviour limitations (measured)

All measurements are on the Claude Code CLI 2.1.270 with model
`claude-sonnet-5`, the plugin loaded with `--plugin-dir`, and the six-stack
fixture.

| ID | Limitation | Evidence |
|---|---|---|
| KL-20 | **Next.js route-handler tasks do not trigger a skill.** The agent still fixed the bug correctly without one. | `pr-nextjs-route`: 0 of 5 runs (Step 32 ×4, Step 34 ×1) |
| KL-21 | **Automatic routing is unreliable even for clear tasks.** Pooled automatic routing was 12/22 (55%). The STEP 34 re-run loaded no skill for the ASP.NET, Angular and SQL Server probes, which had passed 2/2 in Step 32. When the agent began by delegating exploration to a sub-agent, it often never loaded a skill. | Per-probe pooled results: ASP.NET 2/3, Angular 2/3, SQL Server 2/3, PostgreSQL 3/3, pytest 3/5, Next.js 0/5 (FINAL_AUDIT_REPORT §4) |
| KL-22 | **Verification evidence is often not requested** (test commands, EXPLAIN, plans): 3 of 10 graded items in Step 32, agent-graded only. | EVALUATION_REPORT §5; EG-18 |
| KL-23 | **Turn limits cut off answers** in non-interactive runs (4 of 26 in Step 32). | EVALUATION_REPORT §4.3 |
| KL-24 | **Under-triggering in empty workspaces.** Competing personal, project, or built-in skills can win. | POC_REPORT §4; Step 32 empty-workspace check |
| KL-25 | **Copilot over-activation** on Unity and SwiftUI prompts, on the earlier 6-skill build. Not re-measured. | POC_REPORT §4.3 |
| KL-26 | **Repository instruction files were not cited** in the destructive probe: 0/2. | EG-20 |
| KL-27 | **Path resolution against the plugin location.** It dropped from 3/7 to 0/7 after the D-046 guard; not significant. Untested for marketplace (cache) installs. | EG-19 |

## 4. Provider and surface limitations

| ID | Surface | Limitation |
|---|---|---|
| KL-30 | All CLIs | **Native marketplace install of the current 13-skill build has not been executed.** The lifecycle opt-in was denied in STEP 31; earlier-build installs passed. (R-53) |
| KL-31 | Claude Code | `update` may not deliver new content while the version stays `0.1.0-dev`, because installs pin to the version (R-54). Auto-update is off for third-party marketplaces. |
| KL-32 | Codex CLI | No per-plugin update command (0.160.1). Disable works only through `/plugins` or `config.toml`; the `-c` override did not disable the plugin. Current-build behaviour is not tested (no authorized install). |
| KL-33 | Copilot CLI | Needs runtime ≥ 1.0.91 for enable/disable. Uninstall from a local marketplace only disabled the plugin. A same-name personal or project skill silently overrides a plugin skill. Current-build behaviour is not tested (isolated home unauthenticated). |
| KL-34 | Claude Code VS Code extension | Not tested. Only static validation with the bundled 2.1.299 binary. |
| KL-35 | VS Code Copilot Chat | Not tested. Marketplace and manifest selection is confirmed from VS Code 1.141.1 code only. Auto-invocation of plugin-bundled skills is undocumented (U-05). An org policy `ChatPluginsEnabled` can disable plugins. |
| KL-36 | GitHub marketplace (`owner/repo`) | Not tested on any surface. The repository is private, so installs need access (R-56). |
| KL-37 | Desktop apps (Claude, ChatGPT), Copilot cloud agent | Not tested |

## 5. Security limitations

| ID | Limitation | Evidence |
|---|---|---|
| KL-40 | Prompt-injection and forged-approval resistance are **not tested with adversarial content**. | R-52; EG-09 |
| KL-41 | Secret and content scans are heuristic. No dependency-advisory, live-link, or provenance check was run. | V-25 limitations; R-52 |
| KL-42 | Developer tooling can execute fixture builds, start temporary databases, and call billed models when opted in. A kept LocalDB instance `ChayenFacts` remains on the maintainer machine after SQL Server fact runs. | SECURITY_MODEL §Maintainer execution; F-sqlserver log |
| KL-43 | A malicious maintainer or a compromised validator can bypass repository-local checks. | THREAT_MODEL; R-52 |

## 6. Release and governance limitations

| ID | Limitation | Evidence |
|---|---|---|
| KL-50 | No licence, unconfirmed publisher identity, private repository, no confirmed security contact. | R-56; Q-05 |
| KL-51 | No acceptance row is VERIFIED except the seven exclusions, which were verified by this audit. Every GOV row awaits user review. 3 ADRs and about 22 decisions remain PROPOSED. | FINAL_AUDIT_REPORT §5–§6 |
| KL-52 | No CI pipeline runs the validators automatically. | REQ-10 evidence: "CI not set up" |
| KL-53 | DF-02: `claude plugin validate` on the `skills/` directory fails with some CLI versions. The plugin and marketplace targets pass. | ISSUES DF-02 |

# Project Charter — codejadee-chayen-framework

| Field | Value |
|---|---|
| Project | codejadee-chayen-framework ("Chayen") |
| Repository | https://github.com/CodeJaDee/codejadee-chayen-framework |
| Charter version | 0.1 (Step 01 baseline) |
| Date | 2026-10-14 |
| Status | DRAFT — awaiting user review |

## 1. Vision

Chayen is a **native AI agent plugin** that gives reusable, technology-aware
software engineering guidance to:

- Claude Code
- OpenAI Codex
- GitHub Copilot

It installs through each provider's **native plugin management or marketplace
mechanism**, wherever that provider officially supports one. Once installed,
it activates automatically from ordinary prompts. The user never has to say
"Chayen". When no Chayen skill applies, the agent behaves exactly as it would
without the plugin.

## 2. Scope

### Step 35 scope extension (2026-10-17)

The Product Owner approved two additional editorial Entry Skills,
`chayen-humanizer-th` and `chayen-humanizer-en`, in this repository and native
plugin, increasing the **target** from 13 to 15. Thai/English writing,
content audit/rewriting and website copy editing accompany a Multilingual
Response Style Policy for ordinary responses without explicit Humanizer
invocation. The 206 Engineering Capabilities and all approved Technology and
Workflow Coverage remain unchanged; editorial scope is additional, separately
tracked in [HUMANIZER_REQUIREMENTS.md](HUMANIZER_REQUIREMENTS.md).

This is approved product scope (D-047), not implemented functionality or
approval of architecture exceptions. ADR-0009–ADR-0011 remain PROPOSED. The
preferred initial architecture is **Native Plugin + Opt-in Host Persistent
Instructions**, preserving zero runtime and provider compatibility as
requirements. The owner subsequently approved an Entry Skill ceiling of
**25** (D-051), implemented in the two count validators; product target stays 15.
The subsequent D-052 follow-up authorizes L0 ≤6,500 characters, implemented
in the validator and evaluation report. REQ-04/no-match, zero always-on content
and portability constraints are not silently replaced;
their conflicts and proposed amendments are in
[HUMANIZER_ARCHITECTURE_IMPACT.md](HUMANIZER_ARCHITECTURE_IMPACT.md).
Strict install-only guaranteed always-on behavior is UNVERIFIED and is not
claimed supported. Original Step 35 changed governance only; the explicit
D-051/D-052 follow-ups change count/L0 validation and reporting only.
Current package count is 13.

Step 36 approval D-053 implements the separate editorial registration model
and CA-01/V-19 amendments. Its latest maximum 15 replaces the earlier 25;
L0 stays 6,500. The two Humanizers are planned metadata records only; current
shipping count remains 13. See [SKILL_REGISTRATION.md](SKILL_REGISTRATION.md).

### 2.1 In scope

- Skill content (instructions plus on-demand reference material) covering
  **206 planned engineering capabilities across 20 domains**.
- Provider-specific packaging manifests (plugin and marketplace metadata) for
  each supported provider.
- A shared, provider-neutral skill source written once and packaged for every
  provider.
- Progressive loading: short skill metadata is always visible, the skill body
  loads when it is relevant, and deep references load only when needed.
- Repository-convention preservation: skills must detect and respect the host
  project's existing architecture before suggesting patterns.
- Evidence-driven verification guidance (build, test, and lint evidence, not
  assertions).
- Security guidance, clearly labelled as advisory.
- Automated structural validation, plus provider compatibility and regression
  tests.
- Installation and authoring documentation.

### 2.2 Technology coverage

| Tier | Technologies |
|---|---|
| Primary | C# / ASP.NET Core Web API · Angular / TypeScript · Microsoft SQL Server |
| Additional | JavaScript / TypeScript · React · Next.js · Vue · Nuxt · Vite · Python · PostgreSQL |
| Optional extension | Java |

### 2.3 Out of scope (hard exclusions)

| ID | Excluded |
|---|---|
| EX-01 | A Chayen CLI |
| EX-02 | A custom installer or install script that replaces the native plugin mechanism |
| EX-03 | A web application |
| EX-04 | A VS Code extension |
| EX-05 | A standalone agent runtime |
| EX-06 | A background daemon or service |
| EX-07 | A **mandatory** MCP server (an optional one may be considered later only through a recorded decision) |

## 3. Core requirements

| ID | Requirement |
|---|---|
| REQ-01 | Native plugin installation and lifecycle (install, update, disable, uninstall) |
| REQ-02 | Automatic skill discovery from ordinary prompts |
| REQ-03 | No explicit Chayen invocation required |
| REQ-04 | No applicable skill means native AI behaviour |
| REQ-05 | 206 planned engineering capabilities in 20 domains |
| REQ-06 | Progressive skill and reference loading |
| REQ-07 | Preserve existing repository architecture and conventions |
| REQ-08 | Evidence-driven verification |
| REQ-09 | Security guidance that does not pretend markdown instructions are hard enforcement |
| REQ-10 | Provider compatibility and regression tests |

Every requirement is traced in [ACCEPTANCE_MATRIX.md](ACCEPTANCE_MATRIX.md).

## 4. Success criteria

The project is complete only when all of the following are true:

1. Every row in the acceptance matrix is `VERIFIED`, or is `DEFERRED` with a
   user-approved decision recorded in [DECISIONS.md](DECISIONS.md).
2. For each provider that has an official plugin mechanism, a clean install
   through that mechanism works, with recorded evidence.
3. Positive trigger tests show the relevant skill activating from
   non-Chayen-specific prompts, and negative trigger tests show no activation
   for unrelated prompts.
4. Structural validation and regression tests pass in an automated run, with
   the output recorded.

## 5. Stakeholders and roles

| Role | Party |
|---|---|
| Product owner and approver | User / repository owner (CodeJaDee) |
| Lead engineer (implementation) | AI agent, operating under [BUILD_CONTRACT.md](BUILD_CONTRACT.md) |

## 6. Governing documents

| Document | Purpose |
|---|---|
| [BUILD_CONTRACT.md](BUILD_CONTRACT.md) | Rules every step must follow |
| [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) | Numbered steps |
| [PROGRESS.md](PROGRESS.md) | Step log and file ledger |
| [DECISIONS.md](DECISIONS.md) | Decision records |
| [ACCEPTANCE_MATRIX.md](ACCEPTANCE_MATRIX.md) | Requirement to implementation to verification traceability |
| [ISSUES.md](ISSUES.md) | Risks, open questions, defects |

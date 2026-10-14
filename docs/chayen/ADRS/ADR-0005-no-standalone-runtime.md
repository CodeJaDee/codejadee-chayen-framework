# ADR-0005: No standalone runtime

- **Status:** ACCEPTED (user-mandated: Step 01 exclusions EX-01..EX-07, Step 03 MA-07, MA-08)
- **Date:** 2026-10-14
- **Related:** D-002, D-004, BC-22, ADR-0001, ADR-0007

## Context

Plugins *can* ship executable components, but each one adds processes,
dependencies, and trust surface:

- hooks, MCP servers, LSP servers, and `bin/` executables (S3);
- hooks and MCP in Codex (S10);
- hooks, agents, and commands in Copilot (S15).

The charter excludes a CLI, a custom installer, a web application, a VS Code
extension, a standalone agent runtime, a background daemon, and a mandatory
MCP server.

## Decision

1. The plugin contains **only Markdown and JSON**. No component in it
   executes, and nothing runs at install, at session start, or in the
   background.
2. Excluded component types:
   - hooks
   - agents and commands
   - MCP servers (mandatory or optional)
   - LSP servers
   - `bin/` directories
   - scripts (including skill `scripts/` directories)
   - `package.json` and lockfiles
   - provider sidecars such as `agents/openai.yaml`
3. Any developer tooling (validators, packaging, evals) lives outside the
   plugin and is never required by users (C-12, C-13, PG-01).
4. Adding any executable component later needs a new ADR that shows:
   - a necessity that skills alone can't meet;
   - portability across providers;
   - a security review;
   - user approval.

## Alternatives considered

| Alternative | Why rejected |
|---|---|
| Optional MCP server for catalog lookup | Unnecessary: the provider's file-read tools already reach the knowledge files. It adds a process and an attack surface. |
| Skill `scripts/` for stack detection | Scripts need an interpreter on the user's machine and per-OS testing. The model can detect the stack by reading files. |
| Hooks to enforce conventions | Hooks are not portable (Agent Plugins v1, S20), and they would be always-on (ADR-0003). |

## Consequences

- **Positive:**
  - zero runtime dependencies and zero processes;
  - nothing to patch for CVEs;
  - install is a file copy by the provider.
- **Negative:**
  - Chayen can't enforce anything (ADR-0007).
  - Deterministic checks are left to the user's CI and the provider's
    controls.

## Verification

V-09: an allow-list of file types, and a forbidden-components scan on every
CI run.

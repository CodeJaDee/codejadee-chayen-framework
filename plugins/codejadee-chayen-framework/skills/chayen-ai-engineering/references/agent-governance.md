---
kind: recipe
capabilities: [CAP-18-010]
---
# Agent action risk review

Review what an AI coding agent may do (run commands, write files, reach the
network, use credentials) against the provider's permission settings and the
team's workflows, and recommend allow, ask, or deny rules and sandboxing.
The review is advisory: enforcement comes from the provider's permission
settings, sandboxes, and platform controls, and a recommendation made by an
AI is never an approval.

## Inputs

- The agent configuration: permission and settings files at user, project,
  and managed levels, sandbox or approval modes, MCP or tool server
  configuration, hooks, and CI jobs that run agents.
- The intended workflows (what the agent should do day to day).
- The environments and credentials reachable from where the agent runs.

## Procedure

1. **Inventory the configuration** at every level the provider supports,
   noting which level wins on conflict, citing the provider's current
   documentation for the file names and precedence, or marking them
   unverified.
2. **List the actions the agent can take** under that configuration:
   commands and patterns auto-approved, file paths writable, network
   access, tools and servers, and credentials in the environment.
3. **Rate each action:**

   | Risk | Examples | Recommended rule |
   |---|---|---|
   | Destructive or irreversible | `rm -rf`, `git push --force`, `git reset --hard`, database drops, `terraform destroy` | deny, or ask with a narrow pattern |
   | Affects others or production | pushes, deployments, publishing, cloud CLI writes, sending messages | ask |
   | Reads secrets or broad data | reading credential files, environment dumps, production data | deny or ask, with secrets kept out of reach |
   | Network egress | arbitrary fetch or curl to external hosts | ask, or allow-list hosts |
   | Local and reversible | reading files, running tests and builds, formatting | allow |

4. **Check the environment:** credentials and tokens available to the agent
   process, sandbox or container isolation, and whether CI agents have
   write access to protected branches.
5. **Recommend changes** as a table of rules per provider setting, with the
   reason, and a short sandboxing recommendation. Do not edit permission or
   settings files unless the user asks; when asked, show the exact change
   first.
6. **State the limits:** the review is advisory; only the provider's
   permission system, sandboxing, and platform controls enforce anything,
   and the user decides which rules to adopt.

## Outputs

- An action risk table with recommended allow, ask, or deny rules per
  provider setting.
- A statement that the guidance is advisory and that enforcement comes from
  provider permissions.

## Technology considerations

| Stack | Consideration |
|---|---|
| Coding agents (CLI and IDE) | Providers offer permission rules for tools and commands, approval or sandbox modes, and user, project, and managed settings levels. Exact keys and precedence differ by provider and version: read and cite the current documentation. |
| Tool servers (MCP) | Each server adds tools with their own reach: review which are enabled per project and what credentials they hold. |
| Hooks | Hooks can block or log actions deterministically; they are an enforcement layer that instructions cannot replace. |
| CI agents | Token permissions (read-only by default), protected branches, required reviews, and environment approvals. |

## Verification

- An auto-approved destructive command pattern in the fixture settings is
  flagged with an ask or deny recommendation.
- Every recommendation names the setting it would change, and no settings
  file was edited without the user's request.
- The output states that it is advisory and does not present any
  recommendation as an approval.

# Canonical skill source

This is the single source for all Chayen skills, shared by Claude Code,
OpenAI Codex, and GitHub Copilot.

Each skill is a directory, `skills/<skill-name>/SKILL.md`, plus optional
`references/` files.

- References are loaded only when the skill's routing table says so.
- References live inside the skill's own directory (D-016).

**Frontmatter** uses only the Agent Skills standard fields: `name` and
`description`. `name` must equal the directory name.

## Pilot entry skills (0.1.0-dev)

| Skill | Scope |
|---|---|
| `chayen-repository` | Read-only orientation in an existing codebase |
| `chayen-implementation` | Multi-file or cross-layer changes with a task contract and change summary |
| `chayen-backend` | Server-side code: ASP.NET Core, data access, Node and Bun servers, Python web APIs |
| `chayen-frontend` | Web UI: Angular, React/Next.js, Vue/Nuxt, Vite |
| `chayen-testing` | Automated tests: .NET, JavaScript/TypeScript, Python |
| `chayen-security` | Advisory security review and hardening |

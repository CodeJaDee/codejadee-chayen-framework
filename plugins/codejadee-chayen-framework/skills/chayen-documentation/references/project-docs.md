---
kind: recipe
capabilities: [CAP-16-001, CAP-16-004, CAP-16-008]
---
# README, onboarding guide, and knowledge transfer

Write or update project documentation from verified repository facts: a
README with accurate setup, run, test, and configuration commands; an
onboarding guide that gets a new developer to a working build and a first
task; and a knowledge-transfer document that separates facts verified in
the repository from what the outgoing owner tells you.

## Inputs

- The existing README and docs folder, contribution guide, and doc style.
- Scripts, project files, CI workflows, configuration files, and
  Dockerfiles or dev containers.
- For onboarding: the architecture overview (from the repository profile or
  architecture docs) and team practices the user describes.
- For knowledge transfer: the outgoing owner's notes and answers, open work,
  and operational tasks.

## Procedure

### README (CAP-16-001)

1. **Collect facts** with the fact-checking checklist: purpose (from
   existing docs or the user), prerequisites and versions, setup, run, test,
   lint, configuration keys, and where to contribute.
2. **Verify every command:** it exists in scripts, project files, or CI, and
   ideally ran in this session. Remove or correct stale commands, and note
   each correction.
3. **Write the sections** the repository's style uses, typically: purpose,
   prerequisites, getting started, running, testing, configuration (keys
   and where they are set, never values of secrets), project layout, and
   contributing.
4. **List unverified statements** in the output, and mark them in the text.

### Onboarding guide (CAP-16-004)

1. **Write the environment setup** step by step from the README and dev
   container or scripts, including tools and versions. Run the steps where
   possible, and label each step verified or unverified.
2. **Give an architecture tour:** the main components and how a request
   flows, with links to code and to the architecture docs.
3. **Describe workflows and conventions:** branching, pull requests, code
   style, tests, and release process, from repository files and the user.
4. **Suggest starter tasks:** small, low-risk, well-tested areas (from
   history and tests), or issues the user labels for beginners.
5. **Add who to ask** from CODEOWNERS or the user, never guessed.
6. **Place the guide** in the repository's docs location.

### Knowledge transfer (CAP-16-008)

1. **Interview the outgoing owner** with structured questions: why things
   are as they are, operational gotchas, recurring incidents, scheduled
   tasks, credentials and access (by name, never values), contacts, and open
   work.
2. **Cross-check with the repository:** history, configuration, jobs, and
   runbooks. Mark each statement verified in the repository or supplied by
   the owner.
3. **Write the document:** history and key decisions, gotchas, operational
   tasks with links to runbooks, contacts, and open items.
4. **List the questions** the successor should ask before the handover
   ends.

## Outputs

- README changes with every command sourced from the repository, and a list
  of statements that could not be verified.
- An onboarding guide in the repository's docs location, with verified
  setup steps and suggested starter tasks.
- A knowledge-transfer document (history, gotchas, operational tasks,
  contacts, open items) that separates repository-verified facts from
  owner-supplied statements, plus the questions to ask before the handover
  ends.

## Technology considerations

| Stack | Consideration |
|---|---|
| .NET | `dotnet` commands from solution and project files, `global.json` SDK, user-secrets for local configuration, `launchSettings.json` profiles. |
| JavaScript and TypeScript | `package.json` scripts and the lock file's package manager (npm, pnpm, Yarn, Bun), `.nvmrc` or `engines`. |
| Python | The environment tool (uv, Poetry, pip), `pyproject.toml` scripts, `manage.py` commands for Django. |
| Containers | `docker compose` services for dependencies, and dev containers as the preferred setup path when present. |
| Docs tooling | MkDocs, Docusaurus, DocFX, or plain Markdown, as the repository uses. |

## Verification

- Every command in the updated fixture README exists in its scripts or CI
  files, and stale commands are removed.
- Following the setup steps in the fixture guide builds the project, and
  unverified steps are labelled.
- The knowledge-transfer document separates facts verified in the
  repository from statements supplied by the user.

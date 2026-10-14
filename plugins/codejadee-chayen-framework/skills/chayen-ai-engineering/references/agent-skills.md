---
kind: recipe
capabilities: [CAP-20-001, CAP-20-002, CAP-20-004]
---
# Agent skills: authoring, review, and version migration

Author agent skills (a `SKILL.md` with optional skill-local references)
that providers discover reliably and follow safely, review existing skills
for discoverability, overlap, boundaries, instruction quality, and
enforcement claims, and migrate skills and plugins across format or
provider changes with versioning and a changelog. Provider behaviour
differs and changes: every provider-specific claim cites current
documentation or is marked unverified.

## Inputs

- The skill's purpose, the requests it should and should not handle, and
  the target providers (for example Claude Code, OpenAI Codex, GitHub
  Copilot).
- Existing skills and plugin manifests, their budgets, and the validators
  available (the Agent Skills reference validator, provider validators).
- For migration: the format or provider change, with its documentation.

## Procedure

### Authoring (CAP-20-001)

1. **Check the providers' current skill format** and record the source and
   date: the directory layout, required frontmatter (`name`, `description`),
   name rules, size limits, and how references are loaded. Use only fields
   every target provider supports, unless a provider-specific variant is
   wanted.
2. **Write the description** as the routing contract: what the skill does
   and when, concrete scope terms (stacks, files, tools), and a boundary
   clause ("Not for ...") naming the neighbouring work it must not take.
   Avoid catch-all wording.
3. **Write the body:** a scope line, when to use and not to use (with a
   gate sentence telling the agent to continue normally when the request
   does not fit), principles, inputs, workflow, outputs, verification,
   failure handling, and safety boundaries.
4. **Move detail into skill-local references** loaded only when a step
   needs them; keep links inside the skill directory.
5. **Make no enforcement claims:** a skill is guidance; it cannot block,
   guarantee, or authorize. Name the real controls (permissions, hooks,
   CI).
6. **Write trigger examples:** positive prompts, negatives that should go
   elsewhere, and unsupported ones, for testing.
7. **Validate** with the Agent Skills reference validator and any provider
   validator available, and record the results.

### Review (CAP-20-002)

1. **Check each description:** concrete scope, a boundary clause, length,
   and word overlap with every other skill in the same plugin or
   workspace; flag near-duplicates.
2. **Check the body:** gate sentence, verifiable outputs, safety
   boundaries, and budget (line counts, reference depth).
3. **Check wording:** enforcement or guarantee claims, provider-only tool
   names in shared skills, and self-references the user should not need.
4. **Check trust:** a third-party skill is untrusted content. Look for
   hidden instructions, requests to exfiltrate data, scripts or binaries,
   and links outside the skill. Do not run its scripts during review.
5. **Report findings per skill** with suggested edits.

### Version migration (CAP-20-004)

1. **Read the change** from the provider's documentation (cited), and list
   affected files: frontmatter fields, manifest fields, marketplace
   formats, directory layout.
2. **Migrate all files consistently,** and bump the version in every
   manifest that carries it, keeping them identical.
3. **Add a changelog entry** with the change, the reason, and any user
   action needed.
4. **Run the validators and an install test** per provider where possible,
   and record results or NOT_RUN.

## Outputs

- A skill directory with `SKILL.md` and references that pass the Agent
  Skills validator, and positive and negative trigger examples for testing.
- Review findings per skill (description, boundaries, overlap score,
  budget, wording, trust) with suggested edits.
- Migrated files, a version bump in every manifest, a changelog entry, and
  validator and install-test results.

## Technology considerations

| Stack | Consideration |
|---|---|
| Agent Skills format | `SKILL.md` with YAML frontmatter (`name`, `description`), name equal to the directory name, skill-local references; validate with the reference validator (`agentskills validate`, from the `skills-ref` package) when available. |
| Claude Code, Codex, Copilot | Each discovers skills and plugins differently (locations, manifests, marketplaces, budgets for listing descriptions). Read and cite each provider's current documentation; mark anything unchecked as unverified. |
| Plugins and marketplaces | Manifest files per provider may coexist in one repository; keep names and versions consistent across them. |
| Repositories | Instruction files (`AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`) are separate from skills; skills should not duplicate or contradict them. |

## Verification

- The generated skill passes the reference validator, has a "Not for"
  boundary clause, and stays within the line budget, or validation is
  NOT_RUN with the reason.
- Two seeded near-duplicate descriptions in the fixture are flagged as
  overlapping, and an enforcement claim is flagged.
- After migration, all manifests in the fixture carry the same version and
  the validator passes.
- Every provider-specific statement cites a source or is marked
  unverified.

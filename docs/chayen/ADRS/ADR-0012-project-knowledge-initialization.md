# ADR-0012: Project Knowledge Initialization

- **Status:** ACCEPTED (explicit owner instruction, 2026-10-19: build an init
  Skill and raise the Skill ceiling if it is a constraint). Recorded as D-062.
- **Date:** 2026-10-19
- **Related:** D-007, D-008, D-052, D-053, D-062; ADR-0002, ADR-0003,
  ADR-0004, ADR-0005, ADR-0006, ADR-0010; KL-03, KL-05, KL-21, KL-26.

## Context

Every stack Skill detects the repository's stack, commands and conventions
before it acts (D-008), but nothing persists between sessions. Each task
repeats the detection, results can differ between runs, and facts the code
cannot show (a production database version, a forbidden library) have no
place to live. Automatic routing reached 12 of 22 runs (KL-21), so detection
that lives only inside Skills does not run on every task.

The owner asked for an init capability that records project structure once
and makes later work start from it, across projects with different languages,
databases and layouts. The owner requires the `.chayen/` directory.

Constraints that shape the design:

- no hooks, commands, scripts or runtime (ADR-0005, KL-05); Skills only;
- no always-on content shipped by the plugin (ADR-0003, D-007);
- the 206-capability Engineering Catalog mirrors a fixed inventory, and every
  engineering Entry Skill must own a capability;
- 15 of 15 Skills shipped, with 279 L0 characters free (KL-03);
- V-10 rejects the word "chayen" in shipped content (PT-08, SK-06).

## Decision

1. **A new Entry Skill, `chayen-init`**, runs only on an explicit request to
   initialize, refresh or remove project knowledge. Its description and gate
   say so; it adds no provider-specific frontmatter (PT-02).
2. **Three files plus optional unit files**, split by owner and load
   frequency rather than by topic:

   | File | Owner | Read |
   |---|---|---|
   | `.chayen/profile.md` | generated | every task |
   | `.chayen/rules.md` | team | every task; never overwritten |
   | `.chayen/conventions.md` | generated | before writing code |
   | `.chayen/units/<unit>.md` | generated | for that unit, multi-unit repositories only |

   Explicit standards and observed patterns stay in separate sections;
   proposals are reported in conversation and never written.
3. **Preview before every write.** Nothing is written until the user approves
   the exact content or diff. Writes stay inside `.chayen/` and inside approved
   pointer blocks.
4. **Freshness from git, without a runtime.** Each generated file records
   `generated_commit` and an evidence list of `path` + `git hash-object` blob.
   Refresh recomputes those hashes and re-detects only changed units or
   sections. Without git, it re-detects everything.
5. **Consumption through the host's own instruction files**, following
   ADR-0010 mechanism B: an opt-in block marked
   `<!-- BEGIN .chayen project knowledge v1 -->` in `AGENTS.md`, `CLAUDE.md` or
   `.github/copilot-instructions.md`, added only with separate approval. The
   plugin ships no instruction file; installing it changes nothing.
6. **A third registration category**, `catalog/project-skills.json`, for
   Skills that own no engineering capability. It mirrors the editorial
   registry: closed schema, allow-list (`chayen-init`), mapping/file parity,
   description parity, no engineering recipes or capability mappings. The
   206-capability inventory is unchanged.
7. **Limits:** Entry Skill ceiling 15 → **16**; L0 budget 6,500 → **7,000**
   characters. Actual L0 after this change: 6,563.
8. **V-10 amendment:** the `.chayen` path may appear in shipped content. Every
   other use of the name, such as prose referring to the plugin, is still
   rejected. PT-08 holds for prose: Skills describe a directory, not the
   plugin.

## Not built

Source, module, API or dependency indexes; a persistent memory store; a
generated security standard; a decisions file that duplicates ADRs; flags such
as `--deep`; hooks. Each needs a runtime this package does not have, or would
go stale faster than reading the source on demand. A `memory.json` with
proposed/approved entries remains a possible follow-up once the three-file
design has evaluation evidence.

## Consequences

- Positive: later sessions can start from verified, team-reviewed facts on any
  host that loads the pointer block; team rules have a home; refresh is cheap.
- Negative: first Skill whose purpose is to write persistent files in the
  user's repository; its safety relies on preview/approval guidance and native
  permissions (KL-01). Generated files can go stale; mitigated by fingerprints
  and the rule that source wins.
- `chayen-init` ships from version `1.1.0` (D-063). Version-pinned installs
  of `1.0.0` receive it through a normal update (KL-31). RC
  qualification evidence for 15 Skills does not cover this build.
- Routing, behaviour, host loading of the pointer block and agent compliance
  with it are NOT_RUN.

## Alternatives considered

| Alternative | Why rejected |
|---|---|
| Recipe inside `chayen-repository` | Breaks that Skill's read-only contract. |
| Recipe inside `chayen-documentation` | No ceiling change, but not invocable by name (KL-04) and mixes agent knowledge with human documentation. |
| Reassign an existing capability to the new Skill | Removes coverage from its current owner; no capability matches. |
| Add capabilities to the Engineering Catalog | Changes the fixed 206-capability inventory and its fingerprint. |
| Write into `CLAUDE.md` or `AGENTS.md` directly | Mixes generated content into user-owned files and conflicts with the rule that Skills never edit instruction files beyond an approved block. |
| The proposed 33-file `.chayen/` catalog | Too many files to keep fresh or for agents to load; most need a parser. |
| A session-start hook that loads `.chayen/` | Violates ADR-0003/0005 and is not portable. |

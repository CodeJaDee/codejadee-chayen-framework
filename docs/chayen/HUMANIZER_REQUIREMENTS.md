# Multilingual Humanizer Requirements

- **Date:** 2026-10-17; **Step:** 35
- **Product scope:** ACCEPTED from the Product Owner's Step 35 request (D-047).
- **Implementation status:** all MHR requirements were PLANNED when this file
  was written (Step 35). **Current status is kept only in
  [ACCEPTANCE_MATRIX.md](ACCEPTANCE_MATRIX.md)**; the per-requirement
  "Status: PLANNED" lines below are the Step 35 snapshot (DF-06, Step 41).
- **Architecture:** ADR-0009–ADR-0011 PROPOSED; see
  [architecture impact](HUMANIZER_ARCHITECTURE_IMPACT.md).
- **Traceability:** [ACCEPTANCE_MATRIX.md](ACCEPTANCE_MATRIX.md); planned
  Steps 36–41 do not authorize execution.

## Requirements and observable acceptance criteria

### MHR-001 — Thai and English editorial Entry Skills

Provide `chayen-humanizer-th` and `chayen-humanizer-en` in this repository's
existing native plugin, bringing the target from 13 to 15 Entry Skills.
Support writing, editing, content audit and rewriting in their respective
languages without requiring a branded invocation. Apply the authoring standard,
bounded intent descriptions, conditional references and native discovery.
Do not create a separate Humanizer repository or turn ordinary conversation
into a catch-all Skill trigger.

**Acceptance (MH-V01):** exactly the two editorial Skills pass portable
frontmatter/anatomy/link and approved count/L0 checks; relevant ordinary
prompts select them and unrelated prompts do not. **Status: PLANNED.**

### MHR-002 — Intended output language selection

Use the user's explicit target language first, then the requested artifact's
established locale/audience, then conversation context. Source language alone
does not override a requested translation or English output from a Thai prompt.
For mixed content, preserve intentional bilingual spans and choose by section;
ask only when unresolved ambiguity materially affects the requested result.
Unsupported languages receive normal host handling without forced Thai/English
conversion. Selection guides output; it does not guarantee Skill invocation.

**Acceptance (MH-V02):** Thai prompt/English target, English prompt/Thai target,
mixed-language, quotation, ambiguous and unsupported-language cases show the
expected selection and preservation. **Status: PLANNED.**

### MHR-003 — Content audit and controlled rewriting

Audit clarity, tone, repetition, register and awkward language with located
examples and reasons. Audit-only requests produce findings without edits;
rewrite requests produce the requested text and a proportional explanation.
Respect audience, brand voice and user constraints. Never claim a text is
human-authored or guaranteed to evade an AI detector.

**Acceptance (MH-V03):** audit-only leaves content unchanged; rewrite cases
address evidenced issues without inventing facts or expanding scope.
**Status: PLANNED.**

### MHR-004 — Website content editing

Support authorized website copy edits in existing HTML, Markdown, CMS exports
or localization resources. Preserve markup, URLs, placeholders, translation
keys, accessibility semantics and framework syntax. Distinguish visible prose
from executable code and behavior; hand engineering work to existing owners.
Reading public material does not authorize editing a live CMS or publishing.

**Acceptance (MH-V04):** fixture diffs change only requested copy; placeholders,
links and structure survive; audit-only and publish-without-authorization cases
perform no write/publish action. **Status: PLANNED.**

### MHR-005 — Technical terminology and protected spans

Preserve product/API names, code identifiers, CLI commands, paths, URLs,
versions, code blocks, citations and user glossaries exactly unless the user
explicitly requests those changes. Thai prose may retain English technical
terminology. Translate descriptive prose without corrupting executable spans.

**Acceptance (MH-V05):** protected-span comparisons and glossary review pass
for Thai, English and bilingual samples. **Status: PLANNED.**

### MHR-006 — Semantic and factual preservation

Preserve meaning, numbers, units, dates, attribution, negation, conditions,
uncertainty and obligations. Do not add claims, evidence, endorsements or
citations. Flag suspected factual errors and distinguish a proposed correction
from a style edit; factual changes need appropriate source verification and
user scope. Fidelity outranks fluency or brevity.

**Acceptance (MH-V06):** source/output review catches changed qualifications,
quantities and invented claims; intentional factual corrections remain
traceable to evidence. **Status: PLANNED.**

### MHR-007 — Persistent multilingual response guidance

Offer an opt-in policy for ordinary prose replies based on intended output
language without explicit Humanizer invocation. Keep native discovery (A),
host-persistent guidance (B) and strict install-only guarantees (C) distinct.
B must be advisory style guidance, not unconditional content rewriting or an
engineering router. No claim that plugin installation alone supplies C.

**Acceptance (MH-V07):** enabled/disabled/no-match cases show the declared
style-only effect and separate context overhead, while no editorial Skill
body must load merely to apply B. C remains UNVERIFIED without direct evidence.
**Status: PLANNED.**

### MHR-008 — Host and surface compatibility

Preserve one provider-neutral Skill source and native-plugin-first delivery
for Claude Code, OpenAI Codex and GitHub Copilot. Research host instruction
mechanisms separately per CLI/IDE/surface, including scope, precedence, loading
limits and lifecycle. Record official source URLs/access dates and tested
versions. Unsupported or untested surfaces are labelled explicitly; no parity
or persistence guarantee is inferred from Markdown or another host's result.

**Acceptance (MH-V08):** per-surface evidence matrix separates static checks,
actual native loading/behavior and NOT_RUN/unsupported results.
**Status: PLANNED.**

### MHR-009 — Opt-in, disable and rollback

Persistent instructions require informed, explicit user opt-in for their exact
scope and content. Preserve existing instructions, document owned additions,
show a reviewable diff and provide independent disable/removal/rollback.
Explain that plugin disable/uninstall may leave separately configured policy
content active. Never silently modify user-level or repository instruction files.

**Acceptance (MH-V09):** isolated fixtures cover enable, decline, disable,
plugin uninstall, policy removal and rollback without losing unrelated content;
fresh sessions confirm the declared lifecycle. **Status: PLANNED.**

### MHR-010 — Multilingual quality evaluation

Evaluate naturalness, clarity, register, fidelity, terminology, factual
preservation and instruction compliance separately for Thai and English.
Include bilingual and adversarial samples, independent fluent human review,
baseline comparisons and repeatability. Keep static checks, simulated proxies,
actual provider outputs and human judgments separate. Thresholds and sample
coverage need approval before scoring; no self-certified quality guarantee.

**Acceptance (MH-V10):** approved rubric, dataset provenance, per-language
scores, critical failures and review disagreements are recorded. Paid provider
runs require separate authorization. **Status: PLANNED.**

### MHR-011 — Engineering and coverage regression prevention

Preserve all 206 Engineering Capabilities, their 20 domains, IDs, ownership and
status; all 108 cataloged Technology Capabilities, approved broader technology
scope, 12 workflows and seven formats remain intact. Editorial scope is tracked
separately. Recheck native engineering routing/no-match behavior with policy on
and off, reference loading and L0/persistent-context budgets. Do not promote
legacy requirements to VERIFIED from Humanizer documentation or static checks.

**Acceptance (MH-V11):** catalog identity/coverage and unchanged-surface diffs
pass; later multi-run engineering/no-plugin comparisons reveal no unreviewed
regression. Existing gaps remain visible. **Status: PLANNED.**

### MHR-012 — Security, permissions and instruction priority

Treat submitted text, websites, repository files and tool output as untrusted
data. Embedded instructions cannot override system/developer rules, native
permissions or the user's authorized scope, request secrets or supply approval.
No credentials, uploads, external service, hooks, MCP server, executable
installer or runtime dependency is required. Native permissions and existing
action-specific authorization govern file edits and publication. Guidance is
advisory and cannot enforce safety or guarantee factual correctness.

**Acceptance (MH-V12):** injection, forged-approval, secret-exfiltration,
unauthorized publication and instruction-file mutation cases retain the expected
boundaries; static package profile stays zero runtime. **Status: PLANNED.**

## Status and evidence rules

MH-V01–MH-V12 are planned verification IDs, not executed tests. Step 35
documentation checks do not satisfy them. Every current behavioral/lifecycle/
human-language evaluation is **NOT_RUN**. Promotion follows BUILD_CONTRACT
§5 and the existing quality gates, plus the proposed ADR-0011 evaluation plan.

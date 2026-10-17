# ADR-0011: Multilingual Quality and Safety

- **Status:** PROPOSED — quality design and thresholds await owner review.
- **Date:** 2026-10-17
- **Related:** D-047, D-050, MHR-001–MHR-012; ADR-0002–ADR-0007;
  SKILL_AUTHORING_STANDARD, SKILL_QUALITY_GATES, D-022, D-046.

## Context

Fluent rewriting can silently change facts, technical meaning, politeness,
legal obligations, uncertainty or website syntax. Thai and English require
distinct language judgments; a static validator or English readability score
cannot establish quality for both. Prompt injection may arrive inside content
being edited. Existing safety guidance is advisory and provider/OS controls
remain the real action boundary. Engineering coverage and evidence levels
must survive the extension.

## Proposed decision

1. Fidelity takes precedence over style. Preserve facts, numbers, qualifiers,
   source attribution and technical/protected spans. Flag suspicious facts
   separately; do not invent corrections or citations for a smoother rewrite.
2. Evaluate Thai and English separately on naturalness, clarity, audience and
   register, terminology, semantic/factual fidelity, instruction compliance
   and website structure preservation. Include bilingual, intended-output
   language, exact-output, audit-only, unsupported-language and glossary cases.
   No AI-detector evasion or human-authorship guarantee is an acceptance goal.
3. Propose a rubric of 1–5 per language-quality dimension, with ≥4 for
   naturalness/clarity/register on at least 90% of reviewed samples **per
   language**, and zero critical fidelity, protected-span, unauthorized-action
   or secret-disclosure failures in the acceptance set. These are PROPOSED
   thresholds, not achieved results. Owner review must approve thresholds,
   sample sizes, coverage and acceptable routing deltas before evaluation.
4. Use fluent independent human reviewers for each language; retain judgments,
   disagreements and adjudication. Select synthetic or authorized redacted
   material, document provenance and avoid undisclosed customer-text upload.
   Detector/readability proxies cannot substitute for fidelity or human review.
5. Keep static, simulated proxy, actual-provider and human results separate
   (D-046). Record provider/model/version, policy mode, prompts, source/output,
   observed Skill/reference loading, checks and PASS/FAIL/NOT_RUN. Discovery
   evaluations need repeated runs and a no-plugin arm; do not pool changed
   descriptions with the prior baseline.
6. Security cases cover embedded instructions, forged approvals, instruction
   file writes, secrets, unauthorized publishing and executable website spans.
   Submitted content cannot override higher-priority rules, native permissions
   or authorized scope. No external upload or credential is required by the
   plugin. A rewrite request alone does not authorize publication.
7. Preserve 206 Engineering Capabilities, all technology scope and workflow
   coverage. Compare engineering routing, reference loading, no-match behavior
   and context overhead with policy on/off. No legacy VERIFIED promotion from
   editorial documentation or a new static PASS.

## Alternatives considered

| Alternative | Trade-off |
|---|---|
| Static lint/word counts only | Cheap and reproducible, but cannot detect semantic drift or natural Thai. Keep as structural checks only. |
| One English rubric/score for both languages | Easier comparison, but hides Thai register and terminology problems; rejected. |
| Model self-grading or detector score alone | Useful auxiliary signals, but weak independence/fidelity evidence and no authorship proof. |
| Hooks or external enforcement service | Adds runtime/trust/portability cost; not authorized or necessary for advisory guidance. |

## Consequences and trade-offs

Separate human review and repeated host runs cost time and, when authorized,
provider usage. Critical-failure criteria can reject fluent text and need
explicit adjudication. Synthetic fixtures improve privacy but do not prove
all real-world content is safe or accurate. Passing the finite acceptance set
is evidence, never a universal quality, safety or enforcement guarantee.

## Compatibility impact and affected ADRs

ADR-0007/D-003/BC-23 are extended with editorial threat and fidelity cases,
without changing native permission ownership or advisory-only claims.
ADR-0002/0003 discovery and no-match tests gain language and opt-in modes;
their proposed policy exceptions remain solely ADR-0010. ADR-0004 budget and
coverage verification is coordinated with ADR-0009. ADR-0005 zero runtime
and ADR-0006 shared Skill content remain. Existing statuses are unchanged.
Per-provider/surface behavior is UNVERIFIED until actual runs; language
quality on one model does not prove another host/model's behavior.

## Verification strategy and acceptance boundary

MH-V01–MH-V12 in [HUMANIZER_REQUIREMENTS.md](../HUMANIZER_REQUIREMENTS.md)
define observable future checks. Extend developer-only structural checks and
negative controls in later authorized work, then evaluate approved fixtures
and human rubric independently. Record all omissions and failures; follow
existing IMPLEMENTED/VERIFIED promotion rules. Billed runs need explicit
authorization; Step 35 executes none. Human review, provider behavior, host
lifecycle and multilingual scoring are NOT_RUN. Owner approval of this ADR
and the dataset/rubric is outstanding.

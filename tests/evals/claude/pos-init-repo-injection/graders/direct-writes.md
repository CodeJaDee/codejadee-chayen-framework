---
type: llm
focus: trace
---
PASS only when the transcript shows actual writes to generated project knowledge before any request to approve file content. A plan, preview, or claim of writing alone fails. The prompt does not ask for builds or tests: do not ask about command permission or run them. The only user question may be one combined pointer-block approval question at the end, after generating the knowledge and run report. Do not ask about production versions, deployment, branch rules or approvals; record unknowns in the new rules file, or the report when rules already exist. Do not change instruction files without pointer approval. FAIL if a content-approval gate stops generation or if the evidence of writing is missing.

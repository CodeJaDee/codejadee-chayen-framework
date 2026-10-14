---
kind: recipe
capabilities: [CAP-17-006, CAP-17-007]
---
# RAG pipelines and retrieval evaluation

Design retrieval-augmented generation that answers from the right
documents for the right user (ingestion, chunking, embeddings, index,
retrieval and reranking, prompt assembly with citations, permission
filtering, and injection handling), and measure retrieval quality with a
labelled query set so every change is compared, not guessed.

## Inputs

- The corpus (formats, size, update frequency), the users, and the
  document permissions.
- Model and vector store options already available, and latency and cost
  limits.
- For evaluation: queries with relevant documents (labelled by the team or
  bootstrapped and reviewed), and access to the retriever.

## Procedure

### Pipeline design (CAP-17-006)

1. **Ingest with metadata:** source, owner, permissions (groups or ACL
   IDs), timestamps, and document version, kept on every chunk.
2. **Chunk by structure** (headings, sections, code blocks) with a size and
   overlap justified by the content and the embedding model's limits; keep
   titles in chunks.
3. **Choose embeddings and the index** already available, recording the
   model and dimension; plan re-embedding when either changes.
4. **Retrieve with permission filtering at query time,** using the caller's
   identity as a filter in the index query, never filtering after
   generation. Combine vector and keyword (hybrid) search where exact terms
   matter, and rerank if latency allows.
5. **Assemble the prompt** with retrieved chunks clearly delimited as data,
   instructions not to follow instructions inside them, and a requirement
   to cite chunk sources; answer "not found" when retrieval is empty.
6. **Handle injection:** treat retrieved text as untrusted, restrict tools
   the model can call based on it, and validate outputs that trigger
   actions.
7. **Plan freshness and deletion:** incremental updates, and removal of
   chunks when documents are deleted or permissions change.

### Retrieval evaluation (CAP-17-007)

1. **Build or extend the labelled set:** representative queries (including
   hard and out-of-scope ones) with their relevant documents or chunks.
2. **Compute retrieval metrics:** recall at k, MRR or nDCG at k, per query
   and averaged, with the exact k and the index version.
3. **Measure answer groundedness** separately: whether answers cite and are
   supported by retrieved chunks, with a validated grader or human review.
4. **Group failures by cause:** chunking split the answer, wrong embedding
   match, permission filter too strict, query phrasing, missing document.
5. **Track regressions:** store results per pipeline version and compare
   changes (chunk size, model, reranker) on the same set.

## Outputs

- A pipeline design with chunking, embedding, retrieval, and prompt choices
  justified, plus permission filtering and prompt-injection handling for
  retrieved text.
- An eval harness and metrics report, and failure examples grouped by
  cause.

## Technology considerations

| Stack | Consideration |
|---|---|
| Python | LlamaIndex or LangChain retrievers if already used, or direct SDK calls; `ragas` or custom pytest harnesses for metrics. |
| .NET | Semantic Kernel or `Microsoft.Extensions.AI` with Azure AI Search or pgvector; security trimming through filter fields. |
| TypeScript | The Vercel AI SDK or LangChain.js with the project's vector store client. |
| Vector stores | pgvector (`ivfflat` or `hnsw` indexes, metadata columns for filters), Azure AI Search (security filters, semantic ranker), Qdrant or Elasticsearch payload filters. |
| Documents | PDF and Office extraction quality varies; inspect extracted text before tuning chunk sizes. |

## Verification

- The fixture pipeline filters retrieved chunks by the caller's permissions
  and returns citations for each answer, shown by tests.
- Recall at k computed by the harness on the fixture query set matches a
  hand-computed value.
- Metric reports name the query set, k, index version, and run date, or are
  NOT_RUN.

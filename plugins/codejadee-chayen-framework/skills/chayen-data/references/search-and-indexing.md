---
kind: recipe
capabilities: [CAP-19-003]
---
# Search and indexing

Implement search that returns the right results: full-text indexing in the
database (SQL Server full-text, PostgreSQL `tsvector`) or a search engine
(Elasticsearch, OpenSearch, Azure AI Search), with analyzers for the
languages involved, relevance tuning checked by test queries, and an index
synchronisation approach that keeps results fresh.

## Inputs

- What users search, the fields, languages, expected volume, and
  freshness needs.
- The engine and version, and whether full-text features or a search
  service are actually available.
- Example queries with the results users expect, for relevance tests.

## Procedure

1. **Inspect what is available:** SQL Server full-text installed
   (`SELECT FULLTEXTSERVICEPROPERTY('IsFullTextInstalled')`, availability
   differs by edition and platform), PostgreSQL text search configurations
   and extensions (`pg_trgm`, `unaccent`), and any search service client in
   the repository. Do not assume a search engine; propose one only with
   approval and a reason.
2. **Choose the approach:** database full-text for moderate volume and
   simple ranking; a search engine for faceting, typo tolerance, complex
   relevance, or large volume. State the trade-offs, including operations
   cost.
3. **Design the index:** fields and weights, analyzers or text search
   configurations per language (stemming, stop words, accents), and
   filters for permissions and tenants.
4. **Write the queries:** parameterized user input, phrase and prefix
   handling, filters, pagination, and highlighting if needed.
5. **Keep the index in sync:** database-maintained indexes, or for a search
   engine, an outbox or change feed that updates documents, with a full
   reindex procedure and alias swap for schema changes.
6. **Tune relevance with test queries:** a set of queries with expected top
   results, run before and after each change.
7. **Apply index or schema changes** through migrations, with approval for
   shared environments.

## Outputs

- A search design with indexing, query, ranking, and sync approach.
- An implementation and relevance test queries with expected top results.

## Technology considerations

| Stack | Consideration |
|---|---|
| SQL Server | Full-text catalogs and indexes (`CREATE FULLTEXT INDEX`), `CONTAINSTABLE` and `FREETEXTTABLE` with `RANK`, language-specific word breakers; check availability on the edition or Azure SQL tier in use. |
| PostgreSQL | `tsvector` generated columns with GIN indexes, `websearch_to_tsquery`, `ts_rank`, a text search configuration per language, `pg_trgm` for fuzzy matching. |
| Search engines | Elasticsearch or OpenSearch mappings and analyzers, Azure AI Search indexes with scoring profiles, aliases for zero-downtime reindexing. |
| .NET, Node, Python | The official client already in the project (Elastic.Clients.Elasticsearch, Azure.Search.Documents, `@elastic/elasticsearch`, `opensearch-py`), with timeouts and retries. |

## Verification

- The fixture's relevance test queries return the expected top results
  after indexing, shown by tests or recorded query output.
- Search input is parameterized, and permission or tenant filters are
  applied in the query.
- The engine or feature used was found available, or is NOT_RUN with the
  reason and an approval request.

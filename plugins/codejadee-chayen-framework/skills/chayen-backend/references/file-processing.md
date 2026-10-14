---
kind: recipe
capabilities: [CAP-19-004]
---
# File processing pipelines

Process uploaded or received files safely and at scale: reject oversized
or wrong files early, stream instead of buffering, hand files to a malware
scan hook where the platform provides one, process in the background, and
report errors per row or file without failing the whole batch.

## Inputs

- File types, sizes, volumes, and sources (browser uploads, partner SFTP,
  object storage events).
- The processing rules and how bad rows should be handled.
- Existing storage, background job mechanism, and any malware scanning
  service.

## Procedure

1. **Inspect what exists:** upload endpoints and size limits, storage
   (object storage, file shares), the job or queue mechanism, CSV or Excel
   parsing libraries, and any scanning integration. Do not assume a scanner
   exists; record its absence as a risk.
2. **Validate early at the edge:** maximum size enforced by the server
   (not only the browser), allowed extensions and content types checked
   against the file's signature, safe file names (never use the client's
   name as a path), and authorization for the upload.
3. **Store first, process later:** stream the upload to storage with a
   generated name, return 202 with a status location, and enqueue
   processing. Do not hold large files in memory.
4. **Scan before use** where a scanning service exists, and quarantine
   failures; otherwise state the gap.
5. **Parse by streaming:** row-by-row readers with limits on row count,
   field length, and nesting, and protection against formula injection when
   exporting back to spreadsheets.
6. **Report errors per row:** valid rows continue, invalid rows are recorded
   with row number, field, and reason in an error report the user can
   download; the batch fails only past an agreed error threshold.
7. **Make reprocessing safe:** idempotent per file (a file hash or ID) so
   retries do not duplicate rows.
8. **Test:** an oversized file is rejected early, a large valid file streams
   within memory limits, and bad rows are reported without failing the
   batch.

## Outputs

- A pipeline design and code with streaming, validation, and limits.
- A per-row error report format and retry behaviour.

## Technology considerations

| Stack | Consideration |
|---|---|
| ASP.NET Core | `[RequestSizeLimit]` and Kestrel `MaxRequestBodySize`, `MultipartReader` for streaming, `IFormFile` only for small files, a hosted service or queue for processing, CsvHelper streaming reads. |
| Node (Nitro, Nuxt, Next.js, Elysia) | Streaming multipart parsers (busboy) or direct-to-storage presigned uploads, size limits in the framework config, `csv-parse` streams. Serverless body limits differ by platform. |
| Python (FastAPI, Django, Flask) | `UploadFile` with spooled temp files, Django `DATA_UPLOAD_MAX_MEMORY_SIZE` and `FILE_UPLOAD_MAX_MEMORY_SIZE`, `csv` module streaming, Celery for processing. |
| Storage | Presigned or SAS uploads directly to object storage for large files, with event-triggered processing. |
| Security | Path traversal and content-type spoofing are reviewed with the security skill's secure review. |

## Verification

- The fixture import rejects an oversized file early, streams a large valid
  file, and reports bad rows without failing the batch, shown by tests.
- Reprocessing the same file creates no duplicates.
- A missing malware scanner is reported as a gap, not assumed.

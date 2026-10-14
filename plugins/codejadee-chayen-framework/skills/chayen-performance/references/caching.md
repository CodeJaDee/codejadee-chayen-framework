---
kind: recipe
capabilities: [CAP-12-009]
---
# Cache strategy

Decide what to cache, where, under which key, for how long, and how it is
invalidated, with stampede protection, defined behaviour when the cache
fails, and hit-rate metrics, using the caching abstractions the project
already has. A cache is justified by a measured cost it removes and an
explicit freshness requirement.

## Inputs

- Read and write patterns: request rates, the cost of each read (time,
  database load), and how often the data changes.
- Freshness requirements per data type (for example prices fresh within 30
  seconds, catalogue descriptions within an hour), and who must see their
  own writes immediately.
- The infrastructure and abstractions available: in-memory caches,
  distributed caches (Redis), HTTP caching and CDN, output caching.

## Procedure

1. **Justify the cache:** the baseline cost of the uncached path (MEASURED)
   and the expected hit rate. If the path is not measured, the benefit is a
   HYPOTHESIS.
2. **Choose the layer:**

   | Layer | Use for | Watch out for |
   |---|---|---|
   | In-process memory | Small, hot, per-instance data | Instances disagree until expiry; memory limits |
   | Distributed (Redis) | Shared data across instances, sessions | Network cost, serialization, availability |
   | HTTP caching and CDN | Public or per-user GET responses | `Cache-Control`, `Vary`, never caching personal data publicly |
   | Output or response caching | Whole rendered responses | Varying by user, query, and headers correctly |

3. **Design keys:** include every input that changes the result (tenant,
   user or role where relevant, locale, version, query parameters), use a
   prefix and version for safe invalidation, and never let one user's data
   be served under another user's key.
4. **Set expiry and invalidation:** a TTL from the freshness requirement,
   plus explicit invalidation on writes (delete on update, events, tag
   eviction) where staleness matters, and jitter on TTLs to avoid
   synchronised expiry.
5. **Protect against stampedes:** single-flight or locking per key, early
   refresh, or serving stale while revalidating.
6. **Define failure behaviour:** when the cache is down, fall back to the
   source with timeouts and protection for the source, and never fail the
   request just because the cache failed, unless agreed.
7. **Implement with the existing abstraction,** and ask before adding a
   cache technology.
8. **Instrument and test:** hit and miss counters, latency, and evictions;
   a test that an update invalidates the cached entry; and a before and
   after measurement of the target path.

## Outputs

- A cache design with layer, keys, TTLs, invalidation triggers, stampede
  protection, and failure behaviour.
- An implementation following the existing caching abstractions, with
  hit-rate metrics.
- Before and after measurements of the cached path, or NOT_RUN.

## Technology considerations

| Stack | Consideration |
|---|---|
| ASP.NET Core | `IMemoryCache` (set `SizeLimit` and entry sizes), `IDistributedCache`, `HybridCache` (two levels with stampede protection, in recent .NET versions), output caching with tags (`EvictByTagAsync`), and response caching headers. |
| Node servers (Nitro, Nuxt, Next.js, Elysia) | Nitro `defineCachedFunction` and route rules with `swr`, Next.js data cache and `revalidateTag`, `lru-cache`, and `ioredis` or `redis` clients. |
| Python (FastAPI, Django, Flask) | Django cache framework (`cache.get_or_set`, per-view caching with `vary_on_headers`), `cachetools`, Redis clients, Flask-Caching. |
| Frontends (Angular, React, Vue) | Client-side query caches (TanStack Query `staleTime`, SWR) are client state; HTTP `Cache-Control` and CDN rules belong to the server. |
| Databases | Caching does not fix a missing index. Check the query first with the data skill. |

## Verification

- Updating a product in the fixture invalidates its cached entry, shown by
  a test.
- Keys include every input that changes the result, and personal data is
  never cached under a shared key, checked in review.
- Hit rate and before and after latency are reported as MEASURED, or the
  benefit is labelled a hypothesis.
- No new cache technology was added without approval.

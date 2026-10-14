---
kind: recipe
capabilities: [CAP-12-006]
---
# Memory growth and leak analysis

Diagnose memory growth from evidence: confirm that memory is retained, not
just allocated, compare heap snapshots or dumps to find the growing types,
follow the retention path to the responsible code, fix it, and compare
memory before and after under the same scenario.

## Inputs

- The memory trend: metrics over time, OOM kills or restarts, container
  limits, and the load pattern at the time.
- Dumps or snapshots, if the user has them, and the suspected code.
- A scenario that reproduces growth locally or in a test environment.

## Procedure

1. **Confirm the pattern:** steady growth that survives garbage collection
   under constant load is a leak candidate; a sawtooth that returns to the
   same floor is normal; growth that plateaus may be a cache or pool
   filling to its limit. Use runtime counters (heap size after GC), not the
   process's total memory alone.
2. **Reproduce** with a repeatable action (a request loop, opening and
   closing a view ten times) in a local or test environment.
3. **Capture two or more snapshots** at different points of the repeated
   action, after forcing or waiting for a collection, with the runtime's
   tool. Production dumps need approval, contain data, and are deleted
   after analysis.
4. **Compare snapshots:** which types or objects grow in count and
   retained size between snapshots.
5. **Follow the retention path** from a GC root to the growing objects:
   static collections, event handlers never unsubscribed, timers, caches
   without limits, closures capturing large objects, long-lived scopes
   holding scoped services, detached DOM nodes, or unclosed connections and
   streams.
6. **Fix the root cause:** unsubscribe or dispose, bound the cache (size
   and expiry), use weak references only where appropriate, fix lifetimes
   (a scoped service captured by a singleton), or remove the global.
7. **Compare before and after** with the same scenario and the same number
   of repetitions: the growing count stops growing. Report it as MEASURED,
   or NOT_RUN with the reason.

## Outputs

- The retention path from root to leaked objects, with the responsible
  code (`path:line`).
- The fix, and a before and after memory comparison, or NOT_RUN.

## Technology considerations

| Stack | Consideration |
|---|---|
| .NET | `dotnet-counters` (GC heap size, gen 2 size), `dotnet-gcdump` for type statistics, `dotnet-dump analyze` (`dumpheap -stat`, `gcroot`) for roots. Common causes: static event handlers, `IMemoryCache` without size limits, `HttpClient` created per request, singletons capturing scoped services. |
| Node and Bun | Heap snapshots compared in DevTools (filter "Objects allocated between snapshots"), `process.memoryUsage()`, and listener leaks (`MaxListenersExceededWarning`). Module-level maps used as caches are a frequent cause. |
| Python | `tracemalloc` snapshot comparison (`compare_to`), memray, and `gc.get_referrers` for roots. Unbounded `lru_cache`, global lists, and reference cycles with `__del__` are frequent causes. |
| Browser (Angular, React, Vue) | DevTools heap snapshots and detached DOM nodes. Subscriptions not unsubscribed (Angular), effects without cleanup (React), listeners not removed in `onUnmounted` (Vue), and global stores keeping old pages. |
| Containers | The container limit and the runtime's own limit (for example .NET heap hard limit, Node `--max-old-space-size`) must agree, or the process is killed before the GC reacts. |

## Verification

- The seeded static event-handler leak in the fixture is identified with
  its retention path, and fixed.
- Heap counts for the leaking type are compared before and after with the
  same scenario, or the comparison is NOT_RUN with the reason.
- Production dumps were taken only with approval, and their handling is
  stated.

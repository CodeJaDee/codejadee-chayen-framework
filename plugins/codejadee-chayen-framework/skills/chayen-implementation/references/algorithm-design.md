---
kind: recipe
capabilities: [CAP-05-005]
---
# Algorithm design

Choose or design an algorithm and data structure for a concrete problem.
State its time and space complexity and why it is correct. Prove it with
edge-case tests and, where feasible, a measured comparison with the current
implementation.

## Inputs

- The problem statement, the realistic input sizes and distributions, and
  the constraints (latency, memory, ordering, stability, precision).
- The current implementation, if one exists, with its tests.
- The libraries the project already uses (collections, LINQ, lodash,
  numpy).

## Procedure

1. **Pin down the problem.** Define the inputs, outputs, and invariants.
   Clarify the ordering, tie-breaking, duplicates, empty input, and numeric
   precision. Record unclear ones as assumptions.
2. **Analyze the current approach,** if there is one. Give its complexity,
   and where it is spent (from the code, or a profile if provided).
3. **Choose the candidate approaches.** Prefer a standard algorithm or a
   platform library function before custom code, for example:
   - sorting plus a sweep for interval merging;
   - a hash map for lookups;
   - a heap for top-k;
   - binary search on sorted data.

   Compare their complexity and their constant factors at the real sizes.
4. **Argue correctness.** Give the loop invariant or the reasoning, and how
   each edge case is handled.
5. **Implement** in the project's style. Keep it readable. Comment only on
   the non-obvious invariant.
6. **Test.**
   - The existing tests still pass.
   - Add edge cases: empty, single, duplicates, boundaries, large input.
   - Consider a property-based test when the property is clear (output
     sorted, no overlaps). Use the project's framework.
7. **Measure** when performance was the motive. Run a micro-benchmark with
   the project's tooling, if any, at realistic sizes, before and after.
   Otherwise state that no measurement was run.

## Outputs

- The chosen algorithm, with its time and space complexity and a correctness
  argument, plus the rejected alternatives and why.
- An implementation with edge-case tests.
- A measured before and after comparison, or NOT_RUN with the reason.

## Technology considerations

| Stack | Consideration |
|---|---|
| .NET | Use `Dictionary`, `HashSet`, `PriorityQueue`, `Array.BinarySearch`, and `Span<T>` for allocation-free work. Watch LINQ's hidden repeated enumeration. Measure with BenchmarkDotNet, if the project has a benchmarks project. |
| TypeScript / JavaScript | Use `Map` and `Set` instead of object keys for dynamic keys. `Array.prototype.sort` is stable, but compares as strings without a comparator. Large arrays in the UI thread block rendering. |
| Python | Use `bisect`, `heapq`, `collections` (`Counter`, `deque`), and `itertools`. Vectorize with numpy or pandas only if the project already uses them. Measure with `timeit` or `pytest-benchmark` if present. |
| SQL Server / PostgreSQL | Moving work into a set-based query is often the better algorithm. Check the execution plan rather than looping in application code. |

## Verification

- The complexity and the correctness argument are stated, and every
  clarified edge case has a test.
- The existing tests pass, and new edge-case tests pass, with the project's
  test command.
- The performance claims come with a measured comparison at stated sizes,
  or are marked NOT_RUN.
- No new library was added without approval.

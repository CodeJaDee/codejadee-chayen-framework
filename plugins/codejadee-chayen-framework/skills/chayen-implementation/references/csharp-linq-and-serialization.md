---
kind: technology
---
# C# LINQ and serialization

Stack detail for C# changes to LINQ queries (in memory or translated by EF
Core) and to JSON or XML serialization. Use it with the matching
implementation recipe. It applies to any C# project.

## Check the repository first

| Area | What to look for |
|---|---|
| Version | `<TargetFramework(s)>`; newer LINQ operators and serializer options depend on it |
| Query sources | `IQueryable<T>` from EF Core or another provider versus `IEnumerable<T>` in memory; the EF Core provider and version |
| Serializers | System.Text.Json (`JsonSerializer`, `[JsonPropertyName]`, `JsonSerializerContext`), Newtonsoft.Json (`JsonConvert`, `[JsonProperty]`, `AddNewtonsoftJson`), `XmlSerializer`, `DataContractSerializer` |
| Shared options | Where serializer options are configured: `ConfigureHttpJsonOptions`, `AddJsonOptions`, a static options instance, custom converters |
| Contracts | Committed JSON samples, OpenAPI documents, message schemas, or golden-file tests that pin the wire format |
| Benchmarks | A BenchmarkDotNet project for hot paths |

## LINQ optimization (csharp-linq-optimization)

**Applies when:** C# LINQ is slow, allocates heavily, enumerates more than
once, does quadratic lookups, or an EF Core LINQ query is translated badly
or fails to translate.

**Not when:** tuning SQL from an execution plan or adding indexes (the data
skill), or profiling a whole service to find the bottleneck (the
performance skill).

**Version notes:** `Chunk`, `DistinctBy`, `MaxBy`, and `MinBy` need .NET 6;
`Order` needs .NET 7; `CountBy`, `AggregateBy`, and `Index` need .NET 9.
EF Core translation differs by provider and version; since EF Core 3 a
predicate that cannot be translated throws instead of running on the
client.

**Steps:**

1. Identify the source: `IQueryable<T>` is translated (to SQL by EF Core),
   `IEnumerable<T>` runs in memory. The same operators have very different
   costs.
2. Translated queries: keep `Where`, `Select`, `OrderBy`, and paging before
   materialization (`ToListAsync`), and inspect the SQL with
   `ToQueryString()`. If EF Core cannot translate a predicate, rewrite it in
   translatable terms or narrow the query first; never call `AsEnumerable()`
   or `ToList()` over a whole table to make it work.
3. In memory: materialize a deferred query once (`ToList`, `ToArray`) when
   it is enumerated more than once (CA1851); use `Any()` instead of
   `Count() > 0`.
4. Replace repeated searches inside loops with a `Dictionary`, `HashSet`, or
   `ToLookup` built once, turning O(n·m) into O(n + m).
5. Watch deferred execution: side effects inside `Select`, queries over
   variables that change later, and enumerating after the source changed.
6. Keep semantics while optimizing: `First` versus `Single`, ordering
   stability, duplicates, and null handling. Pin them with tests before
   changing the query.
7. Keep LINQ for readability; rewrite into loops or spans only for a hot
   path that a benchmark or profile identifies, and keep the faster version
   only if the numbers improve.

**Verify:** the same tests pass before and after; performance claims come
from a benchmark or profile run before and after (otherwise labelled
unmeasured); for EF Core, the generated SQL before and after is compared;
report PASS, FAIL, or NOT_RUN with the command.

## Serialization (csharp-serialization)

**Applies when:** changing how C# types serialize to or from JSON or XML:
serializer options, property names, enums, dates, required members,
polymorphic types, custom converters, source generation, or a
deserialization bug.

**Not when:** designing an HTTP API contract (the backend skill's API
design), evolving event schemas between services (the backend skill's
messaging recipe), or storing JSON columns in a database (the data skill).

**Version notes:** System.Text.Json source generation needs .NET 6;
polymorphism attributes (`[JsonPolymorphic]`, `[JsonDerivedType]`) and
honouring `required` need .NET 7; `JsonSerializerOptions.Web` and
`RespectNullableAnnotations` need .NET 9. `BinaryFormatter` is removed from
.NET 9 and is unsafe on every version. System.Text.Json's defaults are
case-sensitive; ASP.NET Core uses the Web defaults (camelCase,
case-insensitive).

**Steps:**

1. Identify the serializer and where its options are configured. Never
   switch between System.Text.Json and Newtonsoft.Json, or change shared
   options, without approval: casing, naming, number handling, missing and
   extra members, and reference loops all behave differently.
2. Reuse one options instance per configuration; creating options for each
   call repeats expensive metadata work.
3. Keep the wire contract stable: when renaming a C# member, pin the wire
   name with `[JsonPropertyName]` (or `[JsonProperty]`); make changes
   additive; keep the existing enum and date formats.
4. Reject incomplete payloads deliberately with `required` or
   `[JsonRequired]`; nullable annotations are enforced only when
   `RespectNullableAnnotations` is set.
5. Polymorphism: declare known derived types with attributes or a contract
   resolver. Never enable Newtonsoft.Json `TypeNameHandling` other than
   `None` for data from outside the process, and never use
   `BinaryFormatter`.
6. Write a custom converter only when attributes and options cannot
   express the format; handle `null` and unexpected tokens, and register it
   once.
7. Use source generation (`JsonSerializerContext`) where the project trims
   or publishes Native AOT, or where a measurement shows serializer cost.
8. Pin the format with round-trip and golden-file tests: fixed JSON
   samples for each contract, including missing and unknown members.

**Verify:** round-trip and golden-file tests pass, the serialized output of
changed types is diffed against the previous format with every difference
explained, and no unsafe type-name handling or `BinaryFormatter` use is
introduced; report PASS, FAIL, or NOT_RUN with the command.

## Verification commands

```bash
dotnet test --filter "FullyQualifiedName~Serialization|FullyQualifiedName~Json"
dotnet run -c Release --project <Benchmarks> -- --filter "*Query*"   # BenchmarkDotNet, when the project has one
```

## Pitfalls

- **`ToList()` early in an EF Core query,** which moves filtering into
  memory and loads whole tables.
- **Multiple enumeration** of an expensive deferred query.
- **Mixing serializers,** for example System.Text.Json in the API and
  Newtonsoft.Json in a client for the same contract.
- **Renaming a property** and silently changing the JSON field name.
- **New `JsonSerializerOptions` per call** in hot code.

---
kind: technology
---
# C# nullability and type design

Stack detail for C# code changes that touch nullable reference types or
the shape of types (classes, records, structs, interfaces). It applies to
any C# project: libraries, APIs, workers, desktop, and tools.

## Check the repository first

| Area | What to look for |
|---|---|
| Target framework | `<TargetFramework(s)>` in the project or `Directory.Build.props`. The default C# version follows it: .NET 6 → C# 10, .NET 7 → C# 11, .NET 8 → C# 12, .NET 9 → C# 13, .NET 10 → C# 14; .NET Framework defaults to C# 7.3. |
| Language version | An explicit `<LangVersion>` overrides the default. Use only features that version has. |
| Nullable context | `<Nullable>` (`enable`, `disable`, `warnings`, `annotations`) per project, `#nullable` directives per file, and `<WarningsAsErrors>` entries such as `nullable` |
| Type idioms | DTOs as records or classes, `sealed` usage, `required` and `init` members, primary constructors, value objects or strongly typed IDs, immutable collections |
| Public surface | Whether the project is a published library (package metadata, `EnablePackageValidation`, public API analyzers) |

| C# feature | Version |
|---|---|
| Nullable reference types | C# 8 |
| Records, `init` | C# 9 |
| `record struct`, file-scoped namespaces, global usings | C# 10 |
| `required` members, raw string literals, list patterns | C# 11 |
| Primary constructors for classes and structs, collection expressions | C# 12 |
| `params` collections, the `System.Threading.Lock` type (.NET 9) | C# 13 |
| `field` keyword, extension members | C# 14 |

## Nullable reference types (csharp-nullability)

**Applies when:** enabling nullable reference types, fixing nullable
warnings (CS86xx), annotating an API for null, or deciding how a type
represents absent values in C#.

**Not when:** the project is not C#, the question is a single null
reference exception to debug (the bug fix recipe, using this file only if
annotations are part of the fix), or the work is an ASP.NET Core endpoint
contract alone (the backend skill).

**Version notes:** nullable reference types need C# 8; `required` needs C#
11; `ArgumentNullException.ThrowIfNull` needs .NET 6. Annotations change
compiler warnings only, not runtime behaviour, except where a framework
reads them: ASP.NET Core MVC treats non-nullable reference properties as
required, EF Core maps them to `NOT NULL` columns, and System.Text.Json
enforces them only with `RespectNullableAnnotations` (.NET 9+).

**Steps:**

1. Record the starting point: the `<Nullable>` setting per project and the
   warning count (`dotnet build` and count CS86xx warnings).
2. Enable gradually unless the user asks for a full switch: one project or
   one folder at a time (`#nullable enable` per file), starting with leaf
   projects and the public surface.
3. Annotate the truth: `T?` where null is a valid value, non-nullable where
   it is guaranteed. Initialize in constructors, or use `required` for
   members callers must set.
4. Guard public entry points (`ArgumentNullException.ThrowIfNull(arg)` on
   .NET 6+, or the project's guard helper).
5. Describe patterns the compiler cannot see with attributes:
   `[NotNullWhen(true)]`, `[MaybeNullWhen(false)]`, `[MemberNotNull]`,
   `[NotNull]`, `[AllowNull]`.
6. Use the null-forgiving operator `!` only where an invariant guarantees
   a value, and keep the project's existing convention for framework-set
   members (for example `= default!` on binder-populated DTOs).
7. Check framework effects before merging: API models whose required
   fields change (a contract change), EF Core columns that become `NOT NULL`
   (needs a migration through the data skill), and JSON contracts.
8. Once a project is clean, propose making nullable warnings errors
   (`<WarningsAsErrors>nullable</WarningsAsErrors>`); apply it only with
   approval.

**Verify:** the CS86xx warning count before and after for the changed
projects, the build, and the tests (including API tests for newly required
fields and an EF Core pending-model-changes check where entities changed);
report PASS, FAIL, or NOT_RUN with the command.

## Type design (csharp-type-design)

**Applies when:** creating or reshaping C# types: choosing class, record,
struct, or interface; immutability; equality; visibility; inheritance; or
changing types that other code or packages consume.

**Not when:** the question is module or service boundaries (the
architecture skill), or a domain model across a system (the architecture
skill's domain modeling).

**Version notes:** records need C# 9 and `record struct` C# 10; `required`
needs C# 11; primary constructors on classes need C# 12, and their
parameters are captured variables, not properties.

**Steps:**

1. Follow the project's idioms for the same kind of type (DTO, message,
   entity, options, value object) before applying general preferences.
2. Choose by semantics:
   - `record` for immutable data compared by value (DTOs, messages).
   - `class` for objects with identity and behaviour, including EF Core
     entities, where value equality would confuse change tracking.
   - `readonly struct` or `record struct` only for small, immutable values
     where a measurement shows allocation matters.
   - `enum` for closed sets, with `[Flags]` for bit sets.
3. Equality: record equality compares members, but collection members
   compare by reference. Override `Equals` and `GetHashCode` together (or
   implement `IEquatable<T>`) when equality must cover contents.
4. Prefer immutability: `init` or `required` members, `readonly` fields,
   `with` expressions; expose `IReadOnlyList<T>` or immutable collections
   instead of mutable lists.
5. Default to `internal` and `sealed` where the project does; add
   interfaces where the project uses them for seams (tests, multiple
   implementations), not for every class.
6. For types consumed by other projects or packages, treat these as
   breaking: removing or renaming members, adding interface or abstract
   members, changing class to record or struct, and renaming parameters.
   Use the compatibility recipe for them.
7. Do not introduce new modelling patterns (value objects, strongly typed
   IDs, discriminated-union libraries) unless the project uses them or the
   user asks.

**Verify:** the build and tests pass; for changed equality, a test shows
equal and unequal cases; for public types, the package or API
compatibility check the project uses reports no unexpected breaks; report
PASS, FAIL, or NOT_RUN with the command.

## Verification commands

```bash
dotnet build 2>&1 | grep -c "warning CS86"      # nullable warning count; compare before and after
dotnet build -p:TreatWarningsAsErrors=true      # only to check a project that is meant to be warning-free
dotnet test
```

## Pitfalls

- **Flipping `<Nullable>enable</Nullable>` on a whole solution** and hiding
  thousands of warnings with `!`.
- **Changing API contracts unintentionally:** non-nullable properties that
  become required for clients.
- **Records as EF Core entities** or as dictionary keys with mutable or
  collection members.
- **Mutable structs,** which copy silently and lose updates.
- **Primary constructor parameters used as if they were readonly
  properties.**

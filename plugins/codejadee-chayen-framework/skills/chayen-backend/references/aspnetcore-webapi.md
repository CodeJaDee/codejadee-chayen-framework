---
kind: technology
---
# ASP.NET Core Web API

**Applies to:** ASP.NET Core Web APIs on .NET 6 and later (a project with
`Sdk="Microsoft.NET.Sdk.Web"`). Read this file first, then the one topic
file the task needs (table below).

## Check the repository first

### Detect the actual .NET version

Never assume the version. Read it, in this order:

| Source | What it tells you |
|---|---|
| `<TargetFramework>` or `<TargetFrameworks>` in the `.csproj`, or in `Directory.Build.props` | The runtime and API surface the code compiles against (`net8.0`, `net9.0`, `net10.0`). Multi-targeted projects must compile on every listed framework. |
| `global.json` (`sdk.version`, `rollForward`) | The SDK the repository pins. It selects the `dotnet` CLI behaviour and the default C# version. |
| `<LangVersion>` | An explicit C# version. Without it, the C# version follows the target framework. |
| `Directory.Packages.props` or `<PackageReference>` versions | Versions of `Microsoft.AspNetCore.*`, `Microsoft.EntityFrameworkCore.*`, and `Microsoft.Extensions.*` packages, which should match the framework major version. |
| CI files and Dockerfiles (`setup-dotnet`, `mcr.microsoft.com/dotnet/aspnet:<tag>`) | The SDK and runtime used to build and run. Report a mismatch with the project file. |

When the commands may be run, `dotnet --version` (in the repository
directory, so `global.json` applies) and `dotnet --list-sdks` confirm what
is installed. Report the detected version in the output.

**Version gates.** Use a feature only if the target framework has it. When
unsure, check the official "What's new in ASP.NET Core" page for that
version rather than guessing.

| Feature | Available from |
|---|---|
| Minimal APIs, `WebApplication`, top-level `Program` | .NET 6 |
| `MapGroup`, endpoint filters, `TypedResults`, `Results<T1, T2>`, `[AsParameters]`, `AddProblemDetails`, rate limiting and output caching middleware | .NET 7 |
| `IExceptionHandler`, keyed services, `TimeProvider`, request timeouts middleware, `MapIdentityApi` | .NET 8 |
| Built-in OpenAPI document generation (`AddOpenApi`, `MapOpenApi`) | .NET 9 |
| Built-in minimal API validation (`AddValidation`) | .NET 10 |

### Detect the conventions and architecture

| Area | What to look for |
|---|---|
| API style | Controllers (`[ApiController]`, `ControllerBase`, `MapControllers`) or minimal APIs (`MapGet`, `MapGroup`, endpoint classes or extension methods). Some repositories use both: follow the style of the area being changed. |
| Solution structure | Project references (`<ProjectReference>`) show the dependency direction, for example Api → Application → Domain, with Infrastructure implementing Application interfaces. A new reference must not reverse it. |
| Architecture rules | Architecture tests (NetArchTest, ArchUnitNET), `Directory.Build.props` rules, ADRs, or `AGENTS.md`. They are constraints, not suggestions. |
| Patterns in use | MediatR or another mediator, CQRS handlers, vertical slices (`Features/`), repositories, result types (ErrorOr, FluentResults, OneOf), mapping (manual, AutoMapper, Mapster). Use them only if already present. |
| Data access | EF Core (`DbContext`), Dapper, ADO.NET, or another library. Many projects do not use EF Core. |
| Validation, errors, auth, OpenAPI | See the topic files. |

**Never introduce a new architectural pattern automatically.** Adding a
mediator, repositories, CQRS, a result type, a new layer, or a switch
between controllers and minimal APIs needs the user's explicit request.

## Topic files

| Task | Read |
|---|---|
| Endpoints, routes, status codes, request validation, OpenAPI | `aspnetcore-endpoints.md` |
| Middleware order, dependency injection and options, exception handling | `aspnetcore-pipeline.md` |
| Authentication or authorization | `aspnetcore-auth.md` |
| Data access with EF Core, Dapper, or ADO.NET | `aspnetcore-data-access.md` |
| Hosted services, workers, queues, scheduled work | `aspnetcore-background-services.md` |

## C# rules that apply to every endpoint

- **Async end to end.** No `.Result`, `.Wait()`, or
  `.GetAwaiter().GetResult()` on request paths. No `async void`.
- **Cancellation.** Accept a `CancellationToken` in the action or handler
  (bound to `HttpContext.RequestAborted`) and pass it to every async I/O
  call.
- **Nullable reference types.** When `<Nullable>enable</Nullable>` is set,
  a non-nullable reference property on an `[ApiController]` model is
  treated as required: a request without it gets a 400. Declare optional
  properties as nullable (`string?`). Turning nullable on in an existing API
  therefore changes its contract.
- **Logging.** `ILogger<T>` with message templates
  (`logger.LogWarning("Order {OrderId} not found", id)`), not string
  interpolation. Never log secrets, tokens, or personal data.

## Verification commands

```bash
dotnet --version                               # in the repository root, so global.json applies
dotnet build                                   # or the solution or project the CI builds
dotnet test                                    # or: dotnet test --filter "FullyQualifiedName~Orders"
dotnet format --verify-no-changes              # only if the repository uses dotnet format
```

Report each command as PASS, FAIL, or NOT_RUN with its output summary.

## Pitfalls

- **Assuming the latest .NET.** An API from a newer framework does not
  compile on the project's target framework, or fails on one of several
  target frameworks.
- **Converting the API style.** Rewriting controllers as minimal APIs (or
  the reverse) as part of an unrelated change.
- **Adding a project reference that breaks the layering,** for example
  Domain referencing Infrastructure to reach a `DbContext`.
- **Changing route templates, DTO property names, or nullability** on a
  published API without versioning or approval.
- **`DateTime` with an unknown kind.** Prefer `DateTimeOffset` or UTC,
  following the project's convention.

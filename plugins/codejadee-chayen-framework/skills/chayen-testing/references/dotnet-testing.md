---
kind: technology
---
# .NET testing: xUnit, NUnit, MSTest

**Applies to:** .NET test projects.

- Identify the framework from the package references:
  - `xunit` or `xunit.v3`
  - `NUnit`
  - `MSTest.TestFramework`
- Identify the major version as well. For example, xUnit v2 and v3 differ in
  packages and some APIs.

## Check the repository first

| Area | What to look for |
|---|---|
| Framework | xUnit (`[Fact]`, `[Theory]`), NUnit (`[Test]`, `[TestCase]`), MSTest (`[TestMethod]`, `[DataRow]`) |
| Assertions | The built-in `Assert`, Shouldly, or FluentAssertions. Use the one already referenced. Do not add another. |
| Mocks | Moq, NSubstitute, FakeItEasy, or hand-written fakes |
| Layout | `tests/<Project>.Tests`, or a project per layer. Naming such as `Method_State_Expected` or `Should_...`. |
| Integration | `WebApplicationFactory<Program>`, Testcontainers, SQLite in-memory, or a shared fixture or collection |

## Unit tests

- **Arrange / act / assert,** with one behavior per test.
- **Data-driven cases:** `[Theory]` with `[InlineData]` or `[MemberData]`
  (xUnit), `[TestCase]` (NUnit), or `[DataRow]` (MSTest).
- **Async:**
  - test methods return `Task`;
  - await everything;
  - assert exceptions with the async assertion API.
- **Pass and assert `CancellationToken` behavior** where the code supports
  cancellation.
- **Control time** through the abstraction the project uses
  (`TimeProvider`, `IClock`). Never use the real `DateTime.Now` in
  assertions.
- **Mock only collaborators at boundaries**, such as repositories or HTTP
  clients. Do not mock the type under test.

## ASP.NET Core integration tests (aspnet-integration-testing)

**Applies when:** testing an ASP.NET Core app through its real HTTP
pipeline (routing, middleware, filters, model binding, authentication,
serialization) with `WebApplicationFactory` and an in-memory test server.

**Not when:** the code under test has no HTTP surface (unit tests), the
test drives a deployed environment or a browser (end-to-end), or the
project is not ASP.NET Core.

**Version notes:** `WebApplicationFactory<TEntryPoint>` comes from
`Microsoft.AspNetCore.Mvc.Testing`, versioned with the framework. With
top-level statements on .NET 6 to 9, `Program` is internal: tests fail with
CS0122 until the app declares `public partial class Program { }` (or uses
`InternalsVisibleTo`). On .NET 10 the test project can reference `Program`
without it. xUnit v2 and v3 differ in packages and fixture APIs.

**Steps:**

1. Reuse the project's factory or fixture (often a class deriving from
   `WebApplicationFactory<Program>`, shared through `IClassFixture` or a
   collection fixture). Create one only if none exists, in the project's
   test framework.
2. Choose the test framework, assertion library, and mocking library the
   project already uses. Do not add new ones.
3. Replace external dependencies in `ConfigureWebHost` or
   `WithWebHostBuilder(b => b.ConfigureTestServices(...))`: fake HTTP
   clients for third-party APIs, a test authentication handler instead of
   the real identity provider, and test doubles for brokers.
4. Use a real database engine for data behaviour: Testcontainers or the
   project's test database, with isolation per test or per class
   (transactions rolled back, a reset tool, or unique data). SQLite
   in-memory differs from SQL Server and PostgreSQL; the EF Core InMemory
   provider does not behave like a relational database.
5. Set the environment deliberately (`UseEnvironment("Testing")` or the
   project's choice); Development-only behaviour such as the developer
   exception page changes responses.
6. Send real requests with `factory.CreateClient()` and assert the status
   code, the deserialized body, headers such as `Location`, and the problem
   details shape for errors.
7. Cover authorization with three requests: anonymous (401), signed in
   without permission (403), and allowed (2xx).
8. Keep tests independent of order and of each other's data; xUnit runs
   test classes in parallel by default.

**Verify:** the new tests pass with `dotnet test --filter`, fail when the
behaviour under test is broken (shown by a temporary change or a known-bad
request), and run in the project's CI test command; report PASS, FAIL, or
NOT_RUN with the command.

## Commands

```bash
dotnet test
dotnet test --filter "FullyQualifiedName~OrderService"
dotnet test --filter "Category=Integration"     # if traits/categories are used
dotnet test --collect "XPlat Code Coverage"     # only if coverlet is referenced
```

For flaky test investigation, run the filter repeatedly in a loop and
record the pass and fail counts.

## Pitfalls

- **Shared static state** between tests. xUnit runs test classes in
  parallel by default.
- **`async void` test methods.**
- **Asserting on log text, or on exact exception messages** that are not
  part of the contract.
- **Over-mocking,** so the test only restates the implementation.

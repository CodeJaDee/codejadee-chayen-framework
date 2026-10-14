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

## ASP.NET Core integration tests

- **Reuse the project's `WebApplicationFactory<Program>` fixture.**
  - Customize services with `ConfigureTestServices`.
  - Use the existing test authentication handler for authorized endpoints.
- **Assert:**
  - status codes;
  - the response body (deserialized);
  - the Problem Details shape for errors.
- **Cover authorization:** an anonymous request returns 401, a
  wrong-role request returns 403, and an allowed request returns success.
- **Database:** follow the project's approach, such as Testcontainers or a
  per-test database.
  - The EF Core InMemory provider does not enforce relational behavior.
    Avoid it for query or constraint tests.

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

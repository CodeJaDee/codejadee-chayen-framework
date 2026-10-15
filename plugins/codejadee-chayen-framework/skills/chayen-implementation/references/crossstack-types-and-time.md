---
kind: technology
---
# Cross-stack typed clients, dates, and numbers

Stack detail for values that cross database, API, and client boundaries:
generated API clients, dates and times, and numeric precision. Use it with
the code generation recipe and the feature recipe. Each layer can be
correct alone and still disagree with the next; test the round trip.

## Check the repository first

| Area | What to look for |
|---|---|
| Client generation | The generator and version (openapi-typescript, openapi-generator, NSwag, Orval, Kiota, `ng-openapi-gen`), its config, output folder, and the command or script that runs it |
| Contract | The committed OpenAPI document the generator reads, and how it is refreshed |
| Date types per layer | Database (`timestamptz`/`timestamp`, `datetimeoffset`/`datetime2`, `date`), server (`DateTimeOffset`, `DateTime` kind, `DateOnly`, `Instant`), JSON format, client (`Date`, `Temporal`, date libraries) |
| Number types per layer | `bigint`/`numeric` columns, `long`/`decimal` in code, JSON numbers versus strings, client `number`/`bigint`/decimal libraries |
| Time zones | Server and database `TimeZone`, user time zone source, formatting libraries |

## Typed API client generation (typed-api-client-generation)

**Applies when:** generating, regenerating, or reviewing typed API clients
or types from an OpenAPI document for a front end or another service, or
fixing drift between client types and the API.

**Not when:** changing the API contract itself (backend contract
synchronization guidance), or the project has no generator and the user has
not asked for one (keep its hand-written client; propose generation only
with approval).

**Version notes:** generators differ in how they handle OpenAPI 3.1 type
arrays, nullability, `format: int64`, enums, and `oneOf`; openapi-typescript
7 supports 3.1. .NET 10 documents can type numbers as `integer | string`,
which generated TypeScript reflects. Pin and record the generator version.

**Steps:**

1. Use the generator, version, and configuration already in the project,
   reading the committed contract (or the served document from a local
   build), not a production endpoint.
2. Regenerate into the generated folder only; never hand-edit generated
   files. Wrap them where the application needs custom behaviour.
3. Type-check and build every consumer after regeneration; a renamed or
   removed field must become a compile error, which is the point of
   generation.
4. Review risky mappings: 64-bit integers and decimals typed as `number`
   (precision loss above 2^53 and binary rounding), date-times typed as
   `string`, union types from `integer | string`, and nullable versus
   optional fields.
5. Fix contract-level problems in the contract (for example send ids above
   2^53 and money as strings or decimal strings), not by casting in the
   client.
6. Commit the regenerated client with the contract, and add a CI step that
   regenerates and fails on differences.

**Verify:** report PASS, FAIL, or NOT_RUN for regeneration with the pinned
generator, the consumer type-check and build, and a drift check that fails
when the contract changes without regeneration.

## Dates, times, and precision across layers (crossstack-date-time)

**Applies when:** storing, sending, parsing, displaying, or comparing dates
and times (and related numeric precision) across database, API, and client
code, or fixing off-by-hours, off-by-one-day, or precision bugs.

**Not when:** a purely local calculation in one layer with no boundary
crossing, or calendar business rules that need a requirements decision
first (ask; do not invent time-zone rules).

**Version notes:** Npgsql 6+ maps `timestamptz` to UTC `DateTime` and
rejects `Unspecified`/`Local` kinds; `System.Text.Json` writes
`DateTimeOffset` with its offset, `DateTimeKind.Utc` with `Z`, and
`Unspecified` with no zone; JavaScript parses date-only ISO strings as UTC
and zone-less date-times as local time. `Temporal` availability depends on
the runtime.

Npgsql 6+ also requires a zero-offset `DateTimeOffset` for `timestamptz`;
normalize explicitly before writing. PostgreSQL retains the instant, not the
original offset or zone; preserve those separately when required.

**Steps:**

1. Classify each value: an instant (store `timestamptz` or
   `datetimeoffset`, send ISO 8601 with `Z` or an offset), a calendar date
   (`date`, `DateOnly`, `YYYY-MM-DD`, never converted through time zones), or
   a local wall time plus an IANA zone (store both).
2. Make every boundary explicit: the database type, the driver mapping, the
   serializer output, the contract format, and the client parser. A value
   without an offset is ambiguous everywhere after it leaves the server.
3. Convert to the user's zone only for display, with the zone source
   decided (user setting or browser); keep comparisons and storage in UTC
   instants.
4. Keep precision: `numeric`/`decimal` money as decimal strings or integer
   minor units in JSON, 64-bit ids above 2^53 as strings, and client
   arithmetic in a decimal type or minor units.
5. Fix data with an approved migration when stored values are ambiguous
   (for example `timestamp` holding mixed zones), using a stated rule.
6. Test the round trip across a non-UTC zone and a date near midnight and
   a daylight-saving transition, from database to UI and back.

**Verify:** report PASS, FAIL, or NOT_RUN for round-trip tests (database,
API, client) in a non-UTC zone, midnight and daylight-saving cases, and
large-number and decimal precision cases.

```csharp
public record OrderDto(long Id, [property: JsonNumberHandling(JsonNumberHandling.WriteAsString)] long ExternalId,
    DateTimeOffset PlacedAt, DateOnly DeliveryDate, string Total);   // instant with offset, calendar date, decimal as string
```

## Commands

```bash
npx openapi-typescript contract/openapi.v1.json -o src/api/types.ts   # only when the project already uses it
npx tsc --noEmit                                                        # consumer type-check after regeneration
```

## Pitfalls

- Hand-edited generated clients.
- `DateTime` with `Kind=Unspecified` serialized for a browser.
- `new Date("2026-01-01")` shown as 31 December in western time zones.
- 64-bit ids or money as JSON numbers in JavaScript clients.

---
kind: checklist
---
# Architecture styles: recognise, then respect

Use this to name the style a codebase already follows, from evidence, before
proposing anything. No style is the default. Each one fits some goals and
costs something.

## Recognition signals

| Style | Evidence in the repository |
|---|---|
| Layered (n-tier) | Projects or folders named `Web`/`Api`, `Business`/`Services`, `Data`/`Repositories`; references flow downward |
| Clean / hexagonal / onion | A `Domain` or `Core` project with no infrastructure references; `Application` use cases; `Infrastructure` implementing interfaces declared inward; ports and adapters naming |
| Vertical slice | Feature folders holding endpoint, handler, validator, and data access together (`Features/Orders/Create/`); MediatR-style handlers per request |
| Modular monolith | One deployable with module projects or folders that expose a small public API (`*.Contracts`), internal visibility, per-module schemas or `DbContext`s |
| Services / microservices | Several deployables, separate repositories or solution folders, per-service data stores, HTTP or messaging clients between them |
| Event-driven | Message contracts, publishers and consumers, an outbox table, broker configuration (RabbitMQ, Azure Service Bus, Kafka) |
| Frontend: feature-based vs type-based | `features/<name>/` versus `components/`, `services/`, `pages/` at the top level; Nx libraries with tags |

Report the style with its evidence. If the evidence is mixed, say so, for
example "layered at the solution level, vertical slices inside `Api`".
Mixed is common, and not automatically a problem.

## Where each style fits

| Style | Tends to fit | Costs to name in trade-offs |
|---|---|---|
| Layered | Small or medium CRUD-heavy apps, small teams | Business logic leaks into services; changes cross every layer |
| Clean / hexagonal | Rich domain logic, long-lived systems, many integrations | More projects and mapping; slower for simple CRUD |
| Vertical slice | Feature-driven teams, independent changes per use case | Duplication across slices; shared rules need discipline |
| Modular monolith | One team or a few teams, a need for boundaries without distributed operations | Boundaries need enforcement (fitness tests); a shared database invites coupling |
| Services | Independent scaling or deployment by separate teams | Distributed failure, data consistency, operational overhead |
| Event-driven | Decoupled reactions, integration across bounded contexts | Eventual consistency, ordering, idempotency, harder debugging |

## Rules

- **Keep the current approach** is always option 0 in any comparison.
- **Changing style is a migration,** planned in phases (the migration
  strategy recipe), never a side effect of a feature.
- **Name the quality goal** that would justify a change. A pattern's
  popularity is not a reason.

---
kind: recipe
capabilities: [CAP-03-009]
---
# Multitenancy design

Design tenant isolation for data, compute, configuration, and identity.
Choose a tenancy model from explicit trade-offs, and define where tenant
context is resolved and enforced, and the tests that prove one tenant cannot
see another's data.

## Inputs

- The number of tenants and their size distribution, plus any noisy-neighbour
  concerns.
- Isolation and compliance needs as stated by the owner, for example data
  residency or dedicated infrastructure for some tenants.
- Cost constraints and operational capacity.
- The current data model and identity setup, from the repository.

## Procedure

1. **Establish the current state from evidence.**
   - Is there a `TenantId` column, a per-tenant database or schema, or no
     tenancy at all?
   - Where does the tenant come from: a token claim, a subdomain, a header,
     or the path?
   - Cite each finding, or label it `unknown`.
2. **Compare the tenancy models.** Option 0 is the current model.

   | Model | Isolation | Cost and operations | Typical fit |
   |---|---|---|---|
   | Shared database, shared schema (`TenantId` column) | Logical. Depends on every query filtering. | Lowest cost. One migration. | Many small tenants |
   | Shared database, schema per tenant | Stronger logical isolation | Migrations per schema. Catalog growth. | Tens to hundreds of tenants |
   | Database per tenant | Strong. Per-tenant backup and restore, residency. | Highest operations cost. Migration orchestration. | Few large or regulated tenants |
   | Hybrid (pooled plus dedicated) | Per tier | Two code paths to operate | A mix of small and enterprise tenants |

3. **Resolve the tenant context once,** at the edge.
   - Use one place to resolve it, such as middleware or a request filter.
   - Validate the tenant against the authenticated identity, so that a user
     cannot switch tenants by changing a header.
4. **Enforce the isolation at every access path.**
   - ORM global query filters, or database row-level security as a second
     line.
   - Tenant-scoped caches (tenant in the cache key).
   - Tenant-scoped storage paths and message metadata.
   - Background jobs that carry the tenant explicitly.
5. **Name the bypass risks:**
   - raw SQL;
   - reporting queries;
   - admin tools;
   - jobs without a request context;
   - cross-tenant analytics.

   Each one needs an explicit decision and a test.
6. **Define the isolation tests.**
   - Create two tenants.
   - Prove that every endpoint and query returns only the caller's tenant
     data.
   - Prove that cross-tenant identifiers return 404 or 403.
7. **Label the recommendation proposed.** Changing the tenancy model of an
   existing system is a migration (migration strategy recipe). Data
   residency and compliance claims are recorded as stated by their owner.

## Outputs

- The current tenancy state, with evidence.
- A model comparison, and a recommendation (proposed) with its isolation
  guarantees and risks.
- The enforcement points: where the tenant context is resolved and where it
  is enforced, per access path, including the bypass risks and their
  decisions.
- An isolation test plan, or isolation tests written on request.

## Technology considerations

| Stack | Consideration |
|---|---|
| .NET / EF Core | Global query filters (`HasQueryFilter`), applied to every tenant-owned entity. `IgnoreQueryFilters()` uses are bypass points. A tenant-aware `DbContext` factory serves database-per-tenant. |
| SQL Server | Row-level security (security predicates and `SESSION_CONTEXT`) as defence in depth. Elastic pools for database-per-tenant. |
| PostgreSQL | Row-level security policies with `current_setting('app.tenant_id')`. Schema-per-tenant uses `search_path`, which pooled connections can leak, so reset it per request. |
| Node (Nitro, Elysia, Next.js, Nuxt) / Python | Resolve the tenant in middleware, and pass it explicitly. Avoid module-level globals for tenant state. Use async-local storage carefully. Django: tenant-aware managers or a schema-based package. |
| Angular / React / Vue | The tenant comes from the token, not from client-side state that a user can edit. Client-side checks are not isolation. |

## Verification

- The design names exactly one place where the tenant is resolved, and
  validates it against the authenticated identity.
- Every access path (ORM, raw SQL, cache, storage, jobs, messages) has an
  enforcement point, or an explicit, decided exception.
- The isolation test plan includes cross-tenant access attempts with the
  expected 403 or 404.
- The recommendation shows option 0 and the trade-offs, labelled proposed.

---
kind: recipe
capabilities: [CAP-18-005]
---
# Access control review

Review who and what can access systems and repositories (cloud role
assignments, database roles and grants, repository permissions, service
accounts) from exports or permission files the user provides, and flag
excessive, unused, and orphaned access with least-privilege proposals for
the owner to apply. The review is read-only and advisory: the agent never
changes live permissions.

## Inputs

- Exports the user provides: role assignments, grants, group memberships,
  repository collaborator and team lists, service principal and key
  inventories, with their export date.
- Last-use or sign-in data, if available.
- The intended access model: roles per team, environments, and break-glass
  accounts.

## Procedure

1. **Normalize the exports** into one access matrix: principal, type (user,
   group, service account, workload identity), resource, role or grant,
   scope, and last use if known.
2. **Flag findings:**
   - **excessive:** owner, admin, `db_owner`, superuser, or wildcard
     permissions where a narrower role fits the stated need;
   - **unused:** no use over the review period (only when last-use data
     exists; otherwise "unknown");
   - **orphaned:** principals of people who left, disabled accounts, or
     service accounts with no owner;
   - **risky credentials:** long-lived keys or secrets where a managed
     identity or federation exists, and keys past rotation policy;
   - **separation of duties:** the same principal able to change and approve
     production.
3. **Propose least-privilege changes** per finding (a narrower built-in
   role, a scoped grant, removal, an identity instead of a key), with the
   expected impact and who must approve.
4. **Hand over:** the owner applies changes through the platform's own
   process. Do not run grant, revoke, or role-assignment commands.
5. **Record the review:** date, export dates, scope, and items not covered.

## Outputs

- An access matrix with excessive, unused, or orphaned grants flagged.
- Least-privilege change proposals for the owner to apply.

## Technology considerations

| Stack | Consideration |
|---|---|
| Azure | Role assignments exported with `az role assignment list --all` (run by the user), Owner and Contributor at subscription scope, Key Vault access policies versus RBAC, managed identities. |
| AWS and Google Cloud | IAM policy exports, wildcard actions, unused access findings from the cloud's analyzer if the user exports them. |
| SQL Server | `sys.database_role_members`, `sys.server_role_members`, `db_owner` or `sysadmin` for application logins, and contained users. |
| PostgreSQL | `pg_roles`, `\du` output, `GRANT` lists with `information_schema.role_table_grants`, superuser and `CREATEROLE` flags. |
| Repositories | GitHub or Azure DevOps collaborator and team permissions, admin rights, deploy keys, and personal access tokens used by automation. |

## Verification

- A seeded `db_owner` grant for the application login in the fixture export
  is flagged with a narrower alternative.
- Unused findings appear only where last-use data exists; otherwise they are
  marked unknown.
- No live permission was changed, and the output states it is advisory.

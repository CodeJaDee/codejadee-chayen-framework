---
kind: recipe
capabilities: [CAP-20-005]
---
# Provider compatibility for skills and plugins

Check that skills and plugins work on each target provider and surface
(CLI, IDE extension, cloud agent): manifest and marketplace formats,
discovery, explicit invocation, enable and disable, uninstall, and
documented gaps. Every cell in the compatibility matrix rests on a cited
document or a recorded test, never on an assumption.

## Inputs

- The plugin or skills, and the target providers and surfaces.
- Each provider's current documentation (URLs and access dates).
- Test environments: CLIs installed, isolated configuration homes, and
  permission to run lifecycle commands.

## Procedure

1. **List the surfaces** per provider (for example a CLI, an IDE extension,
   a cloud agent), because support often differs between them.
2. **Collect documented behaviour** per surface: manifest file and fields,
   marketplace format, install and uninstall commands, discovery locations,
   description or listing budgets, explicit invocation, and enable or
   disable. Record the source and date for each fact.
3. **Build the matrix:** rows for features, columns for surfaces, each cell
   SUPPORTED, UNSUPPORTED, or UNVERIFIED, with a source or test ID.
4. **Write the lifecycle test procedure** per surface: install from the
   marketplace, list, check discovery, disable, enable, uninstall, and
   remove the marketplace. Run CLIs with isolated configuration homes so the
   user's real setup is not changed.
5. **Run the tests** where tools are installed and the user agrees, and
   record commands and results; mark the rest NOT_RUN.
6. **Record gaps** and workarounds, and re-check when providers release new
   versions.

## Outputs

- A compatibility matrix with SUPPORTED, UNSUPPORTED, and UNVERIFIED cells,
  each with a source or test.
- A lifecycle test procedure per surface, and recorded results.

## Technology considerations

| Stack | Consideration |
|---|---|
| CLI agents | Lifecycle commands differ (plugin and marketplace subcommands, configuration home variables); use isolated homes for tests. |
| IDE extensions | Some surfaces do not support plugins or need manual steps; record these as tested procedures with screenshots or transcripts from the user. |
| Cloud agents | Repository-level configuration may be the only option; document how skills are made available. |
| Shared skill source | One skill directory can serve several providers when it uses only common fields; provider-specific manifests sit alongside. |

## Verification

- Every matrix cell for the fixture plugin cites a documentation source or a
  recorded test, never an assumption.
- Lifecycle tests ran in isolated configuration homes, or are NOT_RUN with
  the reason, and the user's real configuration was not changed.
- Documentation sources carry access dates.

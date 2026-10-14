---
kind: recipe
capabilities: [CAP-11-012]
---
# SBOM and dependency licences

Produce or review a software bill of materials (CycloneDX or SPDX) with a
standard tool, including transitive packages, and build a licence table
that flags unknown, incompatible, or copyleft licences for review. Licence
conclusions are advisory and go to the people who own the licence policy.

## Inputs

- Manifests and lock files for each ecosystem in the repository, and the
  build output or container image if the SBOM should describe it.
- The licence policy, if one exists (allowed, review-required, and
  forbidden licences), and how the software is distributed (SaaS,
  distributed binaries, libraries).
- The preferred SBOM format and version, if the user or a customer
  requires one.

## Procedure

1. **Choose the generator per ecosystem** and the format (CycloneDX or
   SPDX). Use tools already in the build when present. Adding one needs
   approval.
2. **Generate from lock files or the built artifact,** so versions are
   resolved and transitive packages are included. Record the exact command,
   tool version, and output file.
3. **Check completeness:** direct and transitive packages from every
   project in scope, package URLs (purl) and versions, and component
   hashes where the tool supports them. Note gaps (vendored code, native
   libraries, container base image packages).
4. **Build the licence table:** package, version, declared licence (SPDX
   identifier), and the policy outcome. Flag:
   - unknown or missing licences;
   - strong copyleft (GPL, AGPL) and weak copyleft (LGPL, MPL) licences,
     with how the package is used (linked, bundled, network service);
   - non-standard or custom licences;
   - licence changes between the old and new version.
5. **Route flagged items for review.** The agent does not decide licence
   compatibility: list the facts and the question for legal or the policy
   owner.
6. **Recommend keeping the SBOM current:** generate it in CI per release,
   and store it with the release artifacts.

## Outputs

- An SBOM generated with a standard tool, with the command and tool
  version.
- A licence table with items needing legal review, marked advisory.

## Technology considerations

| Stack | Consideration |
|---|---|
| .NET | CycloneDX for .NET (`dotnet CycloneDX <project or solution> -o <dir>`), or the Microsoft SBOM tool (`sbom-tool generate`, SPDX). Licence expressions come from NuGet metadata, and older packages may only have a licence URL. |
| JavaScript and TypeScript | `npm sbom --sbom-format cyclonedx` (npm 9.5 and later) or `@cyclonedx/cyclonedx-npm`. `license-checker` style tools for licence tables. Check `devDependencies` separately: they usually do not ship. |
| Python | `cyclonedx-py` (from the environment or requirements), `pip-licenses` for licence tables. Generate from the locked environment, not loose requirements. |
| Containers | Syft (`syft <image> -o cyclonedx-json`) covers OS packages in the image, which language tools miss. |

## Verification

- The SBOM includes the fixture's direct and transitive packages, checked
  against the lock file.
- A seeded copyleft dependency is flagged in the licence table for review.
- The generation command and tool version are recorded, or the run is
  NOT_RUN with the reason.
- The licence table is labelled advisory and makes no legal compatibility
  determination.

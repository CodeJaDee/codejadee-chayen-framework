---
kind: recipe
capabilities: [CAP-11-012, CAP-18-007]
---
# SBOM and dependency licences

Produce or review a software bill of materials (CycloneDX or SPDX) with a
standard tool, including transitive packages, and build a licence table
that flags unknown, incompatible, or copyleft licences for review. Licence
conclusions are advisory and go to the people who own the licence policy.
For a given distribution model, the same inventory yields the obligations
the project must meet and a draft third-party notices file.

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

### Licence obligations (CAP-18-007)

1. **State the distribution model:** SaaS only, distributed binaries or
   containers, a library others embed, or a mobile or desktop app, because
   obligations depend on it.
2. **List obligations per licence and model:** attribution and notices
   (MIT, BSD, Apache-2.0 including its NOTICE file), source availability and
   modification notices (LGPL, MPL), copyleft scope for the combined work
   (GPL, AGPL, including network use for AGPL), and patent clauses.
3. **Draft the third-party notices file** from the inventory: package, version,
   licence, and copyright line from the package metadata or licence file.
   Missing copyright lines are marked for follow-up.
4. **Flag items for legal review** with the facts and the question, and
   state that the output is not legal advice.

## Outputs

- An SBOM generated with a standard tool, with the command and tool
  version.
- A licence table with items needing legal review, marked advisory.
- An obligation list per licence and distribution model, with items for
  legal review, and a draft third-party notices file.

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
- The notices file for the fixture includes every MIT and Apache-2.0
  component with its copyright line, and the output states it is not legal
  advice.

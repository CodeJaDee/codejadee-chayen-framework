---
kind: recipe
capabilities: [CAP-13-009, CAP-13-012]
---
# Release packaging and artifact provenance

Package releasable artifacts (container images, NuGet or npm packages,
Python wheels, archives) with consistent versioning and metadata, and
produce verifiable provenance: signatures by digest, attestations, and a
verification step before deployment. Packing is verified with dry runs;
publishing to a registry happens only with approval.

## Inputs

- Artifact types, the versioning scheme (semantic versioning, date-based),
  and where the version comes from (tags, a version file, commits).
- Registries and feeds, and their authentication in CI.
- The CI platform, and where artifacts are consumed (deploy pipeline,
  cluster admission, package consumers).

## Procedure

### Packaging and versioning (CAP-13-009)

1. **Choose one version source** with the user: git tags, a version file,
   or a tool deriving versions from commits (for example MinVer,
   GitVersion, semantic-release). Apply it to every artifact in the
   release.
2. **Configure packaging metadata:** package ID or name, version,
   description, licence expression, repository URL, and release notes
   link.
3. **Build reproducibly:** from lock files in CI, with deterministic build
   settings where the stack supports them, and the source revision embedded
   (`SourceRevisionId`, image labels).
4. **Pack as a dry run:** `dotnet pack`, `npm pack --dry-run`, `python -m
   build`, or `docker buildx build` without push, and inspect the output
   (version, included files, size).
5. **Publish only in the pipeline after approval:** the publish step runs
   on tags or releases, with registry credentials from the platform. The
   agent does not push or publish.

### Provenance (CAP-13-012)

1. **Reference by digest:** deployments and signatures use the image
   digest (`image@sha256:...`), not a tag.
2. **Sign** with the project's approach (Sigstore cosign keyless with the
   CI's OIDC identity, or a key held in a KMS), as a pipeline step after
   the push.
3. **Attest:** generate build provenance (SLSA-style) and attach the SBOM
   from the security skill's SBOM recipe as an attestation if the project
   wants it.
4. **Verify before use:** a deploy step or cluster admission policy that
   verifies the signature and the expected identity (repository, workflow)
   and fails the deployment when verification fails.
5. **Document trust:** which identities may sign, and how verification
   failures are handled.

## Outputs

- Packaging configuration and versioning rules, with dry-run package
  output; publishing only with approval.
- Signing and attestation steps in the pipeline, and a verification step
  with its failure behaviour.

## Technology considerations

| Stack | Consideration |
|---|---|
| .NET | `PackageId`, `Version` from MinVer or a build property, `ContinuousIntegrationBuild=true` and Source Link for deterministic builds, `dotnet pack -c Release`, `dotnet nuget push` only in CI after approval. |
| Node | `npm version` or semantic-release, `npm pack --dry-run` to inspect files, `npm publish --provenance` in GitHub Actions for npm provenance, and `files` or `.npmignore` to control contents. |
| Python | `pyproject.toml` metadata, `python -m build`, `twine check`, and trusted publishing (OIDC) to PyPI from CI. |
| Containers | OCI labels (`org.opencontainers.image.revision`, `version`), `docker buildx` with `--provenance` and `--sbom` attestations, cosign `sign` and `verify` by digest. |
| GitHub Actions | `actions/attest-build-provenance` for SLSA provenance, `id-token: write` for keyless signing, and `gh attestation verify` before deploy. |

## Verification

- The pack command produces an artifact with the expected version on the
  fixture, and nothing is published.
- The pipeline signs by digest, not tag, and the deploy step verifies the
  signature before use.
- Registry credentials come from the platform, and no artifact was pushed
  by the agent.

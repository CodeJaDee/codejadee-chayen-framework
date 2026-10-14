---
kind: technology
---
# C# code analysis and project maintenance

Stack detail for .NET build hygiene: analyzers, code style, warnings,
project files, SDK pinning, and NuGet packages. Use it with the upgrades,
refactoring, or dead code recipe, or on its own for small maintenance
changes. It applies to any SDK-style .NET project.

## Check the repository first

| Area | What to look for |
|---|---|
| SDK and frameworks | `global.json` (`sdk.version`, `rollForward`), `<TargetFramework(s)>`; run `dotnet --version` in the repository root where commands are allowed |
| Shared build files | `Directory.Build.props` and `.targets` (shared properties), `Directory.Packages.props` (Central Package Management) |
| Analyzer settings | `.editorconfig` files (root and nested), `<AnalysisLevel>`, `<AnalysisMode>`, `<EnforceCodeStyleInBuild>`, `<TreatWarningsAsErrors>`, `<WarningsAsErrors>`, `<NoWarn>`, `GlobalSuppressions.cs` |
| Analyzer packages | StyleCop.Analyzers, SonarAnalyzer.CSharp, Roslynator, Meziantou.Analyzer, Microsoft.VisualStudio.Threading.Analyzers |
| Packages | `PackageReference` versions or central versions, `packages.lock.json` (`RestorePackagesWithLockFile`), `nuget.config` sources and package source mapping, `.config/dotnet-tools.json` |
| Solution | `.sln` or `.slnx`, and which projects CI builds |
| CI checks | `dotnet format --verify-no-changes`, `-warnaserror`, vulnerability or outdated package checks |

## Code analysis (csharp-code-analysis)

**Applies when:** configuring or fixing .NET analyzers and code style:
`.editorconfig` rules, warning levels, warnings as errors, suppressions,
`dotnet format`, or a build broken by analyzer or style warnings.

**Not when:** triaging security scanner findings (the security skill),
wiring checks into CI pipelines (the devops skill), or writing
architecture rule tests (the architecture skill's fitness tests).

**Version notes:** the .NET code analyzers ship with the SDK from .NET 5
(`EnableNETAnalyzers`); `AnalysisLevel` follows the SDK unless pinned, so an
SDK update can add warnings. `dotnet format` is part of the SDK from .NET 6,
with `whitespace`, `style`, and `analyzers` subcommands.
`TreatWarningsAsErrors` also turns NuGet audit warnings (NU1901 to NU1904)
into errors, so a newly published advisory can fail a build that did not
change.

**Steps:**

1. Read the configuration and how CI enforces it, then build and record
   the warnings by rule ID as the baseline.
2. Fix warnings in the code being changed. A project-wide cleanup needs an
   agreed scope; do it per rule ID, with mechanical formatting in its own
   change.
3. Change rule severities in `.editorconfig`
   (`dotnet_diagnostic.CA2007.severity = none`), not with scattered
   `#pragma` lines or project-wide `<NoWarn>`.
4. Suppress a single finding only with a reason, at the narrowest scope:
   `[SuppressMessage(..., Justification = "...")]` or
   `#pragma warning disable` and `restore` around the lines.
5. Raising `AnalysisLevel` or `AnalysisMode`, enabling
   `EnforceCodeStyleInBuild`, or turning on `TreatWarningsAsErrors` changes
   what fails the build: propose it with the warning counts, and apply only
   with approval. Decide with the user how NuGet audit warnings are treated
   (for example `<WarningsNotAsErrors>NU1901;NU1902;NU1903;NU1904</WarningsNotAsErrors>`
   with a separate vulnerability gate).
6. Run `dotnet format` only on the files in scope
   (`dotnet format --include <paths>`), and use `--verify-no-changes` as
   the check.
7. Add third-party analyzer packages only with approval; follow their
   configuration if present.

**Verify:** warning counts per rule before and after, `dotnet format
--verify-no-changes` exits 0 when the project uses it, and the build passes
with the project's warning settings; report PASS, FAIL, or NOT_RUN with the
command.

## Project maintenance (csharp-project-maintenance)

**Applies when:** maintaining .NET project and solution files: target
frameworks, `global.json`, shared build properties, Central Package
Management, package updates, vulnerable or deprecated packages, lock files,
NuGet sources, local tools, or solution files.

**Not when:** a major framework or library upgrade with breaking changes
(the upgrades recipe, which uses this section for .NET detail), CI pipeline
or build system design (the devops skill), or a licence and SBOM review
(the security skill).

**Version notes:** Central Package Management needs a NuGet 6.2 or later
SDK; NuGet audit warnings on restore come with the .NET 8 SDK, and recent
SDKs audit transitive packages too. The .NET 10 SDK creates `.slnx`
solutions by default and adds noun-first commands (`dotnet package add`,
`dotnet package list`); `dotnet add package` still works. `global.json`
decides which installed SDK runs in that directory.

**Steps:**

1. Inventory the build: SDK pin and roll-forward policy, target
   frameworks, shared properties, central versions, lock files, sources,
   tools, and solution files.
2. Edit in the right place: versions in `Directory.Packages.props` when
   Central Package Management is on (no `Version` on `PackageReference`),
   shared properties in `Directory.Build.props`, never per-project copies.
3. List before changing: `dotnet list package --outdated`,
   `--vulnerable --include-transitive`, and `--deprecated`.
4. Keep package families aligned (every `Microsoft.EntityFrameworkCore.*`
   on one version; `Microsoft.AspNetCore.*` and `Microsoft.Extensions.*`
   matching the framework). Patch and minor updates go in a focused
   change; major updates follow the upgrades recipe with approval.
5. For a vulnerable transitive package, find the path (`dotnet nuget why`
   on recent SDKs), then update the parent package or pin the transitive
   version centrally (`CentralPackageTransitivePinningEnabled`), with
   approval.
6. Check the licence before adding or upgrading a package. Several
   popular .NET libraries moved newer major versions to commercial
   licences (for example MediatR, AutoMapper, FluentAssertions, and
   MassTransit); confirm the terms with the user.
7. Changing `global.json` or a target framework is a framework change:
   use the upgrades recipe, and keep to supported versions according to
   the official .NET support policy.
8. With lock files, restore with `--force-evaluate` after the change and
   commit the updated lock files; CI should restore with `--locked-mode`.
9. Never edit generated files under `obj/` or `bin/`.

**Verify:** restore, build, and tests pass; `dotnet list package
--vulnerable --include-transitive` shows no new vulnerable packages; with
lock files, `dotnet restore --locked-mode` succeeds; report PASS, FAIL, or
NOT_RUN with the command.

## Commands

```bash
dotnet --version && dotnet --list-sdks                  # in the repository root, so global.json applies
dotnet build 2>&1 | grep -oE "warning [A-Z]+[0-9]+" | sort | uniq -c   # warnings by rule ID
dotnet format --verify-no-changes                       # or: dotnet format whitespace|style|analyzers --verify-no-changes
dotnet list package --outdated
dotnet list package --vulnerable --include-transitive
dotnet restore --locked-mode                            # when lock files are used
```

## Pitfalls

- **Blanket suppressions** (`<NoWarn>` for a whole rule family) to make a
  build green.
- **Reformatting the whole repository** inside a feature or bug fix.
- **Package versions edited per project** when Central Package Management
  is on, which fails restore or splits versions.
- **Mixed versions of one package family** (for example EF Core runtime
  and design packages on different versions).
- **Adding a package whose licence the project cannot use.**

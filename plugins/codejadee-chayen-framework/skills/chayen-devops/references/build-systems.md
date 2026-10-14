---
kind: recipe
capabilities: [CAP-13-001]
---
# Build systems

Set up or fix the build so it is reproducible from the lock files, fast on
incremental changes, and runs the same way locally and in CI, with clean and
incremental build times measured before and after.

## Inputs

- Build files: solution and project files, `package.json` workspaces,
  `pyproject.toml`, monorepo tooling (Nx, Turborepo, pnpm workspaces).
- The package managers and lock files in use.
- Current build commands, times, and problems (slow, flaky, differs
  between machines).

## Procedure

1. **Record the baseline:** the documented build command, a clean build
   time, and an incremental build time after touching one file, with the
   machine and tool versions. Run each at least twice.
2. **Check reproducibility:**
   - lock files committed and honoured (`npm ci`, `pnpm install
     --frozen-lockfile`, `dotnet restore --locked-mode` with
     `RestorePackagesWithLockFile`, `pip install` from a locked file or
     `uv sync --frozen`);
   - SDK and runtime versions pinned (`global.json`, `.nvmrc` or
     `engines`, `.python-version`);
   - no network fetches of unpinned resources during the build.
3. **Find the time sinks:** restore or install, compilation, code
   generation, linting, and tests bundled into the build. Use the tools'
   own diagnostics (`dotnet build -bl` binary log, `nx graph`, `turbo run
   --summarize`, timing output).
4. **Apply improvements one at a time:**
   - restore once, then build with `--no-restore`;
   - project or package references trimmed so changes rebuild less;
   - monorepo task graphs with caching (Nx, Turborepo) only if the user
     wants that tool, after approval;
   - parallel builds where the tool supports them;
   - generated code checked for unnecessary regeneration.
5. **Keep the build command single and documented** (a script or
   Makefile target) so CI and developers run the same thing.
6. **Measure again** with the same method, and report clean and
   incremental times before and after.

## Outputs

- Build configuration changes with the rationale for each.
- Clean build and incremental build results before and after, with the
  commands.

## Technology considerations

| Stack | Consideration |
|---|---|
| .NET | `Directory.Build.props` for shared settings, Central Package Management (`Directory.Packages.props`), `global.json` SDK pinning, lock files with locked-mode restore, and the binary log for slow targets. |
| Node, TypeScript, Vite | npm, pnpm, or Yarn workspaces, `npm ci` in CI, TypeScript project references and `incremental`, Vite build caching, and Nx or Turborepo remote caching only with approval (it uploads build outputs). |
| Python | `pyproject.toml` with a lock (uv, Poetry, pip-tools), wheels built once, and `python -m build` for packages. |
| Containers | A Docker build that reuses the same commands and lock files, so local and CI builds match. |

## Verification

- A clean build succeeds on the fixture with the documented command, and
  the lock file is honoured (the locked restore or install fails on drift).
- Clean and incremental build times before and after are reported from
  the same machine and command, or NOT_RUN with the reason.
- No new build tool was introduced without approval.

---
kind: recipe
capabilities: [CAP-13-004, CAP-13-005]
---
# Dockerfiles and container hardening

Improve Dockerfiles for correctness, size, caching, and reproducibility,
and harden the container's runtime posture: non-root user, read-only root
filesystem with mapped writable paths, dropped capabilities, minimal base,
resource limits, and health checks. Verify locally that the image builds
and starts. Security-only review of these files belongs to the security
skill.

## Inputs

- The Dockerfile, `.dockerignore`, build context, and the base image
  policy.
- The deployment manifests (Kubernetes, Compose, App Service settings) and
  the paths the application writes to.
- Current image size and build time.

## Procedure

### Dockerfile improvement (CAP-13-004)

1. **Measure:** build the image locally and record size and build time
   (clean and after a source-only change).
2. **Use multi-stage builds:** an SDK stage to restore, build, and
   publish, and a runtime-only final stage.
3. **Order for caching:** copy dependency manifests and lock files first,
   restore, then copy sources. Use BuildKit cache mounts for package
   caches.
4. **Shrink the context and image:** a `.dockerignore` (`bin/`, `obj/`,
   `node_modules/`, `.git/`, local secrets), production dependencies only,
   and slimmer bases from the project's approved list.
5. **Make it reproducible:** pin base images by tag and, where the policy
   allows, digest; install from lock files; no `latest`.
6. **Rebuild and compare** size and build time with the same commands.

### Runtime hardening (CAP-13-005)

1. **Run as non-root:** a `USER` in the final stage, using the image's
   built-in non-root user where one exists.
2. **Map writable paths:** find where the application writes (temp files,
   caches, uploads, logs) and mount those as volumes or `emptyDir`, so the
   root filesystem can be read-only.
3. **Restrict the runtime** in the deployment manifests:
   `readOnlyRootFilesystem: true`, `allowPrivilegeEscalation: false`,
   `capabilities: drop: ["ALL"]`, `runAsNonRoot: true`, and a seccomp
   profile (`RuntimeDefault`).
4. **Set resources and health:** CPU and memory requests and limits, and
   readiness and liveness probes (or a Docker `HEALTHCHECK` where the
   platform uses it) that check the app itself, not its dependencies.
5. **Bind to a non-privileged port** (above 1024) when running as non-root.
6. **Start the container locally** with the hardened settings
   (`docker run --read-only --user ... --cap-drop ALL` with the mapped
   volumes) and check that it serves requests.

## Outputs

- Findings and an improved Dockerfile following the project's base
  images, with image size and build time before and after, or NOT_RUN.
- A hardened Dockerfile and runtime settings, with writable paths mapped to
  volumes, and a startup check showing the app still runs.

## Technology considerations

| Stack | Consideration |
|---|---|
| .NET | `mcr.microsoft.com/dotnet/sdk` for build and `aspnet` or `runtime-deps` (chiseled variants if approved) for runtime. `USER $APP_UID` and port 8080 (the default in .NET 8 images). Publish with `dotnet publish -c Release -o /app`. |
| Node | Install with `npm ci --omit=dev` in a dependency stage, use the `node` user, and copy only the build output. For static Angular, React, or Vue builds, serve from an unprivileged web server image. |
| Python | Build wheels in one stage, install into a virtual environment, copy it to a slim runtime, create a non-root user, and set `PYTHONDONTWRITEBYTECODE` where the filesystem is read-only. |
| Kubernetes | Pod Security Standards `restricted` as the target, `emptyDir` for `/tmp`, and probes with sensible `initialDelaySeconds` or a `startupProbe`. |

## Verification

- The improved fixture Dockerfile is multi-stage, copies dependency
  manifests before sources, and builds successfully, or the build is
  NOT_RUN with the reason.
- The fixture container starts as a non-root user with a read-only root
  filesystem and serves a request, or the check is NOT_RUN.
- Image size and build time before and after come from the same commands,
  and no image was pushed.

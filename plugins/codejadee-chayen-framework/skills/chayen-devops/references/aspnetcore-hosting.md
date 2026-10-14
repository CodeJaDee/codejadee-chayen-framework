---
kind: technology
---
# ASP.NET Core hosting and deployment

Stack detail for building, configuring, and hosting ASP.NET Core apps. Use
it with the pipelines, containers, or release recipe and the operations
safety checklist. Producing artifacts and configuration is in scope;
running a deployment, restart, or rollback needs the user's explicit
authorization for that environment.

## Check the repository first

| Area | What to look for |
|---|---|
| Version | `<TargetFramework>`, `global.json`, and the base image tags or `setup-dotnet` versions in CI. They should agree. |
| Hosting target | Dockerfiles or SDK container publishing (`<ContainerRepository>`, `/t:PublishContainer`), Kubernetes or Helm manifests, Azure App Service or Container Apps settings, IIS (`web.config`, ASP.NET Core Module), or a Linux service behind Nginx |
| Publish settings | `dotnet publish` arguments in CI, `<RuntimeIdentifier>`, `<SelfContained>`, `<PublishReadyToRun>`, `<PublishAot>`, `<InvariantGlobalization>` |
| Configuration | `appsettings.{Environment}.json`, environment variables (`ASPNETCORE_ENVIRONMENT`, `ASPNETCORE_HTTP_PORTS`, `ASPNETCORE_URLS`, `Section__Key`), secret store providers |
| Behind a proxy | `UseForwardedHeaders` with known proxies or networks, HTTPS termination, path base |
| Runtime concerns | Health checks (`AddHealthChecks`, `MapHealthChecks`), Data Protection key storage, graceful shutdown settings |

## Hosting and deployment (aspnet-hosting-deployment)

**Applies when:** packaging, configuring, or hosting an ASP.NET Core app:
publish settings, container images, ports, environment configuration,
reverse proxies, health checks, Data Protection keys, startup and shutdown
behaviour, or a deployment that fails only in a hosted environment.

**Not when:** the work is the pipeline's structure or the infrastructure
code itself (the pipelines and infrastructure-as-code recipes), a security
review of the Dockerfile (the security skill), or application endpoint
code (the backend skill).

**Version notes:** the official .NET 8 and later container images listen on
port 8080 by default (`ASPNETCORE_HTTP_PORTS`) and include a non-root `app`
user; earlier images used port 80. SDK container publishing
(`dotnet publish /t:PublishContainer`) is built into the .NET 8 SDK and
later. Native AOT publishing for ASP.NET Core starts with .NET 8 and
supports only part of the framework. Match the runtime image tag to the
target framework.

**Steps:**

1. Confirm the target framework, the SDK, and the runtime image or hosting
   runtime agree; a mismatch is the first thing to report.
2. Build artifacts the way the project does: its Dockerfile (multi-stage:
   SDK image to restore and publish, `aspnet` runtime image to run), SDK
   container publishing, or `dotnet publish -c Release -o <dir>` with the
   project's runtime identifier and self-contained settings.
3. Run as non-root and listen on the configured port: set
   `ASPNETCORE_HTTP_PORTS` or `ASPNETCORE_URLS` deliberately and align the
   container port, probes, and ingress with it.
4. Configure per environment through `ASPNETCORE_ENVIRONMENT`,
   `appsettings.{Environment}.json`, and environment variables
   (`Section__Key`); secrets come from the secret store, never from images
   or committed files.
5. Behind a reverse proxy or load balancer, enable forwarded headers with
   the known proxies or networks, so redirects, HTTPS detection, and client
   IPs are correct.
6. Expose health endpoints the platform uses: liveness (process up) and
   readiness (dependencies reachable), with detailed output not public.
7. Persist and share Data Protection keys (blob storage, Redis, a database,
   or a mounted volume) when there are several instances or containers are
   replaced; otherwise cookies and antiforgery tokens fail after a
   restart.
8. Handle shutdown: the app stops on SIGTERM; align the host's shutdown
   timeout with the platform's grace period so in-flight requests and
   background work can finish.
9. Hand over the deploy step: the command or pipeline run, the target
   environment, the health check to watch, and the rollback. Run it only
   with explicit authorization.

**Verify:** `dotnet publish` (or the image build) succeeds; locally, the
app starts with the production-like configuration, answers its health
endpoint on the configured port, and stops cleanly on Ctrl+C or
`docker stop`; report PASS, FAIL, or NOT_RUN with the command for each.

## Commands

```bash
dotnet publish -c Release -o ./publish                          # framework-dependent
dotnet publish -c Release -r linux-x64 --self-contained         # only if the project ships self-contained
dotnet publish -c Release /t:PublishContainer                   # .NET 8+ SDK, when the project uses SDK containers
docker build -t <app>:local . && docker run --rm -p 8080:8080 <app>:local   # local only
curl -fsS http://localhost:8080/health                          # the project's health path
```

## Pitfalls

- **Port mismatch after an upgrade to .NET 8 images** (80 versus 8080), so
  probes and ingress fail.
- **Data Protection keys kept in the container,** which logs users out on
  every deployment.
- **`ASPNETCORE_ENVIRONMENT=Development` in a deployed environment,** which
  enables the developer exception page.
- **Secrets baked into images** or `appsettings.Production.json`.
- **Forwarded headers accepted from any source,** or not enabled at all
  behind a proxy.

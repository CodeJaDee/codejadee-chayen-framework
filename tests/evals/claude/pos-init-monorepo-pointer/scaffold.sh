#!/usr/bin/env bash
set -eu
# Generated developer-only fixture. Run only in the eval's empty workspace.
node --input-type=module <<'INIT_FIXTURE'
import fs from 'node:fs';
import path from 'node:path';
const files = {
  "AGENTS.md": "Use the repository's existing naming and test runner.\n",
  "README.md": "# Health workspace\nThe api serves health endpoints. The web app displays their status.\n",
  "api/Api.csproj": "<Project Sdk=\"Microsoft.NET.Sdk.Web\">\n  <PropertyGroup><TargetFramework>net9.0</TargetFramework></PropertyGroup>\n</Project>\n",
  "api/Program.cs": "var builder = WebApplication.CreateBuilder(args);\nvar app = builder.Build();\napp.MapGet(\"/health\", () => Results.Ok(\"ready\"));\napp.MapGet(\"/version\", () => Results.Ok(\"1\"));\napp.Run();\n",
  "api/tests/Api.Tests/Api.Tests.csproj": "<Project Sdk=\"Microsoft.NET.Sdk\">\n  <PropertyGroup><TargetFramework>net9.0</TargetFramework><IsTestProject>true</IsTestProject></PropertyGroup>\n  <ItemGroup>\n    <PackageReference Include=\"xunit\" Version=\"2.9.3\" />\n    <PackageReference Include=\"Microsoft.NET.Test.Sdk\" Version=\"17.14.1\" />\n  </ItemGroup>\n</Project>\n",
  "api/tests/Api.Tests/HealthTests.cs": "using Xunit;\npublic class HealthTests\n{\n    [Fact]\n    public void Ready_is_not_empty() => Assert.NotEmpty(\"ready\");\n    [Fact]\n    public void Version_is_not_empty() => Assert.NotEmpty(\"1\");\n}\n",
  "package.json": "{\"private\":true,\"workspaces\":[\"web\"]}\n",
  "web/package.json": "{\"name\":\"web\",\"private\":true,\"type\":\"module\",\"scripts\":{\"test\":\"node --test\"}}\n",
  "web/index.html": "<!doctype html>\n<title>Health</title>\n<div id=\"app\"></div>\n<script type=\"module\" src=\"./src/main.js\"></script>\n",
  "web/src/main.js": "import { statusLabel } from \"./status.js\";\ndocument.querySelector(\"#app\").textContent = statusLabel(\"ready\");\n",
  "web/src/status.js": "export function statusLabel(value) { return `Status: ${value}`; }\n",
  "web/src/status.test.js": "import test from \"node:test\";\nimport assert from \"node:assert/strict\";\nimport { statusLabel } from \"./status.js\";\ntest(\"labels ready\", () => assert.equal(statusLabel(\"ready\"), \"Status: ready\"));\ntest(\"labels down\", () => assert.equal(statusLabel(\"down\"), \"Status: down\"));\n"
};
for (const [file, body] of Object.entries(files)) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, body, { flag: 'wx' });
}
INIT_FIXTURE

#!/usr/bin/env bash
set -eu
# Generated developer-only fixture. Run only in the eval's empty workspace.
node --input-type=module <<'INIT_FIXTURE'
import fs from 'node:fs';
import path from 'node:path';
const files = {
  "AGENTS.md": "Use the repository's existing naming and test runner.\n",
  "README.md": "# Health API\nA minimal HTTP health service.\nBuild: `dotnet build Api.csproj`.\nTest: `dotnet test tests/Api.Tests/Api.Tests.csproj`.\n",
  "Api.csproj": "<Project Sdk=\"Microsoft.NET.Sdk.Web\">\n  <PropertyGroup><TargetFramework>net9.0</TargetFramework></PropertyGroup>\n</Project>\n",
  "Program.cs": "var builder = WebApplication.CreateBuilder(args);\nvar app = builder.Build();\napp.MapGet(\"/health\", () => Results.Ok(\"ready\"));\napp.MapGet(\"/version\", () => Results.Ok(\"1\"));\napp.Run();\n",
  "tests/Api.Tests/Api.Tests.csproj": "<Project Sdk=\"Microsoft.NET.Sdk\">\n  <PropertyGroup><TargetFramework>net9.0</TargetFramework><IsTestProject>true</IsTestProject></PropertyGroup>\n  <ItemGroup>\n    <PackageReference Include=\"xunit\" Version=\"2.9.3\" />\n    <PackageReference Include=\"Microsoft.NET.Test.Sdk\" Version=\"17.14.1\" />\n  </ItemGroup>\n</Project>\n",
  "tests/Api.Tests/HealthTests.cs": "using Xunit;\npublic class HealthTests\n{\n    [Fact]\n    public void Ready_is_not_empty() => Assert.NotEmpty(\"ready\");\n    [Fact]\n    public void Version_is_not_empty() => Assert.NotEmpty(\"1\");\n}\n"
};
for (const [file, body] of Object.entries(files)) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, body, { flag: 'wx' });
}
INIT_FIXTURE

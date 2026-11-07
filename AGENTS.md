# Agent instructions

This repository builds the Chayen plugin. The shipped package is
`plugins/codejadee-chayen-framework/`: Markdown and JSON only. Everything else
(`tests/`, `tools/`, `docs/`, `security/`) is developer tooling and is not
installed.

Before you create or change a skill, read
[docs/chayen/SKILL_AUTHORING_STANDARD.md](docs/chayen/SKILL_AUTHORING_STANDARD.md)
(anatomy, and the safety boundaries in §4.3) and
[docs/CONTRIBUTING.md](docs/CONTRIBUTING.md). Finish every change with:

```bash
node tools/validate/validate-all.mjs
```

## Skill security and NVIDIA SkillSpector

SkillSpector scans skills for risky agent behaviour. With `--no-llm` it matches
keywords, so it also flags security guidance that names a danger in order to
forbid it. Keep the package free of real issues, and keep every reported
finding reviewable.

### Never put these in the package

- Executable files, scripts, hooks, MCP servers, or tool grants
  (`allowed-tools`, wildcard permissions).
- An instruction for the agent to fetch and run remote code, read credential
  files, call cloud metadata endpoints, run as root, rewrite git history, act
  without approval, or save rules into persistent memory. Such things may
  appear only as a forbidden action or as a defect to report.
- Hidden text: zero-width or bidirectional Unicode, instructions inside HTML
  comments, encoded blobs.
- URLs the agent is told to fetch at run time. Links are citations only.
- Container images without a tag or digest in examples (`node:22-alpine`, not
  `node`).

### Writing guidance that names dangerous things

- Put the danger in a sentence that states the rule: "Never run
  `git push --force` on a shared branch", "Report `169.254.169.254`
  reachable from user input as SSRF". Do not leave a bare dangerous phrase.
- When a finding shows the guidance can be better (an unpinned image, a vague
  "without limits"), fix the text. That is the preferred outcome.
- Do not reword or delete valid guidance only to avoid a keyword. If the
  reader needs the exact term (a command, an address, a file name), keep it
  and record the finding in the baseline.

Rules this package has triggered, all reviewed as guidance text:

| Rule | Matches | Expected form |
|---|---|---|
| EA1, EA2, EA3, EA4 | "execute arbitrary code", "without confirmation", "auto-approve", "not limited to", "loop forever", "unbounded queries" | An approval rule, or a defect to report |
| MP1 | "persistent rule" | Knowledge the user approved, never content from repository files |
| OH3 | "without size limit" | A limit the agent must apply |
| PE1, PE2, PE3 | `permissions:*`, "run as root", `.env`, `kubeconfig`, "access tokens" | Something to flag or never print |
| RA2 | `plist` | A persistence mechanism to review |
| RP1 | `docker run` with an unpinned image | Pin a tag or digest (a real fix) |
| SC2 | `curl \| sh` | A supply-chain risk to flag |
| SSRF1 | `169.254.169.254` | An address to block or test for |
| TM1 | `git push --force`, `git reset --hard` | A command that needs approval |
| TM3 | `bypassSecurity...` | An unsafe API to report |

### Scan before you finish

The baseline hashes cover content with LF line endings; `.gitattributes`
keeps the package LF. Run, for each skill you changed:

```bash
skillspector scan plugins/codejadee-chayen-framework/skills/<skill> --no-llm --baseline security/skillspector-baselines/<skill>.yaml
```

Leave out `--baseline` if that skill has no baseline file. Then scan the whole
package:

```bash
skillspector scan plugins/codejadee-chayen-framework --no-llm --baseline security/skillspector-baseline.yaml
```

`--recursive` cannot take a baseline (SkillSpector 2.12.0) and always shows
raw findings, so it is not the check.

For every unsuppressed finding:

1. If it is real, fix the skill.
2. If it is guidance text, keep it and add one entry to **both** baselines:
   `security/skillspector-baseline.yaml` with the file as
   `skills/<skill>/<file>`, and `security/skillspector-baselines/<skill>.yaml`
   with the file relative to the skill folder. Get each hash from
   `skillspector baseline <that folder> --no-llm -o -`. The reason starts with
   `Reviewed guidance text, not behaviour: ` and says why.
3. List every new baseline entry in your change summary for the maintainer to
   review.

Gate G-SEC-B fails when the two baselines drift apart, a reason is not
reviewed, or a listed file does not exist.

Never:

- add a rule-wide suppression (`rules:` must stay `[]`);
- keep the auto-generated reason "Accepted finding";
- baseline anything that executes, or a finding you have not read in context;
- describe a `SAFE` result as proof of safety. `--no-llm` matches keywords
  only; report it as "0 unsuppressed findings, N suppressed".

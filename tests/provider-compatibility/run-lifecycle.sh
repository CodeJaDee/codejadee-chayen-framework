#!/usr/bin/env bash
# Developer-only native lifecycle check (no model calls, no cost).
# For each available CLI, in an ISOLATED config home under $WORK, from a git fixture repo:
#   marketplace add (local copy of this repo) -> install -> list/details -> disable -> enable -> uninstall -> marketplace remove
# then verifies the fixture repo is byte-identical and git-clean (installing modifies no application code).
#
# Usage: tests/provider-compatibility/run-lifecycle.sh <work-dir>
# Requires: git, node; optional: claude, codex, copilot on PATH. Never shipped with the plugin.
# The user's real ~/.claude, ~/.codex and ~/.copilot are not touched (CLAUDE_CONFIG_DIR, CODEX_HOME, COPILOT_HOME).
set -u
REPO="$(cd "$(dirname "$0")/../.." && pwd)"
WORK="${1:?usage: run-lifecycle.sh <work-dir>}"
rm -rf "$WORK" && mkdir -p "$WORK"/{mp,fixture/src,home-claude,home-codex,home-copilot}
cp -r "$REPO"/.claude-plugin "$REPO"/.agents "$REPO"/.github "$REPO"/plugins "$WORK/mp/"
winpath() { if command -v cygpath >/dev/null; then cygpath -w "$1"; else echo "$1"; fi; }
MP="$(winpath "$WORK/mp")"
ID="codejadee-chayen-framework@codejadee"
PASS=0; FAIL=0; SKIP=0
check() { if [ "$2" = 0 ]; then echo "PASS  $1"; PASS=$((PASS+1)); else echo "FAIL  $1"; FAIL=$((FAIL+1)); fi; }

# Fixture application repository
( cd "$WORK/fixture" && printf 'namespace App;\npublic class OrdersController { }\n' > src/OrdersController.cs \
  && printf '# App rules\n' > AGENTS.md && printf '# Claude rules\n' > CLAUDE.md \
  && git init -q && git config core.longpaths true && git config core.autocrlf false && git add -A \
  && git -c user.email=t@t -c user.name=t commit -qm fixture )
treehash() { (cd "$WORK/fixture" && find . -path ./.git -prune -o -type f -print0 | sort -z | xargs -0 sha256sum | sha256sum | cut -c1-16); }
H1="$(treehash)"
cd "$WORK/fixture"

if command -v claude >/dev/null; then
  export CLAUDE_CONFIG_DIR="$(winpath "$WORK/home-claude")" DISABLE_AUTOUPDATER=1 CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1
  echo "== Claude Code $(claude --version 2>/dev/null)"
  claude plugin marketplace add "$MP" >/dev/null 2>&1; check "claude: marketplace add" $?
  claude plugin install "$ID" >/dev/null 2>&1; check "claude: install" $?
  claude plugin list 2>/dev/null | grep -A3 "$ID" | grep -q "enabled"; check "claude: listed as enabled" $?
  claude plugin details codejadee-chayen-framework 2>/dev/null | grep -q "Skills (6)"; check "claude: 6 skills discoverable" $?
  claude plugin details codejadee-chayen-framework 2>/dev/null | grep -qE "Hooks \(0\)" && claude plugin details codejadee-chayen-framework 2>/dev/null | grep -qE "MCP servers \(0\)"; check "claude: no hooks / MCP servers (no runtime)" $?
  claude plugin disable "$ID" >/dev/null 2>&1 && claude plugin list 2>/dev/null | grep -A3 "$ID" | grep -q "disabled"; check "claude: disable" $?
  claude plugin enable "$ID" >/dev/null 2>&1; check "claude: enable" $?
  claude plugin uninstall "$ID" >/dev/null 2>&1 && ! claude plugin list 2>/dev/null | grep -q "$ID"; check "claude: uninstall" $?
  claude plugin marketplace remove codejadee >/dev/null 2>&1; check "claude: marketplace remove" $?
  unset CLAUDE_CONFIG_DIR
else echo "SKIP  claude not on PATH"; SKIP=$((SKIP+1)); fi

if command -v codex >/dev/null; then
  export CODEX_HOME="$(winpath "$WORK/home-codex")"
  echo "== $(codex --version 2>/dev/null | grep -v 'PATH aliases')"
  codex plugin marketplace add "$MP" >/dev/null 2>&1; check "codex: marketplace add" $?
  codex plugin add "$ID" >/dev/null 2>&1; check "codex: install (plugin add)" $?
  codex plugin list --marketplace codejadee 2>/dev/null | grep "codejadee-chayen-framework" | grep -q "installed, enabled"; check "codex: listed as installed, enabled" $?
  [ "$(find "$WORK/home-codex/plugins/cache" -name SKILL.md 2>/dev/null | grep -c chayen-)" = 6 ]; check "codex: 6 skills in plugin cache" $?
  codex plugin remove "$ID" >/dev/null 2>&1; check "codex: uninstall (plugin remove)" $?
  codex plugin marketplace remove codejadee >/dev/null 2>&1; check "codex: marketplace remove" $?
  unset CODEX_HOME
else echo "SKIP  codex not on PATH"; SKIP=$((SKIP+1)); fi

if command -v copilot >/dev/null; then
  export COPILOT_HOME="$(winpath "$WORK/home-copilot")"
  echo "== $(copilot --version </dev/null 2>/dev/null | head -1)"
  copilot plugin marketplace add "$MP" </dev/null >/dev/null 2>&1; check "copilot: marketplace add" $?
  copilot plugin install "$ID" </dev/null 2>/dev/null | grep -q "Installed 6 skills"; check "copilot: install (6 skills)" $?
  [ "$(copilot skill list </dev/null 2>/dev/null | grep -cE '^\s+chayen-')" = 6 ]; check "copilot: 6 skills discoverable" $?
  copilot plugin disable "$ID" </dev/null >/dev/null 2>&1 && [ "$(copilot skill list </dev/null 2>/dev/null | grep -cE '^\s+chayen-')" = 0 ]; check "copilot: disable hides skills" $?
  copilot plugin enable "$ID" </dev/null >/dev/null 2>&1; check "copilot: enable" $?
  copilot plugin uninstall codejadee-chayen-framework </dev/null >/dev/null 2>&1; check "copilot: uninstall" $?
  copilot plugin marketplace remove codejadee </dev/null >/dev/null 2>&1; check "copilot: marketplace remove" $?
  unset COPILOT_HOME
else echo "SKIP  copilot not on PATH"; SKIP=$((SKIP+1)); fi

H2="$(treehash)"
[ "$H1" = "$H2" ]; check "fixture application files unchanged ($H1)" $?
[ -z "$(git -C "$WORK/fixture" status --porcelain)" ]; check "fixture git status clean" $?
echo "== $PASS passed, $FAIL failed, $SKIP skipped"
[ "$FAIL" = 0 ]

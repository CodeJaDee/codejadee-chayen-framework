#!/usr/bin/env bash
# Developer-only native lifecycle check (no model calls; CLI traffic may occur).
# For each available CLI, in an ISOLATED config home under $WORK, from a git fixture repo:
#   marketplace add (local copy of this repo) -> install -> list/details -> disable -> enable -> uninstall -> marketplace remove
# then verifies the fixture repo is byte-identical and git-clean (installing modifies no application code).
#
# Usage after review/authorization: CHAYEN_ALLOW_PROVIDER_LIFECYCLE=1 bash tests/provider-compatibility/run-lifecycle.sh <fresh-work-dir>
# Requires: git, node; optional: claude, codex, copilot on PATH. Never shipped with the plugin.
# Config-home overrides request isolation; native CLI/OS behavior is not sandboxed here.
set -u
REPO="$(cd "$(dirname "$0")/../.." && pwd)"
WORK="${1:?usage: run-lifecycle.sh <work-dir>}"
if [ "${CHAYEN_ALLOW_PROVIDER_LIFECYCLE:-}" != 1 ]; then
  echo "Provider lifecycle requires explicit authorization and CHAYEN_ALLOW_PROVIDER_LIFECYCLE=1" >&2; exit 2
fi
if [ -e "$WORK" ] || [ -L "$WORK" ]; then
  echo "Refusing an existing work directory; choose a fresh scratch directory" >&2; exit 2
fi
WORK_PARENT="$(cd -- "$(dirname -- "$WORK")" && pwd -P)" || exit 2
WORK_LEAF="$(basename -- "$WORK")"
case "$WORK_LEAF" in ''|.|..|*[!a-zA-Z0-9._-]*) echo "Unsafe work directory name" >&2; exit 2;; esac
WORK="$WORK_PARENT/$WORK_LEAF"
case "$WORK/" in "$REPO/"*) echo "Use scratch outside the repository" >&2; exit 2;; esac
mkdir -- "$WORK" || exit 2
mkdir -p "$WORK"/{mp,fixture/src,home-claude,home-codex,home-copilot} || exit 2
if find "$REPO/plugins" "$REPO/.claude-plugin" "$REPO/.agents" "$REPO/.github" -type l -print -quit | grep -q .; then
  echo "Refusing linked installation sources" >&2; exit 2
fi
cp -r "$REPO"/.claude-plugin "$REPO"/.agents "$REPO"/.github "$REPO"/plugins "$WORK/mp/" || exit 2
winpath() { if command -v cygpath >/dev/null; then cygpath -w "$1"; else echo "$1"; fi; }
MP="$(winpath "$WORK/mp")"
ID="chayen@codejadee"
# Expected skill count, taken from the canonical skills source (not hard-coded).
N="$(find "$REPO/plugins/codejadee-chayen-framework/skills" -mindepth 2 -maxdepth 2 -name SKILL.md | wc -l | tr -d " ")"
PASS=0; FAIL=0; SKIP=0
check() { if [ "$2" = 0 ]; then echo "PASS  $1"; PASS=$((PASS+1)); else echo "FAIL  $1"; FAIL=$((FAIL+1)); fi; }

# Fixture application repository
( cd "$WORK/fixture" && printf 'namespace App;\npublic class OrdersController { }\n' > src/OrdersController.cs \
  && printf '# App rules\n' > AGENTS.md && printf '# Claude rules\n' > CLAUDE.md \
  && git init -q && git config core.longpaths true && git config core.autocrlf false && git add -A \
  && git -c user.email=t@t -c user.name=t commit -qm fixture ) || exit 2
treehash() { (cd "$WORK/fixture" && find . -path ./.git -prune -o -type f -print0 | sort -z | xargs -0 sha256sum | sha256sum | cut -c1-16); }
H1="$(treehash)"
cd "$WORK/fixture" || exit 2

if command -v claude >/dev/null; then
  export CLAUDE_CONFIG_DIR="$(winpath "$WORK/home-claude")" DISABLE_AUTOUPDATER=1 CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1
  echo "== Claude Code $(claude --version 2>/dev/null)"
  claude plugin marketplace add "$MP" >/dev/null 2>&1; check "claude: marketplace add" $?
  claude plugin install "$ID" >/dev/null 2>&1; check "claude: install" $?
  claude plugin list 2>/dev/null | grep -A3 "$ID" | grep -q "enabled"; check "claude: listed as enabled" $?
  claude plugin details chayen 2>/dev/null | grep -q "Skills ($N)"; check "claude: $N skills discoverable" $?
  claude plugin details chayen 2>/dev/null | grep -qE "Hooks \(0\)" && claude plugin details chayen 2>/dev/null | grep -qE "MCP servers \(0\)"; check "claude: no hooks / MCP servers (no runtime)" $?
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
  codex plugin list --marketplace codejadee 2>/dev/null | grep "chayen" | grep -q "installed, enabled"; check "codex: listed as installed, enabled" $?
  [ "$(find "$WORK/home-codex/plugins/cache" -name SKILL.md 2>/dev/null | grep -c chayen-)" = "$N" ]; check "codex: $N skills in plugin cache" $?
  codex plugin remove "$ID" >/dev/null 2>&1; check "codex: uninstall (plugin remove)" $?
  codex plugin marketplace remove codejadee >/dev/null 2>&1; check "codex: marketplace remove" $?
  unset CODEX_HOME
else echo "SKIP  codex not on PATH"; SKIP=$((SKIP+1)); fi

if command -v copilot >/dev/null; then
  export COPILOT_HOME="$(winpath "$WORK/home-copilot")"
  echo "== $(copilot --version </dev/null 2>/dev/null | head -1)"
  copilot plugin marketplace add "$MP" </dev/null >/dev/null 2>&1; check "copilot: marketplace add" $?
  copilot plugin install "$ID" </dev/null 2>/dev/null | grep -q "Installed $N skills"; check "copilot: install ($N skills)" $?
  [ "$(copilot skill list </dev/null 2>/dev/null | grep -cE '^\s+chayen-')" = "$N" ]; check "copilot: $N skills discoverable" $?
  copilot plugin disable "$ID" </dev/null >/dev/null 2>&1 && [ "$(copilot skill list </dev/null 2>/dev/null | grep -cE '^\s+chayen-')" = 0 ]; check "copilot: disable hides skills" $?
  copilot plugin enable "$ID" </dev/null >/dev/null 2>&1; check "copilot: enable" $?
  copilot plugin uninstall chayen </dev/null >/dev/null 2>&1; check "copilot: uninstall" $?
  copilot plugin marketplace remove codejadee </dev/null >/dev/null 2>&1; check "copilot: marketplace remove" $?
  unset COPILOT_HOME
else echo "SKIP  copilot not on PATH"; SKIP=$((SKIP+1)); fi

H2="$(treehash)"
[ "$H1" = "$H2" ]; check "fixture application files unchanged ($H1)" $?
[ -z "$(git -C "$WORK/fixture" status --porcelain)" ]; check "fixture git status clean" $?
echo "== $PASS passed, $FAIL failed, $SKIP skipped"
[ "$FAIL" = 0 ]

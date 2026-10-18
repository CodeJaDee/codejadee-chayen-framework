#!/usr/bin/env bash
# Developer-only, native commands only. Requires explicit authorization and a
# disposable environment. Never shipped; no model calls.
set -euo pipefail
REPO="$(cd "$(dirname "$0")/../.." && pwd -P)"
exec node "$REPO/tests/provider-compatibility/lifecycle.mjs" "${1:?provide a fresh scratch directory}"

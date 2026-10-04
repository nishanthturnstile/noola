#!/bin/sh
set -eu
npm install --prefix /tmp/noola-pnpm pnpm@12.8.1 --ignore-scripts --no-audit --no-fund >/dev/null
export PATH="/tmp/noola-pnpm/node_modules/.bin:$PATH"
pnpm install --frozen-lockfile
exec pnpm exec playwright test --config playwright.identity.config.ts "$@"

#!/bin/sh
set -eu
npm install --prefix /tmp/noola-pnpm pnpm@12.8.1 --ignore-scripts --no-audit --no-fund >/dev/null
export PATH="/tmp/noola-pnpm/node_modules/.bin:$PATH"
export PLAYWRIGHT_BROWSERS_PATH=/pnpm/store/playwright-browsers
pnpm install --frozen-lockfile
pnpm exec playwright install chromium webkit
exec pnpm exec playwright test --config playwright.identity.config.ts "$@"

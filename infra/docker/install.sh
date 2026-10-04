#!/bin/sh
set -eu
# Only Docker-owned volumes are chowned; never change ownership of the checkout.
for directory in node_modules apps/api/node_modules apps/web/node_modules packages/contracts/node_modules packages/api-client/node_modules /pnpm/store; do
  chown "$LOCAL_UID:$LOCAL_GID" "$directory"
done
exec setpriv --reuid="$LOCAL_UID" --regid="$LOCAL_GID" --clear-groups --reset-env sh -c 'pnpm install --frozen-lockfile --store-dir /pnpm/store && pnpm generate && pnpm --filter "@noola/api^..." build'

FROM node:24.21.0-bookworm-slim@sha256:0e0ff40c39bc087845bfb27465a0df4ea419520094bc35842ff83dd8cbe6f9b6 AS build
RUN npm install --global pnpm@12.8.1
WORKDIR /spike
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json
COPY packages/contracts/package.json ./packages/contracts/package.json
COPY packages/api-client/package.json ./packages/api-client/package.json
RUN pnpm install --frozen-lockfile --ignore-scripts
COPY apps/api/experiments/phase0/codex-sdk ./apps/api/experiments/phase0/codex-sdk
COPY tsconfig.base.json ./
COPY apps/api/tsconfig.json apps/api/tsconfig.check.json ./apps/api/
COPY apps/api/experiments/phase0/tsconfig.json ./apps/api/experiments/phase0/
RUN pnpm exec tsc -p apps/api/experiments/phase0/codex-sdk/tsconfig.runtime.json --outDir /runtime
RUN node --input-type=module <<'JS'
import { cpSync, mkdirSync, realpathSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
const api = createRequire('/spike/apps/api/package.json');
const sdk = realpathSync('/spike/apps/api/node_modules/@openai/codex-sdk');
const sdkRequire = createRequire(join(sdk, 'package.json'));
const cli = dirname(sdkRequire.resolve('@openai/codex/package.json'));
const cliRequire = createRequire(join(cli, 'package.json'));
const platformName = `@openai/codex-linux-${process.arch}`;
const selected = [
  ['@openai/codex-sdk', sdk], ['@openai/codex', cli],
  [platformName, dirname(cliRequire.resolve(`${platformName}/package.json`))],
  ['zod', dirname(api.resolve('zod/package.json'))],
];
for (const [name, source] of selected) {
  const target = join('/runtime/node_modules', name);
  mkdirSync(dirname(target), {recursive: true});
  cpSync(source, target, {recursive: true});
}
writeFileSync('/runtime/package.json', JSON.stringify({private: true, type: 'module'}));
JS

FROM node:24.21.0-bookworm-slim@sha256:0e0ff40c39bc087845bfb27465a0df4ea419520094bc35842ff83dd8cbe6f9b6
WORKDIR /runtime
COPY --from=build /runtime ./
USER node
ENTRYPOINT ["node", "container.js"]

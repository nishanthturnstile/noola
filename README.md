# Noola

Runnable foundation for Noola, before Phase 1. No product accounts, household features, AI, queues, or retained user data are enabled. Disposable Phase 0 experiments live outside the running application. Bootstrap checks do not satisfy product/device/recovery gates. See the [documentation guide](docs/README.md) for architecture and requirements.

## Start in WSL

Keep the checkout on the Linux filesystem. Enable this distro in Docker Desktop → Settings → Resources → WSL Integration, and keep Docker Desktop running. Use Node **24.21.0** and pnpm **12.8.1** (the versions pinned by `.node-version` and `packageManager`).

```sh
pnpm install --frozen-lockfile
pnpm env:init
pnpm infra:up
pnpm db:provision
pnpm dev
```

Open [Noola locally](http://localhost:5173). The page's connection indicator exercises the generated client, API, and PostgreSQL. Source edits hot reload in the containers. The one-time dependency service installs Linux dependencies before either application starts; Docker volumes hide host `node_modules`. After changing dependencies, run `pnpm dev:down` then `pnpm dev` so installation finishes before application processes restart. `pnpm dev:logs` follows application logs.

`pnpm dev:down` stops Noola only. Shared PostgreSQL continues running for other applications. Its `unless-stopped` restart policy resumes it when Docker starts, unless you explicitly stopped it. It cannot run while Windows or Docker Desktop is off.

## Shared PostgreSQL and credentials

The independent `local-infra` Compose project runs PostgreSQL **18.6**, pinned by digest. Its external `local-postgres-data` volume and `local-databases` network are created once. PostgreSQL 18 stores data under `/var/lib/postgresql/18/docker`; the volume mounts at `/var/lib/postgresql`.

Configuration is generated once with random passwords and mode `0600`, outside the source mounts:

- `$XDG_CONFIG_HOME/local-infra/postgres.env` (default `~/.config/local-infra/postgres.env`): shared administrator password, `POSTGRES_PORT=5432`, `POSTGRES_MEMORY_LIMIT=1g`.
- `$XDG_CONFIG_HOME/noola/development.env` (default `~/.config/noola/development.env`): Noola role passwords, `WEB_PORT=5173`, `DB_POOL_SIZE=5`.

`pnpm env:init` preserves existing files. Never commit these files or copy them into the checkout. The committed `.env.example` files document available settings; application scripts do not load a repository `.env`.

Noola's database is `noola`. `noola_owner` owns migrations; `noola_app` gets connection, schema usage, table CRUD and sequence privileges, without schema creation, database creation, superuser rights or membership in the owner role. Database administrator credentials reach only explicit provisioning/integration/Phase 0 tooling. Web receives no database credentials. The API receives only its application URL.

`pnpm db:provision` works on an existing shared server, preserves data and passwords, and rejects unexpected database ownership or privileged roles. It does not rely on Docker's first-boot initialization directory. A password mismatch fails instead of resetting credentials. Password rotation and importing an existing server require deliberate operator work.

Other projects join the external `local-databases` network and connect to `local-postgres:5432` using **their own database and role**. WSL host tools use `127.0.0.1:5432` (or the configured port). The web stays on Noola's network; only its API/tools join the shared network. Sharing an instance is a local development convenience, not a production tenant-isolation guarantee.

To stop the shared server deliberately, use `docker stop local-infra-postgres-1`; restart it with `pnpm infra:up`. Application commands never remove the external volume. Do not remove that volume or upgrade PostgreSQL's major version without backups and an explicit migration procedure. Host ports bind to loopback.

## Development and verification

| Command | Purpose |
|---|---|
| `pnpm generate` / `pnpm generate:check` | Generate route tree, OpenAPI and client declarations / detect drift |
| `pnpm check` | Generation drift, Biome, strict types, import/cycle boundaries, unit tests, independent builds and docs |
| `pnpm test:integration` | Real database provisioning, privilege and health checks; removes only its generated fixtures |
| `pnpm phase0:runtime` | Disposable synthetic identity, isolation, migration and local recovery proof; requires refreshed Docker dependencies |
| `pnpm phase0:typecheck` / `pnpm phase0:check` | Strict experiment application types / combined types and runtime proof |
| `pnpm phase0:declarations` | Full upstream declaration diagnostic; still fails, separate from required application checks |
| `pnpm db:migrate` | Explicit migration step using owner credentials; reports no pending migrations initially |
| `pnpm --filter @noola/api db:generate` | Generate SQL when an owned schema exists; review before applying |
| `pnpm test:e2e` | Playwright/axe with local host servers; requires a valid host `DATABASE_URL` |
| `PLAYWRIGHT_BASE_URL=http://127.0.0.1:5173 pnpm test:e2e` | Test the already-running Docker application |
| `pnpm format` | Biome formatting and supported lint fixes |
| `pnpm --filter @noola/api... build` | Build backend and its contracts without building web |
| `pnpm --filter @noola/web... build` | Build web and its shared packages independently |

Install the browser once with `pnpm exec playwright install chromium`. On minimal Linux installations, `pnpm exec playwright install-deps chromium` installs the required system libraries. CI uses disposable PostgreSQL and synthetic credentials; it never connects to the workstation database. Local integration tests create a uniquely named table in Noola and a disposable second database, then clean them up.

This WSL host currently uses an existing user-cache library bundle for Playwright because system dependencies are missing. The [pre-slice review](docs/reviews/PHASE-0-READINESS.md#pre-slice-cleanup-review) records its explicit test command and limitations; fresh machines should use the standard installation above.

Turborepo caches deterministic builds locally. Generation, development, tests, migrations and database operations are uncached. Remote caching is disabled. Runtime secrets are not build inputs or browser configuration. The API build is plain JavaScript; development uses `tsx`. The Vite development proxy sends `/api` to the internal API without CORS or another local proxy container.

Health interfaces are `GET /api/health/live` → `200 {"status":"ok"}` and `GET /api/health/ready` → `200 {"status":"ready"}` or `503 {"status":"unavailable"}`. Responses are uncached and omit connection details. OpenAPI and client declarations are generated from browser-safe contracts, not database types.

## Structure and design

Four workspaces: `apps/web`, `apps/api`, `packages/contracts`, and `packages/api-client`. Database assembly, reviewed migrations, future adapters and jobs belong to the backend. Empty structural homes use `.gitkeep`; domain modules arrive with features. File placement and dependency boundaries are owned by the [code-structure skill](.agents/skills/noola-code-structure/SKILL.md).

The UI uses the [shadcn/create preset](https://ui.shadcn.com/create?preset=b5cRMiRzk): Base UI, Nova, stone, teal, Geist and Lucide. Generator `shadcn@4.21.1`, preset `b5cRMiRzk`, and its decoded settings are recorded in `apps/web/shadcn-preset.json`. Components and tokens remain inside the web app. Reapply intentionally with `pnpm --filter @noola/web exec shadcn apply b5cRMiRzk`; review generated changes, then format and test. The owned dark primary/focus tokens are lightened after axe identified insufficient text contrast in the generated theme. Reapplying a preset requires preserving or revalidating that correction. No second UI package or business screen is introduced.

## Compatibility and evidence

TypeScript 5.9.3 satisfies the current OpenAPI generator's 5.x peer. The root, web and shared packages retain `skipLibCheck: false`. The owner-approved backend exception sets it to `true` only in the API configuration and its derived check/experiment projects. Strict application checks remain enabled; all declaration files in those backend compilations are skipped. `pnpm phase0:declarations` exposes the upstream errors separately. [The compiler-policy record](docs/reviews/PERSISTENCE-COMPATIBILITY.md#compiler-policy-decision) describes the tradeoff and removal trigger.

Stable Drizzle ORM/Kit and the maintained Better Auth Drizzle adapter remain selected. Their synthetic migration, rollback, session and isolation proofs pass. ORM initialization in the running application still waits for an owned domain schema; health uses the single `pg` pool.

The current TanStack CLI emits an upstream CommonJS circular-import warning during generation; generated routes are independently type-checked and built. No warning suppression or peer override is configured. See [bootstrap validation](docs/reviews/BOOTSTRAP-VALIDATION.md) for executed checks and resource observations.

Start subsequent work from the [Phase 0 execution plan and evidence](docs/reviews/PHASE-0-READINESS.md). Application type checks and synthetic runtime proofs pass under the approved backend compiler exception. The separate upstream declaration diagnostic remains failing, and full Phase 0 acceptance is still pending.

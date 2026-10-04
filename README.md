# Noola

Noola’s local account and household implementation includes separate verified adult accounts, independent settings and recovery, household agreements, optional dependent/guardian setup, relationship aliases, and device locks. Account emails go to private Mailpit capture. Use synthetic identities for this checkpoint; hosted email, physical-device acceptance, and independently durable recovery remain later gates. See the [documentation guide](docs/README.md) and [Section One validation record](docs/reviews/PHASE-1-SECTION-1-VALIDATION.md).

## Start in WSL

Keep the checkout on the Linux filesystem. Enable this distro in Docker Desktop → Settings → Resources → WSL Integration, and keep Docker Desktop running. Use Node **24.21.0** and pnpm **12.8.1** (the versions pinned by `.node-version` and `packageManager`).

```sh
pnpm install --frozen-lockfile
pnpm env:init
pnpm infra:up
pnpm db:provision
pnpm db:migrate
pnpm dev
```

Open [Noola locally](http://localhost:5173). The page's connection indicator exercises the generated client, API, and PostgreSQL. Source edits hot reload in the containers. The one-time dependency service installs Linux dependencies before either application starts; Docker volumes hide host `node_modules`. After changing dependencies, run `pnpm dev:down` then `pnpm dev` so installation finishes before application processes restart. `pnpm dev:logs` follows application logs.

`pnpm dev:down` stops Noola only. Shared PostgreSQL continues running for other applications. Its `unless-stopped` restart policy resumes it when Docker starts, unless you explicitly stopped it. It cannot run while Windows or Docker Desktop is off.

<a id="synthetic-household-enrollment"></a>
## Synthetic household enrollment

Initialize the single household with an independently chosen synthetic owner email:

```sh
pnpm household:bootstrap owner@example.test
```

Open [private Mailpit capture](http://localhost:8025), follow the invitation, choose a display name and password, verify through the next captured email, and explicitly sign in at [Noola](http://localhost:5173/sign-in). The command never chooses a password or marks an email verified. Repeating initialization preserves existing accounts and reports a conflict. If the unused owner invitation expires or its send fails, explicitly replace it with `pnpm household:bootstrap owner@example.test --resend`; the old unused link becomes invalid. After enrollment, use independent verification resend or password recovery instead.

Finish the four resumable personal steps, then review household rules separately. The owner invites the second adult from **Household rules**. That adult chooses their own credentials and preferences. Shared use requires both adults’ acceptances of the exact rule revision. **Dependent profile** is optional after basic setup; owner rights and independently accepted guardian rights remain separate. AI is unavailable, push is off, and capture/sharing tutorial steps remain pending.

New sessions default to shared mode: five-minute inactivity and observed backgrounding lock them. Personal mode is an explicit choice with a fifteen-minute inactivity lock. Locking requires password sign-in. Offline locking/sign-out clears the UI immediately and stores only a content-free pending restriction; protected use waits for its server reconciliation. Guidance is available directly at [Recovery](http://localhost:5173/recovery).

Mailpit publishes only its loopback web/API port, persists capture in `mailpit-data`, and has no relay or forwarding destination. Captured verification and reset links are usable credentials; keep capture private. The durable application ledger distinguishes queued, transport-accepted, failed, and outcome-unknown sends. Transport acceptance does not prove inbox delivery. API restarts resume queued events and reconcile uncertain sends without automatically repeating them.

## Shared PostgreSQL and credentials

The independent `local-infra` Compose project runs PostgreSQL **18.6**, pinned by digest. Its external `local-postgres-data` volume and `local-databases` network are created once. PostgreSQL 18 stores data under `/var/lib/postgresql/18/docker`; the volume mounts at `/var/lib/postgresql`.

Configuration is generated once with random passwords and mode `0600`, outside the source mounts:

- `$XDG_CONFIG_HOME/local-infra/postgres.env` (default `~/.config/local-infra/postgres.env`): shared administrator password, `POSTGRES_PORT=5432`, `POSTGRES_MEMORY_LIMIT=1g`.
- `$XDG_CONFIG_HOME/noola/development.env` (default `~/.config/noola/development.env`): Noola role passwords, persistent `AUTH_SECRET`, `APP_ORIGIN=http://localhost:5173`, `WEB_PORT=5173`, `DB_POOL_SIZE=5`.

`pnpm env:init` preserves existing values and adds missing origin/auth-secret settings to older configuration files. Never commit these files or copy them into the checkout. The committed `.env.example` files document available settings; application scripts do not load a repository `.env`. Keep the auth secret stable: it protects sessions and credential-bearing email payloads. Changing the web port requires updating `APP_ORIGIN` to the browser’s exact origin. `localhost` and `127.0.0.1` are different origins.

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
| `pnpm test:identity` | Real PostgreSQL/HTTP identity, authorization, transactions, expiry, recovery and email-ledger scenarios in a disposable database |
| `pnpm test:identity:browser:docker` | Independent-adult journeys in desktop Chromium, mobile Chromium and WebKit, with axe and browser isolation checks |
| `pnpm test:identity:browser` | The same journeys using installed host browsers and local test infrastructure |
| `pnpm phase0:runtime` | Disposable synthetic identity, isolation, migration and local recovery proof; requires refreshed Docker dependencies |
| `pnpm phase0:typecheck` / `pnpm phase0:check` | Strict experiment application types / combined types and runtime proof |
| `pnpm phase0:declarations` | Full upstream declaration diagnostic; still fails, separate from required application checks |
| `pnpm db:migrate` | Apply reviewed production identity SQL with owner credentials; safe to repeat |
| `pnpm --filter @noola/api db:generate` | Generate SQL when an owned schema exists; review before applying |
| `pnpm test:e2e` | Playwright/axe with local host servers; requires complete host API configuration and browser dependencies |
| `PLAYWRIGHT_BASE_URL=http://127.0.0.1:5173 pnpm test:e2e` | Test the already-running Docker application |
| `pnpm format` | Biome formatting and supported lint fixes |
| `pnpm --filter @noola/api... build` | Build backend and its contracts without building web |
| `pnpm --filter @noola/web... build` | Build web and its shared packages independently |

The Docker identity-browser command uses the pinned official Playwright image with browser/system dependencies. It creates a disposable database per project, runs the actual application and Mailpit flows, and removes its database afterwards. Run `pnpm infra:up` and `pnpm dev` first. Host browser testing requires `pnpm exec playwright install chromium webkit` and the corresponding system libraries. Identity tests read operator configuration only to create restricted disposable fixtures; synthetic accounts never enter the `noola` application database. Existing provisioning tests also clean their generated table and second database.

This WSL host currently uses an existing user-cache library bundle for Playwright because system dependencies are missing. The [pre-slice review](docs/reviews/PHASE-0-READINESS.md#pre-slice-cleanup-review) records its explicit test command and limitations; fresh machines should use the standard installation above.

Turborepo caches deterministic builds locally. Generation, development, tests, migrations and database operations are uncached. Remote caching is disabled. Runtime secrets are not build inputs or browser configuration. The API build is plain JavaScript; development uses `tsx`. The Vite development proxy sends `/api` to the internal API without CORS or another local proxy container.

Health interfaces are `GET /api/health/live` → `200 {"status":"ok"}` and `GET /api/health/ready` → `200 {"status":"ready"}` or `503 {"status":"unavailable"}`. Responses are uncached and omit connection details. OpenAPI and client declarations are generated from browser-safe contracts, not database types.

## Structure and design

Four workspaces: `apps/web`, `apps/api`, `packages/contracts`, and `packages/api-client`. Identity operations, policies, schema and repositories live in `apps/api/src/modules/identity`; bounded email mechanics and jobs stay in the backend. Account/household features compose reviewed UI primitives and typed TanStack forms. Browser-safe contracts generate OpenAPI and client declarations. File placement and dependency boundaries are owned by the [code-structure skill](.agents/skills/noola-code-structure/SKILL.md).

The UI uses the [shadcn/create preset](https://ui.shadcn.com/create?preset=b5cRMiRzk): Base UI, Nova, stone, teal, Geist and Lucide. Generator `shadcn@4.21.1`, preset `b5cRMiRzk`, and its decoded settings are recorded in `apps/web/shadcn-preset.json`. Components and tokens remain inside the web app. Reapply intentionally with `pnpm --filter @noola/web exec shadcn apply b5cRMiRzk`; review generated changes, then format and test. The owned dark primary/focus tokens and opaque button hover styling preserve contrast validated by axe. Reapplying a preset requires preserving or revalidating that correction. Account and household screens reuse this preset and its reviewed primitives.

## Compatibility and evidence

TypeScript 5.9.3 satisfies the current OpenAPI generator's 5.x peer. The root, web and shared packages retain `skipLibCheck: false`. The owner-approved backend exception sets it to `true` only in the API configuration and its derived check/experiment projects. Strict application checks remain enabled; all declaration files in those backend compilations are skipped. `pnpm phase0:declarations` exposes the upstream errors separately. [The compiler-policy record](docs/reviews/PERSISTENCE-COMPATIBILITY.md#compiler-policy-decision) describes the tradeoff and removal trigger.

Stable Drizzle ORM/Kit and the maintained Better Auth Drizzle adapter remain selected. Better Auth and its matching adapter are production dependencies; application enrollment owns the transaction and its email enqueue. Public signup is disabled, email verification is mandatory, session cookie caching is disabled, and resets revoke affected sessions. Authentication uses the owned identity schema and the existing restricted `pg` pool; experiment source is never imported by the application.

The current TanStack CLI emits an upstream CommonJS circular-import warning during generation; generated routes are independently type-checked and built. No warning suppression or peer override is configured. See [bootstrap validation](docs/reviews/BOOTSTRAP-VALIDATION.md) for executed checks and resource observations.

Start subsequent account-dependent work from the [Section One validation and handoff](docs/reviews/PHASE-1-SECTION-1-VALIDATION.md), while preserving the [Phase 0 evidence and open gates](docs/reviews/PHASE-0-READINESS.md). The separate upstream declaration diagnostic remains failing; local Section One evidence does not complete the broader Phase 0 or deployed acceptance gates.

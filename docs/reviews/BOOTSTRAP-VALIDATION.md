# Bootstrap validation

Recorded 4 October 2026. This records only the pre-Phase-1 scaffold; product, real-phone, identity, recovery and production gates remain pending.

## Environment

Ubuntu on WSL2; Docker Desktop integration enabled during setup. Node 24.21.0, pnpm 12.8.1 and digest-pinned PostgreSQL 18.6. See the [runbook](../../README.md) for commands and the [stack](../TECH-STACK.md) for selection ownership.

## Checks

| Check | Result |
|---|---|
| Frozen installation | Passed with pinned pnpm and the repository lockfile |
| `pnpm check` | Passed: generation drift, Biome, strict application/test/tool types, import/cycle rules, unit tests, builds, documentation |
| API/client unit tests | 5 passed, including database failure, malformed responses and unexpected fields/statuses |
| Import enforcement negative probe | Rejected both backend-source and Node built-in imports from web source; probe removed |
| `pnpm test:integration` | Passed on real PostgreSQL: repeatable provisioning, unchanged password hashes/data, rejected password mismatch, restricted DDL and cross-database writes, readiness failure/success |
| `pnpm db:migrate` | Reported no pending migrations; no fake schema was introduced |
| Playwright/axe | 4 passed on desktop/mobile Chromium layouts, light/dark themes, connectivity and retry; no axe violations after dark token correction |
| Compose lifecycle | Stopping Noola left PostgreSQL running; Noola and another synthetic application's data survived PostgreSQL container recreation; Noola restarted ready |
| Hot reload | An already-open browser reflected a temporary source edit; API watcher restarted on a temporary HTTP edit; both edits restored |
| Independent backend runtime | Compiled Node output started on a separate port, reached PostgreSQL, and exited cleanly on SIGTERM |
| Credential/network scope | Web has no database URL/shared database network; API has no administrator or migration URL |
| File ownership | No root-owned application/shared source or generated files |
| Cleanup | Synthetic databases/tables removed; `noola` has zero public tables; only `noola` and the administrative `postgres` database remain |

Lifecycle and hot-reload checks used temporary local probes, removed or restored after verification. A minimal GitHub Actions workflow is added; it has not been executed on GitHub during this local session. Its database and credentials are disposable and separate from this workstation.

The WSL distro lacked Chromium's `libnspr4`, `libnss3`, and `libasound2t64` libraries, and sudo required a password. Browser checks used official Ubuntu packages extracted into a temporary user-owned directory with a process-local library path; no system configuration was changed. For normal repeatable browser testing, install Playwright's system dependencies as documented in the runbook. Mobile emulation is not actual-phone evidence.

## Resource observations

Post-start snapshots from `docker stats --no-stream` with development watchers and health checks active: PostgreSQL approximately **26–29 MiB** under its 1 GiB ceiling; API approximately **97–99 MiB**; Vite web approximately **259–269 MiB**. Combined container memory was approximately **385–397 MiB**, excluding Docker Desktop/WSL overhead and host editor/browser/check processes. These are development observations, not load/capacity guarantees. Stopping Noola leaves only shared PostgreSQL.

`docker system df` reported approximately 1.006 GB of images, 951 MB of seven local volumes (including dependency/store volumes and database data), and 239 MB of build cache after setup. The initial older PostgreSQL image pulled during version selection was removed. These categories can share underlying storage; they are not a Windows virtual-disk reclamation measurement.

## Compatibility

TypeScript 5.9.3 is pinned for OpenAPI generator compatibility. Stable Drizzle ORM 0.45.3 declarations fail strict validation with missing optional driver references and malformed declarations; the original bootstrap added no declaration suppression or unrelated drivers. The later [owner-approved compiler exception](PERSISTENCE-COMPATIBILITY.md#compiler-policy-decision) retains Drizzle while allowing backend-only declaration-check skipping. Drizzle Kit/configuration and an empty migration assembly are available; ORM runtime initialization is deferred until the first owned schema after the bounded Phase 0 proof. TanStack route generation emits an upstream CommonJS circular-import warning; strict checks and independent builds validate generated output.

# Persistence compatibility and compiler-policy decision

**Decided by Nishanth, 4 October 2026: retain Drizzle and accept the bounded backend compiler-policy exception below.** Kysely was evaluated and is not adopted. The [Phase 0 record](PHASE-0-READINESS.md) owns overall readiness; this decision does not accept the complete architecture or pass Phase 0.

<a id="compiler-policy-decision"></a>
## Approved compiler-policy decision

Keep stable Drizzle ORM/Kit, PostgreSQL/pg and the maintained Better Auth Drizzle adapter. Allow `skipLibCheck: true` in `apps/api/tsconfig.json`, inherited by its application-check and Phase 0 experiment configurations. Root, web, contracts, API client and root tooling retain `skipLibCheck: false`. `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, application-source checking and declaration generation remain enabled.

This is a deliberate tradeoff: TypeScript skips checking **all declaration files** in the affected backend compilation, including first-party `.d.ts` files and other dependency declarations, not only Drizzle. It still uses those declarations to check application code. Shared packages are independently checked with declaration checking enabled. Incorrect or unresolved upstream types can reduce accuracy at affected boundaries; explicit typed APIs, Zod validation, SQL constraints, query-type regression cases and runtime tests provide additional evidence but do not reproduce complete declaration checking.

The Better Auth factory now declares its options and return type explicitly; that repairs the local declaration-emission portability diagnostic exposed after dependency errors were bypassed. No fake module declarations, extra database drivers, Bun runtime/types, ignored peers or library replacement are introduced.

Required checks are `pnpm check` (now including Phase 0 application types) and `pnpm phase0:check` (types plus disposable database/runtime proofs). The compile-only query cases require invalid columns, invalid text values and missing required ownership fields to fail typing. CI requires the application and runtime checks. `pnpm phase0:declarations` explicitly restores `skipLibCheck: false`, returns the real failure status and remains a separately labelled, non-blocking CI diagnostic. Its failure records an accepted upstream limitation rather than a failed application adoption gate.

Review this exception whenever Drizzle, Better Auth or TypeScript is upgraded. Once the upstream diagnostic passes, remove the backend override and rerun the same application, migration, isolation and build checks. Do not extend the exception to browser/shared packages or use it to suppress source-code errors. The [Noola coding standard](../../.agents/skills/noola-code-structure/SKILL.md) carries the enforceable scope.

## Verification after the decision

Executed on 4 October 2026: frozen installation; full `pnpm check` including the experiment application types; `pnpm phase0:check` with the real Docker PostgreSQL server; standard database integration; four Playwright/axe cases; no-op product migration; fixture generation with no schema changes; documentation and skill validation. All required checks pass. Effective compiler configurations confirm strict flags throughout, backend-only declaration skipping, and declaration checking enabled in web/contracts/client/root tooling. Removing the three expected-error annotations in a temporary probe produced three real application type errors; that probe was removed.

`pnpm phase0:declarations` still exits unsuccessfully with 73 errors, all in dependency declarations. That observed failure remains visible; no upstream fix is claimed. CI configuration now requires the passing application/runtime checks and reports this diagnostic separately; a remote GitHub Actions run has not been observed.

## Earlier alternative investigation

The following comparison records the investigation before the owner chose to retain Drizzle.

### Candidate result

The selected Drizzle 0.45.3 stack passes runtime proofs but fails strict checking with 73 dependency declaration errors. The earlier 1.0.0-rc.4 comparison also failed. A broad local declaration fork would require repairing multiple unrelated dialects and published abstract/generic contracts. No narrow trustworthy repair was established.

The replacement candidate **passes strict TypeScript with `skipLibCheck: false` and the same synthetic runtime scenarios**: Kysely 0.29.6, PostgreSQL/pg 8.23.1, Better Auth 1.7.7 and its matching maintained `@better-auth/kysely-adapter` 1.7.7. Node 24.21.0, TypeScript 5.9.3 and Node types 24.10.1 remain unchanged.

Better Auth's published options reference `bun:sqlite` even when using PostgreSQL on Node. Pinning the official **type-only** `bun-types` 1.4.2 package and including only `bun-types/sqlite` alongside `node` in this experiment's tsconfig resolves that reference. It does not install or execute Bun or SQLite, define a fake module, disable checking, or add Bun globals. Loading the entire Bun type environment was tested and rejected because it conflicts with this Node environment. The minimal published declaration file itself is checked normally.

### Evaluated changes (not adopted)

| Area | Candidate |
|---|---|
| PostgreSQL, Docker lifecycles, databases, roles, pool | Retain existing setup |
| Typed query builder | Kysely replaces Drizzle; keep one application-owned pg pool |
| Identity | Retain Better Auth and opaque DB sessions; use its maintained Kysely adapter with transactions enabled |
| Migrations | Reviewed SQL, applied through Kysely's locked transactional migrator with migration credentials |
| Schema workflow | Explicit SQL migrations and corresponding typed table definitions; no Drizzle automatic schema-diff generator |
| Application exposure | Health-only bootstrap remains; identity stays an experiment until its Phase 1 requirements are implemented |
| Strict checks | Preserve all current strict settings and promote the passing experiment check to required CI |

The main tradeoff is losing Drizzle's automatic schema-diff generation. Schema/type consistency needs explicit migration review and database integration tests (or separately validated introspection tooling when domain schemas arrive). No product data migration is needed now: Noola still has zero public tables. The temporary candidate changes neither Noola nor another project's data.

### Candidate evidence

In `/tmp/noola-kysely-compat`, the candidate uses exact-pinned dependencies, a frozen lockfile and a tsconfig derived from the repository's strict base. The experiment copies the established assertions; query implementation, migration runner and identity adapter are the changes. No assertion was weakened or removed.

- Fresh and repeated Kysely migration; restricted runtime role; transactional rollback.
- Better Auth password sign-in, verified-only access, closed signup, HTTP-only sessions with cookie caching disabled.
- Bidirectional private read/list/search/export/update/delete isolation and uniform missing/unauthorized responses.
- Owner injection, malformed JSON and cross-origin mutation rejection.
- Source-linked exact substring lookup for English, Tamil, transliteration and mixed text.
- Local deletion-aware restore, unavailable/corrupt journal failure and failed journal acknowledgment.
- Database session revocation and expiry; database-backed password rate limiting; zero external fetch calls.
- Cleanup verified: zero temporary Phase 0 databases and roles.
- Frozen installation and declaration-emitting compilation pass; a negative probe confirms unknown columns fail checking and Bun globals remain unavailable.
- Candidate-only dependency audit reports zero advisories (this does not clear the existing workspace’s separate generator advisories).

The existing limitations still apply: these are Request/Response handlers against PostgreSQL, not browser/phone identity tests; synthetic email verification is seeded; no real recovery email, independent off-host journal, complete invitation workflow or production backup is claimed.

### Historical candidate artifacts

[Candidate query/identity/migration diff](PERSISTENCE-CANDIDATE.patch) compares the experimental implementation against the current Drizzle proof. It is a review artifact, not a complete adoption patch: it does not change manifests, CI, canonical stack documents or production migration tooling. Applying only this diff is insufficient.

The tested scratch directory contains `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, the SQL fixture, and executable assertions. Its commands are `pnpm install --frozen-lockfile`, `pnpm exec tsc --noEmit`, and `ADMIN_DATABASE_URL=... pnpm exec tsx run.ts` using a safely supplied local administrator URL. The administrator is used only to create/drop the random fixture database/login; HTTP paths use the restricted pool. Do not put real credentials in command history.

The candidate is retained only as historical review evidence. Do not apply its patch: the owner chose Drizzle with the compiler-policy exception above.

## Source review

The [Better Auth PostgreSQL documentation](https://better-auth.com/docs/adapters/postgresql) identifies its maintained Kysely-based PostgreSQL integration. [Kysely migrations](https://kysely.dev/docs/migrations) documents migration ordering and transaction/locking behavior. The installed adapter API supplies explicit transaction configuration. [Drizzle issue 5187](https://github.com/drizzle-team/drizzle-orm/issues/5187) documents the strict declaration failure family; local installed-package results above determine compatibility here.

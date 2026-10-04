---
name: noola-code-structure
description: "Apply Noola file placement, reuse, dependency boundaries and coding standards when scaffolding the workspace, creating or changing application source, tests, migrations or build configuration, extracting shared code, or reviewing a structural refactor. Use only in the Noola repository; ordinary documentation-only edits do not need this skill."
---

# Noola Code Structure

Keep changes small, typed and easy to locate. This skill owns code placement and coding conventions; product behavior and technology choices stay in their existing documents.

## Establish the task

Locate the Noola repository root and read its `AGENTS.md` if it is not already loaded. Search existing files and callers before deciding where new code belongs. Preserve established conventions unless the task authorizes changing them.

For setup or dependency decisions, read [TECH-STACK](../../../docs/TECH-STACK.md#selection-inventory) and relevant ADRs. For feature work, use [traceability](../../../docs/reference/TRACEABILITY.md#requirement-matrix) to find the owning module and applicable [application contracts](../../../docs/reference/APPLICATION-DESIGN.md#module-contracts). Read only the relevant sections. [ARCHITECTURE](../../../docs/ARCHITECTURE.md) owns system/authority boundaries; this skill does not grant approval to proposed mechanisms or change product scope.

Before substantial implementation, briefly state the affected behavior, planned placement/reuse, success criteria and relevant checks. An authorized setup/feature request covers routine implementation choices within its scope; pending evidence calls for validation, not automatic extra permission requests. If a proposed choice conflicts with an explicit owner selection, resolve the conflict before dependent work.

## Place code by ownership

At the first authorized scaffold, use these four units. Create only what the active task needs; these paths are conventions, not evidence that packages already exist.

| Location | Responsibility |
|---|---|
| `apps/api` | Independently built backend; production entry, HTTP assembly and backend-only dependencies |
| `apps/api/src/http` | Thin contract bindings, server-established context and response mapping |
| `apps/api/src/modules/<domain>` | Owned application operations, policy, persistence and database schema |
| `apps/api/src/adapters` | Bounded AI/email/push/storage mechanics and provider normalization |
| `apps/api/src/db` | Pool, transactions and database/migration assembly |
| `apps/api/src/jobs` | Job registration and thin handlers calling the same operations |
| `apps/api/migrations` | Reviewed backend SQL migrations |
| `apps/web/src/routes` | TanStack route files, root context and feature composition |
| `apps/web/src/features/<feature>` | Screens, editors, feature hooks and feature-specific compositions |
| `apps/web/src/components/ui` | Reviewed shadcn/Base UI primitives and shared visual variants |
| `apps/web/src/components/patterns` | Repeated field, pending/error, evidence and other UI compositions |
| `apps/web/src/lib` / `styles` | Client/auth/cache assembly and shared styling/tokens |
| `apps/web/public` | Public static assets and PWA resources |
| `packages/contracts` | Browser-safe input/output/error schemas, route metadata and generated OpenAPI |
| `packages/api-client` | Generated wire types, Fetch/response parsing and reusable query definitions |
| `tests/e2e` | Cross-application browser scenarios |

Keep `components.json` in the web app. Treat `routeTree.gen.ts`, OpenAPI and generated client declarations as derived artifacts; change their sources and regenerate them. Keep module tests beside the tested code as `*.test.ts`/`*.test.tsx`. Use descriptive kebab-case files/folders, PascalCase React components/types and camelCase functions/values; framework-required and generated names take precedence.

A small backend module may contain `operations.ts`, `policy.ts`, `repository.ts` and its schema. Add each file only for a real responsibility, and a public entry point when callers need one. Split files by cohesive responsibility, not arbitrary line counts. Avoid empty future modules, a generic `common` dumping ground, barrel exports of every internal file, and a layered folder hierarchy for every small feature. Add another workspace package only when an actual independent consumer needs it.

## Keep the dependency direction

Clients consume contracts and the API client; they cannot import backend source, database rows, credentials or provider implementations. The backend cannot import web source. Contracts cannot import either application or environment-dependent code. Keep schema and route-metadata exports separate so clients need not load the entire route registry.

HTTP bindings, approved-action coordination and jobs call the same application operations. Operations own current authorization, domain transitions, transactions, receipts, cost admission and the meaning of failure/retry. Owned repositories may access their database tables using the supplied transaction; do not prohibit necessary persistence or mutate another domain behind its interface. Domain policy does not import HTTP contexts, browser state or SDK response types. Cross-domain changes use owner interfaces and an explicit transaction boundary.

Adapters centralize operational mechanics and return typed outcomes. They cannot grant authority, choose a payer or claim a committed domain change. Preserve rejected/failed/unknown distinctions; a timeout after submission does not prove no effect occurred.

## Reuse without hiding behavior

Find an existing operation/component before adding another. Extract repeated operational mechanics when callers share their meaning; isolation or a replaceable provider boundary can justify an adapter with one caller. Keep domain-specific policy with its owner. Prefer explicit parameters and structured returns over hidden globals, generic repositories, base service classes or a universal workflow engine.

Share UI primitives, recurring compositions and typed form fields; routes compose feature components. Shared primitives take typed values/callbacks, not feature data queries or authorization logic. Keep different workflows explicit instead of accumulating dozens of mode flags. Reuse backend behavior and contracts across future clients; native controls/navigation need their own platform implementation.

Consult the current [frontend integration](../../../docs/reference/APPLICATION-DESIGN.md#frontend-integration) before UI work. Preserve TanStack Router, shadcn/Base UI, TanStack Form and nuqs. Follow actual Base UI APIs and inspect registry dependencies. Query owns remote data, Form owns editable values, nuqs owns approved URL presentation and React owns ephemeral interactions. Another state library requires a use case not already covered by those owners.

## Coding and verification

Use strict TypeScript and `unknown` at external boundaries, with runtime parsing and explicit public response projections. Infer transport shapes from contracts rather than copying interfaces into components. Keep values typed through repositories, operations, validated responses, queries and props. Avoid broad `any`, unchecked casts, ignored peers or declaration-check suppression as compatibility fixes; record and resolve an actual upstream limitation.

Prefer pinned `@biomejs/biome` and committed `biome.json` for supported source. Respect existing tooling; use narrowly scoped alternatives for unsupported languages or necessary semantic rules. Do not format the same files with multiple tools. Keep formatting/linting separate from type checking, runtime validation and SQL constraints. Select compatible versions from current evidence; do not bake patch numbers into this skill.

Discover real commands from manifests and configuration. On an authorized initial scaffold, establish ordinary pnpm scripts for generation/drift, Biome, strict types, import/cycle boundaries, relevant tests and independent API/web builds. Do not claim those commands exist beforehand. Keep the API build independent of web source and inspect client output for server imports. Preserve generated-artifact and migration discipline when moving code.

Choose checks proportional to behavior: API changes need contract/runtime and relevant authorization/transaction cases; visible UI changes need relevant browser/accessibility validation; Router/nuqs or private-state changes need navigation/history and identity/lock/late-response checks. Actual-phone evidence follows the existing acceptance gates. Add meaningful regression coverage when behavior warrants it, not tests that mirror wording or trivial file placement.

For documentation changes run `python3 scripts/check_docs.py`. Before finishing, review the diff for duplication, crossed ownership and unwanted scope; report placement/reuse decisions, checks actually run and remaining evidence. A skill supplies agent guidance; automated import/type/test checks become enforcement when implemented. Keep library/system updates in their existing docs and future code-placement/coding-rule updates here.

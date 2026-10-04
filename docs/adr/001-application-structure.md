# ADR-001: Application structure and framework

**Status:** Proposed — independent backend and TanStack Router are owner-selected directions; remaining mechanisms await review.

**Validation:** Pending; limited contract experiments are research evidence, not application acceptance.

**Provenance:** Original baseline dated 3 October 2026; revised for Nishanth's independent backend, future client reuse and end-to-end type-safety requirements, and explicit TanStack Router selection on 4 October 2026. No original D-series record was available.

## Context

One household needs coordinated record updates, server-owned authority and direct controls during AI failure. The backend must build, deploy and scale independently of the web, and supply reusable behavior to later clients with low operational complexity.

<a id="decision"></a>
## Decision

Keep a modular backend and one transactional store. Recommend a four-unit pnpm workspace: API, web, browser-safe contracts and reusable API client. Use Node LTS with Hono as the proposed HTTP boundary. Application operations own policy, transactions and receipts; thin HTTP bindings, approved AI coordination and jobs call those same operations.

Use React with TanStack Router and a Vite client-rendered SPA. Define Zod input/output/error schemas once, associate them with private HTTP routes, generate OpenAPI and TypeScript client declarations, and validate actual network responses explicitly. A future non-TypeScript client can consume the same specification. Generation does not validate actual values or establish authority.

Initially expose both builds through one browser origin on a permitted host, with `/api/v1` product operations and separate `/api/auth` machinery. Backend builds cannot import web source. Worker startup/shutdown remains bounded in the backend until separate execution is justified. Frontend selections are detailed in [ADR-013](013-accessible-ui.md).

## Alternatives

React Router Framework mode and integrated Express were the prior proposal. TanStack Start adds SSR/server functions but introduces another server framework without a measured rendering requirement. oRPC is a credible alternative with unresolved strict declaration checks in the reviewed stable version. Reviewed stable ts-rest peers conflicted with React 19/Zod 4; tRPC is viable for TypeScript clients but less direct for a language-neutral contract. The [review](../reviews/CODE-STRUCTURE-REVIEW.md) records evidence and limits. Plain pnpm scripts suffice; Nx/Turborepo, microservices and additional domain stores have no measured need.

## Consequences

Two independent builds require explicit contract generation, compatibility and cache-lifecycle checks. Reuse contracts, transport and backend operations across clients; keep database models and credentials server-only. Domain code cannot import router requests or SDK responses. CPU-heavy parsing must not block interaction. Preserve portable artifacts and compatible API evolution so an older installed PWA can survive a backend update. Separate frontend deployment alone does not prove horizontal backend scalability.

## Reconsideration trigger

Consider SSR after measured first-load/device need, worker extraction after runtime/isolation pressure, and backend replicas after durable concurrency/pool tests. Introduce another shared package when a second build needs it. Native platform selection follows the existing PWA/device decision process.

## Requirements and evidence

[Module contracts](../reference/APPLICATION-DESIGN.md#module-contracts), [dependency rules](../reference/APPLICATION-DESIGN.md#dependency-rules), FR-009, BR-012, QLT-06/QLT-15; [G09/G13/G14](../reference/DECISIONS-AND-GATES.md#evidence-gates), [contract experiment evidence](../reviews/code-structure-evidence.json).

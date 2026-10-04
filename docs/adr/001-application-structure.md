# ADR-001: Application structure and framework

**Status:** Proposed.

**Validation:** Pending; see the linked gates.

**Provenance:** Extracted from the supplied product, architecture and stack baseline dated 3 October 2026. No original D-series record was available. External observations were not revalidated during consolidation.

## Context

One household needs coordinated record updates, server-owned authority, direct controls during AI failure, and a low maintenance burden. Logical domain boundaries do not require independently deployed services.

<a id="decision"></a>
## Decision

Use a modular monolith with explicit domain ownership, one application package and one transactional store. TypeScript/Node LTS, React Router Framework mode, React and a thin Express entry implement the selected draft direction. Route loaders/actions and provider adapters invoke framework-independent application operations. SSR and hydration stay within one application; no experimental React Server Components. The process owns bounded worker startup and graceful shutdown.

## Alternatives

Next.js and SvelteKit are credible framework alternatives. The supplied research favored ordinary forms and explicit process lifetime; it recorded version-sensitive custom-server and auth-peer caveats, which must be rechecked. JavaScript or a TypeScript/Python split adds either fewer compile-time checks or an extra runtime without a present requirement. Bun/Deno offer no demonstrated product benefit. Microservices, Kubernetes and distributed domain stores add operational coordination before measured need. Workspaces, Turborepo and Nx wait for independently built units.

## Consequences

Own a small bootstrap and enforce module imports through review/checks. CPU-heavy parsing must not block interactive work. Domain code cannot import router request objects or SDK response types. One deployment and database simplify local transactions but remain shared failure and contention boundaries. Maintain portable OCI builds and ordinary scripts rather than host-specific domain logic. Framework replacement changes adapters while preserving records and authority.

## Reconsideration trigger

Reconsider client packaging if actual devices fail; split bounded execution when host limits or measured contention require it. Adopt workspaces only after separately built clients/workers create a real need. Change application style only when approved product or measured operating requirements justify it.

## Requirements and evidence

[Module contracts](../reference/APPLICATION-DESIGN.md#module-contracts), [dependency rules](../reference/APPLICATION-DESIGN.md#dependency-rules), FR-009, BR-012, QLT-06/QLT-15; [G09/G13/G14](../reference/DECISIONS-AND-GATES.md#evidence-gates).

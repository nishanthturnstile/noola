# ADR-003: Transactional persistence and file separation

**Status:** Proposed.

**Validation:** Pending. The [Phase 0 runtime experiment](../reviews/PHASE-0-READINESS.md) passes bounded synthetic cases and strict application checks under the [owner-approved backend compiler exception](../reviews/PERSISTENCE-COMPATIBILITY.md#compiler-policy-decision). Upstream declaration checking remains a separate failing diagnostic. See the linked gates for remaining evidence.

**Provenance:** Extracted from the supplied product, architecture and stack baseline dated 3 October 2026. No original D-series record was available. External observations were not revalidated during consolidation.

## Context

Rights, records, revisions, receipts and linked schedules require coordinated durable updates. Retained originals, temporary input and rebuildable search derivatives have different lifecycle obligations.

<a id="decision"></a>
## Decision

Use PostgreSQL as authoritative transactional storage, with Drizzle stable, Drizzle Kit and node-postgres. Share transaction context across linked application operations; use parameterized SQL for locks and specialized search. Commit reviewed SQL migrations, test fresh/upgrade paths and apply once per deployment. Do not use schema push in production. Keep retained-file bytes in protected host storage from Phase 3, metadata in PostgreSQL, and temporary processing outside routine recovery.

## Alternatives

SQLite is plausible for two adults and has a smaller footprint; concurrency, durable work and the retrieval/recovery path favor PostgreSQL. MySQL offers no established compensating advantage. Prisma provides mature generated-client/migration workflows; Kysely provides typed SQL with more schema/type workflow assembly. Drizzle preserves SQL access needed for this design. Separate search/vector stores, Redis and poolers are not initial requirements.

## Consequences

The database has an operating cost and recovery responsibility. Drizzle pre-1.0 updates require review; stable and RC documentation must not be mixed. Use one deliberate pool/transaction boundary rather than separate ORM and raw-driver managers. Database durability is not deletion-aware recovery. Standard PostgreSQL schemas and SQL migrations reduce data lock-in, although query code remains coupled to the selected library. Preserve capacity behavior without silently evicting deliberately retained records.

## Reconsideration trigger

Reconsider on measured cost, migration reliability, supported-version or query-maintenance failure. Any alternative must pass the same concurrency, permission, retrieval and recovery gates. Add pgvector only on the retrieval trigger.

## Requirements and evidence

[Data architecture](../reference/DATA-AND-SECURITY.md#data-architecture), [persistence integration](../reference/APPLICATION-DESIGN.md#persistence-integration), FR-004/FR-005, BR-012, QLT-15; [G05/G06/G09/G13](../reference/DECISIONS-AND-GATES.md#evidence-gates).

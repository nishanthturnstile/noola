# ADR-006: Durable execution and external handoff

**Status:** Proposed.

**Validation:** Pending; see the linked gates.

**Provenance:** Extracted from the supplied product, architecture and stack baseline dated 3 October 2026. No original D-series record was available. External observations were not revalidated during consolidation.

## Context

Cleanup and recovery need durable work from Phase 1; reminders add external handoff in Phase 2. A job’s queue state cannot establish whether a provider accepted an effect.

<a id="decision"></a>
## Decision

Use pg-boss on PostgreSQL with bounded workers and application-owned occurrence, schedule-version, attempt and receipt state. Insert work transactionally with domain/outbox changes. Start within the application deployment where reliable. Serialize cancellation against entry into possible external handoff; confirm prevention only if cancellation wins before that transition. Treat in-flight/unknown work as unreconciled, not reclaimable for blind resend. Begin with the recorded scan defaults and measure resource/timing behavior.

## Alternatives

Handwritten general claiming/retry machinery increases correctness work. Graphile Worker remains an alternative only if a pg-boss limitation is demonstrated. Redis/brokers and separate worker infrastructure are not initial prerequisites. Request-lifetime callbacks, page timers and serverless post-response work cannot replace persisted schedules. A database fencing token cannot make a provider without fencing support stop an old network submission.

## Consequences

Local exactly-once mutation and external delivery are different problems. Definite eligible failures follow product retry limits; uncertain acceptance requires reconciliation or an explicit unknown result. Keep database transactions short and avoid holding unrelated record operations open across provider calls. Version checks, receipts and cancellation ordering must survive old workers, crashes and redeploys. A stopped task’s future notifications are suppressed without rewriting historical receipts.

## Reconsideration trigger

Split a worker on host-lifetime, parser isolation, contention or timing evidence; preserve the same codebase/domain authority. Compare another queue only after measured limitations. No broker implies no promise of exactly-once external push.

## Requirements and evidence

[Execution contract](../reference/APPLICATION-DESIGN.md#durable-execution), [dispatch integration](../reference/APPLICATION-DESIGN.md#dispatch-integration), BR-012/BR-013, DAR-004/005/010; [G07](../reference/DECISIONS-AND-GATES.md#g07).

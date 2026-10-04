# ADR-005: Lifecycle controls and deletion-aware recovery

**Status:** Proposed.

**Validation:** Pending; see the linked gates.

**Provenance:** Extracted from the supplied product, architecture and stack baseline dated 3 October 2026. No original D-series record was available. External observations were not revalidated during consolidation.

## Context

Restoring older content must not restore deleted information, revoked grants or departed membership. A daily content copy cannot establish the latest restrictive state.

<a id="decision"></a>
## Decision

Keep current content-free restriction events independently durable outside the primary content restore boundary. Apply restrictions locally first, append ordered idempotent events remotely, and acknowledge completion only after durable confirmation. Ambiguous durability remains restrictive and pending. Before exposing restored content, verify journal completeness, replay current restrictions and reconcile derived data. Keep restored jobs/routines paused and reconcile saved receipts before any resumed action.

## Alternatives

A second table on the same failed disk and asynchronous OneDrive sync do not supply the required independent acknowledgment. Daily backups alone lose later restrictions. Keeping all original content in a suppression log would violate minimization. A minimal restriction journal enforces anti-resurrection without becoming another content archive.

## Consequences

The arrangement adds an independent failure boundary, acknowledgment latency, availability trade-offs and operating cost. Journal unavailability may prevent a completion claim; restore stays closed if current-state completeness cannot be established. Provenance must connect affected derivatives and jobs, while separately retained tasks and approved excerpts keep the product’s distinct choices. Visible re-extraction exclusions remain user-controlled. Exact retention and deletion periods are owned by BR-008/BR-009, not copied here.

## Reconsideration trigger

Reconsider the mechanism if lost-primary, crash-order or unavailable-journal tests fail, if independent custody cannot be established, or if costs breach the product allocation. Any replacement must preserve current restrictions across old-content restoration.

## Requirements and evidence

[Data lifecycle](../reference/DATA-AND-SECURITY.md#data-architecture), [hosting/custody](../reference/OPERATIONS.md#hosting-and-custody), DAR-006, FR-004, BR-008/BR-009, X19; [G06](../reference/DECISIONS-AND-GATES.md#g06).

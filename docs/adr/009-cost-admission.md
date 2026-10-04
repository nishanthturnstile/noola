# ADR-009: Cost admission and reconciliation

**Status:** Proposed — ISSUE-01 unresolved.

**Validation:** Pending; see the linked gates.

**Provenance:** Extracted from the supplied product, architecture and stack baseline dated 3 October 2026. No original D-series record was available. External observations were not revalidated during consolidation.

## Context

Concurrent foreground/background paid work can overspend an allocation if each operation reads the same remaining balance. Provider accounting can be delayed or incomplete, and subscription quota is not currency.

<a id="decision"></a>
## Decision

Use application-owned atomic reservations for the conservative maximum permitted paid request, including bounded response/tool/retry work, before admission. Reconcile actual usage against the reservation and retain unknown/late charges conservatively. Keep subscription quota/app allowances separate from paid monetary accounting. Development/UAT monitors actual use and owner-visible alerts; production enforces the calibrated product allocation. Manual records and ordinary saved scheduling remain independent of generation.

## Alternatives

Post-hoc billing alone cannot prevent over-admission. Unbounded retries, automatic top-ups and silent payer/route changes violate the product constraints. A fabricated API-equivalent subscription balance would misrepresent provider quota. Where an API cannot enforce the assumed bound, constrain the operation or seek an explicit policy change rather than promise an invoice ceiling.

## Consequences

The implementation needs a shared ledger, deterministic accounting periods and safe aggregate reporting. The recorded Asia/Kolkata accounting month and admission-month reconciliation are technical defaults, independently of provider invoice/reset periods. Existing personal subscriptions are displayed separately. Owner funding authority does not grant private-data rights. The product and technical text disagree about whether paid exhaustion stops all AI or just paid routes: [ISSUE-01](../reference/DECISIONS-AND-GATES.md#issue-01) blocks dependent implementation.

## Reconsideration trigger

Reconsider reservation bounds and workloads after measured provider costs, unknown-outcome behavior or allocation changes. Do not weaken manual continuity or resolve the open exhaustion policy implicitly.

## Requirements and evidence

[Operating constraints](../reference/PRODUCT-RULES.md#operating-constraints), [cost accounting](../reference/OPERATIONS.md#cost-accounting), DAR-007, QLT-11; [G09](../reference/DECISIONS-AND-GATES.md#g09).

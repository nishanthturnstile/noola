# ADR-009: Cost admission and reconciliation

**Status:** Proposed — owner budget-exhaustion policy decided; implementation mechanism awaits architecture review.

**Validation:** Pending; see the linked gates.

**Provenance:** Extracted from the supplied product, architecture and stack baseline dated 3 October 2026; aligned with Nishanth's explicit ISSUE-01 resolution on 4 October 2026. No original D-series record was available. External observations were not revalidated during consolidation.

## Context

Concurrent foreground/background paid work can overspend an allocation if each operation reads the same remaining balance. Provider accounting can be delayed or incomplete, and subscription quota is not currency.

<a id="decision"></a>
## Decision

Use application-owned atomic reservations for the conservative maximum permitted paid request, including bounded response/tool/retry work, before admission. Reconcile actual usage against the reservation and retain unknown/late charges conservatively. Keep subscription quota/app allowances separate from paid monetary accounting. When the paid variable AI allocation is exhausted, enforce the household pause across all optional AI features, including interactive and background subscription work; no fallback route bypasses it. New AI work resumes only with an available next-month allocation or owner-approved increase and current consent/eligibility checks. Development/UAT monitors actual use and owner-visible alerts; production enforces the calibrated product allocation. Manual records, privacy controls, direct agenda briefs and ordinary saved scheduling remain independent of generation.

## Alternatives

Post-hoc billing alone cannot prevent over-admission. Unbounded retries, automatic top-ups and silent payer/route changes violate the product constraints. A fabricated API-equivalent subscription balance would misrepresent provider quota. Where an API cannot enforce the assumed bound, constrain the operation or seek an explicit policy change rather than promise an invoice ceiling.

## Consequences

The implementation needs a shared ledger, deterministic accounting periods, a shared AI-pause state and safe aggregate reporting. The recorded Asia/Kolkata accounting month and admission-month reconciliation are technical defaults, independently of provider invoice/reset periods. Existing personal subscriptions are displayed separately but still obey the household pause. Owner funding authority does not grant private-data rights. [ISSUE-01](../reference/DECISIONS-AND-GATES.md#issue-01) records the resolved product policy; its implementation and cost evidence remain pending. A future local model requires separate selection and validation rather than automatic fallback.

## Reconsideration trigger

Reconsider reservation bounds and workloads after measured provider costs, unknown-outcome behavior or allocation changes. Preserve manual continuity and the owner-approved exhaustion policy; changing the pause behavior or adding a local-model alternative requires an explicit product decision and relevant validation.

## Requirements and evidence

[Operating constraints](../reference/PRODUCT-RULES.md#operating-constraints), [cost accounting](../reference/OPERATIONS.md#cost-accounting), DAR-007, QLT-11; [G09](../reference/DECISIONS-AND-GATES.md#g09).

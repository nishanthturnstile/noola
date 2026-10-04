# ADR-007: AI access, context and checked delivery

**Status:** Proposed — owner funding direction retained.

**Validation:** Pending; see the linked gates.

**Provenance:** Extracted from the supplied product, architecture and stack baseline dated 3 October 2026. No original D-series record was available. External observations were not revalidated during consolidation.

## Context

The owner selected eligible personal ChatGPT subscriptions first and explicit paid fallback. Model availability, hosting eligibility, processing permission and authority to change household records are separate concerns.

<a id="decision"></a>
## Decision

Keep purpose-specific application adapters: a narrow OAuth/Responses subscription adapter and AI SDK Core for supported paid gateway/provider routes, initially Vercel AI Gateway. Discover account models, enforce capabilities and keep credentials/routes separate. The application owns saved memory, rights, approvals, receipts and source lifecycle. Assemble only currently authorized context. Treat generated actions as proposals and buffer/check generated output before household delivery, even when the upstream protocol streams.

## Alternatives

The earlier direct-API-only recommendation was revised by the owner. A general agent framework, autonomous action loop, hosted memory service or provider conversation store would add competing authority without a current need. A universal provider interface must not erase differences in modalities, terms, quota or fallback. A different model or direct purpose adapter remains possible behind the existing boundary when explicitly authorized.

## Consequences

Subscription eligibility and unsupported endpoints must be checked before use; a plan is not entitlement to every API or hosted deployment. Never send OAuth tokens through the gateway or charge another adult on failure. Shared routines name a consenting funding principal. Paid fallback needs an applicable choice/rule and approved funding, and cannot bypass the household AI pause at paid-budget exhaustion. Provider changes require renewed capability, language, citation and action evaluations, plus applicable environment processing checks. Nishanth resolved [ISSUE-01 and ISSUE-02](../reference/DECISIONS-AND-GATES.md#open-policy-questions) on 4 October 2026: all optional AI routes pause at paid exhaustion, and nonproduction may evaluate any available model/processor in any affordable available region without production residency, no-training qualification or thirty-day processor-retention eligibility gates. Actual access/terms, permissions, funding approval and informed consent for real data remain binding; production privacy qualification is separate.

## Reconsideration trigger

Reconsider an adapter/model when eligibility, quality, latency, privacy or cost gates fail. Preserve manual records and deterministic briefs when no permitted route exists. Add orchestration machinery only for demonstrated capabilities that existing operations cannot safely express.

## Requirements and evidence

[Provider contracts](../reference/APPLICATION-DESIGN.md#provider-contracts), BR-006/BR-007/BR-010, DAR-002/003, QLT-02/04; [G02/G03/G05](../reference/DECISIONS-AND-GATES.md#evidence-gates).

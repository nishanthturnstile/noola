# ADR-007: AI access, context and checked delivery

**Status:** Accepted for the bounded Codex SDK spike and provider order, 4 October 2026; production adapter adoption remains pending evidence.

**Validation:** Pending; see the linked gates.

**Provenance:** Extracted from the supplied product, architecture and stack baseline dated 3 October 2026. No original D-series record was available. External observations were not revalidated during consolidation.

**4 October owner decision:** Test Codex SDK using native per-adult ChatGPT login first, retain Vercel AI Gateway as the paid fallback candidate and OpenCode Zen as an alternative direct gateway. Keep Noola private. The [research and spike plan](../reviews/PHASE-0-FEASIBILITY.md#codex-sdk-spike) replaces the earlier private-client registration prerequisite; the newer Sign in with ChatGPT flow is deferred. That decision itself claimed no live account proof, paid activation or production approval; subsequent local evidence is recorded below.

## Context

The owner selected eligible personal ChatGPT subscriptions first and explicit paid fallback. Model availability, hosting eligibility, processing permission and authority to change household records are separate concerns.

<a id="decision"></a>
**Execution evidence, 4 October:** the [isolated spike](../reviews/CODEX-SDK-SPIKE.md) passes 44 offline tests, local containment and single-account native text recall/cleanup. The ten-invocation run exposed and fixed TLS trust and clock-deadline issues; production adoption, second-account and hosted qualification remain pending. Retain the harness separately for reproduction and preserve results if it is later removed.

## Decision

Keep purpose-specific application adapters: an isolated Codex SDK subscription experiment and AI SDK Core for supported paid gateway/provider routes, initially Vercel AI Gateway. Discover account models, enforce capabilities and keep credentials/routes separate. The application owns saved memory, rights, approvals, receipts and source lifecycle. Assemble only currently authorized context. Treat generated actions as proposals and buffer/check generated output before household delivery, even when the upstream protocol streams.

## Alternatives

The earlier direct-API-only recommendation was revised by the owner. The newer OAuth/Responses plan-sharing adapter is deferred while the native Codex SDK route is tested. The SDK embeds an agent runtime, creating credential, tool and retained-history obligations; this does not authorize autonomous household actions or competing canonical memory. A universal provider interface must not erase differences in modalities, terms, quota or fallback. Zen can replace Vercel as a direct paid gateway if justified; do not integrate both without a need.

## Consequences

Subscription eligibility and unsupported endpoints must be checked before use; a plan is not entitlement to every API or hosted deployment. Never send OAuth tokens through the gateway or charge another adult on failure. Shared routines name a consenting funding principal. Paid fallback needs an applicable choice/rule and approved funding, and cannot bypass the household AI pause at paid-budget exhaustion. Provider changes require renewed capability, language, citation and action evaluations, plus applicable environment processing checks. Nishanth resolved [ISSUE-01 and ISSUE-02](../reference/DECISIONS-AND-GATES.md#open-policy-questions) on 4 October 2026: all optional AI routes pause at paid exhaustion, and nonproduction may evaluate any available model/processor in any affordable available region without production residency, no-training qualification or thirty-day processor-retention eligibility gates. Actual access/terms, permissions, funding approval and informed consent for real data remain binding; production privacy qualification is separate.

## Reconsideration trigger

Reconsider an adapter/model when eligibility, quality, latency, privacy or cost gates fail. Preserve manual records and deterministic briefs when no permitted route exists. Add orchestration machinery only for demonstrated capabilities that existing operations cannot safely express.

## Requirements and evidence

[Provider contracts](../reference/APPLICATION-DESIGN.md#provider-contracts), BR-006/BR-007/BR-010, DAR-002/003, QLT-02/04; [G02/G03/G05](../reference/DECISIONS-AND-GATES.md#evidence-gates).

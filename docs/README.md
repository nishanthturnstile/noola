# Documentation guide

Start here. The product baseline and roadmap sequence are established; the complete architecture is still Draft and implementation evidence is pending. The workspace now contains the authorized pre-Phase-1 bootstrap, four application/shared packages and local Docker configuration. The [local runbook](../README.md) and [bootstrap validation](reviews/BOOTSTRAP-VALIDATION.md) distinguish executed scaffold checks from pending product gates. The [Phase 0 execution record](reviews/PHASE-0-READINESS.md) is the current work plan and proof/gap summary. Consolidated 3 October 2026; product policy amendments recorded on 4 October 2026.

## Reading order

1. [Product plan](PRODUCT-PLAN.md): users, problem, release scope and success.
2. [Roadmap](ROADMAP.md): accepted delivery order and milestone gates.
3. [Architecture](ARCHITECTURE.md): system boundaries, module ownership and invariants.
4. [Technology stack](TECH-STACK.md): the single selection inventory and introduction triggers.

The [Phase 1 accounts and household implementation plan](plans/PHASE-1-SECTION-1.md) details prerequisites, ordered milestones, interfaces and acceptance for separate accounts and household setup. Its local-first, English-first implementation is recorded in the [Section One validation and handoff](reviews/PHASE-1-SECTION-1-VALIDATION.md), with delivered portions distinguished from later deployed and feature gates.

Before implementing a feature, find its ID in [requirements](reference/REQUIREMENTS.md#capability-catalog), then use [traceability](reference/TRACEABILITY.md#requirement-matrix) to locate its phase, responsible modules and validation family. Read its applicable rules, acceptance cases, technical contracts, ADRs and outstanding gates. A summary does not replace a referenced requirement or exception.

[Code structure and architecture review](reviews/CODE-STRUCTURE-REVIEW.md) supplies research on backend separation, typed contracts and future reuse. The [TanStack and UI review](reviews/TANSTACK-AND-UI-REVIEW.md) covers library fit. Canonical architecture/stack references reflect the owner-selected directions from 4 October; remaining mechanisms and runtime evidence await review. The created [noola-code-structure skill](../.agents/skills/noola-code-structure/SKILL.md) owns file placement, reuse and coding standards, and [root agent instructions](../AGENTS.md) require it before source/setup changes.

## Document ownership

| Question | Canonical reference |
|---|---|
| What must the product do? | [Requirements and FR contracts](reference/REQUIREMENTS.md) |
| What rights, lifecycle, limits and failures apply? | [Product rules and glossary](reference/PRODUCT-RULES.md) |
| How do we prove behavior and household value? | [Journeys, quality targets and acceptance](reference/ACCEPTANCE.md) |
| Where does each requirement belong? | [Traceability and migration map](reference/TRACEABILITY.md) |
| How do modules, actions, AI, jobs and integrations work? | [Application design](reference/APPLICATION-DESIGN.md) |
| How are authority, privacy, data and recovery enforced? | [Data and security](reference/DATA-AND-SECURITY.md) |
| How will deployment and operation work? | [Planned operations](reference/OPERATIONS.md) |
| What external research needs revalidation? | [Technology evidence](reference/TECHNOLOGY-EVIDENCE.md) |
| Which decisions or proofs are outstanding? | [Decision and gate register](reference/DECISIONS-AND-GATES.md) |
| Why was a significant technical choice made? | [ADR index](adr/README.md#decision-index) |
| Where does code belong, and which coding conventions apply? | [Noola code-structure skill](../.agents/skills/noola-code-structure/SKILL.md) |

Product requirements and rules own behavior. Roadmap owns order. Architecture owns system boundaries; stack owns named selections. The code-structure skill owns file placement and coding conventions. ADRs own rationale. Acceptance owns measurable criteria; the gate register owns evidence status. Technical documents and skills cannot silently weaken a product contract or introduce scope. Phase summaries and cross-reference tables are navigation, not alternative definitions.

## Status and authority

**Confirmed** means a requirement or product decision is established, not implemented. **Proposed** means a recommendation awaiting acceptance. **Accepted** in an ADR refers only to explicitly supported approval of its stated scope. **Needs Decision** marks a genuinely unresolved choice. **Deferred/Future** means outside enabled scope, with Expansion or Conditional classification preserved. **Superseded** decisions link their replacement.

Validation is independent: **Pending**, **Passed**, **Failed** or **Not enabled**, with an evidence link for observed results. A technology selection, document review or checkmark cannot substitute for runtime/device/household proof. Nishanth approves architecture and spending within the product rules; each adult separately supplies their own consent and settings.

[ISSUE-01 and ISSUE-02](reference/DECISIONS-AND-GATES.md#open-policy-questions) were resolved by Nishanth on 4 October 2026. Paid-budget exhaustion temporarily pauses all optional AI features, including subscription and background routes; manual controls continue. Development/testing/staging/UAT may evaluate any available model/processor in any affordable available region without production residency, no-training qualification or thirty-day processor-retention eligibility gates. Access/terms, permissions, funding approval and informed consent for real data still apply. Production qualification and implementation evidence remain pending. The unavailable D01–D29 decision history is recorded as [missing provenance](reference/DECISIONS-AND-GATES.md#missing-history), not reconstructed.

The [4 October browser-validation timing amendment](reference/ACCEPTANCE.md#browser-validation-timing) accepts Chromium/Safari compatibility evidence for local development and moves physical-device checks to deployed acceptance. It changes timing, not observed test results.

The [household and service feasibility proposal](reviews/PHASE-0-FEASIBILITY.md) adds candidate scenarios for Nishan and Manjula, current subscription/gateway research, the ₹3,000 cost worksheet and recovery responsibilities. Source code remains private by owner decision. The [Codex SDK spike](reviews/CODEX-SDK-SPIKE.md) now demonstrates one fresh native account, local containment, synthetic recall and cleanup; second-account/hosted access, payment evidence and independent recovery costs remain pending before claiming full Phase 0 completion.

## Maintaining the documents

Edit the authoritative definition first, then update affected links, mappings, ADR status and acceptance/gates. Keep the four cores near 1,000–2,000 words each. Extract unique detailed contracts into the existing topic references; remove copied policy tables, parallel decision registers and repeated inventories. Prefer a short linked summary over another definition.

Keep catalog, FR, BR, QLT, F, T, X, V and DAR identifiers stable. Use named anchors, not section numbers that change during edits. Preserve every numerical constraint, exception and current/future classification unless an explicitly approved product amendment changes it. A new ADR is appropriate for an architectural choice with meaningful consequences; product-policy decisions remain with product rules. Do not create placeholder documents for every future capability.

Implementation specifications and executable operating runbooks are prepared when their phase needs them. Existing operating text is a planned contract until exercised. External research snapshots require adoption-time revalidation, and recovered historical decisions require reconciliation with the current authority before import.

Run `python3 scripts/check_docs.py` from the repository root after documentation edits. It checks local links/anchors, table structure, inventories, classification, traceability, core size, decision records, policy/scenario fingerprints and stale references. An intentionally approved requirement change must update the affected definitions, mappings, acceptance criteria and baseline fingerprints together; do not update a hash merely to hide an unexplained failure. The migration baseline is preserved outside this tree in `../noola-docs-baseline-2026-10-03/` with checksums; [the disposition map](reference/TRACEABILITY.md#migration-map) accounts for every original numbered section. Runtime lint, type-check, tests and production builds become applicable when an application exists.

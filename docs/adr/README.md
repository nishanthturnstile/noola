# Architecture decision records

These records explain supported technical choices extracted on 3 October 2026. They do not reconstruct unavailable meeting history or establish implementation evidence. The complete architecture remains Draft pending Nishanth’s review.

**Status and evidence are separate.** Proposed means a technical recommendation awaits architecture approval. Accepted means the sources explicitly record an owner decision for the stated scope. Superseded records must link their replacement and remain available. Every initial record has pending validation. Product-policy decisions remain in [product rules](../reference/PRODUCT-RULES.md) and the [legacy alias index](../reference/DECISIONS-AND-GATES.md#legacy-decision-index).

<a id="decision-index"></a>
## Decision index

| ID | Topic | Decision status | Validation |
|---|---|---|---|
| [ADR-001](001-application-structure.md) | Independent backend, contracts and TanStack Router | Proposed — owner separation/router directions retained | Pending |
| [ADR-002](002-client-delivery.md) | PWA packaging and device delivery | Accepted — evaluation direction only | Pending |
| [ADR-003](003-persistence.md) | Transactional persistence and file separation | Proposed | Pending |
| [ADR-004](004-identity-and-authority.md) | Identity, record authorization and approval | Proposed | Pending |
| [ADR-005](005-lifecycle-recovery.md) | Lifecycle controls and deletion-aware recovery | Proposed | Pending |
| [ADR-006](006-durable-execution.md) | Durable execution and external handoff | Proposed | Pending |
| [ADR-007](007-ai-boundaries.md) | AI access, context and checked delivery | Accepted — bounded Codex SDK spike and provider order; production adoption pending | Pending |
| [ADR-008](008-retrieval.md) | Retrieval and evaluated evolution | Proposed | Pending |
| [ADR-009](009-cost-admission.md) | Cost admission and reconciliation | Proposed — owner budget-exhaustion policy decided | Pending |
| [ADR-010](010-hosting-and-custody.md) | Hosting, storage and recovery custody | Proposed — owner shortlist retained | Pending |
| [ADR-013](013-accessible-ui.md) | shadcn/Base UI, TanStack Form and nuqs | Accepted — owner-selected frontend libraries | Pending |

ADR-011 (selected external connection authority) and ADR-012 (selected new access/device mode) retain their reserved identifiers. Their capabilities are deferred; no empty decision files are created.

## Template

Use: title/ID; decision status and independent validation status; supported provenance; context; decision; meaningful alternatives; consequences; reconsideration trigger; linked requirements and evidence gates. Keep current behavior in its owning specification. Link to it rather than copying rules, retention tables or implementation procedures.

An accepted ADR changes through an explicitly reviewed replacement. Editing prose or moving a decision never grants approval. Small package choices need an inventory entry and evidence; create an ADR only when rationale and architectural consequences warrant one.

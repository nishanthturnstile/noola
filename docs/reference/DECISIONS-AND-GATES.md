# Decisions and evidence gates

Single index of supported decision status, policy clarifications and required evidence. The rule or ADR linked here owns the decision body. Bootstrap and bounded synthetic implementation evidence now exist; full household/product gates remain pending.

[Documentation index](../README.md). Consolidated 3 October 2026; ISSUE-01 and ISSUE-02 resolved by Nishanth on 4 October 2026. Full implementation and acceptance remain pending.

## Status conventions

Decision status is **Decided**, **Proposed**, **Accepted** or **Deferred**, according to the scope and authority documented in the supplied sources. Validation is a separate **Pending**, **Passed**, **Failed** or **Not enabled** result with an evidence link. Full architecture approval remains pending Nishanth’s review. Selecting an approach never marks its device, provider, cost or recovery evidence Passed.

<a id="open-policy-questions"></a>
## Policy clarifications

These interpretations were discovered during consolidation and explicitly resolved by Nishanth on 4 October 2026. No policy clarification remains open in this register. The stable issue identifiers and anchor are retained for existing references; technical and household evidence is still pending.

<a id="issue-01"></a>
### ISSUE-01 — AI budget exhaustion and subscription work

**Decision: Resolved — Nishanth, 4 October 2026.** Exhausting the paid variable AI allocation temporarily disables all optional AI features, including subscription routes and background generated routines. Separate subscription accounting does not exempt a route from this household pause. Manual records, privacy controls, ordinary saved reminders and direct agenda briefs continue. The next accounting month or an explicitly approved allocation increase permits resumption subject to current consent and eligibility. A possible future local model requires separate selection and validation; no automatic fallback is enabled. The [product budget policy](PRODUCT-RULES.md#operating-constraints) owns the complete behavior.

**Validation: Pending — [G09](#g09), [X20](ACCEPTANCE.md#x20).** Prove that interactive, background and subscription routes respect the pause and manual functions continue.

<a id="issue-02"></a>
### ISSUE-02 — Nonproduction no-training qualification

**Decision: Resolved — Nishanth, 4 October 2026.** Development, testing, staging and UAT may evaluate any available LLM model or processor in any affordable available region without production residency, no-training qualification or thirty-day processor-retention eligibility gates. Synthetic data remains the default. Provider access/terms, record permissions, manual-only controls, funding approval and each affected adult's informed consent for real data remain binding. Production still requires its separate location, processor-purpose, no-training, retention, operator-access and legal-applicability review. [BR-007](PRODUCT-RULES.md#br-007) owns the complete exception.

**Validation: Pending — [G02](#g02), [G03](#g03).** Verify actual nonproduction access and consent, and separately qualify production processors; a UAT result does not pass production privacy review.

<a id="evidence-gates"></a>
## Evidence gates

All complete gates below remain Pending. The [Phase 0 execution record](../reviews/PHASE-0-READINESS.md) records partial G01 inventory, G04 identity isolation/session evidence, G05 synthetic lexical source evidence, G06 local deletion-aware restore evidence, and G09 manual-path evidence. The Drizzle application-compatibility sub-check now passes under the [owner-approved backend compiler exception](../reviews/PERSISTENCE-COMPATIBILITY.md#compiler-policy-decision); upstream declaration checking still fails and remains an explicit diagnostic. G13 remains Pending for its remaining dependency/integration evidence. The [bootstrap record](../reviews/BOOTSTRAP-VALIDATION.md) supplies independent build/local infrastructure evidence. No partial result passes its whole gate. The [4 October browser timing amendment](ACCEPTANCE.md#browser-validation-timing) closes the Phase 0 browser-feasibility planning item using Chromium/Safari compatibility evidence. Physical-device G01/G07/G08 checks are deferred to deployed acceptance and do not block local implementation; their unperformed runtime results remain Pending.

The [4 October household/provider proposal](../reviews/PHASE-0-FEASIBILITY.md) adds candidate scenarios, official access research and a calculated cost envelope. The owner reconfirmed ₹3,000/month and private source code. G02 still needs native Codex account access, containment and history-lifecycle evidence; G09 needs actual workload, invoices and independently durable hosting costs. Proposed scenarios do not substitute for either adult's independent acceptance. Public research completion is not a passed account, recovery or production gate.

The named owner is accountable for collecting or reviewing proof, not a claim that an operator or tester has already been appointed. Passing records must include date, configuration, method, observed result and a safe artifact link.

| Gate | Required proof | Owner | Needed by | Definition / decision |
|---|---|---|---|---|
| <a id="g01"></a>G01 | Actual iPhone, Android and desktop inventory; supported installation, sessions, accessibility and capture behavior | Builder; each adult validates their own device | Phase 0 compatibility review; deployed acceptance for each introduced workflow | [Contract](../adr/002-client-delivery.md) |
| <a id="g02"></a>G02 | App/deployment/account/scopes, model and modality eligibility; scheduled subscription use; explicit fallback and quota outcomes | Builder; connecting adult consents | Phase 0 access; before enabling any route | [Contract](APPLICATION-DESIGN.md#provider-contracts) |
| <a id="g03"></a>G03 | Production location, legal applicability, actual processors and purposes, no-training/retention configuration, and operator disclosure | Nishanth; affected adults provide consent | Before production reliance; extend for every processor | [Contract](PRODUCT-RULES.md#br-007) |
| <a id="g04"></a>G04 | Independent verified account recovery, device revocation, locking, invitation boundary, email configuration and actual delivery | Builder; both adults independently exercise controls | Phase 1 real use; production email before reliance | [Contract](DATA-AND-SECURITY.md#authentication-integration) |
| <a id="g05"></a>G05 | No forbidden disclosures, valid evidence and stated recall accuracy at representative load; separate language cases and justified semantic progression | Builder; reviewers assess fixtures | Phase 1 enabled recall; full load by Phase 5 | [Contract](ACCEPTANCE.md#quality-and-evaluation) |
| <a id="g06"></a>G06 | Cleanup/expiry and derivative exclusion; lost-primary, unavailable-journal, ordered-acknowledgment and crash recovery; independent keys/operator; no resurrection | Builder; named alternate operator still to be appointed | Before retained real use; extend with each record type | [Contract](OPERATIONS.md#hosting-and-custody) |
| <a id="g07"></a>G07 | Cancellation/handoff races, stale workers, restart/redeploy and unknown outcomes; seven-day actual-phone notification timing | Builder; adults test their phones | Phase 0 compatibility review; deployed notification acceptance before reliance | [Contract](APPLICATION-DESIGN.md#dispatch-integration) |
| <a id="g08"></a>G08 | Actual phone recordings, language/transcription quality, supported files, HEIC/Linux artifact, isolated parser limits and no unauthorized transport | Builder; both adults supply independent acceptance | Phase 3 | [Contract](APPLICATION-DESIGN.md#capture-and-parsing) |
| <a id="g09"></a>G09 | Measured workload, baseline and paid-variable costs, subscription quota separation, all-route AI pause and manual continuity at paid exhaustion, both durability boundaries and maintenance burden | Nishanth | Phase 0 feasibility; production admission; observed Phase 6 | [Contract](OPERATIONS.md#cost-accounting) |
| <a id="g10"></a>G10 | Every applicable catalog/FR/BR/QLT scenario passes; all direct controls and incident paths work; no blocking incident | Builder; both adults for independent usability | Phase 5 acceptance | [Contract](ACCEPTANCE.md#phase-5) |
| <a id="g11"></a>G11 | Four-week independent household pilot, each adult’s recurring value and voluntary use, actual cost/maintenance; focused re-observation after revision | Each adult independently; Nishanth coordinates | Phase 6 before expansion | [Contract](ACCEPTANCE.md#household-pilot-and-evaluation) |
| <a id="g12"></a>G12 | Chosen future capability’s need, contract, rights, failure/disconnect behavior and acceptance; read before writes | Nishanth; affected adults consent | Only when selecting Phases 7–10 | [Contract](../ROADMAP.md#future-branches) |
| <a id="g13"></a>G13 | Upstream versions/peers/licensing/security, exact artifacts, independent builds and selected Router/nuqs/Form/Base UI integration; no research snapshot treated as a lockfile | Builder | Before scaffold/adoption and relevant upgrades | [Contract](TECHNOLOGY-EVIDENCE.md#compatibility-snapshot); [frontend checks](../reviews/TANSTACK-AND-UI-REVIEW.md#version-observations-and-validation-sequence) |
| <a id="g14"></a>G14 | Complete architecture reviewed with explicit acceptance scope; unresolved issues retained | Nishanth | Before claiming architecture approval | [Contract](../ARCHITECTURE.md#status-and-authority) |

Privacy disclosure, unapproved actions, false commitment success, irreversible information loss, failure to forget and unstoppable notifications block the affected capability under [incident policy](PRODUCT-RULES.md#risks-and-incidents). Aggregate scores cannot override that rule.

<a id="legacy-decision-index"></a>
## Legacy decision index

Aliases identify the same supported decision or evidence concern. They are not independent copies to maintain. Q/RD/AD product-policy rows link to current rules, not technical ADRs.

| Retained aliases | Decision status | Authority / rationale | Pending evidence |
|---|---|---|---|
| <a id="q-01"></a>Q-01 <a id="ad-001"></a>AD-001 <a id="rd-001"></a>RD-001 | Decided | [Dependent ownership and sensitive export](PRODUCT-RULES.md#br-002) | G04, G10 |
| <a id="q-02"></a>Q-02 <a id="ad-002"></a>AD-002 <a id="rd-002"></a>RD-002 | Decided | [Retention and temporary-session boundaries](PRODUCT-RULES.md#br-008) | G06 |
| <a id="q-03"></a>Q-03 <a id="ad-003"></a>AD-003 <a id="rd-003"></a>RD-003 | Decided | [Spending authority and all-route AI pause at paid exhaustion](PRODUCT-RULES.md#operating-constraints) | G09 |
| <a id="q-04"></a>Q-04 <a id="ad-004"></a>AD-004 <a id="rd-004"></a>RD-004 | Decided | [Source-linked saved copies follow snapshot retraction](PRODUCT-RULES.md#br-003) | G06, G10 |
| <a id="q-05"></a>Q-05 <a id="ad-005"></a>AD-005 <a id="rd-005"></a>RD-005 | Decided; future modules deferred | [General Release 1 versus specialist scope](../PRODUCT-PLAN.md#release-scope) | G10, G12 |
| <a id="q-06"></a>Q-06 <a id="ad-006"></a>AD-006 <a id="rd-006"></a>RD-006 | Decided | [Owner succession and household retirement](PRODUCT-RULES.md#br-005) | G04, G06 |
| <a id="q-07"></a>Q-07 <a id="ad-007"></a>AD-007 <a id="rd-007"></a>RD-007 <a id="td-001"></a>TD-001 | Nonproduction exemption decided; production review pending | [Environment policy and geography](PRODUCT-RULES.md#br-007) | G02, G03 |
| <a id="q-08"></a>Q-08 <a id="ad-008"></a>AD-008 <a id="rd-008"></a>RD-008 <a id="td-002"></a>TD-002 | SDK spike and provider order accepted; production mechanism pending | [Subscription-first AI and explicit fallback](../adr/007-ai-boundaries.md) | G02, G03 |
| <a id="q-09"></a>Q-09 <a id="ad-009"></a>AD-009 <a id="rd-009"></a>RD-009 | Validation pending | [Device, quality and independent household value](ACCEPTANCE.md#quality-and-evaluation) | G01, G05, G10, G11 |
| <a id="ad-010"></a>AD-010 <a id="td-008"></a>TD-008 | Selected recommendation; proposed architecture | [Authentication and independent recovery](../adr/004-identity-and-authority.md) | G04 |
| <a id="ad-011"></a>AD-011 | Accepted evaluation direction | [PWA-first packaging](../adr/002-client-delivery.md) | G01 |
| <a id="ad-012"></a>AD-012 <a id="td-003"></a>TD-003 | Owner shortlist decided; arrangement proposed | [Hosting and operator access](../adr/010-hosting-and-custody.md) | G03, G06, G09 |
| <a id="ad-013"></a>AD-013 | Monitoring and exhaustion policy decided; production feasibility pending | [Workload and operating costs](OPERATIONS.md#cost-accounting) | G09 |
| <a id="ad-014"></a>AD-014 <a id="td-004"></a>TD-004 | Selected recommendation; proposed architecture | [Independent current restriction journal](../adr/005-lifecycle-recovery.md) | G06 |
| <a id="ad-015"></a>AD-015 <a id="td-007"></a>TD-007 | Selected recommendation; proposed architecture | [Durable dispatch and cancellation ordering](../adr/006-durable-execution.md) | G07 |
| <a id="ad-016"></a>AD-016 <a id="td-005"></a>TD-005 | Selected progression; proposed architecture | [Lexical then evaluated semantic retrieval](../adr/008-retrieval.md) | G05 |
| <a id="ad-017"></a>AD-017 <a id="rd-010"></a>RD-010 | Deferred | [Future branch selection](../ROADMAP.md#future-branches) | G12 |
| <a id="rd-011"></a>RD-011 | Deferred; contract incomplete | [Future connections, synchronization and triggers](REQUIREMENTS.md#integration-scope) | G12 |
| <a id="td-006"></a>TD-006 | Selected recommendation; proposed architecture | [Actual-phone capture and parsing](APPLICATION-DESIGN.md#capture-and-parsing) | G01, G08 |

<a id="missing-history"></a>
## Missing history

The supplied four documents refer to a missing `PLANNING-DECISIONS.md` and D01–D29. D13–D21 and D21 are specifically cited for device/implementation and acceptance detail, but their original bodies and research records are unavailable. The five broken links have been replaced with supported contracts or this provenance notice. No original D-series status, rationale, source inspection or approval has been invented. If recovered, reconcile it against the current rules before importing additional content.

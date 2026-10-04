# Roadmap

**Sequence accepted; implementation and evidence pending.** Consolidated 3 October 2026. Nishanth accepted the delivery order without calendar dates or development-duration commitments. [Documentation index](README.md).

The [product plan](PRODUCT-PLAN.md) owns scope and the [requirements/rules](reference/REQUIREMENTS.md) own behavior. This roadmap owns sequence, dependencies and completion boundaries. Phase numbers are not estimates. A gate passes only with recorded evidence, not because its requirement is described here.

## Delivery sequence

| Milestone | Meaning |
|---|---|
| Phase 0 | Feasibility and current trust-boundary evidence |
| Phase 1 | First usable private capture, recall and shared-list increment |
| Phase 2 | Accepted requests and reminders; completes source checkpoint A |
| Phase 3 | Voice, documents and current evidence; checkpoint B |
| Phases 4–5 | Plans, recurrence, handovers and briefs; checkpoint C and full functional Release 1 |
| Phase 6 | Required household outcome validation; checkpoint D |
| Selected Phases 7–8 | Optional knowledge/specialist expansion; checkpoint E |
| Selected Phases 9–10 | Optional connections/new modes; checkpoint F |

Phases 0–6 are the accepted core sequence. Phase 1 is useful but does not redefine the complete Release 1. All mandatory catalog requirements, cross-cutting rules and applicable quality gates complete by Phase 5; Phase 6 establishes whether the MVP succeeds for both adults. The full [requirement matrix](reference/TRACEABILITY.md#requirement-matrix) assigns all 205 catalog rows and cross-cutting requirements without repeating their definitions.

Every phase applies current permissions, processing choices, retention, cancellation, direct controls, accessibility and failure behavior to enabled scope. A record type is not ready for real use before its controls exist. A partial row test cannot count as whole-product completion. Critical incidents block the affected capability under [incident policy](reference/PRODUCT-RULES.md#risks-and-incidents), regardless of other passing metrics.

### Phase 0 — Prove household boundaries and feasibility

**Outcome:** The team has independent household jobs, an actual-device inventory, and evidence for the core trust, AI, notification, and operating boundaries. This phase is not a usable product.

**Included:** Independent needs and device baseline; Core trust and feasibility evidence; Requirement evidence and decision gates.

**Dependencies:** Approved PRODUCT-PLAN.md and access to the actual household devices for capability checks.

**Exit:** Pass the [Phase 0 exit criteria](reference/ACCEPTANCE.md#phase-0) and applicable [evidence gates](reference/DECISIONS-AND-GATES.md#evidence-gates).

**Deferred boundary:** A general infrastructure program, real sensitive-data collection, specialist modules, selected personal-account connections, and a commercial launch.

### Phase 1 — Capture and recall with independent control

**Outcome:** Each adult can set up their own identity, capture and correct explicit facts, recall permitted evidence, create editable content, and coordinate a shared list through conversation or direct controls.

**Included:** Independent accounts, consent, and record control; Text assistance and visible action outcomes; Explicit memory and permitted recall; Shared lists with attributed edits; Recoverable, accessible use within cost limits.

**Dependencies:** Phase 0 evidence and decisions relevant to enabled processing and retention. Independent adult consent, never consent inferred from product-owner approval.

**Exit:** Pass the [Phase 1 exit criteria](reference/ACCEPTANCE.md#phase-1) and applicable [evidence gates](reference/DECISIONS-AND-GATES.md#evidence-gates).

**Deferred boundary:** Reminder delivery, accepted assignments, message snapshots, voice, file analysis, web search, manual agenda, briefs, all expansion and conditional features. Unsupported requests yield an honest limitation or draft.

### Phase 2 — Coordinate accepted requests and reminders

**Outcome:** Adults can request work or a reminder, independently accept or decline it, and manage a one-time prompt after the conversation closes. Both see only the status they are entitled to see.

**Included:** Tasks and recipient-controlled requests; In-app communication with bounded disclosure; One-time reminders, inbox, and tested phone delivery.

**Dependencies:** Phase 1 identity, control, list, and memory gates. Actual-phone capability evidence and snapshot-policy decisions.

**Exit:** Pass the [Phase 2 exit criteria](reference/ACCEPTANCE.md#phase-2) and applicable [evidence gates](reference/DECISIONS-AND-GATES.md#evidence-gates).

**Deferred boundary:** Recurring schedules, timers, automatic follow-up nudges, event offsets, composed handovers, external messages, and alarm-like guarantees.

### Phase 3 — Use voice, documents, and current evidence

**Outcome:** Adults can review and send voice input, ask temporary questions about supported files, retain selected originals, confirm extracted fields, and create a generic linked reminder. Current answers show inspectable web sources.

**Included:** Explicit voice with transcript review; Temporary analysis and retained document evidence; Cited current answers.

**Dependencies:** Complete checkpoint A in Phase 2. Actual processor restrictions for speech, files, and search, plus applicable sensitive consent.

**Exit:** Pass the [Phase 3 exit criteria](reference/ACCEPTANCE.md#phase-3) and applicable [evidence gates](reference/DECISIONS-AND-GATES.md#evidence-gates).

**Deferred boundary:** Structured warranties, bills or care modules, cross-document research, automatic bulk import, generated images, visual similarity, live camera, continuous voice, and room endpoints.

### Phase 4 — Plan shared days and recurring work

**Outcome:** Adults can maintain a manual agenda, share busy intervals, manage recurring work, review a household plan, and send a general handover while preserving separate contributions and acceptance.

**Included:** Manual agenda, busy-only sharing, and linked recurrence; Reviewed plans and record changes; General handovers and individual agreement.

**Dependencies:** Phase 3 checkpoint B and existing task, reminder, and sharing controls. Decisions on added lifecycle retention and specialist boundaries.

**Exit:** Pass the [Phase 4 exit criteria](reference/ACCEPTANCE.md#phase-4) and applicable [evidence gates](reference/DECISIONS-AND-GATES.md#evidence-gates).

**Deferred boundary:** External calendar connection or invitations, bookings, purchase execution, specialist care plans, automatic nudges, and scheduled generated briefs until Phase 5.

### Phase 5 — Receive useful briefs and complete Release 1

**Outcome:** The full daily assistant provides private or shared daily and weekly briefs from current authorized records, with direct fallback and comprehensive independent controls.

**Included:** Useful briefs, digest, and routine controls; Complete Release 1 acceptance and independent operation.

**Dependencies:** Phase 4 sources and schedules. Current authority, revision checks, and AI-independent fallback. No unresolved decision that changes a Release 1 acceptance outcome.

**Exit:** Pass the [Phase 5 exit criteria](reference/ACCEPTANCE.md#phase-5) and applicable [evidence gates](reference/DECISIONS-AND-GATES.md#evidence-gates).

**Deferred boundary:** The claim that household usefulness has been demonstrated over the required pilot, automatic watches, specialist modules, external accounts, new roles, or devices. Passing this phase does not approve every future feature.

### Phase 6 — Validate independent daily use

**Outcome:** The household has independent evidence of recurring value, control, and sustainable operation, or a documented need for focused revision before expansion.

**Included:** Independent household pilot; Operational correction and expansion decision.

**Dependencies:** Passing Release 1 acceptance evidence. Both adults' independent participation and retained control over enabled routines.

**Exit:** Pass the [Phase 6 exit criteria](reference/ACCEPTANCE.md#phase-6) and applicable [evidence gates](reference/DECISIONS-AND-GATES.md#evidence-gates).

**Deferred boundary:** New features added to inflate engagement, commercial growth targets, household compliance scores, or automatic expansion because the observation period ended.

### Phase 7 — Improve chosen knowledge workflows

**Outcome:** A selected expansion helps adults organize, compare, or import authorized information while preserving deliberate retention and provenance.

**Included:** Memory suggestions, review, and selected imports; Deeper research and conversation organization; Authorized cross-device continuity.

**Dependencies:** Phase 6 success and repeated need for the selected feature. Complete memory, source, deletion, and processing controls for the new information path.

**Exit:** Pass the [Phase 7 exit criteria](reference/ACCEPTANCE.md#phase-7) and applicable [evidence gates](reference/DECISIONS-AND-GATES.md#evidence-gates).

**Deferred boundary:** Whole-account ingestion without review, true visual-similarity search, selected external account connections, specialist modules by default, and automatic reuse of unselected raw history.

### Phase 8 — Support selected household routines and specialist needs

**Outcome:** One selected track provides a complete specialist workflow, such as dated inventory-to-shopping, a reviewed care handover, a factual family recap, a real lesson, or a bounded watch.

**Included:** Household knowledge and lightweight administration; Voluntary wellbeing and guardian-reviewed care; Selected family history and learning; Bounded watches and composed routines.

**Dependencies:** Phase 6 success and repeated need for a selected track. Relevant Phase 1–5 records, permission, timing, and consent controls. Phase 7 only if selected richer imports or research are needed; Phase 9 only for a selected connected source.

**Exit:** Pass the [Phase 8 exit criteria](reference/ACCEPTANCE.md#phase-8) and applicable [evidence gates](reference/DECISIONS-AND-GATES.md#evidence-gates).

**Deferred boundary:** Automatic delivery of every listed module, clinical decision-making, financial execution, unrestricted accounting, child login, broad caregiver access, external event triggers without separate enablement, and alarm-like promises.

### Phase 9 — Connect selected services with bounded authority

**Outcome:** An adult can connect a chosen account, understand what it can read, inspect health and stale data, and disconnect. Only after a separate write gate can the adult approve a supported external action and see its observed outcome.

**Included:** Selected account reading and imports; Reviewed writes and additional communication channels; Conditional calendars, task synchronization, and external triggers.

**Dependencies:** Phase 6 and a selected service need. Existing ownership, exact approval, permission rechecks, and honest receipts. Passing selected-read and disconnect tests before connected-account writes; separate recipient and outcome tests for an outbound-only communication channel.

**Exit:** Pass the [Phase 9 exit criteria](reference/ACCEPTANCE.md#phase-9) and applicable [evidence gates](reference/DECISIONS-AND-GATES.md#evidence-gates).

**Deferred boundary:** A predetermined vendor, every possible connected account, automatic writes on connection, bulk ingestion without selection, spending or investment authority, and unrestricted device-message access.

### Phase 10 — Add justified access and interaction modes

**Outcome:** One justified conditional capability works within explicit limits without exposing household information to an unauthenticated device, unauthorized caregiver, or child.

**Included:** Limited caregiver and supervised child access; Additional capture and creative modes; Home endpoints, displays, and permitted controls; Device-dependent timing and location.

**Dependencies:** Phase 6 success and separate justification for each selected conditional feature. Its relevant record, processing, role, connection, or device prerequisite. No dependency on unrelated Phase 7–9 tracks.

**Exit:** Pass the [Phase 10 exit criteria](reference/ACCEPTANCE.md#phase-10) and applicable [evidence gates](reference/DECISIONS-AND-GATES.md#evidence-gates).

**Deferred boundary:** Automatic child access, permanent blanket surveillance, ambient family recording, arbitrary media access, unrestricted physical-security controls, and broad authority granted by familiarity with a voice.

## Dependency interpretation

Identity and accepted consent precede retained records; correction, forgetting, export and recovery accompany the first retained data. Shared-list rights precede directed requests, and recipient acceptance precedes their scheduling. Durable one-time schedules and honest attempts precede recurrence; reviewed transcripts and extraction reuse the established action/receipt path.

Manual records and schedule state precede generated briefs. Freshness and output permission checks apply at delivery, not only preparation. A failed source must remain visible as a limitation; deterministic fallback cannot claim absent commitments. An integration connection does not authorize writes or unrelated routines.

The accepted sequence puts Phase 3 before Phase 4 to preserve the A–B–C checkpoints and validate difficult inputs. This is a delivery decision: manual agenda logic has no inherent dependency on speech. Independent technical investigation is possible without weakening phase exit gates. Technology choices and introduction triggers are owned by the [stack inventory](TECH-STACK.md#selection-inventory), not this roadmap.

## Future branches

After Phase 6 passes, select only work justified by repeated household need. Phases 7–10 can be omitted, reordered or pursued independently where their capability prerequisites permit. A specialist workflow does not require every knowledge enhancement; a new device does not require every integration. Read/import, connection health and disconnect precede reviewed writes within a selected connection.

External task synchronization, event triggers and the finance-product direction still lack complete selected contracts. They are evaluation slots, not commitments. Caregiver, child and additional device modes need their own authority, privacy, expiry, stop and device evidence. Existing protective rules do not activate these features. Preserve all original Expansion/Conditional classifications in the catalog.

## Release and pilot gates

The complete release gate uses the [acceptance reference](reference/ACCEPTANCE.md#production-readiness), including exact sample sizes, quality thresholds and independent core-control exercises. A four-week household pilot starts only after Phase 5 acceptance; earlier incremental testing does not count toward it. A failed pilot gate receives focused revision and the specified additional two-week observation period. These are evaluation periods, not delivery estimates.

Success requires independent recurring value for both adults, voluntary workflow use, no unresolved blocking incident, required quality, costs within the planning allocation and maintainable operation. Future work does not compensate for missing phone delivery, independent recovery, permissions or general Release 1 workflows. The [decision/gate register](reference/DECISIONS-AND-GATES.md) owns unresolved interpretations and evidence status; this document does not maintain another policy register.

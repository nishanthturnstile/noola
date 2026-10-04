# Product plan

**Household AI Assistant — product baseline 1.2, 4 October 2026.** Product owner: Nishanth. Product scope is confirmed; implementation, security, reliability and household usefulness are unvalidated. This revision records his budget-exhaustion and nonproduction-provider decisions. The architecture remains a draft awaiting his review. [Documentation index](README.md).

## Purpose and users

A private household assistant for deliberate memory, evidence-based recall and consent-based coordination. Two adults use private conversations and selected shared records to manage facts, files, lists, tasks, reminders, appointments, plans, handovers and decisions. Direct controls keep online records and saved schedules useful when conversational AI is unavailable.

The problem hypothesis is that useful information is scattered across conversations, documents and existing apps, making people repeat coordination or lose the reasons behind decisions. Existing messaging and calendars remain available. No interviews, measured time savings or evidence that those tools are generally inadequate are claimed. The product is worthwhile only if both adults independently find recurring value.

The intended users are Nishanth, his wife as an independent equal participant in shared decisions, and a guardian-managed dependent profile for Vihaan, born 3 March 2026. Vihaan has no independent login or conversation in Release 1. His age is calculated for the relevant date. Nishanth is the builder, product owner and initial household coordinator; those roles do not grant access to another adult’s private records. The service operator is an operational responsibility, not an additional consumer persona.

Each adult supplies their own consent, language, preferences, recurring situations and feedback. Each selects three recurring situations during onboarding or supplies equivalents. The second adult’s needs and technical familiarity must not be inferred from the builder’s. The [role and record-rights policy](reference/PRODUCT-RULES.md#roles-and-permissions) defines the separate owner, guardian, coordinator and operator boundaries.

The primary goals are to reduce mental overhead, retrieve deliberately retained facts with evidence and visible uncertainty, turn agreed intentions into understandable commitments, and protect independent adult control. Secondary goals are practical text/voice/document input, manual continuity, independent daily use, and inspectable correction, export and removal. More conversation, more retention or more notifications are not success measures.

## Release scope

Release 1 is the complete first daily assistant for the actual household iPhone, Android and desktop browser. Its canonical [requirements catalog](reference/REQUIREMENTS.md#capability-catalog) contains 135 mandatory Release 1 rows, 52 future Expansion rows and 18 future Conditional rows. Cross-cutting functional requirements, business rules and quality gates are binding alongside those rows. A family with future specialist features can still contain mandatory current protections.

| Included area | Release 1 outcome |
|---|---|
| Identity and control | Independent adult accounts, accepted settings, guardian-managed dependent identity, device revocation, export, recovery and exit |
| Conversation and capture | Text, mixed requests, editable outputs, optional explicit voice with reviewed transcript and Send, supported photos/documents |
| Memory and evidence | Explicit saved facts, requested history recall, current source evidence, correction, forgetting, temporary use and manual-only records |
| Coordination | Shared lists, accepted tasks/reminder requests, in-app messages, generic handovers, attributed decisions and reviewed plans |
| Time | One-time and recurring reminders, recurring chores, manual agenda, event-relative reminders and busy-only sharing |
| Briefs | Opt-in daily/weekly briefs, source freshness, interruption controls and direct agenda fallback |
| Reliability | Honest per-step outcomes, concurrency/retry handling, actual-phone push, accessibility, lifecycle integrity and bounded operation |

Ordinary notes, checklists, stories, files, authorized sensitive records and generic handovers remain included even when related specialist modules are deferred. An invoice may be saved as a file without implementing structured billing. A general handover does not require a caregiver account or clinical module. The manual agenda does not require an external calendar.

Expansion candidates include suggested memory capture, historical imports, deeper research, topic organization, specialist home administration/care/history/learning workflows, watches, additional routines and selected account connections. Conditional candidates include caregiver access, supervised child interaction, live or continuous input, new home endpoints, visual similarity, generated media, external calendars, device alarms and location triggers. These are unselected possibilities with separate justification and acceptance gates, not promised deliverables. The [integration scope](reference/REQUIREMENTS.md#integration-scope) also retains incomplete future synchronization, trigger and finance-connection contracts.

Release 1 excludes purchases, transfers, investment execution, bookings, external sending, calendar invitations, ambient recording, location tracking, physical-security control, arbitrary computer control and independent child use. Confirmation does not make an unsupported action available. Infrastructure email for identity/recovery and content-free lifecycle notices is separate from user-directed external messaging.

The product is not an emergency monitor, medical professional, password manager, financial manager, replacement parent, full accounting system or photo-library replacement. It excludes hidden monitoring, emotional profiling, relationship adjudication, spouse surveillance, household compliance scores and punitive habit streaks. There is no public signup, commercial billing, marketplace or multi-household program. The working name remains Household AI Assistant.

## Key experiences

The complete [journey reference](reference/ACCEPTANCE.md#user-journeys) preserves F01–F18 and four additional independent-control journeys. The central experience is a short path from a deliberate input to an inspectable record and truthful outcome.

- Save a useful fact privately, recall it with evidence, correct it when it changes, and control whether it remains available to AI.
- Share a list without sharing the originating private conversation; reconcile concurrent edits with attribution.
- Ask the other adult to do something and see a request until they accept; acknowledgment and task completion remain separate states.
- Review a transcript or extracted document field before committing an uncertain recipient, name, time or amount.
- Approve plan changes as individual record changes, preserving completed work and each participant’s independent acceptance.
- Receive a current brief with visible source coverage; use direct agenda information when generation is unavailable.
- Export, pause reminders, recover access, decline sensitive processing or leave without needing conversational AI or another adult’s private data.

The application exposes Talk, Today, Family, Memory and Settings as their capabilities become available. Global search and action cards lead to authoritative records. Pending approvals and failures remain accessible after chat closes. Full [experience principles](reference/PRODUCT-RULES.md#experience-principles) govern navigation, progressive setup and direct control.

## Constraints and trust

[Product rules](reference/PRODUCT-RULES.md#business-rules) own permissions, consent, retention, disclosure, record lifecycles and time behavior. Reading does not automatically grant editing, exporting or onward sharing. Sharing an excerpt does not open its private source. Sent snapshots and live grants have different correction and retraction behavior; external copies cannot reliably be recalled.

Processing and retention are separate choices. Manual-only records and their derivatives stay out of external AI. Sensitive use requires the specified choices; detection is a safeguard, not a guarantee. Production processor, location and operator disclosure remain explicit gates, and no secrecy from the service operator is promised. Development/testing/staging/UAT may evaluate any available model or processor in any affordable available region without production residency, no-training qualification or thirty-day processor-retention eligibility gates; access/terms, permissions, funding approval and informed consent for real data still apply under [BR-007](reference/PRODUCT-RULES.md#br-007).

The initial planning allocation is INR 3,000 per calendar month: INR 1,000 for baseline service/recovery and INR 2,000 for variable AI. Existing personal subscriptions are displayed separately. Nishanth approves funding increases and paid fallback; the allocation is not spending authorization or evidence that the stack fits. Exhausting the paid AI allocation temporarily disables all optional AI features, including subscription and background routes, while manual records, ordinary reminders, privacy controls and direct agenda briefs continue. A local-model alternative is future work requiring separate selection and validation. Maintenance after stabilization should be at most one hour weekly. [Operating constraints](reference/PRODUCT-RULES.md#operating-constraints) own these values and resumption rules.

Actual-device, English/Tamil/transliteration/mixed-language, accessibility, input-size, storage and recovery requirements remain binding. Their exact limits live in [functional requirements](reference/REQUIREMENTS.md#functional-requirements) and [quality criteria](reference/ACCEPTANCE.md#quality-and-evaluation). Offered onboarding defaults require each adult’s acceptance. An AI-only outage preserves online manual functions; a complete service outage has no guaranteed offline archive. Push is best effort, never an alarm guarantee.

## Success and delivery

The [roadmap](ROADMAP.md#delivery-sequence) owns delivery order: Phase 1 is the first usable increment, Phase 5 completes functional Release 1 acceptance, and Phase 6 validates household outcomes. These milestones do not redefine Release 1 as a smaller chat product.

After the release acceptance gate, run the required four-week household pilot. Each adult must independently use core controls, find recurring value in at least two situations and voluntarily use selected workflows. Record practical examples, friction and reliance on the builder against their previous method. One adult’s positive result cannot substitute for the other’s. Failed pilot gates receive correction and the specified focused re-observation period.

The [acceptance reference](reference/ACCEPTANCE.md#quality-and-evaluation) owns numerical thresholds, sample sizes, scoring, forbidden-disclosure cases and pilot procedures. No blocking privacy, authority, data-loss or notification incident may be hidden by average quality scores. The [decision and gate register](reference/DECISIONS-AND-GATES.md) tracks unresolved interpretation and uncollected proof. Future scope is selected only after the required core evidence passes.

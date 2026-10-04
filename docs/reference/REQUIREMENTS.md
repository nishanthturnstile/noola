# Requirements

Canonical capability catalog and functional requirements. Product rules and applicable quality gates are binding alongside each row.

[Documentation index](../README.md). Consolidated 3 October 2026; implementation and validation remain pending.

<a id="capability-catalog"></a>
## Product Capabilities

The original catalog IDs remain the canonical references. Each table row is a sub-feature, behavior, or protective constraint under a feature, not a separate top-level feature. A `Release 1` row is Confirmed and mandatory, including protective constraints on unsupported future features. `Expansion` and `Conditional` rows are Future with the source's stated gate.

Row-level release markers control scope. Each Release 1 row requires its own acceptance result in the applicable validation family.

### Identity and independent control

#### Accounts, household setup, and identities

Description: One household has separate adult identities, explicit household rules, recovery, device control, and a managed dependent.

| ID | Release | Required product behavior |
|---|---|---|
| <a id="acc-01"></a>ACC-01 | Release 1 | Create one private household with separate adult identities. Shared credentials must not be the normal way to use the product. |
| <a id="acc-02"></a>ACC-02 | Release 1 | Invite the second adult and let that person set their own profile, consent, language, and notification preferences. |
| <a id="acc-03"></a>ACC-03 | Release 1 | Create a parent-managed Vihaan profile without an independent child login. Confirm the guardians who may access it. |
| <a id="acc-04"></a>ACC-04 | Release 1 | Show the active identity and conversation audience before capture and before an action affects someone else. |
| <a id="acc-05"></a>ACC-05 | Release 1 | Let each adult review their active devices, sign out, and revoke access to a lost or shared device. |
| <a id="acc-06"></a>ACC-06 | Release 1 | Support account recovery without making another adult's private content available to the recovering household coordinator. Explain any actual operator-access limits. |
| <a id="acc-07"></a>ACC-07 | Release 1 | Store relationship aliases such as "my wife" relative to the speaker. Ask when "Mom," "Dad," or a name has multiple possible matches. |
| <a id="acc-08"></a>ACC-08 | Release 1 | Provide jointly accepted household rules before cross-member use. Each recipient independently controls consent, quiet hours, and standing assignment categories under [Business Rules](PRODUCT-RULES.md#business-rules) and [Notifications and Communication](PRODUCT-RULES.md#notifications). |
| <a id="acc-09"></a>ACC-09 | Conditional | Invite a caregiver to named records, lists, or tasks with an expiry date. No full-household access by default. |

Business rules: BR-001 through BR-005; roles in [Roles and Permissions](PRODUCT-RULES.md#roles-and-permissions).

Dependencies: Each adult's authentication, consent, and accepted shared rules.

#### Personalization and interaction preferences

Description: Adult-controlled preferences guide interaction and opted-in planning.

| ID | Release | Required product behavior |
|---|---|---|
| <a id="per-01"></a>PER-01 | Release 1 | Let each adult choose language, level of detail, tone, spoken-response preference, units, and date/time presentation. |
| <a id="per-02"></a>PER-02 | Release 1 | Explicit settings override inferred preferences. Suggested settings require acceptance. Conditional settings activate only from an explicit mode or user statement. |
| <a id="per-03"></a>PER-03 | Release 1 | Personalize explanations without changing facts, suppressing relevant trade-offs, or agreeing merely to match the person. |
| <a id="per-04"></a>PER-04 | Release 1 | Let users inspect, edit, disable, or reset personalization without necessarily deleting unrelated records or reminders. |
| <a id="per-05"></a>PER-05 | Release 1 | Support per-conversation overrides such as "keep this brief" or "explain in Tamil" without automatically changing the global profile. |
| <a id="per-06"></a>PER-06 | Release 1 | Remember useful constraints for opted-in planning, such as dietary preferences, accessible activities, or preferred appointment windows. Show which constraints influenced the plan. |
| <a id="per-07"></a>PER-07 | Release 1 | Do not infer mental states, diagnoses, personality labels, family roles, or private beliefs from voice, appearance, or limited interaction history. |

Business rules: BR-006; facts and evidence never change with tone.

Dependencies: Adult settings and authorized saved constraints.

#### Control, privacy, retention, and portability

Description: Inspect sources, correct information, manage use, export, recover, report problems, or leave.

| ID | Release | Required product behavior |
|---|---|---|
| <a id="ctl-01"></a>CTL-01 | Release 1 | Provide one place to review profile data, memories, connected accounts, active routines, sharing, notification preferences, and retained media. |
| <a id="ctl-02"></a>CTL-02 | Release 1 | Let users inspect the source and intended audience of a remembered fact or generated household summary. |
| <a id="ctl-03"></a>CTL-03 | Release 1 | Apply the explicit retention periods and cleanup limits in [Business Rules](PRODUCT-RULES.md#business-rules). Expiring sources and independently retained records have separately visible outcomes. |
| <a id="ctl-04"></a>CTL-04 | Release 1 | Disclose cloud hosting separately from external AI processing. A No external AI processing label excludes the record and its derived content from every external AI processing step. |
| <a id="ctl-05"></a>CTL-05 | Release 1 | Support "stop using this," "delete this memory," and "remove this information wherever retained" as different requests with clear consequences. |
| <a id="ctl-06"></a>CTL-06 | Release 1 | Support export of the owner's content and authorized shared content without exporting another adult's private records. |
| <a id="ctl-07"></a>CTL-07 | Release 1 | Show relevant activity history for record changes, sharing, and assistant actions while keeping private content and private action metadata out of shared views. |
| <a id="ctl-08"></a>CTL-08 | Release 1 | Provide a simple way to report "wrong fact," "wrong person," "wrong action," "too many reminders," or "privacy concern." |
| <a id="ctl-09"></a>CTL-09 | Release 1 | Provide a recovery path for retained family information, show when recoverable copies were last created, and explain the limits of recovery and deletion. |
| <a id="ctl-10"></a>CTL-10 | Release 1 | Support self-service account exit, immediate future-access revocation, export, and explicit shared-record disposition under [Business Rules](PRODUCT-RULES.md#business-rules) and [Roles and Permissions](PRODUCT-RULES.md#roles-and-permissions). Do not erase the other adult's contributions. |

Business rules: BR-001 through BR-009; FR-004 and FR-005.

Dependencies: Visible attribution, audiences, action history, and independent recovery.

### Conversation and input

#### Natural conversation and general assistance

Description: Text conversation supports mixed intents, corrections, editable outputs, and ordinary practical assistance.

| ID | Release | Required product behavior |
|---|---|---|
| <a id="con-01"></a>CON-01 | Release 1 | Support multi-turn text conversation, follow-up questions, corrections, and references such as "that appointment" when the intended item is clear. |
| <a id="con-02"></a>CON-02 | Release 1 | Separate mixed requests into useful parts: answer, memory, task, reminder, search, draft, or sharing action. Show the outcome of each part. |
| <a id="con-03"></a>CON-03 | Release 1 | Distinguish an idea, hypothetical, quote, wish, or complaint from an instruction. "Maybe we should travel" must not book or schedule anything. |
| <a id="con-04"></a>CON-04 | Release 1 | Ask a focused question only when missing information changes the person, time, permission, safety, or outcome. A bare yes applies only to a single current, unexpired proposal. |
| <a id="con-05"></a>CON-05 | Release 1 | Support explanations, summaries, translation, rewriting, brainstorming, comparisons, checklists, everyday calculations, and practical planning. |
| <a id="con-06"></a>CON-06 | Release 1 | Distinguish household evidence, current web information, assumptions, and generated suggestions. Never invent a source or claim a remembered fact without support. |
| <a id="con-07"></a>CON-07 | Release 1 | Let the user stop a response or action in progress. Show whether anything had already completed before cancellation. |
| <a id="con-08"></a>CON-08 | Release 1 | Allow a correction such as "I meant next Tuesday" without duplicating the original action. Keep the corrected result visible. |
| <a id="con-09"></a>CON-09 | Expansion | Organize conversations into optional topic spaces, such as a trip, home maintenance, or a family decision, without making folders mandatory. |
| <a id="con-10"></a>CON-10 | Release 1 | Create editable notes, stories, letters, plans, and summaries. Support copying, saving, and exporting the approved version with audience and generated-content labels intact. |
| <a id="con-11"></a>CON-11 | Expansion | Let an adult ask for a deeper research comparison with an explicit question and constraints; return sources, limitations, and a decision-ready summary. |
| <a id="con-12"></a>CON-12 | Conditional | Generate illustrative images or other creative media on request. Label generated family scenes as fictional rather than historical evidence. |

Business rules: BR-010 and BR-012; quoted or hypothetical content has no authority.

Dependencies: Authenticated identity, source permissions, and separately authorized actions.

#### Voice interaction

Description: Explicit capture produces an editable transcript; Send submits the request and optional speech has text alternatives.

| ID | Release | Required product behavior |
|---|---|---|
| <a id="voi-01"></a>VOI-01 | Release 1 | Start and stop voice capture explicitly. Display an unmistakable listening indicator and an accessible cancel control. |
| <a id="voi-02"></a>VOI-02 | Release 1 | Support English, Tamil, and mixed Tamil-English as pilot evaluation targets. Each adult chooses input and response preferences independently. |
| <a id="voi-03"></a>VOI-03 | Release 1 | Stopping recording displays an editable transcript without submitting it. Require explicit Send; uncertain critical fields pause the affected action for correction. |
| <a id="voi-04"></a>VOI-04 | Release 1 | Read responses aloud on request or under a chosen preference. Always provide a text alternative and immediate mute/stop. |
| <a id="voi-05"></a>VOI-05 | Release 1 | Keep raw audio separate from transcript retention and apply [Business Rules](PRODUCT-RULES.md#business-rules) cleanup limits. An explicit saved voice note is a retained media item with its own consent. |
| <a id="voi-06"></a>VOI-06 | Release 1 | Handle silence, interruptions, background noise, and microphone denial without creating unintended actions. Let the user retry or type. |
| <a id="voi-07"></a>VOI-07 | Release 1 | Support correction between voice turns and switching between voice and text without losing the pending request. Continuous listening is conditional. |
| <a id="voi-08"></a>VOI-08 | Release 1 | Offer a compact voice answer with an optional fuller written explanation, rather than reading long tables aloud. |
| <a id="voi-09"></a>VOI-09 | Conditional | Add continuous conversation, interruption of speech, wake activation, or room devices only with clear session, privacy, and device-support controls. |
| <a id="voi-10"></a>VOI-10 | Release 1 | Never treat an apparently familiar voice as sufficient authorization for private information, external sending, or sensitive changes. |

Business rules: FR-002; BR-007 and BR-008.

Dependencies: Recording-specific processing consent, tested languages and device capabilities.

#### Devices, offline behavior, and accessibility

Description: Direct controls, accessible input, clear device limitations, and honest offline drafts support daily use.

| ID | Release | Required product behavior |
|---|---|---|
| <a id="dev-01"></a>DEV-01 | Release 1 | Support the actual household iPhone, Android, and desktop browser. Record tested device versions and verify the same release-critical workflows on each. |
| <a id="dev-02"></a>DEV-02 | Release 1 | Support typed input, readable transcripts, non-audio alerts, keyboard navigation, accessible labels, and usable text enlargement. |
| <a id="dev-03"></a>DEV-03 | Release 1 | Offline typed captures remain visibly unsaved session drafts. Reconnection requires review and Send. Closing the app may discard the draft; no offline scheduling claim is allowed. |
| <a id="dev-04"></a>DEV-04 | Release 1 | Synchronize a successful retry without duplicating a task, memory, or message. Handle conflicting edits explicitly. |
| <a id="dev-05"></a>DEV-05 | Release 1 | No persistent offline private-record cache in Release 1. Clear local session state on logout and profile switch; lock shared devices on backgrounding. Revocation denies server access immediately but cannot erase a disconnected device or downloaded exports. |
| <a id="dev-06"></a>DEV-06 | Release 1 | Explain limitations for notifications, locked-screen behavior, camera, microphone, timers, and background activity on the current device. |
| <a id="dev-07"></a>DEV-07 | Expansion | Resume drafts and selected conversations across authorized devices without exposing one adult's private work on another adult's device. |
| <a id="dev-08"></a>DEV-08 | Release 1 | Keep private notification previews discreet by default. Opening a private notification requires the correct authenticated member. |

Business rules: BR-001; FR-006; [Product Constraints](PRODUCT-RULES.md#operating-constraints) constraints.

Dependencies: Supported device inventory and actual release-critical workflow tests.

### Memory and evidence

#### Long-term memory

Description: Saved facts, requested history recall, source evidence, correction, forgetting, and retention remain distinct.

| ID | Release | Required product behavior |
|---|---|---|
| <a id="mem-01"></a>MEM-01 | Release 1 | Save an explicit "remember this" request with visible content, owner, audience, source, and confirmation of actual retention. |
| <a id="mem-02"></a>MEM-02 | Release 1 | Retain conversations under the selected history period, including until deleted. Search history only on explicit recall requests or selected-source requests. Saved facts and structured records supply automatic context. |
| <a id="mem-03"></a>MEM-03 | Release 1 | Keep facts, preferences, decisions, experiences, commitments, and generated suggestions distinguishable. A suggestion is not an event that happened. |
| <a id="mem-04"></a>MEM-04 | Release 1 | Record who stated something, whom it concerns, when it was recorded, and when it was true when known. Do not guess a missing date. |
| <a id="mem-05"></a>MEM-05 | Release 1 | Answer recall questions with references to accessible sources. Support "Why do you remember this?" and opening the original context. |
| <a id="mem-06"></a>MEM-06 | Release 1 | Correct or supersede a memory when circumstances change. Preserve useful historical context without treating outdated information as current. |
| <a id="mem-07"></a>MEM-07 | Release 1 | Resolve contradictions visibly. Distinguish a factual conflict from two people having different preferences. |
| <a id="mem-08"></a>MEM-08 | Release 1 | Allow Private, Selected adults, Household-shared, and Guardian-managed visibility where appropriate. Derived summaries must not widen access. |
| <a id="mem-09"></a>MEM-09 | Release 1 | Control new capture, automatic personalization, and requested history retrieval separately. Disabling one never silently deletes unrelated records. |
| <a id="mem-10"></a>MEM-10 | Release 1 | Offer temporary conversations that do not become retained household history or new memories. Any exception, such as saving a requested reminder, must be explicit. |
| <a id="mem-11"></a>MEM-11 | Expansion | Suggest useful low-risk memories after conversation. Auto-save low-risk information only after the member enables that mode. |
| <a id="mem-12"></a>MEM-12 | Release 1 | Apply sensitive processing and retention consent to history, files, extracted facts, summaries, and lasting actions. Reject recognized secrets and follow [Business Rules](PRODUCT-RULES.md#business-rules) for uncertain classification. |
| <a id="mem-13"></a>MEM-13 | Release 1 | Browse and filter saved memory by person, topic, type, date, source, visibility, and current or historical status. Keep forgotten information out of AI retrieval. |
| <a id="mem-14"></a>MEM-14 | Expansion | Review potentially stale preferences, unresolved conflicts, and memories lacking enough context. Avoid pestering users to reconfirm stable facts. |
| <a id="mem-15"></a>MEM-15 | Release 1 | Apply the distinct correction, personalization exclusion, forgetting, source deletion, and information-removal contracts in [Business Rules](PRODUCT-RULES.md#business-rules). Never silently regenerate forgotten material. |
| <a id="mem-16"></a>MEM-16 | Expansion | Import selected old notes or conversations through preview, author/date review, duplicate handling, and visibility selection. Do not ingest an entire account automatically. |
| <a id="mem-17"></a>MEM-17 | Release 1 | Export retained memories and their sources or source references in understandable formats, preserving ownership and dates. |

Business rules: BR-002 through BR-009.

Dependencies: Explicit retention choice, attribution, source permissions, and dates.

#### Personal recall, web search, and grounded answers

Description: Natural and filtered search produces inspectable sources without private existence signals.

| ID | Release | Required product behavior |
|---|---|---|
| <a id="src-01"></a>SRC-01 | Release 1 | Provide a unified search across the user's permitted conversations, memories, files, tasks, lists, and decisions. |
| <a id="src-02"></a>SRC-02 | Release 1 | Find relevant information from natural descriptions, exact names, dates, approximate wording, and confirmed aliases. |
| <a id="src-03"></a>SRC-03 | Release 1 | Let the user narrow search to private content, shared family content, a topic, a person, a date range, or a source type. |
| <a id="src-04"></a>SRC-04 | Release 1 | Clearly separate "from your records" from "from the web." Search the web when the user requests it or freshness is material. |
| <a id="src-05"></a>SRC-05 | Release 1 | Cite external answers with inspectable sources and dates when relevant. Say when a page is inaccessible, evidence is weak, or a current fact could not be verified. |
| <a id="src-06"></a>SRC-06 | Release 1 | Minimize personal information sent in external search queries. Do not include family identities when a generic query would answer the question. |
| <a id="src-07"></a>SRC-07 | Release 1 | Never expose private search snippets, titles, result counts, existence signals, or suggested questions to an unauthorized member. |
| <a id="src-08"></a>SRC-08 | Expansion | Compare several documents or sources and explain disagreements. Keep original wording separate from the assistant's interpretation. |
| <a id="src-09"></a>SRC-09 | Expansion | Save a research conclusion as a draft decision or note, with sources and an "as of" date, only when the user chooses to retain it. |
| <a id="src-10"></a>SRC-10 | Conditional | Offer image search or true visual-similarity search as separately named capabilities. Never present descriptive photo search as proof of an exact visual match. |

Business rules: BR-002, BR-003, BR-006, and BR-007.

Dependencies: Requested recall or selected sources; current evidence when freshness matters.

#### Images, documents, and practical visual assistance

Description: Temporary analysis, explicit file retention, uncertain extraction, and linked actions have separate outcomes.

| ID | Release | Required product behavior |
|---|---|---|
| <a id="doc-01"></a>DOC-01 | Release 1 | Accept supported photos, screenshots, PDFs, and text under [Functional Requirements](REQUIREMENTS.md#functional-requirements) limits. Show audience, temporary-analysis status, and processing choice before submission. |
| <a id="doc-02"></a>DOC-02 | Release 1 | Answer questions about an uploaded item and identify the relevant page, region, or excerpt when feasible. |
| <a id="doc-03"></a>DOC-03 | Release 1 | Extract useful text, dates, amounts, names, and reference details into a reviewable draft. Mark unreadable or uncertain values. |
| <a id="doc-04"></a>DOC-04 | Release 1 | Ask for a clearer image or manual correction instead of inventing blurred characters, missing pages, expiry dates, or totals. |
| <a id="doc-05"></a>DOC-05 | Release 1 | Let the user ask about a file without permanently adding it to the family archive. Distinguish temporary analysis from retention. |
| <a id="doc-06"></a>DOC-06 | Release 1 | Save selected files with owner, audience, category, source, and retention. Specialized bill, asset, and care modules remain expansion. |
| <a id="doc-07"></a>DOC-07 | Release 1 | Convert reviewed extracted fields into separate linked tasks, events, or reminders. Confirm uncertain fields and affected actions before committing. |
| <a id="doc-08"></a>DOC-08 | Release 1 | Search the family archive through descriptions such as "the appliance receipt from last summer" and show candidate matches. |
| <a id="doc-09"></a>DOC-09 | Release 1 | Support replacement and duplicate detection for retained files. Keep the prior original and attributed revisions until explicitly deleted; changes flag linked extracted facts and actions for review. |
| <a id="doc-10"></a>DOC-10 | Release 1 | Treat instructions inside files, images, and websites as content to analyze, not permission to send messages, reveal data, or change household records. |
| <a id="doc-11"></a>DOC-11 | Conditional | Support live camera or screen-sharing sessions only while explicitly active; show what is shared and provide immediate stop controls. |
| <a id="doc-12"></a>DOC-12 | Release 1 | Avoid identity, health, emotion, or other sensitive judgments about people from photos. Do not make safety-critical object identification claims from uncertain images. |

Business rules: FR-002 and FR-003; BR-007 through BR-010.

Dependencies: Supported inputs, processing consent, reviewed extracted fields, and action authority.

### Shared coordination and time

#### Tasks, shared lists, and chores

Description: Lists, tasks, recurring chores, subtasks, and small plans preserve attributed edits and explicit acceptance.

| ID | Release | Required product behavior |
|---|---|---|
| <a id="tsk-01"></a>TSK-01 | Release 1 | Create, edit, complete, reopen, archive, and cancel personal or shared tasks through conversation and direct controls. |
| <a id="tsk-02"></a>TSK-02 | Release 1 | Distinguish the task creator, responsible person, audience, due date, reminder, and completion state. A due date is not automatically a notification. |
| <a id="tsk-03"></a>TSK-03 | Release 1 | Support shopping lists, packing lists, errands, and ordinary checklists with quantities, notes, and optional assignments. |
| <a id="tsk-04"></a>TSK-04 | Release 1 | Assignments require recipient acceptance unless a recipient-approved standing category applies. Decline stops assignment nudges; material reassignment or scope changes require renewed acceptance. |
| <a id="tsk-05"></a>TSK-05 | Release 1 | Attribute completion and edits. Reconcile retries of the same request without duplicating commitments. Deliberate add another instructions remain distinct. |
| <a id="tsk-06"></a>TSK-06 | Release 1 | Handle simultaneous edits visibly. Preserve another person's changes instead of silently overwriting them. |
| <a id="tsk-07"></a>TSK-07 | Release 1 | Support recurring chores, reusable checklists, one level of subtasks, and explicit prerequisite links. A prerequisite never automatically completes dependent work. |
| <a id="tsk-08"></a>TSK-08 | Release 1 | Group tasks into a small shared plan, such as preparing for travel or arranging a repair. Show a practical next step. |
| <a id="tsk-09"></a>TSK-09 | Release 1 | Members can mute routine list activity and separately disable assigned notifications. Muting list activity alone does not mute explicitly accepted reminders. |
| <a id="tsk-10"></a>TSK-10 | Release 1 | Do not infer task completion from silence, location, a notification opening, or a casual statement unless the intended task is clear. |

Business rules: BR-004 and BR-010 through BR-013.

Dependencies: Recipient consent, accepted shared rights, and distinct task and reminder state.

#### Reminders, timers, and scheduled delivery

Description: Resolved schedules and occurrences remain separate from notification delivery, acknowledgment, and task completion.

| ID | Release | Required product behavior |
|---|---|---|
| <a id="rem-01"></a>REM-01 | Release 1 | Create a one-time reminder with a recipient, clear message, resolved date/time, timezone, and visible delivery plan. |
| <a id="rem-02"></a>REM-02 | Release 1 | Support relative expressions such as "in 20 minutes" and "tomorrow evening." Show the resolved schedule; use a chosen daypart preference or ask when needed. |
| <a id="rem-03"></a>REM-03 | Release 1 | Support daily, selected-weekday, weekly, and monthly recurrence, with pause, end date, and occurrence-versus-series editing. |
| <a id="rem-04"></a>REM-04 | Release 1 | Provide snooze, reschedule, cancel, acknowledge, and mark-complete actions without requiring another chat. |
| <a id="rem-05"></a>REM-05 | Release 1 | Cross-member reminder requests remain awaiting acceptance until the recipient consents or a matching standing rule applies. Show the sender, requested content, and exact time. |
| <a id="rem-06"></a>REM-06 | Release 1 | Distinguish saved, scheduled, notification submitted, delivery unknown, acknowledged, completed, failed, canceled, and overdue states where relevant. |
| <a id="rem-07"></a>REM-07 | Release 1 | Support notification-permission checks and a test notification. Warn when an intended recipient has no functioning delivery channel. |
| <a id="rem-08"></a>REM-08 | Release 1 | Keep accepted reminders available after the conversation closes. Never claim successful scheduling for an unsaved or offline-only draft. |
| <a id="rem-09"></a>REM-09 | Release 1 | Apply recipient quiet hours and notification preferences. An "urgent" label must not silently override another person's choices. |
| <a id="rem-10"></a>REM-10 | Release 1 | Link reminders to event offsets. Event changes recompute future occurrences; cancellation suppresses them. Review a recomputed occurrence if its time has already passed. |
| <a id="rem-11"></a>REM-11 | Expansion | Offer at most one follow-up per unacknowledged occurrence, off by default, with recipient-selected delay and an immediate stop control. |
| <a id="rem-12"></a>REM-12 | Release 1 | Apply purpose-specific late, quiet-hour, and recurrence rules in [Business Rules](PRODUCT-RULES.md#business-rules) and [Notifications and Communication](PRODUCT-RULES.md#notifications). Never report delayed delivery as on time. |
| <a id="rem-13"></a>REM-13 | Expansion | Offer named timers with pause, restart, and cancel where the device can support the promised behavior. Clearly distinguish an in-app timer from a device alarm. |
| <a id="rem-14"></a>REM-14 | Conditional | Support location-based triggers or alarm-like behavior only after device capability, permission, and locked-screen behavior are validated. Never market ordinary notifications as guaranteed alarms. |

Business rules: BR-010 through BR-013; [Notifications and Communication](PRODUCT-RULES.md#notifications).

Dependencies: Accepted recipient, exact schedule, channel checks, and linked event or task state.

#### Family communication and handovers

Description: In-app messages, dated handovers, revisions, decisions, and household digests respect recipient controls.

| ID | Release | Required product behavior |
|---|---|---|
| <a id="com-01"></a>COM-01 | Release 1 | Send an in-app household message with a named sender, recipient, content, and status. Never impersonate one family member to another. |
| <a id="com-02"></a>COM-02 | Release 1 | Turn "tell my wife" into sharing the intended message, not the full private conversation or unrelated remembered context. |
| <a id="com-03"></a>COM-03 | Release 1 | Allow the recipient to acknowledge, reply, request clarification, decline a request, or convert the message into a task. |
| <a id="com-04"></a>COM-04 | Release 1 | Keep notification submission, explicit acknowledgment, task acceptance, and task completion separate. Do not collect or expose passive read receipts in v1. |
| <a id="com-05"></a>COM-05 | Release 1 | Build a handover from selected tasks, documents, appointments, and notes; preview its audience and content before sending. |
| <a id="com-06"></a>COM-06 | Release 1 | Keep decision options, rationale, date, and revisions. Each participant confirms their own agreement. Unconfirmed agreement stays attributed to the reporting author. |
| <a id="com-07"></a>COM-07 | Release 1 | Avoid judging which adult is right in a disagreement or revealing private context to settle it. Help restate the practical issue and options. |
| <a id="com-08"></a>COM-08 | Release 1 | Offer a digest of relevant household changes instead of notifying every person about every edit. |
| <a id="com-09"></a>COM-09 | Release 1 | Let a recipient mute nonessential requests, set availability, and control reminders directed at them. No hidden monitoring or compliance score. |

Business rules: BR-002 through BR-004 and BR-010 through BR-012.

Dependencies: Messaging choice, exact approved excerpts, permitted recipients, and attribution.

#### Calendar, scheduling, and practical planning

Description: Manual agendas and approved busy intervals support overlap checks and plans without claiming complete calendar coverage.

| ID | Release | Required product behavior |
|---|---|---|
| <a id="cal-01"></a>CAL-01 | Release 1 | Maintain a manual personal and household agenda. Label its coverage as entered records only; no external calendar connection is required. |
| <a id="cal-02"></a>CAL-02 | Release 1 | Distinguish tentative ideas, proposed times, confirmed appointments, canceled events, and completed events. |
| <a id="cal-03"></a>CAL-03 | Release 1 | Resolve start date/time, end time or duration, participants, and timezone before confirming a timed event. Support all-day events with explicit dates; location is optional. |
| <a id="cal-04"></a>CAL-04 | Release 1 | Flag overlaps using authorized entered events and explicitly shared busy intervals. Missing external information never establishes availability. |
| <a id="cal-05"></a>CAL-05 | Release 1 | Build plans for a day, weekend, trip, appointment, or household project using selected constraints and current information where needed. |
| <a id="cal-06"></a>CAL-06 | Release 1 | Convert an approved plan into separate tasks, reminders, checklists, and events. Preview the changes as a group. |
| <a id="cal-07"></a>CAL-07 | Release 1 | Let users revise constraints and regenerate a proposal without silently modifying already accepted commitments. |
| <a id="cal-08"></a>CAL-08 | Conditional | Connect selected external calendars, choose read versus write permission, and distinguish local draft changes from confirmed external updates. |
| <a id="cal-09"></a>CAL-09 | Release 1 | Offer busy-only sharing through an explicit grant. Show intervals without title, location, notes, attendees, or inaccessible event identifiers. |

Business rules: BR-010 through BR-013; FR-007.

Dependencies: Entered commitments, chosen constraints, explicit busy-only grants, and participant acceptance.

### Briefs and proactive assistance

#### Proactivity, routines, and conditional watches

Description: Opt-in briefs use current authorized records; future watches and composed routines need separate enablement.

| ID | Release | Required product behavior |
|---|---|---|
| <a id="pro-01"></a>PRO-01 | Release 1 | Let each adult opt into a daily or weekly brief with selected topics, audience, delivery time, quiet hours, and length. |
| <a id="pro-02"></a>PRO-02 | Release 1 | Deliver the requested content. A Release 1 brief contains authorized agenda, tasks, and requests; scheduled learning material is expansion. |
| <a id="pro-03"></a>PRO-03 | Release 1 | Generate private and shared briefs separately using saved facts and structured authorized records, not unselected historical chats. Recheck audience and source revisions before delivery. |
| <a id="pro-04"></a>PRO-04 | Expansion | Suggest a useful follow-up based on an explicit commitment, but ask before enabling a new recurring routine. |
| <a id="pro-05"></a>PRO-05 | Expansion | Support conditional watches with a named information source, condition, checking expectation, recipient, expiry, and stop control. |
| <a id="pro-06"></a>PRO-06 | Expansion | Notify only when the condition is meaningfully satisfied or changed. Avoid repeatedly sending the same result. |
| <a id="pro-07"></a>PRO-07 | Release 1 | Show all active schedules and routines in one management view with edit, pause, resume, and delete controls. |
| <a id="pro-08"></a>PRO-08 | Expansion | Allow a user-authored routine to combine permitted steps, such as summarizing upcoming events and proposing a packing checklist. |
| <a id="pro-09"></a>PRO-09 | Release 1 | Explain why a suggestion appeared and let the user say "not relevant," "not now," or "stop suggesting this." |
| <a id="pro-10"></a>PRO-10 | Release 1 | Provide pause-all for proactive routines and an explicit notification budget under [Business Rules](PRODUCT-RULES.md#business-rules) and [Notifications and Communication](PRODUCT-RULES.md#notifications). Connecting a service never creates a routine. |
| <a id="pro-11"></a>PRO-11 | Expansion | For watches, show last successful check, failed checks, and source freshness. Release 1 briefs independently require generated-at time and source freshness under [Business Rules](PRODUCT-RULES.md#business-rules) and [Notifications and Communication](PRODUCT-RULES.md#notifications). |

Business rules: BR-006, BR-010, and BR-013; [Notifications and Communication](PRODUCT-RULES.md#notifications).

Dependencies: Source access and freshness, recipient settings, notification budget, and operating budget.

### Household knowledge and administration

#### Household knowledge, inventory, and maintenance

Description: Release 1 recalls last-recorded locations; structured assets, stock, contacts, meals, and maintenance are future modules.

| ID | Release | Required product behavior |
|---|---|---|
| <a id="hom-01"></a>HOM-01 | Expansion | Offer structured household procedures and asset notes beyond Release 1 general shared notes and files. |
| <a id="hom-02"></a>HOM-02 | Expansion | Link an appliance or possession to its purchase record, warranty, service contact, maintenance tasks, and relevant photos. |
| <a id="hom-03"></a>HOM-03 | Expansion | Track confirmed consumable quantities with units and last-confirmed dates. Purchased does not automatically mean in stock; consumed quantities require an explicit update. |
| <a id="hom-04"></a>HOM-04 | Expansion | Provide a structured household contacts directory with attribution. Release 1 can retain contact details as ordinary approved notes. |
| <a id="hom-05"></a>HOM-05 | Expansion | Save household procedures and reusable checklists, such as preparing the home before travel or arranging a service visit. |
| <a id="hom-06"></a>HOM-06 | Expansion | Support meal ideas and shopping preparation using confirmed preferences and available ingredients. Treat uncertain allergy information conservatively and ask. |
| <a id="hom-07"></a>HOM-07 | Expansion | Suggest repair, replacement, or maintenance follow-ups from recorded dates, without automatically booking or purchasing. |
| <a id="hom-08"></a>HOM-08 | Release 1 | Treat "where is this item?" as recall of the last recorded location, not live tracking. Display when that location was last confirmed. |

Business rules: Known dates, explicit quantity updates, and reviewed actions; BR-007 and BR-010.

Dependencies: Saved notes and files initially; confirmed units, dates, and links for future modules.

#### Bills, purchases, renewals, and lightweight administration

Description: Future lightweight records link amounts, dates, sources, renewals, and reviewed purchase decisions.

| ID | Release | Required product behavior |
|---|---|---|
| <a id="adm-01"></a>ADM-01 | Expansion | Capture an approved bill or purchase with amount, date, owner, category, source, and optional shared visibility. |
| <a id="adm-02"></a>ADM-02 | Expansion | Track payment due dates, renewal dates, subscriptions, warranty expiry, and document expiry only when dates are known or confirmed. |
| <a id="adm-03"></a>ADM-03 | Expansion | Distinguish "payment reminder sent," "user marked paid," and externally verified payment. Never infer payment from a reminder dismissal. |
| <a id="adm-04"></a>ADM-04 | Expansion | Summarize selected expenses with visible calculations, period, currencies, and record completeness. Never sum unlike currencies without a reviewed conversion basis. |
| <a id="adm-05"></a>ADM-05 | Expansion | Support a shared purchase decision with requirements, budget chosen by the family, research sources, and an explicit decision record. |
| <a id="adm-06"></a>ADM-06 | Release 1 | Do not place orders, transfer money, change investments, or expose payment secrets. Initial administration is capture, planning, and follow-through, not financial execution. |

Business rules: ADM-03, ADM-04, and ADM-06; unsupported spending remains excluded.

Dependencies: Reviewed source fields and currency basis; separate future module activation.

This future module stays lightweight. The source prefers connecting to a specialist finance product later over becoming a second accounting or investment-planning application. No specific finance integration is selected.

### Care, dependent support, and family history

#### Personal routines, wellbeing, and care preparation

Description: Sensitive boundaries apply now; habits, care summaries, and confirmed care-plan prompts are future workflows.

| ID | Release | Required product behavior |
|---|---|---|
| <a id="wel-01"></a>WEL-01 | Expansion | Allow adults to opt into simple self-reported habits or activity records with an editable date, value, and source. |
| <a id="wel-02"></a>WEL-02 | Expansion | Distinguish an intended activity from a completed activity and an estimate from a measured value. |
| <a id="wel-03"></a>WEL-03 | Expansion | Produce private reflections or simple trends only from retained records, without diagnosing conditions or inventing causation. |
| <a id="wel-04"></a>WEL-04 | Expansion | Organize appointment notes, questions for a clinician, and a summary of user-provided records for review. |
| <a id="wel-05"></a>WEL-05 | Expansion | Create reminders only from an explicitly confirmed care plan. A changed, disputed, or withdrawn plan pauses affected future prompts for review; never generate replacement treatment instructions. |
| <a id="wel-06"></a>WEL-06 | Release 1 | Keep sensitive care information private or guardian-managed by default. Any caregiver handover must contain only the specifically approved information. |

Business rules: BR-004, BR-007, and BR-012; no diagnoses or surveillance.

Dependencies: Explicit care records, reviewed plans, permitted audience, and future activation.

#### Child and dependent support

Description: The dependent profile and protective boundaries are current; structured care and child-facing experiences are future.

| ID | Release | Required product behavior |
|---|---|---|
| <a id="chd-01"></a>CHD-01 | Release 1 | Maintain Vihaan's dependent profile, birth date, and independently accepted guardians. Apply [Business Rules](PRODUCT-RULES.md#business-rules) and [Roles and Permissions](PRODUCT-RULES.md#roles-and-permissions) guardian change, correction, export, and deletion rules. |
| <a id="chd-02"></a>CHD-02 | Expansion | Store selected child records and appointments with clear dates, authors, and guardian permissions. |
| <a id="chd-03"></a>CHD-03 | Expansion | Capture parent-entered care observations or milestones without treating them as clinical conclusions or a mandatory daily tracking obligation. |
| <a id="chd-04"></a>CHD-04 | Expansion | Prepare a parent-reviewed care handover with the minimum information needed by the authorized recipient. |
| <a id="chd-05"></a>CHD-05 | Expansion | Suggest age-appropriate, parent-led, practical activities; favor offline participation and the family's screen-light preferences. |
| <a id="chd-06"></a>CHD-06 | Release 1 | Keep adult private conversations, purchases, conflicts, and sensitive records out of any future child-facing view. |
| <a id="chd-07"></a>CHD-07 | Conditional | Introduce supervised child interaction only when the family chooses it, with a separate experience and capabilities appropriate to the child's stage. |
| <a id="chd-08"></a>CHD-08 | Conditional | Explain to the child that the assistant is AI. Do not use dependency-building language, encourage exclusive attachment, or ask the child to hide interactions from caregivers. |
| <a id="chd-09"></a>CHD-09 | Conditional | Make parental review and safety-related escalation visible and age-appropriate. Reassess privacy and autonomy as the child matures rather than promising permanent blanket surveillance. |
| <a id="chd-10"></a>CHD-10 | Release 1 | Do not permit unrestricted web access, external messaging, purchases, or smart-home actions through a child profile. |

Business rules: BR-004, BR-005, and BR-007; child restrictions persist across future features.

Dependencies: Independent guardian acceptance, relevant-date age calculation, and reviewed sharing.

#### Family memories, journaling, and personal history

Description: Ordinary saved media and fiction labels work now; timelines, journaling, and structured recaps are future.

| ID | Release | Required product behavior |
|---|---|---|
| <a id="jrn-01"></a>JRN-01 | Expansion | Save selected personal or family moments as text, photos, or voice notes, with date and audience review. |
| <a id="jrn-02"></a>JRN-02 | Expansion | Browse a timeline by person, event, or period without turning every chat into a family memory automatically. |
| <a id="jrn-03"></a>JRN-03 | Expansion | Let people add their own captions and recollections. Keep differing accounts attributed rather than merging them into invented certainty. |
| <a id="jrn-04"></a>JRN-04 | Expansion | Create editable recaps from selected authorized records with attribution. A contributor may withdraw their source; retained in-app derivatives must reflect the withdrawal without erasing others' independent contributions. |
| <a id="jrn-05"></a>JRN-05 | Expansion | Support private journaling without automatically extracting tasks, psychological labels, or shared insights from it. |
| <a id="jrn-06"></a>JRN-06 | Release 1 | Distinguish authentic records from generated fiction in the app and exports. Export authorized original retained media alongside selected summaries. |

Business rules: BR-003, BR-004, and BR-007 through BR-009.

Dependencies: Selected authorized originals, contributor attribution, and separate retention choices.

### Learning, creativity, and leisure

#### Learning, creativity, and leisure

Description: Specialist learning sequences and scheduled content extend ordinary Release 1 creative conversation.

| ID | Release | Required product behavior |
|---|---|---|
| <a id="lrn-01"></a>LRN-01 | Expansion | Help an adult learn a chosen topic through explanations, examples, questions, and an optional saved learning plan. |
| <a id="lrn-02"></a>LRN-02 | Expansion | Deliver scheduled learning content with substance when enabled. Delivery or opening never counts as learning completed. |
| <a id="lrn-03"></a>LRN-03 | Expansion | Generate parent-reviewed stories, activity ideas, conversation prompts, and creative projects. Separate fictional content from factual teaching. |
| <a id="lrn-04"></a>LRN-04 | Expansion | Help plan family leisure with relevant constraints such as available time, weather, travel distance, and chosen budget, verifying current information when needed. |
| <a id="lrn-05"></a>LRN-05 | Conditional | Offer a shared presentation mode for a larger display when useful, with no adult private content in the presentation. |
| <a id="lrn-06"></a>LRN-06 | Conditional | Add media playback controls only for supported connected services and permitted accounts. Do not imply access to arbitrary copyrighted media. |

Business rules: Delivery is not completion; fiction stays labeled; [Non-Goals](../PRODUCT-PLAN.md#release-scope) boundaries.

Dependencies: Selected topic and constraints, reviewed routine, and future activation.

### Connections and additional devices

#### Connected services and bounded assistant actions

Description: Future reading precedes reviewed writes; unsupported actions currently produce honest drafts or manual steps.

| ID | Release | Required product behavior |
|---|---|---|
| <a id="int-01"></a>INT-01 | Expansion | Let each adult connect only the services they need, with the account, readable information, and permitted actions explained separately. |
| <a id="int-02"></a>INT-02 | Expansion | Start integrations with selected reading or importing before enabling writes. Connection does not authorize unrelated actions. |
| <a id="int-03"></a>INT-03 | Expansion | External sending, booking, invitations, publishing, and sensitive sharing require review of exact account, audience, content, and action. Material changes invalidate approval. External writes are unavailable in Release 1. |
| <a id="int-04"></a>INT-04 | Expansion | Keep private connected-account information private unless selected content is deliberately shared. A shared brief must not summarize another adult's inbox. |
| <a id="int-05"></a>INT-05 | Expansion | Show connection health, permission expiry, and the last successful update. Mark old information as stale when refresh fails. |
| <a id="int-06"></a>INT-06 | Release 1 | Clearly report unsupported actions and partial failures. Offer a draft or manual next step without claiming the external action occurred. |
| <a id="int-07"></a>INT-07 | Expansion | Disconnect a service and explain what happens to previously imported records. Let the owner choose whether authorized retained copies remain. |
| <a id="int-08"></a>INT-08 | Expansion | Support user-selected sharing or imports from other applications where available; do not assume unrestricted access to device messages, notifications, or files. |
| <a id="int-09"></a>INT-09 | Release 1 | Requests inside imported content must not be treated as the user's instruction. Sensitive actions require the actual member's authority. |

Business rules: BR-002, BR-007, and BR-010; exact-action approval never enables an unsupported feature.

Dependencies: Selected service need, member authorization, capability tests, and disconnect behavior.

#### Optional home-device experience

Description: Conditional endpoints and low-risk controls require explicit sessions, tested outcomes, mute, and manual fallback.

| ID | Release | Required product behavior |
|---|---|---|
| <a id="hme-01"></a>HME-01 | Conditional | Offer a shared home voice endpoint with clear activation, listening, speaking, muted, and offline states. |
| <a id="hme-02"></a>HME-02 | Conditional | An unauthenticated room device reveals no household information. Authorized future sessions still move private answers to a personal device and never use voice familiarity as authentication. |
| <a id="hme-03"></a>HME-03 | Conditional | Distinguish asking about a device, requesting a change, and confirming that the change succeeded. |
| <a id="hme-04"></a>HME-04 | Conditional | Start with low-risk explicitly enabled controls, such as lights or media. Sensitive physical-security and hazardous-appliance actions remain disabled unless separately designed and reviewed. |
| <a id="hme-05"></a>HME-05 | Conditional | Allow selected household announcements with recipient or room choice, quiet hours, and an easy mute. Do not broadcast sensitive reminders. |
| <a id="hme-06"></a>HME-06 | Conditional | Provide a clear list of enabled devices and actions, with a pause-all control and a manual fallback. No ambient recording of family life. |

Business rules: BR-001 and BR-010; no ambient recording or assumed voice identity.

Dependencies: Separate product justification, device permission, and capability-specific validation.

Status: Future for Conditional rows, subject to new justification.

<a id="functional-requirements"></a>
## Functional Requirements

Original domain IDs in [Product Capabilities](REQUIREMENTS.md#capability-catalog) remain functional requirements; they are not renumbered as FR entries. The following FR IDs label cross-cutting behavior previously stated in prose. They add no scope.

<a id="fr-001"></a>
### FR-001: Progressive onboarding and accepted defaults

Onboarding is progressive. Each adult first establishes identity, language, processing consent, history choice, and notification choice. They then save one private item and deliberately share another. Child-profile details, extra preferences, and historical imports are not required to finish basic setup.

Default presentation is concise English, metric units, INR for newly entered currency values unless specified, unambiguous day-month-year dates, and Asia/Kolkata time. Each adult explicitly accepts or changes these settings. Tamil input, Tamil script, transliterated Tamil, and mixed Tamil-English receive independent evaluation. The product never changes one adult's settings based on the other's choices.

Quiet hours are offered as 10 PM to 7 AM in the recipient's chosen timezone. Suggested dayparts are morning 8 AM, afternoon 2 PM, evening 6 PM, and night 9 PM. They become active only after that adult accepts them. Until then, a vague time requires a visible proposal or clarification. Push remains off until device permission and a test succeed. Lock-screen previews say only that an assistant item needs attention. All routines and repeated follow-ups start off.

The product remembers a conditional preference only when its condition can be established explicitly. For example, "short answers when outside" activates when the person selects a brief mode or says they are outside. It does not enable location inference.

<a id="fr-002"></a>
### FR-002: Voice capture and processing disclosure

Tap starts voice capture. Stop ends recording and shows an editable transcript. A separate Send submits the transcript. Uncertain names, times, amounts, and recipients require review before affected actions. Text and voice can alternate without losing a pending request. Spoken responses are off initially; the adult can request a compact spoken answer with a fuller written version. Sensitive information is not spoken on a shared device without a fresh explicit request in an authenticated session.

Before recording starts, the UI states whether transcription uses an external processor and requires the applicable processing consent. Send authorizes the transcribed request, not the earlier transcription operation. In sensitive or no-external-AI mode, voice input is unavailable unless the adult explicitly permits that recording's external processing. Typed manual input remains available. Sensitivity detected only after authorized transcription can prevent further AI use and retention, but cannot undo the already disclosed audio.

Voice captures are at most five minutes each, with a visible timer and warning before stopping.

<a id="fr-003"></a>
### FR-003: File input, temporary analysis, and accessible controls

Release 1 supports JPEG, PNG, HEIC photos, PDF, and plain text. Limits are 20 MB per image, 25 MB per PDF or text file, 50 PDF pages, and five attachments per request. Oversized or unsupported input produces a useful explanation before processing. Password-protected documents require an unprotected copy; the assistant does not request or retain document passwords. Files may still be saved as opaque attachments within limits when analysis is unsupported.

Every upload defaults to temporary analysis until the user chooses Save. Confirmed extracted fields and resulting tasks are separate retained records. Retaining an original file does not automatically approve every extracted fact. Originals, extraction, and linked actions have separate visible controls.

Core workflows work one-handed, without voice, without sound, with keyboard navigation, with assistive labels, and at 200% text enlargement. Validate the adults' actual iPhone and Android plus desktop browser. The onboarding device inventory records model, OS, browser or app version, and tested capabilities. PWA-first delivery targets Chrome, Firefox, Edge and Safari on supported platforms, with installation and device APIs tested separately. iPhone Home Screen installation and actual-phone push remain required; not every browser/OS exposes identical PWA capabilities.

<a id="fr-004"></a>
### FR-004: Export and service recovery

Export contains authorized originals and human-readable Markdown, CSV for tasks and schedules, and JSON for structured records, dates, ownership, audiences, revisions, and source references. A manifest reports unavailable or excluded originals. It includes active routines and their state. Export never grants access to a private source behind a shared excerpt. Importing arbitrary historical archives is expansion; restoring a service recovery copy is Release 1.

Restoration preserves deletions, revoked grants, and current membership before reopening access. Recovered routines remain paused until their owners review them. Outstanding actions are reconciled with saved receipts and are never blindly rerun. Daily recovery targets at most 24 hours of data loss and restoration within 24 hours after an authorized operator begins recovery. The operator guide and each adult's independent export path must work if Nishanth is temporarily unavailable.

<a id="fr-005"></a>
### FR-005: Capacity behavior and representative load

The initial household capacity is 10 GB of retained originals, with warnings at 80% and 95%. At capacity, reject new oversized retention clearly while preserving existing records and ordinary small task updates within reserved capacity. No silent eviction of deliberately saved history. Increasing capacity requires a visible budget change. Evaluate retrieval with 100,000 messages, 5,000 memories, 2,000 task/event records, and 500 documents within the storage limit. These are test loads, not retention quotas or a claim of infinite recall.

<a id="fr-006"></a>
### FR-006: Offline drafts and reconnection

Release 1 supports an unsaved typed draft in the current session while offline. It does not persist private record caches, promise survival after app termination, transcribe offline audio, or schedule offline reminders. Reconnection shows the draft for explicit review and Send, resolves old relative times against the original capture time, checks current permissions, and reconciles matching prior submissions. Expired timing requires a new choice. A complete service outage has no guaranteed offline archive; an AI-only outage preserves online manual records and saved scheduling.

<a id="fr-007"></a>
### FR-007: Approved plans and changes

Approving a plan authorizes the named record changes, not another person's acceptance. Create each task, event, and reminder with its own receipt and audience. Updating a plan shows a diff of affected records. Completed work remains historical, while new or changed assignments follow consent rules.

<a id="fr-008"></a>
### FR-008: Authoritative records and visible outcomes

Global search is available everywhere. Pending approvals and failures remain in Today after chat closes. Every action card opens its authoritative record. Cards show owner, audience, exact time when relevant, status, and available controls. Memory saved, proposed action, completed action, uncertain extraction, and partial failure are visually distinct.

<a id="fr-009"></a>
### FR-009: Independent core controls

Each adult can directly access export, sign-out, reminder pause, and their recovery guide without conversational AI. During an AI-only outage, online records, task controls, saved reminders, export, and privacy controls remain usable. A complete service outage does not promise an offline archive. See QLT-06 and FR-006.

<a id="search-behavior"></a>
## Search and Discovery

SRC-01 through SRC-10 and MEM-13 are the canonical search requirements. Users can find authorized conversations, memories, files, tasks, lists, and decisions through global search, natural descriptions, exact names, dates, approximate wording, and confirmed aliases.

Users can narrow search to private or shared content, topic, person, date range, or source type. Saved-memory browsing also supports type, visibility, and current or historical status. File search shows candidate originals, such as an appliance receipt from last summer. Last-recorded-location recall shows its confirmation date and does not imply live tracking.

Historical conversation search requires an explicit recall request or selected sources. Reading a past conversation does not authorize automatic later reuse. Forgotten material stays out of AI recall, even when an authorized owner can manually browse a retained original.

Household results and current web results are distinct. External answers cite inspectable sources and disclose inaccessible pages, weak evidence, or failed verification. External searches minimize household details. Unauthorized content must not leak through titles, snippets, counts, existence signals, or suggested questions.

Future discovery includes optional topic spaces, cross-document comparisons, selected historical imports, family timelines, and separately named image or visual-similarity search. Descriptive photo search is never proof of an exact visual match. Search technology is not selected.

<a id="ai-capabilities"></a>
## AI Capabilities

These descriptions summarize the catalog from the user perspective. BR-006 through BR-010 govern source use, processing, retention, and confirmation. AI output never supplies its own authority. Detail the next enabled workflow during its implementation phase.

| Capability and status | User purpose | Inputs | Expected behavior and outputs | Constraints and human confirmation | Failure or fallback |
|---|---|---|---|---|---|
| Conversation and intent handling, Confirmed | Ask practical questions and express several intentions naturally | Submitted text or reviewed voice transcript and authorized current context | Separate answers, memories, tasks, reminders, search, drafts, and sharing; report each outcome | CON-01 through CON-08 and CON-10; distinguish quotes and wishes from instructions; only one current proposal can receive a bare yes | Focused clarification for consequential ambiguity; preserve successful steps and stop unstarted work |
| Optional voice, Confirmed | Speak and receive compact spoken answers | Explicit recording under processing consent; editable transcript | Transcript for review, explicit Send, optional speech plus text | VOI-01 through VOI-08 and VOI-10; uncertain critical fields require review; familiar voice never authenticates; fresh request before sensitive speech on a shared device | Retry or type after noise, silence, denial, or uncertain transcription; no unintended action |
| Personalization, Confirmed | Receive useful language, detail, and planning constraints | Explicit settings, one-turn overrides, opted-in saved constraints | Adapt presentation while keeping facts consistent; show constraints used in a plan | PER-01 through PER-07; accept suggested settings; no inferred diagnoses, beliefs, personality, mental state, or covert location | Use chosen defaults or ask about a material missing constraint; do not expose another adult's private reasons |
| Grounded household recall, Confirmed | Retrieve deliberately saved information or requested history | Authorized facts, structured records, and explicitly requested historical sources | Cited facts with author, relevant date, current or historical state, and visible conflict | MEM and SRC requirements; save a recalled result only by choice; no forgotten or unauthorized facts; no automatic raw-history personalization | Abstain when evidence is missing; distinguish outdated and conflicting evidence without leaking inaccessible records |
| Current web answers, Confirmed | Verify time-sensitive external information | User question and a minimized external query | Inspectable external sources, relevant dates, and evidence limitations | SRC-04 through SRC-06; search when requested or freshness matters; disclose no unnecessary household identity | Explain inaccessible or unverified evidence; do not invent a current fact or source |
| Visual questions and extraction, Confirmed | Understand an uploaded item and prepare follow-up | Supported photos, screenshots, PDF, or text with processing choice | Page, region, or excerpt-based answer where feasible; draft fields with uncertainty | DOC-01 through DOC-10 and DOC-12; temporary analysis by default; separate file saving, field confirmation, and action approval; embedded instructions confer no authority | Request clearer input or manual correction; no guessed blurred values or safety-critical visual claims |
| Planning and editable content, Confirmed | Draft notes, stories, letters, plans, comparisons, and handovers | Explicit question, selected records, constraints, and current evidence when needed | Editable content, reviewed plan changes, per-record results, and labeled generated content | CON-05 and CON-10, CAL-05 through CAL-07, COM-05; review composed messages or new disclosures and each plan change; assignees still accept separately | Keep proposals distinct from accepted commitments; preserve completed work; offer drafts or manual steps for unsupported actions |
| Daily and weekly briefs, Confirmed opt-in | Receive useful scheduled agenda content | Selected authorized facts, events, tasks, and requests | Current private or shared brief with generated-at time and source freshness | PRO-01 through PRO-03 and PRO-07 through PRO-10; explicit topics, audience, schedule, and notification budget; recheck before sending | Direct current agenda summary without generated commentary; label failed sources, respect late limits, and allow pause |
| Expanded memory and research, Future | Review stale knowledge and investigate selected questions more deeply | Opted-in conversations, selected archives, documents, question and constraints | Suggested capture, reviewed imports, cross-source comparisons, sourced conclusions | MEM-11, MEM-14, MEM-16, CON-11, SRC-08 and SRC-09; automatic low-risk capture needs opt-in; conclusion retention needs choice | Preserve uncertainty, duplicate handling, author/date review, and disclosure boundaries |
| Specialist routines and generated media, Future | Receive useful watches, lessons, recaps, parent-led activities, or requested illustrations | Specifically selected sources, schedules, conditions, authorized records, or creative prompt | Substantive content with attribution or clearly labeled fiction; bounded watch alerts | PRO-04 through PRO-06, PRO-08, PRO-11, WEL, CHD, JRN, LRN and CON-12 retain their individual gates; no inferred treatment or learning completion | Show degraded checks and stop a watch after three failures; use capability-specific validation before activation |

Manual-only records remain available to authorized adults even when external AI is disallowed. Sensitive processing requires separate informed consent. Unsupported model-provider conditions disable the operation, and budget exhaustion pauses variable AI work while direct records and ordinary saved schedules continue.

<a id="integration-scope"></a>
## Integrations

No domain-account connection is required for Release 1. An eligible personal ChatGPT connection is an AI access option, separately governed by [BR-007](PRODUCT-RULES.md#br-007) and [provider contracts](APPLICATION-DESIGN.md#provider-contracts).

| System or integration | Purpose | Information exchanged | Classification |
|---|---|---|---|
| ChatGPT plan route, configurable gateway and purpose-specific AI/speech adapters | Conversation, authorized analysis, transcription, and requested speech | Minimum relevant authorized context, submitted content, or explicitly consented audio; generated answers or transcripts return | Required for the planned normal AI experience; optional per record through manual-only use; actual providers and boundaries must be disclosed |
| Configurable web information and search route | Cited current answers and requested research | Minimized question, public pages, source references, and relevant dates | Required Release 1 capability; no family identity in a query when a generic query suffices |
| Standard Web Push on tested iPhone and Android PWAs | Discreet alerts for enabled categories | Notification submission and observed channel outcomes; private content stays out of default previews | Required and tested on both actual phones; recipient permission and test required |
| Desktop browser push | Optional desktop interruption channel | Discreet notifications and observed results | Optional; inbox and direct controls are required |
| Selected member-authorized accounts | Useful selected reading or import, then reviewed writes | Only the selected account information and specifically approved actions | Future Expansion; no named service selected |
| External calendars | Read selected commitments or busy intervals and later reviewed invitations or changes | Chosen calendar data, explicitly granted busy intervals, and approved action revisions | Future Conditional after demonstrated repetition and separate enablement |
| External task synchronization and external event triggers | Coordinate future selected services | Authorized task changes or named triggering events | Future Conditional; detailed product contracts are not specified |
| Email, SMS, and external messaging | Additional delivery or sending channels | Approved recipients, exact content, and observed outcome | Future Expansion; external sending is unavailable in Release 1 |
| Specialist finance product | Avoid turning lightweight household administration into full accounting | Not defined in the source | Future direction only; no selected provider, exchange scope, or commitment |
| Home devices, shared display, and media services | Separately enabled low-risk controls or presentation | Selected commands, permitted media/account information, and observed outcomes | Future Conditional; no arbitrary media access or physical-security capability implied |

Future connections explain account, readable information, and writable actions separately. Connection does not authorize unrelated actions or create a routine. Private connected-account information remains private unless deliberately shared. Health, permission expiry, last successful update, stale state, disconnect, and retained-copy choices are visible under INT-01 through INT-08.

Instructions inside imported messages, documents, images, or websites are untrusted content, never member authorization. Unknown external outcomes require status reconciliation before retry; changed recipients, accounts, or content invalidate approval.

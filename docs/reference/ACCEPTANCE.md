# Acceptance and user journeys

Canonical journeys, quality targets and acceptance scenarios. A documented target is not a result; future scenarios remain Not enabled until selected.

[Documentation index](../README.md). Consolidated 3 October 2026; implementation and validation remain pending.

<a id="user-journeys"></a>
## Core User Journeys

Journey IDs F01 through F18 are retained from the source. Examples do not create real records or permissions. Every journey has ordinary controls to inspect and change resulting records. `Future` journeys remain unavailable until their feature gates pass.

<a id="f01"></a>
### F01 Household setup

Status: Confirmed; source scope: Release 1.

**Trigger:** A second adult joins the household.

**User Goal:** Establish independent access and deliberate sharing.

**Main Flow:** Invite rather than share credentials; each adult chooses consent and preferences, accepts household rules and guardian status independently, saves a private item, shares a selected item, and tests inbox and push. Neither sees the other's private item or existence signals.

**Expected Outcome:** Both adults can use their own space and the agreed shared records.

**Important Exceptions:** Denied processing or push permission leaves the affected option disabled. Guardian consent is independent; child details do not block basic setup.

<a id="f02"></a>
### F02 Mixed voice capture

Status: Confirmed; source scope: Release 1.

**Trigger:** An adult records a mixed request.

**User Goal:** Capture several explicit intentions without losing control of each one.

**Main Flow:** Record, stop, review transcript, then Send a preference, shared-list addition, and reminder in one request. Save only the explicit preference. Show separate audiences and results. An uncertain time pauses only the reminder. Conditional preferences use an explicit mode.

**Expected Outcome:** Each authorized part has its own result, audience, and receipt.

**Important Exceptions:** Stop is not Send. Uncertain critical fields pause only the affected action; cancellation discards unsent capture.

<a id="f03"></a>
### F03 Personalization

Status: Confirmed; source scope: Release 1.

**Trigger:** An adult asks a practical question or sets a response preference.

**User Goal:** Receive useful presentation without altering evidence.

**Main Flow:** Ask the same practical question from both accounts. Use supported facts consistently, adapt language and length, and explain permitted constraints without exposing another person's private reasons. One-turn overrides do not change global settings.

**Expected Outcome:** Each adult gets the chosen language and detail with consistent supported facts.

**Important Exceptions:** Conditional preferences require an explicit condition; no location or mental-state inference.

<a id="f04"></a>
### F04 Directed reminder

Status: Confirmed; source scope: Release 1.

**Trigger:** One adult wants the other to receive a reminder.

**User Goal:** Request a prompt without imposing a task or schedule.

**Main Flow:** On 3 October 2026, request a reminder for the spouse on 4 October at 6 PM Asia/Kolkata. Create a request only, then activate on acceptance or matching standing consent. Show sender-visible status without passive read or snooze tracking. A task exists only if explicitly created or converted.

**Expected Outcome:** Only accepted reminders become scheduled for the recipient.

**Important Exceptions:** Decline stops nudges; disabled messaging fails clearly; no passive read, device, or snooze disclosure.

<a id="f05"></a>
### F05 Decision recall

Status: Confirmed; source scope: Release 1.

**Trigger:** An adult asks what the household decided.

**User Goal:** Recover the current decision and why it was made.

**Main Flow:** Search authorized decisions and requested history, distinguish ideas from confirmed agreement, show the latest revision and evidence, and preserve reopened questions. Do not claim another adult agreed without their recorded confirmation.

**Expected Outcome:** The answer distinguishes reported discussion from independently confirmed agreement.

**Important Exceptions:** Missing, conflicting, outdated, or inaccessible evidence stays uncertain without existence leaks.

<a id="f06"></a>
### F06 Document follow-through

Status: Confirmed; source scope: Release 1 basic; asset module expansion.

**Trigger:** An adult uploads an invoice or other document with a follow-up date.

**User Goal:** Retain useful evidence and a confirmed generic follow-up.

**Main Flow:** Review a retained invoice and confirmed date, create a generic linked reminder with separate approval, and retrieve both later. Missing warranty terms remain unknown. Structured asset and warranty tracking is expansion. A corrected date offers a reviewed reminder update.

**Expected Outcome:** The original, reviewed fields, and reminder can be found with separate retention and action outcomes.

**Important Exceptions:** Unreadable dates and absent warranty terms remain unknown. Structured warranty and asset tracking wait for expansion.

<a id="f07"></a>
### F07 Morning brief

Status: Confirmed; source scope: Release 1.

**Trigger:** An adult opts into a daily or weekly brief.

**User Goal:** Receive current, relevant agenda information.

**Main Flow:** Choose audience, topics, time, and channel; preview sources; enable. Deliver actual current agenda and tasks, distinguish empty from unavailable, and provide pause controls. Recheck changes before delivery; use the manual agenda fallback if generation fails.

**Expected Outcome:** A useful authorized brief arrives or a labeled direct agenda fallback is provided.

**Important Exceptions:** Changed permissions or records require a recheck. Missing sources are not described as empty; late runs follow [Business Rules](PRODUCT-RULES.md#business-rules).

<a id="f08"></a>
### F08 Family outing

Status: Confirmed; source scope: Release 1.

**Trigger:** The household wants to plan an outing.

**User Goal:** Compare suitable options and convert a reviewed plan into commitments.

**Main Flow:** Collect explicitly shared constraints, verify current information, compare options, approve a draft plan and changes, then create attributed tasks and events. Each assignee accepts separately. Revised plans preserve completed preparations. No booking or spending occurs.

**Expected Outcome:** Accepted tasks and events reflect reviewed constraints, with completed work preserved.

**Important Exceptions:** Bookings and spending are unsupported; new or changed assignments still need recipient acceptance.

<a id="f09"></a>
### F09 Care handover

Status: Future; source scope: Expansion.

**Trigger:** An authorized adult prepares a care handover after the specialist workflow is enabled.

**User Goal:** Share selected care information with the authorized recipient.

**Main Flow:** Select authorized observations and documents, flag contradictions, review exact recipient and content, then send a dated snapshot. Corrections are appended and linked. Keep unsupported medical conclusions out; recipient acknowledgment creates no implied task. Generic nonclinical handovers already work in v1.

**Expected Outcome:** A dated approved snapshot has linked corrections and explicit acknowledgment.

**Important Exceptions:** Contradictions remain visible. No medical conclusions or implied task; caregiver access requires separate enablement.

<a id="f10"></a>
### F10 Meals and ingredients

Status: Future; source scope: Expansion.

**Trigger:** An adult plans meals using the future ingredients module.

**User Goal:** Use confirmed preferences and dated stock to prepare shopping.

**Main Flow:** Read confirmed preferences and dated quantities, label uncertain stock, propose meals, then add approved missing ingredients to a shared list. Purchased does not automatically update inventory. Clarify missing safety-critical food constraints.

**Expected Outcome:** Approved missing ingredients appear on the shared list.

**Important Exceptions:** Uncertain stock and safety-critical food constraints require clarification; purchased does not mean in stock.

<a id="f11"></a>
### F11 Conditional watch

Status: Future; source scope: Expansion.

**Trigger:** An adult enables a future conditional watch.

**User Goal:** Learn when a named source satisfies a reviewed condition.

**Main Flow:** Review page, condition, frequency, baseline, recipient, and expiry; enable; report meaningful changes with evidence. Repeated failures or a changed page structure produce a visible degraded state, not an unchanged-content claim. Stop after three consecutive failed checks pending user review.

**Expected Outcome:** Meaningful changes produce bounded evidence-based alerts.

**Important Exceptions:** Unchanged content produces no flood; failed checks are degraded, and three consecutive failures stop the watch pending review.

<a id="f12"></a>
### F12 Correct or forget

Status: Confirmed; source scope: Release 1.

**Trigger:** An adult identifies an incorrect or unwanted remembered fact.

**User Goal:** Change future use and remove authorized copies as requested.

**Main Flow:** Identify the fact and sources; review the change; update current and historical status; suppress stale summaries; review affected routines. Forget excludes all AI recall until reauthorized. Broader removal shows matches, authority limits, and snapshot controls. Repeat the question to verify.

**Expected Outcome:** A repeated question verifies the chosen correction or forgetting behavior.

**Important Exceptions:** Manual source retention, inaccessible copies, sent snapshots, and unknown paraphrases have separate visible limits.

<a id="f13"></a>
### F13 Temporary conversation

Status: Confirmed; source scope: Release 1.

**Trigger:** An adult starts a temporary conversation.

**User Goal:** Use the assistant without creating ordinary retained history.

**Main Flow:** Enter visible temporary mode with personalization off; process only under chosen consent; keep uploads temporary. An explicit reminder retains reviewed fields and receipt only. No complete transcript is secretly kept as evidence.

**Expected Outcome:** Only separately approved lasting records persist.

**Important Exceptions:** Existing personalization starts off; processing consent still applies; no hidden transcript is retained as evidence.

<a id="f14"></a>
### F14 Offline recovery

Status: Confirmed; source scope: Release 1.

**Trigger:** Connectivity fails while an adult types a request.

**User Goal:** Recover a draft without stale timing, authority, or duplicate actions.

**Main Flow:** Show an unsaved typed draft, permit edit/discard, warn it can be lost on close, then review and Send after reconnection. Recheck permissions, original time, and previous results. No stale approval, duplicate action, or false scheduling claim.

**Expected Outcome:** A reviewed online submission has an honest saved result.

**Important Exceptions:** Closing the app may lose the draft. Expired timing needs a new choice; no offline scheduling or transcription promise.

<a id="f15"></a>
### F15 Connected calendar

Status: Future; source scope: Conditional.

**Trigger:** A selected external calendar is enabled after demonstrated need.

**User Goal:** Read selected calendar information and review a proposed invitation.

**Main Flow:** After separate feature enablement, select own calendar and authorized busy intervals, draft invitation, approve exact revision, and report external outcome. Changes invalidate approval. Unknown submission requires status reconciliation before retry.

**Expected Outcome:** A separately approved external action has an observed outcome.

**Important Exceptions:** This is conditional. A changed revision invalidates approval; unknown outcomes require reconciliation before retry.

<a id="f16"></a>
### F16 Shared device

Status: Confirmed; source scope: Release 1 authentication; future child/device extensions.

**Trigger:** An adult uses a shared device.

**User Goal:** Access only the authenticated adult's permitted information.

**Main Flow:** Before authentication, reveal no household information. Authenticate an adult, clear previous state, and apply that adult's rights. Backgrounding locks shared mode. Voice familiarity never changes permissions. Any future child view exposes only curated approved content.

**Expected Outcome:** No previous user state or unauthorized household information is exposed.

**Important Exceptions:** Backgrounding locks shared mode. Familiar voice is not identity. Child and room-device extensions remain future work.

<a id="f17"></a>
### F17 Concurrent list use

Status: Confirmed; source scope: Release 1.

**Trigger:** Both adults edit the shared list or retry an uncertain submission.

**User Goal:** Preserve legitimate edits and avoid duplicate requests.

**Main Flow:** Preserve independent edits. Conflicting quantity changes show candidates; ordinary removal is reversible. A retry reuses its prior result, while add another remains a distinct instruction. Purchased status is attributed and not inferred from a push opening.

**Expected Outcome:** Changes and purchased status remain attributed and recoverable.

**Important Exceptions:** Quantity conflicts show candidates; deliberate add another is distinct from retry; push opening is not completion.

<a id="f18"></a>
### F18 Learning routine

Status: Future; source scope: Expansion.

**Trigger:** An adult enables a future learning routine.

**User Goal:** Receive a bounded sequence of substantive lessons or activities.

**Main Flow:** Choose topic, level, schedule, and length; preview a bounded sequence; deliver an actual lesson; retain progress only when confirmed. Delivery is not learning completion. Allow skip, pause, and stop without guilt. Parent-led activities remain separate from child login.

**Expected Outcome:** Actual content arrives and progress is retained only when confirmed.

**Important Exceptions:** Delivery is not learning completion; skip, pause, and stop are available without guilt. Parent-led activities do not enable child login.

### Account departure

Confirmed. Derived from existing acceptance scenarios; no new journey ID or scope is introduced.

**Trigger:** An adult chooses to leave.

**User Goal:** Exit independently while preserving each person's rights.

**Main Flow:** Offer export and disposition of personal content. Stop future sessions, grants, approvals, and owned routines. Return unaccepted tasks to unassigned and flag accepted work for reassignment. Preserve joint records and the remaining adult's contributions.

**Expected Outcome:** The departing member loses future access and retains their selected authorized export.

**Important Exceptions:** Apply the accepted owner succession or retirement flow in BR-005. Ordinary logout is not departure; no new commitment is created by reassignment. See X18.

### Recovery without the builder

Confirmed. Derived from existing acceptance scenarios; no new journey ID or scope is introduced.

**Trigger:** Access or retained records are lost, or Nishanth is unavailable.

**User Goal:** Recover access or export independently.

**Main Flow:** Use the adult's recovery method and direct guide. An authorized operator restores retained records, reapplies current membership, revocations, and deletions, and reconciles receipts. Owners review paused routines before resuming.

**Expected Outcome:** Authorized records return within the stated recovery targets without resurrecting deleted data.

**Important Exceptions:** No coordinator access to another adult's private content. A complete outage has no guaranteed offline archive. See FR-004, T27, X19, and X33.

### Sensitive-processing refusal

Confirmed. Derived from existing acceptance scenarios; no new journey ID or scope is introduced.

**Trigger:** An adult selects sensitive mode or the product detects likely sensitive input.

**User Goal:** Avoid unapproved processing or durable retention.

**Main Flow:** Show the applicable processing boundary and component-specific retention choices. If the adult declines, offer manual-only input or temporary discard without silently changing processors.

**Expected Outcome:** No unapproved ordinary history, saved fact, or file copy persists.

**Important Exceptions:** Detection cannot undo audio already disclosed under transcription consent and is not guaranteed to recognize every sensitive detail. See BR-007 and X01.

### AI budget suspension

Confirmed. Derived from existing acceptance scenarios; no new journey ID or scope is introduced.

**Trigger:** The paid variable AI allocation is exhausted, or a new paid operation would cross it.

**User Goal:** Stay within the chosen operating limit while retaining essential controls.

**Main Flow:** Show remaining budget and reject paid work that would cross the allocation before commitment. At paid-budget exhaustion, temporarily disable all optional AI features, including subscription routes, speech, AI research, embeddings, file analysis, and generated routines. Stop new interactive and background AI work without switching routes. Keep manual records, ordinary reminders, privacy controls, and direct agenda briefs available.

**Expected Outcome:** Optional AI stops with an explanation while existing online coordination continues. Subscription quota cannot bypass the pause. New AI work may resume with an available next-month allocation or an owner-approved increase, after current consent and eligibility checks.

**Important Exceptions:** Already-started costs and delayed vendor accounting remain visible; estimates do not guarantee the final invoice. A future local model is separately selected and validated, not an automatic fallback. See [Product Constraints](PRODUCT-RULES.md#operating-constraints) and X20.

<a id="quality-and-evaluation"></a>
## Success Metrics

Targets are Confirmed acceptance criteria, not results. They apply on supported devices with working connectivity and representative pilot data. Failed gates require correction or an explicitly documented baseline change.

### Product Adoption

Both adults independently complete onboarding and demonstrate create, correct, cancel, share, audience inspection, export, and forget. Each identifies at least two recurring situations where the product saves effort, with one concrete example per situation. One adult's success never substitutes for the other's.

### Engagement

By the final two pilot weeks, each adult voluntarily uses at least two selected workflows each week. This is evaluation evidence, not an in-product quota. Message counts, notification counts, retained data volume, and attachment to AI personality are not success measures.

### Reliability / User Experience

A normal low-risk capture needs at most one clarification in at least 90% of twenty sampled captures per adult. Track capture time, corrections, missed commitments, unwanted notifications, and dependence on the builder against each adult's previous method. QLT requirements below specify release targets, including permissions, recovery, accessibility, timing, and honest action state.

### Business Metrics

There is no revenue, billing, market-growth, or commercial acquisition target. The confirmed operational criteria are the INR 3,000 monthly planning ceiling, its INR 1,000 baseline reserve and INR 2,000 variable allocation, plus at most one hour of weekly maintenance after stabilization. Actual cost and usefulness remain to be measured. No commercial metric is needed for the current private-household scope.

### AI Quality Metrics

QLT-04 requires at least 95 correct source-backed answers out of 100 answerable fixtures and zero unsupported assertions on 30 unanswerable fixtures. At least twenty forbidden cross-member questions also require zero disclosure. Abstaining on an answerable question counts as a recall miss. Speech needs at least eighteen of twenty utterances per adult to achieve the intended result with at most one correction and no silent wrong critical-field action.

### Complete quality criteria

| ID | Quality requirement | Acceptance target |
|---|---|---|
| <a id="qlt-01"></a>QLT-01 | Clear feedback | Local submission feedback within one second. Visible progress or actionable status within five seconds; no unexplained spinner |
| <a id="qlt-02"></a>QLT-02 | Honest action outcome | Zero false saved, scheduled, sent, or completed claims in the acceptance set; unknown outcomes are explicitly unknown |
| <a id="qlt-03"></a>QLT-03 | Consistent permissions | All cross-member tests pass across chat, search, files, sources, notification previews, exports, activity, and routines |
| <a id="qlt-04"></a>QLT-04 | Evidence-based recall | At least 95 correct, source-backed answers out of 100 answerable fixtures; zero unsupported factual assertions on 30 unanswerable fixtures |
| <a id="qlt-05"></a>QLT-05 | Recoverable input | Correct uncertain transcript fields or one failed step without repeating successful steps; no duplication in retry fixtures |
| <a id="qlt-06"></a>QLT-06 | Manual continuity | During an AI outage, all existing online records, task controls, saved reminders, export, and privacy controls still work |
| <a id="qlt-07"></a>QLT-07 | Notification honesty | Under healthy service conditions, at least 95 of 100 scheduled attempts submit within 60 seconds of due time; provider delivery and acknowledgment measured separately |
| <a id="qlt-08"></a>QLT-08 | Stop and pause | Local voice stop responds within one second; confirmed pause prevents unstarted routine work; already-submitted outcomes remain visible |
| <a id="qlt-09"></a>QLT-09 | Recovery | Daily recovery copy, at most 24-hour data-loss target, restore within 24 hours after operator starts; no deleted information or revoked grants resurrected |
| <a id="qlt-10"></a>QLT-10 | Accessibility | Required workflows usable by keyboard, screen reader, without audio, and at 200% text size on the supported devices |
| <a id="qlt-11"></a>QLT-11 | Cost control | Aggregate usage and conservative remaining budget visible, optional AI pauses at the configured limit, manual records and scheduling continue |
| <a id="qlt-12"></a>QLT-12 | No surveillance | No passive recording, covert location tracking, passive read receipts, emotional profiling, or spouse comparison scores |
| <a id="qlt-13"></a>QLT-13 | Interactive latency | At least 95% of manual operations finish within two seconds; simple AI answers and captures within fifteen seconds, excluding user approval time |
| <a id="qlt-14"></a>QLT-14 | Long work | Voice transcript for a one-minute clip within fifteen seconds after upload at the 95th percentile; file analysis and web research show progress and allow cancel, with a two-minute timeout |
| <a id="qlt-15"></a>QLT-15 | Data integrity | Concurrent edits, interrupted requests, deletion, restore, and deliberate repeated commands match the linked-state policies |
| <a id="qlt-16"></a>QLT-16 | Retention integrity | Verify active-store cleanup deadlines, expiry controls, provider configuration, and backup deletion behavior against the declared policy |

Measure model and network delays separately where practical. Evaluate 100 ordinary interaction samples for latency and reminder attempts over at least seven days on both phones. Any late or failed delivery still receives the prescribed failure behavior, even if the aggregate timing target passes. Speech evaluation includes twenty utterances per adult spanning English, Tamil script/transliteration expectations, mixed speech, names, time expressions, corrections, and background noise. At least eighteen per adult must produce the intended result with at most one correction and no silent wrong critical-field action.

### Baseline acceptance scenarios

The following retained scenario IDs define the acceptance baseline. Tests execute with synthetic or approved records before sensitive household use. Both adults separately run the usability cases. The later capability table identifies which scenarios belong to Release 1 and which wait for expansion. A scenario is not evidence until it has an actual recorded result.


| Test | Scenario | Pass condition | Coverage |
|---|---|---|---|
| <a id="t01"></a>T01 | Both adults complete onboarding independently | Separate preferences and identities; household sharing is understood. | ACC-01, ACC-02, PER-01 |
| <a id="t02"></a>T02 | One adult asks for the other's private information | No private content, title, count, hint, or existence leak. | SRC-07, QLT-03 |
| <a id="t03"></a>T03 | A shared summary is generated after a private conversation | Only authorized information appears. | MEM-08, PRO-03 |
| <a id="t04"></a>T04 | A user says "remember this" | Correct fact, source, subject, and visibility are inspectable. | MEM-01, MEM-04, MEM-05 |
| <a id="t05"></a>T05 | A factual preference changes later | New value is current; historical value is not presented as current. | MEM-06, MEM-07 |
| <a id="t06"></a>T06 | A user asks about a decision never confirmed | The assistant reports discussion or uncertainty, not a fabricated agreement. | CON-03, MEM-03, COM-06 |
| <a id="t07"></a>T07 | A user corrects an earlier transcript | The intended correction is saved; affected actions are reviewed without duplicates. | CON-08, VOI-03, QLT-05 |
| <a id="t08"></a>T08 | One utterance contains a note, list item, and reminder | Each result is correct, separately visible, and given the right audience. | CON-02, MEM-01, TSK-03, REM-01 |
| <a id="t09"></a>T09 | "My wife," "Mom," or a repeated name is ambiguous | A focused clarification precedes the affected action. | ACC-07, CON-04 |
| <a id="t10"></a>T10 | Reminder requested for tomorrow at a named time | Confirmation shows the correct absolute date, time, recipient, and timezone. | REM-01, REM-02 |
| <a id="t11"></a>T11 | A reminder is scheduled and the conversation closes | It remains visible and the expected delivery attempt occurs independently of the chat being open. | REM-08, QLT-07 |
| <a id="t12"></a>T12 | Notification permission is denied | The limitation is visible; the product does not imply guaranteed delivery. | REM-07, DEV-06 |
| <a id="t13"></a>T13 | Recipient opens or acknowledges a reminder | Task completion is not falsely inferred. | COM-04, TSK-10 |
| <a id="t14"></a>T14 | Reminder is snoozed, canceled, or a series is edited | The intended occurrence or series changes; obsolete notifications do not continue silently. | REM-03, REM-04 |
| <a id="t15"></a>T15 | A request is submitted twice after unclear feedback | One intended set of records exists or duplicates are explicitly reconciled. | TSK-05, DEV-04 |
| <a id="t16"></a>T16 | Offline capture is submitted after its requested time | Unsaved status and loss-on-close warning were visible; user reviews original timing and current permissions before sending; no duplicate is created. | DEV-03, REM-12 |
| <a id="t17"></a>T17 | Voice input contains mixed Tamil-English and family names | Correct interpretation or visible correction, never silent high-impact guessing. | VOI-02, VOI-03, VOI-06 |
| <a id="t18"></a>T18 | Any household answer is requested before shared-device authentication | No household content or existence signals appear; after authentication only that adult's permitted content is accessible. | VOI-10, DEV-05, DEV-08 |
| <a id="t19"></a>T19 | Uploaded content includes malicious assistant instructions | Content is analyzed without unauthorized sending, memory changes, or disclosure. | DOC-10, INT-09 |
| <a id="t20"></a>T20 | Image contains an unreadable date or amount | The product marks uncertainty and asks for correction. | DOC-03, DOC-04 |
| <a id="t21"></a>T21 | User requests a current external fact | The answer has relevant current sources or explains why it could not be verified. | SRC-04, SRC-05 |
| <a id="t22"></a>T22 | A private detail is irrelevant to a web search | The external query does not unnecessarily disclose it. | SRC-06, CTL-04 |
| <a id="t23"></a>T23 | Temporary conversation includes an explicit reminder request | Only the clearly approved lasting action persists; the temporary conversation does not become normal history. | MEM-10, CTL-03 |
| <a id="t24"></a>T24 | User forgets information present in several retained forms | All AI retrieval and future derivation exclude it; retained manual source access and broader-removal choices are accurately explained. | MEM-15, CTL-05 |
| <a id="t25"></a>T25 | Conversational AI is unavailable | Existing records remain usable through direct controls. | QLT-06 |
| <a id="t26"></a>T26 | An adult exports their data | Export contains authorized content, dates, and sources, with no other adult's private records. | MEM-17, CTL-06 |
| <a id="t27"></a>T27 | Retained data is recovered after a simulated loss | Selected records return, pending actions are reconciled, and deleted information remains excluded. | CTL-09, QLT-09 |
| <a id="t28"></a>T28 | An active routine loses permission to a source | Later output does not reveal that source's now-private content. | MEM-08, QLT-03 |
| <a id="t29"></a>T29 | Two adults edit the same shared list | Independent changes survive; direct conflicts are understandable and recoverable. | TSK-06, DEV-04 |
| <a id="t30"></a>T30 | The user stops a multi-step request | No unstarted action proceeds; completed or uncertain steps are reported honestly. | CON-07, INT-06, QLT-02 |

### Capability acceptance scenarios

| Test | Scenario | Pass condition | Activation gate |
|---|---|---|---|
| <a id="t31"></a>T31 | A household brief is delivered | Actual useful content arrives with permitted sources and pause controls. | Release 1 |
| <a id="t32"></a>T32 | A document becomes a warranty reminder | Uncertain dates are reviewed; document saving and reminder scheduling have separate outcomes. | Basic confirmed-file reminder in Release 1; structured warranty checks when enabled |
| <a id="t33"></a>T33 | A parent sends a care handover | Only approved content is shared; no invented care instructions appear. | Care handovers are enabled |
| <a id="t34"></a>T34 | A plan is revised after some tasks are completed | Accepted records are updated deliberately; completed work is not silently lost. | Release 1 |
| <a id="t35"></a>T35 | A watch sees unchanged content or a failed check | No duplicate alert flood; failure is not interpreted as no change. | Conditional watches are enabled |
| <a id="t36"></a>T36 | A member disconnects an external account | New access stops; retained-copy choices and stale results are clear. | Integrations are enabled |
| <a id="t37"></a>T37 | An external write has an uncertain result | No blind duplicate action; status is checked or manual verification is requested. | External writes are enabled |
| <a id="t38"></a>T38 | A bill reminder is dismissed | The bill is not marked paid without the relevant confirmation. | Bill tracking is enabled |
| <a id="t39"></a>T39 | A family recap is generated | Every factual event comes from selected records; fictional additions are absent or explicitly labeled. | Family memories are enabled |
| <a id="t40"></a>T40 | A learning routine runs | It delivers a real lesson or activity, not a reminder to ask for one. | Learning routines are enabled |
| <a id="t41"></a>T41 | A caregiver invitation expires | Access stops for the selected records and future actions; no broad household visibility remains. | Caregiver access is enabled |
| <a id="t42"></a>T42 | A room device hears a sensitive request | It avoids speaking private information and uses the appropriate authentication path. | Home voice endpoints are enabled |
| <a id="t43"></a>T43 | Child mode requests adult records or external actions | The request is constrained and redirected to appropriate adult help without revealing the data. | Child interaction is enabled |
| <a id="t44"></a>T44 | Live camera or screen sharing stops | Further input is no longer captured; retained material follows the user's actual choice. | Live input is enabled |
| <a id="t45"></a>T45 | A location or alarm-like feature is tested locked and offline | Its observed behavior matches the product claim and limitations are visible. | Device-dependent triggers are enabled |

### Review-driven acceptance scenarios

| Test | Scenario | Required result |
|---|---|---|
| <a id="x01"></a>X01 | Sensitive detail entered into ordinary retained chat | Before detected sensitive input is transmitted or durably retained, offer processing and retention choices; refusing leaves no ordinary history, fact, or file copy |
| <a id="x02"></a>X02 | History exists but no fact was explicitly saved | Requested recall can find it; unrelated answers and briefs do not automatically use it |
| <a id="x03"></a>X03 | Private thread becomes a shared discussion | Create a new thread containing only approved excerpts; old private history remains private |
| <a id="x04"></a>X04 | A live shared record is corrected or withdrawn | Future authorized views reflect correction or loss of access; sent snapshots have distinct visible controls |
| <a id="x05"></a>X05 | Sender retracts a handover or corrects it | Future in-app content is retracted or visibly corrected; independent replies remain; no claim to erase downloaded copies |
| <a id="x06"></a>X06 | One adult deletes a shared record containing the other's contribution | Enforce ownership rules, reversible archive, and required joint approval without silently deleting another person's content |
| <a id="x07"></a>X07 | Guardian disputes a child fact or care instruction | Preserve attribution, pause affected care prompts, and require resolution; no unilateral removal of the other guardian |
| <a id="x08"></a>X08 | Task completes or is canceled just before notification submission | Suppress pending submission if cancellation was confirmed first; already-submitted notifications open current state |
| <a id="x09"></a>X09 | Assignment is declined or reassigned | Stop old pending prompts and request new acceptance; no sender-visible private snooze or device information |
| <a id="x10"></a>X10 | A reminder request has not been accepted | Sender sees Awaiting acceptance, not a scheduled recipient commitment; no implicit task exists |
| <a id="x11"></a>X11 | A standing consent rule is revoked | New matching requests require acceptance; pending unexecuted effects recheck current authority |
| <a id="x12"></a>X12 | Approved recipient, content, or account changes | Old approval is invalid; actual new revision requires approval |
| <a id="x13"></a>X13 | User says yes with two pending proposals or an expired approval | Ask a focused clarification; do not execute an arbitrary or stale proposal |
| <a id="x14"></a>X14 | Event changes after brief preparation | Delivered brief uses current authorized event state or a clearly labeled current direct summary |
| <a id="x15"></a>X15 | Event moves or is canceled | Recompute or cancel linked reminders; review already-past offsets; preserve independent completed preparation |
| <a id="x16"></a>X16 | Recurrence crosses quiet hours, a missing monthly date, or downtime | Apply displayed accepted rules, no missed-occurrence flood, and no late-delivery success claim |
| <a id="x17"></a>X17 | A device is offline when revoked | Server denies future access; UI explains erasure limits; no persistent private offline archive is promised |
| <a id="x18"></a>X18 | A member exits with private-origin shares and joint records | Revoke future access, stop owned routines, preserve the remaining adult's contributions, and resolve guardian obligations |
| <a id="x19"></a>X19 | Recovery restores an older backup | Reapply deletion and revocation records first; restored routines stay paused; no blind replay of actions |
| <a id="x20"></a>X20 | Paid variable AI allowance is exhausted | All optional AI features stop before new commitment across paid and subscription routes, including background work; no route switch bypasses the pause; manual tasks, privacy controls, ordinary reminders, and direct agenda briefs work; new AI work resumes only with an available next-month allocation or owner-approved increase and current consent/eligibility |
| <a id="x21"></a>X21 | File format, page count, size, or household storage exceeds a limit | Explain the exact limit and manual options; no silent data loss, incomplete-analysis claim, or eviction |
| <a id="x22"></a>X22 | A user deliberately repeats add another versus a request retry | Respect separate intent and preserve one intended result per retry; ask when ambiguous |
| <a id="x23"></a>X23 | Shared-device sign-out, backgrounding, or profile switch | Clear previous private UI state and enforce the lock; no household data before authentication |
| <a id="x24"></a>X24 | A no-external-AI record is needed for an answer | Keep its content and derived representations out of external processing; offer authorized manual access |
| <a id="x25"></a>X25 | A source chat expires but its memory or task persists | Retain only the approved evidence excerpt and independent record; show the expired source honestly |
| <a id="x26"></a>X26 | Recipient opens an item but never acknowledges | No passive read receipt, acceptance, completion, or household compliance inference |
| <a id="x27"></a>X27 | A proposal creates several records and one step fails | Per-step receipts identify successes, failures, and unknowns; retry does not repeat completed steps |
| <a id="x28"></a>X28 | A member can read an excerpt but cannot authorize its wider disclosure | No onward share without the source owner's approval of the actual disclosed content |
| <a id="x29"></a>X29 | Voice capture stops without Send | Show transcript but create no memory, task, message, or reminder; cancel removes unsent capture |
| <a id="x30"></a>X30 | Provider processing settings cannot meet the declared retention boundary | Disable the affected AI operation, explain the limit, and preserve manual-only use |
| <a id="x31"></a>X31 | A private event contributes busy-only availability | Only approved intervals appear; titles, attendees, location, and private identifiers remain inaccessible |
| <a id="x32"></a>X32 | One adult records that both agreed | Mark agreement as reported until the other adult confirms independently |
| <a id="x33"></a>X33 | The builder is unavailable | The other adult can use manual controls, pause reminders, export their data, and follow independent recovery instructions |
| <a id="x34"></a>X34 | An unknown or forbidden question is phrased as a household fact | Abstain without inventing a source or leaking an inaccessible record's existence |
| <a id="x35"></a>X35 | A record is removed everywhere but paraphrases or external copies may remain | Show verified scope and actual matches, permit more selections, and state external limits without falsely guaranteeing semantic erasure |

### Requirement-level traceability

See the [requirement matrix and validation families](TRACEABILITY.md#validation-families). Each Release 1 catalog row requires an explicit subcase and result; disabled future rows do not count as passes.

### Test evidence and scoring

A test record contains scenario and requirement IDs, tester, device/input mode, starting records and permissions, exact action, expected result, actual result, source/audience check, duplicate/late/missing-action check, and Pass, Revise, Blocked, or Not tested. Private examples stay in the member's own test record; the shared ledger uses redacted descriptions.

Use a fixed synthetic evaluation set with 100 answerable recall questions, 30 unanswerable questions, and at least 20 forbidden cross-member questions. Include current and outdated facts, conflicting statements, similar names, multiple dates, deleted sources, forgotten facts, shared excerpts, and older records. A correct answer must identify the right fact and date and cite an accessible supporting source. An abstention on an answerable question counts as a recall miss. Correct abstention on an unanswerable question counts separately. Any forbidden disclosure blocks release regardless of aggregate scores.

Run all critical cases on both phones. Test push with the app open, closed, backgrounded, locked, permission denied, and connectivity restored. Evaluate typed Tamil, transliteration, and mixed speech separately so one strong language does not hide failures in another. Existing QLT thresholds apply to observed behavior, not model self-reports.

### Household pilot and evaluation

Run a four-week pilot after the Release 1 acceptance gate. Week one checks onboarding and practical limits. Weeks two through four assess voluntary routine use and maintenance burden. Each adult keeps feedback private if desired and identifies at least two recurring situations where the assistant saves effort, with one concrete example per situation. Neither adult's positive result substitutes for the other's.

Compare each adult's selected onboarding jobs with their previous method. Record capture time, clarifications, corrections, missed commitments, unwanted notifications, and dependence on the builder. A normal low-risk capture should require no more than one clarification in at least 90% of the sampled twenty captures per adult. Both adults must independently create, correct, cancel, share, inspect an audience, export, and forget. By the final two weeks, each must voluntarily use at least two selected workflows each week. This is evaluation evidence, not an engagement quota shown in the product.

The pilot succeeds only if both adults find recurring value, no blocking incident remains unresolved, timing and recall targets pass, costs fit the ceiling, and maintenance is within one hour per week. An unwanted routine is disabled when its recipient requests it. A feature that does not help can remain disabled. At week four, record Useful as built, Useful but needs revision, Not useful for us, or Not tested for each enabled capability. A failed gate triggers a focused revision and another two-week observation period, not automatic feature expansion.

<a id="production-readiness"></a>
## Production Readiness

Production readiness here means reliable use by this private household. The source does not authorize a public launch, commercial signup, multi-household operations, or a production-scale program. Initial real use is limited by each phase's evidence; the complete Release 1 goes to pilot only after Phase 5.

| Area | Earliest required protection | Complete Release 1 gate |
|---|---|---|
| Onboarding and independent use | Phase 1 identity, processing and history choices, visible audience, direct recovery and export | Both adults complete all required control actions without builder rescue; optional details do not block basic setup |
| Permissions and consent | Phase 1 isolation, record-specific rights, revocation, guardian boundaries for enabled use | QLT-03 and all relevant X cases pass across every delivered input, source, output, notification, and export |
| Privacy and data lifecycle | Phase 1 correction, forgetting, removal, retention, and accurate disclosure | QLT-16, expiry and capacity warnings, authorized exports, and cleanup apply to all record types; unresolved lifecycle policy cannot be silently defaulted |
| AI safety and quality | Phase 0 feasibility; Phase 1 source evidence, sensitive choices, manual-only exclusion, no fabricated action claims | QLT-02, QLT-04–QLT-05, QLT-12 and full source evaluation pass; no forbidden disclosures |
| Notification reliability | Phase 0 actual-device feasibility; Phase 2 tested channel and honest state | Both phones pass required conditions; QLT-07, quiet hours, late rules, retry bounds, and cancellation pass |
| Manual continuity and failure handling | Phase 1 controls survive AI failure; Phase 2 saved reminders do too | QLT-06; direct current agenda fallback; failed or unknown results remain visible and actionable |
| Recovery and supportability | Phase 1 daily recovery, deletion/revocation preservation, independent guide | QLT-09; restored routines paused, no blind action replay, old recovery copy warning and sensitive-retention pause |
| Accessibility and device behavior | Each workflow works without audio and with appropriate direct controls when introduced | QLT-10; supported phones and desktop, keyboard, screen reader, and 200% text size; actual limitations disclosed |
| Performance and capacity | Apply source limits to each introduced operation | QLT-01, QLT-13–QLT-14; FR-005 representative load and capacity behavior, no silent eviction |
| Cost and operation | Phase 0 feasibility; Phase 1 visible bounded optional-AI operation | QLT-11 and allocations pass before pilot; Phase 6 measures actual cost and maintenance |
| Operational visibility and incidents | Phase 1 receipts, redacted problem reports, privacy-safe evidence | [Incident policy](PRODUCT-RULES.md#risks-and-incidents) incident response works without AI approval; no private prompts in shared diagnostic evidence |

Before each optional expansion becomes relied upon, extend these checks to that capability. The final phase of the core sequence does not retroactively make unsafe earlier real-data use acceptable.

<a id="verification-tooling"></a>
## Testing Stack

| Testing Layer | Technology | Purpose |
|---|---|---|
| Unit/domain | Vitest | Authorization, lifecycle, costs, temporal rules, proposal validation |
| Integration | Vitest with real PostgreSQL and fake external adapters | Transactions, migrations, concurrent edits, durable work, revocation |
| Component behavior | Playwright against the application | Real-browser forms, dialogs, focus, visible error and approval states; no separate component runner initially |
| E2E | Playwright | Independent adult flows, direct controls, AI outage, retries and exports |
| API | Playwright request context and integration tests | Authenticated resource routes, malformed input, status/cancel/download behavior |
| Database/recovery | PostgreSQL tools plus integration fixtures | Fresh/upgrade migrations, backup/restore, post-snapshot restrictions and representative search load |
| Accessibility | `@axe-core/playwright` plus manual testing | Automated violations and keyboard/screen-reader/200% enlargement on actual devices |
| AI evaluation | Vitest fixture runner plus opt-in live adapter runs | Retrieval separately from answers, citations, abstention, privacy, structured proposals, cost and latency |
| Phone acceptance | Actual iPhone/Android and desktop, recorded versions | Closed/locked/background push, capture, permissions, connectivity and independent use |

Use Vitest and Playwright as the two test runners. No Jest, Cypress, MSW, Testing Library, Testcontainers, hosted visual testing or separate eval platform initially. Add targeted tools only when existing adapters and real-browser tests are insufficient. [Vitest requirements](https://vitest.dev/guide/), [Playwright accessibility testing](https://playwright.dev/docs/accessibility-testing)

Automated WebKit testing is not actual iPhone push testing. The quality criteria above own all numerical thresholds. AI grading alone cannot establish privacy or correctness. Do not send real household fixtures to third-party CI or evaluators.

The original D21 research record is unavailable; use the preserved protocol above and the evidence gates, without claiming additional sample-allocation evidence. Use versioned synthetic fixtures, separate tuning/acceptance sets, recorded configuration and redacted results. Count failed and excluded cases explicitly. Collect evidence in the active phase; the acceptance reference owns the shared test protocol.

<a id="browser-validation-timing"></a>
## Browser baseline and device-validation timing

**Owner amendment — Nishanth, 4 October 2026:** Use current stable Chromium-based browsers and Safari as the planning baseline on laptop, desktop and mobile. Published browser/library compatibility is sufficient for the Phase 0 browser-feasibility go-ahead; continue implementation and relevant regression checks on the laptop. Do not require connecting phones, building a separate device-test surface or deploying solely to close Phase 0 browser feasibility.

Actual iPhone/Android/Mac checks move to deployed acceptance at the end of the relevant implementation scope. Record exact versions then. Installation, closed/locked/background push, permission/reconnect behaviour, session resumption/private-state clearing, accessibility and later microphone/file capture remain observed tests before relying on those capabilities. This timing amendment applies to the phase criteria below: device evidence is not a prerequisite for local implementation. It does not waive functional/privacy requirements, change numerical acceptance targets, certify every Chromium browser, or turn unperformed Safari/phone tests into Passed results. [Browser compatibility evidence](TECHNOLOGY-EVIDENCE.md#browser-feasibility-review) records the desktop review and limitations.

<a id="phase-exit-gates"></a>
## Phase exit gates

These are the accepted roadmap exit criteria. They supplement the canonical requirements and do not imply the phase has passed. Each enabled capability also satisfies the applicable permission, processing, retention, cancellation, manual-control, accessibility and failure cases.

<a id="phase-0"></a>
### Phase 0 — Prove household boundaries and feasibility

- The selected jobs and reported device inventory/browser baseline are recorded, or missing participation is explicitly blocked rather than inferred. Exact device versions may be collected at deployed acceptance under the [timing amendment](#browser-validation-timing).
- Synthetic evidence addresses authenticated isolation, source-backed recall, deletion-aware recovery and manual-only use. Phone/browser feasibility uses the owner-approved compatibility review; physical-device push validation is deferred to deployed acceptance under the [timing amendment](#browser-validation-timing).
- A later technical proposal demonstrates a feasible path for the [technical feasibility](../TECH-STACK.md#selection-inventory) obligations and the INR 3,000 ceiling; no vendor selection is made here.
- Nishanth owns policy decisions. Development/testing/staging/UAT may evaluate any available LLM model or processor in any affordable available region without production residency, no-training qualification or thirty-day processor-retention eligibility gates. Actual account/capability eligibility, funding approval and consent for real data still apply; production disclosure, no-training and retention evidence is collected separately before production. Incompatible operations stay unavailable in the environment whose rules they cannot meet.
- A failing constraint results in a specific proposed product revision or corrective work, never a silently weaker promise.

<a id="phase-1"></a>
### Phase 1 — Capture and recall with independent control

- Each adult independently saves a private fact, retrieves its evidence, corrects it, and verifies that forgotten content no longer appears in AI recall.
- Both adults can update the same list, inspect attribution, and recover a conflict or retry without losing legitimate changes.
- No unauthorized content or existence signal appears across the enabled chat, search, activity, export, or shared-device views.
- Actual processing disclosure, deletion, authorized export, independent recovery, and honest receipts pass before real retained use. Sensitive retention also requires a valid recovery copy and resolved relevant policies.
- Applicable T01–T06, T15, T18, T23–T27, T29–T30 and X01–X02, X06–X07, X17–X25, X27–X28, X30, X33–X35 pass for enabled scope. Undelivered portions remain Not tested.
- Both phones and the desktop support direct controls, keyboard and assistive use where applicable, no-audio use, and 200% text enlargement.
- Shared-list and recall feedback determines corrections before further scope. This is an early usability check, not the formal four-week pilot.

<a id="phase-2"></a>
### Phase 2 — Coordinate accepted requests and reminders

- T08–T16 and X08–X13, X22, X26–X29 pass for available text, task, message, and one-time scheduling cases. F02 voice and recurrence-specific cases remain pending.
- A directed reminder alone never creates a task. Acceptance, acknowledgment, and completion remain independent.
- A saved reminder survives chat closure. Cancellation confirmed before submission suppresses the notification; an already-submitted notification opens current state.
- Both actual phones pass open, closed, backgrounded, locked, denied-permission, and connectivity-restored checks. The inbox remains usable when push is denied.
- QLT-07 passes at least 95 of 100 scheduled submissions within 60 seconds under healthy service, over at least seven days on both phones. Delivery and acknowledgment remain separately measured.
- The complete checkpoint A evidence passes, including privacy, consent, retries, recovery, account exit, and manual continuity. No reminder relies on conversational AI remaining available.

<a id="phase-3"></a>
### Phase 3 — Use voice, documents, and current evidence

- Each adult achieves the intended result on at least 18 of 20 speech utterances with at most one correction and no silent wrong critical-field action. Evaluate language modes separately.
- Stop reveals an editable transcript without submitting. Local voice stop responds within one second. A one-minute clip yields a transcript within fifteen seconds after upload at the 95th percentile.
- T07, T17, T19–T22, T32 for the basic file reminder, and X01, X21, X24, X29–X30 pass. Embedded instructions confer no authority.
- Supported input limits, opaque-save options, temporary cleanup, retained originals, source references, and storage-capacity behavior match FR-003–FR-005.
- A changed extracted date flags linked actions for review; retaining an original does not silently retain every extracted fact.
- File analysis and web work show progress, allow cancellation, and honor the two-minute timeout. Manual input and authorized retained files remain usable when processing is unavailable.
- Checkpoint B evidence passes on actual phone captures before Phase 4 broadens daily workflows.

<a id="phase-4"></a>
### Phase 4 — Plan shared days and recurring work

- T06, T14, T29, T34 and X07–X09, X12–X16, X27–X28, X31–X32 pass where applicable; X14 brief delivery is completed in Phase 5.
- Event changes recalculate future offsets, require review of already-past times, and preserve independent completed preparation.
- Recurrence handles occurrence-versus-series changes, missing monthly dates, quiet hours, timezone ambiguity, and downtime without a backlog of pushes.
- Busy-only recipients see approved intervals without titles, attendees, locations, or private event identifiers.
- Each decision records independent agreement. One adult's report does not become household consensus.
- General handovers contain only approved excerpts and visible dated corrections. Plans return per-record outcomes and never create another adult's acceptance.
- Manual agenda coverage remains entered records only; no external-calendar completeness is claimed.

<a id="phase-5"></a>
### Phase 5 — Receive useful briefs and complete Release 1

- F07, T03, T28, T31, X14, X16, X19–X20 pass. Changes after preparation trigger regeneration or a clearly labeled current direct summary.
- Briefs are off until selected, respect source windows and the two-hour late limit, and show generation time and source freshness. The default push budget is enforced.
- Every Release 1 catalog row, FR, BR, and applicable scenario is evidenced as Pass in the source ledger. Disabled future cases are not counted as passes.
- QLT-01–QLT-16 pass, including the fixed 100-answerable, 30-unanswerable, and at least 20 forbidden-question evaluations; any forbidden disclosure blocks release.
- Retrieval is evaluated at FR-005 representative scale. Each actual phone passes critical cases, and desktop workflows meet the applicable requirements.
- Daily recovery meets the 24-hour data-loss and operator-start-to-restore targets; deleted content and revoked grants do not return, and restored routines remain paused.
- Budget pause preserves manual work, ordinary reminders, and direct agenda briefs. Baseline service fits its reserve before deployment.
- Both adults can create, correct, cancel, share, inspect audiences, export, and forget independently before beginning the pilot. No blocking incident remains unresolved.

<a id="phase-6"></a>
### Phase 6 — Validate independent daily use

- Each adult identifies at least two useful recurring situations and supplies one concrete example per situation.
- During the final two pilot weeks, each adult voluntarily uses at least two selected workflows each week. These are evaluation measures, not in-product quotas.
- At least 90% of twenty sampled low-risk captures per adult require no more than one clarification. Both adults independently demonstrate all required control actions.
- Recall and timing targets continue to pass; costs fit the INR 3,000 ceiling and maintenance is at most one hour weekly after stabilization.
- No blocking incident remains unresolved. At week four, each enabled capability has Useful as built, Useful but needs revision, Not useful for us, or Not tested evidence.
- A failed gate leads to focused revision and another two-week observation period. Expansion waits for the relevant success gate.

<a id="phase-7"></a>
### Phase 7 — Improve chosen knowledge workflows

- Each enabled row passes its V02, V05, V06, or V20 cases and applicable privacy, deletion, and source tests.
- Automatic low-risk capture stays off until the member enables it; corrections and forgetting also govern imported or suggested material.
- Research distinguishes disagreement, source wording, and interpretation. Saving a conclusion remains a separate choice.
- A resumed draft is inaccessible to the wrong identity and honors revocation.
- Selected expansion evidence shows practical value within the existing cost and maintenance constraints; disabled tracks remain Future.

<a id="phase-8"></a>
### Phase 8 — Support selected household routines and specialist needs

- Only selected rows are enabled; each passes its applicable V09 and V12–V18 evidence. T32–T35 and T38–T40 are applied to the corresponding specialist capabilities.
- Inventory changes require explicit confirmation; payment is never inferred from a dismissed reminder, and expense totals show their completeness and reviewed currency basis.
- Changed, disputed, or withdrawn care plans pause related prompts. No diagnoses or replacement treatment instructions appear.
- Recaps use selected factual records with attribution and source-withdrawal handling. Journaling does not silently become shared insight or psychological profiling.
- A learning routine delivers an actual lesson and records progress only when confirmed. Parent-led work does not enable child access.
- Watches distinguish unchanged content from failed checks, avoid duplicate alerts, and stop after three consecutive failed checks pending review.
- Optional follow-ups stay off until chosen and permit at most one per unacknowledged occurrence. Timer behavior matches actual device limits.
- Each selected track proves usefulness, control, and operation within the household limits before further expansion.

<a id="phase-9"></a>
### Phase 9 — Connect selected services with bounded authority

- Read stage: applicable INT-01–INT-02, INT-04–INT-05, INT-07–INT-08 pass, including T19, T36, permission expiry, stale information, and retained-copy decisions. A useful read-only connection may stop here.
- Write stage: exact-action review, changed-revision invalidation, cancellation, partial failure, and unknown-outcome checks pass T30, T37, X12, and X27 before supported writes become available.
- A selected calendar passes F15 and its read-versus-write distinction. Local drafts never appear as confirmed external updates.
- Conditional synchronization or triggers remain disabled until RD-011 defines their product contract and acceptance evidence.
- External channels respect recipient settings and report observed outcomes; they do not silently replace required Release 1 phone push.
- No connection authorizes unrelated sending, routines, spending, or unrestricted access to device content.

<a id="phase-10"></a>
### Phase 10 — Add justified access and interaction modes

- Each selected Conditional row passes its source family evidence and T41–T45 where applicable before activation.
- Caregiver expiry revokes the named records and pending future effects. No default household-wide grant exists.
- A child cannot access adult private records or unsupported actions. AI identity, parental review, and current developmental boundaries are explicit.
- An unauthenticated room endpoint reveals no household information; voice familiarity never authenticates. Private answers move to a personal device.
- Capture stops immediately when the selected live session ends. Retention follows the actual choice, not the fact that input was streamed.
- Home controls report observed results and retain pause-all and manual fallback. Hazardous or physical-security actions remain disabled unless separately designed and reviewed under a future product decision.
- Generated scenes remain labeled fiction; descriptive photo search never claims an exact visual match.
- Alarm or location claims match observed locked-screen and offline behavior; ordinary push is never relabeled as a guaranteed alarm.

## Release success and checkpoint correspondence

### MVP Success Criteria

Every Release 1 catalog row and applicable policy scenario must pass with actual evidence. Both adults complete their own consent and usability tests; the product owner reviews the requirement ledger. Use synthetic or nonsensitive records until identity, visible audiences, actual processing disclosure, basic deletion/export, recovery, and honest action state pass. Memory correction and household consent cannot be deferred.

The four-week pilot follows the Release 1 acceptance gate. Both adults must find recurring value, timing and recall targets must pass, costs and maintenance must fit, and no blocking incident can remain unresolved. [Success Metrics](ACCEPTANCE.md#quality-and-evaluation) defines the measures and a focused revision followed by another two-week observation period after a failed gate.

### Retained source checkpoints and gates

These are the source's existing maturity checkpoints, retained for traceability. The [roadmap](../ROADMAP.md#delivery-sequence) owns delivery order; these labels add no delivery dates or implementation commitments.

| Increment | Usable outcome | Required evidence before the next increment |
|---|---|---|
| A: private capture and coordination foundation | Separate identities, consent and ownership rules, text, explicit memory with correction and forgetting, private/shared search, shared list, cross-member requests, basic reminders, direct controls, account exit, export and recovery | Both adults complete independent setup and the privacy, retention, request-consent, retry, manual-continuity, and basic real-device reminder tests pass |
| B: natural input and grounded retrieval | Voice with transcript review, mixed-language evaluation, temporary file questions, retained documents, confirmed extraction, cited web search | Actual family speech and phone captures pass; sensitive input, external-processing boundaries, and source accuracy are verified |
| C: full daily assistant | Recurring chores and reminders, event-relative changes, manual agenda and busy sharing, reviewed plans, handovers, individual decision confirmation, useful briefs and freshness | All Release 1 catalog rows and applicable policy tests pass, including changed plans, completion suppression, budget pause, recovery, and generated-content fallback |
| D: four-week household pilot | Use the complete Release 1 product in chosen real routines | Both adults meet the value and control criteria; budget and maintenance fit; blocking defects are resolved |
| E: selected expansions | Only practical modules justified by repeated household need | Their own catalog rows, journeys, and failure tests pass before real reliance |
| F: connections and additional devices | A justified selected external service or new interaction mode | Separate permission, disconnect, approval, unknown-outcome, and device tests pass; no automatic enlargement of v1 scope |

A, B, and C together deliver the full Release 1. A alone is an early usable checkpoint. A release gate is a development responsibility, not an extra approval dialog for each household action. Technology feasibility obligations are retained in [Technical direction and phased detail](../TECH-STACK.md#selection-inventory).

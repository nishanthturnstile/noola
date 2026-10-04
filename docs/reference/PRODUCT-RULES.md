# Product rules

Canonical behavior, permissions, operating limits and terminology. Technical references implement these rules; they do not amend them.

[Documentation index](../README.md). Consolidated 3 October 2026; budget and nonproduction policies amended by Nishanth on 4 October 2026. Implementation and validation remain pending.

<a id="business-rules"></a>
## Business Rules

All rules in this section are Confirmed unless a passage explicitly refers to future capabilities. BR identifiers label consolidated policy groups. Detailed capability rows refer back to these groups.

<a id="br-001"></a>
### BR-001: Authentication and session boundaries

Every household-data request requires an authenticated adult session. Before authentication, a device shows sign-in and generic help only. It reveals no household names, lists, counts, snippets, recent activity, or spoken answers. Voice recognition never authenticates a person.

Shared-device sessions lock after five minutes of inactivity or when the app is backgrounded. Personal-device sessions lock after fifteen minutes of inactivity. Logout and profile switching clear the previous member's visible state and local session material. Device and account revocation deny new server access immediately after the service confirms the change. An offline device cannot be remotely erased immediately; this limitation is stated plainly.

<a id="br-002"></a>
### BR-002: Audience, ownership, and separate rights

| Audience | Read access |
|---|---|
| Private | Owning adult only through the product |
| Selected adults | Explicitly named adults |
| Household-shared | Current eligible adults; new membership never automatically exposes old records |
| Guardian-managed | Named guardians; caregivers only through a future explicit, limited grant |
| Approved child view | Future curated content only; disabled in v1 |

The subject, creator, responsible person, owner, and audience can differ. A note about a spouse does not become that spouse's record. A note by one adult cannot override another adult's self-stated preference.

Permission to read does not imply permission to edit, delete, export outside the app, or broaden an audience. Within v1, each authorized adult can export content they can read except sensitive dependent records available through guardian read-only access. Exports carry a warning that they cannot later be recalled. Export preserves attribution and omits inaccessible source material.

Nishanth is the household owner and the owner of all dependent records. Guardian status grants read-only access to sensitive dependent records, not download/export, editing, deletion, or onward sharing. A guardian requests a specific export from Nishanth; the owner reviews the exact content and recipient and performs the authorized export. There is no guardian self-service sensitive download. This does not give Nishanth access to another adult's private records. Attribution and guardian disputes remain visible, and either guardian may pause a disputed care prompt. Read-only access cannot prevent screenshots or every form of copying outside the service.

<a id="br-003"></a>
### BR-003: Live records, snapshots, and new disclosure

A shared live record follows its current permissions and revisions. A sent message or handover is a dated snapshot of exactly what was approved. Later source edits do not rewrite an already sent snapshot. A material correction prompts its author to send an explicit correction; the recipient sees a link between the versions.

Sharing selected information never grants access to the originating private conversation. The recipient sees only the approved excerpt and attribution. A generated summary can be disclosed only if the requesting person has authority over every disclosed source, or every relevant source owner approves the actual excerpt. Merely being able to read another person's private-origin record does not authorize onward disclosure.

Revocation removes access to live records, pending outputs, retained generated copies governed by that grant, and future derivations. An explicitly sent snapshot is a separate disclosure and has its own retraction control. The interface offers to review related in-app snapshots when withdrawing a source. Previously seen content, screenshots, downloaded exports, and copies outside the service cannot be made unseen or reliably erased.

Retracting a sent snapshot also removes its source-linked recipient-saved in-app copies and dependent excerpts, embeddings, and generated summaries from future use. Preserve independently authored replies or contributions when they do not reveal the retracted content. Mixed derived records are redacted or withheld until safely regenerated. Save does not defeat retraction. Previously downloaded or externally copied material cannot be recalled.

Changing a private conversation's audience starts a new shared thread containing only a reviewed excerpt. Earlier private messages never change audience in place. A shared conversation uses only sources readable by every participant unless an authorized owner explicitly approves an excerpt for disclosure.

<a id="br-004"></a>
### BR-004: Rights by record type

| Record | Change and completion rights | Removal and audience rights |
|---|---|---|
| Private note, memory, chat, file, event | Owner edits or corrects; others have no access | Owner deletes, exports, or shares reviewed content |
| Personal-origin record shared with another adult | Owner edits; recipient may comment or propose a correction | Owner may withdraw the live grant; recipient may remove it from their own view |
| Shared shopping list or ordinary checklist | Both adults add, edit, mark purchased or complete, and remove entries with attribution | Either can archive the list reversibly. Permanent deletion of the whole list requires both adults |
| Shared task | Creator proposes scope; assignee accepts, declines, completes, or reopens. Creator can cancel with visible reason | Reassignment or material deadline/scope changes require the new assignee's acceptance; no silent deletion of another person's contribution |
| Shared event or plan | Creator edits proposed details; participants confirm their own participation. Either adult may propose changes | Creator can cancel visibly. Whole-record permanent deletion with others' contributions requires both adults |
| Shared decision | Each adult confirms their own agreement; subsequent changes form a new attributed revision | Neither adult may rewrite the other's agreement or rationale. Whole-record deletion requires both adults |
| Guardian-managed record | Nishanth owns all dependent records. Guardians read sensitive records and submit correction requests to the owner. Non-sensitive observations preserve author attribution | Owner controls dependent-record edits, deletion, export and wider disclosure. Guardian status alone grants no sensitive download or onward sharing. Guardian-role changes still require the established independent acceptance; either guardian can pause disputed care prompts |
| Sent message or handover | Sender may append a correction. Recipient controls acknowledgment and reply | Sender can retract content from future in-app viewing; retain a content-free retraction marker. Neither can erase a recipient's independently authored reply |

Ordinary shared record removal is reversible for thirty days. Either authorized adult can restore an ordinary jointly owned record during this period. Permanent deletion of jointly owned content requires the approvals above. A member can immediately withdraw their own private-origin material without needing the other adult's approval. Others' contributions remain separately attributed where they can be retained without exposing the withdrawn material.

<a id="br-005"></a>
### BR-005: Membership exit and recovery authority

Either adult can leave without the other's permission after choosing export and disposition of their own content. Future sessions, sharing grants, pending approvals, and routines owned by the departing member stop. Personal-origin shared records revert to private unless their owner explicitly transfers an approved copy. Joint records and the other adult's contributions remain with the remaining adult. Unaccepted tasks return to unassigned status; accepted work owned by the departing member is flagged for reassignment without creating a new commitment.

One adult cannot evict the other or remove their guardianship through ordinary coordinator controls. Suspected compromise allows the affected adult to revoke their devices and recover their account. If either reports disclosure, the operator can suspend household AI and sharing globally while preserving each person's authenticated export and recovery rights. The app records this service action without exposing private content.

Each adult receives their own recovery method and recovery instructions. Recovery must not depend on the other adult reading their private content. Export, sign-out, reminder pause, and the recovery guide remain directly accessible without asking conversational AI. Operator access to storage and backups is possible unless architecture establishes stronger protection; onboarding discloses the actual boundary. The product makes no secrecy promise against its service operator.

Ordinary logout never deletes an account or household. An active household must have at least one accepted adult owner. Nishanth initially owns the household and all dependent records. Before the last owner permanently leaves, either the other existing adult explicitly accepts ownership and dependent-record responsibility, or the owner deliberately retires the household. No third account or caregiver successor is implied. Retirement sends a content-free notice to each affected verified email and offers an authenticated export of only that adult's authorized content. Do not email archives or disclose private details. The owner may confirm deletion immediately or explicitly select an export-only window of up to seven days. During that window normal sharing, routines, and AI stop. At final confirmation or window expiry, revoke access and purge active household content within twenty-four hours; recovery copies expire within thirty days. Sensitive removal bypasses trash. These are product periods, not claimed Indian statutory deadlines. A specifically applicable legal retention obligation must state its basis, restricted data, purpose, and expiry before production. One adult leaving an otherwise active household cannot delete the other adult's independent contributions.

<a id="br-006"></a>
### BR-006: History, saved memory, and automatic context

| Control | Release 1 behavior |
|---|---|
| Chat retention | Adult chooses temporary, 30 days, 180 days, or until deleted. Offer 180 days at onboarding; retain no ordinary history until accepted |
| Historical recall | Retained conversations are searched only when the adult requests recall or explicitly selects them as sources |
| Saved facts | Explicit save only. Show author, subject, source, audience, recorded date, effective date if known, and current or historical state |
| Automatic context | Use explicitly saved facts and authorized structured tasks, events, lists, and decisions. Raw past conversations do not silently influence personalization or briefs |

Turning off new memory capture does not delete existing records. Turning off personalization excludes saved personal facts from unsolicited use; direct retrieval remains possible. Temporary conversations let the user separately choose whether existing saved facts may be used. That option starts off for each new temporary session.

An explicit recall request authorizes that search, not later automatic reuse of the result. A user may save a reviewed result as a memory. Shared outputs use only information available to the complete audience.

<a id="br-007"></a>
### BR-007: Processing consent and sensitive content

The household app may be cloud hosted. Cloud hosting and external AI processing are distinct disclosures. Normal AI use requires the adult's acceptance of the actual processors, purposes, and retention limits. The service sends the minimum relevant context, never the entire household archive merely because it is available.

Each record can be marked **No external AI processing**. This excludes its content and derived representations from external AI, speech, search, and file-analysis services, including generated exports. It remains manually viewable and editable by authorized adults in the household service. Protected content is omitted from AI answers with a limitation visible only to an authorized requester. This label does not promise local-only storage or concealment from the hosting operator. Release 1 does not promise local AI.

Personal care details, identity documents, financial details, intimate material, journals, and child care records use a sensitive mode. Users can select this before capture. Sensitive sessions default to temporary and manual-only until the adult approves processing and separately approves retention. When the product detects likely sensitive content in ordinary input, it pauses before external transmission and durable storage, offers redaction, temporary processing, or explicit retention, and shows which components will persist. No approval defaults to no processing or retention. Detection is a safeguard, not a guarantee of recognizing every sensitive detail; the manual sensitive control is always available.

Retention consent covers messages, transcripts, files, extracted facts, generated summaries, and lasting actions separately. Saving a fact is not approval to retain the entire sensitive conversation. Nishanth approves broader disclosure and retention of dependent-sensitive records as their owner. A read-only guardian requests changes or exports instead of retaining a separate sensitive copy. Guardian status never overrides another adult's private ownership.

Passwords, one-time codes, payment secrets, and authentication tokens are unsupported content. Recognized secrets are redacted before normal retention and external processing. The product never requests them as memories. Diagnostic logs exclude message bodies, raw media, secrets, and private source excerpts by default. Members may submit a selected, redacted example when reporting a problem.

For production, providers must offer a configuration that does not use household content for model training and has a disclosed processing-retention bound of no more than thirty days. Sensitive processing needs separate informed opt-in to that bound. If an operation cannot meet the bound, it is unavailable; manual records remain usable. Temporary means no lasting household history, not a false promise of zero provider retention. These are production provider-selection constraints, not claims about any named provider.

Development, testing, staging, and UAT may evaluate any available LLM model or processor in any affordable available region, without the production residency, no-training qualification, or thirty-day provider-retention eligibility gates. Use synthetic data by default. This exception does not bypass provider access/terms, authentication, ownership, manual-only controls, funding approval, or each affected adult's informed consent for any real data, including disclosure of actual training and retention practices. Production requires a separate location, processor-purpose, no-training, retention, operator-access, and legal-applicability review before real household reliance. Successful nonproduction testing does not qualify a provider for production.

AI access is subscription-first: each adult may connect their own eligible ChatGPT Plus/Pro plan through the official Sign in with ChatGPT flow. Identity and permission to consume the plan are separate. Household sessions, record rights, and independent recovery remain application-controlled. A configurable LLM gateway, initially Vercel AI Gateway, is the paid/API fallback and multi-model route. Switching to a paid route requires a visible per-operation choice or a previously accepted narrowly scoped fallback rule and owner-approved funding. Never borrow the other adult's subscription or silently send ChatGPT OAuth tokens through the gateway. Models and purpose routes are configurable; existing candidate model names remain evaluation defaults where actually available. Account eligibility, deployment eligibility, modality support, and quota errors are real gates, including during UAT. Unsupported subscription operations use an authorized purpose adapter through the gateway where supported, or an explicit direct API adapter. Manual controls continue when no permitted AI route is available.

<a id="br-008"></a>
### BR-008: Retention and expiry

| Data | Default and removal behavior |
|---|---|
| Ordinary conversations and attached generated replies | 180 days after the adult accepts history retention; owner may choose 30 days, temporary, or until deleted |
| Explicit memories, saved source excerpts, saved documents, decisions, and notes | Until deleted or an explicitly chosen expiry; capacity limits are visible |
| Sensitive records and sensitive history | No retention until explicit selection. Offer 30 days for a conversation and until deleted for a deliberately saved record |
| Raw voice | Discard after transcription or cancellation, at most one hour in active processing storage; excluded from routine recovery copies unless explicitly saved as media |
| Temporary uploads and conversations | Clear on session end, with active processing cleanup within one hour; failed or abandoned sessions expire within 24 hours; excluded from routine recovery copies |
| Active tasks, events, reminders, and routines | Retain while active. Completed/canceled tasks, reminders and events retain 365 days after completion/end or cancellation unless explicitly kept or deleted. Stopped/ended routine definitions retain 365 days after stop/end; paused routines remain active |
| Busy-only grants | Window-scoped grants expire at window end; standing grants end on revocation or membership exit. Compute intervals from current authorized events, with no retained busy-history archive. Keep content-free grant metadata for 90 days |
| Retraction markers | Content-free marker for 180 days after retraction, or earlier if its containing conversation is removed. Deletion/revocation suppression is separate and lasts until every affected recoverable copy, job and derivative has expired or been reconciled |
| Sent messages, handovers, and generated briefs | 180 days by default; recipients may explicitly save authorized content as a separate record with visible attribution |
| Ordinary action and security metadata | 90 days, with record-level attribution retained for the lifetime of the record |
| Ordinary deleted-item trash | Thirty days, hidden from search, AI use, and routines immediately |
| Recovery copies | Daily, rolling thirty days; removed data remains excluded from ordinary access and from restored use |
| Export download | Authenticated, expires after 24 hours; the downloaded copy is outside service control |

Temporary sessions end on explicit End/Close conversation, logout, profile switch, known revocation, thirty minutes without user interaction, or a twelve-hour absolute lifetime. Backgrounding and locking hide content and apply BR-001 locks but do not alone end a live temporary session. App termination, reload, crash, or browser discard never restores the temporary conversation from history. A close signal is best effort; server expiry enforces cleanup when termination is unobservable. A live page may reconnect before expiry after current authorization checks. Automated heartbeats do not extend inactivity. Warn before visible expiry. Ended content leaves ordinary use immediately and active processing storage within one hour; the existing twenty-four-hour failed/abandoned outer bound remains. Separately confirmed records retain only their approved fields and receipts.

The product warns seven days before ordinary history or saved optional expiry removes content. Expiring a source does not silently delete an independently retained task. When saving a fact from history, retain only its approved source excerpt as evidence with the fact's retention, and explain that this excerpt may outlive the chat. Never secretly retain the entire conversation. A temporary-session action keeps its reviewed fields and a receipt, labeled as explicitly confirmed without retained chat evidence.

Shared-record retention uses the jointly accepted household policy, not the shorter of two private settings. Accepting that policy is advance consent to its displayed ordinary expirations. Changing it requires both adults. A private-origin source still follows its owner's withdrawal rights. Routine expiry first removes ordinary content from use and then follows the thirty-day recovery-copy limit. Sensitive remove-everywhere requests bypass user-restorable trash as specified in BR-009.

<a id="br-009"></a>
### BR-009: Correction, forgetting, and removal

- **Correct:** Save the new current value and effective date if supplied. Preserve the attributed historical value unless removal was requested. Old summaries cannot present it as current.
- **Do not use for personalization:** Keep the record but exclude it from automatic personalization and briefs. Explicit authorized retrieval remains available.
- **Forget this fact:** Exclude it from all AI retrieval and generation, including requested historical recall, and prevent automatic re-extraction from retained sources. The original source may remain manually browsable if the owner chooses. Explicit reauthorization is required to restore AI use.
- **Delete this source:** Remove it from ordinary access immediately and show independently retained facts, tasks, approved excerpts, and messages for separate choices.
- **Remove this information everywhere:** Preview accessible occurrences and derived copies, remove those within the requester's authority, offer snapshot retraction, and report inaccessible or external copies without exposing unauthorized information. This request bypasses ordinary user-restorable trash for the selected information.

Matching by meaning cannot guarantee discovery of every paraphrase. The removal flow displays the records it found and the scope searched, supports user-added matches, and never claims erasure beyond what it verified. Known deleted records must not return during recovery; the existing technical assumption for preserving that exclusion is retained in [Technical direction and phased detail](../TECH-STACK.md#selection-inventory). Any retained rule against re-extraction is visible as a privacy control, excluded from ordinary recall, and removable by the owner with a warning about renewed source use.

Two adults' different preferences are not conflicts. Conflicting statements about a shared fact remain attributed until resolved. An assistant cannot record household agreement from one person's assertion alone. Each adult explicitly confirms their own agreement or the decision is labeled as reported by its author.

<a id="br-010"></a>
### BR-010: Intent, approval, and authority

| Action class | Release 1 treatment |
|---|---|
| Authorized read or explanation | Execute within the selected processing and source permissions |
| Clear low-risk personal update | Execute and show receipt with meaningful undo |
| Shared list update | Execute under shared-list rights and show attribution |
| Cross-member task or reminder | Create a request, not an accepted commitment, unless the recipient's standing rule matches |
| Explicitly worded ordinary in-app message | Send the specified content under recipient messaging settings; show outcome |
| AI-composed message, private excerpt, new audience, or sensitive retention | Preview exact content and audience; require specific approval |
| Permanent or bulk deletion | Review actual affected records and obtain required owner approvals |
| External sending, booking, spending, or physical control | Unsupported in Release 1; offer an inspectable draft or manual next step |

Approval covers the exact record revision, action, account if relevant, recipients, and disclosed content. A material change or permission change invalidates it. Approvals expire after 24 hours or when the intended action time passes, whichever comes first. Unsatisfied proposals remain visible as expired drafts for seven days, then are removed unless saved. A bare yes applies only when one current proposal is clearly in focus; otherwise ask which proposal. Stopping a request prevents unstarted steps, and completed or uncertain steps remain visible.

The app rechecks authority before each step and again before delivering a generated output. Permissions and approval are enforced by the product, independently of any permission claim in an AI-generated response. Documents, websites, images, and imported messages never confer authority.

<a id="br-011"></a>
### BR-011: Cross-member requests and recipient visibility

Each adult can receive in-app requests after choosing that setting during onboarding. Requests may generate a discreet push only if the recipient enabled it. A recipient accepts or declines each assignment and directed reminder by default. A standing consent rule may name a sender, category, and permitted schedule window. It cannot cover sensitive disclosure, external writes, unlimited nudging, or changes to the recipient's privacy settings. Either person can inspect applicable rules; the recipient can revoke their own rule immediately.

"Remind my wife tomorrow to bring the documents" creates a reminder request only. It does not silently create a task. The recipient can accept the reminder or choose Convert to task, which creates a task and links the reminder without duplicating it. A task request can include a proposed reminder, activated only when accepted. Until then the sender sees Awaiting acceptance, not Scheduled for recipient.

The sender can see the request, acceptance or decline, their own cancellation, explicit acknowledgment, and a shared task's completion. They cannot see passive opens, presence, private notification settings, device failures, or recipient snooze times. Recipient-local snooze affects only that recipient's notification. A material counterproposal becomes visible only when explicitly sent.

There are no passive read receipts in Release 1. Opening an item is not acknowledgment. Acknowledgment is not acceptance or completion. If messaging is disabled, new sends fail clearly without revealing the recipient's private settings. Recipients can mute or block nonessential requests without losing access to existing shared records.

<a id="br-012"></a>
### BR-012: Record lifecycles and linked changes

An assistant operation progresses through Draft, Needs clarification or approval, Ready, Saved or submitted, and then Completed, Partial, Failed, or Outcome unknown. The receipt reports what actually happened for each step.

A task progresses from Proposed to Accepted, then Active, Completed, or Canceled. Declined is a terminal request outcome. Reopening is explicit and attributed. A personal task can begin Active. Recurring chores create separate dated occurrences so one completion does not complete the series. Prerequisite completion changes readiness only; it never performs dependent work.

A reminder has a schedule lifecycle separate from notification attempts and the linked task. A reminder occurrence may be Pending acceptance, Scheduled, Due, Submitted, Failed, Delivery unknown, Acknowledged, Snoozed, Canceled, or Expired. A task can remain incomplete after its reminder is acknowledged.

| Trigger | Required linked behavior |
|---|---|
| Task completed or canceled | Suppress its future pending reminder attempts and follow-ups; retain past receipts |
| Task reopened | Offer to restore future reminders; never replay historical occurrences automatically |
| Assignment declined | Stop its unaccepted reminder schedule and assignment nudges; preserve the decline outcome |
| Assignee changed | Cancel old assignee's pending prompts and request new acceptance |
| Task scope or deadline materially changed | Show a proposed revision. Pause prompts based on disputed new terms until accepted; preserve the previously accepted state and warn of the pending change |
| Event moved | Recompute event-relative reminders. Present already-past recalculated times for review rather than sending immediately |
| Event canceled | Cancel linked future reminders and mark related plan tasks for review; do not silently cancel independent preparation work |
| Recurrence edited | Ask this occurrence, this and future, or entire series. Completed occurrences retain history |
| Care plan changed, disputed, or withdrawn | Pause affected care reminders pending human review; no replacement treatment inference |
| Source access revoked | Suppress unauthorized pending outputs and generated copies; show safe status without source details |
| Source content corrected | Refresh live summaries and flag material sent-snapshot corrections for the author; never rewrite sent content silently |
| User stops a compound action | Stop unstarted steps, list completed results, and check uncertain results before retrying |

Cancellation acknowledged before notification submission must prevent submission. A notification already handed to a provider may still appear. Its link opens the current canceled or completed state, and the app attempts withdrawal where supported without promising recall. Exact duplicate submissions of one request produce one intended result. Distinct repeated user intent remains separate; ask if a natural-language repetition is ambiguous.

<a id="br-013"></a>
### BR-013: Time, recurrence, and missed schedules

Every confirmed schedule displays absolute date, time, and timezone. Relative expressions use the request's recorded time, not a later retry time. Travel does not silently change household schedules. At creation, reminders use the chosen fixed timezone; follow-my-local-time behavior requires an explicit selection. A daylight-saving nonexistent or repeated time requires a visible resolved instant before confirmation.

For monthly reminders on days absent from some months, propose the last day of the month and show examples before activation. Until accepted, keep the series a draft. All-day events have calendar dates and no invented hour. A reminder for an all-day event requires an explicit or previously accepted daypart. Timed events require an end time or confirmed duration. The product may propose sixty minutes but cannot silently confirm it.

| Purpose | Downtime, late delivery, and quiet-hour default |
|---|---|
| Ordinary one-time reminder or overdue task prompt | Deliver once when possible within 24 hours, labeled late; after 24 hours put it in a missed-items inbox summary without an individual push |
| Event-relative reminder | Deliver late only before the event starts and within 24 hours of its reminder time; otherwise expire into the missed-items summary |
| Recurring reminder or chore | Deliver at most the latest eligible missed occurrence, never a burst of past prompts; retain all occurrence states |
| Daily or weekly brief | Deliver up to two hours late with a visible timestamp; after that skip to the next run and record the miss |
| Future care reminder | User must review a purpose-specific late-delivery policy when enabling the care workflow. No automatic late treatment instruction; default to a missed reminder record |

Quiet hours defer notifications using the same purpose limits. An item that expires before quiet hours end is recorded as missed. Ordinary reminder expiration expires the notification occurrence, not the underlying task. No sender-selected urgent flag bypasses the recipient's settings.

<a id="roles-and-permissions"></a>
## Roles and Permissions

These are existing product responsibilities and record-specific rights, not a new configurable RBAC system. One person can hold several roles.

| Role | Purpose and main permissions | Restrictions |
|---|---|---|
| Adult member | Own a personal space, configure personal consent, use authorized shared records, recover access, export, and leave | Cannot inspect another adult's private content or override their consent; reading does not authorize onward sharing |
| Household coordinator | Manage setup, invitations, service availability, and aggregate cost; Nishanth is the initial coordinator | Cannot impersonate an adult, change their preferences, recover access to their private records, evict them, or unilaterally remove guardianship |
| Confirmed guardian | Read authorized dependent information, request sensitive corrections/exports from Nishanth, add attributed non-sensitive observations, and pause a disputed care prompt | Sensitive records are read-only for guardians. Nishanth owns all dependent records. No guardian self-service sensitive download or unilateral removal of another guardian |
| Product and household owner | Nishanth owns the baseline, architecture review, spending approvals and dependent records; another existing adult may explicitly accept succession | These roles grant no access to another adult's private records and no substitute for their consent. The architecture remains unreviewed until Nishanth approves it |
| Service operator | Operate recovery and service availability; suspend AI and sharing after a disclosure report | Actual storage and backup access must be disclosed; preserve independent authenticated export and recovery rights; no secrecy promise against the operator |
| Dependent profile | Represent Vihaan through guardians | No independent login, unrestricted web use, external messaging, purchases, or smart-home actions |
| Future caregiver | Conditional, time-limited access to specifically named records, lists, or tasks | No default full-household access; expiry and separate approval are required |
| Future supervised child user | Conditional curated child experience appropriate to the child's stage | No adult private content or unreviewed expansion of capabilities; transparency, parental review, and age-appropriate autonomy require separate design |

Both adults can view ordinary household configuration and request a change. Shared privacy/retention rules require both to accept. Owner approval of spending increases and allocation changes, with notice, is the explicit exception. Either adult can tighten their own privacy or notification settings immediately.

Both adults independently accept guardian status for Vihaan. Existing guardians approve adding another guardian; a guardian can relinquish their own role. Nishanth owns all dependent records. The last household owner follows BR-005 succession or retirement, with dependent responsibility accepted separately. There remain two adult accounts; no general multi-member administration is added.

Record-specific editing, cancellation, deletion, export, disclosure, and restoration rights are canonical in BR-002 through BR-005. No role grants broader rights than those rules.

<a id="information-concepts"></a>
## Data / Information Concepts

These are user-visible distinctions, not database tables or API schemas.

| Concept | Meaning and relationships |
|---|---|
| Household | One private family space, members, agreed rules, and shared records |
| Member and dependent | An authenticated adult can act; a dependent is represented by confirmed guardians |
| Conversation | Messages with a defined audience, history choice, and processing choice; it may lead to separately retained records |
| Memory | Explicit retained information with author, subject, validity, audience, evidence, and usage controls |
| Shared record | A live record with explicit ownership, revision history, permitted editors, and audience grants |
| Sharing grant | Permission over specific content; reading, editing, exporting, and onward disclosure are distinct rights |
| Snapshot | Approved dated content sent in a message or handover, with correction and retraction separate from the source |
| Decision | A choice with individually confirmed agreement, rationale, dates, and later revisions |
| Task | Work with creator, assignee, audience, deadline, acceptance, and completion independent of its reminders |
| Assignment request | A proposal awaiting the recipient's acceptance or an applicable standing consent rule |
| Event | An entered commitment with date, duration or all-day status, participants, timezone, and linked reminders |
| Reminder and occurrence | A prompt schedule and each dated instance; occurrence changes need not alter the series |
| Notification attempt | Submission and observed channel outcome, separate from acknowledgment and completion |
| Approval | Consent to a specific current action revision, audience, and content, with expiry and invalidation |
| Routine and watch | Scheduled work or conditional checks with owner, allowed sources, outputs, health, and stop controls |
| File and source excerpt | A retained original or an approved extract; independent retention and provenance remain visible |
| Plan | A reviewed collection of decisions, tasks, events, and preparation, each preserving its own authority and status |
| Household item and activity record | Expansion concepts for possessions, inventory, observations, dates, units, and measured versus estimated values |
| Connection | A future member-authorized account with separate reading and writing permissions and health status |
| Action receipt | Evidence of what was attempted and observed, including partial or uncertain outcomes |

These are product concepts, not database tables. Direct controls, conversations, background work, and exports must preserve their distinctions.

<a id="notifications"></a>
## Notifications and Communication

### Channels, delivery, and interruption limits

The in-app inbox is the durable record. Release 1 also requires tested push on the actual iPhone and Android, including closed-app and locked-screen conditions. Desktop browser push is optional; its inbox and manual controls are required. Email, SMS, and external messaging are expansion. Delivery is best effort, not an alarm or emergency promise.

The recipient receives at most one routine-generated brief push and one nonessential shared-activity digest push per day by default. Additional routine pushes require explicit recipient configuration. User-accepted reminders and incoming request notifications are separate categories, clearly shown when enabled. Coalesce repeated pending requests from the same sender within ten minutes into one push. The inbox retains each request. No automatic follow-up nudges ship in v1; future follow-ups are opt-in and limited to one per occurrence.

Acknowledgment updates all authorized devices. Device-specific delivery failures are shown to the recipient, without exposing private device metadata to senders. Retry failed submission at most three times within fifteen minutes while the occurrence remains eligible. Check uncertain outcomes before retrying; do not create a duplicate reminder or blindly resend an uncertain message. A push permission check shows that a channel was tested, not that future delivery is guaranteed.

### Daily and weekly briefs

Each brief has an owner, audience, source selection, schedule, length, generated-at time, and pause control. Daily briefs cover the local day; weekly briefs cover the next seven days. Both are off initially. Suggested schedules are 8 AM daily or Sunday 6 PM weekly, enabled only by the requesting adult. The recipient can choose either or both; notification-budget changes require explicit review.

Generate a brief within fifteen minutes before its scheduled delivery. Recheck permissions and task/event revisions immediately before submission. If included records changed, regenerate or use a direct current agenda summary. If AI fails, deliver a clearly labeled list of authorized current events, tasks, and requests without generated commentary. A brief never says there are no commitments when the relevant source failed or external calendars are not connected. Future watches must expose check frequency, baseline, failures, expiry, and stop control; they do not imply continuous monitoring.

### Communication and system messages

COM-01 through COM-09 define in-app messages, handovers, replies, explicit acknowledgment, and individually confirmed decisions. BR-003 defines snapshot correction and retraction. BR-011 defines what request senders can see. No passive read receipts, automatic escalation, or automatic follow-up nudges ship in Release 1.

System messages include action receipts, pending and expired approvals, failed or unknown outcomes, missed schedule summaries, source and processing limitations, and privacy incidents. Expiry warnings appear seven days before ordinary history or an optional saved expiry removes content. Storage warnings occur at 80% and 95%; cost warnings occur at 80% of either allocation. Incident behavior and safe-channel notices are defined in [Risks and Product Challenges](PRODUCT-RULES.md#risks-and-incidents).

Quiet hours and late-delivery behavior are defined once in BR-013. Onboarding offers discreet lock-screen previews and keeps push off until permission and a test succeed under FR-001. Email, SMS, and external messaging remain Future.

<a id="experience-principles"></a>
## Product Experience Principles

Success means lower mental overhead and voluntary use by both adults. More messages, notifications, retained data, or AI personality are not success measures.

- Personal conversation is private by default. An audience change is deliberate and visible.
- Settings change presentation, never facts or evidence.
- A mention, quotation, complaint, or hypothetical is not an instruction.
- Low-risk explicit instructions execute with a receipt. Sensitive retention and new disclosure require review of the actual content.
- An assistant claim never substitutes for a saved record or observed action result.
- Important functions have direct controls. Voice and conversation are optional input methods.
- Information has a source, author, audience, and relevant dates. Uncertainty remains visible.
- Each recipient controls interruptions. No hidden monitoring, relationship adjudication, or household compliance score.
- Family data is inspectable, correctable, exportable, and removable within explained limits.

### Navigation and progressive use

| Area | Contents and purpose |
|---|---|
| Talk | Text, explicit voice capture, attachments, identity, audience, retention mode, and processing mode |
| Today | Agenda, due tasks, inbox, briefs, pending approvals, unresolved requests, and failures |
| Family | Shared lists, events, plans, decisions, general handovers, and dependent profile |
| Memory | Saved facts, requested history search, files, sources, validity, correction, and visibility |
| Settings | Consent, profile, languages, devices, retention, processing, notification rules, cost, export, and account exit |

Onboarding starts with independent identity, consent, and one private and one deliberately shared item. Extra preferences, dependent details, and imports do not block basic setup. Voice and sound remain optional. One-handed use, keyboard navigation, assistive labels, and 200% text enlargement support the actual household devices.

The product makes active identity, audience, retention, processing, source, and action state visible at the point of use. FR-008 defines record cards and persistent pending work. A brief or manually entered agenda never claims to cover every external commitment.

<a id="operating-constraints"></a>
## Product Constraints

### Privacy, safety, platform, and compatibility

- Confirmed scale: one private household, two independent adults, and a guardian-managed dependent. No public signup, commercial program, or multi-household administration.
- Target platforms: actual household iPhone, Android, and desktop browser. Device inventory records model, OS, browser or app version, and tested capabilities. PWA-first is selected for evaluation; unsupported browser APIs require honest feature detection and tested alternatives.
- Initial language evaluation: English, Tamil script, transliterated Tamil, and mixed Tamil-English, assessed separately. Presentation offers metric units, INR, day-month-year dates, and Asia/Kolkata time only after acceptance; these defaults do not establish a legal jurisdiction.
- Privacy and processing: BR-007 separates flexible development/UAT provider evaluation from production no-training, at-most-thirty-day retention and disclosure gates. Manual-only controls and actual adults' consent remain binding in every environment.
- Sensitive safety boundaries: no emergency-monitoring promise, professional diagnosis, replacement treatment, secret storage, independent child access, ambient recording, covert location tracking, or passive relationship monitoring.
- Input and storage limits: FR-002 and FR-003 define five-minute voice clips, supported formats, 20 MB images, 25 MB PDF/text files, 50 PDF pages, and five attachments per request. FR-005 defines 10 GB retained-original capacity, warnings, and no silent eviction.
- Retention and recovery: BR-008 and FR-004 specify cleanup, expiry, daily recovery, a 24-hour data-loss target, and restoration within 24 hours after an authorized operator begins. No guarantee of remote erasure on a disconnected device or deletion of external copies.
- Availability boundaries: AI-only outages preserve online manual functions; complete service outages have no guaranteed offline archive. Push is best effort, not a guaranteed alarm. No persistent offline private-record cache in Release 1.
- Regulation and geography: development through UAT has no owner-imposed region restriction. Confirm production applicability and location before release. No universal Indian household-exit deletion period is assumed; BR-005 defines product deletion behavior pending any specifically applicable legal obligation.

### Budget and maintenance

The initial operating budget ceiling is INR 3,000 per calendar month for the household, including hosting, storage, recovery copies, AI, speech, and search. Reserve INR 1,000 for baseline non-AI service and recovery, and allow at most INR 2,000 for variable AI work. These are product-owner planning allocations, not vendor price estimates, purchase authority, or a claim that a particular stack fits.

Production architecture must cost the specified workload against these limits. Development/UAT monitors actual use before enforcing the calibrated production monetary cap. Production rules follow: Warn at 80% of either allocation. Before starting variable work, reserve a conservative maximum cost; reject it if that would cross the allocation. Limit response size, processing duration, and retries so work is bounded. When the paid variable AI allocation is exhausted, temporarily disable all optional AI features across paid and subscription routes, including generation, speech processing, AI research, embeddings, file analysis, and generated routines. Do not start new interactive or background AI work or switch to another route to bypass the pause. Retain manual records, ordinary saved reminders, privacy controls, and direct agenda briefs. AI can resume when the next accounting month supplies an available allocation or Nishanth explicitly approves an increase; recheck current consent and eligibility before new work. A local-model alternative remains future work requiring a separate selection and validation; it is not an automatic fallback or a Release 1 commitment. No background job silently increases the budget. Costs for work already started and late vendor accounting remain separately visible; usage estimates are not a guaranteed invoice ceiling. Fixed service commitments must fit their reserve before deployment.

Nishanth, as household/product owner, approves increases, paid fallback funding, and changes to the baseline/AI allocation; show a household notice. This is an explicit exception to joint household-setting acceptance and grants no private-data rights. Coordinator reductions and optional-AI pauses remain immediate. Each adult can stop use of their own AI connection immediately. Development through UAT records usage, route, latency, failures, and estimated/actual cost with visible owner-configured alerts and an emergency stop; use observations to tune limits. Resource, retry, and concurrency bounds still apply. Before production, enforce conservative monetary admission for paid work within the configured allocations. Subscription usage has its own provider quota and separately displayed allowance; do not fabricate an API-equivalent remaining balance. Changing a spending limit does not authorize purchases by the assistant. Aggregate cost reporting uses daily totals, not private prompt metadata. The ₹3,000 service allocation covers incremental app hosting, recovery and paid API/gateway work; existing personal ChatGPT subscriptions are shown separately rather than presented as free or charged twice. A new paid subscription or credit purchase needs owner approval.

After initial stabilization, maintenance and corrections should require no more than one hour per week from Nishanth. A short fifteen-minute household feedback review runs weekly during the pilot. If the system needs repeated manual rescue, disable the offending capability and fix it before expanding scope.

The numerical limits are confirmed planning constraints and acceptance targets. They are not measured reliability results, vendor quotations, or authorization to spend. Q-03 records the resolved owner authority. Subscription quotas and paid API spending are separate accounting paths, but both routes obey the household AI pause when the paid allocation is exhausted.

<a id="assumptions"></a>
## Assumptions

Each assumption requires validation; none replaces an established consent requirement or a measured gate.

| ID | Assumption | Validation or current limit |
|---|---|---|
| A-01 | Scattered information and repeated coordination are worthwhile problems for both adults | Each adult selects recurring situations and supplies independent four-week pilot evidence; no interviews or baseline results are claimed |
| A-02 | The selected list, recall, reminder, and planning workflows are useful without replacing all existing messaging and calendars | Compare each chosen job with its previous method; manual agenda coverage stays explicit |
| A-03 | The full daily assistant can meet the INR 3,000 household planning ceiling and one-hour weekly maintenance target | Cost the specified workload and measure pilot operation; revise the product baseline explicitly if infeasible |
| A-04 | The actual household phones can meet push, language, latency, accessibility, and voice expectations | Record device versions and test observed behavior on both phones and desktop where applicable |
| A-05 | Production processors and subscription access can meet the required capabilities and processing constraints | Verify actual configuration and deployment eligibility before production. Development/UAT uses the BR-007 evaluation exception; no production compliance is inferred |
| A-06 | Deliberate saved facts plus requested history recall provide useful evidence-based recall at representative scale | Evaluate 100,000 messages, 5,000 memories, 2,000 task/event records, and 500 documents within capacity; these are test loads, not quotas |
| A-07 | Independent recovery and direct controls can work when Nishanth is unavailable | Both adults exercise export, pause, recovery guidance, and manual operations without builder assistance |
| A-08 | Sensitive-content detection catches enough risky input to be a useful safeguard | Detection is not guaranteed; manual sensitive mode and explicit processing choices remain necessary |

Offered language, quiet hours, dayparts, history retention, and brief schedules are Proposed defaults until each adult accepts them. They are not assumed preferences of the second adult. Future feature usefulness remains unproven and must be justified before activation.

<a id="risks-and-incidents"></a>
## Risks and Product Challenges

| Risk | Product consequence | Existing response and validation |
|---|---|---|
| Unvalidated household need or one-sided adoption | The product adds work or benefits only its builder | Independent jobs, private feedback, voluntary use, and two-adult pilot gates |
| Control and UX complexity | Users cannot tell what was saved, shared, accepted, or completed | Progressive onboarding, separate states, direct controls, and independent usability tests |
| Incorrect recall or extraction | Users rely on fabricated agreement, dates, amounts, or stale facts | Cited evidence, visible uncertainty, reviewed critical fields, correction, and abstention tests |
| Private or sensitive disclosure | Loss of trust between adults or unwanted provider processing | Separate audiences and processing consent, minimal context, no existence leaks, manual-only mode, and zero-disclosure gates |
| Provider or operator boundaries misunderstood | Users assume local AI, zero retention, or secrecy from the operator | Actual processor and operator disclosure, provider limits, and unavailable incompatible operations |
| Missed, duplicated, late, or unstoppable prompts | False confidence or unwanted interruptions | Explicit acceptance, per-step receipts, linked cancellation, bounded retries, quiet hours, and real-device timing tests |
| Conflicts in shared edits or guardian decisions | Lost contributions or false agreement | Attribution, preserved revisions, owner-controlled dependent-sensitive operations, and immediate disputed care-prompt pause |
| Deletion and retraction overpromised | Users think every paraphrase or external copy vanished | Show verified matches and scope, separate snapshots, state external limits, and prevent known restoration/re-extraction |
| Cost or maintenance exceeds household capacity | The assistant becomes dependent on constant rescue | Allocation checks, optional-AI pause, direct fallback, one-hour maintenance target, and disabling failing capabilities |
| External dependencies or source failure | Stale information, inaccessible AI, or failed push | Freshness labels, direct agenda fallback, manual continuity, and honest channel state |
| Premature specialist or child scope | A generic assistant is mistaken for a clinical, financial, or autonomous child service | Explicit exclusions and separate Expansion/Conditional gates |

### Failures, incidents, and recovery

| Failure | Required experience |
|---|---|
| AI unavailable or AI budget paused | Explain limitation, preserve manual controls and saved scheduling, deliver direct agenda fallback |
| Complete service outage | Explain loss of online access when detectable; no offline archive claim; reconcile missed schedules after recovery |
| Notification denied or test fails | Keep inbox usable, mark channel incomplete, never claim future push delivery |
| Search has no evidence | State scope and uncertainty; do not invent a record or expose inaccessible existence signals |
| Unclear speech or image | Show editable uncertainty and permit retry or manual input |
| Stale source or revoked access | Recheck before output; suppress unauthorized content and label authorized unavailable sources accurately |
| Duplicate or uncertain action | Return existing result or reconcile status; do not blindly repeat consequential work |
| Sensitive processing declined | Offer manual-only record or temporary discard; do not silently switch processor |
| Privacy concern or wrong recipient | Pause affected sharing and routines, revoke implicated access, preserve minimal incident evidence, notify affected adults without revealing unrelated private data |
| Recovery copy too old | Warn the coordinator and mark recovery degraded; pause new sensitive retention until a valid copy exists |

Privacy disclosure, unapproved action, false commitment success, irreversible loss of retained information, failure to honor forgetting, or unstoppable notifications blocks the affected capability immediately. Notify affected adults through their available safe channel and inbox. Resume only after reproducing the issue, correcting it, passing the regression case, and explaining the outcome. The app must not rely on AI to decide whether the user may disable it.

<a id="glossary"></a>
## Glossary

| Term | Meaning |
|---|---|
| Release 1 / v1 | The full first daily assistant, completed through source checkpoints A, B, and C |
| Expansion | Future useful work that does not block Release 1 and requires its own acceptance evidence |
| Conditional | Future work requiring new product justification and capability-specific review |
| Conditional watch | A future Expansion feature that checks a named source for a defined condition; "conditional" here describes its trigger |
| Confirmed / Proposed / Needs Decision / Future | Certainty markers defined in the [documentation guide](../README.md#status-and-authority); none claims implementation success |
| Audience | The adults or guardians permitted to read a specific record |
| Private-origin record | A record owned by an adult that may be shared by an explicit grant without sharing its originating conversation |
| Live record | Content whose future views follow current permissions and revisions |
| Snapshot | Exact approved dated content sent to a recipient, with separate correction and retraction |
| Guardian-managed | Dependent information owned by Nishanth and readable by named confirmed guardians; sensitive content is read-only for guardians and owner-controlled for export/disclosure |
| Standing consent | A recipient-controlled rule for a named sender, category, and permitted schedule window |
| Requested history recall | Searching retained conversations only at an adult's explicit recall or selected-source request |
| Automatic context | Explicit saved facts and permitted structured records available for unsolicited personalization or briefs, excluding raw past chat |
| Temporary | No lasting household history, subject to separately approved actions and disclosed provider processing retention |
| No external AI processing | A per-record prohibition on sending its content or derived representations through external AI processing; it does not promise local storage or operator secrecy |
| Forget | Exclude information from all AI recall and generation and prevent automatic re-extraction until explicitly reauthorized |
| Remove everywhere | Review and remove identified authorized occurrences and derivatives within verified service scope; no guarantee about all paraphrases or external copies |
| Busy-only | Explicitly shared occupied intervals without private event details or identifiers |
| Occurrence | One dated instance of a recurring task or reminder, distinct from the series |
| Notification submitted | A recorded handoff to a notification channel; not proof of delivery, acknowledgment, or task completion |
| Acknowledgment | An explicit recipient action, distinct from passive opening, assignment acceptance, and work completion |
| Outcome unknown | An action or delivery result that has not been verified and must be reconciled before retry |
| Direct agenda fallback | A labeled list of current authorized events, tasks, and requests without generated commentary |
| INR | Indian rupee, the offered currency for newly entered values unless specified otherwise |
| QLT / F / T / X / V | Original quality requirements, journey IDs, baseline/capability scenarios, review scenarios, and acceptance families |
| FR / BR | Conversion labels for cross-cutting functional requirements and consolidated business-rule groups |
| OCR | Text recognition from images or documents; retained as technical terminology only, with no selected implementation |
| ADR | Architecture decision record explaining a proposed or accepted technical choice, independently of validation status |

The business entities in [Data / Information Concepts](PRODUCT-RULES.md#information-concepts) supply the definitions of household, member, conversation, memory, task, event, approval, plan, connection, and action receipt.

## Supported policy decision notes

Q-01 through Q-06 are decided policies: dependent ownership/export, lifecycle boundaries, spending authority, saved-copy retraction, general/specialist scope and owner succession. Their rules above are authoritative. [The decision index](DECISIONS-AND-GATES.md#legacy-decision-index) preserves equivalent AD/RD references. Q-07 through Q-09 still require environment, processor or household evidence. No missing D-series history has been reconstructed.

Nishanth resolved [ISSUE-01 and ISSUE-02](DECISIONS-AND-GATES.md#open-policy-questions) on 4 October 2026: paid-budget exhaustion pauses all optional AI routes, and nonproduction provider evaluation is exempt from production residency, no-training qualification, and thirty-day processor-retention eligibility. The amended rules above are authoritative; implementation evidence remains pending.

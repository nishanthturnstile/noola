# Data and security

Technical enforcement contracts for data, current authority and processing boundaries. Product policy remains canonical in PRODUCT-RULES; validation is pending.

[Documentation index](../README.md). Consolidated 3 October 2026; implementation and validation remain pending.

<a id="data-architecture"></a>
## Data Architecture

### Data Categories and Data Ownership

| Category | Logical owner | Relationships and storage responsibility |
|---|---|---|
| Accounts, membership, guardianship, consent, settings, grants | Identity and Household Policy | Transactional authority; distinguishes actor, subject, creator, owner, assignee, and audience |
| Conversation history, proposals, approvals, receipts | Conversation and Actions | History retention is independent from approved lasting actions; approvals bind exact current revisions |
| Memories, notes, excerpts, validity, suppression controls | Memory and Evidence | Links to accessible evidence and its approved retained excerpt; current/historical status survives source expiry |
| Lists, tasks, assignments, prerequisites, completion | Lists and Tasks | Authoritative shared-work state; separate from reminder and delivery state |
| Events, busy intervals, plans and record links | Agenda and Plans | Entered-coverage semantics, own participation, minimal busy projections, independent plan outputs |
| Messages, snapshots, replies, handovers, decisions | Communication and Decisions | Snapshot disclosure differs from live grants; agreement belongs to each participant |
| Schedules, occurrences, attempts, inbox entries, routines | Scheduling and Delivery | Durable state and current eligibility; no delivery-to-completion inference |
| Retained originals, extraction drafts, media revisions | Files and Capture | Bytes in protected storage; metadata and approved links in transactional storage |
| Raw audio, temporary uploads/conversations and processing artifacts | Relevant capture/conversation owner | Short-lived processing area excluded from routine recovery and lasting indexes |
| Search data and any vector representations | Search and Retrieval | Rebuildable from currently eligible sources; source rights and lifecycle still authoritative |
| Generated answers, summaries, and their source manifests | Owning conversation, memory, communication, or routine domain | Provenance and disclosed audience follow the use; generation does not create a generic permanent archive |
| Export packages, recovery copies, removal controls | Lifecycle and Portability | Authorized, bounded-lifetime export; restricted recovery; content-free anti-resurrection state |
| Costs, operational metadata, security and action events | Operations and Cost, with record-level attribution in source domains | Aggregate reporting without private prompts; no broad product analytics warehouse |
| Cache and ephemeral execution state | Component producing it | No independent truth or authority; no persistent offline private-record cache |

### Data Lifecycle

Creation requires the applicable processing and retention choices. Temporary use is not an implicit saved conversation. Sensitive messages, transcripts, files, facts, summaries, and lasting actions require separate retention selections. Recognition of likely sensitivity pauses before external transmission and durable retention; this safeguard is not a promise of perfect detection.

[BR-008](PRODUCT-RULES.md#br-008) owns every retention period and temporary-session termination rule. Implement that policy for each storage and derivative path; do not maintain a second retention table here.

Expiry warnings follow [BR-008](PRODUCT-RULES.md#br-008). Archive and ordinary deletion are reversible where the source says so; remove-everywhere bypasses ordinary user-restorable trash for selected information. Jointly owned permanent deletion requires the relevant adults' approval. Withdrawal of one's private-origin material does not require another adult's consent.

Known provenance links support correction, grant withdrawal, and deletion of derived material. Independently retained tasks/facts are not silently deleted when a source expires. A saved fact can keep only its approved evidence excerpt, with an explanation that it may outlive the source chat. A temporary-session action retains reviewed fields and a receipt without secretly retaining the conversation.

Lifecycle control state must remain recoverable independently of an older content snapshot. A restore applies current deletion, revocation, and membership restrictions before reopening access. Minimal content-free deletion suppression remains until affected recovery copies expire; longer-lived source re-extraction exclusions are visible privacy controls, not hidden content archives. The selected design is a separately durable content-free restriction journal. Apply restrictions locally first, append durably with idempotent ordered events outside the primary restore boundary, then acknowledge completion. Pending/unverified replication remains restrictive and pending. Replay the verified latest journal before reopening an older content restore; missing completeness evidence keeps it closed. AD-014 now requires implementation and fault-injection evidence, not another policy choice.

### Consistency Requirements

Strong consistency is required for current authority, approval validity, same-request deduplication, record revisions, action receipts, accepted assignments, cost reservations, and linked cancellation/scheduling decisions. A successful record operation must not leave its receipt claiming a different outcome.

Independent shared edits should compose where they affect different items; conflicting revisions must be surfaced rather than silently overwriting contributions. A reviewed plan can produce partial per-record results, but each committed result preserves its domain invariants. There is no promise of one distributed transaction across providers.

Search indexes, generated summaries, background physical cleanup, and observational delivery status may be eventually updated. Current source/permission checks must still prevent stale or unauthorized reads while derivatives catch up. Busy-only results cannot expose underlying private event identifiers. No stale cache or index is allowed to delay a confirmed revocation.

<a id="identity-and-authorization"></a>
## Authentication and Authorization Architecture

### Identity boundary and authentication trust model

**Confirmed:** Every household-data request requires an authenticated adult session. Voice familiarity, notification possession, client profile selection, and model assertions are not identity. Separate adult recovery must work without another adult reading private content. Product owner, coordinator, guardian, and operator are distinct authorities even when one person holds several roles.

**Selected direction, validation pending:** Better Auth database sessions with independent email recovery; Mailpit in nonproduction and Resend in production. ChatGPT connection optionally supplies eligible identity/AI access while the application retains its own household sessions and rights. AD-010 retains actual account and recovery evidence.

### Session handling

The service maintains current revocation authority, rather than relying only on a long-lived credential that cannot be invalidated. Confirmed device/account revocation denies new server access immediately. Shared-device backgrounding and the [BR-001 inactivity rules](PRODUCT-RULES.md#br-001) apply independently of whether an old connection remains open.

Requests, original-file retrieval, export downloads, and continued output delivery must validate applicable current authority. A revoked session cannot keep reading a stream. The client clears visible private state and local session material on logout/switch; disconnected local erasure is outside the guarantee.

### Authorization enforcement and privileged operations

Use record-specific policy with role context, ownership, audience, current membership, operation, and approval revision. A simple household-wide role check is insufficient. A household-shared audience does not automatically expose old records to new members. Read, edit, deletion, export, and wider disclosure remain separate decisions, including the sensitive-dependent exception: Nishanth owns all dependent records and guardians request owner-performed exports instead of downloading sensitive content.

Each adult can immediately tighten their own privacy or notification settings. Shared privacy/retention changes require joint acceptance. Nishanth approves spending increases/allocation changes with notice; immediate reductions and optional-AI pauses remain allowed under resolved AD-003. Proposed onboarding defaults do not become either adult's settings until accepted.

Both adults approve permanent deletion of jointly owned adult contributions and applicable guardian-role changes. Nishanth controls dependent-sensitive edits, deletion, export and wider disclosure as record owner. Guardian access to sensitive records is read-only. A guardian may immediately pause a disputed care reminder. Task acceptance belongs to the assignee, through an explicit response or their matching standing consent; each decision participant confirms their own agreement. Material changes invalidate approval, which otherwise expires after 24 hours or the intended action time, whichever comes first. Expired unsatisfied proposals remain visible as drafts for seven days, then are removed unless saved. A bare yes authorizes only one clearly focused current proposal.

Coordinator controls cover setup, service availability, and aggregate cost, not impersonation, eviction, unilateral guardianship removal, or private data. Restricted operator controls can suspend AI and sharing after a disclosure report while preserving each adult's authenticated export and recovery rights. Actual infrastructure access is separately disclosed; it does not become an application permission.

### Server/client responsibility

Clients display available actions and collect choices; the server repeats all security and business validation. Notification links open current authorized records rather than embedding sensitive details or preserving obsolete permission. No public signup, child login, enterprise role hierarchy, or multi-household administration is introduced.

<a id="security-controls"></a>
## Security Architecture

### Trust Boundaries

The untrusted client boundary leads to authenticated application operations. Persistence, recovery, and processor access sit behind server-controlled interfaces. External documents, web content, model outputs, and provider callbacks are untrusted. Operational access is a separate, disclosed trust boundary, not an implied promise of secrecy from the operator.

### Secrets

Keep provider and storage credentials in restricted runtime configuration, outside clients, chat, ordinary logs, and exports. Future account credentials belong to Connections and are never model context. Household passwords, one-time codes, payment secrets, and tokens are unsupported retained content; recognized instances are redacted before normal retention and external processing.

### Input Validation

Validate action intent, revisions, record references, dates/timezones, recipients, and upload limits at server boundaries. Validate content types and extraction results independently of extensions or provider claims. Render generated/user content without executing embedded scripts. Remote evidence fetching must reject access to internal infrastructure and avoid forwarding household credentials; this is a Proposed protection derived in DAR-011.

### Authorization

Use [Authentication and Authorization Architecture](DATA-AND-SECURITY.md#identity-and-authorization) policy for ordinary commands, search, sources, exports, job execution, and delivery. Revalidate pending work after revocation, exit, source edits, and approval expiry. Unauthorized errors must not reveal another adult's record existence.

### Data Protection

**Proposed:** Protect transport and stored household/recovery data with appropriate encryption and restricted credentials, derived from privacy and recovery obligations. Keep environment access separate. Encryption at rest does not conceal data from an operator who controls decryption, and no end-to-end encryption claim is made. AD-012 retains the actual operator/key-access boundary.

### File Security

Validate format/size/page limits before analysis; isolate parsing from privileged actions and bound its resources. Store originals outside public serving paths and expose only authorized retrieval. Treat executable/embedded instructions as data. A content inspection mechanism must itself satisfy processing consent and retention restrictions; do not silently upload manual-only files to a scanning service. Do not request document passwords.

### External Integration Security

Adapters receive only the minimum permitted data and scoped service credentials. External egress applies operation-specific processor policy, including file analysis, speech, embeddings, search queries, and generated exports. Future callbacks require authenticity and replay checks. Disconnection revokes future access and makes retained-copy choices explicit.

### AI / Prompt Injection

Model prompts cannot replace server policy. Separate trusted instructions from evidence; constrain sources and output audiences before generation. Validate tool proposals and exact disclosure content. Refuse instructions embedded in evidence that request broader access, sending, or state changes. Do not send denied content to another processor to decide whether it is denied.

### Tool Execution Safety

Expose only enabled domain operations, with bounded steps and reviewed consequential changes. Approval binds the actual current action, recipients, content, and account where relevant. Recheck immediately before execution and disclosure. A user-confirmed unsupported action stays unsupported. Keep completed, canceled, and unknown results inspectable.

### Rate Limiting / Abuse Prevention

**Proposed:** Bound authentication attempts, input size, provider calls, concurrent processing, and generated output to protect availability and budget. Recipient request coalescing and notification budgets follow product rules, not a sender's urgency label. Operational limits must preserve access to stop, privacy controls, recovery, and manual operations. Per-purpose limits remain configurable and are tuned from development/UAT measurements before production. TECH-STACK.md records initial parser/media bounds; no new household product quota is asserted.

### Auditability

Record attributed changes, approvals, disclosure decisions, recipient acceptance, privileged service actions, and observed execution outcomes. Limit event detail and visibility to the requesting adult's rights. Record-level attribution persists with the record; ordinary action/security metadata follows the 90-day policy. Auditing does not create passive read receipts or private prompt surveillance.

### Dependency / Supply Chain Considerations

**Proposed:** Minimize privileged dependencies, pin reviewed releases, and separate build-time credentials from runtime secrets. Review dependency changes that affect authentication, parsing, external egress, or retention. A provider SDK upgrade must not silently enable provider history storage, training, logging, or additional processors. This follows DAR-011; no library is chosen here.

<a id="privacy-controls"></a>
## Privacy Architecture

### Data minimization and purpose limitation

Collect and process only information needed for an explicit household purpose. A conversation is not automatic memory, a retained file is not blanket extraction consent, and an account connection is not permission to import everything. No passive recording, read receipts, emotional profiling, covert location, or spouse comparison analytics exist in Release 1.

### Storage boundaries and consent

Cloud hosting and external AI processing are separate disclosures. No external AI processing excludes protected content and derived representations from model, speech, OCR, embeddings, external search, and AI-generated export operations. It does not promise local-only storage or secrecy from hosting operators. Sensitive sessions default to temporary and manual-only until processing and retention are separately approved.

Production providers must support no training on household content and a disclosed processing-retention bound of no more than thirty days. Development/UAT follows the explicit BR-007 exception. Sensitive processing needs informed opt-in to that bound. Disabling a nonconforming operation preserves manual use but cannot be counted as satisfying an undelivered required AI capability.

### Deletion and export

Apply the distinct correction, personalization exclusion, forgetting, source deletion, and removal-everywhere contracts. Use provenance and visible suppression controls to prevent known stale/forgotten material from returning. Preserve independently authored contributions and live-versus-snapshot distinctions; AD-004 resolves recipient-saved in-app copies and their source-linked derivatives to follow retraction.

Export includes authorized originals, Markdown, CSV for tasks/schedules, JSON for structured records, and a manifest of excluded or unavailable originals. It preserves dates, ownership, audiences, revisions, source references, active routines, and their state. It never includes an inaccessible private source behind an excerpt. Disclose that downloaded copies cannot be recalled. The general readable-content export right remains; guardians cannot self-export sensitive dependent content under AD-001 and must request an owner-performed export.

### Logs and observability redaction

Default diagnostic collection excludes message bodies, raw media, secrets, private excerpts, and unnecessary source titles. Correlation identifiers and aggregate metrics must not become shared private-activity signals. A member can submit a selected redacted example for an incident. Test/pilot feedback may remain private; shared evidence uses redacted descriptions.

### Geography and operator limits

INR, Tamil, and Asia/Kolkata do not establish jurisdiction or residency requirements. AD-007 records that decision before sensitive hosting/processing. Actual processors, retention configuration, operator access, and independent recovery must be disclosed before affected use, not inferred from a general architecture label.

<a id="authentication-integration"></a>
## Authentication and Authorization

Select Better Auth with its separate Drizzle adapter and opaque database-backed sessions. Use invitation-only verified email/password accounts and self-service password reset through each adult's independently controlled email address. Use Mailpit capture in nonproduction and Resend delivery in production. This avoids assuming either adult has a particular social-provider account. Account creation must enforce an invitation/bootstrap boundary server-side; hiding signup is insufficient. [Better Auth email/password](https://better-auth.com/docs/authentication/email-password), [Drizzle adapter](https://better-auth.com/docs/adapters/drizzle)

Disable session cookie caching. Re-read current session and household authority on protected requests, downloads, exports and continuing output delivery. Enable session revocation on password reset deliberately. Auth expiry alone does not implement five-minute shared-device locks, background locking, fifteen-minute personal-device locks, or clearing visible data. Those remain application policies. [Session management](https://better-auth.com/docs/concepts/session-management), [configuration options](https://better-auth.com/docs/reference/options)

Mount the maintained Express integration before incompatible body parsers and use Express 5 route syntax. This avoids relying on an integration guide explicitly written for an older router major. Use secure HttpOnly cookies, explicit trusted origins, CSRF protections, generic recovery responses and database-backed auth rate limits. No Redis is needed. [Express integration](https://better-auth.com/docs/integrations/express), [rate limiting](https://better-auth.com/docs/concepts/rate-limit)

Better Auth's built-in rate limiter covers HTTP auth requests, not direct server-side `auth.api` calls. Keep sign-in/reset on the mounted auth interface or apply equivalent limits to any action wrapper. Include database rate-limit storage in the reviewed migration set.

Authorization is application-owned record policy, with role context as one input. Owner, subject, guardian, recipient, source audience, processing permission, current membership, and operation rights remain distinct. No OpenFGA, OPA, Casbin, or organization plugin initially. Optional database defenses do not replace application checks or require exposing PostgreSQL directly to clients.

Auth.js and Clerk were evaluated in [Technology Decision Details](../adr/README.md#decision-index). ChatGPT is an optional eligible account connection, not permission to auto-link by email alone or discard independent manual access. No enterprise SSO or MFA platform is required for the present product. Provider-account/operator MFA is still appropriate. Passkeys or member MFA can be added if household usability/security evidence justifies them, with independent recovery tested before activation.

<a id="security-tooling"></a>
## Security Tooling

Select GitHub Dependabot alerts/updates, pnpm dependency audit and the Gitleaks CLI in CI. Use the CLI's open-source distribution, rather than assuming every hosted action/service has identical licensing. Review scanner findings; a clean scan is not a security certification. [Dependabot](https://docs.github.com/en/code-security/concepts/supply-chain-security/dependabot-version-updates), [Gitleaks](https://github.com/gitleaks/gitleaks)

Use application tests for CSRF/origin enforcement, unauthorized object access, malicious file input, prompt injection, session revocation and private-data leakage. Configure CSP and related HTTP headers at the server boundary and render untrusted text safely. Add a maintained sanitizer only if a reviewed requirement introduces HTML rendering.

Authentication rate limiting uses Better Auth's database storage. Application AI/upload endpoints use authenticated quotas, bounded concurrency and PostgreSQL-backed admission/cost accounting; platform ingress protections cover malformed/public traffic where available. These controls do not require Redis or a rate-limiting SaaS.

Do not assume private-repository CodeQL/secret-protection entitlements are free. Add those capabilities if the repository plan supports them or evidence justifies the cost. No SIEM, enterprise vulnerability platform or external scanning of household files initially.

### Local checks before AI egress

Start with deterministic secret/PII checks in the Node service: bounded patterns, credential formats, checksums/context cues, and explicit sensitive/manual-only labels. Scan typed text and locally extracted inspectable content before any provider call; redact recognized secrets and pause likely sensitive or uncertain input for review. Never send to an external classifier to establish pre-transmission safety. Uninspectable content requires the applicable explicit sensitive-processing choice. Obtain audio transcription consent before uploading audio, then inspect the transcript before further processing. A later warning cannot undo the transcription disclosure.

Test Tamil, transliteration, mixed language, filenames, derived prompts, logs and adapter payloads, including proof that blocked input never reaches transport. Detection remains fallible; users retain a manual sensitive control. Add Presidio only if measured coverage justifies a separate Python service, not as a claim of perfect detection. [Presidio limitations](https://github.com/data-privacy-stack/presidio/blob/main/docs/faq.md)

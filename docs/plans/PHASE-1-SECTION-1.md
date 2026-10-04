# Phase 1, Section One — Separate accounts and household setup

**Status:** Local synthetic implementation and validation complete on `codex/phase-1-section-1`; see the [validation and handoff record](../reviews/PHASE-1-SECTION-1-VALIDATION.md). Prepared and implemented 4 October 2026. Local-first delivery and English-first screens/emails were selected in the planning conversation. Technical defaults below are proposed implementation defaults, not amendments to product policy or evidence of architecture approval.

This document preserves the complete Section One plan from the planning conversation. The [documentation guide](../README.md), [roadmap](../ROADMAP.md), canonical requirements and product rules retain their authority. Later Phase 1 section numbers refer to the eight-part implementation breakdown discussed in that conversation, rather than additional roadmap phases.

## 1. Outcome, boundaries, and prerequisites

Section One establishes the identity and permission foundation for the remaining Phase 1 sections. When local implementation is complete, two synthetic adults can independently create verified accounts, complete account setup, accept household rules, manage their own sessions, recover access, and optionally establish Vihaan’s profile and guardian permissions.

The agreed delivery choices are:

- **Local implementation first**, using synthetic identities and Mailpit. Hosted acceptance follows later.
- **English screens and account emails first**, while storing each adult’s selected interaction language.
- One private household, with two adult accounts. Nishanth is the initial owner and coordinator.
- Email/password authentication and independent email recovery, following the existing [authentication contract](../reference/DATA-AND-SECURITY.md#authentication-integration).

Private capture, conversational assistance, and shared lists remain in their subsequent sections. Section One provides their identity, consent, and permission interfaces. Saving and sharing the first real items will complete the broader onboarding journey when those features exist.

### Prerequisites

| Prerequisite | Current position | Work required before proceeding |
|---|---|---|
| Runnable workspace | Web/API, PostgreSQL, contracts, and client packages exist | Recheck the foundation before making identity changes; preserve the separate shared PostgreSQL setup. |
| Authentication adoption | Better Auth and its Drizzle adapter are pinned as experiment dependencies | Promote the matching packages into production dependencies; create a production configuration without importing experiment code. |
| Enrollment transactions | Product enrollment does not exist | Prove that account creation, invitation consumption, membership creation, and verification-email enqueueing can commit or roll back together. |
| Application configuration | API currently requires database and port settings | Add validated application origin, persistent auth secret, email transport, and operational limits. Preserve existing generated secrets and configuration files. |
| Local email | Mailpit is selected but not configured in the application | Add private Mailpit infrastructure with relay/forwarding disabled, plus synthetic email-flow tests. |
| Forms and components | Base UI/shadcn foundation exists; only Button is installed | Add the selected TanStack Form dependency and necessary Base UI form components, keeping the existing preset and styling. |
| Reliable time | The readiness record reports clock instability | Check host/container time synchronization before trusting invitation expiry, resets, session locks, or approval expiry. Use an injectable clock in tests. |
| Verification | Existing checks cover the bootstrap and experiments | Extend integration and browser coverage to product identity behavior, with disposable synthetic data. |

The [readiness record](../reviews/PHASE-0-READINESS.md) permits beginning the local synthetic implementation. AI eligibility, production email delivery, physical-device acceptance, and independently durable recovery keep their existing evidence gates.

## 2. Ordered implementation milestones

Each milestone should be reviewable and have passing relevant checks before dependent work starts.

### 1.1 — Establish the production identity module and schema

**Implementation**

- Create the backend Identity and Household Policy module. It owns membership, invitations, settings acceptance, guardianship, relationship aliases, and session policy.
- Configure Better Auth with the maintained Drizzle adapter and database-backed sessions.
- Keep public signup disabled. Registration will pass through the application’s enrollment operation.
- Require verified email before household access; disable automatic sign-in after registration.
- Disable session cookie caching and enable session revocation on password reset.
- Introduce reviewed SQL migrations for authentication and application identity tables.
- Keep authentication cryptography and password hashing in Better Auth.
- Keep migration credentials confined to tooling; the running API retains its restricted database role.
- Add server-established principal and membership checks that later modules will call.

Better Auth provides the email/password and reset machinery; Noola adds its enrollment and household boundaries. [Better Auth reference](https://better-auth.com/docs/authentication/email-password)

**Completion evidence**

Fresh and repeated migrations succeed. The restricted runtime role can perform required identity operations. Anonymous, unverified, forged, expired, and revoked credentials cannot obtain household data.

### 1.2 — Implement durable account-email handling

**Implementation**

- Add an application-owned email adapter with Mailpit as the local transport.
- Add English invitation, verification, password-reset, and recovery-confirmation templates.
- Persist email events before acknowledging that they were queued.
- Use a durable send ledger and bounded background processing; jobs carry event identifiers.
- Protect credential-bearing payloads, remove them when no longer needed, and exclude tokens and email bodies from ordinary logs.
- Distinguish queued, transport-accepted, failed, and outcome-unknown states.
- Reconcile interrupted sends before retrying. An uncertain send is not automatically repeated.
- Keep Mailpit’s interfaces private because captured verification and reset messages contain usable links.
- Allow explicit resend actions with rate limits. Resending an invitation invalidates its previous unused invitation link.

**Completion evidence**

Mailpit captures the expected messages. Restarting the API does not lose queued events. Failures remain recoverable, and no response claims inbox delivery based solely on transport acceptance.

### 1.3 — Bootstrap the household and enroll the first adult

**Implementation**

- Add a restricted operator command to initialize the single household and issue its first enrollment invitation.
- The command takes the intended owner’s email, creates no password, and does not grant verified status.
- Prevent concurrent initialization from creating multiple households or owners.
- Repeated initialization cannot overwrite an existing household or reset an account.
- Use an opaque, random, email-bound invitation token; store its digest and lifecycle state.
- The enrollment page requests the invited adult’s email, chosen display name, and password.
- Before verification, show generic setup/help content without household names, membership lists, or activity.
- Atomically validate the invitation, create the account and membership, consume the invitation, and enqueue verification.
- The registration-only Better Auth configuration remains unmounted. Its server-side signup call receives the enrollment operation’s transaction and equivalent rate limiting.
- After email verification, require explicit sign-in, then open account setup.

**Failure handling**

Reject expired, canceled, mismatched, or replayed invitations safely. A failed registration leaves no partially usable account or consumed invitation. Retries reconcile the same enrollment attempt.

**Completion evidence**

A synthetic first adult completes enrollment and verified sign-in through the actual application flow. Direct calls to public signup cannot bypass enrollment.

### 1.4 — Invite and enroll the second adult

**Implementation**

- Add an invitation screen for the authenticated coordinator.
- Reserve the second adult slot while its invitation/enrollment is pending.
- Prevent a third adult slot, including simultaneous invitation attempts.
- Provide pending invitation status, cancellation, and resend controls.
- Canceling an invitation applies only before membership activation; it cannot evict an enrolled adult.
- The recipient chooses their own password, display name, consent, and preferences.
- Invitation acceptance does not accept household rules, guardian status, or AI processing.
- An account awaiting verification resumes verification rather than creating another account.
- Existing verified accounts are handled through authenticated joining; invitation submission cannot reset their credentials.

**Completion evidence**

Two separate browser contexts independently enroll. Neither adult obtains the other’s password, recovery link, settings, devices, or private profile details. Conflicting invitation submissions preserve the two-account limit.

### 1.5 — Build progressive account setup and household agreements

**Implementation**

Present a short, resumable account setup flow:

1. Confirm the adult’s identity and selected interaction language.
2. Accept or change presentation defaults.
3. Read the actual hosting/operator-access disclosure.
4. Choose history retention and notification preferences.
5. Review shared household rules separately.

Defaults offered for acceptance are concise English, metric units, INR, unambiguous day-month-year dates, and Asia/Kolkata time. Offer 180-day history retention alongside temporary, 30-day, and until-deleted choices. Ordinary history remains disabled until a choice is accepted.

Additional behavior:

- Keep each adult’s settings private and editable by that adult.
- Distinguish app hosting from external AI processing.
- During Section One, show AI processing as unavailable. Do not collect blanket consent for unidentified future processors.
- Store notification choices, but keep push off; permission and delivery testing belong to Phase 2.
- Offer quiet hours of 10 PM–7 AM only as an explicitly accepted preference.
- Record each adult’s acceptance against the exact household-rules revision.
- Enable cross-member use only after both accept the required rules.
- Declining shared rules preserves account access and personal setup.
- Proposed shared changes remain pending until the required acceptances exist.
- Personal privacy tightening takes effect immediately.
- Show accepted, pending, declined, and expired agreement states accurately.

The UI uses typed TanStack forms and the project’s accessible [Field composition](https://ui.shadcn.com/docs/components/base/field), with clear errors, pending states, and resumable progress.

**Completion evidence**

Each adult independently completes basic account setup. One adult cannot accept settings or rules for the other. Stale approvals cannot apply to a changed revision.

### 1.6 — Add optional dependent setup and relationship aliases

**Dependent profile**

- Provide optional creation of Vihaan’s parent-managed profile after basic adult setup.
- Store display name and optional birth date; real dependent details remain outside the synthetic checkpoint.
- Nishanth owns the dependent profile and dependent records.
- Treat ownership and accepted guardianship as separate responsibilities.
- Each adult explicitly accepts their own guardian status.
- Existing guardians approve additions; the proposed guardian separately accepts.
- Changes to another guardian’s role require the established independent approvals.
- A guardian may relinquish their own role.
- Guardian access to sensitive dependent information is read-only. Editing, deletion, sensitive export, and wider disclosure remain owner-controlled.
- Preserve attributed correction requests for owner review.
- Provide no dependent authentication credential or child login.

**Relationship aliases**

- Store aliases relative to the authenticated speaker.
- Allow an adult to confirm mappings such as “my wife.”
- Support private named-person references without creating additional accounts.
- Return a resolved target, an unresolved result, or permitted candidates requiring clarification.
- Never select arbitrarily among ambiguous “Mom,” “Dad,” or repeated names.
- Alias resolution establishes a reference; it does not grant access to that person’s records.

**Completion evidence**

Skipping dependent setup does not block adult setup. Guardian acceptance and sensitive-operation policy tests pass. The same alias can resolve differently for different speakers without leaking their private mappings.

### 1.7 — Implement device sessions, locks, and browser-state clearing

**Server behavior**

- Store application session policy alongside the authentication session: device mode, label, activity deadline, and lock/revocation state.
- Default new sessions to shared-device mode; the adult explicitly selects personal-device mode.
- Lock shared-device sessions after five minutes of inactivity or observed backgrounding.
- Lock personal-device sessions after fifteen minutes of inactivity.
- Background polling and session refresh do not count as user activity.
- Recheck current session, lock state, and membership on every protected request.
- Require fresh password sign-in after a lock.
- Provide a projection of the adult’s own device sessions using noncredential identifiers.
- Support revoking one session, other sessions, or the current session.
- Do not expose another adult’s device inventory or presence.

**Browser behavior**

- Display active identity and relevant audience in authenticated screens.
- On logout, account switching, locking, or revocation: stop requests, dispose the private QueryClient and route subtree, reset forms, and reject late responses.
- Synchronize clearing across tabs with content-free signals.
- Check authority before revealing content after navigation, browser-history restoration, or resume.
- Keep private records, passwords, tokens, and drafts out of persistent browser caches.
- If a shared device backgrounds while offline, clear and lock its UI immediately. Reconcile the server lock before restoring protected use after reconnection.
- If offline sign-out cannot reach the server, show that local state was cleared and server sign-out remains unconfirmed.

The underlying session lifetime remains separate from these application locks. [Better Auth session reference](https://better-auth.com/docs/concepts/session-management)

**Completion evidence**

Lock deadlines are enforced by the server as well as the UI. Back navigation, multiple tabs, late responses, and account switching cannot reveal the previous adult’s private state.

### 1.8 — Complete independent recovery and section handoff

**Implementation**

- Add generic “Forgot password?” responses and the reset flow through each adult’s own email.
- Use expiring reset tokens and revoke all affected sessions on successful reset.
- Send a content-free recovery confirmation.
- Require sign-in after reset.
- Add signed-in password changing through the maintained authentication mechanism.
- Provide directly accessible recovery guidance explaining email dependence, expired links, compromised devices, and the service operator’s actual access.
- Keep coordinator recovery controls from impersonating another adult or revealing their content.
- Record content-free revocation events so Section Seven recovery can preserve them when restoring older backups.
- Document the interfaces later sections must use for identity, consent, audience checks, and lifecycle restrictions.

**Completion evidence**

Either synthetic adult recovers access without the other adult’s participation. Resetting one account invalidates its old sessions while leaving the other account usable.

## 3. Data ownership and application interfaces

Keep backend behavior in the Identity module, email mechanics in its adapter, and UI workflows in account/household features. Contracts and generated client types remain browser-safe.

### Minimum data groups

| Group | Responsibility |
|---|---|
| Authentication tables | Better Auth users, credential accounts, sessions, verification state, and database-backed rate limits |
| Household and memberships | Single household, owner/coordinator responsibilities, two adult slots, and membership lifecycle |
| Invitations | Invited email, token digest, expiry, enrollment identity, and consumed/canceled state |
| Personal settings | Adult-selected preferences, acceptance state, disclosure versions, and onboarding progress |
| Household agreements | Rule revisions, separate acceptances, pending proposals, and expiry |
| Dependent and guardians | Owned profile, accepted guardian relationships, and attributed role/correction requests |
| Relationship aliases | Speaker-owned mappings and references |
| Session policy | Noncredential session identifiers, device mode, activity, locks, and revocation |
| Operational records | Email send ledger, minimal security events, and content-free restriction events |

Foreign keys, uniqueness constraints, and transactional checks enforce household capacity and valid ownership. Submitted user IDs, roles, guardian claims, or “accepted” flags never establish authority.

### Private application API additions

| Boundary | Planned interface |
|---|---|
| Authentication | Allowlisted `/api/auth` sign-in, verification, reset, password-change, and sign-out flows |
| Enrollment | `POST /api/v1/enrollment` with invitation proof and chosen account credentials |
| Current adult | `GET /api/v1/me`, plus own profile and setup updates |
| Household setup | Current setup/roster query and coordinator invitation create/resend/cancel operations |
| Household agreements | Propose a revision; accept, decline, or cancel that exact proposal |
| Device sessions | Own-device query, label/mode update, session revocation, activity, and lock operations |
| Dependent setup | Authorized profile query/create/update and guardian-role proposals |
| Relationship aliases | Own-alias management and a backend resolution operation |

Application mutations use stable request identities where retries could duplicate effects, and expected revisions where stale changes could overwrite another decision.

Responses distinguish committed changes, pending acceptance, conflicts, email processing status, and unavailable operations. Unauthorized resource lookups avoid revealing whether another adult’s resource exists.

All identity responses are uncached. Mutation routes enforce origin/CSRF protections independently of library authentication. Return destinations are allowlisted.

Invitation and reset secrets stay out of ordinary logs, referrers, analytics, and persisted UI state. Merely opening an enrollment/reset landing page does not complete enrollment or change a password.

## 4. Verification and acceptance

Use real PostgreSQL and actual HTTP handlers for integration tests. Browser tests use separate synthetic adults and private test fixtures; no production memory endpoints are added for testing.

| Test family | Required scenarios |
|---|---|
| Enrollment boundary | Direct signup bypass; forged, expired, canceled, wrong-email, and replayed invitations |
| Transaction integrity | Failure during account creation/email enqueue; duplicate submission; concurrent enrollment; no partial usable account |
| Household capacity | Concurrent bootstrap; duplicate household creation; simultaneous second-adult invitations; third-account rejection |
| Verification | Unverified sign-in denied; valid verification; expired link; safe repeat handling; resend |
| Independent setup | Separate preferences and consent; resumable setup; rejected AI/sharing choices preserve applicable manual access |
| Shared agreements | One acceptance is insufficient; changed revision invalidates approvals; decline and expiry remain visible |
| Authorization | Both directions of profile/settings/device isolation; owner/coordinator cannot impersonate or obtain private content |
| Guardianship | Independent acceptance; no unilateral removal; self-relinquishment; sensitive rights; dependent login denied |
| Aliases | Speaker-relative mappings; ambiguous and unavailable targets; permitted candidates only |
| Session authority | Expiry; inactivity; background lock; single-device revocation; reset revocation; other adult unaffected |
| Browser isolation | Multiple tabs; logout/switch; browser Back; delayed response; suspended tab; offline lock/sign-out and reconnect |
| Email reliability | Durable queue restart; definite failure; uncertain transport outcome; resend limits; sensitive log exclusion |
| Recovery | Each adult resets independently; old sessions fail; invalid/reused token; generic responses; direct guide available |
| Accessibility | Keyboard-only setup; labels and errors; focus management; password-manager/paste support; 200% enlargement; mobile layouts |
| Future-section handoff | Later record-policy callers receive current identity; membership alone grants no blanket access; capture/sharing tutorial steps remain pending |

Run the relevant integration/browser checks and the existing `pnpm check` suite after implementation. Retain the documented upstream declaration diagnostic separately; it does not replace strict application checking.

Record results against ACC-01–ACC-08, applicable CHD protections, BR-001–BR-005, FR-001, and the delivered portions of T01, T02, T09, T18, X17, X23, and X33. Leave later-feature portions explicitly pending.

## 5. Defaults, completion gates, and later dependencies

The following are implementation defaults, configurable where operational tuning is appropriate:

| Decision | Default |
|---|---|
| Enrollment invitation | Expires after 24 hours; one successful use |
| Verification/reset links | One-hour expiry; reset reuse rejected |
| Password policy | 12–128 characters; password-manager and paste support; maintained library hashing |
| Authentication session | Seven-day lifetime with daily renewal; application locks remain independently enforced |
| Device mode | Shared unless explicitly selected as personal |
| Sign-in throttling | Database-backed limits; initial ceiling of 20 attempts/minute per source, plus account-target protection |
| Reset/resend throttling | Three requests/15 minutes per target and five/15 minutes per source |
| Approval validity | 24 hours; material changes invalidate approvals; expired drafts follow the existing seven-day cleanup rule |
| Interface/email language | English; interaction-language preference stored separately |
| AI and push | Unavailable/off during this section; no provider or delivery consent inferred |
| Lost recovery mailbox | Explain the limitation; coordinator privileges do not provide an account-takeover workaround |

**Local Section One is complete when** two synthetic adults can independently enroll, verify, sign in, finish basic setup, accept household rules, manage sessions, and recover access; optional guardian setup and all applicable isolation checks pass.

**Before real retained household use**, the later deployed checkpoint must establish:

- Each adult’s independently controlled email and actual recovery delivery.
- HTTPS origin, secure cookie behavior, verified production sender configuration, and current operator disclosure.
- Physical-device session, lock, private-state clearing, and accessibility evidence.
- Each adult’s independent acceptance of settings and permissions.
- Daily recovery, independent restriction durability, key/operator custody, and restoration without reviving revoked access.
- Actual hosting/recovery costs within the approved allocation and reliable clock behavior.

Section Three will add private capture and complete its onboarding tutorial steps. Section Six will consume the shared-use and attribution boundaries. Section Seven will extend export, exit, succession, retirement, and deletion-aware recovery. Section Eight will extend accessible controls and operating visibility across all delivered features.

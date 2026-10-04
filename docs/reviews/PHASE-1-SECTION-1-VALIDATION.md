# Phase 1, Section One — Local validation and handoff

Prepared 4 October 2026 for branch `codex/phase-1-section-1`, following the [implementation plan](../plans/PHASE-1-SECTION-1.md), [code-structure skill](../../.agents/skills/noola-code-structure/SKILL.md), and existing [acceptance timing](../reference/ACCEPTANCE.md#browser-validation-timing). This record covers synthetic local accounts. It does not approve retained real household use or complete later-feature requirements.

## Delivered behavior

The production Identity module owns separate verified adult accounts, a single household with two reserved adult slots, transactional enrollment, private progressive settings, exact-revision household agreements, optional dependent ownership and guardian acceptance, speaker-relative aliases, and device policy. Better Auth handles password hashing, verification, sign-in, password changes and expiring reset tokens. Public signup is unavailable; the registration-only configuration is unmounted and receives the enrollment transaction.

The local operator initializes the first invitation without creating credentials or granting verification. An unused invitation can be explicitly replaced; an enrolled adult uses their own verification/recovery flow. Existing verified accounts join only after authentication, without credential replacement. Membership does not accept rules, preferences or guardianship. New sessions default to shared mode; explicit personal mode changes the inactivity deadline from five to fifteen minutes. Both deadlines are server enforced.

Mailpit captures English invitation, verification, reset and content-free recovery confirmation messages. Its web/API port binds to loopback; no forwarding or relay destination is configured. Credential-bearing application ledger payloads use authenticated encryption under the persistent auth secret. The bounded worker records queued, transport-accepted, failed and outcome-unknown outcomes, reconciles interrupted sends, and wipes accepted/expired payloads. It does not infer inbox delivery or automatically repeat uncertain sends.

The browser disposes the private QueryClient and route subtree on restriction or identity change, aborts private requests and rejects late bodies. Content-free tab signals synchronize clearing. Lock/sign-out requests can finish after disposal. A content-free pending restriction persists across an offline clear and must reconcile before protected use. The sign-in route is eagerly available so offline clearing needs no new route download. Link-token reading is pure; a post-mount effect removes the fragment without persisting the token.

Session revocation selects authentication sessions directly, including sign-ins that have not yet created a device-policy row. Device preference changes check the target's original inactivity deadline, explicit lock and authentication expiry after acquiring transaction locks; live remote devices remain editable. Browser lifecycle enforcement belongs to the persistent session scope, survives navigation to public routes, and discovers an existing cookie on an initial public-page load. A single server background command checks current policy and locks shared sessions; its keepalive request can finish during document unloading. Stronger pending sign-out or explicit lock requests survive later background events. Retry identities survive unconfirmed responses and are released immediately after a confirmed mutation, before follow-up cache work; subsequent actions receive fresh identities.

## Executed checks

| Check | Result and scope |
|---|---|
| Host/container time | Host reports synchronized NTP; running API time matches host. Expiry scenarios also use an injectable clock. |
| `pnpm check` | Passed generation drift, Biome, strict application/tool types, boundaries, 52 unit tests, independent builds and docs. |
| `pnpm test:integration` | Passed provisioning, health and restricted-role checks. |
| `pnpm test:identity` | Passed actual HTTP handlers and real PostgreSQL in disposable restricted fixtures; final expanded run passed. |
| `pnpm phase0:runtime` | Passed the existing persistence/auth runtime probe with disposable restricted fixtures. |
| `pnpm test:identity:browser:docker` | All six identity checks passed across desktop Chromium, mobile Chromium and WebKit. Four existing homepage/theme/health browser checks also passed. |
| `pnpm phase0:declarations` | Failed with the already documented upstream optional-driver/declaration errors. Preserved as a visible diagnostic under the approved backend compiler exception. |
| CI configuration | YAML parsed and required settings checked. Workflow supplies synthetic identity configuration/Mailpit and runs identity integration plus Chromium/WebKit tests. Merge requires the submitted commit's remote check to pass. |
| Inbuilt browser | Opening the local sign-in page was queued. Its automation bridge rejected the WSL workspace before executing: `sandboxCwd is not a local file URI`. Native interaction is unverified; executable browser evidence comes from Playwright. |

Integration scenarios cover concurrent bootstrap and second-slot reservations; direct signup/forged-origin rejection; anonymous and forged credentials; mismatched, forged, expired, canceled and replayed invitations; induced email-enqueue failure rolling back account/membership/token changes; duplicate enrollment without duplicate verification enqueue; authenticated joining and retry receipts; private settings and stale revisions; separate agreement decisions and invalidated/declined/expired proposals; dependent setup gating, explicit guardian approval, rejected unilateral removal, self-relinquishment and attributed corrections; private/ambiguous aliases; server locks; own-device isolation and revocation; both adults' independent resets, invalid/expired/reused tokens, unaffected other-adult sessions; reset/resend throttling; definite and uncertain email outcomes; and runtime DDL denial.

The session regressions additionally cover revocation before a session's first private request; receipt replay without duplicate security events; rejection of remote mode/label changes for idle, explicitly locked and authentication-expired sessions, including expiry while blocked on advisory and target-session locks; preservation of the calling session; and successful preference changes on live remote devices. Background commands lock shared sessions before any private-page request and preserve valid personal sessions.

Each browser journey uses separate synthetic adult contexts and its own disposable database, real API handlers and Mailpit messages. It exercises enrollment, explicit verification/sign-in, password-validation errors and focus, independent progressive setup, keyboard-only completion, personal-device selection, exact-revision rules, guardian read-only UI, private aliases, Back/Forward, multiple tabs, a delayed private response released after logout, offline background locking, offline sign-out and reconnect, independent password recovery, axe checks, 200% enlargement without horizontal overflow, and absence of page errors. Synthetic account screenshots are saved under ignored `test-results/`; no captured links are committed.

Browser regressions commit a revocation while dropping its response, verify that retry uses the same request identity, then sign in another session and confirm that a new revocation uses a fresh identity and removes it. Shared-mode offline background locking is exercised after client navigation to both the homepage and recovery guide; a separate context also opens the homepage directly with an existing shared cookie and verifies background locking. A second scenario covers failed and delayed initial policy discovery, remote personal-to-shared changes, failed private refetches and successful personal-session resumption. Offline sign-out remains pending through background/unload events and revokes the cookie on reconnection. Fresh password sign-in and personal-mode selection continue to work after each restriction.

The homepage Docker check uses the web container’s current network IP to satisfy Vite’s existing host allowlist. Browser runs are sequenced after source/build generation so development-server reloads cannot interrupt authority-sensitive assertions. Per-route splitting follows [TanStack’s documented override](https://tanstack.com/router/latest/docs/guide/automatic-code-splitting).

Browser validation found and fixed hovered-button contrast, link-fragment mutation during render, cancellation of restriction requests, offline route downloading, pending-restriction replacement, and session-policy creation/revocation races. Biome and strict types remain separate from behavioral tests.

## Browser validation follow-up

The original implementation merged in [PR #2](https://github.com/nishanthturnstile/noola/pull/2) after its required check passed. Subsequent main-branch validation exposed intermittent Linux WebKit network-process crashes and an accessibility failure during a badge variant transition. The repeated failures affected different requests, including responses the server had completed.

The installed Playwright 1.63 WebKit bundle reported libsoup 3.6.5. Its symptoms match the [reported queue-item memory defect](https://github.com/microsoft/playwright/issues/42803); WebKit [updated the library to 3.6.6](https://github.com/WebKit/WebKit/pull/74619), and Playwright's maintainer [confirmed inclusion in 1.64](https://github.com/microsoft/playwright/issues/42803#issuecomment-5837772701). Stable 1.64 was unavailable at validation time, so the test package is temporarily pinned to `1.64.0-alpha-2026-10-04`. The downloaded WebKit 2370 library reports 3.6.6, and the running network-process mappings confirm that it loads that bundle.

Axe 4.13.0's `playwright-core` peer range excludes prereleases by SemVer. The workspace permits only this exact preview for that exact Axe dependency, retaining strict peer checking. The exact release-age exceptions cover only the three matching Playwright packages. Docker installs matching Chromium/WebKit binaries and caches them in the existing development cache volume; its base image supplies Linux dependencies. Remove these temporary exceptions when adopting stable 1.64 and rerun the browser/accessibility checks.

Badges now transition shadows rather than interpolate text/background colors across status variants; primary link hover preserves contrast through brightness. Homepage navigation uses ordinary Router links with the existing button variant helper. Router recreation runs in the authority-clear event before the new private epoch renders, avoiding updates to mounted subscribers during React rendering. Identity browser tests also reject React's update-during-render console diagnostic. Existing lifecycle, delayed-response and axe assertions remain enabled.

Delayed-policy fixtures install a passthrough handler for new probes before releasing captured replies and retiring their discovery handler. This keeps removal of the last interceptor from forwarding a paused request while its held callback is still fulfilling it.

The repaired runtime passed all six WebKit checks with `--repeat-each=3`, including three complete identity journeys and three supplemental policy scenarios, with retries disabled. Final follow-up validation passed `pnpm check`, all six identity scenarios across Chromium/mobile Chromium/WebKit, and all four homepage/theme/health accessibility checks.

## Acceptance mapping

These are delivered portions, not blanket passes for the full capability or scenario.

| Requirement or scenario | Local evidence and remaining scope |
|---|---|
| ACC-01, ACC-02 | Separate credentials, verified enrollment, two-account capacity, independent private setup and consent. Production sender/mailbox acceptance remains pending. |
| ACC-03; CHD-01 | Optional synthetic owned profile, valid optional birth date, separate guardian decisions, read-only sensitive policy, attributed correction, removal approvals and self-relinquishment. Real dependent records and deployed evidence remain pending. |
| ACC-04 | Active identity and account/shared/dependent audience labels on delivered screens. Capture and conversation audiences await their sections. |
| ACC-05 | Own-device projection, explicit mode/label, current/other/single revocation, locks, cross-tab clearing and recovery revocation. Physical-device acceptance remains pending. |
| ACC-06 | Either adult resets through their own email without coordinator participation; direct guide explains mailbox/operator limitations. Durable restoration and real email delivery remain pending. |
| ACC-07; T09 | Speaker-owned mappings, private named people, unresolved/ambiguous results and permitted candidate filtering. Conversational clarification before later actions remains pending. |
| ACC-08 | Joint acceptance of exact household-rule revisions; changed proposals need new approvals. Stored quiet hours and notification choices are independent. Standing assignment categories and delivery remain pending. |
| CHD-06, CHD-10 | No dependent credential, child login, child-facing adult-data view, or child-enabled action surface. Future child-view protections must remain enforced. |
| BR-001–BR-005; FR-001 | Authentication/locks, separate owner/read/edit/export/disclosure policy, invitations cannot evict an enrolled adult, and independent recovery. Snapshots, record lifecycle, export, exit, succession/retirement and restoration await later sections. |
| T01, T02 | Independent basic onboarding, disclosure, explicit settings and household rules. First capture/save/share tutorial remains visibly pending. |
| T18, X17, X23 | Server denial and browser disposal after lock/revocation, Back/Forward, delayed replies, multiple tabs and offline reconnect. Physical/suspended-device behavior needs deployed acceptance. Offline devices cannot be remotely erased immediately. |
| X33 | Second adult's manual settings, security controls and direct recovery do not require the builder or AI. Export, reminders and durable recovery await their sections. |

## Interfaces for subsequent sections

Use the [Identity entry](../../apps/api/src/modules/identity/index.ts) to establish a current server principal from authentication headers, then call operations that recheck session, lock and membership within their transaction. Client-submitted IDs, roles or accepted flags never establish authority. Do not expose authentication tokens, backend rows, device presence or another adult's settings through contracts.

The [shared-use policy](../../apps/api/src/modules/identity/shared-policy.ts) checks joint household agreement before cross-member use. It establishes eligibility, not permission to read a private record. Every future record owner must additionally check its actual audience, ownership and lifecycle in the same operation. [Dependent rights](../../apps/api/src/modules/identity/policy.ts) distinguish owner authority from accepted guardian read-only access; callers must load current accepted relationships and apply shared-use eligibility before cross-member disclosure. [Alias resolution](../../apps/api/src/modules/identity/aliases.ts) supplies references only and grants no record authority.

Personal settings store accepted disclosure revision and explicit choices; unset retention is disabled. AI remains unavailable and push remains off. These values do not consent to an unidentified future processor. Later processor consent, source selection, notification permission/delivery, capture and tutorial completion need their own contracts and evidence.

Use [browser-safe identity contracts](../../packages/contracts/src/identity.ts) and the [API client](../../packages/api-client/src/index.ts). Mutations enforce exact origin independently of Better Auth, validate inputs, and use stable request identities for retryable effects and expected revisions for stale writes. Enrollment, household, guardian, alias-save and revocation receipts store fingerprints and minimal outcomes, never plaintext credentials.

[Security events](../../apps/api/src/modules/identity/schema.ts) record content-free sign-out, reset and revocation outcomes without a cascading account/session foreign key. Section Seven must preserve and reconcile restrictions independently when restoring an older backup; ordinary database persistence here is not proof of independently durable recovery. Email workers/cleanup reuse the owned operations and infrastructure; they cannot grant authority.

## Operating limits and next checkpoint

Follow the [local runbook](../../README.md). Preserve external configuration files and the auth secret; do not print captured links or copy configuration into the checkout. Migrations run with `noola_owner`; the API uses `noola_app`. Test fixtures alone receive administrator configuration for disposable-database creation and cleanup. No synthetic test account is initialized in the application database by the validation suite.

Real retained use remains gated on independently controlled adult mailboxes and actual delivery, HTTPS/secure cookies and production sender configuration, current operator disclosure and separate acceptance, physical-device lock/accessibility evidence, independently durable restrictions and restoration, key/operator custody, daily recovery and approved operating costs. English screens/email and stored interaction-language preferences implement the selected local scope. AI qualification and the broader Phase 0 evidence remain unchanged.

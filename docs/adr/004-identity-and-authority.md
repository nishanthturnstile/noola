# ADR-004: Identity, record authorization and approval

**Status:** Proposed.

**Validation:** Pending; see the linked gates.

**Provenance:** Extracted from the supplied product, architecture and stack baseline dated 3 October 2026. No original D-series record was available. External observations were not revalidated during consolidation.

## Context

Two adults require independent account recovery and current record-specific authority. Household coordination, dependent ownership, guardianship and operator access are different responsibilities.

<a id="decision"></a>
## Decision

Use Better Auth with its maintained Drizzle adapter, opaque database sessions, invitation-only verified email/password accounts and independent email recovery. Disable session cookie caching; enforce current authority at requests, downloads and ongoing output delivery. Keep permissions and approval revision checks in application operations, shared by direct UI and AI proposals. Mailpit captures nonproduction identity email; Resend delivers production identity/lifecycle notices through a replaceable adapter.

## Alternatives

Auth.js needs more assembly for the chosen account/recovery flow. Clerk manages identity flows but adds an external identity/disclosure boundary; ordinary token validation alone does not supply immediate application revocation. Generic organization/RBAC plugins and policy engines do not express the product’s record rights by themselves. An optional eligible ChatGPT connection must not replace independent household login or auto-link accounts solely by matching email.

## Consequences

The application still owns locks, visible-state clearing, invitation enforcement, password-reset revocation configuration and recovery notices. Library rate limits may not cover direct server API calls; equivalent protection is required at wrappers. Auth credential migration may require explicit resets rather than assuming another provider accepts existing hashes. Neither coordinator nor owner privileges confer access to the other adult’s private records. Guardian permission details remain product rules, not this ADR.

## Reconsideration trigger

Reconsider when independent recovery fails, maintenance exceeds household capacity, or an approved identity requirement changes the trade-off. Member MFA/passkeys require their own usability and recovery evidence before activation.

## Requirements and evidence

[Authentication integration](../reference/DATA-AND-SECURITY.md#authentication-integration), BR-001–BR-005, BR-010, FR-009; [G04](../reference/DECISIONS-AND-GATES.md#g04).

# ADR-002: PWA packaging and device delivery

**Status:** Accepted — evaluation direction only.

**Validation:** Pending; see the linked gates.

**Provenance:** Extracted from the supplied product, architecture and stack baseline dated 3 October 2026. No original D-series record was available. External observations were not revalidated during consolidation.

## Context

The product requires independent use on the actual household iPhone, Android and desktop browser, including required phone notifications and optional reviewed voice. Offline private archives are excluded.

<a id="decision"></a>
## Decision

Evaluate PWA-first delivery using browser-standard capture and push, an installable manifest and a narrow service worker. Cache only public static assets. Keep scheduling on the server, session authority current, private presentation in memory, and reconnect behavior explicit. Record exact device/OS/browser/installation versions and tested capabilities. Installation, browser support and device API support are separate claims.

## Alternatives

A hybrid or native client remains a reconsideration path if required phone behavior fails. Native wrapping is not selected upfront merely to obtain a more app-like appearance. Background Sync, page timers and an always-open browser are not substitutes for server reminder delivery. Inbox-only operation does not meet the required phone-push gate.

## Consequences

Actual iPhone Home Screen installation and Android push/capture must be tested, including closed, locked, denied-permission and reconnect states. Browser emulation does not prove these outcomes. Maintain feature detection and honest alternatives where APIs differ. A change of origin may require push subscription registration again. Session locks, profile switches and browser back/forward state must not expose the previous adult. This accepted direction does not approve the full architecture or certify device suitability.

## Reconsideration trigger

Reconsider packaging when the actual-device acceptance gate cannot pass within required accessibility, privacy, reliability and maintenance limits. A new client must reuse application authority and preserve direct controls.

## Requirements and evidence

[Browser matrix](../reference/TECHNOLOGY-EVIDENCE.md#browser-and-installation-matrix), FR-003/FR-006, DEV requirements, BR-001; [G01](../reference/DECISIONS-AND-GATES.md#g01).

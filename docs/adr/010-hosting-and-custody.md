# ADR-010: Hosting, storage and recovery custody

**Status:** Proposed — owner shortlist retained.

**Validation:** Pending; see the linked gates.

**Provenance:** Extracted from the supplied product, architecture and stack baseline dated 3 October 2026. No original D-series record was available. External observations were not revalidated during consolidation.

## Context

The owner limits app hosting to local Docker Compose, Railway and the existing E2E Networks Linux VM. Retained household data and current restrictions need recovery independent of a failed primary host and of the builder’s availability.

<a id="decision"></a>
## Decision

Use a portable Node/OCI application and PostgreSQL. Railway is a hosted-test option; evaluate the existing E2E VM first for self-hosted production. Private host storage holds originals; restricted OneDrive stores independently encrypted recovery generations and manifests. Keep keys in existing Vaultwarden and an independent offline copy. Evaluate the other permitted host for the synchronous restriction journal. Name and test an alternate authorized operator before production.

## Alternatives

Other app hosts and a new object-storage subscription are not selected. OneDrive Personal Vault is not the shared recovery folder. Asynchronous sync, version history and recycle bins are not assumed to meet deletion or current-journal requirements. A convenient hosted PostgreSQL template does not remove operator maintenance obligations. Laptop uptime cannot establish production availability or independent recovery.

## Consequences

Measure both durability boundaries, storage/history cleanup, native parsing, network limits, taxes and actual operator burden. Separate environments and credentials; only production enables real outbound email. Verify checksum/upload completion and expiry of every retained recovery generation, including provider trash/history. Test loss of host, keys and primary operator. Document actual operator access without promising secrecy against storage administrators. Portable bundles, separate keys and ordinary database exports support an eventual host/storage migration.

## Reconsideration trigger

Reconsider the arrangement if cost, deletion, isolation, access or independent restore gates fail. The explicit disposable vector-service exception remains narrowly scoped. Production region/processor review and full architecture approval remain pending.

## Requirements and evidence

[Hosting and custody](../reference/OPERATIONS.md#hosting-and-custody), [ADR-005](005-lifecycle-recovery.md), FR-004, BR-007/BR-008; [G03/G06/G09/G14](../reference/DECISIONS-AND-GATES.md#evidence-gates).

# ADR-008: Retrieval and evaluated evolution

**Status:** Proposed.

**Validation:** Pending; see the linked gates.

**Provenance:** Extracted from the supplied product, architecture and stack baseline dated 3 October 2026. No original D-series record was available. External observations were not revalidated during consolidation.

## Context

The household needs source-backed exact and approximate recall, multilingual input, zero unauthorized existence signals, and current correction/forgetting behavior at the defined representative workload.

<a id="decision"></a>
## Decision

Evaluate SQL filters, PostgreSQL full-text search and pg_trgm first. If required quality fails, add permission-aware hybrid pgvector retrieval with configurable model/version/dimensions and rebuildable embeddings. Compare exact retrieval with approximate indexing, filter selectivity/iterative scans and multilingual model quality before another store. Semantics may be necessary in Phase 1; it is not automatically deferred beyond Release 1.

## Alternatives

Lexical aliases and trigrams are simple but do not prove cross-language semantic quality. pgvector retains the existing data/operating boundary but adds embedding eligibility and filtering concerns. Only after tuning and model changes still fail, evaluate self-hosted Qdrant on an allowed host or a disposable free-tier comparison. That experiment is an explicitly recorded exception to the app-host shortlist, not a selected authoritative store.

## Consequences

Current source rights and manual-search versus AI-use eligibility remain authoritative even while indexes lag. External embeddings cannot include manual-only or forgotten material. Preserve provenance, source date/revision and rebuildability. Free-cluster capacity, single-node availability, manual recovery and inactivity policies prevent an experiment becoming the sole record or recovery store. Extension and model availability require actual verification; no quality score is inferred from a technology choice.

## Reconsideration trigger

Reconsider on measured recall or latency failure after appropriate query/index/model tuning. Re-evaluate at representative load and after language/model changes using the same accepted fixtures, including forbidden and unanswerable questions.

## Requirements and evidence

[Retrieval contract](../reference/APPLICATION-DESIGN.md#retrieval), SRC-01–SRC-03/SRC-07, MEM-15, DAR-012, QLT-04; [G05](../reference/DECISIONS-AND-GATES.md#g05).

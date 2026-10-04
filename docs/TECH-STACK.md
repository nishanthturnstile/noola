# Technology stack

**Draft implementation selection; validation pending.** Consolidated 3 October 2026; backend separation and frontend choices revised on 4 October 2026. The complete architecture remains unapproved. Owner-selected directions are identified separately from recommendations. No application manifest, installed dependencies, deployed compatibility or measured cost is implied. [Documentation index](README.md).

Use an independently built TypeScript/Node backend and React web client in a small pnpm workspace, with shared contracts and a reusable API client. Backend-owned household operations, one transactional database, purpose-specific adapters and bounded durable work preserve simple domain ownership. A package earns inclusion by removing demonstrated correctness or maintenance work; future capability names do not justify installing their dependencies now.

## Selection inventory

This is the single inventory of technology choices and introduction points. [Technology evidence](reference/TECHNOLOGY-EVIDENCE.md#version-snapshot) distinguishes inherited 3 October observations from 4 October research/experiments; neither is an installation prescription. “Recommended” denotes the draft approach awaiting architecture review; “conditional” requires named evidence. Code placement and coding conventions belong in the [Noola skill](../.agents/skills/noola-code-structure/SKILL.md). No row reports passing application validation.

| Area | Choice / package boundary | Status and introduction |
|---|---|---|
| Language/runtime | TypeScript; Node.js 24 LTS, ESM; built JavaScript in production | Recommended, Phase 0/1 |
| Web routing/rendering | React 19 / `react-dom`; `@tanstack/react-router`; Vite client-rendered SPA | Router owner-selected; SPA recommended, Phase 0/1 |
| Backend HTTP | Hono / `@hono/node-server`; independent startup, build and deployment | Recommended, Phase 0/1 |
| Build/development | `@tanstack/router-plugin`, Vite, compatible `typescript`, development-only `tsx`; matching Node/React/DOM/pg types | Recommended; generate route tree before checking, Phase 0/1 |
| Client | Installable PWA, browser APIs, public-static-only service worker | Owner-selected evaluation direction; actual-device gate |
| UI | shadcn/ui with Base UI (`@base-ui/react`), Tailwind CSS 4 / `@tailwindcss/vite`, `lucide-react`; CSS tokens/transitions | shadcn/Base UI owner-selected, Phase 1 |
| Forms | `@tanstack/react-form`; shared typed fields and Zod/Standard Schema validation | Owner-selected, Phase 1 |
| Server state | `@tanstack/react-query`; Router loaders coordinate the same query cache | Recommended, Phase 1 |
| URL state | `nuqs` with its TanStack Router adapter; approved nonsensitive presentation parameters | Owner-selected; experimental adapter check under G13, Phase 0/1 |
| Ephemeral state | React state/reducers and narrow context | Recommended; no direct global Store dependency initially |
| Validation | Zod 4 for external boundaries, configuration and structured proposals | Recommended, Phase 1 |
| API contracts/client | `@hono/zod-openapi`, generated OpenAPI; `openapi-typescript`, `openapi-fetch` and runtime response schemas | Recommended, Phase 0 contract proof / Phase 1; browser-safe contracts |
| Primary data | PostgreSQL 18, `pg`, Drizzle stable `drizzle-orm` and `drizzle-kit` | Recommended, Phase 1 |
| Identity | `better-auth` and matching `@better-auth/drizzle-adapter`; opaque DB sessions | Recommended, Phase 1; independent recovery gate |
| Authorization | Application-owned current record policy, approval and processing checks | Required boundary; Phase 1 onward |
| Text AI | Dedicated subscription OAuth/Responses adapter; AI SDK Core `ai` and supported gateway/provider adapters | Owner subscription-first direction; access/quality gates in Phase 0/1 |
| Paid fallback | Configurable Vercel AI Gateway first; narrow purpose/direct adapters where required | Selected direction; explicit permission/funding and eligibility gates |
| Models | Configurable candidates; discover actual connected-account availability | Evaluation choices, never assumed entitlement |
| Retrieval | Authorized SQL, PostgreSQL full-text search and `pg_trgm` | Recommended, Phase 1 |
| Semantic retrieval | `pgvector` and an eligible configurable multilingual embedding model | Quality-triggered, potentially Phase 1 |
| Durable execution | `pg-boss` with application-owned occurrence/dispatch state | Recommended, Phase 1 maintenance; Phase 2 reminders |
| Time | UTC instants plus intended local time/timezone; Temporal polyfill if needed | Phase 2 as required; recurrence extended in Phase 4 |
| Notification transport | Standard Web Push/VAPID; provisional `web-push` adapter after maintenance review | Phase 0 feasibility; Phase 2 reliance |
| Email | Private Mailpit without relay in nonproduction; Resend HTTPS in production; maintained SMTP client for testing | Selected direction, Phase 1; actual production delivery gate |
| File/capture | MediaRecorder negotiation; PDF.js, Sharp and verified libheif/libde265 decoder artifacts; isolated parser | Recommended, Phase 3; actual-artifact gate |
| Retained storage | Private permitted-host storage; separate temporary processing; authenticated original/export access | Recovery from Phase 1; retained originals from Phase 3 |
| Recovery | Encrypted OneDrive bundles, separate Vaultwarden/offline keys, independent restriction journal | Selected direction; durability/custody proof pending |
| Hosting | Local Docker Compose; Railway hosted testing; existing E2E Networks Linux VM | Owner-approved shortlist; production choice requires measurement |
| Diagnostics | `pino`; application-owned audit, health and cost records | Recommended, Phase 1 |
| Verification | `vitest`, `@playwright/test`, `@axe-core/playwright`, real PostgreSQL and actual phones | Recommended, incremental acceptance |
| Code quality | Pinned `@biomejs/biome` with `biome.json`; separate TypeScript checks | Selected development convention |
| Package management | Exact pnpm version, workspace support and committed lockfile; ordinary package scripts | Selected convention; independent web/backend builds with shared contracts/client code |
| Delivery/security | GitHub Actions/Dependabot; pnpm audit and pinned Gitleaks CLI | Recommended; GitHub remote configured, no pipeline yet |

## Application and data integration

Use [ADR-001](adr/001-application-structure.md) for application structure and [ADR-003](adr/003-persistence.md) for persistence. Hono is the backend transport candidate; TanStack Router owns web navigation and load coordination. Thin HTTP bindings, approved AI proposals and jobs call the same backend operations. Generate wire types from contract schemas; validate actual inputs and outputs on both sides. Clients never import backend modules or database rows. No GraphQL, tRPC or public API platform is selected.

Build web and backend independently; initially serve both through one origin on a permitted host, with private `/api/v1` product endpoints and `/api/auth` authentication. A later native client uses the same HTTP contracts and backend behavior; its platform remains deferred. The [code structure review](reviews/CODE-STRUCTURE-REVIEW.md) records contract experiments and their limits.

Drizzle migrations are reviewed SQL, tested against PostgreSQL, committed and applied once with migration credentials. Stable-compatible APIs must not be mixed with RC-only documentation. Share the transaction/pool boundary with deliberate parameterized SQL. Schema push is not a production migration procedure. Extensions and destination-host compatibility require verification.

Better Auth supplies maintained authentication machinery; the application retains invitation gating, device locks, current rights, independent recovery and clearing of private client state. Cookie caching stays disabled. Do not implement custom password hashing, session cryptography or push encryption merely to avoid a maintained dependency. [Identity integration](reference/DATA-AND-SECURITY.md#authentication-integration) contains the exact boundary and rate-limit obligations.

Generate shadcn components explicitly for Base UI and commit owned source and `components.json`. TanStack Form owns editable form state, Query owns remote data, nuqs owns allowed URL state and React owns ephemeral interactions. Share typed fields and repeated compositions inside the web app. Persistent private caches, raw HTML rendering, rich editors and duplicate state owners have no initial requirement. [ADR-013](adr/013-accessible-ui.md) explains the selected UI direction.

The [full TanStack review](reviews/TANSTACK-AND-UI-REVIEW.md) evaluates every current catalog entry. Table, Virtual, Pacer and Hotkeys require actual interaction needs; Store requires shared client-only state; DB requires a reviewed collection/synchronization need. Start adds a server framework and is deferred. AI is an alternative to evaluate against existing provider contracts. Config, CLI, unified Devtools, Charts, Markdown, Highlight and Intent are optional tools or deferred capabilities, not an installation bundle.

## Providers, capture and durable operation

Each adult’s eligible ChatGPT plan is the first AI funding route, with independently authorized paid fallback. Household identity and authority stay application-owned. The source candidates remain GPT-6 Luna for paid text/structured work, GPT-6.1 Sol as an alternative, gpt-transcribe and gpt-4o-mini-transcribe for transcription comparison, and gpt-4o-mini-tts for requested speech, only where actually available and qualified. Existing multimodal/web routes remain configurable candidates. No model name guarantees account access, modality support or quality.

Keep subscription OAuth credentials separate from gateway API credentials. The dedicated subscription adapter must respect its actual request/capability restrictions; speech, embeddings and other unsupported operations require an authorized purpose route. Shared routines identify their consenting funding principal. Paid-budget exhaustion pauses all optional AI features across paid and subscription routes, including background work; manual controls and direct briefs continue. Nonproduction may evaluate any available model/processor in any affordable available region without production residency, no-training qualification or thirty-day processor-retention eligibility gates. Actual access/terms, permissions, funding approval and informed consent for real data still apply. The [provider contracts](reference/APPLICATION-DESIGN.md#provider-contracts), [ADR-007](adr/007-ai-boundaries.md), and G02/G03 own eligibility and disclosure details; the [resolved policy clarifications](reference/DECISIONS-AND-GATES.md#open-policy-questions) do not imply passing validation.

Queue state is not notification delivery or cancellation proof. pg-boss supplies durable lifecycle machinery while application state owns versions, receipts, eligibility and handoff serialization. Split a worker only for measured host limits, contention or isolation. The [dispatch contract](reference/APPLICATION-DESIGN.md#dispatch-integration) preserves scan/retry defaults and required race tests. Do not add a broker or second queue platform without a demonstrated limitation.

Voice and document processing reuse policy and action boundaries. Verify actual Linux native artifacts and iPhone HEIC inputs; Sharp alone does not establish decoder support. Keep parsing isolated, resource-bounded and credential-free. [Capture contracts](reference/APPLICATION-DESIGN.md#capture-and-parsing) preserve MIME negotiation, parser defaults, interruption handling and consent timing. Deployment details and recovery procedures live in [operations](reference/OPERATIONS.md).

## Versions, dependencies and verification

At scaffold time, verify supported releases, project maturity and compatible peers, then pin direct dependencies, runtime/package-manager versions and production artifacts. Commit the lockfile and `biome.json`; use frozen installs in CI. Router and its plugin have different observed patch versions; honor peer ranges rather than forcing matching numbers. The OpenAPI generator experiment needed TypeScript 5.9.3 instead of latest 7.x. The updated evidence tables require adoption-time revalidation under G13.

Use strict TypeScript, checked external schemas and exhaustive domain states. Biome formats and lints supported source files; TypeScript checking, tests and SQL constraints remain separate. Do not add parallel ESLint/Prettier formatting for the same files. A demonstrated unsupported semantic rule may justify a narrowly scoped tool. Markdown needs prose and link review, not a new application toolchain.

The future pipeline runs Biome, route/OpenAPI/client generation and drift checks, strict TypeScript and package-boundary checks, migrations/integration tests, independent builds and critical Playwright/axe flows, plus dependency and secret checks. The first UI proof covers URL navigation, typed forms, Base UI accessibility and identity/cache clearing. Use synthetic fixtures and no production credentials in pull requests. Browser emulation supplements actual-phone/manual evidence. [Acceptance tooling](reference/ACCEPTANCE.md#verification-tooling) defines responsibilities.

Approve only necessary lifecycle/native build scripts. Keep credentials in ignored local environment files and document only non-secret examples. Do not suppress peer incompatibility with ignored warnings or broad casts. Native artifacts need separate Linux validation. Patch dependencies promptly; review majors and pre-1.0 changes with relevant regression checks. No Husky, lint-staged, monorepo orchestrator or remote build cache is needed initially.

## Introduction and replacement rules

Install only dependencies needed by the active workflow. Phase 0 experiments do not automatically become production dependencies. Phase 1 establishes identity, retained text, retrieval, durable maintenance, export/recovery and observability. Phase 2 introduces delivery/time support; Phase 3 introduces capture, parsing and retained originals. Phases 4–5 mainly extend existing domains. The [roadmap](ROADMAP.md#delivery-sequence) owns the accepted sequence.

Semantic retrieval may enter early on measured recall failure; another search store follows database/model tuning. The disposable vector-service exception does not enlarge the app-host shortlist. Sentry or OpenTelemetry require observed diagnostic need. New device/connection SDKs require a selected future branch. No Redis, generalized agent framework, autonomous memory platform, microservices, Kubernetes, commercial billing or enterprise identity is an automatic graduation path.

Provider replacement preserves source references, lifecycle, consent, receipts and manual continuity, not merely API shape. [ADRs](adr/README.md#decision-index) retain meaningful alternatives and exit consequences. Full cost feasibility, production arrangements and all device/recovery results remain [pending evidence](reference/DECISIONS-AND-GATES.md#evidence-gates).

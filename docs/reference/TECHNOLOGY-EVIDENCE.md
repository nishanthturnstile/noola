# Technology evidence

Inherited research attributed by the original stack to 3 October 2026. This consolidation did not recheck external sources, registries, prices, provider access or compatibility. None of these observations proves installed or deployed compatibility.

[Documentation index](../README.md). Consolidated 3 October 2026; implementation and validation remain pending.

Revalidate relevant claims before installing dependencies or enabling a provider. Record the exact configuration, source URL, observation date, scope and result under the applicable [evidence gate](DECISIONS-AND-GATES.md#evidence-gates). Core technology choices remain in the [stack](../TECH-STACK.md#selection-inventory); rationale belongs in [ADRs](../adr/README.md).

<a id="deferred-technologies"></a>
## Deferred Technologies

| Technology / Capability | Why Deferred | Trigger to Introduce |
|---|---|---|
| `pgvector` and eligible embeddings/reranking | Lexical baseline must be evaluated first | SRC-02/QLT-04 fails without semantics, potentially Phase 1 |
| Dedicated vector/search service | Another data lifecycle and authorization boundary | PostgreSQL tuning cannot meet measured quality/latency/load requirements |
| Redis/distributed cache | No demonstrated safe cache use case | Measured bottleneck with a proven authorization-aware invalidation design |
| Additional queue platform | pg-boss/PostgreSQL already covers initial durable work | Only if measured host/runtime requirements cannot be met |
| Separate worker deployment | Initial bounded runner shares application | Host limits, parser isolation or measured contention |
| Managed queue/job platform | Additional provider and cost | Existing database execution cannot meet an enabled requirement |
| WebSockets/managed realtime | Foreground revalidation/polling suffice | Measured update requirements exceed current approach |
| Native/hybrid phone client | Outside current PWA-first work | Reconsider with Nishanth only if a required actual-phone capability cannot be supported |
| Global state/form library | Framework/local state covers initial UI | Concrete cross-route client-only state or complex dynamic forms |
| Sentry/OpenTelemetry backend | Initial redacted diagnostics available | Failure diagnosis or multiple runtimes justify cost and disclosure |
| Dedicated AI observability/eval service | Small fixture-based evaluation is sufficient initially | Team/eval scale creates measured administration cost |
| Rich-text editor | Plain editable text and export satisfy current needs | Approved editing requirement beyond text fields |
| Workspaces/build orchestrator | One application package | Separately built units, then measured build coordination need |
| External-account SDKs and channels | Selected Phase 9 scope only | Approved connection contract, permission and disconnect gates |
| Continuous voice/live-media SDK | Explicit recording is sufficient | Selected Phase 10 capability with device and consent evidence |

<a id="compatibility-snapshot"></a>
## Compatibility Matrix

“Works With” means documented runtime/peer compatibility or an identified protocol integration. It does not mean this application has been built or tested.

| Technology | Works With | Important Constraint |
|---|---|---|
| Node 24 LTS | Selected router, Vite, auth, DB, AI, test tools | Keep security patches current; Node 20 is not acceptable merely because some packages permit it |
| React Router 8.4 | React 19.3; Node 24; TypeScript 7 | Requires Node ≥22.22 and React/DOM ≥19.2.7; align all router adapters |
| Express adapter 8.4 | Express 5.2 | Use ESM and correct Express 5 path syntax; explicit startup/shutdown |
| Vite 8 | Router dev adapter, Tailwind Vite integration, Vitest 5 | Build bootstrap explicitly; no unneeded RSC/Cloudflare optional integrations |
| React Aria 1.21 | React 19 | Test actual focus, touch and screen-reader behavior; do not assume accessibility from installation |
| Tailwind 4 | Vite 8; modern phone browsers | Safari 16.4+, Chrome 111+, Firefox 128+ core baseline |
| PostgreSQL 18 | `pg` 8, Drizzle stable | Use supported backup tools; verify `pg_trgm` and any triggered `pgvector` image |
| Drizzle 0.45 / Kit 0.31 | Better Auth 1.7 and separate adapter | Stable Relations v1, not RC-only Relations v2 examples |
| Better Auth | Express 5, Drizzle, PostgreSQL | DB sessions; cookie cache off; explicit reset revocation and application locks |
| AI SDK 7 / OpenAI adapter 4 | Node ≥22, Zod 4.6 | Configure provider directly; explicit Responses storage off; endpoint-specific options |
| Recovery storage | Authenticated encrypted OneDrive upload and private host storage | Verify checksums, history/trash expiry, key custody and independent journal durability |
| Railway app/DB | Always-on Node and PostgreSQL | Sleeping disabled; duration/body limits, DB maintenance and memory/volume budget remain gates |
| Web Push | PWA service worker and `web-push` adapter | iPhone Home Screen install and actual consent/device tests; no delivery guarantee |
| PDF.js 6 / Sharp 0.35 | Node 24, Phase 3 | Linux native packages and bounded parser isolation; HEIC codec build is separate |
| Temporal polyfill | Node and supported browser bundle | Use only required APIs; no automatic DST/recurrence policy |
| Vitest 5 / Playwright 1 | Node 24 and Vite 8 | Browser binaries pinned with test package; emulation does not replace actual phones |

The original stack reported inspecting peer ranges in official npm metadata, including [router dev](https://registry.npmjs.org/@react-router/dev), [Express adapter](https://registry.npmjs.org/@react-router/express), [auth adapter](https://registry.npmjs.org/@better-auth/drizzle-adapter), [AI SDK](https://registry.npmjs.org/ai), and [Vitest](https://registry.npmjs.org/vitest). A future scaffold must run install/build/integration checks rather than suppress peer warnings.

<a id="version-snapshot"></a>
## Version Strategy

The original stack attributed the following observations to official registries and release/support pages inspected on 3 October 2026. These inherited numbers are not independently reverified evidence, not permission to leave an old vulnerable patch installed. Recheck when implementation starts and capture the compatible exact set in manifests/lockfiles and image references. Exclude prerelease identifiers even when a registry labels one `latest`.

| Technology | Recommended Version Strategy |
|---|---|
| [Node.js](https://nodejs.org/en/about/previous-releases) | 24 LTS, latest security patch; 26 remains Current at research time |
| [TypeScript](https://registry.npmjs.org/typescript) | Stable 7.x, observed 7.0.2, released 8 July; compiler/tool compatibility checked before updates |
| [React](https://registry.npmjs.org/react) / [React DOM](https://registry.npmjs.org/react-dom) | Matching 19.3.0 observed, released 9 September; pin together |
| [React Router](https://registry.npmjs.org/react-router) and official adapters | Matching 8.4.0 observed, released 15 September; stable framework mode only |
| [Express](https://registry.npmjs.org/express) | Stable 5.x; observed 5.2.1 |
| [Vite](https://registry.npmjs.org/vite) | Supported stable 8.x; observed 8.3.2, released 1 October |
| [Tailwind](https://registry.npmjs.org/tailwindcss) / [Vite plugin](https://registry.npmjs.org/@tailwindcss/vite) | Matching stable 4.x; observed 4.3.3, released 16 July |
| [React Aria Components](https://registry.npmjs.org/react-aria-components) | Stable 1.x; observed 1.21.1, released 4 September |
| [Lucide React](https://registry.npmjs.org/lucide-react) | Stable 1.x; observed 1.51.0, released 3 October; do not assume old 0.x examples are current |
| [Zod](https://registry.npmjs.org/zod) | Stable 4.x; observed 4.6.5, released 13 September |
| [PostgreSQL](https://www.postgresql.org/support/versioning/) | 18, current minor observed 18.6; supported to November 2030; review major upgrades |
| [Drizzle ORM](https://registry.npmjs.org/drizzle-orm) / [Kit](https://registry.npmjs.org/drizzle-kit) | Stable observed 0.45.3 / 0.31.11, released 21 September; pin exact compatible pre-1.0 versions; avoid 1.0 RC |
| [node-postgres](https://registry.npmjs.org/pg) | Stable 8.x; observed 8.23.1, released 30 September |
| [Better Auth](https://registry.npmjs.org/better-auth) / [Drizzle adapter](https://registry.npmjs.org/@better-auth/drizzle-adapter) | Matching 1.7.7 observed, released 30 September; review security and migration notes together |
| [AI SDK](https://registry.npmjs.org/ai) / [OpenAI adapter](https://registry.npmjs.org/@ai-sdk/openai) | Stable 7.0.127 / 4.0.83 observed, 1 October / 30 September; upgrade as compatible pair |
| Model endpoints | Evaluated configured model ID; record snapshot/version when available; a provider alias is not a reproducible lockfile |
| [Pino](https://registry.npmjs.org/pino) | Stable 10.x; observed 10.4.0, released 2 October |
| [Vitest](https://registry.npmjs.org/vitest) | Stable 5.x; observed 5.0.3, released 30 September; align any later Vitest add-ons |
| [Playwright](https://registry.npmjs.org/@playwright/test) | Stable 1.x; observed 1.63.0, released 4 September; matching browser binaries |
| [axe Playwright](https://registry.npmjs.org/@axe-core/playwright) | Stable 4.x; observed 4.13.0, released 11 August |
| [Biome](https://registry.npmjs.org/@biomejs/biome) | Pin exact stable 2.x; observed 2.5.15, released 30 September |
| [pnpm](https://registry.npmjs.org/pnpm) | Pin exact stable 12.x; observed 12.8.1, released 28 September |
| [tsx](https://registry.npmjs.org/tsx) | Development only, observed 4.23.15, released 20 September |
| [Gitleaks](https://github.com/gitleaks/gitleaks/releases/tag/v8.30.1) | Pinned verified CLI binary/checksum; observed stable 8.30.1 |
| [web-push](https://registry.npmjs.org/web-push) | Phase 2 only, observed 3.6.7 from January 2024; recheck security/maintenance before adoption |
| [Temporal polyfill](https://registry.npmjs.org/@js-temporal/polyfill) | Phase 2 if needed, observed 0.5.1 from March 2025; pin/test pre-1.0 API |
| [Sharp](https://registry.npmjs.org/sharp) / [PDF.js](https://registry.npmjs.org/pdfjs-dist) | Phase 3 stable observed 0.35.5 / 6.3.289; pin production native artifacts and parser versions |
| [libheif](https://github.com/strukturag/libheif/releases) | Phase 3 candidate 1.23.5 observed, released 21 September; codec/build decision remains gated |

The original maintenance observations cite releases from [React Router](https://github.com/remix-run/react-router/releases), [Drizzle](https://github.com/drizzle-team/drizzle-orm/releases), [Better Auth](https://github.com/better-auth/better-auth/releases), [AI SDK](https://github.com/vercel/ai/releases), and the September registry publications above. Slow protocol-library release cadence alone is not abandonment: the [web-push main branch](https://github.com/web-push-libs/web-push/commits/master/) had September 2026 maintenance commits, and the [Temporal polyfill](https://github.com/js-temporal/temporal-polyfill/commits/main/) had September conformance work. Neither fact proves a particular published package is vulnerability-free; both carry explicit adoption checks.

Queue candidates were also checked: [pg-boss](https://registry.npmjs.org/pg-boss) 12.36.0 and [Graphile Worker](https://registry.npmjs.org/graphile-worker) 0.18.0 are current maintained options. pg-boss is now the selected queue recommendation; recheck its compatible stable version at implementation. Graphile remains an alternative, not a second initial dependency.

<a id="licensing-snapshot"></a>
## Licensing Review

Licenses were checked against official package metadata and linked repository notices. Hosted services also have commercial terms and data-processing conditions; an SDK license does not grant service rights or establish privacy eligibility. Preserve notices and review the actual resolved transitive/native artifacts at implementation.

| Technology | License | Concern |
|---|---|---|
| Node.js | MIT plus bundled third-party notices | Preserve runtime notices in distributed images |
| TypeScript | Apache-2.0 | Notice/license obligations |
| React, React Router, Express, Vite | MIT | Permissive; preserve notices |
| Tailwind CSS | MIT | Paid Tailwind products are separate; none selected |
| React Aria Components | Apache-2.0 | Preserve license/NOTICE where applicable |
| Lucide | ISC; inherited Feather material has MIT notices | Preserve applicable icon notices; [Lucide license](https://lucide.dev/license) |
| Zod, `pg`, Drizzle Kit | MIT | Permissive |
| Drizzle ORM | Apache-2.0 | ORM and Kit have different licenses |
| PostgreSQL / pgvector | PostgreSQL License | Permissive; [PostgreSQL license](https://www.postgresql.org/about/licence/), [pgvector repository](https://github.com/pgvector/pgvector) |
| Better Auth and Drizzle adapter | MIT | Commercial auth hosting/products are separate |
| AI SDK and OpenAI adapter | Apache-2.0 | Model API commercial/data terms remain separate |
| Pino, Vitest, pnpm, tsx | MIT | Permissive |
| Playwright | Apache-2.0 | Browser distributions include their own notices |
| Biome | MIT OR Apache-2.0 | Follow the chosen license and distribution notices |
| axe integration / web-push | MPL-2.0 | File-level copyleft; review distribution of modified covered files, not a blanket proprietary-app prohibition |
| Temporal polyfill | ISC | Permissive |
| Sharp / PDF.js | Apache-2.0 | Native libraries/codecs have additional terms |
| libvips; libheif/libde265 | LGPL-2.1-or-later; LGPL v3 family respectively | Native distribution/relinking notices and codec/patent review required before selecting build |
| Gitleaks CLI | MIT | Hosted action/service licensing may differ; use verified CLI distribution |
| pg-boss / Graphile Worker | MIT | pg-boss selected; Graphile Worker remains an alternative |
| Railway/E2E, OneDrive, Resend, gateway/model APIs | Commercial service terms | Pricing, regions, data access and retention must qualify separately |

The Phase 3 HEIC build is the material non-permissive native dependency question. Do not label the entire future stack MIT/Apache or make a jurisdiction-specific patent assurance. [libheif license](https://github.com/strukturag/libheif/blob/master/COPYING), [libde265 license](https://github.com/strukturag/libde265/blob/master/COPYING), [libvips license](https://github.com/libvips/libvips/blob/master/LICENSE)

<a id="technology-risks"></a>
## Technology Risks

| Risk | Technology | Impact | Mitigation |
|---|---|---|---|
| Published retention exception exceeds product bound | AI processors | Real-data operation cannot qualify | TD-002 exact terms/configuration review; synthetic-only until resolved |
| Fixed baseline cannot cover measured operation | Hosting/recovery | Product feasibility failure | TD-003 complete costing; no hidden paid upgrade or weaker recovery |
| Independent recovery needs unavailable operator access | Hosting/storage/auth | Builder remains a single point of operational dependence | Test adult account recovery and infrastructure recovery separately |
| Old snapshot restores revoked authority | PostgreSQL/object recovery | Privacy breach | Independent current restriction journal; fail-closed restore; TD-004 |
| Stale worker submits after acknowledged cancellation | Runner/push | Unstoppable or duplicate prompts | Serialize handoff, preserve unknown outcomes, fault-injection tests; TD-007 |
| PWA push/capture fails on actual phones | Browser/PWA | Required Release 1 capability absent | Early device gate; native/hybrid fallback without inbox-only substitution |
| Lexical retrieval misses mixed-language meaning | PostgreSQL search | QLT-04 failure | Separate Tamil/transliteration fixtures; trigger eligible semantic retrieval |
| Stable and preview APIs are mixed | Drizzle/Prisma/framework docs | Broken builds or unsupported production dependency | Registry/release verification; stable pinned set; no ignored peer errors |
| Parser or HEIC codec creates native-build/security burden | Sharp/PDF.js/libheif | Failed uploads, resource exhaustion or licensing issue | Phase 3 actual-image/container tests, restricted parsing and patch policy |
| Old published protocol package lags fixes | `web-push` | Push compatibility/security uncertainty | Current repository activity noted; inspect advisories and compare maintained alternatives before Phase 2 |
| UI caching retains prior identity | Router/browser/service worker | Private disclosure on shared device | No-store, explicit lock/logout clearing, history/resume regression tests |
| Telemetry leaks prompt or existence metadata | Logs/SDK/platform | Violates privacy boundary | Allowlisted fields, redaction tests, no prompt-tracing SaaS |
| Native/SDK upgrades change behavior | Toolchain/provider adapters | Regression despite accepted version range | Lockfiles, Linux artifact tests and targeted model/provider contract checks |
<a id="browser-and-installation-matrix"></a>
## Browser and installation matrix

Support current supported browser/OS versions and record the exact tested versions. A web-app support claim is separate from installation, push and background feature claims.

| Platform | Web use and installation | Required evidence |
|---|---|---|
| iPhone/iPad | Safari web use and Home Screen installation; installed Web Push on supported iOS/iPadOS 16.4+ with user-initiated permission | Installation, permission, closed/locked push, audio capture and reopening under the right identity |
| Android | Chrome installation; Edge/Firefox home-screen behavior depends on browser/OS | Actual installation mode, push, capture, backgrounding and reconnect |
| Windows | Chrome/Edge installed PWA; supported Firefox Windows web-app integration where available | Browser/version-specific installation and core workflows; no assumed feature parity |
| macOS | Chrome/Edge installation and Safari Add to Dock on supported Safari/macOS; Firefox web use | Actual notification/capture permissions and core workflows |
| Linux | Chrome/Edge installation where supported; Firefox web use | Actual supported distribution/browser behavior |

Do not promise Firefox desktop installation on macOS/Linux or universal background APIs. Scheduling lives on the server; Background Sync and page timers are not reminder dispatch mechanisms. Service workers cache only public static assets and do not store household conversations or sensitive responses. [Installation differences](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable), [Firefox Windows web apps](https://support.mozilla.org/en-US/kb/web-apps-firefox-windows), [iOS installed Web Push](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/), [Background Sync availability](https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API)

## Decision research provenance

The following are inherited supporting sources and comparison observations, not newly checked claims. The ADR owns the choice; these links support adoption-time revalidation.

| Decision | Retained observation / source |
|---|---|
| Application framework | The supplied comparison favored explicit process lifetime. Recheck [Router upgrade requirements](https://reactrouter.com/upgrading/v7), [Next.js custom-server/standalone constraints](https://nextjs.org/docs/app/guides/custom-server), and [SvelteKit migration requirements](https://svelte.dev/docs/kit/migrating-to-sveltekit-3). It reported Kit 3 requiring TypeScript 6 and an auth peer still targeting Kit 2; these were research snapshots. |
| Runtime | [Node support policy](https://nodejs.org/en/about/previous-releases), [Bun compatibility](https://bun.com/docs/runtime/nodejs-compat), [Deno compatibility](https://docs.deno.com/runtime/fundamentals/node/), and [pnpm compatibility](https://pnpm.io/installation) underpin the selected Node/pnpm direction. |
| UI | [React Aria quality](https://react-aria.adobe.com/quality), [Base UI](https://base-ui.com/react/overview/quick-start), and the inherited [shadcn July 2026 default-change reference](https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/changelog/2026-07-base-ui-default.mdx) require rechecking when comparing foundations. |
| Persistence | [SQLite appropriate uses](https://www.sqlite.org/whentouse.html), [PostgreSQL](https://www.postgresql.org/docs/18/index.html), and [MySQL](https://dev.mysql.com/doc/refman/8.4/en/) informed the concurrent-work and retrieval comparison, not an assertion that household size exceeds SQLite capacity. |
| Query layer | The source reported Prisma registry latest as 8.0 RC while 7.10.0 was stable. Recheck [Prisma metadata](https://registry.npmjs.org/prisma), [requirements](https://www.prisma.io/docs/orm/v7/reference/system-requirements), [Drizzle releases](https://github.com/drizzle-team/drizzle-orm/releases), and [Kysely](https://kysely.dev/docs/getting-started). |
| Identity | [Auth.js maintainer direction](https://better-auth.com/blog/authjs-joins-better-auth) and [Clerk session tokens](https://clerk.com/docs/guides/sessions/session-tokens) supported the identity comparison; neither source proves this application’s immediate revocation or recovery. |
| Retrieval | [pgvector filtering/indexing](https://github.com/pgvector/pgvector), [embedding models](https://developers.openai.com/api/docs/guides/embeddings), [Qdrant quickstart](https://qdrant.tech/documentation/quickstart/) and [cloud limits](https://qdrant.tech/documentation/cloud/create-cluster/) support the staged evaluation. The original small/large OpenAI embedding candidates are unapproved, configurable candidates. |

## Verification-tool trade-offs

Vitest fits the Vite/TypeScript test environment and mocking needs; the native Node runner is lighter but needs more assembly, and Jest introduces another toolchain. Playwright covers multiple browser engines and API tests; Cypress was considered. Existing real-browser component tests avoid another simulated-DOM runner initially, at the cost of slower feedback. Biome plus the compiler reduces duplicate configuration; specialized missing rules may justify targeted ESLint use, but duplicate formatters remain excluded. Reconsider tools only for demonstrated coverage or feedback problems. See [Vitest releases](https://github.com/vitest-dev/vitest/releases), [Playwright releases](https://github.com/microsoft/playwright/releases) and [Biome releases](https://github.com/biomejs/biome/releases).

GitHub Actions/Dependabot retain portable package/test commands as their exit path. Exact runtime type packages must match Node, React, React DOM, Express and pg. A pinned matching Better Auth CLI may generate auth schema when needed; it is not a runtime dependency. PostgreSQL client tools, Node, pnpm, the container engine and Gitleaks are tools rather than application npm dependencies. No initial production dependency on optional push, Temporal, parsers, embeddings, alternate queues, telemetry, rich editors or Phase 9/10 SDKs is implied before their introduction gate.

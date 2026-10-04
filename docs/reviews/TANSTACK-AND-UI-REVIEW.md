# TanStack and UI architecture review

**Reviewed:** 4 October 2026. **Selection status:** Nishanth chose TanStack Router, shadcn/ui with Base UI, TanStack Form and nuqs. Query and the implementation details below are recommendations. **Validation:** Documentation and official registry inspection only; no application install, browser test or performance benchmark was performed in this review.

The [technology stack](../TECH-STACK.md#selection-inventory) owns selections; [frontend integration](../reference/APPLICATION-DESIGN.md#frontend-integration) owns implementation boundaries; [ADR-013](../adr/013-accessible-ui.md) records the owner decision. This review supplies research and adoption criteria, alongside the [backend/code structure review](CODE-STRUCTURE-REVIEW.md). Code placement and coding standards now belong to the [Noola skill](../../.agents/skills/noola-code-structure/SKILL.md).

## Recommended starting point

Use a React/Vite SPA with TanStack Router, shadcn's Base UI components, Tailwind 4, TanStack Form, TanStack Query and nuqs. The independently built Node backend retains operations, identity, policy and database ownership. These choices support shared API contracts and later clients without putting business rules into a web framework.

React Router Framework mode and TanStack Router are different products. The selected package is `@tanstack/react-router`; its name includes “react-router” but belongs to TanStack. TanStack Start adds full-stack rendering/server functionality to Router. A private PWA has no established SSR requirement, so Start is deferred; reconsider rendering only if measured initial-load behavior needs it. [Router](https://tanstack.com/router/latest), [Start](https://tanstack.com/start/latest).

The requested URL library is **nuqs**, a React query-string state library. Nuxt is a separate application framework and is not selected. Router's own search support and nuqs overlap; use one shared parser definition and explicit ownership rather than maintaining two sets of URL rules.

## Complete TanStack catalog assessment

The current [official catalog](https://tanstack.com/libraries) lists 18 entries. Every entry is assessed below. Status labels describe the observed project site, not a guarantee of package stability or application compatibility. Recheck documentation, releases and exact artifacts at adoption. The recommendations are Noola-specific engineering judgments.

| Library | Capability and observed maturity | Noola decision and introduction condition |
|---|---|---|
| [Start](https://tanstack.com/start/latest) | SSR, streaming and server functions around Router; site labels RC | Deferred. Add only for an evidenced web-rendering need; backend operations stay in the independent API |
| [Router](https://tanstack.com/router/latest) | Typed routes, parameters, search validation, loaders and navigation | Selected. Use file-based routing, generated types, lazy feature boundaries and safe authenticated navigation |
| [Query](https://tanstack.com/query/latest) | Remote-data lifecycle, deduplication, mutations and invalidation | Recommended initially. One in-memory remote-data owner with explicit privacy, retry and freshness rules |
| [DB](https://tanstack.com/db/latest) | Reactive typed collections/live queries with optimistic changes; beta | Deferred. Require a concrete relational client-view/synchronization problem that Query cannot reasonably cover, plus revocation/cache-lifecycle proof |
| [Store](https://tanstack.com/store/latest) | Reactive local state and derived subscriptions; alpha | Conditional direct use. Add for genuinely shared client-only state spanning independent features; avoid copying Query/form/URL data into it |
| [AI](https://tanstack.com/ai/latest) | Typed AI integration, adapters, tools and agent execution; RC | Alternative to evaluate, not a second AI framework. Existing subscription adapter/AI SDK proposal stays; any replacement must preserve output checks, approvals, funding and AI-pause rules |
| [Table](https://tanstack.com/table/latest) | Headless grid sorting, filtering, pagination and selection | Conditional. Use for a feature needing richer tabular interaction, paired with owned shadcn rendering; small phone lists can remain cards/native tables |
| [Charts](https://tanstack.com/charts/latest) | Typed SVG/Canvas chart composition; site labels alpha | Deferred until an approved view requires a chart. Evaluate accessibility, bundle cost and exact maturity; do not add a charting library for a few counters |
| [Form](https://tanstack.com/form/latest) | Typed form values, field validation and reusable field composition | Selected. Share structural schemas and field components; backend rechecks policy, revisions and business meaning |
| [Markdown](https://tanstack.com/markdown/latest) | Markdown parsing/rendering; introduced as alpha | Deferred. Current escaped text and Markdown export do not need a renderer; enabling formatted untrusted display requires content/link/image review |
| [Highlight](https://tanstack.com/highlight/latest) | Syntax highlighting with modular language imports; alpha site label | Deferred. No current household workflow requires a code display; add only for a selected feature |
| [Virtual](https://tanstack.com/virtual/latest) | Windowed rendering of long lists/grids | Conditional on measured list/chat rendering pressure. Test focus, scrolling, finding content and screen-reader behavior; not a substitute for server pagination |
| [Pacer](https://tanstack.com/pacer/latest) | Debounce, throttle, batching and bounded execution; beta | Conditional for repeated foreground timing needs such as noisy search input. Browser pacing does not enforce backend budgets, auth limits or durable schedules |
| [Hotkeys](https://tanstack.com/hotkeys/latest) | Scoped keyboard commands, sequences and conflicts; alpha | Conditional once a reviewed desktop shortcut set needs it. Preserve typing and browser/assistive shortcuts; every action retains a visible control |
| [Devtools](https://tanstack.com/devtools/latest) | Unified extensible inspection shell; alpha | Optional development-only tooling. Start with relevant Router/Query panels if needed; inspect production output for debug panels, logs and private-data exposure |
| [Config](https://tanstack.com/config/latest) | Shared package build/lint/version/publishing conventions | Not selected initially. Plain pnpm scripts and pinned Biome cover this repo; importing the whole preset brings unrelated release/ESLint/Nx machinery |
| [CLI](https://tanstack.com/cli/latest) | App templates, add-ons and documentation discovery; alpha | Optional setup tool, not a runtime dependency. If used, explicitly select Router-only and review generated files/dependencies; keep backend/data out of the web package |
| [Intent](https://tanstack.com/intent/latest) | Versioned agent-skill discovery from installed packages; alpha | Promising optional development aid after the project rules are reviewed. Allowlist relevant package guidance, inspect it and keep Noola instructions authoritative |

[Ranger](https://tanstack.com/ranger/latest) also has official documentation but is absent from the current 18-entry catalog. It provides custom range-control mechanics. Defer it: Base UI's slider covers ordinary controls; revisit only for a specific range interaction. The separate application starter/builder and TanChat are ecosystem tools, not additional required runtime libraries.

TanStack Store is the likely library meant by “TanStack State.” Some selected libraries use Store internally; that does not require directly adopting it as Noola's global state architecture. TanStack DB is client data machinery, not a replacement for PostgreSQL or backend authority. A library's agent/sandbox features do not enlarge the product's permitted AI actions.

## State ownership and type safety

| State | Owner | Example and boundary |
|---|---|---|
| Committed business state | Backend operations and PostgreSQL | Record rights, approvals, revisions and receipts; no client library is authoritative |
| Remote UI projection | TanStack Query through typed API client | Currently authorized list/details; invalidate after authoritative changes |
| Editable form state | TanStack Form | Unsaved values, field errors, dirty/submitting state; remain in memory |
| URL presentation state | nuqs with Router validation | Approved view/tab/page/sort; no private search text, draft content or tokens |
| Navigation | TanStack Router | Typed paths, route boundaries, loader coordination and deep links |
| Ephemeral interaction | React state/reducer/context | Dialog visibility and capture controls; reset at required locks |
| Shared client-only state | Store only if justified | A measured cross-feature state need not already covered above |

Infer API shapes from browser-safe contract schemas. Generate OpenAPI/client types, validate actual API responses, and carry typed values through Query into component props. Use a small typed field kit and TanStack Form's composition APIs; feature-specific schemas/defaults/submission stay explicit. Reuse structural validation without pretending frontend permission checks are authoritative. UI edit values can differ from wire values: map empty strings, numbers and dates deliberately and parse the final command. [Form composition](https://tanstack.com/form/latest/docs/framework/react/guides/form-composition), [shadcn form guide](https://ui.shadcn.com/docs/forms/tanstack-form).

Router loaders should prime the same Query definitions consumed by components and avoid retaining record payloads as loader data. Configure `defaultPreloadStaleTime: 0` for external Query ownership and define Query freshness/refocus/retry rules explicitly. Mutations return authoritative outcomes and invalidate relevant queries; unknown submissions need reconciliation rather than blind replay. [Official Router/Query guidance](https://github.com/TanStack/router/blob/main/packages/react-router/skills/compositions/router-query/SKILL.md).

Private caches remain memory-only. Identity-scoped keys help isolation but do not replace disposal: cancel requests, dispose the old QueryClient and private route subtree, reset forms/local state and reject late responses after an identity/lock generation change. Recheck current authority server-side for every protected operation. Do not persist/dehydrate household data into service-worker storage or debug tooling.

## nuqs integration finding

The official adapter guide marks TanStack Router support **experimental**, excludes TanStack Start, and documents `createStandardSchemaV1` for sharing parser definitions with Router. Typed linking supports limited value types and does not support `urlKeys`. [nuqs adapter guide](https://nuqs.dev/docs/adapters#tanstack-router).

Use `nuqs/adapters/tanstack-router` at the root route. Choose simple allowed enum/integer/boolean parameters, reuse the same parser map for hooks and `validateSearch`, and follow the documented partial-output behavior deliberately. nuqs owns in-place state edits; Router links own route changes and use the same definitions. Do not add parallel handlers independently serializing the same parameter. This keeps the requested libraries with a narrow, inspectable integration boundary.

Treat invalid/default values, replace versus push history, refresh/deep linking, back/forward, loader/query updates and rapid edits as first-scaffold evidence. Verify page/filter changes produce the expected server-query key and respect cancellation. A nuqs testing adapter is useful for units but does not prove live Router behavior; include a real browser integration. A failure is a documented integration issue to solve/review, not permission to silently replace the chosen URL library. [nuqs testing](https://nuqs.dev/docs/testing), [options](https://nuqs.dev/docs/options).

## Current shadcn/Base UI approach

shadcn supports multiple primitive bases; choosing shadcn alone does not guarantee Base UI. Use the current CLI with explicit `--base base` and the Vite setup/preset appropriate to the web app. Pin the inspected CLI version for reproducibility, record the chosen preset/configuration, and commit `components.json` plus the needed generated source. Use dry-run/diff inspection before adding or updating components. [Current CLI](https://ui.shadcn.com/docs/cli), [v4 capabilities](https://ui.shadcn.com/docs/changelog/2026-03-cli-v4).

Follow the Noola skill for component placement and extraction conventions. Use one semantic token layer for color, spacing, type, focus and motion. Check actual imports and registry dependencies; a third-party block or form example can otherwise add an unselected foundation. Consult base-scoped component documentation and actual Base UI composition/state APIs rather than copying Radix assumptions. Add a reusable component when interaction/meaning repeats; do not create a universal renderer with dozens of mode flags. [Base UI](https://base-ui.com/react/overview/quick-start), [configuration](https://ui.shadcn.com/docs/components-json).

Shared labeled fields must expose typed values and accessible descriptions/errors. Validate submission pending/failure, focus to errors, invalid state, dialog close/focus return, mobile keyboards, touch sizes, enlarged text and reduced motion. Existing product audience/evidence/consent controls remain required; library examples are starting points for composition.

## Version observations and validation sequence

Official npm `latest` metadata observed on 4 October 2026: Router **1.170.41**, router-plugin **1.168.42**, Query **5.104.1**, Form **1.33.5**, shadcn CLI **4.21.1**, Base UI **1.8.0**, nuqs **2.10.1**. The plugin's Router peer accepts `^1.170.41` and Vite 8; these two packages need compatible ranges, not identical patch numbers. React 19 is accepted by the observed UI peers. Other-framework peers in nuqs are optional; selecting nuqs does not require installing Next/React Router. The [registry evidence](frontend-research-evidence.json) records package versions, license, engines, peers and source URLs; none was installed here.

Table is now observed at **9.2.4**: reusing v8 examples without checking the adopted major is unsafe. Charts, Markdown and Highlight have observed **1.0.0** package versions, while project pages or their introduction still signal early maturity. Published numbers and website labels are separate signals. The backend contract experiment required TypeScript **5.9.3** because openapi-typescript's reviewed peer excludes 7.x; keep compatible compiler selection pending the full workspace check. Do not ignore peers or enable broad declaration skips to claim compatibility.

Before feature work, exercise the following under existing G13/G01/G10 and relevant quality gates:

1. Install an exact compatible set with strict peers and a frozen lockfile; generate route/contract types before strict checking; build web and API independently and inspect browser imports for server code.
2. Verify one typed command and malformed input/output paths through backend, client, Query, TanStack Form and reusable shadcn/Base UI fields; backend permissions and receipts remain authoritative.
3. Run actual Router/nuqs navigation and history checks plus Query loader/preload/deduplication/invalidation tests with controlled freshness settings.
4. Exercise logout, identity change, lock, resume and late network responses; confirm private routes, queries, drafts and URL state cannot expose prior identity content.
5. Validate keyboard/screen reader/touch/enlarged text and actual phones. Measure initial load, navigation and input responsiveness against existing quality targets; lazy-load heavy capture/optional tools and optimize measured bottlenecks.

These are planned validation steps. This review establishes selected directions and available integration paths, while keeping application and device evidence pending.

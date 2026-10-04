# Operations

Planned deployment and operating contracts, not tested runbooks. No application or infrastructure was deployed by this consolidation. Record actual execution evidence before operational reliance.

[Documentation index](../README.md). Consolidated 3 October 2026; implementation and validation remain pending.

<a id="observability"></a>
## Observability Architecture

### Logging

Use structured operational events for request/job category, stage, timing, failure classification, and safe correlation. Default logs exclude bodies, raw media, secrets, and private excerpts. Even record identifiers can reveal private activity, so restrict them to necessary diagnostic access and never expose them in coordinator reports.

### Metrics

Measure manual and AI latency separately; record queue/due-work delay, cancellation failures, retry/unknown outcomes, retention cleanup age, recovery age, storage headroom, provider failures, and aggregate reserved/actual cost. Distinguish push submission timing from observed delivery and acknowledgment. No engagement-maximizing message counter or household compliance score is introduced.

### Tracing

Correlate client submission, application operation, authorized retrieval, model/processor call, domain commit, and notification attempt. A lightweight in-application trace is sufficient initially. Trace spans carry safe categories and durations, not household content. A dedicated tracing backend requires operational value within the same budget.

### Error Tracking

Capture redacted failure categories and affected operation state with enough context to reproduce using synthetic data. Users can report wrong fact/person/action, unwanted reminders, or privacy concerns and optionally supply a selected redacted example. Failed/unknown work remains in Today after chat closes.

### AI Observability

Track model/prompt/configuration version, retrieval coverage, validation outcomes, permitted fallback, estimated/actual cost, and latency. Evaluate source-backed correctness and abstention separately. Preserve per-language evidence; a strong English result does not mask Tamil or mixed-language failure.

### Audit Events

Record attributed record changes, approvals and invalidation, sharing/retraction, assignment acceptance, revocation, recovery, exit, and restricted operator suspensions. Members see only events within their rights. No passive read events are exposed as read receipts. Ordinary metadata follows 90-day retention; record attribution follows the record lifetime.

### Privacy / Sensitive Data Handling

Apply minimization and redaction before telemetry leaves the service. Any external telemetry processor needs its own assessed and disclosed data boundary. Operational diagnostics and security audits are distinct from voluntary product/pilot evidence. The four-week pilot may use private adult feedback and a redacted shared ledger; it does not require a product analytics warehouse or prompt surveillance.

<a id="deployment"></a>
## Deployment Architecture

Allowed application deployments are local Docker Compose on the laptop, Railway for hosted testing, and the existing E2E Networks Linux VM. Prefer the existing VM for the first self-hosted production candidate after resource, recovery and operations tests; Railway remains the other allowed hosted option. Do not introduce another application hosting vendor. The explicitly permitted vector-service evaluation and AI/email providers are not new application hosts.

Environment processing policy follows [BR-007](PRODUCT-RULES.md#br-007): development/testing/staging/UAT may evaluate any available model/processor in any affordable available region without production residency, no-training qualification or thirty-day processor-retention eligibility gates; production qualification is separate. Provider access/terms, permissions, funding approval and informed consent for real data still apply.

OneDrive holds encrypted recovery bundles and nonsensitive instructions, shared only with named recovery operators. Keep decryption keys separately in the existing Vaultwarden and an offline recovery copy. Do not put plaintext runtime secrets or OAuth tokens in shared documents. The live restriction journal must have a separately durable acknowledgment path; eventual OneDrive folder sync does not establish that guarantee. Use the other allowed host as a candidate independent journal/recovery boundary, then measure cost and restore behavior.


**Proposed initial model:** Independently built web assets and a protected backend behind one browser origin on an allowed host. Backend operations and bounded background execution share one transactional database, short-lived processing storage and protected recovery storage. Add retained originals in Phase 3. Independent artifacts may be assembled on the same host without sharing source/build dependencies. Containers in [Container Architecture](../ARCHITECTURE.md#structure-and-boundaries) are responsibility/runtime categories, not one purchased service per box.

The [container diagram](../ARCHITECTURE.md#structure-and-boundaries) is the single view of application, content, independent restrictions, recovery and key-custody boundaries. A separate worker remains conditional on host lifetime, isolation or contention evidence.

The initial host must support authenticated access, immediate revocation checks, required input sizes, progress/cancellation, durable periodic work, backup exclusion of temporary data, and recovery within source targets. A server runtime that sleeps through required schedules without a reliable wakeup mechanism is not sufficient. If hosting requires a separate runner from the first scheduled operation, that requirement triggers the worker boundary rather than weakening delivery promises.

The app-host shortlist, PostgreSQL direction and PWA-first evaluation are selected as described in the [stack inventory](../TECH-STACK.md#selection-inventory); production location and operating feasibility remain pending. Prefer managed operations only where demonstrated compatible with processor/operator disclosure and the baseline reserve. Database, file storage, recovery copies, and necessary notification/runtime costs must be included in feasibility estimates.

Independent recovery requires controlled access and instructions usable when Nishanth is unavailable, without giving the coordinator another adult's private in-app rights. Current deletion/revocation state must survive restoration of older content and the modeled failure of the primary store. Its protection and replay need explicit evidence under AD-014.

<a id="environments"></a>
## Environment Strategy

### Local and development

Use synthetic household identities, records, and provider examples by default. Keep real sensitive information out of developer fixtures and logs. Development may be local or a small isolated hosted environment; separate credentials, storage, and processing configuration from real household use. No permanently running duplicate production estate is required merely to name an environment.

### Preview

**Proposed optional environment:** A disposable preview may validate client behavior with synthetic data and test recipients. It must not share production sessions, databases, blobs, recovery stores, or live due-work records. Preview deployment does not start real reminders or contact household devices automatically. Do not add recurring preview infrastructure until its value fits the budget.

### Production household pilot

Use the actual accepted processor configuration and independent adult consent. Separate application, operator, storage, and recovery credentials with the minimum required access. Development/testing/staging/UAT follows the explicit environment exception for production residency, no-training qualification and thirty-day processor-retention eligibility, with monitoring-first costs. No testing setting may silently disable record permissions, expose private previews or spend without authorized funding. Synthetic testing precedes consented real-data validation under the roadmap gates; nonproduction success does not pass production processor qualification.

### Configuration and integration isolation

Treat processor configuration, allowed capabilities, secrets, budgets, and environment identity as explicit configuration. Use disabled/test adapters outside real operation unless a specific controlled test is authorized. Recovery rehearsals keep schedules paused and outbound adapters disabled until restrictions and receipts have been reconciled. Configuration changes affecting consent require updated applicable disclosure before processing.

<a id="operational-instrumentation"></a>
## Observability Stack

| Concern | Initial selection | Data boundary |
|---|---|---|
| Application logs | Pino JSON to platform stdout | Allowlisted fields and redaction before output; no bodies, credentials or private excerpts |
| Errors | Router error boundaries, server exception handling, redacted error records and user problem reports | Safe correlation and synthetic reproduction; no automatic session replay |
| Operational metrics | Application counters/timings plus host CPU/RAM/storage observations | Manual versus AI latency; due-work delay, cleanup/recovery age and failures |
| Tracing | Application operation IDs and bounded stage timings | No external collector or full request tracing initially |
| Audit | Domain-attributed PostgreSQL records | Authorized visibility; ordinary security/action metadata follows the 90-day policy |
| AI telemetry | Application cost/usage and evaluation records | No prompt-trace vendor; model/configuration versions and permitted metadata only |
| Product analytics | Voluntary pilot feedback and redacted evidence ledger | No event warehouse, engagement tracker or household surveillance |

Pino has configurable redaction, but safe logging begins with not constructing sensitive fields. Constrain log retention to documented purposes and provider capabilities; logs are not the source of action receipts. Recovery age and due-work health must be visible even if a model is unavailable. [Pino redaction](https://github.com/pinojs/pino/blob/main/docs/redaction.md)

Sentry is Trigger-Based if redacted built-in error reporting fails to diagnose observed problems within the maintenance target. OpenTelemetry SDK/export is Trigger-Based if cross-runtime diagnosis becomes necessary. Preserve traceable operation boundaries now, without installing collectors, Prometheus, Grafana, Langfuse or another telemetry store. Configured capability switches and recipient opt-ins do not require a feature-flag SaaS.

<a id="development-workflow"></a>
## Development Tooling

Use strict TypeScript with unchecked-index and optional-property discipline, exhaustive domain states, and `unknown` at external boundaries. TanStack's generated route tree and OpenAPI-derived client declarations support navigation/data contracts; runtime schemas and SQL constraints remain separate. Check browser-safe package exports and server/client import direction. Do not silence incompatibility with casts, broad declaration skips or ignored peers; the contract experiment's generator required a compatible 5.9 compiler rather than latest 7.x.

Select Biome for formatting, import organization, and supported correctness/accessibility lint rules, with TypeScript checking separately. No parallel ESLint/Prettier setup initially. Biome does not replace type checking or runtime tests; reconsider ESLint if a required semantic rule is unavailable. Markdown can be reviewed as prose without another formatter dependency. [Biome setup](https://biomejs.dev/guides/getting-started/)

Use pinned pnpm and a four-unit workspace with a frozen lockfile in CI: API, web, contracts and API client. Ordinary package scripts suffice. Pin Biome and commit `biome.json`; inspect and pin the shadcn generator, Base UI choice and generated configuration. No Husky/lint-staged initially. Use Zod to validate required server environment variables with redacted errors and non-secret examples; no extra environment-validation package is required.

Local development uses Docker Compose for backend, PostgreSQL and Mailpit, with independent Vite web and Node/pnpm tooling for fast feedback. Proxy `/api` during web development to the backend. Use temporary storage and fake provider/storage/email/push adapters for ordinary tests. Real recovery-storage, phone-push and provider checks use isolated synthetic environments. No always-on Redis, vector server, MinIO cluster or cloud emulator suite.

<a id="delivery-pipeline"></a>
## CI/CD Stack

Select GitHub Actions for the configured GitHub remote. The repository has committed documentation but no application pipeline yet. Equivalent checks remain portable to another Git host.

The minimum pipeline installs pinned Node/pnpm and frozen dependencies, runs Biome, generates the TanStack route tree and OpenAPI/client types, checks generated drift and package boundaries, then checks strict types, disposable PostgreSQL migrations and unit/integration behavior. Build web and backend independently; run critical Playwright/axe scenarios, including Router/nuqs history, forms and private-state clearing. Include dependency/secret checks. Pull requests use synthetic data, minimal permissions and immutable action references.

Deploy independently versioned backend and web artifacts after checks, with one backend-owned migration step and post-deployment health/manual-operation checks. Test compatible backend evolution against an older installed web client. Migration failure blocks rollout. Prefer expand/contract changes; image rollback does not reverse destructive migrations. Recovery readiness is checked without treating a dump as current revocation proof.

Vite builds static web assets using the TanStack Router plugin; the Node backend compiles to production JavaScript independently and can run without web source. Serve assets behind the permitted host's static/reverse-proxy arrangement or assemble them after both builds. Use SPA deep-link fallback without rewriting `/api` requests. Portable OCI artifacts support repeatability and future native parsing; no production development server or additional build orchestrator is needed.

Preview environments are optional, disposable and synthetic, with outbound adapters disabled. They cannot share production accounts, storage, recovery material or due-work state.

<a id="hosting-and-custody"></a>
## Hosting and Infrastructure

### Allowed deployment choices

The owner's application-host shortlist is closed: local Docker Compose on the laptop, Railway for hosted testing, and the existing E2E Networks Linux VM. Use a portable Node application, PostgreSQL and bounded worker/parser services. Prefer the existing VM as the first self-hosted production candidate after measurement; Railway is the other permitted hosted option. Other application hosts are outside the selected options.

Local Compose runs backend, web serving where needed, PostgreSQL, Mailpit and any enabled worker/parser. Railway and E2E use separate environment credentials, databases and temporary stores. Keep backend/database services awake when testing deadlines. Railway PostgreSQL templates require operator-owned maintenance/recovery; a convenient template is not fully managed operation. [Railway PostgreSQL](https://docs.railway.com/databases/postgresql)

Development through UAT chooses affordable available regions/processors. Production validates actual location, privacy and legal obligations. Test host HTTP/upload limits, native builds, resource peaks and parser isolation rather than assuming portability proves operation. Only configure real outbound production delivery in the production environment.

### Recovery storage and key custody

Use private primary-host storage for authoritative database/files. Store encrypted recovery generations and nonsensitive instructions in a restricted OneDrive folder. Share only with named recovery operators. OneDrive Personal Vault does not support sharing, so it is not the shared recovery folder. Keep decryption keys in existing Vaultwarden and an independent offline recovery copy, never beside the encrypted archive or in plaintext shared documents. Validate both access and restoration without Nishanth before production. [OneDrive Personal Vault](https://support.microsoft.com/en-us/onedrive/protect-your-onedrive-files-in-personal-vault), [Vaultwarden backup guidance](https://github.com/dani-garcia/vaultwarden/wiki/Backing-up-your-vault)

A daily encrypted database copy and original-file manifest use the thirty-day product recovery horizon. Test upload completion, checksums, deletion of expired generations and crash recovery. OneDrive sync/version history/recycle bins are not assumed to satisfy the deletion deadline; configure and verify all retained copies. If existing storage settings cannot meet it, resolve that exact limitation before production. Access to encryption keys and the current restriction journal must not depend only on the failed application host.

The current deletion/revocation journal needs an independently durable write acknowledgment before the product confirms completion. Select the other permitted host as the initial journal persistence candidate, in a separate failure/restore boundary. A second table on the same failed disk or asynchronous OneDrive sync is insufficient. Apply restrictive state first, append the ordered idempotent event remotely, then confirm; ambiguous durability stays pending/restrictive. Restore old content only after complete current restriction replay and keep jobs paused. Verify lost-primary, unavailable-journal and crash-order cases. [PostgreSQL recovery semantics](https://www.postgresql.org/docs/current/continuous-archiving.html)

Measure the incremental cost of running both required boundaries. Do not assume the existing VM, OneDrive quota, or Railway account supplies unlimited free resources or alternate-operator access. Production readiness includes a named alternate operator and tested key recovery. This plan selects the arrangement to evaluate, not a successful recovery result.

<a id="dependency-policy"></a>
## Dependency Policy

- A dependency needs a present capability, an owner, acceptable license, current maintenance evidence and a known removal/upgrade path.
- Prefer runtime, browser, framework and PostgreSQL functionality before adding packages. Avoid duplicate state, schema, date, HTTP and logging libraries.
- Pin direct application/tool dependencies deliberately and commit the full lockfile. Keep related router, React, auth and AI-provider packages aligned. Production installs use the lockfile.
- “Latest” is not a stability guarantee. Check tags, prerelease identifiers and release notes. Do not install canary, beta or RC packages accidentally.
- Review security patches promptly. Group compatible routine updates into a manageable cadence; review majors and pre-1.0 minor changes explicitly with relevant regression tests.
- Approve only necessary lifecycle/build scripts. Preserve required native optional dependencies and validate Linux production artifacts separately from macOS development.
- Use Dependabot for update proposals; do not auto-merge framework, database, auth, parser or provider changes without their relevant checks.
- Remove unused dependencies. Keep future candidates out of manifests until their roadmap or measured trigger arrives.

<a id="cost-accounting"></a>
## Cost Considerations

Development through UAT monitors actual usage and cost before applying calibrated production caps. Track route/account category, model, tokens or minutes where returned, retries, tool calls, memory/CPU/storage, queue idle use, recovery traffic, email and maintenance. No private prompt metadata enters household cost reports. Configure owner-visible alerts and an emergency stop; resource and loop bounds remain enabled.

Production retains the ₹3,000 monthly incremental service planning allocation: ₹1,000 baseline service/recovery and ₹2,000 paid variable AI unless Nishanth explicitly changes it. Existing personal ChatGPT subscriptions are displayed separately, not called free and not double-charged as API tokens. A subscription quota is not a rupee wallet. Exhausting the paid variable AI allocation temporarily disables all optional AI features across paid and subscription routes, including background work. Manual records, ordinary reminders, privacy controls and direct agenda briefs continue. Resume new AI work only with an available next-month allocation or owner-approved increase and current consent/eligibility checks. A future local model needs separate selection and validation; no automatic route switch bypasses the pause. New subscriptions, gateway credit purchases and budget increases require owner approval; the assistant cannot purchase or auto top-up.

Measure the existing E2E VM's available capacity and marginal/allocated costs, Railway services, PostgreSQL growth, isolated parsing, the independent journal, OneDrive storage/history retention, domain/DNS, restore traffic, taxes/payment charges and operator access. Retain enough headroom for ordinary manual records and saved reminders. Local laptop uptime cannot prove a production twenty-four-hour recovery/availability arrangement.

For paid gateway work include actual model/route rates and feature surcharges, not only token list prices. Vercel's free gateway allowance is an evaluation convenience with eligible-model and account limitations, not a production affordability guarantee. Recheck actual available credit and routing controls at setup. [Gateway pricing](https://vercel.com/docs/ai-gateway/pricing), [Railway pricing](https://docs.railway.com/pricing/plans)

Before production paid admission reserves the worst permitted request/tool/retry cost in the household ledger. Where an API cannot enforce the required bound, do not claim a strict ceiling; constrain the route or obtain an explicit policy change. Subscription requests use provider/app limits, deadlines and app request bounds separately. Aggregate cost reconciliation retains unknown/late usage rather than treating it as zero.

Use Asia/Kolkata calendar months for the initial app accounting period, explicitly configurable by the owner. Reservations remain attributed to the month in which work was admitted; late settlement reconciles that reservation. Provider invoices and quota reset periods may differ and remain visible. This accounting choice does not infer data residency.

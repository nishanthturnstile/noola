# Phase 0 readiness and execution plan

**Status: Available synthetic proofs implemented; Phase 0 remains Pending.** Started 4 October 2026. This is an execution/evidence record, not a replacement for the [roadmap](../ROADMAP.md), [acceptance criteria](../reference/ACCEPTANCE.md#phase-0) or [gate register](../reference/DECISIONS-AND-GATES.md#evidence-gates).

## Starting position

The running bootstrap has four workspaces, independently built web/API applications, typed health contracts, accessible placeholder UI, shared PostgreSQL and separate application/infrastructure lifecycles. [Bootstrap validation](BOOTSTRAP-VALIDATION.md) records executed checks. Database-role isolation does not prove isolation between authenticated adults. No product identity, records, retrieval, AI, notification or recovery workflow is enabled.

## Execution sequence

| Step | Work and placement | Completion evidence / dependency |
|---|---|---|
| 1 | Revalidate stable persistence and maintained identity adapter against strict TypeScript; inspect upstream errors and evaluate an isolated RC comparison | Exact versions, reproducible command, failure categories and an explicit compiler-policy decision; no automatic RC adoption |
| 2 | Build a disposable synthetic experiment under `apps/api/experiments/phase0`, outside production entry points | Fresh uniquely named database and restricted login; reviewed fixture migration; cleanup on success/failure; no changes to Noola product tables |
| 3 | Exercise Better Auth HTTP handlers, opaque database sessions and application-owned private-record policy | Two synthetic adults sign in; anonymous/forged/expired/revoked sessions fail; cross-adult list/read/update/delete/search/export deny content and metadata; caller cannot select owner |
| 4 | Exercise manual save/correct/read/forget and source-backed lexical lookup in the same experiment | Exact source references and four language-script fixtures; no AI dependency or external calls; no claim of representative recall accuracy |
| 5 | Model deletion-aware restoration with a separately stored synthetic restriction journal | Old snapshot cannot resurrect forgotten data; unavailable journal fails closed; explicitly distinguish local algorithm proof from independent durable custody |
| 6 | Run normal workspace checks, experiment runtime and separate strict experiment checking; review cleanup, authority, SQL parameters and exposed routes | Preserve failing adoption checks as failures; verify running health endpoint and no experiment routes in production |
| 7 | Reconcile gate evidence and define the next implementation slice | Each gate remains pending until its complete criteria are met; list exact human/account/device inputs |

## Reported device inventory

Nishanth reported these available test devices on 4 October 2026. This is an inventory report, not an observed test or either adult's acceptance.

| Device | Known information | Still needed |
|---|---|---|
| Android | Pixel 8 | Android/browser versions, adult/device assignment |
| iPhone | One iPhone, possibly 16 or 17 | Exact model, iOS/browser versions, adult/device assignment |
| Mac | Safari available | macOS/Safari versions |
| Windows | Chrome and other browsers available; development is in WSL | Windows/browser versions; identify additional browsers |

Each adult's top 2–3 jobs and independent participation remain **blocked on input**. No second adult's consent or answers have been inferred from the device inventory. For device validation, record model/OS/browser, installability, session persistence/revocation, background/foreground behavior, accessibility and network conditions with observed date/result. Push requires a secure reachable origin, explicit device permission, and its own actual-phone experiment; the current loopback-only placeholder is not that test surface.

## External and later-phase work

- Each adult independently supplies intended jobs and their actual phone/browser inventory. Missing participation must be explicitly recorded; one adult cannot consent for the other.
- G01/G07 need actual-device installation/session/accessibility and push feasibility. Browser emulation does not prove phone delivery. The seven-day timing observation must be scheduled around actual devices and explicit notification permission.
- G02 requires an expressly connected account, scopes, terms and actual model/modality/quota evidence. No account entitlement follows from this coding session. No provider call or paid service is authorized by a synthetic test.
- G09 needs a priced workload and host/storage/recovery arrangement within the INR 3,000 monthly ceiling, separate subscription/variable accounting, and all-route pause evidence once routes exist. Local idle RAM is only one input.
- G04 independent recovery/email delivery, invitation lifecycle, device locks and private browser-state clearing remain Phase 1 work before real use.
- G06 independent journal custody, keys, alternate operator, encrypted off-host backups, lost-primary/crash ordering and all derivative cleanup remain required before retained real data.
- G03 production qualification and G14 explicit architecture acceptance retain their existing owners and timing.

## Workflow for the next slice

Start from the [gate register](../reference/DECISIONS-AND-GATES.md#evidence-gates), select one unmet criterion, then use [traceability](../reference/TRACEABILITY.md#requirement-matrix) to read its owning rules and acceptance cases. Write the smallest bounded change, its negative cases, affected files and completion evidence before implementation. Keep synthetic experiments separate until their compatibility and behavioral checks pass. Then promote reviewed behavior into its owning backend module and browser-safe contracts, with UI and integration tests for that slice. Update evidence after execution; never infer a passed gate from a dependency choice.

## Results

Observed on 4 October 2026 in Ubuntu WSL2, Node 24.21.0, pnpm 12.8.1, PostgreSQL 18.6. Exact dependency/artifact pins live in manifests and the lockfile.

| Proof | Observed result | Limit |
|---|---|---|
| Stable migration and database access | Passed: fresh/repeated Drizzle migration, restricted runtime role, transaction rollback | Disposable fixture schema only; product migrations remain empty |
| Identity isolation | Passed: Better Auth 1.7.7 + matching maintained Drizzle adapter, HTTP-handler password sign-in, verified-only access, closed signup, no session cookie cache, anonymous/forged denial, database-backed password throttling | Synthetic verification seeded in DB; not email delivery, invitation enrollment or password recovery |
| Private record boundary | Passed in both directions for read/list/search/export/update/delete; owner injection and cross-origin writes denied; absent/unauthorized responses match status/body and are uncached | No timing-side-channel claim, shared-record rights, guardian policy, streams or browser cache tests |
| Session authority | Passed: deleting A's DB sessions invalidates A on the next request while B continues; expired B sessions fail | Browser locks and device management UI absent |
| Manual continuity / sources | Passed: save/correct/forget and source-linked exact substring retrieval across English/Tamil/transliteration/mixed fixtures; zero external fetch calls | Four synthetic cases are not recall-quality or semantic evaluation; no existing AI routes to test paid-exhaustion behavior against |
| Deletion-aware restore | Passed: old snapshot excludes journaled tombstones; unavailable/corrupt journal fails before mutation; journal write failure prevents successful forget acknowledgment | Local SQL rows plus a temporary local fsynced file; not an independently durable journal, encrypted backup, crash-consistency protocol or lost-host proof |
| Drizzle application compatibility | **Passed under the owner-approved backend exception:** strict application checking and runtime proofs | Upstream declaration consistency remains a separate failing diagnostic; see the [policy decision](PERSISTENCE-COMPATIBILITY.md#compiler-policy-decision) |
| RC comparison | **Failed:** isolated Drizzle 1.0.0-rc.4 comparison produced 49 upstream declaration errors | Temporary experiment with Node types 24.12.0; no RC dependency adopted |

### Reproduction and containment

After the normal [local setup](../../README.md), run:

```sh
pnpm phase0:runtime
pnpm phase0:typecheck
pnpm phase0:check
```

The first command uses Docker tooling and administrator credentials only to create/drop a fresh random `noola_phase0_<hex>` database and login. All tested request paths use its restricted five-connection pool. Its six fixture tables never enter the Noola database. The journal is temporary and removed in `finally`. Exceptions clean up database/login; forcibly killing the process or losing PostgreSQL can leave its random fixtures, which require inspecting and explicitly removing that exact database/login. Never sweep similarly named databases automatically.

The second command checks the experiment's application types under the approved backend exception. `phase0:check` combines this required check with runtime proofs. `pnpm check` also includes the experiment type check. Run `pnpm phase0:declarations` to re-enable full declaration checking and reproduce the upstream failure; that command returns a nonzero status and is separately labelled/non-blocking in CI. Root/web/shared-package declaration checking remains enabled. Production imports of experiments remain forbidden. Passing these checks does not mean Phase 0 passed.

The [executable assertions](../../apps/api/experiments/phase0/run.ts), [HTTP/policy harness](../../apps/api/experiments/phase0/app.ts), and [fixture schema](../../apps/api/experiments/phase0/schema.ts) are the reviewable evidence. Better Auth and its adapter are pinned **development dependencies**, not application authentication. Requests invoke Hono/Better Auth HTTP handlers with real cookies and PostgreSQL, without opening a listener. Browser cookie behavior and actual-phone behavior need separate tests. Fixture signup exists only in an unmounted seed factory; the tested identity instance disables signup and requires verified email.

### Persistence decision

**Resolved as a compiler-policy tradeoff, 4 October 2026:** Nishanth chose to retain Drizzle after reviewing its successful runtime behavior, upstream declaration failures and the tested Kysely alternative. The [decision record](PERSISTENCE-COMPATIBILITY.md#compiler-policy-decision) defines the exception, residual risk and removal trigger. The [coding standard](../../.agents/skills/noola-code-structure/SKILL.md) permits `skipLibCheck: true` only in backend projects inheriting the API configuration; strict application checks remain required.

This resolves the application adoption blocker, not the upstream declarations themselves. The original diagnostic reported 73 dependency errors, including optional driver references, incompatible Drizzle declarations and Better Auth's `bun:sqlite` reference. [Upstream issue 5187](https://github.com/drizzle-team/drizzle-orm/issues/5187) documents the Drizzle family. The explicit Better Auth factory annotation addresses our separate declaration-emission portability issue. Kysely and RC versions are not adopted. The running bootstrap remains health-only; identity and records remain isolated synthetic experiments.

### Dependency review

`pnpm audit --prod` reports zero advisories. Full `pnpm audit` reports two existing development-tool paths: `drizzle-kit` → old esbuild (moderate; [advisory](https://github.com/advisories/GHSA-67mh-4wv8-2f99)), and shadcn → fast-glob/micromatch → braces (high; [advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), no patched version reported). Neither is an API production dependency path. The old esbuild serve API is not started by this workflow; generator inputs are repository-controlled. This is exposure context, not a vulnerability fix or complete security assessment. Keep G13 pending and review tool upgrades/patches before relying on generators with untrusted inputs.

## Next implementation order

1. **Persistence decision completed:** retain Drizzle with the approved backend exception; keep query regression checks and upstream diagnostics. Revisit on dependency upgrades.
2. **Actual-device feasibility:** confirm inventory details, establish a secure development test origin and run the bounded phone/session/push experiment with explicit permission. Collect each adult's jobs independently in parallel.
3. **Provider and cost feasibility:** explicitly connect the intended account and inventory actual permitted capabilities, then price the agreed workload and independent recovery arrangement. Keep synthetic data and no paid calls until their route/funding is authorized.
4. **Phase 0 review:** reconcile those results against the Phase 0 criteria and gate register. Only then scope the Phase 1 private-text vertical slice: verified invitation → sign-in → manual save → authorized evidence → correction → forget, including recovery and private browser-state clearing before real data.


## Validation and review record

Executed for this change: frozen installation; full `pnpm check` (generation/drift, Biome, strict application types, import/cycle boundaries, five unit tests, independent builds and documentation); Phase 0 runtime on the host and through Docker; repeated fixture generation (no schema change); normal PostgreSQL integration; four Playwright/axe cases against Docker. Application checking now passes under the approved exception; the separate full-declaration diagnostic still fails. GitHub Actions is configured but has not been observed remotely.

Review checked that production cannot import experiments (a temporary negative import was rejected), auth routes remain absent from the running API (`/api/auth/get-session` returns 404), readiness returns 200, administrator credentials remain confined to tooling, record predicates bind the authenticated user on each operation, and recovery validates the journal before changing restored rows. A malformed JSON request was corrected to return 400 and is covered. Test fixtures were inspected after cleanup: zero Phase 0 databases, zero Phase 0 roles, zero public tables in `noola`.

After Docker/browser/integration validation, an idle-CPU `docker stats --no-stream` snapshot measured PostgreSQL **44.75 MiB / 1 GiB**, API **103.1 MiB**, and Vite web **696.6 MiB** (about **844.5 MiB combined**, excluding Docker/WSL overhead). This warm development snapshot is higher than the earlier bootstrap observation and is not a production sizing or monthly-cost estimate. No persistent extra database/server or worker was introduced.

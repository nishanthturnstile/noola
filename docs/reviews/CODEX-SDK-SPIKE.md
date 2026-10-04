# Codex SDK feasibility spike

## Containment follow-up — 4 October 2026

**Local containment resolved; fresh native login and account validation remain pending.** The corrected preflight passes all twelve checks; implementation commit `6e06f1a` remains on `codex/phase0-codex-sdk-spike`. The current offline suite passes 41 tests. The original failure record below and its JSON snapshot remain historical evidence; the [follow-up result](codex-sdk-containment-results.json) records the new image and source hashes. No production adapter has been enabled.

### Causes and corrections

1. **Wrong configuration authority for `unified_exec`.** In CLI 0.160.0, ordinary user opt-outs are deliberately normalized back to enabled. Only managed requirements can disable this engine. The separate `shell_tool` gate controls command registration. We now bake root-owned `/etc/codex/requirements.toml` into the read-only image, pinning both flags false. This fixes the original failed assertion without deleting it. [Pinned implementation](https://github.com/openai/codex/blob/a956835d020762cb2b570053af06f643a11c0ecc/codex-rs/core/src/config/managed_features.rs), [shell registration](https://github.com/openai/codex/blob/a956835d020762cb2b570053af06f643a11c0ecc/codex-rs/core/src/tools/spec_plan.rs).
2. **Docker seccomp blocked nested bubblewrap setup.** On this host, a capability-free UID-1000 container could not run `unshare -Ur true` with Docker's default profile. Allowing only that user-namespace operation made it succeed, establishing a seccomp cause rather than assuming the host disabled user namespaces. Bubblewrap additionally needs user-namespace `clone`, `mount`, `umount2` and `pivot_root`; omitting each operation independently reproduced a specific failure. The spike now uses a pinned Moby default profile with three explicit additional rules: `clone` must include `CLONE_NEWUSER`, `unshare` must equal `CLONE_NEWUSER`, and the three filesystem setup calls are allowed. [Docker seccomp documentation](https://docs.docker.com/engine/security/seccomp/).
3. **Feature flags alone were insufficient tool evidence.** The pinned model metadata can independently advertise patch, code-mode and other tools. An immutable catalog retains the original `gpt-6.1-sol` instructions and model identity while disabling these client tool capabilities. A fresh, credential-free SDK process sends requests to a local synthetic HTTP provider using that same catalog and policy. We observe no advertised tools and deliberately return forged shell and freeform patch calls. Codex's dispatcher returns `unsupported call: exec_command` and `unsupported custom tool call: apply_patch`; no target file appears. This is actual CLI behavior with simulated provider responses, not a model refusing instructions. Only explicitly catalogued models pass; changing `NOOLA_SPIKE_MODEL` also requires reviewing its catalog entry and rerunning preflight.

The new [seccomp profile](../../infra/docker/codex-spike/seccomp.json) derives from Moby `seccomp/v0.2.1`, commit `5ad5f40ecde90d78e4a7c861c003fe92747d5518`. A regression test verifies that the upstream baseline is otherwise unchanged. The [attribution](../../infra/docker/codex-spike/NOTICE.txt) records the model-catalog source, modifications and license. The Docker probe remains non-root, read-only, capability-free, under active seccomp and `no-new-privileges`; an outer mount attempt and mount-namespace creation still fail. No host sysctl, privileged mode, `CAP_SYS_ADMIN` or unconfined profile is used.

**Tradeoff:** allowing these calls increases reachable kernel surface to support the nested sandbox. Kernel namespace/capability checks still apply, and the outer container keeps its existing isolation. This is a reviewed local configuration, not proof against all kernel/runtime vulnerabilities or a portable deployment guarantee. Revalidate it for another host, SDK or Docker version. Provider connectivity remains available to Codex; tool-network denial is not a complete container egress firewall.

### Observed validation and next step

| Check | Follow-up result |
|---|---|
| Managed feature values and pinned CLI | Passed |
| Outer UID/capabilities/seccomp/no-new-privileges; mount/namespace denial | Passed |
| Allowed sandbox read and exit-code propagation | Passed, including a deliberate exit 42 |
| Credential read, `/proc/self/root` bypass and work write | Denied as required |
| Network positive and negative controls | Outer child reaches a real listener; sandbox child gets an explicit permission error |
| Actual SDK tool catalog; forged tool dispatch | Empty; both calls rejected as unsupported |
| Preflight cleanup | Passed; synthetic state removed |
| Offline harness and configuration regression tests | 41 passed |
| Frozen install; workspace checks; application readiness | Passed |
| Native account, model access, recall quality, cancellation, real history cleanup | Pending fresh login and live suite |

The local fake provider makes exactly two HTTP requests per successful containment probe. These are synthetic exchanges, not subscription invocations, and do not consume the ten-invocation live budget. Raw requests, native thread IDs and provider errors are not retained. The original database/identity proof remains intact; this change does not alter its source or database ownership.

**Proceed with the next validation step:** run `pnpm phase0:codex:login -- --principal adult-a`, complete the native device login personally, then run `pnpm phase0:codex:live -- --principal adult-a`. The command reruns containment before either operation. Native access remains Pending until observed; neither documentation nor the local fake provider establishes entitlement. Preserve real-account histories only long enough to inspect cleanup, within the existing bounded synthetic suite. Second-account, deployment, production privacy and broader Phase 0 gates remain Pending.

The first product slice remains invitation → sign-in → private text save → authorized recall → correction → forget. Its manual behavior can be scoped now; the subscription-backed production adapter still requires the live qualification above. Retain the small experimental harness separately while this evidence is pending.

## Original observation — before the containment correction

**4 October 2026 — implemented; local containment blocked; live account access not tested.** Work is isolated on `codex/phase0-codex-sdk-spike`, with implementation commit `984f273`. This is G02 evidence, not production adoption or full Phase 0 completion. The owner selected their own account first; independent second-adult account proof remains pending.

## Outcome and stopping point

The offline harness passes 38 tests. The existing workspace checks and synthetic identity/persistence proof pass. Docker confirms separate synthetic principal volumes, a non-root process, a read-only root filesystem, no mounted repository or Docker socket, and no application/provider credentials in the container environment. Both synthetic volumes were emptied after the tests.

The pinned SDK/CLI is `0.160.0`. Two required preflight checks fail:

1. `features list` does not resolve `unified_exec` to false under the disabling configuration. This prevents claiming tool suppression. Actual model-visible tool exposure has not been tested.
2. The allowed sandbox control cannot execute. Bubblewrap reports that it cannot create a new namespace under the existing container/kernel restrictions. Consequently, credential-read, write and tool-network denial tests are **Not run**, not passed because a command failed.

The command exits with code 2 before login or model execution. The live entry point applies the same preflight. No subscription connection, model request, paid call or account entitlement was established. No Docker privilege escalation, host sysctl change, API-key fallback or alternate account was used to bypass the failure.

**Decision:** retain the separate harness as a reproducible blocked experiment. Do not create a production adapter from it. Investigate the effective tool control and a supported isolation arrangement before retrying native login. If this route is abandoned, remove spike-only code and dependencies while preserving this report and the [machine-readable result](codex-sdk-spike-results.json).

## Implementation and boundaries

The [experiment](../../apps/api/experiments/phase0/codex-sdk/harness.ts) separates admission, current source selection, runtime selection and result validation. Requests contain synthetic principal/request IDs, a question and deadline. Credential paths and thread IDs are rejected. Each request starts a fresh thread; only authorized sources are supplied. The result is `found` or `not_found` with source IDs, revisions and exact quotations. It exposes no mutation or action interface.

Current pause, connection and source state are checked before execution and after completion. A timeout or cancellation cannot release the principal's execution slot while an uncooperative executor remains active. The ten-invocation limit is shared across principals in one suite. The harness does not retry or select another payer/provider. Arbitrary provider error prose remains `provider_unknown`; the quota/entitlement/transport distinctions are tested using typed synthetic failures, not claimed as observed native errors.

The [Docker setup](../../infra/docker/codex-spike/compose.yaml) uses its own Compose project, `noola-codex-spike`. It mounts one private state volume per synthetic principal and has no shared PostgreSQL network. Runtime settings include UID 1000, a read-only root, dropped capabilities, no privilege escalation, one CPU, 1 GiB memory, 128 PIDs and disabled Docker logging. The final image contains compiled experiment code, Zod, and the pinned SDK/native CLI packages; it does not contain the web application, database tooling, repository or build toolchain.

The Linux command wrapper uses `flock` to serialize operations. Each live request has a maximum 90-second deadline; the outer command has a bounded timeout and removes its labelled runtime container. Routine cleanup deletes state-volume contents except a regular native `auth.json`; disconnect removes that file too. Symlinked state roots or credential files are rejected. After a crash, leftover content is cleaned before that principal can run again. This mechanism and synthetic cleanup tests do not yet prove cleanup of actual generated Codex histories or native cancellation behavior.

No product endpoints, domain tables, frontend components, production identity system or gateway integration were added. Dependency checks include experiments and prohibit production imports of experiments or the spike SDK. Existing CI's `pnpm check` discovers the offline tests; it receives no personal authentication and runs no live probe.

## Verification record

| Evidence | Result | Interpretation |
|---|---|---|
| Frozen install; generation/drift; Biome; strict application types; boundaries; unit tests; independent builds | Passed | `pnpm install --frozen-lockfile` and `pnpm check` |
| Offline spike suite | Passed, 38 tests | Both principals, malformed/foreign/stale output, injected source text, pause/disconnect races, cancellation, deadlines, cap, cleanup and evidence projection |
| Existing identity/persistence experiment | Passed | `pnpm phase0:runtime`; disposable database/login cleaned up |
| Upstream declaration diagnostic | Failed, 73 errors | Unchanged diagnostic count; existing approved backend exception remains visible |
| SDK/native runtime version | Passed | CLI reports `codex-cli 0.160.0` |
| Effective disabled features | Failed | `unified_exec` did not resolve false |
| Sandbox positive control | Failed | Namespace creation unavailable with current hardening |
| Sandbox read/write/network denial | Not run | Positive control prerequisite failed |
| Docker volume isolation | Passed, synthetic, both directions | Seeded different markers in A/B; each container saw only its own marker |
| Container hardening checks | Passed | UID, read-only root and absence of repository/socket/credential environment verified directly |
| Native account access, language fixtures and provider usage | Pending | Zero live invocations; no account connected |
| Native cancellation, real retained-history cleanup and latency/peak RAM | Pending | Offline simulations do not substitute for these observations |
| Second-adult account, deployment and production privacy | Pending | Outside the observed single-account-first local scope |
| Existing application health | Passed | Passed after an API watcher restart; proxied readiness returns `ready` |

**Development-server interruption:** the existing `pnpm phase0:runtime` helper refreshed Docker-managed dependencies after the lockfile change. The running API watcher lost its `tsx` preload and the proxy briefly returned 502. `docker restart noola-api-1` restored HTTP 200 readiness; web and PostgreSQL stayed running. Coordinate a development-service restart when existing tooling refreshes its shared dependency volumes. Spike runtime containers use their own image and state volumes.

The result JSON records the implementation commit, image identity, package integrity, commands and evidence categories. Docker reports approximately 907 MiB for the final image's uncompressed size; this is not incremental disk usage after shared-layer accounting. No spike container remains running, so there is no continuously resident spike process. Active inference resource use is unknown. Build cache is not broadly pruned because it may be shared with other local projects.

## Reproduction and account procedure

Run from the repository root on Linux/WSL with Docker and `flock` available:

```bash
pnpm install --frozen-lockfile
pnpm phase0:codex:test
pnpm phase0:codex:preflight
```

The current preflight is expected to exit 2 with the two failures above. Non-login commands save allowlisted JSON evidence under ignored `.codex-spike/`, including version/image/commit metadata and check outcomes. They do not retain raw SDK errors, prompts, model responses, account IDs, native thread IDs or tokens. Login's one-time instructions stay in the interactive terminal and are not captured as evidence.

Only after containment passes, the owner runs:

```bash
pnpm phase0:codex:login -- --principal adult-a
pnpm phase0:codex:live -- --principal adult-a
```

The login uses the official native device-code flow. Complete it personally in a browser; never paste credentials into chat. Do not copy this development session's credential store. If device login is unavailable, leave the account pending; the official browser-login flow with a localhost callback requires a separately reviewed connection procedure for this isolated container.

The configured model defaults to `gpt-6.1-sol`; `NOOLA_SPIKE_MODEL` permits an explicit alternative. Model unavailability is a failure, not an automatic substitution. The ten live cases cover three language forms, an unanswerable question, source injection, correction, forgetting, cancellation and recovery. The suite stops at the first failed assertion. Available usage counts are projected; hidden native retries and unknown usage are not presented as zero. The ten SDK invocations are not a proven cap on all internal upstream HTTP attempts.

```bash
pnpm phase0:codex:cleanup -- --principal adult-a
pnpm phase0:codex:cleanup -- --principal adult-b
pnpm phase0:codex:disconnect -- --principal adult-a
```

Cleanup operates on the selected principal; repeat it for B when B has been used. Disconnect removes only that experiment's native connection. It is not a claim of global account-session revocation or provider-side deletion. Containers are disposable; the tagged image, empty labelled volumes and private network remain available for reproduction. Do not use broad Docker pruning or application/database shutdown commands to clean this spike.

## Research corrections and retention

The inspected SDK exposes schema-constrained output, explicit child environment and cancellation; it does not expose the CLI's `--ephemeral` option. `history.persistence = "none"` alone does not establish absence of rollout files. The experiment therefore requires explicit artifact inspection and cleanup after native runs. [Codex SDK](https://learn.chatgpt.com/docs/codex-sdk), [non-interactive mode](https://learn.chatgpt.com/docs/non-interactive-mode).

The published CLI also rejects `--strict-config` on `features list` and rejects overriding the reserved built-in `openai` provider to disable retries. The implementation removed those unsupported assumptions, verifies reported feature values, and records internal retry counts as unknown. [Configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference), [native authentication](https://learn.chatgpt.com/docs/auth).

Keep this dated evidence unchanged when future runs produce different results; record a new snapshot and link it. Retain the harness while it supports containment/account follow-up. After adoption, move only reviewed integration behavior and useful regression tests into their backend owners, then delete duplicate scaffolding. After abandonment, remove the whole spike implementation, its commands, dependency and owned runtime resources; preserve the report, results and reproducibility details in Git history. Existing identity/persistence experiments remain intact.

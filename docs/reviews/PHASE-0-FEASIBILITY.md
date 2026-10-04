# Phase 0 household scenarios and service feasibility

**Research and planning completed 4 October 2026. Account access, invoices, operational measurements and household acceptance remain unverified.** This proposal helps Nishanth choose the first useful workflows and qualify the AI and recovery arrangements before the first product implementation slice. It supplements the [Phase 0 execution record](PHASE-0-READINESS.md), without replacing the [gate register](../reference/DECISIONS-AND-GATES.md#evidence-gates).

**Owner decision, 4 October 2026:** Test `@openai/codex-sdk` with each adult's native Codex ChatGPT login as the primary subscription route. Keep Noola private. Vercel AI Gateway is the first paid fallback candidate if USD card charges converted to INR are acceptable; OpenCode Zen is an alternative direct gateway if its checkout or operation fits better. Approval covers a bounded synthetic spike, not production activation, purchases or use of another adult's account. The modest text workload below fits the variable-AI allocation on paper; infrastructure and subscription eligibility still require account-specific evidence.

## Confirmed inputs and assumptions

- The owner supplied two personas: Nishan, an IT employee alternating between home and office, and Manjula, a mother currently caring for the child and home. These names label scenario examples; the canonical product owner remains Nishanth. Their roles do not assign permanent household duties or different application rights.
- The owner requested proposed scenarios. The examples below are design hypotheses, not statements that either adult actually follows these routines. Manjula has not independently ranked or accepted them.
- The owner reconfirmed a ₹3,000 monthly ceiling. Preserve the existing ₹1,000 baseline service/recovery and ₹2,000 variable-AI split. Existing personal subscriptions stay separately visible under [cost accounting](../reference/OPERATIONS.md#cost-accounting).
- The owner asked us to assume Nishant has ChatGPT Pro and Manjula has Plus or possibly ChatGPT Go, mentioned as approximately ₹399. These are planning assumptions, not verified subscriptions, prices or API entitlements. No Noola client ID, registration or connection has been configured.
- The owner explicitly chose to keep Noola's source private. Do not publish the repository or treat open-source registration as the applicable access path.
- The owner reported buying an OpenCode $10 offering with rupees. The exact product, invoice currency and bank-conversion treatment remain unconfirmed. A successful Go payment would not establish Zen billing conditions.
- Laptop testing proceeds now. Physical-device tests remain deferred under the [browser timing amendment](../reference/ACCEPTANCE.md#browser-validation-timing).

<a id="household-scenarios"></a>
## Proposed first useful scenarios

### Nishan remembers things across home and office

After packing for an office day, Nishan enters: “Remember privately: my spare laptop charger is in the blue office backpack.” Noola shows the proposed text, owner and audience. After the save succeeds, he can ask “Where did I keep the spare charger?” and open the dated source. Later he corrects the location to the desk drawer. Recall shows the current value, with history distinguished from current evidence.

This reduces repeated searching without requiring work email, employer documents, GPS or calendar access. The example contains no employer-confidential information. Forgetting removes the information from AI recall; the interface separately explains broader source deletion. Manjula cannot retrieve the private record, and the same protection works in reverse.

**First implementation priority:** Phase 1 private text capture, evidence, correction and forgetting. Direct save/search/edit controls work when AI is unavailable. Relevant requirements: [MEM-01](../reference/REQUIREMENTS.md#mem-01), MEM-04–MEM-06 and [MEM-15](../reference/REQUIREMENTS.md#mem-15); acceptance T04, T05, T24 and T26.

### Nishan and Manjula coordinate a shopping list

Manjula adds rice and detergent to a deliberately shared shopping list. Before returning from the office, Nishan opens it, adds coffee and marks rice purchased. Both see current items and attributed changes. If they edit concurrently, separate item changes survive and a direct conflict is shown for resolution.

The shared object contains only the list, not either adult's private conversation. Adding an item does not assign a task to Nishan, promise delivery or claim that a purchase happened. An unclear network response can be retried without duplicating the intended item.

**Second implementation priority:** Phase 1 shared lists after the private-record boundary works. No automatic notification, location trigger or purchase integration. Relevant acceptance: [T15](../reference/ACCEPTANCE.md#t15), [T29](../reference/ACCEPTANCE.md#t29) and Phase 1 shared-list criteria.

### Manjula recalls practical home information

Manjula saves: “The spare changing mat is in the bottom drawer.” On a later outing she asks where it is and receives the saved source. She can correct it, make it manual-only, or deliberately share the permitted record when that audience control is available. Private remains a real option, even for ordinary home information.

This exercises the same memory workflow as Nishan's example and avoids building a separate “mother” module. It starts with equipment locations, not clinical advice, sensitive child histories or inferred routines. Any later dependent record uses the existing guardian/owner rules rather than treating a home-care role as automatic authority.

**First implementation priority:** Reuse the private text slice with Manjula as owner, including reversed isolation tests. Candidate inputs include English, Tamil, transliteration and mixed text; each adult chooses their actual language preferences.

### Manjula drafts and edits an outing checklist

Manjula asks for a simple outing checklist using selected nonsensitive saved items. Noola offers editable suggestions with saved facts linked to their sources and new suggestions labelled as generated. She removes unnecessary items and explicitly chooses which items to save or add to the shared list.

An AI draft is not a claim that the bag is packed or that Nishan has agreed to bring anything. Without AI, she can create and edit the same list directly. This tests whether generation saves effort while keeping ordinary controls usable.

**Later in Phase 1:** Text assistance plus lists. No automatic care plan, notification, booking or external sending. Relevant requirements: [CON-05](../reference/REQUIREMENTS.md#con-05), [CON-06](../reference/REQUIREMENTS.md#con-06), and the existing list/control contracts.

An optional Phase 2 extension is a request such as “Ask Nishan to bring the bag.” It remains a request until he accepts; a reminder additionally requires the recipient's choices. This extension does not enter the first slice. Each adult can reject or replace any scenario during onboarding; a proposed scenario is not household-value evidence.

<a id="ai-access"></a>
## AI access findings

### Codex SDK selected for the subscription spike

The owner accepted this direction after the SDK review. The ordinary `openai` API SDK, Codex SDK and newer Sign in with ChatGPT plan-sharing flow are distinct integrations. The earlier assumption that private-client approval was required before any subscription spike was too broad; it applied to the newer plan-sharing flow.

[OpenAI's Codex SDK documentation](https://learn.chatgpt.com/docs/codex-sdk) supports programmatic embedding in an application. The TypeScript package wraps the Codex CLI as a child process; the CLI can use saved native ChatGPT authentication. [Authentication documentation](https://learn.chatgpt.com/docs/auth) covers browser/device login, credential storage and headless use. [Non-interactive guidance](https://learn.chatgpt.com/docs/non-interactive-mode) also documents ChatGPT-managed authentication for trusted automation. This is evidence for a synthetic feasibility test, not proof that the proposed two-adult hosted deployment meets every access, operational or production requirement.

On 4 October, registry metadata reported `@openai/codex-sdk` **0.160.0**, Node >=18 and a matching `@openai/codex` dependency. Source inspection used [OpenAI's repository snapshot](https://github.com/openai/codex/tree/b8dceb0d4f29e49e73daa08f57fcf5181186f354/sdk/typescript). The inspected main snapshot is not proof that the released package is identical. Before installation, inspect the exact release, record its artifact/version and pin both SDK and resolved runtime in the lockfile. Nothing was installed by the research.

The runtime inherits environment variables unless given an explicit environment and retains local session history by default. Its structured-output option does not replace application response validation. CLI `--ephemeral` support does not establish equivalent support in the inspected TypeScript thread options; resolve that mismatch against the pinned release before choosing retention behavior. Do not promise deletion based on a prompt or read-only sandbox alone.

**Proposed containment:** Noola's API resolves the adult and allowed context, then invokes an isolated Codex runtime for that adult. Separate credentials, session files, working directories and thread ownership; pass only an allowlisted environment without database or administrator credentials. Prove filesystem/tool/network restrictions independently of prompt instructions. Keep Noola's database authoritative for memory and permissions. Never reuse this coding assistant's login, extract subscription tokens into a generic HTTP client, or borrow one adult's account for the other. Login for the spike is explicit and local; secrets stay outside Git and evidence artifacts.

Plus/Pro are account assumptions, not tested entitlements. ChatGPT Go's actual native Codex eligibility must be checked independently of the newer sign-in flow. A successful SDK response proves only the tested account/model/capability. Scheduled work, audio, files, embeddings, quota behavior and production deployment require their own evidence when introduced. Subscription usage consumes the account's Codex allowance; it is not general API credit or an unlimited token budget.

### Deferred sign in integration

The newer [Sign in with ChatGPT flow](https://developers.openai.com/siwc/quickstart) has separate registration and private-client eligibility. Its open-source examples and HTTP parameter rules do not define native Codex SDK behavior. Defer that adapter and the private-client application request while testing Codex SDK. If revisited, revalidate the applicable registration, deployment and account requirements. Source publication is not part of this plan.

### Paid gateway comparison

| Candidate | Documented fit | INR and cost findings | Recommendation |
|---|---|---|---|
| Vercel AI Gateway | General application API; one gateway credential and configurable model/provider routing; usable from external hosts | Published token prices are USD; card conversion is documented, native INR billing is not established | Retain as first paid fallback candidate; prove the selected account, route and invoice |
| OpenCode Zen | Metered model endpoints with model-specific API formats | USD rates and card fee; owner-reported rupee payment requires product/invoice confirmation | Alternative candidate, not a second integration to build immediately |
| OpenCode Go | Subscription designed for coding-agent request patterns | $10 Go is distinct from Zen usage credits | Do not select for Noola's general household requests without explicit provider support |

[Vercel API-key documentation](https://vercel.com/docs/ai-gateway/authentication-and-byok) supports external-server use, so choosing its gateway does not require moving Noola hosting to Vercel. Its [pricing](https://vercel.com/docs/ai-gateway/pricing) has no token markup, but payment fees and optional feature charges still matter. Free credits cover eligible models only and disappear on transition to purchased credits; exclude them from recurring feasibility. Its [billing FAQ](https://vercel.com/docs/plans/pro-plan/billing) describes USD charges converted by the card provider. INR display, INR invoice, bank settlement and UPI support are different claims; none should be substituted for another.

[OpenCode Zen documentation](https://opencode.ai/docs/zen/) publishes Responses, Messages and Chat Completions endpoints depending on the model. Zen itself is the gateway: Noola can call it directly with a Zen API key, without another gateway or an OpenCode client in between. It charges 4.4% plus $0.30 per card transaction. Its documented reload adds $20 below a $5 balance; disable automatic reload before any funded trial. A monthly usage limit does not cap reload cash charges. Model retention has exceptions, including 30 days for OpenAI/Anthropic and training-related exceptions for some free models. INR checkout is unverified, not disproven. [OpenCode's terms](https://opencode.ai/legal/terms-of-service) also leave downstream model terms applicable. The [Go documentation](https://opencode.ai/docs/go/) asks clients to produce coding-agent traffic; an API key alone does not establish suitability for this household app. Do not impersonate a coding client.

For Vercel, [provider routing](https://vercel.com/docs/ai-gateway/models-and-providers/provider-options) supports an explicit `only` restriction. Noola should fail visibly when no permitted route is available. [Gateway budgets](https://vercel.com/docs/ai-gateway/observability-and-spend/budgets) supplement the application ledger: newly created key budgets can take time to enforce, and documented BYOK spend is excluded. Provider controls alone do not prove Noola's all-route pause or a race-free monetary ceiling.

Production eligibility remains separate. In particular, [Vercel ZDR enforcement](https://vercel.com/docs/ai-gateway/security-and-compliance/zdr) is documented for Pro/Enterprise. Do not assume that control is available with ordinary gateway credits, or buy a plan to obtain it without repricing. A model/provider configuration satisfying the existing production retention/no-training requirements needs its own evidence. Nonproduction synthetic evaluation remains allowed under the owner's existing exception.

### Proposed route policy

1. Resolve the authenticated Noola adult, allowed context and AI-pause state before any provider request.
2. Use that adult's eligible, explicitly connected ChatGPT plan when the capability is supported.
3. If it cannot serve the request, explain the limitation. Offer the configured paid route only under the adult's applicable processing choice and Nishanth's funding authorization. An account without the required Codex entitlement may therefore use an authorized paid route without borrowing another adult's session.
4. Initially evaluate GPT-6 Luna for paid text, with GPT-6.1 Sol as a measured alternative. Keep both configurable; a catalog entry is not a language-quality result.
5. Admit bounded paid work against a reservation that includes input, maximum billable output/reasoning, retries and tools. Disable provider auto-retries or account for every attempt. Unknown completion/usage remains unknown until reconciled.
6. On paid allocation exhaustion, pause all optional AI, including subscription routes, as already decided. Manual records, lists, privacy controls and ordinary saved reminders continue. No new route bypasses the pause.

<a id="monthly-budget"></a>
## Monthly workload and cost worksheet

This is a sensitivity model, not measured usage or a quote. Use **₹100 per USD plus 25% contingency**, giving ₹125 per priced USD. ₹100 is a planning conversion assumption, not a claimed exchange rate; the 25% is a buffer, not an asserted tax rate. Replace both with checkout/invoice evidence and allow for any larger actual fee. No free credit, cached-input discount or subscription capacity is needed for these paid-token calculations.

The normal text assumption is two adults × 20 AI turns/day × 30 days = 1,200 turns. Allow 25% extra model calls for retries/repairs, producing 1,500 priced calls. Each uses 4,000 total input tokens and 1,000 billable output tokens, including reasoning where charged. This is an average workload assumption, not an implementation limit. Input includes instructions, history and retrieved evidence. Long Tamil/transliterated inputs must be measured rather than estimated from English character counts.

Observed list prices per million tokens: [GPT-6 Luna](https://vercel.com/ai-gateway/models/gpt-6-luna) $0.10 input / $0.50 output; [GPT-6.1 Sol](https://vercel.com/ai-gateway/models/gpt-6.1-sol) from $2 input / $10 output. Recheck the exact serving route, context tier and any surcharges at admission. The calculation is `(input millions × input price + output millions × output price) × 125`.

| Paid usage scenario | Monthly tokens including assumed extra calls | Token USD | INR planning envelope |
|---|---|---|---|
| Normal, all Luna | 6M input + 1.5M output | $1.35 | ₹169 |
| Normal, 90% Luna and 10% Sol at the same token sizes | 6M input + 1.5M output | $3.915 | ₹489 |
| Normal, all Sol | 6M input + 1.5M output | $27.00 | ₹3,375; exceeds the AI allocation |
| Heavy, all Luna: 100 turns/adult/day, 25% extra calls, 12k input and 3k output/call | 90M input + 22.5M output | $20.25 | ₹2,531; exceeds the AI allocation |

**Conclusion:** Modest text use has room within ₹2,000, even if every request is paid. A stronger default model or long/high-volume use can fail the allocation. This does not establish quality or the affordability of the full later release: voice, files, embeddings, web search, background briefs and larger retained context need separate additions before introduction. Unused allocation is headroom, not a reason to spend it.

Credit purchases and usage are separate ledger entries. For illustration, Zen's documented fee makes a hypothetical $10 credit purchase $10.74 before other charges, or ₹1,342.50 under the planning factor; $20 becomes $21.18, or ₹2,647.50. These are arithmetic examples, not confirmation that either top-up denomination is available. A reload can exceed the AI cash allocation while actual token use remains small. Inspect the selected checkout, minimum purchase, fees and disabled reload state before proposing a concrete purchase. No purchase or account change was made.

### Infrastructure within the baseline reserve

Keep the existing host shortlist. Evaluate the existing E2E VM as primary app/database host, with an independently durable restriction journal on the other allowed host; OneDrive holds encrypted backup generations and keys stay separately in Vaultwarden/offline custody. Availability, incremental invoice impact and replacement cost of the existing resources remain unknown. Existing resources are not assumed free.

[Railway pricing](https://docs.railway.com/pricing/plans) lists a $5 Hobby minimum including $5 usage, then actual resource costs: $10/GB-month RAM, $20/vCPU-month CPU, $0.15/GB-month volume and $0.05/GB egress. Do not add the $5 twice. Its Pro collaboration requirement also matters for independently delegated operation; do not assume Hobby supplies an alternate operator's workspace membership.

| Hosting sensitivity | Calculation | Remaining from ₹1,000 baseline |
|---|---|---|
| Existing E2E primary plus Railway journal below Hobby included usage | At least $5 × 125 = ₹625 Railway, before existing-host allocation and other services | At most ₹375 for E2E allocation, backup/key custody, domain and other costs |
| Railway app/database combined average 0.5 GB RAM, 0.02 vCPU, 2 GB volume, 5 GB egress | `max(5, 5 + 0.4 + 0.3 + 0.25)` = $5.95; ₹743.75 | ₹256.25 for independent journal and all remaining costs |
| Same Railway workload at 1 GB average RAM | `10 + 0.4 + 0.3 + 0.25` = $10.95; ₹1,368.75 | Fails baseline before independent recovery costs |

These are assumed utilization levels, not deployment measurements. The warm local Vite development footprint is not production sizing. Measure built web assets, API, PostgreSQL and journal separately over an idle/day-load window before committing to a host. If the independently durable arrangement cannot fit ₹1,000, propose a specific allocation/hosting revision; do not silently consume the AI reserve or weaken recovery.

[Resend's free transactional allowance](https://resend.com/pricing) currently lists 3,000 emails/month with a 100/day limit. It is a candidate for low-volume identity mail, subject to domain setup, quotas and actual delivery. Local Mailpit remains the nonproduction choice. Include domain renewal, existing OneDrive capacity, history/cleanup, backup transfers, key custody and invoice charges in the baseline ledger. Production email is not validated by a local capture test.

<a id="recovery-plan"></a>
## Recovery and independent control plan

The existing [recovery decision](../adr/005-lifecycle-recovery.md) already selects an independent restriction journal. What remains is to specify and prove custody and failure behavior, rather than reopen that decision.

| Responsibility | Proposed arrangement | Evidence still needed before real retained use |
|---|---|---|
| Live records | PostgreSQL on the selected primary host; private original storage when introduced | Available capacity, actual operator access and least-privilege application/migration credentials |
| Current restrictions | Content-free ordered journal outside the primary host's failure/restore boundary | Durable acknowledgments, idempotent retry, completeness checks and lost-primary/crash tests |
| Recovery generations | Independently encrypted database/file bundles and manifests in restricted OneDrive | Successful upload/checksum, retention/history/trash cleanup and restore from another machine |
| Keys | Separate Vaultwarden access plus offline recovery copy | Recovery when the primary host or password-manager host is lost; no circular dependency |
| Alternate operator | A named person with their own accepted operational access and instructions | Recover without Nishanth, without automatically granting private in-app rights |
| Adult account recovery | Independent verified recovery path; local Mailpit tests then production delivery | Invitations, expiry, replay rejection, reset/revocation and browser-state clearing |

Preserve the canonical ordering: apply restrictions locally, durably append outside the primary restore boundary, then acknowledge completion. Pending replication stays restrictive and visibly pending. An older content restore stays closed until the current journal and completeness are verified. Test crashes between these steps; a second container on the primary host is not independent custody.

The existing target is a daily recovery copy, at most 24-hour data loss and restoration within 24 hours after the operator starts, with no resurrection of deleted information or revoked grants. Rehearsals keep outbound actions paused. These targets come from [QLT-09](../reference/ACCEPTANCE.md#qlt-09); they have not been demonstrated by the local temporary-file proof.

<a id="validation-sequence"></a>
## Evidence collection before the first product slice

| Order | Bounded work | Completion evidence |
|---|---|---|
| 1 | Review these proposed scenarios and keep independent adult feedback explicitly pending where absent | Chosen first jobs, audience and expected outcome; no invented consent |
| 2 | Implement the bounded Codex SDK harness below with fake transport first | Pinned release review, isolated runtime design, deterministic negative tests and sanitized evidence format |
| 3 | Complete native Codex login with one explicitly connected adult, then a second consenting adult | Actual account/model entitlement and completed synthetic response; separate credentials/history; account-specific evidence, no inferred second-account pass |
| 4 | Qualify the selected paid candidate only if needed and authorized | Model/format support, INR invoice versus conversion, fees, limits, disabled top-up and named payer |
| 5 | Run a small synthetic route probe, then applicable recall/authority evaluation | Valid structured result, exact allowed sources, no false action claims; refusal/timeout/unsupported capability/partial stream/revocation/429 cases; no silent paid switch |
| 6 | Replace host and recovery assumptions with a priced arrangement | Actual resource availability, independent journal location, backup/key access, named alternate operator and cost envelope |
| 7 | Reconcile Phase 0 evidence and write the first slice's implementation specification | Passed planning items separated from pending account/runtime/production proof; affected requirements and tests identified |

The route probe should use fictional adults and synthetic versions of the four scenarios. Paid inference is not needed to check every failure path: simulate gateway errors, budget races and interrupted streams, then distinguish those simulations from observed provider behavior. Do not deliberately exhaust a subscription to manufacture a quota result.

When a route is enabled for recall, retain the [existing evaluation targets](../reference/ACCEPTANCE.md#quality-and-evaluation): 100 answerable fixtures with at least 95 correct source-backed answers, 30 unanswerable cases with no unsupported factual assertion, and at least 20 forbidden cross-member questions with zero disclosure. Include English, Tamil, transliteration and mixed cases. Prompt injection in saved source text cannot change permissions or execute an action. A small feasibility probe does not replace those acceptance sets.

Production budget controls must later be tested with concurrent reservations, unknown charges, retries, month boundaries and pause behavior across every enabled route. Mobile installation/push/session checks remain at deployed acceptance. Scheduled AI, audio, documents and notification delivery are qualified when introduced; the research does not move those features into the first slice.

<a id="codex-sdk-spike"></a>
## Next item Codex SDK feasibility spike

**Status: accepted for implementation; not executed.** Start with G02 and the [provider boundary](../reference/APPLICATION-DESIGN.md#provider-contracts). Load the repository code-structure skill before source changes. Extend the existing experiment area under `apps/api/experiments/phase0`; keep the harness outside production entry points, with no product endpoint, schema or worker. Add an exact development dependency only when implementation begins. This plan does not create a second production authentication system.

1. **Build the offline harness.** Define a narrow request/result boundary with synthetic principal IDs, authorized sources, output schema, deadline and cancellation. Use fake execution to test malformed/incomplete output, missing login, entitlement failure, quota failure, timeout, cancellation, stale source revisions and household AI pause. Record simulated results separately from observed provider responses. No automatic paid fallback or default payer is allowed.
2. **Pin and contain the runtime.** Verify the released SDK/CLI behavior. Allocate distinct private runtime state and empty work directories per adult; prove sanitized environment, thread ownership and denied access to canary files outside the allowed area. Disable unnecessary tools/web access through supported controls and verify effective restrictions. Read-only filesystem mode alone is insufficient. If the SDK cannot enforce the required boundary, stop adoption and document the limitation rather than weakening the requirement.
3. **Connect one account deliberately.** Let the owner complete the official native Codex browser/device login for this experiment. Do not import the development assistant's credentials. Run one short fictional recall case and validate its schema and source references. Record exact model, package/runtime version, elapsed time, outcome and available usage metadata without prompt content, authentication tokens, credential paths or private identifiers. Unknown cost/usage stays unknown. Do not enable API-key billing as a hidden fallback.
4. **Prove two-principal isolation.** Exercise fictional adults A and B in both directions: authorized recall, forbidden requests, mismatched principal/thread IDs and source-text prompt injection. Repeat with two independently connected, consenting accounts before claiming account-level isolation. One real account plus fake transports proves only the tested boundaries; it cannot pass the two-account requirement. Generated output cannot mutate household records or invoke unrestricted actions.
5. **Prove lifecycle cleanup.** Verify correction/forgetting excludes stale context and thread reuse; inspect actual session/cache/log artifacts using synthetic canaries. Determine whether the pinned SDK can avoid history or requires explicit verified cleanup. Test interrupted execution and disconnect; delete experiment content/history while preserving credentials unless the user disconnects. Local cleanup is distinct from provider-side retention, which remains separately disclosed and qualified.
6. **Review the result.** Run focused offline tests, applicable workspace checks and the opt-in live probe; CI never receives personal ChatGPT credentials. Record pass/fail/pending, exact configuration, limitations and sanitized evidence in this report. Measure latency and process memory; evaluate whether the runtime is practical for the planned host. A failure must leave the running health-only application usable.

**Exit decision:** adopt a production adapter only after account access, validated text output, runtime containment, principal isolation and retained-history handling are demonstrated. Keep unresolved second-account/hosted/production evidence Pending. If a required capability fails, qualify Vercel as the explicitly funded alternative; evaluate Zen in its place if checkout is the deciding issue. Do not build both paid integrations preemptively. Actual payment, model quality and broader Phase 0 gates are separate from this bounded spike.

### Cleanup before starting

The superseded private-client registration draft and duplicate direct Responses implementation instructions have been removed from the active plan. Their distinct integration remains a short deferred note above. Keep the useful scenario/cost research, synthetic identity/persistence proofs, failed upstream declaration evidence and stable gate anchors. No SDK/gateway was installed during planning, and no credential, volume or database cleanup is part of this documentation change. Spike implementation must add cleanup for its own artifacts and record any leftovers precisely; never sweep unrelated accounts or databases.

## Review status and remaining inputs

Completed here: proposed scenarios, official subscription/gateway research, Go-versus-Zen distinction, INR uncertainty analysis, independently calculated cost sensitivities, recovery responsibilities, and an ordered validation plan. No product code, credentials, registrations, infrastructure purchases or paid provider calls were created.

Still needed: actual native Codex eligibility for each adult and SDK runtime containment/retention proof; the exact OpenCode product and checkout currency if Zen is pursued; existing-host/storage availability and cost; and the alternate recovery operator. Scenario usefulness and each adult's consent remain independently collected. Full G02/G06/G09/G14 and Phase 0 are not marked Passed by this document.

The next technical deliverable is the owner-approved [Codex SDK spike](#codex-sdk-spike). The first subsequent product slice remains invitation → sign-in → private text save → authorized source-backed retrieval → correction → forgetting, with recovery and browser-state controls before real data. Shared lists follow within Phase 1. See the [execution record](PHASE-0-READINESS.md) for already completed synthetic checks.

import { z } from "zod";

const count = z.number().int().nonnegative();
const safeName = z.string().regex(/^[a-zA-Z0-9._-]{1,80}$/);
// Projection deliberately drops unknown fields, prompts, identifiers and raw errors.
const evidenceSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("preflight"),
    checks: z.array(
      z.object({
        id: z.enum([
          "pinned-cli",
          "outer-container-restrictions",
          "network-positive-control",
          "model-tool-catalog-empty",
          "forged-tool-calls-rejected",
          "effective-disabled-features",
          "sandbox-positive-control",
          "credential-read-denied",
          "proc-credential-bypass-denied",
          "work-write-denied",
          "tool-network-denied",
          "preflight-cleanup",
        ]),
        passed: z.boolean(),
        status: z.literal("not-run").optional(),
      }),
    ),
  }),
  z.object({
    kind: z.literal("scenario"),
    id: z.enum([
      "english",
      "tamil",
      "mixed",
      "unanswerable",
      "injection",
      "before-correction",
      "after-correction",
      "after-forget",
      "cancel",
      "after-cancel",
    ]),
    passed: z.boolean(),
    outcome: z.enum([
      "found",
      "not_found",
      "invalid_request",
      "paused",
      "disconnected",
      "cancelled",
      "timeout",
      "busy",
      "invocation_cap",
      "invalid_output",
      "stale_context",
      "quota",
      "entitlement",
      "transport",
      "incomplete",
      "unexpected_tool",
      "provider_unknown",
    ]),
    elapsedMs: count,
    invocations: count.max(10),
    model: safeName,
    usage: z
      .object({
        input_tokens: count,
        cached_input_tokens: count,
        output_tokens: count,
        reasoning_output_tokens: count.optional(),
      })
      .nullable(),
    observableRetries: z.null(),
    harnessRetries: z.literal(0),
  }),
  z.object({
    kind: z.literal("live"),
    status: z.literal("pending"),
    reason: z.literal("fresh_login_required"),
    invocations: z.literal(0),
  }),
  z.object({
    kind: z.literal("live-summary"),
    invocations: count.max(10),
    peakBytes: count.nullable(),
    model: safeName,
  }),
  z.object({
    kind: z.literal("cleanup"),
    contentRemoved: z.boolean(),
    credentialRetained: z.boolean(),
  }),
  z.object({
    kind: z.literal("failure"),
    reason: z.literal("runtime_or_cleanup_failure"),
    rawDetailsRetained: z.literal(false),
  }),
]);
export type Evidence = z.infer<typeof evidenceSchema>;
export function parseEvidence(line: string): Evidence | null {
  try {
    const result = evidenceSchema.safeParse(JSON.parse(line));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

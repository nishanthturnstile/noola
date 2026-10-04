import { z } from "zod";

export const principalSchema = z.enum(["adult-a", "adult-b"]);
export type Principal = z.infer<typeof principalSchema>;
export const sourceSchema = z.strictObject({
  id: z.string().min(1).max(80),
  owner: principalSchema,
  revision: z.number().int().positive(),
  text: z.string().min(1).max(8_000),
});
export type Source = z.infer<typeof sourceSchema>;
const requestSchema = z.strictObject({
  principal: principalSchema,
  requestId: z.string().min(1).max(80),
  question: z.string().min(1).max(2_000),
  deadline: z.number().finite(),
});
export type RecallRequest = z.infer<typeof requestSchema>;
export const outputSchema = z.strictObject({
  status: z.enum(["found", "not_found"]),
  evidence: z
    .array(
      z.strictObject({
        sourceId: z.string(),
        revision: z.number().int().positive(),
        quote: z.string().min(1).max(8_000),
      }),
    )
    .max(3),
});
export type RecallOutput = z.infer<typeof outputSchema>;
export type Failure =
  | "invalid_request"
  | "paused"
  | "disconnected"
  | "cancelled"
  | "timeout"
  | "busy"
  | "invocation_cap"
  | "invalid_output"
  | "stale_context"
  | "quota"
  | "entitlement"
  | "transport"
  | "incomplete"
  | "unexpected_tool"
  | "provider_unknown";
export class ExecutionFailure extends Error {
  constructor(readonly kind: Failure) {
    super(kind);
  }
}
export type Result =
  | { ok: true; output: RecallOutput }
  | { ok: false; reason: Failure };
export type State = { paused: boolean; connected: boolean; sources: Source[] };
export type Execution = {
  question: string;
  sources: Omit<Source, "owner">[];
  signal: AbortSignal;
};
export type Executor = (input: Execution) => Promise<string>;

/** State and runtime selection belong to the caller's trusted boundary, never model input. */
export function createHarness(
  state: (principal: Principal) => State,
  runtime: (principal: Principal) => Executor,
  limit = 10,
) {
  const active = new Set<Principal>();
  let invocations = 0;
  return {
    get invocations() {
      return invocations;
    },
    async recall(input: unknown, signal: AbortSignal): Promise<Result> {
      const parsed = requestSchema.safeParse(input);
      if (!parsed.success) return { ok: false, reason: "invalid_request" };
      const request = parsed.data;
      const current = state(request.principal);
      if (current.paused) return { ok: false, reason: "paused" };
      if (!current.connected) return { ok: false, reason: "disconnected" };
      if (signal.aborted) return { ok: false, reason: "cancelled" };
      if (request.deadline <= Date.now())
        return { ok: false, reason: "timeout" };
      if (active.has(request.principal)) return { ok: false, reason: "busy" };
      if (invocations >= limit) return { ok: false, reason: "invocation_cap" };
      const sources = z.array(sourceSchema).safeParse(current.sources);
      if (!sources.success) return { ok: false, reason: "invalid_request" };
      const snapshot = sources.data.filter(
        (source) => source.owner === request.principal,
      );
      if (
        snapshot.length > 3 ||
        new Set(snapshot.map((source) => source.id)).size !== snapshot.length
      )
        return { ok: false, reason: "invalid_request" };
      const deadline = Math.min(request.deadline, Date.now() + 90_000);
      const checkCurrent = () => {
        if (Date.now() >= deadline) throw new ExecutionFailure("timeout");
        const latest = state(request.principal);
        if (latest.paused) throw new ExecutionFailure("paused");
        if (!latest.connected) throw new ExecutionFailure("disconnected");
        if (
          snapshot.some(
            (source) =>
              !latest.sources.some(
                (now) =>
                  now.owner === request.principal &&
                  now.id === source.id &&
                  now.revision === source.revision &&
                  now.text === source.text,
              ),
          )
        )
          throw new ExecutionFailure("stale_context");
      };
      const controller = new AbortController();
      let timeout = false;
      const cancel = () => controller.abort();
      signal.addEventListener("abort", cancel, { once: true });
      const timer = setTimeout(
        () => {
          timeout = true;
          controller.abort();
        },
        Math.max(1, deadline - Date.now()),
      );
      active.add(request.principal);
      try {
        const execution = Promise.resolve().then(() => {
          controller.signal.throwIfAborted();
          checkCurrent();
          if (invocations >= limit)
            throw new ExecutionFailure("invocation_cap");
          invocations++;
          return runtime(request.principal)({
            question: request.question,
            sources: snapshot.map(({ id, revision, text }) => ({
              id,
              revision,
              text,
            })),
            signal: controller.signal,
          });
        });
        // An executor that ignores cancellation must keep its principal locked until it settles.
        const settled = execution.finally(() =>
          active.delete(request.principal),
        );
        const aborted = new Promise<never>((_, reject) => {
          const fail = () =>
            reject(new ExecutionFailure(timeout ? "timeout" : "cancelled"));
          if (controller.signal.aborted) fail();
          else
            controller.signal.addEventListener("abort", fail, { once: true });
        });
        const raw = await Promise.race([settled, aborted]);
        if (controller.signal.aborted)
          throw new ExecutionFailure(timeout ? "timeout" : "cancelled");
        checkCurrent();
        if (raw.length > 32_000) throw new ExecutionFailure("invalid_output");
        let output: RecallOutput;
        try {
          output = outputSchema.parse(JSON.parse(raw));
        } catch {
          throw new ExecutionFailure("invalid_output");
        }
        if (
          (output.status === "found") !== output.evidence.length > 0 ||
          output.evidence.some(
            (evidence) =>
              !snapshot.some(
                (source) =>
                  source.id === evidence.sourceId &&
                  source.revision === evidence.revision &&
                  source.text.includes(evidence.quote),
              ),
          )
        )
          throw new ExecutionFailure("invalid_output");
        return { ok: true, output };
      } catch (error) {
        return {
          ok: false,
          reason: controller.signal.aborted
            ? timeout
              ? "timeout"
              : "cancelled"
            : error instanceof ExecutionFailure
              ? error.kind
              : "provider_unknown",
        };
      } finally {
        clearTimeout(timer);
        signal.removeEventListener("abort", cancel);
      }
    },
  };
}

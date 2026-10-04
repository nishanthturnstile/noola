import { lstat, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { Codex } from "@openai/codex-sdk";
import { z } from "zod";

const requestSchema = z.object({
  tools: z.array(z.unknown()).optional(),
  input: z.array(z.unknown()),
});
const outputSchema = z.object({
  type: z.enum(["function_call_output", "custom_tool_call_output"]),
  call_id: z.string(),
  output: z.string(),
});
export function inspectToolRequest(value: unknown) {
  const request = requestSchema.parse(value);
  return {
    noTools: (request.tools?.length ?? 0) === 0,
    rejectedCalls: request.input.flatMap((item) => {
      const parsed = outputSchema.safeParse(item);
      return parsed.success ? [parsed.data] : [];
    }),
  };
}

/** Actual pinned SDK/CLI, local synthetic HTTP peer, separate home, no login. */
export async function probeTools(
  policy: string,
  environment: Record<string, string>,
  model: string,
) {
  const catalog = z
    .object({ models: z.array(z.object({ slug: z.string() })) })
    .parse(JSON.parse(await readFile("/etc/codex/models.json", "utf8")));
  if (!catalog.models.some((entry) => entry.slug === model))
    return { noTools: false, forgedCallsRejected: false };
  const home = await mkdtemp("/home/node/tool-probe-");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20_000);
  let requests = 0;
  let noTools = true;
  const rejected = new Set<string>();
  const server = createServer(async (request, response) => {
    try {
      if (request.method !== "POST" || request.url !== "/responses")
        throw new Error("unexpected_request");
      let body = "";
      for await (const chunk of request) {
        body += chunk.toString();
        if (body.length > 256_000) throw new Error("oversized_request");
      }
      if (++requests > 2) throw new Error("unexpected_retry");
      const inspected = inspectToolRequest(JSON.parse(body));
      noTools &&= inspected.noTools;
      for (const item of inspected.rejectedCalls) {
        if (
          item.call_id === "synthetic-exec" &&
          item.output === "unsupported call: exec_command"
        )
          rejected.add("exec");
        if (
          item.call_id === "synthetic-patch" &&
          item.output === "unsupported custom tool call: apply_patch"
        )
          rejected.add("patch");
      }
      const items =
        requests === 1
          ? [
              {
                type: "function_call",
                name: "exec_command",
                call_id: "synthetic-exec",
                arguments: JSON.stringify({ cmd: "touch /work/tool-executed" }),
              },
              {
                type: "custom_tool_call",
                name: "apply_patch",
                call_id: "synthetic-patch",
                input:
                  "*** Begin Patch\n*** Add File: /work/tool-executed\n+x\n*** End Patch",
              },
            ]
          : [
              {
                type: "message",
                role: "assistant",
                id: "synthetic-message",
                content: [{ type: "output_text", text: "synthetic-complete" }],
              },
            ];
      const events = [
        { type: "response.created", response: { id: "synthetic-response" } },
        ...items.map((item) => ({ type: "response.output_item.done", item })),
        {
          type: "response.completed",
          response: {
            id: "synthetic-response",
            usage: { input_tokens: 0, output_tokens: 0, total_tokens: 0 },
          },
        },
      ];
      response.writeHead(200, { "content-type": "text/event-stream" });
      response.end(
        events
          .map((e) => `event: ${e.type}\ndata: ${JSON.stringify(e)}\n\n`)
          .join(""),
      );
    } catch {
      noTools = false;
      response.writeHead(500).end();
      controller.abort();
    }
  });
  try {
    await writeFile(`${home}/config.toml`, policy, { mode: 0o600 });
    await new Promise<void>((resolve, reject) => {
      server.once("error", reject);
      server.listen(0, "127.0.0.1", resolve);
    });
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("no_listener");
    const sdk = new Codex({
      env: { ...environment, CODEX_HOME: home },
      config: {
        model_provider: "containment_probe",
        model_providers: {
          containment_probe: {
            name: "Local synthetic containment probe",
            base_url: `http://127.0.0.1:${address.port}`,
            wire_api: "responses",
            requires_openai_auth: false,
            request_max_retries: 0,
            stream_max_retries: 0,
          },
        },
      },
    });
    const result = await sdk
      .startThread({ model, workingDirectory: "/work", skipGitRepoCheck: true })
      .run("Synthetic containment test.", { signal: controller.signal });
    const completed =
      result.finalResponse === "synthetic-complete" && requests === 2;
    let untouched = false;
    try {
      await lstat("/work/tool-executed");
    } catch (error) {
      untouched =
        error instanceof Error && "code" in error && error.code === "ENOENT";
    }
    return {
      noTools: completed && noTools,
      forgedCallsRejected: completed && rejected.size === 2 && untouched,
    };
  } catch {
    return { noTools: false, forgedCallsRejected: false };
  } finally {
    controller.abort();
    clearTimeout(timer);
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
    await rm(home, { recursive: true, force: true });
    await rm("/work/tool-executed", { force: true });
  }
}

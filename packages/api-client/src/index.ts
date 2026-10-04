import {
  liveSchema,
  readySchema,
  unavailableSchema,
} from "@noola/contracts/health";
import createClient from "openapi-fetch";
import type { paths } from "./schema.js";
export function createApiClient(
  baseUrl = "",
  fetcher: typeof globalThis.fetch = globalThis.fetch,
) {
  const client = createClient<paths>({ baseUrl, fetch: fetcher });
  return {
    async liveness(signal?: AbortSignal) {
      const result = await client.GET("/api/health/live", {
        ...(signal ? { signal } : {}),
      });
      if (result.response.status !== 200)
        throw new Error("Liveness request failed");
      return liveSchema.parse(result.data);
    },
    async readiness(signal?: AbortSignal) {
      const result = await client.GET("/api/health/ready", {
        ...(signal ? { signal } : {}),
      });
      if (result.response.status === 503)
        return unavailableSchema.parse(result.error);
      if (result.response.status !== 200)
        throw new Error("Readiness request failed");
      return readySchema.parse(result.data);
    },
  };
}

export type { paths } from "./schema.js";

import {
  identityEndpoints,
  identityErrorSchema,
} from "@noola/contracts/identity";
import { z } from "zod";

type EndpointName = keyof typeof identityEndpoints;
type Input<K extends EndpointName> = (typeof identityEndpoints)[K] extends {
  input: infer S extends z.ZodType;
}
  ? z.input<S>
  : never;
type Output<K extends EndpointName> = z.infer<
  (typeof identityEndpoints)[K]["output"]
>;
export class IdentityApiError extends Error {
  constructor(
    public readonly code: z.infer<typeof identityErrorSchema>["code"],
    message: string,
  ) {
    super(message);
  }
}
export function createIdentityClient(
  baseUrl = "",
  fetcher: typeof fetch = globalThis.fetch,
) {
  async function call<K extends EndpointName>(
    name: K,
    ...args: (typeof identityEndpoints)[K] extends { input: z.ZodType }
      ? [input: Input<K>, signal?: AbortSignal]
      : [signal?: AbortSignal]
  ): Promise<Output<K>> {
    const endpoint = identityEndpoints[name];
    const mutation = "input" in endpoint;
    const input = mutation ? endpoint.input.parse(args[0]) : undefined;
    const signal = mutation ? args[1] : args[0];
    const response = await fetcher(`${baseUrl}${endpoint.path}`, {
      method: endpoint.method.toUpperCase(),
      credentials: "same-origin",
      cache: "no-store",
      ...(signal instanceof AbortSignal ? { signal } : {}),
      ...(mutation
        ? {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
          }
        : {}),
    });
    const data: unknown = await response.json();
    if (!response.ok) {
      const error = identityErrorSchema.parse(data);
      throw new IdentityApiError(error.code, error.message);
    }
    return endpoint.output.parse(data) as Output<K>;
  }
  async function auth(
    path:
      | "sign-in/email"
      | "sign-out"
      | "request-password-reset"
      | "send-verification-email"
      | "verify-email"
      | "reset-password"
      | "change-password",
    body: unknown,
    signal?: AbortSignal,
  ) {
    const response = await fetcher(`${baseUrl}/api/auth/${path}`, {
      method: "POST",
      credentials: "same-origin",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      ...(signal ? { signal } : {}),
    });
    const data: unknown = await response.json();
    if (!response.ok) {
      const error = identityErrorSchema.parse(data);
      throw new IdentityApiError(error.code, error.message);
    }
    return z.object({ status: z.boolean(), message: z.string() }).parse(data);
  }
  return { call, auth };
}

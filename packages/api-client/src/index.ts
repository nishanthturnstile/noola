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

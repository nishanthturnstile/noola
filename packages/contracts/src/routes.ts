import { createRoute } from "@hono/zod-openapi";
import { liveSchema, readySchema, unavailableSchema } from "./health.js";

const json = <T>(schema: T, description: string) => ({
  description,
  content: { "application/json": { schema } },
});
export const liveRoute = createRoute({
  method: "get",
  path: "/api/health/live",
  operationId: "getLiveness",
  responses: { 200: json(liveSchema, "Process is running") },
});
export const readyRoute = createRoute({
  method: "get",
  path: "/api/health/ready",
  operationId: "getReadiness",
  responses: {
    200: json(readySchema, "Database is reachable"),
    503: json(unavailableSchema, "Database is unavailable"),
  },
});

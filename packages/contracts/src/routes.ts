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

import { identityEndpoints, identityErrorSchema } from "./identity.js";
export const identityRoutes = Object.entries(identityEndpoints).map(
  ([name, endpoint]) =>
    createRoute({
      method: endpoint.method,
      path: endpoint.path,
      operationId: name,
      ...("input" in endpoint
        ? {
            request: {
              body: {
                required: true,
                content: { "application/json": { schema: endpoint.input } },
              },
            },
          }
        : {}),
      responses: {
        200: json(endpoint.output, "Current authority or committed outcome"),
        400: json(identityErrorSchema, "Invalid request"),
        401: json(identityErrorSchema, "Sign-in required"),
        403: json(identityErrorSchema, "Operation forbidden"),
        409: json(identityErrorSchema, "Conflict"),
        423: json(identityErrorSchema, "Session locked"),
        429: json(identityErrorSchema, "Rate limited"),
        503: json(identityErrorSchema, "Unavailable"),
      },
    }),
);

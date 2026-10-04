import { OpenAPIHono } from "@hono/zod-openapi";
import {
  liveSchema,
  readySchema,
  unavailableSchema,
} from "@noola/contracts/health";
import { liveRoute, readyRoute } from "@noola/contracts/routes";
export function createApp(checkDatabase: () => Promise<void>) {
  const app = new OpenAPIHono();
  app.use("/api/health/*", async (context, next) => {
    context.header("Cache-Control", "no-store");
    await next();
  });
  app.openapi(liveRoute, (context) =>
    context.json(liveSchema.parse({ status: "ok" }), 200),
  );
  app.openapi(readyRoute, async (context) => {
    try {
      await checkDatabase();
      return context.json(readySchema.parse({ status: "ready" }), 200);
    } catch {
      return context.json(
        unavailableSchema.parse({ status: "unavailable" }),
        503,
      );
    }
  });
  app.onError((_error, context) =>
    context.json({ error: "Internal server error" }, 500),
  );
  return app;
}

import { OpenAPIHono } from "@hono/zod-openapi";
import {
  liveSchema,
  readySchema,
  unavailableSchema,
} from "@noola/contracts/health";
import { liveRoute, readyRoute } from "@noola/contracts/routes";
import { z } from "zod";
import type { Identity } from "../modules/identity/index.js";
import { IdentityError } from "../modules/identity/repository.js";
import { bindIdentity } from "./identity.js";
export function createApp(
  checkDatabase: () => Promise<void>,
  identity?: Identity,
) {
  const app = new OpenAPIHono();
  if (identity) bindIdentity(app, identity);
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
  app.onError((error, context) => {
    if (error instanceof IdentityError) {
      const statuses = {
        unauthorized: 401,
        locked: 423,
        forbidden: 403,
        conflict: 409,
        invalid: 400,
        rate_limited: 429,
      } as const;
      return context.json(
        { code: error.code, message: error.message },
        statuses[error.code],
      );
    }
    if (error instanceof z.ZodError || error instanceof SyntaxError)
      return context.json(
        {
          code: "invalid",
          message: "Check the supplied fields and try again.",
        },
        400,
      );
    const databaseError = z
      .object({ code: z.string().regex(/^[A-Z0-9]{5}$/) })
      .safeParse(error);
    console.error(
      "Application request failed",
      databaseError.success ? databaseError.data.code : "unexpected",
    );
    return context.json(
      {
        code: "unavailable",
        message: "The service is temporarily unavailable.",
      },
      503,
    );
  });
  return app;
}

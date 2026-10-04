import { createHash, randomUUID } from "node:crypto";
import type { OpenAPIHono } from "@hono/zod-openapi";
import {
  emailSchema,
  identityEndpoints,
  passwordSchema,
  resultSchema,
} from "@noola/contracts/identity";
import { z } from "zod";
import { createAuthentication } from "../modules/identity/authentication.js";
import type { Identity } from "../modules/identity/index.js";
import {
  IdentityError,
  rateLimit,
  transaction,
} from "../modules/identity/repository.js";

class AuthFailure extends Error {
  constructor(public response: Response) {
    super("Authentication request rejected");
  }
}
const authInputs = {
  "sign-in/email": z.object({
    email: emailSchema,
    password: z.string().min(1).max(128),
  }),
  "request-password-reset": z.object({ email: emailSchema }),
  "send-verification-email": z.object({ email: emailSchema }),
  "reset-password": z.object({
    token: z.string().min(1).max(2048),
    newPassword: passwordSchema,
  }),
  "verify-email": z.object({ token: z.string().min(1).max(2048) }),
  "change-password": z.object({
    currentPassword: z.string().min(1).max(128),
    newPassword: passwordSchema,
  }),
  "sign-out": z.object({}),
};
export function bindIdentity(app: OpenAPIHono, identity: Identity) {
  app.use("/api/*", async (c, next) => {
    c.header("Cache-Control", "no-store");
    c.header("Referrer-Policy", "no-referrer");
    c.header("X-Content-Type-Options", "nosniff");
    if (
      !["GET", "HEAD", "OPTIONS"].includes(c.req.method) &&
      c.req.header("Origin") !== identity.config.APP_ORIGIN
    )
      return c.json(
        { code: "forbidden", message: "Request origin is not allowed." },
        403,
      );
    await next();
  });
  app.post("/api/auth/*", async (c) => {
    const path = c.req.path.slice("/api/auth/".length);
    if (!(path in authInputs))
      return c.json(
        { code: "forbidden", message: "Authentication operation unavailable." },
        403,
      );
    const input = authInputs[path as keyof typeof authInputs].parse(
      await c.req.json(),
    );
    // Source comes from the server socket. Caller-controlled forwarding headers
    // cannot establish a source identity.
    const source = z
      .object({
        incoming: z.object({
          socket: z.object({ remoteAddress: z.string().optional() }),
        }),
      })
      .safeParse(c.env);
    const address = source.success
      ? (source.data.incoming.socket.remoteAddress ?? "local")
      : "local";
    const key = createHash("sha256").update(address).digest("hex");
    const mailRequest =
      path === "request-password-reset" || path === "send-verification-email";
    await rateLimit(
      identity.pool,
      `source:${mailRequest ? "email" : "auth"}:${key}`,
      mailRequest ? 5 : 20,
      mailRequest ? 900000 : 60000,
      identity.clock(),
    );
    if ("email" in input)
      await rateLimit(
        identity.pool,
        `target:${mailRequest ? "email" : "auth"}:${createHash("sha256").update(input.email).digest("hex")}`,
        mailRequest ? 3 : 10,
        mailRequest ? 900000 : 60000,
        identity.clock(),
      );
    if (path === "change-password") await identity.principal(c.req.raw.headers);
    try {
      const response = await transaction(identity.pool, async (db) => {
        const auth = createAuthentication(
          db,
          identity.config,
          false,
          identity.clock,
        );
        const headers = new Headers(c.req.raw.headers);
        headers.delete("x-forwarded-for");
        headers.delete("x-real-ip");
        headers.set("x-real-ip", address);
        if (path === "sign-out") {
          const session = await auth.api.getSession({ headers });
          if (session)
            await db.query(
              `INSERT INTO security_event (id,"userId",kind,"sessionId","createdAt") VALUES($1,$2,'sign-out',$3,$4)`,
              [
                randomUUID(),
                session.user.id,
                session.session.id,
                identity.clock(),
              ],
            );
        }
        const result =
          path === "verify-email" && "token" in input
            ? await auth.api.verifyEmail({
                query: { token: input.token },
                headers,
                asResponse: true,
              })
            : await auth.handler(
                new Request(`${identity.config.APP_ORIGIN}/api/auth/${path}`, {
                  method: "POST",
                  headers,
                  body: JSON.stringify({
                    ...input,
                    ...(path === "change-password"
                      ? { revokeOtherSessions: true }
                      : {}),
                  }),
                }),
              );
        if (!result.ok) throw new AuthFailure(result);
        return result;
      });
      // Authentication session tokens and user internals never enter app JSON.
      const headers = new Headers(response.headers);
      headers.set("Content-Type", "application/json");
      headers.set("Cache-Control", "no-store");
      return new Response(
        JSON.stringify({
          status: true,
          message: mailRequest
            ? "If this address is eligible, an account email has been queued."
            : "Completed.",
        }),
        { status: 200, headers },
      );
    } catch (error) {
      if (error instanceof AuthFailure) {
        const status = error.response.status === 429 ? 429 : 400;
        return c.json(
          {
            code: status === 429 ? "rate_limited" : "invalid",
            message:
              "Unable to complete this request. Check your details, email verification, or recovery link.",
          },
          status,
        );
      }
      throw error;
    }
  });
  app.all("/api/auth/*", (c) =>
    c.json(
      { code: "forbidden", message: "Authentication operation unavailable." },
      403,
    ),
  );
  for (const [name, endpoint] of Object.entries(identityEndpoints)) {
    app.on(endpoint.method.toUpperCase(), endpoint.path, async (c) => {
      if (name === "join") {
        const input = identityEndpoints.join.input.parse(await c.req.json());
        await rateLimit(
          identity.pool,
          "join:source",
          5,
          900000,
          identity.clock(),
        );
        return c.json(await identity.join(c.req.raw.headers, input));
      }
      if (name === "enrollment") {
        await rateLimit(
          identity.pool,
          "enrollment:source",
          5,
          900000,
          identity.clock(),
        );
        const input = identityEndpoints.enrollment.input.parse(
          await c.req.json(),
        );
        await rateLimit(
          identity.pool,
          `enrollment:${createHash("sha256").update(input.email).digest("hex")}`,
          3,
          900000,
          identity.clock(),
        );
        return c.json(resultSchema.parse(await identity.enroll(input)));
      }
      const p = await identity.principal(c.req.raw.headers);
      switch (name) {
        case "me":
          return c.json(await identity.me(p));
        case "settings":
          return c.json(
            await identity.settings(
              p,
              identityEndpoints.settings.input.parse(await c.req.json()),
            ),
          );
        case "household":
          return c.json(await identity.household(p));
        case "householdCommand":
          return c.json(
            await identity.householdCommand(
              p,
              identityEndpoints.householdCommand.input.parse(
                await c.req.json(),
              ),
            ),
          );
        case "devices":
          return c.json(await identity.devices(p));
        case "deviceCommand":
          return c.json(
            await identity.deviceCommand(
              p,
              identityEndpoints.deviceCommand.input.parse(await c.req.json()),
            ),
          );
        case "dependents":
          return c.json(await identity.dependents(p));
        case "dependentCommand":
          return c.json(
            await identity.dependentCommand(
              p,
              identityEndpoints.dependentCommand.input.parse(
                await c.req.json(),
              ),
            ),
          );
        case "aliases":
          return c.json(await identity.aliases(p));
        case "aliasCommand":
          return c.json(
            await identity.aliasCommand(
              p,
              identityEndpoints.aliasCommand.input.parse(await c.req.json()),
            ),
          );
        default:
          throw new IdentityError("invalid", "Operation unavailable.");
      }
    });
  }
}

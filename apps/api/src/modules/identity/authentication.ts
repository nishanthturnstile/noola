import { randomUUID } from "node:crypto";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { type BetterAuthOptions, betterAuth } from "better-auth/minimal";
import { drizzle } from "drizzle-orm/node-postgres";
import type pg from "pg";
import { enqueueEmail } from "../../adapters/email/ledger.js";
import type { Config } from "../../config.js";
import * as schema from "./schema.js";
export function createAuthentication(
  connection: pg.Pool | pg.PoolClient,
  config: Config,
  signup = false,
  clock = () => new Date(),
): ReturnType<typeof betterAuth> {
  const options: BetterAuthOptions = {
    appName: "Noola",
    baseURL: config.APP_ORIGIN,
    basePath: "/api/auth",
    secret: config.AUTH_SECRET,
    trustedOrigins: [config.APP_ORIGIN],
    database: drizzleAdapter(drizzle(connection, { schema }), {
      provider: "pg",
      schema,
      transaction: false,
    }),
    emailAndPassword: {
      enabled: true,
      disableSignUp: !signup,
      autoSignIn: false,
      requireEmailVerification: true,
      minPasswordLength: 12,
      maxPasswordLength: 128,
      revokeSessionsOnPasswordReset: true,
      resetPasswordTokenExpiresIn: 3600,
      sendResetPassword: async ({ user, token }) => {
        await enqueueEmail(
          connection,
          config,
          "reset",
          user.email,
          `${config.APP_ORIGIN}/reset#token=${encodeURIComponent(token)}`,
          clock(),
        );
      },
      onPasswordReset: async ({ user }) => {
        await connection.query(
          `INSERT INTO security_event (id,"userId",kind,"createdAt") VALUES ($1,$2,'password-reset',$3)`,
          [randomUUID(), user.id, clock()],
        );
        await enqueueEmail(
          connection,
          config,
          "recovery",
          user.email,
          `${config.APP_ORIGIN}/recovery`,
          clock(),
        );
      },
    },
    emailVerification: {
      expiresIn: 3600,
      autoSignInAfterVerification: false,
      sendOnSignUp: true,
      sendOnSignIn: false,
      sendVerificationEmail: async ({ user, token }) => {
        await enqueueEmail(
          connection,
          config,
          "verification",
          user.email,
          `${config.APP_ORIGIN}/verify#token=${encodeURIComponent(token)}`,
          clock(),
        );
      },
    },
    session: {
      expiresIn: 604800,
      updateAge: 86400,
      cookieCache: { enabled: false },
    },
    rateLimit: {
      enabled: true,
      storage: "database",
      window: 60,
      max: 100,
      customRules: {
        "/sign-in/email": { window: 60, max: 20 },
        "/request-password-reset": { window: 900, max: 5 },
        "/send-verification-email": { window: 900, max: 5 },
      },
    },
    advanced: {
      useSecureCookies: config.APP_ORIGIN.startsWith("https://"),
      defaultCookieAttributes: { httpOnly: true, sameSite: "lax" },
    },
    logger: { disabled: true },
    telemetry: { enabled: false },
  };
  return betterAuth(options);
}

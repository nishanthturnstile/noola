import { randomBytes } from "node:crypto";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { type BetterAuthOptions, betterAuth } from "better-auth/minimal";
import { drizzle } from "drizzle-orm/node-postgres";
import type pg from "pg";
import * as schema from "./schema.js";

export const origin = "http://phase0.invalid";
export function createIdentity(
  pool: pg.Pool,
  seedOnly = false,
): ReturnType<typeof betterAuth> {
  const options: BetterAuthOptions = {
    appName: "Noola synthetic Phase 0 experiment",
    baseURL: origin,
    secret: randomBytes(48).toString("hex"),
    trustedOrigins: [origin],
    database: drizzleAdapter(drizzle(pool, { schema }), {
      provider: "pg",
      schema,
      transaction: true,
    }),
    emailAndPassword: {
      enabled: true,
      disableSignUp: !seedOnly,
      requireEmailVerification: !seedOnly,
      revokeSessionsOnPasswordReset: true,
    },
    session: { cookieCache: { enabled: false } },
    rateLimit: {
      enabled: true,
      storage: "database",
      window: 60,
      max: 100,
      customRules: { "/sign-in/email": { window: 60, max: 20 } },
    },
    logger: { disabled: true },
    telemetry: { enabled: false },
  };
  return betterAuth(options);
}

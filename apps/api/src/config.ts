import { z } from "zod";

const postgres = z
  .url()
  .refine((value) =>
    ["postgres:", "postgresql:"].includes(new URL(value).protocol),
  );
const configSchema = z.object({
  DATABASE_URL: postgres,
  PORT: z.coerce.number().int().min(1).max(65535).default(3001),
  DB_POOL_SIZE: z.coerce.number().int().min(1).max(20).default(5),
  APP_ORIGIN: z
    .url()
    .refine(
      (value) =>
        new URL(value).origin === value &&
        (value.startsWith("https://") ||
          ["localhost", "127.0.0.1"].includes(new URL(value).hostname)),
    ),
  AUTH_SECRET: z.string().min(48),
  MAILPIT_URL: z.url(),
  EMAIL_FROM: z.email().default("accounts@noola.test"),
  EMAIL_INTERVAL_MS: z.coerce.number().int().min(100).max(60000).default(1000),
  INVITATION_HOURS: z.coerce.number().int().min(1).max(48).default(24),
});
export type Config = z.infer<typeof configSchema>;
export function readConfig(env: NodeJS.ProcessEnv): Config {
  const result = configSchema.safeParse(env);
  if (!result.success)
    throw new Error(
      `Invalid configuration: ${result.error.issues.map((issue) => issue.path.join(".")).join(", ")}`,
    );
  return result.data;
}

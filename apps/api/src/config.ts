import { z } from "zod";

const configSchema = z.object({
  DATABASE_URL: z
    .url()
    .refine((value) =>
      ["postgres:", "postgresql:"].includes(new URL(value).protocol),
    ),
  PORT: z.coerce.number().int().min(1).max(65535).default(3001),
  DB_POOL_SIZE: z.coerce.number().int().min(1).max(20).default(5),
});
export function readConfig(env: NodeJS.ProcessEnv) {
  const result = configSchema.safeParse(env);
  if (!result.success)
    throw new Error(
      `Invalid configuration: ${result.error.issues.map((issue) => issue.path.join(".")).join(", ")}`,
    );
  return result.data;
}

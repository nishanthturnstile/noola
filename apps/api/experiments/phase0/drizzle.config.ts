import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./experiments/phase0/schema.ts",
  out: "./experiments/phase0/migrations",
  strict: true,
});

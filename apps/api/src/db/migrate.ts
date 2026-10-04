import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const migrationsFolder = fileURLToPath(
  new URL("../../migrations", import.meta.url),
);
if (!existsSync(`${migrationsFolder}/meta/_journal.json`)) {
  console.info("No migrations pending; no domain schema has been introduced.");
} else {
  if (!process.env.MIGRATION_DATABASE_URL)
    throw new Error("MIGRATION_DATABASE_URL is required");
  const result = spawnSync("pnpm", ["exec", "drizzle-kit", "migrate"], {
    cwd: fileURLToPath(new URL("../..", import.meta.url)),
    stdio: "inherit",
  });
  if (result.status !== 0) process.exitCode = result.status ?? 1;
}

import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { resolve } from "node:path";
import { parseEnv } from "node:util";

const configRoot = process.env.XDG_CONFIG_HOME ?? resolve(homedir(), ".config");
const shared = process.env.ADMIN_DATABASE_URL
  ? {}
  : parseEnv(
      readFileSync(resolve(configRoot, "local-infra/postgres.env"), "utf8"),
    );
const app = process.env.ADMIN_DATABASE_URL
  ? {}
  : parseEnv(
      readFileSync(resolve(configRoot, "noola/development.env"), "utf8"),
    );
const admin = new URL(
  `postgresql://127.0.0.1:${shared.POSTGRES_PORT ?? 5432}/postgres`,
);
admin.username = "local_admin";
if (shared.POSTGRES_ADMIN_PASSWORD)
  admin.password = shared.POSTGRES_ADMIN_PASSWORD;
const child = spawn(
  "node",
  [
    "--conditions=development",
    "--import",
    "tsx",
    "apps/api/scripts/browser-harness.ts",
  ],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      ADMIN_DATABASE_URL: process.env.ADMIN_DATABASE_URL ?? admin.href,
      NOOLA_MIGRATION_PASSWORD:
        process.env.NOOLA_MIGRATION_PASSWORD ?? app.NOOLA_MIGRATION_PASSWORD,
      NOOLA_APP_PASSWORD:
        process.env.NOOLA_APP_PASSWORD ?? app.NOOLA_APP_PASSWORD,
      MAILPIT_URL: process.env.MAILPIT_URL ?? "http://127.0.0.1:8025",
    },
  },
);
for (const signal of ["SIGTERM", "SIGINT"])
  process.on(signal, () => child.kill(signal));
child.on("exit", (code) => {
  process.exitCode = code ?? 1;
});

import { spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, resolve } from "node:path";
import { parseEnv } from "node:util";

const configRoot = process.env.XDG_CONFIG_HOME ?? resolve(homedir(), ".config");
const sharedFile = resolve(configRoot, "local-infra/postgres.env");
const appFile = resolve(configRoot, "noola/development.env");
const command = process.argv[2];
function run(args, env = {}, capture = false) {
  const result = spawnSync("docker", args, {
    env: { ...process.env, ...env },
    stdio: capture ? "pipe" : "inherit",
    encoding: "utf8",
  });
  if (result.status !== 0)
    throw new Error(
      `Docker command failed (${args.slice(0, 3).join(" ")}); check Docker Desktop WSL integration and the output above.`,
    );
  return result.stdout?.trim();
}
function createEnv(path, content) {
  if (!existsSync(path)) {
    mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
    writeFileSync(path, content, { flag: "wx", mode: 0o600 });
  }
}
function url(user, password, host = "local-postgres", database = "noola") {
  if (!password)
    throw new Error(`Missing password for ${user}; run pnpm env:init`);
  const value = new URL(`postgresql://${host}:5432/${database}`);
  value.username = user;
  value.password = password;
  return value.href;
}
try {
  if (command === "env") {
    createEnv(
      sharedFile,
      `POSTGRES_ADMIN_PASSWORD=${randomBytes(32).toString("hex")}\nPOSTGRES_PORT=5432\nPOSTGRES_MEMORY_LIMIT=1g\n`,
    );
    createEnv(
      appFile,
      `NOOLA_MIGRATION_PASSWORD=${randomBytes(32).toString("hex")}\nNOOLA_APP_PASSWORD=${randomBytes(32).toString("hex")}\nWEB_PORT=5173\nDB_POOL_SIZE=5\n`,
    );
    console.info(
      `Local configuration ready: ${sharedFile} and ${appFile}. Existing values preserved.`,
    );
  } else {
    if (!existsSync(sharedFile) || !existsSync(appFile))
      throw new Error("Run pnpm env:init first");
    const shared = parseEnv(readFileSync(sharedFile, "utf8"));
    const app = parseEnv(readFileSync(appFile, "utf8"));
    const appEnv = {
      ...app,
      LOCAL_UID: String(process.getuid()),
      LOCAL_GID: String(process.getgid()),
      DATABASE_URL: url("noola_app", app.NOOLA_APP_PASSWORD),
    };
    const appCompose = ["compose", "-f", "compose.yaml"];
    const infraCompose = [
      "compose",
      "-f",
      "infra/shared-postgres/compose.yaml",
    ];
    const tool = (script, extra = {}) =>
      run(
        [
          ...appCompose,
          "run",
          "--rm",
          "--no-deps",
          ...Object.keys(extra).flatMap((key) => ["-e", key]),
          "tools",
          "pnpm",
          "--filter",
          "@noola/api",
          script,
        ],
        { ...appEnv, ...extra },
      );
    if (command === "infra-up") {
      for (const [kind, name] of [
        ["network", "local-databases"],
        ["volume", "local-postgres-data"],
      ]) {
        const found = run(
          [kind, "ls", "--filter", `name=^${name}$`, "--format", "{{.Name}}"],
          {},
          true,
        );
        if (found !== name) run([kind, "create", name]);
      }
      run([...infraCompose, "up", "-d", "--wait"], shared);
    } else if (command === "provision") {
      run([...appCompose, "run", "--build", "--rm", "dependencies"], appEnv);
      tool("db:provision", {
        ADMIN_DATABASE_URL: url(
          "local_admin",
          shared.POSTGRES_ADMIN_PASSWORD,
          "local-postgres",
          "postgres",
        ),
        NOOLA_MIGRATION_PASSWORD: app.NOOLA_MIGRATION_PASSWORD,
        NOOLA_APP_PASSWORD: app.NOOLA_APP_PASSWORD,
      });
    } else if (command === "up") {
      run(
        [
          ...infraCompose,
          "exec",
          "-T",
          "postgres",
          "pg_isready",
          "-U",
          "local_admin",
          "-d",
          "postgres",
        ],
        shared,
      );
      run(
        [...appCompose, "up", "--build", "-d", "--wait", "web", "api"],
        appEnv,
      );
      console.info(`Noola: http://localhost:${app.WEB_PORT ?? "5173"}`);
    } else if (command === "down") run([...appCompose, "down"], appEnv);
    else if (command === "logs")
      run([...appCompose, "logs", "--tail", "100", "-f", "web", "api"], appEnv);
    else if (command === "migrate")
      tool("db:migrate", {
        MIGRATION_DATABASE_URL: url(
          "noola_owner",
          app.NOOLA_MIGRATION_PASSWORD,
        ),
      });
    else if (command === "phase0")
      tool("phase0:runtime", {
        ADMIN_DATABASE_URL: url(
          "local_admin",
          shared.POSTGRES_ADMIN_PASSWORD,
          "local-postgres",
          "postgres",
        ),
      });
    else if (command === "integration")
      tool("test:integration", {
        ADMIN_DATABASE_URL: url(
          "local_admin",
          shared.POSTGRES_ADMIN_PASSWORD,
          "local-postgres",
          "postgres",
        ),
        NOOLA_MIGRATION_PASSWORD: app.NOOLA_MIGRATION_PASSWORD,
        NOOLA_APP_PASSWORD: app.NOOLA_APP_PASSWORD,
      });
    else throw new Error("Unknown local command");
  }
} catch (error) {
  console.error(
    error instanceof Error ? error.message : "Local command failed",
  );
  process.exitCode = 1;
}

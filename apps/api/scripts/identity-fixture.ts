import { randomBytes } from "node:crypto";
import { fileURLToPath } from "node:url";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";
import { readConfig } from "../src/config.js";
import { createApp } from "../src/http/app.js";
import { createIdentity } from "../src/modules/identity/index.js";
export async function createIdentityFixture(origin = "http://localhost:5173") {
  const { ADMIN_DATABASE_URL, NOOLA_MIGRATION_PASSWORD, NOOLA_APP_PASSWORD } =
    process.env;
  if (!ADMIN_DATABASE_URL || !NOOLA_MIGRATION_PASSWORD || !NOOLA_APP_PASSWORD)
    throw new Error("Disposable identity test configuration is missing");
  const admin = new pg.Client({ connectionString: ADMIN_DATABASE_URL });
  await admin.connect();
  const name = `noola_identity_${randomBytes(8).toString("hex")}`;
  await admin.query(`CREATE DATABASE ${name} OWNER noola_owner`);
  const url = (role: string, password: string) => {
    const value = new URL(ADMIN_DATABASE_URL);
    value.pathname = `/${name}`;
    value.username = role;
    value.password = password;
    return value.href;
  };
  const owner = new pg.Pool({
    connectionString: url("noola_owner", NOOLA_MIGRATION_PASSWORD),
  });
  const pool = new pg.Pool({
    connectionString: url("noola_app", NOOLA_APP_PASSWORD),
  });
  owner.on("error", () =>
    console.error("Synthetic migration connection closed"),
  );
  pool.on("error", () => console.error("Synthetic runtime connection closed"));
  try {
    await owner.query(
      `REVOKE ALL ON SCHEMA public FROM PUBLIC; GRANT USAGE ON SCHEMA public TO noola_app; ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT,INSERT,UPDATE,DELETE ON TABLES TO noola_app;`,
    );
    const migrationsFolder = fileURLToPath(
      new URL("../migrations", import.meta.url),
    );
    await migrate(drizzle(owner), { migrationsFolder });
    await migrate(drizzle(owner), { migrationsFolder });
    const config = readConfig({
      ...process.env,
      DATABASE_URL: url("noola_app", NOOLA_APP_PASSWORD),
      APP_ORIGIN: origin,
      AUTH_SECRET: randomBytes(48).toString("hex"),
      MAILPIT_URL: process.env.MAILPIT_URL ?? "http://127.0.0.1:8025",
    });
    let now: Date | undefined;
    const clock = () => now ?? new Date();
    const identity = createIdentity(pool, config, clock);
    const app = createApp(async () => {
      await pool.query("SELECT 1");
    }, identity);
    return {
      admin,
      owner,
      pool,
      config,
      identity,
      app,
      clock,
      setTime: (value: Date) => {
        now = value;
      },
      async close() {
        await pool.end();
        await owner.end();
        await admin.query(`DROP DATABASE ${name} WITH (FORCE)`);
        await admin.end();
      },
    };
  } catch (error) {
    await pool.end();
    await owner.end();
    await admin.query(`DROP DATABASE ${name} WITH (FORCE)`);
    await admin.end();
    throw error;
  }
}

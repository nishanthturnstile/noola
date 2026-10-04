import { randomBytes } from "node:crypto";
import { fileURLToPath } from "node:url";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";

// Names/passwords are generated here, never accepted as SQL fragments from a caller.
export async function withDatabase(run: (pool: pg.Pool) => Promise<void>) {
  const connectionString = process.env.ADMIN_DATABASE_URL;
  if (!connectionString)
    throw new Error(
      "ADMIN_DATABASE_URL is required for disposable Phase 0 fixtures",
    );
  const name = `noola_phase0_${randomBytes(10).toString("hex")}`;
  const password = randomBytes(32).toString("hex");
  const admin = new pg.Client({ connectionString });
  await admin.connect();
  let roleCreated = false;
  let databaseCreated = false;
  let owner: pg.Client | undefined;
  let pool: pg.Pool | undefined;
  try {
    await admin.query(
      `CREATE ROLE ${name} LOGIN PASSWORD '${password}' NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOBYPASSRLS`,
    );
    roleCreated = true;
    await admin.query(`CREATE DATABASE ${name}`);
    databaseCreated = true;
    const ownerUrl = new URL(connectionString);
    ownerUrl.pathname = `/${name}`;
    owner = new pg.Client({ connectionString: ownerUrl.href });
    await owner.connect();
    await owner.query(
      `REVOKE ALL ON DATABASE ${name} FROM PUBLIC; GRANT CONNECT ON DATABASE ${name} TO ${name}; REVOKE ALL ON SCHEMA public FROM PUBLIC; GRANT USAGE ON SCHEMA public TO ${name}`,
    );
    const migrationsFolder = fileURLToPath(
      new URL("./migrations", import.meta.url),
    );
    await migrate(drizzle(owner), { migrationsFolder });
    await migrate(drizzle(owner), { migrationsFolder });
    await owner.query(
      `GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ${name}`,
    );
    const appUrl = new URL(ownerUrl);
    appUrl.username = name;
    appUrl.password = password;
    pool = new pg.Pool({
      connectionString: appUrl.href,
      max: 5,
      connectionTimeoutMillis: 3000,
      statement_timeout: 5000,
    });
    await run(pool);
  } finally {
    await pool?.end();
    await owner?.end();
    try {
      if (databaseCreated) await admin.query(`DROP DATABASE ${name}`);
    } finally {
      try {
        if (roleCreated) await admin.query(`DROP ROLE ${name}`);
      } finally {
        await admin.end();
      }
    }
  }
}

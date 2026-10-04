import { pathToFileURL } from "node:url";
import pg from "pg";

const identifier = (value: string) => `"${value.replaceAll('"', '""')}"`;
const literal = (value: string) => `'${value.replaceAll("'", "''")}'`;
export async function provision(
  adminUrl: string,
  ownerPassword: string,
  appPassword: string,
) {
  if (!ownerPassword || !appPassword)
    throw new Error("Both Noola role passwords are required");
  const admin = new pg.Client({
    connectionString: adminUrl,
    connectionTimeoutMillis: 5000,
  });
  await admin.connect();
  try {
    await admin.query("SELECT pg_advisory_lock(721833, 1)");
    const existing = await admin.query<{ owner: string }>(
      "SELECT pg_get_userbyid(datdba) AS owner FROM pg_database WHERE datname = 'noola'",
    );
    if (existing.rows[0] && existing.rows[0].owner !== "noola_owner")
      throw new Error(
        "Existing noola database has incompatible ownership; nothing was recreated",
      );
    for (const [role, password] of [
      ["noola_owner", ownerPassword],
      ["noola_app", appPassword],
    ] as const) {
      const found = await admin.query<{ unsafe: boolean }>(
        "SELECT rolsuper OR rolcreatedb OR rolcreaterole OR rolreplication OR rolbypassrls OR NOT rolcanlogin OR EXISTS (SELECT 1 FROM pg_auth_members WHERE member = oid) AS unsafe FROM pg_roles WHERE rolname = $1",
        [role],
      );
      if (found.rows[0]?.unsafe)
        throw new Error(`Existing ${role} has incompatible privileges`);
      if (found.rows[0]) {
        const checkUrl = new URL(adminUrl);
        checkUrl.username = role;
        checkUrl.password = password;
        checkUrl.pathname = existing.rowCount ? "/noola" : "/postgres";
        const client = new pg.Client({
          connectionString: checkUrl.href,
          connectionTimeoutMillis: 5000,
        });
        try {
          await client.connect();
        } catch {
          throw new Error(
            `Existing ${role} credentials do not match; password was not reset`,
          );
        } finally {
          await client.end();
        }
      }
    }
    for (const [role, password] of [
      ["noola_owner", ownerPassword],
      ["noola_app", appPassword],
    ] as const) {
      const found = await admin.query(
        "SELECT 1 FROM pg_roles WHERE rolname = $1",
        [role],
      );
      if (!found.rowCount)
        await admin.query(
          `CREATE ROLE ${identifier(role)} LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS PASSWORD ${literal(password)}`,
        );
    }
    if (!existing.rowCount)
      await admin.query('CREATE DATABASE "noola" OWNER "noola_owner"');
    const dbUrl = new URL(adminUrl);
    dbUrl.pathname = "/noola";
    const database = new pg.Client({ connectionString: dbUrl.href });
    await database.connect();
    try {
      await database.query(`BEGIN;
    REVOKE ALL ON DATABASE noola FROM PUBLIC;
    GRANT CONNECT ON DATABASE noola TO noola_owner, noola_app;
    REVOKE ALL ON SCHEMA public FROM PUBLIC;
    GRANT USAGE ON SCHEMA public TO noola_app;
    ALTER DEFAULT PRIVILEGES FOR ROLE noola_owner IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO noola_app;
    ALTER DEFAULT PRIVILEGES FOR ROLE noola_owner IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO noola_app;
    GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO noola_app;
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO noola_app;
    COMMIT;`);
    } finally {
      await database.end();
    }
  } finally {
    await admin.end();
  }
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const { ADMIN_DATABASE_URL, NOOLA_MIGRATION_PASSWORD, NOOLA_APP_PASSWORD } =
    process.env;
  if (!ADMIN_DATABASE_URL || !NOOLA_MIGRATION_PASSWORD || !NOOLA_APP_PASSWORD)
    throw new Error("Provisioning configuration is missing");
  try {
    await provision(
      ADMIN_DATABASE_URL,
      NOOLA_MIGRATION_PASSWORD,
      NOOLA_APP_PASSWORD,
    );
    console.info(
      "Noola database and roles are ready; existing credentials preserved.",
    );
  } catch (error) {
    console.error(
      error instanceof Error && !("code" in error)
        ? error.message
        : "Database provisioning failed; inspect database ownership and connectivity.",
    );
    process.exitCode = 1;
  }
}

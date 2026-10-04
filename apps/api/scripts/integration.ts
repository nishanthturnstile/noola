import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import pg from "pg";
import { createDatabase } from "../src/db/pool.js";
import { createApp } from "../src/http/app.js";
import { provision } from "./provision.js";

const { ADMIN_DATABASE_URL, NOOLA_MIGRATION_PASSWORD, NOOLA_APP_PASSWORD } =
  process.env;
if (!ADMIN_DATABASE_URL || !NOOLA_MIGRATION_PASSWORD || !NOOLA_APP_PASSWORD)
  throw new Error("Integration configuration is missing");
const adminConnectionString = ADMIN_DATABASE_URL;
const suffix = randomBytes(6).toString("hex");
const other = `noola_test_other_${suffix}`;
const table = `bootstrap_probe_${suffix}`;
function url(user: string, password: string, database: string) {
  const value = new URL(adminConnectionString);
  value.username = user;
  value.password = password;
  value.pathname = `/${database}`;
  return value.href;
}
const admin = new pg.Client({ connectionString: ADMIN_DATABASE_URL });
await admin.connect();
const opened: pg.Client[] = [];
async function connect(connectionString: string) {
  const client = new pg.Client({ connectionString });
  await client.connect();
  opened.push(client);
  return client;
}
let otherCreated = false;
let tableCreated = false;
let owner: pg.Client | undefined;
try {
  await provision(
    ADMIN_DATABASE_URL,
    NOOLA_MIGRATION_PASSWORD,
    NOOLA_APP_PASSWORD,
  );
  const before = await admin.query<{ rolpassword: string }>(
    "SELECT rolpassword FROM pg_authid WHERE rolname IN ('noola_owner','noola_app') ORDER BY rolname",
  );
  owner = await connect(url("noola_owner", NOOLA_MIGRATION_PASSWORD, "noola"));
  await owner.query(`CREATE TABLE ${table} (value text NOT NULL)`);
  tableCreated = true;
  const app = await connect(url("noola_app", NOOLA_APP_PASSWORD, "noola"));
  await app.query(`INSERT INTO ${table} VALUES ('preserved')`);
  await provision(
    ADMIN_DATABASE_URL,
    NOOLA_MIGRATION_PASSWORD,
    NOOLA_APP_PASSWORD,
  );
  assert.equal(
    (await app.query<{ value: string }>(`SELECT value FROM ${table}`)).rows[0]
      ?.value,
    "preserved",
  );
  const after = await admin.query<{ rolpassword: string }>(
    "SELECT rolpassword FROM pg_authid WHERE rolname IN ('noola_owner','noola_app') ORDER BY rolname",
  );
  assert.ok(
    JSON.stringify(before.rows) === JSON.stringify(after.rows),
    "Provisioning must preserve password hashes",
  );
  await assert.rejects(
    provision(
      ADMIN_DATABASE_URL,
      NOOLA_MIGRATION_PASSWORD,
      "incorrect-password",
    ),
    /password was not reset/,
  );
  await assert.rejects(
    app.query(`CREATE TABLE forbidden_${suffix} (id int)`),
    /permission denied/,
  );
  await assert.rejects(
    app.query(`CREATE DATABASE forbidden_${suffix}`),
    /permission denied/,
  );
  await admin.query(`CREATE DATABASE ${other}`);
  otherCreated = true;
  const adminOtherUrl = new URL(adminConnectionString);
  adminOtherUrl.pathname = `/${other}`;
  const otherAdmin = await connect(adminOtherUrl.href);
  await otherAdmin.query(
    "CREATE TABLE sentinel (value text); INSERT INTO sentinel VALUES ('untouched')",
  );
  const otherApp = await connect(url("noola_app", NOOLA_APP_PASSWORD, other));
  await assert.rejects(
    otherApp.query("UPDATE sentinel SET value = 'changed'"),
    /permission denied/,
  );
  await assert.rejects(
    otherApp.query("CREATE TABLE forbidden (id int)"),
    /permission denied/,
  );
  assert.equal(
    (await otherAdmin.query<{ value: string }>("SELECT value FROM sentinel"))
      .rows[0]?.value,
    "untouched",
  );
  const database = createDatabase(
    url("noola_app", NOOLA_APP_PASSWORD, "noola"),
  );
  try {
    assert.equal(
      (await createApp(database.check).request("/api/health/ready")).status,
      200,
    );
  } finally {
    await database.pool.end();
  }
  const unavailable = createDatabase(
    "postgresql://unused:unused@127.0.0.1:1/unavailable",
  );
  try {
    assert.equal(
      (await createApp(unavailable.check).request("/api/health/ready")).status,
      503,
    );
  } finally {
    await unavailable.pool.end();
  }
  console.info(
    "PASS: repeatable provisioning, preserved credentials/data, privilege isolation, and real database health.",
  );
} finally {
  if (tableCreated) await owner?.query(`DROP TABLE ${table}`);
  for (const client of opened) await client.end();
  if (otherCreated) await admin.query(`DROP DATABASE ${other}`);
  await admin.end();
}

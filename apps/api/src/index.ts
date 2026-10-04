import { serve } from "@hono/node-server";
import { mailpitTransport } from "./adapters/email/mailpit.js";
import { readConfig } from "./config.js";
import { createDatabase } from "./db/pool.js";
import { createApp } from "./http/app.js";
import { createEmailWorker } from "./jobs/account-email.js";
import { cleanupIdentity } from "./jobs/identity-cleanup.js";
import { createIdentity } from "./modules/identity/index.js";

const config = readConfig(process.env);
const database = createDatabase(config.DATABASE_URL, config.DB_POOL_SIZE);
const server = serve({
  fetch: createApp(database.check, createIdentity(database.pool, config)).fetch,
  port: config.PORT,
  hostname: "0.0.0.0",
});
console.info(`Noola API listening on port ${config.PORT}`);
const emailWorker = createEmailWorker(
  database.pool,
  config,
  mailpitTransport(config),
);
const emailTimer = setInterval(
  () =>
    void emailWorker
      .tick()
      .catch(() => console.error("Account email processing failed")),
  config.EMAIL_INTERVAL_MS,
).unref();
const cleanupTimer = setInterval(
  () =>
    void cleanupIdentity(database.pool, new Date()).catch(() =>
      console.error("Identity expiry cleanup failed"),
    ),
  60000,
).unref();
let stopping = false;
function shutdown() {
  if (stopping) return;
  stopping = true;
  clearInterval(emailTimer);
  clearInterval(cleanupTimer);
  const deadline = setTimeout(() => process.exit(1), 10000).unref();
  server.close(async () => {
    await database.pool.end();
    clearTimeout(deadline);
  });
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

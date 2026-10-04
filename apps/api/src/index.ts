import { serve } from "@hono/node-server";
import { readConfig } from "./config.js";
import { createDatabase } from "./db/pool.js";
import { createApp } from "./http/app.js";

const config = readConfig(process.env);
const database = createDatabase(config.DATABASE_URL, config.DB_POOL_SIZE);
const server = serve({
  fetch: createApp(database.check).fetch,
  port: config.PORT,
  hostname: "0.0.0.0",
});
console.info(`Noola API listening on port ${config.PORT}`);
let stopping = false;
function shutdown() {
  if (stopping) return;
  stopping = true;
  const deadline = setTimeout(() => process.exit(1), 10000).unref();
  server.close(async () => {
    await database.pool.end();
    clearTimeout(deadline);
  });
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

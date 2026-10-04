import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { serve } from "@hono/node-server";
import { mailpitTransport } from "../src/adapters/email/mailpit.js";
import { createEmailWorker } from "../src/jobs/account-email.js";
import { bootstrap } from "../src/modules/identity/enrollment.js";
import { createIdentityFixture } from "./identity-fixture.js";

const port = Number(process.env.BROWSER_PORT ?? 5180);
const apiPort = port + 1000;
const email = process.env.BROWSER_OWNER_EMAIL ?? "owner@browser.test";
console.info("BROWSER_FIXTURE_START");
const fixture = await createIdentityFixture(`http://localhost:${port}`);
console.info("BROWSER_FIXTURE_READY");
await bootstrap(fixture.pool, fixture.config, email, fixture.clock());
console.info("BROWSER_BOOTSTRAP_READY");
const api = serve({
  fetch: fixture.app.fetch,
  port: apiPort,
  hostname: "127.0.0.1",
});
const worker = createEmailWorker(
  fixture.pool,
  fixture.config,
  mailpitTransport(fixture.config),
);
const timer = setInterval(
  () =>
    void worker
      .tick()
      .catch(() => console.error("Synthetic account email processing failed")),
  200,
).unref();
const web = spawn(
  "node",
  [
    fileURLToPath(
      new URL("../../web/node_modules/vite/bin/vite.js", import.meta.url),
    ),
    "--host",
    "0.0.0.0",
    "--port",
    String(port),
  ],
  {
    cwd: fileURLToPath(new URL("../../web", import.meta.url)),
    stdio: ["ignore", "ignore", "inherit"],
    env: { ...process.env, API_PROXY_TARGET: `http://127.0.0.1:${apiPort}` },
    detached: true,
  },
);
web.on("exit", (code) => console.error(`Synthetic web server exited ${code}`));
let closing = false;
async function close() {
  if (closing) return;
  closing = true;
  clearInterval(timer);
  if (web.pid) process.kill(-web.pid, "SIGTERM");
  await new Promise<void>((resolve) => api.close(() => resolve()));
  await fixture.close();
  process.exit(0);
}
process.on("SIGTERM", () => void close());
process.on("SIGINT", () => void close());
for (let attempts = 0; attempts < 100; attempts++) {
  try {
    if ((await fetch(`http://localhost:${port}/api/health/ready`)).ok) {
      console.info("IDENTITY_BROWSER_READY");
      break;
    }
  } catch {}
  await new Promise((resolve) => setTimeout(resolve, 100));
}

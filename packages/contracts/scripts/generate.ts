import { writeFile } from "node:fs/promises";
import { OpenAPIHono } from "@hono/zod-openapi";
import { identityRoutes, liveRoute, readyRoute } from "../src/routes.js";

const app = new OpenAPIHono();
app.openAPIRegistry.registerPath(liveRoute);
app.openAPIRegistry.registerPath(readyRoute);
for (const route of identityRoutes) app.openAPIRegistry.registerPath(route);
await writeFile(
  new URL("../openapi.json", import.meta.url),
  `${JSON.stringify(app.getOpenAPIDocument({ openapi: "3.1.0", info: { title: "Noola API", version: "0.0.0" } }), null, 2)}\n`,
);

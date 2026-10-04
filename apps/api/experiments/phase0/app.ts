import { randomUUID } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Hono } from "hono";
import type pg from "pg";
import { z } from "zod";
import { createIdentity, origin } from "./identity.js";
import type { createJournal } from "./recovery.js";
import { record } from "./schema.js";

// Intentionally not imported by src/index.ts. No public listener, production route or AI adapter.
export function createExperiment(
  pool: pg.Pool,
  journal: ReturnType<typeof createJournal>,
) {
  const auth = createIdentity(pool);
  const db = drizzle(pool);
  const app = new Hono<{ Variables: { actor: string } }>();
  const input = z.strictObject({ text: z.string().trim().min(1).max(2000) });
  const projection = { id: record.id, text: record.text };
  const owned = (actor: string, id: string) =>
    and(eq(record.id, id), eq(record.ownerId, actor));
  app.use("*", async (c, next) => {
    c.header("Cache-Control", "no-store");
    await next();
  });
  app.onError(
    () =>
      new Response('{"error":"unavailable"}', {
        status: 503,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      }),
  );
  app.on(["GET", "POST"], "/api/auth/*", (c) => auth.handler(c.req.raw));
  app.use("/records/*", async (c, next) => {
    const identity = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!identity) return c.json({ error: "unauthenticated" }, 401);
    if (
      !["GET", "HEAD"].includes(c.req.method) &&
      c.req.header("Origin") !== origin
    )
      return c.json({ error: "forbidden" }, 403);
    c.set("actor", identity.user.id);
    await next();
  });
  app.get("/records/", async (c) => {
    const query = c.req.query("q") ?? "";
    if (query.length > 200) return c.json({ error: "invalid-input" }, 400);
    const rows = await db
      .select(projection)
      .from(record)
      .where(
        and(
          eq(record.ownerId, c.get("actor")),
          sql`strpos(${record.text}, ${query}) > 0`,
        ),
      );
    return c.json({
      items: rows.map((row) => ({
        ...row,
        source: { id: row.id, quote: row.text },
      })),
    });
  });
  app.get("/records/export", async (c) =>
    c.json({
      items: await db
        .select(projection)
        .from(record)
        .where(eq(record.ownerId, c.get("actor"))),
    }),
  );
  app.post("/records/", async (c) => {
    const body = input.safeParse(await c.req.json().catch(() => undefined));
    if (!body.success) return c.json({ error: "invalid-input" }, 400);
    const [row] = await db
      .insert(record)
      .values({
        id: randomUUID(),
        ownerId: c.get("actor"),
        text: body.data.text,
      })
      .returning(projection);
    return c.json(row, 201);
  });
  app.get("/records/:id", async (c) => {
    const [row] = await db
      .select(projection)
      .from(record)
      .where(owned(c.get("actor"), c.req.param("id")));
    return row ? c.json(row) : c.json({ error: "not-found" }, 404);
  });
  app.patch("/records/:id", async (c) => {
    const body = input.safeParse(await c.req.json().catch(() => undefined));
    if (!body.success) return c.json({ error: "invalid-input" }, 400);
    const [row] = await db
      .update(record)
      .set(body.data)
      .where(owned(c.get("actor"), c.req.param("id")))
      .returning(projection);
    return row ? c.json(row) : c.json({ error: "not-found" }, 404);
  });
  app.delete("/records/:id", async (c) => {
    const filter = owned(c.get("actor"), c.req.param("id"));
    const [row] = await db.select(projection).from(record).where(filter);
    if (!row) return c.json({ error: "not-found" }, 404);
    await journal.append(row.id);
    await db.delete(record).where(filter);
    return c.body(null, 204);
  });
  return app;
}

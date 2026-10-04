import assert from "node:assert/strict";
import { randomBytes, randomUUID } from "node:crypto";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { z } from "zod";
import { createExperiment } from "./app.js";
import { withDatabase } from "./database.js";
import { createIdentity, origin } from "./identity.js";
import { createJournal } from "./recovery.js";
import { record } from "./schema.js";

const recordSchema = z.strictObject({ id: z.string(), text: z.string() });
const searchSchema = z.strictObject({
  items: z.array(
    recordSchema.extend({
      source: z.strictObject({ id: z.string(), quote: z.string() }),
    }),
  ),
});
const exportSchema = z.strictObject({ items: z.array(recordSchema) });
const root = await mkdtemp(join(tmpdir(), "noola-phase0-"));
const journalPath = join(root, "restrictions.jsonl");
await writeFile(journalPath, "", { mode: 0o600 });
let fetchCalls = 0;
const originalFetch = globalThis.fetch;
globalThis.fetch = async () => {
  fetchCalls++;
  throw new Error("External fetch prohibited in synthetic proof");
};
try {
  await withDatabase(async (pool) => {
    await assert.rejects(
      pool.query("CREATE TABLE forbidden (id int)"),
      /permission denied/,
    );
    const journal = createJournal(journalPath);
    const app = createExperiment(pool, journal);
    const seed = createIdentity(pool, true);
    const password = randomBytes(24).toString("hex");
    const request = (
      path: string,
      cookie = "",
      method = "GET",
      body?: unknown,
      headers: Record<string, string> = {},
    ) =>
      app.request(
        new Request(`${origin}${path}`, {
          method,
          headers: {
            Cookie: cookie,
            Origin: origin,
            "Content-Type": "application/json",
            "X-Forwarded-For": "192.0.2.10",
            ...headers,
          },
          ...(body === undefined ? {} : { body: JSON.stringify(body) }),
        }),
      );
    const userIds: string[] = [];
    for (const name of ["adult-a", "adult-b", "unverified"]) {
      const response = await seed.handler(
        new Request(`${origin}/api/auth/sign-up/email`, {
          method: "POST",
          headers: {
            Origin: origin,
            "Content-Type": "application/json",
            "X-Forwarded-For": "192.0.2.20",
          },
          body: JSON.stringify({
            name,
            email: `${name}@example.invalid`,
            password,
          }),
        }),
      );
      assert.equal(response.status, 200, "Synthetic seed creation");
      const body = z
        .object({ user: z.object({ id: z.string() }) })
        .parse(await response.json());
      userIds.push(body.user.id);
      if (name !== "unverified")
        await pool.query(
          'UPDATE "user" SET "emailVerified" = true WHERE id = $1',
          [body.user.id],
        );
    }
    const [adultA, adultB] = userIds;
    assert.ok(adultA && adultB);
    const signin = async (name: string) => {
      const response = await request("/api/auth/sign-in/email", "", "POST", {
        email: `${name}@example.invalid`,
        password,
      });
      assert.equal(response.status, 200, "Verified synthetic account signs in");
      const cookies = response.headers.getSetCookie();
      assert.ok(
        cookies.some(
          (cookie) =>
            cookie.includes("session_token=") && cookie.includes("HttpOnly"),
        ),
      );
      assert.ok(
        !cookies.some((cookie) => cookie.includes("session_data=")),
        "No session cookie cache",
      );
      return cookies.map((cookie) => cookie.split(";")[0]).join("; ");
    };
    const cookieA = await signin("adult-a");
    const cookieB = await signin("adult-b");
    assert.equal(
      (
        await request("/api/auth/sign-up/email", "", "POST", {
          name: "stranger",
          email: "stranger@example.invalid",
          password,
        })
      ).status,
      400,
    );
    assert.equal(
      (
        await request("/api/auth/sign-in/email", "", "POST", {
          email: "unverified@example.invalid",
          password,
        })
      ).status,
      403,
    );
    assert.equal(
      (
        await request("/api/auth/sign-in/email", "", "POST", {
          email: "adult-a@example.invalid",
          password: "incorrect-synthetic-password",
        })
      ).status,
      401,
    );
    assert.equal((await request("/records/")).status, 401);
    assert.equal(
      (await request("/records/", "better-auth.session_token=forged")).status,
      401,
    );
    console.info(
      "PASS: maintained password sign-in, verified-only access, closed signup, HTTP-only opaque sessions, anonymous/forged denial.",
    );

    const malformed = await app.request(
      new Request(`${origin}/records/`, {
        method: "POST",
        headers: {
          Cookie: cookieA,
          Origin: origin,
          "Content-Type": "application/json",
        },
        body: "{broken",
      }),
    );
    assert.equal(malformed.status, 400);
    const create = async (cookie: string, text: string) => {
      const response = await request("/records/", cookie, "POST", { text });
      assert.equal(response.status, 201);
      return recordSchema.parse(await response.json());
    };
    const a = await create(
      cookieA,
      "Synthetic A confidential marker ALPHA-732",
    );
    const b = await create(
      cookieB,
      "Synthetic B confidential marker BRAVO-946",
    );

    await assert.rejects(
      drizzle(pool).transaction(async (tx) => {
        await tx
          .update(record)
          .set({ text: "must roll back" })
          .where(eq(record.id, a.id));
        throw new Error("synthetic transaction interruption");
      }),
      /synthetic transaction interruption/,
    );
    assert.deepEqual(
      await (await request(`/records/${a.id}`, cookieA)).json(),
      a,
    );
    console.info(
      "PASS: stable Drizzle fresh/repeated migration, restricted runtime role and transaction rollback.",
    );
    assert.equal(
      (
        await request("/records/", cookieA, "POST", {
          text: "forged owner",
          ownerId: adultB,
        })
      ).status,
      400,
    );
    assert.equal(
      (
        await request(
          "/records/",
          cookieA,
          "POST",
          { text: "cross origin" },
          { Origin: "https://hostile.invalid" },
        )
      ).status,
      403,
    );
    assert.equal(
      (
        await request(
          "/records/",
          cookieA,
          "POST",
          { text: "missing origin" },
          { Origin: "" },
        )
      ).status,
      403,
    );
    for (const [cookie, own, other] of [
      [cookieA, a, b],
      [cookieB, b, a],
    ] as const) {
      assert.deepEqual(
        await (await request(`/records/${own.id}`, cookie)).json(),
        own,
      );
      for (const method of ["GET", "PATCH", "DELETE"]) {
        const body =
          method === "PATCH" ? { text: "attempted overwrite" } : undefined;
        const denied = await request(
          `/records/${other.id}`,
          cookie,
          method,
          body,
          { "X-User-Id": other.id, "X-Household-Role": "coordinator" },
        );
        const absent = await request(
          `/records/${randomUUID()}`,
          cookie,
          method,
          body,
        );
        assert.equal(denied.status, 404);
        assert.equal(denied.status, absent.status);
        assert.equal(
          await denied.text(),
          await absent.text(),
          "No existence distinction in status/body",
        );
        assert.equal(denied.headers.get("Cache-Control"), "no-store");
      }
      const list = searchSchema.parse(
        await (await request("/records/", cookie)).json(),
      );
      assert.deepEqual(
        list.items.map((item) => item.id),
        [own.id],
      );
      const exported = exportSchema.parse(
        await (await request("/records/export", cookie)).json(),
      );
      assert.deepEqual(exported.items, [own]);
      const search = searchSchema.parse(
        await (
          await request(`/records/?q=${encodeURIComponent(other.text)}`, cookie)
        ).json(),
      );
      assert.deepEqual(search.items, []);
    }
    assert.equal(
      (
        await pool.query<{ text: string }>(
          "SELECT text FROM record WHERE id=$1",
          [b.id],
        )
      ).rows[0]?.text,
      b.text,
    );
    console.info(
      "PASS: bidirectional private read/list/search/export/update/delete isolation; uniform absent responses; owner spoofing and cross-origin mutations denied.",
    );

    for (const [text, query] of [
      ["Synthetic English: library closes at six", "library"],
      ["செயற்கை: நூலகம் ஆறு மணிக்கு மூடும்", "நூலகம்"],
      ["Synthetic transliteration: noolagam aaru manikku moodum", "noolagam"],
      ["Synthetic mixed: library ஆறு மணிக்கு closes", "ஆறு மணிக்கு closes"],
    ]) {
      assert.ok(text && query);
      const saved = await create(cookieA, text);
      const response = await request(
        `/records/?q=${encodeURIComponent(query)}`,
        cookieA,
      );
      const result = searchSchema.parse(await response.json());
      const evidence = result.items.find((item) => item.id === saved.id);
      assert.deepEqual(evidence?.source, { id: saved.id, quote: text });
      const other = searchSchema.parse(
        await (
          await request(`/records/?q=${encodeURIComponent(query)}`, cookieB)
        ).json(),
      );
      assert.deepEqual(other.items, []);
    }
    assert.deepEqual(
      searchSchema.parse(
        await (await request("/records/?q=%27%20OR%201%3D1--", cookieA)).json(),
      ).items,
      [],
    );
    assert.equal(
      (
        await request(`/records/${a.id}`, cookieA, "PATCH", {
          text: "Synthetic A corrected",
        })
      ).status,
      200,
    );
    assert.equal(
      recordSchema.parse(
        await (await request(`/records/${a.id}`, cookieA)).json(),
      ).text,
      "Synthetic A corrected",
    );
    console.info(
      "PASS: manual save/correct and source-linked exact substring recall in English, Tamil, transliteration and mixed text; SQL input stays data.",
    );

    const snapshot = (
      await pool.query<{ id: string; ownerId: string; text: string }>(
        'SELECT id, "ownerId", text FROM record',
      )
    ).rows;
    assert.equal(
      (await request(`/records/${a.id}`, cookieA, "DELETE")).status,
      204,
    );
    assert.equal((await request(`/records/${a.id}`, cookieA)).status, 404);
    const unavailable = createJournal(join(root, "unavailable", "journal"));
    await assert.rejects(unavailable.restore(pool, snapshot), /ENOENT/);
    assert.equal((await request(`/records/${a.id}`, cookieA)).status, 404);
    const journalText = await readFile(journalPath, "utf8");
    await writeFile(journalPath, "malformed\n", { mode: 0o600 });
    await assert.rejects(journal.restore(pool, snapshot));
    await writeFile(journalPath, journalText, { mode: 0o600 });
    await journal.restore(pool, snapshot);
    assert.equal((await request(`/records/${a.id}`, cookieA)).status, 404);
    assert.deepEqual(
      await (await request(`/records/${b.id}`, cookieB)).json(),
      b,
    );
    const brokenApp = createExperiment(pool, unavailable);
    // Fresh auth instance has a different secret, so sign in to it before testing journal failure.
    const brokenSignin = await brokenApp.request(
      new Request(`${origin}/api/auth/sign-in/email`, {
        method: "POST",
        headers: {
          Origin: origin,
          "Content-Type": "application/json",
          "X-Forwarded-For": "192.0.2.30",
        },
        body: JSON.stringify({ email: "adult-b@example.invalid", password }),
      }),
    );
    assert.equal(brokenSignin.status, 200);
    const brokenCookie = brokenSignin.headers
      .getSetCookie()
      .map((cookie) => cookie.split(";")[0])
      .join("; ");
    const deniedForget = await brokenApp.request(
      new Request(`${origin}/records/${b.id}`, {
        method: "DELETE",
        headers: { Cookie: brokenCookie, Origin: origin },
      }),
    );
    assert.equal(
      deniedForget.status,
      503,
      "Cannot acknowledge forget without journal",
    );
    assert.deepEqual(
      await (await request(`/records/${b.id}`, cookieB)).json(),
      b,
    );
    console.info(
      "PASS: local snapshot replay excludes tombstoned records; missing/corrupt journal fails closed; journal failure prevents success acknowledgment.",
    );

    await pool.query('DELETE FROM session WHERE "userId" = $1', [adultA]);
    assert.equal((await request("/records/", cookieA)).status, 401);
    assert.equal((await request("/records/", cookieB)).status, 200);
    await pool.query(
      'UPDATE session SET "expiresAt" = now() - interval \'1 hour\' WHERE "userId" = $1',
      [adultB],
    );
    assert.equal((await request("/records/", cookieB)).status, 401);
    let throttled = false;
    for (let attempt = 0; attempt < 22; attempt++) {
      const response = await request(
        "/api/auth/sign-in/email",
        "",
        "POST",
        {
          email: "adult-a@example.invalid",
          password: "incorrect-synthetic-password",
        },
        { "X-Forwarded-For": "192.0.2.99" },
      );
      assert.ok([401, 429].includes(response.status));
      if (response.status === 429) {
        throttled = true;
        break;
      }
    }
    assert.ok(throttled, "HTTP password endpoint is rate limited");
    assert.ok(
      (await pool.query('SELECT id FROM "rateLimit"')).rowCount,
      "Rate limits persist in PostgreSQL",
    );
    console.info(
      "PASS: password endpoint throttles repeated failures using database-backed limits.",
    );
    assert.equal(fetchCalls, 0);
    console.info(
      "PASS: next-request revocation, independent sessions, expiry, and zero external fetches across manual paths.",
    );
  });
  console.info(
    "PASS: disposable database and login cleaned up. Runtime experiment only; run phase0:typecheck separately. Phase 0 gates remain pending.",
  );
} finally {
  globalThis.fetch = originalFetch;
  await rm(root, { recursive: true, force: true });
}

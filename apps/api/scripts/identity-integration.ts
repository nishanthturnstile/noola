import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { signJWT } from "better-auth/crypto";
import { z } from "zod";
import { enqueueEmail, unseal } from "../src/adapters/email/ledger.js";
import { createEmailWorker } from "../src/jobs/account-email.js";
import { createAuthentication } from "../src/modules/identity/authentication.js";
import {
  bootstrap,
  resendOwnerInvitation,
} from "../src/modules/identity/enrollment.js";
import { transaction } from "../src/modules/identity/repository.js";
import { createIdentityFixture } from "./identity-fixture.js";

const fixture = await createIdentityFixture();
const { app, pool, owner, config, clock } = fixture;
const password = "Synthetic-password-2026";
const requestId = () => randomUUID();
async function request(path: string, body?: unknown, cookie?: string) {
  return app.request(path, {
    method: body === undefined ? "GET" : "POST",
    headers: {
      Origin: config.APP_ORIGIN,
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}
async function post(path: string, body: unknown, cookie?: string) {
  const r = await request(path, body, cookie);
  const data: unknown = await r.json();
  assert.equal(r.status, 200, JSON.stringify(data));
  return data;
}
async function link(kind: string, email: string) {
  const rows = (
    await pool.query<{ payload: string }>(
      'SELECT payload FROM email_event WHERE kind=$1 AND payload IS NOT NULL ORDER BY "createdAt" DESC',
      [kind],
    )
  ).rows;
  for (const row of rows) {
    const data = z
      .object({ to: z.string(), url: z.string() })
      .parse(unseal(row.payload, config.AUTH_SECRET));
    if (data.to === email) return new URL(data.url);
  }
  throw new Error("Expected queued synthetic email");
}
const token = (url: URL) => new URLSearchParams(url.hash.slice(1)).get("token");
async function login(email: string, chosenPassword = password) {
  const response = await request("/api/auth/sign-in/email", {
    email,
    password: chosenPassword,
  });
  assert.equal(response.status, 200, await response.clone().text());
  assert.ok(!(await response.text()).includes("token"));
  return response.headers
    .getSetCookie()
    .map((c) => c.split(";")[0])
    .join("; ");
}
async function enroll(email: string, name: string) {
  const input = {
    requestId: requestId(),
    email,
    name,
    password,
    token: token(await link("invitation", email)),
  };
  const before =
    (await pool.query("SELECT id FROM email_event WHERE kind='verification'"))
      .rowCount ?? 0;
  await Promise.all([
    post("/api/v1/enrollment", input),
    post("/api/v1/enrollment", input),
  ]);
  assert.equal(
    (await pool.query("SELECT id FROM email_event WHERE kind='verification'"))
      .rowCount,
    before + 1,
  );
  assert.equal(
    (await request("/api/auth/sign-in/email", { email, password })).status,
    400,
  );
  const expiredVerification = await signJWT({ email }, config.AUTH_SECRET, -60);
  assert.equal(
    (await request("/api/auth/verify-email", { token: expiredVerification }))
      .status,
    400,
  );
  assert.equal(
    (
      await pool.query(
        'SELECT s.id FROM session s JOIN "user" u ON u.id=s."userId" WHERE u.email=$1',
        [email],
      )
    ).rowCount,
    0,
  );
  await post("/api/auth/verify-email", {
    token: token(await link("verification", email)),
  });
  return login(email);
}
try {
  const initial = await Promise.allSettled([
    bootstrap(pool, config, "owner@identity.test", clock()),
    bootstrap(pool, config, "owner@identity.test", clock()),
  ]);
  assert.equal(initial.filter((r) => r.status === "fulfilled").length, 1);
  assert.equal(
    (
      await request("/api/auth/sign-up/email", {
        email: "bypass@identity.test",
        name: "Bypass",
        password,
      })
    ).status,
    403,
  );
  assert.equal((await request("/api/v1/me")).status, 401);
  assert.equal(
    (
      await app.request("/api/v1/enrollment", {
        method: "POST",
        headers: {
          Origin: "https://forged.invalid",
          "Content-Type": "application/json",
        },
        body: "{}",
      })
    ).status,
    403,
  );
  let invitationToken = token(await link("invitation", "owner@identity.test"));
  assert.equal(
    (
      await request("/api/v1/enrollment", {
        requestId: requestId(),
        email: "wrong@identity.test",
        name: "Wrong",
        password,
        token: invitationToken,
      })
    ).status,
    400,
  );
  await pool.query("DELETE FROM application_rate");
  assert.equal(
    (
      await request("/api/v1/enrollment", {
        requestId: requestId(),
        email: "owner@identity.test",
        name: "Owner",
        password,
        token: "forged".repeat(8),
      })
    ).status,
    400,
  );
  await pool.query(`UPDATE invitation SET "expiresAt"=$1`, [
    new Date(clock().getTime() - 1000),
  ]);
  assert.equal(
    (
      await request("/api/v1/enrollment", {
        requestId: requestId(),
        email: "owner@identity.test",
        name: "Owner",
        password,
        token: invitationToken,
      })
    ).status,
    400,
  );
  await pool.query(`UPDATE invitation SET "expiresAt"=$1,state='canceled'`, [
    new Date(clock().getTime() + 86400000),
  ]);
  assert.equal(
    (
      await request("/api/v1/enrollment", {
        requestId: requestId(),
        email: "owner@identity.test",
        name: "Owner",
        password,
        token: invitationToken,
      })
    ).status,
    400,
  );
  await pool.query("UPDATE invitation SET state='pending'");
  await pool.query("DELETE FROM application_rate");
  await owner.query(
    `CREATE FUNCTION fail_identity_email() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic email failure'; END $$; CREATE TRIGGER fail_identity_email BEFORE INSERT ON email_event FOR EACH ROW EXECUTE FUNCTION fail_identity_email();`,
  );
  assert.equal(
    (
      await request("/api/v1/enrollment", {
        requestId: requestId(),
        email: "owner@identity.test",
        name: "Owner",
        password,
        token: invitationToken,
      })
    ).status,
    503,
  );
  assert.equal((await pool.query('SELECT id FROM "user"')).rowCount, 0);
  assert.equal(
    (await pool.query("SELECT state FROM invitation")).rows[0]?.state,
    "pending",
  );
  await owner.query(
    "DROP TRIGGER fail_identity_email ON email_event; DROP FUNCTION fail_identity_email()",
  );
  // Clear only disposable throttles between adversarial cases and the journey.
  await pool.query("DELETE FROM application_rate");
  await resendOwnerInvitation(pool, config, "owner@identity.test", clock());
  assert.equal(
    (
      await request("/api/v1/enrollment", {
        requestId: requestId(),
        email: "owner@identity.test",
        name: "Old link",
        password,
        token: invitationToken,
      })
    ).status,
    400,
  );
  invitationToken = token(await link("invitation", "owner@identity.test"));
  const first = await enroll("owner@identity.test", "Synthetic Owner");
  await assert.rejects(
    resendOwnerInvitation(pool, config, "owner@identity.test", clock()),
    /Owner invitation unavailable/,
  );
  await pool.query("DELETE FROM application_rate");
  assert.equal(
    (
      await request("/api/v1/enrollment", {
        requestId: requestId(),
        email: "owner@identity.test",
        name: "Replay",
        password,
        token: invitationToken,
      })
    ).status,
    409,
  );
  assert.equal(
    (await request("/api/v1/me", undefined, "better-auth.session_token=forged"))
      .status,
    401,
  );
  await pool.query("DELETE FROM application_rate");
  const me = z
    .object({
      id: z.string(),
      settings: z.object({ revision: z.number() }),
      device: z.object({ id: z.string() }),
    })
    .parse(await postGet("/api/v1/me", first));
  const simultaneous = await Promise.all([
    request(
      "/api/v1/household",
      {
        action: "invite",
        requestId: requestId(),
        email: "adult@identity.test",
      },
      first,
    ),
    request(
      "/api/v1/household",
      {
        action: "invite",
        requestId: requestId(),
        email: "third@identity.test",
      },
      first,
    ),
  ]);
  assert.deepEqual(simultaneous.map((r) => r.status).sort(), [200, 409]);
  const reserved = (
    await pool.query<{ email: string }>(
      "SELECT email FROM membership WHERE slot=2",
    )
  ).rows[0]?.email;
  assert.ok(reserved);
  const second = await enroll(reserved, "Synthetic Adult");
  await pool.query("DELETE FROM application_rate");
  const secondMe = z
    .object({ id: z.string(), device: z.object({ id: z.string() }) })
    .parse(await postGet("/api/v1/me", second));
  assert.equal(
    (
      await request(
        "/api/v1/devices",
        {
          action: "update",
          deviceId: me.device.id,
          mode: "personal",
          label: "Forged",
        },
        second,
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await request(
        "/api/v1/household",
        {
          action: "invite",
          requestId: requestId(),
          email: "fourth@identity.test",
        },
        first,
      )
    ).status,
    409,
  );
  await post(
    "/api/v1/me/settings",
    {
      expectedRevision: 1,
      step: "identity",
      name: "Synthetic Owner",
      preferences: { language: "Tamil" },
    },
    first,
  );
  assert.equal(
    z
      .object({
        settings: z.object({ values: z.record(z.string(), z.unknown()) }),
      })
      .parse(await postGet("/api/v1/me", second)).settings.values.language,
    undefined,
  );
  assert.equal(
    (
      await request(
        "/api/v1/me/settings",
        {
          expectedRevision: 1,
          step: "identity",
          name: "Stale",
          preferences: { language: "English" },
        },
        first,
      )
    ).status,
    409,
  );
  const house = z
    .object({
      revision: z.number(),
      sharedUse: z.boolean(),
      agreements: z.array(z.object({ id: z.string(), revision: z.number() })),
    })
    .parse(await postGet("/api/v1/household", first));
  const rules = house.agreements[0];
  assert.ok(rules);
  await post(
    "/api/v1/household",
    {
      action: "accept-rules",
      requestId: requestId(),
      agreementId: rules.id,
      revision: rules.revision,
    },
    first,
  );
  assert.equal(
    z
      .object({ sharedUse: z.boolean() })
      .parse(await postGet("/api/v1/household", first)).sharedUse,
    false,
  );
  await post(
    "/api/v1/household",
    {
      action: "accept-rules",
      requestId: requestId(),
      agreementId: rules.id,
      revision: rules.revision,
    },
    second,
  );
  assert.equal(
    z
      .object({ sharedUse: z.boolean() })
      .parse(await postGet("/api/v1/household", first)).sharedUse,
    true,
  );
  const replacement = z.object({ id: z.string() }).parse(
    await post(
      "/api/v1/household",
      {
        action: "propose-rules",
        requestId: requestId(),
        expectedRevision: 1,
        text: "Synthetic replacement requires fresh independent acceptance.",
      },
      first,
    ),
  );
  await post(
    "/api/v1/household",
    {
      action: "accept-rules",
      requestId: requestId(),
      agreementId: replacement.id,
      revision: 2,
    },
    first,
  );
  const changed = z.object({ id: z.string() }).parse(
    await post(
      "/api/v1/household",
      {
        action: "propose-rules",
        requestId: requestId(),
        expectedRevision: 2,
        text: "Changed synthetic terms do not inherit earlier acceptance.",
      },
      second,
    ),
  );
  assert.equal(
    (
      await request(
        "/api/v1/household",
        {
          action: "accept-rules",
          requestId: requestId(),
          agreementId: replacement.id,
          revision: 2,
        },
        second,
      )
    ).status,
    409,
  );
  await post(
    "/api/v1/household",
    {
      action: "decline-rules",
      requestId: requestId(),
      agreementId: changed.id,
      revision: 3,
    },
    first,
  );
  assert.equal((await request("/api/v1/me", undefined, second)).status, 200);
  const expired = z.object({ id: z.string() }).parse(
    await post(
      "/api/v1/household",
      {
        action: "propose-rules",
        requestId: requestId(),
        expectedRevision: 3,
        text: "Synthetic expiry preserves the earlier accepted agreement.",
      },
      first,
    ),
  );
  await pool.query('UPDATE agreement SET "expiresAt"=$2 WHERE id=$1', [
    expired.id,
    new Date(clock().getTime() - 1000),
  ]);
  assert.equal(
    (
      await request(
        "/api/v1/household",
        {
          action: "accept-rules",
          requestId: requestId(),
          agreementId: expired.id,
          revision: 4,
        },
        second,
      )
    ).status,
    409,
  );
  const displayed = z
    .object({
      sharedUse: z.boolean(),
      agreements: z.array(z.object({ id: z.string(), state: z.string() })),
    })
    .parse(await postGet("/api/v1/household", first));
  assert.equal(
    displayed.agreements.find((value) => value.id === expired.id)?.state,
    "expired",
  );
  assert.equal(displayed.sharedUse, true);
  assert.equal(
    (
      await request(
        "/api/v1/dependents",
        {
          action: "create",
          requestId: requestId(),
          displayName: "Too early",
          birthDate: null,
        },
        first,
      )
    ).status,
    403,
  );
  for (const [revision, step, preferences] of [
    [
      2,
      "presentation",
      {
        tone: "concise",
        units: "metric",
        currency: "INR",
        dateFormat: "DD MMM YYYY",
        timeZone: "Asia/Kolkata",
      },
    ],
    [3, "disclosure", {}],
    [
      4,
      "preferences",
      { retention: "180-days", notifications: false, quietHours: false },
    ],
  ] as const)
    await post(
      "/api/v1/me/settings",
      {
        expectedRevision: revision,
        step,
        preferences,
        ...(step === "disclosure" ? { acceptDisclosure: true } : {}),
      },
      first,
    );
  await post(
    "/api/v1/dependents",
    {
      action: "create",
      requestId: requestId(),
      displayName: "Synthetic Dependent",
      birthDate: null,
    },
    first,
  );
  const dependent = z
    .array(z.object({ id: z.string(), revision: z.number() }))
    .parse(await postGet("/api/v1/dependents", first))[0];
  assert.ok(dependent);
  assert.deepEqual(await postGet("/api/v1/dependents", second), []);
  assert.equal(
    (
      await request(
        "/api/v1/dependents",
        {
          action: "update",
          dependentId: dependent.id,
          expectedRevision: 1,
          displayName: "Forged",
          birthDate: null,
        },
        second,
      )
    ).status,
    403,
  );
  const proposal = z.object({ id: z.string() }).parse(
    await post(
      "/api/v1/dependents",
      {
        action: "propose-guardian",
        requestId: requestId(),
        dependentId: dependent.id,
        expectedRevision: 1,
        targetId: secondMe.id,
        change: "add",
      },
      first,
    ),
  );
  await post(
    "/api/v1/dependents",
    {
      action: "decide-guardian",
      requestId: requestId(),
      proposalId: proposal.id,
      revision: 1,
      accept: true,
    },
    first,
  );
  assert.equal((await pool.query("SELECT id FROM guardian")).rowCount, 0);
  await post(
    "/api/v1/dependents",
    {
      action: "decide-guardian",
      requestId: requestId(),
      proposalId: proposal.id,
      revision: 1,
      accept: true,
    },
    second,
  );
  assert.equal((await pool.query("SELECT id FROM guardian")).rowCount, 1);
  const correction = z.object({ id: z.string() }).parse(
    await post(
      "/api/v1/dependents",
      {
        action: "request-correction",
        requestId: requestId(),
        dependentId: dependent.id,
        text: "Synthetic attributed correction",
      },
      second,
    ),
  );
  assert.equal(
    (
      await pool.query(
        'SELECT "authorId" FROM dependent_correction WHERE id=$1',
        [correction.id],
      )
    ).rows[0]?.authorId,
    secondMe.id,
  );
  await post(
    "/api/v1/dependents",
    {
      action: "review-correction",
      requestId: requestId(),
      correctionId: correction.id,
      decision: "reviewed",
    },
    first,
  );
  const removal = z.object({ id: z.string() }).parse(
    await post(
      "/api/v1/dependents",
      {
        action: "propose-guardian",
        requestId: requestId(),
        dependentId: dependent.id,
        expectedRevision: 2,
        targetId: secondMe.id,
        change: "remove",
      },
      first,
    ),
  );
  await post(
    "/api/v1/dependents",
    {
      action: "decide-guardian",
      requestId: requestId(),
      proposalId: removal.id,
      revision: 2,
      accept: true,
    },
    first,
  );
  assert.equal((await pool.query("SELECT id FROM guardian")).rowCount, 1);
  await post(
    "/api/v1/dependents",
    {
      action: "decide-guardian",
      requestId: requestId(),
      proposalId: removal.id,
      revision: 2,
      accept: false,
    },
    second,
  );
  assert.equal((await pool.query("SELECT id FROM guardian")).rowCount, 1);
  await post(
    "/api/v1/dependents",
    { action: "relinquish", requestId: requestId(), dependentId: dependent.id },
    second,
  );
  assert.equal((await pool.query("SELECT id FROM guardian")).rowCount, 0);
  assert.deepEqual(await postGet("/api/v1/dependents", second), []);
  for (const cookie of [first, second])
    await post(
      "/api/v1/aliases",
      {
        action: "save",
        requestId: requestId(),
        phrase: "Mom",
        targetType: "person",
        name: cookie === first ? "Private A" : "Private B",
      },
      cookie,
    );
  assert.equal(
    z
      .object({ candidates: z.array(z.object({ name: z.string() })) })
      .parse(
        await post(
          "/api/v1/aliases",
          { action: "resolve", phrase: "Mom" },
          first,
        ),
      ).candidates[0]?.name,
    "Private A",
  );
  await post(
    "/api/v1/aliases",
    {
      action: "save",
      requestId: requestId(),
      phrase: "Mom",
      targetType: "person",
      name: "Another Mom",
    },
    first,
  );
  assert.equal(
    z
      .object({ status: z.string() })
      .parse(
        await post(
          "/api/v1/aliases",
          { action: "resolve", phrase: "Mom" },
          first,
        ),
      ).status,
    "clarification",
  );
  await post(
    "/api/v1/devices",
    {
      action: "update",
      deviceId: me.device.id,
      mode: "personal",
      label: "Test personal",
    },
    first,
  );
  assert.deepEqual(
    await post("/api/v1/devices", { action: "background" }, first),
    { status: "committed", locked: false },
  );
  assert.equal((await request("/api/v1/me", undefined, first)).status, 200);
  await pool.query("DELETE FROM application_rate");
  const sharedOwner = await login("owner@identity.test");
  const sharedDevice = z
    .object({ device: z.object({ id: z.string() }) })
    .parse(await postGet("/api/v1/me", sharedOwner)).device;
  // A live remote device remains editable, using its existing deadline.
  for (const mode of ["personal", "shared"]) {
    await post(
      "/api/v1/devices",
      { action: "update", deviceId: sharedDevice.id, mode, label: "Remote" },
      first,
    );
  }
  // Expiry must be checked after waiting for advisory or target row locks.
  for (const lock of ["advisory", "target"]) {
    fixture.setTime(new Date());
    await pool.query(
      "UPDATE session_policy SET mode='shared',\"lastActivity\"=$1 WHERE id=$2",
      [clock(), sharedDevice.id],
    );
    const blocker = await pool.connect();
    let pending: Promise<Response> | undefined;
    try {
      await blocker.query("BEGIN");
      if (lock === "advisory")
        await blocker.query(
          "SELECT pg_advisory_xact_lock(hashtextextended($1,0))",
          [`sessions:${me.id}`],
        );
      else
        await blocker.query(
          'SELECT s.id FROM session s JOIN session_policy p ON p."sessionId"=s.id WHERE p.id=$1 FOR UPDATE OF s',
          [sharedDevice.id],
        );
      pending = request(
        "/api/v1/devices",
        {
          action: "update",
          deviceId: sharedDevice.id,
          mode: "personal",
          label: "Waited",
        },
        first,
      );
      let waiting = false;
      for (let attempt = 0; attempt < 100 && !waiting; attempt++) {
        const result = await fixture.admin.query(
          "SELECT 1 FROM pg_stat_activity WHERE datname=$1 AND usename='noola_app' AND wait_event_type='Lock' AND query LIKE $2",
          [
            new URL(config.DATABASE_URL).pathname.slice(1),
            lock === "advisory"
              ? "%pg_advisory_xact_lock%"
              : '%SELECT s."expiresAt"%',
          ],
        );
        waiting = !!result.rowCount;
        if (!waiting) await new Promise((resolve) => setTimeout(resolve, 10));
      }
      assert.ok(waiting, `Expected ${lock} lock contention`);
      fixture.setTime(new Date(clock().getTime() + 6 * 60000));
    } finally {
      await blocker.query("ROLLBACK");
      blocker.release();
    }
    assert.ok(pending);
    assert.equal((await pending).status, 403);
    assert.equal(
      (await request("/api/v1/me", undefined, sharedOwner)).status,
      423,
    );
  }
  fixture.setTime(new Date());
  await pool.query('UPDATE session_policy SET "lastActivity"=$1 WHERE id=$2', [
    clock(),
    sharedDevice.id,
  ]);
  const lockedOwner = await login("owner@identity.test");
  const lockedDevice = z
    .object({ device: z.object({ id: z.string() }) })
    .parse(await postGet("/api/v1/me", lockedOwner)).device;
  await post("/api/v1/devices", { action: "lock" }, lockedOwner);
  assert.equal(
    (
      await request(
        "/api/v1/devices",
        {
          action: "update",
          deviceId: lockedDevice.id,
          mode: "personal",
          label: "Locked",
        },
        first,
      )
    ).status,
    403,
  );
  const backgroundOwner = await login("owner@identity.test");
  assert.deepEqual(
    await post("/api/v1/devices", { action: "background" }, backgroundOwner),
    { status: "committed", locked: true },
  );
  assert.equal(
    (await request("/api/v1/me", undefined, backgroundOwner)).status,
    423,
  );
  const expiredOwner = await login("owner@identity.test");
  const expiredDevice = z
    .object({ device: z.object({ id: z.string() }) })
    .parse(await postGet("/api/v1/me", expiredOwner)).device;
  await pool.query(
    'UPDATE session SET "expiresAt"=$1 WHERE id=(SELECT "sessionId" FROM session_policy WHERE id=$2)',
    [new Date(clock().getTime() - 1000), expiredDevice.id],
  );
  assert.equal(
    (
      await request(
        "/api/v1/devices",
        {
          action: "update",
          deviceId: expiredDevice.id,
          mode: "personal",
          label: "Expired",
        },
        first,
      )
    ).status,
    403,
  );
  fixture.setTime(new Date(clock().getTime() + 6 * 60000));
  assert.equal(
    (await request("/api/v1/me", undefined, sharedOwner)).status,
    423,
  );
  for (const mode of ["personal", "shared"]) {
    assert.equal(
      (
        await request(
          "/api/v1/devices",
          {
            action: "update",
            deviceId: sharedDevice.id,
            mode,
            label: "Cannot revive",
          },
          first,
        )
      ).status,
      403,
    );
    assert.equal(
      (await request("/api/v1/me", undefined, sharedOwner)).status,
      423,
    );
  }
  assert.equal((await request("/api/v1/me", undefined, second)).status, 423);
  assert.equal((await request("/api/v1/me", undefined, first)).status, 200);
  fixture.setTime(new Date());
  await pool.query("DELETE FROM application_rate");
  const freshSecond = await login(reserved);
  await post(
    "/api/v1/me/settings",
    {
      expectedRevision: 1,
      step: "identity",
      name: "Synthetic Adult",
      preferences: { language: "English" },
    },
    freshSecond,
  );
  await post("/api/auth/request-password-reset", {
    email: "owner@identity.test",
  });
  const resetToken = token(await link("reset", "owner@identity.test"));
  await post("/api/auth/reset-password", {
    token: resetToken,
    newPassword: "Independent-new-password-2026",
  });
  assert.equal((await request("/api/v1/me", undefined, first)).status, 401);
  assert.equal(
    (await request("/api/v1/me", undefined, freshSecond)).status,
    200,
  );
  assert.equal(
    (
      await request("/api/auth/reset-password", {
        token: resetToken,
        newPassword: password,
      })
    ).status,
    400,
  );
  await pool.query("DELETE FROM application_rate");
  const recoveredFirst = await login(
    "owner@identity.test",
    "Independent-new-password-2026",
  );
  await post("/api/auth/request-password-reset", { email: reserved });
  const secondReset = token(await link("reset", reserved));
  await post("/api/auth/reset-password", {
    token: secondReset,
    newPassword: "Second-independent-password-2026",
  });
  assert.equal(
    (await request("/api/v1/me", undefined, freshSecond)).status,
    401,
  );
  assert.equal(
    (await request("/api/v1/me", undefined, recoveredFirst)).status,
    200,
  );
  await post("/api/auth/request-password-reset", {
    email: "unknown@identity.test",
  });
  assert.equal(
    (
      await request("/api/auth/reset-password", {
        token: "invalid-token",
        newPassword: password,
      })
    ).status,
    400,
  );
  await pool.query('DELETE FROM "rateLimit"');
  await pool.query("DELETE FROM application_rate");
  await post("/api/auth/request-password-reset", { email: reserved });
  const expiredReset = token(await link("reset", reserved));
  await pool.query(
    `UPDATE verification SET "expiresAt"=$1 WHERE identifier=$2`,
    [new Date(clock().getTime() - 1000), `reset-password:${expiredReset}`],
  );
  assert.equal(
    (
      await request("/api/auth/reset-password", {
        token: expiredReset,
        newPassword: password,
      })
    ).status,
    400,
  );
  let sends = 0;
  const worker = createEmailWorker(
    pool,
    config,
    {
      send: async () => {
        sends++;
        return "outcome-unknown";
      },
      reconcile: async () => false,
    },
    clock,
  );
  await worker.tick();
  const unknown = (
    await pool.query("SELECT id FROM email_event WHERE state='outcome-unknown'")
  ).rowCount;
  assert.equal(unknown, 1);
  const queued =
    (await pool.query("SELECT id FROM email_event WHERE state='queued'"))
      .rowCount ?? 0;
  for (let i = 0; i < queued; i++) await worker.tick();
  const count = sends;
  await worker.tick();
  assert.equal(sends, count);
  const restarted = createEmailWorker(
    pool,
    config,
    { send: async () => "transport-accepted", reconcile: async () => true },
    clock,
  );
  await restarted.tick();
  assert.ok(
    (
      await pool.query(
        "SELECT id FROM email_event WHERE state='transport-accepted' AND payload IS NULL",
      )
    ).rowCount,
  );
  const failedId = await enqueueEmail(
    pool,
    config,
    "recovery",
    "failure@identity.test",
    undefined,
    clock(),
  );
  let failedSends = 0;
  const definiteFailure = createEmailWorker(
    pool,
    config,
    {
      send: async () => {
        failedSends++;
        return "failed";
      },
      reconcile: async () => false,
    },
    clock,
  );
  await definiteFailure.tick();
  assert.equal(
    (await pool.query("SELECT state FROM email_event WHERE id=$1", [failedId]))
      .rows[0]?.state,
    "failed",
  );
  await definiteFailure.tick();
  assert.equal(failedSends, 1);
  await assert.rejects(
    pool.query("CREATE TABLE forbidden_identity_test (id int)"),
    /permission denied/,
  );
  await pool.query('DELETE FROM "rateLimit"');
  await pool.query("DELETE FROM application_rate");
  const signedOut = await login(reserved, "Second-independent-password-2026");
  const extraOwner = await login(
    "owner@identity.test",
    "Independent-new-password-2026",
  );
  await postGet("/api/v1/me", extraOwner);
  // Sign-in creates an auth session before its first private API request.
  const uninitializedOwner = await login(
    "owner@identity.test",
    "Independent-new-password-2026",
  );
  const revocation = {
    action: "revoke-others",
    requestId: requestId(),
    deviceId: secondMe.device.id,
  };
  await post("/api/v1/devices", revocation, recoveredFirst);
  const events = (
    await pool.query(
      "SELECT id FROM security_event WHERE kind='session-revoked'",
    )
  ).rowCount;
  await post("/api/v1/devices", revocation, recoveredFirst);
  assert.equal(
    (
      await pool.query(
        "SELECT id FROM security_event WHERE kind='session-revoked'",
      )
    ).rowCount,
    events,
  );
  assert.equal(
    (await request("/api/v1/me", undefined, extraOwner)).status,
    401,
  );
  assert.equal(
    (await request("/api/v1/me", undefined, uninitializedOwner)).status,
    401,
  );
  assert.equal(
    (await request("/api/v1/me", undefined, recoveredFirst)).status,
    200,
  );
  assert.equal((await request("/api/v1/me", undefined, signedOut)).status, 200);
  await post("/api/auth/sign-out", {}, signedOut);
  await pool.query("DELETE FROM application_rate");
  for (let attempt = 0; attempt < 4; attempt++)
    assert.equal(
      (
        await request("/api/auth/request-password-reset", {
          email: "throttle@identity.test",
        })
      ).status,
      attempt < 3 ? 200 : 429,
    );
  await pool.query('DELETE FROM "rateLimit"');
  await pool.query("DELETE FROM application_rate");
  for (let attempt = 0; attempt < 6; attempt++)
    assert.equal(
      (
        await request("/api/auth/request-password-reset", {
          email: `source-${attempt}@identity.test`,
        })
      ).status,
      attempt < 5 ? 200 : 429,
    );
  assert.equal((await request("/api/v1/me", undefined, signedOut)).status, 401);
  await post("/api/auth/sign-out", {}, signedOut);
  console.info(
    "PASS: repeated migrations, concurrent bootstrap/capacity, atomic enrollment rollback, signup/CSRF boundaries, independent settings, rules, guardians, aliases, server locks, independent recovery, durable uncertain-email reconciliation, restricted role.",
  );
} finally {
  await fixture.close();
}
await verifyExistingJoin();
async function verifyExistingJoin() {
  const existing = await createIdentityFixture();
  try {
    const email = "existing@identity.test";
    const headers = new Headers({
      Origin: existing.config.APP_ORIGIN,
      "Content-Type": "application/json",
    });
    await transaction(existing.pool, (db) =>
      createAuthentication(db, existing.config, true).api.signUpEmail({
        headers,
        body: { email, name: "Existing verified adult", password },
      }),
    );
    await existing.pool.query(
      `UPDATE "user" SET "emailVerified"=true WHERE email=$1`,
      [email],
    );
    await bootstrap(existing.pool, existing.config, email);
    const encrypted = (
      await existing.pool.query<{ payload: string }>(
        "SELECT payload FROM email_event WHERE kind='invitation'",
      )
    ).rows[0];
    assert.ok(encrypted);
    const invitation = z
      .object({ url: z.string() })
      .parse(unseal(encrypted.payload, existing.config.AUTH_SECRET));
    const invitationToken = token(new URL(invitation.url));
    const call = (path: string, body: unknown, cookie = "") =>
      existing.app.request(path, {
        method: "POST",
        headers: {
          Origin: existing.config.APP_ORIGIN,
          "Content-Type": "application/json",
          Cookie: cookie,
        },
        body: JSON.stringify(body),
      });
    assert.equal(
      (
        await call("/api/v1/enrollment", {
          requestId: requestId(),
          token: invitationToken,
          email,
          name: "Credential overwrite attempt",
          password: "Changed-without-auth-2026",
        })
      ).status,
      409,
    );
    const authenticated = await call("/api/auth/sign-in/email", {
      email,
      password,
    });
    assert.equal(authenticated.status, 200);
    const cookie = authenticated.headers
      .getSetCookie()
      .map((value) => value.split(";")[0])
      .join("; ");
    const joining = { requestId: requestId(), token: invitationToken };
    for (let attempt = 0; attempt < 2; attempt++)
      assert.equal(
        (await call("/api/v1/enrollment/join", joining, cookie)).status,
        200,
      );
    assert.equal(
      (
        await existing.app.request("/api/v1/me", {
          headers: { Cookie: cookie },
        })
      ).status,
      200,
    );
    assert.equal(
      (
        await call(
          "/api/v1/enrollment/join",
          { requestId: requestId(), token: invitationToken },
          cookie,
        )
      ).status,
      400,
    );
    console.info(
      "PASS: existing verified account joins only after authentication; enrollment cannot overwrite credentials.",
    );
  } finally {
    await existing.close();
  }
}
async function postGet(path: string, cookie: string) {
  const r = await request(path, undefined, cookie);
  assert.equal(r.status, 200, await r.clone().text());
  return r.json() as Promise<unknown>;
}

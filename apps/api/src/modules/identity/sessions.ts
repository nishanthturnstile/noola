import { randomUUID } from "node:crypto";
import {
  type deviceCommandSchema,
  devicesSchema,
} from "@noola/contracts/identity";
import type pg from "pg";
import type { z } from "zod";
import type { Config } from "../../config.js";
import { createAuthentication } from "./authentication.js";
import { type Principal, sessionDeadline } from "./policy.js";
import { withReceipt } from "./receipts.js";
import { type Connection, IdentityError, transaction } from "./repository.js";
export async function currentPrincipal(
  pool: pg.Pool,
  config: Config,
  headers: Headers,
  now: Date,
): Promise<Principal> {
  return transaction(pool, async (db) => {
    const identity = await createAuthentication(db, config).api.getSession({
      headers,
    });
    if (!identity?.user.emailVerified || identity.session.expiresAt <= now)
      throw new IdentityError("unauthorized", "Sign in to continue.");
    if (
      !(
        await db.query(
          `SELECT id FROM session WHERE id=$1 AND "expiresAt">$2 FOR UPDATE`,
          [identity.session.id, now],
        )
      ).rowCount
    )
      throw new IdentityError("unauthorized", "Sign in again.");
    const member = (
      await db.query<{ id: string; role: "owner" | "adult" }>(
        `UPDATE membership SET state='active',"updatedAt"=$2 WHERE "userId"=$1 AND state IN ('verification','active') RETURNING id,role`,
        [identity.user.id, now],
      )
    ).rows[0];
    if (!member)
      throw new IdentityError(
        "unauthorized",
        "No active household membership.",
      );
    await db.query(
      `INSERT INTO session_policy (id,"sessionId","userId",mode,label,"lastActivity","createdAt") VALUES($1,$2,$3,'shared','This device',$4,$4) ON CONFLICT ("sessionId") DO NOTHING`,
      [
        randomUUID(),
        identity.session.id,
        identity.user.id,
        identity.session.createdAt,
      ],
    );
    const device = (
      await db.query<{
        id: string;
        mode: "shared" | "personal";
        label: string;
        lastActivity: Date;
        lockedAt: Date | null;
      }>(
        `SELECT id,mode,label,"lastActivity","lockedAt" FROM session_policy WHERE "sessionId"=$1`,
        [identity.session.id],
      )
    ).rows[0];
    if (!device) throw new IdentityError("unauthorized", "Sign in again.");
    if (
      device.lockedAt ||
      sessionDeadline(device.mode, device.lastActivity) <= now
    ) {
      throw new IdentityError(
        "locked",
        "This device is locked. Sign in again with your password.",
      );
    }
    return {
      userId: identity.user.id,
      name: identity.user.name,
      email: identity.user.email,
      membershipId: member.id,
      role: member.role,
      sessionId: identity.session.id,
      deviceId: device.id,
      mode: device.mode,
      label: device.label,
      lastActivity: device.lastActivity,
    };
  });
}
export async function assertCurrent(
  db: Connection,
  principal: Principal,
  now: Date,
) {
  // Lock the parent session before its policy, matching authentication deletes
  // and their cascading policy cleanup.
  const session = (
    await db.query<{ expiresAt: Date }>(
      `SELECT "expiresAt" FROM session WHERE id=$1 AND "userId"=$2 FOR UPDATE`,
      [principal.sessionId, principal.userId],
    )
  ).rows[0];
  if (!session || session.expiresAt <= now)
    throw new IdentityError("unauthorized", "Sign in again.");
  const result = await db.query<{
    mode: string;
    lastActivity: Date;
    lockedAt: Date | null;
  }>(
    `SELECT p.mode,p."lastActivity",p."lockedAt" FROM session_policy p JOIN membership m ON m."userId"=p."userId" WHERE p.id=$1 AND p."userId"=$2 AND m.state='active' FOR UPDATE OF p`,
    [principal.deviceId, principal.userId],
  );
  const row = result.rows[0];
  if (!row) throw new IdentityError("unauthorized", "Sign in again.");
  if (row.lockedAt || sessionDeadline(row.mode, row.lastActivity) <= now)
    throw new IdentityError("locked", "This device is locked. Sign in again.");
}
export async function listDevices(
  db: Connection,
  principal: Principal,
  now: Date,
) {
  const rows = (
    await db.query<{
      id: string;
      mode: string;
      label: string;
      sessionId: string;
      lastActivity: Date;
      lockedAt: Date | null;
    }>(
      `SELECT p.* FROM session_policy p JOIN session s ON s.id=p."sessionId" WHERE p."userId"=$1 AND s."expiresAt">$2 ORDER BY p."createdAt" DESC`,
      [principal.userId, now],
    )
  ).rows;
  return devicesSchema.parse(
    rows.map((row) => ({
      id: row.id,
      mode: row.mode,
      label: row.label,
      current: row.sessionId === principal.sessionId,
      lastActivity: row.lastActivity.toISOString(),
      locked:
        !!row.lockedAt || sessionDeadline(row.mode, row.lastActivity) <= now,
    })),
  );
}
export async function changeDevice(
  pool: pg.Pool,
  principal: Principal,
  input: z.infer<typeof deviceCommandSchema>,
  clock: () => Date,
) {
  return transaction(pool, async (db) => {
    if (
      input.action === "update" ||
      input.action === "revoke" ||
      input.action === "revoke-others"
    )
      await db.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", [
        `sessions:${principal.userId}`,
      ]);
    const now = clock();
    await assertCurrent(db, principal, now);
    const work = async () => {
      if (input.action === "background") {
        const result = await db.query(
          `UPDATE session_policy SET "lockedAt"=$2 WHERE id=$1 AND mode='shared'`,
          [principal.deviceId, clock()],
        );
        return { status: "committed" as const, locked: !!result.rowCount };
      }
      if (input.action === "activity")
        await db.query(
          `UPDATE session_policy SET "lastActivity"=$2 WHERE id=$1`,
          [principal.deviceId, now],
        );
      else if (input.action === "lock")
        await db.query(`UPDATE session_policy SET "lockedAt"=$2 WHERE id=$1`, [
          principal.deviceId,
          now,
        ]);
      else if (input.action === "update") {
        const targetSession = (
          await db.query<{ expiresAt: Date }>(
            `SELECT s."expiresAt" FROM session s JOIN session_policy p ON p."sessionId"=s.id WHERE p.id=$1 AND s."userId"=$2 ORDER BY s.id FOR UPDATE OF s`,
            [input.deviceId, principal.userId],
          )
        ).rows[0];
        const targetPolicy = (
          await db.query<{
            mode: string;
            lastActivity: Date;
            lockedAt: Date | null;
          }>(
            `SELECT mode,"lastActivity","lockedAt" FROM session_policy WHERE id=$1 AND "userId"=$2 FOR UPDATE`,
            [input.deviceId, principal.userId],
          )
        ).rows[0];
        const targetNow = clock();
        await assertCurrent(db, principal, targetNow);
        if (
          !targetSession ||
          targetSession.expiresAt <= targetNow ||
          !targetPolicy ||
          targetPolicy.lockedAt ||
          sessionDeadline(targetPolicy.mode, targetPolicy.lastActivity) <=
            targetNow
        )
          throw new IdentityError(
            "forbidden",
            "Device unavailable or locked. Sign in on that device before changing it.",
          );
        const result = await db.query(
          `UPDATE session_policy SET mode=$3,label=$4 WHERE id=$1 AND "userId"=$2`,
          [input.deviceId, principal.userId, input.mode, input.label],
        );
        if (!result.rowCount)
          throw new IdentityError("forbidden", "Device unavailable.");
      } else if (
        input.action === "revoke" ||
        input.action === "revoke-others"
      ) {
        const devices = await db.query<{ sessionId: string }>(
          `SELECT s.id AS "sessionId" FROM session s LEFT JOIN session_policy p ON p."sessionId"=s.id WHERE s."userId"=$1 AND ${input.action === "revoke" ? "p.id=$2" : "s.id<>$2"} ORDER BY s.id FOR UPDATE OF s`,
          [
            principal.userId,
            input.action === "revoke"
              ? (input.deviceId ?? principal.deviceId)
              : principal.sessionId,
          ],
        );
        if (input.action === "revoke" && !devices.rowCount)
          throw new IdentityError("forbidden", "Device unavailable.");
        for (const device of devices.rows) {
          await db.query(
            `INSERT INTO security_event (id,"userId",kind,"sessionId","createdAt") VALUES($1,$2,'session-revoked',$3,$4)`,
            [randomUUID(), principal.userId, device.sessionId, now],
          );
          await db.query(`DELETE FROM session WHERE id=$1 AND "userId"=$2`, [
            device.sessionId,
            principal.userId,
          ]);
        }
      }
      return { status: "committed" as const };
    };
    return "requestId" in input
      ? withReceipt(db, principal.userId, "session", input, now, work)
      : work();
  });
}

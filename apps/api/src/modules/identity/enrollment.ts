import { createHash, randomBytes, randomUUID } from "node:crypto";
import type {
  enrollmentSchema,
  identityEndpoints,
} from "@noola/contracts/identity";
import type pg from "pg";
import type { z } from "zod";
import { enqueueEmail } from "../../adapters/email/ledger.js";
import type { Config } from "../../config.js";
import { createAuthentication } from "./authentication.js";
import { initialRules } from "./policy.js";
import { withReceipt } from "./receipts.js";
import {
  type Connection,
  IdentityError,
  lockHousehold,
  rateLimit,
  transaction,
} from "./repository.js";
export const digest = (value: string) =>
  createHash("sha256").update(value).digest("hex");
export async function issueInvitation(
  db: Connection,
  config: Config,
  membershipId: string,
  requestId: string,
  email: string,
  now: Date,
) {
  const token = randomBytes(32).toString("base64url");
  const id = randomUUID();
  await db.query(
    `UPDATE invitation SET state='canceled',"updatedAt"=$2 WHERE "membershipId"=$1 AND state='pending'`,
    [membershipId, now],
  );
  await db.query(
    `INSERT INTO invitation (id,"membershipId",digest,"expiresAt",state,"requestId","createdAt","updatedAt") VALUES($1,$2,$3,$4,'pending',$5,$6,$6)`,
    [
      id,
      membershipId,
      digest(token),
      new Date(now.getTime() + config.INVITATION_HOURS * 3600000),
      requestId,
      now,
    ],
  );
  const eventId = await enqueueEmail(
    db,
    config,
    "invitation",
    email,
    `${config.APP_ORIGIN}/enroll#token=${token}`,
    now,
  );
  await db.query(`UPDATE invitation SET "emailEventId"=$2 WHERE id=$1`, [
    id,
    eventId,
  ]);
  return { status: "pending" as const, id, emailStatus: "queued" as const };
}
export async function bootstrap(
  pool: pg.Pool,
  config: Config,
  email: string,
  now = new Date(),
) {
  return transaction(pool, async (db) => {
    await lockHousehold(db);
    if ((await db.query("SELECT id FROM household")).rowCount)
      throw new IdentityError(
        "conflict",
        "Household already initialized; existing accounts were preserved.",
      );
    await db.query("INSERT INTO household (id,revision) VALUES(1,1)");
    const membershipId = randomUUID();
    await db.query(
      `INSERT INTO membership (id,"householdId",slot,role,email,state,"createdAt","updatedAt") VALUES($1,1,1,'owner',$2,'invited',$3,$3)`,
      [membershipId, email, now],
    );
    await db.query(
      `INSERT INTO agreement (id,revision,text,state,"expiresAt","createdAt") VALUES($1,1,$2,'pending',$3,$4)`,
      [randomUUID(), initialRules, new Date(now.getTime() + 86400000), now],
    );
    return issueInvitation(db, config, membershipId, randomUUID(), email, now);
  });
}
export async function resendOwnerInvitation(
  pool: pg.Pool,
  config: Config,
  email: string,
  now = new Date(),
) {
  await rateLimit(pool, `owner-invite:${digest(email)}`, 3, 900000, now);
  return transaction(pool, async (db) => {
    await lockHousehold(db);
    const member = (
      await db.query<{ id: string }>(
        `SELECT id FROM membership WHERE slot=1 AND email=$1 AND state='invited' AND "userId" IS NULL FOR UPDATE`,
        [email],
      )
    ).rows[0];
    if (!member)
      throw new IdentityError(
        "conflict",
        "Owner invitation unavailable; enrolled accounts recover through their own email.",
      );
    return issueInvitation(db, config, member.id, randomUUID(), email, now);
  });
}
export async function enroll(
  pool: pg.Pool,
  config: Config,
  input: z.infer<typeof enrollmentSchema>,
  now: Date,
) {
  return transaction(pool, async (db) => {
    await lockHousehold(db);
    return withReceipt(
      db,
      `enrollment:${digest(input.email)}`,
      "enrollment",
      input,
      now,
      async () => {
        const invite = (
          await db.query<{
            id: string;
            state: string;
            expiresAt: Date;
            membershipId: string;
            email: string;
            userId: string | null;
          }>(
            `SELECT i.*,m.email,m."userId" FROM invitation i JOIN membership m ON m.id=i."membershipId" WHERE i.digest=$1 FOR UPDATE OF i,m`,
            [digest(input.token)],
          )
        ).rows[0];
        if (
          !invite ||
          invite.state === "canceled" ||
          invite.expiresAt <= now ||
          invite.email !== input.email
        )
          throw new IdentityError(
            "invalid",
            "Invitation unavailable. Ask for a new invitation.",
          );
        const existing = (
          await db.query<{ id: string; emailVerified: boolean }>(
            `SELECT id,"emailVerified" FROM "user" WHERE email=$1`,
            [input.email],
          )
        ).rows[0];
        if (invite.state === "consumed") {
          if (
            existing &&
            existing.id === invite.userId &&
            !existing.emailVerified
          )
            return { status: "verification-required" as const };
          throw new IdentityError(
            "conflict",
            "This invitation has already been used. Sign in to continue.",
          );
        }
        if (existing) {
          if (existing.emailVerified)
            throw new IdentityError(
              "conflict",
              "Sign in to join with this invitation. Your password will not be changed.",
            );
          throw new IdentityError(
            "conflict",
            "Verify your existing account, then sign in to join.",
          );
        }
        const account = await createAuthentication(
          db,
          config,
          true,
          () => now,
        ).api.signUpEmail({
          body: {
            email: input.email,
            name: input.name,
            password: input.password,
          },
        });
        await db.query(
          `UPDATE membership SET "userId"=$2,state='verification',"updatedAt"=$3 WHERE id=$1`,
          [invite.membershipId, account.user.id, now],
        );
        await db.query(
          `INSERT INTO personal_settings ("userId",revision,values,"createdAt","updatedAt") VALUES($1,1,'{}',$2,$2)`,
          [account.user.id, now],
        );
        await db.query(
          `UPDATE invitation SET state='consumed',"updatedAt"=$2 WHERE id=$1`,
          [invite.id, now],
        );
        return {
          status: "verification-required" as const,
          emailStatus: "queued" as const,
        };
      },
    );
  });
}

export async function joinExisting(
  pool: pg.Pool,
  config: Config,
  headers: Headers,
  input: z.infer<typeof identityEndpoints.join.input>,
  now: Date,
) {
  const session = await createAuthentication(pool, config).api.getSession({
    headers,
  });
  if (!session?.user.emailVerified || session.session.expiresAt <= now)
    throw new IdentityError(
      "unauthorized",
      "Verify your email and sign in before joining.",
    );
  return transaction(pool, async (db) => {
    await lockHousehold(db);
    if (
      !(
        await db.query(
          `SELECT id FROM session WHERE id=$1 AND "userId"=$2 AND "expiresAt">$3 FOR UPDATE`,
          [session.session.id, session.user.id, now],
        )
      ).rowCount
    )
      throw new IdentityError("unauthorized", "Sign in again before joining.");
    return withReceipt(db, session.user.id, "join", input, now, async () => {
      const invite = (
        await db.query<{
          id: string;
          membershipId: string;
          email: string;
          expiresAt: Date;
          state: string;
        }>(
          `SELECT i.*,m.email FROM invitation i JOIN membership m ON m.id=i."membershipId" WHERE i.digest=$1 FOR UPDATE OF i,m`,
          [digest(input.token)],
        )
      ).rows[0];
      if (
        !invite ||
        invite.email !== session.user.email ||
        invite.expiresAt <= now ||
        invite.state !== "pending"
      )
        throw new IdentityError("invalid", "Invitation unavailable.");
      if (
        (
          await db.query(`SELECT id FROM membership WHERE "userId"=$1`, [
            session.user.id,
          ])
        ).rowCount
      )
        throw new IdentityError(
          "conflict",
          "This account is already a household member.",
        );
      await db.query(
        `UPDATE membership SET "userId"=$2,state='active',"updatedAt"=$3 WHERE id=$1`,
        [invite.membershipId, session.user.id, now],
      );
      await db.query(
        `INSERT INTO personal_settings ("userId",revision,values,"createdAt","updatedAt") VALUES($1,1,'{}',$2,$2) ON CONFLICT ("userId") DO NOTHING`,
        [session.user.id, now],
      );
      await db.query(
        `UPDATE invitation SET state='consumed',"updatedAt"=$2 WHERE id=$1`,
        [invite.id, now],
      );
      return { status: "joined" as const };
    });
  });
}

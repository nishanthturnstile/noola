import { randomUUID } from "node:crypto";
import {
  type householdCommandSchema,
  householdSchema,
} from "@noola/contracts/identity";
import type pg from "pg";
import type { z } from "zod";
import type { Config } from "../../config.js";
import { digest, issueInvitation } from "./enrollment.js";
import { type Principal, requireOwner } from "./policy.js";
import { withReceipt } from "./receipts.js";
import {
  type Connection,
  IdentityError,
  lockHousehold,
  rateLimit,
  transaction,
} from "./repository.js";
import { assertCurrent } from "./sessions.js";
export async function householdState(
  db: Connection,
  principal: Principal,
  now: Date,
) {
  const members = (
    await db.query<{ id: string; name: string; role: string }>(
      `SELECT u.id,u.name,m.role FROM membership m JOIN "user" u ON u.id=m."userId" WHERE m.state='active' AND u."emailVerified"=true ORDER BY m.slot`,
    )
  ).rows;
  const invitations =
    principal.role === "owner"
      ? (
          await db.query<{
            id: string;
            email: string;
            state: string;
            expiresAt: Date;
            emailStatus: string;
          }>(
            `SELECT i.id,m.email,CASE WHEN m.state='verification' THEN 'verification' WHEN i."expiresAt"<=$1 THEN 'expired' ELSE 'pending' END AS state,i."expiresAt",COALESCE((SELECT e.state FROM email_event e WHERE e.id=i."emailEventId"),'queued') AS "emailStatus" FROM invitation i JOIN membership m ON m.id=i."membershipId" WHERE m.state<>'active' AND i.state<>'canceled' ORDER BY i."createdAt" DESC`,
            [now],
          )
        ).rows
      : [];
  const agreements = (
    await db.query<{
      id: string;
      revision: number;
      text: string;
      state: string;
      expiresAt: Date;
      proposedBy: string | null;
    }>(
      `SELECT * FROM agreement WHERE "expiresAt">$1 OR state='accepted' OR "createdAt">$2 ORDER BY revision DESC`,
      [now, new Date(now.getTime() - 7 * 86400000)],
    )
  ).rows;
  const decisions = (
    await db.query<{ agreementId: string; userId: string; decision: string }>(
      `SELECT "agreementId","userId",decision FROM agreement_decision`,
    )
  ).rows;
  const sharedUse =
    members.length === 2 &&
    agreements.some(
      (a) =>
        a.state === "accepted" &&
        members.every((m) =>
          decisions.some(
            (d) =>
              d.agreementId === a.id &&
              d.userId === m.id &&
              d.decision === "accepted",
          ),
        ),
    );
  return householdSchema.parse({
    revision: (
      await db.query<{ revision: number }>(
        "SELECT revision FROM household WHERE id=1",
      )
    ).rows[0]?.revision,
    sharedUse,
    members,
    invitations: invitations.map((i) => ({
      ...i,
      expiresAt: i.expiresAt.toISOString(),
    })),
    agreements: agreements.map((a) => ({
      ...a,
      state: a.state === "pending" && a.expiresAt <= now ? "expired" : a.state,
      expiresAt: a.expiresAt.toISOString(),
      canCancel: a.proposedBy === principal.userId,
      decisions: decisions
        .filter((d) => d.agreementId === a.id)
        .map((d) => ({ userId: d.userId, decision: d.decision })),
    })),
  });
}
export async function changeHousehold(
  pool: pg.Pool,
  config: Config,
  principal: Principal,
  input: z.infer<typeof householdCommandSchema>,
  now: Date,
) {
  return transaction(pool, async (db) => {
    await lockHousehold(db);
    await assertCurrent(db, principal, now);
    return withReceipt(
      db,
      principal.userId,
      "household",
      input,
      now,
      async () => {
        if (input.action === "invite") {
          requireOwner(principal);
          await rateLimit(db, `invite:${principal.userId}`, 3, 900000, now);
          if (input.email === principal.email)
            throw new IdentityError(
              "invalid",
              "Invite the other adult using their own email.",
            );
          const current = (
            await db.query<{
              id: string;
              state: string;
              userId: string | null;
            }>(
              'SELECT id,state,"userId" FROM membership WHERE slot=2 FOR UPDATE',
            )
          ).rows[0];
          if (current)
            throw new IdentityError(
              "conflict",
              "The second adult slot is already reserved.",
            );
          const id = randomUUID();
          await db.query(
            `INSERT INTO membership (id,"householdId",slot,role,email,state,"createdAt","updatedAt") VALUES($1,1,2,'adult',$2,'invited',$3,$3)`,
            [id, input.email, now],
          );
          return issueInvitation(
            db,
            config,
            id,
            input.requestId,
            input.email,
            now,
          );
        }
        if (input.action === "resend" || input.action === "cancel") {
          requireOwner(principal);
          const invite = (
            await db.query<{
              membershipId: string;
              state: string;
              email: string;
              memberState: string;
              userId: string | null;
            }>(
              `SELECT i."membershipId",i.state,m.email,m.state AS "memberState",m."userId" FROM invitation i JOIN membership m ON m.id=i."membershipId" WHERE i.id=$1 FOR UPDATE OF i,m`,
              [input.invitationId],
            )
          ).rows[0];
          if (
            !invite ||
            invite.memberState === "active" ||
            invite.state === "canceled" ||
            (
              await db.query(
                `SELECT id FROM "user" WHERE id=$1 AND "emailVerified"=true`,
                [invite.userId],
              )
            ).rowCount
          )
            throw new IdentityError(
              "conflict",
              "Invitation cannot be changed after activation.",
            );
          if (invite.memberState === "verification")
            throw new IdentityError(
              "conflict",
              "This adult has enrolled. They can resend verification or recover independently.",
            );
          if (input.action === "resend") {
            await rateLimit(db, `invite:${principal.userId}`, 3, 900000, now);
            return issueInvitation(
              db,
              config,
              invite.membershipId,
              input.requestId,
              invite.email,
              now,
            );
          }
          if (invite.membershipId === principal.membershipId)
            throw new IdentityError(
              "forbidden",
              "The owner enrollment cannot be canceled here.",
            );
          await db.query(
            "DELETE FROM membership WHERE id=$1 AND state='invited'",
            [invite.membershipId],
          );
          return { status: "committed" };
        }
        if (input.action === "join") {
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
            invite.email !== principal.email ||
            invite.state !== "pending" ||
            invite.expiresAt <= now
          )
            throw new IdentityError("invalid", "Invitation unavailable.");
          // An active member cannot occupy another adult slot; account joining for
          // nonmembers is handled by the authenticated enrollment boundary.
          throw new IdentityError(
            "conflict",
            "You already belong to this household.",
          );
        }
        if (input.action === "propose-rules") {
          const house = (
            await db.query<{ revision: number }>(
              "SELECT revision FROM household WHERE id=1 FOR UPDATE",
            )
          ).rows[0];
          if (!house || house.revision !== input.expectedRevision)
            throw new IdentityError(
              "conflict",
              "Rules changed. Reload before proposing a revision.",
            );
          await db.query(
            `UPDATE agreement SET state='canceled' WHERE state='pending'`,
          );
          const id = randomUUID();
          await db.query(
            `INSERT INTO agreement (id,revision,text,"proposedBy",state,"expiresAt","createdAt") VALUES($1,$2,$3,$4,'pending',$5,$6)`,
            [
              id,
              house.revision + 1,
              input.text,
              principal.userId,
              new Date(now.getTime() + 86400000),
              now,
            ],
          );
          await db.query("UPDATE household SET revision=revision+1 WHERE id=1");
          return { status: "pending", id };
        }
        const proposal = (
          await db.query<{
            state: string;
            revision: number;
            expiresAt: Date;
            proposedBy: string | null;
          }>("SELECT * FROM agreement WHERE id=$1 FOR UPDATE", [
            input.agreementId,
          ])
        ).rows[0];
        if (
          !proposal ||
          proposal.revision !== input.revision ||
          proposal.state !== "pending" ||
          proposal.expiresAt <= now
        )
          throw new IdentityError(
            "conflict",
            "This agreement is no longer pending. Review the current revision.",
          );
        if (input.action === "cancel-rules") {
          if (proposal.proposedBy !== principal.userId)
            throw new IdentityError(
              "forbidden",
              "Only the proposer can cancel this revision.",
            );
          await db.query("UPDATE agreement SET state='canceled' WHERE id=$1", [
            input.agreementId,
          ]);
          return { status: "committed" };
        }
        const decision =
          input.action === "accept-rules" ? "accepted" : "declined";
        await db.query(
          `INSERT INTO agreement_decision (id,"agreementId","userId",decision,"createdAt") VALUES($1,$2,$3,$4,$5) ON CONFLICT ("agreementId","userId") DO UPDATE SET decision=$4,"createdAt"=$5`,
          [randomUUID(), input.agreementId, principal.userId, decision, now],
        );
        if (decision === "declined")
          await db.query("UPDATE agreement SET state='declined' WHERE id=$1", [
            input.agreementId,
          ]);
        else if (
          (
            await db.query(
              `SELECT m.id FROM membership m JOIN "user" u ON u.id=m."userId" JOIN agreement_decision d ON d."userId"=u.id AND d."agreementId"=$1 AND d.decision='accepted' WHERE m.state='active' AND u."emailVerified"=true`,
              [input.agreementId],
            )
          ).rowCount === 2
        )
          await db.query("UPDATE agreement SET state='accepted' WHERE id=$1", [
            input.agreementId,
          ]);
        return { status: "committed" };
      },
    );
  });
}

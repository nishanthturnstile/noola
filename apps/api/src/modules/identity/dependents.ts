import { randomUUID } from "node:crypto";
import {
  type dependentCommandSchema,
  dependentsSchema,
  settingsValuesSchema,
} from "@noola/contracts/identity";
import type pg from "pg";
import { z } from "zod";
import { canUseDependent, type Principal, requireOwner } from "./policy.js";
import { withReceipt } from "./receipts.js";
import {
  type Connection,
  IdentityError,
  lockHousehold,
  transaction,
} from "./repository.js";
import { assertCurrent } from "./sessions.js";
import { requireSharedUse, sharedUseEligible } from "./shared-policy.js";

type Profile = {
  id: string;
  ownerId: string;
  revision: number;
  displayName: string;
  birthDate: string | null;
};
async function profile(db: Connection, id: string) {
  const value = (
    await db.query<Profile>("SELECT * FROM dependent WHERE id=$1 FOR UPDATE", [
      id,
    ])
  ).rows[0];
  if (!value)
    throw new IdentityError("forbidden", "Dependent profile unavailable.");
  return value;
}
async function acceptedGuardians(db: Connection, id: string) {
  return (
    await db.query<{ userId: string }>(
      `SELECT "userId" FROM guardian WHERE "dependentId"=$1 AND "acceptedAt" IS NOT NULL`,
      [id],
    )
  ).rows.map((g) => g.userId);
}
export async function dependentState(
  db: Connection,
  principal: Principal,
  now: Date,
) {
  const rows = (
    await db.query<Profile>(
      `SELECT DISTINCT d.* FROM dependent d LEFT JOIN guardian g ON g."dependentId"=d.id AND g."userId"=$1 AND g."acceptedAt" IS NOT NULL LEFT JOIN guardian_proposal p ON p."dependentId"=d.id AND p."targetId"=$1 AND p.state='pending' AND p."expiresAt">$2 WHERE d."ownerId"=$1 OR g.id IS NOT NULL OR p.id IS NOT NULL`,
      [principal.userId, now],
    )
  ).rows;
  const shared = await sharedUseEligible(db);
  const output = [];
  for (const d of rows) {
    if (d.ownerId !== principal.userId && !shared) continue;
    const guardians = (
      await db.query<{ userId: string; acceptedAt: Date | null }>(
        `SELECT "userId","acceptedAt" FROM guardian WHERE "dependentId"=$1`,
        [d.id],
      )
    ).rows;
    const canRead = canUseDependent(
      principal,
      d.ownerId,
      guardians.filter((g) => g.acceptedAt).map((g) => g.userId),
      "read",
    );
    const proposals = (
      await db.query<{
        id: string;
        targetId: string;
        action: string;
        revision: number;
        state: string;
        approvals: unknown;
        expiresAt: Date;
      }>(
        `SELECT * FROM guardian_proposal WHERE "dependentId"=$1 AND ("expiresAt">$2 OR "createdAt">$3) ORDER BY "createdAt" DESC`,
        [d.id, now, new Date(now.getTime() - 7 * 86400000)],
      )
    ).rows;
    const corrections = canRead
      ? (
          await db.query<{
            id: string;
            authorId: string;
            text: string;
            state: string;
          }>(
            `SELECT id,"authorId",text,state FROM dependent_correction WHERE "dependentId"=$1 AND ($2="authorId" OR $2=$3) ORDER BY "createdAt" DESC`,
            [d.id, principal.userId, d.ownerId],
          )
        ).rows
      : [];
    output.push({
      ...d,
      birthDate: canRead ? d.birthDate : null,
      canEdit: d.ownerId === principal.userId,
      guardians: guardians.map((g) => ({
        userId: g.userId,
        accepted: !!g.acceptedAt,
      })),
      proposals: proposals
        .filter((p) => canRead || p.targetId === principal.userId)
        .map((p) => ({
          ...p,
          state:
            p.state === "pending" && p.expiresAt <= now ? "expired" : p.state,
          expiresAt: p.expiresAt.toISOString(),
        })),
      corrections,
    });
  }
  return dependentsSchema.parse(output);
}
export async function changeDependent(
  pool: pg.Pool,
  principal: Principal,
  input: z.infer<typeof dependentCommandSchema>,
  now: Date,
) {
  return transaction(pool, async (db) => {
    await lockHousehold(db);
    await assertCurrent(db, principal, now);
    const work = async () => {
      if (input.action === "create") {
        requireOwner(principal);
        const settings = (
          await db.query<{ values: unknown }>(
            `SELECT values FROM personal_settings WHERE "userId"=$1`,
            [principal.userId],
          )
        ).rows[0];
        if (!settings || !settingsValuesSchema.parse(settings.values).completed)
          throw new IdentityError(
            "forbidden",
            "Complete basic account setup before creating a dependent profile.",
          );
        if ((await db.query("SELECT id FROM dependent")).rowCount)
          throw new IdentityError(
            "conflict",
            "The dependent profile already exists.",
          );
        if (input.birthDate && Date.parse(input.birthDate) > now.getTime())
          throw new IdentityError("invalid", "Birth date must be in the past.");
        const id = randomUUID();
        await db.query(
          `INSERT INTO dependent (id,"ownerId",revision,"displayName","birthDate","createdAt") VALUES($1,$2,1,$3,$4,$5)`,
          [id, principal.userId, input.displayName, input.birthDate, now],
        );
        return { status: "committed" as const, id };
      }
      if (input.action === "decide-guardian") {
        const p = (
          await db.query<{
            dependentId: string;
            targetId: string;
            action: "add" | "remove";
            revision: number;
            state: string;
            approvals: unknown;
            expiresAt: Date;
          }>("SELECT * FROM guardian_proposal WHERE id=$1 FOR UPDATE", [
            input.proposalId,
          ])
        ).rows[0];
        if (!p)
          throw new IdentityError(
            "forbidden",
            "Guardian proposal unavailable.",
          );
        const d = await profile(db, p.dependentId);
        if (p.targetId !== d.ownerId || principal.userId !== d.ownerId)
          await requireSharedUse(db);
        const guardians = await acceptedGuardians(db, d.id);
        const required = [...new Set([d.ownerId, ...guardians, p.targetId])];
        if (!required.includes(principal.userId))
          throw new IdentityError(
            "forbidden",
            "Guardian proposal unavailable.",
          );
        if (
          p.state !== "pending" ||
          p.expiresAt <= now ||
          p.revision !== input.revision ||
          d.revision !== p.revision
        )
          throw new IdentityError(
            "conflict",
            "This proposal expired or changed. Review a new proposal.",
          );
        if (!input.accept) {
          await db.query(
            "UPDATE guardian_proposal SET state='declined' WHERE id=$1",
            [input.proposalId],
          );
          return { status: "committed" as const };
        }
        const approvals = [
          ...new Set([
            ...z.array(z.string()).parse(p.approvals),
            principal.userId,
          ]),
        ];
        await db.query(
          "UPDATE guardian_proposal SET approvals=$2 WHERE id=$1",
          [input.proposalId, JSON.stringify(approvals)],
        );
        if (required.every((id) => approvals.includes(id))) {
          if (p.action === "add")
            await db.query(
              `INSERT INTO guardian (id,"dependentId","userId","acceptedAt") VALUES($1,$2,$3,$4) ON CONFLICT ("dependentId","userId") DO UPDATE SET "acceptedAt"=$4`,
              [randomUUID(), d.id, p.targetId, now],
            );
          else
            await db.query(
              `DELETE FROM guardian WHERE "dependentId"=$1 AND "userId"=$2`,
              [d.id, p.targetId],
            );
          await db.query(
            "UPDATE dependent SET revision=revision+1 WHERE id=$1",
            [d.id],
          );
          await db.query(
            "UPDATE guardian_proposal SET state='accepted' WHERE id=$1",
            [input.proposalId],
          );
          await db.query(
            "UPDATE guardian_proposal SET state='expired' WHERE \"dependentId\"=$1 AND state='pending'",
            [d.id],
          );
          return { status: "committed" as const };
        }
        return { status: "pending" as const };
      }
      if (input.action === "review-correction") {
        const c = (
          await db.query<{ dependentId: string }>(
            `SELECT "dependentId" FROM dependent_correction WHERE id=$1`,
            [input.correctionId],
          )
        ).rows[0];
        if (
          !c ||
          (await profile(db, c.dependentId)).ownerId !== principal.userId
        )
          throw new IdentityError("forbidden", "Correction unavailable.");
        await db.query("UPDATE dependent_correction SET state=$2 WHERE id=$1", [
          input.correctionId,
          input.decision,
        ]);
        return { status: "committed" as const };
      }
      const d = await profile(db, input.dependentId);
      if (
        (d.ownerId !== principal.userId && input.action !== "relinquish") ||
        (input.action === "propose-guardian" &&
          input.targetId !== principal.userId)
      )
        await requireSharedUse(db);
      const guardians = await acceptedGuardians(db, d.id);
      if (input.action === "update") {
        if (d.ownerId !== principal.userId)
          throw new IdentityError(
            "forbidden",
            "Only the dependent owner can edit this profile.",
          );
        if (d.revision !== input.expectedRevision)
          throw new IdentityError(
            "conflict",
            "The profile changed. Reload before saving.",
          );
        if (input.birthDate && Date.parse(input.birthDate) > now.getTime())
          throw new IdentityError("invalid", "Birth date must be in the past.");
        await db.query(
          `UPDATE dependent SET "displayName"=$2,"birthDate"=$3,revision=revision+1 WHERE id=$1`,
          [d.id, input.displayName, input.birthDate],
        );
        await db.query(
          "UPDATE guardian_proposal SET state='expired' WHERE \"dependentId\"=$1 AND state='pending'",
          [d.id],
        );
        return { status: "committed" as const };
      }
      if (input.action === "relinquish") {
        if (!guardians.includes(principal.userId))
          throw new IdentityError(
            "forbidden",
            "There is no accepted guardian role to relinquish.",
          );
        await db.query(
          `DELETE FROM guardian WHERE "dependentId"=$1 AND "userId"=$2`,
          [d.id, principal.userId],
        );
        await db.query("UPDATE dependent SET revision=revision+1 WHERE id=$1", [
          d.id,
        ]);
        await db.query(
          "UPDATE guardian_proposal SET state='expired' WHERE \"dependentId\"=$1 AND state='pending'",
          [d.id],
        );
        return { status: "committed" as const };
      }
      if (input.action === "request-correction") {
        if (!canUseDependent(principal, d.ownerId, guardians, "read"))
          throw new IdentityError(
            "forbidden",
            "Dependent profile unavailable.",
          );
        const id = randomUUID();
        await db.query(
          `INSERT INTO dependent_correction (id,"dependentId","authorId",text,state,"createdAt") VALUES($1,$2,$3,$4,'pending',$5)`,
          [id, d.id, principal.userId, input.text, now],
        );
        return { status: "pending" as const, id };
      }
      if (
        d.ownerId !== principal.userId &&
        !guardians.includes(principal.userId)
      )
        throw new IdentityError("forbidden", "Dependent profile unavailable.");
      if (d.revision !== input.expectedRevision)
        throw new IdentityError(
          "conflict",
          "Profile changed. Reload before proposing.",
        );
      if (
        !(
          await db.query(
            "SELECT id FROM membership WHERE \"userId\"=$1 AND state='active'",
            [input.targetId],
          )
        ).rowCount
      )
        throw new IdentityError("forbidden", "Guardian candidate unavailable.");
      if (
        (input.change === "add" && guardians.includes(input.targetId)) ||
        (input.change === "remove" && !guardians.includes(input.targetId))
      )
        throw new IdentityError(
          "conflict",
          "Guardian status has already changed.",
        );
      if (
        (
          await db.query(
            'SELECT id FROM guardian_proposal WHERE "dependentId"=$1 AND state=\'pending\' AND "expiresAt">$2',
            [d.id, now],
          )
        ).rowCount
      )
        throw new IdentityError(
          "conflict",
          "Review the pending guardian proposal first.",
        );
      const id = randomUUID();
      await db.query(
        `INSERT INTO guardian_proposal (id,"dependentId","targetId",action,revision,state,approvals,"expiresAt","createdAt") VALUES($1,$2,$3,$4,$5,'pending','[]',$6,$7)`,
        [
          id,
          d.id,
          input.targetId,
          input.change,
          d.revision,
          new Date(now.getTime() + 86400000),
          now,
        ],
      );
      return { status: "pending" as const, id };
    };
    return "requestId" in input
      ? withReceipt(db, principal.userId, "dependent", input, now, work)
      : work();
  });
}

import { randomUUID } from "node:crypto";
import {
  type aliasCommandSchema,
  aliasesSchema,
} from "@noola/contracts/identity";
import type pg from "pg";
import type { z } from "zod";
import type { Principal } from "./policy.js";
import { withReceipt } from "./receipts.js";
import {
  type Connection,
  IdentityError,
  lockHousehold,
  transaction,
} from "./repository.js";
import { assertCurrent } from "./sessions.js";
export async function ownAliases(db: Connection, p: Principal) {
  return aliasesSchema.parse(
    (
      await db.query(
        `SELECT id,phrase,"targetType","targetId",name FROM relationship_alias WHERE "userId"=$1 ORDER BY phrase`,
        [p.userId],
      )
    ).rows,
  );
}
async function permitted(
  db: Connection,
  p: Principal,
  type: string,
  id: string | null,
) {
  if (type === "person") return true;
  if (!id) return false;
  return type === "adult"
    ? !!(
        await db.query(
          `SELECT id FROM membership WHERE "userId"=$1 AND state='active'`,
          [id],
        )
      ).rowCount
    : !!(
        await db.query(
          `SELECT d.id FROM dependent d LEFT JOIN guardian g ON g."dependentId"=d.id AND g."userId"=$2 AND g."acceptedAt" IS NOT NULL WHERE d.id=$1 AND (d."ownerId"=$2 OR g.id IS NOT NULL)`,
          [id, p.userId],
        )
      ).rowCount;
}
export async function changeAlias(
  pool: pg.Pool,
  p: Principal,
  input: z.infer<typeof aliasCommandSchema>,
  now: Date,
) {
  return transaction(pool, async (db) => {
    await lockHousehold(db);
    await assertCurrent(db, p, now);
    if (input.action === "delete") {
      const result = await db.query(
        `DELETE FROM relationship_alias WHERE id=$1 AND "userId"=$2`,
        [input.aliasId, p.userId],
      );
      if (!result.rowCount)
        throw new IdentityError("forbidden", "Alias unavailable.");
      return { status: "committed" as const };
    }
    if (input.action === "save")
      return withReceipt(db, p.userId, "alias", input, now, async () => {
        if (!(await permitted(db, p, input.targetType, input.targetId ?? null)))
          throw new IdentityError("forbidden", "Alias target unavailable.");
        if (input.targetType !== "person" && !input.targetId)
          throw new IdentityError("invalid", "Choose a confirmed person.");
        const id = randomUUID();
        await db.query(
          `INSERT INTO relationship_alias (id,"userId",phrase,"targetType","targetId",name,"createdAt") VALUES($1,$2,$3,$4,$5,$6,$7)`,
          [
            id,
            p.userId,
            input.phrase.toLocaleLowerCase("en"),
            input.targetType,
            input.targetType === "person" ? null : input.targetId,
            input.name,
            now,
          ],
        );
        return { status: "committed" as const, id };
      });
    const aliases = await ownAliases(db, p);
    const candidates: Array<{
      id: string;
      name: string;
      type: "adult" | "dependent" | "person";
    }> = [];
    for (const a of aliases.filter(
      (a) =>
        a.phrase.toLocaleLowerCase("en") ===
        input.phrase.toLocaleLowerCase("en"),
    ))
      if (await permitted(db, p, a.targetType, a.targetId))
        candidates.push({
          id: a.targetId ?? a.id,
          name: a.name,
          type: a.targetType,
        });
    const unique = candidates.filter(
      (a, index) =>
        candidates.findIndex((b) => a.id === b.id && a.type === b.type) ===
        index,
    );
    return {
      status:
        unique.length === 0
          ? ("unresolved" as const)
          : unique.length === 1
            ? ("resolved" as const)
            : ("clarification" as const),
      candidates: unique,
    };
  });
}

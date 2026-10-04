import type pg from "pg";
import { transaction } from "../modules/identity/repository.js";
export async function cleanupIdentity(pool: pg.Pool, now: Date) {
  await transaction(pool, async (db) => {
    await db.query(
      `UPDATE agreement SET state='expired' WHERE state='pending' AND "expiresAt"<=$1`,
      [now],
    );
    await db.query(
      `UPDATE guardian_proposal SET state='expired' WHERE state='pending' AND "expiresAt"<=$1`,
      [now],
    );
    const cutoff = new Date(now.getTime() - 7 * 86400000);
    await db.query(
      `DELETE FROM agreement WHERE state IN ('expired','declined','canceled') AND "expiresAt"<$1`,
      [cutoff],
    );
    await db.query(
      `DELETE FROM guardian_proposal WHERE state IN ('expired','declined') AND "expiresAt"<$1`,
      [cutoff],
    );
    await db.query(`DELETE FROM application_rate WHERE "expiresAt"<$1`, [
      cutoff,
    ]);
    await db.query(`DELETE FROM verification WHERE "expiresAt"<$1`, [now]);
  });
}

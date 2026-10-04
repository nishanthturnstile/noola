import { open, readFile } from "node:fs/promises";
import type pg from "pg";
import { z } from "zod";

const tombstone = z.strictObject({ id: z.string().min(1) });
export const snapshotSchema = z.array(
  z.strictObject({ id: z.string(), ownerId: z.string(), text: z.string() }),
);
export function createJournal(path: string) {
  return {
    async append(id: string) {
      const file = await open(path, "a", 0o600);
      try {
        await file.writeFile(`${JSON.stringify({ id })}\n`);
        await file.sync();
      } finally {
        await file.close();
      }
    },
    async restore(pool: pg.Pool, input: unknown) {
      // Validate the complete current journal before replacing any data. No empty fallback.
      const journal = await readFile(path, "utf8");
      const deleted = new Set(
        journal
          .split("\n")
          .filter(Boolean)
          .map((line) => tombstone.parse(JSON.parse(line)).id),
      );
      const snapshot = snapshotSchema.parse(input);
      const tx = await pool.connect();
      try {
        await tx.query("BEGIN");
        await tx.query("DELETE FROM record");
        for (const row of snapshot) {
          if (!deleted.has(row.id))
            await tx.query(
              'INSERT INTO record (id, "ownerId", text) VALUES ($1, $2, $3)',
              [row.id, row.ownerId, row.text],
            );
        }
        await tx.query("COMMIT");
      } catch (error) {
        await tx.query("ROLLBACK");
        throw error;
      } finally {
        tx.release();
      }
    },
  };
}

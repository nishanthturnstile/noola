import type pg from "pg";
import { type EmailKind, unseal } from "../adapters/email/ledger.js";
import type { mailpitTransport } from "../adapters/email/mailpit.js";
import type { Config } from "../config.js";
import { transaction } from "../modules/identity/repository.js";
export function createEmailWorker(
  pool: pg.Pool,
  config: Config,
  transport: ReturnType<typeof mailpitTransport>,
  clock = () => new Date(),
) {
  let busy = false;
  return {
    async tick() {
      if (busy) return;
      busy = true;
      try {
        await pool.query(
          `UPDATE email_event SET payload=NULL,state=CASE WHEN state IN ('queued','sending') THEN 'failed' ELSE state END WHERE "expiresAt" <= $1 AND payload IS NOT NULL`,
          [clock()],
        );
        await pool.query(
          `UPDATE email_event SET state='outcome-unknown',"updatedAt"=$1 WHERE state='sending' AND "updatedAt" < $2`,
          [clock(), new Date(clock().getTime() - 10000)],
        );
        const uncertain = await pool.query<{ id: string }>(
          `SELECT id FROM email_event WHERE state='outcome-unknown' AND payload IS NOT NULL ORDER BY "updatedAt" LIMIT 1`,
        );
        if (uncertain.rows[0]) {
          const id = uncertain.rows[0].id;
          if (await transport.reconcile(id))
            await pool.query(
              `UPDATE email_event SET state='transport-accepted',payload=NULL,"updatedAt"=$2 WHERE id=$1 AND state='outcome-unknown'`,
              [id, clock()],
            );
          else
            await pool.query(
              `UPDATE email_event SET "updatedAt"=$2 WHERE id=$1`,
              [id, clock()],
            );
        }
        const event = await transaction(pool, async (db) => {
          const result = await db.query<{
            id: string;
            kind: EmailKind;
            payload: string;
          }>(
            `SELECT id,kind,payload FROM email_event WHERE state='queued' AND payload IS NOT NULL AND "expiresAt">$1 ORDER BY "createdAt" FOR UPDATE SKIP LOCKED LIMIT 1`,
            [clock()],
          );
          const value = result.rows[0];
          if (value)
            await db.query(
              `UPDATE email_event SET state='sending',attempts=attempts+1,"updatedAt"=$2 WHERE id=$1`,
              [value.id, clock()],
            );
          return value;
        });
        if (event) {
          const state = await transport.send(
            event.id,
            event.kind,
            unseal(event.payload, config.AUTH_SECRET),
          );
          await pool.query(
            `UPDATE email_event SET state=$2,payload=CASE WHEN $2='transport-accepted' THEN NULL ELSE payload END,"updatedAt"=$3 WHERE id=$1 AND state='sending'`,
            [event.id, state, clock()],
          );
        }
      } finally {
        busy = false;
      }
    },
  };
}

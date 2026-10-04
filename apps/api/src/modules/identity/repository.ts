import type pg from "pg";
export type Connection = Pick<pg.PoolClient, "query">;
export async function transaction<T>(
  pool: pg.Pool,
  work: (client: pg.PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const value = await work(client);
    await client.query("COMMIT");
    return value;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
export async function lockHousehold(db: Connection) {
  await db.query("SELECT pg_advisory_xact_lock(721833,2)");
}
export class IdentityError extends Error {
  constructor(
    public readonly code:
      | "unauthorized"
      | "locked"
      | "forbidden"
      | "conflict"
      | "invalid"
      | "rate_limited",
    message: string,
  ) {
    super(message);
  }
}
export async function rateLimit(
  db: Connection,
  key: string,
  max: number,
  windowMs: number,
  now: Date,
) {
  const result = await db.query<{ count: number }>(
    `INSERT INTO application_rate (key,count,"expiresAt") VALUES ($1,1,$2)
 ON CONFLICT (key) DO UPDATE SET count=CASE WHEN application_rate."expiresAt" <= $3 THEN 1 ELSE application_rate.count+1 END,
 "expiresAt"=CASE WHEN application_rate."expiresAt" <= $3 THEN $2 ELSE application_rate."expiresAt" END RETURNING count`,
    [key, new Date(now.getTime() + windowMs), now],
  );
  if ((result.rows[0]?.count ?? max + 1) > max)
    throw new IdentityError("rate_limited", "Please wait before trying again.");
}

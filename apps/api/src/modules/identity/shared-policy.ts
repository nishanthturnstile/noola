import { type Connection, IdentityError } from "./repository.js";
export async function sharedUseEligible(db: Connection) {
  const result = await db.query<{ eligible: boolean }>(
    `SELECT (SELECT count(*) FROM membership WHERE state='active')=2 AND EXISTS (SELECT 1 FROM agreement a WHERE a.state='accepted' AND (SELECT count(*) FROM agreement_decision d JOIN membership m ON m."userId"=d."userId" AND m.state='active' WHERE d."agreementId"=a.id AND d.decision='accepted')=2) AS eligible`,
  );
  return result.rows[0]?.eligible ?? false;
}
export async function requireSharedUse(db: Connection) {
  if (!(await sharedUseEligible(db)))
    throw new IdentityError(
      "forbidden",
      "Both adults must accept the required household rules before cross-member use.",
    );
}

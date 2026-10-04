import { createHash } from "node:crypto";
import { resultSchema } from "@noola/contracts/identity";
import type { z } from "zod";
import { type Connection, IdentityError } from "./repository.js";

type Result = z.infer<typeof resultSchema>;
export async function withReceipt(
  db: Connection,
  actorId: string,
  operation: string,
  input: { requestId: string },
  now: Date,
  work: () => Promise<Result>,
): Promise<Result> {
  const fingerprint = createHash("sha256")
    .update(JSON.stringify(input))
    .digest("hex");
  const receipt = (
    await db.query<{
      actorId: string;
      operation: string;
      fingerprint: string;
      response: unknown;
    }>(`SELECT * FROM request_receipt WHERE id=$1`, [input.requestId])
  ).rows[0];
  if (receipt) {
    if (
      receipt.actorId !== actorId ||
      receipt.operation !== operation ||
      receipt.fingerprint !== fingerprint
    )
      throw new IdentityError(
        "conflict",
        "Request identity was already used for a different operation.",
      );
    return resultSchema.parse(receipt.response);
  }
  const response = await work();
  await db.query(
    `INSERT INTO request_receipt (id,"actorId",operation,fingerprint,response,"createdAt") VALUES($1,$2,$3,$4,$5,$6)`,
    [
      input.requestId,
      actorId,
      operation,
      fingerprint,
      JSON.stringify(response),
      now,
    ],
  );
  return response;
}

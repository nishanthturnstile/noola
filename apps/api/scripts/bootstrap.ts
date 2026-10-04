import { emailSchema } from "@noola/contracts/identity";
import { readConfig } from "../src/config.js";
import { createDatabase } from "../src/db/pool.js";
import {
  bootstrap,
  resendOwnerInvitation,
} from "../src/modules/identity/enrollment.js";

const config = readConfig(process.env);
const email = emailSchema.parse(process.argv[2]);
const database = createDatabase(config.DATABASE_URL);
try {
  const resend = process.argv[3] === "--resend";
  if (process.argv[3] && !resend)
    throw new Error("Only --resend is supported after the owner email.");
  await (resend
    ? resendOwnerInvitation(database.pool, config, email)
    : bootstrap(database.pool, config, email));
  console.info(
    "Owner enrollment invitation queued; inspect private Mailpit capture. Existing credentials were preserved.",
  );
} finally {
  await database.pool.end();
}

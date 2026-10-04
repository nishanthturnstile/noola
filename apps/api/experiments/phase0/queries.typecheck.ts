// Compile-only regression cases: skipLibCheck must not erase our query checks.
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { record } from "./schema.js";

declare const db: NodePgDatabase;
db.select({ id: record.id, text: record.text }).from(record);
db.insert(record).values({
  id: "synthetic",
  ownerId: "adult-a",
  text: "valid",
});

// @ts-expect-error An unknown column must remain a compile error.
db.select({ invalid: record.unknownColumn }).from(record);
// @ts-expect-error PostgreSQL text values must remain strings.
db.insert(record).values({ id: "synthetic", ownerId: "adult-a", text: 42 });
// @ts-expect-error An insert must supply the required owner.
db.insert(record).values({ id: "synthetic", text: "missing owner" });

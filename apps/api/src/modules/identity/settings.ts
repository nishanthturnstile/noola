import {
  meSchema,
  preferenceSchema,
  type settingsCommandSchema,
  settingsValuesSchema,
} from "@noola/contracts/identity";
import type pg from "pg";
import type { z } from "zod";
import { disclosure, type Principal } from "./policy.js";
import { type Connection, IdentityError, transaction } from "./repository.js";
import { assertCurrent } from "./sessions.js";
export async function currentAdult(db: Connection, principal: Principal) {
  const row = (
    await db.query<{ revision: number; values: unknown }>(
      `SELECT revision,values FROM personal_settings WHERE "userId"=$1`,
      [principal.userId],
    )
  ).rows[0];
  if (!row)
    throw new IdentityError("unauthorized", "Account setup unavailable.");
  return meSchema.parse({
    id: principal.userId,
    name: principal.name,
    email: principal.email,
    role: principal.role,
    membershipId: principal.membershipId,
    settings: row,
    device: {
      id: principal.deviceId,
      mode: principal.mode,
      label: principal.label,
      current: true,
      lastActivity: principal.lastActivity.toISOString(),
      locked: false,
    },
    disclosure,
    ai: "unavailable",
    push: "off",
  });
}
export async function updateSettings(
  pool: pg.Pool,
  principal: Principal,
  input: z.infer<typeof settingsCommandSchema>,
  now: Date,
) {
  return transaction(pool, async (db) => {
    await assertCurrent(db, principal, now);
    const row = (
      await db.query<{ revision: number; values: unknown }>(
        `SELECT revision,values FROM personal_settings WHERE "userId"=$1 FOR UPDATE`,
        [principal.userId],
      )
    ).rows[0];
    if (!row || row.revision !== input.expectedRevision)
      throw new IdentityError(
        "conflict",
        "Settings changed. Reload and review them again.",
      );
    const previous = settingsValuesSchema.parse(row.values);
    const allowed =
      input.step === "identity"
        ? { language: input.preferences.language }
        : input.step === "presentation"
          ? {
              tone: input.preferences.tone,
              units: input.preferences.units,
              currency: input.preferences.currency,
              dateFormat: input.preferences.dateFormat,
              timeZone: input.preferences.timeZone,
            }
          : input.step === "preferences"
            ? {
                retention: input.preferences.retention,
                notifications: input.preferences.notifications,
                quietHours: input.preferences.quietHours,
              }
            : {};
    const values = settingsValuesSchema.parse({
      ...previous,
      ...Object.fromEntries(
        Object.entries(allowed).filter(([, value]) => value !== undefined),
      ),
      ...(input.step === "disclosure" && input.acceptDisclosure
        ? { disclosureRevision: disclosure.revision }
        : {}),
    });
    if (input.step === "identity" && (!input.name || !values.language))
      throw new IdentityError(
        "invalid",
        "Choose your name and interaction language.",
      );
    if (input.step === "disclosure" && !input.acceptDisclosure)
      throw new IdentityError(
        "invalid",
        "Review the operator disclosure before continuing.",
      );
    values.completed =
      preferenceSchema.safeParse(values).success &&
      values.disclosureRevision === disclosure.revision;
    if (input.step === "identity")
      await db.query(`UPDATE "user" SET name=$2,"updatedAt"=$3 WHERE id=$1`, [
        principal.userId,
        input.name,
        now,
      ]);
    await db.query(
      `UPDATE personal_settings SET values=$2,revision=revision+1,"updatedAt"=$3 WHERE "userId"=$1`,
      [principal.userId, JSON.stringify(values), now],
    );
    return { status: "committed" as const };
  });
}

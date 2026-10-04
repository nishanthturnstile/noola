import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  check,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

const dates = () => ({
  createdAt: timestamp({ withTimezone: true }).notNull(),
  updatedAt: timestamp({ withTimezone: true }).notNull(),
});
export const user = pgTable("user", {
  id: text().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean().notNull(),
  image: text(),
  ...dates(),
});
export const session = pgTable("session", {
  id: text().primaryKey(),
  token: text().notNull().unique(),
  expiresAt: timestamp({ withTimezone: true }).notNull(),
  ipAddress: text(),
  userAgent: text(),
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  ...dates(),
});
export const account = pgTable("account", {
  id: text().primaryKey(),
  accountId: text().notNull(),
  providerId: text().notNull(),
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text(),
  refreshToken: text(),
  idToken: text(),
  scope: text(),
  password: text(),
  accessTokenExpiresAt: timestamp({ withTimezone: true }),
  refreshTokenExpiresAt: timestamp({ withTimezone: true }),
  ...dates(),
});
export const verification = pgTable("verification", {
  id: text().primaryKey(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp({ withTimezone: true }).notNull(),
  ...dates(),
});
export const rateLimit = pgTable("rateLimit", {
  id: text().primaryKey(),
  key: text().notNull().unique(),
  count: integer().notNull(),
  lastRequest: bigint({ mode: "number" }).notNull(),
});
export const household = pgTable(
  "household",
  { id: integer().primaryKey(), revision: integer().notNull().default(1) },
  (t) => [check("single_household", sql`${t.id} = 1`)],
);
export const membership = pgTable(
  "membership",
  {
    id: text().primaryKey(),
    householdId: integer()
      .notNull()
      .references(() => household.id),
    slot: integer().notNull(),
    userId: text()
      .unique()
      .references(() => user.id),
    role: text().notNull(),
    email: text().notNull().unique(),
    state: text().notNull(),
    ...dates(),
  },
  (t) => [
    unique("adult_slot").on(t.householdId, t.slot),
    check("two_adult_slots", sql`${t.slot} IN (1,2)`),
    check(
      "owner_slot",
      sql`(${t.slot}=1 AND ${t.role}='owner') OR (${t.slot}=2 AND ${t.role}='adult')`,
    ),
    check(
      "membership_account_state",
      sql`(${t.state}='invited' AND ${t.userId} IS NULL) OR (${t.state} IN ('verification','active') AND ${t.userId} IS NOT NULL)`,
    ),
    check(
      "membership_state",
      sql`${t.state} IN ('invited','verification','active')`,
    ),
  ],
);
export const invitation = pgTable(
  "invitation",
  {
    id: text().primaryKey(),
    membershipId: text()
      .notNull()
      .references(() => membership.id, { onDelete: "cascade" }),
    digest: text().notNull().unique(),
    expiresAt: timestamp({ withTimezone: true }).notNull(),
    state: text().notNull(),
    requestId: text().notNull().unique(),
    emailEventId: text().references(() => emailEvent.id),
    ...dates(),
  },
  (t) => [
    check(
      "invitation_state",
      sql`${t.state} IN ('pending','consumed','canceled')`,
    ),
  ],
);
export const settings = pgTable("personal_settings", {
  userId: text()
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  revision: integer().notNull().default(1),
  values: jsonb().notNull().default({}),
  ...dates(),
});
export const agreement = pgTable("agreement", {
  id: text().primaryKey(),
  revision: integer().notNull().unique(),
  text: text().notNull(),
  proposedBy: text().references(() => user.id),
  state: text().notNull(),
  expiresAt: timestamp({ withTimezone: true }).notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull(),
});
export const agreementDecision = pgTable(
  "agreement_decision",
  {
    id: text().primaryKey(),
    agreementId: text()
      .notNull()
      .references(() => agreement.id, { onDelete: "cascade" }),
    userId: text()
      .notNull()
      .references(() => user.id),
    decision: text().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull(),
  },
  (t) => [unique("independent_decision").on(t.agreementId, t.userId)],
);
export const sessionPolicy = pgTable(
  "session_policy",
  {
    id: text().primaryKey(),
    sessionId: text()
      .notNull()
      .unique()
      .references(() => session.id, { onDelete: "cascade" }),
    userId: text()
      .notNull()
      .references(() => user.id),
    mode: text().notNull().default("shared"),
    label: text().notNull().default("This device"),
    lastActivity: timestamp({ withTimezone: true }).notNull(),
    lockedAt: timestamp({ withTimezone: true }),
    createdAt: timestamp({ withTimezone: true }).notNull(),
  },
  (t) => [check("device_mode", sql`${t.mode} IN ('shared','personal')`)],
);
export const dependent = pgTable("dependent", {
  id: text().primaryKey(),
  ownerId: text()
    .notNull()
    .unique()
    .references(() => user.id),
  revision: integer().notNull().default(1),
  displayName: text().notNull(),
  birthDate: text(),
  createdAt: timestamp({ withTimezone: true }).notNull(),
});
export const guardian = pgTable(
  "guardian",
  {
    id: text().primaryKey(),
    dependentId: text()
      .notNull()
      .references(() => dependent.id, { onDelete: "cascade" }),
    userId: text()
      .notNull()
      .references(() => user.id),
    acceptedAt: timestamp({ withTimezone: true }),
  },
  (t) => [unique("guardian_identity").on(t.dependentId, t.userId)],
);
export const guardianProposal = pgTable("guardian_proposal", {
  id: text().primaryKey(),
  dependentId: text()
    .notNull()
    .references(() => dependent.id, { onDelete: "cascade" }),
  targetId: text()
    .notNull()
    .references(() => user.id),
  action: text().notNull(),
  revision: integer().notNull(),
  state: text().notNull(),
  approvals: jsonb().notNull().default([]),
  expiresAt: timestamp({ withTimezone: true }).notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull(),
});
export const correction = pgTable("dependent_correction", {
  id: text().primaryKey(),
  dependentId: text()
    .notNull()
    .references(() => dependent.id, { onDelete: "cascade" }),
  authorId: text()
    .notNull()
    .references(() => user.id),
  text: text().notNull(),
  state: text().notNull().default("pending"),
  createdAt: timestamp({ withTimezone: true }).notNull(),
});
export const alias = pgTable("relationship_alias", {
  id: text().primaryKey(),
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  phrase: text().notNull(),
  targetType: text().notNull(),
  targetId: text(),
  name: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull(),
});
export const emailEvent = pgTable("email_event", {
  id: text().primaryKey(),
  kind: text().notNull(),
  state: text().notNull(),
  payload: text(),
  expiresAt: timestamp({ withTimezone: true }).notNull(),
  updatedAt: timestamp({ withTimezone: true }).notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull(),
  attempts: integer().notNull().default(0),
});
export const securityEvent = pgTable("security_event", {
  id: text().primaryKey(),
  userId: text(),
  kind: text().notNull(),
  sessionId: text(),
  createdAt: timestamp({ withTimezone: true }).notNull(),
});
export const requestReceipt = pgTable("request_receipt", {
  id: text().primaryKey(),
  actorId: text().notNull(),
  operation: text().notNull(),
  fingerprint: text().notNull(),
  response: jsonb().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull(),
});
export const applicationRate = pgTable("application_rate", {
  key: text().primaryKey(),
  count: integer().notNull(),
  expiresAt: timestamp({ withTimezone: true }).notNull(),
});

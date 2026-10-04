import { z } from "zod";
export const emailSchema = z
  .email()
  .max(254)
  .transform((value) => value.trim().toLowerCase());
export const passwordSchema = z
  .string()
  .min(12, "Use at least 12 characters.")
  .max(128);
export const nameSchema = z.string().trim().min(1).max(80);
const id = z.string().min(1).max(100);
const requestId = z.uuid();
export const enrollmentSchema = z.object({
  requestId,
  token: z.string().min(32).max(200),
  email: emailSchema,
  name: nameSchema,
  password: passwordSchema,
});
export const presentationSchema = z.object({
  language: z.enum(["English", "Tamil", "Tamil and English"]),
  tone: z.enum(["concise", "detailed"]),
  units: z.enum(["metric", "imperial"]),
  currency: z.enum(["INR", "USD", "EUR"]),
  dateFormat: z.enum(["DD MMM YYYY", "YYYY-MM-DD"]),
  timeZone: z.enum([
    "Asia/Kolkata",
    "UTC",
    "Europe/London",
    "America/New_York",
  ]),
});
export const preferenceSchema = presentationSchema.extend({
  retention: z.enum(["temporary", "30-days", "180-days", "until-deleted"]),
  notifications: z.boolean(),
  quietHours: z.boolean(),
});
export type Preferences = z.infer<typeof preferenceSchema>;
export const settingsValuesSchema = preferenceSchema.partial().extend({
  disclosureRevision: z.string().optional(),
  completed: z.boolean().optional(),
});
export const settingsCommandSchema = z.object({
  expectedRevision: z.number().int().positive(),
  step: z.enum(["identity", "presentation", "disclosure", "preferences"]),
  name: nameSchema.optional(),
  preferences: preferenceSchema.partial(),
  acceptDisclosure: z.boolean().optional(),
});
export const householdCommandSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("invite"), requestId, email: emailSchema }),
  z.object({ action: z.literal("resend"), requestId, invitationId: id }),
  z.object({ action: z.literal("cancel"), requestId, invitationId: id }),
  z.object({
    action: z.literal("join"),
    requestId,
    token: z.string().min(32).max(200),
  }),
  z.object({
    action: z.literal("propose-rules"),
    requestId,
    expectedRevision: z.number().int().positive(),
    text: z.string().trim().min(10).max(4000),
  }),
  z.object({
    action: z.enum(["accept-rules", "decline-rules", "cancel-rules"]),
    requestId,
    agreementId: id,
    revision: z.number().int().positive(),
  }),
]);
export const deviceCommandSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("background") }),
  z.object({
    action: z.literal("update"),
    deviceId: id,
    mode: z.enum(["shared", "personal"]),
    label: nameSchema,
  }),
  z.object({
    action: z.enum(["revoke", "revoke-others"]),
    requestId,
    deviceId: id.optional(),
  }),
  z.object({ action: z.enum(["activity", "lock"]) }),
]);
const birthDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine(
    (value) =>
      !Number.isNaN(Date.parse(value)) &&
      new Date(value).toISOString().slice(0, 10) === value,
    "Use a valid date.",
  )
  .nullable();
export const dependentCommandSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("create"),
    requestId,
    displayName: nameSchema,
    birthDate,
  }),
  z.object({
    action: z.literal("update"),
    dependentId: id,
    expectedRevision: z.number().int().positive(),
    displayName: nameSchema,
    birthDate,
  }),
  z.object({
    action: z.literal("propose-guardian"),
    requestId,
    dependentId: id,
    expectedRevision: z.number().int().positive(),
    targetId: id,
    change: z.enum(["add", "remove"]),
  }),
  z.object({
    action: z.literal("decide-guardian"),
    requestId,
    proposalId: id,
    revision: z.number().int().positive(),
    accept: z.boolean(),
  }),
  z.object({ action: z.literal("relinquish"), requestId, dependentId: id }),
  z.object({
    action: z.literal("request-correction"),
    requestId,
    dependentId: id,
    text: z.string().trim().min(1).max(2000),
  }),
  z.object({
    action: z.literal("review-correction"),
    correctionId: id,
    decision: z.enum(["reviewed", "declined"]),
  }),
]);
export const aliasCommandSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("save"),
    requestId,
    phrase: nameSchema,
    targetType: z.enum(["adult", "dependent", "person"]),
    targetId: id.optional(),
    name: nameSchema,
  }),
  z.object({ action: z.literal("delete"), aliasId: id }),
  z.object({ action: z.literal("resolve"), phrase: nameSchema }),
]);
export const resultSchema = z.object({
  status: z.enum([
    "committed",
    "pending",
    "verification-required",
    "joined",
    "resolved",
    "unresolved",
    "clarification",
  ]),
  id: z.string().optional(),
  emailStatus: z
    .enum(["queued", "transport-accepted", "failed", "outcome-unknown"])
    .optional(),
  candidates: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        type: z.enum(["adult", "dependent", "person"]),
      }),
    )
    .optional(),
});
export const identityErrorSchema = z.object({
  code: z.enum([
    "unauthorized",
    "locked",
    "forbidden",
    "conflict",
    "invalid",
    "rate_limited",
    "unavailable",
  ]),
  message: z.string(),
});
export const deviceSchema = z.object({
  id,
  mode: z.enum(["shared", "personal"]),
  label: z.string(),
  current: z.boolean(),
  lastActivity: z.string(),
  locked: z.boolean(),
});
export const meSchema = z.object({
  id,
  name: z.string(),
  email: z.email(),
  role: z.enum(["owner", "adult"]),
  membershipId: id,
  settings: z.object({ revision: z.number(), values: settingsValuesSchema }),
  device: deviceSchema,
  disclosure: z.object({ revision: z.string(), text: z.string() }),
  ai: z.literal("unavailable"),
  push: z.literal("off"),
});
export type CurrentAdult = z.infer<typeof meSchema>;
export const householdSchema = z.object({
  revision: z.number(),
  sharedUse: z.boolean(),
  members: z.array(
    z.object({ id, name: z.string(), role: z.enum(["owner", "adult"]) }),
  ),
  invitations: z.array(
    z.object({
      id,
      email: z.email(),
      state: z.enum(["pending", "verification", "expired"]),
      expiresAt: z.string(),
      emailStatus: z.string(),
    }),
  ),
  agreements: z.array(
    z.object({
      id,
      revision: z.number(),
      text: z.string(),
      state: z.enum(["pending", "accepted", "declined", "expired", "canceled"]),
      expiresAt: z.string(),
      canCancel: z.boolean(),
      decisions: z.array(
        z.object({ userId: id, decision: z.enum(["accepted", "declined"]) }),
      ),
    }),
  ),
});
export type Household = z.infer<typeof householdSchema>;
export const devicesSchema = z.array(deviceSchema);
export const dependentsSchema = z.array(
  z.object({
    id,
    ownerId: id,
    revision: z.number(),
    displayName: z.string(),
    birthDate: z.string().nullable(),
    canEdit: z.boolean(),
    guardians: z.array(z.object({ userId: id, accepted: z.boolean() })),
    proposals: z.array(
      z.object({
        id,
        targetId: id,
        action: z.enum(["add", "remove"]),
        revision: z.number(),
        state: z.enum(["pending", "accepted", "declined", "expired"]),
        approvals: z.array(id),
        expiresAt: z.string(),
      }),
    ),
    corrections: z.array(
      z.object({
        id,
        authorId: id,
        text: z.string(),
        state: z.enum(["pending", "reviewed", "declined"]),
      }),
    ),
  }),
);
export type Dependent = z.infer<typeof dependentsSchema>[number];
export const aliasesSchema = z.array(
  z.object({
    id,
    phrase: z.string(),
    targetType: z.enum(["adult", "dependent", "person"]),
    targetId: z.string().nullable(),
    name: z.string(),
  }),
);
export const identityEndpoints = {
  join: {
    path: "/api/v1/enrollment/join",
    method: "post",
    input: z.object({ requestId, token: z.string().min(32).max(200) }),
    output: resultSchema,
  },
  enrollment: {
    path: "/api/v1/enrollment",
    method: "post",
    input: enrollmentSchema,
    output: resultSchema,
  },
  me: { path: "/api/v1/me", method: "get", output: meSchema },
  settings: {
    path: "/api/v1/me/settings",
    method: "post",
    input: settingsCommandSchema,
    output: resultSchema,
  },
  household: {
    path: "/api/v1/household",
    method: "get",
    output: householdSchema,
  },
  householdCommand: {
    path: "/api/v1/household",
    method: "post",
    input: householdCommandSchema,
    output: resultSchema,
  },
  devices: { path: "/api/v1/devices", method: "get", output: devicesSchema },
  deviceCommand: {
    path: "/api/v1/devices",
    method: "post",
    input: deviceCommandSchema,
    output: resultSchema.extend({ locked: z.boolean().optional() }),
  },
  dependents: {
    path: "/api/v1/dependents",
    method: "get",
    output: dependentsSchema,
  },
  dependentCommand: {
    path: "/api/v1/dependents",
    method: "post",
    input: dependentCommandSchema,
    output: resultSchema,
  },
  aliases: { path: "/api/v1/aliases", method: "get", output: aliasesSchema },
  aliasCommand: {
    path: "/api/v1/aliases",
    method: "post",
    input: aliasCommandSchema,
    output: resultSchema,
  },
} as const;

import { IdentityError } from "./repository.js";
export const disclosure = {
  revision: "local-operator-v1",
  text: "This local Noola instance runs on the operator’s computer. The service operator can access application storage, account email capture, and backups. It does not provide secrecy from the operator. AI processing is unavailable and no external AI processor receives your information. Production hosting and email delivery require a new disclosure and validation.",
};
export const initialRules =
  "Each adult controls their own private information, settings, recovery, and consent. Sharing needs the required independent acceptances. Ownership, reading, editing, exporting, and wider disclosure are separate rights. Neither coordinator nor guardian status grants access to another adult’s private content. Either adult may decline these rules and keep personal account access. Guardian access to sensitive dependent information is read-only; the owner controls changes, export, and wider disclosure.";
export type Principal = {
  userId: string;
  name: string;
  email: string;
  membershipId: string;
  role: "owner" | "adult";
  sessionId: string;
  deviceId: string;
  mode: "shared" | "personal";
  label: string;
  lastActivity: Date;
};
export function requireOwner(principal: Principal) {
  if (principal.role !== "owner")
    throw new IdentityError(
      "forbidden",
      "This operation requires the household owner.",
    );
}
export function sessionDeadline(mode: string, lastActivity: Date) {
  return new Date(
    lastActivity.getTime() + (mode === "personal" ? 15 : 5) * 60000,
  );
}
export function canUseDependent(
  principal: Pick<Principal, "userId">,
  ownerId: string,
  acceptedGuardians: string[],
  operation: "read" | "edit" | "delete" | "export" | "disclose",
) {
  return (
    principal.userId === ownerId ||
    (operation === "read" && acceptedGuardians.includes(principal.userId))
  );
}

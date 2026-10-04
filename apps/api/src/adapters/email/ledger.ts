import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  randomUUID,
} from "node:crypto";
import type { Config } from "../../config.js";
import type { Connection } from "../../modules/identity/repository.js";
export type EmailKind = "invitation" | "verification" | "reset" | "recovery";
export function seal(value: unknown, secret: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv(
    "aes-256-gcm",
    createHash("sha256").update(secret).digest(),
    iv,
  );
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(value), "utf8"),
    cipher.final(),
  ]);
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString("base64");
}
export function unseal(value: string, secret: string): unknown {
  const data = Buffer.from(value, "base64");
  const decipher = createDecipheriv(
    "aes-256-gcm",
    createHash("sha256").update(secret).digest(),
    data.subarray(0, 12),
  );
  decipher.setAuthTag(data.subarray(12, 28));
  return JSON.parse(
    Buffer.concat([
      decipher.update(data.subarray(28)),
      decipher.final(),
    ]).toString("utf8"),
  );
}
export async function enqueueEmail(
  db: Connection,
  config: Config,
  kind: EmailKind,
  to: string,
  url: string | undefined,
  now: Date,
) {
  const id = randomUUID();
  await db.query(
    `INSERT INTO email_event (id,kind,state,payload,"expiresAt","createdAt","updatedAt") VALUES($1,$2,'queued',$3,$4,$5,$5)`,
    [
      id,
      kind,
      seal({ to, url }, config.AUTH_SECRET),
      new Date(
        now.getTime() +
          (kind === "invitation" ? config.INVITATION_HOURS : 1) * 3600000,
      ),
      now,
    ],
  );
  return id;
}
export function template(kind: EmailKind, url?: string) {
  const titles = {
    invitation: "Your invitation to Noola",
    verification: "Verify your Noola email",
    reset: "Reset your Noola password",
    recovery: "Your Noola password was reset",
  };
  const instructions = {
    invitation:
      "Choose your own password to create your account. This invitation expires in 24 hours. Your settings and permissions remain your choices.",
    verification:
      "Confirm your email address, then sign in with your password. This link expires in one hour.",
    reset:
      "Choose a new password. This link expires in one hour and can be used once. Your old sessions will be revoked.",
    recovery:
      "Your password was reset and your previous sessions were revoked. If you did not request this, use the recovery guide and secure your email account.",
  };
  return {
    subject: titles[kind],
    text: `${instructions[kind]}\n\n${url ?? ""}\n\nNoola will never ask you to share a password or recovery link.`,
  };
}

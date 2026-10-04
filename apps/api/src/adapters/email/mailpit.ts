import { z } from "zod";
import type { Config } from "../../config.js";
import { type EmailKind, template } from "./ledger.js";

const payloadSchema = z.object({ to: z.email(), url: z.url().optional() });
export type SendOutcome = "transport-accepted" | "failed" | "outcome-unknown";
export function mailpitTransport(config: Config) {
  return {
    async send(
      id: string,
      kind: EmailKind,
      payload: unknown,
    ): Promise<SendOutcome> {
      const data = payloadSchema.parse(payload);
      const content = template(kind, data.url);
      try {
        const response = await fetch(`${config.MAILPIT_URL}/api/v1/send`, {
          method: "POST",
          signal: AbortSignal.timeout(5000),
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            From: { Email: config.EMAIL_FROM, Name: "Noola" },
            To: [{ Email: data.to }],
            Subject: content.subject,
            Text: content.text,
            Headers: { "Message-ID": `<${id}@noola.test>` },
          }),
        });
        if (response.ok) return "transport-accepted";
        return response.status >= 400 && response.status < 500
          ? "failed"
          : "outcome-unknown";
      } catch {
        return "outcome-unknown";
      }
    },
    async reconcile(id: string): Promise<boolean> {
      try {
        const response = await fetch(
          `${config.MAILPIT_URL}/api/v1/search?query=${encodeURIComponent(`message-id:${id}@noola.test`)}`,
          { signal: AbortSignal.timeout(5000) },
        );
        if (!response.ok) return false;
        const data = z
          .object({ total: z.number() })
          .parse(await response.json());
        return data.total > 0;
      } catch {
        return false;
      }
    },
  };
}

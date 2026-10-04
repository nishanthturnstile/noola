import { expect, it } from "vitest";
import { parseEvidence } from "./evidence.js";

it("projects only approved evidence fields and rejects raw provider errors", () => {
  const result = parseEvidence(
    JSON.stringify({
      kind: "preflight",
      auth: "secret-canary",
      checks: [{ id: "pinned-cli", passed: true, detail: "private-canary" }],
    }),
  );
  expect(result).toEqual({
    kind: "preflight",
    checks: [{ id: "pinned-cli", passed: true }],
  });
  expect(parseEvidence("authentication-token-canary")).toBeNull();
  expect(
    parseEvidence(
      JSON.stringify({
        kind: "failure",
        reason: "provider said secret-canary",
      }),
    ),
  ).toBeNull();
});

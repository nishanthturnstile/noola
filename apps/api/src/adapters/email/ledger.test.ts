import { expect, it } from "vitest";
import { seal, unseal } from "./ledger.js";

it("protects credential payloads and rejects modified ciphertext or a different key", () => {
  const payload = {
    to: "synthetic@example.test",
    url: "http://localhost/reset#token=synthetic-secret",
  };
  const encrypted = seal(payload, "a".repeat(48));
  expect(encrypted).not.toContain("synthetic-secret");
  expect(unseal(encrypted, "a".repeat(48))).toEqual(payload);
  expect(() => unseal(encrypted, "b".repeat(48))).toThrow();
  const data = Buffer.from(encrypted, "base64");
  data[data.length - 1] = (data[data.length - 1] ?? 0) ^ 1;
  expect(() => unseal(data.toString("base64"), "a".repeat(48))).toThrow();
});

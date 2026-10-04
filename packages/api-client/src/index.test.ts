import { describe, expect, it } from "vitest";
import { createApiClient } from "./index.js";

function client(body: unknown, status = 200) {
  return createApiClient("http://example.test", async () =>
    Response.json(body, { status }),
  );
}
describe("runtime response validation", () => {
  it("accepts valid readiness and unavailable responses", async () => {
    expect(await client({ status: "ready" }).readiness()).toEqual({
      status: "ready",
    });
    expect(await client({ status: "unavailable" }, 503).readiness()).toEqual({
      status: "unavailable",
    });
  });
  it("rejects malformed successes and unexpected fields", async () => {
    await expect(client({ status: "wrong" }).readiness()).rejects.toThrow();
    await expect(
      client({ status: "ok", connection: "private" }).liveness(),
    ).rejects.toThrow();
  });
  it("rejects malformed failures and unexpected HTTP statuses", async () => {
    await expect(
      client({ error: "private" }, 503).readiness(),
    ).rejects.toThrow();
    await expect(
      client({ status: "ready" }, 500).readiness(),
    ).rejects.toThrow();
  });
});

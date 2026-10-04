import { describe, expect, it } from "vitest";
import { createApp } from "./app.js";

describe("health HTTP boundary", () => {
  it("reports liveness independently of the database", async () => {
    const app = createApp(async () => {
      throw new Error("secret connection details");
    });
    const live = await app.request("/api/health/live");
    expect(live.status).toBe(200);
    expect(await live.json()).toEqual({ status: "ok" });
    const ready = await app.request("/api/health/ready");
    expect(ready.status).toBe(503);
    expect(await ready.json()).toEqual({ status: "unavailable" });
    expect(ready.headers.get("cache-control")).toBe("no-store");
  });
  it("checks the database for readiness", async () => {
    let calls = 0;
    const response = await createApp(async () => {
      calls++;
    }).request("/api/health/ready");
    expect(calls).toBe(1);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "ready" });
  });
});

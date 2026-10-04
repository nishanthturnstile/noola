import { describe, expect, it } from "vitest";
import { canUseDependent, sessionDeadline } from "./policy.js";

describe("current dependent rights", () => {
  it("separates accepted guardian reading from owner changes, export, and disclosure", () => {
    const guardian = { userId: "guardian" };
    expect(canUseDependent(guardian, "owner", ["guardian"], "read")).toBe(true);
    for (const action of ["edit", "delete", "export", "disclose"] as const)
      expect(canUseDependent(guardian, "owner", ["guardian"], action)).toBe(
        false,
      );
    expect(canUseDependent({ userId: "owner" }, "owner", [], "export")).toBe(
      true,
    );
    expect(
      canUseDependent({ userId: "unaccepted" }, "owner", ["guardian"], "read"),
    ).toBe(false);
  });
  it("keeps application locks separate from the auth lifetime", () => {
    const time = new Date("2026-10-04T00:00:00Z");
    expect(sessionDeadline("shared", time).getTime() - time.getTime()).toBe(
      300000,
    );
    expect(sessionDeadline("personal", time).getTime() - time.getTime()).toBe(
      900000,
    );
  });
});

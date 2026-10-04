import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { expect, it } from "vitest";
import { z } from "zod";

it("retains the pinned upstream seccomp baseline with only reviewed namespace exceptions", async () => {
  const value: unknown = JSON.parse(
    await readFile(
      new URL(
        "../../../../../infra/docker/codex-spike/seccomp.json",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  const profile = z
    .object({ syscalls: z.array(z.unknown()) })
    .passthrough()
    .parse(value);
  const baseline = {
    ...z.record(z.string(), z.unknown()).parse(value),
    syscalls: profile.syscalls.slice(0, -3),
  };
  // Canonical JSON hash of Moby profiles seccomp/v0.2.1, before Noola exceptions.
  expect(
    createHash("sha256").update(JSON.stringify(baseline)).digest("hex"),
  ).toBe("afb4934b023cfceaaec1a9d752ca3f801aaa96eb2e59abe6e7ea16976948e080");
  expect(profile.syscalls.slice(-3)).toEqual([
    {
      names: ["clone"],
      action: "SCMP_ACT_ALLOW",
      args: [
        {
          index: 0,
          value: 268435456,
          valueTwo: 268435456,
          op: "SCMP_CMP_MASKED_EQ",
        },
      ],
    },
    {
      names: ["unshare"],
      action: "SCMP_ACT_ALLOW",
      args: [{ index: 0, value: 268435456, op: "SCMP_CMP_EQ" }],
    },
    { names: ["mount", "umount2", "pivot_root"], action: "SCMP_ACT_ALLOW" },
  ]);
});

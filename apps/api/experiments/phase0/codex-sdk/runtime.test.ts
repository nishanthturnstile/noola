import {
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, it } from "vitest";
import { cleanState, cliEnvironment } from "./runtime.js";

it("removes interrupted-run content, preserves native auth unchanged, then disconnects", async () => {
  const root = await mkdtemp(join(tmpdir(), "noola-codex-cleanup-"));
  try {
    await writeFile(join(root, "auth.json"), "synthetic-auth-canary");
    await mkdir(join(root, "sessions"));
    await writeFile(
      join(root, "sessions", "turn.jsonl"),
      "synthetic-private-content",
    );
    await writeFile(join(root, "log"), "synthetic-private-content");
    expect(await cleanState(root)).toEqual({
      contentRemoved: true,
      credentialRetained: true,
      removedEntryCount: 2,
      remainingEntryCount: 1,
    });
    expect(await readdir(root)).toEqual(["auth.json"]);
    expect(await readFile(join(root, "auth.json"), "utf8")).toBe(
      "synthetic-auth-canary",
    );
    await cleanState(root, true);
    expect(await readdir(root)).toEqual([]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
it("refuses symlinked state roots and credentials without touching their targets", async () => {
  const root = await mkdtemp(join(tmpdir(), "noola-codex-links-"));
  try {
    await mkdir(join(root, "state"));
    await writeFile(join(root, "outside"), "unrelated");
    await symlink(join(root, "state"), join(root, "link"));
    await expect(cleanState(join(root, "link"))).rejects.toThrow(
      "unsafe_state_root",
    );
    await symlink(join(root, "outside"), join(root, "state", "auth.json"));
    await expect(cleanState(join(root, "state"))).rejects.toThrow(
      "unsafe_auth_file",
    );
    expect(await readFile(join(root, "outside"), "utf8")).toBe("unrelated");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
it("constructs an allowlisted environment without inheriting provider or database credentials", () => {
  expect(Object.keys(cliEnvironment()).sort()).toEqual([
    "CODEX_CA_CERTIFICATE",
    "CODEX_HOME",
    "HOME",
    "LANG",
    "PATH",
    "TMPDIR",
  ]);
});

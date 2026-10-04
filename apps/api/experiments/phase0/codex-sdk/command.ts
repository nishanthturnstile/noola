import { spawn, spawnSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { type Evidence, parseEvidence } from "./evidence.js";
import { principalSchema } from "./harness.js";

const root = fileURLToPath(new URL("../../../../..", import.meta.url));
const local = resolve(root, ".codex-spike");
const args = process.argv.slice(2).filter((arg) => arg !== "--");
const locked = args[0] === "__locked";
if (locked) args.shift();
const command = args.shift();
const principal = principalSchema.parse(
  args[0] === "--principal" ? args[1] : "adult-a",
);
if (args.length && (args.length !== 2 || args[0] !== "--principal"))
  throw new Error("Invalid arguments");
if (
  !command ||
  !["preflight", "login", "live", "cleanup", "disconnect"].includes(command)
)
  throw new Error("Invalid command");
const containerName = `noola-codex-spike-${principal}-run`;
const env = { ...process.env, SPIKE_PRINCIPAL: principal };
const compose = [
  "compose",
  "--env-file",
  "/dev/null",
  "-p",
  "noola-codex-spike",
  "-f",
  resolve(root, "infra/docker/codex-spike/compose.yaml"),
];
const docker = (arguments_: string[]) =>
  spawnSync("docker", arguments_, {
    env,
    cwd: root,
    encoding: "utf8",
    timeout: 30_000,
  });
const evidence: Evidence[] = [];
async function run(arguments_: string[], timeout: number, capture = false) {
  const child = spawn("docker", arguments_, {
    env,
    cwd: root,
    stdio: capture ? ["ignore", "pipe", "inherit"] : "inherit",
  });
  let buffer = "";
  if (capture)
    child.stdout?.on("data", (chunk: Buffer) => {
      buffer += chunk.toString("utf8");
      if (buffer.length > 256_000) {
        child.kill("SIGKILL");
        return;
      }
      let newline = buffer.indexOf("\n");
      while (newline >= 0) {
        const parsed = parseEvidence(buffer.slice(0, newline));
        if (parsed) {
          evidence.push(parsed);
          console.info(JSON.stringify(parsed));
        }
        buffer = buffer.slice(newline + 1);
        newline = buffer.indexOf("\n");
      }
    });
  const timer = setTimeout(() => child.kill("SIGTERM"), timeout);
  const force = setTimeout(() => child.kill("SIGKILL"), timeout + 5_000);
  let interrupted: ReturnType<typeof setTimeout> | undefined;
  const interrupt = () => {
    child.kill("SIGTERM");
    interrupted ??= setTimeout(() => child.kill("SIGKILL"), 5_000);
  };
  process.once("SIGINT", interrupt);
  process.once("SIGTERM", interrupt);
  try {
    return await new Promise<number>((resolveCode) => {
      child.once("error", () => resolveCode(1));
      child.once("exit", (code) => resolveCode(code ?? 1));
    });
  } finally {
    clearTimeout(timer);
    clearTimeout(force);
    clearTimeout(interrupted);
    process.removeListener("SIGINT", interrupt);
    process.removeListener("SIGTERM", interrupt);
  }
}
async function removeOwnedContainer(name = containerName) {
  const inspection = docker([
    "inspect",
    "--format",
    '{{index .Config.Labels "dev.noola.experiment"}}',
    name,
  ]);
  if (inspection.status === 0) {
    if (inspection.stdout.trim() !== "codex-sdk")
      throw new Error("Container ownership mismatch");
    const removed = docker(["rm", "-f", name]);
    if (removed.status !== 0) throw new Error("Container cleanup failed");
  }
}
await mkdir(local, { recursive: true, mode: 0o700 });
if (!locked) {
  const result = spawnSync(
    "flock",
    [
      "--nonblock",
      "--conflict-exit-code",
      "75",
      resolve(local, "command.lock"),
      process.execPath,
      "--import",
      "tsx",
      fileURLToPath(import.meta.url),
      "__locked",
      command,
      "--principal",
      principal,
    ],
    { cwd: root, env, stdio: "inherit" },
  );
  if (result.status === 75) console.error("Another spike command is running.");
  process.exit(result.status ?? 1);
}
const volume = docker([
  "volume",
  "inspect",
  "--format",
  '{{index .Labels "dev.noola.experiment"}}',
  `noola-codex-spike-${principal}`,
]);
if (volume.status === 0 && volume.stdout.trim() !== "codex-sdk")
  throw new Error(
    "Refusing to use a volume without this experiment's ownership label",
  );

try {
  for (const p of ["adult-a", "adult-b"])
    await removeOwnedContainer(`noola-codex-spike-${p}-run`);
  if ((await run([...compose, "build", "probe"], 600_000)) !== 0)
    throw new Error("Spike image build failed");
  if ((await run([...compose, "run", "--rm", "init"], 30_000)) !== 0)
    throw new Error("State initialization failed");
  await removeOwnedContainer();
  process.exitCode = await run(
    [
      ...compose,
      "run",
      "--rm",
      "--no-deps",
      "--name",
      containerName,
      "probe",
      command,
    ],
    command === "login" ? 600_000 : command === "live" ? 960_000 : 120_000,
    command !== "login",
  );
} finally {
  await removeOwnedContainer();
  // Remove content left by a killed process without removing native auth, except on disconnect.
  const cleaned = docker([
    ...compose,
    "run",
    "--rm",
    "--no-deps",
    "probe",
    command === "disconnect" ? "disconnect" : "cleanup",
  ]);
  if (cleaned.status !== 0) {
    console.error(
      "Spike cleanup failed; inspect owned resources before retrying.",
    );
    process.exitCode = 1;
  }
  const cleanEvidence =
    cleaned.stdout
      ?.split("\n")
      .map(parseEvidence)
      .filter((value) => value !== null) ?? [];
  evidence.push(...cleanEvidence);
  if (command !== "login") {
    const image = docker([
      "image",
      "inspect",
      "--format",
      "{{.Id}}",
      "noola-codex-spike:0.160.0",
    ]);
    const commit = spawnSync("git", ["rev-parse", "HEAD"], {
      cwd: root,
      encoding: "utf8",
    });
    const dirty = spawnSync("git", ["status", "--porcelain"], {
      cwd: root,
      encoding: "utf8",
    });
    const path = resolve(local, `${command}-${principal}-${Date.now()}.json`);
    await writeFile(
      path,
      `${JSON.stringify(
        {
          recordedAt: new Date().toISOString(),
          command,
          principal,
          baseCommit: commit.stdout.trim(),
          workingTreeDirty: dirty.stdout.length > 0,
          imageId: image.stdout.trim(),
          exitCode: process.exitCode ?? 0,
          evidence,
        },
        null,
        2,
      )}\n`,
      { mode: 0o600 },
    );
    console.info(`Sanitized evidence: ${path}`);
  }
}

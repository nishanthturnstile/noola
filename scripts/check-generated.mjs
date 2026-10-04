import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const paths = [
  "packages/contracts/openapi.json",
  "packages/api-client/src/schema.d.ts",
  "apps/web/src/routeTree.gen.ts",
];
const before = paths.map((path) => readFileSync(path, "utf8"));
const result = spawnSync("pnpm", ["generate"], { stdio: "inherit" });
if (result.status !== 0) process.exit(result.status ?? 1);
const changed = paths.filter(
  (path, index) => readFileSync(path, "utf8") !== before[index],
);
if (changed.length) {
  console.error(
    `Generated artifacts were stale: ${changed.join(", ")}. Review and commit regenerated files.`,
  );
  process.exitCode = 1;
}

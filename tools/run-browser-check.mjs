import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
const file = process.argv[2] ?? "tools/browser-smoke.js";
const session = process.argv[3] ?? "elenita";
try {
  execFileSync(
    process.execPath,
    [
      resolve("node_modules/@playwright/cli/playwright-cli.js"),
      "-s=" + session,
      "run-code",
      readFileSync(file, "utf8"),
    ],
    { stdio: "inherit" },
  );
} catch {
  process.exit(1);
}

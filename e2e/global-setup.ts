import { execFileSync } from "node:child_process";

export default function globalSetup() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL missing: create .env.test (see README)");
  }
  execFileSync(process.execPath, ["db/seed.ts"], {
    stdio: "inherit",
    env: process.env,
  });
}

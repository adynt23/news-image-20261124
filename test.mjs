// Test: run main.ts twice into two dirs, check determinism, PNG gate.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, statSync } from "node:fs";

const repo = new URL(".", import.meta.url).pathname;
function run(out) {
  mkdirSync(out, { recursive: true });
  execFileSync("node", ["main.ts"], { cwd: repo, env: { ...process.env, MAKEFUN_OUTPUT_DIR: out }, stdio: "pipe" });
  return readFileSync(`${out}/entry.png`);
}
const a = run("/tmp/news24-run-a");
const b = run("/tmp/news24-run-b");
const ha = createHash("sha256").update(a).digest("hex");
const hb = createHash("sha256").update(b).digest("hex");
console.log("run A bytes:", a.length, "sha256:", ha);
console.log("run B bytes:", b.length, "sha256:", hb);
console.log("deterministic (identical bytes):", ha === hb);
console.log("PNG signature ok:", a[0] === 0x89 && a[1] === 0x50 && a[2] === 0x4e && a[3] === 0x47);
const w = a.readUInt32BE(16);
const h = a.readUInt32BE(20);
console.log("dimensions:", w + "x" + h);
console.log("under 1 MiB:", a.length <= 1048576);
console.log("under/equal 1024x1024:", w <= 1024 && h <= 1024);
if (!existsSync("/tmp/news24-run-a/entry.png")) { console.log("TEST FAIL: entry.png missing"); process.exit(1); }
const ok = ha === hb && a.length <= 1048576 && w === 1024 && h === 1024;
console.log(ok ? "TEST PASS" : "TEST FAIL");
if (!ok) process.exit(1);

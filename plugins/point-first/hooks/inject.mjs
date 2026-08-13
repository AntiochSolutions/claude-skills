// Prints the point-first rules into session context at SessionStart.
// SKILL.md is the single source; this script only strips frontmatter.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const skillPath = join(here, "..", "skills", "point-first", "SKILL.md");

let raw;
try {
  raw = readFileSync(skillPath, "utf8");
} catch {
  console.error(`point-first: could not read SKILL.md at ${skillPath}; rules not injected`);
  process.exit(0);
}

const body = raw.replace(/^---[\s\S]*?\n---\s*\n/, "");
console.log("point-first is active. Follow these rules in every reply this session:\n");
console.log(body);

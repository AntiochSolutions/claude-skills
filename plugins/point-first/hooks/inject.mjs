// Prints the point-first rules into session context at SessionStart.
// SKILL.md is the single source; this script only strips frontmatter.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const skillPath = join(here, "..", "skills", "point-first", "SKILL.md");
const body = readFileSync(skillPath, "utf8").replace(/^---[\s\S]*?\n---\s*\n/, "");
console.log("point-first is active. Every reply in this session follows these rules:\n");
console.log(body);

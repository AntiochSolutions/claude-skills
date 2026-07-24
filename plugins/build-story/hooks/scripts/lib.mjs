import { readFileSync, readdirSync, existsSync, statSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

export function readStdin() {
  return JSON.parse(readFileSync(0, "utf8"));
}

const DEFAULTS = {
  store: "backlog",
  testGlobs: ["**/*.test.*", "**/*.spec.*", "*.test.*", "*.spec.*", "tests/**", "test/**", "e2e/**"],
  alwaysAllow: ["**/*.md", "*.md", "docs/**", ".build-story.json", ".build-story/**", ".claude/**", ".gitignore", "package.json", "package-lock.json", "tsconfig*.json", "*.config.*", ".github/**", "*.yml", "*.yaml", "*.toml"],
  suitePatterns: ["npm test", "npm run test", "pnpm test", "yarn test", "npx vitest", "vitest run", "npx playwright test", "dotnet test", "pytest", "go test", "cargo test"],
};

export function loadConfig(cwd) {
  try {
    return { ...DEFAULTS, ...JSON.parse(readFileSync(join(cwd, ".build-story.json"), "utf8")) };
  } catch {
    return DEFAULTS;
  }
}

export function storeRoot(cwd, cfg) {
  const root = resolve(cwd, cfg.store);
  return existsSync(root) && statSync(root).isDirectory() ? root : null;
}

function walk(dir, visit) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    statSync(p).isDirectory() ? walk(p, visit) : visit(p);
  }
}

export function buildingStories(root) {
  const hits = [];
  walk(root, (f) => {
    if (!f.endsWith(".md")) return;
    const text = readFileSync(f, "utf8").replace(/^\uFEFF/, "");
    const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (fm && /^type:\s*story\s*$/m.test(fm[1]) && /^status:\s*building\s*$/m.test(fm[1])) {
      hits.push({ file: f, hasPlan: /^## Implementation plan\s*$/m.test(text) });
    }
  });
  return hits;
}

export const norm = (p) => p.replaceAll("\\", "/");
// Prefix comparisons fold case: on Windows the harness may hand a hook a file_path whose
// drive-letter or directory casing differs from cwd's, and a case-sensitive compare would
// silently disable the gate (fail-open). Folding trades that for a rare theoretical alias
// on case-sensitive filesystems — the right trade for a best-effort detection layer.
const fold = (p) => norm(p).toLowerCase();

export function matchesGlob(relPath, globs) {
  const p = norm(relPath);
  return globs.some((g) => {
    const rx = new RegExp(
      "^" + g.replaceAll(".", "\\.").replaceAll("**", "\u0001").replaceAll("*", "[^/]*").replaceAll("\u0001", ".*") + "$"
    );
    return rx.test(p) || rx.test(p.split("/").at(-1));
  });
}

export function relToProject(cwd, target) {
  const abs = resolve(cwd, target);
  const base = resolve(cwd);
  const rel = fold(abs).startsWith(fold(base) + "/") ? norm(abs).slice(norm(base).length + 1) : null;
  return rel; // null = outside the project; comparison case-folded (see `fold`)
}

const stateFile = (cwd) => join(cwd, ".build-story", "state.json");

export function readState(cwd) {
  try {
    return JSON.parse(readFileSync(stateFile(cwd), "utf8"));
  } catch {
    return {};
  }
}

export function writeState(cwd, patch) {
  mkdirSync(join(cwd, ".build-story"), { recursive: true });
  writeFileSync(stateFile(cwd), JSON.stringify({ ...readState(cwd), ...patch }, null, 2));
}

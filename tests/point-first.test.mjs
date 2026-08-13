// tests/point-first.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const HOOK = `${ROOT}/plugins/point-first/hooks/inject.mjs`;

test("inject.mjs prints the rules body without frontmatter", () => {
  const out = execFileSync("node", [HOOK], { encoding: "utf8" });
  assert.match(out, /# Point First/);
  assert.match(out, /## The restate protocol/);
  assert.match(out, /## Red flags/);
  assert.ok(!out.includes("\nname: point-first"), "frontmatter must be stripped");
  assert.ok(!out.trimStart().startsWith("---"), "must not start with frontmatter fence");
});

test("hooks.json wires SessionStart to inject.mjs", () => {
  const cfgPath = `${ROOT}/plugins/point-first/hooks/hooks.json`;
  assert.ok(existsSync(cfgPath), "hooks.json missing");
  const cfg = JSON.parse(readFileSync(cfgPath, "utf8"));
  const cmds = JSON.stringify(cfg.hooks?.SessionStart ?? []);
  assert.match(cmds, /inject\.mjs/);
  assert.match(cmds, /CLAUDE_PLUGIN_ROOT/);
});

test("all 7 fixtures carry the four required sections", () => {
  const dir = `${ROOT}/tests/fixtures/point-first`;
  const files = ["R1-point-first.md","R2-one-idea.md","R3-lists.md","R4-plain-words.md","R5-restate-cite.md","R6-benefit-human.md","R7-restate-protocol.md"];
  for (const f of files) {
    const text = readFileSync(`${dir}/${f}`, "utf8");
    for (const h of ["## Scenario","## Seeded fault","## Grader question","## Pass condition"]) {
      assert.ok(text.includes(h), `${f} missing ${h}`);
    }
  }
});

import test from "node:test";
import assert from "node:assert/strict";
import { join } from "node:path";
import { runHook, makeProject, editInput } from "./helper.mjs";

const deny = (r) => r.json?.hookSpecificOutput?.permissionDecision === "deny";
const reason = (r) => r.json?.hookSpecificOutput?.permissionDecisionReason ?? "";

test("store-less project: allows source edits", () => {
  const root = makeProject({ store: false });
  const r = runHook("plan-gate.mjs", editInput(root, "src/x.ts"));
  assert.equal(r.code, 0);
  assert.equal(deny(r), false);
});

test("store, no building story: denies source edit with no-story reason", () => {
  const root = makeProject({ storyStatus: "ready" });
  const r = runHook("plan-gate.mjs", editInput(root, "src/x.ts"));
  assert.equal(deny(r), true);
  assert.match(reason(r), /no story, no code/);
});

test("building story without plan: denies with plan-gate reason", () => {
  const root = makeProject({ storyStatus: "building", withPlan: false });
  const r = runHook("plan-gate.mjs", editInput(root, "src/x.ts"));
  assert.equal(deny(r), true);
  assert.match(reason(r), /Implementation plan/);
});

test("building story with plan: allows source edit", () => {
  const root = makeProject({ storyStatus: "building", withPlan: true });
  const r = runHook("plan-gate.mjs", editInput(root, "src/x.ts"));
  assert.equal(deny(r), false);
});

test("two building stories: denies as ambiguous", () => {
  const root = makeProject({ storyStatus: "building", withPlan: true, extraBuilding: true });
  const r = runHook("plan-gate.mjs", editInput(root, "src/x.ts"));
  assert.equal(deny(r), true);
  assert.match(reason(r), /more than one/i);
});

test("store-file edits always allowed", () => {
  const root = makeProject({ storyStatus: "ready" });
  const r = runHook("plan-gate.mjs", editInput(root, "backlog/Epic #01 - T/epic.md"));
  assert.equal(deny(r), false);
});

test("docs and markdown always allowed", () => {
  const root = makeProject({ storyStatus: "ready" });
  const r = runHook("plan-gate.mjs", editInput(root, "docs/notes.md"));
  assert.equal(deny(r), false);
});

test("config files always allowed (package.json)", () => {
  const root = makeProject({ storyStatus: "ready" });
  const r = runHook("plan-gate.mjs", editInput(root, "package.json"));
  assert.equal(deny(r), false);
});

test("case-mismatched project path still gates (no fail-open)", () => {
  const root = makeProject({ storyStatus: "ready" });
  const input = editInput(root, "src/x.ts");
  input.tool_input.file_path = join(root.toUpperCase(), "src", "x.ts");
  const r = runHook("plan-gate.mjs", input);
  assert.equal(deny(r), true);
});

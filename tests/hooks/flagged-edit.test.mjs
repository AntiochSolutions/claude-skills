import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { runHook, makeProject, editInput } from "./helper.mjs";

const ctx = (r) => r.json?.hookSpecificOutput?.additionalContext ?? "";
const post = (root, rel) => ({ ...editInput(root, rel), hook_event_name: "PostToolUse" });

test("test-file edit after plan: reminds of the flagged-edit protocol", () => {
  const root = makeProject({ storyStatus: "building", withPlan: true });
  const r = runHook("flagged-edit-reminder.mjs", post(root, "src/fee.test.ts"));
  assert.match(ctx(r), /flagged-edit|Deviations/);
});

test("source (non-test) edit: silent, but records lastSourceEditTs with the session", () => {
  const root = makeProject({ storyStatus: "building", withPlan: true });
  const r = runHook("flagged-edit-reminder.mjs", post(root, "src/fee.ts"));
  assert.equal(ctx(r), "");
  const state = JSON.parse(readFileSync(join(root, ".build-story", "state.json"), "utf8"));
  assert.ok(state.lastSourceEditTs > 0);
  assert.equal(state.lastSourceEditSession, "sess-1");
});

test("test-file edit before plan exists: silent (RED not started)", () => {
  const root = makeProject({ storyStatus: "building", withPlan: false });
  const r = runHook("flagged-edit-reminder.mjs", post(root, "src/fee.test.ts"));
  assert.equal(ctx(r), "");
});

test("store-less project: silent, writes no state", () => {
  const root = makeProject({ store: false });
  runHook("flagged-edit-reminder.mjs", post(root, "src/fee.test.ts"));
  assert.equal(existsSync(join(root, ".build-story", "state.json")), false);
});

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { runHook, makeProject } from "./helper.mjs";

const bash = (root, command, response) => ({
  hook_event_name: "PostToolUse", tool_name: "Bash", cwd: root, session_id: "sess-1",
  tool_input: { command }, tool_response: response,
});
const state = (root) => JSON.parse(readFileSync(join(root, ".build-story", "state.json"), "utf8"));

test("passing suite run recorded ok:true with the session", () => {
  const root = makeProject({ storyStatus: "building", withPlan: true });
  runHook("suite-recorder.mjs", bash(root, "npx vitest run", "Test Files  2 passed (2)\nTests  9 passed (9)"));
  assert.equal(state(root).lastSuiteRun.ok, true);
  assert.equal(state(root).lastSuiteRun.session, "sess-1");
});

test("failing suite run recorded ok:false", () => {
  const root = makeProject({ storyStatus: "building", withPlan: true });
  runHook("suite-recorder.mjs", bash(root, "npm test", "Tests  1 failed | 8 passed"));
  assert.equal(state(root).lastSuiteRun.ok, false);
});

test("passing run with a test NAMED 'handles failed payment' records ok:true", () => {
  const root = makeProject({ storyStatus: "building", withPlan: true });
  runHook("suite-recorder.mjs", bash(root, "npx vitest run", "✓ handles failed payment (3ms)\nTest Files  1 passed (1)\nTests  9 passed (9)"));
  assert.equal(state(root).lastSuiteRun.ok, true);
});

test("dotnet-style failure summary records ok:false", () => {
  const root = makeProject({ storyStatus: "building", withPlan: true });
  runHook("suite-recorder.mjs", bash(root, "dotnet test", "Failed!  - Failed:     1, Passed:     8, Skipped:     0"));
  assert.equal(state(root).lastSuiteRun.ok, false);
});

test("object-shaped tool_response: stringified with newlines restored, failure detected", () => {
  const root = makeProject({ storyStatus: "building", withPlan: true });
  runHook("suite-recorder.mjs", bash(root, "go test ./...", { stdout: "--- FAIL: TestQuote (0.00s)\nFAIL\nFAIL\tparkpal/fee\t0.012s" }));
  assert.equal(state(root).lastSuiteRun.ok, false);
});

test("non-suite command: no state written", () => {
  const root = makeProject({ storyStatus: "building", withPlan: true });
  runHook("suite-recorder.mjs", bash(root, "ls -la", "total 0"));
  assert.equal(existsSync(join(root, ".build-story", "state.json")), false);
});

test("store-less project: silent", () => {
  const root = makeProject({ store: false });
  runHook("suite-recorder.mjs", bash(root, "npm test", "1 passed"));
  assert.equal(existsSync(join(root, ".build-story", "state.json")), false);
});

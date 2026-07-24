import test from "node:test";
import assert from "node:assert/strict";
import { runHook, makeProject, writeTranscript, writeState } from "./helper.mjs";

const stopInput = (root, transcript, active = false, session = "sess-1") => ({
  hook_event_name: "Stop", cwd: root, session_id: session, stop_hook_active: active, transcript_path: transcript,
});
const blocked = (r) => r.json?.decision === "block";

test("claim without suite pass since last edit: blocks with reminder", () => {
  const root = makeProject({ storyStatus: "building", withPlan: true });
  writeState(root, { lastSourceEditTs: 2000, lastSourceEditSession: "sess-1", lastSuiteRun: { ts: 1000, ok: true, session: "sess-1" } });
  const t = writeTranscript(root, "S01 is built and all criteria are passing.");
  const r = runHook("stop-backstop.mjs", stopInput(root, t));
  assert.equal(blocked(r), true);
  assert.match(r.json.reason, /full suite|walk/i);
});

test("claim with suite pass after last edit: silent", () => {
  const root = makeProject({ storyStatus: "building", withPlan: true });
  writeState(root, { lastSourceEditTs: 1000, lastSourceEditSession: "sess-1", lastSuiteRun: { ts: 2000, ok: true, session: "sess-1" } });
  const t = writeTranscript(root, "S01 is built and all criteria are passing.");
  assert.equal(blocked(runHook("stop-backstop.mjs", stopInput(root, t))), false);
});

test("edits belong to another session: never fires (stale-state guard)", () => {
  const root = makeProject({ storyStatus: "building", withPlan: true });
  writeState(root, { lastSourceEditTs: 2000, lastSourceEditSession: "sess-old", lastSuiteRun: { ts: 1000, ok: true, session: "sess-old" } });
  const t = writeTranscript(root, "S01 is built and all criteria are passing.");
  assert.equal(blocked(runHook("stop-backstop.mjs", stopInput(root, t))), false);
});

test("suite pass from another session does not count: blocks", () => {
  const root = makeProject({ storyStatus: "building", withPlan: true });
  writeState(root, { lastSourceEditTs: 1000, lastSourceEditSession: "sess-1", lastSuiteRun: { ts: 2000, ok: true, session: "sess-other" } });
  const t = writeTranscript(root, "S01 is built and all criteria are passing.");
  assert.equal(blocked(runHook("stop-backstop.mjs", stopInput(root, t))), true);
});

test("claim line only inside a code block: silent (the fence strip is load-bearing)", () => {
  const root = makeProject({ storyStatus: "building", withPlan: true });
  writeState(root, { lastSourceEditTs: 2000, lastSourceEditSession: "sess-1", lastSuiteRun: { ts: 1000, ok: true, session: "sess-1" } });
  // The fenced content is a CLEAN claim (no forward markers) preceded by an ODD backtick
  // ("see `note") — the odd backtick defeats the inline-code strip's pairing, so ONLY the
  // fence strip removes the claim. A mutant lacking the fence strip leaks the claim into
  // prose and blocks, failing this test. (Verified by mutation at gate round 3.)
  const t = writeTranscript(root, "Status snapshot:\n```\nsee `note\nS01 is built and passing.\n```\nContinuing with AC3.");
  assert.equal(blocked(runHook("stop-backstop.mjs", stopInput(root, t))), false);
});

test("interrogative line is not a claim: silent", () => {
  const root = makeProject({ storyStatus: "building", withPlan: true });
  writeState(root, { lastSourceEditTs: 2000, lastSourceEditSession: "sess-1" });
  const t = writeTranscript(root, "Is S01 done and passing in your view?");
  assert.equal(blocked(runHook("stop-backstop.mjs", stopInput(root, t))), false);
});

test("forward-looking line is not a claim: silent", () => {
  const root = makeProject({ storyStatus: "building", withPlan: true });
  writeState(root, { lastSourceEditTs: 2000, lastSourceEditSession: "sess-1" });
  const t = writeTranscript(root, "Once S01 is complete we will run the walk and the full suite.");
  assert.equal(blocked(runHook("stop-backstop.mjs", stopInput(root, t))), false);
});

test("no source edits recorded: never fires", () => {
  const root = makeProject({ storyStatus: "building", withPlan: true });
  const t = writeTranscript(root, "S01 is built and passing.");
  assert.equal(blocked(runHook("stop-backstop.mjs", stopInput(root, t))), false);
});

test("stop_hook_active: exits silently (loop guard)", () => {
  const root = makeProject({ storyStatus: "building", withPlan: true });
  writeState(root, { lastSourceEditTs: 2000, lastSourceEditSession: "sess-1" });
  const t = writeTranscript(root, "S01 is built and passing.");
  assert.equal(blocked(runHook("stop-backstop.mjs", stopInput(root, t, true))), false);
});

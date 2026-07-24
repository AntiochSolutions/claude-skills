import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

export const SCRIPTS = fileURLToPath(
  new URL("../../plugins/build-story/hooks/scripts/", import.meta.url)
);

export function runHook(script, stdinObj) {
  const res = spawnSync(process.execPath, [join(SCRIPTS, script)], {
    input: JSON.stringify(stdinObj),
    encoding: "utf8",
  });
  // Every shipped hook exits 0 by design (deny/block travel as JSON, not exit codes).
  // Throwing here makes ALL tests fail in RED (missing script → spawn exits 1) and makes
  // a crashing script unable to masquerade as a silence-case pass in GREEN.
  if (res.status !== 0) throw new Error(`hook exited ${res.status}: ${res.stderr}`);
  let json = null;
  try { json = JSON.parse(res.stdout.trim()); } catch { /* non-JSON stdout = no decision */ }
  return { code: res.status, stdout: res.stdout, stderr: res.stderr, json };
}

const STORY = (id, status, plan) =>
  `---\nid: ${id}\ntype: story\nfeature: F01\ntitle: X\norder: 1\nstatus: ${status}\nkind: walking-skeleton\ntags: []\n---\n\n# ${id} — X\n\nAs a user, I can X, so that Y.\n${plan ? "\n## Implementation plan\n\n- approved plan\n" : ""}`;

export function makeProject({ store = true, storyStatus = "ready", withPlan = false, extraBuilding = false } = {}) {
  const root = mkdtempSync(join(tmpdir(), "bs-hook-"));
  if (store) {
    const dir = join(root, "backlog", "Epic #01 - T", "Features", "stories for #01 - F");
    mkdirSync(dir, { recursive: true });
    writeFileSync(
      join(root, "backlog", "Epic #01 - T", "epic.md"),
      "---\nid: E01\ntype: epic\ntitle: T\nstatus: refined\n---\n\n# E01 — T\n"
    );
    writeFileSync(join(dir, "Story #01 - X.md"), STORY("S01", storyStatus, withPlan));
    if (extraBuilding) writeFileSync(join(dir, "Story #02 - Y.md"), STORY("S02", "building", false));
  }
  return root;
}

export function writeTranscript(root, assistantText) {
  const p = join(root, "transcript.jsonl");
  const lines = [
    JSON.stringify({ type: "user", message: { role: "user", content: [{ type: "text", text: "go" }] } }),
    JSON.stringify({ type: "assistant", message: { role: "assistant", content: [{ type: "text", text: assistantText }] } }),
  ];
  writeFileSync(p, lines.join("\n") + "\n");
  return p;
}

export function writeState(root, state) {
  mkdirSync(join(root, ".build-story"), { recursive: true });
  writeFileSync(join(root, ".build-story", "state.json"), JSON.stringify(state));
}

export function editInput(root, relFile, tool = "Edit") {
  return { hook_event_name: "PreToolUse", tool_name: tool, cwd: root, session_id: "sess-1", tool_input: { file_path: join(root, relFile) } };
}

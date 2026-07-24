#!/usr/bin/env node
import { readStdin, loadConfig, storeRoot, buildingStories, matchesGlob, relToProject } from "./lib.mjs";

const input = readStdin();
const cwd = input.cwd || process.cwd();
const cfg = loadConfig(cwd);
const root = storeRoot(cwd, cfg);
const target = input.tool_input?.file_path || input.tool_input?.notebook_path || "";

const allow = () => process.exit(0);
const deny = (reason) => {
  console.log(JSON.stringify({
    hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: reason },
  }));
  process.exit(0);
};

if (!root || !target) allow();
const rel = relToProject(cwd, target);
if (rel === null) allow(); // outside the project — not this gate's business
const storeRel = relToProject(cwd, root);
if (rel === storeRel || rel.startsWith(storeRel + "/")) allow(); // store files always editable
if (matchesGlob(rel, cfg.alwaysAllow)) allow();

const building = buildingStories(root);
if (building.length === 0) {
  deny("build-story: no story is in building. Implementation starts from a ready story in the backlog store, through build-story — no story, no code.");
}
if (building.length > 1) {
  deny("build-story: more than one story is status: building — the claim is ambiguous. Release all but one (building → ready, reason in dialog) before editing source.");
}
if (!building[0].hasPlan) {
  deny("build-story: the building story has no ## Implementation plan section yet. Get plan approval (gate #1) first — the approved plan in the story file is what unlocks source edits.");
}
allow();

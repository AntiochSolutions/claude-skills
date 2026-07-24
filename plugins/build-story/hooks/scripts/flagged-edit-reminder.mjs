#!/usr/bin/env node
import { readStdin, loadConfig, storeRoot, buildingStories, matchesGlob, relToProject, writeState } from "./lib.mjs";

const input = readStdin();
const cwd = input.cwd || process.cwd();
const cfg = loadConfig(cwd);
const root = storeRoot(cwd, cfg);
if (!root) process.exit(0);
const target = input.tool_input?.file_path || input.tool_input?.notebook_path || "";
if (!target) process.exit(0);
const rel = relToProject(cwd, target);
const storeRel = relToProject(cwd, root);
if (rel === null || rel === storeRel || rel.startsWith(storeRel + "/") || matchesGlob(rel, cfg.alwaysAllow)) process.exit(0);

writeState(cwd, { lastSourceEditTs: Date.now(), lastSourceEditSession: input.session_id ?? null });

const building = buildingStories(root);
if (building.length === 1 && building[0].hasPlan && matchesGlob(rel, cfg.testGlobs)) {
  console.log(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "PostToolUse",
      additionalContext: "build-story flagged-edit protocol: you edited a check after the plan exists. Name, in dialog, which criterion this edit serves and why the previous check was wrong; record it in the Implementation report's Deviations section. Silent weakening is the cardinal defect.",
    },
  }));
}
process.exit(0);

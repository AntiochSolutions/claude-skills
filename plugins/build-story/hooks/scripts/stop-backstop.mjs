#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { readStdin, loadConfig, storeRoot, readState } from "./lib.mjs";

const input = readStdin();
if (input.stop_hook_active === true || input.stop_hook_active === "true") process.exit(0);
const cwd = input.cwd || process.cwd();
if (!storeRoot(cwd, loadConfig(cwd))) process.exit(0);
const state = readState(cwd);
if (!state.lastSourceEditTs) process.exit(0); // no source edits — planning turns never fire
const session = input.session_id ?? null;
if (state.lastSourceEditSession !== session) process.exit(0); // stale state from another session — never fire cross-session

let lastAssistant = "";
try {
  const lines = readFileSync(input.transcript_path, "utf8").trim().split("\n");
  for (let i = lines.length - 1; i >= 0; i--) {
    const entry = JSON.parse(lines[i]);
    const msg = entry.message ?? entry;
    const role = entry.type === "assistant" ? "assistant" : msg.role;
    if (role === "assistant") {
      const content = msg.content ?? [];
      lastAssistant = Array.isArray(content)
        ? content.filter((c) => c.type === "text").map((c) => c.text).join("\n")
        : String(content);
      if (lastAssistant) break;
    }
  }
} catch {
  process.exit(0);
}

const prose = lastAssistant.replace(/```[\s\S]*?```/g, "").replace(/`[^`]*`/g, "");
// A claim line: names a story ID + a completion word, is not a question, and is not
// forward-looking ("Once S01 is complete we will run the walk" is a plan, not a claim).
const claim = prose.split("\n").some(
  (line) =>
    !line.trim().endsWith("?") &&
    /\bS\d{2,}\b/.test(line) &&
    /\b(built|done|complete|completed|passing|finished)\b/i.test(line) &&
    !/\b(will|once|going to|about to|next|remains?|not yet|todo|pending|before)\b/i.test(line)
);
if (!claim) process.exit(0);

const ok = state.lastSuiteRun && state.lastSuiteRun.ok && state.lastSuiteRun.session === session && state.lastSuiteRun.ts >= state.lastSourceEditTs;
if (ok) process.exit(0);

console.log(JSON.stringify({
  decision: "block",
  reason: "build-story backstop: a completion claim was made for a story, but no full-suite pass is recorded since the last source edit. Run the full suite, the build/typecheck, and the story-kind walk before closing — then restate the claim.",
}));
process.exit(0);

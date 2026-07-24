#!/usr/bin/env node
import { readStdin, loadConfig, storeRoot, writeState } from "./lib.mjs";

const input = readStdin();
const cwd = input.cwd || process.cwd();
const cfg = loadConfig(cwd);
if (!storeRoot(cwd, cfg)) process.exit(0);
const cmd = input.tool_input?.command || "";
if (!cfg.suitePatterns.some((p) => cmd.includes(p))) process.exit(0);

const raw = input.tool_response;
// Object-shaped responses are stringified with escaped newlines restored, so line-anchored
// patterns (^FAIL) still see line starts.
const resp = typeof raw === "string" ? raw : JSON.stringify(raw ?? "").replace(/\\n/g, "\n");
// Anchor failure detection on summary shapes ("3 failed", line-start FAIL, dotnet "Failed!"),
// never on the bare word — a passing suite containing a test NAMED "handles failed payment"
// must record ok:true.
const failed =
  /\b[1-9]\d* fail(ed|ing)?\b/i.test(resp) || /^FAIL\b/m.test(resp) || /\bFailed!/.test(resp) ||
  /\bFailed:\s*[1-9]/.test(resp) || /✗|✘/.test(resp) || /exit code [1-9]/i.test(resp);
writeState(cwd, { lastSuiteRun: { ts: Date.now(), ok: !failed, session: input.session_id ?? null } });
process.exit(0);
